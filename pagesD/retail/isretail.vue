<template>
	<view class="container">
		<!-- 申请理由 -->
		<view class="box">
			<view class="title" style="margin-top: 10rpx;">
				申请理由
			</view>
			<view class="content">
				<view class="aaa">
					<textarea placeholder="请简要说明您有什么资源可以分销" class="itemtitle" name="reason"
						placeholder-style="color:#999999;font-size:28rpx; " v-model="reason" maxlength="300"></textarea>
					<view class="conlen">{{ length }}/300</view>
				</view>

			</view>
		</view>
		<!-- 申请原因 -->
		<view class="box">
			<view class="title">
				证明材料 <text
					style="margin-left: 16rpx; font-weight: 400;font-size: 28rpx;color: #999999;line-height: 32rpx;text-align: left;">（最多可上传3张图片）</text>
			</view>
		</view>
		<view class="icon-content">
			<view class="icon-item" v-for="(item, index) in photoList" :key="index">
				<view class="itemlist" style="width: 100%;display: flex;justify-content: space-between;">
					<view class="">
						<image :src="item" style="height: 176rpx;width: 176rpx;" @click="handesImage(index)"></image>
					</view>
					<view class="radios" @click="cutCheckeds(index,item)">
						<image src="/pagesC/static/closec.png" style="height: 40rpx;width: 40rpx;border-radius: 50rpx;">
						</image>
					</view>
				</view>
			</view>
			<view style="margin:10rpx;" @click="goAdd">
				<image src="https://images.eqingqu.com/attachs/photo/202507/20250711_310E136630DB84DF9F1DEE59B9C70AAA.png" style="width: 176rpx;height: 176rpx;"></image>
			</view>
		</view>
		<view class="submit" @click="subInfo">
			<view class="subtext">
				提交
			</view>
		</view>


	</view>
</template>

<script>
	var app = getApp();
	var commonParam;
	var a;
	import {
		pathToBase64,
		base64ToPath
	} from '../../common/index.js'
	import shmilyDragImage from "@/components/shmily-drag-image/shmily-drag-image.vue"
	export default {
		components: {
			shmilyDragImage
		},
		data() {
			return {
				photoList: [],
				photoLists: [],
				reason: '',
			};
		},
		onLoad() {},
		computed: {
			length() {
				let length = 0

				length = length + this.reason.length

				return length
			}
		},
		methods: {
			subInfo() {
				var that = this
				if (!that.reason) {
					uni.showToast({
						title: '请填写申请理由',
						icon: 'none'
					});
				} else if (that.photoList.length == 0) {
					uni.showToast({
						title: '请上传照片',
						icon: 'none'
					});
				} else {
					var aa = that.photoList.join(',')
					console.log(2233, that.photoList);
					uni.request({
						url: this.websiteUrl +'/api/drp/createDrpShop',
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						data: {
							'apply_cause': that.reason,
							'apply_img': aa
						},
						success: (res) => {
							if (res.data.data.error==0) {
								uni.showToast({
									title: res.data.data.message,
									icon: 'none'
								});
								uni.switchTab({
									url: '/pages/user/user'
								})
							} else {
								uni.showToast({
									title: res.data.data.message,
									icon: 'none'
								});
							}
						},
						fail: (data, code) => {
							that.tui.toast('网络连接不可用,请检查网络')
						}
					})
				}

			},
			goAdd: function() {
				var that = this;
				uni.showToast({
					title: '请选择2MB以下的图片',
					icon: 'none'
				});
				if (that.photoLists.length > 2) {
					uni.showToast({
						title: '最多先择三张图片，请检查后上传',
						icon: 'none'
					});
					return;
				} else {
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],
						success: (res) => {
							pathToBase64(res.tempFilePaths[0]).then(base64 => {
								uni.request({
									url: 'https://www.ok9288.com/api/user/material',
									method: 'POST',
									data: {
										file: {
											content: base64
										},
										type: 'touxian'
									},
									header: {
										'Content-Type': 'application/json'
									},
									success: (res) => {
										if (res.data.status == 'success') {
											var aa = res.data.data[0]
											that.photoLists.push(aa)
											that.photoList = that.photoLists.flat()
											console.log(333, that.photoList);
											console.log(444, that.photoLists)
										}
									}
								})
							}).catch(error => {
								// console.error(error, 5);
							});
						}
					})
				}
			},
			handesImage(index) {
				uni.previewImage({
					current: index,
					urls: this.photoList
				})
			},

			cutCheckeds: function(index, item) {
				var that = this;
				console.log(22, index, item);
				that.photoLists = that.photoList.splice(index, 1)
			},
		}

	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.container {
		background: #F6F6F6;
	}

	.title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		padding-left: 34rpx;
	}

	.content {
		background: #ffffff;
		margin: 32rpx 0rpx 50rpx;
		padding: 32rpx 36rpx;

	}

	.aaa {
		display: flex;
		flex-direction: column;
		position: relative;
		border-radius: 16rpx;
		border: 1rpx solid #979797;
		padding: 26rpx;
		font-size: 28rpx;
		color: #1B1B1B;
	}

	.conlen {
		position: absolute;
		bottom: 5%;
		right: 8%;
		color: #999;

	}

	.itempic {
		width: 176rpx;
		height: 176rpx;
		border-radius: 13rpx;
		border: 1rpx solid #979797;
	}

	.icon-content {
		background: #ffffff;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin: 32rpx 0rpx 50rpx;
		padding: 32rpx 16rpx;

	}

	.icon-item {
		width: 176rpx;
		height: 176rpx;
		border-radius: 13rpx;
		border: 1rpx solid #979797;
		margin: 10rpx;
	}

	.itemlist {
		position: relative;
	}

	.radios {
		z-index: 999;
		position: absolute;
		top: -10%;
		right: -10%;
	}

	.submit {
		width: 72%;
		height: 88rpx;
		background: #FE0302;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 14%;
	}

	.subtext {
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
	}
</style>