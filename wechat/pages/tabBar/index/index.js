// pages/tabBar/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_index: 0, //当前轮播图(顶部) 显示 index
    banner_list: [],
    height:0
  },
  get_wxml: function (className, callback) {
    wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
  },
  //跳转
  jump(e) {
    if (!app.globalData.isLogin){
      wx.navigateTo({
        url:'/pages/tabBar/login/login'
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
      spaceId: 9
    }
    app.$API.banner(params).then(res => {
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
  onShareAppMessage: function() {

  }
})