<template>
	<view class="">
		<web-view :src="'https://zhangguan.ok9288.com//www/login.html?mobile='+mobile+'&password='+password+'&username='+username"></web-view>
	
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				mobile:'',
				password:'',
				username:''
			};
		},
		computed:{
			
		},
		methods:{
			
			
		},
		onLoad(e){
			console.log(e)
			this.mobile=e.mobile;
			this.password=e.password;
			this.username=e.username;
			setTimeout(function(){
				this.mobile='';
				this.password='';
				this.username='';
			},1000)
		},
		onShow() {
			this.$store.dispatch('setAccount').then(res =>{
				this.account = res.data
				this.value_card = res.data.value_card;
			})
			
			
		}
	}
</script>

<style>
	
</style>