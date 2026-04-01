<template>
	<view class="visual-adv" :class="[bStyleSel == 0 ? 'visual-adv-swiper' : 'visual-adv-lie']" :style="{'background-color':backgroundColor}">
		<view class="bg-img" @click="link(module.allValue)">
			<image :src="module.allValue.titleImg" mode="widthFix" style="height: 248rpx;" class="img" v-if="module.allValue.titleImg"></image>
		</view>
		
	</view>
</template>

<script>
export default {
	name: 'visual-adv',
	props: ['module', 'preview', 'modulesIndex','shopId'],
	data() {
		return{
			module:{
				allValue:{
					titleImg:'https://images.eqingqu.com/attachs/photo/202304/20230413_20DD78E6DA5BBCED501F3BB4A2368674.png'
				}
			},
			previewProlist: [
				{
					title: '罗密欧安全套凉感凉感光面避孕套',
					sale: '0',
					stock: '0',
					price: '¥238.00',
					marketPrice: '¥413.00',
					goods_thumb:'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202305/thumb_img/25215_thumb_G_1684449122423.jpg'
				},
				{
					title: '大象樱樱女生 3只装玻尿酸避孕套',
					sale: '0',
					stock: '0',
					price: '¥38.00',
					marketPrice: '¥43.00',
					goods_thumb:'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202304/thumb_img/24706_thumb_G_1682536145998.jpg'
				},
				{
					title: '日本君岛爱虎能劲能液男用安全套',
					sale: '0',
					stock: '0',
					price: '¥38.00',
					marketPrice: '¥43.00',
					goods_thumb:'https://cbu01.alicdn.com/img/ibank/O1CN01wK8d0b1Gxbe1QN2d0_!!942260689-0-cib.jpg_300x300.jpg'
				},
				{
					title: '罗密欧安全套凉感凉感光面避孕套',
					sale: '0',
					stock: '0',
					price: '¥238.00',
					marketPrice: '¥413.00',
					goods_thumb:'https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/2/thumb_img/2_thumb_G_1681165841025.jpg'
				},
				{
					title: '大象樱樱女生 3只装玻尿酸避孕套',
					sale: '0',
					stock: '0',
					price: '¥38.00',
					marketPrice: '¥43.00',
					goods_thumb:'https://cbu01.alicdn.com/img/ibank/O1CN01gsvVDl1ok2r83CFa2_!!939665262-0-cib.jpg_300x300.jpg'
				},
				{
					title: '日本君岛爱虎能劲能液男用安全套',
					sale: '0',
					stock: '0',
					price: '¥38.00',
					marketPrice: '¥43.00',
					goods_thumb:'https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202306/thumb_img/25218_thumb_G_1686619000618.jpg'
				}
			]
		}
	},
	created() {
		uni.request({
			url: this.websiteUrl + '/api/visual/checked',
			method: 'POST',
			data: {
				number:this.selectGoodsId.length,
				goods_id:this.selectGoodsId.toString()
			},
			header: {
				'Content-Type': 'application/json',
				'token': uni.getStorageSync('token'),
				'X-Client-Hash':uni.getStorageSync('client_hash')
			},
			success: (res) => {
				this.previewProlist = res.data.data
			},
			fail: (err) => {
				console.error(err)
			}
		})
	},
	mounted() {

	},
	computed: {
		selectGoodsId() {
			return this.module.allValue.selectGoodsId || []
		},
		bStyleSel(){
			return this.module.isStyleSel
		},
		nNumber() {
			return this.module.allValue.number
		},
		backgroundColor(){
			return this.module.allValue.bgColor
		},
	},
	methods:{
		linkHref(goods_id){
			uni.navigateTo({
				url:'/pagesC/goodsDetail/goodsDetail?id='+goods_id
			})
		},
		link(item){
			let page,built
			// #ifndef APP-PLUS
			page = item.appPage ? item.appPage : item.url
			built = item.appPage ? 'app' : 'undefined'
			// #endif
			
			// #ifdef MP-WEIXIN
			page = item.appletPage ? item.appletPage : item.url
			built = item.appletPage ? 'app' : 'undefined'
			// #endif
			console.log(item)
			this.$outerHref(page,built)
		}
	}
}
</script>

<style scoped>
::-webkit-scrollbar{
	display: none;
}
.visual-adv{
    padding: 0upx 20upx 0 20upx;
    position: relative;
}
.visual-adv .bg-img{
	width: 100%;
	height: 100%;
	min-height: 100%;
}
.visual-adv .bg-img .img{
    border-radius: 20upx;
}

.adv-goods-list{
	/* #ifdef MP-WEIXIN */
	 margin-top: -27%;
	/* #endif */
	/* #ifdef APP-PLUS */
	 margin-top: -27%;
	/* #endif */
	/* #ifdef H5 */
	margin-top: 0%;
	/* #endif */
}
.adv-goods-list .scroll-view{
    overflow: visible;
}
.adv-goods-list .scroll-view-item{
    display: inline-block;
    width: 30%;
	margin: 0 0 0 2%;
    background-color: #fff;
    overflow: hidden;
    border-radius: 20upx;
    /* box-shadow:1upx 5upx 20upx 0 rgba(108,108,108,0.2); */
}
.adv-goods-list .scroll-view-item .goods-top{ width: 100%; line-height: 0; position: relative;}
.adv-goods-list .scroll-view-item .goods-info{
    padding: 20upx 16upx 10upx;
}
.adv-goods-list .scroll-view-item .goods-info .goods-name{
    font-size: 26upx;
    color: #000;
	height: 38px;
	line-height: 19px;
}
.adv-goods-list .scroll-view-item .goods-info .price{
    font-size: 32upx;
    color: #F20E28;
    font-weight: 500;
}
.adv-goods-list .scroll-view-item .goods-info .price .em{
	font-size: 25upx;
	margin-right: 3upx;
}
.visual-adv-swiper .adv-goods-list .scroll-view-item:last-child{
    margin-right: 0;
}
.visual-adv-lie{
    margin:0upx 20upx 0 20upx;
    border-radius: 20upx;
    padding:0 0 30upx;
}
.visual-adv-lie .scroll-view{
	white-space:inherit;
	line-height: 0;
}
.visual-adv-lie .adv-goods-list{
    padding: 0;
}
.visual-adv-lie .adv-goods-list .scroll-view-item{
    margin-bottom: 2.5%;
}
.visual-adv-lie .adv-goods-list .scroll-view-item:nth-child(3n){
    margin-right: 0;
}
.visual-adv-lie .adv-goods-list .scroll-view-item:nth-child(3n + 1){
    margin-left: 3.5%;
}
.visual-adv-lie .adv-goods-list .swiper-slide:last-child,
.visual-adv-lie .adv-goods-list .swiper-slide:nth-last-child(2),
.visual-adv-lie .adv-goods-list .swiper-slide:nth-last-child(3){
    margin-bottom: 0;
}
</style>
