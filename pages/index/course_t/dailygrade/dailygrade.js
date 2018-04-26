var common = require("../../../../utils/util.js")

Page({
  data: {
    height: 0,
    e_course_id: 'db048f31-3a35-11e8-8bfe-f46d04228b99',
    stu: [],
    switch_checked: true,
    auto_switch: true,
    queqin: false,
    zuoye: false,
    queqin_value: 1,
    zuoye_value: 1,
    setting_mode: false,
    multi_mode: false,
    muti_panel: true,
    multi_pingding: [],
    start_multi_pingding: false,
    multi_grade: 80,
    single_pingding_stu_index: 0
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    that.setData({
      e_course_id: options.e_course_id
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight - 90 })
      },
    });
    wx.showLoading({
      title: '加载设置',
    })
    //加载设置
    common.get_request({
      url: '/teacher/get_dailygrade_setting?e_course_id=' + that.data.e_course_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          switch_checked: res.data.auto,
          queqin_value: res.data.queqin,
          zuoye_value: res.data.zuoye,
          queqin: res.data.auto ? false : true,
          zuoye: res.data.auto ? false : true
        });
        that.loadStu();
      }
    })
  },
  //加载学生列表
  loadStu: function () {
    var that = this;
    common.get_request({
      url: '/teacher/get_students?e_course_id=' + that.data.e_course_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res_) {
        that.setData({
          stu: res_.data
        });
      }
    })
  },
  //设置
  setting: function (e) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    this.setData({
      ani_settingData: animation.height(260).step().export(),
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
  queqin_change: function (e) {
    this.setData({ queqin_value: e.detail.value });
  },
  zuoye_change: function (e) {
    this.setData({ zuoye_value: e.detail.value });
  },
  //保存设置
  save_setting: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    common.get_request({
      url: '/teacher/modify_dailygrade_setting?e_course_id=' + that.data.e_course_id + "&switch_checked=" + that.data.switch_checked + "&queqin_value=" + that.data.queqin_value + "&zuoye_value=" + that.data.zuoye_value,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        common.showMsg("以保存修改", "success");
        that.setData({
          ani_settingData: animation.height(90).step().export(),
          auto_switch: true,
          setting_mode: false
        });
      }
    });
  },
  switch_change: function (e) {
    var flag = e.detail.value ? false : true;
    this.setData({
      switch_checked: e.detail.value,
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
      ani_muti_panel: mode == "back" ? animation.height(this.data.height).step().export() : animation.height(348).step().export(),
      multi_grade: mode == "back" ? this.data.multi_grade : 80
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
    if (that.data.start_multi_pingding) {
      that.data.multi_pingding.forEach(function (currentValue) {
        stu.push(that.data.stu[currentValue].stu_id);
      })
    } else {
      stu.push(that.data.stu[that.data.single_pingding_stu_index].stu_id);
    }
    common.post_request({
      url: '/teacher/set_performance_score',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      data: {
        "e_course_id": that.data.e_course_id,
        "stu": stu,
        "dailygrade": that.data.multi_grade
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === 1) {
          common.showMsg("保存成功", "success");
          that.setData({
            multi_mode: false,
            default_checkbox: false,
            single_pingding_stu_index: 0
          });
          if (that.data.start_multi_pingding) {
            that.ani_start_multi("back");
          }
          that.ani_multi_panel("back");
          that.loadStu();
        }
        else
          common.showMsg("保存失败")
      }
    })
  },
  //单选评定
  single_pingding: function (e) {
    var that = this;
    that.setData({ single_pingding_stu_index: e.currentTarget.dataset.stuIndex });
    that.ani_multi_panel("show");
  },
})