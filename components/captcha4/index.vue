<template>
  <view class="geetest_component"> </view>
</template>
<script>
export default {
  data() {
    return {
      wv: null,
      lastTime: "",
      _plusMessageHandler: null,
      _safetyTimer: null,
      defaultConfig: {
        clientVersion: "uniapp-v1.0",
        clientType: uni.getSystemInfoSync().platform,
        protocol: "http://",
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

      console.log('[captcha4] showCaptcha 开始, captchaId:', mergedConfig.captchaId);

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

      console.log('[captcha4] webview 已创建, id:', wvId);

      var currentWebview;
      try {
        currentWebview = this.$root.$scope.$getAppWebview();
      } catch (e) {
        console.error('[captcha4] 获取当前 webview 失败:', e);
        this._destroyWebview();
        this.$emit("captchaError", { msg: "获取页面 webview 失败" });
        return;
      }
      currentWebview.append(this.wv);
      console.log('[captcha4] webview 已 append 到页面');

      this._plusMessageHandler = function (msg) {
        if (!msg || !msg.data || !msg.data.args || !msg.data.args.data) return;
        var result = msg.data.args.data;
        if (result.name == "postMessage") {
          if (result.arg.time === that.lastTime) {
            return;
          }
          that.lastTime = result.arg.time;
          console.log('[captcha4] 收到消息, type:', result.arg.type);
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
        function (e) {
          plus.runtime.openURL(e.url);
        }
      );

      // 15秒安全超时：如果 SDK 加载失败或消息丢失，自动销毁 webview 防止卡死
      this._safetyTimer = setTimeout(function () {
        if (that.wv) {
          console.warn('[captcha4] 安全超时(15s)，自动销毁 webview');
          that.$emit("captchaError", { msg: "验证码加载超时" });
          that._destroyWebview();
        }
      }, 15000);

      // #endif
    },
    _destroyWebview() {
      // #ifdef APP-PLUS
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      if (this._plusMessageHandler) {
        try {
          plus.globalEvent.removeEventListener("plusMessage", this._plusMessageHandler);
        } catch (e) {}
        this._plusMessageHandler = null;
      }
      if (this.wv) {
        console.log('[captcha4] 销毁 webview');
        try {
          this.wv.close("none");
        } catch (e) {
          console.warn('[captcha4] webview.close 异常:', e);
          try {
            this.wv.hide();
          } catch (e2) {}
        }
        this.wv = null;
      }
      // #endif
    },
    captchaReady() {
      console.log('[captcha4] captchaReady, 即将调用 showBox');
      // ready 收到了，取消安全超时，验证码已成功加载
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
      uni.showToast({
        title: JSON.stringify(e),
        icon: "none",
        duration: 2000,
      });
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
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
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
