<template>
	<view class="user-default">
		<view class="container">

			<view class="nav_bar">
				<!-- #ifdef APP-PLUS -->
				<view class="status_bar">
					<!-- 这里是状态栏 -->
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="goodsCartList.length == 0" style="height: 70rpx;"></view>
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- #endif -->
			</view>

	<x-skeleton :configs="configs" :loading="loading3">
			<view v-if="goodsCartList.length > 0 || loading3">
				<view class="header-address" :style="{ height: gaodu + 'px' }">
					<view class="header-address-box">
						<view class="address-box" @click="showPopup('address')">
							<view style="font-weight: bold;font-size: 32rpx;color: #272727;min-width: 130rpx;">
								{{$t('lang.purchase_cart')}}
							</view>
							<view class="iconfont icon-location"></view>
							<text>{{ regionSplic }}</text>
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
										v-if="storeList.shop_grade==13">{{storeList.shop_grade_name}}</text>
									<uni-icons type="arrowright" size="16" color="#333333"></uni-icons>
								</view>
								<view class="checkbox-con" v-else>
									<text class="goods-name-text">{{ storeList.store_name }}</text>
									<text class="goods-tag" style=""
										v-if="storeList.shop_grade==13">{{storeList.shop_grade_name}}</text>
								</view>
							</view> <!-- 领取优惠券 -->
							<!-- 		<view class="head-right uni-red" @click="handleCoupon(storeList.store_id)"
								v-if="storeList.coupuns_num > 0">{{$t('lang.receive_coupon')}}</view> -->
							<view view class="head-right uni-red" v-if="storeList.coupuns_num > 0">
								<view class="head-right-left" v-if="storeList.use_coup_info"
									@click="handleCoupon(storeList.store_id)">
									<text class="full_reduction">{{$t('lang.full_reduction')}}</text>
									<text class="use_coup_info">{{storeList.use_coup_info}}</text>
								</view>
								<view class="more"
									@click="$outerHref('/pagesD/cart/coudan/coudan?act_id='+(storeList.new_list && storeList.new_list[0] ? storeList.new_list[0].act_id : 0),'app')">
									<view>{{$t('lang.gather_together')}}</view>
									<uni-icons style="line-height: 28rpx; display: inline-block;vertical-align: bottom;"
										type="arrowright" size="16" color="#f92028"></uni-icons>
								</view>
							</view>
						</view>
						<view class="card-shop-box">
							<view class="card-act-goods" v-for="(actItem,actIndex) in storeList.new_list"
								:key="actIndex">

								<view class="cart-act-title" v-if="actItem.act_type != null">
									<view class="txt">
										<view class="em-icon" style="width: 35px;"
											:class="{'active-zeng':actItem.act_type == 0,'active-zhekou':actItem.act_type == 2}">
											{{ actItem.act_type_txt }}
										</view>
										<view class="act-name" v-if="actItem.act_type == 0">
											<view v-if="actItem.available">
												{{$t('lang.filled_in')}}{{ actItem.min_amount }}
												<text class="uni-red"
													@click="receiveGift(actItem.act_id,false,actItem.min_amount)">{{$t('lang.get_gift')}}</text>
											</view>
											<!-- get_gift 领取赠品   are_get_gift可领取赠品  view_gift查看赠品
											stand_minus立减  minus减  enjoy_equity享受权益  enjoy享    filled_in查看赠品-->
											<view v-else>
												{{$t('lang.shopping_with')}}{{ actItem.min_amount }},{{$t('lang.are_get_gift')}},
												<text class="uni-red"
													@click="receiveGift(actItem.act_id,true,actItem.min_amount,actItem)">{{$t('lang.view_gift')}}</text>
											</view>
										</view>
										<view class="act-name" v-else-if="actItem.act_type == 1">
											<view v-if="actItem.available">
												{{$t('lang.filled_in')}}{{ actItem.min_amount }}（{{$t('lang.stand_minus')}}{{actItem.act_type_ext_format}}）
											</view>
											<view v-else>
												{{$t('lang.man')}}{{ actItem.min_amount }}{{$t('lang.minus')}}{{ actItem.act_type_ext_format }}
											</view>
										</view>
										<view class="act-name" v-else>
											<view v-if="actItem.available">
												{{$t('lang.filled_in')}}{{ actItem.min_amount }}（{{$t('lang.enjoy')}}{{ actItem.act_type_ext_format }}{{$t('lang.percent_off_Discount')}}）
											</view>
											<view v-else>
												{{$t('lang.shopping_with')}}{{ actItem.min_amount }}{{$t('lang.enjoy')}}{{ actItem.act_type_ext_format }}{{$t('lang.percent_off_Discount')}}
											</view>
										</view>
									</view>
									<view class="more"
										@click="actItem.available ? $outerHref('/pagesD/shop/shopHome/shopHome?ru_id='+storeList.store_id,'app') : $outerHref('/pagesD/cart/coudan/coudan?act_id='+actItem.act_id,'app')">
										<view v-if="actItem.available">{{$t('lang.visit_again')}}</view>
										<view v-else>{{$t('lang.gather_together')}}</view>
										<uni-icons type="arrowright" size="16" color="#f92028"></uni-icons>
									</view>
								</view>
								<block v-for="(item,index) in actItem.act_goods_list" :key="index">
									<uni-swipe-action>
										<uni-swipe-action-item :right-options="options"
											@click="deleteCartGoods(item.rec_id)">
											<view class="scroll-view-item scroll-view-item-left">
												<view class="uni-flex">
													<view class="checkbox"
														:class="{'checked':checkedGoods[listIndex].includes(item.rec_id),'checkbox-disabled':item.is_invalid == 1 || item.product_number == 0 }"
														@click="checkGoods(item.rec_id,listIndex,item.is_invalid,item.product_number,checkedGoods[listIndex].includes(item.rec_id),item.store_name,actIndex,index,item.act_id,item.goods_number,item.goods_price,item)">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16" color="#ffffff"
																v-if="item.is_invalid != 1"></uni-icons>
														</view>
													</view>
													<view class="checkbox-con" style="flex: 1 1 0%;">
														<view class="goods-title twolist-hidden">
															<navigator
																:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																hover-class="none">
																<image class="country_icon" :src="item.country_icon"
																	:lazy-load="true" v-if="item.country_icon">
																</image>
																{{ item.goods_name }}
															</navigator>
														</view>
														<view class="cart-goods-info">
															<view class="goods-img">
																<navigator
																	:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																	hover-class="none">
																	<image :src="item.goods_thumb"
																		v-if="item.goods_thumb" class="image"></image>
																</navigator>
																<block
																	v-if="item.is_invalid == 0 && item.product_number == 0">
																	<view class="mask"></view>
																	<view class="mash-text">{{$t('lang.no_goods')}}
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

																<!--商品标签-->
																<view class="goods-label-suspension"
																	v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
																	<image
																		:src="item.goods_label_suspension.formated_label_image"
																		class="img"></image>
																</view>
															</view>
															<view class="cart-goods-content cart-goods-content1">
																<!-- 商品详情 -->

																<navigator
																	:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																	hover-class="none">
																	<view class="goods-attr-label">
																		<view class="goods-attr twolist-hidden"
																			v-if="item.goods_attr">{{ item.goods_attr }}
																		</view>
																		<text class="iconfont icon-more size_24"></text>
																	</view>
																</navigator>
																<!-- one more  -->
																<!-- <view @click="oneMore(item)">
																	<text>再选一款 +</text>
																</view> -->
																<!-- one more  -->
																<view class="goods-info">
																	
																	
																	<view class="price">{{ item.goods_price_format }}
																	<view v-if="item.is_membership_card_discount_price"
																		style="font-size: 20rpx;color: #4D4B4B;">黑卡价</view>
																	
																	</view>
																	
																	<!-- 数量框  -->
																	<view class="oper">
																		<view class="uni-number-min">
																			<uni-number-box :value="item.goods_number"
																				:min="item.is_minimum > 0 ? item.minimum : 1"
																				:max="(item.xiangou_num > 0 && item.xiangou_end_date > item.current_time) ? item.xiangou_num  : item.product_number"
																				@change="goodsNumberhandle($event,item.rec_id,item.act_id,storeList.store_id,listIndex,actIndex,index,item.goods_price)"
																				:disabled="stepDisabled.length > 0 ? stepDisabled[listIndex][index].type : false">
																			</uni-number-box>
																		</view>
																		<view class="oper-icon"></view>
																	</view>
																</view>
																<view class="goods-other" style="max-width: 420rpx;"
																	v-if="actItem.act_type != null"
																	@click="onFavourableList(item.goods_id,item.ru_id,item.act_id,item.rec_id)">
																	<view class="em-icon"
																		:class="{'active-zeng':actItem.act_type == 0,'active-zhekou':actItem.act_type == 2}">
																		{{ actItem.act_type_txt }}
																	</view>
																	<view class="act-name uni-ellipsis">
																		{{ actItem.act_name }}
																	</view>
																	<!-- <uni-icons v-if="item.favourable_list.length > 1" type="arrowdown" size="18"
																		color="#f23030"></uni-icons> -->
																	<uni-icons type="arrowdown" size="18"
																		color="#999999"></uni-icons>
																</view>
																<!-- <view class="act-name" style="color: #f23030;margin-top: -10rpx;font-size: 22rpx;" v-if="item.favourable_list">（{{item.favourable_list.length}}个活动可选）</view> -->
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
															</view>
														</view>
														<!-- 展示一条最低价格优惠券 去凑单  -->
														<view class=""></view>
														<view class="goods-store" v-if="item.store_count > 0">
															{{$t('lang.support')}}<text
																class="uni-red">{{$t('lang.private_store')}}</text>{{$t('lang.service')}}
														</view>
													</view>
												</view>
											</view>
										</uni-swipe-action-item>
									</uni-swipe-action>

									<!-- 配件商品 -->
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
																	v-if="partsItem.is_invalid == 0 && partsItem.product_number == 0">
																	<view class="mask"></view>
																	<view class="mash-text">{{$t('lang.no_goods')}}
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

																<!--商品标签-->
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
								<!-- 赠品 -->
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
						<!-- 查看更多商品按钮 -->
						<view class="load-more-goods" v-if="storeList.ishas_more_goods === true">
							<view class="load-more-btn" @click="loadMoreGoods(listIndex, storeList)" 
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
						<!-- <view style="width: 100rpx;"></view> -->
						<view class="submit-bar-text">

							<view class="submit-bar-text-top">
								<view class="text">
									<text v-if="nums>0&&count>0" class="quantity-text">{{nums}}种{{count}}件</text>
								</view>
								<view class="price-wrapper">
									<!-- <text>{{$t('lang.total_flow')}}:</text> -->
									<text class="label-text">合计:</text>
									<view class="submit-bar-price" v-if="totalPriceTiping">{{totalPriceTip}}</view>
									<!-- 	<currency-price class="submit-bar-price"  v-if="totalPriceTiping" :price="totalPriceTip || 0 "
											 :size="14"  color="#FE2F02"
											></currency-price> -->
									<view class="submit-bar-price" v-else>计算中</view>
								</view>

							</view>

							<view class="submit-bar-sub">
								<!-- <text v-if="nums>0&&count>0" style="margin-right: 10rpx;">{{nums}}种{{count}}件;</text> -->
								<text v-if="nums>0&&count>0">
									<text
										v-if="totalPriceTiping">{{$t('lang.all_subtraction')}}{{formatAmount(totalDiscount)}}</text>
									<!-- <text v-if="totalPriceTiping">包含运费{{shipping_fee}}</text> -->
									<text v-if="!totalPriceTiping">计算中</text>
									<text @click="showPopup('priceDetail')"
										style="cursor: pointer;padding: 40rpx 0 0 16rpx;">{{$t('lang.detailed')}}</text>
								</text>
								<text v-else>{{$t('lang.already_save_one')}}</text>

							</view>
						</view>
						<view class="btn-bar">
							<block v-if="!batchEdit">
								<button class="btnSub" :class="[disabled ? 'btn-disabled' : 'btn-red']"
									:disabled="disabled" @click="onSubmit">{{ submitBarText }}</button>
							</block>
							<button class="btn" :class="[length > 0 ? 'btn-red' : 'btn-disabled']"
								:disabled="!length > 0" @click="onBatchDelete"
								v-else>{{$t('lang.batch_delete')}}</button>
						</view>
					</view>
				</view>
			</view>
			
			
			
			<view class="flow-no-cart" v-else-if="!loading3 && goodsCartList.length === 0">
				<!-- 数据加载中，显示 loading 弹窗 -->
				<view v-if="dataLoading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100rpx 0;">
					<uni-load-more-new status="loading" :type="false" color="#F20E28" iconType="circle"></uni-load-more-new>
					<text style="margin-top: 20rpx; color: #666; font-size: 28rpx;">加载中请稍后</text>
				</view>
				<!-- 数据加载完成，确实没有数据，显示空状态 -->
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

							<!-- 此处插入组件 -->
							<!-- 	<waterfall :value="goodsGuessList" :column="2" :columnSpace="1.5" :seat="2"
									@imageClick="linkHref">
									<template v-slot:default="{ item }">
										<view style="position: relative;" class="info-box-label"></view>
									
									</template>
								</waterfall> -->
							<view class="product-list-lie">
								<dsc-product-list :list="goodsGuessList" :showone="true"
									:productOuter="true"></dsc-product-list>
							</view>
							<!-- </view> -->
							<!-- </view> -->
						</view>
						<uni-load-more :status="loadMoreStatus" :content-text="contentText"
							v-if="page > 1 && showLoadMore" />
						<view style="height: 100rpx;"></view>
					</view>
				</view>
			</view>

			<!-- 领取赠品列表 -->
			<uni-popup :show="giftShow" type="bottom" v-on:hidePopup="handelClose('gift')">
				<view class="activity-popup">
					<view class="title">
						<view class="txt">
							{{$t('lang.amount_max_available')}}{{ act_type_ext }}{{$t('lang.goods_letter')}}

							<!-- 提交 -->
							<button type="warn" size="mini" @click="submitGift"
								v-if="giftDisabled">{{$t('lang.subimt')}}</button>
						</view>
						<uni-icons type="closeempty" size="36" color="#999999" @click="handelClose('gift')"></uni-icons>
					</view>
					<view class="content">
						<scroll-view scroll-y style="height:250px;">
							<view class="cart-goods-item" v-for="(item,index) in giftList" :key="index">
								<view class="checkbox" :class="{'checked':item.is_checked}"
									@click="checkGift(item.id,item.price,index)">
									<view class="checkbox-icon">
										<uni-icons type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
									</view>
								</view>
								<view class="checkbox-con">
									<view class="cart-goods-info">
										<view class="goods-img">
											<image :src="item.thumb" v-if="item.thumb" class="image"></image>
										</view>
										<view class="cart-goods-content">
											<view class="goods-title twolist-hidden">{{ item.name }}</view>
											<view class="goods-info">
												<view class="price">{{ item.price_formated }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-popup>

			<!-- 促销活动 -->
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

			<!-- 优惠券  -->
			<uni-popup :show="couponShow" type="bottom" v-on:hidePopup="handelClose('coupon')">
				<view class="title">
					<view class="txt">{{$t('lang.receive_coupon')}} ({{ coupuns_num }})</view>
					<uni-icons type="closeempty" size="36" color="#999999" @click="handelClose('coupon')"></uni-icons>
				</view>
				<view class="content">
					<scroll-view scroll-y style="height:300px;">
						<view class="items" v-if="cartCouponsList.length > 0">
							<view class="item" v-for="(item,index) in cartCouponsList" :key="index">
								<view class="left">
									<view class="price">
										<view class="em">￥</view>
										<view class="strong-text">{{ item.cou_money }}</view>
										<view class="couons-text">
											{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.available_full')}}
										</view>
									</view>
									<view class="con">
										<view class="range-item">{{ item.cou_name }}</view>
										<view class="range-item">{{ item.cou_start_time }} {{$t('lang.zhi')}}
											{{ item.cou_end_time }}<text
												class="uni-red">({{$t('lang.cou_user_receive_hove')}}{{ item.cou_user_num}}{{$t('lang.zhang')}})</text>
										</view>
									</view>
									<image :src="imagePath.couponsPrint" v-if="item.cou_is_receive == 1"></image>
								</view>
								<view class="right" @click="handelReceive(item.cou_id,item.ru_id)">
									<text v-if="item.cou_is_receive == 1 && isLogin">{{$t('lang.receive_hove')}}</text>
									<text v-else>{{$t('lang.receive')}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view style="height:100rpx;"></view>

			</uni-popup>
			<!-- 明细弹框 start -->
			<uni-popups ref="priceDetail" type="bottom" v-on:hidePopup="handelClose('priceDetail')">
				<view class="activity-popup" style="border-radius: 28rpx  28rpx  0rpx  0rpx;">
					<view class="price-detail-title">
						<view class="price-detail-text">
							<view class="txt">{{$t('lang.pay_detail')}}</view>
							<uni-icons class="unicon" type="closeempty" size="36" color="#999999"
								@click="handelClose('priceDetail')"></uni-icons>
						</view>
						<view class="txt">{{$t('lang.pay_prince_detail')}}</view>
					</view>
					<view class="content">
						<scroll-view scroll-y>
							<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
								<view class="label">
									<view class="label-left">商品总计</view>
									<view class="label-right">¥{{priceDtailnum}}</view>
								</view>
								<view class="label">
									<view class="label-left">总运费</view>
									<view class="label-right">¥{{shipping_fee}}</view>
								</view>
								<view class="label">
									<view class="label-left red">店铺优惠</view>
									<view class="label-right red"><text>减¥{{formatAmount(this.totalDiscount)}}</text>
									</view>
								</view>
								<view class="label">
									<view class="label-left"><text>合计</text><text
											style="font-weight: 400;font-size: 24rpx;color: #999999;margin-left: 16rpx;">不含定制服务费</text>
									</view>
									<view class="label-right">¥{{totalPriceTip}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-popups>
		

			<!-- 商品属性弹框 start -->
			<uni-popups ref="goodsattr" type="bottom">
				<view class="pop_content specification-pop-content" :style="{height: `${popHeight.hd+165}px`}">
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
							<button @click="onAddCartClicked(10)"
								class="u-reset-button sub_btn yellow_btn">{{$t('lang.confirm_add')}}</button>

						</view>

					</view>
				</view>
			</uni-popups>
			<!-- 商品属性弹框 end -->



			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

			<div class="loading-transparent" v-show="loading">
				<uni-load-more-new status="loading" :type="false" color="#F20E28" iconType="circle"></uni-load-more-new>
				<div class="loading-overlay"></div>
			</div>
			<!--返回顶部-->
			<!-- <dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top> -->
		</view>
		<custom-tabbar />
		
		<!-- 配送弹框 start  ，-->
		<uni-popups ref="address" type="bottom" style="z-index: 99999999;">
			<view class="pop_content" :style="{height: `${popHeight.hd+60}px`}">
				<view class="pop_header">
					<text class="iconfont icon-find-fanhui" v-if="currAddressSwiper == 1"></text>
					<text class="pop_title">{{$t('lang.delivery_to_the')}}</text>
					<image class="close_img"
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
						@click="closePop('address')"></image>
				</view>
				<!-- <block v-if="currAddressSwiper == 0"> -->
				<!-- #ifdef H5 -->
				<scroll-view scroll-y="true" :style="{height: `${popHeight.center-20}px`}">
					<view class="pop_scroll_view" v-if="addressList.length > 0">
						<view class="address_item" v-for="(item, index) in addressList" :key="index"
							@click="changeAddressRadio(item)">
							<view class="clicked_ico">
								<uni-icons type="checkbox-filled" size="20" color="#F91F28"
									v-if="iSaddress == item.id"></uni-icons>
								<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
							</view>
							<view>
								<view class="address_val"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="margin-right: 20rpx;">{{ item.province_name }} {{ item.city_name }}
									</view>
									<view
										style="border-radius: 10rpx;border: 2rpx solid #F91F28;width: 80rpx;text-align: center;color: #f91f28;height: 40rpx;line-height: 40rpx;transform: scale(0.8);"
										v-if="iSaddress == item.id">默认</view>
								</view>
								<view class="address_val">{{item.district_name}} {{item.street_name}}
									{{item.address}}
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
					<view class="pop_scroll_view" v-if="addressList.length > 0">
						<view class="address_item" v-for="(item, index) in addressList" :key="index"
							@click="changeAddressRadio(item)">
							<view class="clicked_ico">
								<uni-icons type="checkbox-filled" size="20" color="#F91F28"
									v-if="iSaddress == item.id"></uni-icons>
								<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
							</view>
							<view>
								<view class="address_val"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="margin-right: 20rpx;">{{ item.province_name }} {{ item.city_name }}
									</view>
									<view
										style="border-radius: 10rpx;border: 2rpx solid #F91F28;width: 80rpx;text-align: center;color: #f91f28;height: 40rpx;line-height: 40rpx;transform: scale(0.8);"
										v-if="iSaddress == item.id">默认</view>
								</view>
								<view class="address_val">{{item.district_name}} {{item.street_name}}
									{{item.address}}
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
				<view style="height: 30rpx;"></view>
		
				<view class="btn_wrap u-border-top" style="z-index: 99999999;">
					<button class="u-reset-button sub_btn address_btn red_btn" @click="togetlocation">添加新地址</button>
		
				</view>
		
			</view>
		</uni-popups>
		<!-- 配送弹框 end -->
		
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

function readSavedSelectionState() {
	const container = getSelectionContainer();
	return container[CART_SELECTION_STATE_KEY] || null;
}

function writeSavedSelectionState(state) {
	const container = getSelectionContainer();
	container[CART_SELECTION_STATE_KEY] = state;
}

function clearSavedSelectionState() {
	const container = getSelectionContainer();
	if (container && Object.prototype.hasOwnProperty.call(container, CART_SELECTION_STATE_KEY)) {
		delete container[CART_SELECTION_STATE_KEY];
	}
}

	export default {
		mixins: [universal],
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
				checkAllTimer: null,
				recIdArr: [],
				totalQuantity: 0,
				skuType: true,
				history: {}, // 存储格式：{ "颜色ID_规格ID": 数量 }
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
					center: 0
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
		onLoad() {
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
			},
		handleSelectionAfterFetch() {
			const snapshot = this.buildCartSelectionSnapshot();
			this.cartSelectionSignature = snapshot.signature;
			if (!snapshot.signature) {
				this.resetSelectionArrays();
				clearSavedSelectionState();
				return;
			}
			const saved = readSavedSelectionState();
			if (!saved) {
				// 没有保存的选中状态，直接返回
				this.resetSelectionArrays();
				return;
			}
			
			// 【增强】即使签名不完全匹配，也尝试恢复能匹配的商品选中状态
			// 这样可以支持下拉刷新时保持选中状态，即使商品数据有变化（价格、库存等）
			this.isRestoringSelection = true;
			this.resetSelectionArrays();
			const perStoreSelectedCounts = new Array(snapshot.storeSelectableCounts.length).fill(0);
			const selectedList = Array.isArray(saved.selectedRecIds) ? saved.selectedRecIds : [];
			let restoredCount = 0; // 成功恢复的商品数量
			
			selectedList.forEach((recId) => {
				const meta = snapshot.recMap[recId];
				// 如果商品不存在或已失效，自动过滤掉（不恢复）
				if (!meta || meta.isInvalid) {
					return;
				}
				const { storeIndex, actIndex, itemIndex } = meta;
				if (!Array.isArray(this.checkedGoods[storeIndex])) {
					this.$set(this.checkedGoods, storeIndex, []);
				}
				if (!this.checkedGoods[storeIndex].includes(recId)) {
					this.checkedGoods[storeIndex].push(recId);
				}
				const goodsItem = this.goodsCartList[storeIndex]?.new_list?.[actIndex]?.act_goods_list?.[itemIndex];
				if (goodsItem) {
					goodsItem.checked = true;
					restoredCount++;
				}
				perStoreSelectedCounts[storeIndex] += 1;
			});
			
			// 更新店铺选中状态
			snapshot.storeSelectableCounts.forEach((count, idx) => {
				const selected = perStoreSelectedCounts[idx] || 0;
				const shopChecked = count > 0 && selected === count;
				// 【修复问题1】如果店铺有失效商品，强制取消店铺选中
				// 即使所有有效商品都被选中，有失效商品的店铺也不应该显示为选中状态
				if (shopChecked && Array.isArray(this.shopInvalidArr) && this.shopInvalidArr[idx] === true) {
					this.$set(this.checkedShop, idx, false);
				} else {
					this.$set(this.checkedShop, idx, shopChecked);
				}
			});
			
			// 更新全选状态
			const allFullySelected = snapshot.storeSelectableCounts.every((count, idx) => {
				if (!count) return true;
				return (perStoreSelectedCounts[idx] || 0) === count;
			});
			// 如果之前是全选状态，且所有店铺都全选，则保持全选
			// 否则根据实际选中情况决定
			this.checkedAll = saved.checkedAll === true && allFullySelected;
			
			// 如果签名不匹配，但有成功恢复的商品，更新签名（表示部分恢复成功）
			if (saved.signature !== snapshot.signature && restoredCount > 0) {
				// 部分恢复成功，更新选中状态缓存
				this.saveSelectionState();
			} else if (saved.signature !== snapshot.signature && restoredCount === 0) {
				// 签名不匹配且没有成功恢复的商品，清除选中状态缓存
				clearSavedSelectionState();
			}
			
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
				writeSavedSelectionState({
					signature: snapshot.signature,
					selectedRecIds: uniqueRecIds,
					checkedAll: this.checkedAll === true
				});
				this.cartSelectionSignature = snapshot.signature;
			},
			// 加载更多商品
			loadMoreGoods(storeIndex, storeList) {
				var that = this;
				
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
								}
							});
							
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

						// 更新 Vuex store
						that.$store.commit('goodsCartList', { data: filteredList });

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
				var appVersion
				// #ifndef H5
				let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				appVersion = Number(wgtinfo.version.replace(/\./g, ''));
				// #endif
				that.addCartClass = false;
			

				if (that.attr.length > 0) {
					// newAttr = that.seleceGoodsAtrrArray;
					const map = new Map(Object.entries(that.history));

					newAttr = Array.from(map.entries()).map(([key, value]) => {
						// 分割键并判断是否需要截断
						const parts = key.split('_');
						const shouldTruncate = parts.length > 1 && parts.slice(1).every(p => p === '0');
						return {
							spec_id: shouldTruncfate ? [parseInt(parts[0], 10)] : parts.map(p => parseInt(p,
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



				that.closePop('goodsattr');
			
				that.$store.dispatch('setAddCartV1', {
					goods_id: that.oneMoreGoodsDetail.goods_id,
					num: that.totalQuantity,
					spec: newAttr,
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0',
					rec_type: type,
					app_version: appVersion,
					// cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
					cou_id: ''
				}).then(res => {
					uni.hideLoading();
					
					if (res.data.error == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
						return;
					} else {
						this.goodsList()
						uni.hideLoading();
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
			  // 注意：这里只用于判断是否有数据，不用于判断是否有缓存
			  // 因为onShow已经区分了"有缓存"和"有数据"
			  const hasDataInCache = cache && cache.goodsCartList && cache.goodsCartList.length > 0;
			  
			  // loading3 的状态已在 onShow 中正确设置，这里不需要修改
			  // onShow中：有缓存（包括空数组）时已设置为false，无缓存时已设置为true
			  
			  // 并行执行独立请求
			  Promise.all([
			    this.goodsList(),
				 this.goodsGuessHandle(1)
			 
			  ]).finally(() => {
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
				this.regionSplic = res.address;
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
				if (status == 'success') this.addressList = data;
				if (this.addressList.length > 0) {
					for (var i = 0; i < this.addressList.length; i++) {
						if (this.addressList[i].is_checked == 1) {
							this.regionSplic = this.addressList[i].address
						
							// this.regionSplic = this.addressList[i].province_name + ' ' +  this.addressList[i].city_name + ' ' +  this.addressList[i].district_name + ' ' +  this.addressList[i].street_name + this.addressList[i].address
							let o = {
								province: {
									id: this.addressList[i].province,
									name: this.addressList[i].province_name
								},
								city: {
									id: this.addressList[i].city,
									name: this.addressList[i].city_name
								},
								district: {
									id: this.addressList[i].district,
									name: this.addressList[i].district_name
								},
								street: {
									id: this.addressList[i].street,
									name: this.addressList[i].street_name
								},
								regionSplic: this.addressList[i].regionSplic
							}
							this.regionData = o
							uni.setStorageSync('regionData', o)
							//替换mixins/form-processing this.regionOptionDate
						}
					}
				} else {
					this.regionSplic = '请选择'
				}


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
			// 不调用 clearCartCache()，让选中状态能够恢复
			setTimeout(() => {
				that.goodsList(true); // 传入 true 表示强制刷新
				uni.stopPullDownRefresh();
			}, 10);
		},
			//购物车列表
			// 在data中添加
			data() {
			  return {
			    _totalPriceCache: null, // 缓存计算结果
			    _dataProcessingTimer: null,
			    _initialized: false, // 标记是否完成初始化
			    _lastFullSelectionCount: undefined,
			    _lastFullSelectionTypes: undefined,
			    // ... 其他数据
			  }
			},
			
			// ========== 购物车缓存相关方法 ==========
			/**
			 * 生成缓存 key（基于用户ID）
			 */
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
					const cacheKey = this.getCartCacheKey();
					const cacheData = {
						goodsCartList: goodsCartList || [],
						lastRecId: lastRecId || null,
						timestamp: Date.now()
					};
					uni.setStorageSync(cacheKey, JSON.stringify(cacheData));
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
			 * 处理新增商品
			 * @param {Array} newGoodsList - 新增商品列表（结构与 api/cart/goodslist 返回一致）
			 */
			handleNewGoods(newGoodsList) {
				if (!Array.isArray(newGoodsList) || newGoodsList.length === 0) {
					return;
				}
				
				newGoodsList.forEach((newStore, storeIndex) => {
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
						// 使用 Vuex mutation 来更新，确保响应式
						const newList = [newStore, ...this.goodsCartList];
						this.$store.commit('goodsCartList', { data: newList });
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

					// 5. 触发价格重计算
					setTimeout(() => {
						this.changeGoods(true); // silent=true
					}, 50);
				} catch (error) {
					// 降级到全量更新
					this.$store.commit('goodsCartList', { data: newServerData });
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

				// 只对比现有店铺的显示商品
				oldShops.forEach((oldShop, shopIndex) => {
					const newShop = newShops.find(shop => shop.store_id === oldShop.store_id);
					if (!newShop || !newShop.store_id) return;

					// 获取显示商品（前10个）
					const oldVisibleItems = this.getVisibleItems(oldShop);
					const newVisibleItems = this.getVisibleItems(newShop);

					// 对比每个显示商品
					const maxCompare = Math.min(oldVisibleItems.length, newVisibleItems.length, 10);

					for (let i = 0; i < maxCompare; i++) {
						const oldItem = oldVisibleItems[i];
						const newItem = newVisibleItems[i];

						if (this.itemHasChanged(oldItem, newItem)) {
							changes.updated.push({
								shopIndex,
								itemIndex: i,
								oldData: oldItem,
								newData: newItem
							});
						}
					}
				});

				changes.hasChanges = changes.updated.length > 0;

				return changes;
			},

			/**
			 * 获取店铺的显示商品（前10个）
			 */
			getVisibleItems(shop) {
				if (!shop || !shop.new_list || !Array.isArray(shop.new_list)) {
					return [];
				}

				const visibleItems = [];
				for (const act of shop.new_list) {
					if (act.act_goods_list && Array.isArray(act.act_goods_list)) {
						visibleItems.push(...act.act_goods_list.slice(0, 10));
						if (visibleItems.length >= 10) break;
					}
				}

				return visibleItems.slice(0, 10);
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
					oldItem.goods_name !== newItem.goods_name
				);
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
				const filteredList = this.goodsCartList.filter(shop =>
					!shopIds.includes(shop.store_id)
				);

				this.$store.commit('goodsCartList', { data: filteredList });

				// 同步更新选中状态数组
				if (shopIds.length > 0) {
					const removedIndices = [];
					this.goodsCartList.forEach((shop, index) => {
						if (shopIds.includes(shop.store_id)) {
							removedIndices.push(index);
						}
					});

					// 从后往前删除，避免索引错乱
					removedIndices.sort((a, b) => b - a).forEach(index => {
						this.checkedShop.splice(index, 1);
						this.checkedGoods.splice(index, 1);
						this.allGoodsListId.splice(index, 1);
					});
				}
			},

			/**
			 * 添加新店铺
			 */
			addShops(newShops) {
				// 添加到列表末尾
				const updatedList = [...this.goodsCartList, ...newShops];
				this.$store.commit('goodsCartList', { data: updatedList });

				// 初始化选中状态数组
				newShops.forEach(() => {
					this.checkedShop.push(false);
					this.checkedGoods.push([]);
					this.allGoodsListId.push([]);
				});
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
						batch.forEach(({shopIndex, itemIndex, newData}) => {
							this.updateSingleItem(shopIndex, itemIndex, newData);
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

				// 更新Vuex store
				this.$store.commit('goodsCartList', { data: cleanedList });

				// 【关键修复】同步更新选中状态数组
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
			updateSingleItem(shopIndex, itemIndex, newData) {
				try {
					const shop = this.goodsCartList[shopIndex];
					if (!shop || !shop.new_list) return;

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
			        that.lastRecId = cache.lastRecId;
			        that.isFirstLoad = false;
			        
			        // 恢复选择状态
			        that.$nextTick(() => {
			          that.handleSelectionAfterFetch();
			          that._initialized = true;
			          // 延迟执行 changeGoods
			          if (that.goodsCartList && that.goodsCartList.length > 0) {
			            setTimeout(() => {
			              that.changeGoods();
			            }, 50);
			          } else {
			            that.loading = false;
			          }
			        });
			      } else {
			        // 数据已经恢复，只需要确保状态正确
			        if (!that._initialized) {
			          that.$nextTick(() => {
			            that.handleSelectionAfterFetch();
			            that._initialized = true;
			            if (that.goodsCartList && that.goodsCartList.length > 0) {
			              setTimeout(() => {
			                that.changeGoods();
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
			    // 【修改】静默模式下不关闭 dataLoading，由调用方控制
			    if (!silent) {
			      // 立即关闭 loading，让 UI 先渲染
			      // 注意：不在 goodsList 中关闭 loading3，由 showEvery 的 Promise.all 统一管理
			      // 接口已经返回，无论数据是否为空，都应该立即关闭数据加载状态
			      // 因为 finishLoading 是在接口的 .then() 回调中调用的，说明数据已经更新完成
			      that.dataLoading = false;
			    }

			    // 计算并保存 lastRecId
			    const lastRecId = that.calculateLastRecId(that.goodsCartList);
			    that.lastRecId = lastRecId;

			    // 只有用户已登录时才保存缓存
			    if (isLoggedInForSave) {
			      that.saveCartCache(that.goodsCartList, lastRecId);
			    }


			    // 【优化问题2】延迟执行复杂的数据处理，避免阻塞渲染
			    // 【修复问题3】确保 processCartData() 在数据加载完成后被调用，更新 shopInvalidArr
			    if (that.processCartData && that.goodsCartList && that.goodsCartList.length > 0) {
			      that.processCartData(that.goodsCartList);
			    }
			    
			    that.$nextTick(() => {
			      // 【优化问题4】减少延迟，让 changeGoods() 更快执行
			      // 直接执行 handleSelectionAfterFetch，不等待额外的 setTimeout
			      that.handleSelectionAfterFetch();
			      that._initialized = true;
			      // 立即执行 changeGoods，不等待额外的延迟
			      if (that.goodsCartList && that.goodsCartList.length > 0) {
			        // 如果有选中商品，立即调用 changeGoods 开始计算价格
			        that.changeGoods();
			      } else {
			        // 购物车为空时（如未登录），确保关闭价格计算的 loading
			        that.loading = false;
			      }
			    });
			  };
			  
			  // 返回 Promise，确保 showEvery 中的 Promise.all 能正确等待
			  const callGoodsCart = (params) => {
			    return that.$store.dispatch('setGoodsCart', params).then((res) => {
			      // 在静默模式下，进行增量更新
			      if (silent) {
			        try {
			          that.incrementalCartUpdate(res.data);
			        } catch (error) {
			          // 降级到全量更新
			          that.$store.commit('goodsCartList', { data: res.data });
			        }
			      }
			      finishLoading();
			    }).catch((err) => {
			      // 未登录或其他错误时，确保关闭 loading
			      // 清除购物车旧数据
			      that.$store.commit('goodsCartList', { data: [] });
			      that.dataLoading = false;
			      that.loading = false; // 确保关闭价格计算的 loading
			      // 清除缓存
			      that.clearCartCache();
			      // 抛出错误，让 Promise.all 的 catch 处理
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
				// 选中店铺：如果有"查看更多"，自动加载更多商品
				if (shop.ishas_more_goods === true) {
						// 先设置选中状态
						shop.new_list.forEach((act) => {
							act.act_goods_list.forEach((g) => {
								// 只选中有效且有货的商品，排除失效商品
								if (g.is_invalid != 1 && g.product_number > 0) {
									this.checkedGoods[index].push(g.rec_id)
									g.checked = true;
								}
							})
						})
						
						// 然后加载更多商品（loadMoreGoods 内部会自动选中新加载的商品）
						this.loadMoreGoods(index, shop);
					} else {
						// 没有更多商品，正常选中
						shop.new_list.forEach((act) => {
							act.act_goods_list.forEach((g) => {
								// 只选中有效且有货的商品，排除失效商品
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
		if (is_invalid == 1 || product_number == 0) return;

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

			//获取店铺下商品数量
			this.goodsCartList.forEach((v, index) => {
				let arr = []
				v.new_list.forEach((act) => {
					act.act_goods_list.forEach((g) => {
						arr.push(g)
					})
				})

				clength.push(arr.length)
			})

			// 直接设置新的选中状态，而不是根据当前状态切换
			this.goodsCartList[index].new_list[listIndex].act_goods_list[actIndex].checked = newCheckedState;
			
			//商品勾选状态 改变店铺勾选状态
			this.checkedShop[index] = (clength[index] == this.checkedGoods[index].length)
			
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



			//商品勾选变化更新购物车列表
			changeGoods(silent = false) {
				var that = this;
				
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
				that.checkAllOper();
				that.saveSelectionState();
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
			const invalidRecIds = []; // 收集失效商品的rec_id
			that.goodsCartList.forEach(store => {
				store.new_list.forEach(act => {
					act.act_goods_list.forEach(goods => {
						if (goods.is_invalid == 1) {
							invalidRecIds.push(goods.rec_id);
						}
					});
				});
			});
			
			that.checkedGoods.forEach((v, i) => {
				v.forEach(item => {
					// 确保不添加失效商品的rec_id
					if (!invalidRecIds.includes(item)) {
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
			const inGlobalAllMode = that._globalAllSelectedMode === true;
			
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
						if (!selectable) continue;

						if (item.checked === true) {
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
								if (selectable2 && g2.checked !== true) {
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
				
			that.$store.dispatch('setCartPrice', requestParams).then(res => {
				// 静默更新模式下，不修改 loading 状态
				if (!silent) {
				that.loading = false;
				}
				if (res && res.status === 'success' && res.data) {
					// 更新价格信息
					that.totalPrice = parseFloat(res.data.total_price || 0).toFixed(2);
					that.shipping_fee = parseFloat(res.data.shipping_fee || 0).toFixed(2);
					that.priceDtailnum = parseFloat(res.data.goods_price || 0).toFixed(2);
					that.totalDiscount = parseFloat(res.data.store_cou_price || 0);
					that.totalPriceTiping = true;
					
					that.applyCartTotalsFromResponse(res.data, localGoodsCount, localGoodsTypes);
					
					// 保存最新的服务端统计，供后续增减数量时使用
					const goodsNumTotalFromServer = that.normalizeNumericValue(res.data.goods_num_total);
					const goodsTypeTotalFromServer = that.normalizeNumericValue(res.data.goods_type_total);
					that._lastFullSelectionCount = Number.isNaN(goodsNumTotalFromServer) ? undefined : goodsNumTotalFromServer;
					that._lastFullSelectionTypes = Number.isNaN(goodsTypeTotalFromServer) ? undefined : goodsTypeTotalFromServer;
					
					// 【关键】reckon_cartgoods 返回的是本次选中的新结果，必须同步到 cat_rec_id，提交/orderinfo 时才能传对
					const recList = (res.data.rec_list && Array.isArray(res.data.rec_list))
						? res.data.rec_list
						: (that.checkedGoodsId || []);
					const catRecIdStr = recList.length ? recList.join(',') : '';
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
			}).catch(err => {
				that.loading = false;
				that.totalPriceTiping = true;
				that.totalPrice = '0.00';
				// 价格计算失败，保持禁用状态
				that.disabled = true;
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
		immediatelyCheckSelectedGoods() {
		  // 直接检查商品的实际选中状态，排除失效商品
		  for (let i = 0; i < this.goodsCartList.length; i++) {
		    for (let j = 0; j < this.goodsCartList[i].new_list.length; j++) {
		      for (let z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
		        const item = this.goodsCartList[i].new_list[j].act_goods_list[z]
		        // 确保商品选中、有货且未失效
		        if (item.checked && item.product_number > 0 && item.is_invalid != 1) {
		          return true // 至少有一个选中的有效商品
		        }
		      }
		    }
		  }
		  return false // 没有选中的有效商品
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
									// 后端已更新为实际数量，现在可以安全地计算价格了
									// 释放请求锁
									this._isUpdatingNumber = false;
									uni.hideKeyboard();
									// 使用 $nextTick 确保数量更新已经同步到视图
									this.$nextTick(() => {
										// 重新计算总价和总数量，此时后端数据已经是正确的数量了
										this.changeGoods();
									});
								} else {
									// 第二次更新也失败了，但本地数量已经更新，直接计算价格
									this._isUpdatingNumber = false;
									uni.hideKeyboard();
									this.$nextTick(() => {
										this.changeGoods();
									});
								}
							}).catch((updateErr) => {
								// 即使更新失败，也释放锁并计算价格（使用本地已更新的数量）
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
			//赠品弹出层
			receiveGift(act_id, type, min_amount, actItem) {
				this.giftShow = true
				this.giftDisabled = false

				this.$store.dispatch('setGiftList', {
					act_id: act_id
				}).then(({
					data: data
				}) => {
					this.giftList = data.giftlist
					this.act_type_ext = parseInt(data.act_type_ext)
					
					if (act_id === this.actid) {
						// this.giftDisabled =true
						// type = this.giftDisabled
						

						let aa = uni.getStorageSync('allprice')
						this.minamount = Number(min_amount)
						
						if (aa >= this.minamount) {

							this.giftDisabled = true
							type = this.giftDisabled
						
						}
					} else {
						
						this.giftDisabled = false
						type = this.giftDisabled

					}


					this.giftList.forEach((v) => {
						if (v.is_checked) {
							if (this.act_type_ext > 1) {
								this.checkGiftArr.push(v.id)
							} else {
								this.checkGiftStr = v.id
							}
						}
					})
				})
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
			handleCoupon(ru_id) {
				this.couponShow = true

				this.goodsCartList.forEach(v => {
					if (v.store_id == ru_id) {
						this.coupuns_num = v.coupuns_num
					}
				})

				this.$store.dispatch('setCoupons', {
					ru_id: ru_id
				})
			},
			//优惠券领取
			handelReceive(val, ru_id) {
				this.$store.dispatch('setGoodsCouponReceive', {
					cou_id: val
				}).then(({
					data: data
				}) => {
					
					uni.showToast({
						title: data.msg,
						icon: 'none'
					})

					this.$store.dispatch('setCoupons', {
						ru_id: ru_id
					})
				})
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
										that.$store.commit('goodsCartList', { data: fallbackList });
										const lastRecId = that.calculateLastRecId(fallbackList);
										that.lastRecId = lastRecId;
										// 使用组件已有的登录判断逻辑，避免调用不存在的方法
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
											that.$store.commit('goodsCartList', { data: removedList });

											// 重新计算 lastRecId 并更新缓存
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

										that.$store.commit('goodsCartList', { data: mergedList });

										// 更新缓存：只保存合并后的整车数据
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
				}
				this.$refs[val].close()
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
			
			
			        // 提交结算
			        const ab = this.checkedGoods.reduce((acc, val) => acc.concat(val), []);
			       
			        const keysToCheck = ab;
			        const objaa = uni.getStorageSync('issubmit');
			     
			        if (Object.keys(objaa).length === 0) {
			            let ef = ab.map(num => [num])
			            uni.setStorageSync("cat_rec_id", ef);
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
			            const originalArray = result;
			            const upArr = originalArray.flatMap(([key, values]) => [
			                [key],
			                ...values.map(value => [value])
			            ]);
			            uni.setStorageSync("cat_rec_id", upArr);
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
	                    // 与单选商品一致：优先用 setCartPrice 写入的 cat_rec_id（后端 rec_list）
	                    const fromStorage = (uni.getStorageSync('cat_rec_id') || '').trim();
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
			// uni.showLoading({
			// 	title: '加载中~',
			// 	mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
			// });
			that.new_one_list = []
			
			// 【优化问题2】下拉刷新时，如果有选中商品，立即显示"计算中"状态，提前调用金额计算
			// 检查是否有选中商品（通过读取保存的选中状态）
			const saved = readSavedSelectionState();
			const hasSelectedGoods = saved && Array.isArray(saved.selectedRecIds) && saved.selectedRecIds.length > 0;
			
			if (hasSelectedGoods) {
				// 有选中商品，不重置价格，立即显示"计算中"状态
				that.totalPriceTiping = false; // 显示"计算中"
				that.loading = true; // 显示 loading 遮罩
				// 不重置 totalPrice 和 count，保持之前的值（或设置为空字符串）
				// that.totalPrice = 0 // 不重置
				// that.count = 0 // 不重置
			} else {
				// 没有选中商品，正常重置
				that.totalPrice = 0 //商品价格
				that.count = 0 //购物车勾选商品数量
			}
			
			// 【修改】不在这里重置 checkedAll，让 handleSelectionAfterFetch() 根据实际恢复情况来设置
			// that.checkedAll = false
			that.initData();
		},
	mounted() {
		// 【关键】监听其他组件的数据更新通知
		uni.$on('cart-data-updated', (data) => {
			// 这里可以处理来自其他组件的更新通知
			// 例如更新本地显示的状态等
		});

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

		// 【关键修复】页面ready后再确认tab显示状态
		setTimeout(() => {
			this.forceShowTabBar();
		}, 100);
	},
	onShow() {
	  // 【关键修复】强制显示底部tab，不受页面逻辑影响
	  this.forceShowTabBar();

	  // 【关键修复】onShow 中的所有操作都异步执行，不阻塞 tab 切换
	  // 使用 setTimeout(0) 确保在当前调用栈执行完后才执行，让 tab 切换立即生效
	  setTimeout(() => {
	    // 【关键修复】检查缓存状态并设置相应的loading状态
	    if (!hasCache) {
	      this.loading3 = true;
	    }
	    
	    // 从其他页面返回时，立即禁用结算按钮，等待价格计算完成后再启用
	    this.disabled = true;
	    // 注意：loading 状态稍后根据是否有缓存来决定是否设置
	    
	    // 继续执行后续逻辑
	    // 检查用户ID是否变化（账号切换）
	    const currentUserId = String(uni.getStorageSync('user_id') || '');
	    const cacheKey = this.getCartCacheKey();
	    const cachedUserId = cacheKey.replace('cart_cache_', '');
	    
	    // 统一转换为字符串后比较，避免类型不一致导致误判
	    if (currentUserId && cachedUserId && currentUserId !== cachedUserId) {
	      // 用户ID变化，清除旧缓存
	      this.clearCartCache();
	    }
	    
	    // 先检查是否有缓存，决定是否显示 loading3 和 loading
	    const token = uni.getStorageSync('token');
	    const isLoggedIn = token && token !== '';
	    
	    // 【方案1修复】区分"有缓存"和"有数据"
	    // hasCache: 只要缓存存在就算有缓存（包括空数组）
	    // hasData: 判断缓存中是否有数据
	    let hasCache = false;
	    let hasData = false;
	    
	    if (isLoggedIn) {
	      const cache = this.loadCartCache();
	      if (cache) {
	        // 缓存存在，无论数据是否为空都算有缓存
	        hasCache = true;
	        // 判断缓存中是否有数据
	        if (Array.isArray(cache.goodsCartList)) {
	          hasData = cache.goodsCartList.length > 0;
	        }
	      }

	      if (hasCache) {
	        // 【核心修复】有缓存时（包括空数组），立即恢复缓存数据，不显示骨架屏
	        // 立即恢复缓存数据（同步执行）
	        this.$store.commit('goodsCartList', { data: cache.goodsCartList || [] });
	        this.lastRecId = cache.lastRecId;
	        this.isFirstLoad = false;

	        // 标记为已初始化，避免 goodsList() 中重复处理
	        this._initialized = true;

	        // 强制更新，确保computed属性响应
	        this.$forceUpdate();

	        // 【核心】有缓存时直接设置loading3=false，立即显示缓存数据（包括空状态），无感知加载
	        this.loading3 = false;
	        this.dataLoading = false;

	        // 数据处理延迟执行，避免阻塞UI和tab切换
	        setTimeout(() => {
	          this.handleSelectionAfterFetch();
	          if (hasData) {
	            // 有数据时，执行价格计算和订单验证
	            setTimeout(() => {
	              // 有缓存时，使用静默更新模式，不显示 loading 遮罩
	              this.changeGoods(true); // silent = true
	            }, 100);

	            // 【临时注释】异步验证订单状态
	            setTimeout(() => {
	              console.log('[onShow] 缓存有效，开始异步验证订单状态');
	              this.verifyOrderedItems().then(orderedItems => {
	                if (orderedItems && orderedItems.length > 0) {
	                  console.log('[onShow] 缓存有效但发现过期商品:', orderedItems.length, '个');
	                  this.removeOrderedItems(orderedItems);
	                } else {
	                  console.log('[onShow] 缓存有效，订单状态正常');
	                }
	              }).catch(error => {
	                console.error('[onShow] 异步验证订单状态失败:', error);
	              });
	            }, 1500); // 延迟1.5秒，避免影响页面首次渲染
	          } else {
	            // 【核心修复】有缓存但无数据时，不显示loading，直接显示空状态
	            this.loading = false;
	          }

	          // 【修改】如果缓存已过期，并行执行全量更新和订单验证
	          if (cache.isExpired) {
	            this.isSilentUpdating = true;

	            // 【临时恢复】只执行全量更新
	            this.goodsList(true, true).finally(() => {
	              this.isSilentUpdating = false;
	            });
	          }
	        }, 50);
	      } else {
	        // 【核心修复】只在真正无缓存时才显示骨架屏和loading
	        this.loading3 = true;
	        this.loading = true; // 无缓存时，需要显示 loading 遮罩
	        this.totalPriceTiping = false;
	      }
	    } else {
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
				uni.setStorageSync('cat_rec_id', [])
			}, 0);
		},

		watch: {
			loading3: {
				handler(newVal, oldVal) {
				},
				immediate: true
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
		.status_bar {
			background-color: #f9f9f9;
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

		/* #ifdef APP-PLUS */
		width: 95%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 95%;
		margin-left: 20rpx;
		margin-top: -10rpx;
		/* #endif */
		padding: 20upx;

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

	.card-goods {}

	.card-goods-group {
		margin-bottom: 16rpx;
		padding: 20rpx 0 20rpx 20rpx;
		background: #FFFFFF;

	}

	.card-shop-head {
		display: flex;
		flex-direction: column;
		padding: 0 0 20upx;
		// margin-bottom: 10rpx;
		justify-content: space-between;

		.head-left {
			display: flex;
			align-items: center;

			.checkbox-con {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 32rpx;
				color: #272727;
				line-height: 28rpx;
				// display: inline-block;
				vertical-align: bottom;

				/* 关键：对齐底部基线 */
				.goods-name-text {
					line-height: 28rpx;
					/* 保持行高一致 */
					display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
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
		justify-content: space-between;
		padding: 4rpx 10px 4rpx 30px;
		min-height: fit-content;

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
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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

	.cart-goods-item .checkbox-con {
		// border-bottom: 1px solid #E5E5E5;
	}

	.cart-goods-item:last-child .checkbox-con {
		border-bottom: 0;
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

	.cart-goods-content .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 42rpx 0;
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
		padding: 0 20upx;
		// width: 30%;
		width: 20%;
	}

	.cart-submit .checkall .checkbox .checkbox-icon {
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text {
		text-align: right;
		// width: 280upx;
		flex: 1;
		min-width: 0;
		margin-right: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end; // 让子元素都靠右对齐

		.submit-bar-text-top {
			display: flex;
			justify-content: flex-end; // 改为靠右对齐
			align-items: flex-start;
			flex-wrap: wrap;
			width: 100%;
			flex-direction: column; // 改为垂直排列
			
			.text {
				flex: 0 0 auto;
				min-width: 0;
				text-align: right; // 文本靠右对齐
				width: 100%; // 占满宽度
				
				.quantity-text {
					font-weight: 400;
					font-size: 28rpx;
					color: #626262;
					word-break: break-all;
					white-space: normal;
				}
			}
			
			.price-wrapper {
				flex: 0 0 auto;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				min-width: 0;
				justify-content: flex-end; // 价格包装器内容靠右
				width: 100%; // 占满宽度
				
				.label-text {
					font-weight: 400;
					font-size: 28rpx;
					color: #626262;
					margin-right: 10rpx;
					flex-shrink: 0;
				}
			}
			
			text {
				font-weight: 400;
				font-size: 28rpx;
				color: #626262;
			}
		}
	}

	.cart-submit .submit-bar-text view {
		line-height: 1.5;
	}

	.cart-submit .submit-bar-text text {
		// margin-right: 10upx;
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
		.red {
			color: #FE2F02;
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
	}

	.activity-popup .cart-goods-item {
		min-height: initial;
	}

	.goods-store {
		background: #FFFFFF;
		padding: 10upx 0;
		text-align: right;
		font-size: 25upx;
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
			font-size: 28rpx;
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
		padding-bottom: env(safe-area-inset-bottom);
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
			padding: 0 30rpx 30rpx;

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
				border: 1px solid #f2d2d2;
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
	.address_item {
		display: flex;
		align-items: flex-start;
		padding: 30rpx 0;

		.clicked_ico {
			flex: none;
			height: 20px;
			line-height: 1;
		}

		.address_val {
			flex: auto;
			margin-left: 30rpx;
			line-height: 40rpx;
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
		background: #F72028;
		border-radius: 38rpx;
		margin: 6rpx 16rpx 6rpx 0;
		// margin-right: 16rpx;
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