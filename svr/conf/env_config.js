const path = require("path");
const dotEnv = require("dotenv");

/**
 * 从.env文件中加载环境变量
 * docker环境下，使用docker-compose.yml中指定的env逻辑，不使用主动加载的.env文件中的环境变量
 * 非docker环境下，使用.env文件中的环境变量
 */
const load_env_config = function(){
    if(process.env.tl_rtc_file_run_env === 'docker'){
        return
    }

    const pathsEnv = path.resolve(__dirname, "../../")
    if(process.env.tl_rtc_file_env_mode === 'http'){
        dotEnv.config({ path: `${pathsEnv}/http.env` })
        console.log(`load env config from .env file ${pathsEnv}/http.env`)
    }else{
        dotEnv.config({ path: `${pathsEnv}/https.env` })
        console.log(`load env config from .env file ${pathsEnv}/https.env`)
    }
}

/**
 * 从环境变量中注入配置
 * 1. 适配容器环境
 * 2. 数据格式转换
 * 3. 统一管理
 * defaultConfJson : conf/cfg.json
 * @param {object} defaultConfJson 配置对象
 */
const inject_env_config = function (defaultConfJson) {
    Object.keys(process.env).filter( key => key.startsWith("tl_rtc_file_") ).map(key => {
        let value = process.env[key]
        key = key.replace("tl_rtc_file_","")

        //端口相关的配置转换为数字
        if (key.endsWith('_port')) {
            value = parseInt(value)
        }

        //过期时间相关的配置转换为数字
        if(key.endsWith("_expire")){
            value = parseInt(value)
        }

        //开关相关的配置转换为boolean
        if (key.endsWith('_open')) {
            value = value === 'true'
        }

        //openai keys转换为数组
        if(key === 'openai_keys'){
            value = value.split(',')
        }

        //企业微信通知 keys转换为数组
        if(key === 'notify_qiwei_normal' || key === 'notify_qiwei_error'){
            value = value.split(',')
        }

        let curr = defaultConfJson;
        const paths = key.split('_');
        const last = paths.pop()
        for (const path of paths) {
            curr = curr[path]
        }
        if (curr) {
            // console.log(`config inject ${paths.join('.')}.${last} to ${value}`)
            curr[last] = value
        }
    })
    return defaultConfJson
}

module.exports = {
    inject_env_config,
    load_env_config
}
