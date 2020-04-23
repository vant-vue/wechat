// component/actionSheetFilterOrder/actionSheetFilterOrder.js
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
    list: [{
        title: '收入',
        item: [{
            name: "收款",
            value: '101',
            checked: false
          },
          {
            name: "充值",
            value: '103',
            checked: false
          },
          {
            name: "退款",
            value: '102',
            checked: false
          },
          {
            name: "手续费",
            value: '104',
            checked: false
          },

        ]
      },
      {
        title: '支出',
        item: [{
            name: "消费",
            value: '201',
            checked: false
          },
          {
            name: "提现",
            value: '202',
            checked: false
          },
          {
            name: "退款",
            value: '203',
            checked: false
          },
          {
            name: "手续费",
            value: '204',
            checked: false
          }
        ]
      }
    ],
    type: [],

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

  },
  /**
   * 组件的方法列表
   */
  methods: {
    ok() {
      let type = [];
      this.data.list.forEach((item, index) => {
        item.item.forEach((i, v) => {
          if (i.checked) {
            type.push(i.value);
          }
        })
      })
      this.triggerEvent('ok', type);
      this.cancel();
    },
    click(e) {
      console.log(e.currentTarget.dataset);
      let checked = e.currentTarget.dataset.checked;
      let index = e.currentTarget.dataset.index;
      let index2 = e.currentTarget.dataset.index2;
      let value = e.currentTarget.dataset.value;
      let name_checked = `list[${index}].item[${index2}].checked`;
      this.setData({
        [name_checked]: !checked
      })
    },
    // 清空
    empty() {
      this.setData({
        list: [{
            title: '收入',
            item: [{
                name: "收款",
                value: '1',
                checked: false
              },
              {
                name: "充值",
                value: '2',
                checked: false
              },
              {
                name: "退款",
                value: '3',
                checked: false
              },
              {
                name: "手续费",
                value: '4',
                checked: false
              },

            ]
          },
          {
            title: '支出',
            item: [{
                name: "消费",
                value: '5',
                checked: false
              },
              {
                name: "提现",
                value: '6',
                checked: false
              },
              {
                name: "退款",
                value: '7',
                checked: false
              },
              {
                name: "手续费",
                value: '8',
                checked: false
              }
            ]
          }
        ]
      });
    },
    // 取消
    cancel: function() {
      this.setData({
        show: !this.data.show
      });
    },
  }
})