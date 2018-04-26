var common = require("../../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    losts: [],
    host: url + '/lostandfound/images/',
    longpress_lost_id: ''
  },
  load_list: function () {
    var that = this;
    common.get_request({
      url: '/lostandfound/load_mylost',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        that.setData({ losts: res.data.data });
      }
    });
  },
  onLoad: function (options) {
    common.set_navi_color();
    this.load_list();
  },
  preview_image: function (e) {
    wx.previewImage({
      urls: [this.data.host + e.currentTarget.dataset.url]
    })
  },
  modify_lost: function (e) {
    this.setData({ longpress_lost_id: e.currentTarget.dataset.id });
    var that = this;
    wx.showActionSheet({
      itemList: ["未认领", '失主已认领', '删除'],
      success: function (res) {
        if (res.tapIndex != 2) {
          common.get_request({
            url: '/lostandfound/modify_lost?id=' + that.data.longpress_lost_id + "&option=" + res.tapIndex.toString(),
            success: function (res_) {
              if (res_.data.code == 1) {
                common.showMsg("认领成功", 'success');
                that.load_list();
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确认删除?',
            confirmText: '删除',
            confirmColor: 'red',
            success: function (res) {
              if (res.confirm) {
                common.get_request({
                  url: '/lostandfound/delete_lost?id=' + that.data.longpress_lost_id,
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
      }
    })
  }
})