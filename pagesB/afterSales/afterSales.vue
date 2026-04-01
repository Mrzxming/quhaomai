<template>
	<view class="section-list">
		<view class="flex-between mbot16 plr32" style="height: 80rpx;background: #FFFAD5;" v-if="isshowtop==true">
			<view class="flex-between cored fs28">
				<image src="https://images.eqingqu.com/attachs/photo/202511/20251126_3FB0301ECBDC732CD070925F402FBBAB.png" mode="heightFix" class="img36 "></image>
				<span class="ml20">上门取件 ｜ 有未支付订单</span>
			</view>
			<view class="fs26 " @click="clickwaitpay">
				<span class="mr10">查看</span>
				<uni-icons type="arrowright" size="14" color="#878787"></uni-icons>
			</view>
		</view>
		<block v-if="order_id == 0">
			<block v-if="refoundList && refoundList.length > 0">
				<section class="user-item" v-for="(itemList,index) in refoundList" :key="index">
					<view class="item-hd">
						<view class="subHead">
							<view class="h4">
								<text class="label">{{$t('lang.order_sn')}}：</text>
								<text class="span">{{ itemList.order_sn }}</text>
							</view>
							<view class="p" style="width: 670rpx;display: flex;justify-content: space-between;">
								<view class="">
									<text class="label">{{$t('lang.apply_time')}}： </text>
									<text class="label">{{ itemList.apply_time }}</text>
								</view>
								<view class="">
									<text class="color-red m-r05"
										v-if="itemList.agree_apply == 0">{{$t('lang.to_be_agreed')}}</text>
									<text class="color-red m-r05"
										v-else-if="itemList.agree_apply == 1">{{$t('lang.has_agreed_to')}}</text>
									<text class="color-red m-r05" v-else>{{$t('lang.denied')}}</text>
									<text class="color-red">{{ itemList.reimburse_status }}</text>
								</view>
								<!-- <text class="label">{{$t('lang.apply_time')}}： </text>
								<text class="label">{{ itemList.apply_time }}</text>
								<text class="color-red m-r05" v-if="itemList.agree_apply == 0">{{$t('lang.to_be_agreed')}}</text>
								<text class="color-red m-r05" v-else-if="itemList.agree_apply == 1">{{$t('lang.has_agreed_to')}}</text>
								<text class="color-red m-r05" v-else>{{$t('lang.denied')}}</text>
								<text class="color-red">{{ itemList.reimburse_status }}</text> -->
							</view>
						</view>
					</view>
					<view class="flow-checkout-pro">
						<view class="item-bd">
							<view class="list-bd-box" v-for="(item,index) in itemList.goods_list">
								<view class="dis-box">
									<view class="reture-left-img">
										<view class="img-box">
											<image :src="item.goods_thumb" class="img" v-if="item.goods_thumb">
											</image>
										</view>
									</view>
									<view class="reture-right-cont">
										<text class="tit twolist-hidden">{{ item.goods_name }}</text>
										<view class="reture-footer">
											<view class="price">
												<text class="span"
													v-if="item.get_return_goods">{{$t('lang.number')}}×{{ item.get_return_goods.return_number }}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="dis-box" style="justify-content: flex-end;align-items: center;">
									<view class="fr">
										<view class="btn-default-yellow"
											@click="applyRefoundView(item.ret_id,item.order_id)">
											{{$t('lang.view_detail')}}
										</view>
									</view>
								</view>
								<!-- <view class="list-status"
									v-show="itemList.return_type_text&&itemList.refound_status_text&&itemList.actual_return">
									<text class="type_text">{{itemList.return_type_text}}成功</text>
									<text class="status_text">{{itemList.refound_status_text}}</text>
									<text class="money_text">¥{{itemList.actual_return}}</text>
								</view>
								<view class="dis-box" style="justify-content: flex-end;align-items: center;">
									<view class="fr">
										<view class="btn-default-yellow" @click="applyRefoundView(itemList.ret_id)">
											{{$t('lang.view_detail')}}
										</view>
										<block v-if="itemList.refound_cancel">
											<view class="btn-default-new"
												@click="cancelRefound(itemList.ret_id,itemList.relative_number)">
												{{$t('lang.cancel_request')}}
											</view>
										</block>
										<block v-if="itemList.activation_type">
											<view class="btn-default-new uni-center"
												@click="applyRefoundjihuo(itemList.ret_id)">{{$t('lang.activate')}}
											</view>
										</block>
										<view class="btn-default-new1" v-show="itemList.return_type!==3" @click="toPickDoor(itemList)">
											去退货
										</view>
									</view>
								</view>-->
							</view>
							<view class="list-status" @click="getLog(itemList)">
								<text class="type_text">{{itemList.return_type_text}}</text>
								<text class="status_text">{{itemList.refound_status_text}}</text>
								<text class="money_text"
									v-show="itemList.actual_return>0">¥{{itemList.actual_return}}</text>
									<text style="margin-left: 10rpx;" class="money_text" v-if="itemList.return_shipping_fee ">{{itemList.return_shipping_fee_text}}</text>
								<uni-icons type="arrowright" size="16" color="#A2A2A2"
									style="font-weight: 500; margin-left: 10rpx;position: absolute;right: 6%;"></uni-icons>
							</view>
							<view class="dis-box"
								style="justify-content: flex-end;align-items: center;margin-top: 32rpx;">
								<view class="fr">
									<block v-if="itemList.refound_cancel">
										<view class="btn-default-new"
											@click="cancelRefound(itemList.ret_id,itemList.relative_number)">
											{{$t('lang.cancel_request')}}
										</view>
									</block>
									<block v-if="itemList.activation_type">
										<view class="btn-default-new uni-center"
											@click="applyRefoundjihuo(itemList.ret_id)">{{$t('lang.activate')}}
										</view>
									</block>
									<view class="btn-default-new1" v-show="itemList.return_type!==3"
										@click="toPickDoor(itemList)">
										去退货
									</view>
									<view class="btn-default-new1" style="color: red;border:1rpx solid red"
										v-show="itemList.sale_order_pay_status==1" @click="toPickDoor(itemList)">
										支付运费
									</view>
								</view>
							</view>
						</view>
					</view>
				</section>
			</block>
			<block v-else>
				<dsc-not-content></dsc-not-content>
			</block>
		</block>
		<block v-else>
			<section class="user-item" v-if="orderRefound">
				<view class="item-hd">
					<view class="subHead">
						<h4>
							<label>{{$t('lang.order_sn')}}：</label>
							<span>{{ orderRefound.order_sn }}</span>
						</h4>
						<p>
							<span>{{$t('lang.apply_time')}}： </span>
							<span class="m-r05">{{ orderRefound.formated_add_time }}</span>
						</p>
					</view>
				</view>
				<view class="flow-checkout-pro">
					<view class="item-bd">
						<checkbox-group @change="checkboxChange">
							<view class="list-bd-box" v-for="(item,index) in orderRefound.goods" :key="index">
								<view class="dis-box">
									<view class="reture-checkbox">
										<checkbox :value="item.rec_id" :checked="item.checked"
											:disabled="orderRefound.all_refound == 1 || item.is_refound == 1 || (item.goods_cause && item.goods_cause.length == 0) || item.extension_code == 'package_buy' " />
									</view>
									<view class="reture-left-img">
										<view class="img-box">
											<img :src="item.goods_thumb" class="img" v-if="item.goods_thumb" />
										</view>
									</view>
									<view class="reture-right-cont">
										<text class="tit onelist-hidden">{{ item.goods_name }}</text>
										<view class="price">
											<text class="color-red">{{ item.goods_price }}</text>
											<span>×{{ item.goods_number }}</span>
										</view>
										<view class="reture-footer">
											<view class="goods-cause color-red" style="width: 60%;"
												v-if="item.goods_cause_formated != '' ">{{ item.goods_cause_formated }}
											</view>
											<view class="goods-operation">
												<block v-if="item.is_refound">
													<span class="color-red f-06">{{$t('lang.applied')}}</span>
												</block>
												<block v-else>
													<block
														v-if="(item.goods_cause && item.goods_cause.length == 0) || item.extension_code == 'package_buy'">
														<view class="btn-default-new disabled">
															{{$t('lang.apply_return')}}
														</view>
													</block>
													<block v-else>
														<view v-if="orderRefound.all_refound != 1"
															class="btn-default-new"
															@click="applyRefound(item.rec_id,orderRefound.order_id)">
															{{$t('lang.apply_return')}}
														</view>
													</block>
												</block>
											</view>
										</view>
									</view>
								</view>
							</view>
						</checkbox-group>

						<view class="checkall">
							<view class="checkbox"
								:class="{'checked':checkedAll,'checkbox-disabled':checkedAllDisabled}"
								@click="checkAll">
								<view class="reture-checkbox">
									<checkbox :value="checkedAll" :checked="checkedAll"
										:disabled='checkedAllDisabled' />
								</view>
								<label>{{$t('lang.checkd_all')}}</label>
							</view>
						</view>

					</view>
					<view class="btn-bar">
						<block v-if="orderRefound.all_refound == 1">
							<button type="warn" @click="onApply('all')">{{$t('lang.oud_apply_return_alt')}}</button>
						</block>
						<block v-else>
							<button type="warn" :disabled="btndisabled"
								@click="onApply">{{$t('lang.oud_apply_return_alt')}}</button>
						</block>
					</view>
				</view>
			</section>
		</block>
		<dsc-common-nav></dsc-common-nav>
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<!-- 订单状态 -->
		<uni-popup :show="logShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose()">
			<view class="fee" style="padding: 32rpx;" @touchmove.stop.prevent="moveHandle">
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
											<text>{{item.action_note}}</text>
										</view>
										<view class="col5">
											{{ item.log_time }}
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components: {
			dscCommonNav,
			dscNotContent,
			uniPopup
		},
		data() {
			return {
				isshowtop: false,
				order_id: 0,
				page: 1,
				size: 10,
				btndisabled: true,
				rec_id: '',
				logShow: false,
				checkedAll: false,
				checkedAllDisabled: false,
				xuanlength: 0,
				version: '3.2.3',
				orderInfo: '',
				kuaidi_log_list: '',
				back_invoice_no: ''
				// dscLoading: true
			};
		},
		computed: {
			...mapState({
				orderRefound: state => state.user.orderRefound,
				refoundDetail: state => state.user.refoundDetail,
			}),
			refoundList: {
				get() {
					return this.$store.state.user.refoundList
				},
				set(val) {
					this.$store.state.user.refoundList = val
				}
			}
		},
		methods: {
			clickwaitpay() {
				let o = {
					sale_order: 1,
				}
				this.$store.dispatch('setRefoundList', {
					page: this.page,
					size: 10,
					sale_order: 1,
					app_version: this.version,
				})
			},
			handelClose() {
				this.logShow = false
			},
			moveHandle() {},
			getLog(list) {
				var that = this
				// console.log(678, list.order_return_log_list);
				if (list.order_return_log_list) {
					that.kuaidi_log_list = list.order_return_log_list
					that.logShow = true
				}
			},
			// 是否下单
			hasOrder() {
				var that = this
				let data = {
					user_id: that.refoundDetail.user_id,
					ru_id: that.refoundDetail.ru_id,
					order_sn: that.refoundDetail.order_sn,
					order_id: that.refoundDetail.order_id,
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
						console.log('hasOrder0', res);
						if (res.data.status == 'success') {
							if (res.data.data.error == 0) {
								that.orderInfo = res.data.data.data
								console.log('order', that.orderInfo);
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
							}
						}
					},
				}, )
			},

			// 去退货
			toPickDoor(item) {
				var that = this
				// console.log(8888, item);
				// console.log(888888, item.back_shipping_name)
				//  ==999--上门取件已下单  ‘’没下单+没单号 -去发货  -上门取件
				if (item.huanhui_address_id == 0) {
					uni.showToast({
						icon: 'none',
						title: item.huanhui_address_no_text
					})
					return;
				}
				if (!item.back_shipping_name) {
					// 去发货
					let data = {
						user_id: item.user_id,
						order_sn: item.order_sn,
						order_id: item.order_id,
						relative_number: item.relative_number,
					}
					// console.log(66, data);
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
							// console.log('hasOrder1', res.data);
							if (res.data.back_invoice_no) {
								this.back_invoice_no = res.data.back_invoice_no
							}
							if (res.data.data.error == 0) {
								that.orderInfo = res.data.data.data
								// console.log('order', that.orderInfo);
								uni.navigateTo({
									url: '/pagesB/express/pickupDoor?ret_id=' + item.ret_id +
										'&relative_number=' + item.relative_number + '&user_id=' +
										item.user_id +
										'&order_id=' + item.order_id + '&order_sn=' + item
										.order_sn,
								})
							} else if (res.data.data.error == 1) {
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
							} else if (res.data.data.error == 2) {
								setTimeout(() => {
									uni.showToast({
										icon: 'none',
										title: res.data.data.message,
									})
									uni.navigateTo({
										url: '/pagesB/express/pickupDoor?ret_id=' + item
											.ret_id +
											'&relative_number=' + item.relative_number +
											'&user_id=' +
											item.user_id +
											'&order_id=' + item.order_id + '&order_sn=' +
											item
											.order_sn,
									})
								}, 100)
							} else if (res.data.data.error == 3) {
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
								uni.navigateTo({
									// url: '/pagesC/tracker/tracker?order_id=' + item.order_id
									url: '/pagesB/express/expressLog?order_id=' + item.order_id +
										'&invoice_no=' + this.back_invoice_no
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: res.data.data.message
								})
							}
						},
					}, )
				} else {
					if (item.back_shipping_name && item.back_shipping_name == 999) {
						//等待快递员取件页面
						uni.navigateTo({
							url: '/pagesB/express/expressWait?ret_id=' + item.ret_id +
								'&relative_number=' + item.relative_number + '&user_id=' + item.user_id +
								'&order_id=' + item.order_id + '&order_sn=' + item.order_sn + '&back_invoice_no=' +
								item.back_invoice_no,
						})
					} else {
						// 获取物流信息  订单追踪
						uni.navigateTo({
							// url: '/pagesC/tracker/tracker?order_id=' + item.order_id
							url: '/pagesB/express/expressLog?order_id=' + item.order_id + '&invoice_no=' + item
								.back_invoice_no
						})
					}
				}
			},
			//列表
			setRefoundList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				console.log('this.order_id=' + this.order_id)
				if (this.order_id == 0) {
					this.$store.dispatch('setRefoundList', {
						page: this.page,
						size: 10,
						order_id: this.order_id,
						app_version: this.version,
					})
				} else {
					this.$store.dispatch('setOrderRefound', {
						order_id: this.order_id
					})
				}
			},
			onApply(type) {
				let rec_id;
				if (type == 'all') {
					let rec_all = this.orderRefound.goods.map(function(val, index) {
						return val.rec_id
					});
					rec_id = rec_all.join(',');
				} else {
					rec_id = this.rec_id
				}

				//判断结尾是否是','
				if (rec_id[rec_id.length - 1] == ',') {
					rec_id = rec_id.substring(0, rec_id.length - 1);
				}

				this.applyRefound(rec_id, this.order_id)
			},
			applyRefound(rec_id, order_id) {
				uni.navigateTo({
					url: '/pagesB/afterSales/applyReturn/applyReturn?rec_id=' + rec_id + '&order_id=' + order_id,
				})
			},
			applyRefoundView(ret_id, order_id) {
				uni.navigateTo({
					url: '/pagesB/afterSales/detail/detail?ret_id=' + ret_id + '&order_id=' + order_id,
				})
			},
			applyRefoundjihuo(ret_id) {
				let that = this;
				uni.showModal({
					title: that.$t('lang.hint'),
					content: that.$t('lang.return_order_activate'),
					success(res) {
						if (res.confirm) {
							uni.request({
								url: that.websiteUrl + '/api/refound/active_return_order',
								method: 'POST',
								data: {
									ret_id: ret_id
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									if (res.data.status == 'success') {
										if (res.data.data.code == 0) {
											uni.showModal({
												title: that.$t('lang.hint'),
												content: that.$t('lang.return_order_activate')
											});
											that.setRefoundList()
										} else {
											uni.showModal({
												title: that.$t('lang.hint'),
												content: res.data.data.msg
											});
										}
									}
								}
							});
						}
					}
				});
			},
			cancelRefound(ret_id, relative_number) {
				let that = this;
				uni.showModal({
					title: that.$t('lang.hint'),
					content: that.$t('lang.confirm_cancel_request'),
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '取消中~'
							})
							uni.request({
								url: that.websiteUrl + '/api/refound/cancel',
								method: 'POST',
								data: {
									ret_id: ret_id,
									relative_number: relative_number,
									app_version: that.version,
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									uni.hideLoading()
									if (res.data.status == 'success') {
										if (res.data.data.code == 0) {
											uni.showModal({
												title: that.$t('lang.hint'),
												content: that.$t('lang.return_order_cancel')
											});
											that.setRefoundList()
										} else {
											uni.showModal({
												title: that.$t('lang.hint'),
												content: res.data.data.msg
											});
										}
									}
								}
							});
						}
					}
				})
			},
			checkboxChange(e) {
				console.log(e)
				let arr = ''
				var abc = []
				var cbd = []
				this.orderRefound.goods.forEach(i => {
					e.detail.value.forEach(v => {
						if (v == i.rec_id) {
							arr += i.rec_id + ','
							abc.push(i.rec_id)
						}
					})
					if (!(this.orderRefound.all_refound == 1 || i.is_refound == 1 || (i.goods_cause && i
							.goods_cause.length == 0) || i.extension_code == 'package_buy')) {
						cbd.push(i.rec_id)
					}
				})
				this.rec_id = arr
				console.log(abc.length)
				console.log(cbd.length)
				this.xuanlength = abc.length
				if (this.xuanlength == cbd.length) {
					this.checkedAll = false
					this.checkAll()
					// this.checkedAll = true
				} else {
					this.checkedAll = false
				}
			},

			checkAll() {
				if (this.checkedAllDisabled == true) {
					return;
				} else {
					let arr = ''
					if (this.checkedAll == false) {
						this.orderRefound.goods.forEach(i => {
							if (!(this.orderRefound.all_refound == 1 || i.is_refound == 1 || (i.goods_cause && i
									.goods_cause.length == 0) || i.extension_code == 'package_buy')) {
								arr += i.rec_id + ','
								i.checked = true
							}

						})

						this.rec_id = arr
						this.checkedAll = true
					} else {
						this.orderRefound.goods.forEach(i => {
							if (!(this.orderRefound.all_refound == 1 || i.is_refound == 1 || (i.goods_cause && i
									.goods_cause.length == 0) || i.extension_code == 'package_buy')) {
								i.checked = false
								// console.log('这里')
							}
						})

						this.rec_id = ''
						this.checkedAll = false
					}
					// console.log(this.rec_id)
				}
			},
		},
		async onLoad(e) {
			var that = this
			// console.log(e)
			that.order_id = e.id ? e.id : 0;
			that.setRefoundList(1)
			// setTimeout(function() {
			var ab = 0
			for (var i = 0; i < that.orderRefound.goods.length; i++) {
				if (that.orderRefound.all_refound == 1 || that.orderRefound.goods[i].is_refound == 1 || (
						that
						.orderRefound.goods[i].goods_cause && that.orderRefound.goods[i].goods_cause
						.length ==
						0) || that.orderRefound.goods[i].extension_code == 'package_buy') {
					ab += i
				}
			}
			if (ab == that.orderRefound.goods.length) {
				console.log(ab)
				that.checkedAllDisabled = true
			}
			// console.log('uid', uni.getStorageSync('userInfo').id);
			// setTimeout(() => {
			const systemInfo = uni.getSystemInfoSync();
			// #ifdef H5
			const uniAppVersion = systemInfo.appVersion;
			// #endif
			// #ifndef H5
			const uniAppVersion = systemInfo.appWgtVersion;
			// #endif
			this.version = uniAppVersion
			// this.version = '3.2.3';
			// console.log(3333333, this.version)
			// }, 10)
			// }, 500);
			// console.log(222, that.orderRefound);
		},
		onShow() {
			uni.request({
				url: 'https://www.ok9288.com/api/refound/sale_order_pay_num',
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					if (res.data && res.data.data == 1) {
						this.isshowtop = true
					} else{
						this.isshowtop = false
					}
				}
			})
		},
		onReachBottom() {
			if (this.page * this.size == this.refoundList.length) {
				this.page++
				this.setRefoundList()
			}
		},
		watch: {
			rec_id() {
				this.btndisabled = this.rec_id ? false : true
			},
			// order_id() {
			// 	console.log(1, 111, this.order_id);
			// 	if ( this.orderRefound) {
			// 		this.dscLoading = false
			// 	} else if (this.refoundList.length > 0) {
			// 		this.dscLoading = false
			// 	}
			// }
			// orderRefound() {
			// 	if (this.orderRefound.order_id) {
			// 		this.dscLoading = false
			// 	}
			// }
		}
	}
</script>
<style lang="scss" scoped>
	@mixin box() {
		display: flex;
	}

	@mixin box-flex() {
		flex: 1;
		display: block !important;
		width: 100%;
	}

	.dis-box {
		@include box();
	}

	.color-red {
		color: #f92028;
	}

	.fr {
		float: right;
		// line-height: normal;
	}

	.m-r05 {
		margin-right: 10upx;
	}

	.btn-default-new {
		display: inline-block;
		padding: 0upx 30upx;
		font-size: 28upx;
		color: #1B1B1B;
		margin-left: 10upx;
		background: #FFFFFF;
		border-radius: 46rpx;
		border: 2rpx solid #BBBBBB;
		line-height: 60rpx;
	}

	.btn-default-new1 {
		display: inline-block;
		padding: 0upx 30upx;
		font-size: 28upx;
		color: #1B1B1B;
		margin-left: 10upx;
		background: #FFFFFF;
		border-radius: 46rpx;
		border: 2rpx solid #1B1B1B;
		line-height: 60rpx;
	}

	.btn-default-yellow {
		width: 140rpx;
		height: 52rpx;
		background: #FFFFFF;
		border-radius: 46rpx;
		border: 2rpx solid #FFB211;
		color: #FFB211;
		text-align: center;
		line-height: 52rpx;
		font-size: 24rpx;
	}

	.btn-default-new.disabled {
		background-color: #fff;
		border: 1upx solid #ccc;
		color: #ccc;
	}


	.btn-default-red {
		width: 140rpx;
		height: 52rpx;
		background: #FFFFFF;
		border-radius: 46rpx;
		border: 2rpx solid #FE0302;
		color: #FE0302;
		text-align: center;
		line-height: 52rpx;
		font-size: 24rpx;
	}

	.user-item .item-bd {
		padding: 28upx 26upx;
	}

	.user-item .subHead .h4 .label,
	.user-item .subHead .p .label {
		font-size: 28upx;
		color: #999;
		font-weight: 400;
	}

	.user-item .subHead p span {
		height: 40upx;
		line-height: 40upx;
		display: inline-block;
		float: left;
	}

	.reture-checkbox {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10upx;
	}

	.reture-left-img {
		width: 140upx;
		margin: 0 12upx 12upx 0;

		.img-box {
			position: relative;
			display: block;
			padding-top: 100%;

			.img {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			span {
				position: absolute;
				font-size: 28upx;
				left: 1px;
				right: 0;
				bottom: 0;
				padding: 8upx 0;
				text-align: center;
				display: block;
				background: rgba(0, 0, 0, 0.6);
				color: #fff;
			}
		}
	}

	.reture-right-cont {
		margin-left: 8upx;
		@include box-flex();

		.tit {
			font-size: 30upx;
			font-size: 28rpx;
			color: #1B1B1B;
			// color: #444;
		}

		.p-attr {
			font-size: 26upx;
			color: #999;
			margin-top: 10upx;
		}

		.reture-footer {
			margin-top: 5upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.p-virtual {
			margin-top: 8upx;

			.virtual-item {
				color: #999;
				line-height: 1.5
			}
		}

		.price .span {
			// color: #999;
			color: #1B1B1B;
			font-size: 24upx;
		}
	}

	.reture-right-san {
		margin: 66upx 0 0 10upx;
	}

	.product-list {
		.product-div {
			padding: 26upx 0 0;
		}
	}

	.btn-bar {
		padding: 40upx 0;
	}

	.btn-bar button {
		width: 90%;
	}

	.list-status {
		// width: 686rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #F5F5F5;
		border-radius: 12rpx;
		margin-top: 32rpx;
		padding: 0 32rpx;
	}

	.type_text {
		font-weight: 600;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
	}

	.status_text {
		font-weight: 400;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
		margin: 0 16rpx;
	}

	.money_text {
		font-weight: 600;
		font-size: 28rpx;
		color: #FE0302;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
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

	.title-1 {
		font-weight: 400;
		font-size: 18px;
		color: #1B1B1B;
		line-height: 18px;
		text-align: left;
		font-style: normal;
	}
</style>