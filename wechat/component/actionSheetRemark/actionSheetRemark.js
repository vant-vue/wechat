// component/actionSheetRemark/actionSheetRemark.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据（私有数据，可用于模板渲染）
   */
  data: {
    value: '',
    id:''
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
  ready: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    //监听input 普通输入框
    listenerInputSimple(e) {
      let value = e.detail.value || '';
      let row = e.currentTarget.dataset.row;
      this.setData({
        [row]: value
      });
    },
    // 确定
    ok() {
      this.triggerEvent('ok', {
        value: this.data.value,
        id: this.data.id
      });
      this.close();
    },
    close() {
      this.setData({
        show: !this.data.show
      });
    },
    // 取消
    cancel: function() {
      this.close();
    },
  }
})