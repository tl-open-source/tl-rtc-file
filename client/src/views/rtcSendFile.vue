chunkSize: 16 * 1024, // 一块16kb 最大应该可以设置到64kb
	allSended: false,//当前文件是否全部发送给房间内所有用户
	isSending: false, //是否正在发送文件中
	currentReceiveSize: 0, //统计收到文件的大小 (单个文件进度)
	currentSendSize: 0, //统计发送文件的大小 (单个文件进度)
	currentSendAllSize: 0, // 统计发送文件总大小 (流量统计)
	uploadCodeFileProcess: 0, // 上传暂存文件的进度
