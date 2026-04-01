<template>
	<view class="nav" :class="aClass">
		<block v-if="showStyle == 2 && isSwiperShow">
			<swiper class="swiper" :indicator-dots="indicatorDots" :style="{height:imgheights + 'px'}" @change="swiperChange">
				<swiper-item v-for="(list,listIndex) in swiperList" :key="listIndex">
					<view class="list" :class="{'list1':index == 0}" v-for="(item,index) in list" :key="index" @click="link(item)" :style="{width:liStyle}">
						<view class="icon" v-if="item.img"><image :src="item.img" mode="widthFix" class="image" style="height: 144rpx;"></image></view>
						<view class="icon" v-if="!item.img"><image :src="imagePath.defaultImg" mode="widthFix" class="image" style="height: 144rpx;"></image></view>
						<view class="con uni-ellipsis" v-if="bDesc">
							<block v-if="item.desc">{{ item.desc }}</block>
							<block v-else>[描述]</block>
						</view>
						<uni-icons type="arrowright" size="20" v-if="showStyle == '0'"></uni-icons>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots-container" v-if="showStyle == 2">
				<view v-for="(ad, index) in swiperList" :key="index" :class="['dot', index === swiperCurrent ? 'active' : '']"></view>
			</view>
		</block>
		
		<view class="list" v-for="(item,index) in module.list" :key="index" @click="link(item)" :style="{width:liStyle}" v-else>
			<view class="icon" v-if="item.img"><image :src="item.img" mode="widthFix" class="image"></image></view>
			<view class="icon" v-if="!item.img"><image :src="imagePath.defaultImg" mode="widthFix" class="image"></image></view>
			<view class="con uni-ellipsis" v-if="bDesc">
				<block v-if="item.desc">{{ item.desc }}</block>
				<block v-else>[描述]</block>
			</view>
			<uni-icons type="arrowright" size="20" v-if="showStyle == '0'"></uni-icons>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default{
	props: ['module', 'preview'],
	data(){
		return {
			imgheights:200,
			listHeight:0,
			swiperCurrent:0,
			// swiperList:[
			// 	{
			// 		appPage: "/pagesD/goodslist/goodslist?id=548",
			// 		appletPage: "/pagesD/goodslist/goodslist?id=548",
			// 		bgColor: "#f34646",
			// 		desc: "庆趣新品",
			// 		img: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230525_sOgqlLtBzgb3QBeig8614wICabm6MV.gif",
			// 		sort: 1,
			// 		url: "https://open.ok9288.com/mobile/#/list/548",
			// 		urlCatetory: "商品分类",
			// 		urlName: "庆趣新品",
			// 	},
			// 	{
			// 		appPage: "/pagesD/goodslist/goodslist?id=584",
			// 		appletPage: "/pagesD/goodslist/goodslist?id=584",
			// 		bgColor: "#f34646",
			// 		desc: "男用专场",
			// 		img: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230611_8Hzf6Smx90jAq7SdD6lnFOOGlWjKrY.gif",
			// 		sort: "2",
			// 		url: "https://www.ok9288.com/mobile/#/list/584",
			// 		urlCatetory: "商品分类",
			// 		urlName: "618男用专场",
			// 	},
			// 	{
			// 		appPage: "/pagesD/goodslist/goodslist?id=552",
			// 		appletPage: "/pagesD/goodslist/goodslist?id=552",
			// 		bgColor: "#f34646",
			// 		desc: "爆款低价",
			// 		img: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/HAJDYBclMe42pCC4ItJsY620zTBatK3hEyRB5Fg5.png",
			// 		sort: "3",
			// 		url: "https://open.ok9288.com/mobile/#/list/552",
			// 		urlCatetory: "商品分类",
			// 		urlName: "清仓放利",
			// 	},
			// 	{
			// 		appPage: "/pages/user/user",
			// 		appletPage: "/pages/user/user",
			// 		bgColor: "#f34646",
			// 		desc: "兑换权益",
			// 		img: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20220523_MAfkhf2IETvQOkXQf9uyl1waqDNoct.gif",
			// 		sort: "10",
			// 		url: "https://open.ok9288.com/mobile/#/user",
			// 		urlCatetory: "功能页面",
			// 		urlName: "会员中心",
			// 	},
			// 	{
			// 		appPage: "/pagesD/goodslist/goodslist?id=543",
			// 		appletPage: "/pagesD/goodslist/goodslist?id=543",
			// 		bgColor: "#f34646",
			// 		desc: "热卖推荐",
			// 		img: "https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230525_5hdryrpNxX9oXN4o3mN7wVdeMIyjN5.gif",
			// 		sort: 1,
			// 		url: "https://www.ok9288.com/mobile/#/list/543",
			// 		urlCatetory: "商品分类",
			// 		urlName: "庆趣热卖推荐-每周更新",
			// 	}
			// ]
		}
	},
	components:{
		uniIcons
	},
	created() {
		
	},
	mounted(){
		let _this = this;
		let height = ((uni.getSystemInfoSync().windowWidth-20) * (1/this.showNumber) + 23);
		
		let len = _this.module.list.length;
		if(len > _this.showNumber){
			_this.imgheights = height * 1;
		}else{
			_this.imgheights = height * 1;
		}
	},
	computed: {
		indicatorDots(){
			return this.showStyle == 2 ? false : true
		},
        liStyle() {
            if (this.showStyle == 0) return false
            let nWidth = 100 / this.showNumber
			
            return nWidth + "%"
        },
        bDesc() {
            if (this.showStyle == "1") {
                return this.module.isDescSel == "0" ? true : false
            } else {
                return true
            }
        },
        listStyle() {
			let style = ''
			if(this.showStyle == "0"){
				style = 'list-style1'
			}else if(this.showStyle == "1"){
				style = 'list-style2'
			}else{
				style = 'list-style2 list-style3'
			}
			return style
		},
        showStyle() {
            return this.module.isStyleSel
        },
        showNumber() {
            return this.module.isNumberSel
        },
        aClass() {
            let arr = []
            arr.push(this.listStyle)
			console.log(arr)
            if (this.listStyle == "list-style2") {
				console.log("111")
                this.module.styleSelList.map((v, i) => {
                    switch (v) {
                        case "0":
                            arr.push("whole-margin")
                            break;
                        case "1":
                            arr.push("all-padding")
                            break;
                        case "2":
                            arr.push("all-border")
                            break;
                        default:
                            break;
                    }
                })
            }
            return arr
        },
		isSwiperShow(){
			return this.module.list.length > this.showNumber * 1
		},
		swiperList(){
			console.log(this.module.list)
			var list = this.module.list;
			
			//视频号直播
			/* if(uni.getStorageSync('mediaLive')){
				list.splice(7,0,{
					appPage: "",
					appletPage: "",
					bgColor: "#f34646",
					desc: "视频号",
					img: require('https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705973837517.jpg'),
					sort: 1,
					url: "",
					urlCatetory: "视频号",
					urlName: "视频号",
					media_live: true
				})
			} */
			
			var len = list.length;
			var chunk = this.showNumber*1;
			var result = [];
			var v = len / chunk;
			
			if(this.showStyle == 2 && this.isSwiperShow){
				for(var i = 0; i < len; i += chunk){
					result.push(list.slice(i,i+chunk));
				}
			}
			
			return result
		}
    },
	methods:{
		link(item){
			let page,built
			// #ifdef APP-PLUS
			page = item.appPage ? item.appPage : item.url
			built = item.appPage ? 'app' : 'undefined'
			// #endif
			
			// #ifdef MP-WEIXIN
			page = item.appletPage ? item.appletPage : item.url
			built = item.appletPage ? 'app' : 'undefined'
			// #endif
			
			if(!item.media_live){
				this.$outerHref(page,built)
			}else{
				//视频号正在直播
				uni.openChannelsLive({
					finderUserName:uni.getStorageSync('configData').wxapp_media_id || '',
					feedId:uni.getStorageSync('channelsLive').feedId || '',
					nonceId:uni.getStorageSync('channelsLive').nonceId || '',
				})
			}
		},
		swiperChange(e){
			this.swiperCurrent = e.detail.current
		}
	}
}
</script>

<style>
.nav{ overflow: hidden; position: relative;}
.nav .list{ overflow: hidden; box-sizing: content-box; position: relative; }
.nav .list .icon{ width: 100%; }
.nav .list .icon .image{ width: 100%; height: auto; margin: 0 auto; display: block; }
.nav .list .con{ font-size: 25upx; margin-top: 6upx; height: 40upx; line-height: 40upx;}

.list-style1{ padding: 0 20upx 30upx; }
.list-style1 .list{ border-bottom: 1px solid #e3e8ee; height: 120upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
.list-style1 .list .icon{ width: 100upx; height: 100upx; margin-right: 10upx;}
.list-style1 .list .con{ flex: 1 1 0%; margin-top: 0; font-size: 30upx;}
.list-style1 .list .uni-icon{ width: 40upx;}

.list-style2 .list{ width: 20%; float: left; text-align: center; overflow: hidden;}
.list-style2 .list .uni-icon{ display: none;}
.list-style2.whole-margin{ padding: 20upx 0;}
.list-style2.all-padding .list{ box-sizing: border-box; padding: 10upx; }
.list-style2.all-border .list{ box-sizing: border-box; margin-bottom: -1px; border: 1px solid #e7ecec; border-right: 0;}

/* 新版样式3 */
.dots-container {position: absolute;left: 0;right: 0;bottom: 20upx;display: flex;justify-content: center;}
.dot {width: 30upx;height: 8upx;background: linear-gradient(-88deg, #ff4f2d, #f91f27);opacity: .2;overflow: hidden;}
.dot:first-child{ border-radius: 4upx 0 0 4upx; }
.dot:last-child{ border-radius: 0 4upx 4upx 0; }
.dot.active { opacity: 1; }

.list-style3{ margin: 00upx 20upx 0; padding: 10upx 0 50upx; border-radius: 20upx 20upx 0 0; }
.list-style3 .swiper{ height: 200px;}
</style>
