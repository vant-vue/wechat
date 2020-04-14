// pages/subPackagesC/income_detail/income_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFilter: false,
    date:'',
    param:{
      "pageNo": 1,  //页数
      "pageSize": 10, //单页记录数
      "type": "1,2",  //交易类型 多选 可空  1收款 2充值 3退款 4退款手续费 5消费 6提现 7退款给参与接龙的 8平台手续费
      "yearMonthStr": "2020-03" //月份参数  不可空
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.dealRecord();
  },
  filter_fun() {
    this.setData({
      isFilter: true
    })
  },
  // 交易明细（dealRecord）
  dealRecord() {
    let params = {
      param: this.data.param
    }
    app.$API.dealRecord(params).then(res => {
      console.log(res);
      if (res.code == 200) {
        this.setData({
          
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
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