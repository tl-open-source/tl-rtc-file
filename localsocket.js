const http = require('http'); // http
const socketIO = require('socket.io'); //socket
const db = require("./src/tables/db"); //db
const conf = require("./conf/cfg.json"); //conf
const socket = require("./src/socket/index") //socket handler

// Socket连接监听
let io = socketIO.listen(http.createServer().listen(conf.ws.port));

if (!conf.db.open) {// 没开db
	
	console.log("db not open ...")
	socket.excute({}, {}, io);
	console.log("socket init done ...")
	console.log("socket server listen on ", conf.ws.port, " successful");
} else { // 开了db

	(async () => {
		let { tables, dbClient } = await db.excute(conf)
		console.log("db init done ...")
		socket.excute(tables, dbClient, io);
		console.log("socket init done ...")
		console.log("socket server listen on ", conf.ws.port, " successful");
	})();
}