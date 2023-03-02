import { ref, reactive } from 'vue';

// rtcfile 公共数据
export const rtcComm = ref({
	socket : null, //socket
    rtcConfig : {}, // rtc配置
    rtcOption : {}, // rtc配置
    roomId : 10086, // 房间号

    isJoined: false, // 是否加入房间
	allManCount: 0, // 当前在线人数
	nickName: "", //本人名称
	socketId: 0, //本人的id
	codeId: "", //取件码
	recoderId: 0, //记录id
	rtcConns: {}, //远程连接
	remoteMap: {}, //远程连接map

	chunkSize: 16 * 1024, // 一块16kb 最大应该可以设置到64kb
	allSended: false,//当前文件是否全部发送给房间内所有用户
	isSending: false, //是否正在发送文件中
	currentReceiveSize: 0, //统计收到文件的大小 (单个文件进度)
	currentSendSize: 0, //统计发送文件的大小 (单个文件进度)
	currentSendAllSize: 0, // 统计发送文件总大小 (流量统计)
	uploadCodeFileProcess: 0, // 上传暂存文件的进度

	currentChooseFile: null, //当前发送中的文件
	chooseFileList: [], //选择的文件列表
	sendFileList: [], //发过文件的列表
	receiveFileList: [], //接收文件的列表
	receiveTxtList: [], //接收的文字列表 
	codeFileList: [], //取件码文件列表
	chatingList: [], //公共聊天频道内容
	aiChatList: [], //ai对话内容
	logs: [],  //记录日志

	isScreen: false, //是否在录屏中
	screenTimes: 0,  //当前录屏时间
	isScreenShare: false, //是否在屏幕共享中
	screenShareTimes: 0,  //当前屏幕共享时间
	isVideoShare: false, //是否在音视频中
	videoShareTimes: 0,  //当前音视频时间
	isPasswordRoom: false, //是否在密码房中
	isAiAnswering: false, //是否ai正在回答中

	switchData: {}, //配置开关数据
	switchDataGet: false, // 是否已经拿到配置开关数据
    useTurn : false, // 不启用中继服务
	token: "", //登录token
	aiAnsweringTxtIntervalId: 0, //实现等待动画
	aiAnsweringTxt: "思考中...", //ai思考中的文字
	openaiSendContext: false, // ai对话是否发送上下文
	logsFilter: "", //日志过滤参数
}).value

// rtcfile 通用方法
export function addSysLogs(msg){
    addLogs(msg, "【系统日志】: ")
}
export function addUserLogs(msg){
    addLogs(msg, "【操作日志】: ")
}
export function cleanLogs() {
    rtcComm.logs = []
    addSysLogs("清空日志")
}

// 是否包含中文
const containChinese = function(str){
	return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
};
// 是否包含数字
const containNumber =  function(str){
	return /^[0-9]+.?[0-9]*$/.test(str);
};
// 是否包含符号
const containSymbol = function(str){
	return new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(str)
};
// 生成昵称
const genNickName = function () {
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
};

// 转码
const escapeHtml = function () {
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
};

// 获取网络连接状态
const getNetWorkState = function () {
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
};

// 是否是手机端
const isMobile = function () {
	return navigator.userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
}

//是否支持webrtc
const supposeWebrtc = function(rtcConfig){
	try {
		let testRTCPeerConnection = window.RTCPeerConnection 
			|| window.webkitRTCPeerConnection 
			|| window.mozRTCPeerConnection 
			|| window.RTCIceGatherer;
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
};

// 添加日志
function addLogs(msg, type) {
    if(rtcComm.logs.length > 1000){
        rtcComm.logs.shift();
    }
    rtcComm.logs.unshift({
        type: type,
        msg :  msg,
        time : new Date().toLocaleString()
    })
}