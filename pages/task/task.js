//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    userCode: app.globalData.userCode,
    pageNum: 1,
    pageSize: 4,
    total: 0,
    list: [],
    taskDate: ''
  },

  taskPaging: function () {
    var param = {
      userCode: this.data.userCode,
      taskDate: this.data.taskDate,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.wxRequest('POST', '/task/taskPaging', param, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          var newList = this.data.list.concat(res.data.records);
          this.setData({
            list: newList,
            total: res.data.total
          });
          if (this.data.list == null || this.data.list.length == 0) {
            app.wxShowToast('没有记录', 'none', 2000);
          }
        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init('');
  },
  init: function (taskDate) {
    this.setData({
      pageNum: 1,
      pageSize: 4,
      taskDate: taskDate,
      total: 0,
      list: []
    });
    this.taskPaging();
  },

  loadPage: function () {
    var pageNum = this.data.pageNum;
    var pageSize = this.data.pageSize;
    if (pageNum * pageSize < this.data.total) {
      this.setData({
        pageNum: pageNum + 1
      });
      this.taskPaging();
    }
  },

  refreshPage: function () {
    this.init('');
    this.setData({
      date: ''
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  edit: function (e) {
    wx.navigateTo({
      url: '../edit/edit',
    });
  },
  detail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?taskCode=' + e.currentTarget.dataset.id,
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      date: e.detail.value
    });
    this.init(e.detail.value);
  }
})