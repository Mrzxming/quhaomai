<template>
	<view class="currency-price" v-if="priceConfig">
		<skeleton selector="skeleton" bgcolor="#FFF" v-if="showSkeleton"></skeleton>
		<slot></slot>
		<view class="currency-price-warp skeleton" :style="[priceSize, colorStyle, delStyle, customStyle]">
			<text class="em skeleton-radius" v-if="priceConfig.is_show_currency_format > 0 && price"
				:style="[currencySize,currencyStyle]">{{ priceConfig.currency_format }}</text>
			<block v-if="price">
				<text v-if="priceStyleConfig == 3">
					<text style="skeleton-radius">{{priceFormat.price_format_zhu}}.</text>
					<text style="skeleton-radius" :style="[currencySize]">{{ priceFormat.price_format_ci }}</text>
				</text>
				<text v-else style="skeleton-radius">{{ priceFormat }}</text>
			</block>
			<text v-else style="skeleton-radius">?</text>
		</view>
		<view class="del skeleton" v-if="delPrice" :style="[delPriceStyle]">
			<text class="em skeleton-radius" v-if="priceConfig.is_show_currency_format > 0">{{ priceConfig.currency_format }}</text>
			<text style="skeleton-radius">{{ delPrice }}</text>
		</view>
	</view>
</template>

<script>
	/**
	 * #price:价格参数不带格式化价格(字符串/数字)
	 * #color:价格颜色默认红色(字符串)
	 * #size:价格字体大小(数字),currency(￥)为字体size的70%
	 * #del:价格是否划横线(text-decoration:line-through)
	 * #style:价格自定义样式
	 * #currencyStyle:currency(￥)自定义样式
	 * #
	 */
	import skeleton from '@/components/skeleton/skeleton.vue'
	export default {
		components:{
			skeleton
		},
		name: 'currency-price',
		props: {
			price: {
				type: [Number, String],
				default: 0
			},
			color: {
				type: String,
				default: '#F20E28'
			},
			size: {
				type: Number,
				default: 15
			},
			del: {
				type: Boolean,
				default: false
			},
			delPrice: {
				type: [Number, String],
				default: 0
			},
			delColor: {
				type: String,
				default: '#999'
			},
			delSize: {
				type: Number,
				default: 12
			},
			customStyle: {
				type: String,
				default: ''
			},
			currencyStyle: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
			    localPrice: this.price, // 中转
			    showSkeleton: true
			}
		},
		watch: {
		  price(newVal) { // 监听 prop 变化，更新本地值
		    this.localPrice = newVal;
		  }
		},
		computed: {
			priceConfig() {
				let data = uni.getStorageSync('configData');
				let object = {
					is_show_currency_format: data.is_show_currency_format ? data.is_show_currency_format : 1,
					currency_format: data.currency_format ? data.currency_format : '¥',
					price_format: data.price_format ? data.price_format : 0,
					price_style: data.price_style ? data.price_style : 0
				}
				this.showSkeleton = false
				return object
			},
			priceClass() {
				return 'currency-price-' + this.priceConfig.price_style
			},
			priceStyleConfig() {
				return this.priceConfig.price_style
			},
			priceFormat() {
			    const originalPrice = this.price
		
			    let price, arr = []
			    
			    switch (parseInt(this.priceConfig.price_style)) {
			        case 1:
			            price = originalPrice
			            break
			        case 2:
			            price = originalPrice
			            break
			        case 3:
			            if (originalPrice !== null) { 
			                const processedPrice = originalPrice.toString().includes('.') 
			                    ? originalPrice 
			                    : Number(originalPrice).toFixed(2)
			                arr = processedPrice.toString().split('.')
			                price = {
			                    price_format_zhu: arr[0],
			                    price_format_ci: arr[1]
			                }
			            } else {
			                price = originalPrice
			            }
			            break
			        case 4:
			            price = originalPrice
			            break
			        default:
			            price = originalPrice
			    }
			    return price
			},
			priceSize() {
				return {
					"font-size": this.size + "px",
					"font-weight": this.priceConfig.price_style == 1 ? "500" : "700"
				}
			},
			currencySize() {
				if (this.priceConfig.price_style == 1 || this.priceConfig.price_style == 2) return false
				return {
					"font-size": this.size * .7 + "px"
				}
			},
			delPriceStyle() {
				return {
					"font-size": this.delSize + "px",
					"color": this.delColor
				}
			},
			colorStyle() {
				return {
					color: this.color
				}
			},
			delStyle() {
				if (!this.del) return
				return {
					"text-decoration": "line-through",
					"color": "#888",
					"font-size": this.size * .7 + 'px',
					"font-weight": "normal"
				}
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	.currency-price {
		line-height: normal;
	}

	.currency-price .em {
		margin-right: 1px;
		font-weight: normal;
	}

	.currency-price-warp {
		display: inline-block;
		line-height: normal;
	}

	.currency-price .del {
		vertical-align: text-bottom;
		margin: 0 0 0 8px;
		line-height: normal;
		text-decoration: line-through;
		display: inline-block;
	}
</style>
