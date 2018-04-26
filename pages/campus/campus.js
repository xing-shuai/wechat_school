var url = getApp().globalData.server_url;
var getList = function (nextPageUrl, callBack) {
  wx.request({
    url: url + '/web/get_news_list',
    data: {
      'nextPageUrl': nextPageUrl
    },
    method: 'POST',
    success: function (res) {
      callBack(res.data);
    }
  })
}
var common = require("../../utils/util.js");
Page({
  data: {
    winHeight: 0,
    currentTab: 0,
    notificationLoaded: 0,
    notificationNextPageUrl: '',
    notificationListData: [],
    nnewsLoaded: 0,
    newsNextPageUrl: '',
    newsListData: [],
    examinationLoaded: 0,
    examinationNextPageUrl: '',
    examinationListData: []
  },
  onLoad: function () {
    common.set_navi_color();
    wx.setNavigationBarTitle({
      title: '动态',
    });
    // var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     wx.showLoading({
    //       title: '加载数据...',
    //     });
    //     that.setData({
    //       winWidth: res.windowWidth,
    //       winHeight: res.windowHeight
    //     });
    //     getList('?urltype=tree.TreeTempUrl&wbtreeid=1082', function (data) {
    //       that.setData({ notificationListData: data.news, notificationNextPageUrl: data.nextPageUrl, notificationLoaded: 1 });
    //       wx.hideLoading();
    //     })
    //   }
    // });
  },
  //tab切换时加载列表数据
  loadList: function (currentTab) {
    var that = this;
    if (currentTab == 0) {//教务通知
      if (this.data.notificationLoaded == 0) {
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1082', function (data) {
          that.setData({ notificationListData: data.news, notificationNextPageUrl: data.nextPageUrl, notificationLoaded: 1 });
          wx.hideLoading();
        });
      }
      return;
    }
    if (currentTab == 1) {//教务新闻
      if (this.data.nnewsLoaded == 0) {
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1083', function (data) {
          that.setData({ newsListData: data.news, newsNextPageUrl: data.nextPageUrl, nnewsLoaded: 1 });
          wx.hideLoading();
        });
      }
      return;
    }
    if (this.data.examinationLoaded == 0) {
      wx.showLoading({
        title: '加载数据...',
      });
      //考试安排
      getList('?urltype=tree.TreeTempUrl&wbtreeid=1095', function (data) {
        that.setData({ examinationListData: data.news, examinationNextPageUrl: data.nextPageUrl, examinationLoaded: 1 });
        wx.hideLoading();
      });
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
      that.loadList(e.target.dataset.current);
    }
  },
  //滑到底部加载下一页
  scrolltolower: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载下一页...'
    });
    switch (this.data.currentTab) {
      case 0: {
        if (that.data.notificationNextPageUrl == '-1') {
          wx.showToast({
            title: '没有啦...',
            duration: 1500,
            icon: "none"
          });
          return;
        }
        getList(that.data['notificationNextPageUrl'], function (data) {
          that.setData({ notificationListData: that.data.notificationListData.concat(data.news), notificationNextPageUrl: data.nextPageUrl, notificationLoaded: 1 });
          wx.hideLoading();
        })
        break;
      }
      case 1: {
        if (that.data.newsNextPageUrl == '-1') {
          wx.showToast({
            title: '没有啦...',
            duration: 1500,
            icon: "none"
          });
          return;
        }
        getList(that.data['newsNextPageUrl'], function (data) {
          that.setData({ newsListData: that.data.newsListData.concat(data.news), newsNextPageUrl: data.nextPageUrl, newsLoaded: 1 });
          wx.hideLoading();
        })
        break;
      }
      case 2: {
        if (that.data.examinationNextPageUrl == '-1') {
          wx.showToast({
            title: '没有啦...',
            duration: 1500,
            icon: "none"
          });
          return;
        }
        getList(that.data['examinationNextPageUrl'], function (data) {
          that.setData({ examinationListData: that.data.examinationListData.concat(data.news), examinationNextPageUrl: data.nextPageUrl, examinationLoaded: 1 });
          wx.hideLoading();
        })
        break;
      }
    }
  }
})