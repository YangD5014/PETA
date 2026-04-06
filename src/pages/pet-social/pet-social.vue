<template>
	<view class="pet-social-container">
		<view class="safe-area-top"></view>
		<view class="header">
			<text class="header-title">宠物瞬间</text>
			<view class="header-actions">
				<text class="iconfont icon-search" @click="onSearch">&#xe8b6;</text>
				<view class="notification-btn" @click="onNotification">
					<text class="iconfont icon-notifications">&#xe7f4;</text>
					<view class="notification-dot" v-if="unreadNotifications > 0"></view>
				</view>
			</view>
		</view>

		<scroll-view class="main-content" scroll-y @scrolltolower="loadMorePosts">
			<view class="stories-section">
				<view class="stories-header">
					<text class="stories-title">每日故事</text>
					<text class="view-all" @click="viewAllStories">查看全部</text>
				</view>
				<scroll-view class="stories-scroll" scroll-x>
					<view class="stories-list">
						<view class="story-item add-story" @click="addStory">
							<view class="story-avatar-wrap">
								<image class="story-avatar" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_mypet.jpg" mode="aspectFill"></image>
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
				<view class="post-card" v-for="(post, index) in posts" :key="index" @click="openPostDetail(post)">
					<view class="post-header">
						<view class="post-author" @click.stop="visitProfile(post)">
							<image class="author-avatar" :src="post.authorAvatar" mode="aspectFill"></image>
							<view class="author-info">
								<text class="author-name">{{ post.authorName }}</text>
								<view class="author-location">
									<text class="iconfont icon-location">&#xe0c8;</text>
									<text class="location-text">{{ post.location }}</text>
								</view>
							</view>
						</view>
						<text class="iconfont icon-more" @click.stop="showPostOptions(post)">&#xe5d3;</text>
					</view>

					<view class="post-image-wrap" @click.stop="doubleTapLike(post)">
						<image class="post-image" :src="post.image" mode="aspectFill" :lazy-load="true"></image>
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
						<view class="like-animation" v-if="post.showLikeAnimation">
							<text class="iconfont like-anim-icon">&#xe87e;</text>
						</view>
					</view>

					<view class="post-actions">
						<view class="action-left">
							<text class="iconfont action-icon" 
								  :class="{ 'liked': post.isLiked }" 
								  @click.stop="toggleLike(post)">
								{{ post.isLiked ? '&#xe87d;' : '&#xe87e;' }}
							</text>
							<text class="iconfont action-icon" @click.stop="openComments(post)">&#xe0b9;</text>
							<text class="iconfont action-icon" @click.stop="sharePost(post)">&#xe80d;</text>
						</view>
						<text class="iconfont action-icon bookmark-icon" 
							  :class="{ 'bookmarked': post.isBookmarked }"
							  @click.stop="toggleBookmark(post)">
							{{ post.isBookmarked ? '&#xe8ab;' : '&#xe8ac;' }}
						</text>
					</view>

					<view class="post-likes" v-if="post.likes > 0" @click.stop="showLikedBy(post)">
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
						<text class="author-name-inline" @click.stop="visitProfile(post)">{{ post.authorName }}</text>
						<text class="post-text">{{ post.content }}</text>
					</view>

					<view class="post-comments" v-if="post.comments > 0" @click.stop="openComments(post)">
						<text class="view-comments">查看全部{{ post.comments }}条评论</text>
					</view>
					
					<view class="post-recent-comments" v-if="post.recentComments && post.recentComments.length > 0">
						<view class="comment-item" v-for="(comment, cIndex) in post.recentComments" :key="cIndex" @click.stop="replyToComment(post, comment)">
							<text class="comment-author">{{ comment.authorName }}</text>
							<text class="comment-text">{{ comment.text }}</text>
							<text class="comment-time">{{ comment.time }}</text>
						</view>
					</view>

					<text class="post-time">{{ post.time }}</text>
				</view>
				
				<view class="loading-more" v-if="isLoadingMore">
					<text class="loading-text">加载中...</text>
				</view>
				<view class="no-more-posts" v-if="noMorePosts">
					<text class="no-more-text">没有更多动态了</text>
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

		<view class="create-post-btn" @click="openCreatePost">
			<text class="iconfont">&#xe145;</text>
		</view>

		<view class="modal-overlay" v-if="showCreatePostModal" @click="closeCreatePost">
			<view class="create-post-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-cancel" @click="closeCreatePost">取消</text>
					<text class="modal-title">发布动态</text>
					<text class="modal-post" :class="{ 'can-post': canCreatePost }" @click="createPost">发布</text>
				</view>
				<view class="modal-body">
					<view class="post-author-preview">
						<image class="preview-avatar" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_mypet.jpg" mode="aspectFill"></image>
						<view class="preview-info">
							<text class="preview-name">我的宠物</text>
							<view class="preview-location">
								<text class="iconfont icon-location">&#xe0c8;</text>
								<text class="location-input" @click="selectLocation">{{ selectedLocation || '添加位置' }}</text>
							</view>
						</view>
					</view>
					<textarea class="post-content-input" 
							  v-model="newPostContent" 
							  placeholder="分享你家宠物的精彩瞬间..." 
							  maxlength="500"
							  @focus="hideBottomNav"></textarea>
					<view class="content-count">{{ newPostContent.length }}/500</view>
					<view class="post-images-preview" v-if="newPostImages.length > 0">
						<view class="preview-image-item" v-for="(img, idx) in newPostImages" :key="idx">
							<image :src="img" mode="aspectFill"></image>
							<text class="remove-image" @click="removeImage(idx)">&#xe5cd;</text>
						</view>
					</view>
					<view class="activity-section" v-if="currentActivity">
						<view class="activity-label">
							<text class="iconfont">&#xe6b8;</text>
							<text>添加活动</text>
						</view>
						<view class="activity-preview">
							<text class="activity-name">{{ currentActivity.title }}</text>
							<text class="remove-activity" @click="removeActivity">&#xe5cd;</text>
						</view>
					</view>
					<view class="upload-options">
						<view class="upload-option" @click="selectImage">
							<text class="iconfont">&#xe3b8;</text>
							<text>照片</text>
						</view>
						<view class="upload-option" @click="attachActivity">
							<text class="iconfont">&#xe6b8;</text>
							<text>活动</text>
						</view>
						<view class="upload-option" @click="selectLocation">
							<text class="iconfont">&#xe0c8;</text>
							<text>位置</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showCommentsModal" @click="closeComments">
			<view class="comments-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-cancel" @click="closeComments">关闭</text>
					<text class="modal-title">评论</text>
					<view class="header-spacer"></view>
				</view>
				<scroll-view class="comments-list" scroll-y>
					<view class="comment-item-full" v-for="(comment, idx) in currentPostComments" :key="idx">
						<image class="comment-avatar" :src="comment.authorAvatar" mode="aspectFill"></image>
						<view class="comment-content-wrap">
							<view class="comment-header">
								<text class="comment-author-full">{{ comment.authorName }}</text>
								<text class="comment-time-full">{{ comment.time }}</text>
							</view>
							<text class="comment-text-full">{{ comment.text }}</text>
							<view class="comment-actions">
								<text class="reply-btn" @click="replyToComment(null, comment)">回复</text>
								<text class="like-comment-btn" :class="{ 'liked': comment.isLiked }" @click="toggleCommentLike(comment)">
									{{ comment.isLiked ? '&#xe87d;' : '&#xe87e;' }} {{ comment.likes }}
								</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="comment-input-section">
					<textarea class="comment-input" 
							  v-model="commentText" 
							  :placeholder="replyTo ? `回复 @${replyTo.authorName}...` : '添加评论...'" 
							  @focus="commentInputFocused = true"></textarea>
					<text class="send-comment-btn" :class="{ 'can-send': commentText.trim() }" @click="sendComment">发送</text>
				</view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showPostOptionsModal" @click="closePostOptions">
			<view class="options-modal" @click.stop>
				<view class="option-item" @click="reportPost">
					<text class="iconfont option-icon">&#xe8b4;</text>
					<text class="option-text">举报</text>
				</view>
				<view class="option-item" @click="copyLink">
					<text class="iconfont option-icon">&#xe8ac;</text>
					<text class="option-text">复制链接</text>
				</view>
				<view class="option-item" @click="shareToStory">
					<text class="iconfont option-icon">&#xe818;</text>
					<text class="option-text">分享到故事</text>
				</view>
				<view class="option-item" v-if="selectedPostOption && selectedPostOption.authorName === '我的宠物'" @click="deletePost">
					<text class="iconfont option-icon delete-icon">&#xe872;</text>
					<text class="option-text delete-text">删除</text>
				</view>
				<view class="option-cancel" @click="closePostOptions">取消</view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showActivityPicker" @click="closeActivityPicker">
			<view class="activity-picker-modal" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择活动类型</text>
				</view>
				<view class="activity-list">
					<view class="activity-option" v-for="(activity, idx) in availableActivities" :key="idx" @click="pickActivity(activity)">
						<view class="activity-icon-wrap" :class="activity.type">
							<text class="iconfont">{{ activity.icon }}</text>
						</view>
						<view class="activity-details">
							<text class="activity-title">{{ activity.title }}</text>
							<text class="activity-desc">{{ activity.description }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showLocationPicker" @click="closeLocationPicker">
			<view class="location-picker-modal" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择位置</text>
				</view>
				<view class="location-search">
					<input type="text" v-model="locationSearchText" placeholder="搜索位置..." class="search-input"/>
				</view>
				<scroll-view class="location-list" scroll-y>
					<view class="location-item" v-for="(loc, idx) in filteredLocations" :key="idx" @click="pickLocation(loc)">
						<text class="iconfont">&#xe0c8;</text>
						<text class="location-name">{{ loc.name }}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showLikedByModal" @click="closeLikedBy">
			<view class="liked-by-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">点赞的人</text>
					<text class="modal-cancel" @click="closeLikedBy">关闭</text>
				</view>
				<scroll-view class="liked-by-list" scroll-y>
					<view class="liked-by-item" v-for="(liker, idx) in likersList" :key="idx">
						<image class="liker-avatar-full" :src="liker.avatar" mode="aspectFill"></image>
						<view class="liker-info">
							<text class="liker-name">{{ liker.name }}</text>
							<text class="liker-time">{{ liker.time }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="modal-overlay" v-if="showShareModal" @click="closeShareModal">
			<view class="share-modal" @click.stop>
				<view class="share-title">分享到</view>
				<view class="share-platforms">
					<view class="platform-item" @click="shareToWechat">
						<view class="platform-icon wechat">
							<text class="iconfont">&#xe617;</text>
						</view>
						<text class="platform-name">微信</text>
					</view>
					<view class="platform-item" @click="shareToMoments">
						<view class="platform-icon moments">
							<text class="iconfont">&#xe618;</text>
						</view>
						<text class="platform-name">朋友圈</text>
					</view>
					<view class="platform-item" @click="shareToWeibo">
						<view class="platform-icon weibo">
							<text class="iconfont">&#xe619;</text>
						</view>
						<text class="platform-name">微博</text>
					</view>
					<view class="platform-item" @click="copyPostLink">
						<view class="platform-icon link">
							<text class="iconfont">&#xe8ac;</text>
						</view>
						<text class="platform-name">复制链接</text>
					</view>
				</view>
				<view class="share-cancel" @click="closeShareModal">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			stories: [
				{ name: 'Max', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_max.jpg', hasStory: true, viewed: false },
				{ name: 'Bella', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_bella.jpg', hasStory: true, viewed: false },
				{ name: 'Charlie', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_charlie.jpg', hasStory: true, viewed: false },
				{ name: 'Coco', avatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_coco.jpg', hasStory: false, viewed: true }
			],
			posts: [
				{
					id: 1,
					authorName: '莎拉 & 露娜',
					authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/owner_sarah.jpg',
					location: '旧金山，加州',
					image: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_luna_playing.jpg',
					activity: {
						type: 'running',
						icon: '\ue566',
						title: '刚完成5公里跑步！',
						detail: '配速：5\'30" / 公里 • 心率：120次/分钟',
						points: '+350 pts'
					},
					isLiked: true,
					isBookmarked: false,
					likes: 2453,
					likerAvatars: ['https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/liker1.jpg', 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/liker2.jpg', 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/liker3.jpg'],
					content: '海滩晨跑绝对是最棒的！🌊 露娜还有很多精力。下次谁想加入我们？🐕',
					comments: 128,
					recentComments: [
						{ authorName: '迈克', text: '太可爱了！', time: '30分钟前', isLiked: false, likes: 5, authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/owner_mike.jpg' },
						{ authorName: 'coco主人', text: '下次带上我家coco！', time: '45分钟前', isLiked: true, likes: 3, authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_coco.jpg' }
					],
					time: '2小时前',
					showLikeAnimation: false,
					isOwner: false
				},
				{
					id: 2,
					authorName: '迈克 & 洛基',
					authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/owner_mike.jpg',
					location: '中央公园，纽约',
					image: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_rocky_sleeping.jpg',
					activity: {
						type: 'sleeping',
						icon: '\ueb41',
						title: '检测到深度睡眠',
						detail: '时长：2小时15分钟 • 无打鼾',
						points: '休息中'
					},
					isLiked: false,
					isBookmarked: true,
					likes: 842,
					likerAvatars: [],
					content: '在公园玩了一天后终于累了。看那安详的脸！😴 #午睡时间 #斗牛犬生活',
					comments: 34,
					recentComments: [
						{ authorName: '莎拉', text: '睡得好香啊', time: '1小时前', isLiked: false, likes: 12, authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/owner_sarah.jpg' }
					],
					time: '5小时前',
					showLikeAnimation: false,
					isOwner: false
				}
			],
			unreadNotifications: 1,
			isLoadingMore: false,
			noMorePosts: false,
			lastTapTime: 0,
			
			showCreatePostModal: false,
			newPostContent: '',
			newPostImages: [],
			currentActivity: null,
			selectedLocation: '',
			canPost: false,
			
			showCommentsModal: false,
			currentPostComments: [],
			commentText: '',
			replyTo: null,
			commentInputFocused: false,
			
			showPostOptionsModal: false,
			selectedPostOption: null,
			
			showActivityPicker: false,
			availableActivities: [
				{ type: 'running', icon: '\ue566', title: '跑步', description: '记录宠物跑步活动' },
				{ type: 'sleeping', icon: '\ueb41', title: '睡眠', description: '记录宠物睡眠质量' },
				{ type: 'walking', icon: '\ue534', title: '散步', description: '记录宠物散步轨迹' },
				{ type: 'eating', icon: '\ue56c', title: '进食', description: '记录宠物用餐情况' },
				{ type: 'playing', icon: '\ue566', title: '玩耍', description: '记录宠物玩耍时光' }
			],
			
			showLocationPicker: false,
			locationSearchText: '',
			availableLocations: [
				{ name: '旧金山，加州' },
				{ name: '中央公园，纽约' },
				{ name: '上海外滩' },
				{ name: '北京故宫' },
				{ name: '杭州西湖' },
				{ name: '成都熊猫基地' }
			],
			
			showLikedByModal: false,
			likersList: [],
			
			showShareModal: false,
			currentSharePost: null
		}
	},
	computed: {
		filteredLocations() {
			if (!this.locationSearchText) return this.availableLocations
			return this.availableLocations.filter(loc => 
				loc.name.toLowerCase().includes(this.locationSearchText.toLowerCase())
			)
		}
	},
	watch: {
		newPostContent(val) {
			this.canPost = val.trim().length > 0 || this.newPostImages.length > 0
		},
		newPostImages(val) {
			this.canPost = this.newPostContent.trim().length > 0 || val.length > 0
		}
	},
	methods: {
		onSearch() {
			uni.showToast({ title: '搜索功能开发中', icon: 'none' })
		},
		onNotification() {
			this.unreadNotifications = 0
			uni.showToast({ title: '通知中心', icon: 'none' })
		},
		addStory() {
			uni.showToast({ title: '添加故事功能开发中', icon: 'none' })
		},
		viewStory(story) {
			story.viewed = true
			uni.showToast({ title: `查看${story.name}的故事`, icon: 'none' })
		},
		viewAllStories() {
			uni.showToast({ title: '查看全部故事', icon: 'none' })
		},
		
		openCreatePost() {
			this.showCreatePostModal = true
			this.newPostContent = ''
			this.newPostImages = []
			this.currentActivity = null
			this.selectedLocation = ''
		},
		closeCreatePost() {
			this.showCreatePostModal = false
		},
		selectImage() {
			uni.chooseImage({
				count: 9 - this.newPostImages.length,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.newPostImages = [...this.newPostImages, ...res.tempFilePaths]
				}
			})
		},
		removeImage(idx) {
			this.newPostImages.splice(idx, 1)
		},
		selectLocation() {
			this.showLocationPicker = true
		},
		pickLocation(loc) {
			this.selectedLocation = loc.name
			this.closeLocationPicker()
		},
		closeLocationPicker() {
			this.showLocationPicker = false
			this.locationSearchText = ''
		},
		attachActivity() {
			this.showActivityPicker = true
		},
		pickActivity(activity) {
			this.currentActivity = {
				type: activity.type,
				icon: activity.icon,
				title: activity.title + '完成！',
				detail: '刚刚 • 通过PETA记录',
				points: activity.type === 'running' ? '+100 pts' : (activity.type === 'sleeping' ? '休息中' : '+50 pts')
			}
			this.closeActivityPicker()
		},
		closeActivityPicker() {
			this.showActivityPicker = false
		},
		removeActivity() {
			this.currentActivity = null
		},
		createPost() {
			if (!this.canPost) return
			
			const newPost = {
				id: Date.now(),
				authorName: '我的宠物',
				authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_mypet.jpg',
				location: this.selectedLocation || '未知位置',
				image: this.newPostImages[0] || 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_mypet.jpg',
				activity: this.currentActivity,
				isLiked: false,
				isBookmarked: false,
				likes: 0,
				likerAvatars: [],
				content: this.newPostContent,
				comments: 0,
				recentComments: [],
				time: '刚刚',
				showLikeAnimation: false,
				isOwner: true
			}
			
			this.posts.unshift(newPost)
			this.closeCreatePost()
			uni.showToast({ title: '发布成功！', icon: 'success' })
		},
		
		openComments(post) {
			this.currentPost = post
			this.showCommentsModal = true
			this.commentText = ''
			this.replyTo = null
			
			if (!post.allComments) {
				post.allComments = post.recentComments ? [...post.recentComments] : []
			}
			this.currentPostComments = post.allComments
		},
		closeComments() {
			this.showCommentsModal = false
			this.commentText = ''
			this.replyTo = null
		},
		sendComment() {
			if (!this.commentText.trim()) return
			
			const newComment = {
				authorName: '我的宠物',
				authorAvatar: 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/images/pet_mypet.jpg',
				text: this.replyTo ? `回复 @${this.replyTo.authorName}：${this.commentText}` : this.commentText,
				time: '刚刚',
				isLiked: false,
				likes: 0
			}
			
			if (!this.currentPost.allComments) {
				this.currentPost.allComments = []
			}
			this.currentPost.allComments.unshift(newComment)
			this.currentPost.comments++
			
			if (!this.currentPost.recentComments) {
				this.currentPost.recentComments = []
			}
			this.currentPost.recentComments.unshift(newComment)
			
			this.commentText = ''
			this.replyTo = null
			uni.showToast({ title: '评论成功', icon: 'none' })
		},
		replyToComment(post, comment) {
			this.replyTo = comment
			this.showCommentsModal = true
		},
		toggleCommentLike(comment) {
			comment.isLiked = !comment.isLiked
			comment.likes += comment.isLiked ? 1 : -1
		},
		
		toggleLike(post) {
			post.isLiked = !post.isLiked
			post.likes += post.isLiked ? 1 : -1
			
			if (post.isLiked) {
				uni.vibrateShort()
			}
		},
		doubleTapLike(post) {
			const now = Date.now()
			if (now - this.lastTapTime < 300) {
				if (!post.isLiked) {
					post.isLiked = true
					post.likes++
					post.showLikeAnimation = true
					uni.vibrateShort()
					setTimeout(() => {
						post.showLikeAnimation = false
					}, 1000)
				}
			}
			this.lastTapTime = now
		},
		toggleBookmark(post) {
			post.isBookmarked = !post.isBookmarked
			uni.showToast({ 
				title: post.isBookmarked ? '已收藏' : '已取消收藏', 
				icon: 'none' 
			})
		},
		
		showPostOptions(post) {
			this.selectedPostOption = post
			this.showPostOptionsModal = true
		},
		closePostOptions() {
			this.showPostOptionsModal = false
			this.selectedPostOption = null
		},
		reportPost() {
			uni.showToast({ title: '举报成功，我们会尽快处理', icon: 'none' })
			this.closePostOptions()
		},
		copyLink() {
			uni.setClipboardData({
				data: 'https://peta.app/post/' + this.selectedPostOption.id,
				success: () => uni.showToast({ title: '链接已复制', icon: 'none' })
			})
			this.closePostOptions()
		},
		shareToStory() {
			uni.showToast({ title: '分享到故事功能开发中', icon: 'none' })
			this.closePostOptions()
		},
		deletePost() {
			uni.showModal({
				title: '删除动态',
				content: '确定要删除这条动态吗？',
				success: (res) => {
					if (res.confirm) {
						const idx = this.posts.findIndex(p => p.id === this.selectedPostOption.id)
						if (idx !== -1) {
							this.posts.splice(idx, 1)
						}
						uni.showToast({ title: '已删除', icon: 'success' })
					}
					this.closePostOptions()
				}
			})
		},
		
		showLikedBy(post) {
			this.likersList = post.likerAvatars.map((avatar, idx) => ({
				avatar,
				name: ['用户' + (idx + 1), '宠物爱好者', '爱狗人士'][idx % 3],
				time: idx === 0 ? '1分钟前' : (idx + 1) * 5 + '分钟前'
			}))
			this.showLikedByModal = true
		},
		closeLikedBy() {
			this.showLikedByModal = false
			this.likersList = []
		},
		
		sharePost(post) {
			this.currentSharePost = post
			this.showShareModal = true
		},
		closeShareModal() {
			this.showShareModal = false
			this.currentSharePost = null
		},
		shareToWechat() {
			uni.showToast({ title: '分享到微信开发中', icon: 'none' })
			this.closeShareModal()
		},
		shareToMoments() {
			uni.showToast({ title: '分享到朋友圈开发中', icon: 'none' })
			this.closeShareModal()
		},
		shareToWeibo() {
			uni.showToast({ title: '分享到微博开发中', icon: 'none' })
			this.closeShareModal()
		},
		copyPostLink() {
			uni.setClipboardData({
				data: 'https://peta.app/post/' + this.currentSharePost.id,
				success: () => uni.showToast({ title: '链接已复制', icon: 'none' })
			})
			this.closeShareModal()
		},
		
		openPostDetail(post) {
			uni.showToast({ title: '帖子详情开发中', icon: 'none' })
		},
		visitProfile(post) {
			uni.showToast({ title: `访问 ${post.authorName} 的主页`, icon: 'none' })
		},
		
		loadMorePosts() {
			if (this.isLoadingMore || this.noMorePosts) return
			
			this.isLoadingMore = true
			setTimeout(() => {
				uni.showToast({ title: '没有更多动态了', icon: 'none' })
				this.noMorePosts = true
				this.isLoadingMore = false
			}, 1000)
		},
		
		formatLikes(num) {
			if (num >= 1000000) {
				return (num / 1000000).toFixed(1) + 'M'
			}
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
		},
		hideBottomNav() {
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
	position: sticky;
	top: 0;
	z-index: 20;
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
	padding-bottom: 180rpx;
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

.icon-more {
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
	transition: transform 0.2s, color 0.2s;
}

.action-icon.liked {
	color: #f43f5e;
	animation: heartBeat 0.3s ease;
}

.action-icon:active {
	transform: scale(1.2);
}

.bookmark-icon {
	font-size: 48rpx;
}

.bookmark-icon.bookmarked {
	color: #f59e0b;
}

@keyframes heartBeat {
	0% { transform: scale(1); }
	50% { transform: scale(1.3); }
	100% { transform: scale(1); }
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
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
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

.post-recent-comments {
	padding: 0 32rpx 16rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.comment-item {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
}

.comment-author {
	font-size: 26rpx;
	font-weight: 600;
	color: #0f172a;
}

.comment-text {
	font-size: 26rpx;
	color: #334155;
	flex: 1;
}

.comment-time {
	font-size: 20rpx;
	color: #94a3b8;
}

.post-time {
	font-size: 20rpx;
	color: #94a3b8;
	padding: 0 32rpx 40rpx;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.loading-more, .no-more-posts {
	padding: 32rpx;
	text-align: center;
}

.loading-text, .no-more-text {
	font-size: 24rpx;
	color: #94a3b8;
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

.create-post-btn {
	position: fixed;
	bottom: 180rpx;
	right: 32rpx;
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #2b8cee 0%, #6366f1 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 32rpx rgba(43, 140, 238, 0.4);
	z-index: 25;
}

.create-post-btn .iconfont {
	font-size: 56rpx;
	color: #ffffff;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.create-post-modal {
	width: 100%;
	max-height: 90vh;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	border-bottom: 2rpx solid #f1f5f9;
}

.modal-cancel {
	font-size: 28rpx;
	color: #64748b;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #0f172a;
}

.modal-post {
	font-size: 28rpx;
	font-weight: bold;
	color: #94a3b8;
}

.modal-post.can-post {
	color: #2b8cee;
}

.header-spacer {
	width: 100rpx;
}

.modal-body {
	flex: 1;
	padding: 32rpx;
	overflow-y: auto;
}

.post-author-preview {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.preview-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}

.preview-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.preview-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
}

.preview-location {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.preview-location .iconfont {
	font-size: 28rpx;
	color: #94a3b8;
}

.location-input {
	font-size: 24rpx;
	color: #64748b;
}

.post-content-input {
	width: 100%;
	min-height: 200rpx;
	font-size: 28rpx;
	color: #0f172a;
	line-height: 1.6;
	border: none;
	outline: none;
	resize: none;
}

.post-content-input::placeholder {
	color: #94a3b8;
}

.content-count {
	text-align: right;
	font-size: 20rpx;
	color: #94a3b8;
	margin-top: 16rpx;
}

.post-images-preview {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-top: 24rpx;
}

.preview-image-item {
	position: relative;
	width: 200rpx;
	height: 200rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.preview-image-item image {
	width: 100%;
	height: 100%;
}

.remove-image {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	width: 40rpx;
	height: 40rpx;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 24rpx;
}

.activity-section {
	margin-top: 24rpx;
	padding: 24rpx;
	background-color: #f8fafc;
	border-radius: 16rpx;
}

.activity-label {
	display: flex;
	align-items: center;
	gap: 12rpx;
	color: #64748b;
	font-size: 24rpx;
	margin-bottom: 16rpx;
}

.activity-label .iconfont {
	font-size: 32rpx;
}

.activity-preview {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.activity-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #0f172a;
}

.remove-activity {
	font-size: 32rpx;
	color: #94a3b8;
}

.upload-options {
	display: flex;
	gap: 48rpx;
	margin-top: 32rpx;
	padding-top: 32rpx;
	border-top: 2rpx solid #f1f5f9;
}

.upload-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.upload-option .iconfont {
	font-size: 56rpx;
	color: #2b8cee;
}

.upload-option text:last-child {
	font-size: 22rpx;
	color: #64748b;
}

.comments-modal {
	width: 100%;
	max-height: 85vh;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	display: flex;
	flex-direction: column;
}

.comments-list {
	flex: 1;
	padding: 32rpx;
}

.comment-item-full {
	display: flex;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.comment-avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	flex-shrink: 0;
}

.comment-content-wrap {
	flex: 1;
}

.comment-header {
	display: flex;
	align-items: baseline;
	gap: 16rpx;
	margin-bottom: 8rpx;
}

.comment-author-full {
	font-size: 26rpx;
	font-weight: bold;
	color: #0f172a;
}

.comment-time-full {
	font-size: 20rpx;
	color: #94a3b8;
}

.comment-text-full {
	font-size: 26rpx;
	color: #334155;
	line-height: 1.5;
	display: block;
}

.comment-actions {
	display: flex;
	align-items: center;
	gap: 32rpx;
	margin-top: 12rpx;
}

.reply-btn {
	font-size: 22rpx;
	color: #94a3b8;
	font-weight: 500;
}

.like-comment-btn {
	font-size: 22rpx;
	color: #94a3b8;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.like-comment-btn.liked {
	color: #f43f5e;
}

.comment-input-section {
	display: flex;
	align-items: flex-end;
	gap: 24rpx;
	padding: 24rpx 32rpx;
	border-top: 2rpx solid #f1f5f9;
}

.comment-input {
	flex: 1;
	min-height: 72rpx;
	max-height: 200rpx;
	font-size: 26rpx;
	color: #0f172a;
	border: none;
	outline: none;
	resize: none;
	background-color: #f8fafc;
	border-radius: 36rpx;
	padding: 20rpx 28rpx;
}

.comment-input::placeholder {
	color: #94a3b8;
}

.send-comment-btn {
	font-size: 28rpx;
	font-weight: bold;
	color: #94a3b8;
	padding: 16rpx;
}

.send-comment-btn.can-send {
	color: #2b8cee;
}

.options-modal {
	width: 100%;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
}

.option-item {
	display: flex;
	align-items: center;
	gap: 32rpx;
	padding: 36rpx 48rpx;
	border-bottom: 2rpx solid #f1f5f9;
}

.option-icon {
	font-size: 48rpx;
	color: #0f172a;
}

.option-text {
	font-size: 28rpx;
	color: #0f172a;
}

.delete-icon, .delete-text {
	color: #ef4444;
}

.option-cancel {
	padding: 36rpx;
	text-align: center;
	font-size: 28rpx;
	color: #64748b;
	font-weight: 500;
	margin-top: 16rpx;
}

.activity-picker-modal, .location-picker-modal {
	width: 100%;
	max-height: 70vh;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	overflow: hidden;
}

.picker-header {
	padding: 32rpx;
	text-align: center;
	border-bottom: 2rpx solid #f1f5f9;
}

.picker-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #0f172a;
}

.activity-list {
	padding: 24rpx 32rpx;
}

.activity-option {
	display: flex;
	align-items: center;
	gap: 32rpx;
	padding: 24rpx;
	border-radius: 24rpx;
	transition: background-color 0.2s;
}

.activity-option:active {
	background-color: #f8fafc;
}

.activity-icon-wrap {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.activity-icon-wrap.running { background-color: #22c55e; }
.activity-icon-wrap.sleeping { background-color: #6366f1; }
.activity-icon-wrap.walking { background-color: #3b82f6; }
.activity-icon-wrap.eating { background-color: #f59e0b; }
.activity-icon-wrap.playing { background-color: #ec4899; }

.activity-icon-wrap .iconfont {
	font-size: 48rpx;
	color: #ffffff;
}

.activity-details {
	flex: 1;
}

.activity-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
	display: block;
}

.activity-desc {
	font-size: 22rpx;
	color: #64748b;
	margin-top: 4rpx;
	display: block;
}

.location-search {
	padding: 24rpx 32rpx;
	border-bottom: 2rpx solid #f1f5f9;
}

.search-input {
	width: 100%;
	height: 72rpx;
	background-color: #f8fafc;
	border-radius: 36rpx;
	padding: 0 28rpx;
	font-size: 26rpx;
	color: #0f172a;
	border: none;
	outline: none;
}

.search-input::placeholder {
	color: #94a3b8;
}

.location-list {
	max-height: 400rpx;
	padding: 16rpx 32rpx;
}

.location-item {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 24rpx 0;
	border-bottom: 2rpx solid #f1f5f9;
}

.location-item .iconfont {
	font-size: 40rpx;
	color: #94a3b8;
}

.location-name {
	font-size: 28rpx;
	color: #0f172a;
}

.liked-by-modal {
	width: 100%;
	max-height: 70vh;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	display: flex;
	flex-direction: column;
}

.liked-by-list {
	flex: 1;
	padding: 24rpx 32rpx;
}

.liked-by-item {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 20rpx 0;
}

.liker-avatar-full {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}

.liker-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.liker-name {
	font-size: 26rpx;
	font-weight: bold;
	color: #0f172a;
}

.liker-time {
	font-size: 20rpx;
	color: #94a3b8;
}

.share-modal {
	width: 100%;
	background-color: #ffffff;
	border-radius: 48rpx 48rpx 0 0;
	padding: 32rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.share-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #0f172a;
	text-align: center;
	margin-bottom: 48rpx;
}

.share-platforms {
	display: flex;
	justify-content: center;
	gap: 64rpx;
	margin-bottom: 48rpx;
}

.platform-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.platform-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.platform-icon .iconfont {
	font-size: 48rpx;
	color: #ffffff;
}

.platform-icon.wechat { background-color: #07c160; }
.platform-icon.moments { background-color: #07c160; }
.platform-icon.weibo { background-color: #ff8200; }
.platform-icon.link { background-color: #64748b; }

.platform-name {
	font-size: 22rpx;
	color: #64748b;
}

.share-cancel {
	text-align: center;
	font-size: 28rpx;
	color: #64748b;
	font-weight: 500;
	padding: 24rpx;
	border-top: 2rpx solid #f1f5f9;
}

.like-animation {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
}

.like-anim-icon {
	font-size: 160rpx;
	color: #ffffff;
	text-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
	animation: likeAnim 1s ease-out forwards;
}

@keyframes likeAnim {
	0% {
		opacity: 0;
		transform: scale(0.3);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
	100% {
		opacity: 0;
		transform: scale(1.5);
	}
}
</style>
