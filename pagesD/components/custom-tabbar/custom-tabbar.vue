<template>
  <view class="tabbar-container" :style="{ height: totalHeight + 'px' }" v-if="showTabBar">
    <view class="custom-tabbar">
      <view 
        v-for="(item, index) in list" 
        :key="index"
        class="tab-item"
        @click="handleTabClick(item, index)"  
      >
        <image 
          :src="getIconPath(item, index)"
          class="icon"
          style="height: 48rpx;width: 48rpx;"
        />
        <text style="font-size: 20rpx;
    line-height: normal;
    margin-top: 6rpx;" :class="{ active: currentIndex === index }">{{ item.text }}</text>
      </view>
    </view>
    
    <!-- 安全区域占位 -->
    <view class="safe-area"></view>
  </view>
</template>


<script>

const tabBarRoutes = [
  "/pages/middles/middles",
  "/pages/chat/chat",
  "/pages/member/member",
  "/pages/cart/cart",
  "/pages/user/user"
];
export default {
  data() {
 
    
    return {
	currentIndex: 0,
	      lastTapTime: 0,
	      lastTapIndex: -1, // 添加记录上次点击的索引
	      safeAreaInsets: 0,
	      iconVersion: 0,
	      totalHeight: 60, // 增加默认高度
	      list: [], // 初始化为空数组，在created中初始化
	      showTabBar: false
    };
  },
   created() {
     this.initTabList();
     this.hideNativeTabBar();
     uni.$on('switch-tab', this.updateActiveTab);
     
     // 初始化TabBar状态
     setTimeout(() => {
       this.forceUpdateActiveTab();
       this.showTabBar = true; // 确保初始显示
     }, 100);
   },
mounted() {
    this.updateSafeArea();
    uni.onWindowResize(this.updateSafeArea);
  },
  beforeDestroy() {
    uni.offWindowResize(this.updateSafeArea);
    uni.$off('switch-tab', this.updateActiveTab);
  },
  methods: {
	   // 初始化列表（解决部分平台未定义问题）
	      initTabList() {
	        // #ifdef MP-WEIXIN
	        this.list = [
  {
    pagePath: "/pages/middles/middles",
    text: "首页",
    iconPath: "/static/tabBar/tabBar1.png",
    selectedIconPath: "/static/tabBar/tabBar_cur_1.png"
  },
  {
    pagePath: "/pages/chat/chat",
    text: "消息",
    iconPath: "/static/tabBar/tabBar2.png",
    selectedIconPath: "/static/tabBar/tabBar_cur_2.png"
  },
  {
    pagePath: "/pages/member/member",
    text: "黑卡",
    iconPath: "/static/tabBar/tabBar3.png",
    selectedIconPath: "/static/tabBar/tabBar_cur_3.png"
  },
  {
    pagePath: "/pages/cart/cart",
    text: "采购车",
    iconPath: "/static/tabBar/tabBar4.png",
    selectedIconPath: "/static/tabBar/tabBar_cur_4.png"
  },
  {
    pagePath: "/pages/user/user",
    text: "我的",
    iconPath: "/static/tabBar/tabBar5.png",
    selectedIconPath: "/static/tabBar/tabBar_cur_5.png"
  }
]; // 微信小程序列表
	        // #endif
	        // #ifndef MP-WEIXIN
	        this.list = [
  {
    pagePath: "/pages/middles/middles",
    text: "首页",
    iconPath: "/static/tabBar/tabBar1.png",
    selectedIconPath: "/static/tabBar/tabbar1.gif"
  },
  {
    pagePath: "/pages/chat/chat",
    text: "消息",
    iconPath: "/static/tabBar/tabBar2.png",
    selectedIconPath: "/static/tabBar/tabbar2.gif"
  },
  {
    pagePath: "/pages/member/member",
    text: "黑卡",
    iconPath: "/static/tabBar/tabBar3.png",
    selectedIconPath: "/static/tabBar/tabbar3.gif"
  },
  {	
    pagePath: "/pages/cart/cart",
    text: "采购车",
    iconPath: "/static/tabBar/tabBar4.png",
    selectedIconPath: "/static/tabBar/tabbar4.gif"
  },
  {
    pagePath: "/pages/user/user",
    text: "我的",
    iconPath: "/static/tabBar/tabBar5.png",
    selectedIconPath: "/static/tabBar/tabbar5.gif"
  }
]; // 其他平台列表
	        // #endif
	        
	        // 确保列表不为空
	        if (!this.list || this.list.length === 0) {
	          this.list = [
  {
    pagePath: "/pages/middles/middles",
    text: "首页",
    iconPath: "/static/tabBar/tabBar1.png",
    selectedIconPath: "/static/tabBar/tabbar1.gif"
  },
  {
    pagePath: "/pages/chat/chat",
    text: "消息",
    iconPath: "/static/tabBar/tabBar2.png",
    selectedIconPath: "/static/tabBar/tabbar2.gif"
  },
  {
    pagePath: "/pages/member/member",
    text: "黑卡",
    iconPath: "/static/tabBar/tabBar3.png",
    selectedIconPath: "/static/tabBar/tabbar3.gif"
  },
  {	
    pagePath: "/pages/cart/cart",
    text: "采购车",
    iconPath: "/static/tabBar/tabBar4.png",
    selectedIconPath: "/static/tabBar/tabbar4.gif"
  },
  {
    pagePath: "/pages/user/user",
    text: "我的",
    iconPath: "/static/tabBar/tabBar5.png",
    selectedIconPath: "/static/tabBar/tabbar5.gif"
  }
]; // 默认列表
	        }
	      },
	  
	  
	  // 新增初始化方法
	      initTabState() {
	        // 方案1：直接设置首页为激活状态
	        this.currentIndex = 0;
	        this.showTabBar = true;
	       
	        // 方案2：延迟检测确保页面栈就绪
	        setTimeout(() => {
	          const pages = getCurrentPages();
	          if (pages.length === 0) {
	            this.currentIndex = 0;
	            this.showTabBar = true;
	          }
	          this.iconVersion++; // 强制更新图标
	        }, 300);
	        // Android特定修复
	              // #ifdef APP-PLUS
	              if (plus.os.name.toLowerCase() === 'android') {
	                setTimeout(() => {
	                  this.showTabBar = true;
	                  this.iconVersion++;
	                }, 300);
	              }
	              // #endif
	        // 方案3：监听首页加载完成事件
	        uni.$once('home-page-ready', () => {
	          this.currentIndex = 0;
	          this.showTabBar = true;
	          this.iconVersion++;
	        });
	      },
	  // 新增强制更新方法
	       forceUpdateActiveTab() {
	           try {
	             const pages = getCurrentPages();
	             if (pages.length === 0) {
	               this.currentIndex = 0;
	               this.showTabBar = true;
	               return;
	             }
	             this.updateActiveTab();
	           } catch (e) {
	             console.error('强制更新激活状态失败:', e);
	             this.showTabBar = true;
	             this.currentIndex = 0;
	           }
	         },
		     // 修改路径匹配逻辑（更宽松的匹配）
  updateActiveTab() {
      try {
        const pages = getCurrentPages();
        if (!pages.length) {
          this.showTabBar = true;
          this.currentIndex = 0;
          return;
        }
        
        const currentPage = pages[pages.length - 1];
        if (!currentPage) return;
        
        // 获取当前路径（兼容多种格式）
        let currentPath = currentPage.route || 
                         currentPage.$page?.route || 
                         currentPage.__route__;
        
        // 标准化路径
        const normalizedPath = normalizePath(currentPath);
        
        // 检查是否为TabBar页面
        const isTabBarPage = tabBarRoutes.some(route => {
          return normalizedPath === normalizePath(route);
        });
        
        if (isTabBarPage) {
          this.showTabBar = true;
          
          // 更新当前索引
          const index = tabBarRoutes.findIndex(route => {
            return normalizedPath === normalizePath(route);
          });
          
          if (index !== -1) {
            this.currentIndex = index;
          }
        } else {
          this.showTabBar = false;
        }
      } catch (e) {
        console.error('更新激活标签失败:', e);
        this.showTabBar = true;
        this.currentIndex = 0;
      }
    },
	    // 检查是否显示TabBar
	       checkTabBarVisibility() {
	         const pages = getCurrentPages();
	         if (!pages.length) return;
	         
	         const currentPage = pages[pages.length - 1];
	         if (!currentPage) return;
	         
	         let currentPath = currentPage.route || currentPage.$page?.route;
	         if (!currentPath) return;
	         
	         if (!currentPath.startsWith('/')) {
	           currentPath = `/${currentPath}`;
	         }
	         
	         // 判断当前页面是否为TabBar页面
	         this.showTabBar = tabBarRoutes.some(path => {
	           return path === currentPath || 
	                  path === `/${currentPath}` ||
	                  path === currentPath.replace(/^\//, '');
	         });
	       },
		   // 增强原生TabBar隐藏
   hideNativeTabBar() {
      const hide = () => {
        try {
          // 微信小程序
          if (typeof wx !== 'undefined' && wx.hideTabBar) {
            wx.hideTabBar({ animation: false });
          }
          // 支付宝小程序
          if (typeof my !== 'undefined' && my.hideTabBar) {
            my.hideTabBar();
          }
          // 其他小程序
          if (uni.hideTabBar) {
            uni.hideTabBar({ animation: false });
          }
        } catch (e) { 
          console.error('隐藏原生TabBar出错:', e); 
        }
      };
      
      // 多次尝试确保生效
      hide();
      setTimeout(hide, 100);
      setTimeout(hide, 500);
    },
    getIconPath(item, index) {
      if (this.currentIndex === index) {
        return `${item.selectedIconPath}?v=${this.iconVersion}&t=${Date.now()}`;
      }
      return item.iconPath;
    },
    
    // 更新活动标签
        updateActiveTab() {
          const pages = getCurrentPages();
          if (!pages.length) return;
          
          const currentPage = pages[pages.length - 1];
          if (!currentPage) return;
          
          // 处理不同格式的路径
          let currentPath = currentPage.route || currentPage.$page?.route;
          if (!currentPath) return;
          
          if (!currentPath.startsWith('/')) {
            currentPath = `/${currentPath}`;
          }
          
          // 查找匹配的导航项
          const index = this.list.findIndex(item => {
            return item.pagePath === currentPath || 
                   item.pagePath === `/${currentPath}` ||
                   item.pagePath === currentPath.replace(/^\//, '');
          });
          
          if (index !== -1) {
            this.currentIndex = index;
          }
          console.log('当前路径:', currentPath, '匹配结果:', index, '显示状态:', this.showTabBar)
          // 同时检查是否显示TabBar
          this.checkTabBarVisibility();
        },
    
    // 更新安全区域
    // 修改 updateSafeArea 方法
 updateSafeArea() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        let safeAreaInsets = 0;
        
        // 小程序安全区域处理
        // #ifdef MP-WEIXIN
        safeAreaInsets = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        // #endif
        
        // #ifndef MP-WEIXIN
        safeAreaInsets = systemInfo.safeAreaInsets?.bottom || 0;
        // #endif
        
        this.safeAreaInsets = Math.max(safeAreaInsets, 0);
        this.totalHeight = 50 + this.safeAreaInsets;
        
      } catch (e) {
        console.warn('安全区域计算失败:', e);
        this.safeAreaInsets = 0;
        this.totalHeight = 50;
      }
    },
     // 统一处理标签点击事件
        handleTabClick(item, index) {
		 try {
          const now = Date.now();
          const timeDiff = now - this.lastTapTime;
          
          // 判断是否是双击（同一标签在300ms内被点击两次）
          if (timeDiff < 300 && this.lastTapIndex === index && this.currentIndex === index) {
            // 执行返回顶部操作
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 300,
              success: () => {
                console.log('已滚动到顶部');
              }
            });
          } else {
            // 普通点击，执行页面切换
            this.switchTab(item, index);
          }
          
          // 更新点击记录
          this.lastTapTime = now;
          this.lastTapIndex = index;
		  
		   } catch (e) {
		          console.error('Tab 点击处理出错:', e);
		          // 尝试直接切换
		          this.switchTab(item, index);
		        }
        },
    // 单击切换页面
        switchTab(item, index) {
		try {
			
          // 解决首次点击状态不同步问题
          if (this.currentIndex === index) {
            this.iconVersion += 1;
            return;
          }
          
          // 立即更新状态
          this.currentIndex = index;
          this.iconVersion += 1;
          
          // 切换页面
          uni.switchTab({ 
            url: item.pagePath,
            success: () => {
              // 确保状态同步
              this.updateActiveTab();
              uni.$emit('switch-tab');
            },
            fail: (err) => {
              console.error('切换页面失败:', err);
            }
          });
		  
		  } catch (e) {
		          console.error('切换 Tab 出错:', e);
		          // 直接跳转作为后备
		          uni.switchTab({ url: item.pagePath });
		        }
        },
    
  }
};
</script>

<style scoped>
	/* #ifdef APP-PLUS */
	.tabbar-container {
	  bottom: 0 !important;
	  z-index: 9999999;
	}
	/* #endif */
/* 容器样式 - 确保固定在底部 */
.tabbar-container {
  position: fixed !important;
  bottom: 0 !important;
  left: 0;
  right: 0;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  /* 解决部分安卓机型显示问题 */
  transform: translateZ(0);
}

/* 导航栏内容区域 */
.custom-tabbar {
  display: flex;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(238, 238, 238, 0.7);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  /* 解决iOS滑动穿透问题 */
  position: relative;
  z-index: 100;
}

/* 安全区域占位 - 使用CSS常量 */
.safe-area {
  
   height: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: transparent;
}
/* 解决部分机型图标闪烁问题 */
.icon {
  will-change: transform;
}

/* 增加点击区域 */
.tab-item {
  padding: 10rpx 0;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
	
}

.icon {
  width: 48rpx ;
  height: 48rpx ;
  margin-bottom: 2px;
  transition: transform 0.2s ease; /* 添加过渡效果防止跳动 */
	
}

.active {
  color: #f23030;
  font-weight: 500;
}
</style>