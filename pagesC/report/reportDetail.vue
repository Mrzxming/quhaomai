<template>
	<view class="report-detail-page" :style="{ height: gaodu + 'px' }">
		<!-- 内容与之前保持一致 -->
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="back-btn" @click="navigateBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="nav-title">举报详情</view>
		</view>

		<!-- 举报状态卡片 -->
		<view class="status-card" v-if="report">
			<view class="status-info">
				<view class="status-text">{{ getStatusText(report.report_state, report.handle_type) }}</view>
				<view class="report-sn">流水号: {{ report.report_sn }}</view>
			</view>
			<!-- 修复这里的 :class 绑定 -->
			<view class="status-tag" :class="{
			  'status-pending': report.report_state === 0,
			  'status-processed': report.report_state === 1 && ![1, 2, 3].includes(report.handle_type),
			  'status-ineffective': report.report_state === 1 && (report.handle_type === 1 || report.handle_type === 2),
			  'status-effective': report.report_state === 1 && report.handle_type === 3,
			  'status-canceled': report.report_state === 2,
			  'status-deleted': report.report_state === 3
			}">
				{{ getStatusText(report.report_state, report.handle_type) }}
			</view>
		</view>

		<view class="detail-content" v-if="report">
			<!-- 商品信息 -->
			<view class="detail-section">
				<view class="section-title">举报商品</view>
				<view class="goods-info">
					<image class="goods-thumb" :src="report.goods_thumb || defaultGoodsImg" mode="aspectFill"></image>
					<view class="goods-details">
						<view class="goods-name">{{ report.goods_name }}</view>
						<view class="shop-name">商家: {{ report.shop_name }}</view>
					</view>
				</view>
			</view>

			<!-- 举报信息 -->
			<view class="detail-section">
				<view class="section-title">举报信息</view>
				<view class="info-item">
					<view class="info-label">举报类型</view>
					<view class="info-value">{{ report.type_name }}</view>
				</view>
				<view class="info-item">
					<view class="info-label">违规类型</view>
					<view class="info-value">{{ report.title_name }}</view>
				</view>
				<view class="info-item">
					<view class="info-label">举报时间</view>
					<view class="info-value">{{ report.add_time }}</view>
				</view>
				<view class="info-item">
					<view class="info-label">聊天授权时段</view>
					<view class="info-value">{{ report.shouquanlt || '未授权' }}</view>
				</view>
				<view class="info-item full-width">
					<view class="info-label">举报内容</view>
					<view class="info-value multi-line">{{ report.inform_content }}</view>
				</view>
			</view>

			<!-- 举报凭证 -->
			<view class="detail-section" v-if="report.img_url && report.img_url.length">
				<view class="section-title">举报凭证</view>
				<view class="evidence-images">
					<image v-for="(img, index) in report.img_url" :key="index" :src="img" mode="aspectFill"
						class="evidence-img" @click="previewImage(img, report.img_url)"></image>
				</view>
			</view>

			<!-- 处理结果 -->
			<view class="detail-section" v-if="report.report_state === 1">
				<view class="section-title">处理结果</view>
				<view class="info-item full-width">
					<view class="info-label">处理时间</view>
					<view class="info-value">{{ report.handle_time ? formatTime(report.handle_time) : '暂无' }}</view>
				</view>
				<view class="info-item full-width">
					<view class="info-label">处理内容</view>
					<view class="info-value multi-line">{{ report.handle_message || '暂无处理信息' }}</view>
				</view>
			</view>

			<!-- 申诉信息 -->
			<view class="detail-section" v-if="report.appeal_state !== 0">
				<view class="section-title">申诉信息</view>
				<view class="info-item">
					<view class="info-label">申诉状态</view>
					<view class="info-value">{{ getAppealStatusText(report.appeal_state) }}</view>
				</view>
				<view class="info-item">
					<view class="info-label">申诉时间</view>
					<view class="info-value">{{ report.appeal_time ? formatTime(report.appeal_time) : '暂无' }}</view>
				</view>
				<view class="info-item full-width" v-if="report.appeal_message">
					<view class="info-label">申诉内容</view>
					<view class="info-value multi-line">{{ report.appeal_message }}</view>
				</view>

				<!-- 申诉凭证 -->
				<view class="evidence-section" v-if="report.appeal_img_url && report.appeal_img_url.length">
					<view class="info-label">申诉凭证</view>
					<view class="evidence-images">
						<image v-for="(img, index) in report.appeal_img_url" :key="index" :src="img" mode="aspectFill"
							class="evidence-img" @click="previewImage(img, report.appeal_img_url)"></image>
					</view>
				</view>

				<!-- 申诉回复 -->
				<view class="info-item full-width" v-if="report.appeal_reply">
					<view class="info-label">平台回复</view>
					<view class="info-value multi-line">{{ report.appeal_reply }}</view>
				</view>
				<view class="info-item" v-if="report.appeal_reply_time">
					<view class="info-label">回复时间</view>
					<view class="info-value">{{ formatTime(report.appeal_reply_time) }}</view>
				</view>
			</view>

			<!-- 操作按钮区域 -->
			<view class="operation-bar" v-if="report && showOperationBar">
				<view class="action-btn cancel-btn" v-if="report.report_state === 0" @click="cancelReport">
					取消举报
				</view>
				<view class="action-btn appeal-btn" v-if="canAppeal && report.appeal_state === 0"
					@click="toggleAppealModule">
					发起申诉
				</view>
				<view class="action-btn delete-btn" v-if="report.report_state !== 3" @click="deleteReport">
					删除记录
				</view>
			</view>
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
						maxlength="200"></textarea>
					<view class="char-count">{{ appealMessage.length }} / 200</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				report: null, // 举报详情数据，初始为null
				defaultGoodsImg: 'https://picsum.photos/200/200',
				showAppealModule: false, // 是否显示申诉模块
				appealMessage: '', // 申诉理由
				appealImages: [], // 申诉凭证图片
				appealImageUrls: '' // 申诉凭证图片地址字符串
			};
		},
		computed: {
			// 是否可以申诉
			canAppeal() {
				return this.report && this.report.report_state === 1 &&
					(this.report.handle_type === 1 || this.report.handle_type === 2);
			},
			// 是否显示操作栏
			showOperationBar() {
				// 已删除状态不显示操作栏
				return this.report && this.report.report_state !== 3;
			}
		},
		onLoad(options) {
			// 从路由参数获取举报ID
			this.reportId = options.reportId;
			// 获取举报详情
			this.getReportDetail();
		},
		methods: {
			// 获取举报详情（通过列表接口并匹配ID）
			getReportDetail() {
				uni.showLoading({
					title: '加载中...'
				});
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/my_report_list',
					method: 'POST',
					data: {
						// 列表接口需要的参数，根据实际情况调整
						page: 1,
						size: 100, // 足够大的数量以确保能获取到目标记录
						appeal_state: 1 // 1我的举报；2我的申述
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						console.log('举报列表数据：', res.data);
						if (res.data.status === 'success' && res.data.data && res.data.data.length > 0) {
							// 根据reportId匹配对应的举报记录
							const matchedReport = res.data.data.find(item => {
								// 确保类型一致再比较
								return item.report_id.toString() === this.reportId.toString();
							});

							if (matchedReport) {
								this.report = matchedReport;
							} else {
								uni.showToast({
									title: '未找到该举报记录',
									icon: 'none'
								});
								// 2秒后返回上一页
								setTimeout(() => {
									this.navigateBack();
								}, 2000);
							}
						} else {
							uni.showToast({
								title: '获取详情失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('获取举报列表失败：', err);
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			toggleAppealModule() {
				this.showAppealModule = !this.showAppealModule;

				// 控制背景滚动
				const page = getCurrentPages()[getCurrentPages().length - 1];
				const scrollView = page.$getAppWebview().children()[0];

				if (this.showAppealModule) {
					// 显示弹窗时禁止背景滚动
					scrollView.setStyle({
						overflow: 'hidden'
					});
				} else {
					// 隐藏弹窗时恢复滚动
					scrollView.setStyle({
						overflow: 'auto'
					});
					// 重置表单
					this.appealMessage = '';
					this.appealImages = [];
					this.appealImageUrls = '';
				}
			},


			// 返回上一页
			navigateBack() {
				uni.navigateBack();
			},

			// 获取举报状态文本
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

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				// 处理秒级时间戳
				const date = new Date(timestamp * 1000);
				return date.toLocaleString('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit'
				}).replace(/\//g, '-');
			},

			// 预览图片
			previewImage(current, urls) {
				uni.previewImage({
					current: current,
					urls: urls
				});
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
									id: this.report.report_id,
									state: 2, //2撤销；3删除；
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
			
									if (res.data.status === 'success') {
										
										uni.showToast({
											title: "已取消举报",
											icon: "success"
										});
										this.getReportDetail()	
		
			
				// 延迟返回，确保数据已更新
				// setTimeout(() => {
				// 	this.navigateBack();
				// }, 500);
		
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

			// 删除举报
			deleteReport() {
				uni.showModal({
					title: "确认删除",
					content: "确定要删除该举报记录吗？删除后不可恢复。",
					success: (res) => {
						if (res.confirm) {
							
							uni.request({
								url: this.websiteUrl + '/api/userDenounce/check_report_state',
								method: 'POST',
								data: {
									id: this.report.report_id,
									state: 3, //2撤销；3删除；
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								success: (res) => {
							
									if (res.data.status === 'success') {
										
										uni.showToast({
											title: "已删除记录",
											icon: "success"
										});
										
							
								setTimeout(() => {
									this.navigateBack();
								}, 500);
						
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

			// 更新举报状态（取消或删除）
			updateReportState(reportId, state) {
				uni.showLoading({
					title: '处理中...'
				});
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/update_report_state',
					method: 'POST',
					data: {
						report_id: reportId,
						state: state
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.status === 'success') {
							const actionText = state === 2 ? "取消成功" : "删除成功";
							uni.showToast({
								title: actionText,
								icon: 'success'
							});

							// 重新获取列表数据以更新当前举报详情
							setTimeout(() => {
								this.getReportDetail();

								// 延迟返回，确保数据已更新
								setTimeout(() => {
									this.navigateBack();
								}, 500);
							}, 1000);
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('更新举报状态失败：', err);
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 提交申诉
			submitAppeal() {
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
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/appeal_sub_report',
					method: 'POST',
					data: {
						id: this.report.report_id,
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

							// 重新获取最新数据
							this.getReportDetail();

							// 隐藏申诉模块
							this.showAppealModule = false;
							this.appealMessage = '';
							this.appealImages = [];
							this.appealImageUrls = '';
						} else {
							uni.showToast({
								title: '申诉提交失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('提交申诉失败：', err);
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 其他方法保持不变
			toggleAppealModule() {
				this.showAppealModule = !this.showAppealModule;
			},

			chooseAppealImage() {
				const count = 5 - this.appealImages.length;
				if (count <= 0) return;

				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						// 显示本地图片
						this.appealImages = this.appealImages.concat(res.tempFilePaths);

						// 实际项目中上传图片到服务器并获取URL
						// 这里简化处理
						this.uploadAppealImages(res.tempFilePaths);
					}
				});
			},

			uploadAppealImages(filePaths) {
				// 实际项目中实现图片上传逻辑
				// 这里仅做模拟
				filePaths.forEach(path => {
					// 模拟上传后的URL
					const mockUrl = `https://example.com/upload/${Date.now()}.png`;
					this.appealImageUrls = this.appealImageUrls ?
						`${this.appealImageUrls},${mockUrl}` :
						mockUrl;
				});
			},

			deleteAppealImage(index) {
				this.appealImages.splice(index, 1);

				// 从URL字符串中移除
				const urls = this.appealImageUrls.split(',');
				urls.splice(index, 1);
				this.appealImageUrls = urls.join(',');
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 样式保持不变 */
	.report-detail-page {
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-bottom: 120rpx;
		padding-top: 60rpx;
		/* 确保容器至少占满屏幕高度 */
		
		
		/* 为底部操作栏预留空间 */
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

	/* 其他样式保持不变 */
	.status-card {
		background-color: #ffffff;
		padding: 30rpx;
		margin: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.status-info {
			.status-text {
				font-size: 34rpx;
				font-weight: 600;
				color: #1d2129;
				margin-bottom: 8rpx;
			}

			.report-sn {
				font-size: 24rpx;
				color: #86909c;
			}
		}

		.status-tag {
			padding: 8rpx 20rpx;
			border-radius: 60rpx;
			font-size: 28rpx;
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

	/* 其余样式保持不变 */
	.detail-content {
		padding: 0 20rpx;
	}

	.detail-section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.section-title {
			font-size: 30rpx;
			font-weight: 500;
			color: #1d2129;
			padding-bottom: 15rpx;
			margin-bottom: 15rpx;
			border-bottom: 1rpx solid #f5f5f5;
		}
	}

	.goods-info {
		display: flex;

		.goods-thumb {
			width: 160rpx;
			height: 160rpx;
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
			}
		}
	}

	.info-item {
		display: flex;
		padding: 12rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}

		.info-label {
			width: 200rpx;
			font-size: 26rpx;
			color: #86909c;
			flex-shrink: 0;
		}

		.info-value {
			flex: 1;
			font-size: 26rpx;
			color: #1d2129;
			word-break: break-all;
		}

		&.full-width {
			flex-direction: column;

			.info-label {
				width: auto;
				margin-bottom: 8rpx;
			}

			.info-value {
				width: 100%;
			}
		}

		.multi-line {
			line-height: 40rpx;
		}
	}

	.evidence-images {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 15rpx;

		.evidence-img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
			object-fit: cover;
		}
	}

	.evidence-section {
		margin-top: 15rpx;

		.info-label {
			font-size: 26rpx;
			color: #86909c;
			margin-bottom: 10rpx;
		}
	}

	.appeal-module {
		background-color: #fff8e6;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;

		.section-title {
			font-size: 30rpx;
			font-weight: 500;
			color: #ff7d00;
			padding-bottom: 15rpx;
			margin-bottom: 15rpx;
			border-bottom: 1rpx solid #ffe8cc;
		}

		.appeal-item {
			margin-bottom: 25rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.appeal-label {
				font-size: 26rpx;
				color: #86754d;
				margin-bottom: 12rpx;
				display: flex;
				align-items: center;
			}

			.required {
				color: #ff4d4f;
				margin-left: 5rpx;
			}

			.appeal-textarea {
				width: 100%;
				min-height: 180rpx;
				background-color: #ffffff;
				border: 1rpx solid #ffe8cc;
				border-radius: 8rpx;
				padding: 16rpx;
				font-size: 26rpx;
				color: #1d2129;
				line-height: 40rpx;
				box-sizing: border-box;
			}

			.char-count {
				text-align: right;
				font-size: 24rpx;
				color: #86754d;
				margin-top: 8rpx;
			}
		}
	}

	.uploaded-images {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-bottom: 15rpx;
	}

	.image-item {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.uploaded-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-btn {
		// position: absolute;
		// top: -10rpx;
		// right: -10rpx;
		// width: 36rpx;
		// height: 36rpx;
		background-color: rgba(0, 0, 0, 0.6);
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
		width: 120rpx;
		height: 120rpx;
		border: 2rpx dashed #ffb400;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
	}

	.upload-icon {
		width: 36rpx;
		height: 36rpx;
		background-color: #ffb400;
		mask: url('/static/upload-icon.svg') no-repeat center;
		-webkit-mask: url('/static/upload-icon.svg') no-repeat center;
	}

	.upload-text {
		font-size: 22rpx;
		color: #ff7d00;
		text-align: center;
	}

	.upload-hint {
		font-size: 24rpx;
		color: #86754d;
		margin-top: 10rpx;
	}

	.submit-appeal-btn {
		width: 100%;
		height: 90rpx;
		background-color: #ff7d00;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
	}

	.operation-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		padding: 15rpx 20rpx;
		border-top: 1rpx solid #eee;
		display: flex;
		gap: 15rpx;
		z-index: 9;

		.action-btn {
			flex: 1;
			height: 80rpx;
			border-radius: 8rpx;
			font-size: 28rpx;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
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