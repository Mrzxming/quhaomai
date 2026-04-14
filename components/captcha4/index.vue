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

      _assign(this.defaultConfig, this.config, {
        challenge: this.getUuid(),
      });

      this.wv = plus.webview.create(
        `hybrid/html/captcha4/index.html?data=${encodeURIComponent(
          JSON.stringify(this.defaultConfig)
        )}`,
        "gt_webview_" + Date.now(),
        {
          background: "transparent",
          width: "100%",
          height: "100%",
        }
      );

      var currentWebview = this.$root.$scope.$getAppWebview();
      currentWebview.append(this.wv);

      this._plusMessageHandler = (msg) => {
        if (!msg || !msg.data || !msg.data.args || !msg.data.args.data) return;
        const result = msg.data.args.data;
        if (result.name == "postMessage") {
          if (result.arg.time === that.lastTime) {
            return;
          }
          that.lastTime = result.arg.time;
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
        (e) => {
          plus.runtime.openURL(e.url);
        }
      );
      // #endif
    },
    _destroyWebview() {
      // #ifdef APP-PLUS
      if (this._plusMessageHandler) {
        plus.globalEvent.removeEventListener("plusMessage", this._plusMessageHandler);
        this._plusMessageHandler = null;
      }
      if (this.wv) {
        try {
          this.wv.close("none");
        } catch (e) {}
        this.wv = null;
      }
      // #endif
    },
    captchaReady() {
      this.$emit("captchaReady");
      if (this.wv) {
        this.wv.evalJS("jsBridge.callback('showBox')");
      }
    },
    captchaSuccess(data) {
      this.$emit("captchaSuccess", data);
      this._destroyWebview();
    },
    captchaClose() {
      this.$emit("captchaClose");
      this._destroyWebview();
    },
    captchaError: function (e) {
      uni.showToast({
        title: JSON.stringify(e),
        icon: "none",
        duration: 2000,
      });
      this.$emit("captchaError", e);
      this._destroyWebview();
    },
    captchaFail() {
      this.$emit("captchaFail");
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

  const newTarget = Object(target);
  for (let index = 1; index < arguments.length; index++) {
    const source = arguments[index];
    if (source !== null) {
      for (const key in source) {
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
