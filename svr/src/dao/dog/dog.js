const utils = require("../../utils/utils");
const dbOpen = require("../../../conf/cfg.json").db.open;


/**
 * 添加操作dog数据
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function addDogData(params, tables, dbClient) {
    try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

        let data = await tables.Dog.create({
            name: params.name,
            room_id: params.roomId,
            socket_id: params.socketId,
            device: params.device,
            flag: params.flag,
            content: params.content,
            handshake: params.handshake
        });
    
        return data && data.dataValues ? data.dataValues.id : 0;
    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 获取操作统计信息
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function getDogManageInfo(params, tables, dbClient) {
    try{
        if(!tables || !dbClient){
            return {};
        }

        if(!params){
            params = {};
        }

        let data = {
            transferFileToday: 0,
            transferFileAll: 0,
            transferFileSizeTodady: 0,
            transferTxtTodady: 0,
            transferTxtAll: 0,
            transferCommTxtToday: 0,
            transferCommTxtAll: 0,
            transferCodeFileToday: 0,
            transferCodeFileAll: 0,
            fileList: [],
            txtList: [],
            commTxtList: [],
            codeFileList : [],
        };

        let day;
        try {
            day = new Date(params.day)
        } catch (e) {
            day = new Date()
        }
        let chooseDay = utils.formateDateTime(day, "yyyy-MM-dd");
        let nextDay = utils.getNextDay(chooseDay);

        //某日传输聚合列表
        const [transferListToday, metadata] = await dbClient.query(`select name, room_id, content, created_at from dog where created_at >= "${chooseDay}" and created_at <= "${nextDay}" order by created_at desc`);

        //发送文件
        let fileTransferList = transferListToday.filter(element => {
            return element.name === '准备发送文件'
        })
        data.transferFileToday += fileTransferList.length;
        fileTransferList.forEach(element => {
            let content = JSON.parse(element.content);
            data.fileList.push({
                room: element.room_id || content.room,
                name: content.name,
                size: parseInt(content.size / 1024 / 1024) === 0 ? (content.size / 1024 / 1024).toFixed(2) : parseInt(content.size / 1024 / 1024),
                createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
            })
            data.transferFileSizeTodady += content.size
        })
        data.transferFileSizeTodady = parseInt(data.transferFileSizeTodady / 1024 / 1024)

        //发送文本内容
        let txtTransferList = transferListToday.filter(element => {
            return element.name === '发送文本内容'
        })
        data.transferTxtTodady += txtTransferList.length;
        txtTransferList.forEach(element => {
            let content = JSON.parse(element.content);
            data.txtList.push({
                room: element.room_id || content.room,
                content: utils.unescapeStr(content.content),
                size: content.content.length,
                createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
            })
        });


        //公共聊天室
        let commTxtTransferList = transferListToday.filter(element => {
            return element.name === '公共聊天室'
        })
        data.transferCommTxtToday += commTxtTransferList.length;
        commTxtTransferList.forEach(element => {
            data.commTxtList.push({
                room: element.room_id,
                content: element.content,
                size: element.content.length,
                createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
            })
        });


        //暂存文件列表
        let codeFileTransferList = transferListToday.filter(element => {
            return element.name === '添加取件码文件'
        })
        data.transferCodeFileToday += codeFileTransferList.length;
        codeFileTransferList.forEach(element => {
            let content = JSON.parse(element.content);
            data.codeFileList.push({
                room: element.room_id,
                name: element.name,
                code: content.ossFileId,
                type: content.type,
                size : utils.getFileSizeStr(content.size),
                createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
            })
        });


        //全部数量统计
        const [transferAll, metadata1] = await dbClient.query(`select name, count(*) as user from dog group by name`);
        transferAll.forEach(element => {
            if (element.name === '准备发送文件') {
                data.transferFileAll += element.user
            }
            if (element.name === '发送文本内容') {
                data.transferTxtAll += element.user
            }
            if (element.name === '公共聊天室') {
                data.transferCommTxtAll += element.user
            }
            if (element.name === '添加取件码文件') {
                data.transferCodeFileAll += element.user
            }
        })

        data.chooseDay = chooseDay;

        return data;
        
    }catch(e){
        console.error(e);
        return {}
    }
}



/**
 * 获取操作统计信息
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function getDogChatingCommInfo(params, tables, dbClient) {
    try{
        if(!tables || !dbClient){
            return [];
        }
        if(!params){
            params = {};
        }
        const limit = params.limit || 10;

        const sql = `select name, room_id, content, socket_id, created_at from dog where name = '公共聊天室' order by created_at desc limit ${limit}`;
        const [list,] = await dbClient.query(sql);

        let resultList = []
        list.forEach(element => {
            resultList.push({
                room: element.room_id,
                msg: element.content,
                socketId: element.socket_id,
                time: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
            })
        });

        resultList = resultList.reverse()

        return resultList;
    }catch(e){
        console.error(e);
        return [];
    }
}


module.exports = dbOpen ? {
    addDogData,
    getDogManageInfo,
    getDogChatingCommInfo,
} : {
    addDogData : () => {
        return {}
    },
    getDogManageInfo : () => {
        return {}
    },
    getDogChatingCommInfo : () => {
        return [];
    },
}