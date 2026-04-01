<template>
	<view>
	<block v-if="list.length > 0">
		<view class="uni-product-list" :class="{'product-list-medium':mode !== 'grid'}">
			<view class="uni-product" v-for="(item,index) in list" :key="index">
				<view class="image-view" v-if="routerName == 'bargain'" @click="detailLink(routerName,item.id)">
					<image v-if="item.goods_thumb" class="uni-product-image" :src="item.goods_thumb"></image>
					<image v-else class="uni-product-image"
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
					</image>
					<view class="bargain-tag" v-if="routerName == 'bargain'">
						<view class="iconfont icon-renshu"></view>{{item.total_num}}{{$t('lang.participation_number')}}
					</view>
					<view class="goods-label-suspension"
						v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
						<image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
					</view>
				</view>
				<view class="image-view" @click="detailLink(routerName,item.goods_id)" v-else>
					<image v-if="item.goods_thumb" class="uni-product-image" :src="item.goods_thumb"></image>
					<image v-else class="uni-product-image"
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
					</image>
					<view class="bargain-tag" v-if="routerName == 'bargain'">
						<view class="iconfont icon-renshu"></view>{{item.total_num}}{{$t('lang.participation_number')}}
					</view>
					<view class="goods-label-suspension"
						v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
						<image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
					</view>
				</view>
				<view class="uni-product-info">
					<view class="uni-product-title" @click="detailLink(routerName,item.id)"
						v-if="routerName == 'bargain'" style="line-height: 40upx;">{{item.goods_name}}</view>
					<view class="uni-product-title" @click="detailLink(routerName,item.goods_id)" v-else>
						<text class="tag" v-if="item.is_promote > 0">{{$t('lang.special_sale')}}</text>
						<text
							style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
							v-if="item.shop_grade==13">{{item.shop_grade_name}}</text>
						<view style="line-height: 40upx;">
							<image class="country_icon" :src="item.country_icon" :lazy-load="true"
								v-if="item.country_icon"></image>{{item.goods_name}}
						</view>
					</view>
					<view class="uni-product-price" v-if="routerName == 'bargain'">
						<view class="box"><text class="gay del">{{$t('lang.original_price')}}{{item.shop_price}}</text>
						</view>
						<view class="box">
							<text class="gay">{{$t('lang.base_price')}}</text>
							<text class="uni-product-price-original">{{item.target_price}}</text>
						</view>
					</view>
					<!-- <view class="uni-product-price" :class="{'uni-juc-center':productOuter}" v-else>
						<currency-price :price="item.shop_price"
							:delPrice="item.is_promote > 0 ? item.market_price : ''" :size="18"></currency-price>
					</view> -->
					<view style="display: flex;flex-direction: row;align-items: center;margin-top: -26rpx;"
						@click="linkHref(item.seckill_id,item.goods_id)">
						<currency-price :price="item.shop_price" :size="18"
							style="display: block; margin-top: 8px;"></currency-price>
						<view style="margin-top: 20rpx;margin-left: 20rpx;font-size: 22rpx;color: #f23030;" v-if="item.is_free==0">
							运费{{item.start_shipping_fee}}元
						</view>
					</view>
					<view style="margin-top: -10rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;">
						<!-- {{item.sales_volume}}人已购买 -->
						<text class="yishou color_999">{{$t('lang.goods_soltout')}} {{ item.sales_volume }} {{$t('lang.jian')}}</text>
					</view>
					<!-- <view
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
								style="height: 40rpx;width: 40rpx;border-radius: 10rpx;" mode="widthFix">
							</image>
						</view>
						<text v-if="item.add_year" style="color: #A2A2A2;">{{item.add_year}}</text>
						<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
						<text v-if="item.add_year" style="margin-left: 10rpx;margin-right: 10rpx;color: #A2A2A2;">|</text>
						<view
							style="display: flex;flex-direction: row;align-items: center;width: 80%;"
							@click="toShopHome(item)">
							<view class="shop_name_class">{{item.shop_name}}</view>
						</view>
						<view style="margin-top: 10rpx;width: 10%;margin-right: 20rpx;border-radius: 10rpx;"
							@click="onSku(item)" v-if="item.seckill_id==0">
							<image
								src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/original_img/2_P_1691018929484.png"
								style="height: 50rpx;width: 50rpx;"></image>
						</view>
					</view>
					<view class="outer" v-if="routerName == 'drp' && item.commission == 1">
						<view class="commission-tag mt10">
							<view class="num">{{item.dis_commission}}%</view>
							<view class="cont-tag">{{$t('lang.dis_commission')}}</view>
						</view>
					</view>
					<!-- <block v-if="!productOuter && routerName == 'goods'">
						<view class="outer outer-teshu">
							<block v-if="controlVersion">
								<text class="tag"
									v-if="(item.user_id > 0 && item.self_run == 1) || item.user_id == 0">{{$t('lang.self_support')}}</text>
								<text class="tag"
									@click="$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id,'app')"
									v-else>{{$t('lang.into_shop')}}</text>
							</block>
							<view class="label-list" v-if="item.goods_label && item.goods_label.length > 0">
								<view class="label-img" v-for="(label,labelIndex) in item.goods_label" :key="labelIndex"
									@click="$outerHref(label.label_url)">
									<image :src="label.formated_label_image" mode="heightFix"></image>
								</view>
							</view>
						</view>
						<view class="outer">
							<view class="left uni-ellipsis">
								<text class="sales-volume">{{ item.sales_volume }}{{$t('lang.a_have_purchased')}}</text>
							</view>
							<view class="add-cart" @click="detailLink(routerName,item.goods_id)">
								<text class="iconfont icon-cart"></text>
								<view class="add_num" :class="{'show':addCartClass == true && index == curIndex}">+1
								</view>
							</view>
						</view>
					</block> -->
				</view>
			</view>
		</view>
		<!-- 商品属性弹框 start -->
		<uni-popups ref="goodsattr" type="bottom">
			<view class="pop_content">
				<view class="goods_attr_pop">
					<image class="close_img" src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png" @click="closePop('goodsattr')"></image>
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
			</view>
		</uni-popups>
		<!-- 商品属性弹框 end -->
	</block>
	<block v-else>
		<dsc-not-content></dsc-not-content>
	</block>
		
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import universal from '@/common/mixins/universal.js';
	import goodsServiceLabel from '@/components/goods-service-label/goods-service-label.vue';
	export default {
		mixins: [universal],
		props: {
			mode: {
				type: String,
				default: 'grid'
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
			guessList: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				addCartClass: false,
				curIndex: null,
				list: [],
				
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
			};
		},
		components: {
			dscNotContent,
			uniPopups,
			goodsServiceLabel
		},
		onReady() {
		
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
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
		},
		onLoad() {
			this.list = uni.getStorageSync('goodslistTake')
			console.log(this.list)
		},
		onUnload() {
			// uni.removeStorageSync('goodslistTake')
		},
		methods: {
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
			onSku(item) {
				var that = this
				
				that.goodsAttr = item.attr ? item.attr : [];
				that.is_on_sale = item.is_alone_sale == 0 ? true : false
				that.is_alone_sale = item.is_alone_sale == 0 ? true : false
				that.attr = item.attr ? item.attr : [];
				// 起购数量
				if (item.minimum > 1) {
					that.goodsNum = item.minimum;
					that.minNum = item.minimum || 1;
				}else{
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
						title:'加载中~'
					})
					uni.request({
						url: 'https://www.ok9288.com/api/goods/get_goods_barc_code',
						method: 'POST',
						data: {
							"goods_attr_id":that.seleceGoodsAtrrArray,
							"goods_id":item.goods_id
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
								item.upc = res_1.data.data
							}
						}
					})
					that.$refs['goodsattr'].open();
				} else {
					that.onAddCartClicked(0)
				}
				setTimeout(function() {
					that.goodsDetail = item
				}, 500);
			},
			async onAddCartClicked() {
				var that = this
				var newAttr = []
				let wginfoStr = uni.getStorageSync('wgtinfo') != "" ? uni.getStorageSync('wgtinfo') : {};
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				let version = Number(wgtinfo.version.replace(/\./g, ''));
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
					app_version:version,
					cou_id: that.goodsDetail.best_price.cou_id > 0 ? that.goodsDetail.best_price.cou_id : 0
				}).then(res => {
					console.log(res)
					uni.hideLoading();
					if(res.data.error==1){
						uni.showToast({
							title:res.data.msg,
							icon: 'none',
							duration: 500
						});
						that.closePop('goodsattr');
						that.seleceGoodsAtrrArray = []
						return;
					}else{
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
			toShopHome: function(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
				})
			},
			linkHref(seckill_id,goods_id) {
				//如果是秒杀商品跳转到秒杀详情
				// if (seckill_id!=0) {
				// 	uni.navigateTo({
				// 		url: '/pagesA/seckill/detail/detail?id=' + seckill_id +
				// 			'&tomorrow=0&delta=2'
				// 	});
				// }else{
				// 	uni.navigateTo({
				// 		url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				// 	})
				// }
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
			addCart(id, index) {
				this.addCartClass = false
				this.curIndex = null
				this.$store.dispatch('setAddCart', {
					goods_id: id,
					num: 1,
					spec: [],
					warehouse_id: '0',
					area_id: '0',
					parent_id: '0'
				}).then(res => {
					if (res.data == true) {
						this.addCartClass = true
						this.curIndex = index
						uni.showToast({
							title: this.$t('lang.goods_been_add_cart'),
							icon: 'none'
						})
					}
				})
			},
			detailLink(routerName, id) {
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
						this.list.forEach(v => {
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
			}
		}
	}
</script>

<style lang="scss">
	/*product-list*/
	.uni-product-list {
		padding: 0 18upx;
		margin-top: 18upx;
		box-sizing: border-box;
		
	}
	 .uni-product {
		width: 48.5%;
	}

	.uni-product-list .uni-product-title {
		font-size: 28upx;
		height: 80upx;
	}

	.uni-product-list .uni-product-title .tag {
		background-color: #ff5256;
		color: #fff;
		padding: 0 10upx;
		margin-right: 10upx;
	}

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

	.product-list-medium .uni-product-info {
		width: auto;
		flex: 1 1 0%;
	}
	
	.label-line {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		font-size: 10px;
		transform:scale(0.8);
		margin-left: -40rpx;
		width: 120%;
		margin-top: -10rpx;
	}
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
	
	
	/* 优惠弹框 start */
	.pop_content {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
				// display: flex;
				// flex-direction: column;
				// justify-content: flex-end;
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
</style>