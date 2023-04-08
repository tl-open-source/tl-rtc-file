var screenShare = new Vue({
    el: '#screenShareApp',
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
            }
            return media
        },
        startScreenShare: async function (id, callback) {
            let that = this;

            if(this.stream == null){
                try {
                    this.stream = await this.getMediaPlay();
                } catch (error) {
                    console.log(error)
                }
            }

            if (this.stream == null) {
                if (window.layer) {
                    layer.msg("获取设备屏幕录制权限失败")
                }
                window.Bus.$emit("changeScreenShareState", false)
                if(callback){
                    callback()
                }
                return;
            }

            $("#mediaScreenRoomList").append(`
                <div class="tl-rtc-file-mask-media-video">
                    <video style="width:100%;height:30%;" id="selfMediaShareVideo" autoplay playsinline onclick="tlrtcfile.openFullVideo(this, 'screen', 'self')"></video>
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
                window.Bus.$emit("changeScreenShareTimes", that.times)
                $("#screenShareIcon").css("color","#fb0404")
                $("#screenShareTimes").css("color","#fb0404")
                setTimeout(() => {
                    $("#screenShareIcon").css("color","#ffffff")
                    $("#screenShareTimes").css("color","#ffffff")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始屏幕共享，再次点击按钮即可停止共享")
            }

            this.stream.getTracks().forEach(function (track) {
                that.track = track;
                if(callback){
                    callback(track, that.stream)
                }
            });
        },
        stopScreenShare: function () {
            if(this.stream){
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.interverlId);

            window.Bus.$emit("changeScreenShareTimes", 0)

            if (window.layer) {
                layer.msg("屏幕共享结束，本次共享时长 "+this.times+"秒")
            }

            setTimeout(() => {
                $("#screenShareIcon").css("color", "#000000")
            }, 1000);
            
            this.stream = null;
            this.times = 0;

            return;
        },
        getScreenShareTrackAndStream: function(callback){
            callback(this.track, this.stream)
        },
    },
    mounted: function () {
        window.Bus.$on("startScreenShare", this.startScreenShare);
        window.Bus.$on("stopScreenShare", this.stopScreenShare);
        window.Bus.$on("getScreenShareTrackAndStream", this.getScreenShareTrackAndStream);
    }
})