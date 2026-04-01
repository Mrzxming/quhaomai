<template>
	<view class="report-container" :style="{ height: gaodu + 'px' }">
		<!-- 标题栏 -->
		<!-- <view class="report-title">{{reportItems.type_name || ''}}</view> -->
		<view class="navbar">
			<view class="back-btn" @click="navigateBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="nav-title">{{reportItems.type_name || ''}}</view>
		</view>
		<!-- 表单卡片 -->
		<view class="form-cationer">
			
			
			
		<view class="form-card" v-if="reportItems">
			<!-- 违规类型组（动态生成） -->
			<view class="form-section" v-if="reportItems.report_list && reportItems.report_list.length">
				<view class="section-header">
					<text class="section-title">请选择违规信息</text>
					<text class="required-mark">*</text>
				</view>

				<view class="radio-options">
					<label class="radio-option" :class="{ active: violationType === item.type_id }"
						@click="handleViolationTypeChange(item.type_id)"
						v-for="(item, index) in reportItems.report_list" :key="index">
						<view class="radio-circle" :class="{ checked: violationType === item.type_id }">
							<view class="radio-dot" v-if="violationType === item.type_id"></view>
						</view>
						<text class="radio-text">{{ item.type_name }}</text>
					</label>
				</view>
			</view>

			<!-- 凭证信息组 -->
			<view class="form-section">
				<view class="form-item" v-if="reportItems.is_show_brand_name === 1">
					<view class="item-label">
						<text>被仿冒的品牌</text>
						<text class="required-mark">*</text>
					</view>

					<!-- 替换为输入框 -->
					<input class="brand-input" v-model="selectedBrand" placeholder="请输入被仿冒的品牌名称" maxlength="50" />
				</view>

				<!-- 原因描述（根据is_show_remark显示） -->
				<view class="form-item" v-if="reportItems.is_show_remark === 1">
					<view class="item-label">
						<text>原因描述</text>
						<text class="required-mark">*</text>
					</view>

					<textarea class="desc-input" v-model="reasonDesc"
						:placeholder="reportItems.remark_tip || '请输入您要描述的原因，中文或英文皆可。'" maxlength="200"></textarea>

					<view class="text-count">{{ reasonDesc.length }} / 200</view>
				</view>

				<!-- 凭证文件（根据is_show_pinzhen_url显示） -->
				<view class="form-item" v-if="reportItems.is_show_pinzhen_url === 1">
					<view class="item-label">
						<text>凭证文件</text>
						<text class="required-mark">*</text>
					</view>

					<view class="upload-area">
						<!-- 已上传图片缩略图 -->
						<view class="uploaded-images" v-if="uploadedFiles.length > 0">
							<view class="image-item" v-for="(file, index) in uploadedFiles" :key="index">
								<image :src="file" class="uploaded-img" mode="aspectFill"></image>
								<view class="delete-btn" @click="deleteImage(index)">
									<text class="delete-icon">×</text>
								</view>
							</view>
						</view>

						<!-- 上传按钮 -->
						<view class="upload-btn" @click="chooseImage" v-if="uploadedFiles.length < 5">
							<view class="upload-icon"></view>
							<text class="upload-text">上传文件</text>
						</view>

						<view class="upload-hint" v-if="reportItems.pinzhen_tip">
							<text v-for="(tip, i) in reportItems.pinzhen_tip.split(',')" :key="i">• {{ tip }}</text>
						</view>

						<view class="uploaded-count" v-if="uploadedFiles.length">
							已上传 {{ uploadedFiles.length }} / 5 个文件
						</view>
					</view>
				</view>

				<!-- 授权聊天记录（只在选择"商家承认售假"时显示） -->
				<view class="form-item" v-if="showAuthChatSection">
					<view class="item-label">
						<text>授权聊天记录</text>
						<text class="required-mark">*</text>
					</view>

					<view class="radio-options">
						<label class="radio-option" :class="{ active: authChat === 'yes' }"
							@click="handleAuthChatChange('yes')">
							<view class="radio-circle" :class="{ checked: authChat === 'yes' }">
								<view class="radio-dot" v-if="authChat === 'yes'"></view>
							</view>
							<view class="radio-content">
								<text class="radio-text">是</text>
								<text class="radio-desc">{{ reportItems.shouquanlt_tip[0] || '同意授权客服查看聊天记录' }}</text>
							</view>
						</label>

						<label class="radio-option" :class="{ active: authChat === 'no' }"
							@click="handleAuthChatChange('no')">
							<view class="radio-circle" :class="{ checked: authChat === 'no' }">
								<view class="radio-dot" v-if="authChat === 'no'"></view>
							</view>
							<view class="radio-content">
								<text class="radio-text">否</text>
								<text class="radio-desc">{{ reportItems.shouquanlt_tip[1] || '现有材料已完整充分' }}</text>
							</view>
						</label>
					</view>

					<!-- 日期选择器（仅当同意授权时显示） -->
					<view class="date-selector-container" v-if="authChat === 'yes'">
					    <DateSelector 
					      ref="dateSelector" 
					      :mode="1"
					      @onChange="onDateSelectorChange" 
					      @onSubmit="onDateSelectorSubmit" 
					      minDate="2020-2-3"
					      maxDate="2025-10-11" 
					    />
					  </view>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-button" @click="submitForm" v-if="reportItems">提交</view>
		</view>
	</view>
</template>

<script>
		import permision from "@/common/permission.js";
	import DateSelector from '@/components/dengrq-datetime-picker/dateSelector/index.vue';
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js';
	import {
		compressImage
	} from '@/common/compressImage.js'
	export default {
		components: {
			DateSelector
		},
		data() {
			return {
				goodsId: '',
				gaodu: '',
				reportItems: null,
				violationType: null, // 当前选中的违规类型ID
				startDate: '', // 开始日期
				endDate: '', // 结束日期
				selectedBrand: '', // 被仿冒的品牌
				reasonDesc: '', // 原因描述
				uploadedFiles: [], // 已上传文件
				pinzhen_url: '',
				authChat: null, // 授权聊天记录选择：yes/no

        isUploading: false, // 防止重复上传
			};
		},
		computed: {
			// 判断是否显示授权聊天记录区域
			showAuthChatSection() {
				// 找到"商家承认售假"的type_id
				const admitFakeTypeId = this.reportItems?.report_list?.find(
					item => item.type_name === '商家承认售假'
				)?.type_id;

				// 只有选择"商家承认售假"时才显示
				return this.violationType === admitFakeTypeId;
			}
		},
		onReady() {
			var that = this
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) *
						2;
				}
			})
			// #endif
		},
		methods: {
			
			
    async checkImagePermission() {
        return new Promise((resolve) => {
          // 微信小程序不需要权限检查，直接允许
          // #ifdef MP-WEIXIN
          resolve(1);
          // #endif
          
          // H5 平台
          // #ifdef H5
          resolve(1);
          // #endif
          
          // APP 平台使用权限检查
          // #ifdef APP-PLUS
          if (typeof permision !== 'undefined' && permision.premissionCheck) {
            permision.premissionCheck("CAMERA_EXTERNAL_STORAGE")
              .then(resolve)
              .catch(() => resolve(0));
          } else {
            resolve(1);
          }
          // #endif
          
          // 其他平台默认允许
          // #ifndef MP-WEIXIN && !H5 && !APP-PLUS
          resolve(1);
          // #endif
        });
      },
			// 选择图片（整合权限检查和平台适配）
      async chooseImage() {
        let that = this;

        // 检查是否已达最大上传数量
        if (this.uploadedFiles.length >= 5) {
          return uni.showToast({
            title: '最多可上传5张图片',
            icon: 'none'
          });
        }

        // 检查是否正在上传
        if (this.isUploading) {
          uni.showToast({
            title: '正在上传中，请稍候',
            icon: 'none'
          });
          return;
        }

        // 检查权限
        const hasPermission = await this.checkImagePermission();
        if (hasPermission !== 1) {
          return uni.showToast({
            title: '请授予文件访问权限',
            icon: 'none'
          });
        }

        // 根据平台调用不同的处理方法
        // #ifdef MP-WEIXIN
        this.handleWeixinImageSelection();
        // #endif

        // #ifndef MP-WEIXIN
        this.handleImageSelection();
        // #endif
      },
			
			
			      // 微信小程序图片上传
			      async uploadWeixinImage(tempPath) {
			        try {
			          // 检查文件大小（微信小程序限制）
			          const fileInfo = await new Promise((resolve, reject) => {
			            uni.getFileInfo({
			              filePath: tempPath,
			              success: resolve,
			              fail: reject
			            });
			          });
			
			          const maxSize = 1024 * 1024 * 10; // 10MB限制
			          let finalPath = tempPath;
			
			          // 如果文件过大，进行压缩
			          if (fileInfo.size > maxSize) {
			            finalPath = await new Promise((resolve, reject) => {
			              uni.compressImage({
			                src: tempPath,
			                quality: 70,
			                success: (res) => {
			                  console.log('图片压缩成功:', res.tempFilePath);
			                  resolve(res.tempFilePath);
			                },
			                fail: (error) => {
			                  console.error('图片压缩失败:', error);
			                  reject(error);
			                }
			              });
			            });
			          }
			
			          // 转换为base64
			          let base64;
			          try {
			            base64 = await pathToBase64(finalPath);
			          } catch (base64Error) {
			            console.warn('Base64转换失败:', base64Error);
			            // 如果base64转换失败，尝试直接上传
			            base64 = '';
			          }
			
			          // 上传到服务器
			          const uploadResult = await this.$store.dispatch('setMaterial', {
			            file: {
			              content: base64
			            },
			            type: 'pinzhen'
			          });
			
			          if (uploadResult.status === 'success' && uploadResult.data.length > 0) {
			            const serverUrl = uploadResult.data[0];
			            // 更新pinzhen_url
			            this.pinzhen_url = this.pinzhen_url ? 
			              `${this.pinzhen_url},${serverUrl}` : 
			              serverUrl;
			            console.log('上传成功，服务器地址:', serverUrl);
			          } else {
			            throw new Error('上传失败');
			          }
			
			        } catch (error) {
			          console.error('微信小程序图片上传失败:', error);
			          // 上传失败，从本地预览中移除
			          const index = this.uploadedFiles.indexOf(tempPath);
			          if (index > -1) {
			            this.uploadedFiles.splice(index, 1);
			          }
			          uni.showToast({
			            title: '图片上传失败',
			            icon: 'none'
			          });
			          throw error;
			        }
			      },
			
			
			      // 微信小程序图片选择逻辑
			      handleWeixinImageSelection() {
			        let that = this;
			        
			        uni.chooseImage({
			          count: 5 - this.uploadedFiles.length,
			          sizeType: ['compressed'], // 微信小程序建议使用压缩模式
			          sourceType: ['album', 'camera'],
			          success: async (res) => {
			            console.log('微信小程序选择图片成功:', res.tempFilePaths);
			            
			            // 显示加载状态
			            this.isUploading = true;
			            uni.showLoading({
			              title: '上传中...',
			              mask: true
			            });
			
			            try {
			              // 逐个处理图片
			              for (let tempPath of res.tempFilePaths) {
			                // 先添加到本地预览
			                that.uploadedFiles.push(tempPath);
			                // 上传到服务器
			                await that.uploadWeixinImage(tempPath);
			              }
			            } catch (error) {
			              console.error('图片处理失败:', error);
			              uni.showToast({
			                title: '图片处理失败',
			                icon: 'none'
			              });
			            } finally {
			              this.isUploading = false;
			              uni.hideLoading();
			            }
			          },
			          fail: (error) => {
			            console.error('微信小程序选择图片失败:', error);
			            // 处理用户取消选择的情况
			            if (error.errMsg !== 'chooseImage:fail cancel') {
			              uni.showToast({
			                title: '选择图片失败',
			                icon: 'none'
			              });
			            }
			          }
			        });
			      },
			
			
			// 处理图片选择逻辑
      handleImageSelection() {
        let that = this;
        uni.chooseImage({
          count: 5 - this.uploadedFiles.length,
          sizeType: ['original', 'compressed'],
          success: (res) => {
            res.tempFilePaths.forEach(tempPath => {
              that.uploadedFiles.push(tempPath);
              that.uploadImage(tempPath);
            });
          }
        });
      },
			// 上传图片到服务器
      async uploadImage(tempPath) {
        let that = this;
        uni.showLoading({
          mask: true,
          title: '上传中...'
        });

        try {
          // #ifdef APP-PLUS
          // APP平台压缩图片（如果需要）
          // tempPath = await compressImage(tempPath);
          // #endif

          // 转换为base64并上传
          const base64 = await pathToBase64(tempPath);
          const uploadResult = await this.$store.dispatch('setMaterial', {
            file: {
              content: base64
            },
            type: 'pinzhen'
          });

          if (uploadResult.status === 'success' && uploadResult.data.length > 0) {
            const newUrl = uploadResult.data[0];
            that.pinzhen_url = that.pinzhen_url ?
              `${that.pinzhen_url},${newUrl}` :
              newUrl;
          } else {
            uni.showToast({
              title: '上传失败',
              icon: 'none'
            });
            const index = that.uploadedFiles.indexOf(tempPath);
            if (index > -1) {
              that.uploadedFiles.splice(index, 1);
            }
          }
        } catch (error) {
          console.error('图片上传失败：', error);
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          });
          const index = that.uploadedFiles.indexOf(tempPath);
          if (index > -1) {
            that.uploadedFiles.splice(index, 1);
          }
        } finally {
          uni.hideLoading();
        }
      },
			// 删除图片
			 deleteImage(index) {
			        // 从本地列表中移除
			        this.uploadedFiles.splice(index, 1);
			        
			        // 从pinzhen_url中移除对应的地址
			        if (this.pinzhen_url) {
			          const urlArray = this.pinzhen_url.split(',');
			          urlArray.splice(index, 1);
			          this.pinzhen_url = urlArray.join(',');
			        }
			      },



			// 处理违规类型变更
			handleViolationTypeChange(typeId) {
				this.violationType = typeId;

				// 切换类型时重置授权选择
				const admitFakeTypeId = this.reportItems?.report_list?.find(
					item => item.type_name === '商家承认售假'
				)?.type_id;

				// 如果切换到非"商家承认售假"类型，清空授权选择
				if (typeId !== admitFakeTypeId) {
					this.authChat = null;
				}
			},

			// 处理授权聊天选择变更
			handleAuthChatChange(value) {
				this.authChat = value;
				console.log(value)
				// 如果选择"是"，可以在这里主动打开日期选择器
				if (value === 'yes' && this.$refs.dateSelector) {
					// 这里可以根据实际组件API调整打开方式
					// 例如: this.$refs.dateSelector.open();
				}
			},

			onDateSelectorChange({
				startDate,
				endDate
			}) {
				this.startDate = startDate;
				this.endDate = endDate;
				console.log('日期选择变更', this.startDate, this.endDate);
			},

			onDateSelectorSubmit({
				startDate,
				endDate
			}) {
				this.startDate = startDate;
				this.endDate = endDate;
				console.log('日期选择确认', this.startDate, this.endDate);
			},

			getList() {
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/getreport_type_report',
					method: 'POST',
					data: {
						id: this.reportId
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('接口返回数据：', res.data);
						if (res.data.status === 'success') {
							this.reportItems = res.data.data;
							// 默认选中第一个违规类型（如果有）
							if (this.reportItems.report_list && this.reportItems.report_list.length) {
								this.violationType = this.reportItems.report_list[0].type_id;
							}
						}
					},
					fail: (err) => {
						console.error('接口请求失败：', err);
					}
				});
			},

			navigateBack() {
				uni.navigateBack()
			},

			submitReport() {
				console.log('上传的参数，this.goodsId',this.goodsId)
				console.log(this.showAuthChatSection ? 1 : 0)
				uni.request({
					url: this.websiteUrl + '/api/userDenounce/sub_report',
					method: 'POST',
					data: {
						report_type: this.reportId,
						weigui_type: this.violationType,
						brand_name: this.selectedBrand,
						remark: this.reasonDesc,
						pinzhen_url: this.pinzhen_url,
						start_time: this.startDate,
						end_time: this.endDate,
						is_shouquanlt: this.authChat == 'yes' ? 1 : 0,
						goods_id: this.goodsId
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log('接口返回数据：', res.data);
						if (res.data.status === 'success') {
							uni.showToast({
								title: res.data.data,
								icon: 'none',
							});
							setTimeout(() => {
									this.navigateBack()
							}, 1000)
						
						}
					},
					fail: (err) => {
						console.error('接口请求失败：', err);
					}
				});
			},


			// 提交表单
			submitForm() {
				// 1. 验证违规类型
				if (this.violationType === null) {
					return uni.showToast({
						title: '请选择违规类型',
						icon: 'none'
					});
				}

				// 2. 验证品牌（输入框必填验证）
				if (this.reportItems.is_show_brand_name === 1 && !this.selectedBrand.trim()) {
					return uni.showToast({
						title: '请输入被仿冒的品牌',
						icon: 'none'
					});
				}

				// 3. 验证原因描述
				if (this.reportItems.is_show_remark === 1 && !this.reasonDesc) {
					return uni.showToast({
						title: '请输入原因描述',
						icon: 'none'
					});
				}

				// 4. 验证凭证文件
				if (this.reportItems.is_show_pinzhen_url === 1 && !this.uploadedFiles.length) {
					return uni.showToast({
						title: '请上传凭证文件',
						icon: 'none'
					});
				}

				// 5. 验证授权聊天记录（只在显示时验证）
				if (this.showAuthChatSection && this.authChat === null) {
					return uni.showToast({
						title: '请选择是否授权聊天记录',
						icon: 'none'
					});
				}

				// 6. 如果同意授权，验证日期是否选择
				if (this.authChat === 'yes' && (!this.startDate || !this.endDate)) {
					return uni.showToast({
						title: '请选择聊天记录的日期范围',
						icon: 'none'
					});
				}
				let params = {
					report_type: this.violationType,
					brand_name: this.selectedBrand,
					remark: this.reasonDesc,
					files: this.pinzhen_url,
					authChat: this.authChat,
					start_time: this.startDate,
					end_time: this.endDate,
					is_shouquanlt: this.showAuthChatSection ? 1 : 0,
				};
				// 提交数据
				console.log('最终提交数据：', {
					report_type: this.violationType,
					weigui_type: this.violationType,
					brand_name: this.selectedBrand,
					remark: this.reasonDesc,
					files: this.pinzhen_url,
					authChat: this.authChat,
					start_time: this.startDate,
					end_time: this.endDate,
					is_shouquanlt: this.showAuthChatSection ? 1 : 0,
				});
				// 调用提交接口
				this.submitReport();
			}
		},

		onLoad(e) {
			console.log('这是列表从商品列表传过来的参数，是否有Id',e)
			console.log('这是列表从商品列表传过来的参数，是否有Id',e.id)
			this.goodsId = e.id;
			this.reportId = e.report_id;
			this.getList()
		},
	};
</script>

<style lang="scss" scoped>
	/* 保持原有样式不变 */
	.main-title {
		padding-top: 40rpx;
		background-repeat: round;
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
	.form-cationer {
		padding: 20rpx;
	}
	.chat_1 {
		margin-bottom: 12rpx;
		margin-right: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		max-height: 70rpx;
		/* #ifndef MP-WEIXIN */
		width: 92%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 65%;
		padding: 0rpx 20rpx 0rpx 30rpx;
		/* #endif */
	}

	.selectBox {
		/* #ifdef MP-WEIXIN */
		margin-left: 160rpx;
		/* #endif */
		border-radius: 50rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

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
			color: #1b1b1b;
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

	/* 基础样式 */
	.report-container {
	
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-top: 60rpx;
		/* 确保容器至少占满屏幕高度 */
		padding-bottom: 40rpx;
		/* 添加底部内边距 */
	}

	/* 标题样式 */
	.report-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1d2129;
		text-align: center;
		margin: 30rpx 0 40rpx;
	}

	/* 表单卡片 */
	.form-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx 24rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* 表单区块 */
	.form-section {
		margin-bottom: 40rpx;
	}

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #1d2129;
	}

	.required-mark {
		color: #ff4d4f;
		font-size: 30rpx;
		margin-left: 8rpx;
	}

	/* 单选按钮样式 */
	.radio-options {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.radio-option {
		display: flex;
		align-items: flex-start;
		padding: 20rpx;
		border-radius: 12rpx;
		transition: background-color 0.2s;
	}

	.radio-option.active {
		background-color: #f0f7ff;
	}

	.radio-circle {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #c9cdD4;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
		margin-top: 4rpx;
		flex-shrink: 0;
	}

	.radio-circle.checked {
		border-color: #0066cc;
		background-color: #e8f3ff;
	}

	.radio-dot {
		width: 16rpx;
		height: 16rpx;
		background-color: #0066cc;
		border-radius: 50%;
	}

	.radio-content {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.radio-text {
		font-size: 28rpx;
		color: #1d2129;
		line-height: 40rpx;
	}

	.radio-desc {
		font-size: 24rpx;
		color: #86909c;
		line-height: 32rpx;
	}

	/* 表单项样式 */
	.form-item {
		margin-bottom: 36rpx;
	}

	.item-label {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		font-size: 28rpx;
		color: #4e5969;
	}

	.item-label-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 30rpx;
		color: #1B1B1B;
		line-height: 48rpx;
		text-align: left;
		font-style: normal;
	}

	/* 文本域样式 */
	.desc-input {
		width: 100%;
		min-height: 200rpx;
		border: 2rpx solid #dce0e6;
		border-radius: 12rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #1d2129;
		line-height: 40rpx;
	}

	.desc-input::placeholder {
		color: #86909c;
	}

	.text-count {
		text-align: right;
		font-size: 24rpx;
		color: #86909c;
		margin-top: 12rpx;
	}

	/* 上传区域样式 */
	.upload-area {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.upload-btn {
		width: 180rpx;
		height: 180rpx;
		border: 2rpx dashed #dce0e6;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		margin-top: 10rpx;
	}

	.upload-icon {
		width: 80rpx;
		height: 50rpx;
		background-color: #dce0e6;
		mask: url('https://images.eqingqu.com/attachs/photo/202509/20250926_33E46CE8466257540BD91C6BA9BAE6E6.png') no-repeat center;
		-webkit-mask: url('https://images.eqingqu.com/attachs/photo/202509/20250926_33E46CE8466257540BD91C6BA9BAE6E6.png') no-repeat center;
	}

	.upload-text {
		font-size: 26rpx;
		color: #86909c;
	}

	.upload-hint {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		font-size: 24rpx;
		color: #86909c;
		line-height: 32rpx;
	}

	.uploaded-count {
		font-size: 26rpx;
		color: #0066cc;
		margin-top: 8rpx;
	}

	/* 提交按钮 */
	.submit-button {
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
		margin-top: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 102, 204, 0.3);
	}

	/* 被仿冒的品牌输入框样式 */
	.brand-input {
		width: 100%;
		height: 88rpx;
		border: 2rpx solid #dce0e6;
		border-radius: 12rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #1d2129;
	}

	.brand-input::placeholder {
		color: #86909c;
	}

	.uploaded-images {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-bottom: 20rpx;
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
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 36rpx;
		height: 36rpx;
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
	
	
	/* 日期选择器容器 */
	.date-selector-container {
	  position: relative;
	  margin-top: 20rpx;
	  padding: 20rpx;
	  background: #f8f9fa;
	  border-radius: 12rpx;
	  border: 1px solid #e9ecef;
	}
	
	/* 确保表单卡片内的布局正常 */
	.form-card {
	  background-color: #ffffff;
	  border-radius: 16rpx;
	  padding: 30rpx 24rpx;
	  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	  position: relative; /* 确保内部元素正常定位 */
	  overflow: visible; /* 确保子元素不被裁剪 */
	}
	
	/* 表单项调整 */
	.form-item {
	  margin-bottom: 36rpx;
	  position: relative;
	  overflow: visible; /* 确保日期选择器不被裁剪 */
	}
</style>