const express = require("express");
const conf = require("./conf/cfg.json");
const fileApiRouters = require("./src/controller/router")();
let resRouter = conf.router.res;
const db = require("./src/tables/db"); //db

let app = express();
console.log("api init start ...")

//res
for (let key in resRouter) {
    app.use(key, express.static(resRouter[key]));
}

//file api
for (let key in fileApiRouters) {
    app.use(key, fileApiRouters[key])
}

if (!conf.db.open) {// 没开db

    app.use(async function (req, res, next) {
        req.ctx = {};
        req.ctx.tables = {};
        req.ctx.dbClient = {};
        await next();
    })
    app.listen(conf.node.port);
    console.log("express init done ...")
    console.log("web server runing on ", conf.node.port, " successful");
} else { // 开了db

    (async () => {
        let { tables, dbClient } = await db.excute(conf)
        console.log("db init done ...")
        app.use(async function (req, res, next) {
            req.ctx = {};
            req.ctx.tables = tables;
            req.ctx.dbClient = dbClient;
            await next();
        })

        app.listen(conf.node.port);
        console.log("express init done ...")
        console.log("web server runing on ", conf.node.port, " successful");
    })();
}