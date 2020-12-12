// pages/editor/editor.js
const app = getApp();
const util = require('../../utils/util.js');
const canvasContext = swan.createCanvasContext('mycanvas');
const db = swan.cloud.database();
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
    {'img':'cloud://rapstar-v9111nnk/back3.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back4.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back5.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back6.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back7.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back8.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back9.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back10.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back11.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back12.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back13.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back14.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back15.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back16.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back17.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back18.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back19.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back20.jpg'},
    {'img':'cloud://rapstar-v9111nnk/back21.jpg'},
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
    console.log("数据库有吗"+swan.getStorageSync('ishave'))
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
    if (this.data.isOldNote) {//如果是从首页点进来的，先删除原来的
      this.delateThisNote(this.data.noteIndex)
    }
    formData.date = util.formatTime(new Date())
    let noteData = swan.getStorageSync('noteData') || []
    noteData.unshift(formData)
    swan.setStorageSync('noteData', noteData)
    if(!swan.getStorageSync('ishave')){//之前没有记录，创建
        db.collection('note').add({
            data: {
              noteData:noteData
            },
            success: res => {
              console.log('note成功，记录 _id: ', res._id)
              swan.setStorageSync('resid',res._id)//现在有记录了，存上
            },
            fail: err => {
              console.error('note失败：', err)
            }
          })
          swan.setStorageSync('ishave',true)//现在有了
    }
    else{//之前有数据，update
        let resid = swan.getStorageSync('resid')
        this.update(noteData, resid)
    }
    this.setData({
      isSave: true
    })
    swan.showToast({
      title: '已保存',
      icon: 'success',
      duration: 2000
    })
  },
  update(noteData, resid){//不空白加笔记、不空白更改笔记，都是update
    db.collection('note').doc(resid).update({
        data: {
            noteData:noteData
        },
        success: res => {
            console.log('note更新成功，记录 _id: ', res._id)
          },
          fail: err => {
            console.error('note更新失败：', err)
          }
      })
  },
  getThisNote(index){
    let data = swan.getStorageSync('noteData')
    return data[index]
  },
  delateThisNote(index) {
    let data = swan.getStorageSync('noteData')
    data.splice(index, 1)//删除了
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
            url: '../product/index'
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

openShare() {
    swan.openShare({
        title: '小押的中文说唱押韵工具',
        content: '想要成为rapstar吗',
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