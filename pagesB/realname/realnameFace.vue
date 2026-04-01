<template>
	<view class="face-content">
		<form @submit="formSubmit" v-if="showForm==true">
			<view class="uni-card-not">
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.truename')}}</text>
							<view class="value"><input :placeholder="$t('lang.fill_in_real_name')" name="real_name"
									v-model="real_name" :disabled="isDisabled" placeholder-class="placehold"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.id_number')}}</text>
							<view class="value">
								<input :placeholder="$t('lang.fill_in_id_number')" name="self_num" v-model="self_num"
									:disabled="isDisabled" placeholder-class="placehold" type="idcard">
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" v-if="real_type">
						<view class="uni-list-cell-navigate">
							<view class="title">{{$t('lang.certification_time')}}</view>
							<view class="value" style="font-size: 30rpx;">{{add_time}}</view>
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
						<view class="uni-list-cell-navigate" style="align-items: center;">
							<text class="title">{{$t('lang.audit_review_content')}}</text>
							<view class="value">
								<text class="uni-red">{{ review_content }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list">
					<view class="face-card" v-if="showMobile==true">
						<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.label_phone_number')}}</text>
								<view class="value"><input :placeholder="$t('lang.phone_card_1')" name="bank_mobile"
										v-model="bank_mobile" :disabled="isDisabled"></view>
							</view>
						</view>
						<!-- <block v-if="button_edit_type == false"> -->
						<block>
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
							<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
								<view class="uni-list-cell-navigate">
									<text class="title">{{$t('lang.label_sms_code')}}</text>
									<view class="value value-items">
										<input :placeholder="$t('lang.get_sms_code')" name="sms" v-model="sms">
										<button size="mini" type="warn" @click="sendVerifyCode"
											v-if="button_type">{{$t('lang.get_code')}}</button>
										<button size="mini" type="default" v-else>{{ button_text }}</button>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<!-- </view> -->
			</view>
			<view class="btn-bar">
				<block v-if="onFace && onFace==2">
					<button class="btn btn-red" type="warn" @click="editRealname"
						v-if="button_edit_type">{{$t('lang.edit_certification_info')}}</button>
					<button class="btn btn-red" formType="submit" type="warn" v-else
						:disabled="isSub">{{ button_edit }}</button>
				</block>
				<block v-else-if="onFace2 && onFace2==0 || onFace2==-1">
					<button class="btn btn-red" formType="submit" :disabled="isSub"
						type="warn">{{$t('lang.consent_certification_confirm')}}</button>
				</block>
			</view>
		</form>

		<view class="" v-else-if="!isloading">
			<view class="not-content">
				<view class="notimg">
					<image :src="image" class="img"></image>
				</view>
				<block v-if="isSpan">
					<view class="cont">{{failTip}}</view>
				</block>
				<block v-else>
					<view class="cont">
						<slot name="spanCon"></slot>
					</view>
				</block>
			</view>
		</view>
		<!-- <dsc-common-nav></dsc-common-nav> -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniPopup from '@/components/uni-popup.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	import {
		compressImage
	} from '@/common/compressImage.js'

	var graceChecker = require("@/common/graceChecker.js");
	// #ifdef APP-PLUS
	const metaInfo = uni.getFacialRecognitionMetaInfo()
	const permission = require('@/common/permission.js');
	// #endif
	export default {
		components: {
			uniPopup,
			uniIcons,
			dscCommonNav,
			dscNotContent
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
				bank_mobile: '',
				imgverifyValue: '',
				sms: '',
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
				showMobile: false,
				metaInfo: '',
				isSub: false,
				showForm: false,
				isloading: true,
				isSpan: true,
				failTip: '',
				onFace: '',
				hasMobile: '',
				onFace2: '',
				hasTriedCameraOnce: false, // 是否已经尝试过一次调起相机（区分第一次 / 再次）
			};
		},
		computed: {
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			}),
			image() {
				return this.websiteUrl + '/img/no_content.png'
			}
		},
		methods: {
			// 检查相机权限（再次点击时用）
			checkCameraPermission() {
				return new Promise((resolve) => {
					// #ifdef APP-PLUS
					const isIos = plus.os.name === 'iOS';
					if (isIos) {
						const hasPermission = permission.judgeIosPermission('camera');
						resolve(!!hasPermission);
					} else {
						// Android 使用 checkPermission
						const status = plus.navigator.checkPermission('android.permission.CAMERA');
						resolve(status === 'authorized' || status === 'granted');
					}
					// #endif
					// #ifndef APP-PLUS
					resolve(true);
					// #endif
				});
			},
			// 打开系统设置页面（保留方法，当前流程中不再主动引导）
			openSystemSettings() {
				// #ifdef APP-PLUS
				const platform = uni.getSystemInfoSync().platform;
				if (platform === "ios") {
					// iOS 平台：使用更可靠的方式
					try {
						// 方式1：使用 plus.runtime.openURL（uniapp 封装的方法，更可靠）
						try {
							plus.runtime.openURL("app-settings:");
							return;
						} catch (e1) {
							console.log('[openSystemSettings] 方式1失败，尝试方式2:', e1);
						}
						
						// 方式2：使用 application.openURL
						var UIApplication = plus.ios.import("UIApplication");
						var application = UIApplication.sharedApplication();
						var NSURL = plus.ios.import("NSURL");
						var settingsURL = NSURL.URLWithString("app-settings:");
						var openResult = application.openURL(settingsURL);
						
						if (openResult === true) {
							plus.ios.deleteObject(settingsURL);
							plus.ios.deleteObject(NSURL);
							plus.ios.deleteObject(application);
							return;
						}
						
						// 如果都失败，清理对象并提示
						plus.ios.deleteObject(settingsURL);
						plus.ios.deleteObject(NSURL);
						plus.ios.deleteObject(application);
						
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 隐私与安全性 > 相机 > 找到当前应用并开启权限',
							showCancel: false,
							confirmText: '知道了'
						});
					} catch (e) {
						console.error('[openSystemSettings] iOS 跳转异常:', e);
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 隐私与安全性 > 相机 > 找到当前应用并开启权限',
							showCancel: false,
							confirmText: '知道了'
						});
					}
				} else if (platform === "android") {
					// Android 平台：使用项目中的方法
					try {
						permission.gotoAppPermissionSetting();
					} catch (e) {
						console.error('[openSystemSettings] Android 跳转异常:', e);
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 应用 > 找到当前应用 > 权限 > 开启相机权限',
							showCancel: false,
							confirmText: '知道了'
						});
					}
				}
				// #endif
				
				// #ifndef APP-PLUS
				uni.showToast({
					title: '请在系统设置中开启相机权限',
					icon: 'none'
				});
				// #endif
			},
			realnameLoad(val) {
				this.newChooseImage.front = false;
				this.newChooseImage.reverse = false;
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
						this.isloading = false;
						// console.log('sucess', res);
						if (res.data.status == 'success') {
							let data = res.data.data
							if (data.review_status) {
								this.onFace = data.review_status
								if (this.onFace == 2) {
									this.button_edit_type = true
								}
							}
							if (data.status) {
								this.onFace2 = data.status
							}
							// console.log('dat', data);
							// #ifndef APP-PLUS
							if (data.status == -1) {
								this.showForm = false
							} else {
								if (data != '') {
									this.showForm = true
									this.real_type = true
									this.real_id = data.real_id
									this.real_name = data.real_name
									this.self_num = data.self_num
									this.review_status = data.review_status
									this.add_time = data.add_time
									this.review_content = data.review_content
								}
							}
							this.failTip = data.h5_msg
							this.button_edit_type = true
							this.isDisabled = true
							// #endif
							// #ifdef APP-PLUS
							this.showForm = true
							if (uni.getStorageSync('userInfo').mobile) {
								this.bank_mobile = uni.getStorageSync('userInfo').mobile
								this.hasMobile = uni.getStorageSync('userInfo').mobile
								this.showMobile = false
							} else {
								this.showMobile = true
							}
							if (data != '' && data.status > -1) {
								this.real_type = true
								this.real_id = data.real_id
								this.real_name = data.real_name
								this.self_num = data.self_num
								this.review_status = data.review_status
								this.add_time = data.add_time
								this.review_content = data.review_content
							}
							// if (data.status == 0 || data.status == 2) {
							if (data.review_status == 0 || data.review_status == 2) {
								this.isDisabled = false
							} else {
								this.button_edit_type = true
							}
							if (data.status == -1) {
								this.isDisabled = false
							}
							// #endif
						} else if (res.data.status == 'failed') {

						}

					},
					fail: (error) => {
						// console.log('failed', error)
					},
				})
				this.$store.dispatch('setImgVerify')
			},
			formSubmit(e) {
				// console.log('提交', e);
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: this.failTip
				})
				return;
				// #endif
				// #ifdef MP-WEIXIN
				uni.showToast({
					icon: 'none',
					title: this.failTip
				})
				return;
				// #endif
				if (this.onFace == -1 || this.onFace == 0) {
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
					];
				} else {
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
				}

				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				// #ifdef APP-PLUS
				if (checkRes) {
					this.checkCameraPermission().then((hasPermission) => {
						if (hasPermission) {
							// 已有相机权限：直接进入人脸识别
							this.continueFormSubmit();
						} else {
							// 没有相机权限
							if (!this.hasTriedCameraOnce) {
								// 第一次：先尝试进入人脸识别，由系统弹出相机权限框
								this.hasTriedCameraOnce = true;
								this.continueFormSubmit();
							} else {
								// 已经尝试过一次且仍然没有权限：提示去系统设置开启
								uni.showModal({
									title: '需要相机权限',
									content: '实名认证需要使用相机进行人脸识别，请前往系统设置中开启相机权限后重试。',
									confirmText: '去设置',
									cancelText: '取消',
									success: (res) => {
										if (res.confirm) {
											this.openSystemSettings();
										}
									}
								});
							}
						}
					});
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
				// #endif
			},
			// 继续表单提交流程（原有逻辑）
			continueFormSubmit() {
				let o = {
					// real_id: this.real_id,
					real_name: this.real_name,
					self_num: this.self_num,
					bank_mobile: this.bank_mobile,
				}
				if (!this.hasMobile) {
					this.$store.dispatch('setSmsVerify', {
						client: this.client,
						code: this.sms,
						mobile: this.bank_mobile
					}).then(res => {
						if (res.status == 'success') {
							// console.log('subres', res);
							this.getFace()
						} else {
							// console.log(234, res);
							uni.showToast({
								title: res.errors.message,
								icon: "none"
							});
						}
					})
				} else {
					this.getFace()
				}
			},
			getFace() {
				uni.showLoading({
					title: '提交中',
				})
				uni.setStorageSync('realName', this.real_name)
				uni.setStorageSync('idCard', this.self_num)
				uni.setStorageSync('bank_mobile', this.bank_mobile)
				// #ifdef APP-PLUS
				this.isSub = true
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
						uni.startFacialRecognitionVerify({
							certifyId: result.certifyId,
							progressBarColor: "#FE0302", //刷脸圈的颜色
							screenOrientation: "port", //认证界面UI朝向
							success: (e) => {
								if (e.errCode == 0) {
									if (this.showMobile == true) {
										let data = {
											self_num: uni.getStorageSync('idCard'),
											real_name: uni.getStorageSync('realName'),
											bank_mobile: uni.getStorageSync('bank_mobile'),
										}
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
												if (sRes.data
													.status ==
													'success') {
													uni.showToast({
														title: sRes
															.data.data,
														icon: "none",
														duration: 2000
													});
													setTimeout(() => {
														uni.reLaunch({
															url: '/pagesB/realname/realnameFace'
														})
													})
												} else {
													uni.showToast({
														title: sRes
															.data.data,
														icon: "none"
													});
												}
											},
											fail(err) {
												console.log('paraerr',
													err);
												uni.showToast({
													title: sRes
														.data.data,
													icon: "none"
												});
											},
										})
									} else {
										let data = {
											self_num: uni.getStorageSync('idCard'),
											real_name: uni.getStorageSync('realName'),
										}
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
												if (sRes.data
													.status ==
													'success') {
													uni.showToast({
														title: sRes
															.data.data,
														icon: "none"
													});
													// uni.switchTab({
													// 	url: '/pages/user/user'
													// })
													setTimeout(() => {
														uni.redirectTo({
															url: '/pagesB/realname/realnameFace'
														})
													}, 200)
												} else {
													uni.showToast({
														title: sRes
															.data.data,
														icon: "none"
													});
												}
											},
											fail(err) {
												// console.log('paraerr',
												// 	err);
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
								// 相机 / 人脸 SDK 直接失败
								const msg = e && e.errMsg ? e.errMsg : '';
								// 如果包含“无法启动相机”等提示，引导用户去系统设置
								if (msg.indexOf('无法启动相机') !== -1 || msg.indexOf('相机') !== -1) {
									uni.showModal({
										title: '需要相机权限',
										content: '实名认证需要使用相机进行人脸识别，请前往系统设置中开启相机权限后重试。',
										confirmText: '去设置',
										cancelText: '取消',
										success: (res) => {
											if (res.confirm) {
												this.openSystemSettings();
											}
										}
									});
								} else {
									uni.showToast({
										icon: 'none',
										title: msg || '人脸识别失败，请稍后重试'
									});
								}
							},
						})
					},
					fail(result) {
						console.log('err', result);
					},
					complete: (e) => {
						var res = JSON.stringify(e)
						setTimeout(() => {
							uni.hideLoading()
							if (e && e.errCode != 0) {
								const rawMsg = e.errMsg || '';
								const parts = rawMsg.split(":");
								const err = parts[0];
								// 身份信息错误
								if (err == '50000') {
									uni.showToast({
										icon: 'none',
										title: '请检查姓名和身份证号信息',
									})
								} else if (rawMsg.indexOf('无法启动相机') !== -1 || rawMsg.indexOf('相机') !== -1) {
									// 再次兜底：相机无法启动时，引导去系统设置
									uni.showModal({
										title: '需要相机权限',
										content: '实名认证需要使用相机进行人脸识别，请前往系统设置中开启相机权限后重试。',
										confirmText: '去设置',
										cancelText: '取消',
										success: (res) => {
											if (res.confirm) {
												this.openSystemSettings();
											}
										}
									});
								} else {
									// 其它错误先静默处理 / 以后需要再加文案
								}
							}
							this.isSub = false
						}, 500)
					}
				})
				// #endif
			},
			// 改变可修改
			editRealname() {
				// #ifdef H5
				this.isDisabled = true
				uni.showToast({
					icon: 'none',
					title: this.failTip
				})
				return;
				// #endif
				// #ifdef MP-WEIXIN
				this.isDisabled = true
				uni.showToast({
					icon: 'none',
					title: this.failTip
				})
				return;
				// #endif
				this.isDisabled = false
				this.button_edit_type = false
				this.real_name = ''
				this.self_num = ''
				this.bank_mobile = ''
				this.showMobile = true
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
			handelClose(val) {
				if (val == 'card') {
					this.cardShow = false
				} else if (val == 'prompt') {
					this.promptShow = false
				}
			},
			chooseImage(val) {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];

						// #ifdef APP-PLUS
						that.uploadImage(val);
						// #endif

						// #ifdef MP-WEIXIN
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 10,
								success: (result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
						// #endif
					}
				})
			},
			async uploadImage(val) {
				let that = this;
				uni.showLoading({
					mask: true,
					title: this.$t('lang.shang_chu')
				});

				//app压缩图片
				// #ifdef APP-PLUS
				that.imageSrc = await compressImage(that.imageSrc);
				// #endif

				pathToBase64(that.imageSrc).then(base64 => {
					that.$store.dispatch('setMaterial', {
						file: {
							content: base64
						},
						type: 'touxian'
					}).then(data => {
						if (data.status == 'success') {
							uni.hideLoading();
							if (val == 'front_of_id_card') {
								that.front_of_id_card = data.data[0];
								that.newChooseImage.front = true;
							} else {
								that.reverse_of_id_card = data.data[0];
								that.newChooseImage.reverse = data.data[0];
							}
						}
					})
				}).catch(error => {
					console.error(error, 5);
				});
			},
			prompt() {
				this.promptShow = this.promptShow == false ? true : false
			},
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/realname/realname'
			}
		},
		onLoad() {
			this.realnameLoad()
		},
		onShow() {
			// 【核心修复】处理从设置返回后的权限检查
			if (this.needCheckPermissionOnShow) {
				this.needCheckPermissionOnShow = false;
				console.log('[realnameFace] 从设置返回，延迟检查相机权限');
				// 延迟检查，确保页面已完全显示
				setTimeout(() => {
					this.checkCameraPermission().then((hasPermission) => {
						console.log('[realnameFace] 权限检查结果 hasPermission:', hasPermission);
						if (hasPermission) {
							// 权限已开启，自动继续认证流程
							uni.showToast({
								title: '权限已开启，继续认证',
								icon: 'success',
								duration: 1500
							});
							setTimeout(() => {
								this.continueFormSubmit();
							}, 500);
						} else {
							// 权限仍未开启，提示用户
							uni.showToast({
								title: '请开启相机权限后重试',
								icon: 'none'
							});
						}
					});
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	.face-content {
		padding: 16rpx;
	}

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

	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		margin-bottom: 16rpx;
	}

	.bg-box {
		height: 16rpx;
	}

	.uni-list-cell-right .uni-list-cell-navigate .title {
		padding-right: 0px;
		font-weight: 400;
		font-size: 32rpx;
		color: #191919;
		text-align: left;
		font-style: normal;
		padding-right: 32rpx;
	}

	.value input {
		font-weight: 400;
		font-size: 32rpx;
		color: #191919;
		text-align: left;
		font-style: normal;
	}

	.btn-bar {}

	.btn-bar .btn {
		width: 600rpx;
		height: 80rpx;
		line-height: 80px;
		background: #FE0302;
		border-radius: 40rpx;
		// height: 70rpx;
		line-height: 80rpx;
		text-align: center;
		justify-content: center;
		align-items: center;
		background: #FE0302;
		color: #FFFFFF;
		font-size: 32rpx;
		margin-top: 34rpx;
	}

	.uni-list-cell-navigate {
		font-size: 13px;
		/* padding: 11px 15px; */
		padding: 16px;
		position: relative;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		flex: 1;
		justify-content: space-between;
		align-items: center;
	}

	.placehold {
		color: #BBBBBB;
	}

	.uni-red {
		font-size: 30rpx;
		line-height: 32rpx;
	}

	.not-content {
		width: 100%;
		padding: 50px 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.not-content .notimg {
		width: 144px;
		height: 124px;
		margin: 0 auto 20px;
	}

	.not-content .cont {
		text-align: center;
		color: #999999;
		width: 224px;
		height: 124px;
		margin: 0 auto 20px;
	}
</style>