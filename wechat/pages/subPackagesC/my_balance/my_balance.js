// pages/subPackagesC/my_balance/my_balance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "outMoney": "0", //提现中 单位分
    "waitMoney": "0", //待结算 单位分
    "cashAmount": "0", //余额 单位分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.assetInfo();
  },
  assetInfo() {
    app.$API.assetInfo({}).then(res => {
      if(res.code == 200){
        this.setData({
          outMoney: res.args.cashAmount,
          waitMoney: res.args.waitMoney,
          cashAmount: res.args.cashAmount,
        })
      }
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let url = '';
    switch (page) {
      case 'income_detail':
        url = '/pages/subPackagesC/income_detail/income_detail';
        break;
      case 'withdraw_deposit':
        url = '/pages/subPackagesC/withdraw_deposit/withdraw_deposit';
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

  }
})