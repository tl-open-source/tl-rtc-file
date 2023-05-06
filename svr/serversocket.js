const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');
const db = require("./src/tables/db");
const conf = require("./conf/cfg.json");
const socket = require("./src/socket/index")

//Socket连接监听
let options = {
	key: fs.readFileSync('./conf/keys/server.key'),
	cert: fs.readFileSync('./conf/keys/server.crt')
}
let io = socketIO.listen(
	https.createServer(options).listen(conf.ws.ssl_port)
);

if (!conf.db.open) {// 没开db

	console.log("db not open ...")
	socket.excute({}, {}, io);
	console.log("socket init done ...")
	console.log("socket server listen on ", conf.ws.port, " successful");

} else {// 开了db

	(async () => {
		let { tables, dbClient } = await db.excute(conf)
		console.log("db init done ...")
		socket.excute(tables, dbClient, io);
		console.log("socket init done ...")
		console.log("socket server listen on ", conf.ws.port, " successful");
	})();
}