<template>
	<view class="" style="background-color: #FDE6B9;">
		<view class="page-container" v-if="isShowList==true">
			<view class="topbg" style="width: 100%;" @click="renewClose" />
			<!-- 九大权益 -->
			<view class="page-content" style="padding: 0rpx 24rpx 0 24rpx; margin-top: -380rpx;" @click="renewClose">
				<view class="flex-center ">
					<!-- 	<view class="top-onetitle plr24 ">
						<view class="title fs500 line38"><text class="fs39">尊享<span
									class="fs52 cored plr5">9</span>大精选权益
							</text>
						</view>
					</view> -->
				</view>
				<view class="textc">
					<view class="tab-scroll-container" @click="tointro">

						<view v-for="(tab, index) in scrollist" :key="index" class="tab-item"
							:class="{ 'tab-item--last': index % 5 === 4 }">
							<image :src="tab.img" mode="widthFix" class="top-img bora50"></image>
							<text class="fs24 co27 fs500 mt20">{{ tab.text }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 权益 -->
			<view class="" @click="renewClose">
				<!-- 权益二 -->
				<view class="rights">
					<view class="rights-two">
						<!-- <view class="rights-title flex-center">
							<span>{{rightsList[1]}}</span>
						</view> -->

						<!-- 修改为轮播图结构 -->
						<view class="right-bora" style="padding-top: 28rpx;">

							<!-- 轮播容器 -->
							<swiper v-if="pageVisible" :indicator-dots="false" class="coupon-swiper"
								indicator-color="#ccc" indicator-active-color="#f00" :circular="!isMember"
								:autoplay="!isMember" interval="5000" duration="500" style="height: 470rpx;"
								@change="onSwiperChange" :current="currentSwiperIndex">


								<!-- 							<swiper :indicator-dots="false" class="coupon-swiper" indicator-color="#ccc"
									indicator-active-color="#f00" circular autoplay interval="5000" duration="500"
									style="height: 450rpx;" @change="onSwiperChange" :current="currentSwiperIndex">		 -->

								<!-- 第一个轮播项 - 使用coulist  固定顺序， 月季年-->
								<swiper-item>
									<view class="coupon-top">
										<view class="coupon-top-title">{{coulist_money}}</view>
										<view class="coupon-top-brage">月度会员</view>
									</view>
									<view class="right-two" v-if="coulist.length> 0">
										<view class="item"
											style="display: flex;flex-direction: column;align-items: center;"
											v-for="(item,index) in coulist" :key="'cou-' + index">

											<view class="cored line014">
												<span>¥</span>
												<span class="fs60 fs500">{{item.cou_money}}</span>
											</view>
											<view class="fs24 cored line014" style="margin-top: -3px;">
												{{item.cou_name}}
											</view>
											<view class="packet">
												<!-- <view
													v-if="userInfo.drp_shop.membership_status && userInfo.drp_shop.membership_status !== 0 ? userInfo.drp_shop.audit == 1 : true">
													已领取
												</view> -->
												<view v-if="isMember && currentMemberCardId === 9">
													已领取
												</view>
												<view v-else @click="toOpen('1')">
													立即领取
												</view>
											</view>
										</view>
									</view>
								</swiper-item>

								<!-- 第二个轮播项 - 使用secondlist -->
								<swiper-item>
									<view class="coupon-top">
										<view class="coupon-top-title">{{secondlist_money}}</view>
										<view class="coupon-top-brage">季度会员</view>
									</view>

									<view class="right-two" v-if="secondlist.length> 0">
										<view class="item"
											style="display: flex;flex-direction: column;align-items: center;"
											v-for="(item,index) in secondlist" :key="'sec-' + index">
											<view class="cored line014">
												<span>¥</span>
												<span class="fs60 fs500">{{item.cou_money}}</span>
											</view>
											<view class="fs24 cored line014" style="margin-top: -3px;">
												{{item.cou_name}}
											</view>
											<view class="packet">
												<!-- <view
													v-if="userInfo.drp_shop.membership_status && userInfo.drp_shop.membership_status !== 0 ? userInfo.drp_shop.audit == 1 : true">
													已领取
												</view> -->

												<view v-if="isMember && currentMemberCardId === 10">
													已领取
												</view>
												<view v-else @click="toOpen('1')">
													立即领取
												</view>
											</view>
										</view>
									</view>
								</swiper-item>

								<!-- 第三个轮播项 - 使用thridlist -->
								<swiper-item>
									<view class="coupon-top">
										<view class="coupon-top-title">{{thridlist_money}}</view>
										<view class="coupon-top-brage">年度会员</view>
									</view>

									<view class="right-two" v-if="thridlist.length> 0">
										<view class="item"
											style="display: flex;flex-direction: column;align-items: center;"
											v-for="(item,index) in thridlist" :key="'thr-' + index">
											<view class="cored line014">
												<span>¥</span>
												<span class="fs60 fs500">{{item.cou_money}}</span>
											</view>
											<view class="fs24 cored line014" style="margin-top: -3px;">
												{{item.cou_name}}
											</view>
											<view class="packet">
												<!-- <view
													v-if="userInfo.drp_shop.membership_status && userInfo.drp_shop.membership_status !== 0 ? userInfo.drp_shop.audit == 1 : true">
													已领取
												</view> -->

												<view v-if="isMember && currentMemberCardId === 4">
													已领取
												</view>
												<view v-else @click="toOpen('1')">
													立即领取
												</view>
											</view>
										</view>
									</view>
								</swiper-item>
							</swiper>

							<!-- 底部按钮保持不变 -->
							<view class="bottom-section">

								<view class="button-container">
									<view class="seemores fs36 fs500 flex-center coff" @click="drawHandle(1)"
										v-if="userInfo.drp_shop.membership_status && userInfo.drp_shop.membership_status !== 0 ? userInfo.drp_shop.audit == 1 : true">
										<text style="border: 1px solid #C4A57D;border-radius: 100rpx;
    padding: 20rpx 140rpx;color: #C4A57D;">已发放</text>

									</view>
									<view class="seemores fs36 fs500 flex-center coff" @click="toOpen('1')" v-else>
										<text>一键领取</text>
										<image
											src="https://images.eqingqu.com/attachs/photo/202509/20250924_D78668AA1A84EFF9F5206F9FBF0A5068.png"
											mode="widthFix" class="brown-arrows"></image>

									</view>
									<!-- 自定义指示器 -->
									<view class="custom-indicator flex-center" v-if="showIndicator">
										<view v-for="index in 3" :key="index" class="indicator-dot"
											:class="{ active: currentSwiperIndex === index - 1 }"
											@click="switchSwiper(index - 1)"></view>
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>

				<!-- 权益一 -->
				<view class="rights ">
					<view class="rights-one">
						<view class="rights-title flex-center">
							<span>{{rightsList[0]}}</span>
						</view>
						<view class="right-bora" style="padding-top: 88rpx;">
							<!-- 商品列表 -->
							<view class="goodslist" v-for="(item,index) in goodslist" :key="index">
								<view class="item  disf" :class="{boderbotco:index!==goodslist.length-1}"
									@click="toDetail(item.goods_id)">
									<view class="">
										<image :src="item.goods_thumb" mode="widthFix" class="flex" style="width: 180rpx;max-height: 180rpx;
										margin-top: 2px;border-radius: 10rpx;">
										</image>
									</view>
									<view class="ml20" style="">
										<view class="fs32 onelist-hidden " style="margin: -5rpx 0 0 ;">
											{{item.goods_name}}
										</view>
										<view class="fs28 co82 onelist-hidden " style="margin: -8rpx 0 0 ;">
											{{item.attr_name}}
										</view>
										<view class=" bgprice coff pore " style="">
											<view style="margin: 0 20rpx; " class=" ">
												<view class="fs24 mt05 pr10 line28 pb08">会员专属价</view>
												<view class="fs40 fs500 line32"><span class="fs28 pr5">¥</span>
													{{item.shop_price}}
												</view>
											</view>
											<view class="poab" style="right: 30rpx;bottom: 0rpx;">
												<image src="/pagesC/static/my/bgcar.png" mode="widthFix"
													style="width: 36rpx;" />
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="flex-center" @click="toGoodsList">
								<view class="seemore fs36 fs500 flex-center coff" style="margin:0rpx 0 36rpx ; ">查看更多
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 权益三 -->
				<view class="rights">
					<view class="rights-one">
						<view class="rights-title flex-center ">
							<span>{{rightsList[2]}}</span>
						</view>
						<view class="right-bora" style="padding-top: 88rpx;">
							<view class="right-three ">
								<view class="flex " style="width: 70%;margin-bottom: 6px;">
									<view class="fs32 fs600 co27 ">
										{{rightsList_third.title}}
									</view>
									<view class="fs28 co62 ">
										{{rightsList_third.title2}}
									</view>
								</view>
								<view class="flex-center" style="width: 20%;">
									<image
										src="https://shhai2.oss-cn-shanghai.aliyuncs.com/images/202504/thumb_img/47623_thumb_P_1745890132973.jpg"
										mode="widthFix" style="width: 96rpx;"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 下单 -->
			<!-- 
			【重要问题说明】
			会员状态判断依赖：userInfo.drp_shop.membership_status 和 userInfo.drp_shop.audit
			
			数据来源：userInfo 来自 /api/user/profile 接口（通过 loadUserProfile() 方法获取）
			
			常见问题：
			1. 如果会员信息显示不正确（明明是会员却显示购买按钮），请检查：
			   - /api/user/profile 接口返回的 drp_shop.membership_status 和 drp_shop.audit 是否为最新值
			   - 对比 /api/drp 接口返回的 shop_info 数据，看两个接口的数据是否一致
			
			2. 问题根源（2025年1月发现）：
			   - /api/user/profile 返回的数据可能是旧的（membership_status: "0", audit: "0"）
			   - 而 /api/drp 返回的数据是正确的（membership_status: 1, audit: 1）
			   - 前端使用的是 /api/user/profile 的数据，因此判断结果错误
			
			3. 解决方案：
			   - 后端修复 /api/user/profile 接口，确保返回最新的会员信息
			   - 前端代码逻辑正常，问题在后端接口数据不正确
			
			4. 调试方法：
			   - 在控制台查看 userInfo.drp_shop 的值
			   - 对比 /api/user/profile 和 /api/drp 两个接口返回的数据
			-->

			<view class="top-bot" :class="{ 'show': showBottomBar }" :style="{ minHeight: topBotMinHeight }">
				<view class="noopen"
					v-if="userInfo.drp_shop.membership_status && userInfo.drp_shop.membership_status !== 0 ? userInfo.drp_shop.audit == 1 : true">
					<view class="flex-between flexdr">
						<view class="flex-between">
							<view class="">
								<view class="flex-start">
									<image src="https://images.eqingqu.com/attachs/photo/202601/20260112_E37A4578B2CC97504F990025E157C0AA.png" mode="widthFix"
										style="width: 48rpx;height:48rpx;"></image>
									<span class="fs36 fs600 co77 pl12">好卖黑卡</span>
								</view>
								<view class="co62">
									<block
										v-if="mergedDrpData && mergedDrpData.expiry && mergedDrpData.expiry.expiry_status && mergedDrpData.expiry.expiry_status == 1">
										<view class="time">{{$t('lang.member_of_validity')}}：{{$t('lang.have_expired')}}
										</view>
									</block>
									<block v-else>
										<view class="time"
											v-if="mergedDrpData && mergedDrpData.expiry && mergedDrpData.expiry.expiry_status && mergedDrpData.expiry.expiry_type == 'forever'">
											{{$t('lang.membership_of_validity')}}：{{$t('lang.permanence')}}
										</view>
										<view class="time"
											v-else-if="mergedDrpData && mergedDrpData.expiry && mergedDrpData.expiry.expiry_status && mergedDrpData.expiry.expiry_type == 'days'">
											{{$t('lang.membership_of_validity')}}：{{mergedDrpData.expiry.expiry_time_format ? mergedDrpData.expiry.expiry_time_format : ''}}
										</view>
										<view class="time"
											v-else-if="mergedDrpData && mergedDrpData.expiry && mergedDrpData.expiry.expiry_status && mergedDrpData.expiry.expiry_type == 'timespan'">
											{{$t('lang.membership_of_validity')}}：{{mergedDrpData.expiry.expiry_time_format ? mergedDrpData.expiry.expiry_time_format : ''}}
										</view>
									</block>
								</view>
							</view>
						</view>
						<view class="fee-btn flex-center" @click="drpRenew"
							v-if="mergedDrpData && mergedDrpData.expiry && mergedDrpData.expiry.expiry_status && mergedDrpData.expiry.expiry_type != 'forever'">
							立即续费
						</view>
					</view>
					<view class="flex-center ">
						<span class="fs28 " style="line-height: 28rpx;">服务期内节省</span>
						<span class="fs40 cored pl20 flex-center pr10">¥ </span>
						<span class="fs48 cored flex-center ">{{userInfo.user_save_money }}</span>
					</view>
				</view>

				<view class="noopen" v-else>
					<p><span class="coa2 fs28 ">立即购买：</span><span class="co77 fs32">好卖黑卡</span> </p>

					<view class="bot-btn flex-center ">
						<view class="yellow-brage" v-if="buttonText.discountText">
							立减{{ buttonText.discountText }}元
						</view>
						<view class="left flex-center cored fs36 fs500" @click="toOpen('0')">
							积分兑换
						</view>

					<view class="right flex-center coff fs36 fs500" @click="checkLoginAndShowPopup">
						<view class="button-content">
							<text class="button-dollar" style="margin-top: 10rpx;font-size: 28rpx;">¥</text>
							<text class="button-main-text" style="font-size: 44rpx;">{{ buttonText.main }}</text>
							<text class="button-action" style="font-size: 36rpx;margin-left: 16rpx;">立即体验</text>
						</view>
					</view>
					</view>

					<view class="privacy" :class="{ 'shake': showShake }" style="margin-top: 20rpx;">
						<view class="checkbox flex-center" :class="{'checked':checked}">
							<view class="checkbox-icon" @click="privacyClick"></view>
							<view class="checkbox-con" style="display: flex;flex-direction: row;">
								<view class="txt" @click="privacyClick">开通请确认</view>
								<view class="href" @click="toTrain">《好卖黑卡会员用户协议》</view>
							</view>
						</view>
					</view>
				</view>

				<!--续费方式-->
				<uni-popups ref="renewShow" type="bottom">
					<view class="bgc_fff" style="padding-bottom: 100rpx;">
						<view class="title">
							<view class="txt">{{$t('lang.fill_in_renew')}}</view>
							<uni-icons type="closeempty" size="22" color="#999999" @click="renewClose"></uni-icons>
						</view>
						<view class="not-content">
							<scroll-view :scroll-y="true" class="select-list">
								<view class="select-item" v-for="(item,index) in card.receive_value" :key="index"
									:class="{'active':renew_type == item.type}" @click="renew_method_select(item.type)">
									<view class="txt" v-if="item.type == 'integral'">
										{{$t('lang.drp_apply_title_1')}}（需支付{{item.value}}积分）
									</view>
									<view class="txt" v-if="item.type == 'order'">{{$t('lang.drp_apply_title_2')}}
									</view>
									<view class="txt" v-if="item.type == 'buy'">
										{{$t('lang.drp_apply_title_3')}}（需支付{{item.value}}元）
									</view>
									<view class="txt" v-if="item.type == 'goods'">{{$t('lang.drp_apply_title_4')}}
									</view>
									<view class="txt" v-if="item.type == 'free'">{{$t('lang.drp_apply_title_5')}}</view>
									<view class="iconfont icon-ok"></view>
								</view>
							</scroll-view>
						</view>
					</view>
				</uni-popups>
			</view>



			<!-- end -->
			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		</view>
		<view class="no-container" v-else>
			<view class="not-content">
				<view class="notimg">
					<image src="https://www.ok9288.com/img/no_content.png" class="img"></image>
				</view>
				<view class="cont">亲，您还没有登录哦</view>
				<view class="conts" @click="toLogin">去登录</view>
			</view>
		</view>
		<custom-tabbar />
		<!-- 月季年会员弹窗 -->
		<uni-popups ref="member" type="bottom" style="z-index: 99999999;">
			<!-- #ifdef MP-WEIXIN -->
			<view class="pop_content" :style="{height: `${popHeight.hd-50}px`}">
			<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
			<view class="pop_content" :style="{height: `${popHeight.hd-100}px`}">
				<!-- #endif -->
				<view class="pop_header">

					<text class="pop_title">{{$t('lang.haomai_black_member')}}</text>
					<image class="close_img"
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
						@click="closePop('member')"></image>
				</view>

				<view class="member-content">
					<!-- 年度会员特殊样式 -->

					<view class="frist" :class="{ 'active': selectedMembership.type === 'year' }"
						@click="selectMembership(yearlyMember)">
						<!-- <view v-if="yearlyMember.isSpecial" class="red-brage">
				        首购特惠 
				      </view> -->
						<image v-if="yearlyMember.isSpecial" class="yellow-diamond"
							src="https://images.eqingqu.com/attachs/photo/202509/20250925_A5373C8E336CBE8CFB5E7400E55F0E45.png" />
						<view class="price">
							<view>
								<text class="dollar">¥</text>
								<text class="red-price">{{ yearlyMember.price }}</text>
							</view>
							<text v-if="yearlyMember.originalPrice > yearlyMember.price" class="gray-price">
								原价¥{{ yearlyMember.originalPrice }}
							</text>
						</view>
						<text class="member-name">{{ yearlyMember.name }}</text>
					</view>

					<!-- 季度和月度会员 -->
					<view class="second">
						<view class="second-item" v-for="item in nonYearlyMembers" :key="item.id"
							:class="{ 'active': selectedMembership.id === item.id }" @click="selectMembership(item)">
							<!-- <view v-if="item.isSpecial" class="red-brage-small">
				          首购特惠
				        </view> -->
							<view class="second-name">
								<text>{{ item.name }}</text>
							</view>
							<view class="second-price">
								<text class="second-dollar"
									:class="{ 'active': selectedMembership.id === item.id }">¥</text>
								<text class="second-price-num"
									:class="{ 'active': selectedMembership.id === item.id }">{{ item.price }}</text>
							</view>
						</view>
					</view>

					<!-- 底部按钮 -->
					<view class="member-button" style="z-index: 99999999;">
						<button class="sub_btn custom-button" @click="toOpen('1')">
							<view class="button-content">
								<text class="button-dollar">¥</text>
								<text class="button-main-text">{{ buttonText.main }}</text>
								<!-- <text class="button-original-price">{{ buttonText.original }}</text> -->
								<text class="button-action">{{ buttonText.action }}</text>
							</view>
						</button>
					</view>

					<view class="privacy" :class="{ 'shake': showShake }" style="margin-top: 34rpx;">
						<view class="checkbox flex-center" :class="{'checked':checked}">
							<view class="checkbox-icon" @click="privacyClick">
								<!-- <uni-icons size="14" color="#ffffff"></uni-icons> -->
							</view>
							<view class="checkbox-con" style="display: flex;flex-direction: row;">
								<view class="txt" @click="privacyClick">开通请确认</view>
								<view class="href" @click="toTrain">《好卖黑卡会员用户协议》</view>
							</view>
						</view>
					</view>
				</view>
			<!-- #ifdef MP-WEIXIN -->
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			</view>
			<!-- #endif -->
			
		</uni-popups>
	</view>


</template>

<script>
	import {
		mapState
	} from 'vuex'

	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue';
	import {
		getCurrentVersion,
		setVersion,
		incrementVersion
	} from '@/utils/version.js';
	/** 会员页缓存过期时间：5分钟（仅用于内部刷新策略，不做用户提示） */
	const MEMBER_DATA_TTL_MS = 5 * 60 * 1000;
	/** 静默刷新最小间隔（防抖，避免 onShow 高频重复打接口） */
	const MEMBER_SILENT_REFRESH_MIN_INTERVAL_MS = 15000;
	export default {
		data() {
			return {
				pageVisible: true,
				isMember: false,
				currentMemberCardId: null,
				coulist_money: '',
				secondlist_money: '',
				thridlist_money: '',
				currentSwiperIndex: 2, // 当前轮播索引，默认从年度会员（索引2）开始
				isSwiperChanging: false, // 防止轮播切换事件循环触发的标志位
				// 新增重试机制相关变量
				retryCount: 0, // 当前重试次数
				maxRetry: 3, // 最大重试次数
				retryTimer: null, // 重试定时器
				isShowList: false,
				index: 0,
				expiry_status: '',
				dscLoading: true,
				// 【新增】记录弹窗是否已显示过（用于判断是否首次进入）
				popupShownInCurrentSession: false,
				changeRight: {},
				setdrp: {},
				type: 'buy',
				apply_status: '',
				pageDrpInfo: {},
				renewShow: false,
				renew_type: '',
				tip_url: '',
				intro_url: '',
				rightsList: [],
				rightsList_third: [],
				userInfo: uni.getStorageSync('userInfo') ?? '',
				checked: false,
				screenHeight: 0,
				coulist: [],
				secondlist: [], //测试
				thridlist: [], //测试
				goodslist: [],
				// 缓存数据 - 用于差异更新（全平台兼容）
				cachedCoulist: [],
				cachedSecondlist: [],
				cachedThridlist: [],
				cachedGoodslist: [],
				memberDataCacheTime: 0, // 缓存时间戳
				isSilentRefreshing: false,
				lastSilentRefreshTs: 0,
				scrollist: [],
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				showShake: false,
				membershipOptions: [],
				selectedMembership: {},
				dataLoaded: false,
				topBotMinHeight: '280rpx', // 底部容器最小高度
				showBottomBar: false, // 控制底部弹窗显示
				scrollTop: 0, // 页面滚动距离
				pageLoaded: false, // 页面是否已加载完成（用于控制动画）
			}
		},
		components: {
			uniIcons,
			uniPopups,
			dscNotContent,
			dscCommonNav,
			CustomTabbar
		},
		mounted() {
			// #ifdef APP-PLUS
			// 检测平台并设置min-height值
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'android') {
				this.topBotMinHeight = '300rpx';
			} else if (systemInfo.platform === 'ios') {
				this.topBotMinHeight = '320rpx';
			}
			// #endif
			// #ifdef MP
			// 小程序环境设置min-height值
			this.topBotMinHeight = '400rpx';
			// #endif
			// 使用 setTimeout 确保在下一个事件循环中执行
			setTimeout(() => {
				if (this.drpChangeCard && this.drpChangeCard.list && this.drpChangeCard.list.length > 0) {
					this.processMembershipData();
				}
			}, 100);
		},
		computed: {
			// 会员卡ID与轮播索引的映射
			cardIndexMap() {
				return {
					9: 0, // 月度 -> 第一个轮播项
					10: 1, // 季度 -> 第二个轮播项
					4: 2 // 年度 -> 第三个轮播项
				};
			},
			// 当前会员卡对应的轮播索引
			memberCardIndex() {
				if (!this.currentMemberCardId) return 0;
				return this.cardIndexMap[this.currentMemberCardId] || 0;
			},

			// 是否显示轮播指示器（非会员显示）
			showIndicator() {
				return !this.isMember && (this.coulist.length > 0 || this.secondlist.length > 0 || this.thridlist.length >
					0);
			},


			// 创建合并后的数据源
			mergedDrpData() {
				// 优先使用 drpdata，如果为空则使用 setdrp
				return this.drpdata || this.setdrp;
			},
			// 检查是否有任一数据源可用
			hasDrpData() {
				return !!(this.drpdata || this.setdrp);
			},
			// 年度会员
			yearlyMember() {
				return this.membershipOptions.find(item => item.type === 'year') || {};
			},

			// 月度会员
			monthlyMember() {
				return this.membershipOptions.find(item => item.type === 'month') || {};
			},

			// 季度会员
			quarterlyMember() {
				return this.membershipOptions.find(item => item.type === 'quarter') || {};
			},

			// 非年度会员（月度和季度）
			nonYearlyMembers() {
				return this.membershipOptions.filter(item => item.type !== 'year');
			},
			// 特殊会员（isSpecial 为 true 的会员）
			specialMember() {
				return this.membershipOptions.find(item => item.isSpecial) || this.membershipOptions[0] || {};
			},
			buttonText() {
				if (!this.selectedMembership.name) {
					return {
						main: '请选择',
						original: '',
						action: '',
						discountText: "",
					}
				}

				const item = this.selectedMembership

				// 根据不同会员类型显示不同格式
				if (item.id === '4') {
					return {
						main: `${item.price}/${item.unit}`,
						original: ` ${item.originalMonthlyPrice} `,
						action: '一单回本',
						discountText: "",
					}
				} else if (item.id === '10') {
					return {
						main: `${item.price}/${item.unit}`,
						original: `¥${item.originalPrice} `,
						action: '一单回本',
						discountText: "",
					}
				} else {
					return {
						main: `${item.price}/${item.unit}`,
						original: `¥${item.originalPrice} `,
						action: '一单回本',
						discountText: "",
					}
				}
			},
			...mapState({
				drpdata: state => state.drp.drpData,
				drpChangeCard: state => state.drp.drpChangeCard,
				drpRightsCard: state => state.drp.drpRightsCard
			}),
			viewStatus() {
				return this.drpdata ? this.drpdata.error : 0
			},
			viewAudit() {
				return this.drpdata ? this.drpdata.audit : 0
			},
			// card() {
			// 	return this.drpdata.membership_card_info ? this.drpdata.membership_card_info : ''
			// },
			card() {
				// 先检查 this.drpdata 是否存在且有 membership_card_info
				if (this.drpdata && this.drpdata.membership_card_info) {
					return this.drpdata.membership_card_info;
				}

				// 如果 drpdata 没有值，再检查 this.setdrp
				if (this.setdrp && this.setdrp.membership_card_info) {
					return this.setdrp.membership_card_info;
				}

				return {};
			},
			protectionList() {
				return this.card ? this.card.user_membership_card_rights_list : ''
			},
			receive_type_renew() {
				return this.drpdata && this.drpdata.shop_info ? this.drpdata && this.drpdata.shop_info
					.receive_type_format : 0
			},
			drpInfoBg() {
				return this.imagePath.drpInfoBg
			},
			length() {
				return this.drpChangeCard.list ? this.drpChangeCard.list.length - 1 : 0;
			},
			memid() {
				return this.drpChangeCard.list[0]
			},
		},
		watch: {
			// 监听 drpChangeCard 数据变化
			drpChangeCard: {
				handler(newVal) {
					if (newVal && newVal.list && newVal.list.length > 0) {
						this.$nextTick(() => {
							this.processMembershipData();
						});
					}
				},
				immediate: true,
				deep: true
			},
			// drpdata(newValue) {
			// 	if (newValue && newValue.membership_card_info) {
			// 		this.drpdata.membership_card_info = newValue.membership_card_info
			// 	}
			// },
		drpdata: {
			handler(newValue) {
				if (newValue && newValue.membership_card_info) {
					this.updateMemberStatus();
				}
			},
			immediate: true,
			deep: true
		},
		setdrp: {
			handler(newValue) {
				if (newValue && newValue.membership_card_info) {
					this.updateMemberStatus();
				}
			},
			immediate: true,
			deep: true
		},
			coulist() {
				this.dscLoading = false
			}
		},
		async onLoad() {
			try {
				// 【新增】onLoad 时重置弹窗显示标志，表示这是新进入页面
				this.popupShownInCurrentSession = false;
				
				// 获取用户信息
				this.userInfo = uni.getStorageSync('userInfo');

				// 【新增】从本地存储恢复缓存（如果存在）
				this.restoreCacheFromStorage();

				// 同时加载两种数据源
				await Promise.all([
					this.$store.dispatch('setDrp').catch(() => {}),
					this.loadMemberInfo() // 加载本地数据
				]);

			} catch (error) {
				console.error('页面加载失败:', error);
			}
		},
		async onShow() {
			// 【必须】通知 tabbar 更新状态 - 放在最前面，确保每次都能执行
			uni.$emit('switch-tab');
			// 【关键修复】强制显示 tabbar，防止页面重渲染期间 tabbar 短暂消失
			uni.$emit('force-show-tabbar');
			
			this.pageVisible = true
			// 重置页面加载状态
			this.pageLoaded = false;
			// 立即隐藏底部弹窗（无动画）
			this.showBottomBar = false;

			// 缓存逻辑：先恢复缓存并立即显示，接口返回后再静默差异更新
			const token = uni.getStorageSync('token');
			const isLoggedIn = this.hasValidLoginState();
			const hasMemoryCache = this.cachedCoulist.length > 0 || this.cachedGoodslist.length > 0;
			const {
				cachedData
			} = this.readMemberCacheRaw();
			const hasStorageCache = !!(cachedData && cachedData.time);

			if (!hasMemoryCache && hasStorageCache) {
				this.restoreCacheFromStorage();
			}

			const hasAnyCache = this.cachedCoulist.length > 0 || this.cachedGoodslist.length > 0 ||
				(Array.isArray(this.scrollist) && this.scrollist.length > 0);

			if (hasAnyCache && isLoggedIn) {
				// 有缓存数据且有token：不显示loading，先显示缓存数据，然后正常请求，返回后静默更新差异
				this.dscLoading = false;
				this.isShowList = true;
				// 恢复缓存数据到显示列表（让用户先看到缓存数据）
				this.coulist = [...this.cachedCoulist];
				this.secondlist = [...this.cachedSecondlist];
				this.thridlist = [...this.cachedThridlist];
				this.goodslist = [...this.cachedGoodslist];
				// 权益九宫格等 meta 已在 restoreCacheFromStorage 写入 this.scrollist / money / rightsList
			} else if (isLoggedIn) {
				// 有token但无缓存数据：显示loading
				this.dscLoading = true;
			} else {
				// 无token：不显示loading
				this.dscLoading = false;
			}

			// 重置滚动位置到顶部
			this.scrollTop = 0;
			// 滚动到页面顶部
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0 // 立即滚动，无动画
			});
			// 每次进入页面时，重置轮播索引到年度会员（索引2）
			if (!this.isMember) {
				this.currentSwiperIndex = 2;
				// 使用 $nextTick 确保轮播组件正确同步到索引2
				this.$nextTick(() => {
					// 强制更新轮播索引，确保底部指示器正确显示
					if (this.currentSwiperIndex !== 2) {
						this.currentSwiperIndex = 2;
					}
				});
			}
			// 延迟标记页面已加载，确保弹窗初始状态是隐藏的
			this.$nextTick(() => {
				setTimeout(() => {
					this.pageLoaded = true;
				}, 100);
			});
			// 先确保弹窗基础数据（不影响缓存优先显示）
			await this.ensureDataAndShowPopup();
			if (isLoggedIn) {
				this.isShowList = true;
				try {
					// 基础资料并行请求
					await Promise.all([
						this.loadUserProfile(),
						this.getCustomTextByCode()
					]);

					// A方案：有缓存时始终先显示缓存，再静默更新；TTL仅用于“是否强制前台拉取”内部策略
					if (hasAnyCache) {
						if (this.shouldForceForegroundFetch()) {
							await this.getList();
						} else {
							this.silentUpdateMemberData();
						}
					} else {
						// 无缓存：前台拉取一次，避免空白
						await this.getList();
					}

					this.getapplication();

					if (this.card.id) {
						this.onRightsCard();
					} else {
						// 直接调用确保数据并显示弹窗的方法 
						await this.ensureDataAndShowPopup();
					}
				} catch (error) {
					console.error('onShow 执行失败:', error);
					// 登录态有效且有缓存时，保持缓存界面，不回退未登录空页
					if (hasAnyCache) {
						this.isShowList = true;
					}
					// 使用默认数据并显示弹窗
					// this.useDefaultData();
					// this.showPopup('member');
				}
			} else {
				this.isShowList = false;
				this.dscLoading = false;
				// 【关键修复】未登录时也要确保 tabbar 显示
				uni.$emit('force-show-tabbar');
			}
		},
		onHide() {
			// 【修复】离开页面时设置 pageVisible 为 false，避免 swiper 继续运行并触发事件
			this.pageVisible = false;
			// 离开页面时立即隐藏底部弹窗，避免下次进入时看到滑动动画
			this.showBottomBar = false;
		},
		onUnload() {
			this.pageVisible = false
			if (this.retryTimer) {
				clearTimeout(this.retryTimer);
				this.retryTimer = null;
			}
		},
		onPageScroll(e) {
			// 监听页面滚动
			this.scrollTop = e.scrollTop;
			// 当滚动超过100rpx时显示底部弹窗
			if (e.scrollTop > 100 && !this.showBottomBar) {
				// 页面加载完成后再显示，确保有动画效果
				if (this.pageLoaded) {
					this.showBottomBar = true;
				} else {
					// 如果页面刚加载，延迟一下再显示，避免看到初始状态
					this.$nextTick(() => {
						this.showBottomBar = true;
					});
				}
			}
		},
		onReady() {
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.vw = windowWidth;
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));
		},
		methods: {
		// 更新会员状态 - 使用真正的会员判断条件
		// 【注意】此方法使用的数据来自 userInfo.drp_shop，而 userInfo 来自 /api/user/profile 接口
		// 如果会员状态判断不正确，请检查 /api/user/profile 接口返回的 drp_shop 数据是否为最新值
		updateMemberStatus() {
			// 使用真正的会员判断条件：userInfo.drp_shop.membership_status
			// 数据来源：userInfo 通过 loadUserProfile() 从 /api/user/profile 获取
			const isMemberStatus = this.userInfo.drp_shop && 
				this.userInfo.drp_shop.membership_status && 
				this.userInfo.drp_shop.membership_status !== 0 ? 
				this.userInfo.drp_shop.audit == 1 : false;

			if (isMemberStatus) {
				// 是会员 - 从 card 获取会员卡ID用于显示轮播图
				const cardInfo = this.card;
				if (cardInfo && cardInfo.id) {
					this.currentMemberCardId = cardInfo.id;
					// 固定显示会员对应的轮播项
					this.currentSwiperIndex = this.getMemberCardIndex();
				}
				this.isMember = true;
			} else {
				// 非会员
				this.isMember = false;
				this.currentMemberCardId = null;
				this.currentSwiperIndex = 2; // 非会员时也从年度会员（索引2）开始轮播
			}
		},


			// version 因为  项目中使用了多种version的方式，没办法统一加上，一个个加吧
			async fetchDrpCardData() {
				return new Promise((resolve, reject) => {
					// 使用公共方法获取处理后的版本号

					const version = incrementVersion();
					uni.request({
						// url: 'https://www.ok9288.com/api/drp/drpcard',
						url: this.websiteUrl + '/api/drp/drpcard',
						method: 'POST',
						data: {
							receive_type: this.type,
							app_version: version,
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data.status == 'success') {
								// 使用 action 而不是直接 commit
								this.$store.dispatch('setDrpChangeCard', {
									// 传递与原有 load 方法相同的参数结构
									receive_type: 'buy', // 或者根据你的逻辑设置
									app_version: '5.0.9'
								}).then(() => {
									resolve(res.data.data);
								}).catch(reject);

							} else {
								reject(new Error(res.data.msg || '获取数据失败'));
							}
						},
						fail: (err) => {
							console.error('drpcard 请求失败:', err);
							reject(err);
						}
					});
				});
			},



			// 确保数据加载并显示弹窗
			async ensureDataAndShowPopup() {
				try {
					// 【修复】检查是否有缓存，如果有缓存则不显示uni.showLoading
					const hasAnyCache = this.cachedCoulist.length > 0 || this.cachedGoodslist.length > 0;
					
					if (!hasAnyCache) {
						// 无缓存时才显示uni.showLoading
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					}

					// 直接调用 API 获取数据
					await this.fetchDrpCardData();

					// 处理会员数据
					this.processMembershipData();

					uni.hideLoading();

					// 关键修改：等待数据完全渲染后再显示弹窗
					await this.$nextTick();

					// 额外等待一帧确保DOM完全更新
					await new Promise(resolve => setTimeout(resolve, 50));

					// 已是会员则不弹购买弹窗：先拉取最新会员状态再判断
					const token = uni.getStorageSync('token');
					if (token && token !== '' && token !== undefined) {
						await this.loadUserProfile();
					}
					const isAlreadyMember = this.userInfo.drp_shop &&
						this.userInfo.drp_shop.membership_status &&
						this.userInfo.drp_shop.membership_status !== 0 &&
						this.userInfo.drp_shop.audit == 1;

					// 显示弹窗：仅首次进入、非永久到期、且当前不是已生效会员时才显示
					if (!this.popupShownInCurrentSession && !isAlreadyMember && this.mergedDrpData && this.mergedDrpData.expiry && this.mergedDrpData.expiry.expiry_status && this.mergedDrpData
						.expiry.expiry_type != 'forever') {
						this.popupShownInCurrentSession = true;
						this.showPopup('member');
					}


				} catch (error) {
					uni.hideLoading();
					console.error('数据加载失败:', error);
				}
			},

			privacyClick() {
				return this.checked = !this.checked;
			},
			processMembershipData() {
				try {
					const listData = this.drpChangeCard.list;

					this.membershipOptions = listData.map(item => {
						const buyItem = item.receive_value.find(receiveItem => receiveItem.type === 'buy');
						const price = buyItem ? parseFloat(buyItem.value) : 0;

						const integralItem = item.receive_value.find(receiveItem => receiveItem.type ===
							'integral');
						const integralValue = integralItem ? integralItem.value : 0;

					const type = this.getTypeById(item.id);
					return {
						id: item.id.toString(),
						name: item.name,
						type: type,
						price: price,
						originalPrice: price,
						monthlyEquivalent: price,
						originalMonthlyPrice: price,
						discountText: "",
						isSpecial: item.isSpecial || false,
						unit: this.getUnitById(item.id),
						description: item.description || item.name,
						integralValue: integralValue,
						rawData: item
					}
					});

					// 排序
					this.membershipOptions.sort((a, b) => {
						const order = {
							year: 0,
							month: 1,
							quarter: 2
						};
						return order[a.type] - order[b.type];
					});

					// 根据 isSpecial 选择默认会员
					// 找到第一个 isSpecial 为 true 的会员，如果没有则选择第一个
					const specialMember = this.membershipOptions.find(item => item.isSpecial);
					this.selectedMembership = specialMember || this.membershipOptions[0];

					this.dataLoaded = true;

				} catch (error) {
					console.error('处理会员数据失败:', error);
				}
			},

			getTypeById(id) {
				const idMap = {
					4: 'year',    // 年度黑卡
					9: 'month',   // 月度黑卡
					10: 'quarter' // 季度黑卡
				};
				return idMap[id] || 'month';
			},
			
			getUnitByType(type) {
				const unitMap = {
					year: '年',
					month: '月',
					quarter: '季'
				};
				return unitMap[type] || '月';
			},
			
			getUnitById(id) {
				const type = this.getTypeById(id);
				return this.getUnitByType(type);
			},





			selectMembership(item) {
				this.selectedMembership = item
			},

			handleSubscription() {
				if (!this.selectedMembership.id) {
					uni.showToast({
						title: '请选择会员套餐',
						icon: 'none'
					})
					return
				}

				// 处理订阅逻辑
				uni.showModal({
					title: '确认开通',
					content: `确定开通${this.selectedMembership.name}吗？`,
					success: (res) => {
						if (res.confirm) {
							this.submitSubscription()
						}
					}
				})
			},
			async submitSubscription() {
				try {
					const result = await this.$api.createSubscription({
						membershipId: this.selectedMembership.id,
						type: this.selectedMembership.type,
						price: this.selectedMembership.price
					})

					uni.showToast({
						title: '开通成功',
						icon: 'success'
					})

					// 后续处理，如跳转等
				} catch (error) {
					uni.showToast({
						title: '开通失败',
						icon: 'none'
					})
				}
			},


			closePop(res) {
				this.$refs[res].close()
				// this.regionShow = false
			},
			// 检查登录状态并显示弹窗
			checkLoginAndShowPopup() {
				// 检查是否登录（使用页面中已有的登录校验逻辑）
				const token = uni.getStorageSync('token');
				if (!token || token === '' || token === undefined) {
					// 未登录，跳转到登录页面
					this.toLogin();
					return;
				}
				// 已登录，显示弹窗
				this.showPopup('member');
			},
			showPopup(res) {
				this.$refs[res].open()
			},
			toLogin() {
				uni.navigateTo({
					url: "/pagesB/login/login"
				})
			},
			toDetail(goods_id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
			tointro() {
				uni.setStorageSync('webtitle', '权益介绍');
				uni.setStorageSync('url', this.intro_url);
				uni.navigateTo({
					url: '/pagesB/webviews/webviews'
				})
			},
			getdrp() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://www.ok9288.com/api/drp',
						method: 'GET',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data.status == 'success') {
								this.setdrp = res.data.data;
								resolve(res.data.data);
							} else {
								reject(new Error('API返回状态异常'));
							}
						},
						fail: (error) => {
							console.error('getdrp 请求失败:', error);
							reject(error);
						}
					});
				});
			},
			getapplication() {
				uni.request({
					url: 'https://www.ok9288.com/api/drp/application ',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.changeRight = res.data.data
						}
					}
				})
			},
			// 立即领取--判断优惠券
			drawHandle(e) {
				if (e == 1) return;
			},
			load() {
				let o = {
					receive_type: this.type,
					app_version: '5.0.9'
				}
				if (this.apply_status && this.membership_card_id) {
					o = {
						receive_type: this.type,
						apply_status: this.apply_status,
						membership_card_id: this.membership_card_id
					}
				}
				this.$store.dispatch('setDrpChangeCard', o)
			},
			onRightsCard() {
				this.$store.dispatch('setDrpRightsCard', {
					membership_card_id: this.card.id
				})
			},

			// onSwiperChange(e) {
			//   // 添加会员状态判断：只有非会员才允许切换
			//   if (!this.isMember) {
			//     this.currentSwiperIndex = e.detail.current;
			//   } else {
			//     // 会员状态下，如果试图切换，强制回到会员对应的轮播项
			//     this.$nextTick(() => {
			//       const memberCardIndex = this.getMemberCardIndex();
			//       if (this.currentSwiperIndex !== memberCardIndex) {
			//         this.currentSwiperIndex = memberCardIndex;
			//       }
			//     });
			//   }
			// },
			onSwiperChange(e) {
				// 【修复】如果页面不可见，不处理轮播切换事件，避免在非会员页面时继续打印日志
				if (!this.pageVisible) {
					return;
				}
				
				// 防止循环触发：如果正在处理切换事件，直接返回
				if (this.isSwiperChanging) {
					return;
				}
				
				const newIndex = e.detail.current;
				// 如果新索引与当前索引相同，不需要更新，避免不必要的触发
				if (this.currentSwiperIndex === newIndex) {
					return;
				}
				
				// 设置标志位，防止循环触发
				this.isSwiperChanging = true;
				
				// 只有非会员才允许切换
				if (!this.isMember) {
					// 使用 $nextTick 确保在下一个事件循环中更新，避免立即触发新的 change 事件
					this.$nextTick(() => {
						this.currentSwiperIndex = newIndex;
						// 延迟重置标志位，确保事件处理完成
						setTimeout(() => {
							this.isSwiperChanging = false;
						}, 50);
					});
				} else {
					// 会员状态下，如果试图切换，强制回到会员对应的轮播项
					this.$nextTick(() => {
						const targetIndex = this.getMemberCardIndex();
						if (this.currentSwiperIndex !== targetIndex) {
							this.currentSwiperIndex = targetIndex;
						}
						// 延迟重置标志位，确保事件处理完成
						setTimeout(() => {
							this.isSwiperChanging = false;
						}, 50);
					});
				}
			},
			// 获取会员卡对应的轮播索引
			getMemberCardIndex() {
				if (!this.currentMemberCardId) return 0;

				const cardIndexMap = {
					9: 0, // 月度 -> 索引 0
					10: 1, // 季度 -> 索引 1
					4: 2 // 年度 -> 索引 2
				};

				return cardIndexMap[this.currentMemberCardId] || 0;
			},
			// 根据ID获取会员卡信息
			getCardById(cardId) {
				// 在三个数组中查找对应的会员卡
				const allCards = [
					...(this.coulist || []),
					...(this.secondlist || []),
					...(this.thridlist || [])
				];

				// 这里假设会员卡对象中有id字段，如果没有需要根据实际情况调整
				return allCards.find(card => card.id === cardId) || allCards[0];
			},

			// 切换轮播图
			switchSwiper(index) {
				this.currentSwiperIndex = index;
			},

			// 一键领取处理
			handleOneClickReceive() {
				// 根据当前索引处理不同的逻辑
				switch (this.currentSwiperIndex) {
					case 0:
						// 处理第一个轮播项的领取逻辑
						this.handleCouponReceive(this.coulist);
						break;
					case 1:
						// 处理第二个轮播项的领取逻辑
						this.handleCouponReceive(this.secondlist);
						break;
					case 2:
						// 处理第三个轮播项的领取逻辑
						this.handleCouponReceive(this.thridlist);
						break;
				}
			},

			// 具体的领取逻辑
			handleCouponReceive(couponList) {
				if (this.userInfo.drp_shop.membership_status &&
					this.userInfo.drp_shop.membership_status !== 0 ?
					this.userInfo.drp_shop.audit == 1 : true) {
					// 已发放的逻辑
					this.drawHandle(1);
				} else {
					// 立即领取的逻辑
					this.toOpen('1');
				}
			},




			toOpen(e) {
				if (!this.checked) {
					// 显示抖动效果
					this.showShakeAnimation()

					uni.showToast({
						icon: 'none',
						title: this.$t('lang.drp_agreement_please') || '请先同意用户协议'
					})
					return false
				}

				// 使用真正的会员判断条件
				if (this.userInfo.drp_shop.membership_status && 
					this.userInfo.drp_shop.membership_status !== 0 ? 
					this.userInfo.drp_shop.audit == 1 : true) {
					uni.showToast({
						title: '您已是会员',
						icon: 'none'
					});
					return false;
				}

				if (e == 1) {
					this.type = 'buy'
				} else {
					this.type = 'integral'
				}

			// 必须使用弹窗中选中的会员类型，轮播索引仅用于显示
			// 如果没有选中会员，提示用户先选择
			if (!this.selectedMembership || !this.selectedMembership.id) {
				uni.showToast({
					title: '请先选择会员类型',
					icon: 'none'
				});
				return false;
			}

			// 使用弹窗中选中的会员ID（转换为数字）
			const targetCardId = parseInt(this.selectedMembership.id);
			
			// 获取完整的会员卡信息
			let selectedCard = null;
			if (this.selectedMembership.rawData) {
				// 如果有原始数据，直接使用
				selectedCard = this.selectedMembership.rawData;
			} else {
				// 否则从数组中查找
				selectedCard = this.getCardById(targetCardId);
			}

			// 验证获取到的会员卡信息
			if (!selectedCard || !selectedCard.id) {
				uni.showToast({
					title: '会员信息获取失败，请重试',
					icon: 'none'
				});
				return false;
			}

			if (e == 1) {
				// 购买方式 - 使用弹窗中选中的会员ID
				uni.navigateTo({
					url: `/pagesA/drp/done/done?receive_type=buy&apply_status=renew&membership_card_id=${targetCardId}`
				})
				// 保存选中的会员卡信息
				this.tempSelectedCard = selectedCard;
			} else {
				// 积分兑换方式 - 使用弹窗中选中的会员信息
				let o = {
					receive_type: this.type,
					membership_card_id: targetCardId,
					pay_point: ''
				}

				// 从选中的会员卡获取积分值
				if (selectedCard && selectedCard.receive_value) {
					const targetItem = selectedCard.receive_value.find(item => item.type === 'integral');
					if (targetItem) {
						o.pay_point = targetItem.value;
					}
				}

					uni.showModal({
						title: '是否兑换好卖黑卡',
						content: `需要消耗${o.pay_point}积分`,
						showCancel: true,
						cancelText: "取消",
						confirmText: "确定兑换",
						success: (e) => {
							if (e.confirm) {
								this.$store.dispatch('setDrpApply', o).then(data => {
									let res = data.data
									if (res.status == 'success') {
										if (res.error == 0) {
											uni.showToast({
												title: res.msg,
												icon: "none"
											});
											this.getList()
										} else {
											uni.showToast({
												title: res.msg,
												icon: "none"
											});
										}
									} else {
										uni.showToast({
											title: res.msg,
											icon: "none"
										});
									}
								})
							}
						},
					})
				}
			},

			showShakeAnimation() {
				// 显示抖动
				this.showShake = true

				// 2秒后自动移除抖动效果
				setTimeout(() => {
					this.showShake = false
				}, 600)
			},

			// renew_method_select(type) {
			// 	this.renew_type = type;
			// 	this.type = type
			// 	if (this.card_id) {
			// 		this.onRightsCard();
			// 	} else {
			// 		this.load();
			// 	}

			// 	let o = {}
			// 	setTimeout(() => {
			// 		// 已过期
			// 		// 立即续费
			// 		if (this.renew_type == 'buy') {
			// 			uni.navigateTo({
			// 				url: `/pagesA/drp/done/done?receive_type=buy&apply_status=renew&membership_card_id=${this.drpChangeCard.list[0].id}`
			// 			})
			// 			this.renewShow = false
			// 		}
			// 		//积分兑换
			// 		if (this.renew_type == 'integral') {
			// 			o = {
			// 				receive_type: this.type,
			// 				membership_card_id: this.drpChangeCard.list[0].id,
			// 				pay_point: this.drpChangeCard.list[0].receive_value_arr.value
			// 			}
			// 			this.$store.dispatch('setDrpApply', o).then(data => {
			// 				let res = data.data
			// 				if (res.status == 'success') {
			// 					if (res.error == 0) {} else {
			// 						uni.showToast({
			// 							title: res.msg,
			// 							icon: "none"
			// 						});
			// 					}
			// 					this.$refs['renewShow'].close();
			// 				} else {
			// 					uni.showToast({
			// 						title: res.msg,
			// 						icon: "none"
			// 					});
			// 					this.$refs['renewShow'].close();
			// 				}
			// 			})
			// 		}
			// 	}, 500)
			// },

			renew_method_select(type) {
				this.renew_type = type;
				this.type = type

				if (this.card_id) {
					this.onRightsCard();
				} else {
					this.load();
				}

				let o = {}
				setTimeout(() => {
					// 续费场景使用当前会员卡（card），与「续费方式」弹窗选项一致，避免误传购买弹窗的 selectedMembership（年卡 id）
					const renewCardId = this.card && this.card.id ? this.card.id : this.selectedMembership.id;
					// 已过期 / 立即续费 - 在线购买
					if (this.renew_type == 'buy') {
						uni.navigateTo({
							url: `/pagesA/drp/done/done?receive_type=buy&apply_status=renew&membership_card_id=${renewCardId}`
						})
						this.renewShow = false
					}
					// 积分兑换 - 使用当前会员卡的 id 与积分值
					if (this.renew_type == 'integral') {
						let payPoint = '';
						if (this.card && this.card.receive_value) {
							const integralItem = this.card.receive_value.find(item => item.type === 'integral');
							if (integralItem) payPoint = integralItem.value;
						}
						if (!payPoint && this.selectedMembership.integralValue) payPoint = this.selectedMembership.integralValue;
						o = {
							receive_type: this.type,
							membership_card_id: renewCardId,
							pay_point: payPoint
						}
						this.$store.dispatch('setDrpApply', o).then(data => {
							let res = data.data
							if (res.status == 'success') {
								if (res.error == 0) {
									// 成功处理
								} else {
									uni.showToast({
										title: res.msg,
										icon: "none"
									});
								}
								this.$refs['renewShow'].close();
							} else {
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
								this.$refs['renewShow'].close();
							}
						})
					}
				}, 500)
			},


			drpRenew() {
				setTimeout(() => {
					// this.renewShow = true
					this.$refs['renewShow'].open();
				}, 100)
			},
			renewClose() {
				// this.renewShow = false
				this.$refs['renewShow'].close();
			},
			// 确认隐私政策
			toTrain: function() {
				if (this.tip_url.indexOf('http') != -1) {
					const match = this.tip_url.match(/article-(\d+)/);
					if (match) {
						this.articleId = match[1];
						this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
					}
				}
			},

			// 获取推荐商品和优惠券
			// async getList() {
			// 	return new Promise((resolve, reject) => {
			// 		const request = () => {
			// 			uni.request({
			// 				url: this.websiteUrl + '/api/userBackCar/getBackCarSetGoodslist',
			// 				method: 'GET',
			// 				header: {
			// 					'Content-Type': 'application/json',
			// 					'token': uni.getStorageSync('token'),
			// 					'X-Client-Hash': uni.getStorageSync('client_hash')
			// 				},
			// 				success: (res) => {
			// 					if (res.data.status === 'success') {
			// 						// this.showPopup('member')
			// 						this.sortedCardList = res.data.data
			// 						this.coulist = res.data.data.coulist_month.list // 年
			// 						this.coulist_money = res.data.data.coulist_month.money
			// 						this.secondlist_money = res.data.data.coulist_quarter.money
			// 						this.thridlist_money = res.data.data.coulist_year.money
			// 						this.secondlist = res.data.data.coulist_quarter.list  // 月
			// 						this.thridlist = res.data.data.coulist_year.list  // 季


			// 						this.goodslist = res.data.data.goodslist
			// 						this.rightsList = res.data.data.rightsList
			// 						this.rightsList_third = res.data.data.rightsList_third
			// 						this.tip_url = res.data.data.tip_url
			// 						this.intro_url = res.data.data.intro_url
			// 						this.scrollist = res.data.data.rightsList_logo
			// 						// 重置重试计数器
			// 						this.retryCount = 0;

			// 						if (res.data.data.coulist.length > 0) {
			// 							this.dscLoading = false
			// 						}
			// 						resolve();
			// 					} else {
			// 						// 请求成功但返回错误状态
			// 						this.handleListError('获取数据失败', resolve, reject);
			// 					}
			// 				},
			// 				fail: (err) => {
			// 					// 请求失败
			// 					this.handleListError('请求失败', resolve, reject);
			// 				}
			// 			});
			// 		};

			// 		// 首次执行请求
			// 		request();
			// 	});
			// },

			async getList() {
				return new Promise((resolve, reject) => {
					const request = () => {
						uni.request({
							url: this.websiteUrl + '/api/userBackCar/getBackCarSetGoodslist',
							method: 'GET',
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash': uni.getStorageSync('client_hash')
							},
							success: (res) => {
								if (res.data.status === 'success') {
									this.sortedCardList = res.data.data
									this.intro_url = res.data.data.intro_url
									this.scrollist = res.data.data.rightsList_logo

									// 【新增】检查是否有缓存，如果有则进行差异更新，否则直接更新
									const hasAnyCache = this.cachedCoulist.length > 0 || this.cachedGoodslist.length > 0;
									
									if (hasAnyCache) {
										// 有缓存：进行差异更新（静默更新）
										this.updateDataWithDiff(res.data.data);
									} else {
										// 无缓存：直接更新所有数据
										this.coulist = res.data.data.coulist_month.list;
										this.coulist_money = res.data.data.coulist_month.money;
										this.secondlist_money = res.data.data.coulist_quarter.money;
										this.thridlist_money = res.data.data.coulist_year.money;
										this.secondlist = res.data.data.coulist_quarter.list;
										this.thridlist = res.data.data.coulist_year.list;
										this.goodslist = res.data.data.goodslist;
										this.rightsList = res.data.data.rightsList;
										this.rightsList_third = res.data.data.rightsList_third;
										this.tip_url = res.data.data.tip_url;
									}

									// 【新增】保存缓存数据，用于后续的差异更新
									this.cachedCoulist = [...res.data.data.coulist_month.list];
									this.cachedSecondlist = [...res.data.data.coulist_quarter.list];
									this.cachedThridlist = [...res.data.data.coulist_year.list];
									this.cachedGoodslist = [...res.data.data.goodslist];
									this.memberDataCacheTime = Date.now();
									// 保存到本地存储（持久化）
									this.saveCacheToStorage();

									this.retryCount = 0;

									// 【修复】无论数据是否为空，都要关闭loading
									this.dscLoading = false;

									// 加载会员信息
									this.loadMemberInfo();
									resolve();
								} else {
									this.handleListError('获取数据失败', resolve, reject);
								}
							},
							fail: (err) => {
								this.handleListError('请求失败', resolve, reject);
							}
						});
					};

					request();
				});
			},

			async loadMemberInfo() {
				try {
					await this.getdrp();
				} catch (error) {
					console.error('通过getdrp加载会员信息失败:', error);
					// 即使失败也更新状态，确保状态正确
					this.updateMemberStatus();
				}
			},
			hasValidLoginState() {
				const token = uni.getStorageSync('token');
				const tokenValid = !!(token && token !== 'null' && token !== 'undefined');
				const u = this.userInfo || uni.getStorageSync('userInfo') || {};
				const uid = u.user_id || u.uc_id;
				return tokenValid || !!uid;
			},
			getMemberCacheUserSuffix() {
				const uid = uni.getStorageSync('user_id') || (this.userInfo && this.userInfo.user_id) || '';
				return String(uid || 'guest');
			},
			getMemberCacheKeys() {
				const suffix = this.getMemberCacheUserSuffix();
				return {
					user: 'member_data_cache_' + suffix,
					legacy: 'member_data_cache'
				};
			},
			readMemberCacheRaw() {
				const keys = this.getMemberCacheKeys();
				let cachedData = uni.getStorageSync(keys.user);
				if (!cachedData || !cachedData.time) {
					cachedData = uni.getStorageSync(keys.legacy);
				}
				return {
					cachedData: cachedData && cachedData.time ? cachedData : null,
					cacheTime: cachedData && cachedData.time ? cachedData.time : 0
				};
			},
			isMemberCacheExpired(cacheTime) {
				return !cacheTime || (Date.now() - cacheTime > MEMBER_DATA_TTL_MS);
			},
			shouldForceForegroundFetch() {
				// 仅用于内部策略：缓存过期时本次进入前台拉取；未过期走静默更新
				const {
					cacheTime
				} = this.readMemberCacheRaw();
				return this.isMemberCacheExpired(cacheTime);
			},
			// 【新增】从本地存储恢复缓存
			restoreCacheFromStorage() {
				try {
					const {
						cachedData: cached
					} = this.readMemberCacheRaw();
					if (cached && cached.time) {
						this.cachedCoulist = cached.coulist || [];
						this.cachedSecondlist = cached.secondlist || [];
						this.cachedThridlist = cached.thridlist || [];
						this.cachedGoodslist = cached.goodslist || [];
						this.memberDataCacheTime = cached.time || 0;
						// 首屏权益区 / 标题等（与接口 rightsList_logo、intro_url 等对齐）
						this.scrollist = Array.isArray(cached.scrollist) ? cached.scrollist.slice() : [];
						this.intro_url = cached.intro_url || '';
						this.tip_url = cached.tip_url || '';
						this.coulist_money = cached.coulist_money != null ? cached.coulist_money : '';
						this.secondlist_money = cached.secondlist_money != null ? cached.secondlist_money : '';
						this.thridlist_money = cached.thridlist_money != null ? cached.thridlist_money : '';
						this.rightsList = Array.isArray(cached.rightsList) ? cached.rightsList.slice() : [];
						this.rightsList_third = cached.rightsList_third && typeof cached.rightsList_third === 'object'
							? { ...cached.rightsList_third }
							: (Array.isArray(cached.rightsList_third) ? cached.rightsList_third.slice() : []);
					}
				} catch (error) {
					console.error('恢复缓存失败:', error);
				}
			},
			// 【新增】保存缓存到本地存储
			saveCacheToStorage() {
				try {
					const keys = this.getMemberCacheKeys();
					const payload = {
						coulist: this.cachedCoulist,
						secondlist: this.cachedSecondlist,
						thridlist: this.cachedThridlist,
						goodslist: this.cachedGoodslist,
						scrollist: Array.isArray(this.scrollist) ? this.scrollist.slice() : [],
						intro_url: this.intro_url || '',
						tip_url: this.tip_url || '',
						coulist_money: this.coulist_money,
						secondlist_money: this.secondlist_money,
						thridlist_money: this.thridlist_money,
						rightsList: Array.isArray(this.rightsList) ? this.rightsList.slice() : [],
						rightsList_third: this.rightsList_third,
						time: this.memberDataCacheTime
					};
					uni.setStorageSync(keys.user, payload);
					// 兼容旧逻辑与旧版本读取
					uni.setStorageSync(keys.legacy, payload);
				} catch (error) {
					console.error('保存缓存失败:', error);
				}
			},
			// 【新增】差异更新优惠券数据（全平台兼容）
			compareAndUpdateCoupons(newCoupons, cachedCoupons) {
				if (!newCoupons || !cachedCoupons) return true;

				const newLength = newCoupons.length;
				const cachedLength = cachedCoupons.length;

				// 长度不同，直接返回需要更新
				if (newLength !== cachedLength) return true;

				// 逐项比较关键字段（只对比关键字段，避免深度遍历）
				for (let i = 0; i < newLength; i++) {
					const newItem = newCoupons[i];
					const cachedItem = cachedCoupons[i];

					// 比较关键字段：优惠券金额、优惠券名称、优惠券ID等
					if (newItem.cou_id !== cachedItem.cou_id ||
						newItem.cou_money !== cachedItem.cou_money ||
						newItem.cou_name !== cachedItem.cou_name) {
						return true; // 有变化
					}
				}

				return false; // 无变化
			},
			// 【新增】更新优惠券列表数据（使用ID匹配，支持顺序变化）
			updateCouponListData(oldList, newList, idKey) {
				// 创建旧数据的映射（使用cou_id作为key，提高查找效率）
				const oldMap = new Map();
				oldList.forEach((item) => {
					if (item[idKey]) {
						oldMap.set(item[idKey], item);
					}
				});

				// 遍历新数据，更新或添加
				const newListData = [];
				newList.forEach((newItem) => {
					const oldItem = oldMap.get(newItem[idKey]);
					if (oldItem) {
						// 优惠券已存在，检查是否有变化
						if (oldItem.cou_money !== newItem.cou_money ||
							oldItem.cou_name !== newItem.cou_name) {
							// 有变化，使用新数据
							newListData.push(newItem);
						} else {
							// 无变化，使用旧数据（保持引用，避免不必要的渲染）
							newListData.push(oldItem);
						}
					} else {
						// 新优惠券，直接添加
						newListData.push(newItem);
					}
				});

				return newListData;
			},
			// 【新增】根据新数据更新UI（差异更新或全量更新）
			updateDataWithDiff(newData) {
				// 检查各数据块是否有变化
				let hasCoulistChanged = this.compareAndUpdateCoupons(
					newData.coulist_month.list, this.cachedCoulist
				);
				let hasSecondlistChanged = this.compareAndUpdateCoupons(
					newData.coulist_quarter.list, this.cachedSecondlist
				);
				let hasThridlistChanged = this.compareAndUpdateCoupons(
					newData.coulist_year.list, this.cachedThridlist
				);
				let hasGoodslistChanged = this.compareAndUpdateGoods(
					newData.goodslist, this.cachedGoodslist
				);

				// 只在数据真正变化时才更新UI（使用$set确保响应式，全平台兼容）
				if (hasCoulistChanged) {
					const newCoulist = this.updateCouponListData(this.coulist, newData.coulist_month.list, 'cou_id');
					this.$set(this, 'coulist', newCoulist);
				}

				if (hasSecondlistChanged) {
					const newSecondlist = this.updateCouponListData(this.secondlist, newData.coulist_quarter.list, 'cou_id');
					this.$set(this, 'secondlist', newSecondlist);
				}

				if (hasThridlistChanged) {
					const newThridlist = this.updateCouponListData(this.thridlist, newData.coulist_year.list, 'cou_id');
					this.$set(this, 'thridlist', newThridlist);
				}

				if (hasGoodslistChanged) {
					// 商品列表：使用goods_id匹配，支持商品顺序变化
					const oldGoodsMap = new Map();
					this.goodslist.forEach((item) => {
						if (item.goods_id) {
							oldGoodsMap.set(item.goods_id, item);
						}
					});

					// 遍历新数据，更新或添加
					const newGoodslist = [];
					newData.goodslist.forEach((newItem) => {
						const oldItem = oldGoodsMap.get(newItem.goods_id);
						if (oldItem) {
							// 商品已存在，检查是否有变化
							if (oldItem.shop_price !== newItem.shop_price ||
								oldItem.goods_name !== newItem.goods_name ||
								oldItem.goods_thumb !== newItem.goods_thumb ||
								oldItem.attr_name !== newItem.attr_name) {
								// 有变化，使用新数据
								newGoodslist.push(newItem);
							} else {
								// 无变化，使用旧数据（保持引用，避免不必要的渲染）
								newGoodslist.push(oldItem);
							}
						} else {
							// 新商品，直接添加
							newGoodslist.push(newItem);
						}
					});

					// 使用$set更新整个数组（全平台兼容）
					this.$set(this, 'goodslist', newGoodslist);
				}

				// 更新其他数据（这些数据变化频率低，可以直接赋值）
				this.coulist_money = newData.coulist_month.money;
				this.secondlist_money = newData.coulist_quarter.money;
				this.thridlist_money = newData.coulist_year.money;
				this.rightsList = newData.rightsList;
				this.rightsList_third = newData.rightsList_third;
				this.tip_url = newData.tip_url;
				if (newData.intro_url != null && newData.intro_url !== '') {
					this.intro_url = newData.intro_url;
				}
				if (Array.isArray(newData.rightsList_logo)) {
					this.$set(this, 'scrollist', newData.rightsList_logo.slice());
				}
			},
			// 【新增】差异更新商品数据（全平台兼容）
			compareAndUpdateGoods(newGoods, cachedGoods) {
				if (!newGoods || !cachedGoods) return true;

				const newLength = newGoods.length;
				const cachedLength = cachedGoods.length;

				// 长度不同，直接返回需要更新
				if (newLength !== cachedLength) return true;

				// 逐项比较关键字段（只对比关键字段，避免深度遍历）
				for (let i = 0; i < newLength; i++) {
					const newItem = newGoods[i];
					const cachedItem = cachedGoods[i];

					// 比较关键字段：商品ID、商品名称、商品价格、商品图片等
					if (newItem.goods_id !== cachedItem.goods_id ||
						newItem.goods_name !== cachedItem.goods_name ||
						newItem.shop_price !== cachedItem.shop_price ||
						newItem.goods_thumb !== cachedItem.goods_thumb) {
						return true; // 有变化
					}
				}

				return false; // 无变化
			},
			// 【新增】后台静默更新会员数据（不显示loading，全平台兼容）
			async silentUpdateMemberData() {
				const now = Date.now();
				if (this.isSilentRefreshing) return;
				if (now - this.lastSilentRefreshTs < MEMBER_SILENT_REFRESH_MIN_INTERVAL_MS) return;
				this.lastSilentRefreshTs = now;
				this.isSilentRefreshing = true;
				try {
					const res = await new Promise((resolve, reject) => {
						uni.request({
							url: this.websiteUrl + '/api/userBackCar/getBackCarSetGoodslist',
							method: 'GET',
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash': uni.getStorageSync('client_hash')
							},
							success: (res) => {
								if (res.data.status === 'success') {
									resolve(res);
								} else {
									reject(new Error(res.data.message || '请求失败'));
								}
							},
							fail: reject
						});
					});

					const d = res.data.data;
					// 与 getList 一致：接口层 meta 每次成功都更新（不走「差异」省略）
					this.sortedCardList = d;
					this.intro_url = d.intro_url || '';
					this.$set(this, 'scrollist', Array.isArray(d.rightsList_logo) ? d.rightsList_logo.slice() : []);

					// 检查各数据块是否有变化
					let hasCoulistChanged = this.compareAndUpdateCoupons(
						d.coulist_month.list, this.cachedCoulist
					);
					let hasSecondlistChanged = this.compareAndUpdateCoupons(
						d.coulist_quarter.list, this.cachedSecondlist
					);
					let hasThridlistChanged = this.compareAndUpdateCoupons(
						d.coulist_year.list, this.cachedThridlist
					);
					let hasGoodslistChanged = this.compareAndUpdateGoods(
						d.goodslist, this.cachedGoodslist
					);

					// 只在数据真正变化时才更新UI（使用$set确保响应式，全平台兼容）
					if (hasCoulistChanged) {
						// 使用cou_id匹配，支持顺序变化
						const newCoulist = this.updateCouponListData(this.coulist, d.coulist_month.list, 'cou_id');
						this.$set(this, 'coulist', newCoulist);
					}

					if (hasSecondlistChanged) {
						const newSecondlist = this.updateCouponListData(this.secondlist, d.coulist_quarter.list, 'cou_id');
						this.$set(this, 'secondlist', newSecondlist);
					}

					if (hasThridlistChanged) {
						const newThridlist = this.updateCouponListData(this.thridlist, d.coulist_year.list, 'cou_id');
						this.$set(this, 'thridlist', newThridlist);
					}

					if (hasGoodslistChanged) {
						// 商品列表：使用goods_id匹配，支持商品顺序变化
						// 创建旧数据的映射（使用goods_id作为key，提高查找效率）
						const oldGoodsMap = new Map();
						this.goodslist.forEach((item, index) => {
							if (item.goods_id) {
								oldGoodsMap.set(item.goods_id, { item, index });
							}
						});

						// 遍历新数据，更新或添加
						const newGoodslist = [];
						d.goodslist.forEach((newItem) => {
							const oldData = oldGoodsMap.get(newItem.goods_id);
							if (oldData) {
								// 商品已存在，检查是否有变化
								const oldItem = oldData.item;
								if (oldItem.shop_price !== newItem.shop_price ||
									oldItem.goods_name !== newItem.goods_name ||
									oldItem.goods_thumb !== newItem.goods_thumb ||
									oldItem.attr_name !== newItem.attr_name) {
									// 有变化，使用新数据
									newGoodslist.push(newItem);
								} else {
									// 无变化，使用旧数据（保持引用，避免不必要的渲染）
									newGoodslist.push(oldItem);
								}
							} else {
								// 新商品，直接添加
								newGoodslist.push(newItem);
							}
						});

						// 使用$set更新整个数组（全平台兼容）
						this.$set(this, 'goodslist', newGoodslist);
					}

					// 更新其他数据（这些数据变化频率低，可以直接赋值）
					this.coulist_money = d.coulist_month.money;
					this.secondlist_money = d.coulist_quarter.money;
					this.thridlist_money = d.coulist_year.money;
					this.rightsList = d.rightsList;
					this.rightsList_third = d.rightsList_third;
					this.tip_url = d.tip_url;

					// 与 getList 一致：本地缓存快照始终与服务端响应对齐
					this.cachedCoulist = [...d.coulist_month.list];
					this.cachedSecondlist = [...d.coulist_quarter.list];
					this.cachedThridlist = [...d.coulist_year.list];
					this.cachedGoodslist = [...d.goodslist];

					// 更新缓存时间戳
					this.memberDataCacheTime = Date.now();
					// 保存到本地存储
					this.saveCacheToStorage();

				} catch (error) {
					console.error('后台静默更新失败:', error);
					// 静默失败，不影响用户体验
				} finally {
					this.isSilentRefreshing = false;
				}
			},
			handleListError(errorMsg, resolve, reject) {
				console.error('图片数据请求失败:', errorMsg);

				if (this.retryCount < this.maxRetry) {
					this.retryCount++;

					// 显示重试提示
					uni.showToast({
						title: `图片加载中...(${this.retryCount}/${this.maxRetry})`,
						icon: 'loading',
						duration: 1500
					});

					// 设置定时器，1.5秒后重试
					this.retryTimer = setTimeout(() => {
						this.getList().then(resolve).catch(reject);
					}, 1500);

				} else {
					// 达到最大重试次数，显示错误提示
					uni.showToast({
						title: '图片加载失败，请检查网络',
						icon: 'none',
						duration: 2000
					});

					// 重置重试计数器
					this.retryCount = 0;
					reject(errorMsg);
				}
			},


			// 【重要】加载用户信息
			// 此方法调用 /api/user/profile 接口获取用户信息
			// 返回的数据中包含 drp_shop.membership_status 和 drp_shop.audit
			// 这两个字段用于判断用户是否是会员
			// 
			// 如果会员状态显示不正确，问题很可能是：
			// 1. /api/user/profile 接口返回的 drp_shop 数据不是最新的
			// 2. 需要后端修复此接口，确保返回最新的会员信息
			// 3. 可以对比 /api/drp 接口返回的数据来验证
			async loadUserProfile() {
				const {
					data
				} = await this.$store.dispatch('userProfile', {
					type: true
				});

				this.userInfo = data ? data : ''

				if (data != undefined) {
					uni.setStorageSync("newchatMsg", true);
					uni.setStorageSync("newLoginMsg", true);
				}

				//#ifdef APP-PLUS
				var jpushModule = uni.requireNativePlugin("JG-JPush")
				let alias = (data.uc_id).toString()
				jpushModule.setAlias({
					'alias': alias
				})
				//#endif
			},

			// 分销管理-自定义设置数据
			async getCustomTextByCode() {
				const {
					data: {
						page_drp_info
					},
					status
				} = await this.$store.dispatch('getCustomText', {
					code: 'page_drp_info'
				});
				if (status == 'success') {
					this.pageDrpInfo = page_drp_info || {};
				}
			},
			toGoodsList() {
				uni.navigateTo({
					url: `/pagesD/goodslist/goodslist?search_type=3`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* 抖动动画 */
	@keyframes shake {

		0%,
		100% {
			transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-10rpx);
		}

		20%,
		40%,
		60%,
		80% {
			transform: translateX(10rpx);
		}
	}

	.privacy.shake {
		animation: shake 0.6s ease-in-out;
	}

	/* 完全重置uni-button样式 */
	.custom-button {
		position: static !important;
		display: flex !important;
		margin: 0 !important;
		padding: 0 !important;
		box-sizing: border-box !important;
		font-size: inherit !important;
		text-align: center !important;
		text-decoration: none !important;
		line-height: normal !important;
		border-radius: 0 !important;
		-webkit-tap-highlight-color: transparent !important;
		overflow: visible !important;
		color: inherit !important;
		background-color: transparent !important;
		cursor: pointer !important;
		border: none !important;
		outline: none !important;
	}

	/* 移除按钮的默认边框和背景 */
	.custom-button::after {
		display: none !important;
		border: none !important;
	}

	// 最底部
	.top-bot {
		position: fixed;
		bottom: 0%;
		left: 0%;
		width: 750rpx;
		max-height: 280rpx;
		/* min-height值通过动态样式设置 */
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding-bottom: 80rpx;
		/* #ifdef MP-WEIXIN */
		max-height: 440rpx;
		min-height: 400rpx;
		/* #endif */
		z-index: 9;
		/* 初始状态：隐藏在底部，无动画 */
		transform: translateY(100%);
		transition: none; /* 初始无动画 */
		
		/* 显示状态：滑出，带iOS风格动画 */
		&.show {
			transform: translateY(0);
			transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}

		.noopen {
			margin: 0rpx 32rpx;
			padding: 20rpx 0;

			.fee-btn {
				width: 180rpx;
				height: 60rpx;
				box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
				border-radius: 44rpx;
				border: 1rpx solid #272727;
				margin-bottom: 1rpx;
			}
		}

		.bot-btn {
			// width: 100%;
			width: 688rpx;
			margin-top: 26rpx;
			position: relative;

			.yellow-brage {
				position: absolute;
				top: -60rpx;
				right: 0;
				padding: 4rpx 20rpx;
				font-size: 24rpx;
				color: #FE2F02;
				background: #FAEF89;
				border-radius: 24rpx 24rpx 24rpx 0rpx;
			}

			.left {
				width: 344rpx;
				height: 88rpx;
				background: #FFEDED;
				border-radius: 44rpx 0rpx 0rpx 44rpx;
			}

			.right {
				width: 344rpx;
				height: 88rpx;
				background: #FE2F02;
				box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
				border-radius: 0rpx 44rpx 44rpx 0rpx;
			}




		}
	}


	.bottom-section {
		position: relative;
		z-index: 9;
	}

	/* 自定义指示器样式 */
	.custom-indicator {
		margin: 20rpx 0;
		height: 40rpx;
		position: absolute;
		bottom: 0px;
		left: 50%;
		/* 相对于父容器左移50% */
		transform: translateX(-50%);
		/* 基于自身宽度向左偏移50%，实现精准居中 */
		max-width: 200rpx;
	}

	.indicator-dot {
		width: 40rpx;
		height: 10rpx;
		background-color: #fff;
		margin: 0 10rpx;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.indicator-dot.active {
		background-color: #773E0F;
		width: 40rpx;
		border-radius: 10rpx;
	}

	/* 按钮容器 */
	// .button-container {
	// 	margin: 10rpx 0 36rpx;
	// }

	// 权益
	.rights {
		margin: 0rpx 24rpx 20rpx;
		position: relative;

		.rights-title {
			width: 486rpx;
			height: 76rpx;
			line-height: 76rpx;
			background: linear-gradient(180deg, #FEF5DF 0%, #E6D3A2 100%, #E6D3A2 100%);
			border-radius: 0rpx 0rpx 52rpx 52rpx;
			position: absolute;
			top: 0%;
			left: 15%;

			span {
				font-weight: 600;
				font-size: 36rpx;
				color: #773E0F;
				line-height: 36rpx;
				text-align: justify;
				font-style: normal;
			}
		}

		.rights-two {
			background: linear-gradient(180deg, #FFFFFF 0%, #F1E6C7 100%);
			border-radius: 44rpx;
			padding: 10px 10px 0px 8px;
			margin-bottom: 24rpx;
			/* 关键修改：背景只覆盖到轮播图部分 */
			background-clip: padding-box;
		}

		.right-bora {
			min-width: 100%;
			border-radius: 44rpx;
			border: 2rpx solid #E6D3A2;
			display: inline-block;
			justify-content: center;
			align-items: center;
			/* 移除 padding-top，让背景图自然衔接 */
		}

		/* 调整轮播图容器的 padding */
		// .right-bora > swiper {
		//     padding-top: 88rpx;
		// }

		.seemores {
			width: 100%;
			height: 200rpx;
			background-image: url(https://images.eqingqu.com/attachs/photo/202509/20250924_6A7AF56AF15ED2A825972427E1D1FA59.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center;
			background-color: transparent;
			border: none;
			/* 关键：负 margin 让背景图向上移动覆盖背景色 */
			margin-top: -44rpx;
			/* 根据实际效果调整 */
			position: relative;
			padding-left: 10px;
			padding-right: 10px;
			left: -10px;
			/* #ifdef MP-WEIXIN */
			left: 0px;
			/* #endif */
			font-family: PingFangSC, PingFang SC;
			font-weight: 500;
			font-size: 24px;
			color: #773E0F;
			line-height: 24px;
			text-align: justify;
			font-style: normal;

			.brown-arrows {
				width: 28px;
				height: 28px;

			}
		}

		/* 确保轮播图在正确层级 */
		.coupon-swiper {
			position: relative;
			z-index: 1;
		}

		.rights-one {
			// width: 702rpx;
			// width: 100%;
			// height: 1368rpx;
			background: #FFFFFF;
			border-radius: 44rpx;
			padding: 10px 10px 10px 8px;
			margin-bottom: 24rpx;

			.right-bora {
				min-width: 100%;
				border-radius: 44rpx;
				border: 2rpx solid #E6D3A2;
				display: inline-block;
				justify-content: center;
				align-items: center;
			}
		}
	}

	// 商品列表--权益1
	.goodslist {
		// background-color: pink;
		margin: 0rpx 26rpx 20rpx;

		.item {
			padding-bottom: 10rpx;
		}



		.bgprice {
			width: 330rpx;
			height: 88rpx;
			// background-image: url('../../static/my/bgprice.png');
			background-image: url('https://images.eqingqu.com/attachs/photo/202505/20250506_34FA64FE0A5C585AD7E3EC45C2B3EB17.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center;
			display: flex;
			justify-content: space-between;
			align-items: center;

		}
	}

	.coupon-top {
		display: flex;
		padding: 0 40rpx;
		gap: 20rpx;

		.coupon-top-title {
			font-family: PingFangSC, PingFang SC;
			font-weight: 500;
			font-size: 40rpx;
			color: #1B1B1B;
			line-height: 36rpx;
			text-align: justify;
			font-style: normal;
			line-height: 1.2;

		}

		.coupon-top-brage {
			background: linear-gradient(90deg, #585858 0%, #181613 100%);
			border-radius: 12rpx;
			color: #fff;
			padding: 6rpx 12rpx;
			font-size: 24rpx;
		}
	}

	// 红包列表--权益二
	.right-two {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		/* #ifdef APP-PLUS */
		margin-left: 15rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		margin-left: 18rpx;
		/* #endif */


		.item {
			margin: 5px 5px 10px;
			width: 29%;
			height: 190rpx;
			// background-color: #FEF5DF;
			// background-image: url('../../static/my/bgpacket.png');
			background-image: url(https://images.eqingqu.com/attachs/photo/202504/20250429_13BC10385F944284DEAE86B74054A691.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center;

			.packet {
				font-size: 28rpx;
				color: #FFE2B5;
				margin-top: 11px;
			}
		}
	}


	// 权益三 
	.right-three {
		height: 148rpx;
		background: #F8F6F7;
		border-radius: 18rpx;
		padding: 36rpx 48rpx;
		margin: 0rpx 34rpx 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}



	// 查看更多
	.seemore {
		width: 596rpx;
		height: 90rpx;
		// background: radial-gradient(0% 80% at 0% 83%, #FFD97E 0%, #FE2F02 100%);
		background: linear-gradient(90deg, #FEF5DF 0%, #FFD97E 0%, #FE2F02 100%);
		border-radius: 45rpx;
	}

	// 头部   九大权益
	.page-container {
		position: relative;
		padding-bottom: 440rpx;
		width: 100%;
		// height: 100%;
		// background-image: url('https://images.eqingqu.com/attachs/photo/202505/20250519_FE9A2CA4A54F21CEBE1C1D2BA1CF092A.jpg');
		background-size: 101% 115%;
		background-repeat: no-repeat;
		background-position: center;
		background-color: #FDE6B9;

		/* #ifdef APP-PLUS */
		// min-height: 240vh;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		// min-height: 230vh;
		/* #endif */
		/* #ifdef H5 */
		// min-height: 200vh;
		/* #endif
	}
	
	.topbg{

		background-image: url(https://images.eqingqu.com/attachs/photo/202510/20251024_21BE2F65B1793C6D36E13302A2ED70C5.png);
		background-size: 100% 100%;
		background-repeat: no-repeat ;
		background-position: center;
		height: 700rpx;
	}

	.page-content {
		z-index: 1;
		text-align: center;
	}
	
	.top-tab{
		// width: 188rpx;
		// min-width: 188rpx;
		height: 228rpx;
		// background: #FFFFFF;
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.top-img{
			width: 80rpx;
			height: 80rpx;
			background: #FFF1D9;
		}
	}
	
	.top-onetitle{
		width: 530rpx;
		height: 76rpx;
		line-height: 76rpx;
		background: linear-gradient( 180deg, #FEF5DF 0%, #E6D3A2 100%, #E6D3A2 100%);
		border-radius: 38rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		.title text {
			padding: 0 20upx;
			position: relative;
		}
		text:after, text:before {
		content: '';
		width: 42upx;
		height: 2px;
		background: #272727;
		position: absolute;
		top: 50%;
		}
		text:after {
			left: -42upx;
		}
		text:before {
			right: -42upx;
		}
	}
	
	scroll-view {
		white-space: nowrap;
	}
	 
	::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			color: transparent;
	}
	
	.privacy {
			// display: flex;
			// justify-content: flex-center;
			// align-items: center;
			
			.checkbox {
				margin-right: 0;
	
				.checkbox-icon {
					width: 24rpx;
					height: 24rpx;
					margin-top: -6rpx;
				
					transition: all 0.3s;
				}
	
				.txt {
					color: #a2a2a2;
					font-size: 25rpx;
				}
	
				.href {
					color: #a2a2a2;
					font-size: 25rpx;
				}
			}
			
		
			
			/* 对号样式 */
		.checkbox.checked .checkbox-icon::after {
			content: "";
			position: absolute;
			left: 2rpx;
			top: 0rpx;
			width: 20rpx;
			height: 10rpx;
			border-left: 2rpx solid #fff;
			border-bottom: 2rpx solid #fff;
			transform: rotate(-45deg);
		}
	}

	/* 未登录 */
	.no-container {
		height: 100vh;
	}

	.not-content {
		width: 100%;
		padding: 50px 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.not-content .notimg {
		width: 144px;
		height: 124px;
		margin: 0 auto 20px;
	}

	.not-content .cont {
		text-align: center;
		color: #999999;
	}

	.not-content .conts {
		text-align: center;
		color: #f23030;
	}



	// new
	.textc {
		width: 100%;
		overflow-y: auto;
		margin: 24px 0px 16px;
		background: #FFF6DD;
		box-shadow: inset 0px 0px 20px 0px #fffffd;
		border-radius: 22px;
	}

	.tab-scroll-container {
		width: 100%;
		display: flex;
		/* 开启Flex */
		flex-wrap: wrap;
		/* 超出自动换行（确保每行5个） */
		justify-content: center;
		align-items: flex-start;
		margin: 48rpx 0 32rpx;
		// gap: 14rpx;
		// padding: 0 10rpx;
	}


	.tab-item {
		margin-bottom: 14rpx;
		/* 垂直间距 */
		box-sizing: border-box;
		padding: 0 10rpx;
		/* 水平间距的一半 */
		width: calc((100% - 4 * 20rpx) / 5);
		flex-shrink: 0;
		text-align: center;
	}

	.tab-item--last {
		/* 如果需要特殊样式可以在这里添加 */
		// padding-right: 0 ;
	}



	.top-img {
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
	}


	.fs24 {
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}



	.pop_content {
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;

		.pop_header {
			position: relative;
			padding: 0 30rpx;
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;


			.pop_title {
				font-size: 32rpx;
				font-weight: 700;
				line-height: 90rpx;
				color: #282828;
			}

			.close_img {
				position: absolute;
				top: 50%;
				right: 30rpx;
				transform: translateY(-50%);
				width: 44rpx;
				height: 44rpx;
			}
		}


		.member-content {
			margin: 36rpx;

			.frist.active {
				border-color: #e54d42;
			}

			.frist {
				display: flex;
				min-height: 176rpx;
				// padding: 26rpx 26rpx 0px 26rpx;
				position: relative;
				background-image: url(https://images.eqingqu.com/attachs/photo/202509/20250925_3CD98D5C9E1F512D531CA60018A84637.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center;
				border: 1px solid #fff;
				border-radius: 24rpx;

				.red-brage {
					position: absolute;
					top: -10%;
					left: 5%;
					width: 226rpx;
					height: 42rpx;
					background-image: url(https://images.eqingqu.com/attachs/photo/202509/20250925_7FD1CC5ECBAC81F1B2683C2B3BF44A84.png);
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center;
					font-family: PingFangSC, PingFang SC;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 30rpx;
					text-align: justify;
					font-style: normal;
					padding-left: 10rpx;
				}

				.yellow-diamond {
					width: 140rpx;
					height: 120rpx;
					margin-top: 20rpx;
				}

				.price {
					margin-top: 40rpx;
					margin-left: 40rpx;

					.dollar {
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #FE2F02;
						line-height: 24rpx;
						text-align: left;
						font-style: normal;
					}

					.red-price {
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 60rpx;
						color: #FE2F02;
						line-height: 48rpx;
						text-align: left;
						font-style: normal;
					}

					.gray-price {
						text-decoration: line-through;
						font-family: PingFangSC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #A2A2A2;
						line-height: 24rpx;
						text-align: justify;
						font-style: normal;
					}
				}

				.member-name {
					margin-top: 40rpx;
					margin-left: 40rpx;
					font-family: PingFangSC, PingFang SC;
					font-weight: 500;
					font-size: 36rpx;
					color: #773E0F;
					line-height: 36rpx;
					text-align: justify;
					font-style: normal;
				}
			}

			.member-button {
				margin-top: 40rpx;
				padding: 0 20rpx;
				background: #FE2F02;
				box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
				border-radius: 44rpx;
			}

			.button-content {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 20rpx;
			}

			.button-main-text {

				font-family: PingFangSC, PingFang SC;
				font-weight: 500;
				font-size: 44rpx;
				color: #FFFFFF;
				line-height: 36rpx;
				text-align: left;
				font-style: normal;
			}

			.button-dollar {
				font-family: PingFangSC, PingFang SC;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 24rpx;
				text-align: left;
				font-style: normal;
				margin-top: 10rpx;
			}

			.button-original-price {
				text-decoration: line-through;
				font-family: PingFangSC, PingFang SC;
				font-weight: 300;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 28rpx;
				text-align: left;
				font-style: normal;
			}

			.button-action {
				font-family: PingFangSC, PingFang SC;
				font-weight: 500;
				font-size: 36rpx;
				color: #FFFFFF;
				line-height: 36rpx;
				text-align: left;
				font-style: normal;
			}

			.sub_btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				font-size: 32rpx;
				justify-content: center;
			}

			.second {
				display: flex;
				justify-content: space-around;
				gap: 26rpx;
				margin: 24rpx 0;

				.second-item.active {
					border-color: #e54d42;
					background: #fff5f5;

				}

				.second-item {
					flex: 1;
					padding: 32rpx;
					text-align: center;
					background: linear-gradient(90deg, #FCFBFC 0%, #F8F6F7 100%);
					border-radius: 24rpx;
					border: 2rpx solid #EDEDED;

					.second-name {
						text-align: center;
						font-family: PingFangSC, PingFang SC;
						font-weight: 400;
						font-size: 36rpx;
						color: #1B1B1B;
						line-height: 36rpx;
						text-align: center;
						font-style: normal;
						margin-bottom: 20rpx;
					}

					.second-dollar {
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #1B1B1B;
						line-height: 24rpx;
						text-align: left;
						font-style: normal;
						margin-right: 8rpx;
					}

					.second-price-num {
						font-family: PingFangSC, PingFang SC;
						font-weight: 500;
						font-size: 60rpx;
						color: #1B1B1B;
						line-height: 48rpx;
						text-align: left;
						font-style: normal;
					}

					.second-dollar.active {
						color: #FE2F02;
					}

					.second-price-num.active {
						color: #FE2F02;
					}
				}
			}
		}

	}
</style>