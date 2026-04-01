<template>
	<view class="container">
		<view v-if="replenishmentList.length == 0">
			<dsc-not-content></dsc-not-content>
		</view>
		<view v-else>
			<view style="height: 30rpx;background-color: #ffffff;"></view>
			<view v-for="(item, index) in replenishmentList" :key="index" style="background-color: #ffffff;">
				<view class="tui-list-cell_1">
					<view class="tui-list-cell">
						<view style="border: 2rpx solid #F4F4F4;width: 100%;border-radius: 10rpx;">
							<view
								style="background-color: #f0eeee;border-radius: 10rpx 10rpx 0 0;padding: 6rpx 20rpx;display: flex;flex-direction: row;justify-content: space-between;">
								<view class="title_1_1">
									ID：{{item.id}}
									<text v-if="item.type==1">（趣好卖）</text>
									<text v-if="item.type==2">（美团）</text>
									<text v-if="item.type==3">（饿了么）</text>
								</view>
								<view
									style="background-color: #FE0302;color: #ffffff;margin: 4rpx;padding: 2rpx 24rpx;border-radius: 12rpx;font-size: 24rpx;line-height: 44rpx;height: 48rpx;"
									v-if="item.sync_state==2" @click="toReupload(item)">重新上传</view>
							</view>
							<view style="width: 100%;padding: 20rpx;">
								<view style="display: flex;flex-direction: row;align-items: center;">
									<view style="width: 20%;font-size: 24rpx;">商品图片：</view>
									<view class="goods-img">
										<image :src="item.goods_img" style="height: 120rpx;width: 120rpx;"></image>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;">
									<view style="width: 20%;font-size: 24rpx;">商品名称：</view>
									<view class="title_1">{{item.title}}</view>
								</view>

								<view style="display: flex;flex-direction: row;margin-top: 10rpx;align-items: center;">
									<view style="width: 20%;font-size: 24rpx;">类　　目：</view>
									<view class="moving_3"
										style="display: flex;flex-direction: row;justify-content: space-between;">
										<view class="moving_2" v-if="item.sp_name[0]">
											<view class="moving_1">{{item.sp_name[0]}} </view>
										</view>
										<view class="moving_2" v-else>
											<view class="moving_1">无</view>
										</view>
										<view class="moving_2" v-if="item.sp_name[1]">
											<view class="moving_1">{{item.sp_name[1]}} </view>
										</view>
										<view class="moving_2" v-else>
											<view class="moving_1">无 </view>
										</view>
										<view class="moving_2" v-if="item.sp_name[2]">
											<view class="moving_1">{{item.sp_name[2]}} </view>
										</view>
										<view class="moving_2" v-else>
											<view class="moving_1">无 </view>
										</view>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;margin-top: 20rpx;align-items: center;">
									<view style="width: 20%;font-size: 24rpx;">分　　类：</view>
									<view class="moving_7"
										style="border: 2rpx solid #C0C0C0;padding: 4rpx 14rpx;border-radius: 10rpx;line-height: 46rpx;height: 46rpx;"
										v-if="item.cate">
										<view style="font-size: 24rpx;">{{item.cate}}</view>
									</view>
									<view class="moving_7"
										style="border: 2rpx solid #C0C0C0;padding: 4rpx 14rpx;border-radius: 10rpx;line-height: 46rpx;height: 46rpx;"
										v-else>
										<view style="font-size: 24rpx;">无</view>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;margin-top: 20rpx;align-items: center;">
									<view style="width: 26%;font-size: 24rpx;">同步状态：</view>
									<view
										style="display: flex;flex-direction: row;justify-content: space-between;width: 100%;">
										<view class="moving_5">
											<view
												style="border: 2rpx solid #C0C0C0;padding: 0rpx 24rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;text-align: center;"
												v-if="item.sync_state==0">
												待同步</view>
											<view
												style="border: 2rpx solid #C0C0C0;padding: 0rpx 24rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;text-align: center;"
												v-if="item.sync_state==1">
												同步成功</view>
											<view
												style="border: 2rpx solid #C0C0C0;padding: 0rpx 24rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;text-align: center;"
												v-if="item.sync_state==2">
												同步失败</view>
										</view>
										<view style="display: flex;flex-direction: row;align-items: center;"
											class="moving_4">
											<view style="font-size: 24rpx;width: 48%;">图片同步状态：</view>
											<view class="moving_6" v-if="item.sync_image==0">
												待同步</view>
											<view class="moving_6" v-if="item.sync_image==1">
												同步成功</view>
											<view class="moving_6" v-if="item.sync_image==2">
												同步失败</view>
										</view>
									</view>
								</view>

								<view style="display: flex;flex-direction: row;margin-top: 10rpx;">
									<view style="width: 20%;font-size: 24rpx;">失败原因：</view>
									<view class="title_1_duo" style="color: #FE0302;">{{item.fail_reason}}</view>
								</view>
								<view style="display: flex;flex-direction: row;">
									<view style="width: 20%;font-size: 24rpx;">创建时间：</view>
									<view class="title_1">{{item.create_time}}</view>
								</view>
								<view style="display: flex;flex-direction: row;margin-top: 10rpx;">
									<view style="width: 20%;font-size: 24rpx;">更新时间：</view>
									<view class="title_1">{{item.update_time}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import tuiListCell from '@/components/list-cell/list-cell';
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		components: {
			tuiListCell,
			dscNotContent
		},
		data() {
			return {
				replenishmentList: [],
				id: ''
			};
		},
		onLoad(option) {
			var that = this;
			that.id = option.id
			that.jiazai()
		},
		methods: {
			toReupload: function(item) {
				var that = this
				uni.showLoading({
					title: '加载中~',
					mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
				});
				var abcd = []
				item.goods_id = item.product_id
				abcd.push(item)
				console.log(abcd)
				console.log('product_list:' + abcd)
				console.log('type:' + item.type)
				uni.request({
					url: that.websiteUrl + '/api/sync/is_can_sync',
					method: 'POST',
					data: {
						product_list: JSON.stringify(abcd),
						type: item.type,
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
							uni.setStorageSync("goodsids", item.product_id);
							uni.setStorageSync("orderids", item.order_id);
							uni.setStorageSync("curIndex", item.type);
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


			},
			jiazai: function() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/up_record_detail',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						id: that.id
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							that.replenishmentList = res.data.data
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					}
				})
			}
		}
	};
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


	.tui-list-cell {
		display: flex;
		align-items: center;
		padding: 0rpx 30upx 30upx 30upx;
		font-size: 28rpx;
		width: 100%;
	}

	.title_1 {
		font-size: 24rpx;
		/* #ifdef MP-WEIXIN */
		width: 80%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 76%;
		/* #endif */
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-height: 34rpx;
	}

	.title_1_duo {
		font-size: 24rpx;
		/* #ifdef MP-WEIXIN */
		width: 80%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 76%;
		/* #endif */
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-height: 34rpx;
	}
	

	.topShang {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: 0rpx;
		/* #endif */
		/* #ifdef H5 */
		top: 80rpx;
		/* #endif */
		width: 100%;
		z-index: 99;
	}

	.title_1_1 {
		background-color: #f0eeee;
		border-radius: 10rpx 10rpx 0 0;
		padding: 6rpx 20rpx;
		font-size: 28rpx;
		font-weight: bold;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-list-cell_1 {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0upx 0upx 0upx 0upx;
		font-size: 28rpx;
	}

	.tui-line-cell_2_1 {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.title {
		display: inline-flex;
		font-size: 24rpx;
		color: #999999;
	}

	.moving_1 {
		font-size: 22rpx;
		color: #000000;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.moving_2 {
		border: 2rpx solid #C0C0C0;
		padding: 0rpx 14rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		line-height: 44rpx;
		height: 44rpx;
		/* #ifdef MP-WEIXIN */
		width: 33%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 24%;
		/* #endif */
		text-align: center;
	}

	.moving_3 {
		/* #ifdef MP-WEIXIN */
		width: 78%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 75%;
		/* #endif */
	}

	.moving_4 {
		/* #ifdef MP-WEIXIN */
		width: 69%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 70%;
		/* #endif */
	}

	.moving_5 {
		/* #ifdef MP-WEIXIN */
		width: 30%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 28%;
		/* #endif */
	}

	.moving_6 {
		border: 2rpx solid #C0C0C0;
		padding: 0rpx 24rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		line-height: 44rpx;
		height: 44rpx;
		text-align: center;
		/* #ifdef MP-WEIXIN */
		width: 48%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 30%;
		/* #endif */
	}
	
	.moving_7 {
		/* #ifdef MP-WEIXIN */
		width: 78%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 71%;
		/* #endif */
	}
	
	.goods-img {
		border: 1rpx solid #ececec;
		width: 120upx;
		height: 120upx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}
</style>