const http = require('http'); // http
const socketIO = require('socket.io'); //socket
const express = require("express"); //express
const conf = require("./conf/cfg.json"); //conf
const db = require("./src/tables/db"); //db
const utils = require("./src/utils/utils"); //utils
const socket = require("./src/socket/index") //socket handler
const fileApiRouters = require("./src/router")(conf); //file routers
let resRouter = conf.router.res;
let app = express()
let tables = {};
let sql = {};


// router init
console.log("【tl-rtc-file-dev】router init...")
for(let key in resRouter) app.use(key,express.static(resRouter[key]));
for(let key in fileApiRouters) app.use(key,fileApiRouters[key])
app.listen(conf.node.port);

console.log("【tl-rtc-file-dev】server runing on ",conf.node.port," successful");


// db init
if(conf.db.open){
  console.log("【tl-rtc-file-dev】db init...")
  let dbData = db.excute(conf);
  tables = dbData.tables;
  sql = dbData.sql;
  
  app.use(async function (req,res,next) {
    req.ctx = {};
    req.ctx.tables = tables;
    req.ctx.sql = sql;
    req.ctx.Sql = Sql;
    await next();
  })
}


//flow init --日志流水初始
console.log("【tl-rtc-file-dev】flow init...")
app.use(async function (req,res,next) {  
  res.tl = {};
  res.tl.flowId = utils.genFlow();
  await next();
})


//socket init
console.log("【tl-rtc-file-dev】socket init...")
let io = socketIO.listen(
  http.createServer().listen(conf.ws.port)
);
conf.ws.io = io;
socket.excute(tables, sql, conf);


console.log("【tl-rtc-file-dev】socket listen on ",conf.ws.port," successful");