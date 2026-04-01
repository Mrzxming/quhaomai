<template>
	<view class="container-bwg" style="margin: 0 32rpx;">
		<!-- <view class="app-header-top"> -->
		<!-- <view class="header">
				<view class="input-view">
					<uni-icons type="search" size="20" color="#666666"></uni-icons>
					<input confirm-type="search" class="input" type="text" v-model="keyValue" focus="true"
						:placeholder="placeholder" @input="KeyInput" @confirm="confirm" />
				</view>
				<button type="warn" size="mini" @click="confirm" class="button">{{$t('lang.search')}}</button>
			</view>
			<view class="ms-search-wraper">
				<view class="recent-search" v-if="isIntergWord.length > 0">
					<view class="ms-search-head">
						<text>{{$t('lang.history_search')}}</text>
						<view class="colse" @click="colse">{{$t('lang.eliminate')}}</view>
					</view>
					<view class="ms-search-tags">
						<text class="text uni-ellipsis" v-for="(item,index) in isIntergWord" :key="index"
							@click="searchTag(item)">{{item}}</text>
					</view>
				</view>
				<view class="hot-search">
					<view class="ms-search-head clearfix">{{$t('lang.hot_search')}}</view>
					<view class="ms-search-tags">
						<text class="text uni-ellipsis" v-for="(item,index) in search_keywords" :key="index"
							@click="searchTag(item)">{{ item }}</text>
					</view>
				</view>
			</view> -->
		<!-- 顶部搜索 -->
		<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="status_bar" style="height: 40px;"></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="status_bar"></view>
			<!-- #endif -->
			<view class="input_main" :style="{ height: gaodu + 'px' }">
				<!-- #ifndef MP-WEIXIN -->
				<view @click="navigateBack">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png"
						style="width: 30rpx;height: 30rpx;margin-top: 20rpx;margin-right: 30rpx;">
					</image>
				</view>
				<!-- #endif -->
				<view class="input_view">
					<view style="align-items: center;display: flex;flex-direction: row;">
						<input confirm-type="search" class="input" type="text" v-model="keyValue" focus="true"
							:placeholder="placeholder" @input="KeyInput" @confirm="confirm" />
					</view>
					<view style="align-items: center;display: flex;flex-direction: row;">
						<text class="uni-icon" v-if="showClearIcon" @click="clearInput">&#xe434;</text>
						<!-- #ifndef H5 -->
						<image v-if="!showClearIcon"
							src="https://images.eqingqu.com/attachs/photo/202404/20240413_6F9E9C079D3F2D60F2041C819894FED4.png"
							style="width: 44rpx;height: 44rpx;min-width: 44rpx;" @click="chooseImage">
						</image>
						<!-- #endif -->
						<view class="placeholder_texts" @click="confirm">搜索</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="" style="height: 120rpx;"></view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="" style="height: 220rpx;"></view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="" style="height: 140rpx;"></view>
		<!-- #endif -->
		<view class="" v-if="showClearIcon">
			<!-- 下拉列表 -->
			<scroll-view scroll-y="true">
				<view v-for="(item,index) in textArr" class="isSelect">
					<!-- 	<view :class="`rich-text-border${index === textArr.length - 1 ? ' no-bottom-border' : ''}`" -->
					<view :class="'rich-text-border' + (index === textArr.length - 1 ? ' no-bottom-border' : '')"
						@click="toShopgoods(item)">
						<image src="/static/search/sou.png" mode="widthFix"
							style="width: 32rpx;height: 32rpx;margin-right: 20rpx;min-width: 32rpx;"></image>
						<rich-text :nodes="item.text" class="rich-texts"></rich-text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="ms-search-wraper" v-if="!showClearIcon">
			<!-- 历史搜索 -->
			<view class="" v-if="isIntergWord.length > 0">
				<view class="ms-search-head">
					<text>{{$t('lang.history_search')}}</text>
					<view class="colse" @click="colse">
						<image src="/static/search/del.png" style="width: 40rpx;height: 40rpx;" />
					</view>
				</view>
				<view class="history-tags overexs">
					<text class="text uni-ellipsis" v-for="(item,index) in isIntergWord" :key="index"
						@click="searchTag(item)">{{item}}</text>
				</view>
				<view class="" style="height: 30rpx;"></view>
			</view>
			<!-- 热门搜索 -->
			<view class="">
				<view class="ms-search-head">
					<text>{{$t('lang.hot_search')}}</text>
				</view>
				<view class="history-tags">
					<text class="text uni-ellipsis" v-for="(item,index) in search_keywords" :key="index"
						@click="searchTag(item)">{{ item }}</text>
				</view>
				<view class="" style="height: 20rpx;"></view>
			</view>
			<!-- 推荐商品 -->
			<view class="hot-search">
				<view class="ms-search-head clearfix">
					<text>推荐商品</text>
					<view class="colse" @click="shopGoods">
						<image src="/static/search/shua.png" style="width: 40rpx;height: 40rpx;" />
					</view>
				</view>
				<view class="hot-tags">
					<view class="list" v-for="(item,index) in tui_keywords" :key="index"
						@click="searchTag(item.goods_name )">
						<view class="text uni-ellipsis">
							{{ item.goods_name }}
						</view>
						<view class="" style="" v-show="item.img">
							<image :src="item.img"
								style="width: 32rpx;height: 32rpx; margin-left: 16rpx;margin-top: 10rpx;" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import permision from "@/common/permission.js"
	import createPageTrackMixin from '@/common/mixins/pageTrackMixin.js';
	export default {
		mixins: [createPageTrackMixin('search')],
		components: {
			uniNavBar,
			uniIcons,
			// permision
		},
		data() {
			// 【修复】统一从本地存储读取历史记录，确保两个变量初始值一致
			const storedKeywords = uni.getStorageSync('LatelyKeyword') ? uni.getStorageSync('LatelyKeyword') : [];
			return {
				keyword: '',
				keyValue: '',
				arr: [],
				latelyKeyword: storedKeywords, // 【修复】初始化时也从本地存储读取
				search_keywords: [],
				tui_keywords: [],
				placeholderState: 0,
				placeholder: '输入货源关键字',
				titleNView: false,
				statusBar: false,
				intergWord: storedKeywords, // 【修复】使用统一的初始值
				shopId: 0,
				imageSrc: '',
				inputText: '',
				showClearIcon: false,
				resText: '',
				textArr: [],
				gaodu: '',
				originalHeight: 70,
			};
		},
		// props:{
		// 	intergWord:{
		// 		type:Array,
		// 		default:[]
		// 	}
		// },
		computed: {
			isIntergWord() {
				return this.intergWord
			},
		},
		onReady() {
			var that = this
			uni.getSystemInfo({
				success: function(res) {
					let model = res.model;
					console.log(model)
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (model.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesD/search/search'
			}
		},
		onLoad(e) {
			this.shopId = e.shopId ? e.shopId : 0;
			this.placeholder = e.currentWord ? e.currentWord : this.placeholder;
		},
		created() {
			this.shopConfig();
			this.shopGoods()

			//读取本地缓存
			// uni.getStorage({
			// 	key: 'LatelyKeyword',
			// 	success: (res) => {
			// 		this.latelyKeyword = res.data
			// 		this.placeholder = res.data[0]
			// 		this.placeholderState = 1
			// 	}
			// });
		},
		onShow() {
			// uni.getStorage({
			// 	key: 'LatelyKeyword',
			// 	success: (res) => {
			// 		this.latelyKeyword = res.data
			// 		this.placeholder = res.data[0]
			// 		this.placeholderState = 1
			// 	}
			// });
		},
		methods: {
			// todemo() {
			// 	uni.navigateTo({
			// 		url: '/pages/search/demo'
			// 	})
			// },
			toShopgoods(item) {
				var that = this
				var val = item.text.replace(/<[^>]*>/g, '')
				that.keyword = val
				console.log(123, val)
				if (this.shopId > 0) {
					uni.navigateTo({
						url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + that.keyword +
							'&ru_id=' + this.shopId
					})
				} else {
					uni.navigateTo({
						url: '/pagesD/goodslist/goodslist?keywords=' + that.keyword
					})
				}
				//当前搜索 内容
				let arr = []
				// 【修复】使用 intergWord 读取旧数据，因为它才是从本地存储读取的
				let arr2 = this.intergWord ? [...this.intergWord] : [];

				if (this.keyword) {
					this.placeholder = this.keyword;
					this.placeholderState = 1;

					//和已存在搜索内容组合并去除重复项
					if (arr2) {
						arr2.unshift(this.keyword);
						arr = this.unique(arr2);
					} else {
						arr = [this.keyword];
					}
				}

				if (arr.length > 0) {
					//存本地缓存
					uni.setStorage({
						key: 'LatelyKeyword',
						data: arr,
						success: (res) => {
							// 【修复】同步更新 intergWord 和 latelyKeyword，确保页面显示和历史记录都正确
							this.intergWord = arr;
							this.latelyKeyword = arr;
							if (this.shopId > 0) {
								uni.navigateTo({
									url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this.keyword +
										'&ru_id=' + this.shopId
								})
							} else {
								uni.navigateTo({
									url: '/pagesD/goodslist/goodslist?keywords=' + this.keyword
								})
							}
						}
					})
				}

			},
			clearInput() {
				var that = this
				this.keyValue = ''
				that.showClearIcon = false
			},
			// 扫码搜索
			async chooseImage(val) {
				let that = this
				// #ifndef APP-PLUS
				// 预加载拍照页面
				uni.preloadPage({
					url: '/pagesD/middles/index'
				});
				uni.navigateTo({
					url: '/pagesD/middles/index'
				})
				return;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];
						let size = res.tempFiles[0].size;
						let maxSize = 1024 * 1024 * 2;
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 80,
								success: (result) => {
									console.log("uni.compressImage")
									that.uploadImage(val);
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage(val);
						}
					}
				})
				// #endif
				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA")
				console.log(JSON.stringify(result))
				if (result == 1) {
					// 预加载拍照页面
					uni.preloadPage({
						url: '/pagesD/middles/index'
					});
					uni.navigateTo({
						url: '/pagesD/middles/index'
					})
					return;
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['camera'],
						success: (res) => {
							that.imageSrc = res.tempFilePaths[0];
							let size = res.tempFiles[0].size; //上传图片大小
							let maxSize = 1024 * 1024 * 2; //最大可上传2mb
							if (size > maxSize) {
								uni.compressImage({
									src: res.tempFilePaths[0],
									quality: 80,
									success: (result) => {
										that.uploadImage(val);
									},
									fail: (result) => {
										console.log(result)
									}
								})
							} else {
								that.uploadImage(val);
							}
						}
					})
				}
				// #endif
			},

			async uploadImage(val) {
				let that = this;
				console.log("uni.uploadImage")
				uni.showLoading({
					mask: true,
					title: this.$t('lang.shang_shi')
				});

				//app压缩图片
				// #ifdef APP-PLUS
				that.imageSrc = await compressImage(that.imageSrc);
				// #endif

				pathToBase64(that.imageSrc).then(base64 => {
					that.$store.dispatch('setMaterial', {
						file: {
							content: base64
						},
						type: 'touxian'
					}).then(data => {
						uni.hideLoading()
						if (data.status == 'success') {
							console.log(data.data)
							uni.setStorageSync('imageSrc', data.data[0]);
							uni.navigateTo({
								url: '/pagesC/canvas/canvas'
							})
						} else {
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: '请稍后重试'
							})
						}
					})
				}).catch(error => {
					console.error(error, 5);
				});
			},

			navigateBack() {
				uni.navigateBack({
					delta: 1
				});
				// uni.switchTab({
				// 	url: '/pages/middles/middles',
				// })
			},
			KeyInput(e) {
				var that = this
				this.keyword = e.detail.value;
				if (e.detail.value.length > 0) {
					this.showClearIcon = true
				} else {
					this.showClearIcon = false
				}
				uni.showLoading({
					title: '数据加载中'
				})
				uni.request({
					// url:this.websiteUrl + '/api/shop/config',
					url: 'https://www.ok9288.com/appsuggestions',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					data: {
						keyword: that.keyword,
					},
					success: (res) => {
						uni.hideLoading()
						if (res.data && res.data.length > 0) {
							var aa = res.data.map(item => ({
								text: item
							}));
							this.textArr = JSON.parse(JSON.stringify(aa))
							this.textArr.forEach((item, index) => {
								if (!(item.text.indexOf(this.keyword) == (-1))) {
									this.textArr[index].text = item.text.replace(this.keyword,
										`<span style="color:#FE0302 " >${this.keyword}</span>`)
								}
							})
						}
					}
				});
			},
			searchTag(val) {
				let arr = []
				// 【修复】使用 intergWord 读取旧数据，因为它才是从本地存储读取的
				let arr2 = this.intergWord ? [...this.intergWord] : [];

				if (arr2) {
					arr2.unshift(val);
					arr = this.unique(arr2);
				} else {
					arr = [val];
				}

				if (arr.length > 0) {
					//存本地缓存
					uni.setStorage({
						key: 'LatelyKeyword',
						data: arr,
						success: (res) => {
							// 【修复】同步更新 intergWord 和 latelyKeyword，确保页面显示和历史记录都正确
							this.intergWord = arr;
							this.latelyKeyword = arr;
							if (this.shopId > 0) {
								uni.navigateTo({
									url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + val +
										'&ru_id=' + this.shopId
								})
							} else {
								uni.navigateTo({
									url: '/pagesD/goodslist/goodslist?keywords=' + val
								})
							}
						}
					})
				}
			},
			confirm() {
				// this.keyValue = '';

				this.keyword = this.keyword.replace(/\s*/g, "");

				if (!this.keyword && this.placeholderState == 1) {
					if (this.shopId > 0) {
						uni.navigateTo({
							url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this.placeholder + '&ru_id=' + this
								.shopId
						})
					} else {
						uni.navigateTo({
							url: '/pagesD/goodslist/goodslist?keywords=' + this.placeholder
						})
					}
					return
				}

				//当前搜索 内容
				let arr = []
				// 【修复】使用 intergWord 读取旧数据，因为它才是从本地存储读取的
				let arr2 = this.intergWord ? [...this.intergWord] : [];

				if (this.keyword) {
					this.placeholder = this.keyword;
					this.placeholderState = 1;

					//和已存在搜索内容组合并去除重复项
					if (arr2) {
						arr2.unshift(this.keyword);
						arr = this.unique(arr2);
					} else {
						arr = [this.keyword];
					}
				}

				if (arr.length > 0) {
					//存本地缓存
					uni.setStorage({
						key: 'LatelyKeyword',
						data: arr,
						success: (res) => {
							// 【修复】同步更新 intergWord 和 latelyKeyword，确保页面显示和历史记录都正确
							this.intergWord = arr;
							this.latelyKeyword = arr;
							if (this.shopId > 0) {
								uni.navigateTo({
									url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this.keyword +
										'&ru_id=' + this.shopId
								})
							} else {
								uni.navigateTo({
									url: '/pagesD/goodslist/goodslist?keywords=' + this.keyword
								})
							}
						}
					})
				}
			},
			colse() {
				this.placeholder = '输入货源关键字';
				this.placeholderState = 0;

				//删除本地缓存
				uni.removeStorageSync('LatelyKeyword');
				this.latelyKeyword = [];
				this.intergWord = [];

				this.$emit('onColse');
			},
			shopConfig() {
				uni.request({
					url: this.websiteUrl + '/api/shop/config',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						if (data.hint_keywords) {
							this.search_keywords = data.hint_keywords.split(',')
							// let arr = data.hint_keywords.split(',')
							// this.search_keywords = arr.map(item => {
							// 	if (item === null || item === undefined || item === '') {
							// 		return '输入货源关键字';
							// 	} else {
							// 		return item;
							// 	}
							// })
						}
					}
				});
			},
			shopGoods() {
				uni.request({
					url: this.websiteUrl + '/api/catalog/tui_googslist',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: ({
						data: {
							data
						}
					}) => {
						if (data) {
							this.tui_keywords = data
						}
					}
				});
			},
			unique(arr) {
				//去除重复项
				var result = [],
					hash = {};
				for (var i = 0, elem;
					(elem = arr[i]) != null; i++) {
					if (!hash[elem]) {
						result.push(elem);
						hash[elem] = true;
					}
				}
				return result;
			},
			//历史搜索
			// 	pushHistory() {
			// 		//当前搜索 内容
			// 		let arr = []
			// 		let arr2 = this.latelyKeyword;

			// 		if (this.keyword) {
			// 			this.placeholder = this.keyword;
			// 			this.placeholderState = 1;

			// 			//和已存在搜索内容组合并去除重复项
			// 			if (arr2) {
			// 				arr2.unshift(this.keyword);
			// 				arr = this.unique(arr2);
			// 			}
			// 		}

			// 		if (arr.length > 0) {
			// 			//存本地缓存
			// 			uni.setStorage({
			// 				key: 'LatelyKeyword',
			// 				data: arr,
			// 				success: (res) => {
			// 					if (this.shopId > 0) {
			// 						uni.navigateTo({
			// 							url: '/pagesD/shop/shopGoods/shopGoods?keywords=' + this.keyword +
			// 								'&ru_id=' + this.shopId
			// 						})
			// 					} else {
			// 						uni.navigateTo({
			// 							url: '/pagesD/goodslist/goodslist?keywords=' + this.keyword
			// 						})
			// 					}
			// 				}
			// 			})
			// 		}

			// 	}



		},
		onUnload() {
			// #ifdef APP-PLUS
			// 离开搜索页面时，强制隐藏键盘
			plus.key.hideSoftKeybord();
			// #endif
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		/* #ifdef APP-PLUS */
		min-height: 100vh;  /* 搜索页也固定最小高度 */
		/* #endif */
	}

	.input_main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22rpx 0rpx 36rpx;

		/* #ifdef MP-WEIXIN */
		width: 75%;
		padding: 15rpx 30rpx 10rpx 30rpx;
		margin: 30rpx 30rpx 0 0;
		margin-top: var(--status-bar-height);
		/* #endif */

	}

	.input_view {
		flex: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70rpx;
		padding: 2rpx 4rpx 2rpx 20rpx;
		color: #828282;
		background-color: #fff;
		border: 1rpx solid #C0C0C0;
		border-radius: 20rpx;

		.input {
			width: 380rpx;
		}

		.placeholder_text {
			margin-top: -4rpx;
			font-size: 30rpx;
			margin-left: 20rpx;
			width: 400rpx;
		}

		.placeholder_texts {
			font-size: 28rpx;
			margin-left: 20rpx;
			background-color: #FE0302;
			color: #ffffff;
			border-radius: 14rpx;
			/* #ifdef H5 */
			padding: 8rpx 34rpx;
			/* #endif */
			/* #ifdef APP-PLUS */
			padding: 8rpx 34rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			padding: 6rpx 26rpx;
			/* #endif */
		}
	}

	/*header*/
	.header {
		border-bottom: solid 1px #e6e6e6;
		height: 50px;
		display: flex;
		backdrop-color: #fff;
		padding: 0 10px;
	}

	.header .input-view {
		background-color: #FFFFFF;
		border: 1px solid #e6e6e6;
		margin: 9px 9px 9px 0;
		line-height: 30px;
	}

	.header .button {
		width: 120rpx;
		padding: 0;
		height: 30px;
		margin: 9px 0;
	}

	/*search*/
	.ms-search-wraper {
		position: relative;
	}

	.history-tags {
		// padding-bottom: 30upx;
		max-height: 256rpx;
		overflow: hidden;
	}

	.ms-search-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 32upx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 36rpx;
		color: #2D2D2D;
		line-height: 36rpx;
		text-align: justify;
		font-style: normal;

	}

	.ms-search-head .colse {
		font-size: 25upx;
		color: #f92028;
	}

	.ms-search-tags .text {
		padding: 5upx 25upx;
		display: inline-block;
		background: #f0f2f5;
		border-radius: 8upx;
		font-size: 25upx;
		max-width: 200upx;
		margin: 0 15upx 15upx 0;
	}

	.history-tags .text {
		display: inline-block;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		max-width: 260upx;
		margin: 0 16rpx 0 0;
		border-radius: 32rpx;
		border: 1rpx solid #C0C0C0;
		color: #626262;
		border-radius: 32rpx;
		height: 48rpx;
		line-height: 48rpx;
		padding: 0upx 28upx;
	}

	.hot-tags {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		.list {
			display: flex;
			align-items: center;
			flex-direction: row;
			width: 45%;
			margin-bottom: 20rpx;
		}

		.text {
			max-width: 276rpx;
			height: 48rpx;
			background: linear-gradient(270deg, rgba(249, 249, 249, 0) 0%, #F9F9F9 100%);
			line-height: 48rpx;
			border-radius: 8rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #1B1B1B;
			text-align: left;
			font-style: normal;
			padding: 8rpx 16rpx;
		}
	}

	.isSelect {
		// margin-bottom: 10px;
	}

	.rich-text-border {
		border-top: 1px solid #EDEDED;
		padding: 30rpx 0 34rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		flex-wrap: nowrap;
	}

	.rich-texts {
		word-break: break-all;
		max-height: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.no-bottom-border {
		border-bottom: 1px solid #EDEDED;
		padding: 30rpx 0 34rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		display: flex;
		flex-wrap: nowrap;
	}

	/* 导航栏开始 */
	.main-title {
		position: fixed;
		/* #ifndef MP-WEIXIN */
		top: 0;
		left: 0;
		width: 92%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: -45px;
		left: -18px;
		width: 530PX;
		/* #endif */
		z-index: 120;
		background-color: #ffffff;
		padding: 0 32rpx
	}

	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}

	.overexs {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		autoprefixer: off;
		white-space: normal;
		word-break: break-all;
	}
</style>