const os = require('os');
const crypto = require('crypto');
const cfg = require('./../../conf/cfg.json');

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

/**
 * 转换文件大小
 * @param {*} size 
 * @returns 
 */
function getFileSizeStr(size) {
    let sizeStr = (size / 1048576).toString();
    let head = sizeStr.split(".")[0];
    let tail = "";
    if (sizeStr.split(".")[1]) {
        tail = sizeStr.split(".")[1].substring(0, 3);
    }
    return head + '.' + tail + "M";
}

function tlConsole(...msg){
    console.log(`\x1B[1m${new Date().toLocaleString()}\x1B[0m \x1B[40m\x1B[33m tl-rtc-file-${cfg.version} \x1B[0m : \x1B[36m%s\x1B[0m`,...msg)
}

function tlConsoleIcon(){
    const icon = `
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
 .   .          .            .-.   .     
_|_  |         _|_           |  o  |        
 .   |  ___ .--.|   .-. ___ -|- .  |  .-.   tl-rtc-file-${cfg.version}
 |   |      |   |  [         |  |  | [.-'   Copyright (c) 2023 tl-open-source
 [._ |      |   [_  ._.      |  |  | [._.   MIT License
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
`;
    console.log(icon);
}


/**
 * 生成客户端控制台打印logo
 */
function genClientLogo(){
    let style = "font-size:20px;color: black; font-style: italic;";
    style += "font-weight: bold; font-family: system-ui;";
    style += "padding: 8px;cursor: pointer;"
    return style;
}


/**
 * 生成turn服务的iceServers配置
 * @param {*} withTurn 
 * @param {*} useSecret
 * @param {*} username 
 * @returns 
 */
function genTurnServerIceServersConfig(withTurn, useSecret, username){
    let iceServers = [{
        urls : cfg.webrtc.stun.host
    }];

    //无需turn中继
    if(!withTurn){
        return iceServers;
    }

    //turn固定账号模式
    if(!useSecret){
        iceServers.push({
            urls : cfg.webrtc.turn.host,
            username: cfg.webrtc.turn.username,
            credential: cfg.webrtc.turn.credential
        })
        return iceServers;
    }

    // 有效账号模式
    const secret = cfg.webrtc.turn.secret || "tlrtcfile";
    //生成账号的有效期
    const expirseTime = 60 * 60 * 24 * 1000;
    //当前时间
    const time = new Date().getTime();
    //turn服务的用户名规则
    const turnUsername = `${time + expirseTime}:${username}`;
    //turn服务的密码规则
    const dig = crypto.createHmac('sha1', secret).update(turnUsername).digest();
    const turnPassword = Buffer.from(dig, 'utf-8').toString('base64');

    iceServers.push({
        urls : cfg.webrtc.turn.host,
        username: turnUsername,
        credential: turnPassword
    })

    return iceServers;
}

/**
 * 转义字符串
 * @param {*} str 
 * @returns 
 */
function escapeStr(str) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    const encodedMap = {
        '%': '%25',
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '*': '%2A',
        '-': '%2D',
        '.': '%2E',
        '_': '%5F',
        '~': '%7E'
    };

    return String(str).replace(/[&<>"'`=\/%!'()*\-._~]/g, function (s) {
        return entityMap[s] || encodedMap[s] || '';
    });
}

/**
 * 解析转义字符串
 * @param {*} str 
 * @returns 
 */
function unescapeStr(str) {
    const entityMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '='
    };

    const encodedMap = {
        '%25': '%',
        '%21': '!',
        '%27': "'",
        '%28': '(',
        '%29': ')',
        '%2A': '*',
        '%2D': '-',
        '%2E': '.',
        '%5F': '_',
        '%7E': '~'
    };

    return String(str).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);|%(25|21|27|28|29|2A|2D|2E|5F|7E)/g, function (s) {
        return entityMap[s] || encodedMap[s] || '';
    });
}


module.exports = {
    getLocalIP,
    getClientIP,
    genFlow,
    genRoom,
    formateDateTime,
    getNextDay,
    getSocketClientInfo,
    getFileSizeStr,
    tlConsole,
    tlConsoleIcon,
    genTurnServerIceServersConfig,
    genClientLogo,
    unescapeStr,
    escapeStr
}