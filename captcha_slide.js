/**
 * CaptchaSlide — 滑动拼图验证码组件
 * 纯 Canvas / 原生 JS，UMD 格式，无任何外部依赖
 *
 * 支持环境：
 *   ✓ 原生 HTML / 后台管理页
 *   ✓ H5 页面（含 jQuery 环境，自动注册 $.fn.captchaSlide）
 *   ✓ Vue 2 / Vue 3（import 后使用 CaptchaSlide.verify() Promise API）
 *   ✓ CommonJS / AMD / 全局变量
 *
 * ── 1. 拦截表单提交（推荐，最简单）────────────────────────────────────
 *   CaptchaSlide.interceptForm('#myForm');
 *   // 点击提交 → 弹出验证码 → 通过后自动提交表单
 *
 * ── 2. Promise API（适合 Vue / AJAX 场景）──────────────────────────────
 *   CaptchaSlide.verify().then(function() {
 *     // 验证通过，执行登录
 *   });
 *   // 或 async/await:
 *   await CaptchaSlide.verify();
 *
 * ── 3. Vue 插件（Vue 2）────────────────────────────────────────────────
 *   Vue.use(CaptchaSlide.VuePlugin);
 *   // 组件内: this.$captcha().then(fn)
 *
 * ── 4. Vue 3 / 组合式 API──────────────────────────────────────────────
 *   import CaptchaSlide from './captcha_slide.js';
 *   const { verify } = CaptchaSlide;
 *   await verify();
 *
 * ── 5. jQuery 插件────────────────────────────────────────────────────
 *   $('form').captchaSlide();       // 拦截表单提交
 *   $('button').captchaSlide({      // 拦截按钮点击
 *     onPass: function() { ... }
 *   });
 *
 * ── 6. 手动弹窗──────────────────────────────────────────────────────
 *   CaptchaSlide.openModal({ onPass: fn });
 *   CaptchaSlide.closeModal();
 *
 * ── 7. 内嵌模式──────────────────────────────────────────────────────
 *   var cap = new CaptchaSlide({ container: '#wrap', onPass: fn });
 *   cap.init();
 *   cap.isPassed();
 *   cap.reset();
 */
;(function (root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        /* CommonJS (Node / Webpack / Vue CLI) */
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        /* AMD (RequireJS) */
        define([], factory);
    } else {
        /* 全局变量（浏览器直接引入） */
        root.CaptchaSlide = factory();
        /* jQuery 插件（如果 jQuery 存在） */
        if (typeof root.jQuery === 'function') {
            _registerJQueryPlugin(root.jQuery, root.CaptchaSlide);
        }
    }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
    'use strict';

    /* ================================================================
       工具函数
    ================================================================ */
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function isEl(v) { return v && (v.nodeType === 1 || v instanceof Element); }
    function resolveEl(v) {
        if (!v) return null;
        if (typeof v === 'string') return qs(v);
        if (isEl(v)) return v;
        /* jQuery 对象 */
        if (v.jquery && v[0]) return v[0];
        return null;
    }

    /* ================================================================
       Canvas 背景生成
    ================================================================ */
    var PALETTES = [
        ['#667eea','#764ba2'], ['#f093fb','#f5576c'],
        ['#4facfe','#00f2fe'], ['#43e97b','#38f9d7'],
        ['#fa709a','#fee140'], ['#a18cd1','#fbc2eb'],
        ['#fccb90','#d57eeb'], ['#84fab0','#8fd3f4'],
        ['#30cfd0','#330867'], ['#f7971e','#ffd200'],
    ];

    function drawBackground(canvas, w, h) {
        var ctx = canvas.getContext('2d');
        canvas.width  = w;
        canvas.height = h;

        var pal  = PALETTES[rand(0, PALETTES.length - 1)];
        var grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, pal[0]);
        grad.addColorStop(1, pal[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        /* 半透明圆形装饰 */
        for (var i = 0; i < 14; i++) {
            ctx.beginPath();
            ctx.arc(rand(0, w), rand(0, h), rand(15, 55), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (rand(4, 16) / 100) + ')';
            ctx.fill();
        }

        /* 斜线纹理 */
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        for (var j = -h; j < w + h; j += 20) {
            ctx.beginPath();
            ctx.moveTo(j, 0);
            ctx.lineTo(j + h, h);
            ctx.stroke();
        }
        ctx.restore();

        /* 水印文字 */
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px "Microsoft YaHei", Arial';
        var words = ['安全验证', '拖动滑块', '验证码'];
        for (var k = 0; k < 7; k++) {
            ctx.fillText(words[k % 3], rand(5, w - 65), rand(12, h - 6));
        }
        ctx.restore();
    }

    /* 拼图路径（凸凹边缘） */
    function puzzlePath(ctx, x, y, size, bump) {
        var s = size, b = bump;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + s * 0.35, y);
        ctx.arc(x + s * 0.5, y - b * 0.5, b, Math.PI, 0, true);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x + s, y + s * 0.35);
        ctx.arc(x + s + b * 0.5, y + s * 0.5, b, Math.PI * 1.5, Math.PI * 0.5, false);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x + s * 0.65, y + s);
        ctx.arc(x + s * 0.5, y + s + b * 0.5, b, 0, Math.PI, false);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x, y + s * 0.65);
        ctx.arc(x - b * 0.5, y + s * 0.5, b, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.closePath();
    }

    /* ================================================================
       CaptchaSlide 构造函数（内嵌实例）
    ================================================================ */
    function CaptchaSlide(opts) {
        var defaults = {
            container  : null,
            width      : 320,
            height     : 160,
            pieceSize  : 52,
            tolerance  : 7,
            onPass     : null,
            onFail     : null,
        };
        this.opts      = Object.assign({}, defaults, opts || {});
        this._el       = null;
        this._answer   = 0;
        this._passed   = false;
        this._dragging = false;
        this._startX   = 0;
        this._btnLeft  = 0;
        this._maxLeft  = 0;
        this._onMove   = this._onMove.bind(this);
        this._onUp     = this._onUp.bind(this);
    }

    CaptchaSlide.prototype.init = function () {
        var el = resolveEl(this.opts.container);
        if (!el) { console.warn('[CaptchaSlide] container not found'); return; }
        this._el = el;
        this._build();
        this._generate();
    };

    CaptchaSlide.prototype._build = function () {
        var o = this.opts;
        this._el.innerHTML = [
            '<div class="cs-wrap">',
            '<div class="cs-canvas-wrap" style="width:' + o.width + 'px;height:' + o.height + 'px;">',
            '<canvas class="cs-bg-canvas"></canvas>',
            '<canvas class="cs-piece-canvas"></canvas>',
            '<div class="cs-tip"></div>',
            '</div>',
            '<div class="cs-slider-wrap" style="width:' + o.width + 'px;">',
            '<div class="cs-slider-bar" style="width:' + o.width + 'px;">',
            '<div class="cs-slider-fill" style="width:52px;"></div>',
            '<span class="cs-slider-text">拖动右侧滑块完成拼图</span>',
            '</div>',
            '<div class="cs-slider-btn" tabindex="0" role="button" aria-label="滑块">',
            '<div class="cs-btn-icon"><span></span><span></span><span></span></div>',
            '<span class="cs-btn-checkmark"></span>',
            '</div>',
            '</div>',
            '<div class="cs-footer">',
            '<span class="cs-refresh-btn" title="换一张" role="button" tabindex="0">',
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
            '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>',
            '<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
            '</svg> 刷新</span>',
            '</div></div>',
        ].join('');

        var self = this;
        var btn  = qs('.cs-slider-btn',  this._el);
        var ref  = qs('.cs-refresh-btn', this._el);

        function onStart(e) {
            if (self._passed || self._dragging) return;
            e.preventDefault();
            self._dragging = true;
            self._startX   = self._cx(e);
            self._btnLeft  = parseInt(btn.style.left) || 0;
            self._maxLeft  = o.width - btn.offsetWidth - 2;
            qs('.cs-slider-bar', self._el).classList.add('cs-dragging');
            document.addEventListener('mousemove', self._onMove);
            document.addEventListener('touchmove', self._onMove, { passive: false });
            document.addEventListener('mouseup',   self._onUp);
            document.addEventListener('touchend',  self._onUp);
        }
        btn.addEventListener('mousedown',  onStart);
        btn.addEventListener('touchstart', onStart, { passive: false });
        ref.addEventListener('click', function () { self.reset(); });
        ref.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') self.reset(); });
    };

    CaptchaSlide.prototype._cx = function (e) {
        if (e.touches && e.touches.length)        return e.touches[0].clientX;
        if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
        return e.clientX;
    };

    CaptchaSlide.prototype._onMove = function (e) {
        if (!this._dragging) return;
        e.preventDefault();
        var nl = Math.max(0, Math.min(this._btnLeft + this._cx(e) - this._startX, this._maxLeft));
        qs('.cs-slider-btn',    this._el).style.left = nl + 'px';
        qs('.cs-piece-canvas',  this._el).style.left = nl + 'px';
        qs('.cs-slider-fill',   this._el).style.width = (nl + 52) + 'px';
    };

    CaptchaSlide.prototype._onUp = function () {
        if (!this._dragging) return;
        this._dragging = false;
        document.removeEventListener('mousemove', this._onMove);
        document.removeEventListener('touchmove', this._onMove);
        document.removeEventListener('mouseup',   this._onUp);
        document.removeEventListener('touchend',  this._onUp);
        qs('.cs-slider-bar', this._el).classList.remove('cs-dragging');
        this._verify(parseInt(qs('.cs-slider-btn', this._el).style.left) || 0);
    };

    CaptchaSlide.prototype._generate = function () {
        var o  = this.opts;
        var el = this._el;
        this._passed = false;

        /* 重置 UI */
        var btn   = qs('.cs-slider-btn', el);
        var bar   = qs('.cs-slider-bar', el);
        var fill  = qs('.cs-slider-fill', el);
        var piece = qs('.cs-piece-canvas', el);
        btn.classList.remove('cs-pass', 'cs-fail');
        bar.classList.remove('cs-bar-success', 'cs-bar-error', 'cs-dragging');
        btn.style.left   = '0';
        fill.style.width = '52px';
        piece.style.left = '0';
        qs('.cs-slider-text', el).textContent    = '拖动右侧滑块完成拼图';
        qs('.cs-btn-checkmark', el).textContent  = '';
        this._setTip('', '');

        /* 绘制背景 */
        var bgCv = qs('.cs-bg-canvas', el);
        bgCv.width  = o.width;
        bgCv.height = o.height;
        drawBackground(bgCv, o.width, o.height);

        /* 拼图块参数 */
        var ps    = o.pieceSize;
        var bump  = Math.round(ps * 0.22);
        var extra = bump + 4;   // 拼图块 canvas 四周留白（用于容纳凸起）
        var ansX  = rand(ps + bump + 20, o.width  - ps - bump - 20);
        var ansY  = rand(bump + 10,      o.height - ps - bump - 10);
        // 用户拖到视觉对齐时，滑块 left = ansX - extra（因为块内部从 extra 处开始画）
        this._answer = ansX - extra;

        /* 在背景上画缺口 */
        var bgCtx = bgCv.getContext('2d');
        bgCtx.save();
        puzzlePath(bgCtx, ansX, ansY, ps, bump);
        bgCtx.fillStyle   = 'rgba(0,0,0,.18)';
        bgCtx.fill();
        bgCtx.strokeStyle = 'rgba(255,255,255,.55)';
        bgCtx.lineWidth   = 1.5;
        bgCtx.stroke();
        bgCtx.restore();

        /* 绘制拼图块 canvas */
        var pw = ps + extra * 2;
        var ph = ps + extra * 2;
        piece.width  = pw;
        piece.height = ph;
        piece.style.width  = pw + 'px';
        piece.style.height = ph + 'px';
        piece.style.top    = (ansY - extra) + 'px';

        var pCtx = piece.getContext('2d');
        pCtx.save();
        puzzlePath(pCtx, extra, extra, ps, bump);
        pCtx.clip();
        pCtx.drawImage(bgCv, ansX - extra, ansY - extra, pw, ph, 0, 0, pw, ph);
        puzzlePath(pCtx, extra, extra, ps, bump);
        pCtx.strokeStyle = 'rgba(255,255,255,.85)';
        pCtx.lineWidth   = 1.5;
        pCtx.stroke();
        pCtx.restore();
    };

    CaptchaSlide.prototype._verify = function (x) {
        var el = this._el;
        if (Math.abs(x - this._answer) <= this.opts.tolerance) {
            this._passed = true;
            this._setTip('验证通过 ✓', 'success');
            qs('.cs-slider-btn',  el).classList.add('cs-pass');
            qs('.cs-slider-bar',  el).classList.add('cs-bar-success');
            qs('.cs-slider-fill', el).style.width = (x + 52) + 'px';
            qs('.cs-slider-text', el).textContent  = '验证通过';
            qs('.cs-btn-checkmark', el).textContent = '✓';
            if (typeof this.opts.onPass === 'function') this.opts.onPass();
        } else {
            this._setTip('位置不对，请重试', 'error');
            qs('.cs-slider-btn', el).classList.add('cs-fail');
            qs('.cs-slider-bar', el).classList.add('cs-bar-error');
            qs('.cs-btn-checkmark', el).textContent = '✕';
            var self = this;
            setTimeout(function () { self.reset(); }, 800);
            if (typeof this.opts.onFail === 'function') this.opts.onFail();
        }
    };

    CaptchaSlide.prototype._setTip = function (msg, type) {
        var tip = qs('.cs-tip', this._el);
        tip.className   = 'cs-tip' + (type ? ' cs-tip-visible cs-tip-' + type : '');
        tip.textContent = msg;
    };

    CaptchaSlide.prototype.isPassed = function () { return this._passed; };

    CaptchaSlide.prototype.reset = function () {
        this._passed   = false;
        this._dragging = false;
        document.removeEventListener('mousemove', this._onMove);
        document.removeEventListener('touchmove', this._onMove);
        document.removeEventListener('mouseup',   this._onUp);
        document.removeEventListener('touchend',  this._onUp);
        this._generate();
    };

    /* ================================================================
       静态方法 — 弹窗
    ================================================================ */
    var _MODAL_ID = 'cs-global-modal';
    var _inst     = null;
    var _resolve  = null;   /* Promise resolve 函数 */
    var _reject   = null;

    CaptchaSlide.openModal = function (opts) {
        opts = opts || {};
        CaptchaSlide.closeModal();

        var ov = document.createElement('div');
        ov.id        = _MODAL_ID;
        ov.className = 'cs-modal-overlay';
        ov.innerHTML = [
            '<div class="cs-modal-card" role="dialog" aria-modal="true" aria-label="安全验证">',
            '<div class="cs-modal-head">',
            '<span class="cs-modal-title">请完成安全验证</span>',
            '<button class="cs-modal-close" type="button" title="关闭" aria-label="关闭">&#215;</button>',
            '</div>',
            '<div class="cs-modal-body"><div id="cs-modal-inner"></div></div>',
            '</div>',
        ].join('');
        document.body.appendChild(ov);
        /* 触发 CSS 过渡动画 */
        requestAnimationFrame(function () { ov.classList.add('cs-modal-active'); });

        function doClose(cancelled) {
            CaptchaSlide.closeModal();
            if (cancelled) {
                if (typeof opts.onClose === 'function') opts.onClose();
                if (_reject) { _reject(new Error('cancelled')); _resolve = _reject = null; }
            }
        }

        ov.querySelector('.cs-modal-close').addEventListener('click', function () { doClose(true); });
        ov.addEventListener('click', function (e) { if (e.target === ov) doClose(true); });
        /* ESC 关闭 */
        function onKey(e) { if (e.key === 'Escape') { doClose(true); document.removeEventListener('keydown', onKey); } }
        document.addEventListener('keydown', onKey);

        _inst = new CaptchaSlide({
            container : ov.querySelector('#cs-modal-inner'),
            width     : opts.width  || 320,
            height    : opts.height || 160,
            onPass    : function () {
                setTimeout(function () {
                    CaptchaSlide.closeModal();
                    if (typeof opts.onPass === 'function') opts.onPass();
                    if (_resolve) { _resolve(); _resolve = _reject = null; }
                }, 500);
            },
        });
        _inst.init();
    };

    CaptchaSlide.closeModal = function () {
        var el = document.getElementById(_MODAL_ID);
        if (el) {
            el.classList.remove('cs-modal-active');
            setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
        }
        _inst = null;
    };

    /* ================================================================
       Promise API — verify()
       适合 Vue / async 场景：await CaptchaSlide.verify();
    ================================================================ */
    CaptchaSlide.verify = function (opts) {
        return new Promise(function (resolve, reject) {
            _resolve = resolve;
            _reject  = reject;
            CaptchaSlide.openModal(Object.assign({}, opts || {}, {
                onPass : resolve,
                onClose: function () { reject(new Error('cancelled')); },
            }));
        });
    };

    /* ================================================================
       拦截表单提交（submit 事件）
       CaptchaSlide.interceptForm('#myForm');
       CaptchaSlide.interceptForm('#myForm', { width:320, height:160 });
    ================================================================ */
    CaptchaSlide.interceptForm = function (form, opts) {
        form = resolveEl(form);
        if (!form) return;
        opts = opts || {};

        form.addEventListener('submit', function (e) {
            /* 已通过验证（data 属性标记）则放行 */
            if (form.dataset.csVerified === '1') {
                form.dataset.csVerified = '0';
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            CaptchaSlide.openModal(Object.assign({}, opts, {
                onPass: function () {
                    form.dataset.csVerified = '1';
                    /* 优先用 requestSubmit 以触发内置校验 */
                    if (typeof form.requestSubmit === 'function') {
                        form.requestSubmit();
                    } else {
                        /* 降级：直接调用原生 submit，跳过本拦截 */
                        HTMLFormElement.prototype.submit.call(form);
                    }
                },
            }));
        });
    };

    /* ================================================================
       拦截按钮点击
       CaptchaSlide.interceptSubmit('#loginBtn', { onPass: fn });
    ================================================================ */
    CaptchaSlide.interceptSubmit = function (btn, opts) {
        btn = resolveEl(btn);
        if (!btn) return;
        opts = opts || {};
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            CaptchaSlide.openModal(opts);
        });
    };

    /* ================================================================
       Vue 插件
       Vue 2: Vue.use(CaptchaSlide.VuePlugin)
         → this.$captcha(opts) 返回 Promise
       Vue 3: app.use(CaptchaSlide.VuePlugin)
         → inject('captcha', opts => Promise)
    ================================================================ */
    CaptchaSlide.VuePlugin = {
        install: function (app, options) {
            /* 兼容 Vue 2（Vue.prototype）与 Vue 3（app.config.globalProperties）*/
            var target = (app && typeof app.config === 'object' && app.config.globalProperties)
                ? app.config.globalProperties
                : (app && app.prototype ? app.prototype : null);
            if (target) {
                target.$captcha = function (opts) {
                    return CaptchaSlide.verify(Object.assign({}, options || {}, opts || {}));
                };
            }
        },
    };

    /* ================================================================
       jQuery 插件注册函数（外部也可手动调用）
       _registerJQueryPlugin(jQuery, CaptchaSlide);
    ================================================================ */
    function _registerJQueryPlugin($, CS) {
        $.fn.captchaSlide = function (opts) {
            opts = opts || {};
            return this.each(function () {
                var el = this;
                var tag = el.tagName ? el.tagName.toUpperCase() : '';
                if (tag === 'FORM') {
                    /* 拦截表单提交 */
                    CS.interceptForm(el, opts);
                } else {
                    /* 拦截按钮 / 链接点击 */
                    $(el).on('click', function (e) {
                        e.preventDefault();
                        CS.openModal(opts);
                    });
                }
            });
        };
    }
    /* 如果 jQuery 在模块化环境中晚于本文件加载，提供手动注册入口 */
    CaptchaSlide.registerJQueryPlugin = function ($) { _registerJQueryPlugin($, CaptchaSlide); };

    return CaptchaSlide;
}));
