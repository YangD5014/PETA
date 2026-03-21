<template>
	<view class="pet-card-container">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="iconfont icon-arrow-back">&#xe5c4;</text>
			</view>
			<view class="header-title">
				<text class="title-text">社交名片</text>
			</view>
			<view class="battery-indicator">
				<text class="battery-text">85%</text>
				<text class="iconfont icon-battery">&#xe1a4;</text>
			</view>
		</view>

		<scroll-view class="main-content" scroll-y>
			<view class="pet-card-section">
				<view class="pet-card">
					<image class="pet-card-bg" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_card_background.jpg" mode="aspectFill"></image>
					<view class="pet-card-gradient"></view>
					<view class="pet-info">
						<view class="pet-name-row">
							<view class="pet-name-wrap">
								<text class="pet-name">Luna</text>
								<view class="pet-breed-age">
									<text class="pet-breed">金毛寻回犬</text>
									<view class="dot"></view>
									<text class="pet-age">3岁</text>
								</view>
							</view>
							<view class="verified-badge">
								<text class="iconfont icon-verified">&#xe8e8;</text>
							</view>
						</view>
						<view class="pet-tags">
							<text class="tag">友好</text>
							<text class="tag">爱玩</text>
							<text class="tag">已接种疫苗</text>
						</view>
					</view>
				</view>
			</view>

			<view class="activity-section">
				<view class="section-title">
					<text class="iconfont icon-fitness">&#xeB43;</text>
					<text class="title-text">每日活动</text>
				</view>
				<view class="activity-grid">
					<view class="activity-card">
						<view class="activity-icon-wrap steps">
							<view class="progress-ring">
								<view class="progress-circle" style="--progress: 75;"></view>
							</view>
							<text class="iconfont icon-footprint">&#xf69d;</text>
						</view>
						<view class="activity-data">
							<text class="activity-value">4,520</text>
							<text class="activity-label">步数</text>
						</view>
					</view>
					<view class="activity-card">
						<view class="activity-icon-wrap active-time">
							<view class="progress-ring">
								<view class="progress-circle orange" style="--progress: 56;"></view>
							</view>
							<text class="iconfont icon-timer">&#xe425;</text>
						</view>
						<view class="activity-data">
							<text class="activity-value">45m</text>
							<text class="activity-label">活跃</text>
						</view>
					</view>
					<view class="activity-card">
						<view class="activity-icon-wrap calories">
							<view class="progress-ring">
								<view class="progress-circle red" style="--progress: 67;"></view>
							</view>
							<text class="iconfont icon-fire">&#xea15;</text>
						</view>
						<view class="activity-data">
							<text class="activity-value">320</text>
							<text class="activity-label">卡路里</text>
						</view>
					</view>
				</view>
			</view>

			<view class="achievements-section">
				<view class="section-header">
					<view class="section-title">
						<text class="iconfont icon-emoji-events" style="color: #eab308;">&#xea23;</text>
						<text class="title-text">成就</text>
					</view>
					<text class="view-all">查看全部</text>
				</view>
				<scroll-view class="achievements-scroll" scroll-x>
					<view class="achievements-list">
						<view class="achievement-item">
							<view class="achievement-icon star">
								<text class="iconfont icon-pets">&#xe91d;</text>
							</view>
							<text class="achievement-name">明星狗狗</text>
						</view>
						<view class="achievement-item">
							<view class="achievement-icon explorer">
								<text class="iconfont icon-hiking">&#xe50a;</text>
							</view>
							<text class="achievement-name">探险家</text>
						</view>
						<view class="achievement-item">
							<view class="achievement-icon popular">
								<text class="iconfont icon-favorite">&#xe87d;</text>
							</view>
							<text class="achievement-name">受欢迎</text>
						</view>
						<view class="achievement-item locked">
							<view class="achievement-icon locked-icon">
								<text class="iconfont icon-lock">&#xe897;</text>
							</view>
							<text class="achievement-name">已锁定</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="exchange-section">
				<button class="exchange-btn" @click="showQrCard">
					<text class="iconfont icon-qr-code">&#xef6d;</text>
					<text class="btn-text">交换名片</text>
				</button>
				<text class="exchange-hint">通过NFC或二维码分享</text>
			</view>
		</scroll-view>

		<view class="qr-modal" v-if="showModal" @click="closeQrCard">
			<view class="modal-backdrop"></view>
			<view class="qr-card-container" @click.stop>
				<view class="qr-card">
					<view class="qr-card-bg-section">
						<image class="qr-card-bg" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_card_background.jpg" mode="aspectFill"></image>
						<view class="qr-card-gradient"></view>
						<button class="close-btn" @click="closeQrCard">
							<text class="iconfont icon-close">&#xe5cd;</text>
						</button>
						<view class="qr-pet-info">
							<text class="qr-pet-name">Luna</text>
							<view class="qr-pet-detail">
								<text>金毛寻回犬</text>
								<view class="dot"></view>
								<text>3岁</text>
							</view>
						</view>
					</view>
					<view class="qr-code-section">
				<text class="qr-title">扫码添加好友</text>
				<view class="qr-code">
					<view class="qr-pattern">
						<view v-for="(row, i) in qrPattern" :key="i" class="qr-row">
							<view v-for="(cell, j) in row" :key="j" class="qr-cell" :class="{ 'filled': cell === 1 }"></view>
						</view>
					</view>
					<view class="scan-line"></view>
			</view>
				</view>
			</view>
		</view>
		</view>

		<view class="bottom-nav">
			<view class="nav-item" @click="goToPage('pet-social')">
				<text class="iconfont icon-home">&#xe88a;</text>
				<text class="nav-text">朋友圈</text>
			</view>
			<view class="nav-item" @click="goToPage('pet-health')">
				<text class="iconfont icon-monitor-heart">&#xef3c;</text>
				<text class="nav-text">健康</text>
			</view>
			<view class="nav-item center" @click="goToPage('pet-device')">
				<view class="center-btn">
					<text class="iconfont icon-pets">&#xe91d;</text>
				</view>
			</view>
			<view class="nav-item" @click="goToPage('pet-map')">
				<text class="iconfont icon-map">&#xe55b;</text>
				<text class="nav-text">地图</text>
			</view>
			<view class="nav-item active">
				<text class="iconfont icon-badge">&#xea67;</text>
				<text class="nav-text">名片</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showModal: false,
			qrPattern: [
				[1,1,1,1,1,1,1,0,1,0,0,0,0,1,1,1],
				[1,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0],
				[1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1],
				[1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1],
				[1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,1],
				[1,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0],
				[1,1,1,1,1,1,1,0,1,0,0,0,0,1,1,1],
				[0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0],
				[1,1,0,0,1,1,0,1,0,0,1,1,0,0,1,1],
				[0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0],
				[1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1],
				[0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0],
				[1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0],
				[0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1],
				[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0],
				[1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1]
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		showQrCard() {
			this.showModal = true
		},
		closeQrCard() {
			this.showModal = false
		},
		goToPage(page) {
			const routes = {
				'pet-social': '/pages/pet-social/pet-social',
				'pet-health': '/pages/pet-health/pet-health',
				'pet-device': '/pages/pet-device-detail-0/pet-device-detail-0',
				'pet-map': '/pages/pet-map/pet-map',
				'pet-card': '/pages/pet-card/pet-card'
			}
			if (routes[page]) {
				uni.redirectTo({ url: routes[page] })
			}
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

.pet-card-container {
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	position: sticky;
	top: 0;
	z-index: 10;
}

.back-btn {
	padding: 16rpx;
	border-radius: 50%;
}

.back-btn:active {
	background-color: #f3f4f6;
}

.header-title .title-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #111418;
}

.battery-indicator {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background-color: #f3f4f6;
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
}

.battery-text {
	font-size: 24rpx;
	font-weight: bold;
	color: #111418;
}

.icon-battery {
	font-size: 36rpx;
	color: #16a34a;
}

.main-content {
	flex: 1;
	padding-bottom: 120rpx;
}

.pet-card-section {
	padding: 20rpx 30rpx;
}

.pet-card {
	position: relative;
	width: 100%;
	aspect-ratio: 4/5;
	border-radius: 64rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.15);
}

.pet-card-bg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.pet-card-gradient {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
}

.pet-info {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 48rpx;
	z-index: 10;
}

.pet-name-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 16rpx;
}

.pet-name {
	font-size: 72rpx;
	font-weight: 800;
	color: #ffffff;
	margin-bottom: 8rpx;
}

.pet-breed-age {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.pet-breed, .pet-age {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.9);
}

.dot {
	width: 8rpx;
	height: 8rpx;
	background-color: #ffffff;
	border-radius: 50%;
}

.verified-badge {
	background-color: rgba(43, 140, 238, 0.2);
	backdrop-filter: blur(10px);
	border: 2rpx solid rgba(43, 140, 238, 0.5);
	padding: 24rpx;
	border-radius: 50%;
	box-shadow: 0 0 30rpx rgba(43, 140, 238, 0.3);
}

.icon-verified {
	font-size: 48rpx;
	color: #2b8cee;
}

.pet-tags {
	display: flex;
	gap: 16rpx;
	margin-top: 32rpx;
}

.tag {
	padding: 12rpx 24rpx;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border-radius: 32rpx;
	font-size: 24rpx;
	font-weight: 600;
	color: #ffffff;
	border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.activity-section {
	padding: 48rpx 30rpx;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.section-title .iconfont {
	font-size: 40rpx;
	color: #2b8cee;
}

.section-title .title-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #111418;
}

.activity-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
}

.activity-card {
	background-color: #ffffff;
	padding: 24rpx;
	border-radius: 32rpx;
	border: 2rpx solid #f3f4f6;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.activity-icon-wrap {
	position: relative;
	width: 112rpx;
	height: 112rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.progress-ring {
	position: absolute;
	inset: 0;
}

.progress-circle {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: conic-gradient(
		#2b8cee calc(var(--progress) * 3.6deg),
		#f3f4f6 calc(var(--progress) * 3.6deg)
	);
	mask: radial-gradient(transparent 55%, black 56%);
	-webkit-mask: radial-gradient(transparent 55%, black 56%);
}

.progress-circle.orange {
	background: conic-gradient(
		#f97316 calc(var(--progress) * 3.6deg),
		#f3f4f6 calc(var(--progress) * 3.6deg)
	);
}

.progress-circle.red {
	background: conic-gradient(
		#ef4444 calc(var(--progress) * 3.6deg),
		#f3f4f6 calc(var(--progress) * 3.6deg)
	);
}

.activity-icon-wrap .iconfont {
	position: absolute;
	font-size: 40rpx;
}

.steps .iconfont { color: #2b8cee; }
.active-time .iconfont { color: #f97316; }
.calories .iconfont { color: #ef4444; }

.activity-data {
	text-align: center;
}

.activity-value {
	font-size: 32rpx;
	font-weight: 800;
	color: #111418;
}

.activity-label {
	font-size: 20rpx;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 1rpx;
}

.achievements-section {
	padding: 0 30rpx 48rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.view-all {
	font-size: 24rpx;
	font-weight: bold;
	color: #2b8cee;
}

.achievements-scroll {
	white-space: nowrap;
}

.achievements-list {
	display: flex;
	gap: 32rpx;
	padding-bottom: 16rpx;
}

.achievement-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	min-width: 144rpx;
}

.achievement-icon {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #ffffff;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.achievement-icon.star {
	background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
	color: #b45309;
}

.achievement-icon.explorer {
	background: linear-gradient(135deg, #dbeafe 0%, #67e8f9 100%);
	color: #0e7490;
}

.achievement-icon.popular {
	background: linear-gradient(135deg, #f3e8ff 0%, #f0abfc 100%);
	color: #a21caf;
}

.achievement-icon.locked-icon {
	background-color: #f3f4f6;
	border: 4rpx dashed #d1d5db;
	color: #9ca3af;
}

.achievement-icon .iconfont {
	font-size: 48rpx;
}

.achievement-name {
	font-size: 20rpx;
	font-weight: bold;
	color: #374151;
}

.achievement-item.locked .achievement-name {
	color: #9ca3af;
}

.exchange-section {
	padding: 0 30rpx 48rpx;
}

.exchange-btn {
	width: 100%;
	background: linear-gradient(135deg, #111418 0%, #2c3e50 100%);
	padding: 32rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24rpx;
	border: none;
}

.exchange-btn:active {
	transform: scale(0.98);
}

.exchange-btn .iconfont {
	font-size: 48rpx;
	color: #ffffff;
}

.btn-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
}

.exchange-hint {
	display: block;
	text-align: center;
	font-size: 24rpx;
	color: #9ca3af;
	margin-top: 24rpx;
}

.qr-modal {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-backdrop {
	position: absolute;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(10rpx);
}

.qr-card-container {
	position: relative;
	z-index: 10;
	padding: 48rpx;
	width: 100%;
	max-width: 640rpx;
}

.qr-card {
	background-color: #ffffff;
	border-radius: 64rpx;
	overflow: hidden;
	box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.3);
	animation: cardFlip 0.6s ease-out;
}

@keyframes cardFlip {
	0% {
		transform: perspective(1000rpx) rotateY(90deg);
		opacity: 0;
	}
	50% {
		transform: perspective(1000rpx) rotateY(0deg);
		opacity: 1;
	}
}

.qr-card-bg-section {
	position: relative;
	width: 100%;
	aspect-ratio: 4/5;
}

.qr-card-bg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.qr-card-bg-section .qr-card-gradient {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
}

.close-btn {
	position: absolute;
	top: 32rpx;
	right: 32rpx;
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	z-index: 20;
}

.close-btn .iconfont {
	font-size: 40rpx;
	color: #ffffff;
}

.qr-pet-info {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 48rpx;
	color: #ffffff;
	z-index: 10;
}

.qr-pet-name {
	font-size: 72rpx;
	font-weight: 800;
	margin-bottom: 8rpx;
}

.qr-pet-detail {
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 32rpx;
	opacity: 0.9;
}

.qr-code-section {
	background-color: #ffffff;
	padding: 48rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.qr-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1f2937;
	margin-bottom: 32rpx;
}

.qr-code {
	position: relative;
	width: 320rpx;
	height: 320rpx;
	background-color: #ffffff;
	padding: 24rpx;
	border-radius: 24rpx;
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.1);
}

.qr-pattern {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.qr-row {
	display: flex;
	gap: 4rpx;
	flex: 1;
}

.qr-cell {
	flex: 1;
	background-color: #f3f4f6;
	border-radius: 2rpx;
}

.qr-cell.filled {
	background-color: #111418;
}

.scan-line {
	position: absolute;
	top: 24rpx;
	left: 24rpx;
	right: 24rpx;
	height: 4rpx;
	background: linear-gradient(90deg, transparent, #2b8cee, transparent);
	animation: scanLine 2s linear infinite;
}

@keyframes scanLine {
	0% { top: 24rpx; opacity: 0; }
	10% { opacity: 1; }
	90% { opacity: 1; }
	100% { top: 296rpx; opacity: 0; }
}

.bottom-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	border-top: 2rpx solid #f3f4f6;
	padding: 16rpx 48rpx calc(16rpx + env(safe-area-inset-bottom));
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 30;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.02);
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 0;
}

.nav-item .iconfont {
	font-size: 48rpx;
	color: #9ca3af;
}

.nav-item .nav-text {
	font-size: 20rpx;
	color: #9ca3af;
}

.nav-item.active .iconfont,
.nav-item.active .nav-text {
	color: #2b8cee;
	font-weight: bold;
}

.nav-item.center {
	margin-top: -48rpx;
}

.center-btn {
	width: 112rpx;
	height: 112rpx;
	background: linear-gradient(135deg, #2b8cee 0%, #1d4ed8 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 40rpx rgba(43, 140, 238, 0.3);
}

.center-btn .iconfont {
	font-size: 56rpx;
	color: #ffffff;
}
</style>
