var url = getApp().globalData.server_url;
var common = require("../../../utils/util.js");
Page({
  data: {
    height: 0,
    images: [],
    host: url + "/static/images/school_scenery/",
    has_next_page: true,
    cur_page: 0
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.setNavigationBarTitle({
      title: '校园风光',
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      },
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: url + '/school_scenery?page=' + (that.data.cur_page + 1).toString(),
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.has_next_page) {
          that.setData({ images: res.data.data, has_next_page: true, cur_page: that.data.cur_page + 1 });
          return;
        }
        that.setData({ images: res.data.data, has_next_page: false });
      }
    })
  },
  prereview: function (e) {
    var images = this.data.images;
    var preview_images = [];
    for (var i = 0; i < images.length; i++) {
      preview_images.push(url + "/static/images/school_scenery/" + images[i].url);
    }
    wx.previewImage({
      urls: preview_images,
      current: e.currentTarget.dataset.imgUrl
    })
  },
  scrolltolower: function () {
    var that = this;
    if (that.data.has_next_page) {
      wx.showNavigationBarLoading();
      wx.request({
        url: url + '/school_scenery?page=' + (that.data.cur_page + 1).toString(),
        success: function (res) {
          if (res.data.has_next_page) {
            that.setData({ images: that.data.images.concat(res.data.data), cur_page: that.data.cur_page + 1 });
            wx.hideNavigationBarLoading();
            return;
          }
          that.setData({ images: that.data.images.concat(res.data.data), has_next_page: false });
          wx.hideNavigationBarLoading();
        }, fail: function () {
          common.showMsg("出错啦");
          wx.hideNavigationBarLoading();
        }
      })
    } else {
      common.showMsg("没有啦")
    }
  }
})