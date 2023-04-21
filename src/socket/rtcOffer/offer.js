/**
 * webrtc offer
 * 转发offer消息至room其他客户端 [from,to,room,sdp]
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function offer(io, socket, tables, dbClient, data){
    let otherClient = io.sockets.connected[data.to];
    if (!otherClient) {
        return;
    }
    otherClient.emit('offer', data);
}

module.exports = {
    offer
}