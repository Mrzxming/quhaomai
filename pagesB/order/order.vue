<template>
	<view class="container" @click="resetExpand">
		<view class="main-title">
			<!-- #ifdef MP-WEIXIN -->
			<view class="status_bar" :style="{height:menuButtonInfo.top + 'px'}"></view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<!-- 这里是状态栏 -->
			<view class="status_bar" style="height: 45px;"></view>
			<!-- #endif -->
			<view class="chat_1" :style="{ height: gaodu + 'px' }">
				<view @click="navigateBack">
					<image
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_89BF6904E05EEE5119E0BC3F987C8640.png"
						style="width: 30rpx;height: 30rpx;margin-top: 20rpx;">
					</image>
				</view>
				<view style="margin-left: 16rpx;" class="selectBox">
					<input type="text" placeholder="请输入关键词" @input="keywordInput" @confirm="submitSelect"
						placeholder-style="font-size:30rpx" :value="keyword">
				</view>
				<view class="search_submit" @click="showPopup('server')">
					<view>
						<image src="/static/order/filter.png" class="shaibtn"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="listall"
			:class="shopConfig.is_show_drp == 1 && orderInfo.isRegisterDrpShop == 0 && orderInfo.is_drp == 1 ? 'container-tab-bar container-tab-bar-top' : 'container-tab-bar'">
			<view class="tab-bar ">
				<view v-for="(tab,index) in tabBars" :key="index" :class="['tab-item',status==index ? 'active' : '']"
					@click="orderStatusHandle(index)">
					<text>{{ tab }}</text>
				</view>
			</view>

			<view class="fx-adv" @click="$outerHref('/pagesA/drp/register/register', $isLogin())"
				v-if="shopConfig.is_show_drp == 1 && orderInfo.isRegisterDrpShop == 0 && orderInfo.is_drp == 1">
				<image
					src="https://shhai2.oss-cn-shanghai.aliyuncs.com/data/gallery_album/original_img/20230324_ZOQjHnHRnvthWvpqi2Eigf6IrXuRic.jpg"
					mode="widthFix"></image>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view style="height: 166rpx;" class="status_bar"></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view style="height: 200rpx;"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view style="height: 200rpx;"></view>
			<!-- #endif -->
			<view class="section-list">
				<block v-if="orderList && orderList.length > 0">
					<!-- new -->
					<view class="user-itemnew " v-for="(item,index) in orderList" :key="index">
						<view class="item-hd" style="">
							<view class="shop-name" style="">{{item.shop_name}}<text
									style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;margin-left: 10rpx;white-space: nowrap"
									v-if="item.shop_grade==13">{{item.shop_grade_name}}</text></view>
							<view   class="order-status uni-red">{{item.order_status}}</view>
						</view>
						<view class="item-bd">
							<view class="subHead">
								<view class="item">
									<view class="tit">{{$t('lang.order_sn')}}：</view>
									<view class="value" @longtap="copyOrderSn(item.order_sn)">
										<navigator :url="'../orderDetail/orderDetail?id='+item.order_id"
											hover-class="none">
											{{ item.order_sn }}
										</navigator>
									</view>
								</view>
								<view class="item">
									<view class="tit">{{$t('lang.order_time')}}：</view>
									<view class="value time">
										<view class="add_time">{{ item.add_time }}</view>
										<uni-tag :text="item.activity_lang" size="small" type="error"
											v-if="item.activity_lang != ''"></uni-tag>
									</view>
								</view>
							</view>
							<view class="product-list product-list-max product-list-scroll"
								v-if="item.order_goods.length > 1">
								<view class="product-items">
									<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
										<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods"
											:key="goodsIndex">
											<navigator :url="'../orderDetail/orderDetail?id='+item.order_id"
												hover-class="none">
												<view class="product-img">
													<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb">
													</image>
													<image
														src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
														class="icon" v-if="goodsItem.is_gift > 0"></image>
												</view>
											</navigator>
										</view>
									</scroll-view>
								</view>
								<view class="product-more">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<text>{{$t('lang.gong')}} {{ item.order_goods_num }} {{$t('lang.kuan')}}</text>
										<text class="iconfont icon-more"></text>
									</navigator>
								</view>
							</view>
							<view class="product-list" v-else>
								<view class="product-items">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods"
											:key="goodsIndex">
											<view class="product-img">
												<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb">
												</image>
												<image
													src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
													class="icon" v-if="goodsItem.is_gift > 0"></image>
											</view>
											<view class="product-info">
												<view class="product-name twolist-hidden">
													<image class="country_icon" :src="goodsItem.country_icon"
														:lazy-load="true" v-if="goodsItem.country_icon"></image>
													{{ goodsItem.goods_name }}
												</view>
											</view>
										</view>
									</navigator>
								</view>
								<view class="product-more">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<text>{{$t('lang.gong')}} {{ item.order_goods_num }}{{$t('lang.kuan')}}</text>
										<uni-icons type="forward" size="18" color="#999999"></uni-icons>
									</navigator>
								</view>
							</view>
							<view class="express" v-if="item.trackerinfo"
								:class="{expressnew:item.trackerinfo.invoice_state !=='包裹已签收'||item.trackerinfo.invoice_state!=='待发货'}"
								@click="toexpressLog(item.invoice_no,item.order_id)">
								<view class="" style="display: flex;align-items: center;">
									<view class="" style="">
										<image :src="item.trackerinfo.img" mode=""
											style="width: 44rpx;height: 40rpx;margin-top: 10rpx;"></image>
									</view>
									<view class="">
										<view class="expressStatus" v-if="item.trackerinfo.invoice_state">
											<view class="statusb"
												v-if="item.trackerinfo.invoice_state=='包裹已签收'||item.trackerinfo.invoice_state=='待发货'">
												{{item.trackerinfo.invoice_state}}
											</view>
											<view class="statusNew" v-else>
												{{item.trackerinfo.invoice_state}}
											</view>
											<view class="statusText ">
												{{item.trackerinfo.invoice_context}}
											</view>
										</view>
										<!-- <text class="expressCode" >取件码</text>
										<text class="expressCode">1855608</text> -->
									</view>
								</view>
								<view class="" style="display: flex;align-items: center;">
									<!-- <text>立即取件</text> -->
									<uni-icons type="arrowright" size="16" color="#999999" style=""></uni-icons>
								</view>
							</view>
							<view class="list-item-box" style="color: 1B1B1B;">
								{{$t('lang.gong')}}{{item.order_goods_num}}{{$t('lang.total_amount_propmt')}}：<text
									class="uni-red" style="font-size: 40rpx;">{{ item.total_amount_formated }}</text>
							</view>
						</view>
						<view class="item-fd"
							style="position: relative;padding: 10rpx;display: flex;justify-content: space-between;align-items: center;">
							<view class="" style="position: relative;" @click.stop="getMore(item,index)">
								<block v-if="(item.invoice_see == true && item.invoice_type == 2) 
								||item.delay === 1 
								||item.order_del > 0 
								||item.is_restore === 1 
								||item.handler_return && item.extension_code != 'package_buy'
								||item.handler === 1  && item.is_restore === 0
								||item.online_pay && item.failure == 0 && item.is_restore === 0
								||item.is_can_exprot == 1">
									<view class="morebtn">
										更多
									</view>
								</block>
								<!-- <view class="morebtn">
									更多
								</view> -->
							</view>
							<view class="moreBtns" v-if="index===currentIndex"
								style="position: absolute;left:0%;top: 100%;z-index: 99;">
								<view class="triangle-white"></view>
								<view class="">
									<view class="btns" @click="invoiceDetail(item.order_id)"
										v-if="item.invoice_see == true && item.invoice_type == 2">查看发票</view>
									<view class="btns" @click="delayOrder(item.order_id)" v-if="item.delay === 1">
										{{$t('lang.delay_in_receiving')}}
									</view>
									<view class="btns" @click="delOrder(item.order_id)" v-if="item.order_del > 0">
										{{$t('lang.delete_order')}}
									</view>
									<view class="btns" @click="delRestore(item.order_id)" v-if="item.is_restore === 1">
										{{$t('lang.restore_order')}}
									</view>
									<view class="btns" @click="refoundHandle(item.order_id)"
										v-if="item.handler_return && item.extension_code != 'package_buy'">
										{{$t('lang.apply_return')}}
									</view>
									<view class="btns" @click="cancelOrder(item.order_id)"
										v-if="item.handler === 1  && item.is_restore === 0">{{$t('lang.cancel_order')}}
									</view>
									<view class="btns" @click="exportOrder(item.order_id)"
										v-if="item.is_can_exprot == 1">导出货单</view>
									<!-- 立即支付 原来的位置-->
								<!-- 	<view class="btns" @click="onlinepay(item.order_sn,item.pay_code)"
										v-if="item.online_pay && item.failure == 0 && item.is_restore === 0">
										{{$t('lang.immediate_pay')}}
									</view> -->
									<view class="btns" @click="jumpTo(item.order_id)"
										>{{$t('lang.goGongHuo')}}
									</view>
									<view class="btns" @click="insurancePrice(item.order_id)" v-if="item.is_insured == 1"
										>{{$t('lang.apply_insurance_price')}}
									</view>
								</view>
							</view>
							<view class="btn-bar-mins">
								<!-- received 确认收货 ping_ja 晒单评价 buy_again 再次购买  -->
								<view class="btn" @click="receivedOrder(item.order_id)"
									v-if="item.handler === 2  && item.is_restore === 0 && !item.confirming">{{$t('lang.received')}}
								</view>
								<view class="btn btn-loading" v-if="item.handler === 2  && item.is_restore === 0 && item.confirming">
									<uni-load-more status="loading" :content-text="{contentdown: '', contentrefresh: '', contentnomore: ''}"></uni-load-more>
								</view>
								<block v-if="item.order_status == '已完成'">
									<view class="btn" @click="commentOrder(item.order_id)"
										v-if="item.is_comment == 0 && item.shop_can_comment > 0">{{$t('lang.ping_ja')}}
									</view>
								</block>
								
								<view class="btn" @click="buyAgain(item.order_id)">
									{{$t('lang.buy_again')}}
								</view>
								<!-- status -->
								<view class="btn" @click="onlinepay(item.order_sn,item.pay_code)"
									v-if="item.online_pay && item.failure == 0 && item.is_restore === 0">
									{{$t('lang.immediate_pay')}}
								</view>
								<block
									v-if="item.shipping_status2==1 ||item.shipping_status==4 ||item.shipping_status2==6 || item.shipping_status2==7">
									<view class="btn" @click="toexpressLog(item.invoice_no,item.order_id)">
										查看物流
									</view>
								</block>
								
							</view>

							<!-- <view class="btn-bar-mins">
								<view class="btn" @click="invoiceDetail(item.order_id)"
									v-if="item.invoice_see == true && item.invoice_type == 2">查看发票</view>
								<view class="btn" @click="delayOrder(item.order_id)" v-if="item.delay === 1">
									{{$t('lang.delay_in_receiving')}}
								</view>
								<view class="btn" @click="delOrder(item.order_id)" v-if="item.order_del > 0">
									{{$t('lang.delete_order')}}
								</view>
								<view class="btn" @click="delRestore(item.order_id)" v-if="item.is_restore === 1">
									{{$t('lang.restore_order')}}
								</view>
								<view class="btn" @click="refoundHandle(item.order_id)"
									v-if="item.handler_return && item.extension_code != 'package_buy'">
									{{$t('lang.apply_return')}}
								</view>
								<view class="btn" @click="cancelOrder(item.order_id)"
									v-if="item.handler === 1  && item.is_restore === 0">{{$t('lang.cancel_order')}}
								</view>
								<view class="btn" @click="receivedOrder(item.order_id)"
									v-else-if="item.handler === 2  && item.is_restore === 0 && !item.confirming">{{$t('lang.received')}}
								</view>
								<view class="btn" v-else-if="item.handler === 2  && item.is_restore === 0 && item.confirming">
									<uni-load-more status="loading" :content-text="{contentdown: '', contentrefresh: '', contentnomore: ''}"></uni-load-more>
								</view>
								<view class="btn" @click="onlinepay(item.order_sn,item.pay_code)"
									v-if="item.online_pay && item.failure == 0 && item.is_restore === 0">
									{{$t('lang.immediate_pay')}}
								</view>
								<block v-if="item.order_status == '已完成'">
									<view class="btn" @click="commentOrder(item.order_id)"
										v-if="item.is_comment == 0 && item.shop_can_comment > 0">{{$t('lang.ping_ja')}}
									</view>
								</block>
								<view class="btn" @click="buyAgain(item.order_id)">
									{{$t('lang.buy_again')}}
								</view>
							</view>
						 -->

						</view>
					</view>

					<!-- <view class="btn" @click="buyAgain(item.order_id)" v-if="item.is_store_order == 0">
									{{$t('lang.buy_again')}}
								</view> -->
					<!-- old -->
					<!-- <view class="user-item user-order-item" v-for="(item,index) in orderList" :key="index">
						<view class="item-hd" style="width: 95%;">
							<view class="shop-name" style="width: 60%;">{{item.shop_name}}<text
									style="background-color: #FE0302;color: #ffffff;border-radius: 10rpx;padding: 0rpx 12rpx;font-size: 22rpx;margin-right: 10rpx;margin-left: 10rpx;"
									v-if="item.shop_grade==13">核心供应商</text></view>
							<view class="order-status uni-red">{{item.order_status}}</view>
						</view>
						<view class="item-bd">
							<view class="subHead">
								<view class="item">
									<view class="tit">{{$t('lang.order_sn')}}：</view>
									<view class="value" @longtap="copyOrderSn(item.order_sn)">
										<navigator :url="'../orderDetail/orderDetail?id='+item.order_id"
											hover-class="none">
											{{ item.order_sn }}
										</navigator>
									</view>
								</view>
								<view class="item">
									<view class="tit">{{$t('lang.order_time')}}：</view>
									<view class="value time">
										<view class="add_time">{{ item.add_time }}</view>
										<uni-tag :text="item.activity_lang" size="small" type="error"
											v-if="item.activity_lang != ''"></uni-tag>
									</view>
								</view>
							</view>
							<view class="product-list product-list-max product-list-scroll"
								v-if="item.order_goods.length > 1">
								<view class="product-items">
									<scroll-view class="scroll-view" scroll-x="true" scroll-left="0">
										<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods"
											:key="goodsIndex">
											<navigator :url="'../orderDetail/orderDetail?id='+item.order_id"
												hover-class="none">
												<view class="product-img">
													<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb">
													</image>
													<image
														src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
														class="icon" v-if="goodsItem.is_gift > 0"></image>
												</view>
											</navigator>
										</view>
									</scroll-view>
								</view>
								<view class="product-more">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<text>{{$t('lang.gong')}} {{ item.order_goods_num }} {{$t('lang.kuan')}}</text>
										<text class="iconfont icon-more"></text>
									</navigator>
								</view>
							</view>
							<view class="product-list" v-else>
								<view class="product-items">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<view class="item" v-for="(goodsItem,goodsIndex) in item.order_goods"
											:key="goodsIndex">
											<view class="product-img">
												<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb">
												</image>
												<image
													src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
													class="icon" v-if="goodsItem.is_gift > 0"></image>
											</view>
											<view class="product-info">
												<view class="product-name twolist-hidden">
													<image class="country_icon" :src="goodsItem.country_icon"
														:lazy-load="true" v-if="goodsItem.country_icon"></image>
													{{ goodsItem.goods_name }}
												</view>
											</view>
										</view>
									</navigator>
								</view>
								<view class="product-more">
									<navigator :url="'../orderDetail/orderDetail?id='+item.order_id" hover-class="none">
										<text>{{$t('lang.gong')}} {{ item.order_goods_num }}{{$t('lang.kuan')}}</text>
										<uni-icons type="forward" size="18" color="#999999"></uni-icons>
									</navigator>
								</view>
							</view>
							<view class="list-item-box">{{$t('lang.gong')}}
								{{item.order_goods_num}}{{$t('lang.total_amount_propmt')}}：<text
									class="uni-red">{{ item.total_amount_formated }}</text>
							</view>
						</view>
						<view class="item-fd">
							<view class="btn-bar-mins">
								<view class="btn" @click="invoiceDetail(item.order_id)"
									v-if="item.invoice_see == true && item.invoice_type == 2">查看发票</view>
								<view class="btn" @click="delayOrder(item.order_id)" v-if="item.delay === 1">
									{{$t('lang.delay_in_receiving')}}
								</view>
								<view class="btn" @click="delOrder(item.order_id)" v-if="item.order_del > 0">
									{{$t('lang.delete_order')}}
								</view>
								<view class="btn" @click="delRestore(item.order_id)" v-if="item.is_restore === 1">
									{{$t('lang.restore_order')}}
								</view>
								<view class="btn" @click="refoundHandle(item.order_id)"
									v-if="item.handler_return && item.extension_code != 'package_buy'">
									{{$t('lang.apply_return')}}
								</view>
								<view class="btn" @click="cancelOrder(item.order_id)"
									v-if="item.handler === 1  && item.is_restore === 0">{{$t('lang.cancel_order')}}
								</view>
								<view class="btn" @click="receivedOrder(item.order_id)"
									v-else-if="item.handler === 2  && item.is_restore === 0 && !item.confirming">{{$t('lang.received')}}
								</view>
								<view class="btn" v-else-if="item.handler === 2  && item.is_restore === 0 && item.confirming">
									<uni-load-more status="loading" :content-text="{contentdown: '', contentrefresh: '', contentnomore: ''}"></uni-load-more>
								</view>
								<view class="btn" @click="onlinepay(item.order_sn,item.pay_code)"
									v-if="item.online_pay && item.failure == 0 && item.is_restore === 0">
									{{$t('lang.immediate_pay')}}
								</view>
								<block v-if="item.order_status == '已完成'">
									<view class="btn" @click="commentOrder(item.order_id)"
										v-if="item.is_comment == 0 && item.shop_can_comment > 0">{{$t('lang.ping_ja')}}
									</view>
								</block>
								<view class="btn" @click="buyAgain(item.order_id)">
									{{$t('lang.buy_again')}}
								</view>
							</view>
						</view>
					</view>
					 -->


					<uni-load-more :status="loadMoreStatus" :content-text="contentText"
						v-if="page > 0 && showLoadMore" />
				</block>
				<block v-else-if="loadMoreStatus=='loading'">
					<uni-load-more :status="loadMoreStatus" :content-text="contentText"
						v-if="page > 0 && showLoadMore" />
				</block>
				<block v-else>
					<dsc-not-content></dsc-not-content>
				</block>
			</view>
			<dsc-common-nav></dsc-common-nav>
			<dsc-filter-top :scrollState="scrollState" :isScrollView="true" outerClass="true"
				@fileterScrollTop="fileterScrollTop"></dsc-filter-top>

			<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->
		</view>

		<!--  更多按钮-->
		<!-- 	<uni-popups ref="morebutton" style="position: absolute;top: 0%;">
			<view class="popup-content">
				<view class="btn" @click="buyAgain(order_id)">
					{{$t('lang.buy_again')}}
				</view>
			</view>
		</uni-popups> -->
		<!-- pop弹框 -->
		<uni-popups ref="server" type="bottom">
			
			

			<!-- <view class="pop_content" :style="{height: `${popHeight.hd}px`}"> -->
			<view class="pop_content">
				<view class="pop_header">
					<text class="pop_title">订单筛选</text>
					<image class="close_img"
						src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
						@click="closePop('server')"></image>
				</view>
				<view class=" ">
					<view class="timetitle" style="font-weight: 500;margin-top: -10rpx;">
						时间范围
					</view>
					<DateSelector
					 ref="dateSelector"
					  :mode="1"
					  @onChange="onDateSelectorChange"
					  @onSubmit="onDateSelectorSubmit"
					  minDate="2020-2-3"
					  maxDate="2025-10-11"
					  
					/>
					<view class="timeall" style="margin-top: 0rpx;">
						<view class="timeitem" v-for="(item,index) in timelist" :key="item.id"
							:class="{timecurrent:timeindex===index }" @click="clicktime(index,item)">
							<view class="">
								{{item.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="timetitle" style="font-weight: 500;">
					订单状态
				</view>
				<view class="order-type">
					<view class="order-type-item" v-for="(item,index) in orderTypeList" :key="item.id"
						:class="{orderTypecurrent:orderTypeindex===index }" @click="clickOrderType(index,item)">
						<view class="">
							{{item.title}}
						</view>
					</view>
				</view>
				
				<view class="timetitle" style="font-weight: 500;">
					店铺
				</view>
				<!-- <scroll-view scroll-y="true" :style="{height: `${popHeight.center}px`}"> -->
				<scroll-view scroll-y="true" style="height: 380rpx;">
					<view class="sellall">
						<view class="sellitem" v-for="(item,index) in sellerlist" :key="item.id"
							:class="{sellcurrent:sellindex===index }" @click="clicksell(index,item)">
							<view class="">
								{{item.name}}
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="btnend" style="display: flex;">
					<view class="btn_wrap" @click="closeNo('server')">重置</view>
					<view class="btn_wrap red_btn" @click="clickyes('server')">确定</view>
				</view>
			</view>
		</uni-popups>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniTag from "@/components/uni-tag.vue";
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	import DateSelector from '@/components/dengrq-datetime-picker/dateSelector/index.vue';
	//返回顶部
	import dscFilterTop from '@/components/dsc-filter-top'
	import uniPopup from '@/components/uni-popup.vue';
	import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	export default {
		components: {
			uniTag,
			uniIcons,
			dscCommonNav,
			dscNotContent,
			dscFilterTop,
			uniPopup,
			uniPopups,
			DateSelector
		},
		data() {
			return {
				tabBars: [this.$t('lang.suo_ding'), this.$t('lang.order_status_01'), this.$t('lang.order_status_03'), this
					.$t('lang.ss_received'), this.$t('lang.order_status_11')
				],
				disabled: false,
				loading: true,
				page: 1,
				size: 10,
				status: 0,
				type: 'type',
				dscLoading: true,
				shopConfig: uni.getStorageSync('configData'),
				keyword: '',

				scrollState: false,
				showLoadMore: false,
				loadMoreStatus: 'more',
				contentText: {
					contentdown: this.$t('lang.view_more'),
					contentrefresh: this.$t('lang.loading'),
					contentnomore: this.$t('lang.no_more')
				},
				orderList: [],

				isIpx: false,
				gaodu: '',
				ikonw: false,
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				orderTypeList:[
					
					
				],
				shopid: '',
				timelist: [],
				sellerlist: [],
				sellindex: '',
				timeindex: 0,
				orderTypeindex:0,
				orderTypeId:'',
				isMore: false,
				popupBottom: '',
				moreIndex: '',
				currentIndex: -1,
				startDate:'',
				endDate:'',
			};
		},
		computed: {
			...mapState({
				orderCount: state => state.user.userorderCount,
				orderInfo: state => state.user.userorderInfo
			}),
			// orderList: {
			// 	get() {
			// 		return this.$store.state.user.userOrderList
			// 	},
			// 	set(val) {
			// 		this.$store.state.user.userOrderList = val
			// 	}
			// },
		},
		methods: {
			 onDateSelectorChange({ startDate, endDate }) {
				 this.startDate = startDate;
				 this.endDate = endDate;
			      console.log('onDateSelectorChange',  this.startDate,  this.startDate);
			    },
			    onDateSelectorSubmit({ startDate, endDate }) {
					this.startDate = startDate;
					this.endDate = endDate;
					this.timeindex = ''
			      console.log('onDateSelectorSubmit',  this.startDate,  this.startDate);
			    },
			
			insurancePrice(item) {
				uni.request({
					url: this.websiteUrl + '/api/order/order_goods_insured?order_id=' + item,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						console.log(res)
						uni.showToast({
							title: res.data.data.message,
							icon: 'none',
							duration: 1500
						});
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			// 去铺货
			jumpTo(item) {
				var that = this
				that.$store.dispatch('setGoPuHuo', {
					order_id: item,
				}).then(res => {
				if(res && res.data) {
						uni.showToast({
							title: res.data,
							icon: 'none',
							duration: 500
						});
					}
				setTimeout(() => {
				  uni.navigateTo({
				  	url: '/pagesC/waimaibinding/waimaibinding'
				  });
				}, 600)
					console.log(res)
					if (res.data.error == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 500
						});
					}
				})
			},
			resetExpand() {
				this.currentIndex = -1;
			},
			// 更多按钮
			getMore(item, index) {
				var that = this
				if (this.currentIndex === index) {
					this.currentIndex = -1;
				} else {
					this.currentIndex = index;
				}
				// let moreIn = index
				// var arr = that.orderList
				// for (var i = 0; i < arr.length; i++) {
				// 	if (i == moreIn) {
				// 		arr[index].isMorea = 1
				// 	} else {
				// 		arr[index].isMorea = 0
				// 	}
				// }
			},
			// 导出货单
			exportOrder(orderId) {
				var that = this
				// 关闭下拉菜单
				that.currentIndex = -1;
				
				// 显示加载提示
				uni.showLoading({
					title: '正在导出...',
					mask: true
				});
				
				// 构建接口URL
				const baseUrl = that.websiteUrl || 'https://www.ok9288.com';
				const url = baseUrl + '/api/order/export_order_info?order_id=' + orderId;
				
				// #ifdef H5
				// H5平台直接在浏览器下载（浏览器会自动携带cookie，不需要手动传token）
				// 使用 window.location.href 直接跳转下载，避免 MIME 类型警告
				const ua = navigator.userAgent.toLowerCase();
				const isWeixin = ua.indexOf('micromessenger') !== -1;

				if (isWeixin) {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: '请下载app操作',
						showCancel: false,
						confirmText: '知道了'
					});
					return;
				}
				
				window.location.href = url;
				
				uni.hideLoading();
				uni.showToast({
					title: '正在下载...',
					icon: 'success',
					duration: 1500
				});
				// #endif
				
				// #ifndef H5
				// 方案1：使用系统浏览器下载 (APP-PLUS)
				// #ifdef APP-PLUS
				try {
					const token = uni.getStorageSync('token');
					const clientHash = uni.getStorageSync('client_hash');
					let downloadUrl = url;
					if (token) downloadUrl += '&token=' + encodeURIComponent(token);
					if (clientHash) downloadUrl += '&X-Client-Hash=' + encodeURIComponent(clientHash);

					console.log('[exportOrder] APP-PLUS 平台，尝试使用 plus.runtime.openURL 打开浏览器下载:', downloadUrl);
					plus.runtime.openURL(downloadUrl);
					uni.hideLoading();
					uni.showToast({
						title: '正在打开浏览器下载...',
						icon: 'success',
						duration: 2000
					});
					return; // APP-PLUS 平台直接返回，不执行 uni.downloadFile
				} catch (e) {
					console.error('[exportOrder] APP-PLUS 平台打开浏览器失败，回退到 uni.downloadFile:', e);
					// 如果打开浏览器失败，则继续执行 uni.downloadFile 逻辑
				}
				// #endif

				// 原有的 uni.downloadFile 逻辑 (保留备用，或用于小程序)
				// #ifdef MP-WEIXIN || APP-PLUS
				const token = uni.getStorageSync('token');
				const clientHash = uni.getStorageSync('client_hash');
				
				// 将 token 和 clientHash 也添加到 URL 参数中（Android 可能对 header 支持有限）
				let downloadUrl = url;
				if (token) downloadUrl += '&token=' + encodeURIComponent(token);
				if (clientHash) downloadUrl += '&X-Client-Hash=' + encodeURIComponent(clientHash);
				
				console.log('开始下载，URL:', downloadUrl);
				console.log('Token:', token);
				console.log('ClientHash:', clientHash);
				
				uni.downloadFile({
					url: downloadUrl,
					header: {
						'token': token || '',
						'X-Client-Hash': clientHash || ''
					},
					success: (downloadRes) => {
						uni.hideLoading();
						console.log('下载成功，响应:', downloadRes);
						console.log('状态码:', downloadRes.statusCode);
						console.log('文件路径:', downloadRes.tempFilePath);
						
						if (downloadRes.statusCode === 200) {
							// 检查下载的文件是否是 JSON 错误（Android 可能把 JSON 错误当作文件下载）
							// #ifdef APP-PLUS
							plus.io.resolveLocalFileSystemURL(downloadRes.tempFilePath, function(entry) {
								entry.file(function(file) {
									// 如果文件很小（小于 1KB），可能是 JSON 错误
									if (file.size < 1024) {
										const fileReader = new plus.io.FileReader();
										fileReader.onloadend = function(e) {
											try {
												const content = e.target.result;
												// 尝试解析为 JSON
												const jsonData = JSON.parse(content);
												if (jsonData.status === 'failed' || jsonData.errors) {
													// 这是错误信息，不是文件
													const errorMsg = jsonData.errors && jsonData.errors.message 
														? jsonData.errors.message 
														: '导出失败，请重试';
													console.error('后端返回错误:', errorMsg);
													uni.showToast({
														title: errorMsg,
														icon: 'none',
														duration: 3000
													});
													return;
												}
											} catch (e) {
												// 不是 JSON，继续打开文件
											}
											// 是正常文件，打开它
											that.openDownloadedFile(downloadRes.tempFilePath);
										};
										fileReader.onerror = function() {
											// 读取失败，直接尝试打开
											that.openDownloadedFile(downloadRes.tempFilePath);
										};
										fileReader.readAsText(file, 'utf-8');
									} else {
										// 文件大小正常，直接打开
										that.openDownloadedFile(downloadRes.tempFilePath);
									}
								}, function(fileErr) {
									console.error('读取文件信息失败:', fileErr);
									// 读取失败，直接尝试打开
									that.openDownloadedFile(downloadRes.tempFilePath);
								});
							}, function(err) {
								console.error('文件不存在:', err);
								uni.showToast({
									title: '文件不存在，请重试',
									icon: 'none'
								});
							});
							// #endif
							
							// #ifdef MP-WEIXIN
							// 微信小程序：先检查文件内容是否是 JSON 错误
							const fs = uni.getFileSystemManager();
							fs.readFile({
								filePath: downloadRes.tempFilePath,
								encoding: 'utf8',
								success: (readRes) => {
									try {
										// 尝试解析为 JSON
										const jsonData = JSON.parse(readRes.data);
										if (jsonData.status === 'failed' || jsonData.errors) {
											// 这是错误信息，不是文件
											const errorMsg = jsonData.errors && jsonData.errors.message 
												? jsonData.errors.message 
												: '导出失败，请重试';
											console.error('后端返回错误:', errorMsg);
											uni.showToast({
												title: errorMsg,
												icon: 'none',
												duration: 3000
											});
											return;
										}
									} catch (e) {
										// 不是 JSON，继续打开文件
									}
									// 是正常文件，打开它
									uni.openDocument({
										filePath: downloadRes.tempFilePath,
										success: function() {
											uni.showToast({
												title: '导出成功',
												icon: 'success'
											});
										},
										fail: function(err) {
											console.error('打开文件失败', err);
											uni.showToast({
												title: '打开文件失败',
												icon: 'none'
											});
										}
									});
								},
								fail: (readErr) => {
									console.error('读取文件失败:', readErr);
									// 读取失败，直接尝试打开
									uni.openDocument({
										filePath: downloadRes.tempFilePath,
										success: function() {
											uni.showToast({
												title: '导出成功',
												icon: 'success'
											});
										},
										fail: function(err) {
											console.error('打开文件失败', err);
											uni.showToast({
												title: '打开文件失败',
												icon: 'none'
											});
										}
									});
								}
							});
							// #endif
						} else {
							console.error('下载失败，状态码:', downloadRes.statusCode);
							uni.showToast({
								title: '导出失败，请重试',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('下载失败，错误详情:', err);
						console.error('错误码:', err.errMsg);
						console.error('完整错误:', JSON.stringify(err));
						uni.showToast({
							title: '导出失败，请重试',
							icon: 'none'
						});
					}
				});
				// #endif
				// #endif
			},
			// 打开已下载的文件（APP平台）
			openDownloadedFile(filePath) {
				console.log('准备打开文件:', filePath);
				uni.openDocument({
					filePath: filePath,
					success: function() {
						console.log('文件打开成功');
						uni.showToast({
							title: '导出成功',
							icon: 'success'
						});
					},
					fail: function(err) {
						console.error('打开文件失败', err);
						uni.showToast({
							title: '打开文件失败',
							icon: 'none'
						});
					}
				});
			},
			// 查看物流信息
			toexpressLog(invoice_no, order_id) {
				console.log('tolog', invoice_no, order_id);
				if (invoice_no && order_id) {
					uni.navigateTo({
						url: '/pagesB/express/expressLog?invoice_no=' + invoice_no + '&order_id=' + order_id
					})
				}
			},
			// 确定
			clickyes(res) {
				var that = this
				this.$refs[res].close()
				that.setOrderList(1)
			},
			// 点击店铺
			clicksell(index, item) {
				var that = this
				that.sellindex = index
				that.shopid = item.id
			},
			clickOrderType(index, item) {
				var that = this
				that.orderTypeindex = index
				that.orderTypeId = item.id
			},
			// 筛选时间
			clicktime(index, item) {
				var that = this
				that.timeindex = index
				that.onDateSelectorChange({ startDate: '', endDate: '' });
				if (this.$refs.dateSelector) {
				    this.$refs.dateSelector.onCancel();
				  }
			},
			// 显示底部弹框
			showPopup(res) {
				var that = this
				if (that.$isLogin()) {
					that.$refs[res].open()
				} else {
					uni.showModal({
						content: that.$t('lang.login_user_not'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pagesB/login/login?delta=1'
								});
							}
						}
					});
				}
				// if (res == 'address') {
				// 	this.regionShow = true;
				// }
			},
			// 关闭底部弹框
			closePop(res) {
				this.$refs[res].close()
			},
			closeNo(res) {
				var that = this
				this.$refs[res].close()
				that.shopid = ''
				that.timeindex = 0
				that.sellindex = ""
				that.page = 1
				that.loadMoreStatus = 'loading'
				that.setOrderList(1)
			},
			copyOrderSn(orderSn) {
				uni.setClipboardData({
					data: orderSn,
					success: function() {
						uni.showToast({
							title: this.$t('lang.copy_order_sn_success_msg')
						})
					}
				});
			},
			//搜索关键词输入
			keywordInput(e) {
				console.log(e.detail.value)
				var self = this;
				self.keyword = e.detail.value;
			},

			submitSelect() {
				this.page = 1;
				this.setOrderList()
			},
			//订单列表  
			setOrderList(page) {
				var that = this
				if (page) {
					that.page = page
					that.size = Number(page) * 10
				}
				console.log(that.page)
				// var abc = this.$store.dispatch('setOrderList', {
				// 	page: this.page,
				// 	size: this.size,
				// 	status: this.status,
				// 	type: this.type,
				// 	keywords: this.keyword,
				// })
				// console.log(abc)

				uni.request({
					// url: 'https://jiu.ok9288.com/api/order/list',
					url: 'https://www.ok9288.com/api/order/list',
					method: 'POST',
					data: {
						page: that.page,
						size: that.size,
						status: that.orderTypeId || that.status || 0,
						type: that.type,
						keywords: that.keyword,
						shop_id: that.shopid,
						time_type: that.timeindex,
						oder_type:that.orderTypeId,
						startDate:that.startDate,
						endDate:that.endDate,
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash': uni.getStorageSync('client_hash')
					},
					success: (res) => {
						// console.log('sousuores1', res.data)
						// console.log('orderlist1', res.data.data.list);
						// console.log('page1', that.page)
						if (res.data.status == 'success') {
							that.sellerlist = res.data.data.seller_list
							that.timelist = res.data.data.timelist
							that.orderTypeList = res.data.data.orderTypeList
						
							if (res.data.data.list.length > 0) {
								if (res.data.data.list.length < 10) {
									that.loadMoreStatus = 'noMore'
								} else {
									that.loadMoreStatus = 'loading'
								}
								if (that.page == 1) {
									that.orderList = res.data.data.list
									// that.orderList.forEach(item => {
									// 	item.isMore = false
									// })
									// console.log('orderlist2', that.orderList);
								} else {
									that.orderList = that.orderList.concat(res.data.data.list)
								}
								that.orderList.forEach(item => {
									item.isMorea = 0
								})
								that.page = that.page + 1
							} else {
								if (!res.data.data.list.length && that.page == 1) {
									that.loadMoreStatus = 'noMore'
									that.orderList = []
								} else {
									that.loadMoreStatus = 'noMore'
								}
							}
						} else if (res.data.errors.code == 12) {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'error'
							})
							setTimeout(function() {
								uni.navigateTo({
									url: '/pagesB/login/login'
								})
							}, 1000);
						}
					}
				})
			},
			//订单切换
			orderStatusHandle(index) {
				this.status = index
				this.orderTypeId = '' // 清空订单类型ID，使用tab的status
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				this.showLoadMore = true
				this.loadMoreStatus = 'loading'
				this.setOrderList(1)
			},
			//立即支付
			onlinepay(id, code) {
				uni.navigateTo({
					url: '/pagesD/done/done?order_sn=' + id,
				})
			},
			//申请退换货
			refoundHandle(id) {
				uni.navigateTo({
					url: '/pagesB/afterSales/afterSales?id=' + id,
				})
			},
			//删除订单
			delOrder(id) {
				this.$store.dispatch('setDeleteOrder', {
					order_id: id
				}).then(res => {
					if (res.data == true) {
						uni.showToast({
							title: this.$t('lang.order_delete_success'),
							icon: 'none'
						});
						this.setOrderList(1)
					}
				})
			},
			//订单还原
			delRestore(id) {
				this.$store.dispatch('setRestoreOrder', {
					order_id: id
				}).then(res => {
					if (res.data == true) {
						uni.showToast({
							title: this.$t('lang.suo_ding_1'),
							icon: 'none'
						});
						this.setOrderList(1)
					}
				})
			},
			//取消订单
			cancelOrder(id) {
				this.$store.dispatch('setOrderHandler', {
					order_id: id
				}).then(res => {
					if (res.data == true) {
						uni.showToast({
							title: this.$t('lang.order_cancel'),
							icon: 'none'
						});
						this.setOrderList(1)
					}
				})
			},
			//延迟收货
			delayOrder(id) {
				this.$store.dispatch('setDelayOrder', {
					order_id: id
				}).then(res => {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					if (res.data.error == 0) {
						this.setOrderList(1)
					}
				})
			},
			//确认收货
			receivedOrder(id) {
				// 找到对应的订单，设置 loading 状态
				const orderIndex = this.orderList.findIndex(item => String(item.order_id) === String(id));
				if (orderIndex !== -1) {
					this.$set(this.orderList[orderIndex], 'confirming', true);
				}
				
				this.$store.dispatch('setReceivedOrder', {
					order_id: id
				}).then(res => {
					if (res && res.status == 'success') {
						if (res.data === true) {
						uni.showToast({
							title: this.$t('lang.order_confirm_receipt'),
								icon: 'success',
								duration: 2000
							});
							// 更新订单状态：取消 loading，更新 handler 和 order_status
							if (orderIndex !== -1) {
								this.$set(this.orderList[orderIndex], 'confirming', false);
								this.$set(this.orderList[orderIndex], 'handler', 3);
								this.$set(this.orderList[orderIndex], 'order_status', '已完成');
							}
						} else if (res.data && typeof res.data === 'object' && res.data.error) {
							if (orderIndex !== -1) {
								this.$set(this.orderList[orderIndex], 'confirming', false);
							}
							uni.showToast({
								title: res.data.msg || '此订单已经确认过了',
								icon: 'none',
								duration: 2000
							});
						} else {
							if (orderIndex !== -1) {
								this.$set(this.orderList[orderIndex], 'confirming', false);
							}
							uni.showToast({
								title: '确认收货失败，请稍后重试',
							icon: 'none'
						});
						}
					} else {
						if (orderIndex !== -1) {
							this.$set(this.orderList[orderIndex], 'confirming', false);
						}
						uni.showToast({
							title: '确认收货失败，请稍后重试',
							icon: 'none'
						});
					}
				}).catch(err => {
					// 取消 loading
					if (orderIndex !== -1) {
						this.$set(this.orderList[orderIndex], 'confirming', false);
					}
					// 如果是用户主动取消，不显示任何提示
					if (err && err.message && err.message.includes('用户取消了确认收货操作')) {
						// 用户取消，不显示提示，静默处理
						return;
					}
					// 其他错误（网络错误、接口错误等）才显示失败提示
					uni.showToast({
						title: '确认收货失败，请稍后重试',
						icon: 'none'
					});
				});
			},
			commentOrder(id) {
				uni.navigateTo({
					url: '../comment/comment?order_id=' + id
				})
			},
			//再次购买
			buyAgain(id) {
				this.$store.dispatch('setbuyAgain', {
					id: id
				}).then(res => {
					if (res.data.error == 0) {
						if (res.data.cant_buy_goods.length == 0) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
							// setTimeout(() => {
							// 	uni.switchTab({
							// 		url: '/pages/cart/cart'
							// 	});
							// }, 500)
						} else {
						uni.showModal({
							// content: this.$t('lang.order_buy_again_propmt'),
							content: res.data.msg,
							cancelText: this.$t('lang.go_cart'),
							confirmText: this.$t('lang.stay_on_page'),
							success: (res) => {
								if (res.cancel) {
									uni.switchTab({
										url: '/pages/cart/cart',
										success: () => {
											// 【关键修复】跳转成功后，通知 tabbar 更新选中状态
											setTimeout(() => {
												uni.$emit('switch-tab');
											}, 100);
										}
									});
								}
							}
						})
						}
					} else {
						uni.showToast({
							title: this.$t('lang.parameter_error'),
							icon: 'none'
						});
						this.setOrderList(1)
					}
				})
			},
			invoiceDetail(id) {
				uni.navigateTo({
					url: '/pagesC/shouqianba/invoiceDetail?order_id=' + id
				})
			},

			fileterScrollTop(e) {
				//当视图渲染结束 重新设置为0
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
			},
			navigateBack() {
				uni.navigateBack()
			},
		},
		onLoad(e) {
			var that = this
			if (e.tab) {
				this.orderStatusHandle(e.tab)
			} else {
				this.setOrderList(1)
			}
		},
		onShow() {	

		},
		onPageScroll(e) {
			this.scrollState = e.scrollTop > 800 ? true : false
		},
		onReachBottom() {
			this.showLoadMore = true
			this.loadMoreStatus = 'loading';
			this.setOrderList()
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/order/order'
			}
		},
		onReady() {
			var that = this
			uni.getSystemInfo({
				success: function(res) {
					let model = res.model;
					console.log(model)
					let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11',
						'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE', 'iPhone 12 mini', 'iPhone 12',
						'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13 mini', 'iPhone 13',
						'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Puls',
						'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Puls',
						'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Puls',
						'iPhone 16 Pro', 'iPhone 16 Pro Max'
					]
					iphoneArr.forEach(function(item) {
						if (model.search(item) != -1) {
							that.isIpx = true
						}
					})
				}
			})
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					this.gaodu = this.menuButtonInfo.height + (this.menuButtonInfo.top - res.statusBarHeight) *
						2; //导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				}
			})
			// #endif
			const {
				windowHeight,
				windowWidth
			} = uni.getSystemInfoSync();
			this.vw = windowWidth;
			this.$set(this.popHeight, 'hd', parseInt(windowHeight * 0.65));
			this.$set(this.popHeight, 'bd', parseInt(windowHeight * 0.65) - uni.upx2px(90));
			this.$set(this.popHeight, 'center', parseInt(windowHeight * 0.65) - uni.upx2px(190));

		},
		watch: {
			orderList() {
				this.dscLoading = false
			}
		}
	}
</script>

<style lang="scss">
	/* 防止键盘弹起时页面移动（和首页一样的方案） */
	page {
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		position: relative;
		/* #endif */
	}
	
	.container {
		width: 100%;
		overflow-x: hidden;
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		/* #endif */
	}
	
	.order-type {
	  width: 100%;
	 
	  display: grid;
	 
	  grid-template-columns: repeat(auto-fill, minmax(140rpx, 1fr));
	
	  grid-gap: 20rpx; 
	  font-size: 24rpx;
	  padding: 0 10rpx; 
	}
	
	.order-type-item {
	  margin-top: 16rpx;
	  padding: 16rpx 0; 
	  background: #F5F5F5;
	  border-radius: 8rpx;
	  text-align: center; 
	
	  word-break: break-all;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  overflow: hidden;
	}
	.orderTypecurrent {
		background: rgba(254, 3, 2, 0.08) !important;
		color: #FE0302;
	}
	.select-date {
		padding: 10rpx !important; 
		border-radius: 10rpx !important;
	}

	.timetitle {
		margin: 30rpx 0rpx 10rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 32rpx;
		color: #1B1B1B;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
	}

	.timeall {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		font-size: 24rpx;

		.timeitem {
			padding:16rpx 50rpx;
			background: #F5F5F5;
			border-radius: 8rpx;
			margin-top: 16rpx;
			// margin-right: 32rpx;
			margin-right: 30rpx;
			text-align: center;
			word-break: break-all;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.timecurrent {
			background: rgba(254, 3, 2, 0.08) ;
			color: #FE0302;
		}


	}
	
	.sellall {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		font-size: 24rpx;

		.sellitem {
			width: 38%;
			padding: 16rpx 30rpx 4rpx;
			height: 52rpx;
			// line-height: 52rpx;
			// line-height: 3.0;
			text-align: left;
			border-radius: 8rpx;
			margin: 15rpx 0rpx;
			background: #F5F5F5;
			word-break: break-all;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			overflow: hidden;


		}

		.sellcurrent {
			background: rgba(254, 3, 2, 0.08);
			color: #FE0302;
		}
	}

	/* 导航栏开始 */
	.main-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		background-color: #f8f8f8;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		right: 0 !important;
		transform: translateZ(0);
		/* #endif */
	}

	.status_bar {
		background-color: #f9f9f9;
		height: var(--status-bar-height);
		width: 100%;
	}

	.chat_1 {
		margin-bottom: 12rpx;
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
		padding: 10rpx 30rpx 10rpx 30rpx;
		margin-top: var(--status-bar-height);
		/* #endif */
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		position: relative;
		transform: translateZ(0);
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

	.pop_content {
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #fff;
		padding: 0rpx 30rpx 30rpx;

		.pop_header {
			position: relative;
			padding: 0 30rpx;
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;

			.icon-find-fanhui {
				position: absolute;
				top: 50%;
				left: 30rpx;
				transform: translateY(-50%);
				font-size: 28rpx;
			}

			.pop_title {
				font-size: 32rpx;
				font-weight: 700;
				line-height: 90rpx;
				color: #282828;
			}

			.close_img {
				position: absolute;
				top: 50%;
				right: 0rpx;
				transform: translateY(-50%);
				width: 44rpx;
				height: 44rpx;
			}
		}

		.pop_scroll_view {
			// padding: 0 30rpx 30rpx;

			.label_text {
				// margin-bottom: 0.2rem;
				font-weight: 700;
				color: #000;
			}

			.list_wrap {
				margin-bottom: 20rpx;
			}

			.pop_activity_item {
				display: flex;
				align-items: baseline;

				&:nth-child(n + 2) {
					margin-top: 20rpx;
				}

				.activity_bg {
					flex: none;
					height: 38rpx;
					line-height: 38rpx;
					padding: 0 10rpx;
					text-align: center;
					border-radius: 4rpx;
					margin-right: 16rpx;
					font-size: 24rpx;
					color: #F44C36;
					background: #FEE9E6;
				}

				.activity_tips {
					flex: auto;
					line-height: 40rpx;
				}
			}

		}

		.btnend {
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20rpx 36rpx;
		}

		.btn_wrap {
			flex: 1;
			padding: 26rpx 0;
			border-radius: 44rpx;
			border: 1rpx solid #C0C0C0;
			text-align: center;
			font-size: 32rpx;
			color: #1B1B1B;


		}

		.red_btn {
			background: #FE0302;
			margin-left: 36rpx;
			color: #FFFFFF;
			border: none;
		}

		.coupons_list {
			.coupons_item {
				display: flex;
				margin-top: 20rpx;
			}

			.coupons_left {
				position: relative;
				flex: none;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 200rpx;
				height: 200rpx;
				border-radius: 20rpx 0 0 20rpx;
				color: #fff;
				background-color: #f52923;

				.coupon_price {
					margin-top: 30px;
					font-size: 52rpx;
					line-height: 1;
				}

				.coupon_desc {
					margin-top: 10px;
					padding: 0 20rpx;
					text-align: center;
					font-size: 22rpx;
				}

				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
					transform: translate(50%, 50%);
					border-radius: 50%;
					background-color: #fff;
					z-index: 2;
				}

				&:before {
					content: '';
					position: absolute;
					top: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
					transform: translate(50%, -50%);
					border-radius: 50%;
					background-color: #fff;
					z-index: 2;
				}
			}

			.coupons_right {
				overflow: hidden;
				position: relative;
				flex: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				max-width: calc(100% - 200rpx);
				border-radius: 0 20rpx 20rpx 0;
				border: 1px solid #f2d2d2;
				border-left-width: 0;
				background-color: #fbf2f2;

				.coupon_title {
					margin: 16rpx 20rpx 0;
					font-size: 26rpx;
					color: #999;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;

					.coupon_tag {
						display: inline-block;
						padding: 0 16rpx;
						height: 48rpx;
						line-height: 48rpx;
						border-radius: 10rpx;
						margin-right: 20rpx;
						text-align: center;
						font-size: 26rpx;
						color: #fff;
						background-color: rgba(245, 41, 35, .6);
					}
				}

				.get_coupon_time {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 20rpx;

					.coupon_time {
						flex: 1;
						margin: 0 20rpx;
						font-size: 26rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #999;
					}

					.coupon_btn {
						// min-width: 160rpx;
						height: 48rpx;
						line-height: 44rpx;
						border-radius: 26rpx;
						text-align: center;
						padding: 0 15rpx;
						font-size: 24rpx;
						margin-right: 20rpx;
						border: 2rpx solid #F52923;
						color: #fff;
						background-color: #F52923;
					}

					.u-reset-disabled {
						background: #999999;
						color: #FFFFFF;
						border-color: #999999;
					}

					.is_get_btn {
						color: #F52923;
						background-color: transparent;
					}
				}

				&:after {
					content: '';
					position: absolute;
					bottom: -24rpx;
					left: -22rpx;
					width: 42rpx;
					height: 42rpx;
					// transform: translate(-50%, -50%);
					border-radius: 50%;
					background-color: #f2d2d2;
				}

				&:before {
					content: '';
					position: absolute;
					top: -24rpx;
					left: -22rpx;
					width: 42rpx;
					height: 42rpx;
					// transform: translate(-50%, -50%);
					border-radius: 50%;
					background-color: #f2d2d2;
				}
			}
		}
	}

	.listall {
		width: 100%;
		/* #ifdef MP-WEIXIN */
		margin-top: var(--status-bar-height);
		/* #endif */
		/* #ifdef APP-PLUS */
		position: relative;
		/* #endif */
	}

	.section-list {
		width: 100%;
		/* #ifdef APP-PLUS */
		position: relative;
		/* #endif */
	}

	.product-list .product-info {
		display: flex;
		align-items: center;
	}

	.product-list .product-more {
		display: flex;
		align-items: center;
	}

	.add_time {
		padding-right: 15upx;
	}

	// .btn-bar-mins {
	// 	padding: 0 0;
	// 	display: flex;
	// 	justify-content: flex-end;
	// }

	.morebtn {
		// width: 56rpx;
		// height: 28rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #A2A2A2;
		line-height: 28rpx;
		text-align: left;
		font-style: normal;
	}

	.moreBtns {
		// width: 100%;
		width: 220rpx;
		// position: absolute;
		background: #FFFFFF;
		border-radius: 8px;
		box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.15);
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		transform: translateZ(0);
		/* #endif */

		.btns {
			font-weight: 400;
			font-size: 28rpx;
			color: #1B1B1B;
			line-height: 28rpx;
			text-align: left;
			font-style: normal;
			padding: 20rpx;
			border-bottom: 2rpx solid #EDEDED;
			width: 70%;
			// margin-left: 5px;
			margin: 0 10rpx;
		}

		.btns:last-child {
			border-bottom: none;
		}
	}

	.triangle-white {
		width: 0;
		height: 0;
		border-left: 17px solid transparent;
		border-right: 17px solid transparent;
		// border-top: 12px solid white;
		border-bottom: 12px solid white;
		position: absolute;
		// bottom: -7%;
		top: -10%;
		left: 3%;
	}

	.btn-bar-mins {
		// padding: 0 0;
		display: flex;
		justify-content: flex-end;
	}


	.btn-bar-mins .btn {
		width: 176rpx;
		background: #FFFFFF;
		border-radius: 46rpx;
		border: 2rpx solid #BBBBBB;
		margin-left: 10upx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 60rpx;
		text-align: center;
		font-style: normal;
	}
	
	.btn-bar-mins .btn.btn-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		height: 60rpx;
		overflow: hidden;
	}
	
	.btn-bar-mins .btn.btn-loading .uni-load-more {
		height: 60rpx;
		line-height: 60rpx;
	}
	
	.btn-bar-mins .btn.btn-loading .uni-load-more__img {
		width: 32rpx;
		height: 32rpx;
	}
	

	.btn:last-child {
		color: #FFB211;
		border: 2rpx solid #FFB211;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.fx-adv {
		width: 100%;
		line-height: 0;
		font-size: 0;
		position: fixed;
		top: 45px;
		z-index: 99;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		transform: translateZ(0);
		/* #endif */
	}

	.fx-adv image {
		width: 100%;
	}

	.container-tab-bar-top {
		padding-top: 123px;
	}


	.selectBox {
		width: 690rpx;
		margin: 10rpx 20rpx 0;
		background-color: #fff;
		border-radius: 50rpx;
		text-align: left;
		/* #ifdef APP-PLUS */
		/* 防止键盘弹起时移动 */
		position: relative;
		transform: translateZ(0);
		/* #endif */
	}

	.selectBox input {
		line-height: 70rpx;
		padding: 0 20rpx 0 26rpx;
		height: 70rpx;
		font-size: 32rpx;
	}

	.tab-bar {
		/* #ifdef H5 */
		position: fixed;
		top: 90px;
		/* #endif */
		/* #ifdef APP-PLUS */
		position: fixed;
		top: 90px;
		/* 防止键盘弹起时移动 */
		position: fixed !important;
		transform: translateZ(0);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		position: fixed;
		top: 100px;
		/* #endif */
	}

	.shaibtn {
		width: 40rpx;
		height: 40rpx;
		/* #ifndef MP-WEIXIN */
		margin-top: 20rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin-top: 10rpx;
		/* #endif */
	}


	uni-view {
		font-size: 14px;
		line-height: normal;
	}

	.express {
		margin: 26rpx 0rpx;
		padding: 0 20rpx;
		// width: 686rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #FFF4F4;
		background: #F5F5F5;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;


		.expressStatus {
			flex-direction: row;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;
		}

		.statusb {
			color: #1B1B1B;
			height: 28rpx;
			font-weight: 600;
			font-size: 28rpx;
			line-height: 28rpx;
			text-align: left;
			margin-left: 16rpx;
		}

		.statusNew {
			color: #FFB211;
			height: 28rpx;
			line-height: 28rpx;
			font-weight: 600;
			font-size: 28rpx;
			line-height: 28rpx;
			text-align: left;
			margin-left: 16rpx;
			// width: 50%;
		}

		.statusText {
			flex: 1;
			max-width: 430rpx;
			height: 28rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #A2A2A2;
			line-height: 28rpx;
			text-align: left;
			font-style: normal;
			margin-left: 16rpx;

			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			white-space: normal;
			word-break: break-all;
		}

		.expressCode {
			font-size: 28rpx;
			color: #FFB211;
			line-height: 28rpx;
			text-align: left;
			margin-left: 16rpx;
		}

		.isNow {
			color: #FFB211;
		}

	}

	.expressnew {
		// background: #FFF4F4;
		background: #F5F5F5;
	}


	// .order-item button {
	//   position: relative;
	// }
	// .popup-content {
	//   width: 100%;
	//   box-sizing: border-box;
	//   padding: 10px 0;
	//   background-color: #fff;
	//   box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
	// }
	.order-status {
		max-width: 35%;
	}
	
	.pop_content {
	  padding-bottom: env(safe-area-inset-bottom);
	  border-top-left-radius: 30rpx;
	  border-top-right-radius: 30rpx;
	  background-color: #fff;
	  padding: 0rpx 30rpx 30rpx;
	  max-height: 80vh; /* 限制最大高度 */
	  overflow-y: auto; /* 允许滚动 */
	  position: relative;
	  /* #ifdef APP-PLUS */
	  /* 防止键盘弹起时移动 */
	  transform: translateZ(0);
	  /* #endif */
	}
	
	/* 确保日期选择器区域有固定高度 */
	.date-selector-container {
	  position: relative;
	  min-height: 200rpx; /* 为日期选择器预留固定高度 */
	}
</style>