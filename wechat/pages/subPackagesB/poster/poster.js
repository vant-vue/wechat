// pages/subPackagesB/poster/poster.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaire: {},
    logistics: {},
    goodsList: [],
    info: {},
    isMine: '',
    imagePath: '',
    canvasHidden: ''
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
      });
      this.createNewImg();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id);
    let that = this;
    this.get_details(options.id);
  },

  // 获取小程序
  promise1() {
    return new Promise((resolve, reject) => {
      if (!this.data.banner_list[0]) {
        resolve({
          'path': '/images/common/shop.png',
          height: 375,
          width: 375
        });
        return;
      }
      wx.getImageInfo({ //保存网络图片
        src: this.data.banner_list[0], //请求的网络图片路径
        success: function(res) {
          resolve(res);
        }
      })
    })
  },
  promise2() {
    return new Promise((resolve, reject) => {
      if (!this.data.banner_list[0]) {
        resolve({
          'path': '/images/common/shop.png',
          height: 375,
          width: 375
        });
        return;
      }
      wx.getImageInfo({ //保存网络图片
        src: this.data.banner_list[0], //请求的网络图片路径
        success: function(res) {
          resolve(res);
        }
      })
    })
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    Promise.all([this.promise1(), this.promise2()]).then(res => {
      var that = this;
      var context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#fff");
      context.fillRect(0, 0, 375, 667);
      var path1 = "/images/common/logo.jpg";
      var path2 = res[0].path;
      var path3 = res[1].path;
      // 小程序logo
      context.drawImage(path1, 10, 10, 40, 40);
      //绘制名字
      context.setFontSize(18);
      context.setFillStyle('#333333');
      context.setTextAlign('left');
      var title = `${this.data.info.nickName} 邀请你来接龙`
      context.fillText(title, 70, 35);
      context.stroke();
      // 商品图片
      context.drawImage(path2, 10, 60, 355, 355 * (res[0].height / res[0].width));
      context.stroke();
      // 商品名称
      context.setFontSize(18);
      context.setFillStyle('#000');
      context.setTextAlign('left');
      var title = `${this.data.solitaire.title}`
      context.fillText(title, 10, (355 * (res[0].height / res[0].width)) + 100, 375 - 135);
      context.stroke();
      // 商品价格
      context.setFontSize(18);
      context.setFillStyle('#f90');
      context.setTextAlign('right');
      var title = `¥ ${((this.data.goodsList[0].price)/100).toFixed(2)} 起`
      context.fillText(title, 360, (355 * (res[0].height / res[0].width)) + 100);
      context.stroke();
      //介绍
      context.setFontSize(15);
      context.setFillStyle('#999');
      context.setTextAlign('left');
      // context.fillText(that.data.userInfo.nickName + "邀请您一起参加", 110, 50, 375 - 35);
      var title = `${this.data.solitaire.summary ? this.data.solitaire.summary:''}`;
      if (title.length > 37) {
        var a = title.substr(0, 37);
        var b = title.substr(37, title.length);
        context.fillText(a, 10, (355 * (res[0].height / res[0].width)) + 130, 375 - 10);
        context.fillText(b, 10, (355 * (res[0].height / res[0].width)) + 150, 375 - 10);

      } else {
        context.fillText(title, 10, (355 * (res[0].height / res[0].width)) + 130, 375 - 10);
      }
      // 小程序码
      context.drawImage(path3, 138, (355 * (res[0].height / res[0].width)) + 130 + 30, 100, 100 * (res[0].height / res[0].width));
      context.stroke();
      // 文字
      context.setFontSize(14);
      context.setFillStyle('#999');
      context.setTextAlign('center');
      var title = `微信扫码，开始接龙`
      context.fillText(title, 190, (355 * (res[0].height / res[0].width)) + 130 + 30 + 125, 375 - 135);

      context.stroke();
      context.draw();
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375 * 4,
          height: 667 * 4,
          destWidth: 375 * 4,
          destHeight: 667 * 4,
          canvasId: 'mycanvas',
          success: function(res) {
            that.data.imagePath = res.tempFilePath;
          },
          fail: function(res) {
            console.log(res);
          }
        });
      }, 200)
    })

  },
  openSetting() {
    wx.openSetting()
  },
  //点击保存到相册
  baocun: function() {
    //将生成好的图片保存到本地
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
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
        }
      }

    })

  },
  //点击生成
  formSubmit: function(e) {
    var that = this;
    this.setData({
      maskHidden: false
    });

    setTimeout(function() {
      that.createNewImg();
      // that.setData({
      //   maskHidden: true
      // });
    }, 1000)
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
      // path: '//pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
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