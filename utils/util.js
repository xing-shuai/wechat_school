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
      wx.stopPullDownRefresh();
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
      wx.stopPullDownRefresh();
      showMsg("出错啦");
    }
  })
}

const set_navi_color = function () {
  wx.getStorage({
    key: 'navi_color',
    success: function (res) {
      wx.setNavigationBarColor({
        frontColor: res.data == "#FFFFFF" ? '#000000' : '#ffffff',
        backgroundColor: res.data,
      });
    }
  })
}

const moment = function (dateStr) {
  function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
  }

  var publishTime = getDateTimeStamp(dateStr) / 1000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d,
    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  //小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  d = timeNow - publishTime;
  d_days = parseInt(d / 86400);
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 8) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚发表';
    } else {
      return d_seconds + '秒前';
    }
  } else if (d_days >= 8 && d_days < 30) {
    return parseInt(d_days / 7).toString() + '周前';
  } else if (d_days >= 30) {
    return parseInt(d_days / 30).toString() + '月前';
  }
}

module.exports = {
  showMsg: showMsg,
  get_request: get_request,
  post_request: post_request,
  set_navi_color: set_navi_color,
  getWeatherImg: getWeatherImg,
  moment: moment
}
