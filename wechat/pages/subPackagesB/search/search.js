// pages/subPackagesB/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRemark: false, //备注条件
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
      "solitaireId": '', //接龙主键
      "status": '', //订单状态  -1取消 0进行中  1已完成  可空
      "hasRemark": '', //是否有备注  0 OR 1  可空
      "orderDate": "", //下单日期 可空
      "refundStatus": '', //退款状态  0未退款  1有退款
      'search': ''
    },
    orderManagerList: [],
    last: false,
  },
  //监听input 普通输入框
  listenerInputSimple(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  remark_fun(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      isRemark: true
    });
    let remark = this.selectComponent('#remark');
    remark.data.id = id;
  },
  // 复制
  copy(e) {
    let item = e.currentTarget.dataset.item;
    let str = `${item.logistics.name}，${item.logistics.phone}，${item.logistics.provice ? item.logistics.provice : '' + item.logistics.city ? item.logistics.city : '' + item.logistics.area ? item.logistics.area : '' + item.logistics.address ? item.logistics.address : ''}`
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
  // 修改状态
  editStatus(id, status) {
    let params = {
      param: {
        "orderIds": id, //订单ID集合
        "solitaireId": this.data.param.solitaireId, //接龙ID
        "status": status, //订单状态 -1取消 0进行中  1已完成
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    });

    app.$API.editStatus(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '修改成功',
          duration: 3000
        });
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 3000
        });
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 确定取货
  already_fun(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认订单已发货/取货吗？',
      success(res) {
        if (res.confirm) {
          that.editStatus(id, 1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 备注
  remark_ok(e) {
    if (!e.detail.value) {
      wx.showToast({
        title: '请填写备注',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    this.editRemark(e.detail.id, e.detail.value);
  },

  // 获取订单列表
  get_list() {
    let params = {
      param: {
        "pageNo": this.data.param.pageNo, //页数
        "pageSize": this.data.param.pageSize, //单页记录数
        "solitaireId": this.data.param.solitaireId, //接龙主键
        "status": this.data.param.status, //订单状态  -1取消 0进行中  1已完成  可空
        "hasRemark": this.data.param.hasRemark, //是否有备注  0 OR 1  可空
        "orderDate": this.data.param.orderDate, //下单日期 可空
        "refundStatus": this.data.param.refundStatus, //退款状态  0未退款  1有退款
        "search": this.data.param.search //接龙号  接龙名称 参与接龙名称 订单编号  参与接龙手机号
      }
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.data.orderManagerList = [];
    app.$API.orderManagerList(params).then(res => {
      res.args.orderManagerList.forEach(item => {
        item.checked = false;
      })
      this.setData({
        orderManagerList: this.data.orderManagerList.concat(res.args.orderManagerList ? res.args.orderManagerList : [])
      });
      if (res.args.orderManagerList.length < 10) {
        this.data.last = true;
      } else {
        this.data.last = false;
      }
      console.log(this.data.orderManagerList);
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
  // 修改备注
  editRemark(id, remark) {
    let params = {
      param: {
        "orderIds": id, //订单ID集合
        "solitaireId": this.data.param.solitaireId, //接龙ID
        "remarks": remark, //备注信息 不可为空
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    });
    app.$API.editRemark(params).then(res => {
      if (res.code == 200) {
        this.clear_filter();
        this.get_list();
        wx.showToast({
          title: '修改成功',
          duration: 3000
        });
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 3000
        });
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 批量修改备注
  batch_remark() {
    let idArr = [];
    this.data.orderManagerList.forEach(item => {
      if (item.checked) {
        idArr.push(item.id);
      }
    });
    if (idArr.length == 0) {
      wx.showToast({
        title: '请选择订单',
        icon: 'none',
        duration: 3000
      })
      return
    };
    let id = idArr.join(',');
    this.setData({
      isRemark: true
    });
    let remark = this.selectComponent('#remark');
    remark.data.id = id;
  },
  // 批量取货
  batch_pick() {
    let that = this;
    let idArr = [];
    this.data.orderManagerList.forEach(item => {
      if (item.checked) {
        idArr.push(item.id);
      }
    });
    if (idArr.length == 0) {
      wx.showToast({
        title: '请选择订单',
        icon: 'none',
        duration: 3000
      })
      return
    };
    let id = idArr.join(',');
    wx.showModal({
      title: '提示',
      content: '确认订单批量已发货/取货吗？',
      success(res) {
        if (res.confirm) {
          that.editStatus(id, 1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 批量修改备注
  batch_remark() {
    let idArr = [];
    this.data.orderManagerList.forEach(item => {
      if (item.checked) {
        idArr.push(item.id);
      }
    });
    if (idArr.length == 0) {
      wx.showToast({
        title: '请选择订单',
        icon: 'none',
        duration: 3000
      })
      return
    };
    let id = idArr.join(',');
    this.setData({
      isRemark: true
    });
    let remark = this.selectComponent('#remark');
    remark.data.id = id;
  },
  // 初始条件
  clear_filter() {
    this.data.param.pageNo = 1;
    this.data.orderManagerList = [];
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.param.solitaireId = options.id;
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let id = e.currentTarget.dataset.id;
    let url = '';
    switch (page) {
      case 'order_details':
        url = '/pages/subPackagesB/order_details/order_details?id=' + id
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