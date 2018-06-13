var common = require('../../../utils/util.js');

Page({
  data: {
    colors: [['#FFA500', '#FF9500'], ['#409DEA', '#408DEA'], ['#F46665', '#F45665'], ['#9563B2', '#9553B2'], ['#04C576', '#04B576'], ['#02497F', '02397F'], ['#7A9CB5', '7A8CB5']],
    courses: [],
    // animationData1: {},
    // animationData2: {},
    // button_show: false,
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.showLoading({
      title: '加载课程'
    });
    common.get_request({
      url: '/teacher/get_courses',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ courses: res.data });
        wx.hideLoading()
      }
    });
  },
  attendance: function (e) {
    wx.navigateTo({
      url: 'attendance/attendance?e_course_id=' + e.currentTarget.dataset.e_course_id
    })
  },
  dailygrade: function (e) {
    wx.navigateTo({
      url: 'dailygrade/dailygrade?e_course_id=' + e.currentTarget.dataset.e_course_id
    })
  },
  final_grade: function (e) {
    wx.navigateTo({
      url: 'final_grade/final_grade?e_course_id=' + e.currentTarget.dataset.e_course_id
    })
  },
  notification: function (e) {
    wx.navigateTo({
      url: 'notification/notification?e_course_id=' + e.currentTarget.dataset.e_course_id
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    common.get_request({
      url: '/teacher/get_courses',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ courses: res.data });
        wx.stopPullDownRefresh();
      }
    });
  }
})