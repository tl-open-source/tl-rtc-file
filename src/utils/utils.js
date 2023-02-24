const os = require('os');

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
          for (var dev in netInfo) {　　　　
               var iface = netInfo[dev];　　　　　　
               for (var i = 0; i < iface.length; i++) {
                   var alias = iface[i];
                   if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                       return alias.address;
                   }
               }　　
           }
     }
 
     return ip;
}

function getClientIP(request){
     var ip = request.headers['x-forwarded-for'] || 
     request.ip || 
     request.connection.remoteAddress ||
     request.socket.remoteAddress ||
     request.connection.socket.remoteAddress;

     if(ip.split(',').length > 0){
          ip = ip.split(',')[0]
     }
     
     ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
     return ip; 
}


function genFlow(req) {
    return num = Math.floor(Math.random(100000000)*100000000+1);
}

function genRoom(req) {
    return num = Math.floor(Math.random(100000000)*100000000+1);   
}


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
         format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
         if (new RegExp('(' + k + ')').test(format)){
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
         }
    }
    return format;
}

function getNextDay(time){
    var date = new Date(time);
    date.setDate(date.getDate() + 1);
    var y = date.getFullYear();
    var m = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return y + "-" + m + "-" + d;
}

module.exports = {
     getLocalIP,
     getClientIP,
     genFlow,
     genRoom,
     formateDateTime,
     getNextDay
}