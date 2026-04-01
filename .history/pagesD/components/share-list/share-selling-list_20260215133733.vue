<template>
	<view>
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<view class="uni-product-list" :class="{'product-list-medium':mode !== 'grid'}">
				<view class="bgc_fff flex-between" style="padding-bottom: 32rpx;">
					<view class="flex-start ">
						<view class="flex-center mr28">
							<image :src="list[0].userinfo.head_url" mode="widthFix"
								style="height: 80rpx; width: 80rpx;border-radius: 50%;background-color: aliceblue;">
							</image>
						</view>
						<view class=" " style="">
							<view class="fs28 co27 ">{{list[0].userinfo.user_nickname}} </view>
							<view class="fs24 coa2 ">分享好物清单</view>
						</view>
					</view>
					<view class="share_btn flex-center" @click="toexpert">
						分享赚钱
					</view>
				</view>
				<view class="scroll-view-item " v-for="(item,index) in list[0].goodslist" :key="index">
					<view style="display: flex;flex-direction: row; ">
						<view class="checkbox-con" style="flex: 1 1 0%;">
							<view class="cart-goods-info">
								<view class="goods-img" style="min-width: 120rpx;">
									<image @click="detailLink(item.goods_id)" :src="item.goods_img" class="image" style="min-width: 120rpx;">
									</image>
								</view>
								<view class="cart-goods-content">
									<view @click="detailLink(item.goods_id)"
									<view @click="detailLink(item.goods_id)"
										style="display: flex; align-items: left;flex-direction: column;justify-content: left;">
										<view class=" onelist-hidden" style="border-radius: 6rpx;line-height: 36rpx;">
											{{ item.goods_name }}
										</view>
										<view class="flex-start coa2">
											<view class="label-box "
												v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0">
												<view class="fs24 "
													v-for="(itema,indexa) in item.goods_services_label_new">
													<view v-if="itema.value==3" class="second-label pr20">{{itema.name}}
													</view>
												</view>
											</view>
											<view class="fs24 line38 " v-if="item.collect_num">
												{{item.collect_num}}人已收藏
											</view>
										</view>
										<view style="font-size: 24rpx;color: #A2A2A2;text-align: left;">
											<text class="yishou color_999">
												已售{{ item.sales_volume }}{{$t('lang.jian')}}
											</text>
										</view>
									</view>
									<!-- 额外标签 -->
									<view class="flex-between" >
										<view class="uni-product-price"
										
											style="margin-top: 0rpx;">
											<currency-prices :price="item.shop_price"
												:delPrice="item.is_promote > 0 ? item.market_price : ''"
												:size="21"></currency-prices>
										</view>
										<view style="" class="" @click="detailLink(item.goods_id)">
											<image src="@/pagesC/static/my/bgcar.png" mode="widthFix"
												style="width: 40rpx;" />
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- <view class="flex-center " @click="clickmore">
					<view class="fs28 co27">
						<span class="pr12">{{loadMoreStatus == 'loading' ?'查看更多':'没有更多了'}} </span>
						<uni-icons type="arrowdown" size="11" color="#272727"
							v-if="loadMoreStatus == 'loading'"></uni-icons>
					</view>
				</view> -->
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
			// parentid: {
			// 	type: String,
			// 	default: false
			// }
		},

		data() {
			return {
				showLoadMore: false,
				list_all_checked: false,
				addprints: [],
				replenishList: [],
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
				console.log(this.list)
				return this.list
			},
			selectAttr: {
				get() {
					return this.goodsAttr.length > 0 ? this.goodsDetail.attr_name + ' ' + this.goodsNum + this
						.goodsDetail.goods_unit : this.goodsNum + this.goodsDetail.goods_unit;
				},
				set(val) {
					this.goodsDetail.attr_name = val;
				}
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
			this.replenishList = this.list
		},
		methods: {
			
			detailLink(id) {
				console.log('6666',id)
				// return 
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
			clickcar(){
				// uni.showToast({
				// 	title:'当前页面仅供查看已分享的清单哦',
				// 	icon:'none'
				// })
			},
			check_list_all() {
				var that = this
				this.addprints = [...new Set(this.addprints)]
				if (that.list_all_checked == false) {
					that.list_all_checked = true
					for (var i = 0; i < that.replenishList.length; i++) {
						that.replenishList[i].checked = true
						that.addprints.push(that.replenishList[i])
					}
				} else {
					that.list_all_checked = false
					for (var i = 0; i < that.replenishList.length; i++) {
						that.replenishList[i].checked = false
					}
					this.addprints = []
					console.log('22check1', this.list_all_checked);
				}
			},
			checkGoods(index) {
				var that = this
				if (this.replenishList[index].checked == false) {
					this.replenishList[index].checked = true
					this.addprints.push(this.replenishList[index])
				} else {
					this.replenishList[index].checked = false
					this.replenishList[index].checked = false
					for (var i = 0; i < this.addprints.length; i++) {
						if (this.addprints[i] == this.replenishList[index]) {
							this.addprints.splice(i, 1)
						}
					}
				}
				var abcd = this.replenishList.every((item) => item.checked == true);
				if (abcd == true) {
					this.list_all_checked = true
				} else {
					this.list_all_checked = false
				}
				this.addprints = [...new Set(this.addprints)]
				console.log('1print', this.addprints);
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
			toShopHome: function(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
				})
			},
			toexpert() {
				uni.navigateTo({
					url: `/pagesD/shareMoney/shareMoney?tabstatus=1`
				})
			},
			onSku(item) {
				var that = this
				that.goodsDetail = item
				that.goodsAttr = item.attr ? item.attr : [];
				that.is_on_sale = item.is_alone_sale == 0 ? true : false
				that.is_alone_sale = item.is_alone_sale == 0 ? true : false
				that.attr = item.attr ? item.attr : [];
				// 起购数量
				if (item.minimum > 1) {
					that.goodsNum = item.minimum;
					that.minNum = item.minimum || 1;
				} else {
					that.goodsNum = 1
				}

				//限购
				if (item.xiangou_num > 0 && item.xiangou_end_date > item.current_time) that.xiangouNum = item.xiangou_num;
				that.xiangouNum = item.goods_number;

				// 默认勾选的属性
				if (item.attr) {
					item.attr.forEach(items => {
						items.attr_key.forEach(val => {
							if (val.attr_checked == 1) {
								that.seleceGoodsAtrrArray.push(val.id);
							};
						});
					});
				};
				console.log(that.attr.length)
				console.log(!that.storeBtn)
				console.log(that.is_on_sale)
				console.log(that.is_alone_sale)
				if (that.is_on_sale) {
					uni.showToast({
						title: that.$t('lang.goods_sold_out'),
						icon: 'none'
					});
					return;
				}
				if (that.is_alone_sale) {
					uni.showToast({
						title: that.$t('lang.goods_alone_sale'),
						icon: 'none'
					});
					return;
				}

				that.addType = 0 == 0 ? 1 : 2;
				console.log(that.addType)
				if (that.attr.length > 0) {
					uni.showLoading({
						title: '加载中~'
					})
					uni.request({
						url: 'https://www.ok9288.com/api/goods/get_goods_barc_code',
						method: 'POST',
						data: {
							"goods_attr_id": that.seleceGoodsAtrrArray,
							"goods_id": item.goods_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res_1) => {
							console.log('goods_attr_id', res_1.data)
							uni.hideLoading()
							if (res_1.data.status == "success") {
								that.goodsDetail.upc = res_1.data.data
							}
						}
					})
					that.$refs['goodsattr'].open();
				} else {
					that.onAddCartClicked(0)
				}
			},
			async onAddCartClicked() {
				var that = this
				var newAttr = []
				// #ifndef H5
				let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				let version = Number(wgtinfo.version.replace(/\./g, ''));
				// #endif
				// #ifdef H5
				let version
				// #endif
				if (that.attr.length > 0) {
					newAttr = that.seleceGoodsAtrrArray;
				}
				//判断是否绑定手机号
				if (!uni.getStorageSync('bindMobilePhone') && that.$isLogin()) {
					let roles = await that.$store.dispatch('setUserId', {
						type: true
					});
					if (roles.status == 'success') {
						if (!roles.data.mobile_phone) {
							uni.showModal({
								content: that.$t(
									'lang.is_user_bind_mobile_phone'
								), //is_user_bind_mobile_phone 您的账号尚未绑定手机,请去绑定手机号！
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pagesB/accountsafe/bindphone/bindphone?delta=1'
										});
									}
								}
							});

							return false
						}
					}
				}
				uni.showLoading({
					title: that.$t('lang.loading_submit'),
					mask: true
				});


				console.log("goods_id:" + that.goodsDetail.goods_id)
				console.log("num:" + that.goodsNum)
				console.log("spec:" + newAttr)
				console.log("spec:" + newAttr.length)
				console.log("seleceGoodsAtrrArray:" + that.seleceGoodsAtrrArray)
				console.log("app_version:" + version)
				console.log("rec_type:" + '0')
				console.log("cou_id:" + that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id :
					0)
				that.$store.dispatch('setAddCart', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					spec: newAttr,
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0',
					rec_type: '0',
					app_version: version,
					cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
				}).then(res => {
					uni.hideLoading();
					console.log(res)
					if (res.data.error == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
						that.seleceGoodsAtrrArray = []
						return;
					} else {
						let status = res.data.uc_id >= 0 ? res.data.status : res.data
						if (status == true) {
							uni.showToast({
								title: that.$t('lang.added_to_cart'),
								icon: 'success',
								duration: 500
							});
							//获取购物车数量
							// that.$store.dispatch('setCommonCartNumber');
							that.closePop('goodsattr');
							that.seleceGoodsAtrrArray = []
						} else {
							uni.showToast({
								title: status.msg,
								icon: 'none',
								duration: 500
							});
						}
					}

				});
			},
			// 勾选商品属性
			selectGoodsAttr(res, val) {
				var that = this
				if (that.seleceGoodsAtrrArray.includes(res.id)) {
					if (val.attr_type == 1) {
						// 单选属性
					} else {
						// 多选属性
						const seleceArr = [];
						val.attr_key.forEach(item => {
							if (that.seleceGoodsAtrrArray.includes(item.id)) {
								seleceArr.push(item.id);
							}
						});
						if (seleceArr.length > 1) that.seleceGoodsAtrrArray = that.seleceGoodsAtrrArray.filter(id => id !=
							res.id);
						that.changeAttr();
					}
				} else {
					if (val.attr_type == 1) {
						// 单选属性
						val.attr_key.forEach(item => {
							if (that.seleceGoodsAtrrArray.includes(item.id)) {
								that.seleceGoodsAtrrArray = that.seleceGoodsAtrrArray.filter(id => id != item.id);
							}
						});
						that.seleceGoodsAtrrArray.push(res.id);
					} else {
						// 多选属性
						that.seleceGoodsAtrrArray.push(res.id);
					}
					that.changeAttr();
				}
			},
			// 按钮修改商品数量
			changeGoodsNum(type) {
				if (type == 'add') {
					if (this.goodsNum < this.xiangouNum) {
						this.goodsNum++;
					}
				} else if (type == 'subtract') {
					if (this.goodsNum > this.minNum) {
						this.goodsNum--;
					}
				}
			},
			// 修改商品属性
			async changeAttr(load = false) {
				var that = this
				console.log(that.seleceGoodsAtrrArray)
				const {
					data,
					status
				} = await that.$store.dispatch('setGoodsAttrOperById', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					attr_id: that.seleceGoodsAtrrArray
				});
				if (status != 'success') return that.showToast();
				// console.log(data)
				that.selectAttr = data.attr_name;
				that.goodsDetail.upc = data.bar_code
				that.goodsDetail.goods_number = data.stock;
				that.goodsDetail.shop_price = data.shop_price;
				that.goodsDetail.marketPrice = data.market_price;

				if (data.attr_img) that.goodsDetail.goods_thumb = data.attr_img;

				if (load) setTimeout(() => {
					that.dscLoading = false
				}, 30);
			},
			// 输入修改商品数量
			changeGoodsNumByInput(e) {
				if (e.detail.value < this.minNum) {
					this.goodsNum = this.minNum;
					this.showToast(`${this.$t('lang.zhishao')}${this.minNum}${this.$t('lang.jian')}`);
				} else {
					this.goodsNum = e.detail.value;
				}
			},
			// 显示底部弹框
			showPopup(res) {
				this.$refs[res].open()

				if (res == 'address') {
					this.regionShow = true;
				}
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
				this.seleceGoodsAtrrArray = []
				if (res == 'goodsattr') {
					this.storeBtn = false;
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "/common/css/common.css";

	/*product-list*/
	.uni-product-list {
		// padding: 0 18upx;
		// margin-top: 18upx;
		box-sizing: border-box;
		background-color: #FFFFFF;
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

	.uni-product-list .outer {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		margin-top: 10upx;
	}

	.uni-product-list .outer .left {
		width: 260upx;
	}

	.uni-product-list .outer .tag {
		background-color: #fef0f0;
		color: #f92028;
		padding: 5upx 10upx;
		border-radius: 10upx;
	}

	.uni-product-list .outer .sales-volume {
		font-size: 26upx;
		color: #999999;
	}

	.uni-product-list .outer .icon-cart {
		color: #f92028;
		font-size: 35upx;
		margin-right: 10upx;
	}

	.uni-product-list .outer-teshu {
		margin-top: 15upx;
		line-height: 0;
		flex-wrap: inherit;
		display: inherit;
		height: 16px;
		line-height: 16px;
		overflow: hidden;
	}

	.uni-product-list .outer-teshu .tag {
		padding: 0 10upx;
		height: 16px;
		line-height: 16px;
		background-color: #f92028;
		color: #FFFFFF;
		float: left;
		margin-right: 10upx;
		font-size: 12px;
		border-radius: 8upx;
	}

	.uni-product-list .outer-teshu .label-list {
		font-size: 0;
		line-height: 0;
		display: inherit;
	}

	.uni-product-list .outer-teshu .label-list .label-img {
		height: 16px;
		font-size: 0;
		line-height: 0;
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
		// padding: 10rpx 0rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}

	.checkbox-icon .uni-icon {
		display: block;
	}

	.cart-goods-info {
		background-color: #FFFFFF;
		// padding: 20upx 0 10upx 0;
		padding-bottom: 8rpx;
		display: flex;
		flex-direction: row;
		// height: 176rpx;
	}

	.cart-goods-info .goods-img {
		width: 160upx;
		height: 160upx;
		border: 1rpx solid #ececec;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 160upx;
		height: 160upx;
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
		width: 160rpx;
		height: 56rpx;
		background: #FE2F02;
		border-radius: 28rpx;
		color: #FFFFFF;
		line-height: 56rpx;
	}
</style>
