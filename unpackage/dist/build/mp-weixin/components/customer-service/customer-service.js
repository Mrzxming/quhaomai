(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/customer-service/customer-service"],{"362b":function(e,t,n){"use strict";n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){}));var u=function(){var e=this.$createElement;this._self._c},i=[]},"3c6b":function(e,t,n){},"61f3":function(e,t,n){"use strict";var u=n("3c6b"),i=n.n(u);i.a},"76f0":function(e,t,n){"use strict";(function(e){var u=n("47a9");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=u(n("3b4c")),o={mixins:[i.default],props:["shopConfig"],data:function(){return{curIndex:0}},methods:{changeNav:function(t){3==t?this.$emit("flaghanlde",!0):1==t?e.navigateTo({url:"/pagesC/web-view/web-view?url="+encodeURIComponent(this.shopConfig.custom_jump_url)+"&isDirect=true"}):1==this.shopConfig.consult_kefu_type?e.navigateTo({url:"/pagesC/web-view/web-view?url="+encodeURIComponent(this.shopConfig.consult_kefu_url)+"&isDirect=true"}):this.onChat(0,0)}}};t.default=o}).call(this,n("df3c")["default"])},e803:function(e,t,n){"use strict";n.r(t);var u=n("362b"),i=n("f9f5");for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o);n("61f3");var c=n("828b"),r=Object(c["a"])(i["default"],u["b"],u["c"],!1,null,null,null,!1,u["a"],void 0);t["default"]=r.exports},f9f5:function(e,t,n){"use strict";n.r(t);var u=n("76f0"),i=n.n(u);for(var o in u)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return u[e]}))}(o);t["default"]=i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/customer-service/customer-service-create-component',
    {
        'components/customer-service/customer-service-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("e803"))
        })
    },
    [['components/customer-service/customer-service-create-component']]
]);
