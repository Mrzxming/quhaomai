<template>
	<view class="report-list-page" :style="{ height: gaodu + 'px' }">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="back-btn" @click="navigateBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="nav-title">我的举报记录</view>
		</view>

		<!-- 状态筛选器 -->
		<view class="filter-bar">
			<view class="filter-scroll">
				<view class="filter-item" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
					全部
				</view>
				<view class="filter-item" :class="{ active: activeFilter === 'pending' }"
					@click="activeFilter = 'pending'">
					未处理
				</view>
				<view class="filter-item" :class="{ active: activeFilter === 'processed' }"
					@click="activeFilter = 'processed'">
					已处理
				</view>
				<view class="filter-item" :class="{ active: activeFilter === 'appeal' }"
					@click="activeFilter = 'appeal'">
					申诉中
				</view>
			</view>
		</view>

		<!-- 举报列表 -->
		<view class="report-list">
			<!-- 举报项卡片 -->
			<view class="report-card" v-for="(report, index) in filteredReports" :key="index"
				@click="viewDetail(report)">
				<!-- 商品信息 -->
				<view class="goods-info">
					<image class="goods-thumb" :src="report.goods_thumb || defaultGoodsImg" mode="aspectFill"></image>
					<view class="goods-details">
						<view class="goods-name">{{ report.goods_name }}</view>
						<view class="shop-name">商家: {{ report.shop_name }}</view>
						<view class="report-type">
							<text class="type-label">举报类型:</text>
							<text class="type-value">{{ report.type_name }}</text>
						</view>
					</view>
				</view>

				<!-- 举报基本信息 -->
				<view class="report-basic">
					<view class="report-time">
						<text class="label">举报时间:</text>
						<text class="value">{{ report.add_time }}</text>
					</view>
					<view class="report-sn">
						<text class="label">流水号:</text>
						<text class="value">{{ report.report_sn }}</text>
					</view>
				</view>

				<!-- 举报状态 -->
				<view class="report-status">
					<!-- 修复这里的 :class 绑定 -->
					<view class="status-tag" :class="{
					  'status-pending': report.report_state === 0,
					  'status-processed': report.report_state === 1 && ![1, 2, 3].includes(report.handle_type),
					  'status-ineffective': report.report_state === 1 && report.handle_type === 1,
					  'status-effective': report.report_state === 1 && report.handle_type === 3,
					  'status-canceled': report.report_state === 2,
					  'status-deleted': report.report_state === 3
					}">
						{{ getStatusText(report.report_state, report.handle_type) }}
					</view>

					<!-- 凭证图片预览 -->
					<view class="evidence-preview" v-if="report.img_url && report.img_url.length">
						<view class="evidence-label">凭证:</view>
						<view class="evidence-images">
							<image v-for="(img, imgIdx) in report.img_url" :key="imgIdx" :src="img" mode="aspectFill"
								class="evidence-img" :style="{ zIndex: report.img_url.length - imgIdx }"></image>
							<view class="image-count" v-if="report.img_url.length > 3">
								+{{ report.img_url.length - 3 }}
							</view>
						</view>
					</view>
				</view>

				<!-- 处理信息（已处理时显示） -->
				<view class="handle-info" v-if="report.report_state === 1 && report.handle_message">
					<view class="handle-title">处理结果:</view>
					<view class="handle-content">{{ report.handle_message }}</view>
				</view>

				<!-- 申诉信息（有申诉时显示） -->
				<view class="appeal-info" v-if="report.appeal_state !== 0">
					<view class="appeal-title">
						<text class="appeal-icon">⚖️</text>
						<text class="appeal-text">申诉状态: {{ getAppealStatusText(report.appeal_state) }}</text>
					</view>
					<view class="appeal-content" v-if="report.appeal_message">
						{{ report.appeal_message }}
					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="report-actions" v-if="showActions(report)">
					<view class="action-btn cancel-btn" v-if="report.report_state === 0"
						@click.stop="cancelReport(report.report_id)">
						取消举报
					</view>
					<view class="action-btn appeal-btn" v-if="report.report_state === 1 && report.appeal_state === 0"
						@click.stop="openAppealPopup(report.report_id)">
						发起申诉
					</view>
					<view class="action-btn delete-btn" v-if="report.report_state !== 3"
						@click.stop="deleteReport(report.report_id)">
						删除记录
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredReports.length === 0">
				<image src="/static/empty-report.png" class="empty-img"></image>
				<view class="empty-text">暂无相关举报记录</view>
			</view>
			<!-- 加载更多提示 -->
			<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="reports.length > 0  " />
		</view>

		<!-- 申诉弹窗（从底部弹出） -->
		<!-- 遮罩层 -->
		<view class="appeal-mask" v-if="showAppealModule" @click="toggleAppealModule"></view>

		<!-- 弹窗内容 -->
		<view class="appeal-popup" v-if="showAppealModule" :class="{ 'popup-visible': showAppealModule }">
			<view class="popup-header">
				<view class="popup-title">发起申诉</view>
				<view class="close-btn" @click="toggleAppealModule">
					<text class="iconfont icon-close"></text>
				</view>
			</view>

			<view class="popup-content">
				<!-- 申诉理由 -->
				<view class="appeal-item">
					<view class="appeal-label">申诉理由 <text class="required">*</text></view>
					<textarea class="appeal-textarea" v-model="appealMessage" placeholder="请详细描述您的申诉理由..."
						maxlength="500"></textarea>
					<view class="char-count">{{ appealMessage.length }} / 500</view>
				</view>

				<!-- 申诉凭证上传 -->
				<view class="appeal-item">
					<view class="appeal-label">申诉凭证 <text class="required">*</text></view>

					<!-- 已上传图片 -->
					<view class="uploaded-images" v-if="appealImages.length > 0">
						<view class="image-item" v-for="(img, index) in appealImages" :key="index">
							<image :src="img" class="uploaded-img" mode="aspectFill"></image>
							<view class="delete-btn" @click="deleteAppealImage(index)">
								<text class="delete-icon">×</text>
							</view>
						</view>
					</view>

					<!-- 上传按钮 -->
					<view class="upload-btn" @click="chooseAppealImage" v-if="appealImages.length < 5">
						<view class="upload-icon"></view>
						<text class="upload-text">上传凭证（最多5张）</text>
					</view>

					<view class="upload-hint">
						支持png、jpg、jpeg格式，单文件不超过5M
					</view>
				</view>
			</view>

			<view class="popup-footer">
				<view class="submit-appeal-btn" @click="submitAppeal">
					提交申诉
				</view>
			</view>
		</view>

		<!--返回顶部-->
		<dsc-filter-top :scrollState="scrollState" outerClass="true"></dsc-filter-top>
	</view>
</template>


<script>
	import {
		mapState
	} from 'vuex'

	import uniNavBar from '@/components/uni-nav-bar.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import universal from '@/common/mixins/universal.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	// import dscCommonNav from '@/components/dsc-common-nav.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'



	export default {
		mixins: [universal],
		components: {
			uniNavBar,
			uniIcons,
			dscFilterTop,
			uniLoadMore,

		},
		data() {
			return {
				showAppealModule: false, // 是否显示申诉模块
				appealMessage: '', // 申诉理由
				appealImages: [], // 申诉凭证图片
				// 举报列表数据
				reports: [],
				// 默认商品图片
				defaultGoodsImg: 'https://picsum.photos/200/200',
				// 筛选条件
				activeFilter: 'all',
				// 分页相关
				page: 1,
				size: 10,
				hasMore: true,
				catId: '',
				gaodu: '',
				loading: true,
				dscLoading: true,
				scrollState: false,
				showLoadMore: false,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
			};
		},

		computed: {
			// 根据筛选条件过滤举报列表
			filteredReports() {
				if (this.activeFilter === 'all') {
					return this.reports;
				} else if (this.activeFilter === 'pending') {
					// 未处理
					return this.reports.filter(report => report.report_state === 0);
				} else if (this.activeFilter === 'processed') {
					// 已处理
					return this.reports.filter(report => report.report_state === 1);
				} else if (this.activeFilter === 'appeal') {
					// 申诉中
					return this.reports.filter(report => report.appeal_state === 1);
				}
				return this.reports;
			}
		},

		methods: {
			refreshData() {
							// 保存当前筛选状态
							const currentFilter = this.activeFilter;
							// 重置分页并重新加载数据
							this.page = 1;
							this.reports = [];
							this.loadMoreStatus = 'loading';
							this.getList().then(() => {
								// 恢复筛选状态（确保重新加载后仍显示当前筛选结果）
								this.activeFilter = currentFilter;
							});
						},
			
			handelList() {
				console.log(1)
				uni.navigateTo({
					url: '/pagesC/report/reportList'
				})
			},
			getList() {
				this.showLoadMore = true
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/my_report_list',
					method: 'POST',
					data: {
						page: this.page,
						size: 10,
						appeal_state: 1, //1我的举报；2我的申述
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('接口返回数据：', res.data);
						if (res.data.status === 'success') {
							if (res.data.data && res.data.data.length < 10) {
								this.loadMoreStatus = 'noMore'
							}
							this.showLoadMore = false
							// this.reports = res.data.data;
							// 默认选中第一个违规类型（如果有）
							if (this.page == 1) {

								this.reports = res.data.data;
							} else {

								this.reports = [...this.reports, ...res.data.data];
							}
						}
					},
					fail: (err) => {
						console.error('接口请求失败：', err);
					}
				});
			},

			// 打开申诉弹窗
			openAppealPopup(reportId) {
				this.currentReportId = reportId;
				this.toggleAppealModule();
			},
			// 切换申诉弹窗显示/隐藏
			toggleAppealModule() {
			  this.showAppealModule = !this.showAppealModule;
			  
			  // 区分平台处理背景滚动
			  if (this.showAppealModule) {
			    // 显示弹窗时禁止背景滚动
			    // // #ifdef APP-PLUS
			    // const page = getCurrentPages()[getCurrentPages().length - 1];
			    // const scrollView = page.$getAppWebview().children()[0];
			    // scrollView.setStyle({ overflow: 'hidden' });
			    // // #endif
			    
			    // // H5平台禁止滚动
			    // // #ifdef H5
			    // document.body.style.overflow = 'hidden';
			    // // #endif
			    
			    // // 微信小程序禁止滚动（通过页面配置）
			    // // #ifdef MP-WEIXIN
			    // wx.setPageStyle({
			    //   style: {
			    //     overflow: 'hidden'
			    //   }
			    // });
			    // // #endif
			  } else {
			    // 隐藏弹窗时恢复滚动
			    // // #ifdef APP-PLUS
			    // const page = getCurrentPages()[getCurrentPages().length - 1];
			    // const scrollView = page.$getAppWebview().children()[0];
			    // scrollView.setStyle({ overflow: 'auto' });
			    // // #endif
			    
			    // // #ifdef H5
			    // document.body.style.overflow = 'auto';
			    // // #endif
			    
			    // // #ifdef MP-WEIXIN
			    // wx.setPageStyle({
			    //   style: {
			    //     overflow: 'auto'
			    //   }
			    // });
			    // // #endif
			    
			    // 重置表单
			    this.appealMessage = '';
			    this.appealImages = [];
			    this.appealImageUrls = '';
			    this.currentReportId = null;
			  }
			},
			// 选择申诉图片
			chooseAppealImage() {
				const count = 5 - this.appealImages.length;
				if (count <= 0) return;

				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						this.appealImages = this.appealImages.concat(res.tempFilePaths);
						this.uploadAppealImages(res.tempFilePaths);
					}
				});
			},

			// 上传申诉图片
			uploadAppealImages(filePaths) {
				filePaths.forEach(path => {
					// 实际项目中应调用真实上传接口
					const mockUrl = `https://example.com/upload/${Date.now()}.png`;
					this.appealImageUrls = this.appealImageUrls ?
						`${this.appealImageUrls},${mockUrl}` :
						mockUrl;
				});
			},

			// 获取申诉状态文本
			getAppealStatusText(appealState) {
				switch (appealState) {
					case 0:
						return "未申诉";
					case 1:
						return "待处理";
					case 2:
						return "已完结";
					default:
						return "未知状态";
				}
			},

			// 判断是否显示操作按钮
			showActions(report) {
				// 已删除状态不显示任何操作
				if (report.report_state === 3) return false;
				// 未处理状态显示取消和删除
				if (report.report_state === 0) return true;
				// 已处理状态显示申诉(如果未申诉)和删除
				if (report.report_state === 1) return true;
				// 已取消状态只显示删除
				if (report.report_state === 2) return true;
				return false;
			},

			// 取消举报
			cancelReport(reportId) {
				uni.showModal({
					title: "确认取消",
					content: "确定要取消该举报吗？",
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.websiteUrl + '/api/userDenounce/check_report_state',
								method: 'POST',
								data: {
									id: reportId,
									state: 2, //2撤销；3删除；
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {

									if (res.data.status === 'success') {
										// 实际项目中调用接口取消举报
										this.reports = this.reports.map(report => {
											if (report.report_id === reportId) {
												return {
													...report,
													report_state: 2
												};
											}
											return report;
										});
										uni.showToast({
											title: "已取消举报",
											icon: "success"
										});
										this.getList()	

									} else {
										uni.showToast({
											title: '操作失败',
											icon: 'none'
										});
									}
								},
								fail: (err) => {
									console.error('取消举报失败：', err);
									uni.showToast({
										title: '网络错误',
										icon: 'none'
									});
								}
							});

						}
					}
				});
			},

			// 发起申诉
			appealReport(reportId) {
				uni.navigateTo({
					url: `/pages/report/appeal?reportId=${reportId}`
				});
			},

			// 删除举报记录
			deleteReport(reportId) {
				uni.showModal({
					title: "确认删除",
					content: "确定要删除该举报记录吗？删除后不可恢复。",
					success: (res) => {
						if (res.confirm) {

							uni.request({
								url: this.websiteUrl + '/api/userDenounce/check_report_state',
								method: 'POST',
								data: {
									id: reportId,
									state: 3, //2撤销；3删除；
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {

									if (res.data.status === 'success') {
										this.reports = this.reports.map(report => {
											if (report.report_id === reportId) {
												return {
													...report,
													report_state: 3
												};
											}
											return report;
										});
										uni.showToast({
											title: "已删除记录",
											icon: "success"
										});
										this.getList()	

									} else {
										uni.showToast({
											title: '操作失败',
											icon: 'none'
										});
									}
								},
								fail: (err) => {
									console.error('删除举报失败：', err);
									uni.showToast({
										title: '网络错误',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},

			// 加载更多
			loadMore() {
				if (this.hasMore) {
					this.page++;
					this.getList();
				}
			},
			// 返回上一页
			navigateBack() {
				uni.navigateBack();
			},
			// 获取状态样式类
			// getStatusClass(state, handleType) {
			// 	let baseClass = "status-tag";
			// 	switch (state) {
			// 		case 0:
			// 			return `${baseClass} status-pending`;
			// 		case 1:
			// 			if (handleType === 3) return `${baseClass} status-effective`;
			// 			if (handleType === 1 || handleType === 2) return `${baseClass} status-ineffective`;
			// 			return `${baseClass} status-processed`;
			// 		case 2:
			// 			return `${baseClass} status-canceled`;
			// 		case 3:
			// 			return `${baseClass} status-deleted`;
			// 		default:
			// 			return baseClass;
			// 	}
			// },


			// 删除申诉图片
			deleteAppealImage(index) {
				this.appealImages.splice(index, 1);
				const urls = this.appealImageUrls.split(',');
				urls.splice(index, 1);
				this.appealImageUrls = urls.join(',');
			},

			// 提交申诉
			submitAppeal() {
				if (!this.currentReportId) return;

				if (!this.appealMessage.trim()) {
					return uni.showToast({
						title: '请输入申诉理由',
						icon: 'none'
					});
				}

				if (this.appealImages.length === 0) {
					return uni.showToast({
						title: '请上传申诉凭证',
						icon: 'none'
					});
				}

				uni.showLoading({
					title: '提交中...'
				});

				// 调用申诉接口
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/appeal_sub_report',
					method: 'POST',
					data: {
						id: this.currentReportId,
						remark: this.appealMessage,
						pinzhen_url: this.appealImageUrls
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.status === 'success') {
							uni.showToast({
								title: '申诉提交成功',
								icon: 'success'
							});
							// 关闭弹窗并刷新数据
							// this.toggleAppealModule();
							this.showAppealModule =false;
							// 刷新列表数据
							this.page = 1;
							this.getList();
						} else {
							uni.showToast({
								title: '申诉提交失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						// 关闭弹窗并刷新数据
						
						console.error('提交申诉失败：', err);
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},






			// 获取状态文本
			getStatusText(state, handleType) {
				switch (state) {
					case 0:
						return "未处理";
					case 1:
						if (handleType === 1) return "已处理(无效举报)";
						if (handleType === 2) return "已处理(恶意举报)";
						if (handleType === 3) return "已处理(有效举报)";
						return "已处理";
					case 2:
						return "已取消";
					case 3:
						return "已删除";
					default:
						return "未知状态";
				}
			},
			// 查看举报详情
			viewDetail(report) {
				uni.navigateTo({
					url: `/pagesC/report/reportDetail?reportId=${report.report_id}`
				});
			},

		},
		onReachBottom() {
			// 上拉加载更多
			this.loadMore();
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.page = 1;
			this.reports = [];
			this.hasMore = true;
			this.fetchReports().then(() => {
				uni.stopPullDownRefresh();
			});
		},




		onLoad(e) {
			this.refreshData();
		},
		onShow() {
					// 从其他页面返回时重新加载数据
					this.refreshData();
				},
		onPageScroll(e) {
			var that = this

			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.report-list').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {

					if (that.page * that.size == that.reports.length) {
						that.loadMoreStatus = 'loading';
						console.log("这里")
						that.page++
						this.getList(this.catId)
					}
				}
			}).exec()
		},

		onReady() {
			var that = this
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
		watch: {


		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F6F6F6 !important;
		min-height: 100vh;
		padding-top: 60rpx;
		/* 确保容器至少占满屏幕高度 */
		padding-bottom: 40rpx;
		/* 添加底部内边距 */
	}

	/*header*/
	.uni-page-wrapper {
		background-color: #e93b3d !important;
	}

	.header .uni-navbar {
		border-bottom: solid 1px #e6e6e6;
	}

	.header .uni-navbar view {
		line-height: 50px;
	}

	.header .uni-navbar-header {
		height: 50px;
	}

	.header .uni-navbar-header .uni-navbar-header-btns {
		padding: 0;
	}

	.header .uni-navbar-container {
		margin: 0 20upx;
	}

	.header .uni-navbar .input-view {
		background-color: #FFFFFF;
		border: 1px solid #e6e6e6;
		margin: 9px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	/*popop*/



	.main-title {
		// height: 420rpx;
		// background-image: url('https://images.eqingqu.com/attachs/photo/202509/20250925_C3128FBDE4DC50AE703C24ACBDF9F3C3.jpg');
		padding-top: 40rpx;
		background-repeat: round;
	}





	.chat_1 {
		margin-bottom: 12rpx;
		margin-right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// opacity: 0.7;
		max-height: 70rpx;
		/* #ifndef MP-WEIXIN */
		// width: 92%;
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;

		/* #endif */
		/* #ifdef MP-WEIXIN */
		// width: 75%;
		width: 65%;

		padding: 0rpx 20rpx 0rpx 30rpx;
		/* #endif */

	}

	.selectBox {
		// width: 690rpx;
		/* #ifdef MP-WEIXIN */
		margin-left: 160rpx;
		/* #endif */
		// background-color: #fff;
		border-radius: 50rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		// margin-right: 60rpx;
		.right-icon {
			/*#ifdef MP*/
			padding-top: 6rpx;
			/*#endif*/
		}

		.iconfont {
			/*#ifdef MP*/
			padding-top: 4rpx;
			/*#endif*/
		}

		.top-title {
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 40rpx;
			color: #FFFFFF;
			line-height: 44rpx;
			text-align: left;
			font-style: normal;
		}
	}

	.selectBox input {
		width: 80%;
		line-height: 78rpx;
		padding: 0 20rpx 0 26rpx;
		/* #ifdef MP */
		padding: 0 10rpx 0 20rpx;
		/*#endif*/
		height: 78rpx;
		font-size: 32rpx;

	}



	.icon_wrap {
		background: #272727;
		opacity: 0.35;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;

		.title_ico {
			width: 32rpx;
			height: 32rpx;
			margin: 5px;
		}
	}



	// 内容区域
	.report-container {
		margin: 16rpx;

		.report-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			padding: 8px 16rpx;
			border-radius: 8px;
			margin: 26rpx 0;
		}
	}

	.report-left {
		display: flex;

		image {
			width: 80rpx;
			height: 80rpx;
			margin: 0 16rpx;
		}

		.report-text {
			display: flex;
			flex-direction: column;
		}

		.report-text>text:first-child {
			font-size: 32rpx;
			color: #1B1B1B;
			font-weight: 500;
		}


		.report-text>text:nth-child(2) {
			font-size: 24rpx;
			color: #CCC;
			font-weight: 400;
		}
	}

	.report-list-page {
		background-color: #f5f7fa;
		min-height: 100vh;
	padding-top: 60rpx;
	/* 确保容器至少占满屏幕高度 */
	padding-bottom: 40rpx;
	/* 添加底部内边距 */
	}

	/* 导航栏 */
	.navbar {
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		position: sticky;
		top: 0;
		z-index: 10;

		.back-btn {
			width: 60rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333;
			font-size: 36rpx;
		}

		.nav-title {
			flex: 1;
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			color: #1d2129;
		}
	}

	/* 筛选栏 */
	.filter-bar {
		background-color: #ffffff;
		padding: 15rpx 0;
		border-bottom: 1rpx solid #eee;

		.filter-scroll {
			display: flex;
			/* 使用flex布局 */
			padding: 0 20rpx;

			.filter-item {
				flex: 1;
				/* 每个项目平均分配宽度 */
				text-align: center;
				/* 文字居中 */
				padding: 12rpx 0;
				margin: 0 10rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
				color: #666;
				background-color: #f5f5f5;

				&.active {
					background-color: #0066cc;
					color: #ffffff;
					font-weight: 500;
				}
			}
		}
	}

	/* 举报列表 */
	.report-list {
		padding: 20rpx;
	}

	/* 举报卡片 */
	.report-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* 商品信息 */
	.goods-info {
		display: flex;
		margin-bottom: 25rpx;

		.goods-thumb {
			width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
			background-color: #f5f5f5;
		}

		.goods-details {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.goods-name {
				font-size: 30rpx;
				color: #1d2129;
				line-height: 42rpx;
				max-height: 84rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				margin-bottom: 8rpx;
			}

			.shop-name {
				font-size: 26rpx;
				color: #86909c;
				margin-bottom: 8rpx;
			}

			.report-type {
				display: flex;
				align-items: center;

				.type-label {
					font-size: 24rpx;
					color: #86909c;
					margin-right: 5rpx;
				}

				.type-value {
					font-size: 24rpx;
					color: #0066cc;
					background-color: #f0f7ff;
					padding: 2rpx 10rpx;
					border-radius: 4rpx;
				}
			}
		}
	}

	/* 举报基本信息 */
	.report-basic {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx dashed #eee;

		.report-time,
		.report-sn {
			display: flex;
			font-size: 26rpx;

			.label {
				color: #86909c;
				margin-right: 8rpx;
				white-space: nowrap;
			}

			.value {
				color: #4e5969;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	/* 举报状态 */
	.report-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;

		.status-tag {
			padding: 6rpx 18rpx;
			border-radius: 60rpx;
			font-size: 26rpx;
			font-weight: 500;
		}

		.status-pending {
			background-color: #fff7e6;
			color: #ff8a00;
		}

		.status-processed {
			background-color: #e8f3ff;
			color: #0066cc;
		}

		.status-effective {
			background-color: #e6ffed;
			color: #00b42a;
		}

		.status-ineffective {
			background-color: #fef2f2;
			color: #f53f3f;
		}

		.status-canceled {
			background-color: #f2f3f5;
			color: #86909c;
		}

		.status-deleted {
			background-color: #f2f3f5;
			color: #86909c;
			text-decoration: line-through;
		}
	}

	/* 凭证图片预览 */
	.evidence-preview {
		display: flex;
		align-items: center;

		.evidence-label {
			font-size: 26rpx;
			color: #86909c;
			margin-right: 10rpx;
			white-space: nowrap;
		}

		.evidence-images {
			display: flex;
			position: relative;
			height: 60rpx;

			.evidence-img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 6rpx;
				margin-right: 8rpx;
				border: 1rpx solid #eee;
			}

			.image-count {
				position: absolute;
				right: 8rpx;
				top: 0;
				width: 60rpx;
				height: 60rpx;
				background-color: rgba(0, 0, 0, 0.6);
				color: white;
				font-size: 22rpx;
				border-radius: 6rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	/* 处理信息 */
	.handle-info {
		margin-bottom: 20rpx;
		padding: 15rpx;
		background-color: #f7f8fa;
		border-radius: 8rpx;

		.handle-title {
			font-size: 26rpx;
			color: #1d2129;
			margin-bottom: 8rpx;
			font-weight: 500;
		}

		.handle-content {
			font-size: 26rpx;
			color: #4e5969;
			line-height: 36rpx;
		}
	}

	/* 申诉信息 */
	.appeal-info {
		margin-bottom: 20rpx;
		padding: 15rpx;
		background-color: #fff8e6;
		border-radius: 8rpx;

		.appeal-title {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #ff7d00;
			margin-bottom: 8rpx;

			.appeal-icon {
				margin-right: 8rpx;
				font-size: 28rpx;
			}
		}

		.appeal-content {
			font-size: 26rpx;
			color: #86754d;
			line-height: 36rpx;
		}
	}

	/* 操作按钮 */
	.report-actions {
		display: flex;
		gap: 15rpx;
		justify-content: flex-end;

		.action-btn {
			padding: 8rpx 24rpx;
			border-radius: 6rpx;
			font-size: 26rpx;
			font-weight: 500;
		}

		.cancel-btn {
			background-color: #f2f3f5;
			color: #86909c;
		}

		.appeal-btn {
			background-color: #fff7e6;
			color: #ff8a00;
		}

		.delete-btn {
			background-color: #fef2f2;
			color: #f53f3f;
		}
	}

	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;

		.empty-img {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
			opacity: 0.5;
		}

		.empty-text {
			font-size: 30rpx;
			color: #86909c;
		}
	}

	/* 加载更多 */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
		font-size: 28rpx;
		color: #86909c;

		.loading-spinner {
			width: 30rpx;
			height: 30rpx;
			border: 3rpx solid #ddd;
			border-top-color: #0066cc;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-right: 15rpx;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	/* 申诉弹窗样式 */
		.appeal-mask {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 998;
			opacity: 1;
			transition: opacity 0.3s ease;
		}
	
		.appeal-popup {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ffffff;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			z-index: 999;
			transform: translateY(100%);
			transition: transform 0.3s ease;
			max-height: 80vh;
			display: flex;
			flex-direction: column;
		}
	
		.popup-visible {
			transform: translateY(0);
		}
	
		.popup-visible + .appeal-mask {
			opacity: 1;
		}
	
		.popup-header {
			padding: 25rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #eee;
		}
	
		.popup-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #1d2129;
		}
	
		.close-btn {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #86909c;
			font-size: 36rpx;
		}
	
		.popup-content {
			padding: 30rpx;
			overflow-y: auto;
			flex: 1;
		}
	
		.popup-footer {
			padding: 25rpx 30rpx;
			border-top: 1rpx solid #eee;
		}
	
		/* 申诉表单样式 */
		.appeal-item {
			margin-bottom: 30rpx;
	
			&:last-child {
				margin-bottom: 0;
			}
		}
	
		.appeal-label {
			font-size: 28rpx;
			color: #4e5969;
			margin-bottom: 15rpx;
			display: flex;
			align-items: center;
		}
	
		.required {
			color: #ff4d4f;
			margin-left: 8rpx;
		}
	
		.appeal-textarea {
			width: 100%;
			min-height: 200rpx;
			border: 2rpx solid #dce0e6;
			border-radius: 12rpx;
			padding: 20rpx;
			font-size: 28rpx;
			color: #1d2129;
			line-height: 42rpx;
			box-sizing: border-box;
		}
	
		.char-count {
			text-align: right;
			font-size: 24rpx;
			color: #86909c;
			margin-top: 10rpx;
		}
	
		.uploaded-images {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-bottom: 20rpx;
		}
	
		.image-item {
			position: relative;
			width: 140rpx;
			height: 140rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
	
		.uploaded-img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	
		.delete-btn {
			// position: absolute;
			// top: -15rpx;
			// right: -15rpx;
			// width: 40rpx;
			// height: 40rpx;
			background-color: rgba(0, 0, 0, 0.7);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	
		.delete-icon {
			color: white;
			font-size: 24rpx;
			line-height: 1;
		}
	
		.upload-btn {
			width: 140rpx;
			height: 140rpx;
			border: 2rpx dashed #dce0e6;
			border-radius: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
		}
	
		.upload-icon {
			width: 40rpx;
			height: 40rpx;
			background-color: #dce0e6;
			mask: url('/static/upload-icon.svg') no-repeat center;
			-webkit-mask: url('/static/upload-icon.svg') no-repeat center;
		}
	
		.upload-text {
			font-size: 24rpx;
			color: #86909c;
			text-align: center;
		}
	
		.upload-hint {
			font-size: 24rpx;
			color: #86909c;
			margin-top: 10rpx;
			line-height: 36rpx;
		}
	
		.submit-appeal-btn {
			width: 100%;
			height: 96rpx;
			background-color: #0066cc;
			color: #ffffff;
			font-size: 32rpx;
			font-weight: 500;
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
</style>