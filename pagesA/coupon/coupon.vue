<template>
	<view class="container-tab-bar">
		<!-- <view class="tab-bar">
			<view v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',status == index ? 'active' : '']"
				@click="CommonTabs(index)">
				<text>{{ tab }}</text>
			</view>
		</view> -->

		<view class="uni-padding-wrap" v-if="status == 0">
			<uni-segmented-control :current="active" :values="tabs" :style-type="styleType" :active-color="activeColor"
				@clickItem="onClickItem" />
		</view>

		<block v-if="couponData && couponData.length>0">
			<view class="coupons_list">
				<view class="coupons_item" v-for="(item,index) in couponData" :key="index"
					:class="{'g-gay':status != 0}">
					<view class="coupons_left">
						<view class="coupons_left_top">
							<view class="coupon_price" v-if="item.cou_type==5">包邮券</view>
							<view v-else>
								<currency-price :price="item.cou_money" :size="24"></currency-price>
							</view>
							<view class="collect_coupon" v-if="item.cou_goods_name && item.cou_goods_name !== ''">
								<text>{{item.cou_goods_name}}</text>
							</view>
							<view class="collect_coupon" v-else-if="item.cou_type_name && item.cou_type_name !== ''">
								<text>{{item.cou_type_name}}</text>
							</view>
						</view>
						<view class="coupons_goods_name">
							<view class="coupon_tag2" v-if="item.cou_title && item.cou_title !== ''">
								{{item.cou_title}}
							</view>
							<view class="coupon_tag2" v-else-if="item.cou_name && item.cou_name !== ''">
								{{item.cou_name}}
							</view>
						</view>
						<view class="coupons_store_name" v-if="item.store_name && item.store_name !== ''">
							<text>{{item.store_name}}</text>
						</view>
						<view class="coupons_limited_period">
							<text>{{$t('lang.limited_period')}}{{item.begintime}}-{{item.endtime}}</text>
						</view>
					</view>
					<view class="coupons_right">
						<view class="get_coupon_time">
							<button class="u-reset-button coupon_btn u-reset-disabled"
								v-if="item.cou_is_receive == 1" @click="couponLink(item.cou_id)">
								{{$t('lang.immediately')}}<br>{{$t('lang.use')}}
							</button>
							<button class="u-reset-button coupon_btn u-reset-disabled"
								v-else-if="item.enable_ling == 1">{{$t('lang.take_up')}}</button>
							<button class="u-reset-button coupon_btn u-reset-disabled"
								v-else-if="item.cou_type == 2">
								{{$t('lang.up_original_price')}}<br>{{$t('lang.accomplish')}}
							</button>
							<button class="u-reset-button coupon_btn" v-else
								@click="drawHandle(item.cou_id)">
								{{$t('lang.immediately')}}<br>{{$t('lang.receive')}}
							</button>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	import dscNotContent from '@/components/dsc-not-content.vue';

	export default {
		data() {
			return {
				tabBars: [this.$t('lang.coupon_market'), this.$t('lang.task_market')],
				tabs: [this.$t('lang.coupon_tab_1'), this.$t('lang.coupon_tab_2'), this.$t('lang.coupon_tab_3')],
				active: 0,
				status: 0,
				cou_id: 0,
				page: 1,
				size: 10,
				colorIndex: 0,
				activeColor: '#ec5151',
				styleType: 'button'
			};
		},
		components: {
			dscNotContent,
			uniSegmentedControl
		},
		onShareAppMessage(res) {
			return {
				title: this.$t('lang.receive_coupon'),
				path: '/pagesA/coupon/coupon'
			}
		},
		computed: {
			couponData: {
				get() {
					return this.$store.state.ump.couponData
				},
				set(val) {
					this.$store.state.ump.couponData = val
				}
			},
		},
		methods: {
			CommonTabs(val) {
				this.status = val
				this.couponClick(val, 1)
			},
			couponClick(state, page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				if (state == 0) {
					this.$store.dispatch('setWebCoupon', {
						page: this.page,
						size: this.size,
						status: this.active,
						cou_id: this.cou_id
					})
				} else {
					this.$store.dispatch('setWebTaskCoupon', {
						page: this.page,
						size: this.size,
						status: this.active,
						cou_id: this.cou_id
					})
				}
			},
			onClickItem(index) {
				if (this.active !== index) {
					this.active = index
				}

				this.couponClick(this.status, 1)
			},
			couponLink(id) {
				uni.navigateTo({
					url: '/pagesD/goodslist/goodslist?cou_id=' + id
				})
			},
			drawHandle(id) {
				uni.request({
					url: this.websiteUrl + '/api/coupon/receive',
					method: 'POST',
					data: {
						cou_id: id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
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
		},
		onLoad(e) {
			this.status = e.status ? e.status : 0;
			this.cou_id = e.cou_id ? e.cou_id : 0;

			this.couponClick(this.status, 1)
		},
		onReachBottom() {
			if (this.page * this.size == this.couponData.length) {
				this.page = this.page + 1
				this.couponClick(this.status, this.page)
			}
		}
	}
</script>

<style>
	.container-tab-bar {
		padding-top: 0rpx;
		background-color: #FFFFFF;
	}
	
	page {
		background-color: #FFFFFF;
	}

	.uni-padding-wrap {
		margin-top: 20upx;
	}

	.tab-bar {
		/* #ifdef H5 */
		position: fixed;
		top: 40px;
		/* #endif */
	}

	.coupons_list {
		padding: 20upx;
	}

	.coupons_list .coupons_item {
		display: flex;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}

	.coupons_list .coupons_left {
		position: relative;
		flex: none;
		display: flex;
		flex-direction: column;
		width: calc(100% - 280rpx);
		max-width: calc(100% - 200rpx);
		border-radius: 20rpx 0 0 20rpx;
		color: #fff;
		background: #FFEDED;
		padding: 24rpx 32rpx;
		border-right: 1px dashed #fff;
		/* 祥云底纹 - 使用背景图片，不影响伪元素 */
		background-image: url("data:image/svg+xml,%3Csvg width='200' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q20,50 40,55 T80,55 T120,50 T160,55 T200,60' stroke='%23FF9999' stroke-width='2.5' fill='none' opacity='0.25'/%3E%3Cpath d='M10,65 Q30,55 50,60 T90,60 T130,55 T170,60 T190,65' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cpath d='M20,70 Q40,60 60,65 T100,65 T140,60 T180,65 T200,70' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.15'/%3E%3Cpath d='M30,50 Q50,40 70,45 T110,45 T150,40 T190,45' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cellipse cx='35' cy='52' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='75' cy='48' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='115' cy='47' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='155' cy='50' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='185' cy='53' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
		background-position: bottom left;
		background-size: 200rpx 80rpx;
	}

	.coupons_list .coupons_left .coupons_left_top {
		display: flex;
	}

	.coupons_list .coupons_left .coupons_left_top .collect_coupon {
		height: fit-content;
		padding: 6rpx 10rpx;
		margin: 0 26rpx;
		background: #FE2F02;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.coupons_list .coupons_left .coupons_goods_name {
		display: flex;
		font-size: 28rpx;
		color: #FE2F02;
	}

	.coupons_list .coupons_left .coupons_store_name {
		display: flex;
		font-size: 24rpx;
		color: #FE2F02;
		margin-top: 8rpx;
	}

	.coupons_list .coupons_left .coupons_limited_period {
		display: flex;
		font-weight: 400;
		font-size: 20rpx;
		color: #FE2F02;
	}

	.coupons_list .coupons_left .coupon_price {
		font-size: 48rpx;
		line-height: 1;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		color: #FE2F02;
		font-style: normal;
	}

	.coupons_list .coupons_left:after {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		transform: translate(50%, 50%);
		border-radius: 50%;
		background-color: #fff;
		z-index: 2;
	}

	.coupons_list .coupons_left:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background-color: #fff;
		z-index: 2;
	}

	.coupons_list .coupons_right {
		overflow: hidden;
		position: relative;
		flex: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 200rpx;
		border-radius: 0 20rpx 20rpx 0;
		border: 1px solid #f2d2d2;
		border-left-width: 0;
		background-color: #fbf2f2;
	}

	.coupons_list .coupons_right .get_coupon_time {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.coupons_list .coupons_right .get_coupon_time .coupon_btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		line-height: 44rpx;
		border-radius: 26rpx;
		text-align: center;
		background: #FFEDED;
		font-weight: 400;
		font-size: 28rpx;
		color: #FE2F02;
	}

	.coupons_list .coupons_right .get_coupon_time .u-reset-disabled {
		/* 已领取样式 */
	}

	.coupons_list .coupons_right:after {
		content: '';
		position: absolute;
		bottom: -24rpx;
		left: -22rpx;
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		background-color: #f2d2d2;
	}

	.coupons_list .coupons_right:before {
		content: '';
		position: absolute;
		top: -24rpx;
		left: -22rpx;
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		background-color: #f2d2d2;
	}

	.coupons_list .coupons_item.g-gay .coupons_left {
		background: #f5f5f5;
	}

	.coupons_list .coupons_item.g-gay .coupons_left .coupon_price,
	.coupons_list .coupons_item.g-gay .coupons_left .coupons_goods_name,
	.coupons_list .coupons_item.g-gay .coupons_left .coupons_store_name,
	.coupons_list .coupons_item.g-gay .coupons_left .coupons_limited_period {
		color: #ccc;
	}

	.coupons_list .coupons_item.g-gay .coupons_right {
		background-color: #f5f5f5;
		border-color: #e0e0e0;
	}

	.coupons_list .coupons_item.g-gay .coupons_right .coupon_btn {
		background: #f5f5f5;
		color: #ccc;
	}
</style>