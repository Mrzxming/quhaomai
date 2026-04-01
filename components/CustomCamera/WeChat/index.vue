<template>
    <Layout
        :mask-config="maskConfig"
        @instruct="handleInstruct"
    >
        <view class="preview-wrapper">
            <camera
                class="camera"
                mode="normal"
                :device-position="device"
                @error="error"
                style="width: 100%; height: 100%;"
            >
                <!-- 四个L形角标记，使用cover-view覆盖在camera原生组件上 -->
                <cover-view v-if="maskReady" :style="cornerStyles.topLeft.horizontal"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.topLeft.vertical"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.topRight.horizontal"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.topRight.vertical"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.bottomLeft.horizontal"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.bottomLeft.vertical"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.bottomRight.horizontal"></cover-view>
                <cover-view v-if="maskReady" :style="cornerStyles.bottomRight.vertical"></cover-view>
            </camera>
            <view v-if="holdTipVisible" class="hold-tip">
                <text>请保持稳定，正在对准拍摄...</text>
            </view>
        </view>
        <canvas id="cropCanvas" type="2d" class="hidden-canvas"></canvas>
    </Layout>
</template>

<script>
	import Layout from './Layout.vue'
	export default {
		components: {
			Layout
		},
        props: {
            maskConfig: {
                type: Object,
                default: () => ({
                    widthRatio: 0.78,
                    heightRatio: 0.5,
                    borderRadius: 24
                })
            }
        },
		data() {
			return {
				device: 'back',
				cameraContext: null,
				shutterShow: false,
                maskReady: false,
                maskPosition: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    holeWidth: 0,
                    holeHeight: 0
                },
                maskHoleStyle: {},
                windowWidth: 0,
            previewHeight: 0,
            holdTipVisible: false,
            captureTimer: null,
            capturing: false,
            cornerStyles: {
                topLeft: { horizontal: {}, vertical: {} },
                topRight: { horizontal: {}, vertical: {} },
                bottomLeft: { horizontal: {}, vertical: {} },
                bottomRight: { horizontal: {}, vertical: {} }
            }
			}
		},
		mounted() {
			this.cameraContext = uni.createCameraContext();
            const systemInfo = uni.getSystemInfoSync();
            this.windowWidth = systemInfo.windowWidth;
            this.previewHeight = parseInt(systemInfo.windowHeight * 0.8);
            this.calculateMask();
		},
        beforeDestroy() {
            if (this.captureTimer) {
                clearTimeout(this.captureTimer);
                this.captureTimer = null;
            }
        },
        watch: {
            maskConfig: {
                deep: true,
                handler() {
                    this.calculateMask();
                }
            }
        },
		methods: {
			error(err) {
				console.log(err)
			},
            calculateMask() {
                const widthRatio = this.maskConfig.widthRatio || 0.78;
                const heightRatio = this.maskConfig.heightRatio || 0.62;
                const holeWidth = this.windowWidth * widthRatio;
                const holeHeight = this.previewHeight * heightRatio;
                const left = (this.windowWidth - holeWidth) / 2;
                const top = (this.previewHeight - holeHeight) / 2;
                const bottom = this.previewHeight - top - holeHeight;
                this.maskPosition = {
                    top,
                    bottom,
                    left,
                    right: left,
                    holeWidth,
                    holeHeight
                };
                this.maskHoleStyle = {
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${holeWidth}px`,
                    height: `${holeHeight}px`,
                    borderRadius: `${this.maskConfig.borderRadius || 0}px`
                };
                
                // 计算四个L形角标记的位置
                const cornerLength = 30;
                const cornerWidth = 3;
                const frameTop = top;
                const frameLeft = left;
                const frameRight = left + holeWidth;
                const frameBottom = top + holeHeight;
                
                // 左上角 - 使用字符串格式的样式，cover-view可能不支持对象格式
                this.cornerStyles.topLeft = {
                    horizontal: `position:absolute;top:${frameTop}px;left:${frameLeft}px;width:${cornerLength}px;height:${cornerWidth}px;background-color:#ffffff;`,
                    vertical: `position:absolute;top:${frameTop}px;left:${frameLeft}px;width:${cornerWidth}px;height:${cornerLength}px;background-color:#ffffff;`
                };
                
                // 右上角
                this.cornerStyles.topRight = {
                    horizontal: `position:absolute;top:${frameTop}px;left:${frameRight - cornerLength}px;width:${cornerLength}px;height:${cornerWidth}px;background-color:#ffffff;`,
                    vertical: `position:absolute;top:${frameTop}px;left:${frameRight - cornerWidth}px;width:${cornerWidth}px;height:${cornerLength}px;background-color:#ffffff;`
                };
                
                // 左下角
                this.cornerStyles.bottomLeft = {
                    horizontal: `position:absolute;top:${frameBottom - cornerWidth}px;left:${frameLeft}px;width:${cornerLength}px;height:${cornerWidth}px;background-color:#ffffff;`,
                    vertical: `position:absolute;top:${frameBottom - cornerLength}px;left:${frameLeft}px;width:${cornerWidth}px;height:${cornerLength}px;background-color:#ffffff;`
                };
                
                // 右下角
                this.cornerStyles.bottomRight = {
                    horizontal: `position:absolute;top:${frameBottom - cornerWidth}px;left:${frameRight - cornerLength}px;width:${cornerLength}px;height:${cornerWidth}px;background-color:#ffffff;`,
                    vertical: `position:absolute;top:${frameBottom - cornerLength}px;left:${frameRight - cornerWidth}px;width:${cornerWidth}px;height:${cornerLength}px;background-color:#ffffff;`
                };
                
                console.log('角标记位置计算:', {
                    maskHoleStyle: this.maskHoleStyle,
                    cornerStyles: this.cornerStyles,
                    frameTop,
                    frameLeft,
                    frameRight,
                    frameBottom
                });
                
                this.maskReady = true;
            },
            clearCaptureDelay() {
                if (this.captureTimer) {
                    clearTimeout(this.captureTimer);
                    this.captureTimer = null;
                }
            },
			handleInstruct(instruct) {
				switch (instruct) {
					// 返回
					case 'back':
				this.clearCaptureDelay();
				this.holdTipVisible = false;
				this.capturing = false;
						this.$emit('back')
						break;
						// 快门
				case 'shutter':
					if (this.capturing || !this.cameraContext) return;
					this.capturing = true;
					this.holdTipVisible = true;
					this.captureTimer = setTimeout(() => {
						this.captureTimer = null;
						this.holdTipVisible = false;
						this.$nextTick(() => {
						this.cameraContext.takePhoto({
							quality: 'high',
							success: (res) => {
								this.capturing = false;
								this.processImage(res.tempImagePath);
							},
							fail: (err) => {
								console.error('takePhoto fail', err);
								this.holdTipVisible = false;
								this.capturing = false;
								uni.showToast({
									icon: 'none',
									title: '拍摄失败，请重试'
								});
							}
						})
						});
					}, 1000);
						break;
						// 反转
					case 'reversal':
					this.clearCaptureDelay();
					this.holdTipVisible = false;
					this.capturing = false;
					this.device = this.device === 'back' ? 'front' : 'back'
						break;
						// 相册
				case 'album':
					this.clearCaptureDelay();
					this.holdTipVisible = false;
					this.capturing = false;
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: (res) => {
                                this.processImage(res.tempFilePaths[0]);
						}
					})
						break;
				}
            },
            processImage(path) {
                this.holdTipVisible = false;
                if (!path) {
                    this.capturing = false;
                    uni.showToast({
                        icon: 'none',
                        title: '获取图片失败，请重试'
                    });
                    return;
                }
                uni.getImageInfo({
                    src: path,
                    success: (info) => {
                        this.drawAndCrop(path, info.width, info.height);
                    },
                    fail: (err) => {
                        console.error('getImageInfo fail', err);
                    this.capturing = false;
                        uni.showToast({
                            icon: 'none',
                            title: '裁剪失败，请重试'
                        });
                    }
                });
            },
            drawAndCrop(src, width, height) {
                const widthRatio = this.maskConfig.widthRatio || 0.78;
                const heightRatio = this.maskConfig.heightRatio || 0.62;
                const cropWidth = parseInt(width * widthRatio);
                const cropHeight = parseInt(height * heightRatio);
                const startX = parseInt((width - cropWidth) / 2);
                const startY = parseInt((height - cropHeight) / 2);

                // 限制画布尺寸，避免超出小程序 canvas 限制
                const maxSize = 2000;
                let destWidth = cropWidth;
                let destHeight = cropHeight;
                if (destWidth > maxSize) {
                    const scale = maxSize / destWidth;
                    destWidth = maxSize;
                    destHeight = Math.round(cropHeight * scale);
                }
                if (destHeight > maxSize) {
                    const scale = maxSize / destHeight;
                    destHeight = maxSize;
                    destWidth = Math.round(destWidth * scale);
                }

                // 使用 canvas 2d API
                const query = uni.createSelectorQuery().in(this);
                query.select('#cropCanvas')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        if (!res || !res[0] || !res[0].node) {
                            console.error('获取 canvas 节点失败', res);
                            this.holdTipVisible = false;
                            this.capturing = false;
                            uni.showToast({
                                icon: 'none',
                                title: '裁剪失败，请重试'
                            });
                            return;
                        }

                        const canvas = res[0].node;
                        const ctx = canvas.getContext('2d');
                        
                        // 设置 canvas 实际尺寸
                        const dpr = uni.getSystemInfoSync().pixelRatio || 1;
                        canvas.width = destWidth * dpr;
                        canvas.height = destHeight * dpr;
                        ctx.scale(dpr, dpr);

                        // 创建图片对象
                        const img = canvas.createImage();
                        img.onload = () => {
                ctx.clearRect(0, 0, destWidth, destHeight);
                            ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);
                            
                            // 导出图片
                            uni.canvasToTempFilePath({
                                canvas: canvas,
                                x: 0,
                                y: 0,
                            width: destWidth,
                            height: destHeight,
                            destWidth: destWidth,
                            destHeight: destHeight,
                            fileType: 'jpg',
                            quality: 1,
                            success: (res) => {
                                    console.log('canvasToTempFilePath success', res);
                                this.holdTipVisible = false;
                                    this.capturing = false;
                                this.$emit('getImage', res.tempFilePath);
                            },
                            fail: (err) => {
                                console.error('canvasToTempFilePath fail', err);
                                this.holdTipVisible = false;
                                    this.capturing = false;
                                uni.showToast({
                                    icon: 'none',
                                    title: '裁剪失败，请重试'
                                });
                            }
                            }, this);
                        };
                        img.onerror = (err) => {
                            console.error('图片加载失败', err);
                            this.holdTipVisible = false;
                            this.capturing = false;
                            uni.showToast({
                                icon: 'none',
                                title: '图片加载失败，请重试'
                            });
                        };
                        img.src = src;
                });
			}
		}
	}
</script>

<style scoped>
    .preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }


    .hidden-canvas {
        position: fixed;
        width: 1px;
        height: 1px;
        left: -9999rpx;
        top: -9999rpx;
    }

.hold-tip {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.35);
}

.hold-tip text {
    color: #ffffff;
    font-size: 28rpx;
}

.corner-h {
    position: absolute;
    background-color: #ffffff;
    width: 30px;
    height: 3px;
    pointer-events: none;
}

.corner-v {
    position: absolute;
    background-color: #ffffff;
    width: 3px;
    height: 30px;
    pointer-events: none;
}
</style>
