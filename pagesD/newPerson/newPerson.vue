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
			<image  src="https://images.eqingqu.com/attachs/photo/202508/20250830_5A0648394A3CE26E91865A143B6BEA20.png"></image>
		</view>
		<!-- <view class="clear-Both"></view> -->
		
		<!-- 没有活动图的占位 -->
		<!-- <view class="zhanewi " v-if="!imageObject.ad_code" style="margin-top: 240rpx;"></view>	 -->
		
		
		<!-- 提示   {{$t('lang.new_person_tip')}}      -->
		<x-skeleton :configs="configs" :loading="dscLoading">
			<view class="product-list-lie">
				<view class="list-title">
					<image src="https://images.eqingqu.com/attachs/photo/202508/20250830_FD344B27F5DD3684096846E4C554660B.png"></image>
					<text style="margin-left: 16rpx;">{{$t('lang.new_person_tip')}}  </text>
				</view>
				
				<!-- 一键领取 -->
				<view class="new-list">
				    <view class="top">
				      <text>{{$t('lang.new_person_activity')}}</text>
				      <text>{{$t('lang.new_person_ten')}} </text>
				    </view>
				    <view class="content">
				      <view class="two">
				        <view 
				          class="two-item" 
				          v-for="(item,index) in receiveData" 
				          :key='index'
				          :class="{ 'received': item.cou_is_receive, 'rotating': rotatingItems.includes(index) }"
				          @click="receiveCoupon(index)"
				        >
				          <view class="two-content">
				            <text class="two-amount">¥{{item.cou_money}}</text>
				            <text class="two-condition">满{{item.cou_man}}可用</text>
				          </view>
				        </view>
				      </view>
				    </view>
				    <view v-if="!allReceived" :class="{'fade-out': buttonDisappearing}">
				           <button v-if="buttonType"  @click="receiveAll">{{$t('lang.new_person_key')}} </button>
				       </view>
				  </view>
				
				<!-- 列表区域 -->
				<view class="umbrella-list" id="coupon-goods-list">
					<view v-for="(item, index) in cateGoodsList" :key="index" class="umbrella-item"
						@click="detailLink(item.goods_id)">
						<!-- 左侧 TOP 标识和图片区域 -->
						<view class="item-left">
							<image :src="item.goods_thumb" alt="umbrella" class="umbrella-img"></image>
						</view>
						<!-- 右侧信息区域 -->
						<view class="item-right">
							<text class="title">{{ item.goods_name }}</text>
							<view class="stats">
								<text class="people-tag">
									{{ item.attr_name }}
								</text>
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
							<view class="box">
								<currency-price class="price" :price="item.shop_price" :size="20"></currency-price>
								<image class="new-img" src="https://images.eqingqu.com/attachs/photo/202508/20250829_38B6A8B4CCFFEEA55C9363D0A017ED2C.png"></image>	
								<view class="right-text">
									<text>¥</text>
									<text>{{item.old_shop_price}}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 空状态（避免加载完成仍空白） -->
					<view v-if="!dscLoading && (!cateGoodsList || cateGoodsList.length === 0)" style="padding: 60rpx 0; text-align: center; color: #999;">
						暂无数据
					</view>
				</view>
				
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
	import { incrementVersion } from '@/utils/version.js';
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
					gridRows: 8,
					gridColumns: 1,	
					gridRowsGap: '32rpx',
					gridColumnsGap: '24rpx',
					itemDirection: 'row',
					itemGap: '24rpx',
					itemAlign: 'flex-start',
					headShow: true,
					headWidth: '180rpx',
					headHeight: '180rpx',
					textShow: true,
					textRows: 3,
					textRowsGap: '18rpx',
					textWidth: ['70%', '55%', '40%'],
					textHeight: ['32rpx', '24rpx', '24rpx'],
				},
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
				goodQuerysId:1,
				userGoodsList:[],
				buttonDisappearing: false,
				 allReceived: false,
				  receiveData:[],
				buttonType:false,
				rotatingItems: [], // 用于跟踪正在旋转的项
				   // receiveData: [
				   //        { cou_money: 10, cou_man: 10.01, received: false },
				   //        { cou_money: 10, cou_man: 10.01, received: false },
				   //        { cou_money: 10, cou_man: 10.01, received: false }
				   //      ]
			
			};
		},
		
		computed: {
			
		
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
			
			detailLink(id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
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
			drawHandle(id) {
				const version = incrementVersion();
				uni.request({
					url: this.websiteUrl + '/api/coupon/receive',
					method: 'POST',
					data: {
						cou_id: id,
						app_version: version
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						
						// 检查是否未登录（status === 'failed' 且 errors.code === 12）
						if (res.data.status === 'failed' && res.data.errors && res.data.errors.code == 12) {
							uni.showToast({
								title: res.data.errors.message || '用户未登录',
								icon: "none"
							});
							
							// 清除 token
							uni.removeStorageSync("token");
							
							// 跳转登录页面（增加 fromNewPerson 参数，标识来自新人优惠券页面）
							setTimeout(() => {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1&fromNewPerson=1'
								});
							}, 200);
							return;
						}
						
						let data = res.data.data
						uni.showToast({
							title: data.msg,
							icon: "none"
						});
			
						if (data.error == 1) {
							this.couponClick(this.status, 1)
						}
					}
				});
			},
			// 兼容旧调用：领取后刷新数据
			couponClick(status, type) {
				// 这里的 status/type 目前无实际分支，保持接口兼容
				this.newUserData();
			},
			receiveCoupon(index) {
			      // 点击后滚动到列表，方便立即去购买
			      this.scrollToGoodsList();
			
			      if (this.receiveData[index].cou_is_receive) return;
			      
			      const couId = this.receiveData[index]?.cou_id;
			      if (!couId) return;

			      // 调用单张领取接口
			      this.drawHandle(couId);

			      // 添加旋转动画标记
			      this.rotatingItems.push(index);
			      this.$forceUpdate();

			      // 动画结束后更新状态
			      setTimeout(() => {
			        this.$set(this.receiveData, index, {
			          ...this.receiveData[index],
			          cou_is_receive: true
			        });
			        // 移除旋转标记
			        const idx = this.rotatingItems.indexOf(index);
			        if (idx > -1) {
			          this.rotatingItems.splice(idx, 1);
			        }
			        // 检查是否全部已领取，更新按钮显示状态
			        this.checkAllReceived();
			        this.$forceUpdate();
			      }, 1000);
			    },
			
			// 滚动到商品列表区域（兼容各端，确保节点已渲染）
			scrollToGoodsList() {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery();
					query.select('#coupon-goods-list').boundingClientRect();
					query.selectViewport().scrollOffset();
					query.exec((res) => {
						const rect = res && res[0];
						const viewport = res && res[1];
						if (rect && viewport) {
							const target = Math.max(rect.top + viewport.scrollTop - 20, 0);
							uni.pageScrollTo({
								scrollTop: target,
								duration: 300
							});
						} else {
							// 兜底：直接使用 selector
							uni.pageScrollTo({
								selector: '#coupon-goods-list',
								duration: 300
							});
						}
					});
				});
			},
			    receiveAll() {
				const couIdStr = this.receiveData.map(item => item.cou_id).join(',');
				this.drawHandle(couIdStr)
			      this.receiveData.forEach((item, index) => {
			        if (!item.cou_is_receive) {
			          // 添加旋转动画标记
			          this.rotatingItems.push(index);
			      
			          setTimeout(() => {
			            this.$set(this.receiveData, index, {
			              ...item,
			              cou_is_receive: 1
			            });
			            // 移除旋转标记
			            const idx = this.rotatingItems.indexOf(index);
			            if (idx > -1) {
			              this.rotatingItems.splice(idx, 1);
			            }
			            // 检查是否全部已领取，更新按钮显示状态
			            this.checkAllReceived();
			          }, 1000);
			        }
			      });
				   // 设置按钮消失动画
				    this.buttonDisappearing = true;
				    setTimeout(() => {
				      // 基于实际数据计算，而不是直接设置为true
				      this.checkAllReceived();
				      this.buttonDisappearing = false;
				    }, 1000);
			    },
			
			checkAllReceived() {
			  this.allReceived = this.receiveData.every(item => item.cou_is_receive);
			},
			
			newUserData (){
				
					uni.showLoading({
						title: '加载中'
					})
				
				 this.$store.dispatch('setNewUserCoupons', {
					 app_version: incrementVersion()
				}).then(res => {
					uni.hideLoading()
					if (res.status == 'success') {
				
							uni.hideLoading()
						this.receiveStutas = true
						this.receiveData = res.data;
						console.log('新人优惠券信息',this.receiveData.length > 0)
						
						  // 过滤数据并判断buttonType
						      // 检查是否有任何一项的cou_user_num等于1
						      this.buttonType = this.receiveData.some(item => item.cou_user_num === 1);
						      // 初始化时检查是否全部已领取
						      this.checkAllReceived();
					}
				})
			
			},
			
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
				const version = incrementVersion();
					uni.request({
						url: this.websiteUrl + '/api/newuser/get_new_user_coupons_goods_list',
						method: 'GET',
						data: {
							keyword:this.searchKeywordsText,
							page: this.page,
							app_version: version
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							console.log(res.data)
							this.searchKeywords =false;
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
				let shareInfo
				// #ifdef H5
				shareInfo = {
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
				shareInfo = {
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
			this.newUserData()
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
			width: 100%;
			box-sizing: border-box;
			overflow-x: hidden;
			.list-title {
				width: 100%;
				height: 80rpx;
				background: #FFFAD5;
				border-radius: 28rpx 28rpx 0rpx 0rpx;
				z-index: 3;
				display: flex;
				justify-content:flex-start;
				align-items: center;
				padding: 12rpx 24rpx;
				box-sizing: border-box;
				overflow: hidden;
				.img2 {
					transform: rotate(180deg);
				}
				image {
					width: 36rpx;
					height: 36rpx;
					margin-top: 5rpx;
				}
				text {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #1B1B1B;
					line-height: 24rpx;
					text-align: left;
					font-style: normal;
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
	
	
	
	// 新人优惠
	.new-list {
	  padding: 20px;
	  background: #fff;
	}
	
	.top {
		display: flex;
		text-align: center;
		align-items: center;
	}
	
	.top text:first-child {
	  display: block;
	  font-size: 36rpx;
	  font-weight: bold;
	  color: #e9434f;
	  margin-right: 24rpx;
	}
	
	.top text:last-child {
	  font-size: 12px;
	  color: #999;
	}
	
	.two {
	  display: flex;
	  overflow-x: auto;
	  padding: 10px 0;
	  margin-bottom: 20px;
	}
	
	.two-item {
	  width: 204rpx;
	  height: 228rpx;
	  flex-shrink: 0;
	  margin-right: 20rpx;
	  background: url('https://images.eqingqu.com/attachs/photo/202508/20250830_0E8E6DDE591B1F429DC7F53802B59617.png') center/contain no-repeat;
	  display: flex;
	  flex-direction: column;
	  // justify-content: center;
	  // align-items: center;
	  transition: transform 1s;
	  position: relative;
	}
	
	.two-item.received {
	  background: url('https://images.eqingqu.com/attachs/photo/202508/20250830_45F9FE2562B1F9ADC7BEDFEFEC5F39F2.png') center/contain no-repeat;
	}
	
	.two-item.rotating {
	  animation: rotateY 1s forwards;
	}
	
	@keyframes rotateY {
	  0% { transform: rotateY(0); }
	  100% { transform: rotateY(1080deg); }
	}
	
	.two-content {
	  text-align: center;
	}
	
	.two-amount {
	  display: block;
	  font-size: 48rpx;
	  font-weight: bold;
	  color: #e9434f;
	  line-height:  48rpx;
	  margin-top:20rpx;
	}
	
	.two-condition {
	 font-family: PingFangSC, PingFang SC;
	 font-weight: 400;
	 font-size: 24rpx;
	 color: #4D4B4B;
	 line-height: 20rpx;
	 text-align: left;
	 font-style: normal;
	
	}
	
	button {
	  background: #FE2F02;
	  border-radius: 88rpx !important;
	 font-family: PingFangSC, PingFang SC;
	 font-weight: 500;
	 font-size: 36rpx;
	 color: #FFFFFF;
	 text-align: center ;
	 font-style: normal;
	  width: 100%;
	}
	.fade-out {
	    opacity: 0;
	    transition: opacity 1s ease-out;
	}
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
		// background: #FDDFC3;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		line-height: 28rpx;
		border-radius: 8rpx;
		text-align: right;
		font-style: normal;
		padding: 8rpx 0rpx;
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
	.box {
		display: flex;
		    align-items: center;
	}
	.price {
		font-size: 32rpx;
		color: #FE2F02;
		font-weight: bold;
		// margin-top: 10rpx;
	}
	.new-img {
		width: 98rpx;
		height: 36rpx;
		margin-right: 20rpx;
		margin-left: 20rpx;
		    margin-top: 10rpx;
		display: inline-block;
		vertical-align: bottom; 	
	}
	.right-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #A2A2A2;
		line-height: 24rpx;
		text-align: justify;
		font-style: normal;
		margin-top: 10rpx;
		 text-decoration: line-through;
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
</style>