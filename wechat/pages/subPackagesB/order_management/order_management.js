// pages/subPackagesB/order_management/order_management.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: "all",
    isBatch: false,
    isFilter: false, //筛选条件
    isRemark: false, //备注条件
    searchValue: '',
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
      "solitaireId": '', //接龙主键
      "status": '', //订单状态  -1取消 0进行中  1已完成  可空
      "hasRemark": '', //是否有备注  0 OR 1  可空
      "orderDate": "", //下单日期 可空
      "refundStatus": '', //退款状态  0未退款  1有退款
    },
    orderManagerList: [],
    last: false,
    statistics: {},
    isAll: false
  },
  toggle(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      'tab': tab
    })
    this.clear_filter();
    this.get_list();
  },
  filter_fun() {
    this.setData({
      isFilter: true
    })
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
    let str = `${item.logistics.name}，${item.logistics.phone}，${item.logistics.provice?item.logistics.provice:''+item.logistics.city?item.logistics.city:''+item.logistics.area?item.logistics.area:''+item.logistics.address?item.logistics.address:''}`
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
  //批量切换
  batch_toggle() {
    this.setData({
      isBatch: !this.data.isBatch
    })
  },
  // 刷选
  filter_ok(e) {
    this.data.param.hasRemark = e.detail.hasRemark;
    this.data.param.refundStatus = e.detail.refundStatus;
    this.data.param.orderDate = e.detail.orderDate;
    this.clear_filter();
    this.get_list();
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

  // 获取数据统计
  get_statistics() {
    let params = {
      param: {
        "solitaireId": this.data.param.solitaireId, //接龙主键
      }
    };
    app.$API.statistics(params).then(res => {
      this.setData({
        statistics: res.args.statistics
      });

    }).catch(() => {})
  },
  // 获取订单列表
  get_list() {
    let params = {
      param: {
        "pageNo": this.data.param.pageNo, //页数
        "pageSize": this.data.param.pageSize, //单页记录数
        "solitaireId": this.data.param.solitaireId, //接龙主键
        "status": this.data.tab == "all" ? '' : this.data.tab, //订单状态  -1取消 0进行中  1已完成  可空
        "hasRemark": this.data.param.hasRemark, //是否有备注  0 OR 1  可空
        "orderDate": this.data.param.orderDate, //下单日期 可空
        "refundStatus": this.data.param.refundStatus, //退款状态  0未退款  1有退款
      }
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
  // 单选
  one_checked(e) {
    let index = e.currentTarget.dataset.index;
    this.data.orderManagerList.forEach((item, i) => {
      if (i == index) {
        item.checked = !item.checked;
      }
    })
    this.setData({
      orderManagerList: this.data.orderManagerList
    });
  },
  // 全选
  all_checked(e) {
    if (e.detail.value.length > 0) {
      this.data.orderManagerList.forEach(item => {
        item.checked = true;
      })
      this.setData({
        orderManagerList: this.data.orderManagerList
      });
    } else {
      this.data.orderManagerList.forEach(item => {
        item.checked = false;
      })
      this.setData({
        orderManagerList: this.data.orderManagerList
      });
    }
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
        icon: 'none'
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
        icon: 'none'
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
        icon: 'none'
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
    this.get_statistics();
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let id = e.currentTarget.dataset.id;
    let url = '';
    switch (page) {
      case 'data_statistics':
        url = '/pages/subPackagesB/data_statistics/data_statistics?id=' + this.data.param.solitaireId;
        break;
      case 'order_details':
        url = '/pages/subPackagesB/order_details/order_details?id=' + id
        break;
      case 'search':
        url = '/pages/subPackagesB/search/search?id=' + this.data.param.solitaireId
        break;
      case 'export_data':
        url = '/pages/subPackagesB/export_data/export_data?id=' + this.data.param.solitaireId
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
    this.get_list();
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