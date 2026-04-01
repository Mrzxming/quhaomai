<template>
	<view class="uni-page-body">
		<view class="search_container">


			<!-- #ifdef H5 -->
			<!-- <app-down :configData="shopConfig" @localShow="localShow" v-if="shopConfig && shopConfig.wap_index_pro == 1"></app-down> -->
			<div class='app-down' v-if="localShow">
				<div class="ect-header-banner dis-box" id="ect-banner">
					<!-- <a href="javascript:;" @click="closeAppDown">
			            <i class="iconfont icon-guanbi" style="width: 30rpx;height: 30rpx;"></i>
			        </a> -->
					<view style="padding-top: 34rpx;padding-left: 20rpx;" @click="closeAppDown">
						<image
							src="https://images.eqingqu.com/attachs/photo/202403/20240305_A596460B29B83F980245FE085E084168.png"
							style="width: 40rpx;height: 40rpx;"></image>
					</view>
					<div class="box-flex">
						<image :src="shopConfig.h5_index_pro_image||'https://images.eqingqu.com/attachs/photo/202505/20250509_306AA5BD7E90958E102A5CE61A5352D2.png'"
							style="margin-right:.4rem"></image>
						<view class="ect-header-text">
							<view style="font-size: 24rpx;">
								{{ shopConfig && shopConfig.h5_index_pro_title ? shopConfig.h5_index_pro_title : ''}}
							</view>
							<p style="font-size: 20rpx;">
								{{ shopConfig && shopConfig.h5_index_pro_small_title ? shopConfig.h5_index_pro_small_title : ''}}
							</p>
						</view>
					</div>
					<a class="btn-submit1" @click="openApp">{{$t('lang.download_now')}}</a>
				</div>
			</div>
			<!-- #endif -->
			<view class="search" :class="{'position-fixed':scrollFixed}"  :style="{'background-color':'#F9F9F9',opacity: navOpacity == 1 ?0.9 :1, }">
				<!-- #ifdef APP-PLUS -->
				<!-- 这里是状态栏 -->
				<view class="status_bar" style="height: 40px;"></view>
				<!-- <view class="logo_wrap">
					<view style="padding-left: 15%;width:50%;text-align: center;"
						:class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
					<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
					<view style="width:50%;text-align: center;padding-right: 15%;"
						:class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view>
				</view> -->
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<!-- 这里是状态栏 -->
				<view v-if="localShow" style="height: 100rpx;"></view>
				<view class="status_bar"></view>
				<!-- <view class="logo_wrap">
					<view style="padding-left: 15%;width:50%;text-align: center;"
						:class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
					<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
					<view style="width:50%;text-align: center;padding-right: 15%;"
						:class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view>
				</view> -->
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- <view style="display: flex;flex-direction: row;align-items: center;width: 70%;margin-left: 15%;"
					:style="{ height: gaodu + 'px' }">
					<view style="padding-left: 5%;width:50%;text-align: center;"
						:class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">货源</view>
					<view style="width: 2rpx;height: 28rpx;background-color: #828282;"></view>
					<view style="width:50%;text-align: center;padding-right: 15%;"
						:class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">工厂</view>
				</view> -->
				<!-- #endif -->
				<view class="input_main " >
					<view class="input_view">
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifdef H5 -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 44rpx;height: 44rpx;">
							</image>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 44rpx;height: 44rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_9028623ECE1EDAA78E8FFE7BA3FDB47B.png"
								style="width: 36rpx;height: 36rpx;" @click="scanClick">
							</image>
							<!-- #endif -->
							<view class="placeholder_text" style="color: #999;" @click="searchFocus">{{currentWord}}
							</view>
							<!-- <view class="placeholder_text" style="color: #999;" type="text" :placeholder="placeholder"
								confirm-type="search" @input="KeyInput" @confirm="confirm" v-model="currentWord"
								@focus="handleFocus" @blur="handleBlur" /> -->
						</view>
						<view style="align-items: center;display: flex;flex-direction: row;">
							<!-- #ifdef H5 -->
							<image src="/pagesC/static/camera@2x.png" style="width: 44rpx;height: 40rpx;">
							</image>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<image src="/pagesC/static/camera@2x.png" style="width: 44rpx;height: 40rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<image src="/pagesC/static/camera@2x.png" style="width: 36rpx;height: 36rpx;" @click="chooseImage">
							</image>
							<!-- #endif -->
							<!-- <view
								style="background-color: #aaaaaa;height: 30rpx;width: 2rpx;margin-left: 20rpx;margin-top: 4rpx;">
							</view> -->
							<view class="placeholder_texts" @click="searchFocus">
								<text>搜索</text>
							</view>
						</view>
					</view>
				</view>
				<view class="search_all_categories" :style="{'background-color': '#ffffff',opacity: navOpacity == 1 ?0.9 :1,}">
					<view class="scroll-view" style="width: 97%;">
						<view class="tab-bar1">
							<view v-for="(tab,index) in search_keywords_five" :key="index"
								:class="['tab-item',tabIndex==index ? 'active' : '']" @click="searchTag(tab,index)">
								<text>{{ tab }}</text>
							</view>
							<view class="all-text">
								<text @click="tapAllCategories()">全部分类</text>
								<text class="iconfont icon-more size_24"></text>
							</view>

						</view>
					</view>

				</view>
				<!-- 全部分类弹框 start -->
				<view class="all_categories_popops" v-show="allCategoriesType">
					<!-- :class="['all_categories_label', localshow ? '' : 'local_show_false']"   -->
					<view class="all_categories_label">
						<view class="all_categories_label_top" @click="tapAllCategories()">
							<text>全部分类</text>
							<text class="iconfont icon-more size_24"></text>
						</view>
						<view class="all_categories_label_list">
							<view class="all_categories_label_tag" v-for="(tab,index) in search_keywords" :key="index">
								<text @click="tapAllCategoriesItem(tab)" class="all_categories_text">{{ tab }}</text>
							</view>
						</view>
					</view>
					<view class="popops_mack" @click="tapAllCategories()"></view>
				</view>
				<!-- 全部分类弹框 end -->
				<!-- <view class="input_main">
					<view class="tab-bar">
						<view v-for="(tab,index) in search_keywords" :key="index"
							:class="['tab-item',status==index ? 'active' : '']" @click="orderStatusHandle(index)">
							<text>{{ tab }}</text>
						</view>
					</view>
				</view> -->
			</view>
			<!-- #ifdef APP-PLUS -->
			<!-- <view style="height: 260upx;"></view> -->
				<view style="height: 240upx;"></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view style="height: 160upx;"></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view style="height: 280upx;"></view>
			<!-- <view style="height: 300upx;"></view> -->
			<!-- #endif -->
		</view>

		<!-- 金刚区 -->
		<view class="nav" v-if="false" :class="aClass">
			<swiper style="height: 200rpx;" :indicator-dots="false" @change="swiperChange">
				<!-- <swiper class="swiper" :indicator-dots="indicatorDots" :style="{height:imgheightsnav}"
				@change="swiperChange"> -->
				<swiper-item v-for="(list,listIndex) in swiperList" :key="listIndex">
					<view class="list" :class="{'list1':indexs == 0}" v-for="(items,indexs) in list" :key="indexs"
						@click="linknav(items)" style="width: 20%;">
						<view class="icon" v-if="items.img">
							<image :src="items.img" mode="widthFix" class="image" style="height: 144rpx;">
							</image>
						</view>
						<view class="icon" v-if="!items.img">
							<image :src="imagePath.defaultImg" mode="widthFix" class="image" style="height: 144rpx;">
							</image>
						</view>
						<view class="con uni-ellipsis" style="margin-top: -12rpx;">
							<block v-if="items.desc">{{ items.desc }}</block>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- <view :class="[isPro==true?'dots-containerz':'dots-containerz_1']">
				<view v-for="(ad, indexs) in swiperList" :key="indexs"
					:class="['dotz', indexs === swiperCurrent ? 'active' : '']"></view>
			</view> -->
		</view>

		<view class="nav king-kong-nav" :class="aClass">
			<view class="nav-label">
				<view class="nav-list" style="height: 200rpx;">
					<view class="list" :class="{'list1':indexs == 0}" v-for="(items,indexs) in mergedData" :key="indexs"
						@click="linknav(items)">
						<view class="icon" v-if="items.img">
							<image :src="items.img" mode="widthFix" class="image" style="height: 144rpx;">
							</image>
						</view>
						<view class="icon" v-if="!items.img">
							<image :src="imagePath.defaultImg" mode="widthFix" class="image" style="height: 144rpx;">
							</image>
						</view>
						<view class="con uni-ellipsis" style="margin-top: -12rpx;">
							<block v-if="items.desc">{{ items.desc }}</block>
						</view>
					</view>
				</view>
			</view>
		</view>





		<!-- 新品 热销 原位置-->

		<view v-if="false" style="margin-top: 20rpx;">
			<!-- <view style="margin-top: -7%;"> -->
			<dsc-count-down v-if="countDown.module == 'count-down' && countDown.isShow" :module="countDown.data"
				:preview="false" :shopId="ru_id"></dsc-count-down>
		</view>


		<!-- 横向滑动商品 -->
		<view v-if="false" class="visual-adv" :class="[referer == 'wxapp' ? 'visual-adv-swiper' : 'visual-adv-lie']">
			<block v-for="(items,indexs) in visualdvAList" :key="indexs">
				<view class="bg-img" @click="linkvisualadv(items.data.allValue)">
					<image :src="items.data.allValue.titleImg" mode="widthFix" class="img"
						v-if="items.data.allValue.titleImg">
					</image>
				</view>
				<view class="adv-goods-list">
					<block v-if="referer == 'wxapp'">
						<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
							<view class="scroll-view-item" v-for="(item,index) in items.previewProlist" :key="index"
								@click="linkHref(item.seckill_id,item.goods_id)">
								<view class="goods-top">
									<image :src="item.goods_thumb" class="img" mode="widthFix"></image>
									<view class="goods-label-suspension"
										v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									</view>
								</view>
								<view class="goods-info">
									<text class="goods-name twolist-hidden" <text
										@longpress="copyTitle(item.title,item.goods_name)">{{item.title || item.goods_name}}</text>
									<view
										style="position: relative;margin-top: 10rpx;margin-left: -12rpx;margin-bottom: -20rpx;">
										<image
											src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973605849.png"
											mode="widthFix" style="width: 206rpx;height: 50rpx;"></image>
										<view
											style="position: absolute;left: 46%;top: -2rpx;color: #ffffff;font-size: 26rpx;">
											￥{{item.shop_price}}</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</block>
					<block v-else>
						<view class="scroll-view">
							<view class="scroll-view-item" v-for="(item,index) in items.previewProlist" :key="index"
								@click="linkHref(item.seckill_id,item.goods_id)">
								<view class="goods-top">
									<image :src="item.goods_thumb" class="img" mode="widthFix"></image>
									<view class="goods-label-suspension"
										v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									</view>
								</view>
								<view class="goods-info">
									<text class="goods-name twolist-hidden"
										@longpress="copyTitle(item.title,item.goods_name)">{{item.title || item.goods_name}}</text>
									<view
										style="position: relative;margin-top: 0rpx;margin-left: -12rpx;margin-bottom: -20rpx;">
										<image
											src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973605849.png"
											mode="widthFix" style="width: 210rpx;height: 50rpx;"></image>
										<view style="position: absolute;left: 46%;top: -2rpx;color: #ffffff;">
											￥{{item.shop_price}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
		</view>

		<!-- 轮播图 -->
		<view v-if="false" class="page-section" :class="{'slide-new':2 == 2}" style="margin: -20rpx 0 30rpx 0 ;">
			<view class="page-section-spacing">
				<swiper class="swiper" style="height: 180rpx;" :indicator-dots="false" :autoplay="autoplay"
					:interval="interval" :duration="duration" @change="slideChange">
					<swiper-item v-for="(items,indexs) in slideList" :key="indexs">
						<view class="swiper-item" @click="linkslide(items)">
							<view class="desc" v-if="items.desc != ''">{{ items.desc }}</view>
							<image :src="items.img" class="image" style="width: 100%;height: 100%;border-radius: 20rpx;"
								mode="widthFix">
							</image>
						</view>
					</swiper-item>
				</swiper>
				<view style="position: absolute;right: 3%;bottom: 15%;" class="dots-container pagination-center">
					<view v-for="(ad, indexs) in slideList" :key="indexs"
						:class="['dot', indexs === activeIndex ? 'active' : '']"></view>
				</view>
			</view>
		</view>


		<view class="waterFall">
			<!-- 新品 热销 -->
			<view style=" display: flex;justify-content: space-between;margin:16rpx 16rpx 16rpx 16rpx;margin-right: 16px;">
				<view class="shipin_1" :style="{
    backgroundImage: shipinswiperCurrent === 0 
      ? 'url(https://images.eqingqu.com/attachs/photo/202503/20250331_C1DECA47A0B6E454FD79CA6F7D284A51.png)' 
      : 'url(https://images.eqingqu.com/attachs/photo/202504/20250403_5C0753A53388BF31560A7396FFFFD13F.png)'
  }">
					<view @click="toSearch('新品')">
						<!-- 	<view class="shititle">新品</view>
						<view class="shipin_3">
							潮流上新</view> -->
						<!-- <swiper class="swiper" :indicator-dots="indicatorDots" :style="{height:imgheightsnav}"
							@change="swiperChange"> -->
					</view>
					<swiper style="height: 100%;" :indicator-dots="shipinindicatorDots" @change="shipimswiperChange"
						:circular="true">
						<swiper-item v-for="(items,indexs) in newArray" :key="indexs">
							<view class="new_goods">
								<view class="new_goods_item" v-for="(goodsItem,goodsidx) in items" :key="goodsidx"
									@click="toSearch(shipinswiperCurrent == 0? '新品':'热销')">
									<view>
										<image :src="goodsItem.goods_thumb"
											style="width: 146rpx;height: 146rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
											v-if="goodsItem.goods_thumb"></image>
										<!-- <image style="width: 146rpx;height: 146rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;" src="https://www.ok9288.com/img/user_default.png"></image> -->
									</view>
									<view class="newPrice">
										￥
										<span v-if="goodsItem.shop_price">{{goodsItem.shop_price}} </span>
										<!-- {{newListOne.shop_price}} -->
									</view>
								</view>
							</view>
						</swiper-item>

					</swiper>
					<view class="dots-containerz_1">
						<view v-for="(ad, indexs) in newArray" :key="indexs"
							:class="['dotz', indexs === shipinswiperCurrent ? 'active' : '']"></view>
					</view>
					<!-- 之前的结构 -->
					<!-- <view style="text-align: center;margin-left: 20rpx;"
							@click="linkHref(newListTwo.seckill_id,newListTwo.goods_id)">
							<view>
								<image :src="newListTwo.goods_thumb"
									style="width: 146rpx;height: 146rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
									v-if="newListTwo.goods_thumb"></image>
								<image
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
									class="image" v-else style="max-width: 146rpx;max-height: 146rpx;"></image>
							</view>
							<view class="newPrices">
								￥
								<span v-if="newListTwo.shop_price">{{newListTwo.shop_price}} </span>
						
							</view>
						</view> -->




				</view>
				<view class="shipin_2" style="">
					<view style="display: flex;flex-direction: row;align-items: center;" @click="toSearch('热销')">
						<!-- <view class="shititle">热销</view>
						<view class="shipin_4">
							全国包邮</view> -->

					</view>
					<view style="display: flex;flex-direction: row;" class="shipin_2-label">
						<view class="shipin_2-left" style="text-align: center;width: 50%;"
							@click="linkHrefSearch(3)">
							<view>
								<view class="shititle1">一件代发</view>
								<image :src="hotListOne.goods_thumb"
									style="width: 128rpx;height: 128rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
									v-if="hotListOne.goods_thumb"></image>
								<image
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
									class="image" v-else style="max-width: 146rpx;max-height: 146rpx;"></image>
							</view>
							<view>
								<!-- ￥
								<span v-if="hotListOne.shop_price">{{hotListOne.shop_price}} </span> -->
								<!-- {{hotListOne.shop_price}} -->
								<text>全国包邮</text>
							</view>
						</view>
						<view class="shipin_2-right" style="text-align: left;width: 50%;"
							@click="linkHrefSearch(4)">
							<view>
								<view class="shititle1">严选</view>
								<image :src="hotListTwo.goods_thumb"
									style="width: 128rpx;height: 128rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
									v-if="hotListTwo.goods_thumb"></image>
								<image
									src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
									class="image" v-else style="max-width: 146rpx;max-height: 146rpx;"></image>
							</view>
							<view class="newPrices">
								￥
								<span v-if="hotListTwo.shop_price">{{hotListTwo.shop_price}} </span>
								<!-- {{hotListTwo.shop_price}} -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 1 -->
			<view class="container product-new">
				<!-- 固定占位区域 -->
				<!-- <view style="width: 50%;border-radius: 20rpx;">
										   	<view v-if="home_list_one.length > 0">
										   		<view class="img-box" @click="toshoplist">
										   			<image style="border-radius: 20rpx;" class="img" :src="home_list_one[0].ad_code"
										   				mode="widthFix">
										   			</image>
										   		</view>
										   	</view>
										   	<view v-else-if="home_list_one.length == 0">
										   		<view class="img-box" @click="toMerchants">
										   			<image style="border-radius: 20rpx;height: 640rpx;width:100%" class=""
										   				src="https://images.eqingqu.com/attachs/photo/202402/20240226_3E7FE9204B7762120F8A37043EF69853.png"
										   				mode=""></image>
										   		</view>
										   	</view>
										   </view> -->


				<!-- 瀑布流容器 -->
				<view class="waterfall-wrapper">
					<!-- 左列（包含占位） -->
					<view class="column left-col">

						<view v-for="(item, index) in leftList" :key="'left'+index" class="waterfall-item"
							:style="{height: item.height + 'px'}">

							<view style="position: relative;">
								<view>
									<view class="img-box" style="height: min-height: 360rpx;"
										@click="linkHref(item.seckill_id,item.goods_id)">
										<image class="img" :src="item.goods_thumb" mode="widthFix"></image>
										<view class="goods-label-suspension"
											v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
											<image :src="item.goods_label_suspension.formated_label_image" class="img">
											</image>
										</view>
									</view>
									<view class="info-box">
										<view class="goods-name twolist-hidden  title-font" style="font-size:14px;"
											@longpress="copyTitle(item.title,item.goods_name)"
											@click="linkHref(item.seckill_id,item.goods_id)">
											<!-- 	<image class="country_icon" :src="item.country_icon"
												v-if="item.country_icon">
											</image>
									
											<view class="title-style"></view> -->

											<text class="easy_choose"
												v-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											<text class="is-new-goods"
												v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
											{{item.title || item.goods_name}}
										</view>
										<!-- 标签 -->
										<goods-service-label 
										  :tags="item.goods_services_label_new" 
										  :max-display="3"
										    v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0"
										/>
										<view class="num-line">
											<currency-price class="left-num" :price="item.shop_price"
												:size="20"></currency-price>
											<!-- <view class="mid-num" style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;" v-if="item.is_free == 0 && item.new_member_price != 1">运费{{item.start_shipping_fee}}元</view> -->
											<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
												v-if=" item.new_member_price == 1">
												新人价
											</view>
											<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
												v-else-if="item.is_free == 0 ">
												运费{{item.start_shipping_fee}}元
											</view>

										</view>
										<text
											class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										<!-- 	<view
											style="margin-top: -8rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 8rpx;">
										
											<text
												class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										</view> -->

										<!-- <view
											style="display: flex;flex-direction: row;align-items: center;line-height: 40rpx;margin-top: -10rpx;margin-bottom: 0rpx;width: 100%;">
											<view
												style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;">
												<image :src="item.shop_avatar"
													style="height: 40rpx;width: 40rpx;border-radius: 10rpx;"
													mode="widthFix">
												</image>
											</view>
											<text v-if="item.add_year" style="color: #A2A2A2;">{{item.add_year}}</text>
											<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
											<text v-if="item.add_year"
												style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text>
											<view
												style="display: flex;flex-direction: row;align-items: center;width: 80%;"
												@click="toShopHome(item)">
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<view
												style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
												@click="onSku(item)" v-if="item.seckill_id==0">
												<image
													src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1691018929484.png"
													style="height: 50rpx;width: 50rpx;"></image>
											</view>
										</view> -->
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

					</view>

					<!-- 右列（包含占位） -->
					<!-- <view class="column right-col" :style="shipinStyle" > -->
					<view class="column right-col"  :style="{'margin-top': heightDifference + 'px'}">
						<view class="right-placeholder right"></view>
						<view v-for="(item, index) in rightList" :key="'right'+index" class="waterfall-item"
							:style="{height: item.height + 'px'}">
							<view style="position: relative;">
								<view>
									<view class="img-box" style="height: min-height: 360rpx;"
										@click="linkHref(item.seckill_id,item.goods_id)">
										<image class="img" :src="item.goods_thumb" mode="widthFix"></image>
										<view class="goods-label-suspension"
											v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
											<image :src="item.goods_label_suspension.formated_label_image" class="img">
											</image>
										</view>
									</view>
									<view class="info-box">
										<view class="goods-name twolist-hidden  title-font" style="font-size:14px;"
											@longpress="copyTitle(item.title,item.goods_name)"
											@click="linkHref(item.seckill_id,item.goods_id)">
											<!-- 	<image class="country_icon" :src="item.country_icon"
												v-if="item.country_icon">
											</image>
									
											<view class="title-style"></view> -->
											<text class="easy_choose"
												v-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											<text class="is-new-goods"
												v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>
											{{item.title || item.goods_name}}
										</view>
										<goods-service-label
										  :tags="item.goods_services_label_new" 
										  :max-display="3"
										  v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0"
										/>
										
								

										<view class="num-line">
											<currency-price class="left-num" :price="item.shop_price"
												:size="20"></currency-price>
											<!-- <view class="mid-num" style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;" v-if="item.is_free == 0 && item.new_member_price != 1">运费{{item.start_shipping_fee}}元</view> -->
											<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
												v-if=" item.new_member_price == 1">
												新人价
											</view>
											<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
												v-else-if="item.is_free == 0 ">
												运费{{item.start_shipping_fee}}元
											</view>
										</view>
										<view>
											<text
												class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										</view>

										<!-- 	<view
											style="margin-top: -8rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 8rpx;">
										
											<text
												class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										</view> -->

										<!-- <view
											style="display: flex;flex-direction: row;align-items: center;line-height: 40rpx;margin-top: -10rpx;margin-bottom: 0rpx;width: 100%;">
											<view
												style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;">
												<image :src="item.shop_avatar"
													style="height: 40rpx;width: 40rpx;border-radius: 10rpx;"
													mode="widthFix">
												</image>
											</view>
											<text v-if="item.add_year" style="color: #A2A2A2;">{{item.add_year}}</text>
											<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
											<text v-if="item.add_year"
												style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text>
											<view
												style="display: flex;flex-direction: row;align-items: center;width: 80%;"
												@click="toShopHome(item)">
												<view class="shop_name_class">{{item.shop_name}}</view>
											</view>
											<view
												style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
												@click="onSku(item)" v-if="item.seckill_id==0">
												<image
													src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1691018929484.png"
													style="height: 50rpx;width: 50rpx;"></image>
											</view>
										</view> -->
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
					</view>
				</view>
			</view>
			<!-- 2 -->

			<!-- 视频模块 -->
			<!-- <view> -->
			<!-- <view style="margin: 20rpx;">
					<view style="display: flex;flex-direction: row;width: 100%;">
						<view style="width: 50%;border-radius: 20rpx;">
							<view v-if="home_list_one.length > 0">
								<view class="img-box" @click="toshoplist">
									<image style="border-radius: 20rpx;" class="img" :src="home_list_one[0].ad_code"
										mode="widthFix">
									</image>
								</view>
							</view>
							<view v-else-if="home_list_one.length == 0">
								<view class="img-box" @click="toMerchants">
									<image style="border-radius: 20rpx;" class="img"
										src="https://images.eqingqu.com/attachs/photo/202402/20240226_3E7FE9204B7762120F8A37043EF69853.png"
										mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
				</view> -->

			<view v-if="false" class="product-new" bindscroll="handleScroll">
				<view class="goods-list" v-if="prolist">
					<!-- <view style="width: 50%;border-radius: 20rpx;">
		        <view v-if="home_list_one.length > 0">
		          <view class="img-box" @click="toshoplist">
		            <image style="border-radius: 20rpx;" class="img" :src="home_list_one[0].ad_code"
		                   mode="widthFix">
		            </image>
		          </view>
		        </view>
		        <view v-else-if="home_list_one.length == 0">
		          <view class="img-box" @click="toMerchants">
		            <image style="border-radius: 20rpx;height: 640rpx;width:100%" class=""
		                   src="https://images.eqingqu.com/attachs/photo/202402/20240226_3E7FE9204B7762120F8A37043EF69853.png"
		                   mode=""></image>
		          </view>
		        </view>
		      </view> -->
					<view class="item" v-for="(item, index) in prolist" :key="index">
						<view style="position: relative;">
							<view>
								<view class="img-box" style="height: min-height: 360rpx;"
									@click="linkHref(item.seckill_id,item.goods_id)">
									<image class="img" :src="item.goods_thumb" mode="widthFix"></image>
									<view class="goods-label-suspension"
										v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									</view>
								</view>
								<view class="info-box">
									<view class="goods-name twolist-hidden"
										@longpress="copyTitle(item.title,item.goods_name)"
										@click="linkHref(item.seckill_id,item.goods_id)">
										<image class="country_icon" :src="item.country_icon" v-if="item.country_icon">
										</image>
										
										{{item.title || item.goods_name}}
									</view>
									<view
										style="display: flex;flex-direction: row;align-items: center;margin-top: -26rpx;"
										@click="linkHref(item.seckill_id,item.goods_id)">
										<currency-price :price="item.shop_price" :size="18"
											style="display: block; margin-top: 8px;"></currency-price>
										<view
											style="margin-top: 20rpx;margin-left: 20rpx;font-size: 22rpx;color: #f23030;"
											v-if="item.is_free==0">
											运费{{item.start_shipping_fee}}元起
										</view>
									</view>
									<view
										style="margin-top: -8rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 8rpx;">

										<text
											class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
									</view>
									<view
										style="display: flex;flex-direction: row;align-items: center;font-size: 22rpx;transform:scale(0.8);margin-left: -40rpx;width: 120%;margin-top: -10rpx;">

										<view v-for="(items,index) in item.goods_services_label_new" :key="index">
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='黑卡'">
												{{items}}
											</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='7无理由'">
												{{items}}
											</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='滞销换'">
												{{items}}
											</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='保价'">
												{{items}}
											</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='优选'">
												{{items}}
											</view>
											<view
												style="color: #FE0302;border-radius: 10rpx;border: 2rpx solid #FE0302;transform:scale(0.9);padding: 0rpx 10rpx;margin-right: 4rpx;"
												v-if="items =='新品'">
												{{items}}
											</view>
										</view>
									</view>

									<view
										style="display: flex;flex-direction: row;align-items: center;line-height: 40rpx;margin-top: -10rpx;margin-bottom: 0rpx;width: 100%;">
										<view
											style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;">
											<image :src="item.shop_avatar"
												style="height: 40rpx;width: 40rpx;border-radius: 10rpx;"
												mode="widthFix">
											</image>
										</view>
										<text v-if="item.add_year" style="color: #A2A2A2;">{{item.add_year}}</text>
										<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
										<text v-if="item.add_year"
											style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text>
										<view style="display: flex;flex-direction: row;align-items: center;width: 80%;"
											@click="toShopHome(item)">
											<view class="shop_name_class">{{item.shop_name}}</view>
										</view>
										<!-- <view
											style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
											@click="onSku(item)" v-if="item.seckill_id==0">
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
				</view>
			</view>
		</view>


		<!-- </view> -->



		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 1 && showLoadMore" />
		<dsc-region :display="regionShow" :isLevel="4" :regionOptionData="regionData" @updateDisplay="getRegionShow"
			@updateRegionDate="getRegionOptionDate"></dsc-region>
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

		<uni-popup :show="bonusShow" v-on:hidePopup="handelClose('bonus')">
			<view class="close" @click="handelClose('bonus')">
				<image
					src="https://images.eqingqu.com/attachs/photo/202404/20240416_53EB47F93542B07A5D951F4C4E187EA1.png"
					mode="widthFix" class="img"></image>
			</view>
			<image :src="bonusData.popup_ads" class="img" mode="widthFix" v-if="bonusData && bonusData.popup_ads">
			</image>
		</uni-popup>

		<uni-popup :show="versionShow" v-if="versionShow">
			<view class="version-popup">
				<view class="version-text">
					<view class="tit">{{$t('lang.new_version_found')}}</view>
					<view class="code">{{ versionData.content.version_id }}</view>
				</view>
				<view class="version-notic">{{$t('lang.new_version_found_tips')}}</view>
				<view class="version-btn">
					<view class="btn" @click="updateAppStore">{{$t('lang.upgrade_now')}}</view>
				</view>
				<view class="close" v-if="versionData.content.is_force_update==0" @click="handelClose('version')">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_53EB47F93542B07A5D951F4C4E187EA1.png"
						mode="widthFix" class="img"></image>
				</view>
				<image :src="imagePath.upgrade" class="upgrade" mode="widthFix"></image>
			</view>
		</uni-popup>

		<uni-popup :show="customerShow" v-on:hidePopup="handelClose('customer')" v-if="customerShow">
			<view class="version-popup">
				<view class="close-on" @click="handelClose('customer')">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_53EB47F93542B07A5D951F4C4E187EA1.png"
						mode="widthFix" class="img"></image>
				</view>
				<image :src="imgShare" class="upgrade" mode="widthFix"></image>
				<view class="save-picture" @click="operator">{{$t('lang.save_picture')}}</view>
			</view>
		</uni-popup>

		<uni-popup :show="mpShareShow" type="bottom" v-on:hidePopup="handelClose('mpshare')">
			<view class="mp-share-warp">
				<view class="lists">
					<view class="list" @click="onGoodsShare">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_A4D37C1C7021179CF56E406972AFA295.png"
							mode="widthFix"></image>
						<text>{{$t('lang.generate_sharing_poster')}}</text>
					</view>
					<button class="list" open-type="share">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240416_DBA51C84B7EA458832C2966ADC6A714F.png"
							mode="widthFix"></image>
						<text>{{$t('lang.share_with_friends')}}</text>
					</button>
				</view>
				<view class="title_on" @click="handelClose('mpshare')">{{$t('lang.cancel')}}</view>
			</view>
		</uni-popup>

		<block v-if="controlVersion">
			<service @flaghanlde="prentflaghanlde" v-if="shopConfig && shopConfig.consult.consult_set_state==1"
				:shopConfig="shopConfig.consult"></service>
		</block>

		<block v-if="click_add">
			<view class="add_new" :style="{'top':CustomBar + 10 +'px'}">
				<view class="add_on">{{$t('lang.remind')}}<text @click="clickon">{{$t('lang.remind1')}}</text></view>
			</view>
		</block>
	
		<!-- 商品属性弹框 start -->
		<uni-popups ref="goodsattr" type="bottom">
			<view class="pop_content">
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
				</view>
				<!-- #ifdef H5 -->
				<view style="height: 100rpx;"></view>
				<!-- #endif -->
			</view>
		</uni-popups>
		<!-- 商品属性弹框 end -->

		<!-- 遮罩层 -->
		<!-- <view v-if="isshowregionsplic">
			<view class="cover" @click="isshowregionsplicNo" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1">温馨提示</view>
				<view class="wxshare_3_1" style="font-size: 28rpx;text-align: center;">
					<text style="text-align: center;">为了您的购物体验，请先选择地区</text>
				</view>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view class="add_box3_1_a" @click="isshowregionsplicNo">取消</view>
					<view class="add_box3_a" @click="isshowregionsplicYes">确认</view>
				</view>
			</view>
		</view> -->
		<!-- 遮罩层 -->
		<view v-if="ispush">
			<view class="cover" @click="ispushNo" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1">温馨提示</view>
				<view class="wxshare_3_1"
					style="font-size: 32rpx;text-align: left;margin-left: 40rpx;margin-right: 30rpx;">
					强烈建议开启消息通知，随时掌握订单消息。</view>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view class="add_box3_1_a" @click="ispushNo">再想想</view>
					<view class="add_box3_a" @click="ispushYes">去开启</view>
				</view>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view v-if="photo_show">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare_y" style="background-color: #ffffff;">
				<view style="font-size: 38rpx;margin: 50rpx 50rpx 0rpx 50rpx;text-align: center;">温馨提示</view>
				<view style="font-size: 28rpx;margin: 50rpx;text-align: center;">是否打开拍照/相册服务功能</view>
				<view style="display: flex;flex-direction: row;margin-bottom: -20rpx;">
					<view class="add_box3_buy_1_s" @click="photo_showNo">取消</view>
					<view class="add_box3_buy_1_y" @click="photo_showYes">确定</view>
				</view>
			</view>
		</view>
		<sys-coupon :type="1"></sys-coupon>
		<!-- <image-cropper ref="imagecropper" v-if="showOne" :src="imageSrc" :guessList='guessList' :sortImage='sortImage'></image-cropper> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import permision from "@/common/permission.js"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup.vue'
	import service from "@/components/customer-service/customer-service.vue";
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import dscCountDown from '@/pagesD/components/visualization/count-down/Frontend.vue'
	import goodsServiceLabel from '@/components/goods-service-label/goods-service-label.vue'
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import sysCoupon from '@/components/sys-coupon.vue'
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	import {
		compressImage
	} from '@/common/compressImage.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import universal from '@/common/mixins/universal.js';
	import dscRegion from '@/components/dsc-region.vue';
	// #ifdef H5
	// import AppDown from '@/components/AppDown.vue'
	import isApp from '@/config/is-app.js'
	// #endif
	import ImageCropper from '@/pagesD/components/invinbg-image-cropper/invinbg-image-cropper.vue'

	import waterfall from '@/pagesD/components/waterfall.vue'
	const CONTENT_CONFIG = {
		TITLE_LINE_HEIGHT: 32, // 标题行高(rpx)
		PRICE_HEIGHT: 15, // 价格区域高度
		TAG_ROW_HEIGHT: 12, // 每行标签高度
		META_ROW_HEIGHT: 12, // 元信息行高
		ROW_GAP: 4 // 行间距
	}
	export default {
		mixins: [universal],
		components: {
			uniIcons,
			uniPopup,
			service,
			dscFilterTop,
			waterfall,
			dscRegion,
			uniLoadMore,
			dscCountDown,
			uniPopups,
			sysCoupon,
			goodsServiceLabel,
			// #ifdef H5
			// AppDown,
			// #endif
			ImageCropper
		},
		data() {
			return {
				// 1
				leftList: [], // 左列数据
				rightList: [], // 右列数据
				leftHeight: 0, // 左列当前高度
				rightHeight: 0, // 右列当前高度
				placeholderHeight: 0, // 占位高度
				heightDifference:0,
				// 2
				allCategoriesType: false, //全部分类弹出框状态
				bonusShow: false,
				dscLoading: true,
				curpage: '',
				ru_id: 0,
				shopId: 0,
				versionShow: false,
				mpShareShow: false,
				customerShow: false,
				shopConfig: '',
				imgShare: '',
				versionData: '',
				jumpHeight: 0,
				scrollPickOpen: false,
				scrollFixed: true,
				scrollState: false,
				click_add: false,
				liststatus: [],
				CustomBar: 0,
				HeaderBar: 0,
				userId: 0,

				navTranslateX: 0,
				paly: false,

				// 搜索
				nFontColor: '#FFFFFF',
				tFontColor: '#999',
				fixed: true,
				height: 0,
				menuButtonInfo: {},
				imageSrc: '',

				isDefine: 1,
				list: [],
				navIndex: 0,
				gundong: true,
				gaodu: '',

				disabled: false,
				shopScore: false,
				size: 10,
				page: 1,
				cat_id: 0,
				sort: 'sort_order',
				order: 'ASC',
				city_id: '',
				lat: '',
				lng: '',
				vh: 0,
				keyword: '',
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				isWeixin: uni.getStorageSync('platform') == 'MP-WEIXIN' ? true : false,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},

				showLoadMore: true,

				tabBars: ['货源', '工厂'],
				status: 0,

				autoplay: true,
				interval: 5000,
				duration: 500,
				imgheights: 120,
				activeIndex: 0,
				marginWidth: 0,
				modulelist: {
					list: [{
							img: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
						},
						{
							img: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
						},
						{
							img: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
						}
					],
				},

				indicatorDots: false,
				shipinindicatorDots: false,
				imgheightsnav: 0,
				listHeight: 0,
				swiperCurrent: 0,
				shipinswiperCurrent: 0,
				prolist: [],
				previewProlist: [],

				swiperList: [],

				home_list_one: [],
				hotListOne: {},
				hotListTwo: {},
				newListOne: {},
				newListTwo: {},
				// videoList: [{
				// 	goods_thumb: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
				// }],
				videoListOne: {
					goods_thumb: 'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230405_Lfu5kWvaxhNRPjh0eQqLmLe3Kv2Ii9.png'
				},

				// isshowregionsplic: false,

				seleceGoodsAtrrArray: [],
				goodsNum: 1,
				minNum: 1,
				xiangouNum: 1,
				addType: '',
				goodsDetail: {},
				goodsAttr: [],
				slideList: [],
				sellGoods: [],
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
				bonusData: uni.getStorageSync('configData').bonus_ad,
				aClass: '',
				scrollTop: 0,
				referer: '',
				ispush: false,

				visualdvAList: [],
				countDown: {},
				isPro: false,
				localShow: true,

				photo_show: false,

				tempFilePath: '',

				sortImage: [],

				imgElements: [],
				guessList: [1, 2, 3, 4, 5, 6, 7, 8, 9],

				showOne: false,
				onelist: [],
				twolist: [],
				search_keywords: [],
				search_keywords_five: [],
				tabIndex: 0,
				// #ifdef MP-WEIXIN
				searchtip: '输入货源关键字',
				// #endif
				// #ifndef MP-WEIXIN
				searchtip: '输入货源关键字',
				// #endif
				hint_keywords: '',
				currentIndex: 0,
				intervalId: null,
				isFocused: false,
				words: [],
				newArray: [], //新品轮播数组
				placeholder: '',
				mergedData: [], // 金刚区合并的数据
				navOpacity:0 
			}
		},
		created() {
			var that = this
			// that.getHotGoodsList(1);
			// that.getNewGoodsList(1);
			// #ifdef MP-WEIXIN
			that.menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif

			that.vh = uni.getSystemInfoSync().windowHeight / 2;
			if (!that.controlVersion) {
				uni.setNavigationBarTitle({
					title: that.$t('lang.list')
				});
			}
			// #ifdef H5
			that.getIsShow()
			// #endif

		},
		mounted() {
			document.addEventListener('scroll', this.handleScroll, {
				passive: true
			});
			let _this = this;
			_this.$nextTick(() => {
				let info1 = uni.createSelectorQuery().in(this).select(".search");
				setTimeout(() => {
					info1.boundingClientRect(function(data) {
						if (data) {
							_this.height = data.height
							getApp().globalData.navigationBarHeight = data.height
						}
					}).exec();
				}, 500)
			})
			this.startRotation();
		},
		computed: {
			selectAttr: {
				get() {
					return this.goodsAttr.length > 0 ? this.goodsDetail.attr_name + ' ' + this.goodsNum + this
						.goodsDetail.goods_unit : this.goodsNum + this.goodsDetail.goods_unit;
				},
				set(val) {
					this.goodsDetail.attr_name = val;
				}
			},
			// shipinStyle() {
			// 	// 计算margin-top
			// 	const marginTop = this.rightHeight - this.leftHeight;
			// 	return {
			// 		marginTop: `${marginTop}px` // 将数字转换为字符串并添加'px'单位
			// 	};
			// },
			currentWord() {
				return this.words[this.currentIndex] ? this.words[this.currentIndex] : '输入货源关键字';
			},
			localshowType() {
				return this.localshow
			}
		},
		beforeDestroy() {
			this.stopRotation();
		},
		onShareAppMessage(res) {
			let user_id = uni.getStorageSync('user_id');
			let url = '/pages/middles/middles';
			if (user_id) {
				url = '/pages/middles/middles?parent_id=' + user_id
			}

			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pages/middles/middles'
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				query: {
					key: ""
				},
			}
		},

		onLoad(e) {
			var that = this
			let parent_id = e.parent_id;
			let user_id = uni.getStorageSync('user_id');
			
			if (parent_id) {
				if (parent_id != user_id) {
					uni.setStorageSync('parent_id', parent_id)
				}
			}
			uni.getSystemInfo({
				success: function(res) {
					let modelmes = res.model;
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini',
						'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					let iphoneArr_1 = ['iPhone XS Max', 'iPhone 11 Pro Max', 'iPhone 12 Pro Max',
						'iPhone 13 Pro Max',
						'iPhone 14 Pro Max', 'iPhone 15 Pro Max', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					})
					iphoneArr_1.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isPro = true
						}
					})
				}
			})
			// 高度
			that.imgheightsnav = uni.getSystemInfoSync().windowHeight * 0.01
			// #ifdef APP-PLUS
			that.getQuanxian()
			that.appUpdate()

			//读取本地缓存
			if (!uni.getStorageSync('userRegion') && e.page && e.page == 'launch') {
				that.$store.dispatch('getLocation')
			}
			// #endif

			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})

			if (that.bonusData && that.bonusData.open == 1) {
				that.bonusShow = uni.getStorageSync('bonusShow') !== '' ? uni.getStorageSync('bonusShow') : true;
			}

			if (uni.getStorageSync('program')) {
				that.click_add = false
			} else {
				that.click_add = true
				uni.setStorageSync('program', 1)
			}

			//小程序扫码
			if (e.scene) {
				let scene = decodeURIComponent(e.scene);
				let parent_id = scene.split('.')[0];
				uni.setStorageSync('parent_id', parent_id);
			}

			/* 获取小程序状态栏高度 */
			uni.getSystemInfo({
				success: e => {
					let StatusBar = e.statusBarHeight;
					let rect = wx.getMenuButtonBoundingClientRect();

					if (e.system.toLowerCase().indexOf('ios') > -1) {
						//IOS
						that.CustomBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;
						that.HeaderBar = that.CustomBar - e.statusBarHeight;
					} else {
						//安卓
						that.HeaderBar = rect.height + (rect.top - e.statusBarHeight) * 2;
						that.CustomBar = that.HeaderBar + e.statusBarHeight;
					}
				}
			});
			// #endif
			that.referer = uni.getStorageSync('platform').toLowerCase()
			
			console.log("当前系统", that.referer)
			uni.request({
				url: this.websiteUrl + '/api/app/home',
				method: 'GET',
				data: {
					type: 'home',
					device: 'app'
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					// that.dscLoading = false
					that.modules = res.data.data
					// console.log('modules', that.modules)
					var list
					var chunk
					var module3
					for (var i = 0; i < that.modules.length; i++) {
						if (that.modules[i].module == 'visual-adv') {
							that.visualdvAList.push(that.modules[i])
						}
						if (that.modules[i].module == 'count-down') {
							that.countDown = that.modules[i]
							// console.log(that.countDown)
						}
						if (that.modules[i].module == 'slide') {
							that.slideList = that.modules[i].data.list
							// console.log(999, that.slideList);
						}
						if (that.modules[i].module == 'nav') {
							list = that.modules[i].data.list;
							chunk = that.modules[i].data.isNumberSel * 1;
							module3 = that.modules[i]
						}
					}
				

					var len = list.length;
					var result = [];
					var v = len / chunk;

					if (module3.data.isStyleSel == 2 && module3.data.isNumberSel) {
						for (var i = 0; i < len; i += chunk) {
							result.push(list.slice(i, i + chunk));
						}
					}
					console.log('swiperList', result)
					this.mergedData = [...result[0], ...result[1]];
					that.swiperList = result
					var listStyless = 'list-style2 list-style3'
					let arr = []
					arr.push(listStyless)
					if (listStyless == "list-style2") {
						module3.data.styleSelList.map((v, i) => {
							switch (v) {
								case "0":
									arr.push("whole-margin")
									break;
								case "1":
									arr.push("all-padding")
									break;
								case "2":
									arr.push("all-border")
									break;
								default:
									break;
							}
						})
					}
					that.aClass = arr
				
				},
				fail: (err) => {
					console.error(err)
				}
			})
			//首页数据

			setTimeout(() => {
				this.getoneList(1)
				this.gettwoList(2)
				// }, 10)
				// setTimeout(() => {
				that.getGoodsList(1);
				that.getHotGoodsList(1);
				that.getNewGoodsList(1);
				that.getVideoList(1);
				that.getHome_list();
				that.shopConfigHot();

			}, 100)

			// #ifdef H5
			/*
				true：微信浏览器
				false：其他浏览器
			* */
			let target = navigator.userAgent.toLowerCase();
			let isWeixin = /micromessenger/.test(target);
			console.log(isWeixin);
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
				if (isWeixin == true) {
					var code = that.GetQueryString('code');
					console.log('code=' + code)
					// // 判断是否存在code
					if (code == null || code == '') {
						// 重新获取code
						const base_url = encodeURIComponent('https://www.ok9288.com/mobile/pages/middles/middles');
						const wx_url =
							// 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7daf1d30f51f1fe&redirect_uri=' + base_url + '&response_type=code&scope=snsapi_userinfo&state=123'+'&shopId=' + that.shopId + '#wechat_redirect'
							'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0b4564de207d9a5f&redirect_uri=' +
							base_url + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
						window.location.href = wx_url;
						return
					} else {
						// 发送code
						that.handleToLogin(code);
					}
				}
			}
			// #endif

		
		},
		onShow() {
			// 获取shopConfig\
			this.$store.dispatch('setShopConfig');
			this.shopConfig = uni.getStorageSync('configData')
			console.log(this.shopConfig)
			// #ifdef H5
			/*
				true：微信浏览器
				false：其他浏览器
			* */
			let target = navigator.userAgent.toLowerCase();
			let isWeixin = /micromessenger/.test(target);
			console.log(isWeixin);
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
				if (isWeixin == true) {
					var code = that.GetQueryString('code');
					console.log('code=' + code)
					// // 判断是否存在code
					if (code == null || code == '') {
						// 重新获取code
						const base_url = encodeURIComponent('https://www.ok9288.com/mobile/pages/middles/middles');
						const wx_url =
							// 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7daf1d30f51f1fe&redirect_uri=' + base_url + '&response_type=code&scope=snsapi_userinfo&state=123'+'&shopId=' + that.shopId + '#wechat_redirect'
							'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0b4564de207d9a5f&redirect_uri=' +
							base_url + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
						window.location.href = wx_url;
						return
					} else {
						// 发送code
						that.handleToLogin(code);
					}
				}
			}
			// #endif

		},

		onPageScroll(e) {
			// 
			const ratio = (e.scrollTop / uni.upx2px(375)).toFixed(1);
			if (ratio >= 1) {
				this.navOpacity = 1;
			} else if (ratio > 0) {
				this.navOpacity = ratio;
			} else {
				this.navOpacity = 0;
			}
			
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false
			let to_scroll_top = e.scrollTop + 20
			uni.createSelectorQuery().select('.product-new').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {
					if (that.page * that.size == that.prolist.length) {
						that.loadMoreStatus = 'loading';
						console.log("这里")
						that.page++
						that.getGoodsList()
					}
				}
			}).exec()
		},
		onReachBottom() {
			var that = this
			console.log("111")
			console.log(that.page * that.size)
			console.log(that.prolist.length)
			console.log(that.page * that.size == that.prolist.length)
			if (that.page * that.size == that.prolist.length) {
				that.loadMoreStatus = 'loading';
				that.page++
				that.getGoodsList()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		methods: {
			// 点击全部分类
			tapAllCategories() {
				this.allCategoriesType = !this.allCategoriesType;
			},
			tapAllCategoriesItem(val) {
				if (this.shopId > 0) {
					uni.navigateTo({
						url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + val +
							'&ru_id=' + this.shopId
					})
				} else {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=' + val
					})
				}
			},


			// 瀑布流区域
			// 获取占位元素高度
			getPlaceholderHeight() {
				return new Promise((resolve, reject) => {
					// 创建独立的查询实例
					const query1 = uni.createSelectorQuery().in(this)
					const query2 = uni.createSelectorQuery().in(this)

					// 并行执行查询
					Promise.all([
						new Promise((res) => {
							query1.select('.shipin_1')
								.boundingClientRect()
								.exec((resArr) => res(resArr[0]?.height || 0))
						}),
						new Promise((res) => {
							query2.select('.shipin_2')
								.boundingClientRect()
								.exec((resArr) => res(resArr[0]?.height || 0))
						})
					]).then(([leftHeight, rightHeight]) => {
						resolve({
							left: leftHeight,
							right: rightHeight
						})
					}).catch(err => {
						console.error('查询失败:', err)
						reject({
							left: 0,
							right: 0
						})
					})
				})
			},



			// 智能分配元素
			distributeItems(items) {
				items.forEach(item => {
					var that = this;
					// 计算动态高度（根据内容） ，
					const itemHeight = that.calcItemHeight(item) + 10
					console.log(that.rightHeight)
					console.log(that.leftHeight)
					// 比较列高
					if (that.leftHeight <= that.rightHeight) {
						that.leftList.push({
							...item,
							height: itemHeight
						})
						that.leftHeight += itemHeight
					} else {
						that.rightList.push({
							...item,
							height: itemHeight
						})
						that.rightHeight += itemHeight
					}
				})
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
				// 固定图片高度（170rpx）
				const imageHeight = 170

				// 动态计算内容高度
				let contentHeight = 0
				let rowCount = 0

				// 标题高度（实际渲染行数）
				if (item.title || item.goods_name) {
					const titleLines = Math.ceil(item.goods_name.length / 15) // 假设每行15字
					contentHeight += Math.min(titleLines, 2) * CONTENT_CONFIG.TITLE_LINE_HEIGHT
					rowCount += Math.min(titleLines, 2)
				}

				// // 价格行
				if (item.shop_price) {
					contentHeight += CONTENT_CONFIG.PRICE_HEIGHT
					rowCount += 1
				}
				if (item.sales_volume) {
					contentHeight += CONTENT_CONFIG.PRICE_HEIGHT
					rowCount += 1
				}

				// 标签区域（每行最多3个标签）
				if (item.goods_services_label_new?.length) {
					const tagRows = Math.ceil(item.goods_services_label_new.length / 3)
					contentHeight += tagRows * CONTENT_CONFIG.TAG_ROW_HEIGHT
					rowCount += tagRows
				}



				// 行间距计算
				contentHeight += Math.max(0, rowCount - 1) * CONTENT_CONFIG.ROW_GAP

				return imageHeight + contentHeight
			},


			// 2
			startRotation() {
				// 启动轮播
				this.intervalId = setInterval(() => {
					this.currentIndex = (this.currentIndex + 1) % this.words.length;
				}, 2000); // 每2秒切换一次
			},
			stopRotation() {
				// 停止轮播
				this.keyValue = ''
				clearInterval(this.intervalId);
				this.intervalId = null;
			},
			handleFocus() {
				this.isFocused = true;
				this.stopRotation();
			},
			handleBlur() {
				this.isFocused = false;
				this.triggerDelayedRotation();
			},
			triggerDelayedRotation() {
				setTimeout(() => {
					if (!this.isFocused) {
						this.startRotation();
					}
				}, 500);
			},
			triggerFocusBlur() {
				this.$refs.inputRef.focus();
				this.$refs.inputRef.blur();
			},
			// 点击搜索热词
			searchTag(val, index) {
				var that = this
				// this.tabIndex = index
				if (index == 0) return;
				if (this.shopId > 0) {
					uni.navigateTo({
						url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + val +
							'&ru_id=' + this.shopId
					})
				} else {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=' + val
					})
				}
			},
			// 获取热词
			shopConfigHot() {
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
							let newStr = "推荐, " + data.search_keywords;
							this.search_keywords = newStr.split(',')
							this.search_keywords_five = this.search_keywords.splice(0, 5)
						}
						if (data.hint_keywords) {
							// this.hint_keywords = data.hint_keywords.split(',')
							// this.words = data.hint_keywords.split(',')
							let arr = data.hint_keywords.split(',')
							let result = arr.map(item => {
								if (item === null || item === undefined || item === '') {
									return '输入货源关键字';
								} else {
									return item;
								}
							})
							this.hint_keywords = result
							this.words = result
						}
						// console.log('hot', this.search_keywords)
					}
				});
			},
			getoneList(num) {
				var that = this
				let data = {
					type: 'home',
					device: 'app',
					num: 1
				}
				uni.request({
					url: that.websiteUrl + '/api/app/home/zp_ys',
					method: 'GET',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.data) {
							that.onelist = res.data.data.data
							that.visualdvAList[0].previewProlist = that.onelist
							// console.log(777777, that.visualdvAList[0].previewProlist);
							uni.setStorageSync('visualdvAList', that.visualdvAList[0].previewProlist)
						} else {
							uni.showToast({
								icon: 'none',
								title: ''
							})
						}
					},
				})
			},

			gettwoList(num) {
				var that = this
				let data = {
					type: 'home',
					device: 'app',
					num: 2
				}
				uni.request({
					url: that.websiteUrl + '/api/app/home/zp_ys',
					method: 'GET',
					data: data,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.data) {
							that.twolist = res.data.data.data
							that.visualdvAList[1].previewProlist = that.twolist
						} else {
							uni.showToast({
								icon: 'none',
								title: ''
							})
						}
					},
				})
			},

			copyTitle(title, goods_name) {
			
			},
			//比如调用接口loginIn
			handleToLogin(code) {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/oauth/h5_wechat_login',
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					data: {
						code: code,
						type: 'weixin',
						platform: 'H5'
					},
					success: (res_1) => {
						console.log("这里")
						console.log(res_1)
						console.log(res_1.data)
						// if (res_1.data.error == '0') {
						if (res_1.data.data.login === 1) {
							uni.setStorageSync("token", res_1.data.data.token)
						}
					},
					fail: (data, code) => {
						that.tui.toast('网络连接不可用,请检查网络')
					}
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
			toSearch(e) {
				if (e == '热卖') {
					uni.navigateTo({
						url: '/pagesC/hotgoods/hotgoods'
					})
				} else if (e == '新品') {
					uni.navigateTo({
						url: '/pagesC/newgoods/newgoods'
					})
				}
			},
		
			toMerchants: function() {
				console.log(101010);
				uni.navigateTo({
					url: '/pagesB/merchants/merchants'
				})
			},


			// 新品方法
			newGoodsListArr(res) {
				for (let i = 0; i < res.length; i += 4) {
					this.newArray.push(res.slice(i, i + 4));
				}
				console.log(this.newArray)
			},





			getNewGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						// size: this.size, 将一个数组中的数据追加到另一个数组中
						size: 4,
						type: 'is_new'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						this
						let data = res.data.data
						this.newListOne = data[0]
						this.newListTwo = data[1]
						this.newGoodsListArr(data)

					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getHome_list() {
				uni.request({
					url: this.websiteUrl + '/api/app/ad_position?type=home_list',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log(res.data)
						let data = res.data.data
						this.home_list_one = data.list
						console.log('home', this.home_list_one)
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getVideoList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
				uni.request({
					url: this.websiteUrl + '/api/goods/goodsvideo',
					method: 'POST',
					data: {
						size: this.size,
						page: this.page,
						sort: 'goods_id',
						order: 'desc'
					},
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash': uni.getStorageSync('client_hash'),
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						let data = res.data.data
						this.videoListOne = data[0]
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getHotGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						// size: this.size,
						size: 4,
						type: 'is_hot'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data

						this.hotListOne = data[0]
						this.hotListTwo = data[1]
						const sliced = data.slice(0, 4);
						this.newGoodsListArr(data)
						console.log(this.newArray)
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getGoodsList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				console.log(this.type)
				uni.request({
					url: this.websiteUrl + '/api/goods/type_list',
					method: 'GET',
					data: {
						page: this.page,
						size: this.size,
						type: 'is_home'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						var that = this
						// console.log(res.data)
						for (var i = 0; i < res.data.data.length; i++) {
							res.data.data[i].isshow = true
						}
						let data = res.data.data
						if (res.data.data.length < 10) {
							that.loadMoreStatus = 'noMore'
						}
						if (that.page > 1) {
							that.prolist = that.prolist.concat(data);
							console.log(that.prolist.concat(data))
							that.distributeItems(data)
							// console.log('prolist', this.prolist);
						} else {
							that.prolist = data
							that.distributeItems(data)
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			toshoplist() {
				// console.log(101011);
				uni.navigateTo({
					url: '/pagesD/video/list'
				})
			},
			toShopHome: function(item) {
				// console.log(item)
				uni.navigateTo({
					url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
				})
			},
			linkvisualadv(item) {
				let page, built
	
				// #ifndef MP-WEIXIN
				page = item.appPage ? item.appPage : item.url
				built = item.appPage ? 'app' : 'undefined'
				// #endif

				// #ifdef MP-WEIXIN
				page = item.appPage ? item.appPage : item.url // appletPage
				built = item.appPage ? 'app' : 'undefined'
				// #endif
				this.$outerHref(page, built)
			},
			// 新品热搜跳转搜索
			linkHrefSearch(unm) {
				// 新品0 热销1  一件代发 3 严选4
				if(unm == 0){
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=新品' 
					})
				}else if(unm == 1) {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=热销' 
					})
				}else if(unm == 3) {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=一件代发' 
					})
				}else if(unm == 4) {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=好卖严选' 
					})
				}
			},
			linkHref(seckill_id, goods_id) {
				//如果是秒杀商品跳转到秒杀详情
				if (seckill_id != 0) {
					uni.navigateTo({
						url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
							'&tomorrow=0&delta=2'
					});
				} else {
					uni.navigateTo({
						url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
					})
				}
			},
			linknav(item) {
				// console.log(item)
				let page, built
				// #ifndef MP-WEIXIN
				page = item.appPage ? item.appPage : item.url
				built = item.appPage ? 'app' : 'undefined'
				// #endif

				// #ifdef MP-WEIXIN
				page = item.appPage ? item.appPage : item.url
				built = item.appPage ? 'app' : 'undefined'
				// #endif
				// console.log(page)
				// console.log(built)
				if (!item.media_live) {
					this.$outerHref(page, built)
				} else {
					//视频号正在直播  
					uni.openChannelsLive({
						finderUserName: uni.getStorageSync('configData').wxapp_media_id || '',
						feedId: uni.getStorageSync('channelsLive').feedId || '',
						nonceId: uni.getStorageSync('channelsLive').nonceId || '',
					})
				}
			},
			swiperChange(e) {

				this.swiperCurrent = e.detail.current
			},
			shipimswiperChange(e) {
				this.shipinswiperCurrent = e.detail.current
			},

			imageLoad(e) {
				this.marginWidth = 20;

				let imgwidth = e.detail.width,
					imgheight = e.detail.height,
					//设备宽度
					windowWidth = uni.getSystemInfoSync().windowWidth - this.marginWidth;

				this.imgheights = (windowWidth / imgwidth) * imgheight
			},
			linkslide(item) {
				console.log(666, item);
				// #ifndef MP-WEIXIN
				let page = item.appPage ? item.appPage : item.url
				let built = item.appPage ? 'app' : 'undefined'
				if (item.url.indexOf('html') != -1) {
					this.articleId = item.url.match(/-(\d+)\./)[1]
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				} else {
					uni.setStorageSync("webtitle", item.urlName);
					this.$outerHref(page, built)
				}
				// #endif

				// #ifdef MP-WEIXIN
				let page = item.appletPage ? item.appletPage : item.url
				let built = item.appletPage ? 'app' : 'undefined'
				if (item.url.indexOf('html') != -1) {
					this.articleId = item.url.match(/-(\d+)\./)[1]
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				} else {
					uni.setStorageSync("webtitle", item.urlName);
					this.$outerHref(page, built)
				}
				// #endif
				// uni.setStorageSync("webtitle", item.urlName);
				// this.$outerHref(page, built)
			},
			slideChange(e) {
				this.activeIndex = e.detail.current;
			},

			//首先我们需要一个触发，我是在进入页面onReady()生命周期中触发的检测
			getQuanxian() {
				let platform = uni.getSystemInfoSync().platform; //首先判断app是安卓还是ios
				if (platform == "ios") { //这里是ios的方法
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					var enabledTypes = 0;
					if (app.currentUserNotificationSettings) {
						var settings = app.currentUserNotificationSettings();
						enabledTypes = settings.plusGetAttribute("types");
						console.log("enabledTypes1:" + enabledTypes);
						if (enabledTypes == 0) { //如果enabledTypes = 0 就是通知权限没有开启
							// this.openTongZhi()
							this.ispush = true
						}
					}
					plus.ios.deleteObject(settings);
				} else if (platform == "android") { //下面是安卓的方法
					var main = plus.android.runtimeMainActivity();
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute("uid");
					var NotificationManagerCompat = plus.android.importClass(
						"android.support.v4.app.NotificationManagerCompat"
					);
					//android.support.v4升级为androidx
					if (NotificationManagerCompat == null) {
						NotificationManagerCompat = plus.android.importClass(
							"androidx.core.app.NotificationManagerCompat"
						);
					}
					var areNotificationsEnabled =
						NotificationManagerCompat.from(main).areNotificationsEnabled();
					// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
					console.log(areNotificationsEnabled)
					if (!areNotificationsEnabled) {
						// this.openTongZhi()
						this.ispush = true
					}
				}
			},
			//开启通知
			openTongZhi() { //弹窗按钮绑定方法
				let platform = uni.getSystemInfoSync().platform; //获取安卓还是ios
				if (platform == "ios") { //如果机型是ios，ios由于权限问题，可能需要手动开启
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					var settings = app.currentUserNotificationSettings();
					// enabledTypes = settings.plusGetAttribute("types");
					var NSURL2 = plus.ios.import("NSURL");
					var setting2 = NSURL2.URLWithString("app-settings:");
					var application2 = UIApplication.sharedApplication();
					application2.openURL(setting2);
					plus.ios.deleteObject(setting2);
					plus.ios.deleteObject(NSURL2);
					plus.ios.deleteObject(application2);
					plus.ios.deleteObject(settings);
				} else if (platform == "android") { //如果机型是安卓
					var main = plus.android.runtimeMainActivity();
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute("uid");
					var Intent = plus.android.importClass("android.content.Intent");
					var Build = plus.android.importClass("android.os.Build");
					//android 8.0引导
					if (Build.VERSION.SDK_INT >= 26) { //判断安卓系统版本
						var intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
						intent.putExtra("android.provider.extra.APP_PACKAGE", pkName);
					} else if (Build.VERSION.SDK_INT >= 21) { //判断安卓系统版本
						//android 5.0-7.0
						var intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
						intent.putExtra("app_package", pkName);
						intent.putExtra("app_uid", uid);
					} else {
						//(<21)其他--跳转到该应用管理的详情页
						intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						var uri = Uri.fromParts(
							"package",
							mainActivity.getPackageName(),
							null
						);
						intent.setData(uri);
					}
					// 跳转到该应用的系统通知设置页
					main.startActivity(intent);
				}
			},
			ispushNo() {
				var that = this
				that.ispush = false
			},
			ispushYes() {
				var that = this
				that.openTongZhi()
				that.ispush = false
			},
			operator() {
				let that = this
				uni.downloadFile({
					url: that.imgShare,
					success: function(res) {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function(file) {
									uni.showToast({
										title: that.$t('lang.picture_saved_success'),
										icon: 'none',
										duration: 2200
									});
								},
								fail: function() {
									uni.showModal({
										content: '检测到您没打开获取信息功能权限，是否去设置打开？',
										confirmText: "确认",
										cancelText: '取消',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting({
													success: (res) => {
														uni.showToast({
															title: "请重新点击分享保存图片～",
															icon: "none"
														});
													}
												})
											} else {
												uni.showToast({
													title: "保存失败，请打开权限功能重试",
													icon: "none"
												});
											}
										}
									})
								}
							});
						}
					}
				})
			},
			onGoodsShare() {
				this.mpShareShow = false
				this.customerShow = true
			},
			prentflaghanlde(flag) {
				this.imgShare = this.shopConfig.consult.consult_share_img
				// #ifdef MP-WEIXIN
				this.mpShareShow = true
				// #endif
				// #ifdef APP-PLUS
				this.customerShow = true
				// #endif
			},
			clickon() {
				this.click_add = false
			},
			//关闭Popup
			handelClose(val) {
				if (val == 'bonus') {
					this.bonusShow = false
					uni.setStorageSync('bonusShow', this.bonusShow);
				} else if (val == 'version') {
					this.versionShow = false
				} else if (val == 'customer') {
					this.customerShow = false
				} else {
					this.mpShareShow = false
				}
			},
			async appUpdate() {
				debugger
				console.log('appid',this.updateAppid)
				const {
					data,
					status
				} = await this.$store.dispatch('setAppUpdate', {
					appid: this.updateAppid
				});

				if (status == 'success') {
					this.versionData = data
						console.log('versionData',this.versionData)
					this.versionDataFunction()
				}
			},
			updateAppStore() {
				plus.runtime.openURL(this.versionData.content.download_url)
			},
			clickCategoryNav(e) {
				let height = 0;
				this.$refs.jump.forEach((v) => {
					height += v.height;
				})

				this.jumpHeight = height;
			},
			loadMore() {
				this.loadMoreStatus = "loading"
				// this.scrollPickOpen = true
				this.getGoodsList()
			},
			updateScrollPickOpen() {
				this.scrollPickOpen = false
			},

			isChange: function() {
				var that = this
				//当视图渲染结束 重新设置为0
				that.page = 1
				//当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				setTimeout(function() {
					that.isDefine = 1
					// that.gundong = true
				}, 500);

			},
			isChanges: function() {
				var that = this
				// that.page = 1
				// //当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				// setTimeout(function() {
				// 	that.isDefine = 2
				// 	// that.gundong = false
				// }, 500);
				uni.navigateTo({
					url: '/pagesD/shop/shop'
				})
			},

			message() {
				if (this.$isLogin()) {
					uni.navigateTo({
						url: '/pagesB/messagelist/messagelist'
					})
				} else {
					uni.showModal({
						content: "您需要登录会员!",
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
			searchFocus() {
				//全局变量integration赋值
				//getApp().globalData.integration = 0;
				uni.navigateTo({
					url: '/pagesD/search/search?shopId=' + this.shopId + '&currentWord=' + this.currentWord
				});
			},
			async scanClick() {
				// #ifndef APP-PLUS
				uni.scanCode({
					success: (res) => {
						if (this.$isLogin()) {
							let result = JSON.parse(res.result);
							let sid = result.sid;
							let url = result.url;
							let timestamp = Date.parse(new Date()) / 1000;
							// console.log('scanCodescanCode', res)
							this.keyword = res.result.replace(/\s*/g, "");
							if (res.scanType == 'EAN_13' && this.keyword.length == 13) {
								if (this.shopId > 0) {
									uni.navigateTo({
										url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this
											.keyword + '&ru_id=' + this.shopId
									})
								} else {
									uni.navigateTo({
										url: '/pagesD/goodslist/goodslist?keywords=' + this
											.keyword
									})
								}
								return
							} else {
								uni.showToast({
									icon: "none",
									title: '条码扫描不完整,请重新扫码'
								})
							}
						} else {
							uni.navigateTo({
								url: '/pagesB/login/login?delta=1'
							})
						}
					}
				})
				// #endif
				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA")
				// var result1 = await permision.premissionCheck("EXTERNAL_STORAGE")
				console.log(JSON.stringify(result))
				if (result == 1) {
					// 此处处理各自业务 如：uni.chooseImage
					uni.scanCode({
						success: (res) => {
							if (this.$isLogin()) {
								let result = JSON.parse(res.result);
								let sid = result.sid;
								let url = result.url;
								let timestamp = Date.parse(new Date()) / 1000;
								console.log('scanCodescanCode', res)
								this.keyword = res.result.replace(/\s*/g, "");
								if (res.scanType == 'EAN_13' && this.keyword.length == 13) {
									if (this.shopId > 0) {
										uni.navigateTo({
											url: '/pagesD/shop/shopGoods/shopGoods?keywords=' +
												this
												.keyword + '&ru_id=' + this.shopId
										})
									} else {
										uni.navigateTo({
											url: '/pagesD/goodslist/goodslist?keywords=' + this
												.keyword
										})
									}
									return
								} else {
									uni.showToast({
										icon: "none",
										title: '条码扫描不完整,请重新扫码'
									})
								}
							} else {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
				}
				// #endif

				

			},
			async chooseImage(val) {
				let that = this
				// #ifndef APP-PLUS
				// 预加载拍照页面
				uni.preloadPage({
					url: '/pagesD/middles/index'
				});
				uni.navigateTo({
					url: '/pagesD/middles/index'
				})
				return;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
				
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 80,
								success: (result) => {
									// that.imageSrc = result.tempFilePath;
									console.log("uni.compressImage")
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
					}
				})
				// #endif

				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA")
				console.log(JSON.stringify(result))
				// var result1 = await permision.premissionCheck("RECORD_AUDIO")
				// var result2 = await permision.premissionCheck("ACCESS_NETWORK_STATE")
				if (result == 1) {
					console.log("zeli")
					// 预加载拍照页面
					uni.preloadPage({
						url: '/pagesD/middles/index'
					});
					uni.navigateTo({
						url: '/pagesD/middles/index'
					})
					return;
					// 此处处理各自业务 如：uni.chooseImage
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['camera'],
						success: (res) => {
							that.imageSrc = res.tempFilePaths[0];
							let size = res.tempFiles[0].size; //上传图片大小
							let maxSize = 1024 * 1024 * 2; //最大可上传2mb
							if (size > maxSize) {
								uni.compressImage({
									src: res.tempFilePaths[0],
									quality: 80,
									success: (result) => {
										that.uploadImage(val);
									},
									fail: (result) => {
										console.log(result)
									}
								})
							} else {
								that.uploadImage(val);
							}
						}
					})
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
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];

						// #ifdef APP-PLUS
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 80,
								success: (result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
						// #endif

						// #ifdef MP-WEIXIN
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 80,
								success: (result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
						// #endif
					}
				})
			},

			async uploadImage(val) {
				let that = this;
				console.log("uni.uploadImage")
				uni.showLoading({
					mask: true,
					title: this.$t('lang.shang_shi')
				});

				//app压缩图片
				// #ifdef APP-PLUS
				that.imageSrc = await compressImage(that.imageSrc);
				// #endif

				pathToBase64(that.imageSrc).then(base64 => {
					that.$store.dispatch('setMaterial', {
						file: {
							content: base64
						},
						type: 'touxian'
					}).then(data => {
						uni.hideLoading()
						if (data.status == 'success') {
							console.log(data.data)
							// that.showOne = true
							uni.setStorageSync('imageSrc', data.data[0]);
							// that.$refs.imagecropper.init()
							uni.navigateTo({
								url: '/pagesC/canvas/canvas'
							})
						} else {
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: '请稍后重试'
							})
						}
					})
				}).catch(error => {
					console.error(error, 5);
				});
			},

			versionDataFunction() {
				console.log('versionDataFunction')
				var that = this
				let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				let version = Number(wgtinfo.version.replace(/\./g, ''));
				let version_id = that.versionData.content.version_id ? Number(that.versionData.content.version_id.replace(
						/\./g, '')) :
					0;
				// console.log(version)
				// console.log(version_id)
				//当前app版本小于后台设置版本
				if (version < version_id) {
					setTimeout(function() {
						that.versionShow = true
					}, 500);
				} else {
					if (that.bonusData && that.bonusData.open == 1) {
						that.bonusShow = uni.getStorageSync('bonusShow') !== '' ? uni.getStorageSync('bonusShow') : true;
					}
				}
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
							console.log(res_1.data)
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

				uni.showLoading({
					title: that.$t('lang.loading_submit'), //loading_submit 提交中...
					mask: true
				});


				console.log("goods_id:" + that.goodsDetail.goods_id)
				console.log("num:" + that.goodsNum)
				console.log("spec:" + newAttr)
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
					console.log(res)
					uni.hideLoading();
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
							//获取购物车数量
							uni.showToast({
								title: that.$t('lang.added_to_cart'),
								icon: 'success',
								duration: 500
							});
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
				const {
					data,
					status
				} = await that.$store.dispatch('setGoodsAttrOperById', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					attr_id: that.seleceGoodsAtrrArray
				});
				if (status != 'success') return that.showToast();
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
				console.log(res)
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
			closeAppDown() {
				this.localShow = false
				// localStorage.setItem('localShow', false)

				// this.$emit('localShow',this.localShow)
			},
			getIsShow() {
				uni.request({
					url: this.websiteUrl + '/api/visual/appnav',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						console.log(res.data)
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
						if (res.data.status == 'success') {
							res.data.data.wap_index_pro == 1 ? (this.localShow = true) : (this.localShow =
								false)
							localStorage.setItem('localShow', this.localShow)
							this.androidUrl = res.data.data.wap_app_android
							this.iosUrl = res.data.data.wap_app_ios
						}
					},
					fail: (res1) => {
						console.log(res1, 2)
					}
				})
			},

			openApp() {
				let downHref = '';

				window.location.href = 'dscmall://type=home';
				//微信内
				if (isApp.isWeixinBrowser()) {
					uni.showToast({
						title: '请在浏览器上打开',
						icon: 'none'
					})
				} else {
					//android端
					if (isApp.isAndroid) {
						downHref = this.androidUrl;
					}

					//ios端
					if (isApp.isiOS) {
						downHref = this.iosUrl;
					}

					setTimeout(function() {
						window.location.href = downHref;
					}, 500)
				}
			},
		},
		onReady() {
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
			this.getPlaceholderHeight()
				.then(heights => {
					this.leftHeight = heights.left
					this.rightHeight = heights.right
					this.heightDifference = heights.right - heights.left
					console.log('高度已获取:', heights);
					console.log('this.rightHeight:', this.rightHeight);
					console.log('this.leftHeight:', this.leftHeight);
				})
				.catch(error => {
					console.error('查询失败:', error);
				});

		},
		watch: {
			onelist() {
				if (this.onelist.length > 0) {
					this.dscLoading = false
				}
			},
		}
	}
</script>

<style lang="scss">
	// 1

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
		width: 345rpx;

	
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
			line-height: 0; 
			position: relative !important;
		
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
			width: 80%;
			margin: 0 auto;
		}
	}

	// 2


	.page-main {
		background: #ffffff;
		min-height: 100vh;
		padding: 0 30px;

		.card {
			column-count: 3; // 定义三列
			column-gap: 20px; // 列与列的距离为20px

			.card-item {
				text-align: center;
				width: 216px;
				border-radius: 16px;
				grid-row-start: auto;
				margin-bottom: 20px;
				break-inside: avoid; // 不被截断
			}
		}
	}

	/* 优惠与活动 start */
	.activity_wrap {
		display: flex;
		align-items: baseline;
		// padding: 30rpx 0;

		// &:nth-child(n + 2) {
		// 	.activity_main {
		// 		// border-top: 2rpx solid #ccc;
		// 	}
		// }

		.activity_title {
			flex: none;
			margin: 0 30rpx;
			font-weight: 700;
		}

		.activity_main {
			flex: auto;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			padding-right: 30rpx;

			.activity_list {
				flex: auto;
			}

			.activity_item_flex {
				display: flex;
				flex-wrap: wrap;
				align-items: baseline;
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
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}

				.activity_bg {
					padding: 0 10rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 26rpx;
					color: #F44C36;
					background: #FEE9E6;
					border-radius: 4rpx;
					margin: 22rpx 16rpx 0 0;
				}

				.margin_top0 {
					margin-top: 0;
				}

				.activity_tips {
					white-space: pre-line;
				}

				.coupon_bg_wrap {
					overflow: hidden;
					display: flex;
					margin: 22rpx 16rpx 0 0;

					.coupon_bg {
						flex: auto;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						min-width: 138rpx;
						height: 36rpx;
						line-height: 36rpx;
						padding: 0 10rpx;
						text-align: center;
						border-radius: 4rpx;
						border: 2rpx solid #F44C36;
						color: #F44C36;

						&:before {
							content: '';
							position: absolute;
							top: 50%;
							left: -10rpx;
							transform: translateY(-50%);
							width: 12rpx;
							height: 12rpx;
							border-radius: 50%;
							border: 2rpx solid #F44C36;
							background-color: #fff;
							z-index: 3;
						}

						&:after {
							content: '';
							position: absolute;
							top: 50%;
							right: -10rpx;
							transform: translateY(-50%);
							width: 12rpx;
							height: 12rpx;
							border-radius: 50%;
							border: 2rpx solid #F44C36;
							background-color: #fff;
							z-index: 3;
						}
					}
				}
			}

			.iconfont {
				flex: none;
				margin-left: 30rpx;
			}
		}
	}


	/* 优惠与活动 end */
	.server_wrap {
		align-items: stretch;
	}

	/* 小程序分享 */
	.mp-share-warp .title_on {
		text-align: center;
		border-top: 1upx solid #C8C7CC;
		padding: 8upx;
	}

	.mp-share-warp .lists {
		display: flex;
		flex-direction: row;
		margin: 30upx 0;
	}

	.mp-share-warp .list {
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx 0;
		background: #FFFFFF;
	}

	.mp-share-warp .list image {
		width: 100upx;
		height: 100upx;
	}

	.mp-share-warp .list text {
		margin-top: 20upx;
		height: 30upx;
		line-height: 30upx;
		font-size: 28upx;
	}

	.mp-share-warp button.list::after {
		border: none;
		border-radius: 0;
	}

	/*顶级分类*/

	/*拼团*/
	.scroll-view-item .goods-info .currency-price ::v-deep .shopping-icon {
		width: 35upx;
		height: 35upx;
		display: inline-block;
		border-radius: 50%;
		margin: 0 5upx 0 0;
		vertical-align: bottom;
	}

	.add_new {
		position: absolute;
		top: 10upx;
		right: 50upx;
		font-size: 24upx;
		border-radius: 10upx;
		padding: 10upx 30upx;
		background-color: rgba(88, 88, 88, .8);
		color: #FFFFFF;
		z-index: 999999;
	}

	.add_on:before {
		content: "";
		width: 0;
		height: 0;
		border-left: 10upx solid transparent;
		border-right: 10upx solid transparent;
		border-bottom: 10upx solid rgba(88, 88, 88, .8);
		position: absolute;
		top: -9upx;
		z-index: 999999;
		right: 80upx;
	}

	.add_on text {
		font-size: 22upx;
		padding-left: 30upx;
		color: red;
	}



	.search_container {
		z-index: 99999;

		.status_bar {
			background-color: #ffffff;
			width: 100%;
		}

		// 全部分类
		.search_all_categories {
			position: relative;

		}
		.main-opacity {
			opacity: 0.5;
		}
		.input_main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			/* #ifdef H5 */
			padding: 2rpx 24rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			padding: 22rpx 24rpx;
			margin-top: -10px;
			/* #endif */
			/* #ifdef APP-PLUS */
			padding: 20rpx 24rpx 18rpx;
			padding-top: 10rpx;
			/* #endif */
			line-height: 0;
			background-color: #ffffff;
		}

		.input_view {
			/* #ifndef MP-WEIXIN */
			flex: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 2rpx 8rpx 2rpx 16rpx;
			border-radius: 100rpx;
			color: #999;
			border: 2rpx solid #FE0302;
			background-color: #fff;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			// flex: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 66rpx;
			padding: 2rpx 9rpx 2rpx 15rpx;
			border-radius: 14rpx;
			color: #999;
			border: 2rpx solid #FE0302;
			background-color: #fff;
			width: 520rpx;
			margin-left: 0%;
			/* #endif */

			.placeholder_text {
				margin-top: -4rpx;
				margin-left: 20rpx;
				// width: 400rpx;
				/* #ifdef H5 */
				width: 400rpx;
				font-size: 30rpx;
				/* #endif */
				/* #ifdef APP-PLUS */
				width: 400rpx;
				font-size: 30rpx;
				/* #endif */
				/* #ifdef MP-WEIXIN */
				width: 200rpx;
				font-size: 26rpx;
				/* #endif */
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.placeholder_texts {
				font-size: 28rpx;
				margin-left: 20rpx;
				background-color: #FE0302;
				color: #ffffff;
				border-radius: 40rpx;
				/* #ifdef H5 */
				padding: 24rpx 38rpx;
				text-align: center;
				/* #endif */
				/* #ifdef APP-PLUS */
				padding: 8rpx 34rpx;
				// text-align: center;
				/* #endif */
				/* #ifdef MP-WEIXIN */
				// padding: 6rpx 26rpx;
				width: 86rpx;
				text-align: center;
				/* #endif */
			}
		}

		.logo_wrap {
			display: flex;
			text-align: center;
			margin: 0 auto;
			height: 50rpx;
			// justify-content: space-between;
			background-color: #f9f9f9;
			align-items: center;
			padding: 10rpx 24rpx 10rpx 14rpx;
		}
	}

	/* 以下是原有样式 */
	.position-fixed {
		position: fixed;
		top: 0;
		z-index: 998;
		width: 100%;
	}


	/*search*/
	.graying {
		color: #828282;
		font-size: 16px;
		font-weight: bold;
	}

	.darking {
		color: #000000;
		font-size: 18px;
		font-weight: bold;
	}

	/*新版轮播样式*/
	.slide-new {
		padding: 0 20upx;
		position: relative;
		overflow: hidden;
	}

	.slide-new .page-section-spacing {
		position: relative;
		z-index: 2;
		border-radius: 20upx;
		overflow: hidden;
	}

	.dots-container {
		// position: absolute;
		// right: 20upx;
		// bottom: 20upx;
		margin-top: 0;
		float: right;
		display: flex;
		justify-content: center;
	}

	.dot {
		margin: 0 6upx;
		width: 12upx;
		height: 12upx;
		background: rgba(0, 0, 0, 0.2);
		opacity: 1;
		border-radius: 6upx;
	}

	.dot.active {
		background: rgba(0, 0, 0, .5);
	}

	.dots-container.pagination-left {
		justify-content: flex-start;
	}

	.dots-container.pagination-center {
		justify-content: center;
	}

	.dots-container.pagination-right {
		justify-content: flex-end;
	}

	.separat-show-new {
		padding: 20upx 20upx 0 20upx;
	}


	::-webkit-scrollbar {
		display: none;
	}

	// 全部分类 弹窗
	.all_categories_popops {
		.popops_mack {
			position: fixed;
			top: 150px;
			left: 0;
			height: 100%;
			width: 100%;

			background-color: #000;
			opacity: 0.6;

			z-index: 99;
		}

		.local_show_false {
			position: fixed;
			top: 120rpx !important;
		}

		.all_categories_label {
			position: fixed;
			top: 180rpx;
			left: 0;
			width: 100%;
			cursor: pointer;
			background-color: #fff;


			z-index: 100;

			.all_categories_label_top {
				display: flex;
				justify-content: space-between;
				margin: 0rpx 32rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #1B1B1B;
				margin-top: 16rpx;

				.iconfont {
					transform: rotate(-90deg);
				}
			}

			.all_categories_label_list {
				display: flex;
				flex-wrap: wrap;
				padding: 0 16rpx;
				justify-content: space-between;
				text-align: center;

				.all_categories_label_tag {
					background: #EDEDED;
					border-radius: 8rpx;
					margin: 8px;

					.all_categories_text {
						// padding: 16rpx 32rpx;
						font-weight: 400;
						font-size: 28rpx;
						color: #272727;
						width: 74px;
						height: 30px;
						display: block;
						text-align: center;
						padding: 2px;
						max-width: 65px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						white-space: normal;

						word-break: break-all;
					}
				}

			}
		}

	}

	.visual-adv {
		padding: 0upx 20upx 0 20upx;
		position: relative;
	}

	.visual-adv .bg-img {
		width: 100%;
	}

	.visual-adv .bg-img .img {
		border-radius: 16upx;
	}

	.visual-adv .bg-img .imga {
		border-radius: 16upx;
		// width: 114px;
		// height: 114px;
	}

	.adv-goods-list {
		// margin-top: -10%;

	}

	.adv-goods-list .scroll-view {
		overflow: visible;
		// width:100%;
	}

	.adv-goods-list .scroll-view-item {
		display: inline-block;
		// width: 31%;
		/* #ifndef H5 */
		width: 228rpx;
		margin: 0 14rpx 18rpx 2rpx;
		/* #endif */
		/* #ifdef H5 */
		width: 32%;
		margin: 0 1.3% 18rpx 2rpx;
		// width: 228rpx;
		// margin: 0 14rpx 18rpx 2rpx;
		/* #endif */
		// margin: 0 14rpx 18rpx 2rpx;
		// margin: 0 0 0 2%;
		background-color: #fff;
		overflow: hidden;
		border-radius: 20upx;
		/* box-shadow:1upx 5upx 20upx 0 rgba(108,108,108,0.2); */
	}

	.adv-goods-list .scroll-view-item .goods-top {
		width: 100%;
		line-height: 0;
		position: relative;
		min-height: 220rpx;
	}

	.adv-goods-list .scroll-view-item .goods-info {
		padding: 20upx 16upx 10upx;
	}

	.adv-goods-list .scroll-view-item .goods-info .goods-name {
		font-size: 28upx;
		color: #000;
		height: 38px;
		line-height: 19px;
	}

	.adv-goods-list .scroll-view-item .goods-info .price {
		font-size: 32upx;
		color: #F20E28;
		font-weight: 500;
	}

	.adv-goods-list .scroll-view-item .goods-info .price .em {
		font-size: 25upx;
		margin-right: 3upx;
	}

	.visual-adv-swiper .adv-goods-list .scroll-view-item:last-child {
		margin-right: 0;
	}

	.visual-adv-lie {
		// margin: 0upx 20upx 0 20upx;
		/* #ifndef H5 */
		margin: 0upx 16upx 0 16upx;
		/* #endif */
		/* #ifdef H5 */
		margin: 0upx 20rpx;
		/* #endif */
		border-radius: 20upx;
		padding: 0 0 30upx;
	}

	.visual-adv-lie .scroll-view {
		white-space: inherit;
		line-height: 0;
	}

	.visual-adv-lie .adv-goods-list {
		padding: 0;
	}

	.visual-adv-lie .adv-goods-list .scroll-view-item {
		// margin-bottom: 2.5%;
	}

	.visual-adv-lie .adv-goods-list .scroll-view-item:nth-child(3n) {
		margin-right: 0;
	}

	.visual-adv-lie .adv-goods-list .scroll-view-item:nth-child(3n + 1) {
		// margin-left: 3.5%;
	}

	.visual-adv-lie .adv-goods-list .swiper-slide:last-child,
	.visual-adv-lie .adv-goods-list .swiper-slide:nth-last-child(2),
	.visual-adv-lie .adv-goods-list .swiper-slide:nth-last-child(3) {
		margin-bottom: 0;
	}


	.product-list {
		padding: 0 18rpx 18rpx 18rpx !important;
	}

	.product-list .outer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product-list .outer .left {
		width: auto;
	}

	.product-list .outer .sales-volume {
		font-size: 25rpx;
		color: #999;
	}

	.product-list-big .uni-product-list {
		flex-direction: column;
	}

	.product-list-big .uni-product-list .image-view,
	.product-list-big .uni-product-list .uni-product-info {
		width: 100%;
		height: auto;
		// max-width: 146rpx;max-height: 146rpx;
	}

	/*新版样式*/
	.product-new {
		margin: 20rpx 20rpx 0;
		/* min-height: 500rpx; */
	}

	.product-new .tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
		background-color: #5f94fc;
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
		min-height: 100rpx;
	}

	.product-new .goods-list .item .img-box {
		line-height: 0; //1111
		min-height: 360rpx !important;
		position: relative !important;
		
	}

	.waterfall-wrapper .info-box {
		padding: 14rpx 14rpx 14rpx 14rpx;
	}

	.product-new .goods-list .item .info-box {
		padding: 20rpx 20rpx 0rpx 20rpx;
	}

	.info-box .goods-name {
		.easy_choose {
			background: #DCAB6C;
			box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05);
			font-weight: 500;
			font-size: 20rpx;
			color: #FFFFFF;
			padding: 4rpx 6rpx;
			margin-right: 16rpx;
			border-radius: 10rpx;
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
		}
		.yishou {
			font-size: 24rpx;
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

	/* 视频、新品、热销 */
	.shipin_1 {
		// background: linear-gradient(to bottom, #FFE0E0 10%, #ffffff 40%, #ffffff 50%);
		// border-radius: 20rpx;
		// padding: 10rpx 20rpx 20rpx 20rpx;
		// padding: 16rpx;
		width: 50%;
		min-width: 50%;
		height: 568rpx;
		margin-right: 16rpx;
		// background: linear-gradient( 180deg, #FFE0E0 0%, #FFFFFF 100%);
		box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;
		// margin-right: 16rpx;
		background-image: url(https://images.eqingqu.com/attachs/photo/202503/20250331_C1DECA47A0B6E454FD79CA6F7D284A51.png);

		background-size: cover;
		/* 确保图片填充容器 */
		background-repeat: no-repeat;

		.new_goods {
			display: flex;
			flex-direction: row;
			margin-top: 10rpx;
			flex-wrap: wrap;
			padding: 16rpx 0;
			padding-top: 60rpx;

			.new_goods_item {
				text-align: center;
				width: 50%;
				margin: 8rpx 0;

				font-size: 14px;

				img {
					max-width: 148rpx;
					max-height: 148rpx;
					border-radius: 16rpx;
				}
			}
		}

	}

	.shipin_2 {
		// background: linear-gradient(to bottom, #D8EDFF 10%, #ffffff 40%, #ffffff 50%);
		border-radius: 20rpx;
		// padding: 16rpx;
		width: 50%;
		min-width: 50%;
		height: fit-content;
		box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;
		// margin-left: 20rpx;

		.shipin_2-label {

			// padding-left: 16rpx;
			.shipin_2-left {
				background: linear-gradient(to bottom, #FFE0E0 10%, #ffffff 40%, #ffffff 50%);
				// background: linear-gradient( 164deg, #FFFFFF 0%, #FFE0E0 100%);
				box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05), 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
				border-radius: 20rpx;
				padding: 16rpx;
				margin-right: 16rpx;
			}

		}

		.shipin_2-right {
			background: linear-gradient(to bottom, #FFF0D1 10%, #ffffff 40%, #ffffff 50%);
			box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05), 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 20rpx;
			padding: 16rpx;
		}
	}

	.shititle {
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 32rpx;
		color: #2D2D2D;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		margin-left: 8rpx;
	}

	.shititle1 {
		font-weight: bold;
		font-size: 32rpx;
		color: #FF7705;
	}

	.shipin_3 {
		// margin-left: 4rpx;
		// background-color: #5f94fc;
		// border-radius: 10rpx;
		// font-size: 22rpx;
		// padding: 4rpx 14rpx;
		// margin-top: 8rpx;

		/* #ifdef MP-WEIXIN */
		height: 38rpx;
		line-height: 26rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 28rpx;
		line-height: 28rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 28rpx;
		line-height: 28rpx;
		/* #endif */
		color: #ffffff;
		// transform: scale(0.8);


		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 22rpx;
		color: #FFFFFF;
		text-align: left;
		font-style: normal;
		// padding: 6rpx 10rpx;
		padding: 2px 3px;
		background: #5C93FF;
		border-radius: 8rpx;
		margin-left: 14rpx;
	}

	.shipin_4 {
		// margin-left: 4rpx;
		// background-color: #FFE50C;
		// border-radius: 10rpx;
		// font-size: 22rpx;
		// padding: 4rpx 14rpx;
		// margin-top: 8rpx;
		/* #ifdef MP-WEIXIN */
		height: 38rpx;
		line-height: 26rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 28rpx;
		line-height: 28rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 28rpx;
		line-height: 28rpx;
		/* #endif */
		color: #000000;

		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 22rpx;
		text-align: left;
		font-style: normal;
		// padding: 6rpx 10rpx;
		padding: 2px 3px;
		background: #FFE50C;
		border-radius: 8rpx;
		margin-left: 14rpx;
	}

	.newPrice {
		background-color: #FE0302;
		color: #ffffff;
		font-size: 24rpx;
		border-radius: 10rpx;
		padding: 4rpx 4rpx;
		width: 108rpx;
		min-width: 108rpx;
		height: 32rpx;
		line-height: 32rpx;
		// transform: scale(0.9);
		/* #ifdef APP-PLUS */
		margin: 0 auto;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin: 0 auto;
		/* #endif */
		/* #ifdef H5 */
		margin: 0 auto;
		/* #endif */
	}

	.newPrices {
		font-weight: 600;
		font-size: 24rpx;
		color: #FE2F02;
		width: 108rpx;
		// transform: scale(0.9);
		/* #ifdef APP-PLUS */
		margin-left: 22rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin-left: 20rpx;
		/* #endif */
		/* #ifdef H5 */
		margin-left: 20rpx;
		/* #endif */
	}

	.king-kong-nav {
		width: 100%;
		display: flex;
		justify-content: start;
		background-color: #fff;
		.nav-label {
			width: 100%;
			overflow-x: scroll;
			.nav-list {
				width: 500px;
				display: flex;
				.list {
					.icon {
						.image {
							min-width: 72px;
							box-shadow: inset -2rpx 0rpx 2rpx 2rpx #DB6116, in
						}
					}
				}

			}
		}
	}

	.nav {
		overflow: hidden;
		// position: relative;
	}

	.nav .list {
		// overflow: hidden;
		// box-sizing: content-box;
		// position: relative;
	}

	.nav .list .icon {
		width: 100%;
	}

	.nav .list .icon .image {
		width: 100%;
		height: auto;
		margin: 0 auto;
		display: block;
	}

	.nav .list .con {
		// font-size: 25upx;
		// margin-top: 6upx;
		// height: 40upx;
		// line-height: 40upx;
		font-weight: 500;
		font-size: 24rpx;
		color: #2D2D2D;
		text-align: center;
		font-style: normal;

	}

	.list-style2 .list {
		// width: 20%;
		// float: left;
		text-align: center;

		// overflow: hidden;
	}

	.list-style2 .list .uni-icon {
		display: none;
	}

	.list-style2.whole-margin {
		padding: 20upx 0;
	}

	.list-style2.all-padding .list {
		box-sizing: border-box;
		padding: 10upx;
	}

	.list-style2.all-border .list {
		box-sizing: border-box;
		margin-bottom: -1px;
		border: 1px solid #e7ecec;
		border-right: 0;
	}

	/* 新版样式3 */
	.dots-containerz {
		// position: absolute;
		// left: 0;
		// right: 0;
		// bottom: 50%;
		// margin-top: -70rpx;
		margin-top: -10%;
		display: flex;
		justify-content: center;
	}

	/* 新版样式3 */
	.dots-containerz_1 {
		// position: absolute;
		// left: 0;
		// right: 0;
		// bottom: 50%;
		margin-top: -10%;
		// margin-top: -70rpx;
		display: flex;
		justify-content: center;
	}

	.dotz {
		width: 30upx;
		height: 8upx;
		background: #1B1B1B;
		opacity: 1;
		overflow: hidden;
		margin-left: 10rpx;
	}

	.dotz:first-child {
		border-radius: 4upx 0 0 4upx;
	}

	.dotz:last-child {
		border-radius: 0 4upx 4upx 0;
	}

	.dotz.active {
		background: #fff;
	}

	// 弹框
	.cover_1 {
		position: absolute;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 99;
		opacity: 0.5;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
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
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 40%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_3_1 {
		font-size: 38rpx;
		margin-bottom: 50rpx;
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.add_box3_a {
		width: 50%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #000000;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 20rpx 0;
		font-size: 30rpx;
	}

	.add_box3_1_a {
		width: 50%;
		height: 90rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 0 20rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 30rpx;
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
		/* #ifdef H5 */

		/* #endif */
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





	.uni-page-body .uni-popup-middle {
		padding: 0;
		width: 80%;
		height: auto;
		background: none;
		box-shadow: none;
	}

	.uni-page-body .uni-popup-middle .close,
	.uni-page-body .uni-popup-middle .close-on {
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		position: absolute;
		top: -32upx;
		right: -10upx;
	}

	.uni-page-body .uni-popup-middle .version-popup {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-text {
		position: absolute;
		top: 15%;
		left: 12%;
		color: #FFFFFF;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-text .tit {
		font-size: 32upx;
	}

	.uni-page-body .uni-popup-middle .version-popup .close {
		top: 15%;
		right: 10%;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .close-on {
		top: -5%;
		right: 0;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .save-picture {
		width: 324upx;
		height: 73upx;
		border: 1px solid rgba(255, 255, 255, 1);
		border-radius: 37upx;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 73upx;
		text-align: center;
		margin: auto;
		margin-top: 40upx;
	}

	.uni-page-body .uni-popup-middle .version-popup .upgrade {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-notic {
		position: absolute;
		color: #666666;
		margin: 0 15%;
		top: 48%;
		text-align: center;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-btn {
		position: absolute;
		bottom: 15%;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 2;
	}

	.uni-page-body .uni-popup-middle .version-popup .version-btn .btn {
		width: 60%;
		height: 80upx;
		line-height: 80upx;
		margin: 0 auto;
		background: linear-gradient(to bottom right, #ff6333, #ff4335);
		color: #FFFFFF;
		text-align: center;
		border-radius: 30upx;
	}

	/* 小程序分享 */
	.mp-share-warp .title_on {
		text-align: center;
		border-top: 1upx solid #C8C7CC;
		padding: 8upx;
	}

	.mp-share-warp .lists {
		display: flex;
		flex-direction: row;
		margin: 30upx 0;
	}

	.mp-share-warp .list {
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx 0;
		background: #FFFFFF;
	}

	.mp-share-warp .list image {
		width: 100upx;
		height: 100upx;
	}

	.mp-share-warp .list text {
		margin-top: 20upx;
		height: 30upx;
		line-height: 30upx;
		font-size: 28upx;
	}

	.mp-share-warp button.list::after {
		border: none;
		border-radius: 0;
	}

	.mp-share-warp .mp-share-img {
		width: 280px;
		box-shadow: 0 10upx 20upx 0px rgba(61, 52, 75, 0.08);
		margin: 0 auto;
	}

	.mp-share-warp .btn-bar {
		margin: 10px;
	}


	.add_on:before {
		content: "";
		width: 0;
		height: 0;
		border-left: 10upx solid transparent;
		border-right: 10upx solid transparent;
		border-bottom: 10upx solid rgba(88, 88, 88, .8);
		position: absolute;
		top: -9upx;
		z-index: 999999;
		right: 80upx;
	}

	.add_on text {
		font-size: 22upx;
		padding-left: 30upx;
		color: red;
	}


	.app-down {
		height: 4rem;
		z-index: 1999;
	}

	.ect-header-banner {
		background: rgba(0, 0, 0, 0.9);
		height: 3.5rem;
		line-height: 3.5rem;
		width: 100%;
		color: #fff;
		display: -webkit-box;
		display: -moz-box;
		display: -ms-box;
		display: box;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 1999;
	}

	.ect-header-banner.active {
		top: -5rem;
	}

	.box-flex {
		-moz-box-flex: 1;
		-ms-box-flex: 1;
		box-flex: 1;
		-webkit-box-flex: 1;
		display: block;
		width: 100%;
	}

	.fl {
		float: left;
	}

	.box-flex img {
		float: left;
		border-radius: 20rpx;
	}

	.ect-header-text {
		padding-left: 1.1rem;
		margin-top: 0.6rem;
	}

	.ect-header-banner.active {
		display: none;
	}

	.ect-header-banner i {
		color: #fff;
		font-size: 2rem;
		margin-left: 1rem;
	}

	.ect-header-banner img {
		width: 2.3rem;
		height: auto;
		margin-left: 1rem;
		margin-top: 0.7rem;
	}

	.ect-header-banner .ect-header-text {
		padding-left: 1.1rem;
		margin-top: 0.4rem;
	}

	.ect-header-banner h4 {
		font-size: 1.3rem;
		line-height: 1.2;
	}

	.ect-header-banner p {
		font-size: 1.1rem;
		color: #ccc;
		line-height: 1.2;
	}

	.ect-header-banner .btn-submit1 {
		padding: 0.2rem 0.3rem;
		margin-top: -0.3rem;
		margin-right: 0.6rem;
		color: #fff;
		border: 1px solid #fff;
		border-radius: 4px;
		font-size: 22rpx;
	}

	.ect-header-banner .btn-submit1:hover {
		border-color: #fff;
	}

	.tab-bar1 {
		// height: 48px;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		padding: 0rpx 16rpx 16rpx 32rpx;
		// margin-right: 16rpx;
		// border-top: 1px solid #f3f4f9;
		// border-bottom: 1px solid #F6F6F9;
		// position: fixed;
		// top: 0;
		// left: 0;
		// right: 0;
		z-index: 10001;

	}

	.all-text {
		display: flex;

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: #313131;
		}

		.iconfont {
			font-size: 24rpx;
			transform: rotate(90deg);
		}
	}

	.tab-bar1 .tab-item {
		display: flex;
		// flex: 1 1 0%;
		justify-content: center;
		align-items: center;
		margin-right: 40rpx;
		background: #FFFFFF;
	}

	.tab-bar1 .tab-item text {
		// padding: 0px 2px 10rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #313131;
		font-style: normal;
		color: #313131;
	}

	.tab-bar1 .tab-item.active text {
		color: #f92028;
		position: relative;
		font-weight: 700;
		font-size: 28rpx;
	}

	.tab-bar1 .tab-item.active text:after {
		content: ' ';
		position: absolute;
		border-bottom: 4upx solid #FE0302;
		width: 30upx;
		height: 12upx;
		/* border-radius: 0 0 50% 50%/0 0 100% 100% ; */
		bottom: 0upx;
		left: calc(50% - 30upx);
		border-top: none;
		left: 30%;
	}
	.yishou {
			font-weight: 400;
			font-size: 24rpx;
		}
	.num-line {
		// background: pink;
		display: flex;
		justify-items: center;
		align-items: flex-end;
		// margin-bottom: 7px;
		align-items: baseline;

		.left-num {
			padding: 0 8px 0 0;
			font-weight: 500;
			font-size: 20px;
			color: yellowgreen;
			line-height: 20px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
		}

		

		.mid-num {
			font-size: 10px;
			line-height: 10px;
			color: #f23030;
			padding: 0 8px 4px 0;
		}

		.right-num {
			font-weight: 400;
			font-size: 10px;
			color: #A2A2A2;
			line-height: 10px;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			padding: 0 0 4px 0;
		}
	}
	
	.bottom-line {
		// background: #09B248;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 5px;

		.shop-grade {
			font-weight: 500;
			color: #FE2F02;
			text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
			font-style: normal;
			margin-right: 16rpx;
			font-size: 12px;
		}

		.shop-name {
			font-size: 12px;
			line-height: 12px;
			flex: 1;
			color: #A2A2A2;
			margin-right: 6rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.shop-img {
			width: 40rpx;
			height: 40rpx;
			vertical-align: middle;
		}
	}
</style>