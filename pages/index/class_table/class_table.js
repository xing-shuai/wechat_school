var app = getApp();
var url = app.globalData.server_url;
var common = require("../../../utils/util.js")
Page({
  data: {
    week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  onLoad: function (options) {
    common.set_navi_color();
    wx.setNavigationBarTitle({
      title: '课表'
    })
    wx.showLoading({
      title: '加载课表中',
    });
    var that = this;
    wx.request({
      url: url + (app.globalData.user_type == 's' ? '/student' : '/teacher') + '/get_class_table',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        var data = res.data;
        var len = data.length;
        var course = {}
        for (var i = 0; i < len; i++) {
          var des = data[i].course + data[i].teacher + data[i].class_room;
          course[data[i].class_time] = data[i].course + (app.globalData.user_type == 't' ? "" : "(" + data[i].teacher + ")") + " " + data[i].class_room;
          course['eci_' + data[i].class_time] = data[i].established_course_id;
          course["pad_" + data[i].class_time] = ((145 - parseInt(des.length / 3.8) * 17) / 2).toString() + "px";
        }
        that.setData(course);
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        common.showMsg("出错啦");
      }
    })
  }
})