<template>
	<div class="cu-bar bg-gradual-purple solid-bottom flex">
		<div class="basis-xs flex">
			<div class="padding-lr flex justify-center align-center text-xxl">
				<span class="cuIcon-settings"></span>
			</div>
		</div>
		<div class="basis-lg flex align-center justify-center text-xxl">WebRtc示例</div>
		<div class="basis-xs flex justify-end">
			<div class="padding-lr flex justify-center align-center text-xxl">
				<span class="cuIcon-notice"></span>
			</div>
		</div>
	</div>
	<div class="flex align-center justify-center" style="height:200px;">
		<div class="flex justify-center">
			<a-space direction="vertical">
				<a-input-number style="width:100%;" v-model:value="rtcComm.roomId" placeholder="输入房间号" size="large" />
				<a-space>
					<a-button type="primary" size="large">
						<template #icon>
							<CheckOutlined />
						</template>
						创建/加入房间
					</a-button>
					<a-button size="large">
						<template #icon>
							<MessageOutlined />
						</template>
						与AI聊天
					</a-button>
				</a-space>
			</a-space>
		</div>
	</div>
	<a-result title="声明" sub-title="开源软件，仅可用户学习用途，其他用途后果自负。">
	</a-result>
</template>
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue';
import { CheckOutlined, MessageOutlined } from "@ant-design/icons-vue";
import { rtcComm, addSysLogs, addUserLogs, cleanLogs } from '../rtcGlobal';


console.log("rtcComm : ", rtcComm)
console.log('socket : ', rtcComm.socket)

//关闭连接
const closeDataChannels = function () {
	for (let remote in rtcComm.remoteMap) {
		let id = remote.id;
		let sendChannel = remote.sendChannel;
		let receiveChannel = remote.receiveChannel;
		if (!id || !sendChannel || !receiveChannel) {
			continue;
		}
		sendChannel.close();
		receiveChannel.close();
	}
};
//设置rtc缓存远程连接数据
const setRemoteInfo = function (id, data) {
	if (!id || !data) {
		return;
	}
	let oldData = rtcComm.remoteMap[id];
	if (oldData) {
		Object.assign(oldData, data);
		// TODO : 需要触发修改
		// Vue.set(rtcComm.remoteMap, id, oldData);
	}
};
//更新接收进度
const updateReceiveProcess = function (id, data) {
	for (let i = 0; i < rtcComm.receiveFileList.length; i++) {
		let item = rtcComm.receiveFileList[i];
		if (item.id === id && !item.done) {
			if (item.start === 0) {
				item.start = Date.now();
			}
			data.cost = parseInt((Date.now() - item.start) / 1000);
			Object.assign(rtcComm.receiveFileList[i], data);
		}
	}
};
//更新文件发送进度
const updateSendFileProcess = function (id, data) {
	for (let i = 0; i < rtcComm.sendFileList.length; i++) {
		let item = rtcComm.sendFileList[i];
		if (item.id === id && item.index === rtcComm.currentChooseFile.index && !item.done) {
			data.cost = parseInt((Date.now() - item.start) / 1000);
			Object.assign(rtcComm.sendFileList[i], data);
		}
	}
};
//获取rtc缓存远程连接数据
const getRemoteInfo = function (id) {
	if (!id) {
		return;
	}
	return rtcComm.remoteMap[id];
};
//移除rtc连接
const removeStream = function (rtcConnect, id, event) {
	getOrCreateRtcConnect(id).close;
	delete rtcComm.rtcConns[id];
	delete rtcComm.remoteMap[id];
};
//ice同步
const iceCandidate = function (rtcConnect, id, event) {
	if (event.candidate != null) {
		let message = {
			from: rtcComm.socketId,
			to: id,
			room: rtcComm.roomId,
			sdpMid: event.candidate.sdpMid,
			sdpMLineIndex: event.candidate.sdpMLineIndex,
			sdp: event.candidate.candidate
		};
		rtcComm.socket.emit('candidate', message);
	}
};
//offer同步
const offerSuccess = function (rtcConnect, id, offer) {
	rtcConnect.setLocalDescription(offer).then(r => { })
	rtcComm.socket.emit('offer', {
		from: rtcComm.socketId,
		to: id,
		room: rtcComm.roomId,
		sdp: offer.sdp
	});
};
//offer失败
const offerFailed = function (rtcConnect, id, error) {
	addSysLogs("offer失败," + error);
};
//answer同步
const answerSuccess = function (rtcConnect, id, offer) {
	rtcConnect.setLocalDescription(offer).then(r => { });
	rtcComm.socket.emit('answer', {
		from: rtcComm.socketId,
		to: id,
		room: rtcComm.roomId,
		sdp: offer.sdp
	});
};
//answer失败
const answerFailed = function (rtcConnect, id, error) {
	addSysLogs("answer失败," + error);
};
//ice成功
const addIceCandidateSuccess = function (res) {
	addSysLogs("addIceCandidateSuccess成功");
};
//ice失败
const addIceCandidateFailed = function (err) {
	addSysLogs("addIceCandidate失败," + err);
};
//创建rtc连接
const createRtcConnect = function (id) {
	if (id === undefined) {
		return;
	}

	let rtcConnect = new RTCPeerConnection(rtcComm.config);

	rtcConnect.onicecandidate = (e) => {
		iceCandidate(rtcConnect, id, e)
	};

	//保存peer连接
	rtcComm.rtcConns[id] = rtcConnect;
	if (!rtcComm.remoteMap[id]) {
		// TODO : 触发修改
		// Vue.set(rtcComm.remoteMap, id, { id: id })
	}

	// TODO : 发送文件事件监听初始化
	// initSendDataChannel(id);

	rtcConnect.onremovestream = (e) => {
		removeStream(rtcConnect, id, e)
	};

	return rtcConnect;
};
//获取本地rtc与远程rtc连接
const getOrCreateRtcConnect = function (id) {
	// 获取rtc缓存连接
	let rtcConnect = rtcComm.rtcConns[id];
	// 不存在，创建一个
	if (typeof (rtcConnect) == 'undefined') {
		rtcConnect = createRtcConnect(id);
	}
	return rtcConnect;
}

rtcComm.socket.on('created', async function (data) {
	addSysLogs("创建房间," + JSON.stringify(data));
	rtcComm.socketId = data.id;
	rtcComm.roomId = data.room;
	rtcComm.recoderId = data.recoderId;
	if (data.type === 'screen' && data['peers'].length === 0) {
		// TODO : 需要触发到屏幕共享流事件初始化
		// window.Bus.$emit("startScreenShare", data.id);
	}
	if (data.type === 'video' && data['peers'].length === 0) {
		// TODO : 需要触发到音视频共享流事件初始化
		// window.Bus.$emit("startVideoShare", data.id);
	}
	for (let i = 0; i < data['peers'].length; i++) {
		let otherSocketId = data['peers'][i].id;
		let rtcConnect = getOrCreateRtcConnect(otherSocketId);
		if (data.type === 'screen') {
			// TODO : 需要触发到屏幕共享流事件初始化
			// window.Bus.$emit("startScreenShare", otherSocketId, (track, stream) => {
			// 	initMediaShareChannel(rtcConnect, data.type, track, stream)
			// 	rtcConnect.createOffer(options).then(offer => {
			// 		offerSuccess(rtcConnect, otherSocketId, offer);
			// 	}, error => {
			// 		offerFailed(rtcConnect, otherSocketId, error);
			// 	});
			// });
		} else if (data.type === 'video') {
			// TODO : 需要触发到音视频共享流事件初始化
			// window.Bus.$emit("startVideoShare", otherSocketId, (track, stream) => {
			// 	initMediaShareChannel(rtcConnect, data.type, track, stream)
			// 	rtcConnect.createOffer(options).then(offer => {
			// 		offerSuccess(rtcConnect, otherSocketId, offer);
			// 	}, error => {
			// 		offerFailed(rtcConnect, otherSocketId, error);
			// 	});
			// });
		} else {
			rtcConnect.createOffer(options).then(offer => {
				offerSuccess(rtcConnect, otherSocketId, offer);
			}, error => {
				offerFailed(rtcConnect, otherSocketId, error);
			});
		}
	}
});

rtcComm.socket.on('joined', function (data) {
	addSysLogs("加入房间," + JSON.stringify(data));
	rtcComm.recoderId = data.recoderId;
	let rtcConnect = getOrCreateRtcConnect(data.id);
	if (data.type === 'screen') {
		// TODO : 需要触发到屏幕共享流事件初始化
		// window.Bus.$emit("getScreenShareTrackAndStream", (track, stream) => {
		// 	initMediaShareChannel(rtcConnect, data.type, track, stream)
		// });
	}
	if (data.type === 'video') {
		// TODO : 需要触发到音视频共享流事件初始化
		// window.Bus.$emit("getVideoShareTrackAndStream", (track, stream) => {
		// 	initMediaShareChannel(rtcConnect, data.type, track, stream)
		// });
	}
	// TODO : 弹窗提示改造
	// addPopup(data.id + "加入了房间。");
});

rtcComm.socket.on('offer', function (data) {
	addSysLogs("offer," + JSON.stringify(data));
	let rtcConnect = getOrCreateRtcConnect(data.from);
	let rtcDescription = { type: 'offer', sdp: data.sdp };
	rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
	rtcConnect.createAnswer(options).then((offer) => {
		answerSuccess(rtcConnect, data.from, offer)
	}).catch((error) => {
		answerFailed(rtcConnect, data.from, error)
	});
});

rtcComm.socket.on('answer', function (data) {
	addSysLogs("answer," + JSON.stringify(data));
	let rtcConnect = getOrCreateRtcConnect(data.from);
	let rtcDescription = { type: 'answer', sdp: data.sdp };
	rtcConnect.setRemoteDescription(new RTCSessionDescription(rtcDescription)).then(r => { });
});

rtcComm.socket.on('candidate', function (data) {
	addSysLogs("candidate," + JSON.stringify(data));
	let rtcConnect = getOrCreateRtcConnect(data.from);
	let rtcIceCandidate = new RTCIceCandidate({
		candidate: data.sdp,
		sdpMid: data.sdpMid,
		sdpMLineIndex: data.sdpMLineIndex
	});
	rtcConnect.addIceCandidate(rtcIceCandidate).then(res => {
		addIceCandidateSuccess(res);
	}).catch(error => {
		addIceCandidateFailed(error);
	});
});

rtcComm.socket.on('exit', function (data) {
	var rtcConnect = rtcComm.rtcConns[data.from];
	if (typeof (rtcConnect) == 'undefined') {
		return;
	} else {
		// TODO : 弹窗
		// addPopup(data.from + "退出了房间。");
		addSysLogs("退出房间," + JSON.stringify(data));
		getOrCreateRtcConnect(data.from).close;
		delete rtcComm.rtcConns[data.from];

		// TODO : 需要删除
		// Vue.delete(remoteMap, data.from);
	}
})


//选中文件时发送给接收方
rtcComm.socket.on('sendFileInfo', function (data) {
	let fromId = data.from;
	setRemoteInfo(fromId, { receiveFiles : data });
	// TODO: 弹窗初始化
	// addPopup(data.from + "选择了文件 [ " + data.name + " ]，即将发送。");
	addSysLogs(data.from + "选择了文件 [ " + data.name + " ]，即将发送。");
	// TODO : 接收进度条初始化最大值
	// document.querySelector("#receiveProgress").max = data.size;

	rtcComm.receiveFileList.push({
		id: fromId,
		index : data.index,
		href: "",
		name: data.name,
		type: data.type,
		size: data.size,
		process: 0,
		done: false,
		start: 0,
		cost: 0
	})

	data.emitType = "sendFileInfoAck";
	data.from = rtcComm.socketId; // from代表自己发出去的回执
	data.to = fromId; // 谁发过来的就回执给谁
	rtcComm.socket.emit("message", data)
});

//接收放已经收到待发送文件信息，代表可以进行发送了，
//没有ack的话，由于发送文件信息(websocket)和发送文件流(webrtc)是分开的
//webrtc和websocket之间互存在一个时差，导致接收的时候报错
rtcComm.socket.on('sendFileInfoAck', function (data) {
	let to = data.to;
	let fromId = data.from;
	if(to === rtcComm.socketId){ // 是自己发出去的文件ack回执
		addSysLogs("收到ack回执，准备发送给"+fromId)
		setRemoteInfo(fromId, {
			[rtcComm.currentChooseFile.index + "ack"] : true
		}) 
	}
})

//发送文字内容
rtcComm.socket.on('sendTxt', function (data) {
	let fromId = data.from;
	// TODO : 弹窗提示
	// addPopup(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");
	addSysLogs(data.from + "发送了文字 [ " + data.content.substr(0, 10) + " ]");

	try{
		data.content = decodeURIComponent(data.content)
	}catch(e){
		addSysLogs("decode msg err : "+data.content);
	}
	rtcComm.receiveTxtList.unshift({
		id: fromId,
		real : data.real,
		content: data.content,
		time: new Date().toLocaleString(),
		c_id: "txt_" + rtcComm.receiveTxtList.length,
		process: 0,
		done: false,
		start: 0,
		cost: 0
	})
});


//在线数量
rtcComm.socket.on('count', function (data) {
	console.log("count : ", data)
	rtcComm.allManCount = data.mc;
	addSysLogs("当前人数 : " + data.mc + "人在线")
});

//提示
rtcComm.socket.on('tips', function (data) {
	if (data.msg) {
		//TODO : 弹窗提示msg

	}
	if (data.reload) {
		setTimeout(() => {
			window.location.reload()
		}, 1000);
	}
});

//关闭共享
// TODO : 待调整
rtcComm.socket.on('stopScreenShare', function (data) {
	if (data.id === rtcComm.socketId) {
		// $("#selfMediaShareVideo").parent().remove();
	} else {
		// $("#otherMediaShareVideo").parent().remove();
	}
});

//关闭音视频
// TODO : 待调整
rtcComm.socket.on('stopVideoShare', function (data) {
	if (data.id === rtcComm.socketId) {
		// $("#selfMediaShareVideo").parent().remove();
	} else {
		// $("#otherMediaShareVideo").parent().remove();
	}
});

//取件码文件
rtcComm.socket.on('codeFile', function (data) {
	rtcComm.codeFileList = data.list;
	addSysLogs("收到取件码文件信息")
});

//ai对话
rtcComm.socket.on('openaiAnswer', function (data) {
	rtcComm.isAiAnswering = false
	rtcComm.aiChatList.push(data)
	addSysLogs("AI : " + data.content)
	// if (window.layer) {
	// 	layer.msg("AI回复了你，快点聊起来吧～")
	// }
	// TODO : 日期格式化
	rtcComm.aiChatList.forEach(item => {
		// item.time = window.util ? util.timeAgo(item.time) : item.time;
	})
	// that.openaiChatTpl()
});

//开关数据
rtcComm.socket.on('commData', function (data) {
	rtcComm.switchData = data.switchData
	rtcComm.switchDataGet = true;
	data.chatingData.forEach(elem => {
		try {
			elem.msg = decodeURIComponent(elem.msg)
		} catch (e) {
			addSysLogs("decode msg err : " + elem.msg);
		}
		rtcComm.chatingList.push(elem)
	})
	// TODO : 日期格式化
	rtcComm.chatingList.forEach(item => {
		// item.time = window.util ? util.timeAgo(item.time) : item.time;
	})
});

//公共聊天频道
rtcComm.socket.on('chating', function (data) {
	addSysLogs(data.room + "频道的" + data.socketId + "发言: [ " + data.msg + " ]");
	try {
		data.msg = decodeURIComponent(data.msg)
	} catch (e) {
		addSysLogs("decode msg err : " + data.msg);
	}
	rtcComm.chatingList.push(data);
	if (rtcComm.chatingList.length > 10) {
		rtcComm.chatingList.shift();
	}
	rtcComm.chatingList.forEach(item => {
		// TODO : 日期格式化
		// item.time = window.util ? util.timeAgo(item.time) : item.time;
	})
	// that.chatingTpl()
});

// TODO : 管理后台密码确认
rtcComm.socket.on('manageCheck', function (data) {
	// if (window.layer) {
	// 	layer.prompt({
	// 		formType: 1,
	// 		title: '请输入',
	// 	}, function (value, index, elem) {
	// 		that.socket.emit('manageConfirm', {
	// 			room: that.roomId,
	// 			value: value
	// 		});
	// 		layer.close(index)
	// 	});
	// }
});

// TODO : 管理后台界面
rtcComm.socket.on('manage', function (data) {
	// if (window.layer) {
	// 	if (data.socketId !== that.socketId) {
	// 		layer.msg("非法触发事件")
	// 		return
	// 	}
	// 	layer.closeAll();
	// 	that.token = data.token;
	// 	layer.load(2, {
	// 		time: 1000,
	// 		shade: [0.8, '#000000'],
	// 		success: function (layero) {
	// 			layer.setTop(layero); //重点2
	// 		}
	// 	})
	// 	setTimeout(() => {
	// 		that.manageIframeId = layer.tab({
	// 			area: ['100%', '100%'],
	// 			shade: [0.8, '#393D49'],
	// 			// closeBtn: 0,
	// 			tab: [{
	// 				title: data.content[0].title,
	// 				content: data.content[0].html
	// 			}, {
	// 				title: data.content[1].title,
	// 				content: data.content[1].html
	// 			}, {
	// 				title: data.content[2].title,
	// 				content: data.content[2].html
	// 			}],
	// 			cancel: function (index, layero) {
	// 				that.manageIframeId = 0;
	// 			},
	// 		})
	// 		layer.full(that.manageIframeId)
	// 	}, 500);
	// }
});

</script>