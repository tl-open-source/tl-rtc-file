const sequelizeObj = require('sequelize');
const fs = require('fs');
const utils = require("../../src/utils/utils");
//db connect retry times
let connectRetryTimes = 0;

async function excute(config) {
	let dbConf = config.db.mysql;

	let dbClient = new sequelizeObj(
		dbConf.dbName, 
		dbConf.user, 
		dbConf.password,
		{
			"dialect": "mysql",
			"host": dbConf.host,
			"port": dbConf.port,
			"logging": false,
			"pool": {
				"max": 5,
				"min": 0,
				"acquire": 30000,
				"idle": 10000
			},
			"timezone": "+08:00",
			"define": {
				"freezeTableName": true,
				"underscored": true,
				"charset": "utf8",
				"collate": "utf8_general_ci",
				"timestamps": false,
				"paranoid": true
			}
		}
	);

	let tables = {}
	
	async function connectDb(){
		try {
			let connect = await dbClient.authenticate();
			utils.tlConsole('db connect ok ... ');

			let files = fs.readdirSync(__dirname);
			for (let f of files) {
				if (f[0] == '.' || f == 'db.js') continue;
				try {
					let fn = require('./' + f);
					if (typeof fn == 'function') {
						let ms = fn(dbClient, sequelizeObj);
						for (let k in ms) {
							tables[k] = ms[k];
						}
					}
				} catch (e) {
					utils.tlConsole(e);
				}
			}

			try {
				await dbClient.sync({ force: false });

				utils.tlConsole("db sync ok ...");
			} catch (e) {
				utils.tlConsole("db sync err : ",e);
			}
		} catch (e) {
			if(connectRetryTimes++ < 8){
				utils.tlConsole('db connect err, retrying ... ',e.message);
				await new Promise(resolve => setTimeout(resolve, connectRetryTimes * 3000));
				await connectDb();
				return;
			}
			utils.tlConsole('db connect err ',e);
		}
	}

	await connectDb();

	return {
		tables,
		dbClient,
	};
}


module.exports = {
	excute
}
