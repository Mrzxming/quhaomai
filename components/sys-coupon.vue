<template>
	<view>
		<view class="sys-coupon-wrap" :style="{bottom: bottomValue}" v-if="isShow">
			<!-- <view class="sys-coupon-wrap" v-if="isShow"> -->
			<image class="img-red-envelope" src="/pagesC/static/red_packet@2x.png"></image>


			<view class="sys-coupon-hint">

				您有
				<text class="txt-hint">{{couMoney}}元</text>
				红包


				<view class="time-layout">

					<view class="time-wrapper">
						<text class="time-text">{{timeDifference}}</text>
					</view>

					<text class="expire-text">后失效</text>
				</view>
			</view>
			<view class="uni-flex">
				<button class="u-reset-button btn-go-use" @click="goCouponPage()">去使用</button>
				<uni-icons type="closeempty" size="20" color="#F44C36" @click="closeCoupon()"></uni-icons>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "sys-coupon",
		props: {
			type: {
				type: Number,
				default: 0
			},
			// 详情页同父级时直接传底部栏 height（如 115rpx），与 submit_bar 的 :style="{height: bottomValue}" 一致，无缝隙
			detailBarHeight: {
				type: String,
				default: ''
			},
		},
		computed: {
			bottomValue() {
				// 详情页：同父级时直接用父级传的底部栏高度，与按钮栏完全一致，零缝隙
				if (this.detailBarHeight) {
					return this.detailBarHeight;
				}
				// 优先使用动态传入的「需要预留的距离」（tabbar / 提交栏 offset，单位 rpx）
				if (this.tabbarHeightRpx > 0) {
					let r = this.tabbarHeightRpx;
					if (this.platformType === 'H5' && r < 100) r = 100;
					console.log('[coupon] bottomValue 使用 tabbarHeightRpx=', this.tabbarHeightRpx, '→ bottom=', r + 'rpx');
					return r + 'rpx';
				}

				// 兜底：根据 safeArea 粗略估算（主要用于极端 fallback 场景）
				if (!this.deviceInfo) {
					return this.platformType === 'H5' ? '100rpx' : '100rpx';
				}

				const { safeAreaInsets, screenWidth } = this.deviceInfo;

				let safeAreaBottom = 0;
				if (safeAreaInsets && typeof safeAreaInsets.bottom === 'number') {
					safeAreaBottom = safeAreaInsets.bottom;
				}

				const safeAreaRpx = safeAreaBottom > 0 ? (safeAreaBottom * 750) / (screenWidth || 375) : 0;
				let tabbarHeightRpx = 100 + Math.round(safeAreaRpx);
				if (this.platformType === 'H5' && tabbarHeightRpx < 100) tabbarHeightRpx = 100;

				return tabbarHeightRpx + 'rpx';
			}

		},
		data() {
			return {
				isRequesting: false, // 防止重复请求
				requestCooldown: 30000, // 30秒冷却时间
				couponLst: [],
				isShow: false,
				timeDifference: '',
				couMoney: '',
				mInterval: null,
				timeLeft: 0,
				deviceInfo: null, // 存储设备信息
				platformType: '', // 存储编译平台类型
				tabbarHeightRpx: 0 // 动态获取 / 外部传入的底部栏高度（rpx）
			};
		},
		created() {
			console.log('[coupon] created（切回首页会重新创建，此处会再打一次）');
			this.getUserCoupon();
			// 设置编译平台类型
			// #ifdef MP-WEIXIN
			this.platformType = 'mp-weixin';
			// #endif
			// #ifdef APP-PLUS
			this.platformType = 'app';
			// #endif
			// #ifdef H5
			this.platformType = 'H5';
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.deviceInfo = res;
					// iOS 12 兼容处理
					if (res.system.includes('iOS 12') && this.platformType === '') {
						this.platformType = res.platform === 'ios' ? 'app' : 'mp-weixin';
					}
					// 保留一次 DOM 查询作为兜底，真正精确的高度通过 tabbar/详情页事件传入
					this.$nextTick(() => {
						setTimeout(() => {
							this.getTabbarHeight();
						}, 500);
					});
				}
			});

			// 监听 tabbar 和商品详情底部操作栏广播的高度（px），统一换算为 rpx 作为 bottom
			uni.$on('tabbar-height', this.handleBottomBarHeight);
			uni.$on('submitbar-height', this.handleBottomBarHeight);
		},
		beforeDestroy() {
			console.log('beforeDestroy');
			this.clearMInterval();
			uni.$off('tabbar-height', this.handleBottomBarHeight);
			uni.$off('submitbar-height', this.handleBottomBarHeight);
		},
		watch: {
			// 当优惠券显示时，重新获取 tabbar 高度
			isShow(newVal) {
				if (newVal) {
					// 优惠券显示时，延迟获取 tabbar 高度，确保 tabbar 已渲染
					this.$nextTick(() => {
						setTimeout(() => {
							this.getTabbarHeight();
						}, 100);
						setTimeout(() => {
							this.getTabbarHeight();
						}, 500);
					});
				}
			}
		},
		methods: {
			// 统一处理 tabbar / 提交栏高度事件
			// 支持两种 payload:
			// 1) { offsetPx } - 已经是「需要预留的总高度」（tabbarHeight + bottom 偏移）
			// 2) { height }   - 只有高度的旧形式，作为退化处理
			handleBottomBarHeight(payload) {
				if (!payload || !this.deviceInfo) return;

				const screenWidth = this.deviceInfo.screenWidth || 375;
				let px = 0;

				if (typeof payload.offsetPx === 'number') {
					px = payload.offsetPx;
				} else if (typeof payload.height === 'number') {
					px = payload.height;
				} else {
					return;
				}

				const rpx = Math.round((px * 750) / screenWidth);
				this.tabbarHeightRpx = rpx;
				this.$forceUpdate();
				console.log('[coupon] 事件 tabbar-height 收到 offsetPx=', px, '→ 设置 tabbarHeightRpx=', rpx, '（初始化会收到，切回首页通常收不到）');
			},
			// 动态获取底部操作栏（tabbar 或商品详情页底部操作栏）的高度和位置
			getTabbarHeight() {
				// 获取当前页面实例，在页面作用域下查询（组件内默认只查组件自身，查不到兄弟节点的 .tabbar-container）
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				if (!page) {
					console.warn('getTabbarHeight: 无法获取当前页面实例');
					return;
				}

				// 多次尝试获取，确保能获取到
				const tryGetHeight = (attempt = 0) => {
					if (attempt > 10) {
						console.log('尝试获取底部操作栏高度失败，使用计算值');
						return; // 最多尝试10次
					}

					// 与事件 handleBottomBarHeight 用同一屏宽，保证 rpx 一致（切回首页无缝隙）
					const screenWidth = this.deviceInfo?.screenWidth || (uni.getSystemInfoSync && uni.getSystemInfoSync().screenWidth) || 375;
					const pxToRpx = (px) => Math.round((px * 750) / screenWidth);

					// 在「当前页面」作用域下查询，先查商品详情页底部操作栏，再查 tabbar
					const query1 = uni.createSelectorQuery().in(page);
					query1.select('.submit_bar').boundingClientRect((submitBarRect) => {
						if (submitBarRect && submitBarRect.height && submitBarRect.height > 0) {
							// 用底部操作栏高度直接作为优惠券 bottom（px 转 rpx），避免 top 坐标系差异
							const newHeight = pxToRpx(submitBarRect.height);
							this.$set(this, 'tabbarHeightRpx', newHeight);
							this.$forceUpdate();
							console.log('✅ 成功获取到商品详情页底部操作栏信息:');
							console.log('   - 操作栏高度:', submitBarRect.height, 'px → bottom:', newHeight, 'rpx');
							return;
						}

						// 没有找到商品详情页的底部操作栏，尝试查找 tabbar（首页等带 tabbar 的页面）
						const query2 = uni.createSelectorQuery().in(page);
						query2.select('.tabbar-container').boundingClientRect((tabbarRect) => {
							if (tabbarRect && tabbarRect.height && tabbarRect.height > 0) {
								// 与 tabbar-height 事件一致：事件发的是 totalHeight(84)，用 height 保证初始化与切回首页同一数值，无缝隙
								const px = tabbarRect.height;
								const newHeight = pxToRpx(px);
								this.$set(this, 'tabbarHeightRpx', newHeight);
								this.$forceUpdate();
								console.log('[coupon] getTabbarHeight 设置 tabbarHeightRpx=', newHeight, '（tabbarRect.height=', px, 'px, screenWidth=', screenWidth, '，切回首页时优惠券只依赖此次结果）');
							} else {
								console.log('❌ 第', attempt + 1, '次尝试获取底部操作栏高度失败');
								// 如果获取不到，延迟重试
								setTimeout(() => {
									tryGetHeight(attempt + 1);
								}, 300);
							}
						}).exec();
					}).exec();
				};

				tryGetHeight();
			},
			getBottomValue() {
				// 如果设备信息未获取到，默认返回一个安全值
				if (!this.deviceInfo) return '100rpx';
				console.log('j', platform)
				const {
					platform,
					system
				} = this.deviceInfo;
				const isIOS = system.includes('iOS'); // 判断是否为iOS系统
				const isAndroid = system.includes('Android'); // 判断是否为Android系统

				// 1. 微信小程序场景（platform === 'mp-weixin'）
				if (platform === 'mp-weixin') {
					console.log('mp-weixin', platform)
					// iOS系统的微信小程序
					if (isIOS) {
						return '136rpx'; // 你原来设置的微信小程序iOS值
					}
					// Android系统的微信小程序
					else if (isAndroid) {
						return '136rpx'; // 可根据实际需求调整（如果和iOS不同）
					}
				}

				// 2. APP场景（platform === 'ios' 或 'android'）
				else if (platform === 'ios' || platform === 'android') {
					console.log('app', platform)
					console.log
					// iOS系统的APP
					if (isIOS) {
						return '156rpx'; // iOS APP的bottom值
					}
					// Android系统的APP
					else if (isAndroid) {
						console.log('appisAndroid', platform)
						return '100rpx'; // Android APP的bottom值
					}
				}

				// 3. H5场景（补充适配）
				else if (platform === 'h5') {
					return '100rpx'; // 你原来设置的H5值
				}
				console.log('wu', platform)
				// 其他未知场景（默认值）
				return '100rpx';
			},
			async getUserCoupon() {
							if (this.isRequesting) return;
							
							try {
								this.isRequesting = true;
								
								const { data, status } = await this.$store.dispatch('getUserCoupon', {
									page: 1,
									size: 10,
									type: 0,
									coupon_type: 1
								});
								
								if (data && data.length > 0) {
									this.couponLst = data[0] || [];
									// 传递完整新人券列表，供商品详情页计算最优优惠金额
									this.$emit('sys-coupon-data', data);
									
									let coupon = data[0];
									this.couMoney = coupon.cou_money;
									
									// 使用 valid_time 作为真实的结束时间（秒数时间戳）
									let validTime = coupon.valid_time * 1000;
									let cTime = new Date().getTime();
									let differenceInMillis = validTime - cTime;
									
									if (differenceInMillis > 0) {
										// 传入 valid_time（秒数时间戳）作为真实结束时间
										this.setDifferenceInMillisInterval(coupon.valid_time);
										this.isShow = true;
									} else {
										// 优惠券已过期，直接隐藏
										this.isShow = false;
										this.$emit('coupon-expired');
									}
								} else {
									// 没有优惠券，隐藏
									this.isShow = false;
									this.$emit('no-coupon');
								}
							} catch (error) {
								console.error('获取优惠券失败:', error);
								this.isShow = false;
							} finally {
								this.isRequesting = false;
							}
						},

  handleCouponExpired() {
    this.isShow = false;
    this.clearMInterval();
    
    // 设置冷却时间，避免立即重新请求
    setTimeout(() => {
      this.isRequesting = false;
    }, this.requestCooldown);
  },
 handleNoCoupon() {
    this.isShow = false;
    this.clearMInterval();
  },

			setDifferenceInMillisInterval(endTimeStamp) {
							this.clearMInterval();
							
							// 判断是秒数时间戳还是毫秒数时间戳
							// 如果小于 13 位数字，说明是秒数，需要乘以 1000
							let endDate;
							if (typeof endTimeStamp === 'number') {
								// 数字类型：判断是秒数还是毫秒数
								if (endTimeStamp < 1000000000000) {
									// 小于 13 位，是秒数时间戳，需要乘以 1000
									endDate = new Date(endTimeStamp * 1000);
								} else {
									// 大于等于 13 位，是毫秒数时间戳
									endDate = new Date(endTimeStamp);
								}
							} else if (typeof endTimeStamp === 'string') {
								// 字符串类型：尝试解析
								// 如果是纯数字字符串，可能是时间戳
								if (/^\d+$/.test(endTimeStamp)) {
									const num = parseInt(endTimeStamp);
									if (num < 1000000000000) {
										endDate = new Date(num * 1000);
									} else {
										endDate = new Date(num);
									}
								} else {
									// 日期字符串，直接解析
									endDate = new Date(endTimeStamp);
								}
							} else {
								// 其他类型，尝试直接解析
								endDate = new Date(endTimeStamp);
							}
							
							const update = () => {
								const currentTime = new Date();
								const realDifferenceInMillis = endDate - currentTime;  // 到真实结束时间的剩余时间
								
								// 检查时间是否已经过期（到达 valid_time）
								if (realDifferenceInMillis <= 0) {
									// 优惠券已过期，再请求一次确认状态
									this.isShow = false;
									this.clearMInterval();
									this.$emit('coupon-expired');
									return;
								}
								
								// 判断剩余时间是否大于24小时
								const oneDayInMillis = 24 * 60 * 60 * 1000;  // 24小时的毫秒数
								let displayDifferenceInMillis;
								
								if (realDifferenceInMillis > oneDayInMillis) {
									// 剩余时间 > 24小时：显示距离今天24点（0点）还有多少时间
									// 获取今天的24点（明天的0点）
									const todayEnd = new Date(currentTime);
									todayEnd.setHours(24, 0, 0, 0);  // 设置为今天的24点（即明天的0点）
									
									// 计算距离今天24点还有多少时间
									displayDifferenceInMillis = todayEnd - currentTime;
									
									// 如果已经过了24点，计算距离明天24点的时间
									if (displayDifferenceInMillis <= 0) {
										todayEnd.setDate(todayEnd.getDate() + 1);  // 加一天
										displayDifferenceInMillis = todayEnd - currentTime;
									}
								} else {
									// 剩余时间 <= 24小时：显示到 valid_time 的精确倒计时
									displayDifferenceInMillis = realDifferenceInMillis;
								}
								
								// 时间分量计算
								const hours = Math.floor(displayDifferenceInMillis / 3600000);
								const remainingAfterHours = displayDifferenceInMillis % 3600000;
								const minutes = Math.floor(remainingAfterHours / 60000);
								const remainingAfterMinutes = remainingAfterHours % 60000;
								const seconds = Math.floor(remainingAfterMinutes / 1000);
								const milliseconds = Math.floor((remainingAfterMinutes % 1000) / 100);
								
								// 格式化显示
								const format = (num) => num.toString().padStart(2, '0');
								this.timeDifference = `${format(hours)}:${format(minutes)}:${format(seconds)}.${milliseconds}`;
								
								// 继续下一次更新
								this.mInterval = setTimeout(update, 100);
							};
							
							this.mInterval = setTimeout(update, 100);
						},

			clearMInterval() {
			  if (this.mInterval) {
			    clearTimeout(this.mInterval);
			    this.mInterval = null;
			  }
			},
			// clearMInterval() {
			// 	if (this.mInterval) clearInterval(this.mInterval);
			// },
			closeCoupon() {
				console.log(0)
				this.clearMInterval();
				this.isShow = false;
			},
			goCouponPage() {
				uni.navigateTo({
					url: '/pagesB/coupon/coupon'
				})
			},


		}
	}
</script>

<style lang="scss" scoped>
	.sys-coupon-wrap {
		position: fixed;
		left: 0;
		right: 0;

		display: flex;
		height: 80rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 15rpx;
		z-index: 50; /* 高于公告(z-index:2)，但低于弹窗(z-index:99/999) */
		border-radius: 10px;
		background-color: rgb(252, 238, 232);
		box-sizing: border-box;
		will-change: transform;
		/* 创建新的 stacking context，确保层级不受父元素影响 */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		/* 确保在滚动时也能正确显示 */
		pointer-events: auto;


		.img-red-envelope {
			width: 30rpx;
			height: 40rpx;
			margin: 0 15rpx;
		}

		.sys-coupon-hint {
			flex: 1;
			font-weight: 400;
			font-size: 28rpx;
			color: #4D4B4B;


			.txt-hint {
				color: #F44C36;
			}
		}

		.uni-flex {
			height: 100%;
			align-items: center;
		}

		.btn-go-use {
			display: flex;
			height: 40rpx;
			width: 110rpx;
			justify-content: center;
			align-items: center;
			font-size: 22rpx;
			color: rgb(237, 107, 64);
			margin-right: 25rpx;
			border: 1px solid rgb(237, 107, 64);
			border-radius: 20rpx;
			background-color: rgb(252, 238, 232);
			background: none;
		}

		.img-close {
			width: 40rpx;
			height: 40rpx;
		}

		.sys-coupon-hint {
			display: flex;
			align-items: center;
			flex: 1;
			font-size: 24rpx;
			/* 适当调小字体 */
			white-space: nowrap;
			/* 防止换行 */
			/* 新增以下样式 */
			font-variant-numeric: tabular-nums;
			/* 等宽数字 */
			letter-spacing: 0.5px;
			/* 保持字符间距稳定 */
			backface-visibility: hidden;
			/* 避免字体渲染抖动 */
			transform: translateZ(0);
			/* 硬件加速 */
		}
	}



	.time-layout {
		position: relative;
		/* 定位基准 */
		display: inline-block;
		vertical-align: bottom;
	}

	.time-wrapper {
		/* 固定宽度（根据最大时间文本计算） */
		width: 220rpx;
		/* 示例：23:59:59.99 的实测宽度 */
		text-align: right;
		/* 右对齐避免左侧晃动 */
		font-variant-numeric: tabular-nums;
		/* 强制等宽字体（iOS/Android兼容方案） */
		font-family: Monaco, Consolas, "Courier New", monospace;

		.time-text {
			font-weight: bold;
			font-size: 14px;
			color: #FE2F02;
			margin: 0 16rpx;
			font-variant-numeric: tabular-nums;
			/* 等宽数字 */
			min-width: 86rpx;
			/* 根据最大时间宽度设定 */
			text-align: right;
			/* 右对齐保持宽度稳定 */
		}
	}

	.expire-text {
		position: absolute;
		/* 脱离文档流 */
		left: 240rpx;
		/* 放置在时间文本右侧 */
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		backface-visibility: hidden;
	}

	.time-text {
		display: inline-block;
		min-width: 180rpx; // 固定宽度防止布局抖动
		font-feature-settings: "tnum"; // 启用等宽数字（兼容性更好）
		transform: translateZ(0); // 触发GPU加速
		will-change: transform; // 提示浏览器优化
	}
</style>