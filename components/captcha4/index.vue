<template>
  <view class="slide-captcha-entry">
    <!-- #ifdef APP-PLUS -->
    <view v-if="appVisible" class="app-captcha-mask" @touchmove.stop.prevent>
      <view class="app-captcha-panel" @touchmove.stop.prevent>
        <view class="app-captcha-title">请完成安全验证</view>
        <view class="app-captcha-desc">{{ appState === 'pass' ? '验证通过，正在继续' : '拖动滑块至目标区域完成验证' }}</view>
        <view class="app-slider-track">
          <view class="app-slider-fill" :style="{ width: `${fillWidth}px` }"></view>
          <view class="app-slider-target" :style="{ left: `${targetLeft}px`, width: `${targetWidth}px` }"></view>
          <view class="app-slider-text">{{ appState === 'pass' ? '验证通过' : '向右滑动完成验证' }}</view>
          <view
            class="app-slider-knob"
            :class="{ fail: appState === 'failed' }"
            :style="{ transform: `translateX(${knobX}px)` }"
            @touchstart.stop.prevent="onTouchStart"
            @touchmove.stop.prevent="onTouchMove"
            @touchend.stop.prevent="onTouchEnd"
          >
            <text class="app-slider-knob-text">»</text>
          </view>
        </view>
        <view v-if="appState === 'failed'" class="app-captcha-error">未滑入目标区间，请重试</view>
        <view class="app-captcha-actions">
          <view class="app-captcha-btn cancel" @click="handleClose">取消</view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'SlideCaptcha',
  props: {
    modal: { type: Boolean, default: false },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 150 }
  },
  data() {
    return {
      loaded: false,
      resolvePromise: null,
      rejectPromise: null,
      appVisible: false,
      appState: 'idle',
      knobX: 0,
      trackWidth: 260,
      knobWidth: 44,
      targetLeft: 0,
      targetWidth: 38,
      touchStartX: 0,
      knobStartX: 0,
      failTimer: null
    }
  },
  computed: {
    maxKnobX() {
      return this.trackWidth - this.knobWidth
    },
    fillWidth() {
      return this.knobX + this.knobWidth
    }
  },
  mounted() {
    if (this.modal) this.verify({ width: this.width, height: this.height }).catch(() => {})
  },
  methods: {
    verify(opts = {}) {
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
        // #ifdef H5
        this.verifyByScript(opts).catch(() => this.handleClose())
        // #endif
        // #ifdef APP-PLUS
        this.openAppInlineCaptcha()
        // #endif
        // #ifdef MP-WEIXIN
        uni.showToast({ title: '当前端暂未接入官方组件源码', icon: 'none' })
        this.handleClose()
        // #endif
      })
    },
    reset() {
      this.clearFailTimer()
      this.appVisible = false
      this.appState = 'idle'
      this.knobX = 0
      if (this.rejectPromise) this.rejectPromise(new Error('reset'))
      this.resolvePromise = null
      this.rejectPromise = null
    },
    openAppInlineCaptcha() {
      this.clearFailTimer()
      this.appVisible = true
      this.appState = 'open'
      this.knobX = 0
      this.touchStartX = 0
      this.knobStartX = 0
      const minLeft = Math.floor(this.maxKnobX * 0.72)
      const maxLeft = Math.floor(this.maxKnobX * 0.9)
      this.targetLeft = minLeft + Math.floor(Math.random() * Math.max(1, maxLeft - minLeft))
    },
    onTouchStart(e) {
      if (this.appState === 'pass') return
      const touch = e && e.touches && e.touches[0]
      this.touchStartX = touch ? touch.clientX : 0
      this.knobStartX = this.knobX
      this.appState = 'dragging'
    },
    onTouchMove(e) {
      if (this.appState === 'pass') return
      const touch = e && e.touches && e.touches[0]
      if (!touch) return
      const delta = touch.clientX - this.touchStartX
      let next = this.knobStartX + delta
      if (next < 0) next = 0
      if (next > this.maxKnobX) next = this.maxKnobX
      this.knobX = next
    },
    onTouchEnd() {
      if (this.appState === 'pass') return
      const passMin = this.targetLeft
      const passMax = this.targetLeft + this.targetWidth
      if (this.knobX >= passMin && this.knobX <= passMax) {
        this.appState = 'pass'
        setTimeout(() => {
          this.handlePass({ success: true, ticket: 'slide_captcha_pass_' + Date.now() })
        }, 120)
        return
      }
      this.appState = 'failed'
      this.$emit('fail', { reason: 'out_of_target' })
      this.clearFailTimer()
      this.failTimer = setTimeout(() => {
        this.appState = 'open'
      }, 280)
      this.knobX = 0
    },
    clearFailTimer() {
      if (this.failTimer) {
        clearTimeout(this.failTimer)
        this.failTimer = null
      }
    },
    async verifyByScript(opts = {}) {
      if (!this.loaded) {
        await this.loadAssets()
        this.loaded = true
      }
      if (!window.CaptchaSlide || typeof window.CaptchaSlide.verify !== 'function') {
        throw new Error('captcha_slide_verify_unavailable')
      }
      await window.CaptchaSlide.verify({
        width: opts.width || this.width,
        height: opts.height || this.height,
        onPass: () => this.handlePass(),
        onClose: () => this.handleClose()
      })
    },
    loadAssets() {
      return new Promise((resolve, reject) => {
        if (typeof document === 'undefined') {
          reject(new Error('document_unavailable'))
          return
        }
        const cssCandidates = ['/static/captcha-slide/captcha_slide.css', './static/captcha-slide/captcha_slide.css', 'static/captcha-slide/captcha_slide.css']
        const jsCandidates = ['/static/captcha-slide/captcha_slide.js', './static/captcha-slide/captcha_slide.js', 'static/captcha-slide/captcha_slide.js']
        if (!document.getElementById('captcha-slide-css')) {
          const link = document.createElement('link')
          link.id = 'captcha-slide-css'
          link.rel = 'stylesheet'
          link.href = cssCandidates[0]
          document.head.appendChild(link)
        }

        if (window.CaptchaSlide || document.getElementById('captcha-slide-js')) {
          resolve()
          return
        }

        let i = 0
        const loadNext = () => {
          if (i >= jsCandidates.length) {
            reject(new Error('captcha_slide_js_load_error_all_candidates'))
            return
          }
          const src = jsCandidates[i++]
          const script = document.createElement('script')
          script.id = 'captcha-slide-js'
          script.src = src
          script.onload = () => resolve()
          script.onerror = () => {
            if (script.parentNode) script.parentNode.removeChild(script)
            loadNext()
          }
          document.body.appendChild(script)
        }
        loadNext()
      })
    },
    handlePass(result) {
      const payload = result || { success: true, ticket: 'slide_captcha_pass_' + Date.now() }
      this.clearFailTimer()
      this.appVisible = false
      this.appState = 'pass'
      this.$emit('pass', payload)
      if (this.resolvePromise) this.resolvePromise(payload)
      this.resolvePromise = null
      this.rejectPromise = null
    },
    handleClose() {
      this.clearFailTimer()
      this.appVisible = false
      this.appState = 'closed'
      this.$emit('close')
      if (this.rejectPromise) this.rejectPromise(new Error('cancelled'))
      this.resolvePromise = null
      this.rejectPromise = null
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-captcha-entry { width: 0; height: 0; overflow: visible; }
.app-captcha-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-captcha-panel {
  width: 640rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 36rpx 28rpx 24rpx;
}
.app-captcha-title {
  font-size: 34rpx;
  color: #222;
  font-weight: 600;
  text-align: center;
}
.app-captcha-desc {
  margin-top: 14rpx;
  font-size: 26rpx;
  color: #888;
  text-align: center;
}
.app-slider-track {
  margin-top: 34rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f2f4f7;
  position: relative;
  overflow: hidden;
}
.app-slider-target {
  position: absolute;
  top: 10rpx;
  height: 68rpx;
  border-radius: 34rpx;
  border: 2rpx dashed rgba(76, 217, 100, 0.45);
  background: rgba(76, 217, 100, 0.12);
}
.app-slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #4cd964;
}
.app-slider-text {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 26rpx;
}
.app-slider-knob {
  position: absolute;
  left: 0;
  top: 0;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.app-slider-knob.fail {
  animation: knob-shake 0.25s linear;
}
.app-slider-knob-text {
  color: #999;
  font-size: 38rpx;
}
.app-captcha-error {
  margin-top: 14rpx;
  text-align: center;
  font-size: 24rpx;
  color: #ff3b30;
}
.app-captcha-actions {
  margin-top: 28rpx;
  display: flex;
  justify-content: center;
}
.app-captcha-btn {
  width: 180rpx;
  height: 72rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}
.app-captcha-btn.cancel {
  background: #f2f2f2;
  color: #666;
}
@keyframes knob-shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4rpx); }
  50% { transform: translateX(4rpx); }
  75% { transform: translateX(-4rpx); }
  100% { transform: translateX(0); }
}
</style>
