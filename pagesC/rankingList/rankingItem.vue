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
					<view class="top-title">热卖排行榜</view>

				</view>

				<!-- 分享  -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="icon_wrap" @click="mpShare">
					<image class="title_ico" src="/pagesC/static/top_right_share@2x.png" mode="heightFix"></image>
				</view>
				<!-- #endif -->
			</view>

			<view class="top-content">
				<view class="top-content-top">{{allData.title}}</view>
				<view class="top-content-bottom">根据<text v-if="this.timeId == 4">周</text><text
						v-else-if="this.timeId == 2">月</text><text v-else-if="this.timeId == 3">年</text><text
						v-else>日</text>采购，每日更新</view>
			</view>

		</view>
		<!-- <view class="img-label" >
			<image  :src="imageObject.ad_code"></image>
		</view> -->


		<!-- 没有活动图的占位 -->
		<!-- <view class="zhanewi " v-if="!imageObject.ad_code" style="margin-top: 240rpx;"></view>	 -->



		<view class="product-list-lie" v-if="!dscLoading">
			<!-- 列表区域 -->
			<view class="umbrella-list">
				<view v-for="(item, index) in cateGoodsList" :key="index" class="umbrella-item"
					@click="detailLink(item.seckill_id,item.goods_id)">
					<!-- 左侧 TOP 标识和图片区域 -->
					<view class="item-left">
						<view class="top-tag">
							<image :src="getTagBgImage(index)" class="tag-bg"></image>
							<view class="tag-content">
								<text v-if="index<3" class="top">TOP</text>
								<text class="number" v-if="index+1 <10">0{{ index + 1 }}</text>
								<text v-else class="number">{{ index + 1 }}</text>
							</view>
						</view>
						<image :src="item.goods_thumb" alt="umbrella" class="umbrella-img"></image>
					</view>
					<!-- 右侧信息区域 -->
					<view class="item-right">
						<text class="title">{{ item.goods_name }}</text>
						<view class="stats">
							<text class="people-tag">
								{{ item.sales_volume }}人已购
							</text>

							<!-- <text class="evaluate" v-if="item.evaluate">
		            {{ item.evaluate }}
		          </text> -->
						</view>
						<view class="label-box" v-if="shouldShowLabels(item)">
							<view v-for="(tag, tagIndex) in getSortedLabels(item)" :key="tagIndex"
								class="label-box-line">
								<view v-if="tag.value === 0 && tag.name === '包邮'" class="zero-label">{{tag.name}}</view>
								<view v-else-if="tag.value === 0 && tag.name === '一件包邮'" class="zero-tag">{{tag.name}}
								</view>
								<view v-else-if="tag.value === 1" class="first-label">{{tag.name}}</view>
								<view v-else-if="tag.value === 5" class="second-label">{{tag.name}}</view>
								<view v-else-if="tag.value === 2 && (tag.name === '先用后付'|| tag.name === '先卖后付')"
									class="second-label">{{tag.name}}</view>
								<view v-else-if="tag.value === 2 && tag.name === '24小时发货'" class="second-label">
									{{tag.name}}</view>
								<view v-else-if="tag.value === 3" class="second-label">{{tag.name}}</view>
								<view v-else-if="tag.value === 4" class="second-label">{{tag.name}}</view>
							</view>
						</view>
						<currency-price class="price" :price="item.shop_price" :size="20"></currency-price>
						<!-- <text class="price">¥{{ item.cost_price }}</text> -->
					</view>
				</view>
			</view>

			<uni-load-more :status="loadMoreStatus" :content-text="contentText"
				v-if="page > 0 && showLoadMore &&page<5 " />
			<view v-else-if="page > 5" class="more-ranking" @click="moreClick">
				<text>查看更多榜单<text class="iconfont icon-more size_24 "
						style="padding: 0rpx 8rpx;font-weight: bold;line-height: 1;"></text></text>
			</view>
		</view>


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
				wallotDAta: [],
				catId: '',
				imageObject: {}, // 顶部图片对象   
				waterFallList: [],
				searchType: 'click',
				queryObj: '',
				loading: true,
				mode: 'grid',
				searchKeywordsText: '',
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
				goodQuerysId: '',
				timeId: '',
				allData: [],
			};
		},

		computed: {

		},
		onShareAppMessage() {
			var that = this;
			return {
				title: that.imgData.share_title, // 分享标题
				path: `${that.websiteUrl}/mobile/pagesC/rankingList/rankingListIndex?cat_id=${that.catId}`,
				imageUrl: that.cateGoodsList[0].goods_img, // 分享图片
			}
		},
		onShareTimeline() {
			return {
				title: that.imgData.share_title,
				// query: 'id=' + `${that.goodQuerysId}`,  // 自定义页面路径中携带的参数
				imageUrl: that.cateGoodsList[0].goods_img,
			}
		},
		methods: {
			// 获取标签样式
			getTagStyle(index) {
				const imageUrl = this.getTagBgImage(index);
				return {
					backgroundImage: `url('${imageUrl}')`
				};
			},
			detailLink(seckill_id, id) {
				// if (seckill_id != 0) {
				// 	uni.navigateTo({
				// 		url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
				// 			'&tomorrow=0&delta=2'
				// 	});
				// } else {
				// 	uni.navigateTo({
				// 		url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				// 	})
				// }
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			},
			moreClick(id) {
				uni.navigateTo({
					url: '/pagesC/rankingList/rankingListIndex'
				})
			},

			// 标签显示判断
			shouldShowLabels(item) {
				return this.getSortedLabels(item).length > 0
			},
			// 核心处理方法（带参数传递）
			getSortedLabels(item) {
				// 安全获取数据源
				const labelSource = this.safeGetLabels(item)

				return labelSource
					.filter(tag => this.isValidLabel(tag))
					.sort(this.sortLabels)
					.slice(0, 2)
			},
			// 安全获取标签数据
			safeGetLabels(item) {
				// 三级安全校验
				if (!item) return []
				if (!Object.prototype.hasOwnProperty.call(item, 'goods_services_label_new')) return []
				return Array.isArray(item.goods_services_label_new) ?
					item.goods_services_label_new :
					[]
			},
			isValidLabel(tag) {
				if (!tag || typeof tag !== 'object') return false

				// 只要value存在且name存在就返回true
				return typeof tag.value !== 'undefined' && tag.name
			},
			getTagBgImage(index) {
				const colors = [
					'https://images.eqingqu.com/attachs/photo/202507/20250710_280C043ABD2BE467933826F4100CFF61.png',
					'https://images.eqingqu.com/attachs/photo/202507/20250710_5077EC4AB96123C8F4743C1E4AC85C95.png',
					'https://images.eqingqu.com/attachs/photo/202507/20250710_2320B8D153A6FD59260BA9F72A98DDF0.png',
					'https://images.eqingqu.com/attachs/photo/202507/20250710_64C4163B1219D4E115D91B79DB391735.png'
				];
				return colors[index] || colors[3];
			},
			getPeopleTagBgColor(index) {
				// 给已采人数标签不同背景色，可按需调整
				const colors = ['#FF5722', '#FF7F00', '#FFA500', '#FFCC00'];
				return colors[index] || colors[3];
			},
			timeItemClick(id) {
				this.timeActive = id;
				// 对应排行榜的数据
				this.getGoodsList(this.catId)
			},
			// 排行榜list 数据 /
			getGoodsList(id, page) {
				if (this.page > 5) {
					return;
				}

				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				console.log(this.searchKeywords)

				// this.loadMoreStatus = "loading"
				this.showLoadMore = true
				uni.request({
					url: this.websiteUrl + '/api/goods/hot_goodsList',
					method: 'POST',
					data: {
						page: this.page,
						size: 10,
						cat_id: id,
						list_type: this.timeId,
						// keyword:this.searchKeywords?this.searchKeywordsText:'',
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						this.searchKeywords = false;
						if (this.searchType == 'click') {
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 0 // 0 表示立即滚动
							})
						}



						if (res.data.status == 'success') {
							if (res.data.data.list && res.data.data.list[0].goods.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							const rawList = res.data.data.list[0]?.goods || [];

							// 为每个商品添加预计算的样式
							const styledList = rawList.map((item, index) => {
								return {
									...item,
									tagStyle: this.getTagStyle(index)
								};
							});

							if (this.page == 1) {
								this.allData = res.data.data.list[0];
								this.cateGoodsList = styledList;
							} else {
								this.allData = res.data.data.list[0];
								this.cateGoodsList = [...this.cateGoodsList, ...styledList];
							}
							// if (this.page == 1) {

							// 	this.allData = res.data.data.list[0]
							// 	this.cateGoodsList = res.data.data.list[0].goods
							// 	console.log(this.cateGoodsList)

							// } else {
							// 		this.allData = res.data.data.list[0]
							// 	this.cateGoodsList = this.cateGoodsList.concat(res.data.data.list[0].goods)
							// 	console.log(this.cateGoodsList)
							// }

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
				console.log(
					'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'
				)
				// #ifdef H5
				let shareInfo = {
					// code_url: `${that.websiteUrl}/mobile/pagesC/rankingList/rankingItem`,
					href: that.websiteUrl + '/mobile/pagesC/rankingList/rankingItem?cat_id=' + that.catId +
						'&time_active=' + that.timeId,
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.allData.title,
					summary: 0,
					imageUrl: that.cateGoodsList[0].goods_img,
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'


				};
				// #endif
				// #ifdef APP-PLUS

				let shareInfo = {
					href: that.websiteUrl + '/mobile/pagesC/rankingList/rankingItem?cat_id=' + that.catId +
						'&time_active=' + that.timeId,
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: '趣好卖榜单' + that.allData.title,
					summary: 0,
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'
					imageUrl: that.cateGoodsList[0].goods_img,
				};
				// #endif
				console.log('shareInfo', shareInfo)
				// uni.showToast({
				// 	title: '复制成功',
				// 	icon: 'none',
				// 	duration: 2000,
				// })
				that.shareInfo(shareInfo, );
			},
			mpShare() {
				this.onGoodsShare();
			},
			onGoodsShare() {
				var that = this
				if (that.$isLogin()) {
					// uni.showLoading({
					// 	title: that.$t('lang.loading')
					// });
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

				this.getGoodsList(this.timeActive, 1, 1)
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

			this.catId = e.cat_id;
			this.timeId = e.time_active;
			if (this.queryObj.cat_id) {
				this.goodQuerysId = this.queryObj.cat_id
			}
			this.getGoodsList(this.catId)
			// this.getImage();
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
						this.getGoodsList(this.catId)
					}
				}
			}).exec()
		},
		onReachBottom() {
			var that = this
			console.log("111")
			// console.log(that.page * that.size)
			// console.log(that.cateGoodsList[0].goods.length)
			// console.log(that.page * that.size == that.cateGoodsList[0].goods.length)
			if (that.page * that.size == that.cateGoodsList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				this.searchType = 'scroll'
				this.searchKeywords = true;
				this.getGoodsList(this.catId)
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
	.container {
		background-color: #CA0300 !important;
		min-height: 100vh;
		/* 确保容器至少占满屏幕高度 */
		padding-bottom: 40rpx;
		/* 添加底部内边距 */
	}

	/*header*/
	.uni-page-wrapper {
		background-color: #e93b3d !important;
	}

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
		background-image: url('https://images.eqingqu.com/attachs/photo/202507/20250710_344F5DBA0BB73C09353011F82953F8D2.png');
		padding-top: 100rpx;
		background-repeat: round;
	}

	.img-label {
		background-image: url('https://images.eqingqu.com/attachs/photo/202507/20250710_344F5DBA0BB73C09353011F82953F8D2.png');
		// position: fixed;
		// top: 0;
		// left: 0;
		z-index: -2;
		width: 100%;
		// min-height: 410rpx;

		image {
			width: 100%;
			height: 560rpx;
			min-height: 520rpx;
			z-index: -2;
		}
	}

	.product-list-lie {
		background: #CA0300;

		// margin-top: -40rpx;
		.list-title {
			height: 100px;
			// background: #F567;
			border-radius: 28rpx 28rpx 0rpx 0rpx;
			z-index: 3;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.time_item {
				padding: 5px 8px;
				background: #f087;
				border-radius: 8px;
				min-width: 60px;
				display: flex;
				justify-content: center;
				margin-right: 5px;
			}

			.active {
				background: #f967;

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
			color: #FFFFFF;
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

	.top-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.top-content-top {
			font-family: PingFangSC, PingFang SC;
			font-weight: 600;
			font-size: 96rpx;
			color: #FFFFFF;
			line-height: 92rpx;
			text-align: left;
			font-style: normal;
		}

		.top-content-bottom {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 32rpx;
			letter-spacing: 1px;
			text-align: right;
			font-style: normal;
			margin-top: 24rpx;
		}
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

	// 新增
	.umbrella-list {
		padding: 10px;
	}

	.umbrella-item {
		display: flex;
		padding: 10px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
	}

	.item-left {
		position: relative;
		/* 为TOP标签提供定位基准 */
		width: 180rpx;
		min-width: 180rpx;
		margin-right: 20rpx;
	}

	.top-tag {
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: absolute;
		top: -20rpx;
		left: 16rpx;
		z-index: 2;
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
		// padding: 4rpx 12rpx;
		border-radius: 0 8rpx 8rpx 0;
		background-size: 100% 100% !important;

		width: 72rpx;
		height: 76rpx;
		text-align: center;

		.number {
			font-family: FZLTTHJW--GB1, FZLTTHJW--GB1;
			font-weight: bold;
			font-size: 32rpx;
			color: #272727;
			line-height: 32rpx;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
			text-align: justify;
			font-style: normal;
			text-align: center;
		}

		.top {
			font-family: FZLTTHJW--GB1, FZLTTHJW--GB1;
			font-weight: normal;
			font-size: 28rpx;
			text-align: center;
			color: #272727;
			line-height: 28rpx;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
			font-style: normal;
			// margin-top: 2rpx;
		}
	}

	.umbrella-img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 12rpx;
		background: #f8f8f8;
	}

	.item-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.title {
		font-size: 28rpx;
		color: #333;
		line-height: 1.4;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.stats {
		display: flex;
		align-items: center;
		margin: 10rpx 0;
	}

	.people-tag {
		background: #FDDFC3;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #120E0F;
		line-height: 28rpx;
		border-radius: 8rpx;
		text-align: right;
		font-style: normal;
		padding: 8rpx 20rpx;
		border-radius: 4rpx;
		font-size: 22rpx;
	}

	.evaluate {
		color: #666;
		font-size: 22rpx;
		margin-left: 15rpx;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 6px;
	}

	.tag-item {
		background-color: #F5F5F5;
		color: #999;
		padding: 3px 6px;
		border-radius: 4px;
		margin-right: 6px;
		margin-bottom: 4px;
		font-size: 12px;
	}

	.price {
		font-size: 32rpx;
		color: #FE2F02;
		font-weight: bold;
		// margin-top: 10rpx;
	}

	.label-box {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		// margin-bottom: 16rpx;

		.label-box-line {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			// padding-bottom: 5px;
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

	.more-ranking {
		padding-bottom: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.top-tag {
		position: absolute;
		width: 72rpx;
		height: 76rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tag-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.tag-content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		.number {
			font-family: FZLTTHJW--GB1, FZLTTHJW--GB1;
			font-weight: bold;
			font-size: 32rpx;
			color: #272727;
			line-height: 32rpx;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
			text-align: center;
		}

		.top {
			font-family: FZLTTHJW--GB1, FZLTTHJW--GB1;
			font-weight: normal;
			font-size: 28rpx;
			color: #272727;
			line-height: 28rpx;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
		}
	}
</style>