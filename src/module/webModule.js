
/**
 * 添加模块数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function add(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let info = params.info || {};

     let addInfo = {};
     Object.assign(addInfo,info.id)
     Object.assign(addInfo,info.uname)
     Object.assign(addInfo,info.name)
     Object.assign(addInfo,info.flag)
     Object.assign(addInfo,info.other)
     Object.assign(addInfo,info.content)

     let data = await ctx.tables.Module.create(addInfo);

     if(res){
          res.json(data)
     }else {
          return data;
     }
}

/**
 * 更新模块数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function set(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let info = params.info || {};
     let matcher = params.matcher || {};

     let upInfo = {};
     Object.assign(upInfo,info.id)
     Object.assign(upInfo,info.uname)
     Object.assign(upInfo,info.name)
     Object.assign(upInfo,info.flag)
     Object.assign(upInfo,info.other)
     Object.assign(upInfo,info.content)

     let matcherInfo = {};
     Object.assign(matcherInfo,matcher.id)

     let data = await ctx.tables.Module.update(upInfo,{
           where : matcherInfo
      });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 获取模块数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function get(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let matcher = params.matcher || {};

     let matcherInfo = {};
     Object.assign(matcherInfo,matcher.id)

     let data = await ctx.tables.Module.findAll({
           where : matcherInfo
      });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 删除模块数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function del(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let matcher = params.matcher || {};

     let matcherInfo = {};
     Object.assign(matcherInfo,matcher.id)

     let data = await ctx.tables.Module.destroy({
           where : matcherInfo
      });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}

module.exports = {
     add,set,get,del
}