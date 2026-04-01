<template>
	<view class="container goodslist">
		<view class="main-title" >
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

				<view style="margin-left: 16rpx;" class="selectBox">
					<view style="align-items: center;display: flex;flex-direction: row;margin-left: 16rpx;">
						<!-- #ifdef H5 -->
					<uni-icons type="search" size="22" color="#666666" class="right-icon "
						></uni-icons>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
					<uni-icons type="search" size="22" color="#666666" class="right-icon "
						></uni-icons>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<uni-icons type="search" size="22" color="#666666" class="right-icon "
							></uni-icons>
						<!-- #endif -->
						<input confirm-type="search" @keyup.enter="handleSearch($event)" @input="searchFocus($event,1)"
							@confirm="handleSearch($event)" class="input" type="search" :placeholder="placeholder" />
					</view>
					

				</view>
				<!-- 分享  -->
				<view class="icon_wrap"
					@click="mpShare">
					<image class="title_ico" 
						src="/pagesC/static/top_right_share@2x.png" mode="heightFix"></image>
				</view>
			</view>
			

		
		</view>
		<view class="img-label" v-if="imageObject.ad_code">
			<image  :src="imageObject.ad_code"></image>
		</view>
		<!-- <view class="clear-Both"></view> -->
		
		<!-- 没有活动图的占位 -->
		<view class="zhanewi " v-if="!imageObject.ad_code" style="margin-top: 240rpx;"></view>	
		
		
		<x-skeleton :configs="configs" :loading="loading1">
	
		<view class="product-list-lie" v-if="!dscLoading">
			<view class="list-title">
				<image src="/pagesC/static/wavy2x.png"></image>
				<text> {{imgData.activity_title ? imgData.activity_title:'活动商品'}}</text>
				<image class="img2" src="/pagesC/static/wavy2x.png"></image>
			</view>
			<dsc-product-list :type="searchType" :list="waterFallList" :allList="cateGoodsList" :mode="mode"
				v-if="waterFallList"></dsc-product-list>
			<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
		</view>
		
		</x-skeleton>

		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

		<dsc-common-nav></dsc-common-nav>

		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import dscProductList from '@/components/dsc-product-list.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	export default {
		mixins: [universal],
		components: {
			uniNavBar,
			uniIcons,
			dscProductList,
			dscCommonNav,
			dscFilterTop,
			uniLoadMore,
		},
		data() {
			return {
				configs:{
					padding: '30rpx',
					gridRows: 2,
					gridColumns: 2,
					gridRowsGap: '40rpx',
					gridColumnsGap: '24rpx',
					itemDirection: 'column',
					itemGap: '16rpx',
					itemAlign: 'center',
					headShow: true,
					headWidth: '350rpx',
					headHeight: '350rpx',
					headBorderRadius: '12rpx',
					textShow: true,
					textRows: 5,
					textRowsGap: '12rpx',
					textWidth: ['100%','80%','60%', '70%', '100%'],
					textHeight: ['60rpx', '20rpx','30rpx', '20rpx', '20rpx'],
					textBorderRadius: '6rpx',
				},
				loading1:true,
				imgData:[],
				searchKeywords:false,
				imageObject:{},   // 顶部图片对象   
				waterFallList: [],
				searchType: 'click',
				queryObj: '',
				loading: true,
				mode: 'grid',
				searchKeywordsText:'',
				isFilter: true,
				page: 1,
				size: 10,
				cou_id: 0,
				placeholder: this.$t('lang.active_search_keyword'),
				dscLoading: true,
				scrollState: false,

				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				cateGoodsList: [],
				gaodu: '',
				menuButtonInfo: {},
				inputValue: '',
				goodQuerysId:1
			
			};
		},
		
		computed: {
			// ...mapState({  点击其中一项时设置selected设为true 同时其他的设false
			// 	cateGoodsList: state => state.category.cateGoodsList
			// }),
		
		},
		  onShareAppMessage() {
			var that  = this;
		    return {
		      title: that.imgData.share_title,       // 分享标题
		      path: `${that.websiteUrl}/mobile/pagesD/activePage/activePage?id=${that.goodQuerysId}`, 
		      imageUrl: that.waterFallList[0].goods_img,  // 分享图片
		    }
		  },
		  onShareTimeline() {
		      return {
		        title: that.imgData.share_title,
		        query: 'id=' + `${that.goodQuerysId}`,  // 自定义页面路径中携带的参数
		        imageUrl:  that.waterFallList[0].goods_img,
		      }
		    },
		methods: {
			
			// list 数据 /
			getGoodsList(page, num, type) {
				if (num) {
					uni.showLoading({
						title: '加载中'
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				console.log(this.searchKeywords)
				
				// this.loadMoreStatus = "loading"
				this.showLoadMore = true
					uni.request({
						url: this.websiteUrl + '/api/app_activity_goods_list/goods_list',
						method: 'GET',
						data: {
							page:this.page,
							id: this.goodQuerysId,
							keyword:this.searchKeywords?this.searchKeywordsText:'',
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							console.log(res.data)
							this.searchKeywords =false;
							this.loading1=false;
							if(	this.searchType  == 'click') {
								uni.pageScrollTo({
								       scrollTop: 0,
								       duration: 0 // 0 表示立即滚动
								     })
							}
								if (num) {
									uni.hideLoading()
								}
								if (res.data.status == 'success') {
									if (res.data.data.length < 10) {
										this.loadMoreStatus = 'noMore'
									}
									if (this.page == 1) {
										this.cateGoodsList = res.data.data
										this.waterFallList = res.data.data
									} else {
										this.cateGoodsList = this.cateGoodsList.concat(res.data.data)
										this.waterFallList = res.data.data
									}

								}
							

						},
						fail: (err) => {
							console.error(err)
						}
					})
				
			},
			// 分享
			appShare() {
				
				var that = this
				console.log('https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg')
				// #ifdef H5
				let shareInfo = {
					code_url: `${that.websiteUrl}/mobile/pagesD/activePage/activePage?id=${that.goodQuerysId}`,
					href: that.websiteUrl + '/mobile/pagesD/activePage/activePage?id=' + that.goodQuerysId,
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.imgData.share_title,
					summary: 0,
					imageUrl: that.waterFallList[0].goods_img
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'
					
					
				};
				// #endif
				// #ifdef APP-PLUS
				let shareInfo = {
					href: that.websiteUrl + '/mobile/pagesD/activePage/activePage?id=' + that.goodQuerysId,
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.imgData.share_title,
					summary: 0,
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'
					imageUrl: that.waterFallList[0].goods_img
				};
				// #endif
				console.log('shareInfo', shareInfo)
				that.shareInfo(shareInfo, );
			},
		mpShare() {
			this.onGoodsShare();
		},
		onGoodsShare() {
			var that = this
			if (that.$isLogin()) {
				uni.showLoading({
					title: that.$t('lang.loading')
				});
				// #ifdef MP-WEIXIN
				that.shareImgShow = true;
				// #endif
						
				// #ifdef APP-PLUS
				that.appShare();
				// #endif
				// #ifdef H5
				that.shareImgShow_1 = true
				// #endif
				uni.hideLoading();
			} else {
				uni.showModal({
					content: that.$t('lang.login_user_not'),
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pagesB/login/login?delta=1'
							});
						}
					}
				});
			}
		
			// #ifdef APP-PLUS
			that.sharePoster = false;
			// #endif
		},
		
	
		// 获取顶部活动图
			getImage() {
				uni.request({
					url: this.websiteUrl + '/api/app_activity_goods_list/get_actvity_img',
					method: 'GET',
					data: {
						id: this.goodQuerysId,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						this.imageObject = res.data.data.list;
						this.imgData = res.data.data;
						console.log(this.imageObject)
					}
				})
			},

			
		
			handleSearch(event, ) {
				// if(event.detail.value.length > 0 ) {
						this.searchKeywords = true;
						this.searchKeywordsText = event.detail.value
				// }
			
				this.searchType = 'click';
				let value = event.detail.value;
				// #ifdef MP-WEIXIN
				value = value.replace(/[\u3000]/g, ''); //
				// #endif
				this.inputValue = value.replace(/\s+/g, '');

				this.getGoodsList(1, 1, );
			},
			searchFocus(event, num, ) {
				// if (num == 0) {
				// 	this.searchType = 'click';
				// 	this.getGoodsList(1, 1, );
				// } else {
					// this.searchType= false;
					// 条件编译处理不同平台
					let value = event.detail.value;
					// 微信小程序特殊处理
					// #ifdef MP-WEIXIN
					value = value.replace(/[\u3000]/g, ''); // 过滤全角空格
					// #endif
					// 通用处理
					this.inputValue = value.replace(/\s+/g, '');
					console.log('触发搜索，关键词：', this.inputValue)
				// }
			},
		
		
		
			navigateBack() {
				uni.navigateBack()
			},
		
		},
		onLoad(e) {

			this.queryObj = e;
			
			this.cou_id = e.cou_id;
			if (this.queryObj.id) {
				this.goodQuerysId =this.queryObj.id
			}
			this.getGoodsList(1);
			this.getImage();
		},
		onPageScroll(e) {
			var that = this

			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.product-list-lie').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {

					if (that.page * that.size == that.cateGoodsList.length) {
						that.loadMoreStatus = 'loading';
						console.log("这里")
						that.page++
						this.searchType = 'scroll'
						this.searchKeywords = true;
						that.getGoodsList()
					}
				}
			}).exec()
		},
		onReachBottom() {
			var that = this
			console.log("111")
			console.log(that.page * that.size)
			console.log(that.cateGoodsList.length)
			console.log(that.page * that.size == that.cateGoodsList.length)
			if (that.page * that.size == that.cateGoodsList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				this.searchType = 'scroll'
				this.searchKeywords = true;
				that.getGoodsList()
			} else {
				that.loadMoreStatus = "noMore"
			}
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
			cateGoodsList() {
				this.dscLoading = false
				// if(this.page * this.size != this.cateGoodsList.length){
				// 	this.loadMoreStatus = "noMore"
				// }
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	/*header*/
	.header .uni-navbar {
		border-bottom: solid 1px #e6e6e6;
	}

	.header .uni-navbar view {
		line-height: 50px;
	}

	.header .uni-navbar-header {
		height: 50px;
	}

	.header .uni-navbar-header .uni-navbar-header-btns {
		padding: 0;
	}

	.header .uni-navbar-container {
		margin: 0 20upx;
	}

	.header .uni-navbar .input-view {
		background-color: #FFFFFF;
		border: 1px solid #e6e6e6;
		margin: 9px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	/*popop*/
	.con-filter-view {
		padding-bottom: 50px;
	}

	.mod_list {
		background: #ffffff;
		margin-bottom: 20upx;
	}

	.mod_list .item .li_line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
	}

	.mod_list .item.radio-switching {
		padding: 20upx;
	}

	.mod_list .item.radio-switching .li_line {
		padding: 0;
	}

	.tags_selection {
		background: #FFFFFF;
		margin-bottom: 20upx;
		padding: 20upx 0 0 20upx;
		display: flex;
		flex-direction: row;
	}

	.tags_selection text {
		padding: 5upx 30upx;
		background: #f7f7f7;
		border-radius: 10upx;
		margin: 0 20upx 20upx 0;
		border: 1px solid #f7f7f7;
	}

	.tags_selection .active {
		background: #FFFFFF;
		border: 1px solid #e93b3d;
		color: #e93b3d;
	}

	.nav-new-scroll .active {
		background: #FFEDED;
		color: #FE2F02;
	}

	.Amount-body .active {
		background: #faeeec !important;
		border: 1px solid #e93b3d !important;
		color: #e93b3d !important;
	}

	.filterlayer_price {
		padding: 20upx;
		position: relative;
	}

	.filterlayer_price:before {
		content: "";
		position: absolute;
		z-index: 1;
		pointer-events: none;
		background-color: #e5e5e5;
		height: 1px;
		left: 0;
		right: 0;
		top: 0;
	}

	.filterlayer_price .filterlayer_price_area {
		display: flex;
	}

	.filterlayer_price_area_input {
		flex: 1;
		background: #f7f7f7;
		color: #333333;
		padding: 10upx;
		text-align: center;
	}

	.filterlayer_price_hang {
		width: 50upx;
		position: relative;
	}

	.filterlayer_price_hang:before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -5px;
		width: 10px;
		height: 1px;
		background-color: #f1f1f1;
	}

	.filterlayer_bottom_buttons {
		display: flex;
		flex-direction: row;
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		z-index: 9;
	}

	.filterlayer_bottom_button {
		height: 49px;
		line-height: 49px;
		flex: 1;
		text-align: center;
		box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.07);
	}

	.filterlayer_bottom_button.active {
		background-color: #e93b3d;
		color: #ffffff;
	}

	.sf_layer {
		background: #FFFFFF;
		height: 100%;
	}

	.sf_layer .sf_layer_sub_title {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20upx;
		background-color: #FFFFFF;
	}

	.sf_layer .sf_layer_sub_title .tit {
		width: 150upx;
	}

	.sf_layer .sf_layer_sub_title text {
		flex: 1 1 0%;
	}

	.center-box {
		width: 100%;
		background: #FFFFFF;
	}


	.main-title {
		position: fixed;
		top: 100rpx;
		left: 0;
		width: 100%;
		z-index: 120;
	
	}
	.img-label {
			// position: fixed;
			// top: 0;
			// left: 0;
			z-index: -2;
			width: 100%;
			
			image {
				width: 100%;
				height: 560rpx;
				min-height: 520rpx;
				z-index: -2;
			}
		}
		.product-list-lie {
			margin-top: -40rpx;
			.list-title {
				width: 100%;
				height: 80rpx;
				background: #F5F5F5;
				border-radius: 28rpx 28rpx 0rpx 0rpx;
				z-index: 3;
				display: flex;
				justify-content: center;
				align-items: center;
				.img2 {
					transform: rotate(180deg);
				}
				image {
					width: 43rpx;
					height: 28rpx;
					margin-top: 5rpx;
				}
				text {
					display: flex;
					justify-content: center;
					// width: 100%;
					height: 80rpx;
					background: #F5F5F5;
					border-radius: 28rpx 28rpx 0rpx 0rpx;
					z-index: 3;
					font-weight: 600;
					font-size: 40rpx;
					color: #272727;
					align-items: center;
					padding: 0 20rpx;
				
				}
			}
		}
	.status_bar {
		background-color: #f9f9f9;
		height: var(--status-bar-height);
		width: 100%;
	}

	.chat_1 {
		margin-bottom: 12rpx;
		margin-right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		opacity: 0.7;
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
		
		width: 100%;
		margin: 0rpx 20rpx 0;
		background-color: #fff;
		border-radius: 50rpx;
		text-align: left;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-right: 60rpx;
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
	.nav-body {
		width: 100%;
		display: flex;
		justify-content: start;
		padding-bottom: 10rpx;
		// padding-top: 10rpx;
		background-color: #fff;
	}

	.nav-new {
		width: 100%;
		height: 54rpx;
		overflow-x: scroll;
	}

	.filter-right {
		width: 13%;
		height: 50rpx;
		margin-left: 2%;
		/*#ifdef APP-PLUS*/
		margin-top: -8rpx;
		/*#endif*/
	}

	.nav-new-scroll {
		// width: 2360rpx;
		// /* #ifdef MP */
		// width: 2080rpx;
		// /*#endif*/
		// /*#ifdef APP-PLUS*/
		// width: 2280rpx;
		// /*#endif*/
		// height: 50rpx;
		// display: flex;
		// flex-wrap: wrap;


		width: 1450rpx;
		/* #ifdef MP */
		width: 1450rpx;
		/*#endif*/
		/*#ifdef APP-PLUS*/
		width: 1450rpx;
		/*#endif*/
		height: 50rpx;
		display: flex;
	}

	.nav-label {
		min-width: fit-content;
		padding: 1rpx 20rpx;
		text-align: center;
		display: flex;
		align-items: center;
		background: #EDEDED;
		color: #1a1a1a;
		margin: 2rpx 8rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin-right: 16rpx;

	}

	.nav-new-scroll :first-child {
		margin-left: 20rpx;
	}

	::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	// .clear-Both {
	// 	margin-top: 520rpx;
	// 	/*#ifdef APP-PLUS*/
	// 	margin-top: 540rpx;
	// 	/*#endif*/
	// }

	.show-popup-filter {
		background: #fff;
		height: 100%;

		.popup-title {
			// background: yellowgreen;
			height: var(--status-bar-height);
			width: 100%;
		}

		.top {
			height: calc(100% - 120rpx);
		}

		.section {
			padding: 20px 0 0 20px;
			background: #fff;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					overflow-wrap: break-word;
					font-weight: normal;
					text-align: center;
					white-space: nowrap;
					color: #272727;
					font-size: 16px;
					line-height: 16px;
				}

				.right-icon {
					.iconfont {
						font-size: 14px;
						margin-right: 5px;
					}
				}
			}

			.section-warp {
				margin-top: 15px;

				&.price-filter {
					padding-right: 20px;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.input {
						width: 45%;
						background: #f2f2f2;
						border-radius: 4px;
						height: 35px;
						text-align: center;

						input {
							width: 100%;
							background: transparent;
							height: 100%;
							text-align: center;
							font-size: 14px;
							line-height: 14px;
							
						}
					}

					.hang {
						margin: 0 10px;
						height: 1px;
						background: #000;
						width: 10px;
					}
				}

				&.Amount-body {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.Amount-body {
						display: flex;
						flex-direction: row;
						align-items: center;
						flex-wrap: wrap;
					}

					.AmountRange {
						width: 32%;
						background: #f2f2f2;
						border-radius: 20px;
						height: 40px;
						text-align: center;
						border: 1px solid #f2f2f2;
					}

					.AmountRangeTop {
						font-size: 26rpx;
						/*#ifdef APP-PLUS*/
						margin-top: 10rpx;
						/*#endif*/
						/*#ifdef MP*/
						margin-top: 4rpx;
						/*#endif*/
					}

					.AmountRangeBottom {
						font-size: 18rpx;
						// color: #9c9c9c;
				
						/* #ifdef H5 */
						margin-top: -6rpx;
						/*#endif*/
						/*#ifdef MP*/
						margin-top: -12rpx;
						/*#endif*/
						/*#ifdef APP-PLUS*/
						margin-top: -8rpx;
						/*#endif*/
					}
				}

				&.select-tabs {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;

					.select-list {
						width: calc(33.3% - 20px);
						box-sizing: border-box;
						margin: 0 18px 14px 0;
						padding: 0;

						text,
						rich-text {
							padding: 2px 0;
							background: #EDEDED;
							text-align: center;
							display: block;
							border-radius: 4px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							border: 1px solid transparent;
						}

						&:nth-child(3n) {
							margin-right: 0;
						}

						&.active {

							text,
							rich-text {
								border-color: #FE2F02;
								color: #FE2F02;
								background-color: #FFEDED;
							}
						}
					}
				}

				&.hide {
					display: none;
				}
			}

			.class-resule-style {
				padding: 20px 20px 0 0;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				text-align: center;
				font-size: 14px;
			}
		}

		.footer {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: #fff;

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 16px;
					vertical-align: middle;

					&.btn-red {
						color: #FFFFFF;
					}

					.btn-text {
						position: relative;
						top: -5px;
					}
				}
			}
		}
	}
</style>