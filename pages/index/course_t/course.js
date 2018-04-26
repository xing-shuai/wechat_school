var common = require('../../../utils/util.js');

Page({
  data: {
    colors: ['#FFA500', '#409DEA', '#F46665', '#9563B2', '#04C576', '#02497F', '#7A9CB5'],
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
  notification: function (e) {
    wx.navigateTo({
      url: 'notification/notification?e_course_id=' + e.currentTarget.dataset.e_course_id
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    common.get_request({
      url: '/teacher/get_courses',
      // header: {
      //   'cookie': wx.getStorageSync("sessionid")
      // },
      success: function (res) {
        that.setData({ courses: res.data });
        wx.stopPullDownRefresh();
      }
    });
  }
})