var common = require("../../../../utils/util.js");
Page({
  data: {
    host: getApp().globalData.server_url + "/user_head/",
    myinfo: {}
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.showLoading({
      title: '加载个人信息中...'
    });
    wx.getStorage({
      key: 'myinfo',
      success: function (res) {
        wx.hideLoading();
        that.setData({ myinfo: res.data });
      },
      fail: function () {
        common.get_request({
          url: '/get_user_info?mode=1&user_number=' + getApp().globalData.user_number,
          success: function (res) {
            wx.hideLoading();
            that.setData({ myinfo: res.data });
          }
        });
      }
    })
  },
  upload_user_head: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.server_url + '/upload_user_head',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': getApp().globalData.user_number
          },
          success: function (res_) {
            var data = JSON.parse(res_.data);
            if (data.code == 1) {
              var myinfo = that.data.myinfo;
              myinfo.img_url = data.file_name;
              that.setData({
                myinfo: myinfo
              });
              wx.setStorage({
                key: 'myinfo',
                data: myinfo
              });
            }
          }
        })
      },
    })
  },
  save_profile: function (name, value) {
    var that = this;
    wx.showNavigationBarLoading();
    common.get_request({
      url: '/save_user_info?name=' + name + '&value=' + value,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          var myinfo = that.data.myinfo;
          myinfo[name] = value;
          that.setData({ myinfo: myinfo });
          wx.setStorage({
            key: 'myinfo',
            data: myinfo
          })
          common.showMsg("保存成功");
        } else {
          common.showMsg("保存失败");
        }
      }
    })
  },
  edit_birth: function (e) {
    this.save_profile('birth_day', e.detail.value);
  },
  edit_hometown: function (e) {
    this.save_profile('hometown', e.detail.value[0] + e.detail.value[1] + e.detail.value[2]);
  },
  edit_profile: function (e) {
    var name = e.currentTarget.dataset.name;
    var value = e.detail.value;
    if (value.trim() == "" || this.data.myinfo[name] == value)
      return;
    this.save_profile(name, value);
  }
})