var url = getApp().globalData.server_url;
var common = require('../../utils/util.js')

Page({
  data: {
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
    user_type: 't'
  },
  onLoad: function (option) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '校园',
    });
    wx.request({
      url: url + '/get_user_type',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ user_type: res.data.user_type });
      }
    })
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
  }
})