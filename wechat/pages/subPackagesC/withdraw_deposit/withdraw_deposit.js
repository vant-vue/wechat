// pages/subPackagesC/withdraw_deposit/withdraw_deposit.js
const app = getApp();
import config from '../../../utils/config.js'
const default_url_one = "/images/idCard/idNumFront.png"
const default_url_two = "/images/idCard/idNumBack.png"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPayee: '',
    isIdNum: '',
    cashAmount: '',
    is_request: false,
    userInfo: {},
    default_url_one: default_url_one,
    default_url_two: default_url_two,
    uploaderList: [],
    isIdCard: false
  },
  //监听input 普通输入框
  listenerInputSimple(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    if (value.length > 7) {
      value = value.substring(0, 7);
    }
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  //监听input 普通输入框
  listenerInputSimpleIdNum(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    if (value.length > 18) {
      value = value.substring(0, 18);
    }
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  idNumCheck(code) {
    var ts = this;

    //身份证号合法性验证 
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    var tip = "";
    var pass = true;
    var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    if (!code || !code.match(reg)) {
      tip = "身份证号格式错误";
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
    return pass;
  },
  //监听input 普通输入框
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    if (!(/^(\d?)+(\.\d{0,2})?$/.test(value))) { //正则验证，提现金额小数点后不能大于两位数字
      value = value.substring(0, value.length - 1);
    }
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    this.setData({
      [row]: value.replace(/,/g, "")
    });
  },
  // 全部提现
  allMony() {
    this.setData({
      'cashAmount': this.data.userInfo.cashAmount / 100
    })
  },
  getPhoneNumber(e) {
    var that = this;
    wx.checkSession({
      success() {
        let params = {
          param: {
            "iv": e.detail.iv,
            "encryptedData": e.detail.encryptedData
          }
        };
        app.$API.getWxRzPhone(params).then(res => {
          if (res.code == 200) {
            var userInfo = that.data.userInfo;
            userInfo.rzPhone = res.args.phoneNumber;
            that.setData({
              userInfo: userInfo
            })
          }
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: 'pages/tabBar/login/login'
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userInfo();
  },
  // 用户信息
  userInfo() {
    app.$API.assetInfo({}).then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: res.args,
          isPayee: res.args.payee ? true : false,
          isIdNum: res.args.idNumber ? true : false,
          cashAmount: ''
        });
      }
    })
  },
  // 选择图片
  upload: function(e) {
    console.log(e);
    var that = this;
    wx.chooseImage({
      count: that.data.defaultNum - that.data.uploaderNum, // 默认数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == that.data.defaultNum) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
        that.triggerEvent('upload', that.data.uploaderList);
        that.get_img_list(that.data.uploaderList, e.currentTarget.dataset.type);
      }
    })
  },
  // 图片上传
  uploadImg(imgurl) {
    console.log(imgurl, 'imgurl');
    return new Promise((resolve, reject) => {
      if (imgurl.length == 0) {
        resolve([]);
        return;
      };
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
          },
          complete: (() => {

          })
        })
      }
    })
  },
  get_img_list(list, type) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    this.uploadImg(list).then(res => {
      this.data.uploaderList = [];
      wx.hideLoading();
      let row = "";
      if (type == "idNumFront") {
        row = "default_url_one"
      } else if (type == "idNumBack") {
        row = "default_url_two"
      }
      console.log(row,type);
      this.setData({
        [row]: res.join('')
      })
    });
  },
  //微信认证信息提交
  wxRz() {
    this.setData({
      isIdCard:true
    })
    if (this.data.is_request) {
      return;
    }
    this.data.is_request = true;
    let str = '';
    if (!this.data.userInfo.payee) {
      wx.showToast({
        title: '请输入收款人',
        icon: 'none',
        duration: config.timeoutSecond
      })
      this.data.is_request = false;
      return;
    }
    if (!this.data.userInfo.rzPhone) {
      wx.showToast({
        title: '请授权手机号',
        icon: 'none',
        duration: config.timeoutSecond
      })
      this.data.is_request = false;
      return;
    }
    // if(!this.data.userInfo.idNumber){
    //   wx.showToast({
    //     title: '请输入收款人身份证号码',
    //     icon: 'none',
    //     duration: config.timeoutSecond
    //   })
    //   this.data.is_request = false;
    //   return;
    // }
    // if(!this.idNumCheck(this.data.userInfo.idNumber)){
    //   wx.showToast({
    //     title: '收款人身份证号码错误',
    //     icon: 'none',
    //     duration: config.timeoutSecond
    //   })
    //   this.data.is_request = false;
    //   return;
    // }
    if (!this.data.userInfo.idNumFront) {
      wx.showToast({
        title: '请上传微信正面图片',
        icon: 'none',
        duration: config.timeoutSecond
      })
      this.data.is_request = false;
      return;
    }
    if (!this.data.userInfo.idNumBack) {
      wx.showToast({
        title: '请上传微信反面图片',
        icon: 'none',
        duration: config.timeoutSecond
      })
      this.data.is_request = false;
      return;
    }
    let params = {
      param: {
        "idNumber": this.data.idNumber, //身份证号码
        "name": this.data.userInfo.payee, //实名  可空已经实名过一次的 可以为空
        "rzPhone": this.data.userInfo.rzPhone, //微信授权手机号认证
        "idNumFront": this.data.userInfo.idNumFront, //身份证正面照片
        "idNumBack": this.data.userInfo.idNumBack //身份证反面照片
      }
    }
    wx.showLoading({
      title: '提交中 ',
      mask: true
    })
    app.$API.wxRz(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          duration: config.timeoutSecond
        });
        this.userInfo();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true,
          duration: config.timeoutSecond
        })
        this.userInfo();
      }
      this.data.is_request = false;
    }).catch(() => {
      wx.hideLoading();
    })
  },
  // 提现
  wxOutMoney() {
    if (this.data.is_request) {
      return;
    }
    this.data.is_request = true;
    let str = '';
    if (this.data.cashAmount == '') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: config.timeoutSecond
      });
      this.data.is_request = false;
      return;
    }
    if (this.data.cashAmount * 100 > this.data.userInfo.cashAmount) {
      wx.showToast({
        title: `提现金额应小于${this.data.userInfo.cashAmount/100}`,
        icon: 'none',
        duration: config.timeoutSecond
      });
      this.data.is_request = false;
      return;
    }
    let params = {
      param: {
        "outMoney": this.data.cashAmount * 100 //提现金额
      }
    }
    wx.showLoading({
      title: '提现中 ',
      mask: true
    })
    app.$API.wxOutMoney(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提现成功',
          duration: config.timeoutSecond
        });
        this.userInfo();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          mask: true,
          duration: config.timeoutSecond
        })
        this.userInfo();
      }
      this.data.is_request = false;
    }).catch(() => {
      wx.hideLoading();
    })
  },
  cancel() {
    this.setData({
      isIdCard:false
    })
    // wx.navigateBack();
  },
  //问题
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