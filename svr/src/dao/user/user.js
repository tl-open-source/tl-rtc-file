const {inject_env_config} = require("../../../conf/env_config");
const cfg = inject_env_config(require("../../../conf/cfg.json"));
const sequelizeObj = require('sequelize');
const utils = require("../../utils/utils");
const dbOpen = cfg.db.open;

/**
 * 添加微信用户记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addWxUser(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
		
        if(!params){
            params = {};
        }

		let users = await tables.User.findAll({
			where: {
				type: 'wx',
				openid: params.openid,
			}
		});

		if(users && users.length === 0){
			let data = await tables.User.create({
				type: 'wx',
				openid: params.openid,
				avatar: params.avatar,
				uname : params.uname,
				pwd : params.pwd,
				solt : params.solt,
				role: params.role,
			});

			return data && data.dataValues ? dataValues : { id : 0 };
		}

		if(users && users.length === 1){
			return users[0].dataValues;
		}

		return { id : 0 };
    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 更新用户标识
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 */
async function updateUserFlag(params, tables, dbClient){
	if(!tables || !dbClient){
		return {};
	}
	
	if(!params){
		params = {};
	}

	if(!params.id){
		return {};
	}

	let data = await tables.User.update({
		flag: params.flag,
	}, {
		where: {
			id: params.id
		}
	});

	utils.tlConsole("更新用户标识 : ", params, data)

	return data;
}


module.exports = dbOpen ? {
    addWxUser, updateUserFlag
} : {
	addWxUser : function(){
		return {}
	},
	updateUserFlag : function(){
		return  {}
	}
}