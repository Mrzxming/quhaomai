// 购物车相关功能
document.addEventListener('DOMContentLoaded', function() {
    
    // 数量控制
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const qtySpan = this.parentElement.querySelector('.qty');
            let qty = parseInt(qtySpan.textContent);
            
            // 检查是减号还是加号按钮
            const isMinus = this.querySelector('use')?.getAttribute('href')?.includes('minus');
            const isPlus = this.querySelector('use')?.getAttribute('href')?.includes('plus');
            
            if (isPlus) {
                qty++;
            } else if (isMinus && qty > 1) {
                qty--;
            }
            
            qtySpan.textContent = qty;
            updateTotal();
        });
    });

    // 复选框选择
    const checkboxes = document.querySelectorAll('.checkbox');
    const selectAll = document.getElementById('select-all');
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(cb => {
                if (cb !== selectAll) {
                    cb.checked = selectAll.checked;
                }
            });
            updateTotal();
        });
    }

    checkboxes.forEach(cb => {
        if (cb !== selectAll) {
            cb.addEventListener('change', function() {
                updateTotal();
                
                // 更新全选状态
                if (selectAll) {
                    const allChecked = Array.from(checkboxes)
                        .filter(c => c !== selectAll)
                        .every(c => c.checked);
                    selectAll.checked = allChecked;
                }
            });
        }
    });

    // 计算总价
    function updateTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        
        cartItems.forEach(item => {
            const checkbox = item.querySelector('.checkbox');
            if (checkbox && checkbox.checked) {
                const priceText = item.querySelector('.item-price').textContent;
                const price = parseFloat(priceText.replace('¥', ''));
                const qty = parseInt(item.querySelector('.qty').textContent);
                total += price * qty;
            }
        });
        
        const totalPrice = document.querySelector('.total-price');
        if (totalPrice) {
            totalPrice.textContent = total.toFixed(2);
        }
    }

    // 金额明细弹窗
    const totalSection = document.querySelector('.total-section');
    if (totalSection) {
        totalSection.addEventListener('click', function() {
            showPriceModal();
        });
    }

    function showPriceModal() {
        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="price-modal">
                <div class="modal-header">
                    <h3 class="modal-title">金额明细</h3>
                    <button class="close-btn">
                        <svg class="icon"><use href="#icon-close"/></svg>
                    </button>
                </div>
                <p class="modal-subtitle">实际优惠金额请以下单页为准</p>
                <div class="price-row">
                    <span class="label">商品总计</span>
                    <span class="value">¥6594.20</span>
                </div>
                <div class="price-row">
                    <span class="label">总运费</span>
                    <span class="value">¥0.00</span>
                </div>
                <div class="price-row">
                    <span class="label">店铺优惠</span>
                    <span class="value red">减¥0.00</span>
                </div>
                <div class="price-row total">
                    <span class="label">合计 <span class="note">不含运到服务费</span></span>
                    <span class="value">¥6594.20</span>
                </div>
            </div>
        `;
        
        // 添加SVG图标定义
        const svgDefs = document.querySelector('body > div[style*="display: none"]');
        if (!modal.querySelector('svg') && svgDefs) {
            modal.insertBefore(svgDefs.cloneNode(true), modal.firstChild);
        }
        
        document.body.appendChild(modal);
        
        // 关闭弹窗
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 结算按钮
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const checkedItems = document.querySelectorAll('.cart-item .checkbox:checked');
            if (checkedItems.length === 0) {
                alert('请选择要结算的商品');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // 立即付款按钮
    const payBtn = document.querySelector('.pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            alert('跳转到支付页面');
        });
    }

    // 底部导航
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span:last-child').textContent;
            
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 页面跳转
            switch(text) {
                case '首页':
                    window.location.href = 'home.html';
                    break;
                case '采购车':
                    window.location.href = 'cart.html';
                    break;
                case '消息':
                case '黑卡':
                case '我的':
                    alert('功能开发中');
                    break;
            }
        });
    });

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            const keyword = searchInput.value.trim();
            if (keyword) {
                alert('搜索: ' + keyword);
            }
        });
    }

    // 商品卡片点击
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    });

    // 采购车按钮
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('outline')) {
                window.location.href = 'cart.html';
            } else {
                alert('立即购买');
            }
        });
    });
});
