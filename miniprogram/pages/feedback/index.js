//index.js
const app = getApp()

Page({
  data: {
      opnion:'',
      content:''
  },
  //事件处理函数
  onLoad: function () {

  },

  /**
   * 意见反馈选择改变
   */
  radioChange: function (e) {
    var opinion = e.currentTarget.dataset.value;
    var _this = this;
    _this.setData({
        opinion:opinion
    })
  },
  submit:function(e){
    var _this = this;
    console.log(_this.data.opinion+_this.data.content);
    _this.onAdd(_this.data.opinion,_this.data.content);
  },
  bindInput:function(e){
    var content = e.detail.value;
    var _this = this;
    _this.setData({
        content:content
    })
  },
    onAdd: function (opinion,content) {
        const db = swan.cloud.database()
        db.collection('opinions').add({
          data: {
           opinion:opinion,
           content:content,
           time:new Date().toLocaleString()
          },
          success: res => {
            swan.showModal({
                title: '反馈成功',
                content: '谢谢您！\n',
                showCancel: true,
                cancelText: '继续反馈',
                confirmText: '回到首页',
                confirmColor: '#74B89C',
                success: res => {
                    if(res.confirm){//回到首页
                        swan.switchTab({
                            url: '../rhythm_index/index',
                            success: res => {
                                console.log('switchTab success');
                            },
                            fail: err => {
                                console.log('switchTab fail', err);
                            }
                        })
                    }
                }
            });
            console.log('反馈成功，谢谢合作！');
          },
          fail: err => {
            swan.showToast({
                title: '请稍后再试！',
            })
            console.log( '出了点问题，稍后再试！');
          }
        })
      },
})
