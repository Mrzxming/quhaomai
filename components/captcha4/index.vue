<template>
  <view class="geetest_component"> </view>
</template>
<script>
export default {
  data() {
    return {
      wv: null,
      _parentWebview: null,
      lastTime: "",
      _plusMessageHandler: null,
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

      console.log('[captcha4] showCaptcha, captchaId:', mergedConfig.captchaId, 'protocol:', mergedConfig.protocol);

      var wvId = "gt_webview_" + Date.now();
      this.wv = plus.webview.create(
        "hybrid/html/captcha4/index.html?data=" + encodeURIComponent(
          JSON.stringify(mergedConfig)
        ),
        wvId,
        {
          background: "transparent",
          width: "100%",
          height: "100%",
        }
      );

      try {
        this._parentWebview = this.$root.$scope.$getAppWebview();
      } catch (e) {
        console.error('[captcha4] 获取父 webview 失败:', e);
        this._forceCleanWv();
        this.$emit("captchaError", { msg: "获取页面 webview 失败" });
        return;
      }
      this._parentWebview.append(this.wv);
      console.log('[captcha4] webview 已 append, id:', wvId);

      this._plusMessageHandler = function (msg) {
        if (!msg || !msg.data || !msg.data.args || !msg.data.args.data) return;
        var result = msg.data.args.data;
        if (result.name == "postMessage") {
          if (result.arg.time === that.lastTime) return;
          that.lastTime = result.arg.time;
          console.log('[captcha4] 收到消息:', result.arg.type);
          switch (result.arg.type) {
            case "ready":
              that.captchaReady();
              break;
            case "error":
              that.captchaError(result.arg.data);
              break;
            case "fail":
              that.captchaFail();
              break;
            case "close":
              that.captchaClose();
              break;
            case "result":
              that.captchaSuccess(result.arg.data);
              break;
            default:
              break;
          }
        }
      };
      plus.globalEvent.addEventListener("plusMessage", this._plusMessageHandler);

      this.wv.overrideUrlLoading(
        { mode: "reject" },
        function (e) { plus.runtime.openURL(e.url); }
      );

      this._safetyTimer = setTimeout(function () {
        if (that.wv) {
          console.warn('[captcha4] 安全超时(15s)，强制销毁');
          that.$emit("captchaError", { msg: "验证码加载超时" });
          that._destroyWebview();
        }
      }, 15000);
      // #endif
    },

    _forceCleanWv() {
      if (this.wv) {
        try { this.wv.setStyle({ width: "0px", height: "0px", left: "-9999px" }); } catch (e) {}
        try { this.wv.close(); } catch (e) {}
        this.wv = null;
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
        console.log('[captcha4] _destroyWebview 开始');
        var wv = this.wv;
        this.wv = null;

        // 1) 立即把 webview 缩到 0x0 并移到屏幕外，解除触摸拦截
        try { wv.setStyle({ width: "0px", height: "0px", left: "-9999px", top: "-9999px" }); } catch (e) {}

        // 2) 尝试从父 webview 移除（部分 runtime 版本支持 remove）
        if (this._parentWebview) {
          try { this._parentWebview.remove(wv); } catch (e) {}
          this._parentWebview = null;
        }

        // 3) 关闭 webview
        try { wv.close(); } catch (e) {
          try { wv.close("none"); } catch (e2) {}
        }

        // 4) 再通过全局 API 兜底关闭
        try {
          var id = wv.id;
          if (id) {
            var found = plus.webview.getWebviewById(id);
            if (found) found.close();
          }
        } catch (e) {}

        console.log('[captcha4] _destroyWebview 完成');
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
    getAppWebview(that) {
      if (that.$scope) {
        return that.$scope.$getAppWebview();
      } else {
        this.getAppWebview(that.$parent);
      }
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
