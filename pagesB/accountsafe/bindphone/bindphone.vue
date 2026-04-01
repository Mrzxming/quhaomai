<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-bindphone">
			<view class="page-header"></view>
			<view class="user-lr-form">
				<form @submit="formSubmit">
					<view class="phone-input-group">
						<view class="phone-prefix">+86</view>
						<input type="text" class="input" name="mobile" v-model="mobile" :placeholder="$t('lang.enter_mobile')" />
						<view class="get-code-btn" @click="handleSendSmsCode" v-if="button_type">{{$t('lang.get_code')}}</view>
						<view class="get-code-btn get-code-disabled" v-else>{{ button_text }}</view>
					</view>
					<view class="code-input-group">
						<input type="text" class="input" name="sms" v-model="sms" maxlength="6" :placeholder="$t('lang.get_sms_code')" />
					</view>
					<button class="submit-btn" formType="submit">{{$t('lang.bind_on')}}</button>
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
				// 新增的状态控制变量
				      captchaProcessing: false,
				      captchaEventsBound: false,
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
				disabled:true,
				delta:0,
				step:1
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
			isdelta(){
				return this.delta ? Number(this.delta) + 1 : 0
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
			         // 重置实例后直接触发校验
			         try {
			           this.h5Captcha.reset && this.h5Captcha.reset();
			         } catch (e) {
			           console.log('重置验证码失败:', e);
			         }
			         this.h5Captcha.verify && this.h5Captcha.verify();
			       } else {
			         // 首次初始化后再调用一次 verify
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
			           
			           // 添加重置方法（如果SDK未提供）
			           if (!captcha.reset) {
			             captcha.reset = function() {
			               this.appendTo("#captcha");
			               this.verify();
			             }.bind(captcha);
			           }
			           
			           captcha.onSuccess(() => {
						   console.log("h5de 成功")
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
					  platform:this.aliPlatform,
			          mobile: this.mobile,
			          // 添加阿里验证参数
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
					  console.log("APP验证码回调方法")
					   // 防止重复执行
					        if (this.captchaProcessing) return;
					        this.captchaProcessing = true;
					        
					        // 2秒后重置状态
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
				  
			
			
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			// sendVerifyCode() {
			// 	let that = this
			//     let o = {
			//         captcha: this.imgverifyValue,
			//         client: this.client,
			//         mobile: this.mobile
			//     }
				
			// 	that.$store.dispatch('setSendVerify', o).then(res => {
			// 	    if (res == 'success') {
			// 	        that.button_type = false
			// 	        let second = 60
			// 	        const timer = setInterval(() => {
			// 	            second--
			// 	            if (second) {
			// 	                that.button_text = that.send_again + '(' + second + 's)'
			// 	            } else {
			// 	                that.button_type = true
			// 	                clearInterval(timer);
			// 	            }
			// 	        }, 1000)
			// 	    }
			// 	})
			// },
			formSubmit(e){
				let that = this
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
					//绑定手机号
					if(this.step == 1){
						uni.request({
							url: this.websiteUrl + '/api/accountsafe/bind_mobile',
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
									uni.showToast({
										title:this.$t('lang.reset_phone_success'),
										icon:'none'
									});

									if(this.delta){
										uni.navigateBack({
											delta:1
										})
									}else{
										uni.switchTab({
											url: '/pages/user/user',
										});
									}
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
						//修改绑定新手机号
						uni.request({
							url: this.websiteUrl + '/api/accountsafe/change_mobile',
							method: 'POST',
							data: {
								mobile:this.mobile,
								client:this.client,
								code:this.sms,
								step: this.step
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let data = res.data
								if(data.status === 'success'){
									uni.showToast({
										title:that.$t('lang.edit_success'),
										icon:'none'
									})
									
									uni.switchTab({
										url: '/pages/user/user',
									});
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
							},
						})
					}
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(e){
			this.name = e.name
			this.delta = e.delta ? e.delta : 0
			this.step = e.step ? e.step : 1
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
}
</style>
