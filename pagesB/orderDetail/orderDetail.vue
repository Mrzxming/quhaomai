<template>
	<view class="container fixed-bottom-padding">
		<!-- 订单详情加载中 -->
		<view v-if="orderDetailLoading" class="order-detail-loading">
			<uni-load-more status="loading" :show-icon="true"></uni-load-more>
		</view>
		<!-- 订单详情内容 -->
		<view v-else>
		<view @click="copyStoreAddress" class="flow-checkout-adr flow-store-adr"
			v-if="orderDetail.offline_store && orderDetail.offline_store.stores_name != undefined ">
			<uni-icons type="location" size="28" color="#999999"></uni-icons>
			<view class="store-content">
				<view class="tit">{{ orderDetail.offline_store.stores_name }}</view>
				<text v-if="orderDetail.take_time">{{$t('lang.store_order_time')}}：{{ orderDetail.take_time }}</text>
				<text>{{$t('lang.service_call')}}: {{ orderDetail.offline_store.stores_tel }}</text>
				<text>{{$t('lang.business_hours')}}: {{ orderDetail.offline_store.stores_opening_hours }}</text>
				<text>{{$t('lang.label_store_address')}}{{ orderDetail.offline_store.stores_address }}</text>
			</view>
		</view>
		<view class="flow-checkout-adr" v-else @click="copyUserAddress">
			<view class="adr-content">
				<view class="title" style="font-size: 32rpx;display: flex;
    justify-content: space-between;">
					<view class="left">
						<text class="name">{{ orderDetail.consignee }}</text>
						<text class="mobile" style="font-size: 32rpx;">{{ orderDetail.mobile }}</text>
					</view>
					<!--  -->
					<text class="edit-btn" v-if="orderDetail.is_can_edit_addr == 1" @click.stop="showPop('address')">修改</text>
					<text class="edit-text" v-if="orderDetail.is_can_edit_addr == 2" >审核中</text>
				</view>
				<view class="address"><text class="post_lebal_red"
						v-if="orderDetail.post_mobile">{{$t('lang.community_post')}}</text>{{ orderDetail.address }}
				</view>
				<view v-if="orderDetail.post_mobile">{{$t('lang.post_contact_number')}}: {{orderDetail.post_mobile}}
				</view>
			</view>
		</view>
		<view class="head-top" v-if="orderDetail.trackerinfo">
			<view class="express-top" @click="toexpressLog(orderDetail.trackerinfo,orderDetail.order_id)">
				<view class="" style="display: flex;align-items: center;justify-content: space-between;">
					{{orderDetail.trackerinfo.length>1?'多包裹发货':'您的购买包裹'}}
				</view>
				<view class="" style="display: flex;align-items: center;">
					<text>查看物流</text>
					<uni-icons type="arrowright" size="16" color="#999999" style=""></uni-icons>
				</view>
			</view>
			<view class="" v-for="(item,index) in orderDetail.trackerinfo">
				<view class="" style="width:620rpx;height: 2rpx;background-color: #EDEDED;margin: 30rpx 0;"></view>
				<view class="" style="display: flex;">
					<view class="" style="" v-if="item.img">
						<image :src="item.img" mode="widthFix" style="width: 40rpx;height: 40rpx;margin-right: 20rpx;">
						</image>
					</view>
					<view class="">
						<text class="expressStatus" v-if="item.invoice_state"
							:class="{'active':item.invoice_state !=='包裹已签收' || item.invoice_state !=='待发货'}">
							{{item.invoice_state}}
						</text>
						<text class="expressStatus title " style="margin-left: 32rpx;"
							v-if="item.title">{{item.title}}</text>
					</view>
				</view>
				<view class="" v-if="item.invoice_info"
					style="font-size: 24rpx;color: #1B1B1B;line-height: 36rpx;text-align: left;margin-top: 16rpx;">
					{{item.invoice_info}}
				</view>
			</view>
		</view>
		<view class="head-center" style="">
			<view class="flow-checkout-item claim_goods_box" v-if="orderDetail.post_delivery_code">
				<view>{{$t('lang.post_pickup_code')}}</view>
				<view>{{orderDetail.post_delivery_code}}</view>
				<view><text @click="viewQrCode">{{$t('lang.view_qr_code')}}</text></view>
			</view>
			<view class="flow-checkout-item claim_goods_box" v-if="orderDetail.pick_code">
				<view>{{$t('lang.take_delivery_code')}}</view>
				<view>{{orderDetail.pick_code}}</view>
				<view><text @click="viewMnCode">{{$t('lang.view_qr_code')}}</text></view>
			</view>
			<view class="section-list">
				<view class="user-itemnew">
					<view class="item-hd">
						<view class="shop-name">{{orderDetail.shop_name}}</view>
						<!-- #ifdef MP-WEIXIN -->
						<button open-type="contact" type="default" size="5" session-from="weapp" hover-class="none"
							class="kefu kefu-cantact" v-if="wxappChat > 0">
							<text>{{$t('lang.relation_contact')}}</text>
							<text class="iconfont icon-kefu uni-red"></text>
						</button>
						<view class="kefu" @click="onChat(orderDetail.shop_name,'',orderDetail.shop_id)" v-else>
							<text>{{$t('lang.relation_contact')}}</text>
							<text class="iconfont icon-kefu uni-red"></text>
						</view>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<view class="kefu" @click="onChat(orderDetail.shop_name,'',orderDetail.shop_id)">
							<text>{{$t('lang.relation_contact')}}</text>
							<text class="iconfont icon-kefu uni-red"></text>
						</view>
						<!-- #endif -->
					</view>
					<view class="item-bd">
						<view class="subHead">
							<view class="item">
								<view class="tit">{{$t('lang.order_sn')}}：</view>
								<view class="value" @click="copyOrderSn">{{ orderDetail.order_sn }}</view>
							</view>
							<view class="item">
								<view class="tit">{{$t('lang.order_time')}}：</view>
								<view class="value time mr10">{{ orderDetail.add_time }}</view>
								<view class="tag">
									<block v-if="orderDetail.team_id > 0">
										<block v-if="orderDetail.failure != 1">{{$t('lang.team_order')}}</block>
										<block v-else>{{$t('lang.team_fail')}}</block>
									</block>
									<uni-tag :text="orderDetail.activity_lang" size="small" type="error"
										v-if="orderDetail.activity_lang != ''"></uni-tag>
								</view>
							</view>
						</view>
						<view class="product-list product-list-max" v-if="listShow">
							<view class="product-items">
								<view class="item" hover-class="none"
									v-for="(goodsItem,goodsIndex) in orderDetail.goods" :key="goodsIndex"
									@click="productLink(goodsItem)">
									<view class="product-imgnew">
										<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
											class="icon" v-if="goodsItem.is_gift > 0"></image>
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_E365D05180E0B99317BD2B8A25E11F48.png"
											class="icon" v-if="goodsItem.parent_id > 0"></image>
									</view>
								</view>
							</view>
							<view class="product-more" @click="onListShow">
								<text>{{$t('lang.gong')}} {{ length }} {{$t('lang.kuan')}}</text>
								<uni-icons type="forward" size="18" color="#999999"></uni-icons>
							</view>
						</view>
						<view class="product-list" v-else>
							<view class="product-items">
								<view class="item" v-for="(goodsItem,goodsIndex) in orderDetail.goods"
									:key="goodsIndex">
									<view class="product-imgnew" @click="productLink(goodsItem)">
										<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_3B64DEA992DEA47F1AEF1C5FAAB1066B.png"
											class="icon" v-if="goodsItem.is_gift > 0"></image>
										<image
											src="https://images.eqingqu.com/attachs/photo/202404/20240416_E365D05180E0B99317BD2B8A25E11F48.png"
											class="icon" v-if="goodsItem.parent_id > 0"></image>
									</view>
									<view class="product-info">
										<view class="product-name twolist-hidden" @click="productLink(goodsItem)">
											<image class="country_icon" :src="goodsItem.country_icon" :lazy-load="true"
												v-if="goodsItem.country_icon"></image>{{ goodsItem.goods_name }}
										</view>
										<view class="product-attr">{{ goodsItem.goods_attr }}</view>
										<view class="product-row">
											<view class="price">
												<view><text  style="margin-right: 10rpx;font-size: 28rpx;" v-if="goodsItem.kefu_change_discount_price">优惠后</text>{{ goodsItem.goods_price_formated }}</view>		
												<view v-if="goodsItem.kefu_change_discount_price > 0" style="color: #1b1b1b;font-size: 24rpx;">{{goodsItem.kefu_change_discount_price}}</view>
												</view>
											
											<view class="number">x{{ goodsItem.goods_number }}件</view>
											<view class="btn-bar-min"
												v-if="goodsItem.goods_handler_return && goodsItem.is_gift == 0">
												<view class="btn" @click="refoundHandle(goodsItem.rec_id,0)"
													v-if="goodsItem.is_refound == 0">{{$t('lang.apply_return')}}</view>
												<view class="btn" @click="refoundHandle(goodsItem.ret_id,1)" v-else>
													{{$t('lang.already_apply_return')}}
												</view>
											</view>
										</view>
										<view class="p-virtual"
											v-if="goodsItem.virtual_goods && goodsItem.virtual_goods.length > 0">
											<view v-for="(virtualItem,virtualIndex) in goodsItem.virtual_goods"
												:key="virtualIndex">
												<view class="virtual-item">{{$t('lang.virtual_card_number')}}：<text
														class="link"
														@click="virtualLink(virtualItem.card_sn)">{{virtualItem.card_sn}}</text><text
														class="copy" @click="copyCard(virtualItem.card_sn)">复制</text>
												</view>
												<view class="virtual-item">
													{{$t('lang.virtual_card_pwd')}}：{{virtualItem.card_password}}<text
														class="copy"
														@click="copyCard(virtualItem.card_password)">复制</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- <view class="product-more" @click="onListShow" v-if="length > 1"><uni-icons type="arrowdown" size="18" color="#999999"></uni-icons></view> -->
						</view>
					</view>
				</view>
			</view>


		</view>


		<view class="uni-card uni-card-not" v-if="orderDetail.shipping_id && !orderDetail.offline_store">
			<view class="uni-list" style="border-radius: 10px;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.shipping_mode')}}</text>
						<view class="value">
							<text class="mr10" v-if="orderDetail.shipping_name">{{ orderDetail.shipping_name }}</text><text
								class="uni-red" v-if="orderDetail.shipping_fee_formated">{{ orderDetail.shipping_fee_formated }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-custom"
					v-if="orderDetail.postscript && !orderDetail.main_count > 0">
					<view class="uni-list-cell-navigate">
						<view class="value">
							<view>{{$t('lang.buyer_message')}}：{{ orderDetail.postscript }}</view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-custom" v-if="orderDetail.businessMessage">
					<view class="uni-list-cell-navigate">
						<view class="value">
							<view><text style="color: #f44;">商家留言：</text>{{ orderDetail.businessMessage }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="orderDetail.cross_warehouse_name != ''" style="margin-top: -20rpx;">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.place_of_shipment')}}</text>
						<view class="value">
							<text style="color: #6C6C6C;">{{ orderDetail.cross_warehouse_name }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.payment_mode')}}</text>
						<!-- <view class="value">{{ orderDetail.pay_name }}</view> -->
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-custom"
					v-if="orderDetail.exchange_goods == 0 && orderDetail.can_invoice > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.invoice_info')}}</text>
						<view class="value">
							<block v-if="orderDetail.invoice_type == 1">
								<view>{{$t('lang.label_invoice_content')}} {{$t('lang.vat_tax_invoice')}}</view>
							</block>
							<block v-if="orderDetail.invoice_type == 0">
								<view>{{$t('lang.label_invoice_company')}}{{ orderDetail.inv_payee }}</view>
								<view>{{$t('lang.label_invoice_content')}}{{ orderDetail.inv_content }}</view>
							</block>
							<block v-if="orderDetail.invoice_type == 2">
								<view class="lie">
									<view class="text">发票类型：电子普通发票</view>
									<view class="more uni-red" @click="invoiceDetail(orderDetail.order_id)">查看发票详情
									</view>
								</view>
								<view>{{$t('lang.label_invoice_company')}}{{ orderDetail.inv_payee }}</view>
								<view>{{$t('lang.label_invoice_content')}}{{ orderDetail.inv_content }}</view>
							</block>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.bonus_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.bonus')}}</text>
						<view class="value">
							<text class="mr10">{{$t('lang.bonus_amount')}}</text><text
								class="uni-red">{{ orderDetail.bonus }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.coupons_type > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.coupons')}}</text>
						<view class="value">
							<text class="mr10">{{$t('lang.coupon_amount')}}</text><text
								class="uni-red">{{ orderDetail.coupons }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.vc_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.value_card')}}</text>
						<view class="value">
							<text class="mr10">{{$t('lang.value_card_amount')}}</text><text
								class="uni-red">{{ orderDetail.card_amount }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.integral > 0 && orderDetail.exchange_goods == 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.integral')}}</text>
						<view class="value">
							<text class="mr10">{{$t('lang.integral_deduction_amout')}}</text><text
								class="uni-red">{{ orderDetail.integral_money }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="orderDetail.is_has_snapshot == 1">
			<view class="uni-list">
				<view class="uni-list-cell" @click="onSnapshotClick">
					<view class="uni-list-cell-navigate">
						<text class="title">交易快照</text>
						<view class="value">
							<text class="snapshot-desc">发生交易争议时，可作为判断依据</text>
							<uni-icons type="arrowright" size="16" color="#999999" style="margin-left: 10rpx;"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.goods_amout')}}</text>
						<view class="value uni-red" v-if="orderDetail && orderDetail.goods_amount_formated">{{ orderDetail.goods_amount_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="discount > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.goods_favorable')}}</text>
						<view class="value uni-red">-{{ orderDetail.discount_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="!orderDetail.offline_store && orderDetail && orderDetail.shipping_fee_formated">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.shipping_fee')}}</text>
						<view class="value uni-red">+{{ orderDetail.shipping_fee_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.rate_fee > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.comprehensive_tax')}}</text>
						<view class="value uni-red">+{{ orderDetail.rate }}</view>
					</view>
				</view>
				<block v-if="orderDetail.membership_card_id && orderDetail.membership_card_id > 0">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.membership_card_buy_money')}}</text>
							<view class="value uni-red">+{{ orderDetail.membership_card_buy_money_formated }}</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="title">{{$t('lang.membership_card_discount_price')}}</text>
							<view class="value uni-red">-{{ orderDetail.membership_card_discount_price_formated }}
							</view>
						</view>
					</view>
				</block>
				<view class="uni-list-cell" v-if="orderDetail.bonus_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.use_bonus')}}</text>
						<view class="value uni-red">-{{ orderDetail.bonus }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.coupons_type > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.use_coupons')}}</text>
						<view class="value uni-red">-{{ orderDetail.coupons }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.vc_id > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.use_value_card')}}</text>
						<view class="value uni-red">-{{ orderDetail.card_amount }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.vc_dis_money > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.value_card_discount')}}</text>
						<view class="value uni-red">-{{ orderDetail.vc_dis_money_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.integral > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.use_integral')}}</text>
						<view class="value uni-red">
							<text
								style="text-align: right;">-{{ orderDetail.integral_money }}\n({{orderDetail.integral}}{{$t('lang.integral')}})</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.surplus > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.use_balance')}}
							<block v-if="orderDetail.presale_final_pay">(支付定金)</block>
						</text>
						<view class="value uni-red">-{{ orderDetail.surplus_formated  }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail.money_paid > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.pay_in_balance')}}</text>
						<view class="value uni-red">-{{ orderDetail.money_paid_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="orderDetail && orderDetail.kefu_change_discount_price_total && orderDetail.kefu_change_discount_price_total.length > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.kefu_change_price')}}</text>
						<view class="value uni-red">{{ orderDetail.kefu_change_discount_price_total }}</view>
					</view>
				</view>
			</view>
		</view>

		<!--银行卡信息-->
		<view class="uni-card uni-card-not" v-if="orderDetail.pay_code == 'bank'">
			<view class="uni-list">
				<view class="uni-list-cell" v-for="(bankItem,bankIndex) in orderDetail.pay_config" :key="bankIndex">
					<view class="uni-list-cell-navigate">
						<text class="title">{{bankItem.name}}</text>
						<view class="value uni-red">{{ bankItem.value }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="uni-card uni-card-not" v-if="orderDetail.delay === 1">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="title">{{$t('lang.delay_in_receiving')}}</text>
						<view class="value">
							<block v-if="orderDetail.delay_type == '申请'">
								<button type="warn" size="mini"
									@click="delayOrder(orderDetail.order_id)">{{ orderDetail.delay_type }}</button>
							</block>
							<block v-else>
								<text class="uni-red">{{ orderDetail.delay_type }}</text>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-goods-actionnew"
			:class="{'btn-goods-action-custom':(totalAmountInt > 0 || orderDetail.tracker) && !orderDetail.pay_config && orderDetail.handler != 8}">
			<view class="submit-bar-text" v-if="orderDetail.pay_status == 2">
				<text>{{$t('lang.suo_money')}}：</text>
				<view class="submit-bar-price">{{ orderDetail.realpay_amount_formated }}</view>
			</view>
			<view class="submit-bar-text" v-else>
				<text>{{$t('lang.label_total_amount_payable')}}</text>
				<view class="submit-bar-price">{{ amountPrice }}</view>
			</view>
			<view class="btn-bar">
				<block v-if="orderDetail.pay_code != 'cod' && orderDetail.pay_code != 'bank'">
					<view class="btnnew btn-red"
						v-if="orderDetail.total_amount > 0 && orderDetail.handler != 7 && orderDetail.handler != 8 && orderDetail.failure == 0"
						@click="onlinepay(orderDetail.order_sn)">{{ buttonText }}</view>
				</block>
				<block v-if="orderDetail.handler == 2">
					<view class="btnnew btn-red" @click="receivedOrder(orderDetail.order_id)">{{$t('lang.received')}}
					</view>
				</block>
				<block v-if="orderDetail.handler == 4">
					<view class="btnnew btn-red">{{$t('lang.ss_received')}}</view>
				</block>

				<block v-if="orderDetail.handler == 1">
					<view class="btnnew btn-org" @click="onClickBigBtn(orderDetail.order_id)">
						{{$t('lang.cancel_order')}}
					</view>
				</block>
				<block v-if="orderDetail.handler == 3">
					<view class="btnnew btn-org" @click="onCommentBtn(orderDetail.order_id)">{{$t('lang.ping_ja')}}
					</view>
				</block>
				<block v-if="orderDetail.handler == 5">
					<view class="btnnew btn-org">{{$t('lang.payment')}}</view>
				</block>
				<block v-if="orderDetail.handler == 6">
					<view class="btnnew btn-org">{{$t('lang.confirmed')}}</view>
				</block>
				<block v-if="orderDetail.handler == 7">
					<view class="btnnew btn-gray">{{$t('lang.canceled')}}</view>
				</block>
				<block v-if="orderDetail.handler == 8">
					<view class="btnnew btn-org">{{$t('lang.invalid_order')}}</view>
				</block>
				<block v-if="orderDetail.tracker">
					<view class="btnnew btn-org" @click="orderTracking(orderDetail)">{{$t('lang.order_tracking')}}
					</view>
				</block>
			</view>
		</view>
		<!-- 门店二维码弹框 -->
		<view class="popup_box" v-if="showMnPopup">
			<view class="qr_code_box">
				<view class="qr_code">
					<view class="qr_code_title">
						{{$t('lang.take_delivery_code')}}<text @click="showMnPopup = false">×</text>
					</view>
					<view class="qr_code_content">
						<!-- <image :src="qrCodeData.qrcode_url" class="qr_code_img" ></image> -->
						<view class="qr_code_img_new">
							<canvas canvas-id="qrcode" style="height: 180px; width: 180px;" />
						</view>
						<view class="qr_code_text">
							<view class="pic">{{orderDetail.pick_code}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 二维码弹框 -->
		<view class="popup_box" v-if="showPopup">
			<view class="qr_code_box">
				<view class="qr_code">
					<view class="qr_code_title">
						{{$t('lang.proof_delivery')}}<text @click="showPopup = false">×</text>
					</view>
					<view class="qr_code_content">
						<image :src="qrCodeData.pick_up_avatar" class="qr_code_img"></image>
						<view class="qr_code_text">
							<view>{{orderDetail.post_delivery_code}}</view>
							<view>{{$t('lang.label_tel')}} {{orderDetail.post_mobile}}</view>
							<view>{{$t('lang.post_pickup_location')}}：{{orderDetail.address}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <dsc-loading :dscLoading="dscLoading"></dsc-loading> -->

		<!--支付方式 v-on:hidePopup="handelClose('deliveries')"-->
		<!-- <uni-popup ref="popup"  type="bottom" mode="fixed" > -->
		<view class="popup_box" v-if="deliveries">
			<view class="activity-popup">
				<view class="title">
					<view class="txt"
						style="float: left;width: 50%;padding-top:40rpx;padding-left:30rpx; box-sizing: border-box;">
						选择快递跟踪</view>
					<uni-icons type="closeempty" style="float: right;width: 50%; text-align: right;" size="36"
						color="#999999" @click="deliveries = false"></uni-icons>
				</view>
				<view class="not-content">
					<scroll-view :scroll-y="true" class="select-list">
						<view class="select-item" v-for="(item,index) in deliveriesList" :key="index"
							:class="{'active':delivery_sn == item.delivery_sn}"
							@click="delivery_select(item.delivery_sn)">
							<view class="txt">{{ item.shipping_name }}<text class="sn">(运单号：{{item.invoice_no}})</text>
							</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- </uni-popup> -->
	
		<!-- 交易快照选择弹窗 -->
		<view class="popup_box" v-if="showSnapshotPopup" @click.stop="showSnapshotPopup = false">
			<view class="snapshot-popup" @click.stop>
				<view class="snapshot-popup-header">
					<view class="snapshot-popup-title">查看交易快照</view>
					<view class="snapshot-popup-close" @click="showSnapshotPopup = false">
						<uni-icons type="closeempty" size="20" color="#999999"></uni-icons>
					</view>
				</view>
				<view class="snapshot-popup-tip">订单包含多件商品,请选择单一商品查看</view>
				<scroll-view :scroll-y="true" class="snapshot-popup-list">
					<view class="snapshot-popup-item" v-for="(item,index) in snapshotList" :key="index"
						@click="viewSnapshot(item.trade_id)">
						<view class="snapshot-popup-item-img">
							<image :src="getImageUrl(item.goods_img)" mode="aspectFill" class="snapshot-popup-img"></image>
						</view>
						<view class="snapshot-popup-item-content">
							<view class="snapshot-popup-item-name">{{ item.goods_name }}</view>
							<view class="snapshot-popup-item-spec" v-if="item.goods_attr && item.goods_attr.trim()">
								规格：{{ item.goods_attr.replace(/\n/g, ' ') }}
							</view>
							<view class="snapshot-popup-item-number">数量×{{ item.goods_number }}</view>
						</view>
						<view class="snapshot-popup-item-btn">交易快照</view>
					</view>
				</scroll-view>
			</view>
		</view>
	
	<!-- 地址弹框 start  ，-->
	<uni-popups ref="address" type="bottom" style="z-index: 99;">
		<view class="pop_content" :style="{height: `${popHeight.hd+60}px`}">
			<view class="pop_header">
				<!-- <text class="iconfont icon-find-fanhui" v-if="currAddressSwiper == 1"></text> -->
				<text class="pop_title">{{$t('lang.delivery_to_the')}}</text>
				<image class="close_img"
					src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
					@click="closePop('address')"></image>
			</view>
			<!-- <block v-if="currAddressSwiper == 0"> -->
			<!-- #ifdef H5 -->
			<scroll-view scroll-y="true" :style="{height: `${popHeight.center-20}px`}">
				<view class="pop_scroll_view" v-if="addressList.length > 0">
					<view class="address_item" v-for="(item, index) in addressList" :key="index"
						@click="changeAddressRadio(item)">
						<view class="clicked_ico">
							<uni-icons type="checkbox-filled" size="20" color="#F91F28"
								v-if="iSaddress == item.id"></uni-icons>
							<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
						</view>
						<view>
							<view class="address_val"
								style="display: flex;flex-direction: row;align-items: center;">
								<view style="margin-right: 20rpx;">{{ item.province_name }} {{ item.city_name }}
								</view>
								<view
									style="border-radius: 10rpx;border: 2rpx solid #F91F28;width: 80rpx;text-align: center;color: #f91f28;height: 40rpx;line-height: 40rpx;transform: scale(0.8);"
									v-if="iSaddress == item.id">默认</view>
							</view>
							<view class="address_val">{{item.district_name}} {{item.street_name}}
								{{item.address}}
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view style="height: 150rpx;"></view>
					<view class="none_lauout">
						<image class="none_img"
							src="https://images.eqingqu.com/attachs/photo/202404/20240418_7CA9C895B86A19B4657088E863299FA2.png">
						</image>
						<view class="title" style="color:#999999;">收货地址为空</view>
					</view>
				</view>
			</scroll-view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<scroll-view scroll-y="true" :style="{height: `${popHeight.center+40}px`}">
				<view class="pop_scroll_view" v-if="addressList.length > 0">
					<view class="address_item" v-for="(item, index) in addressList" :key="index"
						@click="changeAddressRadio(item)">
						<view class="clicked_ico">
							<uni-icons type="checkbox-filled" size="20" color="#F91F28"
								v-if="iSaddress == item.id"></uni-icons>
							<uni-icons type="circle" size="20" color="#c8c9cc" v-else></uni-icons>
						</view>
						<view>
							<view class="address_val"
								style="display: flex;flex-direction: row;align-items: center;">
								<view style="margin-right: 20rpx;">{{ item.province_name }} {{ item.city_name }}
								</view>
								<view
									style="border-radius: 10rpx;border: 2rpx solid #F91F28;width: 80rpx;text-align: center;color: #f91f28;height: 40rpx;line-height: 40rpx;transform: scale(0.8);"
									v-if="iSaddress == item.id">默认</view>
							</view>
							<view class="address_val">{{item.district_name}} {{item.street_name}}
								{{item.address}}
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view style="height: 150rpx;"></view>
					<view class="none_lauout">
						<image class="none_img"
							src="https://images.eqingqu.com/attachs/photo/202404/20240418_7CA9C895B86A19B4657088E863299FA2.png">
						</image>
						<view class="title">无收货地址</view>
					</view>
				</view>
			</scroll-view>
			<!-- #endif -->
			<view style="height: 30rpx;"></view>
	
			<view class="btn_wrap u-border-top" style="z-index: 99999999;">
				<button class="u-reset-button sub_btn address_btn red_btn" @click="togetlocation">添加新地址</button>
	
			</view>
	
		</view>
	</uni-popups>
	<!-- 配送弹框 end -->
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import { USER_ORDER_DETAIL } from '@/store/mutation-type.js'
		import uniPopup from '@/components/uni-popup.vue';
			import uniPopups from '@/components/uni-popup/uni-popup_1.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniTag from "@/components/uni-tag.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import universal from '@/common/mixins/universal.js';
	import uQRCode from '@/pagesD/comment/uqrcode.js'
	import apiUser from '@/config/api/user.js'

	export default {
		mixins: [universal],
		components: {
			uniTag,
			uniIcons,
			uniPopup,
			uniPopups,
			uniLoadMore
		},
			data() {
			return {
				editList: {},
				addressRadio:'',
				length: 0,
				order_id: 0,
				buttonText: this.$t('lang.immediate_payment'),
				showPopup: false,
				showMnPopup: false,
				qrCodeData: {},
				deliveries: false,
				elivery_sn: '',
				tracker: '',
				addressList:[],
				popHeight: {
					hd: 0,
					bd: 0,
					center: 0
				},
				//微信小程序客服
				wxappChat: uni.getStorageSync("configData").wxapp_chat || 0,
				dscLoading: '',
				// 交易快照相关
				showSnapshotPopup: false,
				snapshotList: [],
				// 订单详情加载状态
				orderDetailLoading: false,
				// 记录上次加载的订单ID，用于判断是否需要重新加载
				lastLoadedOrderId: null
			};
		},
		computed: {
			...mapState({
				userOrderDetail: state => state.user.userOrderDetail,
				// tracker: state => state.user.userOrderDetail.trackerinfo
			}),
			orderDetail() {
				// 确保 orderDetail 始终是对象，而不是数组
				const detail = this.userOrderDetail;
				if (Array.isArray(detail)) {
					return {};
				}
				return detail || {};
			},
			expressinfo() {
				return this.orderDetail.trackerinfo
			},
			goods() {
				return this.orderDetail.goods
			},
			iSaddress: {
				get() {
					console.log("zheli")
					console.log(this.$store.state.user.addressId)
					return this.$store.state.user.addressId
				},
				set(value) {
					this.$store.dispatch('userAddressDefault', {
						address_id: value
					})
				}
			},
			discount() {
				return Number(this.orderDetail.discount)
			},
			amountPrice() {
				let price = 0
				if (this.orderDetail.total_amount) {
					price = this.orderDetail.total_amount ? this.orderDetail.total_amount : this.orderDetail.goods_amount
				}

				return '¥' + price
			},
			totalAmountInt() {
				return Number(this.orderDetail.total_amount)
			},
			listShow: {
				get() {
					return false
					//return this.$store.state.user.listShow
				},
				set(val) {
					this.$store.state.user.listShow = val
				}
			},
			pay_code() {
				return this.orderDetail.pay_code ? this.orderDetail.pay_code : 'balance'
			},
			deliveriesList() {
				return this.orderDetail.deliveries
			}
		},
		methods: {
			togetlocation() {
				var that = this
				that.$refs['address'].close()
				uni.navigateTo({
					url: '/pagesB/address/addressEdit'
				})
				this.regionShow = false;
				return;
				uni.getLocation({
					geocode: true, // 返回经纬度
					success: function(loction) {
						// 将经纬度转换为城市数据
						uni.request({
							url: 'https://restapi.amap.com/v3/geocode/regeo',
							method: 'GET',
							data: {
								key: '3d1780255f066c2302c0073247c30082',
								location: loction.longitude + ',' + loction.latitude
							},
							success: (resda) => {
								console.log("resda", resda)
								var a = resda.data.regeocode.addressComponent
								if (a.city.length == 0) {
									console.log(a.province + ' ' + a.province + ' ' + a.district +
										' ' + a.township)
								} else {
									console.log(a.province + ' ' + a.city + ' ' + a.district +
										' ' + a.township)
								}
								uni.request({
									url: 'https://www.ok9288.com/api/misc/getAddressInfo',
									method: 'GET',
									header: {
										'Content-Type': 'application/json',
									},
									data: {
										towncode: resda.data.regeocode.addressComponent
											.towncode,
									},
									success: (res1) => {
										console.log(res1.data)
										if (res1.statusCode == 200) {
											console.log(
												"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
			
											let o = {
												province: {
													id: res1.data.province,
													name: res1.data.province_name
												},
												city: {
													id: res1.data.city,
													name: res1.data.city_name
												},
												district: {
													id: res1.data.district,
													name: res1.data.district_name
												},
												street: {
													id: res1.data.street,
													name: res1.data.street_name
												},
												regionSplic: res1.data.regionSplic
											}
			
											//替换mixins/form-processing this.regionOptionDate
											that.regionSplic = o;
			
											//选中的收货地址id
											that.addressRadio = '';
			
											that.iSaddress = '';
											//切换收货地址清除驿站
											uni.removeStorageSync('leader_id');
			
			
											// that.$store.dispatch('userAddressDefault',{
											// 	address_id:''
											// })
			
											that.$store.dispatch('setRegion', {
												region: res1.data.street,
												level: 5
											})
											uni.setStorageSync('regionData', o)
			
											//关闭收货地址弹窗
											that.closePop('address');
										}
									}
								})
			
							},
							fail: (err) => {
								console.log("restapi err", err);
							}
						})
					}
				})
			},
			// 提交修改地址
			editAddress() {
				uni.request({
					url: this.websiteUrl + '/api/order/apply_edit_addr_info',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					data: {
						order_id: this.order_id ,
						addr_id: this.addressRadio,
					},
					success: (res) => {
						if (res.data.status === 'success') {
							this.editList = res.data.data;
							this.orderDetail.consignee = this.editList.consignee;
							                this.orderDetail.mobile = this.editList.mobile;
							                this.orderDetail.address = this.editList.address;
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000,
						})
						console.log(res.data)
						// this.orderLoad(this.order_id)
						}else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none',
								duration: 2000,
							})
						}
					},
					fail: (err) => {
						console.error(err)
					}
				});
			},
			
			
			changeAddressRadio(res) {
			    console.log(res);
			    
			    // 选中的收货地址id
			    this.addressRadio = res.id;
			    this.iSaddress = res.id;
			    
			    // 弹出确认框
			    uni.showModal({
			        title: '确认修改',
			        content: '您确定要修改收货地址吗？',
			        success: (confirmRes) => {
			            if (confirmRes.confirm) {
			                // 用户点击确认
			                console.log('用户确认修改地址');
			                
			                // 调用编辑地址方法
			                this.editAddress();
			                
			                // 关闭收货地址弹窗
			                this.closePop('address');
			            } else if (confirmRes.cancel) {
			                // 用户点击取消，可以选择重置选中状态
			                console.log('用户取消修改地址');
			                // 如果需要，可以在这里重置选中状态
			                // this.addressRadio = null;
			                // this.iSaddress = null;
			            }
			        }
			    });
			},
			closePop(res) {
				this.$refs[res].close()
				this.regionShow = false
			},
			showPop(res) {
				this.$refs[res].open()
			},
			// 修改地址
			async getAddressList() {
				const {
					data,
					status
				} = await this.$store.dispatch('getuserAddressList');
				if (status == 'success') this.addressList = data;
				if (this.addressList.length > 0) {
					for (var i = 0; i < this.addressList.length; i++) {
						if (this.addressList[i].is_checked == 1) {
							this.regionSplic = this.addressList[i].address
							console.log('请求回来选中的地址', this.regionSplic)
							// this.regionSplic = this.addressList[i].province_name + ' ' +  this.addressList[i].city_name + ' ' +  this.addressList[i].district_name + ' ' +  this.addressList[i].street_name + this.addressList[i].address
							let o = {
								province: {
									id: this.addressList[i].province,
									name: this.addressList[i].province_name
								},
								city: {
									id: this.addressList[i].city,
									name: this.addressList[i].city_name
								},
								district: {
									id: this.addressList[i].district,
									name: this.addressList[i].district_name
								},
								street: {
									id: this.addressList[i].street,
									name: this.addressList[i].street_name
								},
								regionSplic: this.addressList[i].regionSplic
							}
							this.regionData = o
							// uni.setStorageSync('regionData', o)
							//替换mixins/form-processing this.regionOptionDate
						}
					}
				} else {
					this.regionSplic = '请选择'
				}
			
			
			},
			
			
			
			toexpressLog(postid, id) {
				console.log('tolog', postid[0]);
				if (postid[0]) {
					uni.navigateTo({
						url: '/pagesB/express/expressLog?invoice_no=' + postid[0].invoice_no + '&order_id=' + id
					})
				}
			},
			copyStoreAddress() {
				var that = this
				var info = that.orderDetail.offline_store.stores_name;
				info += ' ' + that.orderDetail.offline_store.stores_tel;
				info += ' ' + that.orderDetail.offline_store.stores_address;
				uni.setClipboardData({
					data: info,
					success: function() {
						uni.showToast({
							title: that.$t('lang.copy_order_sn_success_msg')
						})
					}
				});
			},
			copyUserAddress() {
				var that = this
				var info = that.orderDetail.consignee;
				info += ' ' + that.orderDetail.mobile;
				info += ' ' + that.orderDetail.address;
				uni.setClipboardData({
					data: info,
					success: function() {
						uni.showToast({
							title: that.$t('lang.copy_order_sn_success_msg')
						})
					}
				});
			},
			copyOrderSn() {
				var that = this
				if (that.orderDetail && that.orderDetail.order_sn) {
					uni.setClipboardData({
						data: that.orderDetail.order_sn,
						success: function() {
							uni.showToast({
								title: that.$t('lang.copy_order_sn_success_msg')
							})
						}
					});
				}
			},
			orderLoad(id) {
				// 显示 loading
				this.orderDetailLoading = true;
				// 清空旧的订单详情数据，避免显示上次的数据
				this.$store.commit(USER_ORDER_DETAIL, { data: {} });
				
				this.$store.dispatch('setOrderDetail', {
					order_id: id,
					is_can_edit_addr:this.orderDetail.is_can_edit_addr || 0,
				}).then(() => {
					// 数据加载完成后隐藏 loading，并记录当前订单ID
					this.orderDetailLoading = false;
					this.lastLoadedOrderId = id;
				}).catch((err) => {
					// 请求失败也隐藏 loading
					this.orderDetailLoading = false;
					console.error('加载订单详情失败:', err);
				});
			},
			onListShow() {
				this.listShow = this.listShow ? false : true;
			},
			refoundHandle(id, type) {
				if (type == 0) {
					uni.navigateTo({
						url: '/pagesB/afterSales/applyReturn/applyReturn?rec_id=' + id + '&order_id=' + this
							.order_id,
					})
				} else {
					uni.navigateTo({
						url: '/pagesB/afterSales/detail/detail?ret_id=' + id,
					})
				}
			},
			//取消订单
			onClickBigBtn(id) {
				this.$store.dispatch('setOrderHandler', {
					order_id: id
				}).then(res => {
					if (res.data == true) {
						uni.showToast({
							title: this.$t('lang.order_cancel'),
							icon: 'none'
						})
						this.orderLoad(id);
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
						this.orderLoad(id);
					}
				})
			},
			//晒单评论
			onCommentBtn(id) {
				uni.navigateTo({
					url: '../comment/comment?order_id=' + id
				})
			},
			//确认收货
			receivedOrder(id) {
				this.$store.dispatch('setReceivedOrder', {
					order_id: id
				}).then(res => {
					if (res.data == true) {
						uni.showToast({
							title: this.$t('lang.order_confirm_receipt'),
							icon: 'none'
						});
						this.orderLoad(id);
					}
				})
			},
			//立即支付
			onlinepay(id, pay) {
				uni.navigateTo({
					url: '/pagesD/done/done?order_sn=' + id
				})
			},
			//二维码生成
			async creatQrCode() {
				let pick_code = this.orderDetail.pick_code;
				let text = JSON.stringify({
					"pick_code": pick_code
				});
				await uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 180,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H
				})
			},
			//门店查看二维码
			async viewMnCode() {
				this.showMnPopup = true
				this.creatQrCode();




			},
			// 查看二维码viewMnCode
			async viewQrCode() {
				if (Object.keys(this.qrCodeData).length > 0) {
					this.showPopup = true;
				} else {
					const {
						data,
						status
					} = await this.$store.dispatch('getQrCode', {
						order_id: this.orderDetail.order_id
					});
					console.log('data', data, status)
					if (status !== 'success') {
						return uni.showToast({
							title: this.$t('lang.post_server_busy'),
							icon: 'none'
						});
					}
					this.qrCodeData = data;
					this.showPopup = true;
				}
			},
			productLink(item) {
				let extension_id = this.orderDetail.extension_id ? this.orderDetail.extension_id : 0;

				//超值礼包
				if (item.extension_code == 'package_buy') {
					this.$outerHref(this.$websiteUrl + 'package')
					return
				}

				switch (this.orderDetail.extension_code) {
					case 'presale':
						uni.navigateTo({
							url: "/pagesA/presale/detail/detail?act_id=" + extension_id
						});
						break
					case 'auction':
						uni.navigateTo({
							url: "/pagesA/auction/detail/detail?act_id=" + extension_id
						});
						break
					case 'bargain_buy':
						uni.navigateTo({
							url: "/pagesA/bargain/detail/detail?id=" + extension_id
						});
						break
					case 'exchange_goods':
						uni.navigateTo({
							url: "/pagesA/exchange/detail/detail?id=" + item.goods_id
						});
						break
					case 'group_buy':
						uni.navigateTo({
							url: "/pagesA/groupbuy/detail/detail?id=" + extension_id
						});
						break
					case 'team_buy':
						uni.navigateTo({
							url: "/pagesA/team/detail/detail?goods_id=" + item.goods_id + '&team_id=0'
						});
						break
					case 'seckill':
						uni.navigateTo({
							url: "/pagesA/seckill/detail/detail?id=" + extension_id + '&tomorrow=0'
						});
						break
					default:
						uni.navigateTo({
							url: "/pagesC/goodsDetail/goodsDetail?id=" + item.goods_id
						});
						break
				}
			},
			//物流跟踪 start
			orderTracking(orderDetail) {
				var invoice_no = orderDetail.trackerinfo[0].invoice_no
				if (this.order_id && invoice_no) {
					uni.navigateTo({
						url: '/pagesB/express/expressLog?order_id=' + this.order_id + '&invoice_no=' + invoice_no
					})
				}
				// console.log(this.deliveriesList)
				// if (this.deliveriesList.length > 0) {
				// 	if (this.deliveriesList.length > 1) {
				// 		this.deliveries = true
				// 	} else {
				// 		// #ifdef APP-PLUS
				// 		this.$outerHref(`${this.websiteUrl}/tracker?delivery_sn=${this.deliveriesList[0].delivery_sn}`);
				// 		// #endif

				// 		// #ifdef MP-WEIXIN
				// 		uni.navigateTo({
				// 			url: '/pagesC/tracker/tracker?delivery_sn=' + this.deliveriesList[0].delivery_sn
				// 		})
				// 		// #endif

				// 		// #ifdef H5
				// 		this.$outerHref(`${this.websiteUrl}/tracker?delivery_sn=${this.deliveriesList[0].delivery_sn}`);
				// 		// #endif
				// 	}
				// } else {
				// 	uni.showToast({
				// 		title: this.$t('lang.deliveries_sn'),
				// 		icon: 'none'
				// 	});
				// }
			},
			delivery_select(delivery_sn) {
				this.delivery_sn = delivery_sn;
				// #ifdef H5
				this.$outerHref(`${this.websiteUrl}/tracker?delivery_sn=${delivery_sn}`);
				// #endif

				// #ifdef APP-PLUS
				this.$outerHref(`${this.websiteUrl}/tracker?delivery_sn=${delivery_sn}`);
				// #endif

				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pagesC/tracker/tracker?delivery_sn=' + delivery_sn
				})
				// #endif

				this.deliveries = false
			},
			//物流跟踪 end
			virtualLink(url) {
				let newUrl = url.indexOf("http");

				if (newUrl === 0) this.$outerHref(url);
			},
			copyCard(code) {
				uni.setClipboardData({
					data: code
				});
			},
			invoiceDetail(id) {
				uni.navigateTo({
					url: '/pagesC/shouqianba/invoiceDetail?order_id=' + id
				})
			},
			// 点击交易快照
			onSnapshotClick() {
				if (!this.orderDetail || !this.orderDetail.order_sn) {
					uni.showToast({
						title: '订单信息不存在',
						icon: 'none'
					});
					return;
				}
				this.getSnapshotList();
			},
			// 获取交易快照列表
			async getSnapshotList() {
				try {
					uni.showLoading({
						title: '加载中...'
					});
					const res = await apiUser.getSnapshotList({
						order_sn: this.orderDetail.order_sn
					});
					uni.hideLoading();
					
					console.log('获取交易快照列表成功:', res);
					if (res.status === 'success' && res.data && res.data.length > 0) {
						this.snapshotList = res.data;
						console.log('快照列表:', this.snapshotList);
						// 如果只有一个快照，直接跳转
						if (res.data.length === 1) {
							console.log('只有一个快照，直接跳转，trade_id:', res.data[0].trade_id);
							this.viewSnapshot(res.data[0].trade_id);
						} else {
							// 多个快照，显示弹窗
							console.log('多个快照，显示弹窗');
							this.showSnapshotPopup = true;
						}
					} else {
						uni.showToast({
							title: '未付款订单暂无交易快照',
							icon: 'none'
						});
					}
				} catch (err) {
					uni.hideLoading();
					uni.showToast({
						title: '获取交易快照失败',
						icon: 'none'
					});
				}
			},
			// 查看交易快照详情
			viewSnapshot(tradeId) {
				this.showSnapshotPopup = false;
				console.log('准备跳转到交易快照详情页，tradeId:', tradeId);
				uni.navigateTo({
					url: '/pagesB/snapshot/snapshot?tradeId=' + tradeId,
					success: () => {
						console.log('跳转成功');
					},
					fail: (err) => {
						console.error('跳转失败:', err);
						uni.showToast({
							title: '跳转失败，请稍后重试',
							icon: 'none'
						});
					}
				});
			},
			// 获取图片完整URL
			getImageUrl(imgPath) {
				if (!imgPath) return '';
				if (imgPath.indexOf('http') === 0) {
					return imgPath;
				}
				return this.websiteUrl + '/' + imgPath;
			}
		},
		onLoad(e) {
			const newOrderId = e.id;
			// 判断是否是新的订单（订单ID变化）
			const isNewOrder = this.lastLoadedOrderId !== null && String(this.lastLoadedOrderId) !== String(newOrderId);
			
			this.order_id = newOrderId;
			
			// 只有在新订单时才清空数据和显示loading
			if (isNewOrder || this.lastLoadedOrderId === null) {
				// 进入页面时立即清空旧的订单详情数据，避免显示上次的数据
				this.$store.commit(USER_ORDER_DETAIL, { data: {} });
				this.orderDetailLoading = true;
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
		onShow() {
			// 判断是否是新的订单（订单ID变化）
			const isNewOrder = this.lastLoadedOrderId !== null && String(this.lastLoadedOrderId) !== String(this.order_id);
			
			// 只有在新订单时或首次加载时才重新加载数据
			if (isNewOrder || this.lastLoadedOrderId === null) {
				this.orderLoad(this.order_id);
			}
			this.getAddressList();
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.common.shopConfig.shop_title,
				path: '/pagesB/orderDetail/orderDetail'
			}
		},
		watch: {
			goods() {
				console.log(this.orderDetail)
				this.length = this.goods.length
			},
			orderDetail() {
				this.dscLoading = false
			}

		}
	}
</script>

<style lang="scss">
	.uni-list-cell-custom .uni-list-cell-navigate {
		display: flex;
		flex-direction: column;
	}

	.uni-list-cell-custom .uni-list-cell-navigate .title {
		width: 100%;
		font-size: 28rpx;
	}

	.uni-list-cell-custom .uni-list-cell-navigate .value {
		width: 100%;
		display: flex;
		color: #999999;
		flex-direction: column;
	}

	.uni-list-cell-custom .uni-list-cell-navigate .value view {
		width: 100%;
	}

	.uni-list-cell-title .uni-list-cell-navigate .title {
		color: #000000;
		font-size: 30upx;
		flex: 1;
	}

	.uni-list-cell-title .uni-list-cell-navigate .value {
		font-size: 30upx;
	}

	.uni-list-cell-navigate {
		align-items: baseline;
	}

	/* 社区驿站 star*/
	.address {
		display: flex;
		align-items: flex-start;
		margin: 4px 0 0px;
	}

	.post_lebal_red {
		padding: 0 20upx;
		margin-right: 10upx;
		color: white;
		white-space: nowrap;
		background-color: #f44;
	}

	.claim_goods_box {
		margin: 20upx 0;
		background-color: transparent;
	}

	.claim_goods_box view {
		text-align: center;
		color: #f44;
		background-color: #fff;
	}

	.claim_goods_box view:nth-child(1) {
		font-size: 28upx;
		text-align: left;
		color: #666;
		padding: 24upx 20upx 20upx;
		border-bottom: 1px solid #f0f0f0;
	}

	.claim_goods_box view:nth-child(2) {
		font-size: 36upx;
		padding-top: 20upx;
	}

	.claim_goods_box view:nth-child(3) {
		padding: 20upx 0;
	}

	.claim_goods_box text {
		padding: 4upx 20upx;
		border: 1px solid #f44;
	}

	/* 二维码 弹框 star */
	.popup_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .3);
		z-index: 100;
	}

	.qr_code_box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.qr_code {
		position: relative;
		box-sizing: border-box;
		text-align: center;
		padding: 0 20upx;
		background-color: #fff;
		border-radius: 20upx;
	}

	.qr_code_title {
		font-size: 30upx;
		font-weight: 700;
		padding: 40upx 0 24upx;
		/* border-bottom: 1px solid #ccc; */
	}

	.qr_code_title text {
		position: absolute;
		display: block;
		padding: 20upx;
		top: 0;
		right: 0;
	}

	.qr_code_content {
		text-align: left;
		line-height: 1.8;
		padding: 30upx 60upx;
		color: #333;
	}

	.qr_code_img {
		width: 400upx;
		height: 400upx;
	}

	.qr_code_img_new {
		width: 180px;
		height: 180px;
	}

	.qr_code_text view:first-child {
		text-align: center;
	}

	/* 二维码 弹框 end */
	/* 社区驿站 end*/
	.product-items .item .product-info .product-row .btn-bar-min {
		padding: 0;
	}

	.pic {
		font-size: 28upx;
		color: red;
		font-weight: 700;
	}

	.p-virtual .virtual-item {
		color: #999;
		font-size: 25rpx;
	}

	.p-virtual .virtual-item text {
		color: #3EB1FA;
	}

	.p-virtual .virtual-item .copy {
		margin-left: 10rpx;
	}

	.country_icon {
		width: 43rpx;
		height: 30rpx;
		padding-right: 7rpx;
		position: relative;
		top: 5rpx;
	}

	.activity-popup {
		background-color: #fff;
		width: 750rpx;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.activity-popup .title {
		overflow: hidden;
		border-bottom: 2rpx solid #eee;
	}

	/* top */
	.head-top {
		background: #FFFFFF;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		padding: 32rpx;
	}

	.expressStatus {
		width: 84rpx;
		height: 28rpx;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 28rpx;
		text-align: left;
		// margin-left: 16rpx;
		margin-top: -20rpx;
	}

	.expressStatus.active {
		color: #FFB211;
		font-weight: 600;
	}

	.title {
		font-weight: 400;
	}

	.express {
		padding: 0 20rpx;
		height: 64rpx;
		line-height: 44rpx;
		// border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.expressStatus {
			width: 84rpx;
			height: 32rpx;
			font-weight: 600;
			font-size: 28rpx;
			color: #FFB211;
			line-height: 32rpx;
			text-align: left;
			margin-left: 16rpx;
			margin-top: -20rpx;
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

	.express-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	// center
	.head-center {
		// width: 686rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 16rpx;
	}

	uni-view {
		font-size: 14px;
		line-height: normal;
	}

	.section-list .user-itemnew {
		padding: 16px;
		border-radius: 10px;
		margin-bottom: 16rpx;
	}

	.section-list {
		position: relative;
		margin-bottom: 0px;
	}

	.head-content {
		padding: 0rpx 16rpx 30rpx;
	}

	.head-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 28rpx;
		font-style: normal;
	}

	.head-item {
		display: flex;
		justify-content: space-between;
		// line-height: 55px;
		height: 50rpx;

		.head-left {
			font-weight: 400;
			font-size: 28rpx;
			color: #1B1B1B;
		}

		.head-right {
			font-weight: 400;
			font-size: 28rpx;
			color: #A2A2A2;
			text-align: right;
		}
	}

	.container {
		padding: 0 32rpx 170rpx;
	}

	.btn-bar {
		display: flex;
		justify-content: flex-end;
	}

	.uni-card-not {
		box-shadow: none;
		border-radius: 10px;
	}

	.uni-card .uni-card-not {
		border-radius: 10px;
	}

	.uni-list {
		border-radius: 10px;
	}

	.uni-list-cell:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 15px;
		right: 15px;
		height: 0.5px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #ededed;
	}

	.flow-checkout-adr {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 16px;
		margin: 8px 0;
		background-size: 64px 5px;
		border-radius: 10px;
		font-size: 32rpx;
		font-weight: 400;
		background: #FFFFFF;
	}

	.flow-checkout-adr .adr-content .title {
		font-weight: 400;
		color: #000000;
		font-size: 32rpx;
	}

	.flow-checkout-adr .adr-content .mobile {
		font-weight: 400;
		color: #000000;
		font-size: 32rpx;
	}
	.flow-checkout-adr .adr-content .edit {
		font-weight: 400;
		color: #000000;
		font-size: 32rpx;
	}
	
	.uni-card{
		margin: 8px 0rpx;
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
				right: 30rpx;
				transform: translateY(-50%);
				width: 44rpx;
				height: 44rpx;
			}
		}
	
		.pop_scroll_view {
			padding: 0 30rpx 30rpx;	
			
		}
	
	}
	.address_item {
		display: flex;
		align-items: flex-start;
		padding: 30rpx 0;
	
		.clicked_ico {
			flex: none;
			height: 20px;
			line-height: 1;
		}
	
		.address_val {
			flex: auto;
			margin-left: 30rpx;
			line-height: 40rpx;
		}
	}
	.u-reset-button {
		padding: 0;
		font-size: inherit;
		line-height: inherit;
		background-color: transparent;
		color: inherit;
	}
	
	.u-reset-button::after {
		border: none;
	}
	.sub_btn {
		flex: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 80rpx;
		border-radius: 40rpx;
		background-color: #FE2F02;
		font-weight: 700;
		color: #fff;
		line-height: 1.3;
		font-size: 15px;
		width: 90%;
		
		.jiage {
			font-weight: normal;
			font-size: 12px;
		}
	}
	
	.red_btn {
		background-color: #F91F28;
	}
	.edit-btn {
	    display: inline-block;
	    background-color: #1890ff; /* 浅蓝色背景 */
	    color: #ffffff; /* 白色文字 */
	    padding: 12rpx 24rpx;
	    border-radius: 8rpx;
	    font-size: 28rpx;
	    font-weight: 500;
	    text-align: center;
	    box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3); /* 浅蓝色阴影 */
	    transition: all 0.2s ease-in-out;
	    cursor: pointer;
	    user-select: none;
	    border: none;
	    outline: none;
	    position: relative;
	    overflow: hidden;
	}
	.edit-text{
		font-size: 28rpx;
		font-weight: 400;
		color: #1B1B1B;
	}
	
	/* 点击反馈效果 */
	.edit-btn:active {
	    background-color: #096dd9; /* 点击时颜色加深 */
	    box-shadow: 0 2rpx 6rpx rgba(24, 144, 255, 0.4); /* 点击时阴影变小 */
	    transform: translateY(2rpx); /* 点击时轻微下移 */
	}
	
	/* 悬停效果 */
	.edit-btn:hover {
	    background-color: #40a9ff; /* 悬停时颜色变亮 */
	    box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.4); /* 悬停时阴影变大 */
	}
	
	/* 涟漪点击效果） */
	.edit-btn::after {
	    content: '';
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    width: 0;
	    height: 0;
	    border-radius: 50%;
	    background: rgba(255, 255, 255, 0.3);
	    transform: translate(-50%, -50%);
	    transition: width 0.3s, height 0.3s;
	}
	
	.edit-btn:active::after {
	    width: 200rpx;
	    height: 200rpx;
	}
	
	/* 交易快照弹窗样式 - 参考京东样式 */
	.snapshot-popup {
		background-color: #fff;
		width: 100%;
		max-height: 80vh;
		position: fixed;
		bottom: 0;
		left: 0;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		display: flex;
		flex-direction: column;
	}
	
	.snapshot-popup-header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		position: relative;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.snapshot-popup-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}
	
	.snapshot-popup-close {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.snapshot-popup-tip {
		padding: 20rpx 30rpx;
		color: #999;
		font-size: 24rpx;
		background-color: #fafafa;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.snapshot-popup-list {
		flex: 1;
		max-height: calc(80vh - 180rpx);
	}
	
	.snapshot-popup-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		background-color: #fff;
	}
	
	.snapshot-popup-item:last-child {
		border-bottom: none;
	}
	
	.snapshot-popup-item-img {
		flex-shrink: 0;
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	
	.snapshot-popup-img {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.snapshot-popup-item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 120rpx;
		padding-right: 20rpx;
	}
	
	.snapshot-popup-item-name {
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
		margin-bottom: 8rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-all;
	}
	
	.snapshot-popup-item-spec {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
		line-height: 1.4;
	}
	
	.snapshot-popup-item-number {
		font-size: 24rpx;
		color: #999;
	}
	
	.snapshot-popup-item-btn {
		flex-shrink: 0;
		padding: 12rpx 24rpx;
		background-color: #f5f5f5;
		border-radius: 6rpx;
		font-size: 24rpx;
		color: #666;
		text-align: center;
		white-space: nowrap;
	}
	
	.snapshot-desc {
		font-size: 24rpx;
		color: #999;
		margin-right: 10rpx;
	}
	
	/* 订单详情加载样式 */
	.order-detail-loading {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400rpx;
		padding: 100rpx 0;
	}
</style>