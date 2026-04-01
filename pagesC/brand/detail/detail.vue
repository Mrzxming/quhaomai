<template>
	<view class="brand">
		<view class="brand-list-box">
			<view class="header">
				<view class="shop-top">
					<view class="b-img"><image :src="brandMsg.brand_logo" mode="widthFix"></image></view>
					<view class="b-con">
						<text class="name">{{brandMsg.brand_name}}</text>
						<text class="txt">{{$t('lang.owned_all')}} {{brandMsg.goods_count}} {{$t('lang.goods_letter')}}</text>
					</view>
				</view>
				<image :src="imagePath.shoppingInfoB" class="bg" mode="widthFix"></image>
			</view>
		</view>
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(item,index) in brandCategory" :key="index" class="swiper-tab-list" :class="cat_id == item.cat_id ? 'active' : ''" @click="tabCategory(item.cat_id)">{{item.cat_name}}</view>
		</scroll-view>
		<view class="shopping-list-nums">
			<view class="item" @click="tabNavNums()">
				<view class="num">{{ brandNavNums.all_goods }}</view>
				<text>{{$t('lang.all_goods')}}</text>
			</view>
			<view class="item" @click="tabNavNums('new')">
				<view class="num">{{ brandNavNums.new_goods }}</view>
				<text>{{$t('lang.new')}}</text>
			</view>
			<view class="item" @click="tabNavNums('hot')">
				<view class="num">{{ brandNavNums.hot_goods }}</view>
				<text>{{$t('lang.hot')}}</text>
			</view>
		</view>
		<view class="product-list-lie" v-if="!dscLoading">
			<dsc-product-list :list="brandProduct" :mode="mode" :productOuter="productOuter" v-if="brandProduct"></dsc-product-list>
		</view>
		
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
		
		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true"
			@fileterScrollTop="fileterScrollTop"></dsc-filter-top>
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import dscProductList from '@/components/dsc-product-list.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				brand_id:0,
				cat_id:0,
				type:'',
				page:1,
				size:10,
				mode:'grid',
				productOuter:true,
				showLoadMore: false,
				dscLoading:true,
				scrollLeft:0,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				scrollState:false,
				brandProduct:[]
			}
		},
		components:{
			dscProductList,
			dscCommonNav,
			dscFilterTop,
			uniLoadMore
		},
		computed:{
			...mapState({
				brandCategory: state => state.brand.brandCategory,
				brandMsg: state => state.brand.brandMsg,
				brandNavNums: state => state.brand.brandNavNums
			}),
		},
		methods: {
			fileterScrollTop(e) {
				//视图会发生重新渲染
				//当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			},
			brandDetail(){
				this.$store.dispatch('setBrandDetail',{
					brand_id:this.brand_id,
					cat:this.cat_id
				})
			},
			brandProductList(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
				
				//  this.$store.dispatch('setBrandProduct',{
				// 	brand_id:this.brand_id,
				// 	cat:this.cat_id,
				// 	sort:'',
				// 	type:this.type,
				// 	size:this.size,
				// 	page:this.page
				// })
				
				uni.request({
					url: this.websiteUrl + '/api/brand/goodslist',
					method: 'POST',
					data: {
						brand_id:this.brand_id,
						cat:this.cat_id,
						sort:'',
						type:this.type,
						size:this.size,
						page:this.page
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if(res.data.status == 'success'){
							if(res.data.data.length < 10){
								this.loadMoreStatus = 'noMore'
							}
							this.brandProduct = this.brandProduct.concat(res.data.data)
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			tabCategory(cat_id){
				this.cat_id = cat_id
				this.page = 1
				this.brandProduct = []
				this.loadMoreStatus = 'loading'
				this.brandProductList(1)
				this.brandDetail()
			},
			tabNavNums(val){
				this.type = val
				this.page = 1
				this.brandProduct = []
				this.loadMoreStatus = 'loading'
				this.brandProductList(1)
			},
		},
		onLoad(e){
			this.brand_id = e.id ? e.id : 0;
			
			this.brandDetail()
			this.brandProductList(1)
			this.showLoadMore = true
		},
		
		onPageScroll(e) {
			var that = this
					
			that.scrollState = e.scrollTop > 800 ? true : false

			// let to_scroll_top = e.scrollTop + 20

			// uni.createSelectorQuery().select('.product-list-lie').boundingClientRect((res) => {
			// 	let a = uni.getSystemInfoSync()
			// 	let t_height = res.height - a.screenHeight

			// 	if (t_height <= to_scroll_top) {
			// 		if (that.page * that.size == that.brandProduct.length) {
			// 			that.loadMoreStatus = 'loading';
			// 			console.log("这里")
			// 			that.page++
			// 			that.brandProductList()
			// 		} else{
			// 			that.loadMoreStatus = "noMore"
			// 		}
			// 	}
			// }).exec()
		},
		onReachBottom() {
			var that = this
			console.log("111")
			console.log(that.page * that.size)
			console.log(that.brandProduct.length)
			console.log(that.page * that.size == that.brandProduct.length)
			if (that.page * that.size == that.brandProduct.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				that.brandProductList()
			} else {
				console.log("22222222222222")
				that.loadMoreStatus = "noMore"
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesC/brand/detail/detail?id='+this.brand_id
			}
		},
		watch:{
			brandProduct(){
				this.dscLoading = false
			}
		}
	}
</script>

<style>
.brand-list-box{ padding: 0;}
.uni-swiper-tab{ background: #FFFFFF;}
.uni-swiper-tab .swiper-tab-list.active{ color: #f92028;}
.shopping-list-nums{ background: #FFFFFF; display: flex; flex-direction: row; }
.shopping-list-nums .item{ display: flex; flex: 1; width: 33.3%; flex-direction: column; justify-content: center; align-items: center; padding: 10upx 0;}
.shopping-list-nums .item .num{ font-size: 36upx;}
.shopping-list-nums .item text{ font-size: 25upx; color: #999999;}
</style>
