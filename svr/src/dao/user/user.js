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

			return data && data.dataValues ? data.dataValues.id : 0;
		}

		if(users && users.length === 1){
			return users[0].dataValues.id;
		}

		return 0;
    }catch(e){
        console.error(e);
        return {};
    }
}



module.exports = dbOpen ? {
    addWxUser
} : {
	addWxUser : function(){
		return {}
	}
}