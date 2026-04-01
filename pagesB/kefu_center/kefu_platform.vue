<template>
	<view>
		<view class="tank">
			<scroll-view class="tank-con" scroll-y="true" :style="{height:style.contentViewHeight+'px'}"
				:scroll-top="scrollTop">
				<view class="notice_1" v-if="notice">
					<uni-notice-bar :speed='60' show-icon scrollable :text="notice" />
				</view>
				<view style="height: 80rpx;" v-if="notice"></view>
				<view class="kefu_center_1" v-if="synArr.length > 0">
					<view class="kefu_center_2">
						<view style="font-weight: bold;font-size: 30rpx;">常见问题</view>
					</view>
					<view class="kefu_center_5"></view>
					<view v-for="(item,index) in synArr" :key="index">
						<view class="kefu_center_2" v-if="index<5" style="margin: 18rpx 0;" @click="tofasong(item)">
							<view class="kefu_center_4"><text style="margin-right: 10rpx;color:#F45901;">{{index+1}}.</text>{{item.title}}</view>
							<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png" style="height: 30rpx;width: 20rpx;"></image>
						</view>
					</view>
					<view style="color: #999999;text-align: center;" v-if="synArr.length > 5" @click="toShowMore">查看更多</view>
				</view>
				<view class="user-consult">
					<view class="user-item"
						:class="{'user-item-admin':item.user_type == 1 || item.user_type == 'service'}"
						v-for="(item,index) in list" :key="index" v-if="list.length > 0">
						<block v-if="item.goods_id">
							<!-- 商品详情 -->
							<view class="goods_link">
								<view class="goods_link_left">
									<image :src="kefuLoginData.goods.goods_thumb" mode=""></image>
								</view>
								<view class="goods_link_right">
									<view class="goods_link_right_name twolist-hidden">{{kefuLoginData.goods.goods_name}}</view>
									<view class="goods_link_right_footer">
										<currency-price :price="kefuLoginData.goods.shop_price" :size="18"></currency-price>
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
										<view v-for="(item_one,index_one) in item.message" :key="index_one" @click="tofasong(item_one)">
											<view class="kefu_center_2">
												<view class="kefu_center_4_1"><text style="margin-right: 10rpx;color:#F45901;">{{index_one+1}}.</text>{{item_one.title}}</view>
												<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png" style="height: 30rpx;width: 20rpx;"></image>
											</view>
											<view v-if="index_one < item.message.length -1" style="height: 20rpx;"></view>
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
											<view class="kefu_center_4_1_2">订 单 金 额：{{item.message.total_amount_formated}}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="right">
								<image :src="item.avatar" class="img"></image>
							</view>
						</block>
						<block v-else>
							<block v-if="item.user_type == 1 ||  item.user_type == 'service'">
								<view class="right" @click="$outerHref('/pagesD/shop/shopHome/shopHome?ru_id='+store_id,'app')">
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
										<jyf-parser :html="item.message" :selectable="selectable" :tag-style="{video: 'width: 100%;'}" class="text"
											@ready="allImgReady" @tap="richtextChange(item.message)"></jyf-parser>
									</view>
									<!-- #endif -->
									
									<!-- #ifndef MP-WEIXIN -->
									<view class="cons-cont" style="max-width: 460rpx;background-color: #eeeeee;padding: 20rpx;border-radius: 10rpx;">
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
											<jyf-parser :html="item.message" :selectable="selectable" :tag-style="{video: 'width: 100%;'}" class="text"
												@ready="allImgReady" @tap="richtextChange(item.message)"></jyf-parser>
										</block>
									</view>
								</view>
								<view class="right">
									<image :src="item.avatar" class="img"></image>
								</view>
							</block>
						</block>
					</view>
					<view style="text-align: center;margin-bottom: 20rpx;color: #999999;" v-if="!isShowkefu && isShowzhuanKefu" @click="toTurnKefu">如果问题没有解决，请转<text style="color: #F45901;margin: 0 10rpx;"> 人工客服 </text></view>
					<view style="text-align: center;margin-bottom: 50rpx;color: #000000;" v-if="isShowkefu">人工客服转接中，请稍后...</view>
					<view style="height: 150rpx;"></view>
				</view>
			</scroll-view>
		</view>
		<view class="kefu-bottom">
			<view class="kefu_center_7" v-if="!isShowkefu && isShowzhuanKefu">
				<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968097188.png" style="height: 60rpx;width: 120rpx;" @click="toTurnKefu" mode="heightFix">
				</image>
			</view>
			<view class="kefu_center_7" v-else>
				<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968093327.png" @click="toCloseKefu" style="height: 60rpx;width: 120rpx;" mode="heightFix">
				</image>
			</view>
			<view class="footer">
				<view class="text-input" style="margin-left: 20rpx;">
					<input class="write-input" :disabled="disabledOne" placeholder="有问题找智能客服小庆~" placeholder-style="color:#999999;font-size:28rpx;" type="text" name="comment" v-model="comment" :confirm-hold="confirmHold"
						confirm-type="发送" autocomplete="off" @confirm="btnSubmit" cursor-spacing='30'>
				</view>
				<view class="speak-contcom">
					<view class="iconfont" @tap="show">
						<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968099325.png" style="height: 50rpx;width: 50rpx;"></image>
					</view>
					<view class="iconfont" @click="chooseImage">
						<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968098745.png" style="height: 50rpx;width: 50rpx;"></image>
					</view>
					<view class="iconfont" @tap="showOrder" v-if="!isShowkefu && !isShowzhuanKefu">
						<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968097389.png" style="height: 50rpx;width: 50rpx;"></image>
					</view>
				</view>
			</view>
			<emotion @emotion="handleEmotion" :height="200" v-if="showPannel"></emotion>
		</view>
		<!-- 咨询问题弹框 start -->
		<uni-popup ref="goodsattr" type="bottom">
			<view class="pop_content">
				<view class="goods_attr_pop">
					<view style="font-size: 36rpx;text-align: center;font-weight: bold;">请选择您要咨询的问题</view>
					<image class="close_img" src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968095943.png" @click="closePop('goodsattr')"></image>
				</view>
				<scroll-view scroll-y="true" :style="{height: `${popHeight}px`}">
					<view class="goods_attr_pop">
						<view v-for="(item,index) in synArr_xuan" :key="index">
							<view class="kefu_center_2" style="margin: 32rpx 0;" @click="tofasong(item)">
								<view class="kefu_center_4_1" style="width: 95%;">{{item.title}}</view>
								<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png" style="height: 30rpx;width: 20rpx;"></image>
							</view>
						</view>
					</view>
				</scroll-view>
				<view style="height: 50rpx;"></view>
			</view>
		</uni-popup>
		<!-- 咨询问题弹框 end -->
		
		<!-- 订单列表弹窗 start -->
		<uni-popup ref="orderattr" type="bottom">
			<view class="pop_content">
				<view class="goods_attr_pop">
					<view style="font-size: 36rpx;text-align: center;font-weight: bold;">请选择您要咨询的订单</view>
					<image class="close_img" src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968096087.png" @click="closePop('orderattr')"></image>
				</view>
				<view class="search_1">
					<image src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/5/original_img/5_P_1705968096087.png"
						style="width:40rpx;height: 40rpx;float: left;margin-top: 10rpx;margin-right: 10rpx;"></image>
					<input type="text" v-model="keyword_order_arr" placeholder="订单号" class="search_area"
						@input="searchInput_order_arr" placeholder-style="color:#C0C0C0;" />
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
								<image src="https://images.eqingqu.com/attachs/photo/202404/20240416_C2721B9ABCB4DB7C886084C33928BB55.png" style="height: 30rpx;width: 20rpx;"></image>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-else :style="{height: `${popHeight}px`}">
					<dsc-not-content></dsc-not-content>
				</view>
				
				<view style="height: 50rpx;">　</view>
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
					<image src="https://images.eqingqu.com/attachs/photo/202404/20240412_92D422316CD523B8232E90574882046B.png" style="height: 60rpx;width: 60rpx;"></image>
				</view>
				<view style="margin: 30rpx;text-align: left;">
					<view style="margin-bottom: 40rpx;display: flex;flex-direction: row;align-items: center;" :class="[isDefine == 1 ? 'darking' : 'graying']"
							@click="isChange">
						<image src="https://images.eqingqu.com/attachs/photo/202404/20240408_3CC0C75ACBA9A01D1BCFBC64896DAA34.png" style="width: 40rpx;height: 40rpx;"></image>
						<view style="margin-left: 20rpx;font-size: 32rpx;">投诉</view>
					</view>
					<view style="margin-bottom: 20rpx;font-size: 32rpx;display: flex;flex-direction: row;align-items: center;" :class="[isDefine == 2 ? 'darking' : 'graying']"
						@click="isChanges">
						<image src="https://images.eqingqu.com/attachs/photo/202404/20240408_0BAAE8D34BE6CE03750229F15B060F3C.png" style="width: 40rpx;height: 40rpx;"></image>
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
	export default {
		components: {
			uniPopup,
			Emotion,
			jyfParser,
			dscNotContent,
			uniNoticeBar
		},
		data() {
			return {
				user_type: 2,
				store_id: 0,
				goods_id:'',
				token: '',
				type: 'default',
				default: 1,
				size: 10,
				page: 1,
				img: '',
				content: '',
				socketTask: null,
				is_open_socket: false,
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 46,
					mitemHeight: 40,
					consultHeight: 0,
				},
				popHeight:0,
				scrollTop: 0,
				comment: '',
				showPannel: false,
				timer: null,
				kefuLoginData: null,
				reg: /\#[\S]{1,3}\;/gi,
				from_id: null,
				list: [],
				shop_name: '',
				confirmHold: true,
				status_one:0,
				
				isShowkefu:false,
				isShowzhuanKefu:true,
				
				keyword_arr:'',
				synArr_xuan: [],
				synArr: [],
				
				keyword_order_arr:'',
				order_xuan:[],
				order:[],
				
				orderShows:false,
				faOrder:{},
				selectable:true,
				
				clearOut:null,
				mateKeywords:'',
				mateKeywordsList:[],
				disabledOne:false,
				
				kefuShows:false,
				notice:'',
				
				photo_show:false,
				
				isDefine: 1,
				revertShow:false,
				title:'',
				report_show:false,
				
				menuButtonInfo: {},
				gaodu:'',
				
			}
		},
		components: {
			Emotion,
			jyfParser
		},
		//初始化加载数据
		async onLoad(e) {
			var that = this
			that.consultH();
			
			// #ifdef MP-WEIXIN
			that.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					that.gaodu = that.menuButtonInfo.height + (that.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif
			
			const res = uni.getSystemInfoSync();
			
			// 高度
			that.style.pageHeight = res.windowHeight - that.style.mitemHeight;
			that.style.contentViewHeight = that.style.pageHeight
			that.popHeight = res.windowHeight*0.6
			that.shop_name = e.shop_name
			that.store_id = e.shop_id
			that.goods_id = e.goods_id	
			that.token = e.token
			if(that.shop_name != 'undefined'){
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
						console.log("!!!!!!!!!!!!!!!!!!!!!!")
						console.log(res1.data)
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
					store_id:that.store_id,
					user_id:uni.getStorageSync('userInfo').id
				},
				success: (res) => {
					if (res.data.status == 'success') {
						that.status_one = res.data.data.status // 0 智能客服 1 人工客服
						if(res.data.data.status == 1){
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
								uid:uni.getStorageSync('userInfo').id,
								ru_id: that.store_id,
								goods_id: that.goods_id,
								t:that.token,
								type:'app',
								v:'v1'
							},
							success: (res1) => {
								console.log(res1.data)
								if (res1.statusCode == 200) {
									that.kefuLoginData = res1.data
									console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
									console.log(that.kefuLoginData)
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
					store_id:that.store_id,
				},
				success: (res_que) => {
					if (res_que.data.status == 'success') {
						that.synArr_xuan = res_que.data.data
						that.synArr = res_que.data.data
					}
				}
			})
		},
		// 关闭websocket
		// beforeDestroy() {
		// 	this.closeSocket();
		// },
		onUnload() {
			var that = this
			that.closeSocket();
			setTimeout(function() {
				clearInterval(that.clearOut);
			}, 5000);
		},
		methods: {
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
						shop_id:that.store_id
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
			searchInput_order_arr(e){
				this.keyword_order_arr = e.detail.value
				this.order_xuan = []
				for (let i = 0; i < this.order.length; i++) {
					if (this.order[i].title.indexOf(this.keyword_order_arr) > 0) {
						this.order_xuan.push(this.order[i])
					}
				}
				if(this.keyword_order_arr == ''){
					this.order_xuan = this.order
				}
			},
			searchInput_arr(e){
				this.keyword_arr = e.detail.value
				this.synArr_xuan = []
				for (let i = 0; i < this.synArr.length; i++) {
					if (this.synArr[i].title.indexOf(this.keyword_arr) > 0) {
						this.synArr_xuan.push(this.synArr[i])
					}
				}
				if(this.keyword_arr == ''){
					this.synArr_xuan = this.synArr
				}
			},
			
			showOrder(){
				var that = this
				that.$refs['orderattr'].open();
			},
			toShowMore(){
				var that = this
				that.$refs['goodsattr'].open();
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
			},
			richtextHtml(html) {
				const regex = new RegExp('<img', 'gi');
				html = html.replace(regex, '<img class="title-img"');
				return html
			},
			connectSocketInit(v) {
				let that = this
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				let url = 'wss://' + that.kefuLoginData.listen_route + '/socket'
				that.socketTask = uni.connectSocket({
					url: url,
					success(data) {
						setTimeout(function() {
							if(v == 'join_ren') {
								that.isShowkefu = false
								that.isShowzhuanKefu = false
							}
							if(v == 'leave_ren'){
								that.isShowkefu = false
								that.isShowzhuanKefu = true
							}
						}, 500);
						
						console.log("websocket连接成功", JSON.stringify(data));
					},
				});

				// 消息的发送和接收必须在正常连接打开中
				that.socketTask.onOpen((res) => {
					that.is_open_socket = true;
					let obj = {
						uid: that.kefuLoginData.user.user_id,
						name: that.kefuLoginData.user.user_name,
						avatar: that.kefuLoginData.user.avatar,
						store_id: that.store_id,
						user_type: 'customer',
						// type: 'join_ren',
						type:v,
						origin: 'app'
					}
					
					that.socketTask.send({
						data: JSON.stringify(obj),
						success: (send) => {
							console.log(JSON.stringify(send))
						}
					})

					// 客户端定时发送心跳 15 秒
					clearInterval(that.timer);
					that.timer = setInterval(function() {
						that.socketTask.send({
							data: '{"type":"ping"}',
							fail() {
								that.connectSocketInit(v)
							}
						});
					}, 3000);
				});

				// websocket接收消息
				this.socketTask.onMessage(function(res) {
					let info = JSON.parse(res.data);
					switch (info.message_type) {
						// 服务端ping客户端
						case 'ping':
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
							//获取到消息
						case 'come_msg':
							console.log(info)
							that.from_id = info.from_id ? info.from_id : null
							if(info.is_can_join==1){
								that.isShowkefu = true
								setTimeout(function() {
									that.sendAndCloseRequest('join_ren');
								}, 200);
								return;
							}
							let message
							if (that.store_id == info.store_id) {
								if(info.msg_type == 1){
									info.message = JSON.parse(info.message);
									console.log(info.message)
									// 更新聊天列表
									message= {
										message: info.message,
										avatar: info.avatar,
										name: info.name,
										time: info.time,
										user_type: info.user_type,
										to_user_id: that.from_id,
										status: info.status,
										msg_type:1
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
										status: info.status
									}
								}
								that.list.push(message);
								
								if(info.isline == 0){
									that.isShowkefu = false
									that.isShowzhuanKefu = true
								}else if(info.isline == 1) {
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
												store_id:that.store_id,
												user_id:uni.getStorageSync('userInfo').id
											},
											success: (res) => {
												if (res.data.status == 'success') {
													that.status_one = res.data.data.status
													if(res.data.data.status == 0){
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
					}
				})
			},
			// websocket接收消息
			onMessage() {
				this.socketTask.onMessage(function(res) {
					console.log("接收消息")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				let that = this
				that.socketTask.close({
					success(res) {
						that.is_open_socket = false;
						clearInterval(that.timer);
						console.log("关闭成功")
					},
					fail(err) {
						console.log("关闭失败")
					}
				})
			},
			//发送消息websocket
			clickRequest(obj) {
				let that = this
				if (that.is_open_socket) {
					that.socketTask.send({
						data: JSON.stringify(obj),
						async success(res) {
							console.log("消息发送成功");
						},
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
					type:v,
					origin: 'app'
				}
				if (that.is_open_socket) {
					that.socketTask.send({
						data: JSON.stringify(obj),
						async success(res) {
							console.log("成功");
						},
					});
				}
				
				if(v == 'join_ren') {
					that.isShowkefu = false
					that.isShowzhuanKefu = false
					that.status_one = 1
				}
				if(v == 'leave_ren'){
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
					data:{
						user_type:this.user_type,
						type:this.type,
						// store_id:'10116',
						store_id:this.store_id,
						page:this.page,
						type:true
					},
					success: (res) => {
						if (res.error == 1) {
							uni.showToast({
								title: '没有历史记录了',
								icon: 'none'
							})
							return false
						}
						for(var i=0;i<res.data.length;i++){
							if(res.data[i].msg_type == 1){
								res.data[i].message = JSON.parse(res.data[i].message);
							}
						}
						const list = res.data
						if(list.length>0){
							// 组装商品详情信息到聊天列表
							this.list = list.reverse();
							if(this.goods_id > 0){
								this.list.push(this.kefuLoginData.goods);
							}
							
							this.$nextTick(function(){
								this.listMove();
							});
							this.page = this.page + 1
						}else{
							this.list = []
						}
					}
				})
			},
			// 聊天列表跟随滚动操作
			listMove() {
				let view = uni.createSelectorQuery().in(this).select(".user-consult");
				
				view.fields({
				  size: true
				}, data => {
				  this.scrollTop = data.height;
				}).exec();
			},
			// 查看更多
			moreMessage() {
				const list = this.$store.dispatch('setKefuSingleChatList',{
					page:this.page,
				    user_type:this.user_type,
				    store_id:this.store_id,
					default:this.default,
					type:true
				})
				
				list.forEach(v=>{
					this.list.unshift(v);
				})
				
				this.page = this.page + 1;
				
				this.$nextTick(function(){
					this.scrollTop = 0;
				})
			},
			// 发送消息
			btnSubmit() {
				let that = this
				// that.disabledOne = true
				if (that.comment == '' || that.comment == null) {
					uni.showToast({
						title: '发送消息不能为空',
						icon: 'none'
					})
					return false
				}

				uni.showLoading({
					title: '发送中...'
				});
				for(var i=0;i<that.mateKeywordsList.length;i++){
					if(that.comment.indexOf(that.mateKeywordsList[i]) >= 0){
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
					v:"v1",
					status_one:that.status_one
				}
				that.clickRequest(obj);
				console.log("    +++++")
				console.log("     +++")
				console.log("      +")
				console.log(obj)
				console.log("      +")
				console.log("     +++")
				console.log("    +++++")
				// 更新聊天列表
				let message = {
					message: that.comment.replace(that.reg, that.emotion),
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.user_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 0
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
				// that.disabledOne = false
			},
			
			// 发送商品链接
			sub_send(item){
				let that = this;
				
				uni.showLoading({title:'发送中...'});
				
				let obj = {
					msg:that.kefuLoginData.goods.url,
					goods:that.kefuLoginData.goods,
					type:'sendmsg',
					to_id:that.kefuLoginData.services_id,
					avatar:that.kefuLoginData.user.avatar,
					goods_id:item,
					store_id:that.store_id,
					origin:uni.getStorageSync('platform')
				}
				
				that.clickRequest(obj);
				
				// 更新聊天列表
				let message = {
					message:'',
					goods:that.kefuLoginData.goods,
					avatar:that.kefuLoginData.user.avatar,
					name:that.kefuLoginData.user.nick_name,
					time:that.$formatDateTime(that.$getCurDate()-(3600 * 8)),
					user_type:2,
					to_user_id:that.from_id,
					status:0
				}
				
				that.list.push(message);
				
				uni.hideLoading();
				
				// this.setScrollH();
				
				this.$nextTick(function(){
					this.listMove();
				})
				
			},
			
			sendMsg(msg) {
				let that = this;
				uni.showLoading({
					title: '发送中...'
				});

				//发送消息
				let obj = {
					msg: msg,
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					uname: that.kefuLoginData.user.user_name,
					goods_id: that.goods_id,
					store_id: that.store_id,
					origin: 'app',
					v:"v1",
					status_one:that.status_one
				}
				that.clickRequest(obj);
				// 更新聊天列表
				let message = {
					message: msg,
					goods: that.kefuLoginData.goods,
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.nick_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 0
				}
				
				that.list.push(message);
				uni.hideLoading();
				
				that.comment = '';
				
				this.$nextTick(function() {
					this.listMove();
				})
			},
			tofasong(item){
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
					v:"v1",
					v_type:'v_' + item.id,
					status_one:that.status_one
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
					status: 0
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
											that.img = '<img class="title-img" src="' + res1
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
				// #ifndef H5
				var result = await permision.premissionCheck("CAMERA_EXTERNAL_STORAGE")
				console.log(JSON.stringify(result))
				if(result == 1) {  
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
											that.img = '<img class="title-img" src="' + res1
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
			},
			navigateBack:function(){
				uni.navigateBack()
			},
			photo_showNo:function(){
				this.photo_show = false
				// uni.navigateBack()
			},
			photo_showYes:function(){
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
										that.img = '<img class="title-img" src="' + res1
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
			
			toshowReport:function(){
				var that = this
				that.report_show = true
			},
			report_showYes:function(){
				var that = this
				if(that.title == ''){
					uni.showToast({
						icon:'none',
						title:'请输入举报内容！'
					})
				} else {
					that.report_show = false
					uni.showLoading({
						title:'提交中~'
					})
					setTimeout(function() {
						uni.showToast({
							icon:'none',
							title:'举报内容已提交！'
						})
					}, 1000);
				}
			},
			
			report_showNo:function(){
				var that = this
				that.report_show = false
			},
			//展示表情
			show() {
				this.showPannel = !this.showPannel;
				this.$nextTick(function() {
					this.listMove();
				})
				// this.setScrollH();
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
						footh = data.height;
						that.style.contentViewHeight = that.style.pageHeight - footh; //像素
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
						that.style.consultHeight = data.height;

						if (data.height > that.style.contentViewHeight) {
							that.scrollTop = data.height - that.style.contentViewHeight
						}
					}).exec();
				})
			},
			richtextChange(obj) {
				let arr = [];
				var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

				if (obj.match(srcReg)) {
					arr.push(obj.match(srcReg)[1])

					uni.previewImage({
						current: 1,
						urls: arr
					})
				}
			},
			goodsLink(id) {
				// uni.reLaunch({
				uni.navigateTo({
					url: '/pagesC/goodsDetail/goodsDetail?id=' + id
				})
			},
			
			toTurnKefu(){
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
						v:"v1",
						status_one:1
					}
					that.clickRequest(obj);
					console.log("    +++++")
					console.log("     +++")
					console.log("      +")
					console.log(obj)
					console.log("      +")
					console.log("     +++")
					console.log("    +++++")
					// 更新聊天列表
					let message = {
						message: '人工客服',
						avatar: that.kefuLoginData.user.avatar,
						name: that.kefuLoginData.user.user_name,
						time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
						user_type: 2,
						to_user_id: that.from_id,
						status: 0
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
			toCloseKefu(){
				var that = this
				that.kefuShows = true
			},
			kefuShowsOff(){
				var that = this
				that.kefuShows = false
			},
			kefuShowsOn(){
				var that = this
				that.kefuShows = false
				that.sendAndCloseRequest('leave_ren');
			},
			
			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
			toOrderfasong(item){
				var that = this
				that.faOrder = item
				that.$refs['orderattr'].close();
				that.orderShows = true
			},
			
			orderShowsOff(){
				var that = this
				that.orderShows = false
			},
			
			orderShowsOn(){
				var that = this
				//发送消息
				let obj = {
					order_id:that.faOrder.order_id,
					msg: '',
					type: 'sendmsg',
					to_id: that.kefuLoginData.services_id,
					avatar: that.kefuLoginData.user.avatar,
					goods_id: that.goods_id,
					store_id: that.store_id,
					uname: that.kefuLoginData.user.user_name,
					origin: 'app',
					status_one:1
				}
				that.clickRequest(obj);
				
				// 更新聊天列表
				let message_1 = {
					order_type:111,
					order_sn:that.faOrder.order_sn,
					add_time:that.faOrder.add_time,
					consignee:that.faOrder.consignee,
					order_status:that.faOrder.order_status,
					total_amount_formated:that.faOrder.total_amount_formated,
				}
				let message = {
					message: message_1,
					order_type:111,
					goods: that.kefuLoginData.goods,
					avatar: that.kefuLoginData.user.avatar,
					name: that.kefuLoginData.user.nick_name,
					time: util.formatDateTime(util.getCurDate() - (3600 * 8)),
					user_type: 2,
					to_user_id: that.from_id,
					status: 0
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
				that.report_show = true
			},
			isChanges: function() {
				var that = this
				that.isDefine = 2
				that.revertShow = false
				uni.showToast({
					icon:'none',
					title:'即将跳转平台客服...'
				})
				api.ucenterMyCenter({}, function(res_1) {
					if (res_1.error == '0') {
						console.log(res_1)
						let detail = res_1.data.detail;
						if (detail.uid > 0) {
							uni.request({
								url: 'https://7.eqingqu.com/api.php?API=client/im/index/getIminfo',
								method: 'GET',
								header: {
									"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
								},
								data: {
									uuid: uni.getStorageSync('cuntoken'),
									user_name: detail.nickname,
									avatar: detail.face
								},
								success: (res) => {
									if (res.data.error == '0') {
										console.log(res.data.data)
										uni.hideLoading()
										uni.redirectTo({
											url: '/ucenter/pages/kefu_center/kefu_center?shop_id=' + res.data.data.shop_id + '&shop_name=' + res.data.data.shop_name + '&token='+ res.data.data.token
										})
									}
								}
							})
						}
					}
				})
				
			},
			
			tommoving: function() {
				var that = this
				that.revertShow = true
			},
			revertShowNo: function() {
				var that = this
				that.revertShow = false
			},
			navigateBack:function(){
				uni.navigateBack()
			},
			toshowReport:function(){
				var that = this
				that.report_show = true
			},
			report_showYes:function(){
				var that = this
				if(that.title == ''){
					uni.showToast({
						icon:'none',
						title:'请输入举报内容！'
					})
				} else {
					that.report_show = false
					uni.showLoading({
						title:'提交中~'
					})
					setTimeout(function() {
						uni.showToast({
							icon:'none',
							title:'举报内容已提交！'
						})
					}, 1000);
				}
			},
			
			report_showNo:function(){
				var that = this
				that.report_show = false
			},
			toInput: function(e) {
				var that = this
				that.title = e.detail.value
			},
		}
	}
</script>

<style lang="scss">
	.tank {}

	.tank-con {}

	.user-consult {
		padding: 20upx 20upx 30upx;
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
		padding-bottom: env(safe-area-inset-bottom);
	}

	.kefu-bottom .footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0rpx 20rpx 20rpx 20rpx;
	}

	.kefu-bottom .speak-contcom {
		display: flex;
		flex-direction: row;
		margin-right: 25upx;
	}

	.kefu-bottom .speak-contcom .iconfont {
		font-size: 50upx;
		margin-left: 28upx;
	}

	.kefu-bottom .text-input {
		background: #FFFFFF;
		height: 70upx;
		flex: 1;
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		border-radius: 20rpx;
	}

	.kefu-bottom .text-input .write-input {
		width: 100%;
		padding: 0 22upx;
		box-sizing: border-box;
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
		display: -webkit-box;
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
	
	.kefu_center_5{
		width: 100%;
		background-color: #EDEDED;height: 2rpx;margin-top: 20rpx;
	}
	
	.kefu_center_6{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 30rpx;
	}
	.kefu_center_7{
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
		top: 25%;
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
	
	.notice_1{
		position: fixed;
		/* #ifdef APP-PLUS */
		top: 80px;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: 40px;
		/* #endif */
		/* #ifdef H5 */
		top: 40px;
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
	}
	
	.search_1_1 {
		color: #191919;
		margin: 10rpx 20rpx 20rpx 20rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
	
	/* 顶部导航栏 end */
</style>