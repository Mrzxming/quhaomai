<template>
	<view class="snapshot-page" :style="pageStyle">
		<!-- 导航栏 -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="nav_bar">
			<!-- #ifdef APP-PLUS -->
			<view class="status_bar" :style="{height: statusBarHeight + 'px'}"></view>
			<!-- #endif -->
			<view class="nav-content">
				<view class="nav-left" @click="goBack">
					<text class="iconfont icon-find-fanhui"></text>
				</view>
				<view class="nav-title">交易快照</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="wx_nav_bar" :style="{paddingTop: `${menuButtonInfo.top}px`}">
			<view class="wx_nav_left" @click="goBack">
				<text class="iconfont icon-find-fanhui"></text>
			</view>
			<view class="wx_nav_title">交易快照</view>
		</view>
		<!-- #endif -->

		<!-- 轮播图 -->
		<view class="swiper_wrap" v-if="swiperData && swiperData.length > 0">
			<view class="swiper_warp_layer">
				<swiper class="swiper" :circular="true" :current="current" :interval="3000"
					:duration="1000" @change="changeSwiper">
					<swiper-item v-for="(item, index) in swiperData" :key="index">
						<view @click="previewImg(index, swiperData.map(val => val.img_url))">
							<image class="swiper_img" :src="item.img_url" @error="handleImageError(item, index)"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="indicator_dots" v-if="swiperData.length > 1">
					<text class="curr_dots">{{ currSwiperPic + 1 }}</text>/{{swiperData.length}}
				</view>
			</view>
		</view>

		<!-- 商品名称 -->
		<view class="goods_name_wrap" v-if="snapshotInfo && snapshotInfo.goods_name">
			<view class="goods_name">{{ snapshotInfo.goods_name }}</view>
		</view>

		<!-- 交易快照提示 -->
		<view class="snapshot-tip">
			<view class="tip-content">
				当前页面为订单快照,包含订单创建时的商品描述和下单信息,买卖双方和平台在发生交易争议时,将作为判定依据。
			</view>
			<view class="tip-link" @click="viewLatestGoods" v-if="snapshotInfo && snapshotInfo.goods_id">
				查看最新商品详情
			</view>
		</view>

		<!-- 店铺信息 -->
		<view class="shop-info" v-if="snapshotInfo && snapshotInfo.shop_name">
			<view class="shop-name">{{ snapshotInfo.shop_name }}</view>
			<view class="shop-btn" @click="goToShop" v-if="snapshotInfo.shop_id && snapshotInfo.shop_id > 0">进店逛逛</view>
		</view>

		<!-- 商品详情 -->
		<view class="goods-detail" v-if="snapshotInfo">
			<view class="detail-title">商品介绍</view>
			<view class="detail-content" v-if="snapshotInfo.goods_desc">
				<rich-text :nodes="snapshotInfo.goods_desc" :user-select="false"></rich-text>
			</view>
			<view class="detail-empty" v-else>暂无商品详情</view>
		</view>
	</view>
</template>

<script>
	import apiUser from '@/config/api/user.js'
	import * as localConfig from '@/config/local/config'

	export default {
		data() {
			return {
				tradeId: 0,
				snapshotInfo: null,
				current: 0,
				currSwiperPic: 0,
				swiperData: [],
				websiteUrl: localConfig.websiteUrl,
			menuButtonInfo: {},
			statusBarHeight: 0
		};
	},
	computed: {
		pageStyle() {
			// #ifdef APP-PLUS
			return {
				paddingTop: (this.statusBarHeight * 2 + 88) + 'rpx'
			};
			// #endif
			// #ifndef APP-PLUS
			return {};
			// #endif
		}
	},
		onLoad(e) {
			if (e.tradeId) {
				this.tradeId = e.tradeId;
				this.getSnapshotInfo();
			}
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef APP-PLUS || H5
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 0;
			// #endif
		},
		methods: {
			// 获取交易快照详情
			async getSnapshotInfo() {
				try {
					uni.showLoading({
						title: '加载中...'
					});
					const res = await apiUser.getSnapshotInfo({
						tradeId: this.tradeId
					});
					uni.hideLoading();
					
					if (res.status === 'success' && res.data) {
						// 数据结构：res.data.goods 是商品信息，res.data.shop_information 是店铺信息
						const goodsData = res.data.goods || {};
						const shopData = res.data.shop_information || {};
						
						// 合并商品和店铺信息
						this.snapshotInfo = {
							...goodsData,
							shop_name: shopData.shop_name || shopData.rz_shop_name || '',
							ru_id: shopData.ru_id || shopData.shop_id || 0,
							shop_id: shopData.shop_id || shopData.ru_id || 0,
							goods_id: goodsData.goods_id || 0
						};
						
						console.log('快照数据:', this.snapshotInfo);
						
						// 处理轮播图数据 - 使用 goods.pictures 数组
						// 注意：pictures 在 data 的根级别，不在 goods 里面
						// 根据API返回，pictures 数组在 data 根级别，且URL已经是完整的 https:// 链接
						if (res.data.pictures && Array.isArray(res.data.pictures) && res.data.pictures.length > 0) {
							// pictures 数组中的URL已经是完整的 https:// 链接，直接使用
							this.swiperData = res.data.pictures.map((img, idx) => {
								// 如果已经是完整URL，直接使用；否则调用 getImageUrl 处理
								const imgUrl = (img && (img.indexOf('http://') === 0 || img.indexOf('https://') === 0)) 
									? img 
									: this.getImageUrl(img);
								console.log(`图片 ${idx} 原始URL:`, img, '处理后URL:', imgUrl);
								return {
									img_url: imgUrl
								};
							});
							console.log('使用 data.pictures 轮播图数据:', this.swiperData);
							// iOS上需要强制更新视图
							// #ifdef APP-PLUS
							this.$nextTick(() => {
								setTimeout(() => {
									this.$forceUpdate();
								}, 100);
							});
							// #endif
						} else if (goodsData.pictures && Array.isArray(goodsData.pictures) && goodsData.pictures.length > 0) {
							// 如果 pictures 在 goods 里面
							this.swiperData = goodsData.pictures.map((img, idx) => {
								const imgUrl = (img && (img.indexOf('http://') === 0 || img.indexOf('https://') === 0)) 
									? img 
									: this.getImageUrl(img);
								console.log(`图片 ${idx} 原始URL:`, img, '处理后URL:', imgUrl);
								return {
									img_url: imgUrl
								};
							});
							console.log('使用 goods.pictures 轮播图数据:', this.swiperData);
							// #ifdef APP-PLUS
							this.$nextTick(() => {
								setTimeout(() => {
									this.$forceUpdate();
								}, 100);
							});
							// #endif
						} else if (goodsData.goods_img) {
							// 如果没有pictures，使用主图
							const imgUrl = (goodsData.goods_img && (goodsData.goods_img.indexOf('http://') === 0 || goodsData.goods_img.indexOf('https://') === 0))
								? goodsData.goods_img
								: this.getImageUrl(goodsData.goods_img);
							console.log('使用 goods_img，原始URL:', goodsData.goods_img, '处理后URL:', imgUrl);
							this.swiperData = [{
								img_url: imgUrl
							}];
							console.log('使用 goods_img 轮播图数据:', this.swiperData);
							// #ifdef APP-PLUS
							this.$nextTick(() => {
								setTimeout(() => {
									this.$forceUpdate();
								}, 100);
							});
							// #endif
						}
					} else {
						uni.showToast({
							title: '获取交易快照失败',
							icon: 'none'
						});
					}
				} catch (err) {
					uni.hideLoading();
					uni.showToast({
						title: '获取交易快照失败',
						icon: 'none'
					});
				}
			},
			// 获取图片完整URL
			getImageUrl(imgPath) {
				if (!imgPath) {
					console.warn('getImageUrl: imgPath 为空');
					return '';
				}
				// 如果已经是完整的 http/https URL，直接返回（不做任何处理）
				if (imgPath.indexOf('http://') === 0 || imgPath.indexOf('https://') === 0) {
					console.log('getImageUrl: 完整URL，直接返回:', imgPath);
					return imgPath;
				}
				// 如果是相对路径，拼接完整URL
				// 去掉开头的斜杠（如果有）
				const cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
				const fullUrl = this.websiteUrl + '/' + cleanPath;
				console.log('getImageUrl: 相对路径，拼接后:', fullUrl);
				return fullUrl;
			},
			// 轮播图切换
			changeSwiper(e) {
				this.currSwiperPic = e.detail.current;
			},
			// 预览图片
			previewImg(index, urls) {
				uni.previewImage({
					current: index,
					urls: urls
				});
			},
			// 图片加载错误处理
			handleImageError(item, index) {
				console.error('图片加载失败:', item, '索引:', index);
				console.error('图片URL:', item.img_url);
				// iOS上如果图片加载失败，尝试重新加载
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform === 'ios') {
					this.$nextTick(() => {
						// 强制更新图片
						this.$set(this.swiperData[index], 'img_url', item.img_url + '?t=' + Date.now());
					});
				}
				// #endif
			},
			// 返回
			goBack() {
				uni.navigateBack();
			},
			// 查看最新商品详情
			viewLatestGoods() {
				if (this.snapshotInfo && this.snapshotInfo.goods_id && this.snapshotInfo.goods_id > 0) {
					uni.navigateTo({
						url: '/pagesC/goodsDetail/goodsDetail?id=' + this.snapshotInfo.goods_id
					});
				}
			},
			// 进入店铺
			goToShop() {
				if (this.snapshotInfo && this.snapshotInfo.ru_id && this.snapshotInfo.ru_id > 0) {
					// 参考 goodsDetail.vue 的跳转方式
					this.$outerHref(`/pagesD/shop/shopHome/shopHome?ru_id=${this.snapshotInfo.ru_id}`, 'app');
				} else if (this.snapshotInfo && this.snapshotInfo.shop_id && this.snapshotInfo.shop_id > 0) {
					// 如果没有 ru_id，使用 shop_id
					this.$outerHref(`/pagesD/shop/shopHome/shopHome?ru_id=${this.snapshotInfo.shop_id}`, 'app');
				}
			}
		}
	}
</script>

<style lang="scss">
	.snapshot-page {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 40rpx;
		overflow-x: hidden;
		/* #ifdef APP-PLUS */
		/* padding-top 通过计算动态设置 */
		/* #endif */
		/* #ifdef H5 */
		padding-top: 88rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 0;
		/* #endif */
	}

	/* 导航栏 */
	.nav_bar {
		background-color: #fff;
		position: sticky;
		top: 0;
		z-index: 999;
		/* #ifdef APP-PLUS */
		position: fixed;
		width: 100%;
		/* #endif */
	}

	/* #ifdef APP-PLUS */
	.status_bar {
		width: 100%;
	}
	/* #endif */
	
	/* #ifdef H5 */
	.status_bar {
		height: 0;
		display: none;
	}
	/* #endif */

	.nav-content {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding: 0 30rpx;
		position: relative;
	}

	.nav-left {
		position: absolute;
		left: 30rpx;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
	}

	/* 微信小程序导航栏 */
	.wx_nav_bar {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding: 0 30rpx;
		position: relative;
	}

	.wx_nav_left {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wx_nav_title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
	}

	/* 轮播图 */
	.swiper_wrap {
		position: relative;
		width: 100%;
		height: 750rpx;
		background-color: #fff;
	}
	
	.swiper_warp_layer {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.swiper {
		width: 100%;
		height: 750rpx;
	}

	.swiper_img {
		width: 100%;
		height: 750rpx;
		display: block;
	}

	.indicator_dots {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
	}

	/* 商品名称 */
	.goods_name_wrap {
		background-color: #fff;
		padding: 30rpx;
		margin-top: 20rpx;
	}

	.goods_name {
		font-size: 32rpx;
		color: #333;
		line-height: 1.6;
		font-weight: 500;
	}

	/* 交易快照提示 */
	.snapshot-tip {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.tip-content {
		font-size: 24rpx;
		color: #999;
		line-height: 1.6;
		margin-bottom: 20rpx;
	}

	.tip-link {
		font-size: 28rpx;
		color: #1890ff;
		text-decoration: underline;
	}

	/* 店铺信息 */
	.shop-info {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.shop-name {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.shop-btn {
		padding: 10rpx 30rpx;
		border: 1rpx solid #1890ff;
		color: #1890ff;
		border-radius: 8rpx;
		font-size: 26rpx;
	}

	/* 商品详情 */
	.goods-detail {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.detail-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 30rpx;
	}

	.detail-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.8;
		word-break: break-all;
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
	}
	
	/* 修复图片超出问题 - 使用 ::v-deep 语法（dart-sass 支持） */
	.detail-content ::v-deep image,
	.detail-content ::v-deep img {
		max-width: 100% !important;
		width: 100% !important;
		height: auto !important;
		display: block;
		box-sizing: border-box;
	}

	.detail-empty {
		text-align: center;
		color: #999;
		font-size: 28rpx;
		padding: 60rpx 0;
	}
</style>
