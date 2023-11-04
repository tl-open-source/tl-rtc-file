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
const rtcChatingComm = require("./rtcChatingComm/chatingComm");
const rtcChatingRoom = require("./rtcChatingRoom/chatingRoom");
const rtcOpenai = require("./rtcOpenai/openai");
const rtcDraw = require("./rtcDraw/draw");
const rtcPrepareCodeFile = require("./rtcCodeFile/prepareCodeFile");
const rtcChangeNickName = require("./rtcChangeNickName/changeNickName")
const rtcHeartbeat = require("./rtcHeartbeat/heartbeat");
const rtcAddCodeFile = require("./rtcCodeFile/addCodeFile");
const rtcGetCodeFile = require("./rtcCodeFile/getCodeFile");
const rtcLocalNetRoom = require("./rtcLocalNetRoom/localNetRoom");
const rtcSubscribe = require("./rtcSubscribe/subscribe");
const rtcServerEvent = require("./rtcConstant").rtcServerEvent
const rtcToken = require("./rtcToken/token")


module.exports = (io, socket, tables, dbClient) => {

    // token关联处理
    rtcToken.token(io, socket, tables, dbClient, {});

    // 在线人数统计
    rtcCount.count(io, socket, tables, dbClient, {})

    // 断开连接
    socket.on(rtcServerEvent.disconnect, (data)=>{
        rtcDisConnect.disconnect(io, socket, tables, dbClient, data)
    });

    // webrtc offer 消息
    socket.on(rtcServerEvent.offer, (data) => {
        rtcOffer.offer(io, socket, tables, dbClient, data)
    });

    // webrtc answer 消息
    socket.on(rtcServerEvent.answer, (data) => {
        rtcAnswer.answer(io, socket, tables, dbClient, data)
    });

    // webrtc candidate 消息
    socket.on(rtcServerEvent.candidate, (data) => {
        rtcCandidate.candidate(io, socket, tables, dbClient, data)
    });

    // 在线人数统计
    socket.on(rtcServerEvent.count, (data) => {
        rtcCount.count(io, socket, tables, dbClient, data)
    });

    // 退出房间
    socket.on(rtcServerEvent.exit, (data) => {
        rtcExit.exit(io, socket, tables, dbClient, data)
    });

    // 获取初始数据
    socket.on(rtcServerEvent.getCommData, (data) => {
        rtcCommData.getCommData(io, socket, tables, dbClient, data)
    })

    // 创建或加入房间
    socket.on(rtcServerEvent.createAndJoin, (data) => {
        rtcCreateJoin.createJoin(io, socket, tables, dbClient, data)
    });

    // 管理后台登陆验证
    socket.on(rtcServerEvent.manageConfirm, (data) => {
        rtcManageConfirm.confirm(io, socket, tables, dbClient, data)
    });

    // 管理后台修改数据
    socket.on(rtcServerEvent.manageChange, (data) => {
        rtcManageChange.change(io, socket, tables, dbClient, data)
    });

    // 管理后台刷新
    socket.on(rtcServerEvent.manageReload, (data) => {
        rtcManageReload.reload(io, socket, tables, dbClient, data)
    });

    // 公共消息
    socket.on(rtcServerEvent.message, (data) => {
        rtcMessage.message(io, socket, tables, dbClient, data)
    });

    // 公共聊天频道
    socket.on(rtcServerEvent.chatingComm, (data) => {
        rtcChatingComm.chatingComm(io, socket, tables, dbClient, data)
    });

    // 房间内聊天,群聊/私聊
    socket.on(rtcServerEvent.chatingRoom, (data) => {
        rtcChatingRoom.chatingRoom(io, socket, tables, dbClient, data)
    });

    // openai聊天
    socket.on(rtcServerEvent.openai, (data) => {
        rtcOpenai.openai(io, socket, tables, dbClient, data)
    });

    // canvas画图
    socket.on(rtcServerEvent.draw, (data) => {
        rtcDraw.draw(io, socket, tables, dbClient, data)
    });

    // 准备添加取件码文件，获取上传链接
    socket.on(rtcServerEvent.prepareCodeFile, (data) => {
        rtcPrepareCodeFile.prepareCodeFile(io, socket, tables, dbClient, data)
    });

    // 添加取件码文件
    socket.on(rtcServerEvent.addCodeFile, (data) => {
        rtcAddCodeFile.addCodeFile(io, socket, tables, dbClient, data)
    });

    // 获取取件码文件
    socket.on(rtcServerEvent.getCodeFile, (data) => {
        rtcGetCodeFile.getCodeFile(io, socket, tables, dbClient, data)
    });

    // 心跳
    socket.on(rtcServerEvent.heartbeat, (data) => {
        rtcHeartbeat.heartbeat(io, socket, tables, dbClient, data)
    });

    // 修改昵称
    socket.on(rtcServerEvent.changeNickName, (data) => {
        rtcChangeNickName.changeNickName(io, socket, tables, dbClient, data)
    });

    // 订阅网站通知
    socket.on(rtcServerEvent.subscribeNofity, (data) => {
        rtcSubscribe.subscribeNofity(io, socket, tables, dbClient, data)
    });

    // 局域网房间发现列表
    socket.on(rtcServerEvent.localNetRoom, (data)=>{
        rtcLocalNetRoom.localNetRoomForConnect(io, socket, tables, dbClient, data)
    });
}