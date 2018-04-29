var common = require("../../../../utils/util.js");
var url = getApp().globalData.server_url;
Page({
  data: {
    dynamic_id: '1c9560e8-49fc-11e8-bd1e-f46d04228b99',
    images_height: 0,
    images_host: url + "/dynamic/images/",
    user_head_host: url + "/user_head/",
    is_show: false,
    dynamic_data: {},
    comment: [],
    has_next_page: true,
    cur_page: 0,
    comment_input: ''
  },
  onLoad: function (options) {
    common.set_navi_color();
    var that = this;
    that.setData({ dynamic_id: options.id });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          images_height: parseInt(res.windowWidth * 0.32)
        });
        common.get_request({
          url: '/dynamic/load_dynamic_detail?id=' + that.data.dynamic_id,
          success: function (res) {
            that.setData({ dynamic_data: res.data.data[0], is_show: true });
            //加载评论
            common.get_request({
              url: '/dynamic/load_comment?page=' + (that.data.cur_page + 1).toString() + "&id=" + that.data.dynamic_id,
              success: function (res) {
                if (res.data.has_next_page) {
                  that.setData({ comment: res.data.data, has_next_page: true, cur_page: that.data.cur_page + 1 });
                  return;
                }
                that.setData({ comment: res.data.data, has_next_page: false });
                wx.hideNavigationBarLoading();
              }
            })
          }
        })
      }
    });
  },
  //预览校园动态照片
  preview_images: function (e) {
    var dataset = e.currentTarget.dataset;
    var urls = [];
    var current = "";
    if (dataset.mode == "0") {
      url = this.data.dynamic_data.images[0][0]
      urls.push(url);
      current = url;
    }
    else {
      var t = this.data.dynamic_data.images;
      current = t[dataset.currentIndexX][dataset.currentIndexY];
      for (var i = 0; i < t.length; i++) {
        urls = urls.concat(t[i]);
      }
    }
    wx.previewImage({
      urls: urls,
      current: current
    })
  },
  //取消收藏校园动态
  uncollect: function (e) {
    var that = this;
    var data = that.data.dynamic_data;
    common.get_request({
      url: '/dynamic/uncollect_school_dynamic?collection_id=' + data.collection_id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data.collection_id = "";
          data.heart_count -= 1;
          that.setData({ dynamic_data: data });
        }
      }
    })
  },
  //收藏校园动态
  collect: function (e) {
    var that = this;
    var data = that.data.dynamic_data;
    common.get_request({
      url: '/dynamic/collect_school_dynamic?collection_id=' + data.id,
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          data.collection_id = res.data.id;
          data.heart_count += 1;
          that.setData({ dynamic_data: data });
        }
      }
    })
  },
  scrolltolower: function () {
    var that = this;
    if (that.data.has_next_page) {
      wx.showNavigationBarLoading();
      common.get_request({
        url: '/dynamic/load_comment?page=' + (that.data.cur_page + 1).toString() + "&id=" + that.data.dynamic_id,
        success: function (res) {
          if (res.data.has_next_page) {
            that.setData({ comment: that.data.comment.concat(res.data.data), cur_page: that.data.cur_page + 1 });
            wx.hideNavigationBarLoading();
            return;
          }
          that.setData({ comment: that.data.comment.concat(res.data.data), has_next_page: false });
          wx.hideNavigationBarLoading();
        }
      })
    }
  },
  input_blur: function (e) {
    this.setData({ comment_input: e.detail.value });
  },
  send_comment: function () {
    var comment_input = this.data.comment_input;
    if (comment_input.trim() == "")
      return;
    var that = this;
    common.post_request({
      url: '/dynamic/comment',
      data: {
        comment: comment_input,
        id: that.data.dynamic_id
      },
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          var dynamic_data = that.data.dynamic_data;
          dynamic_data.comment_count += 1;
          that.setData({
            comment: [],
            has_next_page: true,
            cur_page: 0,
            comment_input: '',
            dynamic_data: dynamic_data
          });
          that.scrolltolower();
        }
      }
    })
  }
})