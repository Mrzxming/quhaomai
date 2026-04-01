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
				        aliConfig: {
				          captchaId: "",
				        },
				aliCaptchaResult: null,
				aliPlatform: '',
				mobile:'',
				// imgverifyValue:'', // 【已注释】旧的图形验证码，现在使用阿里验证码
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
			         // 重置实例内部状态后直接触发校验
			         try {
			           this.h5Captcha.reset && this.h5Captcha.reset();
			         } catch (e) {
			           console.log('重置验证码失败:', e);
			         }
			         this.h5Captcha.verify && this.h5Captcha.verify();
			       } else {
			         // 首次初始化后再触发一次 verify
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
			       script.src = "../../../static/ct4.js";
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
			          client: this.client,
			          mobile: this.mobile,
			          // 添加阿里验证参数
			          platform:this.aliPlatform,
			          ...this.aliCaptchaResult 
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
					// 【已注释】旧的图形验证码验证，现在使用阿里验证码
					// {name:"imgverifyValue", checkType : "notnull", checkRule:"",  errorMsg: this.$t('lang.captcha_img_not_null')},
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

			// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
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
