// --------------------------- //
// --      liveShare.js     -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //

var liveShare = new Vue({
    el: '#liveShareApp',
    data: function () {
        return {
            stream: null,
            times: 0,
            intervalId: 0,
            track: null,
        }
    },
    methods: {
        getScreenMediaPlay: function () {
            let media = null;
            if (window.navigator.getDisplayMedia) {
                media = window.navigator.getDisplayMedia({
                    video: true,
                    audio:true
                });
            } else if (window.navigator.mediaDevices && window.navigator.mediaDevices.getDisplayMedia) {
                media = window.navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio:true
                });
            } else if(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia){
                media = window.navigator.mediaDevices.getUserMedia({
                    video: {
                        mediaSource: 'screen'
                    },
                    audio:true
                });
            }
            return media
        },
        getVideoMediaPlay: function (constraints) {
            let media = null;
            let defaultConstraints = {
                // 音频轨道
                audio:true,
                // 视频轨道
                video: {
                    // 前后置
                    facingMode: true ? "user" : "environment",
                    // 分辨率
                    width: {
                        ideal : 200,
                        max : 200,
                        min : 100
                    }, 
                    height: {
                        ideal : 150,
                        max : 150,
                        min : 150
                    },
                    // 码率
                    frameRate: {
                        ideal: 100,
                        max: 100
                    },
                    // 指定设备
                    // deviceId: "",
                },
            };
            if(constraints){
                defaultConstraints = constraints
            }
            if(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia){
                media = window.navigator.mediaDevices.getUserMedia(defaultConstraints);
            } else if (window.navigator.mozGetUserMedia) {
                media = navigator.mozGetUserMedia(defaultConstraints);
            } else if (window.navigator.getUserMedia) {
                media = window.navigator.getUserMedia(defaultConstraints)
            } else if (window.navigator.webkitGetUserMedia) {
                media = new Promise((resolve, reject) => {
                    window.navigator.webkitGetUserMedia(defaultConstraints, (res) => {
                        resolve(res)
                    }, (err) => {
                        reject(err)
                    });
                })
            }
            return media
        },
        startLiveShare: async function ({ liveShareMode, constraints, callback }) {
            let that = this;

            let msgData = {
                "Requested device not found" : "没有检测到摄像头或麦克风"
            }
            let msg = "获取设备权限失败";

            if (this.stream == null) {
                try {
                    if(liveShareMode === 'video'){
                        this.stream = await this.getVideoMediaPlay(constraints);
                    }else if(liveShareMode === 'screen'){
                        this.stream = await this.getScreenMediaPlay();
                    }
                } catch (error) {
                    console.log(error)
                    msg = msgData[error.message]
                }
            }

            if (this.stream == null) {
                if (window.layer) {
                    layer.msg("获取设备权限失败")
                }
                window.Bus.$emit("changeLiveShareState", false)
                callback && callback()
                return;
            }

            const video = document.querySelector("#selfMediaShareLive");
            video.addEventListener('loadedmetadata', function() {
                // ios 微信浏览器兼容问题
                window.Bus.$emit("addSysLogs", "loadedmetadata")
                video.play();
                document.addEventListener('WeixinJSBridgeReady', function () {
                    window.Bus.$emit("addSysLogs", "loadedmetadata WeixinJSBridgeReady")
                    video.play();
                }, false);
            });
            document.addEventListener('WeixinJSBridgeReady', function () {
                window.Bus.$emit("addSysLogs", "WeixinJSBridgeReady")
                video.play();
            }, false);
            try{
                video.srcObject = this.stream;
                video.play();
            }catch(e){
                setTimeout(() => {
                    video.play();
                }, 1000);
            }

            //计算时间
            this.intervalId = setInterval(() => {
                that.times += 1;
                window.Bus.$emit("changeLiveShareTimes", that.times)
                
                $("#liveShareIcon").css("color", "#fb0404")
                $("#liveShareTimes").css("color", "#fb0404")
                setTimeout(() => {
                    $("#liveShareIcon").css("color", "#000000")
                    $("#liveShareTimes").css("color", "#000000")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始直播，再次点击按钮即可结束直播")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                callback && callback(track, that.stream)
            });
        },
        stopLiveShare: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.intervalId);

            window.Bus.$emit("changeLiveShareTimes", 0);

            if (window.layer) {
                layer.msg("直播结束，本次直播时长 " + this.times + "秒")
            }
            setTimeout(() => {
                $("#liveShareIcon").css("color", "#000000")
            }, 1000);

            this.stream = null;
            this.times = 0;

            return;
        },
        changeLiveShareMediaTrackAndStream: async function ({constraints, type, kind, rtcConns, callback}) {
            //重新获取流
            let newStream = null;
            try{
                if(type === 'video'){
                    newStream = await this.getVideoMediaPlay(constraints);
                }else if(type === 'screen'){
                    newStream = await this.getScreenMediaPlay();
                }
            }catch(e){
                console.log("changeLiveShareMediaTrackAndStream error! ", e)
            }

            //获取流/权限失败
            if(newStream === null){
                callback && callback(false)
                return;
            }
           
            if(kind === 'audio'){
                newStream.getAudioTracks()[0].enabled = true;
                if(rtcConns){//远程track替换
                    for(let id in rtcConns){
                        const senders = rtcConns[id].getSenders();
                        const sender = senders.find((sender) => (sender.track ? sender.track.kind === 'audio' : false));
                        if(!sender){
                            console.error("changeDevice find sender error! ");
                            return
                        }
                        sender.replaceTrack(newStream.getAudioTracks()[0]);
                    }
                }
            }

            if(kind === 'video'){
                newStream.getVideoTracks()[0].enabled = true;
                if(rtcConns){//远程track替换
                    for(let id in rtcConns){
                        const senders = rtcConns[id].getSenders();
                        const sender = senders.find((sender) => (sender.track ? sender.track.kind === 'video' : false));
                        if(!sender){
                            console.error("changeDevice find sender error! ");
                            return
                        }
                        sender.replaceTrack(newStream.getVideoTracks()[0]);
                    }
                }
            }

            //替换本地流
            if(!this.stream.getAudioTracks()[0]){
                this.stream = new MediaStream([newStream.getVideoTracks()[0], newStream.getAudioTracks()[0]]);
            }else{
                this.stream = new MediaStream([newStream.getVideoTracks()[0], this.stream.getAudioTracks()[0]]);
            }
            const video = document.querySelector("#selfMediaShareLive");
            video.addEventListener('loadedmetadata', function() {
                // ios 微信浏览器兼容问题
                window.Bus.$emit("addSysLogs", "loadedmetadata")
                video.play();
                document.addEventListener('WeixinJSBridgeReady', function () {
                    window.Bus.$emit("addSysLogs", "loadedmetadata WeixinJSBridgeReady")
                    video.play();
                }, false);
            });
            document.addEventListener('WeixinJSBridgeReady', function () {
                window.Bus.$emit("addSysLogs", "WeixinJSBridgeReady")
                video.play();
            }, false);

            try{
                video.srcObject = this.stream;
                video.play();
            }catch(e){
                setTimeout(() => {
                    video.play();
                }, 1000);
            }
        },
        getLiveShareTrackAndStream: function (callback) {
            callback(this.track, this.stream)
        },
    },
    mounted: async function () {
        window.Bus.$on("startLiveShare", this.startLiveShare);
        window.Bus.$on("stopLiveShare", this.stopLiveShare);
        window.Bus.$on("getLiveShareTrackAndStream", this.getLiveShareTrackAndStream);
        window.Bus.$on("changeLiveShareMediaTrackAndStream", this.changeLiveShareMediaTrackAndStream);
    }
})