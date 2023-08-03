const express = require("express");
const { inject_env_config } = require("./conf/env_config");
const conf = inject_env_config(require("./conf/cfg.json"));
const fileApiRouters = require("./src/controller/router")();
const db = require("./src/tables/db"); //db
const utils = require("./src/utils/utils");
const resRouter = conf.api.router.res;

//打印logo
utils.tlConsoleIcon()

let app = express();
utils.tlConsole("api init start ...")

if (!conf.db.open) {// 没开db

    app.use(async function (req, res, next) {
        req.ctx = {};
        req.ctx.tables = {};
        req.ctx.dbClient = {};
        await next();
    })

    //res
    for (let key in resRouter) app.use(key, express.static(resRouter[key]));
    //file api
    for (let key in fileApiRouters) app.use(key, fileApiRouters[key])

    app.listen(conf.api.port);
    utils.tlConsole("express init done ...")
    utils.tlConsole("api server runing on ", conf.api.port, " successful")
} else { // 开了db

    (async () => {
        let { tables, dbClient } = await db.excute(conf)
        utils.tlConsole("db init done ...")
        app.use(async function (req, res, next) {
            req.ctx = {};
            req.ctx.tables = tables;
            req.ctx.dbClient = dbClient;
            await next();
        })

        //res
        for (let key in resRouter) app.use(key, express.static(resRouter[key]));
        //file api
        for (let key in fileApiRouters) app.use(key, fileApiRouters[key])

        app.listen(conf.api.port);
        utils.tlConsole("express init done ...")
        utils.tlConsole("api server runing on ", conf.api.port, " successful")
    })();
}