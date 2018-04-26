var url = getApp().globalData.server_url;
var common = require('../../../../utils/util.js')

Page({
  data: {
    attendance_records: [],
    e_course_id: '',
    has_next_page: true,
    cur_page: 0,
    height: 0
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      },
    })
    wx.setNavigationBarTitle({
      title: '考勤记录',
    });
    this.setData({ e_course_id: options.e_course_id });
  },
  loadList: function () {
    var that = this;
    wx.request({
      url: url + '/teacher/get_attence_record?e_course_id=' + that.data.e_course_id + "&page=" + (that.data.cur_page + 1).toString(),
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.has_next_page) {
          that.setData({ attendance_records: that.data.attendance_records.concat(res.data.data), has_next_page: true, cur_page: that.data.cur_page + 1 });
          return;
        }
        that.setData({ attendance_records: that.data.attendance_records.concat(res.data.data), has_next_page: false, cur_page: that.data.cur_page });
      },
      fail: function () {
        wx.hideNavigationBarLoading();
        common.showMsg('出错啦');
      }
    })
  },
  onShow: function () {
    wx.showNavigationBarLoading()
    this.setData({
      attendance_records: [],
      has_next_page: true,
      cur_page: 0
    })
    this.loadList();
  },
  scrolltolower: function () {
    if (this.data.has_next_page) {
      wx.showNavigationBarLoading()
      this.loadList();
    } else {
      common.showMsg("没有啦")
    }
  },
  attendancing: function () {
    wx.navigateTo({
      url: 'attendancing/attendancing?e_course_id=' + this.data.e_course_id
    });
  }
})