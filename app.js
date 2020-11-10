//app.js
App({
  globalData: {
    userInfo: null,
    encryptedData: null,
    iv: null,
    code: null,
    userCode: null,
    // URL: 'https://localhost:8081'
    URL: 'https://www.5qel4c.cn:8081'
  },
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.getUserCode(res.userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })

        }
      }
    });

  },

  /**
   * 封装wx.request请求
   * method： 请求方式
   * url: 请求地址
   * data： 要传递的参数
   * callback： 请求成功回调函数
   * errFun： 请求失败回调函数
   **/
  wxRequest(method, url, data, callback, errFun) {

    this.wxShowToast('请求中', 'loading', 200000);
    wx.request({
      url: this.globalData.URL + url,
      method: method,
      data: data,
      header: {
        // 'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        wx.hideToast();
        callback(res.data);
      },
      fail: function (err) {
        wx.hideToast();
        errFun(err);
      }
    })
  },
  wxShowToast(title, icon, duration) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    });
  },
  getUserCode(user) {
    this.wxRequest('POST', '/user/userCode', user, (res) => {
      if (res.status == 'success') {
        if (res.data != null) {
          this.globalData.userCode = res.data;
        }
      }
    }, (err) => {
      app.wxShowToast('服务器已关闭', 'none', 2000);
    })
  },
  checkLogin(user) {
    if (user) {
      return true;
    } else {
      this.wxShowToast('请先授权登录', 'none', 2000);
      return false;
    }
  }
})