// index.js
//获取应用实例
var app = getApp();
var API = require('../../utils/util.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function (e) {
    // 使用 wx.createContext 获取绘图上下文 context
    // var context = wx.createCanvasContext('firstCanvas')

    // context.setStrokeStyle("#00ff00")
    // context.arc(100, 100, 60, Math.PI*2, Math.PI/2, true)
    // context.stroke();
    // context.draw();
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    API.ajax('api',function(res){
      //这里既可以获取模拟的res
      console.log(res);
    });
  }
})