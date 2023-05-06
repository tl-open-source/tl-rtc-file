const io = require('socket.io-client');

describe('测试', function () {
    

    function getSocket(){
        return io("ws://localhost:8444");
    }

    it('socket test', function () {
        
        const socket1 = getSocket();
        socket1.on("count",function(res){
            console.log(res)
        })
        socket1.emit("count");
        socket1.emit("createAndJoin",{
            room : 1111
        })

        const socket2 = getSocket();
        socket2.emit("createAndJoin",{
            room : 1111
        })


        // const socket3 = io("ws://localhost:8444");
        // socket1.on("count",function(res){
        //     console.log(res)
        // })


    });
    
});