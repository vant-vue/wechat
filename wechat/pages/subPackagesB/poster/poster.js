// pages/subPackagesB/poster/poster.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    solitaireId: '',
    solitaire: {},
    logistics: {},
    goodsList: [],
    banner_list: [],
    info: {},
    isMine: '',
    imagePath: '',
    canvasHidden: '',
    codeUrl: ''
  },

  // 获取详情
  get_details(id) {
    let params = {
      param: {
        solitaireId: id
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.$API.getSolitaireShareInfo(params).then(res => {
      this.setData({
        type: res.args.type,
        nickName: res.args.nickName,
        headerImg: res.args.headerImg,
        title: res.args.title,
        summary: res.args.summary,
        startMoney: res.args.startMoney,
        banner_list: res.args.img ? res.args.img.split(';') : []
      });
      this.getWxAppCode();
    })
  },
  // 获取小程序码
  getWxAppCode() {
    let params = {
      param: {
        "path": "pages/subPackagesB/released_group/released_group", //小程序地址 pages开通
        "sence": `${this.data.solitaireId}`, // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）  const {query} = wx.getLaunchOptionsSync();const scene = decodeURIComponent(query.scene) 获取方式
        "width": 200, //二维码的宽度，单位 px，最小 280px，最大 1280px
      }
    }
    app.$API.getWxAppCode(params).then(res => {
      if (res.code == 200) {
        this.setData({
          codeUrl: res.args.codeUrl
        });
      }
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id);
    this.data.solitaireId = options.id;
    this.get_details(options.id);
  },

  // 获取小程序吗
  promisegetWxAppCode() {
    return new Promise((resolve, reject) => {
      if (!this.data.codeUrl) {
        resolve({
          'path': '/images/common/no_head.png',
          height: 375,
          width: 375
        });
        return;
      }
      wx.getImageInfo({ //保存网络图片
        src: this.data.codeUrl, //请求的网络图片路径
        success: function(res) {
          resolve(res);
        },
        fail: function() {
          resolve({
            'path': '/images/common/no_head.png',
            height: 375,
            width: 375
          });
        }
      })
    })
  },
  promise_url(img) {
    return new Promise((resolve, reject) => {
      if (!img) {
        resolve({
          'path': '/images/common/shop.png',
          height: 375,
          width: 375
        });
        return;
      }
      wx.getImageInfo({ //保存网络图片
        src: img, //请求的网络图片路径
        success: function(res) {
          resolve(res);
        },
        fail(err) {
          resolve({
            'path': '/images/common/shop.png',
            height: 375,
            width: 375
          });
        }
      })
    })
  },
  imgcut(img, context, x, y) {
    var w = img.width
    var h = img.height
    var dw = 355 / w //canvas与图片的宽高比
    var dh = 355 / h
    var ratio
    // 裁剪图片中间部分
    if (w > 355 && h > 355 || w < 355 && h < 355) {
      if (dw > dh) {
        context.drawImage(img.path, 0, (h - 355 / dw) / 2, w, 355 / dw, x, y, 355, 355)
      } else {
        context.drawImage(img.path, (w - 355 / dh) / 2, 0, 355 / dh, h, x, y, 355, 355)
      }
    }
    // 拉伸图片
    else {
      if (w < 355) {
        context.drawImage(img.path, 0, (h - 355 / dw) / 2, w, 355 / dw, x, y, 355, 355)
      } else {
        context.drawImage(img.path, (w - 355 / dh) / 2, 0, 355 / dh, h, x, y, 355, 355)
      }
    }
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    //将生成好的图片保存到本地
    wx.showLoading({
      title: '海报生成中...',
      mask: true
    });
    Promise.all([this.promise_url(this.data.banner_list[0]), this.promisegetWxAppCode(), this.promise_url(this.data.headerImg)]).then(res => {
      var that = this;
      var context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#fff");
      context.fillRect(0, 0, 375, 667);
      var path1 = res[2].path;
      var path2 = res[0].path;
      var path3 = res[1].path;
      //绘制名字------------------------------------------
      context.setFontSize(18);
      context.setFillStyle('#333333');
      context.setTextAlign('left');
      var title = `${this.data.nickName} 邀请你来接龙`
      context.fillText(title, 70, 35);
      context.stroke();
      // 商品图片
      if (path2 == '/images/common/shop.png') {
        context.drawImage(path2, 10, 60, 355, 355);
      } else {
        // context.drawImage(path2, 0, 0, res[0].width, res[0].height, 10, 60, 355, 355);
        this.imgcut(res[0], context, 10, 60);
      }
      context.stroke();
      // 商品名称
      context.setFontSize(18);
      context.setFillStyle('#000');
      context.setTextAlign('left');
      var title = `${this.data.title}`
      if (title.length > 15) {
        title = title.substr(0, 15) + '...'
      }
      context.fillText(title, 10, 440, 375 - 135);
      context.stroke();
      // 商品价格
      context.setFontSize(18);
      context.setFillStyle('#f90');
      context.setTextAlign('right');
      var title = '';
      if (that.data.type == 1) {
        title = `¥ ${((this.data.startMoney)/100).toFixed(2)} 起`
      } else if (that.data.type == 2) {
        title = `¥ ${((this.data.startMoney)/100).toFixed(2)} /份`
      }
      context.fillText(title, 360, 440);
      context.stroke();
      //介绍
      context.setFontSize(14);
      context.setFillStyle('#999');
      context.setTextAlign('left');
      var summary = `${this.data.summary ? this.data.summary:''}`;
      summary = summary.replace(/[\r\n]/g, "");
      var tempTitle = summary;

      tempTitle = tempTitle.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\uD800-\uDBFF]|[\uDC00-\uDFFF]|[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, '*');
      var c = tempTitle.length > 45 ? tempTitle.substr(0, 45) + "..." : tempTitle;
      var clen = (c.split('*')).length - 1;
      summary = summary.substr(0, c.length + clen);
      if (c.indexOf("...") != -1) {
        summary += "...";
      }
      if (tempTitle.length > 28) {
        var a = tempTitle.substr(0, 28);
        var alen = (a.split('*')).length - 1;
        var atitle = summary.substr(0, 28 + alen);
        var b = summary.substr(28 + alen, summary.length);
        context.fillText(atitle, 10, 465, 375 - 20);
        context.fillText(b, 10, 490, 375 - 20);
      } else {
        context.fillText(summary, 10, 465, 375 - 10);
      }
      // 小程序码
      context.drawImage(path3, 122, 500, 130, 130);
      context.stroke();
      // 文字
      context.setFontSize(14);
      context.setFillStyle('#999');
      context.setTextAlign('center');
      var title = `微信扫码，开始接龙`
      context.fillText(title, 185, 655, 375 - 135);

      context.stroke();
      // 小程序logo----------------------------------
      //绘制的头像宽度
      let avatarurl_width = 40
      //绘制的头像高度
      let avatarurl_heigth = 40
      //绘制的头像在画布上的位置
      let avatarurl_x = 10
      //绘制的头像在画布上的位置
      let avatarurl_y = 10
      // 绘制头像
      context.save()
      // 开始创建一个路径
      context.beginPath()
      // 画一个圆形裁剪区域
      context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
      // 裁剪
      context.clip();
      // 绘制图片
      context.drawImage(path1, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
      context.draw(true, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375 * 4,
          height: 667 * 4,
          destWidth: 375 * 4,
          destHeight: 667 * 4,
          canvasId: 'mycanvas',
          success: function(res) {
            that.setData({
              imagePath: res.tempFilePath
            });
            that.baocun();
          },
          fail: function(res) {
            console.log(res);
          }
        });
      });
      // setTimeout(() => {
      //   wx.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     width: 375 * 4,
      //     height: 667 * 4,
      //     destWidth: 375 * 4,
      //     destHeight: 667 * 4,
      //     canvasId: 'mycanvas',
      //     success: function(res) {
      //       that.setData({
      //         imagePath: res.tempFilePath
      //       });
      //       that.baocun();
      //     },
      //     fail: function(res) {
      //       console.log(res);
      //     }
      //   });
      // }, 200)
    })
  },
  openSetting() {
    wx.openSetting()
  },
  //保存到相册
  baocun: function() {
    var that = this
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.showModal({
            content: '相册未授权',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#333',
            success: function(res) {
              if (res.confirm) {
                that.openSetting();
              }
            },
            fail: function(res) {
              console.log(res, 'fail');
            }
          })
          wx.hideLoading();
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success(res) {
              wx.showModal({
                content: '海报已保存到相册',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#333',
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  }
                },
                fail: function(res) {
                  console.log(res, 'fail');
                }
              })
            }
          })
          wx.hideLoading();
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
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res.userInfo, "huoqudao le ")
    //     this.setData({
    //       name: res.userInfo.nickName,
    //     })
    //   }
    // })
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
    this.popup_close();
    this.forwadStatics();
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/subPackagesB/released_group/released_group?id=' + that.data.solitaireId, // 默认是当前页面，必须是以‘/’开头的完整路径
      // path: '/pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/home/wechat.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
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