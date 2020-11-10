//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Click me',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    location: '',
    temp: '',
    text: '',
    icon: 100
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({

    })
  },

  onLoad: function () {
    this.getWeather();
    console.log(this.data);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

  onShow: function () {

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    app.getUserCode(e.detail.userInfo);
  },
  getWeather: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var lat = res.latitude
        var lon = res.longitude

        app.wxRequest('GET', '/user/weather?lon=' + lon + '&lat=' + lat, null, (res) => {
          if (res.status == 'success') {
            if (res.data != null) {
              that.setData({
                location: res.data.location,
                temp: res.data.temp,
                text: res.data.text,
                icon: res.data.icon
              });
            }
          }
        }, (err) => {
          app.wxShowToast('服务器已关闭', 'none', 2000);
        });
      }
    });
  },
  rule: function () {
    wx.navigateTo({
      url: '../rule/rule',
    });
  },
  // 点击按钮弹窗
  openButton: function () {
    this.setData({
      modalShowStyle: "opacity:1;pointer-events:auto;"
    })
  },
  // 隐藏模态框
  hideModal() {
    this.setData({
      modalShowStyle: ""
    });
  },
  closeButton: function () {
    this.hideModal();
  }
})