//index.js

Page({
    data: {
      noteList: [],
      isSetting: false,
      isQuery: []
    },
    onLoad: function () {
      // 获取本地数据进行展示
    },
    onShow(){
      this.setData({
        noteList: swan.getStorageSync('noteData')
      })
    },
    dataDetail(e){
        console.log(e);
      let dataIndex = e.currentTarget.dataset.index
      swan.navigateTo({
        url: '../editor/index?page=' + dataIndex
      })
    },
    addNote(){
      swan.navigateTo({
        url: '../editor/index'
      })
    },
    showSetting(e){
      this.setData({
        isSetting: true
      })
      this.initQuery(false)
      this.chooseItem(e)
    },
    itemTap(e){
      if (!this.data.isSetting) {
        this.dataDetail(e)
      } else {
        this.chooseItem(e)
      }
    },
    initQuery(boolean){
      let num = this.data.noteList.length
      let isQueryArr = []
      for (let i = 0; i < num; i++) {
        isQueryArr.push({
          value: boolean
        })
      }
      this.setData({
        isQuery: isQueryArr
      })
    },
    changeQuery(curIndex){
      let isQueryArr = this.data.isQuery
      isQueryArr[curIndex].value = !isQueryArr[curIndex].value
      this.setData({
        isQuery: isQueryArr
      })
    },
    chooseItem(e){
      let curIndex = e.currentTarget.dataset.index
      this.changeQuery(curIndex)
    },
    cancel(){
      this.setData({
        isSetting: false
      })
      this.initQuery(false)
    },
    allQuery(){
      this.initQuery(true)
    },
    delatePrompt(){
      let _this = this
      swan.showModal({
        title: '确定要删除么？',
        success: function (res) {
          if (res.confirm) {
            _this.delate()
          } else if (res.cancel) {
            swan.showToast({
              title: '已取消',
              duration: 2000
            })
          }
        }
      })
    },
    delate(){
      let data = this.data.noteList
      let queryData = this.data.isQuery
      let num = 0
      for (let i = 0; i < queryData.length; i++) {
        if (queryData[i].value) {
          data.splice(i-num, 1)
          num += 1
        }
      }
      swan.setStorageSync('noteData', data)
      this.setData({
        noteList: swan.getStorageSync('noteData')
      })
      this.cancel()
    },
    onShareAppMessage: function () {
      return {
        title: '字节笔记',
        imageUrl: '/images/share.jpg',
        path: '/pages/index/index'
      }
    }
  })
