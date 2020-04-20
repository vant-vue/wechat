export default {
  check_required(input) //验证是否必填
  {
    if (typeof input == 'undefined' || input == undefined || input == '' || input == null) {
      return false;
    } else {
      return true;
    }
  },
  check_mobile(input) //验证手机号码
  {
    if ((/^1[0-9]{10}$/.test(input)) || (/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(input))) {
      return true;
    } else {
      return false;
    }
  },
  check_email(input) //验证邮箱
  {
    if ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(input))) {
      return true;
    } else {
      return false;
    }
  },
  //验证字母加数据
  check_text: function (input) {
    if (/^(?=.*[a-z])[a-z0-9]+/ig.test(input)) {
      return true;
    } else {
      return false;
    }
  },
  //正数
  check_positive: function (input) {
    if ((/^[0-9]+.?[0-9]*$/.test(input)) && input > 0) {
      return true;
    } else {
      return false;
    }
  }
}