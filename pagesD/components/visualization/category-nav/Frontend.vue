<template>
	<view>
		<view class="category-nav" ref="categorynav" :style="{top: navigationBarHeight + 'px'}" :class="{'position-fixed': scrollFixed}">
			<scroll-view class="uni-swiper-tab" scroll-x show-scrollbar="false">
				<view class="swiper-tab-list" :class="{'active': currentIndex == index+1}" v-for="(item,index) in categoryNavList" :key="index" @click="cateClick(index+1,item.cat_id)"><text class="text">{{item.cat_alias_name}}</text></view>
			</scroll-view>
		</view>
		<view class="seize-seat" v-if="scrollFixed" :style="{'height':height + 'px'}"></view>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar.vue'
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import universal from '@/common/mixins/universal.js';

export default{
	name:'category-nav',
	props:["module", "preview",'shopId','scrollFixed','fristBackgroundColor'],
	mixins: [universal],
	data(){
		return {
			categoryNavList:[],
			currentIndex:1,
			height:0,
			navigationBarHeight: 0
		}
	},
	components:{
		uniNavBar,
		uniIcons
	},
	watch: {
		scrollFixed(val) {
			if (val && this.navigationBarHeight == 0) this.navigationBarHeight = getApp().globalData.navigationBarHeight
		}
	},
	created(){
		
		uni.request({
			url: this.websiteUrl + '/api/visual/visual_category',
			method: 'GET',
			data: {
			},
			header: {
				'Content-Type': 'application/json',
				'token': uni.getStorageSync('token'),
				'X-Client-Hash':uni.getStorageSync('client_hash')
			},
			success: (res) => {
				console.log(res.data.data)
				this.categoryNavList = res.data.data
				this.cateClick(1,res.data.data[0].cat_id)
			},
			fail: (err) => {
				console.error(err)
			}
		})
	},
	mounted() {
		let _this = this;
		_this.$nextTick(() => {
			let info1 = uni.createSelectorQuery().in(this).select(".category-nav");
			setTimeout(()=>{
				info1.boundingClientRect(function(data){
					if(data){
						_this.height = data.height
					}
					_this.navigationBarHeight = getApp().globalData.navigationBarHeight
				}).exec();
			},500)
		})
	},
	computed:{
		backgroundColor(){
			return !this.scrollFixed ? this.module.allValue.bgColor : this.fristBackgroundColor
		}
	},
	methods:{
		cateClick(index,cat_id){
			this.currentIndex = index;

			this.$store.dispatch('updateIsShow', {
				type: index == 0 ? true : false,
				cat_id: cat_id
			});

			this.$emit('send',this.currentIndex)
		}
	}
}
</script>

<style scoped>
.category-nav{ display: flex; flex-direction: row; justify-content:space-between; align-items: center; padding-bottom: 10upx;background-color: #fff;}
.category-nav .uni-swiper-tab{ flex: 1; width: 80%; height: 72upx; line-height: 72upx; border: 0;}
.category-nav .uni-swiper-tab .swiper-tab-list{ font-size: 28upx; color: #000000; position: relative;}
.category-nav .uni-swiper-tab .swiper-tab-list.active{ font-weight: 700;color: #FE0302;}
.category-nav .uni-swiper-tab .swiper-tab-list.active::after{
	content: ' ';
	position: absolute;
	border-bottom: 4upx solid #FE0302;
	width: 60upx;
	height: 12upx;
	/* border-radius: 0 0 50% 50%/0 0 100% 100% ; */
	bottom: 0upx;
	left: calc(50% - 30upx);
	border-top: none;
}
.category-nav .category-filter{ width: 10%; height: 72upx; line-height: 72upx; display: flex; justify-content: center; align-items: center; box-shadow: -4px 0 4px -4px rgba(0,0,0,.4); color: #000000;}
.category-nav .category-filter .text{ height: 42upx; line-height: 42upx; margin: -7upx 0 0 10upx;}

.position-fixed{ position: fixed; top: 41px; z-index: 998;width: 100%;}

::-webkit-scrollbar{
	display: none;
}

/* #ifdef APP-PLUS */
.position-fixed{ top: calc(41px + var(--status-bar-height));}
/* #endif */
</style>
