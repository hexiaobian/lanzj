Page({
  /**
   * 生命周期函数--监听页面加载(获取和风天气接口所需数据)
   */
  onLoad: function(options) {
    this.setData({
      location: options.location,
      nowWeather: options.nowWeather,
      nowWeatherTmp: options.nowWeatherTmp
    })
  },
  //获取近三天天气情况
  getDay() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    var day = now.getDate()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    let today = +new Date(year + '-' + month + '-' + day)
    let time = ''
    let startforecast = this.data.startforecast
    for (let i = 0; i < startforecast.length; i++) {
      let date = +new Date(startforecast[i].date)
      if (today == date) {
        time = '今天'
      } else if (date - today == 86400000) {
        time = '明天'
      } else {
        let week = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
        time = week[new Date(startforecast[i].date).getDay()]
      }
      startforecast[i].time = time
      this.setData({
        forecastWeather: startforecast
      })
    }
  },
  //调用和风天气API近三天的数据
  getWeather() {
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast',
      data: {
        location: this.data.location,
        key: 'b58099a2a06548aabcbec973015be6dd'
      },
      success: res => {
        this.setData({
          startforecast: res.data.HeWeather6[0].daily_forecast
        })
        this.getDay()
        console.log(this.data.forecastWeather)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getWeather()
  }
})