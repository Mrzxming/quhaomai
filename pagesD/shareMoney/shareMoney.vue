<template>
	<view class="container ">
		<!-- 导航栏 start -->
		<view class="nav_bar skeleton" :style="{ backgroundColor: rgba,}">
			<!-- #ifndef MP-WEIXIN -->
			<!-- 这里是状态栏 -->
			<view class="status_bar"></view>
			<view class="nav_list">
				<view class="flex-start">
					<view class="nav_l" @click="toBack">
						<text class="iconfont icon-find-fanhui"></text>
					</view>
					<view class="fs32 co27">
						分享赚钱
					</view>
					<view class="nav-info fs24 textc" v-if="btnIndex!=2">
						{{currentWord}}
					</view>
				</view>
				<view class="nav_r">
					<view class="nav_l" @click="toQues">
						<image src="https://images.eqingqu.com/attachs/photo/202601/20260112_AFC7CB70360D268FF9CEF83EBA874DEB.png" mode="widthFix" style="width: 40rpx;">
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="wx_nav_bar" :style="{ paddingTop: `${menuButtonInfo.top}px` }">
				<view class="wx_nav_left" :style="{
            left: `${vw - menuButtonInfo.width - menuButtonInfo.left}px`,
            width: `${menuButtonInfo.width}px`,
            height: `${menuButtonInfo.height}px`,
            borderRadius: `${menuButtonInfo.height / 2}px`
          }">
					<text class="iconfont icon-find-fanhui" @click="toBack"></text>
					<text class="line"></text>
					<uni-icons type="bars" size="30" @click="showShortcut = !showShortcut"></uni-icons>
					<view class="shortcut" v-if="showShortcut">
						<view :class="['shortcut_item', index > 0? 'u-border-top' : '']"
							@click="$outerHref(item.path, 'app')" v-for="(item, index) in shortcutData" :key="index">
							<text :class="[item.ico]"></text>
							<text>{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 导航栏 end -->
		<!-- tab + 导航栏 start-->
		<view class="topbg" style="padding-left: 12px;">
			<image src="https://images.eqingqu.com/attachs/photo/202505/20250506_35F7BCD5C77FEE29331CA9AF731E8998.png" mode="widthFix" style="width: 100%; margin-bottom: -7px;"
				v-if="btnIndex == 0">
			</image>
			<view class="" v-else style="height: 30rpx;"></view>
		</view>
		<!-- 新建分享 -->
		<view class="content-body" v-if="btnIndex==0">
			<!-- 分享赚钱 -->
			<view class="tabbar bgc_fff" style="height: 100rpx;">
				<view v-for="(tab, index) in tabBars" :key="index"
					:class="['tab-item', tabstatus == index? 'active' : '']" @click="clickTab(index)">
					<text>{{ tab }}</text>
				</view>
			</view>
			<!-- 各个分类列表切换 -->
			<view class="product-list-lie" v-if="!dscLoading&&tabstatus==0" style="margin: 0 32rpx;">
				<!-- 爆品返利 -->
				<view class="product-list-lie" v-if="hotList.length > 0">
					<share-hot-list ref="hotRef" :list="hotList" :mode="mode" :loadMoreStatus="loadMoreStatus"
						@checkGoods="checkHot" v-if="hotList.length>0" />
				</view>
				<dsc-not-content v-if="hotList ==0"></dsc-not-content>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-else />
				<!-- 	<view class="product-list-lie" v-if="hotList.length > 0">
					<share-hot-list ref="hotRef" :list="hotList" :mode="mode" :loadMoreStatus="loadMoreStatus"
						@checkGoods="checkHot" v-if="hotList.length>0" />
					<dsc-not-content v-else></dsc-not-content>
				</view>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" /> -->
			</view>
			<view class="product-list-lie" v-if="!dscLoading&&tabstatus==1" style="">
				<!-- 达人清单 -->
				<view class="product-list-lie" v-if="expertList.length > 0">
					<share-expert-list ref="expertRef" :list="expertList" :mode="mode" :loadMoreStatus="loadMoreStatus"
						@checkGoods="checkExpert" v-if="expertList.length>0" />
				</view>
				<dsc-not-content v-if="expertList.length==0"></dsc-not-content>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-else />
			</view>
			<view class="product-list-lie" v-if="!dscLoading&&tabstatus==2" style="margin: 0 32rpx;">
				<!-- 已购买 -->
				<view class="product-list-lie" v-if="expertList.length > 0">
					<share-buy-list ref="buyRef" :list="buyList" :mode="mode" :loadMoreStatus="loadMoreStatus"
						@checkGoods="checkBuy" v-if="buyList.length>0" />
				</view>
				<dsc-not-content v-if="buyList.length==0"></dsc-not-content>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-else />
			</view>
			<view class=" product-list-lie" v-if="!dscLoading&&tabstatus==3" style="margin: 0 32rpx;">
				<!-- 采购车 -->
				<view class="product-list-lie">
					<share-cart-list ref="cartRef" :list="cartList" :mode="mode" :loadMoreStatus="loadMoreStatus"
						@checkGoods="checkCart" v-if="cartList.length>0" />
				</view>
				<dsc-not-content v-if="cartList ==0"></dsc-not-content>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-else />
			</view>
			<!-- <uni-load-more :status="loadMoreStatus" :content-text="contentText"
				v-if="page > 0 && showLoadMore" /> -->
			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
			<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
			<view class="" style="height: 245px;" v-if="isaddlist==true"></view>
		</view>

		<!-- 已分享 -->
		<view class="content-body1" v-if="btnIndex==1">
			<view class="product-list-lie" v-if="!dscLoading">
				<!-- <dsc-not-content v-if="!ownList || ownList.length<=0"></dsc-not-content> -->
				<share-own-list :list="ownList" :mode="mode" :loadMoreStatus="loadMoreStatus" @shareInfo="clickShare"
					v-if="ownList.length>0" />
				<dsc-not-content v-if="ownList.length ==0"></dsc-not-content>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-else />
			</view>
		</view>
		<!-- 总收益 -->
		<view class="content-body2" v-if="btnIndex==2">
			<!-- 总收益 -->
			<div class="accountzero bora24  " style="margin:0 12px 12px; background: linear-gradient( 303deg, #FE2F02 0%, #FC4C26 100%);
			box-shadow: inset 2rpx 2rpx 2rpx 0rpx #FFFFFF;">
				<view class="coff fs32 flex-between pore" style="padding: 4rpx 32rpx ; height: 76rpx;">
					<view class="flex-start " style="line-height: 44rpx;">
						<image src="/pagesC/static/my/coin.png" mode="widthFix" style="width: 44rpx;margin-right: 12rpx;">
						</image>
						<view class="fs500 fs32 ">我的钱包</view>
					</view>
					<image src="https://images.eqingqu.com/attachs/photo/202505/20250506_890537D664769A52EB76BDC7167A43E2.png" mode="widthFix"
						style="width: 140rpx; position: absolute;right: 32rpx; bottom: 0%; " />
					<!-- <uni-icons type="arrowright" size="13" color="#fff"></uni-icons> -->
				</view>

				<view class="purse-header-box">
					<view class="value">
						<view class="">
							<view class="co27 fs28 fs500 flex-start ">
								<span class="pr20">当前可提现</span>
								<navigator url="/pagesA/drp/withdrawLog/withdrawLog" hover-class="none"
									class="frozen-money small-money">
									提现明细
								</navigator>
							</view>
							<view class="money">
								<currency-prices :price="surplus_amount" :size="26"></currency-prices>
							</view>
						</view>
						<navigator url="/pagesA/drp/withdraw/withdraw" hover-class="none" class="frozen-money ">
							{{$t('lang.deposit')}}
						</navigator>
					</view>
				</view>
			</div>

			<!-- 分享数据 -->
			<view class="top-center">
				<view style="margin-bottom: 10px;font-weight: 500; ">
					分享数据 <span class="coa2 fs24 ml20">截止昨日数据 </span>
				</view>
				<view class="user-money-list bgc_fff bora14 coa2 fs24" style="">
					<navigator url="../bonus/bonus" class="money-item " hover-class="none">
						<div class="disf">浏览用户数
							<view class="flex-center" style="padding:8rpx 12rpx 12rpx;" @click="clickques">
								<image src="/static/share/grayques.png" mode="widthFix" style="width: 24rpx;" />
							</view>
						</div>
						<text class="user-money-list-item" v-text="drpdata.sale_total_money || 0"></text>
					</navigator>
	<!-- 				<navigator url="/pagesB/valueCard/valueCard" class="money-item " hover-class="none">
					
					<div>分享人数</div>
					<text class="user-money-list-item" v-text="drpdata.sum_count || 0"></text>
					</navigator> -->
					<view class="money-item " hover-class="none" @click="drpTeam">
						<div>分享人数</div>
						<text class="user-money-list-item" v-text="drpdata.user_count || 0"></text>
					</view>
				</view>
			</view>

			<!-- 全部收益 -->
			<view class="top-center" @click="tosaleorder">
				<view style="margin-bottom: 10px;font-weight: 500; " class="pr12">
					全部收益 <uni-icons type="arrowright" size="14" color="#272727"></uni-icons>
				</view>
				<view class="user-money-list bgc_fff bora14 " style="">
					<navigator url="../bonus/bonus" class="money-item " hover-class="none">
						<div>全部</div>
						<text class="user-money-list-item" v-text="setdrp.sale_total_money || 0"></text>
					</navigator>
					<navigator url="../valueCard/valueCard" class="money-item " hover-class="none">
						<div>已到账</div>
						<text class="user-money-list-item" v-text="setdrp.sale_total_money_has || 0"></text>
					</navigator>
					<view class="money-item ">
						<div>未到账</div>
						<text class="user-money-list-item" v-text="setdrp.sale_total_money_nohas || 0"></text>
					</view>
				</view>
			</view>

		</view>
		<!-- 底部按钮 -->
		<view class="flex-center">
			<view class="tab-botbtn">
				<view class="item" v-for="(item,index) in botbtn" @click="clickBtn(index)"
					:class="[ btnIndex == index? 'active' : '']">
					{{item}}
				</view>
			</view>
		</view>

		<!-- 新增/编辑清单弹框 -->
		<view v-if="isaddlist==true" style="position: fixed;bottom: 0%;left: 0%;width: 100%;">
			<view class="bot-bottom  " v-if="shareList.length>0">
				<view class="pore">
					<view class="title"> {{!editid?'新建分享清单':'编辑分享清单'}} </view>
					<uni-icons type="closeempty" size="22" color="#999999" @click="isaddlist=false"
						style="position: absolute;top: 0%;right: 0%;"></uni-icons>
				</view>
				<view class="bot-ipt">
					<view class="flex-start">
						<image src="/static/share/editgray.png" mode="widthFix" class="img36"></image>
						<input type="text" v-model="bottitle" placeholder="商品使用感受"
							style="text-align: left;margin-left: 20rpx;" />
					</view>
					<view class="mt10" @click="delbottitle">
						<image src="/pagesC/static/share/closes.png" mode="widthFix" class="img36"></image>
					</view>
				</view>
				<view class="flex-start" style="width: 100%; overflow-x: auto;">
					<view class="botimg pore" v-for="(item,index) in shareList" :key="index">
						<image :src="item.img" mode="widthFix" class="img"></image>
						<view class="" @click="delone(item.goods_id)" style="position: absolute;top: -9%;right: 0%;">
							<uni-icons type="closeempty" size="20" color="#ffffff"
								style="border-radius: 0rpx 16rpx 0 0;margin-top: -10px;background-color: #898989;" />
						</view>
					</view>
				</view>
				<view class="flex-between ">
					<view class="bot-left flex-center fs36 co62" @click="sharelistnull">清空</view>
					<view class="bot-right flex-center fs36  coff" @click="sharelistyes">确定保存 ({{shareList.length}})
					</view>
				</view>
			</view>
			<view class="bot-bottom " v-else>
				<view class="pore">
					<view class="title">新建分享清单</view>
					<uni-icons type="closeempty" size="22" color="#999999" @click="isaddlist=false"
						style="position: absolute;top: 0%;right: 0%;"></uni-icons>
				</view>
				<view class="bot-ipt">
					<view class="flex-start">
						<image src="/static/share/editgray.png" mode="widthFix" class="img36"></image>
						<input type="text" v-model="bottitle" placeholder="庆趣好卖清单" placeholder-class="co27 fs28"
							style="text-align: left;margin-left: 20rpx;" />
					</view>
					<view class="mt10" @click="delbottitle">
						<image src="/pagesC/static/share/closes.png" mode="widthFix" class="img36"></image>
					</view>
				</view>
				<view class="fs28 " style="min-height: 178rpx;margin-top: 32rpx;">
					请先选择要分享的商品哦~
				</view>
				<view class="flex-between ">
					<view class="bot-left flex-center fs36 co62" @click="sharelistnull">清空</view>
					<view class="bot-right flex-center fs36  coff" @click="sharelistyes">确定保存 ({{shareList.length}})
					</view>
				</view>
			</view>
		</view>


		<!--小程序分享-->
		<view class="show-popup-shareImg">
			<uni-popups :show="shareImgShow" ref="shareImgShow" type="bottom"  v-on:hidePopup="shareImgShow = false">
				
				<view class="mp-share-warp">
					<view class="title">
						<text>{{$t('lang.save_xaingce')}}</text>
						<uni-icon type="closeempty" size="30" color="#8f8f94" @click="shareImgShow = false"></uni-icon>
					</view>
					<view class="mp-share-img">
						<image :src="mpShareImg" mode="widthFix" class="img" @tap="previewImage" style="width: 100%;height: 100%;"></image>
					</view>
					<view class="btn-bar btn-bar-radius"><button class="btn btn-red"
							@click="downloadImg">{{$t('lang.save_picture')}}</button></view>
				</view>
			</uni-popups>
		</view>
		<!-- H5分享 -->
		<view v-if="shareImgShow_1">
			<view class="cover" @click="showRefundNoClose" catchtouchmove="true"></view>
			<view class="wxshare">
				
				<image v-if="mpShareImg" :src="mpShareImg" mode="widthFix" class="img" style="width: 100%;height: 100%;">
				</image>
			</view>
		</view>
		<!--自定义分享-->
		<uni-popups id="popupPoster" ref="popupPoster" type="bottom" >
			<view class="popup-poster">
				<view class="poster-image">
					<image :src="mpShareImg" mode="widthFix" class="img" style="z-index: 99999;"></image>
				</view>
				<view class="poster-btn">
					<view class="tit">{{$t('lang.share_to')}}</view>
					<view class="lists">
						<!-- #ifdef MP-WEIXIN -->
						<button class="list" open-type="share">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png"
								mode="widthFix"></image>
							<text>{{ $t('lang.share_with_friends') }}</text>
						</button>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view class="list" @click="posterAppShare('weixin')">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png"
								mode="widthFix"></image>
							<text>{{ $t('lang.share_with_friends') }}</text>
						</view>
						<view class="list" @click="posterAppShare('pyq')">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B5909313764D1D265E4DEF899458559.png"
								mode="widthFix"></image>
							<text>{{ $t('lang.generate_sharing_poster') }}</text>
						</view>
						<!-- #endif -->
						<view class="list" @click="downloadImg">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_65946CB61B087346EBA2A3375F81C2EB.png"
								mode="widthFix"></image>
							<text>{{ $t('lang.save_picture') }}</text>
						</view>
					</view>
					<view class="cancel" @click="popupPosterCancel">{{$t('lang.cancel')}}</view>
				</view>
			</view>
		</uni-popups>


	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import universal from '@/common/mixins/universal.js';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import dscFilterTop from '@/components/dsc-filter-top'
	import dscNotContent from '@/components/dsc-not-content.vue';

	import shareHotList from '@/pagesD/components/share-list/share-hot-list.vue'
	import shareExpertList from '@/pagesD/components/share-list/share-expert-list.vue'
	import shareBuyList from '@/pagesD/components/share-list/share-buy-list.vue'
	import shareCartList from '@/pagesD/components/share-list/share-cart-list.vue'
	import shareOwnList from '@/pagesD/components/share-list/share-own-list.vue'
	export default {
		mixins: [universal],
		components: {
			uniIcons,
			uniPopups,
			dscFilterTop,
			dscNotContent,
			uniLoadMore,
			shareHotList,
			shareExpertList,
			shareCartList,
			shareBuyList,
			shareOwnList,
		},
		data() {
			return {
				user_id: uni.getStorageSync('userInfo').id,
				menuButtonInfo: {},
				shareImgShow_1: false,
				eid: '',
				shareinfo: '',
				shareImgShow: false,
				mpShareImg: '',
				moneydetail: '',
				moneyimg: '',
				moneytitle: '',
				issellist: false,
				editid: '',
				noselect: '',
				selectHot: [],
				selectExpert: [],
				selectBuy: [],
				selectCart: [],
				currentIndex: 0,
				intervalId: null,
				userlist: [],
				articleId: '',
				intro_url: '',
				setdrp: {},
				btnIndex: 0,
				bottitle: '',
				isaddlist: false,
				shareList: [],
				queryObj: '',
				disabled: false,
				loading: true,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				mode: 'grid',
				scrollState: false,
				showLoadMore: false,
				list_all_checked: false,
				addprints: [],
				hotList: [],
				expertList: [],
				buyList: [],
				cartList: [],
				nowList: [],
				ownList: [],
				size: 10,
				page: 0,
				winHeight: 600,
				heightssChat: 0,
				dscLoading: true,
				rgba: '#FFEAC4',
				navIconRgba: '#FFEAC4',
				showSkeleton: false,
				showShortcut: false,
				navOpacity:0,
				navBar: '',
				tabstatus: '',
				shortcutData: [{
						name: this.$t('lang.home'),
						ico: 'iconfont icon-home-sy',
						path: '/pages/middles/middles'
					},
					{
						name: this.$t('lang.search'),
						ico: 'iconfont icon-sousuo',
						path: '/pagesD/search/search'
					},
					{
						name: this.$t('lang.category'),
						ico: 'iconfont icon-home-fenlei',
						path: '/pages/index/index'
					},
					{
						name: this.$t('lang.cart'),
						ico: 'iconfont icon-home-shop',
						path: '/pages/cart/cart'
					},
					{
						name: this.$t('lang.personal_center'),
						ico: 'iconfont icon-home-mine',
						path: '/pages/user/user'
					}
				],
				tabBars: [
					this.$t('lang.hot_rebate'),
					this.$t('lang.expert_ist'),
					this.$t('lang.share_buy'),
					this.$t('lang.share_cart')
				],
				botbtn: [
					this.$t('lang.add_share'),
					this.$t('lang.exist_share'),
					this.$t('lang.income_share'),
				],
			}
		},
		computed: {
			...mapState({
				drpdata: state => state.drp.drpData,
				goodsGuessList: state => state.shopping.goodsGuessList,
			}),
			currentWord() {
				return this.userlist[this.currentIndex] ? this.userlist[this.currentIndex] : '';
			},
			surplus_amount() {
				return this.drpdata.surplus_amount ? this.drpdata.surplus_amount : '0.00'
			}

		},
		watch: {
			sharePoster() {
				if (this.sharePoster) {
					this.$refs.popupPoster.open();
				}
			},
		},
		mounted() {
			this.startRotation();
		},
		onLoad(e) {
			uni.getPushClientId({
			  success: function (res) {
			    console.log('CID:', res.clientid); // 输出 CID
			  }
			});
			if (e) {
				this.editid = e.id
				this.tabstatus = e.tabstatus ? e.tabstatus : 0
				this.geteditlist(1)
			}
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// #endif
			this.winHeight = uni.getSystemInfoSync().screenHeight - 95;
			this.heightssChat = uni.getSystemInfoSync().windowHeight * 0.4;
			setTimeout(() => {
				this.$nextTick(() => {
					this.gethotlist(1)
					this.getexpertlist(1)
					this.getbuylist(1)
					this.getcartlist(1)
					this.getshareInfo()
				});
			}, 1000);
		},
		onShow() {
			setTimeout(() => {
				this.$nextTick(() => {
					this.$store.dispatch('setDrp')
					this.gethotlist(1)
					this.getexpertlist(1)
					this.getbuylist(1)
					this.getcartlist(1)
					this.getshareInfo()
				});
			}, 1000);
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20
			if (that.btnIndex == 1) {
				that.nowList = that.ownList
			} else {
				if (that.tabstatus == 0) {
					that.nowList = that.hotList
				} else if (that.tabstatus == 1) {
					that.nowList = that.expertList
				} else if (that.tabstatus == 2) {
					that.nowList = that.buyList
				} else if (that.tabstatus == 3) {
					that.nowList = that.cartList
				}
			}

			uni.createSelectorQuery().select('.content-body').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				if(res &&  res.height) {
					let t_height = res.height - a.screenHeight
					if (t_height <= to_scroll_top) {
						if (that.page * that.size == that.nowList.length) {
							that.loadMoreStatus = 'loading';
							console.log("这里")
							that.page++
							if (that.btnIndex == 1) {
								that.getownlist()
							} else {
								if (that.tabstatus == 0) {
									that.gethotlist()
								} else if (that.tabstatus == 1) {
									that.expertLithatst()
								} else if (that.tabstatus == 2) {
									that.buyList()
								} else if (that.tabstatus == 3) {
									that.cartList()
								}
							}
						} else {
							console.log(355, )
						}
					}
				}
				
			}).exec()


		},

		onReachBottom() {
			var that = this
			if (that.btnIndex == 1) {
				that.nowList = that.ownList
			} else {
				if (that.tabstatus == 0) {
					that.nowList = that.hotList
				} else if (that.tabstatus == 1) {
					that.nowList = that.expertList
				} else if (this.tabstatus == 2) {
					that.nowList = that.buyList
				} else if (that.tabstatus == 3) {
					that.nowList = that.cartList
				}
			}
			// console.log(7, that.page)
			// console.log(8, that.page * that.size)
			// console.log(0, that.nowList.length)
			if (that.page * that.size == that.nowList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				console.log(666, that.page)
				if (that.btnIndex == 1) {
					that.getownlist()
				} else {
					if (that.tabstatus == 0) {
						that.gethotlist()
					} else if (that.tabstatus == 1) {
						that.getexpertlist()
					} else if (that.tabstatus == 2) {
						that.getbuylist()
					} else if (that.tabstatus == 3) {
						that.getcartlist()
					}
				}
			} else {
				that.loadMoreStatus = "noMore"
			}

		},
		methods: {
			//下级会员
			drpTeam() {
				console.log(this.drpdata)
				uni.navigateTo({
					url:'/pagesA/drp/team/teamvip?parent_id=' + this.user_id
				})
			},
			showRefundNoClose() {
				this.shareImgShow_1 = false;
			
			},
			toTeam() {
				uni.navigateTo({
					url: '/pagesA/drp/team/team?parent_id=' + this.user_id
				})
			},
			tosaleorder() {
				uni.navigateTo({
					url: '/pagesA/drp/order/order?type=order'
				})
			},
			clickShare(info, id) {
				if (info) {
					console.log('info',info)
					this.shareinfo = info
					this.mpShareImg = this.shareinfo.imageUrl
				}
				if (id) {
					this.eid = id
				}
				this.onGoodsShare();
			},
			onGoodsShare(info) {
				if (this.$isLogin()) {
					uni.showLoading({
						title: this.$t('lang.loading')
					});
					// #ifdef MP-WEIXIN
					
					this.shareImgShow = true;
					this.$refs.shareImgShow.open();
					console.log(this.mpShareImg)
					// #endif
					// #ifdef APP-PLUS
					this.appShare();
					// #endif
					// #ifdef H5
					this.shareImgShow_1 = true
					// #endif
					uni.hideLoading();
				} else {
					uni.showModal({
						content: this.$t('lang.login_user_not'),
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
				this.sharePoster = false;
				// #endif
			},
			appShare() {
				console.log(333, this.eid)
				console.log(334, this.moneydetail)
				console.log(335, this.issellist)
console.log('this.mpShareImg', this.mpShareImg)
				let shareInfo = {}
				console.log(this.moneytitle)
				// if (!this.moneytitle) {
				if (this.moneytitle) {
					shareInfo = {
						href: this.websiteUrl + '/mobile/pagesD/shareMoney/sellingList?id=' + this.eid + '&platform=APP',
						// href: `${this.$websiteUrl}pagesD/shareMoney/sellingList?id=${this.eid}&platform=APP`,
						title: this.moneydetail.title,
						summary: this.moneydetail.intro,
						imageUrl: this.moneydetail.img_small,
						url:this.websiteUrl + '/mobile/pagesD/shareMoney/sellingList?id=' + this.eid + '&platform=APP'
					};
					console.log('ssstitle', shareInfo)
					this.mpShareImg = shareInfo.imageUrl;
					
				} else {
					console.log('this.shareinfo',this.shareinfo)
					shareInfo = {
						href: this.shareinfo.href,
						title: this.shareinfo.title,
						summary: this.shareinfo.summary,
						imageUrl:this.shareinfo.smallImageUrl,
						url:this.websiteUrl + '/mobile/pagesD/shareMoney/sellingList?id=' + this.eid + '&platform=APP'
					};
					console.log('sssinfo', shareInfo)
					this.mpShareImg = this.shareinfo.imageUrl;
				}
				
				
				console.log('sss', shareInfo)
				console.log('sssaa', this.mpShareImg)
				this.shareInfo(shareInfo, 'poster');
			},
			popupPosterCancel() {
				this.$refs.popupPoster.close();
				// #ifdef APP-PLUS
				this.sharePoster = false;
				// #endif
			},
			previewImage() {
				let that = this;
				let arr = [];
				arr.push(that.mpShareImg);
				uni.previewImage({
					current: 1,
					urls: arr,
					indicator: 'number',
					longPressActions: {
						itemList: [this.$t('lang.send_to_friend'), this.$t('lang.save_picture'), this.$t(
							'lang.collect')],
						success: function(data) {},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			downloadImg() {
				var that = this;
				uni.downloadFile({
					url: that.mpShareImg,
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.showToast({
									title: that.$t('lang.picture_saved_success'),
									icon: 'none',
									duration: 1000,
									success: () => {
										that.$refs.popupPoster.close();
										that.sharePoster = false;
									}
								});
							}
						});
					}
				});
			},
			posterAppShare(type) {
				let that = this;
				let scene = type == 'weixin' ? 'WXSceneSession' : 'WXSenceTimeline';
				if (that.eid) {
					uni.request({
						url: 'https://www.ok9288.com/api/drpnew/share_img_url',
						method: 'GET',
						data: {
							id: that.eid,
							share_platform: 'wechat'
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {},
						fail: (err) => {
							that.dscLoading = false;
							uni.showToast({
								title: '',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: '网络错误，请重试',
						icon: 'none'
					});
				}

				uni.share({
					provider: 'weixin',
					scene: scene,
					type: 2,
					imageUrl: that.mpShareImg
				});

				that.$refs.popupPoster.close();
				that.sharePoster = false;
			},
			startRotation() {
				this.intervalId = setInterval(() => {
					this.currentIndex = (this.currentIndex + 1) % this.userlist.length;
				}, 2000);
			},
			stopRotation() {
				clearInterval(this.intervalId);
				this.intervalId = null;
			},
			getredInfo(id) {
				console.log(339, id)
				uni.request({
					url: 'https://www.ok9288.com/api/drpnew/share_img_url',
					method: 'GET',
					data: {
						id: id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('redinfo', res)
						console.log('res.data.data.img', res.data.data.img)
						if (res.data.status == 'success') {
							let data = res.data.data
							var that = this
							that.moneydetail = res.data.data
							that.moneyimg = data.img
							that.moneytitle = data.title
							that.mpShareImg = res.data.data.img
						}
					},
					fail: (err) => {
						this.dscLoading = false
					}
				})
			},
			getshareInfo() {
				uni.request({
					url: 'https://www.ok9288.com/api/drpnew/get_drp_share_info',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.intro_url = res.data.data.intro_url
							this.userlist = res.data.data.userlist
						}
					}
				})
			},

			// 新建分享清单
			async sharelistyes() {
				if (!this.shareList || this.shareList.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择要分享的商品'
					})
					return;
				}
				if (!this.bottitle) {
					uni.showToast({
						icon: 'none',
						title: '说说使用感受'
					})
					return;
				}
				uni.showLoading({
					title: '努力加载中...',
					mask: true
				})
				const ids = this.shareList.map(item => item.goods_id);
				const data = {
					title: this.bottitle,
					goods_id: ids.join(',')
				}
				if (this.editid) {
					data.id = this.editid
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/create_order_godds',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.data.error = '0') {
							this.eid = res.data.data.data
							const processedValue = this.getredInfo(res.data.data.data);
							this.onGoodsShare(res.data.data.data);
							uni.showToast({
								title: res.data.data.msg,
								icon: 'success'
							})
						}
						this.editid = ''
						this.isaddlist = false
						this.shareList = []
						this.selectHot = []
						this.selectExpert = []
						this.selectBuy = []
						this.selectCart = []
						if (this.$refs.hotRef) {
							this.$refs.hotRef.clearChecked();
						}
						if (this.$refs.expertRef) {
							this.$refs.expertRef.clearChecked();
						}
						if (this.$refs.buyRef) {
							this.$refs.buyRef.clearChecked();
						}
						if (this.$refs.cartRef) {
							this.$refs.cartRef.clearChecked();
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: res.data.data.msg,
							icon: 'error'
						})
					}
				})
			},

			// 清空
			delbottitle() {
				this.bottitle = ''
			},
			sharelistnull() {
				this.shareList = []
				this.selectHot = []
				this.selectExpert = []
				this.selectBuy = []
				this.selectCart = []
				this.hotList.forEach(item => {
					item.checked = false;
				});
				this.expertList.forEach(item => {
					item.checked = false;
					if (item.goods_list) {
						item.goods_list.forEach(good => {
							good.checked = false;
						});
					}
				});
				this.buyList.forEach(item => {
					item.checked = false;
				});
				this.cartList.forEach(item => {
					item.checked = false;
				});
				if (this.$refs.hotRef) {
					this.$refs.hotRef.clearChecked();
				}
				if (this.$refs.expertRef) {
					this.$refs.expertRef.clearChecked();
				}
				if (this.$refs.buyRef) {
					this.$refs.buyRef.clearChecked();
				}
				if (this.$refs.cartRef) {
					this.$refs.cartRef.clearChecked();
				}
			},

			delone(id) {
				this.shareList = this.shareList.filter(item => item.goods_id !== id)
				uni.setStorageSync('sharelist', this.shareList)
				this.selectHot = this.selectHot.filter(item => item.goods_id !== id)
				// this.selectExpert = this.selectExpert.filter(item => item.goods_id !== id)
				this.selectBuy = this.selectBuy.filter(item => item.goods_id !== id)
				this.selectCart = this.selectCart.filter(item => item.goods_id !== id)
				this.selectExpert = this.selectExpert.filter(item => {
					if (item.goods_id === id) {
						return false;
					}
					if (item.goods_list) {
						return !item.goods_list.some(good => good.goods_id === id);
					}
					return true;
				});
				this.hotList.forEach(item => {
					if (item.goods_id == id) {
						item.checked = false
					}
				});
				this.expertList.forEach(item => {
					if (item.goods_list) {
						item.goods_list.forEach(good => {
							if (good.goods_id === id) {
								good.checked = false;
							}
						});
					}
				});
				this.buyList.forEach(item => {
					if (item.goods_id == id) {
						item.checked = false
					}
				});
				this.cartList.forEach(item => {
					if (item.goods_id == id) {
						item.checked = false
					}
				});
				if (this.$refs.hotRef) {
					this.$refs.hotRef.clearCheckedByIds(id);
				}
				if (this.$refs.expertRef) {
					this.$refs.expertRef.clearCheckedByIds(id);
				}
				if (this.$refs.buyRef) {
					this.$refs.buyRef.clearCheckedByIds(id);
				}
				if (this.$refs.cartRef) {
					this.$refs.cartRef.clearCheckedByIds(id);
				}
			},
			// 处理爆品返利列表的checkGoods事件
			checkHot(selectedInfo) {
				if (selectedInfo.deselected && selectedInfo.deselected.length > 0) {
					this.noselect = selectedInfo.deselected
					this.syncAllLists(this.noselect)
				} else if (selectedInfo.selected && selectedInfo.selected.length > 0) {
					this.selectHot = selectedInfo.selected;
					this.updateShareList()
				}
			},
			checkExpert(selectedInfo) {
				if (selectedInfo.deselected && selectedInfo.deselected.length > 0) {
					this.noselect = selectedInfo.deselected
					this.syncAllLists(this.noselect)
				} else if (selectedInfo.selected && selectedInfo.selected.length > 0) {
					this.selectExpert = selectedInfo.selected;
					this.updateShareList()
				}
			},
			checkBuy(selectedInfo) {
				if (selectedInfo.deselected && selectedInfo.deselected.length > 0) {
					this.noselect = selectedInfo.deselected
					this.syncAllLists(this.noselect)
				} else if (selectedInfo.selected && selectedInfo.selected.length > 0) {
					this.selectBuy = selectedInfo.selected;
					this.updateShareList()
				}
			},
			checkCart(selectedInfo) {
				if (selectedInfo.selected && selectedInfo.selected.length > 0) {
					this.selectCart = selectedInfo.selected;
					this.updateShareList()
					return
				} else if (selectedInfo.deselected) {
					this.noselect = selectedInfo.deselected
					this.syncAllLists(this.noselect)
				}
			},
			syncAllLists(delItem) {
				this.isaddlist = true;

				const lastDelItem = delItem.length > 0 ? delItem[delItem.length - 1] : null;
				if (!lastDelItem) {
					return;
				}
				this.selectHot = this.selectHot.filter(item => item.goods_id !== lastDelItem.goods_id);
				// this.selectExpert = this.selectExpert.filter(item => item.goods_id !== lastDelItem.goods_id);
				this.selectBuy = this.selectBuy.filter(item => item.goods_id !== lastDelItem.goods_id);
				this.selectCart = this.selectCart.filter(item => item.goods_id !== lastDelItem.goods_id);
				this.selectExpert = this.selectExpert.filter(item => {
					if (item.goods_id === lastDelItem.goods_id) {
						return false;
					}
					if (item.goods_list) {
						return !item.goods_list.some(good => good.goods_id === lastDelItem.goods_id);
					}
					return true;
				});

				const allSelected = [...this.selectHot, ...this.selectExpert, ...this.selectBuy, ...this.selectCart];
				const uniqueGoodsMap = new Map();
				allSelected.forEach(item => {
					if (!uniqueGoodsMap.has(item.goods_id)) {
						uniqueGoodsMap.set(item.goods_id, item);
					}
				});
				this.shareList = Array.from(uniqueGoodsMap.values());
			},
			// 获取所有选中值
			updateShareList() {
				this.isaddlist = true
				const allSelected = [...this.selectHot, ...this.selectExpert, ...this.selectBuy, ...this.selectCart];
				const uniqueGoodsMap = new Map();
				allSelected.forEach(item => {
					if (!uniqueGoodsMap.has(item.goods_id)) {
						uniqueGoodsMap.set(item.goods_id, item);
					}
				});
				this.shareList = Array.from(uniqueGoodsMap.values());
			},
			handleViewSwitch() {
				this.mode = this.mode === 'grid' ? 'list' : 'grid'
			},

			// 获取修改详情
			geteditlist(page) {
				var that = this
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/dagoodslist',
					method: 'GET',
					data: {
						page: this.page,
						id: this.editid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('getedit777', res.data.data)
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							this.isaddlist = true
							this.bottitle = res.data.data.dainfo.title
							for (var i = 0; i < res.data.data.goodslist.length; i++) {
								res.data.data.goodslist[i].checked = true
							}
							res.data.data.goodslist.forEach(item => {
								item.checked = false;
								this.shareList.push({
									goods_id: item.goods_id,
									img: item.goods_img,
									name: item.goods_name,
									checked: item.checked
								});
							});
							if (res.data.data.goodslist.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.expertList = this.expertList.concat(res.data.data.goodslist)
							} else {
								this.expertList = res.data.data.goodslist
							}
						}
						
						this.dscLoading = false
					},
					fail: (err) => {
						this.dscLoading = false
					}
				})
			},

			// 获取列表--爆品返利
			gethotlist(page) {
				let version = '3.8.4'
				var that = this
				if (page == 1 &&  this.hotList.length == 0) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/goodlist',
					method: 'GET',
					data: {
						page: this.page,
						app_version:version
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							for (var i = 0; i < res.data.data.goodslist.length; i++) {
								res.data.data.goodslist[i].checked = false
							}
							res.data.data.goodslist.forEach(good => {
								const isSelected = this.shareList.some(selected => selected
									.goods_id == good.goods_id);
								if (isSelected) {
									good.checked = true;
								}
							});
							if (res.data.data.goodslist.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.hotList = this.hotList.concat(res.data.data.goodslist)
							} else {
								this.hotList = res.data.data.goodslist
							}
							this.dscLoading = false
						}
					},
					fail: (err) => {
						console.log('hot', err)
						this.dscLoading = false
					}
				})
			},
			// 获取列表--爆品返利
			getexpertlist(page) {
				var that = this
				if (page == 1 ) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/orderlist',
					method: 'GET',
					data: {
						page: this.page,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						console.log('getexpert', res.data.data)
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							const processedCart = res.data.data.goodslist.map(item => {
								const newGoodsList = item.goods_list.map(goods => {
									let newGoods = {
										...goods,
										checked: false
									};
									const isSelected = this.shareList.some(selected => selected
										.goods_id === newGoods.goods_id);
									if (isSelected) {
										newGoods.checked = true;
									}
									return newGoods;
								});
								const isAllEmpty = newGoodsList.every(goods => {
									return (!goods.cou_name || goods.cou_name.length === 0) &&
										(!goods.integral || goods.integral === 0);
								});
								const goodsListWithFlag = newGoodsList.map(goods => {
									return {
										...goods,
										isall: isAllEmpty
									};
								});

								return {
									...item,
									goods_list: goodsListWithFlag
								};
							});
							res.data.data.goodslist = processedCart;

							if (res.data.data.goodslist.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.expertList = this.expertList.concat(res.data.data.goodslist)
							} else {
								this.expertList = res.data.data.goodslist
							}
						}
					},
					fail: (err) => {
						console.log('expert', err)
						this.dscLoading = false
					}
				})
			},

			// 获取已购买商品列表
			getbuylist(page) {
				var that = this
				if (page == 1 &&  this.buyList.length == 0) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/buylist',
					method: 'GET',
					data: {
						page: this.page
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						console.log('getbuy', res.data.data)
						if (res.data.status == 'success' && res.data.data.length > 0) {
							const isAllEmpty = res.data.data.every(item => {
								return (!item.cou_name || item.cou_name.length === 0) && (!item
									.integral || item.integral === 0);
							});

							for (let i = 0; i < res.data.data.length; i++) {
								res.data.data[i].checked = false;
								res.data.data[i].isall = isAllEmpty;
							}

							res.data.data.forEach(good => {
								const isSelected = this.shareList.some(selected => selected
									.goods_id == good.goods_id);
								if (isSelected) {
									good.checked = true;
								}
							});
							if (res.data.data.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.buyList = this.buyList.concat(res.data.data)
							} else {
								this.buyList = res.data.data
							}
						}
						this.dscLoading = false
					},
					fail: (err) => {
						this.dscLoading = false
					}
				})
			},

			// 获取购物车商品列表
			getcartlist(page) {
				var that = this
				if (page == 1 &&  this.cartList.length == 0) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				this.showLoadMore = true
				uni.request({
					url: this.websiteUrl + '/api/drpnew/cartlist',
					method: 'GET',
					data: {
						page: this.page
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						console.log('getcart', res.data.data)
						if (res.data.status == 'success' && res.data.data.length > 0) {
							const isAllEmpty = res.data.data.every(item => {
								return (!item.cou_name || item.cou_name.length === 0) && (!item
									.integral || item.integral === 0);
							});

							for (let i = 0; i < res.data.data.length; i++) {
								res.data.data[i].checked = false;
								res.data.data[i].isall = isAllEmpty;
							}

							res.data.data.forEach(good => {
								const isSelected = this.shareList.some(selected => selected
									.goods_id == good.goods_id);
								if (isSelected) {
									good.checked = true;
								}
							});
							if (res.data.data.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.cartList = this.cartList.concat(res.data.data)
							} else {
								this.cartList = res.data.data
							}
							this.dscLoading = false
						}
					},
					fail: (err) => {
						console.log('cart', err)
						this.dscLoading = false
						this.loadMoreStatus = 'default'
					}
				})
			},

			//获取已分享列表
			getownlist(page) {
				var that = this
				if (page == 1) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/orderlist',
					method: 'GET',
					data: {
						page: this.page,
						is_own: 1
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						console.log('getown', res.data.data)
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							if (res.data.data.goodslist.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							if (this.page > 1) {
								this.ownList = this.ownList.concat(res.data.data.goodslist)
							} else {
								this.ownList = res.data.data.goodslist
							}
							this.dscLoading = false
						}
					},
					fail: (err) => {
						console.log('own', err)
						this.dscLoading = false
					}
				})
			},

			clickTab(index) {
				var that = this
				this.tabstatus = index
				if (this.tabstatus == 0) {
					this.gethotlist(1)
				} else if (this.tabstatus == 1) {
					this.getexpertlist(1)
				} else if (this.tabstatus == 2) {
					this.getbuylist(1)
				} else if (this.tabstatus == 3) {
					this.getcartlist(1)
				}
			},
			// 点击底部按钮
			clickBtn(index) {
				var that = this
				this.btnIndex = index
				if (index == 1) {
					this.getownlist(1)
				}
			},
			clickques() {
				uni.showToast({
					icon: 'none',
					title: '浏览清单的用户人数'
				})
			},
			// 返回
			toBack() {
				uni.navigateBack()
			},
			toQues() {
				var url = JSON.stringify(this.intro_url)
				if (url.indexOf('http') != -1) {
					this.articleId = url.match(/-(\d+)\./)[1]
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		overflow-y: auto;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	// 总收益
	.content-body2 {
		width: 750rpx;
		min-height: 100%;
		background: linear-gradient(to bottom, #feeac6 5%, #F5F5F5 40%, );
		padding-bottom: 20px;
	}

	.accountzero .purse-header-box {
		padding: 40rpx 20upx;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, #FFFFFF 100%);
		box-shadow: inset 2rpx 2rpx 2rpx 0rpx #FFFFFF;
		border-radius: 20rpx;

		.value {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.money {
				font-size: 60upx;
				color: #FE2F02;
				margin-top: 20rpx;
			}

			.frozen-money {
				width: 230rpx;
				height: 76rpx;
				border-radius: 38rpx;
				border: 1rpx solid #FE2F02;
				font-size: 32rpx;
				line-height: 74rpx;
				color: #FE2F02;
				font-weight: 500;
				text-align: center;
				margin-bottom: 1rpx;
			}

			.small-money {
				width: 130rpx;
				height: 40rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				color: #FE2F02;
				font-weight: 500;
				text-align: center;
				line-height: 40rpx;
				margin-bottom: 1px;
			}
		}

	}

	.top-center {
		background-color: #FFFFFF;
		margin: 0 24rpx 20rpx;
		border-radius: 14rpx;
		// padding: 28rpx 0 28rpx 32rpx;
		padding: 24rpx 0 24rpx 32rpx;
		max-height: 212rpx;
		// padding: 0rpx 0 0 32rpx;

		.user-money-list-item {
			font-size: 40rpx;
			font-weight: 500;
			color: #272727;
		}

		.user-money-list {
			display: flex;
			flex-direction: row;


			.money-item {
				font-size: 24rpx;
				color: #626262;
				width: 33%;
			}

		}
	}

	// 新建分享/已经分享

	.topbg {
		
		/* #ifdef MP-WEIXIN */
		  margin-top: calc(150rpx + var(--status-bar-height));
		/* #endif
		margin-top: calc(88rpx + var(--status-bar-height));
		max-height: 50px;
		background-color: #FFEAC4;
	}

	.content-body {
		width: 750rpx;
		background: linear-gradient(to bottom, #FFFFFF -8%, #f6f6f6 100%);
		border-radius: 24rpx 24rpx 0 0;
		padding-bottom: 20px;
	}

	.content-body1 {
		// margin-top: -5px;
		width: 750rpx;
		min-height: 100%;
		background: linear-gradient(to bottom, #FFFFFF -8%, #f6f6f6 50%);
		border-radius: 24rpx 24rpx 0 0;
		padding-bottom: 20px;
	}

	.tabbar {
		display: flex;
		flex-direction: row;
		border-radius: 24rpx 24rpx 0 0;

		.tab-item {
			display: flex;
			flex: 1 1 0%;
			justify-content: center;
			align-items: center;
		}

		.tab-item text {
			position: relative;
			font-size: 28rpx;
			color: #626262;
		}

		.tab-item.active text {
			color: #272727;
			font-size: 28rpx;
			font-weight: 500;
		}

		.tab-item.active text:after {
			content: ' ';
			width: 90%;
			height: 4px;
			background-color: #DCAB6C;
			border-radius: 4rpx;
			position: absolute;
			bottom: 0rpx;
			left: 5%;
			right: 0;
		}
	}

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
		padding: 10rpx 0rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}

	.checkbox-icon .uni-icon {
		display: block;
	}


	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 20upx 0 10upx 0;
		display: flex;
		flex-direction: row;
		height: 176rpx;

		.goods-img {
			width: 160upx;
			height: 160upx;
			border: 1rpx solid #ececec;
			position: relative;
			border-radius: 10rpx;
			overflow: hidden;
		}

		.image {
			width: 160upx;
			height: 160upx;
		}

		.goods-img .icon {
			position: absolute;
			width: 80upx;
			height: 80upx;
			top: 0;
			left: 0;
		}

		.goods-img .icon image {
			width: 100%;
			height: 100%;
		}


	}

	.cart-goods-content {
		flex: 1 1 0%;
		margin-left: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.goods-title {
			font-size: 28upx;
			margin-bottom: 10upx;
		}

		.goods-attr {
			color: #999999;
			font-size: 25upx;
		}

		.goods-info {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.bot-bottom {
		background-color: #FFFFFF;
		border-radius: 28rpx 28rpx 0rpx 0rpx;
		padding: 12px 16px 24px;
		// width: 100%;


		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #272727;
			margin-bottom: 12px;

		}

		.bot-ipt {
			// width: 686rpx;
			height: 68rpx;
			line-height: 68rpx;
			background: #EDEDED;
			border-radius: 34rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0px 32rpx;
		}

		// 图片列表
		.botimg {
			min-width: 152rpx;
			width: 152rpx;
			height: 146rpx;
			border-radius: 16rpx;
			background-color: aliceblue;
			margin: 32rpx 0 32rpx 32rpx;

			.img {
				border-radius: 16rpx;
			}
		}

		// 按钮
		.bot-left {
			width: 252rpx;
			height: 76rpx;
			background: #FFFFFF;
			border-radius: 44rpx;
			border: 2rpx solid #C0C0C0;
		}

		.bot-right {
			width: 400rpx;
			height: 80rpx;
			background: #FE2F02;
			box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
			border-radius: 44rpx;
		}

	}




	.tab-botbtn {
		width: 686rpx;
		height: 88rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(192, 192, 192, 0.79);
		border-radius: 44rpx;
		opacity: 0.95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 50rpx;

		.item {
			width: 33%;
			text-align: center;
			position: relative;
			font-size: 32rpx;
			color: #999999;

			&.active {
				color: #272727;
				font-weight: 500;
			}
		}

		.item:after {
			content: ' ';
			position: absolute;
			width: 1upx;
			height: 50%;
			background: rgba(192, 192, 192, 0.45);
			right: 0;
			top: 30%;
		}
	}

	/* start--Retina 屏幕下的 1px 边框--start */
	.u-border,
	.u-border-bottom,
	.u-border-left,
	.u-border-right,
	.u-border-top,
	.u-border-top-bottom {
		position: relative
	}

	.u-border-bottom:after,
	.u-border-left:after,
	.u-border-right:after,
	.u-border-top-bottom:after,
	.u-border-top:after,
	.u-border:after {
		/* #ifndef APP-NVUE */
		content: ' ';
		/* #endif */
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		box-sizing: border-box;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		// 多加0.1%，能解决有时候边框缺失的问题
		width: 199.8%;
		height: 199.7%;
		transform: scale(0.5, 0.5);
		border: 0 solid #F9F9F9;
		z-index: 2;
	}

	.u-border-top:after {
		border-top-width: 1px
	}

	.u-border-left:after {
		border-left-width: 1px
	}

	.u-border-right:after {
		border-right-width: 1px
	}

	.u-border-bottom:after {
		border-bottom-width: 1px
	}

	.u-border-top-bottom:after {
		border-width: 1px 0
	}

	.u-border:after {
		border-width: 1px
	}

	/* end--Retina 屏幕下的 1px 边框--end */

	/* start--去除button的所有默认样式--start */
	.u-reset-button {
		padding: 0;
		font-size: inherit;
		line-height: inherit;
		background-color: transparent;
		color: inherit;
	}

	.u-reset-button::after {
		border: none;
	}

	/* end--去除button的所有默认样式--end */

	/* 导航 start */
	.nav_bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0);
		z-index: 96;

		.nav-info {
			width: 258rpx;
			height: 40rpx;
			background: #fffbf3;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.09);
			border-radius: 20rpx;
			margin-left: 15rpx;
			padding: 0 10rpx;
		}

		.status_bar {
	
			height: var(--status-bar-height);
			width: 100%;
		}

		.wx_nav_bar {
			width: 100%;

			.wx_nav_left {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				border: 1px solid rgba(0, 0, 0, 0.1);
				background-color: rgba(255, 255, 255, 0.6);
				box-sizing: border-box;
				z-index: 96;

				.icon-find-fanhui {
					font-size: 15px;
				}

				.line {
					width: 1px;
					height: 18px;
					margin: 0 8px;
					background-color: rgba(252, 252, 252, 0.3);
				}

				.shortcut {
					position: absolute;
					left: 0;
					top: 44px;
					display: flex;
					flex-direction: column;
					border-radius: 12rpx;
					background-color: rgba(255, 255, 255, 0.95);
					z-index: 101;

					&:before {
						content: '';
						position: absolute;
						left: 44px;
						top: -26rpx;
						transform: translateX(50%);
						width: 0;
						height: 0;
						line-height: 0;
						font-size: 0;
						border: 14rpx solid transparent;
						border-bottom-color: rgba(255, 255, 255, 0.95);
					}
				}

				.shortcut_item {
					width: 290rpx;
					height: 95rpx;
					line-height: 95rpx;
					padding: 0 36rpx;
					font-size: 30rpx;
					text-align: left;
					color: #000;
					box-sizing: border-box;

					.iconfont {
						margin-right: 12rpx;
						font-size: 44rpx;
						color: #000 !important;
						vertical-align: -6rpx;
					}
				}
			}

			.nav_c {
				justify-content: space-around;
				height: 44px;
			}
		}

		.nav_list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 44px;
			/* #ifdef MP-WEIXIN */
			margin-top: 100rpx;
			/* #endif */
			.iconfont {
				padding-top: 2px;
				font-size: 14px;
			}
		}

		.icon_wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 26px;
			height: 26px;
			border-radius: 50%;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.nav_l {
			width: 26px;
			height: 26px;
			margin-left: 10px;

			.iconfont {
				padding-top: 1px;
			}
		}

		.nav_r {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 26px;
			margin-right: 10px;

			.icon_car_num {
				position: relative;

				.info_num {
					position: absolute;
					top: -8rpx;
					left: 50%;
					transform: translateX(8rpx);
					min-width: 24rpx;
					height: 24rpx;
					text-align: center;
					line-height: 24rpx;
					// border-radius: 50%;
					border-radius: 8px;
					border: 2rpx solid #F91F28;
					font-size: 20rpx;
					color: #F91F28;
					background-color: #fff;
					z-index: 1;
					padding: 2rpx;

				}

				.top-right-car {
					background: #272727;
					opacity: 0.35;
					border-radius: 50%;
					padding: 8rpx 6rpx;
					font-size: 12rpx;
				}
			}


			.icon_wrap:last-child {
				position: relative;
				margin-left: 10px;

				.shortcut {
					position: absolute;
					right: 0;
					top: 44px;
					display: flex;
					flex-direction: column;
					border-radius: 12rpx;
					background-color: rgba(255, 255, 255, 0.95);
					z-index: 101;

					&:before {
						content: '';
						position: absolute;
						right: 26rpx;
						top: -26rpx;
						transform: translateX(50%);
						width: 0;
						height: 0;
						line-height: 0;
						font-size: 0;
						border: 14rpx solid transparent;
						border-bottom-color: rgba(255, 255, 255, 0.95);
					}
				}

				.shortcut_item {
					width: 290rpx;
					height: 95rpx;
					line-height: 95rpx;
					padding: 0 36rpx;
					font-size: 30rpx;
					text-align: left;
					color: #000;
					box-sizing: border-box;

					.iconfont {
						margin-right: 12rpx;
						font-size: 44rpx;
						color: #000 !important;
						vertical-align: -6rpx;
					}
				}
			}
		}
	}

	/* 导航 end */

	/* 商品轮播 start */
	.swiper_warp {
		position: relative;

		.swiper {
			width: 100%;
			height: 750rpx;

			.swiper_img {
				width: 100%;
				height: 750rpx;
			}
		}

		.indicator_dots {
			position: absolute;
			bottom: 60rpx;
			right: 0;
			min-width: 100rpx;
			height: 50rpx;
			padding: 0 10rpx;
			line-height: 50rpx;
			border-top-left-radius: 25rpx;
			border-bottom-left-radius: 25rpx;
			text-align: center;
			box-sizing: border-box;
			color: #fff;
			z-index: 10;
			background-color: rgba(41, 47, 54, 0.4);

			.curr_dots {
				font-size: 34rpx;
			}
		}

		.video_ico {
			position: absolute;
			bottom: 60rpx;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			height: 60rpx;
			padding: 0 24rpx 0 8rpx;
			border-radius: 30rpx;
			background-color: rgba(255, 255, 255, 0.8);
			z-index: 10;

			.play_ico {
				flex: none;
				font-size: 50rpx;
				color: #FF5E4D;
			}

			.play_txt {
				margin-left: 12rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				color: #262626;
			}
		}
	}

	/* 商品轮播 end */


	/* 小程序分享  start*/

	.show-popup-shareImg ::v-deep .uni-popup-bottom {
		height: 80%;
		.mp-share-warp {
			
			background: #fff;
		}
		.mp-share-warp .mp-share-img {
			width: 280px;
			box-shadow: 0 10upx 20upx 0px rgba(61, 52, 75, 0.08);
			margin: 0 auto;
		}
	}
	.mp-share-warp {
		
		background: #fff;
	}
	.mp-share-warp .mp-share-img {
		width: 280px;
		box-shadow: 0 10upx 20upx 0px rgba(61, 52, 75, 0.08);
		margin: 0 auto;
	}
	

	/* 小程序分享 end*/


	.swiper_warp_layer {
		position: relative;
	}
	// H5弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.5;
	}
	
	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		height: 70%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 10%;
		left: 10%;
		z-index: 9999;
	}
</style>