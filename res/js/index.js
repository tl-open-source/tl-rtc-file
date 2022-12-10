// file.js
var file = null;
axios.get(window.prefix + "/api/comm/initData", {}).then((initData) => {
    let resData = initData.data;

    file = new Vue({
        el: '#fileApp',
        data: function () {
            let socket = null;
            if (io) {
                socket = io(resData.wsHost);
            }
            return {
                socket: socket,
                config: resData.rtcConfig,
                options: resData.options,
                isJoined: false,
                showReceiveFile: false,
                showSendFile: false,
                showReceiveTxt: false,
                showLogs: false,
                numSendFile: 150,
                numReceiveFile: 150,
                numReceiveTxt: 150,
                numLogs: 150,
                currentMenu: 1,
                logsHeight: 0,
                allManCount: 0,
                isTxtMode: false,
                txtEditId: 0,
                isRealContentMode: false, //是否使用富文本内容
                nickName: "", //本人名称
                socketId: 0, //本人的id
                roomId: "10086", //房间号
                recoderId: 0, //记录id
                rtcConns: {}, //远程连接
                remoteMap: {}, //远程连接map

                chunkSize: 256 * 1024, //webrtc 一块256kb
                allSended: false,//当前文件是否全部发送给房间内所有用户
                currentReceiveSize: 0, //统计收到文件的大小
                currentSendSize : 0, //统计发送文件的大小

                currentChooseFile : null, //当前发送中的文件
                chooseFileList : [], //选择的文件列表
                sendFileList: [], //发过文件的列表
                receiveFileList: [], //接收文件的列表
                receiveTxtList: [], //接收的文字列表 
                chatingList: [], //公共聊天频道内容
                logs: [],  //记录日志

                isScreen: false, //是否在录屏中
                screenTimes: 0,  //当前录屏时间
                isScreenShare: false, //是否在屏幕共享中
                screenShareTimes: 0,  //当前屏幕共享时间
                isVideoShare: false, //是否在音视频中
                videoShareTimes: 0,  //当前音视频时间

                switchData : {}, //配置开关数据
                token: "", //登录token
                manageIframeId : 0 //实现自适应
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
        },
        watch: {
            allManCount: function (newV, oldV) {

            },
            currentMenu: function (newV, oldV) {

            },
            allSended: function (newV, oldV) {

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
                        that.$refs['sendProgress'].max += file.size;
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
                            }
                        }
                    })
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            coffee: function(){
                if (window.layer) {
                    let options = {
                        type: 1,
                        fixed: false,
                        maxmin: false,
                        shadeClose:true,
                        area: ['300px', '350px'],
                        title: "请楼主喝一杯咖啡",
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
                    layer.open(options)
                }
            },
            startVideoShare: function(){
                if (this.isScreenShare) {
                    if (window.layer) {
                        layer.msg("当前正在屏幕共享中，退出后再试")
                    }
                    return
                }
                if (!this.isVideoShare) {
                    if (this.createDisabled) {
                        if (window.layer) {
                            layer.msg("请先退出房间后，再发起音视频通话")
                        }
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
                        });
                    }
                } else {
                    window.Bus.$emit("stopVideoShare")
                    this.isVideoShare = !this.isVideoShare;
                }
            },
            startScreenShare: function(){
                if (this.isVideoShare) {
                    if (window.layer) {
                        layer.msg("当前正在音视频通话中，退出后再试")
                    }
                    return
                }
                if (!this.isScreenShare) {
                    if (this.createDisabled) {
                        if (window.layer) {
                            layer.msg("请先退出房间后，再发起屏幕共享")
                        }
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
                        });
                    }
                } else {
                    window.Bus.$emit("stopScreenShare")
                    this.isScreenShare = !this.isScreenShare;
                }
            },
            startScreen: function () {
                if (this.isMobile) {
                    if (window.layer) {
                        layer.msg("移动端暂不支持屏幕录制")
                    }
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
                        this.roomId = (roomIdArgs[1] + "").replace(/\s*/g, "").substr(0, 15);
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
                            this.logs.push("你通过分享加入了房间号为 " + this.roomId);
                        }
                    }
                }
            },
            chating: function () {
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
                                active = that.$refs['btnHome'];
                            } else if (that.currentMenu === 2) {
                                active = that.$refs['btnReceive'];
                            } else if (that.currentMenu === 3) {
                                active = that.$refs['btnTxt'];
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
                                <textarea style="border-radius: 15px;" maxlength="50000" id="blog_comment" class="layui-textarea" placeholder="文明发言，理性交流 ~"></textarea>
                                <button style="float: right;margin-top: 10px;" onclick="sendChating()" type="button" class="layui-btn layui-btn-normal layui-btn-sm">发言</button>
                            </div>
                        `
                    }
                    if (this.isMobile) {
                        delete options.area
                    }
                    let index = layer.open(options)
                    if (this.isMobile) {
                        layer.full(index)
                    }
                }
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
            tpl: function (tpl_html, data, tpl_view_html) {
                if (window.laytpl) {
                    laytpl(tpl_html.innerHTML).render(data, (html) => {
                        tpl_view_html.innerHTML = html;
                    });
                }
            },
            sendChating: function () {
                let content = document.querySelector("#blog_comment").value;
                if (!this.createDisabled) {
                    if (window.layer) {
                        layer.msg("请先加入房间，才能发言哦")
                    }
                    return
                }
                if (content === '' || content === undefined) {
                    if (window.layer) {
                        layer.msg("请先填写内容哦")
                    }
                    return
                }
                if (content.length > 1000) {
                    if (window.layer) {
                        layer.msg("内容太长啦，不能超过1000个字")
                    }
                    return
                }
                this.socket.emit('chating', {
                    recoderId: this.recoderId,
                    msg: content,
                    room: this.roomId,
                    socketId: this.socketId,
                    time: new Date().toLocaleString()
                });

                document.querySelector("#blog_comment").value = ''
            },
            sendBugs: function () {
                if (window.layer) {
                    let that = this;
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
                    });
                }
            },
            refleshRoom: function () {
                if (!this.createDisabled) {
                    this.roomId = parseInt(Math.random() * 100000);
                    this.addPopup("你刷新了房间号, 当前房间号为 " + this.roomId);
                    this.logs.push("你刷新了房间号, 当前房间号为 " + this.roomId);
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
            sendTxt: function () {
                if (!this.createDisabled) {
                    if (window.layer) {
                        layer.msg("请先加入房间，再发送内容")
                    }
                    return
                }
                if (this.noOthersInRoom) {
                    if (window.layer) {
                        layer.msg("房间内至少需要两个人才能发送内容")
                    }
                    return
                }
                if (this.isRealContentMode) {
                    let realContent = layedit.getContent(this.txtEditId)
                    if (realContent.length <= 0) {
                        if (window.layer) {
                            layer.msg("请输入发送的富文本内容")
                        }
                        return
                    }
                    if (realContent.length > 1000) {
                        if (window.layer) {
                            layer.msg("富文本文字内容过长，长度最多1w单词!")
                        }
                        return
                    }
                    this.socket.emit('message', {
                        emitType: "sendTxt",
                        content: encodeURIComponent(realContent),
                        room: this.roomId,
                        from: this.socketId,
                        recoderId: this.recoderId
                    });
                    if (window.layer) {
                        if (window.layui && window.layedit) {
                            this.txtEditId = window.layedit.build('txt', {
                                tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face']
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
                    }
                } else {
                    let content = layedit.getText(this.txtEditId)
                    if (content.length <= 0) {
                        if (window.layer) {
                            layer.msg("请输入发送的文本内容")
                        }
                        return
                    }
                    if (content.length > 1000) {
                        if (window.layer) {
                            layer.msg("文字内容过长，最多1000单词!")
                        }
                        return
                    }
                    this.socket.emit('message', {
                        emitType: "sendTxt",
                        content: encodeURIComponent(content),
                        room: this.roomId,
                        from: this.socketId,
                        recoderId: this.recoderId
                    });
                    if (window.layer) {
                        if (window.layui && window.layedit) {
                            this.txtEditId = window.layedit.build('txt', {
                                tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face']
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
                    }
                }
            },
            clickHome: function (show = true) {
                this.currentMenu = 1;


                let active = this.$refs['btnHome'];
                
                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");

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

                let active = this.$refs['btnReceive'];
                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");

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

                let active = this.$refs['btnTxt'];
                document.querySelector("#iamtsm").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileListDisable").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector("#chooseFileList").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");

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
            //点击下载文件
            clickReceiveFile: function () {
                this.showReceiveFile = !this.showReceiveFile;
                if (this.showReceiveFile) {
                    this.numReceiveFile = 50;
                } else {
                    this.numReceiveFile = 150;
                }
            },
            //点击接收文字
            clickReceiveTxt: function (change = true) {
                if (change) {
                    this.isTxtMode = !this.isTxtMode;
                    if (window.layui && window.layedit) {
                        this.txtEditId = window.layedit.build('txt', {
                            tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right', 'face']
                        });
                    }
                }

                this.showReceiveTxt = !this.showReceiveTxt;
                if (this.showReceiveTxt) {
                    this.numReceiveTxt = 50;
                } else {
                    this.numReceiveTxt = 150;
                }
            },
            //点击发送文件
            clickSendFile: function () {
                this.showSendFile = !this.showSendFile;
                if (this.showSendFile) {
                    this.numSendFile = 50;
                } else {
                    this.numSendFile = 150;
                }
            },
            //点击查看日志
            clickLogs: function () {
                this.showLogs = !this.showLogs;
                if (this.showLogs) {
                    this.numLogs = 50;
                } else {
                    this.numLogs = 150;
                }
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
                    return;
                }
                if(!this.switchData.allowChinese && window.tlrtcfile.containChinese(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许中文")
                    }else{
                        alert("房间号不允许中文")
                    }
                    return;
                }
                if(!this.switchData.allowNumber && window.tlrtcfile.containNumber(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许数字")
                    }else{
                        alert("房间号不允许数字")
                    }
                    return;
                }
                if(!this.switchData.allowSymbol && window.tlrtcfile.containSymbol(this.roomId)){
                    if(window.layer){
                        layer.msg("房间号不允许特殊符号")
                    }else{
                        alert("房间号不允许特殊符号")
                    }
                    return;
                }
                if (this.chooseFileList.length > 0) {
                    if(window.layer){
                        layer.msg("请先加入房间再选文件")
                    }else{
                        alert("请先加入房间再选文件")
                    }
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        if(window.layer){
                            layer.msg("房间号太长啦")
                        }else{
                            alert("房间号太长啦")
                        }
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId });
                    this.isJoined = true;
                    this.addPopup("你进入了房间" + this.roomId);
                    this.logs.push("你进入了房间" + this.roomId);
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
                    return;
                }
                if (this.roomId) {
                    if (this.roomId.toString().length > 15) {
                        if(window.layer){
                            layer.msg("房间号太长啦")
                        }else{
                            alert("房间号太长啦")
                        }
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId, type : type });
                    this.isJoined = true;
                    this.addPopup("你进入了房间" + this.roomId);
                    this.logs.push("你进入了房间" + this.roomId);
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
            //获取rtc缓存连接
            getRtcConnect: function (id) {
                return this.rtcConns[id];
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
                let rtcConnect = this.getRtcConnect(id);
                if (typeof (rtcConnect) == 'undefined') {
                    rtcConnect = this.createRtcConnect(id);
                }
                return rtcConnect;
            },
            //当前用户开启了屏幕共享时建立 stream share 链接
            initMediaShareChannel: function(id, type, track, stream){
                let rtcConnect = this.getOrCreateRtcConnect(id);
                
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

                sendChannel.addEventListener('open', () => {
                    if (sendChannel.readyState === 'open') {
                        that.logs.push("建立连接 : channel open")
                    }
                });

                sendChannel.addEventListener('close', () => {
                    if (sendChannel.readyState === 'close') {
                        that.logs.push("连接关闭 : channel close")
                    }
                });

                sendChannel.addEventListener('error', (error) => {
                    console.error(error.error)
                    that.logs.push("连接断开 : " + error)
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
                this.sendFileToRemoteAll();
            },
            // 选一个未发送的文件进行发送，如有下一个，切换下一个文件
            changeSendFileNext: async function(){
                let that = this
                let chooseFile = null;
                for(let i = 0; i < that.chooseFileList.length; i++){
                    let file = that.chooseFileList[i]
                    if (file.fileSendStatus === 0) {
                        chooseFile = file;
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
            sendFileToRemoteAll: function () {
                let that = this;
                if(that.currentChooseFile === null){
                    that.chooseFileList = []
                    console.log("文件全部发送完毕");
                    that.addPopup("文件全部发送完毕");
                    that.logs.push("文件全部发送完毕")
                    return;
                }

                //当前选中文件已发送给房间内所有人
                let nextSendingId = that.getSendFileNextRemote();
                if (nextSendingId === '') {
                    //切下一个文件的时候延迟一会，不要发的太急   
                    setTimeout(() => {
                        //选中一个文件
                        this.changeSendFileNext();
                        //发送给房间内所有人
                        this.sendFileToRemoteAll();
                    }, 1000);
                    return
                }

                let remote = that.remoteMap[nextSendingId]
                let fileReader = remote[that.currentChooseFile.index + "reader"];

                fileReader.addEventListener('loadend', this.sendFileToRemote);

                fileReader.addEventListener('error', error => {
                    that.logs.push("读取文件错误 : " + error);
                });

                fileReader.addEventListener('abort', event => {
                    that.logs.push("读取文件中断 : " + event);
                });

                that.readSlice(0);
            },
            //一次发送一个文件给一个用户
             sendFileToRemote: function (event) {
                let nextSendingId = this.getSendFileNextRemote();
                if (nextSendingId === '') {
                    return
                }
                
                this.setRemoteInfo(nextSendingId, {
                    [this.currentChooseFile.index + "status"] : 1
                }) 

                let remote = this.remoteMap[nextSendingId];

                let sendChannel = remote.sendChannel;
                if (!sendChannel || sendChannel.readyState !== 'open') {
                    return;
                }

                if (remote[this.currentChooseFile.index+"offset"] === 0) {
                    this.addPopup("正在发送给" + nextSendingId.substr(0, 4) + ",0%。");
                    this.logs.push("正在发送给" + nextSendingId.substr(0, 4) + ",0%。")
                    this.updateSendFileProcess(nextSendingId, {
                        start: Date.now()
                    })
                }

                sendChannel.send(event.target.result);
                remote[this.currentChooseFile.index+"offset"] += event.target.result.byteLength;

                this.currentSendSize += event.target.result.byteLength;

                //更新发送进度
                this.updateSendFileProcess(nextSendingId, {
                    process: parseInt((remote[this.currentChooseFile.index+"offset"] / this.currentChooseFile.size) * 100)
                })

                //发送完一份重置相关数据
                if (remote[this.currentChooseFile.index+"offset"] === this.currentChooseFile.size) {
                    this.addPopup("正在发送给" + nextSendingId.substr(0, 4) + ",100%。");
                    this.logs.push("正在发送给" + nextSendingId.substr(0, 4) + ",100%。")

                    this.currentSendSize = 0

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
                }
            },
            //获取需要进行发送的远程id
            getSendFileNextRemote: function(){
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

                return nextSendingId;
            },
            //文件分片 -- 点击发送时首次自动，后续就是收到ack回执后自动
            readSlice: function (offset) {
                let nextSendingId = this.getSendFileNextRemote();
                if(nextSendingId !== ''){
                    let remote = this.remoteMap[nextSendingId]
                    const slice = this.currentChooseFile.slice(remote[this.currentChooseFile.index+"offset"], offset + this.chunkSize);
                    let fileReader = remote[this.currentChooseFile.index + "reader"]
                    fileReader.readAsArrayBuffer(slice);
                }
            },
            //分片发送反馈ack
            receivedAck: function (socketId, receivedSize, name) {
                this.socket.emit('message', {
                    emitType: "receivedAck",
                    room: this.roomId,
                    from: this.socketId,
                    offset: receivedSize,
                    chunkSize: this.chunkSize,
                    name :name,
                    to: socketId,
                });
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
                        if (readyState === 'open') {

                        }
                    };
                    receiveChannel.onclose = () => {
                        const readyState = receiveChannel.readyState;
                        if (readyState === 'open') {

                        }
                    };
                    this.setRemoteInfo(id, { receiveChannel: receiveChannel });
                }
            },
            //接收文件
            receiveData: function (event, id) {
                if (!event || !id) {
                    return;
                }
                let that = this;
                let currentRtc = this.getRemoteInfo(id);
                let receiveFiles = currentRtc.receiveFiles;

                if(!receiveFiles){
                    setTimeout(() => {
                        this.receiveData(event, id)
                    }, 500);
                    return
                }
 
                let name = receiveFiles.name;
                let size = receiveFiles.size;
                let type = receiveFiles.type;

                //获取数据存下本地
                let receiveBuffer = currentRtc.receiveBuffer || new Array();
                let receivedSize = currentRtc.receivedSize || 0;

                if (receivedSize === 0) {
                    this.updateReceiveProcess(id, {
                        start: Date.now()
                    })
                }
                receiveBuffer.push(event.data);
                receivedSize += event.data.byteLength;
                this.$refs['receiveProgress'].value = receivedSize;

                this.setRemoteInfo(id, { receiveBuffer: receiveBuffer, receivedSize: receivedSize })
                this.currentReceiveSize += event.data.byteLength;

                //收到分片后反馈ack
                this.receivedAck(id, receivedSize, name);

                //更新接收进度
                this.updateReceiveProcess(id, {
                    process: parseInt((receivedSize / size) * 100)
                });

                if (receivedSize === size) {
                    console.log(name + " 接收完毕");
                    this.logs.push("接收完毕...");
                    this.$refs['receiveProgress'].value = 0;
                    this.addPopup("文件[ " + name + " ]接收完毕，可点击右下角查看。");

                    //更新接收进度
                    this.updateReceiveProcess(id, {
                        style: 'color: #ff5722;text-decoration: underline;',
                        href: URL.createObjectURL(new Blob(receiveBuffer), { type: type }),
                        done: true
                    });

                    //清除接收的数据缓存
                    this.setRemoteInfo(id, { receiveBuffer: new Array(), receivedSize: 0 })
                    this.currentReceiveSize = 0;
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
                this.logs.push("offer失败," + error);
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
                this.logs.push("answer失败," + error);
            },
            addIceCandidateSuccess: function (res) {
                this.logs.push("addIceCandidateSuccess成功," + res);
            },
            addIceCandidateFailed: function (err) {
                this.logs.push("addIceCandidate失败," + err);
            },
            socketListener: function () {
                let that = this;

                this.socket.emit("count", {});

                this.socket.on('created', async function (data) {
                    that.logs.push("创建房间," + JSON.stringify(data));
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
                                that.initMediaShareChannel(otherSocketId, data.type, track, stream)
                                rtcConnect.createOffer(that.options).then(offer => {
                                    that.offerSuccess(rtcConnect, otherSocketId, offer);
                                }, error => {
                                    that.offerFailed(rtcConnect, otherSocketId, error);
                                });
                            });
                        }else if(data.type === 'video'){
                            window.Bus.$emit("startVideoShare", otherSocketId, (track, stream) => {
                                that.initMediaShareChannel(otherSocketId, data.type, track, stream)
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
                    that.logs.push("加入房间," + JSON.stringify(data));
                    that.recoderId = data.recoderId;
                    that.getOrCreateRtcConnect(data.id);
                    if(data.type === 'screen'){
                        window.Bus.$emit("getScreenShareTrackAndStream", (track, stream) => {
                            that.initMediaShareChannel(data.id, data.type, track, stream)
                        });
                    }
                    if(data.type === 'video'){
                        window.Bus.$emit("getVideoShareTrackAndStream", (track, stream) => {
                            that.initMediaShareChannel(data.id, data.type, track, stream)
                        });
                    }
                    that.addPopup(data.id + "加入了房间。");
                    that.touchResize();
                });

                this.socket.on('offer', function (data) {
                    that.logs.push("offer," + JSON.stringify(data));
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
                    that.logs.push("answer," + JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'answer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
                });

                this.socket.on('candidate', function (data) {
                    that.logs.push("candidate," + JSON.stringify(data));
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
                        that.logs.push("退出房间," + JSON.stringify(data));
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
                    that.logs.push(data.from + "选择了文件 [ " + data.name + " ]，即将发送。");
                    that.$refs['receiveProgress'].max = data.size;

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
                });

                //收到文件回传ack，继续分片回传
                this.socket.on('receivedAck', function (data) {
                    let to = data.to;
                    if (to === that.socketId) {
                        // 当前文件分片接收方正在接收
                        if (data.offset < that.currentChooseFile.size) {
                            that.readSlice(data.offset)
                        }
                        // 当前文件分片接收方全部接收完毕
                        if(data.offset === that.currentChooseFile.size){
                            that.sendFileToRemoteAll()
                        }
                    }
                });

                //发送文字内容
                this.socket.on('sendTxt', function (data) {
                    let fromId = data.from;
                    that.addPopup(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");
                    that.logs.push(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");

                    that.receiveTxtList.push({
                        id: fromId,
                        content: decodeURIComponent(data.content),
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
                });

                //提示
                this.socket.on('tips', function (data) {
                    if (window.layer) {
                        layer.msg(data.msg)
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

                //开关数据
                this.socket.on('commData', function (data) {
                    that.switchData = data.switchData
                    data.chatingData.forEach(elem=>{
                        that.chatingList.push(elem)
                    })
                });

                //公共聊天频道
                this.socket.on('chating', function (data) {
                    that.logs.push(data.room + "频道的" + data.socketId + "发言: [ " + data.msg + " ]");
                    data.msg = window.tlrtcfile.escapeHtml().escape(data.msg)
                    that.chatingList.push(data);
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
                if(window.tlrtcfile){
                    $("#check").removeClass("layui-anim-rotate")
                    setTimeout(() => {
                        $("#check").addClass("layui-anim-rotate")
                        let check = tlrtcfile.supposeWebrtc();
                        if(window.layer){
                            layer.msg(`你的浏览器${check? '支持' : '不支持'}webrtc`)
                        }
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

        },
        created: function () {
            let that = this;
            if (window.location.hash && window.location.hash.includes("debug")) {
                window.tlrtcfile.loadJS('/static/js/vconsole.min.js', function () {
                    window.tlrtcfile.loadJS('/static/js/vconsole.js', function () {
                        console.log("load vconsole success")
                    });
                });
            }
            if (window.location.search && window.location.search.includes("notice=iamtsm&msg=")) {
                setTimeout(() => {
                    let msg = window.location.search.split("msg=")[1]
                    that.socket.emit('close', {
                        msg: decodeURIComponent(msg)
                    });
                }, 2000)
            }

            setTimeout(() => {
                that.handlerRoomHistory()
                that.socket.emit('getCommData', {});
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
            }, 2000);
        },
        mounted: function () {
            
            this.$nextTick(() => {
                this.logs.push("socket 初始化中...");
                this.socketListener();
                this.logs.push("socket 初始化成功");
            })

            this.clickHome(false);

            window.onresize = this.initCss;

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
        },
        destroyed: function () {

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
})


