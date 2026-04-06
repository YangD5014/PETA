<template>
	<view class="signup-container">
		<view class="top-line"></view>

		<view class="back-button" @click="goBack">
			<text class="iconfont icon-arrow-back">&#xe5c4;</text>
			<text class="back-text">Back</text>
		</view>

		<text class="main-heading">创建您的账号</text>
		<text class="sub-heading">加入全球数百万用户</text>

		<view class="form-section">
			<view class="form-group">
				<text class="form-label">全名</text>
				<input
					class="form-input"
					type="text"
					v-model="form.name"
					placeholder="请输入您的全名"
					placeholder-class="input-placeholder"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">邮箱</text>
				<input
					class="form-input"
					type="email"
					v-model="form.email"
					placeholder="请输入邮箱地址"
					placeholder-class="input-placeholder"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">手机号码</text>
				<input
					class="form-input"
					type="tel"
					v-model="form.phone"
					placeholder="+86 138 0000 0000"
					placeholder-class="input-placeholder"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">密码</text>
				<input
					class="form-input"
					type="password"
					v-model="form.password"
					placeholder="请设置强密码"
					placeholder-class="input-placeholder"
				/>
				<view class="password-requirements">
					<view class="requirement" :class="{ met: requirements.length }">
						<text class="iconfont icon-check">&#xe5ca;</text>
						<text class="requirement-text">至少 8 个字符</text>
					</view>
					<view class="requirement" :class="{ met: requirements.number }">
						<text class="iconfont icon-check">&#xe5ca;</text>
						<text class="requirement-text">包含数字</text>
					</view>
					<view class="requirement" :class="{ met: requirements.special }">
						<text class="iconfont icon-check">&#xe5ca;</text>
						<text class="requirement-text">包含特殊字符</text>
					</view>
				</view>
			</view>

			<view class="form-group">
				<text class="form-label">确认密码</text>
				<input
					class="form-input"
					type="password"
					v-model="form.confirmPassword"
					placeholder="请再次输入密码"
					placeholder-class="input-placeholder"
				/>
			</view>

			<view class="btn btn-light-green" @click="handleSignup">
				<text class="btn-text-dark">创建账号</text>
			</view>
		</view>

		<view class="divider">
			<view class="divider-line"></view>
			<text class="divider-text">或使用以下方式注册</text>
			<view class="divider-line"></view>
		</view>

		<view class="social-buttons">
			<view class="social-btn" @click="handleGoogleSignup">
				<text class="iconfont icon-google">&#xe88e;</text>
				<text class="social-btn-text">使用 Google 继续</text>
			</view>

			<view class="social-btn" @click="handleFacebookSignup">
				<text class="iconfont icon-facebook">&#xe7f5;</text>
				<text class="social-btn-text">使用 Facebook 继续</text>
			</view>

			<view class="social-btn" @click="handleAppleSignup">
				<text class="iconfont icon-apple">&#xe8a6;</text>
				<text class="social-btn-text">使用 Apple 继续</text>
			</view>
		</view>

		<view class="terms-text">
			<text class="terms-normal">创建账号即表示您同意我们的 </text>
			<text class="terms-link" @click="openTerms">服务条款</text>
			<text class="terms-normal"> 和 </text>
			<text class="terms-link" @click="openPrivacy">隐私政策</text>
			<text class="terms-normal">。</text>
		</view>

		<view class="footer-text">
			<text class="footer-normal">已有账号？</text>
			<text class="footer-link" @click="goToLogin">立即登录</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				name: '',
				email: '',
				phone: '',
				password: '',
				confirmPassword: ''
			}
		}
	},
	computed: {
		requirements() {
			const password = this.form.password
			return {
				length: password.length >= 8,
				number: /\d/.test(password),
				special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login-form/login-form'
			})
		},
		openTerms() {
			uni.showToast({
				title: '服务条款页面开发中',
				icon: 'none'
			})
		},
		openPrivacy() {
			uni.showToast({
				title: '隐私政策页面开发中',
				icon: 'none'
			})
		},
		handleSignup() {
			if (!this.form.name.trim()) {
				uni.showToast({
					title: '请输入全名',
					icon: 'none'
				})
				return
			}
			if (!this.form.email.trim()) {
				uni.showToast({
					title: '请输入邮箱',
					icon: 'none'
				})
				return
			}
			if (!this.form.phone.trim()) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				})
				return
			}
			if (!this.requirements.length || !this.requirements.number || !this.requirements.special) {
				uni.showToast({
					title: '密码不符合要求',
					icon: 'none'
				})
				return
			}
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}
			uni.showLoading({ title: '注册中...' })
			setTimeout(() => {
				uni.hideLoading()
				uni.reLaunch({
					url: '/pages/pet-card/pet-card'
				})
			}, 1500)
		},
		handleGoogleSignup() {
			uni.showToast({
				title: 'Google 注册功能开发中',
				icon: 'none'
			})
		},
		handleFacebookSignup() {
			uni.showToast({
				title: 'Facebook 注册功能开发中',
				icon: 'none'
			})
		},
		handleAppleSignup() {
			uni.showToast({
				title: 'Apple 注册功能开发中',
				icon: 'none'
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

.signup-container {
	min-height: 100vh;
	background-color: #ffffff;
	padding: 64rpx;
	padding-top: calc(env(safe-area-inset-top) + 64rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 64rpx);
	box-sizing: border-box;
}

.top-line {
	width: 400rpx;
	height: 8rpx;
	background-color: #0075eb;
	border-radius: 4rpx;
	margin-bottom: 64rpx;
}

.back-button {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 64rpx;
	padding: 16rpx 0;
}

.back-button .iconfont {
	font-size: 40rpx;
	color: #0f172a;
}

.back-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #0f172a;
}

.main-heading {
	font-size: 56rpx;
	line-height: 1.2;
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.02em;
	display: block;
	margin-bottom: 16rpx;
}

.sub-heading {
	font-size: 32rpx;
	color: #64748b;
	font-weight: 500;
	display: block;
	margin-bottom: 64rpx;
}

.form-section {
	margin-bottom: 48rpx;
}

.form-group {
	margin-bottom: 48rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #0f172a;
	margin-bottom: 16rpx;
}

.form-input {
	width: 100%;
	padding: 32rpx;
	border: 2rpx solid #e2e8f0;
	border-radius: 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	background-color: #ffffff;
	box-sizing: border-box;
}

.form-input:focus {
	border-color: #0075eb;
	box-shadow: 0 0 0 6rpx rgba(0, 117, 235, 0.1);
}

.input-placeholder {
	color: #94a3b8;
}

.password-requirements {
	background-color: #f8fafc;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-top: 16rpx;
}

.requirement {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.requirement:last-child {
	margin-bottom: 0;
}

.requirement .iconfont {
	font-size: 28rpx;
	color: #64748b;
}

.requirement.met .iconfont {
	color: #10b981;
}

.requirement-text {
	font-size: 24rpx;
	color: #64748b;
}

.requirement.met .requirement-text {
	color: #10b981;
}

.btn {
	width: 100%;
	padding: 32rpx 48rpx;
	border-radius: 24rpx;
	font-weight: 600;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 48rpx;
}

.btn:active {
	transform: scale(0.98);
}

.btn-light-green {
	background-color: #b7e869;
}

.btn-text-dark {
	color: #000000;
	font-weight: 600;
}

.divider {
	display: flex;
	align-items: center;
	margin: 48rpx 0;
}

.divider-line {
	flex: 1;
	height: 2rpx;
	background-color: #e2e8f0;
}

.divider-text {
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #94a3b8;
}

.social-buttons {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.social-btn {
	width: 100%;
	padding: 28rpx 48rpx;
	border: 2rpx solid #e2e8f0;
	border-radius: 24rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
}

.social-btn:active {
	background-color: #f8fafc;
	transform: scale(0.98);
}

.social-btn .iconfont {
	font-size: 36rpx;
	color: #0f172a;
}

.social-btn-text {
	font-size: 30rpx;
	font-weight: 600;
	color: #0f172a;
}

.terms-text {
	font-size: 24rpx;
	color: #94a3b8;
	line-height: 1.5;
	margin-top: 48rpx;
}

.terms-normal {
	color: #94a3b8;
}

.terms-link {
	color: #0075eb;
}

.footer-text {
	text-align: center;
	margin-top: 64rpx;
}

.footer-normal {
	font-size: 28rpx;
	color: #64748b;
}

.footer-link {
	font-size: 28rpx;
	color: #0075eb;
	font-weight: 600;
}
</style>
