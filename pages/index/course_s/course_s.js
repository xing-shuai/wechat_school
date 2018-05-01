var common = require("../../../utils/util.js");
Page({
  data: {
    colors: ['#FFA500', '#409DEA', '#F46665', '#9563B2', '#04C576', '#02497F', '#7A9CB5'],
    courses: [],
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.showLoading({
      title: '加载课程'
    });
    common.get_request({
      url: '/student/get_courses',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ courses: res.data });
        wx.hideLoading()
      }
    });
  },
  dailygrade_records: function (e) {
    wx.navigateTo({
      url: 'attendance/attendance?mode=0&esc_id=' + e.currentTarget.dataset.e_course_id
    })
  }
})