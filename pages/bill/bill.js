// pages/bill/bill.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    list: [],
    billDate: ''
  },

  billPaging: function () {
    var param = {
      userCode: app.globalData.userCode,
      billDate: this.data.billDate,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.wxRequest('POST', '/income/billPaging', param, (res) => {
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
  onShow: function (options) {
    this.init('');
  },
  init: function (billDate) {
    this.setData({
      pageNum: 1,
      pageSize: 15,
      billDate: billDate,
      total: 0,
      list: []
    });
    this.billPaging();
  },

  loadPage: function () {
    var pageNum = this.data.pageNum;
    var pageSize = this.data.pageSize;
    if (pageNum * pageSize < this.data.total) {
      this.setData({
        pageNum: pageNum + 1
      });
      this.billPaging();
    }
  },

  refreshPage: function () {
    this.init('');
    this.setData({
      date: ''
    });
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
    this.init(e.detail.value);
  }
})