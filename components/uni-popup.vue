<template>
	<view>
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px'}" @click="hide"></view>
		<view :class="['uni-popup','uni-popup-'+type, type==='middle'&&wide?'uni-popup-middle-wide':'']" v-show="show">
			{{msg}}
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			msg: {
				type: String,
				default: ""
			},
			wide: {
				type: Boolean,
				default: false
			}
		},
		data() {
			// H5 勿预留顶部偏移：原先 44px 会让整条遮罩下移，出现「顶部有一条未被挡上」的透明缝；
			// 自定义导航由页面自身布局处理，全屏遮罩应从 0 开始。
			let offsetTop = 0;
			return {
				offsetTop: offsetTop
			}
		},
		methods: {
			hide: function() {
				this.$emit('hidePopup');
			}
		}
	}
</script>
<style>
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .3);
		/* #ifdef H5 */
		/* 自定义 tabbar 曾用 99999998，远高于旧版 998，导致 H5 上蒙层与弹窗都在底栏之下 */
		z-index: 100000;
		/* #endif */
	}

	.uni-popup {
		position: fixed;
		z-index: 999;
		/* #ifdef H5 */
		z-index: 100001;
		/* #endif */
/* 		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1); */
	}

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* #ifdef H5 */
		width: 85%;
		/* #endif */
		/* #ifndef H5 */
		width: 380upx;
		padding: 30upx;
		/* #endif */
		height: auto;
		border-radius: 10upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		justify-content: center;
		
	}
	/* APP 上宽版居中弹窗：新人优惠券等用 wide 避免被 380upx 压成窄条 */
	.uni-popup-middle-wide {
		/* #ifndef H5 */
		width: 680rpx !important;
		max-width: 90% !important;
		padding: 0 !important;
		/* #endif */
	}
	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}

	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		z-index: 10002;
		/* #ifdef H5 */
		z-index: 100001;
		/* #endif */
		border-radius: 15upx 15upx 0 0;
		background: #fff;
	}
</style>
