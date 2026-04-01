<template>
	<view class="dsc_nav_bar" :style="{backgroundColor: bgc}">
		<view class="nav_item" :class="{'active': navIndex == index}" v-for="(item,index) in list" :key="index" @click="tapNav(index)">
			<view>{{ item.nav_name }}</view>
		</view>
		<view class="navigation_bars" :style="{left: nav_bars_left}"></view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			required: true
		},
		navIndex: {
			type: Number,
			default: 0
		},
		bgc: {
			type: String,
			default: '#f9f9f9'
		}
	},
	computed: {
		nav_bars_left: function () {
			return (this.navIndex + 0.5) / this.list.length * 100 + '%';
		}
	},
	methods: {
		tapNav(i) {
			this.navIndex == i
			this.$emit('change-index', i);
		}
	}
}
</script>

<style scoped>
.dsc_nav_bar {
	position: relative;
	top: 0;
	display: flex;
	justify-content: space-between;
	height: 80upx;
	padding-top: 10rpx;
	box-sizing: border-box;
}
.nav_item {
	flex: 1;
	text-align: center;
	line-height: 100upx;
}

.active{
	font-weight: 700;
	color: #FE0302;
}
.navigation_bars {
	position: absolute;
	bottom: 0;
	transition: all .3s;
	transform: translateX(-50%);
	width:34upx;
	height:8upx;
	background:rgba(249,41,41,1);
	border-radius:4upx;
}
.nav_item text {
	font-size: 30upx;
	font-weight: 700;
	color: #000000;
}
</style>
