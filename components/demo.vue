<template>
	<view class="inventory">
		<uni-popup :show="show" :round="10" bgColor="#eee" mode="bottom" @close="close">
			<view class="openPopup">
				<view class="title">
					<view class="utitle">
						选择预约时间
					</view>
					<view class="close" @click="close">
						<u-icon name="close" color="#aaa" size="22"></u-icon>
					</view>
				</view>
				<view class="content">
					<view class="left">
						<view class="l_item active">
							{{nowWeek}}
						</view>
					</view>
					<view class="right">
						<scroll-view scroll-y="true" class="scroll-Y" :scroll-into-view="'one'+(oneCategoryActive)">
							<block v-for="(item,index) in selection">
								<view class="r_item active" v-if="item.active" @click="selectTime(item)"
									:id="'one'+(index+1)">
									{{item.time}} <u-icon name="checkmark-circle-fill" color="#42c8b4"
										size="20"></u-icon>
								</view>
								<view class="r_item" v-else @click="selectTime(item)">
									{{item.time}}
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	/**
	 * 自定义时间选择器
	 * 该组件适用于当日的预约时间
	 */
	export default {
		props: {
			subscribeTime: {
				type: Object,
				default: () => {}
			},
		},
		name: 'UniDemo',
		data() {
			return {
				show: false,
				timer: null,
				tsection: [
					"00:00", "00:15", "00:30", "00:45",
					"01:00", "01:15", "01:30", "01:45",
					"02:00", "02:15", "02:30", "02:45",
					"03:00", "03:15", "03:30", "03:45",
					"04:00", "04:15", "04:30", "04:45",
					"05:00", "05:15", "05:30", "05:45",
					"06:00", "06:15", "06:30", "06:45",
					"07:00", "07:15", "07:30", "07:45",
					"08:00", "08:15", "08:30", "08:45",
					"09:00", "09:15", "09:30", "09:45",
					"10:00", "10:15", "10:30", "10:45",
					"11:00", "11:15", "11:30", "11:45",
					"12:00", "12:15", "12:30", "12:45",
					"13:00", "13:15", "13:30", "13:45",
					"14:00", "14:15", "14:30", "14:45",
					"15:00", "15:15", "15:30", "15:45",
					"16:00", "16:15", "16:30", "16:45",
					"17:00", "17:15", "17:30", "17:45",
					"18:00", "18:15", "18:30", "18:45",
					"19:00", "19:15", "19:30", "19:45",
					"20:00", "20:15", "20:30", "20:45",
					"21:00", "21:15", "21:30", "21:45",
					"22:00", "22:15", "22:30", "22:45",
					"23:00", "23:15", "23:30", "23:45",
					"23:59"
				],
				selection: [],
				nowWeek: '',
				nowDate: '',
				nowTime: '',
				subscribeTime: {
					time: "立即取餐",
					active: true
				},
				oneCategoryActive: 0, //一级分类点击下标
			}
		},

		methods: {
			open(data) {
				this.subscribeTime = data;
				console.log(this.subscribeTime);
				this.getDate();
			},
			close() {
				this.show = false
			},
			upper: function(e) {},
			lower: function(e) {},
			selectTime(data) {
				this.close()
				data.active = true;
				this.$emit("callback", {
					subscribeTime: data,
					day: this.nowWeek,
					time: this.nowDate
				})
			},
			getDate() {
				console.log(this.subscribeTime)
				this.selection = []
				//获取当前时间
				let myDate = new Date()
				let wk = myDate.getDay()
				let yy = String(myDate.getFullYear())
				let mm = myDate.getMonth() + 1
				let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
				let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
				let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
				let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
				let weeks = ['今天(周日)', '今天(周一)', '今天(周二)', '今天(周三)', '今天(周四)', '今天(周五)', '今天(周六)']
				let week = weeks[wk]
				this.nowTime = hou + ':' + min
				this.nowWeek = week
				this.nowDate = yy + '-' + mm + '-' + dd
				for (let i = 0; i < this.tsection.length; i++) {
					let start = this.tsection[i];
					let end = this.tsection[i + 1];
					if (this.nowTime <= start) {
						if (this.subscribeTime) {
							if (end == this.subscribeTime["time"]) {
								this.selection.push({
									time: end,
									active: true
								})
							} else {
								this.selection.push({
									time: end,
									active: false
								})
							}
						} else {
							this.selection.push({
								time: end,
								active: false
							})
						}

					}
				}
				if (this.subscribeTime) {
					if (this.subscribeTime["time"] == "立即取餐") {
						this.selection.unshift({
							time: "立即取餐",
							active: true
						})
					} else {
						this.selection.unshift({
							time: "立即取餐",
							active: false
						})
					}
				} else {
					this.selection.unshift({
						time: "立即取餐",
						active: true
					})
				}
				this.selection.map((item, index) => {
					if (item.active) {
						this.oneCategoryActive = index + 1
					}
				})
				this.show = true;
			}
		}
	}
</script>
<style>
	.scroll-Y {
		height: 520rpx;

	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item {
		height: 420rpx;
		line-height: 420rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		height: 420rpx;
		line-height: 420rpx;
		text-align: center;
		font-size: 36rpx;
	}
</style>
<style lang="scss" scoped>
	.inventory {
		.openPopup {
			height: 600rpx;

			.title {
				width: 100%;
				height: 80rpx;
				font-size: 32rpx;
				line-height: 80rpx;
				// border-bottom: 2rpx solid #777;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;

				.close {
					position: absolute;
					right: 30rpx;
					font-size: 30rpx;
					color: #aaa;
				}
			}

			.content {
				height: 520rpx;
				width: 100%;
				display: flex;

				.left {
					width: 35%;

					.l_item {
						width: 100%;
						height: 86rpx;
						line-height: 86rpx;
						text-align: center;
						background-color: #fff;
					}
				}

				.right {
					width: 65%;
					background-color: #fff;
					padding-left: 30rpx;

					.r_item {
						width: 100%;
						height: 80rpx;
						line-height: 80rpx;
						font-size: 34rpx;
						justify-content: space-between;
						border-bottom: 1rpx solid #eee;
						padding: 0 10rpx;
						padding-right: 50rpx;
						background-color: #fff;
						display: flex;
					}
				}
			}

			.active {
				color: #42c8b4;
			}
		}
	}
</style>