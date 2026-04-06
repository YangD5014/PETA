<template>
	<view class="pet-device-container">
		<view class="safe-area-top"></view>
		<view class="content-wrapper">
			<view class="header">
				<view class="back-btn" @click="goBack">
					<text class="iconfont">&#xe5c4;</text>
				</view>
				<text class="header-title">ABOUT</text>
			</view>

			<view class="time-section">
				<text class="date">{{ currentDate }}</text>
				<view class="time-wrap">
					<view class="live-dot"></view>
					<text class="time">{{ currentTime }}</text>
				</view>
			</view>

			<view class="status-section">
				<view class="status-badge" :style="{ backgroundColor: currentStatus.color }">
					<text>{{ currentStatus.text }}</text>
				</view>
				<view class="status-arrow" :style="{ backgroundColor: currentStatus.color }"></view>
			</view>

			<view class="model-section">
				<view class="model-container">
					<view class="glow-effect" :style="{ backgroundColor: currentStatus.color + '33' }"></view>
					<PlatformCanvas
						type="webgl2"
						canvas-id="pet-3d-model-canvas-1"
						@useCanvas="useCanvas"
					/>
					<view v-if="isLoading" class="model-loading-overlay">
						<view class="model-loader">
							<view class="spinner">
								<view></view>
								<view></view>
								<view></view>
								<view></view>
								<view></view>
								<view></view>
							</view>
							<text class="loading-progress">{{ loadingProgress }}%</text>
						</view>
					</view>
					<view class="controls-btn" @click="toggleControls">
						<text>{{ controlsEnabled ? '禁用控制' : '启用控制' }}</text>
					</view>
				</view>
			</view>

			<view class="dashboard-section">
				<view class="dashboard-card">
					<view class="time-picker">
						<view class="picker-btn" @click="prevTimeRange">
							<text class="iconfont">&#xe5cb;</text>
						</view>
						<view class="picker-info">
							<text class="picker-title">{{ timeRangeLabels[currentTimeRange] }}</text>
							<text class="picker-date">{{ displayDate }}</text>
						</view>
						<view class="picker-btn" @click="nextTimeRange">
							<text class="iconfont">&#xe5cc;</text>
						</view>
					</view>

					<view class="ring-chart">
						<view class="ring-container">
							<view class="ring-bg"></view>
							<view class="ring activity" :style="{ '--offset': activityOffset }"></view>
							<view class="ring rest" :style="{ '--offset': restOffset }"></view>
							<view class="ring play" :style="{ '--offset': playOffset }"></view>
						</view>
						<view class="ring-center">
							<text class="percentage">{{ activityPercentage }}%</text>
							<text class="percentage-label">活跃度</text>
						</view>
					</view>

					<view class="stats-grid">
						<view class="stat-card activity">
							<view class="stat-header">
								<view class="stat-dot"></view>
								<text class="stat-name">活动</text>
							</view>
							<text class="stat-value">{{ activityHours }}h</text>
							<text class="stat-target">目标 8h</text>
						</view>
						<view class="stat-card rest">
							<view class="stat-header">
								<view class="stat-dot"></view>
								<text class="stat-name">休息</text>
							</view>
							<text class="stat-value">{{ restHours }}h</text>
							<text class="stat-target">目标 12h</text>
						</view>
						<view class="stat-card play">
							<view class="stat-header">
								<view class="stat-dot"></view>
								<text class="stat-name">玩耍</text>
							</view>
							<text class="stat-value">{{ playHours }}h</text>
							<text class="stat-target">目标 3h</text>
						</view>
					</view>

					<view class="range-buttons">
						<view
							v-for="(label, index) in ['今天', '本周', '本月', '今年']"
							:key="index"
							class="range-btn"
							:class="{ active: currentTimeRange === index }"
							@click="setTimeRange(index)"
						>
							<text>{{ label }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import PlatformCanvas from "@/components/PlatformCanvas.vue"

const dogModelUrl = 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/dog-model.glb'

const isLoading = ref(true)
const loadingProgress = ref(0)
const controlsEnabled = ref(false)
const currentDate = ref('2022.10.10')
const currentTime = ref('17:10:00')
const currentTimeRange = ref(0)
const timeRangeLabels = ['今天', '本周', '本月', '今年']
const displayDate = ref('12月10日')

const activityHours = ref('4.5')
const restHours = ref('12')
const playHours = ref('2.5')
const activityPercentage = ref(50)

const activityOffset = computed(() => 502 - (502 * parseFloat(activityHours.value) / 8))
const restOffset = computed(() => 408 - (408 * parseFloat(restHours.value) / 12))
const playOffset = computed(() => 314 - (314 * parseFloat(playHours.value) / 3))

const statusList = [
	{ text: '在家 | 活跃', color: '#22C55E' },
	{ text: '在家 | 休息', color: '#3B82F6' },
	{ text: '在家 | 玩耍', color: '#F97316' },
	{ text: '在家 | 睡眠', color: '#22C55E' },
	{ text: '外出 | 散步', color: '#3B82F6' },
	{ text: '外出 | 进食', color: '#F97316' },
	{ text: '在家 | 睡眠', color: '#22C55E' },
	{ text: '外出 | 玩耍', color: '#22C55E' }
]
const currentStatusIndex = ref(0)
const currentStatus = computed(() => statusList[currentStatusIndex.value])

let scene, camera, renderer, model, controls, mixer, animations, currentAction
let animationTimer, timeUpdateTimer

function useCanvas({ canvas, useFrame }) {
	const CANVAS_WIDTH = canvas.width
	const CANVAS_HEIGHT = canvas.height

	init()
	animate()

	function init() {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
		renderer.setPixelRatio(THREEGlobals.devicePixelRatio)
		renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
		renderer.setClearColor(0x000000, 0)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap

		camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000)
		camera.position.set(1.417, 0.11, 0.174)

		scene = new THREE.Scene()

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
		directionalLight.position.set(10, 10, 5)
		directionalLight.castShadow = true
		scene.add(directionalLight)

		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		controls.enableZoom = true
		controls.autoRotate = false
		controls.enabled = controlsEnabled.value

		loadModel()

		canvas.addEventListener('resize', onWindowResize)
	}

	function loadModel() {
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)

		loader.load(
			dogModelUrl,
			function(gltf) {
				model = gltf.scene
				animations = gltf.animations

				const box = new THREE.Box3().setFromObject(model)
				const center = box.getCenter(new THREE.Vector3())
				const size = box.getSize(new THREE.Vector3())

				model.position.x = -center.x
				model.position.y = -center.y
				model.position.z = -center.z

				const maxDim = Math.max(size.x, size.y, size.z)
				const scale = 2 / maxDim
				model.scale.set(scale, scale, scale)

				scene.add(model)

				mixer = new THREE.AnimationMixer(model)
				hideLoading()
				startRandomAnimation()
			},
			function(xhr) {
				if (xhr.total > 0) {
					loadingProgress.value = Math.min(Math.floor(xhr.loaded / xhr.total * 100), 99)
				}
			},
			function(error) {
				console.error('Error loading model:', error)
				createPlaceholderModel()
				hideLoading()
			}
		)
	}

	function startRandomAnimation() {
		if (!animations || !mixer || animations.length === 0) return

		if (animationTimer) {
			clearInterval(animationTimer)
		}

		playRandomAnimation()
		animationTimer = setInterval(playRandomAnimation, 20000)
	}

	function playRandomAnimation() {
		if (!animations || !mixer || animations.length === 0) return

		if (currentAction) {
			currentAction.fadeOut(1.0)
		}

		const randomIndex = Math.floor(Math.random() * animations.length)
		const clip = animations[randomIndex]

		currentAction = mixer.clipAction(clip)
		currentAction.reset()
		currentAction.fadeIn(1.0)
		currentAction.setLoop(THREE.LoopRepeat)
		currentAction.play()
	}

	function createPlaceholderModel() {
		const geometry = new THREE.BoxGeometry(2, 2, 2)
		const material = new THREE.MeshPhongMaterial({
			color: 0x22C55E,
			emissive: 0x22C55E,
			emissiveIntensity: 0.1
		})
		model = new THREE.Mesh(geometry, material)
		scene.add(model)
	}

	function hideLoading() {
		isLoading.value = false
	}

	function onWindowResize() {
		camera.aspect = canvas.clientWidth / canvas.clientHeight
		camera.updateProjectionMatrix()
		renderer.setSize(canvas.clientWidth, canvas.clientHeight)
	}

	function animate() {
		useFrame(() => {
			if (mixer) {
				mixer.update(0.016)
			}
			controls.update()
			renderer.render(scene, camera)
		})
	}
}

function toggleControls() {
	controlsEnabled.value = !controlsEnabled.value
	if (controls) {
		controls.enabled = controlsEnabled.value
	}
}

function updateTime() {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')

	currentDate.value = `${year}.${month}.${day}`
	currentTime.value = `${hours}:${minutes}:${seconds}`
	displayDate.value = `${month}月${day}日`
}

function prevTimeRange() {
	currentStatusIndex.value = (currentStatusIndex.value - 1 + statusList.length) % statusList.length
}

function nextTimeRange() {
	currentStatusIndex.value = (currentStatusIndex.value + 1) % statusList.length
}

function setTimeRange(index) {
	currentTimeRange.value = index

	switch (index) {
		case 0:
			activityHours.value = '4.5'
			restHours.value = '12'
			playHours.value = '2.5'
			activityPercentage.value = 50
			break
		case 1:
			activityHours.value = '28'
			restHours.value = '72'
			playHours.value = '15'
			activityPercentage.value = 65
			break
		case 2:
			activityHours.value = '120'
			restHours.value = '280'
			playHours.value = '60'
			activityPercentage.value = 58
			break
		case 3:
			activityHours.value = '1450'
			restHours.value = '3360'
			playHours.value = '720'
			activityPercentage.value = 62
			break
	}
}

function goBack() {
	uni.navigateBack()
}

onMounted(() => {
	updateTime()
	timeUpdateTimer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
	if (timeUpdateTimer) clearInterval(timeUpdateTimer)
	if (animationTimer) clearInterval(animationTimer)
})
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

.pet-device-container {
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
}

.content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 48rpx 32rpx 16rpx;
}

.back-btn {
	padding: 16rpx;
}

.back-btn .iconfont {
	font-size: 48rpx;
	color: #22c55e;
}

.header-title {
	font-size: 40rpx;
	font-weight: 300;
	letter-spacing: 8rpx;
	color: #64748b;
}

.time-section {
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.date {
	font-size: 28rpx;
	color: #64748b;
	font-weight: 500;
}

.time-wrap {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-top: 8rpx;
}

.live-dot {
	width: 16rpx;
	height: 16rpx;
	background-color: #ef4444;
	border-radius: 50%;
}

.time {
	font-size: 28rpx;
	font-weight: bold;
	color: #334155;
}

.status-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 16rpx;
	position: relative;
}

.status-badge {
	padding: 16rpx 48rpx;
	border-radius: 32rpx;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 500;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.status-arrow {
	position: absolute;
	bottom: -16rpx;
	left: 50%;
	transform: translateX(-50%) rotate(45deg);
	width: 32rpx;
	height: 32rpx;
}

.model-section {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 32rpx;
}

.model-container {
	position: relative;
	width: 600rpx;
	height: 600rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.glow-effect {
	position: absolute;
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	filter: blur(120rpx);
}

.model-loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 5;
}

.model-loader {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}

.loading-progress {
	font-size: 32rpx;
	font-weight: bold;
	color: #22c55e;
}

.spinner {
	width: 44px;
	height: 44px;
	animation: spinner-y0fdc1 2s infinite ease;
	transform-style: preserve-3d;
}

.spinner > view {
	background-color: rgba(34, 197, 94, 0.2);
	height: 100%;
	position: absolute;
	width: 100%;
	border: 2px solid #22C55E;
}

.spinner view:nth-of-type(1) {
	transform: translateZ(-22px) rotateY(180deg);
}

.spinner view:nth-of-type(2) {
	transform: rotateY(-270deg) translateX(50%);
	transform-origin: top right;
}

.spinner view:nth-of-type(3) {
	transform: rotateY(270deg) translateX(-50%);
	transform-origin: center left;
}

.spinner view:nth-of-type(4) {
	transform: rotateX(90deg) translateY(-50%);
	transform-origin: top center;
}

.spinner view:nth-of-type(5) {
	transform: rotateX(-90deg) translateY(50%);
	transform-origin: bottom center;
}

.spinner view:nth-of-type(6) {
	transform: translateZ(22px);
}

@keyframes spinner-y0fdc1 {
	0% {
		transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
	}
	50% {
		transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
	}
	100% {
		transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
	}
}

.controls-btn {
	position: absolute;
	bottom: 16rpx;
	right: 16rpx;
	background-color: rgba(255, 255, 255, 0.8);
	padding: 8rpx 24rpx;
	border-radius: 16rpx;
	font-size: 24rpx;
	color: #374151;
}

.dashboard-section {
	padding: 0 32rpx 64rpx;
}

.dashboard-card {
	background-color: #ffffff;
	border-radius: 48rpx;
	box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.08);
	padding: 48rpx;
}

.time-picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 48rpx;
}

.picker-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #f1f5f9;
	display: flex;
	align-items: center;
	justify-content: center;
}

.picker-btn .iconfont {
	font-size: 40rpx;
	color: #64748b;
}

.picker-info {
	text-align: center;
}

.picker-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1e293b;
}

.picker-date {
	font-size: 28rpx;
	color: #64748b;
	margin-top: 8rpx;
	display: block;
}

.ring-chart {
	position: relative;
	width: 512rpx;
	height: 512rpx;
	margin: 0 auto 48rpx;
}

.ring-container {
	position: absolute;
	inset: 0;
}

.ring-bg,
.ring {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	border: 24rpx solid #e2e8f0;
}

.ring.activity {
	border-color: #22c55e;
	border-top-color: transparent;
	border-right-color: transparent;
	transform: rotate(-45deg);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.ring.rest {
	inset: 60rpx;
	border-width: 24rpx;
	border-color: #3b82f6;
	border-top-color: transparent;
	border-right-color: transparent;
	transform: rotate(-45deg);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.ring.play {
	inset: 120rpx;
	border-width: 24rpx;
	border-color: #f97316;
	border-top-color: transparent;
	border-right-color: transparent;
	transform: rotate(-45deg);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.ring-center {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.percentage {
	font-size: 64rpx;
	font-weight: bold;
	color: #1e293b;
}

.percentage-label {
	font-size: 28rpx;
	color: #64748b;
	margin-top: 8rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
	margin-bottom: 48rpx;
}

.stat-card {
	border-radius: 24rpx;
	padding: 24rpx;
	text-align: center;
}

.stat-card.activity {
	background-color: #f0fdf4;
}

.stat-card.rest {
	background-color: #eff6ff;
}

.stat-card.play {
	background-color: #fff7ed;
}

.stat-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	margin-bottom: 8rpx;
}

.stat-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
}

.stat-card.activity .stat-dot {
	background-color: #22c55e;
}

.stat-card.rest .stat-dot {
	background-color: #3b82f6;
}

.stat-card.play .stat-dot {
	background-color: #f97316;
}

.stat-name {
	font-size: 24rpx;
	color: #64748b;
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #1e293b;
}

.stat-target {
	font-size: 24rpx;
	color: #94a3b8;
	margin-top: 8rpx;
	display: block;
}

.range-buttons {
	display: flex;
	justify-content: center;
	gap: 16rpx;
}

.range-btn {
	padding: 16rpx 32rpx;
	border-radius: 32rpx;
	background-color: #f1f5f9;
	font-size: 28rpx;
	font-weight: 500;
	color: #64748b;
}

.range-btn.active {
	background-color: #22c55e;
	color: #ffffff;
}
</style>
