const showMsg = function (msg, icon) {
  if (icon) {
    wx.showToast({
      title: msg,
      icon: icon
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  }
}

const getWeatherImg = function (weather_info) {
  var img_url = '';
  switch (weather_info) {
    case '多云': {
      img_url += "cloudy";
      break;
    }
    case '晴': {
      img_url += "sunny";
      break;
    }
    case '小雨': {
      img_url += "little_rain";
      break;
    }
    case '阴': {
      img_url += "overcast";
      break;
    }
    case '阵雨': {
      img_url += "shower";
      break;
    }
    case '雷阵雨': {
      img_url += "thunder_shower";
      break;
    }
    default: {
      img_url += "sunny";
    }
  }
  return img_url;
}

const get_request = function (config) {
  var server_url = getApp().globalData.server_url;
  wx.request({
    url: server_url + config.url,
    header: config.header ? config.header : {},
    success: function (res) {
      config.success(res);
    },
    fail: function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      showMsg("出错啦");
    }
  })
}

const post_request = function (config) {
  var server_url = getApp().globalData.server_url;
  wx.request({
    url: server_url + config.url,
    method: 'POST',
    header: config.header ? config.header : {},
    data: config.data,
    success: function (res) {
      config.success(res);
    },
    fail: function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      showMsg("出错啦");
    }
  })
}

module.exports = {
  showMsg: showMsg,
  get_request: get_request,
  post_request: post_request
}
