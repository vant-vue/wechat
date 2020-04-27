// pages/tabBar/center/center.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashAmount: '0.00', //余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 功能开发中，尽请期待
  wait() {
    wx.showModal({
      title: '提示',
      content: '功能开发中，尽请期待',
    })
  },
  // 账户余额信息（assetInfo）
  assetInfo() {
    app.$API.assetInfo({}).then(res => {
      console.log(res);
      if (res.code == 200) {
        this.setData({
          cashAmount: res.args.cashAmount
        })
      }
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let url = '';
    switch (page) {
      case 'my_balance':
        url = '/pages/subPackagesC/my_balance/my_balance';
        break;
      case 'order_bought':
        url = '/pages/subPackagesC/order_bought/order_bought';
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.assetInfo();
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
      path: '//pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
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