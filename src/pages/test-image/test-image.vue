<template>
	<view class="test-container">
		<text class="title">图片测试页面</text>
		<image class="test-image" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/health_map.jpg" mode="aspectFill"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	}
}
</script>

<style scoped>
.test-container {
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #111418;
	margin-bottom: 32rpx;
}

.test-image {
	width: 100%;
	height: 400rpx;
	border-radius: 24rpx;
}
</style>
