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
    canvasHidden: '',
    codeUrl:''
  },

  // 获取详情
  get_details(id) {
    let params = {
      param: {
        solitaireId: id
      }
    }
    app.$API.getSolitaireShareInfo(params).then(res => {
      this.setData({
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
        "path": "pages/tabBar/index/index", //小程序地址 pages开通
        "sence": decodeURIComponent("a=1&b=2"), // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）  const {query} = wx.getLaunchOptionsSync();const scene = decodeURIComponent(query.scene) 获取方式
        "width": 200, //二维码的宽度，单位 px，最小 280px，最大 1280px
      }
    }
    app.$API.getWxAppCode(params).then(res => {
      if(res.code == 200){
        this.setData({
          codeUrl: res.args.codeUrl
        });
      }
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

  // 获取小程序吗
  promisegetWxAppCode() {
    return new Promise((resolve, reject) => {
      console.log(this.data.codeUrl);
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
        fail:function(){
          resolve({
            'path': '/images/common/no_head.png',
            height: 375,
            width: 375
          });
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
    Promise.all([this.promise2(), this.promisegetWxAppCode()]).then(res => {
      console.log(res);
      var that = this;
      var context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#fff");
      context.fillRect(0, 0, 375, 667);
      var path1 = that.data.headerImg;
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
      context.drawImage(path2, 10, 60, 355, 355 * (res[0].height / res[0].width));
      context.stroke();
      // 商品名称
      context.setFontSize(18);
      context.setFillStyle('#000');
      context.setTextAlign('left');
      var title = `${this.data.title}`
      context.fillText(title, 10, (355 * (res[0].height / res[0].width)) + 100, 375 - 135);
      context.stroke();
      // 商品价格
      context.setFontSize(18);
      context.setFillStyle('#f90');
      context.setTextAlign('right');
      var title = `¥ ${((this.data.startMoney)/100).toFixed(2)} 起`
      context.fillText(title, 360, (355 * (res[0].height / res[0].width)) + 100);
      context.stroke();
      //介绍
      context.setFontSize(15);
      context.setFillStyle('#999');
      context.setTextAlign('left');
      // context.fillText(that.data.userInfo.nickName + "邀请您一起参加", 110, 50, 375 - 35);
      var title = `${this.data.summary ? this.data.summary:''}`;
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
      // context.drawImage(path1, 10, 10, 40, 40);
      context.drawImage(path1, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
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