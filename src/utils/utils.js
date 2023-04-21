const os = require('os');

/**
 * 获取本机ip
 * @returns 
 */
function getLocalIP() {
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = '';
    if (osType === 'Windows_NT') {
        for (let dev in netInfo) {
            //win7的网络信息中显示为本地连接，win10显示为以太网
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        for (let dev in netInfo) {
            let iface = netInfo[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return ip;
}

/**
 * 获取请求的ip
 * @param {*} request 
 * @returns 
 */
function getClientIP(request) {
    let ip = request.headers['x-forwarded-for'] ||
        request.ip ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }

    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    return ip;
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genFlow(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genRoom(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 格式化时间
 * @param {*} time 
 * @param {*} format 
 * @returns 
 */
function formateDateTime(time, format) {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        S: time.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
        }
    }
    return format;
}

/**
 * 获取当前时间下一天
 * @param {*} time 
 * @returns 
 */
function getNextDay(time) {
    let date = new Date(time);
    date.setDate(date.getDate() + 1);
    let y = date.getFullYear();
    let m = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return y + "-" + m + "-" + d;
}

/**
 * 获取socket中的请求客户端信息
 * @param {*} socket 
 * @returns 
 */
function getSocketClientInfo(socket){
    let handshake = socket.handshake
    let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
    let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

    return {
        handshake, userAgent, ip
    }
}

module.exports = {
    getLocalIP,
    getClientIP,
    genFlow,
    genRoom,
    formateDateTime,
    getNextDay,
    getSocketClientInfo
}