// pages/subPackagesA/group_buying_solitaire/group_buying_solitaire.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadList:[]
  },
  // 上传图片组件返回的数据
  get_img_list(e) {
    console.log(e);
    this.data.uploadList = e.detail;
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let url = '';
    switch (page) {
      case 'editDetails':
        url = '/pages/subPackagesA/editDetails/editDetails';
        break;
      case 'logistics_mode':
        url = '/pages/subPackagesA/logistics_mode/logistics_mode';
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