window.tlrtcfile = {
    containChinese: function(str){
        return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
    },
    containNumber : function(str){
        return /^[0-9]+.?[0-9]*$/.test(str);
    },
    containSymbol : function(str){
        return new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(str)
    },
    genNickName: function () {
        // 获取指定范围内的随机数
        function randomAccess(min, max) {
            return Math.floor(Math.random() * (min - max) + max)
        }

        // 解码
        function decodeUnicode(str) {
            //Unicode显示方式是\u4e00
            str = "\\u" + str;
            str = str.replace(/\\/g, "%");
            //转换中文
            str = unescape(str);
            //将其他受影响的转换回原来
            str = str.replace(/%/g, "\\");
            return str;
        }

        function getRandomName(len) {
            let name = ""
            for (let i = 0; i < len; i++) {
                let unicodeNum = ""
                unicodeNum = randomAccess(0x4e00, 0x9fa5).toString(16)
                name += decodeUnicode(unicodeNum)
            }
            return name;
        }
        return getRandomName(4);
    },
    escapeHtml: function () {
        var entityMap = {
            escape: {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
            },
            unescape: {
                '&amp;': "&",
                '&apos;': "'",
                '&gt;': ">",
                '&lt;': "<",
                '&quot;': '"',
            }
        };
        var entityReg = {
            escape: RegExp('[' + Object.keys(entityMap.escape).join('') + ']', 'g'),
            unescape: RegExp('(' + Object.keys(entityMap.unescape).join('|') + ')', 'g')
        }

        // 将HTML转义为实体
        function escape(html) {
            if (typeof html !== 'string') return ''
            return html.replace(entityReg.escape, function (match) {
                return entityMap.escape[match]
            })
        }

        // 将实体转回为HTML
        function unescape(str) {
            if (typeof str !== 'string') return ''
            return str.replace(entityReg.unescape, function (match) {
                return entityMap.unescape[match]
            })
        }

        return {
            escape: escape,
            unescape: unescape
        }
    },
    getNetWorkState: function () {
        let ua = navigator.userAgent;
        let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
        networkStr = networkStr.toLowerCase().replace('nettype/', '');
        if(!['wifi','5g','3g','4g','2g','3gnet','slow-2g'].includes(networkStr)){
            if(navigator.connection){
                networkStr = navigator.connection.effectiveType 
            }
        }
        switch (networkStr) {
            case 'wifi':
                return 'wifi';
            case '5g':
                return '5g';
            case '4g':
                return '4g';
            case '3g' || '3gnet':
                return '3g';
            case '2g' || 'slow-2g':
                return '2g';
            default:
                return 'unknow';
        }
    },
    shaking: function (id, top, left) {
        let a = ['maringTop', 'marginLeft'], b = 0;
        window.shakingId = setInterval(function () {
            document.getElementById(id).style[a[b % 2]] = (b++) % 4 < 2 ? (top + "px") : (left + "px");
            if (b > 15) { clearInterval(window.shakingId); b = 0 }
        }, 32)
    },
    loadJS: function (url, callback) {
        var script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    isMobile: function () {
        return navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
    },
    closeFullVideo : function(node, type){
        let stream = node.srcObject;
        let nodeId = node.id.substr(0, node.id.length - 5);
        if(window.layer){
            layer.closeAll()
        }
        $("#mediaShareRoomList").append(`
            <div class="swiper-slide mediaShareBlock">
                <video id="${nodeId}" autoplay playsinline onclick="tlrtcfile.openFullVideo(this,'${type}')"></video>
            </div>
        `);
        var video = document.querySelector("#"+nodeId);
        video.srcObject = stream
        // ios 微信浏览器兼容问题
        video.play();
        document.addEventListener('WeixinJSBridgeReady',function(){
            video.play();
        },false);
    },
    openFullVideo : function(node, type){
        let stream = node.srcObject;
        let nodeId = node.id + "_full";
        if(window.layer){
            layer.open({
                type: 1,
                title: false,
                area: [`80%`],
                shade: 0.3,
                content: `<video id="${nodeId}" autoplay playsinline onclick="tlrtcfile.closeFullVideo(this, '${type}')"></video>`,
                success: function (layero) {
                    document.querySelector("#"+nodeId).parentElement.style.height = "auto"

                    let video = document.querySelector("#"+nodeId);
                    video.srcObject = stream;
                    // ios 微信浏览器兼容问题
                    video.play();
                    document.addEventListener('WeixinJSBridgeReady',function(){
                        video.play();
                    },false);

                    //并且需要移除父节点
                    document.querySelector("#"+node.id).parentElement.remove();
                },
                cancel: function(){
                    tlrtcfile.closeFullVideo(document.querySelector("#"+nodeId), type);
                }
            });
        }
    },
    supposeWebrtc: function(rtcConfig){
        try {
            let testRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCIceGatherer;
            if (testRTCPeerConnection) {
                new RTCPeerConnection(rtcConfig);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("浏览器不支持webrtc")
            return false;
        }
    }
}