<template>
  <view class="custom-tabbar" :style="{ paddingBottom: safeAreaInsets + 'px' }">
    <view 
      v-for="(item, index) in list" 
      :key="index"
      class="tab-item"
      @click="switchTab(item, index)"
      @dblclick="scrollToTop(index)" <!-- 双击事件绑定 -->
    >
      <image 
        :src="currentIndex === index ? item.selectedIconPath : item.iconPath" 
        class="icon"
      />
      <text :class="{ active: currentIndex === index }">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0, // 当前选中项
      lastTapTime: 0, // 记录上次点击时间（用于双击判断）
      safeAreaInsets: 0, // 底部安全区高度
      "list": [{
      					"pagePath": "pages/middles/middles",
      					"text": "首页",
      					"iconPath": "/static/tabBar/tabBar1.png",
      					"selectedIconPath": "/static/tabBar/tabbar1.gif"
      				},
      				{
      					"pagePath": "pages/chat/chat",
      					"text": "消息",
      					"iconPath": "/static/tabBar/tabBar2.png",
      					"selectedIconPath": "/static/tabBar/tabbar2.gif"
      				},
      				{
      					"pagePath": "pages/member/member",
      					"text": "黑卡",
      					"iconPath": "/static/tabBar/tabBar3.png",
      					"selectedIconPath": "/static/tabBar/tabbar3.gif"
      				},
      				{	
      					"pagePath": "pages/cart/cart",
      					"text": "采购车",
      					"iconPath": "/static/tabBar/tabBar4.png",
      					"selectedIconPath": "/static/tabBar/tabbar4.gif"
      				},
      				{
      					"pagePath": "pages/user/user",
      					"text": "我的",
      					"iconPath": "/static/tabBar/tabBar5.png",
      					"selectedIconPath": "/static/tabBar/tabbar5.gif"
      				}
      			]
    };
  },
  mounted() {
    // 获取底部安全区高度（适配全面屏）
    this.safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets.bottom;
  },
  methods: {
    // 单击切换页面
    switchTab(item, index) {
      if (this.currentIndex === index) {
        // 当前页重复点击时，不触发页面跳转
        return;
      }
      this.currentIndex = index;
      uni.switchTab({ url: item.pagePath });
    },
    
    // 双击返回顶部
    scrollToTop(index) {
      const now = Date.now();
      if (now - this.lastTapTime < 300 && this.currentIndex === index) {
        uni.pageScrollTo({ scrollTop: 0, duration: 300 }); // 执行滚动:cite[5]
      }
      this.lastTapTime = now;
    }
  }
};
</script>

<style scoped>
.custom-tabbar {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: white;
  border-top: 1px solid #eee;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 24px;
  height: 24px;
}
.active {
  color: #007AFF; /* 选中态颜色 */
}
</style>
