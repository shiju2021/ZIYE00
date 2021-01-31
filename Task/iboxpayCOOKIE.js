

//独立COOKIE文件     ck在``里面填写，多账号换行
let iboxpayheaderVal= process.env.XP_IBOXPAYHEADER
let refreshtokenVal= process.env.XP_REFRESHTOKEN



//let iboxpayheaderVal= ``
//let refreshtokenVal= ``

let iboxpaycookie = {
  iboxpayheaderVal: iboxpayheaderVal,  
  refreshtokenVal: refreshtokenVal,  
  
}

module.exports =  iboxpaycookie
  


