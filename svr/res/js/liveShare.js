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
            interverlId: 0,
            track: null,
        }
    },
    methods: {
        getMediaPlay: function () {
            let media = null;
            let constraints = {
                // 音频轨道
                audio:true,
                // 视频轨道
                video: {
                    // 前后置
                    facingMode: true ? "user" : "environment",
                    // 分辨率
                    width: {
                        ideal : parseInt((document.documentElement.clientWidth - 20) / 2),
                        max : document.documentElement.clientWidth,
                        min : 100
                    }, 
                    height: {
                        ideal : parseInt((document.documentElement.clientHeight - 20) / 2),
                        max : document.documentElement.clientHeight,
                        min : 100
                    },
                    // 码率
                    frameRate: {
                        ideal: 30,
                        max: 50
                    },
                    // 指定设备
                    // deviceId: "",
                },
            };
            if(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia){
                media = window.navigator.mediaDevices.getUserMedia(constraints);
            } else if (window.navigator.mozGetUserMedia) {
                media = navagator.mozGetUserMedia(constraints);
            } else if (window.navigator.getUserMedia) {
                media = window.navigator.getUserMedia(constraints)
            } else if (window.navigator.webkitGetUserMedia) {
                media = new Promise((resolve, reject) => {
                    window.navigator.webkitGetUserMedia(constraints, (res) => {
                        resolve(res)
                    }, (err) => {
                        reject(err)
                    });
                })
            }
            return media
        },
        startLiveShare: async function (id, callback) {
            let that = this;

            let msgData = {
                "Requested device not found" : "没有检测到摄像头或麦克风"
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
                window.Bus.$emit("changeLiveShareState", false)
                if (callback) {
                    callback()
                }
                return;
            }

            $("#mediaLiveRoomList").append(`
                <div class="tl-rtc-file-mask-media-video">
                    <video id="selfMediaShareVideo" autoplay playsinline onclick="tlrtcfile.openFullVideo(this, 'live', 'self')"></video>
                </div>
            `);
            var video = document.querySelector("#selfMediaShareVideo");
            video.srcObject = this.stream
            video.addEventListener('loadedmetadata', function() {
                // ios 微信浏览器兼容问题
                video.play();
                document.addEventListener('WeixinJSBridgeReady', function () {
                    video.play();
                }, false);
            });

            //计算时间
            this.interverlId = setInterval(() => {
                that.times += 1;
                window.Bus.$emit("changeLiveShareTimes", that.times)
                
                $("#liveShareIcon").css("color", "#fb0404")
                $("#liveShareTimes").css("color", "#fb0404")
                setTimeout(() => {
                    $("#liveShareIcon").css("color", "#000000")
                    $("#liveShareTimes").css("color", "#000000")
                }, 500)

                if(that.times >= 15){
                    that.stopLiveShare();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    return
                }
            }, 1000);

            if (window.layer) {
                layer.msg("开始直播，再次点击按钮即可结束直播")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                if (callback) {
                    callback(track, that.stream)
                }
            });
        },
        stopLiveShare: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.interverlId);

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
        getLiveShareTrackAndStream: function (callback) {
            callback(this.track, this.stream)
        }
    },
    mounted: function () {
        window.Bus.$on("startLiveShare", this.startLiveShare);
        window.Bus.$on("stopLiveShare", this.stopLiveShare);
        window.Bus.$on("getLiveShareTrackAndStream", this.getLiveShareTrackAndStream);
    }
})