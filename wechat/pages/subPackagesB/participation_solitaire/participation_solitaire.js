// pages/subPackagesB/participation_solitaire/participation_solitaire.js
const app = getApp();
import valid from '../../../utils/valid.js'
import config from "../../../utils/config.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId: '',
    list: [],
    shop_num: 0,
    shop_price: 0,
    logistics: {},
    modeList: [],
    isAnonymous: false, //是否匿名
    is_request: false,
    title: '',
    type: null,
    show_popup: false,
    popup_order_list: {},
    is_success: false,
    goods: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // console.log(JSON.parse(options.list));
    // console.log(JSON.parse(options.logistics));
    let logistics = JSON.parse(decodeURIComponent(options.logistics));
    let olist = JSON.parse(decodeURIComponent(options.list));
    let list = olist.map(item => {
      return {
        "goodsName": item.goodsName,
        "goodsId": item.id, //商品ID
        "buyCount": item.num, //购买数量
        "money": item.price, //单类总金额 
        "sortId": item.sortId, //排序   
        "specifications": item.specifications //排序   
      }
    });
    let modeList = [];
    if (logistics.otherMode) {
      let arr = logistics.otherMode.split(',');
      arr.forEach(item => {
        modeList.push({
          name: item,
          value: ''
        })
      })
    }
    this.setData({
      solitaireId: options.id,
      list: list,
      shop_num: options.shop_num,
      shop_price: options.shop_price,
      logistics: logistics,
      modeList: modeList,
      type: options.type,
      title: options.title
    });
    // console.log(modeList);
  },
  check_change() {
    this.setData({
      isAnonymous: !this.data.isAnonymous
    })
  },
  //监听input 商品
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let str = `modeList[${index}].${row}`;
    this.setData({
      [str]: value.replace(/,/g, "")
    });
    // console.log(this.data.modeList);
  },
  listenerInputSimple(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  // 获取微信地址
  get_wx_address() {
    let _this = this;
    this.data.modeList
    wx.chooseAddress({
      success(res) {
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
        _this.setData({
          userName: res.userName,
          postalCode: res.postalCode,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          nationalCode: res.nationalCode,
          telNumber: res.telNumber,
        })



      }
    })
  },
  // 支付
  wxPay() {
    let _this = this;
    if (this.data.is_request) {
      return;
    }
    if ((this.data.logistics.logisticsType == 2 || this.data.logistics.logisticsType == 3) && !valid.check_mobile(this.data.telNumber)) {
      wx.showToast({
        title: '请输入正确的联系电话',
        icon: 'none',
        duration: config.timeoutSecond
      })
      return;
    } else if (this.data.logistics.logisticsType == 1 && !this.data.provinceName) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: config.timeoutSecond
      })
      return;
    }
    let otherMode = {};
    this.data.modeList.forEach(item => {
      Object.assign(otherMode, {
        [item.name]: item.value
      })
    })
    let params = {
      param: {
        "source": "wxapp", //来源  h5网页  wxapp小程序  public公众号  app原生
        "solitaireOrder": {
          "solitaireId": this.data.solitaireId,
          "goodsList": this.data.list,
          "goodsCount": this.data.shop_num, //没有商品即合买接龙时 为0
          "payMoney": this.data.shop_price, //支付金额
          "isAnonymous": this.data.isAnonymous ? 1 : 0, //是否匿名
          "logistics": { //物流信息
            "name": this.data.userName ? this.data.userName : '', //可空
            "phone": this.data.telNumber, //联系方式  不可空
            "province": this.data.provinceName ? this.data.provinceName : '', //省 可空
            "city": this.data.cityName ? this.data.cityName : '', //可空
            "area": this.data.countyName ? this.data.countyName : '', //可空
            "address": this.data.detailInfo ? this.data.detailInfo : '', //可空
            "otherMode": otherMode
          }
        }
      }
    }
    console.log(params);
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    this.data.is_request = true;
    app.$API.wxPay(params).then(res => {
      console.log(res);
      if (res.code == 200) {
        wx.requestPayment({
          timeStamp: res.args.timeStamp,
          nonceStr: res.args.nonceStr,
          package: res.args.package,
          signType: res.args.signType,
          paySign: res.args.paySign,
          success(res) {
            console.log(res, '支付成功');
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: '支付成功',
                duration: config.timeoutSecond
              })
              _this.data.is_success = true;
              let setTime = setTimeout(() => {
                _this.findNewOrder();
              }, 1500)
            }
          },
          fail(res) {
            //_this.findNewOrder();
            console.log(res, '支付失败');
          }
        })
      }
      wx.hideLoading()
      this.data.is_request = false;
    }).catch(() => {
      wx.hideLoading()
      this.data.is_request = false;
    })
  },
  // 接龙成功后返回记录（findNewOrder）
  findNewOrder() {
    let params = {
      param: {
        "solitaireId": this.data.solitaireId, //接龙ID
      }
    }
    app.$API.findNewOrder(params).then(res => {
      if (res.code == 200) {
        this.setData({
          popup_order_list: res.args.order,
          goods: res.args.goods
        });
      }
      setTimeout(() => {
        this.setData({
          show_popup: true
        })
      }, 200)

    }).catch(() => {})
  },
  popup_close() {
    this.setData({
      show_popup: false
    })
    setTimeout(() => {
      if (this.data.is_success) {
        wx.redirectTo({
          url: '/pages/subPackagesB/released_group/released_group?id=' + this.data.solitaireId
        });
      }
    }, 500)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    this.data.imagePath = e.detail;
    console.log(this.data.imagePath);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    this.forwadStatics();
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: `${that.data.title}`, // 默认是小程序的名称(可以写slogan等)
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