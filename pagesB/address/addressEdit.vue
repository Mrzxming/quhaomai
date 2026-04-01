<template>
	<view class="container" v-if="!loading">
		
		<!-- 识别区 -->
			
			<!-- <view class="copy">地址粘贴板</view> -->
		
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view style="height: 50rpx;"></view>
				<view class="lasttext">
					<textarea placeholder="粘贴收件人姓名、手机号、收货地址,可快速识别您的收货信息" placeholder-style="color:#aaaaaa;font-size:28rpx;" @change="autoParse"
						v-model="infos"></textarea>
					<view class="qingchu" @click="autoPass">
						清除
					</view>
					<view class="shibies" v-if="!infos">
						识别
					</view>
					<view class="shibie" v-else @click="autoParse">
						识别
					</view>
				</view>
				<view style="height: 50rpx;"></view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.consignee')}}</text>
							<view class="value"><input :placeholder="$t('lang.enter_consignee')" name="consignee" v-model="consignee"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.phone_number')}}</text>
							<view class="value"><input :placeholder="$t('lang.enter_contact_phone')" type="digit" name="mobile" v-model="mobile"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.postal_Code')}}</text>
							<view class="value"><input :placeholder="$t('lang.enter_contact_zipcode')" type="text" name="zipcode" v-model="zipcode"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right" @click="handleRegionShow">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<text class="title">{{ $t('lang.region_alt') }}</text>
							<view class="value" :class="{'gay': !regionSplic}">{{ regionSplic ? regionSplic : $t('lang.select') }}</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.label_address')}}</text>
							<view class="value"><input :placeholder="$t('lang.detailed_address')" name="address" v-model="address"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-radius">
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn btn-white btn-wximport" type="default" v-if="!wximport" @click="wxAddress">{{ $t('lang.import_wx_address') }}</button>
				<!-- #endif -->
				<button class="btn btn-red" formType="submit" type="primary">{{$t('lang.confirm_on')}}</button>
				<button class="btn btn-white" type="primary" @click="addressDelete(address_id)" v-if="address_id">{{$t('lang.delete')}}</button>
			</view>
		</form>
		
		<!--地区选择-->
		<dsc-region :display="regionShow" :regionOptionData="regionData" :isStorage="false" @updateDisplay="getRegionShow" @updateRegionDate="getRegionOptionDate" v-if="regionLoading"></dsc-region>
	</view>
</template>

<script>
	import universal from '@/common/mixins/universal.js';
	import dscRegion from '@/components/dsc-region.vue';
	
	var  graceChecker = require("@/common/graceChecker.js");
	export default {
		mixins:[universal],
		components:{
			dscRegion
		},
		data() {
			return {
				consignee:'',
				mobile:'',
				address:'',
				address_id:0,
				zipcode:'',
				wximport:false,
				loading:false,
				defaultAdressID:0, // 默认地址的Id，  默认地址不可删除
				infos: '',
			}
		},
		computed:{
			
			iSaddress:{
				get(){
					console.log("zheliEdit")
					console.log(this.$store.state.user.addressId)
					return this.$store.state.user.addressId
				},
				set(value){
					console.log(value)
				}
			}
		},
		methods: {
			autoPass(){
				this.infos = ''
			},
			//点击识别收货信息
			autoParse() {
				console.log(this.infos, '????');
				var that = this
				if (!this.infos) {
					return uni.showToast({
						title: '请粘贴您需要识别的信息',
						icon: 'none'
					})
				}
				// api/address/address_rec
				uni.request({
					url: 'https://www.ok9288.com/api/address/address_rec',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
					},
					data: {
						text: this.infos
					},
					success: (res1) => {
						console.log(res1.data)
						if (res1.statusCode == 200) {
							console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
							that.consignee = res1.data.consignee
							that.mobile = res1.data.mobile
							// that.regionSplic = res1.data.regionSplic
							that.address = res1.data.address
							// return;
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
							that.regionSplic = o;
							
							
							
						}
					}
				})
				
				return;
				this.dadata = AddressParse.parse(this.infos)
				let result = this.dadata[0]
				this.PasteArea(result) //粘贴的数据需要对应接口传回来的省市区id
 
				if (result && result.length) {
					let html = ''
					for (let key in result[0]) {
						if (result[0][key]) {
							html += key + `:` + result[0][key] + `<br/>`
						}
					}
					this.value = JSON.stringify(result[0])
				}
				console.log('打印一下addr', result.details)
				if (result.name != '') {
					that.form.name = result.name
				}
				if (result.phone != '') {
					that.form.mobile = result.phone
				}
				if (result.details != '') {
					// 拼接省市区加详细地址
					// that.form.address = result.province + '-' + result.city + '-' + result.area  + '-' + result.details 
					that.form.address = result.details
				}
			},
			formSubmit(e){
				if(this.$isLogin()){
					var rule = [
						{name:"consignee", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.consignee_not_null')},
						{name:"mobile", checkType : "phoneno", checkRule:"",  errorMsg:this.$t('lang.mobile_not_null')},
						{name:"address", checkType : "notnull", checkRule:"",  errorMsg:this.$t('lang.address_not_null')}
					];
					
					//进行表单检查
					var formData = e.detail.value;
					var checkRes = graceChecker.check(formData, rule);
					if(checkRes){
						if(this.regionData.province.id == ''){
							uni.showToast({title:this.$t('lang.cannot_be_empty'), icon:"none"});
							return false
						}
						
						if(this.regionData.city.id == ''){
							uni.showToast({title:this.$t('lang.area_cannot_be_empty'), icon:"none"});
							return false
						}
						
						if(this.regionData.district.id == ''){
							uni.showToast({title:this.$t('lang.area_cannot_be_empty1'), icon:"none"});
							return false
						}
						
						if(this.regionData.street.id == ''){
							uni.showToast({title:this.$t('lang.area_cannot_be_empty2'), icon:"none"});
							return false
						}
						
						uni.showLoading({title: this.$t('lang.loading')});
						this.$store.dispatch('userAddressAdd',{
							address_id:this.address_id,
							consignee:this.consignee,
							mobile:this.mobile,
							address:this.address,
							zipcode:this.zipcode,
							country:1,
							province:this.regionData.province.id,
							city:this.regionData.city.id,
							district:this.regionData.district.id,
							street:this.regionData.street.id
						}).then(res => {
							uni.hideLoading();
							if(res.status == 'success'){
								uni.showToast({title:this.$t('lang.save_success'), icon:"success"});
								
								uni.navigateBack({
									delta:1
								})
							}else{
								uni.showToast({title:this.$t('lang.save_fail'), icon:"none"});
							}
						})
					}else{
						uni.showToast({ title: graceChecker.error, icon: "none" });
					}
				} else {
					uni.showModal({
						content: this.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
				
			},
			addressInfoInt(id){
				this.$store.dispatch('userAddressInfo',{
					address_id:id
				}).then(res=>{
					if(res.data){
						this.consignee = res.data.consignee
						this.mobile = res.data.mobile
						this.address = res.data.address
						this.zipcode = res.data.zipcode
						
						this.regionData.province.id = res.data.province
						this.regionData.province.name = res.data.province_name
						this.regionData.city.id = res.data.city
						this.regionData.city.name = res.data.city_name
						this.regionData.district.id = res.data.district
						this.regionData.district.name = res.data.district_name
						this.regionData.street.id = res.data.street
						this.regionData.street.name = res.data.street_name
						this.regionData.regionSplic = res.data.region
						
						this.regionLoading = true
					}
				})
			},
			addressDelete(val){
				if(this.defaultAdressID == this.address_id) {
					uni.showToast({
						title:'默认地址不可删除',
						icon:'none'
					})
					return
				}else {
					uni.showModal({
						title:'',
						content:this.$t('lang.delete_this_receiving'),
						success: (res) => {
							uni.showLoading({title: this.$t('lang.loading')});
								
							if(res.confirm){
								this.$store.dispatch('userAddressDelete',{
									address_id:val
								})
								
								uni.navigateBack({
									delta:1
								})
							}
							
							if(res.cancel){
								uni.hideLoading();
							}
						}
					})
				}
				
			},
			//微信导入
			wxAddress(){
				uni.chooseAddress({
					success: (res) => {
						if(res.errMsg == 'chooseAddress:ok'){
							this.$store.dispatch('userWxImportAddress',{
								provinceName:res.provinceName,
								cityName:res.cityName,
								countyName:res.countyName,
								detailInfo:res.detailInfo,
								telNumber:res.telNumber,
								userName:res.userName
							}).then(result => {
								uni.hideLoading();
								if(result.status == 'success'){
									this.address_id = 0
									this.consignee = result.data.consignee ? result.data.consignee : '';
									this.mobile = result.data.mobile ? result.data.mobile : '';
									this.address = result.data.address ? result.data.address : '';
									this.regionData.province.id = result.data.province ? result.data.province : '';
									this.regionData.province.name = res.provinceName ? res.provinceName : '';
									this.regionData.city.id = result.data.city ? result.data.city : '';
									this.regionData.city.name = res.cityName ? res.cityName : '';
									this.regionData.district.id = result.data.district ? result.data.district : '';
									this.regionData.district.name = res.countyName ? res.countyName : '';
									this.regionData.street.id = result.data.street ? result.data.street : '';
									this.regionData.street.name = result.data.street_name ? result.data.street_name : this.$t('lang.select');
									this.regionData.regionSplic = result.data.region ? result.data.region : '';
								}else{
									uni.showToast({
										title:this.$t('lang.Importing_not'),
										icon:'none'
									})
								}
								
								this.loading = false
							})
						}
					},
					fail: (res) => {
						console.log(res)
						uni.navigateBack({
							delta:1
						})
					}
				})
			}
		},
		onLoad(e) {
				console.log(this.$store.state.user.addressId)
					console.log(this.$store.state.user.addressId == e.id)
					console.log(e.id)
			this.defaultAdressID = this.$store.state.user.addressId || 0,
			this.address_id = e.id ? e.id : 0;
			this.type = e.type ? e.type : '';
			this.loading = e.type ? true : false;
			
			if(this.type == 'wximport'){
				uni.showLoading({ title:this.$t('lang.Importing') });
				this.wximport = true;
				this.wxAddress();
			}
			
			if(this.address_id){
				this.addressInfoInt(this.address_id)
			}else{
				this.regionLoading = true
			}
		}
	}
</script>

<style scoped>
.uni-card{ margin: 0;}
.uni-card .uni-list-cell-navigate{ padding: 0;}
.uni-card .uni-list-cell-navigate .title{ padding: 20upx 30upx; min-width: 100upx; font-size: 28upx; color: #666666;}
.uni-card .uni-list-cell-navigate .value text{ width: 100%;}
.uni-card .uni-list-cell-navigate .value input{ height: 40px; line-height: 40px;}
.btn-bar{ margin: 180upx 40upx 30upx 40upx; display: flex; flex-direction: column;}
.btn-bar .btn{ width: 100%; margin-bottom: 30upx;}
.btn-bar .btn-wximport{ color: #41d357;}

.lasttext {
		position: relative;
	}
 
	.shibie {
		background-color: #ff482e;
		border-radius: 50rpx;
		width: 130rpx;
		line-height: 48rpx;
		height: 48rpx;
		color: #fff;
		text-align: center;
		position: absolute;
		bottom: 20rpx;
		right: 80rpx;
	}
	
	.shibies {
		background-color: #ffbbbb;
		border-radius: 50rpx;
		width: 130rpx;
		line-height: 48rpx;
		height: 48rpx;
		color: #fff;
		text-align: center;
		position: absolute;
		bottom: 20rpx;
		right: 80rpx;
	}
	
	.qingchu {
		width: 100rpx;
		line-height: 48rpx;
		height: 48rpx;
		color: #aaaaaa;
		text-align: center;
		position: absolute;
		bottom: 20rpx;
		right: 240rpx;
	}
 
 
	textarea {
		width: 84%;
		/* border: 2rpx solid #ededed; */
		margin: 0 32rpx;
		height: 200rpx;
		background-color: #f5f5f5;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
	}
 
	.copy {
		text-align: center;
		margin: 6px auto;
	}
</style>
