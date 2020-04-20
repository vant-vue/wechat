// pages/subPackagesC/order_details/order_details.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    goodsList: [], //商品信息  
    logistics: {}, //物流信息
    refundList: [] //退款信息  可空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_details(options.id);
  },
  get_details(id) {
    let params = {
      param: {
        "orderId": id, //订单主键
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.$API.orderDetail(params).then(res => {
      // if (res.code == 200) {
      this.setData({
        goodsList: res.args.goodsList,
        logistics: res.args.logistics,
        refundList: res.args.refundLis ? res.args.refundList:[],
      })

      // }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  // 取消订单
  // refund_fun() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '确认退款给客户吗？',
  //     success(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  // 取消订单
  // cancel_fun() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定取消客户的订单吗？',
  //     success(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
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