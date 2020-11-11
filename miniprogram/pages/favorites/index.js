const app = getApp()
Page({
    data: {
        showActions: false,
        queryResult:[]
    },
    onLoad: function () {
        //查找所有同一userid下的keyword及其collect
        this.onQuery(swan.getStorageSync("userid"));
    },
    onQuery: function(value) {
        console.log(value);
        const db = swan.cloud.database();
        // 查询当前用户所有的 counters
        db.collection('collection').where({
            _cbd_author_id:value
        }).get({
          success: res => {
             this.setData({
               queryResult: res.data,
               searchKeyword: true
             })
             console.log(res.data);
            console.log('[数据库] [查询记录] 成功: ', res._id)
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
      onQueryRes: function(keyword) {
          console.log(keyword);
        const db = swan.cloud.database();
        // 查询当前用户所有的 counters
        db.collection('collection').where({
            _cbd_author_id:swan.getStorageSync("userid"),
            keyword:keyword
        }).get({
          success: res => {
              console.log(res.data[0]._id);
              this.onRemove(res.data[0]._id);
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
      showActions(item) {
          console.log("点击");
          console.log(item.currentTarget.dataset.data);
        this.onQueryRes(item.currentTarget.dataset.data.keyword);
        this.setData({
            showActions: true
        });
    },
    hideActions() {
        this.setData({
            showActions: false,
            queryResult: this.data.queryResult.map(item => {
                item.status = 0;
                return item;
            })
        });
    },
    onRemove: function(id) {
        console.log(id);
          const db = swan.cloud.database()
          db.collection('collection').doc(id).remove({
            success: res => {
              swan.showToast({
                title: '删除成功',
              })
              this.onLoad();
            },
            fail: err => {
              swan.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', err)
            }
          })
      },
      switchTab:function(){
        swan.switchTab({
            url: '../rhythm_index/index',
            success: res => {
                console.log('switchTab success');
            },
            fail: err => {
                console.log('switchTab fail', err);
            }
        })
      },
      switchTab2:function(){
        swan.switchTab({
            url: '../mine/index',
            success: res => {
                console.log('switchTab success');
            },
            fail: err => {
                console.log('switchTab fail', err);
            }
        })
      }
});