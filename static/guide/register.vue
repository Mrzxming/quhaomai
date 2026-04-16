<template>
	<view class="container">
		<form @submit="formLogin">
			<view class="tui-login-from">
				<view class="tui-line-cell">
					<image src="/static/login/login_1.png" style="width: 40rpx;height: 40rpx;margin-left: -6rpx">
					</image>
					<input placeholder-class="phcolor" class="tui-input" name="mobile" placeholder="请输入手机号"
						v-model="mobile" type="number" maxlength="11"/>
				</view>
				<view class="tui-line-cell">
					<image src="/static/login/login_3.png" style="width: 40rpx;height: 40rpx;margin-left: -6rpx">
					</image>
					<input placeholder-class="phcolor" class="tui-input" name="smsCode" placeholder="请输入验证码"
						maxlength="6" v-model="smsCode" type="text" />
					<view
						style="color: #FFFFFF;font-size: 22rpx;border: 2rpx solid #1D94FF;padding: 12rpx 46rpx;border-radius: 50rpx;background-color: #1D94FF;"
						@click="btnSend" v-if="noClick == true">{{btnText}}</view>
					<view
						style="color: #FFFFFF;font-size: 22rpx;border: 2rpx solid #1D94FF;padding: 12rpx 46rpx;border-radius: 50rpx;background-color: #1D94FF;"
						v-else>{{btnText}}</view>
				</view>
				<view class="tui-line-cell">
					<image src="/static/login/login_2.png" style="width: 40rpx;height: 40rpx;margin-left: -6rpx">
					</image>
					<input placeholder-class="phcolor" class="tui-input" name="password" placeholder="请输入密码"
						v-model="password" :password="showPassword" />
					<image v-if="showPassword" @click="changePassword" src="/static/login/login_5.png"
						class="pwdImage" />
					<image v-else @click="changePassword" src="/static/login/login_4.png" class="pwdImages" />
				</view>
				<button class="tui-btn-submits" hover-class="btn-hover"
					v-if="mobile == '' || password == '' || smsCode == ''">新用户注册</button>
				<button class="tui-btn-submit" hover-class="btn-hover" v-else form-type="submit">新用户注册</button>
			</view>
		</form>
		<view class="tui-protocols">
			<view style="display: flex;align-items: center;justify-content: center;">
				<radio style="transform:scale(0.6);vertical-align: middle;" color="#1D94FF" :checked="checkeds"
					@click="cutCheckeds"></radio>
				已阅读并同意
				<text class="tui-left20" @tap="toTrain">《嘚嘚象隐私政策》</text>
				和
				<text class="tui-left20" @tap="toAgreement">《嘚嘚象用户协议》</text>
			</view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<captcha ref="captcha" :config="config" @captchaSuccess="captchaSuccess" @captchaError="captchaError"
			@captchaFail="captchaFail" @captchaReady="captchaReady" @captchaClose="captchaClose"></captcha>
		<!-- #endif -->

	</view>
</template>

<script>
	var app = getApp()
	var a;
	var commonParam;
	const util = require('../../../utils/util.js')
	const api = require("../../../config/api.js");
	import captcha from "@/components/captcha4/index.vue";
	export default {
		data() {
			return {
				config: {
					captchaId: "187c68c10b353285aee04ea098810301",
				},
				captchaResult: '',
				captchaInstance: '',
				platform: '',
				disabled: false,
				btnText: "获取验证码",
				mobile: "",
				password: "",
				type: "primary",
				code: "",
				smsCode: "",
				showPassword: true,
				noClick: true,
				checkeds: false,
			}
		},
		onShow() {
			commonParam = {
				CLIENT_API: 'BIZ',
				CLIENT_OS: '',
				CITY_ID: '',
				CLIENT_VER: '',
				REGISTER_ID: '',
				TOKEN: uni.getStorageSync('token'),
				data: '',
				API: ''
			}
		},
		mounted() {
			var that = this
			// #ifdef  H5
			that.loadCaptchaSDK()
			// #endif
		},
		components: {
			captcha,
		},
		onLoad() {
			var that = this
			that.detectPlatform()
			that.getCaptchaId()
		},
		methods: {
			// #ifdef H5
			// 加载验证码SDK
			loadCaptchaSDK() {
				const script = document.createElement('script');
				script.src = 'https://static.alicaptcha.com/v4/ct4.js';
				script.onload = () => {
					console.log('阿里云验证码SDK加载成功');
					this.sdkLoaded = true;
					this.$nextTick(() => {
						this.initCaptcha();
					});
				};
				script.onerror = () => {
					console.error('阿里云验证码SDK加载失败');
					uni.showToast({
						icon: 'none',
						title: '验证码服务加载失败'
					});
				};
				document.head.appendChild(script);
			},

			// 初始化验证码实例
			initCaptcha() {
				if (!window.initAlicom4) {
					uni.showToast({
						icon: 'none',
						title: '验证码服务未就绪，请稍后重试'
					});
					return;
				}
				// 获取当前平台的captchaId
				const captchaId = this.getCaptchaId();
				window.initAlicom4({
					captchaId: captchaId,
					product: 'bind',
					protocol: 'https://' // 部署在对应服务上可删除此配置
				}, (captcha) => {
					this.captchaInstance = captcha;
					console.log('验证码实例初始化成功:', captcha);
					captcha.onReady(() => {
						console.log('验证码已准备好');
					}).onSuccess(() => {
						// 验证成功
						this.captchaResult = captcha.getValidate();
						if (!this.captchaResult) {
							uni.showToast({
								icon: 'none',
								title: '验证失败，请重试'
							});
							return;
						}
						this.captchaResult.captcha_id = "187c68c10b353285aee04ea098810301";
						// 调用后端接口获取短信验证码
						this.doLoop(60);
					}).onError((err) => {
						// 验证失败
						console.error('验证码验证错误:', err);
						uni.showToast({
							icon: 'none',
							title: '验证码验证失败，请重试'
						});
					});
				});
			},
			// #endif
			// #ifdef APP-PLUS
			captchaSuccess(result) {
				var that = this
				console.log('captchaSuccess', result)
				that.captchaResult = result
				setTimeout(() => {
					that.doLoop(60)
				}, 1000)
				console.log('captchaResult', that.captchaResult)
			},
			captchaReady() {},
			captchaError(e) {
				uni.showToast({
					title: JSON.stringify(e),
					icon: "none",
					duration: 2000,
				});
			},
			captchaFail() {
				var that = this
				that.btnText = '获取验证码'
				that.disabled = false;
				that.noClick = true
			},
			captchaClose() {
				var that = this
				that.btnText = '获取验证码'
				that.disabled = false;
				that.noClick = true
			},
			// #endif
			detectPlatform() {
				// #ifdef H5
				this.platform = 'H5';
				// #endif
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform === 'android') {
					this.platform = 'Android';
				} else {
					this.platform = 'iOS';
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.platform = 'H5'; // 小程序使用H5的captchaId
				// #endif
			},

			getCaptchaId() {
				var that = this
				switch (this.platform) {
					case 'Android':
						that.config.captchaId = 'e90ac1a1fb5b0ccf1de82096c870a118'
						break;
					case 'iOS':
						that.config.captchaId = 'b7c339f0f58c73ec984074e73ed4a365';
						break;
					default: // H5、小程序等
						that.config.captchaId = '187c68c10b353285aee04ea098810301';
						// break;
						return '187c68c10b353285aee04ea098810301';
				}
			},

			btnSend: function() {
				var that = this
				if (util.isNullOrEmpty(this.mobile)) {
					this.tui.toast('请输入手机号码');
					return
				} else if (!util.isMobile(this.mobile)) {
					this.tui.toast('请输入正确的手机号码');
					return
				}
				this.disabled = true;
				this.btnText = "请稍候...";
				this.type = "gray"
				this.noClick = false
				setTimeout(() => {
					// #ifdef APP-PLUS
					this.$refs.captcha.showCaptcha();
					// #endif
					if (!this.captchaInstance) {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: '验证码服务正在初始化，请稍候重试'
						// });
						this.initCaptcha();
						return;
					}

					if (typeof this.captchaInstance.showCaptcha === 'function') {
						this.captchaInstance.showCaptcha();
					} else {
						console.error('showCaptcha方法不存在，尝试使用其他方法');
						if (typeof this.captchaInstance.render === 'function') {
							this.captchaInstance.render();
						} else if (typeof this.captchaInstance.show === 'function') {
							this.captchaInstance.show();
						} else {
							uni.showToast({
								icon: 'none',
								title: '无法显示验证码，请重试'
							});
						}
					}
				}, 500)
			},

			// 获取验证码
			doLoop: function(seconds) {
				var that = this
				if (!this.captchaResult) {
					uni.showToast({
						icon: 'none',
						title: '请先完成验证码验证'
					});
					that.btnText = '获取验证码'
					that.disabled = false;
					that.noClick = true
					return;
				}
				if (!this.mobile) {
					return;
				}
				var a = {
					"mobile": this.mobile,
					"lot_number": this.captchaResult.lot_number || '',
					"captcha_output": this.captchaResult.captcha_output || '',
					"pass_token": this.captchaResult.pass_token || '',
					"gen_time": this.captchaResult.gen_time || '',
					"platform": this.platform
				}
				commonParam.API = "magic/sendsmsupgrade"
				commonParam.data = JSON.stringify(a)
				uni.request({
					url: api.apiRootUrl,
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					data: commonParam,
					success: (res) => {
						if (res.data.error == 0) {
							seconds = seconds ? seconds : 60;
							this.btnText = seconds + "s后获取";
							let countdown = setInterval(() => {
								if (seconds > 0) {
									this.btnText = seconds + "s后获取"
										--seconds;
								} else {
									this.btnText = "获取验证码";
									this.disabled = false;
									this.type = "primary";
									this.noClick = true
									clearInterval(countdown);
								}
							}, 1000);
							commonParam.API = ''
							commonParam.data = ''
						} else {
							this.tui.toast(res.data.message);
							that.btnText = '获取验证码'
							that.disabled = false;
							that.noClick = true
							if (this.captchaInstance && typeof this.captchaInstance.reset === 'function') {
								this.captchaInstance.reset();
							}
						}
					},
					fail: (data, code) => {
						that.tui.toast('网络连接不可用,请检查网络')
					}
				})
			},

			// todo 提交
			formLogin: function(e) {
				var that = this;
				let mobile = e.detail.value.mobile;
				let smsCode = e.detail.value.smsCode;
				let password = e.detail.value.password;
				if (util.isNullOrEmpty(mobile)) {
					this.tui.toast('请输入手机号码');
					return
				} else if (!util.isMobile(mobile)) {
					that.tui.toast('请输入正确的手机号码');
					return
				} else if (util.isNullOrEmpty(smsCode)) {
					that.tui.toast('请输入验证码');
					return
				} else if (util.isNullOrEmpty(password)) {
					this.tui.toast('请输入密码');
					return
				} else if (that.checkeds == false) {
					that.tui.toast('请勾选“隐私政策和用户协议”');
					return
				}

				a = {
					"mobile": mobile,
					"passwd": password,
					"sms": smsCode,
					"source": 'app'
				}
				commonParam.API = "biz/account/setmobile"
				commonParam.data = JSON.stringify(a)
				uni.request({
					url: api.apiRootUrl,
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					data: commonParam,
					success: res => {
						if (res.data.error == 0) {
							setTimeout(() => {
								uni.redirectTo({
									url: '../login/login'
								});
							}, 1000);
						}
						that.tui.toast(res.data.message);
						commonParam.API = ''
						commonParam.data = ''
					},
					fail: (data, code) => {
						that.tui.toast('网络连接不可用,请检查网络')
					}
				});
			},
			toAgreement: function() {
				var that = this
				uni.navigateTo({
					url: '/pages/affair/agreement/agreement'
				})
			},

			toTrain: function() {
				var that = this
				uni.navigateTo({
					url: '/pages/affair/train/train'
				})
			},
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},

			cutCheckeds: function() {
				var that = this
				if (that.checkeds == false) {
					that.checkeds = true
				} else {
					that.checkeds = false
				}
			},
		},
		onReady() {

		}
	}
</script>

<style>
	@import '../../../static/style/thorui.css';

	page {
		background: #fff;
	}

	.tui-login-from {
		width: 100%;
		padding: 120rpx 80rpx 0 80rpx;
		box-sizing: border-box;
	}

	.tui-input {
		font-size: 32rpx;
		flex: 1;
		display: inline-block;
		padding-left: 22rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell {
		padding: 34rpx 0;
		display: -webkit-flex;
		display: flex;
		-webkiit-align-items: center;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #E5E5E5;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.buttons {
		margin-top: 50%;
		font-size: 32rpx;
		line-height: 30px;
		width: 60%;
		height: 60rpx;
		border-radius: 50rpx;
		background-color: #1D94FF;
		color: #ffffff;
	}

	.phcolor {
		color: #d1d1d1;
		font-size: 30rpx;
	}

	.uni-eye-active {
		color: #1D94FF;
	}

	.pwdImage {
		width: 40rpx;
		height: 36rpx;
	}

	.pwdImages {
		width: 40rpx;
		height: 30rpx;
	}

	.tui-btn-submit {
		margin-top: 130rpx;
		background-color: #1D94FF;
		color: #FFFFFF;
		border-radius: 50rpx;
		height: 86rpx;
		line-height: 86rpx;
	}

	.tui-btn-submits {
		margin-top: 130rpx;
		background-color: #B0D1FF;
		color: #FFFFFF;
		border-radius: 50rpx;
		height: 86rpx;
		line-height: 86rpx;
	}

	.tui-protocol {
		color: #333;
		/* float: right; */
		font-size: 24rpx;
		margin-top: 29rpx;
		/* color: #1D94FF; */
	}

	.tui-protocols {
		color: #333;
		font-size: 24rpx;
		margin-top: 32rpx;
		text-align: center;
	}

	.tui-left20 {
		color: #1D94FF;
	}
</style>