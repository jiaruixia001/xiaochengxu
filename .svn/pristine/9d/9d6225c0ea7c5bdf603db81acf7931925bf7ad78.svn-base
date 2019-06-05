const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 去掉时间字符串中的 时分秒
 * 2017-06-01 00:00:00 显示 2017-06-01
 */
function trimHourOfTimeString(date) {
  if (date && date.length > 10) {
    return date.substr(0, 10);
  } else {
    return date;
  }
}

/**
 * 将参数转换为表单格式
 */
function json2Form(params) {
  var str = [];
  for (var p in params) {
    str.push(p + "=" + params[p]);
  }
  return str.join("&");
}

/**
   * 1万2000部，10万2000部
   */
function formatNum(num) {
  if (!num) return 0;

  if (num >= 100000000) { // 亿
    return parseInt(num / 100000000) + "亿";
    // return parseInt(num / 100000000) + "亿" + formatNum(num % 100000000);
  } else if (num >= 10000) {// 万
    return parseInt(num / 10000) + "万";
    // return parseInt(num / 10000) + "万" + formatNum(num % 10000);
  } else {
    return num;
  }
}

/**手机号验证*/
function isMobile(mobile) {
  var regExp = new RegExp("^((14[0-9])|(17[0-9])|(13[0-9])|(15[0-9])|(18[0-9]))\\d{8}$");
  return regExp.test(mobile);
}

/**
 * 删除字符串左右空格
 */
//去左空格;
function ltrim(s) {
  return s.replace(/(^\s*)/g, "");
}
//去右空格;
function rtrim(s) {
  return s.replace(/(\s*$)/g, "");
}
//去左右空格;
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

//去左右0;
function rtrimZero(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "0");
}

module.exports = {
  formatTime: formatTime,
  trimHourOfTimeString: trimHourOfTimeString,
  json2Form: json2Form,
  formatNum: formatNum,
  stringTrimLeft: ltrim,
  stringTrimRight: rtrim,
  stringTrim: trim,
  stringTrimZero: rtrimZero,
  isMobile: isMobile
}
