<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* #ifdef H5 */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400&display=swap');
/* #endif */

/* #ifndef H5 */
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100 700;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/fonts/material-symbols-outlined.woff2') format('woff2');
}

@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/fonts/manrope-regular.woff2') format('woff2');
}
/* #endif */

/* 全局安全区域样式 */
page {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.safe-area-top {
  width: 100%;
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.iconfont {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-feature-settings: 'liga';
}

.page-container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
}
</style>
