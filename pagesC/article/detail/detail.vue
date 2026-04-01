<template>
		<view class="container" :class="{'container-bottom': showState == true}">
		<view class="article-main">
			<view class="header" v-if="showState == true">
				<view class="title">{{ articleDetail.title }}</view>
				<view class="article-author">
					<view class="header-left">
						<view class="avatar">
							<image :src="articleDetail.shop_logo"></image>
						</view>
						<view class="author-info" v-if="articleDetail.author">
							<text class="author-name">{{ articleDetail.author }}</text>
							<view class="author-time">
								<text class="time">{{ articleDetail.amity_time }}</text>
								<block v-if="!hideCommentUi">
									<text class="dot"></text>
									<text
										class="comment-number">{{ articleDetail.comment_number }}{{ $t('lang.comment_alt') }}</text>
								</block>
							</view>
						</view>
					</view>
					<view class="header-right">
						<button :type="is_like == 1 ? 'default' : 'warn'" size="mini"
							@click="like">{{ is_like == 1 ? $t('lang.followed') : $t('lang.attention') }}</button>
					</view>
				</view>
			</view>
			<view class="content" v-if="articleDetail.content">
				<jyf-parser :html="articleDesc" :tag-style="{video: 'width: 100%;'}"></jyf-parser>
			</view>
			<view class="goods-list"
				v-if="articleDetail.related_goods && articleDetail.related_goods.length > 0 && showState == true">
				<view class="goods-item" v-for="(item,index) in articleDetail.related_goods" :key="index"
					@click="$outerHref('/pagesC/goodsDetail/goodsDetail?id='+item.goods_id,'app')">
					<view class="goods-left">
						<image :src="item.goods_thumb" class="img" />
					</view>
					<view class="goods-right">
						<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
						<view class="plan-box">
							<view class="price">{{item.shop_price}}</view>
							<view class="btn">{{$t('lang.to_buy')}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="fx-deta-box" :class="{'active':is_like == 1}" @click="like" v-if="showState == true">
				<view class="yuan">
					<icon class="iconfont icon-zan"></icon>
					<text>{{likenum}}</text>
				</view>
			</view> -->
		</view>
		<view class="comment" v-if="showState == true && !hideCommentUi && articleCommentLength > 0">
			<view class="title">{{$t('lang.comment_list')}}</view>
			<view class="comment-info" v-for="(item,index) in articleDetail.comment" :key="index"
				v-if="item.status > 0">
				<view class="comment-left">
					<image :src="item.user_picture" mode="widthFix"></image>
				</view>
				<view class="comment-right">
					<view class="com-r-top">
						<view class="com-adm-box">{{ item.user_name }}</view>
						<view class="com-data-right">{{ item.amity_time }}</view>
					</view>
					<view class="com-con">{{ item.content }}</view>
					<view class="admin-con" v-for="(adminitem,adminindex) in item.reply_content" :key="adminindex">
						{{$t('lang.admin_reply')}}：{{adminitem.content}}
					</view>
				</view>
			</view>
			<view class="com-view-more" v-if="articleCommentLength > 6" @click="commentMore">
				{{$t('lang.comment_view_more')}}
			</view>
			<!-- #ifndef H5 -->
			<view class="safe-area-inset-bottom" style="height: 55px;"></view>
			<!-- #endif -->

		</view>

		<view class="comment-footer-tabbar" v-if="showState == true">
			<view class="tabbar-wapper" v-if="!hideCommentUi">
				<view class="comment-input">
					<view class="input">
						<uni-icons type="compose" size="16"></uni-icons>
						<text class="placeholder" @click="handleShow">{{$t('lang.write_review')}}</text>
					</view>
				</view>
				<view class="comment-operation">
					<view class="item" @click="handleShow">
						<uni-icons type="chatbubble" size="20"></uni-icons>
						<text class="tag">{{ articleDetail.comment_number }}</text>
					</view>
					<!-- <view class="item">
						<uni-icons type="star" size="20"></uni-icons>
					</view> -->
					<view class="item" @click="like">
						<uni-icons :type="is_like == 1 ? 'hand-thumbsup-filled' : 'hand-thumbsup'"
							:color="is_like == 1 ? '#f92028' : '#333'" size="20"></uni-icons>
					</view>
					<!-- #ifndef MP-WEIXIN -->
					<view class="item" @tap="appShare">
						<uni-icons type="redo" size="20"></uni-icons>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<button class="item" open-type="share">
						<uni-icons type="redo" size="20"></uni-icons>
					</button>
					<!-- #endif -->
				</view>
			</view>
			<view class="tabbar-wapper tabbar-wapper-actions-only" v-else>
				<view class="comment-operation comment-operation-only">
					<view class="item" @click="like">
						<uni-icons :type="is_like == 1 ? 'hand-thumbsup-filled' : 'hand-thumbsup'"
							:color="is_like == 1 ? '#f92028' : '#333'" size="20"></uni-icons>
					</view>
					<!-- #ifndef MP-WEIXIN -->
					<view class="item" @tap="appShare">
						<uni-icons type="redo" size="20"></uni-icons>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<button class="item" open-type="share">
						<uni-icons type="redo" size="20"></uni-icons>
					</button>
					<!-- #endif -->
				</view>
			</view>
		</view>

		<uni-popup v-if="!hideCommentUi" :show="textareaShow" type="bottom" animation="true" v-on:hidePopup="handelClose">
			<view class="commont-quyu">
				<view class="commont-textarea">
					<textarea :placeholder="$t('lang.hao_review_youxian_view')" name="content" v-model="content"
						maxlength="200" :focus="focus" :show-confirm-bar="false"></textarea>
				</view>
				<text @click="addActComment" :class="{'active':btnHide}">{{$t('lang.send')}}</text>
			</view>
		</uni-popup>

		<dsc-common-nav v-if="showState == true"></dsc-common-nav>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser";

	export default {
		data() {
			return {
				id: 0,
				content: '',
				routerName: 'goods',
				disabled: false,
				showState: true,
				textareaShow: false,
				focus: false,
				/** App 端关闭评论相关 UI，满足应用商店审核（如 OPPO 不允许内置评论） */
				hideCommentUi: false
			}
		},
		onShareAppMessage(res) {
			console.log(555555);
			return {
				title: this.articleDetail.title,
				path: '/pagesC/article/detail/detail?id=' + this.id
			}
		},
		//用户点击右上角分享朋友圈
		onShareTimeline: function() {
			return {
				title: this.articleDetail.title,
				query: {
					key: 'id=' + this.id
				},
				imageUrl: this.articleDetail.file_url
			};
		},
		components: {
			uniIcons,
			uniPopup,
			dscNotContent,
			dscCommonNav,
			jyfParser
		},
		computed: {
			...mapState({
				articleDetail: state => state.article.articleDetail,
			}),
			likenum: {
				get() {
					return this.articleDetail.likenum
				},
				set(val) {
					this.articleDetail.likenum = val
				}
			},
			is_like: {
				get() {
					return this.articleDetail.is_like
				},
				set(val) {
					this.articleDetail.is_like = val
				}
			},
			articleCommentLength() {
				return this.articleDetail.comment_number
			},
			articleDesc() {
				let result = this.articleDetail.content;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				const regex3 = new RegExp('<h1', 'gi');
				const regex4 = new RegExp('<h2', 'gi');
				const regex5 = new RegExp('<h3', 'gi');
				const regex6 = new RegExp('<h4', 'gi');

				if (result) {
					result = result.replace(reg, '');
					result = result.replace(
					        regex, 
					        '<img draggable="false" oncontextmenu="return false" style="width: 100% !important; height:auto;vertical-align:top;pointer-events: none;"'
					      );
					result = result.replace(regex2,
						'<p style="margin:0;padding:0;color:#222;text-align:justify;list-style-position:inside;list-style-type:square;font-size:16px;line-height:1.76;margin-top:15px;word-break:break-word;"'
					);
					result = result.replace(regex3,
						'<h1 style="font-size: 16px;border-left-width: 3px;border-left: solid #ed4040;padding-left: 6px;line-height: 28px;margin: 20px 0;font-weight: bold;"'
					);
					result = result.replace(regex4,
						'<h2 style="font-size: 16px;border-left-width: 3px;border-left: solid #ed4040;padding-left: 6px;line-height: 28px;margin: 20px 0;font-weight: bold;"'
					);
					result = result.replace(regex5,
						'<h3 style="font-size: 16px;border-left-width: 3px;border-left: solid #ed4040;padding-left: 6px;line-height: 28px;margin: 20px 0;font-weight: bold;"'
					);
					result = result.replace(regex6,
						'<h4 style="font-size: 16px;border-left-width: 3px;border-left: solid #ed4040;padding-left: 6px;line-height: 28px;margin: 20px 0;font-weight: bold;"'
					);
				}
				return result
			},
			btnHide() {
				return this.content.length > 0 ? true : false
			}
		},
		methods: {
			show() {
				this.$store.dispatch('setArticleDetail', {
					id: this.id
				})
			},
			addActComment() {
				if (this.hideCommentUi) return;
				if (this.$isLogin()) {
					if (this.content) {
						uni.showLoading({
							title: this.$t('lang.publishing')
						});
						this.$store.dispatch('setActicleComment', {
							id: this.id,
							cid: 0,
							content: this.content
						}).then(res => {
							let data = res.data
							if (data == false) {
								uni.showToast({
									icon: 'none',
									title: this.$t('lang.comment_fail')
								})
							} else {
								uni.showToast({
									title: this.$t('lang.comment_success')
								})
								this.show()
							}
							this.handelClose();
							uni.hideLoading()
						})
					}
				}
			},
			commentMore() {
				if (this.hideCommentUi) return;
				uni.navigateTo({
					url: '/pagesC/article/commentlist/commentlist?id=' + this.id
				})
			},
			like() {
				this.$store.dispatch('setActicleCommentLike', {
					article_id: this.id
				}).then(res => {
					if (res.data) {
						this.likenum = res.data.like_num
						this.is_like = res.data.is_like
					}
				})
			},
			handleShow() {
				if (this.hideCommentUi) return;
				this.textareaShow = true
				this.focus = true
			},
			handelClose() {
				this.textareaShow = false
				this.focus = false
			},
			appShare() {
				// #ifndef H5
				let shareInfo = {
					href: this.$websiteUrl + 'articleDetail/' + this.id + '?platform=APP',
					title: this.articleDetail.title,
					summary: this.articleDetail.description,
					imageUrl: this.articleDetail.file_url,
					url: this.articleDetail.url
				};
				this.shareInfo(shareInfo)
				// #endif
				// #ifdef H5
				const text = this.articleDetail.url
				const input = document.createElement('input');
				input.value = text;
				document.body.appendChild(input);
				input.select();
				document.execCommand('copy');
				document.body.removeChild(input);
				uni.showToast({
					title: '链接已复制,请粘贴链接',
					icon: 'success'
				});
				// #endif
			},
		},
		onLoad(e) {
			console.log(111, e)
			if (!e.id) {
				uni.reLaunch({
					url: '/pages/middles/middles'
				})
				return;
			}
			this.id = e.id ? e.id : 0;
			this.showState = e.show ? e.show : true;
			// #ifdef APP-PLUS
			this.hideCommentUi = true;
			// #endif
			// #ifndef APP-PLUS
			if (e.hideComment === '1' || e.hideComment === 1) {
				this.hideCommentUi = true;
			}
			// #endif
			this.show();
		}
	}
</script>

<style scoped>
	.container {
		background-color: #FFFFFF;
		height: 100%;
	}

	.container-bottom {
		padding-bottom: 120upx;
	}

	.article-main {
		background: #FFFFFF;
		overflow: hidden;
		padding-top: 20upx;
	}

	.article-main .header {
		display: flex;
		flex-direction: column;
		padding: 0 20upx;
	}

	.article-main .header .title {
		font-size: 40upx;
		color: #333333;
		font-weight: bold;
	}

	.article-main .header .article-author {
		display: flex;
		justify-content: space-between;
		margin-top: 24upx;
	}

	.article-main .header .article-author .header-left {
		display: flex;
		align-items: center;
	}

	.article-main .header .article-author .header-left .avatar {
		width: 80upx;
		height: 80upx;
		border-radius: 80upx;
		margin: auto;
		display: inline-block;
		margin-right: 20upx;
	}

	.article-main .header .article-author .header-left .avatar image {
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}

	.article-main .header .article-author .header-left .author-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.article-main .header .article-author .header-left .author-name {
		font-size: 30upx;
		font-weight: 700;
		color: #222;
		line-height: 40upx;
	}

	.article-main .header .article-author .header-left .author-time {
		font-size: 25upx;
		color: #999999;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		line-height: 40upx;
	}

	.article-main .header .article-author .header-left .author-time .dot {
		width: 6upx;
		height: 6upx;
		border-radius: 50%;
		background-color: #999999;
		margin: 0 10upx;
	}

	.article-main .header .article-author .header-right {
		display: flex;
		align-items: center;
	}

	.article-main .content {
		/* padding: 0 20upx 20upx; */
		/* #ifdef H5 */
		padding: 0 20upx;
		/* #endif */
		/* #ifndef H5 */
		padding: 0 20upx 120rpx;
		/* margin-bottom: 120rpx; */
		/* #endif */
	}

	.article-main .fx-deta-box {
		margin: 20upx 0;
	}

	.article-main .fx-deta-box .yuan {
		width: 120upx;
		height: 120upx;
		border: 2upx solid #F6F6F9;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		line-height: 1.5;
	}

	.article-main .fx-deta-box .yuan text {
		color: #999999;
		font-size: 25upx;
	}

	.article-main .fx-deta-box:active .yuan,
	.article-main .fx-deta-box .yuan text,
	.article-main .fx-deta-box .yuan .iconfont {
		color: #f92028;
	}

	.comment {
		margin-top: 20upx;
		background: #FFFFFF;
	}

	.comment .title {
		padding: 20upx;
		border-bottom: 2upx solid #F6F6F9;
	}

	.comment .comment-info {
		padding: 20upx;
		border-bottom: 2upx solid #F6F6F9;
		display: flex;
		flex-direction: row;
	}

	.comment .comment-info:last-child {
		border-bottom: 0;
	}

	.comment .comment-info .comment-left {
		width: 100upx;
		height: 100upx;
	}

	.comment .comment-info .comment-left image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.comment .comment-info .comment-right {
		margin-left: 20upx;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.comment .comment-info .comment-right .com-r-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.comment .comment-info .comment-right .com-r-top .com-adm-box {
		color: #607fa6;
	}

	.comment .comment-info .comment-right .com-r-top .com-data-right {
		font-size: 25upx;
		color: #999999;
	}

	.comment .comment-info .comment-right .com-con {
		word-break: break-word;
	}

	.comment .comment-info .comment-right .admin-con {
		color: #999999;
		padding: 5upx 20upx;
		background: #f4f4f4;
		border-radius: 10upx;
		margin: 10upx 0;
		font-size: 25upx;
	}

	.comment .com-view-more {
		padding: 20upx 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.comment-footer-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 98upx;
		background-color: #FFFFFF;
		border-top: 2upx solid #f0f0f0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.comment-footer-tabbar .tabbar-wapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 50%;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-input .input {
		display: flex;
		flex: 1;
		align-items: center;
		margin-left: 20upx;
		height: 60upx;
		background-color: #ececec;
		border-radius: 30upx;
		padding: 0 20upx;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-input .input .placeholder {
		margin-left: 5upx;
		flex: 1;
		color: #333;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-operation {
		display: flex;
		flex-direction: row;
		width: calc(50% - 20upx);
		margin-left: 20upx;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-operation .item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-operation .tag {
		background-color: #f92028;
		font-size: 15upx;
		color: #FFFFFF;
		height: 24upx;
		min-width: 8upx;
		padding: 0 8upx;
		border-radius: 12upx;
		position: absolute;
		top: 20upx;
		right: 20%;
		text-align: center;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-operation button.item {
		background: none;
		padding: 0;
	}

	.comment-footer-tabbar .tabbar-wapper .comment-operation button.item::after {
		border: none;
		border-radius: 0;
	}

	.tabbar-wapper-actions-only {
		justify-content: flex-end;
		padding-right: 20upx;
	}

	.comment-operation-only {
		width: auto;
		flex: none;
		margin-left: 0;
		min-width: 200upx;
	}

	.commont-quyu {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
		text-align: left;
		justify-content: flex-start;
		height: 70px;
	}

	.commont-quyu .commont-textarea {
		background-color: #f1f1f1;
		height: 60px;
		padding: 5px;
		border-radius: 5px;
		flex: 1;
		margin-left: 10px;
	}

	.commont-quyu .commont-textarea textarea {
		width: 100%;
		height: 60px;
	}

	.commont-quyu text {
		width: 60px;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #999999;
	}

	.commont-quyu text.active {
		color: #007AFF;
	}
	.content {
	  -webkit-touch-callout: none; 
	}
	
	/* 禁止图片选中和操作 */
	.content img {
	  pointer-events: none;
	  user-select: none;
	  -webkit-user-select: none;
	  -moz-user-select: none;
	  -ms-user-select: none;
	}
	
	/* 安卓端额外处理 */
	@media (pointer: coarse) {
	  .content img {
	    -webkit-tap-highlight-color: transparent;
	  }
	}
</style>