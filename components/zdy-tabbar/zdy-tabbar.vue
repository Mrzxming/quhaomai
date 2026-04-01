<template>
	<view class="tabbar-container" :class="isIpx?'IpxBot':''">
		<block>
			<view class="tabbar-item" v-for="(item, index) in tabbarList"
				:class="[item.centerItem ? ' center-item' : '']" @click="changeItem(item)">
				<view v-if="index == 2 && isShowhong==true" class="hondian_class">
					<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_88D7EEA00B663FC1AE10D72749F9F9EF.png" style="height: 14rpx;width: 14rpx;"></image>
				</view>
				<view class="item-top">
					<image :src="currentItem == item.id ? item.selectIcon : item.icon"></image>
				</view>
				<view class="item-bottom" :class="[currentItem == item.id ? 'item-active' : '']">
					<text>{{ item.text }}</text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			currentPage: {
				type: Number,
				default: 0
			}
		},
		created() {
			// 判断为 iPhone X 给予底部距离
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					let modelmes = res.model;
					// console.log(modelmes)
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})

			if (uni.getStorageSync('token') != '' && uni.getStorageSync('token') != null) {
				uni.request({
					url: this.websiteUrl + '/api/chat/sessions',
					method: 'GET',
					data: {
						type: 1
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (ress) => {
						if (ress.data.status == 'success') {
							for (var ab = 0; ab < ress.data.data.length; ab++) {
								if (ress.data.data[ab].unread == true) {
									this.isShowhong = true
								}
							}
						}
					}
				})
			}
		},
		data() {
			return {
				//适配IPhoneX
				isIpx: false,
				currentItem: 0,
				tabbarList: [{
						id: 0,
						path: '/pages/middles/middles',
						icon: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/admin/images/tabbar/tabBar_5.png',
						selectIcon: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/admin/images/tabbar/tabBar_cur_5.png',
						text: '',
						centerItem: true
					}, {
						id: 1,
						path: '/packageIndex/index/index',
						icon: '/static/tabBar/tabBar_1.png',
						selectIcon: '/static/tabBar/tabBar_cur_1.png',
						text: '分类',
						centerItem: false
					},
					{
						id: 2,
						path: '/pages/chat/chat',
						icon: '/static/tabBar/tabBar_2.png',
						selectIcon: '/static/tabBar/tabBar_cur_2.png',
						text: '消息',
						centerItem: false
					},

					{
						id: 3,
						path: '/pages/cart/cart',
						icon: '/static/tabBar/tabBar_3.png',
						selectIcon: '/static/tabBar/tabBar_cur_3.png',
						text: '货单',
						centerItem: false
					},
					{
						id: 4,
						path: '/pages/user/user',
						icon: '/static/tabBar/tabBar_4.png',
						selectIcon: '/static/tabBar/tabBar_cur_4.png',
						text: '我的',
						centerItem: false
					}
				],
				isShowhong: false
			};
		},
		mounted() {
			this.currentItem = this.currentPage;
			uni.hideTabBar();
		},
		methods: {
			changeItem(item) {
				let _this = this;
				//_this.currentItem = item.id;
				if (uni.getStorageSync('token') != '' && uni.getStorageSync('token') != null) {
					uni.request({
						url: this.websiteUrl + '/api/chat/sessions',
						method: 'GET',
						data: {
							type: 1
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (ress) => {
							if (ress.data.status == 'success') {
								var abc = ress.data.data.find(item => item.unread == true);
								if (abc != undefined) {
									this.isShowhong = true
								} else {
									this.isShowhong = false
								}
								// for (var ab = 0; ab < ress.data.data.length; ab++) {
								// 	if (ress.data.data[ab].unread == false) {
								// 		this.isShowhong = false
								// 	}
								// }
							}
						}
					})
				}
				uni.switchTab({
					url: item.path
				});
			}
		}
	};
</script>
<style>
	view {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.tabbar-container {
		z-index: 99999999999;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		/* height: 80rpx; */
		box-shadow: 0 0 5px #d1d1d1;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		padding: 10rpx 0 5rpx 0;
		color: #1b1b1b;
	}

	.tabbar-container .tabbar-item {
		width: 20%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.tabbar-container .item-active {
		color: #FE0302;
	}

	.tabbar-container .center-item {
		display: block;
		position: relative;
	}

	.tabbar-container .tabbar-item .item-top {
		width: 50rpx;
		height: 50rpx;
		padding: 0rpx;
	}

	.tabbar-container .center-item .item-top {
		flex-shrink: 0;
		padding: 10rpx;
		width: 105rpx;
		height: 105rpx;
		position: absolute;
		top: -56rpx;
		left: calc(50% - 54rpx);
		border-radius: 50%;
		/* box-shadow: 0 0 5px #dfdfdf; */
	}

	.tabbar-container .tabbar-item .item-top image {
		width: 100%;
		height: 100%;
	}

	.tabbar-container .tabbar-item .item-bottom {
		font-size: 24rpx;
		width: 100%;
	}

	.tabbar-container .center-item .item-bottom {
		position: absolute;
		bottom: 0rpx;
	}

	/* 适配iPhone X */
	.IpxBot {
		padding-bottom: 60rpx !important;
	}

	.hondian_class {
		position: absolute;
		left: 53%;
		top: -16rpx;
	}
</style>