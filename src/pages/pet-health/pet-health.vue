<template>
	<view class="pet-health-container">
		<view class="header">
			<view class="menu-btn" @click="openMenu">
				<text class="iconfont icon-menu">&#xe5d2;</text>
			</view>
			<view class="pet-info-header">
				<view class="pet-name-wrap">
					<text class="pet-name">Luna</text>
					<view class="status-dot"></view>
				</view>
				<text class="pet-breed">金毛寻回犬</text>
			</view>
			<view class="battery-indicator">
				<text class="battery-text">85%</text>
				<text class="iconfont icon-battery">&#xe1a4;</text>
			</view>
		</view>

		<scroll-view class="main-content" scroll-y>
			<view class="model-section">
				<view class="model-card">
					<view class="status-badge">
						<text class="iconfont icon-run">&#xe566;</text>
						<text class="status-text">正在散步</text>
					</view>
					<view class="model-container">
						<view class="glow-effect"></view>
						<PlatformCanvas
							type="webgl2"
							canvas-id="pet-3d-model-canvas"
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
					<view class="tracking-indicator">
						<text class="iconfont icon-sensors">&#xe904;</text>
						<text class="tracking-text">实时姿态跟踪</text>
					</view>
				</view>
			</view>

			<view class="metrics-section">
				<view class="section-header">
					<text class="section-title">健康指标</text>
					<text class="view-history" @click="viewHistory">查看历史</text>
				</view>

				<view class="metrics-row">
					<view class="metric-card">
						<view class="metric-header">
							<view class="metric-icon steps">
								<text class="iconfont">&#xf69d;</text>
							</view>
							<text class="metric-goal">目标6000</text>
						</view>
						<view class="metric-value-wrap">
							<text class="metric-value">4,520</text>
							<text class="metric-label">今日步数</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill steps" style="width: 75%"></view>
						</view>
					</view>

					<view class="metric-card">
						<view class="metric-header">
							<view class="metric-icon heart">
								<text class="iconfont">&#xeb6b;</text>
							</view>
							<text class="metric-status normal">正常</text>
						</view>
						<view class="metric-value-wrap">
							<view class="heart-rate-value">
								<text class="metric-value">110</text>
								<text class="metric-unit">次/分钟</text>
							</view>
						</view>
						<view class="heart-rate-chart">
							<view class="chart-bar" style="height: 40%"></view>
							<view class="chart-bar" style="height: 60%"></view>
							<view class="chart-bar" style="height: 50%"></view>
							<view class="chart-bar" style="height: 80%"></view>
							<view class="chart-bar" style="height: 70%"></view>
							<view class="chart-bar" style="height: 65%"></view>
						</view>
					</view>
				</view>

				<view class="sleep-card">
					<view class="sleep-header">
						<view class="sleep-icon-wrap">
							<view class="sleep-icon">
								<text class="iconfont">&#xeb41;</text>
							</view>
							<view class="sleep-title-wrap">
								<text class="sleep-title">睡眠时长</text>
								<text class="sleep-subtitle">昨晚</text>
							</view>
						</view>
						<text class="sleep-duration">8<text class="unit">小时</text> 20<text class="unit">分钟</text></text>
					</view>
					<view class="sleep-phases">
						<view class="phase-bar">
							<view class="phase deep" style="width: 20%"></view>
							<view class="phase light" style="width: 55%"></view>
							<view class="phase rem" style="width: 25%"></view>
						</view>
					</view>
					<view class="sleep-legend">
						<view class="legend-item">
							<view class="legend-dot deep"></view>
							<text class="legend-text">深度 (20%)</text>
						</view>
						<view class="legend-item">
							<view class="legend-dot light"></view>
							<text class="legend-text">浅度 (55%)</text>
						</view>
						<view class="legend-item">
							<view class="legend-dot rem"></view>
							<text class="legend-text">快速眼动 (25%)</text>
						</view>
					</view>
				</view>

				<view class="metrics-row small">
					<view class="stat-card">
						<view class="stat-icon calories">
							<text class="iconfont">&#xea15;</text>
						</view>
						<view class="stat-info">
							<text class="stat-label">卡路里</text>
							<text class="stat-value">320 <text class="stat-unit">kcal</text></text>
						</view>
					</view>
					<view class="stat-card">
						<view class="stat-icon temp">
							<text class="iconfont">&#xe1ff;</text>
						</view>
						<view class="stat-info">
							<text class="stat-label">体温</text>
							<text class="stat-value">101.5°F</text>
						</view>
					</view>
				</view>

				<view class="location-card" @click="viewLocation">
					<image class="location-bg" src="/static/images/health_map.jpg" mode="aspectFill"></image>
					<view class="location-overlay"></view>
					<view class="location-content">
						<view class="location-badge">
							<view class="location-icon">
								<text class="iconfont">&#xe569;</text>
							</view>
							<text class="location-label">实时位置</text>
						</view>
						<text class="location-address">南山区西丽街道,深圳</text>
						<text class="location-time">2分钟前更新</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="bottom-nav">
			<view class="nav-item" @click="goToPage('pet-social')">
				<text class="iconfont icon-home">&#xe88a;</text>
				<text class="nav-text">朋友圈</text>
			</view>
			<view class="nav-item active">
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

<script setup>
import { ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import PlatformCanvas from "@/components/PlatformCanvas.vue"

const dogModelUrl = 'https://cdn.jsdelivr.net/gh/YangD5014/jsdliver_cdn@main/dog-model.glb'

const isLoading = ref(true)
const loadingProgress = ref(0)

function useCanvas({ canvas, useFrame, recomputeSize }) {
	const CANVAS_WIDTH = canvas.width
	const CANVAS_HEIGHT = canvas.height
	let camera, scene, renderer, mixer, model, controls

	init()
	animate()

	function init() {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
		renderer.setPixelRatio(THREEGlobals.devicePixelRatio)
		renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
		renderer.setClearColor(0x000000, 0)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1

		camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.01, 1000)
		camera.position.set(1.13, 0.01, -0.10)

		scene = new THREE.Scene()

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
		directionalLight.position.set(5, 10, 5)
		directionalLight.castShadow = true
		directionalLight.shadow.mapSize.width = 2048
		directionalLight.shadow.mapSize.height = 2048
		scene.add(directionalLight)

		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)

		loader.load(
			dogModelUrl,
			function(gltf) {
				model = gltf.scene

				const box = new THREE.Box3().setFromObject(model)
				const center = box.getCenter(new THREE.Vector3())
				const size = box.getSize(new THREE.Vector3())

				model.position.x = -center.x
				model.position.y = -center.y
				model.position.z = -center.z

				const maxDim = Math.max(size.x, size.y, size.z)
				const scale = 2 / maxDim
				model.scale.multiplyScalar(scale)

				model.traverse(function(child) {
					if (child.isMesh) {
						child.castShadow = true
						child.receiveShadow = true
					}
				})

				scene.add(model)

				if (gltf.animations && gltf.animations.length > 0) {
					mixer = new THREE.AnimationMixer(model)

					let walkAnimation = gltf.animations.find(clip =>
						clip.name.toLowerCase().includes('walk') ||
						clip.name.toLowerCase().includes('run') ||
						clip.name.toLowerCase().includes('move')
					)

					if (!walkAnimation && gltf.animations.length > 0) {
						walkAnimation = gltf.animations[0]
					}

					if (walkAnimation) {
						const action = mixer.clipAction(walkAnimation)
						action.setLoop(THREE.LoopRepeat)
						action.setEffectiveWeight(1)
						action.fadeIn(0.5)
						action.play()
					}
				}

				hideLoading()
			},
			function(xhr) {
				if (xhr.total > 0) {
					const percent = Math.floor(xhr.loaded / xhr.total * 100)
					loadingProgress.value = percent
				}
			},
			function(error) {
				console.error('加载模型时出错:', error)
				hideLoading()
			}
		)

		controls = new OrbitControls(camera, renderer.domElement)
		controls.enabled = false
		controls.enableDamping = true
		controls.dampingFactor = 0.05
		controls.screenSpacePanning = false
		controls.minDistance = 0.5
		controls.maxDistance = 50
		controls.maxPolarAngle = Math.PI / 2
		controls.zoomSpeed = 1.2
		controls.rotateSpeed = 0.5

		canvas.addEventListener('resize', onWindowResize)
	}

	function hideLoading() {
		isLoading.value = false
	}

	function onWindowResize() {
		camera.aspect = canvas.clientWidth / canvas.clientHeight
		camera.updateProjectionMatrix()
		renderer.setSize(canvas.clientWidth, canvas.clientHeight)
	}

	const clock = new THREE.Clock()

	function animate() {
		useFrame(() => {
			clock.getDelta()

			if (mixer) {
				mixer.update(0.016)
			}

			controls.update()
			renderer.render(scene, camera)
		})
	}
}

function openMenu() {
	uni.showToast({ title: '打开菜单', icon: 'none' })
}

function viewHistory() {
	uni.showToast({ title: '查看历史', icon: 'none' })
}

function viewLocation() {
	uni.showToast({ title: '查看位置', icon: 'none' })
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

.pet-health-container {
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

.menu-btn {
	padding: 16rpx;
	border-radius: 50%;
}

.menu-btn:active {
	background-color: #f3f4f6;
}

.icon-menu {
	font-size: 48rpx;
	color: #111418;
}

.pet-info-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.pet-name-wrap {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.pet-name {
	font-size: 36rpx;
	font-weight: 800;
	color: #111418;
}

.status-dot {
	width: 16rpx;
	height: 16rpx;
	background-color: #22c55e;
	border-radius: 50%;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.pet-breed {
	font-size: 24rpx;
	color: #6b7280;
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

.model-section {
	padding: 20rpx 30rpx;
}

.model-card {
	position: relative;
	width: 100%;
	aspect-ratio: 4/3;
	border-radius: 64rpx;
	overflow: hidden;
	background: linear-gradient(135deg, #f0f4f8 0%, #e6eef5 100%);
	border: 2rpx solid #f3f4f6;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.status-badge {
	position: absolute;
	top: 32rpx;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10rpx);
	padding: 16rpx 32rpx;
	border-radius: 32rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	gap: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	z-index: 10;
}

.status-badge .iconfont {
	font-size: 28rpx;
	color: #2b8cee;
}

.status-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #2b8cee;
}

.model-container {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.glow-effect {
	position: absolute;
	width: 300rpx;
	height: 300rpx;
	background-color: rgba(43, 140, 238, 0.2);
	border-radius: 50%;
	filter: blur(60rpx);
}

.pet-model {
	width: 80%;
	height: 80%;
	object-fit: contain;
}

.tracking-indicator {
	position: absolute;
	bottom: 32rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	background-color: rgba(255, 255, 255, 0.5);
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
	backdrop-filter: blur(10rpx);
}

.tracking-indicator .iconfont {
	font-size: 32rpx;
	color: #6b7280;
}

.tracking-text {
	font-size: 24rpx;
	color: #6b7280;
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
	border-radius: 64rpx;
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
	color: #2b8cee;
}

.spinner {
	width: 44px;
	height: 44px;
	animation: spinner-y0fdc1 2s infinite ease;
	transform-style: preserve-3d;
}

.spinner > view {
	background-color: rgba(43, 140, 238, 0.2);
	height: 100%;
	position: absolute;
	width: 100%;
	border: 2px solid #2b8cee;
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
	padding: 48rpx 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.section-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #111418;
}

.view-history {
	font-size: 28rpx;
	font-weight: 600;
	color: #2b8cee;
}

.metrics-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 24rpx;
}

.metric-card {
	background-color: #ffffff;
	padding: 40rpx;
	border-radius: 32rpx;
	border: 2rpx solid #f3f4f6;
	box-shadow: 0 4rpx 32rpx rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 320rpx;
}

.metric-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.metric-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.metric-icon.steps {
	background-color: #eff6ff;
	color: #2b8cee;
}

.metric-icon.heart {
	background-color: #fef2f2;
	color: #ef4444;
}

.metric-icon .iconfont {
	font-size: 36rpx;
}

.metric-goal {
	font-size: 24rpx;
	color: #9ca3af;
}

.metric-status {
	font-size: 24rpx;
	font-weight: bold;
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
}

.metric-status.normal {
	background-color: #dcfce7;
	color: #16a34a;
}

.metric-value-wrap {
	margin-top: 16rpx;
}

.metric-value {
	font-size: 48rpx;
	font-weight: 800;
	color: #111418;
}

.metric-label {
	font-size: 28rpx;
	color: #6b7280;
	margin-top: 8rpx;
	display: block;
}

.heart-rate-value {
	display: flex;
	align-items: baseline;
	gap: 16rpx;
}

.metric-unit {
	font-size: 28rpx;
	color: #9ca3af;
	font-weight: normal;
}

.progress-bar {
	width: 100%;
	height: 12rpx;
	background-color: #f3f4f6;
	border-radius: 6rpx;
	overflow: hidden;
	margin-top: 16rpx;
}

.progress-fill {
	height: 100%;
	border-radius: 6rpx;
}

.progress-fill.steps {
	background-color: #2b8cee;
}

.heart-rate-chart {
	display: flex;
	align-items: flex-end;
	gap: 8rpx;
	height: 64rpx;
	margin-top: 16rpx;
}

.chart-bar {
	flex: 1;
	background-color: #fca5a5;
	border-radius: 4rpx;
	min-height: 20%;
}

.chart-bar:nth-child(4) {
	background-color: #ef4444;
}

.sleep-card {
	background-color: #ffffff;
	padding: 48rpx;
	border-radius: 32rpx;
	border: 2rpx solid #f3f4f6;
	box-shadow: 0 4rpx 32rpx rgba(0, 0, 0, 0.04);
	margin-bottom: 24rpx;
}

.sleep-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.sleep-icon-wrap {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.sleep-icon {
	width: 64rpx;
	height: 64rpx;
	background-color: #eef2ff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6366f1;
}

.sleep-icon .iconfont {
	font-size: 36rpx;
}

.sleep-title-wrap {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.sleep-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #111418;
}

.sleep-subtitle {
	font-size: 24rpx;
	color: #6b7280;
}

.sleep-duration {
	font-size: 40rpx;
	font-weight: bold;
	color: #111418;
}

.sleep-duration .unit {
	font-size: 28rpx;
	color: #9ca3af;
	font-weight: normal;
}

.sleep-phases {
	margin-bottom: 24rpx;
}

.phase-bar {
	display: flex;
	height: 32rpx;
	border-radius: 16rpx;
	overflow: hidden;
	gap: 4rpx;
}

.phase {
	height: 100%;
}

.phase.deep {
	background-color: #a5b4fc;
}

.phase.light {
	background-color: #6366f1;
}

.phase.rem {
	background-color: #c7d2fe;
}

.sleep-legend {
	display: flex;
	justify-content: space-between;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.legend-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
}

.legend-dot.deep {
	background-color: #a5b4fc;
}

.legend-dot.light {
	background-color: #6366f1;
}

.legend-dot.rem {
	background-color: #c7d2fe;
}

.legend-text {
	font-size: 24rpx;
	color: #6b7280;
}

.metrics-row.small {
	margin-bottom: 24rpx;
}

.stat-card {
	background-color: #ffffff;
	padding: 32rpx;
	border-radius: 32rpx;
	border: 2rpx solid #f3f4f6;
	box-shadow: 0 4rpx 32rpx rgba(0, 0, 0, 0.04);
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.stat-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.stat-icon.calories {
	background-color: #fff7ed;
	color: #f97316;
}

.stat-icon.temp {
	background-color: #f0fdfa;
	color: #14b8a6;
}

.stat-icon .iconfont {
	font-size: 40rpx;
}

.stat-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #6b7280;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #111418;
}

.stat-unit {
	font-size: 24rpx;
	color: #9ca3af;
	font-weight: normal;
}

.location-card {
	position: relative;
	height: 256rpx;
	border-radius: 32rpx;
	overflow: hidden;
	border: 2rpx solid #f3f4f6;
}

.location-bg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	opacity: 0.8;
}

.location-overlay {
	position: absolute;
	inset: 0;
	background: linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%);
}

.location-content {
	position: relative;
	z-index: 10;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 40rpx;
}

.location-badge {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.location-icon {
	width: 48rpx;
	height: 48rpx;
	background-color: #2b8cee;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(43, 140, 238, 0.3);
}

.location-icon .iconfont {
	font-size: 28rpx;
	color: #ffffff;
}

.location-label {
	font-size: 24rpx;
	font-weight: bold;
	color: #2b8cee;
	text-transform: uppercase;
	letter-spacing: 2rpx;
}

.location-address {
	font-size: 36rpx;
	font-weight: bold;
	color: #111418;
	margin-bottom: 8rpx;
}

.location-time {
	font-size: 24rpx;
	color: #6b7280;
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
