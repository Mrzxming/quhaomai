<template>
	<view class="container fixed-bottom-padding">
		<goods-nav-bar :navIconRgba="navIconRgba" :navOpacity="navOpacity" :rgba="rgba"></goods-nav-bar>
		<scroll-view class="scrollList" scroll-y>
			<view class="goods-wrap">
				<view class="banner">
					<swiper indicator-dots="true" @change="swiperChange">
						<swiper-item v-if="goodsInfo.goods_video">
							<view class="goods-video" v-if="poster">
								<video :src="goodsInfo.goods_video" @error="videoErrorCallback" controls show-center-play-btn="true" autoplay="true"></video>
							</view>
							<view class="goods-img-first" v-else>
								<image :src="gallerylList[0].img_url" class="imgbox" @click="onPlay" v-if="gallerylList"></image>
								<view class="playicon" @click="onPlay">
									<view class="iconfont icon-play"></view>
								</view>
							</view>
						</swiper-item>
						<block v-if="gallerylList.length > 0">
							<swiper-item v-for="(item,index) in gallerylList" :key="index">
								<image :src="item.img_url" class="imgbox"></image>
							</swiper-item>
						</block>
						<block v-else>
							<swiper-item><image :src="goodsInfo.goods_img" class="imgbox"></image></swiper-item>
						</block>
					</swiper>
				</view>
				<view class="cont-box">
					<view class="price-box">
						<view class="left">
							<view class="price-weight">
								{{goodsInfo.sec_price_format}}
								<block v-if="goodsInfo.is_kj == 1">
									<text style="font-size: 20rpx; font-weight: normal; margin-left: 10rpx;" v-if="goodsInfo.goods_rate > 0">{{$t('lang.import_tax')}} {{ goodsInfo.formated_goods_rate }}</text>
									<text style="font-size: 20rpx; font-weight: normal; margin-left: 10rpx;" v-else>{{$t('lang.import_tax')}}：{{$t('lang.goods_tax_included')}}</text>
								</block>
							</view>
							<view class="price-row">
								<view class="tag">
									<view class="tag-icon"><text class="iconfont icon-lightning"></text></view>
									<view class="tag-right-cont">{{$t('lang.seckill')}}</view>
								</view>
								<view class="sub"><text>{{$t('lang.market_price')}}</text><view class="price-original">¥{{goodsInfo.market_price}}</view></view>
							</view>
						</view>
						<view class="right">
							<block v-if="goodsInfo.status">
								<text>{{$t('lang.upgrade_beford')}}:</text>
							</block>
							<block v-else>
								<text>{{$t('lang.upgrade_end')}}:</text>
							</block>
							<view class="data">
								<block v-if="isTimeEnd">
									<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown>
								</block>
								<block v-else>
									<text class="end">{{$t('lang.activity_end')}}</text>
								</block>
							</view>
						</view>
					</view>
					
					<view class="title">
						
						<view class="country_icon_text">
							<text class="ziying" v-if="goodsInfo.is_kj == 1" style="background:#7a45e5;">{{$t('lang.cross_goods')}}</text>
							<image class="country_icon" :src="goodsInfo.country_icon" :lazy-load="true" v-if="goodsInfo.country_icon"></image>
							<text class="icon_text_name">{{goodsInfo.country_name}}</text>
						</view>
						
						<view class="uni-flex-common uni-space-between">
							<view class="goods-name twolist-hidden flex_1"><uni-tag :text="goodsInfo.rz_shop_name" size="small" type="error" v-if="goodsInfo.rz_shop_name"></uni-tag><text>{{goodsInfo.goods_name}}</text></view>
							<view class="goods_share" @click="mpShare">
								<text class="iconfont icon-share" style="line-height: 1;"></text>
								<text class="share_txt">{{ $t('lang.share') }}</text>
							</view>
						</view>
						<view class="goods_shipai" v-if="goodsInfo.goods_shipai">{{goodsInfo.goods_shipai}}</view>
						<view class="goods_outer">
							<view class="text-left">{{$t('lang.sales_volume')}} {{ goodsInfo.sales_volume }}</view>
							<view class="text-center">{{$t('lang.current_stock')}} {{ goodsInfo.sec_num }}</view>
							<view class="text-right" v-if="goodsInfo.sec_limit">{{$t('lang.gb_limited')}} {{ goodsInfo.sec_limit }}</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell not-cell-bot" v-if="goodsInfo.is_kj == 1 && goodsInfo.cross_warehouse_name != ''">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.place_of_shipment')}}</text>
								<view class="value">{{goodsInfo.cross_warehouse_name}}</view>
							</view>
						</view>
						<view class="uni-list-cell not-cell-bot" hover-class="uni-list-cell-hover" @click="showPopup('address')">
<!-- 						<view class="uni-list-cell not-cell-bot" hover-class="uni-list-cell-hover" @click="handleRegionShow"> -->
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">{{$t('lang.label_send_to_2')}}</text>
								<view class="value">{{ regionSplic }}</view>
							</view>
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.label_freight2')}}</text>
								<view class="value uni-red">{{ freight }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate uni-navigate-right" hover-class="uni-list-cell-hover" @click="skuLink">
								<text class="title">{{$t('lang.label_selected2')}}</text>
								<view class="value">{{ attr_name }}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-navigate">
							<text class="title">{{$t('lang.number')}}</text>
							<view class="value"><uni-number-box :value="num" :min="1" :max="goodsInfo.sec_limit > 0 ? goodsInfo.sec_limit : 100000000000" @change="bindChange"></uni-number-box></view>
						</view>
					</view>
				</view> -->
				<view class="goods-desc" id="tab2">
					<view class="uni-common-mt">
						<uni-segmented-control :current="current" :values="tabs" v-on:clickItem="onClickItem" styleType="text" activeColor="#f92028"></uni-segmented-control>
					</view>
					<view class="content">
						<view v-show="current === 0">
							<block v-if="goodsDesc">
								<rich-text :nodes="goodsDesc"></rich-text>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
						<view v-show="current === 1">
							<block v-if="goodsInfo.attr_parameter">
								<view class="table">
									<view class="tr">
										<view class="td">{{$t('lang.goods_sn')}}</view>
										<view class="td">{{goodsInfo.goods_sn}}</view>
									</view>
									<view class="tr colspan">
										<view class="td">{{$t('lang.subject')}}</view>
									</view>
									<view class="tr">
										<view class="td">{{$t('lang.brand')}}</view>
										<view class="td">{{ goodsInfo.brand_name }}</view>
									</view>
									<view class="tr">
										<view class="td">{{$t('lang.goods_weight')}}</view>
										<view class="td">{{ goodsInfo.goods_weight }}kg</view>
									</view>
									<view class="tr colspan">
										<view class="td">{{$t('lang.attr_parameter')}}</view>
									</view>
									<view class="tr" v-for="(item,index) in goodsInfo.attr_parameter" :key="index">
										<view class="td">{{item.attr_name}}</view>
										<view class="td">{{item.attr_value}}</view>
									</view>
								</view>
							</block>
							<block v-else>
								<dsc-not-content></dsc-not-content>
							</block>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部版权 -->
		<dsc-copyright></dsc-copyright>
		<view class="dsc-safe-area-inset-bottom"></view>
		
		<view class="btn-goods-action_1">
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="contact" type="default" size="5" session-from="weapp" hover-class="none" class="item kefu-cantact" v-if="wxappChat > 0">
				<view class="iconfont icon-service"></view>
				<text class="txt">{{$t('lang.customer_service')}}</text>
			</button>
			<view class="item" @click="onChat(goodsInfo.shop_name,goodsInfo.goods_id,goodsInfo.user_id)" v-else>
				<view class="iconfont icon-service"></view>
				<text class="txt">{{$t('lang.customer_service')}}</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="item" @click="onChat(goodsInfo.shop_name,goodsInfo.goods_id,goodsInfo.user_id)">
				<view class="iconfont icon-service"></view>
				<text class="txt">{{$t('lang.customer_service')}}</text>
			</view>
			<!-- #endif -->
			<view class="item" @click="collection">
				<block v-if="is_collect == 1"><view class="iconfont icon-collection-alt"></view></block>
				<block v-else><view class="iconfont icon-collection"></view></block>
				<text class="txt">{{$t('lang.collect')}}</text>
			</view>
			<view class="btn-bar">
				<view class="btn btn-red" v-if="goodsInfo.status && goodsInfo.is_end === 0" @click="onSku">{{$t('lang.snapped_immediately')}}</view>
				<view class="btn btn-org" v-if="!goodsInfo.status && goodsInfo.is_end === 0">{{$t('lang.begin_minute')}}</view>
				<view class="btn btn-org" v-if="!goodsInfo.status && goodsInfo.is_end !== 0">{{$t('lang.has_ended')}}</view>
			</view>
		</view>
		
		<uni-popup :show="showBase" type="bottom" v-on:hidePopup="showBase=false">
			<view class="attr-goods-box">
				<view class="attr-goods-header" v-if="attr != ''">
					<view class="attr-img">
						<image :src="goodsAttrOper.attr_img || goodsInfo.goods_thumb || goodsInfo.goods_img" mode="widthFix"></image>
					</view>
					<view class="attr-info">
						<view class="attr-price">{{goodsAttrOper.spec_price_formated}}</view>
						<view class="attr-stock">{{$t('lang.label_selected')}}：{{ goodsAttrOper.attr_name }} {{ num }}{{ goodsInfo.goods_unit }}</view>
						<view class="attr-stock">{{$t('lang.stock')}}：{{ goodsAttrOper.stock }}</view>
					</view>
				</view>
				<view class="attr-goods-header" v-else>
					<view class="attr-img">
						<image :src="goodsInfo.goods_img" mode="widthFix"></image>
					</view>
					<view class="attr-info">
						<view class="attr-name twolist-hidden">{{ goodsInfo.goods_name }}</view>
						<view class="attr-price" v-if="goodsInfo.sec_price_format">{{ goodsInfo.sec_price_format }}</view>
						<view class="attr-stock" v-if="goodsInfo.goods_number">{{$t('lang.label_stock')}}{{ goodsInfo.goods_number }}</view>
					</view>
				</view>
				
				<view class="attr-goods-content">
					<view class="sku-item" v-for="(item,index) in attr" :key="index">
						<text class="sku-tit">{{ item.name }}</text>
						<view class="sku-list"><text v-for="(option,listIndex) in item.attr_key" :key="listIndex"
								:class="{'active':goodsAttrInit[index] == option.goods_attr_id}"
								@click="attrChange(index,option.goods_attr_id)">{{ option.attr_value }}</text></view>
					</view>
				</view>
				<view class="attr-goods-number">
					<text class="tit">{{$t('lang.number')}}</text>
					<view class="stepper">
						<uni-number-box :value="num" :disabled="goodsAttrOper.stock == 0 || goodsAttrOper.sec_limit == 0 || goodsAttrOper.spec_disable == 1" :min="1" :max="secLimit" @change="bindChange"></uni-number-box>
					</view>
				</view>
				<view class="btn-bar">
					<view class="btn btn-red" @click="seckillCheckout" v-if="stock">{{$t('lang.confirm')}}</view>
					<view class="btn btn-disabled" v-else>{{$t('lang.understock')}}</view>
				</view>
			</view>
		</uni-popup>
		
		<!--小程序分享-->
		<view class="show-popup-shareImg">
			<uni-popup :show="shareImgShow" type="bottom" animation="true" v-on:hidePopup="shareImgShow = false">
				<view class="mp-share-warp">
					<view class="title">
						<text>{{$t('lang.save_xaingce')}}</text>
						<uni-icon type="closeempty" size="30" color="#8f8f94" @click="shareImgShow = false"></uni-icon>
					</view>
					<view class="mp-share-img"><image :src="mpShareImg" mode="heightFix" class="img" @tap="previewImage"></image></view>
					<view class="btn-bar btn-bar-radius"><button class="btn btn-red" @click="downloadImg">{{$t('lang.save_picture')}}</button></view>
				</view>
			</uni-popup>
		</view>
		
		<!--自定义分享-->
		<uni-popups id="popupPoster" ref="popupPoster" :animation="true" type="bottom">
			<view class="popup-poster">
				<view class="poster-image"><image :src="mpShareImg" mode="widthFix" class="img"></image></view>
				<view class="poster-btn">
					<view class="tit">{{$t('lang.share_to')}}</view>
					<view class="lists">
						<!-- #ifdef MP-WEIXIN -->
						<button class="list" open-type="share">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png" mode="widthFix"></image>
							<text>{{ $t('lang.share_with_friends') }}</text>
						</button>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view class="list" @click="posterAppShare('weixin')">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_5E03D09CEA9F93B420CEBED78A902955.png" mode="widthFix"></image>
							<text>{{ $t('lang.share_with_friends') }}</text>
						</view>
						<view class="list" @click="posterAppShare('pyq')">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B5909313764D1D265E4DEF899458559.png" mode="widthFix"></image>
							<text>{{ $t('lang.generate_sharing_poster') }}</text>
						</view>
						<!-- #endif -->
						<view class="list" @click="downloadImg">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_65946CB61B087346EBA2A3375F81C2EB.png" mode="widthFix"></image>
							<text>{{ $t('lang.save_picture') }}</text>
						</view>
					</view>
					<view class="cancel" @click="popupPosterCancel">{{$t('lang.cancel')}}</view>
				</view>
			</view>
		</uni-popups>
		<!-- 配送弹框 start -->
		<uni-popups ref="address" type="bottom">
			<view class="pop_content" :style="{height: `${popHeight.hd}px`}">
				<view class="pop_header">
					<text class="iconfont icon-find-fanhui" @click="currAddressSwiper = 0"
						v-if="currAddressSwiper == 1"></text>
					<text class="pop_title">{{$t('lang.delivery_to_the')}}</text>
					<image class="close_img" src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png" @click="closePop('address')"></image>
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
									<view class="address_val" style="display: flex;flex-direction: row;align-items: center;">
										<view style="margin-right: 20rpx;">{{ item.province_name }} {{ item.city_name }}</view>
										<view style="border-radius: 10rpx;border: 2rpx solid #F91F28;width: 80rpx;text-align: center;color: #f91f28;height: 40rpx;line-height: 40rpx;transform: scale(0.8);" v-if="iSaddress == item.id">默认</view>
									</view>
									<view class="address_val">{{item.district_name}} {{item.street_name}} {{item.address}}</view>
								</view>
							</view>
						</view>
						<view v-else>
							<view style="height: 150rpx;"></view>
							<view class="none_lauout">
								<image class="none_img" src="https://images.eqingqu.com/attachs/photo/202404/20240418_7CA9C895B86A19B4657088E863299FA2.png"></image>
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
					</view>
				</block>
				<block v-else>
					<dsc-region :display="regionShow" regionType="goods" :regionOptionData="regionData"
						@updateDisplay="getRegionShow" @updateRegionDate="getRegionOptionDate"
						v-if="regionLoading"></dsc-region>
				</block> -->
			</view>
		</uni-popups>
		<!-- 配送弹框 end -->
		<!--地区选择-->
		<!-- <dsc-region :display="regionShow" :regionOptionData="regionData" @updateDisplay="getRegionShow" @updateRegionDate="getRegionOptionDate" v-if="regionLoading"></dsc-region> -->
		
		<dsc-common-nav>
			<navigator url="../seckill" class="nav-item" slot="right">
				<view class="iconfont icon-team"></view>
				<text>{{$t('lang.seckll_home')}}</text>
			</navigator>
		</dsc-common-nav>
		
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		
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
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	import uniTag from "@/components/uni-tag.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';
	import permision from "@/common/permission.js";
	import goodsNavBar from '@/components/goods-nav-bar/goods-nav-bar.vue';
	import dscCopyright from '@/components/dsc-copyright/dsc-copyright.vue';
	
	/*地区选择组件*/
	// import dscRegion from '@/components/dsc-region.vue';
	export default {
		mixins:[universal],
		data() {
			return {
				seckill_id:0,
				tomorrow:0,
				poster:false,
				seckillTime:'',
				current: 0,
				tabs: [this.$t('lang.goods_detail_info'), this.$t('lang.specification_parameter')],
				num:1,
				shareImgShow:false,
				mpShareImg: '',
				rgba: 'rgba(0,0,0,0)',
				navIconRgba: 'rgba(0,0,0,0.4)',
				navOpacity: 0,
				showBase:false,
				dscLoading:true,
				goodsAttrInit: [],
				goodsAttrOper: {},
				//微信小程序客服
				wxappChat:uni.getStorageSync("configData").wxapp_chat || 0,
				
				photo_show:false,
				
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				currAddressSwiper: 0,
				addressList: [],
				
				regionSplic:'请选择',
				regionData:{}
			}
		},
		components:{
			uniSegmentedControl,
			uniIcons,
			uniNumberBox,
			uniCountdown,
			uniTag,
			uniPopup,
			uniPopups,
			dscNotContent,
			dscCommonNav,
			goodsNavBar,
			dscCopyright,
			// dscRegion
		},
		computed:{
			...mapState({
                goodsInfo: state => state.ump.seckillDetailData,
				shipping_fee: state => state.shopping.shipping_fee
			}),
			gallerylList() {
				return this.goodsInfo.pictures ? this.goodsInfo.pictures : []
			},
			attr(){
				return this.goodsInfo.attr
			},
			//已选
			attr_name: {
				get() {
					return this.attr != '' ? this.goodsInfo.attr_name + ' ' + this.num + this.goodsInfo.goods_unit : this.num + this.goodsInfo.goods_unit
				},
				set(val) {
					this.goodsInfo.attr_name = val
				}
			},
			stock() {
				return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
			},
			secLimit() {
				if (this.goodsAttrOper.sec_limit && this.goodsAttrOper.stock) {
					return this.goodsAttrOper.stock < this.goodsAttrOper.sec_limit ? this.goodsAttrOper.stock : this.goodsAttrOper.sec_limit;
				}
				return this.goodsAttrOper.stock;
			},
			number:{
				get(){
					return this.goodsInfo.is_minimum > 0 ? this.goodsInfo.minimum : 1
				},
				set(val){
					this.num = val
				},
			},
			//运费
			freight() {
				var that = this
				var abc = ''
				if (that.regionSplic != '请选择') {
					abc = this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee
						.shipping_fee_formated + '（满' + this.shipping_fee.mian_free_money + '包邮）' : this.$t('lang.is_shipping_area')
				} else {
					abc = '选择收货地址后查看'
				}
				return abc
			    // return this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee.shipping_fee_formated : this.$t('lang.is_shipping_area')
			},
			isTimeEnd(){
				return this.goodsInfo.formated_end_date > this.goodsInfo.current_time ? true : false
			},
			dateTime(){
				let dataTime = this.goodsInfo.formated_end_date
				if(dataTime != ''){
					return this.$formatDateTime(dataTime)
				}
			},
			goodsDesc(){
				let result = this.goodsInfo.goods_desc;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
			
				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
			goodsCollectStatue(){
                return this.$store.state.user.goodsCollectStatue
            },
            is_collect:{
                get(){
                    return this.$store.state.ump.seckillDetailData.is_collect
                },
                set(val){
                    this.$store.state.ump.seckillDetailData.is_collect = val
                }
            },
			iSaddress:{
				get(){
					console.log("zheli")
					console.log(this.$store.state.user.addressId)
					return this.$store.state.user.addressId
				},
				set(value){
					this.$store.dispatch('userAddressDefault',{
						address_id:value
					})
				}
			},
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
		onShareAppMessage(res){
			return {
			  title: this.goodsInfo.goods_name,
			  path: '/pagesA/seckill/detail/detail?id=' + this.seckill_id + '&tomorrow=' + this.tomorrow
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
		      title: this.goodsInfo.goods_name,
		      query: {
		        key: 'id='+ this.seckill_id + '&tomorrow=' + this.tomorrow
		      },
			 imageUrl: this.goodsInfo.goods_thumb
		    }
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
				let shareInfo = {
					href:this.$websiteUrl + 'seckill/detail?seckill_id=' + this.seckill_id + '&tomorrow=' + this.tomorrow + '&platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			}
		},
		onPageScroll(e) {
			// 导航栏背景渐变
			const ratio = (e.scrollTop / uni.upx2px(375)).toFixed(1);
			if (ratio >= 1) {
				this.rgba = 'rgba(251,251,251,1)';
				this.navIconRgba = 'rgba(251,251,251,1)';
				this.navOpacity = 1;
			} else if (ratio > 0) {
				this.rgba = `rgba(251,251,251,${ratio})`;
				if (ratio > 0.5) {
					this.navIconRgba = `rgba(0,0,0,${1 - ratio})`;
				};
				this.navOpacity = ratio;
			} else {
				this.rgba = 'rgba(0,0,0,0)';
				this.navIconRgba = 'rgba(0,0,0,0.4)';
				this.navOpacity = 0;
			}
		},
		onShow() {
			var that = this
			that.$store.dispatch('userAddress');
			if (that.$isLogin()) {
				that.getAddressList();
			}
		},
		onLoad(e){
			//#ifdef MP-WEIXIN
			uni.showShareMenu({
			  withShareTicket: true,
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
			
			let that = this
			console.log(e)
			that.seckill_id = e.id;
			that.tomorrow = e.tomorrow ? e.tomorrow : 0;
			
			//小程序扫码
			if (e.scene) {
				let scene = decodeURIComponent(e.scene);
				let fristParameter = scene.split('_')[0];
				let lastParameter = scene.split('_')[1];
				
				// 判断分割第一个参数是否有 "."
				that.seckill_id = fristParameter.indexOf('.') > 0 ? fristParameter.split('.')[0] : fristParameter;
				that.tomorrow = fristParameter.indexOf('.') > 0 ? fristParameter.split('.')[1] : 0;
				
				
				if(lastParameter){
					uni.setStorageSync('parent_id',lastParameter);
				}
			}
			
			that.loadGoodsInfo();
		},
		watch:{
			regionSplic(){
				this.shipping_region = {
			        province_id: this.regionData.province.id,
			        city_id: this.regionData.city.id,
			        district_id: this.regionData.district.id,
			        street_id: this.regionData.street.id
			    }
				console.log(this.shipping_region)
				setTimeout(()=>{
					//运费
					if(this.goodsInfo) this.shippingFee(this.shipping_region,this.goodsInfo.goods_attr_id);
				},1000)
			},
			goodsInfo(){
				//运费
				if(this.goodsInfo.goods_id){
					this.dscLoading = false;
				}
				
				const attrInit = []
				if (Array.isArray(this.goodsInfo.attr)) {
					for(let i = 0; i < this.goodsInfo.attr.length; i++){
						for(let j = 0; j < this.goodsInfo.attr[i].attr_key.length;j++){
							if(j == 0){
								attrInit.push(this.goodsInfo.attr[i].attr_key[j].goods_attr_id)
							}
						}
					}
				}
				this.goodsAttrInit = attrInit
			},
			goodsAttrOper() {
			    if (this.goodsAttrOper) {
			        this.attr_name = this.goodsAttrOper.attr_name
			    }
			},
			regionShow() {
				if (this.regionShow) {
					this.regionLoading = true
				}
			},
			goodsCollectStatue() {
			    this.goodsCollectStatue.forEach((v) => {
			        if (v.id == this.goodsInfo.goods_id) {
			            this.is_collect = v.status
			        }
			    })
			},
			sharePoster() {
				if (this.sharePoster) {
					this.$refs.popupPoster.open();
				}
			},
			goodsAttrInit(){
			    this.changeAttr();
			}
		},
		methods: {
			// 显示底部弹框
			showPopup(res) {
				var that = this
				if (that.$isLogin()) {
					that.$refs[res].open()
								
					if (res == 'address') {
						that.regionShow = true;
					}
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
				
			},
			async getAddressList() {
				const {
					data,
					status
				} = await this.$store.dispatch('getuserAddressList');
				if (status == 'success') this.addressList = data;
				if(this.addressList.length > 0){
					for(var i=0;i<this.addressList.length;i++){
						if(this.addressList[i].is_checked==1){
							this.regionSplic = this.addressList[i].province_name + ' ' +  this.addressList[i].city_name + ' ' +  this.addressList[i].district_name + ' ' +  this.addressList[i].street_name + this.addressList[i].address
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
							uni.setStorageSync('regionData',o)
							//替换mixins/form-processing this.regionOptionDate
						}
					}
				} else {
					this.regionSplic = '请选择'
				}
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
				this.regionSplic = o.regionSplic;
				this.regionData = o
				//选中的收货地址id
				this.addressRadio = res.id;
				
				this.iSaddress = res.id;
				console.log(res.id)
				//切换收货地址清除驿站
				uni.removeStorageSync('leader_id');
				
				this.$store.dispatch('setChangeConsignee',{
					address_id:res.id
				}).then(res=>{
					
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
				uni.setStorageSync('regionData',o)
				
				//关闭收货地址弹窗
				this.closePop('address');
				
			},
			
			togetlocation(){
				var that = this
				that.$refs['address'].close()
				uni.navigateTo({
					url:'/pagesB/address/addressEdit'
				})
				return;
				uni.getLocation({
				  geocode: true, // 返回经纬度
				  success: function (loction) {
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
						if(a.city.length == 0){
							console.log(a.province + ' ' + a.province + ' ' + a.district + ' ' + a.township)
						} else {
							console.log(a.province + ' ' + a.city + ' ' + a.district + ' ' + a.township)
						}
						uni.request({
							url: 'https://www.ok9288.com/api/misc/getAddressInfo',
							method: 'GET',
							header: {
								'Content-Type': 'application/json',
							},
							data: {
								towncode: resda.data.regeocode.addressComponent.towncode,
							},
							success: (res1) => {
								console.log(res1.data)
								if (res1.statusCode == 200) {
									console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
									
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
									
									
									that.$store.dispatch('userAddressDefault',{
										address_id:''
									})
									
									that.$store.dispatch('setRegion',{
										region:res1.data.street,
										level:5
									})
									uni.setStorageSync('regionData',o)
									
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
			
			selectOtherAddress() {
				var that = this
			
				that.currAddressSwiper = 1;
			},
			
			//选中其他地址
			getRegionShow() {
				this.addressRadio = '';
			
				//关闭弹窗
				this.regionShow = false;
				this.closePop('address');
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
				if (res == 'goodsattr') {
					this.storeBtn = false;
				}
			},
			
			
			loadGoodsInfo(){
				this.$store.dispatch('setSeckillDetail',{
					seckill_id: this.seckill_id,
					tomorrow: this.tomorrow
				}).then(res =>{
					console.log(res.data)
				})
			},
			//banner滚动
			swiperChange(e){
				this.poster = false
			},
			//视频自动播放
			onPlay(){
				this.poster = true
			},
			//视频播放错误
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			//收藏
			collection(){
				if(this.$isLogin()){
					this.$store.dispatch('setCollectGoods', {
						goods_id: this.goodsInfo.goods_id,
						status: this.is_collect
					})
				}else{
					uni.showModal({
						content: this.$t('lang.fill_in_user_collect_goods'),
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pagesB/login/login'
								})
							}
						}
					})
				}
			},
			//选择属性
			skuLink() {
				this.showBase = true
				this.changeAttr()
			},
			changeAttr(){
				uni.request({
					url: this.websiteUrl + '/api/seckill/attr_price',
					method: 'POST',
					data: {
						goods_id: this.goodsInfo.goods_id,
						num: this.num,
						attr_id: this.goodsAttrInit,
						seckill_goods_id: this.seckill_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.goodsAttrOper = res.data.data
						}
					}
				})
			},
			//属性切换
			attrChange(index,id){
				this.goodsAttrInit.splice(index,1,id)
			},
			onSku(){
				if (this.attr.length > 0) {
					this.showBase = true
					this.changeAttr()
				} else {
					this.seckillCheckout();
				}
			},
			async seckillCheckout(){
				let cur_number = Number(this.goodsInfo.order_number) + Number(this.num)
				
				//判断是否绑定手机号
				if(!uni.getStorageSync('bindMobilePhone')){
					let roles = await this.$store.dispatch('setUserId',{type:true});
					if(!roles.data.mobile_phone){
						uni.showModal({
							content: this.$t('lang.is_user_bind_mobile_phone'),
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

                if(this.goodsInfo.sec_limit === 0 || (this.goodsInfo.sec_limit >= cur_number)){
					let newAttr = []
					if (this.attr.length > 0) {
					    newAttr = this.goodsAttrInit
					}
					
                    this.$store.dispatch('setSeckillBuy',{
                        sec_goods_id: this.seckill_id,
                        number:this.num,
						spec: newAttr,
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                        goods_spec:0
                    }).then(res => {
						let data = res.data					
                        if(data.error == 1){
							uni.showToast({
								title:data.mesg,
								icon:'none'
							})
						}else{
							uni.navigateTo({
								url:'/pagesD/checkout/checkout?rec_type=' + data.flow_type + '&type_id=' + data.extension_id
							})
						}
                    })
                }else{
					let title = ''
					if(this.goodsInfo.order_number > 0){
						title = this.$t('lang.groupbuy_propmt_1') + this.goodsInfo.order_number + this.$t('lang.groupbuy_propmt_2');
					}else{
						title = this.$t('lang.groupbuy_propmt_4');
					}
					
					uni.showToast({
						title:title,
						icon:'none',
						duration:1000
					})
                }
			},
			bindChange(e){
				this.num = e
			},
			//运费
			shippingFee(val,id) {
			    this.$store.dispatch('setShippingFee', {
			        goods_id: this.goodsInfo.goods_id,
			        position: JSON.stringify(val),
					goods_attr_id: id
			    })
			},
			// 分享
			appShare() {
				let shareInfo = {
					href: `${this.$websiteUrl}groupbuy/detail/${this.act_id}?parent_id=${uni.getStorageSync("user_id")}&splatform=APP`,
					title: this.goodsInfo.goods_name,
					summary: this.goodsInfo.goods_brief,
					imageUrl: this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo, 'poster');
			},
			mpShare() {
				this.onGoodsShare();
			},
			onGoodsShare() {
				if (this.$isLogin()) {
					uni.showLoading({ title: this.$t('lang.loading') });
					let price = this.goodsInfo.sec_price
					let o = {}
					
					// #ifdef MP-WEIXIN
					o = {
						goods_id: this.goodsInfo.goods_id,
						ru_id: 0,
						price: price,
						share_type: 0,
						type: 0,
						platform: 'MP-WEIXIN',
						extension_code:'seckill',
						code_url:'pagesA/seckill/detail/detail',
						scene:`${this.seckill_id}.${this.tomorrow}`,
						thumb:this.gallerylList[0].img_url,
					}
					// #endif
					
					// #ifdef APP-PLUS
					o = {
						goods_id: this.goodsInfo.goods_id,
						price: price,
						share_type: 0,
						platform: 'APP',
						extension_code:'seckill',
						code_url:`${this.$websiteUrl}seckill/detail?seckill_id=${this.seckill_id}&tomorrow=${this.tomorrow}`,
						thumb:this.gallerylList[0].img_url,
					}
					// #endif
			
					this.$store
						.dispatch('setGoodsShare', o)
						.then(res => {
							if (res.status == 'success') {
								this.mpShareImg = res.data;
			
								// #ifdef MP-WEIXIN
								this.shareImgShow = true;
								// #endif
			
								// #ifdef APP-PLUS
								this.appShare();
								// #endif
			
								uni.hideLoading();
							}
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
			
				// #ifdef APP-PLUS
				this.sharePoster = false;
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
						itemList: [this.$t('lang.send_to_friend'), this.$t('lang.save_picture'), this.$t('lang.collect')],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
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
				console.log(JSON.stringify(result))
				if(result == 1) {  
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
			photo_showNo:function(){
				this.photo_show = false
				// uni.navigateBack()
			},
			photo_showYes:function(){
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
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.fixed-bottom-padding {
		padding: 0;
	}
	.dsc-safe-area-inset-bottom {
	  height: 100rpx;
	  padding-bottom: 0;  
	  padding-bottom: constant(safe-area-inset-bottom);  
	  padding-bottom: env(safe-area-inset-bottom);  
	}
.cont-box .title .goods_shipai{ color: #f92028;}

.price-box{ display: flex; flex-direction: row; justify-content: center;}
.price-box .left{ flex: 1; padding: 20upx; background: linear-gradient(90deg,#f22c8f,#f23256); color: #FFFFFF;}
.price-box .left view{ line-height: 1.2;}
.price-box .left .price-weight{ font-size: 36upx; font-weight: 700;}
.price-box .left .price-row{ display: flex; flex-direction: row; justify-content: flex-start;}
.price-box .left .price-row .tag{ display: flex; flex-direction: row; overflow: hidden;}
.price-box .left .price-row .tag-icon{ background: #FFFFFF; width: 50upx; border-radius: 20upx 0 0 20upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.price-box .left .price-row .tag-icon .iconfont{ color: #f23157; font-size: 24upx;}
.price-box .left .price-row .tag-right-cont{ border: 1px solid #FFFFFF; padding: 0 20upx;}
.price-box .left .price-row .sub{ display: flex; flex-direction: row; margin-left: 10upx; font-size: 25upx; align-items: center;}
.price-box .left .price-row .sub .price-original{ font-size: 25upx; margin-left: 10upx;text-decoration:line-through;}
.price-box .right{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20upx; background: #ffeae9;}
.price-box .right text{ color: #f23157;}

.goods_outer{ padding: 0; margin-top: 10upx;}

/* 小程序分享  start*/
.show-popup-shareImg ::v-deep .uni-popup-bottom{ height: 80%; }
/* 小程序分享 end*/

.uni-list-cell-navigate{ justify-content: flex-start; } 
.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}
.uni-list-cell .iconfont{ color: #f92028; margin-right: 10upx;}
.uni-list-cell-title .uni-list-cell-navigate{ flex-direction: column; }
.uni-list-cell-title .uni-list-cell-navigate.uni-navigate-right:after{ top: 35%;}
.uni-list-cell-title .uni-list-cell-navigate .title{ width: 100%; color: #333333; font-weight: 600; font-size: 32upx; margin-bottom: 20upx;}
.uni-list-cell-title .uni-list-cell-navigate .value{ display: flex; align-items: center; color: #999999;}

.attr-goods-box {
	position: relative;
}

.attr-goods-box .attr-goods-header {
	padding: 20upx;
}

.attr-goods-box .attr-goods-header .attr-img {
	position: absolute;
	box-shadow: 2px 2px 15px rgba(46, 58, 76, .17) !important;
	width: 200upx;
	height: 200upx;
	border-radius: 10upx;
	top: -40upx;
	overflow: hidden;
}

.attr-goods-box .attr-goods-header .attr-img image {
	width: 100%;
}

.attr-goods-box .attr-goods-header .attr-info {
	margin-left: 220upx;
	text-align: left;
}

.attr-goods-box .attr-goods-header .attr-info .attr-price {
	font-size: 35upx;
	color: #f92028;
	height: 60upx;
}

.attr-goods-box .attr-goods-header .attr-info .attr-price text {
	color: #888;
	font-size: 26upx;
}

.attr-goods-box .attr-goods-header .attr-info .attr-stock {
	color: #888;
	font-size: 26upx;
}

.attr-goods-box .attr-goods-header .attr-info .attr-other {
	color: #888;
	font-size: 26upx;
}

.attr-goods-box .attr-goods-content {
	min-height: 240upx;
	max-height: 480upx;
	overflow-y: auto;
	padding: 0 20upx;
	text-align: left;
}

.attr-goods-box .attr-goods-content .sku-item {
	padding-bottom: 20upx;
}

.attr-goods-box .attr-goods-content .sku-item .sku-tit {
	color: #000;
	font-weight: bold;
}

.attr-goods-box .attr-goods-content .sku-item .sku-list {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.attr-goods-box .attr-goods-content .sku-item .sku-list text {
	padding: 5upx 30upx;
	border: 1px solid #e6e6e6;
	background: #FFFFFF;
	margin: 10upx 20upx 10upx 0;
	font-size: 26upx;
	color: #333;
	border-radius: 8upx;
}

.attr-goods-box .attr-goods-content .sku-item .sku-list text.active {
	border-color: #f92028;
	color: #f92028;
}

.attr-goods-box .attr-goods-number {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 20upx 20upx 30upx 20upx;
}

.attr-goods-box .attr-goods-number .tit {
	width: 200upx;
	text-align: left;
	color: #888;
}

.attr-goods-box .attr-goods-number .stepper {
	flex: 1 1 0%;
	display: flex;
	justify-content: flex-end;
}
	
.title .ziying {
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
	display: inline-block;
}
.title .country_icon{
	width: 40rpx;
	height: 28rpx;
	position: relative;
	top: 5rpx;
	display: inline-block;
}

.title .country_icon_text{
	display: inline-block;
	font-size: 22rpx;
	font-weight: normal;
	color: #666;
}

.title .country_icon_text .icon_text_name{
	padding-left: 7rpx;
}
.btn-goods-action_1{
	position:fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99;
	background: #FFFFFF;
	display: flex;
	flex-direction: row;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
.btn-goods-action_1 .item{
	min-width: 15%;
	justify-content: center;
	text-align: center;
	align-items: center;
	border: 0 solid #e5e5e5;
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
		top:10%;
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
	
	.red_btn {
		color: #ffffff;
		font-size: 30rpx;
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
</style>
