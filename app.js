//app.js
var common = require('/utils/util.js')

App({
  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (code) {
        if (code.code) {
          wx.request({
            url: that.globalData.server_url + '/check_user',
            method: 'POST',
            data: {
              code: code.code
            },
            success: function (res) {
              wx.setStorageSync("sessionid", res.header["Set-Cookie"])
              var code = res.data.code;
              if (code == '1') {//已绑定
                that.globalData.user_type = res.data.user_type
              } else if (code == '0') {//未绑定
                wx.navigateTo({
                  url: '/pages/bind/bind',
                })
              } else {//验证失败
                common.showMsg(res.data.msg)
              }
            },
            fail: function () {
              common.showMsg('连接服务器失败')
            }
          })
        }
      },
      fail: function () {
        common.showMsg('登录失败')
      }
    })
  },
  globalData: {
    openid: null,
    user_type: 's',
    // server_url: 'http://112.74.58.209:8081',
    server_url: 'http://192.168.1.103:5000'
  }
})