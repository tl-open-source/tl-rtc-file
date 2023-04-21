const sequelizeObj = require('sequelize');
const fs = require('fs');


async function excute(config) {
	let dbConf = config.db.mysql;

	let dbClient = new sequelizeObj(dbConf.dbName, dbConf.user, dbConf.password, dbConf.other.sequelize);
	
	try {
		let connect = await dbClient.authenticate();
		console.log('db connect ok ... ');
	} catch (e) {
		console.log('db connect err ...', e);
	}

	let tables = {}
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
			console.log(e);
		}
	}

	try {
		let res = await dbClient.sync({
			force: false
		});
		console.log("db sync ok ...");
	} catch (e) {
		console.log("db sync err : ",e);
	}

	return {
		tables,
		dbClient,
	};
}


module.exports = {
	excute
}
