const http = require('http'); // http
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');
const db = require("./src/tables/db"); //db
const { inject_env_config, load_env_config } = require("./conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，注入配置
const conf = inject_env_config(require("./conf/cfg.json")); //conf
const socket = require("./src/socket/index") //socket handler
const utils = require("./src/utils/utils");

//打印logo
utils.tlConsoleIcon()

async function start(){
    // Socket连接监听
    let io = null;

    if(process.env.tl_rtc_file_env_mode == 'http'){
        io = socketIO.listen(http.createServer().listen(conf.ws.port));
    }else{
        let options = {
            key: fs.readFileSync('./conf/keys/server.key'),
            cert: fs.readFileSync('./conf/keys/server.crt')
        }
        io = socketIO.listen(
            https.createServer(options).listen(conf.wss.port)
        );
    }

    if (!conf.db.open) {// 没开db
        socket.excute({}, {}, io);
        utils.tlConsole("db not open ...")
    } else { // 开了db
        let { tables, dbClient } = await db.excute(conf)
        socket.excute(tables, dbClient, io);
        utils.tlConsole("db init done ...")
    }

    utils.tlConsole("socket init done ...")

    if(process.env.tl_rtc_file_env_mode == 'http'){
        utils.tlConsole("socket ",process.env.tl_rtc_file_env_mode," server listen on ", conf.ws.port, " successful");
    }else{
        utils.tlConsole("socket ",process.env.tl_rtc_file_env_mode," server listen on ", conf.wss.port, " successful");
    }
}


start();