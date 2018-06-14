var common = require("../../../utils/util.js");
var url = getApp().globalData.server_url;

var daysBetween = function (DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
  var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

  var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000 / 365);
  var age = Math.abs(cha) + 1 + "";
  return age.split(".")[0];
}

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(),    //day
    "h+": this.getHours(),   //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
Page({
  data: {
    myinfo: {},
    windowHeight: 0,
    images_height: 0,
    host: url + "/user_head/",
    signature: true,
    signature_textarea: true,
    op_button: false,
    currentTab: 0,
    images_host: url + "/dynamic/images/",
    user_dynamic_loaded: 0,
    user_dynamic_has_next_page: true,
    user_dynamic_cur_page: 0,
    user_dynamic_data: [],
    user_number: '149074064',
    current_user: ''
  },
  onLoad: function (options) {
    common.set_navi_color();
    this.setData({
      user_number: options.user_number,
      current_user: getApp().globalData.user_number
    });
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
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'myinfo',
      success: function (res) {
        wx.hideLoading();
        if (res.data.number != that.data.user_number) {
          common.get_request({
            url: '/get_user_info?mode=1&user_number=' + that.data.user_number,
            success: function (res) {
              wx.hideLoading();
              that.setData({ myinfo: res.data });
            }
          });
          return;
        }
        that.setData({ myinfo: res.data });
      },
      fail: function () {
        common.get_request({
          url: '/get_user_info?mode=1&user_number=' + that.data.user_number,
          success: function (res) {
            wx.hideLoading();
            that.setData({ myinfo: res.data });
            if (that.data.current_user == that.data.user_number) {
              wx.setStorage({
                key: "myinfo",
                data: res.data
              });
            }
          }
        });
      }
    })
  },
  //tab切换时加载列表数据
  loadList: function (currentTab) {
    var that = this;
    if (currentTab == 1) {
      //用户动态
      if (this.data.user_dynamic_loaded == 0 && this.data.myinfo.profile_permission[1] == '1') {
        wx.showLoading({
          title: '加载动态...',
        });
        common.get_request({
          url: '/dynamic/get_user_dynamic?page=' + (that.data.user_dynamic_cur_page + 1).toString() + "&user_number=" + that.data.user_number,
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          success: function (res) {
            wx.hideLoading();
            wx.stopPullDownRefresh();
            that.setData({ user_dynamic_data: res.data.data, user_dynamic_has_next_page: res.data.has_next_page, user_dynamic_cur_page: res.data.has_next_page ? that.data.user_dynamic_cur_page + 1 : 0, user_dynamic_loaded: 1 });
          }
        })
      }
      return;
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
      return;
    } else {
      that.setData({ currentTab: e.target.dataset.current });
    }
  },
  //滑到底部加载下一页
  scrolltolower: function (e) {
    var that = this;
    if (this.data.currentTab == 1) {
      if (that.data.my_dynamic_has_next_page) {
        wx.showNavigationBarLoading();
        common.get_request({
          url: '/dynamic/get_user_dynamic?page=' + (that.data.user_dynamic_cur_page + 1).toString() + "&user_number=" + that.data.user_number,
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          success: function (res) {
            wx.hideNavigationBarLoading();
            that.setData({ user_dynamic_data: that.data.user_dynamic_data.concat(res.data.data), user_dynamic_has_next_page: res.data.has_next_page, user_dynamic_cur_page: that.data.user_dynamic_cur_page + 1 });
          }
        })
      }
    }
  },
  //预览校园动态照片
  preview_images: function (e) {
    var dataset = e.currentTarget.dataset;
    var urls = [];
    var current = "";
    var data_source = 'user_dynamic_data';
    if (dataset.mode == "0") {
      url = this.data[data_source][dataset.index].images[0][0]
      urls.push(url);
      current = url;
    }
    else {
      var t = this.data[data_source][dataset.index].images;
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
    var data = that.data.user_dynamic_data;
    var index = e.currentTarget.dataset.index;
    common.get_request({
      url: '/dynamic/uncollect_dynamic?collection_id=' + data[index].collection_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data[index].collection_id = "";
          data[index].heart_count -= 1;
          that.setData({ user_dynamic_data: data });
        }
      }
    })
  },
  //收藏校园动态
  collect: function (e) {
    var that = this;
    var data = that.data.user_dynamic_data;
    var index = e.currentTarget.dataset.index;
    common.get_request({
      url: '/dynamic/collect_dynamic?collection_id=' + data[index].id + "&dynamic_type=" + data[index].dynamic_type,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data[index].collection_id = res.data.id;
          data[index].heart_count += 1;
          that.setData({ user_dynamic_data: data });
        }
      }
    })
  },
  //浏览动态
  view_dynamic: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var dynamic_type = e.currentTarget.dataset.dynamic_type;
    var id = this.data.user_dynamic_data[index].id;
    wx.navigateTo({
      url: '../dynamic/dynamic_detail/dynamic_detail?id=' + id + "&dynamic_type=" + dynamic_type,
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    switch (this.data.currentTab) {
      case 0: {
        wx.stopPullDownRefresh();
        return;
      }
      case 1: {
        this.setData({
          user_dynamic_loaded: 0,
          user_dynamic_has_next_page: true,
          user_dynamic_cur_page: 0,
          user_dynamic_data: [],
        })
        break;
      }
    }
    this.loadList(this.data.currentTab);
  },

  //我的动态操作菜单
  my_dynamic_op: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: 'red',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '确认删除此动态?',
          confirmColor: 'red',
          confirmText: '删除',
          success: function (res) {
            if (res.confirm) {
              common.get_request({
                url: '/dynamic/delete_dynamic?id=' + id,
                header: {
                  'cookie': wx.getStorageSync("sessionid")
                },
                success: function (res) {
                  if (res.data.code == 1) {
                    common.showMsg("删除成功", 'success');
                    that.onPullDownRefresh();
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  edit_profile: function () {
    wx.navigateTo({
      url: 'edit_profile/edit_profile'
    });
  }
})