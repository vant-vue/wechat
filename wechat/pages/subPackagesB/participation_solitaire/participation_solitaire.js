// pages/subPackagesB/participation_solitaire/participation_solitaire.js
const app = getApp();
import valid from '../../../utils/valid.js'
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
    is_request: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    // console.log(JSON.parse(options.list));
    // console.log(JSON.parse(options.logistics));
    let logistics = JSON.parse(options.logistics);
    let list = JSON.parse(options.list).map(item=>{
      return {
        "goodsName": item.goodsName,
        "goodsId": item.id,//商品ID
        "buyCount": item.num,//购买数量
        "money": item.price,//单类总金额 
        "sortId": item.sortId,//排序   
        "specifications": item.specifications//排序   
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
      modeList: modeList
    })
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
    if (this.data.is_request) {
      return;
    }
    if (!valid.check_mobile(this.data.telNumber)) {
      wx.showToast({
        title: '请输入正确的联系电话',
        icon: 'none'
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
      wx.hideLoading()
      this.data.is_request = false;
    }).catch(() => {
      wx.hideLoading()
      this.data.is_request = false;
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