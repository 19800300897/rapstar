/**
 * @file 页面topbar
 * @author swan
 */
/* globals Component, swan */

/* eslint-disable */
Component({
/* eslint-enable */
    properties: {
        title: {
            type: String,
            value: '搜索'
        },
        hasBack: {
            type: Boolean,
            value: false
        },
        color: {
            type: String,
            value: '#000'
        },
        backgroundColor: {
            type: String,
            value: '#f8f8f9'
        },
        backColor: {
            type: String,
            value: 'black'
        }
    },
    data: {
        showTopBar: false,
        isAndroid: true,
        statusBarHeight: 28,
        topbarHeight: 64
    },
    attached() {
        const device = swan.getSystemInfoSync();
        const statusBarHeight = device.statusBarHeight;
        const isAndroid = device.platform === 'android';
        this.setData({
            showTopBar: true,
            isAndroid,
            statusBarHeight,
            topbarHeight: statusBarHeight + (isAndroid ? 38 : 44)
        });
    },
    methods: {
        back() {
            this.triggerEvent('navigateback');
        }
    }
});
