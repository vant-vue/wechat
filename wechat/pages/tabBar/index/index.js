// pages/tabBar/index/index.js
import config from "./../../../utils/config.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0, //当前轮播图(顶部) 显示 index
    banner_list: [],
    height: 0,
    imgheights: [],
    imgwidth: 750,
  },
  get_wxml: function(className, callback) {
    wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
  },
  //跳转
  jump(e) {
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/tabBar/login/login'
      });
      return;
    }
    let page = e.currentTarget.dataset.page;
    let url = '';
    switch (page) {
      case 'group':
        url = '/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire';
        break;
      case 'chipped':
        url = '/pages/subPackagesA/chipped_solitaire/chipped_solitaire';
        break;
    }
    if (url.match('tabBar')) {
      wx.switchTab({
        url
      })
    } else {
      wx.navigateTo({
        url
      })
    }
  },
  // 获取banner
  get_banner() {
    let params = {
      spaceId: 10
    }
    app.$API.banner(params).then(res => {
      if (res.list) {
        res.list.forEach(item => {
          item.imageAttr = item.imageAttr.indexOf("|") == 0 ? item.imageAttr.substring(1) : item.imageAttr;
          item.imageAttr = config.api_url + item.imageAttr;
        });
      }
      this.setData({
        banner_list: res.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_banner();
  },
  imageLoad: function(e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights[e.target.dataset['index']] = imgheight; // 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      // title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/center/zf.jpeg',
      success: function() { // 转发成功之后的回调
      },
      fail: function() { // 转发失败之后的回调
      },
      complete: function() {}
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // 此处可以修改 shareObj 中的内容
      // shareObj.path = ''
    }
    // 返回shareObj
    return shareObj;
  }
})