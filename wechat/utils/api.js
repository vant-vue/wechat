import {
  postAction,
  postActionUrlencoded
} from "./manage.js"
// 授权登录
const getSessionKey = (params) => postActionUrlencoded("/wx/wxLogin/getSessionKey", params, {});
// 微信登录
const wxLogin = (params) => postActionUrlencoded("/wx/wxLogin/login", params, {});
// 首页（banner）
const banner = (params) => postActionUrlencoded("/solitaire/solitaire/getHomeBannerList", params, {});
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
// 我发布的/我参与的  （mySolitaire）
const mySolitaire = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "mySolitaire"
});
// 接龙列表  （solitaireList）
const solitaireList = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "solitaireList"
});
// 我的发布记录  （myPubList）
const myPubList = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "myPubList"
});
// 我的参与记录  （myJoinList）
const myJoinList = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "myJoinList"
});
// 订单管理列表  （orderManagerList）
const orderManagerList = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "orderManagerList"
});
// 数据统计  （statistics）
const statistics = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "statistics"
});
// 修改订单备注  （editRemark）
const editRemark = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "editRemark"
});
// 接龙浏览列表  （visitList）
const visitList = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "visitList"
});
// 商品详情  （goodsDetail）
const goodsDetail = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "goodsDetail"
});
// 修改订单状态  （editStatus）
const editStatus = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "editStatus"
});
// 微信退款（updateWxRefund）
const updateWxRefund = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "updateWxRefund"
});
// 微信支付  （wxPay）
const wxPay = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "wxPay"
});
// 查询接龙-用于复制接龙或者编辑接龙  （selectSolitaire）
const selectSolitaire = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "selectSolitaire"
});
// 修改接龙 （editSolitaire）
const editSolitaire = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "editSolitaire"
});
// 修改接龙状态-暂停/恢复 （updateSolitaireStatus）
const updateSolitaireStatus = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "updateSolitaireStatus"
});
// 删除接龙 （deleteSolitaire）
const deleteSolitaire = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "deleteSolitaire"
});
// 申请取消接龙/撤回取消申请 （applyRemove）
const applyRemove = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "applyRemove"
});
// 生成excel表格（createExcel）
const createExcel = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "createExcel"
});
// 提现到微信（wxOutMoney）
const wxOutMoney = (params) => postAction("/solitaire/solitaire/api", params, {
  method: "wxOutMoney"
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
  insertPubSolitaire,
  mySolitaire,
  solitaireList,
  myPubList,
  myJoinList,
  orderManagerList,
  statistics,
  editRemark,
  visitList,
  goodsDetail,
  editStatus,
  updateWxRefund,
  wxPay,
  selectSolitaire,
  editSolitaire,
  updateSolitaireStatus,
  deleteSolitaire,
  applyRemove,
  createExcel,
  wxOutMoney,
  banner
}