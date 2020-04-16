// pages/subPackagesC/order_bought/order_bought.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'all',
    isFilter: false, //筛选条件
    list: [],
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
      "status": '' //订单状态 可空  -1取消 0进行中  1已完成
    },
    last: false,
  },
  toggle(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      'tab': tab
    });
    this.data.list = [];
    this.load_data();
  },
  filter_fun() {
    this.setData({
      isFilter: true
    })
  },
  load_data() {
    let params = {
      param: {
        "pageNo": this.data.param.pageNo, //页数
        "pageSize": this.data.param.pageSize, //单页记录数
        "status": this.data.tab == 'all' ? '' : this.data.tab //订单状态 可空  -1取消 0进行中  1已完成
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    app.$API.myOrder(params).then(res => {
      if (res.code == 200) {
        this.setData({
          list: this.data.list.concat(res.args.orderList)
        })
        if (res.args.orderList.length < 10) {
          this.data.last = true;
        } else {
          this.data.last = false;
        }
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  // 滚动加载
  scrollBottom: function(e) {
    if (!this.data.last) {
      this.data.param.pageNo += 1;
      this.load_data();
    }
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let id = e.currentTarget.dataset.id;
    let url = '';
    switch (page) {
      case 'order_details':
        url = '/pages/subPackagesC/order_details/order_details?id=' + id;
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.load_data();
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