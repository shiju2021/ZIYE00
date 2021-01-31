

//独立COOKIE文件     ck在``里面填写，多账号换行
let iboxpayheaderVal= ` `
let refreshtokenVal= ` `
//let iboxpayheaderVal= `{\"Connection\":\"keep-alive\",\"Accept-Encoding\":\"gzip, deflate, br\",\"version\":\"1.4.4\",\"mchtNo\":\"100529600058887\",\"Content-Type\":\"application/json; charset=utf-8\",\"source\":\"VEISHOP_APP_IOS\",\"shopkeeperId\":\"1148855820752977920\",\"User-Agent\":\"VeiShop, 1.4.4 (iOS, 14.3, zh_CN, Apple, iPhone, 9733C274-C7F3-4D4B-A2F9-FEC8EB046327)\",\"token\":\"0c8fec1956c04a599aeb48e73d6a9d25\",\"X-User-Agent\":\"VeiShop, 1.4.4 (iOS, 14.3, zh_CN, Apple, iPhone, 9733C274-C7F3-4D4B-A2F9-FEC8EB046327)\",\"traceid\":\"3135081239008922009616120965297172bfa26fca4b8\",\"Host\":\"veishop.iboxpay.com\",\"Accept-Language\":\"zh-Hans-CN;q=1, en-CN;q=0.9\",\"Accept\":\"*/*\"}`
//let refreshtokenVal= `1ed7a76a3f9e4f4787956b09195bf957`

let iboxpaycookie = {
  iboxpayheaderVal: iboxpayheaderVal,  
  refreshtokenVal: refreshtokenVal,  
  
}

module.exports =  iboxpaycookie
  


