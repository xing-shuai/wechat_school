var url = getApp().globalData.server_url;
var common = require("../../../utils/util.js")
Page({
  data: {
    scroll_height: '500px',
    search_type: 'title',
    search_type_index: 0,
    search_type_array: [ {
      'type': 'title',
      'text': '题名'
    }, {
      'type': 'keyword',
      'text': '关键字'
    },{
      'type': 'author',
      'text': '作者'
    }, {
      'type': 'callno',
      'text': '索引号'
    }, {
      'type': 'isbn',
      'text': 'ISBN'
    }],
    next_page: 0,
    next_page_url: '',
    books: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    wx.setNavigationBarTitle({
      title: '振华图书馆',
    });
    this.setData({
      scroll_height: wx.getSystemInfoSync().windowHeight - 73
    })
  },
  picker_change: function (e) {
    this.setData({
      search_type_index: e.detail.value,
      search_type: this.data.search_type_array[e.detail.value].type
    })
  },
  search: function (e) {
    var that = this;
    var keyword = e.detail.value.keyword;
    wx.showLoading({
      title: '搜索中...'
    })
    wx.request({
      url: url + '/library/search_books?strText=' + encodeURIComponent(keyword) + '&strSearchType=' + that.data.search_type,
      success: function (res) {
        that.setData({
          next_page: res.data.next_page,
          next_page_url: res.data.next_page_url,
          books: res.data.books 
        });
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  scrolltolower: function () {
    var that = this;
    if (that.data.next_page == 0) {
      common.showMsg("没有啦");
      return;
    };
    wx.showLoading({
      title: '加载下一页'
    })
    wx.request({
      url: url + '/library/search_next_page',
      method: 'post',
      data: {
        'next_page': that.data.next_page_url
      },
      success: function (res) {
        that.setData({
          next_page: res.data.next_page,
          next_page_url: res.data.next_page_url,
          books: that.data.books.concat(res.data.books)
        });
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  }
})