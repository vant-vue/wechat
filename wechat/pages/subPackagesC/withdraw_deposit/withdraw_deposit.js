// pages/subPackagesC/withdraw_deposit/withdraw_deposit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPayee: '',
    cashAmount: '',
    userInfo: {}
  },
  //监听input 普通输入框
  listenerInputSimple(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  // 全部提现
  allMony() {
    this.setData({
      'cashAmount': this.data.userInfo.cashAmount / 100
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userInfo();
  },
  // 用户信息
  userInfo() {
    app.$API.userInfo({}).then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: res.args,
          isPayee: res.args.payee ? true : false
        })
      }
    })
  },
  // 提现
  wxOutMoney() {
    let str = '';
    if (!this.data.userInfo.payee) {
      wx.showToast({
        title: '请输入收款人',
        icon: 'none'
      })
      return;
    }
    if (this.data.cashAmount == '') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return;
    }
    if (this.data.cashAmount * 100 > this.data.userInfo.cashAmount) {
      wx.showToast({
        title: `提现金额应小于${this.data.userInfo.cashAmount/100}`,
        icon: 'none'
      })
      return;
    }
    let params = {
      param: {
        "outMoney": this.data.cashAmount * 100, //提现金额
        "name": this.data.userInfo.payee //实名  可空已经实名过一次的 可以为空
      }
    }
    wx.showLoading({
      title: '提现中 ',
      mask: true
    })
    app.$API.wxOutMoney(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提现成功'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask:true,
          duration: 3000
        })
      }
    }).catch(() => {
      wx.hideLoading();
    })
  },
  cancel(){
    wx.navigateBack();
  },
  //问题
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