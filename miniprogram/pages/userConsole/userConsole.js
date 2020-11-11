// pages/userConsole/userConsole.js
Page({

  data: {
    userid: ''
  },

  onLoad: function (options) {
    this.setData({
      userid: getApp().globalData.userid
    })
  }
})