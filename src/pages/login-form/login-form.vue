<template>
	<view class="login-form-container">
		<view class="top-line"></view>

		<view class="back-button" @click="goBack">
			<text class="iconfont icon-arrow-back">&#xe5c4;</text>
			<text class="back-text">Back</text>
		</view>

		<text class="main-heading">Log in</text>
		<text class="sub-heading">Welcome back! We've missed you.</text>

		<view class="form-section">
			<view class="form-group">
				<text class="form-label">Email or Phone Number</text>
				<input
					class="form-input"
					type="text"
					v-model="form.email"
					placeholder="Enter your email or phone"
					placeholder-class="input-placeholder"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">Password</text>
				<input
					class="form-input"
					type="password"
					v-model="form.password"
					placeholder="Enter your password"
					placeholder-class="input-placeholder"
				/>
				<view class="forgot-password" @click="handleForgotPassword">
					<text class="forgot-link">Forgot password?</text>
				</view>
			</view>

			<view class="btn btn-blue" @click="handleLogin">
				<text class="btn-text-white">Log in</text>
			</view>
		</view>

		<view class="divider">
			<view class="divider-line"></view>
			<text class="divider-text">or continue with</text>
			<view class="divider-line"></view>
		</view>

		<view class="social-buttons">
			<view class="social-btn" @click="handleGoogleLogin">
				<text class="iconfont icon-google">&#xe88e;</text>
				<text class="social-btn-text">Continue with Google</text>
			</view>

			<view class="social-btn" @click="handleFacebookLogin">
				<text class="iconfont icon-facebook">&#xe7f5;</text>
				<text class="social-btn-text">Continue with Facebook</text>
			</view>

			<view class="social-btn" @click="handleAppleLogin">
				<text class="iconfont icon-apple">&#xe8a6;</text>
				<text class="social-btn-text">Continue with Apple</text>
			</view>
		</view>

		<view class="footer-text">
			<text class="footer-normal">Don't have an account? </text>
			<text class="footer-link" @click="goToSignup">Sign up</text>
		</view>

		<view class="brand-footer">
			<view class="brand-logo">
				<view class="logo-inner"></view>
			</view>
			<text class="brand-name">PETA</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				email: '',
				password: ''
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goToSignup() {
			uni.navigateTo({
				url: '/pages/signup/signup'
			})
		},
		handleForgotPassword() {
			uni.showToast({
				title: '忘记密码功能开发中',
				icon: 'none'
			})
		},
		handleLogin() {
			if (!this.form.email.trim()) {
				uni.showToast({
					title: '请输入邮箱或手机号',
					icon: 'none'
				})
				return
			}
			if (!this.form.password.trim()) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				})
				return
			}
			uni.showLoading({ title: '登录中...' })
			setTimeout(() => {
				uni.hideLoading()
				uni.reLaunch({
					url: '/pages/pet-card/pet-card'
				})
			}, 1500)
		},
		handleGoogleLogin() {
			uni.showToast({
				title: 'Google 登录功能开发中',
				icon: 'none'
			})
		},
		handleFacebookLogin() {
			uni.showToast({
				title: 'Facebook 登录功能开发中',
				icon: 'none'
			})
		},
		handleAppleLogin() {
			uni.showToast({
				title: 'Apple 登录功能开发中',
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

.login-form-container {
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

.forgot-password {
	text-align: right;
	margin-top: 16rpx;
}

.forgot-link {
	color: #0075eb;
	font-size: 28rpx;
	font-weight: 600;
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

.btn-blue {
	background-color: #0075eb;
}

.btn-text-white {
	color: #ffffff;
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

.brand-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 32rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
}

.brand-logo {
	width: 48rpx;
	height: 48rpx;
	background-color: #10b981;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo-inner {
	width: 24rpx;
	height: 24rpx;
	background-color: #ffffff;
	border-radius: 4rpx;
}

.brand-name {
	font-size: 24rpx;
	font-weight: 700;
	color: #0f172a;
}
</style>
