let app = getApp()
const db = wx.cloud.database()
const records = db.collection('records')
Page({
  data: {
    recordsList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  navToAdd() {
    wx.navigateTo({
      url: '/pages/addTrends/addTrends'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.openid == null) {
      wx.switchTab({
        url: '/pages/my/my',
      })
    } else {
      let userInfo = app.globalData.userInfo
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    }
    records.orderBy('addDate','desc').get({
      success: res => {
        this.setData({
          recordsList: res.data,
        })
          let now = +new Date()
          let durTime = ''
          let List = this.data.recordsList
          for (let i = 0; i < List.length; i++) {
            time = now - List[i].addDate
            if (time < 1000 * 60) {
              durTime = '一分钟前'
            } else if (time < 1000 * 60 * 60) {
              durTime = Math.ceil(time / (60 * 1000)) + '分钟前'
            } else if (time < 1000 * 60 * 60 * 24) {
              durTime = Math.ceil(time / (1000 * 60 * 60)) + '小时前'
            } else if (time < 1000 * 60 * 60 * 24 * 30) {
              durTime = Math.ceil(time / (1000 * 60 * 60 * 24)) + '天前'
            } else if (time < 1000 * 60 * 60 * 24 * 30 * 12) {
              durTime = Math.ceil(time / (1000 * 60 * 60 * 24 * 30)) + '月前'
            } else {
              durTime = Math.ceil(time / (1000 * 60 * 60 * 24 * 365)) + '年前'
            }
            List[i].durTime = durTime
          }
          this.setData({
            List
          })
        console.log(List)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})