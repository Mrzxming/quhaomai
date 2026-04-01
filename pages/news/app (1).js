// ── inject styles ──
const css = document.createElement('style');
css.textContent = `
.sh-hd{background:linear-gradient(135deg,#FF2442 0%,#FF5C35 50%,#FF8A00 100%);padding:16px 20px 20px;position:relative;flex-shrink:0;overflow:hidden}
.sh-hd::before{content:'';position:absolute;top:-30px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08)}
.sh-hd::after{content:'';position:absolute;bottom:-40px;left:30px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.06)}
.sh-bar{width:36px;height:4px;border-radius:2px;background:rgba(255,255,255,.4);margin:0 auto 14px}
.sh-pr{display:flex;align-items:baseline;justify-content:center;gap:4px;position:relative;z-index:1}
.sh-py{font-size:20px;color:#fff;font-weight:600}
.sh-pv{font-size:44px;color:#fff;font-weight:800;letter-spacing:-1px;line-height:1}
.sh-pl{text-align:center;font-size:13px;color:rgba(255,255,255,.85);margin-top:6px;position:relative;z-index:1}
.sh-pl b{color:#fff}
.cx{position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.2);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}
.cx:active{background:rgba(255,255,255,.35)}
.cx svg{width:14px;height:14px;color:#fff}
.sh-bd{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 12px calc(env(safe-area-inset-bottom,0px) + 16px)}
.pc{background:var(--card);border-radius:var(--r);margin-bottom:10px;overflow:hidden}
.pc.off{opacity:.45}
.ph{display:flex;align-items:center;padding:12px 14px;gap:10px}
.pi{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pi svg{width:18px;height:18px}
.pi.red{background:var(--red-l);color:var(--red)}
.pi.org{background:var(--org-l);color:var(--org)}
.pi.grn{background:var(--grn-l);color:var(--grn)}
.pi.pur{background:#F3EEFF;color:#7C3AED}
.pi.gld{background:#FFF8E8;color:var(--gold)}
.pt{font-size:15px;font-weight:600;flex:1}
.pb{font-size:11px;font-weight:500;padding:2px 8px;border-radius:10px}
.pb.m{background:var(--grn-l);color:var(--grn)}
.pb.u{background:var(--org-l);color:var(--org)}
.pbd{padding:0 14px 14px 60px}
.pd{font-size:13px;color:var(--g1);line-height:1.6}
.pd .hl{color:var(--red);font-weight:600}
.pd .hg{color:var(--grn);font-weight:600}
.tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.ts{font-size:12px;font-weight:500;padding:3px 10px;border-radius:6px;background:var(--red-l);color:var(--red)}
.tt{font-size:12px;font-weight:500;padding:3px 10px;border-radius:6px;background:var(--org-l);color:var(--org)}
.pw{margin-top:8px}
.ptr{height:4px;background:var(--g5);border-radius:2px;overflow:hidden}
.pf{height:100%;border-radius:2px;transition:width .4s}
.pf.g{background:var(--grn)}.pf.o{background:var(--org)}
.pl{display:flex;justify-content:space-between;font-size:11px;color:var(--g2);margin-top:3px}
.cl{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.ci{display:flex;align-items:center;border:1px solid var(--g5);border-radius:8px;overflow:hidden}
.ci.ok{border-color:var(--red-b);background:var(--red-l)}
.cil{min-width:60px;padding:8px;text-align:center;border-right:1px dashed var(--g5)}
.ci.ok .cil{border-right-color:var(--red-b)}
.ca{font-size:20px;font-weight:700;color:var(--g3);line-height:1}
.ci.ok .ca{color:var(--red)}
.cau{font-size:11px}
.cir{flex:1;padding:8px 10px;display:flex;align-items:center;justify-content:space-between}
.cc{font-size:12px;color:var(--g2)}
.ci.ok .cc{color:var(--g1)}
.ct{font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;white-space:nowrap}
.ct.y{background:var(--red);color:#fff}
.ct.n{background:var(--g5);color:var(--g2)}
`;
document.head.appendChild(css);

const css2 = document.createElement('style');
css2.textContent = `
.tm{display:flex;align-items:center;gap:3px;margin-top:8px}
.tl{font-size:12px;color:var(--g2);margin-right:4px}
.ti{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;background:var(--dk);color:#fff;padding:2px 5px;border-radius:4px;min-width:22px;text-align:center}
.tc{font-size:12px;font-weight:700;color:var(--dk)}
.fb{background:linear-gradient(135deg,#FF2442,#FF5C35);padding:12px 14px;display:flex;align-items:center;gap:10px;color:#fff;position:relative;overflow:hidden}
.fb::after{content:'';position:absolute;right:-10px;top:-10px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.08)}
.fi{width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fi svg{width:18px;height:18px;color:#fff}
.ft{font-size:15px;font-weight:600;flex:1}
.fba{font-size:11px;font-weight:500;padding:2px 8px;border-radius:10px;background:rgba(255,255,255,.2);color:#fff}
.fbd{padding:10px 14px 14px 60px}
.gs{display:flex;align-items:flex-start;gap:8px;padding:3px 0}
.gd{width:6px;height:6px;border-radius:50%;margin-top:6px;flex-shrink:0}
.gd.on{background:var(--grn)}.gd.off{background:var(--g3)}
.gt{font-size:13px;color:var(--g2);line-height:1.5}
.gt.on{color:var(--dk)}
.vc{display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#2C2C2E,#1A1A1A);color:var(--gold);font-size:12px;font-weight:600;padding:4px 12px;border-radius:8px;margin-top:8px}
.vc svg{width:13px;height:13px}
`;
document.head.appendChild(css2);

// ── SVG Icons ──
const ico = {
  flash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3 3 3 0 00-3 3 3 3 0 003 3 3 3 0 01-3 3H5a3 3 0 01-3-3 3 3 0 003-3 3 3 0 00-3-3z"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>',
  diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M4 17l2-12 6 5 6-5 2 12z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

// ── Data ──
const product = { originalPrice: 299, currentPrice: 239, userPoints: 800, isVip: true };
const promos = {
  flash: { endTime: Date.now()+3*3600000+25*60000+10000, active: true, flashPrice: 191.20 },
  manjian: { rules: [{threshold:100,discount:20},{threshold:200,discount:50},{threshold:300,discount:80}] },
  coupon: { coupons: [{id:1,amount:10,condition:50},{id:2,amount:30,condition:200},{id:3,amount:100,condition:500}] },
  gift: { rules: [{qty:1,gift:'便携收纳袋 ×1'},{qty:2,gift:'替换耳套 ×1 + 收纳袋 ×1'},{qty:3,gift:'定制耳机架 ×1 + 耳套 ×1 + 收纳袋 ×1'}] },
  points: { rate:100, maxDeduct:20 },
  vip: { discount:0.95 },
};
let tmr = null;

function calc() {
  const base = product.currentPrice;
  let total = base;
  const saves = [];
  if (promos.flash.active) {
    saves.push({n:'限时抢购',v:total-promos.flash.flashPrice});
    total = promos.flash.flashPrice;
  }
  let mjHit = null;
  for (let i=promos.manjian.rules.length-1;i>=0;i--) {
    if (total>=promos.manjian.rules[i].threshold){mjHit=promos.manjian.rules[i];break;}
  }
  if (mjHit){saves.push({n:'满减',v:mjHit.discount});total-=mjHit.discount;}
  let bestCp = null;
  for (const c of promos.coupon.coupons) {
    if (total>=c.condition&&(!bestCp||c.amount>bestCp.amount)) bestCp=c;
  }
  if (bestCp){saves.push({n:'优惠券',v:bestCp.amount});total-=bestCp.amount;}
  if (product.isVip) {
    const vs=total*(1-promos.vip.discount);
    if(vs>0.005){saves.push({n:'黑卡',v:+vs.toFixed(2)});total*=promos.vip.discount;}
  }
  const maxPd=Math.min(promos.points.maxDeduct,product.userPoints/promos.points.rate);
  const pd=Math.min(maxPd,total-0.01);
  if(pd>0){saves.push({n:'积分',v:+pd.toFixed(2)});total-=pd;}
  total=Math.max(0.01,total);
  return {total:+total.toFixed(2),saved:+(base-total).toFixed(2),saves,mjHit,bestCp,pd:+pd.toFixed(2),maxPd};
}

function fmtT(ms) {
  if(ms<=0) return {h:'00',m:'00',s:'00'};
  const t=Math.floor(ms/1000);
  return {h:String(Math.floor(t/3600)).padStart(2,'0'),m:String(Math.floor((t%3600)/60)).padStart(2,'0'),s:String(t%60).padStart(2,'0')};
}

function renderSheet() {
  const c=calc(), mj=promos.manjian, fl=promos.flash;
  const r=fl.endTime-Date.now(), t=fmtT(r), on=fl.active&&r>0;
  let nextMj=null;
  for(const rule of mj.rules){if(product.currentPrice<rule.threshold){nextMj=rule;break;}}
  let mjP=0;
  if(c.mjHit){const idx=mj.rules.indexOf(c.mjHit);if(idx<mj.rules.length-1)mjP=(product.currentPrice/mj.rules[idx+1].threshold)*100;else mjP=100;}
  else mjP=(product.currentPrice/mj.rules[0].threshold)*100;
  const maxPd=Math.min(promos.points.maxDeduct,product.userPoints/promos.points.rate);

  document.getElementById('sheetContent').innerHTML =
  '<div class="sh-hd"><div class="sh-bar"></div>' +
  '<button class="cx" onclick="closeSheet()">' + ico.x + '</button>' +
  '<div class="sh-pr"><span class="sh-py">¥</span><span class="sh-pv">' + c.total.toFixed(2) + '</span></div>' +
  '<div class="sh-pl">购买1件优惠后价格 · 可省 <b>¥' + c.saved.toFixed(2) + '</b></div></div>' +

  '<div class="sh-bd">' +

  // 限时抢购
  '<div class="pc' + (on?'':' off') + '">' +
  '<div class="fb"><div class="fi">' + ico.flash + '</div><span class="ft">限时抢购</span><span class="fba">' + (on?'进行中':'已结束') + '</span></div>' +
  '<div class="fbd"><div class="pd">抢购价 <span class="hl">¥' + fl.flashPrice.toFixed(2) + '</span>/件，原价 ¥' + product.currentPrice.toFixed(2) + '</div>' +
  (on ? '<div class="tm"><span class="tl">距结束</span><span class="ti" id="th">' + t.h + '</span><span class="tc">:</span><span class="ti" id="tm">' + t.m + '</span><span class="tc">:</span><span class="ti" id="ts">' + t.s + '</span></div>' +
  '<div class="tg"><span class="ts">可省 ¥' + (c.saves.find(function(s){return s.n==="限时抢购"})?.v||0).toFixed(2) + '</span></div>' : '') +
  '</div></div>' +

  // 满减
  '<div class="pc"><div class="ph"><div class="pi org">' + ico.tag + '</div><span class="pt">满减</span><span class="pb ' + (c.mjHit?'m':'u') + '">' + (c.mjHit?'已满足':'未满足') + '</span></div>' +
  '<div class="pbd"><div class="pd">' + mj.rules.map(function(r){return '满'+r.threshold+'减<span class="'+(c.mjHit===r?'hg':'')+'">'+r.discount+'</span>';}).join(' / ') + '</div>' +
  '<div class="pw"><div class="ptr"><div class="pf ' + (c.mjHit?'g':'o') + '" style="width:' + Math.min(100,mjP) + '%"></div></div>' +
  '<div class="pl"><span>¥' + product.currentPrice.toFixed(2) + '</span><span>' + (nextMj?'¥'+nextMj.threshold:'最高档') + '</span></div></div>' +
  '<div class="tg">' + (c.mjHit?'<span class="ts">可减 ¥'+c.mjHit.discount.toFixed(2)+'</span>':'') +
  (nextMj?'<span class="tt">再凑 ¥'+(nextMj.threshold-product.currentPrice).toFixed(2)+' 减'+nextMj.discount+'</span>':'') + '</div></div></div>' +

  // 优惠券
  '<div class="pc"><div class="ph"><div class="pi org">' + ico.ticket + '</div><span class="pt">优惠券</span><span class="pb ' + (c.bestCp?'m':'u') + '">' + (c.bestCp?'可用':'未满足') + '</span></div>' +
  '<div class="pbd"><div class="cl">' +
  promos.coupon.coupons.map(function(cp){
    var ok=product.currentPrice>=cp.condition;
    return '<div class="ci'+(ok?' ok':'')+'"><div class="cil"><div class="ca"><span class="cau">¥</span>'+cp.amount+'</div></div>' +
    '<div class="cir"><span class="cc">满'+cp.condition+'可用'+(!ok?' · 差¥'+(cp.condition-product.currentPrice).toFixed(2):'')+'</span>' +
    '<span class="ct '+(ok?'y':'n')+'">'+(ok?(c.bestCp&&c.bestCp.id===cp.id?'已选':'可用'):'不可用')+'</span></div></div>';
  }).join('') + '</div></div></div>' +

  // 买赠
  '<div class="pc"><div class="ph"><div class="pi grn">' + ico.gift + '</div><span class="pt">买赠</span><span class="pb m">已满足</span></div>' +
  '<div class="pbd">' +
  promos.gift.rules.map(function(r){var o=1>=r.qty;return '<div class="gs"><div class="gd '+(o?'on':'off')+'"></div><span class="gt '+(o?'on':'')+'">满'+r.qty+'件：'+r.gift+'</span></div>';}).join('') +
  '<div class="tg"><span class="ts">当前赠品：'+promos.gift.rules[0].gift+'</span></div></div></div>' +

  // 积分
  '<div class="pc"><div class="ph"><div class="pi pur">' + ico.diamond + '</div><span class="pt">积分抵扣</span><span class="pb '+(maxPd>0?'m':'u')+'">'+(maxPd>0?'可用':'积分不足')+'</span></div>' +
  '<div class="pbd"><div class="pd">'+product.userPoints+'积分可用 · 最多可抵 <span class="hl">¥'+maxPd.toFixed(2)+'</span></div>' +
  (maxPd>0?'<div class="tg"><span class="ts">可抵 ¥'+c.pd.toFixed(2)+'（'+(c.pd*promos.points.rate).toFixed(0)+'积分）</span></div>':'') + '</div></div>' +

  // 黑卡
  '<div class="pc'+(product.isVip?'':' off')+'"><div class="ph"><div class="pi gld">' + ico.crown + '</div><span class="pt">黑卡会员</span><span class="pb '+(product.isVip?'m':'u')+'">'+(product.isVip?'已开通':'未开通')+'</span></div>' +
  '<div class="pbd"><div class="pd">额外 '+((1-promos.vip.discount)*100).toFixed(0)+'% 折扣 · 叠加使用</div>' +
  (product.isVip ? '<div class="vc">'+ico.crown+' 黑卡会员</div>' + (c.saves.find(function(s){return s.n==="黑卡"}) ? '<div class="tg"><span class="ts">可省 ¥'+c.saves.find(function(s){return s.n==="黑卡"}).v.toFixed(2)+'</span></div>' : '') : '<div class="tg"><span class="tt">开通享更多优惠</span></div>') +
  '</div></div>' +

  '</div>';
}

function openSheet() {
  renderSheet();
  document.getElementById('overlay').classList.add('show');
  var sheet = document.getElementById('sheet');
  sheet.offsetHeight;
  sheet.classList.add('show');
  document.body.style.overflow = 'hidden';
  startTimer();
}

function closeSheet() {
  document.getElementById('sheet').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
  if (tmr) { clearInterval(tmr); tmr = null; }
}

function startTimer() {
  if (tmr) clearInterval(tmr);
  tmr = setInterval(function() {
    var r = promos.flash.endTime - Date.now();
    if (r <= 0) { clearInterval(tmr); promos.flash.active = false; renderSheet(); return; }
    var t = fmtT(r);
    var th = document.getElementById('th');
    if (th) { th.textContent = t.h; document.getElementById('tm').textContent = t.m; document.getElementById('ts').textContent = t.s; }
  }, 1000);
}
