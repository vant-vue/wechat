// component/actionSheetFilter/actionSheetFilter.js
const util = require('../../utils/util.js');
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
    date: "",
    isOrderDate: 'all',
    isHasRemark: 'all',
    isRefundStatus: 'all',
    changeData: {
      orderDate: '',
      hasRemark: '',
      refundStatus: ''
    }
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
    isOrderDate_fun(e) {
      let type = e.currentTarget.dataset.type
      let date;
      if (type == 'all') {
        date = '';
      } else if (type == 1) {
        date = util.formatTime(new Date(), 'day')
      } else if (type == 2) {
        date = util.formatTimeYes(new Date(), 'day')
      } else if (type == 3) {
        date = this.data.date
      }
      this.setData({
        isOrderDate: type,
        'changeData.orderDate': date
      })
    },
    isHasRemark_fun(e) {
      let type = e.currentTarget.dataset.type;
      let value
      if (type == 'all') {
        value = '';
      } else {
        value = type;
      }
      this.setData({
        isHasRemark: type,
        'changeData.hasRemark': value
      })
    },
    isRefundStatus_fun(e) {
      let type = e.currentTarget.dataset.type;
      let value
      if (type == 'all') {
        value = '';
      } else {
        value = type;
      }
      this.setData({
        isRefundStatus: type,
        'changeData.refundStatus': value
      })
    },
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value,
        'changeData.orderDate': e.detail.value
      })
    },
    // 确定
    ok() {
      this.triggerEvent('ok', this.data.changeData);
      this.close();
    },
    close(){
      this.setData({
        show: false
      });
    },
    // 取消
    cancel: function() {
      this.setData({
        isOrderDate: 'all',
        isHasRemark: 'all',
        isRefundStatus: 'all',
        changeData: {
          orderDate: '',
          hasRemark: '',
          refundStatus: ''
        }
      });
    },
  }
})