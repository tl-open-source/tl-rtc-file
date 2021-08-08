const https = require('https'); // http
const socketIO = require('socket.io'); //socket
const app = require("express")(); //express
const fs = require('fs'); // fs
const db = require("./src/tables/db"); //db
const conf = require("./conf/cfg"); //conf
const utils = require("./utils/request"); //utils
const socket = require("./src/socket/index") //socket handler

let tables = {};
if(conf.db.open){
  // db init
  let {tables,sql,Sql} = db.excute(conf);
  app.use(async function (req,res,next) {
    req.ctx = {};
    req.ctx.tables = tables;
    req.ctx.sql = sql;
    req.ctx.Sql = Sql;
    await next();
  })
  console.log("db init...")
}


//log flow init --日志流水初始
app.use(async function (req,res,next) {  
  res.tl = {};
  res.tl.flowId = utils.genFlow();
  await next();
})
console.log("flow init...")


//Socket连接监听
let options = {
  key: fs.readFileSync('./conf/keys/server.key'),
  cert: fs.readFileSync('./conf/keys/server.crt')
}
let io = socketIO.listen(
  https.createServer(options).listen(conf.ws.ssl_port)
);
conf.ws.io = io;
socket.excute(tables,conf);
console.log("socket init...")


console.log("socket listen on ",conf.ws.ssl_port," successful");
