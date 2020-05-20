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
    },
    imagePath: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    popup: '', //打开弹窗类型
    src:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show_popup: false
      });
      this.triggerEvent('close',{});
    }
  },
  observers: {
    'imagePath': function (v) {
      this.setData({
        src: v
      });
    }
  }
})