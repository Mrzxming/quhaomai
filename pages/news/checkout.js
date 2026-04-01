// 结算页专用脚本
document.addEventListener('DOMContentLoaded', function() {
    
    // 生成虚拟商品数据
    generateVirtualProducts();
    
    // 初始化商品折叠
    initProductCollapse();
    
    // 店铺操作按钮点击事件
    const storeActionBtns = document.querySelectorAll('.store-text-btn');
    storeActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const action = this.getAttribute('data-action');
            const store = this.getAttribute('data-store');
            
            switch(action) {
                case 'coupon':
                    showCouponModal(store);
                    break;
                case 'discount':
                    showDiscountModal(store);
                    break;
                case 'gather':
                    showGatherModal(store);
                    break;
            }
        });
    });

    // 去凑单链接点击事件
    const gatherLinks = document.querySelectorAll('.gather-link');
    gatherLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            const store = this.getAttribute('data-store');
            showGatherModal(store);
        });
    });

    // 店铺优惠明细按钮点击事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('discount-detail-btn')) {
            e.stopPropagation();
            const store = e.target.getAttribute('data-store');
            showStoreDiscountDetail(store);
        }
    });

    // 店铺优惠信息点击事件
    const storePromotions = document.querySelectorAll('.store-promotion');
    storePromotions.forEach(promo => {
        promo.addEventListener('click', function() {
            const store = this.getAttribute('data-store');
            showPromotionDetailModal(store);
        });
    });

    // 明细按钮点击事件
    const showDetailBtn = document.getElementById('show-detail');
    if (showDetailBtn) {
        showDetailBtn.addEventListener('click', function() {
            showPriceDetailModal();
        });
    }

    // 限时抢倒计时
    startCountdown();

    // 显示领券弹窗（待领取状态）
    function showCouponModal(store) {
        const modal = createModal(store + ' - 优惠券', `
            <div class="modal-content-scroll">
                <div class="coupon-item">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>10</div>
                        <div class="coupon-condition">满99可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">${store}通用券</div>
                            <div class="coupon-scope scope-store">店铺优惠券</div>
                            <div class="coupon-time">有效期至2026.04.30</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn">立即领取</button>
                        </div>
                    </div>
                </div>
                <div class="coupon-item">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>20</div>
                        <div class="coupon-condition">满199可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">新人专享券</div>
                            <div class="coupon-scope scope-platform">平台通用券</div>
                            <div class="coupon-time">有效期至2026.04.30</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn">立即领取</button>
                        </div>
                    </div>
                </div>
                <div class="coupon-item">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>50</div>
                        <div class="coupon-condition">满299可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">限时大额券</div>
                            <div class="coupon-scope scope-cross">跨店优惠券</div>
                            <div class="coupon-time">有效期至2026.03.20</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn">立即领取</button>
                        </div>
                    </div>
                </div>
                <div class="coupon-item">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>30</div>
                        <div class="coupon-condition">满199可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">跨店满减券</div>
                            <div class="coupon-scope scope-cross">跨店优惠券</div>
                            <div class="coupon-time">有效期至2026.05.15</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn">立即领取</button>
                        </div>
                    </div>
                </div>
                <div class="coupon-item received">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>5</div>
                        <div class="coupon-condition">满50可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">店铺满减券</div>
                            <div class="coupon-scope scope-store">店铺优惠券</div>
                            <div class="coupon-time">有效期至2026.04.15</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn received" disabled>已领取</button>
                        </div>
                    </div>
                </div>
                <div class="coupon-item received">
                    <div class="coupon-left">
                        <div class="coupon-amount"><span class="coupon-amount-unit">¥</span>15</div>
                        <div class="coupon-condition">满129可用</div>
                    </div>
                    <div class="coupon-right">
                        <div>
                            <div class="coupon-name">平台红包券</div>
                            <div class="coupon-scope scope-platform">平台通用券</div>
                            <div class="coupon-time">有效期至2026.03.31</div>
                        </div>
                        <div class="coupon-bottom">
                            <button class="coupon-btn received" disabled>已领取</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        // 领取按钮事件
        modal.querySelectorAll('.coupon-btn:not(.received)').forEach(btn => {
            btn.addEventListener('click', function() {
                this.textContent = '已领取';
                this.classList.add('received');
                this.disabled = true;
                const couponItem = this.closest('.coupon-item');
                couponItem.classList.add('received');
                showSuccessToast();
            });
        });
    }

    // 显示领取成功弹窗
    function showSuccessToast() {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <div class="success-icon">
                <svg viewBox="0 0 24 24"><path fill="#fff" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <div class="success-title">恭喜你领取成功</div>
            <div class="success-desc">优惠券已放入卡包</div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            overlay.classList.remove('show');
            toast.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                toast.remove();
            }, 300);
        }, 1800);
    }

    // 显示优惠弹窗（店铺优惠活动详情）
    function showDiscountModal(store) {
        const modal = createModal(store + ' - 店铺优惠', `
            <div class="modal-content-scroll">
                <div class="discount-section">
                    <h4>满减活动</h4>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        <div class="discount-info">
                            <div class="discount-title">满99减10</div>
                            <div class="discount-desc">全场商品可用，不与其他优惠叠加</div>
                        </div>
                    </div>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        <div class="discount-info">
                            <div class="discount-title">满199减30</div>
                            <div class="discount-desc">全场商品可用，不与其他优惠叠加</div>
                        </div>
                    </div>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        <div class="discount-info">
                            <div class="discount-title">满299减50</div>
                            <div class="discount-desc">全场商品可用，不与其他优惠叠加</div>
                        </div>
                    </div>
                </div>
                <div class="discount-section">
                    <h4>优惠券</h4>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        <div class="discount-info" style="flex:1;">
                            <div class="discount-title">满99减10券 <span class="coupon-scope scope-store" style="font-size:10px;font-weight:normal;">店铺券</span></div>
                            <div class="discount-desc">仅限${store}商品使用</div>
                        </div>
                        <button class="mini-btn coupon-claim-btn">领取</button>
                    </div>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        <div class="discount-info" style="flex:1;">
                            <div class="discount-title">满199减20券 <span class="coupon-scope scope-cross" style="font-size:10px;font-weight:normal;">跨店券</span></div>
                            <div class="discount-desc">可跨店铺使用</div>
                        </div>
                        <button class="mini-btn coupon-claim-btn">领取</button>
                    </div>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        <div class="discount-info" style="flex:1;">
                            <div class="discount-title">满50减5券 <span class="coupon-scope scope-platform" style="font-size:10px;font-weight:normal;">平台券</span></div>
                            <div class="discount-desc">全平台商品通用</div>
                        </div>
                        <button class="mini-btn coupon-claim-btn">领取</button>
                    </div>
                </div>
                <div class="discount-section">
                    <h4>限时优惠</h4>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-time"/></svg>
                        <div class="discount-info">
                            <div class="discount-title">限时8折</div>
                            <div class="discount-desc">部分商品参与，活动截止至3月15日</div>
                        </div>
                    </div>
                </div>
                <div class="discount-section">
                    <h4>会员专享</h4>
                    <div class="discount-item">
                        <svg class="icon"><use href="#icon-vip"/></svg>
                        <div class="discount-info">
                            <div class="discount-title">会员95折</div>
                            <div class="discount-desc">开通会员即可享受全场95折优惠</div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // 领取按钮
        modal.querySelectorAll('.coupon-claim-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.textContent = '已领取';
                this.disabled = true;
                this.style.background = '#ccc';
                showSuccessToast();
            });
        });
    }

    // 显示去凑单弹窗
    function showGatherModal(store) {
        const modal = createModal('去凑单 - ' + store, `
            <div class="modal-content-scroll">
                <div class="gather-tip-box">
                    <p>再选<span class="highlight">32</span>元，立省<span class="highlight">20</span>元</p>
                    <p style="font-size: 12px; color: #999; margin-top: 8px;">满199减30优惠活动</p>
                </div>
                <div class="gather-products">
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>杰士邦避孕套超薄3只装安全套成人用品</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">7天无理由</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥29.90</span>
                                    <span class="original-price">¥39.90</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>润滑液50ML装人体润滑剂男用女用</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">新人专享</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥35.90</span>
                                    <span class="original-price">¥49.90</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>情趣用品套装成人玩具</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">限时特惠</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥59.90</span>
                                    <span class="original-price">¥89.90</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>超薄避孕套12只装安全套</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">热销爆款</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥45.00</span>
                                    <span class="original-price">¥65.00</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>玻尿酸润滑剂15ml超润滑</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">积分抵扣</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥25.00</span>
                                    <span class="original-price">¥35.00</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                    <div class="gather-product">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品%3C/text%3E%3C/svg%3E" alt="商品">
                        <div class="gather-product-info">
                            <h4>延时喷剂男用持久成人用品</h4>
                            <div class="gather-product-tags">
                                <span class="gather-tag">满减可用</span>
                                <span class="gather-tag">黑卡价</span>
                            </div>
                            <div class="gather-price">
                                <div class="gather-price-box">
                                    <span class="price">¥68.00</span>
                                    <span class="original-price">¥98.00</span>
                                </div>
                                <button class="add-btn">加购</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // 加购按钮事件
        modal.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('added')) {
                    this.textContent = '已加购';
                    this.classList.add('added');
                    showToast('已加入购物车');
                }
            });
        });
    }

    // 显示优惠详情弹窗
    function showPromotionDetailModal(store) {
        const promoRow = document.querySelector(`.store-promotion[data-store="${store}"]`);
        const promoText = promoRow ? promoRow.querySelector('.promotion-text') : null;
        const highlights = promoText ? promoText.querySelectorAll('.highlight') : [];
        const needAmount = highlights.length > 0 ? highlights[0].textContent : '32';
        const saveAmount = highlights.length > 1 ? highlights[1].textContent : '20';
        const selectedAmount = (Math.random() * 200 + 50).toFixed(2);

        const modal = createModal('凑单优惠 - ' + store, `
            <div class="modal-content-scroll">
                <div class="gather-tip-box">
                    <p>再选<span class="highlight">${needAmount}</span>元，立省<span class="highlight">${saveAmount}</span>元</p>
                </div>
                <div class="promotion-detail-section">
                    <h4>当前满减进度</h4>
                    <div class="promotion-detail-item">
                        <div class="promotion-detail-label">已选商品金额</div>
                        <div class="promotion-detail-value" style="color:#333;">¥${selectedAmount}</div>
                    </div>
                    <div class="promotion-detail-item">
                        <div class="promotion-detail-label">还差</div>
                        <div class="promotion-detail-value">¥${needAmount}</div>
                    </div>
                </div>
                <div class="promotion-detail-section">
                    <h4>满减规则</h4>
                    <div class="promotion-detail-item">
                        <div class="promotion-detail-label">满99减10</div>
                        <div class="promotion-detail-value" style="color:#4caf50;">已满足</div>
                    </div>
                    <div class="promotion-detail-item">
                        <div class="promotion-detail-label">满199减30</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span class="promotion-detail-value">差¥${needAmount}</span>
                            <button class="mini-btn gather-tier-btn" data-store="${store}">去凑单</button>
                        </div>
                    </div>
                    <div class="promotion-detail-item">
                        <div class="promotion-detail-label">满299减50</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span class="promotion-detail-value" style="color:#999;">未满足</span>
                            <button class="mini-btn gather-tier-btn" data-store="${store}">去凑单</button>
                        </div>
                    </div>
                </div>
                <div class="promotion-detail-section">
                    <h4>可用优惠券</h4>
                    <div class="promotion-detail-item clickable">
                        <div class="promotion-detail-label">
                            <svg class="icon"><use href="#icon-coupon"/></svg>
                            <span>满199减20券</span>
                        </div>
                        <button class="mini-btn coupon-claim-btn">领取</button>
                    </div>
                    <div class="promotion-detail-item clickable">
                        <div class="promotion-detail-label">
                            <svg class="icon"><use href="#icon-coupon"/></svg>
                            <span>满99减5券</span>
                        </div>
                        <button class="mini-btn coupon-claim-btn">领取</button>
                    </div>
                </div>
            </div>
        `);

        // 去凑单按钮 -> 打开凑单弹窗
        modal.querySelectorAll('.gather-tier-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.remove();
                showGatherModal(this.getAttribute('data-store'));
            });
        });

        // 领取按钮
        modal.querySelectorAll('.coupon-claim-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.textContent = '已领取';
                this.disabled = true;
                this.style.background = '#ccc';
                showSuccessToast();
            });
        });
    }

    // 显示店铺优惠明细
    function showStoreDiscountDetail(store) {
        let discountItems = '';
        let totalDiscount = '0.00';
        
        if (store === '诺真四叶草旗舰店') {
            discountItems = `
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        满减优惠
                    </span>
                    <span class="detail-value">-¥30.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        优惠券（满99减10）
                    </span>
                    <span class="detail-value">-¥10.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-time"/></svg>
                        限时折扣
                    </span>
                    <span class="detail-value">-¥5.50</span>
                </div>
            `;
            totalDiscount = '45.50';
        } else if (store === '杜蕾斯官方旗舰店') {
            discountItems = `
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        满减优惠（满199减20）
                    </span>
                    <span class="detail-value">-¥20.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        优惠券
                    </span>
                    <span class="detail-value">-¥10.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-time"/></svg>
                        限时抢折扣
                    </span>
                    <span class="detail-value">-¥5.00</span>
                </div>
            `;
            totalDiscount = '35.00';
        } else if (store === '冈本旗舰店') {
            discountItems = `
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-gift"/></svg>
                        满减优惠（满99减10）
                    </span>
                    <span class="detail-value">-¥10.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        新人专享券
                    </span>
                    <span class="detail-value">-¥5.00</span>
                </div>
                <div class="discount-detail-item">
                    <span class="detail-label">
                        <svg class="icon"><use href="#icon-coupon"/></svg>
                        优惠券
                    </span>
                    <span class="detail-value">-¥5.00</span>
                </div>
            `;
            totalDiscount = '20.00';
        }
        
        const modal = createModal(store + ' - 优惠明细', `
            <div class="modal-content-scroll">
                <div class="discount-detail-section">
                    ${discountItems}
                    <div class="discount-detail-item total">
                        <span class="detail-label">合计优惠</span>
                        <span class="detail-value highlight">-¥${totalDiscount}</span>
                    </div>
                </div>
                <div class="discount-detail-note">
                    <p>• 优惠金额已在商品价格中体现</p>
                    <p>• 满减活动与优惠券可叠加使用</p>
                    <p>• 部分商品不参与满减活动</p>
                </div>
            </div>
        `);
    }

    // 显示价格明细弹窗
    function showPriceDetailModal() {
        const modal = createModal('价格明细', `
            <div class="modal-content-scroll">
                <div class="price-detail-section">
                    <h4>商品金额</h4>
                    <div class="price-detail-item">
                        <span>诺真四叶草旗舰店</span>
                        <span>¥66.80</span>
                    </div>
                    <div class="price-detail-item">
                        <span>杜蕾斯官方旗舰店</span>
                        <span>¥118.90</span>
                    </div>
                    <div class="price-detail-item">
                        <span>冈本旗舰店</span>
                        <span>¥47.25</span>
                    </div>
                    <div class="price-detail-item total">
                        <span>商品总额</span>
                        <span>¥232.95</span>
                    </div>
                </div>
                <div class="price-detail-section">
                    <h4>优惠</h4>
                    <div class="price-detail-item discount">
                        <span>满减优惠</span>
                        <span>-¥30.00</span>
                    </div>
                    <div class="price-detail-item discount">
                        <span>优惠券</span>
                        <span>-¥15.00</span>
                    </div>
                    <div class="price-detail-item discount">
                        <span>限时折扣</span>
                        <span>-¥20.00</span>
                    </div>
                </div>
                <div class="price-detail-section">
                    <div class="price-detail-item final">
                        <span>实付金额</span>
                        <span class="final-price">¥167.95</span>
                    </div>
                </div>
                <div class="price-detail-note">
                    <p>注：以上价格为预估价格，实际支付金额以提交订单后为准</p>
                </div>
            </div>
        `);
    }
    
    // 生成虚拟商品数据
    function generateVirtualProducts() {
        const storeSections = document.querySelectorAll('.store-section');
        
        storeSections.forEach((section, storeIndex) => {
            const existingItems = section.querySelectorAll('.order-item');
            const storeTotal = section.querySelector('.store-total');
            
            if (existingItems.length > 0 && storeTotal) {
                const firstItem = existingItems[0];
                const itemsToAdd = 20 - existingItems.length;
                
                // 生成额外的商品
                for (let i = 0; i < itemsToAdd; i++) {
                    const newItem = firstItem.cloneNode(true);
                    const itemNum = existingItems.length + i + 1;
                    
                    // 修改商品图片
                    const img = newItem.querySelector('.order-image');
                    if (img) {
                        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品${itemNum}%3C/text%3E%3C/svg%3E`;
                        img.alt = `商品${itemNum}`;
                        img.onerror = null;
                    }
                    
                    // 修改商品信息
                    const title = newItem.querySelector('h3');
                    if (title) {
                        title.textContent = `商品${itemNum} - ${getRandomProductName()}`;
                    }
                    
                    const spec = newItem.querySelector('.order-spec');
                    if (spec) {
                        spec.textContent = `规格:${getRandomSpec()}`;
                    }
                    
                    const price = newItem.querySelector('.order-price');
                    if (price) {
                        price.textContent = `¥${(Math.random() * 13453.21 + 1.23).toFixed(2)}`;
                    }
                    
                    const qty = newItem.querySelector('.order-qty');
                    if (qty) {
                        qty.textContent = `x${Math.floor(Math.random() * 3) + 1}`;
                    }
                    
                    // 随机活动标签
                    const tags = newItem.querySelector('.activity-tags');
                    if (tags) {
                        tags.innerHTML = getRandomTags();
                    }
                    
                    // 插入到小计行之前
                    storeTotal.parentNode.insertBefore(newItem, storeTotal);
                }
            }
        });
        
        // 更新现有商品的图片
        updateExistingProductImages();
    }
    
    // 更新现有商品的图片
    function updateExistingProductImages() {
        const allImages = document.querySelectorAll('.order-image');
        allImages.forEach((img, index) => {
            const itemNum = index + 1;
            img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E商品${itemNum}%3C/text%3E%3C/svg%3E`;
            img.alt = `商品${itemNum}`;
            img.onerror = null;
        });
    }
    
    function getRandomProductName() {
        const names = [
            '超薄避孕套安全套成人用品',
            '润滑剂人体润滑液男用女用',
            '延时喷剂持久成人用品',
            '情趣用品套装玩具',
            '玻尿酸润滑油超润滑',
            '冰感润滑液清凉型',
            '持久装避孕套12只装',
            '超薄003避孕套',
            '激情装安全套组合',
            '水溶性润滑剂50ml'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }
    
    function getRandomSpec() {
        const specs = [
            '3只装', '6只装', '12只装', '24只装',
            '50ml装', '100ml装', '15ml装',
            '超薄型', '持久型', '冰感型', '热感型'
        ];
        return specs[Math.floor(Math.random() * specs.length)];
    }
    
    function getRandomTags() {
        // 按优先级排序：限时抢 > 满减 > 券 > 其他
        const tagsByPriority = [
            { priority: 1, html: '<span class="tag tag-limit"><svg class="icon tag-icon"><use href="#icon-time"/></svg><span class="tag-limit-text">限时抢</span><span class="tag-limit-divider">丨</span><span class="countdown" data-days="28" data-time="10:30:45">距结束 28 天 10:30:45</span></span>' },
            { priority: 2, html: '<span class="tag tag-manjian">满199减30</span>' },
            { priority: 3, html: '<span class="tag tag-coupon">满99减10券</span>' },
            { priority: 4, html: '<span class="tag tag-vip">黑卡价</span>' },
            { priority: 4, html: '<span class="tag tag-points">积分抵扣</span>' },
            { priority: 4, html: '<span class="tag tag-return">7天无理由</span>' }
        ];
        
        const numTags = Math.floor(Math.random() * 3) + 1;
        const shuffled = tagsByPriority.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numTags);
        
        // 按优先级排序
        selected.sort((a, b) => a.priority - b.priority);
        
        return selected.map(t => t.html).join('');
    }
    
    // 初始化商品折叠功能
    function initProductCollapse() {
        const storeSections = document.querySelectorAll('.store-section');
        
        storeSections.forEach(section => {
            const items = section.querySelectorAll('.order-item');
            const totalCount = items.length;
            
            if (totalCount > 10) {
                // 隐藏第11个及以后的商品
                for (let i = 10; i < totalCount; i++) {
                    items[i].style.display = 'none';
                }
                
                // 在小计行添加展开按钮
                const storeTotal = section.querySelector('.store-total');
                if (storeTotal) {
                    const expandBtn = document.createElement('button');
                    expandBtn.className = 'expand-products-btn';
                    expandBtn.innerHTML = `
                        <span>展开全部</span>
                        <svg class="icon"><use href="#icon-arrow-down"/></svg>
                    `;
                    expandBtn.setAttribute('data-expanded', 'false');
                    
                    storeTotal.insertBefore(expandBtn, storeTotal.firstChild);
                    
                    expandBtn.addEventListener('click', function() {
                        const isExpanded = this.getAttribute('data-expanded') === 'true';
                        
                        if (isExpanded) {
                            // 折叠
                            for (let i = 10; i < totalCount; i++) {
                                items[i].style.display = 'none';
                            }
                            this.innerHTML = `
                                <span>展开全部</span>
                                <svg class="icon"><use href="#icon-arrow-down"/></svg>
                            `;
                            this.setAttribute('data-expanded', 'false');
                        } else {
                            // 展开
                            for (let i = 10; i < totalCount; i++) {
                                items[i].style.display = 'flex';
                            }
                            this.innerHTML = `
                                <span>收起商品</span>
                                <svg class="icon"><use href="#icon-arrow-down"/></svg>
                            `;
                            this.setAttribute('data-expanded', 'true');
                        }
                    });
                }
            }
        });
        
        // 添加数量选择器
        addQuantitySelectors();
    }
    
    // 添加数量选择器
    function addQuantitySelectors() {
        const qtyElements = document.querySelectorAll('.order-qty');
        
        qtyElements.forEach(qtyEl => {
            const currentQty = parseInt(qtyEl.textContent.replace('x', ''));
            
            const selector = document.createElement('div');
            selector.className = 'quantity-selector';
            selector.innerHTML = `
                <button class="qty-change-btn qty-minus" ${currentQty <= 1 ? 'disabled' : ''}>-</button>
                <input type="number" class="qty-input" value="${currentQty}" min="1" max="9999">
                <button class="qty-change-btn qty-plus">+</button>
            `;
            
            qtyEl.replaceWith(selector);
            
            const minusBtn = selector.querySelector('.qty-minus');
            const plusBtn = selector.querySelector('.qty-plus');
            const input = selector.querySelector('.qty-input');
            
            function updateQtySize(el) {
                if (String(el.value).length >= 4) {
                    el.classList.add('qty-small');
                } else {
                    el.classList.remove('qty-small');
                }
            }

            // 减少数量
            minusBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let qty = parseInt(input.value);
                if (qty > 1) {
                    qty--;
                    input.value = qty;
                    this.disabled = qty <= 1;
                    updateQtySize(input);
                }
            });
            
            // 增加数量
            plusBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let qty = parseInt(input.value);
                if (qty < 9999) {
                    qty++;
                    input.value = qty;
                    minusBtn.disabled = false;
                    updateQtySize(input);
                }
            });
            
            // 直接输入数量
            input.addEventListener('change', function(e) {
                e.stopPropagation();
                let qty = parseInt(this.value);
                if (isNaN(qty) || qty < 1) {
                    qty = 1;
                } else if (qty > 9999) {
                    qty = 9999;
                }
                this.value = qty;
                minusBtn.disabled = qty <= 1;
                updateQtySize(this);
            });
            
            // 防止输入非数字
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^\d]/g, '');
                updateQtySize(this);
            });
        });
    }

    // 创建通用弹窗
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="close-btn">
                        <svg class="icon"><use href="#icon-close"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // 添加SVG图标定义
        const svgDefs = document.querySelector('body > div[style*="display: none"]');
        if (svgDefs) {
            modal.insertBefore(svgDefs.cloneNode(true), modal.firstChild);
        }
        
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        // 点击背景关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    // 显示提示信息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 限时抢倒计时
    function startCountdown() {
        const countdowns = document.querySelectorAll('.countdown');
        
        countdowns.forEach(countdown => {
            const timeAttr = countdown.getAttribute('data-time');
            const daysAttr = parseInt(countdown.getAttribute('data-days') || '0');
            const timeMatch = timeAttr.match(/(\d{2}):(\d{2}):(\d{2})/);
            
            if (timeMatch) {
                let days = daysAttr;
                let hours = parseInt(timeMatch[1]);
                let minutes = parseInt(timeMatch[2]);
                let seconds = parseInt(timeMatch[3]);
                
                setInterval(() => {
                    seconds--;
                    if (seconds < 0) {
                        seconds = 59;
                        minutes--;
                        if (minutes < 0) {
                            minutes = 59;
                            hours--;
                            if (hours < 0) {
                                hours = 23;
                                days--;
                                if (days < 0) {
                                    days = 0;
                                    hours = 0;
                                    minutes = 0;
                                    seconds = 0;
                                }
                            }
                        }
                    }
                    
                    const h = hours.toString().padStart(2, '0');
                    const m = minutes.toString().padStart(2, '0');
                    const s = seconds.toString().padStart(2, '0');
                    countdown.textContent = `距结束 ${days} 天 ${h}:${m}:${s}`;
                }, 1000);
            }
        });
    }
});
