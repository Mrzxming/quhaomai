<template>
	<view class="uni-page-body" v-if='ru_id'>
		<!-- #ifdef APP-PLUS -->
		<!-- 自定义导航栏（防止系统导航栏移动） -->
		<view class="custom-navbar">
			<view class="status-bar"></view>
			<view class="navbar-content">
				<view class="navbar-back" @click="back">
					<uni-icons type="back" size="20" color="#000000"></uni-icons>
				</view>
				<view class="navbar-title">{{ shopInfo.rz_shop_name || '店铺首页' }}</view>
				<view class="navbar-right"></view>
			</view>
		</view>
		<!-- #endif -->
		
		<dsc-search :shopId="ru_id"></dsc-search>
		
		<!-- 占位：自定义导航栏 + 搜索框 -->
		<!-- #ifdef APP-PLUS -->
		<view style="height: 200px;"></view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<view style="height: 180rpx;"></view>
		<!-- #endif -->
		
		<!-- #ifndef APP-PLUS || MP-WEIXIN -->
		<view style="height: 120rpx;"></view>
		<!-- #endif -->
		
		<dsc-shop-signs :shopId="ru_id"></dsc-shop-signs>
		<dsc-line></dsc-line>
		<block v-for="(item,index) in modulesShop" :key="index">
			<dsc-slide v-if="item.module == 'slide'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-slide>
			<dsc-title v-if="item.module == 'title'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-title>
			<dsc-announcement v-if="item.module == 'announcement'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-announcement>
			<dsc-nav v-if="item.module == 'nav'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-nav>
			<dsc-line v-if="item.module == 'line'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-line>
			<dsc-blank v-if="item.module == 'blank'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-blank>
			<dsc-jigsaw v-if="item.module == 'jigsaw'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-jigsaw>
			<dsc-product v-if="item.module == 'product'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id" :prolist="prolist"></dsc-product>
			<dsc-coupon v-if="item.module == 'coupon'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-coupon>
			<dsc-count-down v-if="item.module == 'count-down'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-count-down>
			<dsc-store v-if="item.module == 'store'" :module="item.data" :preview="false" :modules-index="index" :shopId="ru_id"></dsc-store>
		</block>
		<dsc-shop-menu :shopId="ru_id"></dsc-shop-menu>
		
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<uni-load-more :status="loadMoreStatus" :content-text="contentText"></uni-load-more>
		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
		<dscCommonNav></dscCommonNav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniCountdown from "@/components/uni-countdown.vue"
	import uniPopup from '@/components/uni-popup.vue'
	
	// custom components
	import dscSlide from '@/pagesD/components/visualization/slide/Frontend'
	import dscTitle from '@/pagesD/components/visualization/title/Frontend'
	import dscAnnouncement from '@/pagesD/components/visualization/announcement/Frontend'
	import dscNav from '@/pagesD/components/visualization/nav/Frontend'
	import dscLine from '@/pagesD/components/visualization/line/Frontend'
	import dscBlank from '@/pagesD/components/visualization/blank/Frontend'
	import dscJigsaw from '@/pagesD/components/visualization/jigsaw/Frontend'
	import dscProduct from '@/pagesD/components/visualization/product/Frontend'
	import dscCoupon from '@/pagesD/components/visualization/coupon/Frontend'
	import dscCountDown from '@/pagesD/components/visualization/count-down/Frontend'
	import dscButton from '@/pagesD/components/visualization/button/Frontend'
	import dscSearch from '@/pagesD/components/visualization/search/Frontend'
	import dscStore from '@/pagesD/components/visualization/store/Frontend'
	import dscShopSigns from '@/pagesD/components/visualization/shop-signs/Frontend'
	import dscShopMenu from '@/pagesD/components/visualization/shop-menu/Frontend'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	import universal from '@/common/mixins/universal.js';
	import createPageTrackMixin from '@/common/mixins/pageTrackMixin.js';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	export default {
		mixins:[universal, createPageTrackMixin('shop')],
		components: {
			uniNavBar,
			uniIcons,
			uniCountdown,
			uniPopup,
			dscSlide,
			dscTitle,
			dscAnnouncement,
			dscNav,
			dscLine,
			dscBlank,
			dscJigsaw,
			dscProduct,
			dscCoupon,
			dscCountDown,
			dscButton,
			dscSearch,
			dscStore,
			dscShopSigns,
			dscShopMenu,
			dscCommonNav,
			dscFilterTop
		},
		data() {
			return {
				dscLoading:true,
				ru_id:'',
				modulesShop:[],
				prolist:[],
				scrollState:false,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				page:1,
				size:10,
				selectGoodsId:[]
			}
		},
		computed: {
		    ...mapState({
				shopInfo: state => state.shop.shopInfo,
		    }),
			// modulesShop: {
			// 	get() {
			// 		return this.$store.state.shop.modulesShop
			// 	},
			// 	set(val) {
			// 		this.$store.state.shop.modulesShop = val
			// 	}
			// },
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesD/shop/shopHome/shopHome?ru_id=' + this.ru_id
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
		      title: this.shopInfo.rz_shop_name,
		      query: {
		        key: ""
		      },
			  imageUrl: this.shopInfo.logo_thumb,
		    }
		},
		onLoad(e) {
			var that = this
			that.ru_id = e.ru_id;
			
			//#ifdef MP-WEIXIN
			uni.showShareMenu({
			  withShareTicket: true,
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
			
			let referer = uni.getStorageSync('platform').toLowerCase()
			if(uni.getStorageSync('platform') == 'MP-WEIXIN'){
				referer = 'wxapp'
			}
			
			//获取可视化信息
			// that.$store.dispatch('setHome',{
			// 	ru_id:that.ru_id,
			// 	type:'store',
			// 	device:referer
			// })
			uni.request({
				url: that.websiteUrl + '/api/app/home',
				method: 'GET',
				data: {
					ru_id:that.ru_id,
					type:'store',
					device:referer
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					console.log(res.data)
					that.dscLoading = false
					that.modulesShop = res.data.data
					if(res.data.data == null){
						that.selectGoodsId = []
						// that.prolist = []
						that.onProduct();
					}else{
						for(var i = 0;i<that.modulesShop.length;i++){
							if(that.modulesShop[i].module == 'product'){
								that.selectGoodsId = that.modulesShop[i].data.allValue.selectGoodsId
								that.onProduct();
							}
						}
					}
				},
				fail: (err) => {
					console.error(err)
				}
			})
		},
		onShow(e) {
			//this.modulesShop = []
		},
		onPullDownRefresh(){
			uni.showLoading({title: this.$t('lang.loading')});
			this.modulesShop = []
			
			this.initData();
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false
		
		},
		onReachBottom() {
			var that = this
			that.loadMoreStatus = 'more'
			that.onProduct()
		},
		methods: {
			getPageTrackTypeId() {
				return this.ru_id || ''
			},
			onProduct() {
				var that = this
				that.loadMoreStatus = 'loading'
				uni.request({
					// url: that.websiteUrl + '/api/visual/checked',
					url: that.websiteUrl + '/api/visual/shopchecked',
					method: 'POST',
					data: {
						page:that.page,
						number: that.selectGoodsId.length,
						goods_id: that.selectGoodsId.toString()
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data.data.length)
						if (res.data.data.length == 0) {
							that.loadMoreStatus = 'noMore'
						} else {
							that.loadMoreStatus = 'more'
						}
						if (that.page > 1) {
							that.prolist = that.prolist.concat(res.data.data)
						} else {
							console.log(that.selectGoodsId.length)
							console.log(that.selectGoodsId.toString())
							that.prolist = res.data.data
						}
						that.page = that.page + 1
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			initData(){
				setTimeout(() => {
					this.$store.dispatch('setHome',{
						ru_id:this.ru_id,
						type:'store'
					});
					
					uni.stopPullDownRefresh();
				}, 300);
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		},
		watch:{
			shopInfo(){
				// #ifndef APP-PLUS
				uni.setNavigationBarTitle({
					title: this.shopInfo.rz_shop_name
				});
				// #endif
			}
		}
	}
</script>

<style>
	/* 防止键盘弹起时页面上移，同时保持触底加载 */
	page {
		/* #ifdef APP-PLUS */
		min-height: 100vh;  /* 最小高度固定，防止缩小 */
		position: relative;
		/* #endif */
	}
	
	.uni-page-body{ 
		padding-bottom: 100upx;
		/* #ifdef APP-PLUS */
		min-height: 100vh;  /* 内容最小高度 */
		/* #endif */
	}
	
	/* 自定义导航栏样式 */
	.custom-navbar {
		/* #ifdef APP-PLUS */
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99999;
		background-color: #FFFFFF;
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		/* #endif */
	}
	
	.status-bar {
		/* #ifdef APP-PLUS */
		height: 40px;
		/* #endif */
	}
	
	.navbar-content {
		/* #ifdef APP-PLUS */
		display: flex;
		align-items: center;
		height: 44px;
		padding: 0 15px;
		position: relative;
		/* #endif */
	}
	
	.navbar-back {
		/* #ifdef APP-PLUS */
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* #endif */
	}
	
	.navbar-title {
		/* #ifdef APP-PLUS */
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 18px;
		font-weight: 500;
		color: #000000;
		/* #endif */
	}
	
	.navbar-right {
		/* #ifdef APP-PLUS */
		width: 44px;
		/* #endif */
	}
	
	.uni-page-body .uni-navbar-header .uni-navbar-header-btns:first-child{ width: 60upx; justify-content: center; padding-left: 12upx;}
	.uni-page-body .more-link{ display: flex; flex-direction: row; align-items: center; font-size: 25upx; }
	.uni-page-body .more-link .txt{ padding: 0 10upx 0 20upx; border-left: 1px solid #e3e8ee; line-height: 1.2; margin-left: 10upx;}
	.uni-page-body .more-link .uni-icon{ line-height: 1.8;}
	.uni-page-body .uni-popup-middle{ padding: 0; width: 80%; height: auto; background: none;}
	
	.uni-page-body .input-view .uni-icon{ display: block; }
</style>
