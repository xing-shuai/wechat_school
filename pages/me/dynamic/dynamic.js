var common = require("../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    winHeight: 0,
    images_height: 0,
    currentTab: 0,
    images_host: url + "/dynamic/images/",
    user_head_host: url + "/user_head/",
    school_dynamic_loaded: 0,
    school_dynamic_has_next_page: true,
    school_dynamic_cur_page: 0,
    school_dynamic_data: []
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


      }
    });
  },
  //tab切换时加载列表数据
  loadList: function (currentTab) {
    var that = this;
    if (currentTab == 0) {
      return;
    }
    if (currentTab == 1) {
      //校园动态
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
    //我的动态

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

        break;
      }
      case 1: {
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
      case 2: {

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
    for (var i = 0; i < urls.length; i++) {
      urls[i] = this.data.images_host + urls[i];
    }
    wx.previewImage({
      urls: urls,
      current: this.data.images_host + current
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
        break;
      }
      case 1: {
        this.setData({
          school_dynamic_loaded: 0,
          school_dynamic_has_next_page: true,
          school_dynamic_cur_page: 0,
          school_dynamic_data: [],
        })
        break;
      }
      case 2: {
        break;
      }
    }
    this.loadList(this.data.currentTab);
  },
  //添加动态
  add_dynamic: function () {
    wx.navigateTo({
      url: 'add_dynamic/add_dynamic',
    })
  }
})