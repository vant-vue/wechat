// component/transmit /transmit.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [],
  option: {
    multipleSlots: true
  },
  properties: {
    show_popup: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    popup: '', //打开弹窗类型
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show_popup: false
      })
    }
  },
  onShareAppMessage: function(e) {
    console.log(e)
    // return custom share data when user share.
  },
})