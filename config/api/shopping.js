import * as localConfig from '../local/config'
import request from '@/common/request.js'

const webUrl = localConfig.websiteUrl



/* 加入购物车 */
function getAddCart(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/add',o).then(res=>{
			reslove(res)
		})
	})
}
/* 商品详情规格加入购物车 */
function getAddCartV1(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/add_v1',o).then(res=>{
			reslove(res)
		})
	})
}
/* 去铺货 */
function goPuHuo(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/puhuo/addpuhuogoodslist',o).then(res=>{
			reslove(res)
		})
	})
}

/* 超值礼包加入购物 */
function getAddPackageCart(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/addpackage',o).then(res=>{
			reslove(res.data)
		})
	})
}

/* 购物车商品列表 */
// function getCartList(o){
// 	return new Promise((reslove, reject) => {
// 		request.post(webUrl + '/api/cart/goodslist',o).then(res=>{
// 			for(var i=0;i<res.data.length;i++){
// 				for(var j=0;j<res.data[i].new_list.length;j++){
// 					for(var z=0;z<res.data[i].new_list[j].act_goods_list.length;z++){
// 						res.data[i].new_list[j].act_goods_list[z].checked = false
// 					}
// 				}
// 			}
// 			reslove(res)
// 		})
// 	})
// }
function getCartList(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/goodslist',o).then(res=>{
		
			reslove(res)
		})
	})
}

/* 购物车查看更多商品 */
function getCartMoreGoods(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/goodslist',o).then(res=>{
			reslove(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

/* 购物车价格计算 */
function getCartPrice(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/shipping/reckon_cartgoods',o).then(res=>{
			reslove(res)
		}).catch(err=>{
			reject(err)
		})
	})
}



/* 购物车商品删除 */
function getCartGoodsDelete(o) {
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/deletecart',o).then(res=>{
			reslove(res.data)
		})
	})
}


/* 购物车商品删除失效商品 */
function getCartInvalidGoodsDelete(o) {
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/cart/clearCartInvalid',o).then(res=>{
			reslove(res.data)
		})
	})
}

/* 获取购物车新增商品列表（增量更新） */
function getCartNewGoodsList(o) {
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/get_cart_new_goodslist', o).then(res => {
			reslove(res)
		}).catch(err => {
			reject(err)
		})
	})
}



/* 购物车商品批量删除 */
function getCartBatchDelete(o) {
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/clearcart',o).then(res=>{
			reslove(res.data)
		})
	})
}

/* 验证购物车商品是否已生成订单 */
function verifyCartRecIds(o) {
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/verificationRecid', o).then(res => {
			reslove(res)
		}).catch(err => {
			reject(err)
		})
	})
}

/* 购物车默认进来访问 */
function getCartDefault(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/cartvalue',o).then(res=>{
			reslove({
				data:res.data,
				rec_id:o.rec_id,
				act_id:o.act_id
			})
		})
	})
}

/* 购物车勾选商品 */
function getCartChecked(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/checked',o).then(res=>{
			reslove({
				data:res.data,
				rec_id:o.rec_id
			})
		})
	})
}

/* 购物车商品数量修改 */
function getUpdateNumber(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/update',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车赠品列表 */
function getGiftList(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/giftlist',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车赠品选择 */
function getGiftChecked(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/addGiftCart',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车促销活动列表 */
function getFavourable(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/getfavourable',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车促销活动切换 */
function getChangefav(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/changefav',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车优惠券 */
function getCoupons(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/getCoupons',o).then(res=>{
			reslove(res)
		})
	})
}

/* 凑单商品列表  /api/activity/goods  2026/0330 改版之前凑单接口，暂弃用*/
function getCoudanGoodsList(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/activity/full_reduction_coudan_goods',o).then(res=>{
			reslove({
				data:res.data,
				size:o.size,
				page:o.page
			})
		})
	})
}


/* 凑单信息 */
function getCoudan(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/activity/coudan',o).then(res=>{
			reslove(res)
		})
	})
}

/* 购物车推荐商品 */
function getGoodsGuess(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/goods/goodsguess',o).then(res=>{
			reslove({
				data:res.data,
				size:o.size,
				page:o.page
			})
		})
	})
}

/* 门店购买 */
function getStoresCart(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/cart/add',o).then(res=>{
			reslove({
				data:res.data,
				store_id:o.store_id
			})
		})
	})
}

/* 获取配送方式 */
function getShipping(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/shipping',o).then(res=>{
			reslove(res)
		})
	})
}

/* 获取商品运费 */
function getShippingFee(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/shipping/goodsshippingfee',o).then(res=>{
			console.log(res)
			reslove(res)
		})
	})
}

/* 结算页面信息 */
function getShoppingCheckout(o){
	console.log('[getShoppingCheckout] 开始调用接口，参数:', o);
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/trade/orderinfo',o).then(res=>{
			console.log('[getShoppingCheckout] 接口返回，res:', res);
			// 注意：request 拦截器已经返回了 response.data，所以 res 就是 response.data
			// 失败数据结构: {"status":"failed","errors":{"code":6652,"message":"提交失败，请重试"}}
			// 成功数据结构: {"status":"success","data":{goods_list: [...], total: {...}, ...}}
			if (res && res.status === 'failed') {
				// reject 整个 res 对象，包含 errors
				console.log('[getShoppingCheckout] 接口返回失败，reject');
				reject(res);
			} else if (res && res.status === 'success' && res.data) {
				// 成功时，提取 data 部分传给 mutation，因为组件期望 checkoutInfo 直接包含 goods_list、total 等字段
				console.log('[getShoppingCheckout] 接口返回成功，resolve data');
				reslove(res.data);
			} else {
				// 兼容其他情况（如果接口返回的数据结构不同）
				console.log('[getShoppingCheckout] 接口返回其他情况，resolve res');
				reslove(res);
			}
		}).catch(error => {
			console.log('[getShoppingCheckout] 接口请求异常，reject error:', error);
			// 捕获请求错误（网络错误等）
			reject(error);
		})
	})
}

/* 结算页面提交 */
function getCheckoutSubmit(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/trade/done',o).then(res=>{
			if(res.status == 'success'){
				if(res.data.error == 1){
					reslove(res)
				}else{
					uni.showToast({
						title:'提交成功',
						icon:'success'
					})
					reslove(res)
				}
			}else{
				uni.showToast({
					title: res.errors.message || '提交失败',
					icon:'none'
				})
			}
		})
	})
}

/* 在线支付 支付方式列表 */
function getDoneInfo(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/trade/paycheck',o).then(res=>{
			reslove(res.data)
		})
	})
}

/* 余额支付 */
function getDoneInfoBalance(o){

}

/* 支付方式列表 */
function getPayList(o){

}

/* 在线支付 支付方式选择 */
function getPayTab(o){

}

export default{
	getAddCart,
	getAddCartV1,
	goPuHuo,
	getAddPackageCart,
	getCartList,
	getCartMoreGoods,
	getCartPrice,
	getCartGoodsDelete,
	getCartInvalidGoodsDelete,
	getCartNewGoodsList,
	getCartBatchDelete,
	getCartDefault,
	getCartChecked,
	getUpdateNumber,
	getGiftList,
	getGiftChecked,
	getFavourable,
	getChangefav,
	getCoupons,
	getCoudanGoodsList,
	getCoudan,
	getGoodsGuess,
	getStoresCart,
	getShipping,
	getShippingFee,
	getShoppingCheckout,
	getCheckoutSubmit,
	getDoneInfo,
	getDoneInfoBalance,
	getPayList,
	getPayTab,
	verifyCartRecIds
}
