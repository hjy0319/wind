const app = getApp();

Page({
  data: {
    weight: '',
    dietMealFlag: 0,
    sportsFlag: 0,
    dietMealDay: false,
    sportsDay: false,
    userCode: app.globalData.userCode
  },
  onLoad: function () {
    app.wxRequest('GET', '/task/toEdit?userCode=' + this.data.userCode, null, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          this.setData({
            weight: res.data.weight,
            dietMealFlag: res.data.dietMealFlag,
            sportsFlag: res.data.sportsFlag,
            dietMealDay: res.data.dietMealDay,
            sportsDay: res.data.sportsDay
          });
        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    })
  },
  getWeightValue: function (e) {
    var weight;
    if (parseFloat(e.detail.value).toString() == "NaN") {
      weight = '';
    } else {
      if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) {
        weight = e.detail.value;
      } else {
        weight = e.detail.value.substring(0, e.detail.value.length - 1);
      }
    }

    this.setData({
      weight: weight,
    })
  },
  dietMealChange: function (e) {
    if (e.detail.value) {
      this.setData({
        dietMealFlag: 1
      });
    } else {
      this.setData({
        dietMealFlag: 0
      });
    }
  },
  sportsChange: function (e) {
    if (e.detail.value) {
      this.setData({
        sportsFlag: 1
      });
    } else {
      this.setData({
        sportsFlag: 0
      });
    }
  },
  save: function () {
    if (this.data.weight.length == 0) {
      wx.showToast({
        title: '请输入今日体重',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return;
    }


    app.wxRequest('POST', '/task/save', this.data, (res) => {

      if (res.status == 'success') {
        wx.switchTab({
          url: '../task/task'
        });
        
        var pages = getCurrentPages();
        // var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.onLoad(); //刷新方法
        app.wxShowToast('保存成功', 'success', 2000);
      } else {
        app.wxShowToast('保存失败', 'none', 2000);
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    })
  }
});