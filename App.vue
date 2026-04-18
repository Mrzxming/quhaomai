
<script>
	import Vue from 'vue'
	import * as localConfig from './config/local/config';
	 
	//#ifdef APP-PLUS
	var jpushModule = uni.requireNativePlugin("JG-JPush")
	//#endif

	// #ifdef MP-WEIXIN
	//daqin 注释掉直播
	//let livePlayer = requirePlugin('live-player-plugin')
	// #endif
	export default {
	 
		globalData: {
			mpName: "庆趣",
			mpVersionName: "2.7.2",
			mpVersionCode: 271,
			integration: 0,
			isShowCart: false,
			navigationBarHeight: 0,
			defaultImageUrl: 'https://images.eqingqu.com/attachs/photo/202404/20240416_050DB5336B33DA80AAC9A9A036D9FE25.png',
			// 冷启动后首页首屏数据加载成功且未登录时，是否自动跳转登录（仅触发一次，从登录页返回后不再跳转）
			autoPromptLoginOnHome: true
		},
		onLaunch: async function(e) {
			console.log('e', e);
			console.log(JSON.stringify(e) + 'onlaunch');
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			const wgtinfo = uni.getStorageSync('wgtinfo');
			//获取shopConfig
			this.$store.dispatch('setShopConfig');

			//获取购物车数量
			//this.$store.dispatch('setCommonCartNumber');
			// uni.onTabBarMidButtonTap(()=>{
			//    uni.navigateTo({
			// 	url: '/pagesD/integration/integration'
			//    });
			// })
			let platform = '';
			//#ifndef MP-WEIXIN
			platform = 'APP';
			//#endif
			//#ifdef MP-WEIXIN
			platform = 'MP-WEIXIN';
			//#endif
			uni.setStorageSync('platform', platform)

			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				console.log('储存wgtinfo',wgtinfo)
				uni.setStorageSync('wgtinfo', JSON.stringify(wgtinfo))
			})

			// 设置默认图片
			// uni.setDefaultImage(this.defaultImageUrl);

			//运行环境
			// if(process.env.NODE_ENV !== 'development'){
			// 	//隐私声明和引导广告
			// 	let roles,configData,configPrivacy,privacy;

			// 	//接口返回config
			// 	configData = await this.$store.dispatch('setShopConfig',{type:true});

			// 	//后台设置隐私协议文章id和版本号
			// 	configPrivacy = configData.data.privacy;

			// 	//获取本地存储隐私协议
			// 	privacy = uni.getStorageSync('privacy') ? JSON.parse(uni.getStorageSync('privacy')) : '';

			// 	//获取设备信息
			// 	const platform = uni.getSystemInfoSync().platform;

			// 	if(platform == 'ios'){
			// 		if(privacy.article_id == configPrivacy.article_id && privacy.version_code == configPrivacy.version_code){
			// 			uni.redirectTo({ url:"/pages/guide/guide" });
			// 		}else{
			// 			uni.redirectTo({ url:"/pagesC/privacy/privacy" });
			// 		}
			// 	}
			// }
			// #endif
			if (uni.getStorageSync('token') != '' && uni.getStorageSync('token') != undefined) {
				console.log(55551, );
				//#ifdef APP-PLUS
				plus.runtime.setBadgeNumber(0);
				if (uni.getSystemInfoSync().platform == "ios") {
					// 请求定位权限
					let locationServicesEnabled = jpushModule.locationServicesEnabled()
					let locationAuthorizationStatus = jpushModule.getLocationAuthorizationStatus()
					// console.log('locationAuthorizationStatus',locationAuthorizationStatus)	
					if (locationServicesEnabled == true && locationAuthorizationStatus < 3) {
						jpushModule.requestLocationAuthorization((result) => {
							console.log('定位权限', result.status)
						})
					}

					jpushModule.requestNotificationAuthorization((result) => {
						console.log('tongzhi')

						let status = result.status
					// 【恢复】检查是否已经显示过弹窗，如果已显示过，不再显示 toast
					const hasShownModal = uni.getStorageSync('notification_modal_shown');
					if (status < 2 && !hasShownModal) {
							// uni.showToast({
							// 	icon: 'none',
							// 	title: '您还没有打开通知权限',
							// 	duration: 3000
							// })
						uni.setStorageSync('notification_modal_shown', true);
						}
					})

					jpushModule.addGeofenceListener(result => {
						console.log(result)
						let code = result.code
						let type = result.type
						let geofenceId = result.geofenceId
						let userInfo = result.userInfo
					})
				}
				jpushModule.initJPushService();
				jpushModule.getRegistrationID(result => {
					console.log(5555555, result);
					console.log(result.registerID)
				})
				jpushModule.addConnectEventListener(result => {
					console.log(111333, result)
					let connectEnable = result.connectEnable
				})

				jpushModule.addNotificationListener(result => {
					console.log(1111, result)
					console.log('极光推送1232331231', result)
					let notificationEventType = result.notificationEventType
					let messageID = result.messageID
					let title = result.title
					let content = result.content
					let extras = result.extras
					if (notificationEventType == 'notificationArrived') {
						console.log('112-1');
					}
					if (notificationEventType == 'notificationOpened') {
						console.log('112-2');
						const pages = getCurrentPages();
						const needHomeFirst = pages.length < 2;
						const goAfterHome = (fn) => {
							if (needHomeFirst) {
								uni.reLaunch({ url: '/pages/middles/middles', success: () => { fn(); } });
							} else {
								fn();
							}
						};
						if (extras.jump_type == 'html') {
							function getParams(url) {
								const search = url.split('?')[1];
								if (!search) return {};
								const paramArr = search.split('&');
								const paramObj = {};
								for (const param of paramArr) {
									const [key, value] = param.split('=');
									paramObj[key] = value;
								}
								return paramObj;
							}
							const aa = getParams(extras.url);
							goAfterHome(() => { this.$outerHref('/pagesC/article/detail/detail?id=' + aa.id, 'app'); });
						}
						console.log('这是extras的值-----=========-----',extras)
						if (extras.jump_type == 'goodsdetail') {
							goAfterHome(() => { uni.navigateTo({ url: extras.url }); });
						}
						if (extras.jump_type == 'app') {
							goAfterHome(() => { uni.navigateTo({ url: extras.url }); });
						}
						if (extras.type == 'fahuo') {
							goAfterHome(() => { uni.navigateTo({ url: '/pagesB/order/order' }); });
						} else if (extras.type == 'im') {
							console.log(2223333, );
							uni.switchTab({
								url: '/pages/chat/chat'
							})
						} else if (extras.type == 'h5') {
							if (extras.jump_type == 'html') {
								uni.setStorageSync("url", extras.url);
								function getParams(url) {
									const search = url.split('?')[1];
									if (!search) return {};
									const paramArr = search.split('&');
									const paramObj = {};
									for (const param of paramArr) {
										const [key, value] = param.split('=');
										paramObj[key] = value;
									}
									return paramObj;
								}
								const aa = getParams(extras.url);
								goAfterHome(() => { this.$outerHref('/pagesC/article/detail/detail?id=' + aa.id, 'app'); });
							}
						} else if (extras.type == 'shangmenqujian') {
							const encodedParams = encodeURIComponent(JSON.stringify(extras));
							goAfterHome(() => { uni.navigateTo({ url: `/pagesB/express/expressWait?params=${encodedParams}` }); });
						} else if (extras.type == 'shouhou') {
							goAfterHome(() => { uni.navigateTo({ url: '/pagesB/afterSales/afterSales' }); });
						}
					}
				})
				jpushModule.setMaxGeofenceNumber(20)
				jpushModule.setBadge(0)
				jpushModule.addCustomMessageListener(result => {
					console.log(result)
					let type = result.type
					let messageType = result.messageType
					let content = result.content
				})

				jpushModule.addLocalNotificationListener(result => {
					console.log(4444, result)
					let messageID = result.messageID
					let title = result.title
					let content = result.content
					let extras = result.extras
					const pages = getCurrentPages();
					const needHomeFirst = pages.length < 2;
					const goAfterHome = (fn) => {
						if (needHomeFirst) {
							uni.reLaunch({ url: '/pages/middles/middles', success: () => { fn(); } });
						} else {
							fn();
						}
					};
					if (extras.type == 'fahuo') {
						goAfterHome(() => { uni.navigateTo({ url: '/pagesB/order/order' }); });
					} else if (extras.type == 'im') {
						console.log(2223333, );
						uni.switchTab({
							url: '/pages/chat/chat'
						})
					} else if (extras.type == 'h5') {
						if (extras.jump_type == 'html') {
							uni.setStorageSync("url", extras.url);
							function getParams(url) {
								const search = url.split('?')[1];
								if (!search) return {};
								const paramArr = search.split('&');
								const paramObj = {};
								for (const param of paramArr) {
									const [key, value] = param.split('=');
									paramObj[key] = value;
								}
								return paramObj;
							}
							const aa = getParams(extras.url);
							goAfterHome(() => { this.$outerHref('/pagesC/article/detail/detail?id=' + aa.id, 'app'); });
						}
					}
					// uni.switchTab({
					// 	url: '/pages/chat/chat'
					// })
				})
				//#endif
			} else {
				console.log(555552);
				console.log('------------------------------------------------------')
			}
			//#ifdef MP-WEIXIN
			if (!uni.getStorageSync('userRegion')) this.$store.dispatch('getLocation')
			uni.setStorageSync('wgtinfo', JSON.stringify({
				name: '庆趣',
				version: '2.7.3'
			}));
			
			// 小程序版本更新管理器
			const updateManager = uni.getUpdateManager()
			
			// 监听新版本下载完成事件
			updateManager.onUpdateReady(() => {
				// 新版本下载完成，提示用户重启
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					showCancel: true,
					cancelText: '稍后',
					confirmText: '确定',
					success: (res) => {
						if (res.confirm) {
							// 用户点击确定，应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})
			
			// 监听新版本下载失败事件
			updateManager.onUpdateFailed(() => {
				// 新版本下载失败，提示用户
				uni.showModal({
					title: '更新失败',
					content: '新版本下载失败，请检查网络后重试，或删除小程序后重新打开',
					showCancel: false,
					confirmText: '知道了'
				})
			})
			
			// 检测是否有新版本
			updateManager.onCheckForUpdate((res) => {
				if (res.hasUpdate) {
					console.log('检测到新版本，开始下载...')
					// 有新版本，会自动触发下载
					// 下载完成后会触发 onUpdateReady 回调
				}
			})
			// #endif
		},
		onShow: async function(e) {
			// #ifdef MP-WEIXIN
			console.log(JSON.stringify(e) + 'onshow');
			// 小程序直播分享
			if (e.scene == 1007 || e.scene == 1008 || e.scene == 1044) {
				livePlayer.getShareParams().then(res => {
					uni.setStorageSync("parent_id", res.custom_params.parent_id);
				})
			}

			// 场景值
			uni.setStorageSync("scene", e.scene);
			// #endif

			//#ifdef APP-PLUS
			let args = plus.runtime.arguments;

			if (args) {
				let url = args.split('//')[1];
				if (url) {
					let obj = {},
						index = url.indexOf('?'),
						params = url.substr(index + 1);

					//url转换为json对象
					if (index != -1) {
						let parr = params.split('&');
						for (let i of parr) {
							let arr = i.split('=');
							obj[arr[0]] = arr[1];
						}
					}
				}
			}
			//#endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		onShow: function() {
			// #ifdef APP-PLUS
			// iOS：应用从后台恢复时，通知 tabbar 重新计算安全区域
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'ios') {
				// 延迟触发，确保系统信息已准备好
				setTimeout(() => {
					uni.$emit('app-show');
				}, 100);
			}
			// #endif
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./common/css/iconfont.css";
	@import "./common/css/uni.css";
	@import "./common/css/common.css";
	@import "./common/css/new_common.css";

	/* start--Retina 屏幕下的 1px 边框--start */
	.u-border,
	.u-border-bottom,
	.u-border-left,
	.u-border-right,
	.u-border-top,
	.u-border-top-bottom {
		position: relative
	}

	.u-border-bottom:after,
	.u-border-left:after,
	.u-border-right:after,
	.u-border-top-bottom:after,
	.u-border-top:after,
	.u-border:after {
		/* #ifndef APP-NVUE */
		content: ' ';
		/* #endif */
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		box-sizing: border-box;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		// 多加0.1%，能解决有时候边框缺失的问题
		width: 199.8%;
		height: 199.7%;
		transform: scale(0.5, 0.5);
		border: 0 solid #e4e7ed;
		z-index: 2;
	}

	.u-border-top:after {
		border-top-width: 1px
	}

	.u-border-left:after {
		border-left-width: 1px
	}

	.u-border-right:after {
		border-right-width: 1px
	}

	.u-border-bottom:after {
		border-bottom-width: 1px
	}

	.u-border-top-bottom:after {
		border-width: 1px 0
	}

	.u-border:after {
		border-width: 1px
	}

	/* end--Retina 屏幕下的 1px 边框--end */

	/* #ifdef H5 */
	/* 【H5 全局兜底】阿里图形验证码 SDK 默认按钮 / 容器 / 遮罩全部隐藏。
	   项目采用"按需初始化 + 验证成功自动弹窗 + 页面销毁清 DOM"模式，
	   SDK 自带 default trigger (.captcha4_btn_click) 在任何页面都不该出现。
	   该规则作为 JS 隐藏失败时的最后防线，防止首页/详情页等看到残留按钮。 */
	.captcha4_btn_click,
	.captcha4_holder,
	.captcha4_mask,
	[class*="captcha4_btn"],
	[class^="captcha4_holder"],
	[class^="captcha4_nextReady"] {
		display: none !important;
		visibility: hidden !important;
		pointer-events: none !important;
		width: 0 !important;
		height: 0 !important;
		overflow: hidden !important;
	}
	/* 验证码弹窗本身仍需展示（用户点"发送验证码"时由 SDK 主动 show），不能误隐藏 */
	.captcha4_popup_wrap,
	.captcha4_popup_wrap *,
	[class*="captcha4_popup"] {
		display: initial !important;
		visibility: visible !important;
		pointer-events: auto !important;
	}
	/* #endif */
</style>