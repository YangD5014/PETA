<template>
    <view class="page-container">
        <view class="safe-area-top"></view>
        <view class="content">
            <image class="logo" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/logo.png"/>
            <view class="text-area">
                <text class="title">{{ title }}</text>
            </view>
            <view class="btns">
                <button @tap="navigateTo" data-target="/sub-pack-2/particles/index">粒子特效</button>
                <button @tap="navigateTo" data-target="/sub-pack-2/gltf-loader/index">gltf loader</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Hello Three.js')

function navigateTo(e: MouseEvent) {
  uni.navigateTo({
    url: (e.target as HTMLElement).dataset.target as string,
  })
}
</script>

<style lang="scss">
.page-container {
    width: 100%;
    min-height: 100vh;
    background: #f8fafc;
}

.safe-area-top {
    width: 100%;
    height: constant(safe-area-inset-top);
    height: env(safe-area-inset-top);
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}

.btns{
    margin-top: 20px;
    button{
        margin-top: 10px;
    }
}
</style>
