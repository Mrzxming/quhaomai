<template>
  <view class="geetest_component"> </view>
</template>
<script>
export default {
  data() {
    return {
      wv: null,
      _safetyTimer: null,
      defaultConfig: {
        clientVersion: "uniapp-v1.0",
        clientType: uni.getSystemInfoSync().platform,
        protocol: "https://",
        mi: {
          geeid: {
            bd: "",
            d: "",
            e: "",
            fp: "",
            ts: "",
            ver: "",
            client_type: "",
          },
          packageName: "",
          displayName: "",
          appVer: "",
          build: "",
          clientVersion: "",
          process_id: "",
          process_id_test: "",
          zid: "",
        },
      },
    };
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {},
  beforeDestroy() {
    this._destroyWebview();
  },
  methods: {
    showCaptcha() {
      var that = this;
      // #ifdef APP-PLUS
      this._destroyWebview();

      var mergedConfig = {};
      _assign(mergedConfig, this.defaultConfig, this.config, {
        challenge: this.getUuid(),
      });

      console.log('[captcha4] showCaptcha, captchaId:', mergedConfig.captchaId);

      var wvId = "gt_captcha_" + Date.now();
      var url = "hybrid/html/captcha4/index.html?data=" + encodeURIComponent(
        JSON.stringify(mergedConfig)
      );

      // 用 plus.webview.open 代替 create+append
      // open 创建独立 webview 窗口，close 时能彻底释放触摸
      this.wv = plus.webview.create(url, wvId, {
        background: "transparent",
        width: "100%",
        height: "100%",
        popGesture: "none",
        bounce: "none",
        dock: "top",
        position: "absolute"
      });

      // 通过 URL scheme 接收子 webview 消息
      this.wv.overrideUrlLoading({ mode: "reject" }, function (e) {
        var reqUrl = e.url || '';
        if (reqUrl.indexOf('gt4bridge://msg?') === 0) {
          try {
            var jsonStr = decodeURIComponent(reqUrl.replace('gt4bridge://msg?', ''));
            var data = JSON.parse(jsonStr);
            console.log('[captcha4] 收到消息:', data.type);
            that._handleMessage(data);
          } catch (err) {
            console.error('[captcha4] 解析消息失败:', err, reqUrl);
          }
          return;
        }
        // 非 bridge URL，交给系统浏览器
        plus.runtime.openURL(reqUrl);
      });

      // 显示 webview
      this.wv.show("none");
      console.log('[captcha4] webview 已显示, id:', wvId);

      // 安全超时
      this._safetyTimer = setTimeout(function () {
        if (that.wv) {
          console.warn('[captcha4] 安全超时(15s)，强制销毁');
          that.$emit("captchaError", { msg: "验证码加载超时" });
          that._destroyWebview();
        }
      }, 15000);
      // #endif
    },

    _handleMessage(data) {
      if (!data || !data.type) return;
      switch (data.type) {
        case "ready":
          this.captchaReady();
          break;
        case "error":
          this.captchaError(data.data);
          break;
        case "fail":
          this.captchaFail();
          break;
        case "close":
          this.captchaClose();
          break;
        case "result":
          this.captchaSuccess(data.data);
          break;
        default:
          break;
      }
    },

    _destroyWebview() {
      // #ifdef APP-PLUS
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      if (this.wv) {
        console.log('[captcha4] _destroyWebview');
        var wv = this.wv;
        this.wv = null;
        try { wv.close("none"); } catch (e) {
          console.warn('[captcha4] close 异常:', e);
        }
      }
      // #endif
    },

    captchaReady() {
      console.log('[captcha4] captchaReady → showBox');
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      this.$emit("captchaReady");
      if (this.wv) {
        this.wv.evalJS("jsBridge.callback('showBox')");
      }
    },
    captchaSuccess(data) {
      console.log('[captcha4] captchaSuccess');
      this.$emit("captchaSuccess", data);
      this._destroyWebview();
    },
    captchaClose() {
      console.log('[captcha4] captchaClose');
      this.$emit("captchaClose");
      this._destroyWebview();
    },
    captchaError: function (e) {
      console.error('[captcha4] captchaError:', JSON.stringify(e));
      uni.showToast({ title: "验证失败，请重试", icon: "none", duration: 2000 });
      this.$emit("captchaError", e);
      this._destroyWebview();
    },
    captchaFail() {
      console.log('[captcha4] captchaFail');
      this.$emit("captchaFail");
      this._destroyWebview();
    },
    getUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0;
          var v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
};

function _assign(target) {
  if (typeof Object.assign === "function") {
    return Object.assign.apply(Object, arguments);
  }
  if (target == null) {
    throw new Error("Cannot convert undefined or null to object");
  }
  var newTarget = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== null && source !== undefined) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          newTarget[key] = source[key];
        }
      }
    }
  }
  return newTarget;
}
</script>
<style lang="scss"></style>
