/**
 * type : 0~5000 归属 Mouse 鼠标
 * 
 * type : 0~1000 归属 left 鼠标左键
 * type : 1001~2000 归属 right 鼠标右键
 * type : 2001~3000 归属 middle 鼠标滚轮
 */
const Mouse = {
    left : {
        name : "left",
        zname : "鼠标左键",
        types : {
            click : 0, //单击
            double : 1, //双击
            move : 2 //拖动
        }
    },
    right : {
        name : "right",
        zname : "鼠标右键",
        types : {
            click : 1001, //单击
            double : 1002, //双击
            move : 1003 //拖动
        }
    },
    middle : {
        name : "middle",
        zname : "鼠标滚轮",
        types : {
            click : 2001, //单击
            double : 2002, //双击
            move : 2003 //拖动
        }
    }
}

module.exports = Mouse;