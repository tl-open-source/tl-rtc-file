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
        connect(io, socket, tables, dbClient)
    });
}

module.exports = {
    excute
}