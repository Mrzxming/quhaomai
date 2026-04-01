<template>
	<view class="waterfall-container">
		<block v-if="list.length > 0 || loadMoreStatus == 'loading'">
			<view class="column" :style="{ width: (100 / columnCount) + '%' }" v-for="(column, colIndex) in columns"
				:key="colIndex">
				<view class="uni-product" v-for="(item, index) in column" :key="index" style="position: relative;">
					<view class="image-view">
						
						<!-- <image v-if="item.goods_img" class="uni-product-image" :src="item.goods_img"
							@click="detailLink(item.goods_id)"></image> -->
							 <image 
								@click="detailLink(item.goods_id)"
								v-if="item.goods_img"
							    :src="getOptimizedImage(item.goods_img)" 
							    mode="aspectFill"
							    class="uni-product-image"
							  ></image>
						<image v-else class="uni-product-image" @click="detailLink(item.goods_id)"
							src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973846451.jpg">
						</image>
						<view class="goods-label-suspension"
							v-if="item.goods_label_suspension && item.goods_label_suspension.formated_label_image">
							<image :src="item.goods_label_suspension.formated_label_image" class="img"></image>
						</view>
						<view class="checkbox" :class="{'checked':item.checked,'checkbox-disabled':item.checked}"
							@click="checkGoods(index,item.goods_id)">
							<view class="checkbox-icon">
								<uni-icons type="checkmarkempty" size="18" color="#ffffff"></uni-icons>
							</view>
						</view>
					</view>
					<view class="uni-product-info" @click="detailLink(item.goods_id)">
						<view class="fs28 onelist-hidden" @longpress="copyTitle(item.goods_name)">{{item.goods_name}}
						</view>
						<view class="fs24 cored " v-if="item.cou_name && item.cou_name.length > 0">{{item.cou_name[0]}}
						</view>
						<view class="fs24 cored " v-else-if="item.integral && item.integral > 0">积分可抵{{item.integral}}%
						</view>
						<view class="uni-product-price"
							style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
							<currency-prices :price="item.shop_price"
								:delPrice="item.is_promote > 0 ? item.market_price : ''" :size="18"></currency-prices>
							<view class="fs24 cored " style="margin-right: 40rpx;"  v-if="item.dis_commission_price">佣金{{item.dis_commission_price}}元</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			
			<dsc-not-content></dsc-not-content>
		</block>
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	import universal from '@/common/mixins/universal.js';

	export default {
		mixins: [universal],
		props: {
			list: {
				type: Array,
				default: []
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
			guessList: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				addprints: [],
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
				columnCount: 2, // 瀑布流列数
				columns: []
			};
		},

		components: {
			dscNotContent,
		},

		watch: {
			list: {
				immediate: true,
				handler(newVal, oldVal) {
					this.initWaterfall();
					this.addprints = this.list.filter(item => item.checked);
				}
			}
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
					];
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					});
				}
			});
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
		},

		methods: {
			getOptimizedImage(originalUrl) {
			  const baseUrl = originalUrl.split('?')[0];
			  return `${baseUrl}?x-oss-process=image/resize,m_lfit,w_180,h_180/format,webp`;
			},
			
			initWaterfall() {
				this.columns = Array.from({
					length: this.columnCount
				}, () => []);
				const heights = Array(this.columnCount).fill(0);

				this.list.forEach(item => {
					const minHeightIndex = heights.indexOf(Math.min(...heights));
					this.columns[minHeightIndex].push(item);
					heights[minHeightIndex] += 200;
				});
			},

			clearCheckedByIds(goodsId) {
				this.list.forEach(item => {
					if (item.goods_id == goodsId) {
						item.checked = false;
					}
				});
				this.addprints = this.addprints.filter(item => item.goods_id !== goodsId);
				this.list_all_checked = this.list.every(item => item.checked);
			},

			clearChecked() {
				this.list.forEach(item => {
					item.checked = false;
				});
				this.addprints = [];
				this.list_all_checked = false;
			},

			checkGoods(index, id) {
				const item = this.list.find(i => i.goods_id === id);
				const wasChecked = item.checked;
				item.checked = !wasChecked;
				if (item.checked) {
					if (!this.addprints.some(i => i.goods_id === item.goods_id)) {
						this.addprints.push(item);
					}
				} else {
					this.addprints = this.addprints.filter(i => i.goods_id !== item.goods_id);
				}
				const allChecked = this.list.every(i => i.checked);
				this.list_all_checked = allChecked;
				this.addprints = [...new Set(this.addprints.map(i => i.goods_id))].map(id => this.list.find(i => i
					.goods_id === id));
				const deselected = wasChecked && !item.checked ? [item] : [];

				this.sendSelectedInfo(this.addprints, deselected);
			},

			sendSelectedInfo(selectedInfo, deselectedInfo) {
				selectedInfo = selectedInfo.map(item => ({
					goods_id: item.goods_id,
					img: item.goods_img,
					name: item.goods_name,
					checked: item.checked,
				}));

				deselectedInfo = deselectedInfo.map(item => ({
					goods_id: item.goods_id,
					img: item.goods_img,
					name: item.goods_name,
					checked: item.checked,
				}));

				const combinedInfo = {
					selected: selectedInfo,
					deselected: deselectedInfo
				};

				this.$emit('checkGoods', combinedInfo);
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

			//商品详情
			detailLink(id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "/common/css/common.css";

	.waterfall-container {
		display: flex;
		flex-wrap: wrap;
	}

	.column {
		box-sizing: border-box;
		padding: 5px;
	}

	.IpxBot {
		position: fixed;
		bottom: 160rpx;
		left: 0;
		width: 92%;
	}

	.IpxBots {
		position: fixed;
		bottom: 106rpx;
		left: 0;
		width: 92%;
	}

	.uni-product {
		background-color: #ffffff;
		margin-bottom: 10px;
	}

	.image-view {
		width: 100%;
		height: 170px;
		min-width: 80px;
		position: relative;
		background-color: #f7f7f7;
		border-radius: 10px;
	}

	.checkbox {
		margin-right: 0px;
		position: absolute;
		top: 5%;
		right: 0%;

		.checkbox-icon {
			width: 20px;
			height: 20px;

			.uni-icon {
				display: block;
			}
		}
	}
</style>
