// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    userid: '',
    count: null,
    queryResult: '',
  },

  onLoad: function (options) {
    if (app.globalData.userid) {
      this.setData({
        userid: app.globalData.userid
      })
    }
  },

  onAdd: function () {
    const db = swan.cloud.database()
    db.collection('counters').add({
      data: {
        count: 1
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        swan.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        swan.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onQuery: function() {
    const db = swan.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _userid: this.data.userid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        swan.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onCounterInc: function() {
    const db = swan.cloud.database()
    const newCount = this.data.count + 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onCounterDec: function() {
    const db = swan.cloud.database()
    const newCount = this.data.count - 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onRemove: function() {
    if (this.data.counterId) {
      const db = swan.cloud.database()
      db.collection('counters').doc(this.data.counterId).remove({
        success: res => {
          swan.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          swan.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      swan.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 userid，如无需获取
    if (this.data.step === 1 && !this.data.userid) {
      swan.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.userid = res.result.userid
          this.setData({
            step: 2,
            userid: res.result.userid
          })
        },
        fail: err => {
          swan.showToast({
            icon: 'none',
            title: '获取 userid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 userid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/swancloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      swan.navigateBack()
    } else if (pages.length === 1) {
      swan.redirectTo({
        url: '../index/index',
      })
    } else {
      swan.reLaunch({
        url: '../index/index',
      })
    }
  }

})