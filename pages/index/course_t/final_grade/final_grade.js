var common = require("../../../../utils/util.js")
Page({
  data: {
    e_course_id: '',
    stu: [],
    host_url: getApp().globalData.server_url + '/user_head/',
    entry_status: false,
    width: 0,
    entry_students: [],
    entry_students_grade: []
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ width: res.windowWidth })
      }
    });
    that.setData({
      e_course_id: options.e_course_id
    });
    that.loadStu();
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
  start_entry: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    var that = this;
    var entry_status = this.data.entry_status;
    if (entry_status) {
      var data = {};
      var entry_students = this.data.entry_students;
      for (var i = 0; i < entry_students.length; i++) {
        data[entry_students[i]] = that.data.entry_students_grade[i];
      }
      if (entry_students.length > 0) {
        wx.showLoading({
          title: '保存中...'
        })
        common.post_request({
          url: '/teacher/save_final_grade',
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          data: {
            "grade": data,
            "e_course_id": that.data.e_course_id
          },
          success: function (res) {
            that.loadStu();
            wx.hideLoading();
          }
        });
      }
    }

    this.setData({
      entry_status: !this.data.entry_status,
      float_button: this.data.entry_status ? animation.right(26).backgroundColor('red').step().export() : animation.right((this.data.width - 60) / 2).backgroundColor('#51C332').step().export()
    });
  },
  input_blur: function (e) {
    if (!e.detail.value)
      return;
    if (e.detail.value > 100 || e.detail.value < 0) {
      common.showMsg("该成绩输入不合法");
      return;
    }
    var stu_id = e.currentTarget.dataset.stu_id;
    var entry_students = this.data.entry_students;
    var entry_students_grade = this.data.entry_students_grade;
    var index = entry_students.indexOf(stu_id);
    if (index == -1) {
      entry_students.push(stu_id);
      entry_students_grade.push(e.detail.value);
    } else {
      entry_students_grade[index] = e.detail.value;
    }
  }
})