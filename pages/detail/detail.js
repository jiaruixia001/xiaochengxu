// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultBannerImage: '../../images/default_banner_img.png',
    bannerRows: [
      'images/jm_rong_img.png',
      'images/jm_yun_img.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    displayHidden:true,
    showModal:true,
  },

  ctrlDisplay:function(){
    this.setData({
      displayHidden: !this.data.displayHidden
    })
  },
  hideModal:function(){
    this.setData({
      showModal: !this.data.showModal
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})