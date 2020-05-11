// pages/subPackagesB/released_group/released_group.js
const app = getApp();
import config from '../../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId: '',
    banner_list: [],
    show_popup: false,
    show_notice: false,
    refundMap: {
      1: "已全部退款",
      2: "已部分退款"
    },
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
    shop_price: 0,
    userId: '',
    banner_index: 0, //当前轮播图(顶部) 显示 index
    selectList: [{
        key: '1',
        value: '编辑接龙内容'
      },
      {
        key: '2',
        value: '复制接龙内容'
      },
      {
        key: '3',
        value: '暂停接龙'
      },
      {
        key: '4',
        value: '恢复接龙'
      },
      {
        key: '5',
        value: '删除接龙'
      }
    ],
    showActionSheet: false,
    imagePath: '',
    nickName:""
  },

  showActionSheet_fun() {
    this.setData({
      showActionSheet: true
    })
  },
  selectValue(e) {
    console.log(e.detail);
    let obj = e.detail;
    let _this = this;
    if (obj.key == 1) {
      if (_this.data.solitaire.type == 1) {
        wx.redirectTo({
          url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?is_edit=1&id=" + _this.data.solitaireId
        })
      } else if (_this.data.solitaire.type == 2) {
        wx.redirectTo({
          url: "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?is_edit=1&id=" + _this.data.solitaireId
        })
      }
    } else if (obj.key == 2) {
      if (_this.data.solitaire.type == 1 && (_this.data.isMine || _this.data.solitaire.isCopy == 1)) {
        wx.redirectTo({
          url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?is_edit=0&id=" + _this.data.solitaireId
        })
      } else if (_this.data.solitaire.type == 2 && (_this.data.isMine || _this.data.solitaire.isCopy == 1)) {
        wx.redirectTo({
          url: "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?is_edit=0&id=" + _this.data.solitaireId
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '该接龙不允许复制',
          success(res) {
            if (res.confirm) {} else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else if (obj.key == 3 || obj.key == 4) {
      if (_this.data.solitaire.status == 0 || _this.data.solitaire.status == 1) {
        wx.showModal({
          title: '提示',
          content: '是否确定暂停接龙？',
          success(res) {
            if (res.confirm) {
              _this.updateSolitaireStatus(2)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (_this.data.solitaire.status == 2) {
        wx.showModal({
          title: '提示',
          content: '是否确定恢复接龙？',
          success(res) {
            if (res.confirm) {
              _this.updateSolitaireStatus(0)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else if (obj.key == 5) { //删除接龙
      wx.showModal({
        title: '提示',
        content: '确认删除接龙吗？',
        success(res) {
          if (res.confirm) {
            _this.deleteSolitaire();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  select_list_fun(type) {
    console.log(type);
    if (type == 0) {
      this.setData({
        selectList: [{
            key: '1',
            value: '编辑接龙内容'
          },
          {
            key: '2',
            value: '复制接龙内容'
          },
          {
            key: '3',
            value: '暂停接龙'
          },
          {
            key: '5',
            value: '删除接龙'
          }
        ],
      })
    } else if (type == 2) {
      this.setData({
        selectList: [{
            key: '1',
            value: '编辑接龙内容'
          },
          {
            key: '2',
            value: '复制接龙内容'
          },
          {
            key: '4',
            value: '恢复接龙'
          },
          {
            key: '5',
            value: '删除接龙'
          }
        ],
      })
    } else if (type == -1) {
      this.setData({
        selectList: [{
            key: '1',
            value: '编辑接龙内容'
          },
          {
            key: '2',
            value: '复制接龙内容'
          },
          {
            key: '5',
            value: '删除接龙'
          }
        ],
      })
    } else if (type == 1) {
      this.setData({
        selectList: [{
            key: '2',
            value: '复制接龙内容'
          },
          {
            key: '5',
            value: '删除接龙'
          }
        ],
      })
    }
  },
  // 接龙设置
  // solitaire_fun() {
  //   let _this = this;
  //   let itemList = [];
  //   if (_this.data.solitaire.status == 0 || _this.data.solitaire.status == 1) {
  //     itemList = ['编辑接龙内容', '复制接龙内容', '暂停接龙', '删除接龙']
  //   } else if (_this.data.solitaire.status == 2) {
  //     itemList = ['编辑接龙内容', '复制接龙内容', '恢复接龙', '删除接龙']
  //   }
  //   wx.showActionSheet({
  //     itemList: itemList,
  //     success(res) {
  //       if (res.tapIndex == 0) {
  //         if (_this.data.solitaire.type == 1) {
  //           wx.navigateTo({
  //             url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?is_edit=1&id=" + _this.data.solitaireId
  //           })
  //         } else if (_this.data.solitaire.type == 2) {
  //           wx.navigateTo({
  //             url: "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?is_edit=1&id=" + _this.data.solitaireId
  //           })
  //         }
  //       } else if (res.tapIndex == 1) {
  //         if (_this.data.solitaire.type == 1 && _this.data.solitaire.isCopy == 1) {
  //           wx.navigateTo({
  //             url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?is_edit=0&id=" + _this.data.solitaireId
  //           })
  //         } else if (_this.data.solitaire.type == 2 && _this.data.solitaire.isCopy == 1) {
  //           wx.navigateTo({
  //             url: "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?is_edit=0&id=" + _this.data.solitaireId
  //           })
  //         } else {
  //           wx.showModal({
  //             title: '提示',
  //             content: '该接龙不允许复制',
  //             success(res) {
  //               if (res.confirm) {} else if (res.cancel) {
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         }
  //       } else if (res.tapIndex == 2) {
  //         if (_this.data.solitaire.status == 0 || _this.data.solitaire.status == 1) {
  //           wx.showModal({
  //             title: '提示',
  //             content: '是否确定暂停接龙？',
  //             success(res) {
  //               if (res.confirm) {
  //                 _this.updateSolitaireStatus(2)
  //               } else if (res.cancel) {
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         } else if (_this.data.solitaire.status == 2) {
  //           wx.showModal({
  //             title: '提示',
  //             content: '是否确定恢复接龙？',
  //             success(res) {
  //               if (res.confirm) {
  //                 _this.updateSolitaireStatus(0)
  //               } else if (res.cancel) {
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         }
  //       } else if (res.tapIndex == 3) { //删除接龙
  //         // if (_this.data.solitaireList.length > 0) {
  //         //   wx.showModal({
  //         //     title: '提示',
  //         //     content: '当前接龙已有订单，如需停止接龙可设为暂停接龙',
  //         //     success(res) {
  //         //       if (res.confirm) {
  //         //         console.log('用户点击确定')
  //         //       } else if (res.cancel) {
  //         //         console.log('用户点击取消')
  //         //       }
  //         //     }
  //         //   })
  //         // } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: '确认删除接龙吗？',
  //           success(res) {
  //             if (res.confirm) {
  //               _this.deleteSolitaire();
  //             } else if (res.cancel) {
  //               console.log('用户点击取消')
  //             }
  //           }
  //         })
  //         // }
  //       }
  //     },
  //     fail(res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // },
  // 关闭提醒消息
  close_notice() {
    this.setData({
      'info.isAttentionPublic': -1
    })
  },
  open_show_notice() {
    this.setData({
      show_notice: true
    })
  },
  //展示图片
  showImg: function(e) {
    var that = this;
    wx.previewImage({
      urls: that.data.banner_list,
      current: that.data.banner_list[e.currentTarget.dataset.index]
    })
  },
  showImg2: function(e) {
    var that = this;
    wx.previewImage({
      urls: e.currentTarget.dataset.url,
      current: 0
    })
  },
  //轮播图改变
  change_index: function(e) {
    let current = e.detail.current;
    this.setData({
      banner_index: current
    })
  },
  // 打电话
  callPhone_fun() {
    wx.makePhoneCall({
      phoneNumber: this.data.solitaire.callPhone ? this.data.solitaire.callPhone : '' //仅为示例，并非真实的电话号码
    })
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
    });
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
        banner_list: res.args.solitaire.img? res.args.solitaire.img.split(';') : []
      });
      this.select_list_fun(this.data.solitaire.status);
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
      let loginUserId = res.args.userId;
      res.args.solitaireList.forEach(item => {
        console.log(item);
        if (item.status==1){
          return;
        }
        let itemstr = '';
        if (loginUserId == item.pubUserId) { //先判定是否本人发布
          if (item.status == -1) { //已取消
            itemstr += '已取消接龙';
          }
          if (item.refundStatus != 0) { //存在退款
            if (itemstr.length > 0) {
              itemstr += ',';
            }
            itemstr += this.data.refundMap[item.refundStatus];
          }
          if (loginUserId == item.userId && itemstr == '') {
            if (item.isRemove == 1) {
              itemstr = '已申请取消，待通过';
            } else {
              itemstr = '申请取消';
              item.hasOnclick = 1;
            }
          }
        } else { //参与者
          if (loginUserId == item.userId) { //只有是本人参与的记录才显示
            if (item.status == -1) { //已取消
              itemstr += '已取消接龙';
            }
            if (item.refundStatus != 0) { //存在退款
              if (itemstr.length > 0) {
                itemstr += ',';
              }
              itemstr += this.data.refundMap[item.refundStatus];
            }
            if (itemstr == '') {
              if (item.isRemove == 1) {
                itemstr = '已申请取消，待通过';
              } else {
                itemstr = '申请取消';
                item.hasOnclick = 1;
              }
            }
          }
        }
        item.itemstr = itemstr;
      })
      // console.log(res.args.solitaireList);
      this.setData({
        solitaireList: res.args.solitaireList,
        userId: res.args.userId
      })
    })
  },
  // 转发
  show_popup_fun() {
    this.setData({
      show_popup: true
    })
  },
  // 修改接龙状态-暂停 / 恢复 （updateSolitaireStatus）
  updateSolitaireStatus(status) {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙主键
        "status": status, //修改接龙状态  2表示暂停  0表示恢复  1接龙结束
      }
    }
    wx.showLoading({
      title: '修改中',
      mask: true
    })
    app.$API.updateSolitaireStatus(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '修改成功',
          duration: config.timeoutSecond
        })
        this.get_details(this.data.solitaireId);
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: config.timeoutSecond
        })
      }
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 修改接龙状态-暂停 / 恢复 （deleteSolitaire）
  deleteSolitaire() {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙主键
      }
    }
    wx.showLoading({
      title: '删除中',
      mask: true
    })
    app.$API.deleteSolitaire(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          duration: config.timeoutSecond
        })
        let setTime = setTimeout(() => {
          wx.switchTab({
            url: '/pages/tabBar/record/record'
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: config.timeoutSecond
        })
      }
    }).catch(() => {
      wx.hideLoading()
    })
  },

  // 修改订单状态 （applyRemove）
  applyRemove(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确定申请取消？',
      success(res) {
        if (res.confirm) {
          let params = {
            param: {
              "solitaireId": _this.data.solitaireId, //接龙主键
              "orderId": id, //订单ID
              "isRemove": 1, //订单状态 -1取消 0进行中  1已完成
            }
          }
          wx.showLoading({
            title: '取消中',
            mask: true
          })
          app.$API.applyRemove(params).then(res => {
            if (res.code == 200) {
              wx.showToast({
                title: '申请成功',
                duration: config.timeoutSecond
              })
              _this.get_list();
            } else {
              wx.showToast({
                title: '申请失败',
                icon: 'none',
                duration: config.timeoutSecond
              })
            }
            wx.hideLoading()
          }).catch(() => {
            wx.hideLoading()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let list = e.currentTarget.dataset.list;
    let goods_id = e.currentTarget.dataset.goods_id;
    let url = '';
    switch (page) {
      case 'goods_details':
        url = '/pages/subPackagesB/goods_details/goods_details?id=' + this.data.solitaireId + '&goods_id=' + goods_id;
        break;
      case 'order_management':
        url = '/pages/subPackagesB/order_management/order_management?id=' + this.data.solitaireId;
        break;
      case 'poster':
        url = '/pages/subPackagesB/poster/poster?id=' + this.data.solitaireId;
        break;
      case 'withdraw_deposit':
        url = '/pages/subPackagesC/withdraw_deposit/withdraw_deposit';
        break;
      case 'participation_solitaire':
        let listFilter = [];
        list.forEach(item => {
          if (item.num && item.num > 0) {
            listFilter.push(item)
          }
        });
        url = '/pages/subPackagesB/participation_solitaire/participation_solitaire?list=' + encodeURIComponent(JSON.stringify(listFilter)) + "&shop_num=" + this.data.shop_num + "&shop_price=" + this.data.shop_price + "&logistics=" + encodeURIComponent(JSON.stringify(this.data.logistics)) + "&id=" + this.data.solitaireId + "&type=" + this.data.solitaire.type + "&title=" + this.data.solitaire.title;
        break;
        // 发个接龙
      case 'add_solitaire':
        if (this.data.solitaire.type == 1) {
          url = '/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire';
        } else if (this.data.solitaire.type == 2) {
          url = '/pages/subPackagesA/chipped_solitaire/chipped_solitaire';
        }
        break;
      case 'index':
        url = '/pages/tabBar/index/index';
        break;
        // 复制接龙
      case 'copy_solitaire':
        if (this.data.solitaire.type == 1) {
          url = "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire?is_edit=0&id=" + this.data.solitaireId;
        } else if (this.data.solitaire.type == 2) {
          url = "/pages/subPackagesA/chipped_solitaire/chipped_solitaire?is_edit=0&id=" + this.data.solitaireId;
        }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.id) {
      this.data.solitaireId = options.id;
    } else if (options.scene) {
      this.data.solitaireId = options.scene;
    }
    if (options.released_id) {
      this.data.solitaireId = options.released_id;
      this.setData({
        show_popup: true
      });
      this.get_details(this.data.solitaireId);
    } else {
      this.get_details(this.data.solitaireId);
    }
    if (this.data.solitaireId) {
      let shareid = this.selectComponent("#shareid");
      shareid.data.solitaireId = this.data.solitaireId;
      shareid.getSolitaireShareInfo();
    }
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
  // 转发次数统计 （forwadStatics）
  forwadStatics() {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙主键
      }
    }
    app.$API.forwadStatics(params).then(res => {}).catch(() => {})
  },
  imagePathFun(e) {
    // this.data.imagePath = e.detail;
    console.log(e.detail);
    this.setData({
      imagePath: e.detail[0],
      nickName: e.detail[1]
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    this.forwadStatics();
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: `${that.data.nickName}邀请你来接龙`, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/subPackagesB/released_group/released_group?id=' + that.data.solitaireId, // 默认是当前页面，必须是以‘/’开头的完整路径
      // path: '/pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: that.data.imagePath, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res) { // 转发成功之后的回调
        console.log(res, '转发成功');
        if (res.errMsg == 'shareAppMessage:ok') {}　　　　
      },
      fail: function(res) { // 转发失败之后的回调
        console.log(res, '转发失败');
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }　　　　
      },
      complete: function() {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // var eData = options.target.dataset;
      // console.log(eData.name); // shareBtn
      // // 此处可以修改 shareObj 中的内容
      // shareObj.path = '/pages/subPackagesB/released_group/released_group' + that.data.solitaireId;
    }
    // 返回shareObj
    return shareObj;
  }
})