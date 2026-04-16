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
		<SlideCaptcha ref="slideCaptcha" @pass="onCaptchaPass" @close="onCaptchaClose" @fail="onCaptchaFail" />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	var graceChecker = require("@/common/graceChecker.js");
	import SlideCaptcha from "@/components/SlideCaptcha/index.vue";

	export default {
		data() {
			return {
				captchaTicket: '',
				mobile: '',
				sms: '',
				button_text: this.$t('lang.send_again_60'),
				send_again: this.$t('lang.send_again'),
				button_type: true,
			};
		},
		components: {
			uniIcons,
			SlideCaptcha
		},
		computed: {
			...mapState({
				client: state => state.common.imgVerify.client,
			}),
			token: {
				get() { return this.$store.state.user.token },
				set(val) { this.$store.state.user.token = val }
			},
		},
		methods: {
			handleSendSmsCode() {
				if (!this.mobile) {
					uni.showToast({ title: '请输入手机号', icon: 'none' });
					return;
				}
				// #ifdef MP-WEIXIN
				this.sendSms();
				return;
				// #endif
				this.$refs.slideCaptcha.open();
			},
			onCaptchaPass(data) {
				this.captchaTicket = data.ticket || '';
				this.sendSms();
			},
			onCaptchaClose() {},
			onCaptchaFail() {},

			sendSms() {
				const o = {
					client: this.client,
					mobile: this.mobile,
					captcha_ticket: this.captchaTicket,
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

			formSubmit(e) {
				var rule = [
					{ name: "mobile", checkType: "notnull", checkRule: "", errorMsg: this.$t('lang.mobile_not_null') },
					{ name: "sms", checkType: "notnull", checkRule: "", errorMsg: this.$t('lang.get_sms_code_notic') },
				];
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					uni.request({
						url: this.websiteUrl + '/api/accountsafe/change_mobile',
						method: 'POST',
						data: {
							mobile: this.mobile,
							client: this.client,
							code: this.sms
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data;
							if (data.status === 'success') {
								uni.navigateTo({ url: '/pagesB/accountsafe/bindphone/bindphone?step=2' });
							} else {
								if (data.errors) {
									uni.showToast({ title: data.errors.message, icon: 'none' });
								}
							}
						},
						fail: (res) => { console.log(JSON.stringify(res)); }
					});
				} else {
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(options) {
			this.mobile = options.id;
			this.$store.dispatch('setImgVerify');
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
