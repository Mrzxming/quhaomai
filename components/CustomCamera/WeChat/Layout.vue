<!-- 公共布局组件 -->
<template>
    <view class="custom-camera">
        <view class="camera-wrap" :style="{ height: cameraHeight + 'px' }">
            <slot></slot>
        </view>
        <view class="camera-options" :style="[{ height: optionsHeight + 'px' }]">
            <view class="camera-options-left camera-item">
                <image
                    src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B0320810DE026C6AED0552641C3EEC.png"
                    mode="scaleToFill"
                    @click="handleClikFn('back')"
                    style="width: 80rpx;height: 80rpx;"
                ></image>
            </view>
            <view class="camera-options-center camera-item">
                <view class="shutter-button" @click="handleClikFn('shutter')">
                    <view class="shutter-button-inner"></view>
                </view>
            </view>
            <view class="camera-options-ritht camera-item">
                <text
                    class="camera-item-text"
                    @click="handleClikFn('album')"
                >相册</text>
            </view>
        </view>
    </view>
</template>

<script>
    // 提供一个相机的插槽位置
    // 底部可以自定义最右侧按钮（相册/反转）
    export default {
        props: {
            maskConfig: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                cameraHeight: 0,
                optionsHeight: 0
            }
        },
        created() {
            const systemInfo = uni.getSystemInfoSync();
            this.cameraHeight = parseInt(systemInfo.screenHeight * 0.8);
            this.optionsHeight = systemInfo.screenHeight - this.cameraHeight;
        },
        methods: {
            handleClikFn(instruct) {
                this.$emit('instruct', instruct)
            }
        }
    }
</script>

<style>
    .custom-camera {
        height: 100vh;
        background-color: #000;
        flex-direction: column;
    }

    .camera-wrap {
        position: relative;
        overflow: hidden;
    }

    .camera-options {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 60rpx;
        background-color: rgba(0, 0, 0, 0.65);
    }

    .camera-item {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
    }

    .camera-item-text {
        color: #ffffff;
        font-size: 32rpx;
    }

    .shutter-button {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 6rpx solid rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
    }

    .shutter-button-inner {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: #FE2F02;
    }
</style>
