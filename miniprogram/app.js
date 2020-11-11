/**
 * @file app.js
 * @author swan
 */

/* globals App,swan */
/* eslint-disable */
App({
/* eslint-enable */
    onLaunch(options) {
        if (!swan.cloud) {
            console.error('请使用 3.105.2 或以上的基础库以使用云能力')
          } else {
            swan.cloud.init({
              env: 'rapstar-v9111nnk',
              traceUser: true,
            })
          }

          this.globalData = {}
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
