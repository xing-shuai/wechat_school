var common = require("../../../utils/util.js");
var url = getApp().globalData.server_url;

var daysBetween = function (DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
  var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

  var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000 / 365);
  var age = Math.abs(cha) + 1 + "";
  return age.split(".")[0];
}

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(),    //day
    "h+": this.getHours(),   //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
Page({
  data: {
    myinfo: {},
    host: url + "/user_head/",
    signature: true,
    signature_textarea: true,
    op_button: false
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
          url: '/get_user_info?mode=1',
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          success: function (res) {
            wx.hideLoading();
            that.setData({ myinfo: res.data });
            wx.setStorage({
              key: "myinfo",
              data: res.data
            });
          }
        });
      }
    })

  },
  edit: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    if (!this.data.op_button) {
      this.setData({
        signature: false,
        signature_textarea: false,
        ani_save: animation.bottom(43).step().export(),
        op_button: true
      })
    } else {
      this.setData({
        signature: true,
        signature_textarea: true,
        ani_save: animation.bottom(1).step().export(),
        op_button: false
      })
    }
  },
  upload_img: function () {
    var that = this;
    if (!that.data.op_button)
      return;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: url + '/upload_user_head',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res_) {
            var data = JSON.parse(res_.data);
            if (data.code == 1) {
              var myinfo = that.data.myinfo;
              myinfo.img_url = data.file_name;
              that.setData({
                myinfo: myinfo
              })
            }
          }
        })
      },
    })
  },
  bindDateChange: function (e) {
    var myinfo = this.data.myinfo;
    myinfo.birth_day = e.detail.value;
    myinfo.age = daysBetween(new Date().format('yyyy-MM-dd'), e.detail.value);
    this.setData({
      myinfo: myinfo
    })
  },
  signature_blur: function (e) {
    var myinfo = this.data.myinfo;
    myinfo.signature = e.detail.value;
    this.setData({
      myinfo: myinfo
    })
  },
  save: function (e) {
    var data = this.data.myinfo;
    var that = this;
    common.post_request({
      url: '/save_user_info',
      data: data,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        common.showMsg("保存成功", 'success');
        var animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        that.setData({
          signature: true,
          signature_textarea: true,
          ani_save: animation.bottom(1).step().export(),
          op_button: false
        })
      }
    })
  }
})