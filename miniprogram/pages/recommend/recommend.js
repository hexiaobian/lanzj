const db = wx.cloud.database();
const zj = db.collection('zhanjiang');
let page = 0;
let row = 10;
Page({
  /**
   * 生命周期函数--监听页面显示
   */
  //展示湛江景点情况
  onShow: function() {
    zj.limit(row).get().then(res => {
      this.setData({
        portsList: res.data,
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数(下拉读取数据库信息)
   */
  onReachBottom: function() {
    page++
    zj.skip(page * row).limit(row).get().then(res => {
      let old_data = this.data.portsList
      let new_data = res.data
      this.setData({
        portsList: [...old_data, ...new_data]
      })
    })
  },
  //得到某个景点详情函数
  getViewDetail(e) {
    wx.navigateTo({
      url: "../../pages/viewDetail/viewDetail?id=" + e.currentTarget.dataset.id + '&link=zhanjiang'
    })
  }
})