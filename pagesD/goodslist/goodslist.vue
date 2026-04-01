<template>
	<view class="container goodslist">
		<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<!-- 这里是状态栏 -->
			<view class="APP-PLUS" style="height: 80rpx;"></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="status_bar" style="height: 10rpx;"></view>
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
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
							style="width: 44rpx;height: 44rpx;">
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
						<input confirm-type="search" @keyup.enter="handleSearch($event)" v-model="keyValue" @input="KeyInput"
							@confirm="handleSearch($event)" class="input" type="search" :placeholder="placeholder" />
					</view>
					<view style="align-items: center;display: flex;flex-direction: row;">
						<text class="uni-icon" v-if="showClearIcon" @click="clearInput">&#xe434;</text>
						<!-- #ifdef H5 -->
						<image v-if="!showClearIcon" src="/pagesC/static/camera@2x.png" style="width: 44rpx;height: 40rpx;">
						</image>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<image v-if="!showClearIcon" src="/pagesC/static/camera@2x.png" style="width: 44rpx;height: 40rpx;" @click="chooseImage">
						</image>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<image v-if="!showClearIcon" src="/pagesC/static/camera@2x.png" style="width: 36rpx;height: 36rpx;" @click="chooseImage">
						</image>
						<!-- #endif -->
						<uni-icons type="search" size="22" color="#666666" class="right-icon right-search"
							@click="searchFocus"></uni-icons>
					</view>

				</view>


				<!-- 卡片展示方式 -->
				<!-- <text class="iconfont" @click="handleViewSwitch" :class="[mode === 'grid' ? 'icon-grid' : 'icon-list']"></text> -->
			</view>
			<!--下拉列表 -->
			<view class="isSelect-box" v-if="showClearIcon">
				<!-- 下拉列表 -->
				<scroll-view scroll-y="true">
					<view v-for="(item,index) in textArr" class="isSelect">
						<!-- 	<view :class="`rich-text-border${index === textArr.length - 1 ? ' no-bottom-border' : ''}`" -->
						<view :class="'rich-text-border' + (index === textArr.length - 1 ? ' no-bottom-border' : '')"
							@click="toShopgoods(item)">
							<image src="/static/search/sou.png" mode="widthFix"
								style="width: 32rpx;height: 32rpx;margin-right: 20rpx;min-width: 32rpx;"></image>
							<rich-text :nodes="item.text" class="rich-texts"></rich-text>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 综合 -->
			<view class="header">
				<!-- 		<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" :statusBar="false" fixed="false" leftState="false">
					<view class="input-view">
						<input confirm-type="search" disabled="true" @click="searchFocus" class="input" type="text" :placeholder="placeholder" />
						<uni-icons type="search" size="22" color="#666666" class="right-icon" @click="searchFocus"></uni-icons>
					</view>
					<view slot="right"><text class="iconfont" @click="handleViewSwitch" :class="[mode === 'grid' ? 'icon-grid' : 'icon-list']"></text></view>
				</uni-nav-bar> -->
				<dsc-filter :filter="filter" :isPopupVisible="isPopupVisible" :initial-active="initialActiveTab"
					v-on:getFilter='handleFilter' @setPopupVisible="setPopupVisible"></dsc-filter>
			</view>
			<!-- 智能 促销包邮tab-->
			<view class="nav-body">
				<view class="nav-new">
					<view class="nav-new-scroll">
						<view class="nav-label" :class="{'active':item.Selected}"
							v-for="(item,index) in filteredNavList" @click="navLabelClick(item,1)">
							{{item.name}}
						</view>
					</view>
				</view>
				<!-- <view class="filter-right" @click="handelFilterUp">
				
					<text class="iconfont icon-filter"></text>
					<text class="txt">{{$t('lang.filter')}}</text>
				</view> -->
			</view>
		</view>
		<view class="clear-Both"></view>


		<x-skeleton :configs="configs" :loading="loading1">
		<view class="product-list-lie" v-if="!dscLoading">
			<dsc-product-list :type="searchType" :is-search="true" :list="waterFallList" :allList="cateGoodsList" :mode="mode"
				v-if="waterFallList"></dsc-product-list>
			<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
		</view>
				</x-skeleton>
		<uni-drawer :visible="isPopupVisible" mode="right" @close="isPopupVisible = false">
		
			<view class="show-popup-filter">
				<!-- #ifdef MP-WEIXIN -->
				<view class="popup-title" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="popup-title" style="height: 45px;"></view>
				<!-- #endif -->
				<scroll-view class="scroll-view top" scroll-y="true">
					<view class="section" v-if="navList.length > 0">
						<view class="title">
							<text>服务/折扣</text>
						</view>
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':item.Selected}" @click="navLabelClick(item,0)"
								v-for="(item,index) in navListCopy" :key="index" v-if="item.moreName !=''">
								<text>{{ item.moreName }}</text>
							</view>
						</view>
					</view>
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
						<!-- <view class="section-warp Amount-body">
							<view class="AmountRange" :class="{'active':item.AmountF == filter.min && item.AmountE == filter.max}" v-for="(item,index) in AmountList" @click="changeAmount(item)">
								<view class="AmountRangeTop">
									{{item.AmountF}}-{{item.AmountE}}
								</view>
								<view class="AmountRangeBottom">
									{{item.title}}
								</view>
							</view>
						</view> 
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':item.sn == price_filter_sn}" v-for="(item,index) in grade" :key="index" @click="onPriceFilter(item)">
								<rich-text :nodes="item.price_range"></rich-text>
							</view>
						</view> -->
					</view>
					<view class="section" v-if="filter.brandResult.length > 0">
						<view class="title">
							<text>品牌</text>
						</view>
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':filter.brandResultArr.includes(item)}"
								@click="onBrandResult(item)" v-show="index < 9 || isPopupBrand"
								v-for="(item,index) in filter.brandResult" :key="index">
								<text>{{ item.brand_name }}</text>
							</view>
						</view>
					</view>

					<!-- <view class="section" v-if="filter.brandResult.length > 0">
						<view class="title">
							<text>品牌</text>
							<view class="right-icon" @click="isPopupBrand = !isPopupBrand"><i class="iconfont" :class="[isPopupBrand ? 'icon-less' : 'icon-moreunfold']" v-if="filter.brandResult.length > 9"></i></view>
						</view>
						<view class="section-warp select-tabs">
							<view class="select-list" :class="{'active':filter.brandResultArr.includes(item)}" @click="onBrandResult(item)" v-show="index < 9 || isPopupBrand" v-for="(item,index) in filter.brandResult" :key="index">
								<text>{{ item.brand_name }}</text>
							</view>
						</view>
					</view> -->
					<view class="section">
						<view class="title">
							<text>平台分类</text>
						</view>
						<view class="class-resule-style">
							<easy-select :options="classResult" ref="easySelect3" size="mini" :value="className"
								@selectOne="selectOne"></easy-select>
							<view style="width: 30rpx;"></view>
							<easy-selects :options="rightResult" ref="easySelect3" size="mini" :value="rightName"
								@selectOne="selectTwo"></easy-selects>
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

				<view class="footer">
					<view class="btn-bar btn-bar-min">
						<view class="btn btn-white" @click="closeFilter">
							<text class="btn-text">{{$t('lang.merchants_reset')}}</text>
						</view>
						<view class="btn btn-red btn-bor-red" @click="submitFilter">
							<text class="btn-text">{{$t('lang.confirm')}}</text>
						</view>
					</view>
				</view>
			</view>
		</uni-drawer>

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
import permision from "@/common/permission.js"
	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniDrawer from '@/components/uni-drawer.vue'
	import dscFilter from '@/components/dsc-filter.vue'
	import dscProductList from '@/components/dsc-product-list.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import tuiListCell from '@/components/list-cell/list-cell.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import easySelect from "@/components/easy-select/easy-select.vue"
	import easySelects from "@/components/easy-select/easy-selects.vue"
	export default {
		mixins: [universal],
		components: {
			uniNavBar,
			uniIcons,
			uniDrawer,
			dscFilter,
			dscProductList,
			dscCommonNav,
			dscFilterTop,
			uniLoadMore,
			tuiListCell,
			easySelect,
			easySelects
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
				keyValue:'',
				showClearIcon: false,
				textArr:[],
				waterFallList: [],
				searchType: 'click',
				initialActiveTab: '', // 存储解析后的关键字，
				keywordIsBestType: false, //首页进来的不传关键字
				vipSearchType: '',
				queryObj: '',
				disabled: false,
				loading: true,
				mode: 'grid',
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
					filter_attr: [],

				},
				isFilter: true,
				isPopupVisible: false,
				isPopupBrand: false,
				isPopupClass: false,
				swiperOption: {
					direction: 'vertical',
					slidesPerView: 'auto',
					freeMode: true
				},
				cat_id: 0,
				page: 1,
				size: 10,
				winHeight: 600,
				cou_id: 0,
				placeholder: this.$t('lang.enter_search_keyword'),
				dscLoading: true,
				grade: [],
				attribute: [],
				attribute_id: [],
				price_filter_sn: null,
				scrollState: false,

				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				cateGoodsList: [],
				heightssChat: 0,
				classResult: [],
				rightResult: [],
				leftIndex: 0,
				rightIndex: 0,
				className: '',
				rightName: '',
				gaodu: '',
				menuButtonInfo: {},
				navListCopy: [], //弹窗中筛选暂存，如果不点确定则重置
				navExternal: 1,
				navListSingleChoice: [], // 外侧单选
				inputValue: '',
				navList: [
					// 	{
					// 	name:'智能',
					// 	moreName:'',
					// 	value:'1',
					// 	Selected:true,
					// },{
					// 	name:'底价',
					// 	moreName:'底价',
					// 	value:'2',
					// 	Selected:false,
					// },
					{
						name: '促销',
						moreName: '促销',
						value: '10',
						Selected: false,
					}, {
						name: '黑卡专享',
						moreName: '好卖黑卡',
						value: '3',
						Selected: false,
					}, {
						name: '包邮',
						moreName: '包邮',
						value: '11',
						Selected: false,
					}, {
						name: '退货包运费',
						moreName: '退货包运费',
						value: '14',
						Selected: false,
					}, {
						name: '新品',
						moreName: '新品',
						value: '12',
						Selected: false,
					}, {
						name: '滞销换货',
						moreName: '滞销换货',
						value: '6',
						Selected: false,
					}, {
						name: '保价',
						moreName: '保价',
						value: '7',
						Selected: false,
					}, {
						name: '7天无理由',
						moreName: '7天无理由',
						value: '4',
						Selected: false,
					}, {
						name: '24小时发货',
						moreName: '24小时发货',
						value: '9',
						Selected: false,
					}, {
						name: '会员价',
						moreName: '会员等级专享',
						value: '8',
						Selected: false,
					},
					{
						name: '48小时发货',
						moreName: '48小时发货',
						value: '15',
						Selected: false,
					},
					{
						name: '积分',
						moreName: '积分',
						value: '16',
						Selected: false,
					},
					// {
					// 	name:'60天调换',
					// 	moreName:'60天调换',
					// 	value:'5',
					// 	Selected:false,
					// },{
					// 	name:'优选',
					// 	moreName:'优选',
					// 	value:'13',
					// 	Selected:false,
					// },
				],
				AmountList: [{
					AmountF: '0',
					AmountE: '40',
					title: '低价之选',
				}, {
					AmountF: '40',
					AmountE: '140',
					title: '经济划算',
				}, {
					AmountF: '140',
					AmountE: '240',
					title: '高档甄选',
				}, ]
			};
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesD/goodslist/goodslist?id=' + this.cat_id
			}
		},
		computed: {
			// ...mapState({  点击其中一项时设置selected设为true 同时其他的设false
			// 	cateGoodsList: state => state.category.cateGoodsList
			// }),
			filteredNavList() {
				return this.navListSingleChoice.filter(item => {
					return item.moreName !== '' && item.value !== '15' && item.value !== '16'// 双条件过滤
				})
			},
			checkedSelf() {
				return this.filter.self == '0' ? false : true
			}
		},
		onHide() {
		    this.fixIOSScrollBeforeLeave();
		},
		onUnload() {
		    this.fixIOSScrollBeforeLeave();
		},
		methods: {
			 fixIOSScrollBeforeLeave() {
			        // #ifdef H5 || MP-WEIXIN
			        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
			        if (isIOS) {
			            console.log('搜索页面离开：修复iOS滚动问题');
			            
			            // 强制所有输入框失焦
			            const inputs = document.querySelectorAll('input, textarea');
			            inputs.forEach(input => {
			                input.blur();
			                input.value = input.value; // 触发值更新但不改变内容
			            });
			            
			            // 重置页面滚动
			            setTimeout(() => {
			                window.scrollTo(0, 0);
			                // 触发全局修复事件
			                uni.$emit('ios-input-fixed');
			            }, 50);
			            
			            // 强制页面重排
			            setTimeout(() => {
			                const body = document.body;
			                body.style.minHeight = '100vh';
			                body.style.overflow = 'hidden';
			                setTimeout(() => {
			                    body.style.overflow = 'auto';
			                }, 10);
			            }, 100);
			        }
			        // #endif
			    },
			toShopgoods(item) {
				var that = this
				var val = item.text.replace(/<[^>]*>/g, '')
				that.keyword = val
				console.log(123, val)
				if (this.shopId > 0) {
					uni.navigateTo({
						url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + that.keyword +
							'&ru_id=' + this.shopId
					})
				} else {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=' + that.keyword
					})
				}
				//当前搜索 内容
				let arr = []
				let arr2 = this.latelyKeyword;
			
				if (this.keyword) {
					this.placeholder = this.keyword;
					this.placeholderState = 1;
			
					//和已存在搜索内容组合并去除重复项
					if (arr2) {
						arr2.unshift(this.keyword);
						arr = this.unique(arr2);
					}
				}
			
				if (arr.length > 0) {
					//存本地缓存
					uni.setStorage({
						key: 'LatelyKeyword',
						data: arr,
						success: (res) => {
							if (this.shopId > 0) {
								uni.navigateTo({
									url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this.keyword +
										'&ru_id=' + this.shopId
								})
							} else {
								uni.navigateTo({
									url: '/pagesD/goodslist/goodslist?keywords=' + this.keyword
								})
							}
						}
					})
				}
			
			},
			clearInput() {
				var that = this
				this.keyValue = ''
				that.showClearIcon = false
			},
			KeyInput(e) {
				var that = this
				this.keyword = e.detail.value;
				if (e.detail.value.length > 0) {
					this.showClearIcon = true
				} else {
					this.showClearIcon = false
				}
				uni.showLoading({
					title: '数据加载中'
				})
				uni.request({
					// url:this.websiteUrl + '/api/shop/config',
					url: 'https://www.ok9288.com/appsuggestions',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					data: {
						keyword: that.keyword,
					},
					success: (res) => {
						uni.hideLoading()
						if (res.data && res.data.length > 0) {
							var aa = res.data.map(item => ({
								text: item
							}));
							this.textArr = JSON.parse(JSON.stringify(aa))
							this.textArr.forEach((item, index) => {
								if (!(item.text.indexOf(this.keyword) == (-1))) {
									this.textArr[index].text = item.text.replace(this.keyword,
										`<span style="color:#FE0302 " >${this.keyword}</span>`)
								}
							})
						}
					}
				});
			},
			
			
			// 过滤更多筛选中如果没有外侧单选选中的项，则外侧不选中，如果有则保持
			filterNavList(navListCopy, navListSingleChoice) {
				// 提取所有 singleChoice 的 value 值，用于快速查找
				const singleChoiceValues = new Set(navListSingleChoice.map(item => item.value));

				return navListCopy.map(item => {
					if (item.Selected) {
						// 如果当前项的 value 不在 singleChoice 中，则取消选中
						if (!singleChoiceValues.has(item.value)) {
							return {
								...item,
								Selected: false
							};
						}
					}
					return item;
				});
			},

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
				
				// 如果是重新加载第一页，重置加载状态
				if (page == 1) {
					this.loading1 = true;
					this.dscLoading = true;
				}

				if (this.filter.promote == 1) {
					this.filter.intro = 'promote'
				} else {
					this.filter.intro = ''
				}
				// this.loadMoreStatus = "loading"
				this.showLoadMore = true
				if (this.queryObj.keywords) {
					// this.$store.dispatch('setGoodsList',{
					// 	keywords:this.queryObj.keywords,
					// 	brand:this.filter.brand_id,
					// 	min:this.filter.min,
					// 	max:this.filter.max,
					// 	filter_attr:this.filter.filter_attr,
					// 	goods_num:this.filter.goods_num,
					// 	size:this.size,
					// 	page:this.page,
					// 	sort:this.filter.sort,
					// 	order:this.filter.order,
					// 	self:this.filter.self,
					// 	intro:this.filter.intro,
					// 	cou_id:this.cou_id
					// })
					var abc = {
						keywords: this.initialActiveTab == 'is_best' || this.initialActiveTab =='daifa_one'? '' :this.keyValue ? this.keyValue : this.queryObj.keywords,
						brand: this.filter.brand_id,
						min: this.filter.min,
						max: this.filter.max,
						filter_attr: this.filter.filter_attr,
						goods_num: this.filter.goods_num,
						size: this.size,
						page: this.page,
						sort: this.filter.sort,
						order: this.filter.order,
						self: this.filter.self,
						intro: this.filter.intro,
						cou_id: this.cou_id,

					}
					console.log(this.navExternal)
					this.navList = this.navExternal == 1 ? this.navListSingleChoice : this.navListCopy
					const selectedItems = this.navList.filter(item => item.Selected);
					const selectedValues = selectedItems.map(item => item.value);
					const navObj = selectedValues.join(',');
					console.log(abc)
					console.log('this.initialActiveTab', this.initialActiveTab)
					console.log('this.initialActiveTab ', this.initialActiveTab == 'is_best' || 'daifa_one')
					uni.request({
						url: this.websiteUrl + '/api/catalog/goodslist',
						method: 'POST',
						data: {
							keywords: this.initialActiveTab == 'is_best' ||  this.initialActiveTab ==  'daifa_one'? '' : this.keyValue ? this.keyValue : this
								.queryObj.keywords,
							brand: this.filter.brand_id,
							min: this.filter.min,
							max: this.filter.max,
							filter_attr: this.filter.filter_attr,
							goods_num: this.filter.goods_num,
							size: this.size,
							page: this.page,
							sort: this.initialActiveTab == 'daifa_one'?'goods_id':this.filter.sort,
							order: this.filter.order,
							self: this.filter.self,
							intro: this.filter.intro,
							cou_id: this.cou_id,
							search_type: navObj,
							cat_id: this.cat_id,
							is_best: this.filter.sort == 'is_best' ? 1 : 0,
							daifa_one:this.initialActiveTab == 'daifa_one'?'daifa_one':'',
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							console.log(res.data)
						// 【方案1修复】延迟关闭骨架屏，确保数据渲染完成后再关闭
						// this.loading1=false; // 删除立即关闭
							this.keywordIsBestType = false
							if(	this.searchType  == 'click') {
								uni.pageScrollTo({
								       scrollTop: 0,
								       duration: 0 // 0 表示立即滚动
								     })
							}
							

						// share_money=1 跳转到分享赚钱
							if (res && res.data && res.data.data.share_money && res.data.data.share_money ==
								1) {
								uni.navigateTo({
									url: '/pagesD/shareMoney/sellingList?id=' + res.data.data.id +
										'&parent_id=' + res.data.data.parent_id,
								})
								uni.hideLoading()
								// uni.navigateTo({
								// 						url:'/pagesD/search/search',
								// 					})
							} else {
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

								// 【无缝衔接修复】先让内容准备好并渲染，确保在骨架屏淡出时内容已经在下方
								// 第一步：立即让内容区域显示（但还在骨架屏下方，因为 skeletonLoading 还是 true）
								this.dscLoading = false
								
								// 第二步：等待内容完全渲染完成（多个渲染周期 + 短暂延迟，确保 dsc-product-list 已处理完数据并开始渲染）
								this.$nextTick(() => {
									this.$nextTick(() => {
										// 增加短暂延迟，确保内容已开始渲染（dsc-product-list 的 distributeItems 需要时间）
										setTimeout(() => {
											// 第三步：内容已准备好，现在关闭骨架屏，让它开始淡出
											// 骨架屏淡出时（0.5秒），内容已经在 slot 中准备好了，淡出后立即显示
											this.loading1 = false
										}, 150) // 150ms 延迟，确保内容已开始渲染
									})
								})
								}
							}

						},
						fail: (err) => {
							console.error(err)
							this.loading1 = false;
							this.dscLoading = false;
							if (num) {
								uni.hideLoading()
							}
						}
					})
				} else {
					// this.$store.dispatch('setGoodsList',{
					// 	cat_id:this.cat_id,
					// 	brand:this.filter.brand_id,
					// 	min:this.filter.min,
					// 	max:this.filter.max,
					// 	filter_attr:this.filter.filter_attr,
					// 	goods_num:this.filter.goods_num,
					// 	size:this.size,
					// 	page:this.page,
					// 	sort:this.filter.sort,
					// 	order:this.filter.order,
					// 	self:this.filter.self,
					// 	cou_id:this.cou_id
					// })
					console.log(this.navExternal)
					this.navList = this.navExternal == 1 ? this.navListSingleChoice : this.navListCopy
					const selectedItems = this.navList.filter(item => item.Selected);
					const selectedValues = selectedItems.map(item => item.value);
					const navObj = selectedValues.join(',');
					uni.request({
						url: this.websiteUrl + '/api/catalog/goodslist',
						method: 'POST',
						data: {
							cat_id: this.cat_id,
							brand: this.filter.brand_id,
							min: this.filter.min,
							max: this.filter.max,
							filter_attr: this.filter.filter_attr,
							goods_num: this.filter.goods_num,
							size: this.size,
							page: this.page,
							sort: this.initialActiveTab == 'daifa_one'?'goods_id':this.filter.sort,
							order: this.filter.order,
							self: this.filter.self,
							search_type: navObj,
							cou_id: this.cou_id,
							daifa_one:this.initialActiveTab == 'daifa_one'?'daifa_one':'',
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							console.log(res.data)
						// 【方案1修复】延迟关闭骨架屏，确保数据渲染完成后再关闭
						// this.loading1=false; // 删除立即关闭
							if(	this.searchType  == 'click') {
								uni.pageScrollTo({
								       scrollTop: 0,
								       duration: 0 // 0 表示立即滚动
								     })
							}
						// share_money=1 跳转到分享赚钱
							if (res.data.share_money && res.data.share_money == 1) {
								uni.navigateTo({
									url: '/pagesD/shareMoney/sellingList?id' + res.data.id +
										'&parent_id=' + res.data.parent_id,
								})
							} else {
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

								// 【无缝衔接修复】先让内容准备好并渲染，确保在骨架屏淡出时内容已经在下方
								// 第一步：立即让内容区域显示（但还在骨架屏下方，因为 skeletonLoading 还是 true）
								this.dscLoading = false
								
								// 第二步：等待内容完全渲染完成（多个渲染周期 + 短暂延迟，确保 dsc-product-list 已处理完数据并开始渲染）
								this.$nextTick(() => {
									this.$nextTick(() => {
										// 增加短暂延迟，确保内容已开始渲染（dsc-product-list 的 distributeItems 需要时间）
										setTimeout(() => {
											// 第三步：内容已准备好，现在关闭骨架屏，让它开始淡出
											// 骨架屏淡出时（0.5秒），内容已经在 slot 中准备好了，淡出后立即显示
											this.loading1 = false
										}, 150) // 150ms 延迟，确保内容已开始渲染
									})
								})
								}
							}


						},
						fail: (err) => {
							console.error(err)
							this.loading1 = false;
							this.dscLoading = false;
							if (num) {
								uni.hideLoading()
							}
						}
					})
				}
			},
			async scanClick() {
				// #ifndef APP-PLUS
				uni.scanCode({
					success: (res) => {
						if (this.$isLogin()) {
							let result = JSON.parse(res.result);
							let sid = result.sid;
							let url = result.url;
							let timestamp = Date.parse(new Date()) / 1000;
							// console.log('scanCodescanCode', res)
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
				// var result1 = await permision.premissionCheck("EXTERNAL_STORAGE")
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
				// var result1 = await permision.premissionCheck("RECORD_AUDIO")
				// var result2 = await permision.premissionCheck("ACCESS_NETWORK_STATE")
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
			handleViewSwitch() {
				this.mode = this.mode === 'grid' ? 'list' : 'grid'
			},
			setPopupVisible(val) {
				this.isPopupVisible = val;
				// 
				// 使用value作为唯一标识符建立映射‌
				const copyItemsMap = new Map();
				this.navListCopy.forEach(item => {
					copyItemsMap.set(item.value, item); // 使用value作为键‌
				});

				// 同步选中状态逻辑
				this.navListSingleChoice.forEach(singleItem => {
					if (singleItem.Selected) {
						const targetItem = copyItemsMap.get(singleItem.value);
						if (targetItem) {
							targetItem.Selected = true; // 保持属性名一致性‌
						}
					}
				});


				// 

				console.log(val)
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
				console.log(o)
				this.filter.sort = o.sort;
				this.filter.order = o.order;
				this.searchType = 'click';
				this.getGoodsList(1, 1, this.searchType);
			},
			handleTags(val) {
				if (val == 'hasgoods') {
					this.filter.goods_num = this.filter.goods_num == 0 ? 1 : 0;
				} else {
					this.filter.promote = this.filter.promote == 0 ? 1 : 0;
				}
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
				this.cat_id = null
				this.className = ''
				this.rightName = ''
				this.getGoodsList(1, 1);
			},
			submitFilter() {
				this.isPopupVisible = false;
				this.searchType = 'click';
				// 对比过滤  this.navListCopy  ，this.navListCopy Selected
				this.navListSingleChoice = this.filterNavList(this.navListCopy, this.navListSingleChoice)
				console.log(this.navListSingleChoice)
				this.getGoodsList(1, 1, this.searchType);
			},
			selectBrand() {
				uni.request({
					url: this.websiteUrl + '/api/catalog/brandlist',
					method: 'POST',
					data: {
						cat_id: this.cat_id,
						keywords: this.queryObj.keywords
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

			selectClass() {
				uni.request({
					url: this.websiteUrl + '/api/visual/visual_category',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data.data)
						this.classResult = res.data.data
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			cateClick(cat_id) {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/visual/visual_second_category',
					method: 'GET',
					data: {
						cat_id: cat_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data.data.category)
						that.rightResult = res.data.data.category
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			selectOne(options) {
				this.className = options.cat_alias_name
				this.cat_id = options.cat_id
				this.cateClick(options.cat_id)
			},
			selectTwo(options) {
				var that = this
				that.rightName = options.cat_name
				that.cat_id = options.cat_id
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
			onClassResult(item) {
				this.cat_id = item.cat_id
				this.className = item.cat_alias_name
				this.cateClick(this.cat_id)
			},
			switchChange(e) {
				this.filter.self = e.detail.value == true ? 1 : 0
			},
			handleSearch(event, ) {
				this.searchType = 'click';
				let value = event.detail.value;
				// #ifdef MP-WEIXIN
				value = value.replace(/[\u3000]/g, ''); //
				// #endif
				this.keyValue = value.replace(/\s+/g, '');
				if (this.keyValue.length > 0) {
					this.showClearIcon = true  // 修正：有内容时应该显示清除图标
				} else {
					this.showClearIcon = false
				}
				// 重置加载状态和清空旧数据
				this.loading1 = true;
				this.dscLoading = true;
				this.cateGoodsList = [];
				this.waterFallList = [];
				this.page = 1;
				this.getGoodsList(1, 1, this.searchType);
				
			},
			searchFocus(e ) {
				if (this.keyword.length > 0) {
					this.showClearIcon = false
				} else {
					this.showClearIcon = true
				}
				// if (num == 0) {
					this.searchType = 'click';
					this.getGoodsList(1, 1, this.searchType);
				// } else {
				
				
				// 	let value = event.detail.value;
				
				// 	// #ifdef MP-WEIXIN
				// 	value = value.replace(/[\u3000]/g, ''); 
				// 	// #endif
					
				// 	this.inputValue = value.replace(/\s+/g, '');
				// 	console.log('触发搜索，关键词：', this.inputValue)
				// }
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
			navigateBack() {
				uni.navigateBack()
			},
			handelFilterUp() {
				this.navListCopy = JSON.parse(JSON.stringify(this.navList))
				this.isPopupVisible = true
			},
			//external表是是否抽屉外列表点击，抽屉外列表点击需要触发查询事件
			navLabelClick(item, external) {
				this.navExternal = external

				// 如果是外侧列表单选
				if (external == 1) {
					// this.navListSingleChoice = this.navListSingleChoice.map((val) => ({
					// 	...val,
					// 	Selected: val.value === item.value,
					// }));
					  this.navListSingleChoice = this.navListSingleChoice.map((val) => {
					            // 如果是当前点击的项
					            if (val.value === item.value) {
					                // 反选状态：如果已经是选中状态则取消，否则选中
					                return {
					                    ...val,
					                    Selected: !val.Selected
					                };
					            } else {
					                // 其他项保持未选中状态（维持单选逻辑）
					                return {
					                    ...val,
					                    Selected: false
					                };
					            }
					        });
					
					this.searchType = 'click';
					this.getGoodsList(1, 1, this.searchType);
				} else {
					if (item.value == 1) {
						this.navListCopy.forEach(element => {
							if (element.value == 1) {
								element.Selected = true;
							} else {
								element.Selected = false;
							}
						});
					} else {
						this.navListCopy.forEach(element => {
							if (element.value == item.value) {
								element.Selected = !element.Selected
							}
						});
						// 如果选中的数量大于1 就取消第一项
						// if(this.navListCopy.filter(item => item.Selected === true).length>1){
						// 	this.navListCopy[0].Selected = false
						// }
					}
					// 检查所有对象的Selected是否都为false
					const allSelectedFalse = this.navListCopy.every(item => !item.Selected);
					// 如果都是false，则将value为1的对象的Selected设置为true
					if (allSelectedFalse) {
						const itemWithValue1 = this.navListCopy.find(item => item.value == 1);
						if (itemWithValue1) {
							itemWithValue1.Selected = true;
						}
					}
				}


				console.log(this.navListCopy)
			},
			//修改金额 对比 this.navListCopy 和this.navListSingleChoice如果navListSingleChoice中的selected为true则将navListCopy中对应的项的selected为true
			changeAmount(item) {
				this.filter.min = item.AmountF
				this.filter.max = item.AmountE
			}
		},
		onLoad(e) {

			this.heightssChat = uni.getSystemInfoSync().windowHeight * 0.4;
			this.queryObj = e;
			this.cat_id = e.id;
			this.cou_id = e.cou_id;
			this.navListCopy = JSON.parse(JSON.stringify(this.navList))
			this.navListSingleChoice = JSON.parse(JSON.stringify(this.navList))
			if (this.queryObj.keywords) {
				this.placeholder = this.queryObj.keywords;
				
			
			}
			if(this.queryObj.type) {
				// 如果是首页的严选过来的  不能传keywords
				
				if (this.queryObj.type == '好卖严选') {
					this.initialActiveTab = 'is_best';
					this.filter.sort = 'is_best';
					this.keywordIsBestType = true
				} else if (this.queryObj.type == '一件代发') {
					// 待确认daifa_one
					this.initialActiveTab = 'daifa_one';
					// this.filter.sort = 'daifa_one';
					this.keywordIsBestType = true
					// this.initialActiveTab = 'yijian'; 
				}
				console.log('	this.keywordIsBestType', this.keywordIsBestType)
			}
			if (this.queryObj.search_type) {
				// 会员页面过来的需要选中对应search_type
				this.vipSearchType = this.queryObj.search_type;
				if(this.queryObj.search_type == '3' ) {
					// this.placeholder = '黑卡专享'
					// this.queryObj.keywords = '黑卡专享'
				}
				if(this.queryObj.search_type == '16' ) {
					// this.placeholder = '积分'
						// this.queryObj.keywords = '积分'
				}
				console.log('	this.vipSearchType', this.vipSearchType)
				this.navListSingleChoice.forEach(element => {
					if (element.value == this.vipSearchType) {
						element.Selected = !element.Selected
					}
				});
			}
			this.getGoodsList(1);
			this.winHeight = uni.getSystemInfoSync().screenHeight - 95;

			this.selectBrand();
			this.selectClass();
		},
		onPageScroll(e) {
			var that = this

			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.product-list-lie').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				if(res && res.height) {
					
			
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {

					if (that.page * that.size == that.cateGoodsList.length) {
						that.loadMoreStatus = 'loading';
						if(this.initialActiveTab == 'is_best' || 'daifa_one') {
							this.keywordIsBestType = true
						}
						console.log("这里")
						that.page++
						this.searchType = 'scroll'
						that.getGoodsList()
					}
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
				if(this.initialActiveTab == 'is_best' || 'daifa_one') {
					this.keywordIsBestType = true
				}
				that.page++
				this.searchType = 'scroll'
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
				// 【方案1修复】dscLoading 现在在接口成功回调中通过 $nextTick 设置，避免重复设置
				// 但保留这个 watch 作为兜底，只在没有通过接口回调设置时才设置
				// this.dscLoading = false
				// if(this.page * this.size != this.cateGoodsList.length){
				// 	this.loadMoreStatus = "noMore"
				// }
			},
			isPopupVisible() {
				if (this.isPopupVisible == false) {
					this.filter.self = '0'
					this.filter.goods_num = '0'
					this.filter.promote = '0'
					this.filter.min = ''
					this.filter.max = ''
					this.filter.brand_id = []
					// this.navListCopy.forEach(element => {
					// 		element.Selected = false
					// });
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 防止键盘弹起时页面移动（和首页一样的方案） */
	page {
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		position: relative;
		/* #endif */
	}
	
	.container {
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		/* #endif */
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

	/*筛选*/
	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #f8f8f8;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		right: 0 !important;
		transform: translateZ(0);
		/* #endif */
	}

	.status_bar {
		height: 90rpx;
		background-color: #f9f9f9;
		height: var(--status-bar-height);
		width: 100%;
	}
	.isSelect-box {
		position: absolute;
		width: 100%;
		height: 100vh;
		background: #fff;
		padding: 0 32rpx;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		transform: translateZ(0);
		/* #endif */
	}
	.chat_1 {
		margin-bottom: 12rpx;
		margin-right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifndef MP-WEIXIN */
		// width: 92%;
		width: 96%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 75%;
		padding: 0rpx 20rpx 0rpx 30rpx;
		/* #endif */

	}
	.isSelect {
		// margin-bottom: 10px;
	}
	
	.rich-text-border {
		border-top: 1px solid #EDEDED;
		padding: 30rpx 0 34rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		flex-wrap: nowrap;
	}
	
	.rich-texts {
		word-break: break-all;
		max-height: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
	
	.no-bottom-border {
		border-bottom: 1px solid #EDEDED;
		padding: 30rpx 0 34rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		flex-wrap: nowrap;
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

		.right-search {
			padding: 0 40rpx;
		}

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
		padding: 0 10rpx 0 26rpx;
		/*#endif*/
		height: 78rpx;
		font-size: 32rpx;
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


		width: 1410rpx;
		/* #ifdef MP */
		width: 1410rpx;
		/*#endif*/
		/*#ifdef APP-PLUS*/
		width: 1410rpx;
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

	.clear-Both {
		margin-top: 330rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 340rpx;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: 268rpx;
		/*#endif*/
	}

	.show-popup-filter {
		background: #fff;
		height: 100%;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		transform: translateZ(0);
		/* #endif */

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
						opacity: 0.7;
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
			/* #ifdef APP-PLUS */
			/* 防止键盘弹起时移动 */
			position: absolute !important;
			bottom: 0 !important;
			transform: translateZ(0);
			/* #endif */

			.btn-bar {
				.btn {
					border-radius: 50px;
					height: 80rpx;
					line-height: 100rpx;
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