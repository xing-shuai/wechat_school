var common = require("../../utils/util.js");
var app = getApp();
var url = app.globalData.server_url;
Page({
  data: {

  },
  onLoad: function (options) {
    common.set_navi_color();
  },
  formSubmit: function (e) {
    var form_value = e.detail.value;
    if (!form_value.number) {
      common.showMsg("请输入学号/工号");
      return;
    }
    wx.request({
      url: url + '/bind_user',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      data: form_value,
      success: function (res) {
        var msg = res.data.msg;
        if (res.data.code != '1') {
          common.showMsg(msg);
          return;
        }
        wx.setStorageSync("sessionid", res.header["Set-Cookie"])
        app.globalData.user_type = form_value.identity
        wx.showModal({
          title: '成功',
          content: msg,
          showCancel: false,
          confirmText: '回到首页',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        })
      },
      fail: function () {
        common.showMsg("请求异常");
      }
    })
  }
})