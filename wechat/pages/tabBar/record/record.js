// pages/tabBar/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1
  },
  toggle(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      'tab': tab
    })
  },
  // 滚动加载
  scrollBottom: function (e) {
    console.log(e);
    // if (!this.data.last) {
    //   this.setData({
    //     'show_loading': true,
    //     'pageData.page': this.data.pageData.page + 1
    //   })
    //   this.get_news_list();
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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