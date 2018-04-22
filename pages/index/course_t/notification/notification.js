var common = require("../../../../utils/util.js");

Page({
  data: {
    e_course_id: 'db048f31-3a35-11e8-8bfe-f46d04228b99',
    notifications: []
  },
  onLoad: function (options) {
    this.setData({ e_course_id: options.e_course_id });
  },
  load_list: function () {
    var that = this;
    common.get_request({
      url: "/teacher/load_e_course_nitification?e_course_id=" + that.data.e_course_id,
      success: function (res) {
        that.setData({ notifications: res.data });
      }
    });
  },
  onShow: function () {
    this.load_list();
  },
  add_notification: function () {
    wx.navigateTo({
      url: 'notiop/notiop?mode=1&e_course_id=' + this.data.e_course_id,
    })
  },
  delete_noti: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      itemColor: 'red',
      success: function (res) {
        if (res.tapIndex === 0)
          wx.showModal({
            title: '提示',
            content: '确认删除?',
            confirmText: '删除',
            confirmColor: 'red',
            success: function (res) {
              if (res.confirm) {
                common.get_request({
                  url: '/teacher/delete_noti?id=' + e.currentTarget.dataset.id,
                  success: function (res_) {
                    if (res_.data.code == 1) {
                      common.showMsg("删除成功", 'success');
                      that.load_list();
                    }
                  }
                })
              }
            }
          })
      }
    })
  }
})