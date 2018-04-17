var url = getApp().globalData.server_url;
var common = require("../../../../utils/util.js");

Page({
  data: {
    height: 0,
    e_course_id: 'db048f31-3a35-11e8-8bfe-f46d04228b99',
    stu: [],
    switch_checked: true,
    auto_switch: true,
    queqin: true,
    zuoye: true,
    setting_mode: false,
    multi_mode: false,
    muti_panel: true,
    multi_pingding: [],
    start_multi_pingding: false,
    multi_grade: 80
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      // e_course_id: options.e_course_id,
      switch_checked: false
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight - 90 })
      },
    })
  },
  //设置
  setting: function (e) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    this.setData({
      ani_settingData: animation.height(256).step().export(),
      auto_switch: false,
      setting_mode: true,
      multi_mode: false,
      multi_pingding: []
    });
    if (this.data.muti_panel) {
      this.ani_multi_panel("back");
    }
    if (this.data.start_multi_pingding) {
      this.ani_start_multi("back");
    }
  },
  //保存设置
  save_setting: function (e) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    this.setData({
      ani_settingData: animation.height(90).step().export(),
      auto_switch: true,
      setting_mode: false
    });
  },
  switch_change: function (e) {
    var flag = e.detail.value ? false : true;
    this.setData({
      queqin: flag,
      zuoye: flag
    });
  },
  //开始多选
  start_multi: function () {
    if (!this.data.setting_mode) {
      this.setData({
        multi_mode: !this.data.multi_mode,
        default_checkbox: false
      });
      if (this.data.start_multi_pingding) {
        this.ani_start_multi("back");
      }
    }
  },
  checkboxChange: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        multi_pingding: e.detail.value
      });
      if (!this.data.start_multi_pingding) {
        this.ani_start_multi("show")
      }
    } else {
      if (this.data.start_multi_pingding)
        this.ani_start_multi("back");
      if (this.data.muti_panel)
        this.ani_multi_panel("back");
    }
  },
  //开始评分按钮动画
  ani_start_multi: function (mode) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    this.setData({
      ani_start_pingfen: mode == "back" ? animation.bottom(45).step().export() : animation.bottom(119).step().export(),
      start_multi_pingding: mode == "back" ? false : true
    });
  },
  //开始评分
  start_pingfen: function () {
    this.ani_multi_panel("show");
  },
  cancel_mutil: function () {
    this.ani_multi_panel("back");
  },
  //多选设置panel动画
  ani_multi_panel: function (mode) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    this.setData({
      muti_panel: mode == "back" ? false : true,
      ani_muti_panel: mode == "back" ? animation.height(this.data.height).step().export() : animation.height(348).step().export()
    })
  },
  multigradechange: function (e) {
    this.setData({ multi_grade: e.detail.value });
  },
  //保存评定
  save_multi: function () {
    var that = this;
    wx.showLoading({
      title: '保存中...',
    });
    var stu = [];
    for (var i in that.data.multi_pingding) {
      stu.push(that.data.stu[i].stu_id);
    }
    wx.request({
      url: url + '/teacher/set_performance_score',
      method: "POST",
      data: {
        "e_course_id": that.data.e_course_id,
        "stu": stu,
        "dailygrade": that.data.multi_grade
      },
      // header: {

      // },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {

          common.showMsg("保存成功", "success");
        } else {
          common.showMsg("保存失败");
        }
      },
      fail: function () {
        wx.hideLoading();
        common.shoMsg("出错啦");
      }
    })
  }
})