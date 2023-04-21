const dog = require("./../../dao/dog/dog");

/**
 * 操作记录
 * @param {*} data 
 */
async function dogData(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: data
    };
    let res = 0;
    
    try {
        res = await dog.addDogData(req, null);
    } catch (e) {
        console.log(e)
    }

    return res && res.dataValues ? res.dataValues.id : 0
}



/**
 * 获取最近10条公共聊天室数据
 * @param {*} data 
 */
async function getDogChating10Info(data) {
    let req = {
        ctx: {
            tables: data.tables,
            dbClient: data.dbClient
        }
    };

    return await dog.getDogChating10Info(req, null);
}

/**
 * 获取操作数据信息
 * @param {*} data 
 * @returns 
 */
async function getDogManageInfo(data){
    let req = {
        ctx: {
            tables: data.tables,
            dbClient: data.dbClient,
            sockets: data.sockets
        },
        params: {
            limit: 10,
            day: data.day,
        }
    }
    return await dog.getDogManageInfo(req, null);
}


module.exports = {
    dogData,
    getDogChating10Info,
    getDogManageInfo
}