let row = 10;
let page = 0;
Page({

  /**
   * 生命周期函数--监听页面加载(读取数据库信息)
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      place: options.place
    })
    const db = wx.cloud.database();
    const ports = db.collection(this.data.id);
    console.log(ports)
    db.collection(this.data.id).count().then(res => {
      this.setData({
        sumCount: res.total
      })
    })
    ports.limit(row).get().then(res => {
      this.setData({
        portsList: res.data,
      })
      console.log(this.data.portsList)
    })
  },
  //得到当天天气情况
  getWeather() {
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now',
      data: {
        location: this.data.place,
        key: 'b58099a2a06548aabcbec973015be6dd'
      },
      success: res => {
        this.setData({
          placeInfo: res.data.HeWeather6[0].now
        })
        console.log(res.data.HeWeather6[0].now)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getWeather()
  },
  //获取某地三天内的天气情况
  getDetailWeather(e) {
    wx.navigateTo({
      url: '../../pages/weather/weather?location=' + e.currentTarget.dataset.place + '&nowWeather=' + this.data.placeInfo.cond_txt + '&nowWeatherTmp=' + this.data.placeInfo.tmp
    })
  },
  //获取某景点详情
  getViewDetail(e) {
    wx.navigateTo({
      url: "../../pages/viewDetail/viewDetail?id=" + e.currentTarget.dataset.id + '&link=' + this.data.id
    })
  },
  /**
   * 页面上拉触底事件的处理函数(触底读取剩余数据库内容)
   */
  onReachBottom: function() {
    page++
    if (this.data.portsList.length == this.data.sumCount) {
      wx.showToast({
        title: '推荐到底了哦~',
      })
      return false
    } else {
      const db = wx.cloud.database();
      const ports = db.collection(this.data.id);
      ports.skip(row * page).limit(row).get({
        success: res => {
          let old_data = this.data.portsList
          let new_data = res.data
          this.setData({
            portsList: [...old_data, ...new_data]
          })
          console.log(this.data.portsList.length)
        }
      })
    }
  }
})