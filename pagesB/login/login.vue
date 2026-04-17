<template>
	<view class="container-bwg" style="background: linear-gradient(180deg, #FFD4C8 0%, #FFF5E8 100%); overflow-x: hidden;">
		<!-- #ifdef MP-WEIXIN -->
		<view class="login-section">
			<view class="header">
				<image :src="scopeUserInfo.avatarUrl" class="img" v-if="scopeUserInfo.avatarUrl"></image>
				<image
					src="https://images.eqingqu.com/attachs/photo/202505/20250509_306AA5BD7E90958E102A5CE61A5352D2.png"
					class="img" v-else></image>
			</view>
			<view class="user-name">
				<block v-if="scopeUserInfo.nickName">{{ scopeUserInfo.nickName }}</block>
			</view>
			<view class="cont">
				<block v-if="scope == 'userInfo'">{{$t('lang.weixin_login_user_info')}}</block>
				<block v-if="scope == 'phoneNumber'">{{$t('lang.weixin_login_phone_number')}}</block>
			</view>
			<view class="btn">
				<block v-if="scope == 'userInfo'">
					<button type="primary" class="page-body-button" open-type="getUserInfo" @getuserinfo="getUserInfo"
						v-if="!canIUseProfile">{{$t('lang.weixin_empower')}}</button>
					<button type="primary" class="page-body-button" @click="getUserProfile"
						v-else>{{$t('lang.weixin_empower')}}</button>
				</block>
				<button type="primary" class="page-body-button" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber"
					v-if="scope == 'phoneNumber'">{{$t('lang.one_tongbu_login')}}</button>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<!-- UI 对齐 pages/news/quhaoma-login (1).html：默认验证码登录 + 运营头图；账号密码从底部「账号密码」进入 -->
		<view class="container-login">
			<view class="back-btn" @click="onClickBack">
				<text class="iconfont icon-back"></text>
			</view>

			<!-- 图一：短信登录页运营区 -->
			<view class="login-hero" v-if="!loginMode">
				<view class="promo-section">
					<view class="promo-label"><text class="promo-highlight">新人特权</text> 最高</view>
					<view class="promo-title">登录送10元</view>
					<view class="promo-subtitle">登录后立即领取</view>
				</view>
				<view class="red-envelope" aria-hidden="true">
					<view class="red-envelope-card">
						<view class="red-envelope-coin"><text class="red-envelope-yen">¥</text></view>
					</view>
				</view>
			</view>

			<!-- 图二：账号密码页标题 -->
			<view class="login-header login-header-pwd" v-else>
				<view class="page-title">账号密码登录</view>
			</view>

			<!-- 与 quhaoma-login (1).html 的 .container 一致：单块 #F8F8F8 + 上圆角 + 统一内边距，协议与「其他方式登录」同在一容器内 -->
			<view class="login-content-wrap">
			<view class="login-form">
				<form @submit="formSubmit">
					<block v-if="loginMode">
						<view class="input-group">
							<input type="text" class="input" v-model="username" name="username" autocomplete="off"
								:placeholder="$t('lang.enter_username')" />
						</view>
						<view class="password-group">
							<input :type="pwd" class="input" v-model="password" name="password" autocomplete="off"
								:placeholder="$t('lang.enter_password')" />
							<view class="eye-icon" @click="handlePwdShow">
								<!-- App/H5 统一用 uni-icons，随 pwd 切换 eye / eye-slash（原先 App 写死 iconfont 不会变） -->
								<uni-icons :type="pwd === 'password' ? 'eye-slash' : 'eye'" color="#999" :size="22"></uni-icons>
							</view>
						</view>
						<view class="forgot-password">
							<navigator url="../login/forgetPwd/forgetPwd" hover-class="none" class="forgot-link">
								{{$t('lang.forget_password')}}
							</navigator>
						</view>
					</block>
					<block v-else>
						<!-- 本机一键：预取号成功或用户从验证码页点击链接触发 -->
						<block v-if="showOneClickPanel">
							<view class="oneclick-mask-phone">{{ maskedPhoneDisplay }}</view>
							<button class="login-btn" type="button" @click="oneClickLogin()">本机号码一键登录</button>
							<view class="oneclick-link" @click="switchToSmsManual">其他手机号登录</view>
						</block>
						<!-- 验证码登录 / H5 / 预取失败 / 用户选择其他手机号 -->
						<block v-else>
							<view class="phone-input-group">
								<text class="phone-prefix">+86</text>
								<input type="number" class="input-phone" v-model="mobile" name="mobile" maxlength="11"
									autocomplete="off" placeholder="请输入手机号" />
							</view>
							<view class="code-input-group">
								<input type="number" class="input" v-model="sms" name="sms" maxlength="6"
									autocomplete="off" :placeholder="$t('lang.get_sms_code')" />
								<view class="get-code-btn" @click="handleSendSmsCode" v-if="button_type">{{$t('lang.get_code')}}</view>
								<view class="get-code-btn" v-else>{{ button_text }}</view>
							</view>
						</block>
					</block>

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

					<button v-if="!showOneClickPanel" class="login-btn" :class="{'btn-disabled':disabled}" :disabled="disabled" form-type="submit">登录</button>

					<!-- 验证码页：仅切换 UI，不在这里调一键登录接口 -->
					<view v-if="!loginMode && !showOneClickPanel" class="oneclick-link" @click="openOneClickPanelFromLink">本机号码一键登录</view>

					<!-- 账号密码页：切回短信 -->
					<view class="switch-login-mode" v-if="loginMode && shop_reg_closed == 0">
						<button class="switch-btn" type="button" @click="switchToSmsMode">短信快捷登录</button>
					</view>
					<view class="register-link" v-if="loginMode && shop_reg_closed == 0">
						<navigator url="../register/register" hover-class="none" class="register-link-text">
							还没有账号？<text class="register-link-red">立即注册</text>
						</navigator>
					</view>

					<view class="privacy-agreement">
						<view class="privacy-checkbox" :class="{'checked':checked}" @click="checked = !checked">
							<view class="checkbox-icon-wrapper">
								<view v-if="checked" class="checkbox-checked"></view>
							</view>
						</view>
						<view class="privacy-text" @click="checked = !checked">
							<text>我同意</text>
							<text class="privacy-link" @click.stop="toTrain">《趣好卖服务条款》</text>
							<text>和</text>
							<text class="privacy-link" @click.stop="toAgreement">《隐私政策》</text>
						</view>
					</view>
				</form>
			</view>

				<view class="login-divider">其他方式登录</view>
				<view class="other-login-methods">
					<view class="login-method" v-for="(item, index) in loginMethodList" :key="item.id"
						@click="onLoginMethodClick(item)">
						<view class="method-icon">
							<image v-if="item.iconSrc" :src="item.iconSrc" class="method-icon-img" mode="aspectFit" />
							<uni-icons v-else-if="item.uniIcon" :type="item.uniIcon" :color="item.uniColor" :size="item.uniSize"></uni-icons>
						</view>
						<text class="method-label" :class="item.labelClass">{{ item.label }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务协议及隐私保护弹窗：手机号+密码校验通过后展示，同意后执行登录 -->
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
						<button type="warn" class="btn" :class="{'btn-disabled':privacyDisabled}"
							:disabled="privacyDisabled"
							@click="privacyShow = false; checked = true">{{ privacy_button_text }}</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- #endif -->

		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import captcha from "@/components/captcha4/index.vue";
	var graceChecker = require("@/common/graceChecker.js");

	// #ifdef APP-PLUS
	var jpushModule = uni.requireNativePlugin("JG-JPush")
	const jv = uni.requireNativePlugin('JG-JVerification');
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
				providerList: [],
				pwd: 'password',
				scopeUserInfo: {},
				scope: 'userInfo',
				scopeSessions: {},
				oauthList: [],
				clientHight: 0,
				footerHight: 0,
				delta: '',
				fromNewPerson: false, // 是否来自新人优惠券页面
				fromPay: false, // 是否来自支付页（scopeSession 缺失需刷新）
				payOrderSn: '', // 支付页订单号，用于返回
				parent_id: uni.getStorageSync('parent_id') ? uni.getStorageSync('parent_id') : 0,
				isWXInstalled: false,
				system: '', // 系统版本
				platform: '', // 平台
				loginMode: false,
				register_article_id: uni.getStorageSync('configData').register_article_id,
				configData: uni.getStorageSync('configData'),
				shop_reg_closed: 0, // 默认显示切换/注册入口，接口返回后再更新；避免退出登录后无 token 导致接口失败时按钮全丢
				disabled: true,
				// 账号密码登录
				username: '',
				password: '',
				// 短信快捷登录
				mobile: '',
				// imgverifyValue: '', // 【已注释】旧的图形验证码，现在使用阿里验证码
				sms: '',
				send_again: this.$t('lang.send_again'),
				button_text: this.$t('lang.send_again_60'),
				button_type: true,
				// 隐私协议
				checked: false,
				privacyShow: false,
				privacyActicleContent: '',
				privacyActicleTitle: '',
				privacyDisabled: true,
				privacy_button_text: '我已阅读(6s)',
				timer: null,
				height: 0,
				canIUseProfile: false,

				loginToken: null,
				registrationID: '',
				showAgreementPopup: false,
				pendingLoginPayload: null,
				/** APP 一键登录：预取号成功则优先展示本机掩码 + 一键登录（极光 preLogin 成功码 7000/8000） */
				oneClickAvailable: false,
				/** 用户主动选择「其他手机号登录」，展示验证码表单 */
				smsManualMode: false,
				/** 验证码页点击「本机号码一键登录」链：切到本机一键 UI（非 App 也可先展示，由按钮内再校验） */
				forceOneClickUi: false,
				/** 运营商返回的脱敏号，没有则用占位星号 */
				localMaskedPhone: ''
			}
		},
		components: {
			uniIcons,
			uniPopup,
			dscCommonNav,
			jyfParser,
			captcha
		},
		computed: {
			...mapState({
				phoneNumber: state => state.common.phoneNumber,
				// captcha: state => state.common.imgVerify.captcha, // 【已注释】旧的图形验证码，现在使用阿里验证码
				client: state => state.common.imgVerify.client,
			}),
			thirdPartyImg() {
				let arr = []
				this.oauthList.forEach((v) => {
					arr.push('/pagesC/static/oauth/' + v + '.png')
				})
				return arr
			},
			footerTop() {
				return this.clientHight - this.footerHight
			},
			// 其他方式登录：微信、Apple、账号密码、注册（对齐 quhaoma-login (1).html）
			loginMethodList() {
				const list = []
				if (this.oauthList.indexOf('weixin') !== -1) {
					list.push({
						id: 'weixin',
						type: 'oauth',
						provider: 'weixin',
						uniIcon: 'weixin',
						uniColor: '#07c160',
						uniSize: 22,
						label: '微信',
						labelClass: 'label-weixin'
					})
				}
				if (this.oauthList.indexOf('apple') !== -1) {
					list.push({
						id: 'apple',
						type: 'oauth',
						provider: 'apple',
						iconSrc: '/pagesC/static/oauth/apple.png',
						label: 'Apple',
						labelClass: 'label-apple'
					})
				}
				if (this.shop_reg_closed == 0) {
					list.push({
						id: 'account',
						type: 'account',
						uniIcon: 'locked',
						uniColor: '#999999',
						uniSize: 20,
						label: '账号密码',
						labelClass: 'label-account'
					})
					list.push({
						id: 'register',
						type: 'register',
						uniIcon: 'person',
						uniColor: '#999999',
						uniSize: 20,
						label: '注册',
						labelClass: 'label-register'
					})
				}
				return list
			},
			/** 展示本机一键主界面：预取号成功，或用户从验证码页点击链接触发 */
			showOneClickPanel() {
				return !this.loginMode && !this.smsManualMode && (this.oneClickAvailable || this.forceOneClickUi)
			},
			maskedPhoneDisplay() {
				const s = (this.localMaskedPhone || '').trim()
				if (s) return s
				/* 与 quhaoma-login (1).html #maskMode 占位一致 */
				return '************'
			}
		},
		onReady() {
			var that = this
			// #ifdef APP-PLUS
			// 开启 debug 模式，请在初始化前调用
			jv.setDebugMode(true);
			// 初始化
			jv.init({
				timeout: 7000,
				isProduction: true, //是否生产环境
				// advertisingId //广告标识符，可选
			}, result => {
				let code = result.code
				let desc = result.content
			});
			// #endif

			that.getClientHight();
		},
		onLoad(e) {
			var that = this
			console.log(e)

			that.delta = e.delta ? e.delta : ''
			that.fromNewPerson = e.fromNewPerson == '1' || e.fromNewPerson == 1 // 读取是否来自新人优惠券页面
			// 默认短信登录（对齐 quhaoma-login 图一）；仅 ?loginMode=password 走账号密码
			that.loginMode = e.loginMode === 'password'
			// 来自支付页：获取 scopeSession 后需返回支付页
			that.fromPay = e.from === 'done'
			that.payOrderSn = e.order_sn ? decodeURIComponent(e.order_sn) : ''

			//#ifdef MP-WEIXIN
			uni.removeStorage({
				key: 'scopeSession',
				success: (res) => {
					that.scopeSession();
				}
			})

			// 判断小程序是否存在getUserProfile
			if (uni.getUserProfile) that.canIUseProfile = true;

			//#endif

			// #ifndef MP-WEIXIN


			// 注册协议
			if (!that.configData) that.shopConfig();

			// 是否开启注册
			that.colseRegister();

			// 短信快捷登录
			// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
			if (!that.loginMode) that.$store.dispatch('setImgVerify');

			// 隐私声明
			that.privacyActicle();

			// #ifdef APP-PLUS
			that.height = uni.getSystemInfoSync().windowHeight
			// 先判断 系统版本
			uni.getSystemInfo({
				success: (res) => {
					that.system = res.system
					that.platform = res.platform
				}
			});

			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					if (that.platform == 'ios') {
						that.oauthList = ['weixin', 'apple']; // res.provider;
					} else {
						that.oauthList = ['weixin']; // res.provider;
					}
				}
			});

			if (uni.getSystemInfoSync().platform == 'ios') {
				var WXApi = plus.ios.import("WXApi");
				var isWXInstalled = WXApi.isWXAppInstalled();
				that.isWXInstalled = isWXInstalled
			}
			setTimeout(function() {
				jv.isInitSuccess(result => {})

				jv.getToken(7000, result => {
					that.loginToken = result.content
				})

				// 先判断是否支持一键，再预取号；成功才展示本机掩码页（避免与 preLogin 并发导致状态不准）
				jv.checkVerifyEnable(result => {
					const okEnv = result && (result.enable === true || result.isSupport === true)
					if (!okEnv) {
						that.oneClickAvailable = false
						return
					}
					jv.preLogin(10000, pre => {
						const code = Number(pre && pre.code)
						const ok = code === 7000 || code === 8000
						that.oneClickAvailable = ok
						if (!ok) return
						const tryMask = (v) => {
							if (v == null || v === '') return ''
							const str = String(v).trim()
							if (str && (/\d\*+\d/.test(str) || /\*{3,}/.test(str) || str.length >= 11)) return str
							return ''
						}
						let mask =
							tryMask(pre.maskPhone) ||
							tryMask(pre.maskMobile) ||
							tryMask(pre.phone)
						if (!mask && pre.content) {
							const c = String(pre.content)
							if (/\d\*+\d/.test(c) || /\*{3,}/.test(c)) mask = c
						}
						that.localMaskedPhone = mask
					})
				})
			}, 1000);
			that.getRegistrationID()
			// #endif
			// #ifdef H5
			/*
				true：微信浏览器
				false：其他浏览器
			* */
			let target = navigator.userAgent.toLowerCase();
			let isWeixin = /micromessenger/.test(target);
			console.log(isWeixin);
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
				if (isWeixin == true) {
					var code = that.GetQueryString('code');
					console.log('code=' + code)
					// // 判断是否存在code
					if (code == null || code == '') {
						// 重新获取code
						const base_url = encodeURIComponent('https://www.ok9288.com/mobile/pagesB/login/login?delta=1');
						const wx_url =
							// 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7daf1d30f51f1fe&redirect_uri=' + base_url + '&response_type=code&scope=snsapi_userinfo&state=123'+'&shopId=' + that.shopId + '#wechat_redirect'
							'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0b4564de207d9a5f&redirect_uri=' +
							base_url + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
						window.location.href = wx_url;
						return
					} else {
						// 发送code
						that.handleToLogin(code);
					}
				}
			}
			// #endif
			// #endif
		},
		onShow() {
			// 每次显示页面时刷新配置与登录方式，避免退出登录后 reLaunch 回来时接口未复用或异步未就绪导致按钮/数据缺失
			// #ifndef MP-WEIXIN
			if (!this.configData) this.shopConfig();
			this.colseRegister();
			// #ifdef APP-PLUS
			var that = this;
			uni.getSystemInfo({
				success: (res) => {
					that.platform = res.platform;
				}
			});
			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					if (that.platform === 'ios') {
						that.oauthList = ['weixin', 'apple'];
					} else {
						that.oauthList = ['weixin'];
					}
				}
			});
			// #endif
			// #ifdef H5
			// H5 无 getProvider，按环境显示：微信浏览器可显示微信，其余可显示占位或隐藏
			var ua = navigator.userAgent.toLowerCase();
			if (/micromessenger/.test(ua)) {
				this.oauthList = ['weixin'];
			} else {
				this.oauthList = ['weixin', 'apple'];
			}
			// #endif
			// #endif
		},
		 mounted() {
		      this.detectAliPlatform();
		      // #ifdef H5
		      this.initH5AliCaptcha();
		      // #endif
		    },
		watch: {
			username() {
				this.updateLoginDisabled()
			},
			password() {
				this.updateLoginDisabled()
			},
			mobile() {
				this.updateLoginDisabled()
			},
			sms() {
				this.updateLoginDisabled()
			},
			privacyShow() {
				let that = this
				let second = 6;

				//if(that.privacyShow) that.privacyActicle();

				if (that.privacyShow && !that.checked) {
					that.privacyDisabled = true
					that.timer = setInterval(() => {
						second--
						if (second) {
							that.privacy_button_text = '我已阅读' + '(' + second + 's)'
						} else {
							that.privacy_button_text = '我已阅读'
							that.privacyDisabled = false
							clearInterval(that.timer)
						}
					}, 1000)
				} else {
					that.privacy_button_text = that.checked ? '我已阅读' : '我已阅读(6s)'
					clearInterval(that.timer)
				}
			},
			loginMode() {
				if (!this.loginMode) {
					// 【保留】调用接口获取 client 参数（不显示图形验证码UI）
					this.$store.dispatch('setImgVerify');
					this.username = '';
				} else {
					this.mobile = '';
				}
				this.updateLoginDisabled()
			},
		},
		methods: {
			// 账号密码模式：用户名、密码不为空才高亮；短信模式：手机号、验证码不为空才高亮
			updateLoginDisabled() {
				if (this.loginMode) {
					this.disabled = !((this.username || '').trim() && (this.password || '').trim())
				} else {
					this.disabled = !((this.mobile || '').trim() && (this.sms || '').trim())
				}
			},
			onAgreementDisagree() {
				this.showAgreementPopup = false
				this.pendingLoginPayload = null
			},
			onAgreementAgree() {
				this.showAgreementPopup = false
				this.checked = true
				if (!this.pendingLoginPayload) return
				const payload = this.pendingLoginPayload
				this.pendingLoginPayload = null
				if (payload.type === 'oauth') {
					this.thirdPartyLink(payload.provider, true)
					return
				}
				if (payload.type === 'oneclick') {
					this.oneClickLogin(true)
					return
				}
				var rule = payload.type === 'account'
					? [
						{ name: 'username', checkType: 'notnull', checkRule: '', errorMsg: this.$t('lang.username_notic') },
						{ name: 'password', checkType: 'notnull', checkRule: '', errorMsg: this.$t('lang.password_notic') }
					]
					: [
						{ name: 'mobile', checkType: 'notnull', checkRule: '', errorMsg: this.$t('lang.mobile_not_null') },
						{ name: 'code', checkType: 'notnull', checkRule: '', errorMsg: this.$t('lang.get_sms_code_notic') }
					]
				if (!graceChecker.check(payload, rule)) {
					uni.showToast({ title: graceChecker.error, icon: 'none' })
					return
				}
				// 用户点击同意后才走登录逻辑，此时再显示 loading
				uni.showLoading({ title: '登录中请稍后~~', mask: true })
				if (payload.type === 'account') {
					this.$store.dispatch('userLogin', {
						username: payload.username,
						password: payload.password,
						delta: payload.delta
					})
				} else if (payload.type === 'sms') {
					this.doSmsLogin(payload)
				}
			},
			// 短信快捷登录：协议弹窗点「同意」后执行
			doSmsLogin(payload) {
				this.$store.dispatch('userRegister', {
					client: this.client,
					mobile: payload.mobile,
					code: payload.code,
					parent_id: this.parent_id,
					allow_login: 1
				}).then(res => {
					uni.hideLoading()
					if (res.status == 'success') {
						this.token = res.data;
						var targetUrl = this.fromNewPerson ? '/pages/middles/middles' : '/pages/user/user';
						uni.setStorage({
							key: 'token',
							data: res.data,
							success: () => {
								// #ifdef H5
								uni.reLaunch({ url: targetUrl });
								// #endif
								// #ifndef H5
								uni.switchTab({ url: targetUrl });
								// #endif
							}
						});
						uni.showToast({ title: this.$t('lang.login_success') });
					} else {
						uni.showToast({
							title: res.errors.message,
							icon: 'none'
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
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
			       this.aliCaptchaResult = null;
			       this.button_type = false;
			       this.button_text = '请稍后...';
			       console.log('[login] 准备弹出阿里验证码, captchaId:', this.aliConfig.captchaId, 'ref存在:', !!this.$refs.captcha);
			       setTimeout(() => {
			         if (this.$refs.captcha) {
			           console.log('[login] 调用 showCaptcha');
			           this.$refs.captcha.showCaptcha();
			         } else {
			           console.error('[login] captcha ref 不存在！');
			           this.button_type = true;
			         }
			       }, 500);
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
			      // 发送验证码只校验手机号，不校验协议；协议在点击「登录」时再校验并弹窗
			      validateSmsInput() {
			        if (!this.mobile) {
			          uni.showToast({ title: '请输入手机号', icon: 'none' });
			          return false;
			        }
			        return true;
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
						client: this.client,
						mobile: this.mobile,
						code: this.sms,
						parent_id: this.parent_id,
						allow_login: 1,
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
			      
			      // APP验证码回调方法
			      captchaSuccess(result) {
			        console.log('[login] captchaSuccess 收到结果:', JSON.stringify(result));
			        this.aliCaptchaResult = result;
			        this.sendSmsAfterCaptcha();
			      },
			      captchaError(e) {
			        console.error('[login] captchaError:', JSON.stringify(e));
			        this.aliCaptchaResult = null;
			        this.button_type = true;
			        uni.showToast({ title: '验证失败，请重试', icon: "none" });
			      },
			      captchaFail() {
			        console.log('[login] captchaFail — 弹窗内自动刷新，不关闭');
			      },
			      captchaReady() {
			        console.log('[login] captchaReady — 阿里验证码准备就绪');
			      },
			      captchaClose() {
			        console.log('[login] captchaClose — 阿里验证码关闭');
			        this.aliCaptchaResult = null;
			        this.button_type = true;
			      },
				  
				  
				  
				  
			// 检查网络状态
			    checkNetwork() {
			      return new Promise((resolve) => {
			        // 使用uni-app内置的网络状态API
			        uni.getNetworkType({
			          success: (res) => {
			            this.networkAvailable = res.networkType !== 'none';
			            resolve(this.networkAvailable);
			          },
			          fail: () => {
			            this.networkAvailable = false;
			            resolve(false);
			          }
			        });
			      });
			    },
			
			// 解析URL 参数
			getUrlParam(name) {
				console.log(name)
				let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
				let r = window.location.href;
				console.log("r")
				console.log(r)
				return;
				if (r != null) {
					return unescape(r[2]);
				}
				return null;
			},
			GetQueryString(name) {
				var url = window.location.href;
				console.log(url)
				try {
					var cs = url.split('?')[1]; //获取?之后的参数字符串
					var cs_arr = cs.split('&'); //参数字符串分割为数组
					for (var i = 0; i < cs_arr.length; i++) { //遍历数组，拿到json对象
						if (cs_arr[i].split('=')[0] == name) {
							return cs_arr[i].split('=')[1];
						}
					}
					return null;
				} catch {
					return null;
				}
			},

			//比如调用接口loginIn
			handleToLogin(code) {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/oauth/h5_wechat_login',
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					data: {
						code: code,
						type: 'weixin',
						platform: 'H5'
					},
					success: (res_1) => {
						console.log("这里")
						console.log(res_1)
						console.log(res_1.data)
						// if (res_1.data.error == '0') {
						if (res_1.data.data.login === 1) {
							uni.setStorageSync("token", res_1.data.data.token)
							// #ifdef H5
							uni.switchTab({
								url: '/pages/user/user'
							})
							// #endif
							// #ifndef H5
							if (this.delta) {
								uni.navigateBack({
									delta: 1
								})
							} else {
								uni.switchTab({
									url: '/pages/user/user'
								})
							}
							// #endif
						}
					},
					fail: (data, code) => {
						that.tui.toast('网络连接不可用,请检查网络')
					}
				})
			},
			getRegistrationID() {
				jpushModule.getRegistrationID(result => {
					let registerID = result.registerID
					this.registrationID = registerID
				})
			},
			// 【保留】调用图形验证码接口获取 client 参数（不显示UI）
			clickCaptcha() {
				this.$store.dispatch('setImgVerify')
			},
			getClientHight() {
				let that = this;
				uni.getSystemInfo({
					success(res) {
						that.clientHight = res.screenHeight;
						that.footerHight = that.clientHight * 0.3;
					}
				})
			},
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
			},
			scopeSession() {

				uni.login({
					provider: 'weixin',
					success: (res) => {
						this.$store.dispatch('getScopeAppSession', {
							code: res.code
						}).then(sessionRes => {
							uni.setStorageSync('scopeSession', sessionRes.data);
							// uni.setStorage({
							// 	key: 'scopeSession',
							// 	data: sessionRes.data
							// });

							this.scopeSessions = sessionRes.data;
							// 来自支付页：scopeSession 已刷新，返回支付页
							if (this.fromPay && this.payOrderSn) {
								uni.redirectTo({
									url: '/pagesD/done/done?order_sn=' + encodeURIComponent(this.payOrderSn)
								});
							}
						}).catch(err => {
							if (this.fromPay) {
								uni.showToast({ title: '刷新支付信息失败，请重试', icon: 'none' });
							}
						})
					},
					fail: (res) => {
						uni.showToast({
							title: res.errMsg,
							icon: 'none'
						});
					}
				});
			},
			getUserProfile(e) {
				uni.getUserProfile({
					desc: '用于完善用户资料',
					lang: 'zh_CN',
					success: (profileRes) => {
						uni.setStorageSync('scopeUserInfo', profileRes.userInfo);
						// uni.setStorage({ key: 'scopeUserInfo', data: profileRes.userInfo });
						this.scopeUserInfo = profileRes.userInfo;

						this.scope = 'phoneNumber';
					},
					fail: (infoRes) => {
						console.log(infoRes)
						uni.showToast({
							title: '获取用户资料授权失败，请重新操作',
							icon: 'none'
						});
					},
				});
			},
			getUserInfo(e) {
				var that = this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
								uni.getStorage({
									key: 'scopeSession',
									success: (session) => {
										that.$store.dispatch('getScopeUserInfo', {
											sessionKey: session.data
												.session_key,
											iv: infoRes.iv,
											encryptData: infoRes.encryptedData
										}).then(res => {
											that.scopeSessions = {
												openid: res.data.openId,
												unionid: res.data.unionId,
												session_key: session.data
													.session_key,
												expires_in: session.data
													.expires_in
											}
										})
									}
								});
								uni.setStorageSync('scopeUserInfo', infoRes.userInfo);
								// uni.setStorage({ key: 'scopeUserInfo', data: infoRes.userInfo });
								that.scopeUserInfo = infoRes.userInfo;
								that.scope = 'phoneNumber';
							},
							fail: (infoRes) => {
								uni.showToast({
									title: that.$t('lang.authorization_fail_notic'),
									icon: 'none'
								});
							}
						})
					}
				});

			},
			getPhoneNumber(e) {
				//读取本地scopeSession
				uni.getStorage({
					key: 'scopeSession',
					complete: (res) => {
						this.$store.dispatch('getScopePhoneNumber', {
							sessionKey: res.data.session_key,
							iv: e.detail.iv,
							encryptData: e.detail.encryptedData
						}).then(obj => {
							if (obj.status == 'success') {
								let o = {}

								// 如果来自新人优惠券页面，登录成功后跳转到首页
								if (this.fromNewPerson) {
									o = {
										scopeSessions: this.scopeSessions,
										phoneNumber: obj.data.phoneNumber,
										userInfo: this.scopeUserInfo,
										delta: 2,
										parent_id: this.parent_id,
										platform: uni.getStorageSync('platform'),
									}
								} else if (this.delta) {
									o = {
										scopeSessions: this.scopeSessions,
										phoneNumber: obj.data.phoneNumber,
										userInfo: this.scopeUserInfo,
										delta: this.delta,
										parent_id: this.parent_id,
										platform: uni.getStorageSync('platform'),
									}
								} else {
									o = {
										scopeSessions: this.scopeSessions,
										phoneNumber: obj.data.phoneNumber,
										userInfo: this.scopeUserInfo,
										delta: '2',
										parent_id: this.parent_id,
										platform: uni.getStorageSync('platform'),
									}
								}
console.log(this.delta)
console.log(o)
								this.$store.dispatch('getScopeAppLogin', o);
							}
						});
					}
				});
			},
			async formSubmit(e) {
				// 不在这里 showLoading：只有用户点「同意」后才走登录逻辑
				try {
				// 表单数据先取好，未勾选隐私时弹窗也要用
				var formData = {};
				if (this.loginMode) {
					formData.username = (e.detail.value && e.detail.value.username !== undefined && e.detail.value.username !== '') ? e.detail.value.username : this.username;
					formData.password = (e.detail.value && e.detail.value.password !== undefined && e.detail.value.password !== '') ? e.detail.value.password : this.password;
				} else {
					formData.mobile = (e.detail.value && e.detail.value.mobile !== undefined && e.detail.value.mobile !== '') ? e.detail.value.mobile : this.mobile;
					formData.sms = (e.detail.value && e.detail.value.sms !== undefined && e.detail.value.sms !== '') ? e.detail.value.sms : this.sms;
				}

				// 未勾选隐私：不弹 toast，改弹「同意/不同意」弹窗，触发时机不变
				if (!this.checked) {
					var deltaValue = this.fromNewPerson ? 2 : (this.delta ? this.delta : '');
					if (this.loginMode) {
						this.pendingLoginPayload = { type: 'account', username: formData.username, password: formData.password, delta: deltaValue };
					} else {
						this.pendingLoginPayload = { type: 'sms', mobile: formData.mobile, code: formData.sms };
					}
					this.showAgreementPopup = true;
					return;
				}

				if (this.loginMode) {
					var rule = [{
							name: "username",
							checkType: "notnull",
							checkRule: "",
							errorMsg: this.$t('lang.username_notic')
						},
						{
							name: "password",
							checkType: "notnull",
							checkRule: "",
							errorMsg: this.$t('lang.password_notic')
						},
					];
				} else {
					var rule = [
						{
							name: "mobile",
							checkType: "notnull",
							checkRule: "",
							errorMsg: this.$t('lang.mobile_not_null')
						},
						{
							name: "sms",
							checkType: "notnull",
							checkRule: "",
							errorMsg: this.$t('lang.get_sms_code_notic')
						},
					];
				}
				var checkRes = graceChecker.check(formData, rule);

				if (checkRes) {
					// 检查网络状态
					const isOnline = await this.checkNetwork();
					if (!isOnline) {
						uni.showToast({ title: '网络不可用，请检查连接', icon: 'none' });
						return;
					}

					// 账号密码/短信快捷登录：仅在未勾选隐私协议时弹窗
					if (this.loginMode) {
						var deltaValue = this.fromNewPerson ? 2 : (this.delta ? this.delta : '')
						this.pendingLoginPayload = {
							type: 'account',
							username: formData.username,
							password: formData.password,
							delta: deltaValue
						}
					} else {
						this.pendingLoginPayload = {
							type: 'sms',
							mobile: formData.mobile,
							code: formData.sms
						}
					}

					// 已勾选：不再弹窗，直接执行登录
					if (this.checked) {
						this.onAgreementAgree();
						return;
					}

					// 未勾选：弹窗由用户确认后再登录
					this.showAgreementPopup = true
					return
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
				
				} catch (error) {
					console.error('登录错误:', error);
					uni.showToast({
						title: this.getLoginErrorMessage(error),
						icon: 'none'
					});
				}
			},
			  // 获取登录错误信息
			    getLoginErrorMessage(error) {
			      if (error.errCode === -1005) {
			        return '网络连接丢失，请重试';
			      }
			      if (error.errCode === 408 || (error.errMsg && error.errMsg.includes('timeout'))) {
			        return '请求超时，请检查网络';
			      }
			      return error.message || '登录失败，请稍后重试';
			    },
			onLoginMethodClick(item) {
				if (item.type === 'oauth') {
					this.thirdPartyLink(item.provider)
				} else if (item.type === 'account') {
					this.loginMode = true
				} else if (item.type === 'register') {
					uni.navigateTo({ url: '../register/register' })
				}
			},
			switchToSmsManual() {
				this.smsManualMode = true
				this.forceOneClickUi = false
			},
			/** 验证码页「本机号码一键登录」文字链：只切换到本机一键界面 */
			openOneClickPanelFromLink() {
				this.forceOneClickUi = true
				this.smsManualMode = false
			},
			switchToSmsMode() {
				this.loginMode = false
				this.forceOneClickUi = false
				this.smsManualMode = true
			},
			async thirdPartyLink(value, fromAgreement) {
				var that = this
				if (!fromAgreement && !this.checked) {
					this.pendingLoginPayload = { type: 'oauth', provider: value }
					this.showAgreementPopup = true
					return
				}
				// #ifdef H5
				/*
					true：浏览器
					false：其他浏览器
				* */
				let target = navigator.userAgent.toLowerCase();
				let isWeixin = /micromessenger/.test(target);
				console.log(isWeixin);
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
					if (isWeixin == true) {
						var code = that.GetQueryString('code');
						console.log('code=' + code)
						// // 判断是否存在code
						if (code == null || code == '') {
							// 重新获取code
							const base_url = encodeURIComponent(
								'https://www.ok9288.com/mobile/pagesB/login/login?delta=1');
							const wx_url =
								// 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7daf1d30f51f1fe&redirect_uri=' + base_url + '&response_type=code&scope=snsapi_userinfo&state=123'+'&shopId=' + that.shopId + '#wechat_redirect'
								'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0b4564de207d9a5f&redirect_uri=' +
								base_url + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
							window.location.href = wx_url;
							return
						} else {
							// 发送code
							that.handleToLogin(code);
						}
					}
				}
				// #endif
				// #ifdef APP-PLUS
				 // 检查网络状态
				        const isOnline = await this.checkNetwork();
				        if (!isOnline) {
				          uni.showToast({ title: '网络不可用，请检查连接', icon: 'none' });
				          return;
				        }
				uni.login({
					provider: value,
					success: (res) => {
						if (value === 'apple') {
							console.log('[苹果登录] uni.login 返回:', JSON.stringify(res, null, 2));
						}
						uni.setStorageSync("isLogin", 1)
						uni.showLoading({
							title: this.$t('lang.synchronous_login')
						});
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								if (value === 'apple') {
									console.log('[苹果登录] uni.getUserInfo 返回:', JSON.stringify(infoRes, null, 2));
								}
								uni.setStorage({
									key: 'scopeUserInfo',
									data: infoRes.userInfo
								});

								// 验证授权用户
								let data = {
									userInfo: infoRes.userInfo,
									type: value,
									platform: uni.getStorageSync('platform')
								}
								if (value === 'apple') {
									console.log('[苹果登录] 发起请求参数:', JSON.stringify(data, null, 2));
								}
								this.$store.dispatch("userCallback", data).then(result => {
									uni.hideLoading();
									if (value === 'apple') {
										console.log('[苹果登录] 后端返回参数:', result);
										console.log('[苹果登录] 后端返回 result.data:', result && result.data);
									}
									if (result.status == 'success') {
										console.log(result)
										if (result.data.login === 1) {
											uni.setStorageSync("token", result.data.token)
											// 如果来自新人优惠券页面，登录成功后跳转到首页而不是返回
											if (this.fromNewPerson) {
												uni.switchTab({
													url: '/pages/middles/middles'
												})
											} else if (this.delta) {
												uni.navigateBack({
													delta: 1
												})
											} else {
												uni.switchTab({
													url: '/pages/user/user'
												})
											}
										} else {
											let o = {
												type: result.data.type,
												unionid: result.data.unionid,
												platform: uni.getStorageSync(
													'platform')
											}
											//是否去绑定会员
											if (result.data.code == 42201) {
												uni.showModal({
													content: result.data.msg,
													cancelText: '跳过',
													confirmText: '去绑定',
													success: (modelResult) => {
														if (modelResult
															.confirm) {
															uni.navigateTo({
																url: '/pagesB/login/bindUser/bindUser?params=' +
																	JSON
																	.stringify(
																		o
																	) +
																	'&delta=' +
																	this
																	.delta
															})
														} else if (modelResult
															.cancel) {
															//添加跳过参数
															o.step = 0;
															uni.showLoading({
																title: this
																	.$t(
																		'lang.login_loading'
																	)
															});
															this.$store
																.dispatch(
																	'bindRegister',
																	o).then(
																	bindResult => {
																		uni
																			.hideLoading();
																		if (bindResult
																			.status ==
																			'success'
																		) {
																			if (bindResult
																				.data
																				.login ===
																				1
																			) {
																				uni.setStorageSync(
																					"token",
																					bindResult
																						.data
																						.token
																				);
																				// 如果来自新人优惠券页面，登录成功后跳转到首页而不是返回
																				if (this.fromNewPerson) {
																					uni.switchTab({
																						url: '/pages/middles/middles'
																					})
																				} else if (this
																					.delta
																				) {
																					uni.navigateBack({
																						delta: 1
																					})
																				} else {
																					uni.switchTab({
																						url: '/pages/user/user'
																					})
																				}
																			}
																		} else {
																			uni.showModal({
																				content: bindResult
																					.errors
																					.message ||
																					'error'
																			})
																		}
																	});
														}
													}
												})
											}
										}
									} else {
										uni.showToast({
											title: result.errors.message ||
												'error',
											icon: 'none'
										});
									}
								})
							},
							fail: (infoRes) => {
								uni.showToast({
									title: this.$t('lang.authorization_fail_notic'),
									icon: 'none'
								});
							}
						})
					},
					fail: (res) => {
						console.log(res)
					}
				})
				// #endif

			},
			shopConfig() {
				uni.request({
					url: `${this.websiteUrl}/api/shop/config`,
					method: 'GET',
					data: {
						app_version: incrementVersion()
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						this.configData = data;

						this.register_article_id = data.register_article_id;
					}
				});
			},
			linkHref() {
				if (this.register_article_id) {
					uni.navigateTo({
						url: '/pagesC/article/detail/detail?id=' + this.register_article_id + '&show=false'
					})
				} else {
					uni.showToast({
						title: this.$t('lang.set_privacy_policy'),
						icon: "none"
					})
				}
			},
			colseRegister() {
				uni.request({
					url: `${this.websiteUrl}/api/user/login_config`,
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						console.log(data)
						this.shop_reg_closed = data.shop_reg_closed
					}
				});
			},
			async privacyActicle() {
				if (this.configData) {
					uni.request({
						url: `${this.websiteUrl}/api/article/show`,
						method: 'POST',
						data: {
							id: this.register_article_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: ({
							data
						}) => {
							if (data.status == 'success') {
								this.privacyActicleContent = data.data.content;
								this.privacyActicleTitle = data.data.title;
							} else {
								uni.showToast({
									title: '未设置隐私协议',
									icon: "none"
								});
							}
						}
					});
				}
			},
			sendVerifyCode() {
				let o = {
					// captcha: this.imgverifyValue, // 【已注释】旧的图形验证码，现在使用阿里验证码
					client: this.client,
					mobile: this.mobile
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
			onClickBack() {
				
				uni.switchTab({
					url: '/pages/middles/middles'
				})
			},
				getArticleId(urlStr) {
				  try {
				    // 兼容性解析 URL
				    const urlParts = urlStr.split(/[?#]/)[0]; // 移除哈希和查询部分
				    const path = urlParts.split('/').pop();    // 获取路径末尾部分（如 'article.php' 或 'article-280.html'）
				    const queryString = urlStr.split('?')[1] || '';
				
				    // 解析查询参数
				    const queryParams = {};
				    queryString.split('&').forEach(pair => {
				      const [key, value] = pair.split('=');
				      if (key) queryParams[key] = decodeURIComponent(value || '');
				    });
				
				    // 方式1：优先从查询参数获取
				    if (queryParams.id) {
				      return Number(queryParams.id);
				    }
				
				    // 方式2：从路径中提取（备用方案）
				    const pathMatch = path.match(/-(\d+)(\.html)?/);
				    if (pathMatch) {
				      return Number(pathMatch[1]);
				    }
				
				    throw new Error('未找到有效文章ID');
				  } catch (error) {
				    console.error('解析失败:', error);
				    return 0; // 或返回 null/undefined
				  }
				},
			toTrain: function() {
				// let url = 'https://www.ok9288.com/article.php?id=280' 
				this.articleId = this.getArticleId('https://www.ok9288.com/article.php?id=280')
				// this.articleId = url.match(/-(\d+)\./)[1]
				console.log(1333, this.url);
				this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				// uni.setStorageSync("url", 'https://www.ok9288.com/article.php?id=280');
				// uni.setStorageSync("webtitle", '隐私政策');
				// uni.navigateTo({
				// 	url: '/pagesB/webviews/webviews'
				// });
				
			},
			toAgreement: function() {
				let url = 'https://www.ok9288.com/article-12.html' 
			
				this.articleId = url.match(/-(\d+)\./)[1]
				console.log(1333, this.articleId);
				this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				
				// uni.setStorageSync("url", 'https://www.ok9288.com/article-12.html');
				// uni.setStorageSync("webtitle", '用户协议');
				// uni.navigateTo({
				// 	url: '/pagesB/webviews/webviews'
				// });
			},

			// todo 一键登录
			oneClickLogin: function(fromAgreement) {
				var that = this
				const MAX_RETRIES = 3; // 最大重试次数
				  let retryCount = 0;
				  let isRetrying = false;
				if (!fromAgreement && !that.checked) {
					this.pendingLoginPayload = { type: 'oneclick' }
					this.showAgreementPopup = true
					return
				}
				// #ifndef APP-PLUS
				uni.showToast({
					title: '请在 App 内使用本机号码一键登录',
					icon: 'none'
				})
				return
				// #endif
				if (uni.getSystemInfoSync().platform == "ios") {
					console.log(uni.getSystemInfoSync().platform == "ios")
					// jv.setCustomUIWithConfigiOS(JVerifyUIConfig)
					jv.setCustomUIWithConfigiOS({
						navColor: 0xff5C93FF,
						logBtnText: " 庆趣一键登录 ",
						logBtnTextColor: 0xff5C93FF,
						privacyState: true,
						appPrivacyColor: [0xff000000, 0xff5C93FF]
					})
				} else {
					console.log('else ')
					// 设置一个 config 时应用全部
					// jv.setCustomUIWithConfigAndroid(JVerifyUIConfig)
					// 设置两个 config 时，前者应用与竖屏配置，后者应用与横屏配置
					// jv.setCustomUIWithConfigAndroid(JVerifyUIConfig,JVerifyUIConfig)
					jv.setCustomUIWithConfigAndroid({
						setNavColor: 0xff5C93FF,
						setLogBtnText: " 庆趣一键登录 ",
						logBtnTextColor: 0xff5C93FF,
						setPrivacyState: true,
						setAppPrivacyColor: [0xff000000, 0xff5C93FF]
					})
				}
				
				const attemptLogin = () => {
				uni.showLoading({
					title: '正在加载~'
				})
				setTimeout(function() {
					jv.loginAuth({
						autoFinish: true,
						timeout: 10000
					}, result => {
						// 结果监听
						uni.hideLoading()
						console.log(result)
						let code = result.code;
						let loginToken = result.content;
						let operator = result.operator;

						if (code == 2000 || code == 6000) {
							uni.showLoading({
								title: '登陆中~'
							})
							uni.request({
								url: 'https://www.ok9288.com/api/user/oneclickphone',
								method: 'POST',
								data: {
									"loginToken": loginToken
								},
								header: {
									'Content-Type': 'application/json',
									// 'token': uni.getStorageSync('token'),
									// 'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									console.log(res.data)
									if (res.data.status == 'success') {
										uni.request({
											url: 'https://www.ok9288.com/api/user/oneclicklogin',
											method: 'POST',
											data: {
												"mobile": res.data.data.mobile,
												'parent_id': this.parent_id,
											},
											header: {
												'Content-Type': 'application/json',
												// 'token': uni.getStorageSync('token'),
												// 'X-Client-Hash': uni.getStorageSync('client_hash')
											},
											success: (res_1) => {
												// console.log('one11',this.parent_id);
												// console.log('one',res_1.data)
												uni.hideLoading()
												if (res_1.data.status ==
													'success') {
													uni.showToast({
														title: '登陆成功',
														icon: 'none'
													})
													setTimeout(function() {
														uni.setStorage({
															key: 'token',
															data: res_1
																.data
																.data,
															success: (
																res_2
															) => {
																uni.switchTab({
																	url: '/pages/user/user'
																});
															}
														});
													}, 500);
												} else {
													uni.showToast({
														title: res_1
															.data
															.message,
														icon: 'none'
													})
												}
											}
										})
									} else {
										uni.showToast({
											title: res.data.message,
											icon: 'none'
										})
									}
								}
							})
						} else if (code == 2016) {
							uni.showToast({
								title: '请打开移动数据网络',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: result.operator,
								icon: 'none'
							})
						}

					}, event => {
						// 事件监听
						let code = event.code;
						let eventDesc = event.content;
					})
				}, 500);
			};
			 // 处理登录失败
			  const handleLoginFailure = (errorResult) => {
			    if (retryCount < MAX_RETRIES && !isRetrying) {
			      isRetrying = true;
			      retryCount++;
			      
			      uni.showToast({
			        title: `登录失败，正在重试 (${retryCount}/${MAX_RETRIES})`,
			        icon: 'none',
			        duration: 1500
			      });
			      
			      setTimeout(() => {
			        isRetrying = false;
			        attemptLogin(); // 重新尝试登录
			      }, 1500);
			    } else {
			      // 最终失败处理
			      uni.showToast({
			        title: '网络环境异常，请更换登录方式',
			        icon: 'none',
			        duration: 3000
			      });
			    }
			  };
			  // 开始登录尝试
			    attemptLogin();
			},
		}
	}
</script>

<style lang="scss">
	/* 禁止页面横向拖动；与登录页同一渐变，避免底部露 default 背景色条 */
	page {
		overflow-x: hidden !important;
		width: 100%;
		max-width: 100%;
		min-height: 100%;
		background: linear-gradient(180deg, #FFD4C8 0%, #FFF5E8 100%);
	}
</style>
<style lang="scss" scoped>
	/* 禁止整页横向拖动，只一屏显示 */
	.container-bwg {
		overflow-x: hidden;
		width: 100%;
		max-width: 100vw;
		min-height: 100vh;
		box-sizing: border-box;
	}
	/*
	 * 非微信登录 UI：350 宽设计稿 → rpx = round(px * 750 / 350)
	 * 对齐 quhaoma-login (1).html
	 */
	.container-login {
		background: linear-gradient(180deg, #FFD4C8 0%, #FFF5E8 100%);
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow-x: hidden;
		width: 100%;
		max-width: 100%;

		.login-hero {
			background: transparent;
			padding: 214rpx 64rpx 86rpx;
			position: relative;
			box-sizing: border-box;
			flex-shrink: 0;
		}
		.promo-section {
			margin-bottom: 43rpx;
		}
		.promo-label {
			font-size: 30rpx;
			color: #666;
			margin-bottom: 17rpx;
		}
		.promo-highlight {
			color: #333;
			font-weight: 600;
		}
		.promo-title {
			font-size: 77rpx;
			font-weight: bold;
			color: #1a1a1a;
			margin-bottom: 17rpx;
			line-height: 1.2;
		}
		.promo-subtitle {
			font-size: 28rpx;
			color: #999;
		}
		.red-envelope {
			position: absolute;
			right: 43rpx;
			top: 257rpx;
			width: 300rpx;
			height: 300rpx;
			pointer-events: none;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.red-envelope-card {
			width: 189rpx;
			height: 129rpx;
			border-radius: 21rpx;
			background: linear-gradient(135deg, #ff6b6b 0%, #d23328 100%);
			transform: rotate(-14deg);
			box-shadow: 0 13rpx 26rpx rgba(210, 51, 40, 0.25);
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
		}
		.red-envelope-coin {
			width: 69rpx;
			height: 69rpx;
			border-radius: 50%;
			background: #ffd700;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.red-envelope-yen {
			font-size: 34rpx;
			font-weight: bold;
			color: #d23328;
			line-height: 1;
		}
		.login-header-pwd {
			padding: 189rpx 64rpx 51rpx;
			text-align: center;
			background: transparent;
			flex-shrink: 0;
		}
		.login-header-pwd .page-title {
			font-size: 51rpx;
			font-weight: bold;
			color: #1a1a1a;
		}

		.back-btn {
			position: absolute;
			top: 107rpx;
			left: 43rpx;
			width: 86rpx;
			height: 86rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
			color: #333;
			font-size: 51rpx;
		}

		/* 对应 HTML .container：flex:1 + 上圆角 + padding 40px 24px 30px */
		.login-content-wrap {
			flex: 1;
			display: flex;
			flex-direction: column;
			width: 100%;
			background: #f8f8f8;
			border-radius: 51rpx 51rpx 0 0;
			margin-top: 0;
			box-sizing: border-box;
			min-height: 0;
			padding: 50rpx 51rpx calc(64rpx + env(safe-area-inset-bottom));
		}

		.login-form {
			flex: 0 0 auto;
			background: transparent;
			border-radius: 0;
			padding: 0;
			position: relative;
			margin-top: 0;
			box-sizing: border-box;

			.phone-input-group {
				background: #fff;
				border-radius: 26rpx;
				padding: 34rpx;
				margin-bottom: 34rpx;
				display: flex;
				align-items: center;
				gap: 26rpx;
			}
			.phone-prefix {
				font-size: 32rpx;
				color: #333;
				padding-right: 26rpx;
				border-right: 2rpx solid #e5e5e5;
				flex-shrink: 0;
			}
			.input-phone {
				flex: 1;
				border: none;
				font-size: 32rpx;
				color: #333;
				background: transparent;
				min-width: 0;
			}
			.input-phone::placeholder {
				color: #bfbfbf;
			}

			.input-group {
				background: white;
				border-radius: 26rpx;
				padding: 26rpx 34rpx;
				margin-bottom: 26rpx;

				.input {
					width: 100%;
					border: none;
					outline: none;
					font-size: 32rpx;
					color: #333;
					background: transparent;

					&::placeholder {
						color: #bfbfbf;
					}
				}
			}

			.password-group {
				background: white;
				border-radius: 26rpx;
				padding: 34rpx;
				margin-bottom: 26rpx;
				display: flex;
				align-items: center;
				gap: 26rpx;

				.input {
					flex: 1;
					border: none;
					outline: none;
					font-size: 32rpx;
					color: #333;
					background: transparent;

					&::placeholder {
						color: #bfbfbf;
					}
				}

				.eye-icon {
					cursor: pointer;
					width: 51rpx;
					height: 51rpx;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #999;
					font-size: 47rpx;
				}
				.eye-icon svg {
					display: block;
					width: 51rpx;
					height: 51rpx;
				}
			}

			.code-input-group {
				background: white;
				border-radius: 26rpx;
				padding: 34rpx;
				margin-bottom: 51rpx;
				display: flex;
				align-items: center;
				gap: 26rpx;

				.input {
					flex: 1;
					border: none;
					outline: none;
					font-size: 32rpx;
					color: #333;
					background: transparent;

					&::placeholder {
						color: #bfbfbf;
					}
				}

				.get-code-btn {
					font-size: 30rpx;
					color: #d23328;
					background: none;
					border: none;
					white-space: nowrap;
					flex-shrink: 0;
				}
			}

			.forgot-password {
				text-align: right;
				margin-bottom: 34rpx;

				.forgot-link {
					color: #d23328;
					font-size: 28rpx;
					text-decoration: none;
				}
			}

			/* HTML .login-btn：padding 16px，无固定 height */
			.login-btn {
				width: 100%;
				box-sizing: border-box;
				padding: 34rpx !important;
				line-height: 1.4 !important;
				min-height: 0 !important;
				height: auto !important;
				max-height: none !important;
				background: #d23328;
				color: white;
				border: none;
				border-radius: 26rpx;
				font-size: 34rpx;
				font-weight: 500;
				margin-bottom: 34rpx;

				&:active {
					opacity: 0.9;
				}

				&.btn-disabled {
					cursor: not-allowed;
					opacity: 0.4;
				}

				&.one-click-btn {
					margin-top: 0;
					margin-bottom: 34rpx;
				}
			}

			/* HTML #maskMode */
			.oneclick-mask-phone {
				text-align: center;
				font-size: 51rpx;
				letter-spacing: 9rpx;
				color: #333;
				margin: 64rpx 0;
				font-weight: 500;
				white-space: nowrap;
				overflow: hidden;
				width: 100%;
				box-sizing: border-box;
			}
			/* HTML .quick-login-text */
			.oneclick-link {
				text-align: center;
				color: #d23328;
				font-size: 30rpx;
				margin-bottom: 34rpx;
				padding: 0;
			}

			.register-link {
				text-align: center;
				margin-bottom: 26rpx;

				.register-link-text {
					color: #666;
					font-size: 30rpx;
					text-decoration: none;

					.register-link-red {
						color: #d23328;
					}
				}
			}

			.switch-login-mode {
				text-align: center;
				margin-bottom: 26rpx;

				.switch-btn {
					display: block;
					width: 100%;
					height: 120rpx !important;
					min-height: 120rpx !important;
					line-height: 120rpx !important;
					padding: 0 !important;
					color: #d23328;
					font-size: 34rpx;
					font-weight: 500;
					background: #fff;
					border: 2rpx solid #d23328;
					border-radius: 26rpx;
					cursor: pointer;
				}
			}

			/* HTML .privacy-agreement */
			.privacy-agreement {
				display: flex;
				align-items: flex-start;
				font-size: 26rpx;
				color: #999;
				line-height: 1.6;
				margin-bottom: 0;

				.privacy-checkbox {
					margin-right: 13rpx;
					margin-top: 4rpx;
					flex-shrink: 0;
					width: 30rpx;
					height: 30rpx;
					border: 2rpx solid #999;
					border-radius: 4rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					&.checked {
						background: #d23328;
						border-color: #d23328;

						.checkbox-icon-wrapper {
							.checkbox-checked {
								width: 13rpx;
								height: 21rpx;
								border-right: 4rpx solid #fff;
								border-bottom: 4rpx solid #fff;
								transform: rotate(45deg);
								box-sizing: border-box;
								position: relative;
								top: -6rpx;
								left: 0;
							}
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
						color: #333;
						text-decoration: none;
					}
				}
			}
		}

		/* HTML .divider */
		.login-divider {
			text-align: center;
			color: #999;
			font-size: 28rpx;
			margin: 86rpx 0 51rpx;
			line-height: 1.4;
		}

		/* HTML .other-login-methods */
		.other-login-methods {
			display: flex;
			justify-content: space-around;
			align-items: flex-start;
			padding: 0 43rpx;
			box-sizing: border-box;
			width: 100%;
		}

		/* HTML .login-method */
		.login-method {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 17rpx;
			flex: 1;
			min-width: 0;
		}

		/* 较小图标区（用户反馈 HTML 44px 过大） */
		.method-icon {
			width: 56rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.method-icon-img {
			width: 47rpx;
			height: 47rpx;
			display: block;
		}

		.method-label {
			font-size: 26rpx;
			color: #999;
			text-align: center;
			line-height: 1.3;
			width: 100%;

			&.label-weixin {
				color: #07c160;
			}

			&.label-apple {
				color: #000;
			}

			&.label-account,
			&.label-register {
				color: #999;
			}
		}
	}

	/* 服务协议及隐私保护弹窗 */
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

	/* 隐私协议 */
	.show-popup-privacy {
		.title {
			position: relative;
			justify-content: center;

			.iconfont {
				position: absolute;
				right: 30rpx;
			}
		}

		.article-content {
			height: calc(100% - 50px);
			padding: 0 20rpx;
			overflow-y: auto;
		}

		.footer {
			.btn {
				height: 40px;
				padding: 0;
				border-radius: 20px;
				line-height: 40px;
				background: linear-gradient(-88deg, #ff4f2e, #f91f28);
				font-size: 28rpx;

				&.btn-disabled {
					cursor: not-allowed;
					opacity: 0.4;
				}
			}
		}
	}

	/* 小程序登录 */
	.login-section {
		padding: 40% 0 0;

		.header {
			width: 160upx;
			height: 160upx;
			border-radius: 100%;
			overflow: hidden;
			margin: 0 auto 10upx;
			border: 3px solid #eee;
		}

		.user-name {
			text-align: center;
			font-size: 32upx;
			margin: 0 60upx 0;
			padding-bottom: 50upx;

			&:before {
				content: " ";
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				height: 1px;
				border-bottom: 1px solid #e5e5e5;
				color: #e5e5e5;
				-webkit-transform-origin: 0 0;
				transform-origin: 0 0;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				z-index: 1;
			}
		}

		.cont {
			padding: 40upx 60upx;
			font-size: 30upx;
			color: #999;
			text-align: center
		}

		.btn {
			margin: 30upx 60upx 50upx 60upx;

			button {
				padding: 0;
				font-size: 32upx;
				color: #fff;
				border-radius: 50upx;
				border: 0 !important;

				&::after {
					content: " ";
					width: 0;
					height: 0;
					position: absolute;
					top: 0;
					left: 0;
					border: none;
					-webkit-transform: scale(0);
					transform: scale(0);
					-webkit-transform-origin: 0 0;
					transform-origin: 0 0;
					box-sizing: border-box;
					border-radius: 0;
				}
			}
		}
	}
</style>
