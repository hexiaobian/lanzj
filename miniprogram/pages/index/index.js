// miniprogram/pages/index /index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre1: false,
    pre2: true,
    vColor: "#33ccff",
    vColor1: "#0099cc",
    vColor2: {},
    videoUrl: "cloud://yun-dgjkc.7975-yun-dgjkc-1301826717/preview.mp4"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  click(e){
    let ctx = wx.createVideoContext("preview", this)
    if(e.currentTarget.dataset.id=="1")
{
  ctx.stop()
  let pre1=false,
  pre2=true,
  vColor1='#0099cc',
  vColor2="vcolor"
  this.setData({
    pre1,
    pre2,
    vColor1,
    vColor2
  })
}else{
  ctx.play()
      let pre1 = true,
        pre2 = false,
        vColor2 = '#0099cc',
        vColor1 = "vcolor"
      this.setData({
        pre1,
        pre2,
        vColor1,
        vColor2
})}
},
// click(e){
//   let pre1 = true,
//     pre2 = false,
//     vColor2 = '#0099cc',
//     ctx = wx.createVideoContext('preview', this)
//   if(e.currentTarget.dataset.id!=""){
//     ctx.play()
//   }else{
//     ctx.stop()
//   }
//   this.setData({
//     pre1,
//     pre2,
//     vColor2,
//     vColor1: this.data.vColor
//     })
// },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})