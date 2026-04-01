<template>
	<view class="account">
		<!-- <view class="purse-header-box">
			<view class="text">{{$t('lang.usable_balance')}}</view>
			<view class="value">
				<view class="money" v-if="account.user_money" @click="toZhangFang">{{ account.user_money }}</view>
				<view class="frozen-money" v-if="account.frozen_money">{{$t('lang.frozen_balance')}}：{{ account.frozen_money }}</view>
			</view>
			<view class="user-money-list">
				<navigator url="../bonus/bonus" class="money-item text-left" hover-class="none">{{$t('lang.bonus')}}<text class="user-money-list-item" v-text="account.bonus_count || 0"></text></navigator>
				<navigator url="../valueCard/valueCard" class="money-item text-center" hover-class="none">{{$t('lang.value_card')}}<text class="user-money-list-item" v-text="value_card.num || 0"></text></navigator>
				<view class="money-item text-right">{{$t('lang.integral')}}<text class="user-money-list-item" v-text="account.pay_points || 0"></text></view>
			</view>
		</view>
		 -->
		<div class="accountzero bora24  " style="background: linear-gradient( 303deg, #FE2F02 0%, #FC4C26 100%);
		box-shadow: inset 2rpx 2rpx 2rpx 0rpx #FFFFFF;">
			<view class="coff fs32 flex-between " v-if="Number(account.credit_line) > 0" style="padding: 24rpx 22rpx 30rpx;" @click="toZhangFang">
				<view class="flex-start  ">
					<!-- <image src="/pagesC/static/my/totik.png" mode="widthFix" style="width: 40rpx;margin-right: 12rpx;"></image> -->
					<view class="fs500 fs32 ">先用后付</view>
					<view class="salebtn pl10 flex-center">
						<image src="/pagesC/static/my/coin.png" mode="widthFix" style="width: 28rpx;margin-right: 12rpx;">
						</image>
						<span class="coff fs24 pr8">额度</span>
						<span class="fs20 pr05">¥</span>
						<span> {{account.credit_line}}</span>
					</view>
				</view>
				<uni-icons type="arrowright" size="13" color="#fff"></uni-icons>
			</view>
			<view class="proall"  v-if="Number(account.credit_line) > 0">
				<view class="progress-container">
					<view class="progress-bar"
						:style="{ width: `${account.has_use_credit_line / account.credit_line * 100}%` }"></view>
				</view>
				<view class="coff ml20 textr" style="max-width: 20%;">
					<span class="fs24">{{ account.has_use_credit_line }}</span>
					<span class="fs20 pt10">/{{ account.credit_line }}</span>
				</view>
			</view>


			<view class="purse-header-box">
				<view class="value">
					<view class="">
						<view class="co62 fs24">{{$t('lang.usable_balance')}}</view>
						<view class="money" v-if="account.user_money" @click="toZhangFang">{{ account.user_money }}
						</view>
					</view>
					<view class="frozen-money" v-if="account.user_balance_withdrawal == 1" @click="toDeposit">
						{{$t('lang.deposit')}}
					</view>
				</view>
				<view class="user-money-list bgf5 bora14 " style="padding: 24rpx 32rpx 24rpx 0;">
					<navigator url="../bonus/bonus" class="money-item text-center" hover-class="none">
						<div>
							{{$t('lang.bonus')}}
						</div>
						<text class="user-money-list-item" v-text="account.bonus_count || 0"></text>
					</navigator>
					<navigator url="../valueCard/valueCard" class="money-item text-center" hover-class="none">
						<div>
							{{$t('lang.value_card')}}
						</div>
						<text class="user-money-list-item" v-text="value_card.num || 0"></text>
					</navigator>
					<view class="money-item text-center">
						<div>
							{{$t('lang.integral')}}
						</div>
						<text class="user-money-list-item" v-text="account.pay_points || 0"></text>
					</view>
					<view class="money-item text-center" v-if="account.frozen_money">
						<div>
							{{$t('lang.frozen_balance')}}
						</div>
						<text class="user-money-list-item" v-text="account.frozen_money || 0"></text>
					</view>
				</view>
			</view>
		</div>

		<!-- <view class="user-pur-box" v-if="account.user_balance_recharge > 0 || account.user_balance_withdrawal > 0">
			<view class="item" @click="clickPay" v-if="account.user_balance_recharge == 1">
				<image
					src="https://images.eqingqu.com/attachs/photo/202404/20240416_F4576332F26F1797E1B15ADD2078C17F.png">
				</image>{{$t('lang.recharge')}}
			</view>
			<navigator url="raply/raply" hover-class="none" class="item" v-if="account.user_balance_withdrawal == 1">
				<image
					src="https://images.eqingqu.com/attachs/photo/202404/20240416_9AE027C0BDEC4E8D83AEFF5CEE2CFC7E.png">
				</image>
				{{$t('lang.deposit')}}
			</navigator>
		</view> -->
		<view class="my-nav-box">
			<navigator url="detail/detail" hover-class="none" class="item co27 line016">
				<view class="tit ">
					<!-- <text class="iconfont icon-detail"></text> -->
					{{$t('lang.account_detail')}}
				</view>
				<uni-icons type="arrowright" size="18" color="#828282"></uni-icons>
			</navigator>
			<navigator :url="'integra/integra?type='+account.pay_points+'&expir=' + account.pay_points_expiring "
				hover-class="none" class="item line016">
				<view class="tit">
					<!-- <text class="iconfont icon-jinqian"></text> -->
					我的积分
				</view>
				<uni-icons type="arrowright" size="18" color="#828282"></uni-icons>
			</navigator>
			<navigator url="log/log" hover-class="none" class="item  ">
				<view class="tit">
					<!-- <text class="iconfont icon-partner"></text> -->
					{{$t('lang.application_record')}}
				</view>
				<uni-icons type="arrowright" size="18" color="#828282"></uni-icons>
			</navigator>
			<navigator url="../invoice/invoice" hover-class="none" class="item ">
				<view class="tit">
					<!-- <text class="iconfont icon-invoices-query"></text> -->
					{{$t('lang.vat_invoice')}}
				</view>
				<uni-icons type="arrowright" size="18" color="#828282"></uni-icons>
			</navigator>
		</view>

		<dsc-common-nav></dsc-common-nav>

		<!-- 协议弹窗 -->
		<view class="agreement-modal-wrapper" v-if="showAgreementModal" @click.stop>
			<view class="agreement-modal-backdrop" @click="handleAgreementCancel"></view>
			<view class="agreement-modal-content" @click.stop>
				<view class="agreement-modal-header">
					<text class="agreement-modal-title">尊敬的用户：</text>
				</view>
				<view class="agreement-modal-body">
					<scroll-view scroll-y class="agreement-scroll-view">
						<view v-if="agreementLoading" class="agreement-loading">加载中...</view>
						<view v-else-if="agreementContent" class="agreement-html-content">
							<jyf-parser :html="agreementContent" :tag-style="{video: 'width: 100%;'}"></jyf-parser>
						</view>
						<view v-else class="agreement-loading">协议内容加载失败</view>
					</scroll-view>
				</view>
				<view class="agreement-modal-checkbox-wrapper">
					<view class="agreement-checkbox-label">
						<view class="agreement-checkbox-container" @click="toggleAgreementCheckbox">
							<view v-if="!agreementChecked" class="agreement-tip-banner">
								<text class="agreement-tip-text">请勾选协议</text>
								<view class="agreement-tip-arrow"></view>
							</view>
							<view class="agreement-checkbox-circle" :class="{ 'agreement-checkbox-checked': agreementChecked }">
								<text v-if="agreementChecked" class="agreement-checkmark">✓</text>
							</view>
						</view>
						<text class="agreement-checkbox-text">
							我已仔细阅读并接受
							<text class="agreement-link" @click.stop="openAgreementWebview">{{ account.agree_creditPay_tip || '《授信协议》' }}</text>
						</text>
					</view>
				</view>
				<view class="agreement-modal-footer">
					<view class="agreement-btn agreement-btn-cancel" @click="handleAgreementCancel">取消</view>
					<view class="agreement-btn agreement-btn-confirm" :class="{ 'agreement-btn-disabled': !agreementChecked }" @click="handleAgreementConfirm">同意</view>
				</view>
			</view>
		</view>

		<!-- 实名确认弹窗 -->
		<view class="realname-modal-wrapper" v-if="showRealnameModal" @click.stop>
			<view class="realname-modal-backdrop" @click="handleRealnameCancel"></view>
			<view class="realname-modal-content" @click.stop>
				<view class="realname-modal-body">
					<text class="realname-modal-text">{{ account.realnametip || '使用先用后付前请先进行实名认证操作' }}</text>
				</view>
				<view class="realname-modal-footer">
					<view class="realname-btn realname-btn-cancel" @click="handleRealnameCancel">取消</view>
					<view class="realname-btn realname-btn-confirm" @click="handleRealnameConfirm">去实名</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
			uniIcons,
			dscCommonNav,
			jyfParser
		},
		data() {
			return {
				account: Object,
				value_card: Object,
				showAgreementModal: false, // 协议弹窗显示状态
				showRealnameModal: false, // 实名确认弹窗显示状态
				agreementChecked: false, // 协议复选框状态
				agreementContent: '', // 协议内容
				agreementLoading: false, // 协议内容加载中
				realnameTarget: '', // 实名后的目标页面：'account' 或 'deposit'
			};
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/account/account'
			}
		},
		methods: {

			//daqin 跳转到账房
			toZhangFang() {
				// 先检查是否已同意协议
				if (this.account && this.account.is_agree_creditPay === 0) {
					// 未同意协议，显示协议弹窗
					this.showAgreementModal = true;
					this.agreementChecked = false;
					// 自动加载协议内容
					this.loadAgreementContent();
					return;
				}
				
				// 已同意协议，检查是否已实名
				if (this.account && this.account.realnametip && this.account.realnametip.length > 0) {
					// 未实名，显示实名确认弹窗
					this.realnameTarget = 'account';
					this.showRealnameModal = true;
					return;
				}
				
				// 已同意协议且已实名，执行原来的跳转逻辑
				this.navigateToAccountWebview();
			},
			
			// 跳转到账房webview（原来的逻辑）
			navigateToAccountWebview() {
				uni.request({
					url: this.websiteUrl + '/api/user/profile',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.user = res.data.data
						}

						var resData = res.data.data
						console.log('这里是resData--------------',resData)
						uni.navigateTo({
							url: '/pagesB/account/webview/webview?mobile=' + resData.mobile +
								'&password=' + resData.password +'&username=' + resData.username
						})
					}
				})
			},
			
			// 切换协议复选框状态
			toggleAgreementCheckbox() {
				this.agreementChecked = !this.agreementChecked;
				console.log('[协议-勾选] 切换后 agreementChecked =', this.agreementChecked);
			},
			
			// 协议弹窗取消
			handleAgreementCancel() {
				this.showAgreementModal = false;
				this.agreementChecked = false;
				this.agreementContent = ''; // 清空协议内容
				this.agreementLoading = false;
			},
			
			// 协议弹窗确定
			handleAgreementConfirm() {
				console.log('[协议-同意] 点击', {
					agreementChecked: this.agreementChecked,
					hasAccount: !!this.account,
					agree_creditPay_mark: this.account ? this.account.agree_creditPay_mark : 'N/A',
					accountKeys: this.account ? Object.keys(this.account) : []
				});
				if (!this.agreementChecked) {
					console.log('[协议-同意] 未勾选，直接返回');
					return;
				}
				
				if (!this.account || !this.account.agree_creditPay_mark) {
					console.log('[协议-同意] 参数异常，弹出协议参数错误');
					uni.showToast({
						title: '协议参数错误',
						icon: 'none'
					});
					return;
				}
				
				console.log('[协议-同意] 发起请求 agree_creditPay_mark =', this.account.agree_creditPay_mark);
				uni.showLoading({
					title: '提交中...',
					mask: true
				});
				
				uni.request({
					url: this.websiteUrl + '/api/account/agree_creditPay?agree_creditPay_mark=' + this.account.agree_creditPay_mark,
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.status == 'success') {
							// 同意协议成功，关闭协议弹窗
							this.showAgreementModal = false;
							this.agreementChecked = false;
							// 更新本地状态
							if (this.account) {
								this.account.is_agree_creditPay = 1;
							}
							// 检查实名状态
							if (this.account && this.account.realnametip && this.account.realnametip.length > 0) {
								// 未实名，显示实名确认弹窗
								this.realnameTarget = 'account';
								this.showRealnameModal = true;
							} else {
								// 已实名，直接跳转
								this.navigateToAccountWebview();
							}
						} else {
							uni.showToast({
								title: res.data.msg || '同意协议失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 实名确认弹窗取消
			handleRealnameCancel() {
				this.showRealnameModal = false;
				this.realnameTarget = '';
			},
			
			// 实名确认弹窗确定（去实名）
			handleRealnameConfirm() {
				this.showRealnameModal = false;
				const target = this.realnameTarget;
				this.realnameTarget = '';
				uni.navigateTo({
					url: '/pagesB/realname/realnameFace'
				});
			},
			
			// 跳转到提现页面（带实名校验）
			toDeposit() {
				// 检查是否已实名
				if (this.account && this.account.realnametip && this.account.realnametip.length > 0) {
					// 未实名，显示实名确认弹窗
					this.realnameTarget = 'deposit';
					this.showRealnameModal = true;
					return;
				}
				
				// 已实名，直接跳转到提现页面
				uni.navigateTo({
					url: '/pagesB/account/raply/raply'
				});
			},
			
			// 解析协议URL获取文章ID
			getArticleIdFromUrl(urlStr) {
				try {
					const urlParts = urlStr.split(/[?#]/)[0];
					const path = urlParts.split('/').pop();
					const match = path.match(/-(\d+)(\.html)?/);
					if (match) {
						return Number(match[1]);
					}
					return 0;
				} catch (error) {
					console.error('解析协议URL失败:', error);
					return 0;
				}
			},
			
			// 加载协议内容
			loadAgreementContent() {
				if (!this.account || !this.account.agree_creditPay_url) {
					return;
				}
				
				const articleId = this.getArticleIdFromUrl(this.account.agree_creditPay_url);
				if (!articleId) {
					console.error('无法从URL中解析出文章ID');
					return;
				}
				
				this.agreementLoading = true;
				this.$store.dispatch('setArticleDetail2', {
					id: articleId
				}).then(res => {
					this.agreementLoading = false;
					console.log('协议内容加载结果:', res);
					// 兼容不同的返回数据结构
					let content = '';
					if (res && res.data) {
						if (res.data.status === 'success' && res.data.data && res.data.data.content) {
							content = res.data.data.content;
						} else if (res.data.content) {
							content = res.data.content;
						} else if (res.content) {
							content = res.content;
						}
					}
					
					if (content) {
						// 处理文章内容，移除style属性
						const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
						const regex = new RegExp('<img', 'gi');
						content = content.replace(reg, '');
						content = content.replace(regex, '<img draggable="false" oncontextmenu="return false" style="width: 100% !important; height:auto;vertical-align:top;pointer-events: none;"');
						this.agreementContent = content;
					} else {
						console.error('协议内容为空');
						this.agreementContent = '';
					}
				}).catch(err => {
					this.agreementLoading = false;
					console.error('加载协议内容失败:', err);
					this.agreementContent = '';
				});
			},
			
			// 查看协议详情（备用方法，跳转到新页面）
			viewAgreementDetail() {
				if (this.account && this.account.agree_creditPay_url) {
					const articleId = this.getArticleIdFromUrl(this.account.agree_creditPay_url);
					if (articleId) {
						this.$outerHref('/pagesC/article/detail/detail?id=' + articleId, 'app');
					}
				}
			},
			
			// 打开协议 webview 页面
			openAgreementWebview() {
				if (!this.account || !this.account.agree_creditPay_url) {
					uni.showToast({
						title: '协议链接不存在',
						icon: 'none'
					});
					return;
				}
				
				// 先关闭弹窗，避免影响页面栈
				this.showAgreementModal = false;
				
				// 解析文章 ID（因为 agree_creditPay_url 是文章详情页的 H5 链接）
				const articleId = this.getArticleIdFromUrl(this.account.agree_creditPay_url);
				if (articleId) {
					// 跳转到 app 内的文章详情页（与 user.vue 的处理方式保持一致）
					this.$outerHref('/pagesC/article/detail/detail?id=' + articleId, 'app');
				} else {
					uni.showToast({
						title: '无法解析协议链接',
						icon: 'none'
					});
				}
			},
			
			clickPay() {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pagesB/account/deposit/deposit'
				})
				// #endif

				// #ifdef APP-PLUS
				this.$outerHref(this.$websiteUrl + 'user/account/deposit')
				// #endif
			},
		},
		onShow() {
			this.$store.dispatch('setAccount').then(res => {
				console.log('[协议-数据] setAccount 返回', { resKeys: Object.keys(res), hasData: !!res.data, dataKeys: res.data ? Object.keys(res.data) : [] });
				this.account = res.data;
				this.value_card = res.data.value_card;
				console.log('[协议-数据] account.agree_creditPay_mark =', this.account ? this.account.agree_creditPay_mark : 'N/A');
			})
		},
	}
</script>

<style>
	.proall {
		margin: -26rpx 26rpx 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.progress-container {
		background: #fc5b40;
		border-radius: 4rpx;
		height: 4px;
		flex: 1;
		overflow: hidden;
	}

	.progress-bar {
		height: 4px;
		background-color: #ffffff;
		width: 0;
		transition: width 0.3s ease;
	}

	.account {
		padding: 20upx;
	}

	.accountzero .purse-header-box {
		padding: 20upx;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, #FFFFFF 100%);
		box-shadow: inset 2rpx 2rpx 2rpx 0rpx #FFFFFF;
		border-radius: 20rpx;
	}

	.account .purse-header-box .value {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.account .purse-header-box .value .money {
		font-size: 60upx;
		color: #FE2F02;
	}

	.account .purse-header-box .value .frozen-money {
		width: 230rpx;
		height: 76rpx;
		border-radius: 38rpx;
		border: 1rpx solid #FE2F02;
		font-size: 32rpx;
		line-height: 74rpx;
		color: #FE2F02;
		font-weight: 500;
		text-align: center;
		margin-bottom: 1px;
		z-index: 9;
		/* padding: 0 20upx;
		border: 1px solid #80ccff;
		height: 20px;
		line-height: 20px;
		border-radius: 10px;
		font-size: 25upx; */
	}

	.account .purse-header-box .user-money-list {
		display: flex;
		flex-direction: row;
		margin-top: 50upx;

	}

	.account .purse-header-box .user-money-list .money-item {
		/* flex: 1 1 0%; */
		font-size: 24rpx;
		color: #626262;
		width: 25%;
		flex: 1;
		position: relative;
	}

	.account .purse-header-box .user-money-list .money-item:after {
		content: ' ';
		position: absolute;
		width: 1upx;
		height: 70%;
		background: rgba(192, 192, 192, 0.45);
		right: 0;
		top: 20%;
	}

	.account .purse-header-box .user-money-list .money-item:last-child:after {
		height: 0;
	}

	.account .user-pur-box {
		padding: 20upx;
		margin-top: 20upx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		border-radius: 10upx;
	}

	.account .user-pur-box .item {
		flex: 1 1 0%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.account .user-pur-box .item:first-child image {
		width: 26px;
		height: 17px;
		margin-right: 20upx;
	}

	.account .user-pur-box .item:last-child image {
		width: 18px;
		height: 17px;
		margin-right: 20upx;
	}

	.account .my-nav-box {
		margin-top: 20upx;
		background: #FFFFFF;
		border-radius: 16rpx;
	}

	.account .my-nav-box .item {
		display: flex;
		padding: 20upx;
		border-bottom: 1px solid #f6f6f9;
		justify-content: space-between;
		align-items: center;
	}

	.account .my-nav-box .item .tit .iconfont {
		margin-right: 10upx;
		font-size: 14px;
	}

	.user-money-list-item {
		height: 24rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #272727;
		line-height: 24rpx;
		text-align: left;
		font-style: normal;
		/* margin-left: 20rpx; */
	}

	.salebtn {
		min-width: 200rpx;
		height: 36rpx;
		background: #fc745b;
		border-radius: 18rpx;
		margin-left: 12rpx;
		padding: 1px 5px;
		/* opacity: 0.3; */
	}

	/* 协议弹窗样式 */
	.agreement-modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.agreement-modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.agreement-modal-content {
		position: relative;
		width: 680rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		overflow: hidden;
		z-index: 10000;
	}

	.agreement-modal-header {
		padding: 40rpx 40rpx 20rpx;
	}

	.agreement-modal-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #000000;
	}

	.agreement-modal-body {
		padding: 0 40rpx 20rpx;
		max-height: 600rpx;
	}

	.agreement-scroll-view {
		max-height: 600rpx;
		width: 100%;
	}

	.agreement-text-content {
		display: flex;
		flex-direction: column;
	}

	.agreement-text {
		font-size: 28rpx;
		color: #333333;
		line-height: 48rpx;
		margin-bottom: 20rpx;
	}

	.agreement-link-wrapper {
		margin-top: 20rpx;
		text-align: center;
	}

	.agreement-link-text {
		font-size: 28rpx;
		color: #FE2F02;
		text-decoration: underline;
	}

	.agreement-html-content {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #f9f9f9;
		border-radius: 8rpx;
	}

	.agreement-loading {
		text-align: center;
		padding: 40rpx;
		font-size: 28rpx;
		color: #999999;
	}

	.agreement-modal-checkbox-wrapper {
		padding: 20rpx 40rpx;
		border-top: 1rpx solid #F0F0F0;
		border-bottom: 1rpx solid #F0F0F0;
	}

	.agreement-checkbox-label {
		display: flex;
		align-items: center;
		position: relative;
	}

	.agreement-checkbox-container {
		position: relative;
		display: inline-block;
	}

	.agreement-tip-banner {
		position: absolute;
		bottom: 100%;
		left: 0;
		margin-bottom: 12rpx;
		background-color: #4A4A4A;
		border-radius: 8rpx;
		padding: 12rpx 24rpx;
		white-space: nowrap;
		z-index: 10001;
	}

	.agreement-tip-arrow {
		position: absolute;
		bottom: -12rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
		border-top: 12rpx solid #4A4A4A;
	}

	.agreement-tip-text {
		font-size: 26rpx;
		color: #FFFFFF;
	}

	.agreement-checkbox-circle {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid #DDDDDD;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.agreement-checkbox-checked {
		background-color: #FE2F02;
		border-color: #FE2F02;
	}

	.agreement-checkmark {
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 1;
	}

	.agreement-checkbox-text {
		font-size: 28rpx;
		color: #333333;
		margin-left: 16rpx;
		line-height: 40rpx;
	}
	
	.agreement-link {
		color: #FE2F02;
		text-decoration: underline;
	}

	.agreement-modal-footer {
		display: flex;
		flex-direction: row;
		padding: 0;
	}

	.agreement-btn {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
		border-top: 1rpx solid #F0F0F0;
	}

	.agreement-btn-cancel {
		color: #666666;
		border-right: 1rpx solid #F0F0F0;
	}

	.agreement-btn-confirm {
		color: #FE2F02;
		font-weight: 500;
	}

	.agreement-btn-disabled {
		color: #CCCCCC;
	}

	/* 实名确认弹窗样式 */
	.realname-modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.realname-modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.realname-modal-content {
		position: relative;
		width: 600rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		overflow: hidden;
		z-index: 10000;
	}

	.realname-modal-body {
		padding: 60rpx 40rpx 40rpx;
	}

	.realname-modal-text {
		font-size: 30rpx;
		color: #333333;
		line-height: 48rpx;
		text-align: center;
	}

	.realname-modal-footer {
		display: flex;
		flex-direction: row;
		border-top: 1rpx solid #F0F0F0;
	}

	.realname-btn {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.realname-btn-cancel {
		color: #666666;
		border-right: 1rpx solid #F0F0F0;
	}

	.realname-btn-confirm {
		color: #FE2F02;
		font-weight: 500;
	}
</style>