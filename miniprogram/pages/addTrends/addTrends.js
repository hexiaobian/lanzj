import {
  uploadFile
} from '../../async/async.js'
let app = getApp()
const db = wx.cloud.database()
const records = db.collection('records')

function formatDate() {
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var day = now.getDate()
  year = year < 10 ? '0' + year : year
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  let dateObj = {
    year,
    month,
    day
  }
  return dateObj
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
    VideoPath: '',
    location: "选择位置",
    isChoose: false,
    cColor: "#666",
    myShare: '',
    isMuted: true
  },
  //发布动态时的内容函数
  getInput(e) {
    this.setData({
      myShare: e.detail.value
    })
  },
  //上传图片函数
  prePics: function() {
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
            PicPaths,
            myVideo: true
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
  //上传视频函数
  preVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
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
          myVideo: true,
          myPics: true
        })
        wx.hideLoading()
      }
    })
  },
  //全屏预览视频函数
  videoFullScreen() {
    let ctx = wx.createVideoContext("myVideo", this)
    if (this.data.isMuted == true) {
      ctx.requestFullScreen()
      this.setData({
        isMuted: false
      })
      ctx.play()
    } else {
      ctx.exitFullScreen()
      this.setData({
        isMuted: true
      })
      ctx.seek(0)
      ctx.pause()
    }
  },
  //全屏预览图片函数
  preImage(e) {
    wx.previewImage({
      current: this.data.PicPaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.PicPaths // 需要预览的图片http链接列表
    })
  },
  //放弃发布某些图片或视频函数
  close(e) {
    console.log(e)
    if (e.currentTarget.dataset.num == 1) {
      let VideoPath = ''
      this.setData({
        VideoPath,
        bVideo: true,
        myVideo: false,
        myPics: false
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
      if (this.data.PicPaths.length == 0) {
        this.setData({
          myPics: false,
          myVideo: false
        })
      }
    }
  },
  //获取定位函数
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
  //上传动态函数
  async upload() {
    if (this.data.myShare == '' && this.data.PicPaths.length == 0 && this.data.VideoPath == '') {
      wx.showToast({
        title: '未发布内容！'
      })
      return false
    } else {
      let cloudPath = ''
      let cloudPaths = []
      let filePaths = []
      if (this.data.VideoPath == '' && this.data.PicPaths.length == 0) {} else if (this.data.PicPaths.length == 0) {
        filePaths = [this.data.VideoPath]
        console.log(filePaths)
        cloudPath = Math.floor(Math.random() * 1000000) + filePaths[0].match(/\.[^.]+?$/)[0]
        cloudPaths.push(cloudPath)
      } else {
        filePaths = this.data.PicPaths
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
          res => {
            console.log('aaa' + res)
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
  }
})