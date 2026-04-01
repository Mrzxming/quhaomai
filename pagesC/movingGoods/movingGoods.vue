<template>
	<view class="user-default">
		<view class="container">
			<view class="main-title">
				<!-- #ifdef MP-WEIXIN -->
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<!-- 这里是状态栏 -->
				<view class="status_bar" style="height: 45px;"></view>
				<!-- #endif -->
				<view class="chat_1" :style="{ height: gaodu + 'px' }">
					<view @click="navigateBack">
						<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png" style="width: 30rpx;height: 30rpx;">
						</image>
					</view>
								
					<view style="margin-top: -20rpx;font-size: 32rpx;margin-left: 20rpx;">商品搬家</view>
					<view class="search_submit" @click="tommoving">
						<view>
							<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_4B4363E4D16777FC2830D3442DCAE862.png" style="width: 30rpx;height: 30rpx;"></image>
						</view>
					</view>
				</view>
				<view class="search_2" :class="revertShow==true || maxnumShow==true?'swiper-boxs':'swiper-box'">
					<view class="search_1">
						<input type="text" :value="keywords" placeholder="订单号和商品名称" class="search_area"
							@input="searchInput" placeholder-style="color:#C0C0C0;" />
						<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_4B3616499FE85C50ED675857C0C0338D.png" style="width:46rpx;height: 46rpx;float: right;margin-top: 10rpx;" @click="goSearch">
						</image>
					</view>
				</view>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<view style="margin-top: 260rpx;background-color: #ffffff;"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view style="margin-top: 240rpx;background-color: #ffffff;"></view>
			<!-- #endif -->

			<view v-if="movinggoodsList.length > 0"
				:class="revertShow==true || maxnumShow==true?'swiper-boxs':'swiper-box'">
				<view class="card-goods">
					<view class="card-goods-group" v-for="(storeList,listIndex) in movinggoodsList" :key="listIndex">
						<view class="card-shop-head">
							<view class="head-left">
								<view class="checkbox"
									:class="{'checked':storeList.checked,'checkbox-disabled':storeList.checked}"
									@click="checkShop(storeList,listIndex)">
									<view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
									</view>
								</view>
								<view>
									<view class="checkbox-con">订单号：{{ storeList.order_sn }}</view>
									<view class="checkbox-con">下单时间：{{ storeList.pay_time }}</view>
								</view>
							</view>
						</view>
						<view style="height: 2rpx;width: 100%;background-color: #EDEDED;"></view>
						<view class="card-shop-box">
							<block v-for="(item,index) in storeList.goods" :key="index">
								<!-- <uni-swipe-action> -->
								<!-- 	<uni-swipe-action-item :right-options="options"
											@click="deleteCartGoods(item.rec_id)"> -->
								<view class="scroll-view-item scroll-view-item-left">
									<view class="uni-flex">
										<view class="checkbox"
											:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
											@click="checkGoods(listIndex,index)">
											<view class="checkbox-icon">
												<uni-icons type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
											</view>
										</view>
										<view class="checkbox-con" style="flex: 1 1 0%;">
											<view class="cart-goods-info">
												<view class="goods-img">
													<image :src="item.goods_img" class="image"></image>
												</view>
												<view class="cart-goods-content">
													<view class="goods-title twolist-hidden"
														style="display: flex;flex-direction: row;justify-content: space-between;">
														<view class="goodsTitles" style="width: 70%;font-weight: bold;">
															{{ item.goods_name }}</view>
														<view class="price">￥{{ item.goods_price }}</view>
													</view>
													<view
														style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: -20rpx;">
														<view class="goods-attr twolist-hidden" v-if="item.goods_attr">
															{{ item.goods_attr }}</view>
														<view class="oper">
															<view class="uni-number-min" style="color: #999999;">
																共{{item.goods_number}}件</view>
														</view>
													</view>

													<view>同步状态</view>
													<view
														style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
														<view
															style="display: flex;flex-direction: row;align-items: center;border: 2rpx solid #C0C0C0;border-radius: 14rpx;padding: 0rpx 10rpx;margin-right: 4rpx;text-align: center;">
															<view style="margin-right: -10rpx;margin-left: 10rpx;">
																<image
																	src="https://images.eqingqu.com/attachs/photo/202308/20230823_98AB49743E256990568169832F1AF956.png"
																	style="width: 34rpx;height: 34rpx;margin-top: 16rpx;">
																</image>
															</view>
															<view
																style="font-size: 26rpx;width: 100rpx;"
																v-if="item.mt_sync_status==0">同步中</view>
															<view
																style="font-size: 26rpx;width: 100rpx;"
																v-if="item.mt_sync_status==1">成功</view>
															<view
																style="font-size: 26rpx;width: 100rpx;"
																v-if="item.mt_sync_status==2">失败</view>
															<view
																style="font-size: 26rpx;width: 100rpx;"
																v-if="item.mt_sync_status==-1">未同步</view>
															<!-- <view v-if="item.qq_sync_status==2">
																			<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_2DAD76012E1109BC875719DADAB3A2E6.png" style="width: 28rpx;height: 28rpx;margin-top: 14rpx;"></image>
																		</view> -->
														</view>
														<view
															style="display: flex;flex-direction: row;align-items: center;border: 2rpx solid #C0C0C0;border-radius: 14rpx;padding: 0rpx 10rpx;margin-right: 4rpx;">
															<view style="margin-right: -10rpx;margin-left: 10rpx;">
																<image
																	src="https://images.eqingqu.com/attachs/photo/202308/20230823_F2B8C763472981FBB17FAA69AEEA1950.png"
																	style="width: 34rpx;height: 34rpx;margin-top: 16rpx;">
																</image>
															</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.elm_sync_status==0">同步中</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.elm_sync_status==1">成功</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.elm_sync_status==2">失败</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.elm_sync_status==-1">未同步</view>
															<!-- <view v-if="item.qq_sync_status==2">
																			<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_2DAD76012E1109BC875719DADAB3A2E6.png" style="width: 28rpx;height: 28rpx;margin-top: 14rpx;"></image>
																		</view> -->
														</view>
														<view
															style="display: flex;flex-direction: row;align-items: center;border: 2rpx solid #C0C0C0;border-radius: 14rpx;padding: 0rpx 10rpx;margin-right: 4rpx;">
															<view style="margin-right: -10rpx;margin-left: 10rpx;">
																<image
																	src="https://images.eqingqu.com/attachs/photo/202308/20230823_6A9E8AF0D830D92BF4327F56DCB996E4.png"
																	style="width: 34rpx;height: 34rpx;margin-top: 16rpx;">
																</image>
															</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.qq_sync_status==0">同步中</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.qq_sync_status==1">成功</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.qq_sync_status==2">失败</view>
															<view
																style="font-size: 26rpx;width: 100rpx;text-align: center;"
																v-if="item.qq_sync_status==-1">未同步</view>
															<!-- <view v-if="item.qq_sync_status==2">
																			<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_2DAD76012E1109BC875719DADAB3A2E6.png" style="width: 28rpx;height: 28rpx;margin-top: 14rpx;"></image>
																		</view> -->
														</view>
													</view>

												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- </uni-swipe-action-item> -->
								<!-- </uni-swipe-action> -->
							</block>
						</view>
						<view style="height: 20rpx;background-color: #f8f8f8;margin-left: -50rpx;width: 120%;"></view>
					</view>
				</view>
				<view style="height: 280rpx;"></view>
				<view class="cart-submit">
					<view style="width: 100%;padding: 10rpx;">
						<view class="scroll-item" v-for="(item, index) in list" :key="index"
							@click="changeMenu(index+1)">
							<view class="item-text" :class="curIndex == index+1? 'active' : ''">
								<view style="font-size: 32rpx;">{{item.name}}</view>
							</view>
						</view>
						<view class="btn-bar">
							<block v-if="lenlent.length>0">
								<button class="btn btn-red" style="font-size: 32rpx;" @click="onSubmit">上传到外卖平台</button>
							</block>
							<block v-else>
								<button class="btn btn-disabled" style="font-size: 32rpx;" disabled>上传到外卖平台</button>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="flow-no-cart" v-else :class="revertShow==true?'swiper-boxs':'swiper-box'">
				<dsc-not-content></dsc-not-content>
			</view>

			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

			<!--返回顶部-->
			<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>

			<!-- 遮罩层 -->
			<view v-if="revertShow">
				<view class="cover" @click="revertShowNo" catchtouchmove="true"></view>
				<view class="wxshare">
					<view style="margin: 10rpx 30rpx 30rpx 30rpx;">
						<view style="margin-bottom: 20rpx;" :class="[isDefine == 1 ? 'darking' : 'graying']"
							@click="isChange">同步记录</view>
						<view style="margin-bottom: 20rpx;" :class="[isDefine == 2 ? 'darking' : 'graying']"
							@click="isChanges">同步教程</view>
					</view>
				</view>
			</view>
			<!-- 遮罩层 -->
			<view v-if="maxnumShow">
				<view class="cover1" catchtouchmove="true"></view>
				<view class="wxshare1">
					<view class="wxshare_3_1">温馨提示</view>
					<view class="tui-order-title-1">{{tipstext}}</view>
					<view style="display: flex;flex-direction: row;align-items: center;margin-top: 150rpx;">
						<view class="add_box3_cui_2" @click="maxnumShowNo">关闭</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniLoadMoreNew from '@/components/uni-load-more-new/uni-load-more.vue';

	import universal from '@/common/mixins/universal.js';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscProductList from '@/components/dsc-product-list.vue';


	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top.vue'
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	export default {
		components: {
			dscNotContent,
			uniIcons,
			uniPopup,
			uniLoadMore,
			uniLoadMoreNew,
			dscProductList,
			dscFilterTop,
			uniPopups
		},
		data() {
			return {
				keywords: '',
				loading: false,
				dscLoading: false,
				page: 1,
				size: 10,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				scrollState: false,
				menuButtonInfo: {},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f92028'
					}
				}],

				revertShow: false,
				isDefine: 1,
				list: [{
						name: '庆趣'
					},
					{
						name: '美团'
					},
					{
						name: '饿了么'
					}
				],
				curIndex: 1,
				movinggoodsList: [],
				lenlent: [],
				maxnumShow: true,
				menuButtonInfo: {},
				gaodu: '',
				tipstext:''
			};
		},
		onReady() {
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif

		},
		onReachBottom() {
			var that = this
			// console.log("1111111111111111111111")
			// that.loadMoreStatus = 'loading';
			// if (that.page * that.size == that.goodsGuessList.length) {
			// 	that.page++
			// 	// that.goodsGuessHandle()
			// } else {
			// 	that.loadMoreStatus = "noMore"
			// }
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			// let to_scroll_top = e.scrollTop+20

			// uni.createSelectorQuery().select('.goods-detail-guess').boundingClientRect((res) => {
			// 	let a = uni.getSystemInfoSync()
			// 	let t_height = res.height-a.screenHeight

			// 	if(t_height<=to_scroll_top){
			// 		that.loadMoreStatus = 'loading';
			// 		if (that.page * that.size == that.goodsGuessList.length) {
			// 			console.log("这里")
			// 			that.page++
			// 			// that.goodsGuessHandle()
			// 		}
			// 	}
			// }).exec()
		},
		methods: {
			searchInput: function(e) {
				var that = this
				that.keywords = e.detail.value
			},
			goSearch: function() {
				var that = this
				uni.showLoading({
					title: '加载中~',
					mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
				});
				that.goodsList()
			},
			changeMenu(index) {
				this.curIndex = index;
			},
			isChange: function() {
				var that = this
				that.isDefine = 1
				that.revertShow = false
				uni.navigateTo({
					url: './movingrecord'
				})
			},
			isChanges: function() {
				var that = this
				that.isDefine = 2
				that.revertShow = false
				uni.setStorageSync("url", 'https://www.ok9288.com/article-288.html');
				uni.setStorageSync("webtitle", '同步教程');
				uni.navigateTo({
					url: '/pagesB/webviews/webviews'
				})
			},
			tommoving: function() {
				var that = this
				that.revertShow = true
			},
			navigateBack: function() {
				uni.navigateBack()
			},
			tommovingrecord: function() {
				uni.navigateTo({
					url: '/pagesC/movingGoods/movingrecord'
				})
			},
			maxnumShowNo: function() {
				var that = this
				that.maxnumShow = false
			},
			revertShowNo: function() {
				var that = this
				that.revertShow = false
				// uni.navigateBack()
			},
			initData() {
				var that = this
				setTimeout(() => {
					that.goodsList();
					uni.stopPullDownRefresh();
				}, 10);
			},
			//购物车列表
			goodsList() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/order_list',
					method: 'POST',
					data: {
						keyword: that.keywords,
						sort: 'desc',
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						uni.hideLoading()
						if (res.data.status == 'success') {
							for (var i = 0; i < res.data.data.length; i++) {
								res.data.data[i].checked = false
								for (var j = 0; j < res.data.data[i].goods.length; j++) {
									res.data.data[i].goods[j].checked = false
								}
							}
							that.movinggoodsList = res.data.data
							that.dscLoading = false
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			gettipstext:function(){
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/tipstext',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						that.tipstext = res.data.data
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			//选择店铺
			checkShop(shop, index) {
				this.lenlent = [...new Set(this.lenlent)]
				console.log(222,this.lenlent);
				if (this.movinggoodsList[index].checked == false) {
					this.movinggoodsList[index].checked = true
					for (var i = 0; i < shop.goods.length; i++) {
						shop.goods[i].checked = true
						this.lenlent.push(shop.goods[i])
					}
				} else {
					this.movinggoodsList[index].checked = false
					for (var i = 0; i < shop.goods.length; i++) {
						shop.goods[i].checked = false
					}

					this.lenlent = this.lenlent.filter((item1) => !shop.goods.some((item2) => item1.goods_id === item2
						.goods_id));
				}
			},
			//勾选商品
			checkGoods(listIndex, index) {
				if (this.movinggoodsList[listIndex].goods[index].checked == false) {
					this.movinggoodsList[listIndex].goods[index].checked = true
					this.lenlent.push(this.movinggoodsList[listIndex].goods[index])
				} else {
					this.movinggoodsList[listIndex].goods[index].checked = false
					console.log(this.lenlent.length)
					for (var i = 0; i < this.lenlent.length; i++) {
						if (this.lenlent[i].goods_id == this.movinggoodsList[listIndex].goods[index].goods_id) {
							this.lenlent.splice(i, 1)
						}
					}
				}

				var abc = this.movinggoodsList[listIndex].goods.every((item) => item.checked == true);

				if (abc == true) {
					this.movinggoodsList[listIndex].checked = true
				} else {
					this.movinggoodsList[listIndex].checked = false
				}
				this.lenlent = [...new Set(this.lenlent)]
			},

			//提交购物车到结算页面
			onSubmit() {
				var that = this
				console.log(333,JSON.stringify(that.lenlent))
				console.log(that.curIndex)
				if (that.lenlent.length > 10) {
					uni.showToast({
						title: '当前勾选商品数量为 ' + that.lenlent.length + ' 个，已超出最大数量10，请重新选择',
						icon: 'none',
						duration: 3000
					})
					return;
				}
				// api/sync/is_can_sync

				uni.request({
					url: that.websiteUrl + '/api/sync/is_can_sync',
					method: 'POST',
					data: {
						product_list: JSON.stringify(that.lenlent),
						type: that.curIndex,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(111,res.data)
						console.log(6,that.lenlent);
						uni.hideLoading()
						if (res.data.status == 'success') {
							var ab = that.lenlent.map(function(obj, index) {
								return obj.goods_id;
							}).join(",");
							var cd = that.lenlent.map(function(obj, index) {
								return obj.order_id;
							}).join(",");
							// var ef = that.lenlent.map(function(obj, index) {
							// 	return obj.goods_attr_id;
							// }).join(",");
							var dataaa = that.lenlent
							let ef = dataaa.map(item => item.goods_attr_id).join('@');
							// var data = that.lenlent
							// let ef = data
							//     .filter(item => item.goods_attr_id && item.goods_attr_id !== '')
							//     .map(item => item.goods_attr_id)
							//     .join('@');
							console.log(123,ef); // 输出：1052029,1052008@1052007,1052029
							// console.log(123,ef);
							uni.setStorageSync("goodsids", ab);
							uni.setStorageSync("orderids", cd);
							uni.setStorageSync("curIndex", that.curIndex);
							uni.setStorageSync("goodsattrids",ef);
							console.log(0,that.lenlent.goods_attr_id);
							console.log(1,ab);
							console.log(2,cd);
							console.log(3,ef);
							uni.navigateTo({
								url: './movingGoodsTwo'
							})
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none',
								duration: 3000
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			}
		},
		onPullDownRefresh() {
			var that = this
			uni.showLoading({
				title: '加载中~',
				mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
			});
			that.initData();
		},
		onShow() {
			// uni.showModal({
			// 	title: '温馨提示',
			// 	content: '上传商品最多勾选10个',
			// 	confirmColor: '#FE0302', //确定字体颜色
			// 	showCancel: false,//没有取消按钮的弹框
			// 	buttonText: '确定',
			// 	success: function (res) {
			// 		if (res.confirm) {
			// 			console.log('用户点击确定');
			// 		} else if (res.cancel) {
			// 			console.log('用户点击取消');
			// 		}
			// 	}
			// });

			this.goodsList();
			this.gettipstext();
			this.lenlent = []
			this.curIndex = 1
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		width: 100%;
		height: 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		/* max-width: 640px; */
		/* margin: 0 auto; */
	}

	/* 导航 start */
	.nav_bar {
		.status_bar {
			background-color: #f9f9f9;
			height: var(--status-bar-height);
			width: 100%;
		}
	}

	/* 导航 end */

	::-webkit-scrollbar {
		display: none;
	}

	.activity-tag {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
	}

	.parts-tag {
		left: -6rpx;
	}

	/* .container{ padding-bottom: 300upx;} */
	.header-address {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		/* #ifdef APP-PLUS */
		width: 95%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 70%;
		margin-left: 20rpx;
		margin-top: -20rpx;
		/* #endif */
		padding: 20upx;
	}

	.header-address .address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 80%;
		line-height: 30rpx;
	}

	.header-address .address-box .iconfont {
		margin-right: 10upx;
	}

	.card-goods {}

	.card-goods-group {
		padding: 10rpx 30rpx 0rpx 30rpx;
		background: #FFFFFF;
	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		padding: 0 0 20upx;
		justify-content: space-between;
	}

	.card-shop-head .head-left,
	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;
	}


	.checkbox-icon .uni-icon {
		display: block;
	}

	.card-shop-box {}

	.card-act-goods {
		display: flex;
		flex-direction: column;
		margin-bottom: 20upx;
	}

	.card-act-goods:last-child {
		margin-bottom: 0;
	}

	.cart-act-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 20upx 60upx;
	}

	.cart-act-title .txt {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333333;
	}

	.cart-act-title .txt .em-icon {
		margin-right: 20upx;
	}

	.cart-act-title .txt .act-name view {
		font-size: 25upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cart-act-title .more {
		display: flex;
		flex-direction: row;
		color: #f92028;
		align-items: center;
	}

	.cart-goods-item {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		width: 100%;
	}

	.cart-goods-item .checkbox-con {
		// border-bottom: 1px solid #E5E5E5;
	}

	.cart-goods-item:last-child .checkbox-con {
		border-bottom: 0;
	}

	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
	}

	.cart-goods-info .goods-img {
		width: 120upx;
		height: 120upx;
		border: 1rpx solid #ececec;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 120upx;
		height: 120upx;
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

	.cart-goods-info .goods-img .mask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		z-index: 99;
		background: rgba(0, 0, 0, .7);
	}

	.cart-goods-info .goods-img .mash-text {
		width: 100%;
		color: #fff;
		text-align: center;
		z-index: 100;
		position: absolute;
		top: 0;
		bottom: 0;
		line-height: 180upx;
	}

	.cart-goods-item-outer .cart-goods-info {
		background: #fff9f8;
	}

	.cart-goods-item-outer .checkbox-con {
		padding-left: 60upx;
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

	.price {
		color: #f92028;
	}

	.cart-goods-content .goods-info .stepper_sum {
		color: #999999;
	}

	.cart-goods-content .goods-other {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 15upx;
		position: relative;
	}

	.cart-goods-content .goods-other .em-icon {
		padding: 0 3px;
		margin-right: 2px;
	}

	.cart-goods-content .goods-other .act-name {
		width: calc(100% - 45px);
		font-size: 25upx;
		color: #999999;
	}

	.cart-goods-content .goods-other .uni-icon {
		position: absolute;
		right: 0;
		top: 2px;
	}

	.scroll-view-G {
		display: flex;
		align-items: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.scroll-view-item-right {
		width: 20%;
		margin-left: 10px;
		height: 100%;
		line-height: 100%;
		text-align: center;
		background: #f92028;
		color: #FFFFFF;
		position: relative;
	}

	.scroll-view-item-right view {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.em-icon {
		width: 25px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		color: #FFFFFF;
		background: #f92028;
		font-size: 22upx;
		text-align: center;
	}

	.em-icon.active-zeng {
		background-color: #9251e5;
	}

	.em-icon.active-zhekou {
		background-color: #fc9b1f;
	}

	.cart-submit {
		width: 100%;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		align-items: center;
		border-top: 1px solid #e3e8ee;
		box-shadow: 2px 2px 5px #e3e8ee;
		border-radius: 50rpx 50rpx 0 0;
	}

	.cart-submit .checkall {
		padding: 0 20upx;

	}

	.cart-submit .checkall .checkbox .checkbox-icon {
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text {
		text-align: right;
		width: 100%;
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text view {
		line-height: 1.5;
	}

	.cart-submit .submit-bar-text text {
		margin-right: 10upx;
	}

	.cart-submit .submit-bar-price {
		display: inline-block;
		color: #f92028;
		font-weight: 500;
		font-size: 32upx;
	}

	.cart-submit .submit-bar-sub {
		font-size: 25upx;
		color: #999999;
	}

	.flow-no-cart {
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 10upx;
		text-align: center;
		overflow: hidden;
	}

	.flow-no-cart .gwc-bg {
		display: flex;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		background: #fcfcfc;
		justify-content: center;
		align-items: center;
		border: 1px solid #d9d9d9;
		margin: 40px auto 20px;
	}

	.flow-no-cart .gwc-bg .iconfont {
		font-size: 40px;
		color: #d9d9d9;
	}

	.flow-no-cart text {
		color: #333333;
		font-size: 30upx;
	}

	.flow-no-cart .card-btn {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 20px 0 40px;
	}

	.flow-no-cart .card-btn button {
		margin: 0 5px;
		border-color: #d9d9d9;
		font-size: 16px;
	}

	.goods-detail-guess {
		// padding-bottom: 120upx;
		background-color: #f5f5f5;
	}

	.act-item-right {
		display: flex;
		flex-direction: row;
		align-content: center;
		padding: 10upx 20upx 10upx 0;
	}

	.act-item-right .em-icon {
		margin-right: 20upx;
	}

	.act-item-right .act-name {
		font-size: 25upx;
		color: #999999;
	}

	.activity-popup .cart-goods-item {
		min-height: initial;
	}

	.goods-store {
		background: #FFFFFF;
		padding: 10upx 0;
		text-align: right;
		font-size: 25upx;
	}

	.shop-store-cart {
		padding: 0 20rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.shop-store-cart .store-btn {
		border: 1px solid #f42424;
		color: #f42424;
		line-height: normal;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10upx 20upx;
	}

	.shop-store-cart .store-btn .iconfont {
		vertical-align: top;
		margin: -16upx 10upx 0 0;
	}

	/* #ifdef APP-PLUS */
	.app-header-top {
		padding-top: 80upx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.app-header-top {
		padding-top: calc(var(--status-bar-height) - 20rpx + 44px);
	}

	/* #endif */

	/*loading*/
	.loading-transparent {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}

	.loading-transparent ::v-deep .uni-load-more {
		z-index: 999;
		top: 50%;
		left: 50%;
		position: absolute;
		margin: -20px 0 0 -20px;
		width: 40px;
	}

	.loading-transparent .loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
	}

	.cart-submit .btn-bar {
		margin: 30rpx;
		border-radius: 50rpx;
		font-size: 32rpx;
	}

	.cart-submit .btn-bar .btn-disabled {
		background: linear-gradient(178deg, #f91f28, #ff4f2e);
		border-radius: 50rpx;
		opacity: .5;
		color: #fff;
	}

	.cart-submit .btn-bar .btn-red {
		background: linear-gradient(178deg, #fc0017, #fc0017);
		border-radius: 50rpx;
		color: #fff;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	uni-swipe-action {
		margin-bottom: 10px;
	}

	.uni-swipe_text--center {
		margin-right: 10px;
	}







	.product-list-lie {
		// margin-bottom: 150rpx;
	}


	/*新版样式*/
	.product-new {
		margin: 20rpx 20rpx 0;
		background-color: #f5f5f5;
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
		padding: 20rpx 20rpx 0rpx 20rpx;
	}

	.product-new .goods-list .item .info-box .goods-name {
		color: #000;
		font-weight: 500;
		height: 42px;
		line-height: 20px;
		font-size: 30rpx;
		margin-top: -16rpx;
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

	.shop_name_class {
		color: #A2A2A2;
		font-size: 26rpx;
		margin-right: 6rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	/* 顶部导航栏开始 */
	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #f8f8f8;
	}

	.search-tab {
		margin: 30rpx 20rpx 10rpx 10rpx;
		font-size: 32rpx;
		color: #000000;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		text-align: center;
		align-items: center;
	}

	.search_submit {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.search_1 {
		color: #191919;
		border: 2rpx solid #999999;
		margin: 10rpx 20rpx 20rpx 20rpx;
		border-radius: 40rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.search_2 {
		background-color: #f8f8f8;
		width: 100%;
	}

	.search_area {
		width: 80%;
		color: #333;
		font-size: 28rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	/* 顶部导航栏结束 */
	.swiper-boxs {
		filter: blur(5px);
	}

	.swiper-box {
		height: 100%;
		overflow-x: hidden;
		background-color: #f8f8f8;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.5;
	}

	.wxshare {
		text-align: center;
		border-radius: 0rpx;
		width: 30%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		/* #ifdef MP-WEIXIN */
		top: 10%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		top: 8%;
		/* #endif */
		right: 0%;
		z-index: 9999;
	}

	.graying {
		color: #000000;
		font-size: 28rpx;
	}

	.darking {
		color: #FE0302;
		font-size: 28rpx;
	}

	.scroll-item {
		padding: 20rpx 10rpx 10rpx 20rpx;
		display: inline-block;
		text-align: center;

		.item-text {
			border-radius: 50rpx;
			background-color: #F4F4F4;
			padding: 2rpx 22rpx;
			/* #ifdef MP-WEIXIN */
			width: 180rpx;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			width: 140rpx;
			/* #endif */

			&.active {
				color: #FE0302;
				border-radius: 50rpx;
				background-color: #fedede;
				padding: 2rpx 22rpx;
				/* #ifdef MP-WEIXIN */
				width: 180rpx;
				/* #endif */
				/* #ifndef MP-WEIXIN */
				width: 140rpx;
				/* #endif */
			}
		}
	}

	.goodsTitles {
		line-height: 40rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}


	.cover1 {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.2;
	}

	.wxshare1 {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background: linear-gradient(to bottom, #feeeee 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_3_1 {
		font-size: 38rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}
	
	.tui-order-title-1{
		font-size: 28rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		margin-left: 30rpx;
		margin-right: 20rpx;
		text-align: left;
	}

	.add_box3_cui_2 {
		width: 30%;
		margin-left: 35%;
		margin-bottom: 50rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #ffffff;
		background-color: #FE0302;
		border-radius: 20rpx;
		font-size: 30rpx;
	}
	
	/* 导航 start */
	.status_bar {
		background-color: #f9f9f9;
		height: var(--status-bar-height);
		width: 100%;
	}
	
	.chat_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifndef MP-WEIXIN */
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 78%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
	}
	
	.chat_2 {
		display: flex;
		flex-direction: row;
	}
	
	.chat_2_1 {
		display: flex;
		flex-direction: row;
		margin-top: 6rpx;
	}
	
	/* 导航 end */
</style>