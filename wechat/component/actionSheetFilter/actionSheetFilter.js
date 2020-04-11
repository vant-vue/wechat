// component/actionSheetFilter/actionSheetFilter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object,
      value: {}
    },
    show: {
      type: Boolean,
      value: false
    },
    //弹窗类型（一个页面多次引用此组件区别）
    type: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据（私有数据，可用于模板渲染）
   */
  data: {
    noData: false,
    date:""
  },
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
    if (Object.keys(this.data.list).length == 0) {
      this.data.noData = true;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    // 取消
    cancel: function() {
      this.setData({
        show: !this.data.show
      });
    },
  }
})