/**
 * @file utils/index.js
 * @author swan
 * @desc  获取mock数据的方法
 */

/* global swan */

import {
    mineList
} from './mock.js';

 /**
 * 模拟请求状态
 *
 * @param {Function} callback 回调
 */
export const genStatus = callback => {
    swan.getNetworkType({
        success: res => {
            if (res.networkType === 'none') {
                callback(99999);
            }
            else {
                callback(0);
            }
        },
        fail: err => {
            swan.showToast({
                title: '获取网络状态失败',
                icon: 'none'
            });
        }
    });
};

/**
 * 获取页面数据
 *
 * @param {Object} pageData 页面数据
 * @param {Function} callback 回调
 */
export const getPageData = (pageData, callback) => {
    genStatus(code => {
        // 使用settimeout模拟请求时间
        setTimeout(() => {
            callback({
                code,
                msg: '',
                data: code === 0 ? pageData : {}
            });
        }, 500);
    });
};


/**
 * 获取个人中心列表
 *
 * @param {Function} callback 回调
 */
export const getMineList = callback => {
    getPageData(mineList, callback);
};



