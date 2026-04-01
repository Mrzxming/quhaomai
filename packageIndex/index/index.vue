<template>
	<view>
		<view class="search_container">
			<view class="search" :class="{'search-not-home':true,'position-fixed':false}">
				<!-- #ifdef APP-PLUS -->
				<!-- 这里是状态栏 -->
				<view class="status_bar" style="height: 80rpx;"></view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<view class="input_main" style=""
					:style="{height: menuButtonInfo.height + 'px', margin: `0 0 0 ${vw - menuButtonInfo.right}px`}">
					<view class="input_view">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifdef H5 -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 44rpx;height: 44rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 44rpx;height: 44rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 36rpx;height: 36rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<view class="placeholder_text" style="color: #999;" @click="searchFocus">输入货源关键字</view>
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifdef H5 -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240413_6F9E9C079D3F2D60F2041C819894FED4.png"
								style="width: 44rpx;height: 44rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240413_6F9E9C079D3F2D60F2041C819894FED4.png"
								style="width: 44rpx;height: 44rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240413_6F9E9C079D3F2D60F2041C819894FED4.png"
								style="width: 36rpx;height: 36rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<view
								style="background-color: #aaaaaa;height: 30rpx;width: 2rpx;margin-left: 20rpx;margin-top: 4rpx;">
							</view>
							<view class="placeholder_texts" @click="searchFocus">搜索</view>
						</view>
					</view>


					<!-- <view class="input_view" @click="searchFocus">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<uni-icons type="search" size="18" :color="tFontColor"></uni-icons>
							<view class="placeholder_text" style="color: #999;">{{searchValue}}</view>
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<view class="placeholder_texts">搜索</view>
						</view>
					</view> -->
				</view>
				<view class="mask"></view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="input_main">
					<view class="input_view">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifndef H5 -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 44rpx;height: 44rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<view class="placeholder_text" style="color: #999;" @click="searchFocus">输入货源关键字</view>
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifndef H5 -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240413_6F9E9C079D3F2D60F2041C819894FED4.png"
								style="width: 44rpx;height: 44rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<view
								style="background-color: #aaaaaa;height: 30rpx;width: 2rpx;margin-left: 20rpx;margin-top: 4rpx;">
							</view>
							<view class="placeholder_texts" @click="searchFocus">搜索</view>
						</view>
					</view>

					<!-- <view class="input_view" @click="searchFocus">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<uni-icons type="search" size="18" :color="tFontColor"></uni-icons>
							<view class="placeholder_text" style="color: #999;">{{searchValue}}</view>
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<view class="placeholder_texts">搜索</view>
						</view>
					</view> -->
				</view>
				<view class="mask"></view>
				<!-- #endif -->
				<view class="category-nav" ref="categorynav" :style="{top: navigationBarHeight + 'px'}"
					:class="{'position-fixed': scrollFixed}">
					<scroll-view class="uni-swiper-tab" scroll-x show-scrollbar="false">
						<view class="swiper-tab-list" :class="{'active': currentIndex == index+1}"
							v-for="(item,index) in categoryNavList" :key="index"
							@click="cateClick(index+1,item.cat_id)"><text class="text">{{item.cat_alias_name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="seize-seat" :style="{'height':height + 'px'}"></view>

		</view>

		<uni-drawer :visible="isPopupVisible" mode="right" @close="isPopupVisible = false">
			<view class="show-popup-filter" style="padding-top: 100rpx;">
				<scroll-view class="scroll-view top" scroll-y>
					<view class="section">
						<view class="title"><text>价格区间</text></view>
						<view class="section-warp price-filter">
							<view class="input">
								<input type="tel" v-model="filter.min" :placeholder="$t('lang.minimum_price')" />
							</view>
							<text class="hang"></text>
							<view class="input">
								<input type="tel" v-model="filter.max" :placeholder="$t('lang.top_price')" />
							</view>
						</view>
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':item.sn == price_filter_sn}"
								v-for="(item,index) in grade" :key="index" @click="onPriceFilter(item)">
								<rich-text :nodes="item.price_range"></rich-text>
							</view>
						</view>
					</view>
					<view class="section" v-if="filter.brandResult.length > 0">
						<view class="title">
							<text>品牌</text>
							<view class="right-icon" @click="isPopupBrand = !isPopupBrand"><i class="iconfont"
									:class="[isPopupBrand ? 'icon-less' : 'icon-moreunfold']"
									v-if="filter.brandResult.length > 9"></i></view>
						</view>
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':filter.brandResultArr.includes(item)}"
								@click="onBrandResult(item)" v-show="index < 9 || isPopupBrand"
								v-for="(item,index) in filter.brandResult" :key="index">
								<text>{{ item.brand_name }}</text>
							</view>
						</view>
					</view>
					<view class="section" v-for="(item,index) in attribute" :key="index">
						<view class="title">
							<text>{{item.filter_attr_name}}</text>
							<view class="right-icon" @click="isAttribute(item.filter_attr_id)"><i class="iconfont"
									:class="[!attribute_id.includes(item.filter_attr_id) ? 'icon-less' : 'icon-moreunfold']"></i>
							</view>
						</view>
						<view class="section-warp select-tabs"
							:class="[attribute_id.includes(item.filter_attr_id) ? 'hide' : 'show']">
							<view class="select-list"
								:class="{'active':filter.filter_attr[index] == attritem.goods_attr_id}"
								v-for="(attritem,attrindex) in item.attr_list" :key="attrindex"
								@click="onAttributeValue(attritem,index)">
								<text>{{attritem.attr_value}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- #ifdef MP-WEIXIN -->
				<view :class="isIpx == true? 'show-popup-filter-bottoms' : 'footers'">
					<view class="btn-bar btn-bar-min">
						<view class="btn btn-white" @click="closeFilter">{{$t('lang.merchants_reset')}}</view>
						<view class="btn btn-red btn-bor-red" @click="submitFilter">{{$t('lang.confirm')}}</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view :class="isIpx == true? 'show-popup-filter-bottom' : 'footer'">
					<view class="btn-bar btn-bar-min">
						<view class="btn btn-white" @click="closeFilter">{{$t('lang.merchants_reset')}}</view>
						<view class="btn btn-red btn-bor-red" @click="submitFilter">{{$t('lang.confirm')}}</view>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</uni-drawer>


		<view class="category-secondary">
			<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
				<view class="scroll-view-item1" v-for="(item,index) in categoryList" :key="index"
					@click="$outerHref('/pagesD/goodslist/goodslist?id=' + item.cat_id,'app')">
					<view class="item" style="width: 100%;display: flex;align-items: center;justify-content: center;">
						<view class="box">
							<image :src="item.touch_icon" mode="widthFix" class="img"></image>
						</view>
						<view class="name">{{item.cat_name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="category-brand" v-if="brandList.length > 0">
			<view class="title">品牌精选</view>
			<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
				<view class="scroll-view-item" v-for="(item,index) in brandList" :key="index"
					@click="$outerHref('/pagesC/brand/detail/detail?id='+item.brand_id,'app')">
					<view class="item">
						<view class="box">
							<image :src="item.brand_logo" mode="widthFix" class="img"></image>
						</view>
						<view class="name">{{item.brand_name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="product-list-lie">
			<view style="padding: 20upx 20upx 0 20upx;">
				<dsc-filter :filter="filter" :isPopupVisible="isPopupVisible" v-on:getFilter='handleFilter'
					@setPopupVisible="setPopupVisible"></dsc-filter>
			</view>
			<dsc-product-list :list="cateGoodsList" :showone="true" :mode="mode"></dsc-product-list>
		</view>

		<!-- <view :style="isIpx ? 'height: 150rpx;' : 'height: 100rpx;'"></view> -->
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />

		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true"
			@fileterScrollTop="fileterScrollTop"></dsc-filter-top>
		<!-- <zdy-tabbar :current-page="1"></zdy-tabbar> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup.vue'

	import universal from '@/common/mixins/universal.js'

	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'


	import dscProductList from '@/components/dsc-product-list.vue'
	import dscFilter from '@/components/dsc-filter.vue'
	import uniDrawer from '@/components/uni-drawer.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	const arrayliat = [];
	export default {
		mixins: [universal],
		components: {
			dscProductList,
			dscFilter,
			uniDrawer,
			uniLoadMore,
			uniIcons,
			uniPopup,
			dscFilterTop,

		},
		data() {
			return {
				leftState: false,
				nFontColor: '#FFFFFF',
				nBackgroundColor: '#FFFFFF',
				tFontColor: '#999',
				fixed: true,
				titleNView: false,
				statusBar: false,
				height: 0,
				menuButtonInfo: {},
				logo: '',
				logoLink: '',
				vw: 375,
				search_keywords: [],
				latelyKeyword: [],
				isDefine: 1,
				list: [],
				navIndex: 0,

				bonusShow: false,
				dscLoading: true,
				curpage: '',
				ru_id: 0,
				mpShareShow: false,
				customerShow: false,
				shopConfig: uni.getStorageSync('configData'),
				imgShare: '',
				versionData: '',
				jumpHeight: 0,
				scrollPickOpen: false,
				scrollFixed: false,
				scrollState: false,
				click_add: false,
				liststatus: [],
				CustomBar: 0,
				HeaderBar: 0,
				userId: 0,

				isDefine: 1,
				list: [],
				navIndex: 0,
				LatelyKeyword: [],
				navTranslateX: 0,
				paly: false,

				categoryData: {},
				categoryList: [],
				brandList: [],
				disabled: false,
				loading: true,
				page: 1,
				size: 10,
				footerCont: false,
				loadMoreStatus: 'more',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				mode: 'grid',
				scrollLeft: 0,

				queryObj: {},
				isFilter: true,
				isPopupVisible: false,
				filter: {
					sort: 'goods_id',
					order: 'desc',
					goods_num: '0',
					promote: '0',
					min: '',
					max: '',
					brand_id: [],
					brandResult: [],
					brandResultArr: [],
					self: '0',
					intro: '',
					filter_attr: []
				},
				isPopupBrand: false,
				grade: [],
				attribute: [],
				attribute_id: [],
				price_filter_sn: null,

				searchValue: '输入货源关键字',
				heightStyle: '',

				categoryNavList: [],
				currentIndex: 1,
				height: 0,
				navigationBarHeight: 0,
				cateGoodsList: [],
				isIpx: false,
				list1: [],
				ones: 1
			}
		},
		created() {
			this.selectBrand();

			// #ifdef APP-PLUS
			this.logo = uni.getStorageSync('configData').app_top_img || ''
			this.logoLink = uni.getStorageSync('configData').app_top_url || ''
			if (this.shopId == 0) {
				this.leftState = true;
				this.nBackgroundColor = "#ffffff";
				this.titleNView = true;
				this.statusBar = true
			}
			// #endif

			// #ifdef MP-WEIXIN
			this.logo = uni.getStorageSync('configData').wxapp_top_img || ''
			this.logoLink = uni.getStorageSync('configData').wxapp_top_url || ''
			this.statusBar = true
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// #endif
		},
		mounted() {
			let _this = this;
			_this.$nextTick(() => {
				let info1 = uni.createSelectorQuery().in(this).select(".search");
				setTimeout(() => {
					info1.boundingClientRect(function(data) {
						if (data) {
							_this.height = data.height
							getApp().globalData.navigationBarHeight = data.height
						}
					}).exec();
				}, 500)
			})

			uni.getSystemInfo({
				success: function(res) {
					let model = res.model;
					// console.log(modelmes)
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (model.search(item) != -1) {
							_this.isIpx = true
						}
					})
				}
			})

			_this.shopConfigs();
			setTimeout(function() {
				_this.getGoodsList()
			}, 500);
		},
		computed: {
			bonusData() {
				return this.shopConfig.bonus_ad
			},
			topCategoryCatid: {
				get() {
					return this.$store.state.topCategoryCatid
				},
				set(val) {
					this.$store.state.topCategoryCatid = val

				}
			},

			isUnread() {
				let i = 0
				this.liststatus.forEach((res) => {
					if (res.unread) {
						i++
					}
				})

				return i > 0 ? true : false
			},
		},
		onShareAppMessage(res) {
			let user_id = uni.getStorageSync('user_id');
			let url = '/packageIndex/index/index';
			if (user_id) {
				url = '/packageIndex/index/index?parent_id=' + user_id
			}

			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/packageIndex/index/index'
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				query: {
					key: ""
				},
			}
		},
		onLoad(e) {
			var that = this

			let parent_id = e.parent_id;
			let user_id = uni.getStorageSync('user_id');

			if (parent_id) {
				if (parent_id != user_id) {
					uni.setStorageSync('parent_id', parent_id)
				}
			}

			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})

			if (that.bonusData && that.bonusData.open == 1) {
				that.bonusShow = uni.getStorageSync('bonusShow') !== '' ? uni.getStorageSync('bonusShow') : true;
			}

			if (uni.getStorageSync('program')) {
				that.click_add = false
			} else {
				that.click_add = true
				uni.setStorageSync('program', 1)
			}

			//小程序扫码
			if (e.scene) {
				let scene = decodeURIComponent(e.scene);
				let parent_id = scene.split('.')[0];
				uni.setStorageSync('parent_id', parent_id);
			}

			/* 获取小程序状态栏高度 */
			uni.getSystemInfo({
				success: e => {
					let StatusBar = e.statusBarHeight;
					let rect = wx.getMenuButtonBoundingClientRect();

					if (e.system.toLowerCase().indexOf('ios') > -1) {
						//IOS  
						that.CustomBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;
						that.HeaderBar = that.CustomBar - e.statusBarHeight;
					} else {
						//安卓  
						that.HeaderBar = rect.height + (rect.top - e.statusBarHeight) * 2;
						that.CustomBar = that.HeaderBar + e.statusBarHeight;
					}
				}
			});
			// #endif


			// that.load();
			that.showLoadMore = true
			uni.request({
				url: that.websiteUrl + '/api/visual/visual_category',
				method: 'GET',
				data: {},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					that.categoryNavList = res.data.data

					that.cateClick(1, that.categoryNavList[0].cat_id)
					for (var i = 0; i < that.categoryNavList.length; i++) {
						that.getlist1(that.categoryNavList[i].cat_id);
					}
				},
				fail: (err) => {
					console.error(err)
				}
			})
		},
		methods: {
			async scanClick() {
				// #ifndef APP-PLUS
				uni.scanCode({
					success: (res) => {
						if (this.$isLogin()) {
							let result = JSON.parse(res.result);
							let sid = result.sid;
							let url = result.url;
							let timestamp = Date.parse(new Date()) / 1000;
							console.log('scanCodescanCode', res)
							this.keyword = res.result.replace(/\s*/g, "");
							if (res.scanType == 'EAN_13' && this.keyword.length == 13) {
								if (this.shopId > 0) {
									uni.navigateTo({
										url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this
											.keyword + '&ru_id=' + this.shopId
									})
								} else {
									uni.navigateTo({
										url: '/pagesD/goodslist/goodslist?keywords=' + this
											.keyword
									})
								}
								return
							} else {
								uni.showToast({
									icon: "none",
									title: '条码扫描不完整,请重新扫码'
								})
							}
						} else {
							uni.navigateTo({
								url: '/pagesB/login/login?delta=1'
							})
						}
					}
				})
				// #endif
				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA")
				console.log(JSON.stringify(result))
				if (result == 1) {
					// 此处处理各自业务 如：uni.chooseImage 
					uni.scanCode({
						success: (res) => {
							if (this.$isLogin()) {
								let result = JSON.parse(res.result);
								let sid = result.sid;
								let url = result.url;
								let timestamp = Date.parse(new Date()) / 1000;
								console.log('scanCodescanCode', res)
								this.keyword = res.result.replace(/\s*/g, "");
								if (res.scanType == 'EAN_13' && this.keyword.length == 13) {
									if (this.shopId > 0) {
										uni.navigateTo({
											url: '/pagesD/shop/shopGoods/shopGoods?keywords=' +
												this
												.keyword + '&ru_id=' + this.shopId
										})
									} else {
										uni.navigateTo({
											url: '/pagesD/goodslist/goodslist?keywords=' + this
												.keyword
										})
									}
									return
								} else {
									uni.showToast({
										icon: "none",
										title: '条码扫描不完整,请重新扫码'
									})
								}
							} else {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
				}
				// #endif

				// 	// #ifndef APP-PLUS
				// 	uni.scanCode({
				// 		success: (res) => {
				// 			if (this.$isLogin()) {
				// 				let result = JSON.parse(res.result);
				// 				let sid = result.sid;
				// 				let url = result.url;
				// 				let timestamp = Date.parse(new Date()) / 1000;
				// 				uni.request({
				// 					url: this.websiteUrl + '/api/appqrcode/scancode',
				// 					method: 'POST',
				// 					header: {
				// 						'Content-Type': 'application/json',
				// 						'token': uni.getStorageSync('token'),
				// 						'X-Client-Hash': uni.getStorageSync('client_hash')
				// 					},
				// 					data: {
				// 						sid: sid,
				// 						login_time: timestamp
				// 					},
				// 					success: (res1) => {
				// 						if (sid) {
				// 							uni.navigateTo({
				// 								url: '/pagesC/scan/scan?sid=' + sid +
				// 									'&url=' +
				// 									url
				// 							});
				// 						} else {
				// 							uni.showToast({
				// 								title: '请扫描正确的二维码',
				// 								icon: 'none'
				// 							})
				// 						}
				// 					},
				// 					fail: (res1) => {
				// 						console.log(res1, 2)
				// 					}
				// 				})
				// 			} else {
				// 				uni.navigateTo({
				// 					url: '/pagesB/login/login?delta=1'
				// 				})
				// 			}
				// 		}
				// 	})
				// 	// #endif
				// 	// #ifdef APP-PLUS
				// 	var result = await permision.premissionCheck("CAMERA")
				// 	console.log(JSON.stringify(result))
				// 	if (result == 1) {
				// 		// 此处处理各自业务 如：uni.chooseImage 
				// 		uni.scanCode({
				// 			success: (res) => {
				// 				console.log('search11',res);
				// 				if (this.$isLogin()) {
				// 					console.log('search11222',res.result);
				// 					let result = JSON.parse(res.result);
				// 					let sid = result.sid;
				// 					let url = result.url;
				// 					let timestamp = Date.parse(new Date()) / 1000;
				// 					uni.request({
				// 						url: this.websiteUrl + '/api/appqrcode/scancode',
				// 						method: 'POST',
				// 						header: {
				// 							'Content-Type': 'application/json',
				// 							'token': uni.getStorageSync('token'),
				// 							'X-Client-Hash': uni.getStorageSync('client_hash')
				// 						},
				// 						data: {
				// 							sid: sid,
				// 							login_time: timestamp
				// 						},
				// 						success: (res1) => {
				// 							console.log('search11222',res);
				// 							if (sid) {
				// 								uni.navigateTo({
				// 									url: '/pagesC/scan/scan?sid=' + sid +
				// 										'&url=' +
				// 										url
				// 								});
				// 							} else {
				// 								uni.showToast({
				// 									title: '请扫描正确的二维码',
				// 									icon: 'none'
				// 								})
				// 							}
				// 						},
				// 						fail: (res1) => {
				// 							console.log(res1, 2)
				// 						}
				// 					})
				// 				} else {
				// 					uni.navigateTo({
				// 						url: '/pagesB/login/login?delta=1'
				// 					})
				// 				}
				// 			}
				// 		})
				// 	}
				// 	// #endif

			},
			async chooseImage(val) {
				let that = this
				// #ifndef APP-PLUS
				// 预加载拍照页面
				uni.preloadPage({
					url: '/pagesD/middles/index'
				});
				uni.navigateTo({
					url: '/pagesD/middles/index'
				})
				return;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					// crop:{
					// 	quality:50,
					// 	width:30,
					// 	height:30,
					// 	resize:true
					// },
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 80,
								success: (result) => {
									// that.imageSrc = result.tempFilePath;
									console.log("uni.compressImage")
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
					}
				})
				// #endif

				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA")
				console.log(JSON.stringify(result))
				if (result == 1) {
					console.log("zeli")
					// 预加载拍照页面
					uni.preloadPage({
						url: '/pagesD/middles/index'
					});
					uni.navigateTo({
						url: '/pagesD/middles/index'
					})
					return;
					// 此处处理各自业务 如：uni.chooseImage 
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['camera'],
						success: (res) => {
							that.imageSrc = res.tempFilePaths[0];
							let size = res.tempFiles[0].size; //上传图片大小
							let maxSize = 1024 * 1024 * 2; //最大可上传2mb
							if (size > maxSize) {
								uni.compressImage({
									src: res.tempFilePaths[0],
									quality: 80,
									success: (result) => {
										that.uploadImage(val);
									},
									fail: (result) => {
										console.log(result)
									}
								})
							} else {
								that.uploadImage(val);
							}
						}
					})
				}
				// #endif
			},

			getlist1(cat_id) {
				var that = this

				if (that.filter.promote == 1) {
					that.filter.intro = 'promote'
				} else {
					that.filter.intro = ''
				}

				uni.request({
					url: that.websiteUrl + '/api/catalog/goodslist',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						cat_id: cat_id,
						brand: that.filter.brand_id,
						warehouse_id: '0',
						area_id: '0',
						min: that.filter.min,
						max: that.filter.max,
						filter_attr: that.filter.filter_attr,
						ext: '',
						goods_num: '',
						size: that.size,
						page: that.page,
						sort: that.filter.sort,
						order: that.filter.order,
						self: that.filter.self,
						intro: that.filter.intro,
					},
					success: (res) => {
						if (res.statusCode == 200) {
							var a = {
								cat_id: cat_id,
								list: res.data.data
							}
							that.list1 = that.list1.concat(a)
						}
					}
				})
			},
			cateClick(index, cat_id) {
				var that = this
				that.currentIndex = index;
				that.topCategoryCatid = cat_id
				that.fileterScrollTop()
				that.load();
				that.page = 1
				if (index == 1 && that.ones == 1) {
					that.getGoodsList(1)
					that.ones = 2
				} else {
					for (var i = 0; i < that.list1.length; i++) {
						if (that.list1[i].cat_id == cat_id) {
							that.cateGoodsList = that.list1[i].list
						}
					}
				}
				// that.dscLoading = false
			},
			// 点击导航改变索引
			changeIndex(i) {
				this.navIndex = i;
			},
			onColse() {
				this.LatelyKeyword = [];
			},
			change(e) {
				let index = e.target.current;
				this.navIndex = index;
			},
			transitionHandle(e) {
				this.navTranslateX = e.detail.dx;
			},

			fileterScrollTop(e) {
				//视图会发生重新渲染
				//当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			},

			closeFilter() {
				this.filter.self = '0'
				this.filter.goods_num = '0'
				this.filter.promote = '0'
				this.filter.min = ''
				this.filter.max = ''
				this.filter.brand_id = []
				this.filter.brandResultArr = []
				this.filter.filter_attr = []
				this.price_filter_sn = null
				console.log("2222")
				this.getGoodsList(1);
			},
			submitFilter() {
				this.isPopupVisible = false;
				console.log("3333")
				this.getGoodsList(1);
			},
			selectBrand() {
				uni.request({
					url: this.websiteUrl + '/api/catalog/brandlist',
					method: 'POST',
					data: {
						cat_id: this.cat_id,
						keywords: ''
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.data.length > 0) {
							this.filter.brandResult = res.data.data
						}
					}
				})
			},
			onBrandResult(item) {
				let arr = [];
				if (this.filter.brandResultArr.includes(item)) {
					this.filter.brandResultArr.splice(this.filter.brandResultArr.indexOf(item), 1);
				} else {
					this.filter.brandResultArr.push(item);
				}

				this.filter.brand_id = this.filter.brandResultArr.map(v => {
					return v.brand_id
				});
			},

			isAttribute(id) {
				if (this.attribute_id.includes(id)) {
					this.attribute_id.splice(this.attribute_id.indexOf(id), 1);
				} else {
					this.attribute_id.push(id);
				}
			},
			onPriceFilter(item) {
				this.price_filter_sn = item.sn;
				this.filter.min = item.start;
				this.filter.max = item.end;
			},
			onAttributeValue(item, index) {
				this.filter.filter_attr.splice(index, 1, item.goods_attr_id);
			},
			setPopupVisible(val) {
				this.isPopupVisible = val;

				if (this.isPopupVisible) {
					//价格区间
					uni.request({
						url: this.websiteUrl + '/api/catalog/grade',
						method: 'GET',
						data: {
							cat_id: this.cat_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data.status == 'success') {
								this.grade = res.data.data;
							}
						}
					})
					//属性列表
					uni.request({
						url: this.websiteUrl + '/api/catalog/attribute',
						method: 'GET',
						data: {
							cat_id: this.cat_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data.status == 'success') {
								this.attribute = res.data.data;

								for (let index of this.attribute) {
									this.filter.filter_attr.push(0)
								}
							}
						}
					})
				}
			},
			handleFilter(o) {
				this.filter.sort = o.sort;
				this.filter.order = o.order;
				console.log("4444")
				this.getGoodsList(1);
			},
			getGoodsList(page) {
				var that = this
				if (page) {
					that.page = page
					that.size = 10
				}
				if (that.filter.promote == 1) {
					that.filter.intro = 'promote'
				} else {
					that.filter.intro = ''
				}

				uni.request({
					url: that.websiteUrl + '/api/catalog/goodslist',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						cat_id: that.topCategoryCatid,
						brand: that.filter.brand_id,
						warehouse_id: '0',
						area_id: '0',
						min: that.filter.min,
						max: that.filter.max,
						filter_attr: that.filter.filter_attr,
						ext: '',
						goods_num: '',
						size: that.size,
						page: that.page,
						sort: that.filter.sort,
						order: that.filter.order,
						self: that.filter.self,
						intro: that.filter.intro,
					},
					success: (res) => {
						if (res.statusCode == 200) {
							if (res.data.data.length < 10) {
								that.loadMoreStatus = 'noMore'
							}
							if (that.page == 1) {
								that.cateGoodsList = res.data.data
							} else {
								that.cateGoodsList = that.cateGoodsList.concat(res.data.data)
							}
						}
					}
				})
			},
			load() {
				var that = this
				that.loadMoreStatus = "loading"
				uni.request({
					url: that.websiteUrl + '/api/visual/visual_second_category',
					method: 'GET',
					data: {
						cat_id: that.topCategoryCatid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						that.dscLoading = false
						that.categoryList = res.data.data.category;
						that.brandList = res.data.data.brand;
						that.categoryData = res.data.data;
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},

			shopConfigs() {
				//读取本地缓存
				uni.getStorage({
					key: 'LatelyKeyword',
					success: (res) => {
						this.latelyKeyword = res.data
						this.placeholder = res.data[0]
						this.placeholderState = 1
					}
				});
				uni.request({
					url: this.websiteUrl + '/api/shop/config',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						if (data.search_keywords) {
							this.search_keywords = data.search_keywords.split(',')
						}
					}
				});
			},
			linkTo() {
				if (this.logoLink) {
					if (this.logoLink.startsWith('http')) {
						this.$outerHref(this.logoLink)
					} else {
						this.$outerHref(this.logoLink, 'app')
					}
				}
			},

			searchFocus() {
				//全局变量integration赋值
				//getApp().globalData.integration = 0;
				uni.navigateTo({
					url: '/pagesD/search/search?shopId=' + this.shopId
				});
			},
		},
		onReady() {
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.vw = windowWidth;
			this.jumpHeight = windowHeight * 0.83
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
						that.getGoodsList()
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
			console.log(that.cateGoodsList.length)
			console.log(that.page * that.size == that.cateGoodsList.length)
			if (that.page * that.size == that.cateGoodsList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				console.log("1111")
				that.getGoodsList()
			} else {
				that.loadMoreStatus = "noMore"
			}
		}
	}
</script>

<style scoped lang="scss">
	.top-catalog {
		height: 100%;
		box-sizing: border-box;
	}

	.category-secondary {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border-radius: 20upx;
		padding: 20upx 0 10rpx;
	}

	.category-secondary .item {
		// width: 20%;
		padding: 20rpx 0 0 0;
	}

	.category-brand {
		background-color: #fff;
		border-radius: 20upx;
		margin: 0 20upx;
	}

	.category-brand .title {
		font-size: 32upx;
		color: #000;
		padding: 20upx 40upx 0upx 40upx;
	}

	.category-brand .list {
		display: flex;
		flex-direction: row;
		// flex-wrap: wrap;
	}

	.category-brand .list .item {
		width: 25%;
	}

	.category-brand .list .item .box {
		width: 110upx;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		margin-bottom: 20upx;
	}

	.name {
		font-size: 25upx;
		line-height: 1.5;
	}

	.box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 150upx;
	}

	.box .img {
		width: 72%;
		border-radius: 10rpx;
	}

	.product-list {
		padding: 8upx 8upx 0;
	}

	.scroll-view {
		overflow: visible;
	}

	.scroll-view-item {
		display: inline-block;
		width: 20%;
		margin: 0 0 0 2%;
		background-color: #fff;
		overflow: hidden;
		border-radius: 20upx;
		/* box-shadow:1upx 5upx 20upx 0 rgba(108,108,108,0.2); */
	}

	.scroll-view-item1 {
		display: inline-block;
		align-items: center;
		justify-content: center;
		// width: 20%;
		width: 20%;
		/* #ifndef H5 */
		height: 180rpx;
		/* #endif */
		margin: 0 0 0 2%;
		background-color: #fff;
		overflow: hidden;
		border-radius: 20upx;
		/* box-shadow:1upx 5upx 20upx 0 rgba(108,108,108,0.2); */
	}


	/*筛选*/
	.show-popup-filter {
		background: #f4f4f4;
		height: 100%;

		.top {
			height: calc(100% - 120rpx);
		}

		.section {
			padding: 10px;
			background: #fff;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-weight: 700;
					color: #000;
					font-size: 16px;
				}

				.right-icon {
					.iconfont {
						font-size: 14px;
						margin-right: 5px;
					}
				}
			}

			.section-warp {
				margin-top: 10px;

				&.price-filter {
					display: flex;
					flex-direction: row;
					align-items: center;

					.input {
						width: 40%;
						background: #f2f2f2;
						border-radius: 20px;
						height: 40px;
						text-align: center;

						input {
							width: 100%;
							background: transparent;
							height: 100%;
							text-align: center;
							font-size: 14px;
						}
					}

					.hang {
						margin: 0 10px;
						height: 1px;
						background: #000;
						width: 10px;
					}
				}

				&.select-tabs {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;

					.select-list {
						width: calc(33.3% - 6px);
						box-sizing: border-box;
						margin: 0 9px 10px 0;
						padding: 0;

						text,
						rich-text {
							padding: 5px;
							background: #f2f2f2;
							text-align: center;
							display: block;
							border-radius: 40px;
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
								border-color: #e93422;
								color: #e93422;
								background-color: #faeeec;
							}
						}
					}
				}

				&.hide {
					display: none;
				}
			}
		}

		.footer {
			position: absolute;
			bottom: 102rpx;
			left: 0;
			right: 0;
			background: #fff;

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 16px;

					&.btn-red {
						color: #FFFFFF;
					}
				}
			}
		}

		.footers {
			position: absolute;
			bottom: 102rpx;
			left: 0;
			right: 0;
			background: #fff;

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 80rpx;
					line-height: 60rpx;
					font-size: 16px;

					&.btn-red {
						color: #FFFFFF;
					}
				}
			}
		}

		.show-popup-filter-bottom {
			position: absolute;
			bottom: 156rpx;
			left: 0;
			right: 0;
			background: #fff;

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 16px;

					&.btn-red {
						color: #FFFFFF;
					}
				}
			}
		}

		.show-popup-filter-bottoms {
			position: absolute;
			bottom: 156rpx;
			left: 0;
			right: 0;
			background: #fff;

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 80rpx;
					line-height: 60rpx;
					font-size: 16px;

					&.btn-red {
						color: #FFFFFF;
					}
				}
			}
		}
	}

	::-webkit-scrollbar {
		display: none;
	}

	.uni-page-body {
		height: 100%;
	}

	.uni-page-body .uni-navbar-header .uni-navbar-header-btns:first-child {
		width: 48upx;
		justify-content: center;
		padding: 0 0 0 20upx;
	}

	.uni-page-body .more-link {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 25upx;
	}

	.uni-page-body .more-link .txt {
		padding: 0 10upx 0 20upx;
		border-left: 1px solid #e3e8ee;
		line-height: 1.2;
		margin-left: 10upx;
	}

	.uni-page-body .more-link .uni-icon {
		line-height: 1.8;
	}

	.uni-page-body .input-view .uni-icon {
		display: block;
	}

	.uni-page-body .uni-popup-middle {
		padding: 0;
		width: 80%;
		height: auto;
		background: none;
		box-shadow: none;
	}

	.uni-page-body .uni-popup-middle .close,
	.uni-page-body .uni-popup-middle .close-on {
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		position: absolute;
		top: -32upx;
		right: -10upx;
	}

	.uni-page-body .uni-popup-middle .version-popup {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-text {
		position: absolute;
		top: 15%;
		left: 12%;
		color: #FFFFFF;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-text .tit {
		font-size: 32upx;
	}

	.uni-page-body .uni-popup-middle .version-popup .close {
		top: 15%;
		right: 10%;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .close-on {
		top: -5%;
		right: 0;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .save-picture {
		width: 324upx;
		height: 73upx;
		border: 1px solid rgba(255, 255, 255, 1);
		border-radius: 37upx;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 73upx;
		text-align: center;
		margin: auto;
		margin-top: 40upx;
	}

	.uni-page-body .uni-popup-middle .version-popup .upgrade {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-notic {
		position: absolute;
		color: #666666;
		margin: 0 15%;
		top: 48%;
		text-align: center;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-btn {
		position: absolute;
		bottom: 15%;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-btn .btn {
		width: 60%;
		height: 80upx;
		line-height: 80upx;
		margin: 0 auto;
		background: linear-gradient(to bottom right, #ff6333, #ff4335);
		color: #FFFFFF;
		text-align: center;
		border-radius: 30upx;
	}

	/* 小程序分享 */
	.mp-share-warp .title_on {
		text-align: center;
		border-top: 1upx solid #C8C7CC;
		padding: 8upx;
	}

	.mp-share-warp .lists {
		display: flex;
		flex-direction: row;
		margin: 30upx 0;
	}

	.mp-share-warp .list {
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx 0;
		background: #FFFFFF;
	}

	.mp-share-warp .list image {
		width: 100upx;
		height: 100upx;
	}

	.mp-share-warp .list text {
		margin-top: 20upx;
		height: 30upx;
		line-height: 30upx;
		font-size: 28upx;
	}

	.mp-share-warp button.list::after {
		border: none;
		border-radius: 0;
	}

	.mp-share-warp .mp-share-img {
		width: 280px;
		box-shadow: 0 10upx 20upx 0px rgba(61, 52, 75, 0.08);
		margin: 0 auto;
	}

	.mp-share-warp .btn-bar {
		margin: 10px;
	}

	/*顶级分类*/
	.page-top-category-body {
		height: 100%;
	}

	/*拼团*/
	.scroll-view-item .goods-info .currency-price ::v-deep .shopping-icon {
		width: 35upx;
		height: 35upx;
		display: inline-block;
		border-radius: 50%;
		margin: 0 5upx 0 0;
		vertical-align: bottom;
	}

	.add_new {
		position: absolute;
		top: 10upx;
		right: 50upx;
		font-size: 24upx;
		border-radius: 10upx;
		padding: 10upx 30upx;
		background-color: rgba(88, 88, 88, .8);
		color: #FFFFFF;
		z-index: 999999;
	}

	.add_on:before {
		content: "";
		width: 0;
		height: 0;
		border-left: 10upx solid transparent;
		border-right: 10upx solid transparent;
		border-bottom: 10upx solid rgba(88, 88, 88, .8);
		position: absolute;
		top: -9upx;
		z-index: 999999;
		right: 80upx;
	}

	.add_on text {
		font-size: 22upx;
		padding-left: 30upx;
		color: red;
	}

	.has_nav_container {
		height: 100%;
	}

	.main {
		height: calc(100% - 100upx);
	}

	.dsc_swiper {
		height: 100%;
	}

	.search_container {
		background-color: #ffffff;

		.status_bar {
			height: 20px;
			background-color: #ffffff;
			width: 100%;
		}

		.input_main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// padding: 16rpx 20rpx;
			padding: 11px 12px;
			/* #ifdef APP-PLUS */
			padding-top: 10rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			// padding-top: -10rpx;
			/* #endif */
			line-height: 0;
			background-color: #ffffff;
		}

		.input_view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// height: 70rpx;
			border-radius: 14rpx;
			color: #999;
			border: 2rpx solid #FE0302;
			background-color: #fff;
			/* #ifdef MP-WEIXIN */
			width: 510rpx;
			height: 64rpx;
			padding: 2rpx 4rpx 2rpx 10rpx;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			flex: auto;
			height: 70rpx;
			padding: 2rpx 4rpx 2rpx 20rpx;
			/* #endif */

			.placeholder_text {
				margin-top: -4rpx;
				font-size: 30rpx;
				margin-left: 20rpx;
				/* #ifdef MP-WEIXIN */
				width: 280rpx;
				/* #endif */
				/* #ifndef MP-WEIXIN */
				width: 400rpx;
				/* #endif */
			}

			.placeholder_texts {
				font-size: 28rpx;
				margin-left: 20rpx;
				background-color: #FE0302;
				color: #ffffff;
				border-radius: 14rpx;
				/* #ifdef H5 */
				padding: 8rpx 34rpx;
				/* #endif */
				/* #ifdef APP-PLUS */
				padding: 8rpx 34rpx;
				/* #endif */
				/* #ifdef MP-WEIXIN */
				// padding: 6rpx 26rpx;
				width: 80rpx;
				text-align: center;
				/* #endif */
			}
		}


		// 	.input_view {
		// 		flex: auto;
		// 		display: flex;
		// 		justify-content: space-between;
		// 		align-items: center;
		// 		height: 70rpx;
		// 		padding: 0 4rpx 0 30rpx;
		// 		border-radius: 14rpx;
		// 		color: #000000;
		// 		// border: 2rpx solid #FE0302;
		// 		background-color: #F9F9F9;

		// 		.placeholder_text {
		// 			font-size: 28rpx;
		// 			margin-left: 20rpx;
		// 		}

		// 		.placeholder_texts {
		// 			font-size: 28rpx;
		// 			margin-left: 20rpx;
		// 			background-color: #F9F9F9;
		// 			color: #000000;
		// 			border-radius: 10rpx;
		// 			padding: 4rpx 24rpx;
		// 		}
		// 	}


	}

	/* 以下是原有样式 */
	.search-not-home {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 99;
	}

	.search-not-home .mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		// background: linear-gradient(180deg, rgba(0, 0, 0, .8) 0, transparent);
		z-index: -1;
	}

	.position-fixed {
		position: fixed;
		top: 0;
		z-index: 998;
		width: 100%;
	}


	/*search*/
	.ms-search-wraper {
		position: relative;
		padding: 0 20upx;
	}

	.hot-search {
		padding-top: 0upx;
	}

	.ms-search-tags .text {
		color: #828282;
		padding: 2upx 20upx;
		display: inline-block;
		background-color: #EDEDED;
		border-radius: 50upx;
		font-size: 25upx;
		max-width: 200upx;
		margin: 0 15upx 15upx 0;
	}

	// 顶部切换
	.graying {
		color: #828282;
		font-size: 14px;
	}

	.darking {
		color: #000000;
		font-size: 16px;
	}

	.category-nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 10upx;
		background-color: #fff;
	}

	.category-nav .uni-swiper-tab {
		flex: 1;
		width: 80%;
		height: 72upx;
		line-height: 72upx;
		border: 0;
		/* #ifdef MP-WEIXIN */
		margin: 4rpx 16rpx 0rpx;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		margin: -10rpx 16rpx;
		/* #endif */
	}

	.category-nav .uni-swiper-tab .swiper-tab-list {
		font-size: 32rpx;
		color: #000000;
		position: relative;
	}

	.category-nav .uni-swiper-tab .swiper-tab-list.active {
		font-weight: 700;
		color: #FE0302;
	}

	.category-nav .uni-swiper-tab .swiper-tab-list.active::after {
		content: ' ';
		position: absolute;
		border-bottom: 4upx solid #FE0302;
		width: 60upx;
		height: 12upx;
		/* border-radius: 0 0 50% 50%/0 0 100% 100% ; */
		bottom: 0upx;
		left: calc(50% - 30upx);
		border-top: none;
	}

	.category-nav .category-filter {
		width: 10%;
		height: 72upx;
		line-height: 72upx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: -4px 0 4px -4px rgba(0, 0, 0, .4);
		color: #000000;
	}

	.category-nav .category-filter .text {
		height: 42upx;
		line-height: 42upx;
		margin: -7upx 0 0 10upx;
	}

	.position-fixed {
		position: fixed;
		top: 41px;
		z-index: 998;
		width: 100%;
	}

	::-webkit-scrollbar {
		display: none;
	}

	/* #ifdef APP-PLUS */
	.position-fixed {
		top: calc(41px + var(--status-bar-height));
	}

	/* #endif */
</style>