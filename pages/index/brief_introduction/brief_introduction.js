var url = getApp().globalData.server_url;
Page({
  data: {
    imgUrls: [
      url + '/image/school1.jpg',
      url + '/image/school2.jpg',
      url + '/image/school3.jpg'
    ],
  },
  onLoad: function () {
    require('../../../utils/util.js').set_navi_color();
  }
})