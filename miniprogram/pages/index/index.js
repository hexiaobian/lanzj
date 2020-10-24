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
  //首页如何展示(if条件成立则展示地图，否则播放了解湛江标签下的视频)
  click(e) {
    let ctx = wx.createVideoContext("preview", this)
    if (e.currentTarget.dataset.id == "1") {
      ctx.stop()
      let pre1 = false,
        pre2 = true,
        vColor1 = '#0099cc',
        vColor2 = "vcolor"
      this.setData({
        pre1,
        pre2,
        vColor1,
        vColor2
      })
    } else {
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
      })
    }
  }
})