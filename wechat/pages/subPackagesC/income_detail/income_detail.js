// pages/subPackagesC/income_detail/income_detail.js
const app = getApp();
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isFilter: false,
    date: '',
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
      "type": "", //交易类型 多选 可空  1收款 2充值 3退款 4退款手续费 5消费 6提现 7退款给参与接龙的 8平台手续费
      "yearMonthStr": util.formatTime(new Date(), 'month') //月份参数  不可空
    },
    last: false,
    "sy": 0, //收入    
    "zc": 0 //支出
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.monthBudget();
    this.dealRecord();
  },
  filter_fun() {
    this.setData({
      isFilter: true
    })
  },
  ok(e) {
    this.setData({
      list: [],
      'param.pageNo': 1
    })
    this.data.param.type = e.detail.join(',');
    this.dealRecord();
  },
  // 交易明细（dealRecord）
  dealRecord() {
    let params = {
      param: this.data.param
    }
    wx.showLoading({
      title: '加载中',
    })
    app.$API.dealRecord(params).then(res => {
      if (res.code == 200) {
        this.setData({
          list: this.data.list.concat(res.args.dealRecord)
        })
        if (res.args.dealRecord.length < 10) {
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
  // 月度收支总额 （monthBudget）
  monthBudget() {
    let params = {
      param: {
        yearMonthStr: this.data.param.yearMonthStr
      }
    }
    app.$API.monthBudget(params).then(res => {
      if (res.code == 200) {
        this.setData({
          sy: res.args.sy,
          zc: res.args.zc
        })
      }
    }).catch(err => {})
  },
  bindDateChange: function(e) {
    this.setData({
      'list': [],
      'param.pageNo': 1,
      'param.yearMonthStr': e.detail.value
    })
    this.monthBudget();
    this.dealRecord();
  },
  // 滚动加载
  scrollBottom: function(e) {
    if (!this.data.last) {
      this.data.param.pageNo += 1;
      this.dealRecord();
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
  onShareAppMessage: function() {

  }
})