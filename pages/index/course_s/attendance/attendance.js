var common = require("../../../../utils/util.js");
Page({
  data: {
    attendance_type: ['随机', '全点'],
    absence_type: ['请假', '迟到', '缺勤',],
    records: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    common.get_request({
      url: '/student/load_attendance_records?mode=' + options.mode + "&esc_id=" + options.esc_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ records: res.data });
        wx.hideLoading()
      }
    })
  },
})