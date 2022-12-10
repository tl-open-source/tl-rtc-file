var videoShare = new Vue({
    el: '#videoShareApp',
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

            } else if (window.navigator.mozGetUserMedia) {
                media = navagator.mozGetUserMedia({
                    video: true,
                    audio: true
                });
            } else if (window.navigator.getUserMedia) {
                media = window.navigator.getUserMedia({
                    video: true,
                    audio: true
                })
            } else if (window.navigator.webkitGetUserMedia) {
                media = new Promise((resolve, reject) => {
                    window.navigator.webkitGetUserMedia({
                        video: true,
                        audio: true
                    }, (res) => {
                        resolve(res)
                    }, (err) => {
                        reject(err)
                    });
                })
            }
            return media
        },
        startVideoShare: async function (id, callback) {
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
                window.Bus.$emit("changeVideoShareState", false)
                if (callback) {
                    callback()
                }
                return;
            }

            $("#mediaShareRoomList").append(`
              <div class="swiper-slide mediaShareBlock">
                  <video id="selfMediaShareVideo" autoplay playsinline onclick="tlrtcfile.openFullVideo(this, 'video')"></video>
              </div>
            `);
            var video = document.querySelector("#selfMediaShareVideo");
            video.srcObject = this.stream
            // ios 微信浏览器兼容问题
            video.play();
            document.addEventListener('WeixinJSBridgeReady',function(){
                video.play();
            },false);

            //计算时间
            this.interverlId = setInterval(() => {
                that.times += 1;
                window.Bus.$emit("changeVideoShareTimes", that.times)
                
                $("#videoShare").css("fill", "#fb0404")
                setTimeout(() => {
                    $("#videoShare").css("fill", "#000000")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始音视频通话，再次点击按钮即可挂断")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                if (callback) {
                    callback(track, that.stream)
                }
            });
        },
        stopVideoShare: function () {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.interverlId);

            window.Bus.$emit("changeVideoShareTimes", 0)

            if (window.layer) {
                layer.msg("音视频通话结束，本次通话时长 " + this.times + "秒")
            }

            this.stream = null;
            this.times = 0;

            return;
        },
        getVideoShareTrackAndStream: function (callback) {
            callback(this.track, this.stream)
        }
    },
    mounted: function () {
        window.Bus.$on("startVideoShare", this.startVideoShare);
        window.Bus.$on("stopVideoShare", this.stopVideoShare);
        window.Bus.$on("getVideoShareTrackAndStream", this.getVideoShareTrackAndStream);
    }
})