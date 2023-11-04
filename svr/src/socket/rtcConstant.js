
/**
 * 服务端监听事件
 * event事件名称
 */
const rtcServerEvent = {
    //socket连接
    connection : "connection",
    //socket断开连接
    disconnect : "disconnect",
    //webrtc offer
    offer : "offer",
    //webrtc answer
    answer : "answer",
    //webrtc candidate
    candidate : "candidate",
    //在线人数
    count : "count",
    //退出
    exit : "exit",
    //获取初始化数据
    getCommData : "getCommData",
    //加入/创建房间
    createAndJoin : "createAndJoin",
    //检查管理员房间密码
    manageConfirm : "manageConfirm",
    //管理员修改数据
    manageChange : "manageChange",
    //管理员刷新页面数据
    manageReload : "manageReload",
    //通用公共消息
    message : "message",
    //公共聊天
    chatingComm : "chatingComm",
    //chatgpt
    openai : "openai",
    //canvas画图
    draw : "draw",
    //房间内聊天, 群聊/私聊
    chatingRoom : "chatingRoom",
    //准备添加取件码文件，获取上传链接
    prepareCodeFile : "prepareCodeFile",
    //添加取件码文件
    addCodeFile : "addCodeFile",
    //获取取件码文件
    getCodeFile : "getCodeFile",
    //心跳
    heartbeat : "heartbeat",
    //修改昵称
    changeNickName : "changeNickName",
    //订阅网站通知
    subscribeNofity : "subscribeNofity",
    //局域网房间发现列表
    localNetRoom : "localNetRoom",
}

/**
 * 服务端监听事件
 * message event子事件
 */
let rtcServerMessageEvent = {
    //准备发送文件
    sendFileInfo : "sendFileInfo",
    //发送文件完毕
    sendDone : "sendDone",
    //反馈bug
    sendBugs : "sendBugs",
    //开始录屏
    startScreen : "startScreen",
    //结束录屏
    stopScreen : "stopScreen",
    //开始屏幕共享
    startScreenShare : "startScreenShare",
    //结束共享
    stopScreenShare : "stopScreenShare",
    //开始音视频
    startVideoShare : "startVideoShare",
    //结束音视频
    stopVideoShare : "stopVideoShare",
    //开始语音连麦
    startAudioShare : "startAudioShare",
    //结束语音连麦
    stopAudioShare : "stopAudioShare",
    //开始直播
    startLiveShare : "startLiveShare",
    //结束直播
    stopLiveShare : "stopLiveShare",
    //开始远程画笔
    startRemoteDraw : "startRemoteDraw",
    //结束远程画笔
    stopRemoteDraw : "stopRemoteDraw"
}

/**
 * 客户端监听事件
 * event事件名称
 */
let rtcClientEvent = {
    //创建房间
    created : "created",
    //加入房间
    joined : "joined",
    //webrtc offer
    offer : "offer",
    //webrtc answer
    answer : "answer",
    //webrtc candidate
    candidate : "candidate",
    //退出
    exit : "exit",
    //人数
    count : "count",
    //提示
    tips : "tips",
    //ai回复
    openaiAnswer : "openaiAnswer",
    //初始化数据
    commData : "commData",
    //公共聊天
    chatingComm : "chatingComm",
    //检查管理员房间密码
    manageCheck : "manageCheck",
    //管理员页面
    manage : "manage",
    //画图
    draw : "draw",
    //房间内聊天, 群聊/私聊
    chatingRoom : "chatingRoom",
    //准备添加取件码文件，获取上传链接
    prepareCodeFile : "prepareCodeFile",
    //添加取件码文件
    addCodeFile : "addCodeFile",
    //获取取件码文件
    getCodeFile : "getCodeFile",
    //心跳
    heartbeat : "heartbeat",
    //修改昵称
    changeNickName : "changeNickName",
    //局域网房间发现列表
    localNetRoom : "localNetRoom",
    //订阅网站通知
    subscribeNofity : "subscribeNofity"
}

/**
 * 客户端监听事件
 * message event子事件
 */
let rtcClientMessageEvent = {
    //准备发送文件
    sendFileInfo : "sendFileInfo",
    //准备接受文件
    sendFileInfoAck : "sendFileInfoAck",
    //停止屏幕共享
    stopScreenShare : "stopScreenShare",
    // 停止音视频
    stopVideoShare : "stopVideoShare",
    //停止直播
    stopLiveShare : "stopLiveShare",
}


module.exports = {
    rtcServerEvent, rtcServerMessageEvent,
    rtcClientEvent, rtcClientMessageEvent,
}