<template>
	<view class="search_container">
		<!-- <view class="search" :class="{'search-not-home':bSuspend,'position-fixed':scrollFixed}" :style="{backgroundColor: bSuspend ? nBackgroundColor : sBgColor}"> -->
		<view class="search" :class="{'search-not-home':bSuspend,'position-fixed':scrollFixed}">
			<block v-if="shopId === 0">
			<!-- #ifdef APP-PLUS -->
			<!-- 这里是状态栏 -->
			<view class="status_bar"></view>
			<view class="logo_wrap">
				<!-- <view style="margin-left: 33%;margin-right: 50rpx;width: 80rpx;" :class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
				<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
				<view style="margin-left: 50rpx;width: 80rpx;" :class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view> -->
				<!-- <image :src="logo" style="height: 64rpx;" mode="heightFix" @click="linkTo"></image> -->
				<!-- <uni-icons type="scan" size="24" :color="nFontColor" @click="scanClick"></uni-icons> -->
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <view class="status_bar"></view> -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- <image :src="logo"
					:style="{height: menuButtonInfo.height + 'px', margin: `${menuButtonInfo.top}px 0 0 ${vw - menuButtonInfo.right}px`}"
					mode="heightFix" @click="linkTo"></image> -->
				<!-- <view style="display: flex;flex-direction: row;align-items: center;width: 100%;height: 50px;margin-left: 30%;margin-top: 40px;">
					<view style="margin-right: 50rpx;width: 80rpx;" :class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
					<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
					<view style="margin-left: 50rpx;width: 80rpx;" :class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view>
				</view> -->
				<view class="input_main" style="width: 73%;" :style="{height: menuButtonInfo.height + 'px', margin: `0 0 0 ${vw - menuButtonInfo.right}px`}">
					<view class="input_view" @click="searchFocus">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<uni-icons type="search" size="18" :color="tFontColor"></uni-icons>
							<view class="placeholder_text" :style="placeholderStyle">{{searchValue}}</view>
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- <uni-icons type="camera" size="18" :color="tFontColor"></uni-icons> -->
							<view class="placeholder_texts">搜索</view>
						</view>
					</view>
					<!-- <view class="message" v-if="bMessage">
						<text class="txt" v-if="isUnread"></text>
						<uni-icons type="chat" size="24" :color="nFontColor" @click="message"></uni-icons>
					</view> -->
				</view>
				<view class="mask" v-if="bSuspend"></view>
			<!-- #endif -->
			</block>
			<!-- #ifdef APP-PLUS -->
			<view class="input_main">
				<view class="input_view" @click="searchFocus">
					<view style="align-items: center;display: flex;flex-direction: row;">
						<uni-icons type="search" size="18" :color="tFontColor"></uni-icons>
						<view class="placeholder_text" :style="placeholderStyle">{{searchValue}}</view>
					</view>
					<view style="align-items: center;display: flex;flex-direction: row;">
						<!-- <uni-icons type="camera" size="18" :color="tFontColor"></uni-icons> -->
						<view class="placeholder_texts">搜索</view>
					</view>
				</view>
				<!-- <view class="message" v-if="bMessage">
					<text class="txt" v-if="isUnread"></text>
					<uni-icons type="chat" size="24" :color="nFontColor" @click="message"></uni-icons>
				</view> -->
			</view>
			<view class="mask" v-if="bSuspend"></view>
				<!-- #endif -->
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
				isDefine:1,
				list:[],
				navIndex:0
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
			}
		},
		methods: {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_container {
		background-color: #ffffff;
		.status_bar {
			height: 20px;
			background-color: #ffffff;
			width: 100%;
		}

		.input_main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 20rpx;
			/* #ifdef APP-PLUS */
			padding-top: 10rpx;
			/* #endif */
			line-height: 0;
			background-color: #ffffff;
		}

		.input_view {
			flex: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 70rpx;
			padding: 0 4rpx 0 30rpx;
			border-radius: 14rpx;
			color: #000000;
			// border: 2rpx solid #FE0302;
			background-color: #F9F9F9;
			.placeholder_text {
				font-size: 28rpx;
				margin-left: 20rpx;
			}
			.placeholder_texts {
				font-size: 28rpx;
				margin-left: 20rpx;
				background-color: #F9F9F9;
				color: #000000;
				border-radius: 10rpx;
				padding: 4rpx 24rpx;
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
			padding: 0 24rpx 0 14rpx;
		}
	}

	/* 以下是原有样式 */
	.search-not-home{ 
		position: fixed; 
		left: 0; 
		right: 0; 
		top: 0; 
		z-index: 99;
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
</style>
