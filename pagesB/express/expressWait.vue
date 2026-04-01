<template>
	<!-- 等待快递员上门取件 -->
	<view class="container">
		<view class="head-status mbot16">
			<!-- 退换货申请详情 -->
			<view class="">
				<view class="sta-top" @click="getlog">
					{{orderInfo.kuaidi_state_text}}
					<text class="red" v-if="orderInfo.pay_status==2">{{orderInfo.pay_money}}</text><text
						v-if="orderInfo.pay_status==2">元</text>
					<uni-icons type="arrowright" size="18" color="#1B1B1B"
						style="font-weight: 600;margin-left: 10rpx;"></uni-icons>
				</view>
				<view class="sta-cen  mtop16">
					{{orderInfo.startDate}}
				</view>
			</view>
			<view class="sta-code" v-if="orderInfo.kuaidi_state==102||orderInfo.kuaidi_state==103">
				<view class="code">
					<text class="ji">寄件码</text> <text class="red">{{orderInfo.pickup_code}}</text>
				</view>
				<view class="copy" @click="oncopy(orderInfo.pickup_code)">
					复制
				</view>
			</view>
		</view>
		<view class="head-tip mbot32" v-if="orderInfo.kuaidi_state==102 ||orderInfo.kuaidi_state==103">
			<image src="/pagesC/static/express/horn.png" class="hornImg"></image>
			{{orderInfo.important_notice}}
		</view>
		<!-- 功能区 -->
		<view class="head-top">
			<!-- 功能工具 -->
			<view class="navlist"
				v-if="orderInfo.kuaidi_state==1 || orderInfo.kuaidi_state==102 ||orderInfo.kuaidi_state==103">
				<view class="navone" v-if="orderInfo.kuaidi_state==103">
					<view class="newdet_top8" @click="toCancel(orderInfo)">
						<image src="/pagesC/static/express/cancel.png" class="newdet_top9"></image>
						<view class="newdet_top10">取消寄件</view>
					</view>
					<view class="newdet_top8" @click="toPay(orderInfo)">
						<image src="/pagesC/static/express/pay.png" class="newdet_top9"></image>
						<view class="newdet_top10">去支付</view>
					</view>
					<view class="newdet_top8" @click="onChat(refoundDetail.shop_name,'',refoundDetail.ru_id)">
						<image src="/pagesC/static/express/service.png" class="newdet_top9"></image>
						<view class="newdet_top10">联系客服</view>
					</view>
					<view class="newdet_top8 " @click="toRider(orderInfo)">
						<image src="/pagesC/static/express/rider.png" class="newdet_top9"></image>
						<view class="newdet_top10">联系快递员</view>
					</view>
				</view>
				<view class="navtwo" v-else>
					<view class="newdet_top7" @click="toCancel(orderInfo)">
						<image src="/pagesC/static/express/cancel.png" class="newdet_top9"></image>
						<view class="newdet_top10">取消寄件</view>
					</view>
					<view class="newdet_top7" @click="toPay(orderInfo)">
						<image src="/pagesC/static/express/pay.png" class="newdet_top9"></image>
						<view class="newdet_top10">去支付</view>
					</view>
					<view class="newdet_top7" @click="onChat(refoundDetail.shop_name,'',refoundDetail.ru_id)">
						<image src="/pagesC/static/express/service.png" class="newdet_top9"></image>
						<view class="newdet_top10">联系客服</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 寄件地址 -->
		<view class="head-content">
			<!-- 寄件地址 -->
			<view class="">
				<view class="ji_info">
					<view class="ji_top" style="">
						<view class="" style="width: 10%;min-width: 10%;">
							<image src="/pagesC/static/express/ji.png" mode="widthFix" class="addrImg"></image>
						</view>
						<view class="">
							<view class="ji-title">
								<text>{{sender.Name}} </text>
								<text style="margin-left: 16rpx;">{{sender.Mobile}}</text>
							</view>
							<view class="ji-content">
								{{sender.ProvinceName}}
								{{sender.CityName}}
								{{sender.ExpAreaName}}
								{{sender.Address}}
							</view>
						</view>
					</view>
				</view>
				<view class="" style="height: 2rpx;background-color: #EDEDED;margin: 10rpx 0rpx;"></view>
				<view class="ji_info">
					<view class="ji_top">
						<view class="" style="width: 10%;min-width: 10%;">
							<image src="/pagesC/static/express/shou.png" mode="" class="addrImg"></image>
						</view>
						<view class="">
							<view class="ji-title" style="position: relative;">
								<text>
									{{receiver.Name}}
								</text>
								<text style="margin-left: 16rpx;">
									{{receiver.Tel}}
								</text>
								<view class="" @click="copyInfo(receiver)"
									style="position: absolute;right: 2%; top: -5%;">
									复制
								</view>
							</view>
							<view class="ji-content ">
								{{receiver.ProvinceName}}
								{{receiver.CityName}}
								{{receiver.ExpAreaName}}
								{{receiver.Address}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 备注 -->
			<view class="ji_remark">
				<text>备注</text>
				<text class="ji-input">{{orderInfo.remark?orderInfo.remark:'无'}}</text>
				<!-- <input type="text" placeholder="如有其他需求可以给快递员备注" class="ji-input" disabled /> -->
			</view>
			<view class="" style="">
				<view class="" style="position: relative;margin: 20rpx 0 10rpx;">
					<text class="title">订单编号</text>
					<text class="time">{{orderInfo.order_sn}}</text>
					<text class="" @click="oncopy(orderInfo.order_sn)" style="position:absolute;right: 3%;">复制</text>
				</view>
				<!-- <text class="title">订单编号</text>
				<text class="time">{{orderInfo.order_sn}}</text>
				<text class="addmark" @click="oncopy(orderInfo.order_sn)" ">复制</text> -->
			</view>
			<view class="" v-if="orderInfo.add_time">
				<text class="title">下单时间</text>
				<text class="time">{{orderInfo.add_time}}</text>
			</view>
		</view>
		<!-- 物流信息 -->
		<view class="express_content" style="margin-top:16rpx;" v-if="orderInfo.logistic_code">
			<view class="express_head">
				<view class="name">
					<text>{{orderInfo.shipper_code}}单号</text>
					<text style="margin-left: 16rpx;">{{orderInfo.logistic_code}}</text>
				</view>
				<view @click="copyexpress(orderInfo.logistic_code)" style="margin-right: 3%;">复制</view>
			</view>
			<!-- 物流进度 -->
			<view class="footer">
				<scroll-view class="warpper" :scroll-y="true" style="max-height: 520rpx;">
					<view class="list" style="position: relative;">
						<uni-icons type="arrowright" size="14" color="#999999 "
							@click="toExpressLog(orderInfo.logistic_code)"
							style="padding: 50rpx;font-weight: 600;margin-left: 10rpx;position: absolute;top: -1%;right: -10%;z-index: 99;"></uni-icons>
						<view id="result" class="result-list sortup">
							<view class="item" v-for="(item, index) in traces" :key="index">
								<view class="col2"><text></text></view>
								<view class="col3">
									<view class="col4">
										<text>{{item.status}}</text>
										<text style="margin-left: 16rpx;">{{item.time}}</text>
									</view>
									<view class="col5" v-if="item.context">
										{{ item.context }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view style="height: 140rpx;" v-if="orderInfo.kuaidi_state==301 ||orderInfo.kuaidi_state==104"></view>
		<view class="btn-goods-actionnew" v-if="orderInfo.kuaidi_state==301 ||orderInfo.kuaidi_state==104">
			<view class="submit-bar-text" @click="onChat(refoundDetail.shop_name,'',refoundDetail.ru_id)">
				<view class=""
					style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
					<view class="">
						<image src="/static/order/kefu.png" mode="widthFix" style="width: 46rpx;height: 40rpx;">
						</image>
					</view>
					<view class="">
						<text class="kefu">联系卖家</text>
					</view>
				</view>
			</view>
			<view class="btn-bar">
				<block v-if="orderInfo.pay_status==0">
					<button type="warn" disabled="true" class="btnnew btn-gray"
						style="color: #a2a2a2;background-color: #EDEDED;border: none;">支付运费</button>
				</block>
				<block v-if="orderInfo.pay_status==1"></block>
				<block v-if="orderInfo.pay_status==2">
					<view class="btnnew btn-red topays" style="" @click="toPay(orderInfo)">支付运费</view>
				</block>
			</view>
		</view>
		<!-- 订单状态 -->
		<uni-popup :show="statusShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose()">
			<view class="fee" style="" @touchmove.stop.prevent="moveHandle">
				<view class="flexbtw" style="">
					<view class="title-1" style="">订单进度</view>
					<view class="" @click="handelClose()">
						<image src="/pagesC/static/express/close.png" mode="" style="width: 50rpx;height: 50rpx;"></image>
					</view>
				</view>
				<view class="footer">
					<scroll-view class="warpper" :scroll-y="true" style="max-height: 600rpx;">
						<view class="list" style="position: relative;">
							<view id="result" class="result-list sortup" v-if="kuaidi_log_list">
								<view class="item" v-for="(item, index) in kuaidi_log_list" :key="index">
									<view class="col2"><text></text></view>
									<view class="col3" style="padding: 0 20rpx;">
										<view class="col4">
											<text>{{item.text}}</text>
										</view>
										<view class="col5" v-if="item.create_time">
											{{ item.create_time }}
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		<!-- 物流信息及支付-->
		<uni-popup :show="feeShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose()">
			<view class="fee" style="" @touchmove.stop.prevent="moveHandle">
				<view class="flexcenter" style="flex-direction: column;">
					<view class="title" style="">快递费支付</view>

					<view class="price">¥{{payInfo.TotalFee}}</view>
				</view>
				<view class="close" @click="handelClose()">
					<image src="/pagesC/static/express/close.png" mode="" style="width: 50rpx;height: 50rpx;"></image>
				</view>
				<view class="express" v-if="orderInfo.pay_info">
					<view class="">
						<view class="provice" style="margin-bottom: 16rpx;">{{sender.CityName}}-{{receiver.CityName}}
						</view>
						<view class="pro_tip" style="margin-bottom: 48rpx;">
							<!-- 首重1kg内¥12，续重¥{{payInfo.FirstWeightAmount}}/kg -->
							首重1kg内¥{{payInfo.FirstWeightAmount}}
						</view>
						<view class="flexcenter">
							<view class="feelist ">
								<view class="left">计费类型</view>
								<view class="left">按重量计费</view>
							</view>
							<view class="feelist">
								<view class="left">首重费</view>
								<view class="right">¥{{payInfo.FirstWeightAmount}}</view>
							</view>
							<view class="feelist">
								<view class="left">续重费</view>
								<view class="right">¥{{payInfo.ContinuousWeightAmount}}</view>
							</view>
							<view class="feelist">
								<view class="left">其他</view>
								<view class="right">¥{{payInfo.OtherFee}}</view>
							</view>
						</view>
					</view>
					<view class="bolid"></view>
				</view>
				<view class="cashier-content">
					<view class="uni-list">
						<radio-group>
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in payment_list"
								:key="index" @click="radioChange(item)">
								<view>
									<image :src="item.img" mode="widthFix" class="payimg"></image>
									<text class="paytext">{{item.pay_name}}</text>
									<text class="paytext" style="margin-left: 16rpx;"
										v-if="item.user_money">({{item.user_money}})</text>
								</view>
								<view>
									<radio :value="item.pay_code" color="#f92028" />
								</view>
							</label>
						</radio-group>
					</view>
				</view>
				<button type="warn" :disabled="disabled" class="addpay flexcenter"
					@click="subpay">支付{{payInfo.TotalFee}}元</button>
			</view>
		</uni-popup>
		<lyy-pass-input ref="passInput" @confirm="confirm" @close="close"></lyy-pass-input>
	</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniNumberKg from "@/components/uni-number-kg.vue";
	export default {
		components: {
			dscCommonNav,
			dscNotContent,
			uniPopup,
			uniNumberKg
		},
		data() {
			return {
				ret_id: '',
				orderInfo: '',
				sender: '',
				receiver: '',
				user_id: '',
				order_id: '',
				order_sn: '',
				feeShow: false,
				statusShow: false,
				pickerInfo: '',
				extendField: '',
				payInfo: '',
				expressInfo: '',
				payment_list: [],
				delivery_sn: 0,
				trackerItem: '',
				listData: '',
				dscLoading: true,
				traces: [],
				back_invoice_no: '',
				disabled: false,
				currentPayment: '',
				itempay: '',
				paypwdValue: '', //余额支付密码
				kuaidi_log_list: '',
				logistic_code: '',
				threeInfo: '',
				scopeSessions: {},
			};
		},
		computed: {
			...mapState({
				refoundDetail: state => state.user.refoundDetail,
				doneinfo: state => state.shopping.doneinfo
			}),
		},
		onReady() {
			var that = this
			that.refoundLoad()
			that.seeMore()
		},
		onLoad(option) {
			var that = this
			// console.log('options', option);
			if (option.params) {
				option = JSON.parse(decodeURIComponent(option.params))
				// console.log(12333, option);
			}
			setTimeout(() => {
				this.ret_id = option.ret_id
				this.relative_number = option.relative_number
				this.user_id = option.user_id
				this.order_id = option.order_id
				this.order_sn = option.order_sn
				this.back_invoice_no = option.back_invoice_no
				that.refoundLoad(this.ret_id)
				that.hasOrder()
				that.getpayList()
				setTimeout(() => {
					that.seeMore(option.back_invoice_no)
				}, 100)
			}, 10)
		},
		onShow() {
			var that = this
		},
		methods: {
			getlog() {
				var that = this
				that.kuaidi_log_list = that.orderInfo.kuaidi_log_list
				that.statusShow = true
			},
			// 余额支付密码组件
			confirm(e) {
				console.log(e.pass)
				this.paypwdValue = e.pass
				this.$refs.passInput.close()
				this.balancepay()
			},
			close() {
				console.log('close')
			},
			moveHandle() {},
			// 支付
			subpay() {
				var that = this
				if (!that.itempay.pay_code) {
					uni.showToast({
						icon: 'none',
						title: '请选择支付方式'
					})
				}
				if (that.itempay.pay_code == 'balance') {
					if (that.itempay.use_paypwd == 1) {
						that.feeShow = false
						this.$refs.passInput.open()
					} else {
						that.balancepay()
					}
				} else {
					var that = this
					// #ifdef MP-WEIXIN
					that.otherpay()
					// #endif
					// #ifdef H5
					// that.otherpay()
					if (this.currentPayment == 'wxpay') {
						// var in_weixin = this.checkIsWeixin();
						// var url = this.orderInfo.mweb_url
						// var url = this.threeInfo.mweb_url
						// console.log(url)
						// if (in_weixin) {
						// this.wxjsPay(url);
						// } else {
						// window.location.href = url;
						// }
					} else if (this.currentPayment == 'alipay') {
						uni.setStorageSync('webtitle', '支付宝支付');
						uni.setStorageSync('url', this.threeInfo);
						uni.navigateTo({
							url: '/pagesB/webviews/webviews'
						})
					}
					// #endif
					// #ifdef APP-PLUS
					let orderInfo = this.threeInfo.replace('\\', '');
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
							uni.showToast({
								icon: 'none',
								title: '支付失败,请重试'
							})
							this.feeShow = false
							that.itempay = ''
						}
					});
					// #endif
				}
			},
			// 获取余额支付
			balancepay() {
				var that = this
				let data = {
					pay_pwd: that.paypwdValue,
					order_code: that.orderInfo.order_code
				}
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/balancepay',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('pay', res);
						if (res.data.data.error == 0) {
							this.paypwdValue = ''
							that.hasOrder()
							uni.showToast({
								icon: 'none',
								title: res.data.data.message
							})
						} else {
							that.feeShow = false
							this.paypwdValue = ''
							uni.showToast({
								icon: 'none',
								title: res.data.data.message
							})
						}
					},
				})
			},
			// 获取三方支付
			otherpay() {
				var that = this
				let data = {
					pay_code: that.itempay.pay_code,
					order_code: that.orderInfo.order_code,
					platform: uni.getStorageSync('platform'),
					// #ifdef MP-WEIXIN
					openid: uni.getStorageSync('scopeSession').openid
					// #endif
				}
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/paymentproof',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('otherpay', res.data.data);
						if (res.data.status == "success") {
							if (res.data.data) {
								this.threeInfo = res.data.data
								// console.log(333, this.threeInfo);
								// #ifdef MP-WEIXIN
								// that.otherpay()
								this.feeShow = false
								that.itempay = ''
								if (this.currentPayment == 'wxpay') {
									let orderInfo = JSON.parse(this.threeInfo)
									uni.requestPayment({
										timeStamp: orderInfo.timeStamp.toString(),
										nonceStr: orderInfo.nonceStr,
										package: orderInfo.package,
										signType: orderInfo.signType,
										paySign: orderInfo.paySign,
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
											console.log(e);
											uni.showToast({
												icon: 'none',
												title: '支付失败,请重试'
											})
										},
										complete(e) {
											console.log(1234, e);
										}
									});
								}
								// #endif
							}
						} else {
							that.feeShow = false
							uni.showToast({
								icon: 'none',
								title: res.data.data.message
							})
						}
					},
				})
			},


			// 获取支付列表
			getpayList() {
				let that = this;
				uni.request({
					url: this.websiteUrl + '/api/kuaidi/paymentlist',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log('getpaylist', res.data.data)
						if (res.data.status === 'success') {
							// that.payment_list = res.data.data
							// #ifdef MP-WEIXIN
							that.payment_list.push(res.data.data[0])
							that.payment_list.push(res.data.data[1])
							// #endif
							// #ifndef MP-WEIXIN
							that.payment_list = res.data.data
							// #endif
						}
					}
				})
			},
			radioChange(e) {
				let that = this
				that.itempay = e
				if (e.pay_code) {
					that.currentPayment = e.pay_code;
				}
				// #ifndef MP-WEIXIN
				that.otherpay()
				// #endif
			},
			handelClose() {
				this.feeShow = false
				this.statusShow = false
				this.itempay = ''
			},
			toCancel(orderInfo) {
				if (orderInfo.kuaidi_state == 1 || orderInfo.kuaidi_state == 102 || orderInfo.kuaidi_state == 103) {
					uni.navigateTo({
						url: '/pagesB/express/expressCancel?ret_id=' + this.ret_id + '&relative_number=' +
							this.relative_number,
					})
				} else {

				}
			},
			toPay(orderInfo) {
				if (orderInfo.pay_status == 2) {
					this.feeShow = true
				} else {
					uni.showToast({
						icon: 'none',
						title: this.orderInfo.no_pay_text
					})
				}
			},
			toRider(orderInfo) {
				let that = this;
				var ephone = this.pickerInfo[0].PersonTel
				uni.showModal({
					title: '联系快递员',
					content: '是否要联系快递员',
					success(res) {
						if (res.confirm) {
							if (ephone.indexOf('#') != -1) {
								ephone = ephone.split('#')
								ephone = ephone[0]
							} else if (ephone.indexOf('_') != -1) {
								ephone = ephone.split('_')
								ephone = ephone[0]
							} else {
								ephone = ephone
							}
							if (uni.getSystemInfoSync().platform == 'ios') {
								uni.makePhoneCall({
									phoneNumber: ephone
								});
							} else {
								plus.android.requestPermissions(
									["android.permission.CALL_PHONE"],
									function(resultObj) {
										var result = 0;
										for (var i = 0; i < resultObj.granted.length; i++) {
											var grantedPermission = resultObj.granted[i];
											result = 1
										}
										for (var i = 0; i < resultObj.deniedPresent.length; i++) {
											var deniedPresentPermission = resultObj.deniedPresent[i];
											result = 0
										}
										for (var i = 0; i < resultObj.deniedAlways.length; i++) {
											var deniedAlwaysPermission = resultObj.deniedAlways[i];
											result = -1
										}
										if (result == 1) {
											uni.makePhoneCall({
												phoneNumber: ephone
											});
										}
									},
									function(error) {

									}
								);
							}

						}
					}
				});
			},
			toExpressLog(logistic_code) {
				console.log('logistic_codelogistic_codelogistic_code', logistic_code);
				if (logistic_code) {
					uni.navigateTo({
						url: '/pagesB/express/expressLog?postid=' + this.logistic_code,
					})
				}
			},
			//物流进度
			seeMore() {
				var that = this;
				let data = {
					type: '1',
					postid: that.back_invoice_no
				}
				uni.request({
					url: this.websiteUrl + '/api/order/tracker',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status === 'success') {
							that.traces = res.data.data.traces
						}
					}
				})
			},
			copyexpress(e) {
				uni.setClipboardData({
					data: e.toString(),
					success: () => {
						uni.showToast({
							title: '快递单号复制成功',
							icon: 'none',
						})
					},
				})
				// uni.setClipboardData({
				// 	data: e.toString(),
				// 	success: function() {
				// 		uni.getClipboardData({
				// 			success: function() {
				// 				uni.showToast({
				// 					title: '复制成功',
				// 					icon: 'none'
				// 				})
				// 			}
				// 		})
				// 	}
				// });
			},
			copyInfo(receiver) {
				var that = this
				var text = receiver.Name + receiver.Tel + receiver.ProvinceName +
					receiver.ExpAreaName + receiver.Address
				uni.setClipboardData({
					data: text.toString(),
					success: () => {
						uni.showToast({
							title: '收件人信息复制成功',
							icon: 'none',
						})
					},
				})
			},
			oncopy(item) {
				var that = this
				uni.setClipboardData({
					data: item.toString(),
					success: () => {
						uni.showToast({
							title: '订单编号复制成功',
							icon: 'none',
						})
					},
				})
			},
			refoundLoad() {
				this.$store.dispatch('setReturnDatail', {
					ret_id: this.ret_id
				})
			},
			// 是否下单 
			hasOrder() {
				var that = this
				let data = {
					user_id: that.user_id,
					order_sn: that.order_sn,
					order_id: that.order_id,
					relative_number: that.relative_number,
				}
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/getorderKudiInfo',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							if (res.data.data.error == 0) {
								that.orderInfo = res.data.data.data
								that.sender = res.data.data.data.sender
								that.receiver = res.data.data.data.receiver
								if (res.data.data.data.logistic_code) {
									that.logistic_code = res.data.data.data.logistic_code
								}
								if (res.data.data.data.pay_info) {
									that.payInfo = res.data.data.data.pay_info
								}
								if (res.data.data.data.picker_info) {
									that.pickerInfo = JSON.parse(res.data.data.data.picker_info)
								}
								if (res.data.data.data.extendField) {
									that.extendField = JSON.parse(res.data.data.data.extendField)
								}
							} else {
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
							}
						}
					},
					fail(error) {
						console.log('error', error);
					}
				})


			},
		},
	}
</script>

<style lang="scss">
	.container {
		box-sizing: border-box;
		padding: 32rpx 32rpx 32rpx;
		height: 100%;
		overflow-y: hidden;
	}

	// * {
	// 	box-sizing: border-box;
	// }

	// ::-webkit-scrollbar {
	// 	display: none;
	// }

	.btn-bar {
		// flex: 1;
		display: flex;
	}

	.head-status {
		display: flex;
		justify-content: space-between;

		.sta-top {
			font-weight: 500;
			font-size: 40rpx;
			color: #1B1B1B;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;

			.red {
				color: #FD3E3C;
			}
		}

		.sta-cen {
			font-weight: 400;
			font-size: 24rpx;
			color: #A2A2A2;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
		}

		.sta-code {
			width: 280rpx;
			height: 68rpx;
			border-radius: 8rpx;
			border: 1rpx solid #FE0302;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.ji {
				margin: 0 16rpx;
			}

			.code {
				// width: 184rpx;
				height: 32rpx;
				font-family: PingFangSC, PingFang SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #1B1B1B;
				line-height: 32rpx;
				font-style: normal;
			}

			.red {
				color: #FE0302;

			}

			.copy {
				width: 68rpx;
				height: 68rpx;
				background: #FE0302;
				border-radius: 8rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
			}
		}
	}

	.head-tip {
		font-weight: 400;
		font-size: 24rpx;
		color: #1B1B1B;
		line-height: 24rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		align-items: center;
	}

	.head-top {
		background: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.head-content {
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		padding: 4px 14px 16px;
		// padding: 20rpx 28rpx 32rpx;
	}

	// 上门取件-寄件人
	.ji_info {
		background-color: #ffffff;
		padding: 28rpx 0;
		border-radius: 20rpx;

		.ji_top {
			display: flex;
			justify-content: left;
			align-items: center;
			font-size: 32rpx;
		}


	}

	.addrImg {
		min-width: 36rpx;
		width: 36rpx;
		height: 36rpx;
		border-radius: 8rpx;
	}

	// 收货地址end

	.newdet_top7 {
		width: 33%;
		text-align: center;
		display: inline-block;
		vertical-align: middle;
		border-radius: 8upx;
	}

	.newdet_top8 {
		width: 25%;
		text-align: center;
		display: inline-block;
		vertical-align: middle;
		border-radius: 8upx;
	}

	.newdet_top9 {
		width: 40upx;
		height: 40upx;
		margin-bottom: -8rpx;
	}

	.hornImg {
		width: 32upx;
		height: 32upx;
		margin-right: 20rpx;
	}

	.newdet_top10 {
		padding-top: 20upx;
		color: #1B1B1B;
		font-size: 24upx;
		line-height: 32upx;
	}

	.newdet_top100 {
		padding-top: 16upx;
		color: #FFB211;
		font-size: 26upx;
		line-height: 32upx;
	}

	.navlist {
		background: #FFFFFF;
		border-radius: 20rpx;

		.navone {
			padding: 32rpx 20rpx 32rpx 12rpx;
		}

		.navtwo {
			padding: 32rpx;
		}

		.nav-img {}

		.nav-title {
			width: 96rpx;
			height: 24rpx;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #1B1B1B;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
		}
	}

	.ji-title {
		font-weight: 400;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 36rpx;
		text-align: left;
		font-style: normal;
		margin-bottom: 16rpx;
	}

	.ji-content {
		font-weight: 400;
		font-size: 28rpx;
		color: #A2A2A2;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
	}

	.ji_remark {
		background: #FFF4F4;
		border-radius: 8rpx;
		padding: 14rpx 16rpx;
		display: flex;
		align-items: center;

		.ji-input {
			margin-left: 16rpx;
			margin-right: 20rpx;
			width: 392rpx;
			height: 28rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #A2A2A2;
			line-height: 28rpx;
			text-align: left;
			font-style: normal;
		}

	}

	.addmark {
		font-weight: 400;
		font-size: 28rpx;
		// color: #FE0302;
		line-height: 70rpx;
		// text-align: right;
		font-style: normal;
		width: 110rpx;
	}

	.title {
		font-weight: 400;
		font-size: 28rpx;
		color: #A2A2A2;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
	}

	.time {
		font-weight: 400;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
		margin: 0 32rpx;
	}

	uni-view {
		font-size: 14px;
		line-height: normal;
	}

	.fee {
		display: flex;
		position: relative;
		flex-direction: column;
		padding: 32rpx;

		/* #ifdef MP-WEIXIN */
		padding: 32rpx;
		/* #endif */

		.close {
			position: absolute;
			top: 14rpx;
			right: 28rpx;
			width: 50rpx;
			height: 50rpx;
		}

		.title {
			font-weight: 400;
			font-size: 36rpx;
			color: #1B1B1B;
			line-height: 36rpx;
			text-align: center;
			font-style: normal;
		}

		.title-1 {
			font-weight: 400;
			font-size: 36rpx;
			color: #1B1B1B;
			line-height: 36rpx;
			text-align: left;
			font-style: normal;
		}

		.price {
			height: 64rpx;
			font-family: PingFangSC, PingFang SC;
			font-weight: 500;
			font-size: 68rpx;
			color: #FD3E3C;
			line-height: 64rpx;
			text-align: center;
			font-style: normal;
			margin-bottom: 40rpx;
		}

		.provice {
			font-weight: 400;
			font-size: 36rpx;
			color: #1B1B1B;
			line-height: 36rpx;
			text-align: left;
			font-style: normal;

		}

		.pro_tip {
			font-weight: 400;
			font-size: 24rpx;
			color: #A2A2A2;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
		}

		.addpay {
			width: 600rpx;
			height: 88rpx;
			background: #FE0302;
			box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
			border-radius: 44rpx;
			font-weight: 400;
			color: #FFFFFF;
			text-align: center;
			font-size: 36rpx;
			// margin: 0 76rpx;
			margin-left: 38rpx;
			line-height: 78rpx;
			display: flex;
			justify-content: center;
		}

		.payimg {
			// width: 56rpx;
			// height: 56rpx;
			// margin-right: 32rpx;
			// margin-bottom: -14rpx;
			/* #ifndef MP-WEIXIN */
			width: 56rpx;
			height: 56rpx;
			margin-bottom: -14rpx;
			margin-right: 32rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			width: 46rpx;
			height: 46rpx;
			margin-bottom: -10rpx;
			margin-right: 32rpx;
			/* #endif */
		}

		.paytext {
			font-weight: 400;
			font-size: 36rpx;
			color: #1B1B1B;
			text-align: left;
			font-style: normal;
			margin-top: 10rpx;
		}
	}

	.bolid {
		width: 686rpx;
		height: 2rpx;
		background-color: #EDEDED;
		margin: 0rpx 0 10rpx;
	}

	.flexcenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cashier-content {
		margin-bottom: 40upx;
	}

	.flexcenter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}

	.feelist {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-bottom: 32rpx;

		.left {
			height: 32rpx;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #1B1B1B;
			line-height: 32rpx;
			text-align: left;
			font-style: normal;
		}

		.right {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #FD3E3C;
			line-height: 32rpx;
			text-align: right;
			font-style: normal;
		}
	}

	.uni-list:before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 0px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #FFFFFF;
	}

	.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 0px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #FFFFFF;
	}

	.uni-list-cell:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 15px;
		height: 0px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #FFFFFF;
	}

	.uni-popup-bottom[data-v-db6fc938] {
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		z-index: 10002;
		border-radius: 9px 9px 0 0;
	}

	.uni-list-cell-pd {
		/* #ifndef MP-WEIXIN */
		padding: 9px 0px;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding: 4px 0px;
		/* #endif */
	}

	.express_head {
		font-weight: 400;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.express_info {}

	.express_content {
		padding: 36rpx 32rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}





	.footer {
		height: calc(100% - 160upx);
		padding-top: 30upx;
	}

	.footer .warpper {
		position: relative;
		height: 50%;
	}

	.footer .info {
		background: #fff;
		border-radius: 20upx;
		padding: 20upx;
		margin: 0 10upx 20upx;
	}

	.footer .info .item {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 28upx;
		line-height: 2;
		color: #666;
	}

	.footer .info .item .value {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.footer .info .item .value .copy {
		margin-left: 40upx;
		cursor: pointer;
		color: #007AFF;
	}

	.footer .list {
		background: #fff;
		border-radius: 20upx 20upx 0 0;
		margin: 0 10upx;
	}

	.footer .list .result-list {
		position: relative;
	}

	.footer .list .result-list .item {
		border: 0;
		display: flex;
		flex-direction: row;
		color: #828282;
		font-size: 24rpx;
		color: #A2A2A2;
		line-height: 24rpx;
		text-align: left;
		font-style: normal;
	}

	.footer .list .result-list .item view {
		line-height: 1.5;
	}

	.footer .list .result-list .item .col1 {
		padding: 20upx;
		width: 200upx;
		text-align: center;
		box-sizing: border-box;
		font-size: 26upx;
		font-weight: 700;
	}

	.footer .list .result-list .item .col2 {
		position: relative;
		width: 40upx;
	}

	.footer .list .result-list .item .col2 text {
		border: 1px solid #e6e6e6;
		border-radius: 50%;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -.5rem;
		width: 1rem;
		height: 1rem;
		background: #FFF;
		z-index: 2;
		color: #e6e6e6;
	}

	.footer .list .result-list .item .col2 text::before {
		position: absolute;
		top: 50%;
		left: 50%;
		content: '';
		width: 6px;
		height: 6px;
		margin-top: -2px;
		border-left: 1px solid;
		border-bottom: 1px solid;
		transform: translate(-50%, 0) rotate(135deg);
	}

	.footer .list .result-list .item .col3 {
		padding: 20upx;
		flex: 1;
		display: flex;
		position: relative;
		flex-direction: column;
	}

	.footer .list .result-list .item .col3::before {
		content: '';
		position: absolute;
		top: -2rem;
		bottom: -2rem;
		left: -12px;
		border-left: 1px solid #e6e6e6;
	}

	.footer .list .result-list .item .col4 {
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
	}

	.footer .list .result-list .item .col5 {
		font-weight: 400;
		font-size: 24rpx;
		color: #A2A2A2;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		margin-top: 6rpx;
	}

	// .footer .list .result-list .item:first-child {
	// 	color: #FE0302;
	// }
	.footer .list .result-list .item:first-child .col3 text {
		color: #FE0302;
	}

	.footer .list .result-list .item:first-child .col2 text {
		border-color: #FE0302;
		color: #FE0302;
	}

	.footer .list .result-list .item:first-child .col3::before {
		top: 50%;
	}

	.footer .list .result-list .item:last-child .col3::before {
		bottom: 50%;
	}

	.btn-bar {
		// flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.btn-goods-actionnew .submit-bar-text uni-text {
		margin-right: 0px;
	}

	.topays {
		// #ifdef MP-WEIXIN
		width: 184rpx;
		// #endif
		// #ifndef MP-WEIXIN
		width: 128rpx;
		// #endif
	}
</style>