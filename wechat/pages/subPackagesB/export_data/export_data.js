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