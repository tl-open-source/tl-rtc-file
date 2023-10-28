const dogDao = require('../../dao/dog/dog.js');

/**
 * @description 获取问题列表
 */
async function getQuestionList(req, res){
    try {
		
        const list = await dogDao.getDogSendBugInfo({
            limit : 30
        }, req.ctx.tables, req.ctx.dbClient);

        res.json({
            questionList : list,
            code : 200,
            msg : "ok"
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
    getQuestionList
}