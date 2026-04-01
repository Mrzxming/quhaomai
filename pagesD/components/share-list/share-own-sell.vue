<template>
	<view>
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<view class="" :class="{'product-list-medium':mode !== 'grid'}">
				<view class="bora24 alllist " v-for="(allitem,allindex) in list" :key="allindex">
					<view class="flex-between wi100 alltitle " style="height: 90rpx;margin-bottom: 24rpx;">
						<!-- <view class="flex-center" style="width: 15%;">
							<image :src="allitem.head_url" mode="widthFix"
								style="height: 80rpx; width: 80rpx;border-radius: 50%;background-color: aliceblue;">
							</image>
						</view> -->
						<view class=" flex-between pl05 " style="flex: 1;">
							<view class="">
								<view class="flex-start">
									<image src="/pagesC/static/share/edit.png" mode="widthFix" class="img36 mr10" />
									<span class="fs28" >{{allitem.title}}</span>
									<image src="/static/order/arrow_right.png" mode="widthFix" class=" mr10"
										style="width: 24rpx;margin-left: 8rpx;" >
									</image>
								</view>
								<view class="co99 flex-start " style="min-height: 40rpx;">
									<view class="fs24 mr32" v-if="allitem.see_number ">
										{{allitem.see_number}}人看过
									</view>
									<view class="mr32 fs24" v-if="allitem.buy_num ">
										{{allitem.buy_num}}人跟买
									</view>
								</view>
							</view>
							<view class="share_btn flex-center mr32" @click="toselldetail(allitem.id)">
								查看更多
							</view>
						</view>
					</view>
					<view class="uni-product-list" >
						<view class="uni-product" v-for="(item,index) in allitem.goods_list" :key="index" @click="detailLink(item.goods_id)">
							<view class="image-view">
								<image v-if="item.goods_img" class="uni-product-image" :src="item.goods_img"></image>
								<image v-else class="uni-product-image"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
								</image>
							</view>
							<view class="uni-product-info">
								<view class="uni-product-title" @longpress="copyTitle(item.goods_name)" >
									<view style="line-height: 40rpx;">
										{{item.goods_name}}
									</view>
								</view>
								<view class="uni-product-price"
									style="display: flex;flex-direction: row;align-items: center;margin-top: 0px;">
									<currency-prices :price="item.shop_price"
										:delPrice="item.is_promote > 0 ? item.market_price : ''"
										:size="18"></currency-prices>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>
		</block>
		<block v-else>
			
			<dsc-not-content></dsc-not-content>
		</block>

	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	import universal from '@/common/mixins/universal.js';

	export default {
		mixins: [universal],
		props: {
			list: {
				type: Array,
				default: []
			},
			mode: {
				type: String,
				default: 'grid'
			},
			loadMoreStatus: {
				type: String,
				default: 'loading'
			},
			routerName: {
				type: String,
				default: 'goods'
			},
			routerType: {
				type: String,
				default: 'navigateTo'
			},
			productOuter: {
				type: Boolean,
				default: false
			},
			showone: {
				type: Boolean,
				default: false
			},
			// fromCart: {
			// 	type: Boolean,
			// 	default: false
			// },
			guessList: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				addprints: [],
				addCartClass: false,
				curIndex: null,
				seleceGoodsAtrrArray: [],
				goodsNum: 1,
				minNum: 1,
				xiangouNum: 1,
				addType: '',
				goodsDetail: {},
				goodsAttr: [],
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				storeBtn: false,
				is_on_sale: false,
				is_alone_sale: false,
				attr: [],
				isIpx: false,
			};
		},
		components: {
			dscNotContent,
		},
		computed: {
			islist() {
				return this.list
			},

		},
		created() {
			var that = this
			uni.getSystemInfo({
				success: function(res) {
					let modelmes = res.model;
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
		},
		methods: {
			// loadMoreFunc () {
				
			// },
			detailLink(id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			},
			// 去编辑分享清单
			toselledit(id) {
				uni.navigateTo({
					url: `/pagesD/shareMoney/shareMoney?id=${id}&tabstatus=1`
				})
			},

			toselldetail(id) {
				uni.navigateTo({
					url: `/pagesD/shareMoney/sellingList?id=${id}`
				})
			},

			copyTitle(goods_name) {
				var that = this
				var text = goods_name
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000,
						})
					},
				})
			},
			// 图片预览
			previewImg(i, imgs) {
				let arr = []
				if (imgs) {
					if (typeof imgs == 'string') arr.push(imgs);
					uni.previewImage({
						current: i,
						urls: arr.length > 0 ? arr : imgs
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "/common/css/common.css";

	.checkbox {
		margin-right: 0px;

		.checkbox-icon {

			.uni-icon {
				display: block;
			}
		}
	}




	.u-border-top,
	.u-border-top:after,
	.u-border-top:after {
		border-top-width: 1px
	}

	.u-reset-button {
		padding: 0;
		font-size: inherit;
		line-height: inherit;
		background-color: transparent;
		color: inherit;
	}

	.u-reset-button::after {
		border: none;
	}

	/* 适配iPhone X */
	.IpxBot {
		position: fixed;
		bottom: 160rpx;
		left: 0;
		width: 92%;
	}

	/* 适配iPhone X */
	.IpxBots {
		position: fixed;
		bottom: 106rpx;
		left: 0;
		width: 92%;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	.alllist {
		background-color: #FFFFFF; // pink;
		margin-bottom: 20rpx;
		padding: 28rpx 0 0 32rpx;

		.share_btn {
			width: 176rpx;
			height: 56rpx;
			border-radius: 28rpx;
			border: 1rpx solid #FE2F02;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 26rpx;
			color: #FE2F02;
			// line-height: 28rpx;
			text-align: justify;
			font-style: normal;
		}

		.uni-product-info {
			// padding: 5px 10px 10px;
			padding: 0px;
			width: auto;
			box-sizing: border-box;
			overflow: hidden;
		}

		.uni-product-list {
			display: flex;
			width: 100%;
			flex-wrap: wrap;
			flex-direction: row;
			/* justify-content: space-between; */
			justify-content: flex-start;
			flex-wrap: nowrap;
			overflow-y: auto;
		}

		.uni-product {
			width: 100px;
			min-width: 100px;
			margin-right: 32rpx;
			height: auto;
			// display: table-cell;
			flex-direction: column;
			overflow-y: auto;
		}

		.image-view {
			width: 98px;
			height: 98px;
			min-width: 90px;
			position: relative;
			border-radius: 12rpx;
			background-color: aliceblue;
		}

		.uni-product-image {
			border-radius: 12rpx;
		}

		.uni-product-title {
			width: 100%;
			word-break: break-all;
			display: -webkit-box;
			overflow: hidden;
			line-height: 1.5;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			font-size: 14px;
			margin: 16rpx 0 0;
		}
	}
</style>
