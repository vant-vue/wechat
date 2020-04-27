// pages/subPackagesB/data_statistics/data_statistics.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId: '',
    statistics: {},
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
    },
    last: false,
    vlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.solitaireId = options.id;
    this.get_list();
    this.get_statistics();
  },
  // 获取数据统计
  get_statistics() {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙主键
      }
    };
    app.$API.statistics(params).then(res => {
      this.setData({
        statistics: res.args.statistics
      });
    }).catch(() => {})
  },
  // 浏览数据
  get_list() {
    let params = {
      param: {
        "pageNo": this.data.param.pageNo, //页数
        "pageSize": this.data.param.pageSize, //单页记录数
        "solitaireId": this.data.solitaireId //接龙主键  
      }
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.$API.visitList(params).then(res => {
      this.setData({
        vlist: this.data.vlist.concat(res.args.vlist ? res.args.vlist : [])
      });
      if (res.args.vlist.length < 10) {
        this.data.last = true;
      } else {
        this.data.last = false;
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 滚动加载
  scrollBottom: function(e) {
    if (!this.data.last) {
      this.data.param.pageNo += 1;
      this.get_list();
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
  onShareAppMessage: function (options) {
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      // title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '//pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/center/zf.jpeg',
      success: function () { // 转发成功之后的回调
      },
      fail: function () { // 转发失败之后的回调
      },
      complete: function () { }
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