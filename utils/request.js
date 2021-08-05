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


module.exports = {
     getLocalIP,
     getClientIP,
     genFlow,
     genRoom
}