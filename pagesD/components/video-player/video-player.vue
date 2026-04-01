<template>
	<!-- 需要注意 这个组件要放在引用页面的最外层，不能放在消息流内， -->
  <!-- 只包含全屏播放器 -->
  <view v-if="visible" class="global-fullscreen-wrapper">
    <!-- 小程序专用全屏播放器 -->
    <!-- #ifdef MP-WEIXIN -->
    <video
      id="videoPlayerInstance"
      :src="videoData.url"
      autoplay
      :controls="true"
      :show-play-btn="true"
      :show-center-play-btn="true"
      :show-fullscreen-btn="false"
      objectFit="contain"
      style="width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:99999;"
      @fullscreenchange="handleFullscreenChange"
      @play="handleVideoPlayEvent"
      @pause="handleVideoPauseEvent"
      @ended="handleVideoEnded"
    ></video>
    <!-- #endif -->

    <!-- 其他平台播放器 -->
    <!-- #ifndef MP-WEIXIN -->
    <video
      id="videoPlayerInstance"
      :src="videoData.url"
      autoplay
      :show-fullscreen-btn="false"
      class="fullscreen-video-element"
      @fullscreenchange="handleFullscreenChange"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @play="handleVideoPlayEvent"
      @pause="handleVideoPauseEvent"
      @ended="handleVideoEnded"
      @error="handleVideoError"
    ></video>
    <!-- #endif -->

    <cover-view class="custom-controls">
      <cover-image
        src="https://images.eqingqu.com/attachs/photo/202404/20240416_91B3F995F947597318A8F13F391CFAD3.png"
        @click="exitFullscreen"
        class="close-btn"
      ></cover-image>
    </cover-view>
  </view>
</template>

<script>
export default {
  props: {
     
    },
  data() {
     return {
		  visible: false,
		       videoData: null,
			   videoContext: null,
         fullscreenVisible: false,
         isPlaying: false,
         currentTime: 0,
         duration: 0,
         videoContext: null,
         platform: 'mp-weixin' // 默认值，在created中设置实际值
       };
  },
   created() {
     // 获取实际平台
     const systemInfo = uni.getSystemInfoSync();
     this.platform = systemInfo.platform || 'mp-weixin';
   },
   computed: {
     thumb() {
       return 'https://images.eqingqu.com/attachs/photo/202511/20251124_F26F5D418A1812885494D12540F7DF58.png';
     }
   },
  methods: {
	   play(videoData) {
		   console.log(videoData)
	         this.videoData = videoData;
	         this.visible = true;
	         
	         this.$nextTick(() => {
	           // 统一使用 uni.createVideoContext
	           this.videoContext = uni.createVideoContext('videoPlayerInstance', this);
	           
	           if (this.videoContext && this.videoContext.play) {
	             this.videoContext.play();
	           }
	         });
	       },
	       
	       close() {
	         if (this.videoContext) {
	           if (this.videoContext.pause) {
	             this.videoContext.pause();
	           }
	           if (this.videoContext.seek) {
	             this.videoContext.seek(0);
	           }
	           this.videoContext = null;
	         }
	         
	         this.visible = false;
	         this.videoData = null;
	       },
	       
	       exitFullscreen() {
	         this.close();
	       },
	       
	       handleFullscreenChange(e) {
	         if (!e.detail.fullScreen) {
	           this.close();
	         }
	       },
	       
	       handleVideoEnded() {
	         this.close();
	       },
	       
	       exitFullscreen() {
	         this.close();
	       },
    // 播放视频
    // async handlePlay() {
    //   this.resetVideoState();
    //   this.fullscreenVisible = true;
      
    //   await this.$nextTick();
      
    //   // #ifdef MP-WEIXIN
    //   this.videoContext = uni.createVideoContext('videoPlayerInstance', this);
    //   this.videoContext.play();
    //   // #endif
      
    //   // #ifndef MP-WEIXIN
    //   this.videoContext = document.getElementById('videoPlayerInstance');
    //   this.videoContext.play();
    //   // #endif
      
    //   this.isPlaying = true;
    // },
    
    // // 退出全屏
    // exitFullscreen() {
    //   try {
    //     if (this.videoContext) {
    //       this.videoContext.pause();
    //       this.videoContext.seek(0);
    //     }
    //   } catch (error) {
    //     console.error('退出失败:', error);
    //   }
      
    //   this.resetVideoState();
      
    //   // #ifdef APP-PLUS
    //   plus.navigator.setFullscreen(false);
    //   // #endif
    // },
    
    // // 重置播放状态
    // resetVideoState() {
    //   this.fullscreenVisible = false;
    //   this.videoContext = null;
    //   this.currentTime = 0;
    //   this.duration = 0;
    //   this.isPlaying = false;
    // },
    
    // 以下是视频事件处理
    handleFullscreenChange(e) {
      if (!e.detail.fullScreen) {
        this.exitFullscreen();
      }
    },
    
    handleTimeUpdate(e) {
      // #ifndef MP-WEIXIN
      this.currentTime = e.detail.currentTime;
      // #endif
    },
    
    handleLoadedMetadata(e) {
      // #ifndef MP-WEIXIN
      this.duration = e.detail.duration;
      // #endif
    },
    
    handleVideoPlayEvent() {
      this.isPlaying = true;
    },
    
    handleVideoPauseEvent() {
      this.isPlaying = false;
    },
    
    handleVideoEnded() {
      this.exitFullscreen();
    },
    
    handleVideoError(e) {
      console.error('视频错误:', e);
      uni.showToast({
        title: '视频播放错误: ' + e.detail.errMsg,
        icon: 'none',
        duration: 3000
      });
    }
  }
};
</script>

<style scoped>
.video-message-container {
  width: 280rpx;
  height: 400rpx;
  margin: 15rpx 0;
  border-radius: 12rpx;
  overflow: hidden;
  background: #000;
}

.video-thumb {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-thumb image:first-child {
  width: 100%;
  height: 100%;
  opacity: 0.95;
}

.play-overlay {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.global-fullscreen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fullscreen-video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.custom-controls {
  position: absolute;
  top: 100rpx;
  left: 40rpx;
  z-index: 9999999;
}

.close-btn {
  width: 50rpx;
  height: 50rpx;
  z-index: 99999991;
}
</style>