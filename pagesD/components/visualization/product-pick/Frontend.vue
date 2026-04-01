<template>
	<view>
		<!-- 视频模块 -->
		<view style="margin: 20rpx;">
			<view style="display: flex;flex-direction: row;width: 100%;">
				<view style="width: 50%;border-radius: 20rpx;" @click="toshoplist">
					<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/admin/images/tabbar/zhibo.png"
						style="height: 50rpx;width: 100%;" mode="widthFix"></image>
					<!-- <video autoplay="true" :src="videoList[0].goods_thumb" style="width: 100%;height: 430rpx;margin-top: -16rpx;border-radius: 0 0 20rpx 20rpx;" v-if="videoList[0].goods_thumb"></video> -->
					<image :src="videoList[0].goods_thumb"
						style="width: 100%;height: 430rpx;margin-top: -16rpx;border-radius: 0 0 20rpx 20rpx;"
						v-if="videoList[0].goods_thumb"></image>
					<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg" class="image" v-else></image>
					<!--  @click="showPopup(videoList[0].goods_id, 0)" -->
				</view>
				<view style="width: 50%;margin-left: 20rpx;">
					<view class="shipin_1">
						<view style="display: flex;flex-direction: row;margin-left: 20rpx;" @click="toSearch('新品')">
							<view style="font-weight: bolder;font-size: 28rpx;">新品</view>
							<view class="shipin_3">
								潮流上新</view>
						</view>
						<view style="display: flex;flex-direction: row;margin-top: 10rpx;">
							<view style="text-align: center;width: 50%;" @click="linkHref(newList[0].goods_id)">
								<view>
									<image :src="newList[0].goods_thumb"
										style="width: 110rpx;height: 110rpx;border-radius: 10rpx;"
										v-if="newList[0].goods_thumb"></image>
									<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg" class="image" v-else></image>
								</view>
								<view class="newPrice">
									￥{{newList[0].shop_price}}</view>
							</view>
							<view style="text-align: center;margin-left: 20rpx;" @click="linkHref(newList[1].goods_id)">
								<view>
									<image :src="newList[1].goods_thumb"
										style="width: 110rpx;height: 110rpx;border-radius: 10rpx;"
										v-if="newList[1].goods_thumb"></image>
									<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg" class="image" v-else></image>
								</view>
								<view class="newPrices">
									￥{{newList[1].shop_price}}</view>
							</view>
						</view>
					</view>
					<view class="shipin_2" style="margin-top: 14rpx;">
						<view style="display: flex;flex-direction: row;margin-left: 20rpx;" @click="toSearch('热销')">
							<view style="font-weight: bolder;font-size: 28rpx;">热销</view>
							<view class="shipin_4">
								全国包邮</view>
						</view>
						<view style="display: flex;flex-direction: row;">
							<view style="text-align: center;width: 50%;" @click="linkHref(hotList[0].goods_id)">
								<view>
									<image :src="hotList[0].goods_thumb"
										style="width: 110rpx;height: 110rpx;border-radius: 10rpx;"
										v-if="hotList[0].goods_thumb"></image>
									<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg" class="image" v-else></image>
								</view>
								<view class="newPrice">

									￥{{hotList[0].shop_price}}</view>
							</view>
							<view style="text-align: center;margin-left: 20rpx;" @click="linkHref(hotList[1].goods_id)">
								<view>
									<image :src="hotList[1].goods_thumb"
										style="width: 110rpx;height: 110rpx;border-radius: 10rpx;"
										v-if="hotList[1].goods_thumb"></image>
									<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg" class="image" v-else></image>
								</view>
								<view class="newPrices">
									￥{{hotList[1].shop_price}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="product-new" style="padding-bottom: 120upx;" :style="{'min-height':minHeight}">
			<!-- <view class="tabs">
			<view class="item" v-for="(item,index) in tabs" :key="index" :class="{'active':filter == index}" @click="tabClick(index)">
				<text class="tit">{{item.tit}}</text>
				<text class="txt">{{item.txt}}</text>
			</view>
		</view> -->

			<block v-if="filter != 1">
				<block v-if="!dscLoading">
					<view class="goods-list" v-if="prolist">
						<view class="item" v-for="(item, index) in prolist" :key="index">
							<view v-if="home_list_one.length > 0&& index==0">
								<view class="img-box">
									<image class="img" :src="home_list_one[0].ad_code" mode="widthFix"></image>
								</view>
							</view>
							<view v-else-if="home_list_one.length == 0 && index==0">
								<view class="img-box" @click="toMerchants">
									<image class="img" src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1690765680498.png" mode="widthFix"></image>
								</view>
							</view>
							<view v-else @click="linkHref(item.goods_id)">
								<view class="img-box">
									<image class="img" :src="item.goods_thumb" mode="widthFix"></image>
									<view class="goods-label-suspension"
										v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									</view>
								</view>
								<view class="info-box">
									<view class="goods-name twolist-hidden">
										<image class="country_icon" :src="item.country_icon" v-if="item.country_icon">
										</image>{{item.title || item.goods_name}}
									</view>
									<currency-price :price="item.shop_price" :size="18"
										style="display: block; margin-top: 8px;"></currency-price>
									<view class="label-list" v-if="item.goods_label && item.goods_label.length > 0">
										<view class="label-img" v-for="(label,labelIndex) in item.goods_label"
											:key="labelIndex" @click="$outerHref(label.label_url)">
											<image :src="label.formated_label_image" mode="heightFix"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more :status="loadMoreStatus" :content-text="contentText"
						v-if="page > 1 && showLoadMore" />
				</block>
				<block v-else>
					<uni-load-more status="loading" type="false" />
				</block>
			</block>
			<dsc-community routerName="tab" :scrollPickOpen="scrollPickOpen"
				@updateScrollPickOpen2="updateScrollPickOpen2" v-else></dsc-community>
		</view>
	</view>
</template>

<script>
	import community from '@/components/dsc-community/community.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		props: ['module', 'preview', 'shopId', 'scrollPickOpen', 'userId'],
		data() {
			return {
				previewProlist: [{
						title: '第一张图片',
						sale: '0',
						stock: '0',
						price: '¥238.00',
						marketPrice: '¥413.00'
					},
					{
						title: '第二张图片',
						sale: '0',
						stock: '0',
						price: '¥38.00',
						marketPrice: '¥43.00'
					}
				],
				prolist: [],
				tabs: [{
						tit: '精选',
						txt: '为你推荐'
					},
					{
						tit: '社区',
						txt: '新奇好物'
					},
					{
						tit: '新品',
						txt: '潮流上新'
					},
					{
						tit: '热卖',
						txt: '火热爆款'
					},
				],
				filter: 0,
				page: 1,
				size: 10,
				type: 'is_best',
				dscLoading: false,
				footerCont: false,
				loadMoreStatus: 'more',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				minHeight: '',
				home_list_one: [],
				hotList: [],
				newList: [],
				videoList: [{
					goods_thumb: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
				}]
			}
		},
		components: {
			dscNotContent,
			'dsc-community': community
		},
		computed: {
			newUserId() {
				return this.userId
			}
		},
		mounted() {
			this.getGoodsList(1);
			this.getNewGoodsList(1);
			this.getHotGoodsList(1);
			this.getVideoList(1);
			this.getHome_list();
		},
		methods: {
			toMerchants:function(){
				uni.navigateTo({
					url:'/pagesB/merchants/merchants'
				})
			},
			tabClick(index) {
				this.prolist = [];
				this.filter = index;
				this.dscLoading = true;
				this.minHeight = '750px'

				if (index == 1) {
					setTimeout(() => {
						this.minHeight = '0';
					}, 3000)
					return
				} else if (index == 0) {
					this.type = 'is_best'
				} else if (index == 2) {
					this.type = 'is_new'
				} else if (index == 3) {
					this.type = 'is_hot'
				}

				this.getGoodsList(1);
			},
			linkHref(goods_id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
			getGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				this.loadMoreStatus = "loading"
				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						size: this.size,
						type: this.type
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						if (this.page > 1) {
							this.prolist = this.prolist.concat(data);
						} else {
							this.prolist = data
						}

						this.$emit('updateScrollPickOpen', false)

						this.dscLoading = false
						this.minHeight = '0'
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getHotGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				this.loadMoreStatus = "loading"
				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						size: this.size,
						type: 'is_hot'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						this.hotList = data
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getNewGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				this.loadMoreStatus = "loading"
				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						size: this.size,
						type: 'is_new'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						this.newList = data
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getHome_list() {
				uni.request({
					url: this.websiteUrl + '/api/app/ad_position?type=home_list',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res)
						let data = res.data.data
						this.home_list_one = data.list
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getVideoList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/goods/goodsvideo',
					method: 'POST',
					data: {
						size: this.size,
						page: this.page,
						sort: 'goods_id',
						order: 'desc'
					},
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash': uni.getStorageSync('client_hash'),
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						let data = res.data.data
						this.videoList = data;
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			updateScrollPickOpen2(e) {
				this.$emit('updateScrollPickOpen', e)
			},
			lookVideo(id, index) {
				uni.request({
					url: this.websiteUrl + '/api/goods/videolooknum',
					method: 'GET',
					data: {
						goods_id: id
					},
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash': uni.getStorageSync('client_hash'),
						'token': uni.getStorageSync('token')
					},
					success: ({
						data: {
							status,
							data
						}
					}) => {
						if (status != 'success') return;
						this.videoList[index].look_num = data;
					},
					fail: (err) => {
						console.error(err)
					}
				});
			},
			showPopup(goods_id, index) {
				if (goods_id) this.lookVideo(goods_id, index);
				uni.navigateTo({
					url: '/pagesD/video/detail?goods_id=' + goods_id
				})
			},
			toshoplist() {
				console.log("111")
				uni.navigateTo({
					url: '/pagesD/video/list'
				})
			},
			toSearch(e) {
				if (e == '热卖') {
					uni.navigateTo({
						url: '/pagesC/hotgoods/hotgoods'
					})
				} else if (e == '新品') {
					uni.navigateTo({
						url: '/pagesC/newgoods/newgoods'
					})
				}
			}
		},
		watch: {
			scrollPickOpen() {
				if (this.scrollPickOpen) {
					this.showLoadMore = true
					this.loadMoreStatus = 'loading';
					if (this.page * this.size == this.prolist.length) {
						this.page++
						this.getGoodsList()
					} else {
						this.loadMoreStatus = "noMore"
						return;
					}
				}
			},
			newUserId() {
				this.getGoodsList(1);
			}
		}
	}
</script>

<style scoped>
	.product-list {
		padding: 0 18rpx 18rpx 18rpx !important;
	}

	.product-list .outer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product-list .outer .left {
		width: auto;
	}

	.product-list .outer .sales-volume {
		font-size: 25rpx;
		color: #999;
	}

	.product-list-big .uni-product-list {
		flex-direction: column;
	}

	.product-list-big .uni-product-list .image-view,
	.product-list-big .uni-product-list .uni-product-info {
		width: 100%;
		height: auto;
	}

	/*新版样式*/
	.product-new {
		margin: 20rpx 20rpx 0;
		/* min-height: 500rpx; */
	}

	.product-new .tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}

	.product-new .tabs .item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		line-height: 1.5;
		height: 100%;
	}

	.product-new .tabs .item .tit {
		font-size: 30rpx;
		color: #333;
	}

	.product-new .tabs .item .txt {
		display: inline-block;
		font-size: 25rpx;
		color: #888;
		border-radius: 20rpx;
		padding: 2rpx 16rpx;
		margin-top: 8rpx;
	}

	.product-new .tabs .item.active .tit {
		font-weight: 700;
	}

	.product-new .tabs .item.active .txt {
		background: linear-gradient(-88deg, rgba(255, 79, 46, 1), rgba(249, 31, 40, 1));
		color: #fff;
	}

	.product-new .tabs .item:after {
		content: ' ';
		position: absolute;
		height: 80%;
		width: 1px;
		right: 0;
		top: 10%;
		background-color: #ccc;
	}

	.product-new .tabs .item:last-child:after {
		height: 0;
	}

	.product-new .goods-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 0;
	}

	.product-new .goods-list .item {
		width: 48.5%;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 2.5%;
	}

	.product-new .goods-list .item .img-box {
		line-height: 0;
		position: relative;
	}

	.product-new .goods-list .item .info-box {
		padding: 20rpx;
	}

	.product-new .goods-list .item .info-box .goods-name {
		color: #000;
		font-weight: 500;
		height: 42px;
		line-height: 21px;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.goods-list .label-list {
		overflow: hidden;
		margin-top: 10rpx;
	}

	.goods-list .label-list .label-img {
		height: 16px;
		margin: 0 10rpx 0 0;
	}

	.goods-list .label-list .label-img:last-child {
		margin-right: 0;
	}

	/* 视频、新品、热销 */
	.shipin_1 {
		background: linear-gradient(to bottom, #FFE0E0 10%, #ffffff 40%, #ffffff 50%);
		border-radius: 20rpx;
		padding: 10rpx 20rpx 20rpx 20rpx;
	}

	.shipin_2 {
		background: linear-gradient(to bottom, #D8EDFF 10%, #ffffff 40%, #ffffff 50%);
		border-radius: 20rpx;
		padding: 10rpx 20rpx 20rpx 20rpx;
	}

	.shipin_3 {
		margin-left: 4rpx;
		background-color: #5f94fc;
		border-radius: 10rpx;
		font-size: 22rpx;
		padding: 4rpx 14rpx;
		margin-top: 8rpx;
		/* #ifdef MP-WEIXIN */
		height: 38rpx;
		line-height: 26rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 30rpx;
		line-height: 30rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 30rpx;
		line-height: 30rpx;
		/* #endif */
		color: #ffffff;
		transform: scale(0.8);
	}

	.shipin_4 {
		margin-left: 4rpx;
		background-color: #FFE50C;
		border-radius: 10rpx;
		font-size: 22rpx;
		padding: 4rpx 14rpx;
		margin-top: 8rpx;
		/* #ifdef MP-WEIXIN */
		height: 38rpx;
		line-height: 26rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 30rpx;
		line-height: 30rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 30rpx;
		line-height: 30rpx;
		/* #endif */
		color: #000000;
		transform: scale(0.8);
	}

	.newPrice {
		background-color: #FE0302;
		color: #ffffff;
		font-size: 22rpx;
		border-radius: 10rpx;

		width: 120rpx;
		height: 40rpx;
		line-height: 36rpx;
		transform: scale(0.9);
		/* #ifdef APP-PLUS */
		margin-left: 18rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin-left: 14rpx;
		/* #endif */
	}

	.newPrices {
		background-color: #FE0302;
		color: #ffffff;
		font-size: 22rpx;
		border-radius: 10rpx;
		height: 40rpx;
		line-height: 36rpx;
		width: 120rpx;
		transform: scale(0.9);
	}
</style>