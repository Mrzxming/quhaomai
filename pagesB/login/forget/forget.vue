<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-forget">
			<view class="forget-header"></view>
			<view class="user-lr-form">
				<form @submit="formSubmit">
					<view class="phone-input-group">
						<view class="phone-prefix">+86</view>
						<input type="text" class="input" name="mobile" v-model="mobile" :disabled="isDisabled" :placeholder="mobile_placeholder" />
						<view class="get-code-btn" @click="sendVerifyCode" v-if="button_type">{{$t('lang.get_code')}}</view>
						<view class="get-code-btn get-code-disabled" v-else>{{ button_text }}</view>
					</view>
					<view class="code-input-group">
						<input type="text" class="input" name="sms" v-model="sms" maxlength="6" :placeholder="$t('lang.get_sms_code')" />
					</view>
					<button class="submit-btn" :class="{'btn-disabled':disabled}" formType="submit" :disabled="disabled">{{$t('lang.next_step')}}</button>
				</form>
			</view>
		</view>

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
	import { mapState } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	var graceChecker = require("@/common/graceChecker.js");
	import captcha from "@/components/captcha4/index.vue";
	// #ifdef H5
	import { initAliCaptchaH5, cleanupAliCaptchaDom } from '@/utils/aliCaptcha.js'
	// #endif
	export default {
		data() {
			return {
				// 阿里验证码相关数据
				aliConfig: {
					captchaId: "",
				},
				aliCaptchaResult: null,
				aliPlatform: '',
				// imgverifyValue:'', // 【已注释】旧的图形验证码，现在使用阿里验证码
				sms:'',
				button_text: this.$t('lang.send_again_60'),
				send_again:this.$t('lang.send_again'),
				button_type:true,
				disabled:true,
				isDisabled:true
			};
		},
		components:{
			uniIcons,
			captcha
		},
		computed:{
			...mapState({
				// captcha: state => state.common.imgVerify.captcha, // 【已注释】旧的图形验证码，现在使用阿里验证码
				client: state => state.common.imgVerify.client,
				userInfo: state => state.user.userInfo
			}),
			mobile(){
				return this.userInfo.mobile
			},
			mobile_placeholder(){
				return this.userInfo.mobile ? this.$t('lang.enter_mobile') : '尚未绑定手机号'
			},
			token:{
				get(){
					return this.$store.state.user.token
				},
				set(val){
					this.$store.state.user.token = val
				}
			},
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
		methods:{
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
				
				
			},
			
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha(){
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
				
				// 【已注释】旧的图形验证码检查，现在使用阿里验证码
				// if (!this.imgverifyValue) {
				// 	uni.showToast({ title: '请输入图形验证码', icon: 'none' });
				// 	return false;
				// }
				
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
					console.warn('[forget] H5 aliCaptcha init failed:', e)
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
					// captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
					client: this.client,
					mobile: this.mobile,
					// 添加阿里验证参数
					platform: this.aliPlatform,
					...this.aliCaptchaResult
				}

				uni.request({
					url: this.websiteUrl + '/api/user/profile/basic',
					method: 'GET',
					data: {
						name:this.mobile
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data
						if(data.status === 'success'){
							this.disabled = false
							// 【修改】将 setSendVerify 改为 setMagicSendsms
							this.$store.dispatch('setMagicSendsms', o).then(res => {
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
						}else{
							this.disabled = true
							uni.showToast({
								title:this.$t('lang.user_not_exist'),
								icon:'none'
							})
						}
					},
					fail: (res) => {
						console.log(JSON.stringify(res))
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
			formSubmit(e){
				var rule = [
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.mobile_not_null')},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.get_sms_code_notic')},
				];

				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.navigateTo({
						url:'../reset/reset?mobile='+this.mobile+'&client='+this.client+'&code='+this.sms
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
		},
		onLoad(){
			// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
			this.clickCaptcha();

			this.$store.dispatch('userProfile');
		}
	}
</script>

<style lang="scss" scoped>
/* 与登录/注册一致：头部背景、内容区背景、输入框与按钮 */
.container-bwg {
	overflow-x: hidden;
	width: 100%;
	max-width: 100vw;
}

.container-forget {
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

.forget-header {
	padding: 60px 30px 24px;
}

.user-lr-form {
	flex: 1;
	background: #F8F8F8;
	border-radius: 24px 24px 0 0;
	padding: 32px 24px 20px;
	position: relative;

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
		&.btn-disabled {
			opacity: 0.4;
		}
	}
}
</style>
