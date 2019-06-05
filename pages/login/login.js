// login.js
/**网络请求状态码 */
var GET_CHECKCODE = 1,//获取验证码
  DO_LOGIN = 2,
  OTHERS = 111;

var util = require('../../utils/util.js');
var loginUtil = require('../../utils/loginUtil.js');

var app = getApp();

Page({
  data: {
    weChatId: null,
    phoneNumber: '',
    checkcode: ''
  },
  onLoad: function (option) {
    this.setData({
      weChatId: option.weChatId
    })
  },
  onShow: function(){

  },
  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  inputPhoneChange: function(e){
    var value = e.detail.value;
    this.setData({
      phoneNumber: value
    })
  },
  inputCheckcodeChange: function(e){
    var value = e.detail.value;
    this.setData({
      checkcode: value
    })
  },
  onLogin: function(e) {
    if (!this.data.phoneNumber || this.data.phoneNumber.length == 0) {
      wx.showToast({
        title: '请输入手机号码',
      })
    }
    else if (!util.isMobile(this.data.phoneNumber)) {
      wx.showToast({
        title: '手机号码格式不正确',
      })
    }
    if (!this.data.checkcode || this.data.checkcode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
      })
    }

    var params = {
      mobileNo: this.data.phoneNumber,
      messageCode: this.data.checkcode,
      weChatId: this.data.weChatId,
    };

    wx.showNavigationBarLoading()
    app.webCall("/login/doLogin", params, DO_LOGIN, this.onSuccess, this.onErrorBefore, this.onComplete, false, "GET");
    return;
    wx.navigateTo({
      url: 'pages/perfectInfo/perfectInfo',
      // url: 'pages/register/register',
    })
  },
  onCheckCode: function(e){
    if (!this.data.phoneNumber || this.data.phoneNumber.length == 0){
      wx.showToast({
        title: '请输入手机号码',
      })
    }
    else if (!util.isMobile(this.data.phoneNumber)) {
      wx.showToast({
        title: '手机号码格式不正确',
      })
    } else {
      this.getBindWxCheckcode(this.data.phoneNumber)
    }
    
  },
  /**
   * 未绑定发送短信验证码
   * @param
   * resend: 是否过一段时间重发，一般不用
   */
  getBindWxCheckcode: function(phone, resend) {
    var params = {
      mobileNo: phone
    };
    if (resend) params.resend = resend;

    wx.showNavigationBarLoading()
    app.webCall("/login/sendMessageCode", params, GET_CHECKCODE, this.onSuccess, this.onErrorBefore, this.onComplete, false, "GET");
  },
  /**
   * 接口访问成功返回
   * @param {Object} data
   * @param {Object} requestCode
   */
  onSuccess: function(data, requestCode) {
    wx.hideNavigationBarLoading()

    switch(requestCode) {
      case GET_CHECKCODE:
        wx.showToast({
          title: "验证码发送成功",
        })
        break;
      case DO_LOGIN:
        switch (data.isRegister){
          case 0:
          // 未注册。进行注册和绑定
            wx.navigateTo({
              url: 'pages/register/register',
            })
            break;
          case 1:
          // 已注册且资料完善（自动登录）；
            break;
          case 2:
          // 已注册，未完善资料；
            wx.navigateTo({
              url: 'pages/perfectInfo/perfectInfo',
            })
            break;
          default:
            break;
        }
        wx.showToast({
          title: "登录成功",
        })
        break;
      default:
        break;
    }
  },
  /**
   * 接口访问失败返回
   * @param {Object} resultCode
   * @param {Object} resultMsgDesc
   */
  onErrorBefore: function (resultCode, resultMsgDesc) {
    wx.showToast({
      title: resultMsgDesc,
    })
  },
  /**
   * 接口访问完成
   * @param {Object} resultCode
   */
  onComplete: function (resultCode) {
    wx.hideNavigationBarLoading();
  }
})