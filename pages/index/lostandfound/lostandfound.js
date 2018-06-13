var common = require("../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    height: 0,
    losts: [],
    host: url + '/lostandfound/images/',
    has_next_page: true,
    cur_page: 0,
    search_text: '',
    op_button: false,
    search_mode: false
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      },
    })
  },
  onShow: function () {
    this.onPullDownRefresh();
  },
  scrolltolower: function () {
    var that = this;
    if (that.data.has_next_page) {
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/lostandfound/load_list?page=' + (that.data.cur_page + 1).toString() + '&search_text=' + that.data.search_text,
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
    });
    this.op();
  },
  mylost: function () {
    wx.navigateTo({
      url: 'mylost/mylost'
    });
    this.op();
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      has_next_page: true,
      cur_page: 0
    })
    common.get_request({
      url: '/lostandfound/load_list?page=' + (that.data.cur_page + 1).toString() + '&search_text=' + that.data.search_text,
      success: function (res) {
        var data = res.data.data;
        for (var i = 0; i < data.length; i++) {
          data[i].add_time = common.moment(data[i].add_time);
        }
        that.setData({ losts: data, has_next_page: res.data.has_next_page, cur_page: that.data.cur_page + 1 });
        wx.stopPullDownRefresh();
      }
    });
  },
  make_phone_call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  search: function (e) {
    var value = e.detail.value;
    if (value.trim() == "" && !this.data.search_mode) {
      return;
    }
    this.setData({ search_text: value, search_mode: value.trim() == "" ? false : true });
    this.onPullDownRefresh();
  }
})