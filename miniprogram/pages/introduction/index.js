import {styleItems,wordsItems} from '../common/mock';
Page({
    data: {
      flag: 0,
      currentTab: 0,
      styleItems:[],
      wordsItems:[],
      buttonDisabled:false,
      modalHidden:true,
      show:false,



    },
    switchNav: function(e) {
        var page = this;
        var id = e.target.id;
        if (this.data.currentTab == id) {
          return false;
        } else {
          page.setData({
            currentTab: id
          });
        }
        page.setData({
          flag: id
        });
      },
    catchTouchMove: function (res) {
        return false
      },

      onLoad: function () {
        var that = this
        swan.getSystemInfo({
          success: function (res) {
            that.setData({
              clientHeight: res.windowHeight-20,
              styleItems:styleItems,
              wordsItems:wordsItems
            });

          }
        })
    },
    primary(e) {
        var index = e.currentTarget.dataset.value;
        var item = styleItems[index];
        var name = item.name;
        var content = item.label;
        var alink = item.alink;
        console.log(alink)
        // 这里swan.showModal和swan.showToast的出现是互斥行为
        swan.showModal({
            title: name,
            content: content,
            showCancel: true,
            cancelText: '知道了',
            confirmText: '前往查看',
            confirmColor: '#74B89C',
            success: res => {
                if(res.confirm){//点击前往
                    swan.navigateTo({
                        title: "",
                        url: '../rhythm_index/webview/webview?webViewUrl='+alink
                      })
                }
            }
        });
    },
    tapHandle(e){
        var link = e.currentTarget.dataset.value;
        console.log(link);
        swan.navigateTo({
            // 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’。
            url: '../rhythm_index/webview/webview?webViewUrl='+'https://baike.baidu.com/item/'+link,
            // 接口调用成功的回调函数
            success: res => {},
            // 接口调用失败的回调函数
            fail: res => {},
            // 接口调用结束的回调函数（调用成功、失败都会执行）
            complete: res => {}
        });
    },
    goto(){
        swan.switchTab({
            // 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
            url: '../rhythm_index/index',
            // 接口调用成功的回调函数
            success: res => {},
            // 接口调用失败的回调函数
            fail: res => {},
            // 接口调用结束的回调函数（调用成功、失败都会执行）
            complete: res => {}
        });
    },



  })

