var common = require("../../../../../utils/util.js");
Page({
  data: {
    mode: '0',
    noti_id: '',
    title: '',
    time: '',
    content: '',
    e_course_id: ''
  },
  onLoad: function (options) {
    this.setData({
      mode: options.mode,
      noti_id: options.mode == '0' ? options.noti_id : '',
      e_course_id: options.mode == '1' ? options.e_course_id : ''
    });
    var title = '通知内容'
    if (this.data.mode == "1")
      title = '新增通知';
    wx.setNavigationBarTitle({
      title: title
    });
    var that = this;
    if (that.data.mode == '0')
      common.get_request({
        url: '/teacher/load_noti_content?id=' + that.data.noti_id,
        success: function (res) {
          if (res.data.code == 1) {
            that.setData({
              title: res.data.title,
              time: res.data.time,
              content: res.data.content
            })
          }
        }
      })
  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.title.trim() == "")
      return
    common.post_request({
      url: '/teacher/add_noti',
      data: {
        form: e.detail.value,
        e_course_id: that.data.e_course_id
      },
      success: function (res) {
        if (res.data.code == 1) {
          common.showMsg("发送成功", 'success');
          wx.navigateBack();
        }
      }
    })
  },
  formReset: function () {
    wx.navigateBack();
  }
})