<template>
	<view class="user-default">
		<view class="user-header"
			:class="{'mp-header':controlVersion && userInfo && userInfo.is_drp > 0 && (userInfo.drp_shop.membership_status != 0 ? userInfo.drp_shop.audit == 1 : true),'no-login': !userInfo}">
			<!-- #ifdef MP-WEIXIN -->
			<view :style="{height: statusHeight + 'px'}">
				<!-- 这里是状态栏 -->
			</view>
			<!-- #endif -->
			<view class="user-header-box">
				<view class="head-img pore" :class="{'head-imgno':!userInfo}"
					@click="$outerHref('/pagesB/profile/profile',$isLogin())">
					<image :src="userInfo.avatar" v-if="userInfo && userInfo.avatar" class="img"></image>
					<image :src="imagePath.userDefaultImg" v-else class="img"></image>
					<view class="age flex-between" v-if="userInfo.qu_age">
						<div></div>
						<div class="pr10 fs28" style="display: flex;align-items: center;">{{userInfo.qu_age}}年</div>
					</view>
				</view>
				<view class="head-admin">
					<view class="header-admin-box line36">
						<view class="left">
							<block v-if="userInfo">
								<view class="name mt10" v-if="userInfo.name !=''">{{ userInfo.name }}</view>
								<view class="name " v-else>{{ userInfo.username }}</view>
							</block>
							<block v-else>
								<navigator url="/pagesB/login/login?delta=1" hover-class="none" class="name fsbold">
									{{$t('lang.not_login')}}
								</navigator>
							</block>
						</view>
						<!--会员码-->
						<!-- <view clas="user_qrcode" @click="onUserQrcode" v-if="userInfo">
							<text class="iconfont icon-erweima"></text>
							<text>会员码</text>
						</view> -->
					</view>
					<view class="flex-start" v-if="userInfo" style="display: flex;align-items: center;">
						<div class="flex-center lineintal"
							@click="$outerHref('/pagesB/collectionGoods/collectionGoods',$isLogin())">
							<span class="fs500 fs32 ">{{userInfo.collect_goods_num}}</span>
							<span class="fs26 co62 plr10">{{$t('lang.my_collection')}}</span>
						</div>
						<div class="flex-center pl48" @click="$outerHref('/pagesB/history/history',$isLogin())">
							<span class="fs500 fs32 ">{{userInfo.history_goods_num}}</span>
							<span class="fs26 co62 plr10">{{$t('lang.my_tracks')}}</span>
						</div>
						<div class="flex-center pl48"
							@click="$outerHref('/pagesB/collectionShop/collectionShop',$isLogin())">
							<span class="fs500 fs32 ">{{userInfo.collect_store_num}}</span>
							<span class="fs26 co62 plr10">{{$t('lang.store_attention')}}</span>
						</div>
					</view>
					<view class="growth" v-if="userInfo">
						<view class="top fs26">
							<view class=" uni-ellipsis flex-start  pr20" v-if="userInfo.user_rank"
								@click="touserranking">
								<image src="https://images.eqingqu.com/attachs/photo/202505/20250526_669B3FCC116A2334BC55999167743D53.png" mode="" class="img36 pr8"></image>
								{{ userInfo.user_rank }}
							</view>
							<view class="uni-ellipsis"
								@click="$outerHref('../../pagesB/growthvalue/growthvalue',$isLogin())"
								v-if="userInfo.drp_shop == 0 && userInfo.user_rank_progress">
								<image src="https://images.eqingqu.com/attachs/photo/202505/20250526_2237262D9506954813DBCD252F1E942C.png" mode="widthFix"
									style="width: 36rpx;height: 32rpx;bottom: -2px;"></image>
								<span class="plr8">
									{{$t('lang.growth_value')}}
									{{ userInfo.user_rank_progress.progress_format }}
								</span>
								<uni-icons type="arrowright" size="11" color="#000"></uni-icons>
							</view>
							<view class=" uni-ellipsis"
								@click="$outerHref('../../pagesB/growthvalue/growthvalue',$isLogin())" v-else>
								<image src="https://images.eqingqu.com/attachs/photo/202505/20250526_2237262D9506954813DBCD252F1E942C.png" mode="widthFix"
									style="width: 36rpx;height: 32rpx;bottom: -2px;"></image>
								{{$t('lang.growth_value')}}
								{{ userInfo.rank_points ? userInfo.rank_points : 0 }}<uni-icons type="arrowright"
									size="11" color="#000"></uni-icons>
							</view>
						</view>
						<!-- <view class="bot" v-if="userInfo.drp_shop == 0 && userInfo.user_rank_progress">
							<progress :percent="userInfo.user_rank_progress.percentage" border-radius="3"
								stroke-width="2" activeColor="#FFFFFF"
								backgroundColor="rgba(255,255,255,.5)"></progress>
						</view> -->
					</view>
				</view>
				<view class="header-icon">
					<!-- <view @click="$outerHref('/pagesB/messagelist/messagelist',$isLogin())" class="goods-img">
						<text v-if="isUnread"></text>
						<view class="iconfont icon-home-xiaoxi"></view>
					</view> -->
					<view @click="$outerHref('/pagesB/profile/profile',$isLogin())"
						class="iconfont icon-personal-shezhi"></view>
					<!-- #ifdef MP-WEIXIN -->
					<view @click="onClearCache" class="iconfont icon-close"></view>
					<!-- #endif -->
				</view>
			</view>
			<!-- 收藏足迹关注 -->
			<!-- <view class="itemize" v-if="userInfo">
				<view class="itemize_collection"
					@click="$outerHref('/pagesB/collectionGoods/collectionGoods',$isLogin())">
					<view class="num">{{userInfo.collect_goods_num}}</view>
					<view class="text">{{$t('lang.my_collection')}}</view>
				</view>
				<view class="itemize_collection" @click="$outerHref('/pagesB/history/history',$isLogin())">
					<view class="num">{{userInfo.history_goods_num}}</view>
					<view class="text">{{$t('lang.my_tracks')}}</view>
				</view>
				<view class="itemize_collection"
					@click="$outerHref('/pagesB/collectionShop/collectionShop',$isLogin())">
					<view class="num">{{userInfo.collect_store_num}}</view>
					<view class="text">{{$t('lang.store_attention')}}</view>
				</view>
			</view> -->
			<view class="exclusive_on "
				v-if="controlVersion && (configData.is_show_drp == 1 && userInfo && userInfo.is_drp > 0)">
				<view class="exclusive">
					<!--  @click="$outerHref('/pagesB/member/member',$isLogin())" -->
					<view class="left">
						<view class="icon_vip">
							<image src="https://images.eqingqu.com/attachs/photo/202505/20250519_229C355511A232C21AAF05D80B965B96.png" mode="widthFix" style="width: 48rpx;hieght:48rpx;"></image>
						</view>
						<view class="" style="">
							<image src="https://images.eqingqu.com/attachs/photo/202505/20250519_D02BADA340EE82D59347E63662F16C40.png" mode="widthFix" style="width: 120rpx;
							margin: 10rpx 16rpx -4rpx 16rpx;"></image>
						</view>
						<!-- <text>{{pageUserDrp.vip_name ? pageUserDrp.vip_name : $t('lang.high_grade_vip')}}</text> -->
					</view>
					<view class="center"
						v-if="userInfo.drp_shop.membership_status != 0 ? userInfo.drp_shop.audit == 1 : true"
						style="font-weight: bold;color: #000000;">会员累计节省<text
							style="color: #EA0C21;">{{userInfo.user_save_money}}</text>元</view>
					<!-- <view class="center" v-if="userInfo.drp_shop.membership_status != 0 ? userInfo.drp_shop.audit == 1 : true">{{pageUserDrp.vip_title_2 ? pageUserDrp.vip_title_2 : $t('lang.store_price')}}{{userInfo.drp_affiliate.total_drp_log_money}}</view> -->
					<view class="center" v-else>
						{{pageUserDrp.vip_title ? pageUserDrp.vip_title : $t('lang.shopping_saves_money_shares')}}
					</view>
					<block v-if="userInfo">
						<!--@click="mydrplink('info')"     @click="mydrplink('register')" -->
						<!--  @click="$outerHref('/pagesB/member/member',$isLogin())" -->
						<view class="right"
							v-if="userInfo.drp_shop.membership_status != 0 ? userInfo.drp_shop.audit == 1 : true"
							@click="onMember">
							<!-- @click="mydrplink('info')" > -->
							<view class="flex-center"><text>{{pageUserDrp.my_vip}}</text></view>
							<view class="flex-center"><uni-icons type="arrowright" size="15"
									color="#E3C49E"></uni-icons></view>
						</view>
						<view class="right" v-else @click="onMember">
							<view class="flex-center">
								<text>{{pageUserDrp.immediately_opened ? pageUserDrp.immediately_opened : $t('lang.immediately_opened')}}</text>
							</view>
							<view class="flex-center">
								<uni-icons type="arrowright" size="15" color="#E3C49E"></uni-icons>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- <view class="exclusive_on" v-if="userInfo&&affiliate_infovalue">
			<view class="exclusive">
				<view class="left">
					<view class="icon_vip">
						<image src="https://images.eqingqu.com/attachs/photo/202309/20230918_8793CF8A18858D0105B84D3DB34BE72C.png" mode="heightFix"></image>
					</view>
				</view>
				<view class="center" style="font-weight: bold;color: #000000;" v-if="affiliate_infovalue">享<text style="color: #EA0C21;">{{affiliate_infovalue}}折</text>会员价，累省<text style="color: #EA0C21;">{{userInfo.user_save_money}}</text>元</view>
				<view class="center" v-else>{{$t('lang.shopping_saves_money_shares')}}</view>
				<block v-if="userInfo">
					<view class="right" @click="mydrplink('affiliate')">
						<text>去查看</text>
					</view>
				</block>
			</view>
		</view> -->
		<view class="user-function-ward"
			:class="{'mp-header':controlVersion && configData.is_show_drp == 1 && userInfo && userInfo.is_drp > 0}">
			<!--我的推广  我的分销 -->
			<!-- <view class="user-function-list user-function-list1"
				v-if="controlVersion && userInfo && (userInfo.drp_affiliate || userInfo.user_affiliate)">
				<view class="items">
					<view class="item">
						<text
							class="txt">{{ userInfo.drp_affiliate ? userInfo.drp_affiliate.user_child_num : userInfo.user_affiliate.user_child_num }}</text>
						<text
							class="span">{{pageUserDrp.drp_team ? pageUserDrp.drp_team : $t('lang.my_team_alt')}}</text>
					</view>
					<view class="item">
						<text
							class="txt">{{ userInfo.drp_affiliate ? userInfo.drp_affiliate.register_affiliate_money : userInfo.user_affiliate.register_affiliate_money }}</text>
						<text
							class="span">{{pageUserDrp.register_money ? pageUserDrp.register_money : $t('lang.registration_award')}}</text>
					</view>
					<view class="item tom">
						<text
							class="txt">{{ userInfo.drp_affiliate ? userInfo.drp_affiliate.total_drp_log_money : userInfo.user_affiliate.order_affiliate_money }}</text>
						<text
							class="span">{{pageUserDrp.order_money ? pageUserDrp.order_money : $t('lang.sale_reward')}}</text>
					</view>
				</view>
				<view class="broadcasting" v-if="userInfo.drp_affiliate" @click="mydrpCenter('info')">
					<view class="icon"><text class="iconfont icon-personal-share" style="font-size: 48upx;"></text>
					</view>
					<view class="textit">
						{{pageUserDrp.my_promotion ? pageUserDrp.my_promotion : $t('lang.growth_tuiguang')}}
					</view>
				</view>
				<view class="broadcasting" @click="mydrpCenter('affiliate')" v-else>
					<view class="icon"><text class="iconfont icon-personal-share" style="font-size: 48upx;"></text>
					</view>
					<view class="textit">
						{{pageUserDrp.my_promotion ? pageUserDrp.my_promotion : $t('lang.growth_tuiguang')}}
					</view>
				</view>
				<view class="broadcasting" v-if="userInfo.drp_affiliate" @click="mydrpCenter()">
					<view class="icon"><text class="iconfont icon-personal-share" style="font-size: 48upx;"></text>
					</view>
					<view class="textit">
						{{pageUserDrp.my_promotion ? pageUserDrp.my_promotion : $t('lang.growth_tuiguang')}}
					</view>
				</view>
				<view class="broadcasting" @click="mydrpCenter()" v-else>
					<view class="icon"><text class="iconfont icon-personal-share" style="font-size: 48upx;"></text>
					</view>
					<view class="textit" @click="goisRetail">
						{{pageUserDrp.my_promotion ? pageUserDrp.my_promotion : $t('lang.growth_tuiguang')}}
					</view>
				</view>
			</view>
			 -->
			<!-- 资金管理 -->
			<view class="user-function-list">
				<view class="user-item-title">
					<view class="tit">{{$t('lang.my_wallet')}}</view>
					<view <view @click="$outerHref('/pagesB/account/account',$isLogin())" class="more">
						<text>{{$t('lang.all_wallet')}}</text>
						<uni-icons type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</view>
				<view class=" user-function-list1">
					<view class="wallets">
						<view @click="$outerHref('/pagesB/account/account',$isLogin())" class="wallet">
							<view class="txt tite"><span class="fs32 fs500">{{ userInfo && userInfo.user_money || 0 }}
								</span><span class="fs20 co82">元</span> </view>
							<view class="fs24 co62">{{$t('lang.money')}}</view>
						</view>
						<view @click="$outerHref('/pagesB/coupon/coupon',$isLogin())" class="wallet">
							<view class="txt tite"><span
									class="fs32 fs500">{{ userInfo && userInfo.coupons_num || 0 }}</span><span
									class="fs20 co82">个</span></view>
							<view class="fs24 co62">{{$t('lang.coupons')}}</view>
						</view>
						<view @click="$outerHref('/pagesB/account/account',$isLogin())" class="wallet">
							<view class="txt tite"><span
									class="fs32 fs500">{{ userInfo && userInfo.pay_points || 0 }}</span></view>
							<view class="fs24 co62">{{$t('lang.integral')}}</view>
						</view>
					</view>
				</view>
			</view>
			
			
			<!-- 我的订单 -->
			<view class="user-function-list ">
				<view class="user-item-title">
					<view class="tit">{{$t('lang.my_order')}}</view>
					<view @click="$outerHref('/pagesB/order/order',$isLogin())" class="more">
						<text>{{$t('lang.all_order')}}</text>
						<uni-icons type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</view>
				<view class="user-items ">
					<view @click="$outerHref('/pagesB/order/order?tab=1',$isLogin())" class="user-item">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_04CBF0970AC201727874A00A7A7A61E7.png">
							</image>
							<view class="num" v-if="userInfo && userInfo.pay_count > 0">
								{{ userInfo.pay_count < 99 ? userInfo.pay_count : capitalize }}
							</view>
						</view>
						<view class="text">{{$t('lang.order_status_01')}}</view>
					</view>
					<!-- <view @click="$outerHref('/pagesA/team/order/order',$isLogin())" class="user-item">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_84F2AA14DFBB2E567C7527D4943D4669.png">
							</image>
							<view class="num" v-if="userInfo && userInfo.team_num > 0">
								{{ userInfo.team_num < 99 ? userInfo.team_num : capitalize }}
							</view>
						</view>
						<view class="text">{{$t('lang.order_status_02')}}</view>
					</view> -->
					<view @click="$outerHref('/pagesB/order/order?tab=2',$isLogin())" class="user-item">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_C589CCB1E5405F408384761958F99592.png">
							</image>
							<view class="num" v-if="userInfo && userInfo.confirmed_count > 0">
								{{ userInfo.confirmed_count < 99 ? userInfo.confirmed_count : capitalize }}
							</view>
						</view>
						<view class="text">{{$t('lang.order_status_03')}}</view>
					</view>
					<view @click="$outerHref('/pagesB/comment/comment',$isLogin())" class="user-item"
						v-if="userInfo && userInfo.shop_can_comment > 0 && isComment==true">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_0605E3F634AA9B08470DAAB93FC6CC7E.png">
							</image>
							<view class="num" v-if="userInfo && userInfo.not_comment > 0">
								{{ userInfo.not_comment < 99 ? userInfo.not_comment : capitalize }}
							</view>
						</view>
						<view class="text">{{$t('lang.order_status_04')}}</view>
					</view>
					<view @click="$outerHref('/pagesB/afterSales/afterSales',$isLogin())" class="user-item">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_AD820249AF05ED38C0DD9EA1A6076037.png">
							</image>
							<view class="num" v-if="userInfo && userInfo.return_count > 0">
								{{ userInfo.return_count < 99 ? userInfo.return_count : capitalize }}
							</view>
						</view>
						<view class="text">{{$t('lang.order_status_05')}}</view>
					</view>
					<!-- <view @click="$outerHref('/pagesD/shareMoney/shareMoney',$isLogin())" class="user-item"> -->
					<view  v-if="!isIos" @click="goshareMoney()" class="user-item"> 	
						<view class="tit">
							<image src="https://images.eqingqu.com/attachs/photo/202505/20250506_1A3C342939003C3115E647FD8312DB30.png">
							</image>
						</view>
						<view class="text">分享赚钱</view>
					</view>
					<view   v-if="isIos" @click="$outerHref('/pagesB/order/order?tab=3',$isLogin())" class="user-item">
						<view class="tit">
							<image
								src="https://images.eqingqu.com/attachs/photo/202508/20250808_914531BC25A94EEF9F7228D9EF0EA54B.png">
							</image>
							<!-- <view class="num" v-if="userInfo && userInfo.pay_count > 0">
								{{ userInfo.pay_count < 99 ? userInfo.pay_count : capitalize }}
							</view> -->
						</view>
						<view class="text">{{$t('lang.ss_received')}}</view>
					</view>
					
				</view>
			</view>
			<!-- 我的优惠券 -->
			<!-- <view class="user-function-list" v-if="userInfo && userInfo.coupons_num != 0">
				<view class="user-item-title">
					<view class="tit">{{$t('lang.my_coupons')}}({{ userInfo && userInfo.coupons_num || 0 }})</view>
					<view @click="$outerHref('/pagesB/coupon/coupon',$isLogin())" class="more">
						<text>{{$t('lang.more')}}</text>
						<uni-icons type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</view>
				<view class="user-item_on">
					<view class="my_coupons" v-for="(item,index) in couponData" :key="index">
						<view class="my">
							<view class="my_coupons_left">
								<view class="price">
									<block v-if="item.cou_type == 5">{{$t('lang.freight_free')}}</block>
									<block v-else>
										<block v-if="!item.order_sn">
											<block v-if="item.uc_money > 0"><text>￥</text>{{ item.cou_money }}</block>
											<block v-else><text>￥</text>{{item.cou_money}}</block>
										</block>
										<block v-else>
											{{item.order_coupons}}
										</block>
									</block>
								</view>
								<view class="reduction">
									<text>{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.yuan')}}</text>
								</view>
								<view class="platform">{{ item.store_name }}</view>
							</view>
							<view class="my_coupons_right" @click="couponLink(item.cou_id)">
								{{$t('lang.store_price1')}}
							</view>
						</view>
					</view>
				</view>
			</view>
			 -->

			<!-- 全部工具 -->
			<view class="user-function-list" v-for="(item,index) in customNav" :key="index">
				<view class="user-items user-nav-items " v-if="showMore">
					<view @click="linkHref(itemChild.url)" class="user-item"
						v-for="(itemChild,indexChild) in item.child_nav" :key="indexChild">
						<view class="">
							<image :src="itemChild.pic" mode="heightFix" style="width: 26px;height: 26px;"></image>
						</view>
						<view class="fs24 pt010">{{itemChild.name}}</view>
					</view>
				</view>

				<view class="user-items user-nav-items user-nav-items-more" v-else>
					<view @click="linkHref(itemChild.url)" class="user-item"
						v-for="(itemChild,indexChild) in item.child_nav" :key="indexChild">
						<view class="tit">
							<image :src="itemChild.pic" mode="heightFix" style="width: 26px;height: 26px;"></image>
						</view>
						<view class="fs24 pt010 ">{{itemChild.name}}</view>
					</view>
				</view>
				<view class="flex-center " style="padding: 26rpx 0 32rpx;" @click="changeMore">
					<view class="fa24 co82" v-if="item.child_nav.length > 10">
						<span class="pr12">{{ showMore ==true ? '展开':'收起'}}</span>
						<uni-icons type="arrowdown" size="11" color="#828282" v-if="showMore"></uni-icons>
						<uni-icons type="arrowup" size="11" color="#828282" v-else></uni-icons>
					</view>
				</view>
			</view>
			<!-- <view class="user-function-list" v-for="(item,index) in 1" :key="index">
				<view class="user-items user-nav-items">
					<view @click="linkHref(111111)" class="user-item" v-for="(itemChild,indexChild) in 1" :key="indexChild">
						<view class="tit">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_5ED008A1BA5E7B8ED02E959D6AFEE7FD.png"></image>
						</view>
						<view class="text">平台客服</view>
					</view>
				</view>
			</view> -->
			<!-- <view class="user-function-list" v-for="(item,index) in 1" :key="index">
				<view class="user-items user-nav-items">
					<view @click="linkHref(222222)" class="user-item" v-for="(itemChild,indexChild) in 1" :key="indexChild">
						<view class="tit">
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_5ED008A1BA5E7B8ED02E959D6AFEE7FD.png"></image>
						</view>
						<view class="text">测试</view>
					</view>
				</view>
			</view> -->
		</view>

		<!--会员码弹窗-->
		<view class="user-qrcode-popup">
			<uni-popup :show="userQrcodeShow" mode="fixed" v-on:hidePopup="closeUserQrcode">
				<view class="header" :style="{'background-image':'url('+imagePath.userqrcodeBg +')'}">
					<view class="header-warp">
						<view class="logo">
							<image :src="userInfo.avatar" v-if="userInfo && userInfo.avatar" class="img"></image>
							<image :src="imagePath.userDefaultImg" v-else class="img"></image>
						</view>
						<view class="name">{{ userInfo.name !='' ? userInfo.name : userInfo.username }}</view>
						<view class="rank">{{ userInfo.user_rank }}</view>
					</view>
					<text class="close" @click="closeUserQrcode">关闭</text>
				</view>
				<view class="content">
					<block v-if="userInfo.mobile">
						<view class="ms">请向营业员出示会员码进行优惠结算及付款</view>
						<view class="qrcode">
							<canvas canvas-id="qrcode" style="height: 150px; width: 150px;" />
						</view>
						<view class="total">
							<view class="total-item">
								<view class="text">积分</view>
								<view class="number">
									{{ userInfo.drp_shop == 0 && userInfo.user_rank_progress ? userInfo.user_rank_progress.progress_format : userInfo.rank_points }}
								</view>
							</view>
							<view class="total-item">
								<view class="text">余额</view>
								<view class="number">{{ userInfo.user_money }}</view>
							</view>
							<view class="total-item">
								<view class="text">红包</view>
								<view class="number">{{ userInfo.bonus }}</view>
							</view>
						</view>
					</block>
					<view class="not-mobile" v-else>
						<view class="p">会员码功能需绑定手机号方可使用</view>
						<view class="button" @click="bindphoneHref">去绑定</view>
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 轮播图 -->
		<!-- <view class="page-section" :class="{'slide-new':2 == 2}">
			<view class="page-section-spacing">
				<swiper class="swiper" style="height: 220rpx;" :indicator-dots="false" :autoplay="autoplay"
					:interval="interval" :duration="duration" @change="getBanner">
					<swiper-item v-for="(items,indexs) in slideList" :key="indexs">
						<view class="swiper-item" @click="linkslide(items)">
							<image :src="items.ad_code" class="image"
								style="width: 100%;height: 100%;border-radius: 20rpx;" mode="widthFix">
							</image>
						</view>
					</swiper-item>
				</swiper>
				<view style="position: absolute;right: 3%;bottom: 15%;" class="dots-container pagination-center">
					<view v-for="(ad, indexs) in slideList" :key="indexs"
						:class="['dot', indexs === activeIndex ? 'active' : '']"></view>
				</view>
			</view>
		</view> -->
		<!-- 注销账号申请 -->
		<view v-if="show_logoff">
			<view class="cover" catchtouchmove="true" @click="setlogoffNo"></view>
			<view class="wxshare_y">
				<view class="pt20 fs36">注销账号申请</view>
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
					style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 40rpx;padding: 0 30rpx;">
					<view class="add_box3_1_a_sx" @click="logoffno">联系客服</view>
					<view class="add_box3_a_sx" @click="logoffyes">注销申请</view>
				</view>
				<view style="height: 40rpx;"></view>
			</view>
		</view>

		<view class="goods-detail-guess" v-if="guessList.length > 0 && directionalPush == '开启'">
			<view class="title"><text>平台推荐</text></view>
			<!-- <view class="title"><text>{{$t('lang.guess_love')}}</text></view> -->
			<view class="product-list-lie">
				<dsc-product-list :list="guessList" :showone="true" :productOuter="true"
					:guessList="true"></dsc-product-list>
			</view>
		</view>
		<uni-load-more :status="loadMoreStatus" :content-text="contentText" v-if="page > 0 && showLoadMore" />
		<!-- 底部版权 -->
		<dsc-copyright></dsc-copyright>
	<!-- 	<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true"
			@fileterScrollTop="fileterScrollTop"></dsc-filter-top> -->
	<custom-tabbar />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import tabbar from "@/components/zdy-tabbar/zdy-tabbar.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import universal from '@/common/mixins/universal.js';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	// import dscProductPick from '@/pagesD/components/visualization/product-pick/Frontend'
	import dscProductPick from '@/pagesD/components/visualization/product-pick/Frontend.vue'
	import dscProductList from '@/components/dsc-product-list.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniStatusBar from '@/components/uni-status-bar.vue';
	import dscCopyright from '@/components/dsc-copyright/dsc-copyright.vue'
	import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'; 
	import uQRCode from '@/pagesD/comment/uqrcode.js'
	import { incrementVersion } from '@/utils/version.js';

	//#ifdef APP-PLUS
	var jpushModule = uni.requireNativePlugin("JG-JPush")
	jpushModule.addTagAliasListener(result => {
		console.log('user1', JSON.stringify(result))
	})
	//#endif

	export default {
		mixins: [universal],
		components: {
			tabbar,
			dscProductPick,
			dscProductList,
			uniIcons,
			uniPopup,
			uniLoadMore,
			uniStatusBar,
			dscCopyright,
			dscFilterTop,
			CustomTabbar
		},
		data() {
			return {
				 isAndroid: false, // 是否为Android设备
				      isIos: false, // 是否为iOS设备
				urls: '',
				title: '',
				show_logoff: false,
				token: '',
				show: false,
				status: 0,
				page: 1,
				size: 10,
				scrollPickOpen: false,
				loadMoreStatus: 'loading',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				showLoadMore: false,
				guessList: [],
				capitalize: '99+',
				isLoading: true,
				pageUserDrp: {},
				customNav: [],
				userQrcodeShow: false,
				statusHeight: 56,
				userInfo: '',
				configData: uni.getStorageSync('configData'),
				scrollState: false,

				isComment: false, // 评论是否显示
				affiliate_infovalue: '', // 优惠折扣
				user_save_money: '', // 节省金额
				version: '',
				slideList: [],
				autoplay: true,
				interval: 5000,
				duration: 500,
				imgheights: 120,
				activeIndex: 0,
				marginWidth: 0,
				articleId: '',
				directionalPush: '开启',
				showMore: true,
				mydrptype:false,
				device: 'app', // 请求 touch_nav 用：wxapp(小程序)/h5/app，在 onLoad 中按平台赋值
				// ---- 缓存相关 ----
				_userCacheSuffix: null,       // 当前用户缓存后缀，用于换账号检测
				_isSilentRefreshing: false,   // 防止并发静默刷新
				_lastSilentRefreshTs: 0,      // 上次静默刷新时间戳
			};
		},
		computed: {
			...mapState({
				//data: state => state.user.userInfo,
				goodsGuessList: state => state.shopping.goodsGuessList, //猜你喜欢
			}),
			couponData: {
				get() {
					return this.$store.state.user.couponData
				},
				set(val) {
					this.$store.state.user.couponData = val
				}
			},

		},
		watch: {
			userInfo: {
				handler: function(val, oldVal) {
					this.getCustomNav();
					if (val) {
						
						//分销自定义
						if (val.is_drp > 0) {
							this.getCustomTextByCode();
						}
						//会员优惠券
						this.userCouponList();
					}
				},
				deep: true
			}
		},
		methods: {
			// ---- 缓存工具方法 ----
			/** 获取当前用户缓存 key 后缀（用 user_id 区分多账号） */
			_getUserCacheSuffix() {
				const uid = uni.getStorageSync('user_id') || (this.userInfo && this.userInfo.user_id) || '';
				return String(uid || 'guest');
			},
			/** 读取我的页缓存 */
			_readUserPageCache() {
				const suffix = this._getUserCacheSuffix();
				try {
					const data = uni.getStorageSync('user_page_cache_' + suffix);
					const time = uni.getStorageSync('user_page_cache_time_' + suffix);
					if (data && data.userInfo) return { data, time: time || 0 };
				} catch (e) {}
				return { data: null, time: 0 };
			},
			/** 写入我的页缓存 */
			_writeUserPageCache(payload) {
				const suffix = this._getUserCacheSuffix();
				try {
					uni.setStorageSync('user_page_cache_' + suffix, payload);
					uni.setStorageSync('user_page_cache_time_' + suffix, Date.now());
				} catch (e) {}
			},
			/** 从缓存恢复数据到页面（仅在内存为空时调用） */
			_restoreFromCache() {
				const { data } = this._readUserPageCache();
				if (!data) return false;
				if (data.userInfo)  this.userInfo  = data.userInfo;
				if (data.customNav && data.customNav.length > 0) this.customNav = data.customNav;
				if (data.guessList && data.guessList.length > 0) {
					this.guessList = data.guessList;
					this.loadMoreStatus = data.guessList.length >= 10 ? 'loading' : 'noMore';
				}
				return true;
			},
			/** 静默刷新：接口返回后差异更新，用户无感知 */
			async _silentRefresh() {
				const MIN_INTERVAL = 15000;
				if (this._isSilentRefreshing) return;
				if (Date.now() - this._lastSilentRefreshTs < MIN_INTERVAL) return;
				this._isSilentRefreshing = true;
				this._lastSilentRefreshTs = Date.now();
				try {
					await this._fetchAndUpdateAll();
				} catch (e) {
					console.warn('[user] 静默刷新失败:', e);
				} finally {
					this._isSilentRefreshing = false;
				}
			},
			/** 拉取全部数据并差异更新 */
			async _fetchAndUpdateAll() {
				await Promise.all([
					this._fetchUserProfile(),
					this._fetchCustomNav(),
					this._fetchGuessList(),
				]);
			},
			/** 拉取用户信息并差异更新 */
			async _fetchUserProfile() {
				const { data } = await this.$store.dispatch('userProfile', { type: true });
				if (!data) return;
				this.userInfo = data;
				uni.setStorageSync('userInfo', data);
				if (data != undefined) {
					uni.setStorageSync('newchatMsg', true);
					uni.setStorageSync('newLoginMsg', true);
				}
				// #ifdef APP-PLUS
				try {
					let alias = (data.uc_id).toString();
					jpushModule.setAlias({ 'alias': alias });
				} catch(e) {}
				// #endif
				this._saveCache();
			},
			/** 拉取工具栏并差异更新 */
			_fetchCustomNav() {
				return new Promise((resolve) => {
					uni.request({
						url: this.websiteUrl + '/api/user/touch_nav',
						method: 'POST',
						data: { device: this.device, app_version: this.version },
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data && res.data.data) {
								this.customNav = res.data.data;
								this._saveCache();
							}
							resolve();
						},
						fail: () => resolve()
					});
				});
			},
			/** 拉取猜你喜欢第一页并差异更新 */
			_fetchGuessList() {
				return new Promise((resolve) => {
					uni.request({
						url: this.websiteUrl + '/api/catalog/goodslist',
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						data: { warehouse_id: 0, area_id: 0, page: 1, size: 10 },
						success: (res) => {
							if (res.statusCode == 200 && res.data && res.data.data) {
								const newList = res.data.data;
								// 差异更新：只有数据变化时才替换，避免列表闪烁
								if (JSON.stringify(newList) !== JSON.stringify(this.guessList.slice(0, 10))) {
									if (this.page === 1) {
										this.guessList = newList;
									} else {
										// 已翻页：只更新前10条
										this.guessList.splice(0, 10, ...newList);
									}
								}
								if (newList.length < 10) this.loadMoreStatus = 'noMore';
								this._saveCache();
							}
							resolve();
						},
						fail: () => resolve()
					});
				});
			},
			/** 将当前数据写入缓存 */
			_saveCache() {
				if (!this.userInfo) return;
				this._writeUserPageCache({
					userInfo:  this.userInfo,
					customNav: this.customNav,
					guessList: this.guessList.slice(0, 10),
				});
			},
			
			goshareMoney () {
				
				if (!this.$isLogin()) {
					uni.showModal({
						content: "您需要登录会员!",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
					return
				}
				// uni.navigateTo({
				// 	url: "/pagesD/shareMoney/shareMoney"
				// })
				// 是否已申请
				uni.request({
					// url: 'https://www.ok9288.com/api/drp',
					url: this.websiteUrl + '/api/drp',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						
						if (res.data.status == 'success') {
							if (res.data.data.error == 4) {
								uni.navigateTo({
									url: "/pagesD/retail/isretail"
								})
							} else {
								uni.navigateTo({
									url: "/pagesD/shareMoney/shareMoney"
								})
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
			// getCustomNav() {
			// 	let referer = uni.getStorageSync('platform').toLowerCase()
			// 	if (uni.getStorageSync('platform') == 'MP-WEIXIN') {
			// 		referer = 'wxapp'
			// 	}

			// 	uni.request({
			// 		url: this.websiteUrl + '/api/user/touch_nav',
			// 		method: 'POST',
			// 		data: {
			// 			device: referer
			// 		},
			// 		header: {
			// 			'Content-Type': 'application/json',
			// 			'token': uni.getStorageSync('token'),
			// 			'X-Client-Hash': uni.getStorageSync('client_hash')
			// 		},
			// 		success: (res) => {
			// 			
			// 			for (var i = 0; i < res.data.data[0].child_nav.length; i++) {
			// 				if (res.data.data[0].child_nav[i].name == '平台客服') {
			// 					this.urls = res.data.data[0].child_nav[i].url
			// 				
			// 				}
			// 			}
			// 		}
			// 	})
			// },

			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
			setlogoffNo: function() {
				var that = this
				that.show_logoff = false
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
				} else {
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '您提交了注销店铺申请！'
					// })
					// that.show_logoff = false

					uni.request({
						url: this.websiteUrl + '/api/user/users_cancel',
						method: 'POST',
						data: {
							applycancel_text: this.title
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							if (res.data.status == 'success') {
								uni.showToast({
									icon: 'none',
									title: res.data.data
								})
							}
						},
						complete() {
							that.show_logoff = false
						}
					})
				}
			},
			logoffno: function() {
				var that = this
				that.show_logoff = false
				that.linkHrefs(that.urls)
				// uni.navigateTo({
				// 	url:"/pages/commonly/kefu/kefu?shop_id=" + that.shop_id + '&shop_name=' + that.shop_name + '&token='+ that.tokens
				// })
			},
			// 全部工具 --展开/折叠
			changeMore() {
				this.showMore = !this.showMore
			},
			// 获取banner
			getBanner(e) {
				var that = this
				this.activeIndex = e.detail.current;
			},
			// 点击banner
			linkslide(item) {
				let url = item.ad_link
				// #ifndef MP-WEIXIN
				let page = item.appPage ? item.appPage : item.ad_link
				let built = item.appPage ? 'app' : 'undefined'
				if (url.indexOf('html') != -1) {
					this.articleId = url.match(/-(\d+)\./)[1]
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				} else {
					uni.setStorageSync("webtitle", item.ad_name);
					this.$outerHref(page, built)
				}
				// #endif

				// #ifdef MP-WEIXIN
				let page = item.appletPage ? item.appletPage : item.ad_link
				let built = item.appletPage ? 'app' : 'undefined'
				if (url.indexOf('html') != -1) {
					this.articleId = url.match(/-(\d+)\./)[1]
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
				} else {
					uni.setStorageSync("webtitle", item.ad_name);
					this.$outerHref(page, built)
				}
				// #endif

			},
			// 是否申请分销
			goisRetail() {
				uni.navigateTo({
					url: '/pagesD/retail/isretail'
				})
			},
			// 会员信息
			vipmessage() {
				var that = this
				uni.request({
					url: this.websiteUrl + '/api/user/affiliate_info',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						
						if (res.data.status == 'success') {
							for (var i = 0; i < res.data.data.user_rank_rights_list.length; i++) {
								for (var j = 0; j < res.data.data.user_rank_rights_list[i].rights_configure
									.length; j++) {
									if (res.data.data.user_rank_rights_list[i].rights_configure[j].name ==
										'user_discount') {
										that.affiliate_infovalue = res.data.data.user_rank_rights_list[i]
											.rights_configure[j].value
									}
								}
							}
						}
					}
				})
			},
			//猜你喜欢
			goodsGuessHandle(page) {
				var that = this

				// let page = this.guessList.length / this.size;

				// page = Math.ceil(page) + 1;

				// const { data: result } = await this.$store.dispatch('getGoodsGuessList', {
				// 	warehouse_id: 0,
				// 	area_id: 0,
				// 	page: page,
				// 	size: this.size
				// });
				
				// if (Array.isArray(result) && result.length > 0) {
				// 	this.guessList = [...this.guessList, ...result];
				// };

				// if (result.length < 10) this.loadMoreStatus = 'noMore';

				if (page) {
					that.page = page
					that.size = 10
				}

				const requestedPage = that.page
				uni.request({
					url: that.websiteUrl + '/api/catalog/goodslist',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						warehouse_id: 0,
						area_id: 0,
						page: requestedPage,
						size: that.size
					},
					success: (res) => {
						if (requestedPage == 1) {
							that.dscLoading = false
						}
						if (res.statusCode == 200) {
							if (res.data.data.length < 10) {
								that.loadMoreStatus = 'noMore'
							}
							if (requestedPage == 1) {
								that.guessList = res.data.data
							} else {
								that.guessList = that.guessList.concat(res.data.data)
							}
						}
					}
				})
			},
			userCouponList(page) {
				if (page) {
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setUserCoupon', {
					page: this.page,
					size: this.size,
					type: this.status
				})
			},
			couponLink(id) {
				uni.navigateTo({
					url: '/pagesD/goodslist/goodslist?cou_id=' + id
				})
			},
			async loadUserProfile() {
				const {
					data
				} = await this.$store.dispatch('userProfile', {
					type: true
				});
				this.userInfo = data ? data : ''
				// console.log('2data', this.userInfo)
				uni.setStorageSync("userInfo", this.userInfo);
				if (data != undefined) {
					uni.setStorageSync("newchatMsg", true);
					uni.setStorageSync("newLoginMsg", true);
				}

				//#ifdef APP-PLUS
				jpushModule.getRegistrationID(result => {
					// console.log('resultregisterID', result.registerID)
				})
				let alias = (data.uc_id).toString()
				// console.log('aliasid 绑定', alias);
				jpushModule.setAlias({
					'alias': alias
				})
				//#endif
			},

			merchantsChange() {
				this.$outerHref(this.$websiteUrl + 'user/merchants');
			},
			mydrplink(type) {
				if (this.userInfo.mobile === '') {
					uni.showModal({
						content: this.$t('lang.is_user_bind_mobile_phone'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/accountsafe/bindphone/bindphone?delta=1'
								});
							}
						}
					});
					return
				}

				if (type == 'info') {
					uni.navigateTo({
						url: "/pagesA/drp/drpinfo/drpinfo"
					})
				} else if (type == 'register') {
					uni.navigateTo({
						url: "/pagesA/drp/register/register"
					})
				} else if (type == 'affiliate') {
					uni.navigateTo({
						url: "/pagesB/affiliate/index/index"
					})
				} else if (type == 'account') {
					uni.navigateTo({
						url: "/pagesB/account/account"
					})
				}
			},
			// 我的分销
			mydrpCenter() {
				// 是否已申请
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
							if (res.data.data.error == 4) {
								this.mydrptype = true;
								// uni.redirectTo({
								// 	url: '/pagesD/retail/isretail'
								// })
							} else {
								this.mydrptype = false;
								// uni.navigateTo({
								// 	url: "/pagesA/drp/drpinfoCenter/drpinfoCenter"
								// })
							}
						}
					}
				})
			},

			touserranking: function() {
				// uni.setStorageSync("url", 'https://www.ok9288.com/article-3.html');
				// uni.setStorageSync("webtitle", '会员等级权益说明');
				// uni.navigateTo({
				// 	url: '/pagesB/webviews/webviews'
				// })
				this.$outerHref('/pagesC/article/detail/detail?id=3', 'app')
			},
			updateScrollPickOpen() {
				this.scrollPickOpen = false
			},
			// 分销管理-自定义设置数据
			async getCustomTextByCode() {
				//this.isLoading = true;
				const {
					data: {
						page_user_drp
					},
					status
				} = await this.$store.dispatch('getCustomText', {
					code: 'page_user_drp'
				});
				if (status == 'success') {
				
					this.pageUserDrp = page_user_drp || {};
				};
				//this.isLoading = false;
			},
			// 工具栏自定义
			getCustomNav() {
				// let referer = uni.getStorageSync('platform').toLowerCase()
				let referer;
				// if (uni.getStorageSync('platform') == 'MP-WEIXIN') {
				// 	referer = 'wxapp'
				// }
				//  else {
				// 	referer = 'app'
				// }
			
				uni.request({
					url: this.websiteUrl + '/api/user/touch_nav',
					method: 'POST',
					data: {
						device: this.device,
						app_version: this.version
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						
						this.customNav = res.data.data
					}
				})
			},
			linkHref(url) {
				
				if (!this.$isLogin()) {
					uni.showModal({
						content: "您需要登录会员!",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
					return
				}
				if(url == '/pagesD/shareMoney/shareMoney'){
					
					if (this.mydrptype ) {
						uni.navigateTo({
							url: "/pagesD/retail/isretail"
						})
						return 
					} else {
						uni.navigateTo({
							url: "/pagesD/shareMoney/shareMoney"
						})
					}
				}
				if(url == '/pages/member/member'){
					
					// if (this.mydrptype ) {
						uni.switchTab({
						  url: '/pages/member/member',  // 正确：直接从根目录开始的路径
						  fail: (err) => console.error(err)
						})
						
					return 
				}
				if (url == '/pagesC/useraccess/del') {
					this.show_logoff = true;
				}

				if (url == 'http://www.eqingqu.com' || url == 'https://www.eqingqu.com') {
					uni.setStorageSync("url", 'https://www.eqingqu.com');
					uni.setStorageSync("webtitle", '趣好卖加盟');
					uni.navigateTo({
						url: '/pagesB/webviews/webviews'
					});
				}

				if (url == '111111') {
					uni.navigateTo({
						url: '/pagesC/test/test'
						// url:'/pagesB/kefu_center/kefu_center?shop_name=庆趣供货（平台）&goods_id=0&token=yJ1xVg3GE2qNOK3W'
					})
				}
				if (url == '222222') {
					// uni.navigateTo({
					// 	url:'/pagesC/movingGoods/movingGoods'
					// })
					uni.navigateTo({
						url: '/pagesC/ceshi/ceshi'
					})
				}
				if (url.indexOf('http') != -1) {
					this.articleId = url.match(/-(\d+)\./)[1]
					
					this.$outerHref('/pagesC/article/detail/detail?id=' + this.articleId, 'app')
					// uni.setStorageSync("webtitle", '资讯内容');
					// this.$outerHref(url)
				}
				
				 else {
					if (url == '/pagesC/movingGoods/movingGoods') {
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
					} else {
						this.$outerHref(url, 'app')
					}
				}
			},
			//跳转到会员页面
			onMember() {
				if (!this.$isLogin()) {
					uni.showModal({
						content: "您需要登录会员!",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								})
							}
						}
					})
					return
				}
				uni.switchTab({
					url: '/pages/member/member'
				});
				// 延迟触发，确保页面切换完成后再更新 tabbar 选中状态
				setTimeout(() => {
					uni.$emit('switch-tab');
				}, 100);
			},
			//会员码
			onUserQrcode() {
				this.userQrcodeShow = true
				this.creatQrCode();
			},
			closeUserQrcode() {
				this.userQrcodeShow = false
			},
			//二维码生成
			async creatQrCode() {
				let mobile = this.userInfo.mobile;
				await uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: mobile,
					size: 150,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H
				})
			},
			bindphoneHref() {
				uni.navigateTo({
					url: "/pagesB/accountsafe/bindphone/bindphone?delta=1&step=1"
				})
				this.userQrcodeShow = false
			},
			onClearCache() {
				let self = this;
				uni.showModal({
					content: this.$t('lang.is_clear_cache'),
					success: res => {
						if (res.confirm) {
							uni.clearStorageSync();
							let platform = '';
							//#ifdef APP-PLUS
							platform = 'APP';
							plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
								uni.setStorageSync('wgtinfo', JSON.stringify(wgtinfo))
							})
							//#endif
							//#ifdef H5
							platform = 'H5';
							//#endif
							//#ifdef MP-WEIXIN
							platform = 'MP-WEIXIN';
							//#endif
							uni.setStorageSync('platform', platform);
						
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

			fileterScrollTop(e) {
				//视图会发生重新渲染
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			jpushModule.getRegistrationID(result => {
			// console.log(result)
			// 	console.log(result.registerID)
			})
			// #endif

			// #ifdef MP-WEIXIN
			const {
				top,
				height
			} = uni.getMenuButtonBoundingClientRect();
			this.statusHeight = top + height;
			// #endif
 			// #ifdef APP-PLUS
			const systemInfo = uni.getSystemInfoSync();
			    // 判断设备平台
			    this.isAndroid = systemInfo.platform === 'android'
			    this.isIos = systemInfo.platform === 'ios'
			// #endif
			// #ifdef H5
			const uniAppVersion = systemInfo.appVersion;
			// #endif
			// #ifndef H5
			const uniAppVersion = systemInfo.appWgtVersion;
			// #endif
			
			this.version = incrementVersion();
			// touch_nav 按平台传 device
			// #ifdef MP-WEIXIN
			this.device = 'wxapp';
			// #endif
			// #ifdef H5
			this.device = 'h5';
			// #endif
			// #ifdef APP-PLUS
			this.device = 'app';
			// #endif
			// that.getBanner()
			this.mydrpCenter();
		},
		onShow() {
		  // 通知 tabbar 更新状态
		    uni.$emit('switch-tab');
			// 未登录：直接跳转登录页，不展示本页
			const token = uni.getStorageSync('token');
			if (!token || token === '' || token === undefined) {
				uni.navigateTo({ url: '/pagesB/login/login?delta=1' });
				return;
			}
			var that = this

			// ---- 换账号检测：清空内存缓存，避免展示上一个用户的数据 ----
			const curSuffix = this._getUserCacheSuffix();
			if (this._userCacheSuffix !== null && this._userCacheSuffix !== curSuffix) {
				this.userInfo   = '';
				this.customNav  = [];
				this.guessList  = [];
				this.page       = 1;
			}
			this._userCacheSuffix = curSuffix;

			// ---- 缓存优先：内存无数据时先从磁盘恢复，让用户立即看到上次内容 ----
			const hasMemoryData = !!(this.userInfo && (this.customNav.length > 0 || this.guessList.length > 0));
			if (!hasMemoryData) {
				this._restoreFromCache();
			}

			// directionalPush 控制
			if (uni.getStorageSync('directionalPush')) {
				this.directionalPush = uni.getStorageSync('directionalPush');
				that.showLoadMore = false;
			} else {
				that.showLoadMore = true;
			}

			// ---- 静默刷新：有缓存时后台静默更新，无缓存时前台拉取 ----
			const hasCacheData = !!(this.userInfo && (this.customNav.length > 0 || this.guessList.length > 0));
			if (hasCacheData) {
				// 有缓存：静默刷新，用户无感知
				this._silentRefresh();
			} else {
				// 无缓存：前台拉取，确保页面有内容
				this._fetchAndUpdateAll();
			}

			// 以下不影响缓存的请求，每次正常执行
			that.vipmessage();
			uni.request({
				url: that.websiteUrl + '/api/set/isComment',
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token')
				},
				success: (res) => {
					let data = res.data;
					if (data.status == "success") {
						if (data.data == 1) {
							that.isComment = true;
						}
					}
				}
			});
			uni.request({
				url: this.websiteUrl + '/api/app/ad_position?type=my_like_banner',
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash': uni.getStorageSync('client_hash')
				},
				success: (res) => {
					this.slideList = res.data.data.list;
				},
				fail: (err) => {
					console.error(err);
				}
			});
		},
		onReachBottom() {
			var that = this
			that.loadMoreStatus = 'loading';
			if (that.page * that.size == that.guessList.length) {
				that.page++
				that.goodsGuessHandle()
			} else {
				that.loadMoreStatus = "noMore"
			}
		},
		onPageScroll(e) {
			var that = this
			that.scrollState = e.scrollTop > 800 ? true : false

			let to_scroll_top = e.scrollTop + 20

			uni.createSelectorQuery().select('.goods-detail-guess').boundingClientRect((res) => {
				let a = uni.getSystemInfoSync()
				let t_height = res.height - a.screenHeight

				if (t_height <= to_scroll_top) {
					that.loadMoreStatus = 'loading';
					if (that.page * that.size == that.guessList.length) {
						
						uni.getPushClientId({
						  success: function (res) {
						   
						  }
						});
						that.page++
						that.goodsGuessHandle()
					}
				}
			}).exec()
		},
	}
</script>

<style>
	/* 防止键盘弹起时页面移动（和 shopHome 一样的方案） */
	page {
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		position: relative;
		/* #endif */
	}
	
	.user-default {
		/* padding-bottom: 100upx; */
		height: 100%;
		position: relative;
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		/* #endif */
	}

	.user-header {
		position: relative;
		/* background: linear-gradient(-88deg, rgba(255, 76, 48, 1), rgba(234, 10, 33, 1)); */
		/* #ifdef MP-WEIXIN */
		/* padding-bottom: 80rpx;
		height: auto!important; */
		/* #endif */

		/* #ifdef APP-PLUS */
		/* height: 430upx; */
		padding-top: 40px;
		/* #endif */
		/* #ifdef H5 */
		/* height: 430upx; */
		/* #endif */
	}

	.user-header.no-login {
		/* #ifndef MP-WEIXIN */
		/* height: 430upx; */
		/* #endif */
		/* #ifdef MP-WEIXIN */
		/* height: 580rpx; */
		/* #endif */
	}

	/*分销会员样式*/
	.user-header.mp-header {
		/* #ifndef MP-WEIXIN */
		/* height: 430upx; */
		/* #endif */
		/* #ifdef MP-WEIXIN */
		/* height: 580rpx; */
		/* #endif */
		/* background: linear-gradient(-88deg, rgba(29, 6, 2, 1), rgba(59, 36, 10, 1)); */
	}

	.user-header.mp-header .growth .header-rank {
		color: #E9D1B2;
		font-size: 24upx;
		background: linear-gradient(90deg, rgba(235, 213, 183, 0.1), rgba(203, 170, 131, 0.1));
	}

	.user-default .user-header.mp-header .itemize {
		margin-top: 35upx;
	}

	.user-default .user-header.mp-header .user-header-box .header-admin-box .name {
		/* color: #E9D1B4; */
	}

	.user-default .user-header.mp-header .user-header-box .growth .header-rank {
		color: #E9D2B4;
		background: linear-gradient(90deg, rgba(235, 213, 183, 0.2), rgba(203, 170, 131, 0.2));
	}

	.user-header.mp-header .itemize .itemize_collection .text {
		color: rgba(247, 247, 247, .6);
	}

	.user-header.mp-header .exclusive_on .exclusive {
		background: linear-gradient(90deg, rgba(252, 230, 202, 1), rgba(241, 215, 181, 1));
	}

	.mp-header.user-function-ward {
		/* padding-top: 69.5upx; */
	}

	/* #ifdef APP-PLUS */
	.user-default .user-header {
		position: relative;
		/* height: 460upx; */
	}

	.user-default .user-header.mp-header {
		/* height: 430upx; */
	}

	/* #endif */

	.user-default .user-header-box {
		display: flex;
		flex-direction: row;
		position: relative;
		z-index: 1;
		align-items: center;
		padding: 40upx 32rpx 36rpx;
		/* padding: 90upx 30upx 0 30upx; */
	}

	.user-default .user-header-box .head-img {
		width: 130upx;
		height: 130upx;
		margin-right: 44upx;
		border-radius: 50%;
		border: 2rpx solid #FE2F02;
	}

	.user-default .user-header-box .head-imgno {
		border: 2rpx solid #FFFFFF;
	}

	.age {
		position: absolute;
		left: 2%;
		bottom: -10%;
		width: 130upx;
		align-items: center;
		color: #fff;
		background-image: url(https://images.eqingqu.com/attachs/photo/202512/20251201_58C82ECD443B43BA73CCEBC86A87A5B4.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		height: 36rpx;
	}

	.user-default .user-header-box .head-img .img {
		border-radius: 50%;
	}

	.user-default .user-header-box .head-admin {
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		/* padding-top: 10rpx; */

	}

	.user-default .user-header-box .header-admin-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* color: #FFFFFF; */
		font-size: 30upx;
		position: relative;
	}

	.user-default .user-header-box .header-admin-box .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.user-default .user-header-box .header-admin-box .name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 36upx;
		font-weight: 500;
		/* color: rgba(255, 255, 255, 1); */
		/* margin-right: 15upx; */
		line-height: 1.6;
	}

	.user-default .user-header-box .growth .header-rank {
		/* background: rgba(0, 0, 0, 0.1); */
		/* color: #E9D1B2; */
		/* color: #FFF; */
		font-size: 24upx;
		padding: 0 24upx;
		border-radius: 30upx;
		display: inline-block;
		height: 50upx;
		line-height: 50upx;
		margin-right: 5upx;
	}

	.user-default .header-icon {
		display: flex;
		flex-direction: row;
		position: absolute;
		top: 20upx;
		right: 0;
		z-index: 99;
	}

	.user-default .header-icon .iconfont {
		font-size: 42rpx;
		/* color: #FFFFFF; */
		margin-right: 30upx;
		margin-top: 26rpx;
	}

	.user-default .header-icon .goods-img .iconfont {
		margin-right: 30upx;
	}

	.user-default .user-header-box .growth .top {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.user-default .user-header-box .growth .top view {
		/* margin-bottom: 10upx; */
	}

	.user-default .user-header-box .growth .top view:last-child {
		/* margin-bottom: 0; */
	}

	.user-default .user-header-box .growth .top .text {
		/* color: #FFFFFF; */
		margin-right: 20upx;
		font-size: 24upx;
	}

	/* .user-default .user-header-box .growth .bot {
		margin-top: 15upx;
		width: 80%;
	} */

	/* .exclusive_on {
		width: 100%;
	}

	.exclusive {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 14rpx 20rpx;
		font-size: 28upx;
		border-radius: 20rpx 20rpx 0 0;
		margin: 0 30upx;
		z-index: 990;
		background: linear-gradient(to right, #FFCF88 40%, #FCE6BB 80%, #FCE6BB 50%);
		box-shadow: 0px 5upx 20upx 0px rgba(108, 108, 108, 0.1);
	}

	.exclusive .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.exclusive .left .icon_vip,
	.exclusive .left .icon_vip image {
		height: 56upx;
	}

	.exclusive .left text {
		margin-left: 10upx;
		font-weight: 500;
	}

	.exclusive .center {
		flex: 1;
		position: relative;
		padding: 0 0 0 20upx;
		color: #805223;
		font-size: 26upx;
		line-height: 40upx;
		height: 40upx;
	}

	.exclusive .right {
		background: linear-gradient(to right, #EA0C21 40%, #FF4B30 80%, #FF4B30 50%);
		border-radius: 30upx;
		padding: 4rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 33;
	}

	.exclusive .right text {
		color: #ffffff;
		font-size: 26upx;
	}

	.exclusive .right .uni-icon {
		display: block;
	} */

	.exclusive_on {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		margin-bottom: 20rpx;
		/* margin: 40rpx 0 20rpx; */
		/* margin-top: 40rpx; */
		/* position: absolute;
			left: 0upx;
			right: 0upx;
			bottom: -45upx;
			z-index: 990; */
	}

	.exclusive {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* padding: 16rpx 20upx; */
		/* height: 88rpx; */
		padding: 0rpx 20upx;
		height: 88rpx;
		max-height: 88rpx;
		font-size: 28upx;
		border-radius: 12upx;
		margin: 0 20upx;
		z-index: 990;
		background: linear-gradient(270deg, #F2DAB8 0%, #FBE5C8 100%);
		box-shadow: 0px 5upx 20upx 0px rgba(108, 108, 108, 0.1);
	}

	.exclusive .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.exclusive .left .icon_vip,
	.exclusive .left .icon_vip image {
		width: 48upx;
		height: 48upx;
	}

	.exclusive .left text {
		margin-left: 10upx;
		font-weight: 500;
	}

	.exclusive .center {
		flex: 1;
		position: relative;
		padding: 0 0 0 10upx;
		/* margin-left: 20upx; */
		color: #272727;
		font-size: 28upx;
		line-height: 40upx;
		/* height: 40upx; */
	}

	/* 	.exclusive .center::after {
			content: " ";
			position: absolute;
			z-index: 2;
			background-color: #885E2B;
			width: 2upx;
			height: 20upx;
			left: 0;
			top: 50%;
			margin-top: -10upx;
		} */

	.exclusive .right {
		background: #000000;
		height: 55rpx;
		border-radius: 30upx;
		padding: 0 15rpx 0 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 33;
	}

	.exclusive .right text {
		color: #E3C49E;
		font-size: 24upx;
	}

	.exclusive .right .uni-icon {
		display: block;
	}

	.user-function-ward {
		padding: 0upx 20upx 0;
	}

	.user-function-list {
		background: #FFFFFF;
		margin-bottom: 20upx;
		border-radius: 15upx;
	}

	.user-function-list .user-item-title {
		padding: 20rpx 24rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.user-function-list .user-item-title .tit {
		font-size: 32upx;
		font-weight: 500;
		color: #272727;
		line-height: 1.4;
	}

	.user-function-list .user-item-title .more {
		font-size: 26upx;
		color: #828282;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		line-height: normal;
	}

	.user-function-list .user-item-title .more .uni-icon {
		display: block;
		color: #888888;
	}

	.user-function-list .user-items {
		display: flex;
		flex-direction: row;
	}

	.user-function-list .user-items .user-item {
		/* overflow: hidden; */
		flex: 1 1 0%;
		padding: 10rpx 6rpx 20rpx;
		text-align: center;
	}

	.user-function-list .user-items .user-item .tit {
		font-size: 32upx;
		color: #AC8054;
		position: relative;
	}

	.user-function-list .user-items .user-item .tit image {
		width: 60upx;
		height: 60upx;
	}

	.user-function-list .user-items .user-item .text {
		font-size: 25upx;
		color: #333333;
	}

	.user-function-list .user-account-items .user-item .tit {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.user-function-list .user-items .user-item .num {
		position: absolute;
		font-size: 20upx;
		min-width: 22upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 30upx;
		/* background: #f92028; */
		background: #fff;
		color: #f92028;
		border: 1px solid #f92028;
		text-align: center;
		top: -13upx;
		right: 8%;
		padding: 0 5upx;
	}

	.user-function-list .user-nav-items {
		flex-wrap: wrap;
		width: 100%;
		overflow: hidden;
		transition: height 1s ease;
		height: 270rpx;
		max-height: 270rpx;
		line-height: 1.5;
	}

	.user-function-list .user-nav-items-more {
		height: 420rpx;
		max-height: 420rpx;
		transition: height 1s ease;
		line-height: 1.5;
	}

	.user-function-list .user-nav-items .user-item {
		width: 20%;
		flex: none;
		padding: 30upx 0 0upx;
	}

	.user-function-list1 {
		display: flex;
		background: rgba(255, 255, 255, 1);
		border-radius: 15upx;
		padding-bottom: 20rpx;
	}

	.user-function-list1 .wallets {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.user-function-list1 .wallet {
		flex: 1;
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}


	.user-function-list1 .wallet:after {
		content: ' ';
		position: absolute;
		width: 1upx;
		height: 50%;
		background: rgba(192, 192, 192, 0.45);
		right: 0;
		top: 30%;
	}

	.user-function-list1 .items {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.user-function-list1 .item {
		flex: 1;
		width: 33.33%;
		padding: 35upx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.user-function-list1 .item:after {
		content: ' ';
		position: absolute;
		width: 1upx;
		height: 70%;
		background: rgba(255, 255, 255, .4);
		right: 0;
		top: 15%;
	}


	.user-function-list1 .item .span {
		color: rgba(175, 116, 58, 1);
		font-weight: 400;
		font-size: 24upx;
	}

	.user-function-list1 .item .txt {
		color: rgba(175, 116, 58, 1);
		width: 140upx;
		text-align: center;
		font-size: 33upx;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.growth {
		/* margin-top: 5upx; */
		position: relative;
	}

	.growth_vip {
		width: 146upx;
		height: 44upx;
		line-height: 44upx;
		background: rgba(0, 0, 0, 0.1);
		text-align: center;
		border-radius: 19upx;
		font-size: 26upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.growth_vip_v {
		color: rgba(233, 209, 179, 1);
		background: linear-gradient(90deg, rgba(235, 212, 182, 0.4), rgba(203, 169, 130, 0.4));
	}

	.itemize {
		display: flex;
		align-items: center; //子元素垂直居中
		justify-content: space-around;
		margin-top: 40upx;
	}

	.itemize .itemize_collection {
		width: 33.3333333%;
		position: relative;
	}

	.itemize .itemize_collection .icon {
		text-align: center;
		color: #fff;
	}

	.itemize .itemize_collection .icon .iconfont {
		font-size: 18px;
	}

	.itemize .itemize_collection .num,
	.itemize .itemize_collection .text {
		text-align: center;
		font-size: 24upx;
		color: rgba(247, 247, 247, 1);
	}

	.itemize .itemize_collection .num {
		font-size: 32upx;
		font-weight: 500;
	}

	.itemize .itemize_collection:after {
		content: ' ';
		position: absolute;
		width: 1upx;
		height: 70%;
		background: rgba(255, 255, 255, .4);
		right: 0;
		top: 15%;
	}

	.user-header.mp-header .itemize .itemize_collection:after {
		content: ' ';
		position: absolute;
		width: 1upx;
		height: 70%;
		background: rgba(255, 255, 255, .2);
		right: 0;
		top: 15%;
	}

	.itemize .itemize_collection:last-child:after {
		width: 0;
	}

	.broadcasting {
		width: 21%;
		position: relative;
		padding: 35upx 0;
		margin-left: 2upx;
		/* 	box-shadow: 0px 5px 10px 0px rgba(24, 24, 25, 0.1); */
	}

	.broadcasting .icon {
		text-align: center;
		color: #AF743A;
		height: 55upx;
		line-height: 55upx;
		margin-bottom: 5upx;
	}

	.broadcasting .icon .iconfont {
		color: #AF743A;
	}

	.broadcasting .red .iconfont {
		background-image: linear-gradient(-30deg, rgba(239, 0, 34, 1), rgba(251, 87, 32, 1));
		-webkit-background-clip: text;
		color: transparent;
	}

	.broadcasting .textit {
		font-size: 24upx;
		margin-top: 14upx;
		text-align: center;
		color: rgba(0, 0, 0, 1);
	}

	.user-item_on {
		padding: 19upx;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	.my_coupons {
		display: flex;
		flex-shrink: 0;
		margin-right: 20upx;
		margin-top: 10upx;
		border-radius: 10upx;
		position: relative;
		overflow: hidden;
	}

	.my {
		display: flex;
		width: 320upx;
		height: 155upx;
		border: 1px solid rgba(242, 210, 210, 1);
		border-radius: 10upx;
		background: rgba(251, 242, 242, 1);
	}

	.my_coupons .my_coupons_left {
		width: 258upx;
		padding-left: 22upx;
	}

	.my_coupons .my_coupons_left .price {
		font-size: 49upx;
		line-height: 1.5;
		font-weight: 600;
		color: rgba(245, 4, 11, 1);
	}

	.my_coupons .my_coupons_left .price text {
		font-size: 29upx;
	}

	.my_coupons .my_coupons_left .reduction {
		line-height: 1.4;
	}

	.my_coupons .my_coupons_left .reduction text {
		padding: 3upx 15upx;
		text-align: center;
		font-size: 20upx;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(123deg, rgba(245, 4, 11, 1), rgba(246, 71, 53, 1));
		border-radius: 5upx;
	}

	.my_coupons .my_coupons_left .platform {
		font-size: 22upx;
		font-weight: 400;
		color: rgba(136, 136, 136, 1);
		margin: 5upx 0;
	}

	.my_coupons_right {
		width: 62upx;
		display: flex;
		text-align: center;
		font-size: 24upx;
		padding-right: 15upx;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(123deg, rgba(245, 4, 12, 1), rgba(246, 72, 54, 1));
		-webkit-display: flex;
		flex-direction: column;
		writing-mode: vertical-rl;
		border-radius: 10upx;
		/*从左向右 从右向左是 writing-mode: vertical-rl;*/



	}

	.mp-color {
		color: rgba(232, 209, 179, 0.2) !important;
	}

	.my_coupons:before {
		content: '';
		position: absolute;
		z-index: 0;
		left: 73%;
		top: -15upx;
		width: 30upx;
		height: 30upx;
		border-radius: 100%;
		background: #fff;
		border: 1px solid rgba(242, 210, 210, 1);
		/* margin-top: -10px; */
	}

	.my_coupons:after {
		content: '';
		position: absolute;
		z-index: 0;
		left: 73%;
		bottom: -15upx;
		width: 30upx;
		height: 30upx;
		border-radius: 100%;
		background: #fff;
		border: 1px solid rgba(242, 210, 210, 1);
		/* margin-top: -10px; */
	}

	.items {
		position: relative;
	}

	.items:after {
		position: absolute;
		z-index: 1;
		top: 0;
		right: -16upx;
		width: 30upx;
		height: 100%;
		background: url(https://images.eqingqu.com/attachs/photo/202404/20240416_525C03C6024B6D9197E47526F82497BB.png);
		background-size: 100% 100%;
		content: "";
	}

	.goods-img {
		/* width: 80upx;
		height: 80upx;
		border-radius: 10upx; */
		position: relative;
		/* border: 1px solid #666666; */
	}

	.goods-img text {
		background: #fff;
		height: 10upx;
		width: 10upx;
		position: absolute;
		right: 20upx;
		top: 6upx;
		z-index: 99;
		border-radius: 50%;
	}

	.mp-header .goods-img text {
		background: red;
	}

	/*会员码*/
	.user_qrcode {
		position: absolute;
		background: rgba(0, 0, 0, 0.1);
		color: #FFF;
		font-size: 25upx;
		height: 50upx;
		line-height: 50upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 30upx 0 0 30upx;
		right: -30upx;
		top: 0;
		padding: 0 20upx;
	}

	.user_qrcode .iconfont {
		font-size: 16px;
		height: 16px;
		line-height: 20px;
	}

	.user-header.mp-header .user_qrcode {
		background: linear-gradient(90deg, rgba(235, 212, 181, 0.2), rgba(203, 169, 128, 0.2));
	}

	.user-header.mp-header .user_qrcode,
	.user-header.mp-header .user_qrcode .iconfont {
		color: #E9D2B4;
	}

	.user-qrcode-popup .uni-popup-middle {
		width: 80%;
		overflow: visible;
		background: transparent;
		padding: 0;
	}

	.user-qrcode-popup .uni-popup-middle .content {
		min-height: auto;
		width: 100%;
		box-sizing: border-box;
	}

	.user-qrcode-popup .header {
		background-size: cover;
		background-repeat: no-repeat;
		position: relative;
		border-radius: 40upx 40upx 0 0;
		width: 100%;
	}

	.user-qrcode-popup .header-warp {
		text-align: center;
		padding: 50upx 0 20upx;
	}

	.user-qrcode-popup .header-warp .logo {
		width: 100upx;
		height: 100upx;
		position: absolute;
		top: -50upx;
		left: calc(50% - 50upx);
		border: 3px solid #ec5857;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-qrcode-popup .header-warp .logo {
		border-radius: 50%;
	}

	.user-qrcode-popup .header-warp .name {
		color: #fff;
		font-size: 26upx;
	}

	.user-qrcode-popup .header-warp .rank {
		padding: 0 20upx;
		background: rgba(0, 0, 0, 0.1);
		color: #fff;
		border-radius: 40upx;
		display: inline-block;
		height: 40upx;
		line-height: 40upx;
		font-size: 25upx;
		margin-top: 10upx;
	}

	.user-qrcode-popup .close {
		position: absolute;
		right: 20upx;
		top: 20upx;
		color: #fff;
		font-size: 25upx;
	}

	.user-qrcode-popup .content {
		background: #fff;
		padding: 40upx 40upx 60upx;
		font-size: 25upx;
		border-radius: 0 0 40upx 40upx;
	}

	.user-qrcode-popup .content .ms {
		text-align: center;
	}

	.user-qrcode-popup .content .total {
		display: flex;
		flex-direction: row;
		margin-top: 40upx;
	}

	.user-qrcode-popup .content .total .total-item {
		width: 33.3%;
		text-align: center;
		position: relative;
	}

	.user-qrcode-popup .content .total .total-item .number {
		margin-top: 20upx;
	}

	.user-qrcode-popup .content .total .total-item:after {
		position: absolute;
		content: "";
		width: 1px;
		background: #ecebeb;
		right: 0;
		top: 5upx;
		bottom: 5upx;
	}

	.user-qrcode-popup .content .total .total-item:last-child:after {
		height: 0;
	}

	.user-qrcode-popup .content .qrcode {
		display: flex;
		justify-content: center;
		margin: 50upx 0;
	}

	.user-qrcode-popup .not-mobile {
		height: 200px;
		text-align: center;
		line-height: 50px;
	}

	.user-qrcode-popup .not-mobile .p {
		font-size: 28upx;
		padding-top: 50px;
	}

	.user-qrcode-popup .not-mobile .button {
		background: #eb5354;
		color: #fff;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		border-radius: 40upx;
		padding: 0 50upx;
		font-size: 28upx;
		display: inline-block;
	}

	/*新版轮播样式*/
	.slide-new {
		padding: 0 20upx;
		position: relative;
		overflow: hidden;
	}

	.slide-new .page-section-spacing {
		position: relative;
		z-index: 2;
		border-radius: 20upx;
		overflow: hidden;
	}

	.dots-container {
		/* // position: absolute;
		// right: 20upx;
		// bottom: 20upx; */
		margin-top: 0;
		float: right;
		display: flex;
		justify-content: center;
	}

	.dot {
		margin: 0 6upx;
		width: 12upx;
		height: 12upx;
		background: rgba(0, 0, 0, 0.2);
		opacity: 1;
		border-radius: 6upx;
	}

	.dot.active {
		background: rgba(0, 0, 0, .5);
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
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		position: fixed !important;
		/* #endif */
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

	.add_box3_a_sx {
		width: 48%;
		height: 78rpx;
		text-align: center;
		line-height: 78rpx;
		;
		color: #ffffff;
		background-color: #e64340;
		border-radius: 10rpx;
		font-size: 34rpx;
	}

	.add_box3_1_a_sx {
		width: 48%;
		height: 78rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		text-align: center;
		line-height: 78rpx;
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
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		position: fixed !important;
		/* #endif */
	}
</style>