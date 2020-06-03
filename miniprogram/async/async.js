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
    });

  })
}
