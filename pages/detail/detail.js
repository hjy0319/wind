// pages/detail/detail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskCode: null,
    taskDate: null,
    userCode: null,
    weight: null,
    compareWeight: null,
    dietMealFlag: null,
    sportsFlag: null,
    grade: 0,
    income: 0,
    fine: 0,
    taskStatus: null,
    dietMealDay: false,
    sportsDay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxRequest('GET', '/task/toDetail?taskCode=' + options.taskCode, null, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          this.setData({
            taskCode: res.data.taskCode,
            taskDate: res.data.taskDate,
            userCode: res.data.userCode,
            weight: res.data.weight,
            compareWeight: res.data.compareWeight,
            dietMealFlag: res.data.dietMealFlag,
            sportsFlag: res.data.sportsFlag,
            grade: res.data.grade,
            income: res.data.income,
            fine: res.data.fine,
            taskStatus: res.data.taskStatus,
            dietMealDay: res.data.dietMealDay,
            sportsDay: res.data.sportsDay
          });
        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    })
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