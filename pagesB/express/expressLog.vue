<template>
	<view class="kd-content" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
		<!-- 获取地图 -->
		<!-- <view class="" style="width: 100%;height: 100rpx;background-color: aliceblue;"> -->
		<map style="width: 100%;" scale="10" :latitude="latitude" :longitude="longitude" v-if="traceslist.length>0 && !ispush"
			:polyline="polyline" :markers="markers" :style="{ height: isMap? '60%' : '20%' }">
			<!--  :style="{ height: isMap? '70%' : '30%' }" -->
			<!-- <cover-image class="cover-view station" src="/static/map/shuaxin.png" @tap="toRenovate"></cover-image> -->
		</map>
		<!-- </view> -->

		<view class="content">
			<!-- 包裹信息 -->
			<view class="top">
				<!-- <view class="code">
					取件码 <text class="codeValue">16-1003</text>
				</view> -->
				<scroll-view class="" scroll-x="true" scroll-with-animation="true" :scroll-left="scrollLeft">
					<view class="numlist">
						<view class="numitem" v-for="(item,index) in numList" :key="index"
							:class="{ active: tabIndex == index }" @click="clickTab(item,index)">
							<view class="">
								<image :src="item.img" mode="widthFix"
									style="display: flex;align-items: center; width: 72rpx;height: 72rpx;margin-right: 16rpx;">
								</image>
							</view>
							<view class="numtitle">
								{{item.title}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 物流进度 -->
			<view class="express_content" style="margin-top:48rpx;">
				<view class="footer">
					<view class="head">
						<view class="name">
							<text>{{express}}</text>
							<text style="margin-left: 16rpx;">{{postid}}</text>
						</view>
						<view @click="copyText(postid)">复制</view>
					</view>
					<scroll-view class="warpper" :scroll-y="true" style="max-height: 900rpx;"
						@touchend="handleTouchEnd">
						<view class="list" style="position: relative;">
							<view id="result" class="result-list sortup" style="padding: 0rpx 32rpx 20rpx;"
								v-if="traces">
								<view class="item" v-for="(item, index) in traces" :key="index">
									<view class="col2"><text></text></view>
									<view class="col3">
										<view class="col4">
											<text>{{item.status}}</text>
											<text style="margin-left: 16rpx;">{{item.time}}</text>
										</view>
										<view class="col5" @click="handleClick(item.context)">
											{{ item.context }}
										</view>
										<!-- <view class="col5">
											<div v-html="formatPhone(item.context)">
											</div>
										</view> -->
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

		</view>
		
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
	const amap = require('@/utils/amap.js');
	// import mapGroup from '@/components/map/map.vue'
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				points: [],
				delivery_sn: 0,
				trackerItem: '',
				listData: '',
				dscLoading: '',
				traces: [],
				postid: '',
				numList: [],
				order_id: '',
				tabIndex: 0,
				scrollLeft: 0,
				express: '',
				latitude: '',
				longitude: '',
				polyline: [],
				points: [],
				showmap: false,
				markers: [],
				isMap: true,
				lat1: '',
				log2: '',
				lat2: '',
				log2: '',
				ispush: false, // 通知权限弹窗显示状态
				types: ['getDrivingRoute', 'getWalkingRoute', 'getTransitRoute', 'getRidingRoute'],
				typesfs: '',
				controls: [],
				parsedDataNodes: [],
				traceslist: [],
				scale: '16',
				startX: 0,
				startY: 0,

			}
		},
		components: {
			dscNotContent,
			// mapGroup
		},
		onLoad(e) {
			setTimeout(() => {
				this.postid = e.invoice_no
				this.order_id = e.order_id
				this.seeMore(e.order_id);
				this.getNum(e.order_id)
				// #ifndef H5
				this.initMap()
				// #endif
			}, 100)
		},
		onShow() {
			var that = this
			// 检查通知权限并显示弹窗（如果满足条件）
			that.checkNotificationPermission()
			// this.initMap()
		},
		methods: {
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
			handleTouchStart(event) {
				this.startX = event.touches[0].pageX;
				this.startY = event.touches[0].pageY;
				this.isMap = this.isMap
			},
			handleTouchMove(event) {
				// 可以在这里添加触摸移动时的处理逻辑
				this.isMap = this.isMap
			},
			handleTouchEnd(event) {
				const endX = event.changedTouches[0].pageX;
				const endY = event.changedTouches[0].pageY;
				const distanceX = this.startX - endX;
				const distanceY = this.startY - endY;
				if (Math.abs(distanceX) > Math.abs(distanceY)) {
					if (distanceX > 0) {} else {}
				} else {
					if (distanceY > 0) {
						this.isMap = false
					} else {
						this.isMap = true
						setTimeout(() => {

						})
					}
				}
			},
			initMap() {
				const map = uni.createMapContext('map');
				map.includePoints({
					points: this.polyline.points,
				});
			},
			handleClick(context) {
				const phoneRegex = /(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})/g;
				const matches = context.match(phoneRegex);
				if (matches) {
					matches.forEach((phoneNumber) => {
						uni.setClipboardData({
							data: phoneNumber,
							success: () => {
								uni.showToast({
									title: `${phoneNumber} 已复制`,
									icon: 'none'
								});
							}
						});
						setTimeout(() => {
							// #ifdef APP-PLUS
							uni.makePhoneCall({
								phoneNumber: phoneNumber,
								success: () => {},
								fail: () => {
									uni.showToast({
										title: '拨打电话失败',
										icon: 'none'
									});
								}
							});
							// #endif
						}, 1000)
					});
				}
			},

			scrollview(event) {
				let scrollLeft = event.detail.scrollLeft + 375;
				let scrllWidth = event.detail.scrollWidth;
				let left;
				if (scrollLeft < 395) {
					left = `65.625%`
				} else {
					left = `${(scrollLeft) / scrllWidth * 100}%`
				}
				this.leftscroll = left
			},
			getScrollW() {
				let query = uni.createSelectorQuery().in(this);
				query.select('.numlist').boundingClientRect(data => {
					this.contentScrollW = data.width
				}).exec()
				query.selectAll('.numitem').boundingClientRect(data => {
					let dataLen = data.length;
					for (let i = 0; i < dataLen; i++) {
						this.numList[i].left = data[i].left;
						this.numList[i].width = data[i].width
					}
				}).exec()
			},
			// 切换包裹
			clickTab(item, index) {
				var that = this
				this.tabIndex = index
				that.postid = item.invoice_no
				that.seeMore(item.invoice_no)
				this.scrollLeft = this.numList[index].left - this.contentScrollW / 2 + this.numList[index].width / 2;
			},
			// 包裹总数
			getNum() {
				let that = this;
				uni.request({
					url: this.websiteUrl + '/api/order/order_send_deliver_list',
					method: 'GET',
					data: {
						order_id: that.order_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status === 'success') {
							that.numList = res.data.data.trackerinfo
							that.tabIndex = that.numList.findIndex(item => item.invoice_no === that.postid);
						}
					}
				})
			},

			// 物流进度
			seeMore() {
				let that = this;
				uni.request({
					url: this.websiteUrl + '/api/order/tracker',
					method: 'GET',
					data: {
						type: 1,
						postid: that.postid,
						order_id: that.order_id,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log(res.data)
						if (res.data.status === 'success') {
							that.traces = res.data.data.traces
							that.express = res.data.data.express
							that.traceslist = res.data.data.traceslist.reverse()
							const coordinates = that.traceslist.map(item => {
								return {
									latitude: item[1],
									longitude: item[0]
								};
							});
							that.points = that.unique(coordinates)
							this.latitude = this.points[0].latitude
							this.longitude = this.points[0].longitude
							const length = this.points.length - 1

							const taskline = {
								points: this.points,
								color: "#FE0302",
								width: 6,
								arrowLine: true
							}
							const markers0 = {
								// latitude: this.points[0].latitude,
								// longitude: this.points[0].longitude,
								latitude: this.points[length].latitude,
								longitude: this.points[length].longitude,
								id: 0,
								iconPath: '/pagesC/static/express/fa1.png',
								width: 40,
								height: 50
							}
							const markers1 = {
								latitude: this.points[0].latitude,
								longitude: this.points[0].longitude,
								// latitude: this.points[length].latitude,
								// longitude: this.points[length].longitude,
								id: 1,
								iconPath: '/pagesC/static/express/car.png',
								width: 40,
								height: 50
							}
							this.markers.push(markers0)
							this.markers.push(markers1)
							// console.log(this.markers)
							this.polyline[0] = taskline
						} else {
							// console.log(res);
							uni.showToast({
								icon: 'none',
								title: res.data.errors.message
							})
						}
					}
				})
			},
			mapGetCenter: function(pointArray) {
				var that = this
				var sortedLongitudeArray = []
				var sortedLatitudeArray = []
				for (var a = 0; a < pointArray.length; a++) {
					sortedLongitudeArray.push(pointArray[a].longitude)
					sortedLatitudeArray.push(pointArray[a].latitude)
				}
				sortedLongitudeArray.sort()
				sortedLatitudeArray.sort()
				var centerLongitude = ((parseFloat(sortedLongitudeArray[0]) + parseFloat(sortedLongitudeArray[
					sortedLongitudeArray.length - 1])) / 2).toFixed(6);
				var centerLatitude = ((parseFloat(sortedLatitudeArray[0]) + parseFloat(sortedLatitudeArray[
					sortedLatitudeArray.length - 1])) / 2).toFixed(6);
				that.longitude = centerLongitude
				that.latitude = centerLatitude
			},
			unique: function(arr) {
				const res = new Map()
				return arr.filter((a) => !res.has(a.latitude) && res.set(a.latitude, 1) && !res.has(a.longitude) && res
					.set(a.longitude, 1))
			},
			GetDistance: function(lat1, lng1, lat2, lng2) {
				var that = this
				var radLat1 = lat1 * Math.PI / 180.0;
				var radLat2 = lat2 * Math.PI / 180.0;
				var a = radLat1 - radLat2;
				var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				if (s < 1200) {
					this.typesfs = 'getRidingRoute'
				} else {
					this.typesfs = 'getDrivingRoute'
				}
				that.markers = that.markers
				var zoom = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000,
					20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000
				]
				for (var i = 0; i < zoom.length; i++) {
					if (zoom[i] - s > 0) {
						that.scale = 18 - i + 3
						return;
					}
				}
			},
			copyText(e) {
				let data = e.toString();
				uni.setClipboardData({
					data: data,
					success: function() {
						uni.getClipboardData({
							success: function() {
								uni.showToast({
									title: '复制成功'
								})
							}
						})
					}
				});
			},
		},

	}
</script>

<style scoped>
	.kd-content {
		height: 100%;

	}

	.content {
		padding: 36rpx 32rpx;
	}

	.header {
		background: #fff;
		height: 120upx;
		border-radius: 20upx;
		box-shadow: 4upx 0px 16upx 4upx rgba(0, 0, 0, .1);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin: 20upx 10upx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 11;
	}

	.header .left {
		margin: 0 20upx;
	}

	.header .content {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 20upx;
	}

	.header .content .data-img {
		width: 80upx;
		height: 80upx;
	}

	.header .content .data-img image {
		height: 100%;
		width: 100%;
	}

	.header .content .text {
		margin-left: 20upx;
	}

	.header .right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header .right .kefu {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.header .right .kefu text {
		font-size: 20upx;
		color: #999;
	}

	.header .right .icon-gengduo1 {
		margin: 0 30upx;
	}



	.footer {
		height: calc(100% - 160upx);
		padding-top: 30upx;

		background: #fff;
		border-radius: 20upx;
	}

	.head {
		background: #fff;
		border-radius: 20upx;
		margin: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer .warpper {
		position: relative;
		height: 100%;
	}

	.footer .info {
		background: #fff;
		border-radius: 20upx;
		padding: 20upx;
		margin: 0 10upx 20upx;
	}

	.footer .info .item {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 28upx;
		line-height: 2;
		color: #666;
	}

	.footer .info .item .value {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.footer .info .item .value .copy {
		margin-left: 40upx;
		cursor: pointer;
		color: #007AFF;
	}

	.footer .list {
		background: #fff;
		border-radius: 20upx;
		/* background: #fff;
		border-radius: 20upx 20upx 0 0;
		margin: 0 10upx; */
	}

	.footer .list .result-list {
		position: relative;
		border-radius: 10rpx;
	}

	.footer .list .result-list .item {
		border: 0;
		display: flex;
		flex-direction: row;
		color: #828282;
		font-size: 24rpx;
		color: #A2A2A2;
		line-height: 24rpx;
		text-align: left;
		font-style: normal;
	}

	.footer .list .result-list .item view {
		line-height: 1.5;
	}

	.footer .list .result-list .item .col1 {
		padding: 20upx;
		width: 200upx;
		text-align: center;
		box-sizing: border-box;
		font-size: 26upx;
		font-weight: 700;
	}

	.footer .list .result-list .item .col2 {
		position: relative;
		width: 40upx;
	}

	.footer .list .result-list .item .col2 text {
		border: 1px solid #e6e6e6;
		border-radius: 50%;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -.5rem;
		width: 1rem;
		height: 1rem;
		background: #FFF;
		z-index: 2;
		color: #e6e6e6;
	}

	.footer .list .result-list .item .col2 text::before {
		position: absolute;
		top: 50%;
		left: 50%;
		content: '';
		width: 6px;
		height: 6px;
		margin-top: -2px;
		border-left: 1px solid;
		border-bottom: 1px solid;
		transform: translate(-50%, 0) rotate(135deg);
	}

	.footer .list .result-list .item .col3 {
		padding: 20upx;
		flex: 1;
		display: flex;
		position: relative;
		flex-direction: column;
	}

	.footer .list .result-list .item .col3::before {
		content: '';
		position: absolute;
		top: -2rem;
		bottom: -2rem;
		left: -12px;
		border-left: 1px solid #e6e6e6;
	}

	.footer .list .result-list .item .col4 {
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
	}

	.footer .list .result-list .item .col5 {
		font-weight: 400;
		font-size: 24rpx;
		color: #A2A2A2;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		margin-top: 6rpx;
	}

	.footer .list .result-list .item:first-child .col3 text {
		color: #FE0302;
	}

	.footer .list .result-list .item:first-child .col2 text {
		border-color: #FE0302;
		color: #FE0302;
	}

	.footer .list .result-list .item:first-child .col3::before {
		top: 50%;
	}

	.footer .list .result-list .item:last-child .col3::before {
		bottom: 50%;
	}

	.numlist {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: nowrap;
		height: 100rpx;

	}

	.numitem {
		/* min-width: 290rpx; */
		/* width: 302rpx; */
		/* height: 88rpx; */
		padding: 8rpx 16rpx;
		background: #EDEDED;
		border-radius: 12rpx;
		margin-right: 16rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background: #EDEDED;
	}

	.numitem.active {
		border: 1rpx solid #FD3E3C;
		color: #FFB211;
		background: #FFF4F4;
	}

	.numtitle {
		width: 192rpx;
		height: 28rpx;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
	}

	.top {}

	.code {
		/* width: 96rpx;
		height: 32rpx; */
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		margin-bottom: 28rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.codeValue {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 56rpx;
		color: #1B1B1B;
		line-height: 40rpx;
		text-align: left;
		font-style: normal;
		margin-left: 16rpx;
	}




	.phone {
		cursor: pointer;
		color: blue;
	}

	.move {
		transition: height 1s;
		-moz-transition: height 1s;
		-webkit-transition: height 1s;
		-o-transition: height 1s;
		overflow: hidden;
	}






	/* .footer{ height: calc(100% - 160upx); padding-top: 160upx;}
.footer .warpper{ position: relative; height: 100%; }
.footer .info{ background: #fff; border-radius: 20upx; padding: 20upx; margin: 0 10upx 20upx;}
.footer .info .item{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; font-size: 28upx; line-height: 2; color: #666; }
.footer .info .item .value{ flex: 1; display: flex; flex-direction: row; justify-content: space-between;}
.footer .info .item .value .copy{ margin-left: 40upx; cursor: pointer; color: #007AFF;}

.footer .list{ background: #fff; border-radius: 20upx 20upx 0 0; margin: 0 10upx;}
.footer .list .result-list{ position: relative;}
.footer .list .result-list .item{ border: 0; font-size: 28upx; display: flex; flex-direction: row; color: #828282;}
.footer .list .result-list .item view{ line-height: 1.5;}
.footer .list .result-list .item .col1{ padding: 20upx; width: 200upx; text-align: center; box-sizing: border-box; font-size: 26upx; font-weight: 700;}
.footer .list .result-list .item .col2{ position: relative; width: 40upx;}
.footer .list .result-list .item .col2 text{ border: 1px solid #e6e6e6; border-radius: 50%; position: absolute; left: 0; top: 50%; margin-top: -.5rem; width: 1rem; height: 1rem; background: #FFF; z-index: 2; color: #e6e6e6; }
.footer .list .result-list .item .col2 text::before{ position: absolute; top: 50%; left: 50%; content: ''; width: 6px; height: 6px; margin-top: -2px; border-left: 1px solid; border-bottom: 1px solid; transform: translate(-50%, 0) rotate(135deg);}
.footer .list .result-list .item .col3{ padding: 20upx; flex: 1; display: flex; align-items: center; position: relative;}
.footer .list .result-list .item .col3::before{ content: ''; position: absolute; top: -2rem; bottom: -2rem; left: -12px; border-left: 1px solid #e6e6e6;}

.footer .list .result-list .item:first-child{ color: #ff7800;}
.footer .list .result-list .item:first-child .col2 text{ border-color: #ff7800; color: #ff7800;}
.footer .list .result-list .item:first-child .col3::before{ top: 50%;}
.footer .list .result-list .item:last-child .col3::before{ bottom: 50%;} */

	/* 通知权限弹窗 - 底部弹出样式 */
	.notification-modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999;
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
		z-index: 100000;
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