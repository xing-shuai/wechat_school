var common = require("../../../utils/util.js");
Page({
  data: {
    latitude: 0,
    longitude: 0,
    height: 0,
    controls: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          controls: [{
            id: 'mylocation',
            iconPath: '../../../resources/icons/location.png',
            position: {
              left: res.windowWidth - 50,
              top: res.windowHeight - 120,
              width: 35,
              height: 35
            },
            clickable: true
          }]
        })
      },
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
  },
  controTap: function (e) {
    var that = this;
    if (e.controlId == 'mylocation') {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({ latitude: latitude, longitude: longitude });
        }
      })
    }
  },
  choose_location: function (e) {
    wx.chooseLocation({
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 16
        })
      },
    })
  }
})