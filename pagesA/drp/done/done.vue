<template>
	<view>
		<view class="cashier-desk">
			<!-- APP 与 H5 共用：需付款金额 + 支付方式选择 + 支付按钮 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="header-title">{{$t('lang.label_need_pay')}}<view class="price">{{ doneinfo.order_amount_formated }}</view></view>
			<view class="cashier-content">
				<view class="title">{{$t('lang.fill_in_payment')}}</view>
				<view class="uni-list">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in doneinfo.paymentList" :key="index" v-if="item.pay_code =='alipay' || item.pay_code == 'wxpay'">
							<view>{{item.pay_name}}</view>
							<view><radio :value="item.pay_code" color="#f92028" /></view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="btn">
				<block v-if="currentPayment == 'alipay'">
					<button type="warn" class="page-body-button" :loading="payButtonLoading" :disabled="payButtonLoading" @click="paymentSubimt">{{ payButtonLoading ? $t('lang.loading') || '加载中...' : $t('lang.pay_by_alipay') }}</button>
				</block>
				<block v-else-if="currentPayment == 'wxpay'">
					<button type="warn" class="page-body-button" :loading="payButtonLoading" :disabled="payButtonLoading" @click="paymentSubimt">{{ payButtonLoading ? $t('lang.loading') || '加载中...' : $t('lang.wxcallpay') }}</button>
				</block>
				<block v-else-if="currentPayment == 'baidu'">
					<button type="warn" class="page-body-button" :loading="payButtonLoading" :disabled="payButtonLoading" @click="paymentSubimt">{{ payButtonLoading ? $t('lang.loading') || '加载中...' : $t('lang.baidu_cashier_desk') }}</button>
				</block>
				<block v-else-if="currentPayment == 'appleiap'">
					<button type="warn" class="page-body-button" :loading="payButtonLoading" :disabled="payButtonLoading" @click="paymentSubimt">{{ payButtonLoading ? $t('lang.loading') || '加载中...' : $t('lang.apple_Pay') }}</button>
				</block>
				<block v-else>
					<button type="warn" disabled="true">{{$t('lang.fill_in_payment')}}</button>
				</block>
			</view>
			<!-- #endif -->
			<!-- 仅小程序：微信内支付表单 -->
			<!-- #ifdef MP-WEIXIN -->
			<form @submit="weixinPay" report-submit="true">
			<view class="weixin-content">
				<view class="weixin-icon"><image src="https://images.eqingqu.com/attachs/photo/202404/20240416_4F814A552BF1DC1EF6100EC8ABBC65A8.png" class="img" /></view>
				<view class="weixin-price">
					<view class="text">{{$t('lang.need_to_pay')}}</view>
					<view class="price">{{ doneinfo.order_amount_formated }}</view>
				</view>
				<view class="weixin-pay-btn">
					<button type="primary" formType="submit" class="page-body-button">{{$t('lang.wxcallpay')}}</button>
				</view>
			</view>
			</form>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				order_sn: '',			//订单编号
				payment_list: [],		//第三方支付方式列表
				currentPayment: '',		//当前选择的第三方支付方式
				orderInfo: '',			//订单信息
				payButtonLoading: false,	// 支付按钮 loading，接口返回前禁用
				scopeSessions: {},
				doneinfo:Object,
				apply_status:'',
				membership_card_id:0
			};
		},
		computed: {
		},
		methods: {
			doneInfo(){
				// #ifdef MP-WEIXIN
				this.$store.dispatch('setDrpWxappPay',{
					membership_card_id:this.membership_card_id
				}).then(res=>{
					this.doneinfo = res.data
				})
				// #endif

				// #ifndef MP-WEIXIN
				this.$store.dispatch('setDrpPay',{
					membership_card_id:this.membership_card_id
				}).then(res=>{
					this.doneinfo = res.data
				})
				// #endif
			},
			radioChange(e) {
				const payCode = e.detail.value;
				this.currentPayment = payCode;
				this.getOrderInfo(payCode);
			},
			weixinPay(e){
				//读取本地缓存scopeSession
				uni.getStorage({
					key: 'scopeSession',
					complete: (res) => {
						//联系小韩 购买分销商
						uni.request({
							url: this.websiteUrl + '/api/drp/wxappchangepayment',
							method: 'POST',
							data: {
								platform: uni.getStorageSync('platform'),
								order_sn: this.doneinfo.order_sn,
								order_amount:this.doneinfo.order_amount,
								pay_code: 'wxpay',
								openid:res.data.openid,
								apply_status:this.apply_status,
								membership_card_id:this.membership_card_id
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let paymentData = JSON.parse(res.data.data);
								if(paymentData){
									uni.requestPayment({
										timeStamp: paymentData.timeStamp.toString(),
										nonceStr: paymentData.nonceStr,
										package: paymentData.package,
										signType: 'MD5',
										paySign: paymentData.paySign,
										success: (e) => {
											uni.showLoading({
											    title: this.$t('lang.purchase_succeeds'),
												mask:true
											});

											uni.redirectTo({
												url:'/pagesA/drp/drp',
												complete: (res) => {
													uni.hideLoading()
												}
											});
										},
										fail: (e) => {
											console.error('[drp/done] 微信支付调起失败', e);
										}
									});
								}
							},
							fail: (res) => {
								console.error('[drp/done] wxappchangepayment 接口失败', res);
							}
						})
					}
				});
			},
			paymentSubimt() {
				let orderInfo = typeof this.orderInfo === 'string' ? this.orderInfo.replace('\\', '') : this.orderInfo;
				uni.requestPayment({
					provider: this.currentPayment,
					orderInfo: orderInfo,
					success: (e) => {
						uni.showLoading({
						    title: this.$t('lang.purchase_succeeds'),
							mask:true
						});
						uni.redirectTo({
							url:'/pagesA/drp/drp',
							complete: (res) => {
								uni.hideLoading()
							}
						});
					},
					fail: (e) => {
						console.error('[drp/done] 支付调起失败', e);
					}
				});
			},
			getOrderInfo(pay_code) {
				this.payButtonLoading = true;
				uni.request({
					url: this.websiteUrl + '/api/drp/changepayment',
					method: 'POST',
					data: {
						platform: uni.getStorageSync('platform'),
						pay_code:pay_code,
						apply_status:this.apply_status,
						membership_card_id:this.membership_card_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						this.orderInfo = res.data.data;
						this.payButtonLoading = false;
					},
					fail: (res) => {
						console.error('[drp/done] changepayment 接口失败', res);
						this.payButtonLoading = false;
					}
				})
			}
		},
		onLoad(e) {
			this.apply_status = e.apply_status ? e.apply_status : '';
			this.membership_card_id = e.membership_card_id ? e.membership_card_id : 0;
			this.doneInfo();
			let that = this;
			//获取支付方式
			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'payment',
				success: (res) => {
					let providerList = [];
					res.provider.map((value) => {
                        switch (value) {
                            case 'alipay':
                                providerList.push({
                                    name: that.$t('lang.alipay'),
                                    id: value
                                });
                                break;
                            case 'wxpay':
                                providerList.push({
                                    name: that.$t('lang.wechat'),
                                    id: value
                                });
                                break;
                            default:
                                break;
                        }
                    });

                    this.payment_list = providerList;
				}
			});
			// #endif
		}
	}
</script>

<style>
	.cashier-desk {}

	.cashier-desk .header-title {
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		font-size: 32upx;
		padding: 10upx 20upx;
	}

	.cashier-desk .header-title .price {
		color: #f92028;
		font-size: 40upx;
	}

	.cashier-desk .btn {
		position: fixed;
		margin: 0 60upx 50upx;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.cashier-desk .btn button {
		padding: 0;
		font-size: 32upx;
		color: #fff;
		border-radius: 50upx;
		border: 0 !important;
	}
	.cashier-desk .btn button[disabled] {
		opacity: 0.6;
	}

	.cashier-desk .btn button::after {
		content: " ";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: 0;
		border: none;
		-webkit-transform: scale(0);
		transform: scale(0);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		box-sizing: border-box;
		border-radius: 0;
	}

	.cashier-content {
		background: #FFFFFF;
		margin-top: 20upx;
	}

	.cashier-content .title {
		padding: 20upx;
		font-size: 32upx;
	}

	.flow-done {
		padding-top: 60px;
	}

	.flow-done-con {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		align-items: center;
	}

	.flow-done-con .iconfont {
		font-size: 80px;
		line-height: normal;
	}

	.flow-done-con .icon-qian {
		color: #EFCE0C;
	}

	.flow-done-con .icon-hookring2 {
		color: #3ec074;
	}

	.flow-done-con .flow-done-title {
		font-size: 18px;
		margin-top: 20upx;
		color: #444444;
	}

	.flow-done-all {
		margin-top: 30px;
	}

	.flow-done-all .uni-list-cell-navigate .title,
	.flow-done-all .uni-list-cell-navigate .value {
		font-size: 16px;
	}

	.flow-done-all .btn-bar {
		margin: 0 20px;
	}

	.flow-done-all .btn-bar .btn {
		box-shadow: none;
	}

	.weixin-content{ display: flex; justify-content: center; flex-direction: column; text-align: center; margin: 0 60upx; padding: 150upx 0;}
	.weixin-content .weixin-icon{ width: 120upx; height: 120upx; margin: 30upx auto;}
	.weixin-content .weixin-price .text{ font-size: 40upx; }
	.weixin-content .weixin-price .price{ color: #f92028; font-size: 48upx; margin-top: 20upx;}
	.weixin-content .weixin-pay-btn button { padding: 0;font-size: 32upx;color: #fff;border-radius: 50upx;border: 0 !important; margin-top: 50upx;}
</style>
