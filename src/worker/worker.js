class Master {
    constructor(maxCount = 4){
        this.workers = {};          //worker数量
        this.maxCount = maxCount;   //最大worker数
        console.log("执行master")
    }

    get(){
        let data = {
            workers : this.workers,
            maxCount : this.maxCount,
        }
        return data;
    }

    add(type = "", worker = null){
        if(Object.keys(this.workers) >= this.maxCount){
            return;
        }
        if(!worker || !type){
            return;
        }
        if(this.workers[type] != undefined){
            return;
        }
        this.workers[type] = worker;
    }

    del(type = ""){
        delete this.workers[type];
        if(this.maxCount > 0){
            this.maxCount--;
        }
    }

    clear(){
        this.workers = {};
        this.maxCount = 0;
    }
}

class Worker {
    constructor(time = 2000, handler = null){
        this.isRunning = false;
        this.excuteCount = 0;
        this.errorCount = 0;

        this.time = time;
        this.handler = handler;
        this.id = 0;
        console.log("执行worker")
    }

    get(){
        let data = {
            isRunning : this.isRunning,
            excuteCount : this.errorCount,
            errorCount : this.errorCount,
            time : this.time,
        }
        return data;
    }

    run(){
        if(!this.time || this.time <= 0){
            return;
        }
        if(!this.handler){
            return;
        }
        if(this.errorCount > 5){
            console.log("errorCount > 5",this.errorCount)
            this.stop();
        }
        let that = this;
        function excute(){
            try{
                that.handler();
                that.excuteCount++;
                that.isRunning = true;
            }catch(err){
                that.errorCount++;
            }
        }
        this.id = setInterval(excute,this.time);
    }

    stop(){
        clearInterval(this.id);
        this.id = 0;
        this.time = 0;
        this.handler = null;
        this.isRunning = false;
        this.excuteCount = 0;
        this.errorCount = 0;
        console.log("停止worker handler")
    }
}


module.exports = {
    Worker : Worker,
    Master : Master
}