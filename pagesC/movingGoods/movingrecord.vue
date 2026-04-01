<template>
	<view class="container">
		<view v-if="replenishmentList.length == 0">
			<dsc-not-content></dsc-not-content>
		</view>
		<view v-else class="product-list-lie">
			<view style="height: 30rpx;background-color: #ffffff;"></view>
			<view v-for="(item, index) in replenishmentList" :key="index">
				<view class="tui-list-cell_1">
					<view class="tui-list-cell">
						<view style="border: 2rpx solid #F4F4F4;width: 100%;border-radius: 10rpx;">
							<view style="background-color: #f0eeee;border-radius: 10rpx 10rpx 0 0;padding: 6rpx 20rpx;display: flex;flex-direction: row;justify-content: space-between;">
								<view class="title_1_1">
									ID：{{item.id}}
									<text v-if="item.type==1">（庆趣）</text>
									<text v-if="item.type==2">（美团）</text>
									<text v-if="item.type==3">（饿了么）</text>
								</view>
								<view style="background-color: #FE0302;color: #ffffff;margin: 4rpx;padding: 2rpx 24rpx;border-radius: 12rpx;font-size: 24rpx;line-height: 44rpx;height: 48rpx;" @click="toviewtasks(item.id)">查看任务</view>
							</view>
							
							<view style="width: 100%;padding: 20rpx;">
								<view style="display: flex;flex-direction: row;">
									<view style="width: 22%;font-size: 24rpx;">任务进度：</view>
									<view class="title_1">{{item.sync_progress}}</view>
								</view>
								<view style="display: flex;flex-direction: row;margin-top: 20rpx;align-items: center;">
									<view style="width: 28%;font-size: 24rpx;">是否上架：</view>
									<view style="display: flex;flex-direction: row;justify-content: space-between;width: 100%;">
										<view style="" v-if="item.sync_attr==0">
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;">
												否</view>
										</view>
										<view style="" v-if="item.sync_attr==1">
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;">
												是</view>
										</view>
										<view style="display: flex;flex-direction: row;align-items: center;width: 35%;">
											<view style="font-size: 24rpx;">同步属性：</view>
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;" v-if="item.is_onsale==1">
												是</view>
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;" v-if="item.is_onsale==0">
												否</view>
										</view>
										<view style="display: flex;flex-direction: row;align-items: center;width: 50%;">
											<view style="font-size: 24rpx;">同步状态：</view>
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;" v-if="item.sync_state==0">
												同步中</view>
											<view style="border: 2rpx solid #C0C0C0;padding: 0rpx 14rpx;border-radius: 10rpx;font-size: 24rpx;line-height: 44rpx;height: 44rpx;" v-if="item.sync_state==1">
												已结束</view>
										</view>
									</view>
								</view>
								
								<view style="display: flex;flex-direction: row;margin-top: 10rpx;">
									<view style="width: 22%;font-size: 24rpx;">创建时间：</view>
									<view class="title_1">{{item.create_time}}</view>
								</view>
								<view style="display: flex;flex-direction: row;margin-top: 0rpx;">
									<view style="width: 22%;font-size: 24rpx;">更新时间：</view>
									<view class="title_1">{{item.update_time}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 1" />
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
	</view>
</template>
<script>
	import tuiListCell from '@/components/list-cell/list-cell';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	export default {
		components: {
			tuiListCell,
			uniLoadMore,
			dscNotContent,
			dscFilterTop
		},
		data() {
			return {
				replenishmentList: [],
				size: 10,
				page: 1,
				
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				dscLoading: true,
				scrollState: false,
			};
		},
		onLoad() {
			var that = this;
			that.jiazai()
		},
		onPageScroll(e) {
			var that = this
			
			that.scrollState = e.scrollTop > 800 ? true : false
		
			let to_scroll_top = e.scrollTop + 100
		
			uni.createSelectorQuery().select('.product-list-lie').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight
		
				if (t_height <= to_scroll_top) {
					if (that.page * that.size == that.replenishmentList.length) {
						that.loadMoreStatus = 'loading';
						console.log("这里")
						that.page++
						that.jiazai()
					}
				}
			}).exec()
		},
		onReachBottom() {
			var that = this
			console.log("111")
			console.log(that.page)
			console.log(that.size)
			console.log(that.page * that.size)
			console.log(that.replenishmentList.length)
			console.log(that.page * that.size == that.replenishmentList.length)
			if (that.page * that.size == that.replenishmentList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				console.log("1111")
				that.jiazai()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		onPullDownRefresh() {
			var that = this
			setTimeout(() => {
				uni.stopPullDownRefresh();
				that.page = 1
				that.jiazai()
			}, 1000);
		},
		methods: {
			toviewtasks:function(id){
				uni.navigateTo({
					url:'/pagesC/movingGoods/viewTasks?id=' + id
				})
			},
			jiazai: function() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/up_record_list',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						size: that.size,
						page: that.page,
					},
					success: (res) => {
						console.log(res)
						if (that.page == 1) {
							that.dscLoading = false
						}
						if (res.statusCode == 200) {
							if (res.data.data.length < 10) {
								that.loadMoreStatus = 'noMore'
							}
							if (that.page == 1) {
								that.replenishmentList = res.data.data
							} else {
								that.replenishmentList = that.replenishmentList.concat(res.data.data)
							}
						}
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #fff;
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
		width: 75%;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-height: 40rpx;
	}

	.title_1_1 {
		
		font-size: 28rpx;
		font-weight: bold;
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
</style>