<template>
	<view>
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<view class="" :class="{'product-list-medium':mode !== 'grid'}">
				<view class="bora24 alllist " v-for="(allitem,allindex) in list" :key="allindex">
					<view class="flex-between wi100 alltitle " style="height: 90rpx;margin-bottom: 25rpx;">
						<view class=" flex-between pl05 " style="flex: 1;">
							<view class="">
								<view class="flex-start">
									<image src="/pagesC/static/share/edit.png" mode="widthFix" class="img36 mr10"
										@click="toselledit(allitem.id)"></image>
									<span class="fs28" @click="toselldetail(allitem.id)">{{allitem.title}}</span>
									<image src="/static/order/arrow_right.png" mode="widthFix" class=" mr10"
										style="width: 24rpx;margin-left: 8rpx;" @click="toselldetail(allitem.id)">
									</image>
								</view>
								<view class="co99 flex-start " style="min-height: 20px;">
									<view class="fs24 mr32" v-if="allitem.see_number ">
										{{allitem.see_number}}人看过
									</view>
									<view class="mr32 fs24" v-if="allitem.buy_num ">
										{{allitem.buy_num}}人跟买
									</view>
								</view>
							</view>
							<view class="share_btn flex-center" @click="sharelist(allitem.id)">
								分享
							</view>
						</view>
					</view>
					<view class="uni-product-list">
						<view class="uni-product" v-for="(item,index) in allitem.goods_list" :key="index">
							<view class="image-view" @click="detailLink(allitem.goods_list,item.seckill_id,routerName,item.goods_id)">
								<image v-if="item.goods_img" class="uni-product-image" :src="item.goods_img"></image>
								<image v-else class="uni-product-image"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
								</image>
							</view>
							<view class="uni-product-info">
								<view class="uni-product-title" @longpress="copyTitle(item.goods_name)"
									@click="detailLink(allitem.goods_list,item.seckill_id,routerName,item.goods_id)">
									<view style="line-height: 40upx;">
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
			’123‘
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
				user_id: uni.getStorageSync('userInfo').id,
				eid: '',
				moneydetail: '',
				moneyimg: '',
				moneytitle: '',
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

			// 去编辑分享清单
			toselledit(id) {
				uni.navigateTo({
					url: `/pagesD/shareMoney/shareMoney?id=${id}&tabstatus=1`
				})

			},
			sharelist(id) {
				uni.showLoading({
					title: '努力加载中...',
					mask: true
				})
				this.eid = id
				this.getredInfo()
			},
			getredInfo() {
				uni.request({
					url: 'https://www.ok9288.com/api/drpnew/share_img_url',
					method: 'GET',
					data: {
						id: this.eid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
							uni.hideLoading();
						if (res.data.status == 'success') {
							console.log('sharedetail', res.data.data)
							let data = res.data.data
							this.moneydetail = res.data.data
							this.moneyimg = data.img
							this.moneytitle = data.title
							console.log('moneydetail',this.moneydetail)
							setTimeout(() => {
								let shareInfo = {
									href: `https://www.ok9288.com/mobile/pagesD/shareMoney/sellingList?id=${this.eid}&parent_id=${this.user_id}&platform=APP`,
									title: data.title,
									summary: this.moneydetail.intro,
									imageUrl: this.moneydetail.img,
									smallImageUrl: this.moneydetail.img_small,
									url: `https://www.ok9288.com/mobile/pagesD/shareMoney/sellingList?id=${this.eid}&parent_id=${this.user_id}`
								};
								this.$emit('shareInfo', shareInfo, this.eid)
							}, 300)
						}else {
								uni.hideLoading();
							uni.showToast({
								title: '分享失败请重试',
								icon: 'none',
								duration: 2000,
							})
						}
					}
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
			//商品详情
			detailLink(list,seckill_id, routerName, id) {
				console.log('list',list,'秒杀id',seckill_id,'商品名',routerName,'商品id',id)
				// if (seckill_id != 0) {
				// 	uni.navigateTo({
				// 		url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
				// 			'&tomorrow=0&delta=2'
				// 	});
				// } else {
					if (routerName == 'goods' || routerName == 'drp') {
						//猜你喜欢商品链接
						if (this.guessList) {
							if (this.routerType == 'reLaunch') {
								uni.redirectTo({
									url: '/pagesC/goodsDetail/goodsDetail?id=' + id
								})
							} else {
								uni.navigateTo({
									url: '/pagesC/goodsDetail/goodsDetail?id=' + id
								})
							}
						} else {
							// let goodsList = list
							list.forEach(v => {
								if (v.goods_id == id) {
									//判断是否是预售
									if (v.get_presale_activity) {
										uni.navigateTo({
											url: '/pagesA/presale/detail/detail?act_id=' + v
												.get_presale_activity.act_id
										})
									} else {
										if (this.routerType == 'reLaunch') {
											uni.redirectTo({
												url: '/pagesC/goodsDetail/goodsDetail?id=' + id
											})
										} else {
											uni.navigateTo({
												url: '/pagesC/goodsDetail/goodsDetail?id=' + id
											})
										}
									}
								}
							});
						}
					} else if (routerName == 'bargain') {
						uni.navigateTo({
							url: '/pagesA/bargain/detail/detail?id=' + id
						})
					}
				// }
			
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef MP-WEIXIN */
	@import "/common/css/common.css";
	/* #endif */

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
			width: 122rpx;
			height: 50rpx;
			background: #FE2F02;
			border-radius: 28rpx;
			color: #FFFFFF;
			line-height: 56rpx;
			margin-right: 32rpx;
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