// --------------------------- //
// --       screen.js       -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //

const screen = new Vue({
    el: '#screenApp',
    data: function () {
        return {
            stream: null, //录制流
            chunks: [], //录制数据
            mediaRecorder: null, //录制对象
            recording: null, //录制文件
            times: 0,   //录制时间
            intervalId: 0, //计时器id
            size: 0, //录制文件大小
            isScreen : false, //是否正在录制
        }
    },
    watch: {
        isScreen: function (val, oldVal) {
            if (val) {
                $("#screenTimes").css("display", "contents");
            } else {
                $("#screenTimes").css("display", "none");
            }
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
        openLocalScreen : async function({
            openCallback, closeCallback
        }){
            if(!this.isScreen){
                layer.confirm("是否进行本地屏幕录制", (index) => {
                    this.startScreen();
                    this.isScreen = !this.isScreen;
                    openCallback && openCallback();
                }, (index) => {
                    layer.close(index)
                })
            }else{
                this.stopScreen(closeCallback ? closeCallback : ()=>{});
                this.isScreen = !this.isScreen;
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
                layer.msg("获取设备录制权限失败")
                this.isScreen = false
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
            this.intervalId = setInterval(() => {
                that.times += 1;
                if(that.times < 10){
                    $("#screenTimes").text("录制中: 0" + that.times + "秒")
                }else{
                    $("#screenTimes").text("录制中: "+that.times + "秒")
                }
                $("#screenIcon").css("color","#fb0404")
                $("#screenTimes").css("color","#fb0404")
                setTimeout(() => {
                    $("#screenIcon").css("color","#000000")
                    $("#screenTimes").css("color","#000000")
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
                layer.msg("屏幕录制完毕! 检测到录制不完整，如需停止录制，请点击本页面的停止按钮来停止录制")
                hasErr = true
            }

            this.stream.getTracks().forEach(track => track.stop());
            this.recording = window.URL.createObjectURL(new Blob(this.chunks, { type: 'video/webm' }));

            clearInterval(this.intervalId);

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

            if (!hasErr) {
                layer.msg("录制完成，请在接收文件列表查看")
            }

            setTimeout(() => {
                $("#screenIcon").css("color","#000000")
            }, 1000);
            
            return;
        },
    },
    mounted: function () {
        window.Bus.$on("openLocalScreen", this.openLocalScreen);
    }
})