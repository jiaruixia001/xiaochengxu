// home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner
    defaultBannerImage: '../../images/default_banner_img.png',
    bannerRows: [
      'images/jm_rong_img.png',
      'images/jm_yun_img.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    //商品列表
    toView: "",//点击bar item，滚动到对应的 view
    goodTitleRows: ['服装纺织', '日用百货', '数码家电', '家纺家饰'],
    goodsViewHeight: 0,//窗口高度
    hiddenClasses: '',//隐藏动画
    showBanner: "",
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight;
        var calc = clientHeight * res.pixelRatio - 400 - 88;
        that.setData({
          goodsViewHeight: calc
        });
      }
    });
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

  },
  // banner 图片点击事件
  bannerImageClicked: function(){

  },
  // 商品的搜索事件
  onGoodsItemSearch: function(){
    wx.navigateTo({
      url: '../index/index',//'../login/login'
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  goodsBarItemClicked: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { 
      return false; 
    }

    // update bar item select
    this.setData({
      currentTab: cur
    });

    //goto content item relative
    this.setData({
      toView: "goodsItem" + cur,//this.data.goodTitleRows[cur]
    });
  },
  goodsViewDidScroll: function(e){
    return;
    // debugger
    console.log("goodsViewDidScroll:" +e.detail.scrollTop)
    // hidden title bar
    var hiddenAnimal = (e.detail.scrollTop > 20 ? 'box-hidden-animation' : '')
    this.setData({
      hiddenClasses: hiddenAnimal
    })
  },
  triggerAnimation: function () {
    
  },
  animationEnd: function () {
    this.setData({
      showBanner: "display: none;"
    })
    
    console.log('动画已结束')
  },
  updateBannerView: function(){

  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
})