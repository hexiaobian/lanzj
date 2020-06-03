
let app = getApp()
const db = wx.cloud.database()
const records = db.collection('records')

function formatDate() {
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var day = now.getDate()
  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day
  return year + '-' + month + '-' + day
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bVideo: true,
    myVideo: false,
    myPics: false,
    PicPaths: [],
    VideoPath:'',
    location: "选择位置",
    isChoose: false,
    cColor: "#666",
    myShare: ''
  },
  getInput(e) {
    this.setData({
      myShare: e.detail.value
    })
  },
  prePics: function () {
    if (this.data.PicPaths.length < 9) {
      //选择图片
      wx.chooseImage({
        count: 9 - this.data.PicPaths.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          //loading提示框表示正在传图片
          wx.showLoading({
            title: '上传中',
          })

          //获取图片临时文件
          const PicPath = res.tempFilePaths
          const PicPaths = [...this.data.PicPaths, ...PicPath]
          this.setData({
            PicPaths
          })
          wx.hideLoading()
          if (this.data.PicPaths.length == 9) {
            this.setData({
              myPics: true
            })
          }
        }
      })
    }
  },
  preVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      success: res => {
        console.log(res)
        wx.showLoading({
          title: '压缩中',
        })
        const VideoPath = res.tempFilePath
        this.setData({
          VideoPath,
          bVideo: false,
          myVideo: true
        })
        wx.hideLoading()
      }
    })
  },
  videoFullScreen() {
    let ctx = wx.createVideoContext("myVideo", this)
    ctx.requestFullScreen()
  },
  fullScreenChange(e) {
    let ctx = wx.createVideoContext("myVideo", this)
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏 
    if (!fullScreen) { //退出全屏
      ctx.seek(0)
      ctx.pause()
    }
  },
  preImage(e) {
    wx.previewImage({
      current: this.data.PicPaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.PicPaths // 需要预览的图片http链接列表
    })
  },
  close(e) {
    console.log(e)
    if (e.currentTarget.dataset.num == 1) {
      let VideoPath = ''
      this.setData({
        VideoPath,
        bVideo: true,
        myVideo: false
      })
    }
    if (e.currentTarget.dataset.num == 2) {
      this.data.PicPaths.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        PicPaths: this.data.PicPaths
      })
      if (this.data.PicPaths.length < 9) {
        this.setData({
          myPics: false
        })
      }
    }
  },
  getLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res.name,
          cColor: "#33ccff"
        })
      },
    })
  },
 async upload() {  
   console.log(this.data.myShare)
   console.log(this.data.PicPaths)
   console.log(this.data.VideoPath == '')
   if (this.data.myShare == '' && this.data.PicPaths.length == 0 && this.data.VideoPath==''){
     wx.showToast({
       title: '未发布内容！'
     })
     return false
   }else{
     let cloudPath = ''
     let cloudPaths = []
     let filePaths = []
     if (this.data.VideoPath == '' && this.data.PicPaths.length == 0) {}
      else if (this.data.PicPaths.length ==0) {
       filePaths = this.data.VideoPath
       let VideoPath = Math.floor(Math.random() * 1000000) + filePaths.match(/\.[^.]+?$/)[0]
     } else if (this.data.VideoPath == ''){
       filePaths = this.data.PicPaths
       for (let i = 0; i < filePaths.length; i++) {
         cloudPath = Math.floor(Math.random() * 1000000) + filePaths[i].match(/\.[^.]+?$/)[0]
         cloudPaths.push(cloudPath)
       }
     }
       else {
       filePaths = [...this.data.PicPaths, this.data.VideoPath]
       for (let i = 0; i < filePaths.length; i++) {
         cloudPath = Math.floor(Math.random() * 1000000) + filePaths[i].match(/\.[^.]+?$/)[0]
         cloudPaths.push(cloudPath)
       }
     }
     let picIDs = []
     let videoID = ''
     for (let j = 0; j < cloudPaths.length; j++) {
       await uploadFile({
         cloudPath: cloudPaths[j],
         filePath: filePaths[j]
       }).then(
         (res) => {
           let reg = /\.mp4$/
           if (reg.test(res.fileID)) {
             videoID = res.fileID
           } else {
             picIDs.push(res.fileID)
           }
         }
       )
     }
     wx.showToast({
       title: '发布成功',
       duration: 3000
     })
     let userInfo = app.globalData.userInfo
     console.log(userInfo)
     let today = formatDate()
     let todaySeconds = +new Date()
     //获取当天日期

     records.add({
       data: {
         openid: app.globalData.openid,
         theWord: this.data.myShare,
         picUrls: picIDs,
         videoUrl: videoID,
         avatarUrl: userInfo.avatarUrl,
         nickName: userInfo.nickName,
         location: this.data.location == '选择位置' ? '' : this.data.location,
         addDay: today,
         addDate: todaySeconds
       },
       success: res => {
         wx.switchTab({
           url: '/pages/trends/trends'
         })
       },
       fail: e => {
         console.log(e)
       }
     })
   }
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


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