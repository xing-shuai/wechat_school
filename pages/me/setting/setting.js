var common = require("../../../utils/util.js");

Page({
  data: {
    color_list: [['#1ABC9C', '#FF0000', '#FFFFFF', '#0FAEFF'], ['#008000', '#E08031', '#77C34F', '#FF6E97']]
  },
  onLoad: function (options) {
    common.set_navi_color();
  },
  change_color: function (e) {
    wx.setNavigationBarColor({
      frontColor: e.currentTarget.dataset.color == "#FFFFFF" ? '#000000' : '#ffffff',
      backgroundColor: e.currentTarget.dataset.color,
    });
    wx.setStorage({
      key: 'navi_color',
      data: e.currentTarget.dataset.color,
      success: function (res) {
        common.showMsg("保存成功,重启小程序生效。");
      }
    })
  },
  clear_cache: function () {
    var color = "";
    wx.getStorage({
      key: 'navi_color',
      success: function (res) {
        color = res.data;
        wx.clearStorageSync();
        wx.setStorage({
          key: 'navi_color',
          data: color
        })
      },
      complete: function () {
        common.showMsg("清理成功");
      }
    })
  },
  about: function () {
    wx.navigateTo({
      url: 'about/about',
    });
  },
  unbind: function () {
    wx.showModal({
      title: '提示',
      content: '取消绑定将无法使用小程序喽',
      confirmColor: 'red',
      success: function (res) {
        if (res.confirm)
          common.get_request({
            url: '/unbind_user',
            header: {
              'cookie': wx.getStorageSync("sessionid")
            },
            success: function (res) {
              wx.reLaunch({
                url: '../../index/index'
              });
            }
          })
      }
    })
  }
})