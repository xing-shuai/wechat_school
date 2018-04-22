var url = getApp().globalData.server_url;
var common = require('../../../../../utils/util.js')

Page({
  data: {
    absences: [],
    height: 0,
    absence_type: ['请假', '迟到', '缺勤'],
    attendance_id: ''
  },
  loadList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url + '/teacher/get_absence_stu?attendance_id=' + that.data.attendance_id,
      // header: {
      //   'cookie': wx.getStorageSync("sessionid")
      // },
      success: function (res) {
        wx.hideLoading();
        that.setData({ absences: res.data.data });
      },
      fail: function () {
        wx.hideLoading();
        common.showMsg('出错啦');
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '考勤同学',
    });
    this.setData({ attendance_id: options.attendance_id });
    this.loadList();
  },
  press: function (e) {
    var that = this;
    var absenceId = e.currentTarget.dataset.absenceId;
    var modify_absence = function (modify_type) {
      wx.request({
        url: url + '/teacher/modify_absence?absence_id=' + absenceId + "&type=" + modify_type,
        // header: {
        //   'cookie': wx.getStorageSync("sessionid")
        // },
        success: function (res) {
          if (res.data.code == 1) {
            common.showMsg('修改成功', "success");
            that.loadList();
          } else {
            common.showMsg('修改失败');
          }
        },
        fail: function () {
          common.showMsg('修改失败');
        }
      })
    }
    wx.showActionSheet({
      itemList: ["请假", "迟到", "缺勤", "删除"],
      success: function (res) {
        if (res.tapIndex == 3) {
          wx.showModal({
            title: '确认',
            content: '确认删除此缺勤记录吗？',
            showCancel: true,
            confirmText: '删除',
            confirmColor: 'red',
            success: function (res_) {
              if (res_.confirm)
                modify_absence("3");
            }
          })
        } else {
          wx.showModal({
            title: '确认',
            content: '确认修改此缺勤记录为' + that.data.absence_type[res.tapIndex] + "吗？",
            showCancel: true,
            confirmText: '更改',
            success: function (res_) {
              if (res_.confirm)
                modify_absence(res.tapIndex.toString());
            }
          })
        }
      }
    })
  },
  check_stu: function () {

  }
})