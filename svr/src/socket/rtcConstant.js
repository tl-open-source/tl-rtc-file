
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
    openai : "openai"
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
    //发送文本
    sendTxt : "sendTxt",
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
    //开始直播
    startLiveShare : "startLiveShare",
    // 结束直播
    stopLiveShare : "stopLiveShare",
    //开始密码房间
    startPasswordRoom : "startPasswordRoom",
    //添加取件码文件
    addCodeFile : "addCodeFile",
    //获取取件码文件
    getCodeFile : "getCodeFile",
    //ai聊天
    openaiChat : "openaiChat",
    //初始化数据
    commData : "commData"
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
    //取件码
    codeFile : "codeFile",
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
    //发送文本
    sendChatingRoom : "sendChatingRoom",
    //停止屏幕共享
    stopScreenShare : "stopScreenShare",
    // 停止音视频
    stopVideoShare : "stopVideoShare",
    //停止直播
    stopLiveShare : "stopLiveShare",
}


/**
 * 服务端监听事件
 * message event子事件名称
 */
let rtcServerMessageEventOpName = {
    "sendFileInfo": "准备发送文件",
    "sendDone": "文件发送完毕",
    "sendBugs": "收到问题反馈",
    "sendTxt": "发送文本内容",
    "startScreen": "开始网页录屏",
    "stopScreen": "停止网页录屏",
    "startScreenShare": "开始屏幕共享",
    "stopScreenShare": "停止屏幕共享",
    "startVideoShare": "开始音视频通话",
    "stopVideoShare": "停止音视频通话",
    "startLiveShare": "开启直播",
    "stopLiveShare": "关闭直播",
    "startPasswordRoom": "创建密码房间",
    "addCodeFile": "添加取货码文件",
    "getCodeFile" : "取件码取件",
    "openaiChat" : "ChatGPT聊天",
    "chatingComm" : "公共聊天室"
}


module.exports = {
    rtcServerEvent, rtcServerMessageEvent, rtcServerMessageEventOpName,
    rtcClientEvent, rtcClientMessageEvent
}