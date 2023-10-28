//app.js
App({
  onLaunch: async function () {

  },
  globalData: {
    userInfo: null,  //用户信息
    baseUrl: "http://localhost:9092",  //访问路径
    openId: '', //用户唯一标识
    loginState: false, //用户登录状态
    token: '', //用户登录返回的token
  }
})