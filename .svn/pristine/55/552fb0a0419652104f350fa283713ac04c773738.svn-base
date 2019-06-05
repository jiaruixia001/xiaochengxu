// 登录相关的逻辑

/**网络请求状态码 */
var DO_AUTH_LOGIN = 1,//授权登录
    DO_USER_LOGIN = 2,//用户登录
    OTHERS = 111;
//获取应用实例
var app = getApp();

/**
 * 获取微信授权信息
 * 1. 判断之前是否有授权 'isAuth'
 * 2. 未授权，调用登录接口
 * 3. 请求用户信息授权
 * 4. 获取用户信息
 * 5. 发起登录网络请求
 * @return
 * callback(code, info)
 * code: 0 成功；1 wx.login fail; 2 wx.login 获取code失败; 3 wx.getSetting fail; 4 用户拒绝授权 11 authLogin失败, 12 用户拒绝授权
 */
function getWxAuthorizeInfo(callback){
  getWxCodeAndGetAuthorize(
    function (code, data) {
      if (code == 0) {//success
        // code: 0成功, 11 authLogin失败, 12 用户拒绝授权
        getUserInfoAndLogin(data, callback);
      } else {// failed
        //errorType: 1 wx.login fail; 2 wx.login 获取code失败; 3 wx.getSetting fail; 4 用户拒绝授权
        callback(code, data)
      }

    }
  )
}

function showTipInfo(info){
  wx.showToast({
    title: (info ? info : '授权失败'),
  })
}

/**
 * 获取微信 code 并进行 获取用户信息授权
 * @return
 * callback(code, data)
 * code: 0 成功；1 wx.login fail; 2 wx.login 获取code失败; 3 wx.getSetting fail; 4 用户拒绝授权
 */
function getWxCodeAndGetAuthorize(callback) {
  wx.login({//
    success: function (res) {
      var code = res.code;
      if (!code) {
        console.log('获取用户登录状态失败！' + res.errMsg)
        callback(2)//wx.login 获取code失败
        return;
      }

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {//没有授权authSetting中就没有 scope.userInfo 字段
            // 请求“获取用户信息”的授权
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                callback(0, code)
              }, fail: function (res) {//
                //用户拒绝授权
                callback(4, res)
              }
            })
          } else {
            // 用户已经同意授权
            callback(0, code)
          }
        }, fail: function (res) {//wx.getSetting fail
          showTipInfo('授权失败')
          callback(3, res)
        }
      })

    }, fail: function (res) {//wx.login fail
      // console.log('获取用户登录态失败！' + res.errMsg)
      showTipInfo(res.errMsg)
      callback(1, res)
    }
  })
}
/**
 * 获取用户信息并登录
 * 1. 获取用户信息
 * 2. 发起网络请求
 * @return 
 * callback(code, data)
 * code: 0成功, 11 authLogin失败, 12 用户拒绝授权
 */
function getUserInfoAndLogin(code, callback){
  wx.getUserInfo({//1 获取用户信息
    withCredentials: true,
    success: function (userRes) {
      app.globalData.userInfo = userRes.userInfo
      console.log(userRes);
      //2 发起网络请求
      var params = {
        code: code,
        rawData: userRes.rawData,
        signature: userRes.signature,
        encryptedData: userRes.encryptedData,
        iv: userRes.iv
      };
      app.webCall("/login/authLogin", params, DO_AUTH_LOGIN, 
        function success(data, requestCode){
          //authLogin 成功
          callback(0, data)
        }, 
        function error(resultCode, resultMsgDesc){
          //authLogin 失败
          callback(11, resultMsgDesc)
        },
        function finished(resultCode){
        });
    }, fail: function (res) {//
      console.log(res.errMsg)
      if (res.errMsg == 'getUserInfo:fail auth deny') {
      }
      //用户拒绝授权
      callback(12, res)
    }
  })
}


/**
 * 用户登录
 */
function doUserLogin(phone, checkcode, wechartId){
  var params = {
    mobileNo: code,
    messageCode: userRes.rawData,
    weChatId: userRes.signature
  };
  app.webCall("/login/authLogin", params, DO_USER_LOGIN, onSuccess, onErrorBefore, onComplete);
}

/**
   * 接口访问成功返回
   * @param {Object} data
   * @param {Object} requestCode
   */
function onSuccess(data, requestCode) {
  console.log("home onSuccess");
  switch (requestCode) {
    case DO_AUTH_LOGIN:
      wx.setStorageSync("userIsBind", data.isBind);

      // wx.setStorageSync("isAuth", "true");
      // app.isLogin = true;
      // app.appUser = data.data;
      // app.appSecretKey = data.data.secretKey;
      break;
    case DO_USER_LOGIN:
      break;
  }
}
/**
 * 接口访问失败返回
 * @param {Object} resultCode
 * @param {Object} resultMsgDesc
 */
function onErrorBefore(resultCode, resultMsgDesc) {
  wx.showToast({
    title: resultMsgDesc,
  })
}
/**
 * 接口访问完成
 * @param {Object} resultCode
 */
function onComplete(resultCode) {
  wx.hideNavigationBarLoading();
}

module.exports = {
  getWxAuthorizeInfo: getWxAuthorizeInfo
}