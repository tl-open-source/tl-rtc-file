const rtcDisConnect = require("./rtcDisConnect/disconnect");
const rtcOffer = require("./rtcOffer/offer");
const rtcAnswer = require("./rtcAnswer/answer");
const rtcCandidate = require("./rtcCandidate/candidate");
const rtcCount = require("./rtcCount/count");
const rtcExit = require("./rtcExit/exit");
const rtcCommData = require("./rtcCommData/commData");
const rtcCreateJoin = require("./rtcCreateJoin/createJoin");
const rtcManageConfirm = require("./rtcManage/confirm");
const rtcManageChange = require("./rtcManage/change");
const rtcManageReload = require("./rtcManage/reload");
const rtcMessage = require("./rtcMessage/message");
const rtcChating = require("./rtcChating/chating");
const rtcOpenai = require("./rtcOpenai/openai");

module.exports = (io, socket, tables, dbClient) => {

    rtcCount.count(io, socket, tables, dbClient, {})

    // 断开连接
    socket.on('disconnect', (data)=>{
        rtcDisConnect.disconnect(io, socket, tables, dbClient, data)
    });

    // webrtc offer 消息
    socket.on('offer', (data) => {
        rtcOffer.offer(io, socket, tables, dbClient, data)
    });

    // webrtc answer 消息
    socket.on('answer', (data) => {
        rtcAnswer.answer(io, socket, tables, dbClient, data)
    });

    // webrtc candidate 消息
    socket.on('candidate', (data) => {
        rtcCandidate.candidate(io, socket, tables, dbClient, data)
    });

    // 在线人数统计
    socket.on('count', (data) => {
        rtcCount.count(io, socket, tables, dbClient, data)
    });

    // 退出房间
    socket.on('exit', (data) => {
        rtcExit.exit(io, socket, tables, dbClient, data)
    });

    // 获取初始数据
    socket.on("getCommData", (data) => {
        rtcCommData.commData(io, socket, tables, dbClient, data)
    })

    // 创建或加入房间
    socket.on('createAndJoin', (data) => {
        rtcCreateJoin.createJoin(io, socket, tables, dbClient, data)
    });

    // 管理后台登陆验证
    socket.on('manageConfirm', (data) => {
        rtcManageConfirm.confirm(io, socket, tables, dbClient, data)
    });

    // 管理后台修改数据
    socket.on('manageChange', (data) => {
        rtcManageChange.change(io, socket, tables, dbClient, data)
    });

    // 管理后台刷新
    socket.on('manageReload', (data) => {
        rtcManageReload.reload(io, socket, tables, dbClient, data)
    });

    // 公共消息
    socket.on('message', (data) => {
        rtcMessage.message(io, socket, tables, dbClient, data)
    });

    // 公共聊天频道
    socket.on('chatingComm', (data) => {
        rtcChating.chating(io, socket, tables, dbClient, data)
    });

    // openai聊天
    socket.on('openai', (data) => {
        rtcOpenai.openai(io, socket, tables, dbClient, data)
    });
}