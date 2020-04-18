// pages/subPackagesA/group_buying_solitaire/group_buying_solitaire.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadList: [],
    params: {
      "title": "标题", //页数
      "summary": "接龙介绍。。。", //限制字数在1000字以内
      "img": "  https://ysertg39wc.feishu.cn/docs/doccnjqwPd1wvLdvoMaZVOmRfGJ;  https://ysertg39wc.feishu.cn/docs/doccnjqwPd1wvLdvoMaZVOmRfGJ", //图片介绍 最多上传9张 每张分号隔开
      "callPhone": "15102748056", //发布者联系电话 
      "startTime": "2020-03-27 12:22:22", //接龙开始时间 即当前时间
      "endTime": "2020-04-27 12:22:22", //接龙结束时间  团购默认为7天  合买默认为当天晚上8:00
      "logisticsType": 1, //物流方式  1快递发货  2提货点自提  3没有物流
      "type": 1, //接龙类型   1，表示团购接龙  2，表示合买接龙
      "getAddress": "提货点地址", //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
      "isCopy": 0, //是否允许复制  0表示不可复制  1表示可复制
      "goodsList": [ //团购商品  团购接龙才有
        {
          "goodsId": 21, //  接龙商品主键  用于查询商品详情
          "sortId": 1, //排序
          "goodsName": "商品名称", //不可空
          "summary": "商品介绍", //500字以内
          "goodsImg": " https://ysertg39wc.feishu.cn/docs/doccnjqwPd1wvLdvoMaZVOmRfGJ", //商品图片 只能一张
          "price": 21312, //商品价格  合买接龙的单份金额
          "specifications": "商品规格", //可空
          "stock": 123, //商品库存 可空 空为不限   合买接龙的 合买份数
          "togoMoney": 213132, //合买金额  合买接龙存在合买金额


        }
      ],
      mode: "颜色，联系人" //物流非必填字段 发布人自定义字段 逗号隔开  可空
    }
  },
  // 上传图片组件返回的数据
  get_img_list(e) {
    console.log(e.detail);
    this.data.uploadList = e.detail;
    this.uploadImg();
  },
  // 图片上传
  uploadImg() {
    let params = {
      files: this.data.uploadList,
      dir: 'solitaire'
    };
    app.$API.uploadImg(params).then(res => {
      console.log(res);
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let url = '';
    switch (page) {
      case 'editDetails':
        url = '/pages/subPackagesA/editDetails/editDetails';
        break;
      case 'logistics_mode':
        url = '/pages/subPackagesA/logistics_mode/logistics_mode';
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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