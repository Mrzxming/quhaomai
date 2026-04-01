<template>
	<view class="waterfalls-flow">
		<view v-for="(item, index) in data.column" :key="index" class="waterfalls-flow-column"
			:id="`waterfalls_flow_column_${index + 1}`" :msg="msg"
			:style="{ 'width': w, 'margin-left': index == 0 ? 0 : m }">
			<view v-for="(item2, index2) in columnValue(index)" :key="index2"
				:class="['column-value', { 'column-value-show': item2.o }]" :style="[s1]"
				@click.stop="wapperClick(item2)">
				<view class="inner" v-if="data.seat == 1">
					<slot name="default" :item="item2">
					</slot>
				</view>
				<view class="img-box">
					<image :class="[
                            'img',
                            { 'img-hide': item2[hideImageKey] == true || item2[hideImageKey] == 1 },
                            { 'img-error': !item2[data.imageKey] }
                        ]" :src="item2[data.imageKey]" mode="widthFix" @load="imgLoad(item2, index + 1)"
						@error="imgError(item2, index + 1)" @click="imageClick(item2)"></image>
					<view class="goods-label-suspension"
						v-if="item2.goods_label_suspension && item2.goods_label_suspension.formated_label_image">
						<image :src="item2.goods_label_suspension.formated_label_image" class="img">
						</image>
					</view>
				</view>
				<view class="inner" v-if="data.seat == 2">
					<slot name="default" :item="item2">
					</slot>
				</view>
				<view class="info-box">
					<view class="goods-name twolist-hidden" @click="linkHref(item2.seckill_id,item2.goods_id)">
						<image class="country_icon" :src="item2.country_icon" v-if="item2.country_icon">
						</image>
						<!-- 热榜 -->
						<view v-if="item2.cat_rank_info" class="top-one" style="display: inline-flex; margin-right: 16rpx; vertical-align: bottom;">
							<view class="top-text">
								<image src="/pagesC/static/fly_left@2x.png"></image>
								<text>TOP{{item2.cat_rank_info_cat_top}}</text>
								<image class="fly-right" src="/pagesC/static/fly_left@2x.png"></image>
							</view>
						</view>
						<!-- 好卖严选 -->
						<text class="easy_choose" v-else-if="item2.is_best ==1">{{$t('lang.easy_choose')}}</text>
						<!-- 新品 -->
						<text class="is-new-goods" v-else-if="item2.is_new ==1">{{$t('lang.new')}}</text>
						{{item2.title || item2.goods_name}}
					</view>
					<!-- 商品名称下面的优惠券 > 首单减N元 > 全网低价 > 热榜 显示 -->
					<view class="promo-tags-container">
						<!-- 优惠券 -->
						<view v-if="item2.cou_name && item2.cou_name.length > 0"
							style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_FBDE6F91F8B9A667E5327B5C0FC27592.png" 
								style="width: 28rpx; height: 24rpx; margin-right: 4rpx;"></image>
							{{item2.cou_name[0]}}
						</view>
						<!-- 首单减N元 -->
						<view v-if="item2.first_j_price && item2.first_j_price !== ''"
							style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260129_F6BCAA4FC4924C50925210754F44183A.png" 
								style="width: 22rpx; height: 24rpx; margin-right: 4rpx;"></image>
							{{item2.first_j_price}}
						</view>
						<!-- 全网低价 -->
						<view v-if="item2.platm_min_price && item2.platm_min_price !== ''"
							style="display: inline-flex; align-items: center; font-weight: 400;font-size: 12px;color: #FE2F02;">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260130_EAA591B0B9E61CCE6678AE8DAA41143D.png" 
								style="width: 18rpx; height: 24rpx; margin-right: 4rpx;"></image>
							{{item2.platm_min_price}}
						</view>
					</view>

					<!-- 价格 运费 总件数 -->
					<view class="uni-product-price"
						style="display: flex;flex-direction: row;align-items: baseline;margin-top: -10rpx;">

						<currency-price :price="item2.shop_price"
							:delPrice="item2.is_promote > 0 ? item2.market_price : ''" :size="24"></currency-price>


						<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #FE2F02;"
							v-if="item2.new_member_price == 1">
							新人价
						</view>
						<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #4D4B4B;"
							v-else-if="item2.is_membership_card_discount_price">
							{{item2.is_membership_card_discount_price}}
						</view>
						<view style="margin-top: 10rpx;margin-left: 12rpx;font-size: 20rpx;color: #A2A2A2;"
							v-else-if="item2.is_free == 0 ">
							运费{{item2.start_shipping_fee}}元
						</view>

					</view>
					<view style="font-size: 22rpx;color: #A2A2A2;text-align: left;margin-bottom: 16rpx;">

						<text class="yishou color_999">
							已售{{ item2.sales_volume }}{{$t('lang.jian')}}
						</text>
					</view>



	<!-- 标签 -->
				<goods-service-label :tags="item.goods_services_label_new" :max-display="3"
																							v-if="item.goods_services_label_new && item.goods_services_label_new.length > 0" />
											
				
					<view class="shop-name-column">
					        <view style="display: flex;flex-direction: row;align-items: center;width: 100%;" @click="toShopHome(item2)" v-if="item2.seckill_id==0">
					            <!-- 按照优先级调整标签显示顺序 -->
					            <text :class="['text-label',item2.shop_grade==13? 'label-margin':'']" v-if="item2.shop_grade==13">{{item2.shop_grade_name}}</text>
					            <text :class="['text-label',item2.is_buy_shop ==1? 'label-margin':'']" v-else-if="item2.is_buy_shop ==1">买过的店</text>
					            <text :class="['text-label',item2.onkey_send ==1? 'label-margin':'']" v-else-if="item2.onkey_send ==1">一件代发</text>
					            <view class="shop_name_class">{{item2.shop_name}}</view>
					        </view>
					        <view style="display: flex;flex-direction: row;align-items: center;width: 100%;" @click="toShopHome(item2)" v-else>
					            <!-- 按照优先级调整标签显示顺序 -->
					            <text :class="['text-label',item2.shop_grade==13? 'label-margin':'']" v-if="item2.shop_grade==13">{{item2.shop_grade_name}}</text>
					            <text :class="['text-label',item2.is_buy_shop ==1? 'label-margin':'']" v-else-if="item2.is_buy_shop ==1">买过的店</text>
					            <text :class="['text-label',item2.onkey_send ==1? 'label-margin':'']" v-else-if="item2.onkey_send ==1">一件代发</text>
					            <view class="shop_name_class">{{item2.shop_name}}</view>
					        </view>
					    </view>
					<view class="label-list" v-if="item2.goods_label && item2.goods_label.length > 0">
						<view class="label-img" v-for="(label,labelIndex) in item2.goods_label" :key="labelIndex"
							@click="$outerHref(label.label_url)">
							<image :src="label.formated_label_image" mode="heightFix">
							</image>
						</view>
					</view>
				</view>


			</view>
		</view>
	</view>
</template>
<script>
	// components/visualization/count-down/Frontend.vue
	import goodsServiceLabel from '@/components/goods-service-label/goods-service-label.vue'
	// import itemInfo from './itemInfo.vue'
	export default {
		// components: {
		//     itemInfo
		// },
		props: {
			value: Array,
			column: { // 列的数量 
				type: [String, Number],
				default: 2
			},
			maxColumn: { // 最大列数 
				type: [String, Number],
				default: 5
			},
			columnSpace: { // 列之间的间距 百分比
				type: [String, Number],
				default: 2
			},
			imageKey: { // 图片key
				type: [String],
				default: 'goods_thumb'
			},
			hideImageKey: { // 隐藏图片key
				type: [String],
				default: 'hide'
			},
			seat: { // 文本的位置，1图片之上 2图片之下
				type: [String, Number],
				default: 2
			},
			listStyle: { // 单个展示项的样式：eg:{'background':'red'}
				type: Object
			}
		},
		data() {
			return {
				// goods_services_label_new: [{
				// 		value: 0,
				// 		name: '假一赔十'
				// 	},
				// 	{
				// 		value: 2,
				// 		name: '包邮'
				// 	},
				// 	{
				// 		value: 3,
				// 		name: '退货包运费'
				// 	},
				// 	{
				// 		value: 1,
				// 		name: '7天无理由'
				// 	},
				// ],
				data: {
					list: this.value ? this.value : [],
					column: this.column < 2 ? 2 : this.column,
					columnSpace: this.columnSpace <= 5 ? this.columnSpace : 5,
					imageKey: this.imageKey,
					seat: this.seat
				},
				msg: 0,
				listInitStyle: {
					'border-radius': '12rpx',
					'margin-bottom': '20rpx',
					'background-color': '#fff'
				},
				adds: [], //预置数据
				isLoaded: true,
				curIndex: 0,
				isRefresh: true,
				flag: false,
				refreshDatas: []
			}
		},
		components: {
			goodsServiceLabel
		},
		computed: {
			// 计算列宽
			w() {
				const column_rate = `${100 / this.data.column - (+this.data.columnSpace)}%`;
				return column_rate;
			},
			// 计算margin
			m() {
				const column_margin =
					`${(100 - (100 / this.data.column - (+this.data.columnSpace)).toFixed(5) * this.data.column) / (this.data.column - 1)}%`;
				return column_margin;
			},
			// list样式
			s1() {
				return {
					...this.listInitStyle,
					...this.listStyle
				};
			}
		},
		created() {
			// 初始化
			this.refresh();
		},
		methods: {
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
			// 预加载图片
			loadImages(idx = 0) {
				let count = 0;
				const newList = this.data.list.filter((item, index) => index >= idx);
				for (let i = 0; i < newList.length; i++) {
					// #ifndef APP-PLUS
					uni.getImageInfo({
						src: `${newList[i][this.imageKey]}.jpg`,
						complete: res => {
							count++;
							if (count == newList.length) this.initValue(idx);
						}
					})
					// #endif
					// #ifdef APP-PLUS
					plus.io.getImageInfo({
						src: `${newList[i][this.imageKey]}.jpg`,
						complete: res => {
							count++;
							if (count == newList.length) this.initValue(idx);
						}
					})
					// #endif
				}
			},
			// 刷新
			refresh() {

				if (!this.isLoaded) {
					this.refreshDatas = this.value;
					return false;
				};
				setTimeout(() => {
					this.refreshDatas = [];
					this.isRefresh = true;
					this.adds = [];
					this.data.list = this.value ? this.value : [];
					this.data.column = this.column < 2 ? 2 : this.column >= this.maxColumn ? this.maxColumn : this
						.column;
					this.data.columnSpace = this.columnSpace <= 5 ? this.columnSpace : 5;
					this.data.imageKey = this.imageKey;
					this.data.seat = this.seat;
					this.curIndex = 0;
					// 每列的数据初始化
					for (let i = 1; i <= this.data.column; i++) {
						this.data[`column_${i}_values`] = [];
						this.msg++;
					}
					this.$nextTick(() => {
						this.initValue(this.curIndex, 'refresh==>');
					})
				}, 1)
			},
			columnValue(index) {
				return this.data[`column_${index + 1}_values`];
			},
			change(newValue) {
				console.log(newValue)
				// for (let i = 0; i < this.data.list.length; i++) {
				// 	const cv = this.data[`column_${this.data.list[i].column}_values`];
				// 	for (let j = 0; j < cv.length; j++) {
				// 		if (newValue[i] && i === cv[j].index) {
				// 			this.data[`column_${this.data.list[i].column}_values`][j] = Object.assign(cv[j], newValue[i]);
				// 			this.msg++;
				// 			break;
				// 		}
				// 	}
				// }
			},
			getMin(a, s) {
				let m = a[0][s];
				let mo = a[0];
				for (var i = a.length - 1; i >= 0; i--) {
					if (a[i][s] < m) {
						m = a[i][s];
					}
				}
				mo = a.filter(i => i[s] == m);
				return mo[0];
			},
			// 计算每列的高度
			getMinColumnHeight() {
				return new Promise(resolve => {
					const heightArr = [];
					for (let i = 1; i <= this.data.column; i++) {
						const query = uni.createSelectorQuery().in(this);
						query.select(`#waterfalls_flow_column_${i}`).boundingClientRect(data => {
							heightArr.push({
								column: i,
								height: data.height
							});
						}).exec(() => {
							if (this.data.column <= heightArr.length) {
								resolve(this.getMin(heightArr, 'height'));
							}
						});
					}
				})
			},
			async initValue(i, from) {
				this.isLoaded = false;
				if (i >= this.data.list.length || this.refreshDatas.length) {
					this.msg++;
					this.loaded();
					return false;
				}
				const minHeightRes = await this.getMinColumnHeight();
				const c = this.data[`column_${minHeightRes.column}_values`];
				this.data.list[i].column = minHeightRes.column;
				c.push({
					...this.data.list[i],
					cIndex: c.length,
					index: i,
					o: 0
				});
				this.msg++;
			},
			// 图片加载完成
			imgLoad(item, c) {
				const i = item.index;
				item.o = 1;
				this.$set(this.data[`column_${c}_values`], item.cIndex, JSON.parse(JSON.stringify(item)));
				this.initValue(i + 1);
			},
			// 图片加载失败
			imgError(item, c) {
				const i = item.index;
				item.o = 1;
				item[this.data.imageKey] = null;
				this.$set(this.data[`column_${c}_values`], item.cIndex, JSON.parse(JSON.stringify(item)));
				this.initValue(i + 1);
			},
			// 渲染结束
			loaded() {
				if (this.refreshDatas.length) {
					this.isLoaded = true;
					this.refresh();
					return false;
				}
				this.curIndex = this.data.list.length;
				if (this.adds.length) {
					this.data.list = this.adds[0];
					this.adds.splice(0, 1);
					this.initValue(this.curIndex);
				} else {
					if (this.data.list.length) this.$emit('loaded');
					this.isLoaded = true;
					this.isRefresh = false;
				}
			},
			// 单项点击事件
			wapperClick(item) {
				this.$emit('wapperClick', item);
			},
			// 图片点击事件
			imageClick(item) {
			console.log(item)
				this.$emit('imageClick', item.seckill_id, item.goods_id);
			}
		},
		watch: {
			value: {
				handler(newValue, oldValue) {
					console.log('value---newValue', newValue);
					setTimeout(() => {
						this.$nextTick(() => {
							if (this.isRefresh) return false;
							if (this.isLoaded) {
								// if (newValue.length <= this.curIndex) return this.refresh();
								if (newValue.length <= this.curIndex) return this.change(newValue);
								this.data.list = newValue;
								this.$nextTick(() => {
									this.initValue(this.curIndex, 'watch==>');
								})
							} else {
								this.adds.push(newValue);
							}
						})
					}, 10)
				}
			},
			column(newValue) {
				this.refresh();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.waterfalls-flow {
		overflow: hidden;
		width: 100%;

		&-column {
			float: left;
		}
	}

	.column-value {
		width: 100%;
		font-size: 0;
		overflow: hidden;
		transition: opacity .4s;
		opacity: 0;

		&-show {
			opacity: 1;
		}

		.inner {
			font-size: 30rpx;
		}

		.img-box {
			line-height: 0;
			min-height: 360rpx;
			position: relative;
			width: 100%;

			.img {
				border-radius: 16upx;
				width: 100%;
			}

			&-hide {
				display: none;
			}

			&-error {
				background: #f2f2f2 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiAQMAAAAatXkPAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAAIZJREFUCNdlzjEKwkAUBNAfEGyCuYBkLyLuxRYW2SKlV1JSeA2tUiZg4YrLjv9PGsHqNTPMSAQuyAJgRDHSyvBPwtZoSJXakeJI9iuRLGDygdl6V0yKDtyMAeMPZySj8yfD+UapvRPj2JOwkyAooSV5IwdDjPdCPspe8LyTl9IKJvDETKKRv6vnlUasgg0fAAAAAElFTkSuQmCC) no-repeat center center;
			}
		}

		// .img {
		//     width: 100%;

		//     &-hide {
		//         display: none;
		//     }

		//     &-error {
		//         background: #f2f2f2 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiAQMAAAAatXkPAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAAIZJREFUCNdlzjEKwkAUBNAfEGyCuYBkLyLuxRYW2SKlV1JSeA2tUiZg4YrLjv9PGsHqNTPMSAQuyAJgRDHSyvBPwtZoSJXakeJI9iuRLGDygdl6V0yKDtyMAeMPZySj8yfD+UapvRPj2JOwkyAooSV5IwdDjPdCPspe8LyTl9IKJvDETKKRv6vnlUasgg0fAAAAAElFTkSuQmCC) no-repeat center center;
		//     }
		// }


		.info-box {
			padding: 20rpx 20rpx 0rpx 20rpx;
			.shop-name-column {
				display: flex;
				flex-direction: row;
				align-items: center;
				line-height: 40rpx;
				margin-top: -10rpx;
				width: 100%;
				.text-label {
					color: rgb(254, 3, 2);
					 border-radius: 5px;
					 font-size: 11px;
					 // margin-right: 5px;
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
				    margin-bottom: 8px;
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

			.num-line {
				display: flex;
				justify-items: center;
				align-items: flex-end;
				margin-bottom: 7px;

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

		.top-one {
			display: flex;
			font-weight: 400;
			font-size: 24rpx;
			color: #DCAB6C;
			align-items: center;

			.top-name {
				margin-right: 16rpx;
			}

			image {
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
		}

		.promo-tags-container > view {
			display: inline-flex;
			flex-shrink: 0;
			margin-right: 8rpx;
		}

	}


	}
</style>