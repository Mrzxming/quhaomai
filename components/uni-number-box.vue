<template>

	<view class="uni-numbox">
		<view :class="{'uni-numbox--disabled': inputValue <= min || disabled}" class="uni-numbox__minus"
			@click="_calcValue('minus')">-</view>
		<input :disabled="disabled" v-model="inputValue" class="uni-numbox__value" type="number" @blur="_onBlur" @confirm="_onConfirm">
		<view :class="{'uni-numbox--disabled': inputValue >= max || disabled}" class="uni-numbox__plus"
			@click="_calcValue('plus')">+</view>
	</view>
</template>

<script>
	export default {
		name: 'UniNumberBox',
		props: {
			value: {
				type: Number,
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				inputValue: this.value,
				timeout: '',
				lastEmittedValue: this.value // 保存最后一次触发的值
			}
		},
		watch: {
			value(val) {
				this.inputValue = +val
				this.lastEmittedValue = +val
			},
			// 移除 inputValue 的自动触发逻辑
			// 只在用户点击确定或失去焦点时（_onBlur）才触发 change 事件
			// inputValue(newVal, oldVal) {
			// 	clearTimeout(this.timeout);
			// 	this.timeout = setTimeout(() => {
			// 		if (newVal == '' && newVal == 0) {
			// 			newVal = 1
			// 		}
			// 		const finalVal = parseInt(newVal);
			// 		if (+finalVal !== +this.lastEmittedValue) {
			// 			this.lastEmittedValue = finalVal;
			// 			this.$emit('change', finalVal)
			// 		}
			// 	}, 500);
			// }
		},
		created() {
			this.inputValue = +this.value
			this.lastEmittedValue = +this.value
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return
				}
				const scale = this._getDecimalScale()
				let value = this.inputValue * scale
				let step = this.step * scale
				if (type === 'minus') {
					value -= step
				} else if (type === 'plus') {
					value += step
				}
				if (value < this.min) {
					uni.showToast({
						title: '最少购买' + this.min + '件哦！',
						icon: 'none'
					})
					return
				}

				if (this.max > 0) {
					if (value > this.max) {
						uni.showToast({
							title: '最大购买' + this.max + '件哦！',
							icon: 'none'
						})
						return
					}
				} else {
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					})
					return
				}
				this.inputValue = value / scale
				
				// 点击加减按钮时，直接触发 change 事件（因为已经移除了 watch 中的自动触发）
				const finalValue = parseInt(this.inputValue);
				if (+finalValue !== +this.lastEmittedValue) {
					this.lastEmittedValue = finalValue;
					this.$emit('change', finalValue)
				}
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			_onConfirm(event) {
				// 用户点击键盘上的确定按钮时触发
				this._processInputValue(event);
			},
			_onBlur(event) {
				// 清除之前的延迟（虽然已经移除了 watch 中的自动触发，但保留以防万一）
				clearTimeout(this.timeout);
				
				// 失去焦点时处理输入值
				// 注意：如果用户点击了确定按钮，_onConfirm 会先触发，这里为了避免重复，需要检查
				this._processInputValue(event);
			},
			_processInputValue(event) {
				// 优先使用 event.detail.value（用户在输入框中实际输入的值）
				// 如果获取不到，则使用 v-model 绑定的当前值
				let value = (event && event.detail && event.detail.value !== undefined) ? event.detail.value : this.inputValue

				if (value == 0 || value == '' || value == null || value == undefined) {
					value = 1
				}

				if (!value) {
					value = 1
				} else {
					value = +value
					if (value > this.max) {
						value = this.max
					} else if (value < this.min) {
						value = this.min
					}
				}
				
				const finalValue = parseInt(value);
				
				// 更新 inputValue（如果被修正过）
				if (finalValue !== this.inputValue) {
					this.inputValue = finalValue;
				}
				
				// 只在用户点击确定或失去焦点时触发 change 事件，而不是在输入过程中自动触发
				// 这样可以避免自动关闭键盘，只有用户主动操作时才调用更新接口
				if (+finalValue !== +this.lastEmittedValue) {
					this.lastEmittedValue = finalValue;
					this.$emit('change', finalValue)
				}
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 50upx;
		position: relative
	}

	.uni-numbox:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		/* border: 1px solid #c8c7cc; */
		border-radius: 12upx;
		transform: scale(.5)
	}

	.uni-numbox__minus,
	.uni-numbox__plus {
		margin: 0;
		background-color: #f8f8f8;
		width: 52rpx;
		font-size: 40upx;
		height: 100%;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #333;
		position: relative;
		overflow: hidden;
	}

	.uni-numbox__value {
		position: relative;
		background-color: #fff;
		width: 80upx;
		height: 100%;
		text-align: center;
		padding: 1upx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.uni-numbox__value:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
	/* 	border-style: solid;
		border-color: #c8c7cc; */
/* 		border-left-width: 1px;
		border-right-width: 1px; */
		border-top-width: 0;
		border-bottom-width: 0;
		transform: scale(.5)
	}

	.uni-numbox--disabled {
		color: silver
	}
</style>