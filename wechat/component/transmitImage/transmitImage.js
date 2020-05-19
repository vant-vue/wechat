// component/transmitImage/transmitImage.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [],
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    solitaireId: '',
    imgList: [],
    nickName: '',
    startMoney: '',
    title: '',
    headerImg: '',
    solitaireNo: '',
    goods: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      this.getSolitaireShareInfo();
    },
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
    getSolitaireShareInfo() {
      if (!this.data.solitaireId) {
        return;
      }
      let params = {
        param: {
          "solitaireId": this.data.solitaireId, //接龙ID  必传
          "orderId": '', //订单ID 可空 当不是完成参与接龙时 为空
        }
      }
      app.$API.getSolitaireShareInfo(params).then(res => {
        if (!res.flag){
          that.triggerEvent('imagePathFun', ['', '']);
        }else{
          this.setData({
            imgList: res.args.img ? res.args.img.split(';') : [],
            nickName: res.args.nickName ? res.args.nickName : '',
            startMoney: (res.args.startMoney / 100).toFixed(2),
            title: res.args.title ? res.args.title : '',
            headerImg: res.args.headerImg,
            solitaireNo: res.args.solitaireNo,
            goods: res.args.goods ? res.args.goods : [],
          })
          this.createNewImg();
        }
      }).catch(() => {})
    },
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
          },
          fail: function(err) {
            resolve({
              'path': '/images/common/shop.png',
              height: 127,
              width: 127
            });
          }
        })
      })
    },
    imgcut(img, context, x, y) {
      var w = img.width
      var h = img.height
      var dw = 118 / w; //canvas与图片的宽高比
      var dh = 118 / h;
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
      Promise.all([this.promise_url(this.data.imgList[0]), this.promise_url(this.data.imgList[1]), this.promise_url(this.data.imgList[2]), this.promise_url(this.data.headerImg)]).then(res => {
        var that = this;
        var context = wx.createCanvasContext('mycanvas', this);
        context.setFillStyle("#fff");
        context.fillRect(0, 0, 375, 300);
        var path1 = "/images/center/user_top.png";
        var path2 = "/images/center/share_btn.png";

        // 顶部背景
        context.drawImage(path1, 0, 0, 375, 100);
        // //绘制名字----------------------
        context.setFontSize(18);
        context.setFillStyle('#fff');
        context.setTextAlign('center');
        var title = `${that.data.nickName} 的接龙`
        context.fillText(title, 186, 85);
        // //介绍--------------------------
        context.setFontSize(20);
        context.setFillStyle('#000');
        context.setTextAlign('left');
        // context.fillText(that.data.userInfo.nickName + "邀请您一起参加", 110, 50, 375 - 35);
        var title = `${that.data.title}`;
        if (title.length > 20) {
          var a = title.substr(0, 20) + '...';
          var b = title.substr(20, title.length);
          context.fillText(a, 0, 130, 375 - 150);
          // context.fillText(b, 0, 150, 375 - 150);
        } else {
          context.fillText(title, 0, 130, 375 - 150);
        }
        // 价格--------------------------
        context.setFontSize(20);
        context.setFillStyle('#f90');
        context.setTextAlign('right');
        var title = `￥${that.data.startMoney}起`
        context.fillText(title, 375, 130);

        // 商品图片-------------------------------------
        this.imgcut(res[0], context, 0, 160);
        this.imgcut(res[1], context, 128, 160);
        this.imgcut(res[2], context, 256, 160);
        // context.drawImage(res[0].path, 0, 0, res[0].width, res[0].height, 0, 160, 118, 118);
        // context.drawImage(res[1].path, 0, 0, res[1].width, res[1].height, 128, 160, 118, 118);
        // context.drawImage(res[2].path, 0, res[2].height / 2, res[2].width, res[2].height, 256, 160, 118, 118);
        // context.drawImage(res[2].path, 256, 230, 118 * (res[2].width / res[2].height), 118);
        context.stroke();

        // // 小程序logo---------------------------
        //绘制的头像宽度
        let avatarurl_width = 50
        //绘制的头像高度
        let avatarurl_heigth = 50
        //绘制的头像在画布上的位置
        let avatarurl_x = 160
        //绘制的头像在画布上的位置
        let avatarurl_y = 10
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
        context.drawImage(res[3].path, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth)
        context.restore()
        // 按钮
        context.drawImage(path2, 85, 195, 200, 50);
        context.setFontSize(20);
        context.setFillStyle('#fff');
        context.setTextAlign('center');
        var title = `参与接龙`
        context.fillText(title, 185, 228);
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
              that.triggerEvent('imagePathFun', [that.data.imagePath, that.data.nickName]); 
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
    // 'solitaireId': function(id) {
    //   console.log(id, 'solitaireId');
    //   this.getSolitaireShareInfo();
    // }
  }
})