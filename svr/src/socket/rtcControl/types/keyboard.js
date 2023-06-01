/**
 * type :  10001~50000 归属 Keyboard 键盘
 * 
 * type :  10001~20000 归属 Keyboard single 单个按键
 * type :  20001~50000 归属 Keyboard combo 组合按键
 */
const Keyboard = {
    single : {
        "A" : {
            name : "A",
            zname : "字母A键",
            type : 10001
        },
        "B" : {
            name : "B",
            zname : "字母B键",
            type : 10002
        },
        "C" : {
            name : "C",
            zname : "字母C键",
            type : 10003
        },
        "D" : {
            name : "D",
            zname : "字母D键",
            type : 10004
        },
        "E" : {
            name : "E",
            zname : "字母E键",
            type : 10005
        },
    },
    combo : {
        "shift+A" : {
            name : "shift+A",
            zname : "shift+A 组合键",
            type : 20001
        }
    }
}

module.exports = Keyboard