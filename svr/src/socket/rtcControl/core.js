const robot = require("robotjs");
const types = require("./types");
const capture = require("./capture")
const utils = require("../../../src/utils/utils");

let controlMetaData = {
    windowWidth : 0, //屏幕宽度
    windowHeight : 0, //屏幕高度
}

/**
 * 控制器初始化
 * @returns 
 */
async function controlInit(){
    //屏幕大小
    let { width, height } = robot.getScreenSize();
    controlMetaData.windowWidth = width;
    controlMetaData.windowHeight = height;
}
controlInit();


/**
 * 根据传入的操作执行控制 
 * @param {*} opArr 
 */
async function controlOp(opArr){

    utils.tlConsole("运行远程控制操作指令数量 : ",opArr.length)

    opArr.forEach( op => {
        let { type, data } = op;
        //指针移动事件
        if(types.isPointType(type)){

            let { x , y, s} = data;
            x = parseInt(x);
            y = parseInt(y);
            s = s >= 0 ? s : 0;

            if(x >= 0 && y >= 0){
                if(x <= controlMetaData.windowWidth && y <= controlMetaData.windowHeight){
                    robot.moveMouseSmooth(x, y, 0);
                }
            }
        }

        //左键单击
        if(types.isMouseLeftClickType(type)){
            robot.mouseClick("left", false);
        }
        //左键双击
        if(types.isMouseLeftDoubleType(type)){
            robot.mouseClick("left", true);
        }
        //右键单击
        if(types.isMouseRightClickType(type)){
            robot.mouseClick("right", false);
        }
        //右键双击
        if(types.isMouseRightDoubleType(type)){
            robot.mouseClick("right", true);
        }
        //滚轮单击
        if(types.isMouseMiddleClickType(type)){
            robot.mouseClick("middle", false);
        }
        //滚轮双击
        if(types.isMouseMiddleDoubleType(type)){
            robot.mouseClick("middle", true);
        }

        //键盘点击事件
        if(types.isKeyboardType(type)){
            
        }
    })
}

module.exports = {
    controlOp
}
