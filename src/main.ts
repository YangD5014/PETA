// #ifndef H5
import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
// #endif
import { createSSRApp } from "vue";
import App from "./App.vue";
// #ifdef MP-WEIXIN
import '@minisheep/three-platform-adapter/wechat';
// #endif

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
