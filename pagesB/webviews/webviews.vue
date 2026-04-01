<template>
	<view class="page-wrapper">
		<web-view :src="jumpUrl" :update-title='updateTitle'></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jumpUrl: '',
				updateTitle: false
			}
		},

		onLoad() {
			var that = this
			console.log(uni.getStorageSync('url'))
			that.jumpUrl = uni.getStorageSync('url')
		},
		onReady() {
			// #ifdef APP-PLUS
			// 设置导航栏为白色
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#FFFFFF',
				animation: {
					duration: 0,
					timingFunc: 'easeIn'
				}
			})
			// #endif
			uni.setNavigationBarTitle({
				title: uni.getStorageSync('webtitle') || ''
			})
		},
		methods: {

		},
		// 下拉刷新数据
		onPullDownRefresh() {

		},
		onUnload() {
			uni.removeStorageSync("webtitle")
		},
	}
</script>

<style>
	.page-wrapper {
		width: 100%;
		height: 100vh;
	}
</style>