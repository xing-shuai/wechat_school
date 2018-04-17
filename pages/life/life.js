var getLocation = function (callBack) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude;
      var longitude = res.longitude;
      callBack({ latitude: latitude, longitude: longitude });
    }
  })
}
Page({
  data: {
    latitude: '',
    longitude: '',
    controls: [{
      id: 'mylocation',
      iconPath: '../../resources/icons/location.png',
      position: {
        left: 5,
        top: 160,
        width: 30,
        height: 30
      },
      clickable: true
    }, {
      id: 'navigation',
      iconPath: '../../resources/icons/navigation.png',
      position: {
        left: 40,
        top: 160,
        width: 30,
        height: 30
      },
      clickable: true
    }]
  },
  onLoad: function (options) {
    var that = this;
    getLocation(function (res) {
      that.setData(res);
    })
  },
  //点击
  controTap: function (e) {
    var that = this;
    if (e.controlId == 'mylocation') {
      getLocation(function (res) {
        that.setData(res);
      })
    } else {
      wx.chooseLocation({
        success: function(res) {
          wx.openLocation({
            latitude: res.latitude,
            longitude: res.longitude,
            scale:20
          })
        },
      })
    }
  }
})