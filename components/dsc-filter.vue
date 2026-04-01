<template>
	<view class="filter-tab">
		<view class="filter-items">
			<view class="item" :class="{'active':filter.sort === 'goods_id'}" @click="handleFilter('goods_id',filter.order)">
				<text class="txt">{{$t('lang.comprehensive')}}</text>
				<text class="iconfont" :class="[(filter.order === 'asc' && filter.sort === 'goods_id') ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
			</view>
			<view class="item" :class="{'active':filter.sort === 'sales_volume' }" @click="handleFilter('sales_volume')">
				<text class="txt">{{$t('lang.sales_volume')}}</text>
			</view>
			<!-- <view class="item" :class="{'active':filter.sort === 'last_update'}" @click="handleFilter('last_update')" v-if="filterStyle !='coudan'">
				<text class="txt">{{$t('lang.new')}}</text>
			</view> -->
			<view class="item" :class="{'easy_choose_active':filter.sort === 'is_best' }" @click="handleFilter('is_best')" v-if="filterStyle !='coudan'">
				<text class="txt">{{$t('lang.easy_choose')}}</text>
			</view>
			<view class="item" :class="{'active':filter.sort === 'shop_price'}" @click="handleFilter('shop_price',filter.order)">
				<text class="txt">{{$t('lang.price')}}</text>
				<text class="iconfont" :class="[(filter.order === 'asc' && filter.sort === 'shop_price') ? 'icon-arrow-up' : 'icon-arrow-down']"></text>
			</view>
			<view class="item" v-if="filterStyle != 'coudan'" @click="handelFilterUp">
				<text class="iconfont icon-filter"></text>
				<text class="txt">{{$t('lang.filter')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			filter:{
				type:Object,
				default:''
			},
			isPopupVisible:{
				type:Boolean,
				default:true
			},
			filterStyle:{
				type:String,
				default:'goods'
			},
			 initialActive: { 
			      type: String,
			      default: ''
			    }
		},
		data(){
			return{
				myMode: this.filter.mode
			}
		},
		 mounted() {
		    // 初始化时设置选中状态
		    if (this.initialActive) {
		     this.filter.sort = this.initialActive;
		    }
		  },
		methods:{
			handleFilter(val,order){
				if(order && this.filter.sort == val){
					this.filter.order = order == 'desc' ? 'asc' : 'desc'
				}
				this.filter.sort = val;
				
				console.log(this.filter.order)
				console.log(this.filter.sort)
				this.$emit('getFilter',{
					sort : this.filter.sort,
					order: this.filter.order,
				})
			},
			handelFilterUp(){
				let val = this.isPopupVisible == false ? true : false;
				this.$emit('setPopupVisible',val);
			}
		}
	}
</script>

<style>
	/*filter*/
	.filter-tab{ background: #FFFFFF;}
	.filter-items{ display: flex; align-items: center;flex-direction: row; height: 80upx;}
	.filter-items .item{
		display: flex; flex: 1 1 0%; justify-content: center; align-items: center;
		font-weight: 400;
		font-size: 32rpx;
		color: #626262;
		}
	.filter-items .item .iconfont{ font-size: 20upx; margin-left: 5upx;}
	.filter-items .item .icon-filter{ margin: 3px 8upx 0 0;}
	.filter-items .item.active,.filter-items .item.active .iconfont{ color: #1B1B1B; font-weight: bold;}
	.filter-items .item.easy_choose_active,.filter-items .item.easy_choose_active .iconfont{ 
		font-weight: 500;
		font-size: 31rpx;
		color: #FFFFFF;
		background: #DCAB6C;
		border-radius: 10rpx;
		}
	.filter-items .item.a-change .iconfont{ transform: rotate(-180deg); }
</style>