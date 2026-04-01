<template>
	<view class="search_container">
		<!-- #ifdef MP-WEIXIN -->
		<!-- 微信小程序自定义导航栏（店铺页面） -->
		<view v-if="shopId !== 0" class="wx-custom-navbar">
			<view class="wx-navbar-status-bar" :style="{height: statusBarHeight + 'px'}"></view>
			<view class="wx-navbar-content" :style="{height: navbarContentHeight + 'px'}">
				<view class="wx-navbar-back" @click="goBack">
					<uni-icons type="back" size="20" color="#000000"></uni-icons>
				</view>
				<view class="wx-navbar-title">{{ shopTitle }}</view>
				<view class="wx-navbar-right"></view>
			</view>
		</view>
		<!-- #endif -->
		<!-- <view class="search" :class="{'search-not-home':bSuspend,'position-fixed':scrollFixed}" :style="{backgroundColor: bSuspend ? nBackgroundColor : sBgColor}"> -->
		<view class="search" :class="{'search-not-home':bSuspend,'position-fixed':scrollFixed}" :style="searchStyle">
			<block v-if="shopId === 0">
			<!-- #ifdef APP-PLUS -->
			<!-- 这里是状态栏 -->
			<view class="status_bar"></view>
			<view class="logo_wrap">
				<view style="margin-left: 33%;margin-right: 50rpx;width: 80rpx;" :class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
				<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
				<view style="margin-left: 50rpx;width: 80rpx;" :class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view>
				<!-- <image :src="logo" style="height: 64rpx;" mode="heightFix" @click="linkTo"></image> -->
				<!-- <uni-icons type="scan" size="24" :color="nFontColor" @click="scanClick"></uni-icons> -->
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
				<!-- <image :src="logo"
					:style="{height: menuButtonInfo.height + 'px', margin: `${menuButtonInfo.top}px 0 0 ${vw - menuButtonInfo.right}px`}"
					mode="heightFix" @click="linkTo"></image> -->
				<!-- 店铺页面不显示货源/工厂切换 -->
			<!-- #endif -->
			</block>
			<!-- #ifdef H5 -->
			<view style="height: 100rpx;"></view>
			<!-- #endif -->
			<view class="input_main">
				<view class="input_view">
					<view style="align-items: center;display: flex;flex-direction: row;">
						<uni-icons type="scan" size="18" :color="tFontColor" @click="scanClick"></uni-icons>
						<view class="placeholder_text" :style="placeholderStyle" @click="searchFocus">{{searchValue}}</view>
					</view>
					<view style="align-items: center;display: flex;flex-direction: row;">
						<uni-icons type="camera" size="18" :color="tFontColor" @tap="chooseImage"></uni-icons>
						<view style="background-color: #aaaaaa;height: 30rpx;width: 2rpx;margin-left: 20rpx;margin-top: 4rpx;"></view>
						<view class="placeholder_texts" @click="searchFocus">搜索</view>
					</view>
				</view>
				<!-- <view class="message" v-if="bMessage">
					<text class="txt" v-if="isUnread"></text>
					<uni-icons type="chat" size="24" :color="nFontColor" @click="message"></uni-icons>
				</view> -->
			</view>
			<view class="mask" v-if="bSuspend"></view>
		</view>
		<!-- <view class="ms-search-wraper">
			<view class="hot-search">
				<view class="ms-search-tags">
					<text class="text uni-ellipsis" v-for="(item,index) in search_keywords" :key="index" @click="searchTag(item)">{{ item }}</text>
				</view>
			</view>
		</view> -->
		<view class="seize-seat" v-if="scrollFixed" :style="{'height':height + 'px'}"></view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import universal from '@/common/mixins/universal.js';
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	import { compressImage } from '@/common/compressImage.js'
	// #ifdef MP-WEIXIN
	import { mapState } from 'vuex'
	// #endif
	export default {
		name: 'search',
		props: ["module", "preview", 'shopId', 'scrollFixed', 'isUnread', 'fristBackgroundColor'],
		mixins: [universal],
		data() {
			return {
				leftState: false,
				nFontColor: '#FFFFFF',
				nBackgroundColor: '#FFFFFF',
				tFontColor: '#999',
				fixed: true,
				titleNView: false,
				statusBar: false,
				height: 0,
				menuButtonInfo: {},
				logo: '',
				logoLink: '',
				vw: 375,
				search_keywords:[],
				latelyKeyword:[],
				imageSrc:'',
				newChooseImage:'',
				
				isDefine:1,
				list:[],
				navIndex:0,
				// #ifdef MP-WEIXIN
				wxNavBarHeight: 0, // 微信小程序导航栏高度
				statusBarHeight: 0, // 状态栏高度
				navbarContentHeight: 44, // 导航栏内容高度
				// #endif
			}
		},
		components: {
			uniNavBar,
			uniIcons
		},
		created() {
			const {
				windowWidth
			} = uni.getSystemInfoSync();
			this.vw = windowWidth;
			// #ifdef APP-PLUS
			this.logo = uni.getStorageSync('configData').app_top_img || ''
			this.logoLink = uni.getStorageSync('configData').app_top_url || ''
			if (this.shopId == 0) {
				this.leftState = true;
				this.nBackgroundColor = "#ffffff";
				this.titleNView = true;
				this.statusBar = true
			}
			// #endif

			// #ifdef MP-WEIXIN
			this.logo = uni.getStorageSync('configData').wxapp_top_img || ''
			this.logoLink = uni.getStorageSync('configData').wxapp_top_url || ''
			this.statusBar = true
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 0;
			// 计算微信小程序导航栏总高度：状态栏 + 导航栏内容
			this.wxNavBarHeight = this.statusBarHeight + this.navbarContentHeight;
			// #endif

		},
		mounted() {
			let _this = this;
			_this.$nextTick(() => {
				let info1 = uni.createSelectorQuery().in(this).select(".search");
				setTimeout(() => {
					info1.boundingClientRect(function(data) {
						if (data) {
							_this.height = data.height
							getApp().globalData.navigationBarHeight = data.height
						}
					}).exec();
				}, 500)
			})
			this.shopConfig();
		},
		computed: {
			// #ifdef MP-WEIXIN
			...mapState({
				shopInfo: state => state.shop.shopInfo,
			}),
			shopTitle() {
				return this.shopInfo && this.shopInfo.rz_shop_name ? this.shopInfo.rz_shop_name : '店铺首页';
			},
			// #endif
			searchValue() {
				if (this.shopId == 0) {
					return this.getText({
						dataNext: "allValue",
						attrName: "searchValue",
						defaultValue: '输入搜索关键词'
					})
				} else {
					return '输入搜索关键词'
				}
			},
			sBgColor() {
				if (this.shopId == 0) {
					if (!this.scrollFixed) {
						return this.getText({
							dataNext: "allValue",
							attrName: "bgColor",
							defaultValue: "#ffffff"
						})
					} else {
						return this.fristBackgroundColor
					}
				} else {
					return this.fristBackgroundColor
				}
			},
			bMessage() {
				let isMessageSel = this.module ? this.module.isMessageSel : 0
				return isMessageSel == 0 && this.shopId == 0 ? true : false
			},
			bSuspend() {
				return this.shopId == 0 ? false : true
			},
			placeholderStyle() {
				return "color:" + this.tFontColor
			},
			// #ifdef MP-WEIXIN
			searchStyle() {
				let style = "background-color: #F9F9F9;";
				// 店铺页面：搜索框在自定义导航栏下方
				if (this.bSuspend && this.shopId !== 0 && this.wxNavBarHeight > 0) {
					style += `top: ${this.wxNavBarHeight}px;`;
				}
				return style;
			},
			// #endif
			// #ifndef MP-WEIXIN
			searchStyle() {
				return "background-color: #F9F9F9;";
			},
			// #endif
		},
		methods: {
			// #ifdef MP-WEIXIN
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// #endif
			isChange:function(){
				this.isDefine = 1
				uni.setStorageSync("isDefine", this.isDefine);
				uni.setStorageSync("isStop", false);
				console.log(this.isDefine)
			},
			isChanges:function(){
				this.isDefine = 2
				uni.setStorageSync("isDefine", this.isDefine);
				uni.setStorageSync("isStop", false);
				this.isDefine = uni.getStorageSync('isDefine')
					let referer = uni.getStorageSync('platform').toLowerCase()
					if (uni.getStorageSync('platform') == 'MP-WEIXIN') {
						referer = 'wxapp'
					}
					
					uni.request({
						url:this.websiteUrl + '/api/shop/page-nav',
						method:'GET',
						data: {
							device:referer
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						success: (res) => {
							let data = res.data;
							if(data.status == "success"){
								this.list = data.data
								console.log(this.list)
								uni.setStorageSync("list", this.list);
							}
						}
					});
				console.log(this.isDefine)
			},
			shopConfig(){
				//读取本地缓存
				uni.getStorage({
					key:'LatelyKeyword',
					success: (res) => {
						this.latelyKeyword = res.data
						this.placeholder = res.data[0]
						this.placeholderState = 1
					}
				});
				uni.request({
					url:this.websiteUrl + '/api/shop/config',
					method:'GET',
					data:{
						app_version: incrementVersion()
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						if(data.search_keywords){
							this.search_keywords = data.search_keywords.split(',')
						}
					}
				});
			},
			unique(arr){
				//去除重复项
				var result = [], hash = {};
				for (var i = 0, elem; (elem = arr[i]) != null; i++) {
					if (!hash[elem]) {
						result.push(elem);
						hash[elem] = true;
					}
				}
				return result;
			},
			searchTag(val){
				let arr = []
				let arr2 = this.latelyKeyword;
				console.log(val)
				if(arr2){
					arr2.unshift(val);
					arr = this.unique(arr2);
				}
			
				if(arr.length > 0){
					//存本地缓存
					uni.setStorage({
						key:'LatelyKeyword',
						data:arr,
						success: (res) => {
							if(this.shopId > 0){
								uni.navigateTo({
									url:'/pagesD/shop/shopGoods/shopGoods?keywords=' + val + '&ru_id=' + this.shopId
								})
							}else{
								uni.navigateTo({
									url:'/pagesD/goodslist/goodslist?keywords='+val
								})
							}
						}
					})
				}
			},
			linkTo() {
				if (this.logoLink) {
					if (this.logoLink.startsWith('http')) {
						this.$outerHref(this.logoLink)
					} else {
						this.$outerHref(this.logoLink, 'app')
					}
				}
			},
			message() {
				if (this.$isLogin()) {
					uni.navigateTo({
						url: '/pagesB/messagelist/messagelist'
					})
				} else {
					uni.showModal({
						content: "您需要登录会员!",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
				}
			},
			searchFocus() {
				//全局变量integration赋值
				//getApp().globalData.integration = 0;
				uni.navigateTo({
					url: '/pagesD/search/search?shopId=' + this.shopId
				});
			},
			scanClick() {
				uni.scanCode({
					success: (res) => {
						if (this.$isLogin()) {
							let result = JSON.parse(res.result);
							let sid = result.sid;
							let url = result.url;
							let timestamp = Date.parse(new Date()) / 1000;
							uni.request({
								url: this.websiteUrl + '/api/appqrcode/scancode',
								method: 'POST',
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								data: {
									sid: sid,
									login_time: timestamp
								},
								success: (res) => {
									if (sid) {
										uni.navigateTo({
											url: '/pagesC/scan/scan?sid=' + sid + '&url=' +
												url
										});
									} else {
										uni.showToast({
											title: '请扫描正确的二维码',
											icon: 'none'
										})
									}
								},
								fail: (res) => {
									console.log(res, 2)
								}
							})
						} else {
							uni.navigateTo({
								url: '/pagesB/login/login?delta=1'
							})
						}
					}
				})
			},
			chooseImage(val){
				let that = this
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success:(res)=>{
						that.imageSrc = res.tempFilePaths[0];
		
						// #ifdef APP-PLUS
						that.uploadImage(val);
						// #endif
		
						// #ifdef MP-WEIXIN
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if(size > maxSize){
							uni.compressImage({
								src:res.tempFilePaths[0],
								quality:10,
								success:(result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage(val);
								},
								fail:(result) => {
									console.log(result)
								}
							})
						}else{
							that.uploadImage(val);
						}
						// #endif
					}
				})
			},
			async uploadImage(val){
				let that = this;
				uni.showLoading({ mask:true, title: this.$t('lang.shang_shi')});
		
				//app压缩图片
				// #ifdef APP-PLUS
				that.imageSrc = await compressImage(that.imageSrc);
				// #endif
		
				pathToBase64(that.imageSrc).then(base64 => {
					that.$store.dispatch('setMaterial',{
						file:{content:base64},
						type:'touxian'
					}).then(data=>{
						if(data.status == 'success'){
							uni.hideLoading();
							uni.request({
								url: this.websiteUrl + '/api/goods/imgsearch',
								method: 'GET',
								data: {
									imgurl: data.data[0]
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (resOne) => {
									if (resOne.data.status == 'success') {
										if(resOne.data.data != ''){
											uni.navigateTo({
												url:'/pagesD/goodslist/goodslist?keywords='+resOne.data.data
											})
										}else{
											uni.showToast({
												title: '未识别到商品信息',
												duration: 2000
											});
										}	
									}
								}
							})
							
							
							
						}
					})
				}).catch(error => {
					console.error(error,5);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_container {
		/* #ifdef APP-PLUS */
		z-index: 99999;  /* 关键：和首页一样的高 z-index */
		/* #endif */
		/* #ifdef MP-WEIXIN */
		/* 微信小程序：搜索框需要从系统导航栏下方开始 */
		padding-top: 0;
		/* #endif */
		
		.status_bar {
			height: 40px;
			background-color: #f9f9f9;
			width: 100%;
		}

		.input_main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// padding: 20rpx 20rpx;
			/* #ifdef APP-PLUS */
			padding-top: 10rpx;
			/* #endif */
			line-height: 0;
		}

		.input_view {
			flex: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 70rpx;
			padding: 0 4rpx 0 30rpx;
			border-radius: 14rpx;
			color: #999;
			border: 2rpx solid #FE0302;
			background-color: #fff;
			.placeholder_text {
				font-size: 28rpx;
				margin-left: 20rpx;
				width: 420rpx;
			}
			.placeholder_texts {
				font-size: 28rpx;
				margin-left: 20rpx;
				background-color: #FE0302;
				color: #ffffff;
				border-radius: 14rpx;
				padding: 8rpx 24rpx;
			}
		}

		.logo_wrap {
			display: flex;
			text-align: center;
			margin: 0 auto;
			height: 50rpx;
			// justify-content: space-between;
			background-color: #ffffff;
			align-items: center;
			padding: 10rpx 24rpx 10rpx 14rpx;
		}
	}

	/* 以下是原有样式 */
	.search-not-home{ 
		position: fixed; 
		left: 0; 
		right: 0; 
		/* #ifdef APP-PLUS */
		top: 84px;  /* 在自定义导航栏下方（40px 状态栏 + 44px 导航内容） */
		/* #endif */
		/* #ifdef MP-WEIXIN */
		/* 微信小程序导航栏高度通过内联样式动态设置 */
		/* #endif */
		/* #ifndef APP-PLUS || MP-WEIXIN */
		top: 0;
		/* #endif */
		z-index: 99;
		/* 开启硬件加速，防止移动 */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		/* #ifdef APP-PLUS */
		/* iOS 防止键盘弹起时移动 */
		position: fixed !important;
		left: 0 !important;
		right: 0 !important;
		/* #endif */
	}
	
	.search-not-home .mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, .8) 0, transparent);
		z-index: -1;
	}

	.position-fixed {
		position: fixed;
		top: 0;
		z-index: 998;
		width: 100%;
	}
	
	.message{
		position: relative;
		margin-left: 20rpx;
	}
	
	.message .txt{
		background: #fff;
		height: 10upx;
		width: 10upx;
		position: absolute;
		right:-8upx;
		top: 10upx;
		z-index: 99;
		border-radius: 50%;
	}
	/*search*/
	.ms-search-wraper{ position: relative; padding: 0 20upx;}
	.hot-search{ padding-top: 0upx;}
	.ms-search-tags .text{color: #828282; padding: 2upx 20upx; display: inline-block; background-color: #EDEDED; border-radius: 50upx; font-size: 25upx; max-width: 200upx; margin:0 15upx 15upx 0;}

	// 顶部切换
	.graying{
		color: #828282;
		font-size: 14px;
	}
	.darking{
		color: #000000;
		font-size: 16px;
	}

	/* 微信小程序自定义导航栏 */
	/* #ifdef MP-WEIXIN */
	.wx-custom-navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99998;
		background-color: #FFFFFF;
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
	}

	.wx-navbar-status-bar {
		width: 100%;
		background-color: #FFFFFF;
	}

	.wx-navbar-content {
		display: flex;
		align-items: center;
		padding: 0 15px;
		position: relative;
		background-color: #FFFFFF;
	}

	.wx-navbar-back {
		width: 44px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wx-navbar-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 18px;
		font-weight: 500;
		color: #000000;
	}

	.wx-navbar-right {
		width: 44px;
	}
	/* #endif */
</style>
