const http = require('http'); // http
const socketIO = require('socket.io'); //socket
const db = require("./src/tables/db"); //db
const { inject_env_config } = require("./conf/env_config");
const conf = inject_env_config(require("./conf/cfg.json")); //conf
const socket = require("./src/socket/index") //socket handler
const utils = require("./src/utils/utils");

//打印logo
utils.tlConsoleIcon()

// Socket连接监听
let io = socketIO.listen(http.createServer().listen(conf.ws.port));

if (!conf.db.open) {// 没开db
	
	utils.tlConsole("db not open ...")
	socket.excute({}, {}, io);
	utils.tlConsole("socket init done ...")
	utils.tlConsole("socket server listen on ", conf.ws.port, " successful");
} else { // 开了db

	(async () => {
		let { tables, dbClient } = await db.excute(conf)
		utils.tlConsole("db init done ...")
		socket.excute(tables, dbClient, io);
		utils.tlConsole("socket init done ...")
		utils.tlConsole("socket server listen on ", conf.ws.port, " successful");
	})();
}