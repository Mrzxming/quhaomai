<template>
	<view class="container bgf6" style="height: 100%;background-color: #f5f5f5;">
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
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png"
						style="width: 30rpx;height: 30rpx;">
					</image>
				</view>

				<view class="banbtn" style="margin-top: -20rpx;font-size: 32rpx;margin-left: 70rpx;">商品搬家</view>
				<view class="search_submit">
					<!-- <view style="padding-right: 30rpx;" @click="toknow">
						<image src="/pagesC/static/guide/quesGuide.png" style="width: 40rpx;height: 40rpx;"></image>
					</view> -->
					<view style="" @click="tokefu">
						<image
							src="https://images.eqingqu.com/attachs/photo/202308/20230822_69383A8470B3DA55EE9570267B558CA2.png"
							style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- </view> -->
		<view class="banvideo" style=""></view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="bantop" style=""></view>
		<!-- #endif -->
		<!-- <view :class="revertShow==true?'swiper-boxs':'swiper-box'"> -->
			<scroll-view class="main-content" scroll-y="true" :style="{ height: `calc(100vh - ${navHeight}px)` }">
					<view class="content-wrapper">
			<!-- <view style="width: 100%; height: 570rpx;margin: 0rpx 30rpx 100rpx 0rpx;position: relative;top: 0%;">
				<image
					src="https://images.eqingqu.com/attachs/photo/202409/20240928_A30C127DF771FE4500A1F7FE6284817B.png"
					@click="toweb" style="height: 70rpx;width: 98%;background-color: #FE0302;" mode="">
				</image>
				<image
					src="https://images.eqingqu.com/attachs/photo/202409/20240928_0010C0E1D107392F5743DEA904C93B1A.png"
					@click="toOpen" style="height: 570rpx;width: 100%;background-color: blue;" mode="">
				</image>
			</view> -->
			<view class="top-video" @click="toweb">
				
					<text class="video-text">因平台接口限制，绑定需同时下载【嘚嘚象】工具，即可获得铺货功能权限。</text>
				
				<image
					src="https://images.eqingqu.com/attachs/photo/202511/20251110_57CEC6CA5DE1CA774E8D5ECF994D8E39.png"
					 class="video-img" style="height: 30rpx;width: 30rpx;" mode="">
				</image>
				<text style="font-weight: 500;
font-size: 28rpx;
color: #FE2F02;">查看教程</text>
			</view>
		
			<!-- 绑定 /解绑 -->
			<view class="account-section">
			  <!-- 未绑定状态 -->
			  <view v-if="waimaiList.length == 0" class="unbind-state">
			    <view class="bind-card">
			      <view class="bind-text text-center">
			        <view class="bind-title">您还没有绑定嘚嘚象帐号</view>
			        <view class="bind-subtitle">请先下载嘚嘚象APP绑定目标铺货店铺</view>
			      </view>
			      <view class="bind-actions vertical">
			        <view class="bind-btn"  style="margin-right: 0;"  @click="$refs.member.open()">嘚嘚象帐号绑定</view>
			        <view class="laylist-btn" @click="tolaylist()" >
			          <image src="https://images.eqingqu.com/attachs/photo/202510/20251028_1C3EBB790BB1D09B15F63A3D4A112485.png"  mode="" class="btn-icon"></image>
			          铺货单
			          <view class="badge" v-if="huodan && huodan.length>0"></view>
			        </view>
			      </view>
			    </view>
			  </view>
			
			  <!-- 已绑定状态 -->
			  <view v-else class="binded-state">
			    <view class="binded-card" v-for="(item,index) in waimaiList" :key="index">
			      <view class="card-header">
			        <view class="platform-name">
			          <view v-if="item.type == 1" class="platform-tag">趣好卖平台</view>
			          <view v-else-if="item.type == 2" class="platform-tag">美团平台</view>
			          <view v-else-if="item.type == 3" class="platform-tag">饿了么平台</view>
			        </view>
			        <view class="action-btn">
			          <view v-if="item.type != 1 && item.is_bind==false" 
			                class="switch-btn" @click="cutCheckeds(item,index)">切换</view>
			          <view v-else-if="item.type != 1 && item.is_bind==true" 
			                class="default-tag">默认店铺</view>
			          <view v-else class="unbind-btn" @click="gounBind()">账号解绑</view>
			        </view>
			      </view>
			      <view class="card-content" @click="item.type != 1 ? cutCheckeds(item,index) : null">
			        <radio v-if="item.type != 1" 
			               style="transform:scale(0.6);vertical-align: middle;" 
			               color="#FE0302" 
			               :checked="item.is_bind"></radio>
			        <view class="store-info">
			          <view class="info-item">门店编号：{{item.poi_code}}</view>
			          <view class="info-item">门店名称：{{item.poi_name}}</view>
			          <view class="info-item">绑定时间：{{item.bind_time}}</view>
			        </view>
			      </view>
			    </view>
			  </view>
			</view>
			
			
			
			<!-- 绑定 /解绑end  -->
			
			<!-- 已绑定状态下的铺货单入口 -->
			<view class="account-section" v-if="waimaiList.length > 0">
				<view style="display: flex; justify-content: center;">
					<view class="laylist-btn" @click="tolaylist()">
						<image src="https://images.eqingqu.com/attachs/photo/202510/20251028_1C3EBB790BB1D09B15F63A3D4A112485.png" mode="" class="btn-icon"></image>
						铺货单
						<view class="badge" v-if="huodan && huodan.length>0"></view>
					</view>
				</view>
			</view>
			
			<!-- 支持第三方 start -->
			
			<!-- 支持第三方平台 -->
			<view class="third-platform-section" v-if="code_url && code_url.length > 0">
			  <view class="section-header">
			    <view class="section-title-wrapper">
			      <view class="title-line left-line"></view>
			      <view class="section-title">支持铺货第三方平台</view>
			      <view class="title-line right-line"></view>
			    </view>
			  </view>
			  <view class="platform-scroll-container">
			    <scroll-view class="platform-scroll" scroll-x="true" show-scrollbar="false">
			      <view class="platform-list">
			        <view class="platform-item" v-for="(item, index) in code_url" :key="index">
			          <image class="platform-image" :src="item" mode="aspectFit"></image>
			        </view>
			      </view>
			    </scroll-view>
			  </view>
			</view>
			
			<!-- 支持第三方 end -->
			
			<view style="width: 100%; position: relative;top: 0%;">
				<view class="" style="width: 94%;margin: 36rpx  30rpx;">
					<p class="fs32 co1b" style="position: relative;">铺货流程</p>
					
					<!-- 步骤流程容器 -->
					<view class="process-container">
						<!-- 步骤一 -->
						<view class="process-step-wrapper">
							<!-- 步骤标题在上方 -->
							<view class="step-title-row">
								<view class="step-left-title">
									<view class="step-number">①</view>
									<view class="step-number-text">步骤一</view>
								</view>
							</view>
							<!-- 内容区域（包含左侧虚线和右侧卡片） -->
							<view class="step-content-row">
								<!-- 左侧虚线区域 -->
								<view class="step-left-column">
									<view class="dashed-line-container">
										<view class="dashed-line-extend"></view>
										<view class="arrow-down-icon"></view>
									</view>
								</view>
								<!-- 右侧内容卡片（有背景和阴影） -->
								<view class="step-content-card">
									<!-- 第一行：下载嘚嘚象APP 立即下载 -->
									<view class="step-header">
										<view class="step-title">下载嘚嘚象APP</view>
										<view class="step-download" @click="toOpen">立即下载</view>
									</view>
									<!-- 中间图标 -->
									<image 
										src="https://images.eqingqu.com/attachs/photo/202511/20251125_1710FFDF54550F55D2B10DE94EE0248F.png" 
										class="step-image" 
										mode="aspectFit"
										@click="toOpen">
									</image>
									<!-- 第三行：两行文案 -->
									<view class="step-desc-wrapper">
										<view class="step-desc-black">免费注册后在【运营-店铺绑定】绑定要铺货的三方店铺</view>
										<view class="step-desc-red">（美团、抖音、饿了么、拼多多、京东秒送等店铺）</view>
									</view>
								</view>
							</view>
						</view>
						
						<!-- 步骤二 -->
						<view class="process-step-wrapper">
							<!-- 步骤标题在上方 -->
							<view class="step-title-row">
								<view class="step-left-title">
									<view class="step-number">②</view>
									<view class="step-number-text">步骤二</view>
								</view>
							</view>
							<!-- 内容区域（包含左侧虚线和右侧卡片） -->
							<view class="step-content-row">
								<!-- 左侧虚线区域 -->
								<view class="step-left-column">
									<view class="dashed-line-container">
										<view class="dashed-line-extend"></view>
										<view class="arrow-down-icon"></view>
									</view>
								</view>
								<!-- 右侧内容卡片（有背景和阴影） -->
								<view class="step-content-card">
									<view class="step-header">
										<view class="step-title">在趣好卖（本页顶部）绑定嘚嘚象APP帐号</view>
									</view>
									<image 
										src="https://images.eqingqu.com/attachs/photo/202511/20251125_AE5FE3F95DC1C42A410D0546023E4E66.png" 
										class="step-image " 
										style="width: 350rpx;">
									</image>
								</view>
							</view>
						</view>
						
						<!-- 步骤三 -->
						<view class="process-step-wrapper">
							<!-- 步骤标题在上方 -->
							<view class="step-title-row">
								<view class="step-left-title">
									<view class="step-number">③</view>
									<view class="step-number-text">步骤三</view>
								</view>
							</view>
							<!-- 内容区域（只有右侧卡片） -->
							<view class="step-content-row">
								<!-- 左侧占位，保持对齐 -->
								<view class="step-left-column"></view>
								<!-- 右侧内容卡片（有背景和阴影） -->
								<view class="step-content-card" style="padding: 0;">
									
									<view class="step-desc full-width">
										在趣好卖【商品详情页】或【订单列表】订单信息内，点击【去铺货】按钮把商品加入本页顶部的【铺货单】内，之后在【铺货单】内操作铺货到【嘚嘚象】，然后到嘚嘚象【运营-百宝箱-商品搬家】操作铺货到三方店铺。
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			
			<view class="instruction-section">
				<view class="instruction-title">说明</view>
				<view class="instruction-card">
					
					<view class="instruction-text">
						在【嘚嘚象】操作商品搬家可能需要操作点数，可以在商品搬家功能页面【兑换-输入趣好卖订单号】免费兑换搬家点数，也可以自行充值购买。如有疑问可咨询在线客服。
					</view>
					<image 
						src="https://images.eqingqu.com/attachs/photo/202511/20251118_1CD38B6A0F106477F15A156C617318AB.png" 
						class="instruction-image" 
						mode="widthFix">
					</image>
				</view>
			</view>
			</view>
		</scroll-view>	
		<!-- </view> -->
		<!-- 遮罩层 -->
		<view v-if="revertShow">
			<view class="cover" @click="revertShowNo" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1">绑定趣好卖助手手机号</view>
				<view style="display: flex;flex-direction: row;align-items: center;margin: 0 40rpx;">
					<view
						style="display: flex;flex-direction: row;border: 2rpx solid #C0C0C0;padding: 20rpx;border-radius: 10rpx;width: 100%;text-align: center;margin-top: 44rpx;">
						<view style="width: 100%;margin-right: 10rpx;margin-top: 4rpx;">
							<input class="tui-content" type="text" placeholder-class="placeholders"
								placeholder="请填写助手登录手机号" :value="mobile" @input="setmobile" />
						</view>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;align-items: center;margin: 0 40rpx;width: 100%;">
					<view class="inputclass"
						style="display: flex;flex-direction: row;border: 2rpx solid #C0C0C0;padding: 20rpx;border-radius: 10rpx;text-align: center;margin-top: 44rpx;">
						<view style="width: 100%;margin-right: 10rpx;margin-top: 4rpx;">
							<input class="tui-content" type="text" placeholder-class="placeholders" placeholder="请填写验证码"
								:value="validate_code" @input="setvalidate_code" />
						</view>
					</view>
					<view class="inputclass_1"
						style="color: #FFFFFF;font-size: 28rpx;border-radius: 10rpx;background-color: #f23030;width: 30%;text-align: center;margin-left: 5%;margin-top: 40rpx;"
						@click="btnSend" v-if="noClick == true">{{btnText}}</view>
					<view class="inputclass_1"
						style="color: #FFFFFF;font-size: 28rpx;border-radius: 10rpx;background-color: #f23030;width: 30%;text-align: center;margin-left: 5%;margin-top: 40rpx;"
						v-else>{{btnText}}</view>
				</view>
				<view style="display: flex;flex-direction: row;align-items: center;margin-top: 80rpx;">
					<view class="add_box3_1_a" @click="revertShowNo">返回</view>
					<view class="add_box3_a" @click="revertShowYes">绑定</view>
				</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view v-if="defaultShow">
			<view class="cover" @click="defaultShowNo" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1">确定切换默认店铺吗</view>
				<view style="display: flex;flex-direction: row;align-items: center;margin-top: 80rpx;">
					<view class="add_box3_1_a" @click="defaultShowNo">返回</view>
					<view class="add_box3_a" @click="defaultShowYes">绑定</view>
				</view>
			</view>
		</view>
		<!-- 是否确认解绑 -->
		<view v-if="isunBind">
			<view class="cover" @click="defaultShowNo" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_3_1">确定解除账号绑定吗</view>
				<view style="display: flex;flex-direction: row;align-items: center;margin-top: 80rpx;">
					<view class="add_box3_1_a" @click="defaultShowNo">取消</view>
					<view class="add_box3_a" @click="unBindYes">解绑</view>
				</view>
			</view>
		</view>

		<!-- 搬家教程 -->
		<view v-if="iknow" @click="knowYes">
			<view class="cover1" catchtouchmove="true"></view>
			<view class="wxshare1">
				<image :src="intro_img" style="" class="wximg"></image>
			</view>
		</view>
		
		<uni-popups ref="member" type="bottom" style="z-index: 99999999;" :safe-area="false">
		  <view class="bind-popup-container" v-if="waimaiList.length == 0">
		    <!-- 标题区域 -->
		    <view class="popup-header">
		      <view class="popup-title">嘚嘚象帐号绑定</view>
		    </view>
		    
		    <!-- 表单区域 -->
		    <view class="popup-form">
		      <!-- 手机号输入框 -->
		      <view class="form-item">
		        <view class="item-label">手机号</view>
		        <view class="item-input">
		          <input 
		            class="input-field" 
		            type="text" 
		            placeholder-class="input-placeholder" 
		            placeholder="请输入手机号"
		            :value="mobile" 
		            @input="setmobile" 
		          />
		        </view>
		      </view>
		      
		      <!-- 验证码输入框 -->
		      <view class="form-item">
		        <view class="item-label">验证码</view>
		        <view class="item-input">
		          <input 
		            class="input-field" 
		            type="text" 
		            placeholder-class="input-placeholder" 
		            placeholder="请填写验证码"
		            :value="validate_code" 
		            @input="setvalidate_code" 
		          />
		        </view>
		        <view class="code-btn" @click="btnSend" v-if="noClick == true">
		          {{btnText}}
		        </view>
		        <view class="code-btn disabled" v-else>
		          {{btnText}}
		        </view>
		      </view>
		    </view>
		    
		    <!-- 确定按钮 -->
		    <view class="popup-footer">
		      <view class="confirm-btn" @click="revertShowYes">确定绑定</view>
		    </view>
		  </view>
		</uni-popups>
		
		<!-- #ifdef APP-PLUS -->
		<captcha ref="captcha" :config="aliConfig" 
			@captchaSuccess="captchaSuccess"
			@captchaError="captchaError"
			@captchaFail="captchaFail"
		></captcha>
		<!-- #endif -->
	</view>
</template>
<script>
	var app = getApp();
	import {
		vShow
	} from "vue";
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import captcha from "@/components/captcha4/index.vue";
	import { incrementVersion } from '@/utils/version.js';
	export default {
		components: {
			dscNotContent,
			uniPopups,
			captcha
		},
			data() {
			return {
				navHeight: 0, // 添加导航栏总高度
				shop_id: '',
				merchant_id: '',
				shop_dpid: '',
				bind_time: '',
				developer_id: '',

				recharge_url: '',
				money: '',
				revertShow: false,
				btnText: "获取验证码",
				mobile: '',
				validate_code: '',
				noClick: true,
				waimaiList: [],
				defaultShow: false,
				type: '',
				poi_code: '',
				urls: '',
				countdown: '',
				menuButtonInfo: {},
				gaodu: '',
				download_url: '',
				code_url:[],
				isunBind: false,
				intro_img: '',
				iknow: false,
				huodan: [],
				sync_intro_url: '', // 同步介绍URL
				// 阿里验证码相关数据
				aliConfig: {
					captchaId: "",
				},
				aliCaptchaResult: null,
				aliPlatform: '',
				h5Captcha: null
			};
		},
		onReady() {
		// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) * 2;
					// 计算导航栏总高度
					this.navHeight = this.menuButtonInfo.top + this.gaodu;
				}
			})
			// #endif
		
			// #ifndef MP-WEIXIN
			uni.getSystemInfo({
				success: res => {
					this.gaodu = 44; // 假设导航栏内容高度为44px
					this.navHeight = 40 + this.gaodu; // 状态栏40px + 导航栏内容高度
				}
			})
			// #endif

		},
		onLoad(e) {
			var that = this;
			// 支持从外部/详情页带 token、client_hash 进入
			try {
				if (e && e.token) {
					uni.setStorageSync('token', decodeURIComponent(e.token))
				}
				if (e && (e.client_hash || e.clientHash)) {
					uni.setStorageSync('client_hash', decodeURIComponent(e.client_hash || e.clientHash))
				}
			} catch (err) {}
			that.jiazai()
			that.getkefu()
			that.geturl()
			// that.bangding()
			that.getlaylist()
		},
		mounted() {
			this.detectAliPlatform();
			// #ifdef H5
			// 不在mounted中初始化验证码，只在需要时（点击获取验证码按钮）才初始化
			// #endif
		},
		onShow() {
			var that = this;
			that.getlaylist()
			// clearInterval(countdown);
		},
		onHide() {
			clearInterval(this.countdown);
			// #ifdef H5
			this.clearH5AliCaptcha();
			// #endif
		},
		beforeDestroy() {
			// #ifdef H5
			this.clearH5AliCaptcha();
			// #endif
		},
		methods: {
			tolaylist() {
				uni.navigateTo({
					url: '/pagesC/laylist/laylist'
				})
			},
			toknow: function() {
				var that = this
				that.iknow = true
			},
			knowYes: function() {
				var that = this
				that.iknow = !that.iknow
			},
			// 账号解绑
			gounBind: function() {
				var that = this
				that.isunBind = true
			},
			unBindYes: function() {
				var that = this
				uni.request({
					url: this.websiteUrl + '/api/sync/del_bind_app',
					method: 'POST',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							that.isunBind = false
							that.waimaiList = []
							that.btnText = '获取验证码'
							that.validate_code = ''
							that.mobile = ''

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
			// 去搬家
			goMoveGoods: function() {
				uni.request({
					url: this.websiteUrl + '/api/sync/shop_list',
					method: 'POST',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.navigateTo({
								url: '/pagesC/movingGoods/movingGoods'
							})
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
			jiazai: function() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/shop_list',
					method: 'POST',
					data: {
						app_version: '3.6.8'
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							 // that.waimaiList = res.data.data
							// 过滤waimaiList 只保留趣好卖供货2025/04/27
							 that.waimaiList.push(res.data.data[0])
							 
							 
						} 
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			geturl: function() {
				var that = this
				uni.request({
					url: that.websiteUrl + '/api/sync/getZhuDownUrl',
					method: 'POST',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.status == 'success') {
							// #ifdef MP-WEIXIN
							that.intro_img = res.data.data.wxapp_intro_img
							// #endif
							// #ifndef MP-WEIXIN
							that.intro_img = res.data.data.new_intro_img
							// #endif
							if (uni.getSystemInfoSync().platform == "ios") {
								that.download_url = res.data.data.ios_download
								that.code_url = res.data.data.poi_code_url
								console.log('第三方图片',that.code_url)
							} else {
								that.download_url = res.data.data.apk_download
								that.code_url = res.data.data.poi_code_url
							}
							// 保存同步介绍URL
							if (res.data.data.sync_intro_url) {
								that.sync_intro_url = res.data.data.sync_intro_url
							}
						}
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			defaultShowNo: function() {
				var that = this
				that.defaultShow = false
				that.isunBind = false
			},
			defaultShowYes: function() {
				var that = this
				that.defaultShow = false
				uni.request({
					url: that.websiteUrl + '/api/sync/shop_update_bind',
					method: 'POST',
					data: {
						type: that.type,
						poi_code: that.poi_code,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: res.data.data,
								icon: 'none'
							})
							that.jiazai()
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
			toOpen: function() {
				var that = this
				// #ifdef APP-PLUS
				plus.runtime.openURL(that.download_url)
				// #endif
			},
			cutCheckeds: function(item, index) {
				var that = this
				if (item.type == 1) {
					return;
				} else if (item.type != 1 && item.is_bind == true) {
					return;
				} else {
					that.type = item.type
					that.poi_code = item.poi_code
					that.defaultShow = true
				}

			},
			isNullOrEmpty: function(value) {
				//是否为空
				return (value === null || value === '' || value === undefined) ? true : false;
			},
			isMobile: function(value) {
				//是否为手机号
				return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
			},
			setmobile: function(e) {
				this.mobile = e.detail.value
			},
			setvalidate_code: function(e) {
				this.validate_code = e.detail.value
			},
			btnSend: function() {
				if (this.isNullOrEmpty(this.mobile)) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return
				} else if (!this.isMobile(this.mobile)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}
				this.handleSendSmsCode();
			},
			
			// 检测平台并设置验证码ID
			detectAliPlatform() {
				// #ifdef H5
				this.aliPlatform = 'H5';
				this.aliConfig.captchaId = '187c68c10b353285aee04ea098810301';
				// #endif
				// #ifdef MP-WEIXIN
				this.aliPlatform = 'wx';
				this.aliConfig.captchaId = '';
				// #endif
				// #ifdef APP-PLUS
				const systemInfo = uni.getSystemInfoSync();
				if (systemInfo.platform === 'android') {
					this.aliPlatform = 'Android';
					this.aliConfig.captchaId = 'e90ac1a1fb5b0ccf1de82096c870a118';
				} else {
					this.aliPlatform = 'iOS';
					this.aliConfig.captchaId = 'b7c339f0f58c73ec984074e73ed4a365';
				}
				// #endif
				
				console.log('阿里验证码平台:', this.aliPlatform, 'captchaId:', this.aliConfig.captchaId);
			},
			
			// 初始化H5阿里验证码
			initH5AliCaptcha() {
				// #ifdef H5
				// 清理旧的验证码实例
				this.clearH5AliCaptcha();
				
				// 创建新的容器，并立即隐藏
				const newContainer = document.createElement('div');
				newContainer.id = 'captcha';
				newContainer.style.display = 'none'; // 关键：立即隐藏容器
				document.body.appendChild(newContainer);
				
				// 重新加载脚本
				const script = document.createElement('script');
				script.src = "../../static/ct4.js";
				script.onload = () => {
					if (window.initAlicom4) {
						window.initAlicom4({
							captchaId: this.aliConfig.captchaId,
							product: 'popup'
						}, (captcha) => {
							this.h5Captcha = captcha; // 保存实例引用
							captcha.appendTo("#captcha");
							
							// 确保容器保持隐藏状态
							const captchaEl = document.getElementById('captcha');
							if (captchaEl) {
								captchaEl.style.display = 'none';
							}
							
							// 添加重置方法（如果SDK未提供）
							if (!captcha.reset) {
								captcha.reset = function() {
									this.appendTo("#captcha");
									this.verify();
								}.bind(captcha);
							}
							
							captcha.onSuccess(() => {
								var result = captcha.getValidate();	
								this.aliCaptchaResult = result;
								// 验证成功后立即清理验证码容器和按钮
								setTimeout(() => {
									this.clearH5AliCaptcha();
								}, 50);
								this.sendSmsAfterCaptcha();
							});
							
							// 监听验证码关闭/取消事件
							if (captcha.onClose) {
								captcha.onClose(() => {
									// 弹窗关闭时立即清理
									this.clearH5AliCaptcha();
								});
							}
							
							// 监听验证码错误事件
							if (captcha.onError) {
								captcha.onError(() => {
									// 验证失败时也清理
									setTimeout(() => {
										this.clearH5AliCaptcha();
									}, 100);
								});
							}
						});
					} else {
						console.error('initAlicom4 未定义，脚本可能加载失败');
						uni.showToast({ title: '验证码加载失败，请刷新重试', icon: 'none' });
					}
				};
				script.onerror = () => {
					console.error('ct4.js 脚本加载失败');
					uni.showToast({ title: '验证码脚本加载失败，请检查网络', icon: 'none' });
				};
				document.body.appendChild(script);
				// #endif
			},
			
			// 清理H5阿里验证码
			clearH5AliCaptcha() {
				// #ifdef H5
				// 清理验证码实例
				if (this.h5Captcha) {
					try {
						if (this.h5Captcha.destroy) {
							this.h5Captcha.destroy();
						}
					} catch (e) {
						console.log('清理验证码实例失败:', e);
					}
					this.h5Captcha = null;
				}
				
				// 清理所有验证码相关的DOM元素（包括按钮、容器、弹窗等）
				// 先清理按钮和弹窗
				const captchaButtons = document.querySelectorAll('.captcha4_btn_click, .captcha4_container, .captcha4_popup, .captcha4_wrapper, [class*="captcha4"]');
				captchaButtons.forEach(el => {
					if (el) {
						el.style.display = 'none';
						if (el.parentNode) {
							el.parentNode.removeChild(el);
						}
					}
				});
				
				// 清理验证码容器
				const captcha = document.getElementById('captcha');
				if (captcha) {
					captcha.style.display = 'none';
					captcha.innerHTML = ''; // 清空内容
					if (captcha.parentNode) {
						captcha.parentNode.removeChild(captcha);
					}
				}
				
				// 清理所有id包含captcha的元素
				const allCaptchaElements = document.querySelectorAll('[id*="captcha"], [class*="captcha"]');
				allCaptchaElements.forEach(el => {
					if (el && el.id && el.id.includes('captcha')) {
						el.style.display = 'none';
						if (el.parentNode) {
							el.parentNode.removeChild(el);
						}
					}
				});
				
				// 重置验证码结果
				this.aliCaptchaResult = null;
				// #endif
			},
			
			// 处理发送短信验证码
			handleSendSmsCode() {
				// #ifdef MP-WEIXIN
				this.sendSmsAfterCaptcha();
				// #endif
				
				// #ifdef H5
				if (this.h5Captcha) {
					// 显示验证码容器（仅在需要时显示）
					const captchaEl = document.getElementById('captcha');
					if (captchaEl) {
						captchaEl.style.display = 'block';
					}
					
					// 重置验证码状态
					try {
						this.h5Captcha.reset(); // 尝试重置验证码
					} catch (e) {
						console.log('重置验证码失败:', e);
					}
					
					// 触发验证码按钮点击
					setTimeout(() => {
						const captchaButton = document.querySelector('#captcha .captcha4_btn_click');
						if (captchaButton) {
							captchaButton.click(); // 直接触发原生点击事件
						}
					}, 100);
				} else {
					// 首次初始化
					this.initH5AliCaptcha();
					// 初始化后显示并触发
					setTimeout(() => {
						const captchaEl = document.getElementById('captcha');
						if (captchaEl) {
							captchaEl.style.display = 'block';
						}
						setTimeout(() => {
							const captchaButton = document.querySelector('#captcha .captcha4_btn_click');
							if (captchaButton) {
								captchaButton.click();
							}
						}, 100);
					}, 500);
				}
				// #endif
				
				// #ifdef APP-PLUS
				this.$refs.captcha.showCaptcha();
				// #endif
			},
			
			// APP验证码回调方法
			captchaSuccess(result) {
				this.aliCaptchaResult = result;
				this.sendSmsAfterCaptcha();
			},
			captchaError(e) {
				console.error('验证码错误:', e);
				uni.showToast({ title: '验证失败，请重试', icon: "none" });
				this.btnText = "获取验证码";
				this.disabled = false;
				this.type = "primary";
				this.noClick = true;
			},
			captchaFail(e) {
				console.error('验证码失败:', e);
				uni.showToast({ title: '验证失败，请重试', icon: "none" });
				this.btnText = "获取验证码";
				this.disabled = false;
				this.type = "primary";
				this.noClick = true;
			},
			
			// 验证成功后发送短信
			sendSmsAfterCaptcha() {
				// #ifndef MP-WEIXIN
				if (!this.aliCaptchaResult) {
					uni.showToast({ title: '验证未通过', icon: 'none' });
					// #ifdef H5
					// 验证失败时也清理
					this.clearH5AliCaptcha();
					// #endif
					return;
				}
				// #endif
				
				this.disabled = true;
				this.btnText = "请稍候...";
				this.type = "gray"
				this.noClick = false
				
				var that = this
				const requestData = {
					"mobile": that.mobile
				};
				
				// 添加阿里验证参数
				// #ifndef MP-WEIXIN
				requestData.platform = that.aliPlatform;
				Object.assign(requestData, that.aliCaptchaResult);
				// #endif
				
				uni.request({
					url: that.websiteUrl + '/api/sync/send_sms_bind',
					method: 'POST',
					data: requestData,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res)
						if (res.data.status == 'success') {
							let seconds = 60;
							that.btnText = seconds + "s后获取";
							that.countdown = setInterval(() => {
								if (seconds > 0) {
									that.btnText = seconds + "s后获取"
									--seconds;
								} else {
									that.btnText = "获取验证码";
									that.disabled = false;
									that.type = "primary";
									that.noClick = true
									clearInterval(that.countdown);
								}
							}, 1000);
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							})
							that.btnText = "获取验证码";
							that.disabled = false;
							that.type = "primary";
							that.noClick = true
						}
						// #ifdef H5
						// 请求完成后清理验证码
						that.clearH5AliCaptcha();
						// #endif
						// 重置验证码结果
						that.aliCaptchaResult = null;
					},
					fail: (err) => {
						console.error(err)
						that.btnText = "获取验证码";
						that.disabled = false;
						that.type = "primary";
						that.noClick = true
						// #ifdef H5
						// 请求失败时也清理验证码
						that.clearH5AliCaptcha();
						// #endif
						// 重置验证码结果
						that.aliCaptchaResult = null;
					}
				})
			},

			revertShowNo: function() {
				var that = this
				that.revertShow = false
				uni.navigateBack()
			},
		revertShowYes: function() {
			var that = this
			
			// 校验手机号
			if (that.isNullOrEmpty(that.mobile)) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				})
				return
			}
			
			if (!that.isMobile(that.mobile)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				})
				return
			}
			
			// 校验验证码
			if (that.isNullOrEmpty(that.validate_code)) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				})
				return
			}
			
			// 生成版本号
			const version = incrementVersion();

			uni.request({
				url: that.websiteUrl + '/api/sync/bind_app',
				method: 'POST',
				data: {
					"mobile": that.mobile,
					"code": that.validate_code,
					"app_version": version
				},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					console.log(res.data)
					if (res.data.status == 'success') {
						that.revertShow = false
						// 关闭弹窗
						that.$refs.member.close()
						uni.showToast({
							title: res.data.data,
							icon: 'none'
						})
						setTimeout(function() {
							that.jiazai()
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
		},

			navigateBack: function() {
				uni.navigateBack()
			},
			linkHrefs(url) {
				if (url.indexOf('http') != -1) {
					this.$outerHref(url)
				} else {
					this.$outerHref(url, 'app')
				}
			},
			tokefu: function() {
				var that = this
				that.linkHrefs(that.urls)
			},
			getkefu: function() {
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
							if (res.data.data[0].child_nav[i].name == '官方客服') {
								this.urls = res.data.data[0].child_nav[i].url
							}
						}
					}
				})
			},
			toweb() {
				var that = this
				// 使用接口返回的 sync_intro_url，如果没有则使用默认地址
				const url = that.sync_intro_url || 'https://www.ok9288.com/sync_product_vlog.mp4';
				uni.setStorageSync("url", url);
				uni.setStorageSync("webtitle", '商品搬家教程');
				uni.navigateTo({
					url: '/pagesB/webviews/webviews'
				})
			},
			// 获取列表
			getlaylist(page) {
				var that = this
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}
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
						if (res.data.status == 'success' && res.data.data) {
							this.huodan = res.data.data
						}
					},
					fail: (err) => {}
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
		// width: 100%;
		// height: 100%;
		overflow-x: hidden;
	}

	/* 顶部导航栏开始 */

	.search-tab {
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

	/* 顶部导航栏结束 */

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
		border-radius: 20rpx;
		width: 87%;
		background: linear-gradient(to bottom, #ffffff 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 30%;
		left: 6%;
		z-index: 9999;
	}

	.wxshare_3_1 {
		font-size: 38rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		// margin-left: 20rpx;
		// margin-right: 20rpx;
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

	.inputclass {
		/* #ifdef MP-WEIXIN */
		width: 52%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		width: 46%;
		/* #endif */
	}

	.inputclass_1 {
		/* #ifdef MP-WEIXIN */
		height: 90rpx;
		line-height: 90rpx;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: 80rpx;
		line-height: 80rpx;
		/* #endif */
	}

	/* 导航 start */

	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #f5f5f5;
	}

	.status_bar {
		background-color: #f5f5f5;
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
		width: 75%;
		padding: 0rpx 40rpx 10rpx 30rpx;
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
	.cover1 {
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

	.wxshare1 {
		text-align: center;
		border-radius: 20rpx;
		z-index: 9999;

		/* #ifndef MP-WEIXIN */
		width: 75%;
		position: fixed;
		top: 9%;
		left: 25%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 80%;
		position: fixed;
		top: 9%;
		left: 17%;
		/* #endif */
	}

	.wximg {
		width: 560rpx;
		height: 1350rpx;
	}

	.wxshare_3_1 {
		font-size: 38rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.tui-order-title-1 {
		font-size: 28rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
		margin-left: 30rpx;
		margin-right: 20rpx;
		text-align: left;
	}

	.add_box3_cui_2 {
		width: 30%;
		margin-left: 35%;
		margin-bottom: 50rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #ffffff;
		background-color: #FE0302;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.banbtn {
		/* #ifndef MP-WEIXIN */
		margin-top: -20rpx;
		font-size: 32rpx;
		margin-left: 70rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin-top: -20rpx;
		font-size: 32rpx;
		margin-left: 70rpx;
		/* #endif */
	}

	.banvideo {
		margin-top: 144rpx;
		background-color: #f5f5f5;

	}

	.bantop {
		/* #ifdef MP-WEIXIN */
		padding-top: var(--status-bar-height)
			/* #endif */

	}

	.bindyes {
		width: 600rpx;
		height: 88rpx;
		background: #FE0302;
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
		border-radius: 44rpx;
	}
	
	
	.top-video {
		display: flex;
		padding: 16rpx 24rpx;
		align-items: center;
		background-color: #FFEDED;
		justify-content: space-around;
		.video-text {
			width: 75%;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #1B1B1B;
			line-height: 32rpx;
			text-align: left;
			font-style: normal;
		}
		.video-img {
			width: 20%;
		}
	}
	
	// 绑定解绑
	
	.account-section {
	  margin: 30rpx 30rpx;
	}
	
	/* 未绑定状态样式 */
	.unbind-state .bind-card {
	  background-color: #ffffff;
	  border-radius: 16rpx;
	  padding: 40rpx 30rpx;
	  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}
	
	.bind-info {
	  display: flex;
	  align-items: center;
	  margin-bottom: 40rpx;
	}
	
	.bind-icon {
	  margin-right: 24rpx;
	}
	
	.bind-text {
	  flex: 1;
	}
	
	.bind-title {
	  font-size: 32rpx;
	  font-weight: bold;
	  color: #333;
	  margin-bottom: 12rpx;
	}
	
	.bind-subtitle {
	  font-size: 26rpx;
	  color: #999;
	}
	
	.bind-actions {
	  display: flex;
	  justify-content: space-between;
	}
	
	.bind-btn {
	  background-color: #FE0302;
	  color: #fff;
	  border-radius: 44rpx;
	  height: 88rpx;
	  line-height: 88rpx;
	  text-align: center;
	  font-size: 36rpx;
	  flex: 1;
	  margin-right: 20rpx;
	}
	
	// .laylist-btn {
	//   background: #FF7705;
	//   color: #fff;
	//   border-radius: 26rpx;
	//   height: 88rpx;
	//   line-height: 88rpx;
	//   text-align: center;
	//   font-size: 28rpx;
	//   width: 180rpx;
	//   display: flex;
	//   align-items: center;
	//   justify-content: center;
	//   position: relative;
	// }
	
	.btn-icon {
	  width: 32rpx;
	  height: 36rpx;
	  margin-right: 12rpx;
	  
	}
	
	.badge {
	  background-color: red;
	  width: 16rpx;
	  height: 16rpx;
	  border-radius: 50%;
	  position: absolute;
	  right: 20rpx;
	  top: 20rpx;
	}
	
	/* 已绑定状态样式 */

/* 未绑定状态样式 */
.unbind-state .bind-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  text-align: center;
}

.bind-text {
  margin-bottom: 50rpx;
}

.text-center {
  text-align: center;
}

.bind-title {
 font-weight: 500;
 font-size: 40rpx;
 color: #626262;
 line-height: 40rpx;
  margin-bottom: 20rpx;
}

.bind-subtitle {
  font-weight: 400;
  font-size: 28rpx;
  color: #626262;
  line-height: 28rpx;
}

.bind-actions.vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  /* Android兼容方案：使用margin替代gap */
  /* #ifdef APP-PLUS */
  gap: 0;
  /* #endif */
}

/* Android兼容：为垂直布局的子元素添加margin */
/* #ifdef APP-PLUS */
.bind-actions.vertical > view:not(:last-child) {
  margin-bottom: 30rpx;
}
/* #endif

.bind-btn {
  background-color: #FE0302;
  color: #fff;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 32rpx;
  width: 100%;
  max-width: 500rpx;
}

.laylist-btn {
  background: #fff;
  color: #FE2F02;
  border: 1px solid #FE2F02;
  border-radius: 44rpx;
  height: 84rpx;
  line-height: 36rpx;
  font-weight: 500;
  text-align: center;
  font-size: 36rpx;
  width: 100%;
  max-width: 500rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.btn-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}

.badge {
  background-color: red;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  position: absolute;
  right: 140rpx;
  top: 20rpx;
}

.down-box {
	position: absolute;
	// background-color: #FE0302;
	width: 200rpx;
	height: 60rpx;
	top: 150rpx;
	left: 380rpx;
	z-index: 9;
	opacity: 0;
}

/* 已绑定状态样式 */
.binded-state .binded-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0eeef;
  padding: 20rpx 30rpx;
}

.platform-tag {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.action-btn .switch-btn,
.action-btn .unbind-btn {
  color: #FE0302;
  font-size: 26rpx;
  border: 1rpx solid #f9ada3;
  border-radius: 24rpx;
  padding: 8rpx 20rpx;
  text-align: center;
}

.action-btn .default-tag {
  color: #999;
  font-size: 26rpx;
}

.card-content {
  display: flex;
  align-items: flex-start;
  padding: 30rpx;
}

.store-info {
  margin-left: 20rpx;
  flex: 1;
}

.info-item {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

/* 支持第三方平台样式 */
.third-platform-section {
  margin: 40rpx 30rpx 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 30rpx;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  padding: 0 30rpx;
  white-space: nowrap;
}

.title-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #e5e5e5);
}

.left-line {
	max-width: 100rpx;
  background: linear-gradient(270deg, transparent, #e5e5e5);
}

.right-line {
	max-width: 100rpx;
  background: linear-gradient(90deg, transparent, #e5e5e5);
}

.platform-scroll-container {
  width: 100%;
  overflow: hidden;
}

.platform-scroll {
  width: 100%;
  white-space: nowrap;
      text-align: center;
}

.platform-list {
  display: inline-flex;
  padding: 10rpx 0;
  /* 确保列表宽度与标题区域一致 */
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.platform-item {
  display: inline-block;
  margin-right: 20rpx;
width: 90rpx;
height: 80rpx;
  border-radius: 12rpx;
  overflow: hidden;
  // background-color: #f8f8f8;
  flex-shrink: 0;
}

.platform-item:last-child {
  margin-right: 0;
}

.platform-image {
  width: 100%;
  height: 100%;
}
.container {
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.main-content {
	width: 100%;
	flex: 1;
	/* 移除可能干扰滚动的样式 */
}
.content-wrapper {
	/* 确保内容正常排列 */
	padding-top: 40rpx;
	padding-bottom: 20rpx; /* 添加底部间距 */
}

/* 底部弹窗样式 */
.bind-popup-container {
  width: 100%;
  background: #FFFFFF;
  border-radius: 30rpx 30rpx 0 0;
  padding: 0;
  box-sizing: border-box;
}

/* 标题区域 */
.popup-header {
  padding: 40rpx 30rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  text-align: center;
}

/* 表单区域 */
.popup-form {
  padding: 40rpx 30rpx;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  position: relative;
}

.form-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 32rpx;
  color: #333333;
  width: 140rpx;
  flex-shrink: 0;
}

.item-input {
  flex: 1;
  margin-right: 20rpx;
}

.input-field {
  width: 100%;
  height: 80rpx;
  font-size: 32rpx;
  color: #333333;
  border: 1rpx solid #E5E5E5;
  border-radius: 40rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.input-placeholder {
  font-size: 28rpx;
  color: #999999;
}

/* 验证码按钮 */
.code-btn {
  width: 180rpx;
  height: 80rpx;
  background: #FE0302;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.code-btn.disabled {
  background: #CCCCCC;
}

/* 底部按钮区域 */
.popup-footer {
  padding: 30rpx;
  background: #F8F8F8;
  border-radius: 0 0 30rpx 30rpx;
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background: #FE0302;
  border-radius: 44rpx;
  font-size: 36rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* 确保弹窗覆盖整个底部 */
:deep(.uni-popup__wrapper) {
  border-radius: 30rpx 30rpx 0 0 !important;
}

:deep(.uni-popup__wrapper-box) {
  border-radius: 30rpx 30rpx 0 0 !important;
  overflow: hidden;
}

/* 铺货流程样式 - 整体没有背景 */
.process-container {
  margin-top: 30rpx;
  /* 移除背景色 */
  padding: 0;
}

/* 每个步骤的包装器 - 垂直布局 */
.process-step-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  position: relative;
}

/* 步骤标题行（在上方） */
.step-title-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
      margin-left: -8rpx;
    margin-top: 20rpx;	  
}

/* 左侧标题 - 横向排列 */
.step-left-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20rpx;
}

/* 内容行（在下方，包含左侧虚线和右侧卡片） */
.step-content-row {
  display: flex;
  // align-items: flex-start;
  position: relative;
}

/* 左侧虚线列 */
.step-left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  flex-shrink: 0;
  width: 20rpx;
  position: relative;
}

.step-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #1B1B1B;
  line-height: 1;
  margin-right: 10rpx;
}

.step-number-text {
  font-size: 32rpx;
  color: #1B1B1B;
  line-height: 1;
}

/* 虚线容器 - 贯穿整个内容区域 */
.dashed-line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100rpx;
  position: absolute;
  top: 0;
  bottom: 0;
  justify-content: flex-end;
}

/* 虚线延伸 - 贯穿整个内容卡片高度，延伸到下一个步骤标题上方 */
.dashed-line-extend {
  width: 2rpx;
  flex: 1;
  background: repeating-linear-gradient(
    to bottom,
    #CCCCCC 0,
    #CCCCCC 8rpx,
    transparent 8rpx,
    transparent 16rpx
  );
  min-height: 200rpx;
}

/* 实心灰色向下箭头 */
.arrow-down-icon {
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 12rpx solid #666666;
  margin-top: 10rpx;
  flex-shrink: 0;
}

/* 右侧内容卡片（有背景和阴影） */
.step-content-card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

/* 第一行：下载嘚嘚象APP 立即下载 - 间距不要太大 */
.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  gap: 20rpx;
  /* Android兼容方案：使用margin替代gap */
  /* #ifdef APP-PLUS */
  gap: 0;
  /* #endif */
}

/* Android兼容：为水平布局的子元素添加margin */
/* #ifdef APP-PLUS */
.step-header > view:not(:last-child) {
  margin-right: 20rpx;
}
/* #endif */

.step-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1B1B1B;
  line-height: 44rpx;
}

.step-download {
  font-size: 28rpx;
  color: #007AFF;
  text-decoration: underline;
  flex-shrink: 0;
}

/* 中间图标 */
.step-image {
  width: 110rpx;
  height: 110rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  display: block;
}

/* 第三行：两行文案 */
.step-desc-black {
  font-size: 24rpx;
  color: #1B1B1B;
  line-height: 40rpx;
}

.step-desc-red {
  font-size: 24rpx;
  color: #FE0302;
  line-height: 40rpx;
  margin-top: 8rpx;
}

.step-desc {
 font-weight: 400;
 font-size: 28rpx;
 color: #1B1B1B;
  line-height: 40rpx;
  // margin-top: 20rpx;
}

.step-desc.full-width {
  width: 95%;
  padding: 20rpx;
  // background-color: #F8F8F8;
  border-radius: 12rpx;
}

/* 说明区域样式 - 外侧无背景 */
.instruction-section {
  width: 94%;
  margin: 36rpx 30rpx;
  /* 无背景色 */
}

.instruction-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.instruction-title {
  font-weight: 400;
  font-size: 32rpx;
  color: #1B1B1B;
  margin-bottom: 20rpx;
}

.instruction-text {
		font-weight: 400;
		font-size: 28rpx;
		color: #1B1B1B;
  line-height: 40rpx;
  margin-bottom: 20rpx;
}

.instruction-image {
  width: 100%;
  height: 396rpx;
  border-radius: 12rpx;
  display: block;
}
</style>