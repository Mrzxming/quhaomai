<template>
	<view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="$outerHref('/pagesB/login/forget/forget','app')">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view>
							<text>{{$t('lang.reset_password')}}</text>
							<view class="title">{{$t('lang.open_pwds1')}}</view>
						</view>
						<view class="value"></view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="paypwd">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>{{$t('lang.open_password')}}</text>
							<view class="title">{{$t('lang.open_pwds')}}</view>
						</view>
						<view class="value uni-red" v-if="accountsafe.users_paypwd == 1">{{$t('lang.open_xiu')}}</view>
						<view class="value uni-red" v-else>{{$t('lang.open_not')}}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="$outerHref('/pagesB/accountsafe/bindphone/bindphone','app')" v-if="accountsafe.mobile_phone==''">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>{{$t('lang.bind_phone')}}</text>
							<view class="title">{{$t('lang.open_pwds3')}}</view>
						</view>
					<view class="value"></view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="resetphone" v-else>
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>{{$t('lang.set_phone')}}</text>
							<view class="title">{{$t('lang.open_pwds3')}}</view>
						</view>
					<view class="value"></view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="bindEmail" v-if="!accountsafe.email || accountsafe.email == ''">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>绑定邮箱</text>
							<view class="title">绑定邮箱账号，用于账号安全</view>
						</view>
						<view class="value uni-red">未绑定</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="showEmailBoundTip" v-else>
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>绑定邮箱</text>
							<view class="title">绑定邮箱账号，用于账号安全</view>
						</view>
					<view class="value" style="color: #999999;">{{ accountsafe.email }}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="bindWechat" v-if="!accountsafe.wechat || accountsafe.wechat == ''">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>绑定微信</text>
							<view class="title">绑定微信账号，用于账号安全</view>
						</view>
						<view class="value uni-red">未绑定</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="showWechatBoundTip" v-else>
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>绑定微信</text>
							<view class="title">绑定微信账号，用于账号安全</view>
						</view>
					<view class="value" style="color: #999999;">{{ accountsafe.wechat }}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="$outerHref('../../pagesB/accountsafe/operationlog/operationlog',$isLogin())">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view>
							<text>{{$t('lang.operation_log')}}</text>
							<view class="title">{{$t('lang.open_pwds4')}}</view>
						</view>
					<view class="value"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import universal from '@/common/mixins/universal.js';
	export default {
		mixins:[universal],
			data() {
			return {
				accountsafe:{
					is_connect_user:'',
					is_validated:'',
					users_paypwd:'',
					mobile_phone:'',
					email:'',
					wechat:''
				}
			}
		},
		methods: {
			resetphone(){
				uni.navigateTo({
					url:'/pagesB/accountsafe/resetphone/resetphone?id='+this.accountsafe.mobile_phone
				})
			},
			paypwd(){
				uni.navigateTo({
					url:'paypwd/paypwd'
				})
			},
			bindEmail(){
				// 如果已绑定邮箱，不允许进入
				if(this.accountsafe.email && this.accountsafe.email != ''){
					uni.showToast({
						title: '邮箱已绑定成功',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url:'/pagesB/accountsafe/bindemail/bindemail'
				})
			},
			showEmailBoundTip(){
				// 显示解绑确认弹窗
				this.confirmUnbind('email', this.accountsafe.email);
			},
			bindWechat(){
				// 如果已绑定微信，不允许再次绑定
				if(this.accountsafe.wechat && this.accountsafe.wechat != ''){
					uni.showToast({
						title: '微信已绑定成功',
						icon: 'none'
					});
					return;
				}
				
				var that = this;
				// 显示加载提示
				uni.showLoading({
					title: '正在授权...',
					mask: true
				});
				
				// #ifdef APP-PLUS
				// APP端微信授权
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
								that.callBindWechatApi(infoRes.userInfo);
							},
							fail: (err) => {
								uni.hideLoading();
								uni.showToast({
									title: '获取微信授权失败，请重试',
									icon: 'none'
								});
							}
						});
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败，请重试',
							icon: 'none'
						});
					}
				});
				// #endif
				
				// #ifdef MP-WEIXIN
				// 小程序端微信授权
				uni.login({
					success: (loginRes) => {
						uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
								that.callBindWechatApi(infoRes.userInfo);
							},
							fail: (err) => {
								uni.hideLoading();
								// 小程序可能需要使用 getUserProfile
								if (uni.getUserProfile) {
									uni.getUserProfile({
										desc: '用于绑定微信账号',
										success: (profileRes) => {
											that.callBindWechatApi(profileRes.userInfo);
										},
										fail: (profileErr) => {
											uni.showToast({
												title: '获取微信授权失败，请重试',
												icon: 'none'
											});
										}
									});
								} else {
									uni.showToast({
										title: '获取微信授权失败，请重试',
										icon: 'none'
									});
								}
							}
						});
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败，请重试',
							icon: 'none'
						});
					}
				});
				// #endif
				
				// #ifdef H5
				// H5端微信授权（需要特殊处理）
				uni.showToast({
					title: 'H5端暂不支持微信绑定',
					icon: 'none'
				});
				uni.hideLoading();
				// #endif
			},
			callBindWechatApi(userInfo) {
				var that = this;
				
				const requestData = {
					userInfo: userInfo,
					type: 'weixin'
				};
				
				// 调用绑定微信接口
				uni.request({
					url: this.websiteUrl + '/api/accountsafe/bind_wechat',
					method: 'POST',
					data: requestData,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						let data = res.data;
						if (data.status === 'success') {
							uni.showToast({
								title: '绑定成功',
								icon: 'success'
							});
							
							// 绑定成功后，先刷新数据，再返回上一页
							that.refreshAccountSafeData().then(() => {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 500);
							}).catch(() => {
								// 即使刷新失败也返回上一页
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 500);
							});
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
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			},
			refreshAccountSafeData() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.websiteUrl + '/api/accountsafe',
						method: 'GET',
						data: {},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							const data = res.data || {};
							if (data.status === 'success') {
								this.accountsafe = data.data || {};
								resolve();
							} else {
								reject();
							}
						},
						fail: (err) => {
							reject();
						}
					});
				});
			},
			showWechatBoundTip(){
				// 显示解绑确认弹窗
				this.confirmUnbind('wechat', this.accountsafe.wechat);
			},
			// 确认解绑弹窗
			confirmUnbind(type, accountInfo) {
				const typeName = type === 'email' ? '邮箱' : '微信';
				const accountDisplay = type === 'email' ? accountInfo : (accountInfo || '微信账号');
				
				uni.showModal({
					title: '解绑确认',
					content: `当前已绑定${typeName}：${accountDisplay}\n\n确定要解绑吗？`,
					confirmText: '解绑',
					cancelText: '取消',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							// 用户确认解绑
							if (type === 'email') {
								this.unbindEmail();
							} else if (type === 'wechat') {
								this.unbindWechat();
							}
						}
					}
				});
			},
			// 解绑邮箱
			unbindEmail() {
				var that = this;
				uni.showLoading({
					title: '解绑中...',
					mask: true
				});
				
				uni.request({
					url: this.websiteUrl + '/api/accountsafe/del_bind_info',
					method: 'POST',
					data: {
						type: 'email'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						let data = res.data;
						if (data.status === 'success') {
							uni.showToast({
								title: '解绑成功',
								icon: 'success'
							});
							// 刷新数据
							that.refreshAccountSafeData();
						} else {
							if (data.errors) {
								uni.showToast({
									title: data.errors.message || '解绑失败',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '解绑失败',
									icon: 'none'
								});
							}
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			},
			// 解绑微信
			unbindWechat() {
				var that = this;
				uni.showLoading({
					title: '解绑中...',
					mask: true
				});
				
				uni.request({
					url: this.websiteUrl + '/api/accountsafe/del_bind_info',
					method: 'POST',
					data: {
						type: 'wechat'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						let data = res.data;
						if (data.status === 'success') {
							uni.showToast({
								title: '解绑成功',
								icon: 'success'
							});
							// 刷新数据
							that.refreshAccountSafeData();
						} else {
							if (data.errors) {
								uni.showToast({
									title: data.errors.message || '解绑失败',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '解绑失败',
									icon: 'none'
								});
							}
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			}
		},
		onShow(){
			uni.request({
				url:this.websiteUrl + '/api/accountsafe',
				method:'GET',
				data:{},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					const data = res.data || {};
					
					// 接口正常返回账号数据
					if (data.status === 'success') {
						this.accountsafe = data.data || {};
						return;
					}
					
					// 未登录：code = 12 或 message 提示未登录
					const errors = data.errors || {};
					const errorCode = errors.code;
					const errorMsg = errors.message || data.message || '';
					
					if (errorCode === 12 || errorMsg.indexOf('未登录') !== -1) {
						// 提示并跳转到登录页面
						uni.showModal({
							title: '提示',
							content: '您还未登录，请先登录后再查看账号安全信息。',
							confirmText: '去登录',
							cancelText: '取消',
							success: (modalRes) => {
								if (modalRes.confirm) {
									uni.navigateTo({
										url: '/pagesB/login/login?delta=1'
									});
								} else {
									// 取消时返回上一页，避免停留在空数据页面
									uni.navigateBack({
										delta: 1
									});
								}
							}
						});
					} else {
						// 其他错误保持原有提示逻辑
						uni.showToast({
							title: this.$t('lang.get_lod_url'),
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					uni.showToast({
						title: this.$t('lang.get_lod_url'),
						icon: 'none'
					});
				}
			})
		}
	}
</script>

<style scoped>
.title{ font-size: 25upx; }
</style>
