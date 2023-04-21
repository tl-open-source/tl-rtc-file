const fs = require('fs');
const path = require('path');
const cfg = require("../../conf/cfg.json");

module.exports = () => {
	let routers = {};
	let handlerConf = cfg.router.filter;
	let dirs = fs.readdirSync(__dirname);
	for (let file of dirs) {
		//过滤文件夹和文件
		if (handlerConf.whiteDir.includes(file) || handlerConf.whiteFile.includes(file)) continue;
		try {
			//添加router
			let stat = fs.statSync(path.join(__dirname, file, 'index.js'));
			if (stat && stat.isFile()) {
				routers["/api/" + file] = require("./" + file + '/index')();
			}
		} catch (e) {
			console.log(e);
		}
	}
	return routers;
}