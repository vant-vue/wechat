// component/transmitImage/transmitImage.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [],
  properties: {
    goods: {
      type: Object,
      value: {}
    },
    order: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },
  /**
   * 生命周期函数，可以为函数，或一个在methods段中定义的方法名
   */
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取图片地址
    promise_url(img) {
      return new Promise((resolve, reject) => {
        if (!img) {
          resolve({
            'path': '/images/common/shop.png',
            height: 127,
            width: 127
          });
          return;
        }
        wx.getImageInfo({ //保存网络图片
          src: img, //请求的网络图片路径
          success: function(res) {
            resolve(res);
          }
        })
      })
    },
    imgcut(img, context, x, y) {
      var w = img.width
      var h = img.height
      var dw = 118 / w //canvas与图片的宽高比
      var dh = 118 / h
      var ratio
      // 裁剪图片中间部分
      if (w > 118 && h > 118 || w < 118 && h < 118) {
        if (dw > dh) {
          context.drawImage(img.path, 0, (h - 118 / dw) / 2, w, 118 / dw, x, y, 118, 118)
        } else {
          context.drawImage(img.path, (w - 118 / dh) / 2, 0, 118 / dh, h, x, y, 118, 118)
        }
      }
      // 拉伸图片
      else {
        if (w < 118) {
          context.drawImage(img.path, 0, (h - 118 / dw) / 2, w, 118 / dw, x, y, 118, 118)
        } else {
          context.drawImage(img.path, (w - 118 / dh) / 2, 0, 118 / dh, h, x, y, 118, 118)
        }
      }
    },
    //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    // 已结束
    createNewImg: function() {
      if (this.data.goods && Object.keys(this.data.goods).length == 0) {
        return;
      }
      console.log(this.data.order, this.data.goods)
      Promise.all([this.promise_url(this.data.order.userInfo.headerImg), this.promise_url(this.data.goods.goodsImg)]).then(res => {
        console.log(res);
        var that = this;
        var context = wx.createCanvasContext('mycanvas', this);
        context.setFillStyle("#fff");
        context.fillRect(0, 0, 375, 300);
        var path1 = "/images/center/user_top.png";
        var path2 = "/images/center/share_btn.png";

        // 顶部背景
        context.drawImage(path1, 0, 0, 375, 150);
        // //绘制名字----------------------
        context.setFontSize(18);
        context.setFillStyle('#fff');
        context.setTextAlign('left');
        var title = `${that.data.order.userInfo.nickName}`
        const nameWidth = context.measureText(title).width
        context.fillText(title, (375 + 50 - nameWidth) / 2, 60);
        // //接龙号----------------------
        context.setFontSize(34);
        context.setFillStyle('#fff');
        context.setTextAlign('center');
        var title = `${that.data.order.solitaireNo}. 已接龙+1`
        context.fillText(title, 185, 120);
        // //商品名称-------------------------
        context.setFontSize(20);
        context.setFillStyle('#000');
        context.setTextAlign('left');
        var title = `${that.data.goods.goodsName}`;
        if (title.length > 20) {
          var a = title.substr(0, 20);
          var b = title.substr(20, title.length);
          context.fillText(a, 130, 190, 375 - 150);
          context.fillText(b, 130, 220, 375 - 150);
        } else {
          context.fillText(title, 130, 190, 375 - 150);
        }
        // 商品图片-------------------------------------
        // context.drawImage(res[1].path, 0, 0, res[1].width, res[1].height, 0, 170, 118, 118);
        this.imgcut(res[1], context, 0, 170);
        context.stroke();

        // // // 小程序logo---------------------------
        //绘制的头像宽度
        let avatarurl_width = 50
        //绘制的头像高度
        let avatarurl_heigth = 50
        //绘制的头像在画布上的位置
        let avatarurl_x = (375 - 70 - nameWidth) / 2
        //绘制的头像在画布上的位置
        let avatarurl_y = 30
        // 绘制头像
        context.save()
        // 开始创建一个路径
        context.beginPath()
        // context.setStrokeStyle('#f00')
        // 画一个圆形裁剪区域
        context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
        // 裁剪
        context.clip()
        // 绘制图片
        context.drawImage(res[0].path, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth)
        context.restore()
        // 按钮----------------
        context.drawImage(path2, 88, 205, 200, 50);
        context.setFontSize(20);
        context.setFillStyle('#fff');
        context.setTextAlign('center');
        var title = `我也要接龙`
        context.fillText(title, 190, 237);
        context.draw();
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 375 * 4,
            height: 300 * 4,
            destWidth: 375 * 4,
            destHeight: 300 * 4,
            canvasId: 'mycanvas',
            success: function(res) {
              that.data.imagePath = res.tempFilePath;
              that.triggerEvent('imagePathFun', that.data.imagePath);
            },
            fail: function(res) {
              console.log(res);
            }
          }, this);
        }, 200)
      })

    },
  },
  observers: {
    'goods': function() {
      this.createNewImg();
    }
  }
})