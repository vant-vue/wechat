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