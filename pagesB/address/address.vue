<template>
	<view class="container">
		
		<view class="address-items" v-if="addressList.length > 0">
			<view class="select_post" @click="jumpMaps" v-if="nearbyleader > 0">
				{{$t('lang.selected_post')}}<uni-icons type="forward" size="18" color="#999999"></uni-icons>
			</view>
			<view class="address-item" v-for="(item,index) in addressList" :key="index">
				<view class="checkbox" :class="{'checked':item.id == iSaddress}" @click="checkAddress(item.id)">
					<view class="checkbox-icon">
						<uni-icons type="checkmarkempty" size="18" color="#ffffff"></uni-icons>
					</view>
				</view>
				<view class="address-content">
					<view class="left" @click="checkAddress(item.id,item)">
						<view class="title" style="display: flex;flex-direction: row;align-items: center;">
							<view class="name">{{ item.name }}</view>
							<view class="mobile">{{ item.mobile }}</view>
							<view style="border-radius: 10rpx;border: 2rpx solid #F91F28;padding:0rpx 14rpx;text-align: center;color: #f91f28;transform: scale(0.8);margin-left: 20rpx;" v-if="iSaddress == item.id">默认</view>
						</view>
						<view style="height: 10rpx;"></view>
						<view class="address">{{ item.province_name }} {{ item.city_name }} {{item.district_name}} {{item.street_name}} {{item.address}}</view>
					</view>
					<view class="right" @click="addressEdit(item.id,item.is_checked)">
						<uni-icons type="forward" size="18" color="#999999"></uni-icons>
					</view>
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
		<view class="btn-bar btn-bar-fixed">
			<!-- #ifdef MP-WEIXIN -->
			<view class="btn btn-white">
				<view class="uni-green" @click="wxAddress">{{$t('lang.wx_do')}}</view>
			</view>
			<view class="btn btn-red">
				<view @click="addressAdd">{{$t('lang.add_shipping_address')}}</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class=" butadd"  @click="addressAdd">
				<view class="btn-color-white ">{{$t('lang.add_shipping_address')}}</view>
			</view>
			<!-- #endif -->
		</view>
		
		<!--快捷菜单-->
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	export default {
		components: {
			uniIcons,
			dscCommonNav
		},
		data() {
			return {
				type:'',
				nearbyleader: 0
			};
		},
		computed:{
			...mapState({
				addressList: state => state.user.addressList
			}),
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
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/address/address'
			}
		},
		methods:{
			userAddressDelete(value){
				this.$store.dispatch('userAddressDelete',{
					address_id:value
				})
			},
			addressAdd(){
				uni.navigateTo({
					url:'./addressEdit'
				})
			},
			//微信导入
			wxAddress(){
				uni.navigateTo({
					url:'./addressEdit?type=wximport'
				})
			},
			addressEdit(val,checked){
				uni.navigateTo({
					url:'./addressEdit?id=' + val
				})
			},
			checkAddress(val,item){
				this.iSaddress = val;
				console.log(item)
				//切换收货地址清除驿站
				uni.removeStorageSync('leader_id');
				var regionData ={
					province:{ id:item.province, name:item.province_name },
					city:{ id:item.city, name:item.city_name },
					district:{ id:item.district, name:item.district_name },
					street:{ id:item.street, name:item.street_name },
					regionSplic:item.province_name +' '+ item.city_name +' '+ item.district_name +' '+ item.street_name
				}
				// this.$store.dispatch('setRegion',{
				// 	region:item.street,
				// 	level:5
				// })
				uni.setStorageSync('regionData',regionData)
				
				this.$store.dispatch('setChangeConsignee',{
					address_id:val
				}).then(res=>{
					if(this.type){
						uni.navigateBack({
							delta:1
						})
					}
				})
			},
			jumpMaps() {
				uni.navigateTo({
					url: '/pagesB/address/communityPost'
				})
			}
		},
		onLoad(e){
			this.type = e.type;
			this.nearbyleader = e.nearbyleader || 0;
		},
		onShow(){
			this.$store.dispatch('userAddress');
		}
	}
</script>

<style>
.address-items{ padding-bottom: 120upx; }
.address-item{ background: #FFFFFF; padding: 20upx; display: flex; flex-direction: row; margin-bottom: 20upx;}
.address-item:last-child{ margin-bottom: 0; }
.address-item .address-content{ display: flex; flex-direction: row; flex: 1; justify-content: space-between; align-items: center;}
.address-item .address-content .left{ flex: 1;}
.address-item .address-content .left view{ line-height: 1.5; font-size: 26upx;}
.address-item .address-content .title{ font-weight: 700;}
.address-item .address-content .title .name{ margin-right: 15upx;}
.address-item .address-content .address{ color: #666666;}
.address-item .address-content .right{ display: flex; flex-direction: row;}
.address-item .address-content .right view{ line-height: 1.5; font-size: 26upx; padding: 20upx;}

.address-info-show .uni-card{ margin: 0;}
.address-info-show .uni-card .uni-list-cell-navigate{ padding: 0;}
.address-info-show .uni-card .uni-list-cell-navigate .title{ padding: 20upx 30upx; min-width: 100upx; font-size: 28upx;}
.address-info-show .uni-card .uni-list-cell-navigate .value text{ width: 100%;}
.address-info-show .uni-card .uni-list-cell-navigate .value input{ height: 40px; line-height: 40px;}
.address-info-show .btn-bar{ margin: 30upx 40upx; display: flex; flex-direction: column;}
.address-info-show .btn-bar .btn{ width: 100%; margin-bottom: 30upx;}
.container {
	background-color: #fff;
}
.select_post {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20upx;
	background-color: #FFFFFF;
	margin-bottom: 20upx;
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
.butadd {
	width: 688rpx;
	height: 88rpx;
	background: #FE2F02;
	box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192,192,192,0.15);
	border-radius: 44rpx;
    display: flex;
    justify-content: center;
    align-items: center;
	margin: 76rpx 32rpx;
}
	.btn-color-white {
		color:#fff
	}
</style>
