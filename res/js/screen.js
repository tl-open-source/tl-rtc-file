var screen = new Vue({
    el: '#screenApp',
    data: function () {
        return {
            stream: null,
            chunks: [],
            mediaRecorder: null,
            recording: null,
            times: 0,
            interverlId: 0,
            size: 0,
        }
    },
    methods: {
        getMediaPlay: function () {
            if (navigator.getDisplayMedia) {
                return navigator.getDisplayMedia({ video: true, audio: true });
            } else if (navigator.mediaDevices.getDisplayMedia) {
                return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            } else if (navigator.mediaDevices.getUserMedia) {
                return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' }, audio: true });
            } else {
                return navigator.getUserMedia({
                    video: { 'mandatory': { 'chromeMediaSource': 'desktop' } },
                    audio: true
                })
            }
        },
        startScreen: async function () {
            let that = this;
            if (this.recording) {
                window.URL.revokeObjectURL(this.recording);
            }

            this.chunks = [];
            this.recording = null;

            try {
                this.stream = await this.getMediaPlay();
            } catch (error) {
                console.log(error)
            }

            if (this.stream == null) {
                if (window.layer) {
                    layer.msg("获取设备录制权限失败")
                }
                window.Bus.$emit("changeScreenState", false)
                return;
            }

            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });
            this.mediaRecorder.addEventListener('dataavailable', event => {
                if (event.data && event.data.size > 0) {
                    that.size += event.data.size
                    that.chunks.push(event.data);
                }
            });
            this.mediaRecorder.start(10);

            //计算时间
            this.interverlId = setInterval(() => {
                that.times += 1;
                window.Bus.$emit("changeScreenTimes", that.times)
                $("#screen").css("color","#fb0404")
                $("#screenTimes").css("color","#fb0404")
                setTimeout(() => {
                    $("#screen").css("color","#ffffff")
                    $("#screenTimes").css("color","#ffffff")
                }, 500)
            }, 1000);

            if (window.layer) {
                layer.msg("开始录制，再次点击录制即可停止")
            }
        },
        stopScreen: function (callback) {
            let hasErr = false;

            try {
                this.mediaRecorder.stop();
            } catch (e) {
                if (window.layer) {
                    layer.msg("屏幕录制完毕! 检测到录制不完整，如需停止录制，请点击本页面的停止按钮来停止录制")
                }
                hasErr = true
            }

            this.stream.getTracks().forEach(track => track.stop());
            this.recording = window.URL.createObjectURL(new Blob(this.chunks, { type: 'video/webm' }));

            clearInterval(this.interverlId);

            this.mediaRecorder = null;
            this.chunks = [];
            this.stream = null;

            let data = {
                donwId: 'd_' + parseInt(Math.random(10000) * 10000),
                times: this.times,
                src: this.recording,
                size: this.size
            }

            this.times = 0;
            this.size = 0;

            window.Bus.$emit("changeScreenTimes", 0)

            callback(data)

            if (window.layer && !hasErr) {
                layer.msg("录制完成，请在接收文件列表查看")
            }

            return;
        },
    },
    mounted: function () {
        window.Bus.$on("startScreen", this.startScreen);
        window.Bus.$on("stopScreen", this.stopScreen);
    }
})