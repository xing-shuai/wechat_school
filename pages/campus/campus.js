var common = require("../../utils/util.js");
var getList = function (nextPageUrl, mode, callBack) {
  common.post_request({
    url: '/dynamic/get_news_list',
    data: {
      'nextPageUrl': nextPageUrl,
      "mode": mode
    },
    method: 'POST',
    success: function (res) {
      callBack(res.data);
    }
  })
}
var url = getApp().globalData.server_url;
Page({
  data: {
    winHeight: 0,
    currentTab: 0,
    schoolnewsLoaded: 0,
    schoolnewsNextPageUrl: '',
    schoolnewsListData: [],
    jiaowuLoaded: 0,
    jiaowuNextPageUrl: '',
    jiaowuListData: [],
    examinationLoaded: 0,
    examinationNextPageUrl: '',
    examinationListData: [],
    questionnaire_loaded: 0,
    questionnaire_has_next_page: true,
    questionnaire_cur_page: 0,
    questionnaire_data: []
  },
  onLoad: function () {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1002', '0', function (data) {
          that.setData({ schoolnewsListData: data.news, schoolnewsNextPageUrl: data.nextPageUrl, schoolnewsLoaded: 1 });
          wx.hideLoading();
        })
      }
    });
  },
  //tab切换时加载列表数据
  loadList: function (currentTab) {
    var that = this;
    if (currentTab == 0) {//学校要闻
      if (this.data.schoolnewsLoaded == 0) {
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1002', "0", function (data) {
          that.setData({ schoolnewsListData: data.news, schoolnewsNextPageUrl: data.nextPageUrl, schoolnewsLoaded: 1 });
          wx.hideLoading();
          wx.stopPullDownRefresh();
        });
      }
      return;
    }
    if (currentTab == 1) {//教务通知
      if (this.data.jiaowuLoaded == 0) {
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1082', "1", function (data) {
          that.setData({ jiaowuListData: data.news, jiaowuNextPageUrl: data.nextPageUrl, jiaowuLoaded: 1 });
          wx.hideLoading();
          wx.stopPullDownRefresh();
        });
      }
      return;
    }
    if (currentTab == 2) {//考试安排
      if (this.data.examinationLoaded == 0) {
        wx.showLoading({
          title: '加载数据...',
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1095', "1", function (data) {
          that.setData({ examinationListData: data.news, examinationNextPageUrl: data.nextPageUrl, examinationLoaded: 1 });
          wx.hideLoading();
          wx.stopPullDownRefresh();
        });
      }
      return;
    }
    //问卷调查
    if (this.data.jiaowu_loaded == 0) {
      wx.showLoading({
        title: '加载问卷...',
      });
      // common.get_request({
      //   url: '/dynamic/get_questionnaire?page=' + (that.data.questionnaire_cur_page + 1).toString(),
      //   success: function () {
      //     wx.stopPullDownRefresh();
      //     wx.hideNavigationBarLoading();
      //     that.setData({ questionnaire_data: that.data.questionnaire_data.concat(res.data.data), questionnaire_has_next_page: res.data.has_next_page, questionnaire_cur_page: that.data.questionnaire_cur_page + 1 });
      //   }
      // })
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
  //滑到底部加载下一页
  scrolltolower: function (e) {
    var that = this;
    switch (this.data.currentTab) {
      case 0: {
        if (that.data.schoolnewsNextPageUrl == '-1')
          return;
        wx.showNavigationBarLoading();
        getList(that.data['schoolnewsNextPageUrl'], "0", function (data) {
          that.setData({ schoolnewsListData: that.data.schoolnewsListData.concat(data.news), schoolnewsNextPageUrl: data.nextPageUrl, schoolnewsLoaded: 1 });
          wx.hideNavigationBarLoading();
        })
        break;
      }
      case 1: {
        if (that.data.jiaowuNextPageUrl == '-1')
          return;
        wx.showNavigationBarLoading();
        getList(that.data['jiaowuNextPageUrl'], "1", function (data) {
          that.setData({ jiaowuListData: that.data.jiaowuListData.concat(data.news), jiaowuNextPageUrl: data.nextPageUrl, jiaowuLoaded: 1 });
          wx.hideNavigationBarLoading();
        })
        break;
      }
      case 2: {
        if (that.data.examinationNextPageUrl == '-1')
          return;
        wx.showNavigationBarLoading();
        getList(that.data['examinationNextPageUrl'], "1", function (data) {
          that.setData({ examinationListData: that.data.examinationListData.concat(data.news), examinationNextPageUrl: data.nextPageUrl, examinationLoaded: 1 });
          wx.hideNavigationBarLoading();
        })
        break;
      }
      case 3: {
        if (that.data.questionnaire_has_next_page) {
          wx.showNavigationBarLoading();
          common.get_request({
            url: '/dynamic/get_questionnaire?page=' + (that.data.questionnaire_cur_page + 1).toString(),
            success: function () {
              wx.hideNavigationBarLoading();
              that.setData({ questionnaire_data: that.data.questionnaire_data.concat(res.data.data), questionnaire_has_next_page: res.data.has_next_page, questionnaire_cur_page: that.data.questionnaire_cur_page + 1 });
            }
          })
        }
        break;
      }
    }
  },
  onPullDownRefresh: function () {
    switch (this.data.currentTab) {
      case 0: {
        this.setData({
          schoolnewsLoaded: 0,
          schoolnewsNextPageUrl: '',
          schoolnewsListData: [],
        })
        break;
      }
      case 1: {
        this.setData({
          jiaowuLoaded: 0,
          jiaowuNextPageUrl: '',
          jiaowuListData: [],
        })
        break;
      }
      case 2: {
        this.setData({
          examinationLoaded: 0,
          examinationNextPageUrl: '',
          examinationListData: [],
        })
        break;
      }
      case 3: {
        this.setData({
          questionnaire_loaded: 0,
          questionnaire_has_next_page: true,
          questionnaire_cur_page: 0,
          questionnaire_data: []
        })
        break;
      }
    }
    this.loadList(this.data.currentTab);
  }
})