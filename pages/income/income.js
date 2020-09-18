var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCode: app.globalData.userCode,
    inputMoney: '',
    totalIncome: 0,
    restMoney: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.init();
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

  init: function () {
    var that = this;
    app.wxRequest('GET', '/income/toIncome?userCode=' + that.data.userCode, null, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          that.initPie(
            res.data.totalFine,
            res.data.totalUsedMoney,
            res.data.restMoney);
          that.setData({
            totalIncome: res.data.totalIncome,
            restMoney: res.data.restMoney,
            inputMoney: ''
          });
        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    });
  },
  initPie: function (totalFine, totalUsedMoney, restMoney) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '累计提现金额 ' + totalUsedMoney,
        data: totalUsedMoney,
        color: '#BA55D3'
      }, {
        name: '可用余额 ' + restMoney,
        data: restMoney,
        color: '#FFA500'
      }, {
        name: '累计罚款 ' + totalFine,
        data: totalFine,
        color: '#DC143C'
      }],
      width: windowWidth,
      height: 255,
      dataLabel: true,
    });
  },

  getInputMoney: function (e) {
    var inputMoney;
    if (parseFloat(e.detail.value).toString() == "NaN") {
      inputMoney = '';
    } else {
      if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) {
        inputMoney = e.detail.value;
      } else {
        inputMoney = e.detail.value.substring(0, e.detail.value.length - 1);
      }
    }

    this.setData({
      inputMoney: inputMoney,
    })
  },
  cash: function (e) {
    var that = this;
    var money = that.data.inputMoney;
    if (money.length == 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return;
    }
    if (money > that.data.restMoney) {
      wx.showToast({
        title: '可用余额不足',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要提现' + money + '元吗？',
      success: function (res) {
        if (res.confirm) {
          var param = {
            userCode: that.data.userCode,
            money: money
          };
          app.wxRequest('POST', '/income/cash', param, (res) => {

            if (res.status == 'success') {

              app.wxShowToast('提现成功', 'success', 2000);
              that.init();
            } else {
              app.wxShowToast('提现失败', 'none', 2000);
            }
          }, (err) => {
            app.wxShowToast('服务器已关闭', 'none', 2000);
          })
        }
      }
    });
  },
  bill: function () {
    wx.navigateTo({
      url: '../bill/bill',
    });
  },
})