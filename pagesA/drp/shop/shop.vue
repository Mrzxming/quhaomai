<template>
	<view class="container">
		<view class="header">
			<view class="bg-img">
				<image :src="drpShopData.shop_info.shop_img" mode="widthFix" v-if="drpShopData.shop_info.shop_img">
				</image>
				<view class="model-box"></view>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="share" :data-shopid="drpShopData.shop_info.id"
					:data-userid="drpShopData.shop_info.user_id">分享</button>
				<!-- #endif -->
			</view>
			<view class="cont">
				<view class="left">
					<image :src="drpShopData.shop_info.shop_portrait" v-if="drpShopData.shop_info.shop_portrait">
					</image>
					<image :src="imagePath.userDefaultImg" v-else></image>
				</view>
				<view class="right">
					<view class="tit">{{drpShopData.shop_info.shop_name}}</view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<view class="item" :class="{'active':status === 1}" @click="tabNav(1)">
				<view class="iconfont icon-pailie"></view>
				<view class="tit">{{$t('lang.all')}}</view>
			</view>
			<view class="item" :class="{'active':status === 2}" @click="tabNav(2)">
				<view class="iconfont icon-remenzhuanti"></view>
				<view class="tit">{{$t('lang.new')}}</view>
			</view>
			<view class="item" :class="{'active':status === 3}" @click="tabNav(3)">
				<view class="iconfont icon-cuxiao1"></view>
				<view class="tit">{{$t('lang.promotion')}}</view>
			</view>
		</view>
		<view style="height: 16rpx;"></view>
		<view class="searchs">
			<view class="search" @click.stop="clickyj('server')">
				<view class="" v-if="showmore==false" style="min-width: 220rpx;">
					{{yjindex==2?'佣金从高到低':'佣金从低到高'}}
					<image src="../../../static/toparrow.png" mode="widthFix" v-if="yjindex==2"
						style="width: 20rpx; height: 12rpx;margin-left: 16rpx;transform: rotate(180deg);"></image>
					<image src="../../../static/toparrow.png" mode="widthFix" v-else
						style="width: 20rpx; height: 12rpx;margin-left: 16rpx;"></image>
				</view>
				<view class="" v-else style="min-width: 220rpx;color: #FE0302;">
					{{yjindex==0?'佣金排序':yjindex==2?'佣金从高到低':'佣金从低到高'}}
					<image src="../../../static/redarrow.png" mode="widthFix"
						style="width: 20rpx; height: 12rpx;margin-left: 16rpx;"></image>
				</view>
			</view>
			<view class="input-view">
				<uni-icons type="search" size="20" color="#666666"></uni-icons>
				<input confirm-type="search" class="input" type="text" v-model="keywords"
					placeholder-style="color:#A2A2A2" placeholder="请输入关键词" @input="KeyInput" @confirm="confirm" />
			</view>
			<uni-popups ref="server" type="bottom">
				<view class="btnend">
					<image class="close_img" src="https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890133364.jpg" @click="yjclose('server')"></image>
					<view class="">
						<view class="btn_wrap" style="border-bottom: 2rpx solid #fafafa;" @click="yongjin(2,'server')"
							:class="{current:yjindex ===2}">
							佣金从高到低
						</view>
						<view class="btn_wrap " @click="yongjin(1,'server')" :class="{current:yjindex === 1}">
							佣金从低到高
						</view>
					</view>
				</view>
				<view class="cover" @click="yjclose('server')" catchtouchmove="true"></view>

			</uni-popups>
		</view>

		<view class="product-list-lie">
			<dsc-product-list :list="drpGoodsList" :routerName="routerName" v-if="drpGoodsList"></dsc-product-list>
		</view>
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="showLoadMore" />

		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>{{$t('lang.my_drp')}}</text>
			</navigator>
		</dsc-common-nav>

		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->


		<!-- 佣金遮罩层 -->
		<!-- <view class="seabtns" v-if="showmore">
			<view class="seabtn" @click="yongjin(2)" :class="{current:yjindex ===2}">
				佣金从高到低
			</view>
			<view class="seabtn" @click="yongjin(1)" :class="{current:yjindex === 1}">
				佣金从低到高
			</view>
		</view> -->


	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	import dscProductList from '@/components/dsc-product-list.vue'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';

	import universal from '@/common/mixins/universal.js';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';

	export default {
		mixins: [universal],
		data() {
			return {
				filtrateShow: false,
				status: 1,
				model: 0,
				shop_id: 0,
				parent_id: 0,
				active: 0,
				size: 10,
				page: 1,
				shop_user_id: 0,
				dscLoading: true,
				routerName: "drp",
				showLoadMore: true,
				loadMoreStatus: 'more',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showmore: false,
				yjindex: 0,
				keywords: '',
				isscroll: true,
			}
		},
		components: {
			uniIcons,
			uniLoadMore,
			dscProductList,
			dscCommonNav,
			dscNotContent,
			uniPopups
		},
		onUnload() {
			this.loadMoreStatus = 'more';
		},
		onReachBottom() {
			this.loadMoreStatus = 'loading';
			if (this.page * this.size == this.drpGoodsList.length) {
				this.page++
				this.drpGoods()
			} else {
				this.loadMoreStatus = "noMore"
				return;
			}
		},
		onLoad(e) {
			this.shop_id = e.shop_id;
			this.parent_id = e.parent_id;

			//小程序扫码
			if (e.scene) {
				let scene = decodeURIComponent(e.scene);
				this.shop_id = scene.split('.')[0];
				this.parent_id = scene.split('.')[1];
				uni.setStorageSync('parent_id', this.parent_id);
			}
		},
		onShow() {
			if (this.parent_id > 0) {
				uni.setStorage({
					key: 'parent_id',
					data: this.parent_id
				})
			}
			this.drpShop();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				return {
					title: this.$t('lang.this_is_my_drp'),
					path: '/pagesA/drp/shop/shop?shop_id=' + res.target.dataset.shopid + '&parent_id=' + res.target.dataset
						.userid
				}
			} else {
				return {
					title: this.$t('lang.this_is_my_drp'),
					path: '/pagesA/drp/shop/shop?shop_id=' + this.shop_id + '&parent_id=' + this.parent_id
				}
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.type == 'share') {
				let shareInfo = {
					// href:this.$websiteUrl + 'drp/shop?shop_id=' + this.drpShopData.shop_info.id + '&platform=APP',
					// title:this.$t('lang.this_is_my_drp'),
					href: 'https://www.ok9288.com/mobile/pagesA/drp/shop/shop?shop_id=' + this.drpShopData.shop_info
						.id + '&platform=APP',
					title: this.drpShopData.shop_info.shop_name,
					summary: this.drpShopData.shop_info.shop_share_intro,
					imageUrl: this.drpShopData.shop_info.shop_portrait
				};
				this.shareInfo(shareInfo)
			}
		},
		computed: {
			...mapState({
				drpShopData: state => state.drp.drpShopData,
			}),
			drpGoodsList: {
				get() {
					return this.$store.state.drp.drpGoodsList
				},
				set(val) {
					this.$store.state.drp.drpGoodsList = val
				}
			}
		},
		// mounted() {
		// 	var that = this
		// 	this.updateMaskStyle();
		// },
		methods: {
			yongjin(index, res) {
				var that = this
				that.yjindex = index
				this.drpGoods()
				this.$refs[res].close()
				that.keywords = ''
				that.showmore = false

			},
			yjclose(res) {
				var that = this
				this.$refs[res].close()
				that.keywords = ''
				// that.yjindex = 0
				that.showmore = false
			},
			confirm() {
				this.drpGoods()
			},
			KeyInput(e) {
				this.keyword = e.detail.value;
			},
			clickyj(res) {
				var that = this
				that.yjindex = that.yjindex
				this.showmore = !this.showmore
				if (this.showmore == true) {
					this.$refs[res].open()
				}
			},

			drpShop() {
				this.$store.dispatch('setDrpShop', {
					shop_id: this.shop_id
				})
			},
			//商品列表
			drpGoods(status) {
				this.$store.dispatch('setDrpGoodsList', {
					id: this.shop_id,
					uid: this.shop_user_id,
					size: this.size,
					page: this.page,
					status: this.status,
					model: this.model,
					commissionby: this.yjindex,
					keywords: this.keywords
				});
			},
			tabNav(val) {
				this.status = val
				this.drpGoods()
			},
		},
		watch: {
			drpShopData() {
				this.model = this.drpShopData.shop_info.type
				this.shop_user_id = this.drpShopData.shop_info.user_id
				this.drpGoods();
				this.dscLoading = false
				this.showLoadMore = false
			}
		}
	}
</script>


<style lang="scss">
	// 遮罩层
	// 弹框

	.btnend {
		width: 100%;
		padding: 20rpx 0rpx 50rpx;
		background: #fff;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		position: relative;

		.close_img {
			position: absolute;
			top: 2%;
			right: 4%;
			width: 44rpx;
			height: 44rpx;
		}
	}

	.btn_wrap {
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		border-radius: 34rpx;
		text-align: center;
		font-size: 34rpx;
		border-radius: 30rpx;
		color: #1B1B1B;

	}

	//old
	// .btn_wrap {
	// 	width: 324rpx;
	// 	height: 60rpx;
	// 	border-radius: 34rpx;
	// 	text-align: center;
	// 	font-size: 32rpx;
	// 	background: #e6e6e6;
	// 	border-radius: 30rpx;
	// 	color: #1B1B1B;
	// 	margin-left: 36rpx;

	// }

	.current {
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		border-radius: 30rpx;
		background: #FFFFFF;
		color: #FE0302;
		text-align: center;
	}

	.searchs {
		height: 50px;
		display: flex;
		background: #fff;
		padding: 0 10px;
		margin-top: 16rpx;
		align-items: center;
		position: relative;


		.input-view {
			background-color: #FFFFFF;
			border: 1px solid #e6e6e6;
			margin: 9px 9px 9px 0;
			line-height: 30px;
			background: #e6e6e6;
		}

		.search {
			background-color: #FFFFFF;
			width: 300rpx;
		}
	}



	.searchb {
		transition: height 1s ease;
		height: 240rpx;
		color: #FF010C;

	}

	.seabtns {
		width: 100%;
		height: 50px;
		// padding: 0 10px;
		display: flex;
		background: #fff;
		justify-content: space-between;
		align-items: center;
		// padding: 0rpx 32rpx 0rpx;
		// z-index: 99999;
		text-align: center;

		.seabtn {
			width: 308rpx;
			height: 60rpx;
			line-height: 60rpx;
			background: #e6e6e6;
			border-radius: 30rpx;
			color: #1B1B1B;

		}

	}

	/* 搜索框 */
	.header {
		position: relative;
	}

	.header .bg-img {
		width: 100%;
		height: 250upx;
		position: relative;
		overflow: hidden;
	}

	.header .bg-img image {
		width: 100%;
	}

	.header .bg-img .share {
		background: linear-gradient(to right, #FF010C, #FF7E0C);
		border-radius: 10px;
		padding: 0 25upx;
		font-size: 25upx;
		color: #ffffff;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		line-height: 2;
		// z-index: 99;
	}

	.header .model-box {
		background: rgba(0, 0, 0, 0.4);
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.header .cont {
		padding: 20upx;
		left: 0;
		right: 0;
		bottom: -80upx;
		position: absolute;
		display: flex;
	}

	.header .cont .left {
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		overflow: hidden;
	}

	.header .cont .left image {
		width: 100%;
		height: 100%;
	}

	.header .cont .right {
		margin-left: 20upx;
	}

	.header .cont .right .tit {
		color: #FFFFFF;
		font-size: 30upx;
	}

	.tabs {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 80upx 0 20upx;
		background: #FFFFFF;
	}

	.tabs .item {
		width: 33%;
		text-align: center;
	}

	.tabs .item .iconfont {
		font-size: 35upx;
		line-height: 1.5;
	}

	.tabs .item .tit {
		font-size: 30upx;
	}

	.tabs .item.active {
		color: #f92028;
	}
</style>