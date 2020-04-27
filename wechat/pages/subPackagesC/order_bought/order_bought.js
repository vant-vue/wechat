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
      mask: true
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
        // 发个接龙
      case 'add_solitaire':
        // if (this.data.tab == 1) {
        url = '/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire';
        // } else if (this.data.tab == 2) {
        //   url = '/pages/subPackagesA/chipped_solitaire/chipped_solitaire';
        // }
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