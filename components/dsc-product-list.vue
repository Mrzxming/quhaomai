<template>
	
	<view>
		
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
	
				<view class="uni-product-list" :class="{'product-list-medium':mode !== 'grid'}">		
					<!-- 瀑布流容器 -->
					<view class="waterfall-wrapper">
						<!-- 左列 -->
						
						<view class="column left-col">

							<view class="uni-product" v-for="(item,index) in leftList" :key="index">
								<view class="image-view" 
								                    @click="detailLink(item.seckill_id,routerName,item.goods_id)">
								                
								                <!-- 搜索页面且有视频：显示GIF容器  @click.stop="toggleGifDisplay(item.goods_id)"-->
								                <view v-if="isSearch && item.hasVideo" class="gif-container"
								                      :id="'gif-'+item.goods_id"
								                      >
								                  
								                  <!-- 封面图容器 -->
								                  <view class="cover-content" 
								                        :class="{'cover-hidden': !showCover[item.goods_id]}">
								                    <image class="cover-image" 
								                           :src="item.goods_video_cover" 
								                           mode="aspectFill">
								                    </image>
								                    <!-- 调试信息 -->
								                    <view v-if="isDebug" class="debug-info">
								                      {{ showCover[item.goods_id] ? '封面' : 'GIF播放' }}
								                    </view>
								                  </view>
								                  
								                  <!-- GIF容器 -->
								                  <view class="gif-content" 
								                         v-if="!showCover[item.goods_id]">
								                     <image class="goods-gif" 
								                            :src="item.goods_video_gif" 
								                            mode="aspectFill">
								                     </image>
								                   </view>
								                </view>
								
								                <!-- 非搜索页面或没有视频：显示普通图片 -->
								                <image v-else class="uni-product-image" 
								                       :src="item.goods_thumb" 
								                       mode="widthFix">
								                </image>
								
								                <!-- 其他图片相关元素 -->
								                <view class="bargain-tag" v-if="routerName == 'bargain'">
								                  <view class="iconfont icon-renshu"></view>
								                  {{item.total_num}}{{$t('lang.participation_number')}}
								                </view>
								                <view class="goods-label-suspension"
								                      v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
								                  <image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
								                </view>
								              </view>
								<view class="uni-product-info">
									<view class="uni-product-title" @click="detailLink(item.seckill_id,routerName,item.id)"
										v-if="routerName == 'bargain'" style="line-height: 40upx;"
										@longpress="copyTitle(item.goods_name)">
										<!-- <text
									style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
									v-if="item.shop_grade==13">核心</text> -->
										<!-- 热榜 -->
										<view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
											<view class="top-text">
												<image src="/pagesC/static/fly_left@2x.png"></image>
												<text>TOP{{item.cat_rank_info_cat_top}}</text>
												<image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
											</view>
										</view>
										<text class="easy_choose"
											v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
										<text class="is-new-goods"
											v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
																		
										<text class="goods-name-text">{{item.goods_name}}</text>
									</view>
									<view class="uni-product-title" @longpress="copyTitle(item.goods_name)"
										@click="detailLink(item.seckill_id,routerName,item.goods_id)" v-else>
										<!-- 特卖 -->
										<!-- <text class="tag" v-if="item.is_promote > 0">{{$t('lang.special_sale')}}</text> -->
										<view style="line-height: 40upx;">
											<!-- <image class="country_icon" :src="item.country_icon" :lazy-load="true"
										v-if="item.country_icon"></image> -->
											<!-- 热榜 -->
											<view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
												<view class="top-text">
													<image src="/pagesC/static/fly_left@2x.png"></image>
													<text>TOP{{item.cat_rank_info_cat_top}}</text>
													<image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
												</view>
											</view>
											<text class="easy_choose"
												v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											<text class="is-new-goods"
												v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
																				
											<text class="goods-name-text">{{item.goods_name}}</text>
										</view>
									</view>
									<!-- 商品名称下面的优惠券 > 首单减N元 > 平台最低价 显示，与首页同步，可横向滑动 -->
									<view class="promo-tags-container">
										<!-- 优惠券（多个） -->
										<view v-if="item.cou_name && item.cou_name.length > 0"
											style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
											<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png" 
												style="width: 28rpx; height: 24rpx; margin-right: 4rpx;"></image>
											{{item.cou_name.join(' | ')}}
										</view>
										<!-- 首单减N元 -->
										<view v-if="item.first_j_price && item.first_j_price !== ''"
											style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
											<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png" 
												style="width: 22rpx; height: 24rpx; margin-right: 4rpx;"></image>
											{{item.first_j_price}}
										</view>
										<!-- 平台最低价 -->
										<view v-if="item.platm_min_price && item.platm_min_price !== ''"
											style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
											<image src="https://images.eqingqu.com/attachs/photo/202601/20260130_EAA591B0B9E61CCE6678AE8DAA41143D.png" 
												style="width: 18rpx; height: 24rpx; margin-right: 4rpx;"></image>
											{{item.platm_min_price}}
										</view>
									</view>
									<!-- 积分 在  goods_services_label_new 中显示了-->
									<!-- <view class="integral-number" v-else-if="item.integral && item.integral > 0">
										积分可抵{{item.integral}}%</view> -->
									<view class="uni-product-price" v-if="routerName == 'bargain'">
										<view class="box"><text
												class="gay del">{{$t('lang.original_price')}}{{item.shop_price}}</text>
										</view>
										<view class="box">
											<text class="gay">{{$t('lang.base_price')}}</text>
											<text class="uni-product-price-original">{{item.target_price}}</text>
										</view>
										<view style="margin-left: 20rpx;font-size: 22rpx;color: #A2A2A2;">
											<text class="yishou color_999">{{$t('lang.goods_soltout')}}
												{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										</view>
									</view>


									<!-- 价格 运费 总件数 -->
									<view class="uni-product-price"
										style="display: flex;flex-direction: row;align-items: baseline;margin-top: -10rpx;"
										v-else>
										<!-- :class="{'uni-juc-center':productOuter}" v-else> -->
										<!-- <currency-price :price="item.shop_price"
											:delPrice="item.is_promote > 0 ? item.market_price : ''"
											:size="24"></currency-price> -->
											
											<currency-price :price="item.shop_price"
												
												:size="24"></currency-price>
										<!-- <view style="display: flex;flex-direction: row;color: #F20E28; ">
										<view style="font-size: 22rpx;margin-top: 6rpx;">￥</view>
										<view style="font-size: 28rpx;font-weight: bold;">{{item.shop_price}}</view>
									</view> -->
										<!-- 运费、新人价、黑卡价 按顺序最多显示两个：运费 → 新人价 → 黑卡价 -->
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
											v-if="item.is_free == 0">
											运费{{item.start_shipping_fee}}元
										</view>
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
											v-if="item.new_member_price == 1">
											新人价
										</view>
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #4D4B4B;"
											v-if="item.is_membership_card_discount_price && (item.is_free != 0 || item.new_member_price != 1)">
											{{item.is_membership_card_discount_price}}
										</view>
										
										<!-- <view v-else
											style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;">
											新人价</view> -->

									</view>
									<view style="font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 16rpx;">

										<text class="yishou color_999">
											已售{{ item.sales_volume }}{{$t('lang.jian')}}
										</text>
									</view>

									<!-- yj -->
									<view class="outer" v-if="routerName == 'drp' && item.commission == 1">
										<view class="commission-tag mt10">
											<view class="num">{{item.dis_commission}}%</view>
											<view class="cont-tag">{{$t('lang.dis_commission')}}</view>
										</view>
									</view>
									<block class="label-line">
										<goods-service-label :tags="item.goods_services_label_new" :max-display="3"
											v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />
										<view class="shop-name-column">
											<!-- <view style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;"> -->
											<!-- <image :src="item.shop_avatar"
											style="height: 40rpx;width: 40rpx;border-radius: 10rpx;" mode="widthFix">
										</image> -->
											<!-- </view> -->
											<!-- 	<text v-if="item.add_year"
										style="color: #A2A2A2;margin-left: 10rpx;">{{item.add_year}}</text>
									<text v-if="item.add_year" style="color: #A2A2A2;">年</text> -->
											<!-- 	<text v-if="item.add_year"
										style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text> -->
											<view style="display: flex;flex-direction: row;align-items: center;width: 100%;"
												@click="toShopHome(item)" v-if="item.seckill_id==0">
											<text
												:class="['label-name',item.shop_grade==13? 'label-margin':'']"
												v-if="item.shop_grade==13">{{item.shop_grade_name}}</text>
											<text
												:class="['label-name',item.is_buy_shop ==1? 'label-margin':'']"
												v-else-if="item.is_buy_shop ==1">买过的店</text>
												<!-- 一件代发 -->
												<text
													:class="['label-name',item.onkey_send ==1? 'label-margin':'']"
													v-else-if="item.onkey_send ==1">一件代发</text>
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<view style="display: flex;flex-direction: row;align-items: center;width: 100%;"
												@click="toShopHome(item)" v-else>
												<text
													:class="['label-name',item.shop_grade==13? 'label-margin':'']"
													v-if="item.shop_grade==13">{{item.shop_grade_name}}</text>
												<text
													:class="['label-name',item.is_buy_shop ==1? 'label-margin':'']"
													v-else-if="item.is_buy_shop ==1">买过的店</text>
													<!-- 一件代发 -->
												<text
													:class="['label-name',item.onkey_send ==1? 'label-margin':'']"
													v-else-if="item.is_buy_shop ==2">一件代发</text>
												
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<!-- 	<view style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
										@click="onSku(item)" v-if="item.seckill_id==0">
										<image
											src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1691018929484.png"
											style="height: 50rpx;width: 50rpx;"></image>
									</view> -->
										</view>
										<!-- <view class="outer"> -->
										<!-- <view class="left uni-ellipsis">
								<text class="sales-volume">{{ item.sales_volume }}{{$t('lang.a_have_purchased')}}</text>
							</view>
							<view class="add-cart" @click="detailLink(routerName,item.goods_id)">
								<text class="iconfont icon-cart"></text>
								<view class="add_num" :class="{'show':addCartClass == true && index == curIndex}">+1</view>
							</view> -->
										<!-- </view> -->
									</block>
								</view>
							</view>
						</view>
						
						<view class="column right-col"  >
							<view class="uni-product" v-for="(item,index) in rightList" :key="index">
								<view class="image-view" 
								                    @click="detailLink(item.seckill_id,routerName,item.goods_id)">
								                
								                <!-- 搜索页面且有视频：显示GIF容器 @click.stop="toggleGifDisplay(item.goods_id)"-->
								                <view v-if="isSearch && item.hasVideo" class="gif-container"
								                      :id="'gif-'+item.goods_id"
								                      >
								                  
								                  <!-- 封面图容器 -->
								                  <view class="cover-content" 
								                        :class="{'cover-hidden': !showCover[item.goods_id]}">
								                    <image class="cover-image" 
								                           :src="item.goods_video_cover" 
								                           mode="aspectFill">
								                    </image>
								                    <!-- 调试信息 -->
								                    <view v-if="isDebug" class="debug-info">
								                      {{ showCover[item.goods_id] ? '封面' : 'GIF播放' }}
								                    </view>
								                  </view>
								                  
								                  <!-- GIF容器 -->
								                  <view class="gif-content" 
								                         v-if="!showCover[item.goods_id]">
								                     <image class="goods-gif" 
								                            :src="item.goods_video_gif" 
								                            mode="aspectFill">
								                     </image>
								                   </view>
								                </view>
								
								                <!-- 非搜索页面或没有视频：显示普通图片 -->
								                <image v-else class="uni-product-image" 
								                       :src="item.goods_thumb" 
								                       mode="widthFix">
								                </image>
								
								                <!-- 其他图片相关元素 -->
								                <view class="bargain-tag" v-if="routerName == 'bargain'">
								                  <view class="iconfont icon-renshu"></view>
								                  {{item.total_num}}{{$t('lang.participation_number')}}
								                </view>
								                <view class="goods-label-suspension"
								                      v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
								                  <image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
								                </view>
								              </view>
								<view class="uni-product-info">
									<view class="uni-product-title" @click="detailLink(item.seckill_id,routerName,item.id)"
										v-if="routerName == 'bargain'" style="line-height: 40upx;"
										@longpress="copyTitle(item.goods_name)">
										<!-- <text
									style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
									v-if="item.shop_grade==13">核心</text> -->
										<!-- 热榜 -->
										<view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
											<view class="top-text">
												<image src="/pagesC/static/fly_left@2x.png"></image>
												<text>TOP{{item.cat_rank_info_cat_top}}</text>
												<image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
											</view>
										</view>
										<text class="easy_choose"
											v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
										<text class="is-new-goods"
											v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
																			
										<text class="goods-name-text">{{item.goods_name}}</text>
									</view>
									<view class="uni-product-title" @longpress="copyTitle(item.goods_name)"
										@click="detailLink(item.seckill_id,routerName,item.goods_id)" v-else>
										<!-- 特卖 -->
										<!-- <text class="tag" v-if="item.is_promote > 0">{{$t('lang.special_sale')}}</text> -->
										<view class="goods_name" style="line-height: 40upx;">
											<!-- <image class="country_icon" :src="item.country_icon" :lazy-load="true"
										v-if="item.country_icon"></image> -->
											<!-- <text class="easy_choose"
												v-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											<text class="is-new-goods" v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
											{{item.goods_name}} -->
											<!-- 热榜 -->
											<view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
												<view class="top-text">
													<image src="/pagesC/static/fly_left@2x.png"></image>
													<text>TOP{{item.cat_rank_info_cat_top}}</text>
													<image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
												</view>
											</view>
											<text class="easy_choose"
												v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											<text class="is-new-goods"
												v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
											
											<text class="goods-name-text">{{item.goods_name}}</text>
										</view>
									</view>
								<!-- 商品名称下面的优惠券 > 首单减N元 > 平台最低价 显示，与首页同步，可横向滑动 -->
								<view class="promo-tags-container">
									<!-- 优惠券（多个） -->
									<view v-if="item.cou_name && item.cou_name.length > 0"
										style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
										<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png" 
											style="width: 28rpx; height: 24rpx; margin-right: 4rpx;"></image>
										{{item.cou_name.join(' | ')}}
									</view>
									<!-- 首单减N元 -->
									<view v-if="item.first_j_price && item.first_j_price !== ''"
										style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
										<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png" 
											style="width: 22rpx; height: 24rpx; margin-right: 4rpx;"></image>
										{{item.first_j_price}}
									</view>
									<!-- 平台最低价 -->
									<view v-if="item.platm_min_price && item.platm_min_price !== ''"
										style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
										<image src="https://images.eqingqu.com/attachs/photo/202601/20260130_EAA591B0B9E61CCE6678AE8DAA41143D.png" 
											style="width: 18rpx; height: 24rpx; margin-right: 4rpx;"></image>
										{{item.platm_min_price}}
									</view>
								</view>
									<!-- 积分 -->
									<!-- <view class="integral-number" v-else-if="item.integral && item.integral > 0">
										积分可抵{{item.integral}}%</view> -->
									<view class="uni-product-price" v-if="routerName == 'bargain'">
										<view class="box"><text
												class="gay del">{{$t('lang.original_price')}}{{item.shop_price}}</text>
										</view>
										<view class="box">
											<text class="gay">{{$t('lang.base_price')}}</text>
											<text class="uni-product-price-original">{{item.target_price}}</text>
										</view>
										<view style="margin-left: 20rpx;font-size: 22rpx;color: #A2A2A2;">
											<text class="yishou color_999">{{$t('lang.goods_soltout')}}
												{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										</view>
									</view>
							
							
									<!-- 价格 运费 总件数 -->
									<view class="uni-product-price"
										style="display: flex;flex-direction: row;align-items: baseline;margin-top: -10rpx;"
										v-else>
										<!-- :class="{'uni-juc-center':productOuter}" v-else> -->
									<!-- 	<currency-price :price="item.shop_price"
											:delPrice="item.is_promote > 0 ? item.market_price : ''"
											:size="24"></currency-price> -->
											
											<currency-price :price="item.shop_price"
												
												:size="24"></currency-price>
										<!-- <view style="display: flex;flex-direction: row;color: #F20E28; ">
										<view style="font-size: 22rpx;margin-top: 6rpx;">￥</view>
										<view style="font-size: 28rpx;font-weight: bold;">{{item.shop_price}}</view>
									</view> -->
							
									<!-- 运费、新人价、黑卡价 按顺序最多显示两个：运费 → 新人价 → 黑卡价 -->
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
											v-if="item.is_free == 0">
											运费{{item.start_shipping_fee}}元
										</view>
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
											v-if="item.new_member_price == 1">
											新人价
										</view>
										<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #4D4B4B;"
											v-if="item.is_membership_card_discount_price && (item.is_free != 0 || item.new_member_price != 1)">
											{{item.is_membership_card_discount_price}}
										</view>
					
									</view>
									<view style="font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 16rpx;">
							
										<text class="yishou color_999">
											已售{{ item.sales_volume }}{{$t('lang.jian')}}
										</text>
									</view>
							
									<!-- yj -->
									<view class="outer" v-if="routerName == 'drp' && item.commission == 1">
										<view class="commission-tag mt10">
											<view class="num">{{item.dis_commission}}%</view>
											<view class="cont-tag">{{$t('lang.dis_commission')}}</view>
										</view>
									</view>
									<block class="label-line">
										<goods-service-label :tags="item.goods_services_label_new" :max-display="3"
											v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />
										<view class="shop-name-column">
										
											<view style="display: flex;flex-direction: row;align-items: center;width: 100%;"
												@click="toShopHome(item)" v-if="item.seckill_id==0">
												<text
												:class="['label-name',item.is_buy_shop ==1? 'label-margin':'']"
												
													v-if="item.is_buy_shop ==1">买过的店</text>
												<text
												:class="['label-name',item.shop_grade==13? 'label-margin':'']"
													v-else-if="item.shop_grade==13">{{item.shop_grade_name}}</text>
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<view style="display: flex;flex-direction: row;align-items: center;width: 100%;"
												@click="toShopHome(item)" v-else>
												<text
													:class="['label-name',item.is_buy_shop ==1? 'label-margin':'']"
													v-if="item.is_buy_shop ==1">买过的店</text>
												<text
													:class="['label-name',item.is_buy_shop ==1? 'label-margin':'']"
													v-else-if="item.is_buy_shop ==1">买过的店</text>
												<view class="shop_name_class" >{{item.shop_name}}</view>
											</view>
										</view>
									</block>
								</view>
							</view>
						</view>
					
					</view>
					
				</view>
		
		</block>
		
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		<!-- 商品属性弹框 start -->
		<uni-popups ref="goodsattr" type="bottom">
			<view :class="isIpx==true?'pop_content':'pop_contents'">
				<view class="goods_attr_pop">
					<image class="close_img"
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
						@click="closePop('goodsattr')"></image>
					<view class="goods_info">
						<image class="goods_pic" :src="goodsDetail.goods_thumb"
							@click="previewImg(0, goodsDetail.goods_thumb)"></image>
						<view class="info_right">
							<currency-price :price="goodsDetail.shop_price" :size="24"
								v-if="goodsDetail.shop_price"></currency-price>
							<view class="selece_atrr">{{$t('lang.label_selected2')}}：{{selectAttr}}</view>
							<view class="inventory">
								<view class="inventory_num"
									v-if="goodsDetail.goods_number && goodsDetail.show_goodsnumber > 0">
									<text class="label">{{$t('lang.stock')}}：</text> <!-- stock 库存 -->
									<text>{{goodsDetail.goods_number}}</text>
								</view>
								<view class="inventory_sn" v-if="goodsDetail.goods_sn && goodsDetail.show_goodssn == 1">
									<text class="label">{{$t('lang.commodity_number')}}：</text>
									<!-- commodity_number 编号 -->
									<text>{{goodsDetail.goods_sn}}</text>
								</view>
							</view>
							<view class="inventory" v-if="goodsDetail.upc">
								<view class="inventory_num">
									<text class="label">条形码：</text>
									<text>{{goodsDetail.upc}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
					<view class="goods_attr_pop">
						<view class="goods_attr_wrap">
							<view class="attr_type" v-for="(item, index) in goodsAttr" :key="index">
								<view class="attr_title">{{item.name}}</view>
								<view class="attr_list">
									<view
										:class="['attr_item', seleceGoodsAtrrArray.includes(attrItem.id) ? 'active_attr' : '']"
										@click="selectGoodsAttr(attrItem, item)"
										v-for="(attrItem, attrIndex) in item.attr_key" :key="attrIndex">
										{{attrItem.attr_value}}
									</view>
								</view>
							</view>
							<view class="attr_type goods_num_wrap">
								<view class="attr_title">{{$t('lang.number')}}</view>
								<view class="limit_and_mun">
									<text class="limit_txt" v-if="goodsDetail.is_minimum > 0">（ {{goodsDetail.minimum}}
										{{goodsDetail.goods_unit}}{{$t('lang.label_minimum_2')}}）</text>
									<text class="limit_txt"
										v-if="goodsDetail.xiangou_num > 0 && goodsDetail.xiangou_end_date > goodsDetail.current_time">（{{$t('lang.purchase_only')}}
										{{goodsDetail.xiangou_num}} {{goodsDetail.goods_unit}}）</text>
									<view class="add_num_wrap">
										<text :class="['iconfont', 'icon-jian', goodsNum > minNum ? '' : 'limit_1']"
											@click="changeGoodsNum('subtract')"></text>
										<input class="add_input" type="number" :value="goodsNum"
											@blur="changeGoodsNumByInput" />
										<text :class="['iconfont', 'icon-jia', goodsNum < xiangouNum ? '' : 'limit_1']"
											@click="changeGoodsNum('add')"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="footer_btn u-border-top">
					<block v-if="!storeBtn">
						<block v-if="is_on_sale">
							<button class="u-reset-button sub_btn yellow_btn">{{$t('lang.goods_sold_out')}}</button>
						</block>
						<block v-else-if="is_alone_sale">
							<button class="u-reset-button sub_btn yellow_btn"
								@click="goodsAloneSale">{{$t('lang.goods_alone_sale')}}</button>
						</block>
						<block v-else>
							<block v-if="goodsDetail.goods_number">
								<button class="u-reset-button sub_btn yellow_btn" @click="onAddCartClicked(0)"
									v-if="addType == 1 || addType == ''">{{$t('lang.add_cart')}}</button>
							</block>
							<block v-else>
								<button class="u-reset-button sub_btn yellow_btn">{{$t('lang.understock')}}</button>
							</block>
						</block>
					</block>
					<block v-else>
						<button class="u-reset-button sub_btn pup_btn red_btn"
							@click="onStoreClicked">{{ $t('lang.private_store') }}</button>
					</block>
					<!-- #ifdef H5 -->
					<view style="height: 280rpx;" v-if="showone==true"></view>
					<!-- #endif -->
				</view>
			</view>
		</uni-popups>
		<!-- 商品属性弹框 end -->
	</view>
	
</template>

<script>
	import goodsServiceLabel from '@/components/goods-service-label/goods-service-label.vue'
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import universal from '@/common/mixins/universal.js';
	const CONTENT_CONFIG = {
		TITLE_LINE_HEIGHT: 34, // 标题行高(rpx)
		PRICE_HEIGHT: 15, // 价格区域高度
		TAG_ROW_HEIGHT: 20, // 每行标签高度
		META_ROW_HEIGHT: 12, // 元信息行高
		ROW_GAP: 4 // 行间距
	}
	export default {
		mixins: [universal],
		props: {
			 isSearch: {
			      type: Boolean,
			      default: false // 默认不是搜索页面
			    },
			// 当前页数据
			list: {
				type: Array,
				default: []
			},
			// 包含每一页数据
			allList:{
				type: Array,
				default: () => []
			},
			type:{
				type: String,
				default: 'click'
			},
			mode: {
				type: String,
				default: 'grid'
			},
			loadMoreStatus: {
				type: String,
				default: 'loading'
			},
			routerName: {
				type: String,
				default: 'goods'
			},
			routerType: {
				type: String,
				default: 'navigateTo'
			},
			productOuter: {
				type: Boolean,
				default: false
			},
			showone: {
				type: Boolean,
				default: false
			},
			// fromCart: {
			// 	type: Boolean,
			// 	default: false
			// },
			guessList: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				 showCover: {}, // 记录每个商品是否显示封面
				      showingGif: null, // 当前显示的GIF商品ID
				      gifObserver: null, // Intersection Observer实例
				      isDebug: false, // 调试模式开关
				waterfallConfigs: {
					gridColumns: 1, //列数
					headHeight: '400rpx', //head高度
					textRows: 3, //文本的行数
					headWidth: '340rpx',
					headWidth: '344rpx',
					padding: '6rpx',
				},
					loading1:true,
				addCartClass: false,
				curIndex: null,
				seleceGoodsAtrrArray: [],
				goodsNum: 1,
				minNum: 1,
				xiangouNum: 1,
				addType: '',
				goodsDetail: {},
				goodsAttr: [],
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				storeBtn: false,
				is_on_sale: false,
				is_alone_sale: false,
				attr: [],
				isIpx: false,
				leftList: [], // 左列数据
				rightList: [], // 右列数据
				leftHeight: 0, // 左列当前高度
				rightHeight: 0, // 右列当前高度
				placeholderHeight: 0, // 占位高度
				itemGap: 10,     // 元素间隔（单位：rpx）
				heightDifference: 0,
			};
		},
		components: {
			dscNotContent,
			uniPopups,
			goodsServiceLabel
		},
		onLoad(e) {
			console.log(e)
		},
		computed: {
			
			// islist() {
			// 	return this.distributeItems(this.list)

			// },
			selectAttr: {
				get() {
					return this.goodsAttr.length > 0 ? this.goodsDetail.attr_name + ' ' + this.goodsNum + this
						.goodsDetail.goods_unit : this.goodsNum + this.goodsDetail.goods_unit;
				},
				set(val) {
					this.goodsDetail.attr_name = val;
				}
			},
		
		},
		created() {
			var that = this
			uni.getSystemInfo({
				success: function(res) {
					let modelmes = res.model;
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
		},
		methods: {
			    // 初始化GIF观察器（仅在搜索页面启用）
			    initGifObserver() {
			      // 如果不是搜索页面，不初始化GIF功能
			      if (!this.isSearch) {
			        console.log('非搜索页面，不启用GIF功能');
			        return;
			      }
			
			      console.log('初始化GIF观察器 - 搜索页面');
			      
			      // 清理旧的观察器
			      if (this.gifObserver) {
			        this.gifObserver.disconnect();
			        this.gifObserver = null;
			      }
			
			      // 创建新的观察器
			      this.gifObserver = uni.createIntersectionObserver(this, {
			        thresholds: [0.5], // 只用一个阈值：50%进入观察区域
			        observeAll: true
			      });
			
			      // 设置观察区域 - 屏幕中央40%区域
			      this.gifObserver
			        .relativeToViewport({
			          top: -150,  // 观察区域从屏幕25%开始
			          bottom: -150 // 到屏幕75%结束
			        })
			        .observe('.gif-container', (res) => {
			          const goodsId = res.id ? res.id.replace('gif-', '') : null;
			          if (!goodsId) return;
			
			          // 简单逻辑：进入中心区域就显示，离开就隐藏
			          if (res.intersectionRatio >= 0.5) {
			            this.showGif(goodsId);
			          } else {
			            this.hideGif(goodsId);
			          }
			        });
			    },
			
			    // 显示GIF - 确保同一时间只有一个
			    showGif(goodsId) {
			      if (!goodsId || this.showingGif === goodsId) return;
			      
			      console.log('显示GIF:', goodsId);
			      
			      // 先隐藏当前显示的GIF
			      if (this.showingGif) {
			        this.$set(this.showCover, this.showingGif, true);
			      }
			      
			      // 显示新的GIF
			      this.$set(this.showCover, goodsId, false);
			      this.showingGif = goodsId;
			    },
			
			    // 隐藏GIF
			    hideGif(goodsId) {
			      if (!goodsId || this.showingGif !== goodsId) return;
			      
			      console.log('隐藏GIF:', goodsId);
			      this.$set(this.showCover, goodsId, true);
			      this.showingGif = null;
			    },
			
			    // 手动切换GIF显示（用户点击）
			    toggleGifDisplay(goodsId) {
			      if (!this.isSearch) return; // 非搜索页面不响应点击切换
			      
			      if (this.showCover[goodsId]) {
			        this.showGif(goodsId);
			      } else {
			        this.hideGif(goodsId);
			      }
			    },
			
			    // 初始化所有GIF状态
			    initGifStates(items) {
			      if (!this.isSearch) return;
			      
			      // 重置所有GIF状态为封面
			      items.forEach(item => {
			        if (item.hasVideo) {
			          this.$set(this.showCover, item.goods_id, true);
			        }
			      });
			      this.showingGif = null;
			    },
			
			    // 清理GIF观察器
			    clearGifObserver() {
			      if (this.gifObserver) {
			        this.gifObserver.disconnect();
			        this.gifObserver = null;
			      }
			    },
			
			
			
		  // 标签显示判断
		  shouldShowLabels(item) {
		    return this.getSortedLabels(item).length > 0
		  },
		
		  // 核心处理方法（带参数传递）
		  getSortedLabels(item) {
		    // 安全获取数据源
		    const labelSource = this.safeGetLabels(item)
		    
		    return labelSource
		      .filter(tag => this.isValidLabel(tag))
		      .sort(this.sortLabels)
		      .slice(0, 2)
		  },
		
		  // 安全获取标签数据
		  safeGetLabels(item) {
		    // 三级安全校验
		    if (!item) return []
		    if (!Object.prototype.hasOwnProperty.call(item, 'goods_services_label_new')) return []
		    return Array.isArray(item.goods_services_label_new) 
		      ? item.goods_services_label_new 
		      : []
		  },
		
		
		isValidLabel(tag) {
		    if (!tag || typeof tag !== 'object') return false
		    
		    // 只要value存在且name存在就返回true
		    return typeof tag.value !== 'undefined' && tag.name
		},
		
		  // 严格优先级排序
		  sortLabels(a, b) {
		    const priorityMap = Object.freeze({
		      '退货包运费': 1,
		      '一件包邮': 2,
		      '包邮': 3,
		      '会员价': 4,
		      '先用后付': 5,
		      '24小时发货': 6,
		      '回头率': 7,
		      '一件代发': 8,
		      '积分可抵': 9
		    })
		
		    const getScore = item => 
		      priorityMap[item.name] || Number.MAX_SAFE_INTEGER
		
		    return getScore(a) - getScore(b)
		  },
			// 瀑布流区域	
			// 智能分配元素
			 distributeItems(items) {
			    items.forEach(item => {
			      const itemHeight = this.calcItemHeight(item) + this.itemGap;
			      this.loading1=false;
			      if (this.leftHeight <= this.rightHeight) {
			        this.leftList.push({ ...item });
			        this.leftHeight += itemHeight;
			      } else {
			        this.rightList.push({ ...item });
			        this.rightHeight += itemHeight;
			      }
			    });
			  },



			// 调整元素高度 
			adjustItemHeight(item, newHeight, column) {
				const diff = newHeight - item.height
				item.height = newHeight

				if (column === 'left') {
					this.leftHeight += diff
				} else {
					this.rightHeight += diff
				}
			},

			// 计算预估高度
			 calcItemHeight(item) {
			    let height = 170 // 基础图片高度
			    
			    // 标题行计算
			    const titleLines = Math.ceil((item.goods_name || '').length / 15)
			    height += Math.min(titleLines, 2) * 34
			    
			    // 价格区域
			    if (item.shop_price) height += 15
			    if (item.sales_volume) height += 15
			    
			    // 标签区域（每行20rpx）
			    if (item.goods_services_label_new?.length) {
			      const tagRows = Math.ceil(item.goods_services_label_new.length / 3)
			      height += tagRows * 20
			    }
			    
			    return height
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
			toShopHome: function(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
				})
			},
			onSku(item) {
				var that = this
				that.goodsDetail = item
				that.goodsAttr = item.attr ? item.attr : [];
				that.is_on_sale = item.is_alone_sale == 0 ? true : false
				that.is_alone_sale = item.is_alone_sale == 0 ? true : false
				that.attr = item.attr ? item.attr : [];
				// 起购数量
				if (item.minimum > 1) {
					that.goodsNum = item.minimum;
					that.minNum = item.minimum || 1;
				} else {
					that.goodsNum = 1
				}

				//限购
				if (item.xiangou_num > 0 && item.xiangou_end_date > item.current_time) that.xiangouNum = item.xiangou_num;
				that.xiangouNum = item.goods_number;

				// 默认勾选的属性
				if (item.attr) {
					item.attr.forEach(items => {
						items.attr_key.forEach(val => {
							if (val.attr_checked == 1) {
								that.seleceGoodsAtrrArray.push(val.id);
							};
						});
					});
				};
				console.log(that.attr.length)
				console.log(!that.storeBtn)
				console.log(that.is_on_sale)
				console.log(that.is_alone_sale)
				if (that.is_on_sale) {
					uni.showToast({
						title: that.$t('lang.goods_sold_out'),
						icon: 'none'
					});
					return;
				}
				if (that.is_alone_sale) {
					uni.showToast({
						title: that.$t('lang.goods_alone_sale'),
						icon: 'none'
					});
					return;
				}

				that.addType = 0 == 0 ? 1 : 2;
				console.log(that.addType)
				if (that.attr.length > 0) {
					uni.showLoading({
						title: '加载中~'
					})
					uni.request({
						url: 'https://www.ok9288.com/api/goods/get_goods_barc_code',
						method: 'POST',
						data: {
							"goods_attr_id": that.seleceGoodsAtrrArray,
							"goods_id": item.goods_id
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res_1) => {
							console.log('goods_attr_id', res_1.data)
							uni.hideLoading()
							if (res_1.data.status == "success") {
								that.goodsDetail.upc = res_1.data.data
							}
						}
					})
					that.$refs['goodsattr'].open();
				} else {
					that.onAddCartClicked(0)
				}
			},
			async onAddCartClicked() {
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
				if (that.attr.length > 0) {
					newAttr = that.seleceGoodsAtrrArray;
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
				// uni.showToast({
				// 	title: version,
				// 	icon: 'success',
				// 	duration: 1500
				// });
				uni.showLoading({
					title: that.$t('lang.loading_submit'), //loading_submit 提交中...
					mask: true
				});


				console.log("goods_id:" + that.goodsDetail.goods_id)
				console.log("num:" + that.goodsNum)
				console.log("spec:" + newAttr)
				console.log("spec:" + newAttr.length)
				console.log("seleceGoodsAtrrArray:" + that.seleceGoodsAtrrArray)
				console.log("app_version:" + version)
				console.log("rec_type:" + '0')
				console.log("cou_id:" + that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id :
					0)
				that.$store.dispatch('setAddCart', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					spec: newAttr,
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0',
					rec_type: '0',
					app_version: version,
					cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
				}).then(res => {
					uni.hideLoading();
					console.log(res)
					if (res.data.error == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
						that.seleceGoodsAtrrArray = []
						return;
					} else {
						let status = res.data.uc_id >= 0 ? res.data.status : res.data
						if (status == true) {
							uni.showToast({
								title: that.$t('lang.added_to_cart'),
								icon: 'success',
								duration: 500
							});
							//获取购物车数量
							// that.$store.dispatch('setCommonCartNumber');
							that.closePop('goodsattr');
							that.seleceGoodsAtrrArray = []
						} else {
							uni.showToast({
								title: status.msg,
								icon: 'none',
								duration: 500
							});
						}
					}

				});
			},

			// 勾选商品属性
			selectGoodsAttr(res, val) {
				var that = this
				if (that.seleceGoodsAtrrArray.includes(res.id)) {
					if (val.attr_type == 1) {
						// 单选属性
					} else {
						// 多选属性
						const seleceArr = [];
						val.attr_key.forEach(item => {
							if (that.seleceGoodsAtrrArray.includes(item.id)) {
								seleceArr.push(item.id);
							}
						});
						if (seleceArr.length > 1) that.seleceGoodsAtrrArray = that.seleceGoodsAtrrArray.filter(id => id !=
							res.id);
						that.changeAttr();
					}
				} else {
					if (val.attr_type == 1) {
						// 单选属性
						val.attr_key.forEach(item => {
							if (that.seleceGoodsAtrrArray.includes(item.id)) {
								that.seleceGoodsAtrrArray = that.seleceGoodsAtrrArray.filter(id => id != item.id);
							}
						});
						that.seleceGoodsAtrrArray.push(res.id);
					} else {
						// 多选属性
						that.seleceGoodsAtrrArray.push(res.id);
					}
					that.changeAttr();
				}
			},

			// 按钮修改商品数量
			changeGoodsNum(type) {
				if (type == 'add') {
					if (this.goodsNum < this.xiangouNum) {
						this.goodsNum++;
					}
				} else if (type == 'subtract') {
					if (this.goodsNum > this.minNum) {
						this.goodsNum--;
					}
				}
			},
			// 修改商品属性
			async changeAttr(load = false) {
				var that = this
				console.log(that.seleceGoodsAtrrArray)
				const {
					data,
					status
				} = await that.$store.dispatch('setGoodsAttrOperById', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					attr_id: that.seleceGoodsAtrrArray
				});
				if (status != 'success') return that.showToast();
				// console.log(data)
				that.selectAttr = data.attr_name;
				that.goodsDetail.upc = data.bar_code
				that.goodsDetail.goods_number = data.stock;
				that.goodsDetail.shop_price = data.shop_price;
				that.goodsDetail.marketPrice = data.market_price;

				if (data.attr_img) that.goodsDetail.goods_thumb = data.attr_img;

				if (load) setTimeout(() => {
					that.dscLoading = false
				}, 30);
			},
			// 输入修改商品数量
			changeGoodsNumByInput(e) {
				if (e.detail.value < this.minNum) {
					this.goodsNum = this.minNum;
					this.showToast(`${this.$t('lang.zhishao')}${this.minNum}${this.$t('lang.jian')}`);
				} else {
					this.goodsNum = e.detail.value;
				}
			},
			// 显示底部弹框
			showPopup(res) {
				this.$refs[res].open()

				if (res == 'address') {
					this.regionShow = true;
				}
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
				this.seleceGoodsAtrrArray = []
				if (res == 'goodsattr') {
					this.storeBtn = false;
				}
			},
			goodsAloneSale() {
				uni.navigateTo({
					url: `/pagesD/goodslist/goodslist?id=${this.goodsDetail.cat_id}`
				})
			},

			detailLink(seckill_id, routerName, id) {
				console.log('秒杀id',seckill_id,'商品名',routerName,'商品id',id)
				// if (seckill_id != 0) {
				// 	uni.navigateTo({
				// 		url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
				// 			'&tomorrow=0&delta=2'
				// 	});
				// } else {
					if (routerName == 'goods' || routerName == 'drp') {
						//猜你喜欢商品链接
						if (this.guessList) {
							if (this.routerType == 'reLaunch') {
								uni.redirectTo({
									url: '/pagesC/goodsDetail/goodsDetail?id=' + id
								})
							} else {
								uni.navigateTo({
									url: '/pagesC/goodsDetail/goodsDetail?id=' + id
								})
							}
						} else {
							let goodsList = this.allList.length >0 ? this.allList :this.list 
							goodsList.forEach(v => {
								if (v.goods_id == id) {
									//判断是否是预售
									if (v.get_presale_activity) {
										uni.navigateTo({
											url: '/pagesA/presale/detail/detail?act_id=' + v
												.get_presale_activity.act_id
										})
									} else {
										if (this.routerType == 'reLaunch') {
											uni.redirectTo({
												url: '/pagesC/goodsDetail/goodsDetail?id=' + id
											})
										} else {
											uni.navigateTo({
												url: '/pagesC/goodsDetail/goodsDetail?id=' + id
											})
										}
									}
								}
							});
						}
					} else if (routerName == 'bargain') {
						uni.navigateTo({
							url: '/pagesA/bargain/detail/detail?id=' + id
						})
					}
				// }

			}
		},
		// watch: {
		//   list: {
		//     handler(newVal) {
		//       // 滚动加载时保留现有列，点击搜索时重置列
		//       if (this.type === 'click') {
		//         this.leftList = [];
		//         this.rightList = [];
		//         this.leftHeight = 0;
		//         this.rightHeight = 0;
		//       }
		//       this.distributeItems(newVal);
		//     },
		//     deep: true,
		//     immediate: true
		//   }
		// },
		  watch: {
		    list: {
		      handler(newVal) {
		        // 滚动加载时保留现有列，点击搜索时重置列
		        if (this.type === 'click') {
		          this.leftList = [];
		          this.rightList = [];
		          this.leftHeight = 0;
		          this.rightHeight = 0;
		        }
		        this.distributeItems(newVal);
		        
		        // 初始化GIF状态
		        this.$nextTick(() => {
		          setTimeout(() => {
		            this.initGifStates(newVal);
		            this.initGifObserver();
		          }, 300);
		        });
		      },
		      deep: true,
		      immediate: true
		    },
		
		    // 监听isSearch变化
		    isSearch: {
		      handler(newVal) {
		        if (newVal) {
		          // 切换到搜索页面，初始化GIF功能
		          this.$nextTick(() => {
		            setTimeout(() => {
		              this.initGifStates(this.list);
		              this.initGifObserver();
		            }, 300);
		          });
		        } else {
		          // 切换到非搜索页面，清理GIF功能
		          this.clearGifObserver();
		          // 重置所有GIF状态为封面
		          Object.keys(this.showCover).forEach(goodsId => {
		            this.$set(this.showCover, goodsId, true);
		          });
		          this.showingGif = null;
		        }
		      },
		      immediate: true
		    }
		  },
		   beforeDestroy() {
		      this.clearGifObserver();
		    },
	}
</script>

<style lang="scss">
	@import "/common/css/common.css";


	.container {
		position: relative;

	}

	.fixed-area {
		position: absolute;
		pointer-events: none;

		.left-placeholder,
		.right-placeholder {
			opacity: 0;
		}
	}

	.waterfall-wrapper {
		display: flex;
		justify-content: space-between;

		.right-col {
			margin-left: 16rpx;
		}
	}

	.column {
		// width: 345rpx;

		//   &.left-col {
		//     margin-top: -100vh; // 补偿占位高度
		//   }

		// &.right-col {
		//   margin-top: -17vh; // 根据右侧占位调整
		// }
	}

	.placeholder-box {
		&.left {
			height: 800rpx; // 与占位元素同高
		}

		&.right {
			height: 400rpx; // 半个item高度
		}
	}

	.waterfall-item {
		width: 345rpx;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

		.img-box {
			min-height: 340rpx;
		}

		image {
			width: 100%;
			display: block;
		}

		.title {
			display: block;
			padding: 20rpx;
			font-size: 28rpx;
			color: #333;
			line-height: 1.4;
		}
	}

	/* 多端适配 */
	@media (min-width: 768px) {
		.waterfall-wrapper {
			width: 100%;
			margin: 0 auto;
			.right-col {
				width: 48.5%;
			}
			.left-col {
				width: 48.5%;
			}
		}
	}

	/*product-list*/
	.uni-product-list {
		padding: 0 18upx;
		margin-top: 18upx;
		box-sizing: border-box;
		background-color: #f5f5f5;
		position: relative;
		z-index: 1; // 确保商品列表的层级低于底部按钮
	}

	// .uni-product {
	// 	width: 48.5%;
	// }

	.uni-product-list .uni-product-title {
		font-size: 28upx;
		// height: 80upx;
		height: auto;
		margin-bottom: 16rpx;
		.goods_name {
			
			align-items: baseline;
			.goods-name-text {
				font-weight: 400;
				font-size: 28rpx;
				color: #4D4B4B;
				line-height: 28rpx;
				// display: inline-block;
				vertical-align: bottom; /* 关键：对齐底部基线 */
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
				line-height: 28rpx; /* 保持行高一致 */
				display: inline-block;
				vertical-align: bottom; /* 关键：对齐底部基线 */
			}
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
			line-height: 28rpx;
		}
	}

	.uni-product-list .uni-product-title .tag {
		background-color: #ff5256;
		color: #fff;
		padding: 0 10upx;
		margin-right: 10upx;
	
	}

	// yj
	.uni-product-list .outer {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		margin-top: 10upx;
	}

	.uni-product-list .outer .left {
		width: 260upx;
	}

	.uni-product-list .outer .tag {
		background-color: #fef0f0;
		color: #f92028;
		padding: 5upx 10upx;
		border-radius: 10upx;
	}

	.uni-product-list .outer .sales-volume {
		font-size: 26upx;
		color: #999999;
	}

	.uni-product-list .outer .icon-cart {
		color: #f92028;
		font-size: 35upx;
		margin-right: 10upx;
	}

	.uni-product-list .outer-teshu {
		margin-top: 15upx;
		line-height: 0;
		flex-wrap: inherit;
		display: inherit;
		height: 16px;
		line-height: 16px;
		overflow: hidden;
	}

	.uni-product-list .outer-teshu .tag {
		padding: 0 10upx;
		height: 16px;
		line-height: 16px;
		background-color: #f92028;
		color: #FFFFFF;
		float: left;
		margin-right: 10upx;
		font-size: 12px;
		border-radius: 8upx;
	}

	.uni-product-list .outer-teshu .label-list {
		font-size: 0;
		line-height: 0;
		display: inherit;
	}

	.uni-product-list .outer-teshu .label-list .label-img {
		height: 16px;
		font-size: 0;
		line-height: 0;
	}

	.product-list-medium .uni-product {
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}

	.product-list-medium .uni-product .image-view {
		width: 220upx;
		height: 220upx;
	}

	.uni-product-info {
		align-items: baseline;
		width: 100%;
		max-width: 350rpx;
		.easy_choose {
			background: #DCAB6C;
			box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05);
			font-weight: 500;
			font-size: 20rpx;
			color: #FFFFFF;
			padding: 4rpx 6rpx;
			margin-right: 16rpx;
			border-radius: 10rpx;
			line-height: 28rpx; /* 保持行高一致 */
			display: inline-block;
			vertical-align: bottom; /* 关键：对齐底部基线 */
		}
		.goods-name-text {
			font-weight: 400;
			font-size: 28rpx;
			color: #4D4B4B;
			line-height: 28rpx;
			// display: inline-block;
			vertical-align: bottom; /* 关键：对齐底部基线 */
		}

		.top-one {
			display: flex;
			font-weight: 400;
			font-size: 24rpx;
			color: #DCAB6C;
			align-items: center;

			.top-name {
				margin-right: 16rpx;
			}
			.top-text {
						
							line-height: 1;
						    display: flex;
						    align-items: center;
					}
			.top-text image {
				width: 14rpx;
				height: 20rpx;
				
			}
			.fly-right {
				transform: scaleX(-1);
			}
		}

		.integral-number {
			font-weight: 400;
			font-size: 24rpx;
			color: #FE2F02;
		}

	}

	.product-list-medium .uni-product-info {
		width: auto;
		flex: 1 1 0%;

	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.add-cart {
		position: relative;
	}

	.add_num {
		right: 5px;
	}

	.image-view {
		position: relative;
	}

	.bargain-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 25upx;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 20upx;
		position: absolute;
		bottom: 10upx;
		right: 10upx;
		padding: 3upx 20upx;
		color: #FFFfff;
	}

	.bargain-tag .iconfont {
		line-height: 1;
		margin-right: 10upx;
	}

	.uni-product-price .box {
		line-height: 1.5;
	}

	.uni-product-price .gay {
		color: #999999;
		margin-right: 5upx;
	}

	.uni-product-price .del {
		text-decoration: line-through;
		font-size: 24upx;
	}

	.uni-product-price .em {
		font-size: 24upx;
	}

	.uni-product-price {
		.label {
			margin-bottom: 16rpx;
		}
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
		// width: 45%;
	}

	/* start--Retina 屏幕下的 1px 边框--start */
	.u-border-top,
	.u-border-top:after,
	.u-border-top:after {
		border-top-width: 1px
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

	/* 提交订单栏 start */
	.sub_btn {
		width: 100%;
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

	.yellow_btn {
		background-color: #FFC707;
	}

	.red_btn {
		background-color: #F91F28;
	}

	/* 提交订单栏 end */

	/* 优惠弹框 start */
	.pop_content {
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;
	}

	.pop_contents {
		// padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;
	}

	/* 优惠弹框 end */

	/* 商品属性弹框 start */
	.goods_attr_pop {
		position: relative;
		padding: 30rpx;

		.close_img {
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			width: 44rpx;
			height: 44rpx;
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
				flex-direction: column;
				justify-content: flex-end;
				margin-left: 20rpx;

				.selece_atrr {
					margin-top: 10rpx;
					line-height: 40rpx;
				}
			}
		}

		.inventory {
			display: flex;
			justify-content: space-between;
			margin-top: 10rpx;
			color: #999;

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

			.attr_list {
				display: flex;
				flex-wrap: wrap;
				width: 720rpx;

				.attr_item {
					padding: 0 30rpx;
					height: 62rpx;
					line-height: 62rpx;
					text-align: center;
					border-radius: 30rpx;
					margin: 30rpx 30rpx 0 0;
					background-color: #F2F2F2;
				}

				.active_attr {
					color: #F22E20;
					background-color: #FCEDEB;
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

	.footer_btn {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		padding: 15rpx 30rpx;

		.sub_btn:last-child {
			margin-right: 0;
		}
	}

	.pup_btn {
		flex: 1;
		margin: 0;

		&:nth-child(n + 2) {
			margin-left: 30rpx;
		}
	}

	/* 适配iPhone X */
	.IpxBot {
		position: fixed;
		bottom: 160rpx;
		left: 0;
		width: 92%;
	}

	/* 适配iPhone X */
	.IpxBots {
		position: fixed;
		bottom: 106rpx;
		left: 0;
		width: 92%;
	}

	/* 商品属性弹框 end */
	.label-line {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		font-size: 10px;
		transform: scale(0.8);
		margin-left: -40rpx;
		width: 120%;
		margin-top: -10rpx;
	}

	.shop-name-column {
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 40rpx;
		margin-top: -10rpx;
		width: 100%;
		.label-name {
			color: #FE0302;
			border-radius: 10rpx;
			font-size: 22rpx;
			width: fit-content;
			min-width: fit-content;
			
		}
		.label-margin {
			margin-right: 10rpx;
		}
	}

	.label-box {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		margin-bottom: 16rpx;

		.label-box-line {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			padding-bottom: 5px;
			margin: 0 12rpx 0 0;
			text-align: left;

		}

		.zero-label {
			color: #09B248;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.zero-tag {
			color: #FF7705;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.first-label {
			color: #09B248;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}

		.second-label {
			color: #A2A2A2;
			font-size: 12px;
			font-weight: 400;
			line-height: 12px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
		}
	}

	/* 优惠券/首单/平台最低价 与首页同步，可横向滑动（不依赖 .label-box，保证店铺首页等场景生效） */
	.promo-tags-container {
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		flex-wrap: nowrap;
	}
	.promo-tags-container > view {
		display: inline-flex;
		flex-shrink: 0;
		margin-right: 8rpx;
	}

	.label-style {
		color: transparent;
		display: inline-block;
		transform: scale(0.9);
	}

	.label-style view:nth-child(-n+3) {
		color: #FE0302;
		border-radius: 10rpx;
		border: 2rpx solid #FE0302;
		transform: scale(0.9);
		padding: 0rpx 10rpx;
		margin-right: 2rpx;
	}
	
	
	
	/* GIF容器样式 */
	.gif-container {
	  position: relative;
	  width: 100%;
	  height: 100%;
	}
	
	.cover-content, .gif-content {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	}
	
	.cover-hidden {
	  opacity: 0;
	  pointer-events: none;
	}
	
	.cover-image, .goods-gif {
	  width: 100%;
	  height: 100%;
	}
	
	/* 调试信息样式 */
	.debug-info {
	  position: absolute;
	  top: 5px;
	  left: 5px;
	  background: rgba(0, 0, 0, 0.7);
	  color: white;
	  padding: 2px 6px;
	  border-radius: 3px;
	  font-size: 10px;
	  z-index: 10;
	}
	
	/* 调试中心区域 */
	.debug-center-region {
	  position: fixed;
	  top: 25%;
	  bottom: 25%;
	  left: 0;
	  right: 0;
	  pointer-events: none;
	  z-index: 9999;
	  border: 3px solid #00ff00;
	  background-color: rgba(0, 255, 0, 0.1);
	}
	
	.debug-center-line {
	  position: absolute;
	  top: 50%;
	  left: 0;
	  right: 0;
	  height: 2px;
	  background-color: #ff0000;
	  transform: translateY(-50%);
	}
	
	.debug-center-text {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  background: rgba(0, 0, 0, 0.9);
	  color: #00ff00;
	  padding: 8px 16px;
	  border-radius: 8px;
	  font-size: 14px;
	  font-weight: bold;
	}
	

</style>