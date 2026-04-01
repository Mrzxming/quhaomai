<template>
	<view class="profile">
		<view class="uni-card uni-card-not">
			<view class="s-user-top">
				<view class="user-bg-box-1">
					<image :src="imagePath.user_profile_1" class="img"></image>
				</view>
				<view class="user-bg2-box-1">
					<image :src="imagePath.user_profile_2" class="img"></image>
				</view>
				<view class="user_profile_box">
					<view class="user-img" @click="chooseImage">
						<image :src="userInfo.avatar" class="img" v-if="userInfo.avatar"></image>
					</view>
					<view class="profile-index-top">
						<text v-if="userInfo.name != ''">{{ userInfo.name }}</text>
						<text v-else>{{ userInfo.username }}</text>
						<view class="username">{{$t('lang.username')}} {{ userInfo.username }}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('name')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">{{$t('lang.nickname')}}</text>
						<view class="value">{{userInfo.name}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('isSex')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">{{$t('lang.sex')}}</text>
						<view class="value">{{isSex}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('birthday')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">{{$t('lang.birthday')}}</text>
						<view class="value">{{userInfo.birthday}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<navigator url="../address/address" hover-class="none">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover">
						<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
							<text class="title">{{$t('lang.address')}}</text>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="uni-card uni-card-not" v-if="isAppPlatform">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-switch">
					<view class="uni-list-cell-navigate uni-navigate">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_D94E819C0C9136681EAC0712DD918228.png" class="notification-icon" />
							<text class="title">系统通知</text>
						</view>
					</view>
					<view class="value">
						<switch :checked="notificationEnabled" :key="'notification-switch-' + notificationEnabled + '-' + switchKey" @change="onNotificationSwitchChange" color="#FE2F02" />
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<view class="uni-card uni-card-not">
			<!-- <view class="uni-list" @click="$outerHref('/pagesB/realname/realname',$isLogin(),userInfo.mobile)"> -->
			<view class="uni-list" @click="$outerHref('/pagesB/realname/realnameFace',$isLogin(),userInfo.mobile)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_AAD9391DD2922A1F0F9DD0FA6FC9BAAE.png" class="notification-icon" />
							<text class="title">{{$t('lang.real_name')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<navigator url="../accountsafe/accountsafe" hover-class="none">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover">
						<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
							<view class="notification-content">
								<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_AEFECC60B8867C8B9BFE95FE3E635EA8.png" class="notification-icon" />
								<text class="title">{{$t('lang.account_security')}}</text>
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<navigator url="../help/help" hover-class="none">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover">
						<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
							<view class="notification-content">
								<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_E5E678A14E497DB95C79711CFF0062AC.png" class="notification-icon" />
								<text class="title">{{$t('lang.use_help')}}</text>
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="versionData">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="updateAppStore">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_D9ADAF7E245854B35B7ABBF226C528F9.png" class="notification-icon" />
							<text class="title">{{$t('lang.ban_new')}}</text>
						</view>
						<view class="value">{{$t('lang.zui_new')}}{{ versionData.content.version_id }}</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="toDirectionalPush">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_2E4F423BBBAC02F8D67AD6E6366FCBC9.png" class="notification-icon" />
							<text class="title">个性化推荐</text>
						</view>
						<view class="value">{{directionalPush}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onClearCache">
					<view class="uni-list-cell-navigate uni-navigate-badge">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_73438910D57AE2115A877EF44AB92517.png" class="notification-icon" />
							<text class="title">{{$t('lang.clear_cache')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onAccountCancellation">
					<view class="uni-list-cell-navigate uni-navigate-badge">
						<view class="notification-content">
							<image src="https://images.eqingqu.com/attachs/photo/202601/20260122_C7AB6443E61BD2245E0FF1333F77F714.png" class="notification-icon" />
							<text class="title">{{$t('lang.account_cancellation')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="profile-btn">
			<button type="warn" plain="true" @click="handelLogout">{{$t('lang.drop_out')}}</button>
		</view>
		<view class="copyright">
			<view class="copyright-content">
				<view class="onelist-hidden">
					{{configData.copyright_text_mobile ? configData.copyright_text_mobile : 'Copyright©2015-2021'}}
				</view>
				<!-- <view>{{wgtinfo.name}} {{$t('lang.ban_quan')}}</view> -->
				<view> {{$t('lang.ban_quan')}}</view>
				<!-- #ifdef APP-PLUS -->
				<view>{{$t('lang.ban')}}{{wgtinfo.version}}</view>
				<!-- #endif -->
			</view>
			<text class="link" @click="linkHref">{{$t('lang.ban_yinsi')}}</text>
		</view>

		<!--popup-->
		<uni-popup :show="show" type="right" v-on:hidePopup="handelClose()" class="profile-popup">
			<view class="my-box">
				<view class="uni-card uni-card-not">
					<view class="uni-list" v-if="typeState == 'name'">
						<view class="uni-list-cell uni-list-cell-last">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.nickname')}}</text>
								<view class="value uni-cell-input"><input v-model="nickName"
										:placeholder="$t('lang.nickname')"></view>
							</view>
						</view>
						<view class="uni-list-cell-tip">{{$t('lang.ban_yinsi_1')}}</view>
					</view>
					<view class="uni-list" v-else-if="typeState == 'isSex'">
						<view class="user-sex">
							<view class="left" :class="{'active':isSexNum == 1}" @click="handleSex(1)">
								<view class="iconfont icon-nan"></view>
								<text>{{$t('lang.male')}}</text>
							</view>
							<view class="right" :class="{'active':isSexNum == 2}" @click="handleSex(2)">
								<view class="iconfont icon-nv"></view>
								<text>{{$t('lang.woman')}}</text>
							</view>
						</view>
					</view>
					<view class="uni-list" v-else>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="title">{{$t('lang.birthday')}}</text>
								<view class="value uni-cell-input">
									<picker mode="date" :value="birthday" :start="startDate" :end="endDate"
										@change="bindDateChange" class="picker">
										<view class="uni-input">{{birthday}}</view>
									</picker>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn-bar">
					<view class="btn" :class="[nicknameDisabled > 0 ? 'btn-disabled' : 'btn-red']" @click="updateInfo">
						{{$t('lang.confirm_on')}}
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 注销店铺 -->
		<!-- 遮罩层 -->
		<view v-if="show_logoff">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare_sx">
				<view class="wxshare_2_1">注销账号申请</view>
				<view style="position: absolute; right: 30rpx;top: 40rpx;" @click="setlogoffNo">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
						style="height: 50rpx;width: 50rpx;"></image>
				</view>
				<view style="text-align: left;margin-left: 30rpx;font-size: 28rpx;">请留言</view>
				<view
					style="margin: 20rpx 30rpx;padding: 20rpx 30rpx;border-radius: 10rpx;height: 200rpx;font-size: 26rpx;text-align: left;border: 2rpx solid #eeeeee;">
					<textarea @input="toInput" :value="title" style="width: 100%;font-size: 26rpx;height: 200rpx;"
						maxlength="300" placeholder-style="color:#999999;font-size: 26rpx;width: 100%;"
						placeholder="您的建议是我们进步的动力。" />
				</view>

				<view
					style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 100rpx;padding: 0 30rpx;">
					<view class="add_box3_1_a_sx" @click="logoffno">联系客服</view>
					<view class="add_box3_a_sx" @click="logoffyes">注销申请</view>
					
				</view>
				<view style="height: 100rpx;"></view>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view v-if="photo_show">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare_y" style="background-color: #ffffff;">
				<view style="font-size: 38rpx;margin: 50rpx 50rpx 0rpx 50rpx;text-align: center;">温馨提示</view>
				<view style="font-size: 28rpx;margin: 50rpx;text-align: center;">是否打开拍照/相册服务功能</view>
				<view style="display: flex;flex-direction: row;margin-bottom: -20rpx;">
					<view class="add_box3_buy_1_s" @click="photo_showNo">取消</view>
					<view class="add_box3_buy_1_y" @click="photo_showYes">确定</view>
				</view>
			</view>
		</view>

		<!-- 定向推送 -->
		<!-- 遮罩层 -->
		<view v-if="showDirectionalPush">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1" v-if="directionalPush =='开启'">是否关闭定向推送</view>
				<view class="wxshare_3_1" v-if="directionalPush =='关闭'">是否开启定向推送</view>
				<view style="height: 100rpx;"></view>
				<!-- <view>{{title}}</view> -->
				<!-- <view class="wxshareContent">{{content}}</view> -->
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view class="add_box3_1_a" @click="toShowDirectionalPushNo">我再想想</view>
					<view class="add_box3_a" @click="toShowDirectionalPushYes" v-if="directionalPush =='开启'">确定关闭</view>
					<view class="add_box3_a" @click="toShowDirectionalPushYes" v-if="directionalPush =='关闭'">确定开启</view>
				</view>
			</view>
		</view>
	
	
	<!-- 注销确认模态框 -->
	<view v-if="show_logoff_yess">
	  <view class="cover" catchtouchmove="true"></view>
	  <view class="wxshare_sx">
	    <view class="wxshare_2_1">注销账号提示</view>
	    <view style="position: absolute; right: 30rpx;top: 40rpx;" @click="setlogoffNos">
	      <image
	        src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
	        style="height: 50rpx;width: 50rpx;"></image>
	    </view>
	    
	    <!-- 内容区域 - 使用后端返回的 zhux_content -->
	    <scroll-view scroll-y="true" style="height: 600rpx;padding: 30rpx;text-align: left;">
	      <view style="font-size: 28rpx;color: #333;line-height: 45rpx;">
	        <rich-text :nodes="zhuxContent"></rich-text>
	      </view>
	    </scroll-view>
	    
	    <!-- 勾选框和链接 -->
	    <view style="display: flex;align-items: center;padding: 20rpx 30rpx;">
	      <checkbox :checked="agreeCancel" @click="agreeCancel = !agreeCancel" style="transform:scale(0.8);"/>
	      <text style="font-size: 26rpx;color: #666;">已阅读并同意</text>
	      <text @click="openCancelAgreement" style="font-size: 26rpx;color: #4b89dc;margin-left: 5rpx;">《账号注销协议》</text>
	    </view>
	    
	    <!-- 确认按钮 -->
	    <view style="display: flex;flex-direction: row;justify-content: center;margin-top: 40rpx;padding: 0 30rpx;">
	      <view 
	        class="add_box3_a_sx" 
	        :style="{background: agreeCancel ? '#e64340' : '#ccc'}"
	        @click="confirmCancelAccount">
	        确认注销
	      </view>
	    </view>
	    <view style="height: 100rpx;"></view>
	  </view>
	</view>
	
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniPopup from '@/components/uni-popup.vue';
	import permision from "@/common/permission.js"
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	import {
		compressImage
	} from '@/common/compressImage.js'
	//#ifdef APP-PLUS
	var jpushModule = uni.requireNativePlugin("JG-JPush")
	jpushModule.addTagAliasListener(result => {
		console.log('111222333getRegistrationID', result);
		console.log(JSON.stringify(result))
	})
	//#endif
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				show: false,
				logoutState: true,
				typeState: '',
				imageSrc: '',
				wgtinfo: {},
				timer: '',
				nickName: '',
				nicknameDisabled: 0,
				versionData: '',
				privacy_article_id: '',
				configData: uni.getStorageSync('configData'),
				show_logoff: false,
				urls: '',
				title: '',

				photo_show: false,

				directionalPush: '开启',
				showDirectionalPush: false,
			 show_logoff_yess: false, // 控制新模态框显示
				notificationEnabled: false, // 通知权限是否开启（跟随系统状态）
				switchKey: 0, // 用于强制 switch 组件重新渲染
				agreeCancel: false,      // 是否同意注销协议
				zhuxContent: '',         // 存储后端返回的注销内容
				zhuxUrl: '',             // 存储后端返回的注销协议URL
				applycancel_text: ''     // 存储留言内容
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
			// 判断是否是 APP 平台（运行时判断，作为条件编译的补充）
			isAppPlatform() {
				// #ifdef APP-PLUS
				return true;
				// #endif
				// #ifndef APP-PLUS
				return false;
				// #endif
			},
			isSexNum: {
				get() {
					return this.userInfo.sex;
				},
				set(val) {
					this.$store.dispatch('userUpdateText', {
						type: 'sex',
						val: val
					});
				}
			},
			nick_name: {
				get() {
					return this.userInfo.name;
				},
				set(val) {
					this.nickName = val
				}
			},
			birthday: {
				get() {
					return this.userInfo.birthday;
				},
				set(val) {
					this.$store.dispatch('userUpdateText', {
						type: 'birthday',
						val: val
					});
				}
			},
			isSex() {
				let sexArr = [this.$t('lang.secrecy'), this.$t('lang.male'), this.$t('lang.woman')];
				return sexArr[this.isSexNum];
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
			setlogoffNo: function() {
				var that = this
				that.show_logoff = false
			},
			setlogoffNos: function() {
				var that = this
				that.show_logoff_yess = false
				that.agreeCancel = false
			},
			 // 获取注销相关信息
  async getCancelInfo() {
    try {
      const response = await uni.request({
       url: this.websiteUrl + '/api/user/profile',
       method: 'GET',
       header: {
       	'Content-Type': 'application/json',
       	'token': uni.getStorageSync('token'),
       	'X-Client-Hash': uni.getStorageSync('client_hash')
       },
	 
      });
      
      if (response[1].data.status === 'success') {
        this.zhuxContent = response[1].data.data.zhux_content;
        this.zhuxUrl = response[1].data.data.zhux_content_url;
      }
    } catch (error) {
      console.error('获取注销信息失败:', error);
    }
  },
    
    // 打开注销协议
    openCancelAgreement() {
      if (this.zhuxUrl) {
		  let  url = this.zhuxUrl
       if (url.indexOf('http') != -1) {
       	this.articleId = url.match(/-(\d+)\./)[1]
       	console.log(1333, this.articleId);
       	this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
       	// uni.setStorageSync("webtitle", '资讯内容');
       	// this.$outerHref(url)
       }
      } else {
        uni.showToast({
          title: '协议链接不存在',
          icon: 'none'
        });
      }
    },
	
	
	 // 确认注销账号
	  confirmCancelAccount() {
		  var that  = this;
	    if (!that.agreeCancel) {
	      uni.showToast({
	        title: '请先阅读并同意注销协议',
	        icon: 'none'
	      });
	      return;
	    }
	    
	    uni.showLoading({ title: '处理中...' });
	   uni.request({
	   	url: that.websiteUrl + '/api/user/users_cancel',
	   	method: 'POST',
	   	data: {
	   		applycancel_text: that.title
	   	},
	   	header: {
	   		'Content-Type': 'application/json',
	   		'token': uni.getStorageSync('token'),
	   		'X-Client-Hash': uni.getStorageSync('client_hash')
	   	},
	     success: (res) => {
	     	if (res.data.status == 'success') {
				uni.hideLoading();
				that.title = ''
				that.agreeCancel = false
				that.show_logoff_yess = false
			
	     		uni.showToast({
	     			icon: 'none',
	     			title: res.data.data
	     		})
	     	}
	     },
	     complete() {
			   uni.hideLoading();
	     	that.show_logoff = false
			that.agreeCancel = false
			that.title = ''
			that.show_logoff_yess = false
			
	     }
	    });
	  },
			
			logoffyes: function() {
				var that = this
				if (that.title == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入留言',
						style: {
							'z-index': 99999
						}
					})
					return 
				} 
				
				// 保存留言内容
				  this.applycancel_text = this.title;
				  // 关闭留言模态框
				  this.show_logoff = false;
				  // 显示注销确认模态框
				  this.show_logoff_yess = true;
			},
			logoffno: function() {
				var that = this
				that.show_logoff = false
				that.linkHrefs(that.urls)
				// uni.navigateTo({
				// 	url:"/pages/commonly/kefu/kefu?shop_id=" + that.shop_id + '&shop_name=' + that.shop_name + '&token='+ that.tokens
				// })
			},
			getStringLen(str) {
				let i, len, code;
				if (str == null || str == '') return 0;
				len = str.length;

				for (i = 0; i < len; i++) {
					code = str.charCodeAt(i);
					if (code > 255) {
						len++;
					}
				}
				return len;
			},
			async chooseImage() {
				let that = this
				// #ifdef H5
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];
						// #ifdef APP-PLUS
						that.uploadImage();
						// #endif

						// #ifdef MP-WEIXIN
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 10,
								success: (result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage();
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage();
						}
						// #endif
					}
				})
				// #endif
				// #ifndef H5
				var result = await permision.premissionCheck("CAMERA_EXTERNAL_STORAGE")
				console.log(JSON.stringify(result))
				if (result == 1) {
					// 此处处理各自业务 如：uni.chooseImage 
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						success: (res) => {
							that.imageSrc = res.tempFilePaths[0];
							// #ifdef APP-PLUS
							that.uploadImage();
							// #endif

							// #ifdef MP-WEIXIN
							let size = res.tempFiles[0].size; //上传图片大小
							let maxSize = 1024 * 1024 * 2; //最大可上传2mb
							if (size > maxSize) {
								uni.compressImage({
									src: res.tempFilePaths[0],
									quality: 10,
									success: (result) => {
										that.imageSrc = result.tempFilePath;
										that.uploadImage();
									},
									fail: (result) => {
										console.log(result)
									}
								})
							} else {
								that.uploadImage();
							}
							// #endif
						}
					})
				}
				// #endif
			},

			photo_showNo: function() {
				this.photo_show = false
				// uni.navigateBack()
			},
			photo_showYes: function() {
				var that = this
				that.photo_show = false
				uni.setStorageSync("photo_1", true);
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						that.imageSrc = res.tempFilePaths[0];
						// #ifdef APP-PLUS
						that.uploadImage();
						// #endif

						// #ifdef MP-WEIXIN
						let size = res.tempFiles[0].size; //上传图片大小
						let maxSize = 1024 * 1024 * 2; //最大可上传2mb
						if (size > maxSize) {
							uni.compressImage({
								src: res.tempFilePaths[0],
								quality: 10,
								success: (result) => {
									that.imageSrc = result.tempFilePath;
									that.uploadImage();
								},
								fail: (result) => {
									console.log(result)
								}
							})
						} else {
							that.uploadImage();
						}
						// #endif
					}
				})
			},
			async uploadImage() {
				let that = this;
				uni.showLoading({
					mask: true,
					title: this.$t('lang.shang_chu')
				});

				//app压缩图片
				// #ifdef APP-PLUS
				that.imageSrc = await compressImage(that.imageSrc);
				// #endif
				console.log(that.imageSrc)
				pathToBase64(that.imageSrc).then(base64 => {
					this.$store.dispatch('setMaterial', {
						file: {
							content: base64
						},
						type: 'touxian'
					}).then(data => {
						console.log(data)
						if (data.status == 'success') {
							uni.hideLoading();
							this.$store.dispatch('userUpdateAvatar', {
								pic: data.data[0]
							});
						}
					})
				}).catch(error => {
					console.error(error, 5);
				});
			},
			isShow(val) {
				console.log(val)
				this.show = true;
				if (val == 'name') {
					this.nickName = this.userInfo.name
				}
				this.typeState = val;
			},
			handelClose() {
				this.show = false
				this.nicknameDisabled = 0;
				this.nickName = this.userInfo.name
			},
			handleSex(val) {
				this.isSexNum = val
			},
			bindDateChange: function(e) {
				this.birthday = e.target.value
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			updateInfo() {
				if (this.nicknameDisabled == 1) {
					uni.showToast({
						title: this.$t('lang.ban_yinsi_2'),
						icon: 'none'
					})
					return
				} else if (this.nicknameDisabled == 2) {
					uni.showToast({
						title: this.$t('lang.up_to_20_characters_can_be_entered'),
						icon: 'none'
					})
					return
				}

				let o = {
					sex: this.isSexNum,
					name: this.nickName ? this.nickName : this.nick_name,
					birthday: this.birthday
				}

				this.$store.dispatch('updateProfile', o);
				this.show = false
			},
			handelLogout() {
				let that = this
				uni.showModal({
					content: this.$t('lang.user_logout'),
					success: function(res) {
						if (res.confirm) {
							that.$store.dispatch('userLogout');

							//清除入驻信息
							uni.removeStorageSync("merchantInfo");
							uni.removeStorageSync("merchantsData");
							uni.removeStorageSync("token");
							//#ifdef APP-PLUS
							jpushModule.clearLocalNotifications()
							jpushModule.deleteAlias({
								'sequence': 1
							})
							//#endif
							//#ifdef MP-WEIXIN
							uni.navigateTo({
								url: 'pages/user/user'
							});
							//#endif
							// uni.navigateBack()
						}
					}
				})
			},
			onClearCache() {
				uni.showModal({
					content: this.$t('lang.is_clear_cache'),
					success: res => {
						if (res.confirm) {
							uni.clearStorage();
							uni.clearStorageSync();
							let platform = '';
							//#ifdef APP-PLUS
							platform = 'APP';
							//#endif
							//#ifdef H5
							platform = 'H5';
							//#endif
							//#ifdef MP-WEIXIN
							platform = 'MP-WEIXIN';
							//#endif
							uni.setStorageSync('platform', platform);
							uni.setStorageSync('showOne', true);
							plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
								uni.setStorageSync('wgtinfo', JSON.stringify(wgtinfo))
							})
							uni.showLoading({
								title: '清除缓存中。。。'
							});
							setTimeout(function() {
								uni.hideLoading();
								self.$outerHref('/pages/middles/middles', 'app');
							}, 1000);
						}
					}
				});
			},
			onAccountCancellation() {
				var that = this
				that.show_logoff = true;
			},
		async appUpdate() {
			const params = {
				appid: this.updateAppid
			};
			console.log('调用 setAppUpdate 接口，上传的参数：', params);
			const {
				data,
				status
			} = await this.$store.dispatch('setAppUpdate', params);

				if (status == 'success') {
					console.log(666666, data)
					this.versionData = data
				}
			},
			updateAppStore() {
				
				var that = this
				
				let wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'));
				console.log('wgtinfo',wgtinfo.version)
				console.log('versionData',that.versionData.content.version_id)
				if (that.versionData.content.version_id > wgtinfo.version) {
					plus.runtime.openURL(that.versionData.content.download_url)
				} else {
					uni.showToast({
						title: that.$t('lang.ban_yinsi_3'),
						icon: 'none'
					});
				}
				// if (uni.getSystemInfoSync().brand && uni.getSystemInfoSync().brand == 'Huawei') {
				// 	return;
				// } else {
				// 	if (that.versionData.content.version_id > wgtinfo.version) {
				// 		plus.runtime.openURL(that.versionData.content.download_url)
				// 	} else {
				// 		uni.showToast({
				// 			title: that.$t('lang.ban_yinsi_3'),
				// 			icon: 'none'
				// 		});
				// 	}
				// }
			},
			shopConfig() {
				uni.request({
					url: this.websiteUrl + '/api/shop/config',
					method: 'GET',
					data: {
						app_version: incrementVersion()
					},
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
						// console.log(data)
						if (data.privacy.article_id) {
							this.privacy_article_id = data.privacy.article_id
						}
					}
				});
			},
			linkHref() {
				if (this.privacy_article_id) {
					// uni.navigateTo({
					// 	url:'/pagesC/article/detail/detail?id=' + this.privacy_article_id + '&show=false'
					// })
					uni.setStorageSync("url", 'https://7.eqingqu.com/page/privacy_policy_gonghuo.html');
					uni.setStorageSync("webtitle", '隐私政策');
					uni.navigateTo({
						url: '/pagesB/webviews/webviews'
					});
				} else {
					uni.showToast({
						title: this.$t('lang.ban_yinsi_4'),
						icon: "none"
					})
				}
			},
			// 工具栏自定义
			getCustomNav() {
				let referer = uni.getStorageSync('platform').toLowerCase()
				if (uni.getStorageSync('platform') == 'MP-WEIXIN') {
					referer = 'wxapp'
				}

				uni.request({
					url: this.websiteUrl + '/api/user/touch_nav',
					method: 'POST',
					data: {
						device: referer
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						for (var i = 0; i < res.data.data[0].child_nav.length; i++) {
							if (res.data.data[0].child_nav[i].name == '平台客服') {
								this.urls = res.data.data[0].child_nav[i].url
							}
						}
					}
				})
			},
			linkHrefs(url) {
				if (url.indexOf('http') != -1) {
					this.$outerHref(url)
				} else {
					this.$outerHref(url, 'app')
				}
			},

			toDirectionalPush: function() {
				var that = this
				that.showDirectionalPush = true
			},

			toShowDirectionalPushYes: function() {
				var that = this
				that.showDirectionalPush = false
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(function() {
					uni.hideLoading()
					if (that.directionalPush == "关闭") {
						that.directionalPush = "开启"
					} else {
						that.directionalPush = "关闭"
					}
					uni.setStorageSync('directionalPush', that.directionalPush)
				}, 1000);
			},
			toShowDirectionalPushNo: function() {
				var that = this
				that.showDirectionalPush = false
			},
			
			// 检查通知权限状态
			checkNotificationPermission() {
				console.log('[通知权限检查] 开始检查通知权限状态');
				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform;
				console.log('[通知权限检查] 平台:', platform);
				const oldValue = this.notificationEnabled;
				let newValue = false;
				if (platform == "ios") {
					// iOS 使用已有的权限检查函数
					newValue = permision.judgeIosPermission("push");
					console.log('[通知权限检查] iOS权限检查结果:', newValue, '旧值:', oldValue);
				} else if (platform == "android") {
					// Android 检查通知权限
					var main = plus.android.runtimeMainActivity();
					var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
					if (NotificationManagerCompat == null) {
						NotificationManagerCompat = plus.android.importClass("androidx.core.app.NotificationManagerCompat");
					}
					newValue = NotificationManagerCompat.from(main).areNotificationsEnabled();
					console.log('[通知权限检查] Android权限检查结果:', newValue, '旧值:', oldValue);
				}
				
				// 更新权限状态
				this.notificationEnabled = newValue;
				// 更新 switchKey 强制 switch 组件重新渲染
				this.switchKey++;
				console.log('[通知权限检查] 最终 notificationEnabled 值:', this.notificationEnabled, 'switchKey:', this.switchKey);
				// 强制更新视图
				this.$forceUpdate();
				// #endif
			},
			
			// 通知开关变化处理
			onNotificationSwitchChange(e) {
				console.log('[开关变化] 用户点击开关，新值:', e.detail.value, '当前 notificationEnabled:', this.notificationEnabled);
				// #ifdef APP-PLUS
				const newValue = e.detail.value; // 用户想要的新状态
				
				// 先检查当前系统权限状态
				this.checkNotificationPermission();
				console.log('[开关变化] 权限检查后 notificationEnabled:', this.notificationEnabled);
				
				// 无论用户点击开启还是关闭，都恢复开关状态到系统权限状态，然后跳转到设置页面
				// 这样用户必须去系统设置中操作，不能通过开关直接改变状态
				console.log('[开关变化] 用户点击开关，恢复状态并跳转设置');
				
				// 立即恢复开关状态到系统权限状态
				// 如果系统权限是开启的，保持开启；如果是关闭的，保持关闭
				// 因为 checkNotificationPermission 已经更新了 notificationEnabled，这里只需要强制更新视图
				this.switchKey++; // 更新 key 强制重新渲染
				this.$forceUpdate();
				console.log('[开关变化] 恢复状态后 notificationEnabled:', this.notificationEnabled);
				
				// 跳转到设置页面（使用已验证可用的方法）
				this.openTongZhi();
				// #endif
			},
			
			// 开启通知 - 跳转到系统设置
			openTongZhi() {
				let platform = uni.getSystemInfoSync().platform;
				// #ifdef APP-PLUS
				if (platform == "ios") {
					try {
						var UIApplication = plus.ios.import("UIApplication");
						var application = UIApplication.sharedApplication();
						var NSURL = plus.ios.import("NSURL");
						
						// 尝试方式1：使用 plus.runtime.openURL
						try {
							plus.runtime.openURL("app-settings:");
							plus.ios.deleteObject(NSURL);
							plus.ios.deleteObject(application);
							return;
						} catch (e1) {
							// 方式1 失败，继续尝试方式2
						}
						
						// 尝试方式2：使用 application.openURL
						var settingsURL = NSURL.URLWithString("app-settings:");
						var openResult = application.openURL(settingsURL);
						
						if (openResult === true) {
							plus.ios.deleteObject(settingsURL);
							plus.ios.deleteObject(NSURL);
							plus.ios.deleteObject(application);
							return;
						}
						
						// 如果都失败，显示提示
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							showCancel: false,
							confirmText: '知道了'
						});
						
						plus.ios.deleteObject(settingsURL);
						plus.ios.deleteObject(NSURL);
						plus.ios.deleteObject(application);
					} catch (e) {
						uni.showModal({
							title: '打开设置',
							content: '无法自动打开设置，请手动前往：设置 > 通知 > 找到"趣好卖" > 开启"允许通知"',
							showCancel: false,
							confirmText: '知道了'
						});
					}
				} else if (platform == "android") {
					try {
						var main = plus.android.runtimeMainActivity();
						var pkName = main.getPackageName();
						var Intent = plus.android.importClass("android.content.Intent");
						var Build = plus.android.importClass("android.os.Build");
						var Settings = plus.android.importClass("android.provider.Settings");
						var Uri = plus.android.importClass("android.net.Uri");
						var intent = null;
						
						if (Build.VERSION.SDK_INT >= 26) {
							intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
							intent.putExtra("android.provider.extra.APP_PACKAGE", pkName);
						} else if (Build.VERSION.SDK_INT >= 21) {
							intent = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
							intent.putExtra("app_package", pkName);
							var uid = main.getApplicationInfo().plusGetAttribute("uid");
							intent.putExtra("app_uid", uid);
						} else {
							intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
							var uri = Uri.parse("package:" + pkName);
							intent.setData(uri);
						}
						
						intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						main.startActivity(intent);
					} catch (e) {
						uni.showToast({
							title: '请手动前往设置 > 应用 > 通知中开启',
							icon: 'none'
						});
					}
				}
				// #endif
			},
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/profile/profile'
			}
		},
		onLoad() {

			// #ifdef APP-PLUS
			this.wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'))
			this.appUpdate();
			// #endif

			this.shopConfig();
		},
		onShow() {
			console.log('[onShow] 页面显示，当前 notificationEnabled:', this.notificationEnabled);
			 // 获取注销相关信息
			  this.getCancelInfo();
			this.$store.dispatch('userProfile');
			this.getCustomNav();
			if (uni.getStorageSync('directionalPush')) {
				this.directionalPush = uni.getStorageSync('directionalPush')
			} else {
				this.directionalPush = '开启'
			}
			// #ifdef APP-PLUS
			// 先立即检查一次（快速响应）
			console.log('[onShow] 立即检查权限');
			this.checkNotificationPermission();
			console.log('[onShow] 立即检查完成，当前 notificationEnabled:', this.notificationEnabled);
			
			// 再延迟检查一次（确保从设置页面返回后权限状态已完全更新）
			console.log('[onShow] 准备延迟检查权限，300ms后执行');
			setTimeout(() => {
				console.log('[onShow] 延迟检查开始，当前 notificationEnabled:', this.notificationEnabled);
				this.checkNotificationPermission();
				console.log('[onShow] 延迟检查完成，当前 notificationEnabled:', this.notificationEnabled);
			}, 300);
			// #endif
		},
		watch: {
			nickName() {
				let length = this.getStringLen(this.nickName);
				if (length < 2) {
					this.nicknameDisabled = 1;
				} else if (length > 20) {
					this.nicknameDisabled = 2;
				} else {
					this.nicknameDisabled = 0;
				}
			}
		}
	}
</script>

<style>
	.s-user-top {
		padding: 22upx 20upx;
		position: relative;
	}

	.s-user-top .user-bg-box-1 {
		width: 90upx;
		height: 32upx;
		position: absolute;
		right: 0;
		top: 20upx;
	}

	.s-user-top .user-bg2-box-1 {
		width: 91upx;
		height: 36upx;
		position: absolute;
		bottom: 0;
		left: 20upx;
	}

	.s-user-top .user_profile_box {
		display: flex;
		flex-direction: row;
	}

	.s-user-top .user_profile_box .user-img {
		width: 108upx;
		height: 108upx;
		border-radius: 50%;
		border: 2px solid #EEEEEE;
	}

	.s-user-top .user_profile_box .user-img .img {
		border-radius: 50%;
	}

	.s-user-top .user_profile_box .profile-index-top {
		flex: 1;
		margin-left: 30upx;
	}

	.s-user-top .user_profile_box .profile-index-top text {
		font-size: 32upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.s-user-top .user_profile_box .profile-index-top .username {
		font-size: 25upx;
		color: #777777;
	}

	.my-box .uni-card {
		margin: 0;
	}

	.my-box .uni-list-cell-navigate {
		justify-content: flex-start;
	}

	.my-box .uni-list-cell-navigate .title {
		padding: 20upx 0;
		font-size: 32upx;
		margin-right: 20upx;
		color: #333333;
	}

	.my-box .uni-list-cell-navigate .value {
		font-size: 28upx;
		color: #666;
	}

	.my-box .btn-bar {
		padding: 0 30upx;
		margin-top: 20upx;
	}

	.user-sex {
		display: flex;
		flex-direction: row;
		padding: 50upx 30upx;
		justify-content: center;
		text-align: center;
	}

	.user-sex .left,
	.user-sex .right {
		flex: 1 1 0%;
		color: #b2b2b2;
	}

	.user-sex .iconfont {
		font-size: 130upx;
		line-height: normal;
	}

	.user-sex .left.active {
		color: #3fc6ff;
	}

	.user-sex .right.active {
		color: #f36ab7;
	}

	.picker {
		width: 100%;
	}

	.copyright {
		text-align: center;
		margin-top: 100rpx;
		padding-bottom: 50rpx;
	}

	.copyright-content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.copyright view {
		font-size: 25upx;
		color: #999999;
	}

	.copyright .link {
		color: #4b89dc;
		font-size: 25upx;
	}

	.profile-btn {
		margin: 40upx 30upx 0;
	}

	.profile-btn button {
		font-size: 32upx;
	}

	.uni-popup-right {
		width: 80%;
	}

	/* 仅针对当前页面的 profile-popup 设置白色背景 */
	/* 只设置内容区域背景，避免使用深度选择器影响其他页面 */
	.profile .profile-popup .my-box {
		background-color: #ffffff;
		min-height: 100vh;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.cover {
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

	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #ffffff;
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}

	.wxshare_sx {
		text-align: center;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0%;
		left: 0%;
		z-index: 9999;
	}

	.wxshare_2_1 {
		margin-top: 50rpx;
		margin-bottom: 36rpx;
		font-size: 34rpx;
	}

	.add_box3_a_sx {
		width: 48%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #ffffff;
		background-color: #e64340;
		border-radius: 10rpx;
		font-size: 34rpx;
	}

	.add_box3_1_a_sx {
		width: 48%;
		height: 90rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 34rpx;
	}

	.wxshare_y {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background-color: #FAFAFA;
		position: fixed;
		top: 25%;
		left: 10%;
		z-index: 9999;
	}


	.add_box3_buy_1_s {
		width: 40%;
		height: 70rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-top: 50rpx;
		margin-left: 8%;
		color: #888888;
		font-size: 30rpx;
	}

	.add_box3_buy_1_y {
		width: 38%;
		height: 70rpx;
		background-color: #e64340;
		border-radius: 10rpx;
		text-align: center;
		line-height: 70rpx;
		margin-top: 50rpx;
		margin-left: 5%;
		margin-bottom: 80rpx;
		color: #ffffff;
		font-size: 30rpx;
	}

	.wxshare_3_1 {
		font-size: 32rpx;
		margin-bottom: 50rpx;
		margin-top: 50rpx;
	}

	.add_box3_a_sx {
		width: 48%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: #ffffff;
		background-color: #5C93FF;
		border-radius: 10rpx;
		font-size: 34rpx;
	}

	.add_box3_1_a_sx {
		width: 48%;
		height: 90rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 90rpx;
		color: #888888;
		font-size: 34rpx;
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

	.wxshareContent {
		margin: -20rpx 30rpx 150rpx 30rpx;
		font-size: 28rpx;
		text-align: left;
	}
	
	/* 确保内容区域可滚动 */
	scroll-view {
	  box-sizing: border-box;
	}
	
	/* 复选框样式 */
	checkbox {
	  margin-right: 10rpx;
	}
	
	/* 按钮禁用样式 */
	.add_box3_a_sx[disabled] {
	  background-color: #ccc !important;
	}

	/* 系统通知图标和内容样式 */
	.notification-content {
	  display: flex;
	  align-items: center;
	}

	.notification-icon {
	  width: 46rpx;
	  height: 46rpx;
	  margin-right: 20rpx;
	  flex-shrink: 0;
	}
</style>