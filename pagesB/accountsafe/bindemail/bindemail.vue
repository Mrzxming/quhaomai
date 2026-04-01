<template>
	<view class="container-bwg">
		<view class="user-lr-form">
			<view class="title">绑定邮箱</view>
			<form @submit="formSubmit">
				<view class="item-inputs">
					<view class="item-input">
						<label><text class="iconfont icon-mobiles"></text></label>
						<input type="text" name="email" v-model="email" placeholder="请输入邮箱地址" @input="validateEmailInput" @focus="handleInputFocus" @blur="handleInputBlur" adjust-position="false" hold-keyboard />
						<view class="key">
							<view class="key-divider"></view>
							<view class="get-code-btn" :class="{'btn-disabled': !isEmailValid || !button_type, 'btn-active': isEmailValid && button_type}" @click="handleSendCode">
								<text v-if="button_type && isEmailValid">获取验证码</text>
								<text v-else-if="!isEmailValid">获取验证码</text>
								<text v-else>{{ button_text }}</text>
							</view>
						</view>
					</view>
					<view class="item-input">
						<label><text class="iconfont icon-key"></text></label>
						<input type="text" name="code" v-model="code" maxlength="6" placeholder="请输入邮箱验证码" @input="validateCodeInput" @focus="handleInputFocus" @blur="handleInputBlur" adjust-position="false" hold-keyboard />
					</view>
				</view>
				<view class="btn-bar btn-bar-radius">
					<button class="btn" :class="[disabled ? 'btn-disabled' : 'btn-red']" formType="submit" :disabled="disabled">绑定</button>
				</view>
			</form>
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
		export default {
			data() {
				return {
					// 阿里验证码相关数据
					captchaProcessing: false,
					captchaEventsBound: false,
					aliConfig: {
						captchaId: "",
					},
					aliCaptchaResult: null,
					aliPlatform: '',
					email: '',
					code: '',
					button_text: '重新发送(60s)',
					send_again: '重新发送',
					button_type: true,
					disabled: true,
					isEmailValid: false,
					isInputFocused: false // 输入框是否获得焦点
				};
			},
		components: {
			uniIcons,
			captcha
		},
		mounted() {
			this.detectAliPlatform();
			// #ifdef H5
			this.initH5AliCaptcha();
			// #endif
		},
		computed: {
			...mapState({
				client: state => state.common.imgVerify.client,
			}),
			token: {
				get() {
					return this.$store.state.user.token
				},
				set(val) {
					this.$store.state.user.token = val
				}
			}
		},
		beforeDestroy() {
			// 组件销毁时解绑事件
			if (this.$refs.captcha && this.captchaEventsBound) {
				this.$refs.captcha.$off('captchaSuccess', this.captchaSuccess);
				this.$refs.captcha.$off('captchaError', this.captchaError);
				this.$refs.captcha.$off('captchaFail', this.captchaFail);
				this.$refs.captcha.$off('captchaClose', this.captchaClose);
			}
		},
		methods: {
			// 处理输入框获得焦点
			handleInputFocus() {
				this.isInputFocused = true;
				// 防止页面滚动
				// #ifdef H5
				document.body.style.overflow = 'hidden';
				// #endif
			},
			// 处理输入框失去焦点
			handleInputBlur() {
				this.isInputFocused = false;
				// 恢复页面滚动
				// #ifdef H5
				setTimeout(() => {
					document.body.style.overflow = '';
				}, 300);
				// #endif
			},
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
			
			// 邮箱格式校验
			validateEmail(email) {
				// 基本格式验证
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(email)) {
					return false;
				}
				
				// 获取域名部分（@后面的部分）
				const domainPart = email.split('@')[1];
				if (!domainPart) {
					return false;
				}
				
				// 获取最后两个字符
				const lastTwoChars = domainPart.slice(-2).toLowerCase();
				
				// 如果最后两位是 "co"，需要等待输入完整（如 "com"），至少3个字符
				if (lastTwoChars === 'co') {
					// .co 需要至少3个字符（如 .com, .co.uk）
					return domainPart.split('.').pop().length >= 3;
				}
				
				// 如果最后两位是 "cn"，直接高亮（.cn 是完整的域名）
				if (lastTwoChars === 'cn') {
					return domainPart.split('.').pop().length >= 2;
				}
				
				// 其他情况：域名部分至少需要2个字符
				return domainPart.split('.').pop().length >= 2;
			},
			
			// 邮箱输入校验
			validateEmailInput() {
				// 实时验证邮箱格式
				if (!this.email || this.email.trim() === '') {
					this.isEmailValid = false;
				} else {
					this.isEmailValid = this.validateEmail(this.email);
				}
				this.updateButtonState();
			},
			
			// 验证码输入校验
			validateCodeInput() {
				this.updateButtonState();
			},
			
			// 更新按钮状态
			updateButtonState() {
				// 绑定按钮：邮箱格式正确且验证码为6位数字
				if (this.isEmailValid && this.code && this.code.length === 6) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			},
			
			// 处理发送验证码
			handleSendCode() {
				// 如果未输入邮箱
				if (!this.email || this.email.trim() === '') {
					uni.showToast({
						title: '请先输入邮箱',
						icon: 'none'
					});
					return;
				}
				
				// 如果邮箱格式不正确
				if (!this.isEmailValid) {
					uni.showToast({
						title: '请输入正确的邮箱地址',
						icon: 'none'
					});
					return;
				}
				
				// 如果正在倒计时
				if (!this.button_type) {
					return;
				}
				
				// #ifdef MP-WEIXIN
				this.sendEmailCodeAfterCaptcha();
				// #endif
				
				// #ifdef H5
				if (this.h5Captcha) {
					// 重置验证码状态
					try {
						this.h5Captcha.reset();
					} catch (e) {
						console.log('重置验证码失败:', e);
					}
					
					// 重新显示验证码
					const captchaButton = document.querySelector('#captcha .captcha4_btn_click');
					if (captchaButton) {
						captchaButton.click();
					} else {
						console.warn('验证码按钮未找到，重新初始化');
						this.initH5AliCaptcha();
						setTimeout(() => {
							const newButton = document.querySelector('#captcha .captcha4_btn_click');
							if (newButton) newButton.click();
						}, 500);
					}
				} else {
					this.initH5AliCaptcha();
				}
				// #endif
				
				// #ifdef APP-PLUS
				this.$refs.captcha.showCaptcha();
				// #endif
			},
			
			// 修改initH5AliCaptcha方法
			initH5AliCaptcha() {
				// #ifdef H5
				// 清理旧的验证码实例
				const oldCaptcha = document.getElementById('captcha');
				if (oldCaptcha) {
					oldCaptcha.innerHTML = '';
				}
				
				// 创建新的容器
				const newContainer = document.createElement('div');
				newContainer.id = 'captcha';
				document.body.appendChild(newContainer);
				
				// 重新加载脚本
				const script = document.createElement('script');
				script.src = "../../../static/ct4.js";
				script.onload = () => {
					initAlicom4({
						captchaId: this.aliConfig.captchaId,
						product: 'popup'
					}, (captcha) => {
						this.h5Captcha = captcha;
						captcha.appendTo("#captcha");
						
						// 添加重置方法（如果SDK未提供）
						if (!captcha.reset) {
							captcha.reset = function() {
								this.appendTo("#captcha");
								this.verify();
							}.bind(captcha);
						}
						
						captcha.onSuccess(() => {
							console.log("h5验证码成功")
							var result = captcha.getValidate();
							this.aliCaptchaResult = result;
							this.sendEmailCodeAfterCaptcha();
						});
					});
				};
				document.body.appendChild(script);
				// #endif
			},
			
			// 验证成功后发送邮箱验证码
			sendEmailCodeAfterCaptcha() {
				// #ifndef MP-WEIXIN
				if (!this.aliCaptchaResult) {
					uni.showToast({
						title: '验证未通过',
						icon: 'none'
					});
					return;
				}
				// #endif
				
				uni.request({
					url: this.websiteUrl + '/api/accountsafe/bind_email_sendCode',
					method: 'POST',
					data: {
						email: this.email,
						client: this.client,
						platform: this.aliPlatform,
						...this.aliCaptchaResult
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data;
						if (data.status === 'success') {
							// 验证码发送成功，开始倒计时
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
							
							uni.showToast({
								title: '验证码已发送',
								icon: 'success'
							});
						} else {
							if (data.errors) {
								uni.showToast({
									title: data.errors.message || '发送失败',
									icon: 'none'
								});
							}
						}
					},
					fail: (err) => {
						console.error('发送验证码失败:', err);
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			},
			
			// APP验证码回调方法
			captchaSuccess(result) {
				console.log("APP验证码回调方法");
				// 防止重复执行
				if (this.captchaProcessing) return;
				this.captchaProcessing = true;
				
				// 2秒后重置状态
				setTimeout(() => {
					this.captchaProcessing = false;
				}, 2000);
				
				this.aliCaptchaResult = result;
				this.sendEmailCodeAfterCaptcha();
			},
			captchaError(e) {
				console.error('验证码错误:', e);
				uni.showToast({
					title: '验证失败，请重试',
					icon: "none"
				});
			},
			captchaFail() {
				uni.showToast({
					title: '验证失败',
					icon: "none"
				});
			},
			captchaReady() {
				console.log('阿里验证码准备就绪');
				
				if (!this.captchaEventsBound) {
					this.$refs.captcha.$on('captchaSuccess', this.captchaSuccess);
					this.$refs.captcha.$on('captchaError', this.captchaError);
					this.$refs.captcha.$on('captchaFail', this.captchaFail);
					this.$refs.captcha.$on('captchaClose', this.captchaClose);
					
					this.captchaEventsBound = true;
				}
			},
			captchaClose() {
				console.log('阿里验证码关闭');
			},
			
			// 调用图形验证码接口获取 client 参数
			clickCaptcha() {
				this.$store.dispatch('setImgVerify');
			},
			
			// 表单提交
			formSubmit(e) {
				var that = this;
				var rule = [
					{ name: "email", checkType: "notnull", checkRule: "", errorMsg: "请输入邮箱地址" },
					{ name: "code", checkType: "notnull", checkRule: "", errorMsg: "请输入验证码" },
				];
				
				// 进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if (checkRes) {
					// 再次校验邮箱格式
					if (!this.validateEmail(this.email)) {
						uni.showToast({
							title: '请输入正确的邮箱地址',
							icon: 'none'
						});
						return;
					}
					
					// 校验验证码长度
					if (this.code.length !== 6) {
						uni.showToast({
							title: '请输入6位验证码',
							icon: 'none'
						});
						return;
					}
					
					// 调用绑定邮箱接口
					uni.request({
						url: this.websiteUrl + '/api/accountsafe/bind_email',
						method: 'POST',
						data: {
							email: this.email,
							code: this.code
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data;
							if (data.status === 'success') {
								uni.showToast({
									title: '绑定成功',
									icon: 'success'
								});
								
								// 延迟返回上一页
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 1500);
							} else {
								if (data.errors) {
									uni.showToast({
										title: data.errors.message || '绑定失败',
										icon: 'none'
									});
								} else {
									uni.showToast({
										title: '绑定失败',
										icon: 'none'
									});
								}
							}
						},
						fail: (err) => {
							console.error('绑定失败:', err);
							uni.showToast({
								title: '网络错误，请重试',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			}
		},
		onLoad(e) {
			// 调用接口获取 client 参数
			this.clickCaptcha();
		}
	}
</script>

<style>
.container-bwg {
	height: 100vh;
	overflow: hidden;
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 1;
}

.user-lr-form {
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	padding-bottom: env(safe-area-inset-bottom);
}

/* 防止输入法弹出时页面滚动 */
/* #ifdef APP-PLUS */
.uni-page-body {
	overflow: hidden !important;
	position: fixed !important;
	width: 100% !important;
	height: 100vh !important;
}
/* #endif */

/* #ifdef MP-WEIXIN */
page {
	overflow: hidden !important;
	height: 100vh !important;
}
/* #endif */

.user-lr-form .item-input label {
	width: auto;
	height: 1.4rem;
	line-height: 1.4rem;
}

.tips {
	font-size: 25upx;
	color: #888888;
	margin-top: 10upx;
}

/* 竖杠分隔线 */
.key-divider {
	width: 1px;
	height: 30rpx;
	background-color: #d7d7d7;
	margin-right: 20rpx;
}

/* 获取验证码按钮样式 */
.get-code-btn {
	display: inline-block;
	padding: 8rpx 24rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	text-align: center;
	min-width: 160rpx;
	transition: all 0.3s;
}

.get-code-btn.btn-disabled {
	background-color: #e0e0e0;
	color: #999999;
}

.get-code-btn.btn-active {
	background-color: #1D94FF;
	color: #FFFFFF !important;
	font-weight: 500;
}

.get-code-btn.btn-active text {
	color: #FFFFFF !important;
}

.key {
	display: flex;
	align-items: center;
}

/* 去掉 .key 内 uni-text 的边框 */
.user-lr-form .item-input .key uni-text {
	border-left: none !important;
	border-right: none !important;
	border-top: none !important;
	border-bottom: none !important;
	padding: 0 !important;
}
</style>
