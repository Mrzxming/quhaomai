<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="header-title">{{$t('lang.edit_pay_pwd')}}</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.label_phone_number')}}</text>
							<view class="value"><input name="mobile" v-model="mobile"
									:placeholder="$t('lang.enter_mobile')" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.pic_code')}}</text>
							<view class="value value-items">
								<input :placeholder="$t('lang.enter_pic_code')" name="imgverifyValue"
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
								<input :placeholder="$t('lang.get_sms_code')" maxlength="6" name="sms" v-model="sms">
								<button size="mini" type="warn" @click="sendVerifyCode"
									v-if="button_type">{{$t('lang.get_code')}}</button>
								<button size="mini" type="default" v-else>{{ button_text }}</button>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.label_pay_pwd')}}</text>
							<view class="input-lists">
								<!-- input输入框 -->
								<!-- <input class="input-items" v-if="focus" adjust-position="false" auto-blur="true" @blur="inputCodeBlur"
									@input="inputCode" :focus="focus" v-model="pwd" @focus="inputFocus" type="number" oneTimeCode
									maxlength="6" /> -->
								<!-- 验证码输入框 -->
								<!-- <view class="code-list" @click="focusClick">
									<view class="code-item" v-for="(item,index) in 6" :key="index"
										:style="(index == pwd.length && focus ? 'border-color:#fa3433;':'')">{{pwd[index]}}</view>
								</view> -->
								 <verification-code-style2 ref="verificationCodeStyle2" @inputVerificationChange="inputVerificationChange"></verification-code-style2>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<button class="btn btn-red" type="primary" formType="submit"
					v-if="paypwd_id > 0">{{$t('lang.mod')}}</button>
				<button class="btn btn-red" type="primary" formType="submit" v-else>{{$t('lang.enabled')}}</button>
			</view>
		</form>
		
		<!-- 图形验证码容器 -->
		<!-- #ifdef H5 -->
		  <div id="captcha" style="display: none;"></div>
		<!-- #endif -->
		
		
		<!-- #ifdef APP-PLUS -->
		<captcha ref="captcha" :config="aliConfig" 
		  @captchaSuccess="captchaSuccess"
		  @captchaError="captchaError"
		  @captchaFail="captchaFail"
		  @captchaReady="captchaReady"
		  @captchaClose="captchaClose"></captcha>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	var graceChecker = require("@/common/graceChecker.js");
	import verificationCodeStyle2 from '@/components/verification-code-style2.vue';
	import captcha from "@/components/captcha4/index.vue";
	// #ifdef H5
	import { initAliCaptchaH5, cleanupAliCaptchaDom } from '@/utils/aliCaptcha.js'
	// #endif
	export default {
		components: {
			verificationCodeStyle2,
			captcha
		},
		data() {
			return {
				// 阿里验证码相关数据
				aliConfig: {
					captchaId: "",
				},
				aliCaptchaResult: null,
				aliPlatform: '',
				mobile: '',
				imgverifyValue: '',
				sms: '',
				button_text: this.$t('lang.send_again_60'),
				send_again: this.$t('lang.send_again'),
				button_type: true,
				button_edit_type: false,
				button_edit: this.$t('lang.subimt'),
				isDisabled: true,
				pwd: '',
				paypwd_id: 0,
				is_mobile: 0,
				notice: '',
				
				focus: false, // input是否聚焦
			}
		},
		computed: {
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			})
		},
		mounted() {
		     this.detectAliPlatform();
		     // 【H5】改为用户点击"发送验证码"时按需初始化
		},
		beforeDestroy() {
		    // #ifdef H5
		    try { cleanupAliCaptchaDom() } catch (e) {}
		    this.h5Captcha = null
		    // #endif
		},
		onUnload() {
		    // #ifdef H5
		    try { cleanupAliCaptchaDom() } catch (e) {}
		    this.h5Captcha = null
		    // #endif
		},
		methods: {
			// 检测平台并设置验证码ID
			detectAliPlatform() {
				// #ifdef H5
				this.aliPlatform = 'H5';
				this.aliConfig.captchaId = '187c68c10b353285aee04ea098810301';
				// #endif
				// #ifdef MP-WEIXIN
				this.aliPlatform = 'wx';
				this.aliConfig.captchaId = '';
				// #endif
				// #ifdef APP-PLUS
				const systemInfo = uni.getSystemInfoSync();
				if (systemInfo.platform === 'android') {
					this.aliPlatform = 'Android';
					this.aliConfig.captchaId = 'e90ac1a1fb5b0ccf1de82096c870a118';
				} else {
					this.aliPlatform = 'iOS';
					this.aliConfig.captchaId = 'b7c339f0f58c73ec984074e73ed4a365';
				}
				// #endif
				
				console.log('阿里验证码平台:', this.aliPlatform, 'captchaId:', this.aliConfig.captchaId);
			},
			inputVerificationChange(val){
				console.log('值改变了：'+val);
				this.pwd = val
			},
			// 点击聚焦输入框
			focusClick() {
				this.focus = true
				uni.showKeyboard()
			},
			// 输入框失去焦点
			inputCodeBlur(e) {
				let value = e.detail.value
				this.focus = false
			},
			// 输入框聚焦时触发（没用到）
			inputFocus(e, height) {
				console.log(e)
			},
			// 输入框内容变化事件
			inputCode(e) {
				let value = e.target.value.replace(/[^\d]/g, '');
				this.pwd = value
			},
			clickCaptcha() {
				this.$store.dispatch('setImgVerify')
			},
			
			// 处理发送短信验证码
			sendVerifyCode() {
				// #ifdef MP-WEIXIN
				this.sendSmsAfterCaptcha();
				// #endif
				if (!this.validateSmsInput()) return;
				
				// #ifdef H5
				if (this.h5Captcha) {
					// 重置验证码状态
					try {
						this.h5Captcha.reset(); // 尝试重置验证码
					} catch (e) {
						console.log('重置验证码失败:', e);
					}
					
					// 重新显示验证码
					const captchaButton = document.querySelector('#captcha .captcha4_btn_click');
					if (captchaButton) {
						captchaButton.click(); // 直接触发原生点击事件
					} else {
						console.warn('验证码按钮未找到，重新初始化');
						this.initH5AliCaptcha(); // 重新初始化
						setTimeout(() => {
							const newButton = document.querySelector('#captcha .captcha4_btn_click');
							if (newButton) newButton.click();
						}, 500);
					}
				} else {
					this.initH5AliCaptcha(); // 首次初始化
				}
				// #endif
				
				// #ifdef APP-PLUS
				this.$refs.captcha.showCaptcha();
				// #endif
			},
			
			// 验证短信输入
			validateSmsInput() {
				if (!this.mobile) {
					uni.showToast({ title: '请输入手机号', icon: 'none' });
					return false;
				}
				
				if (!this.imgverifyValue) {
					uni.showToast({ title: '请输入图形验证码', icon: 'none' });
					return false;
				}
				
				return true;
			},
			
			// H5 阿里验证码按需初始化 —— 统一走 utils/aliCaptcha.js
			initH5AliCaptcha() {
				// #ifdef H5
				initAliCaptchaH5({
					captchaId: this.aliConfig.captchaId,
					scriptSrc: '/static/ct4.js',
					onSuccess: (result) => {
						this.aliCaptchaResult = result
						this.sendSmsAfterCaptcha()
					}
				}).then((captcha) => {
					this.h5Captcha = captcha
				}).catch((e) => {
					console.warn('[paypwd] H5 aliCaptcha init failed:', e)
				})
				// #endif
			},
			
			// 验证成功后发送短信
			sendSmsAfterCaptcha() {
				// #ifndef MP-WEIXIN
				if (!this.aliCaptchaResult) {
					uni.showToast({ title: '验证未通过', icon: 'none' });
					return;
				}
				// #endif
				
				let o = {
					captcha: this.imgverifyValue,
					client: this.client,
					mobile: this.mobile,
					is_mobile: this.is_mobile,
					// 添加阿里验证参数
					platform: this.aliPlatform,
					...this.aliCaptchaResult
				}

				this.$store.dispatch('setSendVerify', o).then(res => {
					console.log(res)
					if (res == 'success') {
						this.button_type = false
						let second = 60
						const timer = setInterval(() => {
							second--
							if (second) {
								this.button_text = this.send_again + '(' + second + 's)'
							} else {
								this.button_type = true
								clearInterval(timer);
							}
						}, 1000)
					}
				})
			},
			
			// APP验证码回调方法
			captchaSuccess(result) {
				this.aliCaptchaResult = result;
				this.sendSmsAfterCaptcha();
			},
			captchaError(e) {
				console.error('验证码错误:', e);
				uni.showToast({ title: '验证失败，请重试', icon: "none" });
			},
			captchaFail() {
				uni.showToast({ title: '验证失败', icon: "none" });
			},
			captchaReady() {
				console.log('阿里验证码准备就绪');
			},
			captchaClose() {
				console.log('阿里验证码关闭');
			},
			formSubmit(e) {
				var rule = [{
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
						name: "mobile",
						checkType: "phoneno",
						checkRule: "",
						errorMsg: this.$t('lang.mobile_not_null')
					}
					// ,
					// {
					// 	name: "pwd",
					// 	checkType: "notnull",
					// 	checkRule: "",
					// 	errorMsg: this.$t('lang.get_not_pwd')
					// },
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (!this.pwd) {
					uni.showToast({
						title: this.$t('lang.get_not_pwd'),
						icon: 'none'
					})
				
					return false
				}
				if (checkRes) {
					if (this.pwd.length < 6) {
						uni.showToast({
							title: this.$t('lang.get_six_not_pwd'),
							icon: 'none'
						})

						return false
					}

					let o = {
						paypwd_id: this.paypwd_id,
						pay_paypwd: this.pwd,
						client: this.client,
						code: this.sms,
						mobile: this.mobile
					}
					console.log(o)
					uni.request({
						url: this.websiteUrl + '/api/accountsafe/edit_paypwd',
						method: 'POST',
						data: o,
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if (data.status == 'success') {
								uni.showToast({
									title: data.data.msg,
									icon: "none"
								});
								if (data.data.code == 0) {
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 1000)
								}
							} else {
								uni.showToast({
									title: data.errors.message,
									icon: "none"
								});
							}
						}
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			}
		},
		onLoad() {
			this.$store.dispatch('setImgVerify');

			uni.request({
				url: this.websiteUrl + '/api/accountsafe/add_paypwd',
				method: 'GET',
				data: {},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					let data = res.data.data
					console.log(data)

					if (data.code == 0) {
						if (data.user_info.mobile_phone) {
							this.mobile = data.user_info.mobile_phone
							this.isDisabled = true
						} else {
							this.isDisabled = false
							this.is_mobile = 1
						}

						this.paypwd_id = data.users_paypwd.paypwd_id ? data.users_paypwd.paypwd_id : 0
						this.notice = data.notice
					} else {
						this.isDisabled = false
						this.is_mobile = 1

						uni.showToast({
							title: data.msg,
							icon: 'none'
						})
					}
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.header-title {
		padding: 20upx 30upx;
		border-bottom: 1px solid #DDDDDD;
		font-size: 30upx;
	}

	.input-lists {
		display: flex;
		align-items: center;
	
		.input-items {
			width: 0rpx;
		}
	
		.code-list {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
	
			.code-item {
				width: 60rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				border: 1rpx solid #eee;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>