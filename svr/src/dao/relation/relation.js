const {inject_env_config} = require("../../../conf/env_config");
const cfg = inject_env_config(require("../../../conf/cfg.json"));
const sequelizeObj = require('sequelize');
const utils = require("../../utils/utils");
const dbOpen = cfg.db.open;


/**
 * 关联type类型
 */
const RelationType = {
    USER_ROOM : 1, // 用户-房间号
    USER_DOG : 2, // 用户-操作
    USER_FILE : 3, // 用户-文件
}

/**
 * 添加关联记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addRelation(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
		
        if(!params){
            params = {};
        }

		let data = await tables.Relation.create({
			type: params.type,
			source_id: params.source_id,
			target_id: params.target_id,
			flag: params.flag,
		});
		
		return data && data.dataValues ? data.dataValues.id : 0;
    }catch(e){
        console.error(e);
        return {};
    }
}



/**
 * 添加用户-房间号关联记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addUserRoomRelation(params, tables, dbClient) {
	try{
        
        return await addRelation({
            type: RelationType.USER_ROOM,
            source_id: params.userId,
            target_id: params.roomId,
            flag: 0,
        }, tables, dbClient);

    }catch(e){
        console.error(e);
        return {};
    }
}



/**
 * 添加用户-操作关联记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addUserDogRelation(params, tables, dbClient) {
	try{
        
        return await addRelation({
            type: RelationType.USER_DOG,
            source_id: params.userId,
            target_id: params.dogId,
            flag: 0,
        }, tables, dbClient);

    }catch(e){
        console.error(e);
        return {};
    }
}



/**
 * 添加用户-文件关联记录
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addUserFileRelation(params, tables, dbClient) {
	try{
        
        return await addRelation({
            type: RelationType.USER_FILE,
            source_id: params.userId,
            target_id: params.fileId,
            flag: 0,
        }, tables, dbClient);

    }catch(e){
        console.error(e);
        return {};
    }
}


module.exports = dbOpen ? {
    addRelation, addUserDogRelation, addUserFileRelation, addUserRoomRelation
} : {
	addRelation : function(){
		return {}
	},
    addUserDogRelation : function(){
        return {}
    },
    addUserFileRelation : function(){
        return {}
    },
    addUserRoomRelation : function(){
        return {}
    }
}