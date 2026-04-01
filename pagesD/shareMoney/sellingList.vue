<template>
	<view class="container skeleton">
		<!-- 导航栏 start -->
		<view class="nav_bar skeleton " :style="{ backgroundColor: rgba }">
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
					<view class="nav-info fs24 textc">
						{{currentWord}}
					</view>
				</view>
				<view class="nav_r">
					<view class="nav_l" @click="sharelist">
						<image src="/static/share/share.png" mode="widthFix" style="width: 40rpx;">
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
				<view class="nav_c" :style="{ opacity: navOpacity }">
					<view :class="['nav_item', ind == currNav? 'active_nav' : '']" v-for="(nav, ind) in navBar"
						:key="ind" @click="changeNav(ind)">{{ nav.title }}</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 导航栏 end -->
		<!-- tab + 导航栏 start-->
		<view class="img-top" style="">
			<!-- <image src="/static/share/topsellbg.png" mode="widthFix" style="width: 100%;z-index: 0 !important;" class="img-top"></image> -->
		</view>
		<view class="bgc_fff " style="border-radius:14rpx;">
			<view class="product-list-lie " v-if="!dscLoading" style="margin: 0 32rpx; padding:32rpx 0 ">
				<!-- 顶部横项list -->
				<share-selling-list :list="hotList" :mode="mode" :loadMoreStatus="loadMoreStatus"
					@checkGoods="handleCheckGoods" />
				<!-- <dsc-not-content v-else></dsc-not-content> -->
			</view>
			<view class="" style="height: 256px;" v-if="isaddlist==true"></view>
		</view>
		<view class="flex-center flexdc " v-if="expertList.length>0"> 
			<view class="mtb32  cen-title">
				优质达人清单
			</view>
			<view class="content-list" >
				<share-own-sell :list="expertList" :mode="mode" :loadMoreStatus="loadMoreStatus"
					@checkGoods="handleCheckGoods" v-if="expertList.length>0" />
			</view>
		</view>
		<view class="flex-center flexdc " style="margin-bottom:180px ;">
			<view class="fs32 fs500 ">更多推荐</view>
			<view class="product-list-lie">
				<dsc-product-list :list="guessList" :showone="true" :productOuter="true"
					:guessList="true"></dsc-product-list>
			</view>
		</view>

		<view class="botbtn" @click="sharelist">
			<view class="flex-center coff fs36 botbtns">分享我的清单</view>
		</view>


		<!--小程序分享-->
		<view class="show-popup-shareImg">
			<uni-popup :show="shareImgShow" type="bottom" :animation="true" v-on:hidePopup="shareImgShow = false">
				<view class="mp-share-warp">
					<view class="title">
						<text>{{$t('lang.save_xaingce')}}</text>
						<uni-icon type="closeempty" size="30" color="#8f8f94" @click="shareImgShow = false"></uni-icon>
					</view>
					<view class="mp-share-img">
						<image :src="mpShareImg" mode="heightFix" class="img" @tap="previewImage"></image>
					</view>
					<view class="btn-bar btn-bar-radius"><button class="btn btn-red"
							@click="downloadImg">{{$t('lang.save_picture')}}</button></view>
				</view>
			</uni-popup>
		</view>

		<!--自定义分享-->
		<uni-popups id="popupPoster" ref="popupPoster" type="bottom">
			<view class="popup-poster">
				<view class="poster-image">
					<image :src="mpShareImg" mode="widthFix" class="img"></image>
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


		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>

	</view>
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
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscFilterTop from '@/components/dsc-filter-top'
	import dscProductList from '@/components/dsc-product-list.vue';
	import shareSellingList from '@/pagesD/components/share-list/share-selling-list.vue'
	import shareOwnList from '@/pagesD/components/share-list/share-own-list.vue'
	import shareOwnSell from '@/pagesD/components/share-list/share-own-sell.vue'
	export default {
		mixins: [universal],
		components: {
			uniIcons,
			uniLoadMore,
			dscFilterTop,
			dscNotContent,
			dscProductList,
			shareSellingList,
			shareOwnList,
			shareOwnSell,
			uniPopups
		},
		data() {
			return {
				parentid: 0,
				user_id: uni.getStorageSync('userInfo').id,
				shareImgShow: false,
				mpShareImg: '',
				moneydetail: '',
				moneyimg: '',
				moneytitle: '',
				redshow: false,
				guessList: [],
				eid: '',
				userlist: [],
				currentIndex: 0,
				intervalId: null,
				btnIndex: '',
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
				size: 10,
				page: 1,
				hotpage: 1,
				winHeight: 600,
				heightssChat: 0,
				dscLoading: true,
				rgba: '',
				navIconRgba: '',
				showSkeleton: false,
				showShortcut: false,
				navOpacity: '',
				navBar: '',
				tabstatus: '',
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
				//data: state => state.user.userInfo,
				goodsGuessList: state => state.shopping.goodsGuessList,
			}),
			currentWord() {
				return this.userlist[this.currentIndex] ? this.userlist[this.currentIndex] : '';
			},
		},
		watch: {
			sharePoster() {
				if (this.sharePoster) {
					this.$refs.popupPoster.open();
				}
			}
		},
		onReachBottom() {
			var that = this
			that.loadMoreStatus = 'loading';
			if (that.page * that.size == that.guessList.length) {
				that.page++
				that.goodsGuessHandle()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.product-list-lie').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {
					that.loadMoreStatus = 'loading';
					if (that.page * that.size == that.guessList.length) {
						console.log("这里")
						that.page++
						that.goodsGuessHandle()
					}
				}
			}).exec()
		},

		mounted() {},
		onLoad(e) {
			if (e) {
				this.eid = e.id ? e.id : 0
				this.parentid = e.parent_id ? e.parent_id : 0
				uni.setStorageSync('parent_id', e.parent_id)
			}
			this.getredInfo(e.id)
			// this.getGoodsList(1)
			this.winHeight = uni.getSystemInfoSync().screenHeight - 95;
			this.heightssChat = uni.getSystemInfoSync().windowHeight * 0.4;
			this.gethotlist(1)
			this.getexpertlist(1)
			this.goodsGuessHandle(1);
		},
		onShow() {
			this.gethotlist(1)
			this.getexpertlist(1)
			this.getshareInfo()
			console.log('share', this.shareList)
			this.startRotation();
			this.goodsGuessHandle(1);
		},
		methods: {
			clickmore() {
				this.hotpage++
				this.gethotlist(this.hotpage)
			},
			sharelist() {
				this.onGoodsShare();
			},
			onGoodsShare() {
				if (this.$isLogin()) {
					uni.showLoading({
						title: this.$t('lang.loading')
					});
					// #ifdef MP-WEIXIN
					this.shareImgShow = true;
					// #endif
					// #ifdef APP-PLUS
					this.appShare();
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
				console.log('this.moneydetail',this.moneydetail)
				let shareInfo = {
					// href: `${this.$websiteUrl}pagesD/shareMoney/sellingList?id=${this.eid}&platform=APP`,
					
					href: this.websiteUrl + '/mobile/pagesD/shareMoney/sellingList?id' + this.eid + '&platform=APP',
					title: this.moneytitle,
					summary: this.moneydetail.intro,
					imageUrl: this.moneydetail.img_small,
					url: this.websiteUrl + '/mobile/pagesD/shareMoney/sellingList?id' + this.eid + '&platform=APP'
				};
				this.shareInfo(shareInfo, 'poster', this.eid);
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
				this.keyValue = ''
				clearInterval(this.intervalId);
				this.intervalId = null;
			},
			getredInfo() {
				uni.request({
					url: 'https://www.ok9288.com/api/drpnew/share_img_url',
					method: 'GET',
					data: {
						id: this.eid,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							let data = res.data.data
						
							this.moneydetail = res.data.data
							this.moneyimg = data.img
							this.moneytitle = data.title
							this.mpShareImg = data.img
							console.log(res.data.data)
							console.log('getredInfo',this.moneydetail)
						} else {

						}
					},
					fail: (err) => {}
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
							this.userlist = res.data.data.userlist
						}
					},
					fail: (err) => {}
				})
			},
			handleCheckGoods(selectedInfo) {
				console.log('checkGoods', selectedInfo)
				this.shareList = selectedInfo
				this.isaddlist = true
			},
			handleViewSwitch() {
				this.mode = this.mode === 'grid' ? 'list' : 'grid'
			},
			// 获取列表--爆品返利
			gethotlist(page) {
				var that = this
				if (page) {
					this.hotpage = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/drpnew/dagoodslist',
					method: 'GET',
					data: {
						page: this.hotpage,
						id: this.eid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('gethot', res.data.data)
						if (res.data.data.length <= 10) {
							this.hotpage--
							this.loadMoreStatus = 'noMore'
							return
						}
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							if (this.hotpage > 1) {
								this.hotList[0].goodslist = this.hotList[0].goodslist.concat(res.data.data
									.goodslist);
							} else {
								this.hotList = [res.data.data]
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
			getexpertlist(page) {
				var that = this
				if (page == 1 ) {
					uni.showLoading({
						title: '拼命加载中...',
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
						console.log('sellexpert', res.data.data)
						uni.hideLoading();
						if (res.data.status == 'success' && res.data.data.goodslist.length > 0) {
							const processedCart = res.data.data.goodslist
							res.data.data.goodslist = processedCart.map(item => ({
								...item,
								goods_list: item.goods_list.map(goods => ({
									...goods,
									checked: false
								}))
							}));
							if (res.data.data.length < 10) {
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
					}
				})
			},

			//更多推荐
			goodsGuessHandle(page) {
				var that = this
				if (page == 1 ) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
				}
				if (page) {
					that.page = page
					that.size = 10
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
						warehouse_id: 0,
						area_id: 0,
						page: that.page,
						size: that.size
					},
					success: (res) => {
							uni.hideLoading();
						if (that.page == 1) {}
						if (res.statusCode == 200) {
							if (res.data.data.length < 10) {
								that.loadMoreStatus = 'noMore'
							}
							if (that.page == 1) {
								that.guessList = res.data.data
							} else {
								that.guessList = that.guessList.concat(res.data.data)
							}
						}
					}
				})
			},

			// 返回
			toBack() {
				uni.navigateBack()
			},

		}
	}
</script>

<style lang="scss">
	.container {
		// padding-bottom: 120rpx;
		overflow: hidden;
		// background-color: pink;
		position: relative;
	}

	.botbtn {
		position: fixed;
		bottom: 0%;
		left: 0%;
		width: 100%;
		height: 168rpx;
		background: #FFFFFF;



	}

	.botbtns {
		margin: 32rpx 32rpx 48rpx;
		height: 88rpx;
		background: #FE2F02;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 44rpx;
	}

	.content-list {
		margin-top: 0px;
		width: 100%;
		min-height: 100%;
		border-radius: 24rpx 24rpx 0 0;
	}

	.img-top {
		height: 180px;
		// background-image: url('../../static/share/topsellbg.png');
		background-image: url(https://images.eqingqu.com/attachs/photo/202504/20250429_4B6569E1986218BC93562D8E5A775726.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}


	.content-body {
		margin-top: -200px;
		width: 750rpx;
		min-height: 100%;
		background: linear-gradient(to bottom, #FFFFFF -8%, #f6f6f6 100%);
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
		padding: 16px 16px 24px;
		// width: 100%;


		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #272727;
			margin-bottom: 32rpx;

		}

		.bot-ipt {
			// width: 686rpx;
			// height: 68rpx;
			background: #EDEDED;
			border-radius: 34rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 32rpx;
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
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 44rpx;
			border: 2rpx solid #C0C0C0;
		}

		.bot-right {
			width: 400rpx;
			height: 88rpx;
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
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0);
		z-index: 96;

		.nav-info {
			width: 254rpx;
			height: 40rpx;
			background: #fffbf3;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.09);
			border-radius: 20rpx;
			margin-left: 15rpx;
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
	}

	/* 小程序分享 end*/


	.swiper_warp_layer {
		position: relative;
	}

	.cen-title {
		width: 192rpx;
		height: 32rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #272727;
		line-height: 32rpx;
		text-align: justify;
		font-style: normal;
		position: relative;
	}

	.cen-title:after {
		content: ' ';
		width: 90%;
		height: 4px;
		background-color: #DCAB6C;
		border-radius: 4rpx;
		position: absolute;
		bottom: -25%;
		left: 5%;
		right: 0;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
		opacity: 0.5;
		z-index: 999;
	}

	.wxshare_y {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #FAFAFA;
		position: fixed;
		left: 7%;
		z-index: 999;
		/* #ifdef H5 */
		top: 10%;
		/* #endif */
		/* #ifndef H5 */
		top: 15%;
		/* #endif */
	}
</style>