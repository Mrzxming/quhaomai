<template>
	<view>
		<view class="map_group">
			<!-- #ifdef H5 -->
			<map @regionchange="regionChange" id="container" class="map_map"
				:style="'height:' + heightMap + 'rpx;width:' + widthMap + 'rpx;'" :scale="maps.scale"
				:latitude="latitude" :longitude="longitude" :markers="maps.covers" show-location="true">
				<!-- <cover-view style="width: 100%;height: 100%;background: rgba(0,0,0,0);"></cover-view> -->
			</map>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<!-- <image class="map_map" :style="'height:' + heightMap + 'rpx;width:' + widthMap + 'rpx;'" :src="mapsrc" mode=""></image> -->
			<map @regionchange="regionChange" id="container" class="map_map"
				:style="'height:' + heightMap + 'rpx;width:' + widthMap + 'rpx;'" :scale="maps.scale"
				:latitude="latitude" :longitude="longitude" :markers="maps.covers" show-location="true">
				<!-- <cover-view style="width: 100%;height: 100%;background: rgba(0,0,0,0);"></cover-view> -->
			</map>
			<!-- #endif -->
			<!-- 骑手位置 -->
			<!-- <image class="point_icon" :src="iconvycling" mode=""></image>
			<view class="map_addr">距离取货地<text class="juli">1.3km</text></view> -->
			<!-- 地图图标 Location-->
			<image :src="location" mode="" class="location" @click="tocenter()"></image>
			<!-- 等待商家接单 -->
			<!-- 	<view class="wait">
				等待商家接单<image :src="right" mode="" class="right"></image>
			</view> -->

			<!-- 遮挡腾讯地图标识 -->
			<view style="position: absolute; bottom: 0; left: 0; width: 100%; height:50upx; background: #ffffff;">
			</view>
		</view>
	</view>
</template>

<script>
	import api from "../../../api/api.js";
	export default {
		props: ["maps", "heightMap", "widthMap"],
		data() {
			return {
				location: require("static/order/icon_fw@2x.png"),
				right: require("static/order/btn_arrow_r@2x.png"),
				iconvycling: require("static/order/icon_qishou@2x.png"),
				mapsrc: '',
				latitude: "",
				longitude: "",
			}
		},

		mounted() {
			var that = this;
			// #ifndef H5
			var height = Math.floor(that.heightMap / 2);
			var width = Math.floor(that.widthMap / 2);
			var size = width + "*" + height;
			api.myAmapFun.getStaticmap({
				zoom: 16,
				size: size,
				scale: 2,
				markers: "mid,0xFF0000,A:" + that.maps.lng + ',' + that.maps.lat,
				success: function(data) {
					that.mapsrc = data.url
					console.log('mapsrc',that.mapsrc);
				},
				fail: function(info) {
					uni.showModal({
						title: info.errMsg
					})
				}
			})
			// #endif
			//uni地图方法
			// var mapContext  = uni.createMapContext('container');
			// // let appMap = mapContext .$getAppMap();
		},

		created() {
			this.latitude = this.maps.lat
			this.longitude = this.maps.lng
		},

		methods: {
			tocenter() {
				//获取定位点
				var that = this;
				// #ifdef H5
				if (api.checkIsWeixin()) {
					that.$wchat.getLocation(function(status, data) {
						if (status == 'success') {
							that.longitude = data.lng;
							that.latitude = data.lat;
						} else {

						}
					});
				} else {
					AMap.plugin('AMap.Geolocation', function() {
						var geolocation = new AMap.Geolocation({
							enableHighAccuracy: false, // 是否使用高精度定位，默认：true
							timeout: 10000, // 设置定位超时时间，默认：无穷大
							// showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
							// showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
							// panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
							// zoomToAccuracy:true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
							extensions: 'base' // 返回周边POI、道路交叉口等信息
						});
						geolocation.getCurrentPosition()
						AMap.event.addListener(geolocation, 'complete', onComplete)
						AMap.event.addListener(geolocation, 'error', onError)

						function onComplete(data) {
							if (data.position && data.position.lng && data.position.lat) {
								that.longitude = data.position.lng;
								that.latitude = data.position.lat;
							}
						};

						function onError(data) {

						};
					})
				}
				// #endif

				// #ifndef H5
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						that.latitude = res.latitude
						that.longitude = res.longitude
						//that.moveTolocation()
						console.log('gcj02',res)
					},
					fail: function(res) {
						//console.log(res)
					}
				});
				// #endif
			},

			//视野发生改变时触发
			regionChange(res) {
				var that = this;
				// 改变中心点位置  
				if (res.type == "end") {
					that.getCenterLocation();
				}
			},
			//获取中心点
			getCenterLocation: function() {
				var that = this;
				//mapId 就是你在 map 标签中定义的 id
				var mapContext = uni.createMapContext('container', this);
				mapContext.getCenterLocation({
					success: function(res) {
						that.longitude = res.longitude;
						that.latitude = res.latitude;
					},
					fail: function(res) {
						//console.log('getCenterLocation:fail',res)
					}
				})
			},
			//移动中心点
			moveTolocation: function() {
				//mapId 就是你在 map 标签中定义的 id
				var mapContext = uni.createMapContext('container');
				mapContext.moveToLocation();
			},
		}
	}
</script>

<style scoped>
	.map_group {
		position: relative;
		width: 100%;
	}


	.point_icon {
		width: 80upx;
		height: 80upx;
		position: absolute;
		left: 50%;
		margin-left: -40upx;
		top: 500upx;
		/* top: 50%;
		margin-top: -60upx; */
	}

	.call_out {}

	.icon_lo {
		width: 32upx;
		height: 32upx;
		margin-left: 24upx;
		margin-right: 8upx;
	}

	.icon_right {
		width: 8upx;
		height: 16upx;
		margin-left: 16upx;
	}

	.map_addr {
		width: 400upx;
		height: 88upx;
		line-height: 88upx;
		text-align: center;
		background: #FFFFFF;
		border-radius: 8upx;
		position: absolute;
		left: 50%;
		margin-left: -200upx;
		font-size: 28upx;
		color: #333333;
		box-shadow: 0 0 10upx rgba(0, 0, 0, 0.1);
		top: 400upx;
	}

	.map_addr .juli {
		color: #FA4C34;
		;
	}

	.call_out:before {
		content: '';
		position: absolute;
		bottom: -16upx;
		left: 50%;
		margin-left: -20upx;
		width: 0;
		height: 0;
		border-left: 20upx solid transparent;
		border-right: 20upx solid transparent;
		border-top: 40upx solid #FFFFFF;
	}

	.location {
		width: 60upx;
		height: 60upx;
		position: absolute;
		right: 32upx;
		bottom: 60upx;
	}

	/* 	.wait{font-size: 32upx;color: #333333;padding: 18upx 34upx;background: #FFFFFF;width: 280upx;height: 80upx;box-sizing: border-box;}
	.wait .right{width: 15upx;height: 24upx;margin-left: 4upx;} */
</style>