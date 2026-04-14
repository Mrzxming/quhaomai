<template>
<view v-if="state !== 'idle'" class="sc-overlay" :class="{'sc-overlay--active': overlayActive}"
  @click.self="handleOverlayClick"
  @touchmove.stop.prevent="onGlobalTouchMove"
  @mousemove.stop.prevent="onGlobalTouchMove"
  @touchend.stop="onGlobalTouchEnd"
  @mouseup.stop="onGlobalTouchEnd">
  <view class="sc-card" :class="{'sc-card--active': overlayActive}" @click.stop>
    <view class="sc-head">
      <text class="sc-title">请完成安全验证</text>
      <view class="sc-close" @click="handleClose">
        <text class="sc-close-icon">×</text>
      </view>
    </view>
    <view class="sc-body">
      <view class="sc-canvas-wrap" :style="{width: cvW + 'px', height: cvH + 'px'}">
        <canvas canvas-id="scBg" id="scBg"
          :style="{width: cvW + 'px', height: cvH + 'px'}" />
        <canvas canvas-id="scPiece" id="scPiece" class="sc-piece"
          :style="{width: pieceW + 'px', height: pieceH + 'px', top: pieceTop + 'px', left: pieceLeft + 'px'}" />
        <view v-if="tipText" class="sc-tip" :class="tipCls">
          <text class="sc-tip-text">{{ tipText }}</text>
        </view>
      </view>
      <view class="sc-slider-wrap" :style="{width: cvW + 'px'}">
        <view class="sc-slider-bar" :class="barCls" :style="{width: cvW + 'px'}">
          <view class="sc-slider-fill" :style="{width: fillW + 'px'}" />
          <text class="sc-slider-text">{{ sliderTxt }}</text>
        </view>
        <view class="sc-slider-btn" :class="btnCls" :style="{left: btnLeft + 'px'}"
          @touchstart.stop.prevent="onBtnDown" @mousedown.stop.prevent="onBtnDown">
          <view v-if="state !== 'pass' && state !== 'fail'" class="sc-btn-icon">
            <view class="sc-btn-line" /><view class="sc-btn-line" /><view class="sc-btn-line" />
          </view>
          <text v-if="state === 'pass'" class="sc-btn-mark">✓</text>
          <text v-if="state === 'fail'" class="sc-btn-mark">✕</text>
        </view>
      </view>
      <view class="sc-footer">
        <view class="sc-refresh" @click="handleRefresh"><text class="sc-refresh-text">↻ 刷新</text></view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
var PALETTES = [
  ['#667eea','#764ba2'],['#f093fb','#f5576c'],['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'],['#fa709a','#fee140'],['#a18cd1','#fbc2eb'],
  ['#fccb90','#d57eeb'],['#84fab0','#8fd3f4'],['#30cfd0','#330867'],
  ['#f7971e','#ffd200'],
];
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

export default {
  name: 'SlideCaptcha',
  data() {
    return {
      state: 'idle',
      overlayActive: false,
      cvW: 300, cvH: 150,
      pieceSize: 48, tolerance: 7,
      answer: 0,
      btnLeft: 0, pieceLeft: 0, pieceTop: 0,
      pieceW: 0, pieceH: 0,
      fillW: 52, tipText: '', tipType: '',
      sliderTxt: '拖动右侧滑块完成拼图',
      dragging: false, startX: 0, startBtn: 0, maxLeft: 0,
      _ticket: '',
    };
  },
  computed: {
    tipCls()  { return this.tipType === 'success' ? 'sc-tip--ok' : 'sc-tip--err'; },
    barCls()  { return this.state === 'pass' ? 'sc-bar--ok' : this.state === 'fail' ? 'sc-bar--err' : this.dragging ? 'sc-bar--drag' : ''; },
    btnCls()  { return this.state === 'pass' ? 'sc-btn--ok' : this.state === 'fail' ? 'sc-btn--err' : ''; },
  },
  methods: {
    /* -------- 公开 API -------- */
    open() {
      if (this.state !== 'idle' && this.state !== 'closed') return;
      this.state = 'open';
      this.overlayActive = false;
      this.$nextTick(() => {
        setTimeout(() => { this.overlayActive = true; }, 30);
        this._generate();
      });
    },

    /* -------- 关闭 / 点击遮罩 -------- */
    handleClose() {
      this.overlayActive = false;
      setTimeout(() => { this._reset('close'); }, 220);
    },
    handleOverlayClick() { this.handleClose(); },

    /* -------- 刷新 -------- */
    handleRefresh() {
      if (this.state === 'pass') return;
      this._resetSlider();
      this._generate();
    },

    /* -------- 内部重置 -------- */
    _reset(event) {
      this.state = 'idle';
      this._resetSlider();
      if (event) this.$emit(event);
    },
    _resetSlider() {
      this.btnLeft = 0; this.pieceLeft = 0; this.fillW = 52;
      this.tipText = ''; this.tipType = '';
      this.sliderTxt = '拖动右侧滑块完成拼图';
      this.dragging = false;
    },

    /* -------- 生成拼图 -------- */
    _generate() {
      this._resetSlider();
      var ps = this.pieceSize, bump = Math.round(ps * 0.22), extra = bump + 4;
      var ansX = rand(ps + bump + 20, this.cvW - ps - bump - 20);
      var ansY = rand(bump + 10, this.cvH - ps - bump - 10);
      this.answer = ansX - extra;
      this.pieceW = ps + extra * 2;
      this.pieceH = ps + extra * 2;
      this.pieceTop = ansY - extra;
      this.maxLeft = this.cvW - 52 - 2;
      this._ticket = Date.now().toString(36) + rand(1000, 9999);
      this.$nextTick(() => {
        this._drawBg(ansX, ansY, ps, bump, extra);
      });
    },

    /* -------- 拼图路径 -------- */
    _pp(ctx, x, y, s, b) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + s * .35, y);
      ctx.arc(x + s * .5, y - b * .5, b, Math.PI, 0, true);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + s, y + s * .35);
      ctx.arc(x + s + b * .5, y + s * .5, b, Math.PI * 1.5, Math.PI * .5, false);
      ctx.lineTo(x + s, y + s);
      ctx.lineTo(x + s * .65, y + s);
      ctx.arc(x + s * .5, y + s + b * .5, b, 0, Math.PI, false);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x, y + s * .65);
      ctx.arc(x - b * .5, y + s * .5, b, Math.PI * .5, Math.PI * 1.5, true);
      ctx.closePath();
    },

    /* -------- 绘制背景 -------- */
    _drawBg(ansX, ansY, ps, bump, extra) {
      var w = this.cvW, h = this.cvH, that = this;
      var ctx = uni.createCanvasContext('scBg', this);
      var pal = PALETTES[rand(0, PALETTES.length - 1)];
      var grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, pal[0]); grd.addColorStop(1, pal[1]);
      ctx.setFillStyle(grd); ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < 14; i++) {
        ctx.beginPath(); ctx.arc(rand(0, w), rand(0, h), rand(15, 50), 0, Math.PI * 2);
        ctx.setFillStyle('rgba(255,255,255,' + (rand(4, 16) / 100) + ')'); ctx.fill();
      }
      ctx.save(); ctx.setGlobalAlpha(.07); ctx.setStrokeStyle('#fff'); ctx.setLineWidth(1.5);
      for (var j = -h; j < w + h; j += 20) { ctx.beginPath(); ctx.moveTo(j, 0); ctx.lineTo(j + h, h); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.setGlobalAlpha(.15); ctx.setFillStyle('#fff'); ctx.setFontSize(12);
      var ws = ['安全验证','拖动滑块','验证码'];
      for (var k = 0; k < 7; k++) ctx.fillText(ws[k % 3], rand(5, w - 65), rand(12, h - 6));
      ctx.restore();

      this._pp(ctx, ansX, ansY, ps, bump);
      ctx.setFillStyle('rgba(0,0,0,.18)'); ctx.fill();
      this._pp(ctx, ansX, ansY, ps, bump);
      ctx.setStrokeStyle('rgba(255,255,255,.55)'); ctx.setLineWidth(1.5); ctx.stroke();
      ctx.draw(false, function() {
        setTimeout(function() { that._drawPiece(ansX, ansY, ps, bump, extra); }, 100);
      });
    },

    /* -------- 绘制拼图块 -------- */
    _drawPiece(ansX, ansY, ps, bump, extra) {
      var that = this;
      var pw = this.pieceW, ph = this.pieceH;
      uni.canvasGetImageData({
        canvasId: 'scBg', x: ansX - extra, y: ansY - extra,
        width: pw, height: ph,
        success: function(res) {
          var ctx = uni.createCanvasContext('scPiece', that);
          var tempCanvas = 'scPiece';
          uni.canvasPutImageData({
            canvasId: tempCanvas, x: 0, y: 0, width: pw, height: ph, data: res.data,
            success: function() {
              var ctx2 = uni.createCanvasContext('scPiece', that);
              ctx2.save();
              ctx2.clearRect(0, 0, pw, ph);
              that._pp(ctx2, extra, extra, ps, bump);
              ctx2.clip();
              ctx2.drawImage(tempCanvas, 0, 0, pw, ph, 0, 0, pw, ph);
              that._pp(ctx2, extra, extra, ps, bump);
              ctx2.setStrokeStyle('rgba(255,255,255,.85)'); ctx2.setLineWidth(1.5); ctx2.stroke();
              ctx2.restore();
              ctx2.draw();
            },
            fail: function() { that._fallbackPiece(ps, bump, extra); }
          });
        },
        fail: function() { that._fallbackPiece(ps, bump, extra); }
      });
    },
    _fallbackPiece(ps, bump, extra) {
      var ctx = uni.createCanvasContext('scPiece', this);
      var pal = PALETTES[rand(0, PALETTES.length - 1)];
      var grd = ctx.createLinearGradient(0, 0, this.pieceW, this.pieceH);
      grd.addColorStop(0, pal[0]); grd.addColorStop(1, pal[1]);
      this._pp(ctx, extra, extra, ps, bump);
      ctx.setFillStyle(grd); ctx.fill();
      this._pp(ctx, extra, extra, ps, bump);
      ctx.setStrokeStyle('rgba(255,255,255,.85)'); ctx.setLineWidth(1.5); ctx.stroke();
      ctx.draw();
    },

    /* -------- 触摸事件 -------- */
    onBtnDown(e) {
      if (this.state === 'pass' || this.dragging) return;
      this.dragging = true; this.state = 'dragging';
      var t = e.touches ? e.touches[0] : e;
      this.startX = t.clientX || t.pageX || 0;
      this.startBtn = this.btnLeft;
    },
    onGlobalTouchMove(e) {
      if (!this.dragging) return;
      var t = e.touches ? e.touches[0] : e;
      var cx = t.clientX || t.pageX || 0;
      var nl = Math.max(0, Math.min(this.startBtn + (cx - this.startX), this.maxLeft));
      this.btnLeft = nl; this.pieceLeft = nl; this.fillW = nl + 52;
    },
    onGlobalTouchEnd() {
      if (!this.dragging) return;
      this.dragging = false;
      this._verify(this.btnLeft);
    },

    /* -------- 校验 -------- */
    _verify(x) {
      if (Math.abs(x - this.answer) <= this.tolerance) {
        this.state = 'pass';
        this.tipText = '验证通过 ✓'; this.tipType = 'success';
        this.sliderTxt = '验证通过'; this.fillW = x + 52;
        var ticket = this._ticket;
        var that = this;
        setTimeout(function() {
          that.overlayActive = false;
          setTimeout(function() {
            that.state = 'idle'; that._resetSlider();
            that.$emit('pass', { ticket: ticket, timestamp: Date.now() });
          }, 220);
        }, 500);
      } else {
        this.state = 'fail';
        this.tipText = '位置不对，请重试'; this.tipType = 'error';
        this.$emit('fail');
        var that2 = this;
        setTimeout(function() {
          that2.state = 'open';
          that2._resetSlider();
          that2._generate();
        }, 800);
      }
    },
  },
  beforeDestroy() { this.state = 'idle'; },
};
</script>

<style lang="scss" scoped>
/* ---- 遮罩 ---- */
.sc-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.5); z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .22s ease;
}
.sc-overlay--active { opacity: 1; }

/* ---- 卡片 ---- */
.sc-card {
  background: #fff; border-radius: 24rpx;
  box-shadow: 0 24rpx 96rpx rgba(0,0,0,.2);
  overflow: hidden; max-width: 95vw;
  transform: translateY(40rpx) scale(.96); transition: transform .22s ease;
}
.sc-card--active { transform: translateY(0) scale(1); }

/* ---- 头部 ---- */
.sc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28rpx 40rpx 24rpx; border-bottom: 1rpx solid #f0f2f7;
}
.sc-title { font-size: 30rpx; font-weight: 700; color: #222; }
.sc-close {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.sc-close-icon { font-size: 40rpx; color: #bbb; line-height: 1; }

/* ---- 内容区 ---- */
.sc-body {
  padding: 36rpx 44rpx 40rpx;
  display: flex; flex-direction: column; align-items: center;
}

/* ---- 画布区 ---- */
.sc-canvas-wrap {
  position: relative; border-radius: 16rpx; overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,.12); background: #e8edf5;
}
.sc-piece { position: absolute; top: 0; left: 0; }

/* ---- 提示 ---- */
.sc-tip {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  padding: 12rpx 36rpx; border-radius: 40rpx; z-index: 5;
}
.sc-tip--ok  { background: rgba(46,204,113,.9); }
.sc-tip--err { background: rgba(231,76,60,.9); }
.sc-tip-text { font-size: 26rpx; font-weight: 600; color: #fff; white-space: nowrap; }

/* ---- 滑块区 ---- */
.sc-slider-wrap { position: relative; margin-top: 20rpx; height: 88rpx; }
.sc-slider-bar {
  position: absolute; top: 0; left: 0; height: 88rpx;
  background: #eef0f5; border-radius: 44rpx;
  border: 2rpx solid #d8dce8; overflow: hidden; box-sizing: border-box;
  transition: background .25s, border-color .25s;
}
.sc-bar--drag { background: #deeaff; border-color: #4f8ffd; }
.sc-bar--ok   { background: #d0f5e0; border-color: #2ecc71; }
.sc-bar--err  { background: #fde8e8; border-color: #e74c3c; }
.sc-slider-fill {
  position: absolute; top: 0; left: 0; height: 100%;
  background: linear-gradient(to right, #a8d4ff, #4f8ffd);
  border-radius: 44rpx;
}
.sc-bar--ok .sc-slider-fill  { background: linear-gradient(to right, #a8f5c8, #2ecc71); }
.sc-bar--err .sc-slider-fill { background: linear-gradient(to right, #f5b8b8, #e74c3c); }
.sc-slider-text {
  position: absolute; width: 100%; text-align: center;
  line-height: 84rpx; font-size: 26rpx; color: #888; z-index: 1;
}
.sc-slider-btn {
  position: absolute; top: 0; width: 104rpx; height: 88rpx;
  background: #fff; border-radius: 44rpx; border: 2rpx solid #d8dce8;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(79,143,253,.25); box-sizing: border-box; z-index: 2;
}
.sc-btn--ok  { background: #2ecc71; border-color: #27ae60; box-shadow: 0 4rpx 16rpx rgba(46,204,113,.4); }
.sc-btn--err { background: #e74c3c; border-color: #c0392b; }

/* ---- 按钮图标 ---- */
.sc-btn-icon { display: flex; flex-direction: column; align-items: center; }
.sc-btn-line { width: 32rpx; height: 4rpx; background: #4f8ffd; border-radius: 2rpx; margin: 3rpx 0; }
.sc-btn-mark { font-size: 40rpx; color: #fff; line-height: 1; }

/* ---- 底部刷新 ---- */
.sc-footer {
  display: flex; align-items: center; justify-content: flex-end;
  width: 100%; margin-top: 12rpx;
}
.sc-refresh { padding: 4rpx 12rpx; border-radius: 8rpx; }
.sc-refresh-text { font-size: 24rpx; color: #aaa; }
</style>
