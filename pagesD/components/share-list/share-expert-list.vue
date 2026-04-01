<template>
	<view>
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<!-- {{list}} -->
			<view class="" style="margin-top: -20rpx;" :class="{'product-list-medium':mode !== 'grid'}">
				<view class="bora24 alllist " v-for="(allitem,allindex) in list" :key="allindex">
					<view class="flex-between wi100 alltitle" style="height: 40px;margin-bottom: 32rpx;">
						<view class="" style="min-width: 12%;display: flex;align-items: center;">
							<!-- <image :src="allitem.head_url" mode="widthFix"
								style="height: 80rpx; width: 80rpx;border-radius: 50%;background-color: aliceblue;">
							</image> -->
							<image 
							    :src="getOptimizedImage(allitem.head_url)" 
							    mode="widthFix"
							    style="height: 80rpx; width: 80rpx;border-radius: 50%;background-color: aliceblue;"
							  ></image>
						</view>
						<view class="flex-between ml20 pl05 " style="flex: 1;">
							<view class="">
								<view class="flex-start ">
									<view class="onelist-hidden" style="max-width: 100px;">
										{{allitem.user_nickname}}
									</view>
									<view class="fs28 ml20 " v-if="allitem.share_platform">
										在<span class=" cored fs500 plr10">{{allitem.share_platform}}</span>分享了
									</view>
								</view>
								<view class=" co99 flex-start " style="min-height: 20px;">
									<view class="fs24 mr32" v-if="allitem.see_number && allitem.see_number>0">
										{{allitem.see_number}}人看过
									</view>
									<view class="fs24" v-if="allitem.buy_num && allitem.buy_num>0">
										{{allitem.buy_num}}人跟买
									</view>
								</view>
							</view>
							<view class="share_btn flex-center" @click="checkAllGoods(allindex)">
								分享赚钱
							</view>
						</view>
					</view>
					<view class="uni-product-list">
						<view class="uni-product" v-for="(item,index) in allitem.goods_list" :key="index">
							<view class="image-view" >
								<image @click="detailLink(item.goods_id)" 	 v-if="item.goods_img" class="uni-product-image" :src="item.goods_img"></image>
								<image @click="detailLink(item.goods_id)"	 v-else class="uni-product-image"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
								</image>
								<view class="checkbox"
									:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
									@click="checkGoods(index,item,item.goods_id)"
									style="position: absolute;top: 10rpx;right: -5%;">
									<view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="10" color="#ffffff"></uni-icons>
									</view>
								</view>
							</view>
							<view class="uni-product-info">
								<view class="uni-product-title" @longpress="copyTitle(item.goods_name)"
									@click="detailLink(item.goods_id)">
									<view style="line-height: 40upx;" class="onelist-hidden">
										{{item.goods_name}}
									</view>
									<view class="fs24 cored " v-if="item.cou_name && item.cou_name.length > 0">
										{{item.cou_name[0]}}
									</view>
									<view class="fs24 cored " v-else-if="item.integral && item.integral > 0">
										积分可抵{{item.integral}}%</view>
									<view class="" style="height: 20px;" v-else-if="!item.isall"> </view>
								</view>
								<view class="uni-product-price"
									style="display: flex;flex-direction: row;align-items: center;margin-top: -8px;">
									<currency-prices :price="item.shop_price"
										:delPrice="item.is_promote > 0 ? item.market_price : ''"
										:size="18"></currency-prices>
									
								</view>
								<view class="fs24 cored ">佣金{{item.dis_commission_price}}元</view>	
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
		watch: {
			list: {
				immediate: true,
				handler(newVal, oldVal) {
					this.addprints = this.list.flatMap(item => {
						if (item.goods_list) {
							return item.goods_list.filter(good => good.checked).map(() => item);
						}
						return [];
					});
				}
			}
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
			getOptimizedImage(originalUrl) {
			  const baseUrl = originalUrl.split('?')[0];
			  return `${baseUrl}?x-oss-process=image/resize,m_lfit,w_180,h_180/format,webp`;
			},
			
			clearCheckedByIds(goodsId) {
				this.list.forEach(item => {
					if (item.goods_list) {
						item.goods_list.forEach(good => {
							if (good.goods_id === goodsId) {
								good.checked = false;
							}
						});
					}
				});

				this.addprints = this.addprints.filter(item => {
					if (item.goods_id === goodsId) {
						return false;
					}
					if (item.goods_list) {
						return !item.goods_list.some(good => good.goods_id === goodsId);
					}
					return true;
				});
			},
			clearChecked() {
				this.list.forEach(item => {
					item.checked = false;
					if (item.goods_list) {
						item.goods_list.forEach(good => {
							good.checked = false;
						});
					}
				});
				this.addprints = [];
				this.list_all_checked = false;
			},
			checkAllGoods(index) {
				const that = this
				const item = that.list[index];
				if (Array.isArray(item.goods_list)) {
					item.goods_list.forEach(goods => {
						goods.checked = true;
						that.addprints.push(goods)
					});
				}
				this.sendSelectedInfo(this.addprints, '');
			},
			checkGoods(index, aitem, id) {
				const item = aitem;
				const wasChecked = item.checked;
				item.checked = !wasChecked;
				const deselectedItems = [];
				const handleSubGoods = (currentItem) => {
					if (currentItem.subGoods && currentItem.subGoods.length > 0) {
						currentItem.subGoods.forEach(subGood => {
							subGood.checked = currentItem.checked;
							if (!currentItem.checked && wasChecked) {
								deselectedItems.push(subGood);
								this.addprints = this.addprints.filter(i => i.goods_id !== subGood.goods_id);
							} else if (currentItem.checked && !wasChecked) {
								if (!this.addprints.some(i => i.goods_id === subGood.goods_id)) {
									this.addprints.push(subGood);
								}
							}
						});
					}
				};

				if (item.checked) {
					if (!this.addprints.some(i => i.goods_id === item.goods_id)) {
						this.addprints.push(item);
					}
					handleSubGoods(item);
				} else {
					this.addprints = this.addprints.filter(i => i.goods_id !== item.goods_id);
					handleSubGoods(item);
					if (wasChecked) {
						deselectedItems.push(item);
					}
				}

				const allChecked = this.list.every(i => i.checked);
				this.list_all_checked = allChecked;

				// 去重并更新 addprints
				const uniqueIds = new Set();
				this.addprints = this.addprints.filter(item => {
					if (uniqueIds.has(item.goods_id)) {
						return false;
					}
					uniqueIds.add(item.goods_id);
					return true;
				});

				const deselected = deselectedItems.length > 0 ? deselectedItems : (wasChecked && !item.checked ? [item] :
				[]);

				this.sendSelectedInfo(this.addprints, deselected);
			},

			sendSelectedInfo(selectedInfo, deselectedInfo) {
				const formattedSelected = selectedInfo.map(item => ({
					goods_id: item.goods_id,
					img: item.goods_img,
					name: item.goods_name,
					checked: item.checked,
				}));

				let formattedDeselected = []
				if (deselectedInfo && deselectedInfo.length > 0) {
					formattedDeselected = deselectedInfo.map(item => ({
						goods_id: item.goods_id,
						img: item.goods_img,
						name: item.goods_name,
						checked: item.checked,
					}));
				}

				const combinedInfo = {
					selected: formattedSelected,
					deselected: formattedDeselected
				};

				this.$emit('checkGoods', combinedInfo);
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
			detailLink(id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			}
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
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		padding: 28rpx 0 0 32rpx;

		.share_btn {
			width: 160rpx;
			height: 56rpx;
			background: #FE2F02;
			border-radius: 28rpx;
			color: #FFFFFF;
			line-height: 56rpx;
			margin-right: 32rpx;
		}

		.uni-product-info {
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
			width: 90px;
			min-width: 90px;
			margin-right: 32rpx;
			height: auto;
			// display: table-cell;
			flex-direction: column;
			overflow-y: auto;
		}

		.image-view {
			width: 90px;
			height: 90px;
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
			margin: 16rpx 0;
			display: flex;
			justify-content: flex-start;
			flex-direction: column;
		}


	}
</style>
