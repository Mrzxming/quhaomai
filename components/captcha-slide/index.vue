<template>
  <view class="captcha-slide-component"></view>
</template>
<script>
export default {
  data() {
    return {
      wv: null,
      lastTime: "",
      _plusMessageHandler: null,
    };
  },
  mounted() {},
  beforeDestroy() {
    this._destroyWebview();
  },
  methods: {
    showCaptcha() {
      // #ifdef APP-PLUS
      this._destroyWebview();
      this.wv = plus.webview.create(
        "hybrid/html/captcha-slide/index.html",
        "captcha_slide_wv_" + Date.now(),
        {
          background: "transparent",
          width: "100%",
          height: "100%",
        }
      );
      var currentWebview = this.$root.$scope.$getAppWebview();
      currentWebview.append(this.wv);

      var that = this;
      this._plusMessageHandler = function(msg) {
        if (!msg || !msg.data || !msg.data.args || !msg.data.args.data) return;
        var result = msg.data.args.data;
        if (result.name !== "postMessage") return;
        var arg = result.arg;
        if (!arg || arg.time === that.lastTime) return;
        that.lastTime = arg.time;
        switch (arg.type) {
          case "ready":
            that.$emit("ready");
            break;
          case "result":
            that.$emit("success", arg.data);
            that._destroyWebview();
            break;
          case "close":
            that.$emit("close");
            that._destroyWebview();
            break;
          case "fail":
            that.$emit("fail");
            break;
        }
      };
      plus.globalEvent.addEventListener("plusMessage", this._plusMessageHandler);
      // #endif
    },
    _destroyWebview() {
      // #ifdef APP-PLUS
      if (this._plusMessageHandler) {
        plus.globalEvent.removeEventListener("plusMessage", this._plusMessageHandler);
        this._plusMessageHandler = null;
      }
      if (this.wv) {
        try { this.wv.close("none"); } catch (e) {}
        this.wv = null;
      }
      // #endif
    },
  },
};
</script>
