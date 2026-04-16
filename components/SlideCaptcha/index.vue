<template>
<view v-if="visible" class="sc-mask" :class="{ 'sc-mask--show': maskShow }"
  @touchmove.stop.prevent="onMove" @touchend.stop="onEnd"
  @click.self="close">
  <view class="sc-dialog" :class="{ 'sc-dialog--show': maskShow }" @click.stop>
    <!-- 头部 -->
    <view class="sc-header">
      <text class="sc-header__title">请完成安全验证</text>
      <view class="sc-header__close" @click="close"><text class="sc-header__x">×</text></view>
    </view>
    <!-- 拼图区 -->
    <view class="sc-content">
      <view class="sc-board" :style="boardStyle">
        <!-- 背景 canvas -->
        <canvas class="sc-canvas sc-canvas--bg" canvas-id="captchaBg" id="captchaBg"
          :style="boardStyle" />
        <!-- 拼图块 canvas -->
        <canvas class="sc-canvas sc-canvas--piece" canvas-id="captchaPiece" id="captchaPiece"
          :style="pieceStyle" />
        <!-- 提示条 -->
        <view v-if="tip" class="sc-tip" :class="tipCls"><text class="sc-tip__text">{{ tip }}</text></view>
      </view>
      <!-- 滑块轨道 -->
      <view class="sc-track" :style="{ width: W + 'px' }">
        <view class="sc-track__bar" :class="trackCls" :style="{ width: W + 'px' }">
          <view class="sc-track__fill" :style="{ width: fillPx + 'px' }" />
          <text class="sc-track__text">{{ trackText }}</text>
        </view>
        <view class="sc-track__thumb" :class="thumbCls" :style="{ left: thumbPx + 'px' }"
          @touchstart.stop.prevent="onStart">
          <view v-if="phase === 'idle' || phase === 'drag'" class="sc-thumb__lines">
            <view class="sc-thumb__line" /><view class="sc-thumb__line" /><view class="sc-thumb__line" />
          </view>
          <text v-else-if="phase === 'ok'" class="sc-thumb__icon">✓</text>
          <text v-else-if="phase === 'err'" class="sc-thumb__icon">✕</text>
        </view>
      </view>
      <!-- 底部操作 -->
      <view class="sc-footer"><view class="sc-footer__btn" @click="refresh"><text class="sc-footer__txt">↻ 换一张</text></view></view>
    </view>
  </view>
</view>
</template>

<script>
var W = 300, H = 150, PS = 48, TOL = 7, THUMB = 52;
var COLORS = [
  ['#667eea','#764ba2'],['#f093fb','#f5576c'],['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'],['#fa709a','#fee140'],['#a18cd1','#fbc2eb'],
  ['#fccb90','#d57eeb'],['#84fab0','#8fd3f4'],['#30cfd0','#330867'],
  ['#f7971e','#ffd200']
];
function R(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

function puzzlePath(c,x,y,s,b){
  c.beginPath();
  c.moveTo(x,y);
  c.lineTo(x+s*.35,y);
  c.arc(x+s*.5,y-b*.5,b,Math.PI,0,true);
  c.lineTo(x+s,y);
  c.lineTo(x+s,y+s*.35);
  c.arc(x+s+b*.5,y+s*.5,b,Math.PI*1.5,Math.PI*.5,false);
  c.lineTo(x+s,y+s);
  c.lineTo(x+s*.65,y+s);
  c.arc(x+s*.5,y+s+b*.5,b,0,Math.PI,false);
  c.lineTo(x,y+s);
  c.lineTo(x,y+s*.65);
  c.arc(x-b*.5,y+s*.5,b,Math.PI*.5,Math.PI*1.5,true);
  c.closePath();
}

export default {
  name:'SlideCaptcha',
  data(){return{
    visible:false, maskShow:false,
    phase:'idle',
    answer:0, thumbPx:0, piecePx:0, pieceTop:0,
    pieceW:0, pieceH:0, fillPx:THUMB,
    tip:'', tipType:'',
    trackText:'向右拖动滑块完成拼图',
    dragging:false, startX:0, startThumb:0, maxThumb:0,
    _ticket:'',
    _ansX:0, _ansY:0, _ps:PS, _bump:0, _extra:0,
  };},
  computed:{
    boardStyle(){return{width:W+'px',height:H+'px'};},
    pieceStyle(){return{width:this.pieceW+'px',height:this.pieceH+'px',top:this.pieceTop+'px',left:this.piecePx+'px'};},
    tipCls(){return this.tipType==='ok'?'sc-tip--ok':'sc-tip--err';},
    trackCls(){return this.phase==='ok'?'sc-track__bar--ok':this.phase==='err'?'sc-track__bar--err':this.dragging?'sc-track__bar--drag':'';},
    thumbCls(){return this.phase==='ok'?'sc-track__thumb--ok':this.phase==='err'?'sc-track__thumb--err':'';},
  },
  methods:{
    /* === 公开 API === */
    open(){
      this.visible=true; this.maskShow=false; this.phase='idle';
      this._resetSlider();
      this.$nextTick(()=>{
        setTimeout(()=>{this.maskShow=true;},20);
        this._newPuzzle();
      });
    },
    close(){
      this.maskShow=false;
      setTimeout(()=>{this.visible=false;this.phase='idle';this.$emit('close');},200);
    },
    refresh(){
      if(this.phase==='ok')return;
      this._resetSlider();
      this._newPuzzle();
    },

    /* === 内部 === */
    _resetSlider(){
      this.thumbPx=0;this.piecePx=0;this.fillPx=THUMB;
      this.tip='';this.tipType='';this.trackText='向右拖动滑块完成拼图';
      this.dragging=false;
    },
    _newPuzzle(){
      var bump=Math.round(PS*.22), extra=bump+4;
      var ax=R(PS+bump+20,W-PS-bump-20);
      var ay=R(bump+10,H-PS-bump-10);
      this.answer=ax-extra;
      this.pieceW=PS+extra*2; this.pieceH=PS+extra*2;
      this.pieceTop=ay-extra;
      this.maxThumb=W-THUMB-2;
      this._ansX=ax;this._ansY=ay;this._bump=bump;this._extra=extra;
      this._ticket=Date.now().toString(36)+R(1e3,9e3);
      this.$nextTick(()=>{this._paint();});
    },
    _paint(){
      var ax=this._ansX,ay=this._ansY,bump=this._bump,extra=this._extra;
      var pal=COLORS[R(0,COLORS.length-1)];

      /* --- 背景 --- */
      var bg=uni.createCanvasContext('captchaBg',this);
      var g=bg.createLinearGradient(0,0,W,H);
      g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);
      bg.setFillStyle(g);bg.fillRect(0,0,W,H);
      for(var i=0;i<14;i++){bg.beginPath();bg.arc(R(0,W),R(0,H),R(12,50),0,Math.PI*2);bg.setFillStyle('rgba(255,255,255,'+(R(4,16)/100)+')');bg.fill();}
      bg.save();bg.setGlobalAlpha(.06);bg.setStrokeStyle('#fff');bg.setLineWidth(1.5);
      for(var j=-H;j<W+H;j+=18){bg.beginPath();bg.moveTo(j,0);bg.lineTo(j+H,H);bg.stroke();}
      bg.restore();
      bg.save();bg.setGlobalAlpha(.12);bg.setFillStyle('#fff');bg.setFontSize(11);
      var wds=['安全验证','拖动滑块','验证码'];
      for(var k=0;k<6;k++) bg.fillText(wds[k%3],R(5,W-60),R(14,H-6));
      bg.restore();

      puzzlePath(bg,ax,ay,PS,bump);
      bg.setFillStyle('rgba(0,0,0,.2)');bg.fill();
      puzzlePath(bg,ax,ay,PS,bump);
      bg.setStrokeStyle('rgba(255,255,255,.6)');bg.setLineWidth(1.5);bg.stroke();
      bg.draw(false,()=>{this._paintPiece();});
    },
    _paintPiece(){
      var ax=this._ansX,ay=this._ansY,bump=this._bump,extra=this._extra;
      var pw=this.pieceW,ph=this.pieceH;
      var that=this;

      uni.canvasGetImageData({
        canvasId:'captchaBg',x:ax-extra,y:ay-extra,width:pw,height:ph,
        success:function(res){
          /* 手动裁剪：将不在拼图路径内的像素设为透明 */
          var data=new Uint8ClampedArray(res.data);
          var tempCanvas=document.createElement?null:null; // 用离屏判断路径
          /* 用简化方式：先 putImageData 再用 clip+重绘方式不可靠，
             改用直接在 piece canvas 上绘制完整区域后用 globalCompositeOperation 裁剪 */
          var pc=uni.createCanvasContext('captchaPiece',that);
          pc.clearRect(0,0,pw,ph);
          /* 先画拼图形状做 destination */
          puzzlePath(pc,extra,extra,PS,bump);
          pc.setFillStyle('#000');pc.fill();
          pc.draw(false,function(){
            /* putImageData 覆盖像素 */
            uni.canvasPutImageData({
              canvasId:'captchaPiece',x:0,y:0,width:pw,height:ph,data:res.data,
              success:function(){
                /* 用 destination-in 裁剪 */
                var pc2=uni.createCanvasContext('captchaPiece',that);
                /* 重绘：先画背景像素再 clip */
                pc2.save();
                puzzlePath(pc2,extra,extra,PS,bump);
                pc2.clip();
                /* 因为 putImageData 已经把像素写进去了，我们需要把非路径区域清除 */
                /* uni canvas 不支持 destination-in，改用另一种方式：
                   直接 getImageData -> 手动清除路径外像素 -> putImageData */
                that._maskPixels(res.data,pw,ph,extra,PS,bump);
              },
              fail:function(){that._fallbackPiece();}
            });
          });
        },
        fail:function(){that._fallbackPiece();}
      });
    },
    _maskPixels(rawData,pw,ph,extra,ps,bump){
      /* 用一个临时 canvas 画出路径，getImageData 获取 alpha 通道做 mask */
      var that=this;
      /* 画 mask 到 piece canvas */
      var mc=uni.createCanvasContext('captchaPiece',this);
      mc.clearRect(0,0,pw,ph);
      puzzlePath(mc,extra,extra,ps,bump);
      mc.setFillStyle('#ff0000');mc.fill();
      mc.draw(false,function(){
        uni.canvasGetImageData({
          canvasId:'captchaPiece',x:0,y:0,width:pw,height:ph,
          success:function(maskRes){
            var mask=maskRes.data;
            var out=new Uint8ClampedArray(rawData.length);
            for(var i=0;i<rawData.length;i+=4){
              if(mask[i+3]>0 && mask[i]>100){
                out[i]=rawData[i];out[i+1]=rawData[i+1];out[i+2]=rawData[i+2];out[i+3]=rawData[i+3];
              } else {
                out[i]=0;out[i+1]=0;out[i+2]=0;out[i+3]=0;
              }
            }
            uni.canvasPutImageData({
              canvasId:'captchaPiece',x:0,y:0,width:pw,height:ph,data:out,
              success:function(){
                /* 画边框 */
                var fc=uni.createCanvasContext('captchaPiece',that);
                puzzlePath(fc,extra,extra,ps,bump);
                fc.setStrokeStyle('rgba(255,255,255,.8)');fc.setLineWidth(1.5);fc.stroke();
                fc.draw(true);
              },
              fail:function(){that._fallbackPiece();}
            });
          },
          fail:function(){that._fallbackPiece();}
        });
      });
    },
    _fallbackPiece(){
      var extra=this._extra,bump=this._bump;
      var pc=uni.createCanvasContext('captchaPiece',this);
      var pal=COLORS[R(0,COLORS.length-1)];
      var g2=pc.createLinearGradient(0,0,this.pieceW,this.pieceH);
      g2.addColorStop(0,pal[0]);g2.addColorStop(1,pal[1]);
      puzzlePath(pc,extra,extra,PS,bump);
      pc.setFillStyle(g2);pc.fill();
      puzzlePath(pc,extra,extra,PS,bump);
      pc.setStrokeStyle('rgba(255,255,255,.8)');pc.setLineWidth(1.5);pc.stroke();
      pc.draw();
    },

    /* === 触摸 === */
    onStart(e){
      if(this.phase==='ok'||this.dragging)return;
      this.dragging=true;this.phase='drag';
      var t=e.touches?e.touches[0]:e;
      this.startX=t.clientX||t.pageX||0;
      this.startThumb=this.thumbPx;
    },
    onMove(e){
      if(!this.dragging)return;
      var t=e.touches?e.touches[0]:e;
      var cx=t.clientX||t.pageX||0;
      var nl=Math.max(0,Math.min(this.startThumb+(cx-this.startX),this.maxThumb));
      this.thumbPx=nl;this.piecePx=nl;this.fillPx=nl+THUMB;
    },
    onEnd(){
      if(!this.dragging)return;
      this.dragging=false;
      this._check(this.thumbPx);
    },
    _check(x){
      if(Math.abs(x-this.answer)<=TOL){
        this.phase='ok';this.tip='验证通过 ✓';this.tipType='ok';
        this.trackText='验证通过';this.fillPx=x+THUMB;
        var tk=this._ticket,that=this;
        setTimeout(function(){
          that.maskShow=false;
          setTimeout(function(){
            that.visible=false;that.phase='idle';that._resetSlider();
            that.$emit('pass',{ticket:tk,timestamp:Date.now()});
          },200);
        },500);
      } else {
        this.phase='err';this.tip='位置不对，请重试';this.tipType='err';
        this.$emit('fail');
        var that2=this;
        setTimeout(function(){that2.phase='idle';that2._resetSlider();that2._newPuzzle();},800);
      }
    },
  },
  beforeDestroy(){this.visible=false;this.phase='idle';}
};
</script>

<style lang="scss" scoped>
.sc-mask{
  position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,.55);z-index:99999;
  display:flex;align-items:center;justify-content:center;
  opacity:0;transition:opacity .2s;
}
.sc-mask--show{opacity:1;}

.sc-dialog{
  background:#fff;border-radius:24rpx;overflow:hidden;
  box-shadow:0 20rpx 80rpx rgba(0,0,0,.25);
  width:700rpx;max-width:94vw;
  transform:translateY(60rpx) scale(.94);transition:transform .22s;
}
.sc-dialog--show{transform:translateY(0) scale(1);}

.sc-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:28rpx 36rpx 22rpx;border-bottom:1rpx solid #f0f2f7;
}
.sc-header__title{font-size:30rpx;font-weight:700;color:#222;}
.sc-header__close{
  width:56rpx;height:56rpx;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:#f5f5f5;
}
.sc-header__x{font-size:36rpx;color:#999;line-height:1;margin-top:-2rpx;}

.sc-content{padding:32rpx 36rpx 28rpx;display:flex;flex-direction:column;align-items:center;}

/* --- 画布区 --- */
.sc-board{
  position:relative;border-radius:16rpx;overflow:hidden;
  box-shadow:0 4rpx 20rpx rgba(0,0,0,.1);background:#e8edf5;
}
.sc-canvas{display:block;}
.sc-canvas--bg{width:100%;height:100%;}
.sc-canvas--piece{position:absolute;top:0;left:0;}

.sc-tip{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  padding:10rpx 32rpx;border-radius:36rpx;z-index:3;
}
.sc-tip--ok{background:rgba(46,204,113,.92);}
.sc-tip--err{background:rgba(231,76,60,.92);}
.sc-tip__text{font-size:26rpx;font-weight:600;color:#fff;white-space:nowrap;}

/* --- 滑块轨道 --- */
.sc-track{position:relative;margin-top:20rpx;height:88rpx;}
.sc-track__bar{
  position:absolute;top:0;left:0;height:88rpx;
  background:#eef0f5;border-radius:44rpx;
  border:2rpx solid #d8dce8;overflow:hidden;box-sizing:border-box;
}
.sc-track__bar--drag{background:#deeaff;border-color:#4f8ffd;}
.sc-track__bar--ok{background:#d0f5e0;border-color:#2ecc71;}
.sc-track__bar--err{background:#fde8e8;border-color:#e74c3c;}

.sc-track__fill{
  position:absolute;top:0;left:0;height:100%;
  background:linear-gradient(to right,#a8d4ff,#4f8ffd);border-radius:44rpx;
}
.sc-track__bar--ok .sc-track__fill{background:linear-gradient(to right,#a8f5c8,#2ecc71);}
.sc-track__bar--err .sc-track__fill{background:linear-gradient(to right,#f5b8b8,#e74c3c);}

.sc-track__text{
  position:absolute;width:100%;text-align:center;
  line-height:84rpx;font-size:26rpx;color:#999;z-index:1;
}
.sc-track__thumb{
  position:absolute;top:0;width:104rpx;height:88rpx;
  background:#fff;border-radius:44rpx;border:2rpx solid #d8dce8;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4rpx 16rpx rgba(79,143,253,.3);box-sizing:border-box;z-index:2;
}
.sc-track__thumb--ok{background:#2ecc71;border-color:#27ae60;box-shadow:0 4rpx 16rpx rgba(46,204,113,.45);}
.sc-track__thumb--err{background:#e74c3c;border-color:#c0392b;}

.sc-thumb__lines{display:flex;flex-direction:column;align-items:center;}
.sc-thumb__line{width:30rpx;height:4rpx;background:#4f8ffd;border-radius:2rpx;margin:3rpx 0;}
.sc-thumb__icon{font-size:40rpx;color:#fff;line-height:1;}

.sc-footer{display:flex;justify-content:flex-end;width:100%;margin-top:12rpx;}
.sc-footer__btn{padding:6rpx 16rpx;border-radius:8rpx;}
.sc-footer__txt{font-size:24rpx;color:#aaa;}
</style>
