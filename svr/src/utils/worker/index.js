const Worker = require("./worker").Worker;

async function removeRoomSokect(list){
    if(list == null || typeof list != 'array'){
        return;
    }
    if(list.length <= 0){
        return;
    }

    let cusWorker = new Worker(5000,()=>{
        for(let i = 0; i < list.length; i++){
            console.log('i : ',list[i]);
        }
    });

    cusWorker.run()
}

module.exports = {
    removeRoomSokect
}