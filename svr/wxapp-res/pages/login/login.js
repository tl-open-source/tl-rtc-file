const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: ''
  },
  onShow: function(){
    wx.hideHomeButton()
  },
  /**
   * 页面加载
   */
  onLoad: function (option) {
    console.log("扫码");
    console.log(option);
    if (!!option.scene) {
      this.setData({
        scene: option.scene
      });
      this.setScanState('scan');
    }
  },
  copyDemo : function(){
    wx.setClipboardData({
      data: "https://im.iamtsm.cn",
      success() {
        wx.showToast({
          title: '演示体验地址已复制',
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  copyGithub : function(){
    wx.setClipboardData({
      data: "https://github.com/tl-open-source/tl-rtc-file",
      success() {
        wx.showToast({
          title: 'github开源地址已复制',
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  copyGitee : function(){
    wx.setClipboardData({
      data: "https://gitee.com/iamtsm/tl-rtc-file",
      success() {
        wx.showToast({
          title: 'gitee开源地址已复制',
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  //获取用户信息
  getUserProfile(info) {
    let that = this;
    wx.showLoading({
      title: '正在登录...',
    })
    // 执行登录操作
    let code = '';
    wx.login({
      success: (res) => {
        code = res.code;
      },
    });
    // 获取用户信息
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用户登录',
      success: (res) => {
        that.GetOpenId(res.rawData, code);
      },
      fail: () => {
        // 失败回调
        wx.hideLoading();
      }
    });
  },
  GetOpenId: function (userInfo, code) {
    console.log(userInfo)
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/api/login/wechat',
      data: {
        userInfo: JSON.parse(userInfo),
        code: code,
        scene: that.data.scene
      },
      dataType: "json",
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        if (!res.data.session_key) {
          wx.showToast({
            title: "登录失败，请尝试重新扫码登录",
            duration: 1000,
            icon: 'none',
            mask: true
          })
          wx.exitMiniProgram({
            success: (res)=>{
              console.log(res)
            }
          })
          return
        }
        app.globalData.openId = res.data.openid;
        app.globalData.token = res.data.token;
        app.globalData.userInfo = userInfo;
        app.globalData.loginState = true;
        that.setScanState('auth_succ');
      },
      fail: function () {
        console.log("失败")
        that.setScanState('auth_fail');
      }
    })
  },
  setScanState(state) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/api/login/scanState',
      data: {
        scene: that.data.scene,
        state: state,
        token : app.globalData.token
      },
      dataType: "json",
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 200) {
          wx.showToast({
            title: "登录失败，请尝试重新扫码登录",
            duration: 1000,
            icon: 'none',
            mask: true
          })
          wx.exitMiniProgram({
            success: (res)=>{
              console.log(res)
            }
          })
          return
        }

        if(state === 'auth_succ'){
          wx.showToast({
            title: "登录成功！",
            duration: 1000,
            icon: 'none',
            mask: true
          })
          // 在登录成功后跳转到 succ 页面
          wx.redirectTo({
            url: '/pages/succ/succ',
          })
        }
      },
      fail: function () {
        console.log("失败")
        wx.exitMiniProgram({
          success: (res)=>{
            console.log(res)
          }
        })
      }
    })
  }
})
