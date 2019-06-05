//index.js
var loginUtil = require('../../utils/loginUtil.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onAuthorNoBind: function(e){
    loginUtil.getWxAuthorizeInfo(function (code, data) {
      if(code == 0){//success
        switch (data.isBind){
          case "0":
          //0，没有绑定；	weChatId：微信ID；
            wx.showModal({
              title: '提示',
              content: '此功能需要登录',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../login/login?weChatId=' + data.weChatId,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            
            break;
          case "1":
          //1，已绑定（自动登录）；
            break;
          case "2":
          //2，已绑定，未完善资料；weChatId：微信ID；
            break;
          default:
            break;
        }
      }
    });
  },
  onAuthorBind: function (e) {
    wx.navigateTo({
      url: '../login/login?weChatId=' + '11',
    })
  },
})
