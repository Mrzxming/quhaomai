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

			<view v-if="goodsCartList.length > 0">
				<view class="header-address" :style="{ height: gaodu + 'px' }">
					<!-- <view class="address-box" @click="handleRegionShow">
						<view class="iconfont icon-location"></view>
						<text>{{ regionSplic }}</text>
					</view> -->
					<view class="address-box" @click="showPopup('address')">
						<view class="iconfont icon-location"></view>
						<text>{{ regionSplic }}</text>
					</view>
					<view class="h-edit uni-red">
						<view v-if="!batchEdit" @click="onEdit">{{$t('lang.edit')}}</view>
						<view v-else style="display: flex;flex-direction: row;">
							<view style="margin-right: 20rpx;" @click="onDelete">清空</view>
							<view @click="onEdit">{{$t('lang.accomplish')}}</view>
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
								<view class="checkbox-con"
									@click="$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + storeList.store_id,'app')"
									v-if="storeList.store_id > 0">{{ storeList.store_name }}
									<text
										style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;margin-left: 10rpx;"
										v-if="storeList.shop_grade==13">{{storeList.shop_grade_name}}</text>
									<uni-icons type="arrowright" size="16" color="#333333"></uni-icons>
								</view>
								<view class="checkbox-con" v-else>{{ storeList.store_name }}<text
										style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;margin-left: 10rpx;"
										v-if="storeList.shop_grade==13">{{storeList.shop_grade_name}}</text></view>
							</view> <!-- 领取优惠券 -->
							<view class="head-right uni-red" @click="handleCoupon(storeList.store_id)"
								v-if="storeList.coupuns_num > 0">{{$t('lang.receive_coupon')}}</view>
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
										@click="$outerHref('/pagesD/cart/coudan/coudan?act_id='+actItem.act_id,'app')">
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
																	<view class="mash-text">
																		1{{$t('lang.lost_effectiveness')}}
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
															<view class="cart-goods-content">
																<view class="goods-title twolist-hidden">
																	<!-- 商品详情 -->
																	<navigator
																		:url="'/pagesC/goodsDetail/goodsDetail?id='+item.goods_id"
																		hover-class="none">
																		<image class="country_icon"
																			:src="item.country_icon" :lazy-load="true"
																			v-if="item.country_icon">
																		</image>{{ item.goods_name }}
																	</navigator>
																</view>
																<view class="goods-attr twolist-hidden"
																	v-if="item.goods_attr">{{ item.goods_attr }}</view>
																<view class="goods-info">
																	<view class="price">{{ item.goods_price_format }}
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
																	<view class="mash-text">
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
						<view class="shop-store-cart" v-if="shopStore.length > 0 && shopStore[listIndex][0]">
							<view class="store-btn" @click="shopStoreCart(listIndex)">
								<icon class="iconfont icon-store-alt"></icon>{{$t('lang.private_store')}}
							</view>
						</view>
					</view>
				</view>



				<view v-if="!regionShow" class="cart-submit">
					<!-- <view class="cart-submit" :style="{ bottom: regionShow ? '0' : '50px' }"> -->
					<!-- <view class="exclusive_on" v-if="userInfo&&affiliate_infovalue&&save_price>0">
						<view class="exclusive">
							<view class="left">
								<view class="icon_vip">
									<image src="https://images.eqingqu.com/attachs/photo/202309/20230918_8793CF8A18858D0105B84D3DB34BE72C.png" style="height: 56rpx;width: 200rpx;" mode="heightFix"></image>
								</view>
							</view>
							<view class="center" style="font-weight: bold;color: #000000;">享<text style="color: #EA0C21;">{{affiliate_infovalue}}折</text>会员价，本单预计节省<text style="color: #EA0C21;">￥{{save_price}}</text>元</view>
						</view>
					</view> -->
					<view style="display: flex;flex-direction: row;align-items: center;">
						<view class="checkall">
							<view class="checkbox"
								:class="{'checked':checkedAll,'checkbox-disabled':checkedAllDisabled}"
								@click="checkAll(checkedAllDisabled)">
								<view class="checkbox-icon">
									<uni-icons type="checkmarkempty" size="16" color="#ffffff"
										v-if="!checkedAllDisabled"></uni-icons>
								</view>
								<label>{{$t('lang.checkd_all')}}</label>
							</view>
						</view>
						<!-- <view style="width: 100rpx;"></view> -->
						<view class="submit-bar-text">
							<view>
								<!-- <text>{{$t('lang.total_flow')}}:</text> -->
								<text style="margin-right: 10rpx;">价格:</text>
								<view class="submit-bar-price" v-if="totalPriceTiping">{{totalPriceTip}}</view>
								<view class="submit-bar-price" v-else>计算中</view>
							</view>
							<!-- <view class="submit-bar-sub" v-if="ratePrice > 0">({{$t('lang.taxes_dues')}} {{ ratePriceTip }})
							</view>
							<view class="submit-bar-sub" v-if="favourablePrice != 0">({{$t('lang.already_save')}}
								{{ favourableTip }})
							</view> -->
							<view class="submit-bar-sub">
								<text v-if="nums>0&&count>0" style="margin-right: 10rpx;">{{nums}}种{{count}}件;</text>
								<text v-if="nums>0&&count>0">
									<text v-if="totalPriceTiping">包含运费{{shipping_fee}}</text>
									<text v-if="!totalPriceTiping">计算中</text>
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
			<view class="flow-no-cart" v-else>
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
			</view>

			<view class="goods-detail-guess" v-if="goodsGuessList">
				<view class="title"><text>{{$t('lang.guess_love')}}</text></view>
				<view class="product-list-lie">
					<view class="product-new">
						<view class="goods-list" v-if="goodsGuessList">
							<view class="item" v-for="(item, index) in goodsGuessList" :key="index">

								<view>
									<view class="img-box" @click="linkHref(item.seckill_id,item.goods_id)">
										<image class="img" :src="item.goods_thumb" mode="widthFix"
											@error="onerrorImage('goodsGuessList',index)"></image>
										<view class="goods-label-suspension"
											v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
											<image :src="item.goods_label_suspension.formated_label_image" class="img">
											</image>
										</view>
									</view>
									<view class="info-box">
										<view class="goods-name twolist-hidden"
											@click="linkHref(item.seckill_id,item.goods_id)">
											<image class="country_icon" :src="item.country_icon"
												v-if="item.country_icon">
											</image>
											<text
												style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
												v-if="item.shop_grade==13">{{item.shop_grade_name}}</text>
											{{item.title || item.goods_name}}
										</view>
										<view
											style="display: flex;flex-direction: row;align-items: center;margin-top: -26rpx;"
											@click="linkHref(item.seckill_id,item.goods_id)">
											<view
												style="display: flex;flex-direction: row;color: #F20E28;margin-top: 14rpx;">
												<view style="font-size: 22rpx;margin-top: 10rpx;">￥</view>
												<view style="font-size: 32rpx;font-weight: bold;">{{item.shop_price}}
												</view>
											</view>
											<view
												style="margin-top: 14rpx;margin-left: 20rpx;font-size: 22rpx;color: #f23030;"
												v-if="item.is_free==0">运费{{item.start_shipping_fee}}元起</view>
										</view>
										<view
											style="margin-top: -10rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;">
											<!-- {{item.sales_volume}}人已购买 --><text
												class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}
												{{$t('lang.jian')}}</text>
										</view>
									<!-- 	<view
											style="display: flex;flex-direction: row;align-items: center;font-size: 22rpx;transform:scale(0.8);margin-left: -40rpx;width: 120%;margin-top: -10rpx;">
											<view
												style="color: #FFD103;border-radius: 10rpx;border: 2rpx solid #FFD103;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="item.is_best==1">优选</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="item.is_new==1">新品</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;background-color: #fff0f0;border: 2rpx solid #fff0f0;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="item.is_anxin==1">安心购</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;background-color: #fff0f0;border: 2rpx solid #fff0f0;transform:scale(0.9);padding: 0rpx 10rpx;"
												v-if="item.is_free==1">包邮</view>
										</view> -->
									<goods-service-label :tags="item.goods_services_label_new" :max-display="3"
											v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />
										<view
											style="display: flex;flex-direction: row;align-items: center;line-height: 40rpx;margin-top: -10rpx;margin-bottom: 0rpx;width: 100%;">
											<view
												style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;">
												<image :src="item.shop_avatar"
													style="height: 40rpx;width: 40rpx;border-radius: 10rpx;"
													mode="widthFix">
												</image>
											</view>
											<text v-if="item.add_year"
												style="color: #A2A2A2;margin-left: 10rpx;">{{item.add_year}}</text>
											<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
											<text v-if="item.add_year"
												style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text>
											<view
												style="display: flex;flex-direction: row;align-items: center;width: 80%;"
												@click="toShopHome(item)">
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<!-- <view style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
												@click="onSku(item)">
												<image
													src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1691018929484.png"
													style="height: 50rpx;width: 50rpx;"></image>
											</view> -->
										</view>
										<view class="label-list" v-if="item.goods_label && item.goods_label.length > 0">
											<view class="label-img" v-for="(label,labelIndex) in item.goods_label"
												:key="labelIndex" @click="$outerHref(label.label_url)">
												<image :src="label.formated_label_image" mode="heightFix">
												</image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="loadMoreStatus" :content-text="contentText"
							v-if="page > 1 && showLoadMore" />
						<view style="height: 100rpx;"></view>
						<!-- <view :style="isIpx ? 'height: 160rpx;' : 'height: 110rpx;'"></view> -->
					</view>
				</view>
			</view>

			<!-- 领取赠品列表 -->
			<uni-popup :show="giftShow" type="bottom" v-on:hidePopup="handelClose('gift')">
				<view class="activity-popup">
					<view class="title">
						<view class="txt">
							{{$t('lang.amount_max_available')}}{{ act_type_ext }}{{$t('lang.goods_letter')}}
							<!-- <button type="warn" size="mini" @click="submitGift"
								v-if="!giftDisabled">{{$t('lang.subimt')}}</button> -->
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

			<!-- 优惠券 -->
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

			<!-- 配送弹框 start -->
			<uni-popups ref="address" type="bottom">
				<view class="pop_content" :style="{height: `${popHeight.hd+60}px`}">
					<view class="pop_header">
						<text class="iconfont icon-find-fanhui" @click="currAddressSwiper = 0"
							v-if="currAddressSwiper == 1"></text>
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
					<!-- <view class="btn_wrap u-border-top">
							<button class="u-reset-button sub_btn address_btn red_btn" style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
								@click="togetlocation">一键获取当前位置</button>
						</view> -->
					<view class="btn_wrap u-border-top">
						<button class="u-reset-button sub_btn address_btn red_btn" @click="togetlocation">添加新地址</button>
						<!-- 	<button class="u-reset-button sub_btn address_btn red_btn"
								@click="selectOtherAddress">{{$t('lang.choose_another_address')}}</button> -->
					</view>
					<!-- </block> -->
					<!-- <block v-else>
						<dsc-region :display="regionShow" regionType="goods" :regionOptionData="regionData"
							@updateDisplay="getRegionShow" @updateRegionDate="getRegionOptionDate"
							v-if="regionLoading" :abc="true"></dsc-region>
					</block> -->
				</view>
			</uni-popups>
			<!-- 配送弹框 end -->

			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

			<div class="loading-transparent" v-show="loading">
				<uni-load-more-new status="loading" :type="false" color="#F20E28" iconType="circle"></uni-load-more-new>
				<div class="loading-overlay"></div>
			</div>
			<!--返回顶部-->
			<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniNumberBox from "@/components/uni-number-box.vue";
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniLoadMoreNew from '@/components/uni-load-more-new/uni-load-more.vue';

	import universal from '@/common/mixins/universal.js';

	import dscProductList from '@/components/dsc-product-list.vue';

	/*地区选择组件*/
	import dscRegion from '@/components/dsc-region.vue';

	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import goodsServiceLabel from '@/components/goods-service-label/goods-service-label.vue'
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
			uniPopups,
			goodsServiceLabel
		},
		data() {
			return {
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
				delList: []
			};
		},
		computed: {
			...mapState({
				checkedGoods: state => state.shopping.checkedGoods, //购物车商品列表
				cartCouponsList: state => state.shopping.cartCouponsList, //优惠券列表
				allGoodsListId: state => state.shopping.allGoodsListId
			}),
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
					console.log("zheli")
					console.log(this.$store.state.user.addressId)
					return this.$store.state.user.addressId
				},
				set(value) {
					this.$store.dispatch('userAddressDefault', {
						address_id: value
					})
				}
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
						console.log("这里")
						that.page++
						that.goodsGuessHandle()
					}
				}
			}).exec()
		},
		methods: {
			onerrorImage(goodsGuessList, index) {
				this[goodsGuessList][index].goods_thumb = this.placImg
			},
			showEvery() {
				// 解决首次跳转购物车先跳转首页的BUG
				getApp().globalData.isShowCart = true;
				this.$store.dispatch('userAddress');
				this.goodsList();
				this.vipmessage();

				this.default = true;
				this.batchEdit = false;
				this.checkedAll = false;
				this.new_one_list = []
				this.totalPrice = 0 //商品价格
				this.favourablePrice = 0 //购物车优惠价格
				// this.save_price = 0 //会员预计优惠价格
				this.count = 0 //购物车勾选商品数量
				this.loading = false
				this.disabled = true
				//猜你喜欢
				this.goodsGuessHandle(1);

				this.$store.dispatch('userAddress');
				if (this.$isLogin()) {
					this.getAddressList();
				}
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
				this.regionShow = false
			},
			changeAddressRadio(res) {
				console.log(res)
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
				console.log(res.id)
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

				if (res == 'address') {
					this.regionShow = true;
				}
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
								console.log("resda", resda)
								var a = resda.data.regeocode.addressComponent
								if (a.city.length == 0) {
									console.log(a.province + ' ' + a.province + ' ' + a.district +
										' ' + a.township)
								} else {
									console.log(a.province + ' ' + a.city + ' ' + a.district +
										' ' + a.township)
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
										console.log(res1.data)
										if (res1.statusCode == 200) {
											console.log(
												"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

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
								console.log("restapi err", err);
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
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log(res.data.data)
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
						console.error(err)
					}
				})
			},
			initData() {
				var that = this
				setTimeout(() => {
					that.goodsList();
					uni.stopPullDownRefresh();
				}, 10);
			},
			//购物车列表
			goodsList() {
				var that = this
				if (that.regionData && that.regionData.district && that.regionData.district.id) {
					that.$store.dispatch('setGoodsCart', {
						warehouse_id: 0,
						area_id: 0,
						district_id: that.regionData.district.id
					})
					uni.hideLoading()
				} else {
					that.$store.dispatch('setGoodsCart', {
						warehouse_id: 0,
						area_id: 0,
						district_id: ''
					})
					uni.hideLoading()
				}
			},
			//选择店铺
			checkShop(checked, shop, index, shopInvalid, store_name) {
				console.log(24, this.checkedGoods);
				// var quchonglist = [...new Set(this.new_one_list)]
				// this.new_one_list = quchonglist
				// if(checked==false){
				// 	this.new_one_list.push(store_name)
				// } else {
				// 	quchonglist = [...new Set(this.new_one_list)]
				// 	quchonglist.splice(quchonglist.indexOf(store_name),1)
				// 	this.new_one_list = quchonglist
				// }
				// console.log(quchonglist)
				// if(quchonglist.length>6&&checked==false){
				// 	uni.showToast({
				// 		title:'每次结算店铺最多6家',
				// 		icon:'none'
				// 	})
				// 	quchonglist.splice(quchonglist.indexOf(store_name),1)
				// 	this.new_one_list = quchonglist
				// 	return;
				// }else{
				//是否有失效商品
				if (shopInvalid) return
				this.checkedShop.splice(index, 1, !checked)
				if (!checked) {
					shop.new_list.forEach((act) => {
						act.act_goods_list.forEach((g) => {
							// this.checkedGoods[index].push(g.rec_id)
							if (g.is_invalid > 0 || g.product_number > 0) {
								this.checkedGoods[index].push(g.rec_id)
							}
						})
					})
				} else {
					this.checkedGoods[index] = []
				}
				// console.log(245, this.checkedGoods);
				var a_num = 0
				if (checked == true) {
					for (var j = 0; j < this.goodsCartList[index].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[index].new_list[j].act_goods_list.length; z++) {
							this.goodsCartList[index].new_list[j].act_goods_list[z].checked = false
						}
					}
					// console.log(23, );
				} else {
					// console.log(234, this.checkedGoods);
					for (var j = 0; j < this.goodsCartList[index].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[index].new_list[j].act_goods_list.length; z++) {
							a_num = a_num + 1
							if (a_num > 200) {
								console.log(a_num)
							}
							this.goodsCartList[index].new_list[j].act_goods_list[z].checked = true
						}
					}
					// console.log(235, this.checkedGoods);
				}

				this.changeGoods()
				// }

			},
			//选择购物车商品
			checkGoods(rec_id, index, is_invalid, product_number, is_checked, store_name, listIndex, actIndex, act_id,
				goods_number, goods_price, item) {
				// console.log(this.checkedShop)
				// console.log('is_checked=' + is_checked)
				// console.log(this.new_one_list)
				// if(!this.new_one_list.includes(store_name)){
				// 	this.new_one_list.push(store_name)
				// }
				//  else {
				// 	let clength = []
				// 	//获取店铺下商品数量
				// 	this.goodsCartList.forEach((v, index) => {
				// 		let arr = []
				// 		v.new_list.forEach((act) => {
				// 			act.act_goods_list.forEach((g) => {
				// 				arr.push(g)
				// 			})
				// 		})
				// 		clength.push(arr.length)
				// 	})
				// 	if(clength[index] == this.checkedGoods[index].length){
				// 		this.new_one_list.splice(this.new_one_list.length-1,1)
				// 	}
				// }
				// return;
				// if(is_checked==false){
				// 	this.new_one_list.push(store_name)
				// } else {
				// 	 this.new_one_list.splice(this.new_one_list.length-1,1)
				// }
				// var quchonglist = [...new Set(this.new_one_list)]
				// console.log(quchonglist.length)
				// if(quchonglist.length<=6&&is_checked==true){
				// 	if(quchonglist.includes(store_name)){
				// 		let clength = []
				// 		//是否有失效商品
				// 		if (is_invalid == 1 || product_number == 0) return

				// 		this.checkedGoods.forEach((v, i) => {
				// 			if (i == index) {
				// 				if (v.indexOf(rec_id) > -1) {
				// 					v.splice(v.indexOf(rec_id), 1)
				// 				} else {
				// 					v.push(rec_id)
				// 				}
				// 			}
				// 		})

				// 		//获取店铺下商品数量
				// 		this.goodsCartList.forEach((v, index) => {
				// 			let arr = []
				// 			v.new_list.forEach((act) => {
				// 				act.act_goods_list.forEach((g) => {
				// 					arr.push(g)
				// 				})
				// 			})

				// 			clength.push(arr.length)
				// 		})

				// 		//商品勾选状态 改变店铺勾选状态
				// 		this.checkedShop[index] = (clength[index] == this.checkedGoods[index].length)
				// 		this.changeGoods()
				// 	}else{
				// 		uni.showToast({
				// 			title:'每次结算店铺最多6家',
				// 			icon:'none'
				// 		})
				// 		console.log("这里")
				// 		quchonglist.splice(quchonglist.indexOf(store_name),1)
				// 		this.new_one_list = quchonglist
				// 		return;
				// 	}

				// }else{
				// 	if(quchonglist.length > 6){
				// 		uni.showToast({
				// 			title:'每次结算店铺最多6家',
				// 			icon:'none'
				// 		})
				// 		console.log("这里")
				// 		quchonglist.splice(quchonglist.indexOf(store_name),1)
				// 		this.new_one_list = quchonglist
				// 		console.log(this.new_one_list)
				// 		return;
				// 	}else{

				this.recid = item.rec_id
				this.actid = item.act_id
				// console.log(121, this.recid, this.actid);
				// console.log('dellist', this.delList);
				let clength = []
				//是否有失效商品
				if (is_invalid == 1 || product_number == 0) return;

				this.checkedGoods.forEach((v, i) => {
					if (i == index) {
						if (v.indexOf(rec_id) > -1) {
							v.splice(v.indexOf(rec_id), 1)
						} else {
							v.push(rec_id)
						}
					}
				})

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

				if (this.goodsCartList[index].new_list[listIndex].act_goods_list[actIndex].checked == false) {
					this.goodsCartList[index].new_list[listIndex].act_goods_list[actIndex].checked = true
				} else {
					this.goodsCartList[index].new_list[listIndex].act_goods_list[actIndex].checked = false
				}
				//商品勾选状态 改变店铺勾选状态
				this.checkedShop[index] = (clength[index] == this.checkedGoods[index].length)
				this.changeGoods()
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
						// if (act_id != '') {
						// 	console.log(128);
						// 	let act_id = 0
						// 	let ru_id = 0
						// 	let select_gift = []
						// 	this.giftList.forEach(v => {
						// 		act_id = v.act_id
						// 		ru_id = v.ru_id
						// 	})
						// 	this.select_gift = this.giftList.map(item => item.id)
						// 	this.$store.dispatch('setGiftChecked', {
						// 		act_id: act_id,
						// 		ru_id: ru_id,
						// 		select_gift: this.select_gift
						// 	}).then(({
						// 		data: data
						// 	}) => {
						// 		uni.showToast({
						// 			title: data.message,
						// 			icon: 'none'
						// 		})
						// 		if (data.error == 0) {
						// 			this.issubmit = data.cat_rec_id
						// 			uni.setStorageSync("issubmit", this.issubmit)
						// 		}
						// 	})
						// }
					})
				}
			},
			//商品勾选变化更新购物车列表
			changeGoods() {
				this.loading = true
				this.disabled = true
				this.totalPriceTiping = false
				this.checkedGoodsId = [];
				console.log(121212, this.checkedGoods)
				this.checkedGoods.forEach((v, i) => {
					v.forEach(i => {
						// console.log(4555, this.delList);
						this.checkedGoodsId.push(i)
					})
				})
				let arr = this.checkedGoodsId
				let toRemove = this.delList
				this.checkedGoodsId = arr.filter(item => !toRemove.includes(item));
				this.checkAllOper();
				this.loading = false
				var indexOne = 0
				for (var i = 0; i < this.checkedGoods.length; i++) {
					if (this.checkedGoods[i].length > 0) {
						indexOne = indexOne + 1
					}
				}
				var zjia = 0
				var snum = 0
				var nums = 0
				// var yunfei = 0
				for (var i = 0; i < this.goodsCartList.length; i++) {
					for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
						for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
							if (this.goodsCartList[i].new_list[j].act_goods_list[z].checked == true && this.goodsCartList[
									i].new_list[j].act_goods_list[z].product_number > 0) {
								nums = nums + 1
								snum = snum + this.goodsCartList[i].new_list[j].act_goods_list[z].goods_number
								// yunfei = yunfei + parseFloat(this.goodsCartList[i].new_list[j].act_goods_list[z].shipping_fee)
								zjia = zjia + this.goodsCartList[i].new_list[j].act_goods_list[z].goods_number * this
									.goodsCartList[i].new_list[j].act_goods_list[z].goods_price
							}
						}
					}
				}

				console.log(78, this.checkedGoods);
				if (indexOne == 0) {
					this.disabled = true
				} else {
					this.disabled = false
				}
				// this.shipping_fee = yunfei.toFixed(2) //运费
				// console.log(zjia + yunfei)
				// this.totalPrice = zjia.toFixed(2) //商品价格
				// this.totalPrice = (zjia + yunfei).toFixed(2) //商品价格
				// this.favourablePrice = yjia.toFixed(2) //购物车优惠价格
				// this.save_price = hjia.toFixed(2) //会员预计优惠价格
				this.count = snum //购物车勾选商品数量
				this.nums = nums
				this.regionSplic_1(zjia)
				if (nums >= 200) {
					uni.showToast({
						icon: 'none',
						title: '当前已选择最多200种商品'
					})
				}
				return;


				// console.log(this.checkedGoodsId)
				//更新购物车商品列表
				console.log("11111111111111111111111111")
				console.log(9999, this.checkedGoodsId)
				console.log(this.regionData.district.id)
				this.$store.dispatch('setCartChecked', {
					rec_id: this.checkedGoodsId,
					sel_flag: 'cart_sel_flag',
					district_id: this.regionData.district.id
				}).then(({
					data: data
				}) => {
					// console.log(data)
					this.totalPrice = data.goods_amount_formated //商品价格
					this.shipping_fee = data.goods_amount_formated //商品价格
					// this.favourablePrice = data.discount_formated //购物车优惠价格
					// this.save_price = data.save_price //会员预计优惠价格
					this.count = data.cart_number //购物车勾选商品数量

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
					// this.favourablePrice = data.discount_formated //购物车优惠价格
					// this.save_price = data.save_price //会员预计优惠价格
					this.count = data.cart_number //购物车勾选商品数量

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

				this.checkedShop.forEach(v => {
					if (!v) {
						cAll++
					}
				})
				if (cAll > 0) {
					this.checkedAll = false
				} else {
					this.checkedAll = true
				}
			},
			//全选
			checkAll(invalid) {
				var nums = 0
				console.log(33333, invalid);
				console.log(3331, this.checkedGoods);
				//是否有失效商品
				if (invalid) return

				this.checkedAll = this.checkedAll ? false : true

				this.goodsCartList.forEach((v, i) => {
					if (i < 6 && nums < 200) {
						this.checkedShop.splice(i, 1, this.checkedAll)
						this.checkedGoods[i] = []
						if (this.checkedAll) {
							v.new_list.forEach((act) => {
								act.act_goods_list.forEach((g) => {
									// nums = nums + 1
									// this.checkedGoods[i].push(g.rec_id)
									if (g.is_invalid > 0 || g.product_number > 0) {
										this.checkedGoods[i].push(g.rec_id)
									}
								})
							})
						}
					}
				})
				this.nums = nums
				console.log(this.checkedShop)
				nums = 0
				console.log(555, this.goodsCartList)
				if (this.checkedAll == true) {
					for (var i = 0; i < this.goodsCartList.length; i++) {
						for (var k = 0; k < this.goodsCartList[i].goods.length; k++) {
							if (this.goodsCartList[i].goods[k].product_number == 0) {
								if (!this.delList.includes(this.goodsCartList[i].goods[k].rec_id)) {
									this.delList.push(this.goodsCartList[i].goods[k].rec_id)
								}
								console.log(900, this.delList);
							}
						}
						for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
							for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
								if (i < 6 && nums < 200) {
									nums = nums + 1
									this.goodsCartList[i].new_list[j].act_goods_list[z].checked = true
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
			//运费
			async shippingFee_1(val, zjia) {
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
								// var ab = {}
								// ab.goods_number = this.goodsCartList[i].new_list[j].act_goods_list[z].goods_number
								// ab.goods_id = this.goodsCartList[i].new_list[j].act_goods_list[z].goods_id
								// goodsIds.push(ab)
								goods_number = this.goodsCartList[i].new_list[j].act_goods_list[z].goods_number + ',' +
									goods_number
							}
						}
					}
				}
				// console.log(goodsIds)
				// console.log(goods_number)
				// console.log(val)
				// return;
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
						console.log("！~~~~~~~~~~ ！")
						console.log(res.data.data)
						if (res.data.data) {
							this.totalPriceTiping = true
							this.shipping_fee = parseFloat(res.data.data.shipping_fee).toFixed(2) //运费
							// console.log(zjia + yunfei)
							this.totalPrice = (parseFloat(this.shipping_fee) + parseFloat(zjia)).toFixed(
								2) //商品价格
						}

					}
				})
			},
			//修改购物车商品数量
			goodsNumberhandle(e, id, act_id, store_id, listIndex, actIndex, index, goods_price) {
				this.totalPriceTiping = false
				this.stepDisabled.forEach((v, i) => {
					v.forEach((s, d) => {
						if (s.id == id) {
							this.stepDisabled[i][d].type = true
						}
					})
				})
				console.log(id)
				console.log(e)
				console.log(this.regionData.district.id)
				this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number = e
				console.log(555, this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number)
				console.log("+++++++++++++++++++++++++")
				console.log(556, e, 557, goods_price);
				this.goodsnumber = e
				this.pricenum = goods_price
				this.allprice = this.goodsnumber * this.pricenum
				uni.setStorageSync('allprice', this.allprice)

				// this.totalPrice = zjia.toFixed(2) //商品价格
				// // this.favourablePrice = yjia.toFixed(2) //购物车优惠价格
				// // this.save_price = hjia.toFixed(2) //会员预计优惠价格
				// this.count = snum //购物车勾选商品数量

				// this.stepDisabled.forEach((v, i) => {
				// 	v.forEach((s, d) => {
				// 		if (s.id == id) {
				// 			this.stepDisabled[i][d].type = false
				// 		}
				// 	})
				// });



				// return;



				this.$store.dispatch('setUpdateNumber', {
					rec_id: id,
					num: e,
					district_id: this.regionData.district.id
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
					console.log(data)
					if (data.error == 0) {
						var zjia = 0
						var snum = 0
						for (var i = 0; i < this.goodsCartList.length; i++) {
							for (var j = 0; j < this.goodsCartList[i].new_list.length; j++) {
								for (var z = 0; z < this.goodsCartList[i].new_list[j].act_goods_list.length; z++) {
									if (this.goodsCartList[i].new_list[j].act_goods_list[z].checked == true) {
										snum = snum + this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_number
										zjia = zjia + this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_number * this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_price
										console.log(this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_number)
										console.log(this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_price)
										console.log(this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_number * this.goodsCartList[i].new_list[j].act_goods_list[z]
											.goods_price)
										console.log(zjia)
									}
								}
							}
						}
						var indexOne = 0
						for (var i = 0; i < this.checkedGoods.length; i++) {

							if (this.checkedGoods[i].length > 0) {
								indexOne = indexOne + 1
							}
						}
						if (indexOne == 0) {
							this.disabled = true
						} else {
							this.disabled = false
							this.regionSplic_1(zjia)
							// this.totalPrice = zjia.toFixed(2) //商品价格
							// this.favourablePrice = yjia.toFixed(2) //购物车优惠价格
							// this.save_price = hjia.toFixed(2) //会员预计优惠价格
							this.count = snum //购物车勾选商品数量
						}
						uni.hideKeyboard()
						// uni.showToast({
						// 	title: '修改成功',
						// 	icon: 'none'
						// });
						return;
						// 	console.log(data)
						// 	console.log("11111111111")
						// 	this.totalPrice = data.goods_amount_formated //商品价格
						// 	this.favourablePrice = data.discount_formated //购物车优惠价格
						// 	this.save_price = data.save_price //会员预计优惠价格
						// 	this.count = data.cart_number //购物车勾选商品数量

						// 	//跨境
						// 	if (data.cross_border) {
						// 		this.ratePrice = data.rate_price //税费
						// 		this.ratePriceTip = data.rate_formated //税费格式化
						// 	}

						// 	if (data.cart_fav_box) { //数量改变触发优惠活动条件，更新购物车
						// 		this.goodsCartList.forEach((v) => {
						// 			if (v.store_id == store_id) {
						// 				v.new_list.forEach((g, i) => {
						// 					if (g.act_id == act_id) {
						// 						v.new_list[i] = data.cart_fav_box
						// 					}
						// 				})
						// 			}
						// 		})
						// 	}
					} else {
						// this.goodsCartList.forEach((v) => {
						// 	v.new_list.forEach(g => {
						// 		g.act_goods_list.forEach(i => {
						// 			if (i.rec_id == id) {
						// 				i.goods_number = data.number
						// 			}
						// 		})
						// 	})
						// })
						if (this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].xiangou_num >
							0) {
							this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].goods_number =
								this.goodsCartList[listIndex].new_list[actIndex].act_goods_list[index].xiangou_num
						}

						uni.showToast({
							title: data.msg,
							icon: 'none'
						});
					}
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
				// let aa = uni.getStorageSync('allprice')
				// this.minamount = Number(min_amount)
				// console.log(2223,aa);
				// if (aa > this.minamount) {
				// 	this.giftDisabled = type
				// } else {
				// 	this.giftDisabled != type
				// }
				this.$store.dispatch('setGiftList', {
					act_id: act_id
				}).then(({
					data: data
				}) => {
					this.giftList = data.giftlist
					this.act_type_ext = parseInt(data.act_type_ext)
					// console.log(9999, type, this.giftDisabled);
					if (act_id === this.actid) {
						// this.giftDisabled =true
						// type = this.giftDisabled
						// console.log(999900,act_id,this.actid);

						let aa = uni.getStorageSync('allprice')
						this.minamount = Number(min_amount)
						// console.log(2223, aa);
						if (aa >= this.minamount) {
							// console.log(56, this.giftDisabled, type);
							this.giftDisabled = true
							type = this.giftDisabled
							// console.log(5656, this.giftDisabled, type);
						}
					} else {
						// console.log(7777);
						this.giftDisabled = false
						type = this.giftDisabled
						// console.log(3434, type, this.giftDisabled);
					}
					// let aa = uni.getStorageSync('allprice')
					// this.minamount = Number(min_amount)
					// console.log(2223,aa);
					// if (aa > this.minamount) {
					// 	console.log(56,this.giftDisabled,type);
					// 	// this.giftDisabled = true
					// 	// type = this.giftDisabled
					// 	this.giftDisabled = true
					// 	type = this.giftDisabled
					// 	console.log(5656,this.giftDisabled,type);
					// } else {
					// 	console.log(57,this.giftDisabled,type);
					// 	// this.giftDisabled =false
					// 	// type = this.giftDisabled
					// 	console.log(5757,this.giftDisabled,type);
					// }

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
				// this.favourableList.forEach(v => {
				// 	v.is_checked = false
				// 	if (act_id == v.act_id) {
				// 		v.is_checked = true
				// 	}
				// })
				// if (!this.giftDisabled) {
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
									// var index = this.checkGiftArr.indexOf(v.id)
									// if (index > -1) {
									// 	this.checkGiftArr.splice(index, 1)
									// }
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
						console.log(111111, this.objsubmit);
						console.log(222222, this.issubmit);
					}
				})
				console.log(7, select_gift, );
				console.log(8, this.checkGiftArr);
				console.log(9, this.checkGiftStr);
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
					console.log('1data', data);
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

				this.$store.dispatch('setGoodsGuess', {
					warehouse_id: 0,
					area_id: 0,
					page: this.page,
					size: this.size
				})
			},
			//删除购物车商品
			deleteCartGoods(val, is_gift) {
				let that = this
				if (is_gift) {
					that.checkGift = ''
					that.checkGiftArr = []
				}
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
								console.log(res)
								if (res.error == 0) {
									uni.hideLoading()
									uni.showToast({
										title: that.$t('lang.delete_success'),
										icon: 'success'
									})
									that.goodsList();
									that.changeGoods();
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
			onSubmit() {
				let aa = uni.getStorageSync("issubmit")
				if (this.addressList.length == 0) {
					uni.showModal({
						content: this.$t('lang.goto_add_address'),
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/address/addressEdit'
								})
							}
						}
					});
				} else {
					this.loading = true
					this.disabled = true
					var indexOne = 0
					for (var i = 0; i < this.checkedGoods.length; i++) {
						if (this.checkedGoods[i].length > 0) {
							indexOne = indexOne + 1
						}
					}
					console.log(111111, indexOne)
					if (indexOne > 6) {
						uni.showToast({
							title: '每次结算店铺最多6家，请重新选择',
							icon: 'none'
						})
						// this.checkAll()
						return;
					}
					// this.$store.dispatch('setCartChecked', {
					// 	rec_id: this.checkedGoodsId,
					// 	sel_flag: 'cart_sel_flag',
					// 	district_id: this.regionData.district.id
					// }).then(({
					// 	data: data
					// }) => {
					// console.log(data)
					// this.totalPrice = data.goods_amount_formated //商品价格
					// this.favourablePrice = data.discount_formated //购物车优惠价格
					// this.save_price = data.save_price //会员预计优惠价格
					// this.count = data.cart_number //购物车勾选商品数量

					// 	if (data.cross_border) { //跨境
					// 		this.ratePrice = data.rate_price //税费
					// 		this.ratePriceTip = data.rate_formated //税费格式化
					// 	}

					// 	if (data.cart_fav_box) { //数量改变触发优惠活动条件，更新购物车
					// 		this.goodsCartList = data.cart_fav_box
					// 		this.loading = false
					// 		this.disabled = false
					// 	}

					// uni.setStorageSync("cat_rec_id", this.checkedGoods);
					// uni.setStorageSync("isyong", 1);

					// 提交结算
					const ab = this.checkedGoods.reduce((acc, val) => acc.concat(val), []);
					// console.log('ab', ab);
					const keysToCheck = ab;
					const objaa = uni.getStorageSync('issubmit');
					// console.log(122, objaa);
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
						f.new_list.forEach((act) => {
							act.act_goods_list.forEach((g) => {
								if (g.product_number == 0 && g.is_checked == true) {
									uni.showToast({
										title: g.goods_name + this.$t(
											'lang.understock_not_submit'),
										icon: 'none'
									});
									fald = false
									return false
								}

								if (g.is_invalid == 1 && g.is_checked == true) {
									uni.showToast({
										title: g.goods_name + this.$t(
											'lang.goods_soldout_not_submit'),
										icon: 'none'
									});
									fald = false
									return false
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
									return false
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

						if (this.$isLogin()) {
							if (rec_id) {
								uni.navigateTo({
									// url: '/pagesD/checkout/checkout?type=true&rec_id=' + rec_id + '&save_price=' + this.save_price + '&affiliate_infovalue=' + this.affiliate_infovalue
									url: '/pagesD/checkout/checkout?type=true&rec_id=' + rec_id +
										'&affiliate_infovalue=' + this.affiliate_infovalue + '&isyong=1'
								})
							} else {
								uni.navigateTo({
									url: '/pagesD/checkout/checkout?affiliate_infovalue=' + this
										.affiliate_infovalue + '&isyong=1'
									// url: '/pagesD/checkout/checkout?save_price=' + this.save_price + '&affiliate_infovalue=' + this.affiliate_infovalue
								})
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
					}
					// })
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
				console.log(item)
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
			that.totalPrice = 0 //商品价格
			// that.favourablePrice = 0 //购物车优惠价格
			// that.save_price = 0 //会员预计优惠价格
			that.count = 0 //购物车勾选商品数量
			that.checkedAll = false
			that.initData();
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
		},
		onShow() {
			this.showEvery()
			
			// 【修复】从别的页面返回时，自动滚动到页面顶部
			this.$nextTick(() => {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0  // 立即滚动，无动画
				});
			});

			// console.log(1233333333, this.checkGiftArr = []);
		},

		onLoad(e) {
			let that = this
			// console.log(1233333333444, this.checkGiftArr = []);
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
		},
		watch: {
			goodsCartList() {
				// console.log(777, this.goodsCartList)
				let obj = {}
				let arr = []
				let shopArr = []
				let shopArr2 = []
				let shopState = false
				let shopInvalid = false
				this.dscLoading = false

				if (this.default) {
					this.checkedGoodsId = []
					this.checkedGoods.forEach((v, index) => {
						v.forEach(i => {
							this.checkedGoodsId.push(i)
						})
					})

					this.allGoodsListId.forEach((v, index) => {
						arr[index] = []

						v.forEach(i => {
							obj = {
								id: i,
								type: false
							}

							arr[index].push(obj)
						})
					})

					this.stepDisabled = arr

					//初始化选中商品
					// this.changeDefaultGooods()
				}

				this.checkedAllDisabled = false

				this.goodsCartList.forEach((v, index) => {
					shopArr[index] = []
					shopState = false
					let cont = 0
					v.new_list.forEach((act) => {
						act.act_goods_list.forEach(goods => {
							//选中门店
							if (goods.store_count > 0) {
								shopState = true
							}

							if (goods.is_invalid > 0) {
								cont++
								this.checkedAllDisabled = true
							}
						})
					})
					shopArr[index].push(shopState);
					shopArr2.push(cont > 0 ? true : false);
				})

				//门店自提按钮
				this.shopStore = shopArr
				//店铺下商品是否失效
				this.shopInvalidArr = shopArr2
			},
			count() {
				//获取购物车数量
				//this.$store.dispatch('setCommonCartNumber');

				if (this.count > 0) {
					this.disabled = false
				} else {
					this.disabled = true
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
	page {
		background: #fff;
		width: 100%;
		height: 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		/* max-width: 640px; */
		/* margin: 0 auto; */
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

	/* .container{ padding-bottom: 300upx;} */
	.header-address {
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
		padding: 20upx;
	}

	.header-address .address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		
		width: 80%;
		/* #ifdef MP-WEIXIN */
		width: 65%;
		/* #endif */
		line-height: 30rpx;
	}

	.header-address .address-box .iconfont {
		margin-right: 10upx;
	}

	.card-goods {}

	.card-goods-group {
		margin: 0 20rpx 20rpx;
		padding: 20rpx 0 20rpx 20rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		padding: 0 0 20upx;
		justify-content: space-between;
	}

	.card-shop-head .head-left,
	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;
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
		z-index: 99;
		background: rgba(0, 0, 0, .7);
	}

	.cart-goods-info .goods-img .mash-text {
		width: 100%;
		color: #fff;
		text-align: center;
		z-index: 100;
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

	.cart-goods-content .goods-title {
		font-size: 28upx;
		margin-bottom: 10upx;
	}

	.cart-goods-content .goods-attr {
		color: #999999;
		font-size: 25upx;
	}

	.cart-goods-content .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
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
		background-color: #9251e5;
	}

	.em-icon.active-zhekou {
		background-color: #fc9b1f;
	}

	.cart-submit {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #FFFFFF;
		position: fixed;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
		/* #ifndef H5 */
		bottom: 0;
		/* #endif */
		left: 0;
		z-index: 999;
		border-top: 1px solid #e3e8ee;
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
		width: 380upx;
		margin-right: 20upx;
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
	}

	.cart-submit .submit-bar-sub {
		font-size: 25upx;
		color: #999999;
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

	.activity-popup .cart-goods-item {
		min-height: initial;
	}

	.goods-store {
		background: #FFFFFF;
		padding: 10upx 0;
		text-align: right;
		font-size: 25upx;
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
		flex: 1;
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
	}


	/*新版样式*/
	.product-new {
		margin: 20rpx 20rpx 0;
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
	}

	.product-new .goods-list .item .img-box {
		line-height: 0;
		position: relative;
	}

	.product-new .goods-list .item .info-box {
		padding: 20rpx 20rpx 0rpx 20rpx;
		.label-box {
			.label-box-line {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				padding-bottom: 5px;
				margin: 0 12rpx 0 0;
				text-align: left;
			}
			.zero-label {
				color: #FE2F02;
			    font-size: 12px;
				font-weight: 400;
				line-height: 12px;
				text-shadow: 0px 0px 6px rgba(0,0,0,0.05);
				font-style: normal;
			}
			.zero-tag {
				color: #FF7705;
			    font-size: 12px;
				font-weight: 400;
				line-height: 12px;
				text-shadow: 0px 0px 6px rgba(0,0,0,0.05);
				font-style: normal;
			}
			.first-label {
				color: #09B248;
			    font-size: 12px;
				font-weight: 400;
				line-height: 12px;
				text-shadow: 0px 0px 6px rgba(0,0,0,0.05);
				font-style: normal;
			}
			.second-label {
				color: #A2A2A2;
			    font-size: 12px;
				font-weight: 400;
				line-height: 12px;
				text-shadow: 0px 0px 6px rgba(0,0,0,0.05);
				font-style: normal;
			}
		}
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

	.shop_name_class {
		color: #A2A2A2;
		font-size: 26rpx;
		margin-right: 6rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
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
		margin-right: 20rpx;
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
</style>