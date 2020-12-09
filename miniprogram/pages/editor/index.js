// pages/editor/editor.js
const util = require('../../utils/util.js')
const canvasContext = swan.createCanvasContext('mycanvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisNoteData: null,
    isSave: false,
    isOldNote: false,
    noteIndex: 0,
    showDialog: false,
    maskHidden: false,
    bgImgList: [
    {'img': '/images/back1.jpg'},
    {'img':'/images/back7.jpg'},
    {'img':'/images/back8.jpg'},
    {'img':'/images/back9.jpg'},
    {'img':'/images/back5.jpg'},
    {'img':'/images/back6.jpg'},
    {'img': '/images/back2.jpg'},
    {'img':'/images/back3.jpg'},
    {'img':'/images/back4.jpg'}
    ],
    bgImg: '/images/back1.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.page) {
      let data = this.getThisNote(options.page)
      this.setData({
        noteIndex: options.page,
        isSave: true,
        isOldNote: true,
        thisNoteData: data
      })
    }
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
    if (swan.getStorageSync('backgroundImg')) {
      this.setData({
        bgImg: swan.getStorageSync('backgroundImg')
      })
    }
  },
  formSubmit(e){
    let formData = e.detail.value
    if (formData.title === '') {
      swan.showToast({
        title: '请填写标题',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (formData.textarea === '') {
      swan.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.isOldNote) {
      this.delateThisNote(this.data.noteIndex)
    }
    formData.date = util.formatTime(new Date())
    let noteData = swan.getStorageSync('noteData') || []
    noteData.unshift(formData)
    swan.setStorageSync('noteData', noteData)
    this.setData({
      isSave: true
    })
    swan.showToast({
      title: '已保存',
      icon: 'success',
      duration: 2000
    })
  },
  getThisNote(index){
    let data = swan.getStorageSync('noteData')
    return data[index]
  },
  delateThisNote(index) {
    let data = swan.getStorageSync('noteData')
    data.splice(index, 1)
    swan.setStorageSync('noteData', data)
  },
  edit(){
    this.setData({
      isSave: false
    })
    swan.showToast({
      title: '开始编辑吧',
      duration: 2000
    })
  },
  delete() {
    let _this = this
    swan.showModal({
      title: '确定要删除么？',
      success: function (res) {
        if (res.confirm) {
          // 从数据库中删除此组数据
          _this.delateThisNote(_this.data.noteIndex)
          //console.log(123)
          swan.switchTab({
            url: '../index/index'
          })
          //console.log(136)
        } else if (res.cancel) {
          swan.showToast({
            title: '已取消',
            duration: 2000
          })
        }
      }
    })
  },
  closeDialog(){
    this.setData({
      showDialog: false
    })
  },
  gpback(){
    if (this.data.isSave) {
      swan.navigateBack()
    } else {
      swan.showModal({
        title: '正在返回首页',
        content: '数据还未保存',
        confirmText: '确认返回',
        success: function (res) {
          if (res.confirm) {
            swan.navigateBack()
          } else if (res.cancel) {
            swan.showToast({
              title: '已取消',
              duration: 2000
            })
          }
        }
      })
    }
  },
  choseBg(e){
    let newBgImg = this.data.bgImgList[parseInt(e.currentTarget.dataset.index)].img
    swan.setStorageSync('backgroundImg', newBgImg)
    this.setData({
      bgImg: swan.getStorageSync('backgroundImg')
    })
    this.closeDialog()
  },
  onShareAppMessage: function () {
    return {
      title: '字节笔记',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },

openShare() {
    swan.openShare({
        title: '智能小程序示例',
        content: '世界很复杂，百度更懂你',
        path: 'swan-api/open-share/open-share?key=value',
        imageUrl: 'https://smartprogram.baidu.com/docs/img/logo_new.png',
        success: res => {
            swan.showToast({
                title: '分享成功',
                icon: 'none'
            });
            console.log('openShare success', res);
        },
        fail: err => {
            console.log('openShare fail', err);
        }
    });
},
setting(){
    this.setData({
      showDialog: true
    })
  },
})