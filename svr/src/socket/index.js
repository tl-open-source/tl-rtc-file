const connect = require("./connect");
const rtcConstant = require("./rtcConstant");
const rtcServerEvent = rtcConstant.rtcServerEvent

/**
 * socket事件初始化入口
 * @param {*} tables 
 * @param {*} dbClient 
 * @param {*} io 
 * @returns 
 */
async function excute(tables, dbClient, io) {
    if (io === undefined || io === null) {
        console.error("init socket error ");
        return;
    }

    io.sockets.on(rtcServerEvent.connection, function (socket) {
        if(socket.id === undefined || socket.id === null || socket.id === 0 || socket.id === "0"){
            socket.emit("tips", {
                to: socket.id,
                msg: "非法连接"
            });
            return
        }
        connect(io, socket, tables, dbClient)
    });
}

module.exports = {
    excute
}