// pages/rule/rule.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayRewardSignIn: '',
    dayRewardDietMeal: '',
    dayRewardSports: '',

    dayFineSignIn: '',
    dayFineDietMeal: '',
    dayFineSports: '',

    fixedDayDietMeal: '',
    fixedDaySports: '',

    weekRewardPersevere: '',
    weekRewardProgress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.wxRequest('GET', '/task/toRule', null, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          that.setData({
            dayRewardSignIn: res.data.dayRewardSignIn,
            dayRewardDietMeal: res.data.dayRewardDietMeal,
            dayRewardSports: res.data.dayRewardSports,

            dayFineSignIn: res.data.dayFineSignIn,
            dayFineDietMeal: res.data.dayFineDietMeal,
            dayFineSports: res.data.dayFineSports,

            fixedDayDietMeal: res.data.fixedDayDietMeal,
            fixedDaySports: res.data.fixedDaySports,

            weekRewardPersevere: res.data.weekRewardPersevere,
            weekRewardProgress: res.data.weekRewardProgress
          });

        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
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

  }
})