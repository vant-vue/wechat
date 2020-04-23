// pages/tabBar/center/center.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashAmount: '0.00',//余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 账户余额信息（assetInfo）
  assetInfo(){
    app.$API.assetInfo({}).then(res => {
      console.log(res);
      if(res.code == 200){
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.assetInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleContact(e){
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
})