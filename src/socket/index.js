const connect = require("./connect");

/**
 * 执行器
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

    io.sockets.on('connection', function (socket) {
        connect(io, socket, tables, dbClient)
    });
}

module.exports = {
    excute
}