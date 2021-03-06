// pages/subPackagesA/editDetails/editDetails.js
const app = getApp();
import config from '../../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    summary: "",
    imgList: [],
    index: '',
    pictureList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
      index: options.index,
      summary: options.summary,
      imgList: options.img ? options.img.split(";") : []
    })
  },
  // 图片上传
  uploadImg(imgurl) {
    console.log(imgurl);
    return new Promise((resolve, reject) => {
      if (imgurl.length == 0){
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
  get_img_list(e) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    this.uploadImg(e.detail).then(res => {
      wx.hideLoading();
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      let str = `goodsList[${this.data.index}].goodsImg`
      prevPage.setData({
        [str]: res.join(";")
      })
    });
  },
  //监听input 商品
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let str = `goodsList[${this.data.index}].${row}`
    prevPage.setData({
      [str]: value
    })
  },
  submit() {
    wx.navigateBack();
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
  onShareAppMessage: function (options) {
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      // title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/tabBar/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/center/zf.jpeg',
      success: function () { // 转发成功之后的回调
      },
      fail: function () { // 转发失败之后的回调
      },
      complete: function () { }
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