// --------------------------- //
// --     videoShare.js     -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //

var videoShare = new Vue({
    el: '#videoShareApp',
    data: function () {
        return {
            stream: null,
            times: 0,
            intervalId: 0,
            track: null,
            videoDeviceList: [], // 摄像头列表
            audioDeviceList: [], // 麦克风列表
            loudspeakerDeviceList: [], // 扬声器列表
        }
    },
    methods: {
        getMediaPlay: function (constraints) {
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
        startVideoShare: async function (constraints, callback) {
            let that = this;

            let msgData = {
                "Requested device not found" : "没有检测到摄像头或麦克风"
            }
            let msg = "获取设备权限失败";

            if (this.stream == null) {
                try {
                    this.stream = await this.getMediaPlay(constraints);
                } catch (error) {
                    console.log(error)
                    msg = msgData[error.message]
                }
            }

            if (this.stream == null) {
                if (window.layer) {
                    layer.msg("获取设备权限失败")
                }
                window.Bus.$emit("changeVideoShareState", false)
                callback && callback()
                return;
            }

            const video = document.querySelector("#selfMediaShareVideo");
            video.addEventListener('loadedmetadata', function() {
                window.Bus.$emit("addSysLogs", "loadedmetadata")
                // ios 微信浏览器兼容问题
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
                window.Bus.$emit("changeVideoShareTimes", that.times)
                
                $("#videoShareIcon").css("color", "#fb0404")
                $("#videoShareTimes").css("color", "#fb0404")
                setTimeout(() => {
                    $("#videoShareIcon").css("color", "#000000")
                    $("#videoShareTimes").css("color", "#000000")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始音视频通话，再次点击按钮即可挂断")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                callback && callback(track, that.stream)
            });
        },
        stopVideoShare: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.intervalId);

            window.Bus.$emit("changeVideoShareTimes", 0);

            if (window.layer) {
                layer.msg("音视频通话结束，本次通话时长 " + this.times + "秒")
            }
            setTimeout(() => {
                $("#videoShareIcon").css("color", "#000000")
            }, 1000);

            this.stream = null;
            this.times = 0;

            return;
        },
        getDeviceList : async function(){
            const list = await new Promise((resolve, reject) => {
                navigator.mediaDevices && navigator.mediaDevices.enumerateDevices().then((devices) => {
                    const videoDeviceList = devices.filter((device) => device.kind === "videoinput" && device.deviceId !== "default");
                    const audioDeviceList = devices.filter((device) => device.kind === "audioinput" && device.deviceId !== "default");
                    const loudspeakerDeviceList = devices.filter((device) => device.kind === "audiooutput" && device.deviceId !== "default");
                    resolve({
                        videoDeviceList, audioDeviceList, loudspeakerDeviceList
                    })
                }, (err) => {
                    console.error("getDeviceList error !")
                    reject({
                        videoDeviceList : [], audioDeviceList : [], loudspeakerDeviceList : []
                    })
                });
            })
            this.audioDeviceList = list.audioDeviceList;
            this.videoDeviceList = list.videoDeviceList;
            this.loudspeakerDeviceList = list.loudspeakerDeviceList;
        },
        changeVideoShareMediaTrackAndStream: async function ({constraints, kind, rtcConns, callback}) {
            //重新获取流
            let newStream = null;
            try{
                newStream = await this.getMediaPlay(constraints);
            }catch(e){
                console.log("changeVideoShareMediaTrackAndStream error! ", e)
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

            const video = document.querySelector("#selfMediaShareVideo");
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

            //替换本地流
            this.stream = new MediaStream([newStream.getVideoTracks()[0], this.stream.getAudioTracks()[0]]);
            try{
                video.srcObject = this.stream;
                video.play();
            }catch(e){
                setTimeout(() => {
                    video.play();
                }, 1000);
            }
        },
        getVideoShareTrackAndStream: function (callback) {
            callback(this.track, this.stream)
        },
        getVideoShareDeviceList : function(callback){
            callback(this.videoDeviceList, this.audioDeviceList, this.loudspeakerDeviceList)
        }
    },
    mounted: async function () {
        //获取设备列表
        await this.getDeviceList();
        window.Bus.$on("startVideoShare", this.startVideoShare);
        window.Bus.$on("stopVideoShare", this.stopVideoShare);
        window.Bus.$on("getVideoShareTrackAndStream", this.getVideoShareTrackAndStream);
        window.Bus.$on("changeVideoShareMediaTrackAndStream", this.changeVideoShareMediaTrackAndStream);
        window.Bus.$on("getVideoShareDeviceList", this.getVideoShareDeviceList);
    }
})