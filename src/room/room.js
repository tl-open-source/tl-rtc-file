
const utils = require("../../utils/request");

/**
 * 获取房主信息 by uid rname 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getOwnerRoomByUid(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let data = {};

     //加入之前需要获取房间信息给客户端
     data = await ctx.tables.Room.findOne({
          where : {
               uid : params.uid,
               rname : params.rname,
               status : 0 //有开启的房间
          }
     });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 获取房间成员信息 by rname
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getJoinRoomByName(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let data = {};

     //加入之前需要获取房间信息给客户端
     data = await ctx.tables.Room.findOne({
          where : {
               rname : params.rname,
               status : 0 //有开启的房间
          }
     });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 获取房间信息 by rname
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getRoomByName(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let data = {};
     
     data = await ctx.tables.Room.findAll({
          where : {
            rname : params.rname,
            status : 0
          }
     });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 创建房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function addOwnerRoom(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};
     let data = {};

     data = await ctx.tables.Room.create({
          uid : params.uid,
          uname : params.uname,
          rcode : utils.genRoom(),
          rname : params.rname,
          sid : params.sid,
          ip : params.ip,
          device : params.device,
          url : params.url,
          content : params.content
     });

     if(res){
          res.json(data)
     }else {
          return data;
     }
}

/**
 * 加入房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function addJoinRoom(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};

     let data = await ctx.tables.Room.create({
          rcode : utils.genRoom(),
          rname : params.rname,
          sid : params.sid,
          ip : params.ip,
          device : params.device,
          url : params.url,
          content : params.content
     });
     
     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 更新房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function updateRoom(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};

     let data = await ctx.tables.Room.update({
         status : 1
     },{
          where : {
               id : params.id
          }
     });
     
     if(res){
          res.json(data)
     }else {
          return data;
     }
}


/**
 * 更新房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function updateRoomBySid(req,res,next) {
     let ctx = req.ctx || {};
     let params = req.params || {};

     let data = await ctx.tables.Room.update({
         status : 1
     },{
          where : {
               sid : params.sid
          }
     });
     
     if(res){
          res.json(data)
     }else {
          return data;
     }
}


module.exports = {
     getRoomByName,
     getOwnerRoomByUid,
     getJoinRoomByName,
     addOwnerRoom,
     addJoinRoom,
     updateRoom,
     updateRoomBySid
}