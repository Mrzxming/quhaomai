<template>
	<view>
		<view class="wxjs_li">
			<view>订单编号：</view>
			<view style="color: #333333;">{{trade_no}}</view>
		</view>
		<view class="wxjs_li">
			<view>支付金额：</view>
			<view class="wxjs_pay">{{amount}}</view>
		</view>
		<view v-if="showbtn" class="wxjs_btn" @click="wxjsPay">立即支付</view>
		<view v-else class="wxjs_btn" style="background: #999999;">立即支付</view>
	</view>
</template>

<script>
	import api from "../../api/api.js"
	import fixedHeader from "../../components/fixedHeader/fixedHeader";
	
	export default {
		data () {
			return {
				// 顶部导航数据
				headerTxt: "支付订单",
				rebackurl: '',
				jsApiParameters:'',
				trade_no: '',
				amount: '',
				showbtn: false,
			}
		},
		
		components: {
			
		},
		
		onLoad: function (e){
			let that = this;
			if(e.rebackurl){
				that.rebackurl = decodeURIComponent(e.rebackurl);
			}else{
				that.rebackurl = '/packageIndex/index/index';
			}
			//that.getJsApiParameters();
			
			if(e.trade_no){
				that.trade_no = e.trade_no;
				that.amount = e.amount;
				that.getJsApiParameters();
			}
		},
		
		onBackPress(e) {
			if(e.form == 'backbutton' || e.from == 'navigateBack'){
				sessionStorage.removeItem('jsApiParameters');
			}
		},

		onShow: function (){
			//this.wxjsPay();
		},
		
		methods: {
			getJsApiParameters: function (){
				
				let that = this;
				let params = {trade_no: that.trade_no, amount: that.amount, in_weixin: true};
				api.paymentWxjsPay(params, function (res){
					if(res.error == '0'){
						that.jsApiParameters = res.data.jsApiParameters;
						that.wxjsPay();
					}else{
						uni.showToast({
							icon: 'none',
							title: res.message
						})
					}
				});
			},
			
			wxjsPay: function (){
				let that = this, jsApiParameters = that.jsApiParameters;
				//console.log('wxjsPay',jsApiParameters);
				that.$wchat.wxjspay(jsApiParameters, function(status){
					if(status == 'success'){
						uni.showToast({
							icon: 'success',
							title: '支付成功'
						})
						setTimeout(function(){
							/* uni.redirectTo({
								url: that.rebackurl
							}) */
							api.navigateByType(that.rebackurl, 'redirect');
						},1500)
					}else{
						uni.showToast({
							icon: 'none',
							title: '支付失败'
						})
						setTimeout(function(){
							//api.navigateByType(that.rebackurl, 'redirect');
							that.showbtn = true;
						},1500)
					}
				});
			}
		}
	}
</script>


<style scoped>
	page{height: 100%;width: 100%;background: #F6F6F6;}
	.wxjs_li{display: flex;justify-content: space-between;align-items: center;padding: 0 32upx;height: 88upx;background: #FFFFFF;margin-bottom: 2upx;font-size: 28upx;color: #666666;}
	.wxjs_pay{font-size: 36upx;font-weight: 600;}
	.wxjs_btn{background: #20AD20;border-radius: 8upx;margin: 40upx 32upx;font-size: 32upx;color: #FFFFFF;height: 80upx;line-height: 80upx;text-align: center;letter-spacing: 6upx;}
</style>
