var url = getApp().globalData.server_url;
Page({
  data: {
    title: '',
    content: '',
    time: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "详情"
    });
    this.setData({ title: options.title, time: options.time });
    wx.showLoading({
      title: '加载内容...'
    });
    var that = this;
    wx.request({
      url: url + '/web/get_news_content',
      data: {
        'contentUrl': options.contentUrl
      },
      method: 'POST',
      success: function (res) {
        that.setData({ content: res.data.content });
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: "none",
          duration: 1500
        });
      }
    })
  }
})