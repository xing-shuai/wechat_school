var common = require("../../../utils/util.js");

Page({
  data: {
    color_list: [['#1ABC9C', '#FF0000', '#FFFFFF', '#0FAEFF'], ['#008000', '#E08031', '#77C34F', '#FF6E97']],
    permission: "",
    myinfo: {}
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getStorage({
      key: 'myinfo',
      success: function (res) {
        var permission = res.data.profile_permission;
        that.setData({ myinfo: res.data, permission: permission });
      },
    })
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
    wx.removeStorage({
      key: 'myinfo',
      success: function (res) {
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
    var that = this;
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
              that.clear_cache();
              wx.reLaunch({
                url: '../../index/index'
              });
            }
          })
      }
    })
  },
  save_switch: function (index, value) {
    var permission = this.data.permission;
    if (index == 0)
      permission = (value ? '1' : '0') + permission[1];
    else
      permission = permission[0] + (value ? '1' : '0');
    this.setData({ permission: permission });
    var that = this;
    common.get_request({
      url: '/save_user_info?name=profile_permission&value=' + permission,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          var myinfo = that.data.myinfo;
          myinfo["profile_permission"] = permission;
          wx.setStorage({
            key: 'myinfo',
            data: myinfo
          })
        }
      }
    })
  },
  is_show_class: function (e) {
    this.save_switch(0, e.detail.value);
  },
  is_show_dynamic: function (e) {
    this.save_switch(1, e.detail.value);
  }
})