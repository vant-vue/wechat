import config from "./config.js"
const baseUrl = config.api_url;
// interceptor(请求拦截)
const request = ((options) => {
  if (options) {
    // url
    if (options.url.indexOf('http') != 0) {
      options.url = baseUrl + options.url;
    }
    // header 设置Content-Type，token
    if (options.header === undefined || options.header === null) {
      options.header = {};
    }
    // token
    let token = wx.getStorageSync('token') || "";
    if (token) {
      options.header['Authorization'] = token;
    }
    // method
    if (options.method === undefined || options.method === null) {
      options.method = 'post';
    }
    //success
    if (options.success && typeof(options.success) === 'function') {
      let successCallback = options.success;
      options.success = function(res) {
        // 判断不同的返回码 200
        if (res.statusCode === 200) {
          try {
            //调用自定义的success
            successCallback(res.data);
            if (res.data.code == "200" && res.data.args.token) {
              wx.setStorageSync('token', res.data.args.token)
            }
          } catch (e) {
            console.error('出错了，' + e + ',接口返回数据:' + res.data);
          }
        } else {
          console.log(res.statusCode, "网络");
        }
      }
    }
    //fail
    if (options.fail && typeof(options.fail) === 'function') {
      let failCallback = options.fail;
      options.fail = function(error) {
        failCallback(error);
        if (error.errMsg == "request:fail ") {
          wx.showToast({
            title: '网络链接失败',
            icon: 'none',
            duration: 3000
          })
        }
      }
    }
  }
  wx.request(options)
})
export default request;