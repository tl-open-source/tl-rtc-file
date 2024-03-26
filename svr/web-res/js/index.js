// --------------------------- //
// --       index.js        -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //


// index.js
var file = null;

// 是否禁用中继
let useTurn = (window.localStorage.getItem("tl-rtc-file-use-relay") || "") === 'true';
// 是否是自定义ws地址
let useCustomWsHost = window.localStorage.getItem("tl-rtc-file-custom-ws-host") || "";
// 接收是否文件持久到indexedDb
let useIndexedDb = (window.localStorage.getItem("tl-rtc-file-receive-file-use-indexed-db") || "") === 'true';
// 是否使用自定义持久化房间号
let useFixedRoom = window.localStorage.getItem("tl-rtc-file-use-fixed-room") || "";
// 是否开启局域网房间被发现
let useLocalNetworkRoomShare = (window.localStorage.getItem("tl-rtc-file-use-local-network-room-share") || "true") === 'true';
// 是否开启消息红点
let useMessageDot = (window.localStorage.getItem("tl-rtc-file-use-message-dot") || "true") === 'true';
// 是否开启浏览器系统消息通知
let useWebMsgNotify = (window.localStorage.getItem("tl-rtc-file-use-web-msg-notify") || "") === 'true';

axios.get("/api/comm/initData?turn="+useTurn, {}).then(async (initData) => {
    let { data : {
        code, login, 
        token : userToken, 
        avatar, 
        username,
        subscribeNotify
    } } = await axios.get("/api/login/state");

    let resData = initData.data;

    file = new Vue({
        el: '#tl-rtc-file-app',
        data: function () {
            let socket = null;
            if (io) {
                if(useCustomWsHost){
                    resData.wsHost = useCustomWsHost;
                }
                socket = io(resData.wsHost,{
                    transports : ['polling', 'websocket'],
                    query: {
                        token : userToken || ""
                    }
                });
            }
            return {
                langMode : "zh", // 默认中文
                lang : {}, // 语言包
                logo : resData.logo, // 打印logo
                version : resData.version,// 项目当前版本
                socket: socket, // socket
                config: resData.rtcConfig, // rtc配置
                options: resData.options, // rtc配置
                wsHost : resData.wsHost, // ws地址
                useCustomWsHost : useCustomWsHost, // 自定义ws地址
                
                showReceiveFile: false, // 展示底部接收文件列表
                showSendFile: false, // 展示底部发送文件列表
                showChooseFile: false, // 展示底部已选文件列表
                showSendFileHistory: false, // 展示底部发送文件历史记录列表
                showReceiveTxt: false, // 展示底部接收文字列表
                showCodeFile: false, // 展示底部取件码文件列表
                showLogs: false, // 展示运行日志列表
                showMedia: false, // 展示音视频/屏幕共享/直播面板
                showLocalNetRoom: false, // 展示局域网房间列表
                isScreenShare: false, //是否在屏幕共享中
                screenShareTimes: 0,  //当前屏幕共享时间
                isVideoShare: false, //是否在音视频中
                videoShareTimes: 0,  //当前音视频时间
                isLiveShare: false, //是否在直播中
                liveShareTimes: 0,  //当前直播时间
                isAudioShare: false, //是否在语音连麦中
                audioShareTimes: 0, //当前语音连麦时间
                isPasswordRoom: false, //是否在密码房中
                isAiAnswering: false, //是否ai正在回答中
                switchDataGet: false, // 是否已经拿到配置开关数据
                openaiSendContext: false, // ai对话是否发送上下文
                allSended: false,//当前文件是否全部发送给房间内所有用户
                isSending: false, //是否正在发送文件中
                owner : false, //本人是否是房主
                isJoined: false, // 是否加入房间
                isLogin: code === 200 && login, // 是否登录
                openRoomInput : false, //是否打开房间号输入框
                isShareJoin : false, //是否是分享加入房间
                isCameraEnabled : true,  //音视频场景下自己的摄像头是否开启
                isAudioEnabled : true, //音视频场景下自己的麦克风是否开启
                isLoudspeakerEnabled : true, //音视频场景下自己的扬声器是否开启
                useLogOutput : true, //是否输出日志, 默认输出日志
                chatCommFilterGood : false, // 是否展示公共聊天频道的精选消息
                chatCommFilterTop : false, // 是否展示公共聊天频道的置顶消息
                useWebMsgNotify: useWebMsgNotify, //是否开启网页消息通知
                useMessageDot : useMessageDot, //是否关闭消息提示红点, 默认开启
                useFixedRoom: useFixedRoom, //是否使用自定义房间号，持久化，后续自动进入房间
                useIndexedDb : useIndexedDb, // 是否需要将文件保存到indexedDb
                useLocalNetworkRoomShare : useLocalNetworkRoomShare, //是否开启局域网房间被发现, 默认开启
                facingMode : "user", //音视频场景下自己的摄像头前后置 ,user, environment
                videoDeviceId : "", //音视频场景下自己的摄像头设备id
                audioDeviceId : "", //音视频场景下自己的麦克风设备id
                loudspeakerDeviceId : "", //音视频场景下自己的扬声器设备id

                sendFileMaskHeightNum: 150, // 用于控制发送文件列表面板展示
                chooseFileMaskHeightNum: 150, // 用于控制选择文件列表面板展示
                sendFileHistoryMaskHeightNum: 150, // 用于控制发送文件记录列表面板展示
                receiveFileMaskHeightNum: 150,// 用于控制接收文件列表面板展示
                codeFileMaskHeightNum : 150, // 用于控制暂存文件展示
                localNetRoomMaskHeightNum : 150, // 用于控制局域网房间列表展示

                logMaskHeightNum: -150, // 用于控制日志栏展示
                mediaVideoMaskHeightNum: -150, // 用于控制音视频展示
                mediaScreenMaskHeightNum: -150, // 用于控制屏幕共享展示
                mediaLiveMaskHeightNum: -150, // 用于控制直播展示
                mediaAudioMaskHeightNum: -150, // 用于控制语音连麦展示

                logsHeight: 0, // 日志栏目展示高度
                sendFileRecoderHeight : 0, // 发送文件展示列表高度
                chooseFileHeight: 0, // 已选文件展示列表高度
                sendFileRecoderHistoryHeight : 0, // 发送文件历史记录展示列表高度
                receiveFileHeight : 0, // 接收文件展示列表高度
                codeFileHeight : 0, // 暂存文件展示列表高度
                localNetRoomListHeight : 0, //局域网房间列表展示高度

                allManCount: 0, // 当前在线人数
                txtEditId: 0, // 文字模式输入框id
                nickName: "", //本人名称
                socketId: 0, //本人的id
                roomId: "10086", //房间号
                roomType : "file", //房间类型 video, live, audio ,file, password
                liveShareMode : "video", //直播类型 video, screen
                liveShareRole : "owner", //直播身份 owner: 主播, viwer:观众
                codeId: "", //取件码
                recoderId: 0, //记录id
                rtcConns: {}, //远程连接
                remoteMap: {}, //远程连接map
                switchData: {}, //配置开关数据
                chatRoomSingleSocketId : "", //私聊对方的socketId
                avatar : avatar || "/image/44826979.png", //用户登录头像
                username : username || " -- ", //用户登录昵称
                subscribeNotify : subscribeNotify || false, //是否已经订阅过网站

                chunkSize: 16 * 1024, // 一块16kb 最大应该可以设置到64kb
                currentSendAllSize: 0, // 统计发送文件总大小 (流量统计)
                fileInfoBufferHeaderLen : 256, //分片文件信息头大小 默认256byte
                uploadCodeFileProgress: 0, // 上传暂存文件的进度
                previewFileMaxSize : 1024 * 1024 * 5, // 5M以内允许预览
                uploadCodeFileMaxSize : 1024 * 1024 * 10, // 10M以内允许暂存
                socketHeartbeatFaild : 0, //socket心跳失败次数
                bigFileMaxSize: 20 * 1024 * 1024, //并发发送时大文件认定规则
                bigFileMaxCount: 1, //并发发送时大文件认定规则
                longFileQueueMaxSize: 10, //并发发送时，长列表认定规则
                maxLogCount : 300, // 最大日志记录数
                loadIndexedFileAllSize : 0, //加载indexedDb中的所有文件大小总和
                receivedFileAllSize : 0, //接收到的文件大小总和
                systemMsgCacheTime: 1000 * 60 * 60 * 24, //系统房间消息缓存时间

                chooseFileRecoderAutoNext : false, //是否是一键发送模式下的自动排队发送
                chooseFileRecoderList : [], //当前进行发送的文件记录列表 (多记录并行发送多文件)
                chooseFileList: [], //选择的文件列表
                sendFileRecoderList: [], //发送文件的列表
                sendFileRecoderHistoryList: [], //发送过文件的列表记录
                receiveFileRecoderList: [], //接收文件的列表
                receiveChatRoomList: [], //接收的文字列表
                receiveCodeFileList: [], //取件码文件列表
                receiveChatCommList: [], //公共聊天频道内容
                receiveAiChatList: [], //ai对话内容
                logs: [],  //记录日志
                popUpList: [], //消息数据
                localNetRoomList : [], //局域网房间列表
                preMouseMove : {}, //上一次鼠标移动的事件
                ips: [], // 记录ip列表
                popUpMsgDom : [], // 消息弹窗dom
                videoDeviceList : [], //摄像头设备列表
                audioDeviceList : [], //麦克风设备列表
                loudspeakerDeviceList : [], //扬声器设备列表
                systemRoomList : resData.systemRoomList || [], //系统房间列表

                userToken : userToken, //用户登录token
                token: "", //后台登录token
                manageIframeId: 0, //实现自适应
                useTurn: useTurn, //是否使用中继服务器
                aiAnsweringTxtIntervalId: 0, //实现等待动画
                aiAnsweringTxt: "思考中...", //ai思考中的文字
                logsFilter: "", //日志过滤参数
                checkWxLoginIntervalId: 0, //检测微信登录状态轮训id
                checkWxLoginCount: 0, // 检测微信登录状态轮训次数, 超过50次则停止（50 * 1.5s = 1min,30s）
                wxLoginQrCode : null, // 微信登录二维码缓存 1min,30s 更新一次
                wxLoginQrCodePreUpdateTime : 0, // 微信登录二维码缓存上一次更新时间

                changeLiveShareMediaTrackAndStreamTimeLimit : 9, //切换直播媒体流的时间限制, 允许9s内切换一次
                changeLiveShareMediaTrackAndStreamTime : 0, //可以下一次切换直播媒体流的时间
                changeLiveShareMediaTrackAndStreamIntervalId : 0, //切换直播媒体流的时间间隔id
                clientWidth : document.body.clientWidth, //页面宽度
            }
        },
        computed: {
            isSystemRoom : function(){
                return this.systemRoomList.includes(this.roomId);
            },
            canSendFile: function () {
                return this.isJoined && this.chooseFileList.length > 0;
            },
            hasManInRoom: function () {
                return this.isSystemRoom || Object.keys(this.remoteMap).length > 0;
            },
            canSendChatingRoom : function(){
                return this.isJoined && Object.keys(this.remoteMap).length > 0;
            },
            isMobile: function () {
                return this.clientWidth <= 500 && navigator.userAgent.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                );
            },
            network: function () {
                return window.tlrtcfile.getNetWorkState()
            },
            filterLogs: function () {
                return this.logs.filter(item => {
                    if(item.msg){
                        return item.msg.indexOf(this.logsFilter) > -1
                        || item.time.indexOf(this.logsFilter) > -1
                        || item.type.indexOf(this.logsFilter) > -1
                    }
                })
            },
            toolSlidesPerViewCount: function(){
                return (this.clientWidth < 300) ? 3 : (this.clientWidth < 380) ? 4 : (this.clientWidth < 450) ? 5 
                : (this.clientWidth < 570) ? 3 : (this.clientWidth < 710) ? 4 : (this.clientWidth < 890) ? 5 
                : (this.clientWidth < 1000) ? 6 : 7;
            },
            isMediaing : function(){
                return this.isVideoShare || this.isScreenShare || this.isLiveShare
            },
            videoConstraints : function(){
                return {
                    audio: true,
                    video: {
                        facingMode: this.facingMode,
                        deviceId: this.videoDeviceId,
                        width: {
                            ideal : 200,  max : 200, min : 100
                        }, 
                        height: {
                            ideal : 150, max : 150, min : 150
                        },
                        frameRate: {
                            ideal: 100,  max: 100
                        },
                    }
                }
            },
            roomTypeName: function(){
                return this.lang[window.tlrtcfile.getRoomType(this.roomType)]
            },
            canSaveToIndexedDb: function(){
                return localforage.supports(localforage.INDEXEDDB)
            }
        },
        watch: {
            isAiAnswering: function (newV, oldV) {
                if (newV) {
                    this.aiAnsweringTxtIntervalId = setInterval(() => {
                        if (this.aiAnsweringTxt === this.lang.ai_thinking + '....') {
                            this.aiAnsweringTxt = this.lang.ai_thinking
                        } else {
                            this.aiAnsweringTxt += '.'
                        }
                        this.openaiChatTpl();
                    }, 500);
                } else {
                    clearInterval(this.aiAnsweringTxtIntervalId)
                }
            },
            remoteMap: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            receiveFileRecoderList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            receiveChatRoomList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            sendFileRecoderList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            receiveChatCommList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            chooseFileList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            }
        },
        methods: {
            //打开个人中心
            openUser: async function(){
                let that = this;
                layer.closeAll(function () {
                    layer.open({
                        type: 1,
                        closeBtn: 0,
                        fixed: true,
                        maxmin: false,
                        shadeClose: true,
                        area: ['350px', '380px'],
                        title: that.lang.user_info,
                        success: async function (layero, index) {
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                            document.querySelector(".layui-layer").style.borderRadius = "8px";
                            document.querySelector(".layui-layer-content").style.overflow = "hidden";

                            document.querySelector("#tl-rtc-file-logout-btn").addEventListener('click', async () => {
                                let { data : {code, logout} } = await axios.get("/api/login/logout");
                                if(code === 200 && logout){
                                    layer.msg(that.lang.logout_succ)
                                    that.isLogin = false;
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 500);
                                }
                            });

                            document.querySelector("#tl-rtc-file-user-log").addEventListener('click', async () => {
                                layer.msg(that.lang.load_history_oper_log_succ)
                            });

                            document.querySelector("#tl-rtc-file-user-subscribe").addEventListener('click', async () => {
                                if(that.subscribeNotify){
                                    layer.msg(that.lang.alreay_subscribe)
                                    return
                                }

                                layer.prompt({
                                    formType: 0,
                                    title: that.lang.email_subscribe_website_notify,
                                    btn : [that.lang.confirm, that.lang.cancel],
                                    value: "",
                                    maxlength : 100,
                                }, function (value, index, elem) {
                                    if(!tlrtcfile.isEmail(value)){
                                        layer.msg(that.lang.email_format_error)
                                        return
                                    }
                                    
                                    that.socket.emit("subscribeNofity", {
                                        room: that.roomId,
                                        email : value
                                    })

                                    layer.close(index);
                                    return false
                                });
                            });
                        },
                        content: `
                            <div class="tl-rtc-file-login-user">
                                <div class="tl-rtc-file-login-user-info">
                                    <div class="tl-rtc-file-login-user-info-avatar">
                                        <img src="${that.avatar}" alt="头像">
                                    </div>
                                    <div class="tl-rtc-file-login-user-info-name">
                                        ${that.lang.wchat_nickname}: ${that.username}
                                    </div>
                                    <div class="tl-rtc-file-login-user-info-name">
                                        ${that.lang.website_nickname}: ${that.nickName}
                                    </div>
                                    <div style="text-align: center;"> 
                                        <div class="tl-rtc-file-user-oper">
                                            <svg class="icon" aria-hidden="true" id="tl-rtc-file-user-log">
                                                <use xlink:href="#icon-rtc-file-qunfengcaozuojilu"></use>
                                            </svg>
                                            <svg class="icon" aria-hidden="true" id="tl-rtc-file-user-subscribe">
                                                <use xlink:href="#icon-rtc-file-dingyue"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="tl-rtc-file-login-user-btn">
                                    <div class="tl-rtc-file-logout">
                                        <button id="tl-rtc-file-logout-btn" type="button" class="layui-btn">${that.lang.logout}</button>
                                    </div>
                                </div>
                            </div>
                        `
                    })
                })
            },
            // 打开扫码登录
            openWxLogin: function(){
                let that = this;
                layer.closeAll(function () {
                    layer.open({
                        type: 1,
                        closeBtn: 0,
                        fixed: true,
                        maxmin: false,
                        shadeClose: true,
                        area: ['350px', '380px'],
                        title: that.lang.wxlogin,
                        end : function(){
                            if(that.checkWxLoginIntervalId){
                                clearInterval(that.checkWxLoginIntervalId);
                                that.checkWxLoginCount = 0;
                            }
                        },
                        success: async function (layero, index) {
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                            document.querySelector(".layui-layer").style.borderRadius = "8px";
                            document.querySelector(".layui-layer-content").style.overflow = "hidden";

                            let loadIndex = layer.load(1);
                            // 1min,30s 更新一次
                            if(that.wxLoginQrCodePreUpdateTime === 0 || that.wxLoginQrCodePreUpdateTime < (new Date().getTime() - 1000 * 60 * 1.5)){
                                let imgData = await axios.get("/api/login/qrcode?socketId="+that.socket.id,{
                                    responseType: 'blob'
                                });
                                const imgSrc = URL.createObjectURL(imgData.data)
                                that.wxLoginQrCodePreUpdateTime = new Date().getTime();
                                that.wxLoginQrCode = imgSrc;
                            }
                            document.querySelector("#tl-rtc-file-wx-login-image").innerHTML = `
                                <img style="filter:none;" src=${that.wxLoginQrCode} alt="二维码">
                            `;
                            layer.close(loadIndex);

                            //开启接口轮训
                            that.checkWxLoginIntervalId = setInterval(async () => {
                                if(that.checkWxLoginCount++ > 50){
                                    window.location.reload();
                                }
                                let { data : { state: scanState, token } } = await axios.get("/api/login/getScanState?scene="+that.socket.id)
                                const scanDom = document.querySelector("#tl-rtc-file-wx-login-scan")
                                const defaultDom = document.querySelector("#tl-rtc-file-wx-login-default")
                                if(scanState === 'scan'){
                                    scanDom.style.display = 'block';
                                    defaultDom.style.display = 'none';
                                }else if(scanState === 'auth_succ'){
                                    layer.close(index);
                                    layer.msg(that.lang.login_succ);
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 500);
                                }else if(scanState === 'auth_fail'){
                                    layer.msg(that.lang.login_fail)
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 500);
                                }else if(scanState === 'wait'){
                                    scanDom.style.display = 'none';
                                    defaultDom.style.display = 'block';
                                }
                            }, 1500);
                        },
                        content: `
                            <div id="tl-rtc-file-wx-login-default">
                                <div id="tl-rtc-file-wx-login-image">
                                    <img src="/image/qrcode.jpeg" alt="二维码">
                                </div>
                                <div style="margin-top: 35px; text-align: center;">
                                    <div id="tl-rtc-file-wx-login-title"> ${that.lang.login_info} </div>
                                </div>
                            </div>

                            <div id="tl-rtc-file-wx-login-scan" style="display:none;">
                                <div class="tl-rtc-file-wx-login-scan-ok">
                                    <svg class="icon" aria-hidden="true" style="width: 60%;height: auto;">
                                        <use xlink:href="#icon-rtc-file-zhengque"></use>
                                    </svg>
                                </div>
                                <div style="margin-top: 35px; text-align: center;">
                                    <div id="tl-rtc-file-wx-login-title"> ${that.socket.id} </div>
                                    <div id="tl-rtc-file-wx-login-title" style="scale:1;"> ${that.lang.scan_succ_and_wait_auth} </div>
                                </div>
                            </div>
                        `
                    })
                })
            },
            // 修改昵称
            changeNickName : function(){
                let that = this;
                layer.prompt({
                    formType: 0,
                    title: that.lang.changeNickName,
                    btn : [that.lang.confirm, that.lang.cancel],
                    value: "",
                    maxlength : 10,
                }, function (value, index, elem) {
                    if(value.length > 10 || tlrtcfile.containSymbol(value)){
                        layer.msg(that.lang.changeNickNameLimit)
                        return
                    }
                    
                    that.socket.emit("changeNickName", {
                        room: that.roomId,
                        from : that.socketId,
                        nickName : value,
                        preNickName : that.nickName
                    })

                    that.nickName = value;
                    layer.close(index);
                    that.addUserLogs(that.lang.changeNickName + "," + value);
                    return false
                });
            },
            //切换音视频场景下的摄像头前后置
            //切换媒体流之前，先将已关闭的媒体流打开之后再进行切换
            changeVideoShareMediaTrackAndStream : async function(){
                await this.changeShareStreamSwitch('video', 'video', 'open')
                await this.changeShareStreamSwitch('video', 'audio', 'open')

                //切换摄像头前后置
                this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'

                let that = this;
                window.Bus.$emit("changeVideoShareMediaTrackAndStream", {
                    kind : 'video',
                    constraints : this.videoConstraints,
                    rtcConns : this.rtcConns,
                    callback : (success) => {
                        if(!success){ //没有成功，切换回来
                            this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'
                        }
                    }
                });
            },
            //切换直播场景下的视频摄像头前后置媒体流
            //切换媒体流之前，先将已关闭的媒体流打开之后再进行切换
            changeLiveVideoShareMediaTrackAndStream : async function(){
                await this.changeShareStreamSwitch('live', 'video', 'open')
                await this.changeShareStreamSwitch('live', 'audio', 'open')

                //切换摄像头前后置
                this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'

                let that = this;

                window.Bus.$emit("changeLiveShareMediaTrackAndStream", {
                    type : 'video',
                    kind : 'video',
                    constraints : this.videoConstraints,
                    rtcConns : this.rtcConns,
                    callback : (success) => {
                        if(!success){ //没有成功，切换回来
                            that.facingMode = that.facingMode === 'user' ? 'environment' : 'user'
                        }
                    }
                });
            },
            //切换直播媒体流，比如切换视频流和屏幕共享流
            //切换媒体流之前，先将已关闭的媒体流打开之后再进行切换
            changeLiveShareMediaTrackAndStream : async function(){
                if(this.liveShareMode === 'live'){
                    //屏幕共享流只需要打开video通道即可
                    await this.changeShareStreamSwitch('live', 'video', 'open')
                }else if(this.liveShareMode === 'video'){
                    //视频流需要打开video和audio通道
                    await this.changeShareStreamSwitch('live', 'video', 'open')
                    await this.changeShareStreamSwitch('live', 'audio', 'open')
                }

                let that = this;
                this.liveShareMode = this.liveShareMode === 'video' ? 'screen' : 'video';
                window.Bus.$emit("changeLiveShareMediaTrackAndStream", {
                    type : this.liveShareMode,
                    kind : 'video',
                    constraints : this.videoConstraints,
                    rtcConns : this.rtcConns,
                    callback : (success) => {
                        if(!success){ //没有成功，切换回来
                            that.liveShareMode = that.liveShareMode === 'video' ? 'screen' : 'video';
                        }
                    }
                });

                if(this.changeLiveShareMediaTrackAndStreamTime === 0){
                    this.changeLiveShareMediaTrackAndStreamTime = this.changeLiveShareMediaTrackAndStreamTimeLimit - 1;
                    //10s内只允许切换一次
                    this.changeLiveShareMediaTrackAndStreamIntervalId = setInterval(() => {
                        if(this.changeLiveShareMediaTrackAndStreamTime === 0){
                            clearInterval(this.changeLiveShareMediaTrackAndStreamIntervalId)
                            return
                        }
                        this.changeLiveShareMediaTrackAndStreamTime -= 1;
                    }, 1000);
                }
            },
            //改变媒体流开关状态
            changeShareStreamSwitch : async function(type, kind, value){
                let stream = null;

                if(type === 'video'){
                    stream = await new Promise((resolve, reject) => {
                        window.Bus.$emit("getVideoShareTrackAndStream", (track, stream) => {
                            resolve(stream)
                        })
                    });
                }else if(type === 'screen'){
                    stream = await new Promise((resolve, reject) => {
                        stream = window.Bus.$emit("getScreenShareTrackAndStream", (track, stream) => {
                            resolve(stream)
                        }); 
                    });
                }else if(type === 'audio'){
                    stream = await new Promise((resolve, reject) => {
                        stream = window.Bus.$emit("getAudioShareTrackAndStream", (track, stream) => {
                            resolve(stream)
                        }); 
                    });
                }else if(type === 'live'){
                    stream = await new Promise((resolve, reject) => {
                        stream = window.Bus.$emit("getLiveShareTrackAndStream", (track, stream) => {
                            resolve(stream)
                        });
                    });
                }

                if(kind === 'video'){
                    //指定开关
                    if(value && ['open','close'].includes(value)){
                        stream.getVideoTracks()[0].enabled = value === 'open'
                        this.isCameraEnabled = value === 'open'
                    }else{
                        //根据当前状态取反
                        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled
                        this.isCameraEnabled = !this.isCameraEnabled
                    }
                }
                if(kind === 'audio'){
                    //指定开关
                    if(value && ['open','close'].includes(value)){
                        stream.getAudioTracks()[0].enabled = value === 'open'
                        this.isAudioEnabled = value === 'open'
                    }else{
                        //根据当前状态取反
                        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled
                        this.isAudioEnabled = !this.isAudioEnabled
                    }
                }

                this.socket.emit('message', {
                    emitType: "openCamera",
                    room: this.roomId,
                    from : this.socketId,
                    type : type,
                    kind : kind,
                    isCameraEnabled : this.isCameraEnabled,
                    isAudioEnabled : this.isAudioEnabled
                });
            },
            updateRemoteRtcState : async function(){
                for(let id in this.remoteMap){
                    let stat = await window.tlrtcfile.getWebrtcStats(
                        this.getOrCreateRtcConnect(id)
                    );
                    let remoteCandidate = stat.get("remote-candidate") || [];
                    let p2pModes = remoteCandidate.map(item => {
                        if(['host','srflx','prflx'].includes(item.report.candidateType)){
                            return "直连"
                        }else if(item.report.candidateType === 'relay'){
                            return "中继"
                        }else{
                            return "未知"
                        }
                    })
                    this.setRemoteInfo(id, {
                        //p2p连接模式: host, srflx, prflx, relay
                        p2pMode : Array.from(new Set(p2pModes)).join(",") 
                    })
                }
                this.$forceUpdate()
            },
            showRemoteUser : async function(remote){
                let stat = await window.tlrtcfile.getWebrtcStats(this.getOrCreateRtcConnect(remote.id));
                const rtcStatList = [];
                stat.forEach((value, key)=>{
                    rtcStatList.push(
                        ...value.map(item => {
                            return Object.assign(item.report, {
                                description_zh: item.description
                            })
                        })
                    )
                })
                let rtcStatDomList = '';
                rtcStatList.forEach(statItem => {
                    let rtcStatDomVal = ` <div> description_zh: <b>${statItem.description_zh}</b> </div> `;
                    for(let key in statItem){
                        if(key === 'description_zh'){
                            continue
                        }
                        rtcStatDomVal += ` <div> ${key}: <b>${statItem[key]}</b> </div> `;
                    }
                    rtcStatDomList += ` <div> ${rtcStatDomVal} </div> `;
                })

                let that = this;
                layer.closeAll(function () {
                    layer.open({
                        type: 1,
                        closeBtn: 0,
                        fixed: true,
                        maxmin: false,
                        shadeClose: true,
                        area: ['350px', '380px'],
                        title: `rtc连接实时统计信息`,
                        success: function (layero, index) {
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                            document.querySelector(".layui-layer").style.borderRadius = "8px";
                            document.querySelector(".layui-layer").style.background = "#f8f8f8";

                            carousel.render({
                                elem: '#tl-rtc-file-rtcinfo',
                                width: '100%',
                                autoplay : false,
                                indicator: 'outside'
                            });
                        },
                        content: `
                            <div class="remote_user_info layui-carousel" id="tl-rtc-file-rtcinfo">
                                <div carousel-item> 
                                    <div> 
                                        <div> ${that.lang.userid}: <b>${remote.id}</b> </div>
                                        <div> ${that.lang.nickname}: <b>${remote.nickName}</b> </div>
                                        <div> ${that.lang.room_channel}: <b>${that.roomId}</b> </div>
                                        <div> ${that.lang.website_language}: <b>${remote.langMode}</b> </div>
                                        <div> ${that.lang.network_status}: <b>${remote.network}</b> </div>
                                        <div> ${that.lang.join_time}: <b>${remote.joinTime}</b> </div>
                                        <div> ${that.lang.public_ip}: <b>${remote.ip}</b> </div>
                                        <div> ${that.lang.webrtc_ice_state}: <b>${remote.iceConnectionState}</b> </div>
                                        <div> ${that.lang.device_classification}: <b>${remote.ua}</b> </div>
                                        <div> ${that.lang.terminal_equipment}: <b>${remote.userAgent}</b> </div>
                                    </div>
                                    ${rtcStatDomList}
                                </div>
                            </div>
                        `
                    })
                })
            },
            iceOk : function(state){
                return ['completed', 'connected', 'checking', 'new'].includes(state);
            },
            printLogo : function(){
                window.console.log(`%c____ TL-RTC-FILE-V${this.version} ____ \n____ FORK ME ON GITHUB ____ \n____ https://github.com/tl-open-source/tl-rtc-file ____`, this.logo)
            },
            changeLanguage: function () {
                let that = this;
                window.dropdown.render({
                    elem: '#language',
                    data: [{
                        title: 'Chinese',
                        id: 'zh'
                    },{
                        type: '-'
                    },{
                        title: 'English',
                        id: 'en'
                    }],
                    className: 'language-mode',
                    click: function (obj) {
                        window.location.href = window.tlrtcfile.addUrlHashParams({
                            lang: obj.id
                        });
                        window.location.reload()
                    }
                });
            },
            openDisclaimer: function(){
                layer.open({
                    type: 2,
                    title : this.lang.website_agreement_statement,
                    area: ['100%','100%'],
                    shade: 0.5,
                    shadeClose : true,
                    content: 'disclaimer.html',
                    success: function(){
                        document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                        document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                        document.querySelector(".layui-layer").style.borderRadius = "8px";
                    }
                })
            },
            // 分享取件码
            getCodeFileCode : function(file){
                let that = this;
                layer.closeAll(function () {
                    layer.open({
                        type: 1,
                        closeBtn: 0,
                        fixed: true,
                        maxmin: false,
                        shadeClose: true,
                        area: ['350px', '380px'],
                        title: that.lang.share_pickup_code + "("+that.lang.expires_one_day+")",
                        success: function (layero, index) {
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                            document.querySelector(".layui-layer").style.borderRadius = "8px";
                            if(window.tlrtcfile.getQrCode){
                                tlrtcfile.getQrCode("tl-rtc-file-code-share-image", window.location.href + "#c="+file.codeId)
                            }
                        },
                        content: `
                            <div style="margin-top: 20px; text-align: center; margin-bottom: 25px;">
                                <div id="tl-rtc-file-code-share"> ${file.codeId} </div>
                            </div>
                            <div id="tl-rtc-file-code-share-image">
                        `
                    })
                })
                this.addUserLogs(this.lang.open_share_pickup_code)
            },
            // 暂存取件码文件
            prepareCodeFile: function (recoder) {
                let index = recoder.index;
                let id = recoder.id;

                let filterFile = this.chooseFileList.filter(item=>{
                    return item.index === index;
                });

                if(filterFile.length === 0){
                    this.addUserLogs(this.lang.file_not_exist);
                    return
                }

                let file = filterFile[0]

                if (file.size > this.uploadCodeFileMaxSize) {
                    layer.msg(`${this.lang.max_saved} ${this.uploadCodeFileMaxSize / 1024 / 1024} ${this.lang.mb_file}`);
                    return
                }

                //更新当前文件相关的所有记录的暂存状态
                this.updateSendFileRecoderUpload(index, {
                    upload : "uploading"
                })

                this.socket.emit('prepareCodeFile', {
                    index: file.index,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    room: this.roomId,
                    from: this.socketId,
                    nickName : this.nickName,
                    sendFileRecoderId : id
                });
            },
            // 获取取件码文件
            getCodeFile: function () {
                let that = this;
                if (!this.switchData.openGetCodeFile) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                layer.prompt({
                    formType: 0,
                    title: this.lang.please_enter_code,
                    btn : [that.lang.confirm, that.lang.cancel],
                    value: this.codeId,
                }, function (value, index, elem) {
                    if(value.length < 30 || tlrtcfile.containSymbol(value) || tlrtcfile.containChinese(value)){
                        layer.msg(that.lang.please_enter_right_code)
                        return
                    }

                    that.codeId = value;

                    that.socket.emit('getCodeFile', {
                        room: that.roomId,
                        from: that.socketId,
                        code: that.codeId,
                    });

                    layer.close(index);
                    that.addUserLogs(that.lang.get_pickup_file + "," + value);
                });
            },
            //点击搜索暂存文件面板
            clickCodeFile: function () {
                this.showCodeFile = !this.showCodeFile;
                if (this.showCodeFile) {
                    this.codeFileMaskHeightNum = 20;
                    this.addUserLogs(this.lang.expand_temporary);
                } else {
                    this.codeFileMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_temporary);
                }
            },
            // 私聊弹窗
            startChatRoomSingle: function(event, remote){
                event.stopPropagation(); 
                this.chatRoomSingleSocketId = remote.id;
                let that = this;
                let options = {
                    type: 1,
                    fixed: false,
                    maxmin: false,
                    shadeClose : true,
                    area: ['600px', '600px'],
                    title: `${this.lang.private_chat}【${remote.nickName}】-【${remote.id}】`,
                    success: function (layero, index) {
                        if (window.layedit) {
                            that.txtEditId = layedit.build('chating_room_single_value', {
                                tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face'],
                                height: 100
                            });
                        }
                        that.chatingRoomSingleTpl();

                        if(window.tlrtcfile.chatKeydown){
                            let textareaIframe = document.getElementsByTagName("iframe");
                            if(textareaIframe && textareaIframe.length === 1){
                                tlrtcfile.chatKeydown(
                                    document.getElementsByTagName("iframe")[0].contentDocument.body, 
                                    that.sendChatingRoomSingle
                                )
                            }
                        }

                        document.getElementById("tl-sendChatingRoomSingle").addEventListener("click",function(){
                            that.sendChatingRoomSingle();
                        })

                        let remoteRtc = that.getRemoteInfo(that.chatRoomSingleSocketId);
                        let receiveChatRoomSingleList = [];
                        if(remoteRtc && remoteRtc.receiveChatRoomSingleList){
                            receiveChatRoomSingleList = remoteRtc.receiveChatRoomSingleList;
                        }
                        receiveChatRoomSingleList.forEach((item, index) => {
                            const id = "tl-rtc-file-content-copy" + index;
                            if(!document.getElementById(id)) return;
                            document.getElementById(id).addEventListener('click', function () {
                                tlrtcfile.copyTxt(id, item.content, function () {
                                    layer.msg(that.lang.copy_success)
                                });
                                that.addUserLogs(that.lang.copy_success);
                            });
                        })
                    },
                    cancel: function (index, layero) {
                        this.chatRoomSingleSocketId = "";
                    },
                    content: `
                        <div class="layui-col-sm12" style="padding: 15px;">
                            <div id="chating_room_single_tpl_view" style="padding: 5px;"> </div>
                            <script id="chating_room_single_tpl" type="text/html">
                                {{#  layui.each(d, function(index, info){ }}
                                    {{#  if(info.socketId !== '${this.socketId}') { }}
                                        <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                            <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                            <div style="margin-left: 15px; margin-top: -5px;width:100%;">
                                                <div style="word-break: break-all;"> 
                                                    <small>${this.lang.user}: <b>{{info.nickName}}</b></small> - 
                                                    <small>id: <b>{{info.socketId}}</b></small> - 
                                                    <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small> 
                                                    <svg class="icon" aria-hidden="true" style="margin-left: 5px;cursor: pointer;" id="tl-rtc-file-content-copy{{index}}">
                                                        <use xlink:href="#icon-rtc-file-fuzhi"></use>
                                                    </svg>
                                                </div>
                                                <div style="margin-top: 5px;word-break: break-all;width: 90%;"> 
                                                    <b style="font-weight: bold; font-size: large;">{{- info.content }}</b>
                                                </div>
                                            </div>
                                        </div>
                                        {{#  }else { }}
                                        <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                            <div style="margin-right: 15px; margin-top: -5px;width:100%;text-align: right;">
                                                <div style="word-break: break-all;"> 
                                                    <small>${this.lang.self}: {{info.nickName}} </small> - 
                                                    <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small> 
                                                </div>
                                                <div style="margin-top: 5px;word-break: break-all;width: 90%; margin-left: 10%;"> 
                                                    <b style="font-weight: bold; font-size: large;">{{- info.content }}</b>
                                                </div>
                                            </div>
                                            <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                        </div>
                                    {{#  } }}
                                {{#  }); }}
                            </script>
                        </div>
                        <div class="chating_input_body">
                            <textarea maxlength="50000" id="chating_room_single_value" class="layui-textarea" placeholder="${this.lang.communication_rational} ~"></textarea>
                            <span class="chating_send_body chating_send_body_span">shift+enter | ${this.lang.enter_send} </span>
                            <button id="tl-sendChatingRoomSingle" type="button" class="layui-btn layui-btn-normal layui-btn-sm chating_send_body chating_send_body_button">${this.lang.send_chat}</button>
                        </div>
                    `
                }
                if (this.isMobile) {
                    delete options.area
                }
                layer.closeAll(function () {
                    let index = layer.open(options)
                    if (that.isMobile) {
                        layer.full(index)
                    }
                })
                this.addUserLogs(this.lang.open_private_chat)
            },
            // 私聊渲染
            chatingRoomSingleTpl: function () {
                let tpl_html = document.getElementById("chating_room_single_tpl");
                let tpl_view_html = document.getElementById("chating_room_single_tpl_view");

                if (tpl_html && tpl_view_html) {

                    //私聊数据放在连接对象中
                    let remoteRtc = this.getRemoteInfo(this.chatRoomSingleSocketId);
                    let receiveChatRoomSingleList = [];
                    if(remoteRtc && remoteRtc.receiveChatRoomSingleList){
                        receiveChatRoomSingleList = remoteRtc.receiveChatRoomSingleList;
                    }
                    
                    this.tpl(tpl_html, receiveChatRoomSingleList, tpl_view_html)

                    let chatDom = document.querySelector("#chating_room_single_tpl_view")
                    let chatDomHeight = chatDom.clientHeight
                    let height = 0;

                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 280;
                    } else {
                        height = 325
                    }

                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }
                    
                    if(window.tlrtcfile.scrollToBottom){
                        window.tlrtcfile.scrollToBottom(chatDom, 1000, 100)
                    }
                }
            },
            // 私聊发言
            sendChatingRoomSingle: function () {
                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_send)
                    this.addUserLogs(this.lang.please_join_then_send);
                    return
                }
                if (!this.hasManInRoom) {
                    layer.msg(this.lang.room_least_two_can_send_content)
                    this.addUserLogs(this.lang.room_least_two_can_send_content);
                    return
                }
                let realContent = layedit.getContent(this.txtEditId)
                if (realContent.length <= 0) {
                    layer.msg(this.lang.please_enter_content)
                    this.addUserLogs(this.lang.please_enter_content);
                    return
                }
                if (realContent.length > 10000) {
                    layer.msg(this.lang.content_max_10000)
                    this.addUserLogs(this.lang.content_max_10000);
                    return
                }
                this.socket.emit('chatingRoom', {
                    content: tlrtcfile.escapeStr(realContent),
                    room: this.roomId,
                    from: this.socketId,
                    to : this.chatRoomSingleSocketId,
                    nickName : this.nickName,
                    recoderId: this.recoderId
                });
                
                //私聊数据放在连接对象中
                let remoteRtc = this.getRemoteInfo(this.chatRoomSingleSocketId);
                if(remoteRtc){
                    let now = new Date().toLocaleString();
                    let receiveChatRoomSingleList = remoteRtc.receiveChatRoomSingleList || [];
                    receiveChatRoomSingleList.push({
                        socketId: this.socketId,
                        content: realContent,
                        nickName : this.nickName,
                        to : this.chatRoomSingleSocketId,
                        time: now,
                        timeAgo : window.util ? util.timeAgo(now) : now
                    })
                    this.setRemoteInfo(this.chatRoomSingleSocketId, {
                        receiveChatRoomSingleList : receiveChatRoomSingleList
                    });
                }

                this.chatingRoomSingleTpl();
                layer.msg(this.lang.text_send_done)
                this.addUserLogs(this.lang.text_send_done);
                
                layedit.setContent(this.txtEditId, "", false)
            },
            // 右上角弹窗
            startPopUpMsg : async function() {
                let that = this;
                let data = this.popUpList.shift();
                let lengthLevel = {//渐进式弹悬浮时间
                    2 : 1800, // 队列只有两个弹窗排队时, 弹窗悬停时间1800ms
                    5 : 1600,
                    8 : 1300,
                    10 : 500,
                    20 : 200
                };
                //轮训是否有弹窗排队中
                if(!data){
                    await new Promise(resolve=>{
                        setTimeout(async ()=>{
                            await this.startPopUpMsg()
                            resolve()
                        }, 1000);
                    })
                    return
                }

                //如果开启了系统弹窗 && 当前页面没有焦点
                if(this.webMsgNotify && !document.hasFocus()){
                    //修改标签页title
                    let title = document.title;
                    let msg = data.title + " " + data.message;
                    let time = 0;
                    let timer = null;
                    timer = setInterval(() => {
                        time++;
                        if(time % 2 === 0){
                            document.title = msg;
                        }else{
                            document.title = title;
                        }
                        if(time > 10){
                            clearInterval(timer);
                            document.title = title;
                        }
                    }, 500);

                    //浏览器系统桌面消息通知
                    if(window.Notification && Notification.permission === 'granted'){
                        new Notification("tl-rtc-file通知" + data.title, {
                            body: data.message,
                            dir: 'auto',
                            icon: '../image/44826979.png'
                        })
                    }
                }

                let levelTime = 1800;
                for(let len in lengthLevel){
                    if(len > this.popUpList.length){
                        levelTime = lengthLevel[len]
                        break;
                    }
                }

                let msgDom = document.createElement('div');
                msgDom.setAttribute("class","tl-rtc-file-notification")
                msgDom.style.opacity = 0;
                msgDom.innerHTML = `
                    <div class="tl-rtc-file-notification-close"><i class="layui-icon layui-icon-close "></i></div>
                    <div class="tl-rtc-file-notification-icon"><i class="layui-icon layui-icon-chat"></i></div>
                    <div class="tl-rtc-file-notification-content">
                        <div class="tl-rtc-file-notification-title"> ${data.title} </div>
                        <div class="tl-rtc-file-notification-content-msg"> ${data.message} </div>
                    </div> 
                `;
                let msgDomContainer = document.getElementById('notificationContainer');
                msgDomContainer.style.right = "-320px";
                msgDomContainer.prepend(msgDom);

                setTimeout(() => {
                    msgDomContainer.style.right = "10px";
                    msgDom.style.opacity = 1;
                    setTimeout(() => {
                        msgDomContainer.style.right = "-320px";
                        msgDom.style.opacity = 0;
                        setTimeout(() => {
                            msgDomContainer.removeChild(msgDom);
                            that.startPopUpMsg();
                        }, 450);
                    }, levelTime);
                }, 450);
            },
            // 预览发送文件
            previewSendFile: async function (index) {
                let filterFile = this.chooseFileList.filter(item=>{
                    return item.index === index;
                });

                if(filterFile.length === 0){
                    this.addUserLogs(this.lang.preview_file + "【", file.name, "】"+ this.lang.failed_find_file);
                    return
                }
                await this.previewFile(filterFile[0])
            },
            // 预览接收文件
            previewReceiveFile: async function (index) {
                let filterFile = this.receiveFileRecoderList.filter(item=>{
                    return item.index === index;
                });

                if(filterFile.length === 0){
                    this.addUserLogs(this.lang.preview_file + "【", file.name, "】"+ this.lang.failed_find_file);
                    return
                }

                let fileRecorder = filterFile[0];
                if (fileRecorder.size > this.previewFileMaxSize) {
                    layer.msg(`${this.lang.max_previewed} ${this.previewFileMaxSize / 1024 / 1024} ${this.lang.mb_file}`);
                    return
                }

                let file = await new Promise((resolve, reject) => {
                    let req = new XMLHttpRequest();
                    req.open("GET", fileRecorder.href);
                    req.setRequestHeader('Accept', 'image/png');
                    req.responseType = "blob";
                    req.onload = () => {
                        resolve( new File([req.response], fileRecorder.name, { type: fileRecorder.type }) );
                    };
                    req.onerror = reject
                    req.send();
                });

                await this.previewFile(file);
            },
            // 预览文件
            previewFile : async function(file){
                try{
                    let that = this;

                    let isText = this.typeInArr([
                        'text','json', 'lua', 'html', 'css', 'js', 'java', 'cpp', 'javascript',
                        'sql', 'php', 'py', 'go', 'conf', 'log', 'md', 'scss', 'xml',
                        'rb', 'sh' , 'ts','jsx', 'less', 'htm', 'xhtml', 'tsx',
                    ], file.type, file.name);
    
                    let isPdf = this.typeInArr([
                        'pdf', 'pdx', 'pdn', 'fdf', 'pdp'
                    ], file.type, file.name);
    
                    let isImage = this.typeInArr([
                        'image', 'png', 'jpg', 'jpeg', 'gif', 'webp'
                    ], file.type, file.name);
    
                    let isDoc = this.typeInArr([
                        'wordprogressingml.document','application/msword'
                    ], file.type, file.name);

                    let isVideo = this.typeInArr([
                        'video','mp4'
                    ], file.type, file.name);
    
                    if(isPdf){
                        await window.tlrtcfile.previewPdfFile({
                            file : file,
                            max : this.previewFileMaxSize,
                            callback : function(msg){
                                layer.msg(msg)
                                that.addUserLogs(msg)
                            }
                        })
                    } else if (isImage) {
                        window.tlrtcfile.previewImageFile({
                            file : file,
                            max : this.previewFileMaxSize,
                            callback : function(msg){
                                layer.msg(msg)
                                that.addUserLogs(msg)
                            }
                        })
                    }  else if (isVideo) {
                        window.tlrtcfile.previewVideoFile({
                            file : file,
                            max : this.previewFileMaxSize,
                            callback : function(msg){
                                layer.msg(msg)
                                that.addUserLogs(msg)
                            }
                        })
                    } else if (isText) {
                        window.tlrtcfile.previewCodeFile({
                            file : file,
                            max : this.previewFileMaxSize,
                            callback : function(msg){
                                layer.msg(msg)
                                that.addUserLogs(msg)
                            }
                        })
                    } else{
                        layer.msg(this.lang.preview_not_supported);
                    }
                }catch(e){
                    layer.msg(this.lang.preview_not_supported);
                }
            },
            // 删除待发送文件
            deleteSendFile: function(index){            
                let that = this;
                let sendFileRecorder = this.sendFileRecoderList[index];
                if(sendFileRecorder){
                    let filename = sendFileRecorder.name;
                    let fileindex = sendFileRecorder.index;
                    let fileId = sendFileRecorder.id;

                    let dom = document.querySelector("#send-file-item"+index)
                    dom.classList.add("tl-rtc-file-fade-leave-active");
                    
                    setTimeout(() => { // 因为动画效果，所以延迟执行
                        // 清除对应的记录
                        that.sendFileRecoderList = that.sendFileRecoderList.filter(item=>{
                            return fileindex !== item.index && filename !== item.filename
                        })
                        // 移除文件
                        that.chooseFileList =  that.chooseFileList.filter(item=>{
                            return item.index !== fileindex;
                        })

                        layer.msg(`${that.lang.send_cancel}【${filename}】`);
                    }, 600);
                }
            },
            // 设置昵称
            setNickName: function(){
                if(window.tlrtcfile.genNickName){
                    this.nickName = window.tlrtcfile.genNickName(this.langMode);
                }
            },
            // 打开公告
            clickNotice: function(){
                let noticeMsgList = this.switchData.noticeMsgList || [{
                    msg : this.lang.no_notice
                }]
                let content = "";
                noticeMsgList.forEach(item=>{
                    content += `<div> ${item.msg} </div>`;
                })
                layer.open({
                    title: this.lang.notice,
                    content: content,
                    btn : this.lang.confirm,
                    shadeClose : true
                });
            },
            // 打开ai窗口
            openaiChat: function () {
                if (!this.switchData.openAiChat) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_chat_with_ai)
                    this.addUserLogs(this.lang.please_join_then_chat_with_ai)
                    return
                }
                let that = this;
                let options = {
                    type: 1,
                    fixed: false, //不固定
                    maxmin: false,
                    shadeClose: true,
                    area: ['600px', '600px'],
                    title: this.lang.ai_chat,
                    success: function (layero, index) {                            
                        document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                        document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                        document.querySelector(".layui-layer").style.borderRadius = "15px"
                        that.openaiChatTpl();

                        if(window.tlrtcfile.chatKeydown){
                            tlrtcfile.chatKeydown(document.getElementById("openaiChat_value"), that.sendOpenaiChat)
                        }
                        
                        document.getElementById("tl-sendOpenaiChat").addEventListener("click",function(){
                            that.sendOpenaiChat();
                        });
                    },
                    content: `
                        <div class="layui-col-sm12" style="padding: 15px;">
                            <div class="layui-card" id="openaiChat_tpl_view" style="padding: 5px;"> </div>
                            <script id="openaiChat_tpl" type="text/html">
                                {{#  if(d.openaiSendContext) { }}
                                <div style="font-weight: bold;text-align: center; color: #000000; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                    ${this.lang.open_ai_switch}
                                </div>
                                {{#  }else{ }}
                                <div style="text-align: center; color: #000000; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                    ${this.lang.try_open_ai_switch}
                                </div>
                                {{#  } }}
                                <div style="text-align: center; color: #000000; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                    -------- ${this.lang.room} ${this.roomId} - ${this.lang.ai_chat_record} -------- 
                                </div>
                                {{#  layui.each(d.list, function(index, info){ }}
                                    {{#  if(info.type === 'openai') { }}
                                    <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                        <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                        <div style="margin-left: 15px; margin-top: -5px;width:100%;">
                                            <div style="word-break: break-all;"> <small> AI: </small> - <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small> </div>
                                            <div style="margin-top: 5px;word-break: break-all;width: 90%;"> <b style="font-weight: bold; font-size: large;"> {{- info.content}} </b></div>
                                        </div>
                                    </div>
                                    {{#  }else { }}
                                    <div style="margin-bottom: 30px;display: inline-flex;text-align: right;float: right;width:100%;">
                                        <div style="margin-right: 15px; margin-top: -5px;width:100%;">
                                            <div style="word-break: break-all;"> <small>${this.lang.self}: <b>{{info.socketId}}</b> </small> <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small>  </div>
                                            <div style="margin-top: 5px;word-break: break-all;width: 90%; margin-left: 10%;"> <b style="font-weight: bold; font-size: large;"> {{- info.content}} </b></div>
                                        </div>
                                        <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                    </div>
                                    {{#  } }}
                                {{#  }); }}

                                {{#  if(d.isAiAnswering) { }}
                                <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                    <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                    <div style="margin-left: 15px; margin-top: -5px;width:100%;">
                                        <div style="word-break: break-all;"> 
                                            <small> AI: </small> - 
                                            <small>${this.lang.time}: <b>{{d.time}}</b></small> 
                                        </div>
                                        <div style="margin-top: 5px;word-break: break-all;width: 90%;"> <b style="font-weight: bold; font-size: large;"> {{d.aiAnsweringTxt}} </b></div>
                                    </div>
                                </div>
                                {{#  } }}
                            </script>
                        </div>

                        <div class="chating_input_body">
                            <textarea maxlength="50000" id="openaiChat_value" class="layui-textarea" placeholder="${this.lang.communication_rational} ~"></textarea>
                            <span class="chating_send_body chating_send_body_span">shift+enter | ${this.lang.enter_send} </span>
                            <button id="tl-sendOpenaiChat" type="button" class="layui-btn layui-btn-normal layui-btn-sm chating_send_body chating_send_body_button">${this.lang.send_chat}</button>
                        </div>
                    `
                }
                if (this.isMobile) {
                    delete options.area
                }
                layer.closeAll(function () {
                    let index = layer.open(options)
                    if (that.isMobile) {
                        layer.full(index)
                    }
                })
                this.addUserLogs(this.lang.open_ai_chat)
            },
            openaiChatTpl: function (callback) {
                let tpl_html = document.getElementById("openaiChat_tpl");
                let tpl_view_html = document.getElementById("openaiChat_tpl_view");

                if (tpl_html && tpl_view_html) {

                    this.tpl(tpl_html, {
                        list: this.receiveAiChatList,
                        isAiAnswering: this.isAiAnswering,
                        aiAnsweringTxt: this.aiAnsweringTxt,
                        time: window.util ? util.timeAgo(new Date().toDateString) : new Date().toDateString,
                        openaiSendContext: this.openaiSendContext
                    }, tpl_view_html, callback)

                    let chatDom = document.querySelector("#openaiChat_tpl_view")
                    let chatDomHeight = chatDom.clientHeight

                    let height = 0;
                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 200;
                    } else {
                        height = 350
                    }
                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }
                    if(window.tlrtcfile.scrollToBottom){
                        window.tlrtcfile.scrollToBottom(chatDom, 1000, 100)
                    }
                }
            },
            // 发送ai问题
            sendOpenaiChat: function () {
                if (this.isAiAnswering) {
                    layer.msg(this.lang.ai_answering)
                    this.addUserLogs(this.lang.ai_answering)
                    return
                }

                let value = document.querySelector("#openaiChat_value").value;

                if (value === '' || value === undefined) {
                    layer.msg(this.lang.please_fill_content)
                    this.addUserLogs(this.lang.please_fill_content)
                    return
                }
                if (value.length > 1000) {
                    layer.msg(this.lang.content_max_1000)
                    this.addUserLogs(this.lang.content_max_1000)
                    return
                }

                value = window.util.escape(value);

                this.receiveAiChatList.push({
                    room: this.roomId,
                    socketId: this.socketId,
                    content: value
                })

                // 发送上下文
                let contextContent = "";
                if (this.openaiSendContext) {
                    let isShortContentChatList = true;
                    this.receiveAiChatList.forEach(item => {
                        if (item.content.length > 100) {
                            isShortContentChatList = false;
                        }
                    })
                    let isShortChatList = this.receiveAiChatList.length < 6;

                    if (isShortChatList) { // 对话次数不多
                        if (isShortContentChatList) { // 对话内容精简
                            this.receiveAiChatList.forEach(item => {
                                contextContent += item.content + "\n";
                            })
                        } else { //对话内容复杂
                            this.receiveAiChatList.forEach(item => {
                                contextContent += item.content + "\n";
                            })
                        }
                    } else { // 对话次数较多
                        if (isShortContentChatList) { // 对话内容精简
                            this.receiveAiChatList.slice(this.receiveAiChatList.length - 6).forEach(item => {
                                contextContent += item.content + "\n";
                            })
                        } else { // 对话内容复杂
                            this.receiveAiChatList.slice(this.receiveAiChatList.length - 4).forEach(item => {
                                contextContent += item.content + "\n";
                            })
                        }
                    }
                    contextContent = contextContent.substring(0, 5000);
                }

                this.socket.emit('openai', {
                    room: this.roomId,
                    socketId: this.socketId,
                    content: contextContent,
                    value: value
                });

                this.isAiAnswering = true;

                this.openaiChatTpl()

                this.addUserLogs(this.lang.i_said_to_ai + value);

                document.querySelector("#openaiChat_value").value = ''
            },
            // 创建/加入密码房间
            startPassword: function () {
                if (!this.switchData.openPasswordRoom) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (!this.isPasswordRoom) {
                    if (this.isJoined) {
                        layer.msg(this.lang.please_exit_then_join_password_room)
                        this.addUserLogs(this.lang.please_exit_then_join_password_room)
                        return
                    }
                    let that = this;
                    layer.prompt({
                        formType: 0,
                        title: this.lang.please_enter_password_room_num,
                        btn : [that.lang.confirm, that.lang.cancel],
                    }, function (value, index, elem) {
                        that.roomId = value;
                        layer.close(index);
                        that.isPasswordRoom = !that.isPasswordRoom;
                        that.roomType = "password";

                        layer.prompt({
                            formType: 1,
                            title: that.lang.please_enter_password,
                            btn : [that.lang.confirm, that.lang.cancel],
                        }, function (value, index, elem) {
                            that.createPasswordRoom(value);
                            layer.close(index);
                            that.addUserLogs(that.lang.enter_password_room + that.roomId + `,${that.lang.password}:` + value);
                        });
                    });
                }
            },
            // 创建/加入音视频房间
            startVideoShare: function () {
                if (!this.switchData.openVideoShare) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (this.isScreenShare) {
                    layer.msg(this.lang.in_sharing_screen)
                    this.addUserLogs(this.lang.in_sharing_screen)
                    return
                }
                if (this.isLiveShare) {
                    layer.msg(this.lang.in_living)
                    this.addUserLogs(this.lang.in_living)
                    return
                }
                if (this.isAudioShare) {
                    layer.msg(this.lang.in_audioing)
                    this.addUserLogs(this.lang.in_audioing)
                    return
                }
                if (this.isVideoShare) {
                    window.Bus.$emit("stopVideoShare")
                    this.isVideoShare = !this.isVideoShare;
                    this.addUserLogs(this.lang.end_video_call);
                    return  
                }
                if (this.isJoined) {
                    layer.msg(this.lang.please_exit_then_join_video)
                    this.addUserLogs(this.lang.please_exit_then_join_video)
                    return
                }
                let that = this;
                if(that.isShareJoin){ //分享进入
                    that.createMediaRoom("video");
                    that.socket.emit('message', {
                        emitType: "startVideoShare",
                        room: that.roomId,
                        to : that.socketId
                    });
                    that.clickMediaVideo();
                    that.isVideoShare = !that.isVideoShare;
                    that.addUserLogs(that.lang.start_video_call);
                }else{
                    layer.prompt({
                        formType: 0,
                        btn : [that.lang.confirm, that.lang.cancel],
                        title: that.lang.please_enter_video_call_room_num
                    }, function (value, index, elem) {
                        that.roomId = value;
                        that.createMediaRoom("video");
                        layer.close(index)

                        that.socket.emit('message', {
                            emitType: "startVideoShare",
                            room: that.roomId,
                            to : that.socketId
                        });
                        that.clickMediaVideo();
                        that.isVideoShare = !that.isVideoShare;
                        that.addUserLogs(that.lang.start_video_call);
                    });
                }
            },
            // 创建/加入屏幕共享房间
            startScreenShare: function () {
                if (!this.switchData.openScreenShare) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (this.isVideoShare) {
                    layer.msg(this.lang.in_videoing)
                    this.addUserLogs(this.lang.in_videoing)
                    return
                }
                if (this.isLiveShare) {
                    layer.msg(this.lang.in_living)
                    this.addUserLogs(this.lang.in_living)
                    return
                }
                if (this.isAudioShare) {
                    layer.msg(this.lang.in_audioing)
                    this.addUserLogs(this.lang.in_audioing)
                    return
                }
                if (this.isScreenShare) {
                    window.Bus.$emit("stopScreenShare")
                    this.isScreenShare = !this.isScreenShare;
                    this.addUserLogs(this.lang.end_screen_sharing);
                    return   
                }
                if (this.isJoined) {
                    layer.msg(this.lang.please_exit_then_join_screen)
                    this.addUserLogs(this.lang.please_exit_then_join_screen)
                    return
                }
                let that = this;
                if(that.isShareJoin){ //分享进入
                    that.createMediaRoom("screen");
                    that.socket.emit('message', {
                        emitType: "startScreenShare",
                        room: that.roomId,
                        to : that.socketId
                    });
                    that.clickMediaScreen();
                    that.isScreenShare = !that.isScreenShare;
                    that.addUserLogs(that.lang.start_screen_sharing);
                }else{
                    layer.prompt({
                        formType: 0,
                        btn : [that.lang.confirm, that.lang.cancel],
                        title: this.lang.please_enter_screen_sharing_room_num,
                    }, function (value, index, elem) {
                        that.roomId = value;
                        that.createMediaRoom("screen");
                        layer.close(index)

                        that.socket.emit('message', {
                            emitType: "startScreenShare",
                            room: that.roomId,
                            to : that.socketId
                        });
                        that.clickMediaScreen();
                        that.isScreenShare = !that.isScreenShare;
                        that.addUserLogs(that.lang.start_screen_sharing);
                    });
                }
            },
            // 创建/加入直播房间
            startLiveShare: function () {
                if (!this.switchData.openLiveShare) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (this.isVideoShare) {
                    layer.msg(this.lang.in_videoing)
                    this.addUserLogs(this.lang.in_videoing)
                    return
                }
                if (this.isScreenShare) {
                    layer.msg(this.lang.in_sharing_screen)
                    this.addUserLogs(this.lang.in_sharing_screen)
                    return
                }
                if (this.isAudioShare) {
                    layer.msg(this.lang.in_audioing)
                    this.addUserLogs(this.lang.in_audioing)
                    return
                }
                if (this.isLiveShare) {
                    window.Bus.$emit("stopLiveShare")
                    this.isLiveShare = !this.isLiveShare;
                    this.addUserLogs(this.lang.end_live);
                    return   
                }
                if (this.isJoined) {
                    layer.msg(this.lang.please_exit_then_join_live)
                    this.addUserLogs(this.lang.please_exit_then_join_live)
                    return
                }
                let that = this;
                if(that.isShareJoin){ //分享进入
                    that.createMediaRoom("live");
                    that.socket.emit('message', {
                        emitType: "startLiveShare",
                        room: that.roomId,
                        to : that.socketId,
                        liveShareMode : that.liveShareMode,
                        liveShareRole : that.liveShareRole
                    });
                    that.clickMediaLive();
                    that.isLiveShare = !that.isLiveShare;
                    that.addUserLogs(that.lang.start_live);
                }else{
                    layer.open({
                        title: that.lang.chooseRoleEnter,
                        content: `
                            <div style="text-align: center;"> 
                                <div style="display: inline-flex;">
                                    <div class="tl-rtc-file-live-user-choose" id="liveOwner">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-rtc-file-laoshi"></use>
                                        </svg>
                                        <div> ${that.lang.iamLiveOwner} </div>
                                    </div>
                                    <div class="tl-rtc-file-live-user-choose" id="liveViewer">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-rtc-file-navbar_guanzhong"></use>
                                        </svg>
                                        <div > ${that.lang.iamLiveViewer} </div>
                                    </div>
                                </div>
                            </div>
                        `,
                        btn : false,
                        shadeClose : true,
                        success : function(layero, index){
                            document.querySelector("#liveOwner").addEventListener("click", function(){
                                layer.close(index);
                                layer.prompt({
                                    formType: 0,
                                    title: that.lang.please_enter_live_room_num,
                                    btn : [that.lang.videoLiveShare, that.lang.screenLiveShare, that.lang.cancel],
                                    yes: function (index, layero) {
                                        const value = $('#layui-layer'+index + " .layui-layer-input").val();
                                        if(value === ''){
                                            return
                                        }
                                        that.roomId = value;
                                        that.liveShareMode = "video";
                                        that.createMediaRoom("live");
                                        layer.close(index)
            
                                        that.socket.emit('message', {
                                            emitType: "startLiveShare",
                                            room: that.roomId,
                                            to : that.socketId,
                                            liveShareMode : that.liveShareMode,
                                            liveShareRole : that.liveShareRole
                                        });
                                        that.clickMediaLive();
                                        that.isLiveShare = !that.isLiveShare;
                                        that.addUserLogs(that.lang.start_live);
                                        return false
                                    },
                                    btn2: function (index, layero) {
                                        const value = $('#layui-layer'+index + " .layui-layer-input").val();
                                        if(value === ''){
                                            return false
                                        }
                                        that.roomId = value;
                                        that.liveShareMode = "screen";
                                        that.createMediaRoom("live");
                                        layer.close(index)
            
                                        that.socket.emit('message', {
                                            emitType: "startLiveShare",
                                            room: that.roomId,
                                            to : that.socketId,
                                            liveShareMode : that.liveShareMode,
                                            liveShareRole : that.liveShareRole
                                        });
                                        that.clickMediaLive();
                                        that.isLiveShare = !that.isLiveShare;
                                        that.addUserLogs(that.lang.start_live);
                                        return false
                                    }
                                });
                            })

                            document.querySelector("#liveViewer").addEventListener("click", function(){
                                layer.close(index);
                                layer.prompt({
                                    formType: 0,
                                    title: that.lang.please_enter_live_room_num,
                                    btn : [that.lang.confirm, that.lang.cancel],
                                    yes: function (index, layero) {
                                        const value = $('#layui-layer'+index + " .layui-layer-input").val();
                                        if(value === ''){
                                            return
                                        }
                                        that.roomId = value;
                                        that.liveShareRole = "viewer"
                                        //观众进入的时候，用不上这个直播模式值，可以清空，也可以保持默认值不动
                                        that.liveShareMode = "";
                                        that.createMediaRoom("live");
                                        layer.close(index)
            
                                        that.socket.emit('message', {
                                            emitType: "startLiveShare",
                                            room: that.roomId,
                                            to : that.socketId,
                                            liveShareMode : that.liveShareMode,
                                            liveShareRole : that.liveShareRole
                                        });
                                        that.clickMediaLive();
                                        that.isLiveShare = !that.isLiveShare;
                                        that.addUserLogs(that.lang.start_live);
                                        return false
                                    }
                                });
                            })
                        }
                    });
                }
            },
            // 创建/加入语音连麦房间
            startAudioShare: function () {
                if (!this.switchData.openAudioShare) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                if (this.isVideoShare) {
                    layer.msg(this.lang.in_videoing)
                    this.addUserLogs(this.lang.in_videoing)
                    return
                }
                if (this.isLiveShare) {
                    layer.msg(this.lang.in_living)
                    this.addUserLogs(this.lang.in_living)
                    return
                }
                if (this.isScreenShare) {
                    layer.msg(this.lang.in_living)
                    this.addUserLogs(this.lang.in_living)
                    return
                }
                if (this.isAudioShare) {
                    window.Bus.$emit("stopAudioShare")
                    this.isAudioShare = !this.isAudioShare;
                    this.addUserLogs(this.lang.end_audio_sharing);
                    return   
                }
                if (this.isJoined) {
                    layer.msg(this.lang.please_exit_then_join_audio)
                    this.addUserLogs(this.lang.please_exit_then_join_audio)
                    return
                }
                let that = this;
                if(that.isShareJoin){ //分享进入
                    that.createMediaRoom("audio");
                    that.socket.emit('message', {
                        emitType: "startAudioShare",
                        room: that.roomId,
                        to : that.socketId
                    });
                    that.clickMediaAudio();
                    that.isAudioShare = !that.isAudioShare;
                    that.addUserLogs(that.lang.start_audio_sharing);
                }else{
                    layer.prompt({
                        formType: 0,
                        title: this.lang.please_enter_audio_sharing_room_num,
                        btn : [that.lang.confirm, that.lang.cancel],
                    }, function (value, index, elem) {
                        that.roomId = value;
                        that.createMediaRoom("audio");
                        layer.close(index)

                        that.socket.emit('message', {
                            emitType: "startAudioShare",
                            room: that.roomId,
                            to : that.socketId
                        });
                        that.clickMediaAudio();
                        that.isAudioShare = !that.isAudioShare;
                        that.addUserLogs(that.lang.start_audio_sharing);
                    });
                }
            },
            // 打开画笔
            openRemoteDraw : function(){
                let that = this;
                if (!this.switchData.openRemoteDraw) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }

                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_draw)
                    this.addUserLogs(this.lang.please_join_then_draw)
                    return
                }

                // 触发draw.js中的方法
                window.Bus.$emit("openDraw", {
                    openCallback: () => {
                        that.socket.emit('message', {
                            emitType: "startRemoteDraw",
                            room: that.roomId,
                            to: that.socketId
                        });
                    },
                    closeCallback: (drawCount) => {
                        that.socket.emit('message', {
                            emitType: "stopRemoteDraw",
                            room: that.roomId,
                            to: that.socketId,
                            drawCount : drawCount
                        });
                    },
                    localDrawCallback : (data) => {
                        Object.entries(that.remoteMap).forEach(([id, remote]) => {
                            if(remote && remote.sendDataChannel){
                                const sendDataChannel = remote.sendDataChannel;
                                if (!sendDataChannel || sendDataChannel.readyState !== 'open') {
                                    that.addSysLogs("sendDataChannel error in draw")
                                    return;
                                }
                                sendDataChannel.send(JSON.stringify(data));
                            }
                        });
                    }
                })
            },
            // 开始本地录制
            openLocalScreen: function () {
                let that = this;

                if (!this.switchData.openScreen) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }

                if (this.isMobile) {
                    layer.msg(this.lang.mobile_not_support_recording)
                    this.addUserLogs(this.lang.mobile_not_support_recording)
                    return
                }

                // 触发screen.js中的方法
                window.Bus.$emit("openLocalScreen", {
                    openCallback : () => {
                        that.socket.emit('message', {
                            emitType: "startScreen",
                            room: that.roomId,
                            to : that.socketId
                        });
                        that.addUserLogs(that.lang.start_local_screen_recording);
                    },
                    closeCallback : (res) => {
                        that.receiveFileRecoderList.push({
                            id: that.lang.web_screen_recording,
                            nickName : that.nickName,
                            href: res.src,
                            name: 'screen-recording-' + res.donwId + '.mp4',
                            type: "webm/mp4",
                            size: res.size,
                            progress: 100,
                            done: true,
                            start: 0,
                            cost: res.times,
                            indexedDB : false
                        })
                        that.socket.emit('message', {
                            emitType: "stopScreen",
                            to : that.socketId,
                            room: that.roomId,
                            size: res.size,
                            cost: res.times
                        });
                        that.addUserLogs(that.lang.end_local_screen_recording);
                    }
                });
            },
            // 打开公共聊天室
            openChatingComm: function () {
                if (!this.switchData.openCommRoom) {
                    layer.msg(this.lang.feature_close)
                    this.addUserLogs(this.lang.feature_close)
                    return
                }
                let that = this;
                let options = {
                    type: 1,
                    fixed: false, //不固定
                    maxmin: false,
                    shadeClose : true,
                    area: ['600px', '600px'],
                    title: this.lang.public_chat_channel,
                    end: function () {
                        if(that.chatCommFilterGood){
                            that.chatCommFilterGood = false;
                        }
                        if(that.chatCommFilterTop){
                            that.chatCommFilterTop = false;
                        }
                    },
                    success: function (layero, index) {
                        let lIndex = layer.load(1);
                        setTimeout(() => {
                            layer.close(lIndex)
                        }, 300);

                        if (window.layer && window.layui && window.layedit) {
                            that.txtEditId = layedit.build('chating_comm_value', {
                                tool: ['strong', 'del', 'face', 'closeImage', 'good', 'top'],
                                height: 100,
                                good : {
                                    goodCallback : function(){
                                        const goodDom = document.getElementById("layedit-good");
                                        if(goodDom){
                                            if(!that.chatCommFilterGood){
                                                goodDom.innerText = '取消精选'
                                            }else{
                                                goodDom.innerText = '精选消息'
                                            }
                                        }
                                        that.chatCommFilterGood = !that.chatCommFilterGood;
                                        that.chatingCommTpl();
                                    }
                                },
                                top : {
                                    topCallback : function(){
                                        const topDom = document.getElementById("layedit-top");
                                        if(topDom){
                                            if(!that.chatCommFilterTop){
                                                topDom.innerText = '取消置顶'
                                            }else{
                                                topDom.innerText = '置顶消息'
                                            }
                                        }
                                        that.chatCommFilterTop = !that.chatCommFilterTop;
                                        that.chatingCommTpl();
                                    }
                                }
                            });
                        }

                        that.chatingCommTpl();

                        if(window.tlrtcfile.chatKeydown){
                            let textareaIframe = document.getElementsByTagName("iframe");
                            if(textareaIframe && textareaIframe.length === 1){
                                tlrtcfile.chatKeydown(
                                    document.getElementsByTagName("iframe")[0].contentDocument.body, 
                                    that.sendChatingComm
                                )
                            }
                        }

                        document.getElementById("tl-sendChatingComm").addEventListener('click',function(){
                            that.sendChatingComm();
                        })

                        that.receiveChatCommList.forEach((item, index) => {
                            const id = "tl-rtc-file-content-copy" + index;
                            if(!document.getElementById(id)) return;
                            document.getElementById(id).addEventListener('click', function () {
                                tlrtcfile.copyTxt(id, item.msg, function () {
                                    layer.msg(that.lang.copy_success)
                                });
                                that.addUserLogs(that.lang.copy_success);
                            });
                        })
                    },
                    content: `
                        <div class="layui-col-sm12" style="padding: 15px;">
                            <div class="layui-card" id="chating_comm_tpl_view" style="padding: 5px;overflow-x: hidden;"> </div>
                            <script id="chating_comm_tpl" type="text/html">
                                <div style="text-align: center; color: #000000; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> -------- ${this.lang.only_show}${this.switchData.chatingCommCount || 10}${this.lang.history_msg} -------- </div>
                                {{#  layui.each(d, function(index, info){ }}
                                <div style="margin-bottom: 30px;display: inline-flex;">
                                    <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                    <div style="margin-left: 15px; margin-top: -5px;">
                                        <div style="word-break: break-all;"> 
                                            {{#  if(info.top) { }}
                                                <svg class="icon" aria-hidden="true" style="width: 24px;color:red;">
                                                    <use xlink:href="#icon-rtc-file-zhiding"></use>
                                                </svg>
                                            {{#  } }}
                                            <small>${this.lang.room}: <b>{{info.room}}</b></small> - 
                                            <small>${this.lang.user}: <b>{{info.socketId}}</b></small> - 
                                            <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small>
                                            <svg class="icon" aria-hidden="true" style="margin-left: 5px;cursor: pointer;" id="tl-rtc-file-content-copy{{index}}">
                                                <use xlink:href="#icon-rtc-file-fuzhi"></use>
                                            </svg>
                                            {{#  if(info.admin) { }}
                                                <svg class="icon" aria-hidden="true" style="width: 24px;height: 24px;color:#1e9fff;">
                                                    <use xlink:href="#icon-rtc-file-zhuip"></use>
                                                </svg>
                                            {{#  } }}
                                        </div>
                                        <div style="margin-top: 5px;word-break: break-all;">
                                            说: <b style="font-weight: bold; font-size: large;"> {{- info.msg}} </b>
                                        </div>
                                    </div>
                                </div>
                                {{#  }); }}
                            </script>
                        </div>
                        <div class="chating_input_body">
                            <textarea maxlength="50000" id="chating_comm_value" class="layui-textarea" placeholder="${this.lang.communication_rational} ~"></textarea>
                            <span class="chating_send_body chating_send_body_span">shift+enter | ${this.lang.enter_send} </span>
                            <button id="tl-sendChatingComm" type="button" class="layui-btn layui-btn-normal layui-btn-sm chating_send_body chating_send_body_button">${this.lang.send_chat}</button>
                        </div>
                    `
                }
                if (this.isMobile) {
                    delete options.area
                }
                layer.closeAll(function () {
                    let index = layer.open(options)
                    if (that.isMobile) {
                        layer.full(index)
                    }
                })
                this.addUserLogs(this.lang.open_public_chat_panel)
            },
            // 公共聊天室渲染数据
            chatingCommTpl: function () {
                let that = this;
                let tpl_html = document.getElementById("chating_comm_tpl");
                let tpl_view_html = document.getElementById("chating_comm_tpl_view");

                if (tpl_html && tpl_view_html) {

                    let filterList = this.receiveChatCommList;
                    if(this.chatCommFilterGood){
                        filterList = this.receiveChatCommList.filter(item => item.admin)
                    }else if(this.chatCommFilterTop){
                        filterList = this.receiveChatCommList.filter(item => item.top)
                    }

                    this.tpl(tpl_html, filterList, tpl_view_html)

                    let chatDom = document.querySelector("#chating_comm_tpl_view")
                    let chatDomHeight = chatDom.clientHeight

                    let height = 0;
                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 280;
                    } else {
                        height = 325
                    }

                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }

                    if(window.tlrtcfile.scrollToBottom){
                        window.tlrtcfile.scrollToBottom(chatDom, 1000, 100)
                    }
                }
            },
            // laytpl渲染
            tpl: function (tpl_html, data, tpl_view_html, callback) {
                if (window.laytpl) {
                    laytpl(tpl_html.innerHTML).render(data, (html) => {
                        tpl_view_html.innerHTML = html;
                        if (callback) {
                            callback()
                        }
                    });
                }
            },
            // 发送公共聊天室消息
            sendChatingComm: function () {
                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_send)
                    this.addUserLogs(this.lang.please_join_then_send)
                    return
                }

                let realContent = layedit.getContent(this.txtEditId)
                if (realContent.length <= 0) {
                    layer.msg(this.lang.please_fill_content)
                    this.addUserLogs(this.lang.please_fill_content)
                    return
                }

                if (realContent.length > 1000) {
                    layer.msg(this.lang.content_max_1000)
                    this.addUserLogs(this.lang.content_max_1000)
                    return
                }

                this.socket.emit('chatingComm', {
                    msg: tlrtcfile.escapeStr(realContent),
                    room: this.roomId,
                    socketId: this.socketId,
                });

                this.addUserLogs(this.lang.public_channel_send_done);

                this.chatingCommTpl();

                layedit.setContent(this.txtEditId, "", false)
            },
            // 加载系统房间消息
            loadSystemRoomMsg : async function(){
                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_send)
                    this.addUserLogs(this.lang.please_join_then_send);
                    return
                }

                if (!this.isSystemRoom) {
                    return;
                }

                let systemMsgList = [];
                let cacheList = localStorage.getItem('tl-rtc-file-question-list');
                let reflushCache = false;
                if(cacheList){
                    const { questionList, time } = JSON.parse(cacheList);
                    if(time > Date.now() - this.systemMsgCacheTime){
                        console.log("question list use cache")
                        systemMsgList = questionList || [];
                    }else{
                        reflushCache = true;
                    }
                }else{
                    reflushCache = true;
                }

                if(reflushCache){
                    console.log("question list use request")
                    let res = await axios.get('/api/dog/question/list');
                    if(res.data && res.data.code === 200){
                        systemMsgList = res.data.questionList || [];
                        localStorage.setItem('tl-rtc-file-question-list', JSON.stringify({
                            questionList : systemMsgList,
                            time : Date.now()
                        }));
                    }
                }

                systemMsgList.forEach(item => {
                    this.receiveChatRoomList.push({
                        socketId: item.socketId,
                        content: item.msg,
                        nickName : item.nickName ,
                        type : item.type,
                        time: item.time,
                        timeAgo : window.util ? util.timeAgo(item.time) : item.time
                    });
                })

                this.chatingRoomTpl();
            },
            // 房间内群聊弹窗
            openChatingRoom: function () {
                let that = this;
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false, //不固定
                        maxmin: false,
                        shadeClose : true,
                        area: ['600px', '600px'],
                        title: `【${this.roomId}】` + this.lang.chat_channel,
                        success: function (layero, index) {
                            if (window.layer && window.layui && window.layedit) {
                                that.txtEditId = layedit.build('chating_room_value', {
                                    tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face'],
                                    height: 100
                                });
                            }

                            that.chatingRoomTpl();

                            if(window.tlrtcfile.chatKeydown){
                                let textareaIframe = document.getElementsByTagName("iframe");
                                if(textareaIframe && textareaIframe.length === 1){
                                    tlrtcfile.chatKeydown(
                                        document.getElementsByTagName("iframe")[0].contentDocument.body, 
                                        that.sendChatingRoom
                                    )
                                }
                            }

                            document.getElementById("tl-sendChatingRoom").addEventListener("click",function(){
                                that.sendChatingRoom();
                            })

                            that.receiveChatRoomList.forEach((item, index) => {
                                const id = "tl-rtc-file-content-copy" + index;
                                if(!document.getElementById(id)) return;
                                document.getElementById(id).addEventListener('click', function () {
                                    tlrtcfile.copyTxt(id, item.content, function () {
                                        layer.msg(that.lang.copy_success)
                                    });
                                    that.addUserLogs(that.lang.copy_success);
                                });
                            })
                        },
                        content: `
                            <div class="layui-col-sm12" style="padding: 15px;">
                                <div id="chating_room_tpl_view" style="padding: 5px;"> </div>
                                <script id="chating_room_tpl" type="text/html">
                                    {{#  layui.each(d, function(index, info){ }}
                                        {{#  if(info.socketId !== '${this.socketId}') { }}
                                            <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                                <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                                <div style="margin-left: 15px; margin-top: -5px;width:100%;">
                                                    <div style="word-break: break-all;"> 
                                                        <small>${this.lang.user}: <b>{{info.nickName}}</b></small> - 
                                                        {{#  if(info.type === 'QUESTION') { }}
                                                            <svg class="icon" aria-hidden="true" style="width: 24px;height: 24px;">
                                                                <use xlink:href="#icon-rtc-file-wenda1"></use>
                                                            </svg>
                                                        {{#  }else if(info.type === 'ANSWER') { }}
                                                            <svg class="icon" aria-hidden="true" style="width: 24px; height: 24px; color: blueviolet;">
                                                                <use xlink:href="#icon-rtc-file-wenda"></use>
                                                            </svg>
                                                        {{#  } }}
                                                        <small>id: <b>{{info.socketId}}</b></small> - 
                                                        <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small> 
                                                        <svg class="icon" aria-hidden="true" style="margin-left: 5px;cursor: pointer;" id="tl-rtc-file-content-copy{{index}}">
                                                            <use xlink:href="#icon-rtc-file-fuzhi"></use>
                                                        </svg>
                                                    </div>
                                                    <div style="margin-top: 5px;word-break: break-all;width: 90%;"> 
                                                        <b style="font-weight: bold; font-size: large;"> {{- info.content}} </b>
                                                    </div>
                                                </div>
                                            </div>
                                            {{#  }else { }}
                                            <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                                <div style="margin-right: 15px; margin-top: -5px;width:100%;text-align: right;">
                                                    <div style="word-break: break-all;"> 
                                                        <small>${this.lang.self}: {{info.nickName}} </small> - 
                                                        <small>${this.lang.time}: <b>{{info.timeAgo}}</b></small> 
                                                    </div>
                                                    <div style="margin-top: 5px;word-break: break-all;width: 90%; margin-left: 10%;"> 
                                                        <b style="font-weight: bold; font-size: large;"> {{- info.content}} </b>
                                                    </div>
                                                </div>
                                                <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                            </div>
                                        {{#  } }}
                                    {{#  }); }}
                                </script>
                            </div>
                            <div class="chating_input_body">
                                <textarea maxlength="50000" id="chating_room_value" class="layui-textarea" placeholder="${this.lang.communication_rational} ~"></textarea>
                                <span class="chating_send_body chating_send_body_span">shift+enter | ${this.lang.enter_send} </span>
                                <button id="tl-sendChatingRoom" type="button" class="layui-btn layui-btn-normal layui-btn-sm chating_send_body chating_send_body_button">${this.lang.send_chat}</button>
                            </div>
                        `
                    }
                    if (this.isMobile) {
                        delete options.area
                    }
                    layer.closeAll(function () {
                        let index = layer.open(options)
                        if (that.isMobile) {
                            layer.full(index)
                        }
                    })
                }
                this.addUserLogs(this.lang.open_room_chat_panel)
            },
            // 房间内群聊渲染
            chatingRoomTpl: function () {
                let tpl_html = document.getElementById("chating_room_tpl");
                let tpl_view_html = document.getElementById("chating_room_tpl_view");

                if (tpl_html && tpl_view_html) {

                    this.tpl(tpl_html, this.receiveChatRoomList, tpl_view_html)

                    let chatDom = document.querySelector("#chating_room_tpl_view")
                    let chatDomHeight = chatDom.clientHeight

                    let height = 0;
                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 280;
                    } else {
                        height = 325
                    }

                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }

                    if(window.tlrtcfile.scrollToBottom){
                        window.tlrtcfile.scrollToBottom(chatDom, 1000, 100)
                    }
                }
            },
            // 房间内群聊发言
            sendChatingRoom: function () {
                if (!this.isJoined) {
                    layer.msg(this.lang.please_join_then_send)
                    this.addUserLogs(this.lang.please_join_then_send);
                    return
                }
                if (!this.hasManInRoom) {
                    layer.msg(this.lang.room_least_two_can_send_content)
                    this.addUserLogs(this.lang.room_least_two_can_send_content);
                    return
                }
                let realContent = layedit.getContent(this.txtEditId)
                if (realContent.length <= 0) {
                    layer.msg(this.lang.please_enter_content)
                    this.addUserLogs(this.lang.please_enter_content);
                    return
                }
                if (realContent.length > 10000) {
                    layer.msg(this.lang.content_max_10000)
                    this.addUserLogs(this.lang.content_max_10000);
                    return
                }

                this.socket.emit('chatingRoom', {
                    content: tlrtcfile.escapeStr(realContent),
                    room: this.roomId,
                    from: this.socketId,
                    nickName : this.nickName,
                    recoderId: this.recoderId
                });

                let now = new Date().toLocaleString();
                this.receiveChatRoomList.push({
                    socketId: this.socketId,
                    content: realContent,
                    nickName : this.nickName,
                    time: now,
                    timeAgo : window.util ? util.timeAgo(now) : now
                });

                this.chatingRoomTpl();

                layer.msg(this.lang.text_send_done)
                this.addUserLogs(this.lang.text_send_done);
                
                layedit.setContent(this.txtEditId, "", false)

                //清空系统记录缓存
                localStorage.removeItem('tl-rtc-file-question-list');
            },
            //创建文件发送房间
            createFileRoom: function () {
                this.openRoomInput = !this.openRoomInput;

                if(this.openRoomInput){
                    return
                }

                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    layer.msg(this.lang.please_enter_room_num)
                    this.addUserLogs(this.lang.please_enter_room_num);
                    return;
                }
                if (!this.switchData.allowChinese && window.tlrtcfile.containChinese(this.roomId)) {
                    layer.msg(this.lang.room_num_no_zh)
                    this.addUserLogs(this.lang.room_num_no_zh);
                    return;
                }
                if (!this.switchData.allowNumber && window.tlrtcfile.containNumber(this.roomId)) {
                    layer.msg(this.lang.room_num_no_number)
                    this.addUserLogs(this.lang.room_num_no_number);
                    return;
                }
                if (!this.switchData.allowSymbol && window.tlrtcfile.containSymbol(this.roomId)) {
                    layer.msg(this.lang.room_num_no_special_symbols)
                    this.addUserLogs(this.lang.room_num_no_special_symbols);
                    return;
                }
                if (this.chooseFileList.length > 0) {
                    layer.msg(this.lang.please_join_then_choose_file)
                    this.addUserLogs(this.lang.please_join_then_choose_file);
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        layer.msg(this.lang.room_num_too_long)
                        this.addUserLogs(this.lang.room_num_too_long);
                        return;
                    }
                    this.socket.emit('createAndJoin', {
                        room: this.roomId,
                        type : 'file',
                        nickName : this.nickName,
                        langMode : this.langMode,
                        ua: this.isMobile ? 'mobile' : 'pc',
                        network : this.network,
                        localNetRoom : this.useLocalNetworkRoomShare,
                        ips : this.ips,
                    });
                    this.isJoined = true;
                    this.addPopup({
                        title : this.lang.file_room,
                        msg : this.lang.you_enter_file_room + this.roomId
                    });
                    this.addUserLogs( this.lang.you_enter_file_room + this.roomId);
                }
            },
            //创建流媒体房间
            createMediaRoom: function (type) {
                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    layer.msg(this.lang.please_enter_room_num)
                    this.addUserLogs(this.lang.please_enter_room_num);
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        layer.msg(this.lang.room_num_too_long)
                        this.addUserLogs(this.lang.room_num_too_long);
                        return;
                    }
                    this.socket.emit('createAndJoin', { 
                        room: this.roomId,
                        type: type, 
                        nickName : this.nickName,
                        langMode : this.langMode,
                        ua: this.isMobile ? 'mobile' : 'pc',
                        network : this.network,
                        liveShareRole : this.liveShareRole,
                        localNetRoom : this.useLocalNetworkRoomShare,
                        ips : this.ips,
                    });
                    this.isJoined = true;
                    this.roomType = type;
                    this.addPopup({
                        title : this.lang.stream_room,
                        msg : this.lang.you_enter_stream_room + this.roomId
                    });
                    this.addUserLogs(this.lang.you_enter_stream_room + this.roomId);
                }
            },
            //创建密码房间
            createPasswordRoom: function (password) {
                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    layer.msg(this.lang.please_enter_room_num)
                    this.addUserLogs(this.lang.please_enter_room_num);
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        layer.msg(this.lang.room_num_too_long)
                        this.addUserLogs(this.lang.room_num_too_long);
                        return;
                    }
                    if (password.toString().length > 15) {
                        layer.msg(this.lang.password_too_long)
                        this.addUserLogs(this.lang.password_too_long);
                        return;
                    }
                    this.socket.emit('createAndJoin', { 
                        room: this.roomId, 
                        type : 'password', 
                        password: password, 
                        nickName : this.nickName,
                        langMode : this.langMode,
                        ua: this.isMobile ? 'mobile' : 'pc',
                        network : this.network,
                        localNetRoom : this.useLocalNetworkRoomShare,
                        ips : this.ips,
                    });
                    this.isJoined = true;
                    this.addPopup({
                        title : this.lang.password_room,
                        msg : this.lang.you_enter_password_room + this.roomId
                    });
                    this.addUserLogs(this.lang.you_enter_password_room + this.roomId);
                }
            },
            //退出房间
            exitRoom: function () {
                if (this.roomId) {
                    this.socket.emit('exit', {
                        from: this.socketId,
                        room: this.roomId,
                        recoderId: this.recoderId
                    });
                }
                for (let i in this.rtcConns) {
                    let rtcConnect = this.rtcConns[i];
                    rtcConnect.close();
                    rtcConnect = null;
                }

                window.location.reload();
            },
            //创立链接
            createRtcConnect: function (id) {
                if (id === undefined) {
                    return;
                }

                let that = this;
                let rtcConnect = new RTCPeerConnection(this.config);

                //ice
                rtcConnect.onicecandidate = (e) => {
                    that.iceCandidate(rtcConnect, id, e)
                };

                rtcConnect.oniceconnectionstatechange = (e) => {
                    that.addSysLogs("iceConnectionState: " + rtcConnect.iceConnectionState);

                    //如果是断开连接，并且没有使用turn服务器，提示开启turn服务器
                    if(rtcConnect.iceConnectionState === 'disconnected' && !this.useTurn){
                        layer.msg(that.lang.please_use_turn_server);
                        that.addSysLogs(that.lang.please_use_turn_server);
                    }
                    that.setRemoteInfo(id, {
                        iceConnectionState : rtcConnect.iceConnectionState
                    })
                }

                //媒体流通道
                rtcConnect.ontrack = (e) => {
                    that.mediaTrackHandler(e, id)
                };

                //文件发送数据通道
                let sendFileDataChannel = rtcConnect.createDataChannel('sendFileDataChannel');
                sendFileDataChannel.binaryType = 'arraybuffer';
                sendFileDataChannel.addEventListener('open', (event) => {
                    if (sendFileDataChannel.readyState === 'open') {
                        that.addSysLogs(that.lang.establish_connection)
                    }
                });
                sendFileDataChannel.addEventListener('close', (event) => {
                    if (sendFileDataChannel.readyState === 'close') {
                        that.addSysLogs(that.lang.connection_closed)
                    }
                });
                sendFileDataChannel.addEventListener('error', (error) => {
                    console.error(error.error)
                    that.addSysLogs(that.lang.connection_disconnected + ",file:e=" + error)
                    that.removeStream(null, id, null)
                });

                //自定义数据发送通道
                let sendDataChannel = rtcConnect.createDataChannel('sendDataChannel');
                sendDataChannel.binaryType = 'arraybuffer';
                sendDataChannel.addEventListener('open', (event) => {
                    if (sendDataChannel.readyState === 'open') {
                        that.addSysLogs(that.lang.establish_connection)
                    }
                });
                sendDataChannel.addEventListener('close', (event) => {
                    if (sendDataChannel.readyState === 'close') {
                        that.addSysLogs(that.lang.connection_closed)
                    }
                });
                sendDataChannel.addEventListener('error', (error) => {
                    console.error(error.error)
                    that.addSysLogs(that.lang.connection_disconnected + ",cus:e=" + error)
                    that.removeStream(null, id, null)
                });

                rtcConnect.addEventListener('datachannel', (event) => {
                    that.initReceiveDataChannel(event, id);
                });

                rtcConnect.onremovestream = (e) => {
                    that.removeStream(rtcConnect, id, e)
                };

                //保存peer连接
                this.rtcConns[id] = rtcConnect;
                if (!this.remoteMap[id]) {
                    Vue.set(this.remoteMap, id, { 
                        id: id, 
                        receiveChatRoomSingleList : [],
                        p2pMode : '识别中...',
                        sendFileDataChannel: sendFileDataChannel,
                        sendDataChannel : sendDataChannel
                    })
                }

                return rtcConnect;
            },
            //获取本地与远程连接
            getOrCreateRtcConnect: function (id) {
                // 获取rtc缓存连接
                let rtcConnect = this.rtcConns[id];
                // 不存在，创建一个
                if (typeof (rtcConnect) == 'undefined') {
                    rtcConnect = this.createRtcConnect(id);
                }
                return rtcConnect;
            },
            //远程媒体流处理
            mediaTrackHandler: function(event, id){
                let that = this;
                
                let video = null;

                const remoteRtc = this.getRemoteInfo(id);
                const remoteName = remoteRtc.nickName || "";

                if(event.track.kind === 'audio'){
                    // audio-track事件，除了语音连麦房间之外，其他都可以跳过，因为音视频/直播/屏幕共享他们的音频流都并入了video-track了
                    if(that.roomType !== 'audio'){
                        return
                    }

                    //连麦房间，只有音频数据
                    $(`#mediaAudioRoomList`).append(`
                        <div style="text-align: center;font-weight: bold;">${remoteName}</div>
                        <div class="tl-rtc-file-mask-media-video">
                            <video id="otherMediaAudioShare${id}" controls preload="auto" autoplay="autoplay" x-webkit-airplay="true" playsinline ="true" webkit-playsinline ="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" ></video>
                            <svg id="otherMediaAudioShareAudioOpenAnimSvg${id}" class="icon layui-anim layui-anim-scaleSpring layui-anim-loop" aria-hidden="true" style="width: auto; height: auto; position: absolute;animation-duration:.7s;max-width:50%;color:cadetblue;">
                                <use xlink:href="#icon-rtc-file-shengboyuyinxiaoxi"></use>
                            </svg>
                            <svg id="otherMediaAudioShareAudioCloseAnimSvg${id}" class="icon" aria-hidden="true" style="width: auto; height: auto; position: absolute;display:none;max-width:50%">
                                <use xlink:href="#icon-rtc-file-shengboyuyinxiaoxi"></use>
                            </svg>
                            <svg id="otherMediaAudioShareAudioOpenSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true">
                                <use xlink:href="#icon-rtc-file-maikefeng-XDY"></use>
                            </svg>
                            <svg id="otherMediaAudioShareAudioCloseSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true" style="display:none;">
                                <use xlink:href="#icon-rtc-file-guanbimaikefeng"></use>
                            </svg>
                        </div>
                    `);
                    video = document.querySelector(`#otherMediaAudioShare${id}`);
                }

                if(this.roomType === 'video'){
                    $(`#mediaVideoRoomList`).append(`
                        <div style="text-align: center;font-weight: bold;">${remoteName}</div>
                        <div class="tl-rtc-file-mask-media-video">
                            <video id="otherMediaVideoShare${id}" controls preload="auto" autoplay="autoplay" x-webkit-airplay="true" playsinline ="true" webkit-playsinline ="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" ></video>
                            <svg id="otherMediaVideoShareVideoSvg${id}" class="icon" aria-hidden="true" style="width: 100%;height: 100%;display:none;">
                                <use xlink:href="#icon-rtc-file-shexiangtou_guanbi"></use>
                            </svg>
                            <svg id="otherMediaVideoShareAudioOpenSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true">
                                <use xlink:href="#icon-rtc-file-maikefeng-XDY"></use>
                            </svg>
                            <svg id="otherMediaVideoShareAudioCloseSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true" style="display:none;">
                                <use xlink:href="#icon-rtc-file-guanbimaikefeng"></use>
                            </svg>
                        </div>
                    `);
                    video = document.querySelector(`#otherMediaVideoShare${id}`);
                } else if(this.roomType === 'screen'){
                    $(`#mediaScreenRoomList`).append(`
                        <div style="text-align: center;font-weight: bold;">${remoteName}</div>
                        <div class="tl-rtc-file-mask-media-video">
                            <video id="otherMediaScreenShare${id}" controls playsinline ="true" webkit-playsinline ="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" ></video>
                            <svg id="otherMediaScreenShareVideoSvg${id}" class="icon" aria-hidden="true" style="width: 100%;height: 100%;display:none;">
                                <use xlink:href="#icon-rtc-file-guanbipingmu"></use>
                            </svg>
                        </div>
                    `);
                    video = document.querySelector(`#otherMediaScreenShare${id}`);
                } else if(this.roomType === 'live'){

                    if(this.liveShareRole === 'viewer'){
                        $(`#mediaLiveRoomList`).append(`
                            <div style="text-align: center;font-weight: bold;">${remoteName}</div>
                            <div class="tl-rtc-file-mask-media-video">
                                <video id="otherMediaLiveShare${id}" controls playsinline ="true" webkit-playsinline ="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" ></video>
                                <svg id="otherMediaLiveShareVideoSvg${id}" class="icon" aria-hidden="true" style="width: 100%;height: 100%;display:none;">
                                    <use xlink:href="#icon-rtc-file-shexiangtou_guanbi"></use>
                                </svg>
                                <svg id="otherMediaLiveShareAudioOpenSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true">
                                    <use xlink:href="#icon-rtc-file-maikefeng-XDY"></use>
                                </svg>
                                <svg id="otherMediaLiveShareAudioCloseSvg${id}" class="tl-rtc-file-mask-media-video-other-audio" aria-hidden="true" style="display:none;">
                                    <use xlink:href="#icon-rtc-file-guanbimaikefeng"></use>
                                </svg>
                            </div>
                        `);
                    }
                    
                    video = document.querySelector(`#otherMediaLiveShare${id}`);
                }
            
                if(video){
                    video.addEventListener('loadedmetadata', function() {
                        video.play();
                        that.addSysLogs("loadedmetadata")
                        // ios 微信浏览器兼容问题
                        document.addEventListener('WeixinJSBridgeReady', function () {
                            that.addSysLogs("loadedmetadata WeixinJSBridgeReady")
                            video.play();
                        }, false);
                    });
                    document.addEventListener('WeixinJSBridgeReady', function () {
                        that.addSysLogs("WeixinJSBridgeReady")
                        video.play();
                    }, false);
                    video.srcObject = event.streams[0]
                    video.play();
                }
            },
            //编码组装发送文件数据，设置好每次分片的文件头信息
            encodeSendFileBuffer: function ({recoder, buffer, fragment, event}) {
                let fileInfoString = JSON.stringify({
                    i: recoder.index, //当前文件块所属的索引
                    f: fragment, //当前buffer所处的分片块
                });
                //填充
                const paddedFileInfoString = fileInfoString.padEnd(this.fileInfoBufferHeaderLen, '\0');
                const combindBuffer = new ArrayBuffer(this.fileInfoBufferHeaderLen + buffer.byteLength);

                const combinedUint8Array = new Uint8Array(combindBuffer);
                for (let i = 0; i < paddedFileInfoString.length; i++) {
                    combinedUint8Array[i] = paddedFileInfoString.charCodeAt(i);
                }
                combinedUint8Array.set(new Uint8Array(buffer), this.fileInfoBufferHeaderLen);

                return combindBuffer;
            },
            //解码组装接收文件数据
            decodeReceiveFileBuffer: function (buffer) {
                const receivedUint8Array = new Uint8Array(buffer);
                const fileInfoString = String.fromCharCode(...receivedUint8Array.slice(0, this.fileInfoBufferHeaderLen));
                const trimmedFileInfoString = fileInfoString.replace(/\0/g, '');
                const fileInfo = JSON.parse(trimmedFileInfoString);
                return {
                    buffer: receivedUint8Array.slice(this.fileInfoBufferHeaderLen), 
                    index: fileInfo.i,
                    fragment: fileInfo.f
                }
            },
            //每个记录发送完毕后都检查下是否全部发送完
            allFileSendedCheckHandler : function(){
                let allDone = this.sendFileRecoderList.filter(item => {
                    return item.done;
                }).length === this.sendFileRecoderList.length;

                // 全部发完
                if(allDone){
                    this.chooseFileList = []
                    this.sendFileRecoderList = []
                    this.chooseFileRecoderList = []
                    this.chooseFileRecoderAutoNext = false;
                    this.addPopup({
                        title : this.lang.send_file,
                        msg : this.lang.file_send_done
                    });
                    this.addSysLogs(this.lang.file_send_done)
                    this.allSended = true;
                    this.isSending = false;

                    return true
                }

                //在每次发送完后的检查时, 过滤掉已经发送完毕的记录
                this.chooseFileRecoderList = this.chooseFileRecoderList.filter(item=>{
                    return !item.done;
                });

                // 在每次发送完后的检查时，如果是开启了自动排队发送，调用自动发送
                if(this.chooseFileRecoderAutoNext){
                    this.sendFileToSingleAuto();
                }

                return false
            },
            // 指定单独发送文件给用户
            sendFileToSingle: function(recoder){
                layer.msg(`${this.lang.send_to_user_separately} ${recoder.id}`)

                if(!this.hasManInRoom){
                    layer.msg(this.lang.room_least_two_can_send_content)
                    return
                }

                this.chooseFileRecoderList = [recoder];
                this.sendFileRecoderInfo();
            },
            // 自动单独发送文件给用户
            sendFileToSingleAuto: function(){
                if(!this.hasManInRoom){
                    layer.msg(this.lang.room_least_two_can_send_content)
                    return
                }

                //当前自动切换文件是开启的
                if(this.chooseFileRecoderAutoNext){
                    let chooseRecoder = this.sendFileRecoderList.filter(item=>{
                        return !item.done;
                    }).shift();
    
                    if(chooseRecoder){
                        setTimeout(() => {
                            this.chooseFileRecoderList = [chooseRecoder];
                            this.sendFileRecoderInfo();   
                        }, 1000);
                    }
                }
            },
            // 一键发送 , 根据设置的规则自动选择发送模式，支持自动排队发送，并发发送
            sendFileToAll: function(){
                layer.msg(`${this.lang.send_to_all_user}`)

                if(!this.hasManInRoom){
                    layer.msg(this.lang.room_least_two_can_send_content)
                    return
                }

                let hasMoreBigFile = this.sendFileRecoderList.filter(item=>{
                    return item.size > this.bigFileMaxSize
                }).length > this.bigFileMaxCount;

                let hasLongFileQueue = this.sendFileRecoderList.filter(item=>{
                    return !item.done;
                }).length > this.longFileQueueMaxSize;
                
                //超过规则范围，自动排队发送
                if(hasMoreBigFile || hasLongFileQueue){
                    this.chooseFileRecoderAutoNext = true;
                    this.sendFileToSingleAuto();
                    return
                }
                
                //如果不是单独发送某个记录，就需要处理全部记录
                this.chooseFileRecoderList = this.sendFileRecoderList.filter(item=>{
                    return !item.done;
                })
                this.sendFileRecoderInfo();
            },
            // 多记录并发发送文件基本信息
            sendFileRecoderInfo : function(){
                // 提前发送文件基础信息
                this.chooseFileRecoderList.forEach(chooseRecoder => {
                    this.socket.emit('message', {
                        emitType: "sendFileInfo",
                        index: chooseRecoder.index,
                        name: chooseRecoder.name,
                        type: chooseRecoder.type,
                        size: chooseRecoder.size,
                        room: this.roomId,
                        from: this.socketId,
                        nickName : this.nickName,
                        to: chooseRecoder.id,
                        recoderId: this.recoderId
                    });
                })
            },
            // 多记录并行发送文件数据
            sendFileRecoderData: function () {
                let that = this;

                this.chooseFileRecoderList.forEach(chooseRecoder => {
                    let filterFile = that.chooseFileList.filter(item => {
                        return item.index === chooseRecoder.index;
                    });
                    if(filterFile.length === 0){
                        return
                    }

                    let chooseFile = filterFile[0];
                    let fileReader = chooseRecoder.reader;

                    fileReader.addEventListener('loadend', (event) => {
                        that.sendFileToRemoteByRecoder(event.target.result, chooseRecoder, chooseFile);
                    });
    
                    fileReader.addEventListener('error', error => {
                        that.addSysLogs(that.lang.read_file_error + " : " + error);
                    });
    
                    fileReader.addEventListener('abort', event => {
                        that.addSysLogs(that.lang.read_file_interrupt + " : " + event);
                    });

                    that.readAsArrayBufferByOffset(0, chooseFile, chooseRecoder)
                })
            },
            // 一次发送一个文件给一个用户
            sendFileToRemoteByRecoder: function (buffer, chooseRecoder, chooseFile) {
                let that = this;
                if (!chooseRecoder) {
                    return
                }

                let remote = this.getRemoteInfo(chooseRecoder.id);
                let fileOffset = remote[chooseRecoder.index + "offset"]
                let sendFileDataChannel = remote.sendFileDataChannel;
                if (!sendFileDataChannel || sendFileDataChannel.readyState !== 'open') {
                    this.addSysLogs(this.lang.file_send_channel_not_establish)
                    return;
                }

                this.setRemoteInfo(chooseRecoder.id, {
                    [chooseRecoder.index + "status"]: 'sending'
                })

                this.isSending = true;

                // 开始发送通知
                if (fileOffset === 0) {
                    this.addPopup({
                        title : this.lang.send_file,
                        msg : this.lang.sending_to + chooseRecoder.id.substr(0, 4) + ",0%。"
                    });
                    this.addSysLogs(this.lang.sending_to + chooseRecoder.id.substr(0, 4) + ",0%。")
                    this.updateSendFileRecoderProgress(chooseRecoder.id, {
                        start: Date.now()
                    }, chooseRecoder)
                }

                //缓冲区暂定 256kb
                sendFileDataChannel.bufferedAmountLowThreshold = 16 * 1024 * 16;
                //局域网一般不会走缓冲区，所以bufferedAmount一般为0，公网部分情况受限于带宽，bufferedAmount可能会逐渐堆积，从而进行排队
                if (sendFileDataChannel.bufferedAmount > sendFileDataChannel.bufferedAmountLowThreshold) {
                    this.addSysLogs(
                        that.lang.file_send_channel_buffer_full + ",bufferedAmount=" + 
                        sendFileDataChannel.bufferedAmount + ",bufferedAmountLowThreshold=" + 
                        sendFileDataChannel.bufferedAmountLowThreshold
                    )
                    sendFileDataChannel.onbufferedamountlow = () => {
                        that.addSysLogs(
                            that.lang.file_send_channel_buffer_recover + ",bufferedAmount=" + 
                            sendFileDataChannel.bufferedAmount
                        )
                        sendFileDataChannel.onbufferedamountlow = null;
                        that.sendFileToRemoteByRecoder(buffer, chooseRecoder, chooseFile);
                    }
                    return;
                }

                // 发送数据
                sendFileDataChannel.send(this.encodeSendFileBuffer({
                    recoder : chooseRecoder, 
                    fragment : parseInt(fileOffset / this.chunkSize),
                    buffer : buffer,
                }));

                fileOffset += buffer.byteLength;
                remote[chooseRecoder.index + "offset"] = fileOffset
                this.currentSendAllSize += buffer.byteLength;

                //更新发送进度
                this.updateSendFileRecoderProgress(chooseRecoder.id, {
                    progress: ((fileOffset / chooseRecoder.size) * 100).toFixed(3) || 0
                }, chooseRecoder)

                //发送完一份重置相关数据
                if (fileOffset === chooseRecoder.size) {
                    this.addPopup({
                        title : this.lang.send_file,
                        msg : this.lang.sending_to + chooseRecoder.id.substr(0, 4) + ",100%。"
                    });
                    this.addSysLogs(this.lang.sending_to + chooseRecoder.id.substr(0, 4) + ",100%。")
                    this.socket.emit('message', {
                        emitType: "sendDone",
                        room: this.roomId,
                        from: this.socketId,
                        size: chooseRecoder.size,
                        name: chooseRecoder.name,
                        type: chooseRecoder.type,
                        to: chooseRecoder.id
                    });
                    //更新发送进度
                    this.updateSendFileRecoderProgress(chooseRecoder.id, {
                        progress: 100,
                        done: true
                    }, chooseRecoder)

                    this.setRemoteInfo(chooseRecoder.id, {
                        [chooseRecoder.index + "status"]: 'done'
                    })

                    this.isSending = false;

                    //检查全部发送完毕
                    this.allFileSendedCheckHandler()
                }

                if(fileOffset < chooseRecoder.size){
                    this.readAsArrayBufferByOffset(fileOffset, chooseFile, chooseRecoder);
                }
            },
            // 分片读取文件
            readAsArrayBufferByOffset: function ( offset, chooseFile, chooseRecoder) {
                let slice = chooseFile.slice(offset, offset + this.chunkSize);
                let fileReader = chooseRecoder.reader;
                fileReader.readAsArrayBuffer(slice);
            },
            //初始化接收数据事件
            initReceiveDataChannel: function (event, id) {
                if (!id || !event) {
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                if (!currentRtc) {
                    return
                }

                let receiveChannel = event.channel;

                //文件接收
                if(receiveChannel.label === 'sendFileDataChannel'){
                    receiveChannel.binaryType = 'arraybuffer';
                    receiveChannel.onmessage = (evt) => {
                        if(this.canSaveToIndexedDb && this.useIndexedDb){
                            this.receiveFileDataToIndexedDb(evt, id);
                        }else{
                            this.receiveFileDataToMemery(evt, id);
                        }
                    };
                    receiveChannel.onopen = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs(this.lang.file_receive_channel_ready + readyState)
                    };
                    receiveChannel.onclose = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs(this.lang.file_receive_channel_closed + readyState)
                    };
                    this.setRemoteInfo(id, { receiveFileDataChannel: receiveChannel });
                }

                //自定义数据接收
                if(receiveChannel.label === 'sendDataChannel'){
                    receiveChannel.binaryType = 'arraybuffer';
                    receiveChannel.onmessage = (evt) => {
                        //接收自定义数据 , 暂时用做远程画笔数据接收
                        if (!evt || !id) {
                            return;
                        }
                        let data = JSON.parse(evt.data) || {};
                        window.Bus.$emit("openRemoteDraw", data)
                    }
                    receiveChannel.onopen = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs(this.lang.custom_data_receive_channel_ready + readyState)
                    };
                    receiveChannel.onclose = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs(this.lang.custom_data_receive_channel_closed + readyState)
                    };
                    this.setRemoteInfo(id, { receiveDataChannel: receiveChannel });
                }
            },
            //接收文件 (使用indexedDb接收，不占用内存)
            receiveFileDataToIndexedDb: function (event, id) {
                let that = this;
                if (!event || !id) {
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                if(!currentRtc){
                    return;
                }

                //解析数据
                let { index, fragment, buffer } = this.decodeReceiveFileBuffer(event.data);

                //接收文件总大小
                this.receivedFileAllSize += buffer.byteLength;

                // 文件数据 大小/数据
                let receiveFileMap = currentRtc.receiveFileMap;
                let receiveRecoder = receiveFileMap[index];
                let receivedSize = receiveRecoder.receivedSize;
                receivedSize += buffer.byteLength;
                receiveFileMap[index].receivedSize = receivedSize;
                let receivedBuffer = receiveRecoder.receivedBuffer;
                receivedBuffer.push(buffer);
                receiveFileMap[index].receivedBuffer = receivedBuffer;

                // 文件信息
                let receiveFileRecoder = this.receiveFileRecoderList.filter(item=>{
                    return item.index === index;
                })[0];

                //当前接收的文件基本信息
                let name = receiveFileRecoder.name;
                let size = receiveFileRecoder.size;
                let type = receiveFileRecoder.type;

                //1000分片存储一次, 默认16M一组 = chunkSize * 1000
                if(fragment % 1000 === 0){
                    this.saveSliceFileBufferToIndexedDb(receiveFileRecoder, fragment, receivedBuffer);
                    receiveFileMap[index].receivedBuffer = new Array();
                }
                this.setRemoteInfo(id, { receiveFileMap : receiveFileMap});
                
                //更新接收进度
                this.updateReceiveFileRecoderProgress(id, {
                    progress: ((receivedSize / size) * 100).toFixed(3) || 0,
                    fragment : fragment
                }, receiveFileRecoder);

                //接收完毕
                if (receivedSize === size) {
                    this.addSysLogs(name + this.lang.save_file_to_indexeddb);
                    this.addPopup({
                        title : this.lang.file_receive,
                        msg : "[ " + name + " ]" + this.lang.save_file_to_indexeddb
                    });

                    //发送完毕后，如果buffer还有剩余不满1000分片的数据，也要存储
                    if(receivedBuffer.length >= 0){
                        this.saveSliceFileBufferToIndexedDb(receiveFileRecoder, fragment, receivedBuffer);
                    }

                    // 更新接收进度
                    this.updateReceiveFileRecoderProgress(id, {
                        progress: 100,
                        done: true,
                    }, receiveFileRecoder);

                    // 更新indexeddb中的文件信息
                    this.saveSliceFileInfoToIndexedDb(Object.assign({
                        progress: 100,
                        done: true,
                    }, receiveFileRecoder));

                    //清除接收的数据缓存
                    receiveFileMap[index].receivedBuffer = new Array();
                    receiveFileMap[index].receivedSize = 0;
                    this.setRemoteInfo(id, { receiveFileMap })
                }
            },
            //接收文件 (使用内存接收)
            receiveFileDataToMemery: function (event, id) {
                let that = this;
                if (!event || !id) {
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                if(!currentRtc){
                    return;
                }

                //解析数据
                let { index, fragment, buffer } = this.decodeReceiveFileBuffer(event.data);

                let receiveFileMap = currentRtc.receiveFileMap;
                let receiveRecoder = receiveFileMap[index];
                //当前接收的文件相关数据/大小
                let receivedBuffer = receiveRecoder.receivedBuffer;
                let receivedSize = receiveRecoder.receivedSize;

                //当前接收的文件基本信息
                let receiveFileRecoder = this.receiveFileRecoderList.filter(item=>{
                    return item.index === index;
                })[0];
                let name = receiveFileRecoder.name;
                let size = receiveFileRecoder.size;
                let type = receiveFileRecoder.type;

                //接收数据
                receivedBuffer.push(buffer);
                receivedSize += buffer.byteLength;

                //接收文件总大小
                this.receivedFileAllSize += buffer.byteLength;

                receiveFileMap[index].receivedBuffer = receivedBuffer;
                receiveFileMap[index].receivedSize = receivedSize;
                this.setRemoteInfo(id, { receiveFileMap : receiveFileMap})

                //更新接收进度
                this.updateReceiveFileRecoderProgress(id, {
                    progress: ((receivedSize / size) * 100).toFixed(3) || 0
                }, receiveFileRecoder);

                if (receivedSize === size) {
                    this.addSysLogs(name + this.lang.receive_done);
                    this.addPopup({
                        title : this.lang.file_receive,
                        msg : "[ " + name + " ]" + this.lang.receive_done
                    });

                    //更新接收进度
                    this.updateReceiveFileRecoderProgress(id, {
                        progress: 100,
                        href: URL.createObjectURL(new Blob(receivedBuffer), { type: type }),
                        done: true,
                    }, receiveFileRecoder);

                    //清除接收的数据缓存
                    receiveFileMap[index].receivedBuffer = new Array();
                    receiveFileMap[index].receivedSize = 0;
                    this.setRemoteInfo(id, { receiveFileMap })
                }
            },
            //关闭连接
            closeDataChannels: function () {
                for (let remote in this.remoteMap) {
                    let id = remote.id;
                    if(!id) continue;

                    let sendFileDataChannel = remote.sendFileDataChannel;
                    if(sendFileDataChannel){
                        sendFileDataChannel.close();
                    }
                    let sendDataChannel = remote.sendDataChannel;
                    if(sendDataChannel){
                        sendDataChannel.close();
                    }
                    let receiveFileDataChannel = remote.receiveFileDataChannel;
                    if(receiveFileDataChannel){
                        receiveFileDataChannel.close();
                    }
                    let receiveDataChannel = remote.receiveDataChannel;
                    if(receiveDataChannel){
                        receiveDataChannel.close();
                    }
                }
            },
            //设置rtc缓存远程连接数据
            setRemoteInfo(id, data) {
                if (!id || !data) {
                    return;
                }
                let oldData = this.remoteMap[id];
                if (oldData) {
                    Object.assign(oldData, data);
                    Vue.set(this.remoteMap, id, oldData);
                }
            },
            //更新接收进度
            updateReceiveFileRecoderProgress: function (id, data, recoder) {
                for (let i = 0; i < this.receiveFileRecoderList.length; i++) {
                    let item = this.receiveFileRecoderList[i];
                    if (item.id === id && item.index === recoder.index && !item.done) {
                        if (item.start === 0) {
                            item.start = Date.now();
                        }
                        data.cost = ((Date.now() - item.start) / 1000).toFixed(3)
                        Object.assign(this.receiveFileRecoderList[i], data);
                    }
                }
                this.$forceUpdate();
            },
            //更新文件发送进度
            updateSendFileRecoderProgress: function (id, data, recoder) {
                for (let i = 0; i < this.sendFileRecoderList.length; i++) {
                    let item = this.sendFileRecoderList[i];
                    if (item.id === id && item.index === recoder.index && !item.done) {
                        data.cost = ((Date.now() - item.start) / 1000).toFixed(3);
                        Object.assign(this.sendFileRecoderList[i], data);

                        if(data.done){ // 发送完毕，统计到历史记录
                            this.sendFileRecoderHistoryList.push(this.sendFileRecoderList[i])
                        }
                    }
                }
                this.$forceUpdate();
            },
            //更新文件暂存状态
            updateSendFileRecoderUpload: function (index, data) {
                for (let i = 0; i < this.sendFileRecoderList.length; i++) {
                    let item = this.sendFileRecoderList[i];
                    if (item.index === index) {
                        Object.assign(this.sendFileRecoderList[i], data);
                    }
                }
                this.$forceUpdate();
            },
            //获取rtc缓存远程连接数据
            getRemoteInfo(id) {
                if (!id) {
                    return;
                }
                return this.remoteMap[id];
            },
            //移除rtc连接
            removeStream: function (rtcConnect, id, event) {
                this.getOrCreateRtcConnect(id).close;
                const remoteInfo = this.getRemoteInfo(id) || {};
                const removeIsOwner = remoteInfo.owner;

                delete this.rtcConns[id];
                delete this.remoteMap[id];

                //断开连接的时候，剔除此用户的发送记录
                this.sendFileRecoderList = this.sendFileRecoderList.filter(item => {
                    return item.id !== id;
                })

                if(['live','video','screen','audio'].includes(this.roomType)){
                    //主播异常关闭直播，观众页面强制刷新
                    if(this.roomType === 'live' && removeIsOwner){
                        window.location.reload()
                    }

                    //多人音视频/多人屏幕共享，有人异常退出，移除对应的video标签
                    if(this.roomType === 'video' || this.roomType === 'screen' || this.roomType === 'audio'){
                        $(`#otherMediaVideoShare${id}`).parent().remove();
                    }
                }
            },
            // ice
            iceCandidate: function (rtcConnect, id, event) {
                if (event.candidate != null) {
                    let message = {
                        from: this.socketId,
                        to: id,
                        room: this.roomId,
                        sdpMid: event.candidate.sdpMid,
                        sdpMLineIndex: event.candidate.sdpMLineIndex,
                        sdp: event.candidate.candidate
                    };
                    this.socket.emit('candidate', message);
                }
            },
            // offer
            offerSuccess: function (rtcConnect, id, offer) {
                rtcConnect.setLocalDescription(offer).then(r => { })
                let message = {
                    from: this.socketId,
                    to: id,
                    room: this.roomId,
                    sdp: offer.sdp
                };
                this.socket.emit('offer', message);
            },
            // offer
            offerFailed: function (rtcConnect, id, error) {
                this.addSysLogs(this.lang.offer_failed + error);
            },
            // answer
            answerSuccess: function (rtcConnect, id, offer) {
                rtcConnect.setLocalDescription(offer).then(r => { });
                let message = {
                    from: this.socketId,
                    to: id,
                    room: this.roomId,
                    sdp: offer.sdp
                };
                this.socket.emit('answer', message);
            },
            // answer
            answerFailed: function (rtcConnect, id, error) {
                this.addSysLogs(this.lang.answer_failed + error);
            },
            //ice
            addIceCandidateSuccess: function (res) {
                this.addSysLogs(this.lang.add_ice_candidate_success);
            },
            //ice
            addIceCandidateFailed: function (err) {
                this.addSysLogs(this.lang.add_ice_candidate_failed + err);
            },
            //事件监听
            socketListener: function () {
                let that = this;

                this.socket.on("localNetRoom", data => {
                    const { mode, list } = data;
                    if(mode === 'connect'){
                        that.localNetRoomList = data.list || [];
                    }else if(mode === 'join'){
                        let newList = that.localNetRoomList.filter(item => { return item.owner !== list[0].owner });
                        newList.push(list[0]);
                        that.localNetRoomList = newList;
                    }else if(mode === 'exit'){
                        let newList = that.localNetRoomList.filter(item => { return item.owner !== list[0].owner });
                        if(list[0].count === 0){ //退出后房间没人了，清理
                            that.localNetRoomList = newList;
                        }else{ // 退出后房间还有人，更新
                            newList.push(list[0]);
                            that.localNetRoomList = newList;
                        }
                    }
                    if(that.localNetRoomList.length === 0 && that.showLocalNetRoom){
                        that.clickLocalNetRooms(true);
                    }
                })

                this.socket.on("heartbeat", data => {
                    if(data.status === 'ok'){
                        that.addSysLogs(that.lang.websocketHeartBeatCheckOk + ": " + data.status);
                        //心跳检测失败次数大于0，说明之前是失败的，现在恢复了，刷新页面
                        if(that.socketHeartbeatFaild > 0){ 
                            window.location.reload();
                        }
                        that.socketHeartbeatFaild = 0;
                    }else{
                        that.socketHeartbeatFaild += 1;
                        that.addSysLogs(that.lang.websocketHeartBeatCheckFail + ": " + JSON.stringify(data));
                    }
                })

                this.socket.on('connect_error', error => {
                    console.error('connect_error', error);
                    if(error){
                        layer.msg(that.lang.socketConnectFail + "[" + that.wsHost + "], " + error.message );
                        that.addSysLogs(that.lang.socketConnectFail + "[" + that.wsHost + "], " + error.message);
                    }
                    that.socketHeartbeatFaild += 1;
                    that.addSysLogs(that.lang.websocketHeartBeatCheckFail + ": " + that.socketHeartbeatFaild);
                });

                // created作用是让自己去和其他人建立rtc连接
                // 1. 对于screen, video房间来说，是双方都需要传输各自的媒体流
                // 2. 对于live房间来说，只有房主需要获取媒体流
                this.socket.on('created', async function (data) {
                    that.addSysLogs(that.lang.receive_create_room_event + JSON.stringify(data));
                    that.socketId = data.id;
                    that.roomId = data.room;
                    that.recoderId = data.recoderId;
                    that.owner = data.owner;

                    //第一个人进入时，获取媒体流数据，此时无需addTrack，因为房间只有一个连接，addTrack没意义，
                    //因为一个连接无需进行offer收集，offer信息收集是从第二个连接开始。
                    if(data.peers.length === 0){
                        if(data.type === 'screen'){
                            window.Bus.$emit("startScreenShare");
                        }
                        if(data.type === 'video'){
                            window.Bus.$emit("startVideoShare", that.videoConstraints);
                        }
                        if(data.type === 'audio'){
                            window.Bus.$emit("startAudioShare");
                        }
                        if(data.type === 'live'){
                            window.Bus.$emit("startLiveShare", {
                                liveShareMode : that.liveShareMode,
                                liveShareRole : that.liveShareRole
                            });
                        }
                    }

                    for (let i = 0; i < data.peers.length; i++) {
                        let otherSocketId = data.peers[i].id;
                        let otherRtcConnect = that.getOrCreateRtcConnect(otherSocketId);
                        // 处理完连接后，更新下昵称
                        that.setRemoteInfo(otherSocketId, { 
                            nickName : data.peers[i].nickName,
                            langMode : data.peers[i].langMode,
                            owner : data.peers[i].owner,
                            ua : data.peers[i].ua,
                            joinTime : data.peers[i].joinTime,
                            userAgent : data.peers[i].userAgent,
                            ip : data.peers[i].ip,
                            network : data.peers[i].network,
                        })

                        await new Promise(resolve => {
                            if(data.type === 'screen'){
                                window.Bus.$emit("startScreenShare", (track, stream) => {
                                    //其他人将数据流添加到通道中, 此时需要addTrack，因为后面会有offer收集，然后进行answer ...等后续操作
                                    otherRtcConnect.addTrack(track, stream);
                                    resolve()
                                });
                            }else if(data.type === 'video'){
                                window.Bus.$emit("startVideoShare", that.videoConstraints, (track, stream) => {
                                     //其他人将数据流添加到通道中, 此时需要addTrack，因为后面会有offer收集，然后进行answer ...等后续操作
                                    otherRtcConnect.addTrack(track, stream);
                                    resolve()
                                });
                            }else if(data.type === 'audio'){
                                window.Bus.$emit("startAudioShare", (track, stream) => {
                                     //其他人将数据流添加到通道中, 此时需要addTrack，因为后面会有offer收集，然后进行answer ...等后续操作
                                    otherRtcConnect.addTrack(track, stream);
                                    resolve()
                                });
                            }else{
                                resolve();
                            }
                        }).then(()=>{
                            otherRtcConnect.createOffer(that.options).then(offer => {
                                that.offerSuccess(otherRtcConnect, otherSocketId, offer);
                            }, error => {
                                that.offerFailed(otherRtcConnect, otherSocketId, error);
                            });
                        });
                    }
                });

                // join的作用是通知其他人，我加入进来了
                this.socket.on('joined', function (data) {
                    that.addSysLogs(that.lang.receive_join_room_event + JSON.stringify(data));
                    that.recoderId = data.recoderId;
                    let rtcConnect = that.getOrCreateRtcConnect(data.id);
                    // 处理完连接后，更新下昵称
                    that.setRemoteInfo(data.id, {
                        nickName : data.nickName,
                        owner : data.owner,
                        langMode : data.langMode,
                        ua : data.ua,
                        network : data.network,
                        joinTime : data.joinTime,
                        userAgent : data.userAgent,
                        ip : data.ip,
                    })
                    
                    //这部分逻辑主要是将比当前加入连接更早加入的连接媒体流添加到track中
                    //以便于当前加入的连接可以收到之前的连接的媒体流数据

                    if (data.type === 'screen') {
                        //比如多人屏幕共享，后面加入的连接已经在created事件中addTrack了
                        //所以这个地方主要是通知当前连接之前的那一些连接进行addTrack，以便于当前连接能收到
                        window.Bus.$emit("getScreenShareTrackAndStream", (track, stream) => {
                            rtcConnect.addTrack(track, stream);
                        });
                    }
                    
                    if (data.type === 'video') {
                        //比如多人音视频，后面加入的连接已经在created事件中addTrack了
                        //所以这个地方主要是通知当前连接之前的那一些连接进行addTrack，以便于当前连接能收到
                        window.Bus.$emit("getVideoShareTrackAndStream", (track, stream) => {
                            rtcConnect.addTrack(track, stream);
                        });
                    }

                    if (data.type === 'audio') {
                        //比如多人语音连麦，后面加入的连接已经在created事件中addTrack了
                        //所以这个地方主要是通知当前连接之前的那一些连接进行addTrack，以便于当前连接能收到
                        window.Bus.$emit("getAudioShareTrackAndStream", (track, stream) => {
                            rtcConnect.addTrack(track, stream);
                        });
                    }
                    
                    if (data.type === 'live') {
                        //比如直播，后面加入的都是观众，所以每个观众加入的时候，都会通知一下所有人可以添加媒体流到通道了（这里就是只有房主有媒体流数据）
                        window.Bus.$emit("getLiveShareTrackAndStream", (track, stream) => {
                            rtcConnect.addTrack(track, stream);
                        });
                    }

                    that.addPopup({
                        title : that.lang.join_room,
                        msg : data.nickName + that.lang.join_room
                    });
                });


                this.socket.on('offer', function (data) {
                    that.addSysLogs(that.lang.receive_offer_event + JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'offer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
                    rtcConnect.createAnswer(that.options).then((offer) => {
                        that.answerSuccess(rtcConnect, data.from, offer)
                    }).catch((error) => {
                        that.answerFailed(rtcConnect, data.from, error)
                    });
                });

                this.socket.on('answer', function (data) {
                    that.addSysLogs(that.lang.receive_answer_event + JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'answer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
                });

                this.socket.on('candidate', function (data) {
                    that.addSysLogs(that.lang.receive_candidate_event + JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcIceCandidate = new RTCIceCandidate({
                        candidate: data.sdp,
                        sdpMid: data.sdpMid,
                        sdpMLineIndex: data.sdpMLineIndex
                    });
                    rtcConnect.addIceCandidate(rtcIceCandidate).then(res => {
                        that.addIceCandidateSuccess(res);
                    }).catch(error => {
                        that.addIceCandidateFailed(error);
                    });
                });

                this.socket.on('exit', function (data) {
                    var rtcConnect = that.rtcConns[data.from];
                    if (typeof (rtcConnect) == 'undefined') {
                        return;
                    } else {
                        that.addPopup({
                            title : that.lang.exit_room,
                            msg : data.from + that.lang.exit_room
                        });
                        that.addSysLogs(that.lang.exit_room + JSON.stringify(data));
                        that.getOrCreateRtcConnect(data.from).close;
                        delete that.rtcConns[data.from];
                        Vue.delete(that.remoteMap, data.from);
                    }
                    that.touchResize();
                })

                //选中文件时发送给接收方
                this.socket.on('sendFileInfo', function (data) {
                    that.addPopup({
                        title : that.lang.send_file,
                        msg : data.from + that.lang.selected_file + "[ " + data.name + " ], "+that.lang.will_send
                    });
                    that.addSysLogs(data.from + that.lang.selected_file + "[ " + data.name + " ], "+that.lang.will_send);

                    let fromId = data.from;
                    let { receiveFileMap = {} } = that.getRemoteInfo(fromId);
                    receiveFileMap[data.index] = Object.assign({
                        receivedBuffer : new Array(),
                        receivedSize : 0,
                    }, data);
                    that.setRemoteInfo(fromId, { receiveFileMap });
                    
                    // 组装接收文件的recoder结构
                    const recoder = {
                        id: fromId,
                        nickName : data.nickName,
                        index: data.index,
                        href: "",
                        name: data.name,
                        type: data.type,
                        size: data.size,
                        progress: 0,
                        done: false,
                        start: 0,
                        cost: 0,
                        upload : 'wait',
                        indexedDb: that.canSaveToIndexedDb && that.useIndexedDb,
                        fragment : 0,
                        indexedDbInfoKey: Date.now() + "_" + data.index + "_info",
                        indexedDbBufferKey: Date.now() + "_" + data.index + "_buffer",
                    }
                    that.receiveFileRecoderList.push(recoder)

                    that.socket.emit("message", {
                        emitType : "sendFileInfoAck",
                        room: that.roomId,
                        from: that.socketId, // from代表自己发出去的回执
                        to: fromId, // 谁发过来的sendFileInfo事件就回执给谁
                        index: data.index, //具体的recoder记录文件的索引
                    })

                    if(that.canSaveToIndexedDb && that.useIndexedDb){
                        that.saveSliceFileInfoToIndexedDb(recoder);
                    }
                });

                //接收放已经收到待发送文件信息，代表可以进行发送了，
                //没有ack的话，由于发送文件信息(websocket)和发送文件流(webrtc)是分开的
                //webrtc和websocket之间互存在一个时差，导致接收的时候报错
                this.socket.on('sendFileInfoAck', function (data) {
                    let to = data.to;
                    let fromId = data.from;
                    let index = data.index;
                    if (to === that.socketId) { // 是自己发出去的文件ack回执
                        that.addSysLogs(that.lang.receive_ack + fromId)
                        that.setRemoteInfo(fromId, { [index + "ack"]: true })

                        //确保所有人都收到基础文件信息，否则，轮训等待
                        for(let i = 0; i < that.chooseFileRecoderList.length; i++){
                            let chooseRecoder = that.chooseFileRecoderList[i];
                            let remote = that.getRemoteInfo(chooseRecoder.id);
                            let ack = remote[chooseRecoder.index + "ack"]
                            if (!ack) {
                                return
                            }
                        }

                        //所有人都收到了基础文件信息，开始发送文件
                        that.sendFileRecoderData()
                    }
                })

                //获取取件码文件
                this.socket.on('getCodeFile', function (data) {
                    if(!data.download){
                        layer.msg(that.lang.no_code_file)
                        return
                    }
                    that.receiveCodeFileList = [data];
                    that.clickCodeFile();
                })

                //暂存成功通知
                this.socket.on('addCodeFile', function (data) {
                    layer.msg(that.lang.save_ok);
                })

                //收到暂存链接
                this.socket.on('prepareCodeFile', async function (data) {
                    let index = data.index;
                    that.addSysLogs(that.lang.receive_temporary_link);

                    let filterFile = that.chooseFileList.filter(item=>{
                        return item.index === index;
                    });
    
                    if(filterFile.length === 0){
                        layer.msg(that.lang.file_not_exist);
                        that.addUserLogs(file_not_exist);
                        return
                    }

                    if(!data.uploadLink){
                        layer.msg(that.lang.save_fail);
                        that.addSysLogs(that.lang.temporary_link_empty + file.name);
                        return
                    }

                    const file = filterFile[0]
                    let formData = new FormData()
                    formData.append('file', file)
                    formData.append('replace', data.replace)
                    formData.append('parent_dir', data.parent_dir)
                    
                    try{
                        axios.defaults.withCredentials = true;
                        let res = await axios.post(data.uploadLink, formData, {
                            Headers : { "Content-Type" : "multipart/form-data;" },
                        })

                        let result = res.data;
                        if(!result || result.length === 0){
                            //更新当前文件相关的所有记录的暂存状态为失败
                            that.updateSendFileRecoderUpload(index, {
                                codeId : "",
                                upload : 'fail'
                            })
                            
                            layer.msg(that.lang.save_fail);
                            that.addSysLogs(that.lang.save_fail + file.name);
                            return
                        }

                        let ossFileId = result[0].id;
                        let ossFileName = result[0].name;
                        
                        that.socket.emit('addCodeFile', {
                            ossFileId : ossFileId,
                            ossFileName : ossFileName,
                            index: file.index,
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            room: that.roomId,
                            from: that.socketId,
                            nickName : that.nickName,
                            to : that.socketId
                        });

                        //更新当前文件相关的所有记录的暂存状态
                        that.updateSendFileRecoderUpload(index, {
                            codeId : ossFileId,
                            upload : 'done'
                        })
                        
                    }catch(e){
                        that.updateSendFileRecoderUpload(index, {
                            codeId : "",
                            upload : 'fail'
                        })

                        layer.msg(that.lang.save_fail);
                        that.addSysLogs(that.lang.save_fail + file.name);
                        return
                    }
                })

                //发送文字内容
                this.socket.on('chatingRoom', function (data) {
                    let fromId = data.from;
                    that.addPopup({
                        title : that.lang.send_text,
                        msg : data.from + that.lang.send_text + "[ " + data.content.substr(0, 10) + " ]"
                    });
                    that.addSysLogs(data.from + that.lang.send_text + "[ " + data.content.substr(0, 10) + " ]");

                    try {
                        data.content = tlrtcfile.unescapeStr(data.content)
                    } catch (e) {
                        that.addSysLogs(that.lang.text_decode_failed + data.content);
                    }
                    let now = new Date().toLocaleString();

                    //私聊
                    if(data.to && data.to !== ''){
                        //私聊数据放在连接对象中
                        let remoteRtc = that.getRemoteInfo(fromId);
                        if(remoteRtc){
                            let receiveChatRoomSingleList = remoteRtc.receiveChatRoomSingleList || [];
                            receiveChatRoomSingleList.push({
                                socketId: fromId,
                                to : data.to,
                                content: data.content,
                                nickName : data.nickName,
                                time: now,
                                timeAgo : window.util ? util.timeAgo(now) : now
                            })
                            that.setRemoteInfo(fromId, {
                                receiveChatRoomSingleList : receiveChatRoomSingleList
                            });
                        }

                        that.chatingRoomSingleTpl();
                    }else{
                        //群聊
                        that.receiveChatRoomList.push({
                            socketId: fromId,
                            content: data.content,
                            nickName : data.nickName,
                            time: now,
                            timeAgo : window.util ? util.timeAgo(now) : now
                        })
                        that.chatingRoomTpl();
                    }
                });

                //在线数量
                this.socket.on('count', function (data) {
                    that.allManCount = data.mc;
                    that.addSysLogs(that.lang.current_number + ":" + data.mc + that.lang.online_number)
                });

                //更新昵称
                this.socket.on('changeNickName', function (data) {
                    that.setRemoteInfo(data.from, {
                        nickName : data.nickName
                    })
                    that.addSysLogs(data.from + + that.lang.changeNickNameTo + " : " + data.nickName)
                });

                //提示
                this.socket.on('tips', function (data) {
                    if (window.layer) {
                        layer.msg(data.msg)
                        if (data.reload) {
                            setTimeout(() => {
                                window.location.reload()
                            }, 1300);
                        }
                    }
                });

                //关闭共享
                this.socket.on('stopScreenShare', function (data) {
                    if (data.id === that.socketId) {
                        that.clickMediaScreen();
                    } else {
                        $(`#otherMediaScreenShare${data.id}`).parent().remove();
                    }
                });

                //关闭共享
                this.socket.on('openCamera', function (data) {
                    that.setRemoteInfo(data.from, {
                        isCameraEnabled : data.isCameraEnabled,
                        isAudioEnabled : data.isAudioEnabled
                    })
                    if(data.type === 'video'){
                        if(data.kind === 'video'){
                            document.querySelector(`#otherMediaVideoShare${data.from}`).style.display = data.isCameraEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaVideoShareVideoSvg${data.from}`).style.display = data.isCameraEnabled ? 'none' : 'block';
                        }else if(data.kind === 'audio'){
                            document.querySelector(`#otherMediaVideoShareAudioOpenSvg${data.from}`).style.display = data.isAudioEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaVideoShareAudioCloseSvg${data.from}`).style.display = data.isAudioEnabled ? 'none' : 'block';
                        }
                    }else if(data.type === 'screen'){
                        if(data.kind === 'video'){
                            document.querySelector(`#otherMediaScreenShare${data.from}`).style.display = data.isCameraEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaScreenShareVideoSvg${data.from}`).style.display = data.isCameraEnabled ? 'none' : 'block';
                        }else if(data.kind === 'audio'){
                            document.querySelector(`#otherMediaScreenShareAudioOpenSvg${data.from}`).style.display = data.isAudioEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaScreenShareAudioCloseSvg${data.from}`).style.display = data.isAudioEnabled ? 'none' : 'block';
                        }
                    }else if(data.type === 'live'){
                        if(data.kind === 'video'){
                            document.querySelector(`#otherMediaLiveShare${data.from}`).style.display = data.isCameraEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaLiveShareVideoSvg${data.from}`).style.display = data.isCameraEnabled ? 'none' : 'block';
                        }else if(data.kind === 'audio'){
                            document.querySelector(`#otherMediaLiveShareAudioOpenSvg${data.from}`).style.display = data.isAudioEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaLiveShareAudioCloseSvg${data.from}`).style.display = data.isAudioEnabled ? 'none' : 'block';
                        }
                    }else if(data.type === 'audio'){
                        if(data.kind === 'audio'){
                            document.querySelector(`#otherMediaAudioShareAudioOpenSvg${data.from}`).style.display = data.isAudioEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaAudioShareAudioCloseSvg${data.from}`).style.display = data.isAudioEnabled ? 'none' : 'block';

                            document.querySelector(`#otherMediaAudioShareAudioOpenAnimSvg${data.from}`).style.display = data.isAudioEnabled ? 'block' : 'none';
                            document.querySelector(`#otherMediaAudioShareAudioCloseAnimSvg${data.from}`).style.display = data.isAudioEnabled ? 'none' : 'block';
                        }
                    }
                });

                //关闭音视频
                this.socket.on('stopVideoShare', function (data) {
                    if (data.id === that.socketId) {
                        that.clickMediaVideo();
                    } else {
                        $(`#otherMediaVideoShare${data.id}`).parent().remove();
                    }
                });

                //退出直播
                this.socket.on('stopLiveShare', function (data) {
                    //如果是主动房主退出，所有观众都退出
                    if(data.owner){
                        window.location.reload();
                        return
                    }

                    if (data.id === that.socketId) {
                        that.clickMediaLive();
                    }
                });

                //退出语音连麦
                this.socket.on('stopAudioShare', function (data) {
                    if (data.id === that.socketId) {
                        that.clickMediaAudio();
                    } else {
                        $(`#otherMediaAudioShare${data.id}`).parent().remove();
                    }
                });

                //ai对话
                this.socket.on('openaiAnswer', function (data) {
                    that.isAiAnswering = false
                    that.receiveAiChatList.push(data)
                    that.addSysLogs("AI : " + data.content)
                    that.addPopup({
                        title : that.lang.ai_reply,
                        msg : that.lang.ai_reply_you
                    });
                    that.receiveAiChatList.forEach(item => {
                        item.timeAgo = window.util ? util.timeAgo(item.time) : item.time;
                    })
                    that.openaiChatTpl()
                });

                //开关数据
                this.socket.on('commData', function (data) {
                    that.switchData = data.switchData;
                    that.switchDataGet = true;
                    if(data.switchData.noticeMsgList){
                        let alert = window.localStorage.getItem("tl-rtc-file-alert-notice")
                        if(!alert || (Date.now() - parseInt(alert)) / 1000 > (24 * 60 * 60) ){
                            setTimeout(() => {
                                that.clickNotice()
                                window.localStorage.setItem("tl-rtc-file-alert-notice", Date.now())
                            }, 1000);
                        }
                    }

                    if(data.chatingCommData){
                        data.chatingCommData.forEach(elem => {
                            try {
                                elem.msg = tlrtcfile.unescapeStr(elem.msg)
                            } catch (e) {
                                that.addSysLogs(that.lang.text_decode_failed + elem.msg);
                            }
                            that.receiveChatCommList.push(elem)
                        })
                        that.receiveChatCommList.forEach(item => {
                            item.timeAgo = window.util ? util.timeAgo(item.time) : item.time;
                        })
                    }
                });

                //公共聊天频道
                this.socket.on('chatingComm', function (data) {
                    that.addSysLogs(data.room + ":" + data.socketId + that.lang.send_text + ": [ " + data.msg + " ]");
                    try {
                        data.msg = tlrtcfile.unescapeStr(data.msg)
                    } catch (e) {
                        that.addSysLogs(that.lang.text_decode_failed + data.msg);
                    }
                    that.receiveChatCommList.push(data);
                    if (that.receiveChatCommList.length > that.switchData.chatingCommCount) {
                        that.receiveChatCommList.shift();
                    }
                    that.receiveChatCommList.forEach(item => {
                        item.timeAgo = window.util ? util.timeAgo(item.time) : item.time;
                    })
                    that.chatingCommTpl()

                    that.addPopup({
                        title : that.lang.chat_comm,
                        msg : that.lang.public_chat_channel_someone_interact
                    });
                });

                this.socket.on('manageCheck', function (data) {
                    layer.prompt({
                        formType: 1,
                        title: that.lang.please_enter,
                        btn : [that.lang.confirm, that.lang.cancel],
                    }, function (value, index, elem) {
                        that.socket.emit('manageConfirm', {
                            room: that.roomId,
                            value: value
                        });
                        layer.close(index)
                    });
                });

                //关闭音视频
                this.socket.on('subscribeNofity', function (data) {
                    layer.msg(that.lang.subscribe_website_notify_succ)
                });

                this.socket.on('manage', function (data) {
                    if (data.socketId !== that.socketId) {
                        layer.msg(that.lang.illegal_event)
                        return
                    }
                    layer.closeAll();
                    that.token = data.token;
                    layer.load(2, {
                        time: 1000,
                        shade: [0.8, '#000000'],
                        success: function (layero) {
                            layer.setTop(layero); //重点2
                        }
                    })
                    setTimeout(() => {
                        that.manageIframeId = layer.tab({
                            area: ['100%', '100%'],
                            shade: [0.8, '#393D49'],
                            closeBtn : 0,
                            tab: [{
                                title: data.content[0].title,
                                content: data.content[0].html
                            }, {
                                title: data.content[1].title,
                                content: data.content[1].html
                            }, {
                                title: data.content[2].title,
                                content: data.content[2].html
                            }],
                            cancel: function (index, layero) {
                                that.manageIframeId = 0;
                            },
                        })
                        layer.full(that.manageIframeId)
                    }, 500);
                });
            },
            // 打开设置
            setting: function () {
                let that = this;
                let options = {
                    type: 1,
                    fixed: false,
                    maxmin: false,
                    shadeClose: true,
                    area: ['320px', '390px'],
                    title: this.lang.setting,
                    success: function (layero, index) {                            
                        document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                        document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                        document.querySelector(".layui-layer").style.borderRadius = "15px"
                        document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                        window.form.render()

                        carousel.render({
                            elem: '#tl-rtc-file-setting-info',
                            width: '100%',
                            autoplay : false,
                            indicator: 'inside'
                        });

                        //文件分片大小自定义
                        let chunkSizeSliderDivObj = slider.render({
                            elem: '#tl-rtc-file-chunk-size',
                            min: 16,
                            max: 64,
                            change: function (value) {
                                that.chunkSize = value * 1024;
                                document.getElementById("tl-rtc-file-chunk-size-txt").innerText = value + "KB";
                            }
                        });
                        chunkSizeSliderDivObj.setValue((that.chunkSize / 1024) - 16);

                        //文件预览大小自定义
                        let previewSizeSliderDivObj = slider.render({
                            elem: '#tl-rtc-file-preview-size',
                            min: 5,
                            max: 15,
                            change: function (value) {
                                that.previewFileMaxSize = value * 1024 * 1024;
                                document.getElementById("tl-rtc-file-preview-size-txt").innerText = value + "MB";
                            }
                        });
                        previewSizeSliderDivObj.setValue((that.previewFileMaxSize / 1024 / 1024) - 5);

                        //执行日志大小自定义
                        let logSizeSliderDivObj = slider.render({
                            elem: '#tl-rtc-file-log-size',
                            min: 300,
                            max: 800,
                            change: function (value) {
                                that.maxLogCount = value;
                                document.getElementById("tl-rtc-file-log-size-txt").innerText = value + "条";
                            }
                        });
                        logSizeSliderDivObj.setValue(that.maxLogCount - 300);

                        document.getElementById("rtcCheck").addEventListener('click',function(){
                            that.webrtcCheck();
                        })

                        document.getElementById("customWsHost").addEventListener('click', function(){
                            that.customWsHost();
                        })

                        document.getElementById("relaySetting").addEventListener('click', function(){
                            that.relaySetting();
                        })

                        document.getElementById("sendBugs").addEventListener('click', function(){
                            that.sendBugs();
                        })

                        document.getElementById("aiContext").addEventListener('click', function(){
                            that.sendOpenaiChatWithContext();
                        })

                        document.getElementById("fileSave").addEventListener('click', function(){
                            that.savaFileToIndexedDb();
                        })

                        document.getElementById("systemLog").addEventListener('click', function(){
                            layer.closeAll(function(){
                                that.clickLogs();
                            })
                        })

                        document.getElementById("logOutput").addEventListener('click', function(){
                            that.logOutput();
                        })

                        document.getElementById("coffee").addEventListener('click', function(){
                            that.coffee();
                        })

                        document.getElementById("messageDot").addEventListener('click', function(){
                            that.messageDot();
                        })

                        document.getElementById("fixedRoom").addEventListener('click', function(){
                            that.fixedRoom();
                        })

                        document.getElementById("localNetworkRoomShare").addEventListener('click', function(){
                            that.localNetworkRoomShare();
                        })

                        document.getElementById("settingBasicHelp").addEventListener('click', function(){
                            that.settingHelp();
                        })

                        document.getElementById("settingSwitchHelp").addEventListener('click', function(){
                            that.settingHelp();
                        })

                        document.getElementById("fileTransferSettingHelp").addEventListener('click', function(){
                            that.settingHelp();
                        })

                        document.getElementById("webMsgNotify").addEventListener('click', function(){
                            that.webMsgNotify();
                        })
                    },
                    content: `
                        <div class="setting-main layui-carousel" id="tl-rtc-file-setting-info">
                            <div carousel-item>
                                <div class="setting-main-body">
                                    <ul class="layui-row layui-col-space10">
                                        <div style="text-align: center; color: #463434; font-weight: 700; font-size: 12px; padding: 0 0 10px 0;"> 
                                            tl-rtc-file ${this.version} ${this.lang.setting_basic}
                                            <b> <i class="layui-icon layui-icon-help" id="settingBasicHelp"></i> </b>
                                        </div>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.open_source_doc}" href="https://im.iamtsm.cn/document" target="_blank">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-rtc-file-shu1"></use>
                                                </svg>
                                                <cite>${this.lang.open_source_doc}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.blog}" href="https://blog.iamtsm.cn" target="_blank">
                                                <svg class="icon" aria-hidden="true" id="blog">
                                                    <use xlink:href="#icon-rtc-file-zhu"></use>
                                                </svg>
                                                <cite>${this.lang.blog}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.github}" href="https://github.com/iamtsm" target="_blank">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-rtc-file-github"></use>
                                                </svg>
                                                <cite>${this.lang.github}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.gitee}" href="https://gitee.com/iamtsm/tl-rtc-file" target="_blank">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-rtc-file-gitee"></use>
                                                </svg>
                                                <cite>${this.lang.gitee}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.give_coffee}">
                                                <svg class="icon" aria-hidden="true" id="coffee">
                                                    <use xlink:href="#icon-rtc-file-hongbao"></use>
                                                </svg>
                                                <cite>${this.lang.give_coffee}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4" >
                                            <a title="${this.lang.webrtc_check}">
                                                <svg class="icon" aria-hidden="true" id="rtcCheck">
                                                    <use xlink:href="#icon-rtc-file-gongju"></use>
                                                </svg>
                                                <cite>${this.lang.webrtc_check}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.log_list}">
                                                <svg class="icon" aria-hidden="true" id="systemLog">
                                                    <use xlink:href="#icon-rtc-file-rizhiguanli"></use>
                                                </svg>
                                                <cite>${this.lang.log_list}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4" style="${this.switchData.openSendBug ? '' : 'display:none;'}">
                                            <a title="${this.lang.feedback}">
                                                <svg class="icon" aria-hidden="true" id="sendBugs">
                                                    <use xlink:href="#icon-rtc-file-fankui"></use>
                                                </svg>
                                                <cite>${this.lang.feedback}</cite>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div class="setting-main-body">
                                    <ul class="layui-row layui-col-space10">
                                        <div style="text-align: center; color: #463434; font-weight: 700; font-size: 12px; padding: 0 0 10px 0;"> 
                                            tl-rtc-file ${this.version} ${this.lang.switch_setting}
                                            <b> <i class="layui-icon layui-icon-help" id="settingSwitchHelp"></i> </b>
                                        </div>
                                        <li class="layui-col-xs4" style="${this.switchData.openTurnServer ? '' : 'display:none;'}">
                                            <a title="${this.lang.relay_setting}">
                                                <svg class="icon" aria-hidden="true" id="relaySetting">
                                                    <use xlink:href="#icon-rtc-file-yunfuwuqi"></use>
                                                </svg>
                                                <svg class="icon settingOpenIcon" aria-hidden="true" style="${this.useTurn ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg class="icon settingCloseIcon " aria-hidden="true" style="${!this.useTurn ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.relay_setting}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.save_file_to_indexeddb}">
                                                <svg class="icon" aria-hidden="true" id="fileSave">
                                                    <use xlink:href="#icon-rtc-file-ziyuan"></use>
                                                </svg>
                                                <svg id="fileSaveOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useIndexedDb ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="fileSaveClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useIndexedDb ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.save_file_to_indexeddb}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.custom_ws_url}">
                                                <svg class="icon" aria-hidden="true" id="customWsHost">
                                                    <use xlink:href="#icon-rtc-file-WSshipinjiankong"></use>
                                                </svg>
                                                <svg class="icon settingOpenIcon" aria-hidden="true" style="${this.useCustomWsHost ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg class="icon settingCloseIcon" aria-hidden="true" style="${!this.useCustomWsHost ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.custom_ws_url}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4" style="${this.switchData.openAiChat ? '' : 'display:none;'}">
                                            <a title="${this.lang.ai_setting}">
                                                <svg class="icon" aria-hidden="true" id="aiContext">
                                                    <use xlink:href="#icon-rtc-file-AIzhineng"></use>
                                                </svg>
                                                <svg id="aiContextOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.openaiSendContext ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="aiContextClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.openaiSendContext ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.ai_setting}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.log}">
                                                <svg class="icon" aria-hidden="true" id="logOutput">
                                                    <use xlink:href="#icon-rtc-file-rizhiguanli"></use>
                                                </svg>
                                                <svg id="logOutputOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useLogOutput ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="logOutputClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useLogOutput ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.log}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.message_dot}">
                                                <svg class="icon" aria-hidden="true" id="messageDot">
                                                    <use xlink:href="#icon-rtc-file-icon"></use>
                                                </svg>
                                                <svg id="messageDotOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useMessageDot ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="messageDotClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useMessageDot ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.message_dot}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.fixed_room}">
                                                <svg class="icon" aria-hidden="true" id="fixedRoom">
                                                    <use xlink:href="#icon-rtc-file-ico_xitongshezhi_fangjianguanli"></use>
                                                </svg>
                                                <svg id="fixedRoomOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useFixedRoom ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="fixedRoomClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useFixedRoom ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.fixed_room}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.local_network_room_share}">
                                                <svg class="icon" aria-hidden="true" id="localNetworkRoomShare">
                                                    <use xlink:href="#icon-rtc-file-juyuwangsousuo"></use>
                                                </svg>
                                                <svg id="localNetworkRoomShareOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useLocalNetworkRoomShare ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="localNetworkRoomShareClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useLocalNetworkRoomShare ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.local_network_room_share}</cite>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs4">
                                            <a title="${this.lang.web_msg_notify}">
                                                <svg class="icon" aria-hidden="true" id="webMsgNotify">
                                                    <use xlink:href="#icon-rtc-file-tongzhi"></use>
                                                </svg>
                                                <svg id="webMsgNotifyOpen" class="icon settingOpenIcon" aria-hidden="true" style="${this.useWebMsgNotify ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-zhengque"></use>
                                                </svg>
                                                <svg id="webMsgNotifyClose" class="icon settingCloseIcon" aria-hidden="true" style="${!this.useWebMsgNotify ? '' : 'display:none;'}">
                                                    <use xlink:href="#icon-rtc-file-cuowu"></use>
                                                </svg>
                                                <cite>${this.lang.web_msg_notify}</cite>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div class="setting-main-body">
                                    <div style="text-align: center; color: #463434; font-weight: 700; font-size: 12px; padding: 15px 0 10px 0;"> 
                                        tl-rtc-file ${this.version} ${this.lang.file_transfer_setting}
                                        <b> <i class="layui-icon layui-icon-help" id="fileTransferSettingHelp"></i> </b>
                                    </div>
                                    <div class="setting-main-body-file"> 
                                        <div class="setting-main-body-file-top"> 
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-rtc-file-jianqie"></use>
                                            </svg>
                                            <div style="margin-left: 5px;">${this.lang.file_fragment_size}: <b id="tl-rtc-file-chunk-size-txt"></b> </div>
                                        </div>
                                        <div id="tl-rtc-file-chunk-size" style="margin-top: 10px;padding: 7px;"></div>
                                    </div>

                                    <div class="setting-main-body-file"> 
                                        <div class="setting-main-body-file-top"> 
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-rtc-file-yulan"></use>
                                            </svg>
                                            <div style="margin-left: 5px;">${this.lang.preview_limit_size}: <b id="tl-rtc-file-preview-size-txt"></b> </div>
                                        </div>
                                        <div id="tl-rtc-file-preview-size" style="margin-top: 10px;padding: 7px;"></div>
                                    </div>

                                    <div class="setting-main-body-file"> 
                                        <div class="setting-main-body-file-top"> 
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-rtc-file-rizhiguanli"></use>
                                            </svg>
                                            <div style="margin-left: 5px;">${this.lang.output_log_limit}: <b id="tl-rtc-file-log-size-txt"></b> </div>
                                        </div>
                                        <div id="tl-rtc-file-log-size" style="margin-top: 10px;padding: 7px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                }
                layer.closeAll(function () {
                    layer.open(options)
                })
                this.addUserLogs(this.lang.open_setting)
            },
            // 设置文档
            settingHelp : function(){
                layer.open({
                    type: 2
                    , title: false
                    , closeBtn: false
                    , area: ['80%','80%']
                    , shade: 0.5
                    , shadeClose : true
                    , id: 'layui-info-msg'
                    , content: 'document/SETTING.html'
                });
            },
            // 自动加入固定房间号
            autoJoinFixedRoom: function () {
                if(!this.useFixedRoom){
                    return
                }

                this.roomId = this.useFixedRoom;
                this.createFileRoom();
                this.createFileRoom();
                
                layer.msg(this.lang.auto_join_fixed_room + ": " + this.useFixedRoom)
            },
            // 是否关闭日志输出
            logOutput: function(){
                this.useLogOutput = !this.useLogOutput;

                if (this.useLogOutput) {
                    $("#logOutputOpen").css("display", "inline");
                    $("#logOutputClose").css("display", "none");
                } else {
                    $("#logOutputOpen").css("display", "none");
                    $("#logOutputClose").css("display", "inline");
                }

                layer.msg(`${this.lang.logs_switch}${this.useLogOutput ? this.lang.on : this.lang.off}`)

                $("#logOutput").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#logOutput").addClass("layui-anim-rotate")
                }, 50)
            },
            // ai对话上下文开关
            sendOpenaiChatWithContext : function(){
                this.openaiSendContext = !this.openaiSendContext;

                if(this.openaiSendContext){
                    $("#aiContextOpen").css("display", "inline");
                    $("#aiContextClose").css("display", "none");
                }else{
                    $("#aiContextOpen").css("display", "none");
                    $("#aiContextClose").css("display", "inline");
                }

                layer.msg(`${this.lang.ai_switch}${this.openaiSendContext ? this.lang.on : this.lang.off}`)

                this.addUserLogs(`${this.lang.ai_switch}${this.openaiSendContext ? this.lang.on : this.lang.off}`)

                $("#aiContext").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#aiContext").addClass("layui-anim-rotate")
                }, 50)
            },
            // 是否开启消息红点提示
            messageDot : function(){
                this.useMessageDot = !this.useMessageDot;

                if (this.useMessageDot) {
                    window.localStorage.setItem("tl-rtc-file-use-message-dot", true)
                    $("#messageDotOpen").css("display", "inline");
                    $("#messageDotClose").css("display", "none");
                } else {
                    window.localStorage.setItem("tl-rtc-file-use-message-dot", false)
                    $("#messageDotOpen").css("display", "none");
                    $("#messageDotClose").css("display", "inline");
                }

                layer.msg(`${this.lang.messgae_dot_switch}${this.useMessageDot ? this.lang.on : this.lang.off}`)

                $("#messageDot").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#messageDot").addClass("layui-anim-rotate")
                }, 50)
            },
            // 开启系统消息提示弹窗
            webMsgNotify: function(){
                this.useWebMsgNotify = !this.useWebMsgNotify;

                if (this.useWebMsgNotify) {
                    // 开启通知开关的时候，如果没有通知权限，请求浏览器通知权限
                    if (window.Notification) {
                        if(Notification.permission !== "granted"){
                            Notification.requestPermission(function (status) {
                                if (Notification.permission !== status) {
                                    Notification.permission = status;
                                }
                            });
                        }
                    }
                    
                    window.localStorage.setItem("tl-rtc-file-use-web-message-notify", true)
                    $("#webMsgNotifyOpen").css("display", "inline");
                    $("#webMsgNotifyClose").css("display", "none");
                } else {
                    window.localStorage.setItem("tl-rtc-file-use-web-message-notify", false)
                    $("#webMsgNotifyOpen").css("display", "none");
                    $("#webMsgNotifyClose").css("display", "inline");
                }

                layer.msg(`${this.lang.web_msg_notify}${this.useWebMsgNotify ? this.lang.on : this.lang.off}`)

                $("#webMsgNotify").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#webMsgNotify").addClass("layui-anim-rotate")
                }, 50)
            },
            // 是否开启局域网房间分享
            localNetworkRoomShare : function(){
                this.useLocalNetworkRoomShare = !this.useLocalNetworkRoomShare;

                if(this.useLocalNetworkRoomShare){
                    window.localStorage.setItem("tl-rtc-file-use-local-network-room-share", true)
                    $("#localNetworkRoomShareOpen").css("display", "inline");
                    $("#localNetworkRoomShareClose").css("display", "none");
                }else{
                    window.localStorage.setItem("tl-rtc-file-use-local-network-room-share", false)
                    $("#localNetworkRoomShareOpen").css("display", "none");
                    $("#localNetworkRoomShareClose").css("display", "inline");
                }

                layer.msg(`${this.lang.local_network_room_share}${this.useLocalNetworkRoomShare ? this.lang.on : this.lang.off}`)

                $("#localNetworkRoomShare").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#localNetworkRoomShare").addClass("layui-anim-rotate")
                }, 50)
            },
            // 是否使用自自定义持久化房间号
            fixedRoom : function(){
                let that = this;
                if(this.useFixedRoom){
                    window.localStorage.removeItem("tl-rtc-file-use-fixed-room")
                    layer.msg(`${this.lang.fixed_room}${this.lang.off}`)
                    
                    $("#fixedRoomOpen").css("display", "none");
                    $("#fixedRoomClose").css("display", "inline");

                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }else{
                    layer.prompt({
                        formType: 0,
                        value: '',
                        title: that.lang.fixed_room,
                        btn : [that.lang.confirm, that.lang.cancel],
                    }, function (value, index, elem) {
                        if (!that.switchData.allowChinese && window.tlrtcfile.containChinese(value)) {
                            layer.msg(that.lang.room_num_no_zh)
                            return
                        }
                        if (!that.switchData.allowNumber && window.tlrtcfile.containNumber(value)) {
                            layer.msg(that.lang.room_num_no_number)
                            return
                        }
                        if (!that.switchData.allowSymbol && window.tlrtcfile.containSymbol(value)) {
                            layer.msg(that.lang.room_num_no_special_symbols)
                            return
                        }

                        console.log(that.switchData, value, window.tlrtcfile.containSymbol(value))
                        
                        layer.close(index);

                        window.localStorage.setItem("tl-rtc-file-use-fixed-room", value)
                        layer.msg(`${that.lang.fixed_room}${that.lang.on}`)

                        $("#fixedRoomOpen").css("display", "inline");
                        $("#fixedRoomClose").css("display", "none");

                        setTimeout(() => {
                            window.location.reload()
                        }, 500);
                    });
                }

                $("#fixedRoom").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#fixedRoom").addClass("layui-anim-rotate")
                }, 50)
            },
            // 开启文件持久化到indexedDb中
            savaFileToIndexedDb: function(){
                if(!this.canSaveToIndexedDb){
                    layer.msg(this.lang.not_support)
                    return
                }

                if (this.useIndexedDb) {
                    window.localStorage.setItem("tl-rtc-file-receive-file-use-indexed-db", false)
                    layer.msg(`${this.lang.save_file_to_indexeddb}${this.lang.off}`)
                    $("#fileSaveOpen").css("display", "none");
                    $("#fileSaveClose").css("display", "inline");
                } else {
                    window.localStorage.setItem("tl-rtc-file-receive-file-use-indexed-db", true)
                    layer.msg(`${this.lang.save_file_to_indexeddb}${this.lang.on}`)
                    $("#fileSaveOpen").css("display", "inline");
                    $("#fileSaveClose").css("display", "none");
                }

                this.useIndexedDb = !this.useIndexedDb;

                $("#fileSave").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#fileSave").addClass("layui-anim-rotate")
                }, 50)
            },
            // 自定义ws地址
            customWsHost: function () {
                let that = this;
                if(window.localStorage.getItem("tl-rtc-file-custom-ws-host")){
                    window.localStorage.removeItem("tl-rtc-file-custom-ws-host")
                    layer.msg(that.lang.close_custom_ws_url)
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }else{
                    layer.prompt({
                        formType: 0,
                        value: 'wss://',
                        title: that.lang.input_custom_ws_url,
                        btn : [that.lang.confirm, that.lang.cancel],
                    }, function (value, index, elem) {
                        if(!/^wss?:\/\/[^\s/$.?#].[^\s]*$/.test(value)){
                            layer.msg(that.lang.ws_url_error)
                            return
                        }
                        
                        layer.close(index);

                        window.localStorage.setItem("tl-rtc-file-custom-ws-host", value)
                        layer.msg(that.lang.open_custom_ws_url)
                        setTimeout(() => {
                            window.location.reload()
                        }, 500);
                    });
                }
                $("#customWsHost").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#customWsHost").addClass("layui-anim-rotate")
                }, 50)
            },
            // 打开中继设置面板
            relaySetting: function () {
                if (this.useTurn) {
                    window.localStorage.setItem("tl-rtc-file-use-relay", false)
                    layer.msg(`${this.lang.relay_server_current}${this.lang.off}`)
                    $("#relaySettingOpen").css("display", "none");
                    $("#relaySettingClose").css("display", "inline");
                } else {
                    window.localStorage.setItem("tl-rtc-file-use-relay", true)
                    layer.msg(`${this.lang.relay_server_current}${this.lang.on}`)
                    $("#relaySettingOpen").css("display", "none");
                    $("#relaySettingClose").css("display", "inline");
                }

                $("#relaySetting").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#relaySetting").addClass("layui-anim-rotate")
                }, 50)

                setTimeout(() => {
                    window.location.reload()
                }, 300);
            },
            // 当前网络状态
            networkMsg: function () {
                layer.msg(this.lang.current_network + (this.network !== 'wifi' ? this.lang.mobile_data : this.network))
                this.addUserLogs(this.lang.current_network + (this.network !== 'wifi' ? this.lang.mobile_data : this.network))
            },
            // 添加弹窗
            addPopup: function (msg) {
                this.popUpList.push({
                    title : msg.title,
                    message : msg.msg
                })
            },
            // 记录系统日志
            addSysLogs: function (msg) {
                this.addLogs(msg, "【"+this.lang.sys_log+"】: ")
            },
            // 记录用户操作日志
            addUserLogs: function (msg) {
                this.addLogs(msg, "【"+this.lang.op_log+"】: ")
            },
            // 记录日志
            addLogs: function (msg, type) {
                if(!this.useLogOutput){
                    return
                }
                if (this.logs.length > this.maxLogCount) {
                    this.logs.shift();
                }
                this.logs.unshift({
                    type: type,
                    msg: msg,
                    time: new Date().toLocaleString()
                })
            },
            // 清空日志
            cleanLogs: function () {
                this.logs = []
                this.addSysLogs(this.lang.clear_log)
            },
            // 发送建议反馈
            sendBugs: function () {
                let that = this;
                $("#sendBugs").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#sendBugs").addClass("layui-anim-rotate")
                }, 50)
                
                that.roomId = "tlrtcfile问题反馈";
                that.roomType = "system";
                that.createFileRoom();
                that.createFileRoom();

                setTimeout(() => {
                    layer.closeAll(async function(){
                        that.openChatingRoom();
                        let index = layer.load(2);
                        await that.loadSystemRoomMsg();
                        layer.close(index);
                    });
                    that.addUserLogs(that.lang.send_bug_info_ok);
                }, 500);
            },
            // 随机刷新房间号
            refleshRoom: function () {
                if (!this.isJoined) {
                    this.roomId = parseInt(Math.random() * 100000);
                    this.addPopup({
                        title : this.lang.refresh_room,
                        msg : this.lang.you_refresh_room + this.roomId
                    });
                    this.addUserLogs(this.lang.you_refresh_room + this.roomId);
                }
            },
            // 复制分享房间url
            shareUrl: function () {
                let that = this;
                layer.closeAll(function () {
                    layer.open({
                        type: 1,
                        closeBtn: 0,
                        fixed: true,
                        maxmin: false,
                        shadeClose: true,
                        area: ['350px', '380px'],
                        title: that.lang.share_join_room,
                        success: function (layero, index) {
                            let shareArgs = {
                                r : that.roomId,
                                t : that.roomType
                            };
                            if(that.roomType === 'live'){
                                shareArgs.lsm = that.liveShareMode;
                                shareArgs.lsr = 'viewer';
                            }
                            let content = window.tlrtcfile.addUrlHashParams(shareArgs);
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                            document.querySelector(".layui-layer").style.borderRadius = "8px";
                            if(window.tlrtcfile.getQrCode){
                                tlrtcfile.getQrCode("tl-rtc-file-room-share-image", content)
                            }

                            tlrtcfile.copyTxt("shareUrl", content, function () {
                                layer.msg(that.lang.copy_room_link)
                            });
                            that.addUserLogs(that.lang.copy_room_link);
                        },
                        content: `
                            <div style="margin-top: 20px; text-align: center; margin-bottom: 25px;">
                                <div id="tl-rtc-file-room-share"> ${that.lang.share_join_room_done} 
                                    <i class="layui-icon layui-icon-ok-circle" style="margin-top: 3px; position: absolute; margin-left: 10px; color: #96e596; font-weight: 300;"></i>
                                </div>
                            </div>
                            <div id="tl-rtc-file-room-share-image">
                        `
                    })
                })
                this.addUserLogs(this.lang.open_share_join_room)
            },
            // 获取分享的取件码文件
            handlerGetCodeFile: function () {
                let that = this;
                let hash = window.location.hash || "";
                if (hash && hash.includes("#")) {
                    let codeIdArgs = hash.split("c=");
                    if (codeIdArgs && codeIdArgs.length > 1) {
                        this.codeId = (codeIdArgs[1] + "").replace(/\s*/g, "").substring(0, 40);
                        layer.confirm(this.lang.is_pickup_code, (index) => {
                            window.location.hash = "";
                            layer.close(index)
                            that.getCodeFile();
                        }, (index) => {
                            that.codeId = "";
                            window.location.hash = "";
                            layer.close(index)
                        })
                        this.addPopup({
                            title : this.lang.share_pickup_code_file,
                            msg : this.lang.get_pickup_file + this.codeId
                        });
                        this.addUserLogs(this.lang.get_pickup_file + this.codeId);
                    }
                }
            },
            // 分享进入房间
            handlerJoinShareRoom: function () {
                let that = this;

                //如果已经使用固定房间号，跳过分享进入逻辑
                if(this.useFixedRoom){
                    return
                }

                let hash = window.location.hash || "";
                if (!hash || !hash.includes("#") || !hash.includes("r=")) {
                    return
                }

                if (!window.layer) {
                    return
                }

                //房间号
                let roomIdArgs = tlrtcfile.getRequestHashArgs("r");
                if (!roomIdArgs) {
                    return
                }
                this.roomId = (roomIdArgs + "").replace(/\s*/g, "").substring(0, 15);

                //房间类型
                let typeArgs = tlrtcfile.getRequestHashArgs("t");

                layer.confirm(this.lang.join_room + this.roomId, (index) => {
                    window.location.hash = "";
                    layer.close(index)
                    that.openRoomInput = true;
                    that.isShareJoin = true;
                    if(typeArgs && ['screen','live','video','audio'].includes(typeArgs)){
                        if(typeArgs === 'screen'){
                            that.startScreenShare();
                        }else if(typeArgs === 'live'){
                            //直播房间模式
                            let lsm = tlrtcfile.getRequestHashArgs("lsm");
                            if(['video', 'live', ''].includes(lsm)){
                                that.liveShareMode = lsm;
                            }
                            //直播房间身份
                            let lsr = tlrtcfile.getRequestHashArgs("lsr");
                            if(['owner', 'viewer'].includes(lsr)){
                                that.liveShareRole = lsr;
                            }
                            that.startLiveShare();
                        }else if(typeArgs === 'video'){
                            that.startVideoShare();
                        }else if(typeArgs === 'audio'){
                            that.startAudioShare();
                        }
                    }else{
                        that.createFileRoom();
                    }
                }, (index) => {
                    that.roomId = "";
                    window.location.hash = "";
                    layer.close(index)
                })
                this.addPopup({
                    title : this.lang.share_join_room,
                    msg : this.lang.you_join_room + this.roomId
                });
                this.addUserLogs(this.lang.you_join_room + this.roomId);
            },
            // 赞助面板
            coffee: function () {
                let options = {
                    type: 1,
                    fixed: false,
                    maxmin: false,
                    shadeClose: true,
                    area: ['300px', '350px'],
                    title: this.lang.donate,
                    success: function (layero, index) {
                        document.querySelector(".layui-layer-title").style.borderTopRightRadius = "8px";
                        document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "8px";
                        document.querySelector(".layui-layer").style.borderRadius = "8px";
                    },
                    content: `<img style=" width: 100%; height: 100%;border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;" src="/image/coffee.jpeg" alt="img"> `
                }
                layer.closeAll(function () {
                    layer.open(options)
                })
                this.addUserLogs(this.lang.open_donate)
            },
            //点击局域网房间列表
            clickLocalNetRooms : function(hidden){
                if(this.localNetRoomList.length === 0 && !hidden){
                    layer.msg(this.lang.no_local_network_room)
                    return
                }

                this.showLocalNetRoom = !this.showLocalNetRoom;
                if (this.showLocalNetRoom) {
                    this.addUserLogs(this.lang.expand_local_network_room);
                    this.localNetRoomMaskHeightNum = 20;
                } else {
                    this.localNetRoomMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_local_network_room);
                }
            },
            //点击下载文件面板
            clickReceiveFile: function (hidden) {
                if(this.receiveFileRecoderList.length === 0 && !hidden){
                    layer.msg(this.lang.no_received_file)
                    return
                }
                this.showReceiveFile = !this.showReceiveFile;
                if (this.showReceiveFile) {
                    this.addUserLogs(this.lang.expand_receive_file);
                    this.receiveFileMaskHeightNum = 20;
                } else {
                    this.receiveFileMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_receive_file);
                }
            },
            //点击已选文件面板
            clickChooseFile: function () {
                if(!this.hasManInRoom && !this.showChooseFile){
                    layer.msg(this.lang.room_least_two_can_send_content)
                    return
                }
                this.showChooseFile = !this.showChooseFile;
                if (this.showChooseFile) {
                    this.chooseFileMaskHeightNum = 20;
                    this.addUserLogs(this.lang.expand_selected_file);
                } else {
                    this.chooseFileMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_selected_file);
                }
            },
            //点击待发送文件面板
            clickSendFile: function () {
                if(!this.hasManInRoom && !this.showSendFile){
                    layer.msg(this.lang.room_least_two_can_send_content)
                    return
                }
                this.showSendFile = !this.showSendFile;
                if (this.showSendFile) {
                    this.sendFileMaskHeightNum = 20;
                    this.addUserLogs(this.lang.expand_wait_send_file);
                } else {
                    this.sendFileMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_wait_send_file);
                }
            },
            //点击发送文件历史记录面板
            clickSendFileHistory: function () {
                if(this.sendFileRecoderHistoryList.length === 0){
                    layer.msg(this.lang.no_send_file)
                    return
                }
                this.showSendFileHistory = !this.showSendFileHistory;
                if (this.showSendFileHistory) {
                    this.sendFileHistoryMaskHeightNum = 20;
                    this.addUserLogs(this.lang.expand_send_file_record);
                } else {
                    this.sendFileHistoryMaskHeightNum = 150;
                    this.addUserLogs(this.lang.collapse_send_file_record);
                }
            },
            //点击查看日志面板
            clickLogs: function (e) {
                this.showLogs = !this.showLogs;
                this.touchResize();
                if (this.showLogs) {
                    this.addUserLogs(this.lang.expand_log);
                    this.logMaskHeightNum = 0;
                } else {
                    this.addUserLogs(this.lang.collapse_log);
                    this.logMaskHeightNum = -150;
                }
            },
            //点击打开音视频面板
            clickMediaVideo: function () {
                this.showMedia = !this.showMedia;
                this.touchResize();
                if (this.showMedia) {
                    this.addUserLogs(this.lang.expand_video);
                    this.mediaVideoMaskHeightNum = 0;
                    if(this.clientWidth < 500){
                        document.getElementById("iamtsm").style.marginLeft = '0';
                    }else{
                        document.getElementById("iamtsm").style.marginLeft = "50%";
                    }
                } else {
                    this.addUserLogs(this.lang.collapse_video);
                    this.mediaVideoMaskHeightNum = -150;
                    document.getElementById("iamtsm").style.marginLeft = "0";
                }
            },
            //点击打开屏幕共享面板
            clickMediaScreen: function () {
                this.showMedia = !this.showMedia;
                this.touchResize();
                if (this.showMedia) {
                    this.addUserLogs(this.lang.expand_screen_sharing);
                    this.mediaScreenMaskHeightNum = 0;
                    if(this.clientWidth < 500){
                        document.getElementById("iamtsm").style.marginLeft = "0";
                    }else{
                        document.getElementById("iamtsm").style.marginLeft = "50%";
                    }
                } else {
                    this.addUserLogs(this.lang.collapse_screen_sharing);
                    this.mediaScreenMaskHeightNum = -150;
                    document.getElementById("iamtsm").style.marginLeft = "0";
                }
            },
            //点击打开直播面板
            clickMediaLive: function () {
                this.showMedia = !this.showMedia;
                this.touchResize();
                if (this.showMedia) {
                    this.addUserLogs(this.lang.expand_live);
                    if(this.clientWidth < 500){
                        document.getElementById("iamtsm").style.marginLeft = "0";
                    }else{
                        document.getElementById("iamtsm").style.marginLeft = "50%";
                    }
                    this.mediaLiveMaskHeightNum = 0;
                } else {
                    this.addUserLogs(this.lang.collapse_live);
                    this.mediaLiveMaskHeightNum = -150;
                    document.getElementById("iamtsm").style.marginLeft = "0";
                }
            },
            clickMediaAudio : function(){
                this.showMedia = !this.showMedia;
                this.touchResize();
                if (this.showMedia) {
                    this.addUserLogs(this.lang.expand_audio);
                    if(this.clientWidth < 500){
                        document.getElementById("iamtsm").style.marginLeft = "0";
                    }else{
                        document.getElementById("iamtsm").style.marginLeft = "50%";
                    }
                    this.mediaAudioMaskHeightNum = 0;
                } else {
                    this.addUserLogs(this.lang.collapse_audio);
                    this.mediaAudioMaskHeightNum = -150;
                    document.getElementById("iamtsm").style.marginLeft = "0";
                }
            },
            typeInArr: function(arr, type, name = ""){
                if(type === ''){
                    let fileTail = name.split(".").pop()
                    return arr.filter(item=>{
                        return fileTail.toLowerCase().includes(item) && name.endsWith("."+fileTail);
                    }).length > 0;
                }else{
                    return arr.filter(item=>{
                        return type.toLowerCase().includes(item);
                    }).length > 0;
                }
            },
            //文件大小
            getFileSizeStr: function (size) {
                let sizeStr = (size / 1048576).toString();
                let head = sizeStr.split(".")[0];
                let tail = "";
                if (sizeStr.split(".")[1]) {
                    tail = sizeStr.split(".")[1].substring(0, 3);
                }
                if(head === '0') {
                    return "0M";
                }
                return head + '.' + tail + "M";
            },
            // indexedDb缓存keys
            getIndexedDbFileBufferKeyList : function(recoder){
                let keyList = [];
                for(let i = 0; i < recoder.fragment; i += 1000){
                    keyList.push(recoder.indexedDbBufferKey + i);
                }
                if(recoder.fragment % 1000 > 0){
                    keyList.push(recoder.indexedDbBufferKey + recoder.fragment);
                }
                return keyList;
            },
            // 预览indexedDb中的文件
            previewIndexedDbFile : async function(recoder){
                let that = this;
                const keyList = this.getIndexedDbFileBufferKeyList(recoder);
                const allBuffer = new Array();
                for(let i = 0; i < keyList.length; i++){
                    //从磁盘加载完，自动下载
                    await new Promise((resolve, reject) => {
                        localforage.getItem(keyList[i]).then(function(value) {
                            if(!value){
                                layer.msg(that.lang.indexedDB_file_alreay_delete)
                                setTimeout(() => {
                                    that.deleteIndexedDbFile(recoder);
                                }, 300);
                                reject(null)
                            }else{
                                value.forEach(item=>{
                                    allBuffer.push(item);
                                })
                                resolve(0)
                            }
                        }).catch(function(err) {
                            console.log("previewIndexedDbFile err ",err);
                            reject(err);
                        });
                    })
                }
                await this.previewFile(new File(allBuffer, recoder.name, { type: recoder.type }));
            },
            // 从indexedDb下载文件
            downloadIndexedDbFile : async function(recoder){
                let that = this;

                if(!this.canSaveToIndexedDb){
                    return
                }

                const keyList = this.getIndexedDbFileBufferKeyList(recoder);
                const allBuffer = new Array();
                for(let i = 0; i < keyList.length; i++){
                    //从磁盘加载完，自动下载
                    await new Promise((resolve, reject) => {
                        localforage.getItem(keyList[i]).then(function(value) {
                            if(!value){
                                layer.msg(that.lang.indexedDB_file_alreay_delete)
                                setTimeout(() => {
                                    that.deleteIndexedDbFile(recoder);
                                }, 300);
                                reject(null)
                            }else{
                                value.forEach(item=>{
                                    allBuffer.push(item);
                                })
                            }
                            resolve(0)
                        }).catch(function(err) {
                            console.log("downloadIndexedDbFileInfo err ",err);
                            reject(null);
                        });
                    })
                }

                const downloadLink = document.createElement('a');
                downloadLink.download = recoder.name;
                downloadLink.href = URL.createObjectURL(new Blob(allBuffer), { type: recoder.type });
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            // 清除indexedDb中的文件
            clearIndexedDbFile: function(){
                let that = this;

                this.receiveFileRecoderList = [];

                localforage.clear().then(function() {
                    layer.msg(that.lang.clear_indexeddb_file_done)
                });
            },
            //删除indexedDb中的文件
            deleteIndexedDbFile : function(recoder){
                let that = this;
                if(!this.canSaveToIndexedDb){
                    return
                }

                const keyList = this.getIndexedDbFileBufferKeyList(recoder);

                this.receiveFileRecoderList = this.receiveFileRecoderList.filter(item => {
                    return item.index !== recoder.index;
                })

                // 删除文件信息
                localforage.removeItem(recoder.indexedDbInfoKey).then(function() {
                    layer.msg(that.lang.delete_indexeddb_file_done)
                }).catch(function(err) {
                    console.log("deleteIndexedDbFile info err ",err);
                });

                // 删除文件数据
                keyList.forEach( key =>{
                    localforage.removeItem( key ).then(function() {
                    }).catch(function(err) {
                        console.log("deleteIndexedDbFile data err ",err);
                    });
                });

                // 删除的文件如果是最后一个文件，关闭下接收文件弹窗
                if(this.receiveFileRecoderList.length === 0){
                    this.clickReceiveFile(true)
                }
            },
            //分片文件数据存入indexedDb
            saveSliceFileBufferToIndexedDb : function(recoder, fragment, buffer){
                localforage.setItem(recoder.indexedDbBufferKey + fragment, buffer);
            },
            //文件信息存入indexedDb
            saveSliceFileInfoToIndexedDb : function(recoder){
                localforage.setItem(recoder.indexedDbInfoKey, recoder);
            },
            //加载indexedDb中的历史文件信息，不包括文件buffer
            loadIndexedDbFileInfo : function(){
                let that = this;
                if(!this.canSaveToIndexedDb){
                    return
                }

                localforage.iterate(function(value, key, iterationNumber) {
                    if(key.toString().endsWith("_info")){
                        that.receiveFileRecoderList.push(value)
                        that.loadIndexedFileAllSize += value.size;
                    }
                }).then(function() {
                    that.addUserLogs(that.lang.load_indexeddb_file_done);
                }).catch(function(err) {
                    console.log("loadIndexedDbFileInfo err ",err);
                });
            },
            // 检测浏览器是支持webrtc
            webrtcCheck: function () {
                let that = this;
                if (window.tlrtcfile) {
                    $("#rtcCheck").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#rtcCheck").addClass("layui-anim-rotate")
                        let rtcCheck = tlrtcfile.supposeWebrtc();
                        layer.msg(`${that.lang.your_browser}${rtcCheck ? that.lang.support : that.lang.not_support}webrtc`)
                        that.addUserLogs(`${that.lang.your_browser}${rtcCheck ? that.lang.support : that.lang.not_support}webrtc`)
                    }, 50)
                }
            },
            // 局域网房间功能开启进行的的ip上报
            localNetRoomIpReport: async function () {
                let that = this;
                await new Promise((resolve, reject) => {
                    const pc = new RTCPeerConnection(that.config);
                    pc.createDataChannel('report');
                    pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(reject);
                    pc.addEventListener("icegatheringstatechange", (ev) => {
                        if(pc.iceGatheringState === 'complete'){
                            resolve(true)
                        }
                    });
                    pc.onicecandidate = (e) => {
                        if (e.candidate) {
                            if(e.candidate.type !== 'relay'){
                                let alreadyHas = that.ips.filter(item=>{
                                    return item.address === e.candidate.address;  
                                }).length > 0;
                                if(!alreadyHas){
                                    that.ips.push({
                                        ipType : e.candidate.type,
                                        address : e.candidate.address,
                                        protocol : e.candidate.protocol,
                                    })
                                }
                            }
                        }
                    };
                });
                this.socket.emit("localNetRoom", { ips : this.ips })
            },  
            // 自动监听窗口变化，更新css
            reCaculateWindowSize: function () {
                this.clientWidth = document.body.clientWidth;

                if (window.fileTxtToolSwiper) {
                    window.fileTxtToolSwiper.params.slidesPerView = this.clientWidth < 600 ? 1 : 2;
                }
                if (window.toolSwiper) {
                    window.toolSwiper.params.slidesPerView = this.toolSlidesPerViewCount;
                }

                // logs height
                this.logsHeight = document.documentElement.clientHeight - 130;
                this.sendFileRecoderHeight = document.querySelector("#send-file-list").clientHeight - 190;
                this.chooseFileHeight = document.querySelector("#send-file-list-choose").clientHeight - 40;
                this.sendFileRecoderHistoryHeight = document.querySelector("#send-file-list-history").clientHeight - 40;
                this.localNetRoomListHeight = document.querySelector("#local-net-room-list").clientHeight - 40;
                this.receiveFileHeight = document.querySelector("#receive-file-list").clientHeight - 40;
                this.codeFileHeight = document.querySelector("#code-file-list").clientHeight - 40;

                //manage frame resize
                if (window.layer && this.manageIframeId !== 0) {
                    layer.full(this.manageIframeId)
                }
            },
            // 自动监听窗口变化，更新css
            touchResize: function (e) {
                if(e){ //onresize
                    this.reCaculateWindowSize();
                    return
                }
                //主动触发
                const myEvent = new Event('resize');
                window.dispatchEvent(myEvent);
                this.reCaculateWindowSize();
            },
            // 加载js调试器
            loadVConsoleJs: function () {
                let that = this;
                if (window.location.hash && window.location.hash.includes("debug")) {
                    window.tlrtcfile.loadJS('/static/js/vconsole.min.js', function () {
                        window.tlrtcfile.loadJS('/static/js/vconsole.js', function () {
                            that.addSysLogs("load vconsole success")
                        });
                    });
                }
            },
            // 定义事件到window上
            windowOnBusEvent: function () {
                window.Bus.$on("changeScreenShareState", (res) => {
                    if(!res){//状态失败，收起面板
                        this.clickMediaScreen();
                    }
                    this.isScreenShare = res
                })
                window.Bus.$on("changeScreenShareTimes", (res) => {
                    if (res === 0) {
                        this.socket.emit('message', {
                            emitType: "stopScreenShare",
                            id: this.socketId,
                            room: this.roomId,
                            cost: this.screenShareTimes,
                        });
                    }
                    this.screenShareTimes = res
                })
                window.Bus.$on("changeVideoShareState", (res) => {
                    if(!res){//状态失败，收起面板
                        this.clickMediaVideo();
                    }
                    this.isVideoShare = res
                })
                window.Bus.$on("changeVideoShareTimes", (res) => {
                    if (res === 0) {
                        this.socket.emit('message', {
                            emitType: "stopVideoShare",
                            id: this.socketId,
                            room: this.roomId,
                            cost: this.videoShareTimes,
                        });
                    }
                    this.videoShareTimes = res
                })
                window.Bus.$on("changeLiveShareState", (res) => {
                    if(!res){//状态失败，收起面板
                        this.clickMediaLive();
                    }
                    this.isLiveShare = res
                })
                window.Bus.$on("changeLiveShareTimes", (res) => {
                    if (res === 0) {
                        this.socket.emit('message', {
                            emitType: "stopLiveShare",
                            id: this.socketId,
                            room: this.roomId,
                            cost: this.liveShareTimes,
                            owner : this.owner,
                        });
                    }
                    this.liveShareTimes = res
                })
                window.Bus.$on("changeAudioShareTimes", (res) => {
                    if (res === 0) {
                        this.socket.emit('message', {
                            emitType: "stopAudioShare",
                            id: this.socketId,
                            room: this.roomId,
                            cost: this.audioShareTimes,
                            owner : this.owner,
                        });
                    }
                    this.audioShareTimes = res
                })
                window.Bus.$on("changeAudioShareState", (res) => {
                    if(!res){//状态失败，收起面板
                        this.clickMediaAudio();
                    }
                    this.isAudioShare = res
                })
                window.Bus.$on("manageChange", (data) => {
                    this.socket.emit('manageChange', {
                        id: data.id,
                        room: this.roomId,
                        token: this.token,
                        content: data.content,
                    });
                })
                window.Bus.$on("manageReload", (data) => {
                    this.socket.emit('manageReload', {
                        id: data.id,
                        room: this.roomId,
                        token: this.token,
                        content: data.time,
                    });
                })
                window.Bus.$on("addSysLogs", (res) => {
                    this.addSysLogs(res)
                })
            },
            // 选择文件后的处理函数
            chooseFileCallback: function(obj){
                this.allSended = false;
                //清空上次选择的文件和记录
                this.chooseFileList = [];
                this.sendFileRecoderList = [];

                //这是改动layui源码补充的方法 : 清空文件列表
                obj.clearAllFile();

                //重新生成文件记录
                let files = obj.pushFile();
                for(let index in files){
                    let file = files[index];

                    //是否存在选择的文件
                    let hasChooseFile = this.chooseFileList.filter((item) => {
                        return item.name === file.name && item.size === file.size &&
                        item.fileLastModified === file.lastModified && item.type === file.type;
                    }).length > 0;

                    //如果文件已经存在，就不再添加了
                    if(hasChooseFile){
                        this.addUserLogs(`${this.lang.selected_file_exist} : ${file.name}, ${this.lang.size} : ${this.getFileSizeStr(file.size)}, ${this.lang.type} : ${file.type}`);
                        continue
                    }

                    this.chooseFileList.push(
                        Object.assign(file, {
                            fileLastModified : file.lastModified,
                            index : index,
                        })
                    )

                    //根据房间内的用户，生成文件发送记录
                    for (let remoteId in this.remoteMap) {
                        let hasFileRecoder = this.sendFileRecoderList.filter(recoder => {
                            return file.name === recoder.name && file.size === recoder.size && 
                                file.type === recoder.type && recoder.id === remoteId;
                        }).length > 0;

                        //如果已经存在记录了，就不再添加了
                        if (hasFileRecoder) {
                            this.addUserLogs(`${this.lang.send_file_record_exist} : ${file.name} : ${this.remoteMap[remoteId].nickName}`);
                            continue
                        }

                        this.setRemoteInfo(remoteId, {
                            [index + "offset"]: 0,
                            [index + "status"]: 'wait'
                        })

                        this.sendFileRecoderList.unshift({
                            index: index,
                            id: remoteId,
                            nickName : this.remoteMap[remoteId].nickName,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            progress: 0,
                            done: false,
                            start: 0,
                            cost: 0,
                            upload : 'wait',
                            reader : new FileReader(),
                        });

                        this.addUserLogs(`${this.lang.generate_send_file_record} : ${file.name}, ${this.lang.size} : ${this.getFileSizeStr(file.size)}, ${this.lang.type} : ${file.type}, : ${this.remoteMap[remoteId].nickName}`);
                    }
                }
            },
            // 初始化选择文件面板
            renderChooseFileComp: function () {
                if (window.upload) {
                    upload.render({
                        elem: '#chooseFileList',
                        accept: 'file',
                        auto: false,
                        drag: true,
                        multiple: true,
                        choose: this.chooseFileCallback
                    });
                }
            },
            // swiper个数样式更新
            initSwiper: function(){
                let clientWidth = document.body.clientWidth;
                //发文件，收文件功能
                let fileTxtToolSwiper = new Swiper('.tl-rtc-file-send-file-txt-tool', {
                    direction: 'horizontal',
                    loop: false,
                    slidesPerView: clientWidth < 600 ? 1 : 2,
                    observer: true
                })
                window.fileTxtToolSwiper = fileTxtToolSwiper;
    
                //工具功能
                let toolSwiper = new Swiper('.tl-rtc-file-tool-list', {
                    direction: 'horizontal',
                    loop: false,
                    slidesPerView: this.toolSlidesPerViewCount,
                    observer: true,
                    scrollbar: {
                        el : '.swiper-scrollbar',
                        // hide: true,
                    }
                })
                window.toolSwiper = toolSwiper;
            },            
        },
        mounted: function () {
            let langArgs = tlrtcfile.getRequestHashArgs("lang")
            if (langArgs && ['zh','en'].includes(langArgs)) {
                this.langMode = langArgs;
            }
            this.lang = window.local_lang[this.langMode];
            this.addSysLogs(this.lang.init_language_done);

            this.addSysLogs(this.lang.print_logo);
            this.printLogo();

            this.addSysLogs(this.lang.refresh_random_room_num_init);
            this.refleshRoom()
            this.addSysLogs(this.lang.refresh_random_room_num_init_done);

            this.addSysLogs(this.lang.slider_init);
            this.initSwiper();
            this.addSysLogs(this.lang.slider_init_done);

            this.addSysLogs(this.lang.socket_init);
            this.socketListener();
            this.addSysLogs(this.lang.socket_init_done);

            this.addSysLogs(this.lang.basic_data_get);
            this.socket.emit('getCommData', {});
            this.addSysLogs(this.lang.basic_data_get_done);

            this.addSysLogs(this.lang.window_event_init);
            window.onresize = this.touchResize; 
            setInterval(() => {
                this.touchResize()
            }, 1000);
            this.addSysLogs(this.lang.window_event_init_done);

            this.addSysLogs(this.lang.webrtc_check_init);
            setInterval(async () => {
                await this.updateRemoteRtcState()
            }, 5000);
            this.addSysLogs(this.lang.webrtc_check_init_done);

            this.addSysLogs(this.lang.heartbeat_init);
            setInterval(async () => {
                this.socket.emit("heartbeat", {})
            }, 10000);
            this.addSysLogs(this.lang.heartbeat_init_done);

            this.addSysLogs(this.lang.message_box_init);
            this.startPopUpMsg()
            this.addSysLogs(this.lang.message_box_init_done);

            this.addSysLogs(this.lang.share_init);
            this.handlerJoinShareRoom();
            this.handlerGetCodeFile();
            this.addSysLogs(this.lang.share_init_done);

            this.addSysLogs(this.lang.common_event_init);
            this.windowOnBusEvent();
            this.addSysLogs(this.lang.common_event_init_done);

            setTimeout(() => {
                this.addSysLogs(this.lang.file_select_init);
                this.renderChooseFileComp();
                this.addSysLogs(this.lang.file_select_init_done);

                this.addSysLogs(this.lang.language_select_init);
                this.changeLanguage()
                this.addSysLogs(this.lang.language_select_init_done);

                window.Bus.$emit("getVideoShareDeviceList", (v, a, l) => {
                    this.videoDeviceList = v;
                    this.audioDeviceList = a;
                    this.loudspeakerDeviceList = l;
                });

                this.addSysLogs(this.lang.indexedDB_init);
                this.loadIndexedDbFileInfo();
                this.addSysLogs(this.lang.indexedDB_init_done);

                this.addSysLogs(this.lang.check_auto_join_fixed_room);
                this.autoJoinFixedRoom();
                this.addSysLogs(this.lang.check_auto_join_fixed_room_done);
            }, 2000);

            this.addSysLogs(this.lang.nickname_init);
            this.setNickName();
            this.addSysLogs(this.lang.nickname_init_done);

            this.addSysLogs(this.lang.debug_init);
            this.loadVConsoleJs();
            this.addSysLogs(this.lang.debug_init_done);

            this.addSysLogs(this.lang.local_network_room_report_init);
            this.localNetRoomIpReport();
            this.addSysLogs(this.lang.local_network_room_report_init_done);

            this.addSysLogs(this.lang.current_relay_status + (this.useTurn ? this.lang.on : this.lang.off))
        }
    });

    window.manageReload = function (data) {
        window.Bus.$emit("manageReload", data)
    }
    window.manageChange = function (data) {
        window.Bus.$emit("manageChange", data)
    }
})


