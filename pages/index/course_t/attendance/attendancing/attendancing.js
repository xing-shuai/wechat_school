var url = getApp().globalData.server_url;
var common = require('../../../../../utils/util.js')

Page({
  data: {
    height: 0,
    e_course_id: '',
    attendance_total: 100,
    attendance_count: 15,
    attendance_type_index: 0,
    attendance_type: [{
      "name": '随机点名',
      "value": 0
    }, {
      "name": '全部点名',
      "value": 1
    }],
    picker_attendance_type: false,
    slider_attendance_count: false,
    begin_attendance: false,
    submit_attendance: true,
    cancel_attendance: true,
    is_begin: false,
    button_next_stu: false,
    current_index: 0,
    current_absence_type: 3,
    attendancing_stu: [],
    absence_stu: [],
    default_check: true
  },
  onLoad: function (options) {
    var that = this;
    this.setData({ e_course_id: options.e_course_id });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      },
    });
    wx.setNavigationBarTitle({
      title: '开始考勤',
    });
    wx.showLoading({
      title: '获取课程人数...',
    })
    wx.request({
      url: url + '/teacher/get_student_count?e_course_id=' + that.data.e_course_id,
      success: function (res) {
        wx.hideLoading();
        that.setData({ attendance_total: res.data.count });
      },
      fail: function () {
        wx.hideLoading();
        common.showMsg("出错啦");
      }
    })
  },
  //选择点名方式
  choose_attendance: function (e) {
    this.setData({
      attendance_type_index: e.detail.value,
      slider_attendance_count: e.detail.value == 1 ? true : false,
      attendance_count: e.detail.value == 1 ? this.data.attendance_total : 15
    });
  },
  //选择点名人数
  select_attendance_count: function (e) {
    this.setData({ attendance_count: e.detail.value });
  },
  //开始点名
  begin: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    that.setData({
      begin_ani: animation.bottom(2).step().export(),
      submit_ani: animation.bottom(2).step().export(),
      picker_attendance_type: true,
      slider_attendance_count: true,
      begin_attendance: true,
      submit_attendance: true,
      cancel_attendance: false
    });
    wx.showLoading({
      title: '加载点名列表',
    })
    wx.request({
      url: url + '/teacher/get_attendance_members?e_course_id=' + that.data.e_course_id + "&type=" + that.data.attendance_type_index + "&attendance_count=" + that.data.attendance_count,
      success: function (res) {
        wx.setNavigationBarTitle({
          title: '点名中...',
        });
        wx.hideLoading();
        that.setData({ attendancing_stu: res.data.stu, is_begin: true, button_next_stu: false, current_index: 0, absence_stu: [] });
      },
      fail: function () {
        wx.hideLoading();
        common.showMsg("出错啦");
      }
    })
  },
  //缺勤类型
  radioChange: function (e) {
    this.setData({ current_absence_type: e.detail.value });
  },
  //下一位
  next_stu: function () {
    //判断是否缺勤
    if (this.data.current_absence_type != 3) {
      this.setData({
        absence_stu: this.data.absence_stu.concat({
          "stu_id": this.data.attendancing_stu[this.data.current_index].stu_id,
          "absence_type": this.data.current_absence_type
        })
      })
    }
    //点名结束
    if (this.data.current_index + 1 == this.data.attendance_count) {
      this.setData({
        button_next_stu: true,
        submit_attendance: false
      });
      common.showMsg("已经没有啦");
      return;
    }
    //加载下一位
    this.setData({ current_index: this.data.current_index + 1, default_check: true, current_absence_type: 3 });
  },
  end_attendance: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    that.setData({
      begin_ani: animation.bottom(-80).step().export(),
      submit_ani: animation.bottom(-39).step().export(),
      picker_attendance_type: false,
      slider_attendance_count: false,
      begin_attendance: false,
      submit_attendance: false,
      cancel_attendance: true,
      is_begin: false
    });
    wx.setNavigationBarTitle({
      title: '开始考勤',
    });
  },
  //取消点名
  cancel: function () {
    var that = this;
    wx.showModal({
      title: '确认',
      content: '确定取消此次点名？',
      showCancel: true,
      confirmColor: 'red',
      success: function (res) {
        if (res.confirm) {
          that.end_attendance();
        }
      }
    })
  },
  //提交点名
  submit: function () {
    var that = this;
    wx.showLoading({
      title: '保存中...',
    });
    wx.request({
      url: url + '/teacher/save_attendance',
      header: {},
      method: 'POST',
      data: {
        "established_course_id": that.data.e_course_id,
        "attendance_type": that.data.attendance_type_index,
        "attendance_count": that.data.attendance_count,
        "absences": that.data.absence_stu
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {
          common.showMsg("保存成功", 'success');
          that.end_attendance();
        } else {
          common.showMsg("保存失败");
        }
      },
      fail: function (res) {
        wx.hideLoading();
        common.showMsg("出错啦");
      }
    })
  },
})