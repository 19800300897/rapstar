/**
 * @file 个人设置
 * @author swan
 */

import {showErr, setTabBar} from '../../utils/base';
import {STORAGE_IS_LOGIN} from '../../const/storage';

/* global swan */

Page({ // eslint-disable-line

    data: {
        // 是否展示loading
        loading: true,
        // 当前错误状态
        errStatus: '',
        // 错误状态类型
        errs: {
            noNetwork: {
                icon: 'wifi',
                title: '网络不给力，请稍后重试',
                showBtn: true
            },
            warning: {
                icon: 'warning',
                title: '服务器开小差，请稍后重试',
                showBtn: true
            }
        },
        // 是否登录
        isLogin: true,
        // 列表数据
        list: []
    },

    onLoad() {
        this.fetchData();
    },

    /**
     * 跳转下个页面
     */
    goNextPage() {
        showErr('未配置跳转地址');
    },

    /**
     * 跳转首页
     */
    changeLogin() {
        const that = this;
        swan.showModal({
            content: '是否确认退出登录',
            confirmText: '确认',
            cancelText: '取消',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        login: false
                    });
                    swan.setStorage({
                        key: STORAGE_IS_LOGIN,
                        data: false
                    });
                    setTabBar('未登录');
                    swan.switchTab({
                        url: '../mine/index'
                    });
                }
            }
        });
    },

    /**
     * 获取首页数据
     */
    fetchData() {
        // getSettingList(({code, data}) => {
        //     let res = {
        //         errStatus: '',
        //         loading: false
        //     };
        //     // code: 0 数据请求成功
        //     if (code === 0) {
        //         res = {
        //             ...res,
        //             list: data
        //         };
        //     }
            // code: 99999 无网络, 其他为服务异常错误
        //     else {
        //         res.errStatus = code === 99999 ? 'noNetwork' : 'warning';
        //     }
        //     this.setData(res);
        // });
    }
});
