<template>
  <view class="geetest_component"> </view>
</template>
<script>
export default {
  data() {
    return {
      wv: null,
      _plusMessageHandler: null,
      _safetyTimer: null,
      _isAndroid: false,
      defaultConfig: {
        clientVersion: "uniapp-v1.0",
        clientType: uni.getSystemInfoSync().platform,
        protocol: "https://",
        mi: {
          geeid: {
            bd: "", d: "", e: "", fp: "", ts: "", ver: "", client_type: "",
          },
          packageName: "", displayName: "", appVer: "", build: "",
          clientVersion: "", process_id: "", process_id_test: "", zid: "",
        },
      },
    };
  },
  props: {
    config: {
      type: Object,
      default: function () { return {}; },
    },
  },
  mounted() {
    this._isAndroid = uni.getSystemInfoSync().platform === 'android';
  },
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

      console.log('[captcha4] showCaptcha, captchaId:', mergedConfig.captchaId, 'platform:', this._isAndroid ? 'Android' : 'iOS');

      var wvId = "gt_captcha_" + Date.now();
      var url = "hybrid/html/captcha4/index.html?data=" + encodeURIComponent(
        JSON.stringify(mergedConfig)
      );

      if (this._isAndroid) {
        // === Android：独立窗口 + URL scheme 通信 ===
        this.wv = plus.webview.create(url, wvId, {
          background: "transparent",
          width: "100%",
          height: "100%",
          popGesture: "none",
          bounce: "none",
        });

        this.wv.overrideUrlLoading({ mode: "reject" }, function (e) {
          var reqUrl = e.url || '';
          if (reqUrl.indexOf('gt4bridge://msg?') === 0) {
            try {
              var jsonStr = decodeURIComponent(reqUrl.replace('gt4bridge://msg?', ''));
              var data = JSON.parse(jsonStr);
              console.log('[captcha4] URL scheme 消息:', data.type);
              that._handleMessage(data);
            } catch (err) {
              console.error('[captcha4] 解析失败:', err);
            }
            return;
          }
          plus.runtime.openURL(reqUrl);
        });

        this.wv.show("none");

      } else {
        // === iOS：append 到父 webview + plusMessage 通信（原方案） ===
        this.wv = plus.webview.create(url, wvId, {
          background: "transparent",
          width: "100%",
          height: "100%",
        });

        var currentWebview = this.$root.$scope.$getAppWebview();
        currentWebview.append(this.wv);

        this._plusMessageHandler = function (msg) {
          if (!msg || !msg.data || !msg.data.args || !msg.data.args.data) return;
          var result = msg.data.args.data;
          if (result.name == "postMessage") {
            if (result.arg.time === that._lastTime) return;
            that._lastTime = result.arg.time;
            console.log('[captcha4] plusMessage 消息:', result.arg.type);
            that._handleMessage(result.arg);
          }
        };
        plus.globalEvent.addEventListener("plusMessage", this._plusMessageHandler);

        this.wv.overrideUrlLoading({ mode: "reject" }, function (e) {
          plus.runtime.openURL(e.url);
        });
      }

      console.log('[captcha4] webview 已显示, id:', wvId);

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
        case "ready": this.captchaReady(); break;
        case "error": this.captchaError(data.data); break;
        case "fail":  this.captchaFail(); break;
        case "close": this.captchaClose(); break;
        case "result": this.captchaSuccess(data.data); break;
        default: break;
      }
    },

    _destroyWebview() {
      // #ifdef APP-PLUS
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      if (this._plusMessageHandler) {
        try { plus.globalEvent.removeEventListener("plusMessage", this._plusMessageHandler); } catch (e) {}
        this._plusMessageHandler = null;
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
      this.$emit("captchaError", e);
      this._destroyWebview();
    },
    captchaFail() {
      console.log('[captcha4] captchaFail — 不关闭弹窗，SDK 自动刷新');
      this.$emit("captchaFail");
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
