<template>
	<view class="container goodslist">
		<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<!-- <view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view> -->
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<!-- 这里是状态栏 -->
			<!-- <view class="status_bar" style="height: 45px;"></view> -->
			<!-- #endif -->
			<view class="chat_1" :style="{ height: gaodu + 'px' }">
				<view @click="navigateBack">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png"
						style="width: 30rpx;height: 30rpx;margin-top: 20rpx;">
					</image>
				</view>

				<view class="selectBox">
					<view class="top-title" >举报中心</view>

				</view>

				<!-- 分享  -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="icon_wrap" >
					<!-- <image class="title_ico" src="/pagesC/static/top_right_share@2x.png" mode="heightFix"></image> -->
				</view>
				<!-- #endif -->
			</view>
		</view>


		<!-- 内容区域 -->
		<view class="report-container">
			<!-- 举报列表 -->
			<view class="report-list" @click="handelList">
				<view class="report-left">
					<image class="img-red-envelope" src="https://images.eqingqu.com/attachs/photo/202509/20250927_CB464B72FD2E58212242E94124A624DA.png"></image>
					<view class="report-text">
						<text>我的举报记录</text>
						<text>查看举报进度与结果</text>
					</view>
				</view>
			<view class="report-right" >
				<text class="iconfont icon-more size_24 skeleton-radius"></text>
			</view>
			</view>
			<!-- 举报项 -->
			<view class="report-list-two">
			  <view 
			    class="report-item" 
			    v-for="(item, index) in reportItems" 
			    :key="index" 
			    @click="handleReportClick(item.id)"
			  >
			  <view class="report-left">
			    <!-- 左侧图标 -->
			    <image class="report-item-icon" :src="item.imgUrl"></image>
			    <!-- 文案区域 -->
			    <view class="report-text">
			      <text >{{ item.topText }}</text>
			      <text >{{ item.bottomText }}</text>
			    </view>
			 </view>	
			    <!-- 右侧箭头（可选，需自行准备箭头图片） -->
			  	<text class="iconfont icon-more size_24 skeleton-radius"></text>
			  </view>
			</view>
		</view>

	</view>
</template>


<script>
	import {
		mapState
	} from 'vuex'

	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import universal from '@/common/mixins/universal.js';




	export default {
		mixins: [universal],
		components: {
			uniNavBar,
			uniIcons,

		},
		data() {
			return {
				report_id:'',
				goodsId: '',
				gaodu: '',
				loading: true,
				reportItems: [],
			};
		},

		computed: {

		},

		methods: {
			handelList() {
				console.log(1)
				uni.navigateTo({
					url: '/pagesC/report/reportList'
				})
			},
		  handleReportClick(id) {
			  console.log('点击了举报项，ID为：', id);
			  this.report_id = id
			 uni.navigateTo({
			 	url: '/pagesC/report/reportItem?id='+this.goodsId+'&report_id='+this.report_id
			 })
			},

			getList(id, page) {
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/getreport_type',
					method: 'POST',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							this.reportItems = res.data.data
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},



			navigateBack() {
				uni.navigateBack()
			},

		},
		onLoad(e) {
		console.log('这是列表从商品列表传过来的参数，是否有Id',e)
		this.goodsId= e.id ;
		this.getList()
		},


		onReady() {
			var that = this
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
		watch: {


		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F6F6F6 !important;
		min-height: 100vh;
		padding-top: 60rpx;
		/* 确保容器至少占满屏幕高度 */
		padding-bottom: 40rpx;
		/* 添加底部内边距 */
	}
	/*popop*/



	.main-title {
		height: 340rpx;
		background-image: url('https://images.eqingqu.com/attachs/photo/202509/20250927_3522088A467AC08F456AA8CEC8B03725.jpg');
		padding-top: 40rpx;
		background-repeat: round;
	}

	.chat_1 {
		margin-bottom: 12rpx;
		margin-right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// opacity: 0.7;
		max-height: 70rpx;
		/* #ifndef MP-WEIXIN */
		// width: 92%;
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;

		/* #endif */
		/* #ifdef MP-WEIXIN */
		// width: 75%;
		width: 65%;

		padding: 0rpx 20rpx 0rpx 30rpx;
		/* #endif */

	}

	.selectBox {
		// width: 690rpx;
		/* #ifdef MP-WEIXIN */
		margin-left: 160rpx;
		/* #endif */
		// background-color: #fff;
		border-radius: 50rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		// margin-right: 60rpx;
		.right-icon {
			/*#ifdef MP*/
			padding-top: 6rpx;
			/*#endif*/
		}

		.iconfont {
			/*#ifdef MP*/
			padding-top: 4rpx;
			/*#endif*/
		}

		.top-title {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 40rpx;
			color: #1B1B1B;
			line-height: 44rpx;
			text-align: left;
			font-style: normal;
		}
	}

	.selectBox input {
		width: 80%;
		line-height: 78rpx;
		padding: 0 20rpx 0 26rpx;
		/* #ifdef MP */
		padding: 0 10rpx 0 20rpx;
		/*#endif*/
		height: 78rpx;
		font-size: 32rpx;

	}



	.icon_wrap {
		background: #272727;
		opacity: 0.35;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;

		.title_ico {
			width: 32rpx;
			height: 32rpx;
			margin: 5px;
		}
	}
	
	
	
	// 内容区域
	.report-container {
		margin: 16rpx;
		.report-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			padding: 8px 16rpx;
			border-radius: 8px;
			margin: 26rpx 0;
		}
	}
	.report-left {
		display: flex;
		image {
			width: 80rpx;
			min-width: 80rpx;
			height: 80rpx;
			margin: 0 16rpx;
		}
		.report-text {
			display: flex;
			flex-direction: column;
		}
		
		.report-text > text:first-child {
		  font-size: 32rpx;
		  color: #1B1B1B;
		  font-weight: 500;
		}
		
		
		.report-text > text:nth-child(2) {
		  font-size: 24rpx;
		  color: #CCC; 
		  font-weight: 400;
		}
	}
	
	
	.report-list-two {
	 
	}
	
	.report-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  background-color: #FFFFFF;
	  padding: 8px 16rpx;
	  border-radius: 8px;
	  margin: 10rpx 0;
	  border-bottom: 1rpx solid #f5f5f5;
	}
	
	.report-item-icon {
	  width: 48rpx;
	  height: 48rpx;
	  margin-right: 20rpx;
	  border-radius: 8rpx;
	}
	
	.report-item-text {
	  flex: 1;
	}
	
	.report-top {
	  font-size: 32rpx;
	  color: #1B1B1B;
	  font-weight: 500;
	}
	
	.report-bottom {
	  font-size: 28rpx;
	  color: #999;
	  margin-top: 4rpx;
	}
	
	.report-arrow {
	  width: 24rpx;
	  height: 24rpx;
	}
	
</style>