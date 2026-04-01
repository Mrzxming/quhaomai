<template>
	<view v-if="days && days.length">
		<!-- 弹出层 -->
		<view :class="scrollClass">
			<view class="time-title" :style="{ borderRadius: getRadius }">
				<span @click.stop="close">取消</span>
				{{ title }}
				<text @click.stop="confirm" :style="selectedTimeIndex?'color: #666666':''">确定</text>
			</view>
			<view class="time-picker" :style="{ height: height }">
				<scroll-view class="date-scroll" scroll-y>
					<view class="date-item" v-for="(item, index) in days" :key="index">
						<view class="date" :class="{ active: selectedIndex === index }" @click="handleDateClick(index)">
							{{ item.day }}
						</view>
					</view>
				</scroll-view>
				<scroll-view class="time-scroll" scroll-y>
					<radio-group>
						<label>
							<view class="" style="" @click="handleTimeClick(index,time)" class="time-item sontime "
								v-for="(time, index) in selectedDay.timeList" :key="index">
								<view>{{ time.time }}</view>
								<view>
									<radio color="#f92028" :name="time.time" size="14" id="radio" />
								</view>
							</view>
						</label>
					</radio-group>
				</scroll-view>

				<!-- <scroll-view class="time-scroll" scroll-y>
					<view class="time-item" v-for="(time, index) in selectedDay.timeList" :key="index">
						<view class="time" :class="{ active: selectedTimeIndex === index }"
							@click="handleTimeClick(index)">
							{{ time.time }}
						</view>
					</view>
				</scroll-view> -->
			</view>
		</view>
		<view v-show="isShow" class="scroll-mask" @click="isMask ? close() : ''"></view>
	</view>
</template>

<script>
	export default {
		props: {
			//标题
			title: {
				type: String,
				default: '请选择预约时间',
			},
			//盒子高度
			height: {
				type: String,
				default: '600rpx',
			},
			//展示近几日时间
			day: {
				type: Number,
				default: 7
			},
			//是否点击阴影关闭
			isMask: {
				type: Boolean,
				default: true,
			},
			//是否开启动画
			animation: {
				type: Boolean,
				default: true,
			},
			//是否开启安全条
			safeArea: {
				type: Boolean,
				default: false,
			},
			//圆角
			radius: {
				type: String,
				default: '24rpx',
			},
		},
		data() {
			return {
				isShow: false,
				selectedIndex: 0,
				selectedDay: {},
				selectedTimeIndex: 999,
				days: [],
				time: ''
				// days: []
			};
		},
		mounted() {
			this.days = this.getFutureDays()
			this.selectedDay = this.days[0]
		},
		computed: {
			scrollClass() {
				const classes = ['scroll-popup'];
				if (this.isShow) classes.push('scroll-open');
				if (this.animation) classes.push('scroll-animation');
				if (this.safeArea) classes.push('scroll-temp');
				return classes;
			},
			getRadius() {
				return `${this.radius} ${this.radius} 0 0`;
			},
		},
		methods: {
			//时间数据构造
			getFutureDays() {
				const list = uni.getStorageSync('timelist')
				const output = list.map(item => {
					const timeList = item.time.map(time => {
						const [start, end] = time.split('~');
						return {
							time: time,
							start: start,
							end: end
						};
					});
					return {
						day: item.day,
						day_v: item.day_v,
						timeList: timeList
					};
				});
				this.days = output
				return output;
			},
			open() {
				this.isShow = true;
				this.init();
			},
			init() {
				this.selectedIndex = 0;
				this.selectedDay = this.days[0];
				this.selectedTimeIndex = 999;
				// this.selectedTimeIndex = this.selectedTimeIndex
				console.log(1112, this.selectedTimeIndex);
			},
			close() {
				this.isShow = false;
			},
			handleDateClick(index) {
				this.selectedIndex = index;
				this.selectedDay = this.days[index];
				this.selectedTimeIndex = 999;
				console.log(1113, this.selectedTimeIndex);
			},
			handleTimeClick(index, time) {
				this.selectedTimeIndex = index;
				this.time = time
				console.log(4444, time);
			},
			confirm() {
				if (this.selectedTimeIndex == 999) {
					uni.showToast({
						title: this.title,
						icon: 'none',
						style: {
							'z-index': 99999
						}
					})
					return
				}
				const time = this.selectedDay.timeList[this.selectedTimeIndex]
				this.close();
				this.$emit('change', {
					day: this.selectedDay.day,
					day_v: this.selectedDay.day_v,
					time: time.time,
					startHour: time.start,
					endHour: time.end,
					value: `${this.selectedDay.day} ${time.time}`,
				});
			}
		},
	};
</script>

<style>
	::v-deep ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}
</style>
<style scoped>
	/* 弹出层默认样式 */
	.scroll-popup {
		width: 100%;
		position: fixed;
		bottom: -100%;
		z-index: 999;
	}

	/* 点击按钮是将盒子 bottom 值归零即可实现弹出效果,
	 同理，如需更改弹出方向只需将bottom改成top、left、right即可
	 (默认样式的方向也需一起更改哦) */
	.scroll-open {
		bottom: 0px !important;
	}

	.scroll-animation {
		transition: all 0.25s linear;
	}

	.scroll-temp {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 遮罩层样式 */
	.scroll-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 998;
	}

	.time-picker {
		display: flex;
		align-items: center;
		color: #666666;
		background-color: #fff;
	}

	.time-title {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		font-weight: bold;
		/* color: #333333; */
		background-color: #ffffff;
		text-align: center;
		position: relative;
		padding-top: 20rpx;
		/* border-bottom: 1rpx solid #f6f6f6; */
	}

	.time-title span {
		font-size: 28rpx;
		font-weight: 400;
		position: absolute;
		left: 32rpx;
		/* top: 0; */
		bottom: 0;
		margin: auto 0;
		color: #666666;
	}

	.time-title text {
		font-size: 28rpx;
		font-weight: 400;
		position: absolute;
		right: 32rpx;
		/* top: 0; */
		bottom: 0;
		margin: auto 0;
		color: #666666;
	}

	.date-scroll {
		flex: 1;
		height: 100%;
		/* border-right: 1rpx solid #f6f6f6; */
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		background-color: #f8f8f8;
	}

	.date-item {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		box-sizing: border-box;
		width: 236rpx;
		/* width: 300rpx; */
		/* max-width: 236rpx; */
		/* border-bottom: 1rpx solid #f6f6f6; */
	}

	.date {
		font-size: 28rpx;
		line-height: 88rpx;
		font-weight: 400;
		color: #A2A2A2;
	}

	.date.active {
		font-size: 30rpx;
		color: #1B1B1B;
		background-color: #ffffff;
		line-height: 88rpx;
	}

	.time-scroll {
		/* flex: 1; */
		height: 100%;
	}

	.time-item {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		box-sizing: border-box;
		/* border-bottom: 1rpx solid #f6f6f6; */
	}

	.time {
		font-size: 28rpx;
		line-height: 88rpx;
		font-weight: 400;
		/* color: #A2A2A2; */
		color: #1B1B1B;
		text-align: center;
	}

	.time.active {
		font-size: 28rpx;
		line-height: 88rpx;
		font-weight: 400;
		color: #1B1B1B;
		text-align: center;
	}

	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.uni-list-cell-pd {
		padding: 0px 0px;
		margin-bottom: 30rpx;
	}

	radio {
		transform: scale(0.7);
	}

	.sontime {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* margin: 0 40rpx 0 64rpx; */
		/* #ifdef APP-PLUS */
		margin: 0 40rpx 0 64rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		margin: 10rpx 40rpx 20rpx 64rpx;
		/* #endif */
		/* #ifdef H5 */
		margin: 0 40rpx 0 64rpx;
		/* #endif */
	}
</style>