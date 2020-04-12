// pages/subPackagesB/my_chipped_released/my_chipped_released.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_list: [
      1, 2, 3
    ],
    show_popup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 转发
  show_popup_fun() {
    this.setData({
      show_popup: true
    })
  },
  // 接龙设置
  solitaire_fun() {
    wx.showActionSheet({
      itemList: ['编辑接龙内容', '暂停接龙', '恢复接龙', '删除接龙'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: "/pages/subPackagesA/group_buying_solitaire/group_buying_solitaire"
          })
        } else if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '是否确定暂停接龙？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.tapIndex == 2) {
          wx.showModal({
            title: '提示',
            content: '当前接龙已有订单，如需停止接龙可设为暂停接龙',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.tapIndex == 3) {
          wx.showModal({
            title: '提示',
            content: '确认删除接龙吗？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})