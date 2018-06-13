var common = require("../../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    is_uploaded_image: false,
    host: url + '/lostandfound/images/',
    upload_image_name: 'default.jpg'
  },
  onLoad: function (options) {
    common.set_navi_color();
  },
  upload_image: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: url + '/lostandfound/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res_) {
            var data = JSON.parse(res_.data);
            if (data.code == 1) {
              that.setData({
                upload_image_name: data.file_name,
                is_uploaded_image: true,
              })
            }
          }
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.place.trim() == "" || e.detail.value.lost_object.trim() == "")
      return

    var data = e.detail.value;
    var reg = /^1[345789]\d{9}$/;
    if (!reg.test(data.telephone)) {
      common.showMsg("请输入正确的联系方式");
      return;
    }
    data["img_url"] = that.data.upload_image_name;
    common.post_request({
      url: '/lostandfound/add_lost',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      data: data,
      success: function (res) {
        if (res.data.code == 1) {
          common.showMsg("发布成功", 'success');
          wx.navigateBack();
        }
      }
    })
  },
  cancel_publish: function () {
    wx.navigateBack();
  }
})