var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needReload: true,
    startDate: '',
    endDate: ''
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
        // background: '#7cb5ec',
        format: function (item, category) {
            return category + ': ' + item.data + ' kg'
        }
    });
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.checkLogin(app.globalData.userInfo)) {
        this.init('','');
        this.setData({
            needReload: false
        });
    } else {
        this.setData({
            needReload: true
        });
    }
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    if (app.checkLogin(app.globalData.userInfo) && this.data.needReload) {
        this.init('','');
        this.setData({
            needReload: false
        });
    }
},
init: function (startDate, endDate) {
  var that = this;
  app.wxRequest('GET', '/statistics/trend?userCode=' + app.globalData.userCode + '&startDate=' + startDate + '&endDate=' + endDate, null, (res) => {
      if (res.status == 'success') {
          if (res.data != null && res.data.title != null) {
              that.initLines(res.data.title,res.data.x,res.data.y);
          } else {
            app.wxShowToast('无记录', 'none', 2000);
          }
      }
  }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
  });
},
initLines: function (title, x, y) {
  var windowWidth = 320;
  try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
  } catch (e) {
      console.error('getSystemInfoSync failed!');
  }
  lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      // categories: ['一(5&28)', '二(6&29)', '三(7&30)', '四(8&1)', '五(9&2)', '六(10&3)', '日(11&4)'],
      categories: x,
      animation: true,
      // background: '#f5f5f5',
      series: [{
          name: title ,
          data: y,

      }],
      xAxis: {
          disableGrid: true
      },
      yAxis: {

          disabled: false,
          min: 55
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: false,
      extra: {
          lineStyle: 'curve'
      }
  });
},

  bindStartDateChange: function (e) {
    this.setData({
        startDate: e.detail.value
    });
    this.init(this.data.startDate, this.data.endDate);
  },
  bindEndDateChange: function (e) {
    this.setData({
        endDate: e.detail.value
    });
    this.init(this.data.startDate, this.data.endDate);
  }
})