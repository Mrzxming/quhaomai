<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-register">
		<view class="back-btn" @click="onClickBack">
			<!-- #ifdef APP-PLUS -->
			<text class="iconfont icon-back"></text>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<!-- #endif -->
		</view>
		<view class="register-header">
			<view class="page-title">注册</view>
		</view>
		<view class="register-form">
			<form @submit="formSubmit">
				<view class="phone-input-group">
					<view class="phone-prefix">+86</view>
					<input type="tel" class="input" v-model="mobile" name="mobile" autocomplete="off" placeholder="请输入手机号" maxlength="11" />
				</view>
				<view class="code-input-group">
					<input type="text" class="input" v-model="sms" name="sms" maxlength="6" autocomplete="off" placeholder="请输入验证码" />
					<view class="get-code-btn" @click="handleSendSmsCode" v-if="button_type">获取验证码</view>
					<view class="get-code-btn get-code-disabled" v-else>{{ button_text }}</view>
				</view>
				<view class="password-group">
					<input :type="pwd" class="input" v-model="password" name="password" autocomplete="off" placeholder="设置密码（6-20位）" maxlength="20" />
					<view class="eye-icon" @click="handlePwdShow">
						<!-- #ifdef APP-PLUS -->
						<text class="iconfont icon-liulan1"></text>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
							<circle cx="12" cy="12.5" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
						</svg>
						<!-- #endif -->
					</view>
				</view>
				<button class="register-btn" :class="{'btn-disabled':disabled}" :disabled="disabled" form-type="submit">注册</button>
				<view class="login-link">
					<navigator url="/pagesB/login/login" hover-class="none" class="login-link-text">已有账号？<text class="login-link-red">立即登录</text></navigator>
				</view>
				<view class="privacy-agreement">
					<view class="privacy-checkbox" :class="{'checked':checked}" @click="checked = !checked">
						<view class="checkbox-icon-wrapper">
							<view v-if="checked" class="checkbox-checked"></view>
						</view>
					</view>
					<view class="privacy-text" @click="checked = !checked">
						<text>我同意</text>
						<text class="privacy-link" @click.stop="privacyShow = true">《趣好卖服务条款》</text>
						<text>和</text>
						<text class="privacy-link" @click.stop="privacyShow = true">《隐私政策》</text>
					</view>
				</view>
			</form>
		</view>
		</view>

		<!-- 服务协议及隐私保护弹窗：与登录一致，点击同意后执行注册 -->
		<view class="agreement-popup-mask" v-if="showAgreementPopup" @click="onAgreementDisagree">
			<view class="agreement-popup" @click.stop>
				<view class="agreement-popup-title">服务协议及隐私保护</view>
				<view class="agreement-popup-content">为了更好地保障您的合法权益，请您阅读并同意以下协议《趣好卖服务条款》《隐私政策》</view>
				<view class="agreement-popup-btns">
					<button class="agreement-btn agreement-btn-cancel" @click="onAgreementDisagree">不同意</button>
					<button class="agreement-btn agreement-btn-confirm" @click="onAgreementAgree">同意</button>
				</view>
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
		<uni-popup :show="privacyShow" type="bottom" v-on:hidePopup="privacyShow = false">
			<view class="show-popup-bottom-common show-popup-privacy" style="height: 60vh;">
				<view class="title">
					<text class="strong">隐私政策</text>
					<text class="iconfont icon-close" @click="privacyShow = false"></text>
				</view>
				<view class="content">
					<view class="article-content">
						<jyf-parser :html="privacyActicleContent"></jyf-parser>
					</view>
					<view class="footer">
						<button type="warn" class="btn" :class="{'btn-disabled':privacyDisabled}" :disabled="privacyDisabled" @click="privacyShow = false; checked = true">{{privacy_button_text}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import captcha from "@/components/captcha4/index.vue";
	
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				// 阿里验证码相关数据
				        aliConfig: {
				          captchaId: "",
				        },
				        aliCaptchaResult: null,
				        aliPlatform: '',
				pwd: 'password',
				mobile:'',
				// imgverifyValue:'', // 【已注释】旧的图形验证码，现在使用阿里验证码
				sms:'',
				password:'',
				button_text: this.$t('lang.send_again_60'),
				send_again:this.$t('lang.send_again'),
				button_type:true,
				register_article_id:'',
				parent_id:uni.getStorageSync('user_id') ? uni.getStorageSync('user_id') : 0,
				disabled:true,
				// 隐私政策
				configData: '',
				checked:false,
				showAgreementPopup: false,
				pendingRegisterPayload: null,
				privacyShow:false,
				privacyActicleContent:'',
				privacyActicleTitle:'',
				privacyDisabled:true,
				privacy_button_text:'我已阅读(6s)',
				timer:null,
			};
		},
		components:{
			uniIcons,
			uniPopup,
			jyfParser,
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
		watch:{
			mobile(){
				this.disabled = !this.mobile
			},
			privacyShow(){
				let that = this
				let second = 6;
				
				if(that.privacyShow) that.privacyActicle();
				
				if(that.privacyShow && !that.checked){
					that.privacyDisabled = true
					that.timer = setInterval(()=>{
						second --
						if(second){
							that.privacy_button_text = '我已阅读' + '('+ second +'s)'
						}else{
							that.privacy_button_text = '我已阅读'
							that.privacyDisabled = false
							clearInterval(that.timer)
						}
					},1000)
				}else{
					that.privacy_button_text = that.checked ? '我已阅读' : '我已阅读(6s)'
					clearInterval(that.timer)
				}
			},
			loginMode(){
				// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
				if(!this.loginMode) this.$store.dispatch('setImgVerify');
			},
		},
		onLoad(){
			// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
			this.clickCaptcha();

			// 注册政策
			this.shopConfig();
			
			// 隐私声明
			this.privacyActicle();
		},
		methods:{
			
			// 检测平台并设置验证码ID
			      detectAliPlatform() {
			        // #ifdef H5
			        this.aliPlatform = 'H5';
			        this.aliConfig.captchaId = '187c68c10b353285aee04ea098810301';
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
			     
			     // 修改initH5AliCaptcha方法
			     initH5AliCaptcha() {
			       // #ifdef H5
			       // 清理旧的验证码实例
			       const oldCaptcha = document.getElementById('captcha');
			       if (oldCaptcha) {
			         oldCaptcha.innerHTML = ''; // 清空容器
			       }
			       
			       // 创建新的容器
			       const newContainer = document.createElement('div');
			       newContainer.id = 'captcha';
			       document.body.appendChild(newContainer);
			       
			       // 重新加载脚本
			       const script = document.createElement('script');
			       script.src = "../../static/ct4.js";
			       script.onload = () => {
			         initAlicom4({
			           captchaId: this.aliConfig.captchaId,
			           product: 'popup'
			         }, (captcha) => {
			           this.h5Captcha = captcha; // 保存实例引用
			           captcha.appendTo("#captcha");

			           // 隐藏 SDK 默认触发按钮，避免在页面上直接展示或误触
			           const btn = document.querySelector('#captcha .captcha4_btn_click');
			           if (btn) {
			             btn.style.display = 'none';
			             btn.style.pointerEvents = 'none';
			           }
			           
			           // 添加重置方法（如果SDK未提供）
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
			      // 验证短信输入
			      validateSmsInput() {
			        if (!this.mobile) {
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
			      // 验证成功后发送短信
			      sendSmsAfterCaptcha() {
			        if (!this.aliCaptchaResult) {
			          uni.showToast({ title: '验证未通过', icon: 'none' });
			          return;
			        }
			        
			        const o = {
						client:this.client,
						mobile:this.mobile,
						code:this.sms,
						pwd:this.password,
						act :'sms_signin',
						parent_id:this.parent_id,
						allow_login:0,
			          // captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
			          // client: this.client,
			          mobile: this.mobile,
			          // 添加阿里验证参数
			          platform:this.aliPlatform,
			          ...this.aliCaptchaResult 
			        }
			
			         this.$store.dispatch('setMagicSendsms', o).then(res => {
        if (res == 'success') {
          // 短信发送成功处理
          this.button_type = false;
          
          // 直接从60开始倒计时
          let second = 60;
          this.button_text = this.send_again + `(${second}s)`;
          
          const timer = setInterval(() => {
            second--;
            if (second >= 0) {
              this.button_text = this.send_again + `(${second}s)`;
            } else {
              this.button_type = true;
              this.button_text = this.$t('lang.get_code');
              clearInterval(timer);
            }
          }, 1000);
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
				  
			
			
			// end
			
			
			
			
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
			},
			sendVerifyCode() {
			    let o = {
			        // captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
			        client: this.client,
			        mobile: this.mobile,
					act:'register'
			    }

			    this.$store.dispatch('setSendVerify', o).then(res => {
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
			shopConfig(){
				uni.request({
					url:`${this.websiteUrl}/api/shop/config`,
					method:'GET',
					data:{
						app_version: incrementVersion()
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						this.configData = data;
						
						this.register_article_id = data.register_article_id;
					}
				});
			},
			formSubmit(e){
				var rule = [
					// 【已注释】旧的图形验证码验证，现在使用阿里验证码
					// {name:"imgverifyValue", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.captcha_img_not_null')},
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.mobile_not_null')},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.get_sms_code_notic')},
					{name:"password", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.password_notic')},
					{name:"password", checkType : "length6", checkRule:"",  errorMsg:this.$t('lang.new_password_not_length6')},
				];

				//进行表单检查
				var formData = e.detail.value || { mobile: this.mobile, sms: this.sms, password: this.password };
				var checkRes = graceChecker.check(formData, rule);

				if (!checkRes) {
					uni.showToast({ title: graceChecker.error, icon: "none" });
					return;
				}

				if (!this.checked) {
					this.pendingRegisterPayload = {
						mobile: formData.mobile || this.mobile,
						sms: formData.sms || this.sms,
						password: formData.password || this.password
					};
					this.showAgreementPopup = true;
					return;
				}

				this.doRegister({
					mobile: formData.mobile || this.mobile,
					sms: formData.sms || this.sms,
					password: formData.password || this.password
				});
			},
			onAgreementDisagree() {
				this.showAgreementPopup = false;
				this.pendingRegisterPayload = null;
			},
			onAgreementAgree() {
				this.showAgreementPopup = false;
				this.checked = true;
				if (!this.pendingRegisterPayload) return;
				this.doRegister(this.pendingRegisterPayload);
				this.pendingRegisterPayload = null;
			},
			doRegister({ mobile, sms, password }) {
				this.$store.dispatch('userRegister', {
					client: this.client,
					mobile,
					code: sms,
					pwd: password,
					parent_id: this.parent_id,
					allow_login: 0
				}).then(res => {
					if (res.status == 'success') {
						uni.showToast({
							title: this.$t('lang.register_success'),
							success: () => {
								this.token = res.data;
								uni.setStorage({
									key: 'token',
									data: res.data,
									success: () => {
										uni.switchTab({ url: '/pages/user/user' });
									}
								});
							}
						});
					} else {
						uni.showToast({
							title: res.errors.message,
							icon: 'none'
						});
					}
				});
			},
			async privacyActicle(){
				if(this.configData){
					uni.request({
						url:`${this.websiteUrl}/api/article/show`,
						method:'POST',
						data:{
							id:this.register_article_id || this.configData.register_article_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: ({ data }) => {
							if(data.status == 'success'){
								this.privacyActicleContent = data.data.content;
								this.privacyActicleTitle = data.data.title;	
							}else{
								uni.showToast({ title: '未设置隐私政策', icon:"none" });
							}
						}
					});
				}
			},
			onClickBack(){
				uni.navigateBack({ delta:1 });
			}
		},
	}
</script>

<style lang="scss" scoped>
/* 与登录页完全一致：外层 + 容器渐变 + 内容区 #F8F8F8 */
.container-bwg {
	overflow-x: hidden;
	width: 100%;
	max-width: 100vw;
}

.container-register {
	/* 与 login 一致 */
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

.register-header {
	/* 与 login-header 一致 */
	padding: 60px 30px 24px;
	text-align: center;

	.page-title {
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
	}
}

.register-form {
	/* 与 login-form 一致 */
	flex: 1;
	background: #F8F8F8;
	border-radius: 24px 24px 0 0;
	padding: 32px 24px 20px;
	position: relative;
}

/* 与登录 input-group/code-input-group 一致：padding、margin 统一 */
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
		&::placeholder { color: #BFBFBF; }
	}

	.eye-icon {
		cursor: pointer;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #555;
		font-size: 22px;
	}
	.eye-icon svg {
		display: block;
		width: 24px;
		height: 24px;
	}
}

/* 与登录 login-btn 完全一致：56px 高度 */
.register-btn {
	width: 100%;
	height: 56px !important;
	min-height: 56px !important;
	max-height: 56px !important;
	padding: 0 !important;
	line-height: 56px !important;
	background: #D23328;
	color: #ffffff;
	border: none;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(210, 51, 40, 0.35);
	&:active { opacity: 0.9; }
	&.btn-disabled {
		opacity: 0.4;
	}
}

.login-link {
	text-align: center;
	margin-bottom: 20px;

	.login-link-text {
		color: #666;
		font-size: 14px;
		text-decoration: none;
	}
	.login-link-red {
		color: #D23328;
	}
}

/* 与登录一致：纵向居中对齐，选中样式红色勾 */
.privacy-agreement {
	display: flex;
	align-items: center;
	font-size: 12px;
	line-height: 1.6;
	margin-bottom: 20px;
	color: #999;

	.privacy-checkbox {
		margin-right: 6px;
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		border: 1px solid #999;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;

		&.checked {
			background: #D23328;
			border-color: #D23328;

			.checkbox-icon-wrapper .checkbox-checked {
				width: 6px;
				height: 10px;
				border-right: 2px solid #fff;
				border-bottom: 2px solid #fff;
				transform: rotate(45deg);
				box-sizing: border-box;
				position: relative;
				top: -3px;
				left: 0;
			}
		}
		.checkbox-icon-wrapper {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.privacy-text {
		flex: 1;
		color: #999;
		.privacy-link {
			color: #4b89dc;
			text-decoration: none;
		}
	}
}

/* 服务协议及隐私保护弹窗（与登录一致） */
.agreement-popup-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	box-sizing: border-box;
}
.agreement-popup {
	width: 100%;
	max-width: 320px;
	background: #fff;
	border-radius: 12px;
	padding: 24px 20px 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.agreement-popup-title {
	font-size: 18px;
	font-weight: bold;
	color: #1a1a1a;
	text-align: center;
	margin-bottom: 16px;
}
.agreement-popup-content {
	font-size: 14px;
	color: #666;
	line-height: 1.5;
	margin-bottom: 24px;
}
.agreement-popup-btns {
	display: flex;
	justify-content: center;
	gap: 16px;
}
.agreement-btn {
	flex: 1;
	height: 44px;
	line-height: 44px;
	padding: 0;
	font-size: 16px;
	border-radius: 8px;
	border: none;
}
.agreement-btn-cancel {
	background: #fff;
	color: #666;
	border: 1px solid #ddd;
}
.agreement-btn-confirm {
	background: #D23328;
	color: #fff;
}

/* 隐私政策 */
.show-popup-privacy{
	.title{
		position: relative;
		justify-content: center;
		
		.iconfont{
			position: absolute;
			right: 30rpx;
		}
	}
	.article-content{
		height: calc(100% - 50px);
		padding: 0 20rpx;
		overflow-y: auto;
	}
	
	.footer{
		.btn{
			height: 40px;
			padding: 0;
			border-radius: 20px;
			line-height: 40px;
			background: linear-gradient(-88deg, #ff4f2e, #f91f28);
			font-size: 28rpx;
			
			&.btn-disabled{
				cursor: not-allowed;
				opacity: 0.4;
			}
		}
	}
}
</style>
