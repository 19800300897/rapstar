/**
 * @file 政务服务大厅-我的页面
 * @author swan
 */

import {getMineList} from '../../utils/index';
import {showErr, setTabBar, systemInfo, isFullScreen} from '../../utils/base';
import {STORAGE_IS_LOGIN} from '../../const/storage';

/* global swan */

Page({ // eslint-disable-line

    data: {
        // 是否展示页面loading
        loading: true,
        // 用户头像
        avatarUrl: '',
        // 是否登录
        isLogin: false,
        // 用户昵称
        user: '',
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

        // 列表
        list: [],
        // 自定义顶bar的高度
        navHeight: 0,
        // 检测是否为全面屏
        isFullScreen
    },

    onLoad() {
        console.log(this.data.isLogin);
        this.setData({
            navHeight: systemInfo.statusBarHeight + systemInfo.navigationBarHeight + 'px'
        });
        this.fetchData();
    },

    onShow() {
        let isLogin = '';
        try {
            isLogin = swan.getStorageSync(STORAGE_IS_LOGIN) || '';
        }
        catch (err) {
            console.error(err);
        }
        this.setData({
            isLogin
        });
        isLogin = isLogin ? '我的' : '未登录';
        swan.setTabBarItem({
            index: 3,
            text: isLogin,
            iconPath:'/pages/images/mine.png',
            selectedIconPath:'/pages/images/mine2.png'
        })
    },

    /**
     * 跳转下个页面
     *
     * @param {Event} e 事件对象
     */
    goNextPage(e) {
        if (e.currentTarget.dataset.name === '我的收藏') {
            swan.navigateTo({
                url: '../favorites/index'
            });
            return;
        }
       // showErr('未配置跳转地址');
       if (e.currentTarget.dataset.name === '意见反馈') {
        swan.navigateTo({
            url: '../feedback/index'
        });
        return;
    }
    if (e.currentTarget.dataset.name === '关于我们') {
        swan.navigateTo({
            url: '../us/index'
        });
        return;
    }
    if (e.currentTarget.dataset.name === '个人设置') {
        swan.navigateTo({
            url: '../setting/index'
        });
        return;
    }
    },

    /**
     * 获取首页数据
     */
    fetchData() {

        getMineList(({code, data}) => {
            let res = {
                errStatus: '',
                loading: false
            };
            // code: 0 数据请求成功
            if (code === 0) {
                console.log(0);
                res = {
                    ...res,
                    ...data
                };
                console.log(res);
                console.log(data);
                // 设置背景色
                swan.setBackgroundColor({
                    backgroundColorTop: '#ffffff',
                    backgroundColorBottom: '#74B89C'
                });
            }
            // code: 99999 无网络, 其他为服务异常错误
            else {
                console.log(99999);
                res.errStatus = code === 99999 ? 'noNetwork' : 'warning';
            }
            this.setData(res);
        });
    },



    /**
     * 登录
     */
    goLogin() {
        if (!this.data.isLogin) {
            swan.navigateTo({
                // 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’。
                url: '../index/index',
                // 接口调用成功的回调函数
                success: res => {

                },
                // 接口调用失败的回调函数
                fail: res => {},
                // 接口调用结束的回调函数（调用成功、失败都会执行）
                complete: res => {}
            });

        }


    }
});
