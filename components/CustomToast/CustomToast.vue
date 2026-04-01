<template>
  <view class="custom-toast" v-if="show">
    <view class="toast-content" :class="{error: icon === 'error'}">
      <view v-if="icon === 'error'" class="error-icon">!</view>
      <text class="toast-text">{{title}}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: '',
      icon: '',
      duration: 2000,
      timer: null
    };
  },
  methods: {
    // 显示toast
    showToast(options) {
      // 清除之前的定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      // 设置参数
      this.title = options.title || '';
      this.icon = options.icon || '';
      this.duration = options.duration || 2000;
      this.show = true;
      
      // 自动隐藏
      this.timer = setTimeout(() => {
        this.show = false;
      }, this.duration);
    }
  }
};
</script>

<style scoped>
.custom-toast {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none; /* 允许点击穿透 */
}

.toast-content {
  max-width: 80%; /* 最大宽度限制 */
  padding: 16rpx 24rpx;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; /* 自动换行 */
}

.error {
  background-color: rgba(233, 30, 99, 0.9);
}

.error-icon {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  color: #fff;
  border: 2rpx solid #fff;
  border-radius: 50%;
  margin-right: 12rpx;
  font-weight: bold;
}

.toast-text {
  color: #fff;
  font-size: 28rpx;
  line-height: 1.5; /* 增加行高，便于阅读多行文本 */
  word-break: break-all; /* 强制换行 */
}
</style>
