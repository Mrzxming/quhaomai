<template>
	<view>
		<view>
			<x-skeleton type="banner" :loading="loading1" :configs="waterfallConfigs">
				<view class="goods-detail_content skeleton">
					<skeleton selector="skeleton" bgcolor="#FFF" v-if="showSkeleton"></skeleton>
					<!-- 导航栏 start -->
					<view class="nav_bar skeleton" :style="{backgroundColor: rgba,opacity: navOpacity == 1 ?0.9 :1,}">
						<!-- 之前只在app中显示   #ifdef APP-PLUS 现在改成除了小程序-- >
					<!--  #ifndef MP-WEIXIN -->
						<!-- 这里是状态栏 -->
						<view class="status_bar"></view>
						<uni-nav-bar class="nav_list">
							<view class="nav-top">
								<view class="nav-top-left">
									<view class="nav_l icon_wrap"
										:style="{backgroundColor: navIconRgba, color: navOpacity == 1 ? '#000' : '#fff'}"
										@click="goBack">
										<text class="iconfont icon-find-fanhui"></text>
									</view>
									<!-- 搜索 start-->
									<view v-if="goodsDetail && goodsDetail.keywords" class="search_wrap search-label "
										@click="searchFocus" :style="{'display':navOpacity == 1 ? 'block' : 'none'}"
										:class="[]">
										<view class="search_input onelist-hidden">
											<text class="iconfont icon-home-search "></text>
											{{currentWord}}
										</view>
										<!-- 	<view class="search_btn">{{$t('lang.search')}}</view> -->
									</view>
									<!-- 搜索 end -->
									<!-- 引导list -->
								</view>
								<view class="nav_r">
									<!-- 图片 -->
									<!-- <view class="icon_wrap"
								:style="{backgroundColor: navIconRgba, color: navOpacity == 1 ? '#000' : '#fff'}"
								@click="showPopup('goodsimage')" style="margin-right: 20rpx;"><text
									class="iconfont icon-tupian"></text></view> -->
									<!-- 收藏 -->
									<!-- <view class="icon_wrap"
								:style="{backgroundColor: navIconRgba, color: navOpacity == 1 ? '#000' : '#fff'}"
								@click="collection" v-if="collectStatus == 0"><text class="iconfont icon-guanzhu"></text></view>
							<view class="icon_wrap"
								:style="{backgroundColor: followIconRgba, color: navOpacity == 1 ? '#F91F28' : '#fff'}"
								@click="collection" v-else><text class="iconfont icon-guanzhu"></text></view> -->
									<view class="icon_wrap icon_car_num" @click="onCart">
										<view class="info_num skeleton-radius"
											v-if="goodsDetail.cart_number && goodsDetail.cart_number > 0 && goodsDetail.cart_number <=999">
											{{goodsDetail.cart_number}}
										</view>
										<view class="info_num skeleton-radius top-right-car"
											v-if="goodsDetail.cart_number && goodsDetail.cart_number > 999">999+</view>
										<view style="justify-content: center;display: flex;align-items: center;">
											<image class="title_ico skeleton-radius "
												style="width: 36rpx;height: 30rpx;"
												src="/pagesC/static/top_right_car@2x.png" mode="heightFix"></image>
										</view>
									</view>
									<!-- 分享 -->
									<view class="icon_wrap"
										style="justify-content: center;display: flex;align-items: center;margin-left: 20rpx;"
										@click="mpShare">
										<image class="title_ico skeleton-radius " style="width: 36rpx;height: 30rpx;"
											src="/pagesC/static/top_right_share@2x.png" mode="heightFix"></image>
									</view>
									<view class="icon_wrap"
										:style="{backgroundColor: navIconRgba, color: navOpacity == 1 ? '#000' : '#fff'}"
										@click="showShortcut = !showShortcut">
										<text class="iconfont icon-gengduo1"></text>
										<!-- <view class="shortcut" v-if="showShortcut">
											<view :class="['shortcut_item', index > 0 ? 'u-border-top' : '']"
												@click="$outerHref(item.path, 'app')"
												v-for="(item, index) in shortcutData" :key="index">
												<text :class="[item.ico]"></text>
												<text>{{ item.name }}</text>
											</view>
										</view> -->
										
										<view class="shortcut" v-if="showShortcut">
										  <view :class="['shortcut_item', index > 0 ? 'u-border-top' : '']"
										    @click="$outerHref(item.path, 'app')" v-for="(item, index) in shortcutData"
										    :key="index">
										    <!-- 判断是否为图片 -->
										    <image v-if="item.ico.includes('http')" :src="item.ico" class="shortcut-img"></image>
										    <!-- 否则显示字体图标 -->
										    <text v-else :class="[item.ico]"></text>
										    <text>{{ item.name }}</text>
										  </view>
										</view>
									</view>
								</view>
							</view>

							<view class="nav_c_label"
								:style="{backgroundColor: rgba,opacity: navOpacity == 1 ?0.9 :0, display: navOpacity == 1 ? 'block' : 'flex',}">
								<view class="nav_c nav-bar-style">
									<view :class="['nav_item', ind == currNav ? 'active_nav' : '']"
										v-for="(nav, ind) in navBar" :key="ind" @click="changeNav(ind)">{{nav.title}}
									</view>
								</view>
							</view>

						</uni-nav-bar>
						<!-- #endif -->
						<!--   1  	<!- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="wx_nav_bar" :style="{paddingTop: `${menuButtonInfo.top}px`}">
							<view class="wx_nav_left"
								:style="{left: `${vw - menuButtonInfo.width - menuButtonInfo.left}px`, width: `${menuButtonInfo.width}px`, height: `${menuButtonInfo.height}px`, borderRadius: `${menuButtonInfo.height / 2}px`}">
								<text class="iconfont icon-find-fanhui" @click="goBack"></text>
								<text class="line"></text>
								<uni-icons type="bars" size="30" @click="showShortcut = !showShortcut"></uni-icons>
								<!-- <view class="shortcut" v-if="showShortcut">
									<view :class="['shortcut_item', index > 0 ? 'u-border-top' : '']"
										@click="$outerHref(item.path, 'app')" v-for="(item, index) in shortcutData"
										:key="index">
										<text :class="[item.ico]"></text>
										<text>{{ item.name }}</text>
									</view>
								</view> -->
								<!-- <view class="shortcut" v-if="showShortcut">
								  <view :class="['shortcut_item', index > 0 ? 'u-border-top' : '']"
								    @click="$outerHref(item.path, 'app')" v-for="(item, index) in shortcutData"
								    :key="index">
								    
								    <image v-if="item.ico.includes('http')" :src="item.ico" class="shortcut-img"></image>
								 
								    <text v-else :class="[item.ico]"></text>
								    <text>{{ item.name }}</text>
								  </view>
								</view> -->
								
								<view class="shortcut" v-if="showShortcut">
								  <view :class="['shortcut_item', index > 0 ? 'u-border-top' : '']"
								    @click="handleShortcutClick(item)" v-for="(item, index) in shortcutData"
								    :key="index">
								    
								    <image v-if="item.ico.includes('http')" 
								           :src="item.ico" 
								           class="shortcut-img"
								           @error="handleImageError(item)"
								           mode="aspectFit"></image>
								   
								    <text v-else :class="[item.ico]"></text>
								    <text>{{ item.name }}</text>
								  </view>
								</view>
								
							</view>
							<view class="nav_c_label"
								:style="{backgroundColor: rgba,opacity: navOpacity == 1 ?0.9 :0, display: navOpacity == 1 ? 'block' : 'flex',}">
								<view class="nav_c nav-bar-style">
									<view :class="['nav_item', ind == currNav ? 'active_nav' : '']"
										v-for="(nav, ind) in navBar" :key="ind" @click="changeNav(ind)">{{nav.title}}
									</view>
								</view>
							</view>
							<!-- <view class="nav_c" :style="{opacity: navOpacity}" v-if=" navOpacity >= 1">
								<view :class="['nav_item', ind == currNav ? 'active_nav' : '']"
									v-for="(nav, ind) in navBar" :key="ind" @click="changeNav(ind)">{{nav.title}}</view>
							</view> -->
						</view>
						<!-- #endif -->

					</view>
					<!-- 导航栏 start -->

					<!-- 轮播图 start -->

					<!-- 					<view class="swiper_warp skeleton">
						<view v-show="!showVideo">
							<view class="swiper_warp_layer skeleton">

								<swiper class="swiper" :circular="true" :current="current" :interval="3000"
									:duration="1000" @change="changeSwiper">

									<swiper-item v-for="(item, index) in swiperData" :key="index">
										<view @click="previewImg(index, swiperData.map(val => val.img_url))">
											<image class="swiper_img skeleton-rect" :src="item.img_url"></image>
											<view class="goods-label-suspension"
												v-if="index == 0 && goodsDetail.goods_label_suspension && goodsDetail.goods_label_suspension.formated_label_image">
												<image :src="goodsDetail.goods_label_suspension.formated_label_image"
													class="img skeleton-rect"></image>
											</view>
										</view>
									</swiper-item>
								</swiper>

								<view class="indicator_dots">
									<text class="curr_dots">{{ currSwiperPic + 1 }}</text>/{{swiperData.length}}
								</view>
								<view class="video_ico" @click="play" v-if="goodsDetail.goods_video">
									<text class="iconfont icon-video2 play_ico"></text>
									<view class="play_txt">{{$t('lang.goods_watchvideo')}}</view>
								</view>
							</view>
						</view>

				
						<template v-if="goodsDetail.goods_video">
							<view class="video_wrap skeleton" v-show="showVideo">
								<video class="video" id="goodsVideo" :src="goodsDetail.goods_video"
									@error="videoErrorCallback"></video>
								<view class="controls_pause_wrap" @click="pause">
									<view class="controls_pause">{{$t('lang.goods_outvideo')}}</view>
								</view>
							</view>
						</template>
					
					</view> -->



					<!-- 2222222222222222222222222222222 -->

					<view class="swiper_warp skeleton">
						<view v-if="!showVideo">
							<view class="swiper_warp_layer skeleton">
								<swiper class="swiper" :circular="true" :current="current" :interval="3000"
									:duration="1000" @change="changeSwiper">
									<swiper-item v-for="(item, index) in swiperData" :key="index">
										<view @click="previewImg(index, swiperData.map(val => val.img_url))">
											<image class="swiper_img skeleton-rect" :src="item.img_url"></image>
											<view class="goods-label-suspension"
												v-if="index == 0 && goodsDetail.goods_label_suspension && goodsDetail.goods_label_suspension.formated_label_image">
												<image :src="goodsDetail.goods_label_suspension.formated_label_image"
													class="img skeleton-rect"></image>
											</view>
										</view>
									</swiper-item>
								</swiper>

								<view class="indicator_dots">
									<text class="curr_dots">{{ currSwiperPic + 1 }}</text>/{{swiperData.length}}
								</view>
								<view class="switch_buttons" v-if="goodsDetail.goods_video">
									<view class="switch_btn" :class="{active: showVideo}" @click="switchToVideo">视频
									</view>
									<view class="switch_btn" :class="{active: !showVideo}" @click="switchToImages">图集
									</view>
								</view>
							</view>
						</view>

						<!-- 视频 start -->
						<template v-if="goodsDetail.goods_video">
							<view class="video_wrap skeleton" v-if="showVideo">
								<video class="video" id="goodsVideo" :src="goodsDetail.goods_video" autoplay
									:direction="screenDirection" object-fit="cover" 
									controls
									@fullscreenchange="handleFullscreenChange"
									@error="videoErrorCallback">
									<cover-view style="position: absolute; bottom: 100rpx; left: 0; right: 0; z-index: 999; display: flex; justify-content: center; align-items: center;">
										<cover-view class="switch_buttons" style="display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5); border-radius: 30rpx;">
											<cover-view class="switch_btn" @click="switchToVideo" :style="videoBtnStyle" style="width: 104rpx; height: 52rpx; line-height: 52rpx; padding: 0; margin-top: 8rpx; margin-bottom: 8rpx; margin-left: 8rpx; margin-right: 10rpx; border-radius: 26rpx; text-align: center; font-size: 24rpx; white-space: nowrap;">视频
											</cover-view>
											<cover-view class="switch_btn" @click="switchToImages" :style="imagesBtnStyle" style="width: 104rpx; height: 52rpx; line-height: 52rpx; padding: 0; margin-top: 8rpx; margin-bottom: 8rpx; margin-right: 8rpx; border-radius: 26rpx; text-align: center; font-size: 24rpx; white-space: nowrap;">图集
											</cover-view>
										</cover-view>
									</cover-view>
								</video>
							</view>
						</template>
						<!-- 视频 end -->
					</view>

					<!-- 轮播图 end -->

					<!--属性图片相册切换-->
					<view class="goods-attr-img-list skeleton" v-if="attrColorList.length > 0">
						<view class="describe skeleton-rect">{{ attrColorList.length }}{{$t('lang.goods_color_option')}}
						</view>
						<scroll-view class="scroll-view" scroll-x="true" scroll-left="0" :current="attrColorIndex">
							<view class="scroll-view-item" :class="{'active':attrColorIndex == index}"
								v-for="(item, index) in attrColorList" :key="index" v-if="item.img_flie">
								<image class="img skeleton-rect" mode="aspectFill" :lazy-load="true"
									:src="item.img_flie" @click="onSelectImg(item,index)"></image>
							</view>
						</scroll-view>
					</view>

					<!-- 商品基本信息 start -->
					<view class="activity_goods skeleton"
						v-if="hasRealPromoteSchedule">
						<view class="activity_goods_pic skeleton">
							<image :src="goodsDetail.promote_background_url" class="img skeleton-rect" ></image>
						</view>
						<view class="activity_goods_left skeleton">
							<!-- 第1部分：顶部标签行 -->
							<view class="activity-goods-top-row">
								<view class="top-row-left">
									<image class="platform-min-icon" v-if="goodsDetail.platm_min_price == 1"
										src="https://images.eqingqu.com/attachs/photo/202601/20260129_DB0EEDE85082CE67671A05EAA16E7201.png"
										mode="aspectFit"></image>
									<text class="platform-min-text" v-if="goodsDetail.platm_min_price == 1">全网低价</text>
								</view>
							
								<text class="sales-count-text" style="margin-left:10rpx;">已售{{goodsDetail.sales_volume}}+件</text>
							</view>
							<!-- 第2部分：商品金额 -->
							<view class="activity-goods-price">
								<currency-price v-if="goodsDetail.shop_price" :price="goodsDetail.shop_price"
									:delPrice="goodsDetail.marketPrice" :size="25" :delSize="16" color="#fff"
									delColor="#fff"></currency-price>
							</view>
							<!-- 第3部分：已优惠标签 -->
							<view class="activity-goods-discount" v-if="goodsDetail.youhui_price">
								<image class="discount-icon" 
									src="https://images.eqingqu.com/attachs/photo/202601/20260129_C75984F728B13CA346E89FEB849CCEFD.png"
									mode="aspectFit"></image>
								<text class="discount-text">已优惠{{goodsDetail.youhui_price}}元</text>
							</view>
						</view>
						<view class="activity_goods_right skeleton">
							<!-- <view class="count_down_txt skeleton-radius">{{$t('lang.promote_end')}}</view> -->
							<uni-countdown fontColor="#FF3616" :mini="true" :show-colon="false" splitorColor="#FF3616"
								borderColor="#FFFFFF" bgrColor="#FFFFFF" dayTextColor="#FFFFFF" :timer="dateTime"
								v-if="dateTime"></uni-countdown>
						</view>
					</view>

					<!-- 活动商品信息块下方的优惠券显示区域 -->
					<view class="goods_module_wrap goods_base_info skeleton"
						v-if="hasRealPromoteSchedule && (formatDiscountsData.length > 0 || activityData.length > 0)" style="padding-bottom: 0rpx;">
						<view class="goods-coupon-box">

						<view class="activity_wrap activity_wrap_no" @click="showPopup('discounts')"
							v-if="formatDiscountsData.length > 0">
							<!-- <view class="activity_title">{{$t('lang.goods_discounts')}}</view> -->
							<view v-if="formatDiscountsData.length > 0" class="activity_main activity_coupon">

								<view class="activity_list">
									<!-- 顺序：限时优惠 → 优惠券 → 满减 → 首单立减 → 包邮/积分/一件起批/买赠/多买… -->
									<!-- 1 限时优惠：促销档期 -->
									<view class="promo-tag promo-tag-limited"
										v-if="hasRealPromoteSchedule">
										<text class="promo-tag-text">限时优惠</text>
									</view>
									<!-- 1 限时优惠：后台折扣类（acttype:2） -->
									<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-limited-activity-' + activityIndex">
										<view class="promo-tag promo-tag-limited" v-if="activityItem.acttype == 2">
											<text class="promo-tag-text">{{ activityItem.value }}</text>
										</view>
									</block>
									<!-- 2 优惠券（acttype:0） -->
									<view class="promo-tag promo-tag-coupon" v-if="filteredCoupons.length > 0">
										<image class="promo-tag-icon" 
											src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png"
											mode="aspectFit"></image>
										<block v-for="(item, index) in filteredCoupons" :key="'coupon-activity-' + index">
											<text class="promo-tag-text" v-if="item.cou_type == 5">包邮券</text>
											<text class="promo-tag-text" v-else>{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.minus')}}{{item.cou_money}}</text>
											<text class="promo-tag-divider" v-if="index < filteredCoupons.length - 1">|</text>
										</block>
									</view>
									<!-- 3 满减（acttype:1） -->
									<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-fullreduction-activity-' + activityIndex">
										<view class="promo-tag promo-tag-full-reduction" v-if="activityItem.acttype == 1">
											<text class="promo-tag-text">{{activityItem.value}}</text>
										</view>
									</block>
									<!-- 4 首单立减（couponLst） -->
									<view class="promo-tag promo-tag-first-order" v-if="couponLst && Object.keys(couponLst).length > 0">
										<image class="promo-tag-icon" 
											src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png"
											mode="aspectFit"></image>
										<text class="promo-tag-text">首单立减{{couponLstMoney}}元</text>
									</view>
									<!-- 5 包邮 -->
									<view class="promo-tag promo-tag-free-shipping" v-if="goodsDetail.is_shipping == 1 || freeShipping == 1">
										<text class="promo-tag-text">包邮</text>
									</view>
									<!-- 6 积分可抵（acttype:5） -->
									<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-points-activity-' + activityIndex">
										<view class="promo-tag promo-tag-points" v-if="activityItem.acttype == 5">
											<text class="promo-tag-text">{{goodsDetail.huodong_list_tip && goodsDetail.huodong_list_tip.integral_price_v1_tip ? goodsDetail.huodong_list_tip.integral_price_v1_tip : activityItem.label}}</text>
										</view>
									</block>
									<!-- 7 一件起批 -->
									<view class="promo-tag promo-tag-one-parcel" v-if="showOneDaifaParcelTip">
										<text class="promo-tag-text">{{$t('lang.one_parcel_free')}}</text>
									</view>
									<!-- 8 买赠（acttype:3） -->
									<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-gift-activity-' + activityIndex">
										<view class="promo-tag promo-tag-full-reduction" v-if="activityItem.acttype == 3">
											<text class="promo-tag-text">{{ activityItem.value }}</text>
										</view>
									</block>
									<!-- 9 多买优惠（acttype:6） -->
									<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-volume-activity-' + activityIndex">
										<view class="promo-tag promo-tag-points" v-if="activityItem.acttype == 6">
											<text class="promo-tag-text">{{ $t('lang.buy_more_discount') }}：{{ activityItem.value }}</text>
										</view>
									</block>
								</view>

								<text v-if="formatDiscountsData.length > 0 || activityData.length > 0"
									class="iconfont icon-more size_24" style="top: 10rpx;"></text>


							</view>
						</view>
						<!-- <view class="activity_wrap u-border-top" @click="showPopup('activity')"
							v-if="activityData.length > 0">
							<view class="activity_title">{{$t('lang.goods_activity')}}</view>
							<view class="activity_main">
								<view class="activity_list">
									<view class="activity_item activity_item_flex"
										v-for="(item, index) in activityData" :key="index">
										<text
											:class="['activity_bg', index == 0 ? 'margin_top0' : '']">{{item.label}}</text>
										<text class="activity_tips">{{item.value}}</text>
									</view>
								</view>
								<text class="iconfont icon-more " ></text>
							</view>
						</view> -->
						</view>
					</view>

					<view class="goods_module_wrap goods_base_info skeleton">
						<view class="goods_price"
							v-if="!hasRealPromoteSchedule">
							<view style="margin-top: -16rpx;width:100%">
								<!-- 如果有多个批发的价格 volume_price_list-->
								<view
									class="price-label"
									v-if="goodsDetail.volume_price_list && goodsDetail.volume_price_list.length > 0"
								>
									<view class="price-one">
										<view class="price-top">
											<text class="new-person-price" v-if="priceTagLabel">{{ priceTagLabel }}</text>
											<currency-price v-if="goodsDetail.shop_price"
												:price="goodsDetail.shop_price" :size="26"
												:delSize="14"></currency-price>
										</view>
										<text class="price-top-text">首件预估到手价</text>
									</view>
									<view
										class="price-list"
										v-for="(item, index) in (goodsDetail.volume_price_list || [])"
										:key="'volume-' + index"
									>

										<currency-price :price="item.price" :color="'#000'" :size="24"
											:delSize="14"></currency-price>
										<text
											class="price-number"
											v-if="goodsDetail.volume_price_list && index === goodsDetail.volume_price_list.length - 1"
										>
											{{ item.number }}
										</text>
										<text class="price-number" v-else>{{item.number}}</text>

									</view>

								</view>
								<view class="wrap_box " v-else>
									<!-- 左侧：价格、已优惠、全网低价 -->
									<view class="price-left-group">
										<text class="new-person-price" v-if="priceTagLabel">{{ priceTagLabel }}</text>
										<currency-price v-if="goodsDetail.shop_price" :price="goodsDetail.shop_price"
											:size="24" :delSize="14"></currency-price>
										<text
											class="is-discount-yuan" v-if="goodsDetail.youhui_price">{{$t('lang.is_discount')}}{{goodsDetail.youhui_price}}{{$t('lang.yuan')}}</text>
										<text class="platform-divider" v-if="goodsDetail.youhui_price && goodsDetail.platm_min_price"></text>
										<text class="platform-min-price" v-if="goodsDetail.platm_min_price">全网低价</text>
											<text class="membership-discount-price" v-if="goodsDetail.is_membership_card_discount_price">{{goodsDetail.is_membership_card_discount_price}}</text>
									</view>
									<!-- 最右侧：已售数量 -->
									<text class="yishou color_999 sales-count-right">
										{{$t('lang.goods_soltout')}}{{ goodsDetail.sales_volume }}{{$t('lang.jian')}}
									</text>
									<!-- 		<text
								class="yishou color_999">{{$t('lang.goods_soltout')}}{{ goodsDetail.sales_volume }}{{$t('lang.jian')}}</text> -->
									<!-- 一件起批暂时注释 -->
									<!-- <text class="one-parcel-free"
										v-if="this.isOneShipping ">{{$t('lang.one_parcel_free')}}</text> -->
								</view>

								<!-- <view
							style="display: flex;flex-direction: row;align-items: center;font-size: 22rpx;transform:scale(0.8);margin-left: -40rpx;width: 120%;margin-bottom: -20rpx;">
							<view
								style="color: #FFD103;border-radius: 10rpx;border: 2rpx solid #FFD103;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
								v-if="goodsDetail.is_best==1">优选</view>
							<view
								style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
								v-if="goodsDetail.is_new==1">新品</view>
							<view
								style="color: #FE0302;border-radius: 10rpx;background-color: #fff0f0;border: 2rpx solid #fff0f0;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
								v-if="goodsDetail.is_anxin==1">安心购</view>
							<view
								style="color: #FE0302;border-radius: 10rpx;background-color: #fff0f0;border: 2rpx solid #fff0f0;transform:scale(0.9);padding: 0rpx 10rpx;"
								v-if="goodsDetail.is_free==1">包邮</view>
						</view> -->
							</view>
							<!-- 20250202 替换成优惠券信息 -->
							<!-- 优惠与活动 start -->
							<view class="goods_module_wrap  skeleton goods-coupon-box "
								v-if="formatDiscountsData.length > 0 || activityData.length > 0">

								<view class="activity_wrap activity_wrap_no" @click="showPopup('discounts')"
									v-if="formatDiscountsData.length > 0">
									<!-- <view class="activity_title">{{$t('lang.goods_discounts')}}</view> -->
									<view v-if="formatDiscountsData.length > 0" class="activity_main activity_coupon">

										<view class="activity_list">
											<!-- 顺序：限时优惠 → 优惠券 → 满减 → 首单立减 → 包邮/积分/一件起批/买赠/多买… -->
											<view class="promo-tag promo-tag-limited"
												v-if="hasRealPromoteSchedule">
												<text class="promo-tag-text">限时优惠</text>
											</view>
											<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-limited-' + activityIndex">
												<view class="promo-tag promo-tag-limited" v-if="activityItem.acttype == 2">
													<text class="promo-tag-text">{{ activityItem.value }}</text>
												</view>
											</block>
											<view class="promo-tag promo-tag-coupon" v-if="filteredCoupons.length > 0">
												<image class="promo-tag-icon" 
													src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png"
													mode="aspectFit"></image>
												<block v-for="(item, index) in filteredCoupons" :key="'coupon-' + index">
													<text class="promo-tag-text" v-if="item.cou_type == 5">包邮券</text>
													<text class="promo-tag-text" v-else>{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.minus')}}{{item.cou_money}}</text>
													<text class="promo-tag-divider" v-if="index < filteredCoupons.length - 1">|</text>
												</block>
											</view>
											<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-fullreduction-' + activityIndex">
												<view class="promo-tag promo-tag-full-reduction" v-if="activityItem.acttype == 1">
													<text class="promo-tag-text">{{activityItem.value}}</text>
												</view>
											</block>
											<view class="promo-tag promo-tag-first-order" v-if="couponLst && Object.keys(couponLst).length > 0">
												<image class="promo-tag-icon" 
													src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png"
													mode="aspectFit"></image>
												<text class="promo-tag-text">首单立减{{couponLstMoney}}元</text>
											</view>
											<view class="promo-tag promo-tag-free-shipping" v-if="goodsDetail.is_shipping == 1 || freeShipping == 1">
												<text class="promo-tag-text">包邮</text>
											</view>
											<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-points-' + activityIndex">
												<view class="promo-tag promo-tag-points" v-if="activityItem.acttype == 5">
													<text class="promo-tag-text">{{goodsDetail.huodong_list_tip && goodsDetail.huodong_list_tip.integral_price_v1_tip ? goodsDetail.huodong_list_tip.integral_price_v1_tip : activityItem.label}}</text>
												</view>
											</block>
											<view class="promo-tag promo-tag-one-parcel" v-if="showOneDaifaParcelTip">
												<text class="promo-tag-text">{{$t('lang.one_parcel_free')}}</text>
											</view>
											<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-gift-' + activityIndex">
												<view class="promo-tag promo-tag-full-reduction" v-if="activityItem.acttype == 3">
													<text class="promo-tag-text">{{ activityItem.value }}</text>
												</view>
											</block>
											<block v-for="(activityItem, activityIndex) in discountsData" :key="'activity-volume-' + activityIndex">
												<view class="promo-tag promo-tag-points" v-if="activityItem.acttype == 6">
													<text class="promo-tag-text">{{ $t('lang.buy_more_discount') }}：{{ activityItem.value }}</text>
												</view>
											</block>
										</view>

										<text v-if="formatDiscountsData.length > 0 || activityData.length > 0"
											class="iconfont icon-more size_24" style="top: 10rpx;"></text>


									</view>
								</view>
								<!-- <view class="activity_wrap u-border-top" @click="showPopup('activity')"
									v-if="activityData.length > 0">
									<view class="activity_title">{{$t('lang.goods_activity')}}</view>
									<view class="activity_main">
										<view class="activity_list">
											<view class="activity_item activity_item_flex"
												v-for="(item, index) in activityData" :key="index">
												<text
													:class="['activity_bg', index == 0 ? 'margin_top0' : '']">{{item.label}}</text>
												<text class="activity_tips">{{item.value}}</text>
											</view>
										</view>
										<text class="iconfont icon-more " ></text>
									</view>
								</view> -->
							</view>

								<!-- 优惠新人券-->
								<view class="new-member-coupon" v-if="couponLst && Object.keys(couponLst).length > 0">
									<!-- 左侧金额区域 -->
									<view class="coupon-amount-section">
										<text class="currency-symbol">¥</text>
										<text class="amount-value">{{couponLstMoney}}</text>
									</view>
									<!-- 中间虚线分割 -->
									<view class="coupon-divider">
										<view class="divider-line"></view>
									</view>
									<!-- 右侧文字区域 -->
									<view class="coupon-text-section">
										<text class="coupon-main-text">首单立减{{couponLstMoney}}元新客专享</text>
										<text class="coupon-time-text">限时可用</text>
									</view>
								</view>

							<!-- 优惠与活动 end -->

							<!-- 分享  原有分享 controlVersion && goodsDetail.promote_end_date > 0 && goodsDetail.promote_start_date > 0 -->
							<!-- 	<block
								v-if=""> -->
							<!-- 	<view class="right">
										<view class="goods_share"
								 v-if="goodsDetail.is_show_drp == 1 && goodsDetail.commission_money != 0 && goodsDetail.is_distribution == 1"
								@click="mpShare">
								<text class="iconfont icon-share" style="line-height: 1;"></text>
								<text class="share_txt">{{$t('lang.share_zhuan_alt')}}
									{{ goodsDetail.commission_money }}</text>
							</view> -->
							<!-- <view class="goods_share" v-else @click="mpShare">
								<text class="iconfont icon-share" style="line-height: 1;"></text>
								<text class="share_txt">{{ $t('lang.share') }}</text>
							</view> -->
							<!-- 收藏微信有 -->
							<!-- #ifdef MP-WEIXIN -->
							<!-- <view class="collection" @click="collection">
								<text class="iconfont icon-guanzhu" style="line-height: 1;"
									:class="{'uni-red':collectStatus == 1}"></text>
								<text class="share_txt"
									:style="{'color':collectStatus == 1 ? '#f92028' : '#2E2E2E'}">{{ collectStatus == 1 ? '已收藏' :'收藏'}}</text>
							</view> -->
							<!-- #endif -->
							<!-- 	</view>
							</block> -->
						</view>

						<!-- 商品名称 -->
						<view class="goods_name_wrap">
							<view class="goods_name">
								<view @longpress="copyTitle(goodsDetail.goods_name)" style="width: 100%;">
									<!-- <text   
								style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
								v-if="goodsDetail.shop_grade==13">{{goodsDetail.shop_grade_name}}</text> -->
									<text class="easy_choose"
										v-if="goodsDetail.is_best ==1">{{$t('lang.easy_choose')}}</text>
									<text class="is-new-goods"
										v-else-if="goodsDetail.is_new ==1">{{$t('lang.new')}}</text>
									<text class="ziying"
										v-if="goodsDetail.user_id == 0">{{$t('lang.self_support')}}</text>
									<text class="goods-name-text">{{goodsDetail.goods_name}}</text>
									<!-- <text :class="{ 'text-line-clamp': !isOverflow }"
										class="yishou color_999">{{$t('lang.goods_soltout')}}{{ goodsDetail.sales_volume }}{{$t('lang.jian')}}</text> -->
								</view>
							</view>
						</view>

						<!-- 先用后付 和 开通会员 -->
						<view class='open_membership'>
							<view v-if="this.surplusCreditLine ">
								<text>{{$t('lang.free_purchase')}}</text>
								<text class="iconfont icon-more size_24 " style="padding: 8rpx 8rpx;"></text>
							</view>

							<!-- 会员部分  -->
							<!-- 购置税 -->
							<view class="goods_price goods_rate" v-if="goodsDetail.ru_id > 0 && goodsDetail.is_kj == 1">
								<view class="wrap_box" v-if="goodsDetail.goods_rate > 0">
									<span class="sold_out rate">{{$t('lang.import_tax')}}</span>
									<currency-price :price="goodsRate" :size="12"></currency-price>
								</view>
								<view class="wrap_box" v-else>
									<span
										class="sold_out rate">{{$t('lang.import_tax')}}：{{$t('lang.goods_tax_included')}}</span>
								</view>
							</view>
							<!-- 已开通会员 -->
							<view class="exclusive_on" v-if="affiliate_infovalue&&goodsDetail.is_discount==1">
								<view class="exclusive">
									<view class="left">
										<!-- <view class="icon_vip">
									<image
										src="https://images.eqingqu.com/attachs/photo/202309/20230918_8793CF8A18858D0105B84D3DB34BE72C.png"
										mode="heightFix"></image>
								</view> -->
									</view>
									<view class="center">专享<text
											style="color: #EA0C21;">{{affiliate_infovalue}}折</text>，已优惠<text
											style="color: #EA0C21;" v-if="goodsDetail.membership_card_youhui_price >  0">{{goodsDetail.membership_card_youhui_price}}</text>元</view>
									<view class="" @click="mydrplink('affiliate')">
										<text class="iconfont icon-more size_24 skeleton-radius"></text>
									</view>
								</view>
							</view>
							<!-- 未开通会员 -->
							<view class="exclusive_on" v-else-if="goodsDetail.membership_card_discount_price >0 ">
								<view class="exclusives"
									style="display: flex;justify-content: flex-start;align-items: center;">
									<!-- <view class="icon_vip">
								<image
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_050DB5336B33DA80AAC9A9A036D9FE25.png"
									mode="widthFix" style="width: 40rpx;height: 40rpx;margin-bottom: -10rpx;"></image>
							</view> -->
									<view class="">
										开通黑卡可享¥<text
											style="color: #EA0C21;font-size: 28upx;">{{goodsDetail.membership_card_discount_price}}</text>元
									</view>
									<view class="">
										<!-- 立即开通 >> -->
									</view>
								</view>
							</view>
							<view class="exclusive_on" v-else></view>
						</view>

						<!-- 商品说明 -->
						<view class="goods_explain size_24 color_999" v-if="goodsDetail.goods_brief">
							{{goodsDetail.goods_brief}}
						</view>

						<!-- vip 开通 -->
						<view class="open_vip"
							v-if="goodsDetail.is_show_drp == 1 && goodsDetail.is_drp && goodsDetail.drp_shop == 0 && controlVersion && parseFloat(goodsDetail.membership_card_discount_price_formated)<parseFloat(goodsDetail.shop_price)">
							<image class="vip_ico"
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_050DB5336B33DA80AAC9A9A036D9FE25.png">
							</image>
							<view class="vip_content" v-if="goodsDetail.membership_card_discount_price > 0">
								{{ $t('lang.advanced_vip') }}<text
									class="vip_price">{{ goodsDetail.membership_card_discount_price_formated }}</text>
							</view>
							<view class="vip_content" v-else>{{ $t('lang.advanced_vip_on') }}</view>
							<view class="go_open"
								v-if="goodsDetail.drp_shop_membership_card_id && goodsDetail.drp_shop_membership_card_id > 0"
								@click="$outerHref('/pagesA/drp/register/register?apply_status=repeat&membership_card_id=' + goodsDetail.drp_shop_membership_card_id, $isLogin())">
								{{ $t('lang.re_purchase') }}<text class="iconfont icon-more size_24"></text>
							</view>
							<view class="go_open" @click="$outerHref('/pagesA/drp/register/register', $isLogin())"
								v-else>
								{{ $t('lang.immediately_opened') }}<text class="iconfont icon-more size_24"></text>
							</view>
						</view>
					</view>
					<!-- 商品基本信息 end -->

					<!-- <view class="goods_module_wrap mt_20" v-if="goodsDetail.cat_rank_info"> -->
					<!-- 	<view class="goods_module_wrap mt_20" v-if="goodsDetail.goods_name">
				<view class="billboard-box">
					<view class="billboard-box-left">
						<view class="billboard-title" style="background-image: url(https://images.eqingqu.com/attachs/photo/202404/20240416_0605E3F634AA9B08470DAAB93FC6CC7E.png);background-size: 100% 100%;">
							热卖榜
						</view>
						<view class="billboard-info">
							{{goodsDetail.cat_rank_info}}
						</view>
					</view>
					<view class="billboard-box-right">
						<text class="iconfont icon-more size_24"></text>
					</view>
				</view>
			</view> -->
					<!-- 退还货服务 -->
					<view class="return_goods_sorrow ml-20 mt_20" v-if="isRuturnShippingfee ">
						{{$t('lang.return_goods_sorrow')}}
						<!-- <text class="iconfont icon-more size_24 skeleton-radius"></text> -->
					</view>
					<!-- 假一赔十 -->
					<view class="ten_fake ml-20 mt_20" v-if="isTenForFake" @click="showPopup('ten_fake')">
						<view class="ten_fake_lable">
							<image class="img-red-envelope" src="/pagesC/static/quality_product@2x.png"></image>
							<text>{{$t('lang.ten_for_fake')}}</text>
						</view>

						<text class="iconfont icon-more size_24 skeleton-radius"></text>
					</view>

					<!-- 24 48 小时发货 -->
					<view class="hour24 ml-20 mt_20" v-if="is24Time && is24Time.num" @click="showPopup('hour24')">
						<view class="hour24-box">
							<view class="hours24_label" v-if="is24Time.num == 24 || is24Time.num == 48">
								<image class="img-red-envelope" src="/pagesC/static/car@2x.png"></image>
								<text class="hours24_label_text"
									v-if="shopDetail.expect_send_time">{{shopDetail.expect_send_time}}</text>
							</view>
							<view class="hours48_label" v-if="is24Time.num == 24 || is24Time.num == 48">
								<text>{{is24Time.str}}</text>
								<text>{{$t('lang.late_payment')}}</text>
							</view>
						</view>

						<text style="margin-top: 4rpx;" class="iconfont icon-more size_24 skeleton-radius"></text>
					</view>

					<!-- 热销榜单 start -->
					<view class="goods-hot-group goods_module_wrap mt_20 ml-20 flex-row"
						v-if="goodsDetail.cat_rank_info">
						<view class="hot-sale-left hot-sale-dis">
							<image class="hot-sale-thumbnail" referrerpolicy="no-referrer"
								src="/pagesC/static/fly_left@2x.png" />
							<text class="hot-sale-list">{{$t('lang.hot_list')}}</text>
							<image class="hot-sale-thumbnail-left" referrerpolicy="no-referrer"
								src="/pagesC/static/fly_right@2x.png" />
						</view>
						<view class="hot-sale-dis">
							<text class="hot-sale-text"> {{goodsDetail.cat_rank_info}}&nbsp;&nbsp;</text>
						</view>
						<view class="hot-sale-dis hot-sale-arrow">
							<text class="iconfont icon-more size_24 skeleton-radius"></text>
						</view>

					</view>

					<!-- 热销榜单 end -->

					<!-- 分销代发 start -->
					<view class="goods_module_wrap mt_20 ml-20 ">
						<view class="Distribution-agency-box">
							<view class="Distribution-agency-box-left">
								分销代发
							</view>
							<view class="Distribution-agency-box-right">
								<view class="Distribution-agency-box-right-btn" @click="showPopup('goodsimage')">
									保存图片
								</view>
								<view class="Distribution-agency-box-right-btn" v-if="goodsDetail.edm_url"
									@click="junpToWebview()">
									代发下单
								</view>
								<view class="Distribution-agency-box-right-btn" @click="jumpTo">
									去铺货
								</view>
							</view>
						</view>
					</view>
					<!-- 分销代发 end -->


					<view class="goods_module_wrap mt_20 ml-20 " style="padding: 32rpx 0;">
						<view class="activity_wrap u-border-top"
							v-if="goodsDetail.is_kj == 1 && goodsDetail.cross_warehouse_name != ''">
							<view class="activity_title">{{$t('lang.place_of_shipment')}}</view>
							<view class="activity_main">{{goodsDetail.cross_warehouse_name}}</view>
						</view>

						<!-- 送至 -->
						<view class="activity_wrap u-border-top" @click="showPopup('address')">
							<view class="activity_title skeleton-radius">{{$t('lang.label_send_to_2')}}</view>
							<view class="activity_main skeleton">
								<view class="activity_list skeleton-radius">
									<view class="activity_item regiontext">
										<!-- 		<image class="location_ico skeleton-rect"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973843579.png"
									style="width: 34rpx;height: 34rpx;" mode="heightFix"></image> -->
										{{regionSplic}}
									</view>
								</view>
								<text class="iconfont icon-more size_24 skeleton-radius"></text>
							</view>
						</view>
						<view class="activity_wrap u-border-top" @click="handleStore"
							v-if="shipping_fee.store_count > 0 && shipping_fee.store_info">
							<view class="activity_title">{{$t('lang.store')}}</view>
							<view class="activity_main">
								<view class="activity_list">
									<view class="activity_item">
										<!-- <image class="location_ico"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973845522.png"
									mode="heightFix"></image> -->
										{{shipping_fee.store_info.stores_name}}
										<view class="address_text">{{shipping_fee.store_info.stores_address}}</view>
									</view>
								</view>
								<text class="iconfont icon-more size_24"></text>
							</view>
						</view>
						<!-- 运费 -->
						<view class="activity_wrap u-border-top">
							<!-- <view class="activity_title skeleton-radius">{{$t('lang.label_freight2')}}</view> -->
							<view class="activity_title skeleton-radius"></view>
							<view class="activity_main skeleton">
								<view class="activity_list skeleton-radius">
									<view class="activity_item activity_item_flex">
										<view v-if="goodsDetail.is_shipping == 1 || freeShipping == 1">
											<text class="activity_tips"
												style="color: #09B248;margin-left:60rpx ;">{{$t('lang.pinkage')}}</text>
										</view>

										<text class="activity_tips" style="margin-left:55rpx ;" v-else>{{freight}}<text
												class="uni-red"
												v-if="shipping_fee.shipping_title && shipping_fee.shipping_title != 0 && regionSplic != '请选择'">({{ shipping_fee.shipping_title }})</text></text>
										<!-- 承诺48小时发货 -->
										<text v-if="shopDetail.shop_promise_send == 1" style="margin-left: 5px;">
											{{shopDetail.label_name_alias}}
										</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 服务 -->
						<view class="activity_wrap server_wrap u-border-top"
							v-if="goodsDetail.goods_services_label_show && goodsDetail.goods_services_label_show.length"
							@click="showPopup('server')">
							<view class="activity_title">{{$t('lang.service')}}</view>
							<view class="activity_main">
								<view class="activity_list">
									<view class="activity_item activity_item_flex service-label-width">

										<view class="server_item"
											v-for="(item, index) in (goodsDetail.goods_services_label_show || [])" :key="index">
											<text class="text">{{item.label_name}}</text>
										</view>
										<!-- <view v-else class="server_item" v-for="(item, index) in goodsDetail.goods_services_label"
									:key="index"> -->
										<!-- <image class="location_ico" :src="item.formated_label_image" mode="heightFix"></image> -->
										<!-- 	<text class="text">{{item.label_name}}</text>
								</view> -->


									</view>
								</view>
								<text class="iconfont icon-more size_24 "></text>
							</view>
						</view>
						<!-- 规格 已选-服务 statr -->
						<view class="activity_wrap" @click="skuLink">
							<view class="activity_title skeleton-radius">{{$t('lang.specification')}}</view>
							<!-- <view class="activity_main skeleton">
						<view class="activity_list skeleton-radius">
							<view class="activity_item activity_item_flex">
								<text class="activity_tips">{{selectAttr}}</text>
							</view>
						</view>
						<text class="iconfont icon-gengduo2 skeleton-radius"></text>
					</view> -->
							<view class="activity_main skeleton">
								<view class="activity_list skeleton-radius specification_lable_box">
									<view class="activity_item activity_item_flex specification_lable"
										v-if="goodsAttr[0] && goodsAttr[0].attr_key.length">
										<text
											class="activity_tips">{{goodsAttr[0].attr_key.length}}{{$t('lang.goods_species')}}{{$t('lang.specification')}}
										</text>
										<text v-if="goodsAttr[0].attr_key.length > 1">{{$t('lang.option')}}</text>
									</view>

								</view>
								<text class="iconfont icon-more size_24 "></text>
							</view>
						</view>

					</view>
					<!-- 已选-服务 end -->

						<!-- 证书 -->
					<view class="certificate goods_module_wrap mt_20 ml-20"
						v-if="goodsDetail.goods_certificate_list && goodsDetail.goods_certificate_list.length > 0">
						<view class="certificate_top" @click="showPopup('certificate')">
							{{$t('lang.certificate')}}
							<text class="iconfont icon-more size_24 skeleton-radius"></text>
						</view>
						<view class="certificate_bot" v-for="(item, index) in (goodsDetail.goods_certificate_list || [])"
							:key="index">
							<text @click="showPopup('certificate')">{{item.title}}</text>

						</view>
					</view>


					<!-- 商品评价 start -->
					<view class="goods_module_wrap mt_20 ml-20  comment_el" id="comment_id" v-if="isComment == true">
						<view class="title_box" @click="$outerHref(`/pagesC/comment/comment?id=${goodsId}`, 'app')">
							<view class="title_left">
								<text>{{commentTotal.total != 0 ? $t('lang.comment') : $t('lang.no_comment')}}</text>
								<text class="comment_count"
									v-if="commentTotal.total != 0">{{commentTotal.total}}{{$t('lang.tiao')}}</text>
							</view>
							<view class="title_right">
								<text class="drgree_of_praise color_999"
									v-if="commentTotal.total != 0">{{$t('lang.high_praise')}}{{commentTotal.good}}</text>
								<text class="iconfont icon-more size_24"></text>
							</view>
						</view>
						<view class="comment-items" v-if="goodsComment.length > 0">
							<view class="comitem" v-for="(item, index) in goodsComment" :key="index">
								<view class="item_header">
									<image class="head_l" :lazy-load="true" :src="item.user_picture"
										v-if="item.user_picture">
									</image>
									<image class="head_l" src="/static/get_avatar.jpg" v-else></image>
									<view class="head_r">
										<view class="com_name">{{item.user_name}}</view>
										<view class="com_time">
											<view class="rate_wrap">
												<text
													:class="['iconfont', 'icon-collection-alt', 'size_24', rIndex < item.rank ? 'color_red' : '']"
													v-for="(rate, rIndex) in 5" :key="rIndex"></text>
											</view>
											<!-- <text class="comment_time">{{ item.add_time }}</text> -->
										</view>
									</view>
								</view>
								<view class="item_body">
									<view class="comment_con">{{ item.content }}</view>
									<scroll-view class="scroll-view" scroll-x="true" v-if="item.comment_img">
										<view class="imgs_scroll">
											<block v-for="(val, ind) in item.comment_img" :key="ind">
												<image class="com_img" mode="aspectFill" :lazy-load="true" :src="val"
													@click="previewImg(ind, item.comment_img)" v-if="val"></image>
												<image class="com_img" mode="aspectFill"
													src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
													v-else></image>
											</block>
										</view>
									</scroll-view>
								</view>
								<view class="item_footer" v-if="item.goods_attr">{{item.goods_attr}}</view>
							</view>
							<!-- <view class="flex_box jc_center">
									<view class="goods_module_btn" @click="$outerHref(`/pagesC/comment/comment?id=${goodsId}`, 'app')">{{$t('lang.view_all_comments')}}</view>
								</view> -->
						</view>




						<!-- #ifdef APP-PLUS -->
						<!-- #endif -->

						<!-- daqin 讨论圈 -->
						<!-- <view class="title_box u-border-top" @click="$outerHref(`/pagesC/discover/list/list?id=${goodsId}`, 'app')">
					<view class="title_left">
						<text>{{$t('lang.discuss_circle')}}</text>
					</view>
					<view class="title_right">
						<text class="drgree_of_praise color_999">{{$t('lang.view_all')}}</text>
						<text class="iconfont icon-more size_24"></text>
					</view>
				</view>
				<view class="friend_discuss" v-if="friendDis.length > 0">
					<view class="discuss_item" v-for="(item, index) in friendDis" :key="index">
						<text class="dis_label" v-if="item.dis_type == 1">{{$t('lang.discuss')}}</text>
						<text class="dis_label" v-else>{{$t('lang.interlocution')}}</text>
						<text class="dis_value">{{item.dis_title}}</text>
						<text class="dis_time">{{item.add_time}}</text>
					</view>
				</view> -->
						<!--			<view class="no_dis" v-else>-->
						<!--				<view class="no_dis_title">{{$t('lang.no_discuss_tops')}}</view>-->
						<!--				<view class="goods_module_btn" @click="$outerHref(`/pagesC/discover/list/list?id=${goodsId}`, 'app')">{{$t('lang.initiate_a_topic')}}</view>-->
						<!--			</view>-->




					</view>
					<!-- 商品评价 end -->

					<!-- 店铺 start -->
					<view class="goods_module_wrap mt_20 ml-20 goods-store-hade"
						v-if="shopDetail.shop_name && controlVersion">
						<view class="store_hade"
							@click="$outerHref(`/pagesD/shop/shopHome/shopHome?ru_id=${shopDetail.ru_id}`,'app')">
							<!-- <image class="store_logo" :src="shopDetail.shop_logo"></image> -->
							<!-- 店铺名字 核心供应商 店铺地址 -->
							<view class="store_name_rate">
								<view class="sto_name">
									<text>{{shopDetail.shop_name}} </text>
									<view style="font-weight: 400;font-size: 12px;color: #A2A2A2;"> <text
											style="margin-right: 12rpx;">进店</text> <text
											class="iconfont icon-more size_24"></text>
									</view>
								</view>
								<view class="notice_1" v-if="shopDetail.goods_show_notice == 1">
									<uni-notice-bar style="padding: 0 10rpx;" show-icon :speed='60' scrollable
										:text="shopDetail.notice" />
								</view>


								<view class="shop-label-second">
									<view>
										<text v-if="goodsDetail.cross_source"
											style="color: #AF743A; font-weight: normal; font-size: 24rpx; padding-left: 10rpx;">{{ goodsDetail.cross_source }}</text><text
											style="margin-right: 16rpx;  background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;"
											v-if="goodsDetail.shop_grade==13">{{goodsDetail.shop_grade_name}}
										</text>
									</view>
									<view class="m-r28">
										<text class="shop-label-second-left">{{$t('lang.service')}}</text>
										<text class="shop-label-second-right m-l12">{{shopDetail.commentserver}}</text>
									</view>
									<view v-if="goodsDetail.fugou">
										<text class="shop-label-second-left">{{$t('lang.repurchase_rate')}}</text>
										<text class="shop-label-second-right m-l12">{{goodsDetail.fugou}}</text>
									</view>
								</view>
								<view class="shop-orientation">
									<text class=" iconfont icon-weizhi1 "></text>
									<text class="shop-text">{{shopDetail.shop_address}}</text>
									<text class="iconfont icon-more size_24"></text>
								</view>
								<!-- 					<view class="sto_rate_wrap" v-if="goodsDetail.shop_grade!==13">
							<view class="sto_rate">
								<text>{{$t('lang.store_star')}}</text>
								<text
									:class="['iconfont', 'icon-collection-alt', 'size_24', rIndex < storeRate ? 'color_red' : '']"
									v-for="(rate, rIndex) in 5" :key="rIndex"></text>
							</view>
						</view> -->
							</view>
						</view>
						<!-- <view class="store_body"> -->
						<!-- <view class="count_item">
						<view class="count_text">{{shopDetail.count_gaze}}</view>
						<view>{{$t('lang.follow_number')}}</view>
					</view>
					<view class="line_wrap u-border-left"></view>
					<view class="count_item">
						<view class="count_text">{{shopDetail.count_goods}}</view>
						<view>{{$t('lang.all_goods')}}</view>
					</view> -->
						<!-- <view class="line_wrap u-border-left"></view> -->
						<!-- <view class="count_item" v-if="goodsDetail.shop_grade!==13">
						<view class="serve_rate">
							<text>{{$t('lang.comment')}}</text>
							<text
								:class="[shopDetail.commentrank.slice(0, 1) < 3 ? 'color_green' : 'color_red']">{{shopDetail.commentrank}}{{shopDetail.commentrank_font}}</text>
						</view>
						<view class="serve_rate">
							<text>{{$t('lang.logistics')}}</text>
							<text
								:class="[shopDetail.commentdelivery.slice(0, 1) < 3 ? 'color_green' : 'color_red']">{{shopDetail.commentdelivery}}{{shopDetail.commentdelivery_font}}</text>
						</view>
						<view class="serve_rate">
							<text>{{$t('lang.after_sales')}}</text>
							<text
								:class="[shopDetail.commentserver.slice(0, 1) < 3 ? 'color_green' : 'color_red']">{{shopDetail.commentserver}}{{shopDetail.commentserver_font}}</text>
						</view>
					</view> -->


						<!-- </view> -->
						<!-- 关注店铺 进店逛逛 -->
						<!-- 	<view class="store_footer">
					<view class="store_btn" :class="{'active':followShopStatus == 1}"
						@click.stop="collectHandle(shopDetail.ru_id)">
						<image class="store_btn_ico"
							:src="followShopStatus == 1 ? 'https://images.eqingqu.com/attachs/photo/202404/20240416_C1C26B8457FEE2061B3891EDE4E8F5AC.png' : 'https://images.eqingqu.com/attachs/photo/202404/20240416_89B6E40F9CDD9DF9307E0370B51976D8.png'"
							mode="heightFix"></image>
						{{followShopStatus == 1 ? $t('lang.followed') : $t('lang.attention_store')}}
					</view>
					<view class="store_btn"
						@click="$outerHref(`/pagesD/shop/shopHome/shopHome?ru_id=${shopDetail.ru_id}`,'app')">
						<image class="store_btn_ico"
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_6E25BC9274D0AD1C423DA34E4BF8D78A.png"
							mode="heightFix"></image>
						{{$t('lang.go_shopping')}}
					</view>
				</view> -->
					</view>
					<!-- 店铺 end -->

					<!-- 搜索 start -->
					<view class="goods_module_wrap mt_20 ml-20  recomment_el skeleton" id="recomment_id">
						<view class="recomment u-border-top" v-if="recommentTabs.length > 0">
							<view class="re_tabs">
								<view :class="['re_tabs_item', currGoodsList == index ? 'active_tab' : '']"
									v-for="(item, index) in recommentTabs" :key="index" @click="changeGoodsTab(index)">
									{{item.title}}
								</view>
							</view>
							<view class="goods_list_wrap" v-for="(item, index) in goodsGuessList" :key="index">
								<block v-if="currGoodsList == index">
									<swiper :class="['swiper', item[0].length > 3 ? 'swiper_740' : 'swiper_370']"
										@change="onChangeRecomment">
										<swiper-item v-for="(pageItem, pageIndex) in item" :key="pageIndex">
											<view class="glist">
												<view class="gitem" @click="detailLink(goodsItem)"
													v-for="(goodsItem, goodsIndex) in pageItem" :key="goodsIndex">
													<image class="goods_pic" :src="goodsItem.goods_thumb"
														:lazy-load="true" v-if="goodsItem.goods_thumb"></image>
													<image class="goods_pic"
														src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
														v-else></image>
													<view class="goods_name_price">
														<view class="goods_name">
															<image class="country_icon_image"
																:src="goodsItem.country_icon" :lazy-load="true"
																v-if="goodsItem.country_icon"></image>
															{{goodsItem.goods_name}}
														</view>
														<currency-price v-if="goodsItem.shop_price"
															:price="goodsItem.shop_price"></currency-price>
													</view>
												</view>
											</view>
										</swiper-item>
									</swiper>
									<view class="indicator_dots">
										<view
											:class="['indicator', curIndex == reCurSwipeItem ? 'active_indicator' : '']"
											v-for="(curIndicator, curIndex) in item" :key="curIndex"></view>
									</view>
								</block>
							</view>
						</view>
					</view>
					<!-- 搜索 end -->

					<!-- 推荐文章 start -->
					<view class="goods_module_wrap mt_20 ml-20 "
						v-if="goodsDetail.goods_article_list && goodsDetail.goods_article_list.length > 0">
						<view class="title_box">
							<view class="title_left">
								<text>{{$t('lang.Recommended_articles')}}</text>
							</view>
						</view>
						<view class="art_content">
							<view :class="['article_item', index > 0 ? 'u-border-top' : '']"
								@click="$outerHref('/pagesC/article/detail/detail?id=' + item.article_id, 'app')"
								v-for="(item, index) in (goodsDetail.goods_article_list || [])" :key="index">
								<image class="article_img" :src="item.file_url" :lazy-load="true" v-if="item.file_url">
								</image>
								<view class="article_content">
									<view class="art_title">{{item.title}}</view>
									<text class="art_time">{{item.add_time}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 推荐文章 end -->
					<!-- 图文详情 start -->
					<view class="goods-detail-title ml-20 ">
						<!-- <text class="text-left"></text> -->
						<text class="goods-detail-text">{{$t('lang.goods_detail_info')}}</text>
						<!-- <text class="text-right"></text> -->
					</view>
					<!--商品参数 信息 -->
					<view style="background-color: #fff;border-radius: 11px;" class="goods-detail-box ml-20 ">
						<text class="image_text_title">{{$t('lang.goods_detail_info')}}</text>
						<view class="goods_attr_parameter u-border-left u-border-right u-border-top">
							<view class="tr u-border-bottom" v-if="goodsDetail.show_goodssn == 1">
								<view class="td u-border-right">{{$t('lang.goods_sn')}}</view>
								<view class="td">{{goodsDetail.goods_sn}}</view>
							</view>
							<!-- <view class="tr u-border-bottom">
						<view class="td color_58">{{$t('lang.basic_info')}}</view>
					</view> -->
							<view class="tr u-border-bottom" v-if="goodsDetail.show_brand == 1">
								<view class="td u-border-right">{{$t('lang.brand')}}</view>
								<view class="td">{{goodsDetail.brand_name}}</view>
							</view>
							<view class="tr u-border-bottom" v-if="goodsDetail.show_goodsweight == 1">
								<view class="td u-border-right">{{$t('lang.goods_weight')}}</view>
								<view class="td">{{goodsDetail.goods_weight}}kg</view>
							</view>
							<view class="tr u-border-bottom" v-if="goodsDetail.show_addtime == 1">
								<view class="td u-border-right">{{$t('lang.add_time')}}</view>
								<view class="td">{{goodsDetail.add_time_format}}</view>
							</view>
							<view class="tr u-border-bottom" v-for="(item, index) in (goodsDetail.attr_parameter || [])"
								:key="index">
								<view class="td u-border-right">{{ item.attr_name }}</view>
								<view class="td">{{ item.attr_value }}</view>
							</view>
						</view>
						
					</view>
					<view class="goods_module_wrap mt_20 ml-20  padding_b_30 detail_el skeleton" id="detail_id">
						<view class="title_box skeleton-radius">
						</view>
						<block v-if="goodsDetail.goods_desc">
							<view class="image_text_title">
								<!-- <image class="title_ico"
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_8B43A34D04DED40058A842DAC71D1432.png">
						</image> -->
								<text>{{$t('lang.goods_img_txt')}}</text>
							</view>
							<view class="goods_desc">
								<jyf-parser :html="goodsDetail.goods_desc"
									:tag-style="{video: 'width: 100%;',img: 'float:left;'}"></jyf-parser>
							</view>
						</block>
						<block v-if="goodsDetail.attr_parameter">
							<view class="image_text_title">
								<!-- <image class="title_ico"
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_2191FFC5DC8B4D8949243E16368DAB58.png">
						</image>
						<text>{{$t('lang.commodity_parameters')}}</text> -->
							</view>

						</block>
					</view>
					<!-- 图文详情 end -->

					<!-- 底部猜你喜欢 start -->
					<view class="goods-detail-guess related_el" id="related_id" v-if="guessList.length > 0">
						<view class="title"><text>{{$t('lang.same_style')}}</text></view>
						<view class="product-list-lie">
							<dsc-product-list :list="guessList" :productOuter="true"
								:guessList="true"></dsc-product-list>
							<!-- <view  v-for="(item, index) in guessList"
								:key="index">
								<waterfall :value="guessList" :column="2" :columnSpace="1.5" :seat="2"
									@imageClick="linkHref(item.goods_id)">
								</waterfall>
							</view> -->
							<uni-load-more :status="loadMoreStatus" :content-text="contentText"
								v-if="page > 1 && showLoadMore" />
						</view>
					</view>
					<!-- 底部猜你喜欢 end -->

					<!-- 底部版权 -->
					<dsc-copyright></dsc-copyright>

					<!-- 当前地区无货时，展示提示语展位 -->
					<view class="stockout_zhanwei" v-if="isShowStockout"></view>

					<!-- 提交订单栏 start：红包条与底部按钮同父级，红包条 fixed 悬浮不占位，不影响按钮 -->
					<view class="detail-bottom-wrap" :style="{ height: bottomValue }">
						<sys-coupon :detail-bar-height="couponBottomInDetail" @sys-coupon-data="handleChildData"></sys-coupon>
						<view class="submit_bar u-border-top skeleton"
							:style="{height: bottomValue,bottom:bottomPosition}">
						<!-- 当前地区无货时，展示提示语 -->
						<!-- <view class="stockout"
					v-if="is_alone_sale || goodsDetail.goods_number <= 0 || (goodsDetail.is_show_drp == 1 && goodsDetail.drp_shop > 0 && goodsDetail.is_distribution == 1)">
					<text class="stockout_txt" v-if="is_alone_sale">{{$t('lang.no_alone_sale')}}</text>
					<text class="stockout_txt" v-else-if="goodsDetail.goods_number <= 0">{{$t('lang.no_goods_tips')}}</text>
					<text class="stockout_txt"
						v-else-if="goodsDetail.is_show_drp == 1 && goodsDetail.drp_shop > 0 && goodsDetail.is_distribution == 1">{{$t('lang.share_goods_tips')}}</text>
				</view> -->
						<view class="function_wrap skeleton">
							<view class="function_item skeleton" @click="$outerHref('/pages/middles/middles','app')"
								v-if="goodsDetail.user_id == 0">
								<text class="iconfont icon-home-sy skeleton-radius"
									style="font-size: 22px; margin-bottom: 10rpx;"></text>
								<text style="skeleton-radius">{{$t('lang.home')}}</text>
							</view>
							<view class="function_item skeleton"
								@click="$outerHref('/pagesD/shop/shopHome/shopHome?ru_id='+goodsDetail.user_id,'app')"
								v-if="goodsDetail.user_id > 0 && controlVersion">
								<image class="title_ico skeleton-radius" style="width: 36rpx;height: 36rpx;"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973845522.png"
									mode="heightFix"></image>
								<text style="skeleton-radius">{{$t('lang.shop')}}</text>
							</view>
							<!-- 收藏放在客服前面 -->
							<view class="function_item skeleton" @click="collection">
								<image v-if="collectStatus == 1" src="/pagesC/static/onCollect@2x.png"
									style="width: 36rpx;height: 36rpx;margin-bottom: 14rpx;"></image>
								<image v-else src="/pagesC/static/Collect@2x.png"
									style="width: 36rpx;height: 36rpx;margin-bottom: 14rpx;">
								</image>
								<!-- 	<text class="iconfont icon-guanzhu" style="width: 36rpx;height: 36rpx;margin-bottom: 14rpx;"
							:class="{'uni-red':collectStatus == 1}"></text> -->
								<text class="share_txt"
									:style="{'color':collectStatus == 1 ? '#f92028' : '#2E2E2E'}">{{ collectStatus == 1 ? '已收藏' :'收藏'}}</text>
							</view>
							<!-- #ifndef MP-WEIXIN -->
							<view class="function_item skeleton"
								@click="onChat(shopDetail.shop_name,goodsId, goodsDetail.user_id)">
								<image class="title_ico skeleton-radius" style="width: 36rpx;height: 36rpx;"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973838773.png"
									mode="heightFix"></image>
								<text style="skeleton-radius">{{$t('lang.customer_service')}}</text>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<button open-type="contact skeleton" type="default" size="5" session-from="weapp"
								hover-class="none" class="function_item btn-cantact" v-if="wxappChat > 0">
								<image class="title_ico skeleton-radius" style="width: 36rpx;height: 36rpx;"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973838773.png"
									mode="heightFix"></image>
								<text style="skeleton-radius">{{$t('lang.customer_service')}}</text>
							</button>
							<view class="function_item skeleton"
								@click="onChat(shopDetail.shop_name,goodsId, goodsDetail.user_id)" v-else>
								<image class="title_ico skeleton-radius" style="width: 36rpx;height: 36rpx;"
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973838773.png"
									mode="heightFix"></image>
								<text style="skeleton-radius">{{$t('lang.customer_service')}}</text>
							</view>
							<!-- #endif -->
							<!-- 购物车移动到右上角 -->

						</view>
						<block v-if="is_on_sale"><!--商品下架-->
							<button
								class="u-reset-button sub_btn yellow_btn skeleton-radius detailbtn-new">{{$t('lang.goods_sold_out')}}</button>
						</block>
						<block v-else-if="is_alone_sale"><!-- 查看类似商品 -->
							<button class="u-reset-button sub_btn yellow_btn skeleton-radius detailbtn-new"
								@click="goodsAloneSale">{{$t('lang.goods_alone_sale')}}</button>
						</block>
					<block v-else>
						<!-- 当库存不足时显示库存不足按钮 -->
						<block v-if="goodsDetail.goods_number !== undefined && goodsDetail.goods_number == 0">
							<button
								class="u-reset-button sub_btn yellow_btn skeleton-radius detailbtn-new">{{$t('lang.understock')}}</button>
						</block>
						<!-- 默认显示正常按钮（数据未加载或有库存时） -->
						<block v-else>
							<button class="u-reset-button sub_btn skeleton-radius footer_btn_left"
								@click="onSku(0)">
								<template v-if="scene != 1177 && goodsCarType">
									{{ $t('lang.purchase_cart') }}
								</template>
								<image v-else src="@/pagesC/static/goods_car@2x.png"></image>
							</button>

							<!-- 	<button class="u-reset-button sub_btn  skeleton-radius footer_btn_left"
								@click="onSku(0)" v-else>
								<image src="@/pagesC/static/goods_car@2x.png"></image>
							</button> -->
							<!-- <button class="u-reset-button sub_btn  skeleton-radius footer_btn_left" @click="onSku(0)"
						v-if="scene != 1177">{{$t('lang.add_purchase_cart')}}</button> -->
							<button class="u-reset-button sub_btn footer_btn_right skeleton-radius"
								style="min-width: 170rpx" @click="onSku(1)">
								<text>{{ goodsDetail.best_price && goodsDetail.best_price.cou_id > 0 ? $t('lang.coupon_purchase') : btnBuyText }}</text>
								<!-- <text>{{ btnBuyText }}</text> -->
								<text class="jiage" style="padding: 0 10rpx;"
									v-if="goodsDetail.best_price && goodsDetail.best_price.price >= 0">
									到手价{{ goodsDetail.shop_price_formated }}
								</text>
								<text class="jiage" style="padding: 0 10rpx;"
									v-else-if="isRuturnShippingfee">退货包运费</text>
							</button>
						</block>
					</block>
						</view>
					</view>
					<!-- 提交订单栏 end -->

					<!--视频号-->
					<view class="channels_live" @click="liveHref" v-if="isChannelsLive">
						<image
							src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973839251.gif"
							class="live-img"></image>
						<text class="text">{{$t('lang.live_explanation')}}</text>
					</view>

					<!-- 优惠弹框 start：橙色头部固定；面板高度随内容增高，总高上限 660px（约 1320rpx@375 宽屏），且不超过屏高 95% -->
					<uni-popups ref="discounts" type="bottom" @change="onDiscountsPopupChange">
						<view class="pop_content coupon-popups discount-sheet-wrap" :style="discountSheetPanelStyle">
							<view class="disc-sh-hd">
								<view class="disc-sh-bar"></view>
								<view class="disc-sh-close" @click="closePop('discounts')">
									<text class="disc-sh-close-x">×</text>
								</view>
								<view class="disc-sh-pr">
									<view class="disc-sh-pv-wrap">
										<currency-price v-if="goodsDetail.shop_price_formated"
											:price="goodsDetail.shop_price_formated" :size="22" color="#FFFFFF"
											:delSize="14"></currency-price>
									</view>
								</view>
								<view class="disc-sh-pl">购买1件优惠后价格 · 可省 <text class="disc-sh-pl-b">¥{{ discountSheetSavedYuan }}</text></view>
							</view>
							<scroll-view
								class="discount-popup-scroll"
								scroll-y="true"
								:enable-back-to-top="false"
								:bounces="false"
								:style="discountSheetScrollStyle"
							>
								<view class="pop_scroll_view discount-sheet-scroll discount-sheet-measure">
									<view class="disc-sh-bd">
										<!-- 顺序：弹窗内限时抢购（档期/H5 对齐 app (1).js）→ 后台限时优惠 acttype:2 → 优惠券 → … -->
										<view
											class="disc-flash-wrap"
											:class="{ 'disc-flash-wrap--off': showFlashSaleInDiscountPopup && isPromoteFlashEnded }"
											v-if="showFlashSaleInDiscountPopup"
										>
											<view class="disc-flash-fb">
												<view class="disc-flash-fi">
													<text class="disc-flash-fizap">⚡</text>
												</view>
												<text class="disc-flash-ft">限时抢购</text>
												<text class="disc-flash-fba">{{ isPromoteFlashEnded ? '已结束' : '进行中' }}</text>
											</view>
											<view class="disc-flash-fbd">
												<view class="disc-flash-pd-row">
													<text class="disc-flash-pd">
														抢购价 <text class="disc-flash-hl">¥{{ flashSaleLinePromo }}</text>/件，原价 ¥{{ flashSaleLineOrigin }}
													</text>
												</view>
												<view v-if="isPromoteFlashCountdownActive && flashPopupCountdownStr" class="disc-flash-tm">
													<text class="disc-flash-tl">距结束</text>
													<uni-countdown
														class="disc-flash-uni-ct"
														fontColor="#FFFFFF"
														:mini="true"
														:show-colon="true"
														splitorColor="#222222"
														borderColor="#222222"
														bgrColor="#222222"
														dayTextColor="#FFFFFF"
														:timer="flashPopupCountdownStr"
													/>
												</view>
												<view v-if="isPromoteFlashCountdownActive && flashPopupSaveYuan > 0" class="disc-flash-tg">
													<text class="disc-flash-ts">可省 ¥{{ flashPopupSaveYuan }}</text>
												</view>
											</view>
										</view>

										<view class="disc-pc" v-if="limitedTimeDiscountRows.length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-red">
													<image class="disc-pi-img" src="https://images.eqingqu.com/attachs/photo/202601/20260129_C75984F728B13CA346E89FEB849CCEFD.png" mode="aspectFit"></image>
												</view>
												<text class="disc-pt">限时优惠</text>
											</view>
											<view class="disc-pbd">
												<text class="disc-pd" v-for="(act, ltdIdx) in limitedTimeDiscountRows" :key="'ltd-' + ltdIdx">{{ act.value }}</text>
											</view>
										</view>

										<view class="disc-pc" v-if="goodsCouponList && goodsCouponList.length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-org">
													<image class="disc-pi-img" src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png" mode="aspectFit"></image>
												</view>
												<text class="disc-pt">{{ $t('lang.activity') }}</text>
												<text class="disc-pb disc-pb-u">领券</text>
											</view>
											<view class="disc-pbd disc-pbd-pad0">
												<view class="disc-cl">
													<view
														v-for="(item, index) in goodsCouponList"
														:key="'disc-cp-' + index"
														:class="['disc-ci', (!(item.cou_is_receive == 1) && !(item.enable_ling > 0)) ? 'disc-ci-ok' : '']">
														<view class="disc-cil">
															<view class="disc-ca" v-if="item.cou_type == 5">
																<text class="disc-cau-free">包邮</text>
															</view>
															<view class="disc-ca" v-else>
																<text class="disc-cau">¥</text>
																<text class="disc-cam">{{ item.cou_money }}</text>
															</view>
														</view>
														<view class="disc-cir">
															<view class="disc-cc-wrap">
																<text class="disc-cc">满{{ item.cou_man }}可用<text v-if="item.cou_name"> · {{ item.cou_name }}</text></text>
																<text class="disc-c-time" v-if="item.cou_start_time">{{ $t('lang.limited_period') }}{{ item.cou_start_time }}-{{ item.cou_end_time }}</text>
															</view>
															<button
																class="u-reset-button disc-ct disc-ct-n u-reset-disabled"
																v-if="item.cou_is_receive == 1">{{ $t('lang.receive_hove') }}</button>
															<button
																class="u-reset-button disc-ct disc-ct-n u-reset-disabled"
																v-else-if="item.enable_ling > 0">{{ item.brought_up }}</button>
															<button
																class="u-reset-button disc-ct disc-ct-y"
																v-else
																@click="handelReceive(item.cou_id)">{{ $t('lang.immediately_receive') }}</button>
														</view>
													</view>
												</view>
											</view>
										</view>

										<view class="disc-pc" v-if="fullReductionPopupLines.length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-org">
													<image class="disc-pi-img" src="https://images.eqingqu.com/attachs/photo/202601/20260129_C75984F728B13CA346E89FEB849CCEFD.png" mode="aspectFit"></image>
												</view>
												<text class="disc-pt">{{ $t('lang.full_reduction') }}</text>
												<!-- <text class="disc-pb disc-pb-u">规则</text> -->
											</view>
											<view class="disc-pbd disc-pbd-mj">
												<text class="disc-pd" v-for="(line, mjIdx) in fullReductionPopupLines" :key="'mj-' + mjIdx">{{ line }}</text>
											</view>
										</view>

										<!-- 新人立减：顶栏 + 商详同款红券条（金额与规则已在红条上展示，不再重复灰字说明） -->
										<view class="disc-pc" v-if="couponLst && Object.keys(couponLst).length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-red">
													<image class="disc-pi-img" src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png" mode="aspectFit"></image>
												</view>
												<text class="disc-pt">{{ $t('lang.reduction_new_person') }}</text>
												<text class="disc-pb disc-pb-m">专享</text>
											</view>
											<view class="new-member-coupon disc-nm-in-discpc">
												<view class="coupon-amount-section">
													<text class="currency-symbol">¥</text>
													<text class="amount-value">{{ couponLstMoney }}</text>
												</view>
												<view class="coupon-divider">
													<view class="divider-line"></view>
												</view>
												<view class="coupon-text-section">
													<text class="coupon-main-text">首单立减{{ couponLstMoney }}元新客专享</text>
													<text class="coupon-time-text">限时可用</text>
												</view>
											</view>
										</view>

										<view class="disc-pc" v-if="goodsDetail.is_shipping == 1 || freeShipping == 1">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-org">
													<uni-icons type="paperplane" size="18" color="#FF8A00"></uni-icons>
												</view>
												<text class="disc-pt">包邮</text>
												
											</view>
											<view class="disc-pbd" v-if="goodsDetail.huodong_list_tip && goodsDetail.huodong_list_tip.baoyou_tip">
												<text class="disc-pd">{{ goodsDetail.huodong_list_tip.baoyou_tip }}</text>
											</view>
										</view>

										<view class="disc-pc" v-if="discountsData && discountsData.some(act => act.acttype == 5)">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-pur">
													<uni-icons type="star-filled" size="18" color="#7C3AED"></uni-icons>
												</view>
												<text class="disc-pt">{{ $t('lang.points_deduction') }}</text>
											
											</view>
											<view class="disc-pbd">
												<block
													v-for="(activityItem, activityIndex) in discountsData"
													:key="'disc-pt-' + activityIndex">
													<text
														class="disc-pd"
														v-if="activityItem.acttype == 5">
														{{ goodsDetail.huodong_list_tip && goodsDetail.huodong_list_tip.integral_price_tip ? goodsDetail.huodong_list_tip.integral_price_tip : activityItem.value }}
													</text>
												</block>
											</view>
										</view>

										<view class="disc-pc" v-if="showOneDaifaParcelTip">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-grn">
													<uni-icons type="shop" size="18" color="#00B578"></uni-icons>
												</view>
												<text class="disc-pt">{{ $t('lang.one_parcel_free') }}</text>
											<!-- 	<text class="disc-pb disc-pb-m">说明</text> -->
											</view>
											<view class="disc-pbd">
												<text class="disc-pd">{{ goodsDetail.huodong_list_tip.one_daifa_tip }}</text>
											</view>
										</view>

										<view class="disc-pc" v-if="giftPromotionRows.length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-grn">
													<uni-icons type="cart-filled" size="18" color="#00B578"></uni-icons>
												</view>
												<text class="disc-pt">{{ $t('lang.with_a_gift') }}</text>
												<text class="disc-pb disc-pb-m">赠品</text>
											</view>
											<view class="disc-pbd">
												<view class="disc-gift-row"
													v-for="(activityItem, activityIndex) in giftPromotionRows"
													:key="'gift-row-' + activityIndex">
													<view class="disc-gd disc-gd-on"></view>
													<text class="disc-gt disc-gt-on">{{ activityItem.value }}</text>
												</view>
											</view>
										</view>

										<view class="disc-pc" v-if="volumeDiscountPopupLines.length > 0">
											<view class="disc-ph">
												<view class="disc-pi disc-pi-org">
													<uni-icons type="bars" size="18" color="#FF8A00"></uni-icons>
												</view>
												<text class="disc-pt">{{ $t('lang.buy_more_discount') }}</text>
												<!-- <text class="disc-pb disc-pb-m">说明</text> -->
											</view>
											<view class="disc-pbd disc-pbd-mj">
												<text class="disc-pd" v-for="(line, viIdx) in volumeDiscountPopupLines" :key="'vol-' + viIdx">{{ line }}</text>
											</view>
										</view>

									</view>
								</view>
							</scroll-view>
							<!-- 关闭按钮 -->
							<!-- <view class="coupon_close_btn_box">
								<button class="coupon_close_btn"
									@click="closePop('discounts')">{{$t('lang.close')}}</button>
							</view> -->
						</view>
					</uni-popups>
					<!-- 优惠弹框 end -->

					<!-- 活动弹框 start -->
					<uni-popups ref="activity" type="bottom">
						<view class="pop_content activity_pup" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.goods_activity')}}</text>
								<image class="close_img"
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
									@click="closePop('activity')"></image>
							</view>
							<scroll-view scroll-y="true" :style="{height: `${popHeight.bd}px`}">
								<view class="pop_scroll_view">
									<view class="act_item" @click="$outerHref(item.path, 'app')"
										v-for="(item, index) in activityData" :key="item.path">
										<view class="act_main">
											<view class="act_left">
												<view class="act_label">{{item.label}}</view>
												<view class="act_value">{{item.value}}</view>
											</view>
											<text class="iconfont icon-more size_24"></text>
										</view>
										<view class="package_wrap" v-if="item.acttype == 2">
											<view class="recommend_title">{{$t('lang.recommended_accessories')}}
												{{$t('lang.hig_discount')}} <text
													class="activity_price">{{spare_price}}</text>
												{{$t('lang.yuan')}}
											</view>
											<view class="img_list">
												<view class="img_wrap">
													<image class="goods_pic" :src="goodsDetail.goods_thumb"></image>
												</view>
												<block v-for="(packageItem, packageIndex) in (goodsDetail.fittings || [])"
													:key="packageIndex">
													<view class="img_wrap" v-if="packageIndex < 3">
														<image class="goods_pic" :src="packageItem.goods_thumb"></image>
													</view>
												</block>
												<text class="iconfont icon-gengduo1"
													v-if="(goodsDetail.fittings || []).length > 3"></text>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</uni-popups>
					<!-- 活动弹框 end -->

					<!-- 商品属性弹框 start -->
					<uni-popups ref="goodsattr" type="bottom" @change="onGoodsAttrPopupChange">
						<view class="pop_content specification-pop-content">
							<view class="goods_attr_pop">
								<image class="close_img"
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
									@click="closePop('goodsattr',1)"></image>
								<!-- 
						 -->
								<view class="goods_info goods_info_send"
									v-if=" shopDetail.stop_send_date || shopDetail.start_send_date">
									<view class="top">
										<view class="top-left">
											<text>促销优惠 ｜ </text>
											<view class="top-left-right">
												<image src="/pagesC/static/lightning.png"></image>
												<text
													style="font-weight: bold;font-size: 14px;color: #fff;margin: 0 16rpx;">{{timeDifference}}</text>
											</view>
											<!-- 	<view class="top-left-right" v-else>
												<image src="/pagesC/static/lightning.png"></image>
												<text v-if="product_num">仅剩{{product_num}}{{$t('lang.jian')}}</text>
											</view> -->

										</view>
										<text>即将结束</text>
									</view>
									<view class="bottom">
										<image class="goods_pic" :src="goodsDetail.goods_thumb"
											@click="previewImg(0, goodsDetail.goods_thumb)"></image>
										<view class="info_right">
											<view class="info_right_frist">
												<!-- <text v-if="calculatePauseDiff()">
													{{$t('lang.suspend_delivery_immediately')}}
												</text>
												<text v-else>{{$t('lang.suspend_delivery')}} </text> -->
												<currency-price :price="goodsDetail.shop_price" :size="24"
													v-if="goodsDetail.shop_price"></currency-price>
												<text class="membership-discount-price" v-if="goodsDetail.is_membership_card_discount_price">{{goodsDetail.is_membership_card_discount_price}}</text>
											</view>
											<!-- 假一赔十 -->
											<view class="correct_product " v-if="isTenForFake">
												<view class="ten_fake_lable">
													<image class="img-red-envelope"
														src="/pagesC/static/quality_product@2x.png"></image>
													<text>{{$t('lang.correct_product')}}</text>
												</view>
											</view>
											<view class="info_right_second">
												<text>优惠前</text>
												￥{{goodsDetail.marketPrice}}

											</view>
											<view class="info_right_three" v-if="goodsDetail.sales_volume > 500">
												<image class="img" src="/pagesC/pagesC/static/fire@2x.png"></image>
												<text>已抢{{ goodsDetail.sales_volume }}+{{$t('lang.jian')}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="goods_info" v-else>
									<image class="goods_pic" :src="goodsDetail.goods_thumb"
										@click="previewImg(0, goodsDetail.goods_thumb)"></image>
									<!-- <image class="goods_pic" src="https://www.ok9288.com/img/user_default.png"></image> -->
									<view class="info_right">
										<view>
											<view>
												<currency-price :price="goodsDetail.shop_price" :size="24"
													v-if="goodsDetail.shop_price"></currency-price>
											</view>
										</view>
										<!-- 假一赔十 -->
										<view class="correct_product " v-if="isTenForFake">
											<view class="ten_fake_lable">
												<image class="img-red-envelope"
													src="/pagesC/static/quality_product@2x.png">
												</image>
												<text>{{$t('lang.correct_product')}}</text>
											</view>
										</view>
										<!-- <view class="selece_atrr">{{$t('lang.label_selected2')}}：{{selectAttr}}</view>
								<view class="inventory">
									<view class="inventory_num"
										v-if="goodsDetail.goods_number && goodsDetail.show_goodsnumber > 0">
										<text class="label">{{$t('lang.stock')}}：</text> 
										<text>{{goodsDetail.goods_number}}</text>
									</view>
									<view class="inventory_sn" v-if="goodsDetail.goods_sn && goodsDetail.show_goodssn == 1">
										<text class="label">{{$t('lang.commodity_number')}}：</text> -->

										<!-- 			<text>{{goodsDetail.goods_sn}}</text>
									</view>
								</view>
								<view class="inventory" v-if="goodsDetail.upc">
									<view class="inventory_num">
										<text class="label">条形码：</text>
										<text>{{goodsDetail.upc}}</text>
									</view>
								</view> -->

									</view>


								</view>
							</view>
							<view class="pause-delivery" v-if="shopDetail.stop_send_date">
								<!-- 当前时间小于 暂停发货时间  马上暂停发货 -->
								<!-- 当前时间大于 暂停发货时间  暂停发货 -->
								<view class="pause-delivery-box" v-if="calculatePauseDiff()">
									<view class="pause-delivery_label">
										<image class="img" src="/pagesC/static/redCar@2x.png"></image>
										<text
											class="pause-delivery_label_text">{{$t('lang.suspend_delivery_immediately')}}
										</text>
									</view>
									<view class="pause_botoom_label">
										<text>该商品预计{{shopDetail.stop_send_date}}起停运</text>
										<text></text>
									</view>
								</view>
								<view v-else class="pause-delivery-box">
									<view class="pause-delivery_label">
										<image class="img" src="/pagesC/static/redCar@2x.png"></image>
										<text class="pause-delivery_label_text">{{$t('lang.suspend_delivery')}}
										</text>
									</view>
									<view class="pause_botoom_label">
										<text>下单后该商品预计{{shopDetail.start_send_date}}起开始发货</text>
										<text></text>
									</view>
								</view>
							</view>
							<!-- 优惠 店铺优惠 -->
							<view class="favorable"
								v-if="hasRealPromoteSchedule">
								<view class="left">{{$t('lang.goods_discounts')}}</view>
								<view class="label">
									<text class="label-right">{{$t('lang.activity')}}</text>
									<text
										class="label-text">-{{formatPrice(goodsDetail.marketPrice,goodsDetail.shop_price)}}元</text>
								</view>
							</view>

							<!-- 切换规格 -->
							<!-- <scroll-view scroll-y="true" :style="{height: `${popHeight.center-140}px`}"> -->
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center-140}px`}">
								<view class="goods_attr_pop">
									<!-- 如果是多规格 -->
									<view class="goods_attr_wrap" v-if="attrLength >= 2">
										<view class="attr_type" v-for="(item, index) in goodsAttr" :key="index">


											<!-- 通用属性名称展示 -->
											<view class="attr_title">{{item.name}}</view>

											<!-- 常规项内容 - 最后一个规格不在这里显示 -->
											<view class="attr_list" v-if="!isLastItem(index)">
												<view class="attr_top_num_box"
													v-for="(attrItem, vIndex) in item.attr_key" :key="vIndex"
													@click="selectGoodsAttr(attrItem, item,1)">
													<view class="attr_top_num">
														<image v-if="attrItem.attr_img_flie"
															:src="attrItem.attr_img_flie"></image>
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

											<!-- 最后一个规格：规格项和库存信息一起显示 -->
											<view class="sizes" v-if="isLastItem(index)">
												<view v-for="(attrItem, attrIndex) in item.attr_key" :key=" attrIndex"
													v-if="(goodsAttr.length -1) == index && attrLength >= 2"
													class="attr_list_box_label">
													<!-- 左侧：图片和数量徽章 -->
													<view class="attr_top_num_box">
														<view class="attr_top_num">
															<image v-if="attrItem.attr_img_flie"
																:src="attrItem.attr_img_flie"></image>
															<image v-else class="img"
																src="https://www.ok9288.com/img/user_default.png">
															</image>
														</view>
														<view class="badge"
															:class="['badge', getColorTotal(attrItem.id) > 0 ? 'badg_block' : 'badg_none']">
															<text>x</text>{{ getColorTotal(attrItem.id) }}
														</view>
													</view>
													<!-- 右侧：规格名称和库存信息 -->
													<view class="size-label">
														<view class="size-item" style="flex-direction: column">
															<!-- 第一行：商品名称和数量选择器 -->
															<view class="spec-info1">
																<view class="spec-info-left">
																	<text class="spec-info-text">{{attrItem.attr_value}}</text>
																</view>
																<view class="counter">
																	<button :disabled="!canDecrease(attrItem)"
																		@click="changeGoodsNum(-1,attrItem)">-</button>
																	<!--  :value="getCurrentCount(attrItem)" -->
																	<input :value="getCurrentCount(attrItem)"
																		:disabled="!getproductType(attrItem, attrIndex) "
																		@focus="onCountInputFocus(attrItem, item)"
																		@input="onCountInput($event)"
																		@blur="changeGoodsNumByInput($event,attrItem,item)"
																		class="count-input" />
																	<button :disabled="!getproductType(attrItem, attrIndex) "
																		@click="changeGoodsNum(1,attrItem)">+</button>
																</view>
															</view>
															<!-- 第二行：价格、库存、编号、条形码等信息（竖向三行显示） -->
														<view class="spec-info-price">
															<view class="inventory" v-if="skuType">
																	<!-- 第一行：价格和库存 -->
																	<view class="inventory_row">
																<view class="inventory_num">
																	<!-- 价格  -->
																	<text>¥{{ currentSkuInfo(attrItem.id,goodsAttr).product_price || '--'}}</text>
																</view>
																<view class="inventory_num">
																	<text
																				class="label">{{$t('lang.stock')}}：</text>
																	<!-- stock 库存 -->
																	<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).product_number || '--' }}</text>
																</view>
																	</view>
																	<!-- 第二行：编号 -->
																	<view class="inventory_row">
																<view class="inventory_sn">
																	<text
																				class="label">{{$t('lang.commodity_number')}}：</text>
																	<!-- commodity_number 编号 -->
																	<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).product_sn  || '--'}}</text>
																</view>
																	</view>
																	<!-- 第三行：条形码 -->
																	<view class="inventory_row">
																<view class="inventory_num">
																	<text class="label">条形码：</text>
																	<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).bar_code  || '--'}}</text>
																</view>
															</view>
															<!-- 第四行：限购提示 -->
															<view class="inventory_row" v-if="currentSkuInfo(attrItem.id,goodsAttr,1).limit_buy_tip">
																<view class="limit-buy-tip">
																	<text>{{ currentSkuInfo(attrItem.id,goodsAttr,1).limit_buy_tip }}</text>
																</view>
															</view>
														</view>
													</view>
														</view>
													</view>
												</view>
											</view>


										</view>


										<!-- 原商品规格展示 -->
										<!-- <view class="attr_type" v-for="(item, index) in goodsAttr" :key="index">
								<view class="attr_title">{{item.name}}</view>
								<view class="attr_list">
									<view
										:class="['attr_item',item.name == '规格'&& seleceGoodsAtrrArray.includes(attrItem.id) ? 'active_attr' : '']"
										@click="selectGoodsAttr(attrItem, item)"
										v-for="(attrItem, attrIndex) in item.attr_key" :key="attrIndex">
										<view class="attr_top_num" v-if="item.name == '规格'">
											{{attrItem.attr_value}}
										</view>
										<view v-if="item.name == '颜色'">
											{{attrItem.attr_value}}
											<view class="attr_type goods_num_wrap">
												<view class="attr_title">{{$t('lang.number')}}</view>
												<view class="limit_and_mun">
													<text class="limit_txt" v-if="goodsDetail.is_minimum > 0">（
														{{goodsDetail.minimum}}{{goodsDetail.goods_unit}}{{$t('lang.label_minimum_2')}}）</text>
													<text class="limit_txt"
														v-if="goodsDetail.xiangou_num > 0 && goodsDetail.xiangou_end_date > goodsDetail.current_time">（{{$t('lang.purchase_only')}}{{goodsDetail.xiangou_num}}
														{{goodsDetail.goods_unit}}）</text>
													<view class="add_num_wrap">
														<text
															:class="['iconfont', 'icon-jian', goodsNum > minNum ? '' : 'limit_1']"
															@click="changeGoodsNum(-1,attrItem)"></text>
														<input class="add_input" type="number" :value="goodsNum"
															@blur="changeGoodsNumByInput" />
														<text
															:class="['iconfont', 'icon-jia', goodsNum < xiangouNum ? '' : 'limit_1']"
															@click="changeGoodsNum(1,attrItem)"></text>
													</view>
												</view>
											</view>
										</view>

									</view>
								</view>
							</view> -->
										<!-- 原商品规格展示 -->
									</view>
									<!-- 如果是单规格 -->
									<view class="goods_attr_wrap">

										<view class="attr_type" v-for="(item, index) in goodsAttr" :key="index"
											v-if="(goodsAttr.length -1) == index && attrLength <= 1">
											<view class="attr_title">{{item.name}}</view>

											<!-- -->
											<view class="attr_list ">
												<view class="attr_list_box_label"
													v-for="(attrItem, attrIndex) in item.attr_key" :key="attrIndex">
													<view class="attr_top_num_box">
														<view class="attr_top_num"
															v-if="(goodsAttr.length -1) == index && attrLength <= 1">
															<image v-if="attrItem.attr_img_flie"
																:src="attrItem.attr_img_flie">
															</image>
															<image v-else
																src="https://www.ok9288.com/img/user_default.png">
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
																<view class="spec-info-left">
																<text
																	class="spec-info-text">{{attrItem.attr_value}}</text>
																</view>

																<view class="counter">
																	<button :disabled="!canDecrease(attrItem)"
																		@click="changeGoodsNum(-1,attrItem)">-</button>
																	<input :value="getCurrentCount(attrItem)"
																		:disabled="!getproductType(attrItem, attrIndex) "
																		@focus="onCountInputFocus(attrItem, item)"
																		@input="onCountInput($event)"
																		@blur="changeGoodsNumByInput($event,attrItem,item)"
																		class="count-input" />
																	<button :disabled="!getproductType(attrItem, attrIndex) "
																		@click="changeGoodsNum(1,attrItem)">+</button>
																</view>
															</view>
															<view class="spec-info-price">
																<view class="inventory" v-if="skuType">
																	<!-- 第一行：价格和库存 -->
																	<view class="inventory_row">
																	<view class="inventory_num">
																		<!-- 价格  -->
																		<text>¥{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_price || "" }}</text>
																	</view>
																	<view class="inventory_num">
																		<text
																				class="label">{{$t('lang.stock')}}：</text>
																		<!-- stock 库存 -->
																		<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_number || 0}}</text>
																	</view>
																	</view>
																	<!-- 第二行：编号 -->
																	<view class="inventory_row">
																	<view class="inventory_sn">
																		<text
																				class="label">{{$t('lang.commodity_number')}}：</text>
																		<!-- commodity_number 编号 -->
																		<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).product_sn || 0}}</text>
																	</view>
																	</view>
																	<!-- 第三行：条形码 -->
																	<view class="inventory_row">
																	<view class="inventory_num">
																		<text class="label">条形码：</text>
																		<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).bar_code|| "" }}</text>
																		</view>
																	</view>
																	<!-- 第四行：限购提示 -->
																	<view class="inventory_row" v-if="currentSkuInfo(attrItem.id,goodsAttr,0).limit_buy_tip">
																		<view class="limit-buy-tip">
																			<text>{{ currentSkuInfo(attrItem.id,goodsAttr,0).limit_buy_tip }}</text>
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

								</view>
							</scroll-view>

							<!-- 服务退货包运费 -->
							<!-- 	<view class="ruturn-shipping" v-if="isRuturnShippingfee">
						<view class="text"><text>服务保障</text></view>
						<view class="label">退货包运费（商家赠送）</view>
					</view> -->

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
											<view @click="showCity('address')" class="show_city"
												style="font-weight: bold;color: #999999;font-size: 12px;">
												<view class="activity_title skeleton-radius">
													{{$t('lang.label_send_to_2')}}:
												</view>
												<view class="activity_main skeleton">
													<view class="activity_list skeleton-radius">
														<view class="activity_item">
															{{regionSplic}}
														</view>
													</view>
												</view>
												<view class="view_more_btn" @click="isAddress = !isAddress">
													<text
														:class="['iconfont', isAddress ? 'icon-moreunfold' :  'icon-less' , 'size_24 ']"></text>
												</view>
											</view>
										</view>
										<view class="footer-total-price-right">
											<view class="footer-total--right-amout">
												<text class="total-price">{{$t('lang.goods_amout')}}</text>
												<currency-price :price="totalPrice.toFixed(2) " :size="24"
													v-if="goodsDetail.shop_price"></currency-price>
											</view>

											<view class="footer-total-freight">
												<view v-if="goodsDetail.is_shipping == 1 || freeShipping == 1">
													<text class="activity_tips"
														style="color: #FE2F02;margin-left:60rpx ;">{{$t('lang.pinkage')}}</text>
												</view>
												<view v-else>
													<text
														v-if="goodsAttr.shipping_fee">{{$t('lang.label_freight2')}}{{goodsAttr.shipping_fee}}</text>
												</view>
											</view>

										</view>
									</view>
								</view>
								<view class="footer-total-price-btn">
									<block v-if="!storeBtn">
										<block v-if="is_on_sale">
											<button
												class="u-reset-button sub_btn yellow_btn">{{$t('lang.goods_sold_out')}}</button>
										</block>
										<block v-else-if="is_alone_sale">
											<button class="u-reset-button sub_btn yellow_btn"
												@click="goodsAloneSale">{{$t('lang.goods_alone_sale')}}</button>
										</block>
										<block v-else>
											<block v-if="goodsDetail.goods_number">
												<button
													:class="['u-reset-button ', 'sub_btn ', specificationBtnType ? 'footer_btn_left' : 'footer_btn_left2']"
													@click="onAddCartClicked(0)"
													v-if="addType == 1 || addType == ''">{{$t('lang.add_purchase_cart')}}</button>
												<button
													:class="['u-reset-button ', 'sub_btn ', specificationBtnType ? 'footer_btn_right' : 'footer_btn_right2']"
													@click="onAddCartClicked(10)" v-if="addType == 2 || addType == ''">
													<view class="button-price">
														<text>{{ goodsDetail.best_price && goodsDetail.best_price.cou_id > 0 ? $t('lang.coupon_purchase') : btnBuyText  }}
														</text>
														<text
															v-if="!surplusCreditLine && totalPrice.toFixed(2) > 0">￥{{totalPrice.toFixed(2) }}</text>

													</view>

													<!-- <text>{{btnBuyText}}  </text>   v-if="!surplusCreditLine"-->
													<!-- <text class="jiage" style="padding: 0 10rpx;"
														v-if="goodsDetail.best_price.price >= 0">
														{{$t('lang.on_hand_price')}}{{ goodsDetail.shop_price_formated }}
													</text> -->
													<view class="footer-brage" v-if="pauseType">
														<text>预计{{formatWithRegExp}}截止发货</text>
													</view>
												</button>
											</block>
											<block v-else>
												<button
													class="u-reset-button sub_btn yellow_btn  ">{{$t('lang.understock')}}</button>
											</block>
										</block>
									</block>
									<block v-else>
										<button class="u-reset-button sub_btn pup_btn red_btn"
											@click="onStoreClicked">{{ $t('lang.private_store') }}</button>
									</block>

								</view>

							</view>
						</view>
					</uni-popups>
					<!-- 商品属性弹框 end -->

					<!-- 配送弹框 start -->
					<uni-popups ref="address" type="bottom">
						<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="iconfont icon-find-fanhui" @click="currAddressSwiper = 0"
									v-if="currAddressSwiper == 1"></text>
								<text class="pop_title">{{$t('lang.delivery_to_the')}}</text>
								<image class="close_img"
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
									@click="closePop('address',1)"></image>
							</view>
							<!-- <block v-if="currAddressSwiper == 0"> -->
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center-30}px`}">
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
												<view style="margin-right: 20rpx;">{{ item.province_name }}
													{{ item.city_name }}
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
							<view style="height: 30rpx;"></view>
							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="togetlocation">添加新地址</button>
								<!-- <button class="u-reset-button sub_btn address_btn red_btn" style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
								@click="togetlocation">一键获取当前位置</button> -->
							</view>
							<!-- <view class="btn_wrap u-border-top">
							<button class="u-reset-button sub_btn address_btn red_btn"
								@click="selectOtherAddress">{{$t('lang.choose_another_address')}}</button>
						</view> -->
							</block>
							<!-- <block v-else> -->
							<!--地区选择-->
							<!-- <dsc-region :display="regionShow" regionType="goods" :regionOptionData="regionData"
							@updateDisplay="getRegionShow" @updateRegionDate="getRegionOptionDate"
							v-if="regionLoading"></dsc-region> -->
							<!-- </block> -->
						</view>
					</uni-popups>
					<!-- 配送弹框 end -->


					<!-- 服务弹框 start -->
					<uni-popups ref="server" type="bottom">
						<view class="pop_content server-popups" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.service')}}</text>
								<image class="close_img"
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
									@click="closePop('server')"></image>
							</view>
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
								<view class="pop_scroll_view">
									<view class="server" v-for="(item,index) in (goodsDetail.goods_services_label || [])"
										:key="index">
										<view class="server_item">
											<image class="location_ico" :src="item.formated_label_image"
												mode="heightFix"></image>
											<text>{{item.label_name}}</text>
										</view>
										<view class="color_999">{{item.label_explain}}</view>
									</view>
								</view>
							</scroll-view>
							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closePop('server')">{{$t('lang.confirm')}}</button>
							</view>
						</view>
					</uni-popups>
					<!-- 服务弹框 end -->

					<!-- 假一赔十弹框  start -->
					<uni-popups ref="ten_fake" type="bottom">
						<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.reality_Instructions')}}</text>
							</view>
							<view :style="{height: `${popHeight.center}px`}">
								<view>
									<text>{{$t('lang.authority_accredit')}}</text>
								</view>
								<view class="color_999">{{ten_fake_text}}</view>
							</view>
							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closePop('ten_fake')">{{$t('lang.confirm')}}</button>
							</view>
						</view>
					</uni-popups>
					<!-- 假一赔十 end -->
					<!-- 24小时弹框  start -->
					<uni-popups ref="hour24" type="bottom">
						<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.shipping_instructions')}}</text>
							</view>
							<view :style="{height: `${popHeight.center}px`}">
								<view>
									<text>{{$t('lang.goods_predict')}}{{is24Time.num}}{{$t('lang.goods_huor_deliver')}}</text>
								</view>
								<view class="color_999">

									{{is24Time.label}}
								</view>
							</view>
							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closePop('hour24')">{{$t('lang.confirm')}}</button>
							</view>
						</view>
					</uni-popups>
					<!-- 小时弹框 end -->

					<!-- 商品信息弹窗start -->
					<uni-popups ref="show_goods_detail" type="bottom">
						<view class="pop_content show_goods_pop_content" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.product_attribute')}}</text>
							</view>
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
								<view
									class="show_goods_pop goods_attr_parameter u-border-left u-border-right u-border-top">
									<view class="tr u-border-bottom" v-if="goodsDetail.show_goodssn == 1">
										<view class="td u-border-right">{{$t('lang.goods_sn')}}</view>
										<view class="td">{{goodsDetail.goods_sn}}</view>
									</view>
									<!-- <view class="tr u-border-bottom">
								<view class="td color_58">{{$t('lang.basic_info')}}</view>
							</view> -->
									<view class="tr u-border-bottom" v-if="goodsDetail.show_brand == 1">
										<view class="td u-border-right">{{$t('lang.brand')}}</view>
										<view class="td">{{goodsDetail.brand_name}}</view>
									</view>
									<view class="tr u-border-bottom" v-if="goodsDetail.show_goodsweight == 1">
										<view class="td u-border-right">{{$t('lang.goods_weight')}}</view>
										<view class="td">{{goodsDetail.goods_weight}}kg</view>
									</view>
									<view class="tr u-border-bottom" v-if="goodsDetail.show_addtime == 1">
										<view class="td u-border-right">{{$t('lang.add_time')}}</view>
										<view class="td">{{goodsDetail.add_time_format}}</view>
									</view>
									<view class="tr u-border-bottom" v-for="(item, index) in (goodsDetail.attr_parameter || [])"
										:key="index">
										<view class="td u-border-right">{{ item.attr_name }}</view>
										<view class="td">{{ item.attr_value }}</view>
									</view>
								</view>
							</scroll-view>

							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closePop('show_goods_detail')">{{$t('lang.close')}}</button>
							</view>
						</view>
					</uni-popups>


					<!-- 商品信息弹窗end-->

					<!-- 证书弹框 start -->
					<uni-popups ref="certificate" type="bottom" style="">
						<view class="pop_content certificate_pop_content" :style="{height: `${popHeight.hd}px`}">
							<view class="pop_header">
								<text class="pop_title">{{$t('lang.certificate')}}</text>

							</view>
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
								<view class="pop_scroll_view">
									<view class="server" v-for="(item, index) in (goodsDetail.goods_certificate_list || [])"
										:key="index">
										<view class="server_item margin-btn8">
											<text>{{item.title}}</text>
											<text class="certificate-number">{{item.number}}</text>
										</view>
										<view class="img-label" v-for="(img, imgIndex) in item.img" :key="imgIndex">
											<image @click="previewImg(index, item.img)" class="certificate_image"
												:src="img">
											</image>
											<!-- <image @click="previewImg(index, item.img)"  src="https://www.ok9288.com/img/user_default.png"></image> -->
										</view>
									</view>
								</view>
							</scroll-view>
							<view class="btn_wrap u-border-top" style="padding: 0;">
								<!-- <button class="u-reset-button sub_btn address_btn red_btn"
							@click="closePop('certificate')">{{$t('lang.close')}}</button> -->
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closeCertificate()">{{$t('lang.close')}}</button>

							</view>
						</view>
					</uni-popups>
					<!-- 证书弹框 end -->

					<!-- 证书内部第二弹框 start -->
					<uni-popups ref="certificate2" type="center" style="width: 300px;">
						<view class="pop_content certificate_pop_content2">
							<view class="certificate_pop_header">
								<text class="pop_title">{{$t('lang.statement_tips')}}</text>
							</view>
							<view class="certificate_pop_text">
								<text>{{$t('lang.statement')}}</text>
							</view>
							<view class="btn_wrap u-border-top">
								<button class="u-reset-button sub_btn address_btn red_btn"
									@click="closeCertificate2()">{{$t('lang.remind1')}}</button>
							</view>
						</view>
					</uni-popups>



					<!--小程序分享-->
					<view class="show-popup-shareImg">
						<uni-popup :show="shareImgShow" type="bottom" animation="true"
							v-on:hidePopup="shareImgShow = false">
							<view class="mp-share-warp">
								<view class="title">
									<text>{{$t('lang.save_xaingce')}}</text>
									<uni-icon type="closeempty" size="30" color="#8f8f94"
										@click="shareImgShow = false"></uni-icon>
								</view>
								<view class="mp-share-img">
									<image :src="mpShareImg" mode="heightFix" class="img" @tap="previewImage"></image>
								</view>
								<view class="btn-bar btn-bar-radius"><button class="btn btn-red"
										@click="downloadImg">{{$t('lang.save_picture')}}</button></view>
							</view>
						</uni-popup>
					</view>
					<!--小程序分享-->
					<!-- <view class="show-popup-shareImg">
				<uni-popup :show="shareImgShow_1" type="bottom" animation="true" v-on:hidePopup="shareImgShow_1 = false">
					<view class="mp-share-warp">
						<view class="mp-share-img">
							<image :src="mpShareImg" mode="heightFix" class="img" @tap="previewImage"></image>
						</view>
					</view>
				</uni-popup>
			</view> -->
					<view v-if="shareImgShow_1">
						<view class="cover" @click="showRefundNoClose" catchtouchmove="true"></view>
						<view class="wxshare">
							<!-- <image src="../../static/guide/1.jpg" mode="widthFix" class="img" style="width: 100%;height: 100%;"></image> -->
							<image :src="mpShareImg" mode="widthFix" class="img" style="width: 100%;height: 100%;">
							</image>
						</view>
					</view>
					<!--自定义分享-->
					<uni-popups id="popupPoster" ref="popupPoster" :animation="true" type="bottom">
						<view class="popup-poster">
							<view class="poster-image">
								<image :src="mpShareImg" mode="widthFix" class="img"></image>
							</view>
							<view class="poster-btn">
								<view class="tit">{{$t('lang.share_to')}}</view>
								<view class="lists">
									<!-- #ifdef MP-WEIXIN -->
									<button class="list" open-type="share">
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png"
											mode="widthFix"></image>
										<text>{{ $t('lang.share_with_friends') }}</text>
									</button>
									<!-- #endif -->
									<!-- #ifdef APP-PLUS -->
									<view class="list" @click="posterAppShare('weixin')">
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png"
											mode="widthFix"></image>
										<text>{{ $t('lang.share_with_friends') }}</text>
									</view>
									<view class="list" @click="posterAppShare('pyq')">
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B5909313764D1D265E4DEF899458559.png"
											mode="widthFix"></image>
										<text>{{ $t('lang.generate_sharing_poster') }}</text>
									</view>
									<!-- #endif -->
									<view class="list" @click="downloadImg">
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_65946CB61B087346EBA2A3375F81C2EB.png"
											mode="widthFix"></image>
										<text>{{ $t('lang.save_picture') }}</text>
									</view>
								</view>
								<view class="cancel" @click="popupPosterCancel">{{$t('lang.cancel')}}</view>
							</view>
						</view>
					</uni-popups>

					<!-- 商品图片下载弹框 start -->
					<uni-popups ref="goodsimage" type="bottom">
						<view class="pop_content">
							<view
								style="display: flex;flex-direction: row;justify-content: space-between;padding: 30rpx;">
								<view></view>
								<view style="font-size: 36rpx;">选择图片</view>
								<view style="margin-top: 10rpx;">
									<image style="width: 40rpx;height: 40rpx;"
										src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
										@click="closePop('goodsimage')"></image>
								</view>
							</view>
							<view style="padding: 0 30rpx;font-size: 28rpx;">
								<text v-if="goodsDetail.user_id == 0">{{$t('lang.self_support')}}</text>
								{{goodsDetail.goods_name}}
							</view>
							<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
								<view class="card-goods">
									<view class="card-goods-group" v-if="main_image_list.length > 0">
										<view class="card-shop-head">
											<view class="head-left">
												<view class="checkbox"
													:class="{'checked':main_image_list_checked,'checkbox-disabled':main_image_list_checked}"
													@click="check_main_image_list">
													<view class="checkbox-icon">
														<uni-icons type="checkmarkempty" size="14"
															color="#ffffff"></uni-icons>
													</view>
												</view>
												<view class="checkbox-con" style="margin-left: -20rpx;">
													商品主图（{{main_image_list.length}}）张</view>
											</view>
										</view>
										<view class="tui-order-list tui-flex-wrap">
											<view class="tui-tool-item" v-for="(item, index) in main_image_list"
												:key="index">
												<view style="position: relative;">
													<image :src="item.url" class="image"
														@click="previewImg(index, main_image_list.map(val => val.url))">
													</image>
													<view class="checkbox"
														style="position: absolute;bottom: 15%;right: -20rpx;"
														:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
														@click="check_main_image_list_detail(item,index)">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16"
																color="#ffffff"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
									<view class="card-goods-group" v-if="attr_image_list.length > 0">
										<view class="card-shop-head">
											<view class="head-left">
												<view class="checkbox"
													:class="{'checked':attr_image_list_checked,'checkbox-disabled':attr_image_list_checked}"
													@click="check_attr_image_list">
													<view class="checkbox-icon">
														<uni-icons type="checkmarkempty" size="14"
															color="#ffffff"></uni-icons>
													</view>
												</view>
												<view class="checkbox-con" style="margin-left: -20rpx;">
													商品规格图（{{attr_image_list.length}}）张</view>
											</view>
										</view>
										<view class="tui-order-list tui-flex-wrap">
											<view class="tui-tool-item" v-for="(item, index) in attr_image_list"
												:key="index">
												<view style="position: relative;">
													<image :src="item.url" class="image"
														@click="previewImg(index, attr_image_list.map(val => val.url))">
													</image>
													<view class="checkbox"
														style="position: absolute;bottom: 15%;right: -20rpx;"
														:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
														@click="check_attr_image_list_detail(item,index)">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16"
																color="#ffffff"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
									<view class="card-goods-group" v-if="detail_image_list.length > 0">
										<view class="card-shop-head">
											<view class="head-left">
												<view class="checkbox"
													:class="{'checked':detail_image_list_checked,'checkbox-disabled':detail_image_list_checked}"
													@click="check_detail_image_list">
													<view class="checkbox-icon">
														<uni-icons type="checkmarkempty" size="14"
															color="#ffffff"></uni-icons>
													</view>
												</view>
												<view class="checkbox-con" style="margin-left: -20rpx;">
													商品详情图（{{detail_image_list.length}}）张</view>
											</view>
										</view>
										<view class="tui-order-list tui-flex-wrap">
											<view class="tui-tool-item" v-for="(item, index) in detail_image_list"
												:key="index">
												<view style="position: relative;">
													<image :src="item.url" class="image"
														@click="previewImg(index, detail_image_list.map(val => val.url))">
													</image>
													<view class="checkbox"
														style="position: absolute;bottom: 15%;right: -20rpx;"
														:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
														@click="check_detail_image_list_detail(item,index)">
														<view class="checkbox-icon">
															<uni-icons type="checkmarkempty" size="16"
																color="#ffffff"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
							<view class="footer_btn u-border-top">
								<view style="width: 100%;">
									<view class="card-shop-head" style="text-align: left;">
										<view class="head-left">
											<view class="checkbox"
												:class="{'checked':image_list_all_checked,'checkbox-disabled':image_list_all_checked}"
												@click="check_image_list_all">
												<view class="checkbox-icon">
													<uni-icons type="checkmarkempty" size="14"
														color="#ffffff"></uni-icons>
												</view>
											</view>
											<view class="checkbox-con" style="margin-left: -20rpx;"><text
													style="margin-right: 20rpx;">全选</text>已选（{{lenlent_list.length}}）张
											</view>
										</view>
									</view>
									<button class="u-reset-button sub_btn red_btn"
										@click="ondownloadimage">下载图片</button>
								</view>
							</view>
						</view>
					</uni-popups>
					<!-- 商品图片下载弹框 end -->

					<!-- 首次加载 loading -->
					<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

					<!--返回顶部-->
					<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
					<!-- 商品详情页红包条（所有端统一在页面层渲染，不影响底部按钮布局） -->
					<!-- <sys-coupon></sys-coupon> -->
					<!-- 遮罩层 -->
					<view v-if="photo_show">
						<view class="cover" catchtouchmove="true"></view>
						<view class="wxshare_y" style="background-color: #ffffff;">
							<view style="font-size: 38rpx;margin: 50rpx 50rpx 0rpx 50rpx;text-align: center;">温馨提示
							</view>
							<view style="font-size: 28rpx;margin: 50rpx;text-align: center;">是否打开拍照/相册服务功能</view>
							<view style="display: flex;flex-direction: row;margin-bottom: -20rpx;">
								<view class="add_box3_buy_1_s" @click="photo_showNo">取消</view>
								<view class="add_box3_buy_1_y" @click="photo_showYes">确定</view>
							</view>
						</view>
					</view>

				</view>

			</x-skeleton>
			<x-skeleton type="text" :loading="loading2">
				<view></view>
			</x-skeleton>
		</view>
		<x-skeleton type="text" :loading="loading2" :configs="customConfigs">
			<view></view>
		</x-skeleton>
	</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	// import uniNavBar from '@/components/uni-nav-bar.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import imagePath from '@/common/imageRemotePath.js';

	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniCountdown from '@/components/uni-countdown.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	/*地区选择组件*/
	// import dscRegion from '@/components/dsc-region.vue';

	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'

	// 猜你喜欢组件
	import dscProductList from '@/components/dsc-product-list.vue';

	import dscCopyright from '@/components/dsc-copyright/dsc-copyright.vue'

	import skeleton from '@/components/skeleton/skeleton.vue'
	import sysCoupon from '@/components/sys-coupon.vue'
	import permision from "@/common/permission.js";
	import {
		filter
	} from '../../components/jyf-parser/libs/config';
	import createPageTrackMixin from '@/common/mixins/pageTrackMixin.js';
	// import waterfall from '@/pagesD/components/waterfall.vue'
	let timerId = null;

	// 仅作用于优惠弹窗内「限时抢购」卡片（含倒计时 / 已结束置灰）；不影响商详外侧档期展示
	const GOODS_DETAIL_TEST_FLASH_SALE = false;
	const GOODS_DETAIL_TEST_FLASH_SALE_ENDED = false;

	export default {
		mixins: [createPageTrackMixin('goods')],
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				return {
					title: this.goodsDetail.goods_name,
					path: '/pagesC/goodsDetail/goodsDetail?id=' + this.goodsDetail.goods_id + '&parent_id=' + uni
						.getStorageSync("user_id")
				};
			} else {
				return {
					title: this.goodsDetail.goods_name,
					path: '/pagesC/goodsDetail/goodsDetail?id=' + this.goodsDetail.goods_id + '&parent_id=' + uni
						.getStorageSync("user_id")
				};
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
				title: this.goodsDetail.goods_name,
				query: {
					key: 'id=' + this.goodsDetail.goods_id
				},
				imageUrl: this.goodsDetail.goods_img
			};
		},
		components: {
			jyfParser,
			uniPopup,
			uniPopups,
			uniIcons,
			uniCountdown,
			uniLoadMore,
			// dscRegion,
			dscFilterTop,
			dscProductList,
			dscCopyright,
			skeleton,
			sysCoupon,
			// uniNavBar,
			// waterfall,
		},
		data() {
			return {
				imagePath: imagePath,
				requestStage: 1, // 1:核心阶段, 2:次要阶段, 3:延迟阶段
				videoInitialized: false,
				videoLoadTimer: null,
				processingCount: 0,
				requestQueue: [],
				maxConcurrentRequests: 3,
				scrollTimer: null,
				current: 0,
				currSwiperPic: 0,
				videoPlaying: false,
				videoContext: null,
				autoplayVideo: true, // 默认自动播放
				screenDirection: 0, // 屏幕方向：0-竖屏，90/-90-横屏
				touchData: {
					startX: 0,
					startY: 0,
					startTime: 0,
					isSwiping: false
				},
				currentTab: 'video',

				videoReady: false,
				imagesReady: false,
				timeDifference: '',
				isOverflow: false,
				loading1: true,
				loading2: true,
				allImgs: [],
				showSkeleton: true,
				goodsId: '',
				currNav: 0,
				currSwiperPic: 0,
				isFooterDataLoaded: false, // 底部按钮数据是否加载完成
				old: {
					scrollTop: 0
				},
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0,
					/** 优惠弹窗 scroll 区高度 = 面板高 - 底部关闭按钮行，避免滚动露白 */
					discountBd: 0,
					/** 按内容测量后的优惠弹窗总高度（px），0 表示未测到时用 hd */
					discountSheetTotalPx: 0,
					/** 按内容测量后的 scroll 区高度（px），0 表示用 discountBd / bd */
					discountScrollPx: 0
				},
				vw: 375,
				menuButtonInfo: {},
				currGoodsList: 0,
				reCurSwipeItem: 0,
				rgba: 'rgba(0,0,0,0)',
				navIconRgba: 'rgba(0,0,0,0.4)',
				followIconRgba: 'rgba(249,31,40,0.4)',
				navOpacity: 0,
				showShortcut: false,
				isShowStockout: true,
				dscLoading: true,
				isViewMore: false,
				isAddress: false,
				showVideo: false,
				flag: true,
				currAddressSwiper: 0,
				collectStatus: 0,
				followShopStatus: 0,
				goodsDetail: {
					// 常用字段统一兜底，避免首屏/缺字段导致模板或computed崩溃
					fittings: [],
					volume_price_list: [],
					goods_services_label_show: [],
					goods_services_label: [],
					goods_certificate_list: [],
					goods_article_list: [],
					attr_parameter: [],
					attr: [],
					attr_pn_list: [],
					consumption: [],
					goods_promotion: []
				},
				goodsCouponList: [],
				lastScrollTop: 0, // 记录上一次的滚动位置
				isTransparent: false, // 标记状态栏是否为透明状态
				couponLst: {}, //店铺新人优惠信息（用于展示）
				couponLstMoney: '',
				newUserCouponList: [], // 新人券完整列表（用于价格计算，来自 api/coupon/coupon）
				discountInfo: [], // 优惠信息列表，来自 api/goods/attrprice 接口的 discount_info 字段
				couponPrice: 0, //优惠后的价格
				surplusCreditLine: false, //先采后付0元下单
				goodsCarType: false, //判断先采后付 是购物车的状态
				ten_fake_text: '',
				goodsComment: [],
				addressList: [],
				selectRegionArr: [],
				selectedColor: '', // 默认选中
				skuType: false,
				onCurrentCountNum: 0,
				history: {}, // 存储格式：{ "颜色ID_规格ID": 数量 }
				selectionHistory: {},
				totalQuantity: 0,
				totalPrice: 0,
				skuMap: this.generateSkuMap(),
				product_num: 0,
				seleceGoodsAtrrArray: [], // 选中的颜色和尺码ID
				attrLength: 0, // 规格数量1 ，显示数量按钮 ，大于1 在每条商品后显示
				specificationBtnType: false,
				regionList: [],
				friendDis: [],
				recommentTabs: [],
				goodsGuessList: [],
				guessList: [],
				onguessList: [], //当前最新的十条数据
				loadMoreStatus: 'loading',
				isOver: false,
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				commentTotal: {},
				shopDetail: {},
				search_keywords: [],
				storeRate: 0,
				goodsNum: 1,
				minNum: 1,
				xiangouNum: 1,
				scrollTopObj: {},
				navBar: [{
						title: this.$t('lang.goods')
					},
					{
						title: this.$t('lang.comment')
					},
					{
						title: this.$t('lang.detail')
					},
					{
						title: this.$t('lang.recommend')
					}
				],
				shortcutData: [],
				shareImgShow: false,
				shareImgShow_1: false,
				mpShareImg: '',
				regionLoading: false,
				addressRadio: '',
				regionGoodsPirceFormated: '',
				regionGoodsNumberFormated: '',
				storeBtn: false,
				addType: '',
				addCartClass: false,
				attrColorIndex: 0,
				current: 0,
				scrollState: false,
				scene: uni.getStorageSync("scene"),
				isChannelsLive: false,
				//微信小程序客服
				wxappChat: uni.getStorageSync("configData").wxapp_chat || 0,

				isComment: false, // 评价是否显示 
				page: 1,
				size: 10,
				// newAttr :[]

				affiliate_infovalue: '', // 优惠折扣
				is_discount: 0, // 是否支持会员打折

				main_image_list: [],
				attr_image_list: [],
				detail_image_list: [],

				lenlent_list: [],

				main_image_list_checked: false,
				attr_image_list_checked: false,
				detail_image_list_checked: false,
				image_list_all_checked: false,

				photo_show: false,

				regionSplic: '请选择',
				regionData: {},
				words: [],
				currentIndex: 0,
				pauseType: false,
				waterfallConfigs: {
					gridColumns: 1, //列数
					headHeight: '700rpx', //head高度
					textRows: 1,
				},
				deviceInfo: null, // 存储设备信息
				iosBottom: false,
				// Android 键盘收起补丁：记录当前编辑的数量输入框上下文（仅 Android 使用）
				countInputFocusContext: null,
				countInputLastValue: '',
				customConfigs: {

					textShow: true, //文本是否展示
					textRows: 5, //文本的行数
					textRowsGap: '12rpx', //文本间距
					textWidth: ['100%', '100%', '100%', '100%', '100%'], //文本的宽度，可以为百分比，数值，带单位字符串等，可通过数组传入指定每个段落行的宽度
					textHeight: ['100rpx', '100rpx', '100rpx', '100rpx', '150rpx'], //文本的高度，可以为数值，带单位字符串等，可通过数组传入指定每个段落行的高度
					textBorderRadius: '6rpx', //文本的圆角，支持百分比
				},
			};
		},
		computed: {
			// 视频按钮样式（根据 showVideo 动态生成，完全按照图集模式样式）
			videoBtnStyle() {
				const baseStyle = 'height: 52rpx; line-height: 52rpx; border-radius: 26rpx; text-align: center; font-size: 24rpx; white-space: nowrap;';
				if (this.showVideo) {
					// 激活状态：浅粉色背景，黑色文字（完全按照 .switch_btn.active）
					return baseStyle + ' background-color: #FFEDED; color: #1B1B1B;';
				} else {
					// 非激活状态：半透明白色背景，白色文字（完全按照 .switch_btn）
					return baseStyle + ' background-color: rgba(255, 255, 255, 0.3); color: rgba(255, 255, 255, 0.8);';
				}
			},
			// 图集按钮样式（根据 showVideo 动态生成，完全按照图集模式样式）
			imagesBtnStyle() {
				const baseStyle = 'height: 52rpx; line-height: 52rpx; border-radius: 26rpx; text-align: center; font-size: 24rpx; white-space: nowrap;';
				if (!this.showVideo) {
					// 激活状态：浅粉色背景，黑色文字（完全按照 .switch_btn.active）
					return baseStyle + ' background-color: #FFEDED; color: #1B1B1B;';
				} else {
					// 非激活状态：半透明白色背景，白色文字（完全按照 .switch_btn）
					return baseStyle + ' background-color: rgba(255, 255, 255, 0.3); color: rgba(255, 255, 255, 0.8);';
				}
			},
			// 月日方法
			formatWithRegExp() {
				if (this.shopDetail.stop_send_date && this.shopDetail.stop_send_date.length > 0) {
					let dateStr = this.shopDetail.stop_send_date
				
					if (dateStr) {
						const [monthPart, dayPart] = dateStr.split('月');
						const month = parseInt(monthPart).toString(); // 去除前导零
						const day = dayPart.replace('日', '');
						return `${month}.${day}`; //
					} else {
						return
					}
				}

			},
			bottomValue() {
			

				if (!this.deviceInfo) return '100rpx';

				// 优先使用条件编译判断平台
				let platformType = '';
				// #ifdef MP-WEIXIN
				platformType = 'mp-weixin';
				// #endif
				// #ifdef APP-PLUS
				platformType = 'app';
				// #endif
				// #ifdef H5
				platformType = 'H5';
				// #endif

				const {
					system
				} = this.deviceInfo;
				const isIOS = system.includes('iOS') || system.includes('iPhone OS');
				const isAndroid = system.includes('Android');

				// 平台判断
				if (platformType === 'mp-weixin') {
					
					// 【修复】根据 isIOS 设置 iosBottom，而不是总是 true
					this.iosBottom = isIOS;
					return isIOS ? '150rpx' : '115rpx'; // 统一小程序样式
				} else if (platformType === 'app') {
					
					// iOS 平台也需要设置 bottom
					if (isIOS) {
						this.iosBottom = true;
					} else {
						this.iosBottom = false;
					}
					return isIOS ? '100rpx' : '120rpx'; // APP 样式
				}

				if (platformType === 'H5') {
					
					return '100rpx';
				}

				// 兼容旧版本：降级检测逻辑
				const {
					platform
				} = this.deviceInfo;
				if (platform === 'ios' || platform === 'android') {
					
					return isIOS ? '100rpx' : '125rpx';
				}

				return '100rpx'; // 默认值

			},
			// 详情页红包条用的 bottom：iOS 上略减小避免「向下过多」，与 H5 观感一致
			couponBottomInDetail() {
				const v = this.bottomValue || '';
				const m = v.match(/^(\d+(?:\.\d+)?)rpx$/);
				if (!m || !this.deviceInfo) return v;
				const { system } = this.deviceInfo;
				const isIOS = system && (system.includes('iOS') || system.includes('iPhone OS'));
				const num = parseFloat(m[1]);
				if (isIOS && num > 110) return (num - 40) + 'rpx'; // iOS 小程序 150rpx -> 110rpx，上移
				return v;
			},
			// 计算底部按钮的 bottom 值
			bottomPosition() {
				if (!this.deviceInfo) return '0rpx';
				
				const { system } = this.deviceInfo;
				const isIOS = system.includes('iOS') || system.includes('iPhone OS');
				
				// #ifdef MP-WEIXIN
				// 微信小程序：iOS 和 Android 都使用 0rpx（贴合底部），通过 padding-bottom 处理安全区域
				return '0rpx';
				// #endif
				
				// 其他平台使用原有逻辑
				return this.iosBottom ? '-55rpx' : '0rpx';
			},


			// 1
			currentWord() {
				return this.goodsDetail && this.goodsDetail.keywords ? this.goodsDetail.keywords.split(' ')[0] : '输入货源关键字';
			},
			onCurrentCount: {
				get() {
					return this.onCurrentCountNum; // 依赖状态
				},

				set(value) {

					this.onCurrentCountNum = value;
				}
			},
			// 2

			...mapState({
				shipping_fee: state => state.shopping.shipping_fee, //配送运费信息
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
					return this.$store.state.user.addressId
				},
				set(value) {
					this.$store.dispatch('userAddressDefault', {
						address_id: value
					})
				}
			},
			is_on_sale() {
				return this.goodsDetail.is_on_sale == 0 ? true : false;
			},
			is_alone_sale() {
				return this.goodsDetail.is_alone_sale == 0 ? true : false
			},
			attr() {
				return this.goodsDetail.attr ? this.goodsDetail.attr : [];
			},
			attrColorList() {
				let attr = this.attr.filter(item => item.is_checked === 1);
				let imgFile = [];

				if (attr.length > 0) {
					imgFile = attr[0].attr_key.filter(item => item.img_flie !== '');
				}
			
				return imgFile.length > 0 && attr[0].attr_key.length > 0 ? attr[0].attr_key : []
			},
			regionGoodsNumber: {
				get() {
					return this.shipping_fee.goods ? this.shipping_fee.goods.stock : 0;
				},
				set(val) {
					if (this.shipping_fee.goods) {
						this.regionGoodsNumberFormated = val;
					}
				}
			},
			// swiperData: function() {
			// 	const imglist = this.allImgs || [];
			// 	if (imglist.length == 0) imglist.push({
			// 		img_url: this.goodsDetail.goods_img
			// 	});
			// 	return imglist;
			// },
			swiperData: function() {
				const imglist = this.allImgs || [];
				if (imglist.length == 0 && this.goodsDetail.goods_img) {
					imglist.push({
						img_url: this.goodsDetail.goods_img
					});
				}
				return imglist;
			},
			totalItems() {
				let count = this.swiperData.length;
				if (this.goodsDetail.goods_video) {
					count += 1;
				}
				return count;
			},
			getImageIndex() {
				return (index) => {
					if (this.goodsDetail.goods_video) {
						return index - 1;
					}
					return index;
				}
			},
			goodsQrcodDaTa: function() {
				const qrcod_list = this.goodsDetail.goods_qrcod_list || [];
				return qrcod_list;
			},
			videoPoster: function() {
				return this.swiperData.length > 0 ? this.swiperData[0].img_url : '';
			},
			goodsAttr: function() {

				return this.goodsDetail.attr ? this.goodsDetail.attr : [];
			},
			serviceList: function() {



				if (this.goodsDetail.goods_services_label && this.goodsDetail.goods_services_label.length > 0) {
					// shop_promise_send=1 是否是承诺发货
					if (this.goodsDetail.shop_promise_send && this.goodsDetail.shop_promise_send == 1) {
						return this.goodsDetail.goods_services_label.filter(item => item.label_name !== '48小时晚发必赔')
							.slice(0, 2)

					} else {
						let arr
						arr = this.goodsDetail.goods_services_label.filter(item =>
							!['24小时晚发必赔', "退货包运费", "10天保价", "退货包运费", "假一赔十", '48小时晚发必赔'].includes(item.label_name)
						)
						return arr.slice(0, 2)
						// return this.goodsDetail.goods_services_label.slice(0, 3)
					}
				}
			},
			selectAttr: {

				get() {
					return this.goodsAttr.length > 0 ? this.goodsDetail.attr_name + ' ' + this.goodsNum + this
						.goodsDetail.goods_unit : this.goodsNum + this.goodsDetail.goods_unit;
				},
				set(val) {

					this.goodsDetail.attr_name = val;
				}
			},
			goodsRate() {
				return this.goodsDetail.goods_rate
			},
			goodsPnList() {
				return this.goodsDetail.attr_pn_list
			},
			discountsData: function() {
				let arr = [];
				
				// 方案2：强制访问 goodsCouponList，确保依赖追踪
				const couponList = this.goodsCouponList || [];

				// 检查优惠券数据
				if (couponList.length > 0) {
					arr.push({
						acttype: 0,
						label: '',
						value: couponList
					});
				}

				// if (this.couponLst) {
				// 	arr.push({
				// 		acttype: -1,
				// 		label: this.$t('lang.reduction_new_person'),
				// 		value: 0
				// 	})
				// }
				if (this.goodsDetail.consumption && this.goodsDetail.consumption.length > 0) {
					let consumption = ''
					let str = ''
					this.goodsDetail.consumption.forEach(v => {
						str = this.$t('lang.man') + v.cfull + this.$t('lang.minus') + v.creduce
						consumption += str + ','
					});
					arr.push({
						acttype: 1,
						label: this.$t('lang.full_reduction'),
						value: consumption.substr(0, consumption.length - 1)
					})
				};
				if (this.goodsDetail.goods_promotion && this.goodsDetail.goods_promotion.length > 0) {
					this.goodsDetail.goods_promotion.forEach((raw) => {
						const item = {
							...raw
						};
						const actType = Number(item.act_type);
						if (actType === 0) {
							item.label = this.$t('lang.with_a_gift');
							item.value = item.act_name;
							item.acttype = 3;
							arr.push(item);
						} else if (actType === 1) {
							item.label = this.$t('lang.full_reduction');
							item.value = item.act_name;
							item.acttype = 1;
							arr.push(item);
						} else if (actType === 2) {
							item.label = this.$t('lang.discount');
							item.value = item.act_name;
							item.acttype = 2;
							arr.push(item);
						}
					});
				};
				if (this.goodsDetail.give_integral > 0 && this.goodsDetail.show_give_integral == 1) {
					arr.push({
						acttype: 4,
						label: this.$t('lang.label_give_integral_2'),
						value: `${this.$t('lang.buy_the_product_as_a_gift')}${this.goodsDetail.give_integral}${this.$t('lang.integral')}`
					})
				};
				if (this.goodsDetail.integral > 0) {
					arr.push({
						acttype: 5,
						label: this.$t('lang.points_deduction'),
						value: `${this.$t('lang.you_can_use_up_to')}${this.goodsDetail.integral}${this.$t('lang.integral')}`
					})
				};
				if (this.goodsDetail.volume_price_list && this.goodsDetail.volume_price_list.length > 0) {
					let volumePrice = '';
					this.goodsDetail.volume_price_list.forEach(item => {
						volumePrice +=
							`${this.$t('lang.the_purchase_of_this_product_is_full')}${item.number}${this.$t('lang.jian')}，${this.$t('lang.the_purchase_of_this_product_is_full_2')} ${item.format_price} \n`
					});
					arr.push({
						acttype: 6,
						label: this.$t('lang.buy_more_discount'),
						value: volumePrice
					});
				};
				
				return arr;
			},
			//包含 赠送积分以及优惠券内容的 接口
			formatDiscountsData: function() {
				let result;
				if (this.discountsData.length > 6) {
					result = this.discountsData.slice(0, 3);
				} else {
					result = this.discountsData;
				}
				return result;
			},
			// 获取所有优惠券列表（包括包邮券），用完整 discountsData 避免 formatDiscountsData 截断后拿不到券
			filteredCoupons: function() {
				for (let activityItem of this.discountsData || []) {
					if (activityItem.acttype == 0 && activityItem.value) {
						return activityItem.value;
					}
				}

				return [];
			},
			/** 商详外侧：是否在促销档期内（仅绑定 promote_*，不受弹窗测试开关影响） */
			hasRealPromoteSchedule() {
				const g = this.goodsDetail;
				return !!(g && Number(g.promote_end_date) > 0 && Number(g.promote_start_date) > 0);
			},
			/** 优惠弹窗是否展示「限时抢购」卡片（真实档期或 GOODS_DETAIL_TEST_FLASH_SALE） */
			showFlashSaleInDiscountPopup() {
				return GOODS_DETAIL_TEST_FLASH_SALE || this.hasRealPromoteSchedule;
			},
			/** 促销结束时间（秒）；弹窗倒计时用。测试开时返回模拟值，不影响外侧 dateTime */
			effectivePromoteEndSec() {
				if (GOODS_DETAIL_TEST_FLASH_SALE) {
					if (GOODS_DETAIL_TEST_FLASH_SALE_ENDED) {
						return Math.floor(Date.now() / 1000) - 3600;
					}
					return Math.floor(Date.now() / 1000) + 180;
				}
				const v = this.goodsDetail && this.goodsDetail.promote_end_date;
				return Number(v) || 0;
			},
			/** 与 uni-countdown 一致的结束时刻（本地解析 $formatDateTime 结果） */
			promoteEndDisplayMs() {
				const sec = this.effectivePromoteEndSec;
				if (!sec) return 0;
				const str = this.$formatDateTime(sec);
				const reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
				const res = str.match(reg);
				if (!res) return 0;
				return new Date(
					parseInt(res[1], 10),
					parseInt(res[2], 10) - 1,
					parseInt(res[3], 10),
					parseInt(res[4], 10),
					parseInt(res[5], 10),
					parseInt(res[6], 10)
				).getTime();
			},
			/** 弹窗内黑底倒计时：与 effectivePromoteEndSec 对齐 */
			flashPopupCountdownStr() {
				const sec = this.effectivePromoteEndSec;
				if (!sec) return '';
				return this.$formatDateTime(sec);
			},
			isPromoteFlashCountdownActive() {
				if (!this.showFlashSaleInDiscountPopup) return false;
				const ms = this.promoteEndDisplayMs;
				return ms > 0 && Date.now() < ms;
			},
			isPromoteFlashEnded() {
				if (!this.showFlashSaleInDiscountPopup) return false;
				const ms = this.promoteEndDisplayMs;
				return ms > 0 && Date.now() >= ms;
			},
			/** 弹窗「可省」：优先已优惠字段，否则原价与抢购价差额 */
			flashPopupSaveYuan() {
				const y = this.goodsDetail && this.goodsDetail.youhui_price;
				if (y !== undefined && y !== null && y !== '') {
					const n = Number(y);
					if (!isNaN(n) && n > 0) return +n.toFixed(2);
				}
				const promo = parseFloat(String(this.flashSaleLinePromo).replace(/,/g, ''));
				const orig = parseFloat(String(this.flashSaleLineOrigin).replace(/,/g, ''));
				if (!isNaN(promo) && !isNaN(orig)) return Math.max(0, +(orig - promo).toFixed(2));
				return 0;
			},
			flashSaleLinePromo() {
				if (GOODS_DETAIL_TEST_FLASH_SALE) return '191.20';
				const g = this.goodsDetail;
				if (!g) return '';
				if (g.shop_price_formated) {
					return String(g.shop_price_formated).replace(/[¥￥\s,]/g, '');
				}
				return g.shop_price != null ? String(g.shop_price) : '';
			},
			flashSaleLineOrigin() {
				if (GOODS_DETAIL_TEST_FLASH_SALE) return '239.00';
				const g = this.goodsDetail;
				if (!g) return '';
				return g.marketPrice != null ? String(g.marketPrice) : '';
			},
			/** 限时优惠：后台「折扣」类促销 acttype:2 */
			limitedTimeDiscountRows() {
				return (this.discountsData || []).filter(a => a.acttype == 2);
			},
			/** 详情价签：新人价 / 券后 / 不展示（与优惠弹层逻辑一致） */
			priceTagLabel() {
				if (!this.goodsDetail || !this.goodsDetail.shop_price) return '';
				const newUser = Number(this.goodsDetail.new_member_price) === 1 ||
					(this.couponLst && Object.keys(this.couponLst).length > 0);
				if (newUser) return '新人价';
				const list = this.goodsCouponList || [];
				if (list.length > 0) return '券后';
				return '';
			},
			/** 优惠弹层总高上限（px）：设计 660px，且不超过可视区 95%（660px ≈ 1320rpx 以 375 逻辑宽推算，封顶仍按物理 px 控制） */
			discountSheetCapPx() {
				const sys = uni.getSystemInfoSync();
				return Math.min(660, Math.floor((sys.windowHeight || 667) * 0.95));
			},
			discountSheetPanelStyle() {
				const cap = this.discountSheetCapPx;
				const fallback = this.popHeight.hd > 0 ? this.popHeight.hd : cap;
				const raw = Number(this.popHeight.discountSheetTotalPx) || 0;
				let h = raw > 0 ? raw : fallback;
				if (h > cap) h = cap;
				return {
					height: `${h}px`,
					maxHeight: `${cap}px`
				};
			},
			discountSheetScrollStyle() {
				const scrollPx = Number(this.popHeight.discountScrollPx) || 0;
				const fallback = this.popHeight.discountBd > 0 ? this.popHeight.discountBd : this.popHeight.bd;
				const h = scrollPx > 0 ? scrollPx : fallback;
				return { height: `${h}px` };
			},
			/** 优惠弹窗头部「可省」金额展示 */
			discountSheetSavedYuan() {
				const y = this.goodsDetail && this.goodsDetail.youhui_price;
				if (y === undefined || y === null || y === '') return '0';
				return String(y);
			},
			/** 满减多行（consumption 与促销满减合并拆行，无进度条仅文案） */
			fullReductionPopupLines() {
				const lines = [];
				(this.discountsData || []).filter(a => a.acttype == 1).forEach(a => {
					String(a.value || '').split(/[,，]/).forEach(s => {
						const t = s.trim();
						if (t) lines.push(t);
					});
				});
				return lines;
			},
			/** 满赠活动行（圆点列表样式） */
			giftPromotionRows() {
				return (this.discountsData || []).filter(a => a.acttype == 3);
			},
			/** 多买优惠弹窗多行（acttype:6） */
			volumeDiscountPopupLines() {
				const lines = [];
				(this.discountsData || []).filter(a => a.acttype == 6).forEach(a => {
					String(a.value || '').split(/\n/).forEach(s => {
						const t = s.trim();
						if (t) lines.push(t);
					});
				});
				return lines;
			},
			spare_price: function() {
				if (this.goodsDetail.fittings && this.goodsDetail.fittings[0]) return this.goodsDetail.fittings[0]
					.spare_price
				else return '¥0.00'
			},
			activityData: function() {
				let arr = [];
				
				if (this.goodsDetail.goods_promotion && this.goodsDetail.goods_promotion.length > 0) {
					this.goodsDetail.goods_promotion.forEach(item => {
						if (item.type == 'group_buy') {
							item.label = this.$t('lang.group_buy');
							item.value = this.$t('lang.in_group_buying_activities');
							item.acttype = 0;
							item.path = `/pagesA/groupbuy/detail/detail?id=${item.act_id}`;
							arr.push(item)
						} else if (item.type == 'auction') {
							item.label = this.$t('lang.auction');
							item.value = this.$t('lang.the_goods_are_being_auctioned');
							item.acttype = 1;
							item.path = `/pagesA/auction/detail/detail?act_id=${item.act_id}`;
							arr.push(item);
						} else if (item.type == 'team') {
							item.label = this.$t('lang.team');
							item.value = this.$t('lang.participating_in_group_activities');
							item.acttype = 3;
							item.path = `/pagesA/team/detail/detail?goods_id=${item.goods_id}`
							arr.push(item);
						} else if (item.type == 'bargain') {
							item.label = this.$t('lang.bargain');
							item.value = this.$t('lang.participating_in_bargaining_activities');
							item.acttype = 4;
							item.path = `/pagesA/bargain/detail/detail?id=${item.bargain_id}`;
							arr.push(item);
						}else if (item.type == 'favourable') {
							// 限时   折扣
							item.label = this.$t('lang.favourable');
							item.value = this.$t('lang.participating_in_bargaining_activities');
							item.acttype = 2;
							item.path = `/pagesA/bargain/detail/detail?id=${item.bargain_id}`;
							arr.push(item);
						}
						
					})
				};

				if (this.goodsDetail.fittings && this.goodsDetail.fittings.length > 0) {
					// 暂不开发
					arr.push({
						acttype: 2,
						label: this.$t('lang.discount_package'),
						value: `${this.$t('lang.the_goods_are_in_common')}${this.tabList}${this.$t('lang.special_package')}`,
						path: `/pagesC/goodsDetail/setmeal?id=${this.goodsId}`
					})
				};
				
				return arr;
			},
			tabList: function() {
				let i = 0,
					a = 0,
					length = 0,
					arr = [];
				if (!this.goodsDetail.fittings) return 0;
				this.goodsDetail.fittings.forEach(v => {
					if (v.group_id == 1) {
						i++
					} else {
						a++
					}
				});

				arr = [i, a]
				arr.forEach(v => {
					if (v > 0) {
						length++
					}
				})
				return length
			},
			moreAttr: function() {
				let num = 0;
				if (this.goodsDetail.attr_parameter) {
					if (this.goodsDetail.show_brand == 1) num += 1;
					if (this.goodsDetail.show_goodsweight == 1) num += 1;
					if (this.goodsDetail.show_addtime == 1) num += 1;
					num += this.goodsDetail.attr_parameter.length;
				}
				return num > 5 ? true : false;
			},
			freight() {
				var that = this
				var abc = ''
				if (that.regionSplic && that.regionSplic != '请选择' && this.shipping_fee.mian_free_money) {
					abc = this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee
						.shipping_fee_formated + '（满' + this.shipping_fee.mian_free_money + '包邮）' : this.$t(
							'lang.is_shipping_area')
				} else if (that.regionSplic && that.regionSplic != '请选择') {
					abc = this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee
						.shipping_fee_formated : this.$t(
							'lang.is_shipping_area')
				} else {
					abc = '选择收货地址后查看'
				}
				return abc
			},
			freeShipping() {
				return this.shipping_fee != null && this.shipping_fee.free_shipping ? this.shipping_fee.free_shipping : 0;
			},
			dateTime: function() {
				const g = this.goodsDetail;
				const dataTime = g && g.promote_end_date;
				if (dataTime) {
					return this.$formatDateTime(dataTime);
				}
				return '';
			},
			btnBuyText: function() { //购买按钮文案

				let defBuyText = '立即购买';

				if (this.goodsDetail.surplus_credit_line > Number(this.goodsDetail.shop_price * 1)) {
					defBuyText = '先用后付¥0';
					this.goodsCarType = true;
					// 记录先用后付的状态
					this.surplusCreditLine = true;
				} else if (this.isOneShipping) {
					defBuyText = '一件包邮'
				} else if (this.goodsDetail.is_shipping == 1 || this.freeShipping == 1) {
					defBuyText = '包邮'
				} else if (this.goodsDetail.minimum == 1) {
					defBuyText = '一件代发'
				} else if (this.shopDetail.expect_send_time) {
					defBuyText = this.shopDetail.expect_send_time;
				}
				return defBuyText;
			},
			isOneShipping: function() { //是否一件包邮
				if (this.minNum == 1 && (this.goodsDetail.is_shipping == 1 || this.freeShipping == 1)) {
					return true;
				}
				return false;
			},
			/** 一件起批说明：须与外层 promo-tag 完全一致，仅用 huodong_list_tip.one_daifa_tip（勿用 isOneShipping，那是「一件包邮」另一套条件） */
			showOneDaifaParcelTip() {
				return !!(this.goodsDetail.huodong_list_tip && this.goodsDetail.huodong_list_tip.one_daifa_tip);
			},
			isRuturnShippingfee: function() { //是否有退货包运费服务
				let goods_services_labelList = this.goodsDetail.goods_services_label || [];
				let items = goods_services_labelList.filter((item) => {
					if (item.label_name == '退货包运费') {
						return true;
					}
				})
				return items.length > 0;
			},
			isTenForFake: function() { //假一赔十

				let goods_services_labelList = this.goodsDetail.goods_services_label || [];
				let items = goods_services_labelList.filter((item) => {
					if (item.label_name == '假一赔十') {
						this.ten_fake_text = item.label_explain;
						return true;
					}
				})
				return items.length > 0;

			},
			// expect_send_time 预计发货时间
			is24Time: function() { //24小时 48小时			
				let time = {};
				let goods_services_labelList = this.goodsDetail.goods_services_label || [];
				goods_services_labelList.forEach(val => {
					if (val.label_name_alias == '承诺24小时发货') {
						time.num = 24,
							time.str = val.label_name_alias
						time.label = val.label_explain
						// time.strRight = '预计24小时发货'
						return time;
					} else if (val.label_name_alias == '承诺48小时发货') {

						time.num = 48,
							time.str = val.label_name_alias
						time.label = val.label_explain
						// time.strRight = '预计48小时发货'
						return time;
					}
				});

				return time;
			}
		},
		mounted() {
			// 如果有视频，默认播放视频
			if (this.goodsDetail.goods_video) {
				this.$nextTick(() => {
					this.videoContext = uni.createVideoContext('goodsVideo', this);
					this.videoContext.play();
				});
			}
		},
		onShow() {
			var that = this
			// 检测当前屏幕方向
			const { windowWidth, windowHeight } = uni.getSystemInfoSync();
			this.screenDirection = windowWidth > windowHeight ? 90 : 0;
			
			this.$store.dispatch('userAddress');
			uni.request({
				url: that.websiteUrl + '/api/set/isComment',
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token')
				},
				data: {
					brand: uni.getSystemInfoSync().brand
				},
				success: (res) => {
					let data = res.data;
					if (data.status == "success") {
						if (data.data == 1) {
							that.isComment = true
						}
					}
				},
				fail: (err) => {
					console.error(err)
				}
			});
			if (that.$isLogin()) {
				// 用户信息
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
					},
					fail: (err) => {
						console.error(err)
					}
				})
			}
			// that.$store.dispatch('userAddress');
			if (that.$isLogin()) {
				that.getAddressList();
			}
		},
		onLoad(e) {
			let that = this;
			that.goodsId = e.id || '';
			// 第一阶段：核心数据
			that.loadEssentialData();

			// #ifdef MP-WEIXIN
			that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// #endif
		    // 在所有平台统一初始化菜单
		    this.initShortcutData();



			//直播间商品
			if (e.room_id) {
				that.goodsId = e.id;
			}

			//小程序扫码
			if (e.scene) {
				let scene = decodeURIComponent(e.scene);
				let fristParameter = scene.split('_')[0];
				let lastParameter = scene.split('_')[1];

				// 判断分割第一个参数是否有 "."
				that.goodsId = fristParameter.indexOf('.') > 0 ? fristParameter.split('.')[0] : fristParameter;

				if (lastParameter) {
					uni.setStorageSync('parent_id', lastParameter);
				}
			}

			if (e.parent_id) {
				uni.setStorageSync('parent_id', e.parent_id);
			}

			//视频号商品判断
			if (uni.getStorageSync('mediaLive')) {
				let media_goods_id = uni.getStorageSync('mediaLive').goods_id;
				media_goods_id = typeof(media_goods_id) != 'string' ? media_goods_id.toString() : media_goods_id;
				that.isChannelsLive = (media_goods_id.indexOf(that.goodsId) > -1) && (uni.getStorageSync('mediaLive')
					.is_live == 1) ? true : false
			}
		},
		onReady() {
			const sys = uni.getSystemInfoSync();
			const windowHeight = sys.windowHeight;
			const windowWidth = sys.windowWidth;
			this.vw = windowWidth;
			const hd = parseInt(windowHeight * 0.65);
			let safeBottom = 0;
			if (sys.safeAreaInsets && typeof sys.safeAreaInsets.bottom === 'number') {
				safeBottom = sys.safeAreaInsets.bottom;
			} else if (sys.safeArea && typeof sys.screenHeight === 'number' && typeof sys.safeArea.bottom === 'number') {
				safeBottom = Math.max(0, sys.screenHeight - sys.safeArea.bottom);
			}
			// 优惠弹窗底部：关闭按钮 + 上下间距（与 coupon_close_btn_box 一致）
			const discountFootPx = uni.upx2px(88 + 32 + 32 + 48) + safeBottom;
			// 橙色头图区高度（与 .disc-sh-hd 内边距+条+价格区 roughly 对齐），面板 = 头 + scroll + 底栏
			const discountHeadPx = uni.upx2px(268);
			this.$set(this.popHeight, 'hd', hd);
			this.$set(this.popHeight, 'bd', hd - uni.upx2px(90));
			this.$set(this.popHeight, 'center', hd - uni.upx2px(190));
			this.$set(this.popHeight, 'discountBd', Math.max(hd - discountFootPx - discountHeadPx, uni.upx2px(200)));
			
			// 检测当前屏幕方向：宽度大于高度说明是横屏
			this.screenDirection = windowWidth > windowHeight ? 90 : 0;

			// 仅 Android：监听键盘收起，在 blur 不触发时补执行数量计算
			if (this._isAndroidApp()) {
				this._keyboardHeightHandler = (res) => {
					if (res.height !== 0) return;
					const ctx = this.countInputFocusContext;
					if (!ctx) return;
					const { attrItem } = ctx;
					const syntheticEvent = { detail: { value: this.countInputLastValue } };
					this.changeGoodsNumByInput(syntheticEvent, attrItem);
					this.countInputFocusContext = null;
				};
				uni.onKeyboardHeightChange(this._keyboardHeightHandler);
			}
		},
		onUnload() {
			if (this._keyboardHeightHandler) {
				uni.offKeyboardHeightChange(this._keyboardHeightHandler);
				this._keyboardHeightHandler = null;
			}
		},
		onPageScroll(e) {
			this.scrollState = e.scrollTop > 800 ? true : false
			// console.log(e.scrollTop)
			this.old.scrollTop = e.scrollTop;
			// 导航栏背景渐变
			const ratio = (e.scrollTop / uni.upx2px(375)).toFixed(1);
			if (ratio >= 1) {
				this.rgba = 'rgba(251,251,251,1)';
				this.navIconRgba = 'rgba(251,251,251,1)';
				this.followIconRgba = 'rgba(251,251,251,1)';
				this.navOpacity = 1;
			} else if (ratio > 0) {
				this.rgba = `rgba(251,251,251,${ratio})`;
				if (ratio > 0.5) {
					this.navIconRgba = `rgba(0,0,0,${1 - ratio})`;
					this.followIconRgba = `rgba(249,31,40,${1 - ratio})`;
				};
				this.navOpacity = ratio;
			} else {
				this.rgba = 'rgba(0,0,0,0)';
				this.navIconRgba = 'rgba(0,0,0,0.4)';
				this.followIconRgba = 'rgba(249,31,40,0.4)';
				this.navOpacity = 0;
			}
			// console.log('navOpacity', this.navOpacity)
			if (this.showShortcut) this.showShortcut = false;

			// this.navigationTracking();

			if (this.flag) this.computedElTop();

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.goods-detail-guess').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				if (res && res.height && a.screenHeight) {
					let t_height = res.height - a.screenHeight
					var that = this
					if (t_height <= to_scroll_top) {
						that.loadMoreStatus = 'loading';
						if (that.page * that.size == that.guessList.length) {
							that.page++
							that.getGuessList()
						}
					}
				}

			}).exec()
		},
		onReachBottom() {
			var that = this
			if (that.page * that.size == that.guessList.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				that.getGuessList()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		watch: {
			'goodsDetail.goods_video': {
				handler(newVal) {
					if (newVal) {
						this.$nextTick(() => {
							setTimeout(() => {
								this.initVideoContext();
							}, 100);
						});
					}
				},
				immediate: true
			},
			// 监听视频播放状态变化
			videoPlaying(newVal) {
				if (newVal) {
					// 开始播放视频，切换到视频播放项
					this.current = 0; // 视频播放项总是在第一个位置
					this.currSwiperPic = 0;
				} else {
					// 视频停止播放，切换回视频封面项
					this.current = 0; // 视频封面项总是在第一个位置
					this.currSwiperPic = 0;
				}
			},
			goodsDetail() {

			},
			regionSplic() {
				this.shipping_region = {
					province_id: this.regionData.province.id,
					city_id: this.regionData.city.id,
					district_id: this.regionData.district.id,
					street_id: this.regionData.street.id
				};
				//运费
				if (this.goodsDetail) {
					this.shippingFee(this.shipping_region);
				}
			},
			shipping_fee() {
				if (this.shipping_fee.goods) {
					this.regionGoodsPirce = this.shipping_fee.goods.shop_price;
					this.regionGoodsPirceFormated = this.shipping_fee.goods.shop_price_formated;
					this.regionGoodsNumber = this.shipping_fee.goods.stock;
				}
			},
			sharePoster() {
				if (this.sharePoster) {
					this.$refs.popupPoster.open();
				}
			},
		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					this.deviceInfo = res;
					// iOS 12 兼容处理
					if (res.system.includes('iOS 12') && this.platformType === '') {
						this.platformType = res.platform === 'ios' ? 'app' : 'mp-weixin';
					}
				}
			});
		

		},

		methods: {
			// 埋点：商品页 type_id 为商品ID
			getPageTrackTypeId() {
				return this.goodsId || ''
			},
			    initShortcutData() {
				// if (this.$isLogin()) {
					
			      this.shortcutData = [
			        {
			          name: this.$t('lang.home'),
			          ico: 'iconfont icon-home-sy',
			          path: '/pages/middles/middles'
			        },
			        {
			          name: this.$t('lang.search'),
			          ico: 'iconfont icon-sousuo',
			          path: '/pagesD/search/search'
			        },
			        // {
			        //   name: this.$t('lang.category'),
			        //   ico: 'iconfont icon-home-fenlei',
			        //   path: '/pages/index/index'
			        // },
			        {
			          name: this.$t('lang.cart'),
			          ico: 'iconfont icon-home-shop',
			          path: '/pages/cart/cart'
			        },
			        {
			          name: this.$t('lang.personal_center'),
			          ico: 'iconfont icon-home-mine',
			          path: '/pages/user/user'
			        }
			      ];
			     
			      // 所有平台都添加举报菜单
			      if (this.goodsId) {
			        this.shortcutData.push({
			          name: this.$t('lang.want_report'),
			          ico: 'https://images.eqingqu.com/attachs/photo/202510/20251020_DDCD8490327C30199514AD83BA1527D5.png',
			          path: `/pagesC/report/report?id=${this.goodsId}`
			        });
			      }
				   // }
			    },
			
			
			
			  handleImageError(item) {
			  
			    // 可以设置一个默认图标
			    item.ico = 'iconfont icon-home-mine'; // 使用字体图标作为备用
			  },
			  
			  handleShortcutClick(item) {
			    // 关闭弹窗
			    this.showShortcut = false;
			    
			    // 判断是否是举报菜单项（通过 path 包含 'report' 来判断）
			    if (item.path && item.path.includes('/pagesC/report/report')) {
			      // 举报功能需要登录
			      if (!this.$isLogin()) {
			        uni.showModal({
			          content: this.$t('lang.login_user_not'),
			          success: res => {
			            if (res.confirm) {
			              uni.navigateTo({
			                url: '/pagesB/login/login?delta=1'
			              });
			            }
			          }
			        });
			        return;
			      }
			    }
			    
			    // 其他菜单项直接跳转
			    this.$outerHref(item.path, 'app');
			  },

			//  优先请求的第一屏的数据
			getFristRequest() {
			    return new Promise((resolve, reject) => {
			        var that = this
			        uni.request({
			            url: that.websiteUrl + '/api/goods/show_v1',
			            method: 'POST',
			            header: {
			                'Content-Type': 'application/json',
			                'token': uni.getStorageSync('token'),
			                'X-Client-Hash': uni.getStorageSync('client_hash')
			            },
			            data: {
			                goods_id: that.goodsId,
			                warehouse_id: 0,
			                area_id: 0,
			                is_delete: 0,
			                is_on_sale: 1,
			            },
			            success: (res) => {
							// 日志：首屏核心数据里的活动时间原始值
							console.log(
								'[goodsDetail][getFristRequest] goods_id:',
								res && res.data && res.data.data && res.data.data.goods_id,
								'promote_start_date:',
								res && res.data && res.data.data && res.data.data.promote_start_date,
								'promote_end_date:',
								res && res.data && res.data.data && res.data.data.promote_end_date
							);
						this.loading1 = false;
						this.loading2 = false;
						that.dscLoading = false
						                that.showLoadMore = true
						                that.showSkeleton = false
		            that.goodsDetail.shop_price = res.data.data.shop_price;
		            that.goodsDetail.sales_volume = res.data.data.sales_volume;
		            that.goodsDetail.goods_name = res.data.data.goods_name;
						that.goodsDetail.marketPrice = res.data.data.market_price;
						// 设置库存数量，触发按钮更新
						that.$set(that.goodsDetail, 'goods_number', res.data.data.goods_number);
						// 平台最低价
						if (res.data.data.platm_min_price !== undefined) {
							that.$set(that.goodsDetail, 'platm_min_price', res.data.data.platm_min_price);
						}
						// 【关键修复】立即设置 goods_img，让轮播图第一张图立即显示
						if (res.data.data.goods_img) {
							that.$set(that.goodsDetail, 'goods_img', res.data.data.goods_img);
						}
						
						        // 立即更新requestStage，开始后续加载
						                that.requestStage = 2;
			                resolve(res.data); // 请求成功时resolve
			            },
			            fail: (err) => {
			                console.error(err)
			                reject(err) // 请求失败时reject
			            }
			        })
			    })
			},
			
			
			async loadEssentialData() {
			    try {
			        // 第一阶段：优先请求第一屏数据
			        await this.getFristRequest();
			        
			        // 立即开始后续加载，不等待getGoodsDetailById
			        this.startSubsequentLoading();
			        
			        // 在后台执行getGoodsDetailById，不阻塞渲染
			        this.getGoodsDetailById().catch(error => {
			            console.error('商品详情加载失败:', error);
			        });
			
			    } catch (error) {
			        console.error('核心数据加载失败:', error);
			    }
			},
			
			// 开始后续加载
			startSubsequentLoading() {
			    // 第二阶段：次要数据（延迟500ms加载）
			    setTimeout(() => {
			        this.loadSecondaryData();
			    }, 500);
			
			    // 第三阶段：辅助数据（延迟1500ms加载）
			    setTimeout(() => {
			        this.loadAuxiliaryData();
			    }, 1500);
			},
		// 第二阶段：次要数据
		async loadSecondaryData() {
			const promises = [

				this.getGoodsImage(),
				this.getGoodsList()
			];

			await Promise.allSettled(promises);
				this.requestStage = 3;
			},

			// 第三阶段：辅助数据
			async loadAuxiliaryData() {
				// 这些请求可以并行执行，不阻塞用户操作
				const promises = [
					this.getImgs(),
					this.getGuessList(),
					this.loadUserInfo(),
					this.loadAddressData()
				];

				Promise.allSettled(promises);
			},

			// 用户信息相关请求
			async loadUserInfo() {
				if (!this.$isLogin()) return;

				try {
					const [commentRes, userRes] = await Promise.all([
						this.checkCommentStatus(),
						this.getUserAffiliateInfo()
					]);
					// 处理结果...
				} catch (error) {
					console.error('用户信息加载失败:', error);
				}
			},

			// 地址相关请求
			async loadAddressData() {
				if (this.$isLogin()) {
					await this.getAddressList();
				}
			},
			// 检查评论状态
			async checkCommentStatus() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.websiteUrl + '/api/set/isComment',
						method: 'GET',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						data: {
							brand: uni.getSystemInfoSync().brand
						},
						success: (res) => {
							let data = res.data;
							if (data.status == "success") {
								if (data.data == 1) {
									this.isComment = true;
								}
							}
							resolve(res.data);
						},
						fail: (err) => {
							console.error(err);
							reject(err);
						}
					});
				});
			},

			// 获取用户会员信息
			async getUserAffiliateInfo() {
				return new Promise((resolve, reject) => {
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
								for (var j = 0; j < res.data.data.user_rank_rights_list[i]
									.rights_configure.length; j++) {
									if (res.data.data.user_rank_rights_list[i].rights_configure[j]
										.name == 'user_discount') {
										this.affiliate_infovalue = res.data.data
											.user_rank_rights_list[i].rights_configure[j].value;
									}
								}
							}
							resolve(res.data);
						},
						fail: (err) => {
							console.error(err);
							reject(err);
						}
					});
				});
			},




			// 分段请求end




			switchToImages(e) {
				

				// 阻止事件冒泡
				if (e && e.stopPropagation) {
					e.stopPropagation();
				}

				this.showVideo = false;
				this.pauseVideo();

			

				// 强制刷新
				this.$forceUpdate();
			},

			// 切换到视频
			switchToVideo(e) {
				

				// 阻止事件冒泡
				if (e && e.stopPropagation) {
					e.stopPropagation();
				}

				this.showVideo = true;

				// 延迟播放视频，确保切换完成
				this.$nextTick(() => {
					setTimeout(() => {
						
						this.playVideo();
					}, 100);
				});

				// 强制刷新
				this.$forceUpdate();
			},

			initVideoContext() {
				if (this.goodsDetail.goods_video) {
					this.videoContext = uni.createVideoContext('goodsVideo', this);
					

					// 初始化后自动播放视频
					this.$nextTick(() => {
						setTimeout(() => {
							this.playVideo();
						}, 500);
					});
				}
			},



			// 播放视频
			playVideo() {
				if (this.videoContext) {
				
					this.videoContext.play();
					this.videoPlaying = true;
				}
			},

			// 暂停视频
			pauseVideo() {
				if (this.videoContext) {
					
					this.videoContext.pause();
					this.videoPlaying = false;
				}
			},

			// 视频事件
			onVideoEnd() {
				
				this.videoPlaying = false;
			},

			onVideoPlay() {
				
				this.videoPlaying = true;
			},

			onVideoPause() {
				
				this.videoPlaying = false;
			},

			videoErrorCallback(e) {
				
				this.videoPlaying = false;
			},

			// 处理全屏状态变化
			handleFullscreenChange(e) {
			
				// e.detail.fullScreen: true 表示进入全屏，false 表示退出全屏
				if (!e.detail.fullScreen) {
					// 退出全屏时，重新检测屏幕方向（因为用户可能旋转了设备）
					const { windowWidth, windowHeight } = uni.getSystemInfoSync();
					this.screenDirection = windowWidth > windowHeight ? 90 : 0;
					
				} else {
					
				}
			},

			goToPrev() {
				let prevIndex = this.current - 1;
				if (prevIndex < 0) {
					prevIndex = this.totalItems - 1;
				}
				this.current = prevIndex;
				this.currSwiperPic = prevIndex;
			},

			goToNext() {
				let nextIndex = (this.current + 1) % this.totalItems;
				this.current = nextIndex;
				this.currSwiperPic = nextIndex;
			},
			changeSwiper(e) {
				const current = e.detail.current;
				this.currSwiperPic = current;
				this.current = current;

			

				// 更新当前标签状态
				if (this.goodsDetail.goods_video) {
					if (current === 0) {
						this.currentTab = 'video';
					} else {
						this.currentTab = 'images';
					}
				}

				// 切换到视频项时自动播放视频
				if (this.goodsDetail.goods_video && current === 0) {
					this.autoplayVideo = true;
					this.$nextTick(() => {
						setTimeout(() => {
							this.playVideo();
						}, 300);
					});
				} else {
					// 切换到图片时暂停视频
					this.pauseVideo();
					this.autoplayVideo = false;
				}
			},



			// end



			convertMonthDayToTimestamp(dateStr, time = '00:00:00') {
				const currentYear = new Date().getFullYear();

				// 支持带时间的格式（如 '04月20日 14:30'）
				const [datePart, timePart] = dateStr.split(/\s+/);
				const finalTime = timePart || time;

				const cleanedDate = datePart
					.replace('月', '/')
					.replace('日', '');

				const dateObj = new Date(`${currentYear}/${cleanedDate} ${finalTime}`);

				if (isNaN(dateObj.getTime())) {
				
					return null;
				}

				return dateObj.getTime();
			},
			// 倒计时
			setDifferenceInMillisInterval(endDateStr) {
				this.clearMInterval();
				const endDate = new Date(endDateStr); // 结束日期对象
				const todayStart = new Date();
				todayStart.setHours(0, 0, 0, 0); // 当天零点

				this.mInterval = setInterval(() => {
					const now = new Date();

					// 判断是否超过结束日期
					if (now > endDate) {
						this.isShow = false;
						this.clearMInterval();
						return;
					}

					// 计算目标时间（默认为当天24点）
					let targetTime = new Date(todayStart);
					targetTime.setDate(targetTime.getDate() + 1); // 次日零点

					// 如果是结束日期当天，则使用endDate的时间
					if (now.toDateString() === endDate.toDateString()) {
						targetTime = endDate;
					}

					// 计算时间差
					let differenceInMillis = targetTime - now;

					// 时间格式化
					const hours = Math.floor(differenceInMillis / (1000 * 60 * 60)).toString().padStart(2, '0');
					const minutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60)).toString()
						.padStart(2, '0');
					const seconds = Math.floor((differenceInMillis % (1000 * 60)) / 1000).toString().padStart(2,
						'0');

					this.timeDifference = `${hours}:${minutes}:${seconds}`;
					// console.log( this.timeDifference)
				}, 1000);
			},
			clearMInterval() {
				if (this.mInterval) clearInterval(this.mInterval);
			},
			linkHref(goods_id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
			// 优惠价格
			formatPrice(num1, num2) {
				// 强制转为数值型（兼容字符串、空值、布尔值等类型）
				const number1 = isNaN(Number(num1)) ? 0 : Number(num1);
				const number2 = isNaN(Number(num2)) ? 0 : Number(num2);

				// 返回两数差值
				const result = number1 - number2;
				return parseFloat(result.toFixed(2));
			},

			// filterProductNumber() {
			// 	const pnList = this.goodsDetail.attr_pn_list; // 

			// 	for (let i = 0; i < pnList.length; i++) {
			// 		const item = pnList[i];
			// 		if (item.value.product_number < 500) {
			// 			this.product_num = item.value.product_number; // 记录符合条件的规格信息
			// 			break; // 
			// 		}
			// 	}
			// },
			filterProductNumber() {
				this.goodsDetail.attr_pn_list.forEach(item => {
					item.value.product_type = item.value.product_number > 0;
				});
			},

			// 判断当前日期的与活动日期差 
			calculatePauseDiff() {

				if (this.shopDetail.stop_send_date && this.shopDetail.stop_send_date.length > 0) {
					
					let dateStr = this.shopDetail.stop_send_date
					// 解析日期字符串
					const [month, day] = dateStr.split(/月|日/).filter(Boolean).map(Number);
					const currentYear = new Date().getFullYear();
					const startDate = new Date(currentYear, month - 1,
						day); // 创建日期对象‌:ml-citation{ref="4,5" data="citationList"}

					// 获取当前时间
					const now = new Date();

					// 判断活动状态
					if (startDate >= now) { // 活动进行中‌

						this.pauseType = true;
						return this.pauseType;
					} else {
						this.pauseType = false;
						return this.pauseType;
					}
				} else {
					return
				}


			},
			calculateHourDiff(dateStr, time) {
				// 解析日期字符串
				const [month, day] = dateStr.split(/月|日/).filter(Boolean).map(Number);
				const currentYear = new Date().getFullYear();
				const startDate = new Date(currentYear, month - 1,
					day);

				// 获取当前时间
				const now = new Date();

				// 判断活动状态
				if (startDate >= now) { // 活动进行中‌
					const diffMs = now - startDate;
					const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
					this.pauseType = true;
					return Math.min(diffHours, time);
				} else { // 活动未开始或已过期‌
					this.pauseType = false;
					return time;
				}
			},
			// 1
			searchFocus() {
				//全局变量integration赋值
				//getApp().globalData.integration = 0;
				uni.navigateTo({
					url: '/pagesD/search/search?shopId=' + this.goodsDetail.ru_id + '&currentWord=' + this
						.currentWord
				});
			},
			isLastItem(index) {

				return index === this.goodsAttr.length - 1
			},
			adjustQuantity(step) {
				const lastIndex = this.goodsAttr.length - 1
				const newVal = this.goodsAttr[lastIndex].quantity + step
				if (newVal >= 1 && newVal <= this.goodsAttr[lastIndex].maxStock) {
					this.$set(this.goodsAttr[lastIndex], 'quantity', newVal)
				}
			},
			// 生成SKU映射表
			generateSkuMap(targetKey) {
				if (!this.goodsDetail || !this.goodsDetail.attr_pn_list) {
					return {};
				}
				if (typeof targetKey === 'undefined') {
					return this.goodsDetail.attr_pn_list.reduce((map, item) => {
						map[item.key] = item.value;
						return map;
					}, {});
				}
				const lookupKey = Array.isArray(targetKey) ? targetKey.join('_') : String(targetKey);
				const matchedItem = this.goodsDetail.attr_pn_list.find(item => item.key == lookupKey);
				return matchedItem ? matchedItem.value : {};
			},
			// 获取当前SKU信息
			// currentSkuInfo(specId, attr, num) {
			// 	// let skuKey 
			// 	// if(num == 1) {
			// 	// 	skuKey = this.generateSkuKey(specId,attr ? attr.length : null)
			// 	// }else {
			// 	let skuKey = this.generateSkuKey(specId, attr ? attr.length : null)
			// 	// }

			// 	return this.generateSkuMap([skuKey]) || null
			// },
			currentSkuInfo(specId, attr, num) {
				let skuKey = this.generateSkuKey(specId, attr ? attr.length : null)
				return this.generateSkuMap(skuKey) || null
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
				// 库存用于校验判断 - 使用key直接获取SKU信息
				const maxStock = this.generateSkuMap(key)?.product_number || 0
				const minLimit = this.minNum > 0 ? this.minNum : 1
				
				let newCount;
				
				if (delta === 1) {
					// 点击加号
					// 修复：库存为0时，阻止增加数量
					if (maxStock <= 0) {
						this.showToast(`${this.$t('lang.inventory_quantity_exceeded')}`);
						return;
					}
					
					// 【新增】如果当前数量为0，先设置为最低购买数量
					if (currentCount === 0) {
						newCount = minLimit;
					} else {
						// 正常增加
						newCount = currentCount + 1;
					}
					
					// 库存限制检查
					if (newCount > maxStock && maxStock != 0) {
						this.showToast(`${this.$t('lang.inventory_quantity_exceeded')}`);
						newCount = maxStock;
					}
				} else if (delta === -1) {
					// 点击减号：保持「单规格只能是 0 或 >= 起购数」，同时保证全局总数 >= 起购数
					const totalBefore = this.totalQuantity;

					// 当前规格本身没有数量就不再处理
					if (currentCount <= 0) {
						return;
					}

					if (currentCount > minLimit) {
						// 当前规格大于起购数：正常减 1，例如 23→22→21→20
						newCount = currentCount - 1;
					} else {
						// 当前规格等于起购数：要么直接清零，要么如果会让全局总数跌破起购数就不能减
						const newTotalIfZero = totalBefore - currentCount;
						if (newTotalIfZero < minLimit) {
							this.showToast(`${this.$t('lang.zhishao')}${minLimit}${this.$t('lang.jian')}`);
							return;
						}
						newCount = 0;
					}
				} else {
					newCount = Math.max(currentCount + delta, 0);
				}
				
				this.onCurrentCountNum = newCount;
				if (newCount == 0) {
					this.$delete(this.history, key);
				} else {
					this.$set(this.history, key, newCount);
				}
				this.calculateTotals(res);
				
				const stockLimit = Number((this.goodsDetail && this.goodsDetail.goods_number) || 0) || 0;
				let maxLimit = this.xiangouNum > 0 ? this.xiangouNum : stockLimit;
				if (!(maxLimit > 0)) {
					maxLimit = minLimit;
				}
				if (delta === 1) {
					if (this.goodsNum < maxLimit) {
						this.goodsNum += 1;
					}
				} else if (delta === -1) {
					if (this.goodsNum > minLimit) {
						this.goodsNum -= 1;
					} else {
						this.goodsNum = minLimit;
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
			// generateSkuKey(specId, num) {
			// 	// 单规格多数据的length
			// 	const innerLengths = this.goodsAttr[0].attr_key.length;
			// 	// 根据规格数组长度判断   如果是单规格
			// 	if (this.attrLength <= 1 && innerLengths <= 1) {
			// 		// 如果是单规格 但数据，直接用默认选取的
			// 		return `${this.selectedColor}`
			// 	} else if (this.attrLength <= 1 && innerLengths > 1) {
			// 		// 如果是单规格多数据用当前选中的
			// 		return `${specId}`
			// 	} else {
			// 		// 多规格多数据
			// 		console.log(specId)
			// 		return `${this.selectedColor}_${specId}`
			// 	}
			// 	// return `${specId}_${this.selectedColor}`

			// },
			// 生成SKU键 - 使用seleceGoodsAtrrArray
			generateSkuKey(specId, num) {
				// 单规格多数据的length
				const innerLengths = this.goodsAttr && this.goodsAttr[0] ? this.goodsAttr[0].attr_key.length : 0;
				
				// 单规格场景
				if (this.attrLength <= 1) {
					if (innerLengths <= 1) {
						// 单规格单选项，直接用默认选取的
						return `${this.selectedColor}`
					} else {
						// 单规格多选项，每个选项用独立的specId
						return `${specId}`
					}
				}
				
				// 多规格场景（attrLength >= 2）
				if (this.seleceGoodsAtrrArray && Array.isArray(this.seleceGoodsAtrrArray) && this.seleceGoodsAtrrArray.length > 0) {
					// 判断传入的specId是否属于最后一个规格维度
					let isLastDimensionSpec = false;
					if (specId && this.goodsAttr && this.goodsAttr.length > 0) {
						const lastAttrIndex = this.goodsAttr.length - 1;
						const lastAttr = this.goodsAttr[lastAttrIndex];
						if (lastAttr && lastAttr.attr_key && Array.isArray(lastAttr.attr_key)) {
							// 检查specId是否在最后一个规格维度的选项中
							isLastDimensionSpec = lastAttr.attr_key.some(item => item.id === specId);
						}
					}
					
					// 如果传入的specId不在已选择的数组中，说明这是最后一个规格维度的不同选项
					// 需要为每个规格选项生成独立的key（前面维度ID + 当前规格选项ID）
					if (specId && !this.seleceGoodsAtrrArray.includes(specId)) {
						// 判断specId是否属于最后一个规格维度
						if (isLastDimensionSpec) {
							// 如果属于最后一个维度，需要先排除seleceGoodsAtrrArray中属于最后一个维度的ID
							// 找出最后一个规格维度的所有ID
							const lastAttrIds = [];
							if (this.goodsAttr && this.goodsAttr.length > 0) {
								const lastAttr = this.goodsAttr[this.goodsAttr.length - 1];
								if (lastAttr && lastAttr.attr_key && Array.isArray(lastAttr.attr_key)) {
									lastAttr.attr_key.forEach(item => {
										if (item.id) lastAttrIds.push(item.id);
									});
								}
							}
							// 排除最后一个维度已选择的ID，获取前面维度的ID
							const previousDimensionIds = this.seleceGoodsAtrrArray.filter(id => !lastAttrIds.includes(id));
							// 生成包含当前specId的完整组合key
							const combinedIds = [...previousDimensionIds, specId];
							const sortedIds = combinedIds.sort((a, b) => Number(a) - Number(b));
							return sortedIds.join('_');
						} else {
							// 如果不属于最后一个维度，直接使用整个seleceGoodsAtrrArray加上specId生成key
							const combinedIds = [...this.seleceGoodsAtrrArray, specId];
							const sortedIds = combinedIds.sort((a, b) => Number(a) - Number(b));
							return sortedIds.join('_');
						}
					}
					
					// 如果specId已经在数组中，需要判断是否为最后一个规格维度
					// 如果是最后一个规格维度，需要生成包含该specId的完整组合key，而不是直接返回seleceGoodsAtrrArray的组合
					if (specId && this.seleceGoodsAtrrArray.includes(specId)) {
						// 判断当前选择的维度数是否小于总维度数，且specId属于最后一个维度
						// 这种情况下，即使specId在数组中，也需要为每个规格选项生成独立的key
						if (isLastDimensionSpec && this.seleceGoodsAtrrArray.length < this.attrLength) {
							// 获取前面已选择的维度ID（排除最后一个维度的ID），然后加上当前specId生成完整key
							// 找出最后一个规格维度的所有ID
							const lastAttrIds = [];
							if (this.goodsAttr && this.goodsAttr.length > 0) {
								const lastAttr = this.goodsAttr[this.goodsAttr.length - 1];
								if (lastAttr && lastAttr.attr_key && Array.isArray(lastAttr.attr_key)) {
									lastAttr.attr_key.forEach(item => {
										if (item.id) lastAttrIds.push(item.id);
									});
								}
							}
							// 排除最后一个维度已选择的ID，获取前面维度的ID
							const previousDimensionIds = this.seleceGoodsAtrrArray.filter(id => !lastAttrIds.includes(id));
							// 生成包含当前specId的完整组合key
							const combinedIds = [...previousDimensionIds, specId];
							const sortedIds = combinedIds.sort((a, b) => Number(a) - Number(b));
							return sortedIds.join('_');
						}
						// 如果已经选择了所有维度，或者不是最后一个维度，直接返回组合key
						const sortedIds = [...this.seleceGoodsAtrrArray].sort((a, b) => Number(a) - Number(b));
						return sortedIds.join('_');
					}
					
					// 如果没有传入specId，使用已选择的组合key
					const sortedIds = [...this.seleceGoodsAtrrArray].sort((a, b) => Number(a) - Number(b));
					return sortedIds.join('_');
				}
				
				// 多规格场景，但还没有选择任何属性，使用selectedColor和specId组合
				if (this.selectedColor && specId) {
					return `${this.selectedColor}_${specId}`
				}
				
				// 兜底逻辑
				return specId ? `${specId}` : '';
			},
			// 22222

			//输入框实时显示用户增加的数量
			getCurrentCount(res) {
				if (this.selectedColor) {
					this.skuType = true;
					// console.log(this.skuType)
				}
				// console.log(this.selectedColor == res.id)
				// let key = this.selectedColor == res.id ? `${this.selectedColor}` : `${this.selectedColor}_${res.id}`
				let key = this.generateSkuKey(res.id)
				return this.history[key] || 0;
			},
			// 减号是否可用：看全局总数量是否大于起购数，而不是看单个规格
			canDecrease(attrItem) {
				const current = this.getCurrentCount(attrItem);
				if (current <= 0) return false;
				const minLimit = this.minNum > 0 ? this.minNum : 1;
				return this.totalQuantity > minLimit;
			},
			getproductType(attrItem, attrIndex) {
				// 修复：根据attrItem获取SKU key来判断库存，而不是使用attrIndex
				if (!attrItem || !attrItem.id) {
					// 兼容旧代码：如果只传了index（数字），使用旧逻辑
					if (typeof attrItem === 'number') {
						const index = attrItem;
				if (index >= 0 && index < this.goodsDetail.attr_pn_list.length) {
					const productNumber = this.goodsDetail.attr_pn_list[index].value.product_number;
					return productNumber > 0;
				}
				return false;
					}
					return false;
				}
				// 根据attrItem生成SKU key
				let key = (this.selectedColor == attrItem.id) ? this.generateSkuKey(attrItem.id, 1) : this.generateSkuKey(attrItem.id);
				const skuInfo = this.generateSkuMap(key);
				const productNumber = skuInfo?.product_number || 0;
				return productNumber > 0;
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
				let rawTotal =
					(res == 0) ? Object.keys(this.history).reduce((sum, key) => {
						return sum + (parseFloat(this.goodsDetail.shop_price) || 0) * this.history[key]
					}, 0) :
					Object.entries(this.history).reduce((total, [skuKey, quantity]) => {
						const price = this.generateSkuMap(skuKey)?.product_price || 0
						return total + (Number(price) * quantity)
					}, 0)
				// 优惠券过滤：商品券 → 新人券，各选最优一张
				this.totalPrice = this.applyCouponDiscount(rawTotal)
			},
			/**
			 * 优惠券过滤：在规格价基础上，先选最优商品券，再选最优新人券，各用一张
			 * @param {number} rawTotal - 规格价 × 数量的原始总额
			 * @returns {number} 扣减后的金额
			 */
			applyCouponDiscount(rawTotal) {
				let amount = Number(rawTotal) || 0;
				const rawAmount = amount; // 固定用原金额判断两种券的门槛
				const qty = this.totalQuantity || 0;

				if (amount <= 0) return 0;

				const goodsId = String(this.goodsId || '');

				// 商品券列表（排除包邮券），用于日志
				const goodsCouponForLog = (this.goodsCouponList || []).filter(c => c.cou_type != 5);
				const goodsCouponStr = goodsCouponForLog.map(c => `${c.cou_man}-${c.cou_money}`).join('，') || '无';
				const newUserCouponStr = (this.newUserCouponList || []).map(c => `${c.cou_man}-${c.cou_money}`).join('，') || '无';

				console.log(`[优惠券计算] 商品数量${qty} 商品金额${amount}`);

				// 1. 店铺券：用原金额判断门槛，选 cou_money 最大的，只用一张
				const goodsCoupons = (this.goodsCouponList || []).filter(c => {
					if (c.cou_type == 5) return false; // 包邮券不参与商品金额扣减
					const man = Number(c.cou_man) || 0;
					if (rawAmount < man) return false;
					const exclude = (c.cou_exclude_goods || '').toString().split(',').map(s => s.trim()).filter(Boolean);
					if (goodsId && exclude.includes(goodsId)) return false;
					return true;
				});
				if (goodsCoupons.length > 0) {
					const best = goodsCoupons.reduce((a, b) => (Number(b.cou_money) || 0) > (Number(a.cou_money) || 0) ? b : a);
					const beforeAmount = amount;
					amount = Math.max(0, amount - (Number(best.cou_money) || 0));
					console.log(`[优惠券计算] 店铺券，【${goodsCouponStr}】满足${best.cou_man}-${best.cou_money} 原金额${beforeAmount} 优惠后金额${amount}`);
				} else {
					console.log(`[优惠券计算] 店铺券，【${goodsCouponStr}】不满足`);
				}

				// 2. 新人券：用原金额判断门槛（不用店铺券扣减后的余额），选 cou_money 最大的，只用一张
				const newUserCoupons = (this.newUserCouponList || []).filter(c => {
					const man = Number(c.cou_man) || 0;
					return rawAmount >= man && (Number(c.cou_money) || 0) > 0;
				});
				if (newUserCoupons.length > 0) {
					const best = newUserCoupons.reduce((a, b) => (Number(b.cou_money) || 0) > (Number(a.cou_money) || 0) ? b : a);
					const beforeAmount = amount;
					amount = Math.max(0, amount - (Number(best.cou_money) || 0));
					console.log(`[优惠券计算] 新人券【${newUserCouponStr}】满足${best.cou_man}-${best.cou_money} 原金额${rawAmount} 扣减前${beforeAmount} 优惠后金额${amount}`);
				} else {
					console.log(`[优惠券计算] 新人券【${newUserCouponStr}】不满足`);
				}

				const finalAmount = this.moneyPrecision ? this.moneyPrecision(amount) : Number(amount.toFixed(2));
				return finalAmount;
			},

			getColorTotal(colorId) {
				// 单规格场景：直接统计
				if (this.attrLength <= 1) {
					return Object.keys(this.history).reduce((sum, key) => {
						if (key == colorId) {
							sum += Number(this.history[key])
						}
						return sum
					}, 0)
				}
				
				// 多规格场景：只统计第一个规格维度的数量
				// 判断传入的colorId是否属于第一个规格维度
				let isFirstDimensionSpec = false;
				if (colorId && this.goodsAttr && this.goodsAttr.length > 0) {
					const firstAttr = this.goodsAttr[0];
					if (firstAttr && firstAttr.attr_key && Array.isArray(firstAttr.attr_key)) {
						isFirstDimensionSpec = firstAttr.attr_key.some(item => item.id === colorId);
					}
				}
				
				// 如果不是第一个规格维度，返回0
				if (!isFirstDimensionSpec) {
					return 0;
				}
				
				// 如果是第一个规格维度，统计所有包含该ID的key的数量
				// 因为key是排序后的组合，需要检查key拆分后是否包含colorId
				return Object.keys(this.history).reduce((sum, key) => {
					if (key == colorId) {
						sum += Number(this.history[key])
					} else {
						// 多规格场景：将key拆分，检查是否包含colorId
						const keyParts = key.split('_');
						if (keyParts.includes(String(colorId))) {
							sum += Number(this.history[key])
						}
					}
					return sum
				}, 0)
			},

			// 2

			//新人店铺券信息（支持接收数组或单对象，来自 sys-coupon 的 api/coupon/coupon）
			handleChildData(data) {
				const list = Array.isArray(data) ? data : (data && typeof data === 'object' ? [data] : []);
				this.newUserCouponList = list;
				// 展示用：取第一张或最优的一张
				const best = list.length > 0 ? list[0] : {};
				this.couponLst = best;
				this.couponLstMoney = best.cou_money || '';
			},
			copyTitle(goods_name) {
				var that = this
				var text = goods_name
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000,
						})
					},
				})
			},
			mydrplink(type) {
				uni.navigateTo({
					url: "/pagesA/drp/drpinfo/drpinfo"
				})
			},
			goBack() {
				uni.navigateBack()
			},
			showToast(msg = '请稍后重试！') {
				uni.showToast({
					title: msg,
					icon: 'none'
				})
			},
			// 导航跟踪
			navigationTracking() {
				if (timerId) {
					clearTimeout(timerId);
					timerId = null;
				};
				timerId = setTimeout(() => {
					this.computedElTop()
				}, 5);
			},
			// 图片预览
			previewImg(i, imgs) {
			
				let arr = []
				if (imgs) {
					if (typeof imgs == 'string') arr.push(imgs);

					uni.previewImage({
						current: i,
						urls: arr.length > 0 ? arr : imgs
					})
				}
			},
			// 开始播放
			play(event) {
				this.showVideo = true;
				uni.createVideoContext('goodsVideo').play();
			},
			// 暂停播放
			pause(event) {
				uni.createVideoContext('goodsVideo').pause();
				this.showVideo = false;
			},
			//视频播放错误
			videoErrorCallback(e) {
				uni.showModal({
					content: this.$t('lang.video_error_callback'),
					showCancel: false
				});
			},
			// 获取一个目标元素的高度
			getElRect(elClass) {
				return new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).boundingClientRect(res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						resolve(res)
					}).exec();
				})
			},
			async computedElTop() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight || 0;
				// #ifdef APP-PLUS
				statusHeight = 44 + statusHeight + uni.upx2px(20);
				// #endif

				// #ifdef MP-WEIXIN
				statusHeight = 44 + this.menuButtonInfo.height + this.menuButtonInfo.top + uni.upx2px(20);
				// #endif
				const topArr = [];
				const comment_el = await this.getElRect('comment_el');
				topArr.push(comment_el);
				const detail_el = await this.getElRect('detail_el');
				topArr.push(detail_el);
				const related_el = await this.getElRect('related_el');
				topArr.push(related_el);
				topArr.forEach((item, index) => {
					if (item.top < statusHeight && item.bottom > statusHeight) {
						if (item.id == 'comment_id') this.currNav = 1
						else if (item.id == 'detail_id') this.currNav = 2
						else if (item.id == 'related_id') this.currNav = 3;
					}
				});
				if (topArr[0].top > statusHeight) this.currNav = 0;
			},
			// 获取商品详情
				async getGoodsDetailById() {
				var that = this
				const {
					data,
					status
				} = await that.$store.dispatch('getGoodsDetail', {	
					goods_id: that.goodsId,
					warehouse_id: 0,
					area_id: 0,
					is_delete: 0,
					is_on_sale: 1
				});

				// that.dscLoading = false
				// that.showLoadMore = true
				// setTimeout(() => {
				// 	that.showSkeleton = false
				// }, 100)
				if (status == 'success') {
				
					
					// 统一兜底：保证模板/computed 永远不会因缺字段报错
					const normalizeGoodsDetail = (raw) => {
						const d = raw && typeof raw === 'object' ? raw : {};
						const arr = (v) => (Array.isArray(v) ? v : []);
						const obj = (v) => (v && typeof v === 'object' ? v : {});
						/**
						 * 接口常把 PHP 列表编成 JSON 对象（数字键），H5/APP 解析一致性问题会导致丢满减。
						 * 统一成数组，避免 consumption / goods_promotion 变成 [] 后 discountsData 无 acttype:1。
						 */
						const listLike = (v) => {
							if (v == null || v === '') return [];
							if (Array.isArray(v)) return v.filter((item) => item != null);
							if (typeof v === 'object') {
								const keys = Object.keys(v);
								if (!keys.length) return [];
								const numericKeys = keys.every((k) => /^\d+$/.test(k));
								if (numericKeys) {
									return keys
										.sort((a, b) => Number(a) - Number(b))
										.map((k) => v[k])
										.filter((item) => item != null);
								}
								if (
									'cfull' in v ||
									'creduce' in v ||
									'act_type' in v ||
									'act_name' in v ||
									'type' in v
								) {
									return [v];
								}
							}
							return [];
						};

						return {
							...d,
							fittings: arr(d.fittings),
							volume_price_list: arr(d.volume_price_list),
							goods_services_label_show: arr(d.goods_services_label_show),
							goods_services_label: arr(d.goods_services_label),
							goods_certificate_list: arr(d.goods_certificate_list),
							goods_article_list: arr(d.goods_article_list),
							attr_parameter: arr(d.attr_parameter),
							attr: arr(d.attr),
							attr_pn_list: arr(d.attr_pn_list),
							consumption: listLike(d.consumption),
							goods_promotion: listLike(d.goods_promotion),
							shop_info: obj(d.shop_info)
						};
					};

					// that.goodsDetail = data;
					that.$set(that, 'goodsDetail', normalizeGoodsDetail(data));
					
					// 日志：完整详情里的活动时间 + 计算后的倒计时入参
					console.log(
						'[goodsDetail][getGoodsDetailById] goods_id:',
						that.goodsDetail && that.goodsDetail.goods_id,
						'promote_start_date:',
						that.goodsDetail && that.goodsDetail.promote_start_date,
						'promote_end_date:',
						that.goodsDetail && that.goodsDetail.promote_end_date
					);
					console.log(
						'[goodsDetail][dateTime computed] value:',
						that.dateTime
					);
					
				this.showVideo = !!data.goods_video;
					that.getImgs()
					//店铺信息
					if (data.user_id > 0) {
						const {
							data: res,
							status: sta
						} = await that.$store.dispatch('getShopDetailById', {
							ru_id: data.user_id
						});
						if (sta != 'success') {
							that.showToast();
						} else {
							that.shopDetail = res;
							if (res.stop_send_date) {
								let timestamp = this.convertMonthDayToTimestamp(res.stop_send_date);
								let validTime = timestamp * 1000;
								let cTime = new Date().getTime();
								let oneDayTime = 1000 * 60 * 60 * 24;
								let differenceInMillis = validTime - cTime;

								if (differenceInMillis > 0) {
									this.setDifferenceInMillisInterval(res.start_send_date);
									this.isShow = true;
								} else {
									this.isShow = false;
								}
							}

							that.followShopStatus = res.is_collect_shop;

							let num = 0;
							if (res.commentrank) num += parseInt(res.commentrank.slice(0, 1)) || 0;
							if (res.commentdelivery) num += parseInt(res.commentdelivery.slice(0, 1)) || 0;
							if (res.commentserver) num += parseInt(res.commentserver.slice(0, 1)) || 0;

							num = num / 3;
							that.storeRate = Math.round(num);
						}
					};

					// 默认勾选的属性
					// if (data.attr) {
					// 	data.attr.forEach((item, inx) => {
					// 		this.attrLength = data.attr.length
					// 		console.log('当前规格数量', this.attrLength)
					// 		item.attr_key.forEach(val => {
					// 			if (val.attr_checked == 1) {
					// 				that.seleceGoodsAtrrArray.push(val.id);
					// 				console.log(that.seleceGoodsAtrrArray)
					// 			};
					// 		});

					// 		if (inx == 0) {
					// 			item.attr_key.forEach(val => {
					// 				if (val.attr_checked == 1) {
					// 					that.selectedColor = val.id
					// 				};
					// 			});
					// 		}
					// 		console.log(that.selectedColor)
					// 	});
					// };
					// 默认勾选的属性
					// 默认勾选的属性
					if (data.attr) {
						// 创建库存映射表
						const stockMap = {};
						if (data.attr_pn_list) {
							data.attr_pn_list.forEach(item => {
								stockMap[item.key] = item.value.product_number;
							});
						}

							this.attrLength = data.attr.length;
							

					// 修复：多规格场景需要检查组合后的完整SKU是否有库存
					if (this.attrLength >= 2) {
						// 多规格场景：递归查找第一个有库存的完整SKU组合
						const findFirstAvailableCombination = (attrGroups, currentSelection = []) => {
							// 如果已经选择了所有规格组，检查该组合是否有库存
							if (currentSelection.length === attrGroups.length) {
								// 生成SKU key（排序后的组合）
								const skuKeyParts = [...currentSelection].sort((a, b) => Number(a) - Number(b));
								const skuKey = skuKeyParts.join('_');
								const stock = stockMap[skuKey] || 0;
								return stock > 0 ? [...currentSelection] : null;
							}
							
							// 当前规格组的索引
							const currentGroupIndex = currentSelection.length;
							const currentGroup = attrGroups[currentGroupIndex];
							
							// 遍历当前规格组的所有选项
							for (const attrItem of currentGroup.attr_key) {
								const newSelection = [...currentSelection, attrItem.id];
								const result = findFirstAvailableCombination(attrGroups, newSelection);
								if (result) {
									return result;
								}
							}
							
							return null;
						};
						
						// 查找第一个有库存的组合
						const availableCombination = findFirstAvailableCombination(data.attr);
						
						if (availableCombination && availableCombination.length > 0) {
							// 找到有库存的组合
							that.seleceGoodsAtrrArray = availableCombination;
							that.selectedColor = availableCombination[0];
						} else {
							// 如果没有找到有库存的组合，选择第一个组合（即使没有库存）
							that.seleceGoodsAtrrArray = [];
							data.attr.forEach((item, inx) => {
								if (item.attr_key.length > 0) {
									that.seleceGoodsAtrrArray.push(item.attr_key[0].id);
									if (inx === 0) {
										that.selectedColor = item.attr_key[0].id;
									}
								}
							});
						}
					} else {
						// 单规格场景：直接查找单个规格项是否有库存
						data.attr.forEach((item, inx) => {
							// 查找当前属性组中第一个有库存的选项
							let selectedAttrId = null;

							// 首先尝试找到有库存的选项
							for (const val of item.attr_key) {
								// 单规格场景，SKU key就是规格项ID
								const stock = stockMap[val.id] || 0;
								if (stock > 0) {
									selectedAttrId = val.id;
									break;
								}
							}

							// 如果没有找到有库存的选项，则选择第一个选项
							if (!selectedAttrId && item.attr_key.length > 0) {
								selectedAttrId = item.attr_key[0].id;
							}

							// 将选择的选项ID添加到数组中
							if (selectedAttrId) {
								that.seleceGoodsAtrrArray.push(selectedAttrId);

								// 如果是第一个属性组，设置selectedColor
								if (inx === 0) {
									that.selectedColor = selectedAttrId;
								}
							}
						});
							}

						
					};

					// 起购数量，至少为1
					const minimumValue = Number(data.minimum) || 0;
					const baseMinimum = minimumValue > 0 ? minimumValue : 1;
					that.goodsNum = baseMinimum;
					that.minNum = baseMinimum;

					//限购
					if (data.xiangou_num > 0 && data.xiangou_end_date > data.current_time) that.xiangouNum = data
						.xiangou_num;
					that.xiangouNum = data.goods_number;

					//浏览历史
					if (that.$isLogin()) that.historyAdd();

					//如果是秒杀商品跳转到秒杀详情
					// if (that.goodsDetail.seckill_id) {
					// 	uni.redirectTo({
					// 		url: '/pagesA/seckill/detail/detail?id=' + that.goodsDetail.seckill_id +
					// 			'&tomorrow=0&delta=2'
					// 	});
					// }

					// 初始化价格
					that.changeAttr(true);
					that.initDefaultQuantity(true);

					that.collectStatus = data.is_collect;

					that.$nextTick(function() {
						that.getGoodsCoupon();
						that.getCommentList();
						// that.getGoodsList();
						that.getGuessList();
					});

				} else {
					return uni.showToast({
						title: '请稍候重试！',
						icon: 'none',
						complete: () => {
							uni.reLaunch({
								url: "/pages/middles/middles"
							})
						}
					});
				}

			},
			// 收藏
			async collection() {
				var that = this
				if (that.$isLogin()) {
					const {
						data,
						status
					} = await that.$store.dispatch('collectgoodsById', {
						goods_id: that.goodsId,
						status: that.collectStatus
					});
					if (data.error == 0) that.collectStatus = status;
				} else {
					uni.showModal({
						content: that.$t('lang.fill_in_user_collect_goods'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
			},
			// 店铺关注
			async collectHandle(val) {
				if (this.$isLogin()) {
					const {
						data,
						status
					} = await this.$store.dispatch('followCollectShopById', {
						ru_id: val,
						status: this.followShopStatus
					});
					if (data.error == 0) {
						this.followShopStatus = status;
						if (status == 1) this.shopDetail.count_gaze = this.shopDetail.count_gaze + 1
						else this.shopDetail.count_gaze = this.shopDetail.count_gaze - 1;
					}
				} else {
					uni.showModal({
						content: this.$t('lang.fill_in_user_collect_shop'),
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
			// 获取优惠券
			async getGoodsCoupon() {
				const {
					data,
					status
				} = await this.$store.dispatch('getGoodsCouponListById', {
					goods_id: this.goodsId,
					ru_id: this.goodsDetail.user_id
				});

				if (status != 'success') {
					return this.showToast();
				}

				let list = data;
				if (!Array.isArray(list)) {
					list = (data && data.list) || (data && data.data) || [];
				}
				if (!Array.isArray(list)) {
					list = [];
				}

				// 使用 Vue.set 确保响应式更新正确触发，避免异步时序问题
				this.$set(this, 'goodsCouponList', list);

				// 方案1：强制触发计算属性重新计算
				this.$nextTick(() => {
					// 强制触发视图更新
					this.$forceUpdate();
				});

			},

			//领取优惠券
			handelReceive(val) {
				if (this.$isLogin()) {
					this.$store.dispatch('setGoodsCouponReceive', {
						cou_id: val
					}).then(({
						data: data
					}) => {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						});

						this.getGoodsCoupon();
					});
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
			getGoodsImage() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/goods/picture_list?goods_id=' + that.goodsId,
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log('img', res.data.data)
						var abc = []
						var acb = []
						var cba = []
						if (res.data.data.main_image.length > 0) {
							for (var i = 0; i < res.data.data.main_image.length; i++) {
								var ab = {}
								ab.url = res.data.data.main_image[i]
								ab.checked = false
								abc.push(ab)
							}
							that.main_image_list = abc
						} else {
							that.main_image_list = []
						}
						if (res.data.data.attr_img_list.length > 0) {
							for (var i = 0; i < res.data.data.attr_img_list.length; i++) {
								var bc = {}
								bc.url = res.data.data.attr_img_list[i].attr_image
								bc.checked = false
								acb.push(bc)
							}
							that.attr_image_list = acb
						} else {
							that.attr_image_list = []
						}
						if (res.data.data.detail_image.length > 0) {
							for (var i = 0; i < res.data.data.detail_image.length; i++) {
								var ca = {}
								ca.url = res.data.data.detail_image[i]
								ca.checked = false
								cba.push(ca)
							}
							that.detail_image_list = cba
						} else {
							that.detail_image_list = []
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getImgs() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/goods/goods_top_picture_list?goods_id=' + that.goodsId,
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log('imgsssssssss', res.data.data)
						that.allImgs = res.data.data
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			// 搜索热词
			getHotKeywords() {
				uni.request({
					url: this.websiteUrl + '/api/shop/config',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						if (data.search_keywords) {
							this.search_keywords = data.search_keywords.split(',')
						}
					}
				});
			},
			// 获取商品列表
			async getGoodsList() {
				let that = this;

				that.getHotKeywords();

				const {
					ru_id,
					basic_info,
					get_seller_shop_info
				} = that.goodsDetail;

				if (ru_id > 0) {
					const {
						data
					} = await that.$store.dispatch('getShopGoodsListById', {
						store_best: 1,
						store_id: ru_id,
						page: 1,
						size: 30
					});

					if (Array.isArray(data) && data.length > 0) {
						
						that.recommentTabs.push({
							title: that.$t('lang.recommended_by_our_shop'),
							id: 1
						});
						const arr = [];
						for (let i = 0; i < Math.ceil(data.length / 6); i++) {
							arr.push(data.slice(i * 6, (i + 1) * 6))
						};
						that.goodsGuessList.push(arr);
						
					};
				} else {
					const {
						data
					} = await that.$store.dispatch('setGoodsList', {
						type: true,
						intro: 'best',
						page: 1,
						size: 30
					});

					if (Array.isArray(data) && data.length > 0) {
						that.recommentTabs.push({
							title: that.$t('lang.recommended_by_our_shop'),
							id: 1
						});
						const arr = [];
						for (let i = 0; i < Math.ceil(data.length / 6); i++) {
							arr.push(data.slice(i * 6, (i + 1) * 6))
						};
						that.goodsGuessList.push(arr);
					};
				}

				//关联商品
				const {
					data: res
				} = await that.$store.dispatch('getLinkGoodsById', {
					goods_id: that.goodsId,
					page: 1,
					size: 30
				});

				if (Array.isArray(res) && res.length > 0) {
					that.recommentTabs.push({
						title: that.$t('lang.guess_love'),
						id: 2
					});
					const arr = [];
					for (let i = 0; i < Math.ceil(res.length / 6); i++) {
						arr.push(res.slice(i * 6, (i + 1) * 6))
					};
					that.goodsGuessList.push(arr);
				};
			},
			// 底部猜你喜欢模块
			async getGuessList() {
				// let page = this.guessList.length / 10;

				// page = Math.ceil(page) + 1;
				uni.request({
					url: this.websiteUrl + '/api/catalog/goodslist',
					method: 'POST',
					data: {
						keywords: this.goodsDetail.goods_name,
						size: this.size,
						page: this.page,

					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						
						let result = res.data.data
						if (Array.isArray(result) && result.length > 0) {
							this.guessList = [...this.guessList, ...result];
						
							this.onguessList = res.data.data
						};
					},
					fail: (err) => {
						console.error(err)
					}
				})
				// const {
				// 	data: result
				// } = await this.$store.dispatch('getGoodsGuessList', {
				// 	warehouse_id: 0,
				// 	area_id: 0,
				// 	page: this.page,
				// 	size: this.size
				// });

				// if (Array.isArray(result) && result.length > 0) {
				// 	this.guessList = [...this.guessList, ...result];
				// };

				// if (result.length < 10) this.isOver = true;
			},
			// 获取商品评论
			async getCommentList() {
				const {
					data,
					status
				} = await this.$store.dispatch('getCommentTotalById', {
					goods_id: this.goodsId
				});
				if (status != 'success') return this.showToast();
				this.commentTotal = {
					total: data.all || 0,
					good: data.good_pro
					// good: parseInt(data.good / data.all * 100) + '%'
				};

				const {
					data: res
				} = await this.$store.dispatch('getGoodsCommentById', {
					goods_id: this.goodsId,
					// rank: 'all', //点击进入评论详情还会调用这个接口，rank 参数还是传递 all，只在这里修改
					rank: 'good_valid',
					page: 1,
					size: 2
				});
				if (Array.isArray(res)) this.goodsComment = res;
			
				this.getDiscussions();
			},
			// 获取网友讨论圈
			async getDiscussions() {
				const {
					data,
					status
				} = await this.$store.dispatch('getDiscoverListById', {
					goods_id: this.goodsId,
					dis_type: 'all',
					page: 1,
					size: 2,
					id: 0
				});

				if (status == 'success') this.friendDis = data;
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
							this.regionSplic = this.addressList[i].province_name + ' ' + this.addressList[i]
								.city_name + ' ' + this.addressList[i].district_name + ' ' + this.addressList[i]
								.street_name + this.addressList[i].address
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
								var a = resda.data.regeocode.addressComponent
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
												region: res1.data.province,
												level: 2
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.city,
												level: 3
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.district,
												level: 4
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.street,
												level: 5
											})
											uni.setStorageSync('regionData', o)

											//关闭收货地址弹窗
											that.closePop('address');
										}
									},
									fail: (err) => {
										console.error(err)
									}
								})

							},
							fail: (err) => {
								console.error("restapi err", err);
							}
						})
					}
				})
			},
			// 修改商品属性
			async changeAttr(load = false) {
				var that = this
				const {
					data,
					status
				} = await that.$store.dispatch('setGoodsAttrOperById', {
					goods_id: that.goodsId,
					num: that.goodsNum,
					attr_id: that.seleceGoodsAtrrArray
				});
				if (status != 'success') return that.showToast();

				that.selectAttr = data.attr_name;
				that.goodsDetail.upc = data.bar_code
				that.goodsDetail.goods_number = data.stock;
				that.goodsDetail.shop_price = data.shop_price;
				// that.goodsDetail.youhui_price = data.youhui_price;
				that.goodsDetail.marketPrice = data.market_price;
				that.goodsDetail.shop_price_formated = data.shop_price_formated;
				that.goodsDetail.spec_price = data.spec_price;
				that.goodsDetail.goods_price_original = data.goods_price_original;

				if (data.attr_img) that.goodsDetail.goods_thumb = data.attr_img;
				
				// 保存 discount_info 优惠信息
				that.discountInfo = data.discount_info || [];

				if (load) setTimeout(() => {
					that.dscLoading = false
				}, 30);
			},
			selectOtherAddress() {
				var that = this

				that.currAddressSwiper = 1;
			},
			// 选择地址
			// selectRegion(item) {
			// 	if (item.level > 4) {
			// 		this.$set(this.selectRegionArr, 3, item);
			// 		this.closePop('address')
			// 	} else {
			// 		this.selectRegionArr.push(item);
			// 		this.getRegionListData(item.id, item.level);
			// 	}
			// },
			// 重新选择地址
			// changeSelect(i) {
			// 	this.selectRegionArr = this.selectRegionArr.slice(0, i) || [];
			// 	if (i == 0) {
			// 		this.getRegionListData();
			// 	} else {
			// 		const {
			// 			id,
			// 			level
			// 		} = this.selectRegionArr[i - 1];
			// 		this.getRegionListData(id, level);
			// 	}
			// },
			// 点击头部导航
			changeNav(i) {
				if (i == this.currNav) return;
				this.currNav = i;

				if (i > 0) {
					let el = '';
					if (i == 1) el = '.comment_el'
					else if (i == 2) el = '.detail_el'
					else el = '.related_el';
					let statusHeight = uni.getSystemInfoSync().statusBarHeight || 0;
					// #ifdef APP-PLUS
					statusHeight = 44 + statusHeight + uni.upx2px(20);
					// #endif

					// #ifdef MP-WEIXIN
					statusHeight = 44 + this.menuButtonInfo.height + this.menuButtonInfo.top + uni.upx2px(20);
					// #endif

					const query = uni.createSelectorQuery().in(this);
					query.select(el).boundingClientRect(res => {
						const val = this.old.scrollTop;
						this.flag = false;
						uni.pageScrollTo({
							scrollTop: res.top + val - statusHeight + 2,
							duration: 150
						});
					}).exec();

				} else {
					this.flag = false;
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 150
					});
				}
				if (!this.flag) {
					setTimeout(() => {
						this.flag = true;
					}, 10);
				}
			},

			// 仅 Android 有效：判断是否为 Android APP
			_isAndroidApp() {
				try {
					const sys = uni.getSystemInfoSync();
					const s = (sys.platform || sys.system || sys.osName || '').toLowerCase();
					return s.includes('android');
				} catch (e) {
					return false;
				}
			},
			// Android 键盘收起补丁：数量输入框 focus 时记录上下文（仅 Android）
			onCountInputFocus(attrItem, item) {
				if (!this._isAndroidApp()) return;
				this.countInputFocusContext = { attrItem, item };
				this.countInputLastValue = String(this.getCurrentCount(attrItem) || '');
			},
			// Android 键盘收起补丁：数量输入时记录最新值（仅 Android）
			onCountInput(e) {
				if (!this._isAndroidApp()) return;
				this.countInputLastValue = e.detail.value || '';
			},
			// 输入修改商品数量
			changeGoodsNumByInput(e, res) {


				const detailValue = e.detail.value
				let newCount
				let key = (this.selectedColor == res.id) ? this.generateSkuKey(res.id, 1) : this.generateSkuKey(res.id)
				// let key = `${this.selectedColor}_${res.id}`

				//新增逻辑
				let currentCount = this.history[key] || 0
				// 库存用于校验判断 - 使用key直接获取SKU信息
				const maxStock = this.generateSkuMap(key)?.product_number || 0
				const minLimit = this.minNum > 0 ? this.minNum : 1
				newCount = (e && e.detail.value) ? Number(e.detail.value) : Math.max(currentCount, 0)

				// 修复：库存为0时，不允许输入大于0的数量
				if (maxStock <= 0 && newCount > 0) {
					this.showToast(`${this.$t('lang.inventory_quantity_exceeded')}`)
					newCount = 0;
					currentCount = 0;
					this.onCurrentCountNum = 0;
					this.$delete(this.history, key);
					this.calculateTotals(res);
					return;
				}

				// 【新增】如果输入的数量大于0但小于最低购买数量，设置为最低购买数量
				if (newCount > 0 && newCount < minLimit) {
					this.showToast(`${this.$t('lang.the_goods')}${minLimit}${this.goodsDetail.goods_unit || this.$t('lang.jian')}${this.$t('lang.label_minimum_2')}`);
					newCount = minLimit;
				}

				if (newCount > maxStock && maxStock != 0) {
					this.showToast(`${this.$t('lang.inventory_quantity_exceeded')}`)
					newCount = maxStock;
					currentCount = maxStock;
					this.onCurrentCountNum = maxStock;
					this.onCurrentCount = maxStock;
				}
				if (detailValue == '' || detailValue == 0) {
					newCount = 0;
					currentCount = 0;
					this.onCurrentCount.set(0)
				}

				if (newCount == 0) {
					this.$delete(this.history, key)
				} else {
					this.$set(this.history, key, newCount)
				}
				this.calculateTotals(res)
				const inputNumber = Number(e.detail.value)
				if (Number.isNaN(inputNumber)) {
					this.goodsNum = minLimit
					this.countInputFocusContext = null;
					return
				}
				if (inputNumber < minLimit) {
					this.goodsNum = minLimit
					this.showToast(`${this.$t('lang.zhishao')}${minLimit}${this.$t('lang.jian')}`);
				} else {
					this.goodsNum = inputNumber;
				}
				this.countInputFocusContext = null;
			},
			// 切换推荐商品列表
			changeGoodsTab(i) {
				if (this.currGoodsList == i) return;
				this.currGoodsList = i;
				this.reCurSwipeItem = 0;
			},
			// 商品列表滑动分页
			onChangeRecomment(e) {
				this.reCurSwipeItem = e.detail.current || 0;
			},
			// 商品轮播图
			changeSwiper(e) {
				this.currSwiperPic = e.detail.current || 0;
			},
			// 规格弹窗 底部城市
			showCity(res) {
				if (this.$isLogin()) {
					this.$refs[res].open()
				} else {
					uni.showModal({
						content: this.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
			},
			updateDiscountSheetHeight() {
				this.$nextTick(() => {
					const cap = this.discountSheetCapPx;
					const minBody = uni.upx2px(200);
					const minPanel = uni.upx2px(260);
					const q = uni.createSelectorQuery().in(this);
					q.select('.disc-sh-hd').boundingClientRect();
					q.select('.discount-sheet-measure').boundingClientRect();
					q.exec((res) => {
						const headRect = res && res[0];
						const bodyRect = res && res[1];
						const headPx = headRect && Number(headRect.height) > 0
							? Math.ceil(headRect.height)
							: uni.upx2px(268);
						let bodyH = bodyRect && Number(bodyRect.height) > 0
							? Math.ceil(bodyRect.height)
							: minBody;
						if (bodyH < minBody) bodyH = minBody;
						let total = headPx + bodyH;
						total = Math.min(Math.max(total, minPanel), cap);
						const scrollH = Math.max(total - headPx, uni.upx2px(120));
						this.$set(this.popHeight, 'discountSheetTotalPx', total);
						this.$set(this.popHeight, 'discountScrollPx', scrollH);
					});
				});
			},
			onDiscountsPopupChange(e) {
				if (!e) return;
				if (e.show) {
					this.updateDiscountSheetHeight();
					setTimeout(() => this.updateDiscountSheetHeight(), 100);
					setTimeout(() => this.updateDiscountSheetHeight(), 280);
				} else {
					this.$set(this.popHeight, 'discountSheetTotalPx', 0);
					this.$set(this.popHeight, 'discountScrollPx', 0);
				}
			},
			// 显示底部弹框
			showPopup(res) {
				this.switchToImages();
				// Object.keys(stt).length;
				if (this.couponLst) {
					if ((Number(this.goodsDetail.spec_price)) >= 20) {
						let number = (Number(this.goodsDetail.spec_price) - Number(this.couponLst.cou_money));

						if (res == 'discounts' && Number(number) > 0) {
							this.couponPrice = number.toFixed(2)
						
						} else {
							this.couponPrice = this.goodsDetail.shop_price;
						}

					} else {
						this.couponPrice = this.goodsDetail.shop_price;
					}
				}
				var that = this
				if (that.$isLogin()) {
					that.$refs[res].open()
				} else {
					uni.showModal({
						content: that.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}

				// if (res == 'address') {
				// 	this.regionShow = true;
				// }
			},
			//关闭证书弹窗时 弹出提示 
			closeCertificate(res) {
				this.showPopup('certificate2')

			},
			closeCertificate2() {
				this.closePop('certificate2');
				this.closePop('certificate')
			},
			// 关闭底部弹框
			// 检查并自动切换到有库存的规格（提取为独立方法，供所有关闭场景调用）
			checkAndSwitchToAvailableSku() {
				const currentKey = this.getCurrentSkuKey();
				if (!currentKey) return;
				
				const currentSkuInfo = this.generateSkuMap(currentKey);
				const currentStock = currentSkuInfo?.product_number || 0;
				
				// 如果当前选中的规格没有库存，自动切换到有库存的规格
				if (currentStock <= 0 && this.goodsDetail && this.goodsDetail.attr && this.goodsDetail.attr.length > 0) {
					// 创建库存映射表
					const stockMap = {};
					if (this.goodsDetail.attr_pn_list) {
						this.goodsDetail.attr_pn_list.forEach(item => {
							stockMap[item.key] = item.value.product_number;
						});
					}
					
					// 查找第一个有库存的规格组合
					if (this.attrLength >= 2) {
						// 多规格场景：递归查找第一个有库存的完整SKU组合
						const findFirstAvailableCombination = (attrGroups, currentSelection = []) => {
							// 如果已经选择了所有规格组，检查该组合是否有库存
							if (currentSelection.length === attrGroups.length) {
								// 生成SKU key（排序后的组合）
								const skuKeyParts = [...currentSelection].sort((a, b) => Number(a) - Number(b));
								const skuKey = skuKeyParts.join('_');
								const stock = stockMap[skuKey] || 0;
								return stock > 0 ? [...currentSelection] : null;
							}
							
							// 当前规格组的索引
							const currentGroupIndex = currentSelection.length;
							const currentGroup = attrGroups[currentGroupIndex];
							
							// 遍历当前规格组的所有选项
							for (const attrItem of currentGroup.attr_key) {
								const newSelection = [...currentSelection, attrItem.id];
								const result = findFirstAvailableCombination(attrGroups, newSelection);
								if (result) {
									return result;
								}
							}
							
							return null;
						};
						
						// 查找第一个有库存的组合
						const availableCombination = findFirstAvailableCombination(this.goodsDetail.attr);
						
						if (availableCombination && availableCombination.length > 0) {
							// 找到有库存的组合，更新选中状态
							this.seleceGoodsAtrrArray = availableCombination;
							this.selectedColor = availableCombination[0];
							// 重新初始化数量
							this.initDefaultQuantity(true);
							// 重新计算价格
							this.changeAttr(true);
						}
					} else {
						// 单规格场景：查找第一个有库存的规格项
						for (const item of this.goodsDetail.attr) {
							for (const val of item.attr_key) {
								const stock = stockMap[val.id] || 0;
								if (stock > 0) {
									this.seleceGoodsAtrrArray = [val.id];
									this.selectedColor = val.id;
									// 重新初始化数量
									this.initDefaultQuantity(true);
									// 重新计算价格
									this.changeAttr(true);
									break;
								}
							}
							if (this.seleceGoodsAtrrArray.length > 0) break;
						}
					}
				}
			},
			// 规格弹窗状态变化事件（包括点击遮罩层关闭）
			onGoodsAttrPopupChange(e) {
				// e 是对象格式 {show: false, type: 'bottom'}，e.show === false 表示弹窗关闭
				if (e && e.show === false) {
					this.specificationBtnType = false;
					this.storeBtn = false;
					// 检查并自动切换到有库存的规格
					this.checkAndSwitchToAvailableSku();
				}
			},
			closePop(res, number) {
				if (res == 'address' && number == 1) this.isAddress = !this.isAddress;
				if (res == 'goodsattr' && number == 1) this.specificationBtnType = false;
				
				// 修复：关闭规格弹窗时，如果当前选中的规格没有库存，自动切换到有库存的规格
				if (res == 'goodsattr') {
					this.storeBtn = false;
					// 检查并自动切换到有库存的规格（在关闭前执行，因为 close() 会立即关闭）
					this.checkAndSwitchToAvailableSku();
				}
				
				this.$refs[res].close()
			},
			// 跳转商品详情
			detailLink(item) {
				if (item.get_presale_activity) {
					uni.navigateTo({
						url: '/pagesA/presale/detail/detail?act_id=' + item.get_presale_activity.act_id
					})
				} else {
					uni.navigateTo({
						url: '/pagesC/goodsDetail/goodsDetail?id=' + item.goods_id
					})
				}
			},
		// 获取当前选中规格的key
		getCurrentSkuKey() {
			if (Array.isArray(this.seleceGoodsAtrrArray) && this.seleceGoodsAtrrArray.length > 0) {
				if (this.seleceGoodsAtrrArray.length > 1) {
					return [...this.seleceGoodsAtrrArray].sort((a, b) => Number(a) - Number(b)).join('_');
				}
				return `${this.seleceGoodsAtrrArray[0]}`;
			}
			if (this.selectedColor) {
				return `${this.selectedColor}`;
			}
			return '';
		},
		// 初始化或补齐默认数量
		initDefaultQuantity(forceReset = false) {
			const minLimit = this.minNum > 0 ? this.minNum : 1;
			const currentKey = this.getCurrentSkuKey();
			if (!currentKey) {
				this.goodsNum = minLimit;
				return;
			}
			const skuInfo = this.generateSkuMap(currentKey);
			const stockNumber = Number(
				skuInfo && skuInfo.product_number !== undefined ?
				skuInfo.product_number :
				(this.goodsDetail && this.goodsDetail.goods_number)
			) || 0;
			if (forceReset) {
				this.$delete(this.history, currentKey);
			}
			let currentCount = Number(this.history[currentKey]) || 0;
			// 修复：库存为0时，不应该自动设置为1，应该保持为0
			const defaultCount = stockNumber > 0 ? Math.min(stockNumber, Math.max(minLimit, 1)) : 0;
			if (forceReset || currentCount < defaultCount) {
				currentCount = defaultCount;
				if (currentCount > 0) {
				this.$set(this.history, currentKey, currentCount);
				} else {
					this.$delete(this.history, currentKey);
				}
			}
			this.onCurrentCountNum = currentCount;
			this.calculateTotals();
			const totalCount = this.totalQuantity > 0 ? this.totalQuantity : currentCount;
			this.goodsNum = totalCount > 0 ? totalCount : Math.max(minLimit, 1);
		},
		
		// 勾选商品属性
		selectGoodsAttr(res, val, num) {
			const that = this;

			// 更新选中数组前的当前SKU信息
			const prevSkuInfo = this.currentSkuInfo();

				if (that.seleceGoodsAtrrArray.includes(res.id)) {
					if (val.attr_type == 1) {
						// 单选属性 - 不处理（已选中）
					} else {
						// 多选属性 - 移除选中
						const index = that.seleceGoodsAtrrArray.indexOf(res.id);
						if (index !== -1) {
							that.seleceGoodsAtrrArray.splice(index, 1);
						}
						that.changeAttr();
					}
				} else {
					if (val.attr_type == 1) {
						// 单选属性 - 移除同组其他选中
						const groupIds = val.attr_key.map(item => item.id);
						that.seleceGoodsAtrrArray = that.seleceGoodsAtrrArray.filter(id =>
							!groupIds.includes(id)
						);

						// 添加当前选中
						that.seleceGoodsAtrrArray.push(res.id);
						this.selectedColor = res.id;
					} else {
						// 多选属性 - 添加选中
						that.seleceGoodsAtrrArray.push(res.id);
					}
					that.changeAttr();
					that.calculateTotals();
					that.initDefaultQuantity();
				}

				// 获取更新后的SKU信息
				const newSkuInfo = this.currentSkuInfo();
			},
			appShare() {
				var that = this
				// #ifdef H5
				let shareInfo = {
					// code_url: `${that.websiteUrl}/mobile/pagesC/goodsDetail/goodsDetail?id=${that.goodsId}`,
					href: that.websiteUrl + '/mobile/pagesC/goodsDetail/goodsDetail?id=' + that.goodsId +
						'&parent_id=' + uni.getStorageSync("user_id") + '&splatform=APP',
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.goodsDetail.goods_name,
					summary: that.goodsDetail.goods_brief,
					imageUrl: that.goodsDetail.goods_thumb
				};
				// #endif
				// #ifdef APP-PLUS
				let shareInfo = {
					href: that.websiteUrl + '/mobile/pagesC/goodsDetail/goodsDetail?id=' + that.goodsId +
						'&parent_id=' + uni.getStorageSync("user_id") + '&splatform=APP',
					// href: that.$websiteUrl + 'goods/' + that.goodsId + '?parent_id=' + that.user_id + '&splatform=APP',
					title: that.goodsDetail.goods_name,
					summary: that.goodsDetail.goods_brief,
					imageUrl: that.goodsDetail.goods_thumb
				};
				// #endif
				
				that.shareInfo(shareInfo, 'poster');
			},
			mpShare() {
				this.onGoodsShare();
			},
			onGoodsShare() {
				var that = this
				if (that.$isLogin()) {
					uni.showLoading({
						title: that.$t('lang.loading')
					});
					let price = that.goodsDetail.goods_price || that.goodsDetail.shop_price;
					let o = {}

					// #ifdef MP-WEIXIN
					o = {
						goods_id: that.goodsId,
						ru_id: 0,
						price: price,
						share_type: that.goodsDetail.is_distribution,
						type: 0,
						platform: 'MP-WEIXIN',
						code_url: 'pagesC/goodsDetail/goodsDetail',
						scene: `${that.goodsId}`,
						thumb: that.goodsDetail.gallery_list[0].img_url || that.goodsDetail.goods_img
					}
					// #endif

					// #ifdef APP-PLUS
					o = {
						goods_id: that.goodsId,
						price: price,
						share_type: that.goodsDetail.is_distribution,
						platform: 'APP',
						// code_url: `${that.$websiteUrl}goods/${that.goodsId}`,
						// thumb: that.goodsDetail.gallery_list[0].img_url || that.goodsDetail.goods_img
						code_url: `${that.websiteUrl}/mobile/pagesC/goodsDetail/goodsDetail?id=${that.goodsId}`,
						thumb: that.goodsDetail.gallery_list[0].img_url || that.goodsDetail.goods_img
					}
				
					// #endif
					// #ifdef H5
					o = {
						goods_id: that.goodsId,
						price: price,
						share_type: that.goodsDetail.is_distribution,
						platform: 'H5',
						code_url: `${that.websiteUrl}/mobile/pagesC/goodsDetail/goodsDetail?id=${that.goodsId}`,
						thumb: that.goodsDetail.gallery_list[0].img_url || that.goodsDetail.goods_img
					}
					// #endif
					that.$store
						.dispatch('setGoodsShare', o)
						.then(res => {
							if (res.status == 'success') {
								that.mpShareImg = res.data;
							
								// #ifdef MP-WEIXIN
								that.shareImgShow = true;
								// #endif

								// #ifdef APP-PLUS
								that.appShare();
								// #endif
								// #ifdef H5
								that.shareImgShow_1 = true
								// #endif
								uni.hideLoading();
							}
						});
				} else {
					uni.showModal({
						content: that.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}

				// #ifdef APP-PLUS
				that.sharePoster = false;
				// #endif
			},
			popupPosterCancel() {
				
				this.$refs.popupPoster.close();
				// #ifdef APP-PLUS
				this.sharePoster = false;
				// #endif
			},
			previewImage() {
				let that = this;
				let arr = [];
				arr.push(that.mpShareImg);
				uni.previewImage({
					current: 1,
					urls: arr,
					indicator: 'number',
					longPressActions: {
						itemList: [this.$t('lang.send_to_friend'), this.$t('lang.save_picture'), this.$t(
							'lang.collect')],
						success: function(data) {

						},
						fail: function(err) {

						}
					}
				});
			},
			async downloadImg() {
				var that = this;

				// #ifdef H5
				uni.downloadFile({
					url: that.mpShareImg,
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.showToast({
									title: that.$t('lang.picture_saved_success'),
									icon: 'none',
									duration: 1000,
									success: () => {
										that.$refs.popupPoster.close();
										that.sharePoster = false;
									}
								});
							}
						});
					}
				});
				// #endif
				// #ifndef H5
				var result = await permision.premissionCheck("CAMERA_EXTERNAL_STORAGE")
				if (result == 1) {
					// 此处处理各自业务 如：uni.chooseImage 
					uni.downloadFile({
						url: that.mpShareImg,
						success: res => {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: that.$t('lang.picture_saved_success'),
										icon: 'none',
										duration: 1000,
										success: () => {
											that.$refs.popupPoster.close();
											that.sharePoster = false;
										}
									});
								}
							});
						}
					});
				}
				// #endif
			},
			photo_showNo: function() {
				this.photo_show = false
				// uni.navigateBack()
			},
			photo_showYes: function() {
				var that = this
				that.photo_show = false
				uni.setStorageSync("photo_1", true);
				uni.downloadFile({
					url: that.mpShareImg,
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.showToast({
									title: that.$t('lang.picture_saved_success'),
									icon: 'none',
									duration: 1000,
									success: () => {
										that.$refs.popupPoster.close();
										that.sharePoster = false;
									}
								});
							}
						});
					}
				});
			},
			posterAppShare(type) {
				let that = this;
				let scene = type == 'weixin' ? 'WXSceneSession' : 'WXSenceTimeline';
				uni.share({
					provider: 'weixin',
					scene: scene,
					type: 2,
					imageUrl: that.mpShareImg
				});

				that.$refs.popupPoster.close();
				that.sharePoster = false;
			},
			// //选中其他地址
			// getRegionShow() {
			// 	this.addressRadio = '';

			// 	//关闭弹窗
			// 	this.regionShow = false;
			// 	this.closePop('address');
			// },
			//获取运费
			shippingFee(val) {
				this.$store.dispatch('setShippingFee', {
					goods_id: this.goodsId,
					position: JSON.stringify(val)
				});
			},
			handleStore() {
				this.$refs['goodsattr'].open();
				this.storeBtn = true;
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
				this.regionSplic = o.regionSplic;
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

			},
			onSku(type) {
				var that = this
				that.switchToImages();
				that.addType = type == 0 ? 1 : 2;
			
				if (that.attr.length > 0) {
					uni.showLoading({
						title: '加载中~'
					})
					uni.request({
						url: 'https://www.ok9288.com/api/goods/get_goods_barc_code',
						method: 'POST',
						data: {
							"goods_attr_id": that.seleceGoodsAtrrArray,
							"goods_id": that.goods_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res_1) => {
							uni.hideLoading()
							if (res_1.data.status == "success") {
								that.goodsDetail.upc = res_1.data.data
							}
						},
						fail: (err) => {
							console.error(err)
						}
					})
					
					// 在打开弹窗前，设置默认数量为1（如果库存足够且当前没有数量）
					that.initDefaultQuantity();
					
					that.$refs['goodsattr'].open();
				} else {
					if (that.addType == 2) {
						that.onAddCartClicked(10)
					} else {
						that.onAddCartClicked(0)
					}
				}
			},
			async onAddCartClicked(type) {
				if (this.$isLogin()) {
				
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
				// #ifndef H5
				let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				let version = Number(wgtinfo.version.replace(/\./g, ''));
				// #endif
				// #ifdef H5
				let version
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

				// uni.showToast({
				// 	title: that.$t('lang.added_to_cart'),
				// 	icon: 'success',
				// 	duration: 500
				// });

				// that.goodsDetail.cart_number = parseInt(that.goodsDetail.cart_number) + parseInt(that.goodsNum);

				//获取购物车数量
				// add 接口


				const couponStr = that.goodsCouponList.map(item => item.cou_id || '').join(',');

				that.closePop('goodsattr');
				
				that.$store.dispatch('setAddCartV1', {
					goods_id: that.goodsId,
					num: that.goodsNum,
					spec: newAttr,
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0',
					rec_type: type,
					app_version: version,
					// cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
					cou_id: couponStr
				}).then(res => {
					uni.hideLoading();

					const data = res && res.data ? res.data : {};

					if (data.error == 1) {
						uni.showToast({
							title: data.msg || that.$t('lang.add_cart_fail'),
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
						return;
					} else {
						// 统一处理后端返回的结果：
						// 1) 新接口：成功时只返回 { cart_info: [...], uc_id: 0 }
						// 2) 老接口：成功时返回 { status: true / 'success' / 1, ... }
						// 先按 "有没有 cart_info 或 uc_id >= 0" 判一次成功，再兼容老的 status 字段
						const hasCartInfo = Array.isArray(data.cart_info) && data.cart_info.length > 0;
						const hasUcId = typeof data.uc_id !== 'undefined' && data.uc_id >= 0;
						const rawStatus = typeof data.status !== 'undefined' ? data.status : data;
						const statusSuccess = rawStatus === true || rawStatus === 'success' || rawStatus === 1;
						const isSuccess = hasCartInfo || hasUcId || statusSuccess;

						console.log('[goodsDetail][add_v1 response] raw =', data);

						if (isSuccess) {
							if (type == 10) {
								// 立即购买时，清除 cat_rec_id 缓存
								uni.removeStorageSync('cat_rec_id');
								
								if (that.$isLogin()) {
									uni.navigateTo({
										url: '/pagesD/checkout/checkout?rec_type=10&uc_id=' + res.data
											.uc_id
									});
								} else {
									uni.showModal({
										content: that.$t('lang.login_user_not'),
										success: res => {
											if (res.confirm) {
												uni.navigateTo({
													url: '/pagesB/login/login?delta=1'
												});
											}
										}
									});
								}
							} else {
								that.addCartClass = true;
								uni.showToast({
									title: that.$t('lang.added_to_cart'),
									icon: 'success',
									duration: 500
								});
								//20250202 新增totalQuantity 替换原有goodsNum 
								that.goodsDetail.cart_number = parseInt(that.goodsDetail.cart_number) +
									parseInt(
										that.totalQuantity);

								// 详情页加购成功后：直接静默拉一遍购物车并覆盖缓存，确保切到购物车就是最新数量
								const cartParams = {
									warehouse_id: 0,
									area_id: 0,
									district_id: ''
								}
								if (that.regionData && that.regionData.district && that.regionData.district.id) {
									cartParams.district_id = that.regionData.district.id
								}
								console.log('[goodsDetail][add_v1 success] cart_info =', data && data.cart_info);
								that.$store.dispatch('setGoodsCart', cartParams).then((cartRes) => {
									try {
										const userId = uni.getStorageSync('user_id') || ''
										const cacheKey = `cart_cache_${userId}`
										const list = (cartRes && Array.isArray(cartRes.data)) ? cartRes.data : []
										console.log('[goodsDetail][setGoodsCart] fetched goodsCartList length =', list.length);
										let maxRecId = null
										const recLog = []
										list.forEach(store => {
											if (!store || !Array.isArray(store.new_list)) return
											store.new_list.forEach(act => {
												if (!act || !Array.isArray(act.act_goods_list)) return
												act.act_goods_list.forEach(goods => {
													const recId = goods && (goods.rec_id ?? goods.recid ?? goods.recId)
													if (recId === null || recId === undefined) return
													const n = Number(recId)
													if (Number.isNaN(n)) return
													recLog.push({ rec_id: recId, goods_number: goods.goods_number })
													if (maxRecId === null || n > maxRecId) maxRecId = n
												})
											})
										})
										console.log('[goodsDetail][setGoodsCart] about to cache rec list =', recLog);
										uni.setStorageSync(cacheKey, JSON.stringify({
											goodsCartList: list,
											lastRecId: maxRecId,
											timestamp: Date.now()
										}))
									} catch (e) {}
								}).catch(() => {})

								that.closePop('goodsattr');
							}
						} else {
							console.warn('[goodsDetail][add_v1 fail] status =', rawStatus, 'data =', data);
							const fallback =
								typeof rawStatus === 'string'
									? rawStatus
									: (that.$t && that.$t('lang.add_cart_fail'))
										? that.$t('lang.add_cart_fail')
										: '加入购物车失败';
							const msg = data.msg || fallback;
							uni.showToast({
								title: msg,
								icon: 'none',
								duration: 500
							});
						}
					}
				});
				
				}else {
					uni.showModal({
						content: this.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
			},
			//门店自提
			onStoreClicked() {
				if (this.$isLogin()) {
					uni.navigateTo({
						url: '/pagesC/store/store?id=' + this.goodsId + '&attr_id=' + this.seleceGoodsAtrrArray +
							'&num=' + this.goodsNum + '&isSingle=goods'
					});
				} else {
					uni.showModal({
						content: this.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
			},
		skuLink() {
			this.filterProductNumber();
			
			// 在打开弹窗前，设置默认数量为1（如果库存足够且当前没有数量）
			this.initDefaultQuantity();
			
			this.$refs['goodsattr'].open();
			// 控制规格按钮的状态
			this.specificationBtnType = true;
			this.addType = '';
		},
		onCart() {
			uni.switchTab({
				url: '/pages/cart/cart'
			});
			// 延迟触发，确保页面切换完成后再更新 tabbar 选中状态
			setTimeout(() => {
				uni.$emit('switch-tab');
			}, 100);
		},
			//关闭Popup
			handelClose(val) {
				if (val == 'coupon') {
					this.couponShow = false;
				} else if (val == 'promotion') {
					this.promotionShow = false;
				} else if (val == 'base') {
					this.showBase = false;
					this.storeBtn = false;
				} else if (val == 'volume') {
					this.volumePriceShow = false;
				} else if (val == 'mpshare') {
					this.mpShareShow = false;
				} else if (val == 'mpshareImg') {
					this.shareImgShow = false;
				}
			},
			//属性图片切换相册图
			onSelectImg(item, index) {
				let gallery_index = this.swiperData.findIndex(v => v.img_url == item.attr_gallery_flie);
				this.attrColorIndex = index;

				if (gallery_index != undefined) {
					this.current = gallery_index;
				}

				if (item.attr_img_site) {
					this.$outerHref(item.attr_img_site);
				}
			},
			historyAdd() {
				let time = new Date().getTime();
				let price = this.goodsDetail.shop_price_formated;
				// 获取历史记录
				this.$store.dispatch('setHistoryAdd', {
					id: this.goodsDetail.goods_id,
					name: this.goodsDetail.goods_name,
					img: this.goodsDetail.goods_thumb,
					price: price,
					addtime: time
				});
			},
			goodsAloneSale() {
				uni.navigateTo({
					url: `/pagesD/goodslist/goodslist?id=${this.goodsDetail.cat_id}`
				})
			},
			//视频号直播
			liveHref() {
				//视频号直播跳转
				uni.openChannelsLive({
					finderUserName: uni.getStorageSync('configData').wxapp_media_id || 'sphpSsGkwkBzWJI',
					feedId: uni.getStorageSync('channelsLive').feedId || '',
					nonceId: uni.getStorageSync('channelsLive').nonceId || '',
				})
			},
			preview(url) {
				let urlArr = [];
				urlArr.push(url);

				uni.previewImage({
					current: 1,
					urls: urlArr,
					longPressActions: {
						itemList: [this.$t('lang.save_picture'), this.$t('lang.recognition_qr_code'), this.$t(
							'lang.qr_code')],
						success: (res) => {

						}
					}
				})
			},

			// 主图全部勾选
			check_main_image_list() {
				var that = this
				if (that.main_image_list_checked == false) {
					that.main_image_list_checked = true
					for (var i = 0; i < that.main_image_list.length; i++) {
						that.main_image_list[i].checked = true
						that.lenlent_list.push(that.main_image_list[i].url)
					}
					if (that.main_image_list.length > 0 && that.attr_image_list.length == 0 && that.detail_image_list
						.length == 0) {
						if (that.main_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.main_image_list.length > 0 && that.attr_image_list.length > 0 && that.detail_image_list
						.length == 0) {
						if (that.main_image_list_checked == true && that.attr_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.main_image_list.length > 0 && that.detail_image_list.length > 0 && that.attr_image_list
						.length == 0) {
						if (that.main_image_list_checked == true && that.detail_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.main_image_list.length > 0 && that.attr_image_list.length > 0 && that.detail_image_list
						.length > 0) {
						if (that.main_image_list_checked == true && that.attr_image_list_checked == true && that
							.detail_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
				} else {
					that.main_image_list_checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.main_image_list.length; i++) {
						that.main_image_list[i].checked = false
					}

					that.lenlent_list = that.lenlent_list.filter((item1) => !that.main_image_list.some((item2) => item1 ===
						item2.url));
				}
			},

			// 主图单个勾选 
			check_main_image_list_detail(item, index) {
				var that = this
				if (that.main_image_list[index].checked == false) {
					that.main_image_list[index].checked = true
					that.lenlent_list.push(that.main_image_list[index].url)
				} else {
					that.main_image_list[index].checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.lenlent_list.length; i++) {
						if (that.lenlent_list[i] == that.main_image_list[index].url) {
							that.lenlent_list.splice(i, 1)
						}
					}
				}

				var abc = that.main_image_list.every((item) => item.checked == true);
				if (abc == true) {
					that.main_image_list_checked = true
				} else {
					that.main_image_list_checked = false
				}

				if (that.main_image_list.length > 0 && that.attr_image_list.length == 0 && that.detail_image_list.length ==
					0) {
					if (that.main_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.main_image_list.length > 0 && that.attr_image_list.length > 0 && that.detail_image_list.length ==
					0) {
					if (that.main_image_list_checked == true && that.attr_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.main_image_list.length > 0 && that.detail_image_list.length > 0 && that.attr_image_list.length ==
					0) {
					if (that.main_image_list_checked == true && that.detail_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.main_image_list.length > 0 && that.attr_image_list.length > 0 && that.detail_image_list.length >
					0) {
					if (that.main_image_list_checked == true && that.attr_image_list_checked == true && that
						.detail_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				that.lenlent_list = [...new Set(that.lenlent_list)]
			},

			// 规格图全部勾选
			check_attr_image_list() {
				var that = this
				that.lenlent_list = [...new Set(that.lenlent_list)]
				if (that.attr_image_list_checked == false) {
					that.attr_image_list_checked = true
					for (var i = 0; i < that.attr_image_list.length; i++) {
						that.attr_image_list[i].checked = true
						that.lenlent_list.push(that.attr_image_list[i].url)
					}

					if (that.attr_image_list.length > 0 && that.main_image_list.length == 0 && that.detail_image_list
						.length == 0) {
						if (that.attr_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.attr_image_list.length > 0 && that.main_image_list.length > 0 && that.detail_image_list
						.length == 0) {
						if (that.attr_image_list_checked == true && that.main_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.attr_image_list.length > 0 && that.detail_image_list.length > 0 && that.main_image_list
						.length == 0) {
						if (that.attr_image_list_checked == true && that.detail_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.attr_image_list.length > 0 && that.main_image_list.length > 0 && that.detail_image_list
						.length > 0) {
						if (that.attr_image_list_checked == true && that.main_image_list_checked == true && that
							.detail_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
				} else {
					that.attr_image_list_checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.attr_image_list.length; i++) {
						that.attr_image_list[i].checked = false
					}

					that.lenlent_list = that.lenlent_list.filter((item1) => !that.attr_image_list.some((item2) => item1 ===
						item2.url));
				}
			},

			// 规格图单个勾选
			check_attr_image_list_detail(item, index) {
				var that = this
				if (that.attr_image_list[index].checked == false) {
					that.attr_image_list[index].checked = true
					that.lenlent_list.push(that.attr_image_list[index].url)
				} else {
					that.attr_image_list[index].checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.lenlent_list.length; i++) {
						if (that.lenlent_list[i] == that.attr_image_list[index].url) {
							that.lenlent_list.splice(i, 1)
						}
					}
				}

				var abc = that.attr_image_list.every((item) => item.checked == true);
				if (abc == true) {
					that.attr_image_list_checked = true
				} else {
					that.attr_image_list_checked = false
				}

				if (that.attr_image_list.length > 0 && that.main_image_list.length == 0 && that.detail_image_list.length ==
					0) {
					if (that.attr_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.attr_image_list.length > 0 && that.main_image_list.length > 0 && that.detail_image_list.length ==
					0) {
					if (that.attr_image_list_checked == true && that.main_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.attr_image_list.length > 0 && that.detail_image_list.length > 0 && that.main_image_list.length ==
					0) {
					if (that.attr_image_list_checked == true && that.detail_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.attr_image_list.length > 0 && that.main_image_list.length > 0 && that.detail_image_list.length >
					0) {
					if (that.attr_image_list_checked == true && that.main_image_list_checked == true && that
						.detail_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				that.lenlent_list = [...new Set(that.lenlent_list)]
			},

			// 详情图全部勾选
			check_detail_image_list() {
				var that = this
				that.lenlent_list = [...new Set(that.lenlent_list)]
				if (that.detail_image_list_checked == false) {
					that.detail_image_list_checked = true
					for (var i = 0; i < that.detail_image_list.length; i++) {
						that.detail_image_list[i].checked = true
						that.lenlent_list.push(that.detail_image_list[i].url)
					}

					if (that.detail_image_list.length > 0 && that.main_image_list.length == 0 && that.attr_image_list
						.length == 0) {
						if (that.detail_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.detail_image_list.length > 0 && that.main_image_list.length > 0 && that.attr_image_list
						.length == 0) {
						if (that.detail_image_list_checked == true && that.main_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.detail_image_list.length > 0 && that.attr_image_list.length > 0 && that.main_image_list
						.length == 0) {
						if (that.detail_image_list_checked == true && that.attr_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
					if (that.detail_image_list.length > 0 && that.attr_image_list.length > 0 && that.main_image_list
						.length > 0) {
						if (that.detail_image_list_checked == true && that.attr_image_list_checked == true && that
							.main_image_list_checked == true) {
							that.image_list_all_checked = true
						}
					}
				} else {
					that.detail_image_list_checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.detail_image_list.length; i++) {
						that.detail_image_list[i].checked = false
					}

					that.lenlent_list = that.lenlent_list.filter((item1) => !that.detail_image_list.some((item2) =>
						item1 === item2.url));
				}
			},

			// 详情图单个勾选
			check_detail_image_list_detail(item, index) {
				var that = this
				if (that.detail_image_list[index].checked == false) {
					that.detail_image_list[index].checked = true
					that.lenlent_list.push(that.detail_image_list[index].url)
				} else {
					that.detail_image_list[index].checked = false
					that.image_list_all_checked = false
					for (var i = 0; i < that.lenlent_list.length; i++) {
						if (that.lenlent_list[i] == that.detail_image_list[index].url) {
							that.lenlent_list.splice(i, 1)
						}
					}
				}

				var abc = that.detail_image_list.every((item) => item.checked == true);
				if (abc == true) {
					that.detail_image_list_checked = true
				} else {
					that.detail_image_list_checked = false
				}

				if (that.detail_image_list.length > 0 && that.main_image_list.length == 0 && that.attr_image_list.length ==
					0) {
					if (that.detail_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.detail_image_list.length > 0 && that.main_image_list.length > 0 && that.attr_image_list.length ==
					0) {
					if (that.detail_image_list_checked == true && that.main_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.detail_image_list.length > 0 && that.attr_image_list.length > 0 && that.main_image_list.length ==
					0) {
					if (that.detail_image_list_checked == true && that.attr_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				if (that.detail_image_list.length > 0 && that.attr_image_list.length > 0 && that.main_image_list.length >
					0) {
					if (that.detail_image_list_checked == true && that.attr_image_list_checked == true && that
						.main_image_list_checked == true) {
						that.image_list_all_checked = true
					}
				}
				that.lenlent_list = [...new Set(that.lenlent_list)]
			},

			// 图片全部勾选
			check_image_list_all() {
				var that = this
				if (that.image_list_all_checked == false) {
					that.main_image_list_checked = true
					that.attr_image_list_checked = true
					that.detail_image_list_checked = true
					that.image_list_all_checked = true
					for (var i = 0; i < that.main_image_list.length; i++) {
						that.main_image_list[i].checked = true
						that.lenlent_list.push(that.main_image_list[i].url)
					}
					for (var i = 0; i < that.attr_image_list.length; i++) {
						that.attr_image_list[i].checked = true
						that.lenlent_list.push(that.attr_image_list[i].url)
					}
					for (var i = 0; i < that.detail_image_list.length; i++) {
						that.detail_image_list[i].checked = true
						that.lenlent_list.push(that.detail_image_list[i].url)
					}
					that.lenlent_list = [...new Set(that.lenlent_list)]
				} else {
					that.image_list_all_checked = false
					that.main_image_list_checked = false
					that.attr_image_list_checked = false
					that.detail_image_list_checked = false
					for (var i = 0; i < that.main_image_list.length; i++) {
						that.main_image_list[i].checked = false
					}
					for (var i = 0; i < that.attr_image_list.length; i++) {
						that.attr_image_list[i].checked = false
					}
					for (var i = 0; i < that.detail_image_list.length; i++) {
						that.detail_image_list[i].checked = false
					}
					that.lenlent_list = []
				}
			},

			ondownloadimage() {
				const that = this;
				if (that.lenlent_list.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '未选择保存的图片'
					});
					return;
				}

				uni.showLoading({
					title: '保存中...',
					mask: true
				});

				let successCount = 0;
				const totalCount = that.lenlent_list.length;

				// 递归保存函数
				const saveImage = async (index) => {
					if (index >= that.lenlent_list.length) {
						// 所有图片处理完成
						that._resetImageSelection();
						uni.hideLoading();
						uni.showToast({
							icon: 'success',
							title: `成功保存${successCount}/${totalCount}张图片`
						});
						that.closePop('goodsimage');
						return;
					}

					const imageUrl = that.lenlent_list[index];

					try {
						// #ifdef H5
						await that._h5SaveImage(imageUrl);
						// #endif

						// #ifdef APP-PLUS
						await that._appSaveImage(imageUrl);
						// #endif

						// #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU
						await that._mpSaveImage(imageUrl);
						// #endif

						successCount++;
					} catch (error) {
						console.error(`图片${index+1}保存失败:`, error);
					}

					// 处理下一张
					saveImage(index + 1);
				};

				// 开始保存
				saveImage(0);
			},

			// 重置图片选择状态
			_resetImageSelection() {
				this.image_list_all_checked = false;

				[this.main_image_list, this.attr_image_list, this.detail_image_list].forEach(list => {
					if (list && list.length > 0) {
						list.forEach(item => item.checked = false);
					}
				});

				this.lenlent_list = [];
			},


			// 修改后的H5保存方法
			_h5SaveImage(imageUrl) {
				return new Promise(async (resolve, reject) => {
					try {
						// 尝试直接下载
						await this._h5DirectDownload(imageUrl);
						resolve();
					} catch (error) {
						console.error('直接下载失败，尝试备用方案:', error);

						try {
							// 尝试使用Canvas方案
							await this._h5CanvasDownload(imageUrl);
							resolve();
						} catch (canvasError) {
						

							// 最后手段：引导用户手动保存
							this._h5FallbackSave(imageUrl);
							reject(new Error('请手动保存图片'));
						}
					}
				});
			},

			// 直接下载方法
			_h5DirectDownload(imageUrl) {
				return new Promise(async (resolve, reject) => {
					try {
						const response = await fetch(imageUrl, {
							mode: 'cors',
							credentials: 'omit'
						});

						if (!response.ok) throw new Error('网络响应不正常');

						const blob = await response.blob();
						const blobUrl = URL.createObjectURL(blob);

						const a = document.createElement('a');
						a.style.display = 'none';
						a.href = blobUrl;
						a.download = this._getFilenameFromUrl(imageUrl);

						document.body.appendChild(a);
						a.click();

						setTimeout(() => {
							document.body.removeChild(a);
							URL.revokeObjectURL(blobUrl);
							resolve();
						}, 100);
					} catch (error) {
						reject(error);
					}
				});
			},

			// 从URL提取文件名
			_getFilenameFromUrl(url) {
				const filename = url.substring(url.lastIndexOf('/') + 1);
				return filename.match(/\.(jpe?g|png|gif)$/i) ?
					filename :
					`image_${Date.now()}.jpg`;
			},

			// Canvas备用方案
			_h5CanvasDownload(imageUrl) {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.crossOrigin = 'Anonymous';

					img.onload = function() {
						try {
							const canvas = document.createElement('canvas');
							canvas.width = img.width;
							canvas.height = img.height;
							const ctx = canvas.getContext('2d');
							ctx.drawImage(img, 0, 0);

							canvas.toBlob((blob) => {
								const blobUrl = URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = blobUrl;
								a.download = `image_${Date.now()}.jpg`;
								a.style.display = 'none';
								document.body.appendChild(a);
								a.click();

								setTimeout(() => {
									document.body.removeChild(a);
									URL.revokeObjectURL(blobUrl);
									resolve();
								}, 100);
							}, 'image/jpeg', 0.8);
						} catch (error) {
							reject(error);
						}
					};

					img.onerror = reject;
					img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now(); // 避免缓存 // 避免缓存
				});
			},

			// 最终备用方案
			_h5FallbackSave(imageUrl) {
				uni.showModal({
					title: '图片保存',
					content: '请手动保存图片',
					confirmText: '打开图片',
					success: (res) => {
						if (res.confirm) {
							window.open(imageUrl, '_blank');
						}
					}
				});
			},

			// App保存图片方法
			_appSaveImage(imageUrl) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url: imageUrl,
						success(res) {
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: resolve,
									fail: reject
								});
							} else {
								reject(new Error('下载失败'));
							}
						},
						fail: reject
					});
				});
			},

			// 小程序保存图片方法
			_mpSaveImage(imageUrl) {
				return new Promise((resolve, reject) => {
					// 小程序可以直接使用getImageInfo
					uni.getImageInfo({
						src: imageUrl,
						success(res) {
							// 微信小程序可以直接保存网络图片
							// #ifdef MP-WEIXIN
							uni.saveImageToPhotosAlbum({
								filePath: res.path,
								success: resolve,
								fail: reject
							});
							// #endif

							// 其他小程序可能需要先下载
							// #ifndef MP-WEIXIN
							uni.downloadFile({
								url: imageUrl,
								success(dRes) {
									if (dRes.statusCode === 200) {
										uni.saveImageToPhotosAlbum({
											filePath: dRes.tempFilePath,
											success: resolve,
											fail: reject
										});
									} else {
										reject(new Error('下载失败'));
									}
								},
								fail: reject
							});
							// #endif
						},
						fail: reject
					});
				});
			},

			// ondownloadimage() {
			// 	var that = this
			// 	if (that.lenlent_list.length == 0) {
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '未选择保存的图片'
			// 		})
			// 	} else {
			// 		uni.showToast({
			// 			icon: 'loading',
			// 			title: '保存中'
			// 		})
			// 		for (let ii = 0; ii < that.lenlent_list.length; ii++) {
			// 			uni.downloadFile({
			// 				url: that.lenlent_list[ii],
			// 				success(res) {
			// 					if (res.statusCode === 200) {
			// 						uni.saveImageToPhotosAlbum({
			// 							filePath: res.tempFilePath,
			// 							success(rs) {
			// 								if (ii == that.lenlent_list.length - 1) {
			// 									console.log(ii)
			// 									console.log(that.lenlent_list.length)
			// 									that.image_list_all_checked = false
			// 									if (that.main_image_list.length > 0) {
			// 										that.main_image_list_checked = false
			// 										for (var i = 0; i < that.main_image_list.length; i++) {
			// 											that.main_image_list[i].checked = false
			// 										}
			// 									}
			// 									if (that.attr_image_list.length > 0) {
			// 										that.attr_image_list_checked = false
			// 										for (var i = 0; i < that.attr_image_list.length; i++) {
			// 											that.attr_image_list[i].checked = false
			// 										}
			// 									}
			// 									if (that.detail_image_list.length > 0) {
			// 										that.detail_image_list_checked = false
			// 										for (var i = 0; i < that.detail_image_list
			// 											.length; i++) {
			// 											that.detail_image_list[i].checked = false
			// 										}
			// 									}

			// 									that.lenlent_list = []
			// 									that.closePop('goodsimage');
			// 									uni.showToast({
			// 										icon: 'success',
			// 										title: '保存成功'
			// 									})
			// 								}
			// 								console.log('保存成功')
			// 							},
			// 							fail(err) {
			// 								console.log('保存失败')
			// 							}
			// 						})
			// 					}
			// 				}
			// 			})
			// 		}
			// 	}
			// },
			// 
			showRefundNoClose() {
				this.shareImgShow_1 = false
			},
			jumpTo() {
				var that = this
				if (that.$isLogin()) {
					that.$store.dispatch('setGoPuHuo', {
						goods_id: that.goodsId,
					}).then(res => {

						if (res.data.error == 1) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 500
							});
						} else {
							if (res && res.data) {
								uni.showToast({
									title: res.data,
									icon: 'none',
									duration: 500
								});
							}
							setTimeout(() => {
								const token = encodeURIComponent(uni.getStorageSync('token') || '')
								const clientHash = encodeURIComponent(uni.getStorageSync('client_hash') || '')
								// #ifdef H5
								const host = window.location.host || ''
								const isLocalDev = host.indexOf('localhost:8080') > -1 || host.indexOf('127.0.0.1:8080') > -1
								if (isLocalDev) {
									// 本地调试：走 h5-proxy（B 方案）
									window.location.href = `http://localhost:9000/pagesC/waimaibinding/waimaibinding.html?token=${token}&client_hash=${clientHash}`
								} else {
									// 线上：走站点 /mobile 静态路径
									window.location.href = `${window.location.origin}/mobile/pagesC/waimaibinding/waimaibinding.html?token=${token}&client_hash=${clientHash}`
								}
								// #endif
								// #ifndef H5
								uni.navigateTo({
									url: `/pagesC/waimaibinding/waimaibinding?token=${token}&client_hash=${clientHash}`
								});
								// #endif
							}, 600)
						}
					})
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





			//去代发下单页面
			junpToWebview(path) {
				// 点击跳转到外部
				let url = this.goodsDetail.edm_url // URL是要跳转的外部地址 作为参数
				// uni.navigateTo({
				// 	url: '/pagesC/webview/webview?url=' + encodeURIComponent(url) + '&isDirect=true'
				// })
				this.articleId = url.match(/-(\d+)\./)[1]
				
				this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				// uni.setStorageSync("webtitle", '资讯内容');
				// this.$outerHref(url)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sysbox {
		position: fixed;
		bottom: 200rpx;
	}

	.ml-20 {
		margin: 0 20rpx;
	}

	.goods-detail_content {
		padding-bottom: 120rpx;
		overflow: hidden;

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
			flex: 1;
			display: flex;
			justify-content: space-between;
		}

		.sizes {
			.attr_list_box_label {
				display: flex;
						width: 100%;
				.attr_top_num_box {
					.attr_top_num {
						image,
						::v-deep uni-image {
							width: 80rpx !important;
							height: 80rpx !important;
							border-radius: 12rpx;
							margin-right: 16rpx;
							margin-top: 0rpx;
						}
					}
				}
			}
		}

		.size-item {
			width: 100%;
			display: flex;
			flex-direction: column;
			margin-bottom: 44rpx;
			padding: 0rpx;
			border-radius: 8rpx;
		}

		.spec-info-row {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 8rpx;
		}

		.spec-info-left {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex: 1;
		}

		.spec-info-image {
			flex-shrink: 0;
			margin-right: 16rpx;

			image,
			::v-deep uni-image {
				width: 80rpx !important;
				height: 80rpx !important;
				border-radius: 12rpx;
			}
		}

		.counter {
			display: flex;
			align-items: center;
			flex-shrink: 0;
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
			flex-direction: column;
			flex: 1;
			margin-right: 20rpx;

			.spec-info-text {
				font-weight: bold;
				font-size: 14px;
				color: #272727;
				margin-bottom: 8rpx;
			}

			.spec-info-price {
				font-weight: 400;
				font-size: 12px;
				color: #999999;
			}
		}

		.spec-info-text {
			font-weight: bold;
			font-size: 14px;
			color: #272727;
			flex: 1;
			word-break: break-all;
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




		// 2
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

		/* end--Retina 屏幕下的 1px 边框--end */

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

		/* end--去除button的所有默认样式--end */

		/* 导航 start */
		.nav_bar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			background-color: rgba(0, 0, 0, 0);
			z-index: 96;

			.status_bar {
				height: var(--status-bar-height);
				width: 100%;
			}

			.wx_nav_bar {
				width: 100%;

				.wx_nav_left {
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					border: 1px solid rgba(0, 0, 0, 0.1);
					background-color: rgba(255, 255, 255, 0.6);
					box-sizing: border-box;
					z-index: 96;

					.icon-find-fanhui {
						font-size: 15px;
					}

					.line {
						width: 1px;
						height: 18px;
						margin: 0 8px;
						background-color: rgba(252, 252, 252, 0.3);
					}

					.shortcut {
						position: absolute;
						left: 0;
						top: 44px;
						display: flex;
						flex-direction: column;
						border-radius: 12rpx;
						background-color: rgba(255, 255, 255, 0.95);
						z-index: 101;

						&:before {
							content: '';
							position: absolute;
							left: 44px;
							top: -26rpx;
							transform: translateX(50%);
							width: 0;
							height: 0;
							line-height: 0;
							font-size: 0;
							border: 14rpx solid transparent;
							border-bottom-color: rgba(255, 255, 255, 0.95);
						}
					}

					.shortcut_item {
						width: 290rpx;
						height: 95rpx;
						line-height: 95rpx;
						padding: 0 36rpx;
						font-size: 30rpx;
						text-align: left;
						color: #000;
						box-sizing: border-box;
							display: flex;
						    box-sizing: border-box;
						    align-items: center;
						.iconfont {
							margin-right: 12rpx;
							font-size: 44rpx;
							color: #000 !important;
							vertical-align: -6rpx;
						}
					}
				}


				.nav_c_label {
					display: flex;
					justify-content: space-evenly;
					width: 90%;
					padding: 10rpx 30rpx;

					.nav_c {
						display: flex;
						justify-content: space-between;
						align-items: center;
						opacity: 1;
						width: 100%;
						background-color: #fff;




						.nav_item {
							margin: 0 7px;
							font-size: 15px;
						}

						.active_nav {
							position: relative;
							font-size: 16px;
							font-weight: 700;

							&:after {
								content: '';
								position: absolute;
								bottom: 0;
								left: 0;
								width: 100%;
								height: 3px;
								background: linear-gradient(90deg, #F91F28 0%, rgba(255, 79, 46, 0.35) 100%);
							}
						}
					}
				}

			}

			.nav_list {
				display: flex;
				justify-content: space-between;
				align-items: center;

				height: 64px;
				flex-direction: column;

				.nav-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-direction: row;
					width: 100%;

					.nav-top-left {
						display: flex;
						align-items: center;
						justify-content: flex-start;

						.search-label {

							width: 400rpx;

						}
					}
				}

				.iconfont {
					padding-top: 2px;
					font-size: 14px;
				}
			}

			.icon_wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 26px;
				height: 26px;
				border-radius: 50%;
				color: #fff;
				background-color: rgba(0, 0, 0, 0.4);
			}

			.nav_l {
				width: 26px;
				height: 26px;
				margin-left: 10px;

				.iconfont {
					padding-top: 1px;
				}
			}

			.nav_c_label {
				display: flex;
				justify-content: space-evenly;
				width: 90%;
				padding: 10rpx 30rpx;

				.nav_c {
					display: flex;
					justify-content: space-between;
					align-items: center;
					opacity: 1;
					width: 100%;
					background-color: #fff;




					.nav_item {
						margin: 0 7px;
						font-size: 15px;
					}

					.active_nav {
						position: relative;
						font-size: 16px;
						font-weight: 700;

						&:after {
							content: '';
							position: absolute;
							bottom: 0;
							left: 0;
							width: 100%;
							height: 3px;
							background: linear-gradient(90deg, #F91F28 0%, rgba(255, 79, 46, 0.35) 100%);
						}
					}
				}
			}

			.nav_r {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 26px;
				margin-right: 10px;

				.icon_car_num {
					position: relative;

					.info_num {
						position: absolute;
						top: -8rpx;
						left: 50%;
						transform: translateX(8rpx);
						min-width: 24rpx;
						height: 24rpx;
						text-align: center;
						line-height: 24rpx;
						opacity: 0.85;
						// border-radius: 50%;
						border-radius: 8px;
						// border: 2rpx solid #F91F28;
						font-size: 20rpx;
						color: #F91F28;
						background-color: #fff;
						z-index: 1;
						padding: 2rpx;

					}

					.top-right-car {
						background: #272727;
						opacity: 0.35;
						border-radius: 50%;
						padding: 8rpx 6rpx;
						font-size: 12rpx;
					}
				}


				.icon_wrap:last-child {
					position: relative;
					margin-left: 10px;

					.shortcut {
						position: absolute;
						right: 0;
						top: 44px;
						display: flex;
						flex-direction: column;
						border-radius: 12rpx;
						background-color: rgba(255, 255, 255, 0.95);
						z-index: 101;

						&:before {
							content: '';
							position: absolute;
							right: 26rpx;
							top: -26rpx;
							transform: translateX(50%);
							width: 0;
							height: 0;
							line-height: 0;
							font-size: 0;
							border: 14rpx solid transparent;
							border-bottom-color: rgba(255, 255, 255, 0.95);
						}
					}

					.shortcut_item {
						width: 290rpx;
						height: 95rpx;
						line-height: 95rpx;
						padding: 0 36rpx;
						font-size: 30rpx;
						text-align: left;
						color: #000;
						box-sizing: border-box;
						    display: flex;
						    box-sizing: border-box;
						    align-items: center;

						.iconfont {
							margin-right: 12rpx;
							font-size: 44rpx;
							color: #000 !important;
							vertical-align: -6rpx;
						}
					}
				}
			}
		}

		/* 导航 end */

		/* 商品轮播 start */
		.swiper_warp {
			position: relative;
			width: 100%;
			height: 750rpx;
			.swiper {
				width: 100%;
				height: 750rpx;

				.swiper_img {
					width: 100%;
					height: 750rpx;
				}
			}

			.indicator_dots {
				position: absolute;
				bottom: 60rpx;
				right: 0;
				min-width: 100rpx;
				height: 50rpx;
				padding: 0 10rpx;
				line-height: 50rpx;
				border-top-left-radius: 25rpx;
				border-bottom-left-radius: 25rpx;
				text-align: center;
				box-sizing: border-box;
				color: #fff;
				z-index: 10;
				background-color: rgba(41, 47, 54, 0.4);

				.curr_dots {
					font-size: 34rpx;
				}
			}

			.video_ico {
				position: absolute;
				bottom: 20rpx;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				align-items: center;
				height: 60rpx;
				padding: 0 12rpx;
				border-radius: 30rpx;
				background-color: rgba(255, 255, 255, 0.8);
				z-index: 10;
				gap: 20rpx;
				/* 添加按钮间距 */

				.controls_pause {
					height: 44rpx;
					line-height: 44rpx;
					padding: 0 24rpx;
					border-radius: 22rpx;
					text-align: center;
					font-size: 24rpx;
					background-color: rgba(255, 255, 255, 0.3);
					/* 半透明背景 */
					color: rgba(0, 0, 0, 0.6);
					/* 文字颜色 */
					transition: all 0.3s ease;
				}

				.controls_pause.active {
					background-color: #FF5E4D;
					/* 选中时背景色 */
					color: #fff;
					/* 选中时文字颜色 */
				}
			}
		}

		/* 商品轮播 end */

		/* 视频 start */
		.video_wrap {
			width: 100%;
			height: 750rpx;

			.video {
				display: block;
				width: 100%;
				height: 750rpx;
				object-fit: cover;
			}

			.controls_pause_wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100rpx;
				background-color: #000;
				gap: 20rpx;
				/* 添加按钮间距 */
			}

			.controls_pause {
				height: 52rpx;
				line-height: 52rpx;
				padding: 0 30rpx;
				border-radius: 26rpx;
				text-align: center;
				font-size: 24rpx;
				background-color: rgba(255, 255, 255, 0.3);
				/* 半透明背景 */
				color: rgba(255, 255, 255, 0.8);
				/* 文字颜色 */
				transition: all 0.3s ease;
			}

			.controls_pause.active {
				background-color: rgba(255, 255, 255, 0.8);
				/* 选中时背景更亮 */
				color: #000;
				/* 选中时文字颜色变深 */
			}
		}

		/* 视频 end */
		.goods-detail-box {
			padding: 32rpx 20rpx 0 20rpx;
		}

		.goods-detail-title {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #999999;
			line-height: 32rpx;
			text-align: justify;
			font-style: normal;
			padding: 15px;
			text-align: center;

			.goods-detail-text {
				margin: 0 17px;
			}

			.text-left,
			.text-right {
				width: 80rpx;
				display: inline-block;
				margin-bottom: 3px;
				border: 1rpx solid #979797;
			}
		}

		.certificate {
			display: flex;
			flex-direction: column;
			padding: 30rpx;

			.certificate_top {
				display: flex;
				justify-content: space-between;
				font-weight: bold;
				font-size: 16px;
				color: #4D4B4B;
			}

			.certificate_bot {
				background: #F1F1F1;
				border-radius: 4px;
				padding: 12rpx 20rpx;
				font-weight: bold;
				font-size: 14px;
				color: #272727;
				margin-top: 20rpx;
			}
		}

		.goods_module_wrap {
			border-radius: 22rpx;
			background-color: #fff;

			.open_membership {
				display: flex;
				font-weight: 400;
				font-size: 28rpx;
				color: #626262;
				margin-right: 22rpx;
			}
		}

		.mt_20 {

			margin-top: 20rpx;
		}

		.goods_module_btn {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 40rpx;
			min-width: 228rpx;
			height: 62rpx;
			line-height: 58rpx;
			border-radius: 33rpx;
			border: 2rpx solid #F9F9F9;
			text-align: center;
		}

		.stockout_zhanwei {
			height: 70rpx;
		}

		/* 商品基本信息 start */
		.activity_goods {
			position: relative;
			overflow: hidden;

			.activity_goods_pic {
				width: 100%;
				display: block;
				height: 190rpx;
				// overflow: hidden;
				
				.img {
					width: 100%;
					height: 100%;
				}
			}

			.activity_goods_left {
				position: absolute;
				top: 0;
				left: 20rpx;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				// padding: 10rpx 0;
				
				// 第1部分：顶部标签行
				.activity-goods-top-row {
					display: flex;
					align-items: center;
					// justify-content: space-between;
					width: 100%;
					
					
					.top-row-left {
						display: flex;
						align-items: center;
						
						.platform-min-icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 8rpx;
							flex-shrink: 0;
						}
						
						.platform-min-text {
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 1.2;
						}
					}
					
					.sales-count-text {
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 1.2;
						white-space: nowrap;
					}
				}
				
				// 第2部分：商品金额
				.activity-goods-price {
					margin-bottom: 6rpx;
				}
				
				// 第3部分：已优惠标签
				.activity-goods-discount {
					display: flex;
					align-items: center;
					background-color: #FFFFFF;
					border-radius: 8rpx;
					padding: 8rpx 16rpx;
					
					.discount-icon {
						width: 32rpx;
						height: 32rpx;
						margin-right: 8rpx;
						flex-shrink: 0;
					}
					
					.discount-text {
						font-size: 24rpx;
						color: #FE2F02;
						line-height: 1.2;
					}
				}
			}

			.activity_goods_right {
				position: absolute;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				bottom: 20rpx;
				right: 150rpx;
				transform: translateX(50%);

				.count_down_txt {
					margin-bottom: 10rpx;
					font-size: 20rpx;
					line-height: 1;
					color: #FF3616;
				}
			}
		}

		.goods_base_info {
			border-top-right-radius: 0;
			border-top-left-radius: 0;
			padding: 10rpx 30rpx 30rpx;

			// 新人券模块
			.new-member-coupon {
				display: flex;
				width: 95%;
				align-items: center;
				background-color: #FE2F02;
				border-radius: 20rpx;
				padding: 20rpx 24rpx;
				margin: 20rpx 0;
				position: relative;
				
				// 左侧金额区域
				.coupon-amount-section {
					display: flex;
					align-items: baseline;
					margin-right: 24rpx;
					
					.currency-symbol {
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 1;
					}
					
					.amount-value {
						font-size: 40rpx;
						margin-left: 10rpx;
						color: #FFFFFF;
						font-weight: bold;
						line-height: 1;
					}
				}
				
				// 中间虚线分割
				.coupon-divider {
					position: relative;
					width: 2rpx;
					height: 60rpx;
					margin: 0 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.divider-line {
						position: relative;
						width: 1rpx;
						height: 100%;
						background: repeating-linear-gradient(
							to bottom,
							#FFFFFF 0,
							#FFFFFF 4rpx,
							transparent 4rpx,
							transparent 8rpx
						);
						
						&::before {
							content: '';
							position: absolute;
							left: 50%;
							top: -30rpx;
							transform: translateX(-50%);
							width: 20rpx;
							height: 20rpx;
							background-color: #FFFFFF;
							border-radius: 50%;
							z-index: 1;
						}
						
						&::after {
							content: '';
							position: absolute;
							left: 50%;
							bottom: -30rpx;
							transform: translateX(-50%);
							width: 20rpx;
							height: 20rpx;
							background-color: #FFFFFF;
							border-radius: 50%;
							z-index: 1;
						}
					}
				}
				
				// 右侧文字区域
				.coupon-text-section {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.coupon-main-text {
						font-size: 28rpx;
						color: #FFFFFF;
						line-height: 1.2;
					}
					
					.coupon-time-text {
						font-size: 28rpx;
						color: #FFFFFF;
						line-height: 1.2;
						margin-left: auto;
					}
				}
			}

			.goods-coupon-box {
				width: 100%;
				position: relative;

				.activity_wrap_no {
					padding: 0;
					overflow: hidden;
					margin-right: 40rpx;
				}
				
				// 优惠券区域与商品名称之间的上下间距调小一些
				.activity_coupon {
					// 覆盖全局的 margin: 24upx 0;，减少上下留白
					margin: 8rpx 0 4rpx;
				}
				
				.activity_list {
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					overflow-x: auto;
					white-space: nowrap;
				}
				
				// 通用标签样式
				.promo-tag {
					display: inline-flex;
					align-items: center;
					padding: 8rpx 16rpx;
					border-radius: 8rpx;
					font-size: 24rpx;
					white-space: nowrap;
					flex-shrink: 0;
					margin-right: 12rpx;
					
					.promo-tag-icon {
						width: 28rpx;
						height: 28rpx;
						margin-right: 8rpx;
						flex-shrink: 0;
					}
					
					.promo-tag-text {
						font-size: 24rpx;
						line-height: 1.2;
					}
					
					.promo-tag-divider {
						margin: 0 8rpx;
						color: #FE2F02;
						
						    line-height: 1.2;
						font-size: 24rpx;
					}
				}
				
				// 限时优惠（促销档期 / acttype:2）
				.promo-tag-limited {
					background: linear-gradient(90deg, #FFE8E8 0%, #FFF0F0 100%);
					color: #FF3616;
					border: 1rpx solid rgba(255, 54, 22, 0.2);
				}

				// 第一：优惠券
				.promo-tag-coupon {
					background-color: #FFEDED;
					color: #FE2F02;
					display: flex;
					align-items: center;
					
					.promo-tag-text {
						color: #FE2F02;
					}
					
					.promo-tag-divider {
						color: #FE2F02;
						margin: 0 8rpx;
					}
				}
				
				// 第二：首单立减
				.promo-tag-first-order {
					background-color: #FFEDED;
					color: #FE2F02;
				}
				
				// 第三：包邮券
				.promo-tag-free-shipping {
					background-color: #F0FFF6;
					color: #09B248;
				}
				
				// 第四：积分可抵
				.promo-tag-points {
					background-color: #FFF3DA;
					color: #773E0F;
				}
				
				// 第五：跨店满减（暂时注释）
				.promo-tag-cross-store {
					background-color: #FFEDED;
					color: #FE2F02;
				}
				
				// 第六：一件起批
				.promo-tag-one-parcel {
					background-color: #FFF3DA;
					color: #773E0F;
				}
				
				// 最后：满减
				.promo-tag-full-reduction {
					background-color: #FFEDED;
					color: #FE2F02;
				}

				.iconfont {
					position: absolute;
					top: 20rpx;
					right: 0;
				}
			}

			.goods_price {
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				align-items: flex-start;
				padding-top: 20rpx;

				// margin-bottom:24upx;
				.price-label {
					display: flex;
					align-items: baseline;
					overflow-x: auto;
					width: 1000rpx;

					.price-one {
						display: flex;
						flex-direction: column;
						background: #FFEDED;
						border-radius: 6px;
						width: fit-content;
						padding: 0rpx 16rpx;
						margin-right: 40rpx;

						.price-top {
							display: flex;
							align-items: baseline;
						}

						.price-top-text {
							font-family: PingFangSC, PingFang SC;
							font-weight: 400;
							font-size: 28rpx;
							color: #626262;
						}
					}

					.price-list {
						margin-right: 40rpx;

						.price-number {
							font-family: PingFangSC, PingFang SC;
							font-weight: 400;
							font-size: 28rpx;
							color: #626262;
						}
					}
				}

				/* 新人价/券后 标签：不依赖父级结构，三处复用 */
				.new-person-price {
					font-size: 11px;
					color: #ff9800;
					// background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
					padding: 2rpx 6rpx;
					border-radius: 4rpx;
					font-weight: 500;
					flex-shrink: 0;
					white-space: nowrap;
					// margin-right: 8rpx;
				}

				.coupon-box {
					.coupon-box-label {
						border-radius: 6rpx;
						border: 1rpx solid #FE2F02;
						display: inline-block;

						.coupon-box-text {
							font-family: PingFangSC, PingFang SC;
							font-weight: 400;
							font-size: 20rpx;
							color: #FE2F02;
							line-height: 20rpx;
							text-align: left;
							font-style: normal;
							padding: 6rpx 12rpx;
						}
					}
				}
			}

			.wrap_box {
				display: flex;
				align-items: baseline;
				flex: 1;

				.one-parcel-free {
					margin-left: 28upx;
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 28upx;
					color: #626262;
					line-height: 24upx;
					text-align: left;
					font-style: normal;
				}

				.is-discount-yuan {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 28upx;
					color: #FE2F02;
					line-height: 24upx;
					text-align: left;
					font-style: normal;
					margin-left: 16upx;
				}
				
				.platform-divider {
					font-size: 28rpx;
					color: #EA0C21;
					margin: 0 12rpx;
					line-height: 1;
				}
				
				.platform-min-price {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #09B248;
					line-height: 24upx;
					text-align: left;
					font-style: normal;
					margin-left: 0;
				}

				.membership-discount-price {
					font-size: 24rpx;
					color: #4D4B4B;
					line-height: 1.2;
					margin-left: 12rpx;
				}

				// .yishou {
				// 	margin-left: 20rpx;
				// }

				.rate {
					margin-left: 4rpx;
					padding-right: 10rpx;
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.price-row-wrapper {
				display: flex !important;
				justify-content: space-between !important;
				align-items: center !important;
				width: 100% !important;
			}
			
			.price-left-group {
				display: flex;
				align-items: baseline;
				flex: 1;
			}
			
			.sales-count-right {
				font-weight: 700;
				margin-left: 20rpx;
				white-space: nowrap;
				flex-shrink: 0;
			}

			.goods_rate {
				margin-top: -30rpx;
			}

			.right {
				display: flex;
			}

			.goods_share,
			.collection {
				display: flex;
				flex-direction: column;
				align-items: center;

				.share_txt {
					font-size: 24rpx;
					line-height: 1;
					margin-top: 20rpx;
					color: #2E2E2E;
				}
			}

			.collection {
				margin-left: 30rpx;
			}

			.goods_tag {
				display: flex;

				image {
					display: block;
					height: 34rpx;
					margin-right: 9rpx;
				}
			}

			.padding_top20 {
				padding-top: 20rpx;
			}

			.goods_name_wrap {
				display: flex;
				align-items: flex-start;
				// padding-top: 20rpx;

				.goods_share {
					flex: none;
					margin: 0 0 0 20rpx;
				}

				.country_icon {
					width: 40rpx;
					height: 28rpx;
					position: relative;
					top: 5rpx;
				}

				.country_icon_text {
					display: inline-block;
					font-size: 22rpx;
					font-weight: normal;
					color: #666;

					.icon_text_name {
						padding-left: 7rpx;
					}
				}
			}

			.goods_name {
				flex: auto;
				font-size: 30rpx;
				font-weight: 700;
				line-height: 40rpx;
				margin-bottom: 16rpx;
				// position: relative;
				display: flex;
				align-items: baseline;

				.goods-name-text {
					font-size: 32rpx;
					line-height: 40rpx;
					line-height: 16px;
					/* 保持行高一致 */
					// display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
				}

				.easy_choose {
					background: #DCAB6C;
					box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05);
					font-weight: 500;
					font-size: 20rpx;
					color: #FFFFFF;
					padding: 4rpx 6rpx;
					margin-right: 16rpx;
					border-radius: 10rpx;
					line-height: 40rpx;
					// padding:6rpx 8rpx;
					line-height: 16px;
					/* 保持行高一致 */
					display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
				}

				.is-new-goods {
					box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05);
					border: 1rpx solid #09B248;
					font-weight: 500;
					font-size: 20rpx;
					color: #09B248;
					padding: 0px 4px;
					border-radius: 5px;
					margin-right: 16rpx;
					line-height: 16px;
					/* 保持行高一致 */
					display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
				}

				.yishou {
					// position: absolute;
					// right: 0;
					white-space: nowrap;
					float: right;
					margin-top: 10rpx;
				}

				.ziying {
					display: inline-block;
					padding: 0 10rpx;
					margin-right: 10rpx;
					height: 32rpx;
					line-height: 32rpx;
					border-radius: 16rpx;
					text-align: center;
					background: linear-gradient(270deg, #FF4F2E 0%, #F91F28 100%);
					font-size: 20rpx;
					font-weight: 400;
					color: #fff;
					vertical-align: 4rpx;
					line-height: 16px;
					/* 保持行高一致 */
					display: inline-block;
					vertical-align: bottom;
					/* 关键：对齐底部基线 */
				}
			}

			.goods_explain {
				margin-top: 10rpx;
				line-height: 40rpx;
			}

			.open_vip {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 84rpx;
				padding: 0 30rpx;
				margin-top: 20rpx;
				border-radius: 42rpx;
				background-color: #FEF3E4;

				.vip_ico {
					width: 48rpx;
					height: 48rpx;
				}

				.vip_content {
					flex: auto;
					padding: 0 14rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					.vip_price {
						padding-left: 10rpx;
						color: #F22E20;
					}
				}
			}
		}

		/* 商品基本信息 end */

		/* 优惠与活动 start */
		.activity_wrap {
			display: flex;
			align-items: baseline;
			padding: 7rpx 0;

			&:nth-child(n + 2) {
				.activity_coupon {
					overflow: hidden;
					min-width: 750rpx;
					// border-top: 2rpx solid #ccc;
				}
			}

			.activity_title {
				flex: none;
				margin: 0 30rpx;
				font-weight: 400;
				font-size: 14px;
				color: #999999;
			}

			.activity_coupon {
				margin: 24upx 0;
				overflow-x: auto;
				flex-wrap: nowrap;
			}

			.activity_main {
				flex: auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-right: 30rpx;

				.size_24 :before {
					font-size: 12upx;
				}

				.activity_list {
					flex: auto;
					display: flex;
					// overflow: hidden;
					// display: -webkit-box;
					// -webkit-line-clamp: 1;
					// -webkit-box-orient: vertical;
				}

				.specification_lable_box {}

				.specification_lable text {
					margin-right: 10rpx;
				}

				/* 核心代码 */
				.service-label-width {
					display: flex;
					overflow: hidden;
					/* 关键：截断溢出部分 */
				}

				/* 前两个标签保持完整 */
				.server_item:nth-child(1),
				.server_item:nth-child(2) {
					flex: 0 0 auto;
					/* 禁止收缩 */
					white-space: nowrap;
				}

				.server_item {
					flex: 0 0 auto;
					position: relative;
					margin-right: 16px;


				}

				/* 最后一个标签智能收缩 */
				.server_item:last-child {
					.text {
						max-width: 120rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					flex: 1 1 0px;
					/* 启用弹性收缩 */
					min-width: 0;
					/* 突破最小宽度限制 */

				}

				// /* 仅对最后标签应用省略号 */
				// .server_item:last-child uni-text span {
				//   display: block;
				//   white-space: nowrap;
				//   overflow: hidden;
				//   text-overflow: ellipsis;
				// }

				.activity_item_flex {
					display: flex;
					// flex-wrap: wrap;
					align-items: baseline;
					overflow-x: auto;
					flex-wrap: nowrap;
				}

				.coupon_activity_item_flex {
					display: flex;
					flex-direction: row;
					// display: inline-block;
				}

				.regiontext {
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.activity_item {
					.title_ico {
						width: 34rpx;
						vertical-align: sub;
						display: inline-block;
					}

					.location_ico {
						flex: none;
						height: 30rpx;
						width: 30rpx;
						margin-right: 8rpx;
					}

					.address_text {
						width: 540rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #999;
					}

					.server_item {
						display: flex;
						align-items: center;
						margin-right: 25rpx;
						// line-height: 2;
						min-width: 0;


						// &:last-child{
						// 	margin-right: 0;
						// }
						.location_ico {
							height: 34rpx;
							width: 34rpx;
						}

						.text {
							// overflow: hidden;
							// display: -webkit-box;
							// -webkit-line-clamp: 1;
							// -webkit-box-orient: vertical;
						}
					}

					.activity_bg {
						// padding: 0 10rpx;
						// height: 40rpx;
						// line-height: 40rpx;
						// text-align: center;
						// font-size: 26rpx;
						// color: #F44C36;
						// background: #FEE9E6;
						// border-radius: 4rpx;
						margin: 0 16rpx 0 0;
						flex: auto;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						min-width: 69px;
						height: 18px;
						line-height: 18px;
						padding: 0 5px;
						text-align: center;
						border-radius: 2px;
						border: 1px solid #F44C36;
						color: #F44C36;
					}

					.margin_top0 {
						margin-top: 0;
					}

					.activity_tips {
						white-space: pre-line;
						font-weight: 400;
						font-size: 14px;
						color: #272727;
					}

					.coupon_bg_wrap {
						overflow: hidden;
						display: flex;
						margin-right: 12upx;

						.coupon_bg {
							flex: 0 0 auto;
							white-space: nowrap;
							flex-shrink: 0;
							position: relative;
							display: flex;
							align-items: center;
							justify-content: center;
							// min-width: 138rpx;
							height: 36rpx;
							line-height: 36rpx;
							padding: 0 10rpx;
							text-align: center;
							border-radius: 4rpx;
							border: 2rpx solid #F44C36;
							color: #F44C36;

							// &:before {
							// 	content: '';
							// 	position: absolute;
							// 	top: 50%;
							// 	left: -10rpx;
							// 	transform: translateY(-50%);
							// 	width: 12rpx;
							// 	height: 12rpx;
							// 	border-radius: 50%;
							// 	border: 2rpx solid #F44C36;
							// 	background-color: #fff;
							// 	z-index: 3;
							// }

							// &:after {
							// 	content: '';
							// 	position: absolute;
							// 	top: 50%;
							// 	right: -10rpx;
							// 	transform: translateY(-50%);
							// 	width: 12rpx;
							// 	height: 12rpx;
							// 	border-radius: 50%;
							// 	border: 2rpx solid #F44C36;
							// 	background-color: #fff;
							// 	z-index: 3;
							// }
						}
					}
				}

				.iconfont {
					flex: none;
					// margin-left: 30rpx;
				}
			}
		}

		/* 优惠与活动 end */
		.server_wrap {
			align-items: stretch;
		}

		/* 商品评价 start */
		.title_box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 20rpx;

			.title_left {
				position: relative;
				font-weight: 700;
				padding-left: 16rpx;

				&:before {
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					content: '';
					width: 6rpx;
					height: 32rpx;
					background: linear-gradient(180deg, #F91F28 0%, rgba(255, 79, 46, 0.35) 100%);
				}

				.comment_count {
					margin-left: 30rpx;
					font-weight: normal;
				}
			}

			.drgree_of_praise {
				margin-right: 8rpx;
			}
		}

		.comment-items {
			padding-bottom: 30rpx;

			.comitem {
				padding: 30rpx 0;

				&:nth-child(n + 2) {
					position: relative;

					&:after {
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
						border-top-width: 1px;
						z-index: 2;
					}
				}
			}

			.item_header {
				display: flex;
				align-items: center;
				padding: 0 30rpx;

				.head_l {
					flex: none;
					width: 68rpx;
					height: 68rpx;
					border-radius: 50%;
				}

				.head_r {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 68rpx;
					margin-left: 20rpx;
				}

				.com_name {
					line-height: 1;
				}

				.com_time {
					display: flex;
					justify-content: space-between;

					.comment_time {
						color: #999;
						line-height: 1;
					}
				}

				.rate_wrap {
					line-height: 1;

					.icon-collection-alt {
						margin-right: 10rpx;
						line-height: 1;
						color: #DDD;
					}

					.color_red {
						color: #E93B3D;
					}
				}
			}

			.item_body {
				padding-top: 30rpx;

				.comment_con {
					margin: 0 30rpx;
					line-height: 40rpx;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.imgs_scroll {
					padding: 30rpx 30rpx 0;

					.com_img {
						width: 204rpx;
						height: 204rpx;
						border-radius: 10rpx;

						&:nth-child(n + 2) {
							margin-left: 10rpx;
						}
					}
				}
			}

			.item_footer {
				margin: 20rpx 30rpx 0;
				line-height: 40rpx;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				font-size: 26rpx;
				overflow: hidden;
				color: #999;
			}
		}

		.friend_discuss {
			padding: 0 30rpx 30rpx;

			.discuss_item {
				display: flex;
				align-items: baseline;

				&:nth-child(n + 2) {
					margin-top: 24rpx;
				}

				.dis_label {
					height: 38rpx;
					line-height: 38rpx;
					font-size: 24rpx;
					padding: 0 10rpx;
					text-align: center;
					border-radius: 4rpx;
					margin-right: 10rpx;
					color: #fff;
					background-color: #FF320D;
				}

				.dis_value {
					flex: 1;
					line-height: 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.dis_time {
					margin-left: 10rpx;
					line-height: 1;
					font-size: 24rpx;
					color: #999;
				}
			}
		}

		.no_dis {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 40rpx;

			.no_dis_title {
				margin: 30rpx 0;
			}
		}

		/* 商品评价 end */

		/* 店铺 start */
		.goods-store-hade {
			padding: 32rpx 20rpx;
		}

		.store_hade {
			display: flex;
			justify-content: space-between;
			align-items: center;

			// padding: 30rpx;
			.m-b36 {
				margin-bottom: 36upx;
			}

			.store_logo {
				width: 80rpx;
				height: 80rpx;
				border-radius: 6rpx;
				background-color: #E93B3D;
			}

			.store_name_rate {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.notice_1 {
					// position: absolute;
					/* #ifdef APP-PLUS */
					top: 0px;
					/* #endif */
					/* #ifdef MP-WEIXIN */
					top: 0px;
					/* #endif */
					/* #ifdef H5 */
					top: 0px;
					/* #endif */
					width: 100%;
					z-index: 2;
				}


				.shop-label-second {
					.m-r28 {
						margin-right: 28upx;
					}

					.m-l28 {
						margin-left: 28upx;
					}

					.m-l12 {
						margin-left: 12upx;
					}

					display: flex;

					.shop-label-second-left {
						font-family: PingFangSC, PingFang SC;
						font-weight: 400;
						font-size: 28upx;
						color: #999999;
						line-height: 28upx;
						text-align: justify;
						font-style: normal;
					}

					.shop-label-second-right {
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 28upx;
						color: #272727;
						line-height: 28upx;
						text-align: justify;
						font-style: normal;
					}
				}

				.shop-orientation {
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #999999;
					line-height: 28rpx;
					text-align: justify;
					font-style: normal;
					margin: 16rpx 22rpx 0 0rpx;
					display: flex;


					.shop-text {
						margin: 0 18rpx;
						width: 249px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: inline-block;
					}
				}

				.sto_name {
					flex: auto;
					font-weight: 700;
					line-height: 1;
					color: #282828;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.sto_rate_wrap {
					display: flex;
				}

				.sto_rate {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 42rpx;
					line-height: 42rpx;
					padding: 0 12rpx;
					border-radius: 20rpx;
					font-size: 24rpx;
					background-color: #F6F6F6;

					.icon-collection-alt {
						margin-left: 10rpx;
						color: #DDD;
					}

					.color_red {
						color: #E93B3D;
					}
				}
			}
		}

		.store_body {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.count_item {
				flex: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				text-align: center;

				.count_text {
					font-weight: 700;
				}

				.serve_rate {
					font-size: 24rpx;

					text:nth-child(n + 2) {
						margin-left: 10rpx;
					}
				}
			}

			.line_wrap {
				flex: none;
				height: 44rpx;
			}

			.color_red {
				color: #EC3937;
			}

			.color_green {
				color: #18C461;
			}
		}

		.store_footer {
			display: flex;
			justify-content: center;
			padding-bottom: 30rpx;

			.store_btn {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 24rpx;
				height: 62rpx;
				line-height: 58rpx;
				border-radius: 33rpx;
				border: 2rpx solid #F9F9F9;
				text-align: center;

				&:nth-child(n + 2) {
					margin-left: 35rpx;
				}

				&.active {
					border-color: #F91F28;
					color: #F91F28;
				}

				.store_btn_ico {
					height: 32rpx;
					margin-right: 8rpx;
					vertical-align: middle;
				}
			}
		}

		/* 店铺 end */

		/* 搜索 start */
		.search_wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 0 30rpx 30rpx;

			.search_input {
				flex: auto;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 66rpx;
				padding-left: 16rpx;
				border-radius: 33rpx;
				color: #A2A2A2;
				background-color: #F2F2F2;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;

				.icon-home-search {
					margin-right: 10rpx;
					font-size: 34rpx;
				}
			}

			.search_btn {
				margin: 0 30rpx;
			}
		}

		.top_search {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			padding: 0 30rpx;

			.top_search_lable {
				color: #000;
			}

			.top_search_keyword {
				height: 54rpx;
				line-height: 54rpx;
				padding: 0 25rpx;
				margin: 0 15rpx 30rpx 0;
				border-radius: 27rpx;
				color: #272727;
				background-color: #F2F2F2;

				&:last-child {
					margin-right: 0;
				}
			}
		}

		.recomment {
			.re_tabs {
				display: flex;
				justify-content: flex-start;
				padding: 30rpx 0;

				.re_tabs_item {
					flex: none;
					text-align: center;
					height: 50rpx;
				}

				.active_tab {
					position: relative;
					font-weight: 500;
					font-size: 32rpx;
					color: #272727;
					margin-left: 20rpx;
					// &:after {
					// 	content: '';
					// 	position: absolute;
					// 	left: 50%;
					// 	bottom: 0;
					// 	transform: translateX(-50%);
					// 	width: 50%;
					// 	height: 6rpx;
					// 	background: linear-gradient(90deg, #F91F28 0%, rgba(255, 79, 46, 0.35) 100%);
					// }
				}
			}

			.goods_list_wrap {
				position: relative;
				padding: 0 20rpx 36rpx;

				.swiper {
					.glist {
						display: flex;
						flex-wrap: wrap;
						align-content: flex-start;
					}

					.gitem {
						width: 33.33%;
						padding: 0 10rpx;
						box-sizing: border-box;

						.goods_pic {
							display: block;
							width: 100%;
							height: 216.66rpx;
						}

						.goods_name_price {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							height: 155rpx;
							padding: 20rpx 0;
							box-sizing: border-box;

							.country_icon_image {
								width: 43rpx;
								height: 30rpx;
								padding-right: 7rpx;
								position: relative;
								top: 5rpx;
							}
						}

						.goods_name {
							word-break: break-all;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							line-height: 38rpx;
							color: #272727;
							overflow: hidden;
						}
					}
				}

				.swiper_370 {
					height: 370rpx;
				}

				.swiper_740 {
					height: 740rpx;
				}

				.indicator_dots {
					position: absolute;
					bottom: 30rpx;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					height: 6rpx;
					background: #F1F1F1;
					border-radius: 3rpx;

					.indicator {
						width: 33rpx;
						height: 6rpx;
						border-radius: 3rpx;
					}

					.active_indicator {
						background-color: #F22E20;
					}
				}
			}
		}

		/* 搜索 end */

		/* 推荐文章 start */
		.article_item {
			display: flex;
			padding: 30rpx;

			&:first-child {

				padding-top: 0 !important;
			}

			.article_img {
				flex: none;
				width: 136rpx;
				height: 136rpx;
				margin-right: 22rpx;
				border-radius: 10rpx;
			}

			.article_content {
				flex: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20rpx;

				.art_title {
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					line-height: 40rpx;
				}

				.art_time {
					color: #999;
				}
			}
		}

		/* 推荐文章 end */

		/* 图文详情 start */
		.padding_b_30 {
			padding-bottom: 30rpx;
		}

		.image_text_title {
			display: flex;
			padding: 20rpx;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 32rpx;
			color: #272727;
			line-height: 32rpx;
			text-align: justify;
			font-style: normal;

			.title_ico {
				width: 28rpx;
				height: 28rpx;
				margin-right: 12rpx;
			}
		}

		.goods_desc {
			padding: 0 10rpx;
		}

		.goods_attr_parameter {
			margin: 0 10rpx;
			border: 2rpx solid #f0f0f0;
			border-radius: 12rpx;
			overflow: hidden;
			background-color: #ffffff;

			.tr {
				display: flex;
				justify-content: flex-start;
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #272727;
				line-height: 28rpx;
				text-align: justify;
				font-style: normal;
				border-bottom: 2rpx solid #f0f0f0;

				.td {
					flex: auto;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					min-height: 80rpx;
					line-height: 40rpx;
					padding: 0 20rpx;

					&:first-child {
						flex: none;
						width: 200rpx;
						color: #999999;
						border-right: 2rpx solid #f0f0f0;
						background-color: #f9f9f9;
					}
				}

				.color_27 {
					color: #272727;
				}
			}

			.tr:last-child {
				border-bottom: none;
			}
		}

		.attr_wrap {
			.tr {
				&:nth-child(n + 7) {
					display: none;
				}
			}
		}

		.open_goods_attr {
			display: flex;
			justify-content: center;
			padding-top: 30rpx;

			.view_more_btn {
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #272727;
				line-height: 28rpx;
				text-align: justify;
				font-style: normal;
				margin: 32rpx;

				.iconfont {
					margin-left: 20rpx;
				}
			}
		}

		/* 图文详情 end */

		/* 提交订单栏 start：同父级容器，仅做分组，不参与布局 */
		.detail-bottom-wrap {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0;
			overflow: visible;
			z-index: 96;
			pointer-events: none;
		}
		.detail-bottom-wrap .submit_bar {
			pointer-events: auto;
		}
		.detail-bottom-wrap .sys-coupon-wrap,
		.detail-bottom-wrap .sys-coupon-wrap * {
			pointer-events: auto;
		}
		.submit_bar {
			position: fixed;
			left: 0;
			bottom: 0rpx;
			width: 100%;


			display: flex;
			align-items: center;
			/* #ifndef MP-WEIXIN */
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			/* #endif */
			/* #ifdef MP-WEIXIN */
			/* Android 微信小程序：确保最小 20rpx 底部间距 */
			/* Android: calc(20rpx + 0) = 20rpx */
			/* iOS: calc(20rpx + 34px) = 54rpx */
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
			padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
			/* #endif */
			background-color: #fff;
			z-index: 96;

			.stockout {
				position: absolute;
				top: 0;
				left: 0;
				transform: translateY(-100%);
				width: 100%;
				min-height: 70rpx;
				padding: 15rpx;
				color: #E17B32;
				background-color: #FCF9DA;
				box-sizing: border-box;
				z-index: 101;

				.stockout_txt {
					line-height: 40rpx;
					text-align: center;
					display: block;
				}
			}

			.function_wrap {
				display: flex;
				align-items: center;
				padding-left: 30rpx;
			}

			.function_item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-right: 40rpx;
				line-height: 1;
				font-size: 24rpx;
				color: #666;

				.title_ico {
					height: 37rpx;
					margin-bottom: 14rpx;
				}
			}

			.badge_parent {
				position: relative;

				.info_num {
					position: absolute;
					top: -8rpx;
					left: 50%;
					transform: translateX(8rpx);
					min-width: 24rpx;
					height: 24rpx;
					text-align: center;
					line-height: 24rpx;
					// border-radius: 50%;
					border-radius: 8px;
					border: 2rpx solid #F91F28;
					font-size: 20rpx;
					color: #F91F28;
					background-color: #fff;
					z-index: 1;
					padding: 2rpx;

				}
			}
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
			position: relative;
			overflow: initial;

			.footer-brage {
				position: absolute;
				top: -30rpx;
				right: 0;
				width: 240rpx;
				height: 44rpx;
				background: #FAEF89;
				border-radius: 40rpx;
				color: #FE2F02;
				padding: 0rpx 20rpx;
				display: flex;
				align-items: center;
			}

			.button-price {
				display: flex;
				flex-direction: row;
			}

			.jiage {
				font-weight: normal;
				font-size: 10px;
			}
		}

		.footer_btn_left {
			margin: 0 !important;
			background: #FFEDED;
			color: #FE2F02 !important;
			border-radius: 22px 0px 0px 22px !important;

			image {
				width: 24px;
				height: 21px;
			}
		}

		.footer_btn_left2 {
			margin: 0 !important;
			background: #FFEDED;
			color: #FE2F02 !important;
			border-radius: 44rpx !important;

			image {
				width: 24px;
				height: 21px;
			}
		}


		.footer_btn_right {
			background: #FE2F02;
			box-shadow: 0px 1px 0px 0px rgba(192, 192, 192, 0.15);
			border-radius: 0px 22px 22px 0px !important;
			// margin: 0 !important;
		}

		.footer_btn_right2 {
			background: #FE2F02;
			box-shadow: 0px 1px 0px 0px rgba(192, 192, 192, 0.15);
			border-radius: 44rpx !important;
			margin: 0 !important;
		}

		.yellow_btn {
			background-color: #FFC707;
		}

		.red_btn {
			background-color: #F91F28;
		}

		/* 提交订单栏 end */

		.server-popups {
			.pop_scroll_view {
				padding-bottom: 40rpx;
			}
		}

		.show_goods_pop_content {
			.show_goods_pop {
				padding-bottom: 40rpx;
			}
		}

		.specification-pop-content {
			margin-top: 30rpx;
			padding: 0 !important;
		}

		/* 优惠弹框 start */
		.pop_content {
			padding-bottom: env(safe-area-inset-bottom);
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			background-color: #fff;
			padding: 0 30rpx 30rpx;

			&.discount-sheet-wrap {
				padding-left: 0;
				padding-right: 0;
				padding-bottom: 0;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				box-sizing: border-box;
			}

			.discount-popup-scroll {
				width: 100%;
				box-sizing: border-box;
				flex: 1;
				min-height: 0;
				/* 与下方 disc-sh-bd 一致，回弹时尽量少露异色 */
				background-color: #f5f5f5;
			}

			.coupon_close_btn_box {
				flex-shrink: 0;
				box-sizing: border-box;
				padding: 0 30rpx 30rpx;
				padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
				background-color: #fff;
			}

			.discount-sheet-scroll {
				padding-bottom: 20rpx;
			}

			.disc-sh-hd {
				background: linear-gradient(135deg, #FF2442 0%, #FF5C35 50%, #FF8A00 100%);
				padding: 32rpx 40rpx 40rpx;
				position: relative;
				flex-shrink: 0;
				overflow: hidden;
			}

			.disc-sh-hd::before {
				content: '';
				position: absolute;
				top: -60rpx;
				right: -40rpx;
				width: 240rpx;
				height: 240rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.08);
			}

			.disc-sh-hd::after {
				content: '';
				position: absolute;
				bottom: -80rpx;
				left: 60rpx;
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.06);
			}

			.disc-sh-bar {
				width: 72rpx;
				height: 8rpx;
				border-radius: 4rpx;
				background: rgba(255, 255, 255, 0.4);
				margin: 0 auto 28rpx;
			}

			.disc-sh-close {
				position: absolute;
				top: 28rpx;
				right: 28rpx;
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.2);
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 2;
			}

			.disc-sh-close-x {
				color: #fff;
				font-size: 44rpx;
				line-height: 1;
				font-weight: 300;
			}

			.disc-sh-pr {
				display: flex;
				align-items: baseline;
				justify-content: center;
				position: relative;
				z-index: 1;
			}

			.disc-sh-pv-wrap ::v-deep .currency-price-warp,
			.disc-sh-pv-wrap ::v-deep .currency-price-warp text {
				color: #fff !important;
				font-size: 64rpx;
				font-weight: 800;
			}

			.disc-sh-pl {
				text-align: center;
				font-size: 26rpx;
				color: rgba(255, 255, 255, 0.85);
				margin-top: 12rpx;
				position: relative;
				z-index: 1;
			}

			.disc-sh-pl-b {
				color: #fff;
				font-weight: 600;
			}

			.disc-sh-bd {
				padding: 24rpx 24rpx 8rpx;
				background: #f5f5f5;
			}

			/* 弹窗内限时抢购：对齐 pages/news/app (1).js 的 .fb / .fbd / .tm / .tg */
			.disc-flash-wrap {
				background: #fff;
				border-radius: 24rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
			}

			.disc-flash-wrap--off {
				opacity: 0.45;
			}

			.disc-flash-fb {
				display: flex;
				align-items: center;
				padding: 24rpx 28rpx;
				gap: 20rpx;
				color: #fff;
				background: linear-gradient(135deg, #ff2442 0%, #ff5c35 50%, #ff8a00 100%);
				position: relative;
				overflow: hidden;
			}

			.disc-flash-fb::after {
				content: '';
				position: absolute;
				right: -20rpx;
				top: -20rpx;
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.08);
			}

			.disc-flash-fi {
				width: 72rpx;
				height: 72rpx;
				border-radius: 16rpx;
				background: rgba(255, 255, 255, 0.2);
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				position: relative;
				z-index: 1;
			}

			.disc-flash-fizap {
				font-size: 36rpx;
				line-height: 1;
				color: #fff;
			}

			.disc-flash-ft {
				flex: 1;
				font-size: 30rpx;
				font-weight: 600;
				position: relative;
				z-index: 1;
			}

			.disc-flash-fba {
				font-size: 22rpx;
				font-weight: 500;
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
				background: rgba(255, 255, 255, 0.2);
				color: #fff;
				position: relative;
				z-index: 1;
			}

			.disc-flash-fbd {
				padding: 20rpx 28rpx 28rpx 120rpx;
				background: #fff;
			}

			.disc-flash-pd {
				font-size: 26rpx;
				color: #666;
				line-height: 1.6;
			}

			.disc-flash-hl {
				color: #ff2442;
				font-weight: 600;
			}

			.disc-flash-tm {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 8rpx;
				margin-top: 16rpx;
			}

			.disc-flash-tl {
				font-size: 24rpx;
				color: #999;
				margin-right: 4rpx;
			}

			.disc-flash-uni-ct {
				display: inline-flex;
			}

			.disc-flash-tg {
				display: flex;
				flex-wrap: wrap;
				gap: 12rpx;
				margin-top: 16rpx;
			}

			.disc-flash-ts {
				font-size: 24rpx;
				font-weight: 500;
				padding: 6rpx 20rpx;
				border-radius: 12rpx;
				background: #ffe8ec;
				color: #ff2442;
			}

			.disc-pc {
				background: #fff;
				border-radius: 24rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
			}

			.disc-ph {
				display: flex;
				align-items: center;
				padding: 24rpx 28rpx;
				gap: 20rpx;
			}

			.disc-pi {
				width: 72rpx;
				height: 72rpx;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
			}

			.disc-pi-img {
				width: 44rpx;
				height: 44rpx;
				display: block;
			}

			.disc-pi-red {
				background: #FFE8EC;
			}

			.disc-pi-org {
				background: #FFF3E6;
			}

			.disc-pi-grn {
				background: #E8F8F2;
			}

			.disc-pi-pur {
				background: #F3EEFF;
			}

			.disc-pt {
				font-size: 30rpx;
				font-weight: 600;
				flex: 1;
				color: #333;
			}

			.disc-pb {
				font-size: 22rpx;
				font-weight: 500;
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
			}

			.disc-pb-m {
				background: #E8F8F2;
				color: #00B578;
			}

			.disc-pb-u {
				background: #FFF3E6;
				color: #FF8A00;
			}

			.disc-pbd {
				padding: 0 28rpx 28rpx 100rpx;
			}

			.disc-pbd-pad0 {
				padding-left: 28rpx;
				padding-right: 28rpx;
			}

			.disc-pbd-mj .disc-pd {
				display: block;
				margin-bottom: 8rpx;
			}

			.disc-pbd-mj .disc-pd:last-child {
				margin-bottom: 0;
			}

			.disc-pd {
				font-size: 26rpx;
				color: #666;
				line-height: 1.6;
			}

			.disc-gift-row {
				display: flex;
				align-items: flex-start;
				gap: 16rpx;
				padding: 6rpx 0;
			}

			.disc-gd {
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				margin-top: 12rpx;
				flex-shrink: 0;
			}

			.disc-gd-on {
				background: #00B578;
			}

			.disc-gt {
				font-size: 26rpx;
				color: #999;
				line-height: 1.5;
			}

			.disc-gt-on {
				color: #1a1a1a;
			}

			.disc-cl {
				display: flex;
				flex-direction: column;
				gap: 16rpx;
			}

			.disc-ci {
				display: flex;
				align-items: stretch;
				border: 2rpx solid #EEEEEE;
				border-radius: 16rpx;
				overflow: hidden;
			}

			.disc-ci-ok {
				border-color: #FFC2CA;
				background: #FFF8F9;
			}

			.disc-cil {
				min-width: 120rpx;
				padding: 16rpx 12rpx;
				text-align: center;
				border-right: 2rpx dashed #EEEEEE;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.disc-ci-ok .disc-cil {
				border-right-color: #FFC2CA;
			}

			.disc-ca {
				display: flex;
				align-items: baseline;
				justify-content: center;
				color: #FE2F02;
				line-height: 1;
			}

			.disc-ci-ok .disc-ca {
				color: #FF2442;
			}

			.disc-cau {
				font-size: 22rpx;
				font-weight: 500;
			}

			.disc-cam {
				font-size: 40rpx;
				font-weight: 700;
			}

			.disc-cau-free {
				font-size: 28rpx;
				font-weight: 700;
				color: inherit;
			}

			.disc-cir {
				flex: 1;
				padding: 16rpx 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16rpx;
				min-width: 0;
				background: #fff;
			}

			.disc-cc-wrap {
				flex: 1;
				min-width: 0;
			}

			.disc-cc {
				font-size: 24rpx;
				color: #999;
				line-height: 1.4;
			}

			.disc-ci-ok .disc-cc {
				color: #333;
			}

			.disc-c-time {
				display: block;
				font-size: 20rpx;
				color: #bbb;
				margin-top: 6rpx;
			}

			.disc-ct {
				font-size: 22rpx;
				font-weight: 600;
				padding: 4rpx 16rpx;
				border-radius: 8rpx;
				white-space: nowrap;
				flex-shrink: 0;
				line-height: 1.4;
			}

			.disc-ct-y {
				background: #FF2442;
				color: #fff;
			}

			.disc-ct-n {
				background: #FFEDED;
				color: #FE2F02;
				font-weight: 400;
			}

			.coupons_pop_header {
				position: relative;
				// padding: 0 30rpx;
				text-align: center;
			}

			.coupons_pop_new_header {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 32rpx;
				color: #272727;
				margin: 24rpx 0;
				
				.title-line {
					flex: 1;
					height: 1rpx;
					background-color: #E5E5E5;
					margin: 0 20rpx;
				}
				
				.pop_title {
					flex-shrink: 0;
				}
			}

			.pop_header {
				position: relative;
				// padding: 0 30rpx;
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
					font-family: PingFangSC, PingFang SC;
					font-weight: 500;
					font-size: 32rpx;
					color: #272727;
					line-height: 32rpx;
					text-align: justify;
					font-style: normal;
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


				.coupon-detail {
					.coupon-popups-text {
						display: flex;
						width: fit-content;
						margin: 0 auto;
						flex-direction: column;
						background: #FFEDED;
						border-radius: 12rpx;
						border: 1rpx solid #FE2F02;
						padding: 16upx 26upx;

						.coupon-popups-text-top {
							text-align: center;
							font-family: PingFangSC, PingFang SC;
							font-weight: 500;
							font-size: 36rpx;
							color: #FE2F02;
							line-height: 32rpx;
							text-align: center;
							font-style: normal;
							padding-bottom: 12upx;
						}

						.coupon-popups-text-bot {
							font-family: PingFangSC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #272727;
							line-height: 24rpx;
							text-align: justify;
							font-style: normal;
						}
					}

					.coupon-popups-text-second {
						position: relative;
						background: #fff;
						border-radius: 28rpx;
						border: 1rpx solid #FE2F02;
						margin-bottom: 32upx;
						display: flex;
						padding: 8px;
						padding-top: 36px;
						margin-top: 50upx;

						&:after {
							content: '';
							position: absolute;
							top: -10px;
							left: 50%;
							width: 40rpx;
							height: 40rpx;
							transform: translate(50%, 50%);

							background-color: #fff;
							z-index: 2;
							transform: rotate(45deg);
							border: 1px solid red;
						}

						&:before {
							content: '';
							position: absolute;
							top: 30rpx;
							left: 40%;
							width: 90rpx;
							height: 60rpx;
							-webkit-transform: translate(50%, -50%);
							transform: translate(50%, -50%);

							background-color: #fff;
							z-index: 3;
						}

						.mb-8 {
							margin-bottom: 8upx;
						}

						.square {}

						.coupon-popups-text-left {
							display: flex;
							flex-direction: column;

							.coupon-popups-text-left-top {
								font-family: PingFangSC, PingFang SC;
								font-weight: 400;
								font-size: 28rpx;
								color: #FE2F02;
								line-height: 28rpx;
								text-align: justify;
								font-style: normal;
								text-align: center;

							}

							.coupon-popups-text-left-bot {
								background: rgba(254, 47, 2, 0.26);
								border-radius: 8rpx;
								border: 1rpx solid #FE2F02;
								color: #FE2F02;

								font-size: 13px;
								padding: 3px 10px;
							}
						}

						.coupon-popups-text-right {
							display: flex;
							flex-direction: column;
							position: relative;
							margin-left: 68upx;
							top: 0px;

							.coupon-popups-text-h {
								width: 20upx;
								height: 1upx;
								position: absolute;
								top: 12upx;
								left: -48upx;
								background-color: #FE2F02;
							}

							.coupon-popups-text-right-label {
								display: flex;
								flex-direction: column;
								justify-content: center;

								.coupon-popups-text-right-label-top {
									text-align: center;
									font-weight: 400;
									font-size: 28rpx;
									color: #FE2F02;
									line-height: 28rpx;
								}

								.coupon-popups-text-right-box {
									max-width: 74px;
									border-radius: 8rpx;
									border: 1rpx solid #FE2F02;
									padding:2rpx;
									font-size: 26rpx;

									.coupon-popups-text-right-label-new {
										background: rgba(254, 47, 2, 0.26);


										color: #FE2F02;
										display: flex;
										font-size: 13px;
										padding: 3px 10px;
									}

									.coupon-popups-text-right-label-new-text {

										color: #FE2F02;
										line-height: 28rpx;
										background: #FFEDED;
										padding: 12upx;
									}

								}

							}
						}

					}

					.annotation {
						font-family: PingFangSC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #A2A2A2;
						line-height: 24rpx;
						text-align: justify;
						font-style: normal;
						width: 100%;
						margin-bottom: 28rpx;
					}
				}

				.new-member-coupon {
					display: flex;
					align-items: center;
					background-color: #FE2F02;
					border-radius: 20rpx;
					padding: 20rpx 24rpx;
					margin: 0 24rpx 24rpx 24rpx;
					
					// 左侧金额区域
					.coupon-amount-section {
						display: flex;
						align-items: baseline;
						margin-right: 24rpx;
						flex-shrink: 0;
						
						.currency-symbol {
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 1;
						}
						
						.amount-value {
							font-size: 40rpx;
							margin-left: 10rpx;
							color: #FFFFFF;
							font-weight: bold;
							line-height: 1;
						}
					}
					
					// 中间虚线分割
					.coupon-divider {
						position: relative;
						width: 2rpx;
						height: 60rpx;
						margin: 0 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-shrink: 0;
						
						.divider-line {
							position: relative;
							width: 1rpx;
							height: 100%;
							background: repeating-linear-gradient(
								to bottom,
								#FFFFFF 0,
								#FFFFFF 4rpx,
								transparent 4rpx,
								transparent 8rpx
							);
							
							&::before {
								content: '';
								position: absolute;
								left: 50%;
								top: -30rpx;
								transform: translateX(-50%);
								width: 20rpx;
								height: 20rpx;
								background-color: #FFFFFF;
								border-radius: 50%;
								z-index: 1;
							}
							
							&::after {
								content: '';
								position: absolute;
								left: 50%;
								bottom: -30rpx;
								transform: translateX(-50%);
								width: 20rpx;
								height: 20rpx;
								background-color: #FFFFFF;
								border-radius: 50%;
								z-index: 1;
							}
						}
					}
					
					// 右侧文字区域
					.coupon-text-section {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						min-width: 0;
						
						.coupon-main-text {
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 1.5;
							white-space: nowrap;
							flex-shrink: 0;
						}
						
						.coupon-time-text {
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 1.5;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							text-align: right;
							margin-left: 20rpx;
						}
					}

					/* 叠在「新人立减」disc-pc 内时：与商详区字号一致，与上方说明留出间距 */
					&.disc-nm-in-discpc {
						margin: 8rpx 24rpx 24rpx;
						width: calc(100% - 48rpx);
						box-sizing: border-box;

						.coupon-text-section {
							.coupon-main-text,
							.coupon-time-text {
								font-size: 28rpx;
								line-height: 1.2;
							}
						}
					}
				}
				
				.popup-content-item {
					margin: 0 24rpx 24rpx 24rpx;
					padding: 20rpx 24rpx;
					border-radius: 12rpx;
					
					.popup-content-text {
						font-weight: 400;
						font-size: 24rpx;
						color: #1B1B1B;
						line-height: 1.5;
					}
				}
				
				.popup-content-points {
					background: #FFEDED;
					
					.popup-content-text {
						color: #FE2F02;
					}
				}
				
				.popup-content-cross-store {
					background: #FFF7DF;
					
					.popup-content-text {
						color: #FF7705;
					}
				}

				.label_text {
					// margin-bottom: 0.2rem;
					font-weight: 700;
					color: #000;
				}

				.list_wrap {
					margin-bottom: 160rpx;
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
						margin-right: 0 16rpx 0 0;
						font-size: 24rpx;
						color: #F44C36;
						background: #FEE9E6;

					}

					.activity_tips {
						flex: auto;
						line-height: 40rpx;
						margin-left: 20rpx;
					}
				}
			}

			.coupon_activity {
				margin-top: 56rpx
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
					width: calc(100% - 280rpx);
					max-width: calc(100% - 200rpx);
					border-radius: 20rpx 0 0 20rpx;
					color: #fff;
					background: #FFEDED;
					padding: 24rpx 32rpx;
					border-right: 1px dashed #fff;
					/* 祥云底纹 - 使用背景图片，不影响伪元素 */
					background-image: url("data:image/svg+xml,%3Csvg width='200' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q20,50 40,55 T80,55 T120,50 T160,55 T200,60' stroke='%23FF9999' stroke-width='2.5' fill='none' opacity='0.25'/%3E%3Cpath d='M10,65 Q30,55 50,60 T90,60 T130,55 T170,60 T190,65' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cpath d='M20,70 Q40,60 60,65 T100,65 T140,60 T180,65 T200,70' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.15'/%3E%3Cpath d='M30,50 Q50,40 70,45 T110,45 T150,40 T190,45' stroke='%23FF9999' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cellipse cx='35' cy='52' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='75' cy='48' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='115' cy='47' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='155' cy='50' rx='5' ry='3.5' fill='%23FF9999' opacity='0.15'/%3E%3Cellipse cx='185' cy='53' rx='6' ry='4' fill='%23FF9999' opacity='0.15'/%3E%3C/svg%3E");
					background-repeat: repeat-x;
					background-position: bottom left;
					background-size: 200rpx 80rpx;

					.coupons_left_top {
						display: flex;

						.collect_coupon {
							height: fit-content;
							padding: 6rpx 10rpx;
							margin: 0 26rpx;
							background: #FE2F02;
							border-radius: 8rpx;
							font-size: 24rpx;
							color: #FFFFFF;
						}
					}

					.coupons_goods_name {
						display: flex;
						font-size: 28rpx;
						color: #FE2F02;
					}

					.coupons_limited_period {
						display: flex;
						font-weight: 400;
						font-size: 20rpx;
						color: #FE2F02;
					}

					.coupon_price {
						// margin-top: 30px;
						font-size: 48rpx;
						line-height: 1;
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 48rpx;
						color: #FE2F02;
						font-style: normal;
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
					width: 200rpx;
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

						height: 100%;
						width: 100%;

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
							background: #FFEDED;
						}
							//原本的已领取样式
						.u-reset-disabled {
							// background: #999999;
							// color: #FFFFFF;
							// border-color: #999999;
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

			.footer_points {
				// position: absolute;
				// bottom: 0;
				// margin
			}

			.coupon_close_btn {
				background: #FE2F02;
				box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
				border-radius: 44rpx;
				font-weight: 500;
				font-size: 36rpx;
				color: #FFFFFF;
				// margin-top: 164rpx;
				margin-bottom: 32rpx;
			}
		}

		/* 优惠弹框 end */
		/* 证书弹框 start */
		.certificate_pop_content2 {
			border-radius: 28rpx;
			margin: 0 65rpx;

			.certificate_pop_header {
				display: flex;
				justify-content: center;
				font-weight: 400;
				font-size: 20px;
				color: #1B1B1B;

				.pop_title {
					margin: 20px 0 30rpx 0;
				}
			}

			.certificate_pop_text {
				font-weight: 400;
				font-size: 14px;
				color: #1B1B1B;
				margin-bottom: 60rpx;
			}
		}

		/* 证书弹框 end */
		/* 活动弹框 start */
		.activity_pup {
			background-color: #F4F4F4;
		}

		.act_item {
			padding: 30rpx;
			border-radius: 20rpx;
			background-color: #fff;

			&:nth-child(n + 2) {
				margin-top: 20rpx;
			}

			.act_main {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.act_left {
					flex: auto;
				}

				.act_label {
					display: inline-block;
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
			}

			.recommend_title {
				.activity_price {
					color: #F22E20;
				}
			}

			.img_list {
				display: flex;
				align-items: center;
				margin-top: 16rpx;

				.img_wrap {
					&:nth-child(n + 2) {
						position: relative;
						padding-left: 56rpx;

						&:before {
							position: absolute;
							top: 50%;
							left: 28rpx;
							transform: translate(-50%, -50%);
							content: '+';
							font-size: 40rpx;
						}
					}

					.goods_pic {
						display: block;
						width: 110rpx;
						height: 110rpx;
						border-radius: 10rpx;
					}
				}

				.iconfont {
					margin-left: 10rpx;
				}
			}
		}

		/* 活动弹框 end */

		.media_qrcod_pic {
			flex: none;
			width: 100%;
			height: 100%;
		}

		/* 商品属性弹框 start */
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

					position: relative;
					/* 祥云底纹 - 白色云纹，位于促销优惠下方 */
					background-image: url("data:image/svg+xml,%3Csvg width='200' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q20,50 40,55 T80,55 T120,50 T160,55 T200,60' stroke='%23FFFFFF' stroke-width='2.5' fill='none' opacity='0.4'/%3E%3Cpath d='M10,65 Q30,55 50,60 T90,60 T130,55 T170,60 T190,65' stroke='%23FFFFFF' stroke-width='2' fill='none' opacity='0.35'/%3E%3Cpath d='M20,70 Q40,60 60,65 T100,65 T140,60 T180,65 T200,70' stroke='%23FFFFFF' stroke-width='2' fill='none' opacity='0.3'/%3E%3Cpath d='M30,50 Q50,40 70,45 T110,45 T150,40 T190,45' stroke='%23FFFFFF' stroke-width='2' fill='none' opacity='0.35'/%3E%3Cellipse cx='35' cy='52' rx='6' ry='4' fill='%23FFFFFF' opacity='0.3'/%3E%3Cellipse cx='75' cy='48' rx='5' ry='3.5' fill='%23FFFFFF' opacity='0.3'/%3E%3Cellipse cx='115' cy='47' rx='6' ry='4' fill='%23FFFFFF' opacity='0.3'/%3E%3Cellipse cx='155' cy='50' rx='5' ry='3.5' fill='%23FFFFFF' opacity='0.3'/%3E%3Cellipse cx='185' cy='53' rx='6' ry='4' fill='%23FFFFFF' opacity='0.3'/%3E%3C/svg%3E");
					background-repeat: repeat-x;
					background-position: top left;
					background-size: 160rpx 120rpx;

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
					
					.info_right .info_right_frist .membership-discount-price {
						font-size: 24rpx;
						color: #4D4B4B;
						line-height: 1.2;
						    margin-top: 16rpx;
						margin-left: 60rpx;
					}
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
				flex-direction: column;
				margin-top: 4rpx;
				color: #999;
				font-size: 24rpx;
				width: 100%;

				.inventory_row {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					line-height: 32rpx;
					margin-bottom: 4rpx;
				}

				.inventory_num {
					flex: none;
					margin-right: 20rpx;
					font-size: 24rpx;
					word-break: break-all;
				}

				.inventory_sn {
					flex: none;
					display: flex;
					font-size: 24rpx;
					word-break: break-all;

					.label {
						flex: none;
					}
				}

				.limit-buy-tip {
					
					border-radius: 20rpx;
				
					color: #FF3B30;
					font-size: 22rpx;
					
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

						.attr_top_num_box {
							position: relative;

							.attr_top_num {
								image,
								::v-deep uni-image {
									width: 80rpx !important;
									height: 80rpx !important;
									border-radius: 12rpx;
									margin-right: 16rpx;
									margin-top: 0rpx;
								}
							}
						}
					}

					.attr_top_num_box {
						position: relative;
					}

					.attr_top_num {
						display: flex;
						flex-direction: row;

						image,
						::v-deep uni-image {
							width: 80rpx !important;
							height: 80rpx !important;
							border-radius: 12rpx;
							margin-right: 16rpx;
							margin-top: 0rpx;
						}

						text {}
					}

					.attr_item {
						padding: 16rpx 20rpx;
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

		.footer-total-btn {
			display: flex;
			background-color: #fff;
			padding: 15rpx 30rpx;
			flex-direction: column;

			.footer-total-price-btn {
				display: flex;
				flex-direction: row;
				margin-bottom: 16rpx;
			}
		}

		// .footer_btn {
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	background-color: #fff;
		// 	padding: 15rpx 30rpx;

		// 	.sub_btn:last-child {
		// 		margin-right: 0;
		// 	}
		// }

		.pup_btn {
			flex: 1;
			margin: 0;

			&:nth-child(n + 2) {
				margin-left: 30rpx;
			}
		}

		/* 商品属性弹框 end */

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

		.select_title {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 100rpx;
			padding-right: 30rpx;

			.select_item {
				flex: none;
				height: 100%;
				line-height: 100rpx;
				margin-left: 30rpx;
			}

			.curr_title {
				position: relative;
				font-size: 30rpx;
				font-weight: 700;

				&:after {
					content: '';
					position: absolute;
					bottom: 20rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 90%;
					height: 6rpx;
					background: linear-gradient(90deg, #F91F28 0%, rgba(255, 79, 46, 0.35) 100%);
				}
			}
		}

		.region_item {
			height: 80rpx;
			line-height: 40rpx;
		}

		/* 配送弹框 end */

		/* 服务弹框 start */
		.server {
			&:nth-child(n + 2) {
				margin-top: 40rpx;
			}

			.img-label {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 16rpx;
				padding: 16rpx;

				image {
					width: 684rpx;
					height: 976rpx;
				}
			}

			.margin-btn8 {
				margin-bottom: 16rpx;
				display: flex;
				flex-direction: column;
			}

			.server_item {
				line-height: normal;

				.certificate-number {
					font-weight: 400;
					font-size: 28rpx;
					color: #A2A2A2;
					margin: 8px 0;
				}
			}

			.location_ico {
				height: 34rpx;
				width: 34rpx;
				margin-right: 8rpx;
				vertical-align: -6rpx;
			}

			.color_999 {
				margin-top: 16rpx;
				line-height: 1.5;
				font-size: 24rpx;
			}

			.text-line-clamp {
				top: 44rpx;
			}
		}

		/* 服务弹框 end */
	}

	/* 小程序分享  start*/

	.show-popup-shareImg ::v-deep .uni-popup-bottom {
		height: 80%;
	}

	/* 小程序分享 end*/


	.swiper_warp_layer {
		position: relative;
	}

	.goods-attr-img-list {
		display: flex;
		flex-direction: row;
		background: #fff;
		justify-content: flex-start;
		align-items: center;

		.describe {
			font-size: 25rpx;
			width: 150rpx;
			text-align: center;
		}

		.scroll-view {
			width: calc(100% - 150rpx);
			padding: 20rpx 0;
			border-bottom: 1px solid #F9F9F9;

			.scroll-view-item {
				width: 100rpx;
				height: 100rpx;
				margin-right: 30rpx;
				border: 1px solid #dfdfdf;
				opacity: .6;
				display: inline-block;

				&.active {
					border-color: #F91F28;
					opacity: 1;
				}
			}
		}
	}

	.channels_live {
		position: fixed;
		width: 60px;
		height: 60px;
		background-color: #FFFFFF;
		border-radius: 5px;
		top: 25%;
		right: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.live-img {
			width: 40px;
			height: 40px;
		}

		.text {
			font-size: 25rpx;
		}
	}

	.exclusive_on {}

	.exclusive {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

	}

	.exclusives {}

	.exclusive .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	// .exclusive .left .icon_vip,
	// .exclusive .left .icon_vip image {
	// 	height: 56upx;
	// }

	.exclusive .left text {
		margin-left: 10upx;
		font-weight: 500;
	}

	.exclusive .center {}

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
		// background: linear-gradient(to right, #EA0C21 40%, #FF4B30 80%, #FF4B30 50%);

	}

	.exclusive .right text {
		// color: #ffffff;
		// font-size: 26upx;
	}

	.exclusive .right .uni-icon {
		display: block;
	}

	.card-goods {}

	.card-goods-group {
		padding: 10rpx 30rpx 0rpx 30rpx;
		background: #FFFFFF;
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




	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.goods-detail-guess {
		background-color: #f5f5f5;
	}

	.product-list-lie {
		// margin-bottom: 150rpx;
	}

	.checkbox_1 {
		position: absolute;
		bottom: 5%;
		right: 5%;
	}

	.goods-img,
	.image {
		width: 120upx;
		height: 120upx;
		border: 1rpx solid #ececec;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.tui-order-list {
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		// justify-content: space-between;
	}

	.tui-tool-box {
		// margin-top: 10rpx;
	}

	.tui-flex-wrap {
		flex-wrap: wrap;
		height: auto;
	}

	.tui-tool-item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.5;
	}

	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		height: 70%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 10%;
		left: 10%;
		z-index: 9999;
	}


	.wxshare_y {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #FAFAFA;
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}


	.add_box3_buy_1_s {
		width: 40%;
		height: 70rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-top: 50rpx;
		margin-left: 8%;
		color: #888888;
		font-size: 30rpx;
	}

	.add_box3_buy_1_y {
		width: 38%;
		height: 70rpx;
		background-color: #e64340;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-top: 50rpx;
		margin-left: 5%;
		margin-bottom: 80rpx;
		color: #ffffff;
		font-size: 30rpx;
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

	.detailbtn-new {
		// width: 100px;
	}

	.return_goods_sorrow {
		background: #F0FFF6;
		border-radius: 8px;
		font-weight: bold;
		font-size: 14px;
		color: #09B248;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		margin: 22rpx 22rpx 0 22rpx;
	}

	.correct_product {
		background: linear-gradient(42deg, #FFF3DA 0%, #FFE3B3 100%, #FFE3B3 100%);
		border-radius: 8rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		font-size: 14px;
		color: #773E0F;

		.ten_fake_lable {
			display: flex;
			align-items: center;

			image {
				width: 20px;
				height: 22px;
				
				margin-right: 15rpx;
			}
		}
	}

	.ten_fake {
		background: linear-gradient(42deg, #FFF3DA 0%, #FFE3B3 100%, #FFE3B3 100%);
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		margin: 22rpx 22rpx 0 22rpx;
		font-weight: bold;
		font-size: 14px;
		color: #773E0F;

		.ten_fake_lable {
			display: flex;

			image {
				width: 22px;
				height: 25px;
				
				margin-right: 15rpx;
			}
		}
	}

	.pause-delivery {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 10px;
		background: #FFFAD5;

		.pause-delivery-box {
			display: flex;

			.pause-delivery_label {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #FE2F02;

				.pause-delivery_label_text {
					position: relative;
					margin-right: 8px;

					&:after {
						content: '';
						position: absolute;
						top: 14rpx;
						right: -20rpx;
						width: 2rpx;
						height: 24rpx;
						border-radius: 50%;
						background-color: #A2A2A2;
					}
				}

				.img {
					width: 44rpx;
					height: 35rpx;
					margin-right: 16rpx;
				}
			}

			.pause_botoom_label {
				font-weight: 500;
				font-size: 28rpx;
				color: #272727;
				margin-left: 20rpx;
			}
		}
	}

	.favorable {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;

		.left {
			font-weight: 500;
			font-size: 32rpx;
			color: #272727;
		}

		.label {
			font-weight: 400;
			font-size: 28rpx;
			color: #272727;

			.label-right {
				font-weight: 400;
				font-size: 28rpx;
				color: #272727;
				margin-right: 8rpx;
			}

			.label-text {
				color: #FE2F02;
			}
		}
	}

	.ruturn-shipping {
		padding: 30rpx;

		.text {
			font-family: PingFangSC, PingFang SC;
			font-weight: bold;
			font-size: 32rpx;
			color: #272727;
			line-height: 32rpx;
			text-align: justify;
			font-style: normal;
			margin-bottom: 30rpx;
		}

		.label {
			width: 344rpx;
			height: 80rpx;
			background: #FE2F02;
			border-radius: 10rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	// 24小时内发货
	.hour24 text {
		margin-left: 8rpx;
	}

	.hour24 {
		background-color: #fff;
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		margin: 22rpx 22rpx 0 22rpx;

		.hour24-box {
			display: flex;
		}

		.hours24_label {
			display: flex;
			font-weight: 400;
			font-size: 14px;
			color: #09B248;
			align-items: center;
			margin-right: 10rpx;

			image {
				width: 22px;
				height: 17px;
			}

		}

		.hours48_label {
			font-weight: 400;
			font-size: 14px;
			color: #A2A2A2;
		}

		.hours24_label_text {
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 6px;
				right: -6px;
				width: 1px;
				height: 12px;
				border-radius: 50%;
				background-color: #A2A2A2;
			}
		}
	}

	// 热门店铺
	.goods-hot-group {
		display: flex;
		justify-content: space-between;
		position: relative;
		padding: 30rpx 32rpx;
		overflow-wrap: break-word;
		font-size: 14px;
		font-weight: normal;
		text-align: justify;
		white-space: nowrap;
		line-height: 14px;

		.hot-sale-dis {
			display: inline-block;

			.hot-sale-text {
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #626262;
				line-height: 28rpx;
				text-align: justify;
				font-style: normal;

			}
		}

		.hot-sale-left {
			display: flex;
			align-items: center;

			.hot-sale-list {
				font-family: PingFangSC, PingFang SC;
				font-weight: bold;
				font-size: 32rpx;
				color: #272727;
				line-height: 32rpx;
				text-align: justify;
				font-style: normal;
				margin: 0 4rpx;
			}
		}
	}

	.hot-sale-thumbnail {
		width: 12px;
		height: 16px;
	}

	.hot-sale-thumbnail-left {
		width: 12px;
		height: 16px;
		margin-left: 2px;
		margin-right: 8px;
	}

	.hot-sale-arrow {
		.hot-sale-thumbnail-right {
			width: 6px;
			height: 10px;
			position: absolute;
			right: 0;
			top: 22px;
			right: 10px;
		}
	}

	.image-text_19 {
		margin: 5px 0 4px 18px;
	}

	.image-text_18 {
		margin: 6px 0 4px 0;
	}

	.goods-detail_content .sub_btn {
		// min-width: 100px;
		// /* flex: auto; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 40px;
		border-radius: 20px;
		margin-right: 8px;
		font-weight: 700;
		color: #fff;
		line-height: 1.3;
		font-size: 15px;
	}

	.coupon_title2 {
		margin: 16rpx 20rpx 10rpx;
		font-size: 26rpx;
		color: #999;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		display: flex;
		justify-content: flex-start;
		text-align: left;
		// align-items: center;

		.coupon_tag1 {
			display: inline-block;
			padding: 0 16rpx;
			height: 48rpx;
			line-height: 48rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			text-align: center;
			font-size: 26rpx;
			color: #fff;
			min-width: 80rpx;
			background-color: rgba(245, 41, 35, .6);
		}

		.coupon_tag2 {
			flex: 1;
			display: inline-block;
			padding: 4rpx 16rpx;
			// height: 48rpx;
			line-height: 1.2;
			border-radius: 10rpx;
			margin-right: 20rpx;
			text-align: left;
			font-size: 26rpx;
			color: #fff;
			background-color: rgba(245, 41, 35, .6);

		}
	}

	.billboard-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;

		.billboard-box-left {
			display: flex;
			justify-content: start;
			align-items: center;

			.billboard-title {
				font-weight: 700;
				width: 150upx;
				text-align: center;
			}

			.billboard-info {
				margin-left: 20upx;
			}
		}
	}

	.Distribution-agency-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;

		.Distribution-agency-box-left {
			font-weight: 700;
			font-size: 32rpx;
		}

		.Distribution-agency-box-right {
			display: flex;
			justify-content: start;
			align-items: center;

			.Distribution-agency-box-right-btn {
				// padding: 2rpx 20rpx;
				/*#ifdef MP*/
				// padding: 6rpx 20rpx;
				/*#endif*/
				background: #f5f5f5;
				border-radius: 40rpx;
				color: #FF7705;
				text-align: center;
				margin: 0 6rpx;
				min-width: 132rpx;
			}
		}
	}


	// 视频

	/* 统一的切换按钮样式 */
	.switch_buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
	}

	.switch_btn {
		height: 52rpx;
		line-height: 52rpx;
		padding: 0 30rpx;
		border-radius: 26rpx;
		text-align: center;
		font-size: 24rpx;
		background-color: rgba(255, 255, 255, 0.3);
		color: rgba(255, 255, 255, 0.8);
		/* cover-view 不支持 transition，移除 */
	}

	.switch_btn.active {
		background-color: #FFEDED;
		color: #1B1B1B;
	}

	/* 图片模式下的按钮容器定位 */
	.swiper_warp_layer .switch_buttons {
		position: absolute;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 8rpx 12rpx;
		border-radius: 30rpx;
	}

	/* 视频模式下的按钮容器样式 */
	.video_wrap {
		width: 100%;
		height: 750rpx;
		position: relative;

		.video {
			display: block;
			width: 100%;
			height: 750rpx;
			object-fit: cover;
		}

		.video_wrap .switch_buttons {
			position: absolute;
			bottom: 100rpx;
			left: 0;
			right: 0;
			z-index: 999;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 8rpx 12rpx;
			border-radius: 30rpx;
			/* cover-view 在 iOS 上可能不支持 transform，使用 left/right 0 + justify-content 居中 */
			/* cover-view 不支持 pointer-events，移除 */
			/* cover-view 可能不支持 gap，使用 margin 替代 */
		}
		
		.video_wrap .switch_buttons .switch_btn {
			height: 52rpx;
			line-height: 52rpx;
			padding: 0;
			border-radius: 26rpx;
			text-align: center;
			font-size: 24rpx;
			white-space: nowrap;
		}
		
		.video_wrap .switch_buttons .switch_btn.active {
			background-color: #FFEDED;
			color: #1B1B1B;
		}
	}
	.shortcut-img {
	  width: 36rpx;
	  height: 36rpx;
	  margin-right: 10rpx;
	      margin-left: 6rpx;
	}

	/* 新人价/券后 标签（放在价格前） */
	.new-person-price {
		font-size: 11px;
		color: #ff9800;
		// background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
		padding: 2rpx 6rpx;
		border-radius: 4rpx;
		font-weight: 500;
		flex-shrink: 0;
		white-space: nowrap;
		// margin-right: 6px;
		line-height: 1;
		display: inline-flex;
		align-items: center;
	}

	/* 确保标签与价格同排对齐（避免上下文变化导致样式错位） */
	.activity-goods-price,
	.price-top,
	.price-left-group {
		display: flex;
		align-items: baseline;
	}
</style>