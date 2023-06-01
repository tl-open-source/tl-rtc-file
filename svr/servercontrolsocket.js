const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');
const db = require("./src/tables/db");
const conf = require("./conf/cfg.json");
const socket = require("./src/socket/index")
const utils = require("./src/utils/utils");

//打印logo
utils.tlConsoleIcon()

//远程控制，Socket连接监听
let options = {
	key: fs.readFileSync('./conf/keys/server.key'),
	cert: fs.readFileSync('./conf/keys/server.crt')
}
let io = socketIO.listen(
	https.createServer(options).listen(conf.wss.control_port)
);

if (!conf.db.open) {// 没开db

	utils.tlConsole("db not open ...")
	socket.excute({}, {}, io);
	utils.tlConsole("control socket init done ...")
	utils.tlConsole("control socket server listen on ", conf.wss.control_port, " successful");

} else {// 开了db

	(async () => {
		let { tables, dbClient } = await db.excute(conf)
		utils.tlConsole("db init done ...")
		socket.excute(tables, dbClient, io);
		utils.tlConsole("control socket init done ...")
		utils.tlConsole("control socket server listen on ", conf.wss.control_port, " successful");
	})();
}