// component/shopNum/shopNum.js
Component({
  properties: {
    code: {
      type: String,
      value: null
    },
    max: { //传如的最大值
      type: Number,
      value: 5
    },
    min: {
      type: Number,
      value: 0
    },
    count: {
      type: Number,
      value: 1
    },
    errorMsg: {
      type: String,
      value: ''
    }
  },
  data: {},
  methods: {
    /*逻辑事件*/
    setNewCount: function(count) {
      let _count = this.data.count;
      if (count != _count) {
        let _data = {};
        _data.count = count;
        if (this.data.code) _data.code = this.data.code;
        console.log(_data);
        this.triggerEvent('callChangeCount', _data);
        this.setData({
          count: count
        });
      }
    },
    /*页面交互*/
    tapBtn: function(evt) {
      const _tar = evt.currentTarget.dataset.tar;
      const _max = this.data.max;
      const _min = this.data.min;
      let _count = this.data.count;
      if (_tar == 'plus') {
        if (_count < _max) {
          _count++;
        }
      } else {
        if (_count > _min) {
          _count--;
        }
      };
      this.setNewCount(_count);
    },
    blurHandle: function(evt) {
      let _value = evt.detail.value;
      const _max = this.data.max;
      const _min = this.data.min;
      let _count = _value;
      if (_count > _max) _count = _max;
      if (_count < _min) _count = _min;
      this.setNewCount(_count);
    },
    inputHandle: function(evt) {
      let _value = evt.detail.value;
      this.setData({
        count: _value
      });
    }

  }
})