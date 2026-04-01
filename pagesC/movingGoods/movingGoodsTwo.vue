<template>
	<view class="user-default">
		<view class="container">
			<view class="main-title">
				<!-- #ifdef MP-WEIXIN -->
				<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<!-- 这里是状态栏 -->
				<view class="status_bar" style="height: 40px;"></view>
				<!-- #endif -->
				<view class="chat_1" :style="{ height: gaodu + 'px' }">
					<view @click="navigateBack">
						<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png" style="width: 30rpx;height: 30rpx;">
						</image>
					</view>

					<view style="margin-top: -20rpx;font-size: 32rpx;margin-left: 20rpx;">商品搬家</view>
					<view class="search_submit">
						<!-- <view style="margin-right: 20rpx;margin-top: -14rpx;" @click="tommoving">
							<image src="https://images.eqingqu.com/attachs/photo/202308/20230823_4B4363E4D16777FC2830D3442DCAE862.png" style="width: 30rpx;height: 30rpx;"></image>
						</view> -->
					</view>
				</view>
				<view class="search_2" :class="revertShow==true?'swiper-boxs':'swiper-box'">
					<view class="search_1">
						<view style="">
							<view style="display: flex;flex-direction: row;align-items: center;">
								<view
									style="display: flex;flex-direction: row;align-items: center;margin-left: -10rpx;">
									<view>
										<radio style="transform:scale(0.6);vertical-align: middle;" color="#FE0302"
											:checked="checkedsxj" @click="cutCheckedsxj"></radio>
									</view>
									<view style="font-size: 24rpx;">下架</view>
								</view>
								<view style="display: flex;flex-direction: row;align-items: center;margin-left: 30rpx;">
									<view>
										<radio style="transform:scale(0.6);vertical-align: middle;" color="#FE0302"
											:checked="checkedsbh" @click="cutCheckedsbh"></radio>
									</view>
									<view style="font-size: 24rpx;">包含商品属性</view>
								</view>
								<view style="display: flex;flex-direction: row;align-items: center;margin-left: 30rpx;">
									<view>
										<radio style="transform:scale(0.6);vertical-align: middle;" color="#FE0302"
											:checked="checkedstc" @click="cutCheckedstc"></radio>
									</view>
									<view style="font-size: 24rpx;">自动填充属性</view>
								</view>
							</view>
							<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-view" >
							<view
								style="display: flex;flex-direction: row;align-items: center;width: 130%;margin-top: -4rpx;margin-bottom: 10rpx;">
								<view style="width: 18%;font-size: 24rpx;">价格倍数：</view>
								<!-- <scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-view" > -->
								<view style="margin-left: -50rpx;width: 10%;">
									<view class="scroll-item" v-for="(item, index) in list" :key="index"
										@click="changeMenu(index)">
										<view class="item-text" :class="curIndex == index? 'active' : ''">
											<view style="font-size: 24rpx;">{{item.name}}</view>
										</view>
									</view>
								</view>
								<!-- </scroll-view> -->
							</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view style="margin-top: 260rpx;background-color: #ffffff;"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view style="margin-top: 250rpx;background-color: #ffffff;"></view>
			<!-- #endif -->
			<view v-if="syncList.length > 0" :class="revertShow==true?'swiper-boxs':'swiper-box'">
				<view class="card-goods">
					<view class="card-goods-group" v-for="(item,listIndex) in syncList" :key="listIndex">
						<view style="height: 20rpx;background-color: #f8f8f8;margin-left: -50rpx;width: 120%;"></view>
						<view class="scroll-view-item scroll-view-item-left">
							<view class="uni-flex">
								<view class="checkbox-con" style="flex: 1 1 0%;">
									<view class="cart-goods-info">
										<view class="goods-img">
											<image :src="item.goods_img" class="image">
											</image>
										</view>
										<view class="cart-goods-content">
											<view class="goods-title twolist-hidden"
												style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
												<view class="goodsTitles" style="width: 85%;">{{item.goods_name}}</view>
												<view @click="toshowname(item,listIndex)">
													<image
														src="https://images.eqingqu.com/attachs/photo/202308/20230826_7D58C4D6A759D6D54D71BEC95F19FE85.png"
														style="width: 36rpx;height: 36rpx;"></image>
												</view>
											</view>
											<view
												style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: -10rpx;">
												<view class="goods-attr twolist-hidden" v-if="item.goods_attr">{{item.goods_attr}}</view>
												<view class="oper">
													<view style="color: #999999;font-size: 22rpx;">
														共{{item.goods_number}}件</view>
												</view>
											</view>
											<view class="price">￥{{item.goods_prices}}</view>
										</view>
									</view>
									<view
										style="display: flex;flex-direction: row;margin-top: 0rpx;align-items: center;">
										<view style="width: 12%;font-size: 24rpx;">类目：</view>
										<view
											style="display: flex;flex-direction: row;justify-content: space-between;width: 88%;">
											<view class="class_fx" @click="toSelect_1(listIndex)">
												<view class="moving_1">{{item.category1}}</view>
												<view style="margin-top: -10rpx;">
													<image
														src="https://images.eqingqu.com/attachs/photo/202308/20230825_A59DFBEC5F1E4BAEC5C31A31293767BC.png"
														style="width: 20rpx;height: 10rpx;"></image>
												</view>
											</view>
											<view class="class_fx" @click="toSelect_1(listIndex)"
												v-if="item.category2!='无'">
												<view class="moving_1">{{item.category2}}</view>
												<view style="margin-top: -10rpx;">
													<image
														src="https://images.eqingqu.com/attachs/photo/202308/20230825_A59DFBEC5F1E4BAEC5C31A31293767BC.png"
														style="width: 20rpx;height: 10rpx;"></image>
												</view>
											</view>
											<view class="class_fx" v-else>
												<view class="moving_1">{{item.category2}}</view>
												<view style="margin-top: -10rpx;">
													<!-- <image
														src="https://images.eqingqu.com/attachs/photo/202308/20230825_A59DFBEC5F1E4BAEC5C31A31293767BC.png"
														style="width: 20rpx;height: 10rpx;"></image> -->
												</view>
											</view>
											<view class="class_fx" @click="toSelect_1(listIndex)"
												v-if="item.category3!='无'">
												<view class="moving_1">{{item.category3}}</view>
												<view style="margin-top: -10rpx;">
													<image
														src="https://images.eqingqu.com/attachs/photo/202308/20230825_A59DFBEC5F1E4BAEC5C31A31293767BC.png"
														style="width: 20rpx;height: 10rpx;"></image>
												</view>
											</view>
											<view class="class_fx" v-else>
												<view class="moving_1">{{item.category3}}</view>
												<view style="margin-top: -10rpx;">
													<!-- <image
														src="https://images.eqingqu.com/attachs/photo/202308/20230825_A59DFBEC5F1E4BAEC5C31A31293767BC.png"
														style="width: 20rpx;height: 10rpx;"></image> -->
												</view>
											</view>
										</view>
									</view>
									<view
										style="display: flex;flex-direction: row;margin-top: 20rpx;align-items: center;">
										<view style="width: 12%;font-size: 24rpx;">UPC：</view>
										<input
											style="width: 53%;border: 2rpx solid #C0C0C0;padding: 4rpx 14rpx;border-radius: 10rpx;line-height: 44rpx;height: 44rpx;"
											placeholder="请输入UPC码(商品上13位数字条形码)" placeholder-style="font-size: 22rpx;color: #C0C0C0;" :value="item.upc" @input="upcinput($event,listIndex)" />
									</view>
									<view
										style="display: flex;flex-direction: row;margin-top: 20rpx;align-items: center;"
										@click="toSelect_4(listIndex)" v-if="curIndex_of!=1">
										<view style="width: 12%;font-size: 24rpx;">分类：</view>
										<view
											style="width: 83%;border: 2rpx solid #C0C0C0;padding: 4rpx 14rpx;border-radius: 10rpx;line-height: 54rpx;height: 54rpx;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
											<view style="font-size: 24rpx;color: #FE0302;">{{item.sort_value}}</view>
											<view style="margin-top: -10rpx;">
												<image
													src="https://images.eqingqu.com/attachs/photo/202308/20230825_95B3E744F84C14AB8CA38B0DA3EC6996.png"
													style="width: 20rpx;height: 10rpx;"></image>
											</view>
										</view>
									</view>
									<view style="float: right;margin-top: 30rpx;"
										@click="deleteCartGoods(item,listIndex)">
										<view
											style="border: 2rpx solid #979797;color: #000000;padding: 4rpx 54rpx;border-radius: 10rpx;">
											删除</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 240rpx;"></view>
				<view class="cart-submit">
					<view style="width: 100%;padding: 10rpx;">
						<view class="btn-bar">
							<button class="btn btn-red" style="font-size: 32rpx;" @click="onSubmit">开始同步</button>
						</view>
					</view>
				</view>
			</view>
			<view class="flow-no-cart" v-else :class="revertShow==true?'swiper-boxs':'swiper-box'">
				<dsc-not-content></dsc-not-content>
			</view>

			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

			<!--返回顶部-->
			<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>

			<!-- 遮罩层 -->
			<view v-if="revertShow">
				<view class="cover" @click="revertShowNo" catchtouchmove="true"></view>
				<view class="wxshare">
					<view style="margin: 10rpx 30rpx 30rpx 30rpx;">
						<view style="margin-bottom: 20rpx;" :class="[isDefine == 1 ? 'darking' : 'graying']"
							@click="isChange">同步记录</view>
						<view style="margin-bottom: 20rpx;" :class="[isDefine == 2 ? 'darking' : 'graying']"
							@click="isChanges">同步教程</view>
					</view>
				</view>
			</view>

			<!-- 商品名称编辑 -->
			<view v-if="movingname_show">
				<view class="cover_1" @click="movingname_showNo" catchtouchmove="true"></view>
				<view class="wxshare_1">
					<view class="wxshare_3_1">商品名称编辑</view>
					<view
						style="padding: 20rpx 30rpx;border-radius: 10rpx;height: 200rpx;font-size: 26rpx;text-align: left;">
						<textarea @input="toInput" :value="movingname"
							style="width: 100%;font-size: 26rpx;height: 200rpx;" maxlength="100"
							placeholder-style="color:#999999;font-size: 26rpx;width: 100%;" placeholder="请编辑商品名称。" />
					</view>
					<view style="display: flex;flex-direction: row;align-items: center;margin-top: 100rpx;">
						<view class="add_box3_1_a" @click="movingname_showNo">取消</view>
						<view class="add_box3_a" @click="movingname_showYes">确定</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品属性弹框 start -->
		<uni-popup1 ref="unipopup1" type="bottom">
			<view class="pop_content">
				<view class="popss_1">
					<view>选择商品类目一</view>
					<view style="font-size: 30rpx;" @click="toPopupsClose_1">关闭</view>
				</view>
				<scroll-view scroll-y :style="{height: `${popHeight.center}px`}">
					<view v-for="(item,index) in path_1" :key="index" style="width: 100%;">
						<tui-list-cell padding="0" :arrow="true" @click="toSelect_2(item)">
							<view class="tui-list-cell_popsss">
								<view class="tui-content_pop">{{item.cat_name}}</view>
							</view>
						</tui-list-cell>
					</view>
					<!-- <view style="height: 50rpx;"></view> -->
				</scroll-view>
			</view>
		</uni-popup1>
		<uni-popup2 ref="unipopup2" type="bottom">
			<view class="pop_content">
				<view class="popss_1">
					<view>选择商品类目二</view>
					<view style="font-size: 30rpx;" @click="toPopupsClose_2">关闭</view>
				</view>
				<scroll-view scroll-y :style="{height: `${popHeight.center}px`}">
					<view v-for="(item,index) in path_2" :key="index" style="width: 100%;">
						<tui-list-cell padding="0" :arrow="true" @click="toSelect_3(item)">
							<view class="tui-list-cell_popsss">
								<view class="tui-content_pop">{{item.cat_name}}</view>
							</view>
						</tui-list-cell>
					</view>
					<!-- <view style="height: 50rpx;"></view> -->
				</scroll-view>
			</view>
		</uni-popup2>
		<uni-popup3 ref="unipopup3" type="bottom">
			<view class="pop_content">
				<view class="popss_1">
					<view>选择商品类目三</view>
					<view style="font-size: 30rpx;" @click="toPopupsClose_3">关闭</view>
				</view>
				<scroll-view scroll-y :style="{height: `${popHeight.center}px`}">
					<view v-for="(item,index) in path_3" :key="index" style="width: 100%;">
						<tui-list-cell padding="0" :arrow="true" @click="toSelect_of(item)">
							<view class="tui-list-cell_popsss">
								<view class="tui-content_pop">{{item.cat_name}}</view>
							</view>
						</tui-list-cell>
					</view>
					<!-- <view style="height: 50rpx;"></view> -->
				</scroll-view>
			</view>
		</uni-popup3>
		<uni-popup4 ref="unipopup4" type="bottom">
			<view class="pop_content">
				<view class="popss_1">
					<view>选择分类</view>
					<view style="font-size: 30rpx;" @click="toPopupsClose_4">关闭</view>
				</view>
				<view v-if="sortList.length > 0">
					<scroll-view scroll-y :style="{height: `${popHeight.center}px`}">
						<view v-for="(item,index) in sortList" :key="index" style="width: 100%;">
							<tui-list-cell padding="0" :arrow="true" @click="getsort_name_of(item)">
								<view class="tui-list-cell_popsss">
									<view class="tui-content_pop">{{item.value}}</view>
								</view>
							</tui-list-cell>
						</view>
						<!-- <view style="height: 50rpx;"></view> -->
					</scroll-view>
				</view>
				<view v-else>
					<dsc-not-content></dsc-not-content>
				</view>
			</view>
		</uni-popup4>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniPopup1 from '@/components/ming-popsss.vue';
	import uniPopup2 from '@/components/ming-popsss';
	import uniPopup3 from '@/components/ming-popsss.vue';
	import uniPopup4 from '@/components/ming-popsss.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	import universal from '@/common/mixins/universal.js';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import tuiListCell from '@/components/list-cell/list-cell.vue';

	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	export default {
		components: {
			dscNotContent,
			uniIcons,
			uniPopup,
			uniPopup1,
			uniPopup2,
			uniPopup3,
			uniPopup4,
			uniLoadMore,
			dscFilterTop,
			uniPopups,
			tuiListCell
		},
		data() {
			return {
				syncList: [],
				loading: false,
				dscLoading: false,
				page: 1,
				size: 10,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				scrollState: false,
				menuButtonInfo: {},

				isIpx: false,

				gaodu: '',

				revertShow: false,
				isDefine: 1,
				list: [{
						name: '100%',
						num: 100
					},
					{
						name: '120%',
						num: 120
					},
					{
						name: '140%',
						num: 140
					},
					{
						name: '160%',
						num: 160
					},
					{
						name: '180%',
						num: 180
					},
					{
						name: '200%',
						num: 200
					},{
						name: '300%',
						num: 300
					},{
						name: '400%',
						num: 400
					},{
						name: '500%',
						num: 500
					}
				],
				curIndex: 0,
				curIndexnum: 100,
				curIndex_of: '',
				checkedsxj: true,
				checkedsbh: true,
				checkedstc: true,
				// upcvalue: '',
				movingname: '',
				movingname_show: false,
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},

				path_1: [],
				path_2: [],
				path_3: [],
				sortList: [],
				path_1_name: '',
				path_2_name: '',
				path_3_name: '',
				path_1_id: '',
				path_2_id: '',
				path_3_id: '',
				sort_1_id: '',
				path_index1: '',
			};
		},
		onReady() {
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.8));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.8) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.8) - uni.upx2px(190));
		},
		onReachBottom() {
			var that = this
			console.log("1111111111111111111111")
			// that.loadMoreStatus = 'loading';
			// if (that.page * that.size == that.goodsGuessList.length) {
			// 	that.page++
			// 	that.goodsGuessHandle()
			// } else {
			// 	that.loadMoreStatus = "noMore"
			// }
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			// let to_scroll_top = e.scrollTop + 20

			// uni.createSelectorQuery().select('.goods-detail-guess').boundingClientRect((res) => {
			// 	let a = uni.getSystemInfoSync()
			// 	let t_height = res.height - a.screenHeight

			// 	if (t_height <= to_scroll_top) {
			// 		that.loadMoreStatus = 'loading';
			// 		if (that.page * that.size == that.goodsGuessList.length) {
			// 			console.log("这里")
			// 			that.page++
			// 			that.goodsGuessHandle()
			// 		}
			// 	}
			// }).exec()
		},
		methods: {
			toSelect_1: function(index) {
				var that = this;
				that.path_index1 = index
				console.log(uni.getStorageSync('curIndex'))
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				uni.request({
					url: that.websiteUrl + '/api/sync/get_cat_list',
					method: 'POST',
					data: {
						"type": uni.getStorageSync('curIndex')
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							that.path_1 = res.data.data.cateList
							that.$refs.unipopup1.show()
							uni.hideLoading()
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			toSelect_2: function(item) {
				var that = this;
				that.path_1_name = item.cat_name
				that.path_1_id = item.cat_id
				that.syncList[that.path_index1].category1 = that.path_1_name
				that.syncList[that.path_index1].cate_id = item.cat_id
				that.syncList[that.path_index1].cate_name = item.cat_name
				if (that.path_1_name != '') {
					that.getPath_2();
					that.$refs.unipopup1.close();
				} else {
					uni.showToast({
						title: '请选择上一层类目',
						icon: "none"
					})
				}
			},
			toSelect_3: function(item) {
				var that = this;
				that.path_2_name = item.cat_name
				that.path_2_id = item.cat_id
				that.syncList[that.path_index1].category2 = that.path_2_name
				that.syncList[that.path_index1].cate_id = item.cat_id
				that.syncList[that.path_index1].cate_name = that.syncList[that.path_index1].cate_name + '->' + item
					.cat_name
				if (that.path_2_name != '') {
					that.getPath_3()
					that.$refs.unipopup2.close();
				} else {
					uni.showToast({
						title: '请选择上一层类目',
						icon: "none"
					})
				}
			},
			toSelect_of: function(item) {
				var that = this;
				that.path_3_name = item.cat_name
				that.path_3_id = item.cat_id
				that.syncList[that.path_index1].category3 = that.path_3_name
				that.syncList[that.path_index1].cate_id = item.cat_id
				that.syncList[that.path_index1].cate_name = that.syncList[that.path_index1].cate_name + '->' + item
					.cat_name
				that.$refs.unipopup3.close();
			},
			toSelect_4: function(index) {
				var that = this;
				that.path_index1 = index
				console.log(uni.getStorageSync('curIndex'))
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				uni.request({
					url: that.websiteUrl + '/api/sync/get_cat_list',
					method: 'POST',
					data: {
						"type": uni.getStorageSync('curIndex')
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							that.sortList = res.data.data.retailcatList
							that.$refs.unipopup4.show()
							uni.hideLoading()
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none',
								duration:5000
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getsort_name_of: function(item) {
				var that = this;
				console.log(item)
				console.log(that.path_index1)
				console.log(that.syncList[that.path_index1].sort_value)
				that.syncList[that.path_index1].sort_value = item.value
				that.syncList[that.path_index1].shop_cate_id = item.name
				that.syncList[that.path_index1].shop_cate_name = item.value
				that.$refs.unipopup4.close();
			},
			toPopupsClose_1: function() {
				var that = this;
				that.syncList[that.path_index1].category1 = '请选择类目1'
				that.syncList[that.path_index1].category2 = '请选择类目2'
				that.syncList[that.path_index1].category3 = '请选择类目3'
				that.syncList[that.path_index1].cate_id = ''
				that.syncList[that.path_index1].cate_name = ''
				that.$refs.unipopup1.close();
			},

			toPopupsClose_2: function() {
				var that = this;
				that.syncList[that.path_index1].category1 = '请选择类目1'
				that.syncList[that.path_index1].category2 = '请选择类目2'
				that.syncList[that.path_index1].category3 = '请选择类目3'
				that.syncList[that.path_index1].cate_id = ''
				that.syncList[that.path_index1].cate_name = ''
				that.$refs.unipopup2.close();
			},

			toPopupsClose_3: function() {
				var that = this;
				that.syncList[that.path_index1].category1 = '请选择类目1'
				that.syncList[that.path_index1].category2 = '请选择类目2'
				that.syncList[that.path_index1].category3 = '请选择类目3'
				that.syncList[that.path_index1].cate_id = ''
				that.syncList[that.path_index1].cate_name = ''
				that.$refs.unipopup3.close();
			},
			toPopupsClose_4: function() {
				var that = this;
				that.$refs.unipopup4.close();
			},
			getPath_2: function() {
				var that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				uni.request({
					url: that.websiteUrl + '/api/sync/get_cat_children_list',
					method: 'POST',
					data: {
						"type": uni.getStorageSync('curIndex'),
						"cat_id": that.path_1_id,
						"cat_type": 2
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							if (res.data.data.length > 0) {
								that.path_2 = res.data.data
								that.$refs.unipopup2.show();
							} else {
								that.$refs.unipopup2.close()
								that.syncList[that.path_index1].category2 = '无'
								that.syncList[that.path_index1].category3 = '无'
							}

							uni.hideLoading()
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getPath_3: function() {
				var that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				uni.request({
					url: that.websiteUrl + '/api/sync/get_cat_children_list',
					method: 'POST',
					data: {
						"type": uni.getStorageSync('curIndex'),
						"cat_id": that.path_2_id,
						"cat_type": 3
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							if (res.data.data.length > 0) {
								that.path_3 = res.data.data
								that.$refs.unipopup3.show();
							} else {
								that.$refs.unipopup3.close()
								that.syncList[that.path_index1].category3 = '无'
							}
							uni.hideLoading()
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			movingname_showYes: function() {
				var that = this
				that.movingname_show = false
				that.syncList[that.path_index1].goods_name = that.movingname
			},

			movingname_showNo: function() {
				var that = this
				that.movingname = ''
				that.movingname_show = false
			},
			toshowname: function(item, index) {
				var that = this
				that.movingname = item.goods_name
				that.path_index1 = index
				that.movingname_show = true
			},
			toInput: function(e) {
				var that = this
				that.movingname = e.detail.value
			},
			upcinput: function(e,index) {
				var that = this
				// that.upcvalue = e.detail.value
				that.syncList[index].upc = e.detail.value
			},
			cutCheckedsxj: function() {
				var that = this
				if (that.checkedsxj == false) {
					that.checkedsxj = true
				} else {
					that.checkedsxj = false
				}
			},
			cutCheckedsbh: function() {
				var that = this
				if (that.checkedsbh == false) {
					that.checkedsbh = true
				} else {
					that.checkedsbh = false
				}
			},
			cutCheckedstc: function() {
				var that = this
				if (that.checkedstc == false) {
					that.checkedstc = true
				} else {
					that.checkedstc = false
				}
			},
			changeMenu(index) {
				this.curIndex = index;
				this.curIndexnum = this.list[index].num;
				for (var i = 0; i < this.syncList.length; i++) {
					this.syncList[i].goods_prices = (this.syncList[i].goods_price * (this.curIndexnum / 100)).toFixed(2)
				}
			},
			isChange: function() {
				var that = this
				//当视图渲染结束 重新设置为0
				that.page = 1
				//当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				setTimeout(function() {
					that.isDefine = 1
					that.revertShow = false
				}, 100);

			},
			isChanges: function() {
				var that = this
				that.page = 1
				// //当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				setTimeout(function() {
					that.isDefine = 2
					that.revertShow = false
				}, 100);

			},
			tommoving: function() {
				var that = this
				that.revertShow = true
			},
			navigateBack: function() {
				uni.navigateBack()
			},
			tommovingrecord: function() {
				uni.navigateTo({
					url: '/pagesC/movingGoods/movingrecord'
				})
			},
			revertShowNo: function() {
				var that = this
				that.revertShow = false
				// uni.navigateBack()
			},
			revertShowYes: function() {
				var that = this
				that.revertShow = false
				// uni.request({
				// 	url: that.websiteUrl + '/api/sync/bind_app',
				// 	method: 'POST',
				// 	data: {
				// 		"mobile":that.mobile,
				// 		"code":that.validate_code
				// 	},
				// 	header: {
				// 		'Content-Type': 'application/json',
				// 		'token': uni.getStorageSync('token'),
				// 		'X-Client-Hash': uni.getStorageSync('client_hash')
				// 	},
				// 	success: (res) => {
				// 		console.log(res.data)
				// 		if(res.data.status == 'success'){
				// 		} else {
				// 			uni.showToast({
				// 				title:res.data.errors.message,
				// 				icon:'none'
				// 			})
				// 		}
				// 	},
				// 	fail: (err) => {
				// 		console.error(err)
				// 	}
				// })
			},
			initData() {
				var that = this
				setTimeout(() => {
					that.goodsList();
					uni.stopPullDownRefresh();
				}, 10);
			},

			goodsList() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/up_goods_list',
					method: 'POST',
					data: {
						"product_id": uni.getStorageSync('goodsids'),
						"order_id": uni.getStorageSync('orderids'),
						"goods_attr_id": uni.getStorageSync('goodsattrids')
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('up_goods_list',res.data)
						uni.hideLoading()
						if (res.data.status == 'success') {
							for (var i = 0; i < res.data.data.length; i++) {
								res.data.data[i].category1 = '请选择类目1'
								res.data.data[i].category2 = '请选择类目2'
								res.data.data[i].category3 = '请选择类目3'
								res.data.data[i].sort_value = '请选择分类'
								res.data.data[i].cate_id = ''
								res.data.data[i].goods_prices = res.data.data[i].goods_price
								res.data.data[i].cate_name = ''
							}
							that.syncList = res.data.data
							console.log(444,this.syncList);
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},

			//删除购物车商品
			deleteCartGoods(item, index) {
				let that = this

				uni.showModal({
					content: that.$t('lang.confirm_delete_goods'),
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
							});
							that.syncList.splice(index, 1)
							console.log(that.syncList)
							uni.hideLoading()
							// that.$store.dispatch('setCartGoodsDelete', {
							// 	rec_id: val
							// }).then(res => {
							// 	if (res.error == 0) {
							// 		uni.hideLoading()
							// 		uni.showToast({
							// 			title: that.$t('lang.delete_success'),
							// 			icon: 'success'
							// 		})
							// 		that.goodsList();
							// 		that.changeGoods();
							// 	} else {
							// 		uni.showToast({
							// 			title: that.$t('lang.delete_fail'),
							// 			icon: 'fail'
							// 		})
							// 	}
							// })
						}
					}
				})
			},

			//提交购物车到结算页面
			onSubmit() {
				var that = this

				uni.showLoading({
					title: '同步中~',
					mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
				});
				for (var i = 0; i < that.syncList.length; i++) {
					that.syncList[i].goods_price = that.syncList[i].goods_prices
				}
				var data = {
					type: that.curIndex_of, // 1庆趣 2美团 3饿了么
					attr: that.checkedsbh, // 是否包含商品属性
					attr_fill: that.checkedstc, // 是否自动填充属性
					discount: that.curIndexnum, // 价格倍数，最低100
					product_list: that.syncList, // 商品列表见下面格式
					is_onsale: that.checkedsxj, // 默认0下架、 1上架
				}

				console.log(555,data)
				console.log(7777,data.product_list);
				uni.request({
					url: that.websiteUrl + '/api/sync/start_up',
					method: 'POST',
					data: {
						type: that.curIndex_of, // 1庆趣 2美团 3饿了么
						attr: that.checkedsbh, // 是否包含商品属性
						attr_fill: that.checkedstc, // 是否自动填充属性
						discount: that.curIndexnum, // 价格倍数，最低100
						product_list: JSON.stringify(that.syncList), // 商品列表见下面格式
						is_onsale: that.checkedsxj, // 默认0下架、 1上架
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(888,res)
						uni.hideLoading()
						if (res.data.status == 'success') {
							uni.showToast({
								title: res.data.data.err_msg,
								icon: 'none'
							})
							setTimeout(function() {
								// uni.navigateBack()
								uni.switchTab({
									url: '/pages/user/user'
								})
							}, 500);
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			}
		},
		onPullDownRefresh() {
			var that = this
			uni.showLoading({
				title: '加载中~',
				mask: true //是否显示透明蒙层，防止触摸穿透，默认：false
			});
			that.initData();
		},

		onLoad(e) {
			let that = this
			// #ifdef MP-WEIXIN
			that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif

			// 判断为 iPhone X 给予底部距离
			uni.getSystemInfo({
				success: function(res) {
					let modelmes = res.model;
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (modelmes.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})

			console.log(uni.getStorageSync('goodsids'))
			console.log(uni.getStorageSync('orderids'))
			console.log(uni.getStorageSync('curIndex'))
			console.log(uni.getStorageSync('goodsattrids'))
			that.curIndex_of = uni.getStorageSync('curIndex')
			that.goodsList();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		width: 100%;
		height: 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		/* max-width: 640px; */
		/* margin: 0 auto; */
	}

	::-webkit-scrollbar {
		display: none;
	}

	.card-goods-group {
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		padding: 0 0 20upx;
		justify-content: space-between;
	}

	.card-shop-head .head-left,
	.card-shop-head .head-right {
		display: flex;
		flex-direction: row;
	}


	.checkbox-icon .uni-icon {
		display: block;
	}

	.card-shop-box {}

	.card-act-goods {
		display: flex;
		flex-direction: column;
		margin-bottom: 20upx;
	}

	.card-act-goods:last-child {
		margin-bottom: 0;
	}

	.cart-act-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 20upx 60upx;
	}

	.cart-act-title .txt {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #333333;
	}

	.cart-act-title .txt .em-icon {
		margin-right: 20upx;
	}

	.cart-act-title .txt .act-name view {
		font-size: 25upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cart-act-title .more {
		display: flex;
		flex-direction: row;
		color: #f92028;
		align-items: center;
	}

	.cart-goods-item {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		width: 100%;
	}

	.cart-goods-item .checkbox-con {
		// border-bottom: 1px solid #E5E5E5;
	}

	.cart-goods-item:last-child .checkbox-con {
		border-bottom: 0;
	}

	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
	}

	.cart-goods-info .goods-img {
		border: 1rpx solid #ececec;
		width: 120upx;
		height: 120upx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 120upx;
		height: 120upx;
	}

	.cart-goods-info .goods-img .icon {
		position: absolute;
		width: 80upx;
		height: 80upx;
		top: 0;
		left: 0;
	}

	.cart-goods-info .goods-img .icon image {
		width: 100%;
		height: 100%;
	}

	.cart-goods-info .goods-img .mask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		z-index: 99;
		background: rgba(0, 0, 0, .7);
	}

	.cart-goods-info .goods-img .mash-text {
		width: 100%;
		color: #fff;
		text-align: center;
		z-index: 100;
		position: absolute;
		top: 0;
		bottom: 0;
		line-height: 180upx;
	}

	.cart-goods-item-outer .cart-goods-info {
		background: #fff9f8;
	}

	.cart-goods-item-outer .checkbox-con {
		padding-left: 60upx;
	}

	.cart-goods-content {
		flex: 1 1 0%;
		margin-left: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cart-goods-content .goods-title {
		font-size: 28upx;
		margin-bottom: 10upx;
	}

	.cart-goods-content .goods-attr {
		color: #999999;
		font-size: 25upx;
	}

	.cart-goods-content .goods-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.price {
		color: #f92028;
	}

	.cart-goods-content .goods-info .stepper_sum {
		color: #999999;
	}

	.cart-goods-content .goods-other {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 15upx;
		position: relative;
	}

	.cart-goods-content .goods-other .em-icon {
		padding: 0 3px;
		margin-right: 2px;
	}

	.cart-goods-content .goods-other .act-name {
		width: calc(100% - 45px);
		font-size: 25upx;
		color: #999999;
	}

	.cart-goods-content .goods-other .uni-icon {
		position: absolute;
		right: 0;
		top: 2px;
	}

	.scroll-view-G {
		display: flex;
		align-items: center;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.scroll-view-item-right {
		width: 20%;
		margin-left: 10px;
		height: 100%;
		line-height: 100%;
		text-align: center;
		background: #f92028;
		color: #FFFFFF;
		position: relative;
	}

	.scroll-view-item-right view {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.em-icon {
		width: 25px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		color: #FFFFFF;
		background: #f92028;
		font-size: 22upx;
		text-align: center;
	}

	.em-icon.active-zeng {
		background-color: #9251e5;
	}

	.em-icon.active-zhekou {
		background-color: #fc9b1f;
	}

	.cart-submit {
		width: 100%;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		align-items: center;
		border-top: 1px solid #e3e8ee;
		box-shadow: 2px 2px 5px #e3e8ee;
		border-radius: 50rpx 50rpx 0 0;
	}

	.cart-submit .checkall {
		padding: 0 20upx;

	}

	.cart-submit .checkall .checkbox .checkbox-icon {
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text {
		text-align: right;
		width: 100%;
		margin-right: 20upx;
	}

	.cart-submit .submit-bar-text view {
		line-height: 1.5;
	}

	.cart-submit .submit-bar-text text {
		margin-right: 10upx;
	}

	.cart-submit .submit-bar-price {
		display: inline-block;
		color: #f92028;
		font-weight: 500;
		font-size: 32upx;
	}

	.cart-submit .submit-bar-sub {
		font-size: 25upx;
		color: #999999;
	}

	.flow-no-cart {
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 10upx;
		text-align: center;
		overflow: hidden;
	}

	.flow-no-cart .gwc-bg {
		display: flex;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		background: #fcfcfc;
		justify-content: center;
		align-items: center;
		border: 1px solid #d9d9d9;
		margin: 40px auto 20px;
	}

	.flow-no-cart .gwc-bg .iconfont {
		font-size: 40px;
		color: #d9d9d9;
	}

	.flow-no-cart text {
		color: #333333;
		font-size: 30upx;
	}

	.flow-no-cart .card-btn {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 20px 0 40px;
	}

	.flow-no-cart .card-btn button {
		margin: 0 5px;
		border-color: #d9d9d9;
		font-size: 16px;
	}

	.goods-detail-guess {
		// padding-bottom: 120upx;
		background-color: #f5f5f5;
	}

	.act-item-right {
		display: flex;
		flex-direction: row;
		align-content: center;
		padding: 10upx 20upx 10upx 0;
	}

	.act-item-right .em-icon {
		margin-right: 20upx;
	}

	.act-item-right .act-name {
		font-size: 25upx;
		color: #999999;
	}

	.activity-popup .cart-goods-item {
		min-height: initial;
	}

	.goods-store {
		background: #FFFFFF;
		padding: 10upx 0;
		text-align: right;
		font-size: 25upx;
	}

	.shop-store-cart {
		padding: 0 20rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.shop-store-cart .store-btn {
		border: 1px solid #f42424;
		color: #f42424;
		line-height: normal;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10upx 20upx;
	}

	.shop-store-cart .store-btn .iconfont {
		vertical-align: top;
		margin: -16upx 10upx 0 0;
	}

	/* #ifdef APP-PLUS */
	.app-header-top {
		padding-top: 80upx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.app-header-top {
		padding-top: calc(var(--status-bar-height) - 20rpx + 44px);
	}

	/* #endif */

	/*loading*/
	.loading-transparent {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}

	.loading-transparent ::v-deep .uni-load-more {
		z-index: 999;
		top: 50%;
		left: 50%;
		position: absolute;
		margin: -20px 0 0 -20px;
		width: 40px;
	}

	.loading-transparent .loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
	}

	.cart-submit .btn-bar {
		margin: 30rpx;
		border-radius: 50rpx;
	}

	.cart-submit .btn-bar .btn-disabled {
		background: linear-gradient(178deg, #f91f28, #ff4f2e);
		border-radius: 50rpx;
		opacity: .5;
		color: #fff;
	}

	.cart-submit .btn-bar .btn-red {
		background: linear-gradient(178deg, #fc0017, #fc0017);
		border-radius: 50rpx;
		color: #fff;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	uni-swipe-action {
		margin-bottom: 10px;
	}

	.uni-swipe_text--center {
		margin-right: 10px;
	}







	.product-list-lie {
		// margin-bottom: 150rpx;
	}


	/*新版样式*/
	.product-new {
		margin: 20rpx 20rpx 0;
		background-color: #f5f5f5;
		/* min-height: 500rpx; */
	}

	.product-new .tabs {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}

	.product-new .tabs .item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		line-height: 1.5;
		height: 100%;
	}

	.product-new .tabs .item .tit {
		font-size: 30rpx;
		color: #333;
	}

	.product-new .tabs .item .txt {
		display: inline-block;
		font-size: 25rpx;
		color: #888;
		border-radius: 20rpx;
		padding: 2rpx 16rpx;
		margin-top: 8rpx;
	}

	.product-new .tabs .item.active .tit {
		font-weight: 700;
	}

	.product-new .tabs .item.active .txt {
		background: linear-gradient(-88deg, rgba(255, 79, 46, 1), rgba(249, 31, 40, 1));
		color: #fff;
	}

	.product-new .tabs .item:after {
		content: ' ';
		position: absolute;
		height: 80%;
		width: 1px;
		right: 0;
		top: 10%;
		background-color: #ccc;
	}

	.product-new .tabs .item:last-child:after {
		height: 0;
	}

	.product-new .goods-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 0;
	}

	.product-new .goods-list .item {
		width: 48.5%;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 2.5%;
	}

	.product-new .goods-list .item .img-box {
		line-height: 0;
		position: relative;
	}

	.product-new .goods-list .item .info-box {
		padding: 20rpx 20rpx 0rpx 20rpx;
	}

	.product-new .goods-list .item .info-box .goods-name {
		color: #000;
		font-weight: 500;
		height: 42px;
		line-height: 20px;
		font-size: 30rpx;
		margin-top: -16rpx;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.goods-list .label-list {
		overflow: hidden;
		margin-top: 10rpx;
	}

	.goods-list .label-list .label-img {
		height: 16px;
		margin: 0 10rpx 0 0;
	}

	.goods-list .label-list .label-img:last-child {
		margin-right: 0;
	}

	.shop_name_class {
		color: #A2A2A2;
		font-size: 26rpx;
		margin-right: 6rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	/* 顶部导航栏开始 */
	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999999;
		background-color: #f8f8f8;
	}

	.search-tab {
		padding: 46rpx 0rpx 6rpx 20rpx;
		margin: 30rpx 20rpx 10rpx 10rpx;
		font-size: 32rpx;
		color: #000000;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		text-align: center;
		align-items: center;
	}

	.search_submit {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.search_1 {
		color: #191919;
		background-color: #ffffff;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.search_2 {
		background-color: #ffffff;
		width: 100%;
	}

	.search_area {
		width: 80%;
		color: #333;
		font-size: 28rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	/* 顶部导航栏结束 */
	.swiper-boxs {
		filter: blur(5px);
	}

	.swiper-box {
		height: 100%;
		overflow-x: hidden;
		background-color: #f8f8f8;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.5;
	}

	.wxshare {
		text-align: center;
		border-radius: 0rpx;
		width: 30%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 8%;
		right: 0%;
		z-index: 9999;
	}

	.cover_1 {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.5;
	}

	.wxshare_1 {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #ffffff;
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_3_1 {
		font-size: 32rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
	}

	.add_box3_a {
		width: 50%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #000000;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 20rpx 0;
		font-size: 30rpx;
	}

	.add_box3_1_a {
		width: 50%;
		height: 90rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 0 20rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 30rpx;
	}

	.graying {
		color: #000000;
		font-size: 28rpx;
	}

	.darking {
		color: #FE0302;
		font-size: 28rpx;
	}

	.scroll-item {
		transform: scale(0.9);
		padding: 0rpx 6rpx 0rpx 0rpx;
		display: inline-block;
		text-align: center;

		.item-text {
			border-radius: 10rpx;
			border: 2rpx solid #C0C0C0;
			padding: 0rpx 10rpx;
			/* #ifdef MP-WEIXIN */
			width: 90rpx;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			width: 60rpx;
			/* #endif */

			&.active {
				color: #FE0302;
				border-radius: 10rpx;
				background-color: #fedede;
				border: 2rpx solid #fedede;
				padding: 0rpx 10rpx;
				/* #ifdef MP-WEIXIN */
				width: 90rpx;
				/* #endif */
				/* #ifndef MP-WEIXIN */
				width: 60rpx;
				/* #endif */
			}
		}
	}

	.goodsTitles {
		line-height: 40rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.moving_1 {
		font-size: 22rpx;
		color: #C0C0C0;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.popss_1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* #ifdef MP-WEIXIN */
		height: 100rpx;
		line-height: 0rpx;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: 50rpx;
		line-height: 40rpx;
		/* #endif */
		background-color: #fef5f5;
		color: #FE0302;
		padding: 30rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.tui-list-cell_popsss {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		margin: 20rpx 10rpx 20rpx 0;
		border-radius: 10rpx;
		font-size: 32rpx;
	}

	.tui-content_pop {
		flex: 1;
		display: inline-block;
		padding-left: 32rpx;
		box-sizing: border-box;
		overflow: hidden;
		color: #666;
	}

	/* 导航 start */
	.status_bar {
		background-color: #f9f9f9;
		height: var(--status-bar-height);
		width: 100%;
	}

	.chat_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifndef MP-WEIXIN */
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 78%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
	}

	.chat_2 {
		display: flex;
		flex-direction: row;
	}

	.chat_2_1 {
		display: flex;
		flex-direction: row;
		margin-top: 6rpx;
	}

	/* 导航 end */

	.class_fx {
		border: 2rpx solid #C0C0C0;
		padding: 0rpx 14rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		line-height: 54rpx;
		height: 54rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifdef MP-WEIXIN */
		width: 33%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 25%;
		/* #endif */
	}
</style>