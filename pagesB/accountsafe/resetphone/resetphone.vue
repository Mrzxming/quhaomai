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

		<!-- #ifdef APP-PLUS -->
		<captcha-slide ref="captchaSlide"
		  @success="onCaptchaSuccess"
		  @close="onCaptchaClose"
		  @fail="onCaptchaFail"
		  @ready="onCaptchaReady" />
		<!-- #endif -->
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	var graceChecker = require("@/common/graceChecker.js");
	import CaptchaSlideComponent from "@/components/captcha-slide/index.vue";

	// #ifdef H5
	let CaptchaSlideLib = null;
	// #endif

	export default {
		data() {
			return {
				captchaPassed: false,
				mobile:'',
				sms:'',
				name:'',
				button_text: this.$t('lang.send_again_60'),
				send_again:this.$t('lang.send_again'),
				button_type:true,
				disabled:true
			};
		},
		components:{
			uniIcons,
			'captcha-slide': CaptchaSlideComponent
		},
		mounted() {
			// #ifdef H5
			this._loadH5CaptchaLib();
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
			},
		},
		methods:{
			// #ifdef H5
			_loadH5CaptchaLib() {
				if (CaptchaSlideLib) return;
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/static/captcha_slide.css';
				document.head.appendChild(link);

				const script = document.createElement('script');
				script.src = '/static/captcha_slide.js';
				script.onload = () => {
					CaptchaSlideLib = window.CaptchaSlide;
				};
				document.body.appendChild(script);
			},
			// #endif

			handleSendSmsCode() {
				if (!this.validateSmsInput()) return;

				// #ifdef MP-WEIXIN
				this.sendSmsAfterCaptcha();
				return;
				// #endif

				// #ifdef H5
				if (!CaptchaSlideLib) {
					uni.showToast({ title: '验证码加载中，请稍候', icon: 'none' });
					return;
				}
				CaptchaSlideLib.verify().then(() => {
					this.captchaPassed = true;
					this.sendSmsAfterCaptcha();
				}).catch(() => {});
				return;
				// #endif

				// #ifdef APP-PLUS
				this.$refs.captchaSlide.showCaptcha();
				// #endif
			},

			onCaptchaSuccess(result) {
				this.captchaPassed = true;
				this.sendSmsAfterCaptcha();
			},
			onCaptchaClose() {},
			onCaptchaFail() {
				uni.showToast({ title: '验证失败，请重试', icon: 'none' });
			},
			onCaptchaReady() {},

			sendSmsAfterCaptcha() {
				const o = {
					client: this.client,
					mobile: this.mobile,
				}

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
			},

			validateSmsInput() {
				if (!this.mobile) {
					uni.showToast({ title: '请输入手机号', icon: 'none' });
					return false;
				}
				return true;
			},

			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},

			formSubmit(e){
				var rule = [
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.mobile_not_null')},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.get_sms_code_notic')},
				];

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
			this.clickCaptcha();
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
