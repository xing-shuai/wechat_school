var common = require("../../../../utils/util.js");
Page({
  data: {
    user_type: '',
    winHeight: 0,
    winWidth: 0,
    dynamic_type: '0',
    upload_images_count: 0,
    images: [],
    upload_button_enable: false
  },
  onLoad: function (options) {
    var that = this;
    var user_type = options.user_type;
    that.setData({ user_type: user_type });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth - 20,
          winHeight: res.windowHeight
        });
      }
    });
  },
  radioChange: function (e) {
    this.setData({ dynamic_type: e.detail.value })
  },
  format_images_array: function (images) {
    var after_formated_images = [];
    var index = 0
    var length = images.length;
    if (length == 0)
      return after_formated_images;
    for (var i = 0; i < parseInt(length / 3 + 1); i++) {
      var temp = [];
      for (var j = 0; j < 3; j++) {
        temp.push(images[index]);
        index += 1;
        if (length == index)
          break;
      }
      after_formated_images.push(temp);
      if (length == index)
        break;
    }
    return after_formated_images;
  },
  deformat_images_array: function (images) {
    var after_deformated_images = [];
    for (var i = 0; i < images.length; i++)
      for (var j = 0; j < images[i].length; j++)
        after_deformated_images.push(images[i][j]);
    return after_deformated_images;
  },
  upload_image: function () {
    var that = this;
    if (that.data.upload_images_count >= 9)
      return;
    wx.chooseImage({
      count: 9 - that.data.upload_images_count,
      success: function (res) {
        that.setData({
          images: that.format_images_array(that.deformat_images_array(that.data.images).concat(res.tempFilePaths)),
          upload_images_count: that.data.upload_images_count + res.tempFilePaths.length,
          upload_button_enable: that.data.upload_images_count + res.tempFilePaths.length >= 9 ? true : false
        });
      },
    })
  },
  delete_image: function (e) {
    var images = this.deformat_images_array(this.data.images);
    images.splice(e.currentTarget.dataset.currentIndexX * 3 + e.currentTarget.dataset.currentIndexY, 1);
    this.setData({
      images: this.format_images_array(images),
      upload_images_count: images.length,
      upload_button_enable: false
    });

  },
  do_upload: function (id, images, index) {
    var that = this;
    if (images.length == 0) {
      common.showMsg("发布成功", 'success');
      return;
    }
    wx.showLoading({
      title: '正在上传第' + (index + 1) + '张图片',
    })
    wx.uploadFile({
      url: getApp().globalData.server_url + '/dynamic/upload_dynamic_image',
      filePath: images[index],
      name: 'file',
      formData: {
        'id': id,
        'dynamic_type': that.data.dynamic_type
      },
      success: function (res) {
      },
      fail: function (res) {
      },
      complete: function () {
        wx.hideLoading();
        index++;
        if (index >= images.length) {
          common.showMsg("发布成功", 'success');
          return;
        }
        else {
          that.do_upload(id, images, index);
        }
      }
    })
  },
  publish_dynamic: function (e) {
    var that = this;
    var content = e.detail.value.content;
    if (content.trim() == "")
      return
    wx.showLoading({
      title: '正在发布',
    })
    common.post_request({
      url: '/dynamic/add_dynamic',
      data: {
        content: content,
        dynamic_type: that.data.dynamic_type
      },
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {
          that.do_upload(res.data.id, that.deformat_images_array(that.data.images), 0);
        }
        else {
          common.showMsg("发布失败");
        }
      }
    });
  }
})