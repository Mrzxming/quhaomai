<template>
	<view class="container-bwg" style="background: #F8F8F8; overflow-x: hidden;">
		<view class="container-reset">
			<view class="reset-header"></view>
			<view class="user-lr-form">
				<form @submit="formSubmit">
					<view class="item-inputs">
						<view class="label">{{$t('lang.set_new_pwd')}}</view>
						<view class="item-input">
							<input :type="pwd" name="new_password" class="input" :placeholder="$t('lang.new_password_notic')" />
							<view class="icon" @click="handlePwdShow">
								<uni-icons :color="pwdColor" type="eye" size='18'></uni-icons>
							</view>
						</view>
					</view>
					<view class="btn-bar btn-bar-radius">
						<button class="btn btn-red submit-btn" formType="submit">{{$t('lang.confirm_update')}}</button>
					</view>
				</form>
				<view class="tips">{{$t('lang.reset_prompt_notic')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';

	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				pwd: 'password',
				pwdColor: '#bdbdbd',
				new_password:'',
				mobile:'',
				client:'',
				code:'',
			}
		},
		components: {
			uniIcons,
		},
		onLoad(e){
			this.mobile = e.mobile;
			this.client = e.client;
			this.code = e.code;
		},
		methods: {
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
				this.pwdColor = this.pwd == 'password' ? '#bdbdbd' : '#f92028';
			},
			formSubmit(e) {
				var rule = [
					{name: "new_password",checkType: "notnull",checkRule: "",errorMsg: this.$t('lang.password_notic')},
					{name: "new_password",checkType: "length6",checkRule: "",errorMsg: this.$t('lang.new_password_not_length6')},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					uni.request({
						url: this.websiteUrl + '/api/user/reset',
						method: 'POST',
						data: {
							password:e.detail.value.new_password,
							mobile:this.mobile,
							client:this.client,
							code:this.code
						},
						header: {
							'Content-Type': 'application/json',
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if(data.status === 'success'){
								uni.showToast({
									title:this.$t('lang.reset_pwd_success'),
									icon:'none'
								});
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
						}
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
/* 与登录/注册一致：头部背景、内容区背景、按钮 input 样式 */
.container-bwg {
	overflow-x: hidden;
	width: 100%;
	max-width: 100vw;
}

.container-reset {
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

.reset-header {
	padding: 60px 30px 24px;
}

.user-lr-form {
	flex: 1;
	background: #F8F8F8;
	border-radius: 24px 24px 0 0;
	padding: 32px 24px 20px;
	position: relative;

	.item-inputs {
		margin-bottom: 12px;
		background: transparent;
		.label {
			font-size: 14px;
			color: #666;
			margin-bottom: 8px;
			background: transparent;
		}
		.item-input {
			background: white;
			border-radius: 12px;
			padding: 16px;
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

			.icon {
				flex-shrink: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.btn-bar {
		margin-top: 16px;
		margin-bottom: 12px;
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
		box-shadow: 0 4px 12px rgba(210, 51, 40, 0.35);
	}
	.submit-btn:active {
		opacity: 0.9;
	}

	.tips {
		font-size: 12px;
		color: #999;
		line-height: 1.5;
	}
}
</style>
