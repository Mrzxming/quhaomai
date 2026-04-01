/**
 * 页面浏览埋点工具
 * 用于统计用户在首页、搜索页、商品页、购物车、店铺页、店铺搜索页、结算页的浏览时长
 * 每次离开页面或关闭APP时上报
 *
 * 全局当前页信息：type 和 type_id 必须在 onShow 时登记，onHide/onUnload 时用登记的值上报
 * （避免生命周期顺序导致上报成目标页而不是源页）
 * type_id：商品ID与店铺ID互斥，进入商品页存商品ID，进入店铺页存店铺ID并替换
 */

import { websiteUrl } from '@/config/local/config.js'
import { incrementVersion } from '@/utils/version.js'

/** 当前页埋点信息（仅在 onShow 登记，onHide 用此上报，确保 type 是离开的源页） */
let _currentTrack = null

/** type_id 全局互斥存储：有商品ID则无店铺ID，有店铺ID则无商品ID */
let _typeIdStore = { goodsId: null, shopId: null }

/**
 * 登记当前页（在 onShow 时调用）
 * @param {string} type - home | search | goods | carts | shop | shopsearch | check
 * @param {number} enterTime - 进入时间戳
 * @param {string|number} [goodsId] - 商品ID（仅商品页传）
 * @param {string|number} [shopId] - 店铺ID（仅店铺/店铺搜索页传）
 */
export function setCurrentPageTrack(type, enterTime, goodsId, shopId) {
  if (goodsId != null && goodsId !== '') {
    _typeIdStore = { goodsId: String(goodsId), shopId: null }
  } else if (shopId != null && shopId !== '') {
    _typeIdStore = { goodsId: null, shopId: String(shopId) }
  } else {
    _typeIdStore = { goodsId: null, shopId: null }
  }
  let type_id
  if (type === 'goods') type_id = _typeIdStore.goodsId
  else if (type === 'shop' || type === 'shopsearch') type_id = _typeIdStore.shopId
  else type_id = undefined
  _currentTrack = { type, enterTime, type_id }
}

/**
 * 取当前页埋点用于上报（上报后清除，确保 type 是离开的页面不是目标页）
 */
export function takeCurrentPageTrack() {
  const t = _currentTrack
  _currentTrack = null
  return t
}

/** 生成简单 UUID，用于 H5 等无 deviceId 时 */
function genDeviceId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 获取设备标识
 */
export function getDeviceId() {
  try {
    const sys = uni.getSystemInfoSync()
    if (sys.deviceId) return sys.deviceId
    // 无 deviceId 时使用本地生成并缓存
    let id = uni.getStorageSync('_page_track_device_id')
    if (!id) {
      id = genDeviceId()
      uni.setStorageSync('_page_track_device_id', id)
    }
    return id
  } catch (e) {
    return uni.getStorageSync('_page_track_device_id') || genDeviceId()
  }
}

/**
 * 获取平台字符串
 * 平台：ios Android H5 web wxapp
 */
export function getPlatform() {
  try {
    // #ifdef MP-WEIXIN
    return 'wxapp'
    // #endif
    // #ifdef H5
    return 'H5'
    // #endif
    // #ifdef APP-PLUS
    const sys = uni.getSystemInfoSync()
    const p = (sys.platform || sys.osName || '').toLowerCase()
    if (p === 'ios' || p === 'mac') return 'ios'
    if (p === 'android') return 'Android'
    return p || 'Android'
    // #endif
    return 'web'
  } catch (e) {
    return 'web'
  }
}

/**
 * 获取设备品牌/型号（如 huawei）
 */
export function getModel() {
  try {
    const sys = uni.getSystemInfoSync()
    return sys.model || sys.brand || ''
  } catch (e) {
    return ''
  }
}

/**
 * 获取 APP 版本号
 */
export function getAppVersion() {
  return incrementVersion()
}

/**
 * 获取埋点上报所需的基础参数
 */
export function getTrackParams() {
  return {
    device_id: getDeviceId(),
    model: getModel(),
    platform: getPlatform(),
    app_version: getAppVersion()
  }
}

/**
 * 上报用户行为
 * @param {Object} opts
 * @param {string} opts.type - home | search | goods | carts | shop | shopsearch | check
 * @param {number} opts.times - 浏览时长(秒)
 * @param {string|number} [opts.type_id] - type 对应商品、店铺ID（可选）
 */
export function reportUserAction(opts) {
  const { type, times, type_id } = opts
  const base = getTrackParams()
  const data = {
    ...base,
    type,
    times: Math.max(0, Math.floor(times))
  }
  if (type_id != null && type_id !== '') {
    data.type_id = String(type_id)
  }

  uni.request({
    url: websiteUrl + '/api/appcomment/setuseraction',
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
      token: uni.getStorageSync('token'),
      'X-Client-Hash': uni.getStorageSync('client_hash')
    },
    success: (res) => {
      if (res.data && res.data.status === 'failed') {
        console.warn('[pageTrack] 上报失败:', res.data)
      }
    },
    fail: (err) => {
      console.warn('[pageTrack] 上报请求失败:', err)
    }
  })
}
