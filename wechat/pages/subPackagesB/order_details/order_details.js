// pages/subPackagesB/order_details/order_details.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    goodsList: [],
    order: {},
    refundList: [],
    logistics: {},
    userInfo: {},
    isMine: null,
    callPhone: '',
    refundMoney: null //退款金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.orderId = options.id;
    this.get_details();
  },
  // 打电话
  callPhone_fun() {
    wx.makePhoneCall({
      phoneNumber: this.data.callPhone ? this.data.callPhone : '' //仅为示例，并非真实的电话号码
    })
  },
  // 获取数据
  get_details() {
    let params = {
      param: {
        "orderId": this.data.orderId, //订单主键
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.$API.orderDetail(params).then(res => {
      // if (res.code == 200) {
      this.setData({
        goodsList: res.args.goodsList ? res.args.goodsList : [],
        order: res.args.order ? res.args.order : {},
        refundList: res.args.refundLis ? res.args.refundList : [],
        logistics: res.args.logistics ? res.args.logistics : {},
        userInfo: res.args.userInfo ? res.args.userInfo : {},
        isMine: res.args.isMine,
        callPhone: res.args.callPhone,
      })
      // }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  //监听input 商品
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  remark_fun(e) {
    let id = this.data.order.id;
    this.setData({
      isRemark: true
    });
    let remark = this.selectComponent('#remark');
    remark.data.id = id;
  },
  // 备注
  remark_ok(e) {
    if (!e.detail.value) {
      wx.showToast({
        title: '请填写备注',
        icon: 'none'
      })
      return;
    }
    this.editRemark(e.detail.id, e.detail.value);
  },
  // 修改备注
  editRemark(id, remark) {
    let params = {
      param: {
        "orderIds": id, //订单ID集合
        "solitaireId": this.data.order.solitaireId, //接龙ID
        "remarks": remark, //备注信息 不可为空
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    });
    app.$API.editRemark(params).then(res => {
      if (res.code == 200) {
        this.get_details();
        wx.showToast({
          title: '修改成功'
        });
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        });
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  //  修改订单状态  （editStatus）
  editStatus(id, status) {
    let params = {
      param: {
        "orderIds": id, //订单ID集合
        "solitaireId": this.data.order.solitaireId, //接龙ID
        "status": status, //订单状态 -1取消 0进行中  1已完成
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    });

    app.$API.editStatus(params).then(res => {
      if (res.code == 200) {
        this.get_details();
        wx.showToast({
          title: '修改成功'
        });
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        });
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 确定取货popup
  already_fun(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认订单已发货/取货吗？',
      success(res) {
        if (res.confirm) {
          that.editStatus(that.data.order.id, 1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 取消订单popup
  cancel_fun() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消客户的订单吗？',
      success(res) {
        if (res.confirm) {
          that.editStatus(that.data.order.id, -1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 微信退款（updateWxRefund）
  updateWxRefund(id, refundMoney) {
    let params = {
      param: {
        "orderId": id, //退款订单ID
        "solitaireId": this.data.order.solitaireId, //接龙ID
        "refundMoney": refundMoney //退款金额 单位分  前端做最大不能超过（订单金额 - 已退款金额）的判定
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    });
    app.$API.updateWxRefund(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '退款成功'
        });
        this.get_details();
      } else {
        wx.showToast({
          title: '退款失败',
          icon: 'none'
        });
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 退款popup
  refund_fun(e) {
    console.log(this.data.refundMoney)
    if (!this.data.refundMoney) {
      wx.showToast({
        title: '请输入退款金额',
        icon: 'none'
      })
      return;
    }
    if (this.data.refundMoney > this.data.order.payMoney) {
      wx.showToast({
        title: '退款金额应小于支付金额',
        icon: 'none'
      })
      return;
    }
    if (this.data.refundMoney < 0) {
      wx.showToast({
        title: '退款金额应大于0',
        icon: 'none'
      })
      return;
    }
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认退款给客户吗？',
      success(res) {
        if (res.confirm) {
          that.updateWxRefund(that.data.order.id, that.data.refundMoney);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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