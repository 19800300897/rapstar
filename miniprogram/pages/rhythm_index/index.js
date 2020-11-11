/**
 * @file index.js
 * @author swan
 */
/* globals Page, swan, getCurrentPages */
const app = getApp()
/* eslint-disable */
Page({
    /* eslint-enable */
        data: {
               //三个按钮的样式，isfavor意思是有没有按下去
        isFavor: false,
        isFavor2: false,
        isFavor3: false,
        // 测试结果为“你好”的双押结果
        threeColumnOptions: [
            {
                name: '知道',
                value: '知道'
            }, {
                name: '提高',
                value: '提高'
            }, {
                name: '只要',
                value: '只要'
            }, {
                name: '至少',
                value: '至少'
            }, {
                name: '日报',
                value: '日报'
            }, {
                name: '时报',
                value: '时报'
            }, {
                name: '制造',
                value: '制造'
            },
            {
                name: '必要',
                value: '必要'
            },
            {
                name: '医药',
                value: '医药'
            }
        ],
            collectId:'',
            userid:'',
            searchKeyword: false, //从数据库查找keyword
            queryResult: [],
            searchPlaceholder: '请输入要查找的字或词',
            searchPresetword: '',
            searchValue: '',
            isFocus: false,
            showActions: false,
            historyItems: [],
            operateItems: [],
            searchResult: [],
            isLoading: false,
            showStatus: false,
            pageStatus: {
                loading: true,
                loadingTitle: '正在加载...',
                title: '',
                icon: '',
                btnText: '',
                showBtn: true
            },
            keybordHeight: 0,
            showBack: false, // 是否显示返回上一页icon

        },

        onLoad() {
            this.onGetUserid();
            if (app.globalData.userid) {
                this.setData({
                  userid: app.globalData.userid
                })
              }
            this.getPageInfo();
            this.setTopbar();
            this.historyLabelTap = this.debounce(this.historyLabelTap);
        },
        onGetUserid() {
            // 调用云函数
            swan.cloud.callFunction({
              name: 'login',
              success: res => {
                  console.log(res);
                console.log('[云函数] [login]调用成功userid: ', res.result.userid)
                swan.setStorageSync('userid',res.result.userid)
                app.globalData.userid = res.result.userid
                this.setData({
                    userid:res.result.userid
                })
              },
              fail: err => {
                console.error('[云函数] [login] 调用失败', err)
              }
            })
          },
        onShow() {
            swan.setPageInfo({
                title: '押韵'
            });
            this.getPageInfo();
        },

        /**
         * 获取页面初始化信息
         */
        getPageInfo() {
            // TODO: 获取最新的默认请求词 运营推荐词
            setTimeout(() => {
                this.setData({
                    isFocus: true,
                });
            }, 0);
        },

        /**
         * 设置返回上一页icon的显示/隐藏
         */
        setTopbar() {
            const pages = getCurrentPages();
            this.setData({
                showBack: pages.length > 1
            });
        },

        /**
         * 返回上一页
         */
        navigateBack() {
            swan.navigateBack();
        },
        /**
         * 点击搜索按钮
         * @param {Event} e 点击搜索按钮事件
         */
        search(e) {
            this.startSearch(e.detail.value);
        },

        /**
         * 点击清除按钮
         */
        clear() {
            this.setData({
                isLoading: false,
                showStatus: false,
                searchValue: '',
                searchResult: [],
                isFocus: false
            });
            swan.nextTick(() => {
                this.setData('isFocus', true);
            });
        },
 /**
     * 监听组件change事件
     *
     * @param {Object} event change事件对象
     */
    groupChange(event) {
        let myCollect = event.detail;
        console.log('change value:', event.detail);
        this.setData({
            myCollect: myCollect
        })
    },

    Longpress(e){
        console.log("长按");
        console.log(e.target.dataset.value);
        let keyword = e.target.dataset.value;
        swan.navigateTo({
            title: "",
            url: "webview/webview?webViewUrl="+"https://baike.baidu.com/item/"+keyword,
          })
    },
    /**
     * 监听按钮的点击事件，一共三个：单押、双押、多押
     *
     */
    tapChange() {
        this.setData({
            isFavor: !this.data.isFavor,
            isFavor2: false,
            isFavor3:false

        });
    },
    tapChange2() {
        this.setData({
            isFavor2: !this.data.isFavor2,
            isFavor:false,
            isFavor3:false
        });
    },
    tapChange3() {
        this.setData({
            isFavor3: !this.data.isFavor3,
            isFavor:false,
            isFavor2:false
        });
    },
           /**
     * 监听收藏按钮
     */
    tapChangeCollect() {
        if(!this.data.userid){
            swan.showModal({
                title: '登录提示',
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
        }
        var keyword = "拟好";//模拟keyword数据
        this.onQuery(keyword);//查库里有没有关键词
    },
    /**
     * 增加keyword的方法
     */
    onAdd: function (keyword,value) {
        const db = swan.cloud.database()
        db.collection('collection').add({
          data: {
            keyword:keyword,
            collectword:value
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id

             this.setData({
               collectId: res._id,//收藏表的id，唯一
             })
            swan.showToast({
              title: '收藏成功',
            })
            console.log('[collection] [收藏] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            swan.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[collection] [收藏] 失败：', err)
          }
        })
      },
      onQuery: function(value) {
        const db = swan.cloud.database()
        db.collection('collection').where({
            _cbd_author_id:this.data.userid,
            keyword:value
        }).get({
          success: res => {//这个用户有关键词(肯定只有一条记录),就更改它
            console.log(res);
            if(res.data.length > 0){
            console.log("这个用户有关键词");
            console.log(res);
            var arr1 = res.data[0].collectword;//取出原有的数据
            var arr2 = this.data.myCollect;
            let union = arr1.concat(arr2.filter(function (val) { return !(arr1.indexOf(val) > -1) })) //取两个集合的并集
           this.onUpdate(res.data[0]._id,union);
            }
            else{
                console.log("没有添加过这个关键词");
                this.onAdd(value,this.data.myCollect);
                this.setData({
                    searchKeyword: false
                })
            }
             this.setData({
               queryResult: JSON.stringify(res.data, null, 2),
               searchKeyword: true
             })
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

      /**
       *
       * @param {*} e 修改数据
       */
      onUpdate : function(res_id,union){
        const db = swan.cloud.database()
         db.collection('collection').doc(res_id).update({
      data: {
        collectword: union
      },
      success: res => {
        console.log('update成功')
        swan.showToast({
            title: '收藏成功',
          })
      },
      fail: err => {
        icon: 'none',
        console.error('update失败：', err)
      }
    })
      },
        /**
         * 搜索框输入改变
         * @param {Event} e 搜索框输入改变事件
         */
        input(e) {
            const value = e.value.trim();
            if (value === '') {
                return;
            }
            this.setData({
                isLoading: false,
                showStatus: false,
                searchValue: value,
                searchResult: []
            }, () => {
                // TODO: 发起请求获取推荐词
                setTimeout(() => {
                    this.setData({
                        isFocus: true,

                    });
                }, 0);
            });
        },

        /**
         * 键盘聚焦时
         * @param {Event} e 键盘聚焦事件
         */
        focus(e) {
            !this.data.keybordHeight && this.setData({
                keybordHeight: e.detail.height
            });
        },

        /**
         * 发起搜索
         * @param {string} value 搜索的词语
         */
        startSearch(value) {
            console.log("搜索："+value);
            if (this.data.isLoading) {
                return;
            }
            this.setData({
                showStatus: false,
                searchValue: value,
                isLoading: true,
                pageStatus: {
                    loading: true,
                    loadingTitle: '正在加载...'
                }
            }, () => {
                //获取数据
                swan.request({
                    url: 'https://pk.342996997.xyz:5000',
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    data: {
                        inputData: value
                    },
                    success: res => {
                        console.log('request success', res);
                        swan.showModal({
                            title: '请求到的数据',
                            content: JSON.stringify(res.data.data),
                            showCancel: false
                        });
                    },
                    fail: err => {
                        swan.showToast({
                            title: JSON.stringify(err)
                        });
                        console.log('request fail', err);
                    },
                    complete: () => {
                        this.setData('loading', false);
                    }
                });
                try {
                    setTimeout(() => {
                        // 在还未查询到结果时用户改变了搜索词
                        if (this.data.searchValue !== value) {
                            return;
                        }
                        if (searchResult.length === 0) {
                            this.setData({
                                isLoading: false,
                                showStatus: true,
                                pageStatus: {
                                    isLoading: false,
                                    title: '没有搜索到相关韵脚',
                                    icon: 'search',
                                    showBtn: true,
                                    btnText: '发现更多小程序'
                                }
                            });
                        } else {
                            this.setData({
                                isLoading: false,
                                searchValue: query,
                                searchResult: [1]
                            });
                        }
                    }, 3000);
                } catch (e) {
                    this.setData({
                        isLoading: false,
                        showStatus: true,
                        pageStatus: {
                            isLoading: false,
                            title: '网络不给力，请稍后重试',
                            icon: 'wifi',
                            showBtn: true,
                            btnText: '重新加载'
                        }
                    });
                }
            });
        },


        /**
         * 点击搜索结果项
         */
        resultItemTap() {
            // TODO: 跳转到搜索结果页
        },

        /**
         * 页面点击事件
         */
        containerTap() {

        },

        /**
         * 点击page-status按钮
         */
        reloading() {
            const type = this.data.pageStatus.icon;
            if (type === 'wifi') {
                this.startSearch(this.data.searchValue);
            } else if (type === 'search') {
                this.clear();
            }
        },

        /**
         * 防抖动方法
         * @param {Function} fn 待防抖动方法
         * @param {number} delay 防抖毫秒数， 默认300
         */
        debounce(fn, delay) {
            let timer;
            return function () {
                let args = arguments;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(this, args);
                }, (delay ? delay : 300));
            };
        }
    });
