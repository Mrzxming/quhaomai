<template>
	<view class="user-default">
		<view class="container">

			<view class="nav_bar">
				<!-- #ifdef APP-PLUS -->
				<view class="status_bar"></view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="goodsCartList.length == 0" style="height: 70rpx;"></view>
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- #endif -->
			</view>

	<x-skeleton :configs="configs" :loading="loading3">
			<view v-if="goodsCartList.length > 0 || loading3">
				<!-- 顶部标题栏 -->
				<view class="header-address" :style="{ height: gaodu + 'px' }">
					<view class="header-address-box">
						<view style="font-weight: bold;font-size: 32rpx;color: #272727;min-width: 130rpx;">
							{{$t('lang.purchase_cart')}}
						</view>
						<view class="h-edit uni-red clear-out">
							<view v-if="!batchEdit" @click="onEdit">{{$t('lang.edit')}}</view>
							<view v-else style="display: flex;flex-direction: row;">
								<view style="margin-right: 20rpx;" @click="onDelete">清空</view>
								<view @click="onEdit">{{$t('lang.accomplish')}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 收货地址卡片（新版样式） -->
				<view class="address-section" @click="showPopup('address')">
				<!-- 	<view class="address-header">
						<view class="iconfont icon-location location-icon"></view>
						<text class="address-title">{{$t('lang.address')}}</text>
					</view> -->
					<view class="address-content">
						<view class="iconfont icon-location location-icon" style="margin-right: 20rpx;
    font-size: 36rpx;
    color: #ff4d4f;"></view>
						<view>
							<view class="address-info" v-if="displayAddressObj">
								<text class="receiver-name">{{ displayAddressObj.name || displayAddressObj.consignee || '' }}</text>
								<text class="receiver-phone">{{ maskPhone(displayAddressObj.mobile || displayAddressObj.tel || '') }}</text>
							</view>
							<view class="address-detail">{{ displayAddressObj ? displayAddressFullAddress : regionSplic }}</view>
						</view>

					</view>
					<uni-icons class="arrow-icon" type="arrowright" size="16" color="#999"></uni-icons>
				</view>
				<view class="card-goods">
					<view class="card-goods-group" v-for="(storeList,listIndex) in goodsCartList" :key="listIndex">
						<view class="card-shop-head">
							<view class="head-left">
								<view class="checkbox"
									:class="{'checked':checkedShop[listIndex],'checkbox-disabled':shopInvalidArr[listIndex]}"
									@click="checkShop(checkedShop[listIndex],storeList,listIndex,shopInvalidArr[listIndex],storeList.store_name)">
									<view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="16" color="#ffffff"
											v-if="!shopInvalidArr[listIndex]"></uni-icons>
									</view>
								</view>
								<image class="shop-acquiescel"
									src="https://images.eqingqu.com/attachs/photo/202505/20250526_D503EE75648370BF9D269B47EC228110.png">
								</image>
								<view class="checkbox-con"
									@click="$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + storeList.store_id,'app')"
									v-if="storeList.store_id > 0">
									<text class="goods-name-text">{{ storeList.store_name }}</text>
									<text
										style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;margin-left: 10rpx;"
										v-if="storeList.shop_grade==13">{{ storeList.shop_grade_name || '' }}</text>
									<uni-icons type="arrowright" size="16" color="#333333"></uni-icons>
								</view>
								<view class="checkbox-con" v-else>
									<text class="goods-name-text">{{ storeList.store_name }}</text>
									<text class="goods-tag" style=""
										v-if="storeList.shop_grade==13">{{ storeList.shop_grade_name || '' }}</text>
								</view>
							</view>
							<view class="head-right store-text-btn-wrap" v-if="getStoreHeaderBtnText(storeList)">
								<view class="store-text-btn" @click.stop="handleCoupon(storeList.store_id)">
									{{ getStoreHeaderBtnText(storeList) }}
								</view>
							</view>
						</view>
						<!-- 凑单行：左侧横向滚动优惠券/满减标签，右侧再选X立省Y+去凑单 -->
						<view class="store-promotion" v-if="getStorePromotionTags(storeList, listIndex).length > 0 || (storeHasCheckedGoods(storeList) && getNextManjianTier(storeList, listIndex))">
							<scroll-view v-if="getStorePromotionTags(storeList, listIndex).length > 0" scroll-x="true" class="promotion-scroll" :show-scrollbar="false">
								<view class="promotion-scroll-inner">
									<text class="tag tag-manjian" v-for="(tag, ti) in getStorePromotionTags(storeList, listIndex)" :key="ti"
										:class="tag.type === 'coupon' ? 'tag-coupon' : 'tag-manjian'">{{ tag.text }}</text>
								</view>
							</scroll-view>
							<view class="promotion-right" :class="{'promotion-right--flush': getStorePromotionTags(storeList, listIndex).length === 0}" v-if="getNextManjianTier(storeList, listIndex) && storeHasCheckedGoods(storeList)">
								<view class="promotion-progress promotion-text-clickable" @click.stop="openManjianPopup(storeList, listIndex)">
									<view class="promotion-gift-icon"></view>
									<text class="promotion-text">再选<text class="highlight">{{ getNextManjianTier(storeList, listIndex).needAmount }}</text>元，立省<text class="highlight">{{ getNextManjianTier(storeList, listIndex).saveAmount }}</text>元</text>
								</view>
								<text class="gather-link" @click.stop="openCoudanPopup(storeList, listIndex)" v-if="shouldShowGatherLink(storeList)">{{$t('lang.gather_together')}}</text>
							</view>
						</view>
						<view class="card-shop-box">
							<view class="card-act-goods" v-for="(actItem,actIndex) in storeList.new_list"
								:key="actIndex">
								<!-- 满减/折扣活动行已移至店铺级 store-promotion，此处仅保留商品列表 -->
								<block v-for="(item,index) in actItem.act_goods_list" :key="index">
									<block v-if="isStoreMainGoodsRowVisible(storeList, listIndex, actIndex, index)">
								
									<uni-swipe-action>
										<uni-swipe-action-item :right-options="options"
											@click="deleteCartGoods(item.rec_id)">
											<view class="scroll-view-item scroll-view-item-left" :id="'cart-item-' + item.rec_id" :class="{'goods-item-invalid': item.is_invalid == 1 || item.product_number == 0}">
												<view class="uni-flex">
													<view class="checkbox"
														:class="{'checked':(item.is_invalid != 1 && Number(item.product_number || 0) > 0 && checkedGoods[listIndex].includes(item.rec_id)),'checkbox-disabled':item.is_invalid == 1 || Number(item.product_number || 0) <= 0 }"
														@click="checkGoods(item.rec_id,listIndex,item.is_invalid,item.product_number,(item.is_invalid != 1 && Number(item.product_number || 0) > 0 && checkedGoods[listIndex].includes(item.rec_id)),item.store_name,actIndex,index,item.act_id,item.goods_number,item.goods_price,item)">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16" color="#ffffff"
																v-if="item.is_invalid != 1 && item.product_number > 0"></uni-icons>
														</view>
													</view>
													<view class="checkbox-con cart-goods-row" style="flex: 1 1 0%;">
														<!-- 左侧：仅商品图 -->
														<view class="goods-img-wrap">
															<view class="goods-img">
																<navigator
																	:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																	hover-class="none">
																	<image :src="item.goods_thumb"
																		v-if="item.goods_thumb" class="image"></image>
																</navigator>
																<block
																	v-if="item.is_invalid != 1 && Number(item.product_number || 0) <= 0">
																	<view class="mask"></view>
																	<view class="mash-text">暂无库存
																	</view>
																</block>
																<block v-if="item.is_invalid == 1">
																	<view class="mask"></view>
																	<view class="mash-text"
																		@click="clearInvalidProduct(goodsCartList)">
																		{{$t('lang.lost_effectiveness')}}
																	</view>
																</block>
																<block
																	v-if="item.xiangou_error > 0 && !(item.is_invalid == 0 && item.product_number == 0)">
																	<view class="mask"></view>
																	<view class="mash-text">
																		{{$t('lang.man_gb_limited')}}
																	</view>
																</block>
																<view class="goods-label-suspension"
																	v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
																	<image
																		:src="item.goods_label_suspension.formated_label_image"
																		class="img"></image>
																</view>
															</view>
														</view>
														<!-- 右侧：标题、规格、标签行、价格+数量 -->
														<view class="cart-goods-content cart-goods-content1">
															<navigator
																:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																hover-class="none">
																<view class="goods-title twolist-hidden">
																	<image class="country_icon" :src="item.country_icon"
																		:lazy-load="true" v-if="item.country_icon"></image>
																	{{ item.goods_name }}
																</view>
															</navigator>
															<view class="goods-attr twolist-hidden" v-if="item.goods_attr">{{ (item.goods_attr + '').indexOf('规格') === 0 ? item.goods_attr : '规格:' + item.goods_attr }}</view>
															<!-- 标签行：横向滚动，字段 product_tags -->
															<block v-for="(tags, tagWrapIndex) in [getProductTags(item)]" :key="'tags_' + (item.rec_id || item.goods_id || index) + '_' + tagWrapIndex">
																<scroll-view scroll-x="true" class="activity-tags-scroll" :show-scrollbar="false" v-if="tags.length > 0">
																	<view class="activity-tags-inner">
																		<text class="product-tag tag-manjian" v-for="(t, ti) in tags" :key="ti"
																			:class="t.type === 'coupon' ? 'tag-coupon' : t.type === 'vip' ? 'tag-vip' : t.type === 'points' ? 'tag-points' : t.type === 'return' ? 'tag-return' : t.type === 'limit' ? 'tag-limit' : 'tag-manjian'">{{ t.text }}</text>
																	</view>
																</scroll-view>
															</block>
															<view class="goods-info">
																<view class="order-price-box">
																	<view class="order-price-main">
																		<text class="price-label"
																			v-if="hasCouponAfterPrice(item)">券后</text>
																		<text class="price">{{ hasCouponAfterPrice(item) ? getCouponAfterPriceFormat(item) : item.goods_price_format }}</text>
																		<text class="order-original-price"
																			v-if="hasGoodsOriginalPrice(item)">{{ getGoodsOriginalPriceFormat(item) }}</text>
																	</view>
																	<text class="order-preferential-amount"
																		v-if="hasPreferentialAmount(item)">
																		已优惠¥{{ getPreferentialAmountFormat(item) }}
																	</text>
																</view>
																<view class="oper">
																	<uni-number-box :value="item.goods_number"
																		:min="item.is_minimum > 0 ? item.minimum : 1"
																		:max="(item.xiangou_num > 0 && item.xiangou_end_date > item.current_time) ? item.xiangou_num  : item.product_number"
																		@change="goodsNumberhandle($event,item.rec_id,item.act_id,storeList.store_id,listIndex,actIndex,index,item.goods_price)"
																		:disabled="item.is_invalid == 1 || (stepDisabled.length > 0 ? stepDisabled[listIndex][index].type : false)">
																	</uni-number-box>
																</view>
															</view>
															<view class="goods-other" style="max-width: 420rpx;"
																v-if="actItem.act_type != null"
																@click="onFavourableList(item.goods_id,item.ru_id,item.act_id,item.rec_id)">
																<view class="em-icon"
																	:class="{'active-zeng':actItem.act_type == 0,'active-zhekou':actItem.act_type == 2}">
																	{{ actItem.act_type_txt || '' }}
																</view>
																<view class="act-name uni-ellipsis">
																	{{ actItem.act_name }}
																</view>
																<uni-icons type="arrowdown" size="18"
																	color="#999999"></uni-icons>
															</view>
															<view class="goods-other" v-if="item.is_kj == 1">
																<view v-if="item.rate_price > 0"
																	style="font-size: 24rpx; color:#B78D5A;">
																	{{$t('lang.import_tax')}}：{{item.format_rate_price}}
																</view>
																<view v-else
																	style="font-size: 24rpx; color:#B78D5A;">
																	{{$t('lang.import_tax')}}：{{$t('lang.goods_tax_included')}}
																</view>
															</view>
															<view class="goods-store" v-if="item.store_count > 0">
																{{$t('lang.support')}}<text
																	class="uni-red">{{$t('lang.private_store')}}</text>{{$t('lang.service')}}
															</view>
														</view>
													</view>
												</view>
											</view>
										</uni-swipe-action-item>
									</uni-swipe-action>
									<!-- 商品级赠品提示：占据整行宽度 -->
									<block v-for="giftInfo in [getItemGiftInfo(item, storeList)]" :key="'gift_tip_' + (item.rec_id || index)">
										<view class="goods-gift-tip-row" v-if="giftInfo">
											<view class="gift-tip-icon">
												<image class="gift-tip-svg-img" :src="cartGiftTipIconSrc" mode="aspectFit" />
											</view>
											<view class="gift-tip-text">
												购满{{ giftInfo.minAmount }}元可领赠品
											</view>
											<view v-if="giftInfo.total > 1" @click.stop="switchItemGiftAct(item, storeList)"
												style="display:flex;align-items:center;">
												<uni-icons type="arrowdown" size="14" color="#999999"></uni-icons>
											</view>
											<view class="gift-tip-btn" @click.stop="receiveGiftByItem(item, storeList)">
												查看赠品
											</view>
										</view>
									</block>
									<view class="cart-goods-item" v-for="(partsItem,partsIndex) in item.parts"
										:key="partsIndex">
										<scroll-view scroll-x scroll-y scroll-anchoring class="scroll-view-G"
											:scroll-left="scrollLeft">
											<view class="scroll-view-item scroll-view-item-left">
												<view class="uni-flex">
													<view class="checkbox" style="opacity: 0;">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16"
																color="#ffffff"></uni-icons>
														</view>
													</view>
													<view class="checkbox-con" style="flex: 1 1 0%;">
														<view class="cart-goods-info" style="background-color: #fff9f8;"
															@click="productLink(partsItem)">
															<view class="goods-img">
																<image :src="partsItem.goods_thumb"
																	v-if="partsItem.goods_thumb" class="image"></image>
																<block
																	v-if="partsItem.is_invalid != 1 && Number(partsItem.product_number || 0) <= 0">
																	<view class="mask"></view>
																	<view class="mash-text">暂无库存
																	</view>
																</block>
																<block v-if="partsItem.is_invalid == 1">
																	<view class="mask"></view>
																	<view class="mash-text"
																		@click="clearInvalidProduct(goodsCartList)">
																		{{$t('lang.lost_effectiveness')}}
																	</view>
																</block>
																<block v-if="partsItem.xiangou_error > 0">
																	<view class="mask"></view>
																	<view class="mash-text">
																		{{$t('lang.man_gb_limited')}}
																	</view>
																</block>
																<view class="activity-tag"
																	v-if="partsItem.extension_code == 'package_buy'">
																	<image
																		src="https://images.eqingqu.com/attachs/photo/202404/20240416_E12CEF0FC96ECD3C0807575198367AD8.png"
																		class="img" mode="widthFix"></image>
																</view>
																<view class="activity-tag parts-tag"
																	v-if="partsItem.group_id && partsItem.parent_id != 0">
																	<image
																		src="https://images.eqingqu.com/attachs/photo/202404/20240416_E365D05180E0B99317BD2B8A25E11F48.png"
																		class="img" mode="widthFix"></image>
																</view>
															</view>
															<view class="cart-goods-content">
																<view class="goods-title twolist-hidden">
																	{{ partsItem.goods_name }}
																</view>
																<view class="goods-attr twolist-hidden"
																	v-if="partsItem.goods_attr">
																	{{ partsItem.goods_attr }}
																</view>
																<view class="goods-info">
																	<view class="price">
																		{{ partsItem.goods_price_format }}
																	</view>
																	<view class="oper">
																		<view class="uni-number-min"
																			style="width: 220rpx; text-align: center;">
																			{{ partsItem.goods_number }}
																		</view>
																	</view>
																</view>
															</view>
														</view>
													</view>
												</view>
											</view>
											<view class="scroll-view-item scroll-view-item-right"
												@click="deleteCartGoods(partsItem.rec_id)">
												<view>{{$t('lang.delete')}}</view>
											</view>
										</scroll-view>
									</view>
									</block>
								</block>
								<view class="cart-goods-item cart-goods-item-outer"
									v-for="(item,index) in actItem.act_cart_gift" :key="index">
									<view class="checkbox-con">
										<view class="cart-goods-info">
											<view class="goods-img">
												<image :src="item.goods_thumb" v-if="item.goods_thumb" class="image">
												</image>
												<image
													src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
													class="icon"></image>
											</view>
											<view class="cart-goods-content">
												<view class="goods-title twolist-hidden">{{ item.goods_name }}</view>
												<view class="goods-attr" v-if="item.goods_attr">{{ item.goods_attr }}
												</view>
												<view class="goods-info">
													<view class="price">{{ item.goods_price_format }}</view>
													<view class="oper">
														<view class="stepper stepper_sum">x{{ item.goods_number }}
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 店铺维度：有明细时左右布局；无明细时展开/收起居中 -->
						<view class="store-cart-footer" v-if="hasStoreDiscountDetail(storeList)">
							<view class="store-cart-footer-left">
								<view v-if="getStoreMainGoodsCount(storeList) > 10" class="expand-products-btn-cart" @click.stop="toggleStoreCartExpand(listIndex, storeList)">
									<text>{{ isStoreCartExpanded(listIndex, storeList) ? '收起商品' : '查看更多' }}</text>
									<uni-icons :type="isStoreCartExpanded(listIndex, storeList) ? 'arrowup' : 'arrowdown'" size="14" color="#ff4d4f"></uni-icons>
								</view>
								<view v-else-if="storeList.ishas_more_goods === true" class="expand-products-btn-cart" @click="loadMoreGoods(listIndex, storeList, { autoExpand: true })" :class="{'loading': loadingMoreGoods[listIndex]}">
									<text v-if="!loadingMoreGoods[listIndex]">查看更多</text>
									<text v-else>加载中...</text>
									<uni-icons v-if="!loadingMoreGoods[listIndex]" type="arrowdown" size="14" color="#ff4d4f"></uni-icons>
									<uni-icons v-else type="spinner-cycle" size="14" color="#ff4d4f"></uni-icons>
								</view>
							</view>
							<view class="store-cart-footer-right">
								<text class="store-discount-label">优惠合计</text>
								<text class="store-discount-amount">¥{{ getStoreDiscountTotalTest(storeList) }}</text>
								<text class="store-discount-detail-link" @click.stop="openStoreDiscountDetail(storeList, listIndex)">明细</text>
							</view>
						</view>
						<view class="store-expand-center" v-else-if="getStoreMainGoodsCount(storeList) > 10">
							<view class="expand-products-btn-cart" @click.stop="toggleStoreCartExpand(listIndex, storeList)">
								<text>{{ isStoreCartExpanded(listIndex, storeList) ? '收起商品' : '查看更多' }}</text>
								<uni-icons :type="isStoreCartExpanded(listIndex, storeList) ? 'arrowup' : 'arrowdown'" size="14" color="#ff4d4f"></uni-icons>
							</view>
						</view>
						<view class="load-more-goods" v-if="storeList.ishas_more_goods === true && !hasStoreDiscountDetail(storeList) && getStoreMainGoodsCount(storeList) <= 10">
							<view class="load-more-btn" @click="loadMoreGoods(listIndex, storeList, { autoExpand: true })" 
								:class="{'loading': loadingMoreGoods[listIndex]}">
								<text v-if="!loadingMoreGoods[listIndex]">查看更多</text>
								<text v-else>加载中...</text>
								<uni-icons v-if="!loadingMoreGoods[listIndex]" type="arrowdown" size="16" color="#f92028"></uni-icons>
								<uni-icons v-else type="spinner-cycle" size="16" color="#f92028"></uni-icons>
							</view>
						</view>
						<view class="shop-store-cart" v-if="shopStore.length > 0 && shopStore[listIndex][0]">
							<view class="store-btn" @click="shopStoreCart(listIndex)">
								<icon class="iconfont icon-store-alt"></icon>{{$t('lang.private_store')}}
							</view>
						</view>
					</view>
				</view>


				<view v-if="!regionShow" class="cart-submit" :style="platformStyle">

					<view style="display: flex;flex-direction: row;align-items: center;">
						<!-- 左侧区域：竖向两排 -->
						<view class="submit-bar-text">
							<!-- 第一排：全选 + 合计 -->
							<view class="submit-bar-row-top">
								<view class="checkall">
									<view class="checkbox"
										:class="{'checked':checkedAll,'checkbox-disabled':checkedAllDisabled}"
										@click="checkAll(checkedAllDisabled)">
										<view class="checkbox-icon">
											<uni-icons type="checkmarkempty" size="16" color="#ffffff"
												v-if="!checkedAllDisabled"></uni-icons>
										</view>
										<label style="min-width: 60rpx;">{{$t('lang.checkd_all')}}</label>
									</view>
								</view>
								<view class="price-wrapper-new">
									<text class="label-text-new">合计:</text>
									<view class="submit-bar-price-new" v-if="totalPriceTiping">{{totalPriceTip}}</view>
									<view class="submit-bar-price-new" v-else>计算中</view>
								</view>
							</view>

							<!-- 第二排：数量 + 优惠 + 明细 -->
							<view class="submit-bar-row-bottom">
								<view class="bottom-left-new">
									<text v-if="nums>0&&count>0" class="quantity-text-new">{{nums}}种{{count}}件</text>
									<text v-if="nums>0&&count>0" class="discount-text-new">
										<text v-if="totalPriceTiping">已优惠¥{{ formatAmount(totalDiscount) }}</text>
										<text v-if="!totalPriceTiping">计算中</text>
									</text>
									<text v-else>{{$t('lang.already_save_one')}}</text>
								</view>
								<text class="detail-btn-new" @click="showPopup('priceDetail')" v-if="nums>0&&count>0">{{$t('lang.detailed')}}</text>
							</view>
						</view>

						<!-- 右侧结算按钮 -->
						<view class="btn-bar">
							<block v-if="!batchEdit">
								<button class="btnSub" :class="[disabled ? 'btn-disabled' : 'btn-red']"
									:disabled="disabled" @click="onSubmit">
									<view class="checkout-btn-inner" v-if="showCheckoutBtnLoading">
										<view class="checkout-btn-spinner"></view>
										<text>加载中</text>
									</view>
									<text v-else>{{ submitBarText }}</text>
								</button>
							</block>
							<button class="btn" :class="[length > 0 ? 'btn-red' : 'btn-disabled']"
								:disabled="!length > 0" @click="onBatchDelete"
								v-else>{{$t('lang.batch_delete')}}</button>
						</view>
					</view>
				</view>
			</view>
			
			
			
			<view class="flow-no-cart" v-else-if="!loading3 && goodsCartList.length === 0">
				<view v-if="dataLoading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100rpx 0;">
					<uni-load-more-new status="loading" :type="false" color="#F20E28" iconType="circle"></uni-load-more-new>
					<text style="margin-top: 20rpx; color: #666; font-size: 28rpx;">加载中请稍后</text>
				</view>
				<template v-else>
					<view class="gwc-bg">
						<view class="iconfont icon-cart"></view>
					</view>
					<text>{{$t('lang.shopping_cart_notice')}}</text>
					<view class="card-btn">
						<navigator url="/pages/middles/middles" open-type="switchTab" hover-class="none"><button
								type="default" plain="true">{{$t('lang.go_around')}}</button></navigator>
						<button type="default" plain="true"
							@click="$outerHref('../../pagesB/collectionGoods/collectionGoods',$isLogin())">{{$t('lang.view_follow')}}</button>
					</view>
				</template>
			</view>
			</x-skeleton>

			<view class="goods-detail-guess" v-if="goodsGuessList">
				<view class="title"><text>{{$t('lang.guess_love')}}</text></view>
				<view class="product-list-lie">
					<view class="product-new">
						<view class="goods-list" v-if="goodsGuessList">

							<view class="product-list-lie">
								<dsc-product-list :list="goodsGuessList" :showone="true"
									:productOuter="true"></dsc-product-list>
							</view>
						</view>
						<uni-load-more :status="loadMoreStatus" :content-text="contentText"
							v-if="page > 1 && showLoadMore" />
						<view style="height: 100rpx;"></view>
					</view>
				</view>
			</view>

			<uni-popup ref="gift" :show="giftShow" type="bottom" v-on:hidePopup="handelClose('gift')">
				<view class="activity-popup">
					<view class="title">
						<view class="txt">
							{{$t('lang.acquire')}}{{ giftList && giftList.length ? giftList.length : act_type_ext }}{{$t('lang.goods_letter')}}
						</view>
						<uni-icons type="closeempty" size="24" color="#999999" @click="handelClose('gift')"></uni-icons>
					</view>
					<view class="content">
						<scroll-view scroll-y style="height:250px;">
							<view class="cart-goods-item" v-for="(item,index) in giftList" :key="item.id || index">
								<view class="checkbox checked gift-checkbox-disabled">
									<!-- <view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
									</view> -->
								</view>
								<view class="checkbox-con">
									<view class="cart-goods-info">
										<view class="goods-img">
											<image :src="item.thumb" v-if="item.thumb" class="image"></image>
											<image v-else src="https://images.eqingqu.com/attachs/photo/202409/20240928_5E6119D10B21F636A3FD12134EBF6233.png" class="image"></image>
										</view>
										<view class="cart-goods-content">
											<view class="goods-title twolist-hidden">{{ item.name || item.goods_name || '赠品' }}</view>
											<view class="goods-info">
												<view class="price">{{ item.price_formated || item.shop_price_formated || '0.00' }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="gift-popup-footer">
						<!-- <button type="default" size="mini" @click="handelClose('gift')">确定</button> -->
					</view>
				</view>
			</uni-popup>

			<uni-popup :show="favourableShow" type="bottom" v-on:hidePopup="handelClose('favourable')">
				<view class="activity-popup">
					<view class="title">
						<view class="txt">{{$t('lang.optional_promotions')}}</view>
						<uni-icons type="closeempty" size="36" color="#999999"
							@click="handelClose('favourable')"></uni-icons>
					</view>
					<view class="content">
						<scroll-view scroll-y style="height:200px;">
							<view class="cart-goods-item" v-for="(item,index) in favourableList" :key="index">
								<view class="checkbox" :class="{'checked':item.is_checked}"
									@click="onFavourableTab(item.act_id,item.rec_id)">
									<view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
									</view>
								</view>
								<view class="act-item-right" @click="onFavourableTab(item.act_id,item.rec_id)">
									<view class="em-icon active-zhekou" v-if="item.act_type == 0">
										{{$t('lang.with_a_gift')}}
									</view>
									<view class="em-icon active-jian" v-else-if="item.act_type == 1">
										{{$t('lang.full_reduction')}}
									</view>
									<view class="em-icon active-zhekou" v-else-if="item.act_type == 2">
										{{$t('lang.discount')}}
									</view>
									<view class="act-name uni-ellipsis">{{ item.act_name }}</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-popup>

			<uni-popup :show="couponShow" type="bottom" v-on:hidePopup="handelClose('coupon')">
				<view class="coupon-popup-wrap" :style="couponPopupPanelStyle">
					<view class="coupon-popup-title">
						<text class="coupon-popup-txt">{{ couponPopupStore ? couponPopupStore.store_name : '' }} - 店铺优惠</text>
						<uni-icons type="closeempty" size="24" color="#999999" @click="handelClose('coupon')"></uni-icons>
					</view>
					<scroll-view scroll-y class="coupon-popup-scroll" :style="couponPopupScrollStyle">
						<view class="coupon-popup-measure">
						<!-- 优惠活动：100% 对齐 pages/news/checkout.html + styles.css -->
						<!-- 1) 满减 / 满赠 -->
						<view class="popup-discount-section" v-for="(section, sidx) in couponPopupFrontActivitySections" :key="'actSecFront'+sidx">
							<view class="popup-discount-section-title">{{ section.title }}</view>
							<view class="popup-discount-item" v-for="(act, ai) in section.items" :key="section.key + ai">
								<view class="popup-discount-icon" :class="section.key === 'limited_discount' ? 'popup-discount-icon--time' : 'popup-discount-icon--gift'"></view>
								<view class="popup-discount-info">
									<view class="popup-discount-title">{{ act.rule_text || act.title || '' }}</view>
									<view class="popup-discount-desc">{{ act.sub_title || '' }}</view>
								</view>
							</view>
						</view>

						<!-- 2) 优惠券（统一使用领券样式） -->
						<view class="coupon-section" v-if="couponPopupList.length > 0">
							<view class="coupon-section-title">优惠券</view>
							<view class="coupons_list">
								<view class="coupons_item" v-for="(item,index) in couponPopupList" :key="index"
									:class="{'g-gay': isCouponReceived(item)}">
									<view class="coupons_left">
										<!-- 第一行：金额 + 满X可用 并排 -->
										<view class="coupons_left_top">
											<view class="coupon_price" v-if="getCouponType(item) == 5">包邮券</view>
											<view v-else>
												<currency-price :price="getCouponMoney(item)" :size="20"></currency-price>
											</view>
											<view class="coupon_condition_inline">
												<text>满{{getCouponMinAmount(item)}}可用</text>
											</view>
										</view>
										<!-- 第二行：券名 -->
										<view class="coupons_goods_name">
											<view class="coupon_tag2" v-if="getCouponMiddleTitleText(item)">
												{{ getCouponMiddleTitleText(item) }}
											</view>
										</view>
										<!-- 第三行：有效期 -->
										<view class="coupons_limited_period">
											<text>{{getCouponTimeText(item)}}</text>
										</view>
									</view>
									<view class="coupons_right" :class="{'coupons_right_unreceived': canCouponReceive(item) && !isCouponReceived(item)}">
										<view class="get_coupon_time">
											<button class="u-reset-button coupon_btn u-reset-disabled"
												v-if="isCouponReceived(item)">
													已领取
											</button>
											<button class="u-reset-button coupon_btn u-reset-disabled"
												v-else-if="!canCouponReceive(item)">{{$t('lang.take_up')}}</button>
											<button class="u-reset-button coupon_btn" :class="{'coupon_btn_unreceived': canCouponReceive(item) && !isCouponReceived(item)}" v-else
												@click="handelReceive(getCouponId(item), item.ru_id || couponPopupRuId)">
												{{$t('lang.immediately')}}<br>{{$t('lang.receive')}}
											</button>
										</view>
									</view>
								</view>
							</view>
						</view>

						<!-- 3) 其余活动（按数据排列） -->
						<view class="popup-discount-section" v-for="(section, sidx) in couponPopupBackActivitySections" :key="'actSecBack'+sidx">
							<view class="popup-discount-section-title">{{ section.title }}</view>
							<view class="popup-discount-item" v-for="(act, ai) in section.items" :key="section.key + ai">
								<view class="popup-discount-icon" :class="section.key === 'limited_discount' ? 'popup-discount-icon--time' : 'popup-discount-icon--gift'"></view>
								<view class="popup-discount-info">
									<view class="popup-discount-title">{{ act.rule_text || act.title || '' }}</view>
									<view class="popup-discount-desc">{{ act.sub_title || '' }}</view>
								</view>
							</view>
						</view>

						<!-- 黑卡会员 -->
						<view class="popup-discount-section" v-if="couponPopupBlackCardSection.items.length > 0">
							<view class="popup-discount-section-title">{{ couponPopupBlackCardSection.title }}</view>
							<view class="popup-discount-item" v-for="(act, bi) in couponPopupBlackCardSection.items" :key="'blackCard' + bi">
								<view class="popup-discount-icon popup-discount-icon--vip"></view>
								<view class="popup-discount-info">
									<view class="popup-discount-title">{{ act.title || '' }}</view>
									<view class="popup-discount-desc">{{ act.sub_title || '' }}</view>
								</view>
							</view>
						</view>
						<view class="coupon-empty-tip" v-if="couponPopupActivitySections.length === 0 && couponPopupList.length === 0 && couponPopupBlackCardSection.items.length === 0">
							暂无优惠
						</view>
						</view>
					</scroll-view>
				</view>
			</uni-popup>

			<!-- 满减信息弹窗（对齐 checkout.js showPromotionDetailModal + styles.css） -->
			<uni-popup :show="manjianPopupShow" type="bottom" v-on:hidePopup="handelClose('manjian')">
				<view class="manjian-popup-wrap">
					<view class="manjian-modal-header">
						<text class="manjian-modal-title">凑单优惠 - {{ manjianPopupStore ? manjianPopupStore.store_name : '' }}</text>
						<view class="manjian-modal-close-wrap" @click="closeManjianPopup">
							<uni-icons type="closeempty" size="24" color="#999999"></uni-icons>
						</view>
					</view>
					<scroll-view scroll-y class="manjian-modal-scroll" :style="{height: couponPopupScrollH + 'px'}">
						<view class="modal-content-scroll manjian-modal-content" v-if="manjianPopupData">
							<view class="gather-tip-box manjian-gather-tip">
								<text class="manjian-tip-line">再选<text class="manjian-highlight">{{ manjianPopupData.needAmount }}</text>元，立省<text class="manjian-highlight">{{ manjianPopupData.saveAmount }}</text>元</text>
							</view>
							<view class="promotion-detail-section">
								<text class="promotion-detail-h">当前满减进度</text>
								<view class="promotion-detail-item">
									<text class="promotion-detail-label">已选商品金额</text>
									<text class="promotion-detail-value promotion-detail-value--dark">¥{{ manjianPopupData.currentTotal }}</text>
								</view>
								<view class="promotion-detail-item">
									<text class="promotion-detail-label">还差</text>
									<text class="promotion-detail-value">¥{{ manjianPopupData.shortBy }}</text>
								</view>
							</view>
							<view class="promotion-detail-section">
								<text class="promotion-detail-h">满减规则</text>
								<view class="promotion-detail-item" v-for="(r, ri) in manjianPopupData.rules" :key="ri">
									<text class="promotion-detail-label">满{{ r.threshold }}减{{ r.discount }}</text>
									<text v-if="r.status === 'satisfied'" class="promotion-detail-value promotion-detail-value--green">已满足</text>
									<view v-else-if="r.status === 'short_by'" class="promotion-detail-right-group">
										<text class="promotion-detail-value">差¥{{ r.shortBy }}</text>
										<text class="mini-btn" @click.stop="fromManjianOpenGather">去凑单</text>
									</view>
									<view v-else class="promotion-detail-right-group">
										<text class="promotion-detail-value promotion-detail-value--muted">未满足</text>
										<text class="mini-btn" @click.stop="fromManjianOpenGather">去凑单</text>
									</view>
								</view>
							</view>
							<view class="promotion-detail-section" v-if="manjianPopupData.coupons && manjianPopupData.coupons.length > 0">
								<text class="promotion-detail-h" >可用优惠券</text>
								<view class="promotion-detail-item promotion-detail-item--coupon" v-for="(c, ci) in manjianPopupData.coupons" :key="ci">
									<view class="promotion-detail-label promotion-detail-label-row">
										<view class="manjian-coupon-ticket">
											<text class="manjian-coupon-ticket-yen">¥</text>
										</view>
										<view class="manjian-coupon-text-col">
											<text class="manjian-coupon-name">{{ c.title }}</text>
											<text class="manjian-coupon-scope" v-if="c.scope">{{ c.scope }}</text>
										</view>
									</view>
									<text class="mini-btn" @click.stop="onManjianCouponClaim(c)">领取</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</uni-popup>

			<!-- 店铺优惠明细（checkout.js showStoreDiscountDetail） -->
			<uni-popup :show="storeDiscountDetailShow" type="bottom" v-on:hidePopup="handelClose('storeDiscount')">
			<view class="store-discount-popup-wrap">
				<!-- 统一弹窗标题样式：与优惠领券弹窗一致 -->
				<view class="coupon-popup-title">
					<text class="coupon-popup-txt">{{ storeDiscountDetailStore ? storeDiscountDetailStore.store_name : '' }} - 优惠明细</text>
					<uni-icons type="closeempty" size="24" color="#999999" @click="closeStoreDiscountDetail"></uni-icons>
				</view>
					<scroll-view scroll-y class="store-discount-popup-body" :style="{height: storeDiscountPopupScrollH + 'px'}">
						<view class="discount-detail-section-inner">
							<view class="discount-detail-item-cart" v-for="(row, ri) in storeDiscountDetailList" :key="ri">
								<view class="detail-label-cart">
									<view class="detail-icon-cart" :class="'detail-icon-cart--' + getDiscountIconType(row.type)">
										<text v-if="row.type === 'coupon'" class="detail-icon-cart-txt">券</text>
										<text v-else-if="row.type === 'limited_time_discount'" class="detail-icon-cart-txt">时</text>
										<text v-else class="detail-icon-cart-txt">礼</text>
									</view>
									<text class="detail-label-cart-txt">{{ row.label }}</text>
								</view>
								<text class="detail-value-cart">{{ row.amount }}</text>
							</view>
							<view class="discount-detail-item-cart discount-detail-item-cart-total">
								<text class="detail-label-cart-txt detail-label-cart-bold">合计优惠</text>
								<text class="detail-value-cart detail-value-cart-highlight">-¥{{ storeDiscountDetailTotal }}</text>
							</view>
						</view>
					</scroll-view>
					<view class="discount-detail-note-cart">
						<text class="discount-detail-note-line">· 优惠金额已在商品价格中体现</text>
						<text class="discount-detail-note-line">· 满减活动与优惠券可叠加使用</text>
						<text class="discount-detail-note-line">· 部分商品不参与满减活动</text>
					</view>
				</view>
			</uni-popup>

			<!-- 去凑单弹窗（对齐 pages/news/checkout.js + styles.css 示例） -->
			<uni-popup :show="coudanPopupShow" type="bottom" v-on:hidePopup="handelClose('coudan')" style="z-index: 99998;">
				<view class="gather-popup-wrap">
					<view class="gather-modal-header">
						<text class="gather-modal-title">去凑单 - {{ coudanPopupStore ? coudanPopupStore.store_name : '' }}</text>
						<view class="gather-modal-close-wrap" @click="closeCoudanPopup">
							<uni-icons type="closeempty" size="24" color="#999999"></uni-icons>
						</view>
					</view>
					<scroll-view scroll-y class="gather-modal-body" :style="{height: (couponPopupScrollH ) + 'px'}"
						@scrolltolower="onCoudanScrollLower">
						<view class="gather-modal-scroll-inner">
							<view class="gather-tip-box" v-if="coudanPopupData">
								<text class="gather-tip-main">再选<text class="gather-highlight">{{ coudanPopupData.needAmount }}</text>元，立省<text class="gather-highlight">{{ coudanPopupData.saveAmount }}</text>元</text>
								<text class="gather-tip-sub">满{{ coudanPopupData.manjianRule || '199' }}减{{ coudanPopupData.saveAmount || '30' }}优惠活动</text>
							</view>
							<view class="gather-products">
								<view class="gather-product" v-for="(item, idx) in coudanGoodsList" :key="item.goods_id || idx">
									<image class="gather-product-img" :src="item.goods_thumb" mode="aspectFill"
										@click.stop="productLink({ goods_id: item.goods_id })"></image>
									<view class="gather-product-col">
										<view class="gather-product-name" @click.stop="productLink({ goods_id: item.goods_id })">{{ item.goods_name }}</view>
										<view class="gather-product-tags" v-if="getCoudanItemTags(item).length">
											<text class="gather-tag" v-for="(t, ti) in getCoudanItemTags(item)" :key="ti">{{ t }}</text>
										</view>
										<view class="gather-price-row">
											<view class="gather-price-box">
												<text class="gather-price-current">¥{{ coudanDisplayPrice(item) }}</text>
												<text class="gather-price-original"
													v-if="coudanDisplayMarketPrice(item)">¥{{ coudanDisplayMarketPrice(item) }}</text>
											</view>
											<view class="gather-add-btn" @click.stop="addCoudanGoods(item)">
												<text>加购</text>
												<text class="gather-add-count" v-if="getCoudanAddedCount(item) > 0">x{{ getCoudanAddedCount(item) }}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="gather-empty" v-if="!coudanLoading && (!coudanGoodsList || coudanGoodsList.length === 0)">暂无推荐商品</view>
								<view class="gather-loading" v-if="coudanLoading && coudanPage <= 1">加载中...</view>
								<view class="gather-load-more" v-if="coudanLoading && coudanPage > 1">加载更多...</view>
								<view class="gather-no-more" v-if="coudanLoadMoreDone && coudanGoodsList.length > 0">没有更多了</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</uni-popup>

			<!-- 领取成功提示弹窗（按示例 success-toast 复刻） -->
			<view v-if="couponReceiveSuccessVisible">
				<view class="success-overlay" :class="{ show: couponReceiveSuccessShow }"></view>
				<view class="success-toast" :class="{ show: couponReceiveSuccessShow }">
					<view class="success-icon">
						<svg viewBox="0 0 24 24" width="56rpx" height="56rpx">
							<path fill="#fff" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
						</svg>
					</view>
					<view class="success-title">恭喜你领取成功</view>
					<view class="success-desc">优惠券已放入卡包</view>
				</view>
			</view>

			<uni-popups ref="priceDetail" type="bottom" v-on:hidePopup="handelClose('priceDetail')" style="z-index: 99991;">
				<view class="activity-popup" style="border-radius: 28rpx  28rpx  0rpx  0rpx;">
					<!-- 统一弹窗标题样式：与优惠领券弹窗一致 -->
					<view class="coupon-popup-title">
						<text class="coupon-popup-txt">{{$t('lang.pay_detail')}}</text>
						<uni-icons type="closeempty" size="24" color="#999999" @click="handelClose('priceDetail')"></uni-icons>
					</view>
					<view class="content">
						<scroll-view scroll-y class="popup-scroll-main">
							<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
								<!-- 商品金额部分 -->
								<view class="price-detail-section">
									<view class="price-detail-section-title">商品金额</view>
									<!-- 每个店铺的金额 -->
									<view class="price-detail-store-box" v-if="getPriceDetailStoreRows().length > 0">
										<view class="price-detail-store-item" v-for="(store, idx) in getPriceDetailStoreRows()" :key="idx">
											<view class="label">
												<view class="label-left price-store-left">
													<view class="price-store-name">{{ store.store_name }}</view>
												</view>
												<view class="label-right">¥{{ parseFloat(store.goods_subtotal).toFixed(2) }}</view>
											</view>
											<view class="label price-store-discount-row" v-if="hasStoreRowPromotionDiscount(store)">
												<view class="price-store-discount-label">优惠</view>
												<view class="price-store-discount-amount">-¥{{ getStoreRowPromotionDiscount(store) }}</view>
											</view>
										</view>
									</view>
									<view class="label price-detail-summary-sep" v-if="getPriceDetailAllStoresPromotionDiscount() > 0">
										<view class="label-left red">优惠总额</view>
										<view class="label-right red">-¥{{ getPriceDetailAllStoresPromotionDiscountFormat() }}</view>
									</view>
									<!-- 商品总计 -->
									<view class="label price-detail-goods-total-row">
										<view class="label-left">商品总额</view>
										<view class="label-right">¥{{ getPriceDetailGoodsSubtotal() }}</view>
									</view>
								</view>
								
								<!-- 优惠部分 -->
								<view class="price-detail-section" v-if="getPriceDetailTotalDiscount() > 0">
									<!-- 优惠明细主项（抽屉头部） -->
									<view class="discount-activity-toggle-cart" @click="toggleCartDiscountActivity">
										<text class="title">优惠明细</text>
										<view class="discount-activity-toggle-right-cart">
											<view class="value red">-¥{{ getPriceDetailTotalDiscount() }}</view>
											<uni-icons
												v-if="hasCartDiscountActivityChildren()"
												:type="cartDiscountActivityExpanded ? 'arrowup' : 'arrowdown'"
												size="16"
												color="#999999"></uni-icons>
										</view>
									</view>
									
									<!-- 优惠明细子项（抽屉内容） -->
									<view class="discount-activity-child-cart" v-if="cartDiscountActivityExpanded && getPriceDetailFullReduction() > 0">
										<view class="label">
											<view class="label-left red">满减优惠</view>
											<view class="label-right red">-¥{{ getPriceDetailFullReduction() }}</view>
										</view>
									</view>
									<view class="discount-activity-child-cart" v-if="cartDiscountActivityExpanded && getPriceDetailDiscount() > 0">
										<view class="label">
											<view class="label-left red">限时折扣</view>
											<view class="label-right red">-¥{{ getPriceDetailDiscount() }}</view>
										</view>
									</view>
									<view class="discount-activity-child-cart" v-if="cartDiscountActivityExpanded && getPriceDetailPromotionDiscountAmount() > 0">
										<view class="label">
											<view class="label-left red">促销折扣</view>
											<view class="label-right red">-¥{{ getPriceDetailPromotionDiscountAmount() }}</view>
										</view>
									</view>
									<view class="discount-activity-child-cart" v-if="cartDiscountActivityExpanded && getPriceDetailBlackCardDiscountAmount() > 0">
										<view class="label">
											<view class="label-left red">黑卡优惠</view>
											<view class="label-right red">-¥{{ getPriceDetailBlackCardDiscountAmount() }}</view>
										</view>
									</view>
									<view class="discount-activity-child-cart" v-if="cartDiscountActivityExpanded && getPriceDetailCoupon() > 0">
										<view class="label">
											<view class="label-left red">优惠券</view>
											<view class="label-right red">-¥{{ getPriceDetailCoupon() }}</view>
										</view>
									</view>
								</view>
								
								<!-- 运费部分 -->
								<view class="price-detail-section">
									<view class="label">
										<view class="label-left">总运费</view>
										<view class="label-right">¥{{ getPriceDetailShippingFee() }}</view>
									</view>
								</view>
								
								<!-- 合计部分 -->
								<view class="price-detail-section">
									<view class="label label-total">
										<view class="label-left"><text>实付金额</text></view>
										<view class="label-right label-right-total">¥{{ getPriceDetailAmountPayable() }}</view>
									</view>
									<view class="price-detail-note">注：以上价格预估价格，实际支付金额提交订单后为准</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-popups>
		

			<uni-popups ref="goodsattr" type="bottom" style="z-index: 99999999;">
				<!-- 规格弹窗高度与商品详情保持一致，不再额外加高 -->
				<view class="pop_content specification-pop-content" >
					<view class="goods_attr_pop">
						<image class="close_img"
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
							@click="closePop('goodsattr',1)"></image>

						<view class="goods_info">
							<image class="goods_pic" :src="oneMoreGoodsDetail.goods_thumb"
								@click="previewImg(0, oneMoreGoodsDetail.goods_thumb)"></image>

							<view class="info_right">
								<view>
									<view>
										<currency-price
											:price="oneMoreGoodsDetail.goods_price_format ||oneMoreGoodsDetail.goods_price"
											:size="24"
											v-if="oneMoreGoodsDetail.goods_price_format  ||oneMoreGoodsDetail.goods_price"></currency-price>
									</view>
								</view>

							</view>
						</view>
					</view>

					<!-- 切换规格 -->
					<scroll-view scroll-y="true" :style="{height: `${popHeight.center-20}px`}">
						<view class="goods_attr_pop">

							<!-- 如果是多规格 -->
							<view class="goods_attr_wrap" v-if="attrLength >= 2">
								<view class="attr_type" v-for="(item, index) in goodsAttr" :key="index">
									<!-- 通用属性名称展示 -->
									<view class="attr_title">{{item.name}}</view>
									<!-- 常规项内容 -->
									<view class="attr_list" v-if="!isLastItem(index)">
										<view class="attr_top_num_box" v-for="(attrItem, vIndex) in item.attr_key"
											:key="vIndex" @click="selectGoodsAttr(attrItem, item,1)">
											<view class="attr_top_num">
												<image v-if="attrItem.attr_img_flie" :src="attrItem.attr_img_flie">
												</image>
												<image v-else class="img"
													src="https://www.ok9288.com/img/user_default.png">
												</image>
												<view
													:class="['attr_item', seleceGoodsAtrrArray.includes(attrItem.id) ? 'active_attr' : '']">
													<text>{{attrItem.attr_value}}</text>
												</view>
											</view>
											<view class="badge"
												:class="['badge', getColorTotal(attrItem.id) > 0 ? 'badg_block' : 'badg_none']">
												<text>x</text>{{ getColorTotal(attrItem.id) }}
											</view>
										</view>
									</view>
									<view class="sizes" v-else>
										<view v-for="(attrItem, attrIndex) in item.attr_key" :key=" attrIndex"
											v-if="(goodsAttr.length -1) == index && attrLength >= 2" class="size-item">
											<view class="spec-info">
												<text class="spec-info-text">{{attrItem.attr_value}}</text>
												<view class="spec-info-price">
													<view class="inventory" v-if="skuType">
														<view class="inventory_num">
															<!-- 价格  -->
															<text>¥{{ currentSkuInfo(attrItem.id,goodsAttr).product_price }}</text>
														</view>
														<view class="inventory_num">
															<text
																class="label">{{$t('lang.gun')}}{{$t('lang.stock')}}：</text>
															<!-- stock 库存 -->
															<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).product_number || '' }}</text>
														</view>
														<view class="inventory_sn">
															<text
																class="label">{{$t('lang.gun')}}{{$t('lang.commodity_number')}}</text>
															<!-- commodity_number 编号 -->
															<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).product_sn  || ''}}</text>
														</view>
														<view class="inventory_num">
															<text class="label">条形码：</text>
															<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).bar_code  || ''}}</text>
														</view>
													</view>
												</view>
											</view>
											<view class="counter">
												<button :disabled="getCurrentCount(attrItem) <= 0"
													@click="changeGoodsNum(-1,attrItem)">-</button>
												<!--  :value="getCurrentCount(attrItem)" -->
												<input :value="getCurrentCount(attrItem)"
													@blur="changeGoodsNumByInput($event,attrItem,item)"
													class="count-input" />
												<button @click="changeGoodsNum(1,attrItem)">+</button>
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 如果是单规格 -->
							<view class="goods_attr_wrap">

								<view class="attr_type" v-for="(item, index) in goodsAttr" :key="index"
									v-if="(goodsAttr.length -1) == index && attrLength <= 1">
									<view class="attr_title">{{item.name}}</view>

									<!-- -->
									<view class="attr_list ">
										<view class="attr_list_box_label" v-for="(attrItem, attrIndex) in item.attr_key"
											:key="attrIndex">
											<view class="attr_top_num_box">
												<view class="attr_top_num"
													v-if="(goodsAttr.length -1) == index && attrLength <= 1">
													<image v-if="attrItem.attr_img_flie" :src="attrItem.attr_img_flie">
													</image>
													<image v-else src="https://www.ok9288.com/img/user_default.png">
													</image>

												</view>
												<view class="badge"
													:class="['badge', getColorTotal(attrItem.id) > 0 ? 'badg_block' : 'badg_none']">
													<text>x</text>{{ getColorTotal(attrItem.id) }}
												</view>
											</view>
											<view class="size-label">
												<view class="size-item" style="flex-direction: column">
													<view class="spec-info1">
														<text class="spec-info-text">{{attrItem.attr_value}}</text>


														<view class="counter">
															<button :disabled="getCurrentCount(attrItem) <= 0"
																@click="changeGoodsNum(-1,attrItem)">-</button>
															<input :value="getCurrentCount(attrItem)"
																@blur="changeGoodsNumByInput($event,attrItem,item)"
																class="count-input" />
															<button @click="changeGoodsNum(1,attrItem)">+</button>
														</view>
													</view>
													<view class="spec-info-price">
														<view class="inventory" v-if="skuType">
															<view class="inventory_num">
																<!-- 价格  -->
																<text>¥{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_price || "" }}</text>
															</view>
															<view class="inventory_num">
																<text
																	class="label">{{$t('lang.gun')}}{{$t('lang.stock')}}：</text>
																<!-- stock 库存 -->
																<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_number || ""}}</text>
															</view>
															<view class="inventory_sn">
																<text
																	class="label">{{$t('lang.gun')}}{{$t('lang.commodity_number')}}：</text>
																<!-- commodity_number 编号 -->
																<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_sn || ""}}</text>
															</view>
															<view class="inventory_num">
																<text class="label">条形码：</text>
																<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).bar_code|| "" }}</text>
															</view>
														</view>
													</view>
												</view>

											</view>


										</view>

									</view>


								</view>
							</view>

						</view>
					</scroll-view>


					<view class="footer-total-btn u-border-top">
						<view class="footer-total-price">
							<!-- 总价显示 -->
							<view class="total-section">
								<view>
									<view style="color: #999;">
										<text>{{$t('lang.label_selected2')}}</text>
										<text
											class="total-section-goods-num">{{ totalQuantity }}</text><text>{{$t('lang.jian')}}</text>
										<text v-if="goodsAttr.deliver_day">{{goodsAttr.deliver_day}}</text>
									</view>

								</view>
								<view class="footer-total-price-right">

								</view>
							</view>

						</view>
						<view class="footer-total-price-btn">
							<button @click="onAddCartClicked(0)"
								class="u-reset-button sub_btn yellow_btn" style="margin: 0 40rpx;">{{$t('lang.confirm_add')}}</button>

						</view>

					</view>
				</view>
			</uni-popups>




			<div class="loading-transparent" v-show="loading">
				<uni-load-more-new status="loading" :type="false" color="#F20E28" iconType="circle"></uni-load-more-new>
				<div class="loading-overlay"></div>
			</div>
		</view>
		<custom-tabbar />
		
		<uni-popups ref="address" type="bottom" style="z-index: 99999999;">
			<view class="pop_content" :style="{height: `${popHeight.hd+60}px`}">
				<!-- 统一弹窗标题样式：与优惠领券弹窗一致 -->
				<view class="coupon-popup-title">
					<text class="coupon-popup-txt">{{$t('lang.delivery_to_the')}}</text>
					<uni-icons type="closeempty" size="24" color="#999999" @click="closePop('address')"></uni-icons>
				</view>
				<!-- #ifdef H5 -->
				<scroll-view scroll-y="true" :style="{height: `${popHeight.center-20}px`}">
					<view class="pop_scroll_view address-popup-scroll" v-if="addressList.length > 0">
						<view class="address_item_card" v-for="(item, index) in addressList" :key="index"
							:class="{ 'address_item_card--checked': iSaddress == item.id }"
							@click="changeAddressRadio(item)">
							<view class="address_item">
								<view class="clicked_ico">
									<uni-icons type="checkbox-filled" size="20" color="#F91F28"
										v-if="iSaddress == item.id"></uni-icons>
									<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
								</view>
								<view class="address_item_content">
									<view class="address-info">
										<text class="receiver-name">{{ item.name || item.consignee || '' }}</text>
										<text class="receiver-phone">{{ maskPhone(item.mobile || item.tel || '') }}</text>
										<view class="address_default_tag" v-if="item.is_checked == 1">默认</view>
									</view>
									<view class="address-detail">{{ getAddressFullAddress(item) }}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view style="height: 150rpx;"></view>
						<view class="none_lauout">
							<image class="none_img"
								src="https://images.eqingqu.com/attachs/photo/202404/20240418_7CA9C895B86A19B4657088E863299FA2.png">
							</image>
							<view class="title" style="color:#999999;">收货地址为空</view>
						</view>
					</view>
				</scroll-view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<scroll-view scroll-y="true" :style="{height: `${popHeight.center+40}px`}">
					<view class="pop_scroll_view address-popup-scroll" v-if="addressList.length > 0">
						<view class="address_item_card" v-for="(item, index) in addressList" :key="index"
							:class="{ 'address_item_card--checked': iSaddress == item.id }"
							@click="changeAddressRadio(item)">
							<view class="address_item">
								<view class="clicked_ico">
									<uni-icons type="checkbox-filled" size="20" color="#F91F28"
										v-if="iSaddress == item.id"></uni-icons>
									<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
								</view>
								<view class="address_item_content">
									<view class="address-info">
										<text class="receiver-name">{{ item.name || item.consignee || '' }}</text>
										<text class="receiver-phone">{{ maskPhone(item.mobile || item.tel || '') }}</text>
										<view class="address_default_tag" v-if="item.is_checked == 1">默认</view>
									</view>
									<view class="address-detail">{{ getAddressFullAddress(item) }}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view style="height: 150rpx;"></view>
						<view class="none_lauout">
							<image class="none_img"
								src="https://images.eqingqu.com/attachs/photo/202404/20240418_7CA9C895B86A19B4657088E863299FA2.png">
							</image>
							<view class="title">无收货地址</view>
						</view>
					</view>
				</scroll-view>
				<!-- #endif -->
				<!-- <view style="height: 30rpx;"></view> -->
		
				<view class="btn_wrap u-border-top" :style="addressPopupBtnWrapStyle">
					<button class="u-reset-button sub_btn address_btn red_btn" @click="togetlocation">添加新地址</button>
		
				</view>
		
			</view>
		</uni-popups>
		
	</view>

</template>

<script>
import {
	mapState
} from 'vuex'
import { apiShopping } from '@/config'
	import uniNumberBox from "@/components/uni-number-box.vue";
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniLoadMoreNew from '@/components/uni-load-more-new/uni-load-more.vue';

	import universal from '@/common/mixins/universal.js';
import createPageTrackMixin from '@/common/mixins/pageTrackMixin.js';

	import dscProductList from '@/components/dsc-product-list.vue';

	/*地区选择组件*/
	import dscRegion from '@/components/dsc-region.vue';
	import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import waterfall from '@/pagesD/components/waterfall.vue'
	import { getCurrentVersion, setVersion, incrementVersion } from '@/utils/version.js';

const CART_SELECTION_STATE_KEY = '__cartSelectionState__';
const CART_APP_SESSION_KEY = '__cartAppSessionId__';
const CART_SELECTION_STORAGE_PREFIX = 'cart_selection_state_';

/** 赠品提示图标：与 news/app 中 ico.gift 同路径；iOS/App 内联 svg 部分端不渲染，改用 data URI + image */
const CART_GIFT_TIP_ICON_SRC =
	'data:image/svg+xml;charset=utf-8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>'
	);

function getCartLaunchState() {
	if (typeof getApp !== 'function') {
		return {
			isColdStart: false
		};
	}
	const app = getApp();
	if (!app) {
		return {
			isColdStart: false
		};
	}
	app.globalData = app.globalData || {};
	if (!app.globalData[CART_APP_SESSION_KEY]) {
		app.globalData[CART_APP_SESSION_KEY] = `${Date.now()}_${Math.random()}`;
		return {
			isColdStart: true
		};
	}
	return {
		isColdStart: false
	};
}

function getSelectionContainer() {
	if (typeof getApp === 'function') {
		const app = getApp();
		if (app) {
			app.globalData = app.globalData || {};
			return app.globalData;
		}
	}
	if (!globalThis.__cartSelectionFallback) {
		globalThis.__cartSelectionFallback = {};
	}
	return globalThis.__cartSelectionFallback;
}

function getSelectionStorageKey() {
	const userId = String(uni.getStorageSync('user_id') || '');
	return `${CART_SELECTION_STORAGE_PREFIX}${userId}`;
}

function readSavedSelectionState() {
	const container = getSelectionContainer();
	const storageKey = getSelectionStorageKey();
	const memoryState = container[CART_SELECTION_STATE_KEY];
	if (memoryState && typeof memoryState === 'object') {
		if (memoryState.storageKey === storageKey) {
			return memoryState.value || null;
		}
	}
	try {
		const raw = uni.getStorageSync(storageKey);
		if (!raw) return null;
		const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
		if (parsed && typeof parsed === 'object') {
			container[CART_SELECTION_STATE_KEY] = {
				storageKey,
				value: parsed
			};
			return parsed;
		}
	} catch (error) {
	}
	return null;
}

function writeSavedSelectionState(state) {
	const container = getSelectionContainer();
	const storageKey = getSelectionStorageKey();
	container[CART_SELECTION_STATE_KEY] = {
		storageKey,
		value: state
	};
	try {
		uni.setStorageSync(storageKey, JSON.stringify(state || null));
	} catch (error) {
	}
}

function clearSavedSelectionState() {
	const container = getSelectionContainer();
	if (container && Object.prototype.hasOwnProperty.call(container, CART_SELECTION_STATE_KEY)) {
		delete container[CART_SELECTION_STATE_KEY];
	}
	try {
		const storageKey = getSelectionStorageKey();
		uni.removeStorageSync(storageKey);
	} catch (error) {
	}
}

const REQUEST_TIMEOUT_MS = 60000;
let CART_RECKON_REQ_SEQ = 0;

function withTimeout(promise, ms) {
	let timeoutId;
	const timeoutPromise = new Promise((_, reject) => {
		timeoutId = setTimeout(() => reject(new Error('请求超时')), ms);
	});
	return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

	export default {
		mixins: [universal, createPageTrackMixin('carts')],
		components: {
			uniNumberBox,
			uniIcons,
			uniPopup,
			uniLoadMore,
			uniLoadMoreNew,
			dscProductList,
			dscRegion,
			dscFilterTop,
			waterfall,
			uniPopups,
			CustomTabbar
		},
		data() {
			return {
				cartGiftTipIconSrc: CART_GIFT_TIP_ICON_SRC,
				configs:{
					padding: '30rpx',
					gridRows: 6,
					gridColumns: 1,	
					gridRowsGap: '50rpx',
					gridColumnsGap: '24rpx',
					itemDirection: 'row',
					itemGap: '30rpx',
					itemAlign: 'flex-start',
					headShow: true,
					headWidth: '200rpx',
					headHeight: '200rpx',
					// headBorderRadius: '50%',
					textShow: true,
					textRows: 4,
					textRowsGap: '30rpx',
					textWidth: ['50%', '100%', '100%', '80%'],
					textHeight: ['40rpx', '24rpx', '24rpx', '24rpx'],
					// textBorderRadius: '6rpx',
				},
				 _totalPriceCache: null, // 缓存计算结果
			    _dataProcessingTimer: null,
			    _initialized: false, // 标记是否完成初始化
				loading3: false, // 初始值设为false，有缓存时直接显示，无缓存时显示骨架屏
				dataLoading: false, // 数据是否正在加载中（用于显示 loading 弹窗）
				// 购物车缓存相关
				cartCacheKey: '', // 缓存 key（基于用户ID）
				lastRecId: null, // 最后一次全量加载的最大 rec_id
				isFirstLoad: true, // 是否首次加载（用于判断是否显示 loading）
				isSilentUpdating: false, // 是否正在进行静默更新
				isCalculating: false, // 添加计算状态锁
				_isUpdatingNumber: false, // 添加数量更新锁，防止并发请求
				_isReckoningPrice: false, // 价格计算请求锁，避免重复并发 reckon_cartgoods
				_pendingReckon: false, // 价格计算中的重入标记
				_pendingReckonSilent: true, // 重入请求是否可静默
				_skipShowEveryGoodsListOnce: false, // onShow 已处理购物车时，跳过 showEvery 的重复 goodsList
				_lastCartCacheWriteAt: 0,
				_lastCartCacheWriteKey: '',
				checkAllTimer: null,
				recIdArr: [],
				totalQuantity: 0,
				skuType: true,
				history: {}, // 存储格式：{ "颜色ID_规格ID": 数量 }
				seleceGoodsAtrrArray: [], // 规格选中项数组（与模板 active class 使用的字段名保持一致）
				selectedColor: '', // 作为 key 组装时的主规格值（通常是第一维）
				selectionHistory: {},
				cartSelectionSignature: '',
				isRestoringSelection: false,
				goodsDetail: {},
				attrLength: 0, // 规格数量1 ，显示数量按钮 ，大于1 在每条商品后显示
				oneMoreGoodsDetail: {},
				showLoadMore: false,
				loading: false,
				disabled: true,
				default: true,
				checkedAll: false,
				checkedGoodsId: [],
				totalPrice: 0,
				ratePrice: 0,
				ratePriceTip: '',
				favourablePrice: 0,
				count: 0,
				coupuns_num: 0,
				batchEdit: false,
				couponShow: false,
				couponPopupStore: null,

				couponPopupRuId: null,
				couponPopupScrollH: 400,
				// 满减信息弹窗（再选X立省Y）
				manjianPopupShow: false,
				manjianPopupStore: null,
				manjianPopupListIndex: null,
				// 去凑单弹窗
				coudanPopupShow: false,
				coudanPopupStore: null,
				coudanPopupListIndex: null,
					// 去凑单弹窗：当前会话内的临时加购增量（key: ruId_goodsId -> delta）
					coudanTempDeltaMap: {},
				coudanLoading: false,
				coudanPage: 1,
				coudanLoadMoreDone: false,
				// 店铺主商品折叠（>10 条）：key 为 storeExpandKey
				storeCartExpanded: {},
				// 购物车优惠明细展开状态
				cartDiscountActivityExpanded: false,
				// 店铺优惠明细弹窗
				storeDiscountDetailShow: false,
				storeDiscountDetailStore: null,
				storeDiscountDetailList: [],
				storeDiscountDetailTotal: '0.00',
				storeDiscountPopupScrollH: 280,
				// 领取成功提示弹窗状态
				couponReceiveSuccessVisible: false,
				couponReceiveSuccessShow: false,
				_couponReceiveSuccessTimer1: null,
				_couponReceiveSuccessTimer2: null,
				favourableShow: false,
				favourableList: [],
				giftShow: false,
				giftList: [],
				act_type_ext: 0,
				checkGiftStr: '',
				checkGiftArr: [],
				giftDisabled: false,
				scrollLeft: 0,
				dscLoading: true,
				stepDisabled: [],
				shopStore: [],
				timer: '',
				page: 1,
				size: 10,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				shopInvalidArr: [],
				checkedAllDisabled: false,
				scrollState: false,
				menuButtonInfo: {},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f92028'
					}
				}],
				isIpx: false,
				searchValue: '',

				gaodu: '',

				userInfo: '',
				affiliate_infovalue: '', // 优惠折扣
				// save_price:'', // 节省金额

				new_one_list: [],

				nums: 0,
				priceDtailnum: 0, //明细弹窗 不含运费价格
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0,
					couponPopupTotalPx: 0,
					couponPopupScrollPx: 0
				},

				currAddressSwiper: 0,
				addressList: [],

				regionSplic: '请选择',
				regionData: {},

				shipping_fee: 0,

				totalPriceTiping: true,
				placImg: 'https://images.eqingqu.com/attachs/photo/202409/20240928_5E6119D10B21F636A3FD12134EBF6233.png',
				issubmit: [],
				savegiftlist: [],
				minamount: 0,
				goodsnumber: 0,
				pricenum: 0,
				objsubmit: {},
				objarr: [],
				couponPopupMode: 'discount',

				priceDetailActLabel: '', // 金额明细弹窗中的优惠名称（来自 act_info 第一个）
				goodsFavourableFormat: '0.00', // 金额明细弹窗中的店铺优惠金额（goods_favourable_format）
				recid: '',
				actid: '',
				delList: [],
				totalDiscount: 0, // 总折扣金额
				finalGlobalTotal: 0, // 最终全局总金额
				globalTotal: 0, // 全局未折扣总金额
				platformStyle: '',
				loadingMoreGoods: {}, // 记录每个店铺的加载状态，格式：{ storeIndex: boolean }
				_storeAllLoadedMap: {}, // 记录每个店铺是否已加载全部商品，键为 store_id
				_globalAllSelectedMode: false, // 是否处于“全局全选+排除部分商品”的模式
				_isPullRefreshing: false, // 下拉刷新进行中，防止连续触发
				_reckonGiftByAct: {}, // 结算接口返回的赠品，按活动ID分组
				_reckonAvailableFav: {}, // 结算接口返回的 available_favourable，按活动ID缓存
				_reckonFavByStore: {}, // 结算接口返回的 available_favourable，按店铺缓存
				_reckonStoreGiftActIds: {}, // 按店铺：{ store_id: [act_id1, act_id2] } 用于独立赠品行展示
				itemGiftActIndexMap: {}, // 按商品记录当前展示的赠品活动索引：{ `${storeId}_${recId}`: index }
				_settlementData: {}, // 结算接口返回的 settlement 数据，按 store_id 缓存
				_settlementDataLoaded: false, // settlement 数据是否已加载完成
				flashSaleNowTs: Math.floor(Date.now() / 1000), // 秒级当前时间戳（驱动限时抢倒计时刷新）
				flashSaleTimer: null,
				flashSaleRemainSeedMap: {},
				cartDataUpdatedHandler: null,
				_lastCartUserId: ''
			};
		},

		computed: {
			...mapState({
				checkedGoods: state => state.shopping.checkedGoods, //购物车商品列表
				cartCouponsList: state => state.shopping.cartCouponsList, //优惠券列表
				allGoodsListId: state => state.shopping.allGoodsListId
			}),
			goodsAttr: function() {
				return this.goodsDetail.attr ? this.goodsDetail.attr : [];
			},
			attr() {
				return this.goodsDetail.attr ? this.goodsDetail.attr : [];
			},
			selectAddress: {
				get() {
					return this.addressRadio
				},
				set(value) {
					this.addressRadio = value
				}
			},
			iSaddress: {
				get() {
				
					return this.$store.state.user.addressId
				},
				set(value) {
					this.$store.dispatch('userAddressDefault', {
						address_id: value
					})
				}
			},
			// 当前选中的收货地址对象（用于新版地址卡片展示）
			selectedAddressObj() {
				if (!this.addressList || !this.iSaddress) return null;
				return this.addressList.find(item => String(item.id) === String(this.iSaddress)) || null;
			},
			// 用于展示的地址对象：优先选中的，否则用默认地址（is_checked==1）。地址来自 getuserAddressList -> api/address
			displayAddressObj() {
				if (this.selectedAddressObj) return this.selectedAddressObj;
				if (!this.addressList || this.addressList.length === 0) return null;
				return this.addressList.find(item => item.is_checked == 1) || this.addressList[0] || null;
			},
			// 选中地址的完整地址字符串（省市区街道+详细地址）
			displayAddressFullAddress() {
				const a = this.displayAddressObj;
				if (!a) return '';
				return a.province_name == a.city_name ?
					`${a.province_name || ''}${a.district_name || ''}${a.street_name || ''}${a.address || ''}` :
					`${a.province_name || ''}${a.city_name || ''}${a.district_name || ''}${a.street_name || ''}${a.address || ''}`;
			},
			addressPopupBtnWrapStyle() {
				return {
					zIndex: 99999999,
					marginBottom: this.isIpx ? '30rpx' : '0'
				}
			},
			ongoodsGuessList: {
				get() {
					return this.$store.state.shopping.ongoodsGuessList
				},
			},
			goodsGuessList: {
				get() {
					return this.$store.state.shopping.goodsGuessList
				},
				set(val) {
					this.$store.state.shopping.goodsGuessList = val
				}
			},
			goodsCartList: {
				get() {
					return this.$store.state.shopping.goodsCartList
				},
				set(val) {
					this.$store.state.shopping.goodsCartList = val
				}
			},
			checkedShop: {
				get() {
					return this.$store.state.shopping.checkedShop
				},
				set(val) {
					this.$store.state.shopping.checkedShop = val
				}
			},
			submitBarText() {
				return this.$t('lang.go_checkout_1')
			},
			showCheckoutBtnLoading() {
				return this.disabled === true && this._isReckoningPrice === true && this.nums > 0 && this.count > 0
			},
			totalPriceTip() {
				return this.totalPrice
			},
			favourableTip() {
				return this.favourablePrice
			},
			isLogin() {
				return this.$isLogin()
			},
			length() {
				return this.checkedGoodsId ? this.checkedGoodsId.length : 0
			},
			// 优惠券弹窗：仅使用 shop_preferential_panel 下的数据
			couponPopupList() {
				const store = this.couponPopupStore;
				const panel = this.getStorePreferentialPanel(store);
				const modules = panel.preferential_modules || {};
				const couponModule = modules.coupon || {};
				const couponItems = Array.isArray(couponModule.items) ? couponModule.items : [];
				const couponCards = Array.isArray(couponModule.coupon_cards) ? couponModule.coupon_cards : [];
				const sectionCoupons = this.getPanelSectionItems(store, 'coupon');
				if (couponCards.length > 0) return couponCards;
				if (couponItems.length > 0) return couponItems;
				return sectionCoupons;
			},
			// 优惠券弹窗：优惠活动（满减+满赠）
			couponPopupManjianList() {
				const store = this.couponPopupStore;
				const fullReductionItems = this.getPanelSectionItems(store, 'full_reduction');
				const fullGiftItems = this.getPanelSectionItems(store, 'full_gift');
				return [...fullReductionItems, ...fullGiftItems];
			},
			// 优惠券弹窗：限时优惠（act_type==2）
			couponPopupXianshiList() {
				const store = this.couponPopupStore;
				return this.getPanelSectionItems(store, 'limited_discount');
			},
			// 优惠弹窗活动分组：按 act_type 分组（0赠品 1满减 2折扣），不依赖数组名
			couponPopupActivitySections() {
				const store = this.couponPopupStore;
				const panel = this.getStorePreferentialPanel(store);
				const modules = panel.preferential_modules || {};
				const activity = modules.activity || {};
				const sectionTitleMap = {};
				const panelSections = Array.isArray(panel.sections) ? panel.sections : [];
				panelSections.forEach(sec => {
					if (sec && sec.section_key) sectionTitleMap[sec.section_key] = sec.section_title || '';
				});
				const activityKeys = ['full_gift', 'full_reduction', 'limited_discount'];
				const allItems = [];
				activityKeys.forEach((k) => {
					const arr = Array.isArray(activity[k]) ? activity[k] : [];
					arr.forEach((it) => {
						if (it) allItems.push(it);
					});
				});
				const actTypeToKey = {
					0: 'full_gift',
					1: 'full_reduction',
					2: 'limited_discount'
				};
				const grouped = {
					full_reduction: [],
					full_gift: [],
					limited_discount: []
				};
				allItems.forEach((it) => {
					const t = Number(it.act_type);
					const key = actTypeToKey[t];
					if (!key) return;
					if (!(it.rule_text || it.sub_title || it.title)) return;
					grouped[key].push(it);
				});
				const orderedKeys = ['full_reduction', 'full_gift', 'limited_discount'];
				return orderedKeys.map((key) => ({
					key,
					title: sectionTitleMap[key] || (key === 'full_reduction' ? '满减活动' : key === 'full_gift' ? '满赠活动' : '限时优惠'),
					items: grouped[key]
				})).filter(group => group.items.length > 0);
			},
			// 弹窗内活动顺序：满减 -> 满赠（用于保证你要的“第三个是优惠券”）
			couponPopupFrontActivitySections() {
				const sections = this.couponPopupActivitySections || [];
				return sections.filter(s => s && (s.key === 'full_reduction' || s.key === 'full_gift'));
			},
			// 弹窗内活动其余部分（保持原数据顺序）
			couponPopupBackActivitySections() {
				const sections = this.couponPopupActivitySections || [];
				return sections.filter(s => s && s.key !== 'full_reduction' && s.key !== 'full_gift');
			},
			// 优惠弹窗：黑卡会员分组
			couponPopupBlackCardSection() {
				const store = this.couponPopupStore;
				const panel = this.getStorePreferentialPanel(store);
				const modules = panel.preferential_modules || {};
				const sectionTitleMap = {};
				const panelSections = Array.isArray(panel.sections) ? panel.sections : [];
				panelSections.forEach(sec => {
					if (sec && sec.section_key) sectionTitleMap[sec.section_key] = sec.section_title || '';
				});
				const blackCard = modules.black_card_member || {};
				const items = Array.isArray(blackCard.items) ? blackCard.items : [];
				return {
					key: 'black_card_member',
					title: sectionTitleMap.black_card_member || blackCard.title || '黑卡会员',
					items: items.filter(it => it && (it.title || it.sub_title))
				};
			},
			/** 优惠弹层总高上限（px）：最高 660px，且不超过屏高 95% */
			couponPopupCapPx() {
				const sys = uni.getSystemInfoSync();
				return Math.min(660, Math.floor((sys.windowHeight || 667) * 0.95));
			},
			couponPopupPanelStyle() {
				return {
					maxHeight: '76vh'
				};
			},
			couponPopupScrollStyle() {
				return {
					maxHeight: 'calc(76vh - 62px)'
				};
			},
			// 去凑单弹窗数据
			coudanPopupData() {
				const store = this.coudanPopupStore;
				const idx = this.coudanPopupListIndex != null ? this.coudanPopupListIndex : 0;
				const tier = store ? this.getNextManjianTier(store, idx) : null;
				const needAmount = tier ? tier.needAmount : 52;
				const saveAmount = tier ? tier.saveAmount : 10;
				const manjianRule = (tier && tier.minAmount) ? tier.minAmount : '199';
				return { needAmount, saveAmount, manjianRule };
			},
			// 满减信息弹窗数据
			manjianPopupData() {
				const store = this.manjianPopupStore;
				const idx = this.manjianPopupListIndex != null ? this.manjianPopupListIndex : 0;
				
				// 只使用后端返回的 settlement 数据，没有数据就返回空对象
				const storeId = store ? (store.store_id || store.ru_id) : null;
				const settlement = storeId && this._settlementData && this._settlementData[storeId];
				const fullReductionProgress = settlement && settlement.full_reduction_progress;
				
				if (fullReductionProgress && fullReductionProgress.banner && fullReductionProgress.banner.has_next_tier) {
					// 使用后端真实数据
					const banner = fullReductionProgress.banner;
					const needAmount = banner.need_more || 0;
					const saveAmount = banner.save_amount || 0;
					const currentTotal = parseFloat(fullReductionProgress.selected_amount || 0).toFixed(2);
					const shortBy = needAmount;
					
					// 构建满减规则列表
					const rules = [];
					if (fullReductionProgress.rules && Array.isArray(fullReductionProgress.rules)) {
						fullReductionProgress.rules.forEach(rule => {
							let status = 'not_met';
							if (rule.status === 'short') {
								status = 'short_by';
							} else if (rule.status === 'reached' || rule.status === 'satisfied') {
								status = 'satisfied';
							}
							rules.push({
								threshold: rule.threshold,
								discount: rule.discount,
								status: status,
								shortBy: rule.diff_amount,
								actId: fullReductionProgress.act_id || 0
							});
						});
					}
					
					const coupons = [];
					return { needAmount, saveAmount, currentTotal, shortBy, rules, coupons };
				}
				
				// 没有后端数据就返回空对象，不显示任何内容
				return { needAmount: 0, saveAmount: 0, currentTotal: '0.00', shortBy: 0, rules: [], coupons: [] };
			},
			coudanGoodsList() {
				return this.$store.state.shopping.coudanGoodsList || [];
			}
		},


		onReachBottom() {
			var that = this
			that.loadMoreStatus = 'loading';
			if (that.page * that.size == that.goodsGuessList.length) {
				that.page++
				that.goodsGuessHandle()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		created() {
			// 【修复】确保 _storeAllLoadedMap 一定存在（防止 mixins 或其他原因导致 undefined）
			if (this._storeAllLoadedMap === undefined || this._storeAllLoadedMap === null) {
				this._storeAllLoadedMap = {};
			}

			// 【关键修复】将同步操作改为异步，不阻塞页面切换
			// 使用 setTimeout(0) 确保页面切换立即完成，系统信息获取在后台执行
			setTimeout(() => {
				// 获取系统信息
				const sysInfo = uni.getSystemInfoSync();

				// 判断是否为微信小程序环境
				const isWechatMiniProgram = typeof wx !== 'undefined' && wx.getSystemInfo;

				// 微信小程序环境下的处理
				if (isWechatMiniProgram) {
					// 获取系统版本信息 (格式示例: "iOS 15.6.1" 或 "Android 11")
					const system = sysInfo.system || '';
					const isIOS = system.toLowerCase().includes('ios') || system.toLowerCase().includes('iphone');
					const isAndroid = system.toLowerCase().includes('android');

					// 设置不同的底部值
					if (isAndroid) {
						this.platformStyle = 'bottom: 88rpx'; // Android增加20rpx
					} else if (isIOS) {
						this.platformStyle = 'bottom: 108rpx'; // iOS使用原数值
					}
				}
				// 非微信小程序环境，使用条件编译区分APP和H5

				// #ifdef APP-PLUS
				if (sysInfo.platform === 'android') {
					this.platformStyle = 'bottom: 115rpx'; // Android端预留自定义tab高度
				}
				if (sysInfo.platform === 'ios') {
					this.platformStyle = 'bottom: 120rpx'; // iOS端预留自定义tab高度
				}
				// #endif

				// #ifdef H5
				this.platformStyle = 'bottom: 82rpx'; // H5环境使用特定值
				// #endif
			}, 0);
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.goods-detail-guess').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight
				if (t_height <= to_scroll_top) {
					that.loadMoreStatus = 'loading';
					if (that.page * that.size == that.goodsGuessList.length) {
						that.page++
						that.goodsGuessHandle()
					}
				}
			}).exec()
		},
		methods: {
			getStorePreferentialPanel(storeList) {
				if (!storeList) return {};
				const rawPanel = storeList.shop_preferential_panel;
				if (!rawPanel) return {};
				if (typeof rawPanel === 'string') {
					try {
						return JSON.parse(rawPanel) || {};
					} catch (e) {
						return {};
					}
				}
				return (typeof rawPanel === 'object') ? rawPanel : {};
			},
			getPanelSectionItems(storeList, sectionKey) {
				const panel = this.getStorePreferentialPanel(storeList);
				const sections = Array.isArray(panel.sections) ? panel.sections : [];
				const section = sections.find(s => s && s.section_key === sectionKey);
				return Array.isArray(section && section.items) ? section.items : [];
			},
			getCouponMoney(item) {
				if (!item) return '0';
				const raw = item.amount ?? item.cou_money ?? item.coupon_money ?? item.money ?? item.discount_amount ?? 0;
				const num = parseFloat(raw);
				if (Number.isNaN(num)) return '0';
				return Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.?0+$/, '');
			},
			getCouponMinAmount(item) {
				if (!item) return '0';
				const raw = item.threshold_amount ?? item.cou_man ?? item.min_amount ?? item.min_price ?? item.full_amount ?? item.threshold ?? 0;
				const num = parseFloat(raw);
				if (Number.isNaN(num)) return '0';
				return Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.?0+$/, '');
			},
			getCouponName(item) {
				if (!item) return '优惠券';
				return item.cou_name || item.coupon_name || item.title || item.name || '优惠券';
			},
			getCouponTitleText(item) {
				if (!item) return '优惠券';
				const min = this.getCouponMinAmount(item);
				const money = this.getCouponMoney(item);
				if (Number(min) > 0 || Number(money) > 0) return '满' + min + '减' + money + '券';
				if (item.cou_name || item.coupon_name || item.title || item.name) return this.getCouponName(item);
				return '满' + min + '减' + money + '券';
			},
			// 图一：券名中间那行（优先 cou_title，兼容 coupon_cards/raw/title）
			getCouponMiddleTitleText(item) {
				if (!item) return '';
				// sections/items：大概率在 cou_title
				if (item.cou_title) return item.cou_title;
				// coupon_cards：常见在 raw 里
				if (item.raw && item.raw.cou_title) return item.raw.cou_title;
				// coupon_cards：也可能直接有 title
				if (item.title) return item.title;
				// 兜底：退到 cou_name（至少保证有文案显示）
				if (item.cou_name) return item.cou_name;
				if (item.raw && item.raw.cou_name) return item.raw.cou_name;
				return '';
			},
			getCouponSubText(item) {
				if (!item) return '';
				return item.valid_text || item.threshold_text || item.rule_text || item.sub_title || item.coupon_desc || item.use_desc || item.use_range_desc || item.remark || ('有效期至' + this.getCouponEndText(item));
			},
			getCouponId(item) {
				if (!item) return '';
				return item.cou_id || item.coupon_id || item.id || '';
			},
			isCouponReceived(item) {
				if (!item) return false;
				if (item.button_status === 'disabled') return true;
				const v = Number(item.is_received ?? item.cou_is_receive ?? item.is_receive ?? item.receive_status);
				return v === 1;
			},
			canCouponReceive(item) {
				if (!item) return false;
				if (item.button_status === 'disabled') return false;
				if (item.can_receive === 0 || item.can_receive === '0') return false;
				return !this.isCouponReceived(item);
			},
			getCouponButtonText(item) {
				if (!item) return '领取';
				if (item.button_text) return item.button_text;
				return this.isCouponReceived(item) ? $t('lang.receive_hove') : '领取';
			},
			// 优惠券标签样式：店铺/平台/跨店
			getCouponScopeClass(item) {
				const t = Number((item && (item.cou_type ?? item.type ?? item.coupon_type)));
				if (t === 0) return 'scope-store';
				if (t === 2) return 'scope-cross';
				return 'scope-platform';
			},
			getCouponScopeText(item) {
				if (!item) return '平台通用券';
				if (item.scope_text) return item.scope_text;
				if (item.cou_type_name || item.type_name || item.coupon_type_name) return item.cou_type_name || item.type_name || item.coupon_type_name;
				const t = Number(item.cou_type ?? item.type ?? item.coupon_type);
				if (t === 0) return '店铺优惠券';
				if (t === 2) return '跨店优惠券';
				return '平台通用券';
			},
			formatCouponEndTime(val) {
				if (!val) return '';
				const s = String(val);
				if (s.indexOf('-') >= 0 || s.indexOf('.') >= 0) {
					return s.substring(0, 10).replace(/-/g, '.');
				}
				if (/^\d{10,13}$/.test(s)) {
					const ts = s.length <= 10 ? parseInt(s) * 1000 : parseInt(s);
					const d = new Date(ts);
					return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
				}
				return s;
			},
			// 优惠券有效期：兼容接口可能返回 cou_end_time / cou_end_time_format / valid_time 等字段
			getCouponEndText(item) {
				if (!item) return '';
				const raw = item.valid_end || item.cou_end_time || item.cou_end_time_format || item.cou_end_date || item.valid_end_time || item.valid_time || item.end_time || item.expire_time || '';
				// 如果是日期字符串包含 '-' 或 '.'，直接走 formatCouponEndTime；时间戳走同函数自动转日期
				return this.formatCouponEndTime(raw);
			},
			// 新增方法：获取优惠券类型
			getCouponType(item) {
				if (!item) return 0;
				return item.cou_type || item.type || item.coupon_type || 0;
			},
			// 新增方法：获取优惠券商品名称
			getCouponGoodsName(item) {
				if (!item) return '';
				return item.cou_goods_name || item.goods_name || item.product_name || '';
			},
			// 新增方法：获取优惠券类型名称
			getCouponTypeName(item) {
				if (!item) return '';
				return item.cou_type_name || item.type_name || item.coupon_type_name || '';
			},
			// 新增方法：获取优惠券店铺名称
			getCouponStoreName(item) {
				if (!item) return '';
				return item.store_name || item.shop_name || '';
			},
			// 新增方法：获取优惠券时间文本
			getCouponTimeText(item) {
				if (!item) return '';
				const rawObj = item.raw || item;

				// 图一：有效期需要 “开始至结束”
				// coupon_cards 常见字段：valid_start / valid_end
				// sections/items 常见字段：cou_start_time / cou_end_time
				// 兼容其它别名
				const beginTime =
					item.cou_start_time || item.begintime || item.begin_time || item.start_time || item.valid_start || item.valid_start_time || '' ||
					rawObj.cou_start_time || rawObj.begintime || rawObj.begin_time || rawObj.start_time || rawObj.valid_start || rawObj.valid_start_time || '';

				const endTime =
					item.cou_end_time || item.endtime || item.end_time || item.expire_time || item.valid_end || item.valid_end_time || '' ||
					rawObj.cou_end_time || rawObj.endtime || rawObj.end_time || rawObj.expire_time || rawObj.valid_end || rawObj.valid_end_time || '';

				const fmtBegin = beginTime ? this.formatCouponEndTime(beginTime) : '';
				const fmtEnd = endTime ? this.formatCouponEndTime(endTime) : '';

				let timeText = '';
				if (fmtBegin && fmtEnd) {
					timeText = fmtBegin + '至' + fmtEnd;
				} else if (fmtEnd) {
					// 兜底：只有结束日期可用时只显示结束
					timeText = fmtEnd;
				} else {
					// 最后兜底：沿用旧的 end 文本
					timeText = this.getCouponEndText(item);
				}

				return timeText || '';
			},
			// 店铺行右侧按钮文案：仅优惠券→领券，有满减+优惠券→优惠
			getStoreHeaderBtnText(storeList) {
				if (!storeList) return '';
				const panel = this.getStorePreferentialPanel(storeList);
				const modules = panel.preferential_modules || {};
				const couponModule = modules.coupon || {};
				const activityModule = modules.activity || {};
				const blackCardModule = modules.black_card_member || {};

				const couponItems = Array.isArray(couponModule.items) ? couponModule.items : [];
				const couponCards = Array.isArray(couponModule.coupon_cards) ? couponModule.coupon_cards : [];
				const hasCoupon = couponItems.length > 0 || couponCards.length > 0;

				const activityKeys = ['full_reduction', 'full_gift', 'limited_discount'];
				const hasActivity = activityKeys.some(key => Array.isArray(activityModule[key]) && activityModule[key].length > 0);
				const hasBlackCard = Array.isArray(blackCardModule.items) && blackCardModule.items.length > 0;
				const sectionHasActivity = ['full_reduction', 'full_gift', 'limited_discount'].some(
					key => this.getPanelSectionItems(storeList, key).length > 0
				);
				const sectionHasMember = this.getPanelSectionItems(storeList, 'member').length > 0;
				const hasOtherPreferential = hasActivity || hasBlackCard || sectionHasActivity || sectionHasMember;
				const hasAnyPreferentialData = hasCoupon || hasOtherPreferential;

				// 仅优惠券时显示「领券」；其余有任意优惠数据时显示「优惠」；全部为空不显示
				if (hasCoupon && !hasOtherPreferential) return '领券';
				if (hasAnyPreferentialData) return '优惠';
				return '';
			},
			// 凑单行左侧：仅显示 sections 中 coupon 分组的 items
			getStorePromotionTags(storeList, listIndex) {
				if (!storeList) return [];
				const couponItems = this.getPanelSectionItems(storeList, 'coupon');
				if (!couponItems.length) return [];
				const tags = couponItems.map((item) => {
					// 按需求：仅使用 coupon.items[].cou_name 作为文案
					const text = (item && item.cou_name ? String(item.cou_name).trim() : '');
					return {
						type: 'coupon',
						text
					};
				}).filter(tag => tag.text);
				return tags;
			},
			parseFullReductionItem(item) {
				if (!item) return null;
				let minAmount = parseFloat(item.min_amount);
				let saveAmount = parseFloat(item.act_type_ext_format);
				const ruleText = String(item.rule_text || '');
				if (Number.isNaN(minAmount) || Number.isNaN(saveAmount)) {
					const match = ruleText.match(/满\s*([0-9]+(?:\.[0-9]+)?)\s*元?\s*减\s*([0-9]+(?:\.[0-9]+)?)/);
					if (match) {
						if (Number.isNaN(minAmount)) minAmount = parseFloat(match[1]);
						if (Number.isNaN(saveAmount)) saveAmount = parseFloat(match[2]);
					}
				}
				if (Number.isNaN(minAmount) || minAmount <= 0 || Number.isNaN(saveAmount) || saveAmount <= 0) return null;
				return {
					minAmount,
					saveAmount,
					actId: item.act_id || 0
				};
			},
			// 从 reckon_cartgoods 的 available_favourable 中获取当前店铺的满减规则（act_type=1）
			getStoreReckonManjianRules(storeList) {
				if (!storeList || !this._reckonFavByStore) return [];
				const storeId = storeList.store_id;
				const favList = Array.isArray(this._reckonFavByStore[storeId]) ? this._reckonFavByStore[storeId] : [];
				return favList
					.filter(fav => Number(fav && fav.act_type) === 1)
					.map((fav) => {
						let minAmount = parseFloat(fav.min_amount);
						let saveAmount = parseFloat(fav.act_type_ext || fav.act_type_ext_format);
						const ruleText = String(fav.rule_text || '');
						if ((Number.isNaN(minAmount) || Number.isNaN(saveAmount)) && ruleText) {
							const match = ruleText.match(/满\s*([0-9]+(?:\.[0-9]+)?)\s*元?\s*减\s*([0-9]+(?:\.[0-9]+)?)/);
							if (match) {
								if (Number.isNaN(minAmount)) minAmount = parseFloat(match[1]);
								if (Number.isNaN(saveAmount)) saveAmount = parseFloat(match[2]);
							}
						}
						if (Number.isNaN(minAmount) || minAmount <= 0 || Number.isNaN(saveAmount) || saveAmount <= 0) return null;
						return {
							minAmount,
							saveAmount,
							actId: fav.act_id || 0
						};
					})
					.filter(Boolean)
					.sort((a, b) => a.minAmount - b.minAmount);
			},
			// 凑单行右侧：显示「再选X元，立省Y元」，已满足不显示
			getNextManjianTier(storeList, listIndex) {
				if (!storeList) return null;
				
				// 只有 settlement 数据加载完成后才返回数据，否则返回 null
				if (!this._settlementDataLoaded) return null;
				
				// 只使用后端返回的 settlement 数据，没有数据就返回 null
				const storeId = storeList.store_id || storeList.ru_id;
				const settlement = storeId && this._settlementData && this._settlementData[storeId];
				const fullReductionProgress = settlement && settlement.full_reduction_progress;
				
				if (fullReductionProgress && fullReductionProgress.banner && fullReductionProgress.banner.has_next_tier) {
					// 使用后端真实数据
					const banner = fullReductionProgress.banner;
					return {
						needAmount: banner.need_more || 0,
						saveAmount: banner.save_amount || 0,
						actId: fullReductionProgress.act_id || 0,
						minAmount: fullReductionProgress.next_tier ? fullReductionProgress.next_tier.threshold : 0
					};
				}
				
				// 没有后端数据就返回 null，不显示
				return null;
			},
			
			// 判断是否显示去凑单按钮：如果最后一个满减规则都满足了，就不显示
			shouldShowGatherLink(storeList) {
				if (!storeList) return false;
				
				const storeId = storeList.store_id || storeList.ru_id;
				const settlement = storeId && this._settlementData && this._settlementData[storeId];
				const fullReductionProgress = settlement && settlement.full_reduction_progress;
				
				if (!fullReductionProgress || !fullReductionProgress.rules || !Array.isArray(fullReductionProgress.rules)) {
					return false;
				}
				
				// 获取最后一个规则
				const lastRule = fullReductionProgress.rules[fullReductionProgress.rules.length - 1];
				if (!lastRule) return false;
				
				// 如果最后一个规则的状态是 'reached' 或 'satisfied'，说明都满足了，不显示去凑单
				if (lastRule.status === 'reached' || lastRule.status === 'satisfied') {
					return false;
				}
				
				// 否则显示去凑单按钮
				return true;
			},
			// 商品标签行数据：仅使用当前行 item.goods_benefit_tags，不从同店其他行或 store.goods 兜底
			startFlashSaleTimer() {
				if (this.flashSaleTimer) return;
				this.flashSaleNowTs = Math.floor(Date.now() / 1000);
				this.flashSaleTimer = setInterval(() => {
					this.flashSaleNowTs = Math.floor(Date.now() / 1000);
				}, 1000);
			},
			stopFlashSaleTimer() {
				if (!this.flashSaleTimer) return;
				clearInterval(this.flashSaleTimer);
				this.flashSaleTimer = null;
			},
			getFlashSaleRemainingSeconds(tag, seedKey) {
				if (!tag) return 0;
				if (!this.flashSaleRemainSeedMap || typeof this.flashSaleRemainSeedMap !== 'object') {
					this.$set(this, 'flashSaleRemainSeedMap', {});
				}
				const nowTs = Number(this.flashSaleNowTs) || Math.floor(Date.now() / 1000);
				const endTs = Number(tag.end_timestamp || tag.endTimestamp || 0);
				const remainRaw = Number(tag.remaining_seconds || tag.remainingSeconds || 0);
				const remain = Math.max(0, Math.floor(remainRaw));
				if (endTs > 0) {
					const byEndTs = Math.max(0, Math.floor(endTs - nowTs));
					// 兜底：部分接口 end_timestamp 可能存在时区偏差，若已判到期但 remaining_seconds 仍>0，则按 remaining_seconds 继续倒计时
					if (byEndTs <= 0 && remain > 0) {
						const key = seedKey || `flash_${tag.type || ''}_${tag.sort_order || 0}_${tag.text || ''}`;
						const seed = this.flashSaleRemainSeedMap[key];
						if (!seed) {
							this.$set(this.flashSaleRemainSeedMap, key, { startNowTs: nowTs, startRemain: remain });
							return remain;
						}
						return Math.max(0, seed.startRemain - Math.max(0, nowTs - seed.startNowTs));
					}
					return byEndTs;
				}
				if (remain > 0) {
					const key = seedKey || `flash_${tag.type || ''}_${tag.sort_order || 0}_${tag.text || ''}`;
					const seed = this.flashSaleRemainSeedMap[key];
					if (!seed) {
						this.$set(this.flashSaleRemainSeedMap, key, { startNowTs: nowTs, startRemain: remain });
						return remain;
					}
					return Math.max(0, seed.startRemain - Math.max(0, nowTs - seed.startNowTs));
				}
				return 0;
			},
			formatFlashSaleCountdown(seconds) {
				const total = Math.max(0, Math.floor(seconds || 0));
				const day = Math.floor(total / 86400);
				const hour = Math.floor((total % 86400) / 3600);
				const minute = Math.floor((total % 3600) / 60);
				const second = total % 60;
				const hh = String(hour).padStart(2, '0');
				const mm = String(minute).padStart(2, '0');
				const ss = String(second).padStart(2, '0');
				if (day > 0) return `${day}天 ${hh}:${mm}:${ss}`;
				return `${hh}:${mm}:${ss}`;
			},
			getProductTags(item) {
				if (!item) return [];
				let rawTags = item.goods_benefit_tags;
				if (typeof rawTags === 'string') {
					try {
						rawTags = JSON.parse(rawTags);
					} catch (e) {
						rawTags = [];
					}
				}
				const src = Array.isArray(rawTags) ? rawTags : [];
				const typeMap = {
					coupon: 'coupon',
					newcomer_coupon: 'coupon',
					integral: 'points',
					black_card_price: 'vip',
					no_reason_7d: 'return',
					limited_discount: 'limit',
					flash_sale: 'limit'
				};
				const result = src
					.filter(tag => tag && tag.show !== false)
					.map((tag) => {
						const mappedType = typeMap[tag.type] || 'manjian';
						let text = String(tag.text || '').trim();
						if (tag.type === 'flash_sale') {
							const flashSeedKey = `${item.rec_id || item.goods_id || 'g'}_${tag.sort_order || 0}_${tag.text || ''}`;
							const remain = this.getFlashSaleRemainingSeconds(tag, flashSeedKey);
							// 倒计时结束后，隐藏限时抢标签
							if (remain <= 0) return null;
							const flashLabel = text || '限时抢';
							text = `${flashLabel} | 距结束 ${this.formatFlashSaleCountdown(remain)}`;
						}
						// 优惠券分组若有具体券文案，优先展示第一条券文案
						if (mappedType === 'coupon' && Array.isArray(tag.items) && tag.items.length > 0) {
							const firstItemText = String((tag.items[0] && tag.items[0].text) || '').trim();
							if (firstItemText) text = firstItemText;
						}
						return { type: mappedType, text };
					})
					.filter(t => t && t.text);
				return result;
			},
			// 店铺已选商品金额合计
			getStoreSelectedAmount(storeList, listIndex) {
				if (!storeList || !storeList.new_list || !Array.isArray(this.checkedGoods[listIndex])) return 0;
				let total = 0;
				storeList.new_list.forEach(actItem => {
					(actItem.act_goods_list || []).forEach(item => {
						if (this.checkedGoods[listIndex].includes(item.rec_id)) {
							const price = parseFloat(item.goods_price) || 0;
							const qty = parseInt(item.goods_number) || 0;
							total += price * qty;
						}
					});
				});
				return total;
			},
			// 手机号脱敏显示（如 133****6656）
			maskPhone(phone) {
				if (!phone || typeof phone !== 'string') return '';
				const s = String(phone).replace(/\s/g, '');
				if (s.length >= 11) return s.slice(0, 3) + '****' + s.slice(-4);
				if (s.length >= 7) return s.slice(0, 3) + '****' + s.slice(-2);
				return s;
			},
			// 地址弹窗：单条地址的完整字符串
			getAddressFullAddress(item) {
				if (!item) return '';
				return item.province_name == item.city_name ?
					`${item.province_name || ''}${item.district_name || ''}${item.street_name || ''}${item.address || ''}` :
					`${item.province_name || ''}${item.city_name || ''}${item.district_name || ''}${item.street_name || ''}${item.address || ''}`;
			},
			// 【关键修复】强制显示底部tab，不受页面逻辑影响
			forceShowTabBar() {
				// 方案1：通过事件通知tab组件（最可靠）
				uni.$emit('force-show-tabbar', { page: 'cart' });

				// 方案2：延迟执行直接设置
				setTimeout(() => {
					try {
						// 再次发送事件确保收到
						uni.$emit('force-show-tabbar', { page: 'cart', retry: true });
					} catch (e) {
					}
				}, 200);

				// 方案3：多次重试确保生效
				setTimeout(() => {
					try {
						uni.$emit('force-show-tabbar', { page: 'cart', final: true });
					} catch (e) {
					}
				}, 500);
			},
			buildCartSelectionSnapshot() {
				const keys = [];
				const recMap = {};
				const storeSelectableCounts = [];
				if (!Array.isArray(this.goodsCartList)) {
					return {
						signature: '',
						recMap,
						storeSelectableCounts
					};
				}
				this.goodsCartList.forEach((store, storeIndex) => {
					let selectableCount = 0;
					if (!Array.isArray(this.checkedGoods[storeIndex])) {
						this.$set(this.checkedGoods, storeIndex, []);
					}
					const actList = (store && Array.isArray(store.new_list)) ? store.new_list : [];
					actList.forEach((act, actIndex) => {
						const goodsList = (act && Array.isArray(act.act_goods_list)) ? act.act_goods_list : [];
						goodsList.forEach((item, itemIndex) => {
							const recId = item && item.rec_id != null ? item.rec_id : `unknown_${storeIndex}_${actIndex}_${itemIndex}`;
							const goodsNumber = item && item.goods_number != null ? item.goods_number : 0;
							const productNumber = item && item.product_number != null ? item.product_number : 0;
							const isInvalid = item && (item.is_invalid == 1 || productNumber <= 0);
							keys.push([recId, goodsNumber, productNumber, item && item.is_invalid ? 1 : 0].join(':'));
							recMap[recId] = {
								storeIndex,
								actIndex,
								itemIndex,
								isInvalid
							};
							if (!isInvalid) {
								selectableCount += 1;
							}
						});
					});
					storeSelectableCounts[storeIndex] = selectableCount;
				});
				return {
					signature: keys.sort().join('|'),
					recMap,
					storeSelectableCounts
				};
			},
			resetSelectionArrays() {
				if (!Array.isArray(this.goodsCartList) || this.goodsCartList.length === 0) {
					if (Array.isArray(this.checkedGoods) && this.checkedGoods.length > 0) {
						this.checkedGoods.splice(0, this.checkedGoods.length);
					}
					if (Array.isArray(this.checkedShop) && this.checkedShop.length > 0) {
						this.checkedShop.splice(0, this.checkedShop.length);
					}
					this.checkedAll = false;
					this._globalAllSelectedMode = false;
					return;
				}
				if (Array.isArray(this.checkedGoods) && this.checkedGoods.length > this.goodsCartList.length) {
					this.checkedGoods.splice(this.goodsCartList.length);
				}
				if (Array.isArray(this.checkedShop) && this.checkedShop.length > this.goodsCartList.length) {
					this.checkedShop.splice(this.goodsCartList.length);
				}
				this.goodsCartList.forEach((store, index) => {
					this.$set(this.checkedGoods, index, []);
					this.$set(this.checkedShop, index, false);
					const actList = (store && Array.isArray(store.new_list)) ? store.new_list : [];
					actList.forEach((act) => {
						const goodsList = (act && Array.isArray(act.act_goods_list)) ? act.act_goods_list : [];
						goodsList.forEach((item) => {
							if (item && item.checked) {
								item.checked = false;
							}
						});
					});
				});
				this.checkedAll = false;
				this._globalAllSelectedMode = false;
			},
		handleSelectionAfterFetch() {
			const snapshot = this.buildCartSelectionSnapshot();
			this.cartSelectionSignature = snapshot.signature;
			if (!snapshot.signature) {
				this.resetSelectionArrays();
				this.applySelectionSummaryFromCheckedState();
				clearSavedSelectionState();
				return;
			}
			const saved = readSavedSelectionState();
			if (!saved) {
				this.resetSelectionArrays();
				this.applySelectionSummaryFromCheckedState();
				return;
			}

			this.isRestoringSelection = true;
			this.resetSelectionArrays();
			const perStoreSelectedCounts = new Array(snapshot.storeSelectableCounts.length).fill(0);
			const selectedList = Array.isArray(saved.selectedRecIds) ? saved.selectedRecIds : [];
			const selectedStoreIdSet = new Set((Array.isArray(saved.selectedStoreIds) ? saved.selectedStoreIds : []).map(id => String(id)));
			let restoredCount = 0;

			if (selectedStoreIdSet.size > 0 && Array.isArray(this.goodsCartList)) {
				this.goodsCartList.forEach((store, storeIndex) => {
					if (!store) return;
					const storeId = store.store_id != null ? String(store.store_id) : '';
					if (!storeId || !selectedStoreIdSet.has(storeId)) return;
					if (!Array.isArray(this.checkedGoods[storeIndex])) {
						this.$set(this.checkedGoods, storeIndex, []);
					}
					const actList = Array.isArray(store.new_list) ? store.new_list : [];
					actList.forEach((act) => {
						const goodsList = act && Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
						goodsList.forEach((goodsItem) => {
							if (!goodsItem) return;
							if (goodsItem.is_invalid == 1 || Number(goodsItem.product_number || 0) <= 0) return;
							const recId = goodsItem.rec_id;
							if (!this.checkedGoods[storeIndex].includes(recId)) {
								this.checkedGoods[storeIndex].push(recId);
								restoredCount++;
								perStoreSelectedCounts[storeIndex] += 1;
							}
							goodsItem.checked = true;
						});
					});
				});
			}

			selectedList.forEach((recId) => {
				const meta = snapshot.recMap[recId];
				if (!meta || meta.isInvalid) {
					return;
				}
				const { storeIndex, actIndex, itemIndex } = meta;
				if (!Array.isArray(this.checkedGoods[storeIndex])) {
					this.$set(this.checkedGoods, storeIndex, []);
				}
				const goodsItem = this.goodsCartList[storeIndex]?.new_list?.[actIndex]?.act_goods_list?.[itemIndex];
				if (goodsItem) {
					const normalizedRecId = goodsItem.rec_id;
					if (!this.checkedGoods[storeIndex].includes(normalizedRecId)) {
						this.checkedGoods[storeIndex].push(normalizedRecId);
						restoredCount++;
						perStoreSelectedCounts[storeIndex] += 1;
					}
					goodsItem.checked = true;
				}
			});

			snapshot.storeSelectableCounts.forEach((count, idx) => {
				const selected = perStoreSelectedCounts[idx] || 0;
				const shopChecked = count > 0 && selected === count;
				this.$set(this.checkedShop, idx, shopChecked);
			});

			const allFullySelected = snapshot.storeSelectableCounts.every((count, idx) => {
				if (!count) return true;
				return (perStoreSelectedCounts[idx] || 0) === count;
			});
			this.checkedAll = saved.checkedAll === true && allFullySelected;
			this._globalAllSelectedMode = this.checkedAll === true;

			if (saved.signature !== snapshot.signature && restoredCount > 0) {
				this.saveSelectionState();
			} else if (saved.signature !== snapshot.signature && restoredCount === 0) {
				clearSavedSelectionState();
			}

			this.applySelectionSummaryFromCheckedState();
			this.isRestoringSelection = false;
		},
			saveSelectionState() {
				if (this.isRestoringSelection) {
					return;
				}
				const snapshot = this.buildCartSelectionSnapshot();
				if (!snapshot.signature) {
					clearSavedSelectionState();
					this.cartSelectionSignature = '';
					return;
				}
				const recIds = [];
				if (Array.isArray(this.checkedGoods)) {
					this.checkedGoods.forEach((storeList) => {
						if (Array.isArray(storeList)) {
							storeList.forEach((recId) => {
								const meta = snapshot.recMap[recId];
								if (meta && !meta.isInvalid) {
									recIds.push(recId);
								}
							});
						}
					});
				}
				const uniqueRecIds = Array.from(new Set(recIds));
				const selectedStoreIds = [];
				if (Array.isArray(this.goodsCartList) && Array.isArray(this.checkedShop)) {
					this.goodsCartList.forEach((store, idx) => {
						if (!store || store.store_id == null) return;
						if (this.checkedShop[idx] === true) {
							selectedStoreIds.push(store.store_id);
						}
					});
				}
				writeSavedSelectionState({
					signature: snapshot.signature,
					selectedRecIds: uniqueRecIds,
					checkedAll: this.checkedAll === true,
					selectedStoreIds
				});
				this.cartSelectionSignature = snapshot.signature;
			},
			// 加载更多商品
			loadMoreGoods(storeIndex, storeList, options = {}) {
				var that = this;
				const shouldAutoExpand = !!(options && options.autoExpand);
				
				// 防止重复点击
				if (that.loadingMoreGoods[storeIndex]) {
					return;
				}
				
				// 收集当前店铺已显示的所有商品的 rec_id
				const hasRecIdList = [];
				
				storeList.new_list.forEach(actItem => {
					actItem.act_goods_list.forEach(goods => {
						if (goods.rec_id) {
							hasRecIdList.push(goods.rec_id);
						}
					});
				});
				
				// 如果没有商品，不执行
				if (hasRecIdList.length === 0) {
					return;
				}
				
				// 设置加载状态
				that.$set(that.loadingMoreGoods, storeIndex, true);
				
				// 获取店铺是否已选中
				const isShopChecked = that.checkedShop[storeIndex] || false;
				
				// 生成版本号
				const version = incrementVersion();
				
				const requestParams = {
					warehouse_id: 0,
					area_id: 0,
					district_id: that.regionData && that.regionData.district && that.regionData.district.id ? that.regionData.district.id : '',
					has_rec_id: hasRecIdList.join(','),
					app_version: version,
					ru_id: storeList.store_id || 0,
					isget_more_goods: true
				};
				
				// 返回 Promise，方便在需要时等待加载完成
				return that.$store.dispatch('setCartMoreGoods', requestParams).then(res => {
					let appendedCount = 0;
					if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
						// 找到当前店铺的数据（应该只有一条）
						const storeData = res.data.find(item => item.store_id === storeList.store_id || 
							(item.store_name === storeList.store_name && item.store_id === storeList.store_id));
						
						if (storeData && storeData.new_list && Array.isArray(storeData.new_list)) {
							// 将新数据追加到当前店铺的 new_list
							storeData.new_list.forEach(newActItem => {
								// 查找是否已有相同的 act_id
								const existingActIndex = storeList.new_list.findIndex(
									act => act.act_id === newActItem.act_id
								);
								
								if (existingActIndex >= 0) {
									// 如果已有相同的活动，追加商品到 act_goods_list
									if (newActItem.act_goods_list && Array.isArray(newActItem.act_goods_list)) {
										newActItem.act_goods_list.forEach(newGoods => {
											// 检查是否已存在，避免重复
											const exists = storeList.new_list[existingActIndex].act_goods_list.some(
												g => g.rec_id === newGoods.rec_id
											);
											if (!exists) {
												// 如果店铺已选中，新商品也应该被选中
												if (isShopChecked && newGoods.is_invalid <= 0 && newGoods.product_number > 0) {
													newGoods.checked = true;
													if (!that.checkedGoods[storeIndex].includes(newGoods.rec_id)) {
														that.checkedGoods[storeIndex].push(newGoods.rec_id);
													}
												}
												storeList.new_list[existingActIndex].act_goods_list.push(newGoods);
												appendedCount += 1;
											}
										});
									}
								} else {
									// 如果没有相同的活动，直接添加新的活动
									// 如果店铺已选中，新商品也应该被选中
									if (isShopChecked && newActItem.act_goods_list && Array.isArray(newActItem.act_goods_list)) {
										newActItem.act_goods_list.forEach(newGoods => {
											if (newGoods.is_invalid <= 0 && newGoods.product_number > 0) {
												newGoods.checked = true;
												if (!that.checkedGoods[storeIndex]) {
													that.checkedGoods[storeIndex] = [];
												}
												if (!that.checkedGoods[storeIndex].includes(newGoods.rec_id)) {
													that.checkedGoods[storeIndex].push(newGoods.rec_id);
												}
											}
										});
									}
									storeList.new_list.push(newActItem);
									if (newActItem.act_goods_list && Array.isArray(newActItem.act_goods_list)) {
										appendedCount += newActItem.act_goods_list.length;
									}
								}
							});

							// 仅在用户显式点击“查看更多”时自动展开
							// 程序内部的补全加载（如取消勾选触发）不应改变展开态
							if (shouldAutoExpand && appendedCount > 0) {
								const expandKey = that.getStoreExpandKey(storeList, storeIndex);
								that.$set(that.storeCartExpanded, expandKey, true);
							}
							
							// 更新 ishas_more_goods 状态
							that.$set(storeList, 'ishas_more_goods', storeData.ishas_more_goods || false);
							
							// 触发价格计算
							that.$nextTick(() => {
								that.changeGoods();
							});
						}
					} else {
						// 没有更多数据了
						that.$set(storeList, 'ishas_more_goods', false);
					}
					
					// 清除加载状态
					that.$set(that.loadingMoreGoods, storeIndex, false);
				}).catch(err => {
					that.$set(that.loadingMoreGoods, storeIndex, false);
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				});
			},
			// 确保指定店铺的所有商品都已加载（包括折叠部分）
			async ensureStoreAllGoodsLoaded(storeIndex, storeList) {
				if (!storeList) {
					return;
				}
				const storeId = storeList.store_id;
				if (!storeId) {
					return;
				}

				// 检查 _storeAllLoadedMap 是否存在
				if (this._storeAllLoadedMap === undefined) {
				}

				// 已经加载过全部商品的店铺，直接返回
				if (this._storeAllLoadedMap && this._storeAllLoadedMap[storeId]) {
					return;
				}

				// 后端已经标记没有更多商品
				if (storeList.ishas_more_goods === false) {
					// 确保 _storeAllLoadedMap 存在
					if (this._storeAllLoadedMap === undefined) {
						this._storeAllLoadedMap = {};
					}

					this._storeAllLoadedMap[storeId] = true;
					return;
				}

				// 如果当前正在加载中，就不用再触发
				if (this.loadingMoreGoods[storeIndex]) {
					return;
				}

				try {
					await this.loadMoreGoods(storeIndex, storeList);

					// 再次检查，确保 _storeAllLoadedMap 仍然存在
					if (this._storeAllLoadedMap === undefined) {
						this._storeAllLoadedMap = {};
					}

					this._storeAllLoadedMap[storeId] = true;
				} catch (e) {
					// 即使失败也要确保 _storeAllLoadedMap 存在，以防后续调用
					if (this._storeAllLoadedMap === undefined) {
						this._storeAllLoadedMap = {};
					}
				}
			},
			processCartData(cartList) {
			    // 使用更高效的数据处理方式
			    const shopArr = [];
			    const shopArr2 = [];
			    
			    cartList.forEach((store, index) => {
			      let shopState = false;
			      let hasInvalidGoods = false;
			      
			      // 使用更简洁的方式检查商品状态
			      for (const act of store.new_list) {
			        for (const goods of act.act_goods_list) {
			          if (goods.store_count > 0) shopState = true;
			          if (goods.is_invalid > 0) hasInvalidGoods = true;
			          // 找到第一个有效商品后就可以跳出内层循环
			          if (shopState && hasInvalidGoods) break;
			        }
			        if (shopState && hasInvalidGoods) break;
			      }
			      
			      shopArr[index] = [shopState];
			      shopArr2[index] = hasInvalidGoods;
			    });
			    
			    this.shopStore = shopArr;
			    this.shopInvalidArr = shopArr2;
			  },
			filterInvalidGoodsRecIds(list) {
				const recIdArr = [];

				if (!Array.isArray(list)) {
					return recIdArr;
				}

				list.forEach((store, storeIndex) => {
					// 优先遍历 new_list.act_goods_list
					if (Array.isArray(store.new_list)) {
						store.new_list.forEach((act, actIndex) => {
							if (Array.isArray(act.act_goods_list)) {
								act.act_goods_list.forEach((goodsItem, goodsIndex) => {
									if (goodsItem.is_invalid === 1) {
										recIdArr.push(goodsItem.rec_id);
									}
								});
							}
						});
					} else if (Array.isArray(store.goods)) { // 兼容旧结构
						store.goods.forEach((goodsItem, goodsIndex) => {
							if (goodsItem.is_invalid === 1) {
								recIdArr.push(goodsItem.rec_id);
							}
						});
					} else {
					}
				});

				return recIdArr;
			},
			async handleData(list, silent = false) {
				let that = this;

				if (!list || !Array.isArray(list) || list.length === 0) {
					if (!silent) {
						uni.hideLoading();
						uni.showToast({ title: '购物车数据异常', icon: 'none' });
					}
					return;
				}

				const val = await this.filterInvalidGoodsRecIds(list);

				if (!val || val.length === 0) {
					if (!silent) {
						uni.hideLoading();
						uni.showToast({ title: '没有失效商品需要清理', icon: 'none', duration: 2000 });
					}
					return;
				}

				that.$store.dispatch('setCartInvalidGoodsDelete', {}).then(res => {
					if (res.error == 0) {

						// 本地过滤所有失效商品（包括折叠的）
						const filteredList = that.goodsCartList.map((store, storeIndex) => {
							const copy = { ...store };

							// 处理 new_list.act_goods_list（包含所有商品，包括折叠的）
							if (Array.isArray(copy.new_list) && copy.new_list.length > 0) {
								const actList = copy.new_list.map((act, actIndex) => {
									const actCopy = { ...act };
									if (Array.isArray(actCopy.act_goods_list)) {
										// 过滤掉所有失效商品（无论是否折叠）
										actCopy.act_goods_list = actCopy.act_goods_list.filter(
											g => g && !val.includes(g.rec_id)
										);
									}
									return actCopy;
								}).filter(act => act.act_goods_list && act.act_goods_list.length > 0);

								copy.new_list = actList;
							}

							// 兼容旧结构：如果有 goods 数组，也一并过滤
							if (Array.isArray(copy.goods)) {
								copy.goods = copy.goods.filter(g => g && !val.includes(g.rec_id));
							}

							return copy;
						}).filter((store, storeIndex) => {
							// 过滤掉空店铺（没有商品了）
							const hasGoods = (store.new_list && store.new_list.length > 0) ||
											 (store.goods && store.goods.length > 0);
							return hasGoods;
						});

						that.$store.commit('goodsCartList', { data: filteredList, preserveSelection: true });

						// 使用 $nextTick 确保 Vue 响应式系统已更新视图
						that.$nextTick(() => {
							// 使用 that.goodsCartList（computed属性）而不是 filteredList（本地变量），确保 Vue 响应式系统正确更新视图
							const currentList = Array.isArray(that.goodsCartList) ? that.goodsCartList : [];

							// 确保 checkedShop 和 checkedGoods 数组长度与新的 currentList 一致
							if (Array.isArray(that.checkedShop) && that.checkedShop.length > currentList.length) {
								that.checkedShop.splice(currentList.length);
							}
							if (Array.isArray(that.checkedGoods) && that.checkedGoods.length > currentList.length) {
								that.checkedGoods.splice(currentList.length);
							}

							// 清理选中状态：从 checkedGoods 中移除所有失效商品的 rec_id
							val.forEach(recId => {
								that.checkedGoods.forEach((goodsList, storeIndex) => {
									if (Array.isArray(goodsList)) {
										const index = goodsList.indexOf(recId);
										if (index > -1) {
											goodsList.splice(index, 1);
										}
									}
								});
							});

							// 检查并更新店铺选中状态（如果店铺下所有商品都被删除，取消店铺选中）
							currentList.forEach((store, storeIndex) => {
								if (Array.isArray(that.checkedShop) && that.checkedShop[storeIndex] === true) {
									// 检查该店铺是否还有有效商品
									let hasValidGoods = false;
									const actList = Array.isArray(store.new_list) ? store.new_list : [];
									actList.forEach(act => {
										const goodsList = Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
										goodsList.forEach(g => {
											if (g && g.is_invalid != 1 && g.product_number > 0) {
												hasValidGoods = true;
											}
										});
									});

									if (!hasValidGoods && Array.isArray(that.checkedShop)) {
										that.checkedShop.splice(storeIndex, 1, false); // 使用 splice 触发响应式更新
									}
								}
							});

							// 更新 lastRecId 和缓存
							const lastRecId = that.calculateLastRecId(currentList);
							that.lastRecId = lastRecId;

							if (that.$isLogin && that.$isLogin()) {
								that.saveCartCache(currentList, lastRecId);
							}

							if (!silent) {
								uni.hideLoading()
								uni.showToast({
									title: that.$t('lang.delete_success'),
									icon: 'success'
								})
							}

							that.changeGoods();
						});
					} else {
						if (!silent) {
							uni.hideLoading();
							uni.showToast({ title: that.$t('lang.delete_fail'), icon: 'fail' })
						}
					}
				}).catch(err => {
					if (!silent) {
						uni.hideLoading();
						uni.showToast({ title: that.$t('lang.delete_fail'), icon: 'fail' });
					}
				});
			},
			clearInvalidProduct(list) {
				let that = this;

				uni.showModal({
					content: this.$t('lang.clear_invalid_product'),
					success: function(res) {
						that.scrollLeft = 1;
						if (res.confirm) {
							uni.showLoading({ title: '处理中~', mask: true });
							that.handleData(list);
						}
					}
				});
			},
			// 根据结算接口缓存的数据，判断某个活动是否已经有可领取的赠品
			isActGiftAvailable(actItem) {
				if (!actItem || !actItem.act_id) {
					console.log('[cart] isActGiftAvailable: actItem 无效 =>', actItem);
					return false;
				}
				const actId = actItem.act_id;
				const map = this._reckonGiftByAct || {};
				const list = map[actId];
				const hasGift = Array.isArray(list) && list.length > 0;
				console.log('[cart] isActGiftAvailable: act_id =', actId,
					' 对应赠品列表 =', list,
					' 结果 =', hasGift);
				return hasGift;
			},
			oneMore(item) {
				
				this.oneMoreList(item.goods_id, item.goods_attr_id);

				this.oneMoreGoodsDetail = item;
				this.$refs['goodsattr'].open();
			
			},
			oneMoreList(id, attrId) {
				uni.request({
					url: this.websiteUrl + '/api/goods/goodsattrlist',
					method: 'POST',
					data: {
						goods_id: id,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
					
						if (res.data.data) {
							this.goodsDetail = res.data.data;
							this.currentSkuInfo(attrId, this.goodsAttr);
						}
					}
				})
			},

			// onemore  
			// 生成SKU映射表
			generateSkuMap(targetKey) {
				if (this.goodsDetail && this.goodsDetail.attr_pn_list) {
					//     return this.goodsDetail.attr_pn_list.reduce((map, item) => {
					//         const key = item.key
					//         map[key] = {
					//           ...item.value,
					//           product_price: Number(item.value.product_price),
					//           product_number: Number(item.value.product_number)
					//         }
					//         return map
					// 
					//       }, {})
					const matchedItem = this.goodsDetail.attr_pn_list.find(item => {
						return item.key == targetKey;
					});
					
					return matchedItem ? matchedItem.value : {};
				}

			},
			// 确认添加
			async onAddCartClicked(type) {
				if (type == 0 && Object.keys(this.history).length === 0) {
					uni.showToast({
						title: this.$t('lang.goods_no_zero'),
						icon: 'none'
					});
					return;
				}
				if ((type == 0 || type == 10) && this.totalQuantity < this.goodsDetail.minimum) {
					uni.showToast({
						// title: this.$t('the_goods')this.goodsDetail.minimumthis.$t('jian')this.$t('label_minimum_2'),
						title: `${this.$t('lang.the_goods')}${this.goodsDetail.minimum}${this.$t('lang.jian')}${this.$t('lang.label_minimum_2')}`,
						icon: 'none'
					});
					return;
				}


				if (type == 10 && Object.keys(this.history).length === 0) {
					uni.showToast({
						title: this.$t('lang.fill_goods_number'),
						icon: 'none'
					});
					return;
				}
				var that = this
				var newAttr = []
				const cartAddAppVersion = incrementVersion()
				that.addCartClass = false;
			

				if (that.attr.length > 0) {
					// newAttr = that.seleceGoodsAtrrArray;
					const map = new Map(Object.entries(that.history));

					newAttr = Array.from(map.entries()).map(([key, value]) => {
						// 分割键并判断是否需要截断
						const parts = key.split('_');
						const shouldTruncate = parts.length > 1 && parts.slice(1).every(p => p === '0');
						// 兼容历史包里可能出现的拼写错误变量名（shouldTruncfate）
						const shouldTruncfate = shouldTruncate;
						return {
							spec_id: shouldTruncate ? [parseInt(parts[0], 10)] : parts.map(p => parseInt(p,
								10)),
							num: value
						};
					});
				}

				//判断是否绑定手机号
				if (!uni.getStorageSync('bindMobilePhone') && that.$isLogin()) {
					let roles = await that.$store.dispatch('setUserId', {
						type: true
					});
					if (roles.status == 'success') {
						if (!roles.data.mobile_phone) {
							uni.showModal({
								content: that.$t(
									'lang.is_user_bind_mobile_phone'
								), //is_user_bind_mobile_phone 您的账号尚未绑定手机,请去绑定手机号！
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pagesB/accountsafe/bindphone/bindphone?delta=1'
										});
									}
								}
							});

							return false
						}
					}
				}

				uni.showLoading({
					title: that.$t('lang.loading_submit'), //loading_submit 提交中...
					mask: true
				});


				//获取购物车数量
				// add 接口



				that.$store.dispatch('setAddCartV1', {
					goods_id: that.oneMoreGoodsDetail.goods_id,
					num: that.totalQuantity,
					spec: newAttr,
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0',
					rec_type: type,
					app_version: cartAddAppVersion,
					// cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
					cou_id: ''
				}).then(res => {
					uni.hideLoading();

					const isStatusSuccess = !!(res && res.status === 'success');
					const isDataSuccess = !!(res && res.data && Number(res.data.error) !== 1);
					const isSuccess = isStatusSuccess || isDataSuccess;

					if (!isSuccess) {
						uni.showToast({
							title: (res && res.data && res.data.msg) || (res && res.msg) || '加入失败',
							icon: 'none',
							duration: 500
						});
						return;
					} else {
						// 1）记录本次规格加购的临时增量，只影响当前凑单弹窗会话
						try {
							const delta = Number(that.totalQuantity || 0);
							const currentRuId = String(
								(this.coudanPopupStore && (this.coudanPopupStore.ru_id || this.coudanPopupStore.store_id || this.coudanPopupStore.cart_ru_id)) || ''
							);
							const key = `${currentRuId}_${that.oneMoreGoodsDetail.goods_id}`;
							const prev = this.coudanTempDeltaMap && this.coudanTempDeltaMap[key];
							const prevNum = Number(prev || 0);
							const next = (Number.isNaN(prevNum) ? 0 : prevNum) + (Number.isNaN(delta) ? 0 : delta);
							this.$set(this.coudanTempDeltaMap, key, next);
						} catch (e) {
							// 临时增量异常不影响正常加购流程
						}

						// 2）静默刷新购物车数据，保持其它区域数量同步
						this.goodsList(true, true).catch(() => {});
						this.changeGoods(true);

						// 3）提示并关闭规格弹窗
						uni.showToast({
							title: that.$t('lang.add_success_1'),
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
					}

				});
			},
			// 获取当前SKU信息
			currentSkuInfo(specId, attr, num) {
			
				// let skuKey 
				// if(num == 1) {
				// 	skuKey = this.generateSkuKey(specId,attr ? attr.length : null)
				// }else {
				let skuKey = this.generateSkuKey(specId, attr ? attr.length : null)
				// }

				return this.generateSkuMap([skuKey]) || null
			},
			// 获取规格价格
			// getSpecPrice(specId) {
			// 	const skuInfo = this.currentSkuInfo(specId)
			// 	return skuInfo ? skuInfo.product_price.toFixed(2) : '0.00'
			// },

			// 按钮修改商品数量
			changeGoodsNum(delta, res) {

				// res = 0 时是只有一个规格没有其他规格直接增加数量计算商品价格
				let key = (this.selectedColor == res.id) ? this.generateSkuKey(res.id, 1) : this.generateSkuKey(res.id)
				// let key = `${this.selectedColor}_${res.id}`

				//新增逻辑
				const currentCount = this.history[key] || 0
				// 库存用于校验判断
				const maxStock = this.currentSkuInfo(key)?.product_number || 0
				let newCount = Math.max(currentCount + delta, 0)
				if (newCount > maxStock && maxStock != 0) {
					this.showToast(`${this.$t('lang.inventory_quantity_exceeded')}`);
					newCount = maxStock
					this.onCurrentCountNum = maxStock
				}
				this.onCurrentCountNum = newCount
				if (newCount == 0) {
					this.$delete(this.history, key)
				} else {
					this.$set(this.history, key, newCount)
				}
				this.calculateTotals(res)
				if (delta == 1) {
					if (this.goodsNum < this.xiangouNum) {
						this.goodsNum++;
					}
				} else if (delta == -1) {
					if (this.goodsNum < this.xiangouNum) {
						this.goodsNum--;
					}
				}
			},

			// 库存是否为空
			isStockEmpty(specId) {
				const currentCount = this.getCurrentCount(specId)
				const stock = this.currentSkuInfo(specId)?.product_number || 0
				return currentCount >= stock
			},

			// 规格是否禁用
			isSpecDisabled(specId) {
				const skuInfo = this.currentSkuInfo(specId)
				return !skuInfo || skuInfo.product_number <= 0
			},

			// 生成SKU键
			generateSkuKey(specId, num) {
				// 单规格多数据的length
				if (this.goodsAttr && this.goodsAttr[0].attr_key) {


					const innerLengths = this.goodsAttr[0].attr_key.length;
					// 根据规格数组长度判断   如果是单规格
					if (this.attrLength <= 1 && innerLengths <= 1) {
						// 如果是单规格 但数据，直接用默认选取的
						return `${this.selectedColor}`
					} else if (this.attrLength <= 1 && innerLengths > 1) {
						// 如果是单规格多数据用当前选中的
						return `${specId}`
					} else {
						// 多规格多数据
						return `${this.selectedColor}_${specId}`
					}
					// return `${specId}_${this.selectedColor}`
				}
			},
			// 是否是最后一个规格维度（用于多规格弹窗渲染）
			isLastItem(index) {
				return Array.isArray(this.goodsAttr) && index === (this.goodsAttr.length - 1)
			},

			// 勾选商品属性（从凑单spec_list复用到购物车规格弹窗）
			// res: 当前attrItem（value项），val: 当前attr维度（group项）
			selectGoodsAttr(res, val, num) {
				if (!res || !val) return
				const clickedId = Number(res.id)
				if (Number.isNaN(clickedId)) return

				// 确保数组存在（Vue2里这里不做声明也可能导致模板 includes 报错）
				if (!Array.isArray(this.seleceGoodsAtrrArray)) this.seleceGoodsAtrrArray = []
				if (!this.attrLength) this.attrLength = (this.goodsDetail && this.goodsDetail.attr && this.goodsDetail.attr.length) || 0

				// 单规格：skuKey 一般就是 clickedId
				if (this.attrLength <= 1) {
					this.selectedColor = clickedId
					this.seleceGoodsAtrrArray = [clickedId]
					this.setSkuSelectionByKey(String(clickedId))
					return
				}

				const isFirstDim = val.attr_type === 1 // 本地映射时确保只有第一维 attr_type=1

				if (isFirstDim) {
					const newColorId = clickedId
					// 尝试沿用上一次第二维选择；若组合无库存则兜底找第一个有库存组合
					let otherId = this.seleceGoodsAtrrArray.length > 1 ? Number(this.seleceGoodsAtrrArray[1]) : null

					if (otherId != null) {
						const candidateKey = `${newColorId}_${otherId}`
						const stock = Number(this.getSkuValueByKey(candidateKey)?.product_number || 0)
						if (!(stock > 0)) otherId = null
					}

					if (otherId == null) {
						const pnList = (this.goodsDetail && this.goodsDetail.attr_pn_list) || []
						const found = pnList.find(row => {
							if (!row || row.key == null) return false
							const keyStr = String(row.key)
							if (!keyStr.startsWith(`${newColorId}_`)) return false
							return Number(row.value?.product_number || 0) > 0
						})
						if (found && found.key != null) {
							const parts = String(found.key).split('_')
							otherId = Number(parts[1])
						}
					}

					if (otherId == null || Number.isNaN(otherId)) {
						// 无可用组合：清空历史，避免误加购
						this.selectedColor = newColorId
						this.seleceGoodsAtrrArray = [newColorId]
						this.history = {}
						this.totalQuantity = 0
						this.totalPrice = 0
						return
					}

					this.selectedColor = newColorId
					this.seleceGoodsAtrrArray = [newColorId, otherId]
					this.setSkuSelectionByKey(`${newColorId}_${otherId}`)
				} else {
					// 点击的是第二维/最后一维
					const colorId = Number(this.selectedColor || (this.seleceGoodsAtrrArray[0]))
					if (Number.isNaN(colorId)) return
					this.selectedColor = colorId
					this.seleceGoodsAtrrArray = [colorId, clickedId]
					this.setSkuSelectionByKey(`${colorId}_${clickedId}`)
				}
			},

			// 输入框数量变化（只支持当前选中sku的数量更新）
			changeGoodsNumByInput(e, attrItem, group) {
				if (!attrItem) return
				const raw = e && e.detail ? e.detail.value : (e && e.target ? e.target.value : '')
				const inputNumber = Number(raw)
				if (Number.isNaN(inputNumber) || inputNumber < 0) {
					// 非法输入，直接重算一次当前sku数量
					this.calculateTotals()
					return
				}

				const specId = Number(attrItem.id)
				if (Number.isNaN(specId)) return
				const key = this.generateSkuKey(specId)
				const skuInfo = this.currentSkuInfo(specId, this.goodsAttr, 1)
				const maxStock = Number(skuInfo?.product_number || 0)

				// 库存为0时，不允许设置为大于0
				if (maxStock === 0 && inputNumber > 0) {
					uni.showToast({ title: this.$t('lang.inventory_quantity_exceeded'), icon: 'none' })
					return
				}

				const newCount = Math.min(inputNumber, maxStock || inputNumber)
				if (newCount <= 0) {
					this.$delete(this.history, key)
				} else {
					this.$set(this.history, key, newCount)
				}
				this.calculateTotals(attrItem)
			},

			// 从 attr_pn_list 的 key 初始化选中sku（并写入 history）
			setSkuSelectionByKey(skuKey) {
				if (!skuKey) return

				const skuKeyStr = String(skuKey)
				const parts = skuKeyStr.split('_').map(p => Number(p)).filter(n => !Number.isNaN(n))
				if (parts.length === 0) return

				if (this.attrLength <= 1) {
					this.selectedColor = parts[0]
					this.seleceGoodsAtrrArray = [parts[0]]
				} else {
					this.selectedColor = parts[0]
					// 这里 cart.vue 的 generateSkuKey 只组合到前两维，按 key 前两段渲染即可
					this.seleceGoodsAtrrArray = parts.length >= 2 ? [parts[0], parts[1]] : [parts[0]]
				}

				// 清空并写入当前sku数量（用于确认添加）
				this.history = {}
				const skuVal = this.getSkuValueByKey(skuKeyStr)
				const maxStock = Number(skuVal?.product_number || 0)
				const minLimit = Number(this.goodsDetail?.minimum || 1)

				// 默认至少填入 minLimit，但不超过库存
				let count = minLimit
				if (maxStock > 0) count = Math.min(count, maxStock)
				if (maxStock === 0) count = 0

				if (count > 0) {
					this.$set(this.history, skuKeyStr, count)
				} else {
					this.totalQuantity = 0
					this.totalPrice = 0
				}

				this.calculateTotals(1) // 入参不重要，只要不是 0 即走 generateSkuMap
			},

			// 从当前 goodsDetail.attr_pn_list 按 key 找 sku value
			getSkuValueByKey(skuKey) {
				const pnList = (this.goodsDetail && this.goodsDetail.attr_pn_list) || []
				const row = pnList.find(item => String(item && item.key) === String(skuKey))
				return row ? row.value : null
			},

			//输入框实时显示用户增加的数量
			getCurrentCount(res) {
				if (this.selectedColor) {
					this.skuType = true;
				
				}
			
				// let key = this.selectedColor == res.id ? `${this.selectedColor}` : `${this.selectedColor}_${res.id}`
				let key = this.generateSkuKey(res.id)
				return this.history[key] || 0;
			},

			changeCount(specId) {
				const key = `${this.selectedColor}_${specId.id}`
				const currentCount = this.history[key] || 0
				const newCount = Math.max(currentCount, 0)

				if (newCount === 0) {
					this.$delete(this.history, key)
				} else {
					this.$set(this.history, key, newCount)
				}

				this.calculateTotals()
			},

			calculateTotals(res) {
				// 计算总数量
				this.totalQuantity = Object.values(this.history).reduce((sum, num) => sum + num, 0)
				// 当只有一个规格项的时候 res = 0 多项和单项 页面展示不同处理不同
				this.totalPrice =
					(res == 0) ? Object.keys(this.history).reduce((sum, key) => {
						return sum + (parseFloat(this.goodsDetail.shop_price) || 0) * this.history[key]
					}, 0) :
					Object.entries(this.history).reduce((total, [skuKey, quantity]) => {
						const price = this.generateSkuMap([skuKey])?.product_price || 0
						return total + (Number(price) * quantity)
					}, 0)
			},

			getColorTotal(colorId) {
				return Object.keys(this.history).reduce((sum, key) => {
					if (key == colorId) {
						sum += Number(this.history[key])
					}
					if (key.startsWith(colorId + '_')) {

						sum += Number(this.history[key])
					}
					return sum
				}, 0)
			},
			// 22222

			//输入框实时显示用户增加的数量
			getCurrentCount(res) {
				if (this.selectedColor) {
					this.skuType = true;
				
				}
				
				// let key = this.selectedColor == res.id ? `${this.selectedColor}` : `${this.selectedColor}_${res.id}`
				let key = this.generateSkuKey(res.id)
				return this.history[key] || 0;
			},

			// one more end 
			handelDetailCouponClose() {
				this.detailCoupon = false;
			},
			handelDetailCoupon() {
				this.detailCoupon = !this.detailCoupon;
			},
			couponLink(id) {
				uni.navigateTo({
					url: '/pagesD/goodslist/goodslist?cou_id=' + id
				})
			},
			onerrorImage(goodsGuessList, index) {
				this[goodsGuessList][index].goods_thumb = this.placImg
			},
			showEvery() {
			  // 【方案1修复】onShow 中已经处理了缓存恢复和loading3状态设置
			  // 这里只需要执行数据加载，loading3的状态由onShow统一管理
			  const token = uni.getStorageSync('token');
			  const isLoggedIn = token && token !== '';
				  const cache = isLoggedIn ? this.loadCartCache() : null;
				  const hasCache = !!cache;
			  // 注意：这里只用于判断是否有数据，不用于判断是否有缓存
			  // 因为onShow已经区分了"有缓存"和"有数据"
			  const hasDataInCache = cache && cache.goodsCartList && cache.goodsCartList.length > 0;
			  
			  // loading3 的状态已在 onShow 中正确设置，这里不需要修改
			  // onShow中：有缓存（包括空数组）时已设置为false，无缓存时已设置为true
			  
			  const shouldSkipGoodsList = this._skipShowEveryGoodsListOnce === true;
			  if (shouldSkipGoodsList) {
			    this._skipShowEveryGoodsListOnce = false;
			  }
			  const tasks = [this.goodsGuessHandle(1)];
			  if (!shouldSkipGoodsList) {
			    tasks.unshift(this.goodsList(false, hasCache));
			  }

			  // 并行执行独立请求
				  Promise.all(tasks).then(() => {
			  }).finally(() => {
			    // 【方案1修复】检查数据状态，确保loading3正确关闭
			    // 注意：onShow已经根据缓存状态设置了loading3，这里只需要确保最终状态正确
			    const hasData = this.goodsCartList && this.goodsCartList.length > 0;

			    // 如果有数据，延迟关闭loading确保渲染完成
			    if (hasData) {
			      // 使用nextTick + setTimeout确保Vue渲染完成后再隐藏骨架屏
			      this.$nextTick(() => {
			        setTimeout(() => {
			          this.loading3 = false;
			        }, 50); // 给Vue足够的时间渲染数据
			      });
			    } else {
			      // 【核心修复】无数据时，如果onShow中已经设置了loading3=false（有缓存），这里不需要修改
			      // 如果onShow中设置了loading3=true（无缓存），这里需要关闭以显示空购物车提示
			      // 但为了安全起见，统一关闭loading3
			      this.loading3 = false;
			    }
			    this.dataLoading = false;
			  }).catch(err => {
			    // 捕获错误，确保 loading 状态被正确关闭
			    this.loading3 = false;
			    this.dataLoading = false;
			  });
			  
			  // 延迟加载猜你喜欢
			  setTimeout(() => {
				 this.getAddressList()
			      this.vipmessage();
			  }, 1000);
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
				this.regionShow = false
			},

			changeAddressRadio(res) {
			
				let address = res.province_name == res.city_name ?
					`${res.province_name}${res.district_name}${res.street_name}${res.address}` :
					`${res.province_name}${res.city_name}${res.district_name}${res.street_name}${res.address}`;

				let o = {
					province: {
						id: res.province,
						name: res.province_name
					},
					city: {
						id: res.city,
						name: res.city_name
					},
					district: {
						id: res.district,
						name: res.district_name
					},
					street: {
						id: res.street,
						name: res.street_name
					},
					regionSplic: address
				}

				//替换mixins/form-processing this.regionOptionDate
				this.regionSplic = address;
				this.regionData = o
				//选中的收货地址id
				this.addressRadio = res.id;

				this.iSaddress = res.id;
		
				//切换收货地址清除驿站
				uni.removeStorageSync('leader_id');

				this.$store.dispatch('setChangeConsignee', {
					address_id: res.id
				}).then(res => {
				
				})

				// this.$store.dispatch('setRegion', {
				// 	region: res.province,
				// 	level: 2
				// })
				// this.$store.dispatch('setRegion', {
				// 	region: res.city,
				// 	level: 3
				// })
				// this.$store.dispatch('setRegion', {
				// 	region: res.district,
				// 	level: 4
				// })
				// this.$store.dispatch('setRegion', {
				// 	region: res.street,
				// 	level: 5
				// })
				uni.setStorageSync('regionData', o)

				//关闭收货地址弹窗
				this.closePop('address');
				this.showEvery()
			},
			selectOtherAddress() {
				var that = this
				that.currAddressSwiper = 1;
			},
			// 显示底部弹框
			showPopup(res) {
				this.$refs[res].open()

				// if (res == 'address') {
				//   // 先隐藏底部导航

				// }
			},
			//选中其他地址
			getRegionShow() {
				this.addressRadio = '';

				//关闭弹窗
				this.regionShow = false;
				this.closePop('address');
			},
			// 获取收货地址
			async getAddressList() {
				const {
					data,
					status
				} = await this.$store.dispatch('getuserAddressList');
				if (status !== 'success') return;
				const nextList = Array.isArray(data) ? data : [];
				const currentSign = this.buildAddressListSignature(this.addressList);
				const nextSign = this.buildAddressListSignature(nextList);
				if (currentSign !== nextSign) {
					this.applyAddressListState(nextList, true);
				} else if (!this.regionData || !this.regionData.district || !this.regionData.district.id) {
					this.applyAddressListState(nextList, true);
				}
				this.saveAddressCache(nextList);


			},
			// 获取地区数据
			async getRegionListData(region = 1, level = 1) {
				this.regionList = [];
				const {
					data
				} = await this.$store.dispatch('getRegionList', {
					region: region,
					level: level
				});
				if (Array.isArray(data)) this.regionList = data;
			},
			togetlocation() {
				var that = this
				that.$refs['address'].close()
				uni.navigateTo({
					url: '/pagesB/address/addressEdit'
				})
				this.regionShow = false;
				return;
				uni.getLocation({
					geocode: true, // 返回经纬度
					success: function(loction) {
						// 将经纬度转换为城市数据
						uni.request({
							url: 'https://restapi.amap.com/v3/geocode/regeo',
							method: 'GET',
							data: {
								key: '3d1780255f066c2302c0073247c30082',
								location: loction.longitude + ',' + loction.latitude
							},
							success: (resda) => {
							
								var a = resda.data.regeocode.addressComponent
								if (a.city.length == 0) {
								} else {
								}
								uni.request({
									url: 'https://www.ok9288.com/api/misc/getAddressInfo',
									method: 'GET',
									header: {
										'Content-Type': 'application/json',
									},
									data: {
										towncode: resda.data.regeocode.addressComponent
											.towncode,
									},
									success: (res1) => {
										
										if (res1.statusCode == 200) {
											

											let o = {
												province: {
													id: res1.data.province,
													name: res1.data.province_name
												},
												city: {
													id: res1.data.city,
													name: res1.data.city_name
												},
												district: {
													id: res1.data.district,
													name: res1.data.district_name
												},
												street: {
													id: res1.data.street,
													name: res1.data.street_name
												},
												regionSplic: res1.data.regionSplic
											}

											//替换mixins/form-processing this.regionOptionDate
											that.regionSplic = o;

											//选中的收货地址id
											that.addressRadio = '';

											that.iSaddress = '';
											//切换收货地址清除驿站
											uni.removeStorageSync('leader_id');


											// that.$store.dispatch('userAddressDefault',{
											// 	address_id:''
											// })

											that.$store.dispatch('setRegion', {
												region: res1.data.street,
												level: 5
											})
											uni.setStorageSync('regionData', o)

											//关闭收货地址弹窗
											that.closePop('address');
										}
									}
								})

							},
							fail: (err) => {
								
							}
						})
					}
				})
			},
			// 会员信息
			vipmessage() {
				var that = this
				uni.request({
					url: this.websiteUrl + '/api/user/affiliate_info',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						
						for (var i = 0; i < res.data.data.user_rank_rights_list.length; i++) {
							for (var j = 0; j < res.data.data.user_rank_rights_list[i].rights_configure
								.length; j++) {
								if (res.data.data.user_rank_rights_list[i].rights_configure[j].name ==
									'user_discount') {
									that.affiliate_infovalue = res.data.data.user_rank_rights_list[i]
										.rights_configure[j].value
								}
							}
						}
					}
				})

				uni.request({
					url: that.websiteUrl + '/api/user/profile',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						that.userInfo = data ? data : ''
					},
					fail: (err) => {
					
					}
				})
			},
		initData() {
			var that = this
			// 下拉刷新时，保留缓存（保留选中状态），强制全量加载更新数据
			that._isPullRefreshing = true;
			that.goodsList(true).finally(() => {
				that._isPullRefreshing = false;
				uni.stopPullDownRefresh();
			});
		},
			//购物车列表
			// ========== 购物车缓存相关方法 ==========
			/**
			 * 生成缓存 key（基于用户ID）
			 */
			getAddressCacheKey() {
				const userId = uni.getStorageSync('user_id') || '';
				return `cart_address_cache_${userId}`;
			},
			buildRegionDataFromAddress(addr) {
				if (!addr) return {};
				return {
					province: {
						id: addr.province,
						name: addr.province_name
					},
					city: {
						id: addr.city,
						name: addr.city_name
					},
					district: {
						id: addr.district,
						name: addr.district_name
					},
					street: {
						id: addr.street,
						name: addr.street_name
					},
					regionSplic: addr.regionSplic || ''
				};
			},
			normalizeAddressText(addr) {
				if (!addr) return '请选择';
				return addr.province_name == addr.city_name ?
					`${addr.province_name || ''}${addr.district_name || ''}${addr.street_name || ''}${addr.address || ''}` :
					`${addr.province_name || ''}${addr.city_name || ''}${addr.district_name || ''}${addr.street_name || ''}${addr.address || ''}`;
			},
			buildAddressListSignature(list) {
				const safeList = Array.isArray(list) ? list : [];
				const normalized = safeList.map(item => ({
					id: item && item.id ? String(item.id) : '',
					is_checked: item && item.is_checked ? 1 : 0,
					province: item && item.province ? String(item.province) : '',
					city: item && item.city ? String(item.city) : '',
					district: item && item.district ? String(item.district) : '',
					street: item && item.street ? String(item.street) : '',
					address: item && item.address ? String(item.address) : '',
					mobile: item && item.mobile ? String(item.mobile) : '',
					tel: item && item.tel ? String(item.tel) : '',
					consignee: item && item.consignee ? String(item.consignee) : '',
					name: item && item.name ? String(item.name) : ''
				}));
				return JSON.stringify(normalized);
			},
			applyAddressListState(nextList, syncRegionStorage = true) {
				const list = Array.isArray(nextList) ? nextList : [];
				this.addressList = list;
				if (list.length === 0) {
					this.regionSplic = '请选择';
					this.regionData = {};
					return;
				}
				const defaultAddr = list.find(item => item && item.is_checked == 1) || list[0];
				this.regionSplic = this.normalizeAddressText(defaultAddr);
				this.regionData = this.buildRegionDataFromAddress(defaultAddr);
				if (syncRegionStorage) {
					uni.setStorageSync('regionData', this.regionData);
				}
			},
			loadAddressCache() {
				try {
					const key = this.getAddressCacheKey();
					const raw = uni.getStorageSync(key);
					if (!raw) return null;
					const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
					if (!parsed || !Array.isArray(parsed.addressList)) return null;
					return parsed;
				} catch (e) {
					return null;
				}
			},
			saveAddressCache(addressList) {
				try {
					const key = this.getAddressCacheKey();
					uni.setStorageSync(key, JSON.stringify({
						addressList: Array.isArray(addressList) ? addressList : [],
						timestamp: Date.now()
					}));
				} catch (e) {}
			},
			restoreAddressCache() {
				const cache = this.loadAddressCache();
				if (!cache || !Array.isArray(cache.addressList)) return false;
				if (cache.addressList.length === 0) {
					this.addressList = [];
					this.regionSplic = '请选择';
					return true;
				}
				this.applyAddressListState(cache.addressList, false);
				return true;
			},
			clearAddressCache() {
				try {
					uni.removeStorageSync(this.getAddressCacheKey());
				} catch (e) {}
			},
			getCartCacheKey() {
				const userId = uni.getStorageSync('user_id') || '';
				const key = `cart_cache_${userId}`;
				return key;
			},
			
			/**
			 * 读取购物车缓存
			 * @returns {Object|null} { goodsCartList, lastRecId, isExpired } 或 null
			 * isExpired: true 表示缓存已过期但仍可用于静默更新
			 */
			loadCartCache() {
				try {
					const cacheKey = this.getCartCacheKey();
					const cacheData = uni.getStorageSync(cacheKey);

					// 【关键修复】大数据情况下，JSON.parse 会阻塞，使用 try-catch 包裹
					// 如果解析失败或耗时过长，返回 null，让页面重新加载
					if (cacheData) {
						let parsed;
						try {
							// 对于大数据，JSON.parse 可能耗时，但不应该阻塞太久
							parsed = JSON.parse(cacheData);
						} catch (parseError) {
							return null;
						}

						// 【修改】检查缓存是否过期，但过期时仍返回数据用于静默更新
						const now = Date.now();
						const cacheTs = parsed && parsed.timestamp ? parsed.timestamp : 0;
						const maxAge = 5 * 60 * 1000; // 5分钟
						const isExpired = !cacheTs || now - cacheTs > maxAge;

						// 验证缓存数据格式
						if (parsed && Array.isArray(parsed.goodsCartList)) {
							return {
								goodsCartList: parsed.goodsCartList,
								lastRecId: parsed.lastRecId || null,
								count: this.normalizeNumericValue(parsed.count),
								nums: this.normalizeNumericValue(parsed.nums),
								isExpired: isExpired
							};
						}
					}
				} catch (error) {
				}
				return null;
			},
			
			/**
			 * 保存购物车缓存
			 * @param {Array} goodsCartList - 购物车列表
			 * @param {Number|null} lastRecId - 最后一个商品的 rec_id
			 */
			saveCartCache(goodsCartList, lastRecId) {
				try {
					const normalizedCount = this.normalizeNumericValue(this.count);
					const normalizedNums = this.normalizeNumericValue(this.nums);
					const countForCache = Number.isNaN(normalizedCount) ? null : normalizedCount;
					const numsForCache = Number.isNaN(normalizedNums) ? null : normalizedNums;
					const writeKey = [
						lastRecId || '',
						countForCache === null ? '' : countForCache,
						numsForCache === null ? '' : numsForCache
					].join('|');
					const now = Date.now();
					// 保护：短时间内相同关键数据不重复写缓存，减少高频写入
					if (this._lastCartCacheWriteKey === writeKey && (now - (this._lastCartCacheWriteAt || 0) < 800)) {
						return;
					}

					const cacheKey = this.getCartCacheKey();
					const cacheData = {
						goodsCartList: goodsCartList || [],
						lastRecId: lastRecId || null,
						count: countForCache,
						nums: numsForCache,
						timestamp: now
					};
					uni.setStorageSync(cacheKey, JSON.stringify(cacheData));
					this._lastCartCacheWriteAt = now;
					this._lastCartCacheWriteKey = writeKey;
				} catch (error) {
				}
			},
			
			/**
			 * 清除购物车缓存
			 */
			clearCartCache() {
				try {
					const cacheKey = this.getCartCacheKey();
					uni.removeStorageSync(cacheKey);
					this.lastRecId = null;
				} catch (error) {
				}
			},
			
			/**
			 * 计算购物车中最大的 rec_id
			 * @param {Array} goodsCartList - 购物车列表
			 * @returns {Number|null} 最大的 rec_id
			 */
			calculateLastRecId(goodsCartList) {
				if (!Array.isArray(goodsCartList) || goodsCartList.length === 0) {
					return null;
				}
				
				let maxRecId = null;
				goodsCartList.forEach(store => {
					if (store && Array.isArray(store.new_list)) {
						store.new_list.forEach(act => {
							if (act && Array.isArray(act.act_goods_list)) {
								act.act_goods_list.forEach(item => {
									if (item && item.rec_id && (maxRecId === null || item.rec_id > maxRecId)) {
										maxRecId = item.rec_id;
									}
								});
							}
						});
					}
					// 兼容旧的 goods 数组结构
					if (store && Array.isArray(store.goods)) {
						store.goods.forEach(item => {
							if (item && item.rec_id && (maxRecId === null || item.rec_id > maxRecId)) {
								maxRecId = item.rec_id;
							}
						});
					}
				});
				
				return maxRecId;
			},
			clearCheckedFlagsFromCartList(goodsCartList) {
				if (!Array.isArray(goodsCartList)) return;
				goodsCartList.forEach((store) => {
					const actList = Array.isArray(store && store.new_list) ? store.new_list : [];
					actList.forEach((act) => {
						const goodsList = Array.isArray(act && act.act_goods_list) ? act.act_goods_list : [];
						goodsList.forEach((item) => {
							if (!item) return;
							item.checked = false;
						});
					});
				});
			},
			
			/**
			 * 处理失效商品
			 * @param {Array} recInvalidArray - 失效商品的 rec_id 数组
			 */
			handleInvalidGoods(recInvalidArray) {
				if (!Array.isArray(recInvalidArray) || recInvalidArray.length === 0) {
					return;
				}
				
				const invalidSet = new Set(recInvalidArray);
				this.goodsCartList.forEach((store, storeIndex) => {
					if (store && Array.isArray(store.new_list)) {
						store.new_list.forEach((act, actIndex) => {
							if (act && Array.isArray(act.act_goods_list)) {
								act.act_goods_list.forEach((item, itemIndex) => {
									if (item && invalidSet.has(item.rec_id)) {
										// 使用 $set 确保响应式更新
										this.$set(
											this.goodsCartList[storeIndex].new_list[actIndex].act_goods_list[itemIndex],
											'is_invalid',
											1
										);
									}
								});
							}
						});
					}
					// 兼容旧的 goods 数组结构
					if (store && Array.isArray(store.goods)) {
						store.goods.forEach((item, itemIndex) => {
							if (item && invalidSet.has(item.rec_id)) {
								this.$set(
									this.goodsCartList[storeIndex].goods[itemIndex],
									'is_invalid',
									1
								);
							}
						});
					}
				});
			},
			
			/**
			 * 将 get_cart_new_goodslist 返回的店铺格式转为 goodsCartList 所需格式
			 * API 返回 store.goods，渲染需要 store.new_list[].act_goods_list
			 */
			normalizeNewJoinStore(store) {
				if (!store || !store.store_id) return store;
				// 已有 new_list 则直接返回
				if (store.new_list && Array.isArray(store.new_list) && store.new_list.length > 0) {
					return store;
				}
				// API 返回 goods 数组，转为 new_list 格式
				if (store.goods && Array.isArray(store.goods) && store.goods.length > 0) {
					const act = {
						act_type: null,
						act_id: 0,
						act_type_txt: '',
						act_goods_list: store.goods
					};
					return { ...store, new_list: [act] };
				}
				return store;
			},
			
			/**
			 * 处理新增商品
			 * @param {Array} newGoodsList - 新增商品列表（支持 api/cart/goodslist 的 new_list 或 get_cart_new_goodslist 的 goods）
			 */
			handleNewGoods(newGoodsList) {
				if (!Array.isArray(newGoodsList) || newGoodsList.length === 0) {
					return;
				}
				
				newGoodsList.forEach((newStore, storeIndex) => {
					// 统一转为 new_list 格式（兼容 get_cart_new_goodslist 返回的 goods 结构）
					newStore = this.normalizeNewJoinStore(newStore);
					if (!newStore || !newStore.store_id) {
						return;
					}
					
					// 查找现有购物车中是否已有该店铺
					const existingStoreIndex = this.goodsCartList.findIndex(
						store => store && store.store_id === newStore.store_id
					);
					
					if (existingStoreIndex >= 0) {
						// 店铺已存在，将新商品插入到该店铺
						const existingStore = this.goodsCartList[existingStoreIndex];
						
						// 确保 new_list 存在
						if (!existingStore.new_list) {
							this.$set(existingStore, 'new_list', []);
						}
						
						// 只处理 new_list（因为购物车渲染使用的是 new_list）
						if (newStore.new_list && Array.isArray(newStore.new_list)) {
							newStore.new_list.forEach((newAct, actIndex) => {
								if (newAct && Array.isArray(newAct.act_goods_list)) {
									newAct.act_goods_list.forEach((newGoods, goodsIndex) => {
										// 检查是否已存在（避免重复）
										let exists = false;
										let existingActIndex = -1;
										let existingGoodsIndex = -1;
										
										existingStore.new_list.forEach((act, actIdx) => {
											if (act && Array.isArray(act.act_goods_list)) {
												const goodsIdx = act.act_goods_list.findIndex(item => item.rec_id === newGoods.rec_id);
												if (goodsIdx >= 0) {
													exists = true;
													existingActIndex = actIdx;
													existingGoodsIndex = goodsIdx;
												}
											}
										});
										
										if (exists) {
											return;
										}
										
										// 查找匹配的活动（按 act_id）
										let actIndex = existingStore.new_list.findIndex(
											a => a && a.act_id === newAct.act_id
										);
										
										if (actIndex >= 0) {
											// 活动已存在，插入到 act_goods_list 的第一个位置
											if (!existingStore.new_list[actIndex].act_goods_list) {
												this.$set(existingStore.new_list[actIndex], 'act_goods_list', []);
											}
											
											// 使用 Vue.set 确保响应式更新
											this.$set(existingStore.new_list[actIndex], 'act_goods_list', [
												newGoods,
												...existingStore.new_list[actIndex].act_goods_list
											]);
										} else {
											// 活动不存在，创建新活动并插入到 new_list 的第一个位置
											const newActData = {
												...newAct,
												act_goods_list: [newGoods]
											};
											
											// 使用 Vue.set 确保响应式更新
											this.$set(existingStore, 'new_list', [
												newActData,
												...existingStore.new_list
											]);
										}
									});
								}
							});
						}
					} else {
						// 店铺不存在，插入新店铺到购物车列表的第一个位置
						const newList = [newStore, ...this.goodsCartList];
						this.$store.commit('goodsCartList', { data: newList, preserveSelection: true });
					}
				});
				
				// 处理完新商品后，重新处理数据（调用 processCartData 等）
				if (this.processCartData) {
					this.processCartData(this.goodsCartList);
				}
				
				// 更新 lastRecId（新增商品可能有更大的 rec_id）
				const newLastRecId = this.calculateLastRecId(this.goodsCartList);
				if (newLastRecId && (!this.lastRecId || newLastRecId > this.lastRecId)) {
					this.lastRecId = newLastRecId;
				}

				// 新增商品同步初始化价格基线字段，保证取消选中后可回退到 goodslist 值
				this.ensureBasePriceFieldsForAllGoods();
				
				// 强制更新视图
				this.$forceUpdate();
			},
			
			/**
			 * 检查购物车新增商品（增量更新）
			 */
			async checkCartNewGoods() {
				// 检查用户是否登录
				const token = uni.getStorageSync('token');
				if (!token || token === '') {
					return;
				}
				
				if (!this.lastRecId) {
					return;
				}
				
				try {
					const res = await this.$store.dispatch('setCartNewGoodsList', {
						rec_id: this.lastRecId
					});
					
					if (res && res.status === 'success' && res.data) {
						// 更新 lastRecId（覆盖旧值）
						if (res.data.rec_id) {
							this.lastRecId = res.data.rec_id;
						}
						
						// 处理失效商品
						if (res.data.rec_invalid && Array.isArray(res.data.rec_invalid) && res.data.rec_invalid.length > 0) {
							this.handleInvalidGoods(res.data.rec_invalid);
						}
						
						// 处理新增商品
						if (res.data.rec_ids_newjoin && Array.isArray(res.data.rec_ids_newjoin) && res.data.rec_ids_newjoin.length > 0) {
							this.handleNewGoods(res.data.rec_ids_newjoin);
						}
						
						// 更新缓存（使用最新的 lastRecId，只有登录时才保存）
						if (token && token !== '') {
							this.saveCartCache(this.goodsCartList, this.lastRecId);
						}
					}
				} catch (error) {
				}
			},
			
			// ========== 购物车缓存相关方法结束 ==========

			// ========== 增量更新相关方法 ==========

			/**
			 * 增量更新购物车数据（核心方法）
			 * @param {Array} newServerData - 服务器返回的最新数据
			 */
			incrementalCartUpdate(newServerData) {
				try {
					// 1. 对比店铺级别
					const shopChanges = this.compareShops(this.goodsCartList, newServerData);

					// 2. 对比显示商品级别
					const itemChanges = this.compareVisibleItems(this.goodsCartList, newServerData);

					// 3. 检查是否有变更
					const hasChanges = shopChanges.hasChanges || itemChanges.hasChanges;

					if (!hasChanges) {
						return;
					}

					// 4. 分批应用变更
					this.applyChangesBatch(shopChanges, itemChanges);
					// 变更后刷新价格基线，避免取消选中后残留 reckon 值
					this.ensureBasePriceFieldsForAllGoods();

					// 5. 触发价格重计算
				} catch (error) {
					this.$store.commit('goodsCartList', { data: newServerData, preserveSelection: true });
					this.ensureBasePriceFieldsForAllGoods();
				}
			},

			/**
			 * 对比店铺级别变更
			 */
			compareShops(oldShops, newShops) {
				const changes = {
					removed: [],    // 消失的店铺ID数组
					added: [],      // 新增的店铺对象数组
					hasChanges: false
				};

				if (!Array.isArray(oldShops) || !Array.isArray(newShops)) {
					return changes;
				}

				// 获取店铺ID集合
				const oldShopIds = oldShops.map(shop => shop.store_id).filter(id => id);
				const newShopIds = newShops.map(shop => shop.store_id).filter(id => id);

				// 找出消失的店铺
				changes.removed = oldShopIds.filter(id => !newShopIds.includes(id));

				// 找出新增的店铺
				changes.added = newShops.filter(shop =>
					shop.store_id && !oldShopIds.includes(shop.store_id)
				);

				changes.hasChanges = changes.removed.length > 0 || changes.added.length > 0;

				return changes;
			},

			/**
			 * 对比显示商品的变更（只对比前10个商品）
			 */
			compareVisibleItems(oldShops, newShops) {
				const changes = {
					updated: [],    // 需要更新的商品数组
					hasChanges: false
				};

				if (!Array.isArray(oldShops) || !Array.isArray(newShops)) {
					return changes;
				}

				const newShopMap = new Map();
				newShops.forEach((shop) => {
					if (shop && shop.store_id != null) {
						newShopMap.set(String(shop.store_id), shop);
					}
				});
				const queuedKeys = new Set();
				const pushUpdate = (payload, key) => {
					if (!queuedKeys.has(key)) {
						queuedKeys.add(key);
						changes.updated.push(payload);
					}
				};

				// 只对比现有店铺的显示商品
				oldShops.forEach((oldShop, shopIndex) => {
					const newShop = newShopMap.get(String(oldShop && oldShop.store_id));
					if (!newShop || !newShop.store_id) return;

					// 使用和模板一致的“主商品可见规则”（前10条 + 展开态）
					const oldVisibleRefs = this.getRenderedVisibleItemRefs(oldShop, shopIndex);
					const newVisibleRefs = this.getRenderedVisibleItemRefs(newShop, shopIndex);
					const oldVisibleRecSeq = oldVisibleRefs.map(ref => ref.recId || '').join(',');
					const newVisibleRecSeq = newVisibleRefs.map(ref => ref.recId || '').join(',');

					// 可见区的“成员或顺序”变化，直接替换该店铺，避免索引错位导致加减按钮错乱
					if (oldVisibleRecSeq !== newVisibleRecSeq || oldVisibleRefs.length !== newVisibleRefs.length) {
						pushUpdate({
							shopIndex,
							updateType: 'replaceShop',
							newShopData: newShop
						}, `shop:${shopIndex}:replace`);
						return;
					}

					// 可见区结构一致时，仅按 rec_id 精准更新变化商品
					oldVisibleRefs.forEach((oldRef, i) => {
						const oldItem = oldRef.item;
						const newRef = newVisibleRefs[i];
						const newItem = newRef && newRef.item ? newRef.item : null;
						if (!oldItem || !newItem) return;
						if (this.itemHasChanged(oldItem, newItem)) {
							pushUpdate({
								shopIndex,
								recId: oldRef.recId,
								updateType: 'byRecId',
								oldData: oldItem,
								newData: newItem
							}, `rec:${shopIndex}:${oldRef.recId}`);
						}
					});
				});

				changes.hasChanges = changes.updated.length > 0;

				return changes;
			},

			/**
			 * 获取和模板渲染一致的主商品可见引用（前10条 + 展开态）
			 */
			getRenderedVisibleItemRefs(shop, listIndex) {
				if (!shop || !shop.new_list || !Array.isArray(shop.new_list)) {
					return [];
				}

				const refs = [];
				const key = this.getStoreExpandKey(shop, listIndex);
				const expanded = !!this.storeCartExpanded[key];
				const total = this.getStoreMainGoodsCount(shop);
				const limit = (total > 10 && !expanded) ? 10 : Number.MAX_SAFE_INTEGER;
				let flatIndex = 0;

				for (let actIndex = 0; actIndex < shop.new_list.length; actIndex++) {
					const act = shop.new_list[actIndex];
					if (!act || !Array.isArray(act.act_goods_list)) continue;
					for (let itemIndex = 0; itemIndex < act.act_goods_list.length; itemIndex++) {
						const item = act.act_goods_list[itemIndex];
						if (flatIndex < limit) {
							refs.push({
								recId: this.getItemRecId(item),
								actIndex,
								itemIndex,
								item
							});
						}
						flatIndex += 1;
						if (flatIndex >= limit && limit !== Number.MAX_SAFE_INTEGER) {
							return refs;
						}
					}
				}

				return refs;
			},

			/**
			 * 检查商品是否发生变更
			 */
			itemHasChanged(oldItem, newItem) {
				if (!oldItem || !newItem) return false;

				// 对比关键属性
				return (
					oldItem.rec_id !== newItem.rec_id ||
					oldItem.goods_number !== newItem.goods_number ||
					oldItem.shop_price !== newItem.shop_price ||
					oldItem.is_invalid !== newItem.is_invalid ||
					oldItem.product_number !== newItem.product_number ||
					oldItem.goods_name !== newItem.goods_name ||
					(oldItem.preferential_amount ?? '') !== (newItem.preferential_amount ?? '') ||
					(oldItem.goods_original_price ?? '') !== (newItem.goods_original_price ?? '') ||
					(oldItem.coupon_after_price ?? '') !== (newItem.coupon_after_price ?? '') ||
					(oldItem.coupon_after_price_format ?? oldItem.coupon_after_price_formated ?? oldItem.coupon_after_price_formatted ?? '') !==
						(newItem.coupon_after_price_format ?? newItem.coupon_after_price_formated ?? newItem.coupon_after_price_formatted ?? '') ||
					this.getGoodsBenefitTagsSignature(oldItem) !== this.getGoodsBenefitTagsSignature(newItem) ||
					this.getSimpleDataSignature(oldItem.goods_label) !== this.getSimpleDataSignature(newItem.goods_label) ||
					this.getSimpleDataSignature(oldItem.goods_label_suspension) !== this.getSimpleDataSignature(newItem.goods_label_suspension) ||
					this.getSimpleDataSignature(oldItem.act_info) !== this.getSimpleDataSignature(newItem.act_info)
				);
			},
			getItemRecId(item) {
				if (!item) return '';
				const recId = item.rec_id ?? item.recid ?? item.recId ?? '';
				return recId === '' || recId === null || recId === undefined ? '' : String(recId);
			},
			getSimpleDataSignature(value) {
				if (value === undefined || value === null || value === '') return '';
				let normalized = value;
				if (typeof normalized === 'string') {
					const text = normalized.trim();
					if (!text) return '';
					if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
						try {
							normalized = JSON.parse(text);
						} catch (e) {
							normalized = text;
						}
					} else {
						normalized = text;
					}
				}
				try {
					return JSON.stringify(normalized);
				} catch (e) {
					return String(normalized);
				}
			},
			getGoodsBenefitTagsSignature(item) {
				if (!item) return '';
				let tags = item.goods_benefit_tags;
				if (typeof tags === 'string') {
					try {
						tags = JSON.parse(tags);
					} catch (e) {
						tags = [];
					}
				}
				if (!Array.isArray(tags) || tags.length === 0) return '';
				const normalized = tags.map((tag) => {
					if (!tag || typeof tag !== 'object') return {};
					const childTexts = Array.isArray(tag.items)
						? tag.items.map(child => (child && child.text != null ? String(child.text) : '')).join('|')
						: '';
					return {
						type: tag.type || '',
						text: tag.text || '',
						show: tag.show === false ? 0 : 1,
						sort_order: tag.sort_order || 0,
						items: childTexts
					};
				});
				return this.getSimpleDataSignature(normalized);
			},

			/**
			 * 分批应用变更
			 */
			applyChangesBatch(shopChanges, itemChanges) {
				// 1. 处理店铺变更（优先级高）
				if (shopChanges.removed.length > 0) {
					this.removeShops(shopChanges.removed);
				}

				if (shopChanges.added.length > 0) {
					this.addShops(shopChanges.added);
				}

				// 2. 处理商品变更（分批更新，避免阻塞UI）
				if (itemChanges.updated.length > 0) {
					this.updateItemsBatch(itemChanges.updated);
				}
			},

			/**
			 * 移除店铺
			 */
			removeShops(shopIds) {
				const removedIndices = [];
				this.goodsCartList.forEach((shop, index) => {
					if (shopIds.includes(shop.store_id)) {
						removedIndices.push(index);
					}
				});

				removedIndices.sort((a, b) => b - a).forEach(index => {
					this.checkedShop.splice(index, 1);
					this.checkedGoods.splice(index, 1);
					this.allGoodsListId.splice(index, 1);
				});

				const filteredList = this.goodsCartList.filter(shop =>
					!shopIds.includes(shop.store_id)
				);
				this.$store.commit('goodsCartList', { data: filteredList, preserveSelection: true });
			},

			/**
			 * 添加新店铺
			 */
			addShops(newShops) {
				const updatedList = [...this.goodsCartList, ...newShops];
				newShops.forEach(() => {
					this.checkedShop.push(false);
					this.checkedGoods.push([]);
					this.allGoodsListId.push([]);
				});
				this.$store.commit('goodsCartList', { data: updatedList, preserveSelection: true });
			},

			/**
			 * 批量更新商品
			 */
			updateItemsBatch(updates) {
				// 分批处理，每批最多处理10个商品变更
				const batchSize = 10;

				for (let i = 0; i < updates.length; i += batchSize) {
					const batch = updates.slice(i, i + batchSize);

					// 错开执行时间，避免阻塞UI
					setTimeout(() => {
						batch.forEach(({shopIndex, itemIndex, recId, updateType, newData, newShopData}) => {
							if (updateType === 'replaceShop' && newShopData) {
								this.replaceSingleShop(shopIndex, newShopData);
							} else if (updateType === 'byRecId' && recId) {
								this.updateSingleItemByRecId(shopIndex, recId, newData, itemIndex);
							} else {
								this.updateSingleItem(shopIndex, itemIndex, newData);
							}
						});
					}, i * 10);
				}
			},

			/**
			 * 验证购物车商品是否已生成订单
			 */
			async verifyOrderedItems() {
				try {
					// 获取当前购物车中所有商品的rec_id
					const allRecIds = this.getAllCartItemIds();

					if (allRecIds.length === 0) {
						return [];
					}

					// 调用验证接口
					const recIdString = allRecIds.join(',');
					const result = await this.$store.dispatch('verifyCartRecIds', {
						rec_id: recIdString
					});

					if (result && result.status === 'success' && result.data) {
						const orderedItems = result.data;

						// 记录验证时间
						uni.setStorageSync('cart_verify_time', Date.now());

						return orderedItems;
					} else {
						return [];
					}

				} catch (error) {
					return [];
				}
			},

			/**
			 * 获取购物车中所有商品的rec_id
			 */
			getAllCartItemIds() {
				const allIds = [];

				if (!this.goodsCartList || !Array.isArray(this.goodsCartList)) {
					return allIds;
				}

				this.goodsCartList.forEach(shop => {
					if (shop.new_list && Array.isArray(shop.new_list)) {
						shop.new_list.forEach(act => {
							if (act.act_goods_list && Array.isArray(act.act_goods_list)) {
								act.act_goods_list.forEach(item => {
									if (item.rec_id) {
										allIds.push(item.rec_id);
									}
								});
							}
						});
					}
				});

				return allIds;
			},

			/**
			 * 移除已生成订单的商品
			 */
			removeOrderedItems(orderedRecIds) {
				if (!orderedRecIds || orderedRecIds.length === 0) {
					return;
				}

				// 检查当前购物车中的商品ID
				const currentItemIds = this.getAllCartItemIds();

				// 检查待删除的商品是否在当前购物车中
				const foundItems = orderedRecIds.filter(id => currentItemIds.includes(id));
				const notFoundItems = orderedRecIds.filter(id => !currentItemIds.includes(id));

				// 从购物车数据结构中完全删除这些商品
				const cleanedList = this.goodsCartList.map(shop => {
					const cleanedShop = { ...shop };

					if (cleanedShop.new_list && Array.isArray(cleanedShop.new_list)) {
						cleanedShop.new_list = cleanedShop.new_list.map(act => {
							const cleanedAct = { ...act };

							if (cleanedAct.act_goods_list && Array.isArray(cleanedAct.act_goods_list)) {
								const beforeLength = cleanedAct.act_goods_list.length;
								// 确保数据类型一致（都转成字符串比较）
								const orderedRecIdsStr = orderedRecIds.map(id => String(id));
								cleanedAct.act_goods_list = cleanedAct.act_goods_list.filter(
									item => !orderedRecIdsStr.includes(String(item.rec_id))
								);
								const afterLength = cleanedAct.act_goods_list.length;
							}

							return cleanedAct;
						}).filter(act => act.act_goods_list && act.act_goods_list.length > 0);
					}

					return cleanedShop;
				}).filter(shop => shop.new_list && shop.new_list.length > 0);

				this.$store.commit('goodsCartList', { data: cleanedList, preserveSelection: true });
				this.syncSelectionArraysAfterRemoval(cleanedList, orderedRecIds);

				// 更新本地缓存
				this.saveCartCache(cleanedList, this.lastRecId);
				
				// 更新结算按钮状态，确保移除商品后按钮状态正确
				this.$nextTick(() => {
					this.changeGoods(true); // silent=true 避免显示 loading
				});
			},

			/**
			 * 移除商品后同步更新选中状态数组
			 */
			syncSelectionArraysAfterRemoval(cleanedList, removedRecIds) {
				const originalLength = this.goodsCartList.length;
				const newLength = cleanedList.length;

				// 确保数据类型一致
				const removedRecIdsStr = removedRecIds.map(id => String(id));

				// 1. 清理已删除商品的选中状态（从当前选中状态中移除）
				removedRecIdsStr.forEach(removedRecId => {
					this.checkedGoods.forEach((shopCheckedGoods, shopIndex) => {
						if (Array.isArray(shopCheckedGoods)) {
							const originalLength = shopCheckedGoods.length;
							// 从选中数组中移除已删除的商品
							const filteredGoods = shopCheckedGoods.filter(recId => String(recId) !== removedRecId);
							if (filteredGoods.length !== originalLength) {
								// 使用 Vue.set 确保响应式更新，避免 splice 可能的问题
								this.$set(this.checkedGoods, shopIndex, filteredGoods);
							}
						}
					});
				});

				// 2. 如果有店铺被完全删除，调整选中状态数组长度
				if (newLength < originalLength) {
					if (Array.isArray(this.checkedShop) && this.checkedShop.length > newLength) {
						this.checkedShop.splice(newLength);
					}
					if (Array.isArray(this.checkedGoods) && this.checkedGoods.length > newLength) {
						this.checkedGoods.splice(newLength);
					}
				}
			},

			/**
			 * 更新单个商品
			 */
			updateSingleItemByRecId(shopIndex, recId, newData, fallbackItemIndex = -1) {
				try {
					const shop = this.goodsCartList[shopIndex];
					if (!shop || !Array.isArray(shop.new_list)) return;
					this.syncGoodsBasePriceFields(newData);

					let found = false;
					for (const act of shop.new_list) {
						if (!act || !Array.isArray(act.act_goods_list)) continue;
						const targetIndex = act.act_goods_list.findIndex((item) => this.getItemRecId(item) === String(recId));
						if (targetIndex >= 0) {
							this.$set(act.act_goods_list, targetIndex, newData);
							found = true;
							break;
						}
					}

					if (!found && typeof fallbackItemIndex === 'number' && fallbackItemIndex >= 0) {
						this.updateSingleItem(shopIndex, fallbackItemIndex, newData);
					}
				} catch (error) {
				}
			},
			replaceSingleShop(shopIndex, newShopData) {
				try {
					if (!Array.isArray(this.goodsCartList)) return;
					if (shopIndex < 0 || shopIndex >= this.goodsCartList.length) return;
					if (newShopData && Array.isArray(newShopData.new_list)) {
						newShopData.new_list.forEach((act) => {
							if (!act || !Array.isArray(act.act_goods_list)) return;
							act.act_goods_list.forEach((goods) => {
								this.syncGoodsBasePriceFields(goods);
							});
						});
					}
					this.$set(this.goodsCartList, shopIndex, newShopData);
				} catch (error) {
				}
			},
			/**
			 * 更新单个商品
			 */
			updateSingleItem(shopIndex, itemIndex, newData) {
				try {
					const shop = this.goodsCartList[shopIndex];
					if (!shop || !shop.new_list) return;
					this.syncGoodsBasePriceFields(newData);

					// 找到对应的活动和商品位置
					let currentIndex = 0;
					let found = false;

					for (const act of shop.new_list) {
						if (act.act_goods_list && Array.isArray(act.act_goods_list)) {
							const actLength = act.act_goods_list.length;

							if (currentIndex + actLength > itemIndex) {
								// 在这个活动中
								const localIndex = itemIndex - currentIndex;
								if (localIndex < actLength) {
									// 精确定位并更新商品
									this.$set(act.act_goods_list, localIndex, newData);
									found = true;
								}
								break;
							}

							currentIndex += actLength;
						}
					}

				} catch (error) {
				}
			},

			// ========== 增量更新相关方法结束 ==========

			// 在goodsList方法中优化
			goodsList(forceRefresh = false, silent = false) {
			  var that = this
			  const version = incrementVersion();
			  
			  // 标记为未初始化，阻止复杂的watch执行
			  that._initialized = false;
			  
			  // 检查用户是否登录
			  const token = uni.getStorageSync('token');
			  const isLoggedIn = token && token !== '';
			  
			  // 如果不是强制刷新且用户已登录，先尝试读取缓存
			  if (!forceRefresh && isLoggedIn) {
			    const cache = that.loadCartCache();
			    const hasCache = cache && cache.goodsCartList && cache.goodsCartList.length > 0;
			    
			    if (hasCache) {
			      // 检查数据是否已经恢复（避免 onShow 中已经恢复过的情况）
			      const currentListLength = that.goodsCartList ? that.goodsCartList.length : 0;
			      const cacheListLength = cache.goodsCartList ? cache.goodsCartList.length : 0;
			      
			      // 如果数据还没有恢复，或者数据不一致，才恢复数据
			      if (currentListLength !== cacheListLength) {
			        that.$store.commit('goodsCartList', { data: cache.goodsCartList });
			        that.ensureBasePriceFieldsForAllGoods();
			        that.lastRecId = cache.lastRecId;
			        that.isFirstLoad = false;
			        
			        // 恢复选择状态
			        that.$nextTick(() => {
			          that.handleSelectionAfterFetch();
			          that._initialized = true;
			          // 延迟执行 changeGoods
				          if (that.goodsCartList && that.goodsCartList.length > 0) {
				            setTimeout(() => {
				              that.changeGoods(silent);
				            }, 50);
			          } else {
			            that.loading = false;
			          }
			        });
			      } else {
			        // 数据已经恢复，只需要确保状态正确
			        if (!that._initialized) {
			          that.ensureBasePriceFieldsForAllGoods();
			          that.$nextTick(() => {
			            that.handleSelectionAfterFetch();
			            that._initialized = true;
				            if (that.goodsCartList && that.goodsCartList.length > 0) {
				              setTimeout(() => {
				                that.changeGoods(silent);
				              }, 50);
			            } else {
			              that.loading = false;
			            }
			          });
			        }
			      }
			      
			      // 不在这里设置 loading3，由 onShow 和 showEvery 统一管理
			      // 避免覆盖已经正确设置的 loading 状态
			      that.dataLoading = false;
			      
			      // 【修改】有缓存时也要进行增量更新，检查是否有新增商品
			      // 在后台进行增量更新，避免阻塞UI显示
			      setTimeout(() => {
			        that.checkCartNewGoods();
			      }, 100);
			      
			      // 返回一个已解决的 Promise，因为数据已经恢复
			      return Promise.resolve();
			    }
			  }
			  
			  // 没有缓存或强制刷新，进行全量加载
			  // 【修改】静默模式下不设置 loading 状态
			  if (!silent) {
			    // 注意：loading3 在 showEvery 中已经设置为 true，这里不再重复设置
			    that.dataLoading = true; // 开始加载数据
			    that.isFirstLoad = true;
			  }
			  
			  // 检查用户是否登录（在 finishLoading 外部定义，以便在回调中使用）
			  const isLoggedInForSave = token && token !== '';
			  
			  // 使用 nextTick 确保数据更新后立即渲染，复杂计算延迟执行
			const finishLoading = () => {
			    if (!silent) {
			      that.dataLoading = false;
			    }

			    const lastRecId = that.calculateLastRecId(that.goodsCartList);
			    that.lastRecId = lastRecId;

			    if (isLoggedInForSave) {
			      that.saveCartCache(that.goodsCartList, lastRecId);
			    }
			    that.ensureBasePriceFieldsForAllGoods();

			    if (that.processCartData && that.goodsCartList && that.goodsCartList.length > 0) {
			      that.processCartData(that.goodsCartList);
			    }

			    if (silent) {
			      that._initialized = true;
			      that.applySelectionSummaryFromCheckedState();
			      if (that.immediatelyCheckSelectedGoods()) {
			        that.saveSelectionState();
			      }
			      return;
			    }

			    that.loading = false;
			    that.$nextTick(() => {
			      that.handleSelectionAfterFetch();
			      that._initialized = true;
			      if (that.goodsCartList && that.goodsCartList.length > 0) {
			        that.changeGoods(true);
			      } else {
			        that.loading = false;
			      }
			    });
			  };
			  
			  // 返回 Promise，确保 showEvery 中的 Promise.all 能正确等待
			  const callGoodsCart = (params) => {
			    const cartPromise = that.$store.dispatch('setGoodsCart', params);
			    return withTimeout(cartPromise, REQUEST_TIMEOUT_MS).then((res) => {
			      // 在静默模式下，进行增量更新
			      if (silent) {
			        try {
			          that.incrementalCartUpdate(res.data);
			        } catch (error) {
			          that.$store.commit('goodsCartList', { data: res.data, preserveSelection: true });
			        }
			      }
			      finishLoading();
			    }).catch((err) => {
			      const hasCurrentData = Array.isArray(that.goodsCartList) && that.goodsCartList.length > 0;
			      if (!silent && !hasCurrentData) {
			        that.$store.commit('goodsCartList', { data: [] });
			      }
			      that.dataLoading = false;
			      that.loading = false;
			      if (err && err.message === '请求超时') {
			        uni.showToast({ title: '请求超时，请重试', icon: 'none' });
			      }
			      throw err;
			    });
			  };

			  if (that.regionData && that.regionData.district && that.regionData.district.id) {
			    return callGoodsCart({
			      warehouse_id: 0,
			      area_id: 0,
			      district_id: that.regionData.district.id,
			      app_version: version,
			      isget_more_goods: false,
			      silent: silent // 静默模式下不更新store
			    });
			  } else {
			    return callGoodsCart({
			      warehouse_id: 0,
			      area_id: 0,
			      district_id: '',
			      app_version: version,
			      isget_more_goods: false,
			      silent: silent // 静默模式下不更新store
			    });
			  }
			},
		//选择店铺  
		checkShop(checked, shop, index, shopInvalid, store_name) {


			//是否有失效商品
			if (shopInvalid) return
			
			// 如果是选中店铺操作，检查店铺数量限制
			if (!checked) {
				const currentStoreCount = this.getSelectedStoreCount();
				if (currentStoreCount >= 49) {
					uni.showToast({
						title: '最多只能选择49个店铺的商品',
						icon: 'none',
						duration: 2000
					});
					return;
				}
			}
			
			this.checkedShop.splice(index, 1, !checked)
			if (!checked) {
				this.checkedGoods[index] = [];
				if (shop.ishas_more_goods === true) {
						shop.new_list.forEach((act) => {
							act.act_goods_list.forEach((g) => {
								if (g.is_invalid != 1 && g.product_number > 0) {
									this.checkedGoods[index].push(g.rec_id)
									g.checked = true;
								}
							})
						})
						this.loadMoreGoods(index, shop);
					} else {
						shop.new_list.forEach((act) => {
							act.act_goods_list.forEach((g) => {
								if (g.is_invalid != 1 && g.product_number > 0) {
									this.checkedGoods[index].push(g.rec_id)
								}
							})
						})
					}
				} else {
					this.checkedGoods[index] = []
				}
				
				var a_num = 0
				if (checked == true) {
					for (var j = 0; j < this.goodsCartList[index].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[index].new_list[j].act_goods_list.length; z++) {
							this.goodsCartList[index].new_list[j].act_goods_list[z].checked = false
						}
					}
					
				} else {
					
					for (var j = 0; j < this.goodsCartList[index].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[index].new_list[j].act_goods_list.length; z++) {
							a_num = a_num + 1
							if (a_num > 200) {
								
							}
							// 只选中非失效商品
							const currentItem = this.goodsCartList[index].new_list[j].act_goods_list[z];
							if (currentItem.is_invalid != 1) {
								currentItem.checked = true;
							}
						}
					}
				
				}

				// 【关键】单选店铺时也立即触发价格计算并更新 cat_rec_id；有加载更多时先更新当前批次，loadMoreGoods 完成后再更新
				this.changeGoods();
			},
	//选择购物车商品
	checkGoods(rec_id, index, is_invalid, product_number, is_checked, store_name, listIndex, actIndex, act_id,
		goods_number, goods_price, item) {

		this.recid = item.rec_id
		this.actid = item.act_id
		// this.disabled =true
		let clength = []
		//是否有失效商品
		if (is_invalid == 1 || Number(product_number || 0) <= 0) return;

	// 根据传入的 is_checked 参数来决定新的选中状态（取反）
	const newCheckedState = !is_checked;

		// 在打破店铺/全局全选之前，确保该店铺所有商品已加载（包括折叠部分）
		// 只有在"取消选中"且当前店铺原本是选中状态时才需要补全
		if (!newCheckedState) {
			const storeList = this.goodsCartList[index];
			if (storeList) {
				this.ensureStoreAllGoodsLoaded(index, storeList);
			}
		}

	// 确保 checkedGoods[index] 数组存在
	if (!this.checkedGoods[index]) {
		this.checkedGoods[index] = [];
	}

	// 如果是选中操作，检查店铺数量限制
	if (newCheckedState) {
		// 如果当前店铺没有任何选中商品，则这是一个新店铺
		if (this.checkedGoods[index].length === 0) {
			const currentStoreCount = this.getSelectedStoreCount();
			if (currentStoreCount >= 49) {
				uni.showToast({
					title: '最多只能选择49个店铺的商品',
					icon: 'none',
					duration: 2000
				});
				return;
			}
		}
	}

	// 更新 checkedGoods 数组
	if (newCheckedState) {
		// 选中：如果不在数组中，则添加
		if (this.checkedGoods[index].indexOf(rec_id) == -1) {
			this.checkedGoods[index].push(rec_id)
		}
	} else {
		// 取消选中：如果在数组中，则移除
		if (this.checkedGoods[index].indexOf(rec_id) > -1) {
			this.checkedGoods[index].splice(this.checkedGoods[index].indexOf(rec_id), 1)
		}
	}

			this.goodsCartList[index].new_list[listIndex].act_goods_list[actIndex].checked = newCheckedState;

			let selectableCount = 0;
			this.goodsCartList[index].new_list.forEach((act) => {
				act.act_goods_list.forEach((g) => {
					if (g.is_invalid != 1 && Number(g.product_number || 0) > 0) {
						selectableCount++;
					}
				});
			});
			this.checkedShop[index] = (selectableCount > 0 && selectableCount == this.checkedGoods[index].length)
			
			// 确保在调用 changeGoods 之前，状态已经更新完成
			// 使用 $nextTick 确保 Vue 的响应式更新已完成
			this.$nextTick(() => {
				this.changeGoods()
			})
				// }
				// }
				// 商品数量
				this.goodsnumber = goods_number
				this.pricenum = goods_price
				this.allprice = this.goodsnumber * this.pricenum
				uni.setStorageSync('allprice', this.allprice)
				if (this.goodsCartList[index].new_list[listIndex].act_type == 0) {
					this.$store.dispatch('setGiftList', {
						act_id: act_id
					}).then(({
						data: data
					}) => {
						this.giftList = data.giftlist
						this.act_type_ext = parseInt(data.act_type_ext)
						this.giftList.forEach((v) => {
							if (v.is_checked) {
								if (this.act_type_ext > 1) {
									this.checkGiftArr.push(v.id)
								} else {
									this.checkGiftStr = v.id
								}

							}
						})
						// 赠品添加购物车

					})
				}
			},
			formatAmount(value) {
				const number = Number(value);
				if (isNaN(number)) return '0.00';
				return number.toFixed(2);
			},
			// 过滤 所有店铺优惠券叠加金额
			calculateTotal() {
				let globalTotal = 0; // 全局未折扣总金额
				this.totalDiscount = 0; // 重置总折扣金额

				for (let i = 0; i < this.goodsCartList.length; i++) {
					const store = this.goodsCartList[i];
					let storeTotal = 0; // 当前店铺的总金额
					let couponApplied = false; // 标识当前店铺是否已经应用了优惠券

					// 计算当前店铺所有选中且库存大于0的商品总金额
					for (let j = 0; j < store.new_list.length; j++) {
						const goodsGroup = store.new_list[j];
						for (let z = 0; z < goodsGroup.act_goods_list.length; z++) {
							const item = goodsGroup.act_goods_list[z];
							if (item.checked && item.product_number > 0) {
								const amount = item.goods_number * item.goods_price;
								storeTotal += amount;
								globalTotal += amount;
							}
						}
					}
					const result = this.findMatchingCoupon(store, storeTotal);
					// 如果当前店铺有优惠券且尚未应用，则尝试应用
					if (store.all_coup_list && !couponApplied) {

						if (result) {
							this.totalDiscount += result.cou_money; // 累计折扣金额
							couponApplied = true; // 标记已应用优惠券
						}
					}
				}

				// 全局总金额减去总折扣
				this.globalTotal = globalTotal;
				this.finalGlobalTotal = globalTotal - this.totalDiscount;


			},

			/**
			 * 查找符合条件的优惠券
			 * @param {Object} storeData - 当前店铺的数据对象
			 * @param {Number} totalAmount - 当前店铺所有选中商品的总金额
			 * @returns {Object|null} - 符合条件的优惠券对象或 null
			 */
			findMatchingCoupon(storeData, totalAmount) {
				let result = null;

				// 检查 storeData 是否有 all_coup_list 并且是一个数组
				if (storeData.all_coup_list && Array.isArray(storeData.all_coup_list)) {
					// 遍历 all_coup_list，找到第一个满足条件的优惠券
					for (let coupon of storeData.all_coup_list) {
						const requiredAmount = parseInt(coupon.cou_man, 10);
						const couponMoney = parseFloat(coupon.cou_money);

						// 检查 cou_man 是否为有效数字，并且 totalAmount 是否满足条件
						if (!isNaN(requiredAmount) && totalAmount >= requiredAmount) {
							result = {
								uc_id: coupon.uc_id,
								cou_man: coupon.cou_man,
								cou_money: couponMoney
							};
							break; // 找到符合条件的优惠券后立即跳出循环
						}
					}
				}

				return result;
			},

			// 初始化赠品数据（页面加载时调用，不依赖选中状态）
			initGiftData() {
				var that = this;
				
				// 即使没有选中商品，也要获取赠品信息
				// 构建请求参数：获取所有店铺的赠品信息
				const requestParams = {
					app_version: incrementVersion()
				};
				
				// 获取所有店铺ID
				const ruIdList = [];
				if (Array.isArray(that.goodsCartList)) {
					that.goodsCartList.forEach(store => {
						const storeId = store.store_id;
						if (storeId && !ruIdList.includes(storeId)) {
							ruIdList.push(storeId);
						}
					});
				}
				
				// 如果有店铺，传递店铺ID
				if (ruIdList.length > 0) {
					requestParams.ru_id = ruIdList.join(',');
				} else {
					// 没有店铺数据，无法获取赠品信息
					return;
				}
				
				// 调用结算接口获取赠品数据
				const pricePromise = that.$store.dispatch('setCartPrice', requestParams);
				withTimeout(pricePromise, REQUEST_TIMEOUT_MS).then(res => {
					if (res && res.status === 'success') {
						const priceData = (res.data && typeof res.data === 'object') ? res.data : res;
						
						// 解析赠品数据
						const giftByAct = {};
						const favByAct = {};
						const favByStore = {};
						const storeGiftActIds = {};
						
						if (Array.isArray(priceData.goods_list)) {
							priceData.goods_list.forEach(storeItem => {
								const storeId = storeItem.ru_id ?? storeItem.store_id ?? 0;
								
								// available_favourable：按 act_id 缓存活动配置
								if (storeItem.available_favourable) {
									favByStore[storeId] = [];
									Object.keys(storeItem.available_favourable).forEach(actId => {
										const fav = storeItem.available_favourable[actId];
										favByAct[actId] = fav;
										if (fav && typeof fav === 'object') {
											favByStore[storeId].push({
												...fav,
												act_id: fav.act_id || actId
											});
										}
									});
								}
								
								// gift_goods_list：按 is_gift(活动ID) 分组赠品
								if (Array.isArray(storeItem.gift_goods_list)) {
									if (!storeGiftActIds[storeId]) storeGiftActIds[storeId] = [];
									storeItem.gift_goods_list.forEach(giftItem => {
										const actId = giftItem.is_gift;
										if (!actId) return;
										if (!giftByAct[actId]) {
											giftByAct[actId] = [];
										}
										giftByAct[actId].push(giftItem);
										if (!storeGiftActIds[storeId].includes(actId)) {
											storeGiftActIds[storeId].push(actId);
										}
									});
								}
							});
						}
						
						// 更新赠品数据
						that._reckonStoreGiftActIds = storeGiftActIds;
						that._reckonGiftByAct = giftByAct;
						that._reckonAvailableFav = favByAct;
						that._reckonFavByStore = favByStore;
						
						// 缓存 settlement 数据（按 store_id 索引 + grand 汇总）
						if (priceData.settlement) {
							const settlementByStore = {};
							if (Array.isArray(priceData.settlement.per_store)) {
								priceData.settlement.per_store.forEach(storeSettlement => {
									const storeId = storeSettlement.store_id || storeSettlement.ru_id;
									if (storeId) {
										settlementByStore[storeId] = storeSettlement;
									}
								});
							}
							// 保存 grand 汇总数据
							settlementByStore.grand = priceData.settlement.grand || {};
							that._settlementData = settlementByStore;
							console.log('[cart] initGiftData settlement 数据已缓存 =>', settlementByStore);
						}
						
						console.log('[cart] initGiftData 赠品数据已初始化 =>', storeGiftActIds);
					}
				}).catch(err => {
					console.error('[cart] initGiftData 获取赠品数据失败:', err);
				});
			},

			//商品勾选变化更新购物车列表
			changeGoods(silent = false) {
				var that = this;
				const reckonReqId = ++CART_RECKON_REQ_SEQ;
				const reckonStartAt = Date.now();
				if (that._isReckoningPrice) {
					that._pendingReckon = true;
					that._pendingReckonSilent = that._pendingReckonSilent && silent;
					console.warn('[cart][reckon] 请求排队中，跳过本次立即执行', {
						reqId: reckonReqId,
						silent,
						pendingSilent: that._pendingReckonSilent
					});
					return;
				}
				that._isReckoningPrice = true;
				const finishReckon = () => {
					that._isReckoningPrice = false;
					if (that._pendingReckon) {
						const nextSilent = that._pendingReckonSilent;
						that._pendingReckon = false;
						that._pendingReckonSilent = true;
						that.$nextTick(() => {
							that.changeGoods(nextSilent);
						});
					}
				};
				
				// 立即检查是否有选中商品 - 这是关键修复
				const hasSelected = that.immediatelyCheckSelectedGoods();
			
				if (!hasSelected) {
					// 没有选中商品，立即显示0
					that.totalPriceTiping = true;
					that.totalPrice = '0.00';
					that.count = 0;
					that.nums = 0;
					that.disabled = true;
					that.loading = false;
					that.shipping_fee = '0.00';
					that.totalDiscount = 0;
					// 清空 settlement 数据和标志，避免显示旧数据
					that._settlementData = {};
					that._settlementDataLoaded = false;
					// 取消选中后：券后字段清空，恢复原价显示
					that.clearCouponAfterPriceForAllGoods();
				that.checkAllOper();
				that.saveSelectionState();
					finishReckon();
					return;
				}
				
			// 静默更新模式下，不显示 loading 遮罩，但仍需要禁用结算按钮等待价格计算完成
			if (!silent) {
			that.loading = true;
			that.totalPriceTiping = false;
			}
			// 价格计算中，禁用结算按钮（静默模式也需要）
			that.disabled = true;
			that.checkedGoodsId = [];

			// 收集选中的商品ID，并过滤掉失效商品
			const invalidRecIds = new Set(); // 收集失效商品的rec_id
			that.goodsCartList.forEach(store => {
				store.new_list.forEach(act => {
					act.act_goods_list.forEach(goods => {
						if (goods.is_invalid == 1 || Number(goods.product_number || 0) <= 0) {
							invalidRecIds.add(String(goods.rec_id));
						}
					});
				});
			});

			// 清理选中数组：库存为0或失效商品与已删除商品不允许保留选中态
			if (Array.isArray(that.checkedGoods)) {
				that.checkedGoods.forEach((list, storeIndex) => {
					if (!Array.isArray(list)) return;
					const filtered = list.filter((recId) => !invalidRecIds.has(String(recId)) && !that.delList.includes(recId));
					if (filtered.length !== list.length) {
						that.$set(that.checkedGoods, storeIndex, filtered);
					}
				});
			}

			const selectedRecIdSet = new Set();
			if (Array.isArray(that.checkedGoods)) {
				that.checkedGoods.forEach((list) => {
					if (!Array.isArray(list)) return;
					list.forEach((recId) => {
						if (recId !== undefined && recId !== null && recId !== '') {
							selectedRecIdSet.add(String(recId));
						}
					});
				});
			}
			
			that.checkedGoods.forEach((v, i) => {
				v.forEach(item => {
					// 确保不添加失效商品的rec_id
					if (!invalidRecIds.has(String(item))) {
						that.checkedGoodsId.push(item);
					}
				});
			});
			let arr = that.checkedGoodsId;
			let toRemove = that.delList;
			that.checkedGoodsId = arr.filter(item => !toRemove.includes(item));
			that.checkAllOper();
			that.saveSelectionState();
				
			// 判断是否全选（这里的 checkedAll 结合 checkedShop/checkedGoods 才是真正的业务含义）
			const isAllChecked = that.checkedAll;
			// 全局全选模式必须以“当前仍是全选”作为前提，避免返回页面时误传整店 ru_id
			const inGlobalAllMode = that._globalAllSelectedMode === true && isAllChecked === true;
			if (!isAllChecked && that._globalAllSelectedMode === true) {
				that._globalAllSelectedMode = false;
			}
			
			// 统计数量和种类
			var indexOne = 0;        // 有选中商品的店铺数量
			var snum = 0;            // 选中商品总件数
			var nums = 0;            // 选中商品种类数
			const recIdList = [];    // 需要精确传给后端的商品ID（店铺部分选中时）
			const ruIdList = [];     // 参与计算的店铺ID
			const excludeRecIdList = []; // 全局全选模式下，需要排除的商品ID
			
			for (var i = 0; i < that.goodsCartList.length; i++) {
				const store = that.goodsCartList[i];
				const storeId = store.store_id;
				const actList = store.new_list || [];

				let storeHasChecked = false;          // 该店是否有至少一个选中商品（基于已加载的商品）
				let storeAllSelectableChecked = true; // 该店所有可选商品是否都被选中
				const storeCheckedRecIds = [];        // 该店当前选中的所有 rec_id
				
				// 遍历当前店铺的所有活动和商品
				for (var j = 0; j < actList.length; j++) {
					const goodsList = actList[j].act_goods_list || [];
					for (var z = 0; z < goodsList.length; z++) {
						const item = goodsList[z];
						if (!item) continue;

						// 只考虑"可选"的商品：非失效 且 有库存
						const selectable = item.product_number > 0 && item.is_invalid != 1;
						if (!selectable) {
							if (item.checked) {
								item.checked = false;
							}
							continue;
						}

						const isSelected = selectedRecIdSet.has(String(item.rec_id));
						if (item.checked !== isSelected) {
							item.checked = isSelected;
						}
						if (isSelected) {
							storeHasChecked = true;
							storeCheckedRecIds.push(item.rec_id);

							// 统计数量和种类
							nums = nums + 1;
							snum = snum + item.goods_number;
						} else {
							// 只要有一个可选商品未被选中，则该店铺不再是"全选状态"
							storeAllSelectableChecked = false;
						}
					}
				}

				if (inGlobalAllMode) {
					// 【全局全选模式下的简化规则】
					// 不再考虑“是否有折叠”，只看这家店当前有没有选中商品：
					// - 有选中商品：说明这家店仍然参与结算 → 加入 ru_id，并把未勾选的商品作为 exclude_rec_id
					// - 没有选中商品：等同于整店取消 → 不加入 ru_id，也不收集该店任何 exclude_rec_id
					if (storeHasChecked) {
						// 有选中商品的店铺数 +1（用于禁用判断）
						indexOne = indexOne + 1;

						// 该店铺仍然参与计算 → 加入 ru_id
						if (storeId && !ruIdList.includes(storeId)) {
							ruIdList.push(storeId);
						}

						// 在该店铺中，收集所有被取消勾选的商品作为 exclude_rec_id
						for (let j2 = 0; j2 < actList.length; j2++) {
							const goodsList2 = actList[j2].act_goods_list || [];
							for (let z2 = 0; z2 < goodsList2.length; z2++) {
								const g2 = goodsList2[z2];
								if (!g2) continue;
								const selectable2 = g2.product_number > 0 && g2.is_invalid != 1;
								// 在全选模式下：该商品可选但当前未勾选 → 需要排除
								if (selectable2 && !selectedRecIdSet.has(String(g2.rec_id))) {
									excludeRecIdList.push(g2.rec_id);
								}
							}
						}
					}
					// 没有选中商品的店铺（storeHasChecked === false）：
					// 视为整店取消 → 既不加入 ru_id，也不往 exclude_rec_id 里塞它的商品ID
				} else {
					// 【普通模式】的逻辑保持不变
					if (storeHasChecked) {
						// 有选中商品的店铺数 +1
						indexOne = indexOne + 1;
						
						// 收集所有有选中商品的店铺ID
						if (storeId && !ruIdList.includes(storeId)) {
							ruIdList.push(storeId);
							}
							
						// 按店铺是否"部分选中"来决定是否传 rec_id
						// 如果该店铺"全部可选商品都被选中"（店铺全选），只传 ru_id，不传 rec_id（让后端按整店算）
						// 如果该店铺部分选中（取消了某些商品），则需要把当前选中的商品ID全部传给后端
						if (!isAllChecked && !storeAllSelectableChecked && storeCheckedRecIds.length > 0) {
							recIdList.push(...storeCheckedRecIds);
						}
					}
		}
	}

	// 没有选中商品时禁用，有选中商品时在计算开始已经设置为禁用
	if (indexOne == 0) {
		that.disabled = true;
	}
	// 注意：有选中商品时，disabled 已经在上面设置为 true，等待价格计算完成后才会设置为 false

	const localGoodsCount = snum;
	const localGoodsTypes = nums;
	
	that.count = localGoodsCount; // 购物车勾选商品数量
	that.nums = localGoodsTypes;

			// 生成版本号
			const version = incrementVersion();
			
			// 调用后端接口计算价格
			const requestParams = {
				app_version: version
			};
			
			// 传递店铺ID（全选和非全选都需要）
			if (ruIdList.length > 0) {
				requestParams.ru_id = ruIdList.join(',');
			}
			
			// 全局全选模式下，使用 exclude_rec_id 表达“全选减掉哪些商品”
			if (inGlobalAllMode && excludeRecIdList.length > 0) {
				requestParams.exclude_rec_id = excludeRecIdList.join(',');
			}
			
			// 普通模式：只有非全选时才传递商品ID
			if (!inGlobalAllMode && !isAllChecked && recIdList.length > 0) {
				requestParams.rec_id = recIdList.join(',');
			}

			// 保存indexOne的值，用于价格计算完成后的回调
			const hasSelectedGoods = indexOne > 0;
			console.log('[cart][reckon] 请求开始', {
				reqId: reckonReqId,
				silent,
				isAllChecked,
				inGlobalAllMode,
				selectedStoreCount: indexOne,
				selectedGoodsTypes: localGoodsTypes,
				selectedGoodsCount: localGoodsCount,
				ruIdCount: ruIdList.length,
				recIdCount: recIdList.length,
				excludeRecIdCount: excludeRecIdList.length,
				params: requestParams
			});
				
			const pricePromise = that.$store.dispatch('setCartPrice', requestParams);
			withTimeout(pricePromise, REQUEST_TIMEOUT_MS).then(res => {
				console.log('[cart][reckon] 请求成功', {
					reqId: reckonReqId,
					elapsedMs: Date.now() - reckonStartAt,
					status: res && res.status,
					hasData: !!(res && res.data),
					settlementLoaded: !!(res && res.data && res.data.settlement),
					returnRecId: res && res.data ? res.data.rec_id : undefined
				});
				// 静默更新模式下，不修改 loading 状态
				if (!silent) {
				that.loading = false;
				}
				if (res && res.status === 'success') {
					// 有的环境直接返回 {status,data}，有的可能直接就是 data，本地兼容两种结构
					const priceData = (res.data && typeof res.data === 'object') ? res.data : res;
					console.log('[cart] reckon_cartgoods 原始响应 =>', res);
					console.log('[cart] reckon_cartgoods 解析后的 priceData =>', priceData);
					// 更新价格信息
					that.totalPrice = parseFloat(priceData.total_price || 0).toFixed(2);
					that.shipping_fee = parseFloat(priceData.shipping_fee || 0).toFixed(2);
					that.priceDtailnum = parseFloat(priceData.goods_price || 0).toFixed(2);
					// 默认兜底：使用旧字段，若 settlement 可用会在下方覆盖为“优惠总额”
					that.totalDiscount = parseFloat(priceData.store_cou_price || 0);
					
					// 赠品相关：从结算接口中缓存数据（不直接弹窗，仍由用户点击“领取赠品”触发）
					// 真实结构：gift_goods_list 和 available_favourable 都挂在每个店铺对象下
					const giftByAct = {};
					const favByAct = {};
					const favByStore = {};
					const storeGiftActIds = {};
					if (Array.isArray(priceData.goods_list)) {
						priceData.goods_list.forEach(storeItem => {
							const storeId = storeItem.ru_id ?? storeItem.store_id ?? 0;
							// available_favourable：按 act_id 缓存活动配置（满额、折扣类型等）
							if (storeItem.available_favourable) {
								favByStore[storeId] = [];
								Object.keys(storeItem.available_favourable).forEach(actId => {
									const fav = storeItem.available_favourable[actId];
									favByAct[actId] = fav;
									if (fav && typeof fav === 'object') {
										favByStore[storeId].push({
											...fav,
											act_id: fav.act_id || actId
										});
									}
								});
							}
							// gift_goods_list：按 is_gift(活动ID) 分组赠品，并记录该店铺的赠品活动ID
							if (Array.isArray(storeItem.gift_goods_list)) {
								if (!storeGiftActIds[storeId]) storeGiftActIds[storeId] = [];
								storeItem.gift_goods_list.forEach(giftItem => {
									const actId = giftItem.is_gift;
									if (!actId) return;
									if (!giftByAct[actId]) {
										giftByAct[actId] = [];
									}
									giftByAct[actId].push(giftItem);
									if (!storeGiftActIds[storeId].includes(actId)) {
										storeGiftActIds[storeId].push(actId);
									}
								});
							}
						});
					}
					that._reckonStoreGiftActIds = storeGiftActIds;
					console.log('[cart] reckon_cartgoods goods_list =>', priceData.goods_list);
					console.log('[cart] reckon_cartgoods 解析 available_favourable =>', favByAct);
					console.log('[cart] reckon_cartgoods 解析 giftByAct =>', giftByAct);
					// 用组件实例 that 写回 data，模板才能读到
					that._reckonGiftByAct = giftByAct;
					that._reckonAvailableFav = favByAct;
					that._reckonFavByStore = favByStore;
					
					// 【新增】存储 settlement 数据用于优惠明细展示（按 store_id 索引 + grand 汇总）
					if (priceData.settlement) {
						const settlementByStore = {};
						if (Array.isArray(priceData.settlement.per_store)) {
							priceData.settlement.per_store.forEach(storeSettlement => {
								const storeId = storeSettlement.store_id || storeSettlement.ru_id;
								if (storeId) {
									settlementByStore[storeId] = storeSettlement;
								}
							});
						}
						// 保存 grand 汇总数据
						settlementByStore.grand = priceData.settlement.grand || {};
						that._settlementData = settlementByStore;
						that._settlementDataLoaded = true; // 标记 settlement 数据已加载完成
						// 外层“已优惠”与金额明细弹窗“优惠总额”保持一致
						that.totalDiscount = parseFloat(that.getPriceDetailAllStoresPromotionDiscount() || 0);
						console.log('[cart] reckon_cartgoods settlement 数据已缓存 =>', settlementByStore);
					}
					
					that.totalPriceTiping = true;
					// 将券后价写回当前页面商品，触发模板更新
					that.applyCouponAfterPriceToCartGoods(priceData);
					
					that.applyCartTotalsFromResponse(priceData, localGoodsCount, localGoodsTypes);
					const tokenForCache = uni.getStorageSync('token');
					if (tokenForCache && tokenForCache !== '') {
						that.saveCartCache(that.goodsCartList, that.lastRecId);
					}
					
					// 保存最新的服务端统计，供后续增减数量时使用
					const goodsNumTotalFromServer = that.normalizeNumericValue(priceData.goods_num_total);
					const goodsTypeTotalFromServer = that.normalizeNumericValue(priceData.goods_type_total);
					that._lastFullSelectionCount = Number.isNaN(goodsNumTotalFromServer) ? undefined : goodsNumTotalFromServer;
					that._lastFullSelectionTypes = Number.isNaN(goodsTypeTotalFromServer) ? undefined : goodsTypeTotalFromServer;
					
					// 【关键】只信后端 reckon_cartgoods 返回的 rec_id，作为上传 cat_rec_id 的唯一来源
					let catRecIdStr = '';
					if (priceData.rec_id != null && String(priceData.rec_id).trim()) {
						catRecIdStr = String(priceData.rec_id).trim();
					} else if (priceData.rec_list && Array.isArray(priceData.rec_list) && priceData.rec_list.length > 0) {
						catRecIdStr = priceData.rec_list.join(',');
					} else if (that.checkedGoodsId && that.checkedGoodsId.length > 0) {
						catRecIdStr = that.checkedGoodsId.join(',');
					}
					uni.setStorageSync('cat_rec_id', catRecIdStr);
					
					// 价格计算完成，更新disabled状态
					that.$nextTick(() => {
						if (hasSelectedGoods) {
							that.disabled = false;
						}
					});
				} else {
					that.totalPriceTiping = true;
					that.totalPrice = '0.00';
					// 价格计算失败，保持禁用状态
					that.disabled = true;
				}
				finishReckon();
			}).catch(err => {
				console.error('[cart][reckon] 请求失败', {
					reqId: reckonReqId,
					elapsedMs: Date.now() - reckonStartAt,
					timeoutMs: REQUEST_TIMEOUT_MS,
					message: err && err.message ? err.message : err,
					silent,
					params: requestParams
				});
				that.loading = false;
				that.totalPriceTiping = true;
				that.totalPrice = '0.00';
				that.disabled = true;
				if (err && err.message === '请求超时') {
					uni.showToast({ title: '请求超时，请重试', icon: 'none' });
				}
				finishReckon();
			});
				// if (nums >= 200) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '当前已选择最多200种商品'
				// 	})
				// }
				return;


			
				//更新购物车商品列表
			
				this.$store.dispatch('setCartChecked', {
					rec_id: this.checkedGoodsId,
					sel_flag: 'cart_sel_flag',
					district_id: this.regionData.district.id
				}).then(({
					data: data
				}) => {
					
					this.totalPrice = data.goods_amount_formated //商品价格
					this.shipping_fee = data.goods_amount_formated //运费价格
					// this.favourablePrice = data.discount_formated //购物车优惠价格
					// this.save_price = data.save_price //会员预计优惠价格
					const serverCount = this.normalizeNumericValue(data.goods_num_total);
					const serverTypes = this.normalizeNumericValue(data.goods_type_total);
					
					if (!Number.isNaN(serverCount)) {
						this.count = serverCount;
						this._lastFullSelectionCount = serverCount;
					} else {
						this.count = typeof this.count === 'number' ? this.count : data.cart_number;
					}
					
					if (!Number.isNaN(serverTypes)) {
						this.nums = serverTypes;
						this._lastFullSelectionTypes = serverTypes;
					}

					if (data.cross_border) { //跨境
						this.ratePrice = data.rate_price //税费
						this.ratePriceTip = data.rate_formated //税费格式化
					}

					if (data.cart_fav_box) { //数量改变触发优惠活动条件，更新购物车
						this.goodsCartList = data.cart_fav_box
						this.loading = false
						this.disabled = false
					}
				})
			},
			
	normalizeNumericValue(raw) {
		if (raw === null || raw === undefined) {
			return NaN;
		}
		if (typeof raw === 'number') {
			return Number.isNaN(raw) ? NaN : raw;
		}
		const cleaned = String(raw).replace(/[^\d.-]/g, '');
		if (!cleaned) {
			return NaN;
		}
		const parsed = Number(cleaned);
		return Number.isNaN(parsed) ? NaN : parsed;
	},
	syncGoodsBasePriceFields(item) {
		if (!item || typeof item !== 'object') return;
		const baseCouponAfterPrice = item.coupon_after_price ?? '';
		const baseCouponAfterPriceFormat = item.coupon_after_price_format ?? item.coupon_after_price_formated ?? item.coupon_after_price_formatted ?? '';
		const basePreferentialAmount = item.preferential_amount ?? item.preferentialAmount ?? '';
		const baseGoodsOriginalPrice = item.goods_original_price ?? '';
		this.$set(item, '_base_coupon_after_price', baseCouponAfterPrice);
		this.$set(item, '_base_coupon_after_price_format', baseCouponAfterPriceFormat);
		this.$set(item, '_base_preferential_amount', basePreferentialAmount);
		this.$set(item, '_base_goods_original_price', baseGoodsOriginalPrice);
	},
	restoreGoodsPriceFromBase(item) {
		if (!item || typeof item !== 'object') return;
		const couponAfterPrice = item._base_coupon_after_price !== undefined ? item._base_coupon_after_price : (item.coupon_after_price ?? '');
		const couponAfterPriceFormat = item._base_coupon_after_price_format !== undefined ? item._base_coupon_after_price_format : (item.coupon_after_price_format ?? item.coupon_after_price_formated ?? item.coupon_after_price_formatted ?? '');
		const preferentialAmount = item._base_preferential_amount !== undefined ? item._base_preferential_amount : (item.preferential_amount ?? item.preferentialAmount ?? '');
		const goodsOriginalPrice = item._base_goods_original_price !== undefined ? item._base_goods_original_price : (item.goods_original_price ?? '');
		this.$set(item, 'coupon_after_price', couponAfterPrice);
		this.$set(item, 'coupon_after_price_format', couponAfterPriceFormat);
		this.$set(item, 'preferential_amount', preferentialAmount);
		this.$set(item, 'goods_original_price', goodsOriginalPrice);
	},
	ensureBasePriceFieldsForAllGoods() {
		try {
			if (!Array.isArray(this.goodsCartList)) return;
			this.goodsCartList.forEach((store) => {
				if (!store || !Array.isArray(store.new_list)) return;
				store.new_list.forEach((act) => {
					if (!act || !Array.isArray(act.act_goods_list)) return;
					act.act_goods_list.forEach((goods) => {
						this.syncGoodsBasePriceFields(goods);
					});
				});
			});
		} catch (e) {}
	},

	// 券后价：由 reckon_cartgoods 返回的 coupon_after_price 字段决定
	hasCouponAfterPrice(item) {
		if (!item) return false;
		const v = item.coupon_after_price ?? item.coupon_after_price_format ?? item.coupon_after_price_formated ?? '';
		if (v === null || v === undefined) return false;
		return String(v).trim() !== '';
	},
	getCouponAfterPriceFormat(item) {
		if (!item) return '';
		const rawFmt = item.coupon_after_price_format ?? item.coupon_after_price_formated ?? item.coupon_after_price_formatted;
		if (rawFmt !== null && rawFmt !== undefined && String(rawFmt).trim() !== '') {
			return String(rawFmt).trim().includes('¥') ? String(rawFmt).trim() : ('¥' + String(rawFmt).trim());
		}
		const raw = item.coupon_after_price ?? '';
		const num = parseFloat(raw);
		if (Number.isNaN(num)) return '';
		return '¥' + num.toFixed(2);
	},
	hasGoodsOriginalPrice(item) {
		if (!item) return false;
		const v = item.goods_original_price ?? '';
		if (v === null || v === undefined) return false;
		const str = String(v).trim();
		if (str === '') return false;
		const num = this.normalizeNumericValue(v);
		return !Number.isNaN(num) && num > 0;
	},
	getGoodsOriginalPriceFormat(item) {
		if (!item) return '';
		const raw = item.goods_original_price ?? '';
		const num = this.normalizeNumericValue(raw);
		if (Number.isNaN(num)) return '';
		return '¥' + num.toFixed(2);
	},
	hasPreferentialAmount(item) {
		if (!item) return false;
		const v = item.preferential_amount ?? item.preferentialAmount ?? '';
		if (v === null || v === undefined) return false;
		const str = String(v).trim();
		if (str === '') return false;
		const num = this.normalizeNumericValue(str);
		return !Number.isNaN(num) && Math.abs(num) > 0;
	},
	getPreferentialAmountFormat(item) {
		if (!item) return '0.00';
		const raw = item.preferential_amount ?? item.preferentialAmount ?? '';
		const num = this.normalizeNumericValue(raw);
		if (Number.isNaN(num)) return '0.00';
		return Math.abs(num).toFixed(2);
	},
	// 取消/切换选中后，先清空所有商品的券后字段，避免残留导致 UI 不回退
	clearCouponAfterPriceForAllGoods() {
		try {
			if (!Array.isArray(this.goodsCartList)) return;
			this.goodsCartList.forEach(store => {
				if (!store || !Array.isArray(store.new_list)) return;
				store.new_list.forEach(act => {
					if (!act || !Array.isArray(act.act_goods_list)) return;
					act.act_goods_list.forEach(goods => {
						if (!goods) return;
						// 取消选中时，回退到 goodslist 基线值，而不是直接清空
						this.restoreGoodsPriceFromBase(goods);
					});
				});
			});
		} catch (e) {}
	},
	// 将 reckon_cartgoods 返回的 coupon_after_price 写回 goodsCartList，保证模板能响应更新
	applyCouponAfterPriceToCartGoods(priceData) {
		try {
			if (!priceData) return;
			// 每次回包前先清空，避免旧券后残留
			this.clearCouponAfterPriceForAllGoods();
			const recMap = {};

			// 从任意结构里抓出形如 { rec_id, coupon_after_price } 的对象（只递归有限深度）
			const walk = (node, depth) => {
				if (!node || depth > 7) return;
				if (Array.isArray(node)) {
					node.forEach(n => walk(n, depth + 1));
					return;
				}
				if (typeof node !== 'object') return;

				const recId = node.rec_id ?? node.recid ?? node.recId;
				const hasAfter =
					node.coupon_after_price !== null && node.coupon_after_price !== undefined &&
					String(node.coupon_after_price).trim() !== '';
				const hasAfterFmt =
					node.coupon_after_price_format !== null && node.coupon_after_price_format !== undefined &&
					String(node.coupon_after_price_format).trim() !== '';
				const hasPreferential =
					node.preferential_amount !== null && node.preferential_amount !== undefined &&
					String(node.preferential_amount).trim() !== '';

				if (recId !== null && recId !== undefined && (hasAfter || hasAfterFmt || hasPreferential)) {
					const key = String(recId);
					recMap[key] = {
						coupon_after_price: node.coupon_after_price ?? '',
						coupon_after_price_format: node.coupon_after_price_format ?? node.coupon_after_price_formated ?? node.coupon_after_price_formatted ?? '',
						preferential_amount: node.preferential_amount ?? ''
					};
				}

				Object.keys(node).forEach(k => walk(node[k], depth + 1));
			};

			walk(priceData, 0);

			const hasAny = Object.keys(recMap).length > 0;
			if (!hasAny) return;
			if (!Array.isArray(this.goodsCartList)) return;

			// 写回 goodsCartList：UI 渲染对象是 store.new_list[].act_goods_list[]
			this.goodsCartList.forEach(store => {
				if (!store || !Array.isArray(store.new_list)) return;
				store.new_list.forEach(act => {
					if (!act || !Array.isArray(act.act_goods_list)) return;
					act.act_goods_list.forEach(goods => {
						if (!goods) return;
						const recId = goods.rec_id ?? goods.recid ?? goods.recId;
						if (recId === null || recId === undefined) return;
						const key = String(recId);
						if (!recMap[key]) return;

						const payload = recMap[key];
						this.$set(goods, 'coupon_after_price', payload.coupon_after_price);
						this.$set(goods, 'preferential_amount', payload.preferential_amount ?? '');
						if (payload.coupon_after_price_format) {
							this.$set(goods, 'coupon_after_price_format', payload.coupon_after_price_format);
						} else {
							// 保持字段存在（避免后续 getCouponAfterPriceFormat 依赖时取不到）
							this.$set(goods, 'coupon_after_price_format', '');
						}
					});
				});
			});
		} catch (e) {
			// 容错：不影响主流程
		}
	},
	
	applyCartTotalsFromResponse(serverData, fallbackCount, fallbackTypes) {
			const totalCountRaw = serverData ? serverData.goods_num_total : undefined;
			const totalTypeRaw = serverData ? serverData.goods_type_total : undefined;
			const parsedCount = this.normalizeNumericValue(totalCountRaw);
			const parsedTypes = this.normalizeNumericValue(totalTypeRaw);
			
			if (!Number.isNaN(parsedCount)) {
				this.count = parsedCount;
			} else if (typeof fallbackCount === 'number') {
				this.count = fallbackCount;
			}
			
			if (!Number.isNaN(parsedTypes)) {
				this.nums = parsedTypes;
			} else if (typeof fallbackTypes === 'number') {
				this.nums = fallbackTypes;
			}
		},
		
		// 新增方法：立即检查选中状态
		applySelectionSummaryFromCheckedState() {
			if (!Array.isArray(this.goodsCartList)) return;
			let totalCount = 0;
			let totalTypes = 0;
			const checkedGoodsId = [];

			this.goodsCartList.forEach((store, storeIndex) => {
				const checkedList = Array.isArray(this.checkedGoods[storeIndex]) ? this.checkedGoods[storeIndex] : [];
				let selectableCount = 0;
				let selectedCount = 0;
				const validRecIds = [];
				const actList = Array.isArray(store.new_list) ? store.new_list : [];
				actList.forEach((act) => {
					const goodsList = Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
					goodsList.forEach((item) => {
						if (!item) return;
						const isSelectable = item.is_invalid != 1 && Number(item.product_number || 0) > 0;
						const isSelected = checkedList.includes(item.rec_id);
						if (isSelectable && isSelected) {
							item.checked = true;
							selectableCount++;
							selectedCount++;
							totalTypes++;
							totalCount += parseInt(item.goods_number) || 0;
							checkedGoodsId.push(item.rec_id);
							validRecIds.push(item.rec_id);
						} else if (isSelectable) {
							item.checked = false;
							selectableCount++;
						} else {
							item.checked = false;
						}
					});
				});
				if (validRecIds.length !== checkedList.length) {
					this.$set(this.checkedGoods, storeIndex, validRecIds);
				}
				this.$set(this.checkedShop, storeIndex, selectableCount > 0 && selectedCount === selectableCount);
			});

			this.checkedGoodsId = checkedGoodsId;
			this.count = totalCount;
			this.nums = totalTypes;
			this.checkAllOper();
		},
		immediatelyCheckSelectedGoods() {
		  if (!Array.isArray(this.checkedGoods)) return false;
		  for (let i = 0; i < this.checkedGoods.length; i++) {
		    if (Array.isArray(this.checkedGoods[i]) && this.checkedGoods[i].length > 0) {
		      return true;
		    }
		  }
		  return false;
		},
		
		// 新增方法：统计当前选中的店铺数量
		getSelectedStoreCount() {
		  let selectedStoreCount = 0;
		  for (let i = 0; i < this.checkedGoods.length; i++) {
		    if (this.checkedGoods[i] && this.checkedGoods[i].length > 0) {
		      selectedStoreCount++;
		    }
		  }
		  return selectedStoreCount;
		},
			//默认进购物车全部勾选商品
			changeDefaultGooods() {
				this.default = false;
				this.checkAllOper();
				this.$store.dispatch('setCartDefault', {
					rec_id: this.checkedGoodsId
				}).then(({
					data: data
				}) => {
					this.totalPrice = data.goods_amount_formated //商品价格

					const serverCount = this.normalizeNumericValue(data.goods_num_total);
					const serverTypes = this.normalizeNumericValue(data.goods_type_total);
					
					if (!Number.isNaN(serverCount)) {
						this.count = serverCount;
						this._lastFullSelectionCount = serverCount;
					} else {
						this.count = typeof this.count === 'number' ? this.count : data.cart_number;
					}
					
					if (!Number.isNaN(serverTypes)) {
						this.nums = serverTypes;
						this._lastFullSelectionTypes = serverTypes;
					}

					//跨境
					if (data.cross_border) {
						this.ratePrice = data.rate_price //税费
						this.ratePriceTip = data.rate_formated //税费格式化
					}

					this.loading = false
				})
			},
		//更新购物车全选状态
		checkAllOper() {
			let cAll = 0
			let hasGoods = 0; // 统计有商品的店铺数量

			this.checkedShop.forEach((v, i) => {
				// 检查该店铺是否有商品
				if (this.goodsCartList[i] && this.goodsCartList[i].new_list && this.goodsCartList[i].new_list.length > 0) {
					hasGoods++;
					// 如果店铺有商品但未选中，则不是全选状态
					if (!v) { 
						cAll++;
					}
				}
			})
			
			// 只有在有商品的店铺都被选中时，才设置为全选
			if (cAll > 0 || hasGoods === 0) {
				this.checkedAll = false
			} else {
				this.checkedAll = true
			}
		},
			//全选
			checkAll(invalid) {
				var nums = 0
			
				//是否有失效商品
				if (invalid) return

				this.checkedAll = !this.checkedAll
				// 只有通过底部"全选"按钮切换为选中状态时，才进入全局全选模式
				this._globalAllSelectedMode = this.checkedAll === true
				this.goodsCartList.forEach((v, i) => {
					// if (i < 5 && nums < 200) {
						if (i <= 49 ) {
						this.checkedShop.splice(i, 1, this.checkedAll)
						this.checkedGoods[i] = []
						if (this.checkedAll) {
							v.new_list.forEach((act) => {
								act.act_goods_list.forEach((g) => {
									// nums = nums + 1
									// this.checkedGoods[i].push(g.rec_id)
									// 只选中有效且有货的商品，排除失效商品
									if (g.is_invalid != 1 && g.product_number > 0) {
										this.checkedGoods[i].push(g.rec_id)
									}
								})
							})
						}
					}
				})
				if (!this.checkedAll) {
					this.nums = nums
				}
				nums = 0
		
				if (this.checkedAll == true) {
					for (var i = 0; i < this.goodsCartList.length; i++) {
						for (var k = 0; k < this.goodsCartList[i].goods.length; k++) {
							if (this.goodsCartList[i].goods[k].product_number == 0) {
								if (!this.delList.includes(this.goodsCartList[i].goods[k].rec_id)) {
									this.delList.push(this.goodsCartList[i].goods[k].rec_id)
								}
							}
						}
						for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
							for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
								// if (i < 6 && nums < 200) {
								if (i <= 49 ) {
									// nums = nums + 1
									// 只选中非失效商品
									const currentItem = this.goodsCartList[i].new_list[j].act_goods_list[z];
									if (currentItem.is_invalid != 1) {
										currentItem.checked = true;
									}
								}
							}
						}
					}
				} else {
					for (var i = 0; i < this.goodsCartList.length; i++) {
						for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
							for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
								this.goodsCartList[i].new_list[j].act_goods_list[z].checked = false
							}
						}
					}
					this.delList = []
				}
				this.changeGoods()
			},
			regionSplic_1(zjia) {

				var shipping_region = {
					province_id: this.regionData.province.id,
					city_id: this.regionData.city.id,
					district_id: this.regionData.district.id,
					street_id: this.regionData.street.id
				};
				//运费
				this.shippingFee_1(shipping_region, zjia);
			},
			//运费 计算总价 价格+ 运费
			async shippingFee_1(val, zjia) {
				  // 在计算运费前先检查是否有选中商品
				  const hasSelectedGoods = this.immediatelyCheckSelectedGoods()
				  if (!hasSelectedGoods) {
				    // 没有选中商品，直接显示0
				    this.totalPriceTiping = true
				    this.totalPriceTip = '0.00'
				    this.shipping_fee = '0.00'
				    this.totalPrice = '0.00'
				    return
				  }
				
				var goodsIds = ''
				var goods_number = ''
				this.checkedGoods.forEach((v, i) => {
					v.forEach(i => {
						goodsIds = i + ',' + goodsIds
					})
				})
				for (var i = 0; i < this.goodsCartList.length; i++) {
					for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
							if (this.goodsCartList[i].new_list[j].act_goods_list[z].checked == true) {

								goods_number = this.goodsCartList[i].new_list[j].act_goods_list[z].goods_number + ',' +
									goods_number
							}
						}
					}
				}


				uni.request({
					url: this.websiteUrl + '/api/shipping/getgoodsShippingFeeList',
					method: 'GET',
					data: {
						cat_rec_id: goodsIds.slice(0, -1),
						goods_num: goods_number.slice(0, -1),
						position: JSON.stringify(val)
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
					
						
						
						
						 // 再次检查选中状态，防止在请求过程中状态发生变化
						      const currentHasSelectedGoods = this.immediatelyCheckSelectedGoods()
						      if (!currentHasSelectedGoods) {
						        this.totalPriceTiping = true
						        this.totalPriceTip = '0.00'
						        this.shipping_fee = '0.00'
						        this.totalPrice = '0.00'
						        return
						      }
						if (res.data.data) {
							this.totalPriceTiping = true
							this.shipping_fee = parseFloat(res.data.data.shipping_fee).toFixed(2) //运费
							
							this.totalPrice = (parseFloat(this.shipping_fee) + parseFloat(zjia)).toFixed(
								2) //商品价格
						}

					}
				})
			},
			//修改购物车商品数量
			goodsNumberhandle(e, id, act_id, store_id, listIndex, actIndex, index, goods_price) {
				// 防止并发请求：如果已有请求正在进行，则忽略本次请求
				if (this._isUpdatingNumber) {
					return;
				}
				
				this.stepDisabled.forEach((v, i) => {
					v.forEach((s, d) => {
						if (s.id == id) {
							this.stepDisabled[i][d].type = true
						}
					})
				})

				const targetGoodsItem = this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index];
				const previousGoodsNumber = this.normalizeNumericValue(targetGoodsItem.goods_number);
				const wasGoodsSelected = targetGoodsItem.checked === true && targetGoodsItem.is_invalid != 1;
				
				// 注意：不要在这里立即更新 goods_number，等待接口返回后再更新
				// 这样可以确保在库存不足时，数量不会先被设置为错误的值
				// targetGoodsItem.goods_number = e

				this.goodsnumber = e
				this.pricenum = goods_price
				this.allprice = this.goodsnumber * this.pricenum
				uni.setStorageSync('allprice', this.allprice)
				const version = incrementVersion();
				
				// 设置请求锁
				this._isUpdatingNumber = true;	
				
				// 商品未选中时，只调用 setUpdateNumber，不计算价格，也不修改价格显示状态
				if (!wasGoodsSelected) {
					this.$store.dispatch('setUpdateNumber', {
						rec_id: id,
						num: e,
						district_id: this.regionData.district.id,
						app_version: version,
					}).then(({
						data: data
					}) => {
						this.stepDisabled.forEach((v, i) => {
							v.forEach((s, d) => {
								if (s.id == id) {
									this.stepDisabled[i][d].type = false
								}
							})
						});
						if (data.error == 0) {
							// 数量更新成功，更新本地数量
							this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number = e;
							// 同步到缓存，避免切页返回时显示旧数量
							if (this.$isLogin && this.$isLogin()) {
								this.saveCartCache(this.goodsCartList, this.lastRecId);
							}
						} else {
							// 处理库存不足的情况：使用后端返回的实际可购买数量
							if (data.number !== undefined && data.number !== null) {
								// 优先使用后端返回的 number（实际可购买数量）
								this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number = data.number
							} else if (this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].xiangou_num > 0) {
								// 如果没有返回 number，则使用限购数量
								this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number =
									this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].xiangou_num
							}
							// 同步到缓存（数量已被修正）
							if (this.$isLogin && this.$isLogin()) {
								this.saveCartCache(this.goodsCartList, this.lastRecId);
							}
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
						}
						// 释放请求锁
						this._isUpdatingNumber = false;
						uni.hideKeyboard()
					}).catch((err) => {
						// 请求失败时也要释放锁
						this._isUpdatingNumber = false;
						this.stepDisabled.forEach((v, i) => {
							v.forEach((s, d) => {
								if (s.id == id) {
									this.stepDisabled[i][d].type = false
								}
							})
						});
					})
					return;
				}
				
				// 商品已选中时，调用 setUpdateNumber，在现有总价基础上增减
				// 只有商品已选中时才设置计算中状态
				this.totalPriceTiping = false;
				this.$store.dispatch('setUpdateNumber', {
					rec_id: id,
					num: e,
					district_id: this.regionData.district.id,
					app_version: version,
				}).then(({
					data: data
				}) => {
					this.stepDisabled.forEach((v, i) => {
						v.forEach((s, d) => {
							if (s.id == id) {
								this.stepDisabled[i][d].type = false
							}
						})
					});
				
					if (data.error == 0) {
						// 数量更新成功，先更新本地数量，然后重新计算价格
						targetGoodsItem.goods_number = e;
						// 同步到缓存，避免切页返回时显示旧数量
						if (this.$isLogin && this.$isLogin()) {
							this.saveCartCache(this.goodsCartList, this.lastRecId);
						}
						// 释放请求锁
						this._isUpdatingNumber = false;
						uni.hideKeyboard();
						// 使用 $nextTick 确保数量更新已经同步到视图
						this.$nextTick(() => {
							// 重新计算总价和总数量，确保与后端数据一致
							this.changeGoods();
						});
						return;

					} else {
						// 处理库存不足的情况：使用后端返回的实际可购买数量
						const actualNumber = (data.number !== undefined && data.number !== null) 
							? data.number 
							: (targetGoodsItem.xiangou_num > 0 ? targetGoodsItem.xiangou_num : targetGoodsItem.goods_number);
						
						// 更新商品数量为实际可购买数量（使用 $set 确保 Vue 响应式更新）
						this.$set(targetGoodsItem, 'goods_number', actualNumber);

						uni.showToast({
							title: data.msg,
							icon: 'none'
						});
						
						// 如果商品已选中，需要重新计算价格（因为数量已被修正为实际可购买数量）
						if (wasGoodsSelected) {
							// 关键修复：库存不足时，后端购物车可能还是旧数据
							// 需要先用实际可购买数量更新后端，确保后端数据正确，然后再计算价格
							const updateVersion = incrementVersion();
							this.$store.dispatch('setUpdateNumber', {
								rec_id: id,
								num: actualNumber, // 使用实际可购买数量更新后端
								district_id: this.regionData.district.id,
								app_version: updateVersion,
							}).then(({ data: updateData }) => {
								// 检查第二次更新是否成功
								if (updateData.error == 0) {
									// 后端已更新为实际数量，同步到缓存
									if (this.$isLogin && this.$isLogin()) {
										this.saveCartCache(this.goodsCartList, this.lastRecId);
									}
									// 释放请求锁
									this._isUpdatingNumber = false;
									uni.hideKeyboard();
									// 使用 $nextTick 确保数量更新已经同步到视图
									this.$nextTick(() => {
										// 重新计算总价和总数量，此时后端数据已经是正确的数量了
										this.changeGoods();
									});
								} else {
									// 第二次更新也失败了，但本地数量已经更新，同步缓存后计算价格
									if (this.$isLogin && this.$isLogin()) {
										this.saveCartCache(this.goodsCartList, this.lastRecId);
									}
									this._isUpdatingNumber = false;
									uni.hideKeyboard();
									this.$nextTick(() => {
										this.changeGoods();
									});
								}
							}).catch((updateErr) => {
								// 即使更新失败，也同步缓存并释放锁（使用本地已更新的数量）
								if (this.$isLogin && this.$isLogin()) {
									this.saveCartCache(this.goodsCartList, this.lastRecId);
								}
								this._isUpdatingNumber = false;
								uni.hideKeyboard();
								this.$nextTick(() => {
									this.changeGoods();
								});
							});
						} else {
							// 释放请求锁
							this._isUpdatingNumber = false;
							uni.hideKeyboard();
						}
					}
				}).catch((err) => {
					// 请求失败时也要释放锁
					this._isUpdatingNumber = false;
					this.stepDisabled.forEach((v, i) => {
						v.forEach((s, d) => {
							if (s.id == id) {
								this.stepDisabled[i][d].type = false
							}
						})
					});
				})
				//}, 1000)
			},
			//优惠活动列表
			onFavourableList(goods_id, ru_id, act_id, rec_id) {
				this.$store.dispatch('setFavourable', {
					goods_id: goods_id,
					ru_id: ru_id,
					act_id: act_id,
					rec_id: rec_id
				}).then(({
					data: data
				}) => {
					this.favourableList = data.favourable
					this.favourableShow = true
					this.favourableList.forEach((v) => {
						if (v.is_checked) {
							this.checkFavourable = v.act_id
						}
					})
				})
			},
			//选择优惠活动
			onFavourableTab(act_id, rec_id) {
				this.favourableList.forEach(v => {
					v.is_checked = false
					if (act_id == v.act_id) {
						v.is_checked = true
					}
				})

				this.$store.dispatch('setChangefav', {
					act_id: act_id,
					rec_id: rec_id
				}).then(({
					data: data
				}) => {
					uni.showToast({
						title: data.msg,
						icon: 'none'
					})

					if (data.error == 0) {
						this.goodsList()
						// this.changeDefaultGooods()
						this.favourableShow = false
					}
				})
			},
			normalizeGiftActId(value) {
				const n = Number(value);
				return Number.isNaN(n) ? null : n;
			},
			getGiftCursorKey(item, storeList) {
				const storeId = storeList && (storeList.store_id || storeList.ru_id || storeList.cart_ru_id || 0);
				const recId = item && item.rec_id;
				if (!storeId || recId === undefined || recId === null) return '';
				return `${storeId}_${recId}`;
			},
			getStoreGiftGoodsList(storeList) {
				if (!storeList) return [];
				if (Array.isArray(storeList.gift_goods_list) && storeList.gift_goods_list.length > 0) {
					return storeList.gift_goods_list;
				}
				// 兜底：部分接口把 gift_goods_list 挂在商品下
				const merged = [];
				const dedup = new Set();
				const actList = Array.isArray(storeList.new_list) ? storeList.new_list : [];
				actList.forEach(act => {
					const goodsList = Array.isArray(act && act.act_goods_list) ? act.act_goods_list : [];
					goodsList.forEach(g => {
						const gifts = Array.isArray(g && g.gift_goods_list) ? g.gift_goods_list : [];
						gifts.forEach(giftItem => {
							const key = `${giftItem.is_gift || ''}_${giftItem.goods_id || giftItem.id || ''}`;
							if (dedup.has(key)) return;
							dedup.add(key);
							merged.push(giftItem);
						});
					});
				});
				return merged;
			},
			parseGiftSerialized(giftRaw, actId) {
				if (!giftRaw) return [];
				const text = String(giftRaw).replace(/\\"/g, '"');
				const itemReg = /s:2:"id";s:\d+:"([^"]*)";s:4:"name";s:\d+:"([^"]*)";s:5:"price";(?:i|d):([^;]+);s:3:"num";i:(\d+);/g;
				const list = [];
				let m;
				while ((m = itemReg.exec(text)) !== null) {
					const goodsId = m[1];
					const goodsName = m[2];
					const goodsPrice = Number(m[3]);
					const goodsNum = Number(m[4]);
					list.push({
						goods_id: goodsId,
						id: goodsId,
						goods_name: goodsName,
						name: goodsName,
						goods_price: Number.isNaN(goodsPrice) ? 0 : goodsPrice,
						goods_price_format: Number.isNaN(goodsPrice) ? '¥0.00' : `¥${goodsPrice.toFixed(2)}`,
						goods_number: Number.isNaN(goodsNum) ? 1 : goodsNum,
						num: Number.isNaN(goodsNum) ? 1 : goodsNum,
						is_gift: actId
					});
				}
				return list;
			},
			getStoreGiftActivities(storeList) {
				if (!storeList) return [];
				const favMap = (storeList && typeof storeList.available_favourable === 'object' && storeList.available_favourable) ? storeList.available_favourable : {};
				const giftGoodsList = this.getStoreGiftGoodsList(storeList);
				const byActId = {};
				giftGoodsList.forEach(g => {
					const actId = this.normalizeGiftActId(g && (g.is_gift ?? g.act_id));
					if (actId === null) return;
					if (!byActId[actId]) byActId[actId] = [];
					byActId[actId].push(g);
				});
				const list = [];
				Object.keys(favMap).forEach((k) => {
					const fav = favMap[k];
					if (!fav || Number(fav.act_type) !== 0) return; // 只取满赠活动
					const actId = this.normalizeGiftActId(fav.act_id ?? k);
					if (actId === null) return;
					let gifts = Array.isArray(byActId[actId]) ? byActId[actId] : [];
					if (gifts.length === 0) {
						gifts = this.parseGiftSerialized(fav.gift, actId);
					}
					list.push({
						actId,
						actName: fav.act_name || '',
						minAmount: Number(fav.min_amount || 0),
						actTypeExt: Number(fav.act_type_ext || 0),
						canyuGoodsList: fav.canyu_goods_list || {},
						gifts
					});
				});
				return list.sort((a, b) => (a.minAmount || 0) - (b.minAmount || 0));
			},
			getItemGiftActivities(item, storeList) {
				if (!item || !storeList) return [];
				const storeActs = this.getStoreGiftActivities(storeList);
				if (!storeActs.length) return [];
				const itemActIds = Array.isArray(item.act_id) ? item.act_id.map(v => this.normalizeGiftActId(v)).filter(v => v !== null) : [];
				const itemActSet = new Set(itemActIds);
				const recId = item.rec_id;
				const matched = storeActs.filter(act => {
					if (itemActSet.has(act.actId)) return true;
					const canyuMap = act.canyuGoodsList && typeof act.canyuGoodsList === 'object' ? act.canyuGoodsList : {};
					return recId !== undefined && recId !== null && Object.prototype.hasOwnProperty.call(canyuMap, String(recId));
				});
				return matched.filter(act => Array.isArray(act.gifts) && act.gifts.length > 0);
			},
			getItemGiftActCount(item, storeList) {
				return this.getItemGiftActivities(item, storeList).length;
			},
			getItemGiftInfo(item, storeList) {
				const acts = this.getItemGiftActivities(item, storeList);
				if (!acts.length) return null;
				const key = this.getGiftCursorKey(item, storeList);
				let idx = key && this.itemGiftActIndexMap[key] != null ? Number(this.itemGiftActIndexMap[key]) : 0;
				if (Number.isNaN(idx) || idx < 0) idx = 0;
				idx = idx % acts.length;
				const act = acts[idx];
				return {
					actId: act.actId,
					actName: act.actName,
					minAmount: act.minAmount,
					saveAmount: act.actTypeExt,
					gifts: act.gifts,
					index: idx,
					total: acts.length
				};
			},
			switchItemGiftAct(item, storeList) {
				const acts = this.getItemGiftActivities(item, storeList);
				if (acts.length <= 1) return;
				const key = this.getGiftCursorKey(item, storeList);
				if (!key) return;
				const current = this.itemGiftActIndexMap[key] != null ? Number(this.itemGiftActIndexMap[key]) : 0;
				const next = (Number.isNaN(current) ? 0 : current + 1) % acts.length;
				this.$set(this.itemGiftActIndexMap, key, next);
			},
			// 商品级赠品查看：按当前商品当前活动打开弹层
			receiveGiftByItem(item, storeList) {
				if (!item || !storeList) return;
				const giftInfo = this.getItemGiftInfo(item, storeList);
				if (!giftInfo) return;
				this.receiveGiftByStore(storeList, giftInfo.actId);
			},
			// 是否有满赠活动（按店铺）
			hasStoreReckonGifts(storeList) {
				return this.getStoreGiftActivities(storeList).length > 0;
			},
			// 获取该店铺满赠活动ID列表
			getReckonGiftActIds(storeList) {
				return this.getStoreGiftActivities(storeList).map(v => v.actId);
			},
			// 获取活动满额
			getReckonMinAmount(actId, storeList) {
				const id = this.normalizeGiftActId(actId);
				if (id === null) return 0;
				const acts = this.getStoreGiftActivities(storeList);
				const hit = acts.find(v => v.actId === id);
				return hit ? hit.minAmount : 0;
			},
			// 该店已选商品金额是否达到任一赠品活动门槛（用于控制赠品文案是否展示）；未选任何商品时一律不展示
			storeSelectedAmountReachesGift(storeList) {
				if (!storeList || !Array.isArray(storeList.new_list)) return false;
				let total = 0;
				storeList.new_list.forEach(act => {
					(act.act_goods_list || []).forEach(g => {
						if (g && g.checked) {
							total += (Number(g.goods_price) || 0) * (Number(g.goods_number) || 0);
						}
					});
				});
				if (total <= 0) return false;
				const actIds = this.getReckonGiftActIds(storeList);
				return actIds.some(actId => total >= this.getReckonMinAmount(actId, storeList));
			},
			// 判断该店是否至少有一个商品被勾选，用于控制赠品文案在完全未选中时直接不展示
			storeHasCheckedGoods(storeList) {
				if (!storeList || !Array.isArray(storeList.new_list)) return false;
				for (let i = 0; i < storeList.new_list.length; i++) {
					const act = storeList.new_list[i];
					const goodsList = act && Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
					for (let j = 0; j < goodsList.length; j++) {
						const g = goodsList[j];
						if (g && g.checked) {
							return true;
						}
					}
				}
				return false;
			},
			// —— 店铺底部：主商品展开/收起（>10 条主商品行，与 checkout.js initProductCollapse 一致） ——
			getStoreExpandKey(storeList, listIndex) {
				if (storeList && storeList.store_id != null && storeList.store_id !== '') {
					return 's' + storeList.store_id;
				}
				return 'i' + listIndex;
			},
			getStoreMainGoodsCount(storeList) {
				if (!storeList || !Array.isArray(storeList.new_list)) return 0;
				let n = 0;
				storeList.new_list.forEach(act => {
					n += (act && Array.isArray(act.act_goods_list)) ? act.act_goods_list.length : 0;
				});
				return n;
			},
			getStoreMainGoodsFlatIndex(storeList, actIndex, itemIndex) {
				let idx = 0;
				const acts = (storeList && storeList.new_list) ? storeList.new_list : [];
				for (let a = 0; a < acts.length; a++) {
					const list = (acts[a].act_goods_list || []);
					if (a < actIndex) idx += list.length;
					else if (a === actIndex) return idx + itemIndex;
				}
				return idx;
			},
			isStoreMainGoodsRowVisible(storeList, listIndex, actIndex, itemIndex) {
				const total = this.getStoreMainGoodsCount(storeList);
				if (total <= 10) return true;
				const key = this.getStoreExpandKey(storeList, listIndex);
				const expanded = !!this.storeCartExpanded[key];
				const flat = this.getStoreMainGoodsFlatIndex(storeList, actIndex, itemIndex);
				return flat < 10 || expanded;
			},
			isStoreCartExpanded(listIndex, storeList) {
				const key = this.getStoreExpandKey(storeList, listIndex);
				return !!this.storeCartExpanded[key];
			},
			getStoreCollapseAnchorSelector(storeList) {
				try {
					const acts = (storeList && Array.isArray(storeList.new_list)) ? storeList.new_list : [];
					let flatIndex = 0;
					for (let a = 0; a < acts.length; a++) {
						const goodsList = Array.isArray(acts[a].act_goods_list) ? acts[a].act_goods_list : [];
						for (let g = 0; g < goodsList.length; g++) {
							if (flatIndex === 9) {
								const recId = this.getItemRecId(goodsList[g]);
								return recId ? ('#cart-item-' + recId) : '';
							}
							flatIndex += 1;
						}
					}
				} catch (e) {}
				return '';
			},
			toggleStoreCartExpand(listIndex, storeList) {
				const key = this.getStoreExpandKey(storeList, listIndex);
				const nextExpanded = !this.storeCartExpanded[key];
				const collapseAnchorSelector = nextExpanded ? '' : this.getStoreCollapseAnchorSelector(storeList);
				this.$set(this.storeCartExpanded, key, nextExpanded);
				if (!nextExpanded && collapseAnchorSelector) {
					this.$nextTick(() => {
						setTimeout(() => {
							uni.pageScrollTo({
								selector: collapseAnchorSelector,
								duration: 250
							});
						}, 30);
					});
				}
			},
			// —— 购物车优惠明细展开/收起 ——
			hasCartDiscountActivityChildren() {
				return (this.getPriceDetailFullReduction() > 0) ||
					   (this.getPriceDetailDiscount() > 0) ||
					   (this.getPriceDetailPromotionDiscountAmount() > 0) ||
					   (this.getPriceDetailBlackCardDiscountAmount() > 0) ||
					   (this.getPriceDetailCoupon() > 0);
			},
			toggleCartDiscountActivity() {
				if (!this.hasCartDiscountActivityChildren()) return;
				this.cartDiscountActivityExpanded = !this.cartDiscountActivityExpanded;
			},
			getStoreDiscountTotalTest(storeList) {
				if (!storeList) return '0.00';
				const storeId = storeList.store_id || storeList.ru_id;
				const settlement = this._settlementData && this._settlementData[storeId];
				if (settlement && settlement.store_promotion_discount_total != null) {
					return parseFloat(settlement.store_promotion_discount_total).toFixed(2);
				}
				return '0.00';
			},
			hasStoreDiscountDetail(storeList) {
				return this.storeHasCheckedGoods(storeList) && this.getStoreDiscountTotalTest(storeList) > 0;
			},
			openStoreDiscountDetail(storeList) {
				if (!storeList) return;
				const storeId = storeList.store_id || storeList.ru_id;
				const settlement = this._settlementData && this._settlementData[storeId];
				
				let detailItems = [];
				let totalAmount = '0.00';
				
				if (settlement && settlement.preferential_lines && Array.isArray(settlement.preferential_lines)) {
					// 使用真实的 preferential_lines 数据
					detailItems = settlement.preferential_lines.map(line => ({
						type: line.type,
						label: line.display_label || line.label,
						amount: '-¥' + parseFloat(line.amount).toFixed(2)
					}));
					totalAmount = parseFloat(settlement.store_promotion_discount_total || 0).toFixed(2);
				} else {
					return;
				}
				
				this.storeDiscountDetailStore = storeList;
				this.storeDiscountDetailList = detailItems.slice();
				this.storeDiscountDetailTotal = totalAmount;
				
				const sys = uni.getSystemInfoSync();
				const wh = sys.windowHeight || 667;
				const rows = detailItems.length + 1;
				const perRow = uni.upx2px(100);
				const sectionPad = uni.upx2px(56);
				const contentH = rows * perRow + sectionPad;
				const cap = Math.min(Math.floor(wh * 0.46), uni.upx2px(560));
				const floor = uni.upx2px(140);
				this.storeDiscountPopupScrollH = Math.min(cap, Math.max(floor, contentH));
				this.storeDiscountDetailShow = true;
			},
			closeStoreDiscountDetail() {
				this.storeDiscountDetailShow = false;
				this.storeDiscountDetailStore = null;
				this.storeDiscountDetailList = [];
				this.storeDiscountDetailTotal = '0.00';
			},
			// 映射优惠类型到图标类型
			getDiscountIconType(type) {
				if (type === 'coupon') return 'coupon';
				if (type === 'limited_time_discount') return 'time';
				if (type === 'full_reduction') return 'manjian';
				if (type === 'time') return 'time';
				return 'manjian';
			},
			
			// 价格明细弹窗：获取商品总计
			getPriceDetailGoodsSubtotal() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.goods_subtotal_total || 0).toFixed(2);
				}
				return parseFloat(this.priceDtailnum || 0).toFixed(2);
			},
			
			// 价格明细弹窗：获取每个店铺的金额行
			getPriceDetailStoreRows() {
				if (this._settlementData && this._settlementData.grand && Array.isArray(this._settlementData.grand.store_goods_rows)) {
					return this._settlementData.grand.store_goods_rows;
				}
				return [];
			},
			getStoreRowPromotionDiscount(store) {
				if (!store || typeof store !== 'object') return '0.00';
				const raw = store.store_promotion_discount_total;
				const num = parseFloat(raw || 0);
				return Number.isNaN(num) ? '0.00' : num.toFixed(2);
			},
			hasStoreRowPromotionDiscount(store) {
				return parseFloat(this.getStoreRowPromotionDiscount(store)) > 0;
			},
			getPriceDetailAllStoresPromotionDiscount() {
				const grand = this._settlementData && this._settlementData.grand ? this._settlementData.grand : null;
				if (grand && grand.all_stores_promotion_discount_total != null) {
					const v = parseFloat(grand.all_stores_promotion_discount_total || 0);
					if (!Number.isNaN(v)) return v;
				}
				// 兼容后端暂未回传新字段时，前端按店铺行合计兜底
				const rows = this.getPriceDetailStoreRows();
				if (!rows.length) return 0;
				return rows.reduce((sum, row) => {
					const n = parseFloat(row && row.store_promotion_discount_total || 0);
					return sum + (Number.isNaN(n) ? 0 : n);
				}, 0);
			},
			getPriceDetailAllStoresPromotionDiscountFormat() {
				return this.getPriceDetailAllStoresPromotionDiscount().toFixed(2);
			},
			
			// 价格明细弹窗：获取满减优惠
			getPriceDetailFullReduction() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.favourable_full_reduction_total || 0).toFixed(2);
				}
				return '0.00';
			},
			
			// 价格明细弹窗：获取折扣优惠
			getPriceDetailDiscount() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.favourable_discount_total || 0).toFixed(2);
				}
				return '0.00';
			},

			// 价格明细弹窗：获取促销折扣
			getPriceDetailPromotionDiscountAmount() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.promotion_discount_amount || 0).toFixed(2);
				}
				return '0.00';
			},

			// 价格明细弹窗：获取黑卡优惠
			getPriceDetailBlackCardDiscountAmount() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.black_card_discount_amount || 0).toFixed(2);
				}
				return '0.00';
			},
			
			// 价格明细弹窗：获取优惠券
			getPriceDetailCoupon() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.coupon_reduction_total || 0).toFixed(2);
				}
				return '0.00';
			},
			
			// 价格明细弹窗：获取总优惠
			getPriceDetailTotalDiscount() {
				// 统一使用“优惠总额”（all_stores_promotion_discount_total）口径
				// 保证抽屉头部金额与上方“优惠总额”完全一致
				return this.getPriceDetailAllStoresPromotionDiscount();
			},
			
			// 价格明细弹窗：获取运费
			getPriceDetailShippingFee() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.shipping_fee || 0).toFixed(2);
				}
				return parseFloat(this.shipping_fee || 0).toFixed(2);
			},
			
			// 价格明细弹窗：获取应付金额
			getPriceDetailAmountPayable() {
				if (this._settlementData && this._settlementData.grand) {
					return parseFloat(this._settlementData.grand.amount_payable || 0).toFixed(2);
				}
				return parseFloat(this.totalPrice || 0).toFixed(2);
			},
			// 取该店第一个赠品活动的满额（用于文案只显示一行）
			getReckonFirstMinAmount(storeList) {
				const actIds = this.getReckonGiftActIds(storeList);
				return actIds.length ? this.getReckonMinAmount(actIds[0], storeList) : 0;
			},
			// 按店铺打开赠品弹层：支持按活动打开；未指定时默认打开该店第一个活动
			receiveGiftByStore(storeList, targetActId = null) {
				if (!storeList) return
				const acts = this.getStoreGiftActivities(storeList)
				if (!acts.length) return
				const normalizedTargetActId = this.normalizeGiftActId(targetActId)
				const targetAct = normalizedTargetActId === null ? acts[0] : (acts.find(v => v.actId === normalizedTargetActId) || acts[0])
				const rawGifts = Array.isArray(targetAct.gifts) ? targetAct.gifts : []
				// 统一字段：接口为 goods_thumb/goods_name/goods_price_format 等，模板用 thumb/name/price_formated
				let idx = 0
				this.giftList = rawGifts.map(g => ({
					...g,
					// 使用 goods_id + is_gift + 序号 组合，避免重复 key 提示
					id: g.id || (`gift-${g.goods_id || 'g'}-${g.is_gift || targetAct.actId || 'a'}-${idx++}`),
					thumb: g.goods_thumb || g.thumb,
					name: g.goods_name || g.name,
					price_formated: g.goods_price_format != null ? g.goods_price_format : (g.shop_price_formated || g.price_formated),
					is_checked: true
				}))
				this.act_type_ext = Number(targetAct.actTypeExt || 0)
				this.minamount = Number(targetAct.minAmount || 0)
				this.checkGiftArr = this.giftList.map(v => v.id)
				this.checkGiftStr = this.giftList[0] ? this.giftList[0].id : ''
				this.giftShow = true
			},
			// 兼容旧调用（按 act_id 打开，仅展示该活动赠品）
			receiveGift(act_id, type, min_amount, actItem) {
				const normalizedActId = this.normalizeGiftActId(act_id)
				const storeList = (this.goodsCartList || []).find(s => (this.getReckonGiftActIds(s) || []).includes(normalizedActId))
				if (storeList) {
					this.receiveGiftByStore(storeList, normalizedActId)
					return
				}
			},
			//选择赠品
			checkGift(id, index) {

				if (this.giftDisabled) {
					this.giftList.forEach((v) => {
						if (this.act_type_ext > 1) {
							if (id == v.id) {
								v.is_checked = v.is_checked ? false : true
								if (v.is_checked) {
									if (!this.checkGiftArr.includes(id)) {
										this.checkGiftArr.push(v.id)
									}

								} else {
									let array = this.checkGiftArr;
									if (array.includes(v.id)) {
										let index = array.indexOf(v.id);
										array.splice(index, 1);
									}

								}
							}
						} else {
							v.is_checked = false
							if (id == v.id) {
								v.is_checked = true
								this.checkGiftStr = v.id
							}
						}
					})
				} else {
					uni.showToast({
						title: this.$t('lang.not_receive_gift'),
						icon: 'none'
					})
				}
			},

			//提交赠品
			submitGift() {
				let act_id = 0
				let ru_id = 0
				let select_gift
				this.giftList.forEach(v => {
					act_id = v.act_id
					ru_id = v.ru_id
				})

				if (this.act_type_ext > 1) {
					select_gift = this.checkGiftArr
				} else {
					select_gift = this.checkGiftStr
				}

				this.$store.dispatch('setGiftChecked', {
					act_id: act_id,
					ru_id: ru_id,
					select_gift: select_gift
				}).then(({
					data: data
				}) => {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					if (data.error == 0) {
						this.giftShow = false
						this.issubmit = data.cat_rec_id
						this.objsubmit[this.recid] = this.issubmit
						this.objarr.push(this.objsubmit)
						uni.setStorageSync("issubmit", this.objsubmit)
					
					}
				})
			
			},
			//优惠券列表
			updateCouponPopupHeight() {},
			getCommonPopupScrollH(options = {}) {
				const sys = uni.getSystemInfoSync();
				const wh = sys.windowHeight || 667;
				const rows = Number(options.rows || 0);
				const rowHeightPx = uni.upx2px(Number(options.rowUpx || 120));
				const paddingPx = uni.upx2px(Number(options.extraUpx || 120));
				const minPx = uni.upx2px(Number(options.minUpx || 180));
				const capPx = Math.min(Math.floor(wh * Number(options.capRate || 0.72)), uni.upx2px(Number(options.capUpx || 900)));
				const contentPx = rows * rowHeightPx + paddingPx;
				return Math.min(capPx, Math.max(minPx, contentPx));
			},
			recalcManjianPopupScrollH() {
				const data = this.manjianPopupData || {};
				const rulesCount = Array.isArray(data.rules) ? data.rules.length : 0;
				const couponsCount = Array.isArray(data.coupons) ? data.coupons.length : 0;
				const rows = 2 + rulesCount + couponsCount;
				this.couponPopupScrollH = this.getCommonPopupScrollH({
					rows,
					rowUpx: 120,
					extraUpx: 140,
					minUpx: 180,
					capRate: 0.68,
					capUpx: 860
				});
			},
			recalcCoudanPopupScrollH(listLength = 0) {
				const rows = Math.max(Number(listLength || 0), 2);
				this.couponPopupScrollH = this.getCommonPopupScrollH({
					rows,
					rowUpx: 182,
					extraUpx: 120,
					minUpx: 260,
					capRate: 0.72,
					capUpx: 900
				});
			},
			handleCoupon(ru_id) {
			    const store = this.goodsCartList.find(v => v.store_id == ru_id)
			    this.couponPopupStore = store || null
			    this.couponPopupRuId = ru_id
			    this.couponPopupMode = store ? (this.getStoreHeaderBtnText(store) === '领券' ? 'coupon' : 'discount') : 'discount'
			    this.couponShow = true
			    if (store) this.coupuns_num = store.coupuns_num || 0
			    this.$store.dispatch('setCoupons', { ru_id: ru_id })
			},


			// 满减信息弹窗
			openManjianPopup(storeList, listIndex) {
				if (this.coudanPopupShow) this.closeCoudanPopup()
				this.manjianPopupStore = storeList || null
				this.manjianPopupListIndex = listIndex != null ? listIndex : 0
				this.manjianPopupShow = true
				this.$nextTick(() => {
					this.recalcManjianPopupScrollH()
				})
			},
			closeManjianPopup() {
				this.manjianPopupShow = false
				this.manjianPopupStore = null
				this.manjianPopupListIndex = null
			},
			fromManjianOpenGather() {
				const store = this.manjianPopupStore
				const idx = this.manjianPopupListIndex
				this.closeManjianPopup()
				this.$nextTick(() => {
					this.openCoudanPopup(store, idx)
				})
			},
			onManjianCouponClaim() {
				uni.showToast({ title: '领取成功', icon: 'success' })
			},
			// 去凑单弹窗
			openCoudanPopup(storeList, listIndex) {
				if (this.manjianPopupShow) this.closeManjianPopup()
				this.coudanPopupStore = storeList || null
				this.coudanPopupListIndex = listIndex != null ? listIndex : 0
				// 每次打开凑单弹窗时，清空本地临时增量，由后端 cart_goods_number 作为最新基准
				this.coudanTempDeltaMap = {}
				this.coudanPopupShow = true
				this.recalcCoudanPopupScrollH(0)
				const tier = storeList ? this.getNextManjianTier(storeList, this.coudanPopupListIndex) : null
				const actId = tier ? tier.actId : 0
				this.loadCoudanGoods(actId, 1)
				this.$store.dispatch('setCoudan', { act_id: actId })
			},
			loadCoudanGoods(actId, page) {
				if (page === 1) {
					this.coudanPage = 1
					this.coudanLoadMoreDone = false
				}
				if (this.coudanLoading) return
				if (page > 1 && this.coudanLoadMoreDone) return
				this.coudanLoading = true
				const size = 10
				this.$store.dispatch('setCoudanGoodsList', {
					act_id: actId || 0,
					page: page || 1,
					size: size,
					sort: 0,
					order: 'desc'
				}).then((res) => {
					this.coudanLoading = false
					this.coudanPage = page || 1
					// 兼容新旧接口：res.data 可能是对象（数组在 res.data.list），也可能是数组
					let list = []
					const data = res && res.data ? res.data : null
					if (Array.isArray(data)) {
						list = data
					} else if (data && Array.isArray(data.list)) {
						list = data.list
					} else if (data && data.data && Array.isArray(data.data)) {
						list = data.data
					}
					if (list.length < size) this.coudanLoadMoreDone = true
					if (page === 1) {
						this.recalcCoudanPopupScrollH(list.length)
					}
				}).catch(() => {
					this.coudanLoading = false
				})
			},
			onCoudanScrollLower() {
				if (!this.coudanPopupShow || this.coudanLoading || this.coudanLoadMoreDone) return
				const tier = this.coudanPopupStore ? this.getNextManjianTier(this.coudanPopupStore, this.coudanPopupListIndex) : null
				const actId = tier ? tier.actId : 0
				const list = this.$store.state.shopping.coudanGoodsList || []
				const expected = this.coudanPage * 10
				if (list.length >= expected) this.loadCoudanGoods(actId, this.coudanPage + 1)
			},
			closeCoudanPopup() {
				this.coudanPopupShow = false
				this.coudanPopupStore = null
				this.coudanPopupListIndex = null
				// 关闭凑单弹窗时，丢弃当前会话内的临时加购增量
				this.coudanTempDeltaMap = {}
			},
			gotoCoudanStore() {
				const store = this.coudanPopupStore
				if (store && store.store_id) {
					this.closeCoudanPopup()
					this.$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + store.store_id, 'app')
				}
			},
			getCoudanItemTags(item) {
				if (!item) return []
				const tags = []
				// 新接口：goods_tags: [{type,text,show,...}]
				if (Array.isArray(item.goods_tags)) {
					item.goods_tags.forEach(t => {
						if (!t) return
						// 只取显示中的标签
						if (t.show === false) return
						if (t.text) tags.push(t.text)
					})
				}
				// 老接口兼容
				if (item.act_type_name) tags.push(item.act_type_name)
				if (item.goods_services_label_new && Array.isArray(item.goods_services_label_new)) {
					item.goods_services_label_new.forEach(l => { if (l && l.name) tags.push(l.name) })
				}
				if (item.product_tags && Array.isArray(item.product_tags)) {
					item.product_tags.forEach(t => { tags.push(typeof t === 'string' ? t : (t.text || t.name || '')) })
				}
				if (tags.length === 0) tags.push('满减可用')
				return tags
			},
			coudanStripCurrency(s) {
				if (s == null || s === '') return ''
				return String(s).replace(/¥/g, '').replace(/^\s+|\s+$/g, '')
			},
			coudanDisplayPrice(item) {
				if (!item) return '0.00'
				const raw = item.shop_price_formated || item.goods_price_format || item.shop_price || item.goods_price || item.price
				if (raw == null || raw === '') return '0.00'
				return this.coudanStripCurrency(raw)
			},
			coudanDisplayMarketPrice(item) {
				if (!item) return ''
				const cur = parseFloat(this.coudanStripCurrency(item.shop_price_formated || item.shop_price || item.goods_price || item.price || '0')) || 0
				const m = item.market_price || item.market_price_formated || item.market_price_format
				if (m == null || m === '') return ''
				const market = parseFloat(this.coudanStripCurrency(m)) || 0
				if (market <= cur) return ''
				return this.coudanStripCurrency(m)
			},
			// 从购物车里统计：该商品已加入凑单列表的“加购数量”
			// 口径与后端对齐：仅统计当前凑单店铺(ru_id)下、同 goods_id 的有效主商品数量
			getCoudanAddedCount(item) {
				if (!item) return 0
				const goodsId = item.goods_id || item.id
				if (!goodsId) return 0
				// 1）基准值：完全以后端返回的 cart_goods_number 为准
				const baseRaw = item.cart_goods_number
				const base = Number(baseRaw || 0)
				// 2）当前凑单弹窗会话内的临时增量（只在未关闭期间生效）
				const currentRuId = String(
					(this.coudanPopupStore && (this.coudanPopupStore.ru_id || this.coudanPopupStore.store_id || this.coudanPopupStore.cart_ru_id)) || ''
				)
				const key = `${currentRuId}_${goodsId}`
				const deltaRaw = this.coudanTempDeltaMap && this.coudanTempDeltaMap[key]
				const delta = Number(deltaRaw || 0)
				const total = (Number.isNaN(base) ? 0 : base) + (Number.isNaN(delta) ? 0 : delta)
				// 兜底：最少为 0
				return total > 0 ? total : 0
			},
			// 凑单列表点击“加购”：打开规格弹窗并初始化选中SKU
			openCoudanGoodsAttr(item) {
				if (!item) return

				// 注意：规格弹窗盖在上层，凑单弹窗保持打开，用于实时展示“已加入数量”角标

				// 1) 规格弹窗顶部展示用（只需要 goods_thumb / goods_price_format）
				const priceFormat =
					item.goods_price_format ||
					item.shop_price_formated ||
					item.goods_price_formated ||
					item.goods_price ||
					item.shop_price ||
					''
				const thumb =
					item.goods_thumb ||
					item.goods_img ||
					item.goods_pic ||
					item.goods_image ||
					item.thumb ||
					''

				this.oneMoreGoodsDetail = {
					goods_id: item.goods_id || item.id,
					goods_thumb: thumb,
					goods_price_format: priceFormat,
					goods_price: item.shop_price || item.goods_price || item.goods_price_format || ''
				}

				// 2) 把凑单返回的 spec_list / attr_pn_list 映射为 cart.vue 规格弹窗依赖的 goodsDetail 格式
				let specList = item.spec_list || {}
				if (typeof specList === 'string') {
					try { specList = JSON.parse(specList) } catch (e) { specList = {} }
				}
				const spe = specList.spe || specList?.spec?.spe || {}

				let attrPnListRaw = item.attr_pn_list || item.attrPnList || []
				if (typeof attrPnListRaw === 'string') {
					try { attrPnListRaw = JSON.parse(attrPnListRaw) } catch (e) { attrPnListRaw = [] }
				}

				const normalizeAttrPnList = (pn) => {
					if (!pn) return []
					if (Array.isArray(pn)) return pn
					if (pn && Array.isArray(pn.list)) return pn.list
					if (pn && typeof pn === 'object') {
						return Object.keys(pn).map(k => ({
							key: k,
							value: pn[k]
						}))
					}
					return []
				}

				const attrPnList = normalizeAttrPnList(attrPnListRaw)

				// spec_list.spe：{ [dimId]: { name, values:[{goods_attr_id, attr_value, attr_img_flie...}] } }
				const buildAttrGroupsFromSpecList = (speObj) => {
					const arr = []
					if (!speObj || typeof speObj !== 'object') return arr
					Object.keys(speObj).forEach((k) => {
						const group = speObj[k] || {}
						const values = Array.isArray(group.values) ? group.values : []
						const attrKey = values
							.map(v => {
								const id = Number(v.goods_attr_id != null ? v.goods_attr_id : (v.id != null ? v.id : v.attr_id))
								if (Number.isNaN(id)) return null
								return {
									id,
									attr_value: v.attr_value != null ? String(v.attr_value) : (v.value != null ? String(v.value) : ''),
									attr_img_flie: v.attr_img_flie || v.attr_thumb || v.img_url || v.thumb || ''
								}
							})
							.filter(Boolean)

						arr.push({
							name: group.name != null ? String(group.name) : '',
							attr_type: 2, // 后续根据skuKey里第一段id重算，先给默认
							attr_key: attrKey
						})
					})
					return arr
				}

				const attrGroups = buildAttrGroupsFromSpecList(spe)

				// 如果没有 spec_list，就退回到原始加购逻辑（不弹规格）
				if (!attrGroups.length || attrPnList.length === 0) {
					// 数据结构不够用时，直接拉取 goodsattrlist，确保弹窗数据与“详情规格弹窗”一致
					const goodsId = item.goods_id || item.id
					if (!goodsId) return

					uni.request({
						url: this.websiteUrl + '/api/goods/goodsattrlist',
						method: 'POST',
						data: { goods_id: goodsId },
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							try {
								const detail = res && res.data && res.data.data ? res.data.data : null
								if (!detail) return

								this.goodsDetail = detail
								this.attrLength = Array.isArray(detail.attr) ? detail.attr.length : 0
								this.history = {}
								this.totalQuantity = 0
								this.totalPrice = 0
								this.seleceGoodsAtrrArray = []
								this.selectedColor = ''

								const pnList = Array.isArray(detail.attr_pn_list) ? detail.attr_pn_list : []
								const firstRow = pnList.find(r => Number(r?.value?.product_number || 0) > 0) || pnList[0]
								const skuKey = firstRow ? String(firstRow.key) : ''
								if (skuKey) this.setSkuSelectionByKey(skuKey)

								this.$nextTick(() => {
									this.$refs && this.$refs['goodsattr'] && this.$refs['goodsattr'].open()
								})
							} catch (e) {
								// 拉取失败兜底：不弹规格，直接加购
								this.$store.dispatch('setAddCart', {
									goods_id: goodsId,
									num: 1,
									spec: [],
									warehouse_id: '0',
									area_id: '0',
									parent_id: '0',
									rec_type: '0'
								}).then(r => {
									if (r && r.error == 0) uni.showToast({ title: '已加入购物车', icon: 'success' })
									else uni.showToast({ title: (r && r.msg) || '加入失败', icon: 'none' })
								})
							}
						},
						fail: () => {
							// 拉取失败兜底：不弹规格，直接加购
							this.$store.dispatch('setAddCart', {
								goods_id: goodsId,
								num: 1,
								spec: [],
								warehouse_id: '0',
								area_id: '0',
								parent_id: '0',
								rec_type: '0'
							}).then(r => {
								if (r && r.error == 0) uni.showToast({ title: '已加入购物车', icon: 'success' })
								else uni.showToast({ title: (r && r.msg) || '加入失败', icon: 'none' })
							})
						}
					})
					return
				}

				this.goodsDetail = {
					attr: attrGroups,
					attr_pn_list: attrPnList,
					minimum: Number(item.minimum || item.min_num || 1),
					shop_price: item.shop_price || item.goods_price || ''
				}
				this.attrLength = attrGroups.length
				this.history = {}
				this.totalQuantity = 0
				this.totalPrice = 0

				// 3) 初始化：选择第一个有库存 skuKey，并把它映射到选中维度（selectedColor / seleceGoodsAtrrArray）
				const firstAvailableRow = attrPnList.find(r => Number(r?.value?.product_number || 0) > 0) || attrPnList[0]
				const firstSkuKey = firstAvailableRow ? String(firstAvailableRow.key) : ''

				if (firstSkuKey) {
					const parts = firstSkuKey.split('_')
					const colorId = Number(parts[0])
					const specId = Number(parts[1])

					// 为了和 cart.vue 弹窗结构匹配：让“selectedColor维度”在前，“spec计数维度”在最后
					if (!Number.isNaN(colorId) && !Number.isNaN(specId) && Array.isArray(this.goodsDetail.attr) && this.goodsDetail.attr.length >= 2) {
						const colorIdx = this.goodsDetail.attr.findIndex(g => Array.isArray(g.attr_key) && g.attr_key.some(v => Number(v.id) === colorId))
						const specIdx = this.goodsDetail.attr.findIndex(g => Array.isArray(g.attr_key) && g.attr_key.some(v => Number(v.id) === specId))
						if (colorIdx !== -1 && specIdx !== -1 && (colorIdx !== 0 || specIdx !== this.goodsDetail.attr.length - 1)) {
							const newArr = []
							newArr.push(this.goodsDetail.attr[colorIdx])
							this.goodsDetail.attr.forEach((g, idx) => {
								if (idx === colorIdx || idx === specIdx) return
								newArr.push(g)
							})
							newArr.push(this.goodsDetail.attr[specIdx])
							this.goodsDetail.attr = newArr
						}
					}

					// 设置维度类型：让生成 key 的第一维 id 对应 selectedColor（第一段）
					this.goodsDetail.attr.forEach(g => {
						const hasColor = Array.isArray(g.attr_key) && g.attr_key.some(v => Number(v.id) === colorId)
						g.attr_type = hasColor ? 1 : 2
					})

					this.setSkuSelectionByKey(firstSkuKey)
				}

				this.$nextTick(() => {
					this.$refs && this.$refs['goodsattr'] && this.$refs['goodsattr'].open()
				})
			},

			addCoudanGoods(item) {
				// 不直接加购：先弹出规格弹窗，用户确认后走 onAddCartClicked(0)
				this.openCoudanGoodsAttr(item)
			},
			//优惠券领取
			handelReceive(val, ru_id) {
				this.$store.dispatch('setGoodsCouponReceive', {
					cou_id: val
				}).then(({
					data: data
				}) => {
					// 先本地把当前券标记为已领取，保证弹窗按钮即时更新（无感）
					this.markCouponReceivedLocal(val)
					// 领取成功后，弹出自定义成功弹窗（与示例 success-toast 一致）
					// 不再用 uni.showToast，避免与自定义弹窗重复
					this.showCouponReceiveSuccessToast()

					this.$store.dispatch('setCoupons', {
						ru_id: ru_id
					})
				})
			},
			markCouponReceivedLocal(couponId) {
				const idStr = String(couponId || '')
				if (!idStr) return
				const markOne = (item) => {
					if (!item || typeof item !== 'object') return
					const currentId = item.cou_id || item.coupon_id || item.id
					if (String(currentId || '') !== idStr) return
					this.$set(item, 'is_received', 1)
					this.$set(item, 'cou_is_receive', 1)
					this.$set(item, 'receive_status', 1)
					this.$set(item, 'can_receive', 0)
					this.$set(item, 'button_status', 'disabled')
					this.$set(item, 'button_text', '已领取')
				}
				const store = this.couponPopupStore
				if (!store || !store.shop_preferential_panel) return
				const panel = store.shop_preferential_panel
				const modules = panel.preferential_modules || {}
				const couponModule = modules.coupon || {}
				if (Array.isArray(couponModule.items)) {
					couponModule.items.forEach(markOne)
				}
				if (Array.isArray(couponModule.coupon_cards)) {
					couponModule.coupon_cards.forEach(markOne)
				}
				const sections = Array.isArray(panel.sections) ? panel.sections : []
				sections.forEach((section) => {
					if (!section || section.section_key !== 'coupon' || !Array.isArray(section.items)) return
					section.items.forEach(markOne)
				})
			},

			// 成功提示弹窗（复刻 pages/cart/ces/styles.css）
			showCouponReceiveSuccessToast() {
				// 清理旧计时器，避免快速点击造成动画状态错乱
				if (this._couponReceiveSuccessTimer1) clearTimeout(this._couponReceiveSuccessTimer1)
				if (this._couponReceiveSuccessTimer2) clearTimeout(this._couponReceiveSuccessTimer2)

				this.couponReceiveSuccessVisible = true
				// 同步打开显示态，避免 nextTick 在某些小程序渲染时序下不触发
				this.couponReceiveSuccessShow = true

				this._couponReceiveSuccessTimer1 = setTimeout(() => {
					this.couponReceiveSuccessShow = false
				}, 1800)

				this._couponReceiveSuccessTimer2 = setTimeout(() => {
					this.couponReceiveSuccessVisible = false
				}, 2100)
			},
			//猜你喜欢
			goodsGuessHandle(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				// 返回 Promise，确保 showEvery 中的 Promise.all 能正确等待
				return this.$store.dispatch('setGoodsGuess', {
					warehouse_id: 0,
					area_id: 0,
					page: this.page,
					size: this.size
				}).catch((err) => {
					// 捕获错误，但不阻止 Promise.all 继续执行
					// 返回一个 resolved 的 Promise，避免影响 Promise.all
					return Promise.resolve();
				});
			},
			//删除购物车商品
			deleteCartGoods(val, is_gift) {
				let that = this

				// 处理赠品相关状态（保持原逻辑）
				if (is_gift) {
					that.checkGift = ''
					that.checkGiftArr = []
				}

				// 在删除前，先确定目标商品所在店铺及其选择状态
				let targetStoreIndex = -1;
				let targetStoreRuId = null;
				const currentGoodsCartList = Array.isArray(this.goodsCartList) ? this.goodsCartList : [];

				for (let i = 0; i < currentGoodsCartList.length; i++) {
					const store = currentGoodsCartList[i];
					const actList = Array.isArray(store.new_list) ? store.new_list : [];
					for (let j = 0; j < actList.length; j++) {
						const goodsList = Array.isArray(actList[j].act_goods_list) ? actList[j].act_goods_list : [];
						if (goodsList.some(g => g && g.rec_id === val)) {
							targetStoreIndex = i;
							// ru_id / store_id 二选一，后端接口使用 ru_id
							targetStoreRuId = store.ru_id || store.store_id || store.cart_ru_id || null;
							break;
						}
					}
					if (targetStoreIndex !== -1) break;
				}

				const wasAllChecked = this.checkedAll === true;
				const wasStoreChecked = targetStoreIndex !== -1 && Array.isArray(this.checkedShop)
					? this.checkedShop[targetStoreIndex] === true
					: false;

				uni.showModal({
					content: that.$t('lang.confirm_delete_goods'),
					success: function(res) {
						that.scrollLeft = 1
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
							});
							that.$store.dispatch('setCartGoodsDelete', {
								rec_id: val
							}).then(res => {
							
								if (res.error == 0) {
									uni.hideLoading()
									uni.showToast({
										title: that.$t('lang.delete_success'),
										icon: 'success'
									})

									// 删除成功后，仅针对当前店铺进行无感刷新

									// 如果未能定位到店铺或没有 ru_id，则退回到本地过滤方案（仅本地数组过滤）
									if (targetStoreIndex === -1 || !targetStoreRuId) {
										const fallbackList = that.goodsCartList.map(store => {
											const copy = { ...store };

											// 兼容旧结构：如果有 goods 数组，也一并过滤
											if (Array.isArray(copy.goods)) {
												copy.goods = copy.goods.filter(g => g && g.rec_id !== val);
											}

											// 关键：按渲染结构，从 new_list.act_goods_list 中删除目标商品
											const actList = Array.isArray(copy.new_list) ? copy.new_list.map(act => {
												const actCopy = { ...act };
												if (Array.isArray(actCopy.act_goods_list)) {
													actCopy.act_goods_list = actCopy.act_goods_list.filter(g => g && g.rec_id !== val);
												}
												return actCopy;
											}) : [];
											copy.new_list = actList;

											return copy;
										});
										that.$store.commit('goodsCartList', { data: fallbackList, preserveSelection: true });
										const lastRecId = that.calculateLastRecId(fallbackList);
										that.lastRecId = lastRecId;
										if (that.$isLogin && that.$isLogin()) {
											that.saveCartCache(fallbackList, lastRecId);
										}
									that.changeGoods();
										return;
									}

									// 生成版本号，与 goodsList 保持一致
									const version = incrementVersion();

									// 组装只针对当前店铺的 goodslist 请求参数
									const requestParams = {
										warehouse_id: 0,
										area_id: 0,
										app_version: version,
										isget_more_goods: false,
										ru_id: String(targetStoreRuId)
									};

									if (that.regionData && that.regionData.district && that.regionData.district.id) {
										requestParams.district_id = that.regionData.district.id;
									}

									// 仅刷新当前店铺的数据，避免全局大刷新
									apiShopping.getCartList(requestParams).then(cartRes => {
										const storeList = (cartRes && cartRes.data) ? cartRes.data : [];
										if (!Array.isArray(storeList)) {
											that.changeGoods();
											return;
										}

										// 【重要修正】如果返回空数组，说明该店铺下已经没有任何商品了，需要把这家店从本地列表中移除
										if (storeList.length === 0) {
											// 从本地购物车列表中删除该店铺
											const removedList = currentGoodsCartList.filter((_, idx) => idx !== targetStoreIndex);
											that.$store.commit('goodsCartList', { data: removedList, preserveSelection: true });

											const lastRecId = that.calculateLastRecId(removedList);
											that.lastRecId = lastRecId;
											if (that.$isLogin && that.$isLogin()) {
												that.saveCartCache(removedList, lastRecId);
											}

											// 同步清理选中状态数组，避免引用已删除店铺的索引
											if (Array.isArray(that.checkedShop)) {
												that.checkedShop.splice(targetStoreIndex, 1);
											}
											if (Array.isArray(that.checkedGoods)) {
												that.checkedGoods.splice(targetStoreIndex, 1);
											}

											// 如果之前是全局全选，需要对剩余店铺重建一次全选选中状态
											if (wasAllChecked) {
												that.checkedAll = true;

												const listAfterRemove = Array.isArray(that.goodsCartList) ? that.goodsCartList : [];
												listAfterRemove.forEach((store, storeIndex) => {
													if (Array.isArray(that.checkedShop)) {
														that.checkedShop.splice(storeIndex, 1, true);
													}

													if (!Array.isArray(that.checkedGoods[storeIndex])) {
														that.$set(that.checkedGoods, storeIndex, []);
													} else {
														that.checkedGoods[storeIndex] = [];
													}

													const actList = Array.isArray(store.new_list) ? store.new_list : [];
													actList.forEach(act => {
														const goodsList = Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
														goodsList.forEach(g => {
															if (!g) return;
															if (g.is_invalid != 1 && g.product_number > 0) {
																that.checkedGoods[storeIndex].push(g.rec_id);
																g.checked = true;
															} else {
																g.checked = false;
															}
														});
													});
												});
											}

											// 无论是否全选，都按当前选中集合重新计算一次价格
											that.changeGoods();
											return;
										}

										// 找到接口返回中对应 ru_id 的店铺（通常只有一个）
										let updatedStore = storeList.find(s => {
											const sRuId = s.ru_id || s.store_id || s.cart_ru_id;
											return String(sRuId) === String(targetStoreRuId);
										}) || storeList[0];

										// 使用新的店铺数据替换当前列表中的该店铺，其他店铺保持不变
										const mergedList = currentGoodsCartList.map((store, index) => {
											if (index !== targetStoreIndex) return store;
											return updatedStore;
										});

										that.$store.commit('goodsCartList', { data: mergedList, preserveSelection: true });

										const lastRecId = that.calculateLastRecId(mergedList);
										that.lastRecId = lastRecId;
										// 使用组件已有的登录判断逻辑，避免调用不存在的方法
										if (that.$isLogin && that.$isLogin()) {
											that.saveCartCache(mergedList, lastRecId);
										}

										// 根据删除前的全选状态恢复选中，并重新计算价格
										if (wasAllChecked) {
											// 【场景1】购物车全选：保持全选语义，新补商品也算选中
											that.checkedAll = true;

											const list = Array.isArray(that.goodsCartList) ? that.goodsCartList : [];

											list.forEach((store, storeIndex) => {
												// 店铺选中标记
												if (Array.isArray(that.checkedShop)) {
													that.checkedShop.splice(storeIndex, 1, true);
												}

												// 初始化或重置该店铺的选中商品数组
												if (!Array.isArray(that.checkedGoods[storeIndex])) {
													that.$set(that.checkedGoods, storeIndex, []);
												} else {
													that.checkedGoods[storeIndex] = [];
												}

												const actList = Array.isArray(store.new_list) ? store.new_list : [];
												actList.forEach(act => {
													const goodsList = Array.isArray(act.act_goods_list) ? act.act_goods_list : [];
													goodsList.forEach(g => {
														if (!g) return;
														// 只选中有效且有货的商品，排除失效/无货
														if (g.is_invalid != 1 && g.product_number > 0) {
															that.checkedGoods[storeIndex].push(g.rec_id);
															g.checked = true;
														} else {
															g.checked = false;
														}
													});
												});
											});

											// 直接按全选规则重新计算价格（内部会走 ru_id 列表那套逻辑）
											that.changeGoods();
										} else if (wasStoreChecked && targetStoreIndex !== -1) {
											// 单店铺全选：重置该店铺为未选中，再调用店铺全选逻辑
											if (Array.isArray(that.checkedShop)) {
												that.checkedShop.splice(targetStoreIndex, 1, false);
											}
											if (!Array.isArray(that.checkedGoods[targetStoreIndex])) {
												that.$set(that.checkedGoods, targetStoreIndex, []);
											} else {
												that.checkedGoods[targetStoreIndex] = [];
											}
											that.checkShop(
												false,
												that.goodsCartList[targetStoreIndex],
												targetStoreIndex,
												that.shopInvalidArr[targetStoreIndex],
												that.goodsCartList[targetStoreIndex].store_name
											);
											// checkShop 内部会调用 changeGoods，这里不再重复调用
										} else {
											// 其他情况（非全选场景），仅按当前选中状态重新计算价格
											that.changeGoods();
										}
									}).catch(err => {
										// 失败时至少保证价格正确
										that.changeGoods();
									});
								} else {
									uni.showToast({
										title: that.$t('lang.delete_fail'),
										icon: 'fail'
									})
								}
							})
						}
					}
				})

				this.scrollLeft = 0;
			},
			//编辑
			onEdit() {
				this.batchEdit = this.batchEdit ? false : true
			},
			// 清空
			onDelete() {
				var that = this
				uni.showModal({
					content: '您确定要清空购物车吗？',
					success: function(res) {
						that.scrollLeft = 1
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
							});
							that.$store.dispatch('setCartBatchDelete', {
								rec_id: that.checkedGoodsId
							}).then(res => {
								if (res.error == 0) {
									uni.showToast({
										title: that.$t('lang.empty_success'),
										icon: 'success'
									});
									// 清空成功后，重置编辑状态，退出批量编辑模式
									that.batchEdit = false;
									that.goodsList()
								} else {
									uni.showToast({
										title: that.$t('lang.empty_fail'),
										icon: 'none'
									})
								}
							})
						}
					}
				})

				this.scrollLeft = 0;
			},
			//批量删除
			onBatchDelete() {
				this.deleteCartGoods(this.checkedGoodsId);
			},
			//关闭弹出层
			handelClose(val) {
				if (val == 'gift') {
					this.giftShow = false
				} else if (val == 'favourable') {
					this.favourableShow = false
				} else if (val == 'coupon') {
					this.couponShow = false
					this.couponPopupStore = null
					this.couponPopupRuId = null
					this.$set(this.popHeight, 'couponPopupTotalPx', 0)
					this.$set(this.popHeight, 'couponPopupScrollPx', 0)
				} else if (val == 'coudan') {
					this.closeCoudanPopup()
				} else if (val == 'manjian') {
					this.closeManjianPopup()
				} else if (val == 'storeDiscount') {
					this.closeStoreDiscountDetail()
				}
				if (this.$refs[val] && typeof this.$refs[val].close === 'function') {
					this.$refs[val].close()
				}
			},
			// 点击配件商品
			productLink(item) {
				if (item.extension_code == 'package_buy') {
					uni.navigateTo({
						url: '/pagesA/package/package'
					})
				} else {
					uni.navigateTo({
						url: `/pagesC/goodsDetail/goodsDetail?id=${item.goods_id}`
					})
				}
			},
			//提交购物车到结算页面
			// onSubmit() {
			// 	let aa = uni.getStorageSync("issubmit")
			// 	if (this.addressList.length == 0) {
			// 		uni.showModal({
			// 			content: this.$t('lang.goto_add_address'),
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 					uni.navigateTo({
			// 						url: '/pagesB/address/addressEdit'
			// 					})
			// 				}
			// 			}
			// 		});
			// 	} else {
			// 		this.loading = true
			// 		this.disabled = true
			// 		var indexOne = 0
			// 		for (var i = 0; i < this.checkedGoods.length; i++) {
			// 			if (this.checkedGoods[i].length > 0) {
			// 				indexOne = indexOne + 1
			// 			}
			// 		}
		
			// 		if (indexOne > 5) {
			// 			uni.showToast({
			// 				title: '每次结算店铺最多5家，请重新选择',
			// 				icon: 'none'
			// 			})
			// 			// this.checkAll()
			// 			this.loading = false
			// 			this.disabled = false
			// 			return;
			// 		}


			// 		// 提交结算
			// 		const ab = this.checkedGoods.reduce((acc, val) => acc.concat(val), []);
	
			// 		const keysToCheck = ab;
			// 		const objaa = uni.getStorageSync('issubmit');
		
			// 		if (Object.keys(objaa).length === 0) {
			// 			let ef = ab.map(num => [num])
			// 			uni.setStorageSync("cat_rec_id", ef);
			// 			uni.setStorageSync("isyong", 1);
			// 		} else {
			// 			const result = [];
			// 			keysToCheck.forEach(key => {
			// 				if (objaa.hasOwnProperty(key)) {
			// 					result.push([key, objaa[key]]);
			// 				} else {
			// 					result.push([key, []]);
			// 				}
			// 			});
			// 			const originalArray = result;
			// 			const upArr = originalArray.flatMap(([key, values]) => [
			// 				[key],
			// 				...values.map(value => [value])
			// 			]);
			// 			uni.setStorageSync("cat_rec_id", upArr);
			// 			uni.setStorageSync("isyong", 1);
			// 			uni.setStorageSync('issubmit', {})
			// 		}

			// 		let fald = true
			// 		//验证库存是否不足
			// 		this.goodsCartList.forEach((f) => {
			// 			f.new_list.forEach((act) => {
			// 				act.act_goods_list.forEach((g) => {
			// 					if (g.product_number == 0 && g.is_checked == true) {
			// 						uni.showToast({
			// 							title: g.goods_name + this.$t(
			// 								'lang.understock_not_submit'),
			// 							icon: 'none'
			// 						});
			// 						fald = false
			// 						return false
			// 					}

			// 					if (g.is_invalid == 1 && g.is_checked == true) {
			// 						uni.showToast({
			// 							title: g.goods_name + this.$t(
			// 								'lang.goods_soldout_not_submit'),
			// 							icon: 'none'
			// 						});
			// 						fald = false
			// 						return false
			// 					}

			// 					if (g.xiangou_error > 0 && g.is_checked == true) {
			// 						let msg = ''
			// 						if (g.xiangou_can_buy_num > 0) {
			// 							msg = g.goods_name + this.$t('lang.purchase_only') + g
			// 								.xiangou_can_buy_num + '件'
			// 						} else {
			// 							msg = g.goods_name + this.$t('lang.restriction_is_full')
			// 						}
			// 						uni.showToast({
			// 							title: msg,
			// 							icon: 'none'
			// 						});
			// 						fald = false
			// 						return false
			// 					}
			// 				})
			// 			})
			// 		})

			// 		if (this.checkedGoodsId.length > 0 && fald) {
			// 			let rec_id = ''
			// 			let rec_id_first = ''
			// 			let arr = []

			// 			this.goodsCartList.forEach((v, i) => {
			// 				arr[i] = [];
			// 				v.new_list.forEach((act) => {
			// 					act.act_goods_list.forEach(goods => {
			// 						if (goods.store_count > 0 && goods.is_checked > 0) {
			// 							arr[i].push(goods.rec_id)
			// 						}
			// 					})
			// 				})
			// 			})

			// 			if (arr.length > 0) {
			// 				arr.forEach((v, i) => {
			// 					if (v.length == 0) {
			// 						arr.splice(i, 1)
			// 					}
			// 				})

			// 				if (arr[0]) {
			// 					arr[0].forEach(v => {
			// 						rec_id_first += v + ','
			// 					})
			// 				}

			// 				rec_id = rec_id_first.substr(0, rec_id_first.length - 1)
			// 			}

			// 			if (this.$isLogin()) {
			// 				if (rec_id) {
			// 					uni.navigateTo({
			// 						// url: '/pagesD/checkout/checkout?type=true&rec_id=' + rec_id + '&save_price=' + this.save_price + '&affiliate_infovalue=' + this.affiliate_infovalue
			// 						url: '/pagesD/checkout/checkout?type=true&rec_id=' + rec_id +
			// 							'&affiliate_infovalue=' + this.affiliate_infovalue + '&isyong=1'
			// 					})
			// 				} else {
			// 					uni.navigateTo({
			// 						url: '/pagesD/checkout/checkout?affiliate_infovalue=' + this
			// 							.affiliate_infovalue + '&isyong=1'
			// 						// url: '/pagesD/checkout/checkout?save_price=' + this.save_price + '&affiliate_infovalue=' + this.affiliate_infovalue
			// 					})
			// 				}
			// 			} else {
			// 				uni.showModal({
			// 					content: this.$t('lang.login_user_not'),
			// 					success: (res) => {
			// 						if (res.confirm) {
			// 							uni.navigateTo({
			// 								url: '/pagesB/login/login?delta=1'
			// 							})
			// 						}
			// 					}
			// 				})
			// 			}
			// 		}
			// 		// })
			// 	}

			// },
			
			onSubmit() {
			    // 防止多次点击：如果已经在加载中或已禁用，则直接返回
			    if (this.loading || this.disabled) {
			        return;
			    }
			    
			    let aa = uni.getStorageSync("issubmit")
			    if (this.addressList.length == 0) {
			        uni.showModal({
			            content: this.$t('lang.goto_add_address'),
			            success: (res) => {
			                // 操作完成后恢复按钮状态
			                this.loading = false;
			                this.disabled = false;
			                if (res.confirm) {
			                    uni.navigateTo({
			                        url: '/pagesB/address/addressEdit'
			                    })
			                }
			            },
			            // 模态框关闭时无论成功失败都恢复状态
			            fail: () => {
			                this.loading = false;
			                this.disabled = false;
			            },
			            complete: () => {
			                this.loading = false;
			                this.disabled = false;
			            }
			        });
			        return;
			    } else {
			        // 首次点击后立即禁用
			        this.loading = true;
			        this.disabled = true;
			        
			        var indexOne = 0
			        for (var i = 0; i < this.checkedGoods.length; i++) {
			            if (this.checkedGoods[i].length > 0) {
			                indexOne = indexOne + 1
			            }
			        }
			      
			        // if (indexOne > 5) {
			        //     uni.showToast({
			        //         title: '每次结算店铺最多5家，请重新选择',
			        //         icon: 'none'
			        //     })
			        //     // 恢复按钮状态
			        //     this.loading = false;
			        //     this.disabled = false;
			        //     return;
			        // }
			
			
			        // 提交结算（不再用 checkedGoods 覆盖 cat_rec_id，只信 reckon_cartgoods 写入的值）
			        const ab = this.checkedGoods.reduce((acc, val) => acc.concat(val), []);
			        const keysToCheck = ab;
			        const objaa = uni.getStorageSync('issubmit');
			     
			        if (Object.keys(objaa).length === 0) {
			            uni.setStorageSync("isyong", 1);
			        } else {
			            const result = [];
			            keysToCheck.forEach(key => {
			                if (objaa.hasOwnProperty(key)) {
			                    result.push([key, objaa[key]]);
			                } else {
			                    result.push([key, []]);
			                }
			            });
			            uni.setStorageSync("isyong", 1);
			            uni.setStorageSync('issubmit', {})
			        }
			
			        let fald = true
			        //验证库存是否不足
			        this.goodsCartList.forEach((f) => {
			            if (!fald) return; // 如果已经验证失败，不再执行后续循环
			            
			            f.new_list.forEach((act) => {
			                if (!fald) return; // 如果已经验证失败，不再执行后续循环
			                
			                act.act_goods_list.forEach((g) => {
			                    if (g.product_number == 0 && g.is_checked == true) {
			                        uni.showToast({
			                            title: g.goods_name + this.$t(
			                                'lang.understock_not_submit'),
			                            icon: 'none'
			                        });
			                        fald = false
			                        return;
			                    }
			
			                    if (g.is_invalid == 1 && g.is_checked == true) {
			                        uni.showToast({
			                            title: g.goods_name + this.$t(
			                                'lang.goods_soldout_not_submit'),
			                            icon: 'none'
			                        });
			                        fald = false
			                        return;
			                    }
			
			                    if (g.xiangou_error > 0 && g.is_checked == true) {
			                        let msg = ''
			                        if (g.xiangou_can_buy_num > 0) {
			                            msg = g.goods_name + this.$t('lang.purchase_only') + g
			                                .xiangou_can_buy_num + '件'
			                        } else {
			                            msg = g.goods_name + this.$t('lang.restriction_is_full')
			                        }
			                        uni.showToast({
			                            title: msg,
			                            icon: 'none'
			                        });
			                        fald = false
			                        return;
			                    }
			                })
			            })
			        })
			
		            if (this.checkedGoodsId.length > 0 && fald) {
		                let rec_id = ''
		                let rec_id_first = ''
		                let arr = []

		                this.goodsCartList.forEach((v, i) => {
		                    arr[i] = [];
		                    v.new_list.forEach((act) => {
		                        act.act_goods_list.forEach(goods => {
		                            if (goods.store_count > 0 && goods.is_checked > 0) {
		                                arr[i].push(goods.rec_id)
		                            }
		                        })
		                    })
		                })

		                if (arr.length > 0) {
		                    arr.forEach((v, i) => {
		                        if (v.length == 0) {
		                            arr.splice(i, 1)
		                        }
		                    })

		                    if (arr[0]) {
		                        arr[0].forEach(v => {
		                            rec_id_first += v + ','
		                        })
		                    }

		                    rec_id = rec_id_first.substr(0, rec_id_first.length - 1)
		                }
		                
	                // 判断是否全选，决定 is_all_check 和 cat_rec_id 参数
	                const isAllCheck = this.checkedAll ? 1 : 0;
	                let catRecId = '';
	                let ruIdStr = '';
	                
	                // 收集所有选中商品所在的店铺ID
	                const selectedStoreIds = [];
	                this.goodsCartList.forEach((store) => {
	                    let hasSelectedGoods = false;
	                    store.new_list.forEach((act) => {
	                        act.act_goods_list.forEach((goods) => {
	                            if (goods.checked && goods.is_invalid != 1 && goods.product_number > 0) {
	                                hasSelectedGoods = true;
	                            }
	                        });
	                    });
	                    if (hasSelectedGoods && store.store_id && !selectedStoreIds.includes(store.store_id)) {
	                        selectedStoreIds.push(store.store_id);
	                    }
	                });
	                ruIdStr = selectedStoreIds.join(',');
	                
	                if (!this.checkedAll) {
	                    // 上传给后端的 cat_rec_id 必须是字符串；存储里可能是字符串或数组，此处统一转成逗号拼接
	                    const raw = uni.getStorageSync('cat_rec_id');
	                    let fromStorage = '';
	                    if (raw != null && raw !== '') {
	                        if (typeof raw === 'string') {
	                            fromStorage = raw.trim();
	                        } else if (Array.isArray(raw)) {
	                            const flat = raw.flat(Infinity).filter(v => v != null && v !== '');
	                            fromStorage = flat.join(',');
	                        } else {
	                            fromStorage = String(raw);
	                        }
	                    }
	                    if (fromStorage) {
	                        catRecId = fromStorage;
	                    } else {
	                        const allSelectedIds = [];
	                        this.goodsCartList.forEach((store) => {
	                            store.new_list.forEach((act) => {
	                                act.act_goods_list.forEach((goods) => {
	                                    if (goods.checked && goods.is_invalid != 1 && goods.product_number > 0) {
	                                        allSelectedIds.push(goods.rec_id);
	                                    }
	                                });
	                            });
	                        });
	                        catRecId = allSelectedIds.join(',');
	                    }
	                }

	                if (this.$isLogin()) {
	                    // 清除全选状态，防止返回时仍然是选中状态
	                    this.checkedAll = false;
	                    
	                    if (rec_id) {
	                        uni.navigateTo({
	                            url: '/pagesD/checkout/checkout?type=true&rec_id=' + rec_id +
	                                '&affiliate_infovalue=' + this.affiliate_infovalue + 
	                                '&isyong=1&is_all_check=' + isAllCheck + 
	                                '&cat_rec_id=' + catRecId +
	                                '&ru_id=' + ruIdStr,
	                            // 导航完成后恢复按钮状态
	                            complete: () => {
	                                this.loading = false;
	                                this.disabled = false;
	                            }
	                        })
	                    } else {
	                        uni.navigateTo({
	                            url: '/pagesD/checkout/checkout?affiliate_infovalue=' + this
	                                .affiliate_infovalue + '&isyong=1&is_all_check=' + isAllCheck + 
	                                '&cat_rec_id=' + catRecId +
	                                '&ru_id=' + ruIdStr,
		                            // 导航完成后恢复按钮状态
		                            complete: () => {
		                                this.loading = false;
		                                this.disabled = false;
		                            }
		                        })
	                    }
		                } else {
		                    uni.showModal({
		                        content: this.$t('lang.login_user_not'),
		                        success: (res) => {
		                            // 恢复按钮状态
		                            this.loading = false;
		                            this.disabled = false;
		                            if (res.confirm) {
		                                uni.navigateTo({
		                                    url: '/pagesB/login/login?delta=1'
		                                })
		                            }
		                        },
		                        // 模态框关闭时恢复状态
		                        fail: () => {
		                            this.loading = false;
		                            this.disabled = false;
		                        },
		                        complete: () => {
		                            this.loading = false;
		                            this.disabled = false;
		                        }
		                    })
		                }
		            } else {
		                // 没有选中商品或验证失败时恢复状态
		                this.loading = false;
		                this.disabled = false;
		            }
			    }
			},
			
			
			shopStoreCart(index) {
				let rec_id = ''
				if (this.$isLogin()) {
					this.goodsCartList.forEach((v, i) => {
						if (index == i) {
							v.new_list.forEach((act) => {
								act.act_goods_list.forEach(goods => {
									if (goods.store_count > 0 && goods.is_checked > 0) {
										rec_id += goods.rec_id + ','
									}
								})
							})
						}
					})

					rec_id = rec_id.substr(0, rec_id.length - 1)

					if (rec_id.length > 0) {
						uni.navigateTo({
							url: '/pagesC/store/store?rec_id=' + rec_id
						})
					} else {
						uni.showToast({
							title: this.$t('lang.select_store_goods'),
							icon: 'none'
						});
					}
				} else {
					
					uni.showModal({
						content: this.$t('lang.login_user_not'),
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
				}
			},
			//自定义更新地区信息
			customUpdateRegion(e) {
				this.regionData = e;
				//更新列表
				this.goodsList();
			},

			toShopHome: function(item) {
			
				uni.navigateTo({
					url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
				})
			},
			linkHref(seckill_id, goods_id) {
				//如果是秒杀商品跳转到秒杀详情
				// if (seckill_id != 0) {
				// 	uni.navigateTo({
				// 		url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
				// 			'&tomorrow=0&delta=2'
				// 	});
				// } else {
				// 	uni.navigateTo({
				// 		url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				// 	})
				// }
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
		},
		onPullDownRefresh() {
			var that = this
			// 未登录不发起请求
			const token = uni.getStorageSync('token');
			if (!token || token === '') {
				uni.stopPullDownRefresh();
				return;
			}
			// 上一个下拉刷新请求未完成，不再触发
			if (that._isPullRefreshing) {
				uni.stopPullDownRefresh();
				return;
			}
			that.new_one_list = []
			
			// 【优化问题2】下拉刷新时，如果有选中商品，立即显示"计算中"状态，提前调用金额计算
			const saved = readSavedSelectionState();
			const hasSelectedGoods = saved && Array.isArray(saved.selectedRecIds) && saved.selectedRecIds.length > 0;
			
			if (hasSelectedGoods) {
				that.totalPriceTiping = false;
				that.loading = true;
			} else {
				that.totalPrice = 0
				that.count = 0
			}
			
			that.initData();
		},
	mounted() {
		// 【关键】监听其他页面加购后的统一同步事件
		this.cartDataUpdatedHandler = (data) => {
			const mode = data && data.mode ? data.mode : ''
			// fallback 才需要静默拉新；patch 场景仅静默重算金额即可
			if (mode === 'fallback-refresh' || mode === 'fallback') {
				this.goodsList(true, true).catch(() => {})
			}
			this.changeGoods(true)
		}
		uni.$on('cart-data-updated', this.cartDataUpdatedHandler);

		// 清理早期监控
		if (this.earlyMonitorInterval) {
			clearInterval(this.earlyMonitorInterval);
			this.earlyMonitorInterval = null;
		}

		// 【调试】添加全局监控，检查 _storeAllLoadedMap 的状态变化
		let lastStoreAllLoadedMapState = this._storeAllLoadedMap;
		this._debugInterval = setInterval(() => {
			if (this._storeAllLoadedMap !== lastStoreAllLoadedMapState) {
				lastStoreAllLoadedMapState = this._storeAllLoadedMap;
			}

			if (this._storeAllLoadedMap === undefined) {
				// 重新初始化
				this._storeAllLoadedMap = {};
				lastStoreAllLoadedMapState = this._storeAllLoadedMap;
			}
		}, 500); // 每500ms检查一次

		// 清理调试定时器
		if (this._debugInterval) {
			clearInterval(this._debugInterval);
			this._debugInterval = null;
		}

		// #ifdef H5
		// 防止键盘弹起时页面移动
		this.handleWindowResize = () => {
			// 当键盘弹起时，保持页面高度不变
			const pageBody = document.querySelector('.uni-page-body');
			if (pageBody) {
				pageBody.style.height = window.innerHeight + 'px';
			}
		};
		window.addEventListener('resize', this.handleWindowResize);
		// #endif
	},
	
	beforeDestroy() {
		this.stopFlashSaleTimer();
		if (this.cartDataUpdatedHandler) {
			uni.$off('cart-data-updated', this.cartDataUpdatedHandler)
			this.cartDataUpdatedHandler = null
		}
		// 清理调试定时器
		if (this._debugInterval) {
			clearInterval(this._debugInterval);
			this._debugInterval = null;
		}

		// 清理早期监控
		if (this.earlyMonitorInterval) {
			clearInterval(this.earlyMonitorInterval);
			this.earlyMonitorInterval = null;
		}

		// #ifdef H5
		// 移除键盘事件监听
		if (this.handleWindowResize) {
			window.removeEventListener('resize', this.handleWindowResize);
		}
		// #endif
	},
	
	onReady() {
		const {
			windowHeight,
			windowWidth
		} = uni.getSystemInfoSync();
		this.vw = windowWidth;
		this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
		this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
		this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
		// 优惠 / 领券 / 店铺优惠明细弹窗：
		// H5 和真机上高度偏矮，这里提高到视窗高度约 75%，同时给一个绝对上限，避免超出屏幕
		const scrollBase = parseInt(windowHeight * 0.75);
		this.couponPopupScrollH = Math.min(650, scrollBase);
		this.storeDiscountPopupScrollH = Math.min(650, scrollBase);

		// 【关键修复】页面ready后再确认tab显示状态
		setTimeout(() => {
			this.forceShowTabBar();
		}, 100);
	},
	onShow() {
	  this.startFlashSaleTimer();
	  // 【关键修复】强制显示底部tab，不受页面逻辑影响
	  this.forceShowTabBar();
	  const launchState = getCartLaunchState();
	  const isColdStartEnter = !!(launchState && launchState.isColdStart);

	  // 与「我的」等页一致：未登录不展示采购车，直接进登录
	  const tokenGate = uni.getStorageSync('token');
	  if (!tokenGate || tokenGate === '' || tokenGate === undefined) {
		  uni.navigateTo({ url: '/pagesB/login/login?delta=1' });
		  return;
	  }
	  this.restoreAddressCache();

	  // 【关键修复】onShow 中的所有操作都异步执行，不阻塞 tab 切换
	  // 使用 setTimeout(0) 确保在当前调用栈执行完后才执行，让 tab 切换立即生效
	  setTimeout(() => {
	    // 从其他页面返回时，立即禁用结算按钮，等待价格计算完成后再启用
	    this.disabled = true;
	    // 注意：loading 状态稍后根据是否有缓存来决定是否设置
	    
	    const currentUserId = String(uni.getStorageSync('user_id') || '');
	    const lastUserId = this._lastCartUserId || '';
	    if (lastUserId && currentUserId && currentUserId !== lastUserId) {
	      this.clearCartCache();
	      this.clearAddressCache();
	      clearSavedSelectionState();
	      this.$store.commit('goodsCartList', { data: [] });
	      this.totalPrice = '0.00';
	      this.totalPriceTiping = true;
	      this.count = 0;
	      this.nums = 0;
	      this.checkedGoodsId = [];
	      this.checkedAll = false;
	      this._globalAllSelectedMode = false;
	    }
	    this._lastCartUserId = currentUserId;
	    
	    // 先检查是否有缓存，决定是否显示 loading3 和 loading
	    const token = uni.getStorageSync('token');
	    const isLoggedIn = token && token !== '';
	    const freshSyncTsRaw = uni.getStorageSync('__cart_sync_fresh_ts__');
	    const freshSyncTs = Number(freshSyncTsRaw || 0);
	    // 15 秒内认为“刚从详情/其他入口同步过新数据”，应避免被旧缓存覆盖
	    const shouldSkipCacheRestore = !Number.isNaN(freshSyncTs) && freshSyncTs > 0 && (Date.now() - freshSyncTs < 15000);
	    
	    // 【方案1修复】区分"有缓存"和"有数据"
	    // hasCache: 只要缓存存在就算有缓存（包括空数组）
	    // hasData: 判断缓存中是否有数据
	    let hasCache = false;
	    let hasData = false;
	    
	    if (isLoggedIn) {
	      const cache = this.loadCartCache();
	      console.log('[cart][onShow] loadCartCache =', cache && {
		      hasGoods: Array.isArray(cache.goodsCartList) ? cache.goodsCartList.length : 0,
		      lastRecId: cache.lastRecId
	      });
	      if (cache) {
	        // 缓存存在，无论数据是否为空都算有缓存
	        hasCache = true;
	        // 判断缓存中是否有数据
	        if (Array.isArray(cache.goodsCartList)) {
	          hasData = cache.goodsCartList.length > 0;
	        }
	      }

	      if (hasCache && !shouldSkipCacheRestore) {
	        this._skipShowEveryGoodsListOnce = true;
	        // 【核心修复】有缓存时（包括空数组），立即恢复缓存数据，不显示骨架屏
	        // 立即恢复缓存数据（同步执行）
	        this.$store.commit('goodsCartList', { data: cache.goodsCartList || [] });
	        this.lastRecId = cache.lastRecId;
	        this.isFirstLoad = false;
	        if (!Number.isNaN(cache.count)) {
	        	this.count = cache.count;
	        }
	        if (!Number.isNaN(cache.nums)) {
	        	this.nums = cache.nums;
	        }

	        // 标记为已初始化，避免 goodsList() 中重复处理
	        this._initialized = true;

	        // 强制更新，确保computed属性响应
	        this.$forceUpdate();

	        // 【核心】有缓存时直接设置loading3=false，立即显示缓存数据（包括空状态），无感知加载
	        this.loading3 = false;
	        this.dataLoading = false;

	        setTimeout(() => {
	          this.processCartData(cache.goodsCartList || []);
	          this.handleSelectionAfterFetch();
	          if (hasData) {
	            this.changeGoods(true);
	            setTimeout(() => {
	              this.verifyOrderedItems().then(orderedItems => {
	                if (orderedItems && orderedItems.length > 0) {
	                  this.removeOrderedItems(orderedItems);
	                }
	              }).catch(error => {
	                console.error('[onShow] 异步验证订单状态失败:', error);
	              });
	            }, 1500);
	          } else {
	            this.loading = false;
	            this.totalPriceTiping = true;
	            this.totalPrice = '0.00';
	            this.count = 0;
	            this.nums = 0;
	          }

	          this.isSilentUpdating = true;
	          this.goodsList(true, true).finally(() => {
	            this.isSilentUpdating = false;
	          });
	        }, 50);
	      } else {
	        if (hasCache && shouldSkipCacheRestore) {
	          this._skipShowEveryGoodsListOnce = true;
	          // 刚完成 add_v1 同步：跳过旧缓存恢复 + 立即静默拉取最新购物车
	          this.loading3 = false;
	          this.loading = false;
	          this.dataLoading = false;
	          this._initialized = true;

	          this.goodsList(true, true).finally(() => {
	            try { uni.removeStorageSync('__cart_sync_fresh_ts__') } catch (e) {}
	            // 同步后需要恢复选中状态，避免 UI 依赖选中数组导致显示错乱
	            this.handleSelectionAfterFetch();
	          });
	        } else {
	        this._skipShowEveryGoodsListOnce = false;
	        // 【核心修复】只在真正无缓存时才显示骨架屏和loading
	        this.loading3 = true;
	        this.loading = true; // 无缓存时，需要显示 loading 遮罩
	        this.totalPriceTiping = false;
	        }
	      }
	    } else {
	      this._skipShowEveryGoodsListOnce = false;
	      // 【未登录优化】未登录时购物车肯定是空的，不需要显示 loading/骨架屏
	      this.loading3 = false; // 不显示骨架屏
	      this.dataLoading = false; // 不显示数据加载中
	      // 确保 goodsCartList 是空数组（如果还没有初始化）
	      if (!this.goodsCartList || this.goodsCartList.length > 0) {
	        this.$store.commit('goodsCartList', { data: [] });
	      }
	      
	      // 未登录时只加载"猜你喜欢"，不调用购物车接口
	      if (this.refreshTimer) clearTimeout(this.refreshTimer);
	      this.refreshTimer = setTimeout(() => {
	        this.goodsGuessHandle(1);
	      }, 300);
	      
	      // 未登录时不需要调用 showEvery()，直接返回
	      return;
	    }
	    
	    // 使用防抖，避免频繁请求
	    // 【关键修复】确保tab能正常显示后再执行数据加载
	    // 只有已登录时才调用 showEvery()
	    if (this.refreshTimer) clearTimeout(this.refreshTimer);
	    this.refreshTimer = setTimeout(() => {
	      this.showEvery();
	    }, 300);
	  }, 0); // 使用 setTimeout(0) 确保异步执行，不阻塞 tab 切换
	},

		onLoad(e) {
			// 【关键修复】onLoad 立即返回，所有操作异步执行，不阻塞页面切换
			setTimeout(() => {
				let that = this

				// #ifdef MP-WEIXIN
				that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				uni.getSystemInfo({ //获取系统信息
					success: res => {
						that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res.statusBarHeight) *
							2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
					}
				})
				// #endif

				// 判断为 iPhone X 给予底部距离
				uni.getSystemInfo({
					success: function(res) {
						let modelmes = res.model;
						let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
							'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
							'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
							'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
							'iPhone 14 Pro', 'iPhone 14 Pro Max'
						]
						iphoneArr.forEach(function(item) {
							if (modelmes.search(item) != -1) {
								that.isIpx = true
							}
						})
					}
				})
				that.showLoadMore = true
			}, 0);
		},

		watch: {
			loading3: {
				handler(newVal, oldVal) {
				},
				immediate: true
			},
			couponShow(val) {
				if (!val) {
					this.$set(this.popHeight, 'couponPopupTotalPx', 0);
					this.$set(this.popHeight, 'couponPopupScrollPx', 0);
				}
			},
			goodsCartList: {
				handler(newVal, oldVal) {
				},
				immediate: true,
				deep: false
			},
			// goodsCartList() {
			// 	let obj = {}
			// 	let arr = []
			// 	let shopArr = []
			// 	let shopArr2 = []
			// 		this.loading3 = false
			// 	let shopState = false
			// 	let shopInvalid = false
			// 	this.dscLoading = false
			
				
			// 	if (this.default) {
			// 		this.checkedGoodsId = []
			// 		this.checkedGoods.forEach((v, index) => {
			// 			v.forEach(i => {
			// 				this.checkedGoodsId.push(i)
			// 			})
			// 		})

			// 		this.allGoodsListId.forEach((v, index) => {
			// 			arr[index] = []

			// 			v.forEach(i => {
			// 				obj = {
			// 					id: i,
			// 					type: false
			// 				}

			// 				arr[index].push(obj)
			// 			})
			// 		})

			// 		this.stepDisabled = arr

			// 		//初始化选中商品
			// 	}

			// 	this.checkedAllDisabled = false

			// 	this.goodsCartList.forEach((v, index) => {
			// 		shopArr[index] = []
			// 		shopState = false
			// 		let cont = 0
			// 		v.new_list.forEach((act) => {
			// 			act.act_goods_list.forEach(goods => {
			// 				//选中门店
			// 				if (goods.store_count > 0) {
			// 					shopState = true
			// 				}

			// 				if (goods.is_invalid > 0) {
			// 					cont++
			// 					this.checkedAllDisabled = true
			// 				}
			// 			})
			// 		})
			// 		shopArr[index].push(shopState);
			// 		shopArr2.push(cont > 0 ? true : false);
			// 	})

			// 	//门店自提按钮
			// 	this.shopStore = shopArr
			// 	//店铺下商品是否失效
			// 	this.shopInvalidArr = shopArr2
			// },
			 goodsCartList: {
			    handler(newVal) {
			      // 如果还没有完成初始化，不执行复杂的数据处理
			      if (!this._initialized || !newVal || newVal.length === 0) return;
			      
			      if (this._dataProcessingTimer) clearTimeout(this._dataProcessingTimer);
			      this._dataProcessingTimer = setTimeout(() => {
			        this.processCartData(newVal);
			      }, 50);
			    },
			    immediate: false,
			    deep: false
			  },
		count() {
			//获取购物车数量
			// 只有在价格计算完成后才更新 disabled 状态
			if (this.totalPriceTiping) {
				if (this.count > 0) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			}
		},
			regionShow() {
				if (this.regionShow) {
					this.regionLoading = true
				}
			},

		}
	}
</script>

<style lang="scss">
	/* 防止键盘弹起时页面移动（和 user.vue 一样的方案） */
	page {
		background: #F6F6F6;
		width: 100%;
		height: 100%;
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		position: relative;
		/* #endif */
	}
	
	.user-default {
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		/* #endif */
	}

	.container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
	}

	/* 导航 start */
	.nav_bar {
		background-color: #fff;
		.status_bar {
			background-color: #fff;
			height: var(--status-bar-height);
			width: 100%;
		}
	}

	/* 导航 end */

	::-webkit-scrollbar {
		display: none;
	}

	.activity-tag {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
	}

	.parts-tag {
		left: -6rpx;
	}

	.header-address {
		// display: flex;
		// flex-direction: row;
		// justify-content: space-between;
		background-color: #fff;
		margin-bottom: 16rpx;
		box-sizing: border-box;

		/* #ifdef APP-PLUS */
		width: 100%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 100%;
		margin-left: 0;
		margin-top: 0;
		/* #endif */
		padding: 20upx 20rpx;

		.header-address-box {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			/* #ifdef APP-PLUS */
			width: 95%;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			width: 70%;
			margin-left: 20rpx;
			margin-top: -20rpx;

			/* #endif */
			.clear-out {
				/* #ifdef MP-WEIXIN */
				margin-top: 20rpx;
				/* #endif */
			}
		}
	}


	.header-address .address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 80%;
		/* #ifdef MP-WEIXIN */
		width: 70%;
		margin-top: 20rpx;
		/* #endif */
		line-height: 30rpx;
	}

	.header-address .address-box .iconfont {
		margin-right: 10upx;
	}

	/* 收货地址卡片（新版样式） */
	.address-section {
		background: #fff;
		/* 对齐示例的 checkout-content 左右 padding（15px -> 约 30rpx） */
		margin: 0 10rpx 20rpx;
		position: relative;
		cursor: pointer;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.address-section:active {
		background: #fafafa;
	}

	.address-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 24rpx 30rpx 16rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.address-header .location-icon {
		font-size: 36rpx;
		color: #ff4d4f;
		margin-right: 0;
	}

	.address-title {
		font-size: 26rpx;
		color: #999;
	}

	.address-content {
		padding: 16rpx 30rpx 24rpx;
		display: flex;
	}

	.address-section .address-info {
		display: flex;
		align-items: center;
		gap: 24rpx;
		margin-bottom: 16rpx;
	}

	.address-section .receiver-name {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}

	.address-section .receiver-phone {
		font-size: 28rpx;
		color: #666;
	}

	.address-section .address-detail {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		padding-right: 60rpx;
	}

	.address-section .arrow-icon {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.card-goods {}

	.card-goods-group {
	
		margin: 0 10rpx 16rpx;
		padding: 20rpx 0 20rpx 20rpx;
		background: #FFFFFF;
		border-radius: 8px;

	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// padding: 0 0 20upx;
		flex-wrap: nowrap;

		.head-left {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;

			.checkbox-con {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 32rpx;
				color: #272727;
				line-height: 28rpx;
				vertical-align: bottom;
				flex: 1;
				min-width: 0;
				overflow: hidden;

				.goods-name-text {
					line-height: 40rpx;
					display: inline-block;
					vertical-align: bottom;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.goods-tag {
					background-color: #FE0302;
					color: #ffffff;
					border-radius: 10rpx;
					padding: 0rpx 12rpx;
					font-size: 22rpx;
					margin-right: 10rpx;
					margin-left: 10rpx;
					line-height: 28rpx;
					/* 保持行高一致 */
					// display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
				}
			}

			.shop-acquiescel {
				width: 44rpx;
				height: 40rpx;
				margin-right: 6px;
			}
		}

	}

	.card-shop-head .head-left,
	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;

	}

	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4rpx 20rpx 4rpx 0;
		min-height: fit-content;
		flex-shrink: 0;

		.store-text-btn {
			background: none;
			border: none;
			color: #999;
			font-size: 26rpx;
			padding: 0;
			margin-left: auto;
		}

		.store-text-btn:active {
			opacity: 0.6;
		}

		.head-right-left {
			display: flex;
			align-items: center;

			.full_reduction {
				border-radius: 8rpx;
				border: 2rpx solid #FE0302;
				color: #FE2F02;
				margin-right: 8px;
				display: inline-block;
				font-size: 24rpx;
				padding: 4rpx 6rpx;
				/* 增加垂直内边距 */
				line-height: 1.1;


				padding: 4rpx 8rpx;


				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;

			}

			.use_coup_info {
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				line-height: 1;
			}
		}

		.more {
			display: flex;
			align-items: center;
		}
	}


	.checkbox-icon .uni-icon {
		display: block;
	}

	.card-shop-box {}

	/* 凑单行 */
	.store-promotion {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8rpx 20rpx 8rpx 0;
		margin-left: 60rpx;
		border-bottom: 1rpx solid #f0f0f0;
		min-height: 56rpx;
	}

	.promotion-scroll {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
	}

	.promotion-scroll-inner {
		display: inline-block;
		white-space: nowrap;
	}

	.store-promotion .tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 20rpx;
		white-space: nowrap;
		margin-right: 10rpx;
	}

	/* 满减：浅橙底+橙字 */
	.tag-manjian {
		background: #fdf6ec;
		color: #e67e22;
	}

	/* 券：浅红渐变底+红字 */
	.tag-coupon {
		background: linear-gradient(135deg, #ffe5e5 0%, #ffebeb 100%);
		color: #ff4d4f;
	}

	/* 限时抢：浅橙底+橙字 */
	.tag-limit {
		background: #fdf6ec;
		color: #e67e22;
	}

	.promotion-right {
		display: flex;
		align-items: center;
		gap: 24rpx;
		flex-shrink: 0;
		margin-left: 20rpx;
	}
	.promotion-right--flush {
		margin-left: 0;
		flex: 1;
		justify-content: space-between;
	}
	.promotion-progress {
		display: flex;
		align-items: center;
		gap: 8rpx;
		min-width: 0;
	}
	.promotion-gift-icon {
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff9800' d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z'/%3E%3C/svg%3E");
	}
	.promotion-right-clickable {
		cursor: pointer;
		padding: 8rpx 0;
	}

	.promotion-text {
		font-size: 24rpx;
		color: #666;
	}

	.promotion-text .highlight {
		color: #ff4d4f;
		font-weight: 500;
	}

	.gather-link {
		font-size: 24rpx;
		color: #ff4d4f;
	}

	.gather-link:active {
		opacity: 0.6;
	}

	.card-act-goods {
		display: flex;
		flex-direction: column;
		margin-bottom: 20upx;
	}

	.card-act-goods:last-child {
		margin-bottom: 0;
	}

	.cart-act-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 20upx 60upx;
	}

	.cart-act-title .txt {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333333;
	}

	.cart-act-title .txt .em-icon {
		margin-right: 20upx;
	}

	.cart-act-title .txt .act-name view {
		font-size: 25upx;
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
	}

	.cart-act-title .more {
		display: flex;
		flex-direction: row;
		color: #f92028;
		align-items: center;
	}

	.cart-goods-item {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		width: 100%;
	}

	/* 已失效商品：整行灰显 */
	.goods-item-invalid {
		opacity: 0.6;
	}

	.goods-item-invalid .goods-title,
	.goods-item-invalid .goods-attr,
	.goods-item-invalid .price {
		color: #999 !important;
	}

	.invalid-tag {
		font-size: 24rpx;
		color: #999;
		margin-left: 16rpx;
		align-self: center;
		flex-shrink: 0;
	}

	.cart-goods-item .checkbox-con {
		// border-bottom: 1px solid #E5E5E5;
	}

	.cart-goods-item:last-child .checkbox-con {
		border-bottom: 0;
	}

	/* 商品行新版布局：左图右文，overflow 防止子元素撑破导致数量按钮挤出 */
	.cart-goods-row {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
		min-width: 0;
		overflow: hidden;
		/* 行间留白，避免多商品图片上下贴边 */
		padding: 10rpx 0;
	}

	.cart-goods-row .goods-img-wrap {
		flex-shrink: 0;
		width: 160rpx;
	}

	.cart-goods-row .goods-img-wrap .goods-img {
		width: 160rpx;
		height: 160rpx;
	}

	.cart-goods-row .goods-img-wrap .goods-img .image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
	}

	/* 已失效/无货等遮罩：图片正中央显示文字 */
	.cart-goods-row .goods-img-wrap .goods-img {
		position: relative;
	}

	.cart-goods-row .goods-img-wrap .goods-img .mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 5;
	}

	.cart-goods-row .goods-img-wrap .goods-img .mash-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 26rpx;
		z-index: 9;
		white-space: nowrap;
	}

	.cart-goods-row .cart-goods-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.cart-goods-row .goods-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.cart-goods-row .goods-attr {
		font-size: 24rpx;
		color: #999;
		line-height: 1.4;
	}

	/* 与 promotion-scroll 完全一致的横向滚动：flex+overflow 确保 H5 有滚动条 */
	.cart-goods-row .activity-tags-scroll {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
	}

	.cart-goods-row .activity-tags-inner {
		display: inline-block;
		white-space: nowrap;
	}

	.cart-goods-row .product-tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		font-size: 20rpx;
		white-space: nowrap;
		margin-right: 8rpx;
	}

	/* 黑卡价：浅金/米色底+黑字 */
	.cart-goods-row .product-tag.tag-vip {
		background: #f5f0e6;
		color: #333;
	}

	/* 积分抵扣：浅绿底+绿字 */
	.cart-goods-row .product-tag.tag-points {
		background: #e8f5e9;
		color: #2e7d32;
	}

	/* 7天无理由：浅蓝底+蓝字 */
	.cart-goods-row .product-tag.tag-return {
		background: #e3f2fd;
		color: #1976d2;
	}

	/* 限时抢：浅橙底+橙字 */
	.cart-goods-row .product-tag.tag-limit {
		background: #fdf6ec;
		color: #e67e22;
	}

	/* 价格+数量行：数量按钮固定右侧，绝不挤出屏幕 */
	.cart-goods-row .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 8rpx 0 0;
		min-height: 44rpx;
		gap: 12rpx;
		min-width: 0;
	}

	.cart-goods-row .order-price-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4rpx;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cart-goods-row .order-price-box .order-price-main {
		display: flex;
		align-items: baseline;
		gap: 12rpx;
		min-width: 0;
	}

	.cart-goods-row .goods-info .oper {
		flex-shrink: 0;
		flex-grow: 0;
		flex-basis: auto;
	}

	.cart-goods-row .order-price-box .price-label,
	.cart-goods-row .order-price-box .price,
	.cart-goods-row .order-price-box .order-original-price {
		flex-shrink: 0;
		white-space: nowrap;
	}

	.cart-goods-row .order-price-box .price-label {
		font-size: 22rpx;
		color: #ff9800;
		background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
	}

	.cart-goods-row .order-price-box .price {
		color: #ff4d4f;
		font-size: 28rpx;
		font-weight: 600;
	}

	.cart-goods-row .order-price-box .order-original-price {
		color: #999;
		font-size: 22rpx;
		text-decoration: line-through;
	}

	.cart-goods-row .order-price-box .order-preferential-amount {
		color: #ff6600;
		font-size: 22rpx;
		line-height: 1.2;
		white-space: nowrap;
	}

	/* 购物车数量框：按示例 proportion，按钮与输入区比例协调 */
	.cart-goods-row .goods-info .oper ::v-deep .uni-numbox {
		height: 44rpx;
		border-radius: 6rpx;
	}

	.cart-goods-row .goods-info .oper ::v-deep .uni-numbox__minus,
	.cart-goods-row .goods-info .oper ::v-deep .uni-numbox__plus {
		width: 44rpx;
		min-width: 44rpx;
		font-size: 28rpx;
		color: #000;
		background: #fafafa;
		border-radius: 6rpx;
	}

	.cart-goods-row .goods-info .oper ::v-deep .uni-numbox__value {
		width: 56rpx;
		min-width: 56rpx;
		font-size: 26rpx;
		color: #333;
	}

	/* 商品级赠品提示：占据整行宽度 */
	.goods-gift-tip-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		padding: 16rpx 12rpx 16rpx;
		padding-top:0;
		// background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
		// border-left: 4rpx solid #ff9800;
		border-radius: 8rpx;
		font-size: 24rpx;
		justify-content: flex-end;
		/* 占据整行宽度 */
		width: 100%;
		box-sizing: border-box;
		// margin-top: 12rpx;
	}

	.goods-gift-tip-row .gift-tip-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 1;
		color: #ff9800;
		    margin-bottom: 8rpx;
	}

	.goods-gift-tip-row .gift-tip-icon .gift-tip-svg-img {
		width: 28rpx;
		height: 28rpx;
		display: block;
		flex-shrink: 0;
	}

	.goods-gift-tip-row .gift-tip-text {
		color: #666;
		flex: 0 1 auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 24rpx;
	}

	.goods-gift-tip-row .gift-tip-btn {
		padding: 6rpx 16rpx;
		
		color: #666;
		border-radius: 20rpx;
		font-size: 28rpx;
		font-weight: 500;
		flex-shrink: 0;
		white-space: nowrap;
		line-height: 1.4;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.goods-gift-tip-row .gift-tip-btn:active {
		opacity: 0.8;
	}

	/* 商品级赠品提示：右对齐，宽度自适应 */
	.goods-gift-tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		margin-top: 12rpx;
		padding: 12rpx 16rpx;
		background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
		border-left: 4rpx solid #ff9800;
		border-radius: 8rpx;
		font-size: 24rpx;
		justify-content: flex-end;
		/* 从右往左扩展，宽度自适应 */
		margin-left: auto;
		margin-right: 0;
		max-width: 100%;
	}

	.goods-gift-tip .gift-tip-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 1;
		color: #ff9800;
	}

	.goods-gift-tip .gift-tip-icon .gift-tip-svg-img {
		width: 28rpx;
		height: 28rpx;
		display: block;
		flex-shrink: 0;
	}

	.goods-gift-tip .gift-tip-text {
		color: #666;
		flex: 0 1 auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 28rpx;
	}

	.goods-gift-tip .gift-tip-btn {
		padding: 6rpx 16rpx;
		background: linear-gradient(135deg, #ff9800 0%, #ff8c00 100%);
		color: #fff;
		border-radius: 20rpx;
		font-size: 22rpx;
		font-weight: 500;
		flex-shrink: 0;
		white-space: nowrap;
		line-height: 1.4;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.goods-gift-tip .gift-tip-btn:active {
		opacity: 0.8;
	}

	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
	}

	.cart-goods-info .goods-img {
		width: 180upx;
		height: 180upx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 180upx;
		height: 180upx;
	}

	.cart-goods-info .goods-img .icon {
		position: absolute;
		width: 80upx;
		height: 80upx;
		top: 0;
		left: 0;
	}

	.cart-goods-info .goods-img .icon image {
		width: 100%;
		height: 100%;
	}

	.cart-goods-info .goods-img .mask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		z-index: 5;
		background: rgba(0, 0, 0, .7);
	}

	.cart-goods-info .goods-img .mash-text {
		width: 100%;
		color: #fff;
		text-align: center;
		z-index: 9;
		position: absolute;
		top: 0;
		bottom: 0;
		line-height: 180upx;
	}

	.cart-goods-item-outer .cart-goods-info {
		background: #fff9f8;
	}

	.cart-goods-item-outer .checkbox-con {
		padding-left: 60upx;
	}

	.cart-goods-content {
		flex: 1 1 0%;
		margin-left: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		// width:65%;
	}

	.cart-goods-content1 {
		display: block !important;
	}


	.cart-goods-content .goods-title {
		font-size: 28upx;
		margin-bottom: 10upx;
	}

	.cart-goods-content .goods-attr-label {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
		color: #999999;
		line-height: 24rpx;

		.goods-attr {
			color: #999999;
			font-size: 25rpx;
			max-width: 358rpx;
			height: 35rpx;
			display: flex;
			flex-wrap: wrap;
			overflow: hidden;
			margin-right: 16rpx;
		}
	}

	/* 商品级促销标签，仿淘宝橘色小框 */
	.goods-act-tags {
		margin-top: 8rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.goods-act-tag {
		padding: 0 10rpx;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 22rpx;
		color: #FF7F23;
		border-radius: 16rpx;
		border: 1rpx solid #FF7F23;
		background-color: #FFF7EE;
		margin-right: 8rpx;
		margin-bottom: 6rpx;
	}

	.cart-goods-content .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12rpx;
	}

	.cart-goods-content .goods-info .price {
		color: #f92028;
	}

	.cart-goods-content .goods-info .stepper_sum {
		color: #999999;
	}

	.cart-goods-content .goods-other {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 15upx;
		position: relative;
	}

	.cart-goods-content .goods-other .em-icon {
		padding: 0 3px;
		margin-right: 2px;
	}

	.cart-goods-content .goods-other .act-name {
		width: calc(100% - 45px);
		font-size: 25upx;
		color: #999999;
	}

	.cart-goods-content .goods-other .uni-icon {
		position: absolute;
		right: 0;
		top: 2px;
	}

	.scroll-view-G {
		display: flex;
		align-items: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.scroll-view-item-right {
		width: 20%;
		margin-left: 10px;
		height: 100%;
		line-height: 100%;
		text-align: center;
		background: #f92028;
		color: #FFFFFF;
		position: relative;
	}

	.scroll-view-item-right view {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.em-icon {
		width: 40px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		color: #FFFFFF;
		background: #f92028;
		font-size: 22upx;
		text-align: center;
	}

	.em-icon.active-zeng {
		background-color: #fc9b1f;
	}

	.em-icon.active-zhekou {
		background-color: #fc9b1f;
	}

	.cart-submit {
		width: 100%;
		// border-radius: 20rpx 20rpx 0 0;
		background-color: #FFFFFF;
		position: fixed;
		padding: 20rpx 0;
		min-height: auto;
		
		/* #ifdef MP-WEIXIN */
		min-height: auto;
		padding: 15px 0;
		/* #endif */
		
		/* #ifdef APP-PLUS */
		min-height: auto;
		padding: 20rpx 0;
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		left: 0 !important;
		right: 0 !important;
		transform: translateZ(0);
		/* #endif */
		
		/* #ifdef H5 */
		min-height: auto;
		padding: 20rpx 0;
		/* #endif */
		
		left: 0;
		z-index: 100; // 提高层级，确保在猜你喜欢列表之上，但低于地址弹窗
		// border-top: 1px solid #e3e8ee;
	}

	.cart-submit .checkall {
		padding: 0 30upx;
		// width: 30%;
		width: 20%;
	}

	.cart-submit .checkall .checkbox .checkbox-icon {
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text {
		text-align: right;
		flex: 1;
		min-width: 0;
		margin-right: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}
	
	.cart-submit .submit-bar-row-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		// margin-bottom: 12rpx;
		
		.checkall {
			flex: 0 0 auto;
		}
		
		.price-wrapper {
			flex: 1;
			text-align: right;
			margin-left: 20rpx;
		}
	}
	
	.cart-submit .submit-bar-row-bottom {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		gap: 16rpx;
		font-size: 26rpx;
		color: #626262;
		
		.text {
			flex: 0 0 auto;
		}
	}

	.cart-submit .submit-bar-price {
		display: inline-block;
		color: #f92028;
		font-weight: 500;
		font-size: 32upx;
		word-break: break-all;
		white-space: normal;
		flex-shrink: 0;
		min-width: 0;
	}

	.cart-submit .submit-bar-sub {
		font-weight: 400;
		font-size: 24rpx;
		color: #FE2F02;
		margin-top: 4rpx;
		word-break: break-all;
		white-space: normal;
		text-align: right; // 靠右对齐
		width: 100%; // 占满宽度，确保向左延伸
	}

	.flow-no-cart {
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 10upx;
		text-align: center;
		overflow: hidden;
	}

	.flow-no-cart .gwc-bg {
		display: flex;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		background: #fcfcfc;
		justify-content: center;
		align-items: center;
		border: 1px solid #d9d9d9;
		margin: 40px auto 20px;
	}

	.flow-no-cart .gwc-bg .iconfont {
		font-size: 40px;
		color: #d9d9d9;
	}

	.flow-no-cart text {
		color: #333333;
		font-size: 30upx;
	}

	.flow-no-cart .card-btn {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 20px 0 40px;
	}

	.flow-no-cart .card-btn button {
		margin: 0 5px;
		border-color: #d9d9d9;
		font-size: 16px;
	}

	.goods-detail-guess {
		// padding-bottom: 120upx;
		background-color: #f5f5f5;
		position: relative;
		z-index: 1; // 确保猜你喜欢区域的层级低于底部按钮
	}

	.act-item-right {
		display: flex;
		flex-direction: row;
		align-content: center;
		padding: 10upx 20upx 10upx 0;
	}

	.act-item-right .em-icon {
		margin-right: 20upx;
	}

	.act-item-right .act-name {
		font-size: 25upx;
		color: #999999;
	}

	.activity-popup {
		background: #fff;
		border-radius: 28rpx 28rpx 0 0;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		overflow: hidden;

		.red {
			color: #FE2F02;
		}

		.title {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 20rpx;
			border-bottom: 2rpx solid #f0f0f0;
			background: #fff;
			position: sticky;
			top: 0;
			z-index: 2;
		}

		.content {
			flex: 1;
			min-height: 0;
			overflow: hidden;
		}

		.content scroll-view {
			height: 100%;
		}

		.price-detail-title {
			display: flex;
			justify-content: center;
			position: relative;
			background-color: #fff;
			text-align: center;
			flex-direction: column;
			padding-top: 16px;
			border-radius: 28rpx 28rpx 0rpx 0rpx;

			.price-detail-text {
				font-weight: 500;
				font-size: 36rpx;
				color: #272727;
				display: flex;
				padding:0 20rpx;

				.txt {
					font-weight: bold;
					font-size: 36rpx;
					color: #272727;
				}

				.unicon {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 48rpx;
					color: #626262;
				}
			}
		}

		.label {
			display: flex;
			justify-content: space-between;
			margin: 24rpx 22rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #272727;
		}
		
		.label.red {
			color: #ff4d4f;
		}
		
		.label.red .label-right {
			color: #ff4d4f;
		}
		
		.label-left {
			flex: 1;
			text-align: left;
		}
		
		.label-right {
			text-align: right;
			flex-shrink: 0;
		}
		
		.label.label-total {
			margin-top: 32rpx;
			padding-top: 24rpx;
			border-top: 2rpx solid #f0f0f0;
			font-weight: 600;
			font-size: 32rpx;
		}
		
		.label-right-total {
			color: #ff4d4f;
			font-weight: 600;
			font-size: 32rpx;
		}
		
		.price-detail-section {
			margin-bottom: 24rpx;
		}
		
		.price-detail-section-title {
			margin: 24rpx 22rpx 16rpx 22rpx;
			font-weight: 600;
			font-size: 28rpx;
			color: #272727;
		}
		
		// 购物车优惠明细抽屉样式
		.discount-activity-toggle-cart {
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			border-radius: 12rpx;
			padding: 14rpx 8rpx;
			// margin: 8rpx 22rpx;
			box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(254, 47, 2, 0.06);
			position: relative;
			
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				width: 6rpx;
				border-radius: 12rpx 0 0 12rpx;
			}
			
			.title {
				font-weight: 600;
				color: #333333;
				font-size: 28rpx;
				border:none;
			}
		}

		.discount-activity-toggle-right-cart {
			display: inline-flex;
			align-items: center;
			gap: 8rpx;
			
			.value {
				font-weight: 600;
				font-size: 28rpx;
			}
		}

		.discount-activity-child-cart {
			background: #FAFBFC;
			border-left: 6rpx solid #E8F4FD;
			margin: 0 42rpx 8rpx 42rpx;
			border-radius: 0 8rpx 8rpx 0;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			.label {
				padding: 16rpx 20rpx 16rpx 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.label-left {
					color: #666666;
					font-size: 26rpx;
					font-weight: 400;
					position: relative;
					
					&::before {
						content: '•';
						color: #999999;
						margin-right: 12rpx;
						font-size: 20rpx;
					}
				}
				
				.label-right {
					color: #666666;
					font-size: 26rpx;
					font-weight: 500;
				}
			}
		}
		
		.price-detail-store-box {
			// margin: 0 22rpx 16rpx 22rpx;
			// padding: 16rpx;
			// border: 2rpx solid #e0e0e0;
			// border-radius: 8rpx;
			// background-color: #fafafa;
		}
		
		.price-detail-store-item {
			// padding: 12rpx 0;
		}
		
		.price-detail-store-item:not(:last-child) {
			// border-bottom: 1rpx solid #f0f0f0;
		}

		.price-store-left {
			display: flex;
			flex-direction: column;
			gap: 4rpx;
		}

		.price-store-name {
			font-size: 28rpx;
			color: #272727;
			line-height: 1.3;
		}

		.price-store-discount-row {
			margin-top: -16rpx;
			margin-bottom: 8rpx;
		}

		.price-store-discount-label {
			font-size: 22rpx;
			color: #999999;
			line-height: 1.2;
		}

		.price-store-discount-amount {
			font-size: 22rpx;
			color: #999999;
			line-height: 1.2;
		}

		.price-detail-summary-sep {
			border-top: 2rpx solid #f0f0f0;
			padding-top: 16rpx;
			margin-top: 8rpx;
			margin-bottom: 8rpx;
		}

		.price-detail-goods-total-row {
			padding: 12rpx 0;
			margin-top: 0;
		}
		
		.price-detail-note {
			margin: 16rpx 22rpx 0 22rpx;
			font-size: 24rpx;
			color: #999;
			line-height: 1.5;
		}
	}

	.activity-popup .cart-goods-item {
		min-height: initial;
	}

	/* 优惠券弹窗（图一+图三样式） */
	.coupon-popup-wrap {
		background: #fff;
		border-radius: 16rpx 16rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		overflow-x: hidden;
	}
	.coupon-popup-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		border-bottom: 2rpx solid #f0f0f0;
		background-color: #ffffff;
		border-radius: 16rpx 16rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		flex-shrink: 0;
		position: sticky;
		top: 0;
		z-index: 2;
	}
	.coupon-popup-txt {
		font-size: 34rpx;
		font-weight: 600;
		color: #333;
		text-align: left;
	}
	.coupon-popup-scroll {
		width: 100%;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
		overflow-x: hidden;
		/* 对齐示例：modal-content-scroll padding: 20px */
		padding: 40rpx;
		text-align: left;
	}
	.coupon-section {
		margin-bottom: 32rpx;
	}
	.coupon-section:last-child {
		margin-bottom: 0;
	}
	.coupon-section-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 16rpx;
		text-align: left;
	}
	.coupon-section-card {
		display: flex;
		align-items: center;
		gap: 20rpx;
		// background: #f5f5f5;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;
	}
	.coupon-section-card:last-child {
		margin-bottom: 0;
	}
	.coupon-section-icon {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0;
		background: #ff4d4f;
		border-radius: 50%;
	}
	.coupon-section-icon.gift-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.gift-icon-text {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
	}
	.coupon-section-icon.clock-icon {
		background: #ff4d4f;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.coupon-section-icon.clock-icon::before {
		content: '';
		width: 24rpx;
		height: 24rpx;
		border: 3rpx solid #fff;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.coupon-section-content {
		flex: 1;
		min-width: 0;
	}
	.coupon-section-main {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 8rpx;
	}
	.coupon-section-sub {
		font-size: 24rpx;
		color: #999;
	}
	/* 优惠活动区：100% 对齐 pages/news/styles.css（并隔离命名，避免污染原页面样式） */
	.popup-discount-section {
		margin-bottom: 40rpx;
	}
	.popup-discount-section-title {
		font-size: 30rpx;
		font-weight: 500;
		margin-bottom: 24rpx;
		color: #333;
		text-align: left;
	}
	.popup-discount-item {
		display: flex;
		align-items: center;
		gap: 24rpx;
		padding: 24rpx;
		background: #f8f8f8;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		text-align: left;
	}
	.popup-discount-icon {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}
	.popup-discount-icon--gift {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff4d4f' d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z'/%3E%3C/svg%3E");
	}
	.popup-discount-icon--time {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff4d4f' d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E");
	}
	.popup-discount-icon--vip {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff4d4f' d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
	}
	.popup-discount-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
	}
	.popup-discount-title {
		display: block;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 8rpx;
		line-height: 1.4;
		text-align: left;
	}
	.popup-discount-desc {
		display: block;
		font-size: 24rpx;
		color: #999;
		line-height: 1.4;
		text-align: left;
	}
	/* 优惠券卡片：按示例代码 styles.css 1:1 还原 */
	.coupon-item {
		display: flex;
		width: 100%;
		border-radius: 16rpx;
		margin-bottom: 16rpx;
		overflow: hidden;
		position: relative;
		box-sizing: border-box;
		max-width: 100%;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}

	.coupon-item::before {
		content: '';
		position: absolute;
		left: 158rpx;
		top: -12rpx;
		width: 24rpx;
		height: 24rpx;
		background: #fff;
		border-radius: 50%;
		z-index: 1;
	}

	.coupon-item::after {
		content: '';
		position: absolute;
		left: 158rpx;
		bottom: -12rpx;
		width: 24rpx;
		height: 24rpx;
		background: #fff;
		border-radius: 50%;
		z-index: 1;
	}

	.coupon-left {
		width: 170rpx;
		padding: 16rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
		flex-shrink: 0;
	}

	.coupon-item.received .coupon-left {
		background: linear-gradient(135deg, #bbb 0%, #999 100%);
	}

	.coupon-amount {
		font-size: 44rpx;
		font-weight: bold;
		line-height: 1;
	}

	.coupon-amount-unit {
		font-size: 24rpx;
		font-weight: normal;
	}

	.coupon-condition {
		font-size: 20rpx;
		margin-top: 6rpx;
		opacity: 0.85;
	}

	.coupon-right {
		flex: 1;
		padding: 16rpx 20rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		min-width: 0;
		gap: 10rpx;
	}
	/* 右侧信息区（第一个子节点）允许收缩，避免挤出右侧按钮 */
	.coupon-right > view:first-child {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		text-align: left;
	}

	.coupon-name {
		font-size: 26rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 4rpx;
		text-align: left;
		line-height: 1.2;
		max-width: 320rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.coupon-scope {
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 6rpx;
		display: inline-block;
		margin-bottom: 4rpx;
		width: fit-content;
		text-align: left;
		line-height: 1.2;
		flex-shrink: 0;
	}

	.coupon-scope.scope-store {
		color: #ff9800;
		background: #fff7e6;
	}

	.coupon-scope.scope-cross {
		color: #2196f3;
		background: #e3f2fd;
	}

	.coupon-scope.scope-platform {
		color: #4caf50;
		background: #e8f5e9;
	}

	.coupon-time {
		font-size: 20rpx;
		color: #999999;
		margin-top: 0;
		text-align: left;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.coupon-bottom {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.coupon-btn {
		background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
		color: #fff;
		border: none;
		padding: 14rpx 30rpx;
		text-align: center;
		border-radius: 30rpx;
		font-size: 26rpx;
		cursor: pointer;
		transition: opacity 0.2s;
		white-space: nowrap;
		box-sizing: border-box;
		line-height: 1.4;
		min-width: 128rpx;
	}

	.coupon-btn:active {
		opacity: 0.8;
	}

	.coupon-btn.received {
		background: #e0e0e0;
		color: #999;
		cursor: default;
	}
	.coupon-empty-tip {
		text-align: center;
		padding: 60rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	/* ===== coupon.vue 样式移植：购物车弹窗内优惠券卡片 ===== */
	.coupon-popup-wrap .coupons_list {
		padding: 0;
	}
	.coupon-popup-wrap .coupons_item {
		display: flex;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}
	.coupon-popup-wrap .coupons_left {
		position: relative;
		flex: none;
		display: flex;
		flex-direction: column;
		width: calc(100% - 280rpx);
		max-width: calc(100% - 200rpx);
		border-radius: 20rpx 0 0 20rpx;
		color: #fff;
		background: #FFEDED;
		padding: 10rpx 32rpx;
		border-right: 1px dashed #fff;
		background-image: url("data:image/svg+xml,%3Csvg width='200' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q20,50 40,55 T80,55 T120,50 T160,55 T200,60' stroke='%23FF9999' stroke-width='2.5' fill='none' opacity='0.25'/%3E%3Cpath d='M10,65 Q30,55 50,60 T90,60 T130,55 T170,60 T190,65' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cpath d='M20,70 Q40,60 60,65 T100,65 T140,60 T180,65 T200,70' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.15'/%3E%3Cpath d='M30,50 Q50,40 70,45 T110,45 T150,40 T190,45' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cellipse cx='35' cy='52' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='75' cy='48' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='115' cy='47' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='155' cy='50' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='185' cy='53' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
		background-position: bottom left;
		background-size: 200rpx 80rpx;
	}
	.coupon-popup-wrap .coupons_left_top {
		display: flex;
	}
	.coupon-popup-wrap .coupons_left_top .collect_coupon {
		height: fit-content;
		padding: 6rpx 10rpx;
		margin: 0 26rpx;
		background: #FE2F02;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #FFFFFF;
	}
	.coupon-popup-wrap .coupons_goods_name {
		display: flex;
		font-size: 20rpx;
		color: #FE2F02;
	}
	.coupon-popup-wrap .coupons_store_name {
		display: flex;
		font-size: 24rpx;
		color: #FE2F02;
		margin-top: 8rpx;
	}
	.coupon-popup-wrap .coupons_limited_period {
		display: flex;
		font-weight: 400;
		font-size: 20rpx;
		color: #FE2F02;
	}
	.coupon-popup-wrap .coupon_price {
		font-size: 48rpx;
		line-height: 1;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		color: #FE2F02;
		font-style: normal;
	}
	.coupon-popup-wrap .coupon_tag2 {
		font-size: 20rpx;
		color: #FE2F02;
	}
	/* 金额与条件同行 */
	.coupon-popup-wrap .coupons_left_top {
		display: flex;
		align-items: baseline;
		flex-wrap: nowrap;
	}
	.coupon-popup-wrap .coupon_condition_inline {
		font-size: 24rpx;
		color: #FE2F02;
		margin-left: 12rpx;
		white-space: nowrap;
	}
	.coupon-popup-wrap .coupons_left:after {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		transform: translate(50%, 50%);
		border-radius: 50%;
		background-color: #fff;
		z-index: 2;
	}
	.coupon-popup-wrap .coupons_left:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background-color: #fff;
		z-index: 2;
	}
	.coupon-popup-wrap .coupons_right {
		overflow: hidden;
		position: relative;
		flex: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 200rpx;
		border-radius: 0 20rpx 20rpx 0;
		// border: 1px solid #f2d2d2;
		border-left-width: 0;
		background-color: #fbf2f2;
	}
	.coupon-popup-wrap .coupons_right.coupons_right_unreceived {
		background-color: #FE2F02;
	}
	.coupon-popup-wrap .get_coupon_time {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		width: 100%;
	}
	.coupon-popup-wrap .get_coupon_time .coupon_btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		line-height: 44rpx;
		border-radius: 26rpx;
		text-align: center;
		background: #FFEDED;
		font-weight: 400;
		font-size: 28rpx;
		color: #FE2F02;
	}
	.coupon-popup-wrap .get_coupon_time .coupon_btn.coupon_btn_unreceived {
		background: #FE2F02;
		color: #FFFFFF;
	}
	.coupon-popup-wrap .coupons_right:after {
		content: '';
		position: absolute;
		bottom: -24rpx;
		left: -22rpx;
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		background-color: #f2d2d2;
	}
	.coupon-popup-wrap .coupons_right.coupons_right_unreceived:after {
		background-color: #FE2F02;
	}
	.coupon-popup-wrap .coupons_right:before {
		content: '';
		position: absolute;
		top: -24rpx;
		left: -22rpx;
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		background-color: #f2d2d2;
	}
	.coupon-popup-wrap .coupons_right.coupons_right_unreceived:before {
		background-color: #FE2F02;
	}
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left {
		// background: #f5f5f5;
	}
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left .coupon_price,
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left .coupons_goods_name,
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left .coupons_store_name,
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left .coupons_limited_period,
	.coupon-popup-wrap .coupons_item.g-gay .coupons_left .coupon_tag2 {
		// color: #ccc;
	}
	.coupon-popup-wrap .coupons_item.g-gay .coupons_right {
		// background-color: #f5f5f5;
		// border-color: #e0e0e0;
	}
	.coupon-popup-wrap .coupons_item.g-gay .coupons_right .coupon_btn {
		// background: #f5f5f5;
		// color: #ccc;
	}
	/* ===== end coupon.vue 样式移植 ===== */

/* 优惠模式：优惠券行标签图标（红色标签） */
.popup-discount-icon--coupon {
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff4d4f' d='M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z'/%3E%3C/svg%3E");
}
.popup-coupon-discount-item {
align-items: center;
}
.popup-coupon-claim-btn {
background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
color: #fff;
border: none;
padding: 16rpx 24rpx;
border-radius: 12rpx;
font-size: 26rpx;
cursor: pointer;
transition: opacity 0.2s;
white-space: nowrap;
flex-shrink: 0;
line-height: 1.4;
min-width: 96rpx;
text-align: center;
}
.popup-coupon-claim-btn:active {
opacity: 0.8;
}
.popup-coupon-claim-btn--received {
background: #e0e0e0;
color: #999;
cursor: default;
}

	/* 满减信息弹窗（对齐 checkout.js promotion-detail + gather-tip-box） */
	.manjian-popup-wrap {
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		overflow-x: hidden;
		text-align: left;
	}
	.manjian-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 40rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.manjian-modal-title {
		flex: 1;
		min-width: 0;
		font-size: 34rpx;
		font-weight: 500;
		color: #333;
		line-height: 1.35;
	}
	.manjian-modal-close-wrap {
		flex-shrink: 0;
		margin-left: 24rpx;
		padding: 8rpx;
	}
	.manjian-modal-scroll {
		width: 100%;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
	}
	.manjian-modal-content.modal-content-scroll {
		padding: 40rpx;
		box-sizing: border-box;
		text-align: left;
	}
	.manjian-gather-tip.gather-tip-box {
		margin-bottom: 40rpx;
		text-align: left;
	}
	.manjian-tip-line {
		display: block;
		font-size: 30rpx;
		color: #666;
		line-height: 1.6;
		text-align: center;
	}
	.manjian-highlight {
		color: #ff4d4f;
		font-weight: bold;
		font-size: 40rpx;
		margin: 0 8rpx;
	}
	.promotion-detail-section {
		margin-bottom: 40rpx;
	}
	.promotion-detail-section:last-child {
		margin-bottom: 0;
	}
	.promotion-detail-h {
		display: block;
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 24rpx;
		text-align: left;
	}
	.promotion-detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		font-size: 28rpx;
		box-sizing: border-box;
	}
	.promotion-detail-item > .promotion-detail-value {
		text-align: right;
	}
	.promotion-detail-item:last-child {
		border-bottom: none;
	}
	.promotion-detail-item--coupon {
		align-items: flex-start;
	}
	.promotion-detail-item--coupon .mini-btn {
		margin-top: 4rpx;
	}
	.promotion-detail-label {
		color: #333;
		flex: 1;
		min-width: 0;
		padding-right: 16rpx;
		text-align: left;
	}
	.promotion-detail-label-row {
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
	}
	.promotion-detail-value {
		font-size: 28rpx;
		color: #ff4d4f;
		font-weight: 500;
		flex-shrink: 0;
	}
	.promotion-detail-value--dark {
		color: #333;
		font-weight: 400;
	}
	.promotion-detail-value--green {
		color: #4caf50;
	}
	.promotion-detail-value--muted {
		color: #999;
		font-weight: 400;
	}
	.promotion-detail-right-group {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16rpx;
		flex-shrink: 0;
	}
	.promotion-detail-right-group .promotion-detail-value {
		text-align: right;
	}
	.mini-btn {
		padding: 8rpx 24rpx;
		background: #ff4d4f;
		color: #fff;
		border-radius: 24rpx;
		font-size: 24rpx;
		line-height: 1.3;
		flex-shrink: 0;
	}
	.manjian-coupon-ticket {
		width: 36rpx;
		height: 36rpx;
		border-radius: 6rpx;
		background: #ff4d4f;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 2rpx;
	}
	.manjian-coupon-ticket-yen {
		font-size: 20rpx;
		color: #fff;
		font-weight: 600;
		line-height: 1;
	}
	.manjian-coupon-text-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	.manjian-coupon-name {
		font-size: 28rpx;
		color: #333;
		line-height: 1.4;
	}
	.manjian-coupon-scope {
		font-size: 24rpx;
		color: #999;
		line-height: 1.4;
	}

	/* 去凑单弹窗（对齐 checkout 示例：createModal + gather-tip-box + gather-products） */
	.gather-popup-wrap {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		overflow-x: hidden;
	}
	.gather-modal-header {
		display: flex;
		align-items: center;
		text-align: start;
		justify-content: space-between;
		padding: 10rpx 40rpx 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.gather-modal-title {
		flex: 1;
		min-width: 0;
		font-size: 34rpx;
		font-weight: 500;
		
		line-height: 1.35;
	}
	.gather-modal-close-wrap {
		flex-shrink: 0;
		margin-left: 24rpx;
		padding: 8rpx;
	}
	.gather-modal-body {
		width: 100%;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
	}
	.gather-modal-scroll-inner {
		box-sizing: border-box;
		padding: 40rpx;
	}
	.gather-tip-box {
		text-align: center;
		background: linear-gradient(135deg, #fff9e6 0%, #fff5e6 100%);
		border: 1rpx solid #ffe0b2;
		border-radius: 16rpx;
		padding: 32rpx 28rpx;
		margin-bottom: 40rpx;
	}
	.gather-tip-main {
		display: block;
		font-size: 30rpx;
		color: #666;
		line-height: 1.6;
	}
	.gather-highlight {
		color: #ff4d4f;
		font-weight: bold;
		font-size: 40rpx;
		margin: 0 4rpx;
	}
	.gather-tip-sub {
		display: block;
		font-size: 24rpx;
		color: #999;
		margin-top: 16rpx;
		line-height: 1.4;
	}
	.gather-products {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	.gather-product {
		display: flex;
		align-items: flex-start;
		gap: 24rpx;
		padding: 24rpx;
		background: #fafafa;
		border: 1rpx solid #f0f0f0;
		border-radius: 16rpx;
		box-sizing: border-box;
	}
	.gather-product-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		// background: #f5f5f5;
		flex-shrink: 0;
	}
	.gather-product-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}
	.gather-product-name {
		font-size: 28rpx;
		font-weight: 400;
		color: #333;
		line-height: 1.45;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.gather-product-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
	}
	.gather-tag {
		font-size: 20rpx;
		line-height: 1.2;
		color: #ff9800;
		background: #fff7e6;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}
	.gather-price-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 4rpx;
		gap: 16rpx;
	}
	.gather-price-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8rpx;
		flex: 1;
		min-width: 0;
	}
	.gather-price-current {
		font-size: 36rpx;
		font-weight: bold;
		color: #ff4d4f;
		line-height: 1.2;
	}
	.gather-price-original {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
		line-height: 1.2;
	}
	.gather-add-btn {
		flex-shrink: 0;
		padding: 10rpx 50rpx;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
		color: #fff;
		border-radius: 40rpx;
		font-size: 26rpx;
		font-weight: 500;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.gather-add-count {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background: rgba(255, 255, 255, 0.95);
		color: #ff4d4f;
		font-size: 22rpx;
		font-weight: 600;
		padding: 6rpx 10rpx;
		border-radius: 20rpx;
		line-height: 1;
		white-space: nowrap;
	}
	.gather-empty,
	.gather-loading,
	.gather-load-more,
	.gather-no-more {
		text-align: center;
		padding: 40rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	/* 领取成功弹窗（success-toast / success-overlay，按示例复刻） */
	/* z-index 需高于 uni-popup(10002)，否则会被优惠券弹窗遮挡 */
	.success-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 99998;
		opacity: 0;
		transition: opacity 0.3s;
		pointer-events: none;
	}
	.success-overlay.show {
		opacity: 1;
	}
	.success-toast {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.8);
		background: #fff;
		border-radius: 32rpx;
		padding: 60rpx 80rpx;
		width: 520rpx; /* 固定宽度约260px，与示例一致 */
		max-width: calc(100% - 80rpx); /* 左右各留40rpx边距，不撑满屏幕 */
		box-sizing: border-box;
		text-align: center;
		z-index: 99999;
		opacity: 0;
		transition: all 0.3s;
		pointer-events: none;
		box-shadow: 0 16rpx 60rpx rgba(0, 0, 0, 0.15);
	}
	.success-toast.show {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
	.success-icon {
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24rpx;
	}
	.success-icon svg {
		width: 56rpx;
		height: 56rpx;
	}
	.success-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 12rpx;
	}
	.success-desc {
		font-size: 26rpx;
		color: #999;
	}

	.gift-checkbox-disabled {
		pointer-events: none;
	}

	.gift-popup-footer {
		padding: 20rpx;
		text-align: center;
		border-top: 1rpx solid #eee;
	}

	.goods-store {
		background: #FFFFFF;
		padding: 10upx 0;
		text-align: right;
		font-size: 25upx;
	}

	/* 店铺底部：展开/收起 + 优惠合计（对齐 styles.css .store-total） */
	.store-cart-footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;
		padding: 24rpx 30rpx;
		background: #f8f8f8;
		border-top: 1rpx solid #f0f0f0;
		box-sizing: border-box;
	}
	.store-cart-footer-left {
		flex: 1;
		min-width: 0;
	}
	.store-expand-center {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
	}
	.expand-products-btn-cart {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		padding: 0;
		background: none;
		border: none;
		color: #ff4d4f;
		font-size: 24rpx;
	}
	.expand-products-btn-cart:active {
		opacity: 0.65;
	}
	.store-cart-footer-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		gap: 8rpx;
		font-size: 26rpx;
	}
	.store-discount-label {
		color: #666;
	}
	.store-discount-amount {
		color: #ff6600;
		font-weight: 600;
	}
	.store-discount-detail-link {
		color: #ff9800;
		margin-left: 4rpx;
		padding: 4rpx 0;
	}
	.store-discount-detail-link:active {
		opacity: 0.65;
	}

	/* 店铺优惠明细弹窗（styles.css .discount-detail-*） */
	.store-discount-popup-wrap {
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		overflow-x: hidden;
		text-align: left;
	}
	.store-discount-popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 40rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.store-discount-popup-title {
		flex: 1;
		min-width: 0;
		font-size: 34rpx;
		font-weight: 500;
		color: #333;
	}
	.store-discount-popup-close {
		flex-shrink: 0;
		margin-left: 24rpx;
		padding: 8rpx;
	}
	.store-discount-popup-body {
		width: 100%;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
	}

	.popup-scroll-main {
		height: 100%;
	}
	.discount-detail-section-inner {
		padding: 0 40rpx 24rpx;
		box-sizing: border-box;
	}
	.discount-detail-item-cart {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}
	.discount-detail-item-cart-total {
		border-top: 4rpx solid #f0f0f0;
		margin-top: 24rpx;
		padding-top: 32rpx;
		border-bottom: none;
		font-weight: 500;
	}
	.detail-label-cart {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		flex: 1;
		min-width: 0;
	}
	.detail-label-cart-txt {
		font-size: 28rpx;
		color: #666;
	}
	.detail-label-cart-bold {
		color: #333;
		font-weight: 500;
	}
	.detail-icon-cart {
		width: 36rpx;
		height: 36rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff3e0;
	}
	.detail-icon-cart--manjian {
		background: #fff3e0;
	}
	.detail-icon-cart--coupon {
		background: #fff3e0;
	}
	.detail-icon-cart--time {
		background: #fff8e1;
	}
	.detail-icon-cart-txt {
		font-size: 20rpx;
		color: #ff9800;
		font-weight: 600;
		line-height: 1;
	}
	.detail-value-cart {
		font-size: 30rpx;
		color: #ff6600;
		font-weight: 500;
		flex-shrink: 0;
	}
	.detail-value-cart-highlight {
		font-size: 40rpx;
		color: #ff4d4f;
		font-weight: bold;
	}
	.discount-detail-note-cart {
		background: #fff9f0;
		padding: 24rpx 40rpx 32rpx;
		border-top: 1rpx solid #f0f0f0;
		text-align: left;
		box-sizing: border-box;
	}
	.discount-detail-note-line {
		display: block;
		width: 100%;
		font-size: 24rpx;
		color: #999;
		line-height: 1.65;
		text-align: left;
		box-sizing: border-box;
	}

	.load-more-goods {
		// padding: 20rpx;
		text-align: center;
		
		.load-more-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			// padding: 16rpx 32rpx;
			// border: 2rpx solid #f92028;
			border-radius: 8rpx;
			color: #f92028;
			font-size: 24rpx;
			background-color: #fff;
			transition: all 0.3s;
			
			text {
				margin-right: 8rpx;
			}
			
			&.loading {
				opacity: 0.6;
				pointer-events: none;
			}
			
			&:active {
				background-color: #f92028;
				color: #fff;
				
				uni-icons {
					color: #fff !important;
				}
			}
		}
	}

	.shop-store-cart {
		padding: 0 20rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.shop-store-cart .store-btn {
		border: 1px solid #f42424;
		color: #f42424;
		line-height: normal;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10upx 20upx;
	}

	.shop-store-cart .store-btn .iconfont {
		vertical-align: top;
		margin: -16upx 10upx 0 0;
	}

	/* #ifdef APP-PLUS */
	.app-header-top {
		padding-top: 80upx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.app-header-top {
		padding-top: calc(var(--status-bar-height) - 20rpx + 44px);
	}

	/* #endif */

	/*loading*/
	.loading-transparent {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}

	.loading-transparent ::v-deep .uni-load-more {
		z-index: 999;
		top: 50%;
		left: 50%;
		position: absolute;
		margin: -20px 0 0 -20px;
		width: 40px;
	}

	.loading-transparent .loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
	}

	.btn-bar {
		// flex: 1;
		display: flex;
		width: 220rpx;
	}

	.cart-submit .btn-bar .btn-disabled {
		background: linear-gradient(178deg, #f91f28, #ff4f2e);
		opacity: .5;
		color: #fff;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	uni-swipe-action {
		margin-bottom: 10px;
	}

	.uni-swipe_text--center {
		margin-right: 10px;
	}







	.product-list-lie {
		// margin-bottom: 150rpx;
		position: relative;
		z-index: 1; // 确保商品列表区域的层级低于底部按钮
	}


	/*新版样式*/
	.product-new {
		// margin: 20rpx 20rpx 0;
		background-color: #f5f5f5;
		/* min-height: 500rpx; */
	}

	.product-new .tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}

	.product-new .tabs .item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		line-height: 1.5;
		height: 100%;
	}

	.product-new .tabs .item .tit {
		font-size: 30rpx;
		color: #333;
	}

	.product-new .tabs .item .txt {
		display: inline-block;
		font-size: 25rpx;
		color: #888;
		border-radius: 20rpx;
		padding: 2rpx 16rpx;
		margin-top: 8rpx;
	}

	.product-new .tabs .item.active .tit {
		font-weight: 700;
	}

	.product-new .tabs .item.active .txt {
		background: linear-gradient(-88deg, rgba(255, 79, 46, 1), rgba(249, 31, 40, 1));
		color: #fff;
	}

	.product-new .tabs .item:after {
		content: ' ';
		position: absolute;
		height: 80%;
		width: 1px;
		right: 0;
		top: 10%;
		background-color: #ccc;
	}

	.product-new .tabs .item:last-child:after {
		height: 0;
	}

	.product-new .goods-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 0;
	}

	.product-new .goods-list .item {
		width: 48.5%;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 2.5%;
		position: relative;
		z-index: 1; // 确保商品项的层级低于底部按钮
	}

	.product-new .goods-list .item .img-box {
		line-height: 0;
		position: relative;
	}

	.product-new .goods-list .item .info-box .goods-name {
		color: #000;
		font-weight: 500;
		height: 42px;
		line-height: 20px;
		font-size: 30rpx;
		margin-top: -16rpx;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.goods-list .label-list {
		overflow: hidden;
		margin-top: 10rpx;
	}

	.goods-list .label-list .label-img {
		height: 16px;
		margin: 0 10rpx 0 0;
	}

	.goods-list .label-list .label-img:last-child {
		margin-right: 0;
	}



	.exclusive_on {
		width: 100%;
		/* margin-top: 20rpx; */

		/* position: absolute;
		left: 0upx;
		right: 0upx;
		bottom: -45upx;
		z-index: 990; */
	}

	.exclusive {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 14rpx 20rpx;
		font-size: 28upx;
		border-radius: 20rpx 20rpx 0 0;
		// margin: 0 30upx;
		z-index: 990;
		background: linear-gradient(to right, #FFCF88 40%, #FCE6BB 80%, #FCE6BB 50%);
		box-shadow: 0px 5upx 20upx 0px rgba(108, 108, 108, 0.1);
	}

	.exclusive .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.exclusive .left .icon_vip,
	.exclusive .left .icon_vip image {
		height: 56upx;
		width: 200rpx;
	}

	.exclusive .left text {
		margin-left: 10upx;
		font-weight: 500;
	}

	.exclusive .center {
		flex: 1;
		position: relative;
		padding: 0 0 0 20upx;
		/* margin-left: 20upx; */
		color: #805223;
		font-size: 26upx;
		line-height: 40upx;
		height: 40upx;
	}

	/* 	.exclusive .center::after {
		content: " ";
		position: absolute;
		z-index: 2;
		background-color: #885E2B;
		width: 2upx;
		height: 20upx;
		left: 0;
		top: 50%;
		margin-top: -10upx;
	} */

	.exclusive .right {
		background: linear-gradient(to right, #EA0C21 40%, #FF4B30 80%, #FF4B30 50%);
		border-radius: 30upx;
		padding: 4rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 33;
	}

	.exclusive .right text {
		color: #ffffff;
		font-size: 26upx;
	}

	.exclusive .right .uni-icon {
		display: block;
	}

	/* 优惠弹框 start */
	.pop_content {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;

		.pop_header {
			position: relative;
			padding: 0 30rpx;
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;

			.icon-find-fanhui {
				position: absolute;
				top: 50%;
				left: 30rpx;
				transform: translateY(-50%);
				font-size: 28rpx;
			}

			.pop_title {
				font-size: 32rpx;
				font-weight: 700;
				line-height: 90rpx;
				color: #282828;
			}

			.close_img {
				position: absolute;
				top: 50%;
				right: 30rpx;
				transform: translateY(-50%);
				width: 44rpx;
				height: 44rpx;
			}
		}

		.pop_scroll_view {
			padding: 20rpx 30rpx 30rpx;

			.label_text {
				// margin-bottom: 0.2rem;
				font-weight: 700;
				color: #000;
			}

			.list_wrap {
				margin-bottom: 20rpx;
			}

			.pop_activity_item {
				display: flex;
				align-items: baseline;

				&:nth-child(n + 2) {
					margin-top: 20rpx;
				}

				.activity_bg {
					flex: none;
					height: 38rpx;
					line-height: 38rpx;
					padding: 0 10rpx;
					text-align: center;
					border-radius: 4rpx;
					margin-right: 16rpx;
					font-size: 24rpx;
					color: #F44C36;
					background: #FEE9E6;
				}

				.activity_tips {
					flex: auto;
					line-height: 40rpx;
				}
			}
		}

		.coupons_list {
			.coupons_item {
				display: flex;
				margin-top: 20rpx;
			}

			.coupons_left {
				position: relative;
				flex: none;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 200rpx;
				height: 200rpx;
				border-radius: 20rpx 0 0 20rpx;
				color: #fff;
				background-color: #f52923;

				.coupon_price {
					margin-top: 30px;
					font-size: 52rpx;
					line-height: 1;
				}

				.coupon_desc {
					margin-top: 10px;
					padding: 0 20rpx;
					text-align: center;
					font-size: 22rpx;
				}

				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
					transform: translate(50%, 50%);
					border-radius: 50%;
					background-color: #fff;
					z-index: 2;
				}

				&:before {
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
					transform: translate(50%, -50%);
					border-radius: 50%;
					background-color: #fff;
					z-index: 2;
				}
			}

			.coupons_right {
				overflow: hidden;
				position: relative;
				flex: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				max-width: calc(100% - 200rpx);
				border-radius: 0 20rpx 20rpx 0;
				// border: 1px solid #f2d2d2;
				border-left-width: 0;
				background-color: #fbf2f2;

				.coupon_title {
					margin: 16rpx 20rpx 0;
					font-size: 26rpx;
					color: #999;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;

					.coupon_tag {
						display: inline-block;
						padding: 0 16rpx;
						height: 48rpx;
						line-height: 48rpx;
						border-radius: 10rpx;
						margin-right: 20rpx;
						text-align: center;
						font-size: 26rpx;
						color: #fff;
						background-color: rgba(245, 41, 35, .6);
					}
				}

				.get_coupon_time {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 20rpx;

					.coupon_time {
						flex: 1;
						margin: 0 20rpx;
						font-size: 26rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #999;
					}

					.coupon_btn {
						// min-width: 160rpx;
						height: 48rpx;
						line-height: 44rpx;
						border-radius: 26rpx;
						text-align: center;
						padding: 0 15rpx;
						font-size: 24rpx;
						margin-right: 20rpx;
						border: 2rpx solid #F52923;
						color: #fff;
						background-color: #F52923;
					}

					.u-reset-disabled {
						background: #999999;
						color: #FFFFFF;
						border-color: #999999;
					}

					.is_get_btn {
						color: #F52923;
						background-color: transparent;
					}
				}

				&:after {
					content: '';
					position: absolute;
					bottom: -24rpx;
					left: -22rpx;
					width: 42rpx;
					height: 42rpx;
					// transform: translate(-50%, -50%);
					border-radius: 50%;
					background-color: #f2d2d2;
				}

				&:before {
					content: '';
					position: absolute;
					top: -24rpx;
					left: -22rpx;
					width: 42rpx;
					height: 42rpx;
					// transform: translate(-50%, -50%);
					border-radius: 50%;
					background-color: #f2d2d2;
				}
			}
		}
	}

	/* 优惠弹框 end */

	/* 配送弹框 start */
	.address-popup-scroll {
		padding: 24rpx 30rpx 30rpx;
	}

	.address_item_card {
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}

	.address_item_card:last-child {
		margin-bottom: 0;
	}

	.address_item_card--checked {
		box-shadow: 0 2rpx 12rpx rgba(249, 31, 40, 0.15);
	}

	.address_item_card .address_item {
		display: flex;
		align-items: flex-start;
		padding: 24rpx 24rpx;

		.clicked_ico {
			flex: none;
			height: 20px;
			line-height: 1;
		}

		.address_item_content {
			flex: 1;
			margin-left: 24rpx;
			min-width: 0;
		}

		.address-info {
			display: flex;
			align-items: center;
			gap: 16rpx;
			margin-bottom: 12rpx;
		}

		.receiver-name {
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}

		.receiver-phone {
			font-size: 26rpx;
			color: #666;
		}

		.address_default_tag {
			border-radius: 8rpx;
			border: 2rpx solid #F91F28;
			padding: 2rpx 12rpx;
			font-size: 22rpx;
			color: #f91f28;
			line-height: 1.2;
		}

		.address-detail {
			font-size: 26rpx;
			color: #666;
			line-height: 1.5;
			
			
		}
	}

	.btn_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100rpx;
		padding: 0 30rpx;

		.address_btn {
			flex: auto;
			margin: 0;
		}
	}

	/* start--Retina 屏幕下的 1px 边框--start */
	.u-border,
	.u-border-bottom,
	.u-border-left,
	.u-border-right,
	.u-border-top,
	.u-border-top-bottom {
		position: relative
	}

	.u-border-bottom:after,
	.u-border-left:after,
	.u-border-right:after,
	.u-border-top-bottom:after,
	.u-border-top:after,
	.u-border:after {
		/* #ifndef APP-NVUE */
		content: ' ';
		/* #endif */
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		box-sizing: border-box;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		// 多加0.1%，能解决有时候边框缺失的问题
		width: 199.8%;
		height: 199.7%;
		transform: scale(0.5, 0.5);
		border: 0 solid #F9F9F9;
		z-index: 2;
	}

	.u-border-top:after {
		border-top-width: 1px
	}

	.u-border-left:after {
		border-left-width: 1px
	}

	.u-border-right:after {
		border-right-width: 1px
	}

	.u-border-bottom:after {
		border-bottom-width: 1px
	}

	.u-border-top-bottom:after {
		border-width: 1px 0
	}

	.u-border:after {
		border-width: 1px
	}

	/* start--去除button的所有默认样式--start */
	.u-reset-button {
		padding: 0;
		font-size: inherit;
		line-height: inherit;
		background-color: transparent;
		color: inherit;
	}

	.u-reset-button::after {
		border: none;
	}

	.sub_btn {
		flex: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 80rpx;
		border-radius: 40rpx;
		background-color: #FE2F02;
		font-weight: 700;
		color: #fff;
		line-height: 1.3;
		font-size: 15px;

		.jiage {
			font-weight: normal;
			font-size: 12px;
		}
	}

	.red_btn {
		background-color: #F91F28;
	}

	.none_lauout {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.none_img {
		margin-left: -30rpx;
		width: 260rpx;
		height: 260rpx;
	}

	.btnSub {
		width: 220rpx;
		height: 76rpx;
		background: #FF4500;
		border-radius: 38rpx;
		margin: 6rpx 16rpx 6rpx 0;
		// margin-right: 16rpx;
	}

	.checkout-btn-inner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
	}

	.checkout-btn-spinner {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		border: 2rpx solid rgba(255, 255, 255, 0.45);
		border-top-color: #ffffff;
		animation: checkout-spin 0.9s linear infinite;
	}

	@keyframes checkout-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	// 新的合计区域样式
	.price-wrapper-new {
		
		
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.label-text-new {
		font-size: 24rpx;
		color: #333333;
	}
	
	.submit-bar-price-new {
		font-size: 32rpx;
		font-weight: 600;
		color: #FF4500;
	}
	
	// 新的底部左侧区域样式
	.bottom-left-new {
		
		
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.quantity-text-new {
		font-size: 24rpx;
		color: #999999;
	}
	
	.discount-text-new {
		font-size: 24rpx;
		color: #333333;
	}
	
	.detail-btn-new {
		color: #ff4d4f;
		font-weight: 500;
		font-size: 24rpx;
		margin-left: 16rpx;
	}

	// onemore
	.goods_attr_pop {
		position: relative;
		padding: 30rpx;

		.close_img {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			width: 44rpx;
			height: 44rpx;
		}

		.goods_info_send {
			background: #FE2F02;
			border-radius: 20rpx;
			margin-right: 50rpx;
			color: #fff;
			display: flex;
			flex-direction: column;

			.top {
				display: flex;
				justify-content: space-between;
				margin: 24rpx;

				.top-left {
					display: flex;

					.top-left-right {
						display: flex;
						align-items: center;
					}

					image {
						width: 20rpx;
						height: 28rpx;

					}
				}
			}

			.bottom {
				display: flex;
				background-color: #fff;
				border-radius: 16rpx;
				margin: 8rpx;

			}
		}

		.goods_info {
			display: flex;

			.goods_pic {
				flex: none;
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}

			.info_right {
				flex: auto;
				display: flex;
				margin-left: 20rpx;

				flex-direction: column;
				color: #FE2F02;

				.info_right_frist {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-weight: 500;
					font-size: 32rpx;
					color: #FE2F02;
					line-height: 32rpx;
					margin-bottom: 16rpx;

					text {
						margin-right: 10rpx;
					}
				}

				.info_right_second {
					font-weight: 400;
					font-size: 28rpx;
					color: #A2A2A2;
					margin-bottom: 16rpx;

					text {
						margin-right: 10rpx;
					}
				}

				.info_right_three {
					font-weight: 500;
					font-size: 24rpx;
					color: #FE2F02;
					margin-bottom: 16rpx;

					image {
						width: 22rpx;
						height: 28rpx;
						margin-right: 10rpx;

					}
				}

				.selece_atrr {
					margin-top: 10rpx;
					line-height: 40rpx;
				}
			}
		}

		.inventory {
			display: flex;
			margin-top: 10rpx;
			color: #999;
			flex-wrap: wrap;
			font-size: 24rpx;

			.inventory_num {
				flex: none;
				margin-right: 20rpx;
				line-height: 40rpx;
			}

			.inventory_sn {
				flex: auto;
				display: flex;
				white-space: normal;
				word-break: break-all;
				word-wrap: break-word;
				line-height: 40rpx;

				.label {
					flex: none;
				}
			}
		}

		.goods_attr_wrap {
			.attr_title {
				font-weight: 700;
			}

			.attr_type {
				padding-top: 30rpx;
			}

			.attr_list1 {
				flex-wrap: inherit !important;
			}

			.attr_list {
				display: flex;
				flex-wrap: wrap;
				// width: 720rpx;
				position: relative;

				.attr_list_box_label {
					display: flex;
					width: 100%;
				}

				.attr_top_num_box {
					position: relative;
				}

				.attr_top_num {
					display: flex;
					flex-direction: row;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 16rpx;
						margin-right: 16rpx;
						margin-top: 16rpx;
					}

					text {}
				}

				.attr_item {
					padding: 26rpx 20rpx;
					margin-right: 24rpx;
					margin-bottom: 20rpx;
					text-align: start;
					border-radius: 0 10rpx 10rpx 0;
					background: #EDEDED;
					position: relative;


				}

				.active_attr {
					color: #fff;
					background-color: #FE2F02;
				}
			}

			.goods_num_wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;

				.limit_and_mun {
					display: flex;
					align-items: center;

					.limit_txt {
						font-size: 24rpx;
						color: #F22E20;
					}

					.add_num_wrap {
						display: flex;
						justify-content: center;
						align-items: center;

						.iconfont {
							flex: none;
							width: 50rpx;
							height: 50rpx;
							line-height: 50rpx;
							font-size: 28rpx;
							font-weight: 700;
							text-align: center;
						}

						.limit_1 {
							color: #EAEAEA;
						}
					}

					.add_input {
						width: 100rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						font-weight: 400;
						background-color: #F2F2F2;
					}
				}
			}
		}
	}

	// 1
	.specs {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
	}

	.spec-item {
		position: relative;
		padding: 12rpx 24rpx;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
	}

	.badg_block {
		display: block;
	}

	.badg_none {
		display: none;
	}

	.badge {
		position: absolute;
		left: 0rpx;
		top: 0rpx;
		background: #f40;
		color: white;
		padding: 2px 8px;
		border-radius: 20rpx;
		text-align: center;
		line-height: 20rpx;
		font-size: 24rpx;
	}

	.size-label {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.size-item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 44rpx;
		padding: 0rpx;
		border-radius: 8rpx;
	}

	.counter {
		display: flex;
		align-items: center;

	}

	.counter button {
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0;
	}

	.count-input {
		width: 80rpx;
		text-align: center;
		margin: 0 10rpx;
	}

	.active {
		border-color: #f40 !important;
		color: #f40;
	}

	.spec-item {
		position: relative;
		padding: 16rpx 32rpx;
		border: 2rpx solid #eee;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
	}

	.color-block {
		width: 40rpx;
		height: 40rpx;
		border-radius: 8rpx;
		margin-right: 16rpx;
		border: 1rpx solid #ddd;
	}

	.spec-info1 {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		margin-bottom: 16rpx;
		align-items: center;
		width: 100%
	}

	.spec-info {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		margin-bottom: 16rpx;

		.spec-info-text {
			font-weight: bold;
			font-size: 14px;
			color: #272727;
		}

		.spec-info-price {
			font-weight: 400;
			font-size: 12px;
			color: #999999;
		}
	}

	.price {
		color: #f40;
		font-weight: bold;
	}

	.total-section {
		background: #fff;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
		align-items: baseline;

		.show_city {
			display: flex;

			.activity_list {
				width: 55px;
				height: 20px;
				overflow: hidden;
			}
		}

		.show_city {
			position: relative;

			.footer-total-price-img {
				height: 6px;
				width: 10px;
				position: absolute;
				top: 10px;
				right: -3px;
				transform: rotate(90deg);
			}

			.footer-total-price-img {
				height: 6px;
				width: 10px;
				position: absolute;
				top: 10px;
				right: -3px;
				transform: rotate(90deg);
			}
		}

		.total-section-goods-num {
			font-weight: 400;
			font-size: 12px;
			color: #FE2F02;
		}
	}

	.footer-total-price-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.footer-total--right-amout {
			display: flex;
			flex-direction: row;
			align-items: flex-end;

			text {
				margin-right: 10rpx;
			}
		}
	}


	.footer-total-price-btn {
		// background-color: red;
	}

	// 2
</style>
