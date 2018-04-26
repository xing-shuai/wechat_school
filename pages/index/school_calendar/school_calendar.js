var common = require("../../../utils/util.js");
Page({
  data: {
    calendars: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    common.get_request({
      url: '/get_school_calendar',
      success: function (res) {
        that.setData({ calendars: res.data.data });
      }
    })
  },
  preview: function (e) {
    wx.previewImage({
      urls: this.data.calendars[e.currentTarget.dataset.index].images
    })
  }
})