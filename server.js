const express = require("express"); //express
const conf = require("./conf/cfg"); //conf
const fileApiRouters = require("./src/router")(conf); //file routers
let resRouter = conf.router.res;
const fs = require('fs'); // fs
const https = require('https'); // http

let app = express();
console.log("【tl-rtc-file】resource including...")

//res
for(let key in resRouter) app.use(key,express.static(resRouter[key]));

//file api
for(let key in fileApiRouters) app.use(key,fileApiRouters[key])

let options = {
    key: fs.readFileSync('./conf/keys/server.key'),
    cert: fs.readFileSync('./conf/keys/server.crt')
}
https.createServer(options,app).listen(conf.node.port);

console.log("【tl-rtc-file】server runing on ",conf.node.port," successful");