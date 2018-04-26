//app.js
var common = require('/utils/util.js');

App({
  onLaunch: function (options) {
    common.set_navi_color();
  },
  globalData: {
    openid: null,
    user_type: 's',
    // server_url: 'http://112.74.58.209:8081',
    server_url: 'http://192.168.1.104:5000'
  }
})