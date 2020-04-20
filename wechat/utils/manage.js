import request from 'request.js';

// post
export function postAction(url, parameter, paramsMethod) {
  if (paramsMethod) {
    parameter = Object.assign(parameter, paramsMethod);
  }

  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'post',
      data: parameter,
      success: function(res) {
        // if(res.code != 200){
        //   wx.showToast({
        //     title: res.msg,
        //     icon: 'none',
        //     duration: 3000
        //   })
        // }
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      },
      complete: function(res) {}
    })
  })
}
// post（application/x-www-form-urlencoded;charset=utf-8）
export function postActionUrlencoded(url, parameter, paramsMethod) {
  if (paramsMethod) {
    parameter = Object.assign(parameter, paramsMethod);
  }
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'post',
      data: parameter,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function(res) {
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      },
      complete: function(res) {}
    })
  })
}
// get
export function getAction(url, parameter) {
  if (paramsMethod) {
    parameter = Object.assign(parameter, paramsMethod);
  }
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'get',
      data: parameter,
      success: function(res) {
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      },
      complete: function(res) {}
    })
  })
}