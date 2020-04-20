// pages/tabBar/record/record.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    list: [],
    param: {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
    },
    last: false
  },
  toggle(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      'tab': tab
    });
    this.data.param.pageNo = 1;
    this.data.param.pageSize = 10;
    this.data.list = [];
    this.get_list();
  },
  get_list() {
    let params = {
      param: this.data.param
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let obj;
    if (this.data.tab == 1) {
      obj = app.$API.myPubList(params)
    } else if (this.data.tab == 2) {
      obj = app.$API.myJoinList(params)
    }
    obj.then(res => {
      if (this.data.tab == 1) {
        this.setData({
          list: this.data.list.concat(res.args.pubList)
        })
      } else if (this.data.tab == 2) {
        this.setData({
          list: this.data.list.concat(res.args.joinList)
        })
      }
      if (res.args.pubList.length < 10 || res.args.joinList.length<10) {
        this.data.last = true;
      } else {
        this.data.last = false;
      }
      console.log(this.data.list);
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  // 滚动加载
  scrollBottom: function(e) {
    if (!this.data.last) {
      this.data.param.pageNo += 1;
      this.get_list();
    }
  },
  //跳转
  jump(e) {
    let page;
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let url = '';
    if (this.data.tab == 1) {
      page = "group"
    } else if (this.data.tab == 2) {
      page = "join"
    }
    switch (page) {
      case 'group':
        if (type == 1) {
          url = '/pages/subPackagesB/released_group/released_group?id=' + id;
        } else if (type == 2) {
          url = '/pages/subPackagesB/my_chipped_released/my_chipped_released?id=' + id;
        }
        break;
      case 'join':
        if (type == 1) {
          url = '/pages/subPackagesB/participation_group/participation_group?id=' + id;
        } else if (type == 2) {
          url = '/pages/subPackagesB/my_chipped_participation/my_chipped_participation?id=' + id;
        }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.param = {
      "pageNo": 1, //页数
      "pageSize": 10, //单页记录数
    };
    this.data.list = [];
    this.get_list();
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
  onShareAppMessage: function() {

  }
})