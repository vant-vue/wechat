// pages/subPackagesB/export_data/export_data.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId: '',
    excelUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.solitaireId = options.id;
    this.createExcel();
  },
  // 复制
  copy(e) {
    let item = e.currentTarget.dataset.item;
    let str = this.data.excelUrl;
    wx.setClipboardData({
      data: str,
      success: function() {
        // 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
        wx.showToast({
          title: '复制成功',
          duration: 3000
        })
        wx.getClipboardData({
          success: function(res) {
            console.log(res);
          }
        })
      }
    })
  },

  // 生成excel表格（createExcel）
  createExcel() {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙ID
      }
    }
    app.$API.createExcel(params).then(res => {
      if (res.code == 200) {
        this.setData({
          excelUrl: res.args.excelUrl
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading()
    }).catch(() => {})
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