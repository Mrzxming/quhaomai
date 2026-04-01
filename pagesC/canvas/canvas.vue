<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<!-- 这里是状态栏 -->
		<view class="status_bar" style="height: 40px;"></view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
		<!-- #endif -->
		<view class="cropper-box">
			<view class="cropper-box-canvas">
				<image :src="src" alt="cropper-img" ref="cropperImg" mode="widthFix" class="uni-image"></image>
			</view>
		</view>
		<view class="center-cut-menu">
			<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-view" :scroll-left="scrollLeft">
				<view class="scroll-item" v-for="(item, index) in sortImage" :key="index" @click="changeMenu(index)">
					<view :class="curIndex == index? 'active' : ''">
						<view style="text-align: center;display: flex;flex-direction: column;align-items: center;">
							<image :src="item" style="height: 100rpx;width: 100rpx;border-radius: 10rpx;"></image>
							<image v-if="curIndex == index" src="https://images.eqingqu.com/attachs/photo/202404/20240415_5C8029DB0068EAEB43406D9A389AF7ED.png" style="height: 20rpx;width: 20rpx;"></image>
						</view>
						<!-- <text class="item-text" v-if="curIndex == index"
							:class="curIndex == index? 'active' : ''">选中</text> -->
					</view>
					
				</view>
			</scroll-view>
		</view>
		<view v-if="isIos==true" class="clickback" @click="toback">
			<image
				src="https://images.eqingqu.com/attachs/photo/202403/20240305_A596460B29B83F980245FE085E084168.png"
				style="height: 60rpx;width: 60rpx;"></image>
		</view>
		<view v-if="isIos==false" class="clickbacks" @click="toback">
			<image
				src="https://images.eqingqu.com/attachs/photo/202403/20240305_A596460B29B83F980245FE085E084168.png"
				style="height: 60rpx;width: 60rpx;"></image>
		</view>
		<!-- 遮罩层 右上角三点 -->
		<view v-if="revertShow">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare_sx">
				<!-- <view class="wxshare_2_1">切图</view> -->
				<!-- <view style="position: absolute; right: 30rpx;top: 20rpx;" @click="toback">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240412_92D422316CD523B8232E90574882046B.png"
						style="height: 60rpx;width: 60rpx;"></image>
				</view> -->
				
				<scroll-view class="top-catalog" scroll-y :lower-threshold="100" @scrolltolower="loadMore" :scroll-top="scrollTop" @scroll="onScroll">
					<view style="height: 20rpx;"></view>
					<dsc-product-list :list="guessList" :mode="mode"></dsc-product-list>
					<uni-load-more :status="loadMoreStatus" :content-text="contentText" />
					<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true"
						@fileterScrollTop="fileterScrollTop"></dsc-filter-top>
					<view style="height: 50rpx;"></view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	import {
		compressImage
	} from '@/common/compressImage.js'
	import dscProductList from '@/components/dsc-product-list.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top.vue'
	export default {
		components: {
			dscProductList,
			uniLoadMore,
			dscFilterTop
		},
		data() {
			return {
				canvasWidth: 300,
				canvasHeight: 800,
				menuButtonInfo: {},
				revertShow: true,

				src: '',
				sortImage: [],
				scrollLeft: 0,
				curIndex: 0,
				contentScrollW: 0, // 导航区宽度

				page: 1,
				size: 10,
				scrollPickOpen: false,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				guessList: [],
				mode: 'grid',
				scrollState: false,
				scrollTop: 0,
				oldScrollTop: 0,
				heightStyle:0,
				isIos:false
			};
		},
		onLoad() {
			var that = this
			that.drawImageOnCanvas();
			const info = wx.getSystemInfoSync()
			if (info.system.indexOf('Android') > -1) {
				// console.log('安卓')
				that.isIos = false
			} else {
				that.isIos = true
			}
		},

		methods: {
			toback() {
				uni.navigateBack()
			},
			onScroll(e) {
				this.scrollState = e.detail.scrollTop > 800 ? true : false
				this.oldScrollTop = e.detail.scrollTop;
			},
			fileterScrollTop(e) {
				//视图会发生重新渲染
				this.scrollTop = this.oldScrollTop
				console.log(this.scrollTop)
				//当视图渲染结束 重新设置为0
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			getGoodsList(page) {
				var that = this
				if (page) {
					that.page = page
					that.size = 10
				}

				uni.request({
					url: that.websiteUrl + '/api/catalog/goodslist',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						warehouse_id: 0,
						area_id: 0,
						page: that.page,
						size: that.size
					},
					success: (res) => {
						console.log('测试数据的数据',res.data)
					
						if (res.statusCode == 200) {
							if (res.data.data.length < 10) {
								that.loadMoreStatus = 'noMore'
								
							}
							if (that.page == 1) {
								that.guessList = res.data.data
							} else {
								that.guessList = that.guessList.concat(res.data.data)
							}
						}
					}
				})
			},

			loadMore() {
				var that = this
				console.log("111")
				if (that.page * that.size == that.guessList.length) {
					that.loadMoreStatus = 'loading';
					that.page++
					that.getGoodsList(that.page)
				} else {
					setTimeout(() => {
						that.loadMoreStatus = "noMore"
						that.showLoadMore = false
					}, 2000)
					return;
				}
			},

			changeMenu(index) {
				console.log(index)
				// changeMenu(i, imgs) {
				var that = this
				that.curIndex = index;
				console.log('当前缩略图信息:', that.sortImage[index]);
				// 效果三(当前点击子元素居中展示)  不受子元素宽度影响
				that.scrollLeft = that.sortImage[index].left - that.contentScrollW / 2 + that.sortImage[index].width / 2;
				that.guessList = []
				that.loadMoreStatus = 'loading'
				// let arr = []
				// if (imgs) {
				// 	if (typeof imgs == 'string') arr.push(imgs);

				// 	uni.previewImage({
				// 		current: i,
				// 		urls: arr.length > 0 ? arr : imgs
				// 	})
				// }
				// console.log(imgs[i])
				uni.request({
					url: this.websiteUrl + '/api/goods/pai_imgsearch',
					method: 'GET',
					data: {
						imgurl: that.sortImage[index]
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						// uni.hideLoading();
						if (res.data.status == 'success') {
							if (res.data.data != null) {
								if (res.data.data.length < 10) {
									that.loadMoreStatus = 'noMore'
								}
								if (that.page == 1) {
									that.guessList = res.data.data
								} else {
									that.guessList = that.guessList.concat(res.data.data)
								}
								// uni.setStorageSync('goodslistTake', res.data.data);
								// uni.navigateTo({
								// 	url: '/pagesD/goodslist/goodslistTake'
								// })
							} else {
								uni.showToast({
									title: '未找到对应商品信息',
									icon: 'none',
									duration: 2000
								});
							}
						} else {
							uni.showToast({
								title: '未找到对应商品信息',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			drawImageOnCanvas() {
				var that = this
				that.src = uni.getStorageSync('imageSrc')
				uni.request({
					url: 'https://www.ok9288.com/api/goods/imgsearch',
					method: 'GET',
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					data: {
						'imgurl': this.src
					},
					success: (res_1) => {
						console.log(res_1.data)
						// this.canvasWidth / res_1.data.data.Width
						// 等比缩小一半
						// ctx.scale(1-this.canvasWidth / res_1.data.data.Width, 1-this.canvasHeight / res_1.data.data.Height);
						// console.log(res_1.data.data.Elements[0].Boxes)
						// var ab = res_1.data.data.Elements
						// var abc = res_1.data.data.Elements[0].Boxes
						// const points = [abc[0], abc[1], abc[2], abc[1], abc[2], abc[3],abc[0], abc[3]]; // 示例坐标
						// [140, 83, 289, 493]
						//  [（140, 83），（289, 83），（289，493），（140，493）]
						if (res_1.data.status == 'success') {
							// uni.showLoading({
							// 	title:'加载中'
							// })
							that.sortImage = res_1.data.data
							console.log('缩略图列表:', that.sortImage);
							that.changeMenu(0)
							// setTimeout(function() {
							// for(var i=0;i<ab.length;i++){
							// ctx.beginPath();
							// ctx.moveTo(ab[i].Boxes[0], ab[i].Boxes[1]); // 起点坐标
							// ctx.lineTo(ab[i].Boxes[2], ab[i].Boxes[1]);
							// ctx.lineTo(ab[i].Boxes[2],  ab[i].Boxes[3]);
							// ctx.lineTo(ab[i].Boxes[0], ab[i].Boxes[3]);
							// ctx.lineTo(ab[i].Boxes[0], ab[i].Boxes[1]); // 闭合回起点
							// ctx.setStrokeStyle('#ff0000');
							// ctx.setLineWidth(2);
							// ctx.stroke();
							// ctx.draw(true);
							// console.log(i)
							// setTimeout(function() {
							// console.log(ab[i].Boxes)
							// console.log(ab[i].Boxes[0])
							// console.log(ab[i].Boxes[1])
							// console.log(ab[i].Boxes[2])
							// console.log(ab[i].Boxes[3])
							// 再次绘制一个矩形，这次是缩小后的效果
							// ctx.fillRect(ab[i].Boxes[0], ab[i].Boxes[0], abc[2]-abc[0], abc[3]-abc[1]);
							// ctx.draw();
							// uni.canvasToTempFilePath({
							// 	canvasId: 'myCanvas',
							// 	x: ab[i].Boxes[0],
							// 	y: ab[i].Boxes[0],
							// 	width: abc[2]-abc[0],
							// 	height: abc[3]-abc[1],
							// 	// destWidth: (abc[2]-abc[0])*0.2,
							// 	// destHeight: (abc[3]-abc[1])*0.2,
							// 	success: function(res_c) {
							// 				pathToBase64(res_c.tempFilePath).then(base64 => {
							// 					that.$store.dispatch('setMaterial', {
							// 						file: {
							// 							content: base64
							// 						},
							// 						type: 'touxian'
							// 					}).then(data => {
							// 						uni.hideLoading()
							// 						console.log(data.data)
							// 						uni.hideLoading()
							// 						if (data.status == 'success') {
							// 							that.sortImage = that.sortImage.concat(data.data)

							// 						} else {
							// 							uni.hideLoading()
							// 							uni.showToast({
							// 								icon: 'none',
							// 								title: '请稍后重试'
							// 							})
							// 						}
							// 					})
							// 				}).catch(error => {
							// 					console.error(error, 5);
							// 				});

							// 		// 	}
							// 		// })
							// 	// }, 200);
							// }
							// }, 500);

							// console.log(list)
							// that.sortImage = list
							// console.log(that.sortImage)
						}
					},
					fail: (data, code) => {
						that.tui.toast('网络连接不可用,请检查网络')
					}
				})
				// uni.getSystemInfo({
				// 	success: (info) => {
				// 		console.log(info)
				// 		this.src = uni.getStorageSync('imageSrc')
				// 		this.canvasWidth = info.windowWidth;
				// 		this.canvasHeight = info.windowHeight;

				// 		// 设置画布宽高
				// 		// const ctx = uni.createCanvasContext('myCanvas', this);
				// 		// that.src = 'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202402/thumb_img/40259_thumb_G_1706926967742.jpg'; // 图片路径
				// 		// console.log(uni.getStorageSync('imageSrc'))
				// 		// const imageSrc = uni.getStorageSync('imageSrc'); // 图片路径
				// 		// ctx.drawImage(imageSrc, 0, 0, this.canvasWidth, this.canvasHeight);
				// 		// ctx.draw();
				// 		setTimeout(function() {

				// 		}, 500);
				// 	}
				// });
			}
		}
	};
</script>
<style lang="scss">
	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAR4AAsAAAAACKgAAAQsAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqEfIRGATYCJAMMCwgABCAFhG0HShugB8gOJUHBwAAAAAFEBNmwzd4dtatSmmpFoVAEhUThEAYkCozFKDCqCVO6RfH/89v869awDnTR1qrSANFt4GG4SNxreBn91fmV9f3+53J613ieHba+N1zmGM8PA7oXTaCAxpjei8IoLWFsGLu4jPME6vWJJdovqmgAO4U2LRBnep0K7GJmpYQWanXVOWuLuAFrtenK4haAa/f38QnKsCOpyrRFh6eFWsh5KXnfYcn958BGQNKfE8wmMmaAQpzkuo9Z+ukZluoltVV5abUipL5i/ysArlhWVut/eCRBVNPUjYg6oUo7JTHFoaYDSvdacnKTq9GAB4AY5y2dtL3qpFh1DENdnJC6Hq+xYb7pyRMDMzc/fYoJjY8flwO3m98rMucF+IZHj6Cagw5UeKpxyFbt2rHGY/8jpa7CYMvLfcIesLjY3bdqhaf+nqgQs2qT/+rjCH/VfA0VFGuAC3iE8NEr/Vau8vZsXiUy7+V3c3tQQXMAuNjDCC89KDIHH0OFhnUi81GEPwyc7wZUaN7DnUf4g+ZLQsMKYV/94NjK7R7TEM4niTY1oJ5zEU62aNVaasUub08YLUEam5EnT6a61/I17dNk+vTu9jpJjXhsTFwjqTtpCBxBIIgS6iQnc/Zod1YGKp0rAwsD8kkyP6AwcK0hcAwkiQmBhWvxPZWKDu86aUH2nLEdi9rGX1eXq5P6A1SrnAucMVMdZH/GKi/jyfCqJyucfK3mXpVujXOPfFf5LC4Dvx0X/943JyOq4HuCTZ8KiIPPAb6ro8akpT6ufiq39BQrNlk5mp8pO0JlJLk8f5QalRjoP60IMx0N8n7wGhSD3n6/F1zlcTVz/cR+Ev0lkLSTd7UiPbD/wCxGRMA2Krwro2O0bTQtImbwhjAJc0S3N4ROx15/PH60IzaIOjCbEelqkDOfETNxb/FMixnWNzeJp2KPQw9A5d76jGUOQOUvH7RE/o2RfkNatd3OGf9q0QKbnq8WB7qy+hVqJRjJn1BQgP/iErks0yy5iGJTrOayW7C/z0IoZH0qNH+7N+31XXc7G2p1hZDU6IWs1ghaqDNQpcEKVKu1BfWmFW9u0IFhKUodpswCEFodgqTZHWStbqOF+hqqdPsG1VrDEuodhfueDcZCj+QzuIrFtZh6BNNraIowbCzi1dbhOlOfionKXHoTzgzoY5hCKk/minEKZ/pYMDCoU7IsgREM3Y8Vgcvwvj4aMzK0AdewUpJljWkyGZH3IKmG7gfEHgZOhYXTwqiNwOhp0CiE3ZiFpL5fB6dj0keFKcGV+JvgGAP0vWMUpOQ10GI1VQt3LoMHDNJRYrEIPInAoPXDFEEnrk9P0zDG/FEGOA2WFNkiaZRGhuoRddXS8bX917cL6mn9c6TIUXSekybKHKQfJXFq2KSiRklLYU8dNKWDIX0cAA==') format('woff2');
	}

	.vue-cropper {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
		box-sizing: border-box;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		direction: ltr;
		touch-action: none;
		text-align: left;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
	}

	.cropper-canvas {
		position: absolute;
		top: -9999px;
		left: -9999px;
		z-index: -998;
	}

	.vue-cropper .uni-info__ft {
		position: absolute;
		line-height: 48px;
		font-size: 18px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 998;
	}

	.btn-group {
		position: absolute;
		right: 30px;
		bottom: 78px;
		z-index: 998;
	}

	.rotate-btn {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: 20px;
	}

	.rotate-btn:before {
		content: "\e65c";
		margin-left: -2px;
	}

	.reset-btn {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: 20px;
	}

	.reset-btn:before {
		content: "\e648";
		margin-left: -2px;
	}

	.vue-cropper .uni-info__ft:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #d5d5d6;
		color: #d5d5d6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		z-index: 999999;
	}

	.vue-cropper .uni-modal__btn {
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		color: #3cc51f;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		position: relative;
		text-align: center;
		background-color: #fff;
		z-index: 999999;
	}

	.vue-cropper .uni-modal__btn:first-child:after {
		display: none
	}

	.vue-cropper .uni-modal__btn:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1px solid #d5d5d6;
		color: #d5d5d6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleX(.5);
		transform: scaleX(.5);
		z-index: 998;
	}

	.vue-cropper .uni-modal__btn:active {
		background-color: #eee;
	}

	.cropper-box,
	.cropper-box-canvas,
	.cropper-drag-box,
	.cropper-crop-box,
	.cropper-face {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		user-select: none;
		z-index: 998;
	}

	.cropper-box-canvas image {
		position: relative;
		text-align: left;
		user-select: none;
		transform: none;
		max-width: none;
		max-height: none;
		z-index: 998;
	}

	.cropper-box {
		overflow: hidden;
	}

	.cropper-move {
		cursor: move;
	}

	.cropper-crop {
		cursor: crosshair;
	}

	.cropper-modal {
		background: rgba(0, 0, 0, 0.5);
	}

	.pointer-events {
		pointer-events: none;
	}

	.cropper-crop-box {
		/*border: 2px solid #39f;*/
	}

	.cropper-view-box {
		display: block;
		overflow: hidden;
		width: 100%;
		height: 100%;
		outline: 1px solid #39f;
		outline-color: rgba(51, 153, 255, 0.75);
		user-select: none;
	}

	.cropper-view-box image {
		user-select: none;
		text-align: left;
		max-width: none;
		max-height: none;
	}

	.cropper-face {
		top: 0;
		left: 0;
		background-color: #fff;
		opacity: 0.1;
	}

	.crop-line {
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0.1;
		z-index: 998;
	}

	.line-w {
		top: -3px;
		left: 0;
		height: 5px;
		cursor: n-resize;
	}

	.line-a {
		top: 0;
		left: -3px;
		width: 5px;
		cursor: w-resize;
	}

	.line-s {
		bottom: -3px;
		left: 0;
		height: 5px;
		cursor: s-resize;
	}

	.line-d {
		top: 0;
		right: -3px;
		width: 5px;
		cursor: e-resize;
	}

	.crop-point {
		position: absolute;
		width: 8px;
		height: 8px;
		opacity: 0.75;
		background-color: #39f;
		border-radius: 100%;
		z-index: 998;
	}

	.point-lt {
		top: -4px;
		left: -4px;
		cursor: nw-resize;
	}

	.point-mt {
		top: -5px;
		left: 50%;
		margin-left: -3px;
		cursor: n-resize;
	}

	.point-rt {
		top: -4px;
		right: -4px;
		cursor: ne-resize;
	}

	.point-ml {
		top: 50%;
		left: -4px;
		margin-top: -3px;
		cursor: w-resize;
	}

	.point-mr {
		top: 50%;
		right: -4px;
		margin-top: -3px;
		cursor: e-resize;
	}

	.point-lb {
		bottom: -5px;
		left: -4px;
		cursor: sw-resize;
	}

	.point-mb {
		bottom: -5px;
		left: 50%;
		margin-left: -3px;
		cursor: s-resize;
	}

	.point-rb {
		bottom: -5px;
		right: -4px;
		cursor: se-resize;
	}

	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 9999;
		opacity: 0.2;
	}

	.wxshare_sx {
		text-align: center;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		top: 14%;
		bottom: 0%;
		left: 0%;
		z-index: 9999;
	}

	.wxshare_2_1 {
		margin-top: 20rpx;
		margin-bottom: 0rpx;
		font-size: 34rpx;
	}

	.center-cut-menu {
		/* #ifndef MP-WEIXIN */
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 60%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		box-sizing: border-box;
		// background-color: #ffffff;
		z-index: 99999;
		position: absolute;
		top: 4%;
		.scroll-view {
			white-space: nowrap;
			padding: 30rpx 0;

			.scroll-item {
				padding-right: 10rpx;
				display: inline-block;
				text-align: center;

					.active {
						border: 2rpx solid #ffffff;
						border-radius: 10rpx;
						height: 106rpx;
				}
			}
		}
	}

	.top-catalog {
		height: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.uni-image {
		width: 100%;
		height: 100%;
		filter: blur(10px);
	}
	
	.clickback{
		position: absolute;
		/* #ifndef MP-WEIXIN */
		top: 120rpx;
		right: 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: 6%;
		right: 28%;
		/* #endif */
		z-index: 99999;
	}
	
	.clickbacks{
		position: absolute;
		/* #ifndef MP-WEIXIN */
		top: 120rpx;
		right: 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: 4.5%;
		right: 28%;
		/* #endif */
		z-index: 99999;
	}
</style>