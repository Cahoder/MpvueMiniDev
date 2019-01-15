function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export function checkPhone(phone){
  var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;//手机号码
    var isMob= /^0?1[3|4|5|8][0-9]\d{8}$/;// 座机格式
    if(isMob.test(phone)||isPhone.test(phone)){
        return true;
    }
    else{
        return false;
    }
}
export function sortPayTime(property){
  return function(a,b){
    var value1 = a[property];
    var value2 = b[property];
    return value2-value1;
  }
}
export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function arrayComprise(orderType,allOrderList,field,sort){
  //两个数组数据对比
    const OT = orderType;
    const AO = allOrderList;
    if(Array.isArray(OT)&&Array.isArray(AO)){
      for (let i = 0; i < AO.length; i++) {
        const e = AO[i];
        for (let j = 0; j < OT.length; j++) {
          const u = OT[j];
          if(e.order_state == u.key){
            u[field].push(e); //加入这个数组
            u[field].sort(sortPayTime(sort)); //排序这个数组
          }
        }
      }
      return OT
    }
}

export default {
  formatNumber,
  formatTime,
  arrayComprise,
  sortPayTime,
  checkPhone
}
