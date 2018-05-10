var common = require('../../utils/util.js');
var url = getApp().globalData.server_url;
Page({
  data: {
    user_type: '',
    myinfo: {},
    host: url + "/user_head/"
  },
  load_info: function () {
    var that = this;
    that.setData({ user_type: getApp().globalData.user_type });
    common.get_request({
      url: '/get_user_info?mode=0',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ myinfo: res.data });
        wx.stopPullDownRefresh();
      }
    })
  },
  onLoad: function (options) {
    common.set_navi_color();
    this.load_info();
  },
  onPullDownRefresh: function () {
    this.load_info();
  }
})