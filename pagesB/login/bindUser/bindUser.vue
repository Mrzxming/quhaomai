<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-bindphone">
			<view class="page-header"></view>
			<view class="user-lr-form">
				<form @submit="formSubmit">
					<view class="phone-input-group">
						<view class="phone-prefix">+86</view>
						<input type="text" class="input" name="mobile" v-model="mobile" :placeholder="$t('lang.enter_mobile')" />
						<view class="get-code-btn" @click.stop="handleSendSmsCode" v-if="button_type">{{$t('lang.get_code')}}</view>
						<view class="get-code-btn get-code-disabled" v-else>{{ button_text }}</view>
					</view>
					<view class="code-input-group">
						<input type="text" class="input" name="sms" v-model="sms" maxlength="6" :placeholder="$t('lang.get_sms_code')" />
					</view>
					<button class="submit-btn" formType="submit">{{$t('lang.bind_on')}}</button>
				</form>
			</view>
		</view>
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
	import { mapState } from 'vuex'
	import captcha from '@/components/captcha4/index.vue';
	import * as localConfig from '@/config/local/config'
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				captchaProcessing: false,
				captchaEventsBound: false,
				aliConfig: {
					captchaId: "",
				},
				aliCaptchaResult: null,
				aliPlatform: '',
				mobile:'',
				sms:'',
				name:'',
				button_text: this.$t('lang.send_again_60'),
				send_again:this.$t('lang.send_again'),
				button_type:true,
				disabled:true,
				delta:'',
				params:''
			};
		},
		components:{
			captcha
		},
		mounted() {
			this.detectAliPlatform();
			// #ifdef H5
			this.initH5AliCaptcha();
			// #endif
		},
		computed:{
			...mapState({
				client: state => state.common.imgVerify.client,
			}),
			token:{
				get(){
					return this.$store.state.user.token
				},
				set(val){
					this.$store.state.user.token = val
				}
			}
		},
		beforeDestroy() {
			if (this.$refs.captcha && this.captchaEventsBound) {
				this.$refs.captcha.$off('captchaSuccess', this.captchaSuccess);
				this.$refs.captcha.$off('captchaError', this.captchaError);
				this.$refs.captcha.$off('captchaFail', this.captchaFail);
				this.$refs.captcha.$off('captchaClose', this.captchaClose);
			}
		},
		methods:{
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
			},

			handleSendSmsCode() {
				if (!this.validateSmsInput()) return;
				// #ifdef MP-WEIXIN
				this.sendSmsAfterCaptcha();
				return;
				// #endif
				// #ifdef H5
				if (this.h5Captcha) {
					try {
						this.h5Captcha.reset && this.h5Captcha.reset();
					} catch (e) {
						console.log('重置验证码失败:', e);
					}
					this.h5Captcha.verify && this.h5Captcha.verify();
				} else {
					this.initH5AliCaptcha();
					setTimeout(() => {
						if (this.h5Captcha && this.h5Captcha.verify) {
							this.h5Captcha.verify();
						}
					}, 300);
				}
				// #endif
				// #ifdef APP-PLUS
				this.$refs.captcha.showCaptcha();
				// #endif
			},

			initH5AliCaptcha() {
				// #ifdef H5
				const oldCaptcha = document.getElementById('captcha');
				if (oldCaptcha) {
					oldCaptcha.innerHTML = '';
				}
				const newContainer = document.createElement('div');
				newContainer.id = 'captcha';
				document.body.appendChild(newContainer);
				const script = document.createElement('script');
				script.src = "../../../static/ct4.js";
				script.onload = () => {
					initAlicom4({
						captchaId: this.aliConfig.captchaId,
						product: 'popup'
					}, (captcha) => {
						this.h5Captcha = captcha;
						captcha.appendTo("#captcha");
						if (!captcha.reset) {
							captcha.reset = function() {
								this.appendTo("#captcha");
								this.verify();
							}.bind(captcha);
						}
						captcha.onSuccess(() => {
							var result = captcha.getValidate();
							this.aliCaptchaResult = result;
							this.sendSmsAfterCaptcha();
						});
					});
				};
				document.body.appendChild(script);
				// #endif
			},

			sendSmsAfterCaptcha() {
				// #ifndef MP-WEIXIN
				if (!this.aliCaptchaResult) {
					uni.showToast({ title: '验证未通过', icon: 'none' });
					return;
				}
				// #endif
				const o = {
					client: this.client,
					platform: this.aliPlatform,
					mobile: this.mobile,
					...this.aliCaptchaResult
				};
				this.$store.dispatch('setMagicSendsms', o).then(res => {
					if (res == 'success') {
						this.button_type = false;
						let second = 60;
						const timer = setInterval(() => {
							second--;
							if (second) {
								this.button_text = this.send_again + '(' + second + 's)';
							} else {
								this.button_type = true;
								clearInterval(timer);
							}
						}, 1000);
					}
				});
			},

			validateSmsInput() {
				if (!this.mobile) {
					uni.showToast({ title: '请输入手机号', icon: 'none' });
					return false;
				}
				return true;
			},

			captchaSuccess(result) {
				if (this.captchaProcessing) return;
				this.captchaProcessing = true;
				setTimeout(() => {
					this.captchaProcessing = false;
				}, 2000);
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
				if (!this.captchaEventsBound) {
					this.$refs.captcha.$on('captchaSuccess', this.captchaSuccess);
					this.$refs.captcha.$on('captchaError', this.captchaError);
					this.$refs.captcha.$on('captchaFail', this.captchaFail);
					this.$refs.captcha.$on('captchaClose', this.captchaClose);
					this.captchaEventsBound = true;
				}
			},
			captchaClose() {},

			clickCaptcha(){
				this.$store.dispatch('setImgVerify');
			},

			formSubmit(e){
				let that = this
				var rule = [
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.mobile_not_null')},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.get_sms_code_notic')},
				];

				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					let o = JSON.parse(this.params);
					o.step = 2;
					o.mobile = that.mobile;
					o.client = that.client;
					o.code = that.sms;
					const bindRegisterUrl = (localConfig.websiteUrl || '') + '/api/oauth/bind_register'
					console.log('[bindUser][确认绑定] 接口:', bindRegisterUrl)
					console.log('[bindUser][确认绑定] 上传参数:', JSON.parse(JSON.stringify(o)))
					that.$store.dispatch('bindRegister', o).then(bindResult=>{
						if(bindResult.status == 'success'){
							if(bindResult.data.login == 1){
								uni.setStorageSync("token",bindResult.data.token);
								if (this.delta) {
									uni.navigateBack({
										delta:2
									})
								}else{
									uni.switchTab({
										url: '/pages/user/user'
									})
								}
							}
						}else{
							uni.showModal({
								content:bindResult.errors.message
							})
						}
					});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(e){
			this.params = e.params ? e.params : 0;
			this.delta = e.delta ? e.delta : 0;
			this.clickCaptcha();
		}
	}
</script>

<style lang="scss" scoped>
/* 与 accountsafe/bindphone 同一套布局：仅系统导航栏 + 渐变 + 表单区 */
.container-bwg {
	overflow-x: hidden;
	width: 100%;
	max-width: 100vw;
}

.container-bindphone {
	background: linear-gradient(180deg, #FFD4C8 0%, #F8F8F8 22%, #F8F8F8 100%);
	position: relative;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	overflow-x: hidden;
	width: 100%;
	max-width: 100%;
}

.page-header {
	padding: 60px 30px 24px;
}

.user-lr-form {
	flex: 1;
	background: #F8F8F8;
	border-radius: 24px 24px 0 0;
	padding: 32px 24px 20px;
	position: relative;
}

.phone-input-group {
	background: white;
	border-radius: 12px;
	padding: 12px 16px;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	gap: 12px;

	.phone-prefix {
		font-size: 15px;
		color: #333;
		padding-right: 12px;
		border-right: 1px solid #E5E5E5;
		flex-shrink: 0;
	}

	.input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 15px;
		color: #333;
		background: transparent;
		&::placeholder { color: #BFBFBF; }
	}

	.get-code-btn {
		font-size: 14px;
		color: #D23328;
		background: none;
		border: none;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.get-code-disabled {
		color: #999;
	}
}

.code-input-group {
	background: white;
	border-radius: 12px;
	padding: 12px 16px;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	gap: 12px;

	.input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 15px;
		color: #333;
		background: transparent;
		&::placeholder { color: #BFBFBF; }
	}
}

.submit-btn {
	width: 100%;
	height: 56px !important;
	min-height: 56px !important;
	max-height: 56px !important;
	padding: 0 !important;
	line-height: 56px !important;
	background: #D23328;
	color: #fff;
	border: none;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 500;
	margin-top: 16px;
	box-shadow: 0 4px 12px rgba(210, 51, 40, 0.35);
	&:active { opacity: 0.9; }
}
</style>
