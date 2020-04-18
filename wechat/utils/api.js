import {
  postAction,
  postActionUrlencoded
} from "./manage.js"
// 授权登录
const getSessionKey = (params) => postActionUrlencoded("/wx/wxLogin/getSessionKey", params, {});
// 微信登录
const wxLogin = (params) => postActionUrlencoded("/wx/wxLogin/login", params, {});
// 文件上传(批量上传)
const uploadImg = (params) => postAction("/solitaire/uploadFiles/uploadImg", params, {});
// 用户信息
const userInfo = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "userInfo"
});
// 账户余额信息（assetInfo）
const assetInfo = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "assetInfo"
});
// 交易明细（dealRecord）
const dealRecord = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "dealRecord"
});
// 月度收支总额 （monthBudget）
const monthBudget = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "monthBudget"
});
// 我购买的订单  （myOrder）
const myOrder = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "myOrder"
});
// 我购买的订单详情  （orderDetail）
const orderDetail = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "orderDetail"
});
// 发布接龙/复制后保存 （insertPubSolitaire）
const insertPubSolitaire = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "insertPubSolitaire"
});

export default {
  getSessionKey,
  wxLogin,
  uploadImg,
  userInfo,
  assetInfo,
  dealRecord,
  monthBudget,
  myOrder,
  orderDetail,
  insertPubSolitaire
}