const room = require("../room/room");
const template = require("./template");
const SocketHandler = template.SocketHandler;
const Worker = require("./../worker/worker").Worker; //worker


let tables = {};
let exitSocketList = [];            //退房的socket

/**
 * 开个定时器跑，清除已经离开房间的数据
 */
function cleanExitSocketData(){
    async function removeRoomSokect(){
        if(exitSocketList == null || !(exitSocketList instanceof Array)){
            return;
        }
        if(exitSocketList.length <= 0){
            return;
        }
        for(let i = 0; i < exitSocketList.length; i++){
            await exitRoom({sid : exitSocketList.shift()})
        }
    }
    let cusWorker = new Worker(24 * 60 * 60 * 1000,removeRoomSokect);
    cusWorker.run();
}


/**
 * 执行器
 * @param {*} tabs 
 * @param {*} config 
 */
function excute(tabs = {}, config = {}) {
    init(config);
    tables = tabs;
}


/**
 * 参数初始化
 * @param {*} config 
 */
function init(config) {
    let io = config.ws.io;
    if (io === undefined || io === null) {
        console.error("init socket error ");
        return;
    }
  
    //前置执行函数
    if (config.ws.beforeInit) {
        config.ws.beforeInit();
    }
  
    listen(io);
    cleanExitSocketData();
  
    //后置执行函数
    if (config.ws.afterInit) {
        config.ws.afterInit();
    }
}


/**
 * 监听函数
 * @param {*} io 
 */
function listen(io) {
    io.sockets.on('connection', function (socket) {
  
        var handler = new SocketHandler(io.sockets,socket);

        socket.on('disconnect',async function (reason) {
            handler._disconnect({});
            // exitSocketList.push(socket.id);
            // if(exitSocketList.length > 1000){
            //     new Worker(24 * 60 * 60 * 1000,removeRoomSokect);
            //     cusWorker.run();
            // }
        });
        

        socket.on('createAndJoin', async function (message) {
            let room = message.room;
            let recoderId = 1;

            handler._createAndJoin(message,{
                created : {recoderId:recoderId},
                joined : {recoderId:recoderId}
            })
        });
    
    
        socket.on('offer', function (message) {
            handler._offer(message,{})
        });
        
        socket.on('answer', function (message) {
            handler._answer(message,{})
        });
    
    
        
        socket.on('candidate', function (message) {
            handler._candidate(message,{})
        });
  
  
      
        socket.on('exit', async function (message) {
            let recoderId = message.recoderId;
            handler._exit(message,{})
            if(recoderId != undefined){
                exitSocketList.push(socket.id);
            }
        });
  
        socket.on('exist', async function (message) {
            let room = message.room;

            let data = {};
            data.success = true;
            data.msg = "ok";
            data.room = room;
    
            socket.emit('exist', data);
        })
  
  
        socket.on('catchError', function (err) {
            console.log('err : ', err)
        })
        

        socket.on('chating', function (message) {
            handler._chating(message,{})
        })

        socket.on('count', function (message) {
            handler._count(message,{})
        })


        socket.on('message', function (message) {
            handler._message(message,{})
        })
  
    });
}


/**
 * 房间是否存在
 * @param {*} data 
 */
async function isRoomExist(data) {
    let req = {
        ctx: {
            tables: tables
        },
        params: {
            rname: data.roomName,
        }
    };

    let rooms = await room.getRoomByName(req, null);
    return rooms.length > 0;
}
  
  
/**
 * 首次创房数据入库
 * @param {*} data 
 */
async function createRoom(data) {
    let req = {
        ctx: {
            tables: tables
        },
        params: {
            uid: data.uid,
            uname: data.uname,
            rname: data.roomName,
            sid: data.socketId,
            ip: data.ip,
            device: data.device,
            url: data.url,
            content: JSON.stringify(data.content)
        }
    };

    let res = await room.addOwnerRoom(req, null);
    return res.dataValues.id;
}
  
  
/**
 * 加入房间
 * @param {*} data 
 */
async function joinRoom(data) {
    let req = {
        ctx: {
            tables: tables
        },
        params: {
            uid: data.uid, 
            uname: data.uname,
            rname: data.roomName,
            sid: data.socketId,
            ip: data.ip,
            device: data.device,
            url: data.url,
            content: JSON.stringify(data.content)
        }
    };
    let res = await room.addJoinRoom(req, null);
    return res.dataValues.id;
}
  
  
/**
 * 退出房间
 * @param {*} data 
 */
async function exitRoom(data) {
    let req = {
        ctx: {
            tables: tables
        },
        params: {
            sid: data.sid
        }
    };
    let res = await room.updateRoomBySid(req, null);
    return 0;
}


function addWorker(){
    
}


module.exports = {
    excute : excute
}