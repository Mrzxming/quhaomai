<template>
	<view 
		class="custom-switch" 
		:class="{'custom-switch--checked': checked, 'custom-switch--disabled': disabled}"
		@tap.stop="handleTap">
		<view class="custom-switch__track" :class="{'custom-switch__track--checked': checked}" :style="trackStyle">
			<view class="custom-switch__thumb" :style="thumbStyle"></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomSwitch',
	props: {
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: '#007aff' // 蓝色
		}
	},
	computed: {
		trackStyle() {
			// 直接设置背景颜色，确保在微信小程序中生效
			// 使用 !important 确保样式优先级
			const bgColor = this.checked ? this.color : '#dfdfdf';
			return {
				backgroundColor: bgColor
			}
		},
		thumbStyle() {
			// 开关宽度 52px，滑块宽度 28px，左右各 2px 边距
			// 开启时：52 - 28 - 2 = 22px，但实际是 20px（因为左边距是 2px）
			return {
				transform: this.checked ? 'translateX(20px)' : 'translateX(0)'
			}
		}
	},
	methods: {
		handleTap() {
			// 如果禁用，直接返回，不触发任何事件
			if (this.disabled) {
				return;
			}
			// 触发 change 事件，传递新的状态
			this.$emit('change', {
				detail: {
					value: !this.checked
				}
			});
		}
	}
}
</script>

<style scoped>
.custom-switch {
	position: relative;
	display: inline-block;
	width: 52px;
	height: 32px;
	vertical-align: middle;
	box-sizing: border-box;
}

.custom-switch__track {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 16px;
	transition: background-color 0.3s ease;
	box-sizing: border-box;
	/* 默认灰色 */
	background-color: #dfdfdf;
}

/* 开启状态：蓝色背景 */
.custom-switch__track--checked {
	background-color: #007aff !important;
}

.custom-switch__thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 28px;
	height: 28px;
	background-color: #ffffff;
	border-radius: 50%;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	transition: transform 0.3s ease;
	box-sizing: border-box;
}

.custom-switch--checked .custom-switch__thumb {
	transform: translateX(20px);
}

.custom-switch--disabled {
	opacity: 0.5;
}

/* 禁用状态下完全阻止点击事件 */
.custom-switch--disabled {
	pointer-events: none;
}

/* 确保禁用状态下无法点击 */
.custom-switch--disabled .custom-switch__track {
	cursor: not-allowed;
}
</style>

