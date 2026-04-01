<template>
	<view>
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<view class="uni-product-list" :class="{'product-list-medium':mode !== 'grid'}">
				<view class="scroll-view-item " v-for="(item,index) in list" :key="index">
					<view style="display: flex;flex-direction: row;">
						<view class="checkbox" :class="{'checked':item.checked,'checkbox-disabled':item.checked}"
							@click="checkGoods(index,0,item.goods_id)">
							<view class="checkbox-icon">
								<uni-icons type="checkmarkempty" size="18" color="#ffffff"></uni-icons>
							</view>
						</view>
						<view class="checkbox-con" style="flex: 1 1 0%;">
							<view class="cart-goods-info">
								<view class="goods-img" 
								      style="width:90px;height:90px;overflow:hidden;border:0.5px solid #ececec;border-radius:5px;">
								  <image 
								    :src="getOptimizedImage(item.goods_img)" 
								    mode="aspectFill"
								    style="width:100%;height:100%;display:block;"
								  ></image>
								</view>
								<view class="cart-goods-content">
									<view @click="detailLink(item.goods_id)"
										style="display: flex; align-items: left;flex-direction: column;justify-content: left;">
										<view class=" onelist-hidden" style="border-radius: 6rpx;line-height: 36rpx;">
											{{ item.goods_name }}
										</view>
										<view class="fs24 cored " v-if="item.cou_name && item.cou_name.length > 0">
											{{item.cou_name[0]}}
										</view>
										<view class="fs24 cored " v-else-if="item.integral && item.integral > 0">
											积分可抵{{item.integral}}%</view>
											<view class="fs24 cored ">佣金{{item.dis_commission_price}}元</view>
									</view>
									<view class="uni-product-price"
										style="display: flex;flex-direction: row;align-items: center;justify-content: space-between; ">
										<currency-prices :price="item.shop_price"
											:delPrice="item.is_promote > 0 ? item.market_price : ''"
											:size="18"></currency-prices>
										<view class="share_btn flex-center" @click="checkGoods(index,1,item.goods_id)">
											分享
										</view>
									</view>
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
		},

		data() {
			return {
				showLoadMore: false,
				list_all_checked: false,
				addprints: [],
				// list: [],
				cateGoodsList: [],
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
		watch: {
			list: {
				immediate: true,
				handler(newVal, oldVal) {
					this.addprints = this.list.filter(item => item.checked);
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
		},
		methods: {
			
			 getOptimizedImage(originalUrl) {
			  const baseUrl = originalUrl.split('?')[0];
			    return `${baseUrl}?x-oss-process=image/resize,m_lfit,w_180,h_180/format,webp`;
			  },
			clearCheckedByIds(goodsId) {
				this.list.forEach(item => {
					if (item.goods_id == goodsId) {
						item.checked = false;
					}
				});
				this.addprints = this.addprints.filter(item => item.goods_id !== goodsId);
				this.list_all_checked = this.list.every(item => item.checked);
			},
			clearChecked() {
				this.list.forEach(item => {
					item.checked = false;
				});
				this.addprints = [];
				this.list_all_checked = false;
			},
			check_list_all() {
				var that = this
				this.addprints = [...new Set(this.addprints)]
				if (that.list_all_checked == false) {
					that.list_all_checked = true
					for (var i = 0; i < that.list.length; i++) {
						that.list[i].checked = true
						that.addprints.push(that.list[i])
					}
				} else {
					that.list_all_checked = false
					for (var i = 0; i < that.list.length; i++) {
						that.list[i].checked = false
					}
					this.addprints = []
				}
			},
			checkGoods(index, e, id) {
				const item = this.list.find(i => i.goods_id === id);
				const wasChecked = item.checked;
				if (e === 0 || e === 1) {
					if (e === 0) {
						item.checked = !wasChecked;
					}
					if (e === 1) {
						item.checked = true;
					}
					if (item.checked) {
						if (!this.addprints.some(i => i.goods_id === item.goods_id)) {
							this.addprints.push(item);
						}
					} else {
						this.addprints = this.addprints.filter(i => i.goods_id !== item.goods_id);
					}
				}
				const allChecked = this.list.every(i => i.checked);
				this.list_all_checked = allChecked;
				this.addprints = [...new Set(this.addprints.map(i => i.goods_id))].map(id => this.list.find(i => i
					.goods_id === id));
				const deselected = wasChecked && !item.checked ? [item] : [];
				this.sendSelectedInfo(this.addprints, deselected);
			},
			sendSelectedInfo(selectedInfo, deselectedInfo) {
				selectedInfo = selectedInfo.map(item => ({
					goods_id: item.goods_id,
					img: item.goods_img,
					name: item.goods_name,
					checked: item.checked,
				}));

				deselectedInfo = deselectedInfo.map(item => ({
					goods_id: item.goods_id,
					img: item.goods_img,
					name: item.goods_name,
					checked: item.checked,
				}));

				const combinedInfo = {
					selected: selectedInfo,
					deselected: deselectedInfo
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
			detailLink(id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef MP-WEIXIN */
	@import "/common/css/common.css";
	/* #endif */

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	/*product-list*/
	.uni-product-list {
		// padding: 0 18upx;
		// margin-top: 18upx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: space-between;
	}


	.uni-product-list .uni-product-title .tag {
		background-color: #ff5256;
		color: #fff;
		padding: 0 10upx;
		margin-right: 10upx;
	}



	.product-list-medium .uni-product {
		justify-content: space-between;
		width: 100%;
	}

	.product-list-medium .uni-product .image-view {
		width: 100%;
		height: auto;
	}

	.product-list-medium .uni-product-info {
		width: auto;
		flex: 1 1 0%;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.bargain-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 25upx;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 20upx;
		position: absolute;
		bottom: 10upx;
		right: 10upx;
		padding: 3upx 20upx;
		color: #FFFfff;
	}

	.bargain-tag .iconfont {
		line-height: 1;
		margin-right: 10upx;
	}

	.uni-product-price .box {
		line-height: 1.5;
	}

	.uni-product-price .gay {
		color: #999999;
		margin-right: 5upx;
	}

	.uni-product-price .del {
		text-decoration: line-through;
		font-size: 24upx;
	}

	.uni-product-price .em {
		font-size: 24upx;
	}


	/* start--Retina 屏幕下的 1px 边框--start */
	.u-border-top,
	.u-border-top:after,
	.u-border-top:after {
		border-top-width: 1px
	}

	/* end--Retina 屏幕下的 1px 边框--end */

	/* start--去除button的所有默认样式--start */
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

	/* end--去除button的所有默认样式--end */



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

	/* 商品属性弹框 end */
	.label-line {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		font-size: 10px;
		transform: scale(0.8);
		margin-left: -40rpx;
		width: 120%;
		margin-top: -10rpx;
	}

	.label-box {
		.label-box-line {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			padding-bottom: 5px;
			margin: 0 12rpx 0 0;
			text-align: left;
		}

		.zero-label {
			color: #FE2F02;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.zero-tag {
			color: #FF7705;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.first-label {
			color: #09B248;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.second-label {
			color: #A2A2A2;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}
	}

	.label-style {
		color: transparent;
		display: inline-block;
		transform: scale(0.9);
	}

	.label-style view:nth-child(-n+3) {
		color: #FE0302;
		border-radius: 10rpx;
		border: 2rpx solid #FE0302;
		transform: scale(0.9);
		padding: 0rpx 10rpx;
		margin-right: 2rpx;
	}

	.uni-product-info {
		padding: 5px 10px 10px;
		width: auto;
		box-sizing: border-box;
		overflow: hidden;
	}

	.uni-product {
		flex-direction: row;
		// width: 48.5%;
	}

	.image-view {
		position: relative;
		width: 90px;
		height: 90px;
		min-width: 90px;
		background-color: aliceblue;
		border-radius: 10rpx;
	}



	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.checkbox {
		margin-right: 0px;

		.checkbox-icon {
			width: 20px;
			height: 20px;

			.uni-icon {
				display: block;
			}
		}
	}



	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 10rpx;
		display: flex;
		flex-direction: row;
		min-height: 178rpx;
		border-radius: 10rpx;
	}

	.cart-goods-info .goods-img {
		width: 180upx;
		height: 180upx;
		border: 1rpx solid #ececec;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 180upx;
		height: 180upx;
	}

	.cart-goods-info .goods-img .icon {
		position: absolute;
		width: 80upx;
		height: 80upx;
		top: 0;
		left: 0;
	}

	.cart-goods-info .goods-img .icon image {
		width: 100%;
		height: 100%;
	}

	.cart-goods-content {
		flex: 1 1 0%;
		margin-left: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cart-goods-content .goods-title {
		font-size: 28upx;
		margin-bottom: 10upx;
	}

	.cart-goods-content .goods-attr {
		color: #999999;
		font-size: 25upx;
	}

	.cart-goods-content .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.share_btn {
		width: 120rpx;
		height: 56rpx;
		background: #FE2F02;
		border-radius: 28rpx;
		color: #FFFFFF;
		line-height: 56rpx;
	}
</style>