<template>
	<view class="container mt16">
		<view style="">
			<view style="background-color: #ffffff;" v-if="callThePoliceList.length > 0"></view>
			<view v-if="callThePoliceList.length == 0 && loadingType == 'noMore'">
				<dsc-not-content></dsc-not-content>
			</view>
			<view v-else>
				<tui-list-cell padding="0" :lineLeft="false" :arrow="false" v-for="(item, index) in callThePoliceList"
					:key="index">
					<view class="logList co1b bgfa">
						<view class="listItem wi100 bgff mb16">
							<view class="wi100 list-items">
								<view class="itemHead">
									<view>导入ID：{{item.id}}</view>
								</view>
								<view class="wi100 pa24">
									<view class="itemBody">
										<view class="wi21"> 导入时间：</view>
										<view>{{item.dateline}}</view>
									</view>
									<view class="itemBody">
										<view class="wi21">导入结果：</view>
										<view class="flex-start">
											<view>
												导入成功 <span class="red">{{item.success_num}}</span>个，
												导入失败<span class="red">{{item.fail_num}}</span>个
											</view>
										</view>
									</view>
									<view class="itemBody pore" v-if="item.url_fail" @click="clickUrl(item)">
										<view class="wi21">失败原因：</view>
										<!-- <view class="onelist-hidden" style="width: 70%;margin-right: 20rpx;">
											{{item.url}}
										</view> -->
										<view class=""
											style=" padding: 15rpx 20rpx; position: absolute;top: -20%;right: 3%;">
											<!-- <image src="/static/common/arrowr.png" mode=""
												style="width: 24rpx;height: 24rpx;"></image> -->
										<text style="width: 24rpx;height: 24rpx;" class="iconfont icon-more "></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</tui-list-cell>
				<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
				<!-- <backTop :src="backTop.src" :scrollTop="backTop.scrollTop"></backTop> -->
				<uni-load-more :status="loadingType"></uni-load-more>

	
			</view>
		</view>

		<!-- 失败链接弹框 -->
		<view class="" v-if="isUrl" @touchmove.stop.prevent="moveHandle">
			<view class="cover" catchtouchmove="true" @click="toClose"></view>
			<view class="wxshare" style="padding: 32rpx 24rpx;">
				<view style="position: absolute;right:32rpx;top: 16rpx;" @click="toClose">
					<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890133364.jpg" style="height: 50rpx;width: 50rpx;"></image>
				</view>
				<view class="urltitle">失败原因</view>
				<view class="urllist">
					<scroll-view scroll-y scroll-with-animation style="max-height: 700rpx;">
						<view class="" v-for="(item,index) in url_fail" style="position: relative;">
							<view class="item-url" @click="toCopy(item)">
								<view class="urll">{{item}}</view>
							</view>
							<view class=""
								style="margin:10rpx 0 24rpx;display: flex;justify-content: space-between;font-size: 28rpx; ">
								<view class="urlred" style="">{{item.msg}}</view>
								<!-- <span class="copy" @click="toCopy(item)">复制</span> -->
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

	</view>
</template>
<script>
	var app = getApp()
	var commonParam;
	var a;

	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import tuiListCell from '@/components/list-cell/list-cell';
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		components: {
			tuiListCell,
			uniLoadMore,
			dscFilterTop,
			dscNotContent
		},
		data() {
			return {
				scrollState:false,
				pageNum: 1,
				loadingType: 'loading',
				backTop: {
					src: '/static/back-top/top.png',
					scrollTop: 0
				},
				scrollTop: 0,
				callThePoliceList: [],
				jiqiname: '请选择',
				huodao_id: '',
				machine_id: '',
				tripartiteShow: false,
				threeheight: '',
				tripartiteList: [],
				inventory: {},
				mark: '',
				isUrl: false,
				url_fail: []

			};
		},
		onLoad(option) {
			var that = this;
			commonParam = {
				CLIENT_API: 'BIZ',
				CLIENT_OS: '',
				CITY_ID: '',
				CLIENT_VER: '',
				REGISTER_ID: '',
				TOKEN: uni.getStorageSync('token'),
				data: '',
			}
			that.threeheight = uni.getSystemInfoSync().windowHeight * 0.8
			that.jiazai()
		},
		// 下拉刷新数据
		onPullDownRefresh() {
			console.log("zheli")
		},
		onReachBottom() {
			this.jiazai()
		},
		onPageScroll(e) {
			this.scrollState = e.scrollTop > 800 ? true : false
		},
		methods: {
			toClose() {
				this.isUrl = false
			},
			moveHandle() {},
			// 失败链接
			toCopy(item) {
				var that = this
				uni.setClipboardData({
					data: item.url,
					success: function() {
						// that.tui.toast("复制成功")
						uni.showToast({
							title: "复制成功",
							icon: 'none',
							style: {
								"z-index": 9999
							}
						})
					}
				});
			},
			clickUrl(item) {
				var that = this
				that.url_fail = item.url_fail
				if (item.url_fail.length > 0) {
					that.isUrl = true
				}
			},
			cuidanYes: function() {
				var that = this
				that.tripartiteShow = false
			},
			toStatusjiqi: function(item) {
				var that = this
				that.tripartiteShow = true
				that.tripartiteList = item.type_arr
			},
			jiazai() {
				console.log(1)
				var that = this
				var newAttr = []
				

		
			
				uni.request({
					url: this.websiteUrl + '/api/puhuo/daorulog',
					method: 'POST',
					data: {
						version:1,
						page: this.pageNum,
			
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
					
						if (res.data.data.length > 0) {
							if (res.data.data.length < 10) {
								that.loadingType = 'noMore'
							} else {
								that.loadingType = 'loading'
							}
							that.callThePoliceList = that.callThePoliceList.concat(res.data.data);
							
						} else {
							that.loadingType = 'noMore'
						}
						that.pageNum = that.pageNum + 1;
					
					commonParam.API = ''
					commonParam.data = ''
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			// jiazai: function() {
			// 	var that = this
			// 	a = {
			// 		"page": that.pageNum,
			// 		"version": 1
			// 	}
			// 	// commonParam.API = "api/puhuo/daorulog"
			// 	commonParam.data = JSON.stringify(a)

			// 	uni.request({
			// 		url: that.websiteUrl + 'api/puhuo/daorulog',
			// 		method: 'POST',
			// 		header: {
			// 			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			// 		},
			// 		data: commonParam,
			// 		success: (res) => {
			// 			if (res.data.error == 0) {
			// 				if (res.data.items.length > 0) {
			// 					if (res.data.items.length < 10) {
			// 						that.loadingType = 'noMore'
			// 					} else {
			// 						that.loadingType = 'loading'
			// 					}
			// 					that.callThePoliceList = that.callThePoliceList.concat(res.data.items);
			// 				} else {
			// 					that.loadingType = 'noMore'
			// 				}
			// 				that.pageNum = that.pageNum + 1;
			// 			} else {
							
			// 				// that.tui.toast(res.data.message);
			// 			}
			// 			commonParam.API = ''
			// 			commonParam.data = ''
			// 		},
			// 		fail: (data, code) => {
			// 			uni.showToast({
			// 				title: "网络连接不可用,请检查网络",
			// 				icon: 'none',
			// 				style: {
			// 					"z-index": 9999
			// 				}
			// 			})
			// 			// that.tui.toast('网络连接不可用,请检查网络')
			// 		}
			// 	})
			// },

		}
	};
</script>
<style lang="scss">
	.red {
		color: #FD3E3C;
		margin-left: 12rpx;
		font-size: 28rpx;
	}

	.item_box {
		display: flex;
		margin-bottom: 24rpx;
		color: #1B1B1B;
		font-size: 28rpx;
		align-items: center;
	}

	.tui-list-cell {
		display: flex;
		align-items: center;
		padding: 32rpx;
		font-size: 30upx;
		width: 100%;
	}

	.title_1 {
		font-size: 28rpx;
		width: 74%;
		// font-weight: bold;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.title_1_1 {
		background-color: #f0eeee;
		padding: 14rpx 24rpx;
		font-size: 28rpx;
		color: #1B1B1B;
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
		font-size: 30upx;
	}

	.tui-line-cell_2_1 {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.popss_1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100rpx;
		line-height: 40rpx;
		background-color: #f1f5fd;
		color: #5c93ff;
		padding: 30rpx;
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

	.empty {
		width: 100%;
		height: 67vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
	}

	.none_img {
		margin-top: -150rpx;
		margin-left: -40rpx;
		margin-bottom: 50rpx;
		width: 300rpx;
		height: 260rpx;
	}

	.empty-tips {
		display: flex;
		font-size: 26rpx;
		color: #C0C4CC;
	}

	// 弹框
	.cover {
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


	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 90%;
		background-color: #ffffff;
		// background: linear-gradient(to bottom, #e1ebfe 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 25%;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9999;
	}

	.wxshare_y {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #FAFAFA;
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_sx {
		text-align: center;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0%;
		left: 0%;
		z-index: 9999;
	}

	.wxshare_1 {
		text-align: center;
		margin-top: 50rpx;
	}

	.wxshare_1 image {
		width: 100rpx;
		height: 100rpx;
	}

	.wxshare_2 {
		margin-top: 150rpx;
		margin-bottom: 20rpx;
		font-size: 32rpx;
	}

	.wxshare_2_y {
		margin: 40rpx;
		font-size: 32rpx;
		text-align: left;
	}

	.wxshare_2_1 {
		margin-top: 50rpx;
		margin-bottom: 36rpx;
		font-size: 34rpx;
	}

	.wxshare_2_1_1 {
		margin-bottom: 30rpx;
		font-size: 32rpx;
	}


	.wxshare_3 {
		font-size: 52rpx;
		font-weight: bold;
		margin-bottom: 50rpx;
	}

	.wxshare_3_y {
		font-size: 36rpx;
		margin: 50rpx 30rpx 30rpx 30rpx;
	}

	.wxshare_3_1 {
		font-size: 32rpx;
		margin-bottom: 100rpx;
		margin-top: 100rpx;
	}

	.wxshare_3_tui {
		font-size: 32rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
	}

	.wxshare_3_cui {
		font-size: 32rpx;
		background-color: #5C93FF;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 20rpx 20rpx 0 0;
		color: #ffffff;
	}

	.wxshare_4 {
		color: #ABABAB;
		margin-bottom: 50rpx;
		margin-top: 20rpx;
		font-size: 22rpx;
	}

	.add_box3 {
		width: 40%;
		height: 70rpx;
		background-color: #5C93FF;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 5%;
		color: #fff;
		font-size: 30rpx;
	}

	.add_box3_y {
		width: 40%;
		height: 70rpx;
		background-color: #5C93FF;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-top: 50rpx;
		margin-left: 30%;
		margin-bottom: 80rpx;
		color: #fff;
		font-size: 30rpx;
	}

	.add_box3_1 {
		width: 40%;
		height: 70rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 8%;
		color: #888888;
		font-size: 30rpx;
	}

	.add_box3_a {
		width: 50%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #000000;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 20rpx 0;
		font-size: 30rpx;
	}

	.add_box3_cui {
		width: 25%;
		margin-left: 35%;
		margin-bottom: 24rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #ffffff;
		background-color: #5C93FF;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.add_box3_tui {
		width: 25%;
		margin-left: 12%;
		margin-bottom: 50rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #ffffff;
		background-color: #5C93FF;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.add_box3_tui_1 {
		width: 25%;
		margin-left: 15%;
		margin-bottom: 50rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #999999;
		border: 2rpx solid #e5e5e5;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.add_box3_1_a {
		width: 50%;
		height: 90rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 0 20rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 30rpx;
	}

	.add_box3_a_sx {
		width: 45%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		color: #ffffff;
		background-color: #5C93FF;
		border-radius: 20rpx;
		font-size: 34rpx;
	}

	.add_box3_1_a_sx {
		width: 45%;
		height: 80rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #888888;
		font-size: 34rpx;
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

	.notopen_1 {
		width: 25%;
		background-color: #5C93FF;
		border-radius: 10rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.notopen_2 {
		width: 25%;
		background-color: #5c93ff;
		border-radius: 10rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}

	.notopen_3 {
		width: 25%;
		border: 2rpx solid #5c93ff;
		border-radius: 10rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		margin-left: 36%;
		color: #5c93ff;
		font-size: 28rpx;
	}

	.urltitle {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 36rpx;
		color: #333333;
		line-height: 36rpx;
		text-shadow: 0px 0px 16px rgba(25, 25, 25, 0.2);
		text-align: center;
		font-style: normal;
		margin-bottom: 32rpx;
	}

	.urllist {
		background: #F6F6F6;
		border-radius: 12rpx;
		padding: 20rpx 16rpx;
		text-align: left;
	}

	.item-url {
		font-size: 28rpx;
		line-height: 1.6;
	}

	.urlred {
		color: #FF2500;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		height: 40rpx;
		max-width: 480rpx;
	}

	.copy {
		line-height: 40rpx;
		border-radius: 8rpx;
		border: 1rpx solid #1B1B1B;
		font-size: 24rpx;
		padding: 0rpx 24rpx;
	}

	.urll {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.logList {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}
	
	.listItem {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 16rpx;
		font-size: 28rpx;
		flex-direction: column;
	
	}
	
	.list-items {
		border: 2rpx solid #f5f5f5;
	}
	
	.itemHead {
		width: 100%;
		height: 60rpx;
		background: #f5f5f5;
		padding: 8rpx 24rpx;
		font-size: 28rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.itemBody {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		margin-bottom: 12rpx;
	}
	
	.itemBody .left {
		width: 140rpx;
	}
	
	.itemBody:last-child {
		margin-bottom: 0rpx;
	}
	
	/* 按钮 */
	
	.hei52 {
		width: 164rpx;
		height: 52rpx;
		line-height: 50rpx;
		border-radius: 12rpx;
		border: 1rpx solid #C0C0C0;
		text-align: center;
	}
	
	.hei52blue {
		height: 52rpx;
		line-height: 50rpx;
		padding: 16rpx 20rpx;
		border-radius: 12rpx;
		background: #F1F6FF;
		text-align: center;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #5C93FF;
		margin-right: 32rpx;
	}
	
	/* 弹窗 */
	.btnCancel {
		/* width: 256rpx; */
		/* width: 240rpx; */
		flex: 1%;
		height: 80rpx;
		line-height: 80rpx;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 13rpx;
		border: 1rpx solid #999999;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 36rpx;
		color: #999999;
		line-height: 50rpx;
		letter-spacing: 1px;
		text-align: center;
		font-style: normal;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 16rpx 0 14rpx;
	}
	
	.btnYes {
		/* width: 256rpx; */
		flex: 1%;
		height: 80rpx;
		line-height: 80rpx;
		background: #5C93FF;
		border-radius: 13rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 50rpx;
		text-align: center;
		font-style: normal;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 16rpx 0 14rpx;
	}
	.pa24 {
		padding: 8rpx 24rpx;
	}
</style>