const path = require("path");

function getBasePath(dir){
    return path.resolve(__dirname , dir);
}


const ROOT_PATH = getBasePath('../../../res');
const JS_PATH = getBasePath('../../../res/js');
const CSS_PATH = getBasePath('../../../res/css');


module.exports = {
    ROOT_PATH,
    JS_PATH,
    CSS_PATH
};