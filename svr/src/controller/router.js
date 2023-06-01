const fs = require('fs');
const path = require('path');
const cfg = require("../../conf/cfg.json");
const utils = require("../../src/utils/utils");

module.exports = () => {
	let routers = {};
	let dirs = fs.readdirSync(__dirname);
	for (let file of dirs) {
		//过滤文件夹和文件
		if (cfg.api.router.filter.whiteDir.includes(file) 
			|| cfg.api.router.filter.whiteFile.includes(file)) continue;
		try {
			//添加router
			let stat = fs.statSync(path.join(__dirname, file, 'index.js'));
			if (stat && stat.isFile()) {
				routers["/api/" + file] = require("./" + file + '/index')();
			}
		} catch (e) {
			utils.tlConsole(e);
		}
	}
	return routers;
}