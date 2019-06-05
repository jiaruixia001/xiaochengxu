
//app.js
var util = require('utils/util.js')
var md5 = require('utils/md5.js')
/**网络请求状态码 */
var DO_LOGIN = 1;
/**服务器地址 */
//var serverHost = "https://webapi.sanbaozhihui.com"; //线上环境
// var serverHost = "https://wxdev01.jumore.com/preonline-zhxf"; //预发环境
// var serverHost = "https://wxdev01.jumore.com/zhxf"; //测试环境
var serverHost = "http://api.jumore.test/api"; //测试环境
// var serverHost = "http://192.168.23.117:8080"; // 门艳辉 开发环境接口服务器地址

App({
  uploadHost: "http://file1.uploadapi.jumore.com", //正式环境图片上传
  imgShowHost: "http://img.jumore.com", //正式环境图片查看
  uploadDomain: "jumore.com",

  /*uploadHost: "http://image5.jm.com/", //开发/测试环境图片上传
  imgShowHost: "http://image.jm.com/", //开发/测试环境图片查看
  uploadDomain: "jmdev.com", */

  imageHost: serverHost + "/static/images/", // 图片资源路径 
  audioHost: serverHost + "/static/audio/", // 音频资源路径
  apiHost: serverHost + "/weChat", // 接口服务器地址

  isLogin: false, // 用户登录状态
  appUser: null, // APP用户实体
  appSecretKey: null, //登录返回的加密key
  requestCount: {},
  verifyCount: {},

  /**
   * 对用户输入的数量、金额长度进行限制
   */
  moneyLength: 9,//金额最大长度：9(1000000)
  amountLength: 5,//数量最大长度：5(100000)

  onLaunch: function () {
    console.log("app onLaunch");
    // 展示本地存储能力
    wx.getStorage({
      key: 'logs',
      success: function(res) {
        var logs = res.data || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
      },
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
   * 接口公共访问方法
   * @param {Object} urlPath 访问路径
   * @param {Object} params 访问参数（json格式）
   * @param {Object} requestCode 访问码，返回处理使用
   * @param {Object} onSuccess 成功回调
   * @param {Object} onErrorBefore 失败回调
   * @param {Object} onComplete 请求完成（不管成功或失败）回调
   * @param {Object} requestType 请求类型（默认POST）
   * @param {Object} retry 访问失败重新请求次数（默认1次）
   */
  webCall: function (urlPath, params, requestCode, onSuccess, onErrorBefore, onComplete, isVerify, requestType, retry) {
    var params = arguments[1] ? arguments[1] : {};
    //var requestCode = arguments[2] ? arguments[2] : 1;
    var onSuccess = arguments[3] ? arguments[3] : function () { };
    var onErrorBefore = arguments[4] ? arguments[4] : this.onError;
    var onComplete = arguments[5] ? arguments[5] : this.onComplete;
    var isVerify = arguments[6] ? arguments[6] : false;
    var requestType = arguments[7] ? arguments[7] : "POST";
    var retry = arguments[8] ? arguments[8] : 1;
    var that = this;

    //防止重复提交，相同请求间隔时间不能小于500毫秒
    var nowTime = new Date().getTime();
    if (this.requestCount[urlPath] && (nowTime - this.requestCount[urlPath]) < 500) {
      return;
    }
    this.requestCount[urlPath] = nowTime;
    //是否验证重复提交
    if (isVerify) {
      if (this.verifyCount[urlPath]) {
        return;
      }
      this.verifyCount[urlPath] = true; //重复验证开关开启
    }

    //构造加密数据
    if (this.appUser && this.appSecretKey) {
      var timestamp = new Date().getTime();
      params.nowUserId = this.appUser.id;
      params.timestamp = timestamp;
      params.encryptData = md5.hex_md5(timestamp + this.appSecretKey);
    }

    console.log("发起网络请求, 路径:" + (that.apiHost + urlPath) + ", 参数:" + JSON.stringify(params));
    wx.request({
      url: that.apiHost + urlPath,
      data: params,
      method: requestType, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': requestType == 'POST' ?
          'application/x-www-form-urlencoded' : 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        /**
         * 服务器端接口返回的格式有问题：
  "data": {
		"code": 0,
		"data": {
			"isBind": "0",
			"weChatId": "ocuRG42iBVr0AsNuePfL5P2eTJvg"
		},
		"desc": "微信用户未绑定",
		"total": null
	},
	"statusCode": 200,
	"header":{
  },
	"errMsg": "request:ok"
         */
        console.log("返回结果：" + JSON.stringify(res.data));
        if (res.data) {
          //如果是获取验证码  {"code":0,"data":null,"desc":"发送成功。","total":null}
          if (urlPath.indexOf("login/sendMessageCode") != -1){
            if (res.data.code == 0) { //访问成功
              onSuccess(res.data, requestCode);
            } else {
              onErrorBefore(0, res.data.desc == null ? "请求失败 , 请重试" : res.data.desc, requestCode);
            }
            return;
          }

          if (res.data.code == 0) { //访问成功
            onSuccess(res.data.data, requestCode);
          } else if (res.data.code == -8) { // 未登录
            that.isLogin = false;
            onErrorBefore(0, res.data.desc, requestCode);
          } else {
            onErrorBefore(0, res.data.desc == null ? "请求失败 , 请重试" : res.data.desc, requestCode);
          }
        } else {
          onErrorBefore(0, "请求失败 , 请重试", requestCode);
        }
      },
      fail: function (res) {
        retry--;
        console.log("网络访问失败：" + JSON.stringify(res));
        if (retry > 0) return that.webCall(urlPath, params, requestCode, onSuccess, onErrorBefore, onComplete, requestType, retry);
      },
      complete: function (res) {
        onComplete(requestCode);
        //请求完成后，2秒后重复验证的开关关闭
        if (isVerify) {
          setTimeout(function () {
            that.verifyCount[urlPath] = false;
          }, 2000);
        }
      }
    })
  },
  /**
   * 接口访问成功返回
   * @param {Object} data
   * @param {Object} requestCode
   */
  onSuccess: function (data, requestCode) {
    if (requestCode == DO_LOGIN) {
      this.isLogin = true;
      this.appUser = data.data;
    }
  },
  onError: function (resultCode, resultMsgDesc, requestCode) {
    switch (resultCode) {
      case 'FAILED_NETWORK':
        wx.showToast({
          title: '网络状态不佳，请查检您的网络'
        });
        break;
      case 'BAD_REQUEST':
        wx.showToast({
          title: '请求访问失败，请重试'
        });
        break;
      case 0:
        wx.showToast({
          title: resultMsgDesc
        });
        break;
      default:
        console.log(resultCode);
        break;
    }
  },
  onComplete: function (requsetCode) {
    console.log("请求完成，requsetCode：" + requsetCode);
  },
  /**
   * 分享功能
   */
  onShare: function () {
    return { title: '增慧学佛，一起共修！', path: '/pages/start/start' };
  },
  /**
   * 数字转换
   */
  formatNumber: function (num, isMore) {
    if (!isMore && (num == null || num <= 0)) {
      return '0';
    }
    if (num >= 100000000) { // 亿
      return parseInt(num / 100000000) + "亿" + this.formatNumber(num % 100000000, true);
    } else if (num >= 10000) {// 万
      return parseInt(num / 10000) + "万" + this.formatNumber(num % 10000, true);
    } else {
      return num <= 0 ? '' : num;
    }
  },
  /**
   * 数字转换
   */
  formatFloat: function (num, isMore) {
    if (!isMore && (num == null || num <= 0)) {
      return '0';
    }
    if (num >= 100000000) { // 亿
      return parseInt(num / 100000000) + "亿" + this.formatFloat(num % 100000000, true);
    } else if (num >= 10000) {// 万
      return parseInt(num / 10000) + "万" + this.formatFloat(num % 10000, true);
    } else {
      return num <= 0 ? '' : num.toFixed(2);
    }
  }
})