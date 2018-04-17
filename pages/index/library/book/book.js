var url = getApp().globalData.server_url;
var common = require("../../../../utils/util.js")
Page({
  data: {
    book_info: [],
    book_img: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '图书详情',
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: url + '/library/get_book_detail?book_id=' + options.book_id,
      success: function (res) {
        var t = res.data.book_img.split('/');
        that.setData({
          book_info: res.data.info,
          book_img: url + '/library/get_book_img/' + t[t.length - 1],
          borrow_info: res.data.borrow_info,
          table:{
            'index': '索书号',
            'tiao_ma': '条码号',
            'xiao_qu': '校区—馆藏地',
            'status': '书刊状态'
          }
        });
        wx.hideNavigationBarLoading();
      },
      fail: function () {
        common.showMsg("出错啦");
        wx.hideNavigationBarLoading();
      }
    })
  },
  preview_img: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src]
    })
  }
})