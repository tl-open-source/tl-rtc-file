// index.js
var file = null;
axios.get(window.prefix + "/api/comm/initData", {}).then((initData) => {
    let resData = initData.data;

    // 是否禁用中继
    let notUseRelay = window.localStorage.getItem("tl-rtc-file-not-use-relay");
    notUseRelay = notUseRelay && notUseRelay === 'true'
    if(notUseRelay){
        resData.rtcConfig.iceServers = [resData.rtcConfig.iceServers[0]]
    }

    file = new Vue({
        el: '#fileApp',
        data: function () {
            let socket = null;
            if (io) {
                socket = io(resData.wsHost);
            }
            return {
                socket: socket, // socket
                config: resData.rtcConfig, // rtc配置
                options: resData.options, // rtc配置
                isJoined: false, // 是否加入房间
                showReceiveFile: false, // 展示底部接收文件列表
                showSendFile: false, // 展示底部发送文件列表
                showReceiveTxt: false, // 展示底部接收文字列表
                showCodeFile: false, // 展示底部取件码文件列表
                showLogs: false, // 展示运行日志
                numSendFile: 150, // 用于控制底部栏展示
                numReceiveFile: 150,// 用于控制底部栏展示
                numReceiveTxt: 150,// 用于控制底部栏展示
                numCodeFile: 150, //用于控制底部栏展示
                numLogs: 150, // 用于控制日志栏展示
                currentMenu: 1, // 当前底部展示的栏目
                logsHeight: 0, // 日志栏目展示高度
                allManCount: 0, // 当前在线人数
                isTxtMode: false, // 是否是发送文字模式
                txtEditId: 0, // 文字模式输入框id
                nickName: "", //本人名称
                socketId: 0, //本人的id
                roomId: "10086", //房间号
                codeId: "", //取件码
                recoderId: 0, //记录id
                rtcConns: {}, //远程连接
                remoteMap: {}, //远程连接map

                chunkSize: 16 * 1024, // 一块16kb 最大应该可以设置到64kb
                allSended: false,//当前文件是否全部发送给房间内所有用户
                isSending: false, //是否正在发送文件中
                currentReceiveSize: 0, //统计收到文件的大小 (单个文件进度)
                currentSendSize : 0, //统计发送文件的大小 (单个文件进度)
                currentSendAllSize:0, // 统计发送文件总大小 (流量统计)
                sendingIconInterverlId : 0, // 图标变换定时器
                uploadCodeFileProcess : 0, // 上传暂存文件的进度

                currentChooseFile : null, //当前发送中的文件
                chooseFileList : [], //选择的文件列表
                sendFileList: [], //发过文件的列表
                receiveFileList: [], //接收文件的列表
                receiveTxtList: [], //接收的文字列表 
                codeFileList: [], //取件码文件列表
                chatingList: [], //公共聊天频道内容
                aiChatList : [], //ai对话内容
                logs: [],  //记录日志

                isScreen: false, //是否在录屏中
                screenTimes: 0,  //当前录屏时间
                isScreenShare: false, //是否在屏幕共享中
                screenShareTimes: 0,  //当前屏幕共享时间
                isVideoShare: false, //是否在音视频中
                videoShareTimes: 0,  //当前音视频时间
                isPasswordRoom: false, //是否在密码房中
                isAiAnswering : false, //是否ai正在回答中

                switchData : {}, //配置开关数据
                switchDataGet : false, // 是否已经拿到配置开关数据
                token: "", //登录token
                manageIframeId : 0, //实现自适应
                useTurn : !notUseRelay, //是否使用中继服务器
                aiAnsweringTxtIntervalId : 0, //实现等待动画
                aiAnsweringTxt : "思考中...", //ai思考中的文字
                openaiSendContext : false, // ai对话是否发送上下文
                logsFilter : "", //日志过滤参数
                toolListShadeIndex : -1, //控制展示遮罩
            }
        },
        computed: {
            createDisabled: function () {
                return this.isJoined || this.chooseFileList.length > 0;
            },
            exsitDisabled: function () {
                return !this.isJoined;
            },
            uploadDisabled: function () {
                return this.chooseFileList.length == 0 || this.allSended;
            },
            showSendFileList: function () {
                return this.sendFileList && this.sendFileList.length > 5;
            },
            noOthersInRoom: function () {
                return Object.keys(this.remoteMap).length === 0;
            },
            isMobile: function () {
                return navigator.userAgent.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                );
            },
            network : function(){
                return window.tlrtcfile.getNetWorkState()
            },
            filterLogs : function(){
                return this.logs.filter(item=>{
                    return item.msg.indexOf(this.logsFilter) > -1 
                    || item.time.indexOf(this.logsFilter) > -1
                    || item.type.indexOf(this.logsFilter) > -1
                })
            },
            menuNeedLowBackground : function(){
                return this.showReceiveFile || this.showSendFile || this.showReceiveTxt 
                || this.showCodeFile || this.showLogs
            }
        },
        watch: {
            isAiAnswering : function(newV, oldV){
                if(newV){
                    this.aiAnsweringTxtIntervalId = setInterval(() => {
                        if(this.aiAnsweringTxt === '思考中....'){
                            this.aiAnsweringTxt = '思考中'
                        }else{
                            this.aiAnsweringTxt += '.'
                        }
                        this.openaiChatTpl();
                    }, 500);
                }else{
                    clearInterval(this.aiAnsweringTxtIntervalId)
                }
            },
            allManCount: function (newV, oldV) {

            },
            currentMenu: function (newV, oldV) {

            },
            allSended: function (newV, oldV) {

            },
            isSending : function(newV, oldV){
                if(newV === true){
                    //计算时间
                    this.sendingIconInterverlId = setInterval(() => {
                        $("#isSendingIcon").css("color","#4c7673")
                        setTimeout(() => {
                            $("#isSendingIcon").css("color","#07c7b5")
                        }, 500)
                    }, 1000);
                }else{
                    clearInterval(this.sendingIconInterverlId)
                }
            },
            currentReceiveSize: function (newV, oldV) {
                this.currentReceiveSize = newV;
            },
            remoteMap: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            receiveFileList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            receiveTxtList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            sendFileList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            chatingList: {
                handler: function (newV, oldV) { },
                deep: true,
                immediate: true
            },
            chooseFileList : {
                handler: function (newV, oldV) {
                    let that = this;
                    if (!this.socketId) return;

                    newV.forEach((file)=>{
                        document.querySelector("#sendProgress").max += file.size;
                        that.allSended = false;

                        let idList = [];
                        for (let id in that.remoteMap) {
                            that.setRemoteInfo(id, {
                                [file.index + "offset"] : 0,
                                [file.index + "status"] : 0,
                                [file.index + "file"] : file,
                                [file.index + "reader"] : new FileReader()
                            })
                            idList.push(id);
                        }
        
                        let toIdStr = "";
                        if (idList.length > 0) {
                            toIdStr += "发送给房间的 " + idList[0] + " ...等" + idList.length + "人";
                        }
                        for (let id in that.remoteMap) {

                            let hasFile = that.sendFileList.filter(send=>{
                                return file.name === send.name && file.size === send.size && file.type === send.type && file.id === id;
                            }).length > 0;

                            if(!hasFile){
                                that.sendFileList.push({
                                    index : file.index,
                                    id: id,
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    process: 0,
                                    done: false,
                                    toIdStr: toIdStr,
                                    start: 0,
                                    cost: 0
                                });
                                that.addUserLogs(`选择了文件 : ${file.name}, 大小 : ${this.getFileSizeStr(file.size)}, 类型 : ${file.type}`);
                            }
                        }
                    })
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            openaiChat : function(){
                if(!this.switchData.openAiChat){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                let that = this;
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false, //不固定
                        maxmin: false,
                        area: ['600px', '600px'],
                        title: "人工智能对话",
                        success: function (layero, index) {
                            let active = null;
                            if (that.currentMenu === 1) {
                                active = document.querySelector("#btnHome");
                            } else if (that.currentMenu === 2) {
                                active = document.querySelector("#btnReceive");
                            } else if (that.currentMenu === 3) {
                                active = document.querySelector("#btnTxt");
                            } else if (that.currentMenu === 4) {
                                active = document.querySelector("#btnCodeFile");
                            }
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                            document.querySelector(".layui-layer").style.borderRadius = "15px"
                            document.querySelector(".chating-content").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-textarea").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer-title").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");

                            that.openaiChatTpl();
                        },
                        content: `
                            <div class="layui-col-sm12" style="padding: 15px;">
                                <div class="layui-card chating-content" id="openaiChat_tpl_view" style="padding: 5px;"> </div>
                                <script id="openaiChat_tpl" type="text/html">
                                    {{#  if(d.openaiSendContext) { }}
                                    <div style="text-align: center; color: #ffe2bc; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                        已开启同步上下文开关，AI能更好的理解您的问题，但也可能会导致回答变得不可预测，可在设置中关闭
                                    </div>
                                    {{#  }else{ }}
                                    <div style="text-align: center; color: #ffe2bc; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                        可尝试在设置中开启同步对话上下文开关，帮助AI能更好的连贯的理解您的问题
                                    </div>
                                    {{#  } }}
                                    <div style="text-align: center; color: #ffe2bc; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> 
                                        -------- 房间 ${this.roomId} - AI对话记录 -------- 
                                    </div>
                                    {{#  layui.each(d.list, function(index, info){ }}
                                        {{#  if(info.type === 'openai') { }}
                                        <div style="margin-bottom: 30px;display: inline-flex;width:100%;">
                                            <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                            <div style="margin-left: 15px; margin-top: -5px;width:100%;">
                                                <div style="word-break: break-all;"> <small> AI博主: </small> - <small>时间: <b>{{info.time}}</b></small> </div>
                                                <div style="margin-top: 5px;word-break: break-all;width: 90%;"> <b style="font-weight: bold; font-size: large;"> <pre> {{info.content}} </pre> </b></div>
                                            </div>
                                        </div>
                                        {{#  }else { }}
                                        <div style="margin-bottom: 30px;display: inline-flex;text-align: right;float: right;width:100%;">
                                            <div style="margin-right: 15px; margin-top: -5px;width:100%;">
                                                <div style="word-break: break-all;"> <small>我: <b>{{info.socketId}}</b> </small> <small>时间: <b>{{info.time}}</b></small>  </div>
                                                <div style="margin-top: 5px;word-break: break-all;width: 90%; margin-left: 10%;"> <b style="font-weight: bold; font-size: large;"> <pre> {{info.content}} </pre> </b></div>
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
                                                <small> AI博主: </small> - 
                                                <small>时间: <b>{{d.time}}</b></small> 
                                            </div>
                                            <div style="margin-top: 5px;word-break: break-all;width: 90%;"> <b style="font-weight: bold; font-size: large;"> {{d.aiAnsweringTxt}} </b></div>
                                        </div>
                                    </div>
                                    {{#  } }}
                                </script>
                            </div>
                            <div style="bottom: 0px; position: absolute; width: 100%; padding: 20px;">
                                <textarea style="border-radius: 15px;" maxlength="50000" id="openaiChat_value" class="layui-textarea" placeholder="文明发言，理性交流 ~"></textarea>
                                <button style="float: right;margin-top: 10px;" onclick="sendOpenaiChat()" type="button" class="layui-btn layui-btn-normal layui-btn-sm">发送问题</button>
                            </div>
                        `
                    }
                    if (this.isMobile) {
                        delete options.area
                    }
                    layer.closeAll(function(){
                        let index = layer.open(options)
                        if (that.isMobile) {
                            layer.full(index)
                        }
                    })
                    this.addUserLogs("打开了AI聊天窗口")
                }
            },
            openaiChatTpl: function (callback) {
                let tpl_html = document.getElementById("openaiChat_tpl");
                let tpl_view_html = document.getElementById("openaiChat_tpl_view");

                if (tpl_html && tpl_view_html) {

                    this.tpl(tpl_html, {
                        list : this.aiChatList,
                        isAiAnswering : this.isAiAnswering,
                        aiAnsweringTxt : this.aiAnsweringTxt,
                        time : window.util ? util.timeAgo(new Date().toDateString) : new Date().toDateString,
                        openaiSendContext : this.openaiSendContext
                    }, tpl_view_html, callback)

                    let chatDom = document.querySelector("#openaiChat_tpl_view")
                    let chatDomHeight = chatDom.clientHeight

                    let height = 0;
                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 235;
                    } else {
                        height = 350
                    }
                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }
                }
            },
            sendOpenaiChat : function(){
                let that = this;
                if (!this.createDisabled) {
                    if (window.layer) {
                        layer.msg("请先加入房间，才能和AI聊天")
                    }
                    this.addUserLogs("请先加入房间，才能和AI聊天")
                    return
                }
                if(this.isAiAnswering){
                    if (window.layer) {
                        layer.msg("AI正在回答你的问题中，请稍后再提问")
                    }
                    this.addUserLogs("AI正在回答你的问题中，请稍后再提问")
                    return
                }

                let value = document.querySelector("#openaiChat_value").value;

                if (value === '' || value === undefined) {
                    if (window.layer) {
                        layer.msg("请先填写内容哦")
                    }
                    this.addUserLogs("请先填写内容哦")
                    return
                }
                if (value.length > 1000) {
                    if (window.layer) {
                        layer.msg("内容太长啦，不能超过1000个字")
                    }
                    this.addUserLogs("内容太长啦，不能超过1000个字")
                    return
                }

                this.aiChatList.push({
                    room: this.roomId,
                    socketId : this.socketId,
                    content : value
                })

                // 发送上下文
                let contextContent = "";
                if(this.openaiSendContext){
                    let isShortContentChatList = true;
                    this.aiChatList.forEach(item=>{
                        if(item.content.length > 100){
                            isShortContentChatList = false;
                        }
                    })
                    let isShortChatList = this.aiChatList.length < 6;
                    
                    if(isShortChatList){ // 对话次数不多
                        if(isShortContentChatList){ // 对话内容精简
                            this.aiChatList.forEach(item=>{
                                contextContent += item.content + "\n";
                            })
                        }else{ //对话内容复杂
                            this.aiChatList.forEach(item=>{
                                contextContent += item.content + "\n";
                            })
                        }
                    }else{ // 对话次数较多
                        if(isShortContentChatList){ // 对话内容精简
                            this.aiChatList.slice(this.aiChatList.length - 6).forEach(item=>{
                                contextContent += item.content + "\n";
                            })
                        }else{ // 对话内容复杂
                            this.aiChatList.slice(this.aiChatList.length - 4).forEach(item=>{
                                contextContent += item.content + "\n";
                            })
                        }
                    }
                    contextContent = contextContent.substring(0, 5000);
                }

                this.socket.emit('openai', {
                    room: this.roomId,
                    socketId : this.socketId,
                    content : contextContent,
                    value : value
                });

                this.isAiAnswering = true;

                this.openaiChatTpl()

                this.addUserLogs("我对AI说 : "+value);

                document.querySelector("#openaiChat_value").value = ''
            },
            useTurnMsg : function(){
                if (window.layer) {
                    layer.msg("当前已启用中继服务器，更多信息请到设置查看")
                }
                this.addUserLogs("当前已启用中继服务器，更多信息请到设置查看")
            },
            networkMsg : function(){
                if (window.layer) {
                    layer.msg("当前网络状态为"+ (this.network !== 'wifi' ? '移动流量' : this.network))
                }
                this.addUserLogs("当前网络状态为"+ (this.network !== 'wifi' ? '移动流量' : this.network))
            },
            uploadCodeFile: function (file) {
                if(window.layer){
                    layer.msg("即将支持暂存功能")
                }
                this.addUserLogs("即将支持暂存功能")
            },
            getCodeFile: function () {
                let that = this;
                if(!this.switchData.openGetCodeFile){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                if (window.layer) {
                    layer.prompt({
                        formType: 0,
                        title: '请输入取件码',
                        value: '即将支持取件码功能',
                    }, function (value, index, elem) {
                        that.codeId = value;
                        layer.close(index);

                        layer.msg("即将支持取件码功能")
                        that.addUserLogs("通过取件码获取文件, 取件码=" + value);
                    });
                }
            },
            startPassword : function(){
                if(!this.switchData.openPasswordRoom){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                if (!this.isPasswordRoom) {
                    if (this.createDisabled) {
                        if (window.layer) {
                            layer.msg("请先退出房间后，再进入密码房间")
                        }
                        this.addUserLogs("请先退出房间后，再进入密码房间")
                        return
                    }
                    let that = this;
                    if (window.layer) {
                        layer.prompt({
                            formType: 0,
                            title: '请输入密码房间号'
                        }, function (value, index, elem) {
                            that.roomId = value;
                            layer.close(index);
                            that.isPasswordRoom = !that.isPasswordRoom;

                            layer.prompt({
                                formType: 1,
                                title: '请输入密码'
                            }, function (value, index, elem) {
                                that.createPasswordRoom(value);
                                layer.close(index);
                                that.addUserLogs("进入密码房间，房间号:"+that.roomId +",密码:"+value);
                            });
                        });
                    }
                }
            },
            setting : function() {
                let that = this;
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false,
                        maxmin: false,
                        shadeClose:true,
                        area: ['300px', '350px'],
                        title: "功能设置",
                        success: function (layero, index) {
                            let active = null;
                            if (that.currentMenu === 1) {
                                active = document.querySelector("#btnHome");
                            } else if (that.currentMenu === 2) {
                                active = document.querySelector("#btnReceive");
                            } else if (that.currentMenu === 3) {
                                active = document.querySelector("#btnTxt");
                            } else if (that.currentMenu === 4) {
                                active = document.querySelector("#btnCodeFile");
                            }
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                            document.querySelector(".layui-layer").style.borderRadius = "15px"
                            document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                            document.querySelector(".setting-main-body ul").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer-title").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            window.form.render()
                        },
                        content: `
                        <div class="setting-main">
                            <div class="setting-main-body">
                                <ul class="layui-row layui-col-space10">
                                    <li class="layui-col-xs4">
                                        <a title="博客" href="https://blog.iamtsm.cn" target="_blank">
                                            <svg  viewBox="0 0 1024 1024" p-id="4914" width="42px" height="56px" id="blog">
                                                <path d="M512 520m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z" fill="#F8C5B9" p-id="4915">
                                                </path>
                                                <path
                                                    d="M512 1020c-276 0-500-224-500-500S236 20 512 20s500 224 500 500-224.8 500-500 500z m0-960C258.4 60 52 266.4 52 520s206.4 460 460 460 460-206.4 460-460S765.6 60 512 60z"
                                                    p-id="4916"></path>
                                                <path
                                                    d="M277.6 276c5.6 0.8 9.6-4 8.8-9.6-8-46.4-43.2-227.2-100-237.6C132 18.4 12.8 137.6 32 189.6c20.8 56 200 80.8 245.6 86.4z"
                                                    fill="#F8C5B9" p-id="4917"></path>
                                                <path
                                                    d="M278.4 296h-3.2c-88-10.4-238.4-37.6-261.6-99.2C-0.8 158.4 32 112 52.8 87.2 89.6 44 148 1.6 189.6 9.6c33.6 6.4 81.6 56 116 254.4 1.6 8.8-0.8 17.6-7.2 24-5.6 4.8-12.8 8-20 8zM178.4 48c-20 0-60.8 24.8-95.2 64.8-28 32.8-36.8 59.2-32.8 69.6 9.6 27.2 96 56 212.8 71.2-24-129.6-59.2-201.6-81.6-205.6h-3.2z"
                                                    p-id="4918"></path>
                                                <path
                                                    d="M751.2 276c-5.6 0.8-9.6-4-8.8-9.6 8-46.4 43.2-227.2 100-237.6 54.4-10.4 172.8 108.8 153.6 160.8-20.8 56-199.2 80.8-244.8 86.4z"
                                                    fill="#F8C5B9" p-id="4919"></path>
                                                <path
                                                    d="M750.4 296c-8 0-15.2-3.2-20-8.8-6.4-6.4-8.8-15.2-7.2-24C757.6 64.8 804.8 16 838.4 9.6c41.6-8 100 35.2 136.8 77.6 20.8 24.8 53.6 71.2 40 109.6-23.2 61.6-173.6 88.8-261.6 99.2h-3.2z m99.2-248h-4c-22.4 4-56.8 76-81.6 205.6 116-15.2 202.4-44 212.8-71.2 4-10.4-4.8-36.8-32.8-69.6-33.6-40-74.4-64.8-94.4-64.8zM509.6 859.2c-82.4 0-128.8-58.4-130.4-61.6L361.6 776h284l-12 20.8c-1.6 2.4-37.6 61.6-122.4 62.4h-1.6z m-84.8-56c18.4 13.6 47.2 28.8 84.8 28.8h1.6c38.4-0.8 64-15.2 80-28.8H424.8z"
                                                    p-id="4920"></path>
                                                <path
                                                    d="M354.4 789.6c-12.8 0-21.6-12.8-16.8-24.8 15.2-37.6 59.2-104.8 175.2-103.2 113.6 1.6 158.4 65.6 174.4 102.4 5.6 12-3.2 25.6-16.8 25.6H354.4z"
                                                    fill="#EF866D" p-id="4921"></path>
                                                <path
                                                    d="M669.6 803.2H354.4c-10.4 0-20.8-5.6-26.4-14.4-5.6-8.8-7.2-20-3.2-29.6 17.6-41.6 64-111.2 184-111.2h4c121.6 1.6 168.8 69.6 186.4 110.4 4 9.6 3.2 21.6-2.4 30.4-6.4 8.8-16 14.4-27.2 14.4z m-160.8-128c-104 0-144 59.2-158.4 94.4-0.8 1.6 0 3.2 0.8 4 0.8 0.8 1.6 2.4 4 2.4h315.2c2.4 0 3.2-1.6 4-2.4 0.8-0.8 1.6-2.4 0-4.8-15.2-34.4-56-92.8-161.6-94.4-1.6 0.8-3.2 0.8-4 0.8z"
                                                    p-id="4922"></path>
                                                <path
                                                    d="M368 674.4c-3.2 0-6.4-0.8-9.6-3.2-5.6-4.8-6.4-13.6-0.8-19.2 36.8-40 88.8-60.8 155.2-59.2 64 0.8 115.2 20.8 152 58.4 5.6 5.6 4.8 14.4 0 19.2-5.6 5.6-14.4 4.8-19.2 0-31.2-32-76-48.8-132.8-49.6-57.6-0.8-103.2 16-134.4 50.4-3.2 1.6-7.2 3.2-10.4 3.2z"
                                                    p-id="4923"></path>
                                                <path
                                                    d="M368 618.4c-3.2 0-6.4-0.8-9.6-3.2-5.6-4.8-6.4-13.6-0.8-19.2 36.8-40 88.8-60.8 155.2-59.2 64 0.8 115.2 20.8 152 58.4 5.6 5.6 4.8 14.4 0 19.2-5.6 5.6-14.4 4.8-19.2 0-31.2-32-76-48.8-132.8-49.6-57.6-0.8-103.2 16-134.4 50.4-3.2 1.6-7.2 3.2-10.4 3.2z"
                                                    p-id="4924"></path>
                                                <path d="M456 734.4m-24 0a24 24 0 1 0 48 0 24 24 0 1 0-48 0Z" p-id="4925"></path>
                                                <path d="M568 734.4m-24 0a24 24 0 1 0 48 0 24 24 0 1 0-48 0Z" p-id="4926"></path>
                                                <path d="M133.6 655.2a87.2 40 0 1 0 174.4 0 87.2 40 0 1 0-174.4 0Z" fill="#EF866D" p-id="4927">
                                                </path>
                                                <path d="M709.6 655.2a87.2 40 0 1 0 174.4 0 87.2 40 0 1 0-174.4 0Z" fill="#EF866D" p-id="4928">
                                                </path>
                                                <path d="M284 478.4a72 48 90 1 0 96 0 72 48 90 1 0-96 0Z" p-id="4929"></path>
                                                <path d="M644 478.4a72 48 90 1 0 96 0 72 48 90 1 0-96 0Z" p-id="4930"></path>
                                                <path d="M353.6 473.6m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#FFFFFF" p-id="4931"></path>
                                                <path d="M329.6 465.6m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#FFFFFF" p-id="4932"></path>
                                                <path d="M705.6 473.6m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#FFFFFF" p-id="4933"></path>
                                                <path d="M681.6 465.6m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#FFFFFF" p-id="4934"></path>
                                            </svg>
                                            <cite>个人博客</cite>
                                        </a>
                                    </li>

                                    <li class="layui-col-xs4">
                                        <a title="github" href="https://github.com/iamtsm" target="_blank">
                                            <svg width="42px" height="56px" id="github" viewBox="0 0 1049 1024" p-id="2500" width="64"
                                                height="64">
                                                <path
                                                    d="M524.979332 0C234.676191 0 0 234.676191 0 524.979332c0 232.068678 150.366597 428.501342 358.967656 498.035028 26.075132 5.215026 35.636014-11.299224 35.636014-25.205961 0-12.168395-0.869171-53.888607-0.869171-97.347161-146.020741 31.290159-176.441729-62.580318-176.441729-62.580318-23.467619-60.841976-58.234462-76.487055-58.234463-76.487055-47.804409-32.15933 3.476684-32.15933 3.476685-32.15933 53.019436 3.476684 80.83291 53.888607 80.83291 53.888607 46.935238 79.963739 122.553122 57.365291 152.97411 43.458554 4.345855-33.897672 18.252593-57.365291 33.028501-70.402857-116.468925-12.168395-239.022047-57.365291-239.022047-259.012982 0-57.365291 20.860106-104.300529 53.888607-140.805715-5.215026-13.037566-23.467619-66.926173 5.215027-139.067372 0 0 44.327725-13.906737 144.282399 53.888607 41.720212-11.299224 86.917108-17.383422 131.244833-17.383422s89.524621 6.084198 131.244833 17.383422C756.178839 203.386032 800.506564 217.29277 800.506564 217.29277c28.682646 72.1412 10.430053 126.029806 5.215026 139.067372 33.897672 36.505185 53.888607 83.440424 53.888607 140.805715 0 201.64769-122.553122 245.975415-239.891218 259.012982 19.121764 16.514251 35.636014 47.804409 35.636015 97.347161 0 70.402857-0.869171 126.898978-0.869172 144.282399 0 13.906737 9.560882 30.420988 35.636015 25.205961 208.601059-69.533686 358.967656-265.96635 358.967655-498.035028C1049.958663 234.676191 814.413301 0 524.979332 0z"
                                                    fill="#191717" p-id="2501"></path>
                                                <path
                                                    d="M199.040177 753.571326c-0.869171 2.607513-5.215026 3.476684-8.691711 1.738342s-6.084198-5.215026-4.345855-7.82254c0.869171-2.607513 5.215026-3.476684 8.691711-1.738342s5.215026 5.215026 4.345855 7.82254z m-6.953369-4.345856M219.900283 777.038945c-2.607513 2.607513-7.82254 0.869171-10.430053-2.607514-3.476684-3.476684-4.345855-8.691711-1.738342-11.299224 2.607513-2.607513 6.953369-0.869171 10.430053 2.607514 3.476684 4.345855 4.345855 9.560882 1.738342 11.299224z m-5.215026-5.215027M240.760389 807.459932c-3.476684 2.607513-8.691711 0-11.299224-4.345855-3.476684-4.345855-3.476684-10.430053 0-12.168395 3.476684-2.607513 8.691711 0 11.299224 4.345855 3.476684 4.345855 3.476684 9.560882 0 12.168395z m0 0M269.443034 837.011749c-2.607513 3.476684-8.691711 2.607513-13.906737-1.738342-4.345855-4.345855-6.084198-10.430053-2.607513-13.037566 2.607513-3.476684 8.691711-2.607513 13.906737 1.738342 4.345855 3.476684 5.215026 9.560882 2.607513 13.037566z m0 0M308.555733 853.526c-0.869171 4.345855-6.953369 6.084198-13.037566 4.345855-6.084198-1.738342-9.560882-6.953369-8.691711-10.430053 0.869171-4.345855 6.953369-6.084198 13.037566-4.345855 6.084198 1.738342 9.560882 6.084198 8.691711 10.430053z m0 0M351.145116 857.002684c0 4.345855-5.215026 7.82254-11.299224 7.82254-6.084198 0-11.299224-3.476684-11.299224-7.82254s5.215026-7.82254 11.299224-7.82254c6.084198 0 11.299224 3.476684 11.299224 7.82254z m0 0M391.126986 850.049315c0.869171 4.345855-3.476684 8.691711-9.560882 9.560882-6.084198 0.869171-11.299224-1.738342-12.168395-6.084197-0.869171-4.345855 3.476684-8.691711 9.560881-9.560882 6.084198-0.869171 11.299224 1.738342 12.168396 6.084197z m0 0"
                                                    fill="#191717" p-id="2502"></path>
                                            </svg>
                                            <cite>github</cite>
                                        </a>
                                    </li>

                                    <li class="layui-col-xs4" >
                                        <a title="webrtc检测" onclick="webrtcCheck()">
                                            <svg id="check" viewBox="0 0 1024 1024" p-id="7867" width="42px" height="56px">
                                                <path
                                                    d="M824.593094 277.816453l-202.741656 202.741657a20.48 20.48 0 1 1-28.963094-28.963094l202.741657-202.741657-14.481547-14.481546-202.741656 202.741656a20.48 20.48 0 1 1-28.963094-28.963094l217.223203-217.223203a20.48 20.48 0 0 1 28.963094 0l86.889281 86.889281a20.48 20.48 0 0 1 0 28.963094l-217.223203 217.223203a20.48 20.48 0 1 1-28.963094-28.963094l202.741656-202.741656-14.481547-14.481547z m-346.10897 119.038316c2.114306 0.955782 4.054833 2.317048 5.792619 4.054833l304.112484 304.112484a102.4 102.4 0 0 1-144.815469 144.815469l-304.112484-304.112485c-1.737786-1.737786-3.084569-3.692794-4.054833-5.792618a176.72192 176.72192 0 0 1-156.212446-49.077963 176.88576 176.88576 0 0 1-43.097084-180.092517 20.48 20.48 0 0 1 30.324359-11.005975c10.904605 6.820809 47.238806 28.6445 108.756417 65.311776l27.674237-27.99283c-37.145168-62.545801-59.026785-98.966891-65.282814-108.669528a20.48 20.48 0 0 1 10.745308-30.527101 176.90624 176.90624 0 0 1 181.091744 42.764008 176.72192 176.72192 0 0 1 49.077962 156.183483z m-100.270231 129.696733l294.322959 294.322959a61.44 61.44 0 1 0 86.889282-86.889281L465.103175 439.662221a176.55808 176.55808 0 0 1-35.697013 51.192268 176.55808 176.55808 0 0 1-51.192269 35.697013z m-170.056805-64.660106a135.96672 135.96672 0 1 0 78.982357-231.038599c12.64239 20.954798 32.264886 53.871354 58.997822 98.908965a20.48 20.48 0 0 1-3.041125 24.850334l-50.062707 50.64197A20.48 20.48 0 0 1 268.009322 408.440006c-44.74798-26.646046-77.60661-46.297505-98.691742-59.012303a135.84384 135.84384 0 0 0 38.868472 112.43473z m95.1148 337.246263a20.48 20.48 0 0 1-28.963093-28.963093l115.852375-115.852375a20.48 20.48 0 1 1 28.963093 28.963093l-115.852375 115.852375z"
                                                    fill="#2c2c2c" p-id="7868"></path>
                                                <path
                                                    d="M695.504586 777.429821m-21.722321 21.72232a30.72 30.72 0 1 0 43.444641-43.444641 30.72 30.72 0 1 0-43.444641 43.444641Z"
                                                    fill="#2c2c2c" p-id="7869"></path>
                                                <path
                                                    d="M152.446578 871.559875l50.685414-94.130054 43.44464-14.481547 43.444641 43.44464-14.481547 43.444641L181.409671 900.522969z"
                                                    fill="#2c2c2c" p-id="7870"></path>
                                            </svg>
                                            <cite >webrtc检测</cite>
                                        </a>
                                    </li>
                                    <li class="layui-col-xs4" style="${ this.switchData.openTurnServer ? '' : 'display:none;'}">
                                        <a title="中继设置" onclick="relaySetting()" >
                                            <svg viewBox="0 0 1130 1024" p-id="8399" width="42px" height="56px" style="fill: #abb1ab;">
                                                <path d="M297.160348 734.608696C129.317843 726.349913 0 702.09447 0 550.662678c0-121.143652 82.543304-228.525635 206.358261-269.824C225.618365 121.143652 365.946435 0 531.033043 0c121.063513 0 231.121252 63.327722 288.901566 165.197913C996.031443 181.715478 1130.852174 327.644383 1130.852174 501.10553 1130.852174 685.576904 982.274226 734.608696 800.678957 734.608696H297.155896z m236.143304-681.182609c-142.905878 0-263.82247 107.45767-274.814887 247.977183l-2.746991 19.286817-19.233391 5.511791C132.073739 353.756383 57.878261 444.678678 57.878261 549.380452c0 123.993043 107.177183 123.53447 241.833182 131.802157h502.904209c151.146852 0 274.810435-24.344487 274.810435-181.394922 0-148.791652-120.916591-272.775791-274.810435-281.043478h-16.490852l-8.240974-13.775026C733.914157 111.286539 640.476383 53.426087 533.2992 53.426087z" fill="#979797" p-id="8400"></path><path d="M667.149357 499.382539h-196.759374c-8.614957 0-14.358261-5.743304-14.358261-14.362713s5.743304-14.362713 14.358261-14.362713h196.759374c8.614957 0 14.362713 5.743304 14.362713 14.362713 0 8.614957-5.743304 14.362713-14.362713 14.362713z m0 74.680765h-196.759374c-8.614957 0-14.358261-5.743304-14.358261-14.362713 0-8.614957 5.743304-14.362713 14.358261-14.362713h196.759374c8.614957 0 14.362713 5.743304 14.362713 14.362713s-5.743304 14.362713-14.362713 14.362713z m0 73.247166h-196.759374c-8.614957 0-14.358261-5.743304-14.358261-14.362713s5.743304-14.362713 14.358261-14.362714h196.759374c8.614957 0 14.362713 5.743304 14.362713 14.362714 0 8.614957-5.743304 14.362713-14.362713 14.362713zM342.817391 353.823165v572.037565c0 52.98087 42.611757 95.592626 95.276522 95.592627h254.664348c52.918539 0 95.276522-42.611757 95.276522-95.592627V353.818713C788.034783 300.837843 745.423026 258.226087 692.758261 258.226087H438.093913C385.175374 258.226087 342.817391 300.775513 342.817391 353.818713z" fill="#979797" p-id="8401"></path>
                                            </svg>
                                            <cite>中继设置</cite>
                                        </a>
                                    </li>
                                    <li class="layui-col-xs4" style="${ this.switchData.openAiChat ? '' : 'display:none;'}">
                                        <a title="ai智能对话上下文" onclick="sendOpenaiChatWithContext()">
                                            <i class="layui-icon layui-icon-service" style="font-size: 40px;color:#abb1ab;" id="aiContext"></i>
                                            <cite>智能理解</cite>
                                        </a>
                                    </li>
                                    <li class="layui-col-xs4" style="${ this.switchData.openSendBug ? '' : 'display:none;'}">
                                        <a title="反馈问题" onclick="sendBugs()" >
                                            <svg viewBox="0 0 1024 1024" p-id="4621" width="42px" height="56px" id="sendBugs">
                                                <path d="M360.389512 557.544289l184.919617 0 0 30.819936-184.919617 0 0-30.819936Z" p-id="4622">
                                                </path>
                                                <path d="M360.389512 480.981543l308.200384 0 0 30.819936-308.200384 0 0-30.819936Z" p-id="4623">
                                                </path>
                                                <path d="M360.389512 404.417773l308.200384 0 0 30.819936-308.200384 0 0-30.819936Z" p-id="4624">
                                                </path>
                                                <path
                                                    d="M511.999488 64.021106c-247.27171 0-447.724091 200.452381-447.724091 447.724091s200.452381 447.724091 447.724091 447.724091 447.724091-200.453405 447.724091-447.724091S759.271198 64.021106 511.999488 64.021106zM761.050728 620.157325c0 34.041304-27.599591 61.639872-61.640895 61.639872l-154.09968 0 0 123.280768L422.029384 681.798221 329.569576 681.798221c-34.040281 0-61.639872-27.599591-61.639872-61.639872L267.929704 373.597837c0-34.040281 27.599591-61.639872 61.639872-61.639872l369.840256 0c34.042327 0 61.640895 27.599591 61.640895 61.639872L761.050728 620.157325z"
                                                    p-id="4625"></path>
                                            </svg>
                                            <cite>反馈问题</cite>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        `
                    }
                    layer.closeAll(function(){
                        layer.open(options)
                    })
                }
                this.addUserLogs("打开设置窗口")
            },
            relaySetting : function() {
                let that = this;
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false,
                        maxmin: false,
                        shadeClose:true,
                        area: ['300px', '350px'],
                        title: "中继设置",
                        success: function (layero, index) {
                            let active = null;
                            if (that.currentMenu === 1) {
                                active = document.querySelector("#btnHome");
                            } else if (that.currentMenu === 2) {
                                active = document.querySelector("#btnReceive");
                            } else if (that.currentMenu === 3) {
                                active = document.querySelector("#btnTxt");
                            } else if (that.currentMenu === 4) {
                                active = document.querySelector("#btnCodeFile");
                            }
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                            document.querySelector(".layui-layer").style.borderRadius = "15px"
                            document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                            document.querySelector(".relayDoc").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer-title").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                        },
                        content: `
                        <div class="setting-main">
                            <div class="setting-main-body">
                                <div class="relayDoc" style="padding: 15px; position: absolute; width: 100%; height: 100%;">
                                    <p style="text-align: center; font-weight: bold; position: relative; top: 2px; display: block; color: #d7c3c3;  font-size: 17px;"> 中继服务器当前已 ${notUseRelay ? '“禁用”' : '“启用”'} </p>
                                    <p style="font-weight: bold; position: relative;  top: 15px; display: block; color: #d7c3c3; font-size: 14px;"> 启用中继服务器可以保证在复杂的p2p网络环境下，提供保底的数据中转传输，如果禁用，则是强制走p2p，可能会出现发送失败！</p>
                                    <div style="position: relative; margin-top: 140px;">
                                        <div style="text-align: center;">
                                            <button onclick="notUseRelay()" type="button" class="layui-btn layui-btn-sm layui-btn-normal" style="margin-right: 45px;"> 启用 </button>
                                            <button onclick="notUseRelay()" type="button" class="layui-btn layui-btn-sm layui-btn-danger"> 禁用 </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    }
                    layer.closeAll(function(){
                        layer.open(options)
                    })
                }
                this.addUserLogs("打开中继设置窗口")
            },
            coffee: function(){
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false,
                        maxmin: false,
                        shadeClose:true,
                        area: ['300px', '350px'],
                        title: "赞助一下，为爱发电",
                        success: function (layero, index) {
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px";
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px";
                            document.querySelector(".layui-layer").style.borderRadius = "15px";
                            document.querySelector(".layui-layer-title").style.fontWeight = "bold";
                            document.querySelector(".layui-layer-title").style.color = "#ffffff";
                            document.querySelector(".layui-layer-title").style.borderBottom = "none";
                            document.querySelector(".layui-layer-title").style.backgroundColor = "#000000"
                        },
                        content: `<img style=" width: 100%; height: 100%;border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;" src="/image/coffee.jpg" alt="img"> `
                    }
                    layer.closeAll(function(){
                        layer.open(options)
                    })
                }
                this.addUserLogs("打开赞助窗口")
            },
            startVideoShare: function(){
                if(!this.switchData.openVideoShare){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                if (this.isScreenShare) {
                    if (window.layer) {
                        layer.msg("当前正在屏幕共享中，退出后再试")
                    }
                    this.addUserLogs("当前正在屏幕共享中，退出后再试")
                    return
                }
                if (!this.isVideoShare) {
                    if (this.createDisabled) {
                        if (window.layer) {
                            layer.msg("请先退出房间后，再发起音视频通话")
                        }
                        this.addUserLogs("请先退出房间后，再发起音视频通话")
                        return
                    }
                    let that = this;
                    if (window.layer) {
                        layer.prompt({
                            formType: 1,
                            title: '请输入音视频通话房间号'
                        }, function (value, index, elem) {
                            that.roomId = value;
                            that.createMediaRoom("video");
                            layer.close(index)

                            that.socket.emit('message', {
                                emitType: "startVideoShare",
                                room: that.roomId,
                            });
                            that.isVideoShare = !that.isVideoShare;
                            that.addUserLogs("结束音视频通话");
                        });
                    }
                } else {
                    window.Bus.$emit("stopVideoShare")
                    this.isVideoShare = !this.isVideoShare;
                    this.addUserLogs("开始音视频通话");
                }
            },
            startScreenShare: function(){
                if(!this.switchData.openScreenShare){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                if (this.isVideoShare) {
                    if (window.layer) {
                        layer.msg("当前正在音视频通话中，退出后再试")
                    }
                    this.addUserLogs("当前正在音视频通话中，退出后再试")
                    return
                }
                if (!this.isScreenShare) {
                    if (this.createDisabled) {
                        if (window.layer) {
                            layer.msg("请先退出房间后，再发起屏幕共享")
                        }
                        this.addUserLogs("请先退出房间后，再发起屏幕共享")
                        return
                    }
                    let that = this;
                    if (window.layer) {
                        layer.prompt({
                            formType: 1,
                            title: '请输入屏幕共享房间号',
                        }, function (value, index, elem) {
                            that.roomId = value;
                            that.createMediaRoom("screen");
                            layer.close(index)

                            that.socket.emit('message', {
                                emitType: "startScreenShare",
                                room: that.roomId,
                            });
                            that.isScreenShare = !that.isScreenShare;
                            that.addUserLogs("开始远程屏幕共享");
                        });
                    }
                } else {
                    window.Bus.$emit("stopScreenShare")
                    this.isScreenShare = !this.isScreenShare;
                    this.addUserLogs("结束远程屏幕共享");
                }
            },
            startScreen: function () {
                if(!this.switchData.openScreen){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                if (this.isMobile) {
                    if (window.layer) {
                        layer.msg("移动端暂不支持屏幕录制")
                    }
                    this.addUserLogs("移动端暂不支持屏幕录制")
                    return
                }
                if (!this.isScreen) {
                    let that = this;
                    if (window.layer) {
                        layer.confirm("是否进行本地屏幕录制", (index) => {
                            window.Bus.$emit("startScreen")
                            that.socket.emit('message', {
                                emitType: "startScreen",
                                room: this.roomId,
                            });
                            that.addUserLogs("开始本地屏幕录制");
                        }, (index) => {
                            this.isScreen = !this.isScreen;
                            layer.close(index)
                        })
                    }
                } else {
                    window.Bus.$emit("stopScreen", (res) => {
                        this.receiveFileList.push({
                            id: "网页录屏",
                            href: res.src,
                            style: 'color: #ff5722;text-decoration: underline;',
                            name: 'screen-recording-' + res.donwId + '.mp4',
                            type: "webm/mp4",
                            size: res.size,
                            process: 100,
                            done: true,
                            start: 0,
                            cost: res.times
                        })
                        this.socket.emit('message', {
                            emitType: "stopScreen",
                            room: this.roomId,
                            size: res.size,
                            cost: res.times
                        });
                        this.addUserLogs("结束本地屏幕录制");
                    })
                }
                this.isScreen = !this.isScreen;
            },
            shareUrl: function () {
                document.querySelector("#shareUrl").setAttribute("data-clipboard-text", window.location.href + "#r=" + this.roomId);
                var clipboard = new ClipboardJS('#shareUrl');
                clipboard.on('success', function (e) {
                    e.clearSelection();
                    if (window.layer) {
                        layer.msg("复制房间链接成功!")
                    }
                });
                this.addUserLogs("复制房间链接成功");
            },
            copyTxt: function (id, content) {
                document.querySelector("#" + id).setAttribute("data-clipboard-text", content);
                var clipboard = new ClipboardJS('#' + id);
                clipboard.on('success', function (e) {
                    e.clearSelection();
                    if (window.layer) {
                        layer.msg("复制内容成功!")
                    }
                });
            },
            //分享进入
            handlerRoomHistory: function () {
                let that = this;
                var hash = window.location.hash || "";
                if (hash && hash.includes("#")) {
                    let roomIdArgs = hash.split("r=");
                    if (roomIdArgs && roomIdArgs.length > 1) {
                        this.roomId = (roomIdArgs[1] + "").replace(/\s*/g, "").substring(0, 15);
                        if (window.layer) {
                            layer.confirm("进入房间" + this.roomId, (index) => {
                                window.location.hash = "";
                                layer.close(index)
                                that.createFileRoom();
                            }, (index) => {
                                that.roomId = "";
                                window.location.hash = "";
                                layer.close(index)
                            })
                            this.addPopup("你通过分享加入了房间号为 " + this.roomId);
                            this.addUserLogs("你通过分享加入了房间号为 " + this.roomId);
                        }
                    }
                }
            },
            chating: function () {
                if(!this.switchData.openCommRoom){
                    if(window.layer){
                        layer.msg("当前功能已暂时关闭，有问题可以加群交流")
                    }
                    this.addUserLogs("当前功能已暂时关闭，有问题可以加群交流")
                    return
                }
                let that = this;
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false, //不固定
                        maxmin: false,
                        area: ['600px', '600px'],
                        title: "公共聊天频道",
                        success: function (layero, index) {
                            let active = null;
                            if (that.currentMenu === 1) {
                                active = document.querySelector("#btnHome");
                            } else if (that.currentMenu === 2) {
                                active = document.querySelector("#btnReceive");
                            } else if (that.currentMenu === 3) {
                                active = document.querySelector("#btnTxt");
                            } else if (that.currentMenu === 4) {
                                active = document.querySelector("#btnCodeFile");
                            }
                            document.querySelector(".layui-layer-title").style.borderTopRightRadius = "15px"
                            document.querySelector(".layui-layer-title").style.borderTopLeftRadius = "15px"
                            document.querySelector(".layui-layer").style.borderRadius = "15px"
                            document.querySelector(".chating-content").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-textarea").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer-title").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                            document.querySelector(".layui-layer").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");

                            that.chatingTpl();
                        },
                        content: `
                            <div class="layui-col-sm12" style="padding: 15px;">
                                <div class="layui-card chating-content" id="chating_tpl_view" style="padding: 5px;"> </div>
                                <script id="chating_tpl" type="text/html">
                                    <div style="text-align: center; color: #ffe2bc; font-size: 12px;margin-top: -5px; margin-bottom: 20px;"> -------- 仅展示10条历史消息 -------- </div>
                                    {{#  layui.each(d, function(index, info){ }}
                                    <div style="margin-bottom: 30px;display: inline-flex;">
                                        <a > <img style="width: 32px; height: 32px;" src="/image/44826979.png" alt="img"> </a>
                                        <div style="margin-left: 15px; margin-top: -5px;">
                                            <div style="word-break: break-all;"> <small>房间号: <b>{{info.room}}</b></small> - <small>用户: <b>{{info.socketId}}</b></small> - <small>时间: <b>{{info.time}}</b></small> </div>
                                            <div style="margin-top: 5px;word-break: break-all;">说: <b style="font-weight: bold; font-size: large;"> {{info.msg}} </b></div>
                                        </div>
                                    </div>
                                    {{#  }); }}
                                </script>
                            </div>
                            <div style="bottom: 0px; position: absolute; width: 100%; padding: 20px;">
                                <textarea style="border-radius: 15px;" maxlength="50000" id="chating_value" class="layui-textarea" placeholder="文明发言，理性交流 ~"></textarea>
                                <button style="float: right;margin-top: 10px;" onclick="sendChating()" type="button" class="layui-btn layui-btn-normal layui-btn-sm">发言</button>
                            </div>
                        `
                    }
                    if (this.isMobile) {
                        delete options.area
                    }
                    layer.closeAll(function(){
                        let index = layer.open(options)
                        if (that.isMobile) {
                            layer.full(index)
                        }
                    })
                }
                this.addUserLogs("打开公共聊天面板")
            },
            chatingTpl: function () {
                let tpl_html = document.getElementById("chating_tpl");
                let tpl_view_html = document.getElementById("chating_tpl_view");

                if (tpl_html && tpl_view_html) {

                    this.tpl(tpl_html, this.chatingList, tpl_view_html)

                    let chatDom = document.querySelector("#chating_tpl_view")
                    let chatDomHeight = chatDom.clientHeight

                    let height = 0;
                    if (this.isMobile) {
                        height = document.documentElement.clientHeight - 235;
                    } else {
                        height = 350
                    }
                    if (chatDomHeight > height) {
                        chatDom.style.height = height + "px"
                        chatDom.style.overflowY = "scroll"
                    } else {
                        chatDom.style.overflowY = "none"
                    }
                }
            },
            tpl: function (tpl_html, data, tpl_view_html, callback) {
                if (window.laytpl) {
                    laytpl(tpl_html.innerHTML).render(data, (html) => {
                        tpl_view_html.innerHTML = html;
                        if(callback){
                            callback()
                        }
                    });
                }
            },
            sendChating: function () {
                let content = document.querySelector("#chating_value").value;
                if (!this.createDisabled) {
                    if (window.layer) {
                        layer.msg("请先加入房间，才能发言哦")
                    }
                    this.addUserLogs("请先加入房间，才能发言哦")
                    return
                }
                if (content === '' || content === undefined) {
                    if (window.layer) {
                        layer.msg("请先填写内容哦")
                    }
                    this.addUserLogs("请先填写内容哦")
                    return
                }
                if (content.length > 1000) {
                    if (window.layer) {
                        layer.msg("内容太长啦，不能超过1000个字")
                    }
                    this.addUserLogs("内容太长啦，不能超过1000个字")
                    return
                }
                this.socket.emit('chating', {
                    msg: encodeURIComponent(content),
                    room: this.roomId,
                    socketId: this.socketId,
                });

                this.addUserLogs("公共频道发言成功");

                document.querySelector("#chating_value").value = ''
            },
            sendBugs: function () {
                if (window.layer) {
                    let that = this;
                    $("#sendBugs").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#sendBugs").addClass("layui-anim-rotate")
                    }, 50)
                    setTimeout(() => {
                        layer.prompt({
                            formType: 2,
                            title: '请描述您需要反馈的问题',
                        }, function (value, index, elem) {
                            that.socket.emit('message', {
                                emitType: "sendBugs",
                                msg: value,
                                room: that.roomId,
                            });
                            layer.msg("问题反馈成功，更多问题可以加群交流，将更快解决")
                            layer.close(index);
                            that.addUserLogs("问题反馈成功，更多问题可以加群交流，将更快解决 ,问题:"+value);
                        });
                    }, 500);
                }
            },
            refleshRoom: function () {
                if (!this.createDisabled) {
                    this.roomId = parseInt(Math.random() * 100000);
                    this.addPopup("你刷新了房间号, 当前房间号为 " + this.roomId);
                    this.addUserLogs("你刷新了房间号, 当前房间号为 " + this.roomId);
                    $("#refresh").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#refresh").addClass("layui-anim-rotate")
                    }, 50)
                }
            },
            addPopup: function (msg) {
                window.Bus.$emit("addPopup", msg);
            },
            cleanPopup: function () {
                window.Bus.$emit("popupMap");
            },
            addSysLogs: function(msg){
                this.addLogs(msg, "【系统日志】: ")
            },
            addUserLogs: function(msg){
                this.addLogs(msg, "【操作日志】: ")
            },
            addLogs: function (msg, type) {
                if(this.logs.length > 1000){
                    this.logs.shift();
                }
                this.logs.unshift({
                    type: type,
                    msg :  msg,
                    time : new Date().toLocaleString()
                })
            },
            cleanLogs: function () {
                this.logs = []
                this.addSysLogs("清空日志")
            },
            sendTxt: function (isRealContentMode) {
                if (!this.createDisabled) {
                    if (window.layer) {
                        layer.msg("请先加入房间，再发送内容")
                    }
                    this.addUserLogs("请先加入房间，再发送内容");
                    return
                }
                if (this.noOthersInRoom) {
                    if (window.layer) {
                        layer.msg("房间内至少需要两个人才能发送内容")
                    }
                    this.addUserLogs("房间内至少需要两个人才能发送内容");
                    return
                }
                if (isRealContentMode) {
                    let realContent = layedit.getContent(this.txtEditId)
                    if (realContent.length <= 0) {
                        if (window.layer) {
                            layer.msg("请输入发送的富文本内容")
                        }
                        this.addUserLogs("请输入发送的富文本内容");
                        return
                    }
                    if (realContent.length > 1000) {
                        if (window.layer) {
                            layer.msg("富文本文字内容过长，长度最多1w单词!")
                        }
                        this.addUserLogs("富文本文字内容过长，长度最多1w单词");
                        return
                    }
                    this.socket.emit('message', {
                        emitType: "sendTxt",
                        real : isRealContentMode,
                        content: encodeURIComponent(realContent),
                        room: this.roomId,
                        from: this.socketId,
                        recoderId: this.recoderId
                    });
                    if (window.layer) {
                        if (window.layui && window.layedit) {
                            this.txtEditId = window.layedit.build('txt', {
                                tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face'],
                                height: 180
                            });
                        }
                        this.sendFileList.push({
                            id: "txt",
                            name: realContent,
                            size: realContent.length,
                            type: "富文本内容",
                            process: 100,
                            done: true,
                            toIdStr: "",
                            start: 0,
                            cost: 0
                        });
                        layer.msg("富文本内容发送完毕")
                        this.addUserLogs("富文本内容发送完毕");
                    }
                } else {
                    let content = layedit.getText(this.txtEditId)
                    if (content.length <= 0) {
                        if (window.layer) {
                            layer.msg("请输入发送的文本内容")
                        }
                        this.addUserLogs("请输入发送的文本内容");
                        return
                    }
                    if (content.length > 1000) {
                        if (window.layer) {
                            layer.msg("文字内容过长，最多1000单词!")
                        }
                        this.addUserLogs("文字内容过长，最多1000单词");
                        return
                    }
                    this.socket.emit('message', {
                        emitType: "sendTxt",
                        real : isRealContentMode,
                        content: encodeURIComponent(content),
                        room: this.roomId,
                        from: this.socketId,
                        recoderId: this.recoderId
                    });
                    if (window.layer) {
                        if (window.layui && window.layedit) {
                            this.txtEditId = window.layedit.build('txt', {
                                tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face'],
                                height: 180
                            });
                        }
                        this.sendFileList.push({
                            id: "txt",
                            name: content,
                            size: content.length,
                            type: "文本内容",
                            process: 100,
                            done: true,
                            toIdStr: "",
                            start: 0,
                            cost: 0
                        });
                        layer.msg("内容发送完毕")
                        this.addUserLogs("内容发送完毕");
                    }
                }
            },
            clickHome: function (show = true) {
                this.currentMenu = 1;

                let active = document.querySelector("#btnHome")
                
                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
               
                if(this.toolListShadeIndex === -1){ // 没展开状态下才同步颜色
                    document.querySelector("#closeTool").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                }

                let menuBorder = document.querySelector(".menuBorder");
                let box = active.getBoundingClientRect();
                offsetMenuBorder(box, menuBorder);

                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth - box.width) / 2) + "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }

                if (show) {
                    this.clickSendFile();
                }
            },
            clickReceive: function (show = true) {
                this.currentMenu = 2;

                let active = document.querySelector("#btnReceive")

                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                if(this.toolListShadeIndex === -1){ // 没展开状态下才同步颜色
                    document.querySelector("#closeTool").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                }

                let menuBorder = document.querySelector(".menuBorder");
                let box = active.getBoundingClientRect();
                offsetMenuBorder(box, menuBorder);

                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth - box.width) / 2) + "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }

                if (show) {
                    this.clickReceiveFile()
                }
            },
            clickTxt: function (show = true) {
                this.currentMenu = 3;

                let active = document.querySelector("#btnTxt")

                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                if(this.toolListShadeIndex === -1){ // 没展开状态下才同步颜色
                    document.querySelector("#closeTool").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                }

                let menuBorder = document.querySelector(".menuBorder");
                let box = active.getBoundingClientRect();
                offsetMenuBorder(box, menuBorder);

                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth - box.width) / 2) + "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }

                if (show) {
                    this.clickReceiveTxt()
                }
            },
            clickCodeFile: function (show = true) {
                this.currentMenu = 4;

                let active = document.querySelector("#btnCodeFile");
                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                if(this.toolListShadeIndex === -1){ // 没展开状态下才同步颜色
                    document.querySelector("#closeTool").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                }

                let menuBorder = document.querySelector(".menuBorder");
                let box = active.getBoundingClientRect();
                offsetMenuBorder(box, menuBorder);

                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth - box.width) / 2) + "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }

                if (show) {
                    this.clickReceiveCodeFile()
                }
            },
            //点击切换发送文件或者发送文本
            changeFileOrTxt : function(){
                let that = this;
                this.isTxtMode = !this.isTxtMode;
                if (window.layui && window.layedit) {
                    this.txtEditId = window.layedit.build('txt', {
                        tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face'],
                        height: 180
                    });
                }
                $("#changeMode").removeClass("layui-anim-rotate")
                setTimeout(() => {
                    $("#changeMode").addClass("layui-anim-rotate")
                    if(window.layer){
                        layer.msg(`切换为${this.isTxtMode ? '文本模式' : '文件模式'}`)
                    }
                    this.addUserLogs(`切换为${this.isTxtMode ? '文本模式' : '文件模式'}`);
                }, 50)
            },
            //点击下载文件面板
            clickReceiveFile: function () {
                this.showReceiveFile = !this.showReceiveFile;
                if (this.showReceiveFile) {
                    this.addUserLogs("展开接收文件面板");
                    this.numReceiveFile = 50;
                } else {
                    this.numReceiveFile = 150;
                    this.addUserLogs("收起接收文件面板");
                }
            },
            //点击接收文字面板
            clickReceiveTxt: function () {
                this.showReceiveTxt = !this.showReceiveTxt;
                if (this.showReceiveTxt) {
                    this.addUserLogs("展开接收文字面板");
                    this.numReceiveTxt = 50;
                } else {
                    this.numReceiveTxt = 150;
                    this.addUserLogs("收起接收文字面板");
                }
            },
            //点击发送文件面板
            clickSendFile: function () {
                this.showSendFile = !this.showSendFile;
                if (this.showSendFile) {
                    this.numSendFile = 50;
                    this.addUserLogs("展开发送文件/文本面板");
                } else {
                    this.numSendFile = 150;
                    this.addUserLogs("收起发送文件/文本面板");
                }
            },
            //点击取件码面板
            clickReceiveCodeFile: function () {
                this.showCodeFile = !this.showCodeFile;
                if (this.showCodeFile) {
                    this.numCodeFile = 50;
                    this.addUserLogs("展开取件码面板");
                } else {
                    this.numCodeFile = 150;
                    this.addUserLogs("收起取件码面板");
                }
            },
            //点击查看日志面板
            clickLogs: function () {
                this.showLogs = !this.showLogs;
                if (this.showLogs) {
                    this.numLogs = 50;
                } else {
                    this.numLogs = 150;
                }
            },
            //文件大小
            getFileSizeStr: function (size) {
                let sizeStr = (size / 1048576).toString();
                let head = sizeStr.split(".")[0];
                let tail = "";
                if (sizeStr.split(".")[1]) {
                    tail = sizeStr.split(".")[1].substr(0, 3);
                }
                return head + '.' + tail + "M";
            },
            //创建文件发送房间
            createFileRoom: function () {
                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    if(window.layer){
                        layer.msg("请先填写房间号")
                    }else{
                        alert("请先填写房间号")
                    }
                    this.addUserLogs("请先填写房间号");
                    return;
                }
                if(!this.switchData.allowChinese && window.tlrtcfile.containChinese(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许中文")
                    }else{
                        alert("房间号不允许中文")
                    }
                    this.addUserLogs("房间号不允许中文");
                    return;
                }
                if(!this.switchData.allowNumber && window.tlrtcfile.containNumber(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许数字")
                    }else{
                        alert("房间号不允许数字")
                    }
                    this.addUserLogs("房间号不允许数字");
                    return;
                }
                if(!this.switchData.allowSymbol && window.tlrtcfile.containSymbol(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许特殊符号")
                    }else{
                        alert("房间号不允许特殊符号")
                    }
                    this.addUserLogs("房间号不允许特殊符号");
                    return;
                }
                if (this.chooseFileList.length > 0) {
                    if(window.layer){
                        layer.msg("请先加入房间再选文件")
                    }else{
                        alert("请先加入房间再选文件")
                    }
                    this.addUserLogs("请先加入房间再选文件");
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        if(window.layer){
                            layer.msg("房间号太长啦")
                        }else{
                            alert("房间号太长啦")
                        }
                        this.addUserLogs("房间号太长啦");
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId });
                    this.isJoined = true;
                    this.addPopup("你进入了房间" + this.roomId);
                    this.addUserLogs("你进入了房间" + this.roomId);
                }
            },
            //创建流媒体房间
            createMediaRoom: function (type) {
                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    if(window.layer){
                        layer.msg("请先填写房间号")
                    }else{
                        alert("请先填写房间号")
                    }
                    this.addUserLogs("请先填写房间号");
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        if(window.layer){
                            layer.msg("房间号太长啦")
                        }else{
                            alert("房间号太长啦")
                        }
                        this.addUserLogs("房间号太长啦");
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId, type : type });
                    this.isJoined = true;
                    this.addPopup("你进入了房间" + this.roomId);
                    this.addUserLogs("你进入了房间" + this.roomId);
                }
            },
            //创建密码房间
            createPasswordRoom: function (password) {
                this.roomId = this.roomId.toString().replace(/\s*/g, "")
                if (this.roomId === null || this.roomId === undefined || this.roomId === '') {
                    if(window.layer){
                        layer.msg("请先填写房间号")
                    }else{
                        alert("请先填写房间号")
                    }
                    this.addUserLogs("请先填写房间号");
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        if(window.layer){
                            layer.msg("房间号太长啦")
                        }else{
                            alert("房间号太长啦")
                        }
                        this.addUserLogs("房间号太长啦");
                        return;
                    }
                    if (password.toString().length > 15) {
                        if(window.layer){
                            layer.msg("密码太长啦")
                        }else{
                            alert("密码太长啦")
                        }
                        this.addUserLogs("密码太长啦");
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId, password : password });
                    this.isJoined = true;
                    this.addPopup("你进入了房间" + this.roomId);
                    this.addUserLogs("你进入了房间" + this.roomId);
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

                rtcConnect.onicecandidate = (e) => {
                    that.iceCandidate(rtcConnect, id, e)
                };

                //保存peer连接
                this.rtcConns[id] = rtcConnect;
                if (!this.remoteMap[id]) {
                    Vue.set(this.remoteMap, id, { id: id })
                }

                //数据通道
                this.initSendDataChannel(id);

                rtcConnect.onremovestream = (e) => {
                    that.removeStream(rtcConnect, id, e)
                };

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
            //当前用户开启了屏幕共享时建立 stream share 链接
            initMediaShareChannel: function(rtcConnect, type, track, stream){                
                rtcConnect.ontrack = (event) => {
                    setTimeout(()=>{
                        $("#mediaShareRoomList").append(`
                            <div class="swiper-slide mediaShareBlock">
                                <video id="otherMediaShareVideo" autoplay playsinline onclick="tlrtcfile.openFullVideo(this, '${type}')"></video>
                            </div>
                        `);
                        var video = document.querySelector("#otherMediaShareVideo");
                        video.srcObject = event.streams[0]
                        // ios 微信浏览器兼容问题
                        video.play();
                        document.addEventListener('WeixinJSBridgeReady',function(){
                            video.play();
                        },false);
                    },100)
                };

                if(track && stream){
                    rtcConnect.addTrack(track, stream);
                }
            },
            //连接创立时建立 send/receive Channel链接
            initSendDataChannel: function (id) {
                let that = this;

                let sendChannel = this.rtcConns[id].createDataChannel('sendDataChannel');
                sendChannel.binaryType = 'arraybuffer';

                sendChannel.addEventListener('open', (event) => {
                    if (sendChannel.readyState === 'open') {
                        that.addSysLogs("建立连接 : channel open")
                    }
                });
                sendChannel.addEventListener('close', (event) => {
                    if (sendChannel.readyState === 'close') {
                        that.addSysLogs("连接关闭 : channel close")
                    }
                });
                sendChannel.addEventListener('error', (error) => {
                    console.error(error.error)
                    that.addSysLogs("连接断开 : " + error)
                });
                this.rtcConns[id].addEventListener('datachannel', (event) => {
                    that.initReceiveDataChannel(event, id);
                });
                this.setRemoteInfo(id, { sendChannel: sendChannel });
            },
            // 初始发送
            initSendFile: function(){
                //选中一个文件
                this.changeSendFileNext();

                //发送给房间内所有人
                this.sendFileToRemoteAllByLoop();

                this.touchResize()
            },
            // 选一个未发送的文件进行发送，如有下一个，切换下一个文件
            changeSendFileNext: async function(){
                let that = this
                let chooseFile = null;

                this.addSysLogs("选择待发送文件中...")

                for(let i = 0; i < that.chooseFileList.length; i++){
                    let file = that.chooseFileList[i]
                    if (file.fileSendStatus === 0) {
                        chooseFile = file;
                        this.addSysLogs("选中待发送文件, 名称:"+file.name);
                        break;
                    }
                }

                that.currentChooseFile = chooseFile;
                if(chooseFile !== null){
                    that.currentChooseFile.fileSendStatus = 1;
                    that.socket.emit('message', {
                        emitType: "sendFileInfo",
                        index : that.currentChooseFile.index,
                        name: that.currentChooseFile.name,
                        type: that.currentChooseFile.type,
                        size: that.currentChooseFile.size,
                        room: that.roomId,
                        from: that.socketId,
                        recoderId: that.recoderId
                    });
                }
            },
            // 轮询着发送给房间内所有人
            sendFileToRemoteAllByLoop: function () {
                let that = this;
                if(that.currentChooseFile === null){
                    that.chooseFileList = []
                    that.addPopup("文件全部发送完毕");
                    that.addSysLogs("文件全部发送完毕")
                    that.isSending = false;
                    return;
                }
                that.isSending = true;
                
                //当前选中文件已发送给房间内所有人
                let nextSendingId = that.getSendFileNextRemote();
                if (nextSendingId === '') {
                    this.addSysLogs(this.currentChooseFile.name + "已发送给房间内所有人，1.5秒后准备发送下一个文件")
                    //切下一个文件的时候延迟一会，不要发的太急   
                    setTimeout(() => {
                        that.initSendFile()
                    }, 1500);
                    return
                }

                let remote = that.remoteMap[nextSendingId]
                let fileReader = remote[that.currentChooseFile.index + "reader"];

                fileReader.addEventListener('loadend', this.sendFileToRemoteByLoop);

                fileReader.addEventListener('error', error => {
                    that.addSysLogs("读取文件错误 : " + error);
                });

                fileReader.addEventListener('abort', event => {
                    that.addSysLogs("读取文件中断 : " + event);
                });

                that.readSlice(0);
            },
            //一次发送一个文件给一个用户
             sendFileToRemoteByLoop: function (event) {
                let that = this;
                let nextSendingId = this.getSendFileNextRemote();
                if (nextSendingId === '') {
                    return
                }
        
                let remote = this.remoteMap[nextSendingId];
                let fileOffset = remote[this.currentChooseFile.index+"offset"]
                let sendChannel = remote.sendChannel;
                if (!sendChannel || sendChannel.readyState !== 'open') {
                    this.addSysLogs("sendChannel 出错")
                    return;
                }

                let sendFileInfoAck = remote[this.currentChooseFile.index+"ack"]

                // 还不能进行发送，等一下
                if(!sendFileInfoAck){
                    this.addSysLogs("等待ack回执中...")
                    setTimeout(() => {
                        that.sendFileToRemoteByLoop(event)
                    }, 500);
                    return
                }

                this.setRemoteInfo(nextSendingId, {
                    [this.currentChooseFile.index + "status"] : 1
                }) 

                // 开始发送通知
                if (fileOffset === 0) {
                    this.addPopup("正在发送给" + nextSendingId.substr(0, 4) + ",0%。");
                    this.addSysLogs("正在发送给" + nextSendingId.substr(0, 4) + ",0%。")
                    this.updateSendFileProcess(nextSendingId, {
                        start: Date.now()
                    })
                }

                // 缓冲区満了
                if (sendChannel.bufferedAmount > sendChannel.bufferedAmountLowThreshold) {
                    this.addSysLogs("sendChannel缓冲区已满，等待中...")
                    sendChannel.onbufferedamountlow = () => {
                        this.addSysLogs("sendChannel缓冲区已恢复，继续发送中...")
                        sendChannel.onbufferedamountlow = null;
                        that.sendFileToRemoteByLoop(event);
                    }
                    return;
                }

                // 发送数据
                sendChannel.send(event.target.result);
                fileOffset += event.target.result.byteLength;
                remote[this.currentChooseFile.index+"offset"] = fileOffset
                this.currentSendSize += event.target.result.byteLength;
                this.currentSendAllSize += event.target.result.byteLength;

                //更新发送进度
                this.updateSendFileProcess(nextSendingId, {
                    process: parseInt((fileOffset / this.currentChooseFile.size) * 100)
                })

                //发送完一份重置相关数据
                if (fileOffset === this.currentChooseFile.size) {
                    this.currentSendSize = 0
                    this.addPopup("正在发送给" + nextSendingId.substr(0, 4) + ",100%。");
                    this.addSysLogs("正在发送给" + nextSendingId.substr(0, 4) + ",100%。")
                    this.socket.emit('message', {
                        emitType: "sendDone",
                        room: this.roomId,
                        from: this.socketId,
                        size: this.currentChooseFile.size,
                        name: this.currentChooseFile.name,
                        type: this.currentChooseFile.type,
                        to: nextSendingId
                    });
                    //更新发送进度
                    this.updateSendFileProcess(nextSendingId, {
                        done: true
                    })
                    this.setRemoteInfo(nextSendingId, {
                        [this.currentChooseFile.index + "status"] : 2 
                    })

                    //继续下一个用户
                    this.sendFileToRemoteAllByLoop()
                    return
                }

                // 继续下一个分片
                if(fileOffset < this.currentChooseFile.size){
                    this.readSlice(fileOffset + this.chunkSize)
                }
            },
            //获取需要进行发送的远程id
            getSendFileNextRemote: function(){
                this.addSysLogs("选择待发送的用户中...")

                let nextSendingId = "";
                
                //当前文件是否有正在发送中的
                let remoteHasSending = false; 
                for (let id in this.remoteMap) {
                    let remote = this.remoteMap[id];
                    let status = remote[this.currentChooseFile.index+"status"] || 0;
                    if (status === 1) { //有正在发送中的
                        remoteHasSending = true;
                        nextSendingId = id;
                    }
                }

                 //当前文件没有正在发送中的用户，取出等待中的用户
                if (!remoteHasSending) {
                    for (let id in this.remoteMap) {
                        let remote = this.remoteMap[id];
                        let status = remote[this.currentChooseFile.index+"status"] || 0;
                        if (status === 0) {
                            nextSendingId = id;
                        }
                    }
                }

                //当前文件是否已经发送给全部用户
                let remoteHasAllSended = true;
                for (let id in this.remoteMap) {
                    let remote = this.remoteMap[id];
                    let status = remote[this.currentChooseFile.index+"status"] || 0;
                    if (status === 0 || status === 1) { //有未发送的和正在发送的
                        remoteHasAllSended = false;
                    }
                }
                                
                //当前文件已经全部发送给全部用户，nextSendingId清空，外部判断nextSendingId为空，表示可以开启下一个文件发送
                if(remoteHasAllSended){
                    this.allSended = true;
                    this.currentChooseFile.fileSendStatus = 2;
                    return "";
                }

                this.addSysLogs("当前选中用户为: "+nextSendingId)

                return nextSendingId;
            },
            //文件分片 -- 发送
            readSlice: function (offset) {
                let nextSendingId = this.getSendFileNextRemote();
                if(nextSendingId !== ''){
                    let remote = this.remoteMap[nextSendingId]
                    let fileOffset = remote[this.currentChooseFile.index+"offset"]
                    let fileReader = remote[this.currentChooseFile.index + "reader"]
                    let slice = this.currentChooseFile.slice(fileOffset, offset + this.chunkSize);
                    fileReader.readAsArrayBuffer(slice);
                }
            },
            //创建接收文件事件
            initReceiveDataChannel: function (event, id) {
                if (!id || !event) {
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                if (currentRtc) {
                    let receiveChannel = event.channel;
                    receiveChannel.binaryType = 'arraybuffer';
                    receiveChannel.onmessage = (env) => {
                        this.receiveData(env, id);
                    };
                    receiveChannel.onopen = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs("receiveChannel 已就绪, readyState:"+readyState)
                    };
                    receiveChannel.onclose = () => {
                        const readyState = receiveChannel.readyState;
                        this.addSysLogs("receiveChannel 已关闭 readyState:"+readyState)
                    };
                    this.setRemoteInfo(id, { receiveChannel: receiveChannel });
                }
            },
            //接收文件
            receiveData: function (event, id) {
                if (!event || !id) {
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                let receiveFiles = currentRtc.receiveFiles;
 
                let name = receiveFiles.name;
                let size = receiveFiles.size;
                let type = receiveFiles.type;

                //获取数据存下本地
                let receiveBuffer = currentRtc.receiveBuffer || new Array();
                let receivedSize = currentRtc.receivedSize || 0;

                receiveBuffer.push(event.data);
                receivedSize += event.data.byteLength;
                document.querySelector("#receiveProgress").value = receivedSize;
                
                this.setRemoteInfo(id, { receiveBuffer: receiveBuffer, receivedSize: receivedSize })
                this.currentReceiveSize += event.data.byteLength;

                //更新接收进度
                this.updateReceiveProcess(id, {
                    process: parseInt((receivedSize / size) * 100)
                });

                if (receivedSize === size) {
                    this.currentReceiveSize = 0;
                    this.addSysLogs(name + " 接收完毕");
                    document.querySelector("#receiveProgress").value = 0;
                    this.addPopup("文件[ " + name + " ]接收完毕，可点击右下角查看。");

                    //更新接收进度
                    this.updateReceiveProcess(id, {
                        style: 'color: #ff5722;text-decoration: underline;',
                        href: URL.createObjectURL(new Blob(receiveBuffer), { type: type }),
                        done: true
                    });

                    //清除接收的数据缓存
                    this.setRemoteInfo(id, { receiveBuffer: new Array(), receivedSize: 0 })
                }
            },
            //关闭连接
            closeDataChannels: function () {
                for (let remote in this.remoteMap) {
                    let id = remote.id;
                    let sendChannel = remote.sendChannel;
                    let receiveChannel = remote.receiveChannel;
                    if (!id || !sendChannel || !receiveChannel) {
                        continue;
                    }
                    sendChannel.close();
                    receiveChannel.close();
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
            updateReceiveProcess: function (id, data) {
                for (let i = 0; i < this.receiveFileList.length; i++) {
                    let item = this.receiveFileList[i];
                    if (item.id === id && !item.done) {
                        if(item.start === 0){
                            item.start = Date.now();
                        }
                        data.cost = parseInt((Date.now() - item.start) / 1000);
                        Object.assign(this.receiveFileList[i], data);
                    }
                }
            },
            //更新文件发送进度
            updateSendFileProcess: function (id, data) {
                for (let i = 0; i < this.sendFileList.length; i++) {
                    let item = this.sendFileList[i];
                    if (item.id === id && item.index === this.currentChooseFile.index && !item.done) {
                        data.cost = parseInt((Date.now() - item.start) / 1000);
                        Object.assign(this.sendFileList[i], data);
                    }
                }
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
                delete this.rtcConns[id];
                delete this.remoteMap[id];
            },
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
            offerFailed: function (rtcConnect, id, error) {
                this.addSysLogs("offer失败," + error);
            },
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
            answerFailed: function (rtcConnect, id, error) {
                this.addSysLogs("answer失败," + error);
            },
            addIceCandidateSuccess: function (res) {
                this.addSysLogs("addIceCandidateSuccess成功");
            },
            addIceCandidateFailed: function (err) {
                this.addSysLogs("addIceCandidate失败," + err);
            },
            socketListener: function () {
                let that = this;
                
                this.socket.on('created', async function (data) {
                    that.addSysLogs("创建房间," + JSON.stringify(data));
                    that.socketId = data.id;
                    that.roomId = data.room;
                    that.recoderId = data.recoderId;
                    if(data.type === 'screen' && data['peers'].length === 0){
                        window.Bus.$emit("startScreenShare", data.id);
                    }
                    if(data.type === 'video' && data['peers'].length === 0){
                        window.Bus.$emit("startVideoShare", data.id);
                    }
                    for (let i = 0; i < data['peers'].length; i++) {
                        let otherSocketId = data['peers'][i].id;
                        let rtcConnect = that.getOrCreateRtcConnect(otherSocketId);
                        if(data.type === 'screen'){
                            window.Bus.$emit("startScreenShare", otherSocketId, (track, stream) => {
                                that.initMediaShareChannel(rtcConnect, data.type, track, stream)
                                rtcConnect.createOffer(that.options).then(offer => {
                                    that.offerSuccess(rtcConnect, otherSocketId, offer);
                                }, error => {
                                    that.offerFailed(rtcConnect, otherSocketId, error);
                                });
                            });
                        }else if(data.type === 'video'){
                            window.Bus.$emit("startVideoShare", otherSocketId, (track, stream) => {
                                that.initMediaShareChannel(rtcConnect, data.type, track, stream)
                                rtcConnect.createOffer(that.options).then(offer => {
                                    that.offerSuccess(rtcConnect, otherSocketId, offer);
                                }, error => {
                                    that.offerFailed(rtcConnect, otherSocketId, error);
                                });
                            });
                        }else{
                            rtcConnect.createOffer(that.options).then(offer => {
                                that.offerSuccess(rtcConnect, otherSocketId, offer);
                            }, error => {
                                that.offerFailed(rtcConnect, otherSocketId, error);
                            });
                        }
                    }
                    that.touchResize();
                });

                this.socket.on('joined', function (data) {
                    that.addSysLogs("加入房间," + JSON.stringify(data));
                    that.recoderId = data.recoderId;
                    let rtcConnect = that.getOrCreateRtcConnect(data.id);
                    if(data.type === 'screen'){
                        window.Bus.$emit("getScreenShareTrackAndStream", (track, stream) => {
                            that.initMediaShareChannel(rtcConnect, data.type, track, stream)
                        });
                    }
                    if(data.type === 'video'){
                        window.Bus.$emit("getVideoShareTrackAndStream", (track, stream) => {
                            that.initMediaShareChannel(rtcConnect, data.type, track, stream)
                        });
                    }
                    that.addPopup(data.id + "加入了房间。");
                    that.touchResize();
                });

                this.socket.on('offer', function (data) {
                    that.addSysLogs("offer," + JSON.stringify(data));
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
                    that.addSysLogs("answer," + JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'answer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
                });

                this.socket.on('candidate', function (data) {
                    that.addSysLogs("candidate," + JSON.stringify(data));
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
                        that.addPopup(data.from + "退出了房间。");
                        that.addSysLogs("退出房间," + JSON.stringify(data));
                        that.getOrCreateRtcConnect(data.from).close;
                        delete that.rtcConns[data.from];
                        Vue.delete(that.remoteMap, data.from);
                    }
                    that.touchResize();
                })

                //选中文件时发送给接收方
                this.socket.on('sendFileInfo', function (data) {
                    let fromId = data.from;
                    that.setRemoteInfo(fromId, { receiveFiles : data });
                    that.addPopup(data.from + "选择了文件 [ " + data.name + " ]，即将发送。");
                    that.addSysLogs(data.from + "选择了文件 [ " + data.name + " ]，即将发送。");
                    document.querySelector("#receiveProgress").max = data.size;

                    that.receiveFileList.push({
                        id: fromId,
                        index : data.index,
                        href: "",
                        name: data.name,
                        type: data.type,
                        size: data.size,
                        process: 0,
                        done: false,
                        start: 0,
                        cost: 0
                    })

                    data.emitType = "sendFileInfoAck";
                    data.from = that.socketId; // from代表自己发出去的回执
                    data.to = fromId; // 谁发过来的就回执给谁
                    that.socket.emit("message", data)
                });

                //接收放已经收到待发送文件信息，代表可以进行发送了，
                //没有ack的话，由于发送文件信息(websocket)和发送文件流(webrtc)是分开的
                //webrtc和websocket之间互存在一个时差，导致接收的时候报错
                this.socket.on('sendFileInfoAck', function (data) {
                    let to = data.to;
                    let fromId = data.from;
                    if(to === that.socketId){ // 是自己发出去的文件ack回执
                        that.addSysLogs("收到ack回执，准备发送给"+fromId)
                        that.setRemoteInfo(fromId, {
                            [that.currentChooseFile.index + "ack"] : true
                        }) 
                    }
                })

                //发送文字内容
                this.socket.on('sendTxt', function (data) {
                    let fromId = data.from;
                    that.addPopup(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");
                    that.addSysLogs(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");

                    try{
                        data.content = decodeURIComponent(data.content)
                    }catch(e){
                        that.addSysLogs("decode msg err : "+data.content);
                    }
                    that.receiveTxtList.unshift({
                        id: fromId,
                        real : data.real,
                        content: data.content,
                        time: new Date().toLocaleString(),
                        c_id: "txt_" + that.receiveTxtList.length,
                        process: 0,
                        done: false,
                        start: 0,
                        cost: 0
                    })
                });

                //在线数量
                this.socket.on('count', function (data) {
                    that.allManCount = data.mc;
                    that.addSysLogs("当前人数 : "+data.mc+"人在线")
                });

                //提示
                this.socket.on('tips', function (data) {
                    if (window.layer) {
                        layer.msg(data.msg)
                        if(data.reload){
                            setTimeout(() => {
                                window.location.reload()
                            }, 1000);
                        }
                    }
                });

                //关闭共享
                this.socket.on('stopScreenShare', function (data) {
                    if(data.id === that.socketId){
                        $("#selfMediaShareVideo").parent().remove();
                    }else{
                        $("#otherMediaShareVideo").parent().remove();
                    }
                });

                //关闭音视频
                this.socket.on('stopVideoShare', function (data) {
                    if(data.id === that.socketId){
                        $("#selfMediaShareVideo").parent().remove();
                    }else{
                        $("#otherMediaShareVideo").parent().remove();
                    }
                });

                //取件码文件
                this.socket.on('codeFile', function (data) {
                    that.codeFileList = data.list;
                    that.addSysLogs("收到取件码文件信息")
                });

                //ai对话
                this.socket.on('openaiAnswer', function (data) {
                    that.isAiAnswering = false
                    that.aiChatList.push(data)
                    that.addSysLogs("AI : "+data.content)
                    if (window.layer) {
                        layer.msg("AI回复了你，快点聊起来吧～")
                    }
                    that.aiChatList.forEach(item=>{
                        item.time = window.util ? util.timeAgo(item.time) : item.time;
                    })
                    that.openaiChatTpl()
                });

                //开关数据
                this.socket.on('commData', function (data) {
                    that.switchData = data.switchData
                    that.switchDataGet = true;
                    data.chatingData.forEach(elem=>{
                        try{
                            elem.msg = decodeURIComponent(elem.msg)
                        }catch(e){
                            that.addSysLogs("decode msg err : "+elem.msg);
                        }
                        that.chatingList.push(elem)
                    })
                    that.chatingList.forEach(item=>{
                        item.time = window.util ? util.timeAgo(item.time) : item.time;
                    })
                });

                //公共聊天频道
                this.socket.on('chating', function (data) {
                    that.addSysLogs(data.room + "频道的" + data.socketId + "发言: [ " + data.msg + " ]");
                    try{
                        data.msg = decodeURIComponent(data.msg)
                    }catch(e){
                        that.addSysLogs("decode msg err : "+data.msg);
                    }
                    that.chatingList.push(data);
                    if(that.chatingList.length > 10){
                        that.chatingList.shift();
                    }
                    that.chatingList.forEach(item=>{
                        item.time = window.util ? util.timeAgo(item.time) : item.time;
                    })
                    that.chatingTpl()
                });

                this.socket.on('manageCheck', function (data) {
                    if (window.layer) {
                        layer.prompt({
                            formType: 1,
                            title: '请输入',
                        }, function (value, index, elem) {
                            that.socket.emit('manageConfirm', {
                                room: that.roomId,
                                value: value
                            });
                            layer.close(index)
                        });
                    }
                });

                this.socket.on('manage', function (data) {
                    if (window.layer) {
                        if(data.socketId !== that.socketId){
                            layer.msg("非法触发事件")
                            return
                        }
                        layer.closeAll();
                        that.token = data.token;
                        layer.load(2, {
                            time: 1000,
                            shade: [0.8, '#000000'],
                            success: function(layero){
                                layer.setTop(layero); //重点2
                            }
                        })
                        setTimeout(() => {
                            that.manageIframeId = layer.tab({
                                area: ['100%', '100%'],
                                shade: [0.8, '#393D49'],
                                // closeBtn: 0,
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
                                cancel: function(index, layero){
                                    that.manageIframeId = 0;
                                },
                            })
                            layer.full( that.manageIframeId )
                        }, 500);
                    }
                });

                //通知
                this.socket.on('close', function (data) {
                    let msg = data.msg || ''
                    if (msg) {
                        window.layer.open({
                            title: '网站自动通知-' + new Date().toLocaleString(),
                            content: msg
                        });
                    }
                });
            },
            webrtcCheck : function(){
                let that = this;
                if(window.tlrtcfile){
                    $("#check").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#check").addClass("layui-anim-rotate")
                        let check = tlrtcfile.supposeWebrtc();
                        if(window.layer){
                            layer.msg(`你的浏览器${check? '支持' : '不支持'}webrtc`)
                        }
                        that.addUserLogs(`你的浏览器${check? '支持' : '不支持'}webrtc`)
                    }, 50)
                }
            },
            initCss: function (e) {
                if (!e) return;
                if (this.currentMenu === 1) {
                    this.clickHome(false);
                } else if (this.currentMenu === 2) {
                    this.clickReceive(false);
                } else if (this.currentMenu === 3) {
                    this.clickTxt(false);
                } else if (this.currentMenu === 4) {
                    this.clickCodeFile(false);
                }
                
                //re caculate size
                this.reCaculateSwiperSize();

                //manage frame resize
                if(window.layer && this.manageIframeId !== 0){
                    layer.full(this.manageIframeId)
                }

                //full video
                if(document.querySelector("#selfMediaShareVideo_full")){
                    document.querySelector("#selfMediaShareVideo_full").parentElement.style.height = "auto"
                }
                if(document.querySelector("#otherMediaShareVideo_full")){
                    document.querySelector("#otherMediaShareVideo_full").parentElement.style.height = "auto"
                }

                // logs height
                this.logsHeight = document.documentElement.clientHeight - 55;
            },
            reCaculateSwiperSize: function () {
                let clientWidth = document.body.clientWidth;
                if (window.userRoomSwiper) {
                    let slidesPerView = parseInt((clientWidth / 100)) - 1;
                    window.userRoomSwiper.params.slidesPerView = slidesPerView;
                }
                if (window.fileRoomSwiper) {
                    let slidesPerView = parseInt((clientWidth / 100)) - 1;
                    window.fileRoomSwiper.params.slidesPerView = slidesPerView;
                }
                if (window.fileRoomDisabledSwiper) {
                    let slidesPerView = parseInt((clientWidth / 100)) - 1;
                    window.fileRoomDisabledSwiper.params.slidesPerView = slidesPerView;
                }
                if (window.mediaShareRoomSwiper) {
                    let slidesPerView = parseInt((clientWidth / 100)) - 1;
                    window.mediaShareRoomSwiper.params.slidesPerView = slidesPerView;
                }
            },
            touchResize: function () {
                let that = this;
                setTimeout(() => {
                    var myEvent = new Event('resize');
                    window.dispatchEvent(myEvent);
                    that.reCaculateSwiperSize();
                }, 100)
            },
            websiteNotify : function(){
                let that = this;
                if (window.location.search && window.location.search.includes("notice=iamtsm&msg=")) {
                    setTimeout(() => {
                        let msg = window.location.search.split("msg=")[1]
                        try{
                            msg = decodeURIComponent(msg)
                        }catch(e){
                            that.addSysLogs("decode msg err : "+msg);
                        }
                        that.socket.emit('close', {
                            msg: msg
                        });
                        that.addSysLogs("发送网站通知:"+msg)
                    }, 2000)
                }
            },
            loadVConsoleJs : function(){
                let that = this;
                if (window.location.hash && window.location.hash.includes("debug")) {
                    window.tlrtcfile.loadJS('/static/js/vconsole.min.js', function () {
                        window.tlrtcfile.loadJS('/static/js/vconsole.js', function () {
                            that.addSysLogs("load vconsole success")
                        });
                    });
                }
            },
            toolList : function(){
                let that = this;
                setTimeout(()=>{
                    if(window.$){
                        $('.toolList a').on('click', function () {
                            let $this = $(this);
                            if($this.hasClass("layui-icon-component")){
                                return
                            }
                            if ($this.hasClass('fan-out')) {
                                $('.toolList').removeClass('fan-out');
                                $('.toolList a').removeClass('fan-out');
                                $('.toolList').css("marginBottom","0")
                                $("#layui-layer-shade"+that.toolListShadeIndex).remove()
                                $("#closeTool").css("backgroundColor","rgb(79, 79, 65)")
                            } else {
                                $('.toolList').addClass('fan-out');
                                $('.toolList a').addClass('fan-out');
                                $('.toolList').css("marginBottom","110px")
                                $("#closeTool").css("backgroundColor","rgb(0 0 0)")
                                layer.msg('', {shade: 0.8, time: 0 ,
                                    success: function(layero, index){
                                        that.toolListShadeIndex = index;
                                        $(layero.selector).remove()
                                        $("#layui-layer-shade"+index).css("zIndex",1000);
                                        $("#closeTool").css("backgroundColor","unset")
                                    }
                                });
                            }
                        });
                        layer.tips('更多功能都放在这里啦，点开看看吧～', '#closeToolIcon', {
                            tips: 1
                        });
                    }
                    setInterval(() => {
                        let colors = ["#deb887","#faebd7","#6495ed","#008b8b","#87ceeb","#48d1cc"]
                        $("#closeToolIcon").css("color",colors[parseInt(Math.random(1000)*1000) % 6])
                    }, 1000);
                },1000)
            },
            windowOnBusEvent : function(){
                window.Bus.$on("changeScreenState", (res) => {
                    this.isScreen = res
                })
                window.Bus.$on("changeScreenTimes", (res) => {
                    this.screenTimes = res
                })
                window.Bus.$on("changeScreenShareState", (res) => {
                    this.isScreenShare = res
                })
                window.Bus.$on("changeScreenShareTimes", (res) => {
                    if(res === 0){
                        this.socket.emit('message', {
                            emitType: "stopScreenShare",
                            id : this.socketId,
                            room : this.roomId,
                            cost : this.screenShareTimes
                        });
                    }
                    this.screenShareTimes = res
                })
                window.Bus.$on("changeVideoShareState", (res) => {
                    this.isVideoShare = res
                })
                window.Bus.$on("changeVideoShareTimes", (res) => {
                    if(res === 0){
                        this.socket.emit('message', {
                            emitType: "stopVideoShare",
                            id : this.socketId,
                            room : this.roomId,
                            cost : this.videoShareTimes
                        });
                    }
                    this.videoShareTimes = res
                })
                window.Bus.$on("sendChating", (res) => {
                    this.sendChating()
                })
                window.Bus.$on("sendOpenaiChat", (res) => {
                    this.sendOpenaiChat()
                })
                window.Bus.$on("sendOpenaiChatWithContext", () => {
                    this.openaiSendContext = !this.openaiSendContext;
                    if(window.layer){
                        layer.msg(`AI智能理解上下文开关${this.openaiSendContext ? '已开启' : '已关闭'}`)
                        this.addUserLogs(`AI智能理解上下文开关${this.openaiSendContext ? '已开启' : '已关闭'} `)
                    }
                    $("#aiContext").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#aiContext").addClass("layui-anim-rotate")
                    }, 50)
                })
                window.Bus.$on("manageChange", (data) => {
                    this.socket.emit('manageChange', {
                        id : data.id,
                        room : this.roomId,
                        token: this.token,
                        content: data.content,
                    });
                })
                window.Bus.$on("manageReload", (data) => {
                    this.socket.emit('manageReload', {
                        id : data.id,
                        room : this.roomId,
                        token: this.token,
                        content: data.time,
                    });
                })
                window.Bus.$on("webrtcCheck", (res) => {
                    this.webrtcCheck()
                })
                window.Bus.$on("sendBugs", (res) => {
                    this.sendBugs()
                })
                window.Bus.$on("relaySetting", (res) => {
                    this.relaySetting()
                })
            },
            renderChooseFileComp : function(){
                let that = this;
                if(window.upload){
                    upload.render({
                        elem: '#chooseFileList',
                        accept : 'file',
                        auto: false,
                        drag :true,
                        multiple: true,
                        choose: function(obj){
                            for(let index in obj.pushFile()){
                                let hasSendFile = that.sendFileList.filter(file=>{
                                    return file.name === obj.pushFile()[index].name && file.size === obj.pushFile()[index].size 
                                    && file.type === obj.pushFile()[index].type
                                }).length > 0;

                                if(hasSendFile && window.layer){
                                    layer.msg("已过滤发送过的文件");
                                    that.addUserLogs("已过滤发送过的文件");
                                }

                                if(!hasSendFile){
                                    that.chooseFileList.push(
                                        Object.assign(obj.pushFile()[index],{
                                            index : 'file'+index,
                                            fileSendStatus : 0,
                                            offset : 0
                                        })
                                    )
                                }
                            }
                        }
                    });
                }
            }
        },
        mounted: function () {
            
            this.addSysLogs("SOCKET监听 初始化中...");
            this.socketListener();
            this.addSysLogs("SOCKET监听 初始化完成");

            this.addSysLogs("基础数据 获取中...");
            this.socket.emit('getCommData', {});
            this.addSysLogs("基础数据 初始化完成");

            this.addSysLogs("窗口事件监听 初始化中...");
            window.onresize = this.initCss;
            this.addSysLogs("窗口事件监听 初始化完成");

            this.addSysLogs("分享组件 初始化中...");
            this.handlerRoomHistory();
            this.addSysLogs("分享组件 初始化完成");

            this.addSysLogs("公共事件监听 初始化中...");
            this.windowOnBusEvent();
            this.addSysLogs("公共事件监听 初始化完成");

            setTimeout(() => {
                this.addSysLogs("文件选择组件 初始化中...");
                this.renderChooseFileComp();
                this.addSysLogs("文件选择组件 初始化完成");
            }, 2000);

            this.addSysLogs("右侧工具动画 初始化中...");
            this.toolList();
            this.addSysLogs("右侧工具动画 初始化完成");

            this.addSysLogs("基础样式 初始化中...");
            this.logsHeight = document.documentElement.clientHeight - 55;
            this.clickHome(false);
            this.addSysLogs("基础样式 初始化完成");

            this.addSysLogs("网站通知 初始化中...");
            this.websiteNotify();
            this.addSysLogs("网站通知 初始化中完成");

            this.addSysLogs("DEBUG组件 初始化中...");
            this.loadVConsoleJs();
            this.addSysLogs("DEBUG组件 初始化中完成");

            this.addSysLogs("当前中继服务状态 : "+(this.useTurn ? '启用中':'已禁用'))
        }
    });

    window.manageReload = function (data) {
        window.Bus.$emit("manageReload", data)
    }
    window.manageChange = function (data) {
        window.Bus.$emit("manageChange", data)
    }
    window.sendChating = function () {
        window.Bus.$emit("sendChating", {})
    }
    window.sendOpenaiChat = function () {
        window.Bus.$emit("sendOpenaiChat", {})
    }
    window.webrtcCheck = function () {
        window.Bus.$emit("webrtcCheck", {})
    }
    window.sendBugs = function () {
        window.Bus.$emit("sendBugs", {})
    }
    window.sendOpenaiChatWithContext = function () {
        window.Bus.$emit("sendOpenaiChatWithContext", {})
    }
    window.relaySetting = function(){
        window.layer.closeAll(()=>{
            window.Bus.$emit("relaySetting", {})
        });
    }
    window.notUseRelay = function(){
        let notUseRelay = window.localStorage.getItem("tl-rtc-file-not-use-relay");
        if(notUseRelay && notUseRelay === 'true'){
            window.localStorage.setItem("tl-rtc-file-not-use-relay",false)
        }else{
            window.localStorage.setItem("tl-rtc-file-not-use-relay",true)
        }
        window.location.reload()
    }
})


