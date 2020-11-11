/**
 * @file utils/base.js
 * @author swan
 * @desc 公用方法
 */

/* global swan */

/**
 * 平台信息
 */
export const systemInfo = (() => {
    let info = {};
    try {
        info = swan.getSystemInfoSync();
    }
    catch (e) {}
    return info;
})();

/**
 * 检测是否ios
 */
export const isIos = systemInfo.platform === 'ios';

/**
 * 检查是不是全面屏
 * @public
 * @return {boolean} 是不是全面屏机型
 */
export const isFullScreen = (function () {
    try {
        const info = swan.getSystemInfoSync();
        const tempInfo = info.model.toLowerCase();
        return [
            'iphone x',
            'iphone xr',
            'iphone xs',
            'iphone xs max',
            'iphone 11',
            'iphone 11 pro',
            'iphone 11 pro max'
        ].some(ele => tempInfo.includes(ele));
    }
    catch (err) {
        console.log('设备信息获取失败', err);
    }
})();

/**
 * showErr 展示错误信息
 *
 * @param {string} err toast的方式展示错误信息，默认2s
 */
export const showErr = (err = '', mask = true) =>
    swan.showToast({title: err.errMsg || err, icon: 'none', duration: 1400, mask});


/**
 * setTabBar() 设置底bar
 * 设置底部bar：我的、 未登录
 * @param {string} text 底bar展示文案
 */
export const setTabBar = text => {
    swan.setTabBarItem({
        index: 2,
        text,
        "iconPath": "/pages/images/mine.png",
         "selectedIconPath": "/pages/images/mine2.png",
    });
};
