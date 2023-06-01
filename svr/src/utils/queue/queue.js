class tlQueue{
    constructor(options){
        let {
            max = 500, // 最多处理任务数量
            queueThreshold = 2, // 1秒最多并发任务数量，超过进入队列
            queueRate = 1000, // 队列处理单个任务时间间隔, 单位ms
            consumerFunc = ()=>{}, // 消费逻辑 Function
            queue = [], // 任务队列
            count = 0, // 计数器
            queueId = -1, // 消费轮询器id
        } = options;

        this.options = options;
        this.max = max;
        this.queueThreshold = queueThreshold;
        this.queueRate = queueRate;
        this.queue = queue;
        this.count = count;
        this.consumerFunc = consumerFunc;
        this.queueId = queueId;

        this.init()
    }

    /**
     * 启动
     */
    init(){
        this.queueId = setInterval(() => {
            if(this.queue.length > 0){
                this.consume();
                console.log("tl-queue pop : ",this.queue.length)
            }
        }, this.queueRate);
    }

    /**
     * 推数据
     * @param {*} data 
     */
    produce(data) {
        //size <= queueThreshold, 允许一些并发执行
        if(this.queue.length <= this.queueThreshold){
            this.consume();
            return
        }
        // 队列满
        if(this.queue.length > this.max){
            console.warn("tl-queue out of size : ",this.queue.length)
            return
        }

        console.warn("tl-queue push : ",this.queue.length)
        this.queue.push(data)
    }

    /**
     * 拉数据
     */
    consume(){
        this.consumerFunc(this.queue.shift(), this.options);
    }

    /**
     * 销毁任务
     */
    destroy() {
        this.queue = [];
        clearInterval(this.queueId);
    }
}


module.exports = {
    tlQueue
}