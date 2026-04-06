<template>
	<view class="splash-container" @click="handleContainerClick">
		<video
			id="bg-0"
			class="bg-video"
			:class="currentBg === 0 ? 'opacity-100' : 'opacity-0'"
			:src="cdnBase + '/videos/压缩后_播片-1.mp4'"
			autoplay
			loop
			muted
			object-fit="cover"
		></video>
		<video
			id="bg-1"
			class="bg-video"
			:class="currentBg === 1 ? 'opacity-100' : 'opacity-0'"
			:src="cdnBase + '/videos/压缩后_播片-2.mp4'"
			autoplay
			loop
			muted
			object-fit="cover"
		></video>
		<video
			id="bg-2"
			class="bg-video"
			:class="currentBg === 2 ? 'opacity-100' : 'opacity-0'"
			:src="cdnBase + '/videos/压缩后_播片-3.mp4'"
			autoplay
			loop
			muted
			object-fit="cover"
		></video>
		<video
			id="bg-3"
			class="bg-video"
			:class="currentBg === 3 ? 'opacity-100' : 'opacity-0'"
			:src="cdnBase + '/videos/压缩后_播片-4.mp4'"
			autoplay
			loop
			muted
			object-fit="cover"
		></video>
		<view class="overlay"></view>

		<view class="progress-indicators">
			<view class="progress-bar" :class="{ 'active': currentBg >= 0 }"></view>
			<view class="progress-bar" :class="{ 'active': currentBg >= 1 }"></view>
			<view class="progress-bar" :class="{ 'active': currentBg >= 2 }"></view>
			<view class="progress-bar" :class="{ 'active': currentBg >= 3 }"></view>
		</view>

		<view class="header">
			<text class="brand-title">宠影孪生</text>
			<view class="menu-btn">
				<text class="iconfont icon-menu">&#xe5d2;</text>
			</view>
		</view>

		<view class="main-content">
			<view class="text-container">
				<text class="main-title">{{ slideContent[currentBg].title }}</text>
				<text class="main-subtitle">{{ slideContent[currentBg].subtitle }}</text>
			</view>
		</view>

		<view class="footer">
			<view class="cta-container">
				<button
					v-if="showStartButton"
					class="start-button"
					@click.stop="handleStart"
				>
					<text class="iconfont icon-arrow">&#xe5c8;</text>
					<text class="btn-text">Start</text>
				</button>
			</view>
			<view class="brand-cluster">
				<view class="brand-logo">
					<view class="logo-inner"></view>
				</view>
				<view class="brand-info">
					<text class="brand-name">PETA HK Limited</text>
					<view class="brand-curated">
						<text class="curated-text">curated by</text>
						<text class="curated-brand">PETA</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cdnBase: 'https://gcore.jsdelivr.net/gh/YangD5014/PETA@main/src/static',
			currentBg: 0,
			totalBgs: 4,
			showStartButton: false,
			touchStartX: 0,
			slideContent: [
				{
					title: '智能孪生，为爱续航',
					subtitle: 'Digital Twin, Love Endures'
				},
				{
					title: '数字守护，朝夕相伴',
					subtitle: 'Smart Guardian, Forever by Side'
				},
				{
					title: '具身智能，硬件守护',
					subtitle: 'Embodied Intelligence, Hardware Guardianship'
				},
				{
					title: '一切精彩尽在 宠影孪生',
					subtitle: 'To Start'
				}
			]
		}
	},
	onLoad() {
		console.log('启动页加载完成')
	},
	methods: {
		switchToNextBg() {
			if (this.currentBg >= this.totalBgs - 1) return

			this.currentBg += 1
			console.log('切换到背景:', this.currentBg)

			if (this.currentBg === this.totalBgs - 1) {
				this.showStartButton = true
			}
		},
		handleContainerClick(e) {
			if (this.currentBg >= this.totalBgs - 1) return
			this.switchToNextBg()
		},
		handleStart() {
			uni.redirectTo({
				url: '/pages/login/login'
			})
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

.splash-container {
	width: 100vw;
	height: 100vh;
	background-color: #131313;
	position: relative;
	overflow: hidden;
}

.bg-video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: brightness(0.5);
	transition: opacity 0.5s ease;
}

.opacity-100 {
	opacity: 1;
}

.opacity-0 {
	opacity: 0;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to bottom, rgba(19, 19, 19, 0.4) 0%, transparent 40%, rgba(19, 19, 19, 0.9) 100%);
}

.progress-indicators {
	position: fixed;
	top: 24rpx;
	left: 0;
	width: 100%;
	padding: 0 32rpx;
	padding-top: env(safe-area-inset-top);
	display: flex;
	gap: 8rpx;
	z-index: 50;
	box-sizing: border-box;
}

.progress-bar {
	height: 6rpx;
	flex: 1;
	background-color: rgba(53, 53, 53, 0.3);
	border-radius: 9999rpx;
	transition: background-color 0.3s ease;
}

.progress-bar.active {
	background-color: #ffffff;
}

.header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 50;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 32rpx;
	padding-top: calc(env(safe-area-inset-top) + 24rpx);
	box-sizing: border-box;
}

.brand-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: 0.02em;
}

.menu-btn {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 255, 255, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(32rpx);
}

.menu-btn .iconfont {
	font-size: 36rpx;
	color: #ffffff;
}

.main-content {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 48rpx 300rpx;
	text-align: center;
	z-index: 10;
	box-sizing: border-box;
}

.text-container {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.main-title {
	font-size: 44rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: -0.02em;
	line-height: 1.3;
}

.main-subtitle {
	font-size: 28rpx;
	color: rgba(199, 198, 198, 0.9);
	letter-spacing: 0.02em;
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 20;
	padding: 32rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
	background: linear-gradient(to top, #131313 0%, transparent 100%);
	box-sizing: border-box;
}

.cta-container {
	max-width: 600rpx;
	margin: 0 auto;
	width: 100%;
}

.start-button {
	width: 100%;
	background-color: #ffffff;
	color: #1a1c1c;
	font-weight: 600;
	padding: 28rpx 40rpx;
	border-radius: 9999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	border: none;
	transition: transform 0.15s ease;
}

.start-button:active {
	transform: scale(0.98);
}

.start-button .iconfont {
	font-size: 40rpx;
}

.btn-text {
	font-size: 30rpx;
	letter-spacing: -0.02em;
}

.brand-cluster {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-top: 40rpx;
	opacity: 0.8;
	gap: 16rpx;
}

.brand-logo {
	width: 56rpx;
	height: 56rpx;
	border-radius: 12rpx;
	background-color: #2a2a2a;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.05);
}

.logo-inner {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	border-radius: 6rpx;
}

.brand-info {
	display: flex;
	flex-direction: column;
}

.brand-name {
	font-size: 22rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.brand-curated {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-top: 4rpx;
}

.curated-text {
	font-size: 18rpx;
	color: rgba(255, 255, 255, 0.4);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.curated-brand {
	font-size: 18rpx;
	color: rgba(255, 255, 255, 0.6);
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}
</style>
