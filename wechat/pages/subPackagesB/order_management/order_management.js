// pages/subPackagesB/order_management/order_management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    isBatch:false,
    isFilter:false,//筛选条件
    isRemark:false,//备注条件
    searchValue:''
  },
  toggle(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      'tab': tab
    })
  },
  filter_fun(){
    this.setData({
      isFilter:true
    })
  },
  remark_fun(){
    this.setData({
      isRemark:true
    })
  },
  // 确定取货
  already_fun(){
    wx.showModal({
      title: '提示',
      content: '确认订单已发货/取货吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //批量切换
  batch_toggle(){
    this.setData({
      isBatch: !this.data.isBatch
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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