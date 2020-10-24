export const uploadFile = ({cloudPath,filePath}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const common = ({name,data }) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: name,
      data:data,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    }
    )
  })
 }

export const callFunction =({name})=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: name,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    }) 
  })
}
complete: res => {
  console.log(res)
  app.globalData.openid = res.result.openid
}

