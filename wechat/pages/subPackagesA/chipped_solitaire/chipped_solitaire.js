// pages/subPackagesA/group_buying_solitaire/group_buying_solitaire.js
const app = getApp();
import config from '../../../utils/config.js'
import valid from '../../../utils/valid.js'
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_edit: 0, //0-发布，1-编辑
    solitaireId: '', //编辑复制用到
    uploadList: [], //编辑复制用到
    imgList: [],
    uploadList: [],
    pictureList: [],
    goodsList: [ //团购商品  团购接龙才有
      {
        "sortId": 1, //排序
        "price": '', //商品价格  合买接龙的单份金额
        "stock": '', //商品库存 可空 空为不限   合买接龙的 合买份数
        "togoMoney": '', //合买金额  合买接龙存在合买金额
      }
    ],
    params: {
      "title": "", //页数
      "summary": "", //限制字数在1000字以内 接龙介绍
      "img": "", //图片介绍 最多上传9张 每张分号隔开
      "callPhone": "", //发布者联系电话 
      "startTime": util.formatTime(new Date()), //接龙开始时间 即当前时间 2020-03-27 12:22:22
      "endTime": util.formatTime(new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)), //接龙结束时间  团购默认为7天  合买默认为当天晚上8:00 2020-04-27 12:22:22
      "type": 2, //接龙类型   1，表示团购接龙  2，表示合买接龙
      "logisticsType": '3', //物流方式  1快递发货  2提货点自提  3没有物流
      "logisticsTypeName": '没有物流', //物流方式  1快递发货  2提货点自提  3没有物流
      "getAddress": "", //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
      "isCopy": false, //是否允许复制  0表示不可复制  1表示可复制
      'mode': "" //物流非必填字段 发布人自定义字段 逗号隔开  可空
    },
    is_request: false
  },
  // 上传图片组件返回的数据
  get_img_list(e) {
    this.data.uploadList = e.detail;
  },
  // 图片上传
  uploadImg(imgurl) {
    return new Promise((resolve, reject) => {
      if (this.data.uploadList.length == 0) {
        resolve([]);
      }
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      this.data.pictureList = [];
      let that = this;
      let token = wx.getStorageSync('token') || "";
      let header = {
        'content-type': 'multipart/form-data'
      }
      if (token) {
        header.Authorization = token;
      };
      for (let i = 0; i < imgurl.length; i++) {
        if (imgurl[i].indexOf(config.download_path) > -1) {
          that.data.pictureList.push(imgurl[i]);
          if (that.data.pictureList.length == imgurl.length) {
            resolve(that.data.pictureList);
          }
          continue;
        }
        wx.uploadFile({
          url: config.api_url + "/solitaire/uploadFiles/uploadImg",
          filePath: imgurl[i],
          name: 'file',
          header: header,
          formData: {
            dir: 'solitaire'
          },
          success: function(res) {
            let result = JSON.parse(res.data);
            that.data.pictureList.push(result.args.path);
            if (that.data.pictureList.length == imgurl.length) {
              resolve(that.data.pictureList);
            }
          },
          fail: function(res) {
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function(res) {}
            });
            reject(res);
          }
        })
      }
    })
  },
  // 新增商品
  add_good() {
    this.setData({
      "goodsList": this.data.goodsList.concat({
        "sortId": this.data.goodsList.length + 1, //排序
        "goodsName": "", //商品名称不可空
        "summary": "", //商品介绍500字以内
        "goodsImg": "", //商品图片 只能一张
        "price": '', //商品价格  合买接龙的单份金额
        "specifications": "", //商品规格 可空
        "stock": '', //商品库存 可空 空为不限   合买接龙的 合买份数
      })
    })
  },
  // 删除商品
  del_good(e) {
    let list = JSON.parse(JSON.stringify(this.data.goodsList));
    list.pop();
    this.setData({
      "goodsList": list
    })
    console.log(this.data.goodsList);
  },
  //监听input 商品
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let str = `goodsList[${index}].${row}`;
    this.setData({
      [str]: value.replace(/,/g, "")
    });
  },
  //监听金额框
  listenerInputMoney(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let str = `goodsList[${index}].${row}`;
    if (!(/^(\d?)+(\.\d{0,2})?$/.test(value))) { //正则验证，提现金额小数点后不能大于两位数字
      value = value.substring(0, value.length - 1);
    }
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    this.setData({
      [str]: value.replace(/,/g, "")
    });
  },
  // 数字转金额
  moneyToString(num) {
    if (typeof num === 'undefined' || num === '') return '';
    return parseFloat(num).toFixed(2);
  },
  handleInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let str = `goodsList[${index}].${row}`;
    this.setData({
      [str]: this.moneyToString(value)
    });
  },
  //监听input 普通输入框
  listenerInputSimple(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  check() {

  },
  // 提交
  submit() {
    if (this.data.is_request) return;
    let str = '';
    if (!valid.check_required(this.data.params.title)) {
      str = "请填写标题"
    }
    this.data.goodsList.map(item => {
      if (!valid.check_positive(item.price)) {
        str = "请填写单份金额"
      }
      if (!valid.check_positive(item.stock) || item.stock == 0) {
        str = "请填写不为0可售份数"
      }
      if (!valid.check_positive(item.togoMoney)) {
        str = "请填写合买金额"
      }
      if (str) {
        return;
      }
      item.price = item.price * 100;
      item.togoMoney = item.togoMoney * 100;
    });
    if (!valid.check_mobile(this.data.params.callPhone)) {
      str = "请输入正确的电话"
    }
    if (this.data.params.stock && !valid.check_positive(this.data.params.stock)) {
      str = "请输入大于0的库存"
    }
    if (!valid.check_required(this.data.params.logisticsType)) {
      str = "请选择物流"
    }
    if (str) {
      wx.showToast({
        title: str,
        icon: 'none',
        duration: config.timeoutSecond
      })
      return;
    }

    this.uploadImg(this.data.uploadList).then(res => {
      let params = {
        param: {
          "title": this.data.params.title,
          "summary": this.data.params.summary, //限制字数在1000字以内 接龙介绍
          "img": res.join(";"), //图片介绍 最多上传9张 每张分号隔开
          "callPhone": this.data.params.callPhone, //发布者联系电话 
          "startTime": this.data.params.startTime, //接龙开始时间 即当前时间 2020-03-27 12:22:22
          "endTime": this.data.params.endTime, //接龙结束时间  团购默认为7天  合买默认为当天晚上8:00 2020-04-27 12:22:22
          "logisticsType": this.data.params.logisticsType, //物流方式  1快递发货  2提货点自提  3没有物流
          "type": this.data.params.type, //接龙类型   1，表示团购接龙  2，表示合买接龙
          "getAddress": this.data.params.getAddress, //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
          "isCopy": this.data.params.isCopy ? 1 : 0, //是否允许复制  0表示不可复制  1表示可复制
          "goodsList": this.data.goodsList,
          "mode": this.data.params.mode
        }
      }
      // console.log(params);
      // wx.hideLoading()
      this.data.is_request = true;
      app.$API.insertPubSolitaire(params).then(res => {
        if (res.flag) {
          wx.showToast({
            title: '发布成功',
            duration: config.timeoutSecond
          });
          let setTime;
          setTime = setTimeout(() => {
            this.data.is_request = false;
            wx.redirectTo({
              url: '/pages/subPackagesB/released_group/released_group?released_id=' + res.args.solitaireId
            })
          }, config.timeoutSecond)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: config.timeoutSecond
          })
        }

      }).catch(err => {
        this.data.is_request = false;
        wx.hideLoading()
      })
    })
  },
  //跳转
  jump(e) {
    let page = e.currentTarget.dataset.page;
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let img = e.currentTarget.dataset.img;
    console.log(title, id);
    let url = '';
    switch (page) {
      case 'editDetails':
        if (!title) {
          wx.showToast({
            title: '请输入商品名称',
            icon: "none",
            duration: config.timeoutSecond
          })
          return;
        }
        url = '/pages/subPackagesA/editDetails/editDetails?title=' + title + "&index=" + id + "&img=" + img;
        break;
      case 'logistics_mode':
        url = '/pages/subPackagesA/logistics_mode/logistics_mode?mode=' + this.data.params.mode + "&type=" + this.data.params.logisticsType + "&getAddress=" + this.data.params.getAddress;
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
  // 开始时间
  start_time_fun(e) {
    if (util.compareDate(util.formatTime(new Date()), e.detail)) {
      e.detail = util.formatTime(new Date());
    }
    let endTime = util.formatTime(new Date(util.parseTime(e.detail).getTime() + 7 * 24 * 3600 * 1000));
    this.setData({
      'params.startTime': e.detail,
      'params.endTime': endTime,
    })
  },
  // 结束时间
  end_time_fun(e) {
    if (util.compareDate(this.data.params.startTime, e.detail)) {
      e.detail = util.formatTime(new Date(util.parseTime(this.data.params.startTime).getTime() + 1 * 3600 * 1000));
    }
    this.setData({
      'params.endTime': e.detail,
    })
  },
  // check框
  onChange(e) {
    this.setData({
      "params.isCopy": !this.data.params.isCopy
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.id) {
      this.data.solitaireId = options.id;
      this.selectSolitaire();
    }
    if (options.is_edit) {
      this.setData({
        is_edit: options.is_edit
      })
    }
  },
  // 查询接龙-用于复制接龙或者编辑接龙  （selectSolitaire）
  selectSolitaire() {
    let params = {
      param: {
        solitaireId: this.data.solitaireId
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.$API.selectSolitaire(params).then(res => {
      let solitaire = res.args.solitaire;
      let goodsList = res.args.goodsList;
      goodsList.forEach(item => {
        item.price = item.price / 100
        item.togoMoney = item.togoMoney / 100
      })
      console.log('1');
      let logisticsMode = res.args.logisticsMode ? res.args.logisticsMode : '';

      let logisticsTypeName = '';
      if (solitaire.logisticsType == 1) {
        logisticsTypeName = '快递发货';
      } else if (solitaire.logisticsType == 2) {
        logisticsTypeName = '提货点自提';
      } else if (solitaire.logisticsType == 3) {
        logisticsTypeName = '没有物流';
      }
      if (this.data.is_edit == 0) { //复制
        this.setData({
          goodsList: goodsList,
          imgList: solitaire.img ? solitaire.img.split(";") : [],
          params: {
            "title": solitaire.title,
            "summary": solitaire.summary, //限制字数在1000字以内 接龙介绍
            "img": solitaire.img, //图片介绍 最多上传9张 每张分号隔开
            "callPhone": solitaire.callPhone, //发布者联系电话 
            "startTime": util.formatTime(new Date()), //接龙开始时间 即当前时间 2020-03-27 12:22:22
            "endTime": util.formatTime(new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)), //接龙结束时间  
            "logisticsType": solitaire.logisticsType, //物流方式  1快递发货  2提货点自提  3没有物流
            "logisticsTypeName": logisticsTypeName, //物流名称
            "type": solitaire.type, //接龙类型   1，表示团购接龙  2，表示合买接龙
            "getAddress": solitaire.getAddress ? solitaire.getAddress : '', //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
            "isCopy": solitaire.isCopy, //是否允许复制  0表示不可复制  1表示可复制
            "mode": logisticsMode
          }
        });
      } else if (this.data.is_edit == 1) {
        this.setData({
          goodsList: goodsList,
          imgList: solitaire.img ? solitaire.img.split(";") : [],
          params: {
            "title": solitaire.title,
            "summary": solitaire.summary, //限制字数在1000字以内 接龙介绍
            "img": solitaire.img, //图片介绍 最多上传9张 每张分号隔开
            "callPhone": solitaire.callPhone, //发布者联系电话 
            "startTime": solitaire.startTime, //接龙开始时间 即当前时间 2020-03-27 12:22:22
            "endTime": solitaire.endTime, //接龙结束时间  团购默认为7天  合买默认为当天晚上8:00 2020-04-27 12:22:22
            "logisticsType": solitaire.logisticsType, //物流方式  1快递发货  2提货点自提  3没有物流
            "logisticsTypeName": logisticsTypeName, //物流名称
            "type": solitaire.type, //接龙类型   1，表示团购接龙  2，表示合买接龙
            "getAddress": solitaire.getAddress ? solitaire.getAddress : '', //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
            "isCopy": solitaire.isCopy, //是否允许复制  0表示不可复制  1表示可复制
            "mode": logisticsMode
          }
        });
      }
      console.log(2);

      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  // 编辑
  edit() {
    let str = '';
    if (!valid.check_required(this.data.params.title)) {
      str = "请填写标题"
    }
    this.data.goodsList.map(item => {
      if (!valid.check_positive(item.price)) {
        str = "请填写单份金额"
      }
      if (!valid.check_positive(item.stock) || item.stock == 0) {
        str = "请填写不为0可售份数"
      }
      if (!valid.check_positive(item.togoMoney)) {
        str = "请填写合买金额"
      }
      if (str) {
        return;
      }
      item.price = item.price * 100;
      item.togoMoney = item.togoMoney * 100;
    });
    if (!valid.check_mobile(this.data.params.callPhone)) {
      str = "请输入正确的电话"
    }
    if (this.data.params.stock && !valid.check_positive(this.data.params.stock)) {
      str = "请输入大于0的库存"
    }
    if (!valid.check_required(this.data.params.logisticsType)) {
      str = "请选择物流"
    }
    if (str) {
      wx.showToast({
        title: str,
        icon: 'none',
        duration: 3000
      })
      return;
    }

    this.uploadImg(this.data.uploadList).then(res => {
      let params = {
        param: {
          "solitaireId": this.data.solitaireId,
          "title": this.data.params.title,
          "summary": this.data.params.summary, //限制字数在1000字以内 接龙介绍
          "img": res.join(";"), //图片介绍 最多上传9张 每张分号隔开
          "callPhone": this.data.params.callPhone, //发布者联系电话 
          "startTime": this.data.params.startTime, //接龙开始时间 即当前时间 2020-03-27 12:22:22
          "endTime": this.data.params.endTime, //接龙结束时间  团购默认为7天  合买默认为当天晚上8:00 2020-04-27 12:22:22
          "logisticsType": this.data.params.logisticsType, //物流方式  1快递发货  2提货点自提  3没有物流
          "type": this.data.params.type, //接龙类型   1，表示团购接龙  2，表示合买接龙
          "getAddress": this.data.params.getAddress, //当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
          "isCopy": this.data.params.isCopy ? 1 : 0, //是否允许复制  0表示不可复制  1表示可复制
          "goodsList": this.data.goodsList,
          "mode": this.data.params.mode
        }
      }
      // console.log(params);
      // wx.hideLoading()
      this.data.is_request = true;
      app.$API.editSolitaire(params).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '修改成功',
            duration: config.timeoutSecond
          });
          let setTime;
          setTime = setTimeout(() => {
            this.data.is_request = false;
            wx.redirectTo({
              url: '/pages/subPackagesB/released_group/released_group?released_id=' + res.args.solitaireId
            })
          }, config.timeoutSecond)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: config.timeoutSecond
          });
        }

      }).catch(err => {
        this.data.is_request = false;
        wx.hideLoading()
      })
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
  onShareAppMessage: function(options) {
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      // title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/center/zf.jpeg',
      success: function() { // 转发成功之后的回调
      },
      fail: function() { // 转发失败之后的回调
      },
      complete: function() {}
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // 此处可以修改 shareObj 中的内容
      // shareObj.path = ''
    }
    // 返回shareObj
    return shareObj;
  }
})