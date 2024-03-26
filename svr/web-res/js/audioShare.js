// --------------------------- //
// --     audioShare.js     -- //
// --   version : 1.0.0     -- //
// --   date : 2023-08-15   -- //
// --------------------------- //

var audioShare = new Vue({
    el: '#audioShareApp',
    data: function () {
        return {
            stream: null,
            times: 0,
            intervalId: 0,
            track: null,
        }
    },
    methods: {
        getMediaPlay: function (constraints) {
            let media = null;
            let defaultConstraints = {
                // 音频轨道
                audio:true,
                // 视频轨道
                video: false
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
        startAudioShare: async function (callback) {
            let that = this;

            let msgData = {
                "Requested device not found" : "没有检测到麦克风"
            }
            let msg = "获取设备权限失败";

            if (this.stream == null) {
                try {
                    this.stream = await this.getMediaPlay();
                } catch (error) {
                    console.log(error)
                    msg = msgData[error.message]
                }
            }

            if (this.stream == null) {
                if (window.layer) {
                    layer.msg("获取设备权限失败")
                }
                window.Bus.$emit("changeAudioShareState", false)
                callback && callback()
                return;
            }

            const video = document.querySelector("#selfMediaShareAudio");
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
            video.srcObject = this.stream;
            video.play();

            //计算时间
            this.intervalId = setInterval(() => {
                that.times += 1;
                window.Bus.$emit("changeAudioShareTimes", that.times)
                
                $("#audioShareIcon").css("color", "#fb0404")
                $("#audioShareTimes").css("color", "#fb0404")
                setTimeout(() => {
                    $("#audioShareIcon").css("color", "#000000")
                    $("#audioShareTimes").css("color", "#000000")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始语音连麦，再次点击按钮即可挂断")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                callback && callback(track, that.stream)
            });
        },
        stopAudioShare: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.intervalId);

            window.Bus.$emit("changeAudioShareTimes", 0);

            if (window.layer) {
                layer.msg("语音连麦结束，本次连麦时长 " + this.times + "秒")
            }
            setTimeout(() => {
                $("#audioShareIcon").css("color", "#000000")
            }, 1000);

            this.stream = null;
            this.times = 0;

            return;
        },
        changeAudioShareDevice: async function ({kind, rtcConnect}) {
            //重新获取流
            let newStream = null;
            try{
                newStream = await this.getMediaPlay();
            }catch(e){
                console.log("changeAudioShareMediaTrackAndStream error! ", e)
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

            //替换本地音频流
            this.stream = new MediaStream([this.stream.getAudioTracks()[0]]);
            video.srcObject = this.stream;
            video.play();
        },
        getAudioShareTrackAndStream: function (callback) {
            callback(this.track, this.stream)
        },
    },
    mounted: async function () {
        window.Bus.$on("startAudioShare", this.startAudioShare);
        window.Bus.$on("stopAudioShare", this.stopAudioShare);
        window.Bus.$on("getAudioShareTrackAndStream", this.getAudioShareTrackAndStream);
        window.Bus.$on("changeAudioShareDevice", this.changeAudioShareDevice);
    }
})