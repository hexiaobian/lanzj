let app = getApp()
const db = wx.cloud.database()
const records = db.collection('records')
import {
  common
} from '../../async/async.js'

let perList = []
let avatarUrls = []
let content = []
Page({
  data: {
    recordsList: [],
    List: [],
    isMuted: true,
    isPlay: false,
    openid: '',
    perList: [],
    praise: '../../images/praise.png',
    isComment: true,
    value: '',
    quiz: '',
    isActive: '#ddd',
    pbottom: 0
  },
  //得到当前图片列表
  getImages(e) {
    this.setData({
      images: e.currentTarget.dataset.images
    })
  },
  //全屏预览视频
  videoFullScreen(e) {
    let id = e.currentTarget.dataset.id
    let playCtx = wx.createVideoContext(id, this)
    if (this.data.isMuted == true) {
      playCtx.requestFullScreen({
        direction: 0
      })
      this.setData({
        isMuted: false,
        isPlay: true
      })
    } else {
      playCtx.exitFullScreen()
      this.setData({
        isMuted: true,
        isPlay: false
      })
    }
  },
  //全屏预览图片
  preImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.image,
      urls: this.data.images
    })
  },
  //发布动态
  navToAdd() {
    wx.navigateTo({
      url: '/pages/addTrends/addTrends'
    })
  },
  //删除动态
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
          })
          this.getDatabase()
          this.onShow()
        } else {
          return false
        }
      }
    })
  },
  //获取数据库信息
  getDatabase() {
    records.orderBy('addDate', 'desc').get({
      success: res => {
        this.setData({
          recordsList: res.data,
        })
        let now = +new Date()
        let durTime = ''
        let time = 0
        let List = this.data.recordsList
        for (let i = 0; i < List.length; i++) {
          time = now - List[i].addDate
          if (time < 1000 * 60) {
            durTime = '1分钟前'
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
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示(展示动态信息)
   */
  onShow: function() {
    console.log(records)
    if (app.globalData.openid == null) {
      wx.switchTab({
        url: '/pages/my/my',
      })
    } else {
      this.setData({
        openid: app.globalData.openid
      })
      console.log(this.data.openid)
      let userInfo = app.globalData.userInfo
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    }
    this.getDatabase()
  },
  //实现点赞功能
  async editNum(e) {
    await records.doc(e.currentTarget.dataset.index).get().then(res => {
      let record = res.data
      console.log(record)
      this.setData({
        record
      })
    })
    if (!this.data.record.perList) {
      let perList = []
      perList.push(this.data.nickName)
      await common({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          _id: e.currentTarget.dataset.index,
          perList,
        }
      }).then((res) => {
        console.log(res)
        this.getDatabase()
      })
    } else if (this.data.record.perList.indexOf(this.data.nickName) == -1) {
      let perList = this.data.record.perList
      perList.push(this.data.nickName)
      await common({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          _id: e.currentTarget.dataset.index,
          perList,
        }
      }).then((res) => {
        console.log(res)
        this.getDatabase()
      })
    } else {
      let perList = this.data.record.perList
      console.log(perList)
      let index = perList.indexOf(this.data.nickName)
      console.log(index)
      perList.splice(index, 1)
      await common({
        // 云函数名称
        name: 'update',
        // 传给云函数的参数
        data: {
          _id: e.currentTarget.dataset.index,
          perList
        }
      }).then((res) => {
        console.log(res)
        this.getDatabase()
      })
    }
  },
  //显示评论框
  async getComment(e) {
    let that = this
    if (e.currentTarget.dataset.num == 1) {
      this.setData({
        imgCurIndex: e.currentTarget.dataset.index,
        quiz: ''
      })
      console.log(this.data.quiz)
      console.log(this.data.imgCurIndex)
    } else {
      if (this.data.nickName == e.currentTarget.dataset.nick) {
        let content = []
        await records.where({
          _id: e.currentTarget.dataset.index
        }).field({
          content: true
        }).get().then(res => {
          if (res.data[0].content) {
            content = res.data[0].content
          }
        })
        wx.showActionSheet({
          itemList: ['复制', '删除'],
          success(res) {
            if (res.tapIndex == 0) {
              wx.setClipboardData({
                data: content[e.currentTarget.dataset.i].content,
                success(res) {
                  wx.getClipboardData({
                    success(res) {
                      console.log(res.data) // data
                    }
                  })
                }
              })
            } else if (res.tapIndex == 1) {
              if (content.length == 1) {
                content = []
              }
              content.splice(e.currentTarget.dataset.i, 1)
              common({
                name: 'interact',
                data: {
                  _id: e.currentTarget.dataset.index,
                  content: content
                }
              }).then(() => {
                wx.showToast({
                  title: '删除成功！',
                })
              }).then(() => {
                that.onShow()
              })

            }
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      } else {
        that.setData({
          currentIndex: e.currentTarget.dataset.index,
          i: e.currentTarget.dataset.i,
          quiz: e.currentTarget.dataset.nick
        })
      }
    }
  },
  //获取input1组件的输入信息
  inputTextChange(e) {
    this.setData({
      comment: e.detail.value,
      isActive: '#33ccff'
    })
    if (e.detail.value == '') {
      this.setData({
        isActive: '#ccc'
      })
    }
  },
  //失去焦点事件
  blur() {
    wx.hideKeyboard()
    this.setData({
      value: '',
      imgCurIndex: "1111",
      i: "2222",
      currentIndex: '3333'
    })
  },
  //实现评论功能
  async sendMsgButton(e) {
    await records.where({
      _id: e.currentTarget.dataset.index
    }).field({
      content: true
    }).get().then(res => {
      console.log(res)
      if (res.data[0].content) {
        content = res.data[0].content
      }
    })
    if (this.data.comment == '') {
      wx.showToast({
        title: '您未发布内容！',
      })
      return
    }
    content.push({
      pos: this.data.nickName,
      pas: this.data.quiz,
      content: this.data.comment
    })
    console.log(content)
    await common({
      name: 'interact',
      data: {
        _id: e.currentTarget.dataset.index,
        content: content
      }
    }).then(res => {
      console.log('pppppp')
      this.setData({
        imgCurIndex: "1111",
        i: '2222',
        currentIndex: '3333'
      })
    }).then(() => {
      this.onShow()
    })
  }
})