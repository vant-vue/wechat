Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据（私有数据，可用于模板渲染）
   */
  data: {
    noData: false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },
  /**
   * 生命周期函数，可以为函数，或一个在methods段中定义的方法名
   */
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    if (Object.keys(this.data.list).length == 0) {
      this.data.noData = true;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下弹框选择
    select(e) {
      let item = e.currentTarget.dataset.item;
      let index = e.currentTarget.dataset.index;
      this.setData({
        show: false
      })
      this.triggerEvent('selectValue', item)
    },
    // 取消
    cancel: function () {
      this.setData({
        show: !this.data.show
      });
    },
  }
})