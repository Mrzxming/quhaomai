<template>
  <!-- 有时间才显示倒计时 -->
  <view class="countdown" v-if="displayTime">仅剩 <text class="time">{{ displayTime }}</text></view>
</template>

<script>
export default {
  props: {
    // 接收父组件传递的时间字符串（格式："hh:mm:ss"）
    timeStr: {
      type: String,
      default: "00:00:00"
    }
  },
  data() {
    return {
      countdown: 0,       // 当前剩余总秒数
      displayTime: "",    // 用于页面显示的格式化时间
      initialSeconds: 0,  // 初始总秒数（归零后重置用）
      timer: null         // 定时器ID，用于清除
    };
  },
  methods: {
    // 工具方法："hh:mm:ss" → 总秒数
    parseTimeToSeconds(timeStr) {
      const [hours, minutes, seconds] = timeStr.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    },
    // 工具方法：总秒数 → "hh:mm:ss"
    formatSecondsToTime(seconds) {
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
      const s = Math.floor(seconds % 60).toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    },
    // 初始化并启动倒计时
    initCountdown() {
      // 清除旧定时器（防止重复启动）
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      // 解析初始时间为总秒数
      this.initialSeconds = this.parseTimeToSeconds(this.timeStr);
      this.countdown = this.initialSeconds;
      this.displayTime = this.formatSecondsToTime(this.countdown);
      // 启动每秒更新的定时器
      this.timer = setInterval(() => {
        this.countdown--;
        // 归零后，重置为初始总秒数（循环倒计时）
        if (this.countdown < 0) {
          this.countdown = this.initialSeconds;
        }
        this.displayTime = this.formatSecondsToTime(this.countdown);
      }, 1000);
    }
  },
  // 组件挂载后，启动倒计时
  mounted() {
    this.initCountdown();
  },
  // 组件销毁前，清除定时器（防止内存泄漏）
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style scoped>
.countdown {
  color: #ff5555; /* 可根据设计调整颜色、字体 */
  background: #FFEDED;
  border-radius: 8rpx;
  width: fit-content;
  padding: 0 10rpx;
 
}
 .time {
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	font-size: 28rpx;
	color: #FE2F02;
	line-height: 28rpx;
	text-align: center;
	font-style: normal; 
	margin-left: 10rpx;
 } 
</style>