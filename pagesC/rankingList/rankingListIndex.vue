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

				
				<!-- 分享  -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="icon_wrap" @click="mpShare">
					<image class="title_ico" src="/pagesC/static/top_right_share@2x.png" mode="heightFix"></image>
				</view>
				<!-- #endif -->
			</view>



		</view>
		<view class="img-label" v-if="imageObject.ad_code">
			<image :src="imageObject.ad_code"></image>
		</view>
		<!-- <view class="clear-Both"></view> -->

		<!-- 没有活动图的占位 -->
		<view class="zhanewi " v-if="!imageObject.ad_code" style="margin-top: 240rpx;"></view>




		<view class="product-list-lie" v-if="!dscLoading">
			<view class="list-title">
				<view v-for="(item,index) in timeData" :key="index">
					<view class="time_item" :class="timeActive == item.id?'active':''" @click="timeItemClick(item.id)">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="category-container" style="padding: 20rpx;">
				<view v-for="(category, catIndex) in processedCategories" :key="catIndex" class="category-box"
					style="background: #FFFFFF; border-radius: 16rpx; margin-bottom: 24rpx; padding: 24rpx 24rpx 0rpx 24rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);">
					<!-- 分类标题 -->
					<view class="category-header" >
						<text class="category-title"
							style="font-size: 32rpx; font-weight: bold; color: #333;">{{ category.title }}</text>
						<text class="more-btn" style="font-size: 26rpx; color: #999;" @click="moreClick(category.cat_id)">更多<text class="iconfont icon-more size_24 " style="padding: 0rpx 8rpx;font-weight: bold;line-height: 1;"></text></text>
					</view>

					<!-- 修改后的商品布局 -->
					<view class="goods-layout" @click="moreClick(category.cat_id)">
						<!-- 左侧：第二名位置 -->
						<view class="goods-item left-item">
							<template v-if="category.goods.length >= 2">
								<!-- TOP2 标签 -->
								<view class="top-tag top2-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_EAC87CB633B2300651C8B3AE3253F90C.png">
									</image>
								</view>
								<!-- 图片容器 -->
								<view class="goods-img-box">
									<!-- <view class="goods-img" :style="category.goods[1].backgroundStyle"></view> -->
								<image 
								        class="goods-img" 
								        :src="category.goods[1].goods_thumb" 
								        mode="aspectFill"
					
								      />
								</view>
								<view class="buy-number"><text>{{category.goods[1].sales_volume}}人已购</text></view>	
								<text class="goods-name">{{ category.goods[1].goods_name }}</text>
								<view style="display: flex; align-items: center;justify-content: start;  width: 100%;">
									<currency-price class="left-num" :price="category.goods[1].shop_price"
										:size="20"></currency-price>
									<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
										v-if="category.goods[1].is_free == 0 ">
										运费{{category.goods[1].start_shipping_fee}}元
									</view>
								</view>
								<view class="label-box" v-if="shouldShowLabels(category.goods[1])">
								   <view v-for="(tag, tagIndex) in getSortedLabels(category.goods[1])" 
								         :key="tagIndex"
								         class="label-box-line">
								     <view v-if="tag.value === 0 && tag.name === '包邮'" class="zero-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 0 && tag.name === '一件包邮'" class="zero-tag">{{tag.name}}</view>
								     <view v-else-if="tag.value === 1" class="first-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 5" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && (tag.name === '先用后付'|| tag.name === '先卖后付')" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && tag.name === '24小时发货'" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 3" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 4" class="second-label">{{tag.name}}</view>
								   </view>
								 </view>
							</template>
							<!-- 占位符保持不变 -->
							<template v-else>
								<view class="top-tag placeholder-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_EAC87CB633B2300651C8B3AE3253F90C.png">
									</image>
								</view>
								<view class="goods-img placeholder-img"></view>
								<text class="goods-name placeholder-text">虚位以待</text>
								<text class="stats placeholder-text"></text>
								<text class="collect placeholder-text"></text>
							</template>
						</view>

						<!-- 中间：第一名位置 -->
						<view class="goods-item middle-item">
							<template v-if="category.goods.length >= 1">
								<!-- TOP1 标签 -->
								<view class="top-tag top1-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_E7D8CC0792928797E54752BBBA09B1B1.png">
									</image>
								</view>
								<!-- 图片容器 -->
								<view class="goods-img-box">
									<image
									 style="height: 240rpx;"
									        class="goods-img" 
									        :src="category.goods[0].goods_thumb" 
									       
									      />
								</view>
								<view class="buy-number" ><text>{{category.goods[0].sales_volume}}人已购</text></view>
								<text class="goods-name">{{ category.goods[0].goods_name }}</text>
								<view style="display: flex;align-items: center;justify-content: start;   width: 100%;">
									<currency-price class="left-num" :price="category.goods[0].shop_price"
										:size="20"></currency-price>
									<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
										v-if="category.goods[0].is_free == 0 ">
										运费{{category.goods[0].start_shipping_fee}}元
									</view>
								</view>
								<view class="label-box" v-if="shouldShowLabels(category.goods[0])">
								   <view v-for="(tag, tagIndex) in getSortedLabels(category.goods[0])" 
								         :key="tagIndex"
								         class="label-box-line">
								     <view v-if="tag.value === 0 && tag.name === '包邮'" class="zero-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 0 && tag.name === '一件包邮'" class="zero-tag">{{tag.name}}</view>
								     <view v-else-if="tag.value === 1" class="first-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 5" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && (tag.name === '先用后付'|| tag.name === '先卖后付')" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && tag.name === '24小时发货'" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 3" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 4" class="second-label">{{tag.name}}</view>
								   </view>
								 </view>
							</template>
							<!-- 占位符保持不变 -->
							<template v-else>
								<view class=" top-tag placeholder-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_E7D8CC0792928797E54752BBBA09B1B1.png">
									</image>
								</view>
								<view class="goods-img placeholder-img"></view>
								<text class="goods-name placeholder-text">虚位以待</text>
								<text class="stats placeholder-text"></text>
								<text class="collect placeholder-text"></text>
							</template>
						</view>

						<!-- 右侧：第三名位置 -->
						<view class="goods-item right-item">
							<template v-if="category.goods.length >= 3">
								<!-- TOP3 标签 -->
								<view class="top-tag top3-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_F1F5D188152E7DB379D2EA7B30B3825B.png">
									</image>
								</view>
								<!-- 图片容器 -->
								<view class="goods-img-box">
									<image 
									        class="goods-img" 
									        :src="category.goods[2].goods_thumb" 
									        mode="aspectFill"
									       
									      />
								</view>
								<view class="buy-number"><text>{{category.goods[2].sales_volume}}人已购</text></view>
								<text class="goods-name">{{ category.goods[2].goods_name }}</text>
								<view style="display: flex;align-items: center;justify-content: start;  
    width: 100%;">
									<currency-price class="left-num" :price="category.goods[2].shop_price"
										:size="20"></currency-price>
									<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
										v-if="category.goods[2].is_free == 0 ">
										运费{{category.goods[2].start_shipping_fee}}元
									</view>
								</view>
								<view class="label-box" v-if="shouldShowLabels(category.goods[2])">
								   <view v-for="(tag, tagIndex) in getSortedLabels(category.goods[2])" 
								         :key="tagIndex"
								         class="label-box-line">
								     <view v-if="tag.value === 0 && tag.name === '包邮'" class="zero-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 0 && tag.name === '一件包邮'" class="zero-tag">{{tag.name}}</view>
								     <view v-else-if="tag.value === 1" class="first-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 5" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && (tag.name === '先用后付'|| tag.name === '先卖后付')" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 2 && tag.name === '24小时发货'" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 3" class="second-label">{{tag.name}}</view>
								     <view v-else-if="tag.value === 4" class="second-label">{{tag.name}}</view>
								   </view>
								 </view>
							</template>
							<!-- 占位符保持不变 -->
							<template v-else>
								<view class="top-tag placeholder-tag">
									<image
										src="https://images.eqingqu.com/attachs/photo/202507/20250710_F1F5D188152E7DB379D2EA7B30B3825B.png">
									</image>
								</view>
								<view class="goods-img placeholder-img"></view>
								<text class="goods-name placeholder-text">虚位以待</text>
								<text class="stats placeholder-text"></text>
								<text class="collect placeholder-text"></text>
							</template>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :color="'#ffffff'" :status="loadMoreStatus" :content-text="contentText"
				v-if="page > 0 && showLoadMore" />
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
				oldActive: 4,
				// tagBgColor: ["#FF9900", "#FF3333", "#FFCC00"],
				timeData: [

					{
						name: '7天销量',
						id: 4,
					},
					{
						name: '30天销量',
						id: 2,
					},
					{
						name: '1年销量',
						id: 3,
					}
				],
				timeActive: 4,
				imgData: [],
				searchKeywords: false,
				imageObject: {}, // 顶部图片对象   
				waterFallList: [],
				searchType: 'click',
				queryObj: '',
				loading: true,
				mode: 'grid',
				searchKeywordsText: '',
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
				goodQuerysId: '',
				imageId: ''
			};
		},

		computed: {
			// 提取每个分类的前三个商品
			processedCategories() {
				return this.cateGoodsList && this.cateGoodsList.map(category => ({
					...category,
					goods: (category.goods || []).sort((a, b) => {
						// 按优先级排序：有top_tag的优先，然后按top_tag数字排序
						const aTop = a.top_tag ? parseInt(a.top_tag.replace('TOP ', '')) : Infinity;
						const bTop = b.top_tag ? parseInt(b.top_tag.replace('TOP ', '')) : Infinity;
						return aTop - bTop;
					}).slice(0, 3) // 取前3条
				}));
			},
 processedCategoriesWithStyles() {
    if (!this.cateGoodsList || this.cateGoodsList.length === 0) {
      return [];
    }
    
    return this.cateGoodsList.map(category => {
      const goods = Array.isArray(category.goods) ? category.goods : [];
      
      // 为每个商品添加背景样式
      const styledGoods = goods.map(good => ({
        ...good,
        backgroundStyle: {
          backgroundImage: `url('${good.goods_thumb}')`
        }
      }));
      
      return {
        ...category,
        goods: styledGoods.slice(0, 3) // 只取前3个
      };
    });
  },
		},
		onShareAppMessage() {
			var that = this;
			return {
				title: that.imgData.share_title, // 分享标题
				path: `${that.websiteUrl}/mobile/pagesC/rankingList/rankingItem`,
				imageUrl: that.cateGoodsList[0].goods[0].goods_img,// 分享图片
			}
		},
		onShareTimeline() {
			return {
				title: that.imgData.share_title,
				// query: 'id=' + `${that.goodQuerysId}`, // 自定义页面路径中携带的参数
				imageUrl: that.cateGoodsList[0].goods[0].goods_img,
			}
		},
		methods: {
			  getBackgroundStyle(imageUrl) {
			      return {
			        backgroundImage: `url('${imageUrl}')`
			      };
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
			    .slice(0, 1)
			},
			isValidLabel(tag) {
			    if (!tag || typeof tag !== 'object') return false
			    
			    // 只要value存在且name存在就返回true
			    return typeof tag.value !== 'undefined' && tag.name
			},
			// 安全获取标签数据
			safeGetLabels(item) {
			  // 三级安全校验
			  if (!item) return []
			  if (!Object.prototype.hasOwnProperty.call(item, 'goods_services_label_new')) return []
			  return Array.isArray(item.goods_services_label_new) 
			    ? item.goods_services_label_new 
			    : []
			},
			moreClick(id) {
				uni.navigateTo({
					url: '/pagesC/rankingList/rankingItem?cat_id=' + id + '&time_active=' + this.timeActive
				})
			},
			timeItemClick(id) {
				this.timeActive = id;
				// 对应排行榜的数据
				this.getGoodsList(this.timeActive)
			},
			// 排行榜list 数据 /
			getGoodsList(active, page) {
				// active 日周月年
				if (active != this.oldActive) {
					uni.showLoading({
						title: '加载中',
						mask: true,
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
					url: this.websiteUrl + '/api/goods/hot_goodsList',
					method: 'POST',
					data: {
						page: this.page,
						cat_id: this.goodQuerysId,
						list_type: active,
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

						uni.hideLoading()
						this.oldActive = active;
						if (res.data.status == 'success') {
							if (res.data.data.list && res.data.data.list.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							// if (this.page == 1) {
							// 	this.cateGoodsList = res.data.data.list
							// 	this.waterFallList = res.data.data.list
							// 	// this.imageId = res.data.data.cat_id
							// } else {
							// 	this.cateGoodsList = this.cateGoodsList.concat(res.data.data.list)
							// 	this.waterFallList = res.data.data.list
							// 	// this.imageId = res.data.data.cat_id
							// }
 // 微信小程序需要特殊处理
        // #ifdef MP-WEIXIN
        const list = JSON.parse(JSON.stringify(res.data.data.list))
        // #endif
        // #ifndef MP-WEIXIN
        const list = res.data.data.list
        // #endif
        
        // 强制响应式更新
        if (this.page == 1) {
          this.cateGoodsList = []
          this.$nextTick(() => {
            this.cateGoodsList = list
          })
        } else {
          this.cateGoodsList = [...this.cateGoodsList, ...list]
        }
        
        // 微信小程序需要强制更新
        // #ifdef MP-WEIXIN
        this.$forceUpdate()
        // #endif
						}

						// this.getImage();


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
					code_url: `${that.websiteUrl}/mobile/pagesC/rankingList/rankingListIndex`,
					href: that.websiteUrl + '/mobile/pagesC/rankingList/rankingListIndex' ,
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.imgData.share_title,
					summary: 0,
					imageUrl: that.cateGoodsList[0].goods[0].goods_img,
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'


				};
				// #endif
				// #ifdef APP-PLUS
				let shareInfo = {
					href: that.websiteUrl + '/mobile/pagesC/rankingList/rankingListIndex',
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.imgData.share_title,
					summary: 0,
					// imageUrl: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890141736.jpg'
				imageUrl: that.cateGoodsList[0].goods[0].goods_img,
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
			getImage(id) {
				uni.request({
					url: this.websiteUrl + '/api/app_activity_goods_list/get_actvity_img',
					method: 'GET',
					data: {
						id: id,
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
		// onShow() {
		// 	// this.getImage();
		// },
		onLoad(e) {
			this.queryObj = e;
			console.log(e.hot_id)
			this.imageId = e.hot_id || 23;
			this.getGoodsList(this.timeActive, 1)
			this.getImage(this.imageId);
		},
		onPageScroll(e) {
			// console.log(e)
			var that = this

			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.category-container').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {

					if (that.page * that.size == that.cateGoodsList.length) {
						that.loadMoreStatus = 'loading';
						console.log("这里")
						that.page++
						this.searchType = 'scroll'
						this.searchKeywords = true;
						this.getGoodsList(this.timeActive)
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
				this.getGoodsList(this.timeActive)
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
	/* 全局背景色 */
	.container {
	  background-color: #CA0300 !important;
	  min-height: 100vh; /* 确保容器至少占满屏幕高度 */
	   overflow: visible;
	}

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
		  /* 确保图片容器在文档流中，不被背景覆盖 */
		  position: relative;
		  z-index: 10; /* 提高层级确保显示在背景上方 */
		  width: 100%;
		  /* 添加明确的高度防止图片被压缩 */
		  height: 560rpx;
		  min-height: 520rpx;
		  /* 确保没有背景色覆盖 */
		  background-color: transparent !important;

		image {
		  width: 100%;
		  height: 100%; /* 使用容器高度 */
		  min-height: 520rpx;
		  display: block; /* 消除图片底部空白 */
		  object-fit: cover; /* 保持图片比例填充容器 */
		  z-index: 11; /* 确保图片在容器上方 */
		}
	}

	.product-list-lie {
		  margin-top: -40rpx;
		  background: #CA0300;
		  position: relative;
		  z-index: 15; /* 确保列表在图片下方 */

		.list-title {
			// height: 100px;
			background: #CA0300;
			border-radius: 28rpx 28rpx 0rpx 0rpx;
			z-index: 3;
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			.time_item {
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 32rpx;
				color: #272727;

				padding: 2rpx 10rpx;
				background: #FFE50C;
				border-radius: 32rpx;
				min-width: 192rpx;
				min-height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 5px;
			}

			.active {
				background: #FFFFFF;
				font-weight: 500;
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

	// 新增
	.category-container {
		padding: 10px;
	}

	.category-box {
		// margin-bottom: 20px;
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx 0 10rpx;
		// margin-bottom: 10rpx;

	}

	.category-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #272727;
		line-height: 32rpx;
		text-align: left;
		font-style: normal
	}

	.more-btn {
	font-family: PingFangSC, PingFang SC;
	font-weight: 500;
	font-size: 24rpx;
	color: #828282;
	line-height: 24rpx;
	text-align: right;
	font-style: normal;
	}

	.goods-layout {
		  display: flex;
		  justify-content: space-between;
		  align-items: baseline; /* 关键：所有项目基线对齐（图片底部对齐） */
		  // margin-bottom: 30rpx;
		  position: relative;
		  /* 添加容器最小高度，避免内容过短时图片上移 */
		  min-height: 480rpx; 
	}

	/* 商品项基础样式 */
	.goods-item {
		  width: 30%;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  position: relative;
	}

	.middle-item {
		width: 35%;
		/* 中间更宽 */
	}

	/* TOP 标签样式 */
	.top-tag {
		position: absolute;
		z-index: 10;

		/* 确保在图片上方 */
		image {
			width: 56rpx;
			height: 60rpx;
		}
	}

	.top1-tag {
		top: 40rpx;
		/* TOP1 标签更高 */
		left: 16rpx;
	}

	.top2-tag,
	.top3-tag {
		top: 78rpx;
		left: 16rpx;
	}

	/* 图片容器 */
	.goods-img-box {
		 width: 100%;
		  display: flex;
		  justify-content: center;
		  position: relative;
		  /* 固定图片容器高度，图片底部将以此为基准对齐 */
		  height: 280rpx; 
	}
	.buy-number {
		display: flex;
		    justify-content: center;
			align-items: center;
		text-align: center;
		// min-width: 180rpx;
		background: #FDDFC3;
		border-radius: 8rpx;
		padding: 8rpx 20rpx;
		margin-top:28rpx;
		margin-bottom: 12rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #120E0F;
		line-height: 28rpx;
		text-align: right;
		font-style: normal;
	}

	/* 图片基础样式 */
	.goods-img {
		  width: 100%;
		  height: 100%;
		  background-size: cover;
		  background-position: center;
		  background-repeat: no-repeat;
		  border-radius: 10rpx;
		  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		  /* 图片在容器内底部对齐 */
		  align-self: flex-end;
	}

	/* 普通商品图片 */
	.left-item .goods-img,
	.right-item .goods-img {
		height: 200rpx;
		/* 两侧图片高度固定 */
		// margin-top: 20rpx;
		/* 为标签留出空间 */
	}

	/* TOP1 特殊样式 */
	.top1-img {
		height: 240rpx !important;
		/* TOP1 图片更高 */
		// margin-top: 25rpx !important;
		/* 更大的顶部空间 */
	}

	/* 文字样式 */
	.goods-name {
		  display: -webkit-box; /* 关键属性：启用flexbox布局模型 */
		  -webkit-box-orient: vertical; /* 垂直排列子元素 */
		  -webkit-line-clamp: 2; /* 限制最多2行 */
		  
		  line-height: 1.4; /* 增加行高，提升多行可读性 */
		  font-family: PingFangSC, "PingFang SC";
		  font-weight: 400;
		  font-size: 28rpx;
		  color: #4D4B4B;
		  line-height: 36rpx;
		  text-shadow: 0px 0px 12px rgba(0,0,0,0.05);
		  text-align: center;
		  font-style: normal;
		  margin-top: 10rpx;
		  width: 100%;
		  overflow: hidden;
		  text-overflow: ellipsis;
	}
.goods-name,  .label-box {
  width: 100%;
  margin-top: 10rpx; /* 与图片保持固定间距 */
}
	.stats,
	.collect {
		font-size: 22rpx;
		color: #666;
		text-align: center;
		margin-top: 4rpx;
	}

	/* 占位样式 */
	.placeholder-tag {
		left: 16rpx
		// background-color: #ccc !important;
	}

	.placeholder-img {
		background-color: #f5f5f5;
	}

	.placeholder-text {
		color: #999;
	}
	.label-box {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		margin-bottom: 16rpx;
	
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
</style>