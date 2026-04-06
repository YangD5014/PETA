<template>
	<view class="pet-device-container">
		<view class="safe-area-top"></view>
		<view class="content-wrapper">
			<view class="header-info">
				<view class="status-info">
					<text class="status-item">网络状态: WiFi</text>
					<text class="status-item">温度: 25°C</text>
					<text class="status-item">经度: 22.5429°N</text>
					<text class="status-item">纬度: 114.0596°E</text>
					<view class="status-item ws-status">
						<text>WebSocket状态: </text>
						<text :class="wsStatusClass">{{ wsStatus }}</text>
					</view>
				</view>
				<view class="time-info">
					<text class="about-btn" @click="goToDetail1">ABOUT</text>
					<view class="date-time">
						<text class="date">{{ currentDate }}</text>
						<view class="time-wrap">
							<view class="live-dot"></view>
							<text class="time">{{ currentTime }}</text>
						</view>
					</view>
					<view class="replay-btn" @click="goToDetail1">
						<text>REPLAY</text>
						<text class="iconfont">&#xe037;</text>
					</view>
				</view>
			</view>

			<view class="model-section">
				<view class="model-container">
					<view class="glow-effect"></view>
					<PlatformCanvas
						type="webgl2"
						canvas-id="pet-3d-model-canvas-0"
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
				</view>
			</view>

			<view class="metrics-section">
				<view class="metric-item">
					<view class="metric-value-wrap">
						<text class="metric-value">{{ steps }}</text>
					</view>
					<view class="metric-icon-wrap">
						<view class="metric-icon steps">
							<text class="iconfont">&#xe566;</text>
						</view>
						<text class="metric-label">活动步数</text>
					</view>
				</view>

				<view class="metric-item">
					<view class="metric-value-wrap">
						<text class="metric-value">{{ sleepDuration }}</text>
						<text class="metric-unit">min</text>
					</view>
					<view class="metric-icon-wrap">
						<view class="metric-icon sleep">
							<text class="iconfont">&#xef3c;</text>
						</view>
						<text class="metric-label">睡眠时长</text>
					</view>
				</view>

				<view class="metric-item">
					<view class="metric-value-wrap">
						<text class="metric-value">{{ activeTime }}</text>
						<text class="metric-unit">min</text>
					</view>
					<view class="metric-icon-wrap">
						<view class="metric-icon active">
							<text class="iconfont">&#xe91d;</text>
						</view>
						<text class="metric-label">运动时间</text>
					</view>
				</view>
			</view>

			<view class="bottom-indicator">
				<view class="indicator-bar"></view>
			</view>
		</view>

		<view class="bottom-nav">
			<view class="nav-item" @click="goToPage('pet-social')">
				<text class="iconfont">&#xe88a;</text>
				<text class="nav-text">朋友圈</text>
			</view>
			<view class="nav-item" @click="goToPage('pet-health')">
				<text class="iconfont">&#xef3c;</text>
				<text class="nav-text">健康</text>
			</view>
			<view class="nav-item center active">
				<view class="center-btn">
					<text class="iconfont">&#xe91d;</text>
				</view>
			</view>
			<view class="nav-item" @click="goToPage('pet-map')">
				<text class="iconfont">&#xe55b;</text>
				<text class="nav-text">地图</text>
			</view>
			<view class="nav-item" @click="goToPage('pet-card')">
				<text class="iconfont">&#xea67;</text>
				<text class="nav-text">名片</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import PlatformCanvas from "@/components/PlatformCanvas.vue"

const dogModelUrl = 'https://cdn.jsdelivr.net/gh/YangD5014/PETA@main/src/static/dog-model.glb'

const isLoading = ref(true)
const loadingProgress = ref(0)
const steps = ref('1,234')
const sleepDuration = ref('256.0')
const activeTime = ref('66.6')
const currentDate = ref('2023.10.10')
const currentTime = ref('17:10:00')
const wsStatus = ref('未连接')

const wsStatusClass = computed(() => {
	switch (wsStatus.value) {
		case '已连接':
			return 'status-connected'
		case '连接中...':
		case '尝试本地服务器':
			return 'status-connecting'
		default:
			return 'status-disconnected'
	}
})

let scene, camera, renderer, model, controls, mixer, animations, currentAction
let animationTimer, websocket, currentPose = -1
let poseAnimations = {}
let timeUpdateTimer

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
		controls.enabled = false

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
				createPoseAnimationMapping()
				hideLoading()

				if (currentPose >= 0) {
					playPoseAnimation(currentPose)
				} else {
					startRandomAnimation()
				}
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

	function createPoseAnimationMapping() {
		if (!animations || animations.length === 0) return

		const poseDescriptions = {
			0: "行走",
			1: "慢速跑",
			2: "快速跑",
			3: "趴下",
			4: "坐下",
			5: "伸左前爪",
			6: "伸右前爪",
			7: "静止站立",
		}

		animations.forEach((clip) => {
			const clipName = clip.name.toLowerCase()

			for (let poseId in poseDescriptions) {
				const poseName = poseDescriptions[poseId]

				if (clipName.includes(poseName.toLowerCase()) ||
					clipName.includes(`pose${poseId}`) ||
					clipName.includes(`animation${poseId}`)) {
					poseAnimations[poseId] = clip
					break
				}
			}
		})

		if (Object.keys(poseAnimations).length === 0) {
			for (let i = 0; i < Math.min(8, animations.length); i++) {
				poseAnimations[i] = animations[i]
			}
		}
	}

	function playPoseAnimation(poseId) {
		if (!mixer) return

		if (currentAction) {
			currentAction.fadeOut(0.5)
		}

		const animationClip = poseAnimations[poseId]

		if (animationClip) {
			currentAction = mixer.clipAction(animationClip)
			currentAction.reset()
			currentAction.fadeIn(0.5)
			currentAction.setLoop(THREE.LoopRepeat)
			currentAction.play()
		} else {
			if (!currentAction) {
				startRandomAnimation()
			}
		}
	}

	function startRandomAnimation() {
		if (currentPose >= 0) return
		if (!animations || !mixer || animations.length === 0) return

		if (animationTimer) {
			clearInterval(animationTimer)
		}

		playRandomAnimation()
		animationTimer = setInterval(playRandomAnimation, 20000)
	}

	function playRandomAnimation() {
		if (currentPose >= 0) return
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
			color: 0x3b82f6,
			emissive: 0x3b82f6,
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

function initWebSocket() {
	try {
		wsStatus.value = '连接中...'

		websocket = new WebSocket('ws://110.42.229.152:10200')

		websocket.onopen = function() {
			wsStatus.value = '已连接'
			getCurrentPose()
			setInterval(getCurrentPose, 5000)
		}

		websocket.onmessage = function(event) {
			try {
				const data = JSON.parse(event.data)
				if (data.hasOwnProperty('currentPose')) {
					updatePose(data.currentPose)
				}
			} catch (e) {
				const message = event.data.toString()
				if (message.includes('姿态模式已设置为')) {
					const match = message.match(/姿态模式已设置为：(\d+)/)
					if (match) {
						updatePose(parseInt(match[1]))
					}
				} else if (message.includes('currentPose')) {
					const match = message.match(/currentPose[\'\"]?\s*[:=]\s*(\d+)/)
					if (match) {
						updatePose(parseInt(match[1]))
					}
				}
			}
		}

		websocket.onerror = function() {
			wsStatus.value = '连接错误'
		}

		websocket.onclose = function() {
			wsStatus.value = '连接断开'
			setTimeout(initWebSocket, 3000)
		}
	} catch (error) {
		wsStatus.value = '连接失败'
		setTimeout(initWebSocket, 3000)
	}
}

function getCurrentPose() {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.send('GET_POSE')
	}
}

function updatePose(pose) {
	const poseNum = parseInt(pose)

	if (poseNum === currentPose) return

	currentPose = poseNum
	playPoseAnimation(poseNum)
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
}

function goToPage(page) {
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

function goToDetail1() {
	uni.navigateTo({ url: '/pages/pet-device-detail-1/pet-device-detail-1' })
}

onMounted(() => {
	updateTime()
	timeUpdateTimer = setInterval(updateTime, 1000)
	initWebSocket()
})

onUnmounted(() => {
	if (timeUpdateTimer) clearInterval(timeUpdateTimer)
	if (animationTimer) clearInterval(animationTimer)
	if (websocket) websocket.close()
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
	padding-bottom: 120rpx;
}

.header-info {
	display: flex;
	justify-content: space-between;
	padding: 32rpx;
}

.status-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.status-item {
	font-size: 20rpx;
	color: #94a3b8;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.ws-status {
	display: flex;
	align-items: center;
}

.status-connected {
	color: #22c55e;
}

.status-connecting {
	color: #eab308;
}

.status-disconnected {
	color: #94a3b8;
}

.time-info {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.about-btn {
	font-size: 28rpx;
	font-weight: bold;
	letter-spacing: 4rpx;
	color: #1e293b;
}

.date-time {
	margin-top: 32rpx;
	text-align: right;
}

.date {
	font-size: 20rpx;
	color: #94a3b8;
}

.time-wrap {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8rpx;
	margin-top: 8rpx;
}

.live-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #ef4444;
	border-radius: 50%;
}

.time {
	font-size: 24rpx;
	font-weight: bold;
	color: #334155;
}

.replay-btn {
	margin-top: 16rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #475569;
}

.replay-btn .iconfont {
	font-size: 32rpx;
}

.model-section {
	flex: 1;
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
	background-color: rgba(59, 130, 246, 0.2);
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
	color: #3b82f6;
}

.spinner {
	width: 44px;
	height: 44px;
	animation: spinner-y0fdc1 2s infinite ease;
	transform-style: preserve-3d;
}

.spinner > view {
	background-color: rgba(59, 130, 246, 0.2);
	height: 100%;
	position: absolute;
	width: 100%;
	border: 2px solid #3B82F6;
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

.metrics-section {
	padding: 0 32rpx 64rpx;
	display: flex;
	flex-direction: column;
	gap: 48rpx;
}

.metric-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.metric-value-wrap {
	display: flex;
	align-items: baseline;
}

.metric-value {
	font-size: 120rpx;
	font-weight: 300;
	letter-spacing: -4rpx;
	border-bottom: 8rpx solid #1e293b;
}

.metric-unit {
	margin-left: 16rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #94a3b8;
	margin-bottom: 16rpx;
}

.metric-icon-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.metric-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 45% 55% 50% 50% / 55% 50% 50% 45%;
}

.metric-icon.steps {
	background-color: #22c55e;
	box-shadow: 0 16rpx 40rpx rgba(34, 197, 94, 0.2);
}

.metric-icon.sleep {
	background-color: #6366f1;
	box-shadow: 0 16rpx 40rpx rgba(99, 102, 241, 0.2);
}

.metric-icon.active {
	background-color: #f97316;
	box-shadow: 0 16rpx 40rpx rgba(249, 115, 22, 0.2);
}

.metric-icon .iconfont {
	font-size: 48rpx;
	color: #ffffff;
}

.metric-label {
	margin-top: 8rpx;
	font-size: 20rpx;
	font-weight: bold;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.metric-icon.steps + .metric-label {
	color: #22c55e;
}

.metric-icon.sleep + .metric-label {
	color: #6366f1;
}

.metric-icon.active + .metric-label {
	color: #f97316;
}

.bottom-indicator {
	padding: 32rpx;
	display: flex;
	justify-content: center;
}

.indicator-bar {
	width: 128rpx;
	height: 8rpx;
	background-color: #e2e8f0;
	border-radius: 4rpx;
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
	color: #9ca3af;
}

.nav-item .nav-text {
	font-size: 20rpx;
	color: #9ca3af;
}

.nav-item.active .iconfont,
.nav-item.active .nav-text {
	color: #3b82f6;
	font-weight: bold;
}

.nav-item.center {
	margin-top: -48rpx;
}

.center-btn {
	width: 112rpx;
	height: 112rpx;
	background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 40rpx rgba(59, 130, 246, 0.3);
}

.center-btn .iconfont {
	font-size: 56rpx;
	color: #ffffff;
}
</style>
