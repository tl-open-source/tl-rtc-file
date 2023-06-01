/**
 * type : 0~5000 归属 Mouse 鼠标
 */
const Mouse = require("./types/mouse");
/**
 * type是否是鼠标事件
 * @param {*} type 
 */
function isMouseType(type){
    return type >= 0 && type <= 5000
}
/**
 * type是否是鼠标左键点击事件
 * @param {*} type 
 */
function isMouseLeftType(type){
    return isMouseType(type) && Object.values(Mouse.left.types).includes(type)
}
/**
 * type是否是鼠标右键点击事件
 * @param {*} type 
 */
function isMouseRightType(type){
    return isMouseType(type) && Object.values(Mouse.right.types).includes(type)
}
/**
 * type是否是鼠标滚轮事件
 * @param {*} type 
 */
function isMouseMiddleType(type){
    return isMouseType(type) && Object.values(Mouse.middle.types).includes(type)
}
/**
 * type是否是鼠标滚轮事件
 * @param {*} type 
 */
function isMouseMiddleType(type){
    return isMouseType(type) && Object.values(Mouse.middle.types).includes(type)
}
/**
 * type是否是鼠标单击事件
 * @param {*} type 
 */
function isMouseClickType(type){
    return isMouseType(type) && (
        Mouse.left.types.click === type ||
        Mouse.right.types.click === type ||
        Mouse.middle.types.click === type
    )
}
/**
 * type是否是鼠标双击事件
 * @param {*} type 
 */
function isMouseDoubleType(type){
    return isMouseType(type) && (
        Mouse.left.types.double === type ||
        Mouse.right.types.double === type ||
        Mouse.middle.types.double === type
    )
}
/**
 * type是否是鼠标移动事件
 * @param {*} type 
 */
function isMouseMoveType(type){
    return isMouseType(type) && (
        Mouse.left.types.move === type ||
        Mouse.right.types.move === type ||
        Mouse.middle.types.move === type
    )
}

/**
 * type是否是鼠标左键单击事件
 * @param {*} type 
 */
function isMouseLeftClickType(type){
    return isMouseLeftType(type) && Mouse.left.types.click === type;
}
/**
 * type是否是鼠标左键双击事件
 * @param {*} type 
 */
function isMouseLeftDoubleType(type){
    return isMouseLeftType(type) && Mouse.left.types.double === type;
}
/**
 * type是否是鼠标左键拖动事件
 * @param {*} type 
 */
function isMouseLeftMoveType(type){
    return isMouseLeftType(type) && Mouse.left.types.move === type;
}
/**
 * type是否是鼠标右键单击事件
 * @param {*} type 
 */
function isMouseRightClickType(type){
    return isMouseRightType(type) && Mouse.right.types.click === type
}
/**
 * type是否是鼠标右键双击事件
 * @param {*} type 
 */
function isMouseRightDoubleType(type){
    return isMouseRightType(type) && Mouse.right.types.double === type
}
/**
 * type是否是鼠标右键拖动事件
 * @param {*} type 
 */
function isMouseRightMoveType(type){
    return isMouseRightType(type) && Mouse.right.types.move === type
}
/**
 * type是否是鼠标滚轮单击事件
 * @param {*} type 
 */
function isMouseMiddleClickType(type){
    return isMouseMiddleType(type) && Mouse.middle.types.click === type
}
/**
 * type是否是鼠标滚轮双击事件
 * @param {*} type 
 */
function isMouseMiddleDoubleType(type){
    return isMouseMiddleType(type) && Mouse.middle.types.double === type
}
/**
 * type是否是鼠标滚轮滚动事件
 * @param {*} type 
 */
function isMouseMiddleMoveType(type){
    return isMouseMiddleType(type) && Mouse.middle.types.move === type
}



/**
 * type :  5001~10000 归属 Point 指针
 */
const Point = require("./types/point");
/**
 * type是否是指针移动事件
 * @param {*} type 
 */
function isPointType(type){
    return type >= 5001 && type <= 10000
}



/**
 * type :  10001~50000 归属 Keyboard 键盘
 */
const Keyboard = require("./types/keyboard");
/**
 * type是否键盘事件
 * @param {*} type 
 */
function isKeyboardType(type){
    return type >= 10001 && type <= 50000
}


module.exports = {
    isMouseType, 
    isMouseRightType, isMouseLeftType, isMouseMiddleType,
    isMouseClickType, isMouseDoubleType, isMouseMoveType,
    isMouseLeftClickType, isMouseLeftDoubleType, isMouseLeftMoveType,
    isMouseRightClickType, isMouseRightDoubleType, isMouseRightMoveType,
    isMouseMiddleClickType, isMouseMiddleDoubleType, isMouseMiddleMoveType,

    isPointType, 

    isKeyboardType
}