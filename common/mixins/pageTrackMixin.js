/**
 * 页面浏览埋点 mixin
 * - onShow 时登记当前页（type + type_id 互斥存储），确保离开时上报的是源页而不是目标页
 * - type_id：商品ID与店铺ID互斥，进入商品页存商品ID，进入店铺页存店铺ID
 */

import { reportUserAction, setCurrentPageTrack, takeCurrentPageTrack } from '@/utils/pageTrack.js'

export default function createPageTrackMixin(pageTrackType) {
  if (!pageTrackType) {
    console.warn('[pageTrackMixin] pageTrackType 未传入')
    return {}
  }

  return {
    data() {
      return {
        _pageTrackEnterTime: 0
      }
    },
    onShow() {
      const enterTime = Date.now()
      this._pageTrackEnterTime = enterTime
      let goodsId = ''
      let shopId = ''
      if (typeof this.getPageTrackTypeId === 'function') {
        const id = this.getPageTrackTypeId()
        if (pageTrackType === 'goods') goodsId = id
        else if (pageTrackType === 'shop' || pageTrackType === 'shopsearch') shopId = id
      }
      setCurrentPageTrack(pageTrackType, enterTime, goodsId || undefined, shopId || undefined)

      // 记录下单来源锚点：仅在首页 / 搜索页 / 购物车 / 店铺页更新
      if (pageTrackType === 'home' || pageTrackType === 'search' || pageTrackType === 'carts' || pageTrackType === 'shop') {
        try {
          uni.setStorageSync('order_source_url', pageTrackType)
        } catch (e) {
          // 忽略存储错误，避免影响页面正常流程
        }
      }
    },
    onHide() {
      this._pageTrackReport()
    },
    onUnload() {
      this._pageTrackReport()
    },
    methods: {
      _pageTrackReport() {
        if (!this._pageTrackEnterTime) return
        const track = takeCurrentPageTrack()
        let type, times, type_id
        if (track && track.type === pageTrackType) {
          type = track.type
          times = Math.floor((Date.now() - track.enterTime) / 1000)
          type_id = track.type_id
        } else {
          type = pageTrackType
          times = Math.floor((Date.now() - this._pageTrackEnterTime) / 1000)
          if (typeof this.getPageTrackTypeId === 'function') {
            const id = this.getPageTrackTypeId()
            type_id = id != null && id !== '' ? id : undefined
          } else {
            type_id = undefined
          }
        }
        this._pageTrackEnterTime = 0
        reportUserAction({ type, times, type_id })
      }
    }
  }
}
