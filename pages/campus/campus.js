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
    images_height: 0,
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
    images_host: url + "/dynamic/images/",
    user_head_host: url + "/user_head/",
    school_dynamic_loaded: 0,
    school_dynamic_has_next_page: true,
    school_dynamic_cur_page: 0,
    school_dynamic_data: [],
    wenjuan_loaded: 0,
    wenjuan_has_next_page: true,
    wenjuan_cur_page: 0,
    wenjuan_data: []
  },
  onLoad: function () {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          images_height: parseInt(res.windowWidth * 0.32)
        });
        getList('?urltype=tree.TreeTempUrl&wbtreeid=1002', '0', function (data) {
          that.setData({ schoolnewsListData: data.news, schoolnewsNextPageUrl: data.nextPageUrl, schoolnewsLoaded: 1 });
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
    if (currentTab == 3) {//校园动态
      if (this.data.school_dynamic_loaded == 0) {
        wx.showLoading({
          title: '加载动态...',
        });
        common.get_request({
          url: '/dynamic/get_school_dynamic?page=' + (that.data.school_dynamic_cur_page + 1).toString(),
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          success: function (res) {
            wx.hideLoading();
            wx.stopPullDownRefresh();
            that.setData({ school_dynamic_data: res.data.data, school_dynamic_has_next_page: res.data.has_next_page, school_dynamic_cur_page: res.data.has_next_page ? that.data.school_dynamic_cur_page + 1 : 0, school_dynamic_loaded: 1 });
          }
        })
      }
      return;
    }
    //问卷调查
    if (this.data.jiaowu_loaded == 0) {
      wx.showLoading({
        title: '加载问卷...',
      });
      wx.stopPullDownRefresh();
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
        if (that.data.school_dynamic_has_next_page) {
          wx.showNavigationBarLoading();
          common.get_request({
            url: '/dynamic/get_school_dynamic?page=' + (that.data.school_dynamic_cur_page + 1).toString(),
            header: {
              'cookie': wx.getStorageSync("sessionid")
            },
            success: function (res) {
              wx.hideNavigationBarLoading();
              that.setData({ school_dynamic_data: that.data.school_dynamic_data.concat(res.data.data), school_dynamic_has_next_page: res.data.has_next_page, school_dynamic_cur_page: that.data.school_dynamic_cur_page + 1 });
            }
          })
        }
        break;
      }
      case 4: {
        if (that.data.wenjuan_has_next_page) {
          wx.showNavigationBarLoading();
          common.get_request({
            url: '/dynamic/get_wenjuan?page=' + (that.data.wenjuan_cur_page + 1).toString(),
            success: function () {
              wx.hideNavigationBarLoading();
              that.setData({ wenjuan_data: that.data.wenjuan_data.concat(res.data.data), wenjuan_has_next_page: res.data.has_next_page, wenjuan_cur_page: that.data.wenjuan_cur_page + 1 });
            }
          })
        }
        break;
      }
    }
  },
  //预览校园动态照片
  preview_images: function (e) {
    var dataset = e.currentTarget.dataset;
    var urls = [];
    var current = "";
    if (dataset.mode == "0") {
      url = this.data.school_dynamic_data[dataset.index].images[0][0]
      urls.push(url);
      current = url;
    }
    else {
      var t = this.data.school_dynamic_data[dataset.index].images;
      current = t[dataset.currentIndexX][dataset.currentIndexY];
      for (var i = 0; i < t.length; i++) {
        urls = urls.concat(t[i]);
      }
    }
    wx.previewImage({
      urls: urls,
      current: current
    })
  },
  //取消收藏校园动态
  uncollect: function (e) {
    var that = this;
    var data = that.data.school_dynamic_data;
    var index = e.currentTarget.dataset.index;
    common.get_request({
      url: '/dynamic/uncollect_school_dynamic?collection_id=' + data[index].collection_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data[index].collection_id = "";
          data[index].heart_count -= 1;
          that.setData({ school_dynamic_data: data });
        }
      }
    })
  },
  //收藏校园动态
  collect: function (e) {
    var that = this;
    var data = that.data.school_dynamic_data;
    var index = e.currentTarget.dataset.index;
    common.get_request({
      url: '/dynamic/collect_school_dynamic?collection_id=' + data[index].id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data[index].collection_id = res.data.id;
          data[index].heart_count += 1;
          that.setData({ school_dynamic_data: data });
        }
      }
    })
  },
  //浏览校园动态
  view_dynamic: function (e) {
    wx.navigateTo({
      url: 'school_dynamic/school_dynamic?id=' + this.data.school_dynamic_data[e.currentTarget.dataset.index].id,
    });
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
          school_dynamic_loaded: 0,
          school_dynamic_has_next_page: true,
          school_dynamic_cur_page: 0,
          school_dynamic_data: [],
        })
        break;
      }
      case 4: {
        this.setData({
          wenjuan_loaded: 0,
          wenjuan_has_next_page: true,
          wenjuan_cur_page: 0,
          wenjuan_data: []
        })
        break;
      }
    }
    this.loadList(this.data.currentTab);
  }
})