<template>
		<view class="tabbar-container"  :style="{height:totalHeight + 'px', bottom: tabbarBottom }" v-if="showTabBar">
		<!-- APP 端在 tabbar 内部挂载红包条为悬浮层，只在首页 tab 显示，不参与 tabbar 布局 -->
		<!-- #ifdef APP-PLUS -->
		<sys-coupon v-if="currentIndex === 0" />
		<!-- #endif -->
		<view class="custom-tabbar">
			<view v-for="(item, index) in list" :key="index" class="tab-item" @click="handleTabClick(item, index)">
				<image :src="getIconPath(item, index)" class="icon" style="height: 48rpx;width: 48rpx;"  @error="handleImageError(item, index)" />
				<text style="font-size: 20rpx;
    line-height: normal;
    margin-top: 6rpx;" :class="{ active: currentIndex === index }">{{ item.text }}</text>
			</view>
		</view>

		<!-- 安全区域占位 -->
		<view class="safe-area"></view>
	</view>
</template>


<script>
	import sysCoupon from '@/components/sys-coupon.vue'

	const tabBarRoutes = [
		"/pages/middles/middles",
		"/pages/chat/chat",
		"/pages/member/member",
		"/pages/cart/cart",
		"/pages/user/user"
	];
	const SAFE_AREA_MAX = 100;
	let cachedSafeAreaBottom = null;
	
	// 路径标准化函数
	function normalizePath(path) {
		if (!path) return '';
		// 统一去掉开头/结尾的斜杠
		let p = path.replace(/^\/+/, '').replace(/\/+$/, '');
		// H5 打包时路由前面会带上 "mobile/" 前缀，例如 "mobile/pages/cart/cart"
		// 这里专门去掉这一段前缀，保证和 tabBarRoutes 里的 "/pages/xxx/xxx" 能对上
		if (p.indexOf('mobile/pages/') === 0) {
			p = p.substring('mobile/'.length);
		}
		return p;
	}
	export default {
		data() {


			return {
				currentIndex: 0,
				lastTapTime: 0,
				lastTapIndex: -1, // 添加记录上次点击的索引
				safeAreaInsets: 0,
				initialSafeAreaInsets: null,
				safeAreaLocked: false,
				iconVersion: 0,
				totalHeight: 60, // 增加默认高度
			// 【关键修复】初始化为有数据的数组，而不是空数组，确保初次进入时 tabbar 有内容
			list: [{
				pagePath: "/pages/middles/middles",
				text: "首页",
				iconPath: "/static/tabBar/tabBar1.png",
				selectedIconPath: "/static/tabBar/tabbar1.gif"
			}, {
				pagePath: "/pages/chat/chat",
				text: "消息",
				iconPath: "/static/tabBar/tabBar2.png",
				selectedIconPath: "/static/tabBar/tabbar2.gif"
			}, {
				pagePath: "/pages/member/member",
				text: "黑卡",
				iconPath: "/static/tabBar/tabBar3.png",
				selectedIconPath: "/static/tabBar/tabbar3.gif"
			}, {
				pagePath: "/pages/cart/cart",
				text: "采购车",
				iconPath: "/static/tabBar/tabBar4.png",
				selectedIconPath: "/static/tabBar/tabbar4.gif"
			}, {
				pagePath: "/pages/user/user",
				text: "我的",
				iconPath: "/static/tabBar/tabBar5.png",
				selectedIconPath: "/static/tabBar/tabbar5.gif"
			}],
				showTabBar: true, // 【关键修复】默认显示，确保即使检查失败也能显示
				forceShowTab: false, // 【新增】标记是否收到强制显示指令
				  isAndroid: false,
				  isCartPage: false,
				  tabbarBottom: '0px', // tabbar底部位置
			};
		},
		components: {
			sysCoupon
		},
		
		created() {
			// 【关键修复】立即设置显示，确保 tab 始终可见
			this.showTabBar = true;
			this.initTabList();
			this.hideNativeTabBar();
			uni.$on('switch-tab', this.updateActiveTab);

			// 【修复 iOS 冷启动 tabbar 约 5px 跳跃】
			// 原因：tabbarBottom 和 totalHeight 仅在 mounted 中设置，首帧渲染时使用 data 默认值(0/60)，
			// 导致首帧 tabbar 位置偏低约 5px，mounted 后 updateSafeArea 才修正，产生"先降低再增高"的跳跃
			// 解决：在 created 中同步设置 tabbarBottom 并立即执行一次 updateSafeArea，确保首帧即使用正确值
			// #ifdef APP-PLUS
			try {
				const sysInfo = uni.getSystemInfoSync();
				if (sysInfo.platform === 'ios') {
					this.tabbarBottom = '-30rpx';
				} else if (sysInfo.platform === 'android') {
					this.tabbarBottom = '20rpx';
				}
				// 立即执行一次安全区域计算，避免首帧使用 totalHeight=60 的错误值
				this.updateSafeArea();
			} catch (e) {}
			// #endif

			// 【关键修复】在created时就注册强制显示事件监听器，确保不遗漏早期事件
			uni.$on('force-show-tabbar', (data) => {
				// 【关键】设置强制显示标志，防止被路径检查覆盖
				this.forceShowTab = true;
				this.showTabBar = true;
				this.iconVersion++;
				// 延迟再同步一次索引，确保 tab 高亮正确
				setTimeout(() => {
					this.updateActiveTab();
				}, 50);
			});
			// #ifdef MP-WEIXIN
			  const systemInfo = wx.getSystemInfoSync();
			      this.isAndroid = systemInfo.system.toLowerCase().includes('android');
				      // 安卓特殊初始化
				      if (this.isAndroid) {
				        // 预加载图片
				        setTimeout(() => {
				          this.list.forEach(item => {
				            const img = new Image();
				            img.src = item.selectedIconPath;
				          });
				        }, 300);
				        
				        // 强制刷新
				        this.$nextTick(() => {
				          this.iconVersion += 1;
				        });
				      }
				
				
				// #endif
			

			// 【修复】立即执行一次路径检查，确保tab立即显示
			this.forceUpdateActiveTab();
			

			// 额外延迟检查，确保页面信息完整
			setTimeout(() => {
				
				this.forceUpdateActiveTab();
				
			}, 100);
			  // #ifdef MP-WEIXIN
			  const { platform } = wx.getSystemInfoSync();
			  this.isAndroid = platform.toLowerCase().includes('android');
			  // #endif
			  
			// #ifdef APP-PLUS
			// iOS：监听页面显示事件，清除后台重新进入时重新计算安全区域
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'ios') {
				// 监听应用从后台恢复事件
				uni.$on('app-show', () => {
					// 延迟重新计算，确保系统信息已准备好
					this.safeAreaLocked = false; // 解锁，允许重新计算
					setTimeout(() => {
						this.updateSafeArea();
					}, 200);
					setTimeout(() => {
						this.updateSafeArea();
					}, 500);
				});
			}
			// #endif
		},
		mounted() {
			// 检测平台并设置bottom值（先设置，避免闪烁）
			const systemInfo = uni.getSystemInfoSync();
			
			// #ifdef APP-PLUS
			if (systemInfo.platform === 'android') {
				this.tabbarBottom = '20rpx';
			} else if (systemInfo.platform === 'ios') {
				// iOS：恢复 -30rpx 补偿值（之前正常显示的值）
				this.tabbarBottom = '-30rpx';
			}
			// #endif
			
			// #ifdef MP-WEIXIN
			// 小程序环境也设置 bottom 值，确保动态样式生效
			// isAndroid 已在 created 中设置
			this.tabbarBottom = '0rpx';
			// #endif
			
			// #ifdef H5
			this.tabbarBottom = '0px';
			// #endif
			
			// iOS：延迟计算安全区域，确保系统信息完全准备好
			// #ifdef APP-PLUS
			if (systemInfo.platform === 'ios') {
				// 延迟多次计算，确保清除后台重新进入时能正确计算
				setTimeout(() => {
					this.safeAreaLocked = false; // 解锁，允许重新计算
					this.updateSafeArea();
				}, 100);
				setTimeout(() => {
					this.safeAreaLocked = false;
					this.updateSafeArea();
				}, 300);
				setTimeout(() => {
					this.safeAreaLocked = false;
					this.updateSafeArea();
				}, 600);
			} else {
				// Android 立即计算
				this.updateSafeArea();
			}
			// #endif
			// #ifndef APP-PLUS
			this.updateSafeArea();
			// #endif
			
			// 使用防抖处理窗口大小变化
			this.debouncedUpdateSafeArea = this.debounce(this.updateSafeArea, 300);
			uni.onWindowResize(this.debouncedUpdateSafeArea);

			// 【关键修复】在mounted中初始化tab状态，确保事件监听器被注册
			this.initTabState();
			// 【关键修复】再次确保显示，防止被其他逻辑覆盖
			this.showTabBar = true;
		},
		beforeDestroy() {
			if (this.debouncedUpdateSafeArea) {
				uni.offWindowResize(this.debouncedUpdateSafeArea);
			}
			uni.$off('switch-tab', this.updateActiveTab);
			// #ifdef APP-PLUS
			// iOS：移除应用显示事件监听
			uni.$off('app-show');
			// #endif
		},
		watch: {
			// 监听 totalHeight 变化，统一向外广播「距屏幕底部需要预留的距离」（px）
			// offsetPx = tabbar 实际高度(px) + tabbarBottom 对应的偏移(px)
			totalHeight: {
				handler(newVal) {
					if (!newVal || newVal <= 0) return;
					
					try {
						const systemInfo = uni.getSystemInfoSync ? uni.getSystemInfoSync() : null;
						const screenWidth = systemInfo && systemInfo.screenWidth ? systemInfo.screenWidth : 375;
						
						let bottomPx = 0;
						if (this.tabbarBottom) {
							const match = /(-?[\\d.]+)/.exec(this.tabbarBottom);
							if (match) {
								const v = parseFloat(match[1]);
								if (!isNaN(v)) {
									if (this.tabbarBottom.indexOf('rpx') !== -1) {
										bottomPx = v * screenWidth / 750;
									} else {
										bottomPx = v;
									}
								}
							}
						}
						
						const offsetPx = newVal + bottomPx;
						uni.$emit('tabbar-height', { offsetPx });
					} catch (e) {
						// 回退为仅使用高度
						uni.$emit('tabbar-height', { offsetPx: newVal });
					}
				},
				immediate: true
			},
			// 切回首页时新创建的 sys-coupon 收不到 totalHeight 的 emit，主动发一次与初始化一致的 offsetPx，消除缝隙
			currentIndex(newVal) {
				if (newVal !== 0 || !this.totalHeight || this.totalHeight <= 0) return;
				this.$nextTick(() => {
					uni.$emit('tabbar-height', { offsetPx: this.totalHeight });
				});
			}
		},
		computed: {},
		methods: {
			// 初始化列表（解决部分平台未定义问题）
			initTabList() {
			try {
				// #ifdef MP-WEIXIN
				this.list = [{
						pagePath: "/pages/middles/middles",
						text: "首页",
						iconPath: "/static/tabBar/tabBar1.png",
						selectedIconPath: "/static/tabBar/tabBar_cur_1.png"
					},
					{
						pagePath: "/pages/chat/chat",
						text: "消息",
						iconPath: "/static/tabBar/tabBar2.png",
						selectedIconPath: "/static/tabBar/tabBar_cur_2.png"
					},
					{
						pagePath: "/pages/member/member",
						text: "黑卡",
						iconPath: "/static/tabBar/tabBar3.png",
						selectedIconPath: "/static/tabBar/tabBar_cur_3.png"
					},
					{
						pagePath: "/pages/cart/cart",
						text: "采购车",
						iconPath: "/static/tabBar/tabBar4.png",
						selectedIconPath: "/static/tabBar/tabBar_cur_4.png"
					},
					{
						pagePath: "/pages/user/user",
						text: "我的",
						iconPath: "/static/tabBar/tabBar5.png",
						selectedIconPath: "/static/tabBar/tabBar_cur_5.png"
					}
				]; // 微信小程序列表
				// #endif
				// #ifndef MP-WEIXIN
				this.list = [{
						pagePath: "/pages/middles/middles",
						text: "首页",
						iconPath: "/static/tabBar/tabBar1.png",
						selectedIconPath: "/static/tabBar/tabbar1.gif"
					},
					{
						pagePath: "/pages/chat/chat",
						text: "消息",
						iconPath: "/static/tabBar/tabBar2.png",
						selectedIconPath: "/static/tabBar/tabbar2.gif"
					},
					{
						pagePath: "/pages/member/member",
						text: "黑卡",
						iconPath: "/static/tabBar/tabBar3.png",
						selectedIconPath: "/static/tabBar/tabbar3.gif"
					},
					{
						pagePath: "/pages/cart/cart",
						text: "采购车",
						iconPath: "/static/tabBar/tabBar4.png",
						selectedIconPath: "/static/tabBar/tabbar4.gif"
					},
					{
						pagePath: "/pages/user/user",
						text: "我的",
						iconPath: "/static/tabBar/tabBar5.png",
						selectedIconPath: "/static/tabBar/tabbar5.gif"
					}
				]; // 其他平台列表
				// #endif

				// 【关键修复】确保列表不为空，双重保险
				if (!this.list || this.list.length === 0) {
					console.warn('【TabBar】initTabList 执行后 list 仍为空，使用默认列表');
					this.list = [{
							pagePath: "/pages/middles/middles",
							text: "首页",
							iconPath: "/static/tabBar/tabBar1.png",
							selectedIconPath: "/static/tabBar/tabbar1.gif"
						},
						{
							pagePath: "/pages/chat/chat",
							text: "消息",
							iconPath: "/static/tabBar/tabBar2.png",
							selectedIconPath: "/static/tabBar/tabbar2.gif"
						},
						{
							pagePath: "/pages/member/member",
							text: "黑卡",
							iconPath: "/static/tabBar/tabBar3.png",
							selectedIconPath: "/static/tabBar/tabbar3.gif"
						},
						{
							pagePath: "/pages/cart/cart",
							text: "采购车",
							iconPath: "/static/tabBar/tabBar4.png",
							selectedIconPath: "/static/tabBar/tabbar4.gif"
						},
						{
							pagePath: "/pages/user/user",
							text: "我的",
							iconPath: "/static/tabBar/tabBar5.png",
							selectedIconPath: "/static/tabBar/tabbar5.gif"
						}
					]; // 默认列表
				}
				
				// 【关键修复】验证 list 是否成功初始化
				if (this.list && this.list.length > 0) {
					console.log('【TabBar】list 初始化成功，共', this.list.length, '项');
				} else {
					console.error('【TabBar】list 初始化失败，list 仍为空！');
				}
			} catch (e) {
				console.error('【TabBar】initTabList 执行异常:', e);
				// 异常情况下，确保 list 有默认值（已在 data 中设置，这里再次确认）
				if (!this.list || this.list.length === 0) {
					this.list = [{
						pagePath: "/pages/middles/middles",
						text: "首页",
						iconPath: "/static/tabBar/tabBar1.png",
						selectedIconPath: "/static/tabBar/tabbar1.gif"
					}, {
						pagePath: "/pages/chat/chat",
						text: "消息",
						iconPath: "/static/tabBar/tabBar2.png",
						selectedIconPath: "/static/tabBar/tabbar2.gif"
					}, {
						pagePath: "/pages/member/member",
						text: "黑卡",
						iconPath: "/static/tabBar/tabBar3.png",
						selectedIconPath: "/static/tabBar/tabbar3.gif"
					}, {
						pagePath: "/pages/cart/cart",
						text: "采购车",
						iconPath: "/static/tabBar/tabBar4.png",
						selectedIconPath: "/static/tabBar/tabbar4.gif"
					}, {
						pagePath: "/pages/user/user",
						text: "我的",
						iconPath: "/static/tabBar/tabBar5.png",
						selectedIconPath: "/static/tabBar/tabbar5.gif"
					}];
				}
				}
			},


			// 新增初始化方法
			initTabState() {
				// 【关键修复】立即确保显示
				this.showTabBar = true;
				// 【修复消息页高亮】先按当前页面同步索引，避免新挂载的 tabbar（如消息页）被强制设为首页
				const pages = getCurrentPages();
				if (pages.length > 0) {
					this.updateActiveTab();
				} else {
					this.currentIndex = 0;
				}

				// 方案2：延迟检测确保页面栈就绪
				setTimeout(() => {
					const pages = getCurrentPages();
					if (pages.length === 0) {
						this.currentIndex = 0;
						this.showTabBar = true;
					} else {
						this.updateActiveTab();
					}
					this.iconVersion++; // 强制更新图标
				}, 300);
				// Android特定修复
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					setTimeout(() => {
						this.showTabBar = true;
						this.iconVersion++;
					}, 300);
				}
				// #endif
				// 方案3：监听首页加载完成事件
				uni.$once('home-page-ready', () => {
					this.currentIndex = 0;
					this.showTabBar = true;
					this.iconVersion++;
				});

				// 强制显示tab事件已在created中注册，这里不再重复注册
			},
			// 新增强制更新方法
			forceUpdateActiveTab() {
				try {
					// 【关键修复】先确保显示，再尝试更新
					this.showTabBar = true;
					const pages = getCurrentPages();
					if (pages.length === 0) {
						this.currentIndex = 0;
						this.showTabBar = true;
						return;
					}
					this.updateActiveTab();
				} catch (e) {
					// 【关键修复】异常情况下确保显示
					console.warn('forceUpdateActiveTab 执行失败:', e);
					this.showTabBar = true;
					this.currentIndex = 0;
				}
			},
			// 修改路径匹配逻辑（更宽松的匹配）
			updateActiveTab() {
				try {
					const pages = getCurrentPages();
					if (!pages.length) {
						// 【关键修复】即使获取不到页面，也显示 tab（默认首页）
						this.showTabBar = true;
						this.currentIndex = 0;
						return;
					}

					const currentPage = pages[pages.length - 1];
					// 【关键修复】如果获取不到当前页面，使用默认值，但确保显示
					if (!currentPage) {
						this.showTabBar = true;
						this.currentIndex = 0;
						return;
					}

					// 获取当前路径（兼容多种格式）
					let currentPath = currentPage.route ||
						currentPage.$page?.route ||
						currentPage.__route__ ||
						''; // 【关键修复】如果路径为空，使用空字符串

					// 【关键修复】如果路径为空，默认使用首页路径
					if (!currentPath) {
						this.showTabBar = true;
						this.currentIndex = 0;
						return;
					}

					// 标准化路径
					const normalizedPath = normalizePath(currentPath);
					
					// 【兼容性修复】设置 isCartPage 标志（虽然可能未使用，但为了兼容性保留）
					if (!currentPath.startsWith('/')) {
						currentPath = `/${currentPath}`;
					}
					this.isCartPage = (currentPath === '/pages/cart/cart');

					// 检查是否为TabBar页面
					const isTabBarPage = tabBarRoutes.some(route => {
						return normalizedPath === normalizePath(route);
					});

					if (isTabBarPage) {
						this.showTabBar = true;

						// 更新当前索引
						const index = tabBarRoutes.findIndex(route => {
							return normalizedPath === normalizePath(route);
						});

						if (index !== -1) {
							this.currentIndex = index;
						} else {
							// 【关键修复】如果找不到索引，使用默认首页
							this.currentIndex = 0;
						}
					} else {
						// 【关键修复】如果收到强制显示指令，即使不是tab页面也不隐藏
						if (!this.forceShowTab) {
							// 非 tab 页面时，如果不在强制显示模式，可以隐藏
							// 但为了更好的体验，我们仍然显示（使用默认首页）
							this.showTabBar = true;
							this.currentIndex = 0;
						} else {
							// 强制显示模式下，保持显示
							this.showTabBar = true;
						}
					}
					
					// 【兼容性修复】调用 checkTabBarVisibility（虽然已修复为始终显示，但为了兼容性保留）
					this.checkTabBarVisibility();
				} catch (e) {
					// 【关键修复】任何异常情况下，都确保显示 tab
					console.warn('updateActiveTab 执行失败:', e);
					this.showTabBar = true;
					this.currentIndex = 0;
				}
			},
			// 检查是否显示TabBar
			checkTabBarVisibility() {
				const pages = getCurrentPages();
				if (!pages.length) {
					// 【关键修复】即使获取不到页面，也确保显示
					this.showTabBar = true;
					return;
				}

				const currentPage = pages[pages.length - 1];
				if (!currentPage) {
					// 【关键修复】即使获取不到当前页面，也确保显示
					this.showTabBar = true;
					return;
				}

				let currentPath = currentPage.route || currentPage.$page?.route;
				if (!currentPath) {
					// 【关键修复】即使获取不到路径，也确保显示
					this.showTabBar = true;
					return;
				}

				if (!currentPath.startsWith('/')) {
					currentPath = `/${currentPath}`;
				}

				// 【关键修复】判断当前页面是否为TabBar页面，但即使不匹配也保持显示（确保tabbar始终可见）
				const isTabBarPage = tabBarRoutes.some(path => {
					return path === currentPath ||
						path === `/${currentPath}` ||
						path === currentPath.replace(/^\//, '');
				});
				
				// 【关键修复】无论是否匹配，都确保显示（这是核心要求：tabbar必须始终显示）
				this.showTabBar = true;
			},
			// 增强原生TabBar隐藏
			hideNativeTabBar() {
				const hide = () => {
					try {
						// 微信小程序
						if (typeof wx !== 'undefined' && wx.hideTabBar) {
							wx.hideTabBar({
								animation: false
							});
						}
						// 支付宝小程序
						if (typeof my !== 'undefined' && my.hideTabBar) {
							my.hideTabBar();
						}
						// 其他小程序
						if (uni.hideTabBar) {
							uni.hideTabBar({
								animation: false
							});
						}
					} catch (e) {
						console.error('隐藏原生TabBar出错:', e);
					}
				};

				// 多次尝试确保生效
				hide();
				setTimeout(hide, 100);
				setTimeout(hide, 500);
			},
			getIconPath(item, index) {
				  // 安卓专用处理
				        // #ifdef MP-WEIXIN
				        if (this.isAndroid) {
				          // 当前选中项直接返回路径（不加参数）
				          if (this.currentIndex === index) {
				            return item.selectedIconPath;
				          }
				          // 非选中项正常返回
				          return item.iconPath;
				        }
				        // #endif
				        
				        // 其他平台保持原逻辑
				        if (this.currentIndex === index) {
				          return `${item.selectedIconPath}?v=${this.iconVersion}`;
				        }
				        return item.iconPath;
			},
			
			
			 handleImageError(item, index) {
			        console.error('图片加载失败:', item.selectedIconPath);
			        
			        // 安卓专用回退方案
			        if (this.isAndroid && this.currentIndex === index) {
			          // 尝试回退到未选中图标
			          this.$set(this.list[index], 'selectedIconPath', item.iconPath);
			          this.iconVersion++;
			          
			          // 上报错误
			          uni.reportMonitor('TAB_ICON_ERROR', 1);
			        }
			},

			// 防抖函数
			debounce(func, wait) {
				let timeout;
				return function executedFunction(...args) {
					const later = () => {
						clearTimeout(timeout);
						func.apply(this, args);
					};
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
				};
			},
			// 更新安全区域
			// 修改 updateSafeArea 方法，增加错误处理和边界检查
			updateSafeArea() {
				try {
				// 如果已经锁定且缓存值存在，直接使用缓存值
				if (this.safeAreaLocked && cachedSafeAreaBottom !== null) {
					this.safeAreaInsets = cachedSafeAreaBottom;
					// #ifdef MP-WEIXIN
					// 小程序环境：检测 Android 平台
					const systemInfo = uni.getSystemInfoSync();
					const isAndroid = systemInfo.system && systemInfo.system.toLowerCase().includes('android');
					if (isAndroid) {
						// Android：确保 totalHeight 至少是 60px
						this.totalHeight = 50 + Math.max(cachedSafeAreaBottom, 10);
					} else {
						// iOS：减去 12 像素以贴合底部
						this.totalHeight = 50 + cachedSafeAreaBottom - 12;
					}
					// #endif
					// #ifndef MP-WEIXIN
					this.totalHeight = 50 + cachedSafeAreaBottom;
					// #endif
					return;
				}

					const systemInfo = uni.getSystemInfoSync();
					
					// 验证 systemInfo 是否有效
					if (!systemInfo || !systemInfo.screenHeight) {
						console.warn('系统信息无效，使用默认值');
						// #ifdef MP-WEIXIN
						const isAndroid = systemInfo && systemInfo.system && systemInfo.system.toLowerCase().includes('android');
						// #endif
						if (cachedSafeAreaBottom !== null) {
							this.safeAreaInsets = cachedSafeAreaBottom;
							// #ifdef MP-WEIXIN
							if (isAndroid) {
								// Android：确保 totalHeight 至少是 60px
								this.totalHeight = 50 + Math.max(cachedSafeAreaBottom, 10);
							} else {
								// iOS：减去 12 像素以贴合底部
								this.totalHeight = 50 + cachedSafeAreaBottom - 12;
							}
							// #endif
							// #ifndef MP-WEIXIN
							this.totalHeight = 50 + cachedSafeAreaBottom;
							// #endif
							this.safeAreaLocked = true;
						} else {
							this.safeAreaInsets = 0;
							// #ifdef MP-WEIXIN
							if (isAndroid) {
								this.totalHeight = 60;
							} else {
								this.totalHeight = 50 - 12;
							}
							// #endif
							// #ifndef MP-WEIXIN
							// #ifdef APP-PLUS
							this.totalHeight = 84;
							// #endif
							// #ifndef APP-PLUS
							this.totalHeight = 50;
							// #endif
							// #endif
						}
						return;
					}

					let calculatedInset = 0;

					// 小程序安全区域处理
					// #ifdef MP-WEIXIN
					if (systemInfo.safeArea && systemInfo.safeArea.bottom) {
						const bottomDiff = systemInfo.screenHeight - systemInfo.safeArea.bottom;
						// 验证计算结果的合理性
						if (bottomDiff >= 0 && bottomDiff <= SAFE_AREA_MAX) {
							calculatedInset = bottomDiff;
						} else {
							// 计算结果异常，使用缓存值或默认值
							if (cachedSafeAreaBottom !== null) {
								calculatedInset = cachedSafeAreaBottom;
							} else {
								calculatedInset = 0;
							}
						}
					}
					// #endif

			// #ifndef MP-WEIXIN
			// #ifdef APP-PLUS
			// iOS：优先使用 safeAreaInsets，如果不可用则尝试计算
			if (systemInfo.platform === 'ios') {
				if (systemInfo.safeAreaInsets && typeof systemInfo.safeAreaInsets.bottom === 'number' && systemInfo.safeAreaInsets.bottom > 0) {
					// 优先使用 safeAreaInsets.bottom，且必须大于 0
					calculatedInset = systemInfo.safeAreaInsets.bottom;
				} else if (systemInfo.safeArea && systemInfo.safeArea.bottom && systemInfo.screenHeight) {
					// 备用方案：通过 safeArea 计算
					const bottomDiff = systemInfo.screenHeight - systemInfo.safeArea.bottom;
					if (bottomDiff >= 0 && bottomDiff <= SAFE_AREA_MAX) {
						calculatedInset = bottomDiff;
					}
				}
				
				// iOS：如果计算值为 0，但设备应该有安全区域（iPhone X 及以后），使用缓存或默认值
				if (calculatedInset === 0 && cachedSafeAreaBottom !== null && cachedSafeAreaBottom > 0) {
					// 使用缓存值
					calculatedInset = cachedSafeAreaBottom;
				} else if (calculatedInset === 0 && systemInfo.screenHeight >= 812) {
					// iPhone X 及以后设备（屏幕高度 >= 812），默认安全区域约为 34px
					// 但如果缓存存在且有效，优先使用缓存
					if (cachedSafeAreaBottom !== null && cachedSafeAreaBottom > 0) {
						calculatedInset = cachedSafeAreaBottom;
					} else {
						// 使用默认值 34px（iPhone X 系列的标准安全区域）
						calculatedInset = 34;
					}
				}
			} else {
				// Android 和其他平台
				if (systemInfo.safeAreaInsets && typeof systemInfo.safeAreaInsets.bottom === 'number') {
					calculatedInset = systemInfo.safeAreaInsets.bottom;
				}
			}
			// #endif
			// #ifndef APP-PLUS
			if (systemInfo.safeAreaInsets && typeof systemInfo.safeAreaInsets.bottom === 'number') {
				calculatedInset = systemInfo.safeAreaInsets.bottom;
			}
			// #endif
			// #endif

					// 确保 calculatedInset 在合理范围内
					calculatedInset = Math.max(0, Math.min(calculatedInset, SAFE_AREA_MAX));

					// 如果计算值合理，更新缓存
					if (calculatedInset <= SAFE_AREA_MAX) {
						cachedSafeAreaBottom = calculatedInset;
						this.initialSafeAreaInsets = calculatedInset;
						this.safeAreaInsets = calculatedInset;
						// #ifdef MP-WEIXIN
						// 小程序环境：检测 Android 平台
						const isAndroid = systemInfo.system && systemInfo.system.toLowerCase().includes('android');
						if (isAndroid) {
							// Android：确保 totalHeight 至少是 60px（50px tabbar + 10px 最小底部间距）
							// calculatedInset 在 Android 上通常是 0，所以强制设置为至少 10px
							this.totalHeight = 50 + Math.max(calculatedInset, 10);
						} else {
							// iOS：减去 12 像素以贴合底部
							this.totalHeight = 50 + calculatedInset - 12;
						}
						// #endif
						// #ifndef MP-WEIXIN
						// #ifdef APP-PLUS
						// iOS 首帧安全区常为 0，用默认值避免 totalHeight=50 导致优惠券重叠；812 以上视为全面屏用 34，否则 0
						if (systemInfo.platform === 'ios') {
							const effectiveInset = calculatedInset > 0 ? calculatedInset : (systemInfo.screenHeight >= 812 ? 34 : 0);
							this.totalHeight = 50 + effectiveInset;
						} else {
							this.totalHeight = 50 + calculatedInset;
						}
						// #endif
						// #ifndef APP-PLUS
						this.totalHeight = 50 + calculatedInset;
						// #endif
						// #endif
						this.safeAreaLocked = true;
						return;
					}

				// 如果计算值异常，使用缓存值
				if (cachedSafeAreaBottom !== null) {
					this.safeAreaInsets = cachedSafeAreaBottom;
					// #ifdef MP-WEIXIN
					const isAndroid = systemInfo.system && systemInfo.system.toLowerCase().includes('android');
					if (isAndroid) {
						// Android：确保 totalHeight 至少是 60px
						this.totalHeight = 50 + Math.max(cachedSafeAreaBottom, 10);
					} else {
						// iOS：减去 12 像素以贴合底部
						this.totalHeight = 50 + cachedSafeAreaBottom - 12;
					}
					// #endif
					// #ifndef MP-WEIXIN
					this.totalHeight = 50 + cachedSafeAreaBottom;
					// #endif
					this.safeAreaLocked = true;
					return;
				}

				// 最后的后备方案
				this.safeAreaInsets = 0;
				// #ifdef MP-WEIXIN
				const isAndroid = systemInfo.system && systemInfo.system.toLowerCase().includes('android');
				if (isAndroid) {
					// Android：确保 totalHeight 至少是 60px
					this.totalHeight = 60;
				} else {
					// iOS：减去 12 像素以贴合底部
					this.totalHeight = 50 - 12;
				}
				// #endif
				// #ifndef MP-WEIXIN
				// #ifdef APP-PLUS
				this.totalHeight = 84;
				// #endif
				// #ifndef APP-PLUS
				this.totalHeight = 50;
				// #endif
				// #endif
				this.safeAreaLocked = false;

			} catch (e) {
				console.warn('安全区域计算失败:', e);
				// 【关键修复】高度计算失败不影响 tab 显示，使用默认高度
				const fallback = cachedSafeAreaBottom !== null ? cachedSafeAreaBottom : 0;
				this.safeAreaInsets = fallback;
				// #ifdef MP-WEIXIN
				try {
					const systemInfo = uni.getSystemInfoSync();
					const isAndroid = systemInfo.system && systemInfo.system.toLowerCase().includes('android');
					if (isAndroid) {
						// Android：确保 totalHeight 至少是 60px
						this.totalHeight = 50 + Math.max(fallback, 10);
					} else {
						// iOS：减去 12 像素以贴合底部
						this.totalHeight = 50 + fallback - 12;
					}
				} catch (err) {
					// 如果获取系统信息失败，默认使用 Android 逻辑（更安全）
					this.totalHeight = 50 + Math.max(fallback, 10);
				}
				// #endif
				// #ifndef MP-WEIXIN
				// #ifdef APP-PLUS
				// 异常时 fallback 常为 0，用 84 避免优惠券首帧重叠
				this.totalHeight = (fallback > 0 ? 50 + fallback : 84);
				// #endif
				// #ifndef APP-PLUS
				this.totalHeight = 50 + fallback;
				// #endif
				// #endif
				this.safeAreaLocked = true;
				// 【关键修复】确保高度计算失败时，tab 仍然显示（使用默认高度）
				if (this.totalHeight <= 0) {
					this.totalHeight = 60; // 使用默认高度
				}
			}
			},
			// 统一处理标签点击事件
			handleTabClick(item, index) {
				try {
					const now = Date.now();
					const timeDiff = now - this.lastTapTime;

				// 判断是否是双击（同一标签在300ms内被点击两次）
				if (timeDiff < 300 && this.lastTapIndex === index && this.currentIndex === index) {
					// 执行返回顶部操作
					// 检查当前页面路径，如果是 middles 页面，发送事件让页面自己处理
					const pages = getCurrentPages();
					const currentPage = pages[pages.length - 1];
					const currentRoute = currentPage ? currentPage.route : '';
					
					if (currentRoute && currentRoute.includes('middles')) {
						// 首页使用 scroll-view，通过事件通知页面返回顶部
						uni.$emit('scroll-to-top');
					} else {
						// 其他页面使用页面滚动
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 100,
							success: () => {
								console.log('已滚动到顶部');
							}
						});
					}
				} else {
					// 普通点击，执行页面切换
					this.switchTab(item, index);
				}

					// 更新点击记录
					this.lastTapTime = now;
					this.lastTapIndex = index;

				} catch (e) {
					console.error('Tab 点击处理出错:', e);
					// 尝试直接切换
					this.switchTab(item, index);
				}
			},
			
			
			// 新增瞬间滚动到顶部的方法
			scrollToTopInstantly() {
			  try {
			    // #ifdef H5
			    // 浏览器环境使用原生API
			    window.scrollTo({
			      top: 0,
			      behavior: 'instant' // 瞬间滚动（Chrome 73+支持）
			    });
			    // #endif
			    
			    // #ifdef APP-PLUS
			    // App环境使用plus.webview
			    const webview = plus.webview.currentWebview();
			    webview.scrollTo(0, 0, 0); // 第三个参数为滚动时间(ms)，0表示立即滚动
			    // #endif
			    
			    // #ifdef MP
			    // 小程序环境
			    uni.pageScrollTo({
			      scrollTop: 0,
			      duration: 0 // 滚动时间设为0
			    });
			    // #endif
			    
			    
			  } catch (e) {
			    console.error('滚动到顶部失败:', e);
			    //  fallback方案
			    uni.pageScrollTo({
			      scrollTop: 0,
			      duration: 100 // 最短的动画时间
			    });
			  }
			},
			
			// 单击切换页面
			switchTab(item, index) {
				try {
					// 解决首次点击状态不同步问题
					if (this.currentIndex === index) {
						this.iconVersion += 1;
						return;
					}

					// 【关键修复】立即更新 tab 状态，不等待任何操作
					// 这是最关键的一步：立即更新视觉状态
					this.currentIndex = index;
					this.iconVersion += 1;
					
					// 【关键修复】立即执行 switchTab，不调用 updateActiveTab
					// 因为 updateActiveTab 会根据 getCurrentPages() 获取当前页面
					// 但页面切换可能还没完成，会获取到旧页面，导致 currentIndex 被错误覆盖
					uni.switchTab({
						url: item.pagePath,
						success: () => {
							// 只发送事件，让页面自己的 onShow 触发 updateActiveTab
							uni.$emit('switch-tab');
						},
						fail: (err) => {
							console.error('切换页面失败:', err);
							// 切换失败时，延迟恢复正确的 tab 状态
							setTimeout(() => {
								this.updateActiveTab();
							}, 100);
						}
					});

				} catch (e) {
					console.error('切换 Tab 出错:', e);
					// 直接跳转作为后备，并立即更新状态
					this.currentIndex = index;
					this.iconVersion += 1;
					uni.switchTab({
						url: item.pagePath
					});
				}
			},

		}
	};
</script>

<style scoped>
	/* 容器样式 - 确保固定在底部 */
	.tabbar-container {
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		/* H5：若过高会盖住 uni-popup 蒙层(100000)，底部弹窗看起来「被截断」 */
		z-index: 10050 !important;
		/* #endif */
		/* #ifndef H5 */
		z-index: 99999998 !important; /* tabbar 层级必须最高（仅次于地址弹窗） */
		/* #endif */
		display: flex;
		flex-direction: column;
		background-color: transparent;
		/* 解决部分安卓机型显示问题 */
		transform: translateZ(0);
		/* 移除 !important，让动态样式生效 */
		/* #ifdef MP-WEIXIN */
		/* bottom 值通过动态样式 :style="{ bottom: tabbarBottom }" 设置 */
		bottom: 0rpx;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		bottom: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
		/* iOS/Android 防止键盘弹起时移动 */
		position: fixed !important;
		left: 0 !important;
		right: 0 !important;
		/* bottom值通过动态样式设置 */
		/* #endif */
		/* #ifdef H5 */
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		bottom: 0 !important;
		/* #endif */
	}



	/* 导航栏内容区域 */
	.custom-tabbar {

		display: flex;
		min-height: 200rpx;
		align-items: flex-start;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(5px);
		border-top: 1px solid rgba(238, 238, 238, 0.7);
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
		/* 解决iOS滑动穿透问题 */
		position: relative;
		/* #ifdef H5 */
		z-index: 1;
		/* #endif */
		/* #ifndef H5 */
		z-index: 99999998; /* 确保 tabbar 内容区域层级也足够高 */
		/* #endif */
		/* #ifdef MP-WEIXIN */
		min-height: 140rpx;
		align-items: flex-start;
		/* #endif */
	}

	/* 安全区域占位 - 使用CSS常量 */
	.safe-area {
		height: 0;
		background: transparent;
		/* #ifndef MP-WEIXIN */
		/* 非小程序环境使用 CSS 常量处理安全区域 */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		/* 小程序环境：totalHeight 已包含安全区域，不需要额外的 padding-bottom */
		/* 注意：totalHeight 在 Android 上已经包含了最小底部间距，所以这里不需要额外设置 */
		padding-bottom: 0;
		/* #endif */
	}

	/* 解决部分机型图标闪烁问题 */
	.icon {
		will-change: transform;
	}

	/* 增加点击区域 */
	.tab-item {
		padding: 10rpx 0;
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4px 0;

	}

	.icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 2px;
		transition: transform 0.2s ease;
		/* 添加过渡效果防止跳动 */

	}

	.active {
		color: #f23030;
		font-weight: 500;
	}
	  /* 新增安卓专用样式修复 */
	  /* #ifdef MP-WEIXIN */
	  .tab-item image {
	    will-change: unset !important;
	    backface-visibility: unset !important;
	    transform: translateZ(0);
	  }
	  
	  .custom-tabbar {
	    isolation: isolate;
	  }
	  
	  .icon {
	    background-color: transparent !important;
	    image-rendering: -webkit-optimize-contrast;
	  }
	  /* #endif */
</style>