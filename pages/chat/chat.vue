<template>
	<view class="container">
		<view class="u-page__item">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<!-- 这里是状态栏 -->
			<view class="status_bar" style="height: 40px;"></view>
			<!-- #endif -->
			<!-- <view class=" " @click="todemo">
				开始
			</view> -->
			<view class="chat_1" :style="{ height: gaodu + 'px' }">
				<view class="chat-header-content">
					<view class="chat_2">
						<view class="chat-title">消息</view>
					</view>
					<view class="chat_2_1" @click="navigateToReadAllshop">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_4723346DB7D9D557E38DACF6994FEF46.png"
							class="chat-read-icon"></image>
						<view class="chat-read-text">全部已读</view>
					</view>
				</view>

				<!-- <view class="chat_2">
					<uni-icons type="search" size="20" :color="tFontColor"></uni-icons>
				</view> -->
			</view>
		</view>
		<!-- <navigator url="/pagesB/demo">kaishi </navigator> -->
		<!-- <view style="height: 184rpx;background-color: #f0f1f3;"></view> -->
		<view class="list-scroll-content">
			<view id="top"></view>
			<x-skeleton :configs="configs" :loading="loading1" class="pd-bottom">
			<block v-if="isShowList==true">
				<block v-if="sessions.length > 0">
					<view class="cart-goods-item" v-for="(item,index) in sessions" :key="getSessionKey(item, index)">
						<uni-swipe-action v-if="isShopSession(item)" class="swipe-action-wrapper">
							<uni-swipe-action-item :right-options="options" @click="deleteCartGoods(item.id)">
								<view class="scroll-view-item scroll-view-item-left">
									<view class="cart-goods-info">
									<view class="goods-img" @click="toShopHome(item)">
										<i v-if="item.unread==true"></i>
										<image :src="item.shop_logo" class="image"></image>
									</view>
									<view class="cart-goods-contents"
										@click="onChats(item.shop_name, item.goods_id, (item.shop_id != null && item.shop_id !== '') ? item.shop_id : item.store_id, item.uuid, index)">
										<view class="cart-goods-tit">
											<view class="goods-title">{{item.shop_name}}</view>
											<view class="goods-time">{{item.last_time}}</view>
										</view>
										<view class="goods-infos">{{item.last_message}}</view>
									</view>
								</view>
							</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
						<view v-else @click="toMessages" class="scroll-view-item scroll-view-item-left">
							<view class="cart-goods-info">
									<view class="goods-img">
										<i v-if="item.unread==true"></i>
										<image :src="item.shop_logo" class="image"></image>
									</view>
									<view class="cart-goods-contents">
										<view class="cart-goods-tit">
											<view class="goods-title">{{item.shop_name}}</view>
											<view class="goods-time">{{item.last_time}}</view>
										</view>
										<view class="goods-infos">{{item.last_message}}</view>
									</view>
								</view>
							</view>
					</view>
					<!-- 消息列表改为一次性全量返回，不再分页加载，因此去掉底部 loading 组件 -->
					<!-- <uni-load-more :status="loadMoreStatus" :content-text="contentText" /> -->
					<view style="height: 30rpx;"></view>
				</block>
				<block v-else-if="loadMoreStatus=='loading'">
					<uni-load-more :status="loadMoreStatus" :content-text="contentText"
						v-if="page > 0 && showLoadMore" />
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</block>
			<block v-else>
				<view class="not-content">
					<view class="notimg">
						<image src="https://www.ok9288.com/img/no_content.png" class="img"></image>
					</view>
					<view class="cont">亲，您还没有登录哦</view>
					<view class="conts" @click="toLogin">去登录</view>
				</view>
			</block>
			</x-skeleton>
		</view>
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<!--返回顶部-->
		<!-- <dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top> -->
		<!-- <zdy-tabbar :current-page="2"></zdy-tabbar> -->
		<!-- <tab-bar :currentPage="1"></tab-bar> -->
	<custom-tabbar />
	
	<!-- 通知权限弹窗 - 底部弹出 -->
	<view v-if="ispush" class="notification-modal-wrapper">
		<view class="notification-modal-backdrop" @click="ispushNo" catchtouchmove="true"></view>
		<view class="notification-modal-bottom">
			<view class="notification-modal-title">及时获取客服消息</view>
			<view class="notification-modal-content-wrapper">
				<view class="notification-modal-bg">
					<image class="notification-modal-bg-image" src="https://images.eqingqu.com/attachs/photo/202601/20260116_B64EDFBD317C89213C60F9DD17469A4E.png" mode="aspectFit"></image>
					<view class="notification-modal-card">
						<view class="notification-modal-content-inner">
							<image class="notification-modal-logo" src="https://images.eqingqu.com/attachs/photo/202601/20260116_AB4A05FC4E445DE73027804B2529C0FA.png" mode="aspectFit"></image>
							<view class="notification-modal-text-wrapper">
								<view class="notification-modal-shop-name-wrapper">
									<view class="notification-modal-shop-name">趣好卖</view>
									<text class="notification-modal-time">现在</text>
								</view>
								<view class="notification-modal-desc">第一时间接收客服/订单物流消息</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="notification-modal-actions-bottom">
				<view class="notification-modal-btn-primary" @click="ispushYes">去开启</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	/** 消息列表磁盘缓存 TTL（与接口对齐策略一致：过期仍可展示，靠 getNewList/goodsList 静默刷新） */
	const CHAT_SESSIONS_TTL_MS = 3 * 60 * 1000

	import dscNotContent from '@/components/dsc-not-content.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import tabbar from "@/components/zdy-tabbar/zdy-tabbar.vue";
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'; 
	export default {

		components: {
			dscNotContent,
			tabbar,
			uniIcons,
			uniLoadMore,
			dscFilterTop,
			CustomTabbar
		},
		data() {
			return {
				configs:{
					padding: '30rpx',
					gridRows: 11,
					gridColumns: 1,
					gridRowsGap: '50rpx',
					gridColumnsGap: '24rpx',  
					itemDirection: 'row',
					itemGap: '30rpx',
					itemAlign: 'flex-start',
					headShow: true,
					headWidth: '100rpx',
					headHeight: '100rpx',
					headBorderRadius: '8rpx',
					textShow: true,
					textRows: 2,
					textRowsGap: '30rpx',
					textWidth: ['50%', '100%', ],
					textHeight: ['40rpx', '24rpx', ],
					textBorderRadius: '6rpx',
				},
				// 左滑删除配置
				options: [{
					text: this.$t('lang.delete'),
					style: {
						backgroundColor: '#f92028'
					}
				}],
				loading1:true,
				page: 1,
				scrollLeft: 0,
				sessions: [],
				dscLoading: true,
				tFontColor: '#999',
				// 消息列表改为一次性全量返回，不再分页加载；始终视为“没有更多”
				loadMoreStatus: 'noMore',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				scrollState: false,
				kefuLoginData: null,
				is_open_socket: false,
				state: null,
				socketTask: null,
				isConnectingSocket: false, // 防止并发建链
				reconnectTimer: null, // 重连定时器单例
				heartbeatTimer: null, // 心跳定时器单例
				isLoadingSessions: false,  // 标记是否正在加载会话列表，防止重复调用
				pollingTimer: null, // 轮询定时器单例
				pollingInterval: 1000, // 轮询间隔（毫秒）
				isFetchingNewList: false, // getNewList 并发锁
				lastNewListTs: 0, // getNewList 最后调用时间
				newListMinInterval: 1200, // getNewList 最小间隔
				contentTop: 0,

				scrollTop: 0,
				topItem: '', //返回顶部的标记点

				menuButtonInfo: {},
				gaodu: '',
				ispush: false, // 通知权限弹窗显示状态
				isShowList: true,
				showLoadMore: false,
				onelist: uni.getStorageSync('sessionlist'),
				isNavigating: false, // 防止重复跳转的标志位
				_lastChatCacheSuffix: null // 检测换账号，避免错读上一用户磁盘会话
			};
		},
		created() {
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})

			// #endif

		},
		onShow() {
		  // 通知 tabbar 更新状态
		    uni.$emit('switch-tab');
			const token = uni.getStorageSync('token');

			// 进入页面统一先停旧轮询，避免叠加
			this.stopPolling();

			// 未登录：直接跳转登录页，不展示本页
			if (!token) {
				this.loading1 = false;
				this.isShowList = false;
				this.sessions = [];
				this.loadMoreStatus = 'noMore';
				this.stopHeartbeat();
				this.clearReconnectTimer();
				this.safeCloseSocket();
				uni.navigateTo({ url: '/pagesB/login/login?delta=1' });
				return;
			}

			this.loadUserProfile();
			// 检查通知权限并显示弹窗（如果满足条件）
			this.checkNotificationPermission();
			var that = this

			const chatSuff = that.getChatCacheUserSuffix()
			if (that._lastChatCacheSuffix != null && that._lastChatCacheSuffix !== chatSuff) {
				that.sessions = []
				that.page = 1
				that.isLoadingSessions = false
				that.loadMoreStatus = 'noMore'
			}

			// 冷启动 / 回切 Tab：内存为空时先铺磁盘缓存（与首页列表策略一致），再差异更新
			that.restoreChatSessionsFromStorageIfEmpty()

			if (that.sessions.length === 0 && !that.isLoadingSessions) {
				that.isLoadingSessions = true
				that.goodsList()
			} else if (that.sessions.length > 0 && !that.isLoadingSessions) {
				that.getNewList()
			}

			that._lastChatCacheSuffix = chatSuff

			// 启动轮询
			that.startPolling();
		},
		async onLoad() {
			var that = this
			const token = uni.getStorageSync('token');

			// 从缓存恢复 kefuLoginData
			const cachedKefuData = uni.getStorageSync('kefu_login_data');
			if (cachedKefuData) {
				this.kefuLoginData = cachedKefuData;
			}

			// 未登录：立即关闭骨架屏并显示登录引导
			if (!token) {
				this.loading1 = false;
				this.isShowList = false;
				this.sessions = [];
			}

			uni.getSystemInfo({
				success: (result) => {
					that.contentTop = result.statusBarHeight + 44 + 'px'
				}
			})
			that.showLoadMore = true
			if (token) {
				that.restoreChatSessionsFromStorageIfEmpty()
				if (that.sessions.length > 0) {
					that.loading1 = false
				}
			}
			if (uni.getStorageSync('newchatMsg') != true) {
				if (uni.getStorageSync('token') != '' && uni.getStorageSync('token') != undefined) {
					if (that.sessions.length === 0) {
						that.page = 1
						that.isLoadingSessions = true
						that.goodsList()
					} else {
						that.isLoadingSessions = false
					}
				} else {
					this.loading1 = false
					that.sessions = []
				}
			}
		},
		onHide() {
			// 页面隐藏时停止轮询和心跳，避免后台持续请求
			this.stopPolling();
			this.stopHeartbeat();
			this.clearReconnectTimer();
		},
		onBackPress() {
			// 从通知进入消息页时栈可能只有本页，返回时回到消息页避免空白
			const pages = getCurrentPages();
			if (pages.length === 1) {
				uni.reLaunch({ url: '/pages/chat/chat' });
				return true;
			}
		},
		onUnload() {
			// 页面卸载时彻底清理
			this.stopPolling();
			this.stopHeartbeat();
			this.clearReconnectTimer();
			this.safeCloseSocket();
		},
		watch: {
			sessions() {
				this.dscLoading = false
			}
		},
		methods: {
			startPolling() {
				// 单例轮询，进入前先清理
				this.stopPolling();
				this.pollingTimer = setInterval(() => {
					if (uni.getStorageSync('newchatMsg') === true) {
						this.getNewList();
						uni.setStorageSync("newchatMsg", false);
					}
					if (uni.getStorageSync('token') && uni.getStorageSync('newLoginMsg') === true) {
						this.isShowList = true;
					} else {
						this.isShowList = false;
					}
				}, this.pollingInterval);
			},
			stopPolling() {
				if (this.pollingTimer) {
					clearInterval(this.pollingTimer);
					this.pollingTimer = null;
				}
			},
			clearReconnectTimer() {
				if (this.reconnectTimer) {
					clearTimeout(this.reconnectTimer);
					this.reconnectTimer = null;
				}
			},
			stopHeartbeat() {
				if (this.heartbeatTimer) {
					clearInterval(this.heartbeatTimer);
					this.heartbeatTimer = null;
				}
			},
			clearReconnectTimer() {
				if (this.reconnectTimer) {
					clearTimeout(this.reconnectTimer);
					this.reconnectTimer = null;
				}
			},
			safeCloseSocket() {
				if (this.socketTask) {
					try {
						this.socketTask.close({});
					} catch (e) {
						// ignore close errors
					}
					this.socketTask = null;
					this.is_open_socket = false;
				}
			},
			// 生成会话的唯一 key，避免在模板中使用字符串拼接导致编译错误
			getSessionKey(item, index) {
				return item.uuid || item.id || `session_${index}`;
			},
			getChatCacheUserSuffix() {
				const userIdRaw = uni.getStorageSync('user_id')
				if (userIdRaw != null && userIdRaw !== '') return String(userIdRaw)
				const info = uni.getStorageSync('userInfo')
				if (info && info.id != null && info.id !== '') return String(info.id)
				return 'guest'
			},
			_readChatSessionsCacheRaw() {
				const suffix = this.getChatCacheUserSuffix()
				let data = uni.getStorageSync('chat_sessions_cache_' + suffix)
				let cacheTime = uni.getStorageSync('chat_sessions_cache_time_' + suffix)
				if (!data || !Array.isArray(data) || data.length === 0) {
					data = uni.getStorageSync('chat_sessions_cache')
					cacheTime = uni.getStorageSync('chat_sessions_cache_time')
				}
				return {
					cachedData: Array.isArray(data) && data.length > 0 ? data : null,
					cacheTime: cacheTime || 0
				}
			},
			_writeChatSessionsCache(data) {
				if (!Array.isArray(data)) return
				const suffix = this.getChatCacheUserSuffix()
				try {
					uni.setStorageSync('chat_sessions_cache_' + suffix, data)
					uni.setStorageSync('chat_sessions_cache_time_' + suffix, Date.now())
					uni.setStorageSync('chat_sessions_cache', data)
					uni.setStorageSync('chat_sessions_cache_time', Date.now())
				} catch (e) {}
			},
			_removeChatSessionsCache() {
				const suffix = this.getChatCacheUserSuffix()
				try {
					uni.removeStorageSync('chat_sessions_cache_' + suffix)
					uni.removeStorageSync('chat_sessions_cache_time_' + suffix)
					uni.removeStorageSync('chat_sessions_cache')
					uni.removeStorageSync('chat_sessions_cache_time')
				} catch (e) {}
			},
			isChatSessionsCacheExpired(cacheTime) {
				return !cacheTime || (Date.now() - cacheTime > CHAT_SESSIONS_TTL_MS)
			},
			/** 内存无列表时从磁盘恢复（含过期数据），由后续 getNewList/goodsList 对齐服务端 */
			restoreChatSessionsFromStorageIfEmpty() {
				if (this.sessions && this.sessions.length > 0) return
				const { cachedData } = this._readChatSessionsCacheRaw()
				if (!cachedData || cachedData.length === 0) return
				this.sessions = cachedData.slice()
				this.loading1 = false
				this.loadMoreStatus = cachedData.length >= 10 ? 'loading' : 'noMore'
				this.page = Math.floor((cachedData.length - 1) / 10) + 2
			},
			// 是否为店铺会话（点击进入店铺客服）：非 type=1 或 有有效店铺 id（非 0/2 官方），避免小程序接口统一返回 type=1 时全部进系统消息
			isShopSession(item) {
				if (!item) return false;
				const sid = item.shop_id != null ? item.shop_id : item.store_id;
				const isOfficial = sid === 0 || sid === '0' || sid === 2 || sid === '2';
				return item.type != 1 || !isOfficial;
			},
			// todemo() {
			// 	uni.navigateTo({
			// 		url: '/pagesB/demo2/index'
			// 		// url:'/pagesB/demo'
			// 		// url:'/pagesB/demo2/demo2'
			// 		// url:'/pagesB/demo2/demo3'
			// 	})
			// },
			// 对比并局部更新会话列表
			compareAndUpdateSessions(oldSessions, newSessions) {
				if (!oldSessions || !newSessions || oldSessions.length === 0) {
					// 如果没有旧数据，直接返回新数据
					return newSessions;
				}
				
				// 创建旧数据的映射，使用uuid或id作为key
				const oldMap = new Map();
				oldSessions.forEach(session => {
					const key = session.uuid || session.id;
					if (key) {
						oldMap.set(key, session);
					}
				});
				
				// 创建新数据的映射
				const newMap = new Map();
				newSessions.forEach(session => {
					const key = session.uuid || session.id;
					if (key) {
						newMap.set(key, session);
					}
				});
				
				// 找出需要更新的会话（已存在的会话）
				const updatedSessions = [];
				const newSessionsList = [];
				
				// 遍历新数据，判断是更新还是新增
				newSessions.forEach(newSession => {
					const key = newSession.uuid || newSession.id;
					if (!key) {
						newSessionsList.push(newSession);
						return;
					}
					
					const oldSession = oldMap.get(key);
					if (oldSession) {
						// 检查是否有变化
						const hasChanged = 
							oldSession.last_message !== newSession.last_message ||
							oldSession.last_time !== newSession.last_time ||
							oldSession.unread !== newSession.unread ||
							oldSession.shop_name !== newSession.shop_name ||
							oldSession.store_id !== newSession.store_id;
						
						if (hasChanged) {
							// 有变化，需要更新
							updatedSessions.push({
								key: key,
								oldIndex: oldSessions.findIndex(s => (s.uuid || s.id) === key),
								newData: newSession
							});
						}
					} else {
						// 新会话，添加到新列表
						newSessionsList.push(newSession);
					}
				});
				
				// 找出需要删除的会话（旧数据中存在但新数据中不存在）
				const deletedKeys = [];
				oldMap.forEach((oldSession, key) => {
					if (!newMap.has(key)) {
						deletedKeys.push(key);
					}
				});
				
				// 如果有更新、新增或删除，返回true表示需要更新
				if (updatedSessions.length > 0 || newSessionsList.length > 0 || deletedKeys.length > 0) {
					return {
						needUpdate: true,
						updatedSessions: updatedSessions,
						newSessions: newSessionsList,
						deletedKeys: deletedKeys,
						allNewSessions: newSessions // 如果变化较大，直接使用新数据
					};
				}
				
				// 没有变化
				return {
					needUpdate: false,
					allNewSessions: oldSessions
				};
			},
			async loadUserProfile() {
				const {
					data
				} = await this.$store.dispatch('userProfile', {
					type: true
				});
				this.userInfo = data ? data : ''
				if (data != undefined) {
					uni.setStorageSync("newchatMsg", true);
					uni.setStorageSync("newLoginMsg", true);
				}
			
				//#ifdef APP-PLUS
				let alias = (data.uc_id).toString()
				jpushModule.setAlias({
					'alias': alias
				})
				//#endif
			},
			toShopHome(item) {
				if (item.shop_id != 0 && item.shop_id != 2) {
					this.$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + item.shop_id, 'app')
				}
			},
			// 检查通知权限
			checkNotificationPermission() {
				// 检查距离上次提示是否已过6小时
				const lastShownTime = uni.getStorageSync('notification_modal_last_shown_time');
				const now = Date.now();
				const sixHours = 6 * 60 * 60 * 1000; // 6小时的毫秒数
				
				if (lastShownTime && (now - lastShownTime < sixHours)) {
					// 距离上次提示不足6小时，不显示
					return;
				}
				
				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform;
				if (platform == "ios") {
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					var enabledTypes = 0;
					if (app.currentUserNotificationSettings) {
						var settings = app.currentUserNotificationSettings();
						enabledTypes = settings.plusGetAttribute("types");
						if (enabledTypes == 0) {
							// 通知权限未开启，直接显示弹窗
							this.ispush = true;
						}
					}
					plus.ios.deleteObject(settings);
					plus.ios.deleteObject(app);
				} else if (platform == "android") {
					var main = plus.android.runtimeMainActivity();
					var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
					if (NotificationManagerCompat == null) {
						NotificationManagerCompat = plus.android.importClass("androidx.core.app.NotificationManagerCompat");
					}
					var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
					if (!areNotificationsEnabled) {
						// 通知权限未开启，直接显示弹窗
						this.ispush = true;
					}
				}
				// #endif
			},
			// 关闭弹窗
			ispushNo() {
				// 用户关闭弹窗后，记录当前时间戳
				uni.setStorageSync('notification_modal_last_shown_time', Date.now());
				this.ispush = false;
			},
			// 去开启
			ispushYes() {
				// 跳转到设置
				this.openTongZhi();
				// 用户点击"去开启"后，记录当前时间戳
				uni.setStorageSync('notification_modal_last_shown_time', Date.now());
				this.ispush = false;
			},
			// 开启通知 - 跳转到系统设置
			openTongZhi() {
				let platform = uni.getSystemInfoSync().platform;
				// #ifdef APP-PLUS
				if (platform == "ios") {
					try {
						var UIApplication = plus.ios.import("UIApplication");
						var application = UIApplication.sharedApplication();
						var NSURL = plus.ios.import("NSURL");
						
						// 尝试方式1：使用 plus.runtime.openURL
						try {
							plus.runtime.openURL("app-settings:");
							plus.ios.deleteObject(NSURL);
							plus.ios.deleteObject(application);
							return;
						} catch (e1) {
							// 方式1 失败，继续尝试方式2
						}
						
						// 尝试方式2：使用 application.openURL
						var settingsURL = NSURL.URLWithString("app-settings:");
						var openResult = application.openURL(settingsURL);
						
						if (openResult === true) {
							plus.ios.deleteObject(settingsURL);
							plus.ios.deleteObject(NSURL);
							plus.ios.deleteObject(application);
							return;
						}
						
						// 如果都失败，显示提示
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							showCancel: false,
							confirmText: '知道了'
						});
						
						plus.ios.deleteObject(settingsURL);
						plus.ios.deleteObject(NSURL);
						plus.ios.deleteObject(application);
					} catch (e) {
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							showCancel: false,
							confirmText: '知道了'
						});
					}
				} else if (platform == "android") {
					try {
						var main = plus.android.runtimeMainActivity();
						var pkName = main.getPackageName();
						var Intent = plus.android.importClass("android.content.Intent");
						var Build = plus.android.importClass("android.os.Build");
						var Settings = plus.android.importClass("android.provider.Settings");
						var Uri = plus.android.importClass("android.net.Uri");
						var intent = null;
						
						if (Build.VERSION.SDK_INT >= 26) {
							intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
							intent.putExtra("android.provider.extra.APP_PACKAGE", pkName);
						} else if (Build.VERSION.SDK_INT >= 21) {
							intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
							intent.putExtra("app_package", pkName);
							var uid = main.getApplicationInfo().plusGetAttribute("uid");
							intent.putExtra("app_uid", uid);
						} else {
							intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
							var uri = Uri.parse("package:" + pkName);
							intent.setData(uri);
						}
						
						intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						main.startActivity(intent);
					} catch (e) {
						uni.showToast({
							title: '请手动前往设置 > 应用 > 通知中开启',
							icon: 'none'
						});
					}
				}
				// #endif
				
				// #ifndef APP-PLUS
				uni.showToast({
					title: '请在系统设置中开启通知权限',
					icon: 'none'
				});
				// #endif
			},
			// 获取新消息列表（带缓存和局部更新）
			// 职责：只负责轻量级的定时刷新，不重新加载完整数据
			getNewList() {
				var that = this
				
				// 并发锁与节流
				const now = Date.now();
				if (that.isFetchingNewList) {
					return;
				}
				if (now - that.lastNewListTs < that.newListMinInterval) {
					return;
				}
				that.lastNewListTs = now;
				that.isFetchingNewList = true;
				
				// 如果没有数据，直接返回，不加载数据（由goodsList负责完整加载）
				if (that.sessions.length === 0) {
					that.isFetchingNewList = false;
					return;
				}
				
				const { cachedData, cacheTime } = this._readChatSessionsCacheRaw();
				const isCacheExpired = this.isChatSessionsCacheExpired(cacheTime);
				
				uni.request({
					url: this.websiteUrl + '/api/chat/sessionsnew',
					method: 'GET',
					data: {
						page: 1,
						size: 10
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						this.onelist = []
						if (res.data.status == 'success') {
							this.loading1 = false
							if (res.data.data.length > 0) {
								// 如果有缓存且未过期，进行局部更新
								if (cachedData && !isCacheExpired && that.sessions.length > 0) {
									const updateResult = that.compareAndUpdateSessions(that.sessions, res.data.data);
									if (!updateResult.needUpdate) {
										that.isFetchingNewList = false;
										return;
									}
									
									// 数据有变化，进行局部更新
									if (updateResult.updatedSessions && updateResult.updatedSessions.length > 0) {
										// 更新已存在的会话
										updateResult.updatedSessions.forEach(({ key, oldIndex, newData }) => {
											if (oldIndex !== -1) {
												// 使用$set确保响应式更新
												Object.keys(newData).forEach(prop => {
													that.$set(that.sessions[oldIndex], prop, newData[prop]);
												});
											}
										});
									}
									
									// 添加新会话到顶部（去重，避免重复）
									if (updateResult.newSessions && updateResult.newSessions.length > 0) {
										// 获取现有会话的key集合
										const existingKeys = new Set(that.sessions.map(s => s.uuid || s.id));
										// 过滤掉已存在的会话
										const trulyNewSessions = updateResult.newSessions.filter(s => {
											const key = s.uuid || s.id;
											return key && !existingKeys.has(key);
										});
										if (trulyNewSessions.length > 0) {
											that.sessions = trulyNewSessions.concat(that.sessions);
										}
									}
									
									// 删除不存在的会话
									if (updateResult.deletedKeys && updateResult.deletedKeys.length > 0) {
										that.sessions = that.sessions.filter(s => {
											const key = s.uuid || s.id;
											return !updateResult.deletedKeys.includes(key);
										});
									}
									
									// 如果变化较大，直接使用新数据
									if (updateResult.updatedSessions.length > 5 || updateResult.newSessions.length > 3) {
										that.sessions = res.data.data;
									}
								} else {
									that.sessions = that.onelist.concat(res.data.data)
								}
								that._writeChatSessionsCache(that.sessions)
							} else {
								this.sessions = []
							}
						} else {
							this.loading1 = false
							// 如果请求失败但有缓存，使用缓存
							if (cachedData && !isCacheExpired && that.sessions.length === 0) {
								that.sessions = cachedData;
							} else {
								this.sessions = []
							}
						}
						that.isFetchingNewList = false;
					},
					fail: (err) => {
						// 请求失败，如果有缓存且未过期，使用缓存
						if (cachedData && !isCacheExpired && that.sessions.length === 0) {
							that.sessions = cachedData;
							that.loading1 = false;
						} else {
							that.loading1 = false;
							that.sessions = [];
						}
						that.isFetchingNewList = false;
					}
				})
			},

			toLogin() {
				uni.navigateTo({
					url: "/pagesB/login/login"
				})
			},
			// 下拉刷新 - 与购物车保持一致的体验
			onPullDownRefresh() {
				// 下拉仅做一次性刷新：重置列表 + 清缓存 + 重新拉一遍全量 sessions
				this.page = 1
				this.sessions = []
				this._removeChatSessionsCache()
				this.goodsList()
			},
			onScroll(e) {
				this.scrollState = e.scrollTop > 800 ? true : false
				this.scrollTop = e.detail.scrollTop
			},
			// 消息列表已改为全量一次性返回，不再做“滑到底部加载更多”
			lower: function() {
				// 保留空函数占位，避免 template 中已有绑定报错
				return
			},
			connectSocketInit() {
				let that = this

				// 单例建链防重入
				if (that.isConnectingSocket || that.is_open_socket) {
					return;
				}
				that.isConnectingSocket = true;

				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				let url = 'wss://' + that.kefuLoginData.listen_route + '/socket'
				that.socketTask = uni.connectSocket({
					url: url,
					success(data) {},
				});

				// 消息的发送和接收必须在正常连接打开中
				that.socketTask.onOpen((res) => {
					that.is_open_socket = true;
					that.isConnectingSocket = false;
					that.clearReconnectTimer();
					let obj = {
						uid: that.kefuLoginData.user.user_id,
						name: that.kefuLoginData.user.user_name,
						avatar: that.kefuLoginData.user.avatar,
						store_id: 0,
						user_type: 'customer',
						type: 'login',
						origin: uni.getStorageSync('platform')
					}

					that.socketTask.send({
						data: JSON.stringify(obj),
						success: () => {}
					})

					// 客户端定时发送心跳 15 秒
					that.stopHeartbeat();
					that.heartbeatTimer = setInterval(function() {
						that.socketTask.send({
							data: '{"type":"ping"}',
							fail() {
								that.connectSocketInit()
							}
						});
					}, 3000);
				});

				// websocket接收消息
				that.socketTask.onMessage(function(res) {
					let info = JSON.parse(res.data);
					switch (info.message_type) {
						// 服务端ping客户端
						case 'ping':
							that.socketTask.send({
								data: '{"type":"pong"}'
							});
							return;
							//获取到消息
						case 'come_msg':
							if (info.message.indexOf("img") > 0) {
								info.message = "[图片]"
							}
							var reg = /<[^<>]+>/g; //1、全局匹配g肯定忘记写,2、<>标签中不能包含标签实现过滤HTML标签
							info.message = info.message.replace(reg, ''); //替换HTML标签
							info.message = info.message.replace(/&nbsp;/ig, ''); //替换HTML空格
							var eee = []
							for (var ab = 0; ab < that.sessions.length; ab++) {
								eee.push(that.sessions[ab].store_id)
							}
							var indof = eee.indexOf(info.store_id)
							if (indof >= 0) {
								// 找到已存在的会话，使用$set确保响应式更新
								var abc = that.sessions[indof]
								that.$set(abc, 'shop_name', info.name)
								that.$set(abc, 'unread', true)
								that.$set(abc, 'last_message', info.message)
								that.$set(abc, 'last_time', '刚刚')
								// 如果WebSocket消息中有其他字段，也更新
								if (info.uuid) {
									that.$set(abc, 'uuid', info.uuid)
								}
								if (info.id) {
									that.$set(abc, 'id', info.id)
								}
								// 移到顶部
								that.sessions.splice(indof, 1)
								that.sessions.unshift(abc)
								// 强制触发响应式更新
								that.$forceUpdate()
							} else {
								// 创建新会话，补充完整字段
								var abc = {
									store_id: info.store_id || 0,
									shop_name: info.name || '',
									unread: true,
									last_message: info.message || '',
									last_time: '刚刚',
									uuid: info.uuid || info.id || ('ws_' + (info.store_id || Date.now())),
									id: info.id || info.store_id || 0,
									shop_id: info.shop_id || info.store_id || 0,
									goods_id: info.goods_id || 0
								}
								// 添加到顶部
								that.sessions.unshift(abc)
								// 强制触发响应式更新
								that.$forceUpdate()
							}
							// 同步更新缓存，避免后续请求覆盖实时更新
							if (that.sessions.length > 0) {
								that._writeChatSessionsCache(that.sessions);
							}
							return;
					}
				})
				
				// WebSocket连接错误监听
				that.socketTask.onError(function(err) {
					that.is_open_socket = false;
					that.isConnectingSocket = false;
					if (that.kefuLoginData) {
						that.clearReconnectTimer();
						that.reconnectTimer = setTimeout(() => {
							that.isConnectingSocket = false;
							that.connectSocketInit();
						}, 3000);
					}
				})
				
				// WebSocket连接关闭监听
				that.socketTask.onClose(function(res) {
					that.is_open_socket = false;
					that.isConnectingSocket = false;
					that.stopHeartbeat();
					if (that.kefuLoginData) {
						that.clearReconnectTimer();
						that.reconnectTimer = setTimeout(() => {
							that.isConnectingSocket = false;
							that.connectSocketInit();
						}, 3000);
					}
				})
			},
			//解析富文本方法
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = html.replace(/<br[^>]*\/>/gi, '');
				newContent = html.replace(/<P[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
				return newContent;

			},
			// websocket接收消息
			onMessage() {
				this.socketTask.onMessage(function(res) {})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				let that = this
				that.socketTask.close({
					success(res) {
						that.is_open_socket = false;
						that.stopHeartbeat();
						that.socketTask = null;
					},
					fail(err) {}
				})
			},
			//发送消息websocket
			clickRequest(obj) {
				let that = this
				if (that.is_open_socket) {
					that.socketTask.send({
						data: JSON.stringify(obj),
						async success(res) {}
					});
				}
			},
			toMessages: function() {
				uni.navigateTo({
					url: '/pagesB/messages/messages'
				})
			},
			navigateToReadAllshop() {
				uni.request({
					url: 'https://www.ok9288.com/api/chat/session/mark',
					method: 'POST',
					data: {

					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (ress) => {
						if (ress.statusCode == '200') {
							for (var a = 0; a < this.sessions.length; a++) {
								this.sessions[a].unread = false
								// uni.hideTabBarRedDot({ //隐藏红点
								// 	index: 2
								// })
							}
						}
					}
				})

				uni.request({
					url: this.websiteUrl + '/api/chat/syslist',
					method: 'GET',
					data: {
						page: this.page,
						size: 10
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res1) => {
						if (res1.data.status == 'success') {
							if (res1.data.data.length > 0) {
								uni.request({
									url: this.websiteUrl + '/api/sys_read',
									method: 'GET',
									data: {
										isALL: 1
									},
									header: {
										'Content-Type': 'application/json',
										'token': uni.getStorageSync('token'),
										'X-Client-Hash': uni.getStorageSync('client_hash')
									},
									success: (res2) => {
										if (res2.data.status == 'success') {
											for (var a = 0; a < res1.data.data.length; a++) {
												res1.data.data[a].unread = false
											}
										}
									}
								})
							}
						} else {
							this.loading1 = false
							this.sessions = []
							this.loadMoreStatus = "noMore"
						}
					}
				})
			},
			onChats(shop_name, id, shop_id, uuid, index) {
				var that = this

				// 【修复】防止快速点击导致重复跳转
				if (this.isNavigating) {
					return;
				}
				this.isNavigating = true;

				setTimeout(function() {
					let type = ''
					// #ifndef MP-WEIXIN
					type = 'app'
					// #endif

					// #ifdef MP-WEIXIN
					type = 'weixin'
					// #endif
					// that.onChat(shop_name,id, shop_id)
					that.$store.dispatch('setChat', {
						goods_id: id,
						shop_id: shop_id ? shop_id : 0,
						type: type
					}).then((res) => {
						if (res.status == 'success') {
							// 小程序环境下接口可能返回 ru_id=0，导致始终进入官方客服；优先用会话列表的店铺 id
							var navShopId = res.data.ru_id;
							var sessionShopId = (shop_id != null && shop_id !== undefined && shop_id !== '') ? shop_id : (res.data.ru_id != null ? res.data.ru_id : 0);
							// #ifdef MP-WEIXIN
							if (navShopId === 0 || navShopId === '0' || navShopId == null || navShopId === undefined || navShopId === '') {
								navShopId = sessionShopId;
							}
							// #endif
							// 若接口未返回有效店铺 id，统一用会话的店铺 id（避免进官方客服）
							if (navShopId === 0 || navShopId === '0' || navShopId == null || navShopId === undefined || navShopId === '') {
								navShopId = sessionShopId;
							}
							uni.navigateTo({
								url: "/pagesB/kefu_center/kefu_center?shop_id=" + encodeURIComponent(String(navShopId)) +
									'&shop_name=' + encodeURIComponent(shop_name || '') + '&goods_id=' + encodeURIComponent(String(res.data.goods_id != null ? res.data.goods_id : id)) +
									'&token=' + encodeURIComponent(res.data.t || '')
							})
						} else {
							uni.showToast({
								title: res.errors.message,
								icon: 'none'
							})
						}
						// 重置导航标志
						that.isNavigating = false;
					}).catch((err) => {
						console.error('setChat error:', err);
						// 出错也要重置标志
						that.isNavigating = false;
					})
				}, 100);

				// 发送标记已读请求
				uni.request({
					url: that.websiteUrl + '/api/chat/session/mark',
					method: 'POST',
					data: {
						uuid: uuid
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							// 通过uuid查找会话，避免index依赖
							const sessionIndex = that.sessions.findIndex(s => s.uuid === uuid);
							if (sessionIndex !== -1) {
								that.$set(that.sessions[sessionIndex], 'unread', false);
							}
						}
					},
					fail: (err) => {
						console.error('标记已读失败:', err);
					}
				})
			},
			//客服列表
			async goodsList(page) {
				var that = this
				
				uni.request({
					url: this.websiteUrl + '/api/chat/sessionsnew',
					// url: this.websiteUrl + '/api/chat/sessions',
					method: 'GET',
					data: {
						page: this.page,
						size: 10
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							if (this.page == 1) {
								// 第一页：使用缓存和局部更新逻辑
								const { cachedData, cacheTime } = that._readChatSessionsCacheRaw();
								const isCacheExpired = that.isChatSessionsCacheExpired(cacheTime);
								
								if (res.data.data.length > 0) {
									// 获取 kefuLoginData 用于 WebSocket 连接
									if (res.data.data[0] && res.data.data[0].token) {
										uni.request({
											url: this.websiteUrl + '/kefu/index',
											method: 'POST',
											data: {
												uid: uni.getStorageSync('userInfo').id,
												ru_id: 0,
												goods_id: '',
												t: res.data.data[0].token,
												type: 'app'
											},
											header: {
												'Content-Type': 'application/json',
												'token': uni.getStorageSync('token'),
												'X-Client-Hash': uni.getStorageSync('client_hash')
											},
											success: (ress) => {
												if (ress.statusCode == '200') {
													this.kefuLoginData = ress.data
													this.connectSocketInit()
												}
											}
										})
									}

									// 如果有缓存且未过期，进行局部更新
									if (cachedData && !isCacheExpired && that.sessions.length > 0) {
										const updateResult = that.compareAndUpdateSessions(that.sessions, res.data.data);
										if (!updateResult.needUpdate) {
											// 更新加载状态
											if (res.data.data.length == 10) {
												that.loadMoreStatus = "loading"
											} else if (res.data.data.length < 10) {
												that.loadMoreStatus = "noMore"
											}
											that.page = that.page + 1
											that.loading1 = false; // 【修复】关闭骨架屏
											uni.hideLoading()
											uni.setStorageSync('sessionlist', that.sessions)
											// 停止下拉刷新
											uni.stopPullDownRefresh();
											return;
										}
										
										// 数据有变化，进行局部更新
										if (updateResult.updatedSessions && updateResult.updatedSessions.length > 0) {
											updateResult.updatedSessions.forEach(({ key, oldIndex, newData }) => {
												if (oldIndex !== -1) {
													Object.keys(newData).forEach(prop => {
														that.$set(that.sessions[oldIndex], prop, newData[prop]);
													});
												}
											});
										}
										
										// 添加新会话到顶部（去重，避免重复）
										if (updateResult.newSessions && updateResult.newSessions.length > 0) {
											// 获取现有会话的key集合
											const existingKeys = new Set(that.sessions.map(s => s.uuid || s.id));
											// 过滤掉已存在的会话
											const trulyNewSessions = updateResult.newSessions.filter(s => {
												const key = s.uuid || s.id;
												return key && !existingKeys.has(key);
											});
											if (trulyNewSessions.length > 0) {
												that.sessions = trulyNewSessions.concat(that.sessions);
											}
										}
										
										if (updateResult.deletedKeys && updateResult.deletedKeys.length > 0) {
											that.sessions = that.sessions.filter(s => {
												const key = s.uuid || s.id;
												return !updateResult.deletedKeys.includes(key);
											});
										}
										
										// 如果变化较大，直接使用新数据
										if (updateResult.updatedSessions.length > 5 || updateResult.newSessions.length > 3) {
											that.sessions = res.data.data;
										}
									} else {
										// 没有缓存或已过期，直接使用新数据
										that.sessions = res.data.data
									}
									
									that._writeChatSessionsCache(that.sessions);
								} else {
									that.sessions = []
								}
								
								// 第一页加载完成，清除加载标记
								if (this.page == 1) {
									that.isLoadingSessions = false;
									that.loading1 = false; // 【修复】关闭骨架屏
								}
							} else {
								// 后续页：直接追加数据（不使用缓存）
								if (res.data.data.length > 0) {
									that.sessions = that.sessions.concat(res.data.data)
								}
							}
							
							if (res.data.data.length > 0) {
								if (res.data.data.length == 10) {
									this.loadMoreStatus = "loading"
								} else if (res.data.data.length < 10) {
									this.loadMoreStatus = "noMore"
								}
								this.page = this.page + 1
								// 【修复】确保骨架屏关闭（第一页时）
								if (this.page == 2) {
									this.loading1 = false;
								}
								uni.hideLoading()
								uni.setStorageSync('sessionlist', this.sessions)
								that._writeChatSessionsCache(that.sessions)
							} else {
								this.loadMoreStatus = "noMore"
								if (this.page == 1) {
									this.sessions = []
									this.loading1 = false; // 【修复】关闭骨架屏
								}
								uni.hideLoading()
							}
							// 停止下拉刷新
							uni.stopPullDownRefresh();
						} else if (res.data.status == 'failed') {
							const { cachedData, cacheTime } = that._readChatSessionsCacheRaw();
							const isCacheExpired = that.isChatSessionsCacheExpired(cacheTime);
							
							if (cachedData && !isCacheExpired && that.sessions.length === 0) {
								that.sessions = cachedData;
							} else {
								that.sessions = []
							}
							this.loadMoreStatus = "noMore"
							// 【修复】关闭骨架屏
							if (this.page == 1) {
								that.loading1 = false;
							}
							uni.hideLoading()
							
							// 第一页加载失败，清除加载标记
							if (this.page == 1) {
								that.isLoadingSessions = false;
							}
						}
					},
					fail: (err) => {
						const { cachedData, cacheTime } = that._readChatSessionsCacheRaw();
						const isCacheExpired = that.isChatSessionsCacheExpired(cacheTime);
						
						if (cachedData && !isCacheExpired && that.sessions.length === 0) {
							that.sessions = cachedData;
						} else {
							that.sessions = []
						}
						that.loadMoreStatus = "noMore"
						// 【修复】关闭骨架屏
						if (this.page == 1) {
							that.loading1 = false;
						}
						uni.hideLoading()
						
						// 第一页加载失败，清除加载标记
						if (this.page == 1) {
							that.isLoadingSessions = false;
						}
						// 停止下拉刷新
						uni.stopPullDownRefresh();
					}
				})
			},
			deleteCartGoods(id) {
				// 【新增】删除确认弹窗
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个会话吗？删除后将无法恢复。',
					cancelText: '取消',
					confirmText: '确定删除',
					confirmColor: '#f92028',
					success: (res) => {
						if (res.confirm) {
							// 用户点击确定，执行删除操作
							this.performDelete(id);
						}
						// 用户点击取消，不执行任何操作
					}
				});
			},
			// 执行实际的删除操作
			performDelete(id) {
				uni.request({
					url: this.websiteUrl + '/api/chat/session/destroy',
					method: 'POST',
					data: {
						id: id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: "删除成功",
								icon: "success"
							});
							this.page = 1
							this.sessions = []
							this._removeChatSessionsCache();
							this.goodsList()
						}
					}
				})
			},
		}
	}
</script>

<style scoped>
	/* .container{ padding-bottom: 300upx;} */

	.card-goods-group {
		margin-bottom: 20upx;
	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		padding: 0 20upx 20upx;
		justify-content: space-between;
	}

	.card-shop-head .head-left,
	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;
	}


	.checkbox-icon .uni-icon {
		display: block;
	}

	.card-shop-box {
		padding: 0 20upx;
	}

	.card-act-goods {
		display: flex;
		flex-direction: column;
		margin-bottom: 20upx;
	}

	.card-act-goods:last-child {
		margin-bottom: 0;
	}

	.cart-act-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 20upx 60upx;
	}

	.cart-act-title .txt {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333333;
	}

	.cart-act-title .txt .em-icon {
		margin-right: 20upx;
	}

	.cart-act-title .txt .act-name view {
		font-size: 25upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cart-act-title .more {
		display: flex;
		flex-direction: row;
		color: #f92028;
		align-items: center;
	}

	.cart-goods-item {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		width: 100%;
		margin-top: 0;
		background-color: #FFFFFF;
		position: relative;
	}

	/* uni-swipe-action 样式重置 */
	.swipe-action-wrapper {
		width: 100%;
		margin: 0;
		padding: 0;
		background-color: #FFFFFF;
		flex: 1;
	}

	/* 重置 uni-swipe-action 的默认样式 */
	.swipe-action-wrapper /deep/ .uni-swipe {
		margin: 0 !important;
		padding: 0 !important;
	}

	.swipe-action-wrapper /deep/ .uni-swipe-action__content {
		margin: 0 !important;
		padding: 0 !important;
		background-color: #FFFFFF !important;
	}


	.cart-goods-item .checkbox-con {
		border-bottom: none;
	}

	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 24upx 30upx;
		display: flex;
		flex-direction: row;
		margin: 0;
		border-radius: 0;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		flex: 1 1 0%;
	}

	.scroll-view-item-left {
		position: relative;
	}

	.scroll-view-item-left::after {
		content: '';
		position: absolute;
		left: 150upx;
		right: 30upx;
		bottom: 0;
		height: 1px;
		background-color: #F0F0F0;
		z-index: 10;
		pointer-events: none;
	}

	.cart-goods-item:last-child .scroll-view-item-left::after {
		display: none;
	}

	.cart-goods-contents {
		overflow: hidden;
		flex: 1;
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
		position: relative;
	}

	.cart-goods-info .goods-img {
		width: 96upx;
		height: 96upx;
		border-radius: 10upx;
		position: relative;
		flex-shrink: 0;
	}

	.cart-goods-info .goods-img i {
		background: #FF3B30;
		height: 20upx;
		width: 20upx;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 99;
		border-radius: 50%;
		border: 2upx solid #FFFFFF;
	}

	.cart-goods-info .image {
		width: 96upx;
		height: 96upx;
		border-radius: 10upx;
		background-color: #F5F5F5;
	}

	.cart-goods-contents {
		overflow: hidden;
		flex: 1;
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.cart-goods-tit {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8upx;
	}

	.goods-title {
		font-size: 32upx;
		font-weight: 500;
		color: #666666;
		overflow: hidden;
		box-sizing: border-box;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		min-width: 0;
	}

	.goods-time {
		color: #999999;
		font-size: 24upx;
		flex-shrink: 0;
		margin-left: 20upx;
	}

	.goods-infos {
		overflow: hidden;
		box-sizing: border-box;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 40upx;
		color: #999999;
		font-size: 26upx;
		margin-top: 4upx;
	}

	.scroll-view-G {
		display: flex;
		align-items: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.scroll-view-G ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.scroll-view-item-right {
		width: 20%;
		margin-left: 5px;
		height: 100%;
		line-height: 100%;
		text-align: center;
		background: #f92028;
		color: #FFFFFF;
		position: relative;
	}

	.scroll-view-item-right view {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.chat_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		/* #ifdef H5 */
		width: 92%;
		padding: 0rpx 20rpx 16rpx 30rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		width: 92%;
		padding: 0rpx 20rpx 16rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 72%;
		padding: 0rpx 20rpx 16rpx 30rpx;
		/* #endif */
	}

	.chat-header-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.chat_2 {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.chat-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #000000;
	}

	.chat_2_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 0;
		margin-left: 20rpx;
		padding: 8rpx 0;
	}

	.chat-read-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.chat-read-text {
		color: #828282;
		font-size: 28rpx;
		margin-left: 10rpx;
	}

	.list-scroll-content {
		height: calc(100vh - 150rpx);
		width: 100%;
		background-color: #FFFFFF;
	}

	.status_bar {
		background-color: #FFFFFF;
	}

	.container {
		background-color: #FFFFFF;
	}

	/* 未登录 */
	.not-content {
		width: 100%;
		padding: 50px 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.not-content .notimg {
		width: 144px;
		height: 124px;
		margin: 0 auto 20px;
	}

	.not-content .cont {
		text-align: center;
		color: #999999;
	}

	.not-content .conts {
		text-align: center;
		color: #f23030;
	}
	
	.pd-bottom {
		/* #ifdef APP-PLUS */
		padding-bottom: 65rpx;
			/* #endif */
	}

	/* 通知权限弹窗 - 底部弹出样式 */
	.notification-modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999999;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.notification-modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		animation: fadeIn 0.25s ease-out;
	}

	.notification-modal-bottom {
		position: relative;
		width: 100%;
		background-color: #ffffff;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		overflow: hidden;
		animation: slideUpFromBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 100000000;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.notification-modal-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #000000;
		text-align: center;
		padding: 40rpx 40rpx 30rpx;
		line-height: 1.4;
	}

	.notification-modal-content-wrapper {
		padding: 0 40rpx 30rpx;
	}

	.notification-modal-bg {
		position: relative;
		width: 100%;
		border-radius: 20rpx;
		overflow: visible;
		min-height: 500rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F5F5F5;
	}

	.notification-modal-bg-image {
		width: 100%;
		height: 500rpx;
		position: absolute;
		top: 0;
		left: 0;
		object-fit: contain;
		display: block;
		z-index: 1;
	}

	.notification-modal-card {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 580rpx;
		padding: 24rpx 32rpx;
		z-index: 2;
	}

	.notification-modal-content-inner {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.notification-modal-logo {
		width: 80rpx;
		height: 80rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
		border-radius: 50%;
		overflow: hidden;
	}

	.notification-modal-text-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
	}

	.notification-modal-shop-name-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8rpx;
	}

	.notification-modal-shop-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #000000;
		line-height: 1.4;
	}

	.notification-modal-time {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
	}

	.notification-modal-desc {
		font-size: 24rpx;
		color: #999999;
		text-align: left;
		line-height: 1.4;
	}

	.notification-modal-actions-bottom {
		padding: 0 40rpx 40rpx;
	}

	.notification-modal-btn-primary {
		width: 100%;
		height: 88rpx;
		background: #FF3B30;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #ffffff;
		transition: opacity 0.2s;
	}

	.notification-modal-btn-primary:active {
		opacity: 0.8;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUpFromBottom {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}


</style>