var common = require("../../../utils/util.js");
Page({
  data: {
    title: '',
    content: '',
    time: ''
  },
  onLoad: function (options) {
    common.set_navi_color();
    wx.setNavigationBarTitle({
      title: "详情"
    });
    this.setData({ title: options.title, time: options.time });
    wx.showLoading({
      title: '加载内容...'
    });
    var that = this;
    common.post_request({
      url: '/dynamic/get_news_content',
      data: {
        'contentUrl': options.contentUrl
      },
      method: 'POST',
      success: function (res) {
        that.setData({ content: res.data.content });
        wx.hideLoading();
      }
    })
  }
})