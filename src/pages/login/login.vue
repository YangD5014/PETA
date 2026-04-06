<template>
	<view class="login-container">
		<video
			class="video-background"
			:src="cdnBase + '/videos/压缩后_播片-2.mp4'"
			autoplay
			loop
			muted
			object-fit="cover"
		></video>
		<view class="overlay"></view>

		<view class="content-wrapper">
			<view class="spacer"></view>

			<view class="main-heading">
				<text class="heading-line">宠物智能孪生</text>
				<text class="heading-line">让爱的陪伴</text>
				<text class="heading-line">再无时差</text>
				<text class="heading-brand">PETA HK Limited</text>
			</view>

			<view class="button-container">
				<view class="btn btn-light-green" @click="goToLogin">
					<text class="btn-text">Log in</text>
				</view>
				<view class="btn btn-light-green" @click="goToSignup">
					<text class="btn-text">Register</text>
				</view>
			</view>

			<view class="btn btn-black" @click="handleWechatLogin">
				<image class="wechat-icon" :src="cdnBase + '/icons/微信.svg'" mode="aspectFit"></image>
				<text class="btn-text-black">Sign in with WeChat</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cdnBase: 'https://gcore.jsdelivr.net/gh/YangD5014/PETA@main/src/static'
		}
	},
	methods: {
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login-form/login-form'
			})
		},
		goToSignup() {
			uni.navigateTo({
				url: '/pages/signup/signup'
			})
		},
		handleWechatLogin() {
			uni.showLoading({ title: '正在登录...' })
			setTimeout(() => {
				uni.hideLoading()
				uni.reLaunch({
					url: '/pages/pet-card/pet-card'
				})
			}, 1500)
		}
	}
}
</script>

<style scoped>
.iconfont {
	font-family: 'Material Symbols Outlined';
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	display: inline-block;
	line-height: 1;
	text-transform: none;
	letter-spacing: normal;
	word-wrap: normal;
	white-space: nowrap;
	direction: ltr;
	-webkit-font-smoothing: antialiased;
}

.login-container {
	width: 100vw;
	height: 100vh;
	background-color: #000000;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.video-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 1;
}

.content-wrapper {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48rpx;
	padding-top: calc(env(safe-area-inset-top) + 48rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
	width: 100%;
	box-sizing: border-box;
	flex: 1;
}

.spacer {
	width: 200rpx;
	height: 200rpx;
}

.main-heading {
	font-size: 52rpx;
	line-height: 1.3;
	font-weight: 900;
	text-align: center;
	margin-bottom: 60rpx;
	letter-spacing: -0.02em;
}

.heading-line {
	display: block;
	color: #ffffff;
}

.heading-brand {
	display: block;
	color: #ffffff;
	margin-top: 24rpx;
	font-size: 28rpx;
	font-weight: 600;
}

.btn {
	padding: 28rpx 40rpx;
	border-radius: 24rpx;
	font-weight: 600;
	font-size: 30rpx;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	box-sizing: border-box;
}

.btn:active {
	transform: scale(0.98);
}

.btn-light-green {
	background-color: #b7e869;
	color: #000000;
	flex: 1;
}

.btn-black {
	background-color: rgba(0, 0, 0, 0.7);
	color: #ffffff;
	backdrop-filter: blur(20rpx);
	width: 100%;
	max-width: 600rpx;
	margin-top: 24rpx;
}

.btn-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #000000;
}

.btn-text-black {
	font-size: 28rpx;
	font-weight: 600;
	color: #ffffff;
}

.wechat-icon {
	width: 36rpx;
	height: 36rpx;
	filter: brightness(0) invert(1);
}

.button-container {
	display: flex;
	gap: 20rpx;
	justify-content: center;
	width: 100%;
	max-width: 600rpx;
}
</style>
