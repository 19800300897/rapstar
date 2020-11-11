/**
 * @file access-btn 授权按钮
 * @author swan
 */
/* globals Page, Component, swan, getCurrentPages */
/* eslint-disable */
Component({
/* eslint-enable */
    properties: {
        color: {
            type: String,
            value: '#46897D'
        },
        width: {
            type: String,
            value: '634.06rpx'
        },
        noBorder: {
            type: Boolean,
            value: false
        }
    },

    data: {
        canIUse: swan.canIUse('button.open-type.getUserInfo'),
        userInfo: {}
    },

    methods: {
        onTap() {
            if (!this.data.canIUse) {
                this.getAuthorize();
            }
        },
        getAuthorize() {
            swan.authorize({
                scope: 'scope.userInfo',
                success: () => {
                    // this.showToast('已成功授权');
                    this.getUserInfo();
                },
                fail: err => {
                    const errTable = {
                        '10001': '服务器数据异常',
                        '10002': '网络异常，请查看您的网络设置',
                        '10003': '需要授权',
                        '10004': '未登录，请先登录百度账号',
                        '10005': '获取授权失败'
                    };
                    this.showToast(errTable[err.errCode] || '请稍后重试');
                }
            });
        },
        getUserInfo(e) {
            console.log(e);
            // TODO：配合swanjs的Q2非兼容性改动，改用button方式调用getUserInfo
            this.showToast(e.detail.encryptedData ? '已获取用户信息' : '未登录');
        },
        showToast(msg) {
            swan.showToast({
                title: msg,
                icon: 'none'
            });
        }
    }
});