<template>
	<!-- 上门取件 -->
	<view class="container">
		<view class="head-top">
			<view style="" :class="[tjTab==0 ? 'tj_top' : 'tj_tops']">
				<view class="tj_top_item" :class="tjTab == 0 ? 'tj_top_item_pre' : ''" @click="tabFn(0)">上门取件</view>
				<view class="tj_top_item" :class="tjTab == 1 ? 'tj_top_item_pre' : ''" @click="tabFn(1)">已寄填单号</view>
			</view>
			<view class="" v-if="tjTab == 0">
				<!-- 寄件地址 -->
				<view class="ji_info">
					<view class="ji_top" style="position: relative;">
						<image src="/pagesC/static/express/ji.png" mode="widthFix" class="addrImg"></image>
						<text class="uni-ellipsis">{{refoundDetail.addressee}} </text>
						<text>{{refoundDetail.phone}}</text>
						<view class="" style="padding: 0 20rpx;position: absolute;top:0%; right: -2%;"
							@click="toMyAddr(refoundDetail.ret_id)">
							<uni-icons type="arrowright" size="16" color="#999999" style=""></uni-icons>
						</view>
					</view>
					<view class="ji_addr">
						{{refoundDetail.address_detail}}
					</view>
				</view>
				<view class="" style="height: 2rpx;background-color: #EDEDED;margin: -10rpx 28rpx;"></view>
				<view class="ji_info">
					<view class="ji_top">
						<image src="/pagesC/static/express/shou.png" mode="" class="addrImg"></image>
						<text class="onelist-hidden">
							{{refoundDetail.shop_huanhui_address_contact}}
						</text>
						<text>
							{{refoundDetail.shop_huanhui_address_mobile}}
						</text>
					</view>
					<view class="ji_addr ">
						{{refoundDetail.shop_huanhui_address_province}}
						{{refoundDetail.shop_huanhui_address_city}}
						{{refoundDetail.shop_huanhui_address_district}}
						{{refoundDetail.shop_huanhui_address_address}}
					</view>
				</view>
				<!-- 快递员要求 -->
			</view>
			<view class="" v-if="tjTab == 1">
				<view class="uni-card uni-card-not">
					<view class="padding-all">
						<view class="detail-title">
							<text class="titlenew">快递信息 </text>
							<text class="help color-red">(请填写您寄回商品的快递信息)</text>
						</view>
						<view class="select-one-1">
							<view class="uni-list-cell uni-list-cell-last" @click="feeHandle">
								<view class="uni-list-cell-navigate" style="position: relative;">
									<text class="t-title">快递公司</text>
									<view class="value">{{ other_express ? other_express : '请选择快递公司' }}
									</view>
									<view class="" style="display: flex;justify-content: flex-end;">
										<uni-icons type="arrowright" size="15" color="#999999"
											style="position: absolute;right: 5%;top: 3%;"></uni-icons>
										<!-- <image src="/static/order/arrow_right.png" mode=""
											style="width: 14rpx;height: 20rpx;margin-top: 0rpx;margin-left: 280rpx;">
										</image> -->
									</view>
								</view>
							</view>
							<view class="uni-list-cell uni-list-cell-last" v-if="shippingSelect == 999">
								<view class="uni-list-cell-navigate">
									<text class="t-title">其他快递</text>
									<view class="value"><input placeholder="请填写快递公司" v-model="other_express2">
									</view>
								</view>
							</view>
							<view class="" style="height: 2rpx;background-color: #EDEDED;margin: 10rpx 32rpx;"></view>
							<view class="uni-list-cell uni-list-cell-last">
								<view class="uni-list-cell-navigate">
									<text class="t-title">快递单号</text>
									<view class="value"><input placeholder="请填写快递单号" v-model="express_sn"
											placeholder-style="color:#1B1B1B">
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上门取件发件信息 -->
		<view class="head-top" style="padding: 32rpx;" v-if="tjTab==0">
			<view class="top-title">物流备注</view>
			<!-- 标准寄件 -->
			<view class="canon1">
				<image src="/pagesC/static/express/canon.png" mode="" class="canon"></image>
				<view class="" style="">
					<view class=""
						style="position: absolute;top: 0%;right:16rpx;text-align: end;color: #FE0302;font-size: 24rpx;">
						¥{{feeinfo.cost}}
					</view>
					<view class="" style="position: absolute;bottom: 6rpx;left:30rpx">
						{{feeinfo.shipperCode}}
					</view>
				</view>
			</view>
			<!-- 重量 -->
			<view class="flexbtw">
				<view class="">
					重量(kg)
				</view>
				<view class="">
					<uni-number-kg :value="weight" :min="1"
						@change="numberhandle($event,refoundDetail)"></uni-number-kg>
				</view>
			</view>
			<view class="" style="height: 2rpx;background-color: #EDEDED;margin: 30rpx 0%;"></view>
			<view class="flexbtw">
				<view class="">
					上门时间
				</view>
				<view class="flexend" @click="open">
					<view class="" v-if="dayTime">{{dayTime}}</view>
					<view class="" v-else>请选择预约时间</view>
					<image src="/static/order/arrow_right.png" mode=""
						style="width: 14rpx;height: 20rpx;margin-left:20rpx;"></image>
				</view>
			</view>
		</view>
		<!-- 快递备注 -->
		<view class="head-top" style="padding: 32rpx;" v-if="tjTab==0">
			<view class="flexbtw">
				<view class="top-title">
					快递备注
					<image src="/static/express/tip.png" mode="widthFix"
						style="width: 32rpx;height: 32rpx;margin-left: 20rpx;"></image>
				</view>
				<view class="top-tip" style="">您的要求会提前告知快递员</view>
			</view>
			<view class="texts">
				<textarea v-model="remark" placeholder="请简要说明您的需求"></textarea>
			</view>
		</view>
		<!-- 已经寄了填写单号 -->
		<view class="headtop" v-if="tjTab===1">
			<view class="toptitle">
				退货及运费承担说明
			</view>
			<view class="top-text">
				退款原因{{refoundDetail.return_cause}}，<text class="active">邮费协商处理</text>
			</view>
			<view class="top-text" style="margin-top: 16rpx;">
				建议与商家协商后再申请退换，请不要邮寄到付
			</view>
		</view>

		<view class="toSubmit" v-if="tjTab===0">
			<!-- <view class="privacy">
				<view class="checkbox" :class="{'checked':checked}">
					<view class="checkbox-icon" @click="checked = !checked">
						<uni-icons type="checkmarkempty" size="14" color="#ffffff"></uni-icons>
					</view>
					<view class="checkbox-con" style="display: flex;flex-direction: row;">
						<view class="txt" @click="checked = !checked">我已阅读并同意</view>
						<view class="href" @click="toTrain">《隐私政策》</view>
						<view class="txt">和</view>
						<view class="href" @click="toAgreement">《证照信息》</view>
					</view>
				</view>
			</view> -->
			<view class="express_detail">
				<view class="">
					<view class="top">
						预估运费 <text class="price">¥{{feeinfo.totalFee}}</text> <text>|</text>
						<text style="padding: 10rpx;" @click="getDetail">明细</text><text style=""
							@click="getDetail"><uni-icons type="arrowdown" size="14" color="#999999"
								style=""></uni-icons></text>
					</view>
					<view class="bot">
						按{{weight}}kg内重量预估
					</view>
				</view>
				<view class="btn-bar" style="flex:none">
					<block>
						<view class=" btn-red" @click="toPickDoor(refoundDetail)">立即下单</view>
					</block>
				</view>
			</view>
		</view>
		<view class="btn-goods-actionnew" v-if="tjTab===1">
			<view class="btn-bar">
				<block <view class="btnone btn-red" @click="topickUp(refoundDetail)">提交
				</block>
			</view>
		</view>
	</view>

	<!--配送方式-->
	<uni-popup :show="feeShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose()">
		<view class="activity-popup">
			<view class="title">
				<view class="txt">配送方式</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose()"></uni-icon>
			</view>
			<view class="not-content">
				<scroll-view :scroll-y="true" class="select-list">
					<view class="select-item" v-for="(item,index) in shipping_list" :key="index"
						:class="{'active':shippingSelect == item.shipping_id}"
						@click="shipping_select(item.shipping_id,item.shipping_name)">
						<view class="txt">{{ item.shipping_name }}</view>
						<view class="iconfont icon-ok"></view>
					</view>
					<view class="select-item" :class="{'active':shippingSelect == 999}" @click="shipping_select(999)">
						<view class="txt">其他快递</view>
						<view class="iconfont icon-ok"></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</uni-popup>
	<!-- 费用明细 -->
	<uni-popup :show="showDetail" type="bottom" mode="fixed" v-on:hidePopup="handelClose()">
		<view class="" style="padding: 48rpx 32rpx 32rpx;" @touchmove.stop.prevent="moveHandle">
			<view class="closes" @click="handelClose()" style="text-align: right;">
				<image src="/pagesC/static/express/close.png" mode="" style="width: 50rpx;height: 50rpx;"></image>
			</view>
			<view class="express" style="text-align: left;">
				<view class="">
					<view class="provice" style="margin-bottom: 16rpx;">
						{{refoundDetail.user_order_address_city}}-{{refoundDetail.shop_huanhui_address_city}}
					</view>
					<view class="pro_tip" style="margin-bottom: 48rpx;text-align: left;">
						首重1kg内¥{{feeinfo.firstWeightAmount}}，续重¥{{feeinfo.continuousWeightPrice}}/1kg
					</view>
					<view class="flexcenter" style="margin-bottom: 180rpx;">
						<view class="feelist ">
							<view class="left">计费类型</view>
							<view class="left">按重量计费</view>
						</view>
						<view class="feelist">
							<view class="left">首重费</view>
							<view class="right">¥{{feeinfo.firstWeightAmount}}</view>
						</view>
						<view class="feelist">
							<view class="left">续重费</view>
							<view class="right">¥{{feeinfo.continuousWeightAmount}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="toSubmit" style="">
				<view class="express_detail">
					<view class="">
						<view class="top">
							预估运费 <text class="price">¥{{feeinfo.totalFee}}</text> <text>|</text>
							<text style="padding: 10rpx;" @click="getDetail">明细</text><text style=""><uni-icons
									type="arrowdown" size="14" color="#999999" style=""></uni-icons></text>
						</view>
						<view class="bot">
							按{{weight}}kg内重量预估
						</view>
					</view>
					<view class="btn-bar" style="flex:none">
						<block>
							<view class=" btn-red" @click="toPickDoor(refoundDetail)">立即下单</view>
						</block>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
	<!-- 预约时间 -->
	<liu-delivery-time @change="changeTime" ref="chooseTime" title="选择上门时间" v-on:hidePopup="handelClose()"
		style="position: fixed;left: 0%;z-index: 99999;height:500px"></liu-delivery-time>
	<dsc-common-nav></dsc-common-nav>

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
				tjTab: 0,
				ret_id: 0,
				shippingSelect: 0,
				other_express: '',
				other_express2: '',
				express_sn: '',
				feeShow: false,
				fuwu_url: "", //服务协议
				cert_url: "", //证照信息
				checked: false,
				weight: 1,
				newAddr: '',
				relative_number: '',
				timelist: [],
				feeinfo: '',
				remark: '',
				dayTime: '',
				pickTime: '',
				user_id: '',
				order_id: '',
				order_sn: '',
				showDetail: false,
				orderInfo: '',
				sender: '',
				receiver: '',
				payInfo: '',
				logistic_code: '',
			};
		},
		computed: {
			...mapState({
				refoundDetail: state => state.user.refoundDetail,
			}),
			shipping_list() {
				return this.refoundDetail.shipping_list ? this.refoundDetail.shipping_list : []
			},
		},
		onReady() {
			var that = this
			// that.checkTime()
			// setTimeout(() => {
			// that.refoundLoad()
			// }, 1)
		},
		onLoad(option) {
			var that = this
			setTimeout(() => {
				this.ret_id = option.ret_id
				this.relative_number = option.relative_number
				this.user_id = option.user_id
				this.order_id = option.order_id
				this.order_sn = option.order_sn
				that.refoundLoad(option.ret_id)
				// that.hasOrder()
				if (uni.getStorageSync('newAddr')) {
					that.newAddr = uni.getStorageSync('newAddr');
					that.refoundDetail.addressee = that.newAddr.name
					that.refoundDetail.phone = that.newAddr.mobile
					that.refoundDetail.address_detail =
						`${that.newAddr.province_name}${that.newAddr.city_name}${that.newAddr.district_name}${that.newAddr.street_name}${that.newAddr.address}`
					that.refoundDetail.address = that.newAddr.address
					that.refoundDetail.user_order_address_province = that.newAddr.province_name
					that.refoundDetail.user_order_address_city = that.newAddr.city_name
					that.refoundDetail.user_order_address_district = that.newAddr.district_name
					that.refoundDetail.user_order_address_address = that.newAddr.address
					that.checkTime()
				}
				setTimeout(() => {
					that.checkTime()
				}, 250)
			}, 10)
		},
		onShow() {
			var that = this
			setTimeout(() => {
				if (uni.getStorageSync('newAddr')) {
					that.newAddr = uni.getStorageSync('newAddr');
					that.refoundDetail.addressee = that.newAddr.name
					that.refoundDetail.phone = that.newAddr.mobile
					that.refoundDetail.address_detail =
						`${that.newAddr.province_name}${that.newAddr.city_name}${that.newAddr.district_name}${that.newAddr.street_name}${that.newAddr.address}`
					that.refoundDetail.address = that.newAddr.address
					that.refoundDetail.user_order_address_province = that.newAddr.province_name
					that.refoundDetail.user_order_address_city = that.newAddr.city_name
					that.refoundDetail.user_order_address_district = that.newAddr.district_name
					that.refoundDetail.user_order_address_address = that.newAddr.address
					that.checkTime()
				}
			}, 100)
		},
		methods: {
			moveHandle() {},
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
			getDetail() {
				if (this.showDetail === true) {
					this.showDetail = false
				} else {
					this.showDetail = true
				}
			},
			open() {
				this.$refs.chooseTime.open()
			},
			//选择的时间
			changeTime(e) {
				this.dayTime = e.value
				this.pickTime = e
			},
			//toMyAddr
			toMyAddr(ret_id) {
				uni.navigateTo({
					url: '/pagesB/address/addresspick?ret_id=' + ret_id
				})
			},
			//修改重量
			numberhandle(e, item) {
				var that = this
				this.weight = e
				that.checkTime(this.weight)
			},
			// 自寄下单
			topickUp() {
				var that = this
				let data = {
					ret_id: that.refoundDetail.ret_id,
					order_id: that.order_id,
					express_name: that.other_express || that.other_express2,
					express_sn: that.express_sn,
					shipping_id: that.shippingSelect
				}
				uni.request({
					url: that.websiteUrl + '/api/refound/edit_express',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res)
						if(res.data.status == 'success') {
							uni.showToast({
								icon: 'none',
								title: res.data.data.msg
							})
						}else {
							uni.showToast({
								icon: 'none',
								title: res.data.errors.message
							})
						}
						uni.navigateBack()
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: res.data.errors.message
						})
					}
				})
			},
			// 上门取件下单 
			toPickDoor() {
				var that = this
				let data = {
					user_id: that.refoundDetail.user_id,
					ru_id: that.refoundDetail.ru_id,
					order_sn: that.refoundDetail.order_sn,
					order_id: that.refoundDetail.order_id,
					weight: that.weight,
					relative_number: that.relative_number,
					remark: that.remark,
					name: that.refoundDetail.addressee,
					mobile: that.refoundDetail.phone,
					startDate: `${that.pickTime.day_v } ${that.pickTime.startHour }`,
					endDate: `${that.pickTime.day_v } ${that.pickTime.endHour }`,
					province: that.refoundDetail.user_order_address_province,
					city: that.refoundDetail.user_order_address_city,
					district: that.refoundDetail.user_order_address_district,
					address: that.refoundDetail.user_order_address_address
				}
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/orderKuaidicreate',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						that.showDetail = false
						this.feeShow = false
						if (res.data.data.error == 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.data.message
							})
							uni.navigateTo({
								url: '/pagesB/afterSales/afterSales'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.data.message
							})
						}
					},
				}, )
			},
			refoundLoad() {
				this.$store.dispatch('setReturnDatail', {
					ret_id: this.ret_id
				})
			},
			// 查询可预约时间
			checkTime() {
				var that = this
				let data = {
					user_id: that.refoundDetail.user_id,
					ru_id: that.refoundDetail.ru_id,
					order_sn: that.refoundDetail.order_sn,
					ret_id: that.refoundDetail.ret_id,
					weight: that.weight,
					relative_number: that.relative_number || that.refoundDetail.relative_number,
					province: that.refoundDetail.user_order_address_province,
					city: that.refoundDetail.user_order_address_city,
					district: that.refoundDetail.user_order_address_district,
					address: that.refoundDetail.user_order_address_address
				}
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/checkKuaidiService',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.data.error == 0) {
							this.timelist = res.data.data.time_list
							this.feeinfo = res.data.data.totalFeeInfo
							uni.setStorageSync('timelist', this.timelist)
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.data.message,
								duration: 2000,
							})
						}
					},
					fail: (err) => {
						console.error('err', err)
						uni.showToast({
							icon: 'none',
							title: res.data.data.message,
							duration: 2000,
						})
					},
					complete(res) {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: res.data.data.msg
						// })
					}
				})
			},
			tabFn(e) {
				var that = this
				that.tjTab = e
			},
			shipping_select(id, name) {
				this.shippingSelect = id;
				if (id !== 999) {
					this.other_express = name
				}
				this.feeShow = false
			},
			feeHandle() {
				this.feeShow = true
			},
			handelClose() {
				this.feeShow = false
				this.showDetail = false
			}
		},
	}
</script>

<style lang="scss">
	.container {
		box-sizing: border-box;
		// padding: 32rpx 32rpx 270rpx;
		padding: 32rpx;
		height: 100%;
		overflow: hidden;
	}

	// tab
	.tj_top {
		padding: 10rpx 0rpx;
		display: flex;
		align-items: center;
		margin-bottom: 2upx;
		font-size: 32upx;
		color: #666666;
		border-radius: 14rpx 14rpx 0 0;
		background-color: #efefef;
		// margin-top: 10rpx;
		// margin-right: 20rpx;
		background-image: url(https://images.eqingqu.com/attachs/photo/202304/20230425_B84A3D6831642F006F66143ACDC6497D.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.tj_tops {
		padding: 10rpx 0rpx;
		display: flex;
		align-items: center;
		margin-bottom: 2upx;
		font-size: 32upx;
		color: #666666;
		font-weight: 500;
		border-radius: 14rpx 14rpx 0 0;
		// margin-top: 10rpx;
		background-color: #efefef;
		background-image: url(https://images.eqingqu.com/attachs/photo/202304/20230425_56BAF5D3999A4917F45BCD822A0D1D2A.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.tj_top_item {
		width: 50%;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.tj_top_item_pre {
		color: #000000;
		position: relative;
		font-size: 32rpx;
		font-weight: 500;
	}

	.tj_top_item_pre:after {
		content: '';
		position: absolute;
		bottom: -22upx;
		left: 50%;
		width: 80upx;
		height: 4upx;
		background: #4A92F6;
		border-radius: 2upx;
		margin-left: -40upx;
	}

	/* top */
	.head-top {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.expressBot {
		padding: 0 20rpx;
		height: 64rpx;
		line-height: 44rpx;
		// border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.expressStatus {
			width: 84rpx;
			height: 28rpx;
			font-weight: 600;
			font-size: 28rpx;
			color: #FFB211;
			line-height: 28rpx;
			text-align: left;
			margin-left: 16rpx;
			margin-top: -20rpx;
		}

		.expressCode {
			font-size: 28rpx;
			color: #FFB211;
			line-height: 28rpx;
			text-align: left;
			margin-left: 16rpx;
		}

		.isNow {
			color: #FFB211;
		}
	}

	.express-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	//top-end

	.detail-title {
		padding: 20rpx 32upx 16rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: justify;
		font-style: normal;
	}

	.uni-list-cell-navigate {
		height: 70rpx;
		display: flex;
		justify-content: left;
		font-size: 28rpx;
	}

	.titlenew {
		width: 112rpx;
		height: 32rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: justify;
		font-style: normal;
	}

	.color-red {
		color: #f92028;
	}

	.uni-list-cell-navigate .value {
		// flex: 1;
		margin-left: 10upx;
		color: #1B1B1B;
	}

	.t-title {
		width: 20%;
		min-width: 20%;
	}

	.help {
		font-size: 26rpx;
		margin-left: 20rpx;
	}

	.radius {
		border-radius: 10px;
	}

	.headtop {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		padding: 32rpx;
	}

	.toptitle {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		margin-bottom: 32rpx;

	}

	.top-text {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #A2A2A2;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
		z-index: 3;
	}

	.top-text .active {
		position: relative;
		z-index: 3;
	}

	.top-text .active::after {
		content: '';
		position: absolute;
		// top: 60%;
		bottom: 0%;
		right: 0rpx;
		width: 176rpx;
		height: 6rpx;
		background: #FFE50C;
		z-index: 1;
	}

	// 上门取件-寄件人
	.ji_info {
		// display: flex;
		// justify-content: left;
		padding: 28rpx;

		.ji_top {
			display: flex;
			justify-content: left;
			align-items: center;
			font-size: 32rpx;
		}

		.ji_top text {
			margin-left: 20rpx;
			min-width: 100rpx;
			max-width: 260rpx;
		}

		.ji_addr {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #A2A2A2;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;
		}
	}

	.addrImg {
		min-width: 36rpx;
		width: 36rpx;
		height: 36rpx;
		border-radius: 8rpx;
	}

	.top-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		margin-bottom: 28rpx;
		display: flex;
		align-items: center;
	}

	.canon {
		width: 240rpx;
		height: 100rpx;
		border-radius: 12rpx;
		border: 2rpx solid #FFD103;
		position: relative;
	}

	.canon1 {
		width: 240rpx;
		height: 100rpx;
		border-radius: 12rpx;
		position: relative;
		margin-bottom: 30rpx;
		color: #1B1B1B;
		background: url('/pagesC/static/express/canon.png');
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100%;
	}

	.top-tip {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		margin-top: -20rpx;
	}

	.texts {
		height: 200rpx;
		border-radius: 16rpx;
		border: 1rpx solid #979797;

		textarea {
			padding: 24rpx;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
			width: 92%;
		}
	}

	.toSubmit {
		// height: 256rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -2rpx 4rpx 0rpx rgba(192, 192, 192, 0.16);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 26rpx 32rpx 54rpx;
	}

	// privacy  
	.privacy {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 30rpx;

		.checkbox {
			margin-right: 0;

			.checkbox-icon {
				width: 24rpx;
				height: 24rpx;
				margin-top: 0rpx;
			}

			.txt {
				color: #666666;
				font-size: 25rpx;
			}

			.href {
				color: #4b89dc;
				font-size: 25rpx;
			}
		}
	}

	//privacy--end
	.btn-red {
		background: #FE0302;
		border-radius: 40rpx;
		justify-content: end;
	}

	.express_detail {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.top {
			font-weight: 400;
			font-size: 24rpx;
			color: #1B1B1B;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
		}

		.bot {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #A2A2A2;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
			margin-top: 14rpx;
		}

		.price {
			font-weight: 600;
			font-size: 40rpx;
			color: #FE0302;
			line-height: 24rpx;
			text-align: left;
			font-style: normal;
			margin: 0 16rpx;
		}
	}

	.btn-bar {
		flex: 1;
		display: flex;
	}

	.closes {
		position: absolute;
		top: 20rpx;
		right: 28rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.fee {
		display: flex;
		position: relative;
		flex-direction: column;



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
			width: 56rpx;
			height: 56rpx;
			margin-right: 32rpx;
			margin-bottom: -14rpx;
		}

		.paytext {
			font-weight: 400;
			font-size: 36rpx;
			color: #1B1B1B;
			text-align: left;
			font-style: normal;
		}
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
</style>