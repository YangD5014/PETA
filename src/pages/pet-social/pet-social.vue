<template>
	<view class="pet-social-container">
		<view class="header">
			<text class="header-title">宠物瞬间</text>
			<view class="header-actions">
				<text class="iconfont icon-search" @click="onSearch">&#xe8b6;</text>
				<view class="notification-btn" @click="onNotification">
					<text class="iconfont icon-notifications">&#xe7f4;</text>
					<view class="notification-dot"></view>
				</view>
			</view>
		</view>

		<scroll-view class="main-content" scroll-y>
			<view class="stories-section">
				<view class="stories-header">
					<text class="stories-title">每日故事</text>
					<text class="view-all" @click="viewAllStories">查看全部</text>
				</view>
				<scroll-view class="stories-scroll" scroll-x>
					<view class="stories-list">
						<view class="story-item add-story" @click="addStory">
							<view class="story-avatar-wrap">
								<image class="story-avatar" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_mypet.jpg" mode="aspectFill"></image>
								<view class="add-icon">
									<text class="iconfont">&#xe145;</text>
								</view>
							</view>
							<text class="story-name">我的故事</text>
						</view>
						<view class="story-item" v-for="(story, index) in stories" :key="index" @click="viewStory(story)">
							<view class="story-avatar-wrap" :class="{ 'has-story': story.hasStory, 'viewed': story.viewed }">
								<image class="story-avatar" :src="story.avatar" mode="aspectFill"></image>
							</view>
							<text class="story-name" :class="{ 'viewed': story.viewed }">{{ story.name }}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="posts-section">
				<view class="post-card" v-for="(post, index) in posts" :key="index">
					<view class="post-header">
						<view class="post-author">
							<image class="author-avatar" :src="post.authorAvatar" mode="aspectFill"></image>
							<view class="author-info">
								<text class="author-name">{{ post.authorName }}</text>
								<view class="author-location">
									<text class="iconfont icon-location">&#xe0c8;</text>
									<text class="location-text">{{ post.location }}</text>
								</view>
							</view>
						</view>
						<text class="iconfont icon-edit" @click="editPost(post)">&#xe3c9;</text>
					</view>

					<view class="post-image-wrap">
						<image class="post-image" :src="post.image" mode="aspectFill"></image>
						<view class="activity-badge" v-if="post.activity">
							<view class="badge-icon" :class="post.activity.type">
								<text class="iconfont">{{ post.activity.icon }}</text>
							</view>
							<view class="badge-info">
								<text class="badge-title">{{ post.activity.title }}</text>
								<text class="badge-detail">{{ post.activity.detail }}</text>
							</view>
							<view class="badge-points" :class="post.activity.type">
								{{ post.activity.points }}
							</view>
						</view>
					</view>

					<view class="post-actions">
						<view class="action-left">
							<text class="iconfont action-icon" 
								  :class="{ 'liked': post.isLiked }" 
								  @click="toggleLike(post)">
								{{ post.isLiked ? '&#xe87d;' : '&#xe87e;' }}
							</text>
							<text class="iconfont action-icon" @click="onComment(post)">&#xe0b9;</text>
						</view>
						<text class="iconfont action-icon" @click="sharePost(post)">&#xe80d;</text>
					</view>

					<view class="post-likes" v-if="post.likes > 0">
						<view class="likers-avatars">
							<image v-for="(liker, i) in post.likerAvatars.slice(0, 3)" 
								   :key="i" 
								   class="liker-avatar" 
								   :src="liker" 
								   mode="aspectFill"></image>
						</view>
						<text class="likes-count">{{ formatLikes(post.likes) }}人喜欢</text>
					</view>

					<view class="post-content">
						<text class="author-name-inline">{{ post.authorName }}</text>
						<text class="post-text">{{ post.content }}</text>
					</view>

					<view class="post-comments" v-if="post.comments > 0">
						<text class="view-comments" @click="viewComments(post)">查看全部{{ post.comments }}条评论</text>
					</view>

					<text class="post-time">{{ post.time }}</text>
				</view>
			</view>
		</scroll-view>

		<view class="bottom-nav">
			<view class="nav-item active">
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
			stories: [
				{ name: 'Max', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_max.jpg', hasStory: true, viewed: false },
				{ name: 'Bella', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_bella.jpg', hasStory: true, viewed: false },
				{ name: 'Charlie', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_charlie.jpg', hasStory: true, viewed: false },
				{ name: 'Coco', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_coco.jpg', hasStory: false, viewed: true }
			],
			posts: [
				{
					authorName: '莎拉 & 露娜',
					authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/owner_sarah.jpg',
					location: '旧金山，加州',
					image: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_luna_playing.jpg',
					activity: {
						type: 'running',
						icon: '\ue566',
						title: '刚完成5公里跑步！',
						detail: '配速：5\'30" / 公里 • 心率：120次/分钟',
						points: '+350 pts'
					},
					isLiked: true,
					likes: 2453,
					likerAvatars: ['https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/liker1.jpg', 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/liker2.jpg', 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/liker3.jpg'],
					content: '海滩晨跑绝对是最棒的！🌊 露娜还有很多精力。下次谁想加入我们？🐕',
					comments: 128,
					time: '2小时前'
				},
				{
					authorName: '迈克 & 洛基',
					authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/owner_mike.jpg',
					location: '中央公园，纽约',
					image: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA%20HK@main/src/static/images/pet_rocky_sleeping.jpg',
					activity: {
						type: 'sleeping',
						icon: '\ueb41',
						title: '检测到深度睡眠',
						detail: '时长：2小时15分钟 • 无打鼾',
						points: '休息中'
					},
					isLiked: false,
					likes: 842,
					likerAvatars: [],
					content: '在公园玩了一天后终于累了。看那安详的脸！😴 #午睡时间 #斗牛犬生活',
					comments: 34,
					time: '5小时前'
				}
			]
		}
	},
	methods: {
		onSearch() {
			uni.showToast({ title: '搜索功能', icon: 'none' })
		},
		onNotification() {
			uni.showToast({ title: '通知功能', icon: 'none' })
		},
		addStory() {
			uni.showToast({ title: '添加故事', icon: 'none' })
		},
		viewStory(story) {
			uni.showToast({ title: `查看${story.name}的故事`, icon: 'none' })
		},
		viewAllStories() {
			uni.showToast({ title: '查看全部故事', icon: 'none' })
		},
		editPost(post) {
			uni.showToast({ title: '编辑动态', icon: 'none' })
		},
		toggleLike(post) {
			post.isLiked = !post.isLiked
			post.likes += post.isLiked ? 1 : -1
		},
		onComment(post) {
			uni.showToast({ title: '评论功能', icon: 'none' })
		},
		sharePost(post) {
			uni.showToast({ title: '分享功能', icon: 'none' })
		},
		viewComments(post) {
			uni.showToast({ title: `查看${post.comments}条评论`, icon: 'none' })
		},
		formatLikes(num) {
			if (num >= 1000) {
				return (num / 1000).toFixed(1) + 'k'
			}
			return num.toString()
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

.pet-social-container {
	min-height: 100vh;
	background-color: #f0f4f8;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx 48rpx;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	border-bottom: 2rpx solid #f1f5f9;
}

.header-title {
	font-size: 48rpx;
	font-weight: 800;
	color: #0f172a;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 32rpx;
}

.header-actions .iconfont {
	font-size: 52rpx;
	color: #475569;
}

.notification-btn {
	position: relative;
}

.notification-dot {
	position: absolute;
	top: 0;
	right: 0;
	width: 20rpx;
	height: 20rpx;
	background-color: #ef4444;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
}

.main-content {
	flex: 1;
	padding-bottom: 120rpx;
}

.stories-section {
	padding: 32rpx 0;
	background-color: #f0f4f8;
}

.stories-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding: 0 48rpx;
	margin-bottom: 24rpx;
}

.stories-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.view-all {
	font-size: 24rpx;
	font-weight: 600;
	color: #2b8cee;
}

.stories-scroll {
	white-space: nowrap;
}

.stories-list {
	display: flex;
	gap: 32rpx;
	padding: 0 48rpx;
}

.story-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.story-avatar-wrap {
	position: relative;
	width: 144rpx;
	height: 144rpx;
	border-radius: 50%;
	padding: 6rpx;
}

.story-avatar-wrap.has-story {
	background: linear-gradient(135deg, #fbbf24 0%, #c026d3 100%);
}

.story-avatar-wrap.viewed {
	border: 4rpx solid #e2e8f0;
	background: transparent;
}

.add-story .story-avatar-wrap {
	border: 4rpx dashed #cbd5e1;
}

.story-avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
}

.add-icon {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 48rpx;
	height: 48rpx;
	background-color: #2b8cee;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #ffffff;
}

.add-icon .iconfont {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: bold;
}

.story-name {
	font-size: 24rpx;
	font-weight: 500;
	color: #475569;
}

.story-name.viewed {
	color: #94a3b8;
}

.posts-section {
	padding: 0 32rpx 32rpx;
	display: flex;
	flex-direction: column;
	gap: 48rpx;
}

.post-card {
	background-color: #ffffff;
	border-radius: 64rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.03);
	border: 2rpx solid #f1f5f9;
	overflow: hidden;
}

.post-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
}

.post-author {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.author-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 2rpx solid #f1f5f9;
}

.author-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.author-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
}

.author-location {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.author-location .iconfont {
	font-size: 28rpx;
	color: #94a3b8;
}

.location-text {
	font-size: 24rpx;
	color: #64748b;
}

.icon-edit {
	font-size: 40rpx;
	color: #94a3b8;
}

.post-image-wrap {
	position: relative;
	width: 100%;
	aspect-ratio: 4/5;
	background-color: #f1f5f9;
}

.post-image {
	width: 100%;
	height: 100%;
}

.activity-badge {
	position: absolute;
	bottom: 32rpx;
	left: 32rpx;
	right: 32rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	padding: 24rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	border: 2rpx solid rgba(255, 255, 255, 0.4);
}

.badge-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	flex-shrink: 0;
}

.badge-icon.running {
	background-color: #22c55e;
}

.badge-icon.sleeping {
	background-color: #6366f1;
}

.badge-icon .iconfont {
	font-size: 40rpx;
	color: #ffffff;
}

.badge-info {
	flex: 1;
}

.badge-title {
	font-size: 24rpx;
	font-weight: bold;
	color: #0f172a;
	display: block;
}

.badge-detail {
	font-size: 20rpx;
	color: #64748b;
	display: block;
	margin-top: 4rpx;
}

.badge-points {
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
	font-size: 20rpx;
	font-weight: bold;
	flex-shrink: 0;
}

.badge-points.running {
	background-color: #dcfce7;
	color: #16a34a;
}

.badge-points.sleeping {
	background-color: #e0e7ff;
	color: #4f46e5;
}

.post-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
}

.action-left {
	display: flex;
	align-items: center;
	gap: 40rpx;
}

.action-icon {
	font-size: 56rpx;
	color: #64748b;
}

.action-icon.liked {
	color: #f43f5e;
}

.post-likes {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 0 32rpx 16rpx;
}

.likers-avatars {
	display: flex;
	margin-left: 16rpx;
}

.liker-avatar {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
	margin-left: -16rpx;
}

.likes-count {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
}

.post-content {
	padding: 0 32rpx 16rpx;
}

.author-name-inline {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
	margin-right: 16rpx;
}

.post-text {
	font-size: 28rpx;
	color: #334155;
	line-height: 1.5;
}

.post-comments {
	padding: 0 32rpx 16rpx;
}

.view-comments {
	font-size: 24rpx;
	color: #94a3b8;
	font-weight: 500;
}

.post-time {
	font-size: 20rpx;
	color: #94a3b8;
	padding: 0 32rpx 40rpx;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.bottom-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	border-top: 2rpx solid #f1f5f9;
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
	color: #94a3b8;
}

.nav-item .nav-text {
	font-size: 20rpx;
	color: #94a3b8;
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
