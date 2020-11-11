/**
 * @file demo component for webview
 * @author sunbai
 */

/* global Page, swan, getApp */

let app = getApp();

/* eslint-disable babel/new-cap */
Page({
/* eslint-enable babel/new-cap */
    data: {
        src:'',
    },
    // onLoad 时接收H5页传过来的参数
    onLoad(options) {
        console.log("传递："+options.webViewUrl);
        this.setData('src', options.webViewUrl);
    },
    onHide() {
        app.globalData.openParams = '';
    },
    // web-view通过swan.webView.postMessage向小程序发送消息，小程序通过bindmessage事件来监听网页向小程序发送的消息，接收时机：小程序后退、组件销毁、分享时
    postMessage(options) {
        console.log('H5页传过来的参数为:', options);
    },
    onShareAppMessage(options) {
        // 获取当前<web-view>的URL
        console.log(options.webViewUrl);
        return {
            title: '智能小程序官方示例',
            content: '世界很复杂，百度更懂你——小程序简介或详细描述',
            imageUrl: 'https://b.bdstatic.com/miniapp/images/bgt_icon.png',
            path: `component/webview/webview?path=${options.webViewUrl}`, // 此处写小程序页面path
            success(res) {
                // 分享成功
            },
            fail(err) {
                // 分享失败
            }
        };
    }
});
