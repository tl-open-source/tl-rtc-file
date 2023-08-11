const {inject_env_config} = require("../../../conf/env_config");
const cfg = inject_env_config(require("../../../conf/cfg.json"));
const sequelizeObj = require('sequelize');
const utils = require("../../utils/utils");
const dbOpen = cfg.db.open;

/**
 * 添加取件码记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addCodeFile(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }
		
		if(!params.code){
			return {}
		}

		let files = await tables.File.findAll({
			where: {
				code: params.code,
			}
		});

		if(files && files.length > 0){
			return {}
		}

		let data = await tables.File.create({
			room_id: params.roomId,
			code: params.code,
			name : params.name,
			oss_name : params.ossName,
			download: params.download,
			content: params.content,
		});

		return data && data.dataValues ? data.dataValues.id : 0;

    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 获取取件码记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function getCodeFile(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		if(!params.code){
			return {};
		}
		
		let files = await tables.File.findAll({
			where: {
				code: params.code,
			}
		});
	
		if (!files || files.length === 0) {
			return {}
		}
	
		let file = files[0]
	
		let content = JSON.parse(file.content)
		
		let data = {
			name : file.name,
			code: file.code,
			download : file.download,
			type : content.type,
			size : content.size,
			fromNickName : content.nickName,
			fromRoom : content.room,
			createTime: utils.formateDateTime(new Date(file.createdAt), "yyyy-MM-dd hh:mm:ss"),
		}

		return data;

    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 根据文件名称前缀搜索文件
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function searchCodeFile(req, res, next) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		if(!params.name){
			return [];
		}

		let files = await tables.File.findAll({
			where: {
				name: {
					[sequelizeObj.Op.like] : '%' + params.name + '%'
				}
			}
		});

		if (!files || files.length === 0) {
			return []
		}

		files.forEach(file => {
			let content = JSON.parse(file.content);
			list.push({
				name : file.name,
				code: file.code,
				download : file.download,
				type : content.type,
				createTime: utils.formateDateTime(new Date(file.createdAt), "yyyy-MM-dd hh:mm:ss"),
			})
		});

		return list;

    }catch(e){
        console.error(e);
        return [];
    }
}


module.exports = dbOpen ? {
    addCodeFile, getCodeFile, searchCodeFile
} : {
	addCodeFile : function(){
		return {}
	},
	getCodeFile : function(){
		return {}
	},
	searchCodeFile : function(){
		return []
	}
}