// file.js
var file = null;
axios.get(window.prefix + "/api/comm/initData",{}).then((initData)=>{
    let resData = initData.data;
    file = new Vue({
        el : '#fileApp',
        data : function () {
            let socket = null;
            if (io){
                socket = io(resData.wsHost);
            }
            return{
                socket : socket,
                config : resData.rtcConfig,
                options : resData.options,
                isJoined : false,
                showReceiveFile : false,
                showSendFile : false,
                showLogs : false,
                numSendFile: 150,
                numReceiveFile : 150,
                numLogs : 150,
                currentMenu : 1,
                logsHeight : 0,
                
                nickName : "", //本人名称
                socketId : 0, //本人的id
                roomId : "10086", //房间号
                fileReader : null, //文件读取对象
                rtcConns : {}, //远程连接
                remoteMap : {}, //远程连接map
    
                chunkSize : 256 * 1024, //一块256kb
                offset : 0, //当前文件分片位移
                fileName : null, //文件名称
                allSended : false,//当前文件是否全部发送给房间内所有用户
                currentReceiveSize : 0, //统计收到文件的大小
                currentSendingId : "", //当前正在发送的文件
                chooseFile : null,  //选择的文件
                sendFileList : [], //发过文件的列表
                receiveFileList : [], //接收文件的列表
                logs : [],  //记录日志
            }
        },
        computed : {
            createDisabled : function(){
                return this.isJoined || this.fileName || !this.roomId;
            },
            exsitDisabled : function(){
                return !this.isJoined;
            },
            uploadDisabled : function(){
                return !this.fileName || this.allSended;
            },
            showSendFileList : function() {
                return this.sendFileList && this.sendFileList.length > 5;
            }
        },
        watch : {
            currentMenu :function(newV,oldV){
                
            },
            allSended :function(newV,oldV){
                
            },
            fileName : function(newV,oldV){
                this.chooseFile = this.$refs['self-file'].files[0];
                if(!this.chooseFile) return;
                if(!this.socketId) return;
    
                this.$refs['sendProgress'].max = this.chooseFile.size;
    
                this.socket.emit('message', {
                    emitType : "sendFileInfo",
                    name: this.chooseFile.name,
                    type: this.chooseFile.type,
                    size: this.chooseFile.size,
                    room : this.roomId,
                    from : this.socketId,
                });
                this.allSended = false;
    
                let idList = [];
                for(let id in this.remoteMap){
                    this.setRemoteInfo(id,{status : 0})
                    idList.push(id);
                }
                
                if(this.socketId){
                    let toIdStr = "";
                    if(idList.length > 0){
                        toIdStr += "发送给房间的 "+idList[0]+" ...等"+idList.length+"人";
                    }
                    for(let id in this.remoteMap){
                        this.sendFileList.push({
                            id : id,
                            name : this.chooseFile.name,
                            size : this.chooseFile.size,
                            type : this.chooseFile.type,
                            process : 0,
                            done : false,
                            toIdStr : toIdStr,
                        });
                    }
                }
            },
            currentReceiveSize : function(newV,oldV){
                this.currentReceiveSize = newV;
            },
            remoteMap : {
                handler : function(newV,oldV){},
                deep : true,
                immediate : true
            },
            receiveFileList : {
                handler : function (newV, oldV) {},
                deep : true,
                immediate : true
            },
            sendFileList : {
                handler : function (newV, oldV) {},
                deep : true,
                immediate : true
            }
        },
        methods : {
            refleshRoom : function(){
                if(!this.createDisabled){
                    this.roomId = parseInt(Math.random() * 100000);
                    this.addPopup("你刷新了房间号, 当前房间号为 "+this.roomId);
                    this.logs.push("你刷新了房间号, 当前房间号为 "+this.roomId);
                }
            },
            genNickName : function () {
                // 获取指定范围内的随机数
                function randomAccess(min,max){
                    return Math.floor(Math.random() * (min - max) + max)
                }
    
                // 解码
                function decodeUnicode(str) {
                    //Unicode显示方式是\u4e00
                    str = "\\u"+str;
                    str = str.replace(/\\/g, "%");
                        //转换中文
                    str = unescape(str);
                        //将其他受影响的转换回原来
                    str = str.replace(/%/g, "\\");
                    return str;
                }
    
                function getRandomName(len){
                    let name = ""
                    for(let i = 0;i < len; i++){
                        let unicodeNum  = ""
                        unicodeNum = randomAccess(0x4e00,0x9fa5).toString(16)
                        name += decodeUnicode(unicodeNum)
                    }
                    return name;
                }
                return getRandomName(4);
            },
            addPopup : function(msg) {
                window.Bus.$emit("addPopup",msg);
            },
            cleanPopup : function(){
                window.Bus.$emit("popupMap");
            },
            clickChooseFile : function(){
                this.$refs['self-file'].click();
                if(!this.createDisabled){
                    this.addPopup("请先创建/加入房间后，再选择文件");
                    this.logs.push("请先创建/加入房间后，再选择文件");
                }
            },
            clickHome : function(show = true){
                this.currentMenu = 1;
    
                let body = document.body;
                let menuBorder = document.querySelector(".menu__border");
                let active = this.$refs['btnHome'];
                let box = active.getBoundingClientRect();
    
                body.style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector(".chooseFileName").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                offsetMenuBorder (box, menuBorder);
                
                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth  - box.width) / 2) +  "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }
    
                if(show){
                    this.clickSendFile();
                }
            },
            clickRoom : function(show = true){
                this.currentMenu = 2;
    
                let body = document.body;
                let menuBorder = document.querySelector(".menu__border");
                let active = this.$refs['btnRoom'];
                let box = active.getBoundingClientRect();
    
                body.style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                document.querySelector(".chooseFileName").style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                offsetMenuBorder (box, menuBorder);
                
                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth  - box.width) / 2) +  "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }
    
                if(show){
                    this.clickReceiveFile()
                }
            },
            clickFile : function(show = true){
                this.currentMenu = 3;
    
                let body = document.body;
                let menuBorder = document.querySelector(".menu__border");
                let active = this.$refs['btnFile'];
                let box = active.getBoundingClientRect();
    
                body.style.backgroundColor = active.style.getPropertyValue("--bgColorBody");
                offsetMenuBorder (box, menuBorder);
                
                function offsetMenuBorder(box, menuBorder) {
                    let left = Math.floor(box.left - menuBorder.closest("menu").offsetLeft - (menuBorder.offsetWidth  - box.width) / 2) +  "px";
                    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`
                }
    
                if(show){
                    this.clickReceiveFile()
                }
            },
            //文件大小
            getFileSizeStr : function (size){
                let sizeStr = (size/1048576).toString();
                let head = sizeStr.split(".")[0];
                let tail = "";
                if(sizeStr.split(".")[1]){
                    tail = sizeStr.split(".")[1].substr(0,3);
                }
                return head + '.' + tail + "M";
            },
            //点击下载文件
            clickReceiveFile : function(){
                this.showReceiveFile = !this.showReceiveFile;
                if(this.showReceiveFile){
                    this.numReceiveFile = 50;
                }else{
                    this.numReceiveFile = 150;
                }
            },
            //点击发送文件
            clickSendFile : function(){
                this.showSendFile = !this.showSendFile;
                if(this.showSendFile){
                    this.numSendFile = 50;
                }else{
                    this.numSendFile = 150;
                }
            },
            //点击查看日志
            clickLogs : function(){
                this.showLogs = !this.showLogs;
                if(this.showLogs){
                    this.numLogs = 50;
                }else{
                    this.numLogs = 150;
                }
            },
            //创建房间
            createRoom : function () {
                if(this.fileName != null){
                    alert("请先加入房间再选文件")
                    return;
                }
                if (this.roomId) {
                    if(this.roomId.toString().length > 15){
                        alert("房间号太长啦");
                        return;
                    }
                    this.socket.emit('createAndJoin', { room: this.roomId });
                    this.isJoined = true;
                    // this.nickName = this.genNickName();
                    this.addPopup("你进入了房间"+this.roomId);
                    this.logs.push("你进入了房间"+this.roomId);
                }
            },
            //退出房间
            exitRoom : function () {
                if (this.roomId) {
                    this.socket.emit('exit', {
                        from : this.socketId,
                        room: this.roomId
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
            getRtcConnect : function(id){
                return this.rtcConns[id];
            },
            //创立链接
            createRtcConnect : function (id) {
                if(id === undefined){
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
                    Vue.set(this.remoteMap,id,{id : id})
                }
    
                //数据通道
                this.initSendDataChannel(id);
    
                rtcConnect.onremovestream = (e) => {
                    that.removeStream(rtcConnect, id, e)
                };
    
                return rtcConnect;
            },
            //获取本地与远程连接
            getOrCreateRtcConnect : function(id){
                let rtcConnect = this.getRtcConnect(id);
                if (typeof (rtcConnect) == 'undefined'){
                    rtcConnect = this.createRtcConnect(id);
                }
                return rtcConnect;
            },
            //连接创立时建立 send/receive Channel链接
            initSendDataChannel : function (id) {
                let that = this;
    
                let sendChannel = this.rtcConns[id].createDataChannel('sendDataChannel');
                sendChannel.binaryType = 'arraybuffer';
    
                sendChannel.addEventListener('open', ()=>{
                    if (sendChannel.readyState === 'open') {
                        that.logs.push("建立连接 : channel open")
                    }
                });
    
                sendChannel.addEventListener('close', ()=>{
                    if (sendChannel.readyState === 'close') {
                        that.logs.push("连接关闭 : channel close")
                    }
                });
    
                sendChannel.addEventListener('error', (error) => {
                    that.handlerSendChannelError(error)
                });
    
                this.rtcConns[id].addEventListener('datachannel', (event)=>{
                    that.initReceiveDataChannel(event,id);
                });
    
                this.setRemoteInfo(id,{sendChannel : sendChannel});
            },
            //处理发送过程中的错误情况
            handlerSendChannelError : function(error){
                console.error(error.error)
                this.logs.push("连接断开 : "+error)
            },
            //上传文件
            submitChooseFile : function(){
                this.initSendData();
            },
            //创建发送文件事件
            initSendData : function () {
                let that = this;
                if(this.chooseFile == undefined || this.chooseFile == null){
                    this.logs.push("请先选择文件")
                    return;
                }
    
                this.fileReader = new FileReader();
                this.fileReader.addEventListener('error', error => {
                    that.logs.push("读取文件错误 : "+error);
                });
                this.fileReader.addEventListener('abort', event => {
                    that.logs.push("读取文件中断 : "+event);
                });
                this.fileReader.addEventListener('load',  this.sendData);
                this.readSlice(0);
            },
            /**
             * 发送文件
             * 0 : 未发送
             * 1 : 发送中
             * 2 : 已发送
             * @param {*} event 
             */
            sendData : function(event){
                let needSendingId = "";
    
                let hasSending = false;
                for(let id in this.remoteMap){
                    let remote = this.remoteMap[id];
                    let status = remote.status || 0;
                    if(status === 1){ //有正在发送中的
                        hasSending = true;
                        needSendingId = id;
                    }
                }
    
                let that = this;
                // hasSending = Object.keys(Object.keys(remoteMap).filter((id)=>{
                //     return that.remoteMap[id].status === 1;
                // }));
    
                if(!hasSending){ //没有正在发送中的, 取出对应的还没发送的文件
                    let hasAllSended = true;
                    for(let id in this.remoteMap){
                        let remote = this.remoteMap[id];
                        let status = remote.status || 0;
                        if(status === 0 || status === 1){
                            hasAllSended = false;
                            this.allSended = true;
                        }
                    }
                    if(hasAllSended){ //全部发送完毕
                        return;
                    }
                    for(let id in this.remoteMap){ //还有还没发送的
                        let remote = this.remoteMap[id];
                        let status = remote.status || 0;
                        if(status === 0){
                            needSendingId = id;
                        }
                    }
                    this.setRemoteInfo(needSendingId,{status : 1}) //发送给下一个用户时更新状态
                }
    
                
                if(needSendingId != ''){
                    let remote = this.remoteMap[needSendingId];
                    let status = remote.status  || 0;
                    if(status === 1){ //保证同一时间只能发送房间内对应的一个用户
                        let sendChannel = remote.sendChannel;
                        if(!sendChannel || sendChannel.readyState !== 'open'){
                            return;
                        }
    
                        if(this.offset === 0){
                            this.addPopup("正在发送给"+needSendingId.substr(0,4)+",0%。");
                            this.logs.push("正在发送给"+needSendingId.substr(0,4)+",0%。")
                        }
    
                        sendChannel.send(event.target.result);
                        this.offset += event.target.result.byteLength;
                        let currentSendFile = this.offset;
                        
                        //更新发送进度
                        this.updateSendProcess(needSendingId, {
                            process : parseInt((currentSendFile/this.chooseFile.size)*100)
                        })
    
                        //发送完一份重置相关数据 并且开启下一个
                        if(this.offset === this.chooseFile.size){
                            console.log(needSendingId+"发送完毕");
                            this.addPopup("正在发送给"+needSendingId.substr(0,4)+",100%。");
                            this.logs.push("正在发送给"+needSendingId.substr(0,4)+",100%。")

                            //更新发送进度
                            this.updateSendProcess(needSendingId, {
                                done : true
                            })

                            this.offset = 0;
                            this.setRemoteInfo(needSendingId,{status : 2})
                            this.submitChooseFile();
                        }
                    }
                }
            },
            //文件分片 -- 点击发送时首次自动，后续就是收到ack回执后自动
            readSlice : function (offset) {
                const slice = this.chooseFile.slice(this.offset, offset + this.chunkSize);
                this.fileReader.readAsArrayBuffer(slice);
            },
            //分片发送反馈ack
            receivedAck : function (socketId, receivedSize) {
                this.socket.emit('message', {
                    emitType : "receivedAck",
                    room : this.roomId,
                    from : this.socketId,
                    offset : receivedSize,
                    chunkSize : this.chunkSize,
                    to : socketId
                });  
            },
            //创建接收文件事件
            initReceiveDataChannel : function(event, id){
                if(!id || !event){
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                if(currentRtc){
                    let receiveChannel = event.channel;
                    receiveChannel.binaryType = 'arraybuffer';
                    receiveChannel.onmessage = (env)=>{
                        this.receiveData(env,id);
                    };
                    receiveChannel.onopen = ()=>{
                        const readyState = receiveChannel.readyState;
                        if (readyState === 'open') {
                            
                        }
                    };
                    receiveChannel.onclose = ()=>{
                        const readyState = receiveChannel.readyState;
                        if (readyState === 'open') {
                            
                        }
                    };
                    this.setRemoteInfo(id, {receiveChannel : receiveChannel});
                }
            },
            //接收文件
            receiveData :function(event, id) {
                if(!event || !id){
                    return;
                }
                let currentRtc = this.getRemoteInfo(id);
                let receiveFiles = currentRtc.receiveFiles || {};
                let name = receiveFiles.name;
                let size = receiveFiles.size;
                let type = receiveFiles.type;
                
                //获取数据存下本地
                let receiveBuffer = currentRtc.receiveBuffer || [];
                let receivedSize = currentRtc.receivedSize || 0;
                receiveBuffer.push(event.data);
                receivedSize += event.data.byteLength;
                this.$refs['receiveProgress'].value = receivedSize;
    
                this.setRemoteInfo(id,{receiveBuffer : receiveBuffer,receivedSize : receivedSize})
                this.currentReceiveSize += event.data.byteLength;
    
                //收到分片后反馈ack
                this.receivedAck(id, receivedSize);

                //更新接收进度
                this.updateReceiveProcess(id, {
                    process : parseInt((receivedSize/size)*100)
                });
    
                if(receivedSize === size){
                    console.log("接收完毕");
                    this.logs.push("接收完毕...");
                    this.$refs['receiveProgress'].value = 0;
                    this.addPopup("文件[ "+name+" ]接收完毕，可点击右下角查看。");
                    
                    //更新接收进度
                    this.updateReceiveProcess(id, {
                        style : 'color: #ff5722;text-decoration: underline;',
                        href : URL.createObjectURL(new Blob(receiveBuffer),{type: type}),
                        done : true
                    });
                    //清除接收的数据缓存
                    this.setRemoteInfo(id,{receiveBuffer : [], receivedSize : 0})
                    this.currentReceiveSize = 0;
                }
            },
            //关闭连接
            closeDataChannels : function () {  
                for(let remote in this.remoteMap){
                    let id = remote.id;
                    let sendChannel = remote.sendChannel;
                    let receiveChannel = remote.receiveChannel;
                    if(!id || !sendChannel || !receiveChannel){
                        continue;
                    }
                    sendChannel.close();
                    receiveChannel.close();
                }
            },
            //设置rtc缓存远程连接数据
            setRemoteInfo(id, data){
                if(!id || !data){
                    return;
                }
                let oldData = this.remoteMap[id];
                if(oldData){
                    Object.assign(oldData,data);
                    Vue.set(this.remoteMap, id, oldData);
                }
            },
            //更新接收进度
            updateReceiveProcess : function (id, data) {
                for(let i = 0; i < this.receiveFileList.length; i++){
                    let item = this.receiveFileList[i];
                    if(item.id === id && !item.done){
                        Object.assign(this.receiveFileList[i], data);
                    }
                }
            },
            //更新发送进度
            updateSendProcess : function (id, data) {
                for(let i = 0; i < this.sendFileList.length; i++){
                    let item = this.sendFileList[i];
                    if(item.id === id && !item.done){
                        Object.assign(this.sendFileList[i], data);
                    }
                }
            },
            //获取rtc缓存远程连接数据
            getRemoteInfo(id){
                if(!id){
                    return;
                }
                return this.remoteMap[id];
            },
            //移除rtc连接
            removeStream : function(rtcConnect,id,event){
                this.getOrCreateRtcConnect(id).close;
                delete this.rtcConns[id];
                delete this.remoteMap[id];
            },
            iceCandidate : function (rtcConnect,id,event) {
                if (event.candidate != null) {
                    let message = {
                        from : this.socketId,
                        to : id,
                        room : this.roomId,
                        sdpMid : event.candidate.sdpMid,
                        sdpMLineIndex : event.candidate.sdpMLineIndex,
                        sdp : event.candidate.candidate
                    };
                    this.socket.emit('candidate', message);
                }
            },
            offerSuccess : function (rtcConnect,id,offer) {
                rtcConnect.setLocalDescription(offer).then(r => {})
                let message = {
                    from : this.socketId,
                    to : id,
                    room : this.roomId,
                    sdp : offer.sdp
                };
                this.socket.emit('offer', message);
            },
            offerFailed : function (rtcConnect,id,error) {
                this.logs.push("offer失败,"+error);
            },
            answerSuccess : function (rtcConnect,id,offer) {
                rtcConnect.setLocalDescription(offer).then(r => {});
                let message = {
                    from : this.socketId,
                    to : id,
                    room : this.roomId,
                    sdp : offer.sdp
                };
                this.socket.emit('answer', message);
            },
            answerFailed : function (rtcConnect,id,error) {
                this.logs.push("answer失败,"+error);
            },
            addIceCandidateSuccess : function(res){
                this.logs.push("addIceCandidateSuccess成功,"+res);
            },
            addIceCandidateFailed : function(err){
                this.logs.push("addIceCandidate失败,"+err);
            },
            socketListener : function () {
                let that = this;
                this.socket.on('created', async function (data) {
                    that.logs.push("创建房间,"+JSON.stringify(data));
                    that.socketId = data.id;
                    that.roomId = data.room;
                    for (let i = 0; i < data['peers'].length; i++) {
                        let otherSocketId = data['peers'][i].id;
                        let rtcConnect = that.getOrCreateRtcConnect(otherSocketId);
                        rtcConnect.createOffer(that.options).then(offer => {
                            that.offerSuccess(rtcConnect, otherSocketId, offer);
                        }, error => {
                            that.offerFailed(rtcConnect, otherSocketId, error);
                        });
                    }
                    that.touchResize();
                });
    
                this.socket.on('joined', function (data) {
                    that.logs.push("加入房间,"+JSON.stringify(data));
                    that.getOrCreateRtcConnect(data.from);
                    that.addPopup(data.id+"加入了房间。");
                    that.touchResize();
                });
    
                this.socket.on('offer', function (data) {
                    that.logs.push("offer,"+JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'offer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => {});
                    rtcConnect.createAnswer(that.options).then((offer) => {
                        that.answerSuccess(rtcConnect, data.from, offer)
                    }).catch((error) => {
                        that.answerFailed(rtcConnect, data.from, error)
                    });
                });
    
                this.socket.on('answer', function (data) {
                    that.logs.push("answer,"+JSON.stringify(data));
                    let rtcConnect = that.getOrCreateRtcConnect(data.from);
                    let rtcDescription = { type: 'answer', sdp: data.sdp };
                    rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => {});
                });
    
                this.socket.on('candidate', function (data) {
                    that.logs.push("candidate,"+JSON.stringify(data));
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
                        that.addPopup(data.from+"退出了房间。");
                        that.logs.push("退出房间,"+JSON.stringify(data));
                        that.getOrCreateRtcConnect(data.from).close;
                        delete that.rtcConns[data.from];
                        Vue.delete(that.remoteMap,data.from);
                    }
                    that.touchResize();
                })
    
                //选中文件时发送给接收方
                this.socket.on('sendFileInfo', function (data) {
                    let fromId = data.from;
                    that.setRemoteInfo(fromId,{receiveFiles : data});
                    that.addPopup(data.from+"选择了文件 [ "+data.name+" ]，即将发送。");
                    that.logs.push(data.from+"选择了文件 [ "+data.name+" ]，即将发送。");
                    that.$refs['receiveProgress'].max = data.size;

                    that.receiveFileList.push({
                        id : fromId,
                        href : "",
                        name : data.name,
                        type : data.type,
                        size : data.size,
                        process : 0,
                        done : false
                    })
                });
    
                //收到文件回传ack，继续分片回传
                this.socket.on('receivedAck', function (data) {
                    let to = data.to;
                    if(to === that.socketId){
                        if(that.offset < that.chooseFile.size){
                            that.readSlice(that.offset)
                        }
                    }
                });
            },
            initCss : function(e){
                if(!e) return;
                if(this.currentMenu === 1){
                    this.clickHome(false);
                }else if(this.currentMenu === 2){
                    this.clickRoom(false);
                }else if(this.currentMenu === 3){
                    this.clickFile(false);
                }
                //re caculate size
                this.reCaculateSwiperSize();
    
                this.logsHeight = document.documentElement.clientHeight-55;
            },
            loadJS : function( url, callback ){
                var script = document.createElement('script'),
                fn = callback || function(){};
                script.type = 'text/javascript';
                //IE
                if(script.readyState){
                    script.onreadystatechange = function(){
                        if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                            script.onreadystatechange = null;
                            fn();
                        }
                    };
                }else{
                    //其他浏览器
                    script.onload = function(){
                        fn();
                    };
                }
                script.src = url;
                document.getElementsByTagName('head')[0].appendChild(script);
            },
            reCaculateSwiperSize : function () {
                let clientWidth = document.body.clientWidth;
                let slidesPerView = parseInt((clientWidth / 100))-1;
                if(window.swiper){
                    window.swiper.params.slidesPerView = slidesPerView;
                }
            },
            touchResize : function() {
                let that = this;
                setTimeout(()=>{
                    var myEvent = new Event('resize');
                    window.dispatchEvent(myEvent);
                    that.reCaculateSwiperSize();
                },100)
            }
        },
        created : function () {
            let that = this;
            if(window.location.hash && window.location.hash.includes("debug")){
                this.loadJS('/static/js/vconsole.min.js',function(){
                    that.loadJS('/static/js/vconsole.js',function(){
                        console.log("load vconsole success")
                    });
                });
            }
        },
        mounted : function () {
            this.$nextTick(()=>{
                this.logs.push("socket 初始化中...");
                this.socketListener();
                this.logs.push("socket 初始化成功");
            })
            this.clickHome(false);
    
            window.onresize = this.initCss;
        },
        destroyed : function () {
    
        }
    });
})


