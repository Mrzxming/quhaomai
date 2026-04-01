(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/dsc-copyright/dsc-copyright"],{1151:function(t,n,e){"use strict";e.r(n);var a=e("43c7"),o=e("75b2");for(var c in o)["default"].indexOf(c)<0&&function(t){e.d(n,t,(function(){return o[t]}))}(c);e("ab19");var i=e("828b"),r=Object(i["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);n["default"]=r.exports},"43c7":function(t,n,e){"use strict";e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){}));var a=function(){var t=this.$createElement;this._self._c},o=[]},"75b2":function(t,n,e){"use strict";e.r(n);var a=e("b968"),o=e.n(a);for(var c in a)["default"].indexOf(c)<0&&function(t){e.d(n,t,(function(){return a[t]}))}(c);n["default"]=o.a},8304:function(t,n,e){},ab19:function(t,n,e){"use strict";var a=e("8304"),o=e.n(a);o.a},b968:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={name:"dsc-copyright",data:function(){return{copyrightInfo:{},configData:t.getStorageSync("configData")}},created:function(){this.configData||this.shopConfig()},methods:{shopConfig:function(){var n=this;t.request({url:"".concat(this.websiteUrl,"/api/shop/config"),method:"GET",data:{},header:{"Content-Type":"application/json",token:t.getStorageSync("token"),"X-Client-Hash":t.getStorageSync("client_hash")},success:function(t){var e=t.data.data;console.log(e),n.configData=e}})}}};n.default=e}).call(this,e("df3c")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/dsc-copyright/dsc-copyright-create-component',
    {
        'components/dsc-copyright/dsc-copyright-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("1151"))
        })
    },
    [['components/dsc-copyright/dsc-copyright-create-component']]
]);
