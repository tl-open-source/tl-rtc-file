const check = require("../../utils/check/content");

/**
 * 检查内容
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function checkContent(req, res) {
	try {
		let content = req.query.content;
		if(content.length > 1000){
			res.json({
				content: "内容过长"
			})
			return;
		}
		res.json({
			content: check.contentFilter(content)
		})
	} catch (err) {
		console.log(err);
		res.json({
			content: "",
			err : "系统繁忙"
		})
	}
}

module.exports = {
	checkContent
}