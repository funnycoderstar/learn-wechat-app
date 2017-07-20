const util = require('./utils/util.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 微信授权
    wx.getSetting({
      success(res) {
        if (!!res['scope.userInfo'] || !res['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: ['scope.userInfo', 'scope.writePhotosAlbum'],
            success() {
              wx.getUserInfo();
              wx.saveImageToPhotosAlbum();
              util.checkSession()
                .then((wechatSessionValid) => {
                  return util.request('/auth/login', {}, 'get')
                    .then(function (res) {
                      const serverSessionValid = !response.data.data;
                      return wechatSessionValid && serverSessionValid;
                    });
                })
                .then(function (sessionValid) {
                  if (sessionValid) {
                    // session没有过期，直接获取userInfo
                    return util.getUserInfo();
                  }
                  return util.login() // 执行微信登录
                    .then(that.getLogin) // 执行剩下的登录过程
                })
                // 处理登录之后的一些事情
                .then(function (userInfo) {
                  that.globalData.hasLogin = true;
                  const cbs = that.globalData.loginCbs;
                  // 调用所有的回调
                  for (let i = 0; i < cbs.length; i++) {
                    cbs[i]();
                  }
                  return userInfo;
                })
            },
            fail() {
              // console.log('拒绝授权');  
              wx.navigateTo({
                url: '/pages/authorization/authorization'
              });
            },
          })
        }
      }
    })
  },
  // 执行回调
  onLogin(cb) {
    if (this.globalData.hasLogin) {
      cd();
    } else {
      this.globalData.loginCbs.push(cb);
    }
  },
  getLogin: function (loginRes) {
    //调用登录接口
    var that = this;
    return new Promise(function (resolve, reject) {
      if (loginRes.code) {
        that.globalData.code = loginRes.code;
        console.log(that.globalData.code);
      } else {
        console.log('获取用户登录态失败！' + loginRes.errMsg)
      }
      // 需要通过调用userInfo获取信息用于登录
      // TODO: 这里调用了userInfo，可能需要对得到的数据进行缓存
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          const params = {
            code: that.globalData.code,
            raw_data: res.rawData,
            encrypted_data: res.encryptedData,
            iv: res.iv,
            signature: res.signature,
          };
          return util.request('/auth/login', params, 'POST')
            .then(function (response) {
              console.log(response.data, '登录info');
              that.globalData.userInfo = res.userInfo; // 保存了
              return resolve(res.userInfo);
            });
        }
      })
    });
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    hasLogin: null, // 是否已经完成登录
    // TODO: 可能需要考虑重复调用的问题
    loginCbs: [], // 所有登录成功后的回调

  }
})