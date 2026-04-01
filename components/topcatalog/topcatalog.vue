<template>
	<view>
	<scroll-view class="top-catalog" scroll-y :lower-threshold="100" @scrolltolower="loadMore" :style="{'height':heightStyle}" :scroll-top="scrollTop" @scroll="onScroll">
		<block v-if="categoryData">
			<view class="category-secondary">
				<view class="item" v-for="(item,index) in categoryData.category" :key="index" @click="$outerHref('/pagesD/goodslist/goodslist?id=' + item.cat_id,'app')">
					<view class="box"><image :src="item.touch_icon" mode="widthFix" class="img"></image></view>
					<view class="name">{{item.cat_name}}</view>
				</view>
			</view>
			<view class="category-brand">
				<view class="title">{{$t('lang.brand_selection')}}</view>
				<!-- <view class="list">
					<view class="item" v-for="(item,index) in categoryData.brand" :key="index" @click="$outerHref('/pagesC/brand/detail/detail?id='+item.brand_id,'app')">
						<view class="box"><image :src="item.brand_logo" mode="widthFix" class="img"></image></view>
						<view class="name">{{item.brand_name}}</view>
					</view>
				</view> -->
				<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
					<view class="scroll-view-item" v-for="(item,index) in categoryData.brand" :key="index" @click="$outerHref('/pagesC/brand/detail/detail?id='+item.brand_id,'app')">
						<view class="item">
							<view class="box"><image :src="item.brand_logo" mode="widthFix" class="img"></image></view>
							<view class="name">{{item.brand_name}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="product-list-lie">
				<!-- <view style="font-size: 32upx; color: #000; padding: 20upx 0 0 40upx;">推荐商品</view> -->
				<view style="padding: 20upx 20upx 0 20upx;">
					<dsc-filter :filter="filter" :isPopupVisible="isPopupVisible" v-on:getFilter='handleFilter' @setPopupVisible="setPopupVisible"></dsc-filter>
				</view>
				
				<dsc-product-list :list="cateGoodsList" :mode="mode"></dsc-product-list>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
				<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true" @fileterScrollTop="fileterScrollTop"></dsc-filter-top>
			</view>
		</block>
		<block v-else>
			<uni-load-more :status="loadMoreStatus" :content-text="contentText" />
		</block>
		<!-- <dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true" @fileterScrollTop="fileterScrollTop"></dsc-filter-top> -->
		<view style="height: 200upx;"></view>
	</scroll-view>
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
						<view class="select-list" :class="{'active':item.sn == price_filter_sn}" v-for="(item,index) in grade" :key="index" @click="onPriceFilter(item)">
							<rich-text :nodes="item.price_range"></rich-text>
						</view>
					</view>
				</view>
				<view class="section" v-if="filter.brandResult.length > 0">
					<view class="title">
						<text>品牌</text>
						<view class="right-icon" @click="isPopupBrand = !isPopupBrand"><i class="iconfont" :class="[isPopupBrand ? 'icon-less' : 'icon-moreunfold']" v-if="filter.brandResult.length > 9"></i></view>
					</view>
					<view class="section-warp select-tabs">
						<view class="select-list" :class="{'active':filter.brandResultArr.includes(item)}" @click="onBrandResult(item)" v-show="index < 9 || isPopupBrand" v-for="(item,index) in filter.brandResult" :key="index">
							<text>{{ item.brand_name }}</text>
						</view>
					</view>
				</view>
				<view class="section" v-for="(item,index) in attribute" :key="index">
					<view class="title">
						<text>{{item.filter_attr_name}}</text>
						<view class="right-icon" @click="isAttribute(item.filter_attr_id)"><i class="iconfont" :class="[!attribute_id.includes(item.filter_attr_id) ? 'icon-less' : 'icon-moreunfold']"></i></view>
					</view>
					<view class="section-warp select-tabs" :class="[attribute_id.includes(item.filter_attr_id) ? 'hide' : 'show']">
						<view class="select-list" :class="{'active':filter.filter_attr[index] == attritem.goods_attr_id}" v-for="(attritem,attrindex) in item.attr_list" :key="attrindex" @click="onAttributeValue(attritem,index)">
							<text>{{attritem.attr_value}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="footer">
				<view class="btn-bar btn-bar-min">
					<view class="btn btn-white" @click="closeFilter">{{$t('lang.merchants_reset')}}</view>
					<view class="btn btn-red btn-bor-red" @click="submitFilter">{{$t('lang.confirm')}}</view>
				</view>
			</view>
		</view>
	</uni-drawer>
	</view>
</template>

<script>
import { mapState } from 'vuex'

import dscProductList from '@/components/dsc-product-list.vue'
import dscFilter from '@/components/dsc-filter.vue'
import uniDrawer from '@/components/uni-drawer.vue'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
//返回顶部
import dscFilterTop from '@/components/dsc-filter-top.vue'
export default{
	name:'top-catalog',
	props:{
		topCategoryCatid:{
			type:Number,
			default:0
		},
		jumpHeight:{
			type:Number,
			default:0
		}
	},
	components: {
		dscProductList,
		uniLoadMore,
		dscFilterTop,
		dscFilter,
		uniDrawer
	},
	data(){
		return {
			categoryData:{
				category:[
					{
						cat_id: 384,
						cat_name: "超薄套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611475583575020.png"
					},
					{
						cat_id: 387,
						cat_name: "颗粒套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611522833014324.png"  
					},
					{
						cat_id: 476,
						cat_name: "延时套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611489185421848.png"
					},
					{
						cat_id: 478,
						cat_name: "螺纹套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611649432469525.png"
					},
					{
						cat_id: 488,
						cat_name: "女用套",
						parent_id: 2,
						touch_icon: "https://images.eqingqu.com/images/202104/thumb_img/7077_thumb_G_1618338342324.jpg"
					},
					{
						cat_id: 489,
						cat_name: "液体套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/touch_icon/16792453982664.jpg"
					},
					{
						cat_id: 477,
						cat_name: "小号套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611792151274890.png"
					},
					{
						cat_id: 524,
						cat_name: "大号套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/touch_icon/16792454173028.jpg"
					},
					{
						cat_id: 466,
						cat_name: "狼牙/异形套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611502789444109.png"
					},
					{
						cat_id: 479,
						cat_name: "常规套",
						parent_id: 2,
						touch_icon: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/category_img/1646611456198506348.png"
					}
				],
				brand:[
					{
						brand_id: 7,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742016909970070.png",
						brand_name: "第六感"
					},
					{
						brand_id: 2,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598741890769121128.png",
						brand_name: "杜蕾斯"
					},
					{
						brand_id: 1,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598740633943397580.png",
						brand_name: "冈本"
					},
					{
						brand_id: 6,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742003504361750.png",
						brand_name: "杰士邦"
					},
					{
						brand_id: 13,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742157464725483.png",
						brand_name: "名流"
					},
					{
						brand_id: 14,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742169416104498.png",
						brand_name: "尚牌"
					},
					{
						brand_id: 3,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598741939730378209.png",
						brand_name: "倍力乐"
					},
					{
						brand_id: 33,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1629486669167355695.png",
						brand_name: "Dry well/涩井"
					},
					{
						brand_id: 10,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742058082415487.png",
						brand_name: "KEY"
					},
					{
						brand_id: 15,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742230480933164.png",
						brand_name: "其他品牌"
					},
					{
						brand_id: 53,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1629487032953571346.png",
						brand_name: "MINILOVE"
					},
					{
						brand_id: 19,
						brand_logo: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/brandlogo/1598742526997849626.png",
						brand_name: "取悦"
					}
				]
			},
			disabled:false,
			loading:true,
			page:1,
			size:10,
			footerCont:false,
			loadMoreStatus:'more',
			contentText: {
				contentdown: this.$t('lang.view_more'),
				contentrefresh: this.$t('lang.loading'),
				contentnomore: this.$t('lang.no_more')
			},
			showLoadMore: false,
			mode:'grid',
			scrollState:false,
			scrollTop:0,
			oldScrollTop:0,
			srollxd:true,
			scrollLeft: 0,
			
			queryObj:{},
			isFilter:true,
			isPopupVisible:false,
			filter:{
				sort:'goods_id',
				order:'desc',
				goods_num:'0',
				promote:'0',
				min:'',
				max:'',
				brand_id:[],
				brandResult:[],
				brandResultArr:[],
				self:'0',
				intro:'',
				filter_attr:[]
			},
			isPopupBrand:false,
			grade:[],
			attribute:[],
			attribute_id:[],
			price_filter_sn:null,
			
			// cateGoodsList:[
			// 	{
			// 		goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/thumb_img/2_thumb_G_1685576307803.jpg",
			// 		goods_name: "杜蕾斯Love大胆爱10只/3只装安全套12558",
			// 		shop_price: "5.70",
			// 		sales_volume: 57178,
			// 		goods_id: 4303
			// 	},
			// 	{
			// 		goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202207/thumb_img/22273_thumb_P_1657578154934.jpg",
			// 		goods_name: "冈本激薄3只装大盒【无条码】可做赠品爆品50007",
			// 		shop_price: "3.50",
			// 		sales_volume: 29318,
			// 		goods_id: 22273
			// 	},
			// 	{
			// 		goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202212/thumb_img/_thumb_P_1669941310749.jpg",
			// 		goods_name: "避孕套超薄进口两只装（有效期至2024年8月）成人用品情趣用品54001",
			// 		shop_price: "0.37",
			// 		sales_volume: 24077,
			// 		goods_id: 24178
			// 	},
			// 	{
			// 		goods_thumb:"https://images.eqingqu.com/images/202109/source_img/3742_P_1631665025289.jpg",
			// 		goods_name: "名流G点大颗粒致薄002安全套避孕套3只装超薄成人情趣13086",
			// 		shop_price: "1.40",
			// 		sales_volume: 41033,
			// 		goods_id: 3742
			// 	}
			// ]
		}
	},
	created(){
		this.cateGoodsList = [
			{
				goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/thumb_img/2_thumb_G_1685576307803.jpg",
				goods_name: "杜蕾斯Love大胆爱10只/3只装安全套12558",
				shop_price: "5.70",
				sales_volume: 57178,
				goods_id: 4303
			},
			{
				goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202207/thumb_img/22273_thumb_P_1657578154934.jpg",
				goods_name: "冈本激薄3只装大盒【无条码】可做赠品爆品50007",
				shop_price: "3.50",
				sales_volume: 29318,
				goods_id: 22273
			},
			{
				goods_thumb:"https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202212/thumb_img/_thumb_P_1669941310749.jpg",
				goods_name: "避孕套超薄进口两只装（有效期至2024年8月）成人用品情趣用品54001",
				shop_price: "0.37",
				sales_volume: 24077,
				goods_id: 24178
			},
			{
				goods_thumb:"https://images.eqingqu.com/images/202109/source_img/3742_P_1631665025289.jpg",
				goods_name: "名流G点大颗粒致薄002安全套避孕套3只装超薄成人情趣13086",
				shop_price: "1.40",
				sales_volume: 41033,
				goods_id: 3742
			}
		]
		this.load();
		this.selectBrand();
	},
	mounted(){

	},
	computed:{
		// ...mapState({
		// 	cateGoodsList: state => state.category.cateGoodsList
		// }),
		cateGoodsList:{
			get(){
				return this.$store.state.category.cateGoodsList
			},
			set(val){
				this.$store.state.category.cateGoodsList = val;
			}
		},
		heightStyle(){
			return "calc(100% - " + this.jumpHeight + "px)";
		}
	},
	methods:{
		handleTags(val){
			if(val == 'hasgoods'){
				this.filter.goods_num = this.filter.goods_num == 0 ? 1 : 0;
			}else{
				this.filter.promote = this.filter.promote == 0 ? 1 : 0;
			}
		},
		closeFilter(){
			this.filter.self = '0'
			this.filter.goods_num = '0'
			this.filter.promote = '0'
			this.filter.min = ''
			this.filter.max = ''
			this.filter.brand_id = []
			this.filter.brandResultArr = []
			this.filter.filter_attr = []
			this.price_filter_sn = null
			this.getGoodsList(1);
		},
		submitFilter(){
			this.isPopupVisible = false;
			this.getGoodsList(1);
		},
		selectBrand(){
			uni.request({
				url:this.websiteUrl + '/api/catalog/brandlist',
				method:'POST',
				data:{
					cat_id:this.cat_id,
					keywords:''
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					if(res.data.data.length > 0){
						this.filter.brandResult = res.data.data
					}
				}
			})
		},
		onBrandResult(item){
			let arr = [];
			if(this.filter.brandResultArr.includes(item)){
				this.filter.brandResultArr.splice(this.filter.brandResultArr.indexOf(item),1);
			}else{
				this.filter.brandResultArr.push(item);
			}
			
			this.filter.brand_id = this.filter.brandResultArr.map(v=>{ return v.brand_id });
		},
		switchChange(e){
			this.filter.self = e.detail.value == true ? 1 : 0
		},
		searchFocus(){
			let pages = getCurrentPages()
			if(pages.length > 1){
				if(pages[pages.length - 2].route == 'pagesD/search/search'){
					uni.navigateBack()
				}else{
					uni.navigateTo({
						url:'/pagesD/search/search',
					})
				}
			}
		},
		isAttribute(id){
			if(this.attribute_id.includes(id)){
				this.attribute_id.splice(this.attribute_id.indexOf(id),1);
			}else{
				this.attribute_id.push(id);
			}
		},
		onPriceFilter(item){
			this.price_filter_sn = item.sn;
			this.filter.min = item.start;
			this.filter.max = item.end;
		},
		onAttributeValue(item,index){
			this.filter.filter_attr.splice(index,1,item.goods_attr_id);
		},
		setPopupVisible(val){
			this.isPopupVisible = val;
			
			if(this.isPopupVisible){
				//价格区间
				uni.request({
					url:this.websiteUrl + '/api/catalog/grade',
					method:'GET',
					data:{
						cat_id:this.cat_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.grade = res.data.data;
						}
					}
				})
				//属性列表
				uni.request({
					url:this.websiteUrl + '/api/catalog/attribute',
					method:'GET',
					data:{
						cat_id:this.cat_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.attribute = res.data.data;
				
							for(let index of this.attribute){
								this.filter.filter_attr.push(0)
							}
						}
					}
				})
			}
		},
		handleFilter(o){
			this.filter.sort = o.sort;
			this.filter.order = o.order;
		
			this.getGoodsList(1);
		},
		onScroll(e) {
			this.scrollState = e.detail.scrollTop > 800 ? true : false
			this.oldScrollTop = e.detail.scrollTop;
		},
		fileterScrollTop(e){
			//视图会发生重新渲染
			this.scrollTop = this.oldScrollTop
			console.log(this.scrollTop)
			//当视图渲染结束 重新设置为0
			this.$nextTick(() =>{
				this.scrollTop = 0
			});
		},
		getGoodsList(page){
			if(page){
				this.page = page
				this.size = 50
			}
			this.loadMoreStatus = "loading"
			if(this.filter.promote == 1){
				this.filter.intro = 'promote'
			}else{
				this.filter.intro = ''
			}
			this.showLoadMore = true
			this.$store.dispatch('setGoodsList',{
				cat_id:this.topCategoryCatid,
				brand:this.filter.brand_id,
				warehouse_id:'0',
				area_id:'0',
				min:this.filter.min,
				max:this.filter.max,
				filter_attr:this.filter.filter_attr,
				ext:'',
				goods_num:'',
				size:this.size,
				page:this.page,
				sort:this.filter.sort,
				order:this.filter.order,
				self:this.filter.self,
				intro:this.filter.intro,
			})
			this.loadMoreStatus = "noMore"
		},
		load(){
			this.categoryData = ''
			this.loadMoreStatus = "loading"
			uni.request({
				url: this.websiteUrl + '/api/visual/visual_second_category',
				method: 'GET',
				data: {
					cat_id:this.topCategoryCatid
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					this.categoryData = res.data.data;
					this.getGoodsList(1);
				},
				fail: (err) => {
					console.error(err)
				}
			})
		},
		loadMore() {
			var that = this
			console.log("111")
			if(that.page * that.size == that.cateGoodsList.length){
				that.loadMoreStatus = 'loading';
				that.page ++
				that.getGoodsList(1)
			}else{
				setTimeout(()=>{
					that.loadMoreStatus = "noMore"
					that.showLoadMore = false
				},2000)
				return;
			}
		}
	},
	watch:{
		topCategoryCatid(){
			this.cateGoodsList = [];
			this.load();
		}
	}
}
</script>

<style scoped lang="scss">
.top-catalog{ height: 100%; box-sizing: border-box;}
.category-secondary{display: flex; flex-direction: row; flex-wrap: wrap; border-radius: 20upx; padding: 20upx 0;}
.category-secondary .item{ width: 20%; }
.category-brand{ background-color: #fff; border-radius: 20upx; margin:0 20upx;}
.category-brand .title{ font-size: 32upx; color: #000; padding: 20upx 40upx 20upx 40upx; }
.category-brand .list{ display: flex; flex-direction: row; flex-wrap: wrap; }
.category-brand .list .item{ width: 25%; }
.category-brand .list .item .box{ width: 110upx; }

.item{ display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin-bottom: 20upx;}
.name{ font-size: 25upx; }
.box { display: flex; flex-direction: row; justify-content: center; align-items: center; width: 150upx;}
.box .img{ width: 72%; border-radius: 10rpx;}

.product-list{ padding: 8upx 8upx 0; }
.scroll-view{
    overflow: visible;
}
.scroll-view-item{
    display: inline-block;
    width: 20%;
	margin: 0 0 0 2%;
    background-color: #fff;
    overflow: hidden;
    border-radius: 20upx;
    /* box-shadow:1upx 5upx 20upx 0 rgba(108,108,108,0.2); */
}

/*筛选*/
	.show-popup-filter{
		background: #f4f4f4;
		height: 100%;
	
		.top{
			height: calc(100% - 120rpx);
		}
	
		.section{
			padding: 10px;
			background: #fff;
	
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				text{
					font-weight: 700;
					color: #000;
					font-size: 16px;	
				}
	
				.right-icon{
					.iconfont{
						font-size: 14px;
						margin-right: 5px;
					}
				}
			}
	
			.section-warp{
				margin-top: 10px;
				&.price-filter{
					display: flex;
					flex-direction: row;
					align-items: center;
	
					.input{
						width: 40%;
						background: #f2f2f2;
						border-radius: 20px;
						height: 40px;
						text-align: center;
	
						input{
							width: 100%;
							background: transparent;
							height: 100%;
							text-align: center;
							font-size: 14px;
						}
					}
	
					.hang{
						margin: 0 10px;
						height: 1px;
						background: #000;
						width: 10px;
					}
				}
				
				&.select-tabs{
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
	
					.select-list{
						width: calc(33.3% - 6px);
						box-sizing: border-box;
						margin: 0 9px 10px 0;
						padding: 0;
	
						text,rich-text{
							padding: 5px;
							background: #f2f2f2;
							text-align: center;
							display: block;
							border-radius: 40px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							border:1px solid transparent;
						}
	
						&:nth-child(3n){
							margin-right: 0;
						}
	
						&.active{
							text,rich-text{
								border-color: #e93422;
								color: #e93422;
								background-color: #faeeec;
							}
						}
					}
				}
				
				&.hide{
					display: none;
				}
			}
		}
	
		.footer{
			position: absolute;
			bottom: 102rpx;
			left: 0;
			right: 0;
			background: #fff;
			.btn-bar{
				.btn{
					border-radius: 50px;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 16px;
					
					&.btn-red{
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
