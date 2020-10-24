Page({
  /**
   * 生命周期函数--监听页面加载(获取景点详情)
   */
  onLoad: function(options) {
    const db = wx.cloud.database();
    const port = db.collection(options.link);
    port.doc(options.id).get().then(res => {
      this.setData({
        viewPort: res.data
      })
    })
  }
})