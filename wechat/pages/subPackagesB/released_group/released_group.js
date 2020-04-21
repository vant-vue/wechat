// pages/subPackagesB/released_group/released_group.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId: '',
    banner_list: [],
    show_popup: false,
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
      "solitaireId": '', //接龙主键
    },
    solitaireList: [],
    solitaire: {},
    logistics: {},
    goodsList: [],
    info: {},
    isMine: '',
    shop_num: 0,
    shop_price: 0
  },
  // 计算
  callChangeCount(e) {
    let obj = JSON.parse(JSON.stringify(e.detail));
    let all_num = 0,
      all_price = 0;
    this.data.goodsList.forEach(item => {
      if (obj.code == item.id) {
        item.num = obj.count;
      }
      if (item.num > 0) {
        all_num += item.num;
        all_price += item.num * item.price
      }
    });
    this.setData({
      shop_num: all_num,
      shop_price: all_price,
      goodsList: this.data.goodsList
    })
  },
  // 获取详情
  get_details(id) {
    let params = {
      param: {
        solitaireId: id
      }
    }
    app.$API.mySolitaire(params).then(res => {
      this.setData({
        solitaire: res.args.solitaire,
        logistics: res.args.logistics,
        goodsList: res.args.goodsList,
        info: res.args.info,
        isMine: res.args.isMine,
        banner_list: res.args.solitaire.img ? res.args.solitaire.img.split(';') : []
      })
    })
  },
  // 接龙列表
  get_list() {
    let params = {
      param: {
        "pageNo": 1, //页数
        "pageSize": 10, //单页记录数
        "solitaireId": this.data.solitaireId, //接龙主键
      }
    }
    app.$API.solitaireList(params).then(res => {
      this.setData({
        solitaireList: res.args.solitaireList
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.solitaireId = options.id;
    this.get_details(options.id);
    this.get_list();
  },
  // 转发
  show_popup_fun() {
    this.setData({
      show_popup: true
    })
  },
  // 接龙设置
  solitaire_fun() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['编辑接龙内容', '暂停接龙', '恢复接龙', '删除接龙'],
      success(res) {
        if (res.tapIndex == 0) {
          console.log(_this.data.solitaire.type);
          if (_this.data.solitaire.type == 1){
            wx.navigateTo({
              url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?id=" + _this.data.solitaireId
            })
          } else if (_this.data.solitaire.type == 2) {
            wx.navigateTo({
              url: "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?id" + _this.data.solitaireId
            })
          }
         
        } else if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '是否确定暂停接龙？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.tapIndex == 2) {
          wx.showModal({
            title: '提示',
            content: '当前接龙已有订单，如需停止接龙可设为暂停接龙',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.tapIndex == 3) {
          wx.showModal({
            title: '提示',
            content: '确认删除接龙吗？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let list = e.currentTarget.dataset.list;
    let url = '';
    switch (page) {
      case 'order_management':
        url = '/pages/subPackagesB/order_management/order_management?id=' + this.data.solitaireId;
        break;
      case 'withdraw_deposit':
        url = '/pages/subPackagesC/withdraw_deposit/withdraw_deposit';
        break;
      case 'participation_solitaire':
        url = '/pages/subPackagesB/participation_solitaire/participation_solitaire?list=' + JSON.stringify(list) + "&shop_num=" + this.data.shop_num + "&shop_price=" + this.data.shop_price + "&logistics=" + JSON.stringify(this.data.logistics) + "&id=" + this.data.solitaireId;
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