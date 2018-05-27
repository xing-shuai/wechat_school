var common = require("../../../utils/util.js");
Page({
  data: {
    winWidth: 0
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth - 40,
        });
      }
    });
  },
  submit_feedback: function (e) {
    var feedback = e.detail.value.content;
    if (feedback.trim() == "")
      return;
    wx.showLoading({
      title: '提交中...',
    })
    common.post_request({
      url: '/add_feedback',
      data: {
        'feedback': feedback
      },
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          common.showMsg('感谢您的反馈', 'success');
          wx.navigateBack();
        } else {
          common.showMsg('反馈提交失败');
        }
      }
    });
  }
})