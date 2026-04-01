<template>
	<!-- 取消寄件 -->
	<view class="container">
		<view class="head-status mbot32 mtop32">
			请告知我们取消原因，我们将做得更好
		</view>
		<view class="body">
			<view class="title">
				取消原因：
			</view>
			<view class="uni-list">
				<radio-group>
					<label @click="allChange(item)" class="uni-list-cell uni-list-cell-pd"
						v-for="(item, index) in alllist" :key="index">
						<view>
							<radio :value="item.type" color="#f92028" :name="item.type" />
						</view>
						<view>{{item.msg}}</view>
					</label>
				</radio-group>
			</view>
			<view class="" style="margin-left: 40rpx;" v-show="showOther">
				<view class="uni-list">
					<radio-group @change="otherChange">
						<!--  @click="otherChange(itotherem,index)" -->
						<label class="uni-list-cell uni-list-cell-pd" v-for="(other, indexa) in otherlist"
							:key="indexa">
							<view>
								<radio :value="other" color="#f92028" />
							</view>
							<view>{{other}}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<view class="btn-goods-actionnew">
			<view class="btn-bar">
				<view class="btn btn-gray" @click="toCancel()">暂不取消</view>
				<view class="btn btn-red" @click="toApply()">确认取消</view>
			</view>
		</view>
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
				alllist: [],
				otherlist: [],
				allindex: '',
				otherindex: '',
				allreson: '',
				otherreason: '',
				cancel_type: '',
				cancel_img: '',
				showOther: false,
				one: ['原因1', '原因2', '原因3'],
				oneList: [{
						id: 0,
						msg: ' 信息填错了（需要改取件时间/地址等）'
					},
					{
						id: 1,
						msg: '想去附近的服务点寄件'
					},
					{
						id: 2,
						msg: '计划有变， 暂时不需要寄了'
					},
					{
						id: 3,
						msg: '我想换个上门取件时间'
					},
					{
						id: 4,
						msg: '我觉得价格有点贵'
					}
				],
				twoList: [{
						id: 0,
						msg: '快递未准时上门取件'
					},
					{
						id: 1,
						msg: '快递员不上门'
					},
					{
						id: 2,
						msg: '快递员服务态度不好'
					},
				],
				threeList: [{
						id: 0,
						msg: '物品类型无法邮寄',
						checked: false

					},
					{
						id: 1,
						msg: '快递员反馈因运力紧张暂时无法揽收',
						checked: false
					},
					{
						id: 2,
						msg: '其他',
						checked: false
					},
				],
			}
		},
		computed: {
			...mapState({
				refoundDetail: state => state.user.refoundDetail,
			}),
		},
		created() {
			var that = this
			setTimeout(() => {
				that.refoundLoad()
				that.hasOrder()
			}, 10)
		},
		onLoad(option) {
			var that = this
			this.ret_id = option.ret_id
			this.relative_number = option.relative_number
		},
		onShow() {
			var that = this
			that.hasOrder()
		},
		methods: {
			toApply() {
				var that = this
				uni.showModal({
					title: '',
					content: '是否取消此寄件？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "取消中~",
								mask: true
							})
							let data = {
								user_id: that.orderInfo.user_id,
								order_id: that.orderInfo.order_id,
								order_sn: that.orderInfo.order_sn,
								order_code: that.orderInfo.order_code,
								cancel_type: that.cancel_type,
								cancel_msg: that.cancel_msg,
							}
							console.log('yesdata', data);
							uni.request({
								url: that.websiteUrl + '/api/kuaidi/orderKuaidicancel',
								method: 'POST',
								data: data,
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									uni.hideLoading()
									console.log('yes1', res.data.data);
									if (res.data.data.error == 0) {
										// setTimeout(()=>{
										uni.showToast({
											icon: 'none',
											title: res.data.data.message
										})
										uni.navigateTo({
											url: '/pagesB/afterSales/afterSales'
										})
										// },1)
									} else {
										uni.showToast({
											icon: 'none',
											title: res.data.data.message
										})
									}
								},
							})
						}
					}
				})

			},
			cancelYes() {
				var that = this
				let data = {
					user_id: that.orderInfo.user_id,
					order_id: that.orderInfo.order_id,
					order_sn: that.orderInfo.order_sn,
					order_code: that.orderInfo.order_code,
					cancel_type: that.cancel_type,
					cancel_msg: that.cancel_msg,
				}
				console.log('cancel', data);
				uni.request({
					url: that.websiteUrl + '/api/kuaidi/orderKuaidicancel',
					method: 'POST',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('yes', res);
						if (res.data.status == 'success') {
							if (res.data.data.error == 0) {
								uni.navigateTo({
									url: 'pagesB/afterSales/afterSales'
								})
							}
						}
					},
				})
			},
			toCancel() {
				uni.navigateBack()
			},
			otherChange(e) {
				var that = this
				that.cancel_msg = e.detail.value
				console.log(44, that.cancel_msg);
			},
			allChange(item) {
				var that = this
				that.cancel_type = item.type
				that.cancel_msg = item.msg
				console.log(that.cancel_type, that.cancel_msg);
				if (item.type == 11) {
					that.showOther = true
				} else {
					that.showOther = false
				}
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
						console.log('hasOrder', res);
						if (res.data.status == 'success') {
							if (res.data.data.error == 0) {
								that.orderInfo = res.data.data.data
								that.sender = res.data.data.data.sender
								that.receiver = res.data.data.data.receiver
								that.alllist = res.data.data.data.cancel_msg_list
								that.otherlist = res.data.data.data.cancel_msg_list[7].other_msg
								that.alllist.forEach(item => {
									item.id = index
								})
								console.log('order', that.orderInfo);
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

		},
	}
</script>

<style lang="scss">
	.container {
		// height: 100vh;
		overflow-y: hidden;
		padding-bottom: 170rpx;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	.btn-bar {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn {
		max-width: 260rpx;
		width: 260rpx;
		height: 80rpx;
		border-radius: 40rpx;
	}

	// .btn-goods-actionnew {
	// 	padding-bottom: calc(5px + env(safe-area-inset-bottom) / 2);
	// }

	uni-view {
		font-size: 14px;
		line-height: normal;
	}

	.head-status {
		font-weight: 400;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: center;
		font-style: normal;
	}

	.body {
		background-color: #ffffff;
		padding: 32rpx;
	}

	.title {
		font-weight: 500;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
		margin-bottom: 30rpx;
	}

	.uni-list {
		display: flex;
		flex-direction: row;

		.uni-list-cell {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
		}

		.uni-list-cell-pd {
			padding: 6px 0px;
			margin-bottom: 30rpx;
		}

		radio {
			transform: scale(0.7);
		}

		.uni-list:before {
			position: absolute;
			z-index: 10;
			right: 0;
			top: 0;
			left: 0;
			height: 0px;
			content: '';
			-webkit-transform: scaleY(0);
			transform: scaleY(.5);
			background-color: #ffffff;
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
			background-color: #ffffff;
		}
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
		background-color: #ffffff;
	}

	.btn {
		border-radius: 20px;
	}
</style>