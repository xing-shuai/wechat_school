var url = getApp().globalData.server_url;
var common = require('../../utils/util.js')

Page({
  data: {
    display: false,
    imgUrls: [
      url + '/image/school1.jpg',
      url + '/image/school2.jpg',
      url + '/image/school3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    weather_info: '',
    weather_img: '',
    weather_margin: 0,
    user_type: 's',
    reload_this_page: false,
    absence_count: 0
  },
  index_init: function () {
    var that = this;
    var app = getApp();
    wx.setNavigationBarTitle({
      title: '校园',
    });
    wx.showLoading({
      title: '登陆中...',
    })
    wx.login({
      success: function (code) {
        if (code.code) {
          wx.request({
            url: app.globalData.server_url + '/check_user',
            method: 'POST',
            data: {
              code: code.code
            },
            success: function (res) {
              wx.hideLoading();
              wx.setStorageSync("sessionid", res.header["Set-Cookie"])
              var code = res.data.code;
              if (code == '1') {//已绑定
                app.globalData.user_type = res.data.user_type;
                that.setData({
                  user_type: res.data.user_type,
                  display: true,
                  reload_this_page: false
                });
                //检测学生缺勤情况
                if (res.data.user_type == 's') {
                  common.get_request({
                    url: '/student/check_absences',
                    header: {
                      'cookie': wx.getStorageSync("sessionid")
                    },
                    success: function (re) {
                      that.setData({ absence_count: re.data.count });
                    }
                  })
                }
              } else if (code == '0') {//未绑定
                that.setData({ reload_this_page: true });
                wx.navigateTo({
                  url: '/pages/bind/bind',
                })
              } else {//验证失败
                common.showMsg(res.data.msg)
              }
            },
            fail: function () {
              wx.hideLoading();
              common.showMsg('连接服务器失败')
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        common.showMsg('登录失败')
      }
    })
  },
  onLoad: function (option) {
    common.set_navi_color();
    this.index_init();
  },
  onReady: function () {
    var that = this;
    // wx.request({
    //   url: url + '/get_weather?city_code=58336',
    //   success: function (res) {
    //     var info = res.data;
    //     that.setData({ weather_info: res.data, weather_img: common.getWeatherImg(info), weather_margin: ((4 - info.length) * 15).toString() });
    //     wx.hideNavigationBarLoading();
    //   },
    //   fail: function () {
    //     wx.hideNavigationBarLoading();
    //   }
    // })
  },
  onShow: function () {
    if (this.data.reload_this_page)
      this.index_init();
  },
  clear_absence_count: function () {
    this.setData({ absence_count: 0 });
  }
})