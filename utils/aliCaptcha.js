/**
 * H5 阿里图形验证码（captcha4）公共工具
 *
 * 为什么需要这个工具：
 *   旧实现中每个登录/注册/绑定页各自实现了一套 initH5AliCaptcha，
 *   问题：
 *     1) mounted 里无条件调用 → 用户没点按钮就污染 body
 *     2) 每次 init 只清 #captcha 的 innerHTML，不删老节点，然后 appendChild
 *        新的同 id 节点 → body 里同 id 多重 DOM
 *     3) <script src="../../static/ct4.js"> 每次都 append，不删老的
 *     4) 页面销毁后没清 body 残留 → SPA 下首页/详情等无关页面也能看到
 *        SDK 默认按钮 (.captcha4_btn_click) 残留
 *
 * 本工具统一解决：
 *   - cleanupAliCaptchaDom：硬清 body 上所有 [id=captcha] / [class*=captcha4]
 *     / <script src*=ct4.js>，用于初始化前 & 页面销毁时
 *   - initAliCaptchaH5：按需初始化。ct4.js 只加载一次（单例），每次只 rebuild
 *     #captcha 容器，SDK 实例用完即抛
 *
 * 仅 H5 可用。APP/小程序请走 <captcha4> 组件 / 原生 SDK。
 */

/**
 * 彻底清理 body 上所有阿里验证码相关 DOM（容器、按钮、弹窗、遮罩）。
 * 保留 window.initAlicom4（ct4.js 已注入的全局函数），下次复用。
 * 同时清理 <script src*=ct4.js>，防止 script 多次注入。
 * 仅 H5 生效，其他平台空操作。
 */
export function cleanupAliCaptchaDom() {
	// #ifdef H5
	if (typeof document === 'undefined') return
	const selectors = [
		'[id="captcha"]',
		'[class*="captcha4_btn"]',
		'[class*="captcha4_holder"]',
		'[class*="captcha4_popup"]',
		'[class*="captcha4_mask"]',
		'[class*="captcha4_nextReady"]',
		'[class*="captcha4_wrapper"]',
		'[class*="captcha4_container"]',
		'[class*="captcha4_customTheme"]',
		'script[src*="ct4.js"]',
		'script[src*="captcha4"]'
	]
	selectors.forEach(sel => {
		try {
			document.querySelectorAll(sel).forEach(node => {
				if (node && node.parentNode) node.parentNode.removeChild(node)
			})
		} catch (e) {}
	})
	// #endif
}

/**
 * 获取当前 H5 运行环境下的 static 资源基路径。
 *
 * 这个项目 manifest.json 里 h5.router.base = "/mobile/"，也就是 webpack
 * publicPath 就是 "/mobile/"。如果调用方写死 scriptSrc="/static/ct4.js"，
 * 实际 URL 会是 https://host/static/ct4.js，SPA 的 history fallback 会把它
 * 当成路由兜底返回 index.html，浏览器把 HTML 当 JS 解析出 SyntaxError，
 * script.onload 仍会触发，但 window.initAlicom4 始终 undefined，
 * 报 "initAlicom4 is not a function"。
 *
 * 优先级：
 *   1) webpack 注入的 __webpack_public_path__（uni-app H5 构建会带）
 *   2) <base href> 标签的路径
 *   3) window.location.pathname 里提取 /mobile/ 这种前缀段
 *   4) '/'
 */
function resolveStaticBase() {
	try {
		// 1) webpack 的 publicPath（uni-app H5 编译后会把 manifest h5.router.base 注入到这里）
		if (typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__) {
			return String(__webpack_public_path__)
		}
	} catch (e) {}
	try {
		// 2) <base href>
		const baseEl = document.querySelector('base')
		if (baseEl && baseEl.getAttribute('href')) {
			return baseEl.getAttribute('href')
		}
	} catch (e) {}
	try {
		// 3) 从当前 URL 推断第一级目录（最粗略兜底）
		const m = window.location.pathname.match(/^\/([^\/]+)\//)
		if (m) return '/' + m[1] + '/'
	} catch (e) {}
	return '/'
}

/**
 * 把用户传入的 scriptSrc 规整为"publicPath + 相对路径"，兼容部署在 /mobile/ 等子路径下的情况。
 *   - 绝对 URL（http/https/协议相对）原样返回
 *   - '/static/xxx.js' 视为希望相对 publicPath 的路径，拼成 '<base>static/xxx.js'
 *   - 相对路径也拼成 '<base>xxx'
 */
function resolveScriptSrc(scriptSrc) {
	if (!scriptSrc) return scriptSrc
	if (/^(https?:)?\/\//i.test(scriptSrc)) return scriptSrc
	const base = resolveStaticBase().replace(/\/+$/, '/') // 保证末尾恰好一个 /
	const rel = scriptSrc.replace(/^\/+/, '')             // 去掉开头所有 /
	return base + rel
}

/**
 * H5 按需初始化阿里验证码。
 *
 * @param {Object} options
 * @param {String} options.captchaId   阿里控制台的 captchaId
 * @param {String} [options.scriptSrc] ct4.js 相对路径（相对于 webpack publicPath），默认 'static/ct4.js'
 * @param {Function} options.onSuccess 校验成功回调，参数为 captcha.getValidate() 结果
 * @param {Function} [options.onReady] SDK 初始化完成回调（参数 captcha 实例）
 * @param {Function} [options.onError] SDK 加载/初始化失败回调
 * @returns {Promise<Object>} 解析为 captcha 实例；失败 reject
 */
export function initAliCaptchaH5(options) {
	// #ifdef H5
	const {
		captchaId,
		scriptSrc = 'static/ct4.js',
		onSuccess,
		onReady,
		onError
	} = options || {}

	return new Promise((resolve, reject) => {
		if (typeof document === 'undefined' || typeof window === 'undefined') {
			const err = new Error('initAliCaptchaH5: not in browser env')
			if (onError) onError(err)
			return reject(err)
		}
		if (!captchaId) {
			const err = new Error('initAliCaptchaH5: captchaId is required')
			if (onError) onError(err)
			return reject(err)
		}

		cleanupAliCaptchaDom()

		const container = document.createElement('div')
		container.id = 'captcha'
		document.body.appendChild(container)

		const boot = () => {
			try {
				window.initAlicom4({
					captchaId,
					product: 'popup'
				}, (captcha) => {
					try {
						captcha.appendTo('#captcha')

						// 保险：SDK 默认 trigger 按钮就地隐藏一次；外层 App.vue 也有 CSS 兜底
						const btn = document.querySelector('#captcha .captcha4_btn_click')
						if (btn) {
							btn.style.display = 'none'
							btn.style.visibility = 'hidden'
							btn.style.pointerEvents = 'none'
						}

						if (!captcha.reset) {
							captcha.reset = function() {
								try {
									this.appendTo('#captcha')
									this.verify()
								} catch (e) {}
							}.bind(captcha)
						}

						if (typeof onSuccess === 'function') {
							captcha.onSuccess(() => {
								try {
									const result = captcha.getValidate()
									onSuccess(result)
								} catch (e) {}
							})
						}

						if (typeof onReady === 'function') onReady(captcha)
						resolve(captcha)
					} catch (e) {
						if (onError) onError(e)
						reject(e)
					}
				})
			} catch (e) {
				if (onError) onError(e)
				reject(e)
			}
		}

		// 【单例】ct4.js 已加载过直接复用 window.initAlicom4，不再重复注入 script
		if (typeof window.initAlicom4 === 'function') {
			boot()
			return
		}

		const script = document.createElement('script')
		const finalSrc = resolveScriptSrc(scriptSrc)
		script.src = finalSrc
		script.onload = () => {
			// 【关键】script.onload 并不保证 JS 解析成功。典型场景：
			// 部署在 /mobile/ 下但 scriptSrc 写死 /static/ct4.js，SPA history
			// fallback 会返回 index.html，浏览器当 JS 解析报 SyntaxError，
			// onload 仍然触发。这里显式校验 window.initAlicom4 是否已注入，
			// 未注入则视为加载失败并走 onerror 流程。
			if (typeof window.initAlicom4 !== 'function') {
				const err = new Error('[aliCaptcha] ct4.js loaded but window.initAlicom4 not found, src=' + finalSrc + ' (检查 publicPath / 部署 base 路径是否正确)')
				if (onError) onError(err)
				return reject(err)
			}
			boot()
		}
		script.onerror = (e) => {
			const err = new Error('[aliCaptcha] ct4.js load failed, src=' + finalSrc)
			err.origin = e
			if (onError) onError(err)
			reject(err)
		}
		document.body.appendChild(script)
	})
	// #endif

	// #ifndef H5
	return Promise.resolve(null)
	// #endif
}

export default {
	cleanupAliCaptchaDom,
	initAliCaptchaH5
}
