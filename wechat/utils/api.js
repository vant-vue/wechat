import {
  postAction
} from "./manage.js"

const testApi = (params) => postAction("/wx/wxLogin/getSessionKey", params, {method:'test'});
export default {
  testApi
}

