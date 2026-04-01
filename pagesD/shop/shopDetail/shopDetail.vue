<template>
	<view class="shop-detail" v-if="shopDetail">
		<dsc-shop-header :shopInfo="shopInfo" :shopIndex="shopIndex" :shopScore="shopScore" :shopCollect="shopCollect" @update="updateInfo"></dsc-shop-header>
		<view class="shopping-info-nums">
			<view class="item" @click="$outerHref('/pagesD/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=goods_id','app')">
				<text class="tit">{{ shopDetail.count_goods }}</text>
				<text class="text">{{$t('lang.all_goods')}}</text>
			</view>
			<view class="item" @click="$outerHref('/pagesD/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=store_new','app')">
				<text class="tit">{{ shopDetail.count_goods_new }}</text>
				<text class="text">{{$t('lang.new')}}</text>
			</view>
			<view class="item" @click="$outerHref('/pagesD/shop/shopGoods/shopGoods?ru_id='+shopDetail.ru_id + '&type=is_promote','app')">
				<text class="tit">{{ shopDetail.count_goods_promote }}</text>
				<text class="text">{{$t('lang.promotion')}}</text>
			</view>
		</view>
		<view class="uni-card uni-card-not uni-card-contact">
			<view class="uni-list uni-collapse-left">
				<!-- #ifndef MP-WEIXIN -->
				<view class="uni-list-cell" @click="onChat(shopDetail.shop_name,'',shopDetail.ru_id)">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.online_service')}}</text>
						<view class="value"><icon class="iconfont icon-kefu"></icon></view>
					</view>
				</view>
				<!-- #endif -->
				
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="contact" type="default" size="5" session-from="weapp" hover-class="none" class="uni-list-cell kefu-cantact" v-if="wxappChat > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.online_service')}}</text>
						<view class="value"><icon class="iconfont icon-kefu"></icon></view>
					</view>
				</button>
				<view class="uni-list-cell" @click="onChat(shopDetail.shop_name,'',shopDetail.ru_id)" v-else>
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.online_service')}}</text>
						<view class="value"><icon class="iconfont icon-kefu"></icon></view>
					</view>
				</view>
				<!-- #endif -->
				<view class="uni-list-cell" @click="handleCode">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.shop_qr_code')}}</text>
						<view class="value"><icon class="iconfont icon-904anquansaoma"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell" @click="makePhone(shopDetail.kf_tel)" v-if="shopDetail.is_ru_tel == 1">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.shop_tel')}}</text>
						<view class="value"><icon class="iconfont icon-a"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell" @click="telShow=true" v-else>
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.shop_tel')}}</text>
						<view class="value"><icon class="iconfont icon-a"></icon></view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not uni-card-address">
			<view class="uni-list uni-collapse-left">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.company_profile')}}</text>
					</view>
				</view>
				<view class="uni-list-cell" @click="seeLicense">
					<view class="uni-list-cell-navigate">
	
							<text class="title">{{$t('lang.certificate_info')}}{{ (basic_info && basic_info.company_name) || '' }}</text>
						<view class="value"><icon class="iconfont icon-yanzheng" style="color: #21ba45;"></icon></view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.label_corporate_name')}}{{ (shopDetail && shopDetail.shop_name) || '' }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.label_region')}}{{ (shopDetail && shopDetail.shop_address) || '' }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.label_main_brand')}}{{ (shopDetail && shopDetail.shoprz_brand_name) || '' }}</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view class="title" style="display: flex;flex-direction: row;align-items: center;">{{$t('lang.label_seller_Grade')}}<image :src="shopDetail.logo_thumb  " mode="widthFix" style="width: 40rpx;height: 40rpx;" v-if="shopDetail && shopDetail.grade_img"></image> {{ (shopDetail && shopDetail.grade_name) || '' }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup :show="show" type="middle" @hidePopup="handelClose('code')">
			<view class="code-popup">
				<view class="tit">{{ shopDetail.shop_name }}</view>
				<view class="qrode"><image :src="shopDetail.shop_qrcode" mode="widthFix" class="img"></image></view>
				<text>{{$t('lang.rm_wd_info_zz')}}</text>
			</view>
		</uni-popup>
		
		<uni-popup :show="telShow" type="middle" @hidePopup="handelClose('tel')">
			<view class="tel-popup">
				<view class="tip">{{$t('lang.is_tel_tip_1')}}</view>
				<view class="desc">{{$t('lang.is_tel_tip_2')}}</view>
				<view class="btn" @click="$outerHref('/pagesA/drp/register/register','app')">{{$t('lang.is_tel_tip_3')}}</view>
				
				<view class="close" @click="handelClose('tel')">
					<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_53EB47F93542B07A5D951F4C4E187EA1.png" mode="widthFix" class="img"></image>
				</view>
			</view>
		</uni-popup>
		
		<uni-popups ref="goodsattr" type="bottom">
			<view class="pop_content">
			<scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}">
				<image class="close_img" src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png" @click="closePop('goodsattr')"></image>
				<view class="license-popup">
					<view class="tit">{{$t('lang.rm_prompt_info')}}<!-- <text class="iconfont icon-close1"></text> --></view>
					<view class="license-content" v-if="basic_info">
						<view>{{$t('lang.label_companyName')}}{{ basic_info.company_name }}</view>
						<view>{{$t('lang.label_business_license_id')}}{{ basic_info.business_license_id }}</view>
						<view>{{$t('lang.label_legal_person')}}{{ basic_info.legal_person }}</view>
						<view>{{$t('lang.label_license_comp_adress')}}{{ basic_info.license_comp_adress }}</view>
						<view>{{$t('lang.label_registered_capital')}}{{ basic_info.registered_capital }}</view>
						<view>{{$t('lang.label_business_term')}}{{ basic_info.business_term }}</view>
						<view>{{$t('lang.label_busines_scope')}}{{ basic_info.busines_scope }}</view>
						<view>{{$t('lang.label_company_located')}}{{ basic_info.company_adress }}</view>
						<view>{{$t('lang.label_shop_name')}}{{ shopDetail.shop_name }}</view>
					<view>{{$t('lang.label_license_img')}}
						<view v-if="licenseImgList && licenseImgList.length > 0" class="img-list">
							<image v-for="(img, index) in licenseImgList" :key="index" :src="img" class="img" mode="widthFix" @click="previewImage(licenseImgList, index)"></image>
						</view>
						<text v-else>{{$t('lang.not_available')}}</text>
					</view>
					<view>{{$t('lang.label_industry_img')}}
						<view v-if="industryImgList && industryImgList.length > 0" class="img-list">
							<image v-for="(img, index) in industryImgList" :key="index" :src="img" class="img" mode="widthFix" @click="previewImage(industryImgList, index)"></image>
						</view>
						<text v-else>{{$t('lang.not_available')}}</text>
					</view>
						<view class="help">{{$t('lang.rm_prompt_help')}}</view>
					</view>
					<!-- <view class="uni-icon">
						<uni-icons type="closeempty" size="60" @click="handelClose('license')"></uni-icons>
					</view> -->
				</view>
				<view style="height: 20rpx;"></view>
			</scroll-view>
			</view>
		</uni-popups>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import dscShopHeader from '@/pagesD/components/dsc-shop-header.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import universal from '@/common/mixins/universal.js';
	
	export default {
		mixins:[universal],
		data() {
			return {
				ru_id: 0,
				show: false,
				shopScore:true,
				shopCollect:true,
				shopIndex: 0,
				LicenseShow:false,
				//΢��С�����ͷ�
				wxappChat:uni.getStorageSync("configData").wxapp_chat || 0,
				telShow:false,
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
			}
		},
		components:{
			uniPopup,
			uniIcons,
			dscShopHeader,
			uniPopups
		},
		computed:{
			...mapState({
				shopDetail: state => state.shop.shopDetail
			}),
			basic_info(){
				return this.shopDetail && this.shopDetail.basic_info ? this.shopDetail.basic_info : null
			},
			is_collect_shop:{
				get(){
					return this.shopDetail.is_collect_shop
				},
				set(val){
					this.shopDetail.is_collect_shop = val
				}
			},
			count_gaze:{
				get(){
					return this.shopDetail.count_gaze
				},
				set(val){
					this.shopDetail.count_gaze = val
				}
			},
			shopInfo(){
				let arr = []

				arr[this.shopIndex] = {
					shopName:this.shopDetail.shop_name,
					shopgrade:this.shopDetail.shopgrade,
					shop_name_len:this.shopDetail.shop_name_len,
					logo:this.shopDetail.logo_thumb,
					ru_id:this.shopDetail.ru_id,
					commentdelivery:this.shopDetail.commentdelivery,
					commentdelivery_font:this.shopDetail.commentdelivery_font,
					commentrank:this.shopDetail.commentrank,
					commentrank_font:this.shopDetail.commentrank_font,
					commentserver:this.shopDetail.commentserver,
					commentserver_font:this.shopDetail.commentserver_font,
					count_gaze:this.count_gaze,
					is_collect_shop:this.is_collect_shop,
				}

				return arr
			},
			// 营业执照图片数组
			licenseImgList(){
				if(!this.basic_info || !this.basic_info.license_fileImg) return []
				const img = this.basic_info.license_fileImgs
				// 如果是数组，直接返回
				if(Array.isArray(img)) return img
				// 如果是字符串，尝试解析为数组
				if(typeof img === 'string'){
					// 尝试 JSON 解析
					try {
						const parsed = JSON.parse(img)
						if(Array.isArray(parsed)) return parsed
					} catch(e) {
						// 如果不是 JSON，尝试按逗号分割
						if(img.includes(',')) {
							return img.split(',').map(item => item.trim()).filter(item => item)
						}
					}
					// 单个字符串，转为数组
					return [img]
				}
				return []
			},
			// 行业资质图片数组
			industryImgList(){
				if(!this.basic_info) return []
				// 优先使用 industry_fileImg，如果没有则使用 license_fileImg（兼容旧数据）
				const img = this.basic_info.industry_fileImg 
				if(!img) return []
				// 如果是数组，直接返回
				if(Array.isArray(img)) return img
				// 如果是字符串，尝试解析为数组
				if(typeof img === 'string'){
					// 尝试 JSON 解析
					try {
						const parsed = JSON.parse(img)
						if(Array.isArray(parsed)) return parsed
					} catch(e) {
						// 如果不是 JSON，尝试按逗号分割
						if(img.includes(',')) {
							return img.split(',').map(item => item.trim()).filter(item => item)
						}
					}
					// 单个字符串，转为数组
					return [img]
				}
				return []
			},
		},
		onReady() {
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.9));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.9) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.9) - uni.upx2px(190));
		},
		methods: {
			updateInfo(obj){
				this.is_collect_shop = obj.is_collect_shop
				this.count_gaze = this.is_collect_shop == 1 ? this.count_gaze + 1 : this.count_gaze - 1 
			},
			handleCode(){
				this.show = true;
			},
			makePhone(val){
				if(val){
					uni.makePhoneCall({
					    phoneNumber: val
					});
				}else{
					uni.showToast({ title:this.$t('lang.shop_not_set_kefu_tel'), icon:'none' });
				}
			},
			handelClose(val){
				console.log(val)
				if(val == 'code'){
					this.show = false
				}else if(val == 'license'){
					// this.LicenseShow = false
					this.$refs['goodsattr'].close()
				}else if(val == 'tel'){
					this.telShow = false
				}
			},
			// �رյײ�����
			closePop(res) {
				this.$refs['goodsattr'].close()
			},
			seeLicense(){
				this.$refs['goodsattr'].open();
			  // this.LicenseShow = true
			},
			// 预览图片
			previewImage(urls, current){
				if(!urls || urls.length === 0) return
				uni.previewImage({
					current: current || 0,
					urls: urls,
					indicator: 'number'
				})
			},
		},
		onLoad(e){
			this.ru_id = e.id ? e.id : 0;
	
			this.$store.dispatch('setShopDetail',{
				ru_id:this.ru_id
			})
		},
	}
</script>

<style>
.shopping-info-nums{ display: flex; flex-direction: row; align-items: center; justify-content:center; background: #FFFFFF; border-top: 2upx solid #f6f6f9; padding: 10upx 0;}
.shopping-info-nums .item{ flex: 1; width: 33.3%; display: flex; flex-direction: column; justify-content: center; align-items: center;}
.shopping-info-nums .item .tit{ font-size: 35upx; font-weight: 600;}
.shopping-info-nums .item .text{ font-size: 25upx; color: #999999;}

.uni-card .uni-list-cell .title{ font-size: 30upx; color: #333333; }
.uni-card .uni-list-cell .value .iconfont{ font-size: 36upx;}
.uni-card .uni-list-cell .title image{ width: 40upx; height: 40upx;}

.shop-detail .uni-popup-middle{ width: 74%; padding: 0; height: auto; border-radius: 0; background: #f7f7f7; }
.shop-detail .code-popup{ width: 100%;}
.shop-detail .code-popup .tit{ padding: 20upx; color: #444444; border-bottom: 2upx solid #eee; text-align: center; font-size: 30upx; }
.shop-detail .code-popup .qrode{ width: 450upx; height: 450upx; padding: 20upx; background: #FFFFFF; margin: 20upx auto;}
.shop-detail .code-popup text{ color: #777777; text-align: center; padding: 15upx; border-top: 2upx solid #eee; display: block;}

.shop-detail .license-popup .tit{ padding: 20rpx; font-size: 30upx; display: flex; justify-content: space-between; align-items: center;}
.shop-detail .license-popup .tit .iconfont{ margin-right: 20rpx; font-size: 14px; }
.shop-detail .license-popup .license-content{ padding: 0 20rpx; }
.shop-detail .license-popup .license-content .help{ margin-top: 20upx; font-weight: 600;}
.shop-detail .license-popup .uni-icon{ margin: 50upx auto; display: flex; justify-content: center; align-items: center; }

.shop-detail ::v-deep .uni-popup{ border-radius: 10rpx;}
.shop-detail .tel-popup{ padding: 30rpx 0 50rpx; text-align: center;}
.shop-detail .tip{ font-size: 32rpx; line-height: 60rpx;}
.shop-detail .desc{ font-size: 30rpx; margin-bottom: 20rpx;line-height: 60rpx;}
.shop-detail .btn{ color: #e93b3d; font-size: 30rpx;}

.shop-detail .uni-popup-middle .close{
	width: 20upx;
	height: 20upx;
	line-height: 20upx;
	position: absolute;
	top: -20upx;
	right: -15upx;
	border-radius: 50%;
	background: rgba(0,0,0,.3);
	padding: 10rpx;
}

.close_img {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 44rpx;
	height: 44rpx;
}
.pop_content {
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	background-color: #fff;
}

.license-popup .license-content .img-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 10rpx;
	gap: 10rpx;
}

.license-popup .license-content .img-list .img {
	width: 100%;
	max-width: 100%;
	margin-bottom: 10rpx;
	border-radius: 8rpx;
}
</style>
