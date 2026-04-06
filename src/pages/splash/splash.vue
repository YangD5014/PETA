<template>
	<view class="splash-container" @touchstart="onTouchStart" @touchend="onTouchEnd" @tap="onClick">
		<view class="video-container">
			<video
				class="video-bg"
				:src="currentVideoSrc"
				:autoplay="true"
				:loop="true"
				:muted="true"
				:playsinline="true"
				:enable-progress-gesture="false"
				:show-center-play-btn="false"
				:show-play-btn="false"
				:show-fullscreen-btn="false"
				:show-baseline-bar="false"
				:enable-play-gesture="false"
				@ended="onVideoEnded"
				@error="onVideoError"
				@load="onVideoLoaded"
				@progress="onVideoProgress"
			></video>
			<view class="video-overlay"></view>
		</view>

		<view class="fixed top-2 left-0 w-full px-4 z-50 flex gap-1">
			<view
				v-for="(indicator, index) in totalBgs"
				:key="index"
				class="h-1 flex-1 rounded-full transition-colors duration-300"
				:class="index === currentBg ? 'bg-primary' : 'bg-surface-container-highest/30'"
			></view>
		</view>

		<header class="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-8">
			<view class="text-2xl font-headline font-bold text-white lowercase tracking-[0.02em]">宠影孪生</view>
			<view class="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex items-center justify-center backdrop-blur-custom bg-white/5">
				<text class="material-symbols-outlined text-white text-xl">menu</text>
			</view>
		</header>

		<main class="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 pt-20 pb-48 text-center">
			<view class="space-y-4">
				<h1
					id="main-title"
					class="text-xl md:text-3xl font-headline font-bold text-white tracking-tight transition-opacity duration-300"
					:class="titleOpacity ? 'opacity-100' : 'opacity-0'"
				>
					{{ currentTitle }}
				</h1>
				<p
					id="main-subtitle"
					class="text-base md:text-lg font-body text-secondary-fixed/90 tracking-[0.02em] transition-opacity duration-300"
					:class="subtitleOpacity ? 'opacity-100' : 'opacity-0'"
				>
					{{ currentSubtitle }}
				</p>
			</view>
		</main>

		<footer class="fixed bottom-0 left-0 w-full z-20 pb-8 px-6 space-y-8 bg-gradient-to-t from-surface to-transparent">
			<view class="max-w-md mx-auto w-full">
				<button
					class="start-button"
					:disabled="false"
					@tap="handleStart"
				>
					<text class="start-icon">arrow_forward</text>
					<text class="start-text">Start</text>
				</button>
			</view>

			<view class="flex flex-col items-center justify-center space-y-3 opacity-80">
				<view class="flex items-center gap-3">
					<view class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center p-1.5 border border-white/5">
						<view class="w-full h-full bg-primary rounded-sm"></view>
					</view>
					<view class="flex flex-col leading-none">
						<text class="text-xs font-headline font-bold text-white tracking-wide uppercase">PETA HK Limited</text>
						<view class="flex items-center gap-1 mt-0.5">
							<text class="text-[10px] text-white/40 font-body uppercase tracking-[0.05em]">curated by</text>
							<text class="text-[10px] text-white/60 font-body font-bold uppercase tracking-widest">PETA</text>
						</view>
					</view>
				</view>
			</view>
		</footer>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const slideContent = [
	{ title: '智能孪生，为爱续航', subtitle: 'Digital Twin, Love Endures' },
	{ title: '数字守护，朝夕相伴', subtitle: 'Smart Guardian, Forever by Side' },
	{ title: '具身智能，硬件守护', subtitle: 'Embodied Intelligence, Hardware Guardianship' },
	{ title: '一切精彩尽在 宠影孪生', subtitle: 'To Start' }
];

const currentBg = ref(0);
const totalBgs = 4;
const currentTitle = ref('');
const currentSubtitle = ref('');
const titleOpacity = ref(false);
const subtitleOpacity = ref(false);
const videoLoaded = ref(false);

const videoList = [
	'/static/videos/压缩后_播片-1.mp4',
	'/static/videos/压缩后_播片-2.mp4',
	'/static/videos/压缩后_播片-3.mp4',
	'/static/videos/压缩后_播片-4.mp4'
];

const currentVideoSrc = computed(() => videoList[currentBg.value]);

let touchStartX = 0;
let touchEndX = 0;

onMounted(() => {
	updateContent(0);
});

function updateContent(index: number) {
	titleOpacity.value = false;
	subtitleOpacity.value = false;

	setTimeout(() => {
		currentTitle.value = slideContent[index].title;
		currentSubtitle.value = slideContent[index].subtitle;
		titleOpacity.value = true;
		subtitleOpacity.value = true;
	}, 300);
}

function switchToNextBg() {
	if (currentBg.value >= totalBgs - 1) return;

	currentBg.value = currentBg.value + 1;
	updateContent(currentBg.value);
}

function onVideoLoaded() {
	videoLoaded.value = true;
	console.log('Video loaded');
}

function onVideoProgress() {
	console.log('Video loading...');
}

function onVideoEnded() {
	switchToNextBg();
}

function onVideoError(e: any) {
	console.log('Video error:', e);
}

function handleStart() {
	uni.reLaunch({
		url: '/pages/login/login'
	});
}

function onTouchStart(e: TouchEvent) {
	touchStartX = e.touches[0].screenX;
}

function onTouchEnd(e: TouchEvent) {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
}

function handleSwipe() {
	if (currentBg.value >= totalBgs - 1) return;

	const swipeDistance = touchEndX - touchStartX;
	const minSwipeDistance = 50;

	if (Math.abs(swipeDistance) > minSwipeDistance && swipeDistance < 0) {
		switchToNextBg();
	}
}

function onClick(e: any) {
	if (currentBg.value >= totalBgs - 1) return;

	const screenWidth = uni.getSystemInfoSync().windowWidth;
	const clickX = e.detail?.x || e.clientX;

	if (clickX >= screenWidth / 2) {
		switchToNextBg();
	}
}
</script>

<style scoped>
.splash-container {
	width: 100%;
	min-height: 100vh;
	background-color: #131313;
}

.video-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}

.video-bg {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.video-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, rgba(19, 19, 19, 0.4) 0%, transparent 30%, rgba(19, 19, 19, 0.9) 100%);
}

.start-button {
	width: 100%;
	height: 96rpx;
	background-color: #ffffff;
	border-radius: 48rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
}

.start-button:active {
	transform: scale(0.98);
}

.start-icon {
	font-family: 'Material Symbols Outlined';
	font-size: 40rpx;
	color: #1a1c1c;
}

.start-text {
	font-family: 'Inter', sans-serif;
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1c1c;
	letter-spacing: -0.025em;
}

.material-symbols-outlined {
	font-family: 'Material Symbols Outlined';
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.backdrop-blur-custom {
	backdrop-filter: blur(32px);
	-webkit-backdrop-filter: blur(32px);
}

.z-0 { z-index: 0; }
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-50 { z-index: 50; }

.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }

.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-0 { top: 0; }
.top-2 { top: 8px; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }
.right-0 { right: 0; }

.w-full { width: 100%; }
.h-full { height: 100%; }
.h-1 { height: 4px; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }

.gap-1 { gap: 4px; }
.gap-3 { gap: 12px; }

.px-4 { padding-left: 16px; padding-right: 16px; }
.px-6 { padding-left: 24px; padding-right: 24px; }
.py-4 { padding-top: 16px; padding-bottom: 16px; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.pb-8 { padding-bottom: 32px; }
.pt-20 { padding-top: 80px; }

.m-0 { margin: 0; }

.space-y-3 > view + view { margin-top: 12px; }
.space-y-4 > view + view { margin-top: 16px; }
.space-y-8 > view + view { margin-top: 32px; }

.text-center { text-align: center; }

.text-xs { font-size: 12px; }
.text-\[10px\] { font-size: 10px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-2xl { font-size: 24px; }
.text-3xl { font-size: 30px; }

.font-headline { font-family: 'Space Grotesk', sans-serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

.text-white { color: #ffffff; }
.text-white\/40 { color: rgba(255, 255, 255, 0.4); }
.text-white\/60 { color: rgba(255, 255, 255, 0.6); }

.tracking-tight { letter-spacing: -0.025em; }
.tracking-\[0\.02em\] { letter-spacing: 0.02em; }
.tracking-\[0\.05em\] { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }

.bg-surface { background-color: #131313; }
.bg-primary { background-color: #ffffff; }
.bg-white\/5 { background-color: rgba(255, 255, 255, 0.05); }
.bg-gradient-to-t { background-image: linear-gradient(to top, var(--tw-gradient-stops)); }
.from-surface\/40 { --tw-gradient-from: rgba(19, 19, 19, 0.4); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-surface\/90 { --tw-gradient-to: rgba(19, 19, 19, 0.9); }
.to-transparent { --tw-gradient-to: transparent; }

.bg-surface-container-high { background-color: #2a2a2a; }
.bg-surface-container-highest\/30 { background-color: rgba(53, 53, 53, 0.3); }

.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 16px; }
.rounded-sm { border-radius: 4px; }

.border { border-width: 1px; }
.border-white\/10 { border-color: rgba(255, 255, 255, 0.1); }
.border-white\/5 { border-color: rgba(255, 255, 255, 0.05); }

.object-cover { object-fit: cover; }

.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
.duration-150 { transition-duration: 150ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }
.duration-1000 { transition-duration: 1000ms; }

.opacity-0 { opacity: 0; }
.opacity-100 { opacity: 1; }
.opacity-80 { opacity: 0.8; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }

.active\:scale-\[0\.98\]:active { transform: scale(0.98); }

.whitespace-nowrap { white-space: nowrap; }
.leading-none { line-height: 1; }

.mt-0\.5 { margin-top: 2px; }

.min-h-screen { min-height: 100vh; }

.overflow-hidden { overflow: hidden; }

.z-10 { z-index: 10; }

.text-on-primary { color: #1a1c1c; }

.w-8 { width: 32px; }
.h-8 { height: 32px; }
.w-10 { width: 40px; }
.h-10 { height: 40px; }
.w-4 { width: 16px; }
.h-4 { height: 16px; }

.p-1\.5 { padding: 6px; }

.max-w-md { max-width: 448px; }
.mx-auto { margin-left: auto; margin-right: auto; }

.gap-3 { gap: 12px; }
</style>
