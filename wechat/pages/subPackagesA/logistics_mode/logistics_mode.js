// pages/subPackagesA/logistics_mode/logistics_mode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: ['没有物流', '快递发货', '提货点自提'],
    objectArray: [{
        id: 3,
        name: '没有物流'
      },
      {
        id: 1,
        name: '快递发货'
      },
      {
        id: 2,
        name: '提货点自提'
      }
    ],
    modeList: [],
    getAddress: '' ////当用户发布的物流方式为自提的时候 需要设置发布人的提货地址  即当type==2有此数据
  },
  // 新增商品
  add_mode() {
    this.setData({
      "modeList": this.data.modeList.concat({
        mode: ''
      })
    })
  },
  // 删除商品
  del_mode(e) {
    let list = JSON.parse(JSON.stringify(this.data.modeList));
    list.pop();
    this.setData({
      "modeList": list
    })
  },
  //监听input 商品
  listenerInput(e) {
    let value = e.detail.value || '';
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let str = `modeList[${index}].${row}`;
    this.setData({
      [str]: value.replace(/,/g, "")
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
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      mode_list: [],
      getAddress: ''
    });
  },
  submit() {
    // console.log(this.data.objectArray[this.data.index]);
    // console.log(this.data.modeList);
    // console.log(this.data.getAddress);
    if (this.data.objectArray[this.data.index].id == 2 && !this.data.getAddress) {
      wx.showToast({
        title: '请填写地址',
        icon: "none",
        duration: 3000
      })
      return
    }
    let str = '';
    this.data.modeList.forEach(item => {
      if (!item.mode) {
        str = '请填写自定义填写项'
        return;
      }
    })
    if (str) {
      wx.showToast({
        title: str,
        icon: "none",
        duration: 3000
      })
      return;
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      "params.logisticsType": this.data.objectArray[this.data.index].id,
      "params.logisticsTypeName": this.data.objectArray[this.data.index].name,
      "params.getAddress": this.data.getAddress ? this.data.getAddress : '',
      "params.mode": this.data.modeList.map(item => {
        return item.mode
      }).join(",")
    });
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let mode = options.mode.split(',').map(item => {
      return {
        mode: item
      }
    });
    let type = 0;
    this.data.objectArray.forEach((item, index) => {
      if (item.id == options.type) {
        type = index
      }
    })
    if (options.mode) {
      this.setData({
        modeList: mode
      });
    }
    this.setData({
      index: type,
      getAddress: options.getAddress
    });
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
  onUnload: function() {},

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