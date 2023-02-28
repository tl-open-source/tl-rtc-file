const https = require('https'); // http
const fs = require('fs'); // fs
const socketIO = require('socket.io'); //socket
const express = require("express"); //express
const conf = require("./conf/cfg.json"); //conf
const db = require("./src/tables/db"); //db
const utils = require("./src/utils/utils"); //utils
const socket = require("./src/socket/index") //socket handler
const fileApiRouters = require("./src/router")(conf); //file routers
let resRouter = conf.router.res;
let tables = {};
let sql = {};
let options = {
  key: fs.readFileSync('./conf/keys/server.key'),
  cert: fs.readFileSync('./conf/keys/server.crt')
}
let app = express()


// router init
console.log("【tl-rtc-file-svr】router init...")
for(let key in resRouter) app.use(key,express.static(resRouter[key]));
for(let key in fileApiRouters) app.use(key,fileApiRouters[key])
https.createServer(options,app).listen(conf.node.port);

console.log("【tl-rtc-file-svr】server runing on ",conf.node.port," successful");


// db init
if(conf.db.open){
  console.log("【tl-rtc-file-svr】db init...")
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


// flow init
console.log("【tl-rtc-file-svr】flow init...")
app.use(async function (req,res,next) {  
  res.tl = {};
  res.tl.flowId = utils.genFlow();
  await next();
})


// socket init
console.log("【tl-rtc-file-svr】socket init...")
let io = socketIO.listen(
  https.createServer(options).listen(conf.ws.ssl_port)
);
conf.ws.io = io;
socket.excute(tables, sql, conf);


console.log("【tl-rtc-file-svr】socket listen on ",conf.ws.ssl_port," successful");