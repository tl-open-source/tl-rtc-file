const express = require("express");
const { inject_env_config, load_env_config } = require("./conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，注入配置
const conf = inject_env_config(require("./conf/cfg.json"));
const fileApiRouters = require("./src/controller/router")();
const db = require("./src/tables/db"); //db
const utils = require("./src/utils/utils");
const fs = require('fs');
const https = require('https');
const resRouter = conf.api.router.res;

//打印logo
utils.tlConsoleIcon()

async function start() {
    let app = express();

    utils.tlConsole("api init start ...")

    if (!conf.db.open) {// 没开db
        app.use(async function (req, res, next) {
            req.ctx = {};
            req.ctx.tables = {};
            req.ctx.dbClient = {};
            await next();
        })
        utils.tlConsole("db not open ...")    
    }else{
        let { tables, dbClient } = await db.excute(conf)
        app.use(async function (req, res, next) {
            req.ctx = {};
            req.ctx.tables = tables;
            req.ctx.dbClient = dbClient;
            await next();
        })
        utils.tlConsole("db init done ...")
    }

    //file api
    for (let key in fileApiRouters) app.use(key, fileApiRouters[key])

    //res api v1
    for (let key in resRouter) app.use(key, express.static(resRouter[key]));

    //start server
    if(process.env.tl_rtc_file_env_mode === 'http'){
        app.listen(conf.api.port);
    }else {
        let options = {
            key: fs.readFileSync('./conf/keys/server.key'),
            cert: fs.readFileSync('./conf/keys/server.crt')
        }
        https.createServer(options,app).listen(conf.api.port);
    }

    utils.tlConsole("express init done ...")
    utils.tlConsole("api ",process.env.tl_rtc_file_env_mode," server runing on ", conf.api.port, " successful")
}


start();