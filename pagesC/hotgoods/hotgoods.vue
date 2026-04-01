<template>
	<view>
		<view class="product-new" :style="{'min-height':minHeight}">
			<block v-if="filter != 1">
				<block v-if="!dscLoading">
					<view class="goods-list" v-if="prolist">
						<!-- <waterfall :value="prolist" :column="2" :columnSpace="1.5" :seat="2"
							@imageClick="linkHref">
							
						</waterfall> -->
						<dsc-product-list :list="prolist"  v-if="prolist"></dsc-product-list>
					</view>
					<uni-load-more :status="loadMoreStatus" :content-text="contentText"
						v-if="page > 1 && showLoadMore" />
					<!--返回顶部-->
					<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
				</block>
				<block v-else>
					<uni-load-more status="loading" type="false" />
				</block>
			</block>
		<!-- 	<dsc-community routerName="tab" :scrollPickOpen="scrollPickOpen"
				@updateScrollPickOpen2="updateScrollPickOpen2" v-else></dsc-community> -->
		</view>
	</view>
</template>

<script>
	import community from '@/components/dsc-community/community.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top';
	// import waterfall from '@/pagesD/components/waterfall.vue';
	import dscProductList from '@/components/dsc-product-list.vue'
	export default {
		props: ['module', 'preview', 'shopId', 'scrollPickOpen', 'userId'],
		data() {
			return {
				// scrollPickOpen:true,
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
				scrollState:false,
				minHeight: '',
			}
		},
		components: {
			dscNotContent,
			'dsc-community': community,
			dscFilterTop,
			// waterfall,
			dscProductList
		},
		onLoad() {
			this.getGoodsList()
		},
		onPageScroll(e) {
			this.scrollState = e.scrollTop > 800 ? true : false
		},
		methods: {
			linkHref(seckill_id,goods_id) {
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
						type: 'is_hot'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
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
			toSearch(e) {
				uni.navigateTo({
					url: '/pagesD/goodslist/goodslist?keywords=' + e
				})
			},
			handleScrollPickOpen() {
				// if (this.scrollPickOpen) {
					this.showLoadMore = true
					this.loadMoreStatus = 'loading';
					if (this.page * this.size == this.prolist.length) {
						this.page++
						this.getGoodsList()
					} else {
						this.loadMoreStatus = "noMore"
						return;
					}
				// }
			}
		},
		onReachBottom() {
			this.handleScrollPickOpen()
		}
	}
</script>

<style scoped>
	.product-list {
		padding: 0 18upx 18upx 18upx !important;
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
		font-size: 25upx;
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
		margin: 40upx 20upx 0;
		min-height: 500upx;
	}

	.product-new .tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;
	}

	.product-new .tabs .item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		line-height: 1.5;
	}

	.product-new .tabs .item .tit {
		font-size: 30upx;
		color: #333;
	}

	.product-new .tabs .item .txt {
		display: inline-block;
		font-size: 25upx;
		color: #888;
		border-radius: 20upx;
		padding: 2upx 16upx;
		margin-top: 8upx;
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
		border-radius: 20upx;
		overflow: hidden;
		margin-bottom: 2.5%;
	}

	.product-new .goods-list .item .img-box {
		line-height: 0;
		position: relative;
	}

	.product-new .goods-list .item .info-box {
		padding: 20upx;
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
		margin-top: 10upx;
	}

	.goods-list .label-list .label-img {
		height: 16px;
		margin: 0 10upx 0 0;
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
		margin-left: 10rpx;
		width: 120rpx;
		height: 40rpx;
		line-height: 36rpx;
		transform: scale(0.9);
		/* #ifdef APP-PLUS */
		margin-left: 16rpx;
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
	
	.shop_name_class{
		color:#A2A2A2;
		font-size: 26rpx;
		margin-right: 6rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
</style>