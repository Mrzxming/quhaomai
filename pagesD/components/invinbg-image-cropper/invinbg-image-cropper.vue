<template>
    <view class="vue-cropper" ref="cropper" :style="{ top : `${containerTop}px` }" v-show="show" v-if="show">
		
        <view class="cropper-box">
            <view class="cropper-box-canvas">
                <image :src="src" alt="cropper-img" ref="cropperImg" mode="scaleToFill" class="uni-image"></image>
            </view>
        </view>
        <view class="cropper-drag-box cropper-modal cropper-move pointer-events"></view>
        <canvas canvas-id="myCanvas" class="cropper-canvas" :style="{ 'width': cropW + 'px','height': cropH + 'px' }"></canvas>

        <view class="btn-group">
           
        </view>
		<!-- 遮罩层 右上角三点 -->
		<view v-if="revertShow">
			<view class="cover" @click="revertShowNo" catchtouchmove="true"></view>
			<view class="wxshare_sx">
				<view class="wxshare_2_1">切图</view>
				<view style="position: absolute; right: 30rpx;top: 40rpx;" @click="revertShowNo">
					<image src="https://images.eqingqu.com/attachs/photo/202404/20240412_92D422316CD523B8232E90574882046B.png" style="height: 60rpx;width: 60rpx;"></image>
				</view>
				<view class="center-cut-menu">
					<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-view"
						:scroll-left="scrollLeft">
						<view class="scroll-item" v-for="(item, index) in sortImage" :key="index"
							@click="changeMenu(index)">
							<text class="item-text" :class="curIndex == index? 'active' : ''">{{item.name}}</text>
						</view>
					</scroll-view>
					<view class="goods-detail-guess" v-if="guessList.length > 0">
						<view class="product-list-lie">
							<dsc-product-list :list="guessList" :showone="true" :productOuter="true" :guessList="true"></dsc-product-list>
						</view>
					</view>
					<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
				</view>
				<view style="height: 50rpx;"></view>
			</view>
		</view>
    </view>
</template>

<script>
	import dscProductPick from '@/pagesD/components/visualization/product-pick/Frontend.vue'
	import dscProductList from '@/components/dsc-product-list.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    export default {
        name: 'image-cropper',
        props: {
            cropWidth: {
                type: Number,
                default: 375,
            },
            cropHeight: {
                type: Number,
                default: 375
            },
            cropFixed: {
                type: Boolean,
                default: false,
            },
            src: {
                type: String,
            },
            showResetBtn: {
                type: Boolean,
                default: true,
            },
			sortImage:{
				type:Array,
				Default:[]
			},
			guessList:{
				type:Array,
				Default:[]
			},
			imgElements:{
				type:Array,
				Default:[]
			},
            showRotateBtn: {
                type: Boolean,
                default: true,
            }
        },
		// onLoad() {
		// 	var that = this
		// 	// that.init()
		// 	// setTimeout(function() {
		// 	// 	uni.request({
		// 	// 		url: 'http://www.ok9288.com/api/goods/imgsearch',
		// 	// 		method: 'GET',
		// 	// 		header: {
		// 	// 			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		// 	// 		},
		// 	// 		data: {
		// 	// 			'imgurl':that.src
		// 	// 		},
		// 	// 		success: (res) => {
		// 	// 			console.log(res.data)
		// 	// 			if (res.data.error == 0) {
							
		// 	// 			} else {
		// 	// 				that.tui.toast(res.data.message);
		// 	// 			}
		// 	// 		},
		// 	// 		fail: (data, code) => {
		// 	// 			that.tui.toast('网络连接不可用,请检查网络')
		// 	// 		}
		// 	// 	})
		// 	// }, 100);
		// },
        data() {
            const sysInfo = uni.getSystemInfoSync();
            const pixelRatio = sysInfo.pixelRatio
            return {
                show: false,
                scale: 1,
                rotate: 0,
                cropW: 0,
                cropH: 0,
                cropOldW: 0,
                cropOldH: 0,
                sysInfo: sysInfo,
                pixelRatio: pixelRatio,
                imageRealWidth: 0,
                imageRealHeight: 0,
                cropOffsertX: 0,
                cropOffsertY: 0,
                startX: 0,
                startY: 0,
                // 裁剪框与边界间距
                border: 5,
                x: 0,
                y: 0,
                startL: 0,
                oldScale: 1,
				
				revertShow:true,
				
				scrollLeft:0,
				curIndex:0,
				contentScrollW: 0, // 导航区宽度
				
				disabled: false,
				loading: true,
				page: 1,
				size: 10,
				footerCont: false,
				loadMoreStatus: 'more',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				mode: 'grid',
            }
        },
        // watch: {
        //     src(val) {
        //         if(val.length > 0) {
        //             this.init()
        //         }
        //     },
        //     show(val) {
        //         if(!val) {
        //             this.src = ''
        //         }
        //     }
        // },
		
        computed: {
            containerTop() {
                let top = 0
                // #ifdef H5
                    top = 44
                // #endif
                return top;
            },
            // 容器高度
            containerHeight() {
                return this.windowHeight - 48;
            },
            // 屏幕宽度
            windowWidth() {
                return this.sysInfo.windowWidth;
            },
            windowHeight() {
                return this.sysInfo.windowHeight;
            },
            // 图片宽高比
            imageRatio() {
                if (this.imageRealHeight > 0) {
                    return this.imageRealWidth / this.imageRealHeight
                }
                return 0
            },
            // 等比缩放后的宽度
            imageWidth() {
                if (this.imageRatio >= 1) {
                    return this.windowWidth
                }
                return this.windowWidth * this.imageRatio
            },
            // 等比缩放后的高度
            imageHeight() {
                if (this.imageRatio >= 1) {
                    return this.windowWidth / this.imageRatio
                }
                return this.windowWidth
            },
			
        },
        methods: {
			revertShowNoAll(){
				this.show = false
				this.src = ''
			},
            rotateHandler() {
                if(this.rotate == 3) {
                    this.rotate = 0;
                } else {
                    ++this.rotate
                }
            },
            init() {
                this.rotate = 0;
                this.scale = 1;
                this.cropW = this.cropWidth
                this.cropH = this.cropHeight
                uni.showLoading({
                    title: '图片加载中...',
                })
                this.loadImage(this.src).then((e) => {
                    uni.hideLoading()
                }).catch((e) => {
                    uni.hideLoading()
                    // uni.showModal({
                    //     title: '标题',
                    //     content: '图片加载失败'
                    // })
                })
            },
            loadImage(src) {
                const _this = this
                return new Promise((resolve, reject) => {
                    uni.getImageInfo({
                        src: src,
                        success: (res) => {
                            _this.imageRealWidth = res.width
                            _this.imageRealHeight = res.height

                            _this.cropOffsertX = _this.windowWidth / 2 - _this.cropW / 2
                            _this.cropOffsertY = _this.windowHeight / 2 - _this.cropH / 2
                            _this.show = true

                            _this.$nextTick(() => {
                                _this.x = _this.windowWidth / 2 - _this.imageWidth / 2
                                _this.y = _this.containerHeight / 2 - _this.imageHeight / 2
                            });
                            resolve(res)
                        },
                        fail: (e) => {
                            _this.show = false
                            reject(e)
                        }
                    })
                });

            },
            cancel() {
                this.show = false
                // this.$emit('cancel')
            },
            confirm(event) {
                uni.showLoading({
                    title: '裁剪中...',
                })
                const _this = this
                const ctx = uni.createCanvasContext('myCanvas', _this);

                const pixelRatio = _this.pixelRatio
                const imgage = _this.src
                const imgW = _this.imageWidth * _this.scale;
                const imgH = _this.imageHeight * _this.scale
                const rotate = _this.rotate
                let dx = _this.cropOffsertX - _this.x - (_this.imageWidth - imgW) / 2;
                let dy = _this.cropOffsertY - _this.y - (_this.imageHeight - imgH) / 2;

                ctx.setFillStyle('white')
                ctx.fillRect(0, 0, imgW, imgH)
                ctx.save()

                ctx.rotate((rotate * 90 * Math.PI) / 180);
                switch (rotate) {
                    case 1:
                        dx += (imgH-imgW) / 2
                        dy -= (imgH-imgW) / 2
                        ctx.drawImage(imgage, -dy, dx, imgW, -imgH);
                        break;
                    case 2:
                        ctx.drawImage(imgage, dx, dy, -imgW, -imgH);
                        break;
                    case 3:
                        dx += (imgH-imgW) / 2
                        dy -= (imgH-imgW) / 2
                        ctx.drawImage(imgage, dy, -dx, -imgW, imgH);
                        break;
                    default:
                        ctx.drawImage(imgage, -dx, -dy, imgW, imgH);
                        break;
                }
                ctx.restore()
                ctx.draw(false, () => {
                    uni.canvasToTempFilePath({
                        canvasId: 'myCanvas',
                        destWidth: _this.cropW * pixelRatio,
                        destHeight: _this.cropH * pixelRatio,
                        success: (res) => {
                            uni.hideLoading()
                            event.detail.tempFilePath = res.tempFilePath
                            _this.show = false
                            _this.$emit('confirm', event)
                        },
                        fail: (e) => {
                            uni.hideLoading()
                            uni.showModal({
                                title: '提示',
                                content: '裁剪失败'
                            })
                        }
                    }, _this);
                })

            },
			
			revertShowNo: function() {
				var that = this
				that.revertShow = false
				that.show = null
			},
			
			changeMenu1(index) {
				this.curIndex = index;
				// 效果三(当前点击子元素居中展示)  不受子元素宽度影响
				this.scrollLeft = this.sortImage[index].left - this.contentScrollW / 2 + this.sortImage[index].width / 2;
			},
        }
    }
</script>

<style scoped lang="scss">

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
        left:-9999px;
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

    .btn-item {
        position: relative;
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 20px;
        padding: 10px;
        display: inline-block;
        margin-left: 10px;
    }

    .btn-item:active {
        background: #ccc;
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
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        position: relative;
        text-align: center;
        background-color: #fff;
        z-index: 999999;
    }

    .vue-cropper .uni-modal__btn:first-child:after { display:  none }
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

    .uni-image {
        width: 100%;
        height: 70%;
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
        pointer-events:none;
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
		/* #ifdef H5 */
		bottom: 65%;
		/* #endif */
		/* #ifndef H5 */
		bottom: 0%;
		/* #endif */
		left: 0%;
		z-index: 9999;
	}
	
	.wxshare_2_1 {
		margin-top: 50rpx;
		margin-bottom: 100rpx;
		font-size: 34rpx;
	}
	
	.center-cut-menu {
		width: 100%;
		box-sizing: border-box;
		background-color: #ffffff;
	
		.scroll-view {
			white-space: nowrap;
			padding-left: 30rpx;
			padding-top: 30rpx;
			padding-bottom: 10rpx;
	
			.scroll-item {
				height: 66rpx;
				line-height: 66rpx;
				padding: 0rpx 24rpx 0rpx 0rpx;
				display: inline-block;
				text-align: center;
	
				.item-text {
					font-size: 32rpx;
					border-radius: 50rpx;
					background-color: #f8f8f8;
					padding: 10rpx 40rpx;
					color: #999999;
	
					&.active {
						color: #5c93ff;
						background-color: #eef4ff;
						border-radius: 50rpx;
						padding: 10rpx 40rpx;
					}
				}
			}
		}
	}
	
</style>