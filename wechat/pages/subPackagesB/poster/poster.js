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
    windowW: '',
    windowH: ''
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
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          windowW: res.screenWidth,
          windowH: res.screenHeight
        })
        that.formSubmit();
      },
    })
  },

  // 获取小程序
  promise1() {
    return new Promise((resolve, reject) => {
      if (!this.data.banner_list[0]){
        resolve({'path':'',});
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
    Promise.all([this.promise1()]).then(res => {
      console.log(res, 'reas');
      var that = this;
      var context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#fff");
      context.fillRect(0, 0, 375, 667);
      var path1 = "/images/common/logo.jpg";
      var path2 = res[0].path;
      var path3 = "/images/common/logo.jpg";
      var path4 = "/images/common/logo.jpg";
      var path5 = "/images/common/logo.jpg";
      // 小程序logo
      context.drawImage(path1, 10, 10, 40, 40);
      //绘制名字
      context.setFontSize(16);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      let title = `${this.data.info.nickName} 邀请你来接龙`
      context.fillText(title, 120, 35);
      context.stroke();
      // 商品图片
      context.drawImage(path2, 10, 60, 355, 355 * (res[0].height / res[0].width));
      // 商品名称
      context.setFontSize(16);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      let name = `${this.data.info.nickName} 邀请你来接龙`
      context.fillText(name, 70, (355 * (res[0].height / res[0].width))+90);
      // context.drawImage(path, 0, 100, 80, 80);
      // // context.arc(100, 80, 40, 0, Math.PI * 2, false);
      // context.arc(100, 80, 50, 0, 2 * Math.PI) //画出圆
      // context.clip();
      // context.restore();
      // var path5 = "/images/common/logo.jpg";
      // var path2 = "/images/common/logo.jpg";
      // var name = that.data.name;
      // context.drawImage(path2, 56, 400, 263, 121);

      // context.setFontSize(16);
      // context.setFillStyle('#f00');
      // context.setTextAlign('left');
      // context.fillText("邀请你来接龙", 200, 100);
      // context.stroke();
      // //绘制左下角文字
      // context.setFontSize(14);
      // context.setFillStyle('#333');
      // context.setTextAlign('left');
      // context.fillText("长按识别小程序", 70, 560);
      // context.stroke();
      // context.setFontSize(14);
      // context.setFillStyle('#333');
      // context.setTextAlign('left');
      // context.fillText("跟我一起来学习吧~~", 70, 580);
      // context.stroke();

      // //绘制右下角小程序二维码
      // context.drawImage(path5, 230, 530, 80, 80);

      context.draw();
      //将生成好的图片保存到本地
      setTimeout(function() {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 667,
          destWidth: 375,
          destHeight: 667,
          canvasId: 'mycanvas',
          success: function(res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
              canvasHidden: true
            });
            console.log(that.data.imagePath);
          },
          fail: function(res) {
            console.log(res);
          }
        });
      }, 200);
    })

  },
  //点击保存到相册
  baocun: function() {
    var that = this
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
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function(e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function() {
      wx.hideToast()
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