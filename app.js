//app.js
var common = require('/utils/util.js');

App({
  onLaunch: function (options) {
    common.set_navi_color();
  },
  globalData: {
    openid: null,
    user_type: 's',
    user_number: '',
    // server_url: 'http://112.74.58.209:8081',
    server_url: 'http://192.168.1.111:5000',
    // server_url: 'http://localhost:5000',
    notification: {},
    city_code: '58336'
  }
})