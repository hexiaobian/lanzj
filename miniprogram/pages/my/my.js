let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    userInfo: ''
  },

  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    let userInfo = e.detail.userInfo
    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo) {
      this.setData({
        isLogin: false,
        userInfo
      })
    }
    if (app.globalData.openid == null) {
      //如果是第一次登录则使用云函数获取用户openid 
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
          console.log(res.result.openid)
          app.globalData.openid = res.result.openid
        }
      })
    }

  },
})