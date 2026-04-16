<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-resetphone">
			<view class="page-header"></view>
			<view class="user-lr-form">
				<form @submit="formSubmit">
					<view class="phone-input-group">
						<view class="phone-prefix">+86</view>
						<input type="text" class="input" name="mobile" v-model="mobile" disabled />
					</view>
					<view class="code-input-group">
						<input type="text" class="input" name="sms" v-model="sms" maxlength="6" :placeholder="$t('lang.get_sms_code')" />
						<view class="get-code-btn" @click="handleSendSmsCode" v-if="button_type">{{$t('lang.get_code')}}</view>
						<view class="get-code-btn get-code-disabled" v-else>{{ button_text }}</view>
					</view>
					<button class="submit-btn" formType="submit">{{$t('lang.next_step')}}</button>
				</form>
			</view>
		</view>

		<SlideCaptcha
			v-if="showCaptcha"
			ref="slideCaptcha"
			:modal="true"
			:width="300"
			:height="150"
			@pass="onCaptchaPass"
			@close="onCaptchaClose"
		/>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	var graceChecker = require("@/common/graceChecker.js");
	import SlideCaptcha from '@/components/SlideCaptcha/index.vue';
	export default {
		data() {
			return {
				// 统一滑块验证码组件已替换阿里验证码
				mobile: '',
				sms: '',
				name: '',
				showCaptcha: false,
				captchaResult: null,
				button_text: this.$t('lang.send_again_60'),
				send_again: this.$t('lang.send_again'),
				button_type: true,
				disabled: true
			};
		},
		components: {
			uniIcons,
			SlideCaptcha
		},
		mounted() {
			// 新验证码组件在调用时动态加载，无需 mounted 初始化
			this.clickCaptcha(); // 保留获取 client 参数
		},
		computed:{
			...mapState({
				// captcha: state => state.common.imgVerify.captcha, // 【已注释】旧的图形验证码，现在使用阿里验证码
				client: state => state.common.imgVerify.client,
			}),
			token:{
				get(){
					return this.$store.state.user.token
				},
				set(val){
					this.$store.state.user.token = val
				}
			},
		},
		methods:{
			// 处理发送短信验证码 - 使用统一滑块验证码组件
			     handleSendSmsCode() {
					console.log('[resetphone] 点击获取验证码, button_type=', this.button_type, ', mobile=', this.mobile);
					if (!this.validateSmsInput()) return;
					this.captchaResult = null;
					this.showCaptcha = true;
					console.log('[resetphone] showCaptcha=true，等待 SlideCaptcha @pass');
			     },

			     onCaptchaPass(result) {
					console.log('[resetphone] onCaptchaPass, result=', result);
					this.showCaptcha = false;
					this.captchaResult = result || null;
					this.sendSmsAfterCaptcha(this.captchaResult);
			     },

			     onCaptchaClose() {
					console.log('[resetphone] onCaptchaClose, 用户关闭验证码');
					this.showCaptcha = false;
			     },
			     
			      // 验证成功后发送短信 - 已调整为不依赖阿里字段
			      sendSmsAfterCaptcha(captchaResult = null) {
			        const o = {
			          client: this.client,
			          mobile: this.mobile,
			          // 统一验证码票据，后端不再要求阿里特定结构 (per plan)
			          captcha_ticket: (captchaResult && captchaResult.ticket) || ('unified_slide_pass_' + Date.now())
			        };
			        console.log('[resetphone] 准备发送短信, payload=', o);
			
			        this.$store.dispatch('setMagicSendsms', o).then(res => {
			          console.log('[resetphone] setMagicSendsms 返回=', res);
			          // 验证接口返回结果
			          if (res === 'success' || res?.status === 'success') {
			            // 短信发送成功处理
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
			          } else {
			            uni.showToast({ title: res?.message || '发送失败，请重试', icon: 'none' });
			            // 接口失败时重置验证码状态
			            if (this.$refs.slideCaptcha && typeof this.$refs.slideCaptcha.reset === 'function') {
			              this.$refs.slideCaptcha.reset();
			            }
			          }
			        }).catch((err) => {
			          console.error('[resetphone] 发送短信接口异常:', err);
			          uni.showToast({ title: '发送失败，请检查网络', icon: 'none' });
			        });
			      },
			      
			      // 验证短信输入 - 验证码由 SlideCaptcha 统一处理
			      validateSmsInput() {
			        if (!this.mobile) {
			          uni.showToast({ title: '请输入手机号', icon: 'none' });
			          return false;
			        }
			        return true;
			      },
			      
			      // 已移除阿里验证码回调方法（统一由 SlideCaptcha 组件的 verify Promise 处理）
				  
			
			
			
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			// 【已注释】旧的发送验证码方法，现在使用 sendSmsAfterCaptcha
			// sendVerifyCode() {
			//     let o = {
			//         captcha: this.imgverifyValue,
			//         client: this.client,
			//         mobile: this.mobile
			//     }
			// 	this.$store.dispatch('setSendVerify', o).then(res => {
			// 	    if (res == 'success') {
			// 	        this.button_type = false
			// 	        let second = 60
			// 	        const timer = setInterval(() => {
			// 	            second--
			// 	            if (second) {
			// 	                this.button_text = this.send_again+'(' + second + 's)'
			// 	            } else {
			// 	                this.button_type = true
			// 	                clearInterval(timer);
			// 	            }
			// 	        }, 1000)
			// 	    }
			// 	})
			// },
			formSubmit(e){
				var rule = [
					// 表单验证（验证码由统一 SlideCaptcha 组件在发送短信前处理，无需额外图形验证码字段）
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.mobile_not_null')},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.get_sms_code_notic')},
				];

				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.request({
						url: this.websiteUrl + '/api/accountsafe/change_mobile',
						method: 'POST',
						data: {
							mobile:this.mobile,
							client:this.client,
							code:this.sms
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if(data.status === 'success'){
								uni.navigateTo({
									url:'/pagesB/accountsafe/bindphone/bindphone?step=2'
								})
							}else{
								if(data.errors){
									uni.showToast({
										title:data.errors.message,
										icon:'none'
									})
								}
							}
						},
						fail: (res) => {
							console.log(JSON.stringify(res))
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(options){
			this.mobile=options.id;

			// 获取 client 参数用于短信接口
			this.clickCaptcha();
		},
		onHide() {
			this.showCaptcha = false;
			if (this.$refs.slideCaptcha && typeof this.$refs.slideCaptcha.reset === 'function') {
				this.$refs.slideCaptcha.reset();
			}
		},
		onUnload() {
			this.showCaptcha = false;
			if (this.$refs.slideCaptcha && typeof this.$refs.slideCaptcha.reset === 'function') {
				this.$refs.slideCaptcha.reset();
			}
		}
	}
</script>

<style lang="scss" scoped>
.container-bwg {
	overflow-x: hidden;
	width: 100%;
	max-width: 100vw;
}

.container-resetphone {
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
}
</style>
