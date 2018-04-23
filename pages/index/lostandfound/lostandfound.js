var common = require("../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    height: 0,
    losts: [],
    host: url + '/lostandfound/images/',
    has_next_page: true,
    cur_page: 0,
    op_button: false
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      },
    })
    common.get_request({
      url: '/lostandfound/load_list?page=' + (that.data.cur_page + 1).toString(),
      success: function (res) {
        that.setData({ losts: res.data.data, has_next_page: res.data.has_next_page, cur_page: that.data.cur_page + 1 });
      }
    });
  },
  scrolltolower: function () {
    var that = this;
    if (that.data.has_next_page) {
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/lostandfound/load_list?page=' + (that.data.cur_page + 1).toString(),
        success: function (res) {
          if (res.data.has_next_page) {
            that.setData({ losts: that.data.losts.concat(res.data.data), cur_page: that.data.cur_page + 1 });
            wx.hideNavigationBarLoading();
            return;
          }
          that.setData({ losts: that.data.losts.concat(res.data.data), has_next_page: false });
          wx.hideNavigationBarLoading();
        }
      })
    } else {
      common.showMsg("没有啦")
    }
  },
  preview_image: function (e) {
    wx.previewImage({
      urls: [this.data.host + e.currentTarget.dataset.url]
    })
  },
  op: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    if (!this.data.op_button) {
      this.setData({
        ani_mylost: animation.bottom(185).step().export(),
        ani_addlost: animation.bottom(115).step().export(),
        op_button: true
      })
    } else {
      this.setData({
        ani_mylost: animation.bottom(45).step().export(),
        ani_addlost: animation.bottom(45).step().export(),
        op_button: false
      })
    }
  },
  add_lost: function () {
    wx.navigateTo({
      url: 'lostandfoundop/lostandfoundop'
    })
  },
  mylost: function () {
    wx.navigateTo({
      url: 'mylost/mylost'
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      has_next_page: true,
      cur_page: 0
    })
    common.get_request({
      url: '/lostandfound/load_list?page=' + (that.data.cur_page + 1).toString(),
      success: function (res) {
        that.setData({ losts: res.data.data, has_next_page: res.data.has_next_page, cur_page: that.data.cur_page + 1 });
        wx.stopPullDownRefresh();
      }
    });
  }
})