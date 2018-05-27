var common = require("../../../../utils/util.js");
Page({
  data: {
    students: [],
    host_url: getApp().globalData.server_url + '/user_head/'
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    common.get_request({
      url: '/student/get_all_students?class_id=' + options.class_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({ students: res.data.students });
      }
    })
  },
})