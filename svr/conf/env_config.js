const inject_env_config = (conf) => {
    Object.keys(process.env).filter(key => /^(WS(S)?_|API_|WEBRTC_).+/.test(key)).map(key => {
        let data = process.env[key]
        if (key.endsWith('_PORT')) {
            data = parseInt(data)
        }
        let curr = conf;
        const paths = key.split('_').map(p => p.toLowerCase())
        const last = paths.pop()
        for (const path of paths) {
            curr = curr[path]
        }
        if (curr) {
            console.log(`config ${paths.join('.')}.${last} to ${data}`);
            curr[last] = data
        }
    })
    return conf
}

module.exports = {
    inject_env_config
}
