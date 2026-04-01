<template>
	<view>
		<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<!-- 这里是状态栏 -->
			<view class="status_bar" style="height: 40px;"></view>
			<!-- #endif -->
			<view class="chat_1" :style="{ height: gaodu + 'px' }">
				<view @click="navigateBack" style="width: 10%;">
					<uni-icons type="arrowleft" size="22" color="#000000"></uni-icons>
				</view>
				<view class="search_1_1">{{shop_name}}</view>
				<view class="search_submit" style="width: 10%;" @click="tommoving">
					<view>
						<image
							src="https://images.eqingqu.com/attachs/photo/202308/20230823_4B4363E4D16777FC2830D3442DCAE862.png"
							style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view style="height: 160rpx;"></view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view style="height: 140rpx;"></view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view style="height: 180rpx;"></view>
		<!-- #endif -->
		<view class="tank">
			<scroll-view class="tank-con" scroll-y="true" :style="{height:style.contentViewHeight+'px'}"
				:scroll-top="scrollTop" @click="hideInputAndEmoji">
				<view class="notice_1" v-if="notice">
					<uni-notice-bar :speed='60' show-icon scrollable :text="notice" />
				</view>
				<!-- <view style="height: 80rpx;" v-if="notice"></view> -->
				<view class="onMore" @click="getMorelist">查看更多历史记录</view>
				<view style="height:80rpx" v-if="isTop==true"></view>

				<view class="kefu_center_1" v-if="synArr.length > 0">
					<view class="kefu_center_2">
						<view style="font-weight: bold;font-size: 30rpx;">常见问题</view>
					</view>
					<view class="kefu_center_5"></view>
					<view v-for="(item,index) in synArr" :key="index">
						<view class="kefu_center_2" v-if="index < 5" style="margin: 18rpx 0;" @click="tofasong(item)">
							<view class="kefu_center_4"><text
									style="margin-right: 10rpx;color:#F45901;">{{index+1}}.</text>{{item.title}}</view>
							<image
								src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png"
								style="height: 30rpx;width: 20rpx;"></image>
						</view>
					</view>
					<view style="color: #999999;text-align: center;" v-if="synArr.length > 5" @click="toShowMore">查看更多
					</view>
				</view>
				<view class="user-consult" v-if="list.length > 0">
					<view class="user-item"
						:class="{'user-item-admin':item.user_type == 1 || item.user_type == 'service'}"
						v-for="(item,index) in list" :key="index">
						<block v-if="item.goods_id ">
							<view class="goods_link">
								<view class="goods_link_left">
									<image :src="kefuLoginData.goods.goods_thumb?kefuLoginData.goods.goods_thumb:'' "
										mode=""></image>
								</view>
								<view class="goods_link_right">
									<view class="goods_link_right_name twolist-hidden">
										{{kefuLoginData.goods.goods_name}}
									</view>
									<view class="goods_link_right_footer">
										<currency-price :price="kefuLoginData.goods.shop_price"
											:size="18"></currency-price>
										<view class="send_link" @click="sub_send(item.goods_id)">发送链接</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else-if="item.msg_type==1">
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
							<view class="left">
								<view class="name"
									style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<view class="cons-cont">
									<view class="text">
										<view v-for="(item_one,index_one) in item.message" :key="index_one"
											@click="tofasong(item_one)">
											<view class="kefu_center_2">
												<view class="kefu_center_4_1"><text
														style="margin-right: 10rpx;color:#F45901;">{{index_one+1}}1</text>{{item_one.title}}
												</view>
												<image
													src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png"
													style="height: 30rpx;width: 20rpx;"></image>
											</view>
											<view v-if="index_one < item.message.length -1" style="height: 20rpx;">
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>

						<block v-else-if="item.order_type==111">
							<view class="left">
								<view class="name">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<view class="cons-cont">
									<view class="text">
										<view style="max-width: 530rpx;">
											<view class="kefu_center_4_1_2">订　单　号：{{item.message.order_sn}}</view>
											<view class="kefu_center_4_1_2">下 单 时 间：{{item.message.add_time}}</view>
											<view class="kefu_center_4_1_2">收　货　人：{{item.message.consignee}}</view>
											<view class="kefu_center_4_1_2">订 单 状 态：{{item.message.order_status}}</view>
											<view class="kefu_center_4_1_2">订 单 金
												额：{{item.message.total_amount_formated}}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
						</block>
						<!-- 服务评价 -->
						<block v-else-if="item.msg_type===2">
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
							<view class="left">
								<view class="name"
									style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<!-- 评价jia -->
								<view class="ratecon mt10">
									<view class="" style="margin: 32rpx 0; ">
										<view class="title">
											服务评价
										</view>
										<!-- <view class="rateview" v-if="item.is_has_score==1">
											<uni-rate :value="item.score" size="28" class="ratecss" :disabled="true"
												disabledColor="#ffca3e" margin="10" />
										</view> -->
										<!-- <view class="" v-else> -->
										<view class="">
											<view class="rateview	ratecss" @click="isOvertime(item)"
												v-if="item.is_has_score==1 || item.is_has_overtime==1||item.isRate==true">
												<uni-rate :value="item.score?item.score :rateValue2" size="28"
													:readonly="true" :disabled="true" disabledColor="#ffca3e" margin="10" />
											</view>

											<view class="" v-else>
												<view class="rateview">
													<uni-rate v-model="rateValue" @change="changeRate" size="28"
														class="ratecss" margin="10" :touchable="false" />
												</view>
												<view class="scorecss" v-if="item.is_has_score!==1">
													<view class="" v-if="!start_num">
														请评价
													</view>
													<view class="" v-else>
														{{valuebb}}
													</view>
												</view>
												<view class="queslist" v-if="item.is_has_score!==1">
													<view class="quescss" v-for="(item,index) in quesList" :key="index"
														:class="{ 'active': inques.includes(item) }"
														@click="onQues(item,index)">
														{{item}}
													</view>
												</view>
												<view class="rateview" v-if="item.is_has_score!==1">
													<view class="subbtn" @click="onSubmit(item)">
														提交评价
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<!-- 收货地址 -->
						<block v-else-if="item.msg_type==3">
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
							<view class="left">
								<view class="name"
									style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<view class="addInfo mt10 bgc_fff">
									<view style="margin: 20rpx;">
										<view class="title">请确认收货地址</view>
										<view style="margin: 30rpx 0;">
											<view style="display: flex; justify-content: space-between;">
												<view>
													<image :src="item.message.goods_thumb" mode="widthFix"
														style="width: 96rpx; height: 80rpx; border-radius: 12rpx;">
													</image>
												</view>
												<view style="display: flex; height: 116rpx; flex-direction: column;">
													<view
														style="min-height: 40rpx; height: 40rpx; line-height: 40rpx; display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1; overflow: hidden;line-height: 1.5;      max-height: calc(1.5em * 3); padding-left: 20rpx;">
														{{item.message.goods_name || ''}}
													</view>
													<view
														style="display: flex; flex-direction: column; padding-left: 10rpx;">
														<view style="font-size: 28rpx; color: #272727;"
															v-if="item.message.goods_price">
															<span
																style="font-size: 24rpx;">¥</span>{{item.message.goods_price}}
														</view>
														<view style="font-size: 24rpx; color: #999; text-align: right;"
															v-if="item.message.count">
															共{{item.message.count}}件
														</view>
													</view>
												</view>
											</view>
											<view style="display: flex; align-items: center; margin-top: 20rpx;"
												v-if="item.message.consignee">
												<view
													style="font-size: 28rpx; color: #272727; width: 32%; max-width: 32%;">
													收货人</view>
												<view
													style="display: flex; align-items: center; flex: 1; color: #999; font-size: 26rpx;">
													{{item.message.consignee}}
												</view>
											</view>
											<view style="display: flex; align-items: center; margin-top: 20rpx;"
												v-if="item.message.mobile">
												<view
													style="font-size: 28rpx; color: #272727; width: 32%; max-width: 32%;">
													手机号码</view>
												<view
													style="display: flex; align-items: center; flex: 1; color: #999; font-size: 26rpx;">
													{{item.message.mobile}}
												</view>
											</view>
											<view style="display: flex; align-items: center; margin-top: 20rpx;"
												v-if="item.message.address">
												<view
													style="font-size: 28rpx; color: #272727; width: 32%; max-width: 32%;">
													详细地址</view>
												<view
													style="display: flex; align-items: center; flex: 1; color: #999; font-size: 26rpx;">
													{{item.message.address}}
												</view>
											</view>
										</view>
										<view style="display: flex; justify-content: flex-end; margin-top: 20rpx;">
											<view class="addrbtn" @click="clickaddryes(item.message.order_id, item.id)"
												v-if="item.user_is_has_confirm == 0">
												确认
											</view>
											<view class="addrbtn-dis" v-if="item.user_is_has_confirm == 1">
												已确认
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<!-- 视频消息 -->

						<!-- 修改视频消息渲染块 -->
						<!-- <block v-else-if="isVideoMessage(item)">
	<view class="right">
		<image :src="item.avatar" class="img"></image>
	</view>
	<view class="left pore">
		<view class="name"
			style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
			<text class="txt">{{item.name}}</text>
			<text class="time">{{item.time}}</text>
		</view>
		  <view class="video-message-container">
			<view class="video-thumb" @click="handleVideoPlay(parseVideoData(item))">
			  <image :src="getVideoThumb(item)" mode="aspectFill" />
			  <image src="/static/play_icon.png" class="play-overlay" />
			</view>
		  </view>
	</view>	
</block> -->
						<!-- AI回复部分 -->
						<block v-else>
							<block v-if="item.user_type == 1 ||  item.user_type == 'service'">
								<view class="right" @click="toShopHome()">
									<image :src="item.avatar" class="img"></image>
								</view>
								<view class="left pore">
									<view class="name"
										style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
										<text class="txt">{{item.name}}</text>
										<text class="time">{{item.time}}</text>
									</view>
									<!-- #ifdef MP-WEIXIN -->
									<view class="cons-cont" style="max-width: 530rpx;" @longpress="clickleft(item)">
										<jyf-parser :html="item.message" :selectable="selectable"
											:tag-style="{video: 'width: 100%;'}" class="text" @ready="allImgReady"
											@tap="richtextChange(item.message)"></jyf-parser>
									</view>
									<!-- #endif -->

									<!-- #ifdef APP-PLUS -->
									<!-- <block v-if="isVideoMessage(item)">
										<view class="video-message-container" @click="playVideo(item)">
											<view class="video-thumb">
												<image :src="getVideoThumb(item)" mode="aspectFill" />
												<image src="https://images.eqingqu.com/attachs/photo/202511/20251124_F26F5D418A1812885494D12540F7DF58.png" class="play-overlay" />
											</view>
										</view>
									</block> -->
									<view  class="cons-cont" @longpress="clickleft(item)"
										style="max-width: 460rpx;background-color: #eeeeee;padding: 20rpx;border-radius: 10rpx;">
										<mp-html :content="item.message" />
									</view>
									<!-- #endif -->

									<!-- #ifdef H5 -->
									<block v-if="isVideoMessage(item)">
										<view class="video-message-container" @click="playVideo(item)">
											<view class="video-thumb" >
												<image :src="getVideoThumb(item)" mode="aspectFill" />
												<image src="https://images.eqingqu.com/attachs/photo/202511/20251124_F26F5D418A1812885494D12540F7DF58.png" class="play-overlay" />
											</view>
										</view>
									</block>
									<view v-else class="cons-cont" @click="clickleft(item)"
										style="max-width: 460rpx;background-color: #eeeeee;padding: 20rpx;border-radius: 10rpx;">
										<mp-html :content="item.message" />
									</view>
									<!-- #endif -->
									<view class="domain"
										style="max-width: 100px;position: absolute;top: -40px;left: 0%;"
										v-if="item.score_rand==showid&& item.score_rand!==''"
										@touchstart="clickDomain()">
										<view class="fs24 coff disf"
											style="background-color: #4c4c4c;padding: 10px 15px ; border-radius: 5px;">
											<view class="" @click="clickpop(poplist[0].id,item)">
												<view class="" style=" width: 20px;height: 20px;padding-left: 2px;">
													<image :src="poplist[0].img" mode="widthFix" style="width: 20px;">
													</image>
												</view>
												<view class="fs24" style="margin-top: 2px;">
													{{poplist[0].text}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</block>
							<!-- 链接卡片部分 -->
							<block v-else>
								<view class="left">
									<view class="name">
										<text class="txt">{{item.name}}</text>
										<text class="time">{{item.time}}</text>
									</view>
									<view class="cons-cont " style="max-width: 300px;position: relative;">
										<!-- 1. 添加视频消息的判断 -->
									<!-- 	<block v-if="isVideoMessage(item)">
											<view class="video-message-container" @click="playVideo(item)">
												<view class="video-thumb"
													>
													<image :src="getVideoThumb(item)" mode="aspectFill" />
													<image src="https://images.eqingqu.com/attachs/photo/202511/20251124_F26F5D418A1812885494D12540F7DF58.png" class="play-overlay" />
												</view>
											</view>
										</block> -->

										<block v-if="!item.message">
											<view class="goods_link" @click="goodsLink(item.goods.goods_id)">
												<view class="goods_link_left">
													<image :src="item.goods.goods_thumb" mode=""></image>
												</view>
												<view class="goods_link_right">
													<view class="goods_link_right_name twolist-hidden">
														{{item.goods.goods_name}}
													</view>
													<view class="goods_link_right_footer">
														<currency-price :price="item.goods.shop_price" :size="18">
														</currency-price>
													</view>
												</view>
											</view>
										</block>
										<block v-else>
											<view @click="handleItemClick(item)">
												<jyf-parser :html="processContent(item.message)"
													:selectable="selectable" :tag-style="{ video: 'width: 100%' }"
													@linkpress="handleAppLinkPress" />
											</view>
											<!-- #ifndef H5 -->
											<!-- <view class="" @longpress="clickleft(item)">
												<jyf-parser :html="item.message" :selectable="selectable"
													:tag-style="{video: 'width: 100%;'}" class="text"
													@ready="allImgReady"
													@tap="richtextChange(item.message)"></jyf-parser>
											</view> -->

											<!-- #endif -->
											<!-- #ifdef H5 -->
											<!-- <view class="" @click="clickleft(item)">
												<jyf-parser :html="item.message" :selectable="selectable"
													:tag-style="{video: 'width: 100%;'}" class="text"
													@ready="allImgReady"
													@tap="richtextChange(item.message)"></jyf-parser>
											</view> -->
											<!-- <view @click="clickleft(item)">
											     <jyf-parser 
											       :html="parseGoodsLink(item.message)" 
											       :selectable="selectable"
											       :tag-style="{video: 'width: 100%;'}" 
											       @linkpress="handleLinkPress"
											     />
											   </view> -->
											<!-- #endif -->
										</block>

										<!-- 弹窗 -->
										<view class="domain"
											style="max-width: 100px;position: absolute;top: -80px;right: 0%;"
											v-if="item.score_rand==showid && item.score_rand!==''"
											@touchstart="clickDomain()">
											<view class="fs24 coff disf"
												style="background-color: #4c4c4c;padding: 10px 15px ; border-radius: 5px;">
												<view class="" v-for="(pitem,pindex) in getDisplayList(item)"
													:key="pindex" @click="clickpop(pitem.id,item)"
													:class="{'mr28':pindex>=0&& pindex< getDisplayList(item).length-1}">
													<view class="" style=" width: 20px;height: 20px;padding-left: 2px;">
														<image :src="pitem.img" mode="widthFix" style="width: 20px;">
														</image>
													</view>
													<view class="fs24" style="margin-top: 2px;">
														{{pitem.text}}
													</view>
												</view>
											</view>
										</view>
									</view>
									<view class="cons-cont">
										<view class="isread readno" style="color: #F45901;" v-if="item.status==1">
											<!-- <view class="sendimg" style="">
												<image src="/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
											</view>
											<view class="">
												未读{{item.status}}
											</view> -->
											<view class="sendimg" style="">
												<image src="/pagesC/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
												<image src="/pagesC/static/ming-pop/sendno.png" mode=""
													v-show="item.isFail==1" @click="failAgain(item,index)"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
											</view>
											<view class="">
												未读
											</view>
										</view>
										<view class="isread" style="color: #999999;" v-if="item.status==0">
											<!-- <view class="sendimg" style="">
												<image src="/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
											</view>
											<view class="">
												已读{{item.status}}
											</view> -->
											<view class="sendimg" style="">
												<image src="/pagesC/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 15rpx;">
												</image>
												<image src="/pagesC/static/ming-pop/sendno.png" mode=""
													v-show="item.isFail==1" @click="failAgain(item,index)"
													style="width: 24rpx;height: 24rpx;margin-top: 15rpx;">
												</image>
											</view>
											<view class="">
												已读
											</view>
										</view>
									</view>
								</view>
								<view class="right">
									<image :src="item.avatar" class="img"></image>
								</view>
							</block>
						</block>
					</view>
					<!-- seeeeend -->

					<view class="user-item"
						:class="{'user-item-admin':item.user_type == 1 || item.user_type == 'service'}"
						v-for="(item,index) in sendList" :key="index" v-if="sendList.length > 0">
						<block v-if="item.goods_id ">
							<view class="goods_link">
								<view class="goods_link_left">
									<image :src="kefuLoginData.goods.goods_thumb ?kefuLoginData.goods.goods_thumb:'' "
										mode=""></image>
								</view>
								<view class="goods_link_right">
									<view class="goods_link_right_name twolist-hidden">
										{{kefuLoginData.goods.goods_name}}
									</view>
									<view class="goods_link_right_footer">
										<currency-price :price="kefuLoginData.goods.shop_price"
											:size="18"></currency-price>
										<view class="send_link" @click="sub_send(item.goods_id)">发送链接</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else-if="item.msg_type==1">
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
							<view class="left">
								<view class="name"
									style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<view class="cons-cont">
									<view class="text">
										<view v-for="(item_one,index_one) in item.message" :key="index_one"
											@click="tofasong(item_one)">
											<view class="kefu_center_2">
												<view class="kefu_center_4_1"><text
														style="margin-right: 10rpx;color:#F45901;">{{index_one+1}}1</text>{{item_one.title}}
												</view>
												<image
													src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png"
													style="height: 30rpx;width: 20rpx;"></image>
											</view>
											<view v-if="index_one < item.message.length -1" style="height: 20rpx;">
											</view>
										</view>
									</view>
								</view>
							</view>

						</block>
						<block v-else-if="item.order_type==111">
							<view class="left">
								<view class="name">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<view class="cons-cont">
									<view class="text">
										<view style="max-width: 530rpx;">
											<view class="kefu_center_4_1_2">订　单　号：{{item.message.order_sn}}</view>
											<view class="kefu_center_4_1_2">下 单 时 间：{{item.message.add_time}}</view>
											<view class="kefu_center_4_1_2">收　货　人：{{item.message.consignee}}</view>
											<view class="kefu_center_4_1_2">订 单 状 态：{{item.message.order_status}}</view>
											<view class="kefu_center_4_1_2">订 单 金
												额：{{item.message.total_amount_formated}}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
						</block>
						<block v-else-if="item.msg_type===2">
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
							<view class="left">
								<view class="name"
									style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
									<text class="txt">{{item.name}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<!-- 评价jia -->
								<view class="ratecon mt10">
									<view class="" style="margin: 32rpx 0; ">
										<view class="title">
											服务评价
										</view>
										<view class="">
											<view class="rateview	ratecss" @click="isOvertime(item)"
												v-if="item.is_has_score==1 || item.is_has_overtime==1||item.isRate==true">
												<uni-rate :value="2" size="28"
												:readonly="true"	:disabled="true" disabledColor="#ffca3e" margin="10" />
											</view>

											<view class="" v-else>
												<view class="rateview">
													<uni-rate v-model="rateValue" @change="changeRate" size="28"
														class="ratecss" margin="10" :touchable="false" />
												</view>
												<view class="scorecss" v-if="item.is_has_score!==1">
													<view class="" v-if="!start_num">
														请评价
													</view>
													<view class="" v-else>
														{{valuebb}}
													</view>
												</view>
												<view class="queslist" v-if="item.is_has_score!==1">
													<view class="quescss" v-for="(item,index) in quesList" :key="index"
														:class="{ 'active': inques.includes(item) }"
														@click="onQues(item,index)">
														{{item}}
													</view>
												</view>
												<view class="rateview" v-if="item.is_has_score!==1">
													<view class="subbtn" @click="onSubmit(item)">
														提交评价
													</view>
												</view>

											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<!-- 视频消息 -->

					<!-- 	<block v-else-if="item.msg_type === 0 && isVideoMessage(item)">
							<view class="video-message-container" @click="playVideo(item)">
								<view class="video-thumb">
									<image :src="getVideoThumb(item)" mode="aspectFill" />
									<image src="https://images.eqingqu.com/attachs/photo/202511/20251124_F26F5D418A1812885494D12540F7DF58.png" class="play-overlay" />
								</view>
							</view>
						</block> -->
						<block v-else>
							<block v-if="item.user_type == 1 ||  item.user_type == 'service'">
								<view class="right" @click="toShopHome()">
									<image :src="item.avatar" class="img"></image>
								</view>
								<view class="left">
									<view class="name"
										style="display: flex; flex-direction: row; align-items: center;justify-content: flex-start">
										<text class="txt">{{item.name}}</text>
										<text class="time">{{item.time}}</text>
									</view>
									<!-- #ifdef MP-WEIXIN -->
									<view class="cons-cont" style="max-width: 530rpx;">
										<jyf-parser :html="item.message" :selectable="selectable"
											:tag-style="{video: 'width: 100%;'}" class="text" @ready="allImgReady"
											@tap="richtextChange(item.message)"></jyf-parser>
									</view>
									<!-- #endif -->

									<!-- #ifndef MP-WEIXIN -->
									<view class="cons-cont"
										style="max-width: 460rpx;background-color: #eeeeee;padding: 20rpx;border-radius: 10rpx;">
										<mp-html :content="item.message" />
									</view>
									<!-- #endif -->
								</view>
							</block>
							<block v-else>
								<view class="left">
									<view class="name">
										<text class="txt">{{item.name}}</text>
										<text class="time">{{item.time}}</text>
									</view>
									<view class="cons-cont" style="max-width: 300px;">

										<!-- 1. 添加视频消息的判断 -->
										<block v-if="isVideoMessage(item)">
											<view class="right">
												<image :src="item.avatar" class="img"></image>
											</view>
											<view class="left">
												<view class="name"
													style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
													<text class="txt">{{item.name}}</text>
													<text class="time">{{item.time}}</text>
												</view>
												<view class="video-message-container" @click="	(item)">
													<view class="video-thumb"
														@click="handleVideoPlay(parseVideoData(item))">
														<image :src="getVideoThumb(item)" mode="aspectFill" />
														<image src="/static/paly.png" class="play-overlay" />
													</view>
												</view>
											</view>
										</block>

										<!-- 2. 商品消息 -->
										<block v-else-if="!item.message">
											<view class="goods_link" @click="goodsLink(item.goods.goods_id)">
												<view class="goods_link_left">
													<image :src="item.goods.goods_thumb" mode=""></image>
												</view>
												<view class="goods_link_right">
													<view class="goods_link_right_name twolist-hidden">
														{{item.goods.goods_name}}
													</view>
													<view class="goods_link_right_footer">
														<currency-price :price=" item.goods.shop_price" :size="18">
														</currency-price>
													</view>
												</view>
											</view>
										</block>
										<!-- 3. 普通消息 -->
										<block v-else>
											<jyf-parser :html="item.message" :selectable="selectable"
												:tag-style="{video: 'width: 100%;'}" class="text" @ready="allImgReady"
												@tap="richtextChange(item.message)"></jyf-parser>
										</block>
									</view>
									<view class="cons-cont">
										<view class="isread readno" style="color: #F45901;" v-if="item.status==1">
											<view class="sendimg" style="">
												<image src="/pagesC/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
												<image src="/pagesC/static/ming-pop/sendno.png" mode=""
													v-show="item.isFail==1" @click="failAgain(item,index)"
													style="width: 24rpx;height: 24rpx;margin-top: 14rpx;">
												</image>
											</view>
											<view class="">
												未读
											</view>
										</view>
										<view class="isread" style="color: #999999;" v-if="item.status==0">
											<view class="sendimg" style="">
												<image src="/pagesC/static/ming-pop/sendyes.png" mode=""
													v-show="item.isFail==0"
													style="width: 24rpx;height: 24rpx;margin-top: 15rpx;">
												</image>
												<image src="/pagesC/static/ming-pop/sendno.png" mode=""
													v-show="item.isFail==1" @click="failAgain(item,index)"
													style="width: 24rpx;height: 24rpx;margin-top: 15rpx;;">
												</image>
											</view>
											<view class="">
												已读
											</view>
										</view>
									</view>
								</view>
								<view class="right">
									<image :src="item.avatar" class="img"></image>
								</view>
							</block>
						</block>
					</view>

					<!-- 撤回弹窗 -->
					<!-- <view class="margin-bottom: 100px;" style="display: inline-block;">
						<view class="fs24 coff disf"
							style="background-color: #4c4c4c;padding: 10px 15px ; border-radius: 15px;">
							<view class="" v-for="(item,index) in poplist" style=""
								:class="{'mr28':index>=0&& index!==poplist.length-1}">
								<view class="" style=" width: 22px;height: 22px;">
									<image src="/static/order/copy.png" mode="widthFix" style="width: 22px;"></image>
								</view>
								<view class="fs24" style="margin-top: 2px;">
									{{item.text}}
								</view>
							</view>
						</view>
					</view> -->
					<view style="text-align: center;margin-bottom: 20rpx;color: #999999;"
						v-if="!isShowkefu && isShowzhuanKefu" @click="toTurnKefu">如果问题没有解决，请转<text
							style="color: #F45901;margin: 0 10rpx;"> 人工客服 </text></view>
					<view style="text-align: center;margin-bottom: 50rpx;color: #000000;" v-if="isShowkefu">
						人工客服转接中，请稍后...</view>
					<!-- <view class="" style="height: 200px;" v-show="showPannel"></view> -->
				</view>
			</scroll-view>


			<!-- <view style="height: 200rpx;"></view> -->
			<!-- #ifdef H5 -->
			<view style="height: 110rpx;" v-if="!isShowkefu && isShowzhuanKefu"></view>
			<view style="height: 180rpx;" class="" v-else></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view style="height: 118rpx;" v-if="!isShowkefu && isShowzhuanKefu"></view>
			<view style="height: 200rpx;" class="" v-else></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view style="height: 118rpx;" v-if="!isShowkefu && isShowzhuanKefu"></view>
			<view style="height: 200rpx;" class="" v-else></view>
			<!-- #endif -->
		</view>

		<view class="kefu-bottom">
			<view class="kefu_center_7" v-if="isShowkefu ||!isShowzhuanKefu">
				<image
					src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968093327.png"
					@click="toCloseKefu" style="height: 60rpx;width: 120rpx;" mode="heightFix">
				</image>
			</view>
			<view class="footer">
				<!-- 左侧表情按钮 -->
				<view class="footer-icon-btn" @tap="show">
					<image
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968099325.png"
						class="footer-icon">
					</image>
				</view>
				<!-- 中间输入框 -->
				<view class="text-input">
					<input class="write-input" :disabled="disabledOne || isSending" placeholder="有问题找智能客服好卖~"
						placeholder-style="color:#999999;font-size:28rpx;" type="text" name="comment" v-model="comment"
						:confirm-hold="confirmHold" confirm-type="发送" autocomplete="off" @confirm="btnSubmit"
						cursor-spacing='30'>
				</view>
				<!-- 右侧功能按钮组 -->
				<view class="footer-right-actions">
					<view class="footer-icon-btn" @click="chooseImage">
						<image
							src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968098745.png"
							class="footer-icon">
						</image>
					</view>
					<view class="footer-icon-btn" @tap="showOrder" v-if="!isShowkefu && !isShowzhuanKefu">
						<image
							src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968097389.png"
							class="footer-icon">
						</image>
					</view>
				</view>
			</view>
			<emotion @emotion="handleEmotion" :height="200" v-if="showPannel&& isInputVisible"></emotion>

		</view>

		<!-- 咨询问题弹框 start -->
		<uni-popup ref="goodsattr" type="bottom">
			<view class="pop_content">
				<view class="goods_attr_pop">
					<view style="font-size: 36rpx;text-align: center;font-weight: bold;">请选择您要咨询的问题</view>
					<image class="close_img"
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968095943.png"
						@click="closePop('goodsattr')"></image>
				</view>
				<scroll-view scroll-y="true" :style="{height: `${popHeight}px`}">
					<view class="goods_attr_pop">
						<view v-for="(item,index) in synArr_xuan" :key="index">
							<view class="kefu_center_2" style="margin: 32rpx 0;" @click="tofasong(item)">
								<view class="kefu_center_4_1" style="width: 95%;">{{item.title}}</view>
								<image
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png"
									style="height: 30rpx;width: 20rpx;"></image>
							</view>
						</view>
					</view>
				</scroll-view>
				<view style="height: 50rpx;"></view>
			</view>
		</uni-popup>

		<!-- 咨询问题弹框 end -->

	   <!-- 将全屏视频播放器放在页面根级别 -->
	    <!-- <video-player ref="videoPlayer" /> -->
  <!-- 视频播放器组件 -->
  <video-player 
    v-if="!isMP || showVideoPlayer" 
    ref="videoPlayer" 
    style="position:fixed;z-index:-1;opacity:0;"
  />
  
  <!-- 小程序降级方案 -->
  <!-- #ifdef MP-WEIXIN -->
  <view>
  <video 
    v-if="currentVideo && isVideoVisible"
    :src="currentVideo.url"
    :poster="currentVideo.thumb"
    controls
    style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:#000;"
    @fullscreenchange="onFullscreenChange"
  />
  <view class="close-btn" @click="closeVideo">
        <image src="/static/close.png" style="width:40rpx;height:40rpx;"></image>
      </view>
  </view>
  <!-- #endif -->

		<!-- 订单列表弹窗 start -->
		<uni-popup ref="orderattr" type="bottom">
			<view class="pop_content">
				<view class="goods_attr_pop">
					<view style="font-size: 36rpx;text-align: center;font-weight: bold;">请选择您要咨询的订单</view>
					<image class="close_img"
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968095943.png"
						@click="closePop('orderattr')"></image>
				</view>
				<view class="search_1">
					<image
						src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968096087.png"
						style="width:40rpx;height: 40rpx;float: left;margin-top: 10rpx;margin-right: 10rpx;"></image>
					<input type="text" v-model="keyword_order_arr" placeholder="订单号" class="search_area"
						@input="searchInput_order_arr" placeholder-style="color:#C0C0C0;" @confirm="submitSelect" />
				</view>
				<scroll-view scroll-y="true" :style="{height: `${popHeight}px`}" v-if="order.length > 0">
					<view class="goods_attr_pop">
						<view v-for="(item,index) in order_xuan" :key="index">
							<view class="kefu_center_2" style="margin: 32rpx 0;" @click="toOrderfasong(item)">
								<view class="kefu_center_4">
									<view class="kefu_center_4_1_2">订　单　号：{{item.order_sn}}</view>
									<view class="kefu_center_4_1_2">下 单 时 间：{{item.add_time}}</view>
									<view class="kefu_center_4_1_2">收　货　人：{{item.consignee}}</view>
									<view class="kefu_center_4_1_2">订 单 状 态：{{item.order_status}}</view>
									<view class="kefu_center_4_1_2">订 单 金 额：{{item.total_amount_formated}}</view>
								</view>
								<image
									src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png"
									style="height: 30rpx;width: 20rpx;"></image>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-else :style="{height: `${popHeight}px`}">
					<dsc-not-content></dsc-not-content>
				</view>

				<view style="height: 50rpx;"></view>
			</view>
		</uni-popup>
		<!-- 订单列表弹窗 end -->

		<!-- 遮罩层 -->
		<view v-if="orderShows">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_2_1">确定发送订单吗？</view>

				<view style="display: flex;flex-direction: row;align-items: center;margin-top: 50rpx;">
					<view class="add_box3_1_a" @click="orderShowsOff">取消</view>
					<view class="add_box3_a" @click="orderShowsOn">确定</view>
				</view>
			</view>
		</view>

		<!-- 遮罩层 -->
		<!-- 是否结束人工客服 -->
		<view v-if="kefuShows">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare">
				<view class="wxshare_2_1">确定结束人工客服吗？</view>

				<view style="display: flex;flex-direction: row;align-items: center;margin-top: 50rpx;">
					<view class="add_box3_1_a" @click="kefuShowsOff">取消</view>
					<view class="add_box3_a" @click="kefuShowsOn">确定</view>
				</view>
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

		<!-- <view style="position: absolute;right: 10%;bottom: 20%;" @click="toshowReport">
			<view>
				<image src="https://images.eqingqu.com/attachs/photo/202403/20240327_48F6ECF4C8CD62CACB6205CF0BF9154F.png" style="width: 50rpx;height: 50rpx;"></image>
			</view>
		</view> -->

		<!-- 遮罩层 右上角三点 -->
		<view v-if="revertShow">
			<view class="cover" @click="revertShowNo" catchtouchmove="true"></view>
			<view class="wxshare_sx">
				<view class="wxshare_2_1">功能</view>
				<view style="position: absolute; right: 30rpx;top: 40rpx;" @click="revertShowNo">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240412_92D422316CD523B8232E90574882046B.png"
						style="height: 60rpx;width: 60rpx;"></image>
				</view>
				<view style="margin: 30rpx;text-align: left;">
					<view style="margin-bottom: 40rpx;display: flex;flex-direction: row;align-items: center;"
						:class="[isDefine == 1 ? 'darking' : 'graying']" @click="isChange">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240412_3C19D48FC8F3178178F1B3C399664019.png"
							style="width: 40rpx;height: 40rpx;"></image>
						<view style="margin-left: 20rpx;font-size: 32rpx;">投诉</view>
					</view>
					<view
						style="margin-bottom: 20rpx;font-size: 32rpx;display: flex;flex-direction: row;align-items: center;"
						:class="[isDefine == 2 ? 'darking' : 'graying']" @click="isChanges">
						<image
							src="https://images.eqingqu.com/attachs/photo/202404/20240408_0BAAE8D34BE6CE03750229F15B060F3C.png"
							style="width: 40rpx;height: 40rpx;"></image>
						<view style="margin-left: 20rpx;font-size: 32rpx;">平台客服介入</view>
					</view>
				</view>
				<view style="height: 50rpx;"></view>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view v-if="report_show">
			<view class="cover" catchtouchmove="true"></view>
			<view class="wxshare_y" style="background-color: #ffffff;">
				<view style="font-size: 38rpx;margin: 50rpx 50rpx 0rpx 50rpx;text-align: center;">举报内容</view>
				<view
					style="margin: 20rpx 30rpx;padding: 20rpx 30rpx;border-radius: 10rpx;height: 200rpx;font-size: 26rpx;text-align: left;border: 2rpx solid #eeeeee;">
					<textarea @input="toInput" :value="title" style="width: 100%;font-size: 26rpx;height: 200rpx;"
						maxlength="300" placeholder-style="color:#999999;font-size: 26rpx;width: 100%;"
						placeholder="请输入" />
				</view>
				<view style="display: flex;flex-direction: row;margin-bottom: -20rpx;">
					<view class="add_box3_buy_1_s" @click="report_showNo">取消</view>
					<view class="add_box3_buy_1_y" @click="report_showYes">确定</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		pathToBase64,
		base64ToPath
	} from '../../common/index.js'
	import util from '../common/util.js';
	import permision from "@/common/permission.js"
	import Emotion from '@/components/emotion/index.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser_1.vue";
	import uniPopup from '@/components/uni-popup/uni-popup_1.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
	import UniRate from '@/components/uni-rate.vue';
	import dscFilterTop from '@/components/dsc-filter-top'
	import VideoPlayer from '@/pagesB/components/video-player/video-player.vue';
	const animation = uni.createAnimation({
		duration: 300,
		timingFunction: 'ease'
	})
	export default {
		components: {
			uniPopup,
			Emotion,
			jyfParser,
			dscNotContent,
			uniNoticeBar,
			UniRate,
			dscFilterTop,
			  VideoPlayer
		},
		data() {
			return {
				// 新增视频控制相关数据
				// 平台信息
				isSystemPlayerVisible: false,
				systemPlayerContext: null,
				isPlaying: false,
				currentTime: 0,
				duration: 0,
				showSwipeHint: true,

				// 平台检测
				isIOS: uni.getSystemInfoSync().platform === 'ios',
				
				isPlaying: true,
				currentTime: 0,
				duration: 0,
				touchStartY: 0,
				touchMoveY: 0,
				showSwipeHint: true,
				swipeHintTimer: null,
				fullscreenVideoId: null, // 当前全屏视频ID
				currentVideo: null, // 当前视频数据
				isMP: false,
				      showVideoPlayer: false,
				     
				      isVideoVisible: false,
				
				videoContext: null, // 视频实例
				fullscreenVideo: false, // 全屏重试计数器,
				addrinfo: [],
				user_type: 2,
				store_id: 0,
				goods_id: '',
				token: '',
				type: 'default',
				default: 1,
				size: 10,
				page: 1,
				img: '',
				content: '',
				socketTask: null,
				is_open_socket: false,
				socketReconnectCount: 0,
				socketReconnectMax: 5,
				isManualClose: false,
				connectId: 0,
				hasConnectedBefore: false, // 区分「连接中」与「已断开」
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 46,
					mitemHeight: 40,
					consultHeight: 0,
				},
				popHeight: 0,
				scrollTop: 0,
				comment: '',
				isSending: false,
				showPannel: false,
				timer: null,
				kefuLoginData: null,
				reg: /\#[\S]{1,3}\;/gi,
				from_id: null,
				list: [],
				shop_name: '',
				confirmHold: true,
				status_one: 0,

				isShowkefu: false,
				isShowzhuanKefu: true,
				isInputVisible: true,

				keyword_arr: '',
				synArr_xuan: [],
				synArr: [],

				keyword_order_arr: '',
				order_xuan: [],
				order: [],

				orderShows: false,
				faOrder: {},
				selectable: true,

				clearOut: null,
				mateKeywords: '',
				mateKeywordsList: [],
				disabledOne: false,

				kefuShows: false,
				notice: '',

				photo_show: false,

				isDefine: 1,
				revertShow: false,
				title: '',
				report_show: false,

				menuButtonInfo: {},
				gaodu: '',

				version: '',
				rateValue: 0, //评分
				rateValue2: 0, //评分
				start_num: '', //评价等级
				content: '', //评价内容
				is_has_score: '', //是否评价
				lastmsg: [], //最新消息
				quesList: [], //内容列表
				inques: [], //选中内容
				disabledRate: true, //评分禁用
				valueaa: ['太差了', '不满意', '一般', '满意', '太赞了'], //评分文字
				valuebb: '', //当前评分文字
				isSub: 0,
				isRate: false,
				uid: uni.getStorageSync('userInfo').id,
				isTop: true, //返回顶部
				sendList: [],
				isFail: 0,
				rateQues: '',
				showPop: false,
				showpopindex: '-1',
				showid: '',
				isShowId: false,
				scorerand: '',
				poplist: [{
						id: 0,
						text: '复制',
						img: '/pagesC/static/order/copy.png'
					},
					{
						id: 1,
						text: '撤回',
						img: '/pagesC/static/order/recall.png'
					}
				]
			}
		},

		onReady() {
			let view = uni.createSelectorQuery().in(this).select(".user-consult");
			view.fields({
				size: true
			}, data => {
				if (data && data.height) {
					this.scrollTop = data.height;
				}
			}).exec();
		},
		onPageScroll(e) {},
		//初始化加载数据
		mounted() {
			 // 检测是否小程序环境
			    // #ifdef MP-WEIXIN
			    this.isMP = true;
			    // 延迟显示确保ref可用
			    setTimeout(() => {
			      this.showVideoPlayer = true;
			    }, 300);
			    // #endif
			const systemInfo = uni.getSystemInfoSync();
			this.isIOS = systemInfo.platform === 'ios';
			// #ifdef H5
			document.addEventListener('click', this.clickDomain);
			// document.addEventListener('click', this.clickBottom);
			// #endif
		},
		beforeDestroy() {
			// #ifdef H5
			document.removeEventListener('click', this.clickDomain);
			// document.removeEventListener('click', this.clickBottom);
			// #endif
		},
		async onLoad(e) {
			const systemInfo = uni.getSystemInfoSync();
			this.isIOS = systemInfo.platform === 'ios';
			var that = this
			uni.$on('clickDomain', this.clickDomain);
			// uni.$on('clickBottom', this.clickBottom);
			// 小程序有时 onLoad 的 e 为空，从当前页 options 取一次
			// #ifdef MP-WEIXIN
			if (!e || (e && typeof e.shop_id === 'undefined' && typeof e.shop_name === 'undefined')) {
				const pages = getCurrentPages();
				if (pages.length) {
					const cur = pages[pages.length - 1];
					if (cur.options) e = cur.options;
				}
			}
			// #endif
			setTimeout(() => {
				const systemInfo = uni.getSystemInfoSync();
				// #ifdef H5
				const uniAppVersion = systemInfo.appVersion;
				// #endif
				// #ifndef H5
				const uniAppVersion = systemInfo.appWgtVersion;
				// #endif
				console.log('当前的version版本是多少',systemInfo.appVersion)
				this.version = '3.7.0', //uniAppVersion
					that.consultH();
				// this.setOrderList()
				// #ifdef MP-WEIXIN
				that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				uni.getSystemInfo({ //获取系统信息
					success: res => {
						that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res
								.statusBarHeight) *
							2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
					}
				})
				// #endif
				const res = uni.getSystemInfoSync();
				// 高度
				that.style.pageHeight = res.windowHeight - that.style.mitemHeight;
				// that.style.contentViewHeight = that.style.pageHeight
				// #ifdef MP-WEIXIN
				that.style.contentViewHeight = that.style.pageHeight
				// #endif
				// #ifdef APP-PLUS
				that.style.contentViewHeight = that.style.pageHeight - 80
				// #endif
				// #ifdef H5
				that.style.contentViewHeight = that.style.pageHeight
				// #endif
				that.popHeight = res.windowHeight * 0.6
				that.shop_name = (e && e.shop_name != null) ? (typeof e.shop_name === 'string' && e.shop_name.indexOf('%') >= 0 ? decodeURIComponent(e.shop_name) : e.shop_name) : ''
				that.store_id = (e && (e.shop_id != null && e.shop_id !== '')) ? e.shop_id : 0
				that.goods_id = (e && e.goods_id != null) ? e.goods_id : ''
				that.token = (e && e.token != null) ? e.token : ''
				const storedSendList = uni.getStorageSync('sendList');
				if (storedSendList) {
					this.sendList = storedSendList;
				}
				if (that.shop_name != 'undefined') {
					uni.setNavigationBarTitle({
						title: that.shop_name
					});
				} else {
					uni.setNavigationBarTitle({
						title: '客服中心'
					});
					that.shop_name = '客服中心'
				}
				uni.request({
					url: 'https://www.ok9288.com/api/shop/getshopnotice',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						ru_id: that.store_id,
					},
					success: (res1) => {
						if (res1.statusCode == 200) {
							that.notice = res1.data.data.notice
						}
					}
				})
				uni.request({
					url: 'https://www.ok9288.com/api/chat/getjointext',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						store_id: that.store_id
					},
					success: (res) => {
						if (res.statusCode == 200) {
							that.mateKeywordsList = res.data.data.text
						}
					}
				})
				uni.request({
					url: 'https://www.ok9288.com/api/chat/get_im_online',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						store_id: that.store_id,
						user_id: uni.getStorageSync('userInfo').id
					},
					success: (res) => {
						if (res.data.status == 'success') {
							that.status_one = res.data.data.status // 0 智能客服 1 人工客服
							if (res.data.data.status == 1) {
								that.isShowkefu = false
								that.isShowzhuanKefu = false
							}
							uni.request({
								url: 'https://www.ok9288.com/kefu/index',
								method: 'POST',
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token'),
									'X-Client-Hash': uni.getStorageSync('client_hash')
								},
								data: {
									// uid:that.store_id,
									uid: uni.getStorageSync('userInfo').id,
									ru_id: that.store_id,
									goods_id: that.goods_id,
									t: that.token,
									type: 'app',
									v: 'v1'
								},
								success: (res1) => {
									if (res1.statusCode == 200) {
										that.kefuLoginData = res1.data
										that.connectSocketInit('login');
										//聊天列表
										that.chatList();
										that.setOrderList();
									}
								}
							})
						}
					}
				})
				uni.request({
					url: 'https://www.ok9288.com/api/chat/quest_list',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						// store_id:'10116',
						store_id: that.store_id,
					},
					success: (res_que) => {
						if (res_que.data.status == 'success') {
							that.synArr_xuan = res_que.data.data
							that.synArr = res_que.data.data
						}
					}
				})
			}, 10)

		},
		onShow() {
			var that = this
			const storedSendList = uni.getStorageSync('sendList');
			if (storedSendList) {
				this.sendList = storedSendList;
			}
			// 从外部返回页面时：若曾连上过但当前断开且未在重连中，主动尝试重连
			if (that.kefuLoginData && that.hasConnectedBefore && !that.is_open_socket && !that.disabledOne) {
				that.connectSocketInit('login')
			}
		},
		onUnload() {
			var that = this
			that.closeSocket();
			setTimeout(function() {
				clearInterval(that.clearOut);
			}, 5000);
			uni.$off('clickDomain', this.clickDomain);
			// uni.$off('clickBottom', this.clickBottom);
		},
		onReachBottom() {
			var that = this;
			this.listMove()
		},
		methods: {
			linkHref(goods_id) {
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + goods_id
				})
			},
		onFullscreenChange(e) {
		      if (!e.detail.fullScreen) {
		        this.isVideoVisible = false;
		      }
		    },
  // 统一的视频播放方法
  playVideo(item) {
    // 解析视频数据
    const videoData = this.parseVideoData(item);
    
    // 平台特定处理
    // #ifdef H5
    this.playVideoInH5(videoData);
    // #endif
    
    // #ifdef MP-WEIXIN
    this.playVideoInMP(videoData);
    // #endif
    
    // #ifdef APP-PLUS
    this.playVideoInApp(videoData);
    // #endif
  },
   playVideoInMP(videoData) {
        this.currentVideo = videoData;
        this.showVideo = true;
        
        this.$nextTick(() => {
          this.videoContext = uni.createVideoContext('mainVideoPlayer', this);
          this.videoContext.play();
          this.isPlaying = true;
        });
      },
      
      // 关闭视频
      closeVideo() {
        if (this.videoContext) {
          this.videoContext.stop();
        }
        this.showVideo = false;
      },
  // H5视频播放实现
  playVideoInH5(videoData) {
    if (!videoData.url) {
      uni.showToast({ title: '视频地址无效', icon: 'none' });
      return;
    }
    
    // 创建视频容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = '#000';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    
    // 创建视频元素
    const videoEl = document.createElement('video');
    videoEl.style.maxWidth = '90%';
    videoEl.style.maxHeight = '80vh';
    videoEl.controls = true;
    videoEl.poster = videoData.thumb || '';
    
    // 添加多个源以解决格式兼容性问题
    const source = document.createElement('source');
    source.src = videoData.url;
    source.type = this.getVideoMimeType(videoData.url);
    videoEl.appendChild(source);
    
    // 添加备用源
    if (videoData.url.endsWith('.mp4')) {
      const backupSource = document.createElement('source');
      backupSource.src = videoData.url.replace('.mp4', '.webm');
      backupSource.type = 'video/webm';
      videoEl.appendChild(backupSource);
    }
    
    // 创建关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10000';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.background = 'rgba(0,0,0,0.5)';
    closeBtn.style.borderRadius = '50%';
    
    // 事件处理
    closeBtn.onclick = () => {
      document.body.removeChild(container);
      videoEl.pause();
    };
    
    // 错误处理
    videoEl.onerror = (e) => {
      uni.showToast({
        title: '视频播放失败: ' + this.getVideoErrorText(e.target.error),
        icon: 'none'
      });
    };
    
    // 添加到DOM
    container.appendChild(videoEl);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
    
    // 尝试播放
    videoEl.play().catch(e => {
      uni.showToast({
        title: '播放失败: ' + e.message,
        icon: 'none'
      });
    });
  },
  
  getVideoMimeType(url) {
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    if (url.includes('.ogg')) return 'video/ogg';
    return 'video/mp4'; // 默认
  },
  
  getVideoErrorText(error) {
    if (!error) return '未知错误';
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED: return '播放被中止';
      case MediaError.MEDIA_ERR_NETWORK: return '网络错误';
      case MediaError.MEDIA_ERR_DECODE: return '解码错误';
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: return '格式不支持';
      default: return `错误代码: ${error.code}`;
    }
  },
  
  // 解析视频数据
  parseVideoData(item) {
    // 优先使用原始视频数据
    if (item.video_url) {
      return {
        url: item.video_url,
        thumb: item.video_thumb || ''
      };
    }
    
    // 尝试从HTML中解析
    try {
      const srcMatch = item.message.match(/src="([^"]+)"/);
      const posterMatch = item.message.match(/poster="([^"]+)"/);
      
      return {
        url: srcMatch ? srcMatch[1] : '',
        thumb: posterMatch ? posterMatch[1] : ''
      };
    } catch (e) {
      return { url: '', thumb: '' };
    }
  },
		// 	playVideo(item) {
  //   // 确保在小程序环境
  //   // #ifdef MP-WEIXIN
  //   this.$nextTick(() => {
  //     try {
  //       const videoPlayer = this.$refs.videoPlayer;
  //       if (!videoPlayer) {
  //         console.warn('VideoPlayer component not found, using fallback');
  //         this.playVideoFallback(item);
  //         return;
  //       }
        
  //       const videoData = this.parseVideoData(item);
  //       if (videoPlayer.play) {
  //         videoPlayer.play(videoData);
  //       } else {
  //         this.playVideoFallback(item);
  //       }
  //     } catch (e) {
  //       console.error('Video play error:', e);
  //       this.playVideoFallback(item);
  //     }
  //   });
  //   // #endif
    
  //   // 其他平台实现
  //   // #ifndef MP-WEIXIN
  //   const videoData = this.parseVideoData(item);
  //   this.$refs.videoPlayer?.play?.(videoData);
  //   // #endif
  // },
  playVideoFallback(item) {
      const videoData = this.parseVideoData(item);
      // 实现降级方案，比如使用小程序原生 video 组件
      this.currentVideo = videoData;
      this.isVideoVisible = true;
    },
			// 判断是否为视频消息
			isVideoMessage(item) {
				// console.log(item)
				if (item.msg_type === 'video') return true;

				try {
					const msg = JSON.parse(item.message);
					return msg.msg_type === 'video';
				} catch (e) {
					return false;
				}
			},
			// 解析视频数据
			parseVideoData(item) {
				if (item.msg_type === 'video') {
					return item; // 已经是结构化数据
				}

				try {

					return JSON.parse(item.message);
				} catch (e) {
					return {};
				}
			},
			// 获取视频缩略图
			getVideoThumb(item) {
				if (item.thumb) return item.thumb;

				try {
					const msg = JSON.parse(item.message);
					return msg.thumb || '';
				} catch (e) {
					// return '/pagesC/static/addimg.png';
					return ''
				}
			},
			// end


			// 发送视频
async chooseVideo() {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        compressed: true,
        success: resolve,
        fail: reject
      });
    });
    
    // 检查文件大小
    if (res.size > 50 * 1024 * 1024) {
      uni.showToast({
        title: '视频大小不能超过50MB',
        icon: 'none'
      });
      return;
    }
    
    uni.showLoading({ title: '上传中...' });
    
    // 获取视频缩略图
    const thumbPath = res.thumbTempFilePath;
    
    // 上传视频
    const videoUrl = await this.uploadVideoFile(res.tempFilePath);
    
    // 按照后端要求的格式拼接视频消息
    const videoMsgs = `
      <video 
        controls 
        id="video_${Date.now()}"
        style="max-width:300px;height:200px;border-radius:10rpx"
        poster="${thumbPath}"
        src="${videoUrl}">
      </video>
    `;
    
    // 发送消息
    this.sendMsg(videoMsgs, 1, videoUrl, thumbPath);
    
  } catch (error) {
    uni.showToast({
      title: '视频处理失败: ' + (error.message || '未知错误'),
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
},
async uploadVideoFile(filePath) {
  return new Promise((resolve, reject) => {
    // 使用uni.uploadFile上传视频
    uni.uploadFile({
      url: 'https://www.ok9288.com/api/user/material_video',
      filePath: filePath,
      name: 'file',
      formData: {
        type: 'video'
      },
      header: {
        'token': uni.getStorageSync('token'),
        'Content-Type': 'multipart/form-data'
      },
      success: (uploadRes) => {
        try {
          // 安全解析响应
          const data = typeof uploadRes.data === 'string' ? 
                      JSON.parse(uploadRes.data) : uploadRes.data;
          
          // 安全访问返回数据 - 多种可能的响应结构
          const videoUrl = data?.data?.[0] || 
                          data?.url || 
                          data?.file_url || 
                          data?.result?.[0];
          
          if (!videoUrl) {
            throw new Error('无法获取视频URL');
          }
          resolve(videoUrl);
        } catch (e) {
          reject(new Error('解析上传响应失败'));
        }
      },
      fail: (err) => {
        reject(new Error('上传失败: ' + (err.errMsg || '未知错误')));
      }
    });
  });
},

			// 视频压缩方法
			compressVideo(filePath) {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					const savePath = plus.os.name === 'iOS' ?
						plus.io.DOCUMENTS + '/compressed.mp4' :
						plus.io.PUBLIC_DOCUMENTS + '/compressed.mp4';
					plus.zip.compressVideo({
							src: filePath,
							quality: 'medium',
							resolution: '480p',
							bitrate: 500000,
							save: savePath
						},
						(res) => { // 成功回调
							if (res.tempFilePath) {
								resolve(res.tempFilePath); // 
							} else {
								reject(new Error('压缩失败：未生成有效路径'));
							}
						},
						(err) => { // 失败回调
							reject(new Error('视频压缩失败: ' + JSON.stringify(err)));
						});
					// #endif

					// #ifdef H5 || MP-WEIXIN
					// H5/小程序模拟压缩过程（实际需用具体压缩方案）
					uni.showToast({
						title: '视频压缩暂不支持',
						icon: 'none'
					});
					resolve(filePath); // 返回原路径或处理后的路径
					// #endif
				});
			},

			// end


			//跳转链接处理 链接标记增强
			markSpecialLinks(html) {
				try {
					return html.replace(
						/<a\s+([^>]*?)href=(["'])(.*?)\2/gi,
						(match, attrs, quote, url) => {
							const isGoods = this.isGoodsLink(url);
							const isInternal = url.startsWith('#') || url.startsWith('/');
							return `<a ${attrs} 
                     href="${url}" 
                     data-link-type="${isGoods ? 'goods' : isInternal ? 'internal' : 'external'}"
                     data-platform="all">`;
						}
					);
				} catch (e) {
					return html;
				}
			},


			// 链接点击处理

			handleAppLinkPress(event) {
				// 1. 安全解构参数
				const {
					href,
					ignore
				} = event || {};

				// 2. 阻止默认跳转
				ignore && ignore();

				// #ifdef MP-WEIXIN
				this.handleMiniProgramLink(href);
				// #endif
				// 4. 执行跳转判断
				if (this.isGoodsLink(href)) {
					this.handleGoodsNavigation(href);
				} else {
					this.handleUniversalLink(href);
				}
			},
			// 小程序跳转
			handleMiniProgramLink(url) {
				const goodsId = this.extractGoodsId(url);
				if (!goodsId) {
					uni.showToast({
						title: '商品信息错误',
						icon: 'none'
					});
					return;
				}

				uni.navigateTo({
					url: `/pagesC/goodsDetail/goodsDetail?id=${goodsId}`,
					fail: (err) => {
						uni.showToast({
							title: '跳转失败，请稍后重试',
							icon: 'none'
						});
					}
				});
			},


			isGoodsLink(href) {
				const patterns = [
					/\/pagesC\/goodsDetail\/goodsDetail\?id=(\d+)/, // 匹配小程序路径
					/\/goods-(\d+)\.html$/i,
					/\/(?:goodsDetail|item)\b/i,
					/[?&]id=\d+/i
				];
				return patterns.some(regex => regex.test(href));
			},

			// 修改HTML预处理方法
			processContent(html) {
				// 修正正则表达式
				return html.replace(
					/<a\b([^>]*)href=(["'])(.*?)\2([^>]*)>/gi,
					(match, preAttrs, quote, url, postAttrs) => {
						const isGoods = this.isGoodsLink(url);

						// 移除已存在的target属性
						const cleanAttrs = `${preAttrs}${postAttrs}`
							.replace(/\btarget\s*=\s*["'][^"']*["']/gi, '')
							.trim();

						return `<a ${cleanAttrs} 
                  href="${url}" 
                  data-link-type="${isGoods ? 'goods' : 'normal'}" 
                  onclick="return false;">`;
					}
				);
			},



			// 商品链接处理
			async handleGoodsNavigation(url) {
				try {
					const goodsId = this.extractGoodsId(url);
					if (!goodsId) throw new Error('Invalid goods ID');

					// 增强平台判断
					let targetPath = '';
					// #ifdef APP-PLUS
					targetPath = `/pagesC/goodsDetail/goodsDetail?id=${goodsId}`; // 统一小写
					// 严格验证页面存在性
					// const pageExists = await this.strictVerifyPage(targetPath);
					// if (pageExists) {
					console.log('APP原生跳转:', targetPath);
					return uni.navigateTo({
						url: targetPath
					});
					// }
					console.warn('原生页面不存在，强制H5跳转');
					// #endif

					// 统一H5处理（包括APP降级情况）
					const h5Url = this.generateH5Url(url);
					console.log('H5跳转:', h5Url);
					this.openBrowser(h5Url);
				} catch (e) {
					console.error('商品导航错误:', e);
					// this.showErrorToast('商品加载失败');
				}
			},
			async strictVerifyPage(path) {
				try {
					// #ifdef APP-PLUS
					const pages = getCurrentPages();
					const normalizedPath = path.split('?')[0].toLowerCase();

					// 检查当前页面栈
					const inStack = pages.some(p =>
						p.route.toLowerCase() === normalizedPath
					);
					if (inStack) return true;

					// 检查全局配置
					const manifest = await import('@/pages.json');
					return manifest.pages.some(p =>
						p.path.toLowerCase() === normalizedPath
					);
					// #endif
					return false;
				} catch (e) {
					return false;
				}
			},
			generateH5Url(url) {
				// #ifdef H5
				return url
				// return url.replace(/^\/pagesC\//i, '/h5/')
				//          .replace(/\/goodsdetail\/goodsdetail/gi, '/goods');
				// #endif
				// #ifdef MP-WEIXIN
				const match = url.match(/id=(\d+)/);
				return match ? `/pagesC/goodsDetail/goodsDetail?id=${match[1]}` : url;
				// #endif
				// #ifdef APP-PLUS
				return this.domain + url; // 使用配置的H5域名
				// #endif
			},

			// 提取商品ID（支持多种格式）
			extractGoodsId(url) {
				const patterns = [
					// 新增商品别名规则
					/(?:\/goods-)(\d+)(?:\.html)/, // 匹配类似 /goods-44008.html
					/[?&]id=(\d+)/, // 查询参数（保留原有）
					// 扩展参数特征规则
					/(?:\/(?:detail|item|product)\/)(\d+)/, // 兼容多关键词
					// 路径参数增强匹配
					/(?:\/[a-z0-9-]+-)(\d+)(?:\.html)/ // 通用伪静态匹配
				];

				const decoded = decodeURIComponent(url);
				for (const regex of patterns) {
					const match = decoded.match(regex);
					if (match && match[1]) return match[1];
				}
				return null;
			},


			// 外部链接处理
			openBrowser(url) {
				// #ifdef MP-WEIXIN
				uni.showToast({
					title: '正在打开商品页面',
					icon: 'loading',
					duration: 1500
				});
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openWeb(url);
				// #endif
				// #ifdef H5
				window.open(url, '_blank');
				// #endif
			},

			// 错误提示统一处理
			// showErrorToast(message = '操作失败，请重试') {
			//   uni.showToast({
			//     title: message,
			//     icon: 'none',
			//     duration: 3000
			//   });
			// },

			// 2

			hideInputAndEmoji() {
				this.isInputVisible = false;
				this.showPannel = false;
				this.$nextTick(function() {
					this.listMove();
				})
				this.setScrollH()
			},
			toShopHome() {
				var that = this
				if (that.store_id != 0 && that.store_id != 2) {
					this.$outerHref('/pagesD/shop/shopHome/shopHome?ru_id=' + that.store_id, 'app')
				}
			},

			clickaddryes(id, itemid) {
				uni.request({
					url: 'https://www.ok9288.com/api/order/user_confirm_order_info',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						order_id: id
					},
					success: (res) => {
						uni.showToast({
							icon: 'none',
							title: res.data.data
						})
						if (res.data.status == 'success') {
							for (let i = 0; i < this.list.length; i++) {
								if (this.list[i].id === itemid) {
									this.list[i].user_is_has_confirm = 1;
								}
							}
						}
					},
					fail: (err) => {
					}
				})
			},
			getPoplist(item) {
				const givenTime = new Date(item.time);
				const currentTime = new Date();
				const timeDifference = (currentTime - givenTime) / (1000 * 60);
				if (timeDifference > 2) {
					return this.poplist.filter((_, index) => index !== 1);
				}
				return this.poplist;
			},
			getDisplayList(item) {
				if (item.score_rand) {
					return this.getPoplist(item).slice(0, 2);
				}
				return this.getPoplist(item).slice(0, 1);
			},
			clickpop(index, item) {
				this.showid = ''
				if (index == 0) {
					const pureText = item.message.replace(/<[^>]*>/g, '');
					uni.setClipboardData({
						data: pureText,
						complete() {
							uni.showToast({
								title: "复制成功",
								icon: 'none'
							})
						}
					})
				} else {
					this.getRecall(item.score_rand, item)
				}
			},
			getRecall(id, item) {
				uni.request({
					url: 'https://www.ok9288.com/api/chat/is_can_message_remove',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						score_rand: id
					},
					success: (res) => {
						let data = res.data.data
						if (data && data.status == '1') {
							this.list = this.list.filter(item => item.score_rand !== id);
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
							let objaa = {
								type: "message_remove",
								status: 0,
								to_id: this.store_id,
								user_type: 'customer',
								store_id: this.store_id,
								uid: this.uid,
								score_rand: id
							}
							this.clickRequest(objaa)
						} else if (data.status == '0') {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
						}
					},
					fail: (err) => {
					}
				})
			},
			clickleft(item) {
				this.showid = item.score_rand
				this.isShowId = true
			},
			clickDomain(event) {
				// #ifdef H5
				const domain = this.$el.querySelector('.domain');
				if (this.isShowId && domain && !domain.contains(event.target)) {
					this.isShowId = false;
				} else {
					this.showid = '';
					this.isShowId = false;
				}
				// #endif
				// #ifndef H5
				// if (this.showid) {
				// 	this.showid = '';
				// 	this.isShowId = false;
				// }
				// #endif
			},

			// 重新发送失败信息
			failAgain(item, index) {
				setTimeout(() => {
					this.comment = item.message
					this.sendList.splice(index, 1);
					uni.setStorageSync('sendList', this.sendList)
					this.btnSubmit()
				}, 1)
			},
			// 查看更多历史聊天记录
			getMorelist() {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/chat/appSingleChatListnew',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						user_type: this.user_type,
						type: this.type,
						// store_id:'10116',
						store_id: this.store_id,
						page: this.page,
						type: true,
						app_version: this.version,
					},

					success: (res) => {
						if (res.error == 1) {
							uni.showToast({
								title: '没有历史记录了',
								icon: 'none'
							})
							return false
						}
						for (var i = 0; i < res.data.length; i++) {
							if (res.data[i].msg_type == 1) {
								res.data[i].message = JSON.parse(res.data[i].message);
							} else if (res.data[i].msg_type == 2) {
								let str = res.data[i].message;
								if (str.includes("\\")) {
									let data = JSON.parse(str);
									that.rateQues = data
									if (data[0].is_has_score && data[0].is_has_score == 1) {
										res.data[i].score = data[0].score
									} else {
										this.quesList = data[0].content
									}
								} else {}
							}
						}
						if (res.data.length > 0) {
							if (this.goods_id > 0) {
								this.list.push(this.kefuLoginData.goods);
							}
							that.page = that.page + 1
							var list = res.data
							list.forEach(v => {
								that.list.unshift(v);
							})
							uni.createSelectorQuery().select(".onMore").boundingClientRect((
								res) => {
								const scrollH = res.top;
								uni.pageScrollTo({
									duration: 100,
									scrollTop: scrollH,
								})
							}).exec()
						} else {
							uni.showToast({
								icon: 'none',
								title: '没有更多了'
							})
						}
					}
				})
			},
			isOvertime(item) {
				this.onSubmit(item)
			},
			onSubmit(item) {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/chat/set_score',
					method: 'POST',
					data: {
						id: item.id,
						score_rand: item.score_rand,
						uid: uni.getStorageSync('userInfo').id,
						services_id: item.service_id,
						start_num: that.start_num,
						content: that.inques,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							if (item.isRate = true) {
								this.isRate = item.isRate
								item.score = that.start_num
							} else {
								this.isRate = !item.isRate
							}
							let objaa = {
								type: "set_kefu_score",
								status: 0,
								to_id: that.store_id,
								user_type: 'customer',
								store_id: that.store_id,
								uid: that.uid,
								start_num: that.start_num
							}
							that.clickRequest(objaa)
							uni.showToast({
								icon: 'none',
								title: res.data.data.msg
							})
							that.$nextTick(function() {
								that.listMove();
							})
						} else if (res.data.status == 'failed') {
							uni.showToast({
								icon: 'none',
								title: res.data.errors.message
							})
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: res.data.errors.message
						})
					},
				})
			},
			onQues(item, index) {
				var that = this
				const index1 = this.inques.indexOf(item);
				if (index1 > -1) {
					this.inques.splice(index1, 1);
				} else {
					this.inques.push(item);
				}
			},
			//评分
			changeRate(e) {
				var that = this
				if (e) {
					this.rateValue2 = e.value
					this.start_num = e.value
					this.valuebb = this.valueaa[e.value - 1]
					this.inques = []
					const aa = this.rateQues.find(item => item.score === this.rateValue2);
					if (aa) {
						this.quesList = aa.content
					}
				}
			},
			//订单列表
			setOrderList() {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/order/list',
					method: 'POST',
					data: {
						page: 1,
						size: 100,
						status: 0,
						type: 'type',
						keywords: that.keyword_order_arr,
						shop_id: that.store_id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							that.order = res.data.data.list
							that.order_xuan = res.data.data.list
						}
					}
				})
			},
			searchInput_order_arr(e) {
				this.keyword_order_arr = e.detail.value
				// this.order_xuan = []
				for (let i = 0; i < this.order.length; i++) {
					if (this.order[i].title.indexOf(this.keyword_order_arr) > 0) {
						this.order_xuan.push(this.order[i])
					}
				}
				if (this.keyword_order_arr == '') {
					this.order_xuan = this.order
				}
			},
			submitSelect() {
				this.setOrderList()
			},
			searchInput_arr(e) {
				this.keyword_arr = e.detail.value
				this.synArr_xuan = []
				for (let i = 0; i < this.synArr.length; i++) {
					if (this.synArr[i].title.indexOf(this.keyword_arr) > 0) {
						this.synArr_xuan.push(this.synArr[i])
					}
				}
				if (this.keyword_arr == '') {
					this.synArr_xuan = this.synArr
				}
			},

			showOrder() {
				var that = this
				setTimeout(() => {
					this.setOrderList()
					that.$refs['orderattr'].open();
				}, 1)
			},
			toShowMore() {
				var that = this
				that.$refs['goodsattr'].open();
			},
			// 关闭底部弹框
			closePop(res) {
				this.keyword_order_arr = ''
				this.setOrderList()
				this.$refs[res].close()
			},
			richtextHtml(html) {
				const regex = new RegExp('<img', 'gi');
				html = html.replace(regex, '<img class="title-img"');
				return html
			},
			connectSocketInit(v) {
				let that = this
				// 使用 connectId 区分不同连接，避免关闭旧 socket 后其 onClose 误触重连，同时保证新 socket 的 onError/onClose 能正常触发重连
				that.connectId = (that.connectId || 0) + 1
				const thisConnectId = that.connectId

				// 创建新连接前，关闭已有连接。重连时需延迟再建新连接，否则旧连接未完全释放会导致新连接卡在 pending
				const hadOldSocket = !!that.socketTask
				if (hadOldSocket) {
					that.socketTask.close({ success() {}, fail() {} })
					that.socketTask = null
				}
				const doConnect = () => {
				let url = 'wss://' + that.kefuLoginData.listen_route + '/socket'
				console.log('[WebSocket] 尝试连接:', url)
				that.socketTask = uni.connectSocket({
					url: url,
					success(data) {
						setTimeout(function() {
							if (v == 'join_ren') {
								that.isShowkefu = false
								that.isShowzhuanKefu = false
							}
							if (v == 'leave_ren') {
								that.isShowkefu = false
								that.isShowzhuanKefu = true
							}
						}, 500);
					},
				});

				// 消息的发送和接收必须在正常连接打开中
				that.socketTask.onOpen((res) => {
					console.log('[WebSocket] 长链成功，连接已就绪')
					that.hasConnectedBefore = true
					that.isManualClose = false
					that.socketReconnectCount = 0
					uni.hideLoading()
					that.disabledOne = false
					that.is_open_socket = true;
					let obj = {
						uid: that.kefuLoginData.user.user_id,
						name: that.kefuLoginData.user.user_name,
						avatar: that.kefuLoginData.user.avatar,
						store_id: that.store_id,
						user_type: 'customer',
						// type: 'join_ren',
						type: v,
						origin: 'app'
					}

					that.socketTask.send({
						data: JSON.stringify(obj),
						success: (send) => {
						}
					})

					// 客户端定时发送心跳，1.5 秒一次以更快检测断网（原 3 秒导致断网后约 5 秒才出重连提示）
					clearInterval(that.timer);
					that.timer = setInterval(function() {
						that.socketTask.send({
							data: '{"type":"ping"}',
							success() {
								// console.log("心跳");
							},
							fail() {
								that.is_open_socket = false
								clearInterval(that.timer)
								that.socketReconnectCount++
								if (that.socketReconnectCount >= that.socketReconnectMax) {
									uni.hideLoading()
									that.disabledOne = false
									that.showReconnectFailedModal()
									return
								}
								uni.showLoading({ title: '重连中...' })
								that.disabledOne = true
								setTimeout(function() {
									that.connectSocketInit(v)
								}, 2000)
							}
						});
					}, 1500);
				});

				that.socketTask.onError((err) => {
					if (that.isManualClose) return
					if (thisConnectId !== that.connectId) return
					console.log('[WebSocket] onError', err)
					that.is_open_socket = false
					clearInterval(that.timer)
					that.socketReconnectCount++
					if (that.socketReconnectCount >= that.socketReconnectMax) {
						uni.hideLoading()
						that.disabledOne = false
						that.showReconnectFailedModal()
						return
					}
					uni.showLoading({ title: '重连中...' })
					that.disabledOne = true
					setTimeout(function() {
						that.connectSocketInit(v)
					}, 2000)
				})

				that.socketTask.onClose((res) => {
					if (that.isManualClose) return
					if (thisConnectId !== that.connectId) return
					console.log('[WebSocket] onClose', res)
					that.is_open_socket = false
					clearInterval(that.timer)
					that.socketReconnectCount++
					if (that.socketReconnectCount >= that.socketReconnectMax) {
						uni.hideLoading()
						that.disabledOne = false
						that.showReconnectFailedModal()
						return
					}
					uni.showLoading({ title: '重连中...' })
					that.disabledOne = true
					setTimeout(function() {
						that.connectSocketInit(v)
					}, 2000)
				})

				// websocket接收消息
				that.socketTask.onMessage(function(res) {
					let info = JSON.parse(res.data);
					// console.log('info1', info)
					switch (info.message_type) {
						// 服务端ping客户端
						case 'ping':
							// console.log("心跳");
							that.socketTask.send({
								data: '{"type":"pong"}'
							});
							return;
							// 有客服登录
						case 'come':
							if (info.uid == that.kefuLoginData.user.user_id) return;
							return;
							//有客服登出
						case 'leave':
							if (info.uid == that.kefuLoginData.user.user_id || info.uid != '') return;
							return;
							//取得客服列表
						case 'init':
							console.log('取得客服列表')
							return;
							//取得状态
						case 'message_status':
							console.log('客服已读状态', )
							if (info.status == 0 && info.user_reply_type == 1) {
								let objaa = {
									type: "message_status",
									status: 0,
									to_id: that.store_id,
									user_type: 'customer',
									store_id: that.store_id,
									uid: that.uid
								}
								that.clickRequest(objaa)
							}
							return;
							//获取到消息
						case 'come_msg':
							console.log("消息接收", info)
							that.from_id = info.from_id ? info.from_id : null
							if (info.is_can_join == 1) {
								that.isShowkefu = true
								setTimeout(function() {
									that.sendAndCloseRequest('join_ren');
								}, 200);
								return;
							}
							if (info.user_reply_type == 1) {
								let objaa = {
									type: "message_status",
									status: 0,
									to_id: that.store_id,
									user_type: 'customer',
									store_id: that.store_id,
									uid: that.uid
								}
								that.clickRequest(objaa)
							}
							let message
							if (that.store_id == info.store_id) {
								if (info.msg_type == 1) {
									info.message = JSON.parse(info.message);
									// 更新聊天列表
									message = {
										message: info.message,
										avatar: info.avatar,
										name: info.name,
										time: info.time,
										user_type: info.user_type,
										to_user_id: that.from_id,
										status: info.status,
										msg_type: 1
									}
								} else if (info.msg_type == 2) {
									info.message = JSON.parse(info.message);
									info.isRate = false
									message = {
										message: info.message,
										avatar: info.avatar,
										name: info.name,
										time: info.time,
										user_type: info.user_type,
										to_user_id: that.from_id,
										status: info.status,
										msg_type: 2,
										id: info.id,
										score_rand: info.score_rand,
										service_id: info.service_id,
										isRate: false,
									}
									if (that.quesList.length < 1) {
										that.rateQues = info.message
										that.quesList = info.message[0].content
									}
								} else {
									// 更新聊天列表
									message = {
										message: info.message.replace(that.reg, that.emotion),
										avatar: info.avatar,
										name: info.name,
										time: info.time,
										user_type: info.user_type,
										to_user_id: that.from_id,
										status: info.status,
										score_rand: info.score_rand,
									}
								}
								that.list.push(message);
								that.$nextTick(function() {
									setTimeout(() => {
										that.listMove();
									}, 300)
								})
								if (info.isline == 0) {
									that.isShowkefu = false
									that.isShowzhuanKefu = true
								} else if (info.isline == 1) {
									that.rateValue = ''
									that.start_num = ''
									that.inques = []
									that.isShowkefu = false
									that.isShowzhuanKefu = false
									that.clearOut = setInterval(function() {
										uni.request({
											url: 'https://www.ok9288.com/api/chat/get_im_online',
											method: 'POST',
											header: {
												'Content-Type': 'application/json',
												'token': uni.getStorageSync('token'),
												'X-Client-Hash': uni.getStorageSync('client_hash')
											},
											data: {
												store_id: that.store_id,
												user_id: uni.getStorageSync('userInfo').id
											},
											success: (res) => {
												if (res.data.status == 'success') {
													that.status_one = res.data.data.status
													if (res.data.data.status == 0) {
														that.sendAndCloseRequest('leave_ren');
													}
												}
											}
										})
									}, 5000);
								}
							}
							return;
							//待接入消息
						case 'come_wait':
							console.log('待接入消息', info)
							that.from_id = info.from_id ? info.from_id : null

							// 更新聊天列表
							let message2 = {
								message: info.message.replace(that.reg, that.emotion),
								avatar: info.avatar,
								name: info.name,
								time: info.time,
								user_type: info.user_type,
								to_user_id: that.from_id,
								status: info.status
							}

							that.list.push(message2);

							return;
							//获取被抢客户
						case 'robbed':
							console.log('获取被抢客户')
							return;
							//通知用户已被接入
						case 'user_robbed':
							console.log('接入更新列表', info)
							//接入更新列表
							that.list.push({
								message: info.msg,
								avatar: info.avatar,
								name: info.name,
								time: info.time,
								user_type: "service",
								to_user_id: info.from_id ? info.from_id : null,
								status: info.status
							});
							console.log('通知用户已被接入');
							return;
							//用户已下线
						case 'uoffline':
							console.log('用户已下线')
							return;
							//客服已断开
						case 'close_link':
							console.log('客服已断开')
							return;
							//异地登录
						case 'others_login':
							console.log('异地登录')
							return;
							//切换客服
						case 'change_service':
							console.log('切换客服')
							return;
						case 'message_remove':
							console.log('消息回撤')
							console.log('status---', info)
							return;
						case 'set_kefu_score ':
							console.log('评分完成')
							// start_num
							return;
					}
				})
				};

				if (hadOldSocket) {
					setTimeout(doConnect, 600)
				} else {
					doConnect()
				}
			},
			// websocket接收消息（实际已在 connectSocketInit 中注册，此方法为兜底）
			onMessage() {
				if (!this.socketTask) return
				this.socketTask.onMessage(function(res) {
					console.log("接收消息")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				let that = this
				if (!that.socketTask) return
				that.isManualClose = true
				that.socketTask.close({
					success(res) {
						that.is_open_socket = false;
						clearInterval(that.timer);
						that.socketTask = null;
						console.log("关闭成功")
					},
					fail(err) {
						that.socketTask = null;
					}
				})
			},
			// 重连失败弹窗
			showReconnectFailedModal() {
				uni.hideLoading()
				this.disabledOne = false
				uni.showModal({
					title: '提示',
					content: '当前网络连接异常，请稍后重试',
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
			},
			//发送消息websocket
			clickRequest(obj) {
				let that = this
				if (that.is_open_socket) {
					that.socketTask.send({
						data: JSON.stringify(obj),
						
						async success(res) {
							console.log("消息发送成功", obj);
							uni.setStorageSync("newchatMsg", true);
							obj.isFail = 0
							if (obj.status == 0) {
								that.list.forEach(function(item) {
									item.status = 0;
								});
							}
						},
						fail(error) {
							console.log("消息发送失败", obj);
							obj.isFail = 1
							const listItem = that.list.find(item => item.score_rand === obj.score_rand)
							if (listItem) listItem.isFail = 1
							that.is_open_socket = false
							clearInterval(that.timer)
							that.socketReconnectCount++
							if (that.socketReconnectCount >= that.socketReconnectMax) {
								uni.hideLoading()
								that.disabledOne = false
								that.showReconnectFailedModal()
								return
							}
							uni.showLoading({ title: '重连中...' })
							that.disabledOne = true
							setTimeout(function() {
								that.connectSocketInit('login')
							}, 2000)
						}
					});
				}
			},
			//发送消息websocket
			sendAndCloseRequest(v) {
				let that = this
				let obj = {
					uid: that.kefuLoginData.user.user_id,
					name: that.kefuLoginData.user.user_name,
					avatar: that.kefuLoginData.user.avatar,
					store_id: that.store_id,
					user_type: 'customer',
					// type: 'join_ren',
					type: v,
					origin: 'app',
					version: 1,
					message_type: "message_status",
					status: 0,
					to_id: that.kefuLoginData.services_id,
					user_type: 'customer',
				}
				if (that.is_open_socket) {
					that.socketTask.send({
						data: JSON.stringify(obj),
						async success(res) {
							console.log("成功");
						},
					});
				}

				if (v == 'join_ren') {
					that.isShowkefu = false
					that.isShowzhuanKefu = false
					that.status_one = 1
				}
				if (v == 'leave_ren') {
					that.isShowkefu = false
					that.isShowzhuanKefu = true
					that.status_one = 0
					clearInterval(that.clearOut);
				}
			},
			// 聊天列表
			chatList() {
				var that = this
				uni.request({
					url: 'https://www.ok9288.com/api/chat/appSingleChatListnew',
					// url: 'https://www.ok9288.com/api/chat/app_single_chat_list',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					data: {
						user_type: this.user_type,
						type: this.type,
						// store_id:'10116',
						store_id: this.store_id,
						page: this.page,
						type: true,
						app_version: this.version,
					},
					success: (res) => {
						if (res.error == 1) {
							uni.showToast({
								title: '没有历史记录了',
								icon: 'none'
							})
							return false
						}
						let objaa = {
							type: "message_status",
							status: 0,
							to_id: that.store_id,
							user_type: 'customer',
							store_id: that.store_id,
							uid: that.uid
						}
						that.clickRequest(objaa)
						for (var i = 0; i < res.data.length; i++) {
							res.data[i].isFail = 0
							if (res.data[i].msg_type == 1) {
								res.data[i].message = JSON.parse(res.data[i].message);
							} else if (res.data[i].msg_type == 2) {
								let str = res.data[i].message;
								if (str.includes("\\")) {
									let data = JSON.parse(str);
									that.rateQues = data
									//是否评价已经
									if (data[0].is_has_score && data[0].is_has_score == 1) {
										res.data[i].score = data[0].score
									} else {
										this.quesList = data[0].content
									}
								}
							}
						}
						if (res.data.length > 0) {
							// 组装商品详情信息到聊天列表
							// this.list = list.reverse();
							this.list = (this.list.concat(res.data)).reverse()
							if (this.goods_id > 0) {
								this.list.push(this.kefuLoginData.goods);
							}
							this.page = this.page + 1
							this.scrollToBottom()
							// this.$nextTick(function() {
							// 	this.listMove();
							// });
							// if (that.sendList) {
							// 	console.log(9999, that.sendList);
							// } else {
							// 	console.log(8888);
							// }
						} else {
							if (this.goods_id > 0) {
								this.list.push(this.kefuLoginData.goods);
							} else {
								this.list = []
							}
						}
					}
				})
			},
			// 聊天列表跟随滚动操作
			listMove() {
				this.$nextTick(function() {
					let view = uni.createSelectorQuery().in(this).select(".user-consult");
					view.fields({
						size: true
					}, data => {
						if (data && data.height) {
							this.scrollTop = data.height;
						}
					}).exec();
				})
			},
			// 查看更多
			moreMessage() {
				const list = this.$store.dispatch('setKefuSingleChatList', {
					page: this.page,
					user_type: this.user_type,
					store_id: this.store_id,
					default: this.default,
					type: true
				})

				list.forEach(v => {
					this.list.unshift(v);
				})

				this.page = this.page + 1;

				this.$nextTick(function() {
					this.scrollTop = 0;
				})
			},
			// 发送消息（未连接时禁止虚假发送，必须等 WebSocket 重连成功）
			btnSubmit() {
				let that = this
				if (!that.is_open_socket) {
					const msg = that.hasConnectedBefore ? '网络连接已断开，请稍候重试' : '正在连接，请稍候'
					uni.showToast({ title: msg, icon: 'none' })
					return
				}
				if (that.comment == '' || that.comment == null) {
					uni.showToast({
						title: '发送消息不能为空',
						icon: 'none'
					})
					return false
				}
				if (that.isSending) return
				that.isSending = true

				const timeStamp = new Date().getTime();
				const trimmedTimeStamp = Math.floor(timeStamp / 1000);
				const seededRandom = (seed) => {
					const x = Math.sin(seed) * 10000;
					return x - Math.floor(x);
				};
				let randomNum = Math.floor(seededRandom(trimmedTimeStamp) * 900 + 100);
				this.scorerand = `${trimmedTimeStamp}${randomNum}`;

				uni.showLoading({
					title: '发送中...'
				});
				for (var i = 0; i < that.mateKeywordsList.length; i++) {
					if (that.comment.indexOf(that.mateKeywordsList[i]) >= 0) {
						that.status_one = 1
					}
				}

				//发送消息
				let obj = {
					msg: that.comment.replace(that.reg, that.emotion),
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					goods_id: that.goods_id,
					store_id: that.store_id,
					uname: that.kefuLoginData.user.user_name,
					origin: 'app',
					v: "v1",
					status_one: that.status_one,
					isFail: that.isFail,
					score_rand: this.scorerand
				}
				that.clickRequest(obj);
				// 更新聊天列表
				let message = {
					message: that.comment.replace(that.reg, that.emotion),
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.user_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 1,
					isFail: obj.isFail,
					score_rand: this.scorerand
					// status: 0
				}
				if (message.isFail == 0) {
					that.list.push(message);
				}
				if (message.isFail !== 0) {
					that.sendList.push(message);
					console.log('失败sendlist', that.sendList)
					uni.setStorageSync("sendList", that.sendList);
				}

				//清空输入框内
				uni.hideLoading();
				that.comment = ''

				//关闭表情窗
				that.showPannel = false;
				that.setScrollH();
				that.$nextTick(function() {
					that.listMove();
				})

				setTimeout(() => {
					that.isSending = false
				}, 250)
			},

			// 发送商品链接
			sub_send(item) {
				let that = this;

				uni.showLoading({
					title: '发送中...'
				});

				let obj = {
					msg: that.kefuLoginData.goods.url,
					goods: that.kefuLoginData.goods,
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					goods_id: item,
					store_id: that.store_id,
					origin: uni.getStorageSync('platform')
				}

				that.clickRequest(obj);

				// 更新聊天列表
				let message = {
					message: '',
					goods: that.kefuLoginData.goods,
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.nick_name,
					time: that.$formatDateTime(that.$getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 0,
					isFail: 0
				}

				that.list.push(message);

				uni.hideLoading();

				this.setScrollH();
				this.$nextTick(function() {
					this.listMove();
				})
			},

			// sendMsg(msg,type,url,path) {
			// 	let that = this;
			// 	uni.showLoading({
			// 		title: '发送中...'
			// 	});
			// 	if(type == 1) {
			// 		const videoMsg = {
			// 		msg_type: 'video', // 明确消息类型
			// 		url: url,
			// 		thumb: path,
			// 		id: `video_${Date.now()}`,
			// 		time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
			// 		name: this.kefuLoginData.user.nick_name,
			// 		avatar: this.kefuLoginData.user.avatar,
			// 		user_type: 2,
			// 		status: 0
			// 		};
					
			// 		// // 添加到消息列表
			// 		  this.list.push(videoMsg);
			// 		let obj = {
			// 			msg: JSON.stringify(videoMsg),
			// 			goods: this.kefuLoginData.goods,
			// 			type: 'sendmsg',
			// 			to_id: this.kefuLoginData.services_id,
			// 			avatar: this.kefuLoginData.user.avatar,
			// 			goods_id:  that.goods_id,
			// 			store_id: this.store_id,
			// 			origin: uni.getStorageSync('platform')
			// 		}
					
			// 		this.clickRequest(obj);
			// 	}else {
			// 		//发送消息
			// 		let obj = {
			// 			msg: msg,
			// 			type: 'sendmsg',
			// 			to_id: that.kefuLoginData.services_id,
			// 			avatar: that.kefuLoginData.user.avatar,
			// 			uname: that.kefuLoginData.user.user_name,
			// 			goods_id: that.goods_id,
			// 			store_id: that.store_id,
			// 			origin: 'app',
			// 			v: "v1",
			// 			status_one: that.status_one
			// 		}
			// 		that.clickRequest(obj);
			// 		// 更新聊天列表
			// 		let message = {
			// 			message: msg,
			// 			goods: that.kefuLoginData.goods,
			// 			avatar: that.kefuLoginData.user.avatar,
			// 			name: that.kefuLoginData.user.nick_name,
			// 			time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
			// 			user_type: 2,
			// 			to_user_id: that.from_id,
			// 			status: 0,
			// 		}
					
			// 		that.list.push(message);
			// 		uni.hideLoading();
					
			// 		that.comment = '';
			// 		this.$nextTick(function() {
			// 			this.listMove();
			// 		})
			// 	}
				
			// },
			sendMsg(html, type, videoUrl, thumbPath) {
			  // 构建完整的消息对象
			  const message = {
			    message: html,
			    msg_type: 'video',
			    video_url: videoUrl,
			    video_thumb: thumbPath,
			    time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
			    name: this.kefuLoginData.user.nick_name,
			    avatar: this.kefuLoginData.user.avatar,
			    user_type: 2,
			    status: 1, // 发送中
			    isFail: 0
			  };
			  
			  // 添加到本地列表
			  this.list.push(message);
			  
			  // 构建发送给WebSocket的对象
			  const wsMessage = {
			    msg: html,
			    type: 'sendmsg',
			    to_id: this.kefuLoginData.services_id,
			    avatar: this.kefuLoginData.user.avatar,
			    goods_id: this.goods_id,
			    store_id: this.store_id,
			    origin: uni.getStorageSync('platform'),
			    status_one: this.status_one,
			    video_url: videoUrl, // 额外发送原始URL
			    video_thumb: thumbPath // 额外发送缩略图
			  };
			  
			  // 通过WebSocket发送
			  this.clickRequest(wsMessage);
			  
			  this.$nextTick(() => {
			    this.listMove();
			  });
			},
			tofasong(item) {
				var that = this
				that.$refs['goodsattr'].close();
				let obj = {
					msg: item.title,
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					uname: that.kefuLoginData.user.user_name,
					goods_id: that.goods_id,
					store_id: that.store_id,
					origin: 'app',
					v: "v1",
					v_type: 'v_' + item.id,
					status_one: that.status_one
				}
				that.clickRequest(obj);
				// 更新聊天列表
				let message = {
					message: item.title,
					goods: that.kefuLoginData.goods,
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.nick_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 1,
					isFail: 0
				}

				that.list.push(message);
				uni.hideLoading();

				that.comment = '';

				this.$nextTick(function() {
					this.listMove();
				})
			},
			// 发送图片加载完成
			allImgReady() {
				this.$nextTick(function() {
					this.listMove();
				})
			},
			//发送图片
			async chooseImage() {
				var that = this
				// #ifdef H5
				uni.showToast({
					title: '请选择2MB以下的图片',
					icon: 'none'
				});
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							uni.request({
								url: 'https://www.ok9288.com/api/user/material',
								method: 'POST',
								data: {
									file: {
										content: base64
									},
									type: 'touxian'
								},
								header: {
									'Content-Type': 'application/json'
								},
								success: (res1) => {
									if (res1.statusCode == 200) {
										that.img = '<img class="title-img" src="' +
											res1
											.data.data[0] + '" />'
										that.sendMsg(that.img);
									}
								}
							})
						}).catch(error => {
							// console.error(error, 5);
						});
					}
				})
				// #endif

				// #ifdef APP-PLUS
				var result = await permision.premissionCheck("CAMERA_EXTERNAL_STORAGE")
				if (result == 1) {
					// 此处处理各自业务 如：uni.chooseImage 
					uni.showToast({
						title: '请选择2MB以下的图片',
						icon: 'none'
					});

					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],
						success: (res) => {
							pathToBase64(res.tempFilePaths[0]).then(base64 => {
								uni.request({
									url: 'https://www.ok9288.com/api/user/material',
									method: 'POST',
									data: {
										file: {
											content: base64
										},
										type: 'touxian'
									},
									header: {
										'Content-Type': 'application/json'
									},
									success: (res1) => {
										if (res1.statusCode == 200) {
											that.img = '<img class="title-img" src="' +
												res1
												.data.data[0] + '" />'
											that.sendMsg(that.img);
										}
									}
								})
							}).catch(error => {
								// console.error(error, 5);
							});
						}
					})
				}
				// #endif

				// #ifdef MP-WEIXIN
				uni.showToast({
					title: '请选择2MB以下的图片',
					icon: 'none'
				});

				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {

						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							uni.request({
								url: 'https://www.ok9288.com/api/user/material',
								method: 'POST',
								data: {
									file: {
										content: base64
									},
									type: 'touxian'
								},
								header: {
									'Content-Type': 'application/json'
								},
								success: (res1) => {
									if (res1.statusCode == 200) {
										that.img = '<img class="title-img" src="' +
											res1
											.data.data[0] + '" />'
										that.sendMsg(that.img);
									}
								}
							})
						}).catch(error => {
						});
					}
				})
				// #endif

			},
			navigateBack: function() {
				uni.navigateBack()
			},
			photo_showNo: function() {
				this.photo_show = false
				// uni.navigateBack()
			},
			photo_showYes: function() {
				var that = this
				that.photo_show = false
				uni.setStorageSync("photo_1", true);
				uni.showToast({
					title: '请选择2MB以下的图片',
					icon: 'none'
				});

				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							uni.request({
								url: 'https://www.ok9288.com/api/user/material',
								method: 'POST',
								data: {
									file: {
										content: base64
									},
									type: 'touxian'
								},
								header: {
									'Content-Type': 'application/json'
								},
								success: (res1) => {
									if (res1.statusCode == 200) {
										that.img = '<img class="title-img" src="' +
											res1
											.data.data[0] + '" />'
										that.sendMsg(that.img);
									}
								}
							})
						}).catch(error => {
							// console.error(error, 5);
						});
					}
				})
			},

			toshowReport: function() {
				var that = this
				that.report_show = true
			},
			report_showYes: function() {
				var that = this
				if (that.title == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入举报内容！'
					})
				} else {
					that.report_show = false
					uni.showLoading({
						title: '提交中~'
					})
					setTimeout(function() {
						uni.showToast({
							icon: 'none',
							title: '举报内容已提交！'
						})
					}, 1000);
				}
			},

			report_showNo: function() {
				var that = this
				that.report_show = false
			},
			//展示表情
			show() {
				this.showPannel = !this.showPannel;
				this.isInputVisible = true


				this.$nextTick(function() {
					this.listMove();
				})
				this.setScrollH()
				// if(this.showPannel == false){
				// 	this.style.contentViewHeight = 0
				// }
			},
			emotion(res) {
				let word = res.replace(/\#|\;/gi, '')
				const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过',
					'酷',
					'冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘',
					'晕', '折磨', '衰',
					'骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲',
					'吓', '可怜',
					'菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀',
					'足球', '瓢虫',
					'便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情',
					'飞吻', '跳跳',
					'发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'
				]
				let index = list.indexOf(word)
				return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
			},
			handleEmotion(i) {
				this.comment += i
			},
			// 设置高度 用emit辅助
			setScrollH() {
				let that = this
				var query = uni.createSelectorQuery();
				let footh = query.select('.kefu-bottom');
				const res = uni.getSystemInfoSync();
				that.$nextTick(function() {
					footh.fields({
						size: true
					}, data => {
						if (data && data.height) {
							footh = data.height;
							that.style.contentViewHeight = that.style.pageHeight - footh; //像素
						}
					}).exec();
				})
			},
			consultH() {
				let that = this
				var query = uni.createSelectorQuery();
				let footh = query.select('.user-consult');
				that.$nextTick(function() {
					footh.fields({
						size: true
					}, data => {
						if (data && data.height) {
							that.style.consultHeight = data.height;
							if (data.height > that.style.contentViewHeight) {
								that.scrollTop = data.height - that.style.contentViewHeight
							}
						}
					}).exec();
				})
			},
			goodsLink(id) {
				return
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			},

			toTurnKefu() {
				var that = this
				that.isShowkefu = true
				setTimeout(function() {
					that.sendAndCloseRequest('join_ren');
					//发送消息
					let obj = {
						msg: '人工客服',
						type: 'sendmsg',
						to_id: that.kefuLoginData.services_id,
						avatar: that.kefuLoginData.user.avatar,
						goods_id: that.goods_id,
						store_id: that.store_id,
						uname: that.kefuLoginData.user.user_name,
						origin: 'app',
						v: "v1",
						status_one: 1,
					}
					that.clickRequest(obj);
					// 更新聊天列表
					let message = {
						message: '人工客服',
						avatar: that.kefuLoginData.user.avatar,
						name: that.kefuLoginData.user.user_name,
						time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
						user_type: 2,
						to_user_id: that.from_id,
						status: 1,
						isFail: 0
					}
					that.list.push(message);

					//清空输入框内
					uni.hideLoading();
					that.comment = ''

					//关闭表情窗
					that.showPannel = false;
					// that.setScrollH();
					that.$nextTick(function() {
						that.listMove();
					})
				}, 200);
			},
			toCloseKefu() {
				var that = this
				that.kefuShows = true
			},
			kefuShowsOff() {
				var that = this
				that.kefuShows = false
			},
			kefuShowsOn() {
				var that = this
				that.kefuShows = false
				that.sendAndCloseRequest('leave_ren');
			},

			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
			toOrderfasong(item) {
				var that = this
				that.faOrder = item
				that.$refs['orderattr'].close();
				that.orderShows = true
			},

			orderShowsOff() {
				var that = this
				that.orderShows = false
			},

			orderShowsOn() {
				var that = this
				//发送消息
				let obj = {
					order_id: that.faOrder.order_id,
					msg: '',
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					goods_id: that.goods_id || '',
					store_id: that.store_id,
					uname: that.kefuLoginData.user.user_name,
					origin: 'app',
					status_one: 1
				}
				that.clickRequest(obj);

				// 更新聊天列表
				let message_1 = {
					order_type: 111,
					order_sn: that.faOrder.order_sn,
					add_time: that.faOrder.add_time,
					consignee: that.faOrder.consignee,
					order_status: that.faOrder.order_status,
					total_amount_formated: that.faOrder.total_amount_formated,
				}
				let message = {
					message: message_1,
					order_type: 111,
					goods: that.kefuLoginData.goods,
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.nick_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 0,
					isFail: 0
				}
				that.list.push(message);
				
				uni.hideLoading();
				that.orderShows = false
				that.comment = '';

				this.$nextTick(function() {
					this.listMove();
				})
			},

			isChange: function() {
				var that = this
				that.isDefine = 1
				that.revertShow = false
				// that.report_show = true
				// /pagesC/report/report?id=${this.goodsId}
				uni.navigateTo({
					url: '/pagesC/report/report?id=' + this.goodsId
				})
			},
			isChanges: function() {
				var that = this
				that.isDefine = 2
				that.revertShow = false
				uni.showToast({
					icon: 'none',
					title: '即将跳转平台客服...'
				})
				setTimeout(function() {
					uni.request({
						url: that.websiteUrl + '/api/user/touch_nav_kefu',
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash': uni.getStorageSync('client_hash')
						},
						success: (res) => {
							uni.redirectTo({
								url: res.data.data.url
							})
						}
					})
				}, 500);
			},

			tommoving: function() {
				var that = this
				that.revertShow = true
			},
			revertShowNo: function() {
				var that = this
				that.revertShow = false
			},
			navigateBack: function() {
				uni.navigateBack()
			},
			toshowReport: function() {
				var that = this
				that.report_show = true
			},
			report_showYes: function() {
				var that = this
				if (that.title == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入举报内容！'
					})
				} else {
					that.report_show = false
					uni.showLoading({
						title: '提交中~'
					})
					setTimeout(function() {
						uni.showToast({
							icon: 'none',
							title: '举报内容已提交！'
						})
					}, 1000);
				}
			},

			report_showNo: function() {
				var that = this
				that.report_show = false
			},
			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
			scrollToBottom() {
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 200000000000,
						duration: 0
					});
				}, 100);
			},
		}
	}
</script>

<style lang="scss">
	.tank {}

	.tank-con {}

	.user-consult {
		padding: 20upx 20upx 30upx;
		transform: translateZ(0);
	}

	.user-consult .user-item {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		// align-items: center;
		margin-bottom: 30upx;
	}

	.user-consult .user-item:last-child {
		margin-bottom: 0;
	}

	.user-consult .user-item .left {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		margin-right: 20upx;
	}

	.user-consult .user-item .left .name {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.user-consult .user-item .left .name .txt {
		font-size: 28upx;
		color: #333;
		font-weight: bold;
		max-width: 350rpx;
		margin-right: 10upx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.user-consult .user-item .left .name .time {
		font-size: 25upx;
		color: #999;
	}

	.user-consult .user-item .left .cons-cont {
		display: flex;
		justify-content: flex-end;
	}

	.user-consult .user-item .left .cons-cont .text {
		padding: 20upx 20upx;
		color: #333333;
		border-radius: 10upx;
		background: #e7e8ef;
		display: inline-block;
		font-size: 26upx;
		position: relative;
	}

	.user-consult .user-item .left .cons-cont .text .sendyes {
		background-color: #000000;
		height: 100rpx;
		width: 100rpx;
		position: absolute;
		left: 0;
		top: 10%;
	}

	.user-consult .user-item .right {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-consult .user-item .right image {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-consult .user-item-admin {
		justify-content: flex-start;
	}

	.user-consult .user-item-admin .left {
		margin: 0 0 0 20upx;
		flex: 1;
	}

	.user-consult .user-item-admin .left .cons-cont {
		justify-content: flex-start;
	}

	.user-consult .user-item-admin .left .cons-cont .text {
		background: #f1cdcea3;
	}

	.kefu-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		box-sizing: border-box;
		background: #f6f6f6;
		border-top: 1px solid #f6f6f6;
	}

	/* iOS风格底部输入栏 */
	.kefu-bottom .footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #F7F7F7;
		padding: 16rpx 20rpx;
		/* #ifdef H5 */
		padding-bottom: 20rpx;
		/* #endif */
		/* #ifndef H5 */
		padding-bottom: 40rpx;
		/* #endif */
		/* iOS风格轻微阴影 */
		border-top: 1rpx solid rgba(0, 0, 0, 0.05);
	}

	/* 图标按钮 - iOS风格 */
	.kefu-bottom .footer-icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 12rpx;
		transition: background-color 0.2s;
		/* iOS点击反馈效果 */
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
	}

	.kefu-bottom .footer-icon-btn:active {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.kefu-bottom .footer-icon {
		width: 48rpx;
		height: 48rpx;
	}

	/* 右侧功能按钮组 */
	.kefu-bottom .footer-right-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		margin-left: 12rpx;
	}

	/* 输入框 - iOS风格 */
	.kefu-bottom .text-input {
		flex: 1;
		background: #FFFFFF;
		height: 72rpx;
		display: flex;
		align-items: center;
		border-radius: 24rpx;
		margin: 0 12rpx;
		/* iOS风格轻微阴影 */
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04);
		border: 1rpx solid rgba(0, 0, 0, 0.06);
	}

	.kefu-bottom .text-input .write-input {
		width: 100%;
		height: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333333;
		line-height: 1.5;
	}

	.kefu-bottom .send-button {
		margin-left: 25upx;
	}

	.kefu-bottom .send-button .send-btn {
		background-color: #FFE41C;
		color: #000000;
		height: 70upx;
		line-height: 70upx;
		font-size: 28rpx;
		padding: 0 20upx;
		border-radius: 10upx;
		margin-right: 25upx;
	}

	rich-text {
		.new_message_list {
			display: flex;

			.title-img {
				max-width: 180upx;
				max-height: 180upx;
			}

			.left_goods_info {
				margin-left: 20upx;
				word-wrap: break-word;
				white-space: normal;
				word-break: break-all;

				span {
					margin-top: 20upx;
				}
			}
		}
	}

	.goods_link {
		margin: 10upx;
		padding: 20upx;
		background-color: #E7E8EF;
		display: flex;
		border-radius: 10upx;
		width: 100%;

		.goods_link_left {
			line-height: 0;
			font-size: 0;

			image {
				max-width: 180upx;
				max-height: 180upx;
			}
		}

		.goods_link_right {
			flex: 1;
			margin-left: 20upx;
			display: flex;
			flex-flow: column;
			justify-content: space-between;

			.goods_link_right_footer {
				display: flex;
				justify-content: space-between;
			}

			.send_link {
				padding: 2rpx 30rpx;
				background-color: #ff0000;
				color: #fff;
				border-radius: 30upx;
			}
		}
	}

	.kefu_center_1 {
		font-size: 28rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 20rpx 30rpx;
		padding: 20rpx 30rpx;
	}

	.kefu_center_2 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.kefu_center_3 {
		padding: 8rpx 24rpx;
		background-color: #f2f2f2;
		color: #757575;
		font-size: 24rpx;
		border-radius: 50rpx;
	}

	.kefu_center_4 {
		font-size: 30rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		// display: -webkit-box;
		-webkit-box-orient: vertical;
		width: 95%;
		margin-right: 10rpx;
	}

	.kefu_center_4_1 {
		font-size: 30rpx;
		margin-right: 10rpx;
	}

	.kefu_center_4_1_2 {
		font-size: 28rpx;
		margin-right: 10rpx;
	}

	.kefu_center_5 {
		width: 100%;
		background-color: #EDEDED;
		height: 2rpx;
		margin-top: 20rpx;
	}

	.kefu_center_6 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 30rpx;
	}

	.kefu_center_7 {
		// font-size: 28rpx;
		// border: 2rpx solid #FFBC29;
		// border-radius: 50rpx;
		// background-color: #FFFFFF;
		padding: 10rpx 0 0 40rpx;
	}

	.pop_content {
		// padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;
	}

	/* 优惠弹框 end */

	/* 商品属性弹框 start */
	.goods_attr_pop {
		position: relative;
		padding: 30rpx 30rpx 0 30rpx;

		.close_img {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			width: 70rpx;
			height: 70rpx;
		}

		.goods_info {
			display: flex;
		}
	}

	.search_1 {
		background-color: #ffffff;
		border: 2rpx solid #626262;
		color: #191919;
		margin: 30rpx;
		border-radius: 40rpx;
		padding: 0 30rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	.search_area {
		width: 80%;
		color: #333;
		font-size: 28rpx;
		height: 60rpx;
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
		z-index: 9999;
		opacity: 0.2;
	}


	.wxshare {
		text-align: center;
		border-radius: 20rpx;
		width: 80%;
		background: linear-gradient(to bottom, #f2e6e6 10%, #ffffff 40%, #ffffff 50%);
		position: fixed;
		top: 36%;
		left: 10%;
		z-index: 9999;
	}


	.wxshare_2_1 {
		margin-top: 50rpx;
		margin-bottom: 100rpx;
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

	.notice_1 {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: 80px;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: 95px;
		/* #endif */
		/* #ifdef H5 */
		top: 60px;
		/* #endif */
		width: 100%;
		z-index: 9999;
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

	.graying {
		color: #000000;
		font-size: 28rpx;
	}

	.darking {
		color: #FE0302;
		font-size: 28rpx;
	}

	/* 顶部导航栏开始 */
	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #f8f8f8;
	}


	.search_submit {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.search_1_1 {
		color: #191919;
		margin: 10rpx 20rpx 20rpx 40rpx;
		font-size: 32rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		text-align: center;
		text-align: center;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
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
		width: 72%;
		padding: 0rpx 20rpx 10rpx 30rpx;
		/* #endif */
	}

	/* 顶部导航栏 end */
	.rateone {
		width: 360rpx;
		height: 24rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #828282;
		line-height: 24rpx;
		text-align: center;
		margin: 10rpx 0 16rpx 0rpx;
	}

	.rateview {
		width: 480rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 400;

		.tip {
			font-size: 28rpx;
			color: #1B1B1B;
			line-height: 44rpx;
			text-align: left;
			margin: 10px 0rpx 0;
		}
	}

	.ratecon {
		text-align: center;
		max-width: 480rpx;
		width: 480rpx;
		background: #F9F9F9;
		border-radius: 16rpx;

		.title {
			font-weight: 500;
			font-size: 28rpx;
			color: #1B1B1B;
			line-height: 28rpx;
			text-align: center;
			font-style: normal;
		}

		.ratecss {
			margin: 32rpx 0;
		}

		.queslist {
			margin: 32rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap
		}

		.scorecss {
			font-weight: 400;
			font-size: 24rpx;
			color: #828282;
			line-height: 24rpx;
		}

		.quescss {
			width: 200rpx;
			height: 64rpx;
			background: #FFFFFF;
			border-radius: 32rpx;
			border: 1rpx solid #C0C0C0;
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 64rpx;
			margin-bottom: 16rpx;
		}

		.active {
			width: 200rpx;
			height: 64rpx;
			background: #FFFFFF;
			border-radius: 32rpx;
			border: 1rpx solid #C0C0C0;
			font-weight: 400;
			font-size: 24rpx;
			line-height: 64rpx;
			margin-bottom: 16rpx;
			background-color: #C0C0C0;
			color: #ffffff;
		}

		.subbtn {
			width: 280rpx;
			height: 88rpx;
			background: #FE0302;
			box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(192, 192, 192, 0.15);
			border-radius: 44rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}


	.addInfo {
		text-align: center;
		max-width: 480rpx;
		width: 480rpx;
		border-radius: 16rpx;

		.title {
			text-align: left;
			font-size: 32rpx;
			font-weight: 500;
		}

		.addrbtn {
			background-color: red;
			width: 140rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 20px;
			color: #ffffff;
			font-size: 30rpx;
		}

		.addrbtn-dis {
			background-color: #f5f5f5;
			width: 140rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 20px;
			color: #878787;
			font-size: 30rpx;
		}
	}

	.onMore {
		text-align: center;
		color: #888888;
		height: 50rpx;
		/* #ifdef APP-PLUS */
		margin-top: 100rpx;
		/* #endif */
		/* #ifdef H5 */
		margin-top: 80rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin-top: 100rpx;
		/* #endif */

	}

	.isread {
		color: #999999;
		font-size: 28rpx;
		display: flex;
		align-items: center;

	}

	.sendimg {
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.readno {
		color: #F45901;
	}

	.domain::after {
		content: '';
		position: absolute;
		bottom: -10px;
		/* 调整箭头位置 */
		right: 10px;
		/* 调整箭头水平位置 */
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid #4c4c4c;
		/* 箭头颜色与弹窗背景色一致 */
	}

	.flex-left {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		text-align: left;
	}

	.goods-link {
		transition: opacity 0.2s;
	}

	.goods-link:active {
		opacity: 0.7;
	}

	/* 全局播放器 */
	/* 视频消息容器 */
	.video-message-container {
		width: 280rpx;
		height: 400rpx;
		margin: 15rpx 0;
		border-radius: 12rpx;
		overflow: hidden;
		background: #000;

		.video-thumb {
			position: relative;
			width: 100%;
			height: 100%;

			image:first-child {
				width: 100%;
				height: 100%;
				opacity: 0.95;
			}

			.play-overlay {
				position: absolute;
				width: 60rpx;
				height: 60rpx;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 2;
			}
		}
	}



	/* 全局播放器容器 */
	.global-fullscreen-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000;
		z-index: 99999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 视频元素 */
	.fullscreen-video-element {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	/* 统一控制层 */
	.universal-control-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	/* 控制栏 */
	.control-bar {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background: rgba(0, 0, 0, 0.6);
		z-index: 3;
	}

	/* 顶部控制栏 */
	.top-bar {
		justify-content: flex-start;
	}

	/* 底部控制栏 */
	.bottom-bar {
		justify-content: center;
	}

	/* 关闭按钮 */
	.close-button {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		// background: rgba(255, 255, 255, 0.2);
		// border-radius: 40rpx;
		z-index: 99999999;
	}

	.close-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.close-text {
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
	}

	/* 控制按钮 */
	.control-button {
		width: 80rpx;
		height: 80rpx;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.control-icon {
		width: 50rpx;
		height: 50rpx;
	}

	/* 进度控制容器 */
	.progress-control-container {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 150rpx;
		z-index: 3;
		background: rgba(0, 0, 0, 0.5);
		padding: 15rpx;
		border-radius: 10rpx;
	}

	/* 进度条 */
	.progress-slider {
		width: 100%;
	}

	/* 时间显示 */
	.time-display {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
		color: #fff;
		font-size: 24rpx;
	}

	/* 手势提示 */
	.swipe-hint {
		position: absolute;
		top: 20%;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 4;
	}

	.swipe-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}

	.hint-text {
		color: #fff;
		font-size: 28rpx;
	}

	/* 系统播放器覆盖层 */
	.system-player-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100000;
		background: rgba(0, 0, 0, 0.5);
	}

	/* 系统播放器关闭按钮 */
	.system-close-button {
		position: absolute;
		top: 40px;
		right: 20px;
		z-index: 100001;
		display: flex;
		align-items: center;
		padding: 8px 16px;
		background: rgba(0, 0, 0, 0.7);
		border-radius: 20px;
	}

	.close-icon {
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}

	.close-text {
		color: #fff;
		font-size: 16px;
		font-weight: bold;
	}

	/* 隐藏系统播放器控件 */
	video::-webkit-media-controls {
		display: none !important;
	}

	.custom-controls {
		position: absolute;
		top: 100rpx;
		left: 40rpx;

		z-index: 9999999;
		/* 虽无法高于原生组件，但对 cover-view 有效 */
	}

	.close-btn {
		width: 50rpx;
		height: 50rpx;
		z-index: 99999991;
	}
</style>