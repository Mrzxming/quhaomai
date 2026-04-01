<template>
  <view class="label-box" v-if="displayTags &&displayTags.length > 0">
    <view 
      v-for="tag in displayTags" 
      :key="tag.name" 
      class="label-item" 
      :class="tagClasses[tag.value] || ''"
    >
      {{ tag.name }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsServiceLabel',
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    maxDisplay: {
      type: Number,
      default: 2
    }
  },
  computed: {
    // 筛选并排序标签
    displayTags() {
      if (!this.tags || !Array.isArray(this.tags)) return [];
      // 有效标签值映射（移除首单减N元和平台最低价，这两个在优惠券行显示）
      // 【修改1】补充24小时发货的value=6（如果24小时发货的value是6，必须加到这里，否则会被过滤）
      const validValues = [0, 1, 2, 3, 4, 5, 6, 8];
      
      // 严格优先级排序（与 middles 顺序一致）
      const priorityMap = {
        '退货包运费': 1,
        '包邮': 2,
        '回头率': 3,
        '积分可抵': 4,
        '先用后付': 5,
        '24小时发货': 6,
        '一件代发': 7
      }
      try {
        const validTags = this.tags.filter(tag => 
          tag && typeof tag === 'object' && 
          validValues.includes(tag.value)
        );
        // 【修改2】重写排序逻辑：从精准匹配name改为关键词模糊匹配（适配回头率带百分比的场景）
        const sorted = validTags.sort((a, b) => {
          // 新增：根据标签名称包含的关键词获取优先级
          const getTagPriority = (tagName) => {
            for (const [key, priority] of Object.entries(priorityMap)) {
              if (tagName.includes(key)) {
                return priority;
              }
            }
            return Infinity; // 无匹配关键词的标签放最后
          };
          const priorityA = getTagPriority(a.name);
          const priorityB = getTagPriority(b.name);
          return priorityA - priorityB;
        });
        // 方案一：退货包运费 + 24小时发货 同时存在时只显示 2 个（两标签过宽），否则最多 3 个
        const hasReturn = sorted.some(t => t.name === '退货包运费');
        const has24h = sorted.some(t => t.name === '24小时发货');
        const maxCount = (hasReturn && has24h) ? 2 : Math.min(this.maxDisplay, 2);
        return sorted.slice(0, maxCount);
      } catch (e) {
        console.error('Error processing tags:', e);
        return [];
      }
    },
    // 新增计算属性处理样式类
    tagClasses() {
      return {
        0: this.tags.find(t => t.value === 0)?.name === '包邮' ? 'zero-label' : 'zero-tag',
        1: 'first-label',
        2: 'second-label',
        3: 'second-label',
        4: 'second-label',
        5: 'second-label',
        6: 'second-label', // 24小时发货样式
        8: 'second-label'  // 一件代发样式（与其他次要标签保持一致）
      }
    }
  },
  methods: {
    // 获取标签样式类
    getTagClass(tag) {
      const classMap = {
        0: tag => tag.name === '包邮' ? 'zero-label' : 'zero-tag',
        1: 'first-label',
        2: 'second-label',
        3: 'second-label',
        4: 'second-label',
        5: 'second-label',
        6: 'second-label',
        8: 'second-label'
      }
    
      return typeof classMap[tag.value] === 'function' 
        ? classMap[tag.value](tag) 
        : classMap[tag.value] || '';
    }
  }
}
</script>
<style scoped>
/* 样式保持不变 */
.label-box {
  display: flex;
  font-size: 24rpx;
  margin-top: 10rpx;
  overflow: hidden;
}

.label-item {
  margin-right: 8rpx;
  min-width: fit-content;
}

.zero-label {
  color: #09B248;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  font-style: normal;
}

.zero-tag {
  color: #FF7705;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  font-style: normal;
}

.first-label {
  color: #09B248;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  font-style: normal;
}

.second-label {
  color: #A2A2A2;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  font-style: normal;
}
</style>

