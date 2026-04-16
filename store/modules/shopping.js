import {
	GOODS_CART_LIST,
	GOODS_GUESS_LIST,
	STORE_ALL,
	SHIPPING,
	SHIPPING_FEE,
	CHECKOUT,
	CHECKOUT_TOTAL,
	DONEINFO,
	PAYLIST,
	CART_COUPONS_LIST,
	COUDAN_GOODS_LIST,
	COUDAN_INFO
} from '../mutation-type.js'

import { apiShopping } from '@/config'
import isLogin from '@/common/mixins/isLogin'
const APPLY_CART_INFO_PATCH = 'APPLY_CART_INFO_PATCH'

function normalizeAddV1Success(res) {
	if (!res) return false
	const statusOk = res.status === 'success'
	const dataOk = !!(res.data && Number(res.data.error) !== 1)
	return statusOk || dataOk
}

function getCartInfoList(res) {
	if (res && res.data && Array.isArray(res.data.cart_info)) return res.data.cart_info
	return []
}

const state = {
	goodsCartList:[],
	goodsGuessList:[],
	ongoodsGuessList:[],
	checkedGoods:[],
	allGoodsListId:[],
	checkedShop:[],
	shipping_fee:'',
	checkoutInfo:'',
	listShow:[],
	cartCheckedVlaue:[],
	pay_list:[],
	pay_id:'',
	doneinfo:'',
	cartCouponsList:[],
	coudanGoodsList:[],
	coudanInfo:''
}

const mutations = {
	[GOODS_CART_LIST](state, o){
	  state.goodsCartList = o.data ? o.data : [];

	  if (o.preserveSelection) {
	    const len = state.goodsCartList.length;
	    while (state.checkedGoods.length < len) state.checkedGoods.push([]);
	    if (state.checkedGoods.length > len) state.checkedGoods.splice(len);
	    while (state.checkedShop.length < len) state.checkedShop.push(false);
	    if (state.checkedShop.length > len) state.checkedShop.splice(len);
	    state.allGoodsListId = state.goodsCartList.map(() => []);
	  } else {
	    state.checkedGoods = state.goodsCartList.map(() => []);
	    state.allGoodsListId = state.goodsCartList.map(() => []);
	    state.checkedShop = state.goodsCartList.map(store => store.checked);
	  }
	},
	[STORE_ALL](state,o){
		for(let i = 0; i<state.goodsCartList.length; i++){
			state.goodsCartList[i].checked = o.type
		}
	},
	[SHIPPING](state,o){
	},
	[SHIPPING_FEE](state,o){
		state.shipping_fee = o.data
	},
	[CHECKOUT](state,{o,res}){
		// console.log(state)
		// console.log(o)
		// console.log(res)
		state.checkoutInfo = res
		if(!res.error){
			if(res.goods_list){
				res.goods_list.forEach((v)=>{
					if(v.goods.length > 1){
						state.listShow.push(true)
					}else{
						state.listShow.push(false)
					}
				})
			}
		}
		// 【关键修复】移除这里的 uni.hideLoading()
		// 原因：loading 应该在 checkoutDefault 方法的 promise 回调中统一关闭
		// 这样可以确保接口真正返回成功且数据完全处理后才关闭 loading
		// uni.hideLoading();
	},
	[CHECKOUT_TOTAL](state,o){
		// 【关键修复】合并更新而不是完全替换，确保不会丢失其他接口返回的字段
		// 例如：changecou 返回 coupons_money，changecard 返回 card_money
		// 如果完全替换，会导致 coupons_money 丢失
		// 【核心修复】智能合并：只覆盖新数据中明确存在的字段，避免用 0 覆盖有效值
		// 每个接口只负责更新自己的字段：
		// - changecou 负责 coupons_money、coupons_id
		// - changecard 负责 card_money、value_card_id
		// - changeint 负责 integral
		// - changebon 负责 bonus_money、bonus_id
		// - changesurplus 负责 surplus
		const oldTotal = state.checkoutInfo.total || {};
		// 智能合并：只更新新数据中明确存在的字段
		// 【核心修复】对于关键字段（coupons_money、integral、bonus_money），如果新值是 0 且旧值存在且非 0，则保留旧值
		// 因为这些字段是特定接口负责的，不应该被其他接口用 0 覆盖
		const merged = { ...oldTotal };
		
		// 定义关键字段及其对应的接口
		const criticalFields = {
			'coupons_money': 'changecou',      // 优惠券接口负责
			'coupons_id': 'changecou',         // 优惠券接口负责
			'integral': 'changeint',           // 积分接口负责
			'bonus_money': 'changebon',        // 红包接口负责
			'bonus_id': 'changebon'            // 红包接口负责
		};
		
		// 遍历新数据，只更新明确存在的字段
		Object.keys(o).forEach(key => {
			if (o.hasOwnProperty(key)) {
				const newValue = o[key];
				const oldValue = oldTotal[key];
				
				// 对于关键字段，如果新值是 0（或空字符串、空数组）且旧值存在且非 0，则保留旧值
				if (criticalFields.hasOwnProperty(key)) {
					const isNewValueEmpty = (
						newValue === 0 || 
						newValue === '0' || 
						newValue === '0.00' || 
						newValue === '' || 
						(Array.isArray(newValue) && newValue.length === 0) ||
						(Array.isArray(newValue) && newValue.length === 1 && newValue[0] === 0)
					);
					const isOldValueValid = (
						oldValue !== undefined && 
						oldValue !== null && 
						oldValue !== 0 && 
						oldValue !== '0' && 
						oldValue !== '0.00' && 
						oldValue !== '' &&
						!(Array.isArray(oldValue) && oldValue.length === 0) &&
						!(Array.isArray(oldValue) && oldValue.length === 1 && oldValue[0] === 0)
					);
					
					if (isNewValueEmpty && isOldValueValid) {
						// 保留旧值，不更新
						return; // 跳过更新
					}
				}
				
				// 其他字段或关键字段的新值有效，则更新
				merged[key] = newValue;
			}
		});
		
		state.checkoutInfo.total = merged;
	},
	[DONEINFO](state,o){
		state.doneinfo = o
	},
	[PAYLIST](state,o){
		let length = 0
		state.pay_list = o
		state.pay_id = ''
		state.pay_list.forEach((v)=>{
			if(v.selected){
				state.pay_id = v.pay_id
				
				length ++;
			}
		})
		
		if(length == 0){
			state.pay_id = state.pay_list[0].pay_id
		}
	},
	[GOODS_GUESS_LIST](state,o){
		if(o.page == 1){
			state.goodsGuessList = o.data
			state.ongoodsGuessList = o.data
		}else{
			// 替换成组件中做了数据比较  直接用最新的数据
			if(o.data.length != 0){
				for(let i= 0;i<o.data.length;i++){
					state.goodsGuessList.push(o.data[i])
				}
			}
			// 最新的10条数据
				state.ongoodsGuessList = o.data
		}
	},
	[CART_COUPONS_LIST](state,o){
		// 兼容多种接口返回格式：data 直接为数组，或 data.list / data.coupons
		let list = [];
		const data = o ? o.data : null;
		if (data) {
			// 1) data 就是数组
			if (Array.isArray(data)) list = data;
			// 2) data.data 就是数组（常见：res.data.data）
			else if (data.data && Array.isArray(data.data)) list = data.data;
			// 2.1) data.data 是对象（常见：data: {"1":{...},"2":{...}}）
			else if (data.data && data.data && typeof data.data === 'object') list = Object.values(data.data);
			// 3) data.data.list 或 data.data.coupons
			else if (data.data && Array.isArray(data.data.list)) list = data.data.list;
			else if (data.data && Array.isArray(data.data.coupons)) list = data.data.coupons;
			// 4) data.list / data.coupons
			else if (Array.isArray(data.list)) list = data.list;
			else if (Array.isArray(data.coupons)) list = data.coupons;
			// 5) data.list / data.coupons 可能也是对象
			else if (data.list && typeof data.list === 'object') list = Object.values(data.list);
			else if (data.coupons && typeof data.coupons === 'object') list = Object.values(data.coupons);
			// 6) 最后兜底：data 本身是对象（数值 key）
			else if (typeof data === 'object') list = Object.values(data);
		}
		state.cartCouponsList = list || [];
	},
	[COUDAN_GOODS_LIST](state,o){
		// 兼容多种接口返回：
		// 1) 旧：o.data 直接为数组
		// 2) 新：o.data 为对象，数组在 o.data.list
		const payload = o ? o.data : null
		let list = []
		if (Array.isArray(payload)) {
			list = payload
		} else if (payload && Array.isArray(payload.list)) {
			list = payload.list
		} else if (payload && payload.data && Array.isArray(payload.data)) {
			list = payload.data
		} else if (payload && payload.data && Array.isArray(payload.data.list)) {
			list = payload.data.list
		} else if (payload && typeof payload === 'object') {
			// 兜底：尝试把对象值拼成数组
			list = Array.isArray(payload) ? payload : []
		}

		if(o.page == 1){
			state.coudanGoodsList = list
		}else{
			if(list.length != 0){
				for(let i= 0;i<list.length;i++){
					state.coudanGoodsList.push(list[i])
				}
			}
		}
	},
	[COUDAN_INFO](state,o){
		state.coudanInfo = o.data
	},
	[APPLY_CART_INFO_PATCH](state, payload){
		const cartInfo = payload && Array.isArray(payload.cartInfo) ? payload.cartInfo : []
		if (!Array.isArray(cartInfo) || cartInfo.length === 0) return
		if (!Array.isArray(state.goodsCartList) || state.goodsCartList.length === 0) return

		const map = {}
		cartInfo.forEach(row => {
			if (!row) return
			const recId = row.rec_id ?? row.recid ?? row.recId
			if (recId === null || recId === undefined) return
			map[String(recId)] = row
		})

		state.goodsCartList.forEach(store => {
			if (!store || !Array.isArray(store.new_list)) return
			store.new_list.forEach(act => {
				if (!act || !Array.isArray(act.act_goods_list)) return
				act.act_goods_list.forEach(goods => {
					if (!goods) return
					const recId = goods.rec_id ?? goods.recid ?? goods.recId
					if (recId === null || recId === undefined) return
					const row = map[String(recId)]
					if (!row) return

					const nextNum = Number(row.goods_number)
					if (!Number.isNaN(nextNum) && nextNum >= 0) {
						goods.goods_number = nextNum
					}
				})
			})
		})
	}
}

const actions = {
	async setAddCart({ commit }, o){
		return apiShopping.getAddCart(o)
	},
	async setAddCartV1({ commit }, o){
		return apiShopping.getAddCartV1(o)
	},
	// 统一同步器：add_v1 成功后，cart_info 优先增量更新 + 事件通知
	async syncCartAfterAddV1({ state, commit }, payload){
		const addResponse = payload && payload.addResponse ? payload.addResponse : null
		const source = payload && payload.source ? payload.source : 'unknown'

		if (!normalizeAddV1Success(addResponse)) {
			return { success: false, hitCount: 0, cartInfoCount: 0 }
		}

		const cartInfo = getCartInfoList(addResponse)
		let hitCount = 0

		if (Array.isArray(cartInfo) && cartInfo.length > 0 && Array.isArray(state.goodsCartList)) {
			const recSet = new Set()
			state.goodsCartList.forEach(store => {
				if (!store || !Array.isArray(store.new_list)) return
				store.new_list.forEach(act => {
					if (!act || !Array.isArray(act.act_goods_list)) return
					act.act_goods_list.forEach(goods => {
						const recId = goods && (goods.rec_id ?? goods.recid ?? goods.recId)
						if (recId !== null && recId !== undefined) recSet.add(String(recId))
					})
				})
			})

			cartInfo.forEach(row => {
				const recId = row && (row.rec_id ?? row.recid ?? row.recId)
				if (recId === null || recId === undefined) return
				if (recSet.has(String(recId))) hitCount++
			})

			commit(APPLY_CART_INFO_PATCH, { cartInfo })
		}

		try {
			uni.$emit('cart-data-updated', {
				source,
				mode: (cartInfo.length > 0 && hitCount > 0) ? 'patch' : 'fallback',
				hitCount,
				cartInfoCount: cartInfo.length,
				timestamp: Date.now()
			})
		} catch (e) {}

		return {
			success: true,
			hitCount,
			cartInfoCount: cartInfo.length
		}
	},
	async setGoPuHuo({ commit }, o){
		return apiShopping.goPuHuo(o)
	},
	async setGoodsCart({ commit }, o){
		try {
			const res = await apiShopping.getCartList(o);
			// 如果是静默模式，不更新store，只返回数据
			if (!o.silent) {
				commit(GOODS_CART_LIST, res);
			}
			return res;
		} catch (error) {
			console.error('获取购物车数据失败:', error);
			throw error;
		}
	},
	async setCartMoreGoods({ commit }, o){
		try {
			const res = await apiShopping.getCartMoreGoods(o);
			return res;
		} catch (error) {
			console.error('获取更多购物车商品失败:', error);
			throw error;
		}
	},
	async setCartPrice({ commit }, o){
		try {
			const res = await apiShopping.getCartPrice(o);
			return res;
		} catch (error) {
			console.error('计算购物车价格失败:', error);
			throw error;
		}
	},
	async 	setCartNewGoodsList({ commit }, o){
		try {
			const res = await apiShopping.getCartNewGoodsList(o);
			return res;
		} catch (error) {
			console.error('获取购物车新增商品失败:', error);
			throw error;
		}
	},
	// 验证购物车商品是否已生成订单
	async verifyCartRecIds({ commit }, params) {
		try {
			const res = await apiShopping.verifyCartRecIds(params);
			return res;
		} catch (error) {
			console.error('验证购物车商品订单状态失败:', error);
			throw error;
		}
	},
	// 在store action中添加分页或分批处理
	// async setGoodsCart({ commit }, o) {
	//   try {
	//     commit('SET_LOADING', true);
	    
	//     const res = await apiShopping.getCartList(o);
	    
	//     // 分批处理数据，避免阻塞UI
	//     setTimeout(() => {
	//       commit(GOODS_CART_LIST, res);
	//       commit('SET_LOADING', false);
	//     }, 0);
	    
	//     return res;
	//   } catch (error) {
	//     console.error('获取购物车数据失败:', error);
	//     commit('SET_LOADING', false);
	//     throw error;
	//   }
	// },

	
	setUpdateNumber({ commit }, o){
		return apiShopping.getUpdateNumber(o)
	},
	setGiftList({ commit }, o){
		return apiShopping.getGiftList(o)
	},
	setGiftChecked({ commit }, o){
		return apiShopping.getGiftChecked(o)
	},
	setFavourable({ commit }, o){
		return apiShopping.getFavourable(o)
	},
	setChangefav({ commit }, o){
		return apiShopping.getChangefav(o)
	},
	setCoupons({ commit }, o){
		apiShopping.getCoupons(o).then(res=>{
			commit(CART_COUPONS_LIST,res)
		})
	},
	setCoudanGoodsList({ commit }, o){
		return apiShopping.getCoudanGoodsList(o).then(res=>{
			commit(COUDAN_GOODS_LIST,res)
			return res // 返回数据以便组件检查返回的数据量
		})
	},
	setCoudan({ commit },o){
		apiShopping.getCoudan(o).then(res=>{
			commit(COUDAN_INFO,res)
		})
	},
	setCartGoodsDelete({ commit }, o){
		return apiShopping.getCartGoodsDelete(o)
	},
	setCartInvalidGoodsDelete({ commit }, o){
		return apiShopping.getCartInvalidGoodsDelete(o)
	},
	setCartBatchDelete({ commit }, o){
		return apiShopping.getCartBatchDelete(o)
	},
	setShippingFee({ commit }, o){
		apiShopping.getShippingFee(o).then(res=>{
			commit(SHIPPING_FEE,res)
		})
	},
	setShipping({ commit }, o){
		return apiShopping.getShipping(o)
	},
	setCartChecked({ commit }, o){
		return apiShopping.getCartChecked(o)
	},
	setCartDefault({ commit }, o){
		return apiShopping.getCartDefault(o)
	},
	setStoresCart({ commit }, o){
		return apiShopping.getStoresCart(o)
	},
	storeAll({ commit }, o){
		commit(STORE_ALL, o)
	},
	setShoppingCheckout({ commit }, o){
		return apiShopping.getShoppingCheckout(o).then(res=>{
			commit(CHECKOUT, {o,res})
			return res; // 返回结果，供组件使用
		}).catch(error => {
			// 捕获错误并返回，供组件处理
			return Promise.reject(error);
		})
	},
	setCheckoutTotal({ commit }, o){
		commit(CHECKOUT_TOTAL,o)
	},
	setCheckoutSubmit({ commit }, o){
		return apiShopping.getCheckoutSubmit(o)
	},
	setDoneInfo({ commit }, o){
		apiShopping.getDoneInfo(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setDoneInfoBalance({ commit }, o){
		apiShopping.getDoneInfoBalance(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setPayList({ commit }, o){
		apiShopping.getPayList(o).then(res=>{
			commit(PAYLIST, res)
		})
	},
	setPayTab({ commit }, o){
		return apiShopping.getPayTab(o)
	},
	setGoodsGuess({ commit }, o){
		apiShopping.getGoodsGuess(o).then(res =>{
			commit(GOODS_GUESS_LIST,res)
		})
	},
	getGoodsGuessList({ commit }, o){
		return apiShopping.getGoodsGuess(o)
	},
	setAddPackageCart({ commit }, o){
		return apiShopping.getAddPackageCart(o)
	}
}

export default{
	state,
	mutations,
	actions
}