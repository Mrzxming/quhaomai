<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-forget">
			<view class="back-btn" @click="onClickBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="forget-header">
				<view class="page-title">{{type == 0 ? '请输入您要找回的账号' : type == 1 ? '获取验证码' : '设置新密码'}}</view>
			</view>
		<view class="login-form">
			<block v-if="type == 0">
				<view class="phone-input-group">
					<view class="phone-prefix">+86</view>
					<input type="text" class="input" v-model="username" name="username" autocomplete="off" :placeholder="$t('lang.enter_username')" />
					<view class="input-suffix" v-show="username" @click="username = ''"><text class="iconfont icon-guanbi"></text></view>
				</view>
				<!-- <view class="input-box">
					<view class="input-box__left">
						<icon class="iconfont icon-tupian"></icon>
						<input type="text" name="imgverifyValue" v-model="imgverifyValue" :placeholder="$t('lang.captcha_img')" />
					</view>
					<view class="input-box__right">
						<view class="code-box" @click="clickCaptcha"><image :src="captcha" class="img"></image></view>
					</view>
				</view> -->
				<view class="signup-button">
					<button class="btn btn-lg-red" :class="{'btn-disabled':disabled}" :disabled="disabled" @click="submitStep(type)">获取验证码</button>
				</view>
			</block>
			<block v-else-if="type == 1">
				<view class="forgetpwd-warp">
					<view class="send-yzm">
						<view class="text" :class="{'text-email':curType == 'email'}">{{ curType == 'mobile_phone' ? userinfo.mobile_phone_sign : userinfo.email_sign}}</view>
						<view class="send" @click="handleSendSmsCode" v-if="button_type">{{$t('lang.get_code')}}</view>
						<view class="send" v-else>{{ button_text }}</view>
					</view>
					
					<view class="item" @tap='KeyboarOpen'>
						<password-input :numLng='sms' :plaintext="false"></password-input>
					</view>
					<view class="tip">请输入6位数字验证码</view>
						
					<number-keyboard tabBar ref='KeyboarHid' @input='KeyboarVal' psdLength='6'></number-keyboard>
				</view>
				<view class="signup-button">
					<button class="btn btn-lg-red" :class="{'btn-disabled':disabled}" :disabled="disabled" @click="submitStep(type)">下一步</button>
					<view class="tips">
						<view class="go-register" v-if="curType == 'mobile_phone' && userinfo.is_email == 1" @click="tabClick('email')">邮箱验证</view>
						<view class="go-register" v-if="curType == 'email' && userinfo.is_mobile_phone == 1" @click="tabClick('mobile_phone')">手机验证</view>
					</view>
				</view>
			</block>
			<block v-else-if="type == 2">
				<view class="password-group">
					<input :type="pwd" class="input" v-model="password" name="password" autocomplete="off" :placeholder="$t('lang.enter_password')" />
					<view class="eye-icon" @click="handlePwdShow">
						<text class="iconfont icon-liulan1" :class="{'active':pwd == 'text'}"></text>
					</view>
				</view>
				<view class="signup-button">
					<button class="btn btn-lg-red" :class="{'btn-disabled':disabled}" :disabled="disabled" @click="submitBtn">设置新密码</button>
				</view>
				<view class="tip">为保障您账户安全，请您不要设置与邮箱密码相同的账户登录密码，谨防诈骗</view>
			</block>
			
			
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
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import numberKeyboard from '@/components/number-keyboard/number-keyboard.vue'
	import passwordInput from '@/components/password-input/password-input.vue'
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
				disabled:true,
				pwd:'password',
				username:'',
				imgverifyValue:'',
				sms:'',
				password:'',
				button_text:this.$t('lang.send_again_60'),
				send_again:this.$t('lang.send_again'),
				configData: uni.getStorageSync('configData'),
				button_type:true,
				type:0,
				userinfo:'',
				curType:''
			};
		},
		components:{
			numberKeyboard,
			passwordInput,
			captcha
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
		computed:{
			...mapState({
				// captcha: state => state.common.imgVerify.captcha, // 【已注释】旧的图形验证码，现在使用阿里验证码
				client: state => state.common.imgVerify.client,
			}),
			isTypeValue(){
				var obj = ''
				if(this.userinfo.is_mobile_phone == 1 && this.userinfo.is_email == 1){
					obj = 'mobile_phone'
				}else{
					if(this.userinfo.is_mobile_phone == 1 || this.userinfo.is_email == 1){
						if(this.userinfo.is_mobile_phone == 1){
							obj = 'mobile_phone'
						}
						if(this.userinfo.is_email == 1){
							obj = 'email'
						}
					}else{
						obj = ''
					}
				}
				return obj
			}
		},
		onLoad(){
			// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
			this.clickCaptcha();
		},
		watch:{
			username(){
				this.disabled = this.username ? false : true;
			},
			isTypeValue(){
				this.curType = this.isTypeValue
			},
			password(){
				this.disabled = this.password ? false : true; 
			},
			type(){
				this.sms = ''
			}
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
			        
			        console.log('阿里验证码平台:', this.aliPlatform, 'captchaId:', this.aliConfig.captchaId);
			      },
			      
			   
			      
			      // 处理发送短信验证码
			    
			     handleSendSmsCode() {
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
			     
			     // H5 阿里验证码按需初始化 —— 统一走 utils/aliCaptcha.js
			     initH5AliCaptcha() {
			       // #ifdef H5
			       initAliCaptchaH5({
			         captchaId: this.aliConfig.captchaId,
			         scriptSrc: '/static/ct4.js',
			         onSuccess: (result) => {
			           this.aliCaptchaResult = result
			           // 根据当前步骤决定调用哪个方法
			           if (this.type == 0) {
			             this.submitForgetAfterCaptcha()
			           } else if (this.type == 1) {
			             this.sendSmsAfterCaptcha()
			           }
			         }
			       }).then((captcha) => {
			         this.h5Captcha = captcha
			       }).catch((e) => {
			         console.warn('[forgetPwd] H5 aliCaptcha init failed:', e)
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
			        const o = {
			              // captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
			              mobile: this.userinfo.mobile_phone,
			              send_from: 'reset_password',
						  // platform: H5 IOS Android
						  act :'sms_find_signin',
						  platform:this.aliPlatform,
			              ...this.aliCaptchaResult  // 直接展开阿里验证结果的所有字段
					}

			        this.$store.dispatch('setMagicSendsms', o).then(res => {
			          if (res == 'success') {
			            // 短信发送成功处理
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
			      
			      // 【新增】阿里验证码验证成功后提交忘记密码第一步
			      submitForgetAfterCaptcha() {
					// #ifndef MP-WEIXIN
						if (!this.aliCaptchaResult) {
						  uni.showToast({ title: '验证未通过', icon: 'none' });
						  return;
						}
			        // #endif
			        
			        uni.request({
						url: this.websiteUrl + '/api/user/forget',
						method: 'POST',
						data: {
							user_name: this.username,
							// captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
							client: this.client,
							// 添加阿里验证参数
							platform: this.aliPlatform,
							...this.aliCaptchaResult  // 直接展开阿里验证结果的所有字段
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if(data.status == 'success'){
								this.userinfo = data.data;
								this.type = 1;
								this.disabled = true;
							}else{
								uni.showToast({ title: data.errors.message, icon: "none" });
							}
						},
						fail: (res) => {
							console.log(JSON.stringify(res))
						}
					})
			      },
			      
			      // 验证短信输入
			      validateSmsInput() {
			        if (!this.curType == 'mobile_phone') {
			          uni.showToast({ title: '请输入手机号', icon: 'none' });
			          return false;
			        }
			        
			        // 【已注释】旧的图形验证码检查，现在使用阿里验证码
			        // if (!this.imgverifyValue) {
			        //   uni.showToast({ title: '请输入图形验证码', icon: 'none' });
			        //   return false;
			        // }
			        
			        return true;
			      },
			      
			      // APP验证码回调方法
			      captchaSuccess(result) {
			        this.aliCaptchaResult = result;
			        // 根据当前步骤决定调用哪个方法
			        if (this.type == 0) {
			          // 第一步：提交忘记密码请求
			          this.submitForgetAfterCaptcha();
			        } else if (this.type == 1) {
			          // 第二步：发送短信验证码
			          this.sendSmsAfterCaptcha();
			        }
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
				  
			
			
			// end
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
			},
			sendVerifyCode() {
				let that = this
				if(that.curType == 'mobile_phone'){
					let o = {
						mobile:that.userinfo.mobile_phone,
						send_from:'reset_password'
					}
				
					that.$store.dispatch('setSendVerify', o).then(res => {
						if (res == 'success') {
							that.button_type = false
							let second = 60
							const timer = setInterval(() => {
								second--
								if (second) {
									that.button_text = that.send_again + '(' + second + 's)'
								} else {
									that.button_type = true
									clearInterval(timer);
								}
							}, 1000)
						}
					})
				}else if(that.curType == 'email'){
					uni.request({
						url: this.websiteUrl + '/api/user/reset_email',
						method: 'POST',
						data: {
							email:that.userinfo.email
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res == 'success') {
								that.button_type = false
								let second = 60
								const timer = setInterval(() => {
									second--
									if (second) {
										that.button_text = that.send_again + '(' + second + 's)'
									} else {
										that.button_type = true
										clearInterval(timer);
									}
								}, 1000)
							}else{
								
							}
						},
						fail: (res) => {
							console.log(JSON.stringify(res))
						}
					})
				}
				
				this.$refs.KeyboarHid.open();
			},
			submitBtn(){
				if(!(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(this.password))){
					uni.showToast({ title: '请输入8-16位含大小写字母、数字组合', icon: "none" });
					return
				}
				
				uni.request({
					url: this.websiteUrl + '/api/user/reset_password',
					method: 'POST',
					data: {
						user_name:this.userinfo.user_name,
						new_password:this.password
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data
						if(data.status == 'success'){
							uni.showToast({ title: '密码修改成功', icon: "none" });
							
							uni.redirectTo({
								url:'../login'
							})
						}else{
							uni.showToast({ title: data.errors.message, icon: "none" });
						}
					},
					fail: (res) => {
						console.log(JSON.stringify(res))
					}
				})
			},
			submitStep(type){
				if(type == 0){
					if(this.username == ''){
						uni.showToast({ title: '用户名不能为空', icon: "none" });
						return false
					}
					
					// 【新增】使用阿里验证码验证
					// #ifdef MP-WEIXIN
					this.submitForgetAfterCaptcha();
					// #endif
					
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
				}else if(this.type == 1){
					if(this.sms == ''){
						uni.showToast({ title: '请填写验证码', icon: "none" });
						return false
					}
					
					if(this.curType == 'mobile_phone'){
						uni.request({
							url: this.websiteUrl + '/api/user/verification_sms',
							method: 'POST',
							data: {
								mobile_phone:this.userinfo.mobile_phone,
								code:this.sms
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let data = res.data
								if(data.status == 'success'){
									this.type = 2;
								}else{
									uni.showToast({ title: data.errors.message, icon: "none" });
								}
							},
							fail: (res) => {
								console.log(JSON.stringify(res))
							}
						})
					}else if(this.curType == 'email'){
						uni.request({
							url: this.websiteUrl + '/api/user/verification_email',
							method: 'POST',
							data: {
								email:this.userinfo.email,
								code:this.sms
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let data = res.data
								if(data.status == 'success'){
									this.type = 2;
								}else{
									uni.showToast({ title: data.errors.message, icon: "none" });
								}
							},
							fail: (res) => {
								console.log(JSON.stringify(res))
							}
						})
					}
				}
			},
			tabClick(val){
				this.curType = val
			},
			//打开键盘
			KeyboarOpen(e) {
				this.$refs.KeyboarHid.open();
			},
			//输入的值
			KeyboarVal(val) {
				this.sms = val;
				
				this.disabled = false;
			},
			onClickBack(){
				if(this.type > 0){
					this.type --

					if(this.type == 0){
						// 【已注释】旧的图形验证码重置，现在使用阿里验证码
						// this.$store.dispatch('setImgVerify');
						this.userinfo = '';
						this.username = '';
						// this.imgverifyValue = '';
					}
				}else{
					uni.navigateBack({ delta:1 });
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
/* 与登录/注册一致：顶部背景、内容区圆角、输入框与按钮样式 */
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

.back-btn {
	position: absolute;
	top: 50px;
	left: 20px;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	color: #333;
	font-size: 24px;
}

/* 与登录/注册一致：标题在渐变区内，内容区紧接下方 */
.forget-header {
	padding: 60px 30px 24px;
	text-align: center;

	.page-title {
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
	}
}

.login-form {
	flex: 1;
	background: #F8F8F8;
	border-radius: 24px 24px 0 0;
	padding: 32px 24px 20px;
	position: relative;

	/* 与注册页 phone-input-group 完全一致 */
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

			.iconfont {
				font-size: 20px;
				color: #666;
			}
		}

		.input {
			flex: 1;
			border: none;
			outline: none;
			font-size: 15px;
			color: #333;
			background: transparent;

			&::placeholder {
				color: #BFBFBF;
			}
		}

		.input-suffix {
			flex-shrink: 0;
			.iconfont {
				font-size: 14px;
				color: #999;
			}
		}
	}

	/* 与注册页 password-group 完全一致 */
	.password-group {
		background: white;
		border-radius: 12px;
		padding: 16px;
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

			&::placeholder {
				color: #BFBFBF;
			}
		}

		.eye-icon {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #999;
			font-size: 22px;

			&.active,
			.active {
				color: #D23328;
			}
		}
	}

	.signup-button {
		margin-top: 16px;
		margin-bottom: 12px;

		.btn {
			width: 100%;
			height: 56px !important;
			min-height: 56px !important;
			max-height: 56px !important;
			padding: 0 !important;
			line-height: 56px !important;
			border: none;
			border-radius: 12px;
			font-size: 16px;
			font-weight: 500;
			color: #fff;
			margin-bottom: 12px;

			&.btn-lg-red {
				background: #D23328;
				box-shadow: 0 4px 12px rgba(210, 51, 40, 0.35);
			}

			&.btn-bor-red {
				border: 1px solid #D23328;
				color: #D23328;
				background: transparent;
				font-weight: 600;
			}

			&.btn-disabled {
				cursor: not-allowed;
				opacity: 0.4;
			}
		}

		.tips {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			color: #333;

			.go-register {
				margin-left: 5px;
				color: #D23328;
			}
		}
	}

	.tip {
		margin-top: 12px;
		color: #999;
		font-size: 12px;
		line-height: 1.5;
		text-align: left;
	}
}

.send-yzm {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;

	.text {
		font-size: 24px;
		color: #1a1a1a;

		&.text-email {
			font-size: 16px;
		}
	}

	.send {
		height: 35px;
		line-height: 35px;
		padding: 0 20px;
		border: 1px solid #dcdcdc;
		border-radius: 18px;
		font-size: 12px;
		color: #D23328;
		margin-left: 10px;
	}
}
</style>
