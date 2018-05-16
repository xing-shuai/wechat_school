var common = require('../../utils/util.js');
var url = getApp().globalData.server_url;
Page({
  data: {
    user_type: '',
    myinfo: {},
    host: url + "/user_head/",
    reload_notification: true,
    notification_show: false
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
  //检查是否有未读消息
  check_unread_message: function () {
    var that = this;
    common.get_request({
      url: '/check_unread_message',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ reload_notification: false });
        that.reset_red_dot(res.data.notification);
      }
    })
  },
  onPullDownRefresh: function () {
    this.load_info();
    this.check_unread_message();
  },
  onShow: function () {
    if (this.data.reload_notification)
      this.check_unread_message();
  },
  //跳转页面前设置跳转回此页面时重新检测未读消息
  navigate_notification: function () {
    this.setData({ reload_notification: true });
  },
  //重新设置消息红点状态
  reset_red_dot: function (notification) {
    try {
      if (notification.comment_count > 0 || notification.course_notification > 0) {
        wx.showTabBarRedDot({
          index: 2
        });
        this.setData({ notification_show: true })
      }
      else {
        wx.hideTabBarRedDot({
          index: 2
        });
        this.setData({ notification_show: false })
      }
    }
    catch (e) {
      wx.hideTabBarRedDot({
        index: 2
      });
      this.setData({ notification_show: false })
    }
  }
})