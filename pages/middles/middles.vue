<template>
	<view class="uni-page-body middles-page" style="background-color: #ffffff;">
		<!-- 顶部区域包装：search_container + 金刚区 nav，统一背景图 -->
		<view class="header-with-bg" :class="{'has-header-bg': !!headerBgImage, 'header-scrolled': navOpacity > 0.12}">
			<!-- 背景层：上红下白渐变 / 或图片(PNG/GIF)，后续由后端返回 headerBgImage -->
			<view class="header-bg-layer" v-if="headerBgImage">
				<view v-if="headerBgImage === 'gradient'" class="header-bg-gradient"></view>
				<image v-else class="header-bg-image" :src="headerBgImage" mode="aspectFill"/>
			</view>
		<view class="search_container">


		  <!-- #ifdef H5 -->
		  <!-- <app-down :configData="shopConfig" @localShow="localShow" v-if="shopConfig && shopConfig.wap_index_pro == 1"></app-down> -->
		  <div class='app-down' v-if="localShow">
			  <div class="ect-header-banner dis-box" id="ect-banner">

				  <view style="padding-top: 34rpx;padding-left: 20rpx;" @click="closeAppDown">
					  <image
						  src="https://images.eqingqu.com/attachs/photo/202403/20240305_A596460B29B83F980245FE085E084168.png"
						  style="width: 40rpx;height: 40rpx;"></image>
				  </view>
				  <div class="box-flex">
					  <img :src="shopConfig.h5_index_pro_image||'https://images.eqingqu.com/attachs/photo/202505/20250509_306AA5BD7E90958E102A5CE61A5352D2.png'"
						  style="margin-right:.4rem">
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
		  <!-- #endif   -->
		  <!-- <view class="search" :class="{'position-fixed':scrollFixed}"
			  :style="{'background-color':'#F9F9F9',opacity: navOpacity == 1 ?0.9 :1, }"> -->
			<view class="search" :class="{'position-fixed':scrollFixed}" :style="searchHeaderStyle">
			  <!-- #ifdef APP-PLUS -->
			  <!-- 这里是状态栏（动态高度，适配灵动岛等设备） -->
			  <view class="status_bar" :style="{ height: statusBarHeight + 'px' }"></view>

			  <!-- #endif -->
			  <!-- #ifdef H5 -->
			  <!-- 这里是状态栏 -->
			  <view v-if="localShow" style="height: 100rpx;"></view>
			  <view class="status_bar"></view>

			  <!-- #endif -->
			  <!-- #ifdef MP-WEIXIN -->
			  <view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>

			  <!-- #endif -->
			  <view class="input_main " :style="searchInputStyle">
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
						  <image src="/pagesC/static/camera@2x.png" style="width: 44rpx;height: 40rpx;"
							  @click="chooseImage">
						  </image>
						  <!-- #endif -->
						  <!-- #ifdef MP-WEIXIN -->
						  <image src="@/pagesC/static/camera@2x.png" style="width: 36rpx;height: 36rpx;"
							  @click="chooseImage">
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
			  <view class="search_all_categories"
				  :style="searchCategoriesStyle">
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
				  <!-- #ifdef H5 -->
				  <view class="all_categories_label-h5" :class="{local_show_false:!localShow}">
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
				  <!-- #endif -->
				  <!-- #ifdef APP-PLUS -->
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
				  <!-- #endif -->
				  <!-- #ifdef MP-WEIXIN -->
				  <view class="all_categories_label" :style="{top:topVal + 'px'}">
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
				  <!-- #endif -->
				  <view class="popops_mack" @click="tapAllCategories()"></view>
			  </view>
			  <!-- 全部分类弹框 end -->

		  </view>
		  <!-- #ifdef APP-PLUS -->
		  <!-- <view style="height: 260upx;"></view> -->
		  <view :style="{ height: searchHeaderSpacerRpx + 'rpx' }"></view>
		  <!-- #endif -->
		  <!-- #ifdef H5 -->
		  <view style="height: 146rpx;"></view>
		  <!-- #endif -->
		  <!-- #ifdef MP-WEIXIN -->
		  <view :style="{height:navLabelTop + 'px'}"></view>
		  <!-- <view style="height: 300upx;"></view> -->
		  <!-- #endif -->
		</view>
	  <!-- 金刚区 -->
	  <view class="nav"  v-if="false"  :class="aClass">
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




	  <view class="king-kong-wrap">
	  <view class="nav king-kong-nav king-kong-nav-float" :class="aClass">
		  <view class="nav-label">
			  <!-- #ifdef MP-WEIXIN -->
			  <!-- 小程序专版：固定尺寸图标 + animationfinish 落位，避免快速连滑陷入循环 -->
			  <swiper class="king-kong-swiper-mp" :indicator-dots="false" :autoplay="false"
				  :current="navKongCurrent" :duration="300" :circular="false"
				  @change="onNavKongSwiperChange" @animationfinish="onNavKongAnimationFinish">
				  <swiper-item v-for="(page, pageIndex) in navSwiperPages" :key="pageIndex">
					  <view class="nav-list-mp">
						  <view class="kk-cell-mp"
							  v-for="(items, indexs) in page"
							  :key="(items && (items.cat_id || items.id)) || (pageIndex + '-' + indexs)"
							  @click="linknav(items)">
							  <view class="kk-icon-mp">
								  <image :src="items.img || imagePath.defaultImg" mode="aspectFit" class="kk-image-mp"></image>
							  </view>
							  <view class="kk-con-mp">
								  <block v-if="items.desc">{{ items.desc }}</block>
							  </view>
						  </view>
					  </view>
				  </swiper-item>
			  </swiper>
			  <!-- #endif -->
			  <!-- #ifndef MP-WEIXIN -->
			  <swiper class="king-kong-swiper" :indicator-dots="false" :autoplay="false"
				  :current="navKongCurrent" @change="onNavKongSwiperChange">
				  <swiper-item v-for="(page, pageIndex) in navSwiperPages" :key="pageIndex">
					  <view class="nav-list">
				  <view class="list" :class="{'list1': indexs === 0}"
							  v-for="(items, indexs) in page" :key="pageIndex + '-' + indexs"
					  @click="linknav(items)">
					  <view class="icon" v-if="items.img">
						  <image :src="items.img" mode="widthFix" class="image" style="height: 144rpx;"></image>
					  </view>
					  <view class="icon" v-if="!items.img">
								  <image :src="imagePath.defaultImg" mode="widthFix" class="image" style="height: 144rpx;"></image>
					  </view>
					  <view class="con uni-ellipsis" style="margin-top: -12rpx;">
						  <block v-if="items.desc">{{ items.desc }}</block>
					  </view>
				  </view>
			  </view>
				  </swiper-item>
			  </swiper>
			  <!-- #endif -->
			  <!-- 自定义轮播指示：选中=横杠，未选中=点 -->
			  <view class="king-kong-indicator" v-if="navSwiperPages.length > 1">
				  <view v-for="(page, idx) in navSwiperPages" :key="idx"
					  :class="['king-kong-indicator-item', navKongCurrent === idx ? 'bar' : 'dot']"></view>
					  </view>
					  </view>
					  </view>
				  </view>
			  </view>
		<!-- /header-with-bg -->

	  <!-- 新人优惠区域 -->
	  <view class="new-person" v-if="receiveData.length > 0" @click="goNewPerson()">
		  <view class="one">
			  <view>新人限时福利</view>
			  <view class="one-text">
				  <text class="mr8"> 仅剩</text>

				  <text class="time mr8">{{ formatTime(minutes) }}</text> :
				  <text class="time mr8 ml8">{{ formatTime(seconds) }}</text> .
				  <text class="time mr8 ml8">{{ formatTime(milliseconds, true) }}</text>
				  <text class="mr8"> 后过期</text>
			  </view>
			  <view class="one-more">
				  <image
					  src="https://images.eqingqu.com/attachs/photo/202508/20250828_F29BA621659B4561BA4DDF590402E3F1.png">
				  </image>
			  </view>
		  </view>
		  <view class="two">
			  <view class="two-item" v-for="(item,index) in receiveData.slice(0, 4)" :key='index'>
				  <view class="two-content">
					  <text class="two-amount">¥{{item.cou_money}}</text>
					  <text class="two-condition">满{{item.cou_man}}可用</text>
				  </view>
			  </view>
			  <view class="two-text">
				  <text class="two-text-line">立即</text>
				  <text class="two-text-line">领取</text>
			  </view>
		  </view>
		  <view class="three">
			  <view class="three-item" v-for="(item,idx) in userGoodsList.slice(0,3)" :key="idx">
				  <view class="three-content">

					  <view class="img-box">
						  <image class="img" :src="item.goods_thumb" mode="widthFix"></image>

					  </view>
					  <view class="info-box">
						  <view class="goods-name twolist-hidden  title-font" style="font-size:28rpx;"
							  @longpress="copyTitle(item.title,item.goods_name)">

							  <image class="new-img"
								  src="https://images.eqingqu.com/attachs/photo/202508/20250829_38B6A8B4CCFFEEA55C9363D0A017ED2C.png">
							  </image>
							  <text class="goods-name-text">{{item.goods_name}}</text>
						  </view>


						  <view class="num-line">
							  <currency-price class="left-num" :price="item.shop_price" :size="20"></currency-price>
							  <view>
								  <text
									  class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}</text>
							  </view>
						  </view>
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


	  <!-- 横向滑动商品：isStyleSel 0=轮播 1=分开 -->
	  <view class="visual-adv" :class="[visualAdvIsCarousel ? 'visual-adv-swiper' : 'visual-adv-lie']">
		  <!-- isStyleSel=0：banner 轮播左右滑动 -->
		  <block v-if="visualAdvIsCarousel">
			  <view class="visual-adv-swiper-wrap">
				  <swiper class="visual-adv-banner-swiper" :style="{ height: visualAdvSwiperHeightComputed + 'rpx' }"
					  :autoplay="true" :interval="5000" :duration="500"
					  :circular="true" :indicator-dots="false"
					  @change="visualAdvSwiperChange">
					  <swiper-item v-for="(items, indexs) in visualdvAList" :key="indexs">
			  <view class="bg-img" @click="linkvisualadv(items.data.allValue)">
				  <image :src="items.data.allValue.titleImg" mode="widthFix" class="img"
							  v-if="items.data.allValue.titleImg" @load="visualAdvImageLoad"></image>
						  <view v-if="visualdvAList.length > 1 && indexs === visualAdvSwiperCurrent"
							  class="visual-adv-dots">
							  <view v-for="(ad, idx) in visualdvAList" :key="idx"
								  :class="['dot', idx === visualAdvSwiperCurrent ? 'active' : '']"></view>
			  </view>
					  </view>
					  <view v-if="(items.previewProlist || []).length > 0" class="adv-goods-list">
					  <scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
							  <view class="scroll-view-item" v-for="(item, index) in items.previewProlist" :key="index"
								  @click="linkHref(item.seckill_id, item.goods_id)">
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
					  </view>
				  </swiper-item>
			  </swiper>
			  </view>
				  </block>
		  <!-- isStyleSel=1：banner 竖向排列 -->
				  <block v-else>
			  <block v-for="(items, indexs) in visualdvAList" :key="indexs">
				  <view class="bg-img" @click="linkvisualadv(items.data.allValue)">
					  <image :src="items.data.allValue.titleImg" mode="widthFix" class="img"
						  v-if="items.data.allValue.titleImg"></image>
				  </view>
				  <view class="adv-goods-list">
					  <view class="scroll-view">
						  <view class="scroll-view-item" v-for="(item, index) in items.previewProlist" :key="index"
							  @click="linkHref(item.seckill_id, item.goods_id)">
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
			  </view>
			  </block>
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

		  <view
			  style=" display: flex;justify-content: space-between;margin:16rpx 16rpx 16rpx 16rpx;margin-right: 16px;">

			  <view class="shipin_1" :style="{
  backgroundImage: shipinswiperCurrent === 0 
	? 'url(https://images.eqingqu.com/attachs/photo/202503/20250331_C1DECA47A0B6E454FD79CA6F7D284A51.png)' 
	: 'url(https://images.eqingqu.com/attachs/photo/202504/20250403_5C0753A53388BF31560A7396FFFFD13F.png)'
}">
				  <view @click="toSearch('新品')">

				  </view>
				  <swiper style="height: 100%;" :indicator-dots="shipinindicatorDots" @change="shipimswiperChange"
					  :circular="true" autoplay>
					  <swiper-item v-for="(items,indexs) in newArray" :key="indexs">
						  <view class="new_goods">
							  <view class="new_goods_item" v-for="(goodsItem,goodsidx) in items" :key="goodsidx"
								  @click="toSearch(shipinswiperCurrent == 0? '新品':'热卖')">
								  <view>
									  <image :src="goodsItem.goods_thumb"
										  style="width: 160rpx;height: 146rpx;border-radius: 10rpx;max-width: 160rpx;max-height: 146rpx;"
										  v-if="goodsItem.goods_thumb"></image>
									  <!-- <image style="width: 146rpx;height: 146rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;" src="https://www.ok9288.com/img/user_default.png"></image> -->
								  </view>
								  <view class="newPrice">
									  <text class="newPrice-currency">￥</text>
									  <text v-if="goodsItem.shop_price" class="newPrice-num">{{ goodsItem.shop_price }}</text>
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

			  </view>

			  <view class="shipin_2" style="">
				  <!-- 热卖 特卖 -->
				  <!-- <view class="jiangbei" @click="goRankingList"
					  :style="{backgroundImage: 'url(https://images.eqingqu.com/attachs/photo/202507/20250709_C6ACF45FA755B6AED201B1FD10FC5ADF.png)'}">
				  </view> -->

				  <view class="jiangbei" :style="{ justifyContent: temaiImgurl ? 'space-evenly' : 'center' }">
					  <!-- 热卖模块：动态背景图 + 动态宽度 -->
					  <view class="hotSell" @click="goRankingList" :style="{ 
							backgroundImage: `url(${hotImgurl})`,
							width: temaiImgurl ? '160rpx' : '100%'  
						  }">
					  </view>

					  <!-- 特卖模块：条件显示 + 动态背景图 -->
					  <view class="speicalSell" @click="goSpeicalSell" v-if="temaiImgurl"
						  :style="{ backgroundImage: `url(${temaiImgurl})` }">
					  </view>
				  </view>


				  <view style="display: flex;flex-direction: column;" class="shipin_2-label">
					  <view class="eightTop">
						  <view class="shipin_2-left" style="text-align: center;width: 50%;"
							  @click="linkHrefSearch(3)">
							  <view>
								  <view class="shititle1">一件代发</view>
								  <image :src="hotListOne && hotListOne.goods_thumb"
									  style="width: 140rpx;height: 140rpx;margin-top: 8rpx;  margin;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
									  v-if="hotListOne && hotListOne.goods_thumb"></image>
								  <image
									  src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
									  class="image" v-else
									  style="max-width: 146rpx;margin-top: 8rpx;max-height: 146rpx;"></image>
							  </view>
							  <view>
								  <!-- ￥
								  <span v-if="hotListOne.shop_price">{{hotListOne.shop_price}} </span> -->
								  <!-- {{hotListOne.shop_price}} -->
								  <text class="shipin-text">全国包邮</text>
							  </view>
						  </view>
						  <view class="shipin_2-right" style="text-align: left;width: 50%;"
							  @click="linkHrefSearch(4)">
							  <view>
								  <view class="shititle2">严选</view>
								  <image :src="hotListTwo && hotListTwo.goods_thumb"
									  style="width: 140rpx;height: 140rpx;margin-top: 8rpx;border-radius: 10rpx;max-width: 146rpx;max-height: 146rpx;"
									  v-if="hotListTwo && hotListTwo.goods_thumb"></image>
								  <image
									  src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg"
									  class="image" v-else
									  style="max-width: 146rpx;margin-top: 8rpx;max-height: 146rpx;"></image>
							  </view>
							  <view class="newPrices">
								  <text class="newPrice-currency">￥</text>
								  <text v-if="hotListTwo && hotListTwo.shop_price" class="newPrice-num">{{ hotListTwo.shop_price }}</text>
							  </view>
						  </view>

					  </view>

					  <view class="eightJin"  v-if="shouldShowEightJin" :class="{ 'fade-out': isClosing }">
						  <!-- <view class="eightJin"  v-if="shouldShowEightJin" :class="{ 'fade-out': isClosing }"> -->
						  <text>未满18岁禁止下载使用</text>
						  <image @click="eightClose" src="/pagesC/static/whiteClose.png" class="imgEight"></image>
					  </view>
				  </view>
			  </view>

		  </view>


<!-- 调试区域 - 只在开发环境显示 -->
<!--   <view v-if="isDebug" class="debug-center-region">
		<view class="debug-center-line"></view>
		<view class="debug-observe-area"></view>
		<view class="debug-center-text">中心区域 - 仅在此切换GIF</view>
		<view class="debug-threshold-area"></view>
	  </view> -->
		  <!-- 1 -->
		  <view class="container product-new">
			  <view class="waterfall-wrapper">
				  <!-- 左列（包含占位） -->
				  <x-skeleton type="waterfall" :loading="loading" :configs="waterfallConfigs">
					  <view class="column left-col">
							  <view v-for="(item, index) in leftList" :key="item.goods_id || index" class="waterfall-item"
									:style="{height: item.height + 'px'}">
								<view style="position: relative;">
								  <view>
									<view class="img-box" style="height: min-height: 360rpx;"
										  @click="linkHref(item.seckill_id,item.goods_id)">
									  
									  <!-- GIF容器 -->
									  <!-- 在GIF容器中添加增强的状态指示 -->
									  <view v-if="item.hasVideo" class="gif-container" :id="'gif-'+item.goods_id">
										<!-- 封面图容器 -->
										<view class="cover-content" :class="{'cover-hidden': !showCover[item.goods_id]}">
										  <image class="cover-image" :src="item.goods_video_cover" mode="aspectFill" :lazy-load="true"></image>
										  
										  <!-- 增强的状态指示 -->
										<!--  <view v-if="isDebug" 
												class="gif-status-indicator"
												:class="{
												  'playing': !showCover[item.goods_id],
												  'center': showingGif === item.goods_id
												}">
											{{ showCover[item.goods_id] ? '📷封面' : '🎬GIF播放' }}
											<text v-if="showingGif === item.goods_id"> ⭐中心</text>
										  </view> -->
										</view>
										
										<!-- GIF容器 -->
										<view class="gif-content" v-if="!showCover[item.goods_id]">
										  <image class="goods-gif" :src="item.goods_video_gif" mode="aspectFill" :lazy-load="true"></image>
										</view>
									  </view>
					  
									  <image v-else class="img" :src="item.goods_thumb" mode="widthFix" :lazy-load="true"></image>
					  
									 <!-- <view class="goods-label-suspension"
											v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									  </view> -->
									</view>
										  <view class="info-box" @click="linkHref(item.seckill_id,item.goods_id)">
										  <view class="goods-name twolist-hidden  title-font" style="font-size:14px;"
											  @longpress="copyTitle(item.title,item.goods_name)"
											  >
											  <!-- 热榜 -->
											  <view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
												  <view class="top-text">
													  <image src="/pagesC/static/fly_left@2x.png"></image>
													  <text>TOP{{item.cat_rank_info_cat_top}}</text>
													  <image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
												  </view>
											  </view>
											  <!-- 好卖严选 -->
											  <text class="easy_choose"
												  v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											  <!-- 新品 -->
											  <text class="is-new-goods"
												  v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>

											  <text class="goods-name-text">{{item.goods_name}}</text>
										  </view>

										  <!-- 商品名称下面的优惠券 > 首单减N元 > 平台最低价 > 热榜 显示 -->
										  <view class="promo-tags-container">
											  <!-- 优惠券 -->
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

										  <view class="num-line">
											  <currency-price class="left-num" :price="item.shop_price"
												  :size="20"></currency-price>
											  <!-- 运费、新人价、黑卡价 按顺序最多显示两个：运费 → 新人价 → 黑卡价 -->
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
												  v-if="item.is_free == 0">
												  运费{{item.start_shipping_fee}}元
											  </view>
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
												  v-if="item.new_member_price == 1">
												  新人价
											  </view>
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #4D4B4B;"
												  v-if="item.is_membership_card_discount_price && (item.is_free != 0 || item.new_member_price != 1)">
												  {{item.is_membership_card_discount_price}}
											  </view>

										  </view>
										  <!-- 标签 -->
										  <goods-service-label :tags="item.goods_services_label_new" :max-display="3"
											  v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />

										  <text
											  class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>

										  <view class="label-list"
											  v-if="item.goods_label && item.goods_label.length > 0">
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
				  </x-skeleton>
				  <!-- 右列（包含占位） -->
				  <!-- <view class="column right-col" :style="shipinStyle" > -->
				  <x-skeleton type="waterfall" :loading="loading" :configs="waterfallConfigs"
					  :style="{'margin-top': heightDifference + 'px'}">
					  <!-- <view class="column right-col" :style="{'margin-top': heightDifference + 'px'}"> -->
					  <view class="column right-col">
							  <view class="right-placeholder right"></view>
							  <view v-for="(item, index) in rightList" :key="item.goods_id || index" class="waterfall-item"
									:style="{height: item.height + 'px'}">
								<view style="position: relative;">
								  <view>
									<view class="img-box" style="height: min-height: 360rpx;"
										  @click="linkHref(item.seckill_id,item.goods_id)">
					  
									  <!-- GIF容器 -->
									  <!-- 在GIF容器中添加增强的状态指示 -->
									  <view v-if="item.hasVideo" class="gif-container" :id="'gif-'+item.goods_id">
										<!-- 封面图容器 -->
										<view class="cover-content" :class="{'cover-hidden': !showCover[item.goods_id]}">
										  <image class="cover-image" :src="item.goods_video_cover" mode="aspectFill" :lazy-load="true"></image>
										  
										  <!-- 增强的状态指示 -->
										<!--  <view v-if="isDebug" 
												class="gif-status-indicator"
												:class="{
												  'playing': !showCover[item.goods_id],
												  'center': showingGif === item.goods_id
												}">
											{{ showCover[item.goods_id] ? '📷封面' : '🎬GIF播放' }}
											<text v-if="showingGif === item.goods_id"> ⭐中心</text>
										  </view> -->
										</view>
										
										<!-- GIF容器 -->
										<view class="gif-content" v-if="!showCover[item.goods_id]">
										  <image class="goods-gif" :src="item.goods_video_gif" mode="aspectFill" :lazy-load="true"></image>
										</view>
									  </view>
					  
									  <image v-else class="img" :src="item.goods_thumb" mode="widthFix" :lazy-load="true"></image>
					  
									  <view class="goods-label-suspension"
											v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
										<image :src="item.goods_label_suspension.formated_label_image" class="img">
										</image>
									  </view>
									</view>
									  <view class="info-box" @click="linkHref(item.seckill_id,item.goods_id)">
										  <view class="goods-name twolist-hidden  title-font" style="font-size:14px;"
											  @longpress="copyTitle(item.title,item.goods_name)"
											  >
											  <!-- 热榜 -->
											  <view v-if="item.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
												  <view class="top-text">
													  <image src="/pagesC/static/fly_left@2x.png"></image>
													  <text>TOP{{item.cat_rank_info_cat_top}}</text>
													  <image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
												  </view>
											  </view>
											  <!-- 好卖严选 -->
											  <text class="easy_choose"
												  v-else-if="item.is_best ==1">{{$t('lang.easy_choose')}}</text>
											  <!-- 新品 -->
											  <text class="is-new-goods"
												  v-else-if="item.is_new ==1">{{$t('lang.new')}}</text>

											  <text class="goods-name-text">{{item.goods_name}}</text>
										  </view>

										  <!-- 商品名称下面的优惠券 > 首单减N元 > 平台最低价 > 热榜 显示 -->
										  <view class="promo-tags-container">
											  <!-- 优惠券 -->
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

										  <view class="num-line">
											  <currency-price class="left-num" :price="item.shop_price"
												  :size="20"></currency-price>
											  <!-- 运费、新人价、黑卡价 按顺序最多显示两个：运费 → 新人价 → 黑卡价 -->
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
												  v-if="item.is_free == 0">
												  运费{{item.start_shipping_fee}}元
											  </view>
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
												  v-if="item.new_member_price == 1">
												  新人价
											  </view>
											  <view
												  style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #4D4B4B;"
												  v-if="item.is_membership_card_discount_price && (item.is_free != 0 || item.new_member_price != 1)">
												  {{item.is_membership_card_discount_price}}
											  </view>
										  </view>
										  <goods-service-label :tags="item.goods_services_label_new" :max-display="3"
											  v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />


										  <view>
											  <text
												  class="yishou color_999">{{$t('lang.goods_soltout')}}{{ item.sales_volume }}{{$t('lang.jian')}}</text>
										  </view>


										  <view class="label-list"
											  v-if="item.goods_label && item.goods_label.length > 0">
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
				  </x-skeleton>
			  </view>

		  </view>
		  <!-- 2 -->



		  <view v-if="false" class="product-new" bindscroll="handleScroll">
			  <view class="goods-list" v-if="prolist">

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
								  <!-- 商品名称下面的优惠券 > 首单减N元 > 平台最低价 显示 -->
								  <!-- 优惠券 -->
								  <view v-if="item.cou_name && item.cou_name.length > 0"
									  style="display: flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
									  <image src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png" 
										  style="width: 28rpx; height: 24rpx; margin-right: 4rpx;"></image>
									  {{item.cou_name.join(' | ')}}
								  </view>
								  <!-- 首单减N元 -->
								  <view v-else-if="item.first_j_price && item.first_j_price !== ''"
									  style="display: flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
									  <image src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png" 
										  style="width: 22rpx; height: 24rpx; margin-right: 4rpx;"></image>
									  首单减{{item.first_j_price}}元
								  </view>
								  <!-- 平台最低价 -->
								  <view v-else-if="item.platm_min_price && item.platm_min_price !== ''"
									  style="display: flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
									  <image src="https://images.eqingqu.com/attachs/photo/202601/20260130_EAA591B0B9E61CCE6678AE8DAA41143D.png" 
										  style="width: 18rpx; height: 24rpx; margin-right: 4rpx;"></image>
									  {{item.platm_min_price}}
								  </view>
								  <goods-service-label :tags="item.goods_services_label_new" :max-display="3"
									  v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />


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
	  <!-- <dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top> -->
	  <uni-load-more style="margin-bottom: 150rpx;" :status="loadMoreStatus" :content-text="contentText"
		  v-if="page > 1 && showLoadMore" />
	  
	  
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
	  <!-- <uni-popup :show="receiveStutas" v-if="receiveStutas">
		  <view class="version-popup">
		  
			  <view class="receive-list">
				  <view class="item" v-for="(item,index) in receiveData" key='index'>
					  <view class="">
						  <tex>
							  {{item.cou_man}}
						  </tex>
						  <tex>
							  {{item.cou_money}}
						  </tex>
					  </view>
					  
				  </view>
			  </view>
		  
			  <view class="close"  @click="handelClose('receive')">
				  <image
					  src="/pagesC/static/search/cha.png"
					  mode="widthFix" class="img"></image>
			  </view>
			  <image src="https://images.eqingqu.com/attachs/photo/202508/20250828_A2E771EA2F9C1A9F9A2725090831C9E7.png" class="upgrade" mode="widthFix"></image>
			  
		  </view>
	  </uni-popup> -->
	  
	  
	  
	  
<!-- 		<uni-popup :show="receiveStutas" v-if="receiveStutas">
		  <view class="receive-popup">
			  <view class="receive-top">
				  <image
					  src="https://images.eqingqu.com/attachs/photo/202508/20250828_D0BE827D3C1463B5688DF871911EC237.png"
					  mode="widthFix"></image>
			  </view>

			  <view class="receive-list" >
				  <view class="receive-item" v-for="(item,index) in receiveData.slice(0, 3)" :key='index'>
					  <view class="coupon-content">
						  <text class="amount">¥{{item.cou_money}}</text>
						  <text class="condition">满{{item.cou_man}}可用</text>
					  </view>
				  </view>
				  <view class="list-bottom-bg"></view>
			  </view>


			  <view class="close" @click="handelClose('receive')">
				  <image src="/pagesC/static/search/cha.png" mode="widthFix" class="img"></image>
			  </view>
			  <view >
				  <image
					  src="https://images.eqingqu.com/attachs/photo/202508/20250828_C11BFC195C7B2C001A52811B586FCBF4.png"
					  class="upgrade" mode="widthFix"  @click="goNewPerson"></image>
			  </view>
			  
		  </view>
	  </uni-popup> -->
	  
	  
	  <uni-popup :show="receiveStutas" v-if="receiveStutas" wide @hidePopup="handelClose('receive')">
		 <view class="receive-popup">
			 <!-- 新人优惠活动（与店铺优惠券互斥：有新人数据只显新人） -->
			 <block v-if="receiveData.length > 0">
				 <view class="newuser-popup-wrap">
					 <view class="newuser-glow-ring"></view>
					 <view class="newuser-glow-ring newuser-glow-ring-2"></view>
					 <view class="newuser-glow-ring newuser-glow-ring-3"></view>
					 <view class="newuser-light-rays">
						 <view class="newuser-ray" v-for="i in 6" :key="'ray'+i"></view>
						</view>
					 <view class="newuser-popup-box">
						 <view class="newuser-popup-header">
							 <view class="newuser-shine-effect"></view>
							 <view class="newuser-coins">
								 <view class="newuser-coin" v-for="i in 6" :key="'coin'+i">¥</view>
								</view>
							 <text class="newuser-header-title">新人限时专享</text>
							 <text class="newuser-header-subtitle">现在下单锁定优惠</text>
							</view>
						 <view class="newuser-coupons-section">
							 <view class="newuser-coupons-grid">
								 <view class="newuser-coupon-card" v-for="(item, index) in receiveData.slice(0, 3)" :key="index">
									 <view class="newuser-coupon-badge">新人专享</view>
									 <view class="newuser-coupon-amount">
										 <text class="newuser-coupon-currency">¥</text>{{ item.cou_money }}<text class="newuser-coupon-unit">元</text>
						</view>
									 <view class="newuser-coupon-condition">满{{ item.cou_man }}可用</view>
									 <view class="newuser-coupon-btn" @click.stop="goNewPerson">立即领取</view>
					</view>
								</view>
							 <view class="newuser-timer-info">
								 <view class="newuser-countdown">
									 <text class="newuser-time-value">{{ formatTime(newUserMinutes) }}</text>
									 <text class="newuser-time-sep">:</text>
									 <text class="newuser-time-value">{{ formatTime(newUserSeconds) }}</text>
									 <text class="newuser-time-sep">:</text>
									 <text class="newuser-time-ms">{{ newUserCentisecondsStr }}</text>
							</view>
								 <text class="newuser-after-expire">后失效</text>
								</view>
							</view>
						 <view class="newuser-main-btn-wrap">
							 <view class="newuser-main-btn" @click="goNewPerson">立即领取</view>
						</view>
					</view>
					 <view class="newuser-close-btn" @click="handelClose('receive')">
						 <view class="newuser-close-btn-circle"></view>
						 <view class="newuser-close-btn-text">{{ newUserCloseCountdown }}s 后关闭</view>
						 <view class="newuser-close-icon">×</view>
			</view>
				 </view>
			 </block>
			 <!-- 店铺优惠券：仅当无新人数据、有店铺券数据且 coupons_show_type 为 1/2/3/4 时显示 -->
			 <block v-else-if="storeCouponData.length > 0 && showStoreCouponByType">
				 <!-- 红色波纹层：仅样式 2/3/4 显示；样式1 清新绿色用自身绿色环，不叠红色波纹避免出现红圈闪烁 -->
				 <view v-if="coupons_show_type !== '1'" class="store-coupon-ripple-bg">
					 <view class="store-coupon-ripple-ring"></view>
					 <view class="store-coupon-ripple-ring store-coupon-ripple-ring-2"></view>
					 <view class="store-coupon-ripple-ring store-coupon-ripple-ring-3"></view>
					 <view class="store-coupon-ripple-dot" v-for="i in 6" :key="'rd'+i"></view>
				 </view>
				 <!-- 样式1 清新绿色（仅绿色环，无红色波纹层） -->
				 <view v-if="coupons_show_type === '1'" class="store-coupon-s1-wrap" @click="goStoreCoupon">
					 <view class="store-coupon-s1-ring"></view>
					 <view class="store-coupon-s1-ring store-coupon-s1-ring-2"></view>
					 <view class="store-coupon-s1-ring store-coupon-s1-ring-3"></view>
					 <view class="store-coupon-s1-popup">
						 <view class="store-coupon-s1-header">
							 <text class="store-coupon-s1-title">{{ coupons_show_type_title }}</text>
							 <view class="store-coupon-s1-amount-wrap">
								 <text class="store-coupon-s1-currency">¥</text><text class="store-coupon-s1-amount">{{ totalStoreCouponAmount }}</text><text class="store-coupon-s1-unit">元</text>
							 </view>
							 <view class="store-coupon-s1-condition">满{{ totalStoreCouponMin }}元可用</view>
						 </view>
						 <view class="store-coupon-s1-white">
							 <view class="store-coupon-s1-timer">
								 <text class="store-coupon-s1-time">{{ formatTime(storeCouponMinutes) }}</text><text class="store-coupon-s1-sep">:</text>
								 <text class="store-coupon-s1-time">{{ formatTime(storeCouponSeconds) }}</text><text class="store-coupon-s1-sep">:</text>
								 <text class="store-coupon-s1-ms">{{ formatTime(storeCouponMilliseconds, true) }}</text>
							 </view>
							 <text class="store-coupon-s1-expire">后失效</text>
							 <view class="store-coupon-s1-btn">立即领取</view>
						 </view>
					 </view>
				 </view>
				 <!-- 样式2 限时抢购 -->
				 <view v-else-if="coupons_show_type === '2'" class="store-coupon-s2-wrap" @click="goStoreCoupon">
					 <view class="store-coupon-s2-ring"></view>
					 <view class="store-coupon-s2-ring store-coupon-s2-ring-2"></view>
					 <view class="store-coupon-s2-ring store-coupon-s2-ring-3"></view>
					 <view class="store-coupon-s2-popup">
						 <view class="store-coupon-s2-banner">
							 <text class="store-coupon-s2-title">{{ coupons_show_type_title }}</text>
							 <view class="store-coupon-s2-amount-wrap">
								 <text class="store-coupon-s2-currency">¥</text><text class="store-coupon-s2-amount">{{ totalStoreCouponAmount }}</text><text class="store-coupon-s2-unit">元</text>
							 </view>
						 </view>
						 <view class="store-coupon-s2-content">
							 <text class="store-coupon-s2-status">你有待领取红包</text>
							 <view class="store-coupon-s2-timer-box">
								 <text class="store-coupon-s2-timer-hint">距离失效还剩</text>
								 <view class="store-coupon-s2-timer">
									 <text class="store-coupon-s2-time">{{ formatTime(storeCouponMinutes) }}</text><text class="store-coupon-s2-sep">:</text>
									 <text class="store-coupon-s2-time">{{ formatTime(storeCouponSeconds) }}</text><text class="store-coupon-s2-sep">:</text>
									 <text class="store-coupon-s2-ms">{{ formatTime(storeCouponMilliseconds, true) }}</text>
								 </view>
								 <text class="store-coupon-s2-expire">后失效</text>
							 </view>
							 <view class="store-coupon-s2-btn">立即使用</view>
						 </view>
					 </view>
				 </view>
				 <!-- 样式3 节日气球 -->
				 <view v-else-if="coupons_show_type === '3'" class="store-coupon-s3-wrap" @click="goStoreCoupon">
					 <view class="store-coupon-s3-ring"></view>
					 <view class="store-coupon-s3-ring store-coupon-s3-ring-2"></view>
					 <view class="store-coupon-s3-ring store-coupon-s3-ring-3"></view>
					 <view class="store-coupon-s3-popup">
						 <view class="store-coupon-s3-balloons">
							 <view class="store-coupon-s3-balloon"></view>
							 <view class="store-coupon-s3-balloon"></view>
							 <view class="store-coupon-s3-balloon"></view>
						 </view>
						 <view class="store-coupon-s3-badge">趣好卖</view>
						 <view class="store-coupon-s3-header">
							 <text class="store-coupon-s3-event-title">{{ coupons_show_type_title }}</text>
							 <view class="store-coupon-s3-amount-wrap">
								 <text class="store-coupon-s3-currency">¥</text><text class="store-coupon-s3-amount">{{ totalStoreCouponAmount }}</text><text class="store-coupon-s3-unit">元</text>
							 </view>
						 </view>
						 <view class="store-coupon-s3-white">
							 <view class="store-coupon-s3-countdown-wrap">
								 <view class="store-coupon-s3-timer">
									 <text class="store-coupon-s3-time">{{ formatTime(storeCouponMinutes) }}</text><text class="store-coupon-s3-sep">:</text>
									 <text class="store-coupon-s3-time">{{ formatTime(storeCouponSeconds) }}</text><text class="store-coupon-s3-sep">:</text>
									 <text class="store-coupon-s3-ms">{{ formatTime(storeCouponMilliseconds, true) }}</text>
								 </view>
								 <text class="store-coupon-s3-expire">后失效</text>
							 </view>
							 <view class="store-coupon-s3-btn">立即领取</view>
						 </view>
					 </view>
				 </view>
				 <!-- 样式4 日常优惠（红包造型，对应 coupon-popup-1.html） -->
				 <view v-else class="store-coupon-s4-wrap" @click="goStoreCoupon">
					 <view class="store-coupon-s4-ring"></view>
					 <view class="store-coupon-s4-ring store-coupon-s4-ring-2"></view>
					 <view class="store-coupon-s4-ring store-coupon-s4-ring-3"></view>
					 <view class="store-coupon-s4-particles">
						 <view class="store-coupon-s4-particle" v-for="i in 6" :key="'p'+i"></view>
					 </view>
					 <view class="store-coupon-s4-popup">
						 <view class="store-coupon-s4-envelope">
							 <text class="store-coupon-s4-title">{{ coupons_show_type_title }}</text>
							 <view class="store-coupon-s4-amount-wrap">
								 <text class="store-coupon-s4-currency">¥</text><text class="store-coupon-s4-amount">{{ totalStoreCouponAmount }}</text><text class="store-coupon-s4-unit">元</text>
							 </view>
							 <text class="store-coupon-s4-condition">满{{ totalStoreCouponMin }}元可用</text>
						 </view>
						 <view class="store-coupon-s4-white">
							 <text class="store-coupon-s4-message">领取后立即使用</text>
							 <view class="store-coupon-s4-timer-wrap">
								 <view class="store-coupon-s4-timer">
									 <text class="store-coupon-s4-time">{{ formatTime(storeCouponMinutes) }}</text><text class="store-coupon-s4-sep">:</text>
									 <text class="store-coupon-s4-time">{{ formatTime(storeCouponSeconds) }}</text><text class="store-coupon-s4-sep">:</text>
									 <text class="store-coupon-s4-ms">{{ formatTime(storeCouponMilliseconds, true) }}</text>
								 </view>
								 <text class="store-coupon-s4-expire">后失效</text>
							 </view>
							 <view class="store-coupon-s4-btn">立即领取</view>
						 </view>
					 </view>
				 </view>
				 <view class="newuser-close-btn" @click="handelClose('receive')">
					 <view class="newuser-close-btn-circle"></view>
					 <view class="newuser-close-btn-text">{{ storeCouponCloseCountdown }}s 后关闭</view>
					 <view class="newuser-close-icon">×</view>
				 </view>
			 </block>
		 </view>
	  </uni-popup>


	  <uni-popup :show="customerShow" v-on:hidePopup="handelClose('customer')" v-if="customerShow">
		  <view class="version-popup">
			  <view class="close-on" @click="handelClose('customer')">
				  <image
					  src="https://images.eqingqu.com/attachs/photo/202404/20240416_53EB47F93542B07A5D951F4C4E187EA1.png"
					  mode="widthFix" class="img">
					  </image>
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

	  <!-- #ifdef APP-PLUS -->
	  <!-- 引导评价（仅 APP 显示） -->
	  <view class="" v-if="isShowEvaluate && !receiveStutas && !versionShow && !bonusShow && !customerShow && !mpShareShow">
		  <view class="cover" @click="popCloseEvaluate" catchtouchmove="true"></view>
		  <view class="wxshare11">
			  <view class="textc" style="position: absolute;bottom: 32rpx;left: 10%;">
				  <view class="flex-center">
					  <view class="wxshare_2_11 mb24">
						  <view style="margin: 48rpx 0 24rpx;" class="co1b fs40 fs600 pl16">求赞求鼓励！</view>
						  <view class="co82 fs32 flex-center ">您的鼓励是对我们最大的支持！</view>
					  </view>
				  </view>
				  <view class="flex-center flexdc">
					  <view class="add_box3_a11 " @click="goToAppStore">评分</view>
					  <view class="add_box3_1_a11" @click="popCloseEvaluate">下次再说</view>
				  </view>
			  </view>
		  </view>
	  </view>
	  <!-- #endif -->

	  <block v-if="controlVersion">
		  <service @flaghanlde="prentflaghanlde" v-if="shopConfig && shopConfig.consult.consult_set_state==1"
			  :shopConfig="shopConfig.consult"></service>
	  </block>

	  <block v-if="click_add">
		  <view class="add_new" :style="{'top':CustomBar + 10 +'px'}">
			  <view class="add_on">{{$t('lang.remind')}}<text @click="clickon">{{$t('lang.remind1')}}</text></view>
		  </view>
	  </block>
	  <!-- 	<uni-popups ref="search_all_categories" type="top" background-color="#fff" >
		  <view class="all_categories_label">
			  <view class="all_categories_label_top">
				  <text>全部分类</text>
			  </view>
			  <view class="all_categories_label_list" >
				  <view class="all_categories_label_tag" v-for="(tab,index) in search_keywords" :key="index">
					  <text class="all_categories_text">{{ tab }}</text>
				  </view>
			  </view>
		  </view>
	  </uni-popups> -->
	  <!-- SKU ????????????? -->



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
	  <!-- 小程序 / H5 仍然在页面层渲染红包条 -->
	  <!-- #ifndef APP-PLUS -->
	  <sys-coupon></sys-coupon>
	  <!-- #endif -->
	  <custom-tabbar />
	  <!-- <image-cropper ref="imagecropper" v-if="showOne" :src="imageSrc" :guessList='guessList' :sortImage='sortImage'></image-cropper> -->

</view>
</template>

<script>
  import {
	  mapState
  } from 'vuex'

  import { incrementVersion } from '@/utils/version.js';
  import permision from "@/common/permission.js"
  import uniIcons from '@/components/uni-icons/uni-icons.vue'
  import uniPopup from '@/components/uni-popup.vue'
  import service from "@/components/customer-service/customer-service.vue";
  import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
  import dscCountDown from '@/pagesD/components/visualization/count-down/Frontend.vue'
  // components/visualization/count-down/Frontend.vue
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

  /** 首页壳层（金刚区/热词/shipin 配置等）本地缓存有效期 */
  const HOME_SHELL_TTL_MS = 30 * 60 * 1000
  /** 首页瀑布流第一页 type_list 缓存有效期 */
  const HOME_LIST_TTL_MS = 5 * 60 * 1000
  /** 壳层过期后静默刷新节流，避免 onShow 频繁打满接口 */
  const HOME_SHELL_SILENT_INTERVAL_MS = 60 * 1000
  import createPageTrackMixin from '@/common/mixins/pageTrackMixin.js';
  import dscRegion from '@/components/dsc-region.vue';
  // #ifdef H5
  import isApp from '@/config/is-app.js'
  // #endif
  import ImageCropper from '@/pagesD/components/invinbg-image-cropper/invinbg-image-cropper.vue'
  import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue';
  import waterfall from '@/pagesD/components/waterfall.vue'
  const CONTENT_CONFIG = {
	  TITLE_LINE_HEIGHT: 24, // 从30减小到24 (rpx)
	  PRICE_HEIGHT: 12, // 从15减小到12 (rpx)
	  TAG_ROW_HEIGHT: 10, // 从12减小到10 (rpx)
	  ROW_GAP: 2, // 从4减小到2 (rpx)
	  BASE_PADDING: 8
  }
  export default {
	  mixins: [universal, createPageTrackMixin('home')],
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
		  ImageCropper,
		  CustomTabbar
	  },
	  data() {
		  return {
			   isDebug: false, // 开发时设为true，生产环境设为false
			  // 封面图显示状态 - 关键：true=显示封面图，false=隐藏封面图
			  showCover: {},
				// GIF相关数据
				  showingGif: null,
					 // 观察器相关
					 gifObserver: null,
					 centerLine: 0,
					 scrollTimer: null,
					 isScrolling: false,
					 intersectionTimers: {},
					 // 滚动触底检测节流
					 scrollCheckLastTime: 0,
					 scrollCheckThrottleMs: 120,
			  // 列表提前加载：距「理论底部」约 1.25 屏即请求下一页，减少滑到底再等接口的体感（pageSize 仍为 10）
			  loadMorePrefetchScreenRatio: 1.25,
			  // 静默预取下一页 type_list：接口慢时用户滑到底前数据已就绪（仍保持每页 10 条）
			  _goodsPrefetched: null,
			  // 同一页 type_list 仅允许一条在途请求（预取与触底共用，避免 page=4 连打两次）
			  _typeListInFlightPage: 0,
			  _lastGoodsListLoadedPage: 0,

			  // 顶部区域背景：'gradient'=上红下白渐变；图片URL=PNG/GIF，后续由后端返回
			  headerBgImage: 'gradient',
			  navKongCurrent: 0, // 金刚区轮播当前页
			  hotImgurl: '',
			  temaiImgurl: '',
			  receiveStutas: false,
			  receiveData: [],
			  storeCouponData: [], // 店铺优惠券数据
				coupons_show_type: '', // 普通优惠券弹窗样式：仅当后端返回 '1'/'2'/'3'/'4' 时显示对应样式，返回空则不显示
				coupons_show_type_title: '限时红包专享', // 普通优惠券弹窗标题，由后端配置
				couponSwiperIndex: 0, // 轮播当前索引
				userGoodsList: [],
			  totalMilliseconds: 10 * 60 * 1000, // 10分钟 = 600,000毫秒
				endTime: null, // 倒计时结束时间戳（用于精确计算毫秒）
				storeCouponLoaded: false, // 店铺优惠券是否已加载过
			  minutes: 10,
			  seconds: 0,
			  milliseconds: 0,
			  timer: null,
			  // 店铺优惠券倒计时
			  storeCouponTotalMilliseconds: 10 * 60 * 1000, // 10分钟
			  storeCouponMinutes: 10,
			  storeCouponSeconds: 0,
			  storeCouponMilliseconds: 0,
			  storeCouponTimer: null,
			  storeCouponCloseCountdown: 10, // 普通优惠券弹窗关闭倒计时（与新人一致展示）
			  storeCouponCloseTimer: null,
			  // 新人优惠弹窗：优惠倒计时 + 关闭倒计时
			  newUserTotalMilliseconds: 10 * 60 * 1000,
			  newUserMinutes: 10,
			  newUserSeconds: 0,
			  newUserCentiseconds: 0,
			  newUserCloseCountdown: 10,
			  newUserCloseTimer: null,
			  newUserCountdownTimer: null,
			  // receiveData: [
			  //       { cou_man: '10', cou_money: '10' },
			  //       { cou_man: '20', cou_money: '15' },
			  //       { cou_man: '30', cou_money: '20' },
			  //  { cou_man: '30', cou_money: '20' },
			  //   { cou_man: '30', cou_money: '20' },
			  // { cou_man: '30', cou_money: '20' },
			  //  { cou_man: '30', cou_money: '20' },
			  //     ],

			  // 1
			  actualHeights: {}, // 存储实际测量高度
			  heightAdjustment: 0.95, // 初始高度调整系数
			  leftList: [], // 左列数据
			  rightList: [], // 右列数据
			  leftHeight: 0, // 左列当前高度
			  rightHeight: 0, // 右列当前高度
			  placeholderHeight: 0, // 占位高度
			  heightDifference: 0,
			  loading: true, //骨架屏
			  waterfallConfigs: {
				  gridColumns: 1, //列数
				  headHeight: '400rpx', //head高度
				  textRows: 3, //文本的行数
				  headWidth: '340rpx',
				  headWidth: '344rpx',
				  padding: '6rpx',
			  },

			  // 2
			  isClosing: false,
			  eightjin: true,
			  allCategoriesType: false, //全部分类弹出框状态
			  bonusShow: false,
			  dscLoading: true,
			  curpage: '',
			  ru_id: 0,
			  shopId: 0,
			  versionShow: false,
			  mpShareShow: false,
			  customerShow: false,
			  // 评价弹窗相关
			  isShowEvaluate: false,
			  device_id: '',
			  model: '',
			  model_system: '',
			  app_version: '',
			  share_logo: '',
			  hasScrolled: false,
			  scrollThreshold: 300, // 滚动阈值，单位px
			  homeFirstPageLoadedForLogin: false, // 首页第一页数据是否已加载（用于滚动后跳转登录）
			  loginScrollThreshold: 200, // 未登录时，滚动超过此距离(px)后执行跳转登录
			  shouldShowEvaluate: false, // 接口返回是否需要显示评价弹窗
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
			  // 【修复】防止第一页数据重复加载的标志
			  isLoadingFirstPage: false,
			  /** 壳层静默刷新节流时间戳 */
			  lastShellSilentRefreshAt: 0,
			  /** 上次用于首页缓存的 user 后缀，用于检测换账号 */
			  _lastHomeCacheSuffix: null,
			  /** onLoad 时间戳：避免与首屏 /api/app/home 并发重复静默刷新 */
			  _homePageEnterAt: 0,
			  // 【性能优化】缓存屏幕高度，避免滚动时频繁调用同步API
			  cachedScreenHeight: 0,
			  // 【性能优化】GIF 观察器初始化防抖
			  gifObserverInitTimer: null,

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
			  pageSize: 10,
			  size: 10,
			  hasMore: true,
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
			  loadMoreStatus: 'more', // 初始状态为 'more'，表示可以加载更多
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
			  visualAdvSwiperCurrent: 0,
			  visualAdvBannerImgHeight: 300,
			  visualAdvHasGoods: false,
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
			  navOpacity: 0,
			  appHotId: '',
			  topVal: '',
			  navLabelTop: '',
			  // H5键盘检测相关
			  initialViewportHeight: 0,
			  isKeyboardVisible: false,
			  // APP 端状态栏占位高度（灵动岛等设备需动态计算）
			  statusBarHeight: 40,
			  // APP 端搜索区占位高度 rpx（随 statusBarHeight 动态调整，避免 tab-bar1 与 nav-label 重叠）
			  searchHeaderSpacerRpx: 254,
		  }
	  },
	  created() {
		  const that = this;

		  try {
			  // 获取菜单按钮和系统信息
			  // #ifdef MP-WEIXIN
			  that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			  uni.getSystemInfo({
				  success: res => {
					  that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res
						  .statusBarHeight) * 2;
				  }
			  });
			  // #endif

			  that.vh = uni.getSystemInfoSync().windowHeight / 2;
			  
			  // 【性能优化】缓存屏幕高度，避免滚动时频繁调用同步API
			  // screenHeight 在页面生命周期内不会改变，可以安全缓存
			  const systemInfo = uni.getSystemInfoSync();
			  that.cachedScreenHeight = systemInfo.screenHeight;
			  
			  // #ifdef APP-PLUS
			  // 动态状态栏高度：灵动岛等设备顶部安全区更大，固定 40px 会导致搜索框被遮挡
			  const sb = systemInfo.statusBarHeight || 40;
			  that.statusBarHeight = systemInfo.platform === 'ios' ? sb + 8 : sb;
			  // 占位高度随 statusBarHeight 变化，避免 tab-bar1 与 nav-label 重叠（254rpx 为 statusBarHeight=40 时的基准值）
			  const winW = systemInfo.windowWidth || 375;
			  const extraPx = Math.max(0, that.statusBarHeight - 40);
			  that.searchHeaderSpacerRpx = Math.ceil(254 + extraPx * 750 / winW);
			  // #endif

			  // 验证i18n是否可用
			  if (that.$i18n) {
				  try {
					  if (!that.controlVersion) {
						  // 先尝试获取翻译值，捕获可能的解析错误
						  const title = that.$t('lang.list');

						  uni.setNavigationBarTitle({
							  title
						  });
					  }
				  } catch (error) {
					  // 使用默认标题
					  uni.setNavigationBarTitle({
						  title: '商品列表'
					  });
				  }
			  } else {
				  uni.setNavigationBarTitle({
					  title: '商品列表'
				  });
			  }

			  // 其他代码...
		  } catch (error) {
		  }
	  },

		  mounted() {
		  this.startTimer();
		  this.startRotation();
		  // document.addEventListener('scroll', this.handleScroll, {
		  // 	passive: true
		  // });
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
		  
		  // #ifdef H5
		  // 防止键盘弹起时页面移动（仅移动端，使用 min-height 不影响滚动）
		  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		  
		  if (isMobile) {
			  // 记录初始视口高度
			  this.initialViewportHeight = window.innerHeight;
			  this.isKeyboardVisible = false;
			  
			  this.handleWindowResize = () => {
				  const currentHeight = window.innerHeight;
				  const heightDiff = this.initialViewportHeight - currentHeight;
				  const pageBody = document.querySelector('.uni-page-body');
				  
				  if (!pageBody) return;
				  
				  // 当高度减少超过150px时，认为是键盘弹起
				  if (heightDiff > 150 && !this.isKeyboardVisible) {
					  this.isKeyboardVisible = true;
					  // 使用 min-height 而不是 height，允许内容超出时正常滚动
					  pageBody.style.minHeight = currentHeight + 'px';
				  }
				  // 当高度恢复到接近初始值时，认为是键盘收起
				  else if (heightDiff < 50 && this.isKeyboardVisible) {
					  this.isKeyboardVisible = false;
					  // 移除 min-height，恢复自然高度
					  pageBody.style.minHeight = '';
				  }
			  };
			  
			  window.addEventListener('resize', this.handleWindowResize);
		  }
		  // #endif
		  
		  // 监听双击返回顶部事件
		  uni.$on('scroll-to-top', this.scrollToTop);

	  },
	  computed: {
		  // 仅当 coupons_show_type 为 '1'/'2'/'3'/'4' 时显示店铺优惠券弹窗，接口返回空则不显示
		  showStoreCouponByType() {
			  const t = this.coupons_show_type;
			  return t === '1' || t === '2' || t === '3' || t === '4';
		  },
		  // visual-adv 是否轮播：isStyleSel 0=轮播 1=分开，取第一个模块的配置
		  visualAdvIsCarousel() {
			  if (!this.visualdvAList || !this.visualdvAList.length) return false;
			  const first = this.visualdvAList[0];
			  const sel = first?.data?.isStyleSel ?? first?.data?.allValue?.isStyleSel;
			  return sel == '0' || sel === 0;
		  },
		  // 轮播高度：仅图片高度 + 有商品时才加商品区高度，避免无商品时空白
		  visualAdvSwiperHeightComputed() {
			  const goodsH = this.visualAdvHasGoods ? 260 : 0
			  return this.visualAdvBannerImgHeight + goodsH
		  },
		  // search position-fixed：H5 不加白底（避免盖 app-down），其他平台加 rgba(255,255,255,0.88)
		  searchHeaderStyle() {
			  // #ifdef H5
			  return {}; // H5 不加背景
			  // #endif
			  // #ifndef H5
			  if (!(this.headerBgImage === 'gradient' || this.headerBgImage)) {
				  return { 'background-color': '#F9F9F9', opacity: 1 };
			  }
			  const ratio = parseFloat(this.navOpacity) || 0;
			  const alpha = ratio >= 1 ? 0.88 : (ratio * 0.88).toFixed(2);
			  return { 'background-color': `rgba(255, 255, 255, ${alpha})`, opacity: 1 };
			  // #endif
		  },
		  // input_main 和 tab-bar1 背景。APP 上 search 已有背景，子元素透明避免叠加变纯白；H5 上 search 无背景，子元素需单独设置
		  searchInputStyle() {
			  // #ifdef APP-PLUS
			  return {}; // APP: search 已有 rgba，此处不再叠加
			  // #endif
			  // #ifndef APP-PLUS
			  const ratio = parseFloat(this.navOpacity) || 0;
			  if (!(this.headerBgImage === 'gradient' || this.headerBgImage)) {
				  return { 'background-color': '#FFF', opacity: 1 };
			  }
			  const alpha = ratio >= 1 ? 0.88 : (ratio * 0.88).toFixed(2);
			  return { 'background-color': `rgba(255, 255, 255, ${alpha})`, opacity: 1 };
			  // #endif
		  },
		  searchCategoriesStyle() {
			  // #ifdef APP-PLUS
			  return {}; // APP: search 已有 rgba，此处不再叠加
			  // #endif
			  // #ifndef APP-PLUS
			  const ratio = parseFloat(this.navOpacity) || 0;
			  if (!(this.headerBgImage === 'gradient' || this.headerBgImage)) {
				  return { 'background-color': '#ffffff', opacity: 1 };
			  }
			  const alpha = ratio >= 1 ? 0.88 : (ratio * 0.88).toFixed(2);
			  return { 'background-color': `rgba(255, 255, 255, ${alpha})`, opacity: 1 };
			  // #endif
		  },
		  // 金刚区轮播分页：每页10个，不足则有多少展示多少
		  navSwiperPages() {
			  const list = this.mergedData || [];
			  const pages = [];
			  for (let i = 0; i < list.length; i += 10) {
				  pages.push(list.slice(i, i + 10));
			  }
			  return pages.length ? pages : [[]];
		  },
		  shouldShowEightJin() {
			  // 判断是否是OPPO手机
			  // #ifdef APP-PLUS
			  const info = uni.getSystemInfoSync();
			  
			  // 【关键修复】更可靠的 OPPO 手机判断方式
			  // 同时检查 brand、manufacturer 和 model 字段，使用 includes 而不是严格相等
			  // 这样可以兼容不同 OPPO 机型可能返回的不同值
			  const brand = (info.brand || '').toUpperCase();
			  const manufacturer = (info.manufacturer || '').toUpperCase();
			  const model = (info.model || '').toUpperCase();
			  
			  const isOppo = brand.includes('OPPO') || 
			                 manufacturer.includes('OPPO') || 
			                 model.includes('OPPO') ||
			                 model.includes('FIND') || // OPPO Find 系列
			                 model.includes('RENO'); // OPPO Reno 系列
			  
			  return this.eightjin && isOppo;
			  // #endif

			  // 非APP平台不显示
			  return false;
		  },
		  // 轮播数据列表
		  couponSwiperList() {
			  const list = [];
			  if (this.receiveData.length > 0) {
				  list.push({ type: 'newUser', data: this.receiveData });
			  }
			  if (this.storeCouponData.length > 0) {
				  list.push({ type: 'store', data: this.storeCouponData });
			  }
			  return list;
		  },
		  // 店铺优惠券总金额
		  totalStoreCouponAmount() {
			  if (!this.storeCouponData || this.storeCouponData.length === 0) return 0;
			  return this.storeCouponData.reduce((total, item) => {
				  return total + parseFloat(item.cou_money || 0);
			  }, 0).toFixed(2);
		  },
		  // 店铺优惠券金额字号（根据总价动态调整）
		  storeCouponAmountFontSize() {
			  const amount = parseFloat(this.totalStoreCouponAmount) || 0;
			  if (amount >= 10000) {
				  return '90rpx';
			  } else if (amount >= 1000) {
				  return '110rpx';
			  } else {
				  return '140rpx'; // 默认字号
			  }
		  },
		  // 店铺优惠券最小满减金额
		  totalStoreCouponMin() {
			  if (!this.storeCouponData || this.storeCouponData.length === 0) return 0;
			  return Math.min(...this.storeCouponData.map(item => parseFloat(item.cou_man || 0)));
		  },
		  // 新人弹窗倒计时百分秒两位数
		  newUserCentisecondsStr() {
			  const n = this.newUserCentiseconds;
			  return n < 10 ? '0' + n : String(n);
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
		   if (this.gifObserver) {
				this.gifObserver.disconnect();
				this.gifObserver = null;
			  }
		  // 停止店铺优惠券倒计时
		  this.stopStoreCouponTimer();
		  // #ifdef H5
		  // 移除键盘事件监听
		  if (this.handleWindowResize) {
			  window.removeEventListener('resize', this.handleWindowResize);
			  // 清理样式
			  const pageBody = document.querySelector('.uni-page-body');
			  if (pageBody) {
				  pageBody.style.minHeight = '';
			  }
		  }
		  // #endif
		  // 移除双击返回顶部事件监听
		  uni.$off('scroll-to-top', this.scrollToTop);
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
		  // 初始化数据
		  this.videoContexts = {};
		  this.playingVideo = null;
		  this.showCover = {};
		  this._homePageEnterAt = Date.now()

		  // 通知TabBar当前路由
		  uni.$emit('route-change', '/pages/middles/middles');
		  var that = this
		  // 确保在数据加载完成后初始化视频观察器
			// this.getCenterLine();
			
		  let parent_id = e.parent_id;
		  let user_id = uni.getStorageSync('user_id');
		  // var abregionData = that.getRegionData;
		  // if (abregionData.regionSplic == '') {
		  // 	that.isshowregionsplic = true
		  // }


		  setTimeout(() => {
			  this.loading = false;
			  this.loading8 = false;

		  }, 2000);

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
				  
				  // 获取设备信息用于评价弹窗
				  that.device_id = res.deviceId || ''
				  console.log('【首页】device_id 已获取:', that.device_id)
				  // 传递完整的手机型号，如 "iPhone 17 Pro Max" 或安卓的完整型号
				  that.model = res.model || res.brand || ''
				  // 传递真实的系统版本，如 "26.2"、"17.0" 等
				  that.model_system = res.system || ''
				  // 获取APP版本号
				  // #ifdef APP-PLUS
				  that.app_version = res.appWgtVersion || res.appVersion || incrementVersion()
				  
				  // 获取设备信息后，调用检查接口（仅 APP 端）
				  if (that.device_id && that.model && that.app_version && that.model_system) {
					  that.checkCommentApp()
				  }
				  // #endif
				  // #ifndef APP-PLUS
				  that.app_version = res.appVersion || incrementVersion()
				  // #endif
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
		  that.newUserData();
		  that.newUserGoodsData();
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
		  const systemInfo = wx.getSystemInfoSync();
		  const screenWidth = systemInfo.screenWidth;
		  // 输入框高度54rpx转px
		  const inputHeightPx = 88 * (screenWidth / 750);
		  const navtHeightPx = 60 * (screenWidth / 750);
		  this.topVal = systemInfo.statusBarHeight + inputHeightPx;
		  this.navLabelTop = systemInfo.statusBarHeight + inputHeightPx + navtHeightPx;
	
		  // #endif
		  that.referer = uni.getStorageSync('platform').toLowerCase()
		  // if (uni.getStorageSync('platform') == 'MP-WEIXIN') {
		  // 	that.referer = 'wxapp'
		  // }
	
		  that._lastHomeCacheSuffix = that.getHomeCacheUserSuffix()
		  that.restoreHomeShellFromStorageIfNeeded()
		  that.restoreHomeListFromStorageIfEmpty()
		  // 必须在 onShow 之前置位：onShow 里也会在 page===1 且 prolist 有数据时调 getGoodsListWithCache(1)，
		  // 若仍 isLoadingFirstPage===false 会与下方 setTimeout 并发，触底条件 _last===page 易错乱导致首屏滑到底不翻页。
		  that.isLoadingFirstPage = true

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
				  that.onHomeApiSuccess(res)
			  },
			  fail: (err) => {
			  }
		  })
		  //首页数据
		  that.getNewGoodsList(1);
		  setTimeout(() => {
			  // that.getNewGoodsList(1);
			  // this.getoneList(1)
			  // this.gettwoList(2)
			  // }, 10)
			  // setTimeout(() => {
			  // 首屏必须用 getGoodsListWithCache：若 onLoad 前已从磁盘恢复了第一页，
			  // 再调 getGoodsList(1) 会把 _lastGoodsListLoadedPage 置 0 并重打第 1 页，与用户先滑动加载的第 2 页不同步，表现为重复第一页。
			  // isLoadingFirstPage 已在 restore 之后立即置 true，避免 onShow 抢先重复拉首屏。
			  that.getGoodsListWithCache(1);
			  // 热卖块接在新品接口之后追加到 newArray，避免并发顺序错乱

			  // that.getVideoList(1);
			  // that.getHome_list();
			  that.shopConfigHot();
					that.getIsShow();
		  }, 100)

		  // #ifdef H5
		  /*
			  true：微信浏览器
			  false：其他浏览器
		  * */
		  let target = navigator.userAgent.toLowerCase();
		  let isWeixin = /micromessenger/.test(target);
		
		  if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
			  if (isWeixin == true) {
				  var code = that.GetQueryString('code');
				
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
	  onUnload() {
		  // 移除事件监听（弹窗现在在消息页面和物流页面直接显示，不再在首页显示）
		  
		  // 彻底清理
		   if (this.gifObserver) {
				  this.gifObserver.disconnect();
				  this.gifObserver = null;
			  }
		  
		  // 停止店铺优惠券倒计时
		  this.stopStoreCouponTimer();

		  // 【性能优化】修复内存泄漏：清理所有定时器
		  if (this.scrollTimer) {
			  clearTimeout(this.scrollTimer);
		  }
		  if (this.timer) {
			  clearInterval(this.timer); // 【性能优化】清理倒计时定时器
			  this.timer = null;
		  }
		  if (this.gifObserverInitTimer) {
			  clearTimeout(this.gifObserverInitTimer); // 【性能优化】清理 GIF 观察器初始化定时器
			  this.gifObserverInitTimer = null;
		  }

		  // 暂停所有视频并显示封面图
		  Object.keys(this.videoContexts).forEach(goodsId => {
			  const context = this.videoContexts[goodsId];
			  if (context) {
				  try {
					  context.pause();
					  context.seek(0);
				  } catch (error) {
				  }
			  }
			  // 显示封面图
			  this.$set(this.showCover, goodsId, true);
		  });

		  this.videoContexts = {};
		  this.playingVideo = null;
		  this.showCover = {};
	  },
	  onShow() {
		  // 调试：打印 device_id 查看值
		  console.log('【首页】device_id:', this.device_id);
		  const suff = this.getHomeCacheUserSuffix()
		  if (this._lastHomeCacheSuffix != null && this._lastHomeCacheSuffix !== suff) {
			  this.restoreHomeShellFromStorageIfNeeded()
			  this._restoreHomeListCacheForUserSwitch()
		  }
		  this._lastHomeCacheSuffix = suff
		  this.silentRefreshHomeShellIfNeeded()
		  // 移除事件监听（弹窗现在在消息页面和物流页面直接显示，不再在首页显示）
		  
		  // 页面显示时，如果有播放中的视频，重新计算中心视频

		 // this.$nextTick(() => {
		 //    setTimeout(() => {
		 //      this.checkCenterGif();
		 //    }, 500);
		 //  });
// 强制重置滚动位置
  this.$nextTick(() => {
	const scrollView = this.$refs.scrollView;
	if (scrollView) {
	  scrollView.scrollTo({
		top: 0,
		duration: 0
	  });
	}
  });
  
  // 重新计算高度

		  // 确保TabBar状态更新
		  uni.$emit('route-change', '/pages/middles/middles');
		  uni.$emit('switch-tab');
		  // 通知 tabbar 更新状态
		  // uni.$emit('switch-tab');
		  // 获取shopConfig\
		  this.$store.dispatch('setShopConfig');
		  
		  // 【修复】每次显示页面时重新获取新人优惠券数据，确保登录后能显示新人专区
		  // 检查是否有token（已登录状态），才获取新人数据
		  const token = uni.getStorageSync('token');
		  if (token) {
			  // 只获取新人优惠券数据，不获取店铺优惠券（店铺优惠券只在应用启动时获取一次）
			  this.getNewUserCouponsOnly();
		  }
		  
		  // 每次显示页面时，使用缓存方式获取商品列表（仅第一页）
		  // 【修复】避免与 onLoad 重复加载：使用标志防止重复调用
		  if (this.page === 1 && !this.isLoadingFirstPage) {
			  // 如果 prolist 有数据，说明是页面切换回来，需要检查更新
			  if (this.prolist && this.prolist.length > 0) {
				  this.getGoodsListWithCache(1);
			  }
		  }
		  // 兜底：已登录但列表仍为空且未在首屏加载中（例如换账号后 Tab 未重建、onLoad 未再走一遍）
		  if (token && (!this.prolist || this.prolist.length === 0) && !this.isLoadingFirstPage) {
			  this.isLoadingFirstPage = true
			  this.getGoodsListWithCache(1)
		  }
		  this.shopConfig = uni.getStorageSync('configData')
		
		  // #ifdef H5
		  /*
			  true：微信浏览器
			  false：其他浏览器
		  * */
		  let target = navigator.userAgent.toLowerCase();
		  let isWeixin = /micromessenger/.test(target);
		
		  if (uni.getStorageSync('token') == '' || uni.getStorageSync('token') == undefined) {
			  if (isWeixin == true) {
				  var code = this.GetQueryString('code');
				 
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
					  this.handleToLogin(code);
				  }
			  }
		  }
		  // #endif

	  },
	  onHide() {
		  // 首页切到其他 Tab：GIF 改封面，减轻解码压力
		  const lists = [this.leftList, this.rightList]
		  lists.forEach(list => {
			  if (!Array.isArray(list)) return
			  list.forEach(item => {
				  if (item && item.hasVideo && item.goods_id) {
					  this.$set(this.showCover, item.goods_id, true)
				  }
			  })
		  })
		  // 暂停当前播放视频
		  if (this.playingVideo) {
			  this.pauseAndShowCover(this.playingVideo)
		  }
	  },
	  onPullDownRefresh() {
		  var that = this
		  
		  // 重置分页
		  that.page = 1
		  that.prolist = []
		  that.leftList = []
		  that.rightList = []
		  that.leftHeight = 0
		  that.rightHeight = 0
		  
		  // 清除缓存，强制刷新（列表 + 壳层，按当前用户 key）
		  that._removeHomeListCacheAll()
		  that._removeHomeShellCache()
		  that._goodsPrefetched = null
		  that._typeListInFlightPage = 0
		  that._lastGoodsListLoadedPage = 0
		  
		  // 重新加载所有数据
		  that.initData()
		  
		  // 重新加载商品列表（不使用缓存）
		  setTimeout(() => {
			  that.getNewGoodsList(1)
			  that.getGoodsList(1) // 直接调用getGoodsList，不使用缓存（热卖由 getNewGoodsList 成功后链式拉取）
			  that.shopConfigHot()
			  that.getIsShow()
			  
			  // 停止下拉刷新动画
			  uni.stopPullDownRefresh()
			  uni.hideLoading()
		  }, 100)
	  },
	  onPageScroll(e) {
		  // 使用防抖减少检测频率
			// 清除之前的计时器
			  clearTimeout(this.scrollTimer);
			  this.isScrolling = true;
			  
			 
		   // this.checkCenterGif();
		   
			  // 滚动结束后更新状态
			   // this.scrollTimer = setTimeout(() => {
			   //     this.isScrolling = false;
			   //     // 滚动结束后再检测一次，确保状态正确
			   //     this.checkCenterGif();
			   // }, 150);
		  // this.onPageScroll(e);
		  // 调用滚动处理
		  // 
		  // 【美团式】滚动时背景逐渐变白：scrollTop 约 0~200px 内从 0 过渡到 1
		  const maxScroll = 200;
		  const ratio = Math.min(1, e.scrollTop / maxScroll);
		  this.navOpacity = Number(ratio.toFixed(2));

		  var that = this
		  that.scrollState = e.scrollTop > 800 ? true : false
		  
		  // #ifndef MP-WEIXIN
		  // 首页未登录跳转：数据加载完成 + 用户滚动一定距离后执行（仅 APP/H5，小程序不执行）
		  if (e.scrollTop >= that.loginScrollThreshold &&
			  !uni.getStorageSync('token') &&
			  getApp().globalData.autoPromptLoginOnHome &&
			  that.homeFirstPageLoadedForLogin) {
			  getApp().globalData.autoPromptLoginOnHome = false;
			  uni.navigateTo({ url: '/pagesB/login/login?delta=1' });
		  }
		  // #endif
		  
		  // 评价弹窗：检测滚动距离，满足条件时显示弹窗
		  if (!that.hasScrolled && e.scrollTop >= that.scrollThreshold) {
			  that.hasScrolled = true
			  // 如果接口返回需要显示，且其他弹窗都未显示，则显示评价弹窗
			  if (that.shouldShowEvaluate && 
				  !that.receiveStutas && 
				  !that.versionShow && 
				  !that.bonusShow && 
				  !that.customerShow && 
				  !that.mpShareShow) {
				  that.isShowEvaluate = true
				  console.log('评价弹窗：滚动距离达到阈值，显示评价弹窗')
			  }
		  }
		  // 触底检测节流，减少 createSelectorQuery 调用频率
		  const screenHeight = that.cachedScreenHeight || (uni.getSystemInfoSync().screenHeight)
		  const prefetchAhead = Math.max(80, Math.round(screenHeight * (that.loadMorePrefetchScreenRatio || 1.25)))
		  let to_scroll_top = e.scrollTop + prefetchAhead
		  const now = Date.now()
		  if (!that.scrollCheckLastTime || now - that.scrollCheckLastTime >= that.scrollCheckThrottleMs) {
			  that.scrollCheckLastTime = now
			  uni.createSelectorQuery().in(that).select('.product-new').boundingClientRect((res) => {
			  // 【性能优化】使用缓存的屏幕高度，避免每次滚动都调用同步API
			  // 如果缓存未初始化（理论上不会发生），则回退到同步API调用
				  if (!res) return
			  let t_height = res.height - screenHeight

			  if (t_height <= to_scroll_top) {
				  // 防止重复加载
				  if (that.loadMoreStatus === 'loading' || that.loadMoreStatus === 'noMore') {
						  return;
					  }
					  if (!that.hasMore) {
					  return;
				  }
				  
				  // 只有当前页已在服务端落地（与 page 同步）时才加载下一页，避免冷启动磁盘恢复后
				  // _lastGoodsListLoadedPage 与 page 不一致时误把第 1 页再打一遍
					  if (that.prolist.length >= that.page * that.pageSize &&
						  that._lastGoodsListLoadedPage === that.page) {
					  that.loadMoreStatus = 'loading';
					  that.page++
					  that.getGoodsList()
				  }
			  }
		  }).exec()
		  }
	  },
	  onReachBottom() {
		  var that = this

		  // ??????
		  if (that.loadMoreStatus === 'loading' || that.loadMoreStatus === 'noMore') {
			  return;
		  }
		  if (!that.hasMore) {
			  return;
		  }
		  
		  // 与 onPageScroll 一致：当前页未提交完成前不翻页，避免重复请求第 1 页
		  if (that.prolist.length >= that.page * that.pageSize &&
			  that._lastGoodsListLoadedPage === that.page) {
			  that.loadMoreStatus = 'loading';
			  that.page++
			  that.getGoodsList()
		  }
	  },
	  methods: {
		  // 滚动到顶部方法（用于双击TabBar返回顶部）
		  scrollToTop() {
			  uni.pageScrollTo({
				  scrollTop: 0,
				  duration: 100,
				  success: () => {
				  },
				  fail: (err) => {
				  }
			  });
		  },
		  
		  // 初始化GIF自动显示
			initGifObserver() {
			  // 【性能优化】使用防抖，延迟 500ms 初始化，避免频繁重新初始化
			  if (this.gifObserverInitTimer) {
				  clearTimeout(this.gifObserverInitTimer);
			  }
		
			  this.gifObserverInitTimer = setTimeout(() => {
			  if (this.gifObserver) {
				this.gifObserver.disconnect();
				this.gifObserver = null;
			  }
		  
			  // 简单配置：只观察中心区域
			  this.gifObserver = uni.createIntersectionObserver(this, {
				thresholds: [0.5],
				observeAll: true
			  });
		  
			  // 观察屏幕中央50%区域
			  this.gifObserver
				.relativeToViewport({
				  top: -150,
				  bottom: -150
				})
				.observe('.gif-container', (res) => {
				  const goodsId = res.id ? res.id.replace('gif-', '') : null;
				  if (!goodsId) return;
		  
				  // 简单逻辑：进入中心就显示，离开就隐藏
				  if (res.intersectionRatio >= 0.5) {
					this.showGif(goodsId);
				  } else {
					this.hideGif(goodsId);
				  }
				});
			  }, 500); // 【性能优化】延迟 500ms 初始化
			},

		  
	  
		  hideGif(goodsId) {
			if (!goodsId || this.showingGif !== goodsId) return;
			
		
			this.$set(this.showCover, goodsId, true);
			
			this.showingGif = null;
		  },
		  
		  
		  
		  
	  
		  // 显示GIF
			showGif(goodsId) {
			  if (!goodsId || this.showingGif === goodsId) return;
			  
		
			  
			  // 隐藏当前GIF
			  if (this.showingGif) {
				this.$set(this.showCover, this.showingGif, true);
			  }
			  
			  // 显示新GIF
			  this.$set(this.showCover, goodsId, false);
			  this.showingGif = goodsId;
			},

		  // 显示封面图
		  showCoverImage(goodsId) {
			if (!goodsId) return;
		  
	
			this.$set(this.showCover, goodsId, true);
		  },
		  
		  
	  // end
	  

  









  


		  onNavKongSwiperChange(e) {
			  // #ifdef MP-WEIXIN
			  // 【小程序兼容】change 在快速连滑时会多次触发，且与 :current 形成反向驱动；
			  // 这里统一忽略 change 的回写，真正落位交给 animationfinish 做一次
			  return
			  // #endif
			  // #ifndef MP-WEIXIN
			  this.navKongCurrent = e.detail.current;
			  // #endif
		  },
		  // #ifdef MP-WEIXIN
		  onNavKongAnimationFinish(e) {
			  // 【小程序兼容】动画真正结束时才回写 current，一次手势一次 setData，
			  // 杜绝微信 swiper 在快速连滑时因中间态回写导致的来回自切换
			  const next = e && e.detail ? e.detail.current : 0
			  if (this.navKongCurrent !== next) {
				  this.navKongCurrent = next
			  }
		  },
		  // #endif
		  startTimer() {
			  // 初始化结束时间戳（10分钟后）
			  if (!this.endTime) {
				  this.endTime = Date.now() + this.totalMilliseconds;
			  }
			  
			  // 【性能优化】定时器频率从 100ms 优化为 100ms（保持毫秒精度）
			  // 设置定时器，每100毫秒更新一次，确保毫秒数能正确变化
			  this.timer = setInterval(() => {
				  const now = Date.now();
				  const remaining = this.endTime - now;
				  
				  if (remaining > 0) {
					  this.totalMilliseconds = remaining;
					  this.updateTime();
				  } else {
					  // 倒计时结束，重置为10分钟
					  this.totalMilliseconds = 10 * 60 * 1000;
					  this.endTime = Date.now() + this.totalMilliseconds;
					  this.updateTime();
				  }
			  }, 100); // 每100ms更新一次，确保毫秒数能正确变化
		  },
		  updateTime() {
			  // 计算分钟、秒和毫秒（基于实际剩余时间）
			  this.minutes = Math.floor(this.totalMilliseconds / 60000);
			  this.seconds = Math.floor((this.totalMilliseconds % 60000) / 1000);
			  // 毫秒只显示一位数字（0-9），每100ms变化一次
			  this.milliseconds = Math.floor((this.totalMilliseconds % 1000) / 100);
		  },
		  formatTime(time, isMillisecond = false) {
			  // 格式化时间
			  const n = Number(time);
			  const num = isNaN(n) ? 0 : n;
			  if (isMillisecond) {
				  // 毫秒/十分秒也显示两位（01、09 等）
				  return String(num).padStart(2, '0');
			  }
			  // 分钟和秒始终显示两位（09、59 等）
			  return String(num).padStart(2, '0');
		  },

		  // start

		  // 排行榜
		  goRankingList() {
			
			  uni.navigateTo({
				  url: '/pagesC/rankingList/rankingListIndex?hot_id=' + this.appHotId
			  })
		  },

		  goSpeicalSell() {
			
			  uni.navigateTo({
				  url: '/pagesC/specialSale/specialSale'

			  })
		  },
		  // end


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
			  return Array.isArray(item.goods_services_label_new) ?
				  item.goods_services_label_new : []
		  },

		  // 标签有效性验证
		  isValidLabel(tag) {
			  if (!tag || typeof tag !== 'object') return false

			  // 必要属性检查
			  if (typeof tag.value === 'undefined' || !tag.name) return false

			  // 有效标签映射表（移除首单减N元和平台最低价，这两个在优惠券行显示）
			  const validMap = {
				  0: ['包邮', '一件包邮'],
				  1: ['退货包运费'],
				  2: ['先用后付', '24小时发货'],
				  3: ['回头率'], // 支持 '回头率' 开头的匹配，如 '回头率100%'
				  4: ['积分可抵'],
				  5: ['会员价'],
				  8: ['一件代发'],
			  }

			  const validNames = validMap[tag.value];
			  if (!validNames) return false;
			  
			  // 对于 value: 3 (回头率)，支持 '回头率' 开头的匹配
			  if (tag.value === 3) {
				  return validNames.some(name => tag.name.startsWith(name));
			  }
			  
			  return validNames.includes(tag.name);
		  },

		  // 严格优先级排序（移除首单减N元和平台最低价）
		  sortLabels(a, b) {
			  // 原版顺序（已注释）
			  // const priorityMap = Object.freeze({
			  //   '退货包运费': 1,
			  //   '一件包邮': 2,
			  //   '包邮': 3,
			  //   '会员价': 4,
			  //   '先用后付': 5,
			  //   '24小时发货': 6,
			  //   '回头率': 7,
			  //   '积分可抵': 8
			  // })
			  const priorityMap = Object.freeze({
				  '退货包运费': 1,
				  '包邮': 2,
				  '回头率': 3,
				  '积分可抵': 4,
				  '先用后付': 5,
				  '24小时发货': 6,
				  '一件代发': 7
			  })

			  const getScore = item =>
				  priorityMap[item.name] || Number.MAX_SAFE_INTEGER

			  return getScore(a) - getScore(b)
		  },
		  eightClose() {
			  this.isClosing = true;
			  setTimeout(() => {
				  this.eightjin = false;
				  // 动画完成后重新计算高度差
				  this.$nextTick(() => {
					  setTimeout(() => {
						  this.calculateHeightDifference();
					  }, 50); // 动画完成后延迟 50ms 再计算
				  });
			  }, 300);
		  },
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
							  .exec((resArr) => {
								  // 确保返回有效的高度值
								  const height = resArr && resArr[0] && typeof resArr[0].height === 'number' ? resArr[0].height : 0;
								  res(height);
							  })
					  }),
					  new Promise((res) => {
						  query2.select('.shipin_2')
							  .boundingClientRect()
							  .exec((resArr) => {
								  // 确保返回有效的高度值
								  const height = resArr && resArr[0] && typeof resArr[0].height === 'number' ? resArr[0].height : 0;
								  res(height);
							  })
					  })
				  ]).then(([leftHeight, rightHeight]) => {
					  // 验证高度值的合理性，确保是有效数字
					  const validLeftHeight = typeof leftHeight === 'number' && leftHeight >= 0 ? leftHeight : 0;
					  const validRightHeight = typeof rightHeight === 'number' && rightHeight >= 0 ? rightHeight : 0;
					  resolve({
						  left: validLeftHeight,
						  right: validRightHeight
					  })
				  }).catch(err => {
					  reject({
						  left: 0,
						  right: 0
					  })
				  })
			  })
		  },
		  // 计算高度差并更新
		  calculateHeightDifference() {
			  this.getPlaceholderHeight()
				  .then(heights => {
					  this.leftHeight = heights.left
					  this.rightHeight = heights.right
					  
					  // 根据平台计算合适的间距值
					  // boundingClientRect 返回的是 px，但不同平台的 px 显示效果不同
					  let spacing = 10; // 默认 10px
					  
					  // #ifdef H5
					  // H5 平台间距需要稍大一些
					  spacing = 15;
					  // #endif
					  
					  // #ifdef APP-PLUS
					  // iOS/Android 平台间距需要更小一些
					  const systemInfo = uni.getSystemInfoSync();
					  if (systemInfo.platform === 'ios') {
						  spacing = 0; // iOS 使用 0px 间距
					  } else if (systemInfo.platform === 'android') {
						  spacing = 0; // Android 使用 0px 间距
					  }
					  // #endif
					  
					  // #ifdef MP-WEIXIN
					  // 小程序平台使用默认间距
					  spacing = 0;
					  // #endif
					  
					  // 计算高度差：让右侧列从 .shipin_2 底部 + spacing 间距开始
					  // 公式：heightDifference = rightHeight - leftHeight + spacing
					  // 这样右侧列会向下偏移，从正确位置开始，与 .shipin_2 保持 spacing 间距
					  // 当 eightJin 显示时，rightHeight 会增加，计算会自动调整
					  const rawDifference = heights.right - heights.left + spacing;
					  this.heightDifference = rawDifference; // 允许负值，因为可能是向上偏移
				  })
				  .catch(error => {
					  // 失败时使用默认值
					  this.leftHeight = 0
					  this.rightHeight = 0
					  this.heightDifference = 0
				  });
		  },
		  // 计算有效字符数 (中文算1，英文算0.6)
		  calculateEffectiveChars(str) {
			  const chinese = str.match(/[\u4e00-\u9fa5]/g) || [];
			  const other = str.length - chinese.length;
			  return chinese.length * 1 + other * 0.6;
		  },


		  // 智能分配元素
		  async distributeItems(items) {
			  // 【性能优化】大数据量时使用分批处理，避免一次性处理导致阻塞
			  const BATCH_SIZE = 20; // 每批处理 20 条

			  if (items.length <= BATCH_SIZE) {
				  // 数据量小，直接处理
				  await this.distributeItemsBatch(items);
					  } else {
				  // 数据量大，分批处理
				  for (let i = 0; i < items.length; i += BATCH_SIZE) {
					  const batch = items.slice(i, i + BATCH_SIZE);
					  await this.distributeItemsBatch(batch);

					  // 使用 requestAnimationFrame 让浏览器有机会渲染
					  await new Promise(resolve => {
						  // #ifdef H5
						  requestAnimationFrame(resolve);
						  // #endif
						  // #ifndef H5
						  setTimeout(resolve, 16); // 约 60fps
						  // #endif
					  });
				  }
			  }

			  // 等待渲染完成后测量实际高度
			  await this.$nextTick();
			  this.measureActualHeights();
		  },
		  
		  // 分批处理的核心逻辑
		  async distributeItemsBatch(items) {
			  const tempLeftList = [];
			  const tempRightList = [];
			  let tempLeftHeight = this.leftHeight;
			  let tempRightHeight = this.rightHeight;

			  items.forEach(item => {
				  const itemHeight = this.calcItemHeight(item) * this.heightAdjustment;

				  if (tempLeftHeight <= tempRightHeight) {
					  tempLeftList.push({
						  ...item,
						  calcHeight: itemHeight
					  });
					  tempLeftHeight += itemHeight;
				  } else {
					  tempRightList.push({
						  ...item,
						  calcHeight: itemHeight
					  });
					  tempRightHeight += itemHeight;
				  }
			  });

			  // 应用分配
			  this.leftList = [...this.leftList, ...tempLeftList];
			  this.rightList = [...this.rightList, ...tempRightList];

			  // 更新高度
			  this.leftHeight = tempLeftHeight;
			  this.rightHeight = tempRightHeight;
		  },
		  measureActualHeights() {
			  // 【性能优化】只测量最新加载的 items（最后 20 条），避免大数据量时性能问题
			  const query = uni.createSelectorQuery().in(this);
			  const items = [...this.leftList, ...this.rightList];

			  // 只测量最后 20 条数据，减少查询次数
			  const itemsToMeasure = items.slice(-20);
			  const startIndex = Math.max(0, items.length - 20);

			  itemsToMeasure.forEach((item, relativeIndex) => {
				  const actualIndex = startIndex + relativeIndex;
				  query.select(`#item-${actualIndex}`).boundingClientRect(res => {
					  if (res) {
						  const actualHeight = res.height;
						  const calcHeight = item.calcHeight;
						  const ratio = actualHeight / (calcHeight / this.heightAdjustment);

						  // 更新调整系数 (平滑过渡)
						  this.heightAdjustment = this.heightAdjustment * 0.9 + ratio * 0.1;

						  // 存储实际高度供下次参考
						  this.actualHeights[item.id] = actualHeight;
					  }
				  }).exec();
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
			  // 固定图片高度保持不变
			  const imageHeight = 170; // rpx

			  // 动态计算内容高度
			  let contentHeight = 0;
			  let rowCount = 0;

			  // 1. 标题区域 (最多2行)
			  if (item.goods_name) {
				  const charCount = this.calculateEffectiveChars(item.goods_name);
				  const titleLines = Math.ceil(charCount / 12); // 每行约12个有效字符
				  contentHeight += Math.min(titleLines, 2) * CONTENT_CONFIG.TITLE_LINE_HEIGHT;
				  rowCount += Math.min(titleLines, 2);
			  }

			  // 2. 价格和销量区域 (合并为1行)
			  if (item.shop_price || item.sales_volume) {
				  contentHeight += CONTENT_CONFIG.PRICE_HEIGHT;
				  rowCount += 1;
			  }

			  // 标签区域（每行最多3个标签）
			  if (item.goods_services_label_new?.length) {
				  const tagRows = Math.ceil(item.goods_services_label_new.length / 3)
				  contentHeight += tagRows * CONTENT_CONFIG.TAG_ROW_HEIGHT
				  rowCount += tagRows
			  }
			  // 标签区域（每行20rpx）
			  // if (item.goods_services_label_new?.length) {
			  //   const tagRows = Math.ceil(item.goods_services_label_new.length / 3)
			  //   contentHeight += tagRows * 20
			  // }

			  // 18sui 
			  // if (this.eightjin ) {
			  // 	contentHeight += 33;
			  // }

			  // 基础内边距
			  contentHeight += CONTENT_CONFIG.BASE_PADDING;

			  return imageHeight + contentHeight;
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
		  applyShopConfigFromApi(data) {
			  if (!data) return
			  var that = this
			  console.log('shopConfigHot 接口数据 => ', {
				  app_cat_hot_rank_id: data.app_cat_hot_rank_id,
				  app_cat_hot_rank_imgurl: data.app_cat_hot_rank_imgurl,
				  app_temai_imgurl: data.app_temai_imgurl,
				  app_top_backgroup_img: data.app_top_backgroup_img,
				  search_keywords: data.search_keywords
			  })
			  that.appHotId = data.app_cat_hot_rank_id
			  that.temaiImgurl = data.app_temai_imgurl
			  that.hotImgurl = data.app_cat_hot_rank_imgurl
			  that.headerBgImage = (data.app_top_backgroup_img && data.app_top_backgroup_img.trim())
				  ? data.app_top_backgroup_img
				  : ''
			  const raw = data.coupons_show_type
			  that.coupons_show_type = (raw != null && String(raw).trim() !== '') ? String(raw).trim() : ''
			  that.coupons_show_type_title = (data.coupons_show_type_title && String(data.coupons_show_type_title).trim()) || '限时红包专享'
			  if (data.search_keywords) {
				  const newStr = '推荐, ' + data.search_keywords
				  const kw = newStr.split(',')
				  that.search_keywords = kw
				  that.search_keywords_five = kw.slice(0, 5)
			  }
			  if (data.hint_keywords) {
				  const arr = data.hint_keywords.split(',')
				  const result = arr.map(item => {
					  if (item === null || item === undefined || item === '') {
						  return '输入货源关键字'
					  }
					  return item
				  })
				  that.hint_keywords = result
				  that.words = result
			  }
			  that.mergeAndPersistHomeShell({
				  shop: {
					  search_keywords: (that.search_keywords || []).slice(),
					  search_keywords_five: (that.search_keywords_five || []).slice(),
					  hint_keywords: that.hint_keywords,
					  words: (that.words || []).slice(),
					  hotImgurl: that.hotImgurl,
					  temaiImgurl: that.temaiImgurl,
					  headerBgImage: that.headerBgImage,
					  appHotId: that.appHotId,
					  coupons_show_type: that.coupons_show_type,
					  coupons_show_type_title: that.coupons_show_type_title
				  }
			  })
		  },
		  shopConfigHot() {
			  uni.request({
				  url: this.websiteUrl + '/api/shop/config',
				  method: 'GET',
				  data: {
					  app_version: incrementVersion()
				  },
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
					  this.applyShopConfigFromApi(data)
				  }
			  })
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
						  if (that.onelist && that.onelist.length > 0) that.visualAdvHasGoods = true
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
						  console.log('1233',res.data.data)
						  that.twolist = res.data.data.data
						  that.visualdvAList[1].previewProlist = that.twolist
						  if (that.twolist && that.twolist.length > 0) that.visualAdvHasGoods = true
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
			  // var that = this
			  // var text = title || goods_name
			  // uni.setClipboardData({
			  // 	data: text,
			  // 	success: () => {
			  // 		uni.showToast({
			  // 			title: '复制成功',
			  // 			icon: 'none',
			  // 			duration: 2000,
			  // 		})
			  // 	},
			  // })
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
		  // localShow(e){
		  // 	this.localShow = e
		  // },
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
		  goNewPerson() {
			  uni.navigateTo({
				  url: '/pagesD/newPerson/newPerson'
			  })
		  },
		  toSearch(e) {
			  // 跳转到活动页面默认id
			  if (e == '热卖') {
				  uni.navigateTo({
					  url: '/pagesD/activePage/activePage?id=3'
				  })
			  } else if (e == '新品') {
				  uni.navigateTo({
					  url: '/pagesD/activePage/activePage?id=1'
				  })
			  }
		  },
		  // isshowregionsplicNo: function() {
		  // 	var that = this
		  // 	that.isshowregionsplic = false
		  // },
		  // isshowregionsplicYes: function() {
		  // 	var that = this
		  // 	that.isshowregionsplic = false
		  // 	setTimeout(function() {
		  // 		that.handleRegionShow();
		  // 	}, 500);
		  // },
		  toMerchants: function() {
			
			  uni.navigateTo({
				  url: '/pagesB/merchants/merchants'
			  })
		  },


		  // 新品 / 热卖：按 4 个一组切块；append=true 时接在新品后面，避免与并发请求乱序
		  newGoodsListArr(res, append) {
			  if (!Array.isArray(res) || res.length === 0) {
				  if (!append) this.newArray = []
				  return
			  }
			  const chunks = []
			  for (let i = 0; i < res.length; i += 4) {
				  chunks.push(res.slice(i, i + 4))
			  }
			  if (append) {
				  this.newArray = (this.newArray || []).concat(chunks)
			  } else {
				  this.newArray = chunks
			  }
		  },





		  getNewGoodsList(page) {
			  const reqPage = page || 1;

			  uni.request({
				  url: this.websiteUrl + '/api/goods/type_list',
				  method: 'GET',
				  data: {
					  page: reqPage,
					  // size: this.pageSize, 将一个数组中的数据追加到另一个数组中
					  size: 4,
					  type: 'is_new'
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  let data = res.data.data || []
					  this.newListOne = data[0]
					  this.newListTwo = data[1]
					  this.newGoodsListArr(data, false)
					  this.mergeAndPersistHomeShell({
						  newBlock: {
							  newListOne: this.newListOne,
							  newListTwo: this.newListTwo,
							  newArray: this.newArray
						  }
					  })
					  this.getHotGoodsList(1)
				  },
				  fail: (err) => {
				  }
			  })
		  },
		  initData() {
			  var that = this
			  setTimeout(() => {
				  that.getHome_list();
				  uni.stopPullDownRefresh();
			  }, 10);
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
					 
					  let data = res.data.data
					  this.home_list_one = data.list
					  
				  },
				  fail: (err) => {
				  }
			  })
		  },
		  getVideoList(page) {
			  const reqPage = page || 1;
			  const reqSize = 10;
			  uni.request({
				  url: this.websiteUrl + '/api/goods/goodsvideo',
				  method: 'POST',
				  data: {
					  size: reqSize,
					  page: reqPage,
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
				  }
			  })
		  },
		  getHotGoodsList(page) {
			  const reqPage = page || 1;

			  uni.request({
				  url: this.websiteUrl + '/api/goods/type_list',
				  method: 'GET',
				  data: {
					  page: reqPage,
					  // size: this.pageSize,
					  size: 4,
					  type: 'is_hot'
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  let data = res.data.data || []
					  this.newGoodsListArr(data, true)
					  this.mergeAndPersistHomeShell({
						  newBlock: {
							  newListOne: this.newListOne,
							  newListTwo: this.newListTwo,
							  newArray: this.newArray
						  }
					  })
				  },
				  fail: (err) => {
				  }
			  })
		  },
		  // getGoodsList(page) {
		  // 	if (page) {
		  // 		this.page = page
		  // 		this.size = this.pageSize
		  // 	}

	
		  // 	uni.request({
		  // 		url: this.websiteUrl + '/api/goods/type_list',
		  // 		method: 'GET',
		  // 		data: {
		  // 			page: this.page,
		  // 			size: this.pageSize,
		  // 			type: 'is_home'
		  // 		},
		  // 		header: {
		  // 			'Content-Type': 'application/json',
		  // 			'token': uni.getStorageSync('token'),
		  // 			'X-Client-Hash': uni.getStorageSync('client_hash')
		  // 		},
		  // 		success: (res) => {
		  // 			var that = this
		  // 		
		  // 			for (var i = 0; i < res.data.data.length; i++) {
		  // 				res.data.data[i].isshow = true
		  // 			}
		  // 			let data = res.data.data
		  // 		
		  // 			this.hotListOne = data[8]
		  // 			this.hotListTwo = data[9]
		  // 			if (res.data.data.length < 10) {
		  // 				that.loadMoreStatus = 'noMore'
		  // 			}
		  // 			if (that.page > 1) {
		  // 				that.prolist = that.prolist.concat(data);
		  // 			
		  // 				that.distributeItems(data)
		  // 				
		  // 			} else {
		  // 				that.prolist = data
		  // 				that.distributeItems(data)
		  // 			}
		  // 		},
		  // 		fail: (err) => {
		  // 			// uni.showToast({
		  // 			// 	icon: 'none',
		  // 			// 	title: '网络连接失败，请稍后更换网络后重试~~'
		  // 			// })
		  // 		}
		  // 	})
		  // },

		  getHomeCacheUserSuffix() {
			  const uid = uni.getStorageSync('user_id')
			  if (uid === null || uid === undefined || uid === '') return 'guest'
			  return String(uid)
		  },
		  getHomeShellStorageKey() {
			  return 'home_shell_cache_' + this.getHomeCacheUserSuffix()
		  },
		  getHomeListCacheKeys() {
			  const s = this.getHomeCacheUserSuffix()
			  return {
				  data: 'home_goods_list_cache_' + s,
				  time: 'home_goods_list_cache_time_' + s
			  }
		  },
		  _readHomeListCacheRaw() {
			  const { data, time } = this.getHomeListCacheKeys()
			  let cachedData = uni.getStorageSync(data)
			  let cacheTime = uni.getStorageSync(time)
			  if (cachedData == null || cachedData === '') {
				  cachedData = uni.getStorageSync('home_goods_list_cache')
				  cacheTime = uni.getStorageSync('home_goods_list_cache_time')
			  }
			  return { cachedData, cacheTime }
		  },
		  _writeHomeListCache(dataArray) {
			  const { data, time } = this.getHomeListCacheKeys()
			  uni.setStorageSync(data, dataArray)
			  uni.setStorageSync(time, Date.now())
		  },
		  _removeHomeListCacheAll() {
			  const { data, time } = this.getHomeListCacheKeys()
			  uni.removeStorageSync(data)
			  uni.removeStorageSync(time)
			  uni.removeStorageSync('home_goods_list_cache')
			  uni.removeStorageSync('home_goods_list_cache_time')
		  },
		  _removeHomeShellCache() {
			  try {
				  uni.removeStorageSync(this.getHomeShellStorageKey())
			  } catch (e) {}
		  },
		  mergeAndPersistHomeShell(partial) {
			  const key = this.getHomeShellStorageKey()
			  let cur = {}
			  try {
				  cur = uni.getStorageSync(key) || {}
				  if (typeof cur === 'string') {
					  cur = JSON.parse(cur)
				  }
			  } catch (e) {
				  cur = {}
			  }
			  const next = {
				  timestamp: Date.now(),
				  nav: partial.nav != null ? partial.nav : (cur.nav || {}),
				  shop: partial.shop != null ? partial.shop : (cur.shop || {}),
				  newBlock: partial.newBlock != null ? partial.newBlock : (cur.newBlock || {}),
				  hotStrip: partial.hotStrip != null ? partial.hotStrip : (cur.hotStrip || {})
			  }
			  try {
				  uni.setStorageSync(key, next)
			  } catch (e) {}
		  },
		  loadHomeShellCache() {
			  const key = this.getHomeShellStorageKey()
			  let cur = uni.getStorageSync(key)
			  if (!cur) return { payload: null, isExpired: true }
			  if (typeof cur === 'string') {
				  try {
					  cur = JSON.parse(cur)
				  } catch (e) {
					  return { payload: null, isExpired: true }
				  }
			  }
			  const ts = cur.timestamp || 0
			  const isExpired = !ts || (Date.now() - ts > HOME_SHELL_TTL_MS)
			  return { payload: cur, isExpired }
		  },
		  applyHomeShellPayload(p) {
			  if (!p) return
			  if (p.nav) {
				  if (Array.isArray(p.nav.mergedData)) this.mergedData = p.nav.mergedData
				  if (Array.isArray(p.nav.aClass)) this.aClass = p.nav.aClass
			  }
			  if (p.shop) {
				  const s = p.shop
				  if (Array.isArray(s.search_keywords)) this.search_keywords = s.search_keywords.slice()
				  if (Array.isArray(s.search_keywords_five)) this.search_keywords_five = s.search_keywords_five.slice()
				  if (s.hint_keywords !== undefined) this.hint_keywords = s.hint_keywords
				  if (Array.isArray(s.words)) this.words = s.words.slice()
				  if (s.hotImgurl !== undefined) this.hotImgurl = s.hotImgurl
				  if (s.temaiImgurl !== undefined) this.temaiImgurl = s.temaiImgurl
				  if (s.headerBgImage !== undefined) this.headerBgImage = s.headerBgImage
				  if (s.appHotId !== undefined) this.appHotId = s.appHotId
				  if (s.coupons_show_type !== undefined) this.coupons_show_type = s.coupons_show_type
				  if (s.coupons_show_type_title !== undefined) this.coupons_show_type_title = s.coupons_show_type_title
			  }
			  if (p.newBlock) {
				  const n = p.newBlock
				  if (n.newListOne !== undefined) this.newListOne = n.newListOne
				  if (n.newListTwo !== undefined) this.newListTwo = n.newListTwo
				  if (Array.isArray(n.newArray)) {
					  this.newArray = JSON.parse(JSON.stringify(n.newArray))
				  }
			  }
			  if (p.hotStrip) {
				  if (p.hotStrip.hotListOne !== undefined) this.hotListOne = p.hotStrip.hotListOne
				  if (p.hotStrip.hotListTwo !== undefined) this.hotListTwo = p.hotStrip.hotListTwo
			  }
		  },
		  restoreHomeShellFromStorageIfNeeded() {
			  const { payload } = this.loadHomeShellCache()
			  if (payload) {
				  this.applyHomeShellPayload(payload)
			  }
		  },
		  /** 冷启动：内存列表为空时从磁盘恢复瀑布流第一页，避免长时间空白（过期仍展示，由接口静默对齐） */
		  restoreHomeListFromStorageIfEmpty() {
			  if (this.prolist && this.prolist.length) return
			  const { cachedData } = this._readHomeListCacheRaw()
			  if (!cachedData || !Array.isArray(cachedData) || cachedData.length === 0) return
			  this.prolist = cachedData
			  this.hotListOne = cachedData[8] || this.hotListOne
			  this.hotListTwo = cachedData[9] || this.hotListTwo
			  this.mergeAndPersistHomeShell({
				  hotStrip: { hotListOne: this.hotListOne, hotListTwo: this.hotListTwo }
			  })
			  this.leftList = []
			  this.rightList = []
			  this.leftHeight = 0
			  this.rightHeight = 0
			  this.distributeItems(cachedData)
			  this.loadMoreStatus = cachedData.length >= this.pageSize ? 'more' : 'noMore'
			  this.hasMore = this.loadMoreStatus === 'more'
			  this.page = 1
			  this._lastGoodsListLoadedPage = 1
		  },
		  _restoreHomeListCacheForUserSwitch() {
			  const { cachedData, cacheTime } = this._readHomeListCacheRaw()
			  const isExpired = !cacheTime || (Date.now() - cacheTime > HOME_LIST_TTL_MS)
			  if (!cachedData || !Array.isArray(cachedData) || cachedData.length === 0) {
				  // 新账号本地无列表缓存（或仅空数组）：不能只清空不拉接口。Tab 首页 often 不再触发 onLoad，
				  // onShow 又约定「prolist 为空则交给 onLoad」——结果永远不请求，出现白底 + 「查看更多」卡死。
				  this.prolist = []
				  this.leftList = []
				  this.rightList = []
				  this.leftHeight = 0
				  this.rightHeight = 0
				  this.page = 1
				  this._lastGoodsListLoadedPage = 0
				  this._goodsPrefetched = null
				  this._typeListInFlightPage = 0
				  this.loadMoreStatus = 'more'
				  this.hasMore = true
				  this.isLoadingFirstPage = true
				  this.$nextTick(() => {
					  this.getGoodsListWithCache(1)
				  })
				  return
			  }
			  // 过期：不能沿用上一账号内存里的列表，需清空并拉首屏，否则短时会错显他人商品
			  if (isExpired) {
				  this.prolist = []
				  this.leftList = []
				  this.rightList = []
				  this.leftHeight = 0
				  this.rightHeight = 0
				  this.isLoadingFirstPage = true
				  this.$nextTick(() => {
					  this.getGoodsListWithCache(1)
				  })
				  return
			  }
			  this.prolist = cachedData
			  this.hotListOne = cachedData[8] || this.hotListOne
			  this.hotListTwo = cachedData[9] || this.hotListTwo
			  this.mergeAndPersistHomeShell({
				  hotStrip: {
					  hotListOne: this.hotListOne,
					  hotListTwo: this.hotListTwo
				  }
			  })
			  this.leftList = []
			  this.rightList = []
			  this.leftHeight = 0
			  this.rightHeight = 0
			  this.distributeItems(cachedData)
			  this.loadMoreStatus = cachedData.length >= this.pageSize ? 'more' : 'noMore'
			  this.hasMore = this.loadMoreStatus === 'more'
			  this.page = 1
			  this._lastGoodsListLoadedPage = 1
		  },
		  silentRefreshHomeShellIfNeeded() {
			  const { payload, isExpired } = this.loadHomeShellCache()
			  // 从未成功持久化过壳缓存时交给 onLoad，避免与首屏 /api/app/home 重复请求
			  if (!payload) return
			  if (!isExpired) return
			  if (this._homePageEnterAt && Date.now() - this._homePageEnterAt < 4000) return
			  const now = Date.now()
			  if (now - this.lastShellSilentRefreshAt < HOME_SHELL_SILENT_INTERVAL_MS) return
			  this.lastShellSilentRefreshAt = now
			  const that = this
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
					  that.onHomeApiSuccess(res)
				  }
			  })
			  this.shopConfigHot()
		  },
		  onHomeApiSuccess(res) {
			  const that = this
			  if (!res || !res.data || !res.data.data) return
			  that.modules = res.data.data
			  that.visualdvAList = []
			  that.visualAdvBannerImgHeight = 300
			  that.visualAdvHasGoods = false
			  var list
			  var chunk
			  var module3
			  for (var i = 0; i < that.modules.length; i++) {
				  if (that.modules[i].module == 'visual-adv') {
					  that.visualdvAList.push(that.modules[i])
				  }
				  if (that.modules[i].module == 'count-down') {
					  that.countDown = that.modules[i]
				  }
				  if (that.modules[i].module == 'slide') {
					  that.slideList = that.modules[i].data.list
				  }
				  if (that.modules[i].module == 'nav') {
					  list = that.modules[i].data.list
					  chunk = that.modules[i].data.isNumberSel * 1
					  module3 = that.modules[i]
				  }
			  }
			  if (!list || !Array.isArray(list)) {
				  list = []
				  if (!chunk) chunk = 10
				  console.warn('金刚区无数据：接口未返回 nav 模块或 data.list 为空，请检查后台首页配置')
			  }
			  var result = []
			  that.mergedData = list
			  that.swiperList = result
			  console.log('金刚区数据', that.swiperList)
			  var listStyless = 'list-style2 list-style3'
			  let arr = []
			  arr.push(listStyless)
			  if (listStyless == 'list-style2' && module3 && module3.data && Array.isArray(module3.data.styleSelList)) {
				  module3.data.styleSelList.map((v, i) => {
					  switch (v) {
						  case '0':
							  arr.push('whole-margin')
							  break
						  case '1':
							  arr.push('all-padding')
							  break
						  case '2':
							  arr.push('all-border')
							  break
						  default:
							  break
					  }
				  })
			  }
			  that.aClass = arr
			  that.mergeAndPersistHomeShell({
				  nav: {
					  mergedData: JSON.parse(JSON.stringify(that.mergedData)),
					  aClass: arr.slice()
				  }
			  })
		  },

		  // 对比商品列表数据是否有变化
		  compareGoodsList(oldData, newData) {
			  // 如果数据为空，认为有变化
			  if (!oldData || !newData || oldData.length === 0 || newData.length === 0) {
				  return true;
			  }
			  
			  // 对比数据长度
			  if (oldData.length !== newData.length) {
				  return true;
			  }
			  
			  // 对比每个商品的goods_id序列（排序后对比，避免顺序不同导致的误判）
			  const oldIds = oldData.map(item => item.goods_id).sort().join(',');
			  const newIds = newData.map(item => item.goods_id).sort().join(',');
			  
			  return oldIds !== newIds;
		  },
		  
		  // 带缓存的获取商品列表方法
		  getGoodsListWithCache(page) {
			  var that = this;
			  
			  // 只对第一页进行缓存处理
			  if (page && page !== 1) {
				  // 非第一页直接调用原方法
				  this.getGoodsList(page);
				  return;
			  }
			  
			  // 读取缓存（按 user_id 分 key，兼容旧全局 key）
			  const { cachedData, cacheTime } = this._readHomeListCacheRaw();
			  // 与 _restoreHomeListCacheForUserSwitch 一致：无时间戳视为过期，避免旧版仅写 data 未写 time 时误判未过期
			  const isCacheExpired = !cacheTime || (Date.now() - cacheTime > HOME_LIST_TTL_MS);
			  
			  // 调用接口获取最新数据
			  if (page) {
				  this.page = page;
				  this.size = this.pageSize;
			  }
			  
			  // 【关键修复】如果状态不是 'loading'，设置为 'loading'（首次加载或从 'more' 状态触发）
			  if (this.loadMoreStatus !== 'loading') {
				  this.loadMoreStatus = 'loading'
			  }
			  
			  uni.request({
				  url: this.websiteUrl + '/api/goods/type_list',
				  method: 'GET',
				  data: {
					  page: this.page,
					  size: this.pageSize,
					  type: 'is_home'
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  var that = this;
					  let data = [];
					  try {
						  data = Array.isArray(res.data && res.data.data) ? res.data.data : [];
					  } catch (e) {
						  that.loadMoreStatus = 'more';
					  that.hasMore = that.loadMoreStatus === 'more';
						  if (that.page === 1) that.isLoadingFirstPage = false;
						  if (that.page === 1 && that.prolist && that.prolist.length >= that.pageSize) {
							  that._lastGoodsListLoadedPage = 1
						  }
						  return;
					  }
					  data = data.map(item => {
						  item.isshow = true;
						  return item;
					  });

					  // 如果有缓存且缓存未过期，进行数据对比
					  if (cachedData && !isCacheExpired) {
						  const hasChanged = that.compareGoodsList(cachedData, data);
						  
							if (!hasChanged) {
								// 数据没变化，使用缓存数据，不重新渲染
								that.prolist = cachedData;
								// 只在第一页初始化热卖/严选商品，避免数据不足时变成 undefined
								if (that.page === 1) {
									that.hotListOne = cachedData[8] || that.hotListOne;
									that.hotListTwo = cachedData[9] || that.hotListTwo;
									that.mergeAndPersistHomeShell({
										hotStrip: { hotListOne: that.hotListOne, hotListTwo: that.hotListTwo }
									});
								}
								// 直接使用缓存的左右列数据，避免重新分配
								// 注意：这里需要确保leftList和rightList已经有数据
								if (that.leftList.length === 0 && that.rightList.length === 0) {
									// 如果左右列为空，需要重新分配
									that.distributeItems(cachedData);
								}
								// 【修复】第一页加载完成，清除加载标志
								if (that.page === 1) {
									that.isLoadingFirstPage = false;
									that.homeFirstPageLoadedForLogin = true; // 标记首页数据已加载，用于滚动后跳转登录
								}
								// 【修复】使用缓存提前 return 时必须恢复 loadMoreStatus，否则会一直停在 'loading'，导致触底不再加载下一页
						  that.loadMoreStatus = cachedData.length >= that.pageSize ? 'more' : 'noMore';
						  that.hasMore = that.loadMoreStatus === 'more';
								that._lastGoodsListLoadedPage = 1
								that.$nextTick(() => that._fetchGoodsListPrefetchNext())
								return;
							} else {
						  }
					  }
					  
					  // 数据有变化或没有缓存，更新数据（只在第一页初始化）
					  if (that.page === 1) {
						  that.hotListOne = data[8] || that.hotListOne;
						  that.hotListTwo = data[9] || that.hotListTwo;
					  }
					  
					  // 更新状态：根据返回的数据量判断是否还有更多
					  if (data.length === 0) {
						  that.loadMoreStatus = 'noMore';
					  } else if (data.length < that.pageSize) {
						  that.loadMoreStatus = 'noMore';
					  } else {
						  that.loadMoreStatus = 'more';
					  }
					  
					  if (that.page > 1) {
						  that.prolist = that.prolist.concat(data);
						  that.distributeItems(data);
					  } else {
						  // 第一页：清空左右列，重新分配
						  that.prolist = data;
						  that.leftList = [];
						  that.rightList = [];
						  that.leftHeight = 0;
						  that.rightHeight = 0;
						  that.distributeItems(data);
					  }
					  
					  // 更新缓存（仅第一页）
					  if (that.page === 1) {
						  that._writeHomeListCache(data);
						  that.mergeAndPersistHomeShell({
							  hotStrip: { hotListOne: that.hotListOne, hotListTwo: that.hotListTwo }
						  });
						  // 【修复】第一页加载完成，清除加载标志
						  that.isLoadingFirstPage = false;
						  that.homeFirstPageLoadedForLogin = true; // 标记首页数据已加载，用于滚动后跳转登录
						}
						
						// 初始化所有GIF状态为封面
					  that.$nextTick(() => {
						  setTimeout(() => {
							  data.forEach(item => {
								  if (item.hasVideo) {
									  that.$set(that.showCover, item.goods_id, true);
								  }
							  });
							  that.showingGif = null;
							  that.initGifObserver();
						  }, 300);
					  });
					  that._lastGoodsListLoadedPage = that.page
					  that.$nextTick(() => that._fetchGoodsListPrefetchNext())
				  },
				  fail: (err) => {
					  // 请求失败时，如果有缓存且缓存未过期，使用缓存
					  if (cachedData && !isCacheExpired) {
						  that.prolist = cachedData;
						  that.hotListOne = cachedData[8];
						  that.hotListTwo = cachedData[9];
						  if (that.leftList.length === 0 && that.rightList.length === 0) {
							  that.distributeItems(cachedData);
						  }
						  // 【修复】使用缓存时也要恢复 loadMoreStatus，否则触底无法加载下一页
						  that.loadMoreStatus = cachedData.length >= that.pageSize ? 'more' : 'noMore';
						  that.hasMore = that.loadMoreStatus === 'more';
						  that._lastGoodsListLoadedPage = 1
						  that.$nextTick(() => that._fetchGoodsListPrefetchNext())
					  } else {
						  // 没有缓存或缓存过期，重置状态允许重试
						  that.loadMoreStatus = 'more';
						  that.hasMore = true;
						  if (that.page === 1 && that.prolist && that.prolist.length >= that.pageSize) {
							  that._lastGoodsListLoadedPage = 1
						  }
					  }
					  // 【修复】第一页加载失败，也要清除加载标志，允许重试
					  if (that.page === 1) {
						  that.isLoadingFirstPage = false;
					  }
				  }
			  });
		  },
		  
		  // 合并 type_list 一页数据并触发静默预取下一页（减轻接口 2～3s 时的「滑到底干等」）
		  _applyGoodsListResponse(data) {
			  var that = this
			  if (that.page > 1 && that._lastGoodsListLoadedPage >= that.page) {
				  return
			  }
			  if (that.page === 1) {
				  that.hotListOne = data[8] || that.hotListOne
				  that.hotListTwo = data[9] || that.hotListTwo
			  }
			  if (data.length === 0) {
				  that.loadMoreStatus = 'noMore'
			  } else if (data.length < that.pageSize) {
				  that.loadMoreStatus = 'noMore'
			  } else {
				  that.loadMoreStatus = 'more'
			  }
			  that.hasMore = that.loadMoreStatus === 'more'
			  if (that.page > 1) {
				  that.prolist = that.prolist.concat(data)
				  that.distributeItems(data)
			  } else {
				  that.prolist = data
				  that.distributeItems(data)
			  }
			  if (that.page === 1) {
				  that._writeHomeListCache(data)
				  that.mergeAndPersistHomeShell({
					  hotStrip: { hotListOne: that.hotListOne, hotListTwo: that.hotListTwo }
				  })
				  that.isLoadingFirstPage = false
				  that.homeFirstPageLoadedForLogin = true
			  }
			  that._lastGoodsListLoadedPage = that.page
			  that.$nextTick(() => {
				  setTimeout(() => {
					  data.forEach(item => {
						  if (item.hasVideo) {
							  that.$set(that.showCover, item.goods_id, true)
						  }
					  })
					  that.showingGif = null
					  that.initGifObserver()
				  }, 300)
			  })
			  that.$nextTick(() => {
				  that._fetchGoodsListPrefetchNext()
			  })
		  },

		  _fetchGoodsListPrefetchNext() {
			  const that = this
			  if (!that.hasMore) return
			  const next = that.page + 1
			  if (that._goodsPrefetched && that._goodsPrefetched.page === next) return
			  if (that._typeListInFlightPage === next) return
			  if (that.prolist.length < that.page * that.pageSize) return
			  that._typeListInFlightPage = next
			  uni.request({
				  url: that.websiteUrl + '/api/goods/type_list',
				  method: 'GET',
				  data: {
					  page: next,
					  size: that.pageSize,
					  type: 'is_home'
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
			  success: (res) => {
					  if (that._typeListInFlightPage === next) {
						  that._typeListInFlightPage = 0
					  }
					  if (that._lastGoodsListLoadedPage !== next - 1) {
						  return
					  }
					  let pdata = []
					  try {
						  pdata = Array.isArray(res.data && res.data.data) ? res.data.data : []
				  } catch (e) {
						  return
					  }
					  pdata = pdata.map(item => {
						  item.isshow = true
						  return item
					  })
					  that._goodsPrefetched = { page: next, data: pdata }
					  if (that.page === next && that.loadMoreStatus === 'loading') {
						  that._goodsPrefetched = null
						  that._applyGoodsListResponse(pdata)
					  }
				  },
				  fail: () => {
					  if (that._typeListInFlightPage === next) {
						  that._typeListInFlightPage = 0
					  }
					  if (that.loadMoreStatus === 'loading' && that.page === next && that._lastGoodsListLoadedPage < next) {
						  that.$nextTick(() => {
							  that.getGoodsList()
						  })
					  }
				  }
			  })
		  },
		  
		  getGoodsList(page) {
			  if (page) {
				  this.page = page
				  this.size = this.pageSize
			  }
			  if (page === 1) {
				  this._goodsPrefetched = null
				  this._typeListInFlightPage = 0
				  this._lastGoodsListLoadedPage = 0
			  }
			  if (this.page > 1 && this._goodsPrefetched && this._goodsPrefetched.page === this.page) {
				  const _pd = this._goodsPrefetched.data
				  this._goodsPrefetched = null
				  this._applyGoodsListResponse(_pd)
				  return
			  }
			  if (this.page > 1 && this._lastGoodsListLoadedPage >= this.page) {
				  this.loadMoreStatus = this.hasMore ? 'more' : 'noMore'
				  return
			  }
			  if (this.page > 1 && this._typeListInFlightPage === this.page) {
				  return
			  }
			  if (this.loadMoreStatus !== 'loading') {
				  this.loadMoreStatus = 'loading'
			  }
			  const reqPage = this.page
			  this._typeListInFlightPage = reqPage
			  uni.request({
				  url: this.websiteUrl + '/api/goods/type_list',
				  method: 'GET',
				  data: {
					  page: reqPage,
					  size: this.pageSize,
					  type: 'is_home'
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  var that = this
					  if (that._typeListInFlightPage === reqPage) {
						  that._typeListInFlightPage = 0
					  }
					  let data = []
					  try {
						  data = Array.isArray(res.data && res.data.data) ? res.data.data : []
					  } catch (e) {
						  if (that._typeListInFlightPage === reqPage) {
							  that._typeListInFlightPage = 0
						  }
						  that.loadMoreStatus = 'more'
						  if (that.page === 1) that.isLoadingFirstPage = false
						  return
					  }
					  data = data.map(item => {
						  item.isshow = true
						  return item
					  })
					  that._applyGoodsListResponse(data)
			  },
				  fail: (err) => {
					  if (this._typeListInFlightPage === reqPage) {
						  this._typeListInFlightPage = 0
					  }
					  this.loadMoreStatus = 'more'
					  this.hasMore = true
					  if (this.page === 1) {
						  this.isLoadingFirstPage = false
					  }
				  }
			  })
		  },

		  toshoplist() {
			  
			  uni.navigateTo({
				  url: '/pagesD/video/list'
			  })
		  },
		  toShopHome: function(item) {
			 
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
			  // 暂停当前播放的视频
			  if (this.playingVideo) {
				  this.forcePauseVideo(this.playingVideo);
			  }
			  // uni.navigateTo({
			  // 	url: '/pagesD/activePage/activePage?id=23'
			  // })
			  // 新品0 热销1  一件代发 3 严选4
			  if (unm == 0) {
				  uni.navigateTo({
					  url: '/pagesD/goodslist/goodslist?keywords=新品'
				  })
			  } else if (unm == 1) {
				  uni.navigateTo({
					  url: '/pagesD/goodslist/goodslist?keywords=热卖'
				  })
			  } else if (unm == 3) {
				  uni.navigateTo({
					  url: '/pagesD/goodslist/goodslist?type=一件代发'
				  })
			  } else if (unm == 4) {
				  uni.navigateTo({
					  url: '/pagesD/goodslist/goodslist?type=好卖严选'
				  })
			  }
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
		  linknav(item) {
			
			  let page, built
			  // #ifndef MP-WEIXIN
			  page = item.appPage ? item.appPage : item.url
			  built = item.appPage ? 'app' : 'undefined'
			  // #endif

			  // #ifdef MP-WEIXIN
			  page = item.appPage ? item.appPage : item.url
			  built = item.appPage ? 'app' : 'undefined'
			  // #endif
			
			  if (/^https:\/\//.test(page)) {
				  let url = page
				  this.articleId = url.match(/-(\d+)\./)[1]
			
				  this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
			  } else {
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
			  }

		  },
		  swiperChange(e) {

			  this.swiperCurrent = e.detail.current
		  },
		  shipimswiperChange(e) {
			  this.shipinswiperCurrent = e.detail.current
		  },
		  visualAdvSwiperChange(e) {
			  this.visualAdvSwiperCurrent = e.detail.current
		  },
		  visualAdvImageLoad(e) {
			  const { width, height } = e.detail || {}
			  if (!width || !height) return
			  const sys = uni.getSystemInfoSync()
			  const winW = (sys.windowWidth || 375) - 40
			  const imgH = (winW / width) * height
			  const rpxRatio = 750 / (sys.windowWidth || 375)
			  const imgHrpx = Math.ceil(imgH * rpxRatio)
			  if (imgHrpx > this.visualAdvBannerImgHeight) this.visualAdvBannerImgHeight = imgHrpx
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
			  // 【测试模式】暂时移除时间间隔检查，每次启动都弹出
			  // const lastShownTime = uni.getStorageSync('notification_modal_last_shown_time');
			  // const now = Date.now();
			  // const sixHours = 6 * 60 * 60 * 1000; // 6小时的毫秒数
			  // 
			  // if (lastShownTime && (now - lastShownTime < sixHours)) {
			  //     // 距离上次提示不足6小时，不显示
			  //     return;
			  // }
			  
			  let platform = uni.getSystemInfoSync().platform; //首先判断app是安卓还是ios
			  if (platform == "ios") { //这里是ios的方法
				  var UIApplication = plus.ios.import("UIApplication");
				  var app = UIApplication.sharedApplication();
				  var enabledTypes = 0;
				  if (app.currentUserNotificationSettings) {
					  var settings = app.currentUserNotificationSettings();
					  enabledTypes = settings.plusGetAttribute("types");
					 
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
		
				  if (!areNotificationsEnabled) {
					  // this.openTongZhi()
					  this.ispush = true
				  }
			  }
		  },
		  //开启通知
		  openTongZhi() { //弹窗按钮绑定方法
			  console.log('[openTongZhi] 方法被调用');
			  let platform = uni.getSystemInfoSync().platform; //获取安卓还是ios
			  console.log('[openTongZhi] 平台类型:', platform);
			  // #ifdef APP-PLUS
			  if (platform == "ios") { //如果机型是ios
				  console.log('[openTongZhi] 进入 iOS 分支');
				  try {
					  console.log('[openTongZhi] 开始导入 iOS 类');
					  // 【修复】使用 iOS 标准方式打开应用设置页面
					  // 参考 common/permission.js 的实现，使用 app-settings: URL scheme
					  // 该 URL scheme 已在 manifest.json 的 urlschemewhitelist 中配置
					  var UIApplication = plus.ios.import("UIApplication");
					  console.log('[openTongZhi] UIApplication 导入成功');
					  
					  var application = UIApplication.sharedApplication();
					  console.log('[openTongZhi] application 获取成功');
					  
					  var NSURL = plus.ios.import("NSURL");
					  console.log('[openTongZhi] NSURL 导入成功');
					  
					  // 尝试方式1：使用 plus.runtime.openURL（uniapp 封装的方法，可能更可靠）
					  console.log('[openTongZhi] 尝试方式1：使用 plus.runtime.openURL("app-settings:")');
					  try {
						  plus.runtime.openURL("app-settings:");
						  console.log('[openTongZhi] plus.runtime.openURL 调用完成，跳转应该成功');
						  // 【修复】方式1 调用成功，直接返回，不再尝试其他方式
						  // 清理对象
						  plus.ios.deleteObject(NSURL);
						  plus.ios.deleteObject(application);
						  console.log('[openTongZhi] 对象清理完成，方式1 成功返回');
						  return;
					  } catch (e1) {
						  console.error('[openTongZhi] plus.runtime.openURL 失败:', e1);
						  console.error('[openTongZhi] plus.runtime.openURL 异常堆栈:', e1.stack);
						  // 方式1 失败，继续尝试方式2
					  }
					  
					  // 尝试方式2：使用 application.openURL（原生方法）
					  console.log('[openTongZhi] 尝试方式2：使用 application.openURL("app-settings:")');
					  var settingsURL = NSURL.URLWithString("app-settings:");
					  console.log('[openTongZhi] settingsURL 创建成功:', settingsURL);
					  
					  // 检查是否可以打开 URL
					  var canOpen = false;
					  try {
						  if (application.respondsToSelector("canOpenURL:")) {
							  canOpen = application.canOpenURL(settingsURL);
							  console.log('[openTongZhi] canOpenURL 检查结果:', canOpen);
							  if (!canOpen) {
								  console.warn('[openTongZhi] ⚠️ canOpenURL 返回 false，说明 Info.plist 中可能没有配置 LSApplicationQueriesSchemes');
								  console.warn('[openTongZhi] ⚠️ 需要在 manifest.json 的 urlschemewhitelist 中添加 "app-settings"，并重新打包应用');
							  }
						  } else {
							  console.log('[openTongZhi] canOpenURL 方法不可用，直接尝试打开');
							  canOpen = true;
						  }
					  } catch (checkError) {
						  console.log('[openTongZhi] canOpenURL 检查异常，直接尝试打开:', checkError);
						  canOpen = true;
					  }
					  
					  if (canOpen) {
						  console.log('[openTongZhi] 准备调用 application.openURL');
						  var openResult = application.openURL(settingsURL);
						  console.log('[openTongZhi] application.openURL 调用完成，返回值:', openResult);
						  if (openResult === true) {
							  console.log('[openTongZhi] ✅ 方式2 返回 true，跳转应该成功');
							  // 清理对象后返回
					  plus.ios.deleteObject(settingsURL);
					  plus.ios.deleteObject(NSURL);
					  plus.ios.deleteObject(application);
							  console.log('[openTongZhi] 对象清理完成');
							  return;
						  }
						  
						  // 如果 openURL 返回 false 或 undefined，尝试其他方式
						  if (openResult === false || openResult === undefined || openResult === null) {
							  console.log('[openTongZhi] ⚠️ 方式2 返回 false/undefined，尝试方式3');
							  
							  // 方式3：尝试使用 App-Prefs:root=NOTIFICATIONS_ID（通知设置）
							  // 注意：App-Prefs: 在 iOS 10+ 已被废弃，但某些版本可能仍可用
							  try {
								  console.log('[openTongZhi] 尝试方式3：使用 App-Prefs:root=NOTIFICATIONS_ID');
								  var settingsURL3 = NSURL.URLWithString("App-Prefs:root=NOTIFICATIONS_ID");
								  console.log('[openTongZhi] 方式3 settingsURL3 创建成功:', settingsURL3);
								  var openResult3 = application.openURL(settingsURL3);
								  console.log('[openTongZhi] 方式3 openURL 返回值:', openResult3);
								  
								  if (openResult3 === true) {
									  console.log('[openTongZhi] ✅ 方式3 返回 true，跳转应该成功');
									  plus.ios.deleteObject(settingsURL3);
									  plus.ios.deleteObject(settingsURL);
									  plus.ios.deleteObject(NSURL);
									  plus.ios.deleteObject(application);
									  console.log('[openTongZhi] 对象清理完成');
									  return;
								  }
								  
								  if (openResult3 === false) {
									  console.log('[openTongZhi] ⚠️ 方式3 也失败，所有方式都失败');
									  console.log('[openTongZhi] ⚠️ 可能的原因：');
									  console.log('[openTongZhi] ⚠️ 1. Info.plist 中没有配置 LSApplicationQueriesSchemes');
									  console.log('[openTongZhi] ⚠️ 2. 需要在 manifest.json 的 urlschemewhitelist 中添加 URL scheme，并重新打包应用');
									  console.log('[openTongZhi] ⚠️ 3. iOS 版本可能不支持该 URL scheme');
									  // 【修复】如果都失败，显示提示（移除技术提示，只保留用户操作指引）
						  uni.showModal({
										  title: '打开设置',
										  content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							  showCancel: false,
										  confirmText: '知道了'
									  });
								  }
								  plus.ios.deleteObject(settingsURL3);
							  } catch (e3) {
								  console.error('[openTongZhi] 方式3 也失败:', e3);
								  console.error('[openTongZhi] 方式3 异常堆栈:', e3.stack);
								  // 【修复】如果都失败，显示提示（移除技术提示，只保留用户操作指引）
								  uni.showModal({
									  title: '打开设置',
									  content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
									  showCancel: false,
									  confirmText: '知道了'
								  });
							  }
						  }
					  } else {
						  console.error('[openTongZhi] canOpenURL 返回 false，无法打开 app-settings:');
						  uni.showModal({
							  title: '打开设置',
							  content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							  showCancel: false,
							  confirmText: '知道了'
						  });
					  }
					  
					  // 清理对象
					  plus.ios.deleteObject(settingsURL);
					  plus.ios.deleteObject(NSURL);
					  plus.ios.deleteObject(application);
					  console.log('[openTongZhi] 对象清理完成');
					  
					  // 【修复】移除延迟提示框，如果跳转成功，用户会直接看到设置页面
					  // 如果跳转失败，会在 catch 中显示提示
				  } catch (e) {
					  console.error('[openTongZhi] iOS 跳转异常:', e);
					  console.error('[openTongZhi] 异常堆栈:', e.stack);
					  // 异常时显示提示，说明跳转失败
					  uni.showModal({
						  title: '打开设置',
						  content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
						  showCancel: false,
						  confirmText: '知道了'
					  });
				  }
			  } else if (platform == "android") { //如果机型是安卓
				  console.log('[openTongZhi] 进入 Android 分支');
				  try {
					  var main = plus.android.runtimeMainActivity();
					  var pkName = main.getPackageName();
					  console.log('[openTongZhi] Android packageName:', pkName);
					  var Intent = plus.android.importClass("android.content.Intent");
					  var Build = plus.android.importClass("android.os.Build");
					  var Settings = plus.android.importClass("android.provider.Settings");
					  var Uri = plus.android.importClass("android.net.Uri");
					  var intent = null;
					  
					  console.log('[openTongZhi] Android SDK版本:', Build.VERSION.SDK_INT);
					  // Android 8.0+ (API 26+)
					  if (Build.VERSION.SDK_INT >= 26) {
						  console.log('[openTongZhi] 使用 Android 8.0+ 方式');
						  intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
						  intent.putExtra("android.provider.extra.APP_PACKAGE", pkName);
					  } 
					  // Android 5.0-7.1 (API 21-25)
					  else if (Build.VERSION.SDK_INT >= 21) {
						  console.log('[openTongZhi] 使用 Android 5.0-7.1 方式');
						  intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
						  intent.putExtra("app_package", pkName);
						  var uid = main.getApplicationInfo().plusGetAttribute("uid");
						  intent.putExtra("app_uid", uid);
					  } 
					  // Android < 5.0 (API < 21)
					  else {
						  console.log('[openTongZhi] 使用 Android < 5.0 方式');
						  intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						  var uri = Uri.parse("package:" + pkName);
						  intent.setData(uri);
					  }
					  
					  // 添加标志，确保在新任务中启动
					  intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
					  console.log('[openTongZhi] 准备调用 startActivity');
					  // 跳转到该应用的系统通知设置页
					  main.startActivity(intent);
					  console.log('[openTongZhi] startActivity 调用完成');
				  } catch (e) {
					  console.error('[openTongZhi] Android 跳转异常:', e);
					  console.error('[openTongZhi] 异常堆栈:', e.stack);
					  uni.showToast({
						  title: '请手动前往设置 > 应用 > 通知中开启',
						  icon: 'none'
					  });
				  }
			  }
			  // #endif
			  
			  // #ifndef APP-PLUS
			  // H5 或小程序环境
			  console.log('[openTongZhi] 非 APP-PLUS 环境');
			  uni.showToast({
				  title: '请在系统设置中开启通知权限',
				  icon: 'none'
			  });
			  // #endif
			  console.log('[openTongZhi] 方法执行完成');
		  },
		  ispushNo() {
			  var that = this
			  // 用户关闭弹窗后，记录当前时间戳
			  uni.setStorageSync('notification_modal_last_shown_time', Date.now());
			  that.ispush = false
		  },
		  ispushYes() {
			  console.log('[ispushYes] 按钮被点击');
			  var that = this
			  console.log('[ispushYes] 准备调用 openTongZhi');
			  // 跳转到设置
			  that.openTongZhi()
			  console.log('[ispushYes] openTongZhi 调用完成');
			  // 用户点击"去开启"后，记录当前时间戳
			  uni.setStorageSync('notification_modal_last_shown_time', Date.now());
			  that.ispush = false
			  console.log('[ispushYes] 弹窗已关闭');
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
			  } else if (val == 'receive') {
				  this.receiveStutas = false;
				  this.stopNewUserTimers();
				  this.stopStoreCouponTimer();
			  } else {
				  this.mpShareShow = false
			  }
		  },
		  // 检查是否需要弹出评价弹窗
		  checkCommentApp() {
			  var that = this
			  // 检查必要参数
			  if (!that.device_id || !that.model || !that.app_version || !that.model_system) {
				  console.log('评价弹窗：设备信息不完整，跳过检查', {
					  device_id: that.device_id,
					  model: that.model,
					  app_version: that.app_version,
					  model_system: that.model_system
				  })
				  return
			  }
			  
			  uni.request({
				  url: that.websiteUrl + '/api/appcomment/is_comment_app',
				  method: 'POST',
				  data: {
					  device_id: that.device_id,
					  model: that.model,
					  model_system: that.model_system,
					  app_version: that.app_version
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  if (res.data && res.data.status === 'success') {
						  if (res.data.data && res.data.data.is_has_comment == 1) {
							  that.shouldShowEvaluate = true
							  that.share_logo = res.data.data.share_logo || ''
							  console.log('评价弹窗：接口返回需要显示评价弹窗')
						  } else {
							  that.shouldShowEvaluate = false
							  console.log('评价弹窗：接口返回不需要显示评价弹窗')
						  }
					  } else {
						  that.shouldShowEvaluate = false
						  console.log('评价弹窗：接口返回异常', res.data)
					  }
				  },
				  fail: (err) => {
					  console.error('评价弹窗：接口调用失败', err)
					  that.shouldShowEvaluate = false
				  }
			  })
		  },
		  // 点击评分按钮
		  goToAppStore() {
			  var that = this
			  // 先调用提交接口
			  uni.request({
				  url: that.websiteUrl + '/api/appcomment/set_comment_app',
				  method: 'POST',
				  data: {
					  device_id: that.device_id
				  },
				  header: {
					  'Content-Type': 'application/json',
					  'token': uni.getStorageSync('token'),
					  'X-Client-Hash': uni.getStorageSync('client_hash')
				  },
				  success: (res) => {
					  console.log('评价弹窗：提交接口调用成功', res.data)
				  },
				  fail: (err) => {
					  console.error('评价弹窗：提交接口调用失败', err)
				  }
			  })
			  
			  // 关闭弹窗
			  that.isShowEvaluate = false
			  
			  // 打开应用市场
			  if (that.share_logo) {
				  // #ifdef APP-PLUS
				  setTimeout(function() {
					  plus.runtime.openURL(that.share_logo)
				  }, 500)
				  // #endif
			  }
		  },
		  // 关闭评价弹窗
		  popCloseEvaluate() {
			  this.isShowEvaluate = false
		  },
		  async appUpdate() {
			  const {
				  data,
				  status
			  } = await this.$store.dispatch('setAppUpdate', {
				  appid: this.updateAppid
			  });

			  if (status == 'success') {
				  this.versionData = data
				  this.versionDataFunction()
			  }
		  },
		  // setNewUserCoupons
		  newUserData() {
			  // 获取新人优惠券
			  this.$store.dispatch('setNewUserCoupons', {
				  app_version: incrementVersion()

			  }).then(res => {
				  // 【修复】无论接口返回的数据是否为空，都要更新 receiveData
				  if (res.status == 'success' && res.data) {
					  this.receiveData = res.data;
				  }

				  // 【修复】只在第一次调用时获取店铺优惠券，避免每次进入首页都显示
				  if (!this.storeCouponLoaded) {
					  this.getStoreCoupons();
					  this.storeCouponLoaded = true;
				  }
			  })

		  },
		  // 【新增】只获取新人优惠券数据（用于onShow中，避免重复获取店铺优惠券）
		  getNewUserCouponsOnly() {
			  this.$store.dispatch('setNewUserCoupons', {
				  app_version: incrementVersion()
			  }).then(res => {
				  // 【修复】无论接口返回的数据是否为空，都要更新 receiveData
				  if (res.status == 'success' && res.data) {
					  this.receiveData = res.data;
					  console.log(res.data)
				  }
				  // 注意：这里不调用 getStoreCoupons()，避免重复显示店铺优惠券
			  })
		  },

		  // 获取店铺优惠券
		  getStoreCoupons() {
			  this.$store.dispatch('setWebCoupon', {
				  page: 1,
				  size: 10,
				 
				 status: 0,
				 cou_id: 0,
			  }).then(res => {
				
				  // 注意：getWebCoupon 返回的数据格式是 { data: [...], size, page }
				  if (res && res.data && res.data.length > 0) {
					  this.storeCouponData = res.data;
					
				  } else {
					  this.storeCouponData = [];
					 
				  }
				  
				  // 判断是否显示弹窗
				  this.checkShowPopup();
			  }).catch(err => {
				  
				  this.storeCouponData = [];
				  this.checkShowPopup();
			  })
		  },
		  // 检查是否显示弹窗（新人与店铺优惠券互斥：有新人只显新人）
		  checkShowPopup() {
			  if (this.receiveData.length > 0 || this.storeCouponData.length > 0) {
				  this.receiveStutas = true;
				  try {
					  const sys = uni.getSystemInfoSync();
					  const w = (sys && (sys.windowWidth ?? sys.screenWidth)) || 375;
					  this.receivePopupWidthPx = Math.round(w * 680 / 750);
				  } catch (e) {}
				  if (this.receiveData.length > 0) {
					  this.startNewUserTimers();
				  } else if (this.storeCouponData.length > 0) {
					  this.startStoreCouponTimer();
				  }
			  } else {
				  this.receiveStutas = false;
			  }
		  },
		  // 新人优惠弹窗：启动倒计时与关闭倒计时
		  startNewUserTimers() {
			  this.stopNewUserTimers();
			  this.newUserTotalMilliseconds = 10 * 60 * 1000;
			  this.newUserCloseCountdown = 10;
			  this.newUserMinutes = 10;
			  this.newUserSeconds = 0;
			  this.newUserCentiseconds = 0;
			  const that = this;
			  this.newUserCountdownTimer = setInterval(() => {
				  if (that.newUserTotalMilliseconds > 0) {
					  that.newUserTotalMilliseconds -= 10;
				  }
				  that.newUserMinutes = Math.floor(that.newUserTotalMilliseconds / 60000);
				  that.newUserSeconds = Math.floor((that.newUserTotalMilliseconds % 60000) / 1000);
				  that.newUserCentiseconds = Math.floor((that.newUserTotalMilliseconds % 1000) / 10);
			  }, 10);
			  this.newUserCloseTimer = setInterval(() => {
				  if (that.newUserCloseCountdown > 0) {
					  that.newUserCloseCountdown--;
				  } else {
					  that.handelClose('receive');
				  }
			  }, 1000);
		  },
		  stopNewUserTimers() {
			  if (this.newUserCountdownTimer) {
				  clearInterval(this.newUserCountdownTimer);
				  this.newUserCountdownTimer = null;
			  }
			  if (this.newUserCloseTimer) {
				  clearInterval(this.newUserCloseTimer);
				  this.newUserCloseTimer = null;
			  }
		  },
		  // 轮播切换事件（保留兼容，店铺券单页后可不触发）
		  onCouponSwiperChange(e) {
			  this.couponSwiperIndex = e.detail.current;
		  },
		  // 跳转到店铺优惠券页面
		  goStoreCoupon() {
			  uni.navigateTo({
				  url: '/pagesA/coupon/coupon'
			  })
		  },
		  // 启动店铺优惠券倒计时
		  startStoreCouponTimer() {
			  if (this.storeCouponTimer) {
				  clearInterval(this.storeCouponTimer);
			  }
			  if (this.storeCouponCloseTimer) {
				  clearInterval(this.storeCouponCloseTimer);
			  }
			  this.storeCouponCloseCountdown = 10;
			  const that = this;
			  this.storeCouponCloseTimer = setInterval(() => {
				  if (that.storeCouponCloseCountdown > 0) {
					  that.storeCouponCloseCountdown--;
				  } else {
					  that.handelClose('receive');
				  }
			  }, 1000);
			  
			  // 每 10ms 更新一次，最后一位显示百分秒（00-99），如 19、29、30、49
			  this.storeCouponTimer = setInterval(() => {
				  if (this.storeCouponTotalMilliseconds > 0) {
					  this.storeCouponTotalMilliseconds -= 10;
				  const totalSeconds = Math.floor(this.storeCouponTotalMilliseconds / 1000);
				  this.storeCouponMinutes = Math.floor(totalSeconds / 60);
				  this.storeCouponSeconds = totalSeconds % 60;
				  // 百分秒 0-99（每 10ms 变一次），显示 19、29、30、49 等两位
				  this.storeCouponMilliseconds = Math.floor((this.storeCouponTotalMilliseconds % 1000) / 10);
				  } else {
					  this.storeCouponTotalMilliseconds = 10 * 60 * 1000;
					  this.storeCouponMinutes = 10;
					  this.storeCouponSeconds = 0;
					  this.storeCouponMilliseconds = 0;
				  }
			  }, 10);
		  },
		  // 停止店铺优惠券倒计时
		  stopStoreCouponTimer() {
			  if (this.storeCouponTimer) {
				  clearInterval(this.storeCouponTimer);
				  this.storeCouponTimer = null;
			  }
			  if (this.storeCouponCloseTimer) {
				  clearInterval(this.storeCouponCloseTimer);
				  this.storeCouponCloseTimer = null;
			  }
			  this.storeCouponCloseCountdown = 10;
		  },
		  // 新人专享商品列表
		  newUserGoodsData() {
			  this.$store.dispatch('setNewUserGoods', {
				   app_version: incrementVersion(),
				  page: 1,
			  }).then(res => {
				  if (res.status == 'success') {

					  this.userGoodsList = res.data;
					 
				  }
			  })

		  },
		  updateAppStore() {
			  plus.runtime.openURL(this.versionData.content.download_url)
		  },
		  // 点击领取新人优惠券
		  receiveCoupons() {
			
		  },
		  clickCategoryNav(e) {
			  let height = 0;
			  this.$refs.jump.forEach((v) => {
				  height += v.height;
			  })

			  this.jumpHeight = height;
		  },
		  loadMore() {
			  var that = this
			  if (that.loadMoreStatus === 'loading' || that.loadMoreStatus === 'noMore' || !that.hasMore) return
			  if (that.prolist.length < that.page * that.pageSize) return
			  if (that._lastGoodsListLoadedPage !== that.page) return
			  that.loadMoreStatus = 'loading'
			  that.page++
			  that.getGoodsList()
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
			
			  if (result == 1) {
				  // 此处处理各自业务 如：uni.chooseImage
				  uni.scanCode({
					  success: (res) => {
						  if (this.$isLogin()) {
							  let result = JSON.parse(res.result);
							  let sid = result.sid;
							  let url = result.url;
							  let timestamp = Date.parse(new Date()) / 1000;
							
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
			  uni.navigateTo({
				  url: '/pagesD/middles/index'
			  })
			  return;
			  uni.chooseImage({
				  count: 1,
				  sizeType: ['compressed'],
				  sourceType: ['camera'],
				  // crop:{
				  // 	quality:50,
				  // 	width:30,
				  // 	height:30,
				  // 	resize:true
				  // },
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
								  that.uploadImage(val);
							  },
							  fail: (result) => {
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
			  
			  // var result1 = await permision.premissionCheck("RECORD_AUDIO")
			  // var result2 = await permision.premissionCheck("ACCESS_NETWORK_STATE")
			  if (result == 1) {
				  
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
			  });
		  },

		  versionDataFunction() {
			  var that = this
			  let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
			 
			  let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));

			  let version = Number(wgtinfo.version.replace(/\./g, ''));
			  let version_id = that.versionData.content.version_id ? Number(that.versionData.content.version_id.replace(
					  /\./g, '')) :
				  0;
			 
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
						
						  uni.hideLoading()
						  if (res_1.data.status == "success") {
							  that.goodsDetail.upc = res_1.data.data
						  }
					  }
				  })
				  if (that.$refs['goodsattr']) {
				  that.$refs['goodsattr'].open();
				  }
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

			  // uni.showToast({
			  // 	title: that.$t('lang.added_to_cart'),
			  // 	icon: 'success',
			  // 	duration: 500
			  // });


			  // that.closePop('goodsattr');

			
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
			 
			  if (this.$refs[res]) this.$refs[res].open()

			  if (res == 'address') {
				  this.regionShow = true;
			  }
		  },
		  // 关闭底部弹框
		  closePop(res) {
			  if (this.$refs[res]) this.$refs[res].close()
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
					  'token': uni.getStorageSync('token') || '',
					  'X-Client-Hash': uni.getStorageSync('client_hash') || ''
				  },
				  success: (res) => {
					  try {
						  // 确保 res.data 存在且是对象
						  if (res.data && typeof res.data === 'object') {
							  this.localShow = res.data.data?.wap_index_pro === 1;
							  // 【修复】使用 uni.setStorageSync 替代 localStorage.setItem，兼容小程序和 H5
							  uni.setStorageSync('localShow', this.localShow);
							  this.androidUrl = res.data.data?.wap_app_android || '';
							  this.iosUrl = res.data.data?.wap_app_ios || '';
						  } else {
							  this.localShow = false;
						  }
					  } catch (e) {
						  this.localShow = false;
					  }
				  },
				  fail: (err) => {
					  this.localShow = false;
				  }
			  });
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
// this.getCenterLine();
// this.initScrollListener();
		  const {
			  windowHeight,
			  windowWidth
		  } = uni.getSystemInfoSync();
		  this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
		  this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
		  this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
				
		  // 延迟计算占位高度，确保 tabbar 完全渲染后再计算
		  // 使用 $nextTick + setTimeout 确保 DOM 完全渲染和 tabbar 显示完成
		  this.$nextTick(() => {
			  setTimeout(() => {
				  this.calculateHeightDifference();
			  }, 300); // 延迟 300ms，确保 tabbar 渲染完成
		  });
		  
		  // 通知TabBar首页已加载
		  uni.$emit('home-page-ready');
	  },
	  watch: {
		  // 监听 eightJin 显示状态变化，自动重新计算高度差
		  shouldShowEightJin(newVal, oldVal) {
			  // 当 eightJin 显示状态发生变化时，重新计算高度差
			  if (newVal !== oldVal) {
				  this.$nextTick(() => {
					  setTimeout(() => {
						  this.calculateHeightDifference();
					  }, 100); // 延迟 100ms 确保 DOM 更新完成
				  });
			  }
		  },
		  onelist() {
			  if (this.onelist.length > 0) {
				  this.dscLoading = false
			  }
		  },
	  }
  }
</script>

<style lang="scss">
// 防止键盘弹起时页面移动
.uni-page-body {
	/* #ifdef MP-WEIXIN */
	position: relative;
	overflow-x: hidden;
	/* #endif */
	/* #ifdef APP-PLUS */
	position: relative;
	overflow-x: hidden;
	/* #endif */
	/* #ifdef H5 */
	position: relative;
	overflow-x: hidden;
	/* #endif */
}

.middles-page {
	/* 顶部区域：search + 金刚区 统一背景 */
	/* 注意：不能用 overflow:hidden，iOS 上会导致 fixed 的 search 被下方 waterFall 盖住 */
	.header-with-bg {
		position: relative;
		background-color: #F9F9F9;
	}
	.header-with-bg.has-header-bg {
		background-color: transparent;
	}
	/* 有背景图：未滚动半透明，滚动后 0.88。APP 上 search 已有背景，input_view 透明避免叠加 */
	.header-with-bg.has-header-bg:not(.header-scrolled) .input_view {
		background-color: rgba(255, 255, 255, 0.58) !important;
	}
	/* #ifdef APP-PLUS */
	.header-with-bg.has-header-bg.header-scrolled .input_view {
		background-color: transparent !important;
	}
	/* #endif */
	/* #ifndef APP-PLUS */
	.header-with-bg.has-header-bg.header-scrolled .input_view {
		background-color: rgba(255, 255, 255, 0.88) !important;
	}
	/* #endif */
	.header-with-bg.has-header-bg .king-kong-nav {
		background-color: #ffffff !important; /* 白色不透明 */
	}
	/* 有背景图：未滚动选中白色，滚动后选中红色 */
	.header-with-bg.has-header-bg:not(.header-scrolled) .tab-bar1 .tab-item.active text {
		color: #fff !important;
	}
	.header-with-bg.has-header-bg:not(.header-scrolled) .tab-bar1 .tab-item.active text:after {
		border-bottom-color: #fff;
	}
	/* 仅在未滚动（彩色背景）时：柔和黑色系文字；滚动后白底用默认深色 */
	.header-with-bg.has-header-bg:not(.header-scrolled) .placeholder_text {
		color: #444 !important;
	}
	.header-with-bg.has-header-bg:not(.header-scrolled) .input_view image {
		filter: brightness(0.4);
	}
	.header-with-bg.has-header-bg:not(.header-scrolled) .tab-bar1 .tab-item:not(.active) text {
		color: #444 !important;
	}
	.header-with-bg.has-header-bg:not(.header-scrolled) .tab-bar1 .all-text text,
	.header-with-bg.has-header-bg:not(.header-scrolled) .tab-bar1 .all-text .iconfont {
		color: #444 !important;
	}
	.header-with-bg.has-header-bg.header-scrolled .tab-bar1 .tab-item.active text {
		color: #f92028 !important;
	}
	.header-with-bg.has-header-bg.header-scrolled .tab-bar1 .tab-item.active text:after {
		border-bottom-color: #FE0302;
	}
	.header-bg-layer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0; /* 限制高度，不超出 header */
		height: 100%;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.header-bg-gradient {
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom, #FE6636 0%, #FE6636 45%, #ffffff 55%, #ffffff 100%);
	}
	.header-bg-image {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
	.header-with-bg .search_container,
	.header-with-bg .nav {
		position: relative;
		z-index: 1;
	}
	::v-deep .uni-mask {
		z-index: 99999999999998 !important;
	}

	::v-deep .uni-popup {
		z-index: 99999999999 !important;
	}
}

  .jiangbei {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  width: 100%;
	  height: 160rpx;
	  border-radius: 20rpx;
	  background-repeat: no-repeat;
	  background-position: center center;
	  background-size: cover;
	  margin-bottom: 20rpx;
	  position: relative;
	  z-index: 1;

	  .hotSell,
	  .speicalSell {
		  height: 168rpx; // 高度保持不变
		  background-repeat: no-repeat;
		  background-position: center center;
		  background-size: cover;
		  z-index: 1;
	  }

	  // 特卖模块默认宽度（仅在显示时生效）

	  .speicalSell {
		  width: 160rpx;
	  }
  }

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

	  .left-col {
		  margin-right: 8rpx;

	  }

	  .right-col {
		  margin-left: 8rpx;

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
	  // width: 345rpx;
	  background: #fff;
	  border-radius: 16rpx;
	  margin-bottom: 20rpx;
	  overflow: hidden;
	  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

	  .img-box {
		  min-height: 340rpx;
		  min-width: 340rpx;
		  line-height: 0;
		  position: relative;
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


  .search {
	    z-index: 99999 !important;
	  // margin-top: 10rpx;
  }

  .search_container {
	  z-index: 99999 !important;

	  .status_bar {
		  // background-color: #ffffff;
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
		  // background-color: #ffffff;
		  // margin-top: 5px;
	  }

	  .input_view {
		  /* #ifdef H5 */
		  margin-top: 16rpx;
		  /* #endif */
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
			  min-width: 62rpx;
			  /* #ifdef H5 */
			  padding: 10rpx 38rpx;
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
	  z-index: 199;
	  width: 100%;
  }

  /* 如果导航栏透明，需要设置不透明背景 */
  .position-fixed.transparent {
	  background: rgba(255, 255, 255, 0.98);
	  backdrop-filter: saturate(180%) blur(20px);
	  -webkit-backdrop-filter: saturate(180%) blur(20px);
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
		  top: 300rpx;
		  left: 0;
		  height: 100%;
		  width: 100%;

		  background-color: #000;
		  opacity: 0.6;

		  z-index: 99;
	  }

	  .local_show_false {
		  position: fixed;
		  top: 110rpx !important;
	  }

	  .all_categories_label,
	  .all_categories_label-h5 {
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
			  justify-content: flex-start;
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
					  width: 148rpx;
					  height: 60rpx;
					  line-height: 60rpx;
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

	  .all_categories_label-h5 {

		  top: 210rpx;

	  }
  }

  .visual-adv {
	  padding: 0upx 20upx 0 20upx;
	  margin: 20rpx 0;
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

  .visual-adv-swiper-wrap {
	  position: relative;
  }

  .visual-adv.visual-adv-swiper {
	  padding-bottom: 0;
  }

  .visual-adv-banner-swiper .bg-img {
	  position: relative;
	  width: 100%;
  }

  .visual-adv-banner-swiper .bg-img .img {
	  display: block;
	  vertical-align: top;
	  width: 100%;
  }

  .visual-adv-banner-swiper .adv-goods-list {
	  margin-top: 0;
  }

  /* 指示点叠在 banner 图片底部 20px 处，横向居中 */
  .visual-adv-dots {
	  position: absolute;
	  left: 0;
	  right: 0;
	  bottom: 40rpx;
	  display: flex;
	  justify-content: center;
	  z-index: 2;
	  pointer-events: none;
  }

  .visual-adv-dots .dot {
	  margin: 0 6upx;
	  width: 12upx;
	  height: 12upx;
	  background: rgba(255, 255, 255, 0.5);
	  border-radius: 6upx;
  }

  .visual-adv-dots .dot.active {
	  background: #F20E28;
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
	  // margin: 20rpx 20rpx 0;
	  margin-left: 20rpx;
	  margin-right: 20rpx;
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
	  position: relative;
  }

  .waterfall-wrapper {}

  .waterfall-wrapper .info-box {
	  padding: 14rpx 14rpx 14rpx 14rpx;

		  /* 方案1：与促销标签间隔 1px，避免 iOS line-clamp 裁剪露线；方案2：统一行高减轻裁剪偏差 */
		  .goods-name {
			  line-height: 28rpx;
			  margin-bottom: 1px;
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

		  .promo-tags-container {
			  overflow-x: auto;
			  overflow-y: hidden;
			  display: flex;
			      flex-wrap: nowrap;
			  // white-space: nowrap;
		  }

		  .promo-tags-container > view {
			  display: inline-flex;
			  // white-space: nowrap;
			  flex-shrink: 0;
			  margin-right: 8rpx;
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

  .product-new .goods-list .item .info-box {
	  padding: 20rpx 20rpx 0rpx 20rpx;
  }

  .info-box .goods-name {
	  align-items: baseline;

	  .goods-name-text {
		  font-weight: 400;
		  font-size: 28rpx;
		  color: #4D4B4B;
		  line-height: 28rpx;
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
		  line-height: 28rpx;
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
		  line-height: 28rpx;
		  // display: inline-block;
		  vertical-align: bottom;
		  /* 关键：对齐底部基线 */
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
		  margin-top: 30rpx;
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
	  .eightTop {
		  display: flex;
	  }

	  // .eightJin {
	  // 		background: #555;
	  // 	    color: #fff;
	  // 	    border-radius: 4px;
	  // 	    display: flex;
	  // 	    justify-content: center;
	  // 	    align-items: center;
	  // 	    padding: 8rpx;
	  // 	    flex-direction: row;
	  // 		.imgEight {
	  // 			height: 24rpx;
	  // 			width:24rpx;
	  // 			font-size: 24rpx;
	  // 			padding: 12rpx;
	  // 		}
	  // }
	  .eightJin {
		  font-size: 24rpx;
		  margin-top: 16rpx;
		  border-radius: 4px;
		  background-color: rgba(5, 5, 5, 0.8);
		  color: white;
		  padding: 8rpx 0;
		  display: flex;
		  justify-content: space-around;
		  align-items: center;



		  /* 过渡效果 */
		  opacity: 1;
		  transform: translateX(0);
		  transition: all 0.3s ease;
	  }

	  .eightJin.fade-out {
		  opacity: 0;
		  transform: translateX(100%);
	  }

	  .imgEight {
		  height: 24rpx;
		  width: 24rpx;
		  font-size: 24rpx;
		  padding: 12rpx;
		  padding-left: 6rpx;
	  }

	  .shipin_2-label {

		  // padding-left: 16rpx;
		  .shipin_2-left {
			  background: linear-gradient(to bottom, #FFE0E0 10%, #ffffff 40%, #ffffff 50%);
			  // background: linear-gradient( 164deg, #FFFFFF 0%, #FFE0E0 100%);
			  box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05), 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
			  border-radius: 20rpx;
			  padding: 16rpx;
			  margin-right: 8rpx;
			  padding-top: 8rpx;

			  .shipin_text {
				  font-family: PingFangSC, PingFang SC;
				  font-weight: 400;
				  font-size: 24rpx;
				  color: #363636;
			  }
		  }

	  }

	  .shipin_2-right {
		  background: linear-gradient(to bottom, #FFF0D1 10%, #ffffff 40%, #ffffff 50%);
		  box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.05), 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
		  border-radius: 20rpx;
		  padding: 16rpx;
		  padding-top: 8rpx;
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

  .shititle2 {
	  font-weight: 600;
	  font-size: 32rpx;
	  color: #D27D11;
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
	  display: inline-flex;
	  flex-direction: row;
	  flex-wrap: nowrap;
	  align-items: center;
	  justify-content: center;
	  box-sizing: border-box;
	  background-color: #FE0302;
	  color: #ffffff;
	  font-size: 24rpx;
	  border-radius: 10rpx;
	  padding: 6rpx 12rpx;
	  min-height: 32rpx;
	  height: auto;
	  line-height: 1.25;
	  white-space: nowrap;
	  max-width: 100%;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  /* #ifdef APP-PLUS */
	  margin: 0 auto;
	  /* #endif */
	  /* #ifdef MP-WEIXIN */
	  margin: 0 auto;
	  min-height: 36rpx;
	  /* #endif */
	  /* #ifdef H5 */
	  margin: 0 auto;
	  /* #endif */
  }

  .newPrice-currency {
	  flex-shrink: 0;
	  font-size: 22rpx;
  }

  .newPrice-num {
	  flex-shrink: 1;
	  min-width: 0;
	  font-size: 24rpx;
	  font-weight: 600;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
  }

  .newPrices {
	  display: inline-flex;
	  flex-direction: row;
	  flex-wrap: nowrap;
	  align-items: center;
	  box-sizing: border-box;
	  font-family: PingFangSC, PingFang SC;
	  font-weight: 600;
	  font-size: 24rpx;
	  color: #FE2F02;
	  line-height: 1.25;
	  max-width: 100%;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
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

  /* 金刚区整体居中 */
  .king-kong-wrap {
	  display: flex;
	  justify-content: center;
	  width: 100%;
	  // padding: 0 24rpx 20rpx;
  }
  /* 金刚区整体悬浮效果：整个区域像一张悬浮卡片，白底不透明 */
  .king-kong-nav-float {
	  width: 100%;
	  max-width: 702rpx;
	  border-radius: 20rpx;
	  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	  overflow: hidden;
	  background-color: #ffffff;
  }
  .king-kong-nav {
	  width: 100%;
	  display: flex;
	  justify-content: start;
	  background-color: #fff;

	  .nav-label {
		  width: 100%;
		  padding: 0 20rpx 20rpx;
		  overflow: hidden;
	  }
	  .king-kong-swiper {
		  height: 360rpx; /* 两排高度 */
	  }

	  /* #ifdef MP-WEIXIN */
	  /* 小程序专版：独立类名，避免被旧的 .nav .list .icon .image 规则覆盖 */
	  .king-kong-swiper-mp {
		  width: 100%;
		  height: 360rpx;
	  }
	  .nav-list-mp {
		  width: 100%;
		  height: 360rpx;
		  display: flex;
		  flex-wrap: wrap;
		  align-content: flex-start;
		  overflow: hidden;
		  box-sizing: border-box;
		  line-height: 1.5;
	  }
	  .kk-cell-mp {
		  width: 20%;
		  height: 180rpx;
		  box-sizing: border-box;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: flex-start;
	  }
	  .kk-icon-mp {
		  width: 96rpx;
		  height: 96rpx;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  overflow: hidden;
		  margin: 12rpx auto 0;
	  }
	  .kk-image-mp {
		  width: 96rpx;
		  height: 96rpx;
		  display: block;
	  }
	  .kk-con-mp {
		  margin-top: 6rpx;
		  font-size: 24rpx;
		  color: #2D2D2D;
		  font-weight: 500;
		  text-align: center;
		  line-height: 1.3;
		  max-width: 100%;
		  padding: 0 4rpx;
		  box-sizing: border-box;
		  overflow: hidden;
		  text-overflow: ellipsis;
		  white-space: nowrap;
	  }
	  /* #endif */

	  /* 金刚区轮播指示：选中=横杠，未选中=点 */
	  .king-kong-indicator {
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  gap: 12rpx;
		  padding-bottom: 16rpx;
	  }
	  .king-kong-indicator-item.dot {
		  width: 12rpx;
		  height: 12rpx;
		  border-radius: 50%;
		  background: rgba(0, 0, 0, 0.2);
	  }
	  .king-kong-indicator-item.bar {
		  width: 32rpx;
		  height: 8rpx;
		  border-radius: 4rpx;
		  background: #FE0302;
	  }
	  .nav-label .nav-list {
			  width: 100%;
			  display: flex;
		  flex-wrap: wrap;
			  overflow: hidden;
			  line-height: 1.5;
		  height: 100%;
		  box-sizing: border-box;
		  }

		  .list {
			  width: 20%; // 一排5个，每个占20%宽度
			  box-sizing: border-box;
			  // padding: 0 10rpx;
			  display: flex;
			  flex-direction: column;
			  align-items: center;
			  margin-bottom: 10rpx;

			  .icon {
				  .image {
					  min-width: 72px;
				  }
			  }

			  .con {
				  white-space: normal;
				  height: auto;
				  width: 100%;
				  text-align: center;
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

  /* 通知权限弹窗 - 底部弹出样式 */
  .notification-modal-wrapper {
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  z-index: 9999;
	  display: flex;
	  align-items: flex-end;
	  justify-content: center;
  }

  .notification-modal-backdrop {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.4);
	  backdrop-filter: blur(10rpx);
	  -webkit-backdrop-filter: blur(10rpx);
	  animation: fadeIn 0.25s ease-out;
  }

  .notification-modal-bottom {
	  position: relative;
	  width: 100%;
	  background-color: #ffffff;
	  border-top-left-radius: 32rpx;
	  border-top-right-radius: 32rpx;
	  overflow: hidden;
	  animation: slideUpFromBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	  z-index: 10000;
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
  }

  .notification-modal-title {
	  font-size: 36rpx;
	  font-weight: 600;
	  color: #000000;
	  text-align: center;
	  padding: 40rpx 40rpx 30rpx;
	  line-height: 1.4;
  }

  .notification-modal-content-wrapper {
	  padding: 0 40rpx 30rpx;
  }

  .notification-modal-bg {
	  position: relative;
	  width: 100%;
	  border-radius: 20rpx;
	  overflow: hidden;
	  min-height: 400rpx;
  }

  .notification-modal-bg-image {
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  left: 0;
	  object-fit: cover;
  }

  .notification-modal-content-inner {
	  position: relative;
	  z-index: 1;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  padding: 60rpx 40rpx;
	  min-height: 400rpx;
  }

  .notification-modal-logo {
	  width: 120rpx;
	  height: 120rpx;
	  margin-bottom: 30rpx;
  }

  .notification-modal-shop-name {
	  font-size: 36rpx;
	  font-weight: 600;
	  color: #000000;
	  margin-bottom: 16rpx;
  }

  .notification-modal-desc {
	  font-size: 28rpx;
	  color: #666666;
	  text-align: center;
	  line-height: 1.5;
  }

  .notification-modal-actions-bottom {
	  padding: 0 40rpx 40rpx;
  }

  .notification-modal-btn-primary {
	  width: 100%;
	  height: 88rpx;
	  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
	  border-radius: 44rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: 32rpx;
	  font-weight: 600;
	  color: #ffffff;
	  transition: opacity 0.2s;
  }

  .notification-modal-btn-primary:active {
	  opacity: 0.8;
  }

  @keyframes slideUpFromBottom {
	  from {
		  transform: translateY(100%);
	  }
	  to {
		  transform: translateY(0);
	  }
  }

  @keyframes fadeIn {
	  from {
		  opacity: 0;
	  }
	  to {
		  opacity: 1;
	  }
  }

  @keyframes slideUp {
	  from {
		  opacity: 0;
		  transform: translateY(40rpx) scale(0.95);
	  }
	  to {
		  opacity: 1;
		  transform: translateY(0) scale(1);
	  }
  }

  /* 保留原有样式，避免影响其他弹窗 */
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
		  font-size: 24rpx;
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





  .header-section .uni-popup-middle {
	  padding: 0;
	  width: 80%;
	  height: auto;
	  background: none;
	  box-shadow: none;
  }

  .header-section .uni-popup-middle .close,
  .header-section .uni-popup-middle .close-on {
	  width: 100rpx;
	  height: 100rpx;
	  line-height: 30upx;
	  position: relative;
	  bottom: -100px;

  }

  .header-section .uni-popup-middle .version-popup {
	  position: relative;
	  width: 100%;
	  height: 100%;
	  z-index: 9999;
  }

  .header-section .uni-popup-middle .version-popup .version-text {
	  position: absolute;
	  top: 15%;
	  left: 12%;
	  color: #FFFFFF;
	  z-index: 2;
  }

  .header-section .uni-popup-middle .version-popup .version-text .tit {
	  font-size: 32upx;
  }

  .header-section .uni-popup-middle .version-popup .close {
	  bottom: -20%;
	  right: 42%;
	  z-index: 2;
  }

  .header-section .uni-popup-middle .version-popup .close-on {
	  top: -5%;
	  right: 0;
	  z-index: 2;
  }

  .header-section .uni-popup-middle .version-popup .save-picture {
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

  .header-section .uni-popup-middle .version-popup .upgrade {
	  width: 100%;
	  position: relative;
	  z-index: 1;
  }

  .header-section .uni-popup-middle .version-popup .version-notic {
	  position: absolute;
	  color: #666666;
	  margin: 0 15%;
	  top: 48%;
	  text-align: center;
	  z-index: 2;
  }

  .header-section .uni-popup-middle .version-popup .version-btn {
	  position: absolute;
	  bottom: 15%;
	  width: 100%;
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  z-index: 2;
  }

  .header-section .uni-popup-middle .version-popup .version-btn .btn {
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
	  // background: #FFFFFF;
	  display: flex;
	  // gap:30rpx;
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
		  font-size: 20rpx;
		  transform: rotate(90deg);
	  }
  }

  .tab-bar1 .tab-item {
	  display: flex;
	  // flex: 1 1 0%;
	  justify-content: center;
	  align-items: center;
	  margin-right: 30rpx;
	  // background: #FFFFFF;
  }
  .tab-bar1 .tab-item:last-child {
	margin-right: 0;
  }
.tab-bar1 .all-text {
margin-left: auto; /* 让全部分类靠右 */
display: flex;
align-items: center;
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
		  padding: 0 16rpx 0 0;
		  font-weight: 500;
		  font-size: 20px;
		  color: yellowgreen;
		  line-height: 20px;
		  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
	  }



	  .mid-num {
		  font-size: 20rpx;
		  line-height: 20rpx;
		  color: #f23030;
		  padding: 0 16rpx 8rpx 0;
	  }

	  .right-num {
		  font-weight: 400;
		  font-size: 20rpx;
		  color: #A2A2A2;
		  line-height: 20rpx;
		  text-shadow: 0px 0px 12rpx rgba(0, 0, 0, 0.05);
		  padding: 0 0 8rpx 0;
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
		  text-shadow: 0px 0px 12rpx rgba(0, 0, 0, 0.05);
		  font-style: normal;
		  margin-right: 16rpx;
		  font-size: 24rpx;
	  }

	  .shop-name {
		  font-size: 24rpx;
		  line-height: 24rpx;
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

  .second-label {
	  color: #A2A2A2;
	  font-size: 12px;
	  font-weight: 400;
	  line-height: 12px;
	  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
	  font-style: normal;
  }







.receive-popup {
 position: relative;
 width: 680rpx;
 max-width: 100%;
 box-sizing: border-box;
 display: flex;
 flex-direction: column;
 align-items: center;
 overflow: visible;
 transform-origin: center center;
 animation: coupon-popup-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
@keyframes coupon-popup-bounce-in {
 0% { transform: scale(0) rotate(-10deg); opacity: 0; }
 100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* ========== 新人优惠弹窗（参考图百分百还原） ========== */
.newuser-popup-wrap {
 position: relative;
 width: 680rpx;
 max-width: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
}

.newuser-glow-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 680rpx;
 height: 680rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(255, 59, 92, 0.4);
 pointer-events: none;
 animation: newuser-ring-expand 3s ease-out infinite;
}

.newuser-glow-ring-2 { animation-delay: 1s; }
.newuser-glow-ring-3 { animation-delay: 2s; }

@keyframes newuser-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 860rpx; height: 860rpx; opacity: 0; }
}

.newuser-light-rays {
 position: absolute;
 width: 100%;
 height: 100%;
 top: 0;
 left: 0;
 pointer-events: none;
}

.newuser-ray {
 position: absolute;
 width: 16rpx;
 height: 16rpx;
 background: #FFD700;
 border-radius: 50%;
 box-shadow: 0 0 40rpx #FFD700, 0 0 80rpx #FFD700;
 animation: newuser-ray-float 4s ease-in-out infinite;
}

.newuser-ray:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
.newuser-ray:nth-child(2) { top: 25%; right: 12%; left: auto; animation-delay: 0.5s; }
.newuser-ray:nth-child(3) { top: 45%; left: 15%; animation-delay: 1s; }
.newuser-ray:nth-child(4) { top: 35%; right: 18%; left: auto; animation-delay: 1.5s; }
.newuser-ray:nth-child(5) { top: 65%; left: 12%; animation-delay: 2s; }
.newuser-ray:nth-child(6) { top: 55%; right: 15%; left: auto; animation-delay: 2.5s; }

@keyframes newuser-ray-float {
 0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
 50% { opacity: 1; transform: translateY(-40rpx) scale(1); }
}

.newuser-popup-box {
 width: 640rpx;
 max-width: 100%;
 box-sizing: border-box;
 padding: 0 24rpx;
 background: linear-gradient(135deg, #FF3B5C 0%, #FF6B6B 50%, #FF3B5C 100%);
 border-radius: 48rpx;
 overflow: hidden;
 box-shadow: 0 0 120rpx rgba(255, 59, 92, 0.7), 0 0 240rpx rgba(255, 59, 92, 0.5), 0 40rpx 120rpx rgba(0, 0, 0, 0.3);
 position: relative;
 animation: newuser-glow-pulse 2s ease-in-out infinite;
}

@keyframes newuser-glow-pulse {
 0%, 100% { box-shadow: 0 0 120rpx rgba(255, 59, 92, 0.7), 0 0 240rpx rgba(255, 59, 92, 0.5), 0 40rpx 120rpx rgba(0, 0, 0, 0.3); }
 50% { box-shadow: 0 0 160rpx rgba(255, 59, 92, 0.9), 0 0 320rpx rgba(255, 59, 92, 0.7), 0 40rpx 120rpx rgba(0, 0, 0, 0.3); }
}

.newuser-popup-header {
 padding: 50rpx 30rpx 36rpx;
 position: relative;
 overflow: hidden;
}

.newuser-shine-effect {
 position: absolute;
 top: 0;
 left: -100%;
 width: 100%;
 height: 100%;
 background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
 animation: newuser-shine 3s ease-in-out infinite;
}

@keyframes newuser-shine {
 to { left: 100%; }
}

.newuser-coins {
 position: absolute;
 width: 100%;
 height: 100%;
 top: 0;
 left: 0;
 pointer-events: none;
 z-index: 0;
}

.newuser-coin {
 position: absolute;
 width: 70rpx;
 height: 70rpx;
 line-height: 70rpx;
 text-align: center;
 font-size: 36rpx;
 font-weight: bold;
 color: #FF6F00;
 background: linear-gradient(135deg, #FFD700, #FFA500);
 border-radius: 50%;
 border: 4rpx solid #FFA500;
 box-shadow: 0 8rpx 24rpx rgba(255, 215, 0, 0.6);
 animation: newuser-coin-float 4s ease-in-out infinite;
}

.newuser-coin:nth-child(1) { top: 8%; left: 8%; animation-delay: 0s; }
.newuser-coin:nth-child(2) { top: 18%; right: 12%; left: auto; animation-delay: 0.5s; }
.newuser-coin:nth-child(3) { top: 38%; left: 12%; animation-delay: 1s; }
.newuser-coin:nth-child(4) { top: 28%; right: 8%; left: auto; animation-delay: 1.5s; }
.newuser-coin:nth-child(5) { top: 50%; left: 5%; animation-delay: 2s; }
.newuser-coin:nth-child(6) { top: 45%; right: 5%; left: auto; animation-delay: 2.5s; }

@keyframes newuser-coin-float {
 0%, 100% { opacity: 0.4; transform: translateY(0) rotate(0deg); }
 50% { opacity: 0.8; transform: translateY(-25rpx) rotate(180deg); }
}

.newuser-header-title {
 display: block;
 font-size: 52rpx;
 color: #fff;
 text-align: center;
 font-weight: 800;
 margin-bottom: 20rpx;
 text-shadow: 0 6rpx 30rpx rgba(0, 0, 0, 0.4);
 letter-spacing: 6rpx;
 position: relative;
 z-index: 1;
}

.newuser-header-subtitle {
 display: block;
 font-size: 28rpx;
 color: rgba(255, 255, 255, 0.95);
 text-align: center;
 position: relative;
 z-index: 1;
 margin-bottom: 40rpx;
}

.newuser-coupons-section {
 width: 100%;
 box-sizing: border-box;
 background: rgba(255, 255, 255, 0.25);
 padding: 36rpx 24rpx;
 margin: 0 0 36rpx;
 border-radius: 40rpx;
 border: 4rpx solid rgba(255, 255, 255, 0.5);
 box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.2);
}

.newuser-coupons-grid {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 gap: 20rpx;
 margin-bottom: 40rpx;
}

.newuser-coupon-card {
 flex: 1;
 background: linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%);
 border-radius: 32rpx;
 padding: 30rpx 16rpx 24rpx;
 text-align: center;
 box-shadow: 0 12rpx 40rpx rgba(255, 59, 92, 0.2);
 position: relative;
 overflow: hidden;
 border: 4rpx solid rgba(255, 107, 107, 0.3);
}

.newuser-coupon-badge {
 position: absolute;
 top: 0;
 left: 0;
 background: linear-gradient(135deg, #FF3B5C, #FF6B6B);
 color: #fff;
 font-size: 18rpx;
 padding: 6rpx 16rpx;
 border-radius: 0 0 20rpx 0;
 font-weight: 700;
 box-shadow: 0 4rpx 16rpx rgba(255, 59, 92, 0.5);
}

.newuser-coupon-amount {
 font-size: 68rpx;
 font-weight: 900;
 color: #FF3B5C;
 margin: 20rpx 0 10rpx;
 line-height: 1;
 text-shadow: 0 4rpx 16rpx rgba(255, 59, 92, 0.3);
}

.newuser-coupon-currency {
 font-size: 32rpx;
 vertical-align: super;
}

.newuser-coupon-unit {
 font-size: 28rpx;
 margin-left: 4rpx;
}

.newuser-coupon-condition {
 font-size: 22rpx;
 color: #999;
 margin-bottom: 16rpx;
 font-weight: 500;
}

.newuser-coupon-btn {
 width: 100%;
 padding: 4rpx 0rpx;
 background: linear-gradient(135deg, #FF3B5C, #FF6B6B);
 color: #fff;
 border-radius: 40rpx;
 font-size: 24rpx;
 font-weight: 700;
 box-shadow: 0 8rpx 24rpx rgba(255, 59, 92, 0.4);
 text-align: center;
}

.newuser-timer-info {
 text-align: center;
 color: #fff;
 font-size: 28rpx;
 margin-bottom: 0;
 font-weight: 500;
}

.newuser-countdown {
 display: inline-flex;
 align-items: center;
 gap: 6rpx;
 font-size: 44rpx;
 color: #fff;
 font-weight: 800;
 font-variant-numeric: tabular-nums;
 margin: 0 10rpx;
}

.newuser-time-value {
 background: rgba(255, 255, 255, 0.3);
 padding: 10rpx 20rpx;
 border-radius: 16rpx;
 min-width: 72rpx;
 text-align: center;
 box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.newuser-time-sep {
 color: #fff;
 font-weight: 800;
}

.newuser-time-ms {
 display: inline-block;
 background: rgba(255, 255, 255, 0.3);
 padding: 10rpx 20rpx;
 border-radius: 16rpx;
 font-size: 44rpx;
 color: #fff;
 font-weight: 800;
 min-width: 72rpx;
 text-align: center;
 box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.newuser-after-expire {
 margin-left: 8rpx;
 color: rgba(255, 255, 255, 0.95);
 font-size: 28rpx;
}

.newuser-main-btn-wrap {
 width: 100%;
 padding: 0 32rpx 40rpx;
 box-sizing: border-box;
}

.newuser-main-btn {
 width: 100%;
 box-sizing: border-box;
 padding: 20rpx;
 background: linear-gradient(135deg, #FFFFFF, #FFF5F7);
 color: #FF3B5C;
 border: 4rpx solid rgba(255, 255, 255, 0.5);
 border-radius: 100rpx;
 font-size: 38rpx;
 font-weight: 800;
 text-align: center;
 box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.25);
 letter-spacing: 6rpx;
}

.newuser-close-btn {
 position: absolute;
 left: 50%;
 bottom: -176rpx;
 transform: translateX(-50%);
 width: 100rpx;
 height: 100rpx;
 background: rgba(255, 255, 255, 0.2);
 border: 6rpx solid rgba(255, 255, 255, 0.5);
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 overflow: visible;
 z-index: 10;
}

.newuser-close-btn-circle {
 position: absolute;
 top: -6rpx;
 left: -6rpx;
 width: 100rpx;
 height: 100rpx;
 border-radius: 50%;
 border: 6rpx solid transparent;
 border-top-color: #fff;
 animation: newuser-close-countdown 10s linear forwards;
 z-index: 0;
}

@keyframes newuser-close-countdown {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
}

.newuser-close-btn-text {
 position: absolute;
 top: -50rpx;
 left: 50%;
 transform: translateX(-50%);
 font-size: 24rpx;
 color: rgba(255, 255, 255, 0.95);
 white-space: nowrap;
 font-weight: 600;
 z-index: 2;
 text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.35), 0 0 16rpx rgba(0, 0, 0, 0.2);
}

.newuser-close-icon {
 font-size: 56rpx;
 color: #fff;
 font-weight: 300;
 line-height: 1;
 position: relative;
 z-index: 1;
}

/* APP 上优惠券区域不超出：不设 min-width 让三张卡均分收缩，左右与盒子 padding 一致 */
/* #ifdef APP-PLUS */
.newuser-coupons-section {
 overflow: hidden;
 min-width: 0;
}
.newuser-coupons-grid {
 min-width: 0;
 box-sizing: border-box;
}
.newuser-coupon-card {
 min-width: 0;
 flex: 1 1 0;
 box-sizing: border-box;
}
/* #endif */

/* 轮播容器（店铺券单页后保留类名兼容） */
.coupon-swiper {
 width: 100%;
 /* #ifdef H5 */
 height: 720rpx;
 /* #endif */
 /* #ifndef H5 */
 height: 700rpx;
 /* #endif */
}

.coupon-swiper swiper-item {
 height: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 overflow: visible;
 padding-right: 0;
}

/* 红色背景区域的包装容器 */
.popup-content-wrapper {
 position: relative;
 width: 340px;
 display: flex;
 flex-direction: column;
 align-items: center;
 border-radius: 16rpx;
 overflow: hidden;
 box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
 /* #ifdef H5 */
 height: 720rpx;
 /* #endif */
 /* #ifndef H5 */
 height: 700rpx;
 /* #endif */
}

/* 红色背景遮罩层 */
.popup-mask {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url(https://images.eqingqu.com/attachs/photo/202508/20250828_C11BFC195C7B2C001A52811B586FCBF4.png);
 background-size: cover;
 background-position: top center;
 background-repeat: no-repeat;
 z-index: 1;
}

/* 调整优惠券列表的层级，使其高于遮罩层 */
.receive-top,
.receive-list {
 position: relative;
 z-index: 2;
}

/* 关闭按钮 - 独立在红色区域外部 */
.close {
 position: relative;
 z-index: 2;
 display: flex;
 justify-content: center;
 align-items: center;
 width: 100%;
 margin-top: 30rpx; /* 与红色区域的间距 */
}

/* 其他样式保持不变 */
.receive-top {
 width: 100%;
 display: flex;
 justify-content: center;
 margin-bottom: 16rpx;
 margin-top: 30rpx;
}

.receive-top image {
 width: 100%;
 height: auto;
}

.receive-list {
 display: flex;
 justify-content: center;
 gap: 24rpx;
 margin-bottom: 25px;
 width: 90%;
 padding: 0 10px;
 position: relative;
}

.receive-item {
 flex: 1;
 height: 200rpx;
 max-width: 200rpx;
 background-image: url(https://images.eqingqu.com/attachs/photo/202508/20250828_FD48E2E8CBD220D2E3BC7F68F9AC7CC6.png);
 background-repeat: no-repeat;
 background-size: 100% 100%;
 display: flex;
 justify-content: center;
 align-items: center;
}

.coupon-content {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 padding-bottom: 40rpx;
}

.amount {
 font-size: 48rpx;
 font-weight: bold;
 color: #fa2f1b;
 line-height: 1;
}

.condition {
 font-size: 24rpx;
 color: #e47a50;
 padding: 4rpx 12rpx;
 border-radius: 16rpx;
}

.store-name {
 font-size: 20rpx;
 color: #999;
 margin-top: 8rpx;
 display: block;
}

/* 店铺优惠券样式 - 按照设计图 */
.store-coupon-wrapper {
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
}

.store-coupon-card {
 width: 520rpx;
 border-radius: 16rpx;
 overflow: visible;
 box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
 display: flex;
 flex-direction: column;
 /* #ifdef H5 */
 height: 720rpx;
 /* #endif */
 /* #ifndef H5 */
 height: 700rpx;
 /* #endif */
}

/* 白色区域 */
.store-coupon-white {
 background: #ffffff;
 // padding: 50rpx 40rpx 30rpx;
 display: flex;
 flex-direction: column;
 align-items: center;
 position: relative;
 overflow: visible;
 border-radius: 16rpx 16rpx 0 0;
 flex-shrink: 0;
}

/* 下凹弧线 - 使用一个大椭圆的底部，增大曲度 */
.store-arc-shape {
 position: absolute;
 bottom: 9rpx;
 left: 50%;
 transform: translateX(-50%);
 /* #ifdef H5 */
 width: 510rpx;
 /* #endif */
 /* #ifndef H5 */
 width: 510rpx;
 /* #endif */
 height: 108rpx;
 background: #ffffff;
 border-radius: 50%;
 z-index: 2;
}

.store-coupon-tag {
 background: rgba(255, 0, 0, 0.08);
 color: #ff0000;
 padding: 10rpx 28rpx;
 border-radius: 30rpx;
 font-size: 24rpx;
 margin-bottom: 32rpx;
}

.store-coupon-money {
 display: flex;
 align-items: flex-end;
 margin-bottom: 16rpx;
}

.store-coupon-money .yuan {
 font-size: 52rpx;
 color: #ff0000;
 font-weight: bold;
 margin-right: 6rpx;
 line-height: 1;
 padding-bottom: 12rpx;
}

.store-coupon-money .amount {
 font-size: 140rpx;
 color: #ff0000;
 font-weight: bold;
 line-height: 1;
 z-index: 3;
}

.store-coupon-condition {
 font-size: 28rpx;
 color: #999;
 margin-bottom: 20rpx;
}

/* 红色区域 */
.store-coupon-red {
 background: #ff0000;
 padding: 100rpx 40rpx 60rpx;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 margin-top: -50rpx;
 position: relative;
 z-index: 1;
 border-radius: 0 0 16rpx 16rpx;
 flex: 1;
}

.store-coupon-reminder {
 font-size: 48rpx;
 color: #ffffff;
 margin-bottom: 24rpx;
}

.store-coupon-timer {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	font-size: 40rpx;
	color: #ffffff;
	margin-bottom: 48rpx;
}

.timer-number {
	display: inline-block;
	width: 56rpx;
	text-align: center;
	font-variant-numeric: tabular-nums;
	letter-spacing: 0;
	overflow: hidden;
	box-sizing: border-box;
	flex-shrink: 0;
}

.timer-colon {
	padding: 0 4rpx;
	flex-shrink: 0;
	width: auto;
}

.timer-text-fixed {
	font-size: 28rpx;
	margin-left: 20rpx;
	white-space: nowrap;
	flex-shrink: 0;
	width: auto;
}

.store-coupon-use-btn {
 width: 300rpx;
 height: 80rpx;
 line-height: 80rpx;
 text-align: center;
 background: #ffffff;
 color: #ff0000;
 font-size: 34rpx;
 font-weight: bold;
 border-radius: 40rpx;
}

/* ========== 普通优惠券共用红色波纹（所有样式底部都有） ========== */
.store-coupon-ripple-bg {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 860rpx;
 height: 900rpx;
 pointer-events: none;
 z-index: 0;
}
/* 与绿色波纹一致：0% 560rpx、100% 760rpx，避免循环重置时大环闪烁 */
.store-coupon-ripple-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 560rpx;
 height: 560rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(255, 23, 68, 0.35);
 animation: store-ripple-ring-expand 3s ease-out infinite;
}
.store-coupon-ripple-ring-2 { animation-delay: 1s; }
.store-coupon-ripple-ring-3 { animation-delay: 2s; }
@keyframes store-ripple-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 760rpx; height: 760rpx; opacity: 0; }
}
.store-coupon-ripple-dot {
 position: absolute;
 width: 12rpx;
 height: 12rpx;
 background: #FF1744;
 border-radius: 50%;
 box-shadow: 0 0 24rpx #FF1744, 0 0 48rpx rgba(255, 23, 68, 0.6);
 animation: store-ripple-dot-float 4s ease-in-out infinite;
}
.store-coupon-ripple-dot:nth-child(4) { top: 20%; left: 10%; animation-delay: 0s; }
.store-coupon-ripple-dot:nth-child(5) { top: 40%; right: 15%; left: auto; animation-delay: 0.5s; }
.store-coupon-ripple-dot:nth-child(6) { top: 60%; left: 20%; animation-delay: 1s; }
.store-coupon-ripple-dot:nth-child(7) { top: 30%; right: 25%; left: auto; animation-delay: 1.5s; }
.store-coupon-ripple-dot:nth-child(8) { top: 70%; left: 15%; animation-delay: 2s; }
.store-coupon-ripple-dot:nth-child(9) { top: 50%; right: 10%; left: auto; animation-delay: 2.5s; }
@keyframes store-ripple-dot-float {
 0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
 50% { opacity: 1; transform: translateY(-40rpx) scale(1); }
}

/* ========== 普通优惠券样式1：清新绿色（与样式4弹层同宽 540rpx；新人券见 .newuser-popup-box 不变） ========== */
.store-coupon-s1-wrap {
 position: relative;
 z-index: 1;
 width: 540rpx;
 max-width: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
}
.store-coupon-s1-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 560rpx;
 height: 560rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(52, 199, 89, 0.4);
 pointer-events: none;
 animation: store-s1-ring-expand 3s ease-out infinite;
}
.store-coupon-s1-ring-2 { animation-delay: 1s; }
.store-coupon-s1-ring-3 { animation-delay: 2s; }
@keyframes store-s1-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 760rpx; height: 760rpx; opacity: 0; }
}
.store-coupon-s1-popup {
 width: 540rpx;
 max-width: 100%;
 background: #fff;
 border-radius: 32rpx;
 overflow: hidden;
 box-shadow: 0 0 80rpx rgba(52, 199, 89, 0.5), 0 24rpx 80rpx rgba(0, 0, 0, 0.2);
 position: relative;
 box-sizing: border-box;
}
.store-coupon-s1-header {
 background: linear-gradient(135deg, #34C759 0%, #30D158 100%);
 padding: 48rpx 32rpx 36rpx;
 text-align: center;
}
.store-coupon-s1-title {
 font-size: 36rpx;
 color: rgba(255, 255, 255, 0.95);
 font-weight: 700;
 display: block;
 margin-bottom: 24rpx;
 text-align: center;
}
.store-coupon-s1-amount-wrap { margin-bottom: 12rpx; text-align: center; }
.store-coupon-s1-currency { font-size: 36rpx; vertical-align: super; color: #fff; }
.store-coupon-s1-amount { font-size: 100rpx; font-weight: 900; color: #fff; line-height: 1; }
.store-coupon-s1-unit { font-size: 32rpx; color: #fff; margin-left: 6rpx; }
.store-coupon-s1-condition { font-size: 26rpx; color: rgba(255, 255, 255, 0.9); text-align: center; display: block; }
.store-coupon-s1-white {
 padding: 36rpx 32rpx 40rpx;
 box-sizing: border-box;
 text-align: center;
}
.store-coupon-s1-timer {
 display: inline-flex;
 align-items: center;
 justify-content: center;
 gap: 6rpx;
 font-size: 44rpx;
 color: #34C759;
 font-weight: 800;
 margin-bottom: 8rpx;
 width: 100%;
}
.store-coupon-s1-time {
 background: #F0FDF4;
 padding: 12rpx 16rpx;
 border-radius: 12rpx;
 border: 4rpx solid rgba(52, 199, 89, 0.2);
 min-width: 56rpx;
 text-align: center;
}
.store-coupon-s1-sep { color: #34C759; font-weight: 700; margin: 0 4rpx; }
.store-coupon-s1-ms {
 display: inline-block;
 background: #F0FDF4;
 padding: 12rpx 16rpx;
 border-radius: 12rpx;
 font-size: 44rpx;
 color: #34C759;
 font-weight: 800;
 min-width: 56rpx;
 text-align: center;
 border: 4rpx solid rgba(52, 199, 89, 0.2);
}
.store-coupon-s1-expire { font-size: 24rpx; color: #999; display: block; margin-top: 8rpx; text-align: center; }
.store-coupon-s1-btn {
 width: 100%;
 padding: 28rpx 0;
 background: linear-gradient(135deg, #34C759, #30D158);
 color: #fff;
 border-radius: 80rpx;
 font-size: 32rpx;
 font-weight: 800;
 text-align: center;
 box-shadow: 0 16rpx 48rpx rgba(52, 199, 89, 0.4);
 margin-top: 24rpx;
 box-sizing: border-box;
}

/* ========== 普通优惠券样式2：限时抢购（弹层宽度 540rpx） ========== */
.store-coupon-s2-wrap {
 position: relative;
 z-index: 1;
 width: 540rpx;
 max-width: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
}
.store-coupon-s2-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 560rpx;
 height: 560rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(255, 8, 68, 0.3);
 pointer-events: none;
 animation: store-s2-ring-expand 3s ease-out infinite;
}
.store-coupon-s2-ring-2 { animation-delay: 1s; }
.store-coupon-s2-ring-3 { animation-delay: 2s; }
@keyframes store-s2-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 760rpx; height: 760rpx; opacity: 0; }
}
.store-coupon-s2-popup {
 width: 540rpx;
 max-width: 100%;
 background: #fff;
 border-radius: 32rpx;
 overflow: hidden;
 box-shadow: 0 0 80rpx rgba(255, 8, 68, 0.4), 0 24rpx 80rpx rgba(0, 0, 0, 0.2);
 position: relative;
 box-sizing: border-box;
}
.store-coupon-s2-banner {
 background: linear-gradient(135deg, #FF0844 0%, #FF6B9D 100%);
 padding: 48rpx 32rpx 40rpx;
 text-align: center;
}
.store-coupon-s2-title {
 font-size: 36rpx;
 color: #fff;
 font-weight: 700;
 display: block;
 margin-bottom: 20rpx;
}
.store-coupon-s2-amount-wrap { margin-bottom: 0; }
.store-coupon-s2-currency { font-size: 40rpx; vertical-align: super; color: #fff; }
.store-coupon-s2-amount { font-size: 100rpx; font-weight: 900; color: #fff; line-height: 1; }
.store-coupon-s2-unit { font-size: 36rpx; color: #fff; margin-left: 8rpx; }
.store-coupon-s2-content {
 padding: 40rpx 32rpx 44rpx;
 box-sizing: border-box;
}
.store-coupon-s2-status { font-size: 30rpx; color: #666; display: block; text-align: center; margin-bottom: 24rpx; font-weight: 500; }
.store-coupon-s2-timer-box {
 background: linear-gradient(135deg, #FFF5F5, #FFE8E8);
 border-radius: 24rpx;
 padding: 32rpx;
 margin-bottom: 32rpx;
 text-align: center;
}
.store-coupon-s2-timer-hint { font-size: 26rpx; color: #999; display: block; margin-bottom: 20rpx; }
.store-coupon-s2-timer {
 display: inline-flex;
 align-items: center;
 gap: 8rpx;
 font-size: 44rpx;
 color: #FF0844;
 font-weight: 800;
 margin-bottom: 8rpx;
}
.store-coupon-s2-time {
 background: #fff;
 padding: 12rpx 16rpx;
 border-radius: 12rpx;
 box-shadow: 0 4rpx 16rpx rgba(255, 8, 68, 0.15);
 min-width: 56rpx;
 text-align: center;
}
.store-coupon-s2-sep { color: #FF0844; font-weight: 700; margin: 0 4rpx; }
.store-coupon-s2-ms {
 display: inline-block;
 background: #fff;
 padding: 12rpx 16rpx;
 border-radius: 12rpx;
 font-size: 44rpx;
 color: #FF0844;
 font-weight: 800;
 min-width: 56rpx;
 text-align: center;
 box-shadow: 0 4rpx 16rpx rgba(255, 8, 68, 0.15);
}
.store-coupon-s2-expire { font-size: 26rpx; color: #999; display: block; margin-top: 8rpx; }
.store-coupon-s2-btn {
 width: 100%;
 padding: 28rpx 0;
 background: linear-gradient(135deg, #FF0844, #FF6B9D);
 color: #fff;
 border-radius: 80rpx;
 font-size: 34rpx;
 font-weight: 700;
 text-align: center;
 box-shadow: 0 16rpx 48rpx rgba(255, 8, 68, 0.4);
 box-sizing: border-box;
}

/* ========== 普通优惠券样式3：节日气球（弹层宽度 540rpx） ========== */
.store-coupon-s3-wrap {
 position: relative;
 z-index: 1;
 width: 540rpx;
 max-width: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 overflow: visible;
}
.store-coupon-s3-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 560rpx;
 height: 560rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(255, 59, 92, 0.3);
 pointer-events: none;
 animation: store-s3-ring-expand 3s ease-out infinite;
}
.store-coupon-s3-ring-2 { animation-delay: 1s; }
.store-coupon-s3-ring-3 { animation-delay: 2s; }
@keyframes store-s3-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 760rpx; height: 760rpx; opacity: 0; }
}
/* ========== 样式3 节日气球：与 1/2/4 弹层同宽 540rpx ========== */
.store-coupon-s3-popup {
 width: 540rpx;
 max-width: 100%;
 background: #FF3B5C;
 border-radius: 40rpx;
 overflow: visible;
 box-shadow: 0 0 120rpx rgba(255, 59, 92, 0.7), 0 0 240rpx rgba(255, 59, 92, 0.5), 0 40rpx 120rpx rgba(255, 59, 92, 0.5);
 position: relative;
 animation: store-s3-glow-pulse 2s ease-in-out infinite;
}
@keyframes store-s3-glow-pulse {
 0%, 100% { box-shadow: 0 0 120rpx rgba(255, 59, 92, 0.7), 0 0 240rpx rgba(255, 59, 92, 0.5), 0 40rpx 120rpx rgba(255, 59, 92, 0.5); }
 50% { box-shadow: 0 0 160rpx rgba(255, 59, 92, 0.9), 0 0 320rpx rgba(255, 59, 92, 0.7), 0 40rpx 120rpx rgba(255, 59, 92, 0.5); }
}
/* 气球：参考 top -80px right 20px，宽高 100px；气球 40x50，左 0/30/60 top 0/10/5 */
.store-coupon-s3-balloons {
 position: absolute;
 top: -160rpx;
 right: 40rpx;
 width: 200rpx;
 height: 200rpx;
 pointer-events: none;
 z-index: 2;
}
.store-coupon-s3-balloon {
 position: absolute;
 width: 80rpx;
 height: 100rpx;
 border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
 animation: store-s3-balloon-float 3s ease-in-out infinite;
}
.store-coupon-s3-balloon::after {
 content: '';
 position: absolute;
 bottom: -30rpx;
 left: 50%;
 transform: translateX(-50%);
 width: 2rpx;
 height: 40rpx;
 background: rgba(255, 255, 255, 0.5);
}
.store-coupon-s3-balloon:nth-child(1) {
 background: linear-gradient(135deg, #FF6B9D, #FF3B5C);
 left: 0;
 top: 0;
 animation-delay: 0s;
}
.store-coupon-s3-balloon:nth-child(2) {
 background: linear-gradient(135deg, #FFA07A, #FF6347);
 left: 60rpx;
 top: 20rpx;
 animation-delay: 0.3s;
}
.store-coupon-s3-balloon:nth-child(3) {
 background: linear-gradient(135deg, #FFD700, #FFA500);
 left: 120rpx;
 top: 10rpx;
 animation-delay: 0.6s;
}
@keyframes store-s3-balloon-float {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-30rpx); }
}
.store-coupon-s3-badge {
 background: rgba(255, 255, 255, 0.25);
 backdrop-filter: blur(10px);
 display: inline-block;
 padding: 10rpx 28rpx;
 border-radius: 36rpx;
 font-size: 22rpx;
 color: #fff;
 font-weight: 600;
 margin: 32rpx 0 0 32rpx;
 border: 2rpx solid rgba(255, 255, 255, 0.3);
}
.store-coupon-s3-header {
 padding: 16rpx 40rpx 44rpx;
 text-align: center;
}
.store-coupon-s3-event-title {
 font-size: 36rpx;
 color: #fff;
 font-weight: 700;
 display: block;
 margin-bottom: 36rpx;
 letter-spacing: 2rpx;
}
.store-coupon-s3-amount-wrap { margin-bottom: 12rpx; }
.store-coupon-s3-currency { font-size: 40rpx; vertical-align: super; color: #fff; }
.store-coupon-s3-amount { font-size: 120rpx; font-weight: 900; color: #fff; line-height: 1; text-shadow: 0 8rpx 28rpx rgba(0,0,0,0.25); animation: store-s3-scale-breath 2s ease-in-out infinite; }
.store-coupon-s3-unit { font-size: 32rpx; color: #fff; margin-left: 6rpx; }
@keyframes store-s3-scale-breath {
 0%, 100% { transform: scale(1); }
 50% { transform: scale(1.06); }
}
/* white-card：参考图紧凑比例，不显长 */
.store-coupon-s3-white {
 background: #fff;
 border-radius: 36rpx 36rpx 0 0;
 padding: 44rpx 36rpx 32rpx;
 margin-top: 32rpx;
 box-sizing: border-box;
}
.store-coupon-s3-countdown-wrap {
 text-align: center;
 margin-bottom: 36rpx;
}
.store-coupon-s3-timer {
 display: inline-flex;
 align-items: center;
 gap: 6rpx;
 font-size: 52rpx;
 color: #FF3B5C;
 font-weight: 800;
 margin-bottom: 12rpx;
}
.store-coupon-s3-time {
 background: linear-gradient(135deg, #FFF0F3, #FFE5EA);
 padding: 12rpx 20rpx;
 border-radius: 14rpx;
 min-width: 76rpx;
 text-align: center;
 box-shadow: 0 4rpx 14rpx rgba(255, 59, 92, 0.15);
 color: #FF3B5C;
}
.store-coupon-s3-sep { color: #FF3B5C; font-weight: 700; margin: 0 2rpx; }
.store-coupon-s3-ms {
 display: inline-block;
 background: linear-gradient(135deg, #FFF0F3, #FFE5EA);
 padding: 12rpx 20rpx;
 border-radius: 14rpx;
 font-size: 52rpx;
 color: #FF3B5C;
 font-weight: 800;
 min-width: 76rpx;
 text-align: center;
 box-shadow: 0 4rpx 14rpx rgba(255, 59, 92, 0.15);
}
.store-coupon-s3-expire { font-size: 24rpx; color: #999; margin-top: 12rpx; display: block; }
.store-coupon-s3-btn {
 width: 100%;
 padding: 26rpx;
 background: linear-gradient(135deg, #FF3B5C, #FF6B9D);
 color: #fff;
 border-radius: 88rpx;
 font-size: 32rpx;
 font-weight: 700;
 text-align: center;
 box-shadow: 0 12rpx 40rpx rgba(255, 59, 92, 0.4);
 letter-spacing: 4rpx;
 box-sizing: border-box;
}

/* ========== 普通优惠券样式4：日常优惠（外层与弹层 540rpx） ========== */
.store-coupon-s4-wrap {
 position: relative;
 z-index: 1;
 width: 540rpx;
 max-width: 100%;
 min-height: 400rpx;
 display: flex;
 flex-direction: column;
 align-items: center;
 overflow: visible;
}
/* 红色波纹光晕环：与 coupon-popup-1 一致，环要比弹窗大才能露在背后 */
.store-coupon-s4-ring {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 520rpx;
 height: 520rpx;
 border-radius: 50%;
 border: 4rpx solid rgba(255, 23, 68, 0.35);
 pointer-events: none;
 animation: store-s4-ring-expand 3s ease-out infinite;
 z-index: 0;
}
.store-coupon-s4-ring-2 { animation-delay: 1s; }
.store-coupon-s4-ring-3 { animation-delay: 2s; }
@keyframes store-s4-ring-expand {
 0% { width: 560rpx; height: 560rpx; opacity: 1; }
 100% { width: 860rpx; height: 860rpx; opacity: 0; }
}
.store-coupon-s4-particles {
 position: absolute;
 width: 100%;
 height: 100%;
 top: 0;
 left: 0;
 pointer-events: none;
 z-index: 0;
}
.store-coupon-s4-particle {
 position: absolute;
 width: 12rpx;
 height: 12rpx;
 background: #FF1744;
 border-radius: 50%;
 box-shadow: 0 0 24rpx #FF1744, 0 0 48rpx rgba(255, 23, 68, 0.6);
 animation: store-s4-particle-float 4s ease-in-out infinite;
}
.store-coupon-s4-particle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.store-coupon-s4-particle:nth-child(2) { top: 40%; right: 15%; left: auto; animation-delay: 0.5s; }
.store-coupon-s4-particle:nth-child(3) { top: 60%; left: 20%; animation-delay: 1s; }
.store-coupon-s4-particle:nth-child(4) { top: 30%; right: 25%; left: auto; animation-delay: 1.5s; }
.store-coupon-s4-particle:nth-child(5) { top: 70%; left: 15%; animation-delay: 2s; }
.store-coupon-s4-particle:nth-child(6) { top: 50%; right: 10%; left: auto; animation-delay: 2.5s; }
@keyframes store-s4-particle-float {
 0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
 50% { opacity: 1; transform: translateY(-40rpx) scale(1); }
}
.store-coupon-s4-popup {
 width: 540rpx;
 max-width: 100%;
 background: #fff;
 border-radius: 28rpx;
 overflow: hidden;
 box-shadow: 0 0 96rpx rgba(255, 23, 68, 0.5), 0 0 160rpx rgba(255, 23, 68, 0.35), 0 32rpx 96rpx rgba(0, 0, 0, 0.25);
 position: relative;
 z-index: 1;
 animation: store-s4-glow-pulse 2s ease-in-out infinite;
}
@keyframes store-s4-glow-pulse {
 0%, 100% { box-shadow: 0 0 96rpx rgba(255, 23, 68, 0.5), 0 0 160rpx rgba(255, 23, 68, 0.35), 0 32rpx 96rpx rgba(0, 0, 0, 0.25); }
 50% { box-shadow: 0 0 120rpx rgba(255, 23, 68, 0.7), 0 0 200rpx rgba(255, 23, 68, 0.5), 0 32rpx 96rpx rgba(0, 0, 0, 0.25); }
}
.store-coupon-s4-envelope {
 background: linear-gradient(135deg, #FF1744 0%, #F50057 100%);
 padding: 44rpx 36rpx 0;
 position: relative;
 clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 85%, 0 75%);
}
.store-coupon-s4-envelope::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
 animation: store-s4-shine 3s ease-in-out infinite;
 pointer-events: none;
}
@keyframes store-s4-shine {
 0%, 100% { transform: translateX(-100%); }
 50% { transform: translateX(100%); }
}
.store-coupon-s4-title {
 font-size: 36rpx;
 color: rgba(255, 255, 255, 0.95);
 text-align: center;
 display: block;
 margin-bottom: 28rpx;
 font-weight: 600;
 letter-spacing: 4rpx;
}
.store-coupon-s4-amount-wrap {
 text-align: center;
 margin-bottom: 20rpx;
}
.store-coupon-s4-amount {
 font-size: 120rpx;
 font-weight: 900;
 color: #FFF;
 line-height: 1;
 text-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.25);
 animation: store-s4-pulse 2s ease-in-out infinite;
}
@keyframes store-s4-pulse {
 0%, 100% { transform: scale(1); }
 50% { transform: scale(1.05); }
}
.store-coupon-s4-currency {
 font-size: 48rpx;
 vertical-align: super;
 margin-right: 4rpx;
 color: #FFF;
}
.store-coupon-s4-unit {
 font-size: 36rpx;
 margin-left: 8rpx;
 color: #FFF;
}
.store-coupon-s4-condition {
 font-size: 26rpx;
 color: rgba(255, 255, 255, 0.9);
 text-align: center;
 display: block;
 margin-bottom: 28rpx;
}
.store-coupon-s4-white {
 background: #fff;
 padding: 44rpx 40rpx 40rpx;
 border-radius: 0 0 28rpx 28rpx;
 box-sizing: border-box;
 width: 100%;
}
.store-coupon-s4-message {
 font-size: 30rpx;
 color: #666;
 text-align: center;
 display: block;
 font-weight: 500;
 margin-bottom: 28rpx;
}
.store-coupon-s4-timer-wrap {
 text-align: center;
 margin-bottom: 32rpx;
}
.store-coupon-s4-timer {
 display: inline-flex;
 align-items: center;
 gap: 8rpx;
 font-size: 48rpx;
 color: #FF1744;
 font-weight: 800;
 margin-bottom: 12rpx;
}
.store-coupon-s4-time {
 background: #FFF0F0;
 padding: 12rpx 18rpx;
 border-radius: 12rpx;
 min-width: 64rpx;
 text-align: center;
}
.store-coupon-s4-sep { color: #FF1744; font-weight: 700; margin: 0 4rpx; }
.store-coupon-s4-ms {
 display: inline-block;
 background: #FFF0F0;
 padding: 12rpx 18rpx;
 border-radius: 12rpx;
 font-size: 48rpx;
 color: #FF1744;
 font-weight: 800;
 min-width: 64rpx;
 text-align: center;
}
.store-coupon-s4-expire {
 font-size: 26rpx;
 color: #999;
 display: block;
 margin-top: 8rpx;
}
.store-coupon-s4-btn {
 width: 100%;
 padding: 28rpx;
 background: linear-gradient(135deg, #FF1744, #F50057);
 color: #fff;
 border-radius: 44rpx;
 font-size: 32rpx;
 font-weight: 700;
 text-align: center;
 box-shadow: 0 16rpx 48rpx rgba(255, 23, 68, 0.4);
 letter-spacing: 2rpx;
 box-sizing: border-box;
}

/* 样式4 日常优惠：APP 上与 1/2/3 弹层同宽 */
/* #ifdef APP-PLUS */
.store-coupon-s4-wrap {
 width: 100%;
 max-width: 540rpx;
 box-sizing: border-box;
}
.store-coupon-s4-popup {
 box-sizing: border-box;
 max-width: 100%;
}
.store-coupon-s4-white {
 min-width: 0;
 overflow: hidden;
}
.store-coupon-s4-btn {
 min-width: 0;
 max-width: 100%;
}
/* #endif */

.list-bottom-bg {
 position: absolute;
 bottom: -20rpx;
 left: 0;
 width: 100%;
 height: 228rpx;
 background-color: #fff;
 opacity: 55%;
 border-radius: 16px;
 z-index: -1;
}

.close .img {
 width: 100rpx;
 height: 100rpx;
}

  // .upgrade {
  // 	position: absolute;
  // 	top: 0;
  // 	left: 0;
  // 	width: 100%;
  // 	height: 100%;
  // 	z-index: -2;
  // }

  // 新人优惠

  .new-person {
	  max-height: 320px;
	  background: linear-gradient(138deg, #CEFFF5 0%, #FFFFFF 33%, #FFFAFA 62%, #FBD5D5 100%);
	  border-radius: 10px;
	  border: 1px solid #FFFFFF;
	  margin: 16rpx;
	  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	  padding: 10rpx 10rpx;
	  position: relative;
  }


  .one {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 20rpx;
	  margin-top: 10rpx;
  }

  .one-more {
	  width: 100rpx;
	  height: 60rpx;

  }

  .one-more image {
	  width: 148rpx;
	  height: 66rpx;
	  position: absolute;
	  top: 0;
	  right: 0;
  }

  .one-text {
	  font-family: PingFangSC, PingFang SC;
	  font-weight: 400;
	  font-size: 12px;
	  /* 建议统一用 rpx，如 24rpx，避免单位混合偏差 */
	  color: #1B1B1B;
	  line-height: 12px;
	  /*  line-height 与 font-size 一致，避免垂直留白波动 */
	  text-align: left;
	  font-style: normal;
	  /* 关键：让子元素（文字+time）按垂直居中对齐，而非基线对齐 */
	  display: flex;
	  align-items: center;
	  /* 垂直居中，消除基线偏移导致的抖动 */
	  /* 若需兼容旧版，也可给 .time 加 vertical-align: middle */
  }

  .mr8 {
	  margin-right: 8rpx;
  }

  .ml8 {
	  margin-left: 8rpx;
  }

  .one view:nth-child(1) {
	  font-family: PingFangSC, PingFang SC;
	  font-weight: 600;
	  font-size: 18px;
	  color: #2D2D2D;
	  line-height: 18px;
	  text-align: left;
	  font-style: normal;
  }

  .one view:nth-child(2) {
	  font-size: 24rpx;
	  color: #666;
  }

  .time {
	  display: inline-block;
	  /* 关键：根据数字最大宽度设置固定宽度（而非 min-width），2位数字+内边距足够容纳 */
	  width: 48rpx;
	  /* 原 min-width:24rpx 改为固定 width，值需根据实际字体大小调整 */
	  background: #ff4a4a;
	  color: #fff;
	  text-align: center;
	  padding: 4rpx 0;
	  /* 左右内边距改为 0，避免宽度叠加偏差；若需左右间距，用固定宽度承载 */
	  border-radius: 6rpx;
	  font-weight: bold;
	  /* 额外优化：禁止文本换行，确保数字始终在一行 */
	  white-space: nowrap;
	  /* 避免数字变化时的字体渲染偏差 */
	  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  }

  .one view:nth-child(3) {
	  font-size: 24rpx;
	  color: #999;
  }

  .two {
	  height: 132rpx;
	  display: flex;
	  background-image: url(https://images.eqingqu.com/attachs/photo/202508/20250828_07F788811332A363E7FC4D69A4C6C4CC.png);
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  margin-bottom: 20rpx;
	  position: relative;
  }

  .two-text {
	  width: 208rpx;
	  height: 100%;
	  background-image: url(https://images.eqingqu.com/attachs/photo/202508/20250828_2FCB4A448F3907BB24B222052D73D31A.png);
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  position: absolute;
	  top: 0;
	  right: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 36rpx;
	letter-spacing: 2rpx;
  }

.two-text-line {
	display: block;
	padding-left: 50rpx;
}
  .two-content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  position: relative;
	  /* 根据需要添加内边距，避免内容与伪元素重叠 */
	  // padding-right: 10px;
	  padding: 10rpx 10rpx;
	  min-width: 60px;
  }

  .two-content::after {
	  /* 伪元素必须设置content属性 */
	  content: '';
	  /* 绝对定位到右侧 */
	  position: absolute;
	  right: 0;
	  top: 15%;
	  /* 顶部留出10%空间，配合80%高度实现居中效果 */
	  /* 设置高度为父元素的80% */
	  height: 70%;
	  /* 宽度相当于边框粗细 */
	  width: 1px;
	  /* 设置灰色 */
	  background-color: #ccc;
  }

  .two-amount {
	  font-size: 68rpx;
	  font-weight: bold;
	  line-height: 52rpx;
	  color: #fa2f1b;
	  line-height: 1;
  }

  .two-condition {
	  font-size: 24rpx;
	  color: #4D4B4B;
	  padding: 2px 6px;
	  border-radius: 16rpx;
  }

  .three {
	  display: flex;
	  gap: 8rpx;
	  position: relative;
	  gap: 8rpx;
	  position: relative;
	  overflow: hidden;
	  /* 溢出部分隐藏（可选，若要滚动可改 overflow-x: auto） */
	  padding: 0 8rpx;
	  /* 可选：给父容器加左右内边距，避免子元素贴边 */
  }

  .three-item {
	  flex: 1;
	  /* 均分父容器宽度 */
	  min-width: 0;
  }

  .three-content {
	  text-align: center;
	  background: #fff;
	  border-radius: 16rpx;
	  /* 让内容区随父元素宽度自适应，避免内容撑大容器 */
	  width: 100%;
	  box-sizing: border-box;

	  .img-box {

		  min-height: 188rpx;
		  display: flex;
		  /* 让图片在盒子内居中，且自适应宽度 */
		  justify-content: center;
		  align-items: center;
		  padding: 10rpx 0;
	  }

	  text-align: center;
	  background: #fff;

	  border-radius: 16rpx;

	  .img {
		  width: 80%;
		  /* 图片宽度设为父容器（.img-box）的80%，随父栏收缩 */
		  height: auto;
		  /* 高度自动，保持图片比例（避免拉伸变形） */
		  max-width: 188rpx;
		  /* 限制图片最大宽度，宽屏时不致过大 */
		  background: #ccc;
		  border-radius: 20rpx;
		  // margin: 24rpx 0rpx;
	  }

	  .info-box {
		  padding: 8rpx;
		  box-sizing: border-box;



		  .new-img {
			  width: 60rpx;
			  height: 28rpx;
			  margin-right: 8rpx;
			  display: inline-block;
			  vertical-align: bottom;
		  }

		  .goods-name-text {
			  vertical-align: bottom;
		  }
		  
	  }

	  .yishou {
		  font-weight: 400;
		  font-size: 24rpx;

		  white-space: nowrap;
		  /* 禁止文本换行 */
		  overflow: hidden;
		  /* 超出容器部分隐藏 */
		  text-overflow: ellipsis;
		  /* 超出部分显示省略号（可选） */
	  }
  }

.gif-container {
position: relative;
width: 100%;
height: 360rpx; /* 根据实际需要调整 */
}

.cover-content, .gif-content {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.cover-hidden {
display: none;
}

.cover-image, .goods-gif {
width: 100%;
height: 100%;
border-radius: 8rpx; 
}




/* 精确的调试区域 */
// .debug-center-region {
//   position: fixed;
//   top: 25%;
//   bottom: 25%;
//   left: 0;
//   right: 0;
//   pointer-events: none;
//   z-index: 9999;
//   border: 3px solid #00ff00;
//   background-color: rgba(0, 255, 0, 0.1);
// }

// .debug-center-line {
//   position: absolute;
//   top: 50%;
//   left: 0;
//   right: 0;
//   height: 2px;
//   background-color: #ff0000;
//   transform: translateY(-50%);
// }

// .debug-center-text {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background: rgba(0, 0, 0, 0.9);
//   color: #00ff00;
//   padding: 8px 16px;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: bold;
// }

/* 评价弹窗样式 */
.cover {
	position: fixed;
	top: 0;
	bottom: 0;
	display: block;
	width: 100%;
	height: 100%;
	background-color: rgb(0, 0, 0);
	z-index: 99999999;
	opacity: 0.2;
}

.wxshare11 {
	text-align: center;
	border-radius: 20rpx;
	width: 600rpx;
	max-width: 80%;
	height: 420px;
	background: #ffffff;
	position: fixed;
	top: 20%;
	left: 50%;
	transform: translateX(-50%);
	z-index: 99999999;
	padding: 63rpx 54rpx;
	box-sizing: border-box;
	background: url(https://images.eqingqu.com/attachs/photo/202602/20260206_E5CE506D26CD5CB066A370A5AC6AF93F.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: center;
}

.wxshare_2_11 {
	margin-bottom: 48rpx;
}

.add_box3_a11 {
	width: 480rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: #1D94FF;
	border-radius: 13rpx;
	color: #fff;
	font-size: 36rpx;
}

.add_box3_1_a11 {
	width: 256rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 13rpx;
	color: #1D94FF;
	font-size: 36rpx;
	font-weight: 600;
	margin-top: 10rpx;
}
</style>
