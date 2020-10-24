const db = wx.cloud.database()
const records = db.collection('records')
const myself = db.collection('myself')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickPer: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },
  //删除动态函数
  deleteItem(e) {
    wx.showModal({
      title: '删除动态',
      content: '确定删除动态吗？',
      success: res => {
        if (res.confirm) {
          let deleteIndex = e.currentTarget.dataset.index
          records.doc(deleteIndex).remove().then(res => {
            wx.showToast({
              title: '删除成功',
            })
          }).then(() => {
            wx.switchTab({
              url: '/pages/my/my',
            })
          })
        } else {
          return false
        }
      }
    })
  },
  //显示动态详情函数
  showMine() {
    records.where({
      _id: this.data.id
    }).get().then(res => {
      this.setData({
        detail: res.data,
        clickPers: res.data[0].perList
      })
    }).then(() => {
      let avatarUrls = []
      for (let i = 0; i < this.data.clickPers.length; i++) {
        myself.where({
          nickName: this.data.clickPers[i]
        }).get().then(res => {
          avatarUrls.push(res.data[0].avatarUrl)
          this.setData({
            avatarUrls
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.showMine()
  }
})