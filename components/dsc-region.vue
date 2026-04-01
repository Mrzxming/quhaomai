<template>
	<view class="region-popup">
		<block v-if="regionType == 'currency'">
			<uni-popup :show="display" type="bottom" v-on:hidePopup="onRegionClose">
				<view class="mod-address-main">
					<view class="mod-address-head">
						<view class="mod-address-head-tit">{{$t('lang.region_alt')}}</view>
						<text class="iconfont icon-close" @click="onRegionClose"></text>
					</view>
				</view>
				<view class="mod-address-body">
					<view class="ulAddrTab">
						<text class="li" :class="{'cur':regionLevel-1 == 1}" @click="tabClickRegion(1,1)">
							{{ regionOption.province.name ? regionOption.province.name : $t('lang.select') }}
						</text>
						<text class="li" :class="{'cur':regionLevel-1 == 2}" v-if="regionOption.province.name"
							@click="tabClickRegion(regionOption.province.id,2)">{{ regionOption.city.name ? regionOption.city.name : $t('lang.select')}}</text>
						<text class="li" :class="{'cur':regionLevel-1 == 3}" v-if="regionOption.city.name"
							@click="tabClickRegion(regionOption.city.id,3)">{{ regionOption.district.name ? regionOption.district.name : $t('lang.select')}}</text>
						<text class="li" :class="{'cur':regionLevel-1 == 4}"
							v-if="regionOption.district.name && isLevel == 5"
							@click="tabClickRegion(regionOption.district.id,4)">{{ regionOption.street.name ? regionOption.street.name : $t('lang.select') }}</text>
					</view>

					<scroll-view class="ulAddrList" @touchmove.stop.prevent="() => {}" scroll-y v-if="regionLevel == 2">
						<view class="li" :class="{'active':regionOption.province.id == item.id}"
							v-for="(item,index) in regionDate.provinceData" :key="index"
							@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
					</scroll-view>
					<scroll-view class="ulAddrList" @touchmove.stop.prevent="() => {}" scroll-y v-if="regionLevel == 3">
						<view class="li" :class="{'active':regionOption.city.id == item.id}"
							v-for="(item,index) in regionDate.cityData" :key="index"
							@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
					</scroll-view>
					<scroll-view class="ulAddrList" @touchmove.stop.prevent="() => {}" scroll-y v-if="regionLevel == 4">
						<view class="li" :class="{'active':regionOption.district.id == item.id}"
							v-for="(item,index) in regionDate.districtData" :key="index"
							@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
					</scroll-view>
					<scroll-view class="ulAddrList" @touchmove.stop.prevent="() => {}" scroll-y v-if="regionLevel == 5">
						<view class="li" :class="{'active':regionOption.street.id == item.id}"
							v-for="(item,index) in regionDate.streetData" :key="index"
							@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
					</scroll-view>
				</view>
				<view style="height:20rpx;"></view>
				<!-- <view v-if="abc" style="position: absolute;bottom:120rpx;width: 90%;" class="btn_wrap u-border-top">
					<button class="u-reset-button sub_btn address_btn red_btn"
						style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
						@click="togetlocation">一键获取当前位置</button>
				</view>
				<view v-if="!abc" style="position: absolute;bottom:20rpx;width: 90%;" class="btn_wrap u-border-top">
					<button class="u-reset-button sub_btn address_btn red_btn"
						style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
						@click="togetlocation">一键获取当前位置</button>
				</view> -->
				<view style="height:120rpx;"></view>
				<!-- <view v-if="abc" style="height: 200rpx;"></view> -->
			</uni-popup>
		</block>
		<block v-if="regionType == 'goods'">
			<view class="mod-address-body">
				<view class="ulAddrTab">
					<text class="li" :class="{'cur':regionLevel-1 == 1}" @click="tabClickRegion(1,1)">
						{{ regionOption.province.name ? regionOption.province.name : $t('lang.select') }}
					</text>
					<text class="li" :class="{'cur':regionLevel-1 == 2}" v-if="regionOption.province.name"
						@click="tabClickRegion(regionOption.province.id,2)">{{ regionOption.city.name ? regionOption.city.name : $t('lang.select')}}</text>
					<text class="li" :class="{'cur':regionLevel-1 == 3}" v-if="regionOption.city.name"
						@click="tabClickRegion(regionOption.city.id,3)">{{ regionOption.district.name ? regionOption.district.name : $t('lang.select')}}</text>
					<text class="li" :class="{'cur':regionLevel-1 == 4}"
						v-if="regionOption.district.name && isLevel == 5"
						@click="tabClickRegion(regionOption.district.id,4)">{{ regionOption.street.name ? regionOption.street.name : $t('lang.select') }}</text>
				</view>

				<scroll-view class="ulAddrList" scroll-y v-if="regionLevel == 2">
					<view class="li" :class="{'active':regionOption.province.id == item.id}"
						v-for="(item,index) in regionDate.provinceData" :key="index"
						@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
				</scroll-view>
				<scroll-view class="ulAddrList" scroll-y v-if="regionLevel == 3">
					<view class="li" :class="{'active':regionOption.city.id == item.id}"
						v-for="(item,index) in regionDate.cityData" :key="index"
						@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
				</scroll-view>
				<scroll-view class="ulAddrList" scroll-y v-if="regionLevel == 4">
					<view class="li" :class="{'active':regionOption.district.id == item.id}"
						v-for="(item,index) in regionDate.districtData" :key="index"
						@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
				</scroll-view>
				<scroll-view class="ulAddrList" scroll-y v-if="regionLevel == 5">
					<view class="li" :class="{'active':regionOption.street.id == item.id}"
						v-for="(item,index) in regionDate.streetData" :key="index"
						@click="childRegion(item.id,item.name,item.level)">{{ item.name }}</view>
				</scroll-view>
			</view>
			<!-- #ifdef H5 -->
			<!-- <view v-if="abc" style="position: absolute;bottom:120rpx;width: 90%;" class="btn_wrap u-border-top">
				<button class="u-reset-button sub_btn address_btn red_btn"
					style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
					@click="togetlocation">一键获取当前位置</button>
			</view> -->
			<!-- <view v-if="!abc" style="position: absolute;bottom:20rpx;width: 90%;" class="btn_wrap u-border-top">
				<button class="u-reset-button sub_btn address_btn red_btn"
					style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
					@click="togetlocation">一键获取当前位置</button>
			</view> -->
			<!-- #endif -->

			<!-- #ifndef H5 -->
			<!-- <view style="position: absolute;bottom:30rpx;width: 100%;" class="btn_wrap u-border-top">
				<button class="u-reset-button sub_btn address_btn red_btn"
					style="border: 2rpx solid #000000;color: #000000;background-color: #ffffff;"
					@click="togetlocation">一键获取当前位置</button>
			</view> -->
			<!-- #endif -->

		</block>
	</view>
</template>

<script>
	//uniapp新版弹出层组件
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		name: 'region',
		components: {
			uniPopup
		},
		props: {
			abc: {
				type: Boolean,
				default: false
			},
			display: {
				type: Boolean,
				default: false
			},
			regionOptionData: {
				type: Object,
				default: {}
			},
			isPrice: {
				type: Number,
				default: 0
			},
			isLevel: {
				type: Number,
				default: 5
			},
			//是否存储选中值到本地存储
			isStorage: {
				type: Boolean,
				default: true
			},
			//弹窗
			regionType: {
				type: String,
				default: 'currency'
			}
		},
		watch: {
			status() {
				if (this.status == true) {
					this.regionOption.regionSplic = this.regionOption.province.name + ' ' + this.regionOption.city.name +
						' ' + this.regionOption.district.name + ' ' + this.regionOption.street.name;
					console.log('zheli')
					console.log(this.regionOption)
					if (this.isStorage) {
						uni.setStorageSync('regionData', this.regionOption)
					}

					this.$emit('updateRegionDate', this.regionOption);
					this.$emit('updateDisplay', false);
					this.$emit('update:isPrice', 1);
				}
			},
			regionOptionData() {
				this.regionOption = this.regionOptionData
				if (this.regionOptionData.street.id === '') {
					this.$store.dispatch('setRegion', {
						region: this.regionOptionData.district.id,
						level: 4
					});
				}
			}
		},
		data() {
			return {
				regionOption: this.regionOptionData,
				arr: ['province', 'city', 'district', 'street'],
			};
		},
		created() {
			let o = {
				region: 1,
				level: 1
			};

			if (this.regionOption.district.id == this.regionId) return

			if (this.isLevel == 5 && this.regionOption.district.id) {
				o.region = this.regionOption.district.id;
				o.level = this.isLevel - 1;
			}

			this.$store.dispatch('setRegion', o);
		},
		computed: {
			regionId() {
				return this.$store.state.common.region.id
			},
			regionLevel() {
				return this.isLevel > this.$store.state.common.region.level ? this.$store.state.common.region.level : this
					.isLevel
			},
			regionDate() {
				return this.$store.state.common.region.data
			},
			status: {
				get() {
					return this.$store.state.common.region.status
				},
				set(val) {
					this.$store.state.common.region.status = val
				}
			}
		},
		methods: {
			togetlocation() {
				var that = this
				uni.getLocation({
					geocode: true, // 返回经纬度
					success: function(loction) {
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
								if (a.city.length == 0) {
									console.log(a.province + ' ' + a.province + ' ' + a.district +
										' ' + a.township)
								} else {
									console.log(a.province + ' ' + a.city + ' ' + a.district +
										' ' + a.township)
								}
								uni.request({
									url: 'https://www.ok9288.com/api/misc/getAddressInfo',
									method: 'GET',
									header: {
										'Content-Type': 'application/json',
									},
									data: {
										towncode: resda.data.regeocode.addressComponent
											.towncode,
									},
									success: (res1) => {
										console.log(res1.data)
										if (res1.statusCode == 200) {
											console.log(
												"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

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
											that.regionOption = o;
											console.log('zheli')
											console.log(that.regionOption)
											uni.setStorageSync('regionData', that.regionOption)
											
											that.$store.dispatch('setRegion', {
												region: res1.data.province,
												level: 2
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.city,
												level: 3
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.district,
												level: 4
											})
											that.$store.dispatch('setRegion', {
												region: res1.data.street,
												level: 5
											})
											that.$emit('updateRegionDate', that
												.regionOption);
											that.$emit('updateDisplay', false);
											that.$emit('update:isPrice', 1);
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
			onRegionClose() {
				this.$emit('updateDisplay', false)
			},
			childRegion(val, name, level) {
				console.log(this.isLevel)
				if (this.isLevel == level) {
					console.log("zheli")
					this.status = true
				} else {
					this.status = false
				}

				switch (level) {
					case 2:
						this.regionOption.province.id = val
						this.regionOption.province.name = name
						break
					case 3:
						this.regionOption.city.id = val
						this.regionOption.city.name = name
						break
					case 4:
						this.regionOption.district.id = val
						this.regionOption.district.name = name
						break
					case 5:
						this.regionOption.street.id = val
						this.regionOption.street.name = name
						break
					default:
						break
				}

				this.arr.forEach((v, i) => {
					if ((i + 1) > level) {
						this.regionOption[v].id = ''
						this.regionOption[v].name = ''
					}
				})
				console.log('val=' + val)
				console.log('level=' + level)
				this.$store.dispatch('setRegion', {
					region: val,
					level: level
				})
			},
			tabClickRegion(val, level) {

				this.arr.forEach((v, i) => {
					if ((i + 1) > level) {
						this.regionOption[v].id = ''
						this.regionOption[v].name = ''
					}
				})
				console.log('val=' + val)
				console.log('level=' + level)
				this.$store.dispatch('setRegion', {
					region: val,
					level: level
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.uni-card {
		margin: 0;
	}

	.uni-card .uni-list-cell-navigate {
		padding: 0;
	}

	.uni-card .uni-list-cell-navigate .title {
		padding: 20upx 30upx;
		min-width: 100upx;
	}

	.uni-card .uni-list-cell-navigate .value {
		height: 80upx;
	}

	.btn-bar {
		margin: 30upx 40upx;
	}

	.mod-address-main {}

	.mod-address-main .mod-address-head {
		position: relative;
	}

	.mod-address-main .mod-address-head .mod-address-head-tit {
		height: 80upx;
		line-height: 80upx;
	}

	.mod-address-main .mod-address-head .icon-close {
		position: absolute;
		right: 20upx;
		top: 20upx;
	}

	.mod-address-body {
		height: 800upx;
	}

	.mod-address-body .ulAddrTab {
		overflow: hidden;
		position: relative;
		padding: 0 20upx;
		height: 80upx;
		line-height: 80upx;
	}

	.mod-address-body .ulAddrTab::after {
		content: "";
		position: absolute;
		z-index: 1;
		background-color: #E5E5E5;
		height: 1px;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.mod-address-body .ulAddrTab .li {
		margin-right: 20upx;
		float: left;
		text-align: center;
		height: 80upx;
		line-height: 80upx;
		position: relative;
	}

	.mod-address-body .ulAddrTab .li.cur {
		color: #F2270C;
	}

	.mod-address-body .ulAddrTab .li.cur::after {
		content: "";
		position: absolute;
		height: 1px;
		background-color: #F2270C;
		left: 0;
		bottom: 1px;
		right: 0;
	}

	.mod-address-body .ulAddrList {
		height: calc(100% - 80upx);
		padding: 20upx 0 0 20upx;
		box-sizing: border-box;
	}

	.mod-address-body .ulAddrList .li {
		text-align: left;
		color: #333333;
		padding: 10upx 0;
		position: relative;
	}

	.mod-address-body .ulAddrList .li.active {
		color: #F2270C;
	}

	.mod-address-body .ulAddrList .li.active::before {
		font-family: "iconfont";
		content: "\e61a";
		position: absolute;
		right: 20upx;
		font-size: 18px;
	}

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


	}

	.address_btn {
		flex: auto;
		margin: 0;
	}

	.red_btn {
		color: #ffffff;
		font-size: 30rpx;
		background-color: #F91F28;
	}
</style>