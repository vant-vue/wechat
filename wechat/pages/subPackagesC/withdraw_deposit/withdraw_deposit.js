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
    app.$API.assetInfo({}).then(res => {
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
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (this.data.cashAmount == '') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (this.data.cashAmount * 100 > this.data.userInfo.cashAmount) {
      wx.showToast({
        title: `提现金额应小于${this.data.userInfo.cashAmount/100}`,
        icon: 'none',
        duration: 3000
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
          title: '提现成功',
          duration: 3000
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true,
          duration: 3000
        })
      }
    }).catch(() => {
      wx.hideLoading();
    })
  },
  cancel() {
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