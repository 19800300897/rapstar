// 自定义组件逻辑 (custom.js)

/* eslint-disable */
Component({
    properties: {
        // 定义了name属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        name: {
            type: String,
            theme: ''
        }
    },
    observers: {
        'theme': function () {
            /* eslint-disable */
            swan.setNavigationBarColor({
                /* eslint-enable */
                frontColor: '#ffffff',
                backgroundColor: '#3670C2',
                animation: {
                    duration: 500,
                    timingFunc: 'linear'
                }
            });
        }
    },
    methods: {
        created() {
            const systemInfo = swan.getSystemInfoSync();
            this.setData({
                statusBarHeight: systemInfo.statusBarHeight
            })
        },
        back() {
            swan.navigateBack({
                success: res => {
                    console.info('navigateBack success');
                },
                fail: err => {
                    console.info('navigateBack fail', err);
                }
            });
        },
           /**
     * 监听收藏按钮
     */
    tapChangeCollect() {
        console.log("点击收藏");
        swan.showToast({
            title: '收藏成功(＾.＾)V',
            mask: false,
            success: res => {
                this.setData({'disabled': false});
            },
            fail: err => {
                console.log('showToast fail', err);
            }
        });
    },
    }
});