var common = require("../../../utils/util.js");
Page({
  data: {
    winHeight: 0,
    currentTab: 0,
    user_head_host: getApp().globalData.server_url + "/user_head/",
    jiaoxue_unread_notification_loaded: 0,
    jiaoxue_unread_notification_data: [],
    system_message_loaded: 0,
    system_message_has_next_page: true,
    system_message_cur_page: 0,
    system_message_data: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },
  //显示时每次刷新未读消息
  onShow: function () {
    this.loadList(0);
  },
  //tab切换时加载列表数据
  loadList: function (currentTab) {
    var that = this;
    if (currentTab == 0) {//教学类通知
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/get_unread_message',
        header: {
          'cookie': wx.getStorageSync("sessionid")
        },
        success: function (res) {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          that.setData({ jiaoxue_unread_notification_data: res.data.data });
        }
      })
      return;
    }
    //系统通知
    if (this.data.system_message_loaded == 0) {
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/get_system_message?page=' + (that.data.system_message_cur_page + 1).toString(),
        success: function (res) {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          that.setData({ system_message_data: that.data.system_message_data.concat(res.data.data), system_message_has_next_page: res.data.has_next_page, system_message_cur_page: that.data.system_message_cur_page + 1, system_message_loaded: 1 });
        }
      })
    }
  },
  //tab切换
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.loadList(e.detail.current);
  },
  //tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({ currentTab: e.target.dataset.current });
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    switch (this.data.currentTab) {
      case 0: {
        this.setData({
          jiaoxue_unread_notification_data: []
        })
        break;
      }
      case 1: {
        this.setData({
          system_message_loaded: 0,
          system_message_has_next_page: true,
          system_message_cur_page: 0,
          system_message_data: []
        })
        break;
      }
    }
    this.loadList(this.data.currentTab);
  },
  //滑到底部加载下一页
  scrolltolower: function (e) {
    var that = this;
    if (that.data.system_message_has_next_page) {
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/get_system_message?page=' + (that.data.system_message_cur_page + 1).toString(),
        header: {
          'cookie': wx.getStorageSync("sessionid")
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          that.setData({ system_message_data: that.data.system_message_data.concat(res.data.data), system_message_has_next_page: res.data.has_next_page, system_message_cur_page: that.data.system_message_cur_page + 1 });
        }
      })
    }
  },
  //查看动态评论详情
  view_comment: function (e) {
    common.get_request({
      url: '/dynamic/check_dynamic_comment?comment_id=' + e.currentTarget.dataset.comment_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.navigateTo({
          url: '../dynamic/dynamic_detail/dynamic_detail?id=' + e.currentTarget.dataset.dynamic_id + "&dynamic_type=" + e.currentTarget.dataset.dynamic_type,
        });
      }
    });
  },
  //查看课程通知详情
  view_course_notification: function (e) {
    common.get_request({
      url: '/student/check_course_notification?check_id=' + e.currentTarget.dataset.notification_check_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.navigateTo({
          url: '../../index/course_t/notification/notiop/notiop?mode=0&noti_id=' + e.currentTarget.dataset.notification_id,
        });
      }
    });
  }
})