<template>
	<view>
		<view class="product-list" :class="aClass" v-if="module.isStyleSel == '0'">
			<view class="uni-product-list">
			
<!-- 				<view class="uni-product" v-for="(item,index) in prolist" :key="index">
					<view class="image-view" @click="linkHref(item.goods_id)">
						<image class="uni-product-image"
							:src="module.isSizeSel == '0' ? item.goods_img : item.goods_thumb" mode="widthFix"></image>
						<view class="goods-label-suspension"
							v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
							<image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
						</view>
					</view>
					<view class="uni-product-info">
						<view class="uni-product-title" @click="linkHref(item.goods_id)"
							@longpress="copyTitle(item.title,item.goods_name)">
							<text
								style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;"
								v-if="item.shop_grade==13">核心</text>{{item.title || item.goods_name}}
						</view>
					
						<view style="display: flex;flex-direction: row;align-items: center;margin-top: -26rpx;"
							@click="linkHref(item.seckill_id,item.goods_id)">
							<currency-price :price="item.shop_price" :size="18"
								style="display: block; margin-top: 8px;"></currency-price>
							<view style="margin-top: 20rpx;margin-left: 20rpx;font-size: 22rpx;color: #f23030;"
								v-if="item.is_free==0">
								运费{{item.start_shipping_fee}}元起
							</view>
						</view>
						<view style="margin-top: -10rpx;margin-left: 0rpx;font-size: 22rpx;color: #A2A2A2;">
						<text
								class="yishou color_999">{{$t('lang.goods_soltout')}} {{ item.sales_volume }}{{$t('lang.jian')}}</text>
						</view>
						
						<view class="label-box">
							<view v-for="(tag) in item.goods_services_label_new" :key="tag"  class="label-box-line">
								<view v-if="tag.value==0 && tag.name=='包邮'" class="zero-label">{{tag.name}}</view>
								<view v-if="tag.value==0 && tag.name=='一件包邮'" class="zero-tag">{{tag.name}}</view>
								<view v-if="tag.value==1" class="first-label">{{tag.name}}</view>
								<view v-if="tag.value== 2" class="second-label">{{tag.name}}</view>
								<view v-if="tag.value== 3" class="second-label">{{tag.name}}</view>
							</view>
						</view>
						<view
							style="display: flex;flex-direction: row;align-items: center;line-height: 40rpx;margin-top: -10rpx;margin-bottom: -20rpx;">
							<view style="margin-top: 10rpx;width: 10%;margin-right: 10rpx;border-radius: 10rpx;">
								<image :src="item.shop_avatar" style="height: 40rpx;width: 40rpx;border-radius: 10rpx;"
									mode="widthFix">
								</image>
							</view>
							<text v-if="item.add_year"
								style="color: #A2A2A2;margin-left: 10rpx;">{{item.add_year}}</text>
							<text v-if="item.add_year" style="color: #A2A2A2;">年</text>
							<text v-if="item.add_year" style="margin-left: 10rpx;color: #A2A2A2;">|</text>
							<view
								style="display: flex;flex-direction: row;align-items: center;width: 90%;margin-right: 10rpx;margin-left: 10rpx;"
								@click="toShopHome(item)">
								<view class="shop_name_class">{{item.shop_name}}</view>
							</view>
						</view>
					</view>
				</view> -->
			
			<dsc-product-list :list="prolist" :productOuter="true" :prolist="true"></dsc-product-list>
			<!-- <waterfall :value="prolist" :column="2" :columnSpace="1.5" :seat="2"
			 	@imageClick="linkHref">
			 	
			 </waterfall> -->
			 
			</view>
		
			
		</view>
		
		<scroll-view class="scroll-view scroll-view-product" scroll-x="true" scroll-left="0" v-else>
			<view class="scroll-view-item" v-for="(item,index) in prolist" :key="index"
				@click="linkHref(item.goods_id)">
				<image :src="item.goods_thumb" mode="widthFix"></image>
				<text class="name uni-ellipsis" v-if="bTitle">{{item.title || item.goods_name}}</text>
				<!-- <currency-price :price="item.shop_price"></currency-price> -->
				<view style="display: block; margin-top: 5px;">
					<text>￥</text>
					<text>{{item.shop_price}}</text>
				</view>
			</view>
		</scroll-view>

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
				</view>
			
				<view style="height: 110rpx;"></view>
			</view>
		</uni-popups>
		<!-- 商品属性弹框 end -->
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 1 && showLoadMore" />
	
	</view>
</template>

<script>
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	// import waterfall from '@/pagesD/components/waterfall.vue';
	import dscProductList from '@/components/dsc-product-list.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		props: ['module', 'preview', 'shopId', 'userId', 'prolist'],
		components: {
			uniPopups,
			// waterfall,
			dscProductList
		},
		data() {
			return {
				previewProlist: [{
						title: '第一张图片',
						sale: '0',
						stock: '0',
						price: '¥238.00',
						marketPrice: '¥413.00'
					},
					{
						title: '第二张图片',
						sale: '0',
						stock: '0',
						price: '¥38.00',
						marketPrice: '¥43.00'
					}
				],
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
				loadMoreStatus: 'loading',
				contentText: {
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: true,
			}
		},
		computed: {
			selectGoodsId() {
				return this.module.allValue.selectGoodsId || []
			},
			brandSelect() {
				return this.module.allValue.brandSelect
			},
			catId() {
				let arr = [],
					len = 0
				this.module.allValue.categorySOption ?
					(arr = this.module.allValue.categorySOption.split(',')) :
					(arr = [])
				len = arr.length
				return arr[len - 1]
			},
			bPreview() {
				return this.preview
			},
			bStock() {
				return this.module.tagSelList.indexOf('0') != -1 ? true : false
			},
			bSale() {
				return this.module.tagSelList.indexOf('1') != -1 ? true : false
			},
			bTitle() {
				return this.module.tagSelList.indexOf('2') != -1 ? true : false
			},
			nNumber() {
				return this.module.allValue.number
			},
			moduleSel() {
				let sModulesSel = this.module.isModuleSel
				let sReturn = ''
				switch (sModulesSel) {
					case '0':
						sReturn = 'best'
						break
					case '1':
						sReturn = 'new'
						break
					case '2':
						sReturn = 'hot'
						break
					case '3':
						sReturn = ''
						break
					default:
						sReturn = ''
						break
				}
				return sReturn
			},
			aClass() {
				let sSizeSel = this.module.isSizeSel,
					arr = []
				if (this.preview) arr.push('preview')
				switch (sSizeSel) {
					case '0':
						arr.push('product-list-big')
						break
					case '2':
						arr.push('product-list-medium')
						break
					default:
						break
				}
				return arr
			},
			// newUserId() {
			// 	return this.userId
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
		mounted() {
			// var that = this
			// setTimeout(function() {
			// 	// this.onProduct();
			// 	that.onProduct();
			// }, 500);
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
			that.$set(that.popHeight, 'hd', parseInt(windowHeight * 0.65));
			that.$set(that.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			that.$set(that.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
			// setTimeout(function() {
			// 	that.onProduct();
			// }, 200);
		},

		methods: {
			copyTitle(title, goods_name) {
				var that = this
				var text = title || goods_name
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
			// toShopHome: function(item) {
			// 	console.log(item)
			// 	uni.navigateTo({
			// 		url: '/pagesD/shop/shopHome/shopHome?ru_id=' + item.user_id
			// 	})
			// },
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

				// uni.showToast({
				// 	title: that.$t('lang.added_to_cart'),
				// 	icon: 'success',
				// 	duration: 500
				// });

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
				const {
					data,
					status
				} = await that.$store.dispatch('setGoodsAttrOperById', {
					goods_id: that.goodsDetail.goods_id,
					num: that.goodsNum,
					attr_id: that.seleceGoodsAtrrArray
				});
				if (status != 'success') return that.showToast();
				// that.selectAttr = data.attr_name;
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

				if (res == 'goodsattr') {
					this.storeBtn = false;
				}
			},
			goodsAloneSale() {
				uni.navigateTo({
					url: `/pagesD/goodslist/goodslist?id=${this.goodsDetail.cat_id}`
				})
			},

			onProduct() {
				if (this.selectGoodsId.length > 0) {
					console.log(this.selectGoodsId.length)
					console.log(this.selectGoodsId.toString())
					uni.request({
						url: this.websiteUrl + '/api/visual/checked',
						method: 'POST',
						data: {
							number: this.selectGoodsId.length,
							goods_id: this.selectGoodsId.toString()
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							console.log(res.data)
							if (res.data.data.length < 10) {
								this.loadMoreStatus = 'noMore'
							} else {
								this.loadMoreStatus = 'loading'
							}
							if (this.page > 1) {
								this.prolist = this.prolist.concat(res.data.data)
							} else {
								this.prolist = res.data.data
							}
						},
						fail: (err) => {
							console.error(err)
						}
					})
				} else {
					uni.request({
						url: this.websiteUrl + '/api/visual/product',
						method: 'POST',
						data: {
							number: this.nNumber < 1 ? 1 : this.nNumber,
							type: this.moduleSel,
							ru_id: this.shopId,
							cat_id: this.catId,
							brand_id: this.brandSelect
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data.data
							data && data.length > 0 ? (this.prolist = data) : (this.prolist = [])
							if (data.length < 10) {
								this.loadMoreStatus = 'noMore'
							} else {
								this.loadMoreStatus = 'loading'
							}
						},
						fail: (err) => {
							console.error(err)
						}
					})
				}
			},
			linkHref(seckill_id,goods_id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			}
		},
		// watch: {
		// 	newUserId() {
		// 		this.onProduct();
		// 	}
		// }
	}
</script>

<style scoped lang="scss">
	.image-view {
		position: relative;
	}

	.product-list {
		// padding: 0 18upx 18upx 18upx !important;
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
		font-size: 25upx;
		color: #999;
	}

	.product-list-big .uni-product-list {
		flex-direction: column;
	}

	.product-list-big .uni-product-list .image-view,
	.product-list-big .uni-product-list .uni-product-info {
		width: 100%;
		height: auto;
		position: relative;
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

	.product-list-medium .uni-product .uni-product-info {
		width: auto;
		flex: 1 1 0%;
	}


	.uni-product-title {
		height: 36px;
		line-height: 18px;
	}

	.product-list .label-list {
		overflow: hidden;
		margin-top: 10upx;
	}

	.product-list .label-list .label-img {
		height: 16px;
		margin: 0 10upx 0 0;
	}

	.product-list .label-list .label-img:last-child {
		margin-right: 0;
	}

	.uni-product-list .uni-product-title {
		font-size: 28upx;
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
</style>