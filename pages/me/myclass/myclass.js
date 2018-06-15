var common = require("../../../utils/util.js");
Page({
  data: {
    class_member_head_scale: 0,
    class_info: {},
    host_url: getApp().globalData.server_url + '/user_head/'
  },
  onLoad: function(options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          class_member_head_scale: (res.windowWidth - 60) / 6
        });
      }
    });
    wx.showNavigationBarLoading();
    common.get_request({
      url: '/student/get_class_info',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function(res) {
        wx.hideNavigationBarLoading();
        that.setData({
          class_info: res.data.class
        });
      }
    })
  },
  student_info: function(e) {
    wx.navigateTo({
      url: '../myinfo/myinfo?user_number=' + e.currentTarget.dataset.number
    })
  }
})