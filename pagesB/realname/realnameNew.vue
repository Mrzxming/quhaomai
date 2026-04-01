<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.truename')}}</text>
							<view class="value"><input :placeholder="$t('lang.fill_in_real_name')" name="real_name"
									v-model="real_name"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.id_number')}}</text>
							<view class="value"><input :placeholder="$t('lang.fill_in_id_number')" name="self_num"
									v-model="self_num" maxlength="18"></view>
						</view>
					</view>

					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="real_type">
						<view class="uni-list-cell-navigate">
							<view class="title">{{$t('lang.certification_time')}}</view>
							<view class="value">{{add_time}}</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="review_status !== ''">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.audit_status')}}</text>
							<view class="value">
								<text class="uni-red" v-if="review_status == 0">{{$t('lang.audit_status_01')}}</text>
								<text class="uni-red"
									v-else-if="review_status == 1">{{$t('lang.audit_status_02')}}</text>
								<text class="uni-red" v-else="review_status == 2">{{$t('lang.audit_status_03')}}</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="review_status == 2">
						<view class="uni-list-cell-navigate" style="align-items: flex-start;">
							<text class="title">{{$t('lang.audit_review_content')}}</text>
							<view class="value">
								<text class="uni-red">{{ review_content }}</text>
							</view>
						</view>
					</view>
					<!-- 手机号码 -->
					<view class="" v-if="showMobile == true">
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="showMobile == true">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.label_phone_number')}}</text>
								<view class="value"><input :placeholder="$t('lang.phone_card_1')" name="bank_mobile"
										v-model="bank_mobile"></view>
								<!-- <view class="value"><input :placeholder="$t('lang.phone_card_1')" name="bank_mobile"
											v-model="bank_mobile" :disabled="isDisabled"></view> -->
							</view>
						</view>
						<!-- v-if="button_edit_type == false" -->
						<block>
							<!-- 图片验证码 -->
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">{{$t('lang.pic_code')}}</text>
									<view class="value value-items">
										<input :placeholder="$t('lang.captcha_img')" name="imgverifyValue"
											v-model="imgverifyValue">
										<view class="code-box" @click="clickCaptcha">
											<image :src="captcha" class="img"></image>
										</view>
									</view>
								</view>
							</view>
							<!-- 短信验证码 -->
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">{{$t('lang.label_sms_code')}}</text>
									<view class="value value-items">
										<input :placeholder="$t('lang.get_sms_code')" name="sms" v-model="sms">
										<button size="mini" type="warn" @click="sendVerifyCode"
											v-if="button_type">{{$t('lang.get_code')}}</button>
										<button size="mini" type="default" v-else
											:disabled="!button_type">{{ button_text }}</button>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="btn-bar">
				<block v-if="isEdit==true && showEdit">
					<button class="btn btn-red" type="primary" @click="editRealname" :disabled="isDisabled"
						v-if="button_edit_type">{{$t('lang.edit_certification_info')}}</button>
					<button class="btn btn-red" formType="submit" type="primary" v-else
						:disabled="isDisabled">{{ button_edit }}</button>
				</block>
				<block v-else>
					<button class="btn btn-red" formType="submit" :disabled="isDisabled"
						type="primary">{{$t('lang.consent_certification_confirm')}}</button>
				</block>
			</view>
		</form>
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniPopup from '@/components/uni-popup.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	var graceChecker = require("@/common/graceChecker.js");
	const metaInfo = uni.getFacialRecognitionMetaInfo()

	export default {
		components: {
			uniPopup,
			uniIcons,
			dscCommonNav
		},
		data() {
			return {
				cardShow: false,
				promptShow: false,
				real_type: false,
				real_id: 0,
				real_name: '',
				self_num: '',
				bank_name: '',
				bank_card: '',
				review_content: '',
				front_of_id_card: 0,
				reverse_of_id_card: 0,
				add_time: '',
				review_status: '',
				button_text: this.$t('lang.send_again_60'),
				button_type: true,
				button_edit_type: false,
				button_edit: this.$t('lang.subimt'),
				isDisabled: true,
				newChooseImage: {
					front: false,
					reverse: false
				},
				imageSrc: '',
				bank_mobile: '', //手机号码
				imgverifyValue: '', //图片验证码
				sms: '', //短信验证码
				showMobile: false,
				metaInfo: '',
				subData: '',
				isEdit: false,
				showEdit: true,
			};
		},
		computed: {
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			}),
		},
		onLoad() {
			var that = this
			that.realnameLoad()
			// if (uni.getStorageSync('userInfo').mobile) {
			// 	console.log('useInfo', uni.getStorageSync('userInfo'));
			// 	this.bank_mobile = uni.getStorageSync('userInfo').mobile
			// } else {
			// 	this.showMobile = true
			// 	this.$store.dispatch('setImgVerify')
			// }
		},
		methods: {
			editRealname() {
				this.isDisabled = false
				this.button_edit_type = true
			},
			realnameLoad(val) {
				uni.request({
					url: this.websiteUrl + '/api/realname',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('realnameLoad', res.data.data.review_status);
						let data = res.data.data
						if (data != '') {
							this.real_type = true
							this.real_id = data.real_id
							this.real_name = data.real_name
							this.self_num = data.self_num
							this.bank_mobile = data.bank_mobile
							this.review_status = data.review_status
							this.add_time = data.add_time
							this.review_content = data.review_content
						}
						if (data.review_status == 1) {
							this.showEdit = true
							this.isEdit = false
						} else if (data.review_status == 2) {
							this.showEdit = true
							this.isEdit = true
						}
					},
					fail(err) {
						console.log('iserr', err);
					},
				})
				this.$store.dispatch('setImgVerify')
			},
			formSubmit(e) {
				var rule = [{
						name: "real_name",
						checkType: "notnull",
						checkRule: "",
						errorMsg: this.$t('lang.truename_not_null')
					},
					{
						name: "self_num",
						checkType: "notnull",
						checkRule: "",
						errorMsg: this.$t('lang.id_number_not_null')
					},
					{
						name: "imgverifyValue",
						checkType: "notnull",
						checkRule: "",
						errorMsg: this.$t('lang.captcha_img_not_null')
					},
					{
						name: "sms",
						checkType: "notnull",
						checkRule: "",
						errorMsg: this.$t('lang.get_sms_code_notic')
					},
					{
						name: "bank_mobile",
						checkType: "phoneno",
						checkRule: "",
						errorMsg: this.$t('lang.mobile_not_null')
					},
				];


				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);

				if (checkRes) {
					let o = {
						real_name: this.real_name,
						self_num: this.self_num,
						bank_mobile: this.bank_mobile,
					}
					this.$store.dispatch('setSmsVerify', {
						client: this.client,
						code: this.sms,
						mobile: this.bank_mobile
					}).then(res => {
						if (res.status == 'success') {
							this.isDisabled = true
							this.metaInfo = metaInfo
							uniCloud.callFunction({
								name: 'gonghuo_face',
								data: {
									metaInfo: this.metaInfo,
									realName: this.real_name,
									idCard: this.self_num,
								},
								success({
									result
								}) {
									console.log('成功', result);
									uni.startFacialRecognitionVerify({
										certifyId: result.certifyId,
										progressBarColor: "#FE0302", //刷脸圈的颜色
										screenOrientation: "port", //认证界面UI朝向
										success: (e) => {
											console.log('success', e)
											// console.log('success', JSON.stringify(e))
											if (e.errCode == 0) {
												console.log();
												if (this.showMobile == true) {
													let data = {
														// self_num: this.self_num,
														// real_name: this.real_name,
														bank_mobile: this.bank_mobile,
														self_num: '1',
														real_name: '任文媛',
													}
													console.log('para1', data);
													uni.request({
														url: 'https://www.ok9288.com/api/userReal/userRealRequest',
														method: 'POST',
														data: data,
														header: {
															'Content-Type': 'application/json',
															'token': uni
																.getStorageSync(
																	'token'),
															'X-Client-Hash': uni
																.getStorageSync(
																	'client_hash')
														},
														success: (sRes) => {
															console.log('sres',
																sRes.data);
															if (sRes.data.status ==
																'success') {
																uni.showToast({
																	title: sRes
																		.data,
																	icon: "none"
																});
																uni.switchTab({
																	url: '/pages/user/user'
																})
															} else {
																uni.showToast({
																	title: sRes
																		.data,
																	icon: "none"
																});
															}
														},
														fail(err) {
															console.log('paraerr',
																err);
															uni.showToast({
																title: sRes
																	.data,
																icon: "none"
															});
														},
														complete(data) {
															console.log('paradata',
																data);
														}
													})
												} else {
													let data = {
														self_num: '130433199807313520',
														real_name: '任文媛',
														// self_num: this.self_num,
														// real_name: this.real_name
													}
													console.log('para2', data);
													uni.request({
														url: 'https://www.ok9288.com/api/userReal/userRealRequest',
														method: 'POST',
														data: data,
														header: {
															'Content-Type': 'application/json',
															'token': uni
																.getStorageSync(
																	'token'),
															'X-Client-Hash': uni
																.getStorageSync(
																	'client_hash')
														},
														success: (sRes) => {
															console.log('sres222',
																sRes.data);
															if (sRes.data.status ==
																'success') {
																uni.showToast({
																	title: sRes
																		.data,
																	icon: "none"
																});
																uni.switchTab({
																	url: '/pages/user/user'
																})
															} else {
																uni.showToast({
																	title: sRes
																		.data,
																	icon: "none"
																});
															}
														},
														fail(err) {
															console.log('paraerr',
																err);
															uni.showToast({
																title: sRes
																	.data,
																icon: "none"
															});
														},
													})
												}
											}
										},
										fail: (e) => {
											console.log('fail', JSON.stringify(e))
											uni.showToast({
												icon: 'none',
												title: e.errMsg
											})
										},
										complete: (e) => {
											console.log('completete', e)

										}
									})
								},
								fail(result) {
									console.log('data', data);
									console.log('err', result);
								},
								complete: (e) => {
									console.log('comple', JSON.stringify(e))
									var res = JSON.stringify(e)
									console.log('comres', res)
									if (e.errCode === 50000) {
										uni.showToast({
											icon: 'none',
											title: '请检查姓名和身份证号信息'
										})
									} else {
										console.log('err！=5000', JSON.stringify(e).code)
										uni.showToast({
											icon: 'none',
											title: e.errMsg
										})
									}
								}
							})
						} else {
							console.log(234, res);
							uni.showToast({
								title: res.errors.message,
								icon: "none"
							});
						}
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			clickCaptcha() {
				this.$store.dispatch('setImgVerify')
			},
			sendVerifyCode() {
				let o = {
					captcha: this.imgverifyValue,
					client: this.client,
					mobile: this.bank_mobile
				}

				this.$store.dispatch('setSendVerify', o).then(res => {
					if (res == 'success') {
						this.button_type = false
						let second = 60
						const timer = setInterval(() => {
							second--
							if (second) {
								this.button_text = this.$t('lang.send_again') + '(' + second + 's)'
							} else {
								this.button_type = true
								clearInterval(timer);
							}
						}, 1000)
					}
				})
			},

		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/realname/realname'
			}
		},
	}
</script>

<style>
	.btn-bar {
		margin: 30upx;
	}

	.value-items {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.value-items button[size=mini] {
		margin: 0;
		padding: 0 14px;
	}

	.card-main-warp .containTop {
		background-color: #ebebed;
		padding-bottom: 100upx;
	}

	.card-main-warp .containTop .title {
		padding: 20upx 0;
		display: flex;
		justify-content: center;
	}

	.card-main-warp .containTop .photoBox .photo {
		position: relative;
		border: 2px solid #359df5;
		background: #FFFFFF;
		border-radius: 10upx;
		width: 65%;
		margin: 0 auto 20upx;
		padding: 60upx 0 30upx;
		box-sizing: border-box;
	}

	.card-main-warp .containTop .photoBox .photo:last-child {
		margin-bottom: 0;
	}

	.card-main-warp .containTop .photoBox .photo .card {
		width: 270upx;
		height: 162upx;
		position: relative;
		margin: 0 auto;
	}

	.card-main-warp .containTop .photoBox .photo .card .preShow {
		width: 100%;
		height: 100%;
	}

	.card-main-warp .containTop .photoBox .photo .text {
		text-align: center;
		margin-top: 10upx;
		color: #359df5;
	}

	.card-main-warp .containBottom {
		background: #FFFFFF;
	}

	.card-main-warp .containBottom .title {
		padding: 20upx 0 10upx;
		margin: 0 45upx;
		border-bottom: 1px solid #e0e0e0;
	}

	.card-main-warp .containBottom .title .more {
		color: #359df5;
	}

	.card-main-warp .containBottom .tip-image {
		width: 100%;
		height: 130upx;
		margin-top: 20upx;
	}

	.card-main-warp .containBottom .btn-bar {
		margin: 50upx 40upx;
	}

	.rule-layer {
		border-top: 1px solid #e0e0e0;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		text-align: left;
	}

	.rule-layer .p {
		line-height: 2.5;
	}
</style>