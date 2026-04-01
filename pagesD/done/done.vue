<template>
	<view>
		<block
			v-if="doneinfo.pay_code == 'cod' || doneinfo.pay_code == 'balance' || doneinfo.order_amount == 0 || doneinfo.pay_code == 'bank'">
			<view class="flow-done">
				<view class="flow-done-con">
					<block v-if="doneinfo.pay_code == 'cod'">
						<view class="iconfont icon-qian"></view>
						<view class="flow-done-title">{{$t('lang.amount_payable')}}</view>
						<view class="flow-done-price">{{ doneinfo.order_amount_format }}</view>
					</block>
					<block v-else>
						<block v-if="doneinfo.pay_code == 'bank'">
							<view class="iconfont icon-hookring2"></view>
							<view class="flow-done-title">订单提交成功</view>
						</block>
						<block v-else>
							<view class="iconfont icon-hookring2"></view>
							<view class="flow-done-title">{{$t('lang.order_pay_success')}}</view>
						</block>
					</block>
				</view>
				<view class="flow-done-all">
					<block v-if="doneinfo.pay_code == 'bank'">
						<view class="uni-card uni-card-not" v-for="(item,index) in doneinfo.pay_config" :key="index">
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-navigate">
										<text class="title">{{item.name}}</text>
										<view class="value">{{item.value}}</view>
									</view>
								</view>
							</view>
						</view>
					</block>
					<view class="uni-card uni-card-not">
						<view class="uni-list">
							<view class="uni-list-cell">
								<view class="uni-list-cell-navigate">
									<text class="title">{{$t('lang.label_order')}}</text>
									<view class="value">{{ order_sn }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-bar">
						<block v-if="doneinfo.extension_code == 'team_buy'">
							<navigator :url="'/pagesA/team/wait/wait?team_id=' + doneinfo.team_id"
								class="btn btn-white">{{$t('lang.view_team_schedule')}}</navigator>
						</block>
						<block v-else-if="doneinfo.extension_code == 'crowd_buy'">
							<navigator url='/pagesA/crowdfunding/user/order' class="btn btn-white">
								{{$t('lang.view_crowdfunding_order')}}</navigator>
						</block>
						<block v-else>
							<navigator url='/pagesB/order/order' class="btn btn-white">{{$t('lang.view_order')}}
							</navigator>
							<text class="btn btn-white" style="background-color: #FEF3E4;"
								@click="$outerHref('/pagesD/shareMoney/shareMoney', $isLogin())"
								v-if="shopConfig.is_show_drp == 1">成为分销商</text>
						</block>
					</view>

					<!-- 轮播图 -->
					<view class="swiper-container" v-if="BannerList.length > 0">
						<uni-swiper-dot class="uni-swiper-dot-box" :info="BannerList" :current="current" :mode="mode"
							:dots-styles="dotStyle" field="content">
							<swiper class="swiper-item" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
								:interval="interval" :duration="duration" indicator-color="#8a8a8a"
								indicator-active-color="#CB8E3E" :current="swiperDotIndex" @change="change">
								<swiper-item class="swiper-item" v-for="(item,index) in BannerList" :key="index">

									<!-- #ifdef MP-WEIXIN -->
									<view style="width: 60%;padding: 20rpx;">
										<view
											style="font-size: 36rpx;font-weight: bold;margin-top: -20rpx;margin-bottom: 10rpx;">
											{{item.name}}</view>
										<view
											style="background-color: #FEF3E4;border-radius: 20rpx;font-size: 28rpx;padding: 0 10px;">
											{{item.content}}</view>
									</view>
									<view style="width: 5%;"></view>
									<view style="width: 30%;" class="image_1">
										<image :src="item.image" style="width: 180rpx;height: 180rpx;z-index: 999;">
										</image>
									</view>
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<view style="width: 55%;padding: 20rpx;">
										<view
											style="font-size: 36rpx;font-weight: bold;margin-top: -20rpx;margin-bottom: 10rpx;">
											{{item.name}}</view>
										<view
											style="background-color: #FEF3E4;border-radius: 20rpx;font-size: 28rpx;padding: 0 10px;">
											{{item.content}}</view>
									</view>
									<view style="width: 4%;"></view>
									<view style="width: 25%;" class="image_1">
										<image :src="item.image" style="width: 180rpx;height: 180rpx;z-index: 999;">
										</image>
									</view>
									<!-- #endif -->

								</swiper-item>
							</swiper>
						</uni-swiper-dot>
					</view>

				</view>
			</view>
		</block>
		<block v-else>
			<view class="cashier-desk">
				<!-- #ifndef MP-WEIXIN -->
				<!-- 修改支付方式选择部分 -->
				<view class="cashier-content">
					<view class="title">{{$t('lang.fill_in_payment')}}</view>
					<view class="uni-list">
						<radio-group @change="radioChange">
					<!-- 支付宝支付选项 v-if="!isWechatH5"-->
					<view v-if="!isWechatH5" class="base_select_item" 
						:class="{'disabled-item': doneinfo.is_use_aliypay}" 
						@click="doneinfo.is_use_aliypay ? null : handleChangePay('alipay')">
						<label class="uni-list-cell uni-list-cell-pd">
							<view class="payment-info">
								<view :class="{'disabled-text': doneinfo.is_use_aliypay}">支付宝</view>
								<!-- 支付宝禁用提醒 - 放在按钮内 -->
								<view v-if="doneinfo.is_use_aliypay" class="alipay-warning-text">
									{{ doneinfo.is_use_aliypay }}
								</view>
							</view>
							<view>
								<radio value="alipay" color="#f92028" :disabled="!!doneinfo.is_use_aliypay" />
							</view>
						</label>
					</view>
					
					<!-- 分割线 -->
					<view class="payment-divider"></view>

					<!-- 微信支付选项 -->
					<view class="base_select_item" @click="handleChangePay('wxpay')">
						<label class="uni-list-cell uni-list-cell-pd">
							<view>微信</view>
							<view>
								<radio value="wxpay" color="#f92028" />
							</view>
						</label>
					</view>
						</radio-group>
					</view>
				</view>
				<view class="btn">
					<block v-if="currentPayment == 'alipay'">
						<button type="warn" class="page-body-button"
							@click="paymentSubimt">{{$t('lang.alipay_payment')}}</button>

					</block>
					<block v-else-if="currentPayment == 'wxpay'">
						<button type="warn" class="page-body-button"
							@click="paymentSubimt">{{$t('lang.wxpay_payment')}}</button>
					</block>
					<block v-else-if="currentPayment == 'baidu'">
						<button type="warn" class="page-body-button"
							@click="paymentSubimt">{{$t('lang.baidu_payment')}}</button>
					</block>
					<block v-else-if="currentPayment == 'appleiap'">
						<button type="warn" class="page-body-button"
							@click="paymentSubimt">{{$t('lang.appleiap_payment')}}</button>
					</block>
					<block v-else>
						<button type="warn" disabled="true">{{$t('lang.fill_in_payment')}}</button>
					</block>
				</view>
				<!-- #endif -->
				<!-- 微信浏览器内支付界面 -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- <form @submit="weixinPay" report-submit="true"> -->
				<view class="weixin-content">
					<view class="weixin-icon">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_4F814A552BF1DC1EF6100EC8ABBC65A8.png"
							class="img" />
					</view>
					<view class="weixin-price">
						<view class="text">{{$t('lang.need_to_pay')}}</view>
						<view class="price">{{ doneinfo.order_amount_format }}</view>
					</view>
					<view class="weixin-pay-btn">
						<button type="primary" @click="subscribePay" :disabled="disabled"
							class="page-body-button">{{$t('lang.wxpay_payment')}}</button>
					</view>
				</view>
				<!-- </form> -->
				<!-- #endif -->
			</view>
		</block>

		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import dscCommonNav from '@/components/dsc-common-nav.vue';
	export default {
		data() {
			return {
				jsApiParameters: '',
				isWechatH5: false, // 是否微信浏览器
				wxpay_mweb: true,
				in_weixin: false, //在微信
				wx_alipay: false, //微信 支付宝支付
				rebackurl: '',
				code: '',
				order_sn: '', //订单编号
				payment_list: [], //第三方支付方式列表
				currentPayment: '', //当前选择的第三方支付方式
				orderInfo: '', //订单信息
				scopeSessions: {},
				dscLoading: true,
				disabled: false,
				shopConfig: uni.getStorageSync('configData'),
				wx_template_id: '',


				BannerList: [{
						name: '尊享售后 专项活动',
						content: '长按保存二维码添加客户经理',
						image: 'https://img2.baidu.com/it/u=3115081690,775722081&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
					},
					{
						name: '专项活动 尊享售后',
						content: '扫描二维码添加客户经理',
						image: 'https://img2.baidu.com/it/u=3115081690,775722081&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
					}
				], //轮播图
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				dotStyle: {
					backgroundColor: ' #F7F7F7',
					border: 'none',
					color: '#444',
					selectedBackgroundColor: '#CB8E3E',
					selectedBorder: '1px rgba(152, 101, 35, 0.4) none'
				},
				current: 0,
				mode: 'dot',
				swiperDotIndex: 0,

			};
		},
		components: {
			dscCommonNav
		},
		computed: {
			...mapState({
				doneinfo: state => state.shopping.doneinfo
			}),
		},
		methods: {
			// 检查微信H5环境
			checkWechatH5Environment() {
				// #ifdef H5
				const ua = navigator.userAgent.toLowerCase();
				this.isWechatH5 = ua.match(/micromessenger/i) === 'micromessenger';
				// 微信环境下自动选择微信支付
				if (this.isWechatH5) {
					this.currentPayment = 'wxpay';
				}
				// #endif
			},
		handleChangePay: function(code) {
			// 检查支付宝是否被禁用
			if (code == 'alipay' && this.doneinfo.is_use_aliypay) {
				uni.showToast({
					title: this.doneinfo.is_use_aliypay,
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.code = code;
		},
			change(e) {
				this.current = e.detail.current
			},

		radioChange(e) {
			let that = this
			
			// 检查支付宝是否被禁用
			if (e.detail.value == 'alipay' && that.doneinfo.is_use_aliypay) {
				uni.showToast({
					title: that.doneinfo.is_use_aliypay,
					icon: 'none',
					duration: 2000
				});
				// 清空选择，防止选中被禁用的支付方式
				that.currentPayment = '';
				return;
			}
			
			that.currentPayment = e.detail.value;
			// 清空旧的支付信息，确保使用当前订单的数据
			that.orderInfo = '';
			that.jsApiParameters = '';
			
			// 优先使用 URL 参数中的订单号（最新），如果不存在则使用 Store 中的
			const currentOrderSn = that.order_sn || that.doneinfo?.order_sn;
			
			console.log(e.detail.value)

			// 获取系统信息
			const systemInfo = uni.getSystemInfoSync();

			console.log(systemInfo)
			// #ifdef H5
			if (e.detail.value == 'wxpay') {

				var in_weixin = that.checkIsWeixin();

				if (in_weixin) {
					// that.getOrderInfo(e.detail.value, currentOrderSn)
					that.weixinPay();
				} else {
					that.getH5OrderInfo(e.detail.value, currentOrderSn)
				}

			} else {
				that.getH5OrderInfo(e.detail.value, currentOrderSn)
			}
				// #endif

				// #ifdef MP-WEIXIN
				that.getWXOrderInfo(e.detail.value, currentOrderSn)
				// #endif

				// #ifdef APP-PLUS
				// that.weixinPay();
				that.getOrderInfo(e.detail.value, currentOrderSn)
				// #endif



			},
			getkehuManageqrcodeurl(code) {
				let that = this
				// 小程序订阅消息 模板列表
				uni.request({
					url: 'https://www.ok9288.com/api/qrcode/kehuManageqrcodeurl',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							console.log(res.data)
							that.BannerList = res.data.data
						}
					}
				})
			},
			getTemplate(code) {
				let that = this
				// 小程序订阅消息 模板列表
				uni.request({
					url: this.websiteUrl + '/api/wxapp/get_template',
					method: 'POST',
					data: {
						code: code,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('123，，', res);
						if (res.data.status == 'success') {
							let result = res.data.data
							if (result.length > 0) {
								that.wx_template_id = result[0]['wx_template_id'] || ''
							}
						}
					}
				})
			},
			subscribePay() {
				let that = this;
				if (this.doneinfo.extension_code && this.doneinfo.extension_code == 'team_buy' && this.wx_template_id) {
					// 小程序订阅消息弹窗：用户接受或拒绝订阅后均继续支付（订阅为可选）
					uni.requestSubscribeMessage({
						tmplIds: [this.wx_template_id],
						success(res) {
							that.weixinPay();
						},
						fail(err) {
							// 用户拒绝/取消订阅时也要继续支付，避免“点击没反应”
							that.weixinPay();
						}
					});
				} else {
					this.weixinPay();
				}
			},
			weixinPay(e) {
				let that = this
				// 优先使用 URL 参数中的订单号（最新），如果不存在则使用 Store 中的
				const currentOrderSn = that.order_sn || that.doneinfo?.order_sn;
				if (!currentOrderSn) {
					uni.showToast({ title: '订单信息异常', icon: 'none' });
					return;
				}
				//读取本地缓存scopeSession
				uni.getStorage({
					key: 'scopeSession',
					complete: (res) => {
						// scopeSession 存在且含 openid：直接发起支付请求
						if (res.data && res.data.openid) {
							that.disabled = true;
							that.doPaymentRequest(currentOrderSn, res.data.openid);
							return;
						}
						// scopeSession 缺失：方案一静默刷新，失败则方案二跳转登录
						that.refreshScopeSessionAndPay(currentOrderSn);
					}
				});
			},
			/** 方案一：静默刷新 scopeSession 后发起支付；失败则方案二跳转登录 */
			refreshScopeSessionAndPay(currentOrderSn) {
				let that = this;
				uni.showLoading({ title: '正在准备支付...', mask: true });
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						that.$store.dispatch('getScopeAppSession', { code: loginRes.code })
							.then(sessionRes => {
								uni.setStorageSync('scopeSession', sessionRes.data);
								uni.hideLoading();
								that.disabled = true;
								that.doPaymentRequest(currentOrderSn, sessionRes.data.openid);
							})
							.catch(err => {
								uni.hideLoading();
								that.gotoLoginForScopeSession(currentOrderSn);
							});
					},
					fail: (err) => {
						uni.hideLoading();
						that.gotoLoginForScopeSession(currentOrderSn);
					}
				});
				// #endif
				// #ifndef MP-WEIXIN
				uni.hideLoading();
				that.gotoLoginForScopeSession(currentOrderSn);
				// #endif
			},
			/** 方案二：提示并跳转登录页，获取 scopeSession 后返回支付页 */
			gotoLoginForScopeSession(currentOrderSn) {
				uni.showModal({
					title: '提示',
					content: '支付授权已过期，请重新登录',
					showCancel: false,
					success: () => {
						uni.navigateTo({
							url: '/pagesB/login/login?from=done&order_sn=' + encodeURIComponent(currentOrderSn) + '&delta=1'
						});
					}
				});
			},
			/** 发起微信支付请求 */
			doPaymentRequest(currentOrderSn, openid) {
				let that = this;
				var in_weixin = false;
				// #ifdef H5
				in_weixin = that.checkIsWeixin();
				// #endif
				uni.request({
					url: this.websiteUrl + '/api/payment/change_app_payment',
					method: 'GET',
					data: {
						platform: in_weixin ? 'mobile' : uni.getStorageSync('platform'),
						order_sn: currentOrderSn,
						pay_code: 'wxpay',
						openid: openid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
								
								// #ifdef H5
								var in_weixin = that.checkIsWeixin();
								// #endif
								console.log(1235555, res);
								let paymentData = JSON.parse(res.data.data.button);
								// #ifdef H5
								paymentData = JSON.parse(res.data.data.button.payment);
								if (in_weixin && res.data.data.button.payment) {
									that.jsApiParameters = JSON.parse(res.data.data.button.payment)
								}
									// #endif
								
							
								if (paymentData) {
									let media_type = uni.getStorageSync("scene") == 1177 ? 1 : 0;
									if (media_type) {
										uni.requestOrderPayment({
											timeStamp: paymentData.timeStamp.toString(),
											nonceStr: paymentData.nonceStr,
											package: paymentData.package,
											signType: paymentData.signType,
											paySign: paymentData.paySign,
											orderInfo: paymentData.orderInfo,
											success: (e) => {
												console.log(JSON.stringify(e))
												uni.showLoading({
													title: this.$t(
															'lang.pay_success'
															),
													mask: true
												});
												if (this.doneinfo.extension_code ==
													'team_buy') {
													uni.redirectTo({
														url: '/pagesA/team/order/order',
														complete: (res) => {
															uni.hideLoading()
														}
													})
												} else {
													uni.redirectTo({
														url: '/pagesB/order/order',
														complete: (res) => {
															uni.hideLoading()
														}
													});
												}
											},
											fail: (e) => {
												console.log(JSON.stringify(e))
											},
											complete: (e) => {
												that.disabled = false
											}
										});
									} else {
										uni.requestPayment({
											timeStamp: paymentData.timeStamp.toString(),
											nonceStr: paymentData.nonceStr,
											package: paymentData.package,
											signType: paymentData.signType,
											paySign: paymentData.paySign,
											success: (e) => {
												uni.showLoading({
													title: this.$t(
															'lang.pay_success'
															),
													mask: true
												});
												if (this.doneinfo.extension_code ==
													'team_buy') {
													uni.redirectTo({
														url: '/pagesA/team/order/order',
														complete: (res) => {
															uni.hideLoading()
														}
													})
												} else {
													uni.redirectTo({
														url: '/pagesB/order/order',
														complete: (res) => {
															uni.hideLoading()
														}
													});
												}
											},
											fail: (e) => {
												console.log(JSON.stringify(e))
											},
											complete: (e) => {
												that.disabled = false
											}
										});
									}
								}
							},
					fail: (res) => {
						that.disabled = false;
						uni.showToast({
							title: '请求失败',
							icon: 'none',
							duration: 1000
						});
						console.log(JSON.stringify(res));
					}
				});
			},
			handlePaymentSuccess() {
				uni.showLoading({
					title: this.$t('lang.pay_success'),
					mask: true
				});

				if (this.doneinfo.extension_code === 'team_buy') {
					uni.redirectTo({
						url: '/pagesA/team/order/order',
						complete: () => uni.hideLoading()
					});
				} else {
					uni.redirectTo({
						url: '/pagesB/order/order',
						complete: () => uni.hideLoading()
					});
				}
			},
			//判断是否微信
			checkIsWeixin() {
				if (/(micromessenger)/.test(navigator.userAgent.toLowerCase())) {
					return true;
				} else {
					return false;
				}
			},
			// wxjspay:function (trade, rebackurl) {

			// 	/* let trade_no = trade.trade_no;
			// 	let amount = trade.amount;
			// 	let _href = api.mklink('pages/payment/wxjspay?trade_no='+trade_no+'&amount='+amount+'&rebackurl='+encodeURIComponent(that.rebackurl));
			// 	location.href = _href; */

			// 	let trade_no = trade.trade_no;
			// 	let amount = trade.amount;
			// 	let link = 'trade/payment/wxjspay?trade_no=' + trade_no + '&amount=' + amount + '&rebackurl=' + encodeURIComponent(
			// 		mklink(rebackurl));
			// 	window.location.href = mklink(link, false);
			// },
			// 微信JSAPI支付方法
			wxjsPay(paymentData) {
				return new Promise((resolve, reject) => {
					if (typeof WeixinJSBridge === "undefined") {
						uni.showToast({
							title: '请在微信中打开',
							icon: 'none'
						});
						return reject('not in wechat');
					}
					// {
					//     appId: paymentData.appId,
					//     timeStamp: paymentData.timeStamp,
					//     nonceStr: paymentData.nonceStr,
					//     package: paymentData.package,
					//     signType: paymentData.signType,
					//     paySign: paymentData.paySign
					// },
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						paymentData,
						(res) => {
							if (res.err_msg === 'get_brand_wcpay_request:ok') {
								this.handlePaymentSuccess();
								resolve();
							} else {
								const msg = res.err_msg || '支付取消';
								// uni.showToast({ title: msg, icon: 'none' });
								reject(msg);
							}
						}
					);
				});
			},


		async paymentSubimt() {
			var that = this
			// 优先使用 URL 参数中的订单号（最新），如果不存在则使用 Store 中的
			const currentOrderSn = that.order_sn || that.doneinfo?.order_sn;
			console.log("orderInfo", that.orderInfo);
			console.log(that.currentPayment == 'wxpay');
			
			// 验证订单号是否有效
			if (!currentOrderSn) {
				uni.showToast({
					title: '订单信息错误，请重新进入支付页面',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			// 检查支付宝是否被禁用
			if (that.currentPayment == 'alipay' && that.doneinfo.is_use_aliypay) {
				uni.showToast({
					title: that.doneinfo.is_use_aliypay,
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			// #ifdef H5
			if (that.currentPayment == 'wxpay') {
				var in_weixin = that.checkIsWeixin();
				var url = in_weixin ? that.jsApiParameters : that.orderInfo?.mweb_url
				if (url) {
					if (in_weixin) {
						that.wxjsPay(url);
					} else {
						window.location.href = url;
					}
				} else {
					// 如果支付信息为空，重新获取
					that.getH5OrderInfo(that.currentPayment, currentOrderSn);
					uni.showToast({
						title: '正在获取支付信息，请稍后再试',
						icon: 'none',
						duration: 2000
					});
					return;
				}

			} else if (this.currentPayment == 'alipay') {
				if (!this.orderInfo) {
					// 如果支付信息为空，重新获取
					that.getH5OrderInfo(that.currentPayment, currentOrderSn);
					uni.showToast({
						title: '正在获取支付信息，请稍后再试',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				uni.setStorageSync('webtitle', '支付宝支付');
				uni.setStorageSync('url', this.orderInfo);
				uni.navigateTo({
					url: '/pagesB/webviews/webviews'
				})
			}

				// #endif
				// #ifndef H5
				if (!this.orderInfo) {
					// 如果支付信息为空，重新获取
					that.getOrderInfo(that.currentPayment, currentOrderSn);
					uni.showToast({
						title: '正在获取支付信息，请稍后再试',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				let orderInfo = this.orderInfo.replace('\\', '');
				uni.requestPayment({
					provider: this.currentPayment,
					orderInfo: orderInfo,
					success: (e) => {
						uni.showLoading({
							title: this.$t('lang.pay_success'),
							mask: true
						});

						if (this.doneinfo.extension_code == 'team_buy') {
							uni.redirectTo({
								url: '/pagesA/team/order/order',
								complete: (res) => {
									uni.hideLoading()
								}
							})
						} else {
							uni.redirectTo({
								url: '/pagesB/order/order',
								complete: (res) => {
									uni.hideLoading()
								}
							});
						}
				},
				fail: (e) => {
					console.log(JSON.stringify(e))
					
					// 处理微信客户端未安装的情况
					if (e.errCode === -8 || e.code === -8) {
						uni.showModal({
							title: '提示',
							content: '您还未安装微信客户端，是否前往下载？',
							confirmText: '去下载',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									// 判断是安卓还是iOS
									const systemInfo = uni.getSystemInfoSync();
									const platform = systemInfo.platform;
									
									if (platform === 'android') {
										// 跳转到安卓应用商店下载微信
										// 尝试打开应用宝
										const appStoreUrl = 'market://details?id=com.tencent.mm';
										// 备用：应用宝网页版
										const webStoreUrl = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mm';
										
										// #ifdef APP-PLUS
										plus.runtime.openURL(appStoreUrl, function(e) {
											// 如果打开失败，尝试网页版
											plus.runtime.openURL(webStoreUrl);
										});
										// #endif
										
										// #ifndef APP-PLUS
										window.location.href = webStoreUrl;
										// #endif
									} else if (platform === 'ios') {
										// 跳转到App Store下载微信
										const appStoreUrl = 'https://apps.apple.com/cn/app/wechat/id414478124';
										
										// #ifdef APP-PLUS
										plus.runtime.openURL(appStoreUrl);
										// #endif
										
										// #ifndef APP-PLUS
										window.location.href = appStoreUrl;
										// #endif
									}
								}
							}
						});
					} else {
						// 其他支付失败情况
						uni.showToast({
							title: '支付失败：' + (e.errMsg || '未知错误'),
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
			// #endif
		},
			// app
			getOrderInfo(pay_code, order_sn) {
				// 保存当前请求的订单号，用于验证返回结果
				const requestOrderSn = order_sn;

				uni.request({
					url: this.websiteUrl + '/api/payment/change_app_payment',
					method: 'GET',
					data: {
						platform: uni.getStorageSync('platform'),
						order_sn: order_sn,
						pay_code: pay_code,
						// #ifdef H5
						new_h5: 'new_h5'
						// #endif
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('trade/paycheck request success,11')
						console.log(JSON.stringify(res.data))
						console.log(res.data.data)
						
						// 验证订单号是否匹配（防止使用错误的订单信息）
						const currentOrderSn = this.order_sn || this.doneinfo?.order_sn;
						if (requestOrderSn !== currentOrderSn) {
							uni.showToast({
								title: '订单信息已过期，请重新选择支付方式',
								icon: 'none',
								duration: 2000
							});
							return;
						}

						this.orderInfo = res.data.data.button;
					},
					fail: (res) => {
						console.log('trade/paycheck request fail')
						console.log(JSON.stringify(res))
					}
				})
			},
			// 微信浏览器   +   微信小程序支付 
			getWXOrderInfo(pay_code, order_sn) {
				// 保存当前请求的订单号，用于验证返回结果
				const requestOrderSn = order_sn;
				
				var in_weixin = this.checkIsWeixin();
				uni.request({
					url: this.websiteUrl + '/api/payment/wxapp_change_app_payment',
					method: 'GET',
					data: {
						platform: 'MP-WEIXIN',
						order_sn: order_sn,
						pay_code: pay_code,
						// #ifdef H5
						new_h5: 'new_h5'
						// #endif
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('trade/paycheck request success,11')
						console.log(JSON.stringify(res.data))
						console.log(res.data.data)
						
						// 验证订单号是否匹配（防止使用错误的订单信息）
						const currentOrderSn = this.order_sn || this.doneinfo?.order_sn;
						if (requestOrderSn !== currentOrderSn) {
							uni.showToast({
								title: '订单信息已过期，请重新选择支付方式',
								icon: 'none',
								duration: 2000
							});
							return;
						}

						this.orderInfo = res.data.data.button;
					},
					fail: (res) => {
						console.log('trade/paycheck request fail')
						console.log(JSON.stringify(res))
					}
				})
			},


			// 支付宝 9 微信  20  H5 支付宝微信支付接口，不包含微信浏览器
			getH5OrderInfo(pay_code, order_sn) {
				// 保存当前请求的订单号，用于验证返回结果
				const requestOrderSn = order_sn;

				uni.request({
					url: this.websiteUrl + '/api/payment/change_payment',
					method: 'GET',
					data: {
						platform: 'mobile',
						order_sn: order_sn,
						order_id: this.doneinfo.order_id,
						pay_code: pay_code,
						pay_id: pay_code == 'alipay' ? 9 : 20,
						// pay_id:20,
						// #ifdef H5
						new_h5: 'new_h5'
						// #endif
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('trade/paycheck request success,11')
						console.log(JSON.stringify(res.data))
						console.log(res.data.data)
						console.log('所有参数', res.data)
						
						// 验证订单号是否匹配（防止使用错误的订单信息）
						const currentOrderSn = this.order_sn || this.doneinfo?.order_sn;
						if (requestOrderSn !== currentOrderSn) {
							uni.showToast({
								title: '订单信息已过期，请重新选择支付方式',
								icon: 'none',
								duration: 2000
							});
							return;
						}

						this.orderInfo = res.data.data.button;
						// 如果是微信支付且是微信浏览器环境，保存 jsApiParameters
						if (pay_code == 'wxpay' && this.checkIsWeixin()) {
							this.jsApiParameters = JSON.parse(res.data.data.button.payment);
						}
					},
					fail: (res) => {
						console.log('trade/paycheck request fail')
						console.log(JSON.stringify(res))
					}
				})
			},
			tan(pay_fee) {
				if (pay_fee) {
					uni.showToast({
						title: this.$t('lang.commission_reminder') + pay_fee + this.$t(
							'lang.commission_reminderon'),
						icon: 'none'
					})
				}
			}
		},
		onLoad(e) {
			this.order_sn = e.order_sn;
			// 清空旧的支付信息，避免使用上一个订单的数据
			this.orderInfo = '';
			this.jsApiParameters = '';
			this.currentPayment = '';
			this.$store.dispatch('setDoneInfo', {
				order_sn: this.order_sn
			});
			// 新增环境检查
			// #ifdef H5
			this.checkWechatH5Environment();
			this.isWechatH5 = this.checkIsWeixin();
			// #endif

			// #ifdef H5
			const systemInfo = uni.getSystemInfoSync();
			const ua = systemInfo.userAgent ? systemInfo.userAgent.toLowerCase() : '';
			const isWeChatBrowser = ua.indexOf('micromessenger') !== -1;

			if (isWeChatBrowser) {
				console.log("当前是微信浏览器环境");
				this.wx_alipay = true;
			}
			// #endif

			//获取支付方式
			// #ifndef MP-WEIXIN
			// uni.getProvider({
			// 	service: 'payment',
			// 	success: (res) => {
			// 		console.log(res)
			let providerList = [];
			// 		res.provider.map((value) => {
			//                      switch (value) {
			//                          case 'alipay':
			//                              providerList.push({
			//                                  name: this.$t('lang.alipay'),
			//                                  id: value
			//                              });
			//                              break;
			//                          case 'wxpay':
			//                              providerList.push({
			//                                  name: this.$t('lang.wxpay'),
			//                                  id: value
			//                              });
			//                              break;
			//                          default:
			//                              break;
			//                      }
			//                  });
			providerList = [{
					"name": "支付宝",
					"id": "alipay"
				},
				{
					"name": "微信",
					"id": "wxpay"
				}
			]
			this.payment_list = providerList;
			// 		console.log(this.payment_list)
			// 	} 将循环写法改成固定值写法，在uniapp中
			// });
			// #endif

			// #ifdef MP-WEIXIN
			// 获取小程序订阅消息 拼团进度通知 模板id
			this.getTemplate('5008');
			// #endif
			this.getkehuManageqrcodeurl();
		},
		watch: {
			doneinfo() {
				this.dscLoading = false
			}
		}
	}
</script>

<style lang="scss">
	/* 禁止页面滚动 */
	page {
		height: 100vh;
		overflow: hidden;
	}
	
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
	
	/* 支付选项样式优化 */
	.base_select_item {
		margin: 20upx;
		border: 3upx solid #d9d9d9;
		border-radius: 12upx;
		background-color: #fff;
		transition: all 0.3s ease;
		box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.06);
	}
	
	.base_select_item:active {
		background-color: #f8f8f8;
	}
	
	/* uni-list-cell 样式 */
	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.uni-list-cell-pd {
		padding: 24upx 10upx 24upx 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	
	/* 调整radio按钮位置，让对号向左移动 */
	.uni-list-cell-pd > view:last-child {
		padding-right: 0;
		margin-right: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	/* uni-radio组件样式调整 - 减少右边距让对号向左移动 */
	.uni-list-cell-pd ::v-deep uni-radio {
		margin-right: 0 !important;
		padding-right: 0 !important;
	}
	
	.uni-list-cell-pd ::v-deep .uni-radio-input {
		margin-right: 40rpx !important;
		padding-right: 0 !important;
	}
	
	/* 调整radio按钮容器，让对号向左移动 */
	.uni-list-cell-pd ::v-deep .uni-radio-input-wrapper {
		margin-right: 0 !important;
		padding-right: 0 !important;
	}
	
	/* 支付信息容器 */
	.payment-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	/* 支付宝禁用样式 */
	.disabled-item {
		opacity: 0.5;
		pointer-events: none;
		background-color: #f5f5f5 !important;
		border-color: #d0d0d0 !important;
	}
	
	.disabled-text {
		color: #999 !important;
		font-size: 28upx;
	}
	
	/* 支付宝禁用提醒文本 - 放在按钮内 */
	.alipay-warning-text {
		color: #ff4d4f;
		font-size: 22upx;
		margin-top: 8upx;
		line-height: 1.5;
	}
	
	/* 支付方式分割线 */
	.payment-divider {
		height: 1upx;
		background-color: #f0f0f0;
		margin: 0 20upx;
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

	.flow-done-con .flow-done-price {
		font-size: 28px;
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
		margin: 20px 10px;
	}

	.flow-done-all .btn-bar .btn {
		box-shadow: none;
		margin: 0 10px;
		border-radius: 30px;
	}

	.weixin-content {
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		margin: 0 60upx;
		padding: 150upx 0;
	}

	.weixin-content .weixin-icon {
		width: 120upx;
		height: 120upx;
		margin: 30upx auto;
	}

	.weixin-content .weixin-price .text {
		font-size: 40upx;
	}

	.weixin-content .weixin-price .price {
		color: #f92028;
		font-size: 48upx;
		margin-top: 20upx;
	}

	.weixin-content .weixin-pay-btn button {
		padding: 0;
		font-size: 32upx;
		color: #fff;
		border-radius: 50upx;
		border: 0 !important;
		margin-top: 50upx;
	}


	.swiper-container {
		margin-top: 50rpx;

		.swiper-item {
			background-image: url('https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968094621.png');
			background-size: 100% auto;
			background-repeat: no-repeat;
			width: 710rpx;
			height: 282rpx;
			margin: 0 auto;
			border-radius: 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			text-align: center;

			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}

	.image_1 {
		background-image: url('https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968095762.png');
		background-size: 100% auto;
		background-repeat: no-repeat;
		margin: -11px 20px 0 20p;
		padding: 8px;
	}
</style>