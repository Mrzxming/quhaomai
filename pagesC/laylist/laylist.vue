<template>
	<view>
		<!-- 去铺货 -->
		<view>
			<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<!-- 这里是状态栏 -->
			<view class="status_bar" style="height: 40px;"></view>
			<!-- #endif -->
		
				<view class="nav-box" :style="{ height: gaodu + 'px' }">
					<view class="nav_l icon_wrap"
						@click="goBack">
						<text class="iconfont icon-find-fanhui"></text>
					</view>
					<text style="font-size: 32rpx;font-weight: bold;">去铺货</text>
					<view class="more-btn" :style="{ top: statusBarHeight + 'px' }" @click="toggleMenu">
						
						<!-- #ifdef MP-WEIXIN -->
							<text>更多</text>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
							<uni-icons type="more-filled" size="24" color="#333"></uni-icons>
						<!-- #endif -->
					</view>
				</view>
			
				</view>
			
			<view class="banvideo" style=""></view>
			<!-- <view style="height: 2rpx;background-color: #f6f6f6;width: 100%;"></view> -->
			<view style="height: 16rpx;background-color: #f8f8f8;margin-left: -50rpx;width: 100%;"></view>
			<view v-if="replenishList.length > 0">
				<view class="card-goods">
					<view class="card-goods-group">
						<view class="card-shop-box">
							<block v-for="(item,index) in replenishList" :key="index">
								<uni-swipe-action style="margin-bottom: 20rpx;">
									<uni-swipe-action-item :right-options="options"
										@click="deleteCarPrint(index,item.goods_id)">
										<view class="scroll-view-item " style="padding: 0rpx 30rpx;">
											<view style="display: flex;flex-direction: row; ">
												<view class="checkbox" style="margin-top: 0%;"
													:class="{'checked':item.checked,'checkbox-disabled':item.checked}"
													@click="checkGoods(index,item)">
													<view class="checkbox-icon">
														<uni-icons type="checkmarkempty" size="12"
															color="#ffffff"></uni-icons>
													</view>
												</view>
												<view class="checkbox-con" style="flex: 1 1 0%;">
													<view class="cart-goods-info">
														<view class="goods-img" style="min-width: 120rpx;">
															<image :src="item.goods_img" class="image"
																style="min-width: 120rpx;"></image>
														</view>
														<view class="cart-goods-content">
															<view
																style="display: flex; align-items: left;flex-direction: column;justify-content: left;">
																<view class=" onelist-hidden"
																	style="border-radius: 6rpx;line-height: 40rpx;">
																	{{ item.goods_name }}
																</view>
																<view class=" onelist-hidden">

																	<view class="fs24 co99"
																		style="line-height: 36rpx;display: flex; justify-content: space-between;">
																		<text v-if="item.attr_list.length === 1">
																			<text v-if="item.checked">已选1个规格</text>
																			<text v-else>
																				{{ item.attr_list[0].attr_name }}</text>
																		</text>
																		<text v-else>
																			<text
																				v-if="item.checked">已选{{ getSelectedSpecCount(item) }}个规格</text>
																			<text
																				v-else>{{ item.attr_list.length }}个规格可选</text>
																		</text>

																	</view>

																</view>
																<view class="flex-start fs28 cored price-no-ellipsis"
																	style="line-height: 36rpx;">
																	<currency-prices :price="item.product_price"
																		:size="18"></currency-prices>
																</view>
																<view class="flex-start fs20 co99 onelist-hidden"
																	style="line-height: 36rpx;">
																	创建时间：{{item.create_time}}
																</view>
															</view>
														</view>
													</view>
												</view>
											</view>


											<!-- 规格展示区域 -->
											<view class="specs-container"
												v-if="item.attr_list && item.attr_list.length > 0">
												<view class="specs-title">规格：</view>
												<view class="specs-content">
													<view v-for="(spec, specIndex) in item.attr_list"
														:key="spec.product_id" class="spec-tag" :class="{
        'selected': isSpecSelected(spec.product_id),
        'hidden-spec': specIndex >= 3 && !item.showAllSpecs
      }" @click="toggleSpecSelection(spec.product_id, item)">
														{{ spec.attr_name }}
													</view>

													<view v-if="item.attr_list.length > 3" class="view-all-btn"
														@click="toggleShowAllSpecs(item)">
														{{ item.showAllSpecs ? '收起' : `查看全部(${item.attr_list.length})` }}
													</view>
												</view>
											</view>
											<!--规格区域 end -->
										</view>
									</uni-swipe-action-item>
								</uni-swipe-action>
							</block>
						</view>
					</view>
				</view>
				<view style="height: 80rpx;"></view>
				<uni-load-more :status="loadMoreStatus" :content-text="contentText" />
				<view style="height: 80rpx;"></view>
			</view>
		</view>
		<view class="cart-submit">
			<view class="card-shop-head" style="margin-left: 30rpx;">
				<view class="head-left">
					<view class="checkbox" :class="{'checked':list_all_checked,'checkbox-disabled':list_all_checked}"
						@click="check_list_all">
						<view class="checkbox-icon">
							<uni-icons type="checkmarkempty" size="12" color="#ffffff"></uni-icons>
						</view>
					</view>
					<view class="flex-between">
						<view class="checkbox-con" style="margin-left: -20rpx;">
							<text style="margin-right: 20rpx;">全选</text> 已选（{{addprints.length}}）
						</view>
						<view class="sub-btn flex-center coff fs32 ml30" @click="toqqshop()">
							铺货到嘚嘚象
						</view>
					</view>
				</view>

			</view>
		</view>

		<dsc-not-content v-if="replenishList.length == 0 && !dscLoading"></dsc-not-content>
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		<!--  规格选择弹窗 -->
		<custom-toast ref="customToast"></custom-toast>
		<!-- 三点按钮 -->
		<!-- <view class="more-btn" :style="{ top: statusBarHeight + 'px' }" @click="toggleMenu">
			<uni-icons type="more-filled" size="24" color="#333"></uni-icons>
		</view> -->

		<!-- 遮罩层 -->
		<view v-if="!menuClosed" class="menu-mask" :class="{ 'mask-show': showMenu }" @click="forceCloseMenu"
			@touchmove.stop.prevent></view>

		<!-- 菜单内容  	:style="{ top: menuTop + 'px', right: menuRight + 'px' }"-->
		<view v-if="!menuClosed" class="menu-content" :class="{ 'content-show': showMenu }"
		
			>
			<view class="menu-item" v-for="(item, index) in menuItems" :key="index"
				@click="handleMenuClick(item.action)">
				<uni-icons :type="item.icon" size="16" color="#666"></uni-icons>
				<text class="item-text">{{ item.name }}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import CustomToast from '@/components/CustomToast/CustomToast.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				statusBarHeight: 0,
				showMenu: false,
				menuClosed: true,
				menuTop: 0,
				menuRight: 0,
				menuItems: [{
						name: '查看记录',
						action: 'viewHistory',
						icon: 'eye'
					},
					{
						name: '清空全部',
						action: 'clearAll',
						icon: 'trash'
					}
				],
				menuButtonInfo: {},
				gaodu:'',
				menuTop: 0,
				menuRight: 0,
				list_all_checked: false,
				addprints: [],
				selectedProducts: [],
				showErrorTip: false,
				selectedSpecs: [], // 存储所有被选中的规格ID数组（
				currentGoods: '', // 当前操作的商品
				currentSpecs: [], // 当前商品的规格列表（用于弹窗显示）
				replenishList: [],
				laylist: [],
				pageSize: 10,
				page: 1,
				dscLoading: true,
				loadMoreStatus: 'more', // more/loading/noMore
				contentText: {
					contentdown: this.$t('lang.view_more') || '查看更多',
					contentrefresh: this.$t('lang.loading') || '加载中...',
					contentnomore: this.$t('lang.no_more') || '没有更多了'
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f92028'
					}
				}],
			}
		},
		components: {
			dscNotContent,
			uniSwipeAction,
			uniSwipeActionItem,
			CustomToast,
			uniLoadMore
		},
		onReady() {
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
		onNavigationBarButtonTap() {
			var that = this
			// that.toDeleteAll()
			that.toggleMenu()
		},
		onLoad() {
			// 获取状态栏高度
			this.getStatusBarHeight()
			this.forceCloseMenu()
			this.getlaylist(1)
		},
		onHide() {
			this.forceCloseMenu()
		},
		onUnload() {
			this.forceCloseMenu()
		},
		// 小程序专用生命周期
		onPageHide() {
			this.forceCloseMenu()
		},
		onReachBottom() {
			// 触底加载下一页数据：仅在还有更多且不在加载中时触发
			if (this.dscLoading) return;
			if (this.loadMoreStatus === 'noMore' || this.loadMoreStatus === 'loading') return;
			const nextPage = this.page + 1;
			this.getlaylist(nextPage);
		},
		// 处理安卓返回键
		onBackPress() {
			if (this.showMenu) {
				this.forceCloseMenu()
				return true // 阻止默认返回行为
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			async getStatusBarHeight() {
				const res = await uni.getSystemInfo()
				// this.statusBarHeight = res.statusBarHeight || 0
				this.statusBarHeight = -30
				// 仅小程序获取菜单按钮位置
				// #ifdef MP-WEIXIN
				this.statusBarHeight = 50
				// #endif
			},
			toggleMenu(e) {
				if (this.showMenu) {
					this.forceCloseMenu()
				} else {
					this.menuClosed = false
					this.$nextTick(() => {
						this.calculatePosition()
						setTimeout(() => {
							this.showMenu = true
						}, 50)
					})
				}
			},
			calculatePosition() {
				uni.createSelectorQuery()
					.select('.more-btn')
					.boundingClientRect(data => {
						const systemInfo = uni.getSystemInfoSync()
						// this.menuTop = data.top + data.height + 5
						// this.menuRight = systemInfo.windowWidth - data.right - 10
					})
					.exec()
			},
			forceCloseMenu() {
				this.showMenu = false
				setTimeout(() => {
					this.menuClosed = true
				}, 300) // 与动画时间保持一致
			},
			handleMenuClick(action) {
				this.forceCloseMenu()
				switch (action) {
					case 'viewHistory':
						uni.navigateTo({
							url: '/pagesC/importLog/importLog'
						})
						break
					case 'clearAll':
						this.showConfirmDialog()
						break
				}
			},
			showConfirmDialog() {
				uni.showModal({
					title: '提示',
					content: '确定要清空全部记录吗？',
					success: (res) => {
						if (res.confirm) {
							// console.log(0)
							// this.getlaylist()
							// uni.showToast({
							// 	title: '已清空',
							// 	icon: 'success'
							// })
						uni.showLoading({
							title: '处理中~',
							mask: true
						});
						uni.request({
							url: 'https://www.ok9288.com/api/puhuo/delpuhuogoodslist',
							method: 'POST',
							data: {
								type: 1
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash': uni.getStorageSync('client_hash')
							},
							success: (res) => {
								var that = this 
								that.$refs.customToast.showToast({
									title: res.data.data,
									icon: 'success',
									duration: 3000
								})
								that.replenishList = []
								that.addprints = []
								that.getlaylist()
								this.list_all_checked = false
								uni.hideLoading()
								this.showMenu = false
							},
							fail: (err) => {
								uni.hideLoading()
								this.$refs.customToast.showToast({
									title: res.data.data || '操作失败',
									icon: 'error',
									duration: 3000
								})
							}
						})
						}
					}
				})
			},

			// 规格部分
			// 计算额外规格的高度（用于过渡动画）
			getExtraSpecsHeight(item) {
				const extraCount = item.attr_list.length - 3
				const rows = Math.ceil(extraCount / 3) // 假设每行显示3个
				return rows * 44 // 每个规格高度约44rpx
			},

			// 优化后的切换方法
			toggleShowAllSpecs(item) {
				// 小程序性能优化：使用$nextTick确保DOM更新后再触发动画
				this.$nextTick(() => {
					this.$set(item, 'showAllSpecs', !item.showAllSpecs)
				})
			},
			// 获取当前应该显示的规格列表
			getDisplaySpecs(item) {
				return item.showAllSpecs ? item.attr_list : item.attr_list.slice(0, 3)
			},

			// 切换显示全部规格
			toggleShowAllSpecs(item) {
				this.$set(item, 'showAllSpecs', !item.showAllSpecs)
			},
			// 检查是否是当前商品的最后一个选中规格
			isLastSelectedSpec(productId) {
				if (!this.isSpecSelected(productId)) return false

				const currentGoodsSpecs = this.currentGoods.attr_list.map(item => item.product_id)
				const selectedCount = this.selectedSpecs.filter(id =>
					currentGoodsSpecs.includes(id)
				).length

				return selectedCount <= 1
			},

			// 处理规格点击
			handleSpecClick(productId) {
				if (this.isLastSelectedSpec(productId)) {
					this.showErrorTip = true
					setTimeout(() => {
						this.showErrorTip = false
					}, 2000)
					return
				}
				this.toggleSpecSelection(productId)
			},
			// 在提交前验证所有选中商品的规格
			validateSpecSelections() {
				// 获取所有有规格的选中商品
				var that = this
				const goodsWithSpecs = that.selectedProducts.map(goodsId => {
					return this.goodsList.find(item => item.goods_id === goodsId)
				}).filter(goods => goods.attr_list && goods.attr_list.length > 0)
				console.log(goodsWithSpecs)
				// 检查每个有规格的商品是否至少选中一个规格
				const invalidGoods = goodsWithSpecs.filter(goods => {
					const specIds = goods.attr_list.map(item => item.product_id)
					return !specIds.some(id => this.selectedSpecs.includes(id))
				})

				return {
					valid: invalidGoods.length === 0,
					invalidGoods
				}
			},
			// 确认规格选择
			confirmSpecSelection() {
				// 确保当前商品已选中
				if (!this.isGoodsSelected(this.currentGoods.goods_id)) {
					this.selectGoods(this.currentGoods)
				}

				// 原有验证逻辑
				const {
					valid,
					invalidGoods
				} = this.validateSpecSelections()
				if (!valid) {
					this.$refs.customToast.showToast({
						title: `请为${invalidGoods.length}个商品选择至少一个规格`,
						icon: 'error',
						duration: 3000
					})
					return
				}

				this.$refs.specPopup.close()
			},
			// 设置默认规格（商品选中时调用）
			setDefaultSpecs(goods) {
				if (!goods.attr_list || goods.attr_list.length === 0) return

				// 获取当前商品的所有规格ID
				const specIds = goods.attr_list.map(item => item.product_id)

				// 如果是单个规格，直接加入选中列表
				if (specIds.length === 1) {
					if (!this.selectedSpecs.includes(specIds[0])) {
						this.selectedSpecs.push(specIds[0])
					}
				}
				// 多个规格则全部加入
				else {
					specIds.forEach(id => {
						if (!this.selectedSpecs.includes(id)) {
							this.selectedSpecs.push(id)
						}
					})
				}
			},

			// 商品选中/取消选中时触发
			handleSelectGoods(goods) {
				if (this.isSelected(goods.goods_id)) {
					// 选中商品时自动全选规格（如果未选过）
					this.setDefaultSpecs(goods)
				} else {
					// 取消选中时检查规格是否可以移除
					if (goods.attr_list && goods.attr_list.length > 0) {
						const hasOtherSelected = this.selectedProducts.some(id => {
							if (id === goods.goods_id) return false
							const otherGoods = this.goodsList.find(item => item.goods_id === id)
							return otherGoods.attr_list && otherGoods.attr_list.some(spec =>
								this.selectedSpecs.includes(spec.product_id)
							)
						})

						if (!hasOtherSelected) {
							this.$refs.customToast.showToast({
								title: '至少保留一个商品的规格',
								icon: 'error',
								duration: 3000
							})
							return
						}
					}
					// 执行取消
					this.removeSpecsByGoods(goods)
					this.selectedProducts = this.selectedProducts.filter(id => id !== goods.goods_id)
				}
			},

			// 移除商品关联的所有规格

			removeSpecsByGoods(goods) {
				if (!goods.attr_list) return;

				const specIds = goods.attr_list.map(item => item.product_id);
				this.selectedSpecs = this.selectedSpecs.filter(id => !specIds.includes(id));
			},

			// 全选处理
			handleSelectAll() {
				this.goodsList.forEach(goods => {
					if (!this.selectedProducts.includes(goods.goods_id)) {
						this.selectedProducts.push(goods.goods_id)
						this.setDefaultSpecs(goods)
					}
				})
			},


			// 弹窗部分

			// 显示规格弹窗
			showSpecPopup(goods) {
				this.currentGoods = goods
				this.currentSpecs = goods.attr_list
				this.$refs.specPopup.open()
			},


			// 切换规格选中状态
			toggleSpecSelection(productId, goods) {
				// 当前规格是否已选中
				const isSelected = this.isSpecSelected(productId);

				// 商品当前选中状态
				const goodsSelected = this.isGoodsSelected(goods.goods_id);

				// 获取当前商品所有规格ID
				const goodsSpecIds = goods.attr_list?.map(spec => spec.product_id) || [];

				// 当前商品已选规格数量
				const selectedCount = this.selectedSpecs.filter(id =>
					goodsSpecIds.includes(id)
				).length;

				// 取消规格操作
				if (isSelected) {
					// 情况1：是最后一个规格且商品是选中状态 → 提示并阻止
					if (goodsSelected && selectedCount <= 1) {
						this.$refs.customToast.showToast({
							title: '每个商品至少保留一个规格',
							icon: 'error',
							duration: 3000
						});
						return;
					}

					// 情况2：正常取消规格
					const index = this.selectedSpecs.indexOf(productId);
					if (index > -1) {
						this.selectedSpecs.splice(index, 1);
					}
				}
				// 选中规格操作
				else {
					// 核心规则：选中规格时自动关联商品
					if (!goodsSelected) {
						this.selectGoods(goods);
					}

					// 添加当前规格
					this.selectedSpecs.push(productId);
					// 数组去重
					this.selectedSpecs = [...new Set(this.selectedSpecs)];
				}
			},
			// 新增方法：选中商品
			selectGoods(goods, num) {
				if (!this.isGoodsSelected(goods.goods_id)) {
					// 1. 添加到选中商品列表
					this.selectedProducts.push(goods.goods_id);

					// 2. 更新UI状态
					const index = this.replenishList.findIndex(item => item.goods_id === goods.goods_id);
					if (index > -1) {
						this.$set(this.replenishList[index], 'checked', true);
						this.addprints.push(this.replenishList[index]);
					}
					if (num == 1) {

						// 3. 自动全选旗下规格
						this.selectAllSpecsForGoods(goods);
					}

				}
			},
			// 选中商品的所有规格

			selectAllSpecsForGoods(goods) {
				if (!goods.attr_list) return;

				goods.attr_list.forEach(spec => {
					if (!this.isSpecSelected(spec.product_id)) {
						this.selectedSpecs.push(spec.product_id);
					}
				});

				// 数组去重
				this.selectedSpecs = [...new Set(this.selectedSpecs)];
			},
			// 检查商品是否选中
			isGoodsSelected(goodsId) {
				return this.selectedProducts.includes(goodsId)
			},

			// 获取商品已选规格数量
			getSelectedSpecCount(goods) {
				if (!goods.attr_list) return 0;
				const specIds = goods.attr_list.map(item => item.product_id);
				return this.selectedSpecs.filter(id => specIds.includes(id)).length;
			},

			// 检查规格是否被选中
			isSpecSelected(productId) {
				return this.selectedSpecs.includes(productId)
			},
			// 弹窗部分end
			// 规格部分end
			// 更新全选状态
			updateAllSelectedState() {
				this.list_all_checked = this.replenishList.every(item => item.checked);
			},

			// 取消选中商品
			unselectGoods(goods) {
				const index = this.selectedProducts.indexOf(goods.goods_id);
				if (index > -1) {
					// 1. 从选中列表移除
					this.selectedProducts.splice(index, 1);

					// 2. 更新UI状态
					const uiIndex = this.replenishList.findIndex(item => item.goods_id === goods.goods_id);
					if (uiIndex > -1) {
						this.$set(this.replenishList[uiIndex], 'checked', false);
						this.addprints = this.addprints.filter(item => item.goods_id !== goods.goods_id);
					}

					// 3. 自动移除关联规格
					this.removeSpecsByGoods(goods);
				}
			},

			// 获取商品已选规格数量
			getSelectedSpecCount(goods) {
				if (!goods.attr_list) return 0;
				const specIds = goods.attr_list.map(item => item.product_id);
				return this.selectedSpecs.filter(id => specIds.includes(id)).length;
			},
			// 全选/取消全选

			check_list_all() {
				// 切换全选状态
				const newState = !this.list_all_checked;
				this.list_all_checked = newState;

				// 处理全选/取消全选
				this.replenishList.forEach(item => {
					if (newState) {
						// 全选操作
						if (!item.checked) {
							// 选中商品（会自动关联其所有规格）
							this.selectGoodsWithAllSpecs(item);
						}
					} else {
						// 取消全选
						if (item.checked) {
							// 取消商品（会自动移除关联规格）
							this.unselectGoods(item);
						}
					}
				});
			},
			selectGoodsWithAllSpecs(goods) {
				// 1. 选中商品
				if (!this.isGoodsSelected(goods.goods_id)) {
					this.selectedProducts.push(goods.goods_id);
					const index = this.replenishList.findIndex(item => item.goods_id === goods.goods_id);
					if (index > -1) {
						this.$set(this.replenishList[index], 'checked', true);
						this.addprints.push(this.replenishList[index]);
					}
				}

				// 2. 全选该商品所有规格（独立添加，不覆盖其他商品规格）
				if (goods.attr_list) {
					goods.attr_list.forEach(spec => {
						if (!this.isSpecSelected(spec.product_id)) {
							this.selectedSpecs.push(spec.product_id);
						}
					});
					// 数组去重
					this.selectedSpecs = [...new Set(this.selectedSpecs)];
				}
			},
			checkGoods(index, goods) {
				if (goods.checked) {
					// 取消选中商品时，自动取消所有规格
					this.unselectGoods(goods);
				} else {
					// 选中商品时，自动全选规格
					this.selectGoods(goods, 1);
				}

				// 更新全选状态
				this.updateAllSelectedState();
			},
			// 铺货到助手
			toqqshop() {
				if (!this.addprints || this.addprints.length < 1) {
					this.$refs.customToast.showToast({
						title: '至少选择一个商品',
						icon: 'error',
						duration: 3000
					})
					return
				}
				const that = this;

				const productId = this.selectedSpecs
				const goodsIds = this.addprints.map(item => item.goods_id);

				uni.showModal({
					title: '温馨提示',
					content: '确定要铺货到嘚嘚象吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true
							});
							uni.request({
								url: 'https://www.ok9288.com/api/puhuo/onepuhuoqingqu',
								method: 'POST',
								data: {
									goods_id: goodsIds.join(','),
									product_id: productId.join(','),
									type: 1
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									if (res && res.data.errors && res.data.errors.code == 0) {
										uni.hideLoading()
										that.$refs.customToast.showToast({
										  title: res.data.data || res.data.errors.message,
										  icon: 'error',
										  duration: 3000 // 可自定义显示时长
										})
									} else {
										uni.hideLoading()
										that.$refs.customToast.showToast({
										  title: res.data.data,
										  icon: 'success',
										  duration: 3000 // 可自定义显示时长
										})
										// uni.showToast({
										// 	title: res.data.data,
										// 	icon: 'success'
										// })
									}
								},
								fail: (err) => {
									uni.hideLoading()
									that.$refs.customToast.showToast({
										title: res.data.data || '操作失败',
										icon: 'error',
										duration: 3000
									})
								}
							})
						}
					}
				})
			},
			//删除购物车商品
			deleteCarPrint(index, id) {
				let deleteid = id
				let that = this
				let relist = this.replenishList
				let addlist = this.addprints
				uni.showModal({
					content: '确定删除此铺货商品吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true
							});
							uni.request({
								url: 'https://www.ok9288.com/api/puhuo/delpuhuogoodslist',
								method: 'GET',
								data: {
									goods_id: id,
									type: 0
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									uni.hideLoading()
									this.$refs.customToast.showToast({
										title: res.data.data,
										icon: 'success',
										duration: 3000
									})

									for (let i = 0; i < relist.length; i++) {
										if (relist[i].goods_id === id) {
											relist.splice(i, 1);
											break;
										}
									}
									if (addlist && addlist.length > 0) {
										for (let i = 0; i < addlist.length; i++) {
											if (addlist[i].goods_id === id) {
												addlist.splice(i, 1);
												break;
											}
										}
									}
									this.replenishList = relist
									this.addlist = relist
								},
								fail: (err) => {
									uni.hideLoading()
									this.$refs.customToast.showToast({
										title: res.errMsg || '操作失败',
										icon: 'error',
										duration: 3000
									})
								}
							})

						}
					}
				})

			},
			toDeleteAll() {
				var that = this
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除这些商品吗？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '处理中~',
								mask: true
							});
							uni.request({
								url: 'https://www.ok9288.com/api/puhuo/delpuhuogoodslist',
								method: 'POST',
								data: {
									type: 1
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
									var that = this 
									that.$refs.customToast.showToast({
										title: res.data.data,
										icon: 'success',
										duration: 3000
									})
									that.replenishList = []
									that.addprints = []
									that.getlaylist()
									that.list_all_checked = false
									uni.hideLoading()
								},
								fail: (err) => {
									uni.hideLoading()
									this.$refs.customToast.showToast({
										title: res.data.data || '操作失败',
										icon: 'error',
										duration: 3000
									})
								}
							})
						}
					}
				})
			},


			// 获取列表
			getlaylist(page) {
				var that = this
				if (page) {
					this.page = page
				}
				// 防止重复加载
				if (this.loadMoreStatus === 'loading' || this.loadMoreStatus === 'noMore') {
					return;
				}
				this.loadMoreStatus = 'loading';

				uni.request({
					url: this.websiteUrl + '/api/puhuo/getpuhuogoodslist',
					method: 'GET',
					data: {
						page: this.page
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							const list = res.data.data || [];
							if (list.length > 0) {
								for (var i = 0; i < list.length; i++) {
									list[i].checked = false
									list[i].showAllSpecs = false // 新增初始化
								}
								if (this.page > 1) {
									this.replenishList = this.replenishList.concat(list);
								} else {
									this.replenishList = list
								}
								// 返回数量小于 pageSize，认为没有更多
								this.loadMoreStatus = list.length < this.pageSize ? 'noMore' : 'more';
							} else {
								// 空数组：没有更多
								if (this.page === 1) {
									this.replenishList = [];
								}
								this.loadMoreStatus = 'noMore';
							}
						} else {
							this.loadMoreStatus = 'more';
						}
						this.dscLoading = false;
					},
					fail: (err) => {
						this.dscLoading = false;
						this.loadMoreStatus = 'more';
					}
				})
			}
		},


	}
</script>

<style lang="scss">
	// 商品列表
	.goodslist {
		// background-color: pink;
		margin: 0rpx 26rpx 20rpx;

		.item {
			padding-bottom: 10rpx;
		}

	}

	.tui-content {
		text-align: left;
	}

	.placeholders {
		color: #C0C0C0;
		font-size: 28rpx;
	}

	.swiper-boxs {
		filter: blur(5px);
		width: 100%;
	}

	.swiper-box {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
	}

	// 弹框
	.cover {
		position: fixed;
		top: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0);
		z-index: 999;
		opacity: 0.2;
	}

	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 30%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_2_1 {
		margin-top: 50rpx;
		margin-bottom: 36rpx;
		font-size: 34rpx;
	}

	.wxshare_3_1 {
		font-size: 32rpx;
		margin-left: 30rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		color: #999999;
		// margin-left: 20rpx;
		// margin-right: 20rpx;
	}

	.add_box3_a {
		margin-left: 10%;
		width: 35%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		color: #ffffff;
		background-color: #5f94fc;
		border: 2rpx solid #5f94fc;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.add_box3_b {
		margin-left: 10%;
		width: 35%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		color: #999999;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 13rpx;
		border: 1rpx solid #999999;
		font-size: 30rpx;
	}

	.add_box3_1_a {
		margin-left: 10%;
		width: 35%;
		height: 80rpx;
		border: 2rpx solid #5f94fc;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #5f94fc;
		font-size: 30rpx;
	}

	.add_box3_a_1 {
		width: 50%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #000000;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 20rpx 0;
		font-size: 30rpx;
	}

	.add_box3_1_a_1 {
		width: 50%;
		height: 90rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 0 0 0 20rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 30rpx;
	}

	.input {
		flex: 1;
		padding: 0rpx 20rpx;
		height: 76rpx;
		font-size: 28rpx;
		color: #FD3E3C;
	}

	/* 导航 start */

	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #fff;
	}

	.status_bar {
		// /*#ifdef MP-WEIXIN*/
		// margin-top: 92rpx;
		
		//  /*#endif*/ 
		// background-color: #fff;
		// min-height: 88rpx;
		// height: 44 + var(--status-bar-height);
		// width: 100%;
		// z-index: 99;
		// position: fixed;
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
		
	}
	.nav-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifndef MP-WEIXIN */
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 75%;
		padding: 0rpx 40rpx 10rpx 30rpx;
		/* #endif */
	}
	.banvideo {
		margin-top: 144rpx;
		background-color: #f5f5f5;
	
	}





	/* 导航 end */
	// 搜索
	.search_1 {
		border: 2rpx solid #C0C0C0;
		background-color: #ffffff;
		border-radius: 40rpx;
		padding: 0 30rpx;
		width: 78%;
		color: #191919;
		margin: 30rpx 20rpx 20rpx 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.search_2 {
		// background-color: #5c93ff;
		color: #191919;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.search_area {
		width: 80%;
		font-size: 30rpx;
		color: #333;
		padding-left: 20rpx;
		height: 70rpx;
		line-height: 70rpx;
	}

	.scroll-items {
		padding: 80rpx 0rpx 20rpx 50rpx;
		display: inline-block;
		text-align: center;

		.item-texts {
			font-size: 28rpx;
			border-radius: 50rpx;
			border: 2rpx solid #f6f6f6;
			background-color: #f6f6f6;
			padding: 10rpx 42rpx;
			width: 180rpx;

			&.active {
				color: #5c93ff;
				background-color: #e9f0ff;
				border-radius: 50rpx;
				border: 2rpx solid #5c93ff;
				padding: 10rpx 42rpx;
				width: 180rpx;
			}
		}
	}

	::-webkit-scrollbar {
		display: none;
	}

	.card-goods {

		overflow-x: hidden;
	}

	.card-goods-group {
		// padding: 10rpx 0rpx;
		// background: #FFFFFF;
		background-color: #f6f6f6;
		padding: 0 20rpx;
		overflow-x: hidden;
	}

	.card-shop-head {
		display: flex;
		flex-direction: row;
		padding: 20upx 0 40rpx;
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

	.cart-goods-info {
		background-color: #FFFFFF;
		padding: 20upx 0 10upx 0;
		display: flex;
		flex-direction: row;
		height: 176rpx;
	}

	.cart-goods-info .goods-img {
		width: 160upx;
		height: 160upx;
		border: 1rpx solid #ececec;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cart-goods-info .image {
		width: 160upx;
		height: 160upx;
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

	.scroll-view-item {
		width: 100%;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
		box-sizing: border-box;
		padding: 10rpx 0rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}

	.cart-submit {
		width: 100%;
		// display: flex;
		// flex-direction: row;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		align-items: center;
		border-top: 1px solid #e3e8ee;
		box-shadow: 2px 2px 5px #e3e8ee;
		// border-radius: 50rpx 50rpx 0 0;
	}


	.flow-no-cart {
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 10upx;
		text-align: center;
		overflow: hidden;
	}

	.flow-no-cart text {
		color: #333333;
		font-size: 30upx;
	}


	.cart-submit .btn-bar {
		margin: 30rpx;
		font-size: 32rpx;
	}

	.onelist-hidden {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	/* iOS上价格不显示省略号 */
	/* #ifdef APP-PLUS */
	.price-no-ellipsis {
		overflow: visible;
		text-overflow: clip;
		display: block;
		-webkit-line-clamp: none;
		-webkit-box-orient: horizontal;
		white-space: normal;
	}
	/* #endif */

	.twolist-hidden {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		white-space: normal;
		line-height: 1.5;
		word-break: break-all;
	}

	.priceRadio_2_1 {
		font-size: 28rpx;
		color: #666666;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	/* 加减模块 */
	.countBox {
		// width: 200rpx;
		display: flex;
		align-items: center;
		// margin-right: 32rpx;
	}

	.countBox image {
		width: 48rpx;
		height: 48rpx;
	}

	.sign,
	.add {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.count {
		width: 60px;
		text-align: center;
		font-size: 28rpx;
		color: #FD3E3C;
		background-color: #fff3f3;
	}

	/* 加减模块结束 */

	.checkbox_1 {
		margin-top: -5%;
	}

	.wxshare_image {
		text-align: center;
		border-radius: 20rpx;
		width: 100%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 15%;
		left: 0%;
		z-index: 9999;
	}

	.goPrint {
		// width: 686rpx;
		height: 88rpx;
		background: #5C93FF;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 16rpx;
		margin: 36rpx 32rpx 68rpx;
	}

	.goprint {
		// width: 108rpx;
		height: 50rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
		font-style: normal;
	}

	.sub-btn {
		width: 400rpx;
		height: 88rpx;
		background: #FE2F02;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 44rpx;
	}

	/* 规格弹窗样式 */
	.spec-popup {
		background: #fff;
		padding: 20px;
		border-radius: 12px 12px 0 0;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		padding-bottom: 15px;
		border-bottom: 1px solid #eee;
	}

	.spec-list {
		max-height: 60vh;
		overflow-y: auto;
		margin: 15px 0;
	}

	.spec-item {
		padding: 12px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
	}

	.spec-item.selected {
		border-color: #ff4d4f;
		color: #ff4d4f;
	}

	.page-container {
		position: relative;
		height: 100vh;
	}

	.more-btn {
		margin-right: 10rpx;
	
		// position: fixed;
		// top: 0;
		// left: 0;
		// z-index: 9999;
		// padding: 10px;

	}

	.menu-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 998;
		pointer-events: none;
	}

	.mask-show {
		opacity: 1;
		pointer-events: auto;
	}

	// 1
	.menu-content {
		/*#ifdef MP-WEIXIN*/
		top: 100rpx !important;
		right: 220rpx !important;
		 /*#endif*/
		position: fixed;
		top: 80rpx;
		right: 0;
		min-width: 150px;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		transform: scale(0.8);
		transform-origin: top right;
		opacity: 0;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 999;
		pointer-events: none;
		padding: 8px 0;
	}

	.content-show {
		transform: scale(1);
		opacity: 1;
		pointer-events: auto;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 10px 16px;
	}

	.menu-item:active {
		background-color: #f5f5f5;
	}

	.item-text {
		margin-left: 8px;
		font-size: 14px;
		color: #333;
	}

	/* 规格容器 */
	/* 规格容器 */
	.specs-container {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.specs-content {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	/* 规格标签基础样式 */
	.spec-tag {
		padding: 4rpx 16rpx;
		background: #f5f5f5;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
		border: 1rpx solid #eee;
		transition: all 0.2s ease;
		/* 确保规格项根据内容宽度自适应 */
		flex-shrink: 0;
	}

	.spec-tag.selected {
		background: #e8f5e9;
		color: #07c160;
		border-color: #07c160;
	}

	/* 隐藏的规格项 */
	.spec-tag.hidden-spec {
		display: none;
	}

	/* 查看全部按钮 */
	.view-all-btn {
		padding: 4rpx 16rpx;
		color: #007aff;
		font-size: 24rpx;
		white-space: nowrap;
		background: rgba(0, 122, 255, 0.1);
		border-radius: 30rpx;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.view-all-btn:active {
		background: rgba(0, 122, 255, 0.2);
	}

	/* 过渡动画效果 */
	.spec-tag {
		opacity: 0;
		transform: scale(0.8);
		animation: fadeIn 0.3s forwards;
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* 小程序特定优化 */
	/* #ifdef MP-WEIXIN */
	.specs-content {
		-webkit-overflow-scrolling: touch;
	}

	/* #endif */
</style>