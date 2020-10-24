let app = getApp()
const db = wx.cloud.database()
const records = db.collection('records')
const myself = db.collection('myself')
import {
  callFunction
} from '../../async/async.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    userInfo: '',
    oldTrends: []
  },
  //获取动态详情页面跳转
  getDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取发布过的动态
  getHistory() {
    records.orderBy('addDate', 'desc').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      let oldTrends = res.data
      this.setData({
        oldTrends
      })
    })
  },
  //获取用户信息
  async getUserInfo(e) {
    if (app.globalData.openid == null) {
      //如果是第一次登录则使用云函数获取用户openid 
      await callFunction({
        name: 'login'
      }).then(
        res => {
          app.globalData.openid = res.result.openid
        })
      this.getHistory()
      let userInfo = e.detail.userInfo
      let {
        avatarUrl,
        nickName
      } = e.detail.userInfo
      app.globalData.userInfo = e.detail.userInfo
      if (app.globalData.openid) {
        this.setData({
          isLogin: false,
          userInfo
        })
      }
      myself.where({
        _openid: app.globalData.openid
      }).get().then(res => {
        if (res.data.length != 0) {} else {
          myself.add({
            data: {
              avatarUrl,
              nickName
            }
          })
        }
      })
    }
  },
  onShow: function() {
    if (app.globalData.openid != null) {
      this.getHistory()
    }
  },
})