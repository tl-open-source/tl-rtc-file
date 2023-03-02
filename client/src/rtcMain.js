import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import './assets/css/main.css'
import './assets/css/icon.css'
import { useFetch } from '@vueuse/core'
import { rtcComm } from './rtcGlobal';
import socketIO from 'socket.io-client'


const app = createApp(App)

useFetch("/api/comm/initData", {
	afterFetch(ctx) {
		let initData = JSON.parse(ctx.data)
        console.log("initData : ", initData)

        let notUseRelay = window.localStorage.getItem("tl-rtc-file-not-use-relay") || false;
        notUseRelay = notUseRelay && notUseRelay === 'true'
        if(notUseRelay){ // 剔除中继服务
            initData.rtcConfig.iceServers = [initData.rtcConfig.iceServers[0]]
        }

        const socket = socketIO( initData.wsHost, {} )
        console.log("socket in fetch : ",socket)

        rtcComm.rtcConfig = initData.rtcConfig
        rtcComm.rtcOption = initData.rtcOption
        rtcComm.useTurn = !notUseRelay
        rtcComm.socket = socket

        app.use(router)

        app.use(Antd)

        app.mount('#app')

	}
})

