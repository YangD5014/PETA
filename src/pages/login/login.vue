<template>
	<view class="login-container">
		<view class="safe-area-top"></view>
		<view class="login-content">
			<view class="logo-section">
				<view class="logo-wrapper">
					<image class="logo" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/logo.png" mode="aspectFit"></image>
				</view>
				<view class="brand-info">
					<text class="brand-name">PETA</text>
					<text class="brand-slogan">宠物智能生活</text>
				</view>
			</view>

			<view class="welcome-section">
				<text class="welcome-title">欢迎回来</text>
				<text class="welcome-desc">登录后开始探索精彩的宠物世界</text>
			</view>

			<view class="login-actions">
				<button class="wechat-login-btn" @click="handleWechatLogin" :loading="isLoading">
					<view class="btn-content" v-if="!isLoading">
						<image class="wechat-icon" src="https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/icons/wechat-icon.svg" mode="aspectFit"></image>
						<text class="btn-text">微信一键登录</text>
					</view>
					<view class="btn-loading" v-else>
						<view class="loading-spinner"></view>
						<text class="loading-text">登录中...</text>
					</view>
				</button>

				<view class="divider">
					<view class="divider-line"></view>
					<text class="divider-text">其他方式</text>
					<view class="divider-line"></view>
				</view>

				<view class="alternative-actions">
					<view class="alt-btn" @click="handlePhoneLogin">
						<text class="iconfont icon-phone">&#xe0b0;</text>
						<text class="alt-btn-text">手机号登录</text>
					</view>
					<view class="alt-btn" @click="toggleAccountLogin">
						<text class="iconfont icon-account">&#xe7fd;</text>
						<text class="alt-btn-text">账号密码登录</text>
					</view>
					<view class="alt-btn" @click="handleGuestLogin">
						<text class="iconfont icon-guest">&#xe7fd;</text>
						<text class="alt-btn-text">游客登录</text>
					</view>
				</view>

				<view class="account-login-form" v-if="showAccountLogin">
					<view class="form-item">
						<view class="input-wrapper">
							<text class="iconfont icon-user">&#xe7fd;</text>
							<input class="form-input" type="text" v-model="accountForm.username" placeholder="请输入账号" placeholder-class="input-placeholder" />
						</view>
					</view>
					<view class="form-item">
						<view class="input-wrapper">
							<text class="iconfont icon-lock">&#xe897;</text>
							<input class="form-input" type="password" v-model="accountForm.password" placeholder="请输入密码" placeholder-class="input-placeholder" />
						</view>
					</view>
					<button class="account-login-btn" @click="handleAccountLogin" :loading="isAccountLoading">
						<text v-if="!isAccountLoading">账号登录</text>
						<view class="btn-loading" v-else>
							<view class="loading-spinner"></view>
							<text class="loading-text">登录中...</text>
						</view>
					</button>
				</view>
			</view>

			<view class="agreement-section">
				<view class="agreement-check" @click="toggleAgreement">
					<view class="checkbox" :class="{ checked: agreedToTerms }">
						<text class="iconfont icon-check" v-if="agreedToTerms">&#xe5ca;</text>
					</view>
				</view>
				<view class="agreement-text">
					<text class="text">我已阅读并同意</text>
					<text class="link" @click.stop="openUserAgreement">《用户服务协议》</text>
					<text class="text">和</text>
					<text class="link" @click.stop="openPrivacyPolicy">《隐私政策》</text>
				</view>
			</view>
		</view>

		<view class="decoration-circles">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>

		<view class="error-toast" v-if="errorMsg">
			<view class="toast-content">
				<text class="iconfont icon-error">&#xe8b3;</text>
				<text class="toast-text">{{ errorMsg }}</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const isLoading = ref(false)
const agreedToTerms = ref(false)
const errorMsg = ref('')
const showAccountLogin = ref(false)
const isAccountLoading = ref(false)

const accountForm = reactive({
	username: '',
	password: ''
})

function toggleAgreement() {
	agreedToTerms.value = !agreedToTerms.value
}

function showError(msg: string) {
	errorMsg.value = msg
	setTimeout(() => {
		errorMsg.value = ''
	}, 3000)
}

function toggleAccountLogin() {
	showAccountLogin.value = !showAccountLogin.value
}

function openUserAgreement() {
	uni.navigateTo({ url: '/pages/agreement/user-agreement' })
}

function openPrivacyPolicy() {
	uni.navigateTo({ url: '/pages/agreement/privacy-policy' })
}

async function handleWechatLogin() {
	if (!agreedToTerms.value) {
		showError('请先阅读并同意用户协议和隐私政策')
		return
	}

	isLoading.value = true

	try {
		// #ifdef MP-WEIXIN
		const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: resolve,
				fail: reject
			})
		})

		if (loginRes.code) {
			await requestLoginByWechat(loginRes.code)
		} else {
			throw new Error('微信登录失败，未获取到授权码')
		}
		// #endif
		// #ifndef MP-WEIXIN
		await new Promise(resolve => setTimeout(resolve, 1500))
		uni.showToast({
			title: '请在微信小程序中使用',
			icon: 'none'
		})
		// #endif
	} catch (error: any) {
		console.error('WeChat login error:', error)
		showError(error.message || '登录失败，请重试')
	} finally {
		isLoading.value = false
	}
}

async function requestLoginByWechat(code: string) {
	uni.showLoading({ title: '正在登录...' })

	try {
		uni.setStorageSync('wechat_code', code)

		uni.showToast({
			title: '登录成功',
			icon: 'success'
		})

		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/pet-card/pet-card'
			})
		}, 1000)
	} catch (error) {
		throw new Error('登录请求失败')
	} finally {
		uni.hideLoading()
	}
}

async function handleAccountLogin() {
	if (!agreedToTerms.value) {
		showError('请先阅读并同意用户协议和隐私政策')
		return
	}

	if (!accountForm.username.trim()) {
		showError('请输入账号')
		return
	}

	if (!accountForm.password.trim()) {
		showError('请输入密码')
		return
	}

	isAccountLoading.value = true

	try {
		uni.showLoading({ title: '正在登录...' })

		await new Promise(resolve => setTimeout(resolve, 1500))

		uni.setStorageSync('account_username', accountForm.username)
		uni.setStorageSync('login_type', 'account')

		uni.showToast({
			title: '登录成功',
			icon: 'success'
		})

		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/pet-card/pet-card'
			})
		}, 1000)
	} catch (error: any) {
		console.error('Account login error:', error)
		showError(error.message || '登录失败，请重试')
	} finally {
		uni.hideLoading()
		isAccountLoading.value = false
	}
}

async function handleGuestLogin() {
	if (!agreedToTerms.value) {
		showError('请先阅读并同意用户协议和隐私政策')
		return
	}

	try {
		uni.showModal({
			title: '游客登录提示',
			content: '游客登录将无法保存您的数据，是否继续？',
			success: async (res) => {
				if (res.confirm) {
					uni.showLoading({ title: '正在登录...' })

					try {
						await new Promise(resolve => setTimeout(resolve, 1000))

						uni.setStorageSync('login_type', 'guest')
						uni.setStorageSync('guest_id', Date.now().toString())

						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})

						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/pet-card/pet-card'
							})
						}, 1000)
					} catch (error: any) {
						console.error('Guest login error:', error)
						showError(error.message || '登录失败，请重试')
					} finally {
						uni.hideLoading()
					}
				}
			}
		})
	} catch (error: any) {
		console.error('Guest login error:', error)
		showError(error.message || '登录失败，请重试')
	}
}

function handlePhoneLogin() {
	uni.navigateTo({
		url: '/pages/login/phone-login'
	})
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
	min-height: 100vh;
	background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
}

.login-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 120rpx 60rpx 60rpx;
	position: relative;
	z-index: 10;
	width: 100%;
	box-sizing: border-box;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;
}

.logo-wrapper {
	width: 160rpx;
	height: 160rpx;
	background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 20rpx 60rpx rgba(43, 140, 238, 0.15);
	margin-bottom: 32rpx;
}

.logo {
	width: 100rpx;
	height: 100rpx;
}

.brand-info {
	text-align: center;
}

.brand-name {
	font-size: 56rpx;
	font-weight: 800;
	color: #111418;
	letter-spacing: 8rpx;
	display: block;
}

.brand-slogan {
	font-size: 28rpx;
	color: #6b7280;
	margin-top: 8rpx;
}

.welcome-section {
	text-align: center;
	margin-bottom: 80rpx;
}

.welcome-title {
	font-size: 48rpx;
	font-weight: 700;
	color: #111418;
	display: block;
	margin-bottom: 16rpx;
}

.welcome-desc {
	font-size: 28rpx;
	color: #6b7280;
}

.login-actions {
	margin-bottom: 48rpx;
	width: 100%;
}

.wechat-login-btn {
	width: 100%;
	height: 112rpx;
	background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
	border-radius: 56rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 40rpx rgba(7, 193, 96, 0.25);
}

.wechat-login-btn:active {
	transform: scale(0.98);
	box-shadow: 0 12rpx 32rpx rgba(7, 193, 96, 0.2);
}

.btn-content {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.wechat-icon {
	width: 48rpx;
	height: 48rpx;
}

.btn-text {
	font-size: 36rpx;
	font-weight: 600;
	color: #ffffff;
}

.btn-loading {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.loading-spinner {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
	border-top-color: #ffffff;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.loading-text {
	font-size: 32rpx;
	color: #ffffff;
}

.divider {
	display: flex;
	align-items: center;
	margin: 48rpx 0;
}

.divider-line {
	flex: 1;
	height: 2rpx;
	background-color: #e5e7eb;
}

.divider-text {
	padding: 0 32rpx;
	font-size: 24rpx;
	color: #9ca3af;
}

.alternative-actions {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	width: 100%;
}

.alt-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 24rpx 32rpx;
	background-color: #ffffff;
	border-radius: 56rpx;
	border: 2rpx solid #e5e7eb;
	width: 100%;
	box-sizing: border-box;
}

.alt-btn .iconfont {
	font-size: 40rpx;
	color: #111418;
}

.alt-btn-text {
	font-size: 28rpx;
	color: #111418;
	font-weight: 500;
}

.alt-btn:active {
	background-color: #f9fafb;
}

.account-login-form {
	margin-top: 48rpx;
	animation: slideDown 0.3s ease;
}

.form-item {
	margin-bottom: 24rpx;
}

.input-wrapper {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 16rpx;
	border: 2rpx solid #e5e7eb;
	padding: 24rpx 32rpx;
	gap: 16rpx;
	transition: all 0.2s ease;
}

.input-wrapper:focus-within {
	border-color: #2b8cee;
	box-shadow: 0 0 0 4rpx rgba(43, 140, 238, 0.1);
}

.input-wrapper .iconfont {
	font-size: 40rpx;
	color: #9ca3af;
}

.form-input {
	flex: 1;
	font-size: 32rpx;
	color: #111418;
	height: 48rpx;
	line-height: 48rpx;
}

.input-placeholder {
	color: #9ca3af;
}

.account-login-btn {
	width: 100%;
	height: 112rpx;
	background: linear-gradient(135deg, #2b8cee 0%, #1e7ad6 100%);
	border-radius: 56rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 40rpx rgba(43, 140, 238, 0.25);
	margin-top: 32rpx;
}

.account-login-btn:active {
	transform: scale(0.98);
	box-shadow: 0 12rpx 32rpx rgba(43, 140, 238, 0.2);
}

.account-login-btn text {
	font-size: 36rpx;
	font-weight: 600;
	color: #ffffff;
}

.agreement-section {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	margin-top: auto;
}

.agreement-check {
	padding-top: 4rpx;
}

.checkbox {
	width: 40rpx;
	height: 40rpx;
	border-radius: 8rpx;
	border: 2rpx solid #d1d5db;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.checkbox.checked {
	background-color: #2b8cee;
	border-color: #2b8cee;
}

.checkbox .iconfont {
	font-size: 24rpx;
	color: #ffffff;
}

.agreement-text {
	flex: 1;
	font-size: 24rpx;
	color: #6b7280;
	line-height: 1.6;
}

.agreement-text .text {
	color: #6b7280;
}

.agreement-text .link {
	color: #2b8cee;
}

.decoration-circles {
	position: absolute;
	pointer-events: none;
}

.circle {
	position: absolute;
	border-radius: 50%;
	opacity: 0.5;
}

.circle-1 {
	width: 400rpx;
	height: 400rpx;
	background: linear-gradient(135deg, rgba(43, 140, 238, 0.1) 0%, rgba(43, 140, 238, 0.05) 100%);
	top: -200rpx;
	right: -100rpx;
}

.circle-2 {
	width: 300rpx;
	height: 300rpx;
	background: linear-gradient(135deg, rgba(7, 193, 96, 0.08) 0%, rgba(7, 193, 96, 0.03) 100%);
	bottom: 200rpx;
	left: -150rpx;
}

.circle-3 {
	width: 200rpx;
	height: 200rpx;
	background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%);
	bottom: 100rpx;
	right: -50rpx;
}

.error-toast {
	position: fixed;
	top: 120rpx;
	left: 32rpx;
	right: 32rpx;
	z-index: 100;
}

.toast-content {
	background-color: #fef2f2;
	border: 2rpx solid #fecaca;
	border-radius: 16rpx;
	padding: 24rpx 32rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	animation: slideDown 0.3s ease;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.toast-content .iconfont {
	font-size: 36rpx;
	color: #ef4444;
}

.toast-text {
	font-size: 28rpx;
	color: #dc2626;
}
</style>