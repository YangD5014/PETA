<template>
	<view class="pet-map-container">
		<view class="map-section">
			<image class="map-background" src="/static/images/map_background.jpg" mode="aspectFill"></image>
			<view class="map-overlay"></view>
			
			<view class="map-header">
				<view class="menu-btn" @click="openMenu">
					<text class="iconfont icon-menu">&#xe5d2;</text>
				</view>
				<view class="battery-indicator">
					<text class="battery-text">85%</text>
					<text class="iconfont icon-battery">&#xe1a4;</text>
				</view>
			</view>

			<view class="my-location-marker">
				<view class="marker-avatar-wrap">
					<image class="marker-avatar" src="/static/images/map_overlay.jpg" mode="aspectFill"></image>
				</view>
				<view class="location-icon">
					<text class="iconfont">&#xe55c;</text>
				</view>
			</view>

			<view class="map-controls">
				<view class="control-btn" @click="toggleLayers">
					<text class="iconfont">&#xe53b;</text>
				</view>
				<view class="control-btn primary" @click="locateMe">
					<text class="iconfont">&#xe55c;</text>
				</view>
			</view>
		</view>

		<view class="friends-panel" :class="{ 'collapsed': isPanelCollapsed }" 
			  @touchstart="onTouchStart" 
			  @touchmove="onTouchMove" 
			  @touchend="onTouchEnd">
			<view class="panel-handle" @click="togglePanel">
				<view class="handle-bar" :class="{ 'collapsed': isPanelCollapsed }"></view>
			</view>
			<view class="panel-content">
				<view class="panel-header">
					<text class="panel-title">附近的朋友</text>
					<text class="active-count">8个活跃</text>
				</view>
				<scroll-view class="friends-scroll" scroll-x>
					<view class="friends-list">
						<view class="friend-item" v-for="(friend, index) in nearbyFriends" :key="index" @click="viewFriend(friend)">
							<view class="friend-avatar-wrap">
								<view class="friend-avatar" :class="friend.color">
									<text class="iconfont">&#xe91d;</text>
								</view>
								<view class="status-indicator" :class="friend.status"></view>
							</view>
							<view class="friend-info">
								<text class="friend-name">{{ friend.name }}</text>
								<text class="friend-distance">{{ friend.distance }}</text>
							</view>
						</view>
						<view class="friend-item invite" @click="inviteFriend">
							<view class="invite-btn">
								<text class="iconfont">&#xe145;</text>
							</view>
							<text class="invite-text">邀请</text>
						</view>
					</view>
				</scroll-view>
				<view class="panel-footer">
					<button class="gather-btn" @click="organizeGathering">
						<text class="iconfont">&#xe7f0;</text>
						<text class="btn-text">组织聚会</text>
					</button>
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
			<view class="nav-item active">
				<text class="iconfont icon-map">&#xe55b;</text>
				<text class="nav-text">地图</text>
			</view>
			<view class="nav-item" @click="goToPage('pet-card')">
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
			isPanelCollapsed: false,
			touchStartY: 0,
			touchEndY: 0,
			nearbyFriends: [
				{ name: 'Charlie', distance: '0.1 mi', color: 'orange', status: 'online' },
				{ name: 'Daisy', distance: '0.3 mi', color: 'purple', status: 'online' },
				{ name: 'Max', distance: '0.5 mi', color: 'emerald', status: 'away' },
				{ name: 'Bella', distance: '0.8 mi', color: 'pink', status: 'offline' }
			]
		}
	},
	methods: {
		openMenu() {
			uni.showToast({ title: '打开菜单', icon: 'none' })
		},
		toggleLayers() {
			uni.showToast({ title: '切换图层', icon: 'none' })
		},
		locateMe() {
			uni.showToast({ title: '定位中...', icon: 'none' })
		},
		togglePanel() {
			this.isPanelCollapsed = !this.isPanelCollapsed
		},
		onTouchStart(e) {
			this.touchStartY = e.touches[0].clientY
		},
		onTouchMove(e) {
		},
		onTouchEnd(e) {
			this.touchEndY = e.changedTouches[0].clientY
			const diff = this.touchEndY - this.touchStartY
			if (diff > 50) {
				this.isPanelCollapsed = true
			} else if (diff < -50) {
				this.isPanelCollapsed = false
			}
		},
		viewFriend(friend) {
			uni.showToast({ title: `查看${friend.name}`, icon: 'none' })
		},
		inviteFriend() {
			uni.showToast({ title: '邀请好友', icon: 'none' })
		},
		organizeGathering() {
			uni.showToast({ title: '组织聚会', icon: 'none' })
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

.pet-map-container {
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
}

.map-section {
	position: relative;
	width: 100%;
	height: 65vh;
	overflow: hidden;
}

.map-background {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.map-overlay {
	position: absolute;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.1);
}

.map-header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 40rpx 32rpx;
	z-index: 20;
}

.menu-btn {
	width: 72rpx;
	height: 72rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.menu-btn .iconfont {
	font-size: 40rpx;
	color: #111418;
}

.battery-indicator {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10rpx);
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
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

.my-location-marker {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
}

.marker-avatar-wrap {
	position: relative;
}

.marker-avatar {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	border: 8rpx solid #ffffff;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.location-icon {
	position: absolute;
	bottom: -8rpx;
	right: -8rpx;
	width: 48rpx;
	height: 48rpx;
	background-color: #2b8cee;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #ffffff;
}

.location-icon .iconfont {
	font-size: 28rpx;
	color: #ffffff;
}

.map-controls {
	position: absolute;
	right: 32rpx;
	top: 200rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	z-index: 20;
}

.control-btn {
	width: 80rpx;
	height: 80rpx;
	background-color: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.control-btn .iconfont {
	font-size: 40rpx;
	color: #374151;
}

.control-btn.primary .iconfont {
	color: #2b8cee;
}

.friends-panel {
	flex: 1;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	margin-top: -48rpx;
	position: relative;
	z-index: 10;
	box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.05);
	transition: transform 0.3s ease;
}

.friends-panel.collapsed {
	transform: translateY(60%);
}

.panel-handle {
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 24rpx 0 16rpx;
}

.handle-bar {
	width: 96rpx;
	height: 12rpx;
	background-color: #e5e7eb;
	border-radius: 6rpx;
	transition: all 0.3s ease;
}

.handle-bar.collapsed {
	background-color: #2b8cee;
	width: 64rpx;
}

.panel-content {
	padding: 16rpx 48rpx 32rpx;
	display: flex;
	flex-direction: column;
	height: calc(100% - 52rpx);
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.panel-title {
	font-size: 40rpx;
	font-weight: 800;
	color: #111418;
}

.active-count {
	font-size: 24rpx;
	font-weight: bold;
	color: #2b8cee;
	background-color: #eff6ff;
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
}

.friends-scroll {
	flex: 1;
	white-space: nowrap;
}

.friends-list {
	display: flex;
	gap: 32rpx;
	padding-bottom: 16rpx;
}

.friend-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	min-width: 160rpx;
}

.friend-avatar-wrap {
	position: relative;
}

.friend-avatar {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.friend-avatar.orange {
	background-color: #ffedd5;
	border-color: #fed7aa;
	color: #f97316;
}

.friend-avatar.purple {
	background-color: #f3e8ff;
	border-color: #e9d5ff;
	color: #a855f7;
}

.friend-avatar.emerald {
	background-color: #d1fae5;
	border-color: #a7f3d0;
	color: #10b981;
}

.friend-avatar.pink {
	background-color: #fce7f3;
	border-color: #fbcfe8;
	color: #ec4899;
}

.friend-avatar .iconfont {
	font-size: 60rpx;
}

.status-indicator {
	position: absolute;
	bottom: 8rpx;
	right: 8rpx;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
}

.status-indicator.online {
	background-color: #22c55e;
}

.status-indicator.away {
	background-color: #f59e0b;
}

.status-indicator.offline {
	background-color: #d1d5db;
}

.friend-info {
	text-align: center;
}

.friend-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #111418;
	display: block;
}

.friend-distance {
	font-size: 20rpx;
	color: #6b7280;
}

.friend-item.invite {
	opacity: 0.6;
}

.invite-btn {
	width: 112rpx;
	height: 112rpx;
	border-radius: 50%;
	border: 4rpx dashed #d1d5db;
	display: flex;
	align-items: center;
	justify-content: center;
}

.invite-btn .iconfont {
	font-size: 48rpx;
	color: #9ca3af;
}

.invite-text {
	font-size: 20rpx;
	font-weight: bold;
	color: #9ca3af;
}

.panel-footer {
	margin-top: auto;
	padding-top: 32rpx;
}

.gather-btn {
	width: 100%;
	background: linear-gradient(135deg, #2b8cee 0%, #1d4ed8 100%);
	padding: 32rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	border: none;
	box-shadow: 0 16rpx 40rpx rgba(43, 140, 238, 0.3);
}

.gather-btn:active {
	transform: scale(0.98);
}

.gather-btn .iconfont {
	font-size: 40rpx;
	color: #ffffff;
}

.btn-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;
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
