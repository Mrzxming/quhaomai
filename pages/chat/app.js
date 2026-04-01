/**
 * 电商智能客服对话系统
 * 支持：智能客服 / 人工客服 / 表情 / 图片 / 视频 / 赞踩反馈 / 转人工排队
 */

;(function () {
  'use strict';

  // ========== State ==========
  const state = {
    mode: 'bot',          // 'bot' | 'human' | 'transferring'
    messages: [],
    queueTimer: null,
    queueCount: 3,
    msgIdCounter: 0,
  };

  // ========== DOM Refs ==========
  const $ = (sel) => document.querySelector(sel);
  const chatMessages = $('#chatMessages');
  const messageInput = $('#messageInput');
  const btnSend = $('#btnSend');
  const btnEmoji = $('#btnEmoji');
  const btnMedia = $('#btnMedia');
  const emojiPanel = $('#emojiPanel');
  const emojiGrid = $('#emojiGrid');
  const mediaPanel = $('#mediaPanel');
  const inputImage = $('#inputImage');
  const inputVideo = $('#inputVideo');
  const btnMore = $('#btnMore');
  const moreMenu = $('#moreMenu');
  const moreMenuOverlay = $('#moreMenuOverlay');
  const btnTransferHuman = $('#btnTransferHuman');
  const btnEndChat = $('#btnEndChat');
  const queueBanner = $('#queueBanner');
  const queueCount = $('#queueCount');
  const btnCancelQueue = $('#btnCancelQueue');
  const headerTitle = $('#headerTitle');
  const headerStatus = $('#headerStatus');
  const imagePreview = $('#imagePreview');
  const previewImage = $('#previewImage');
  const previewClose = $('#previewClose');
  const btnReport = $('#btnReport');
  const btnOrder = $('#btnOrder');
  const orderPanel = $('#orderPanel');
  const orderList = $('#orderList');

  // ========== Emoji Data ==========
  const emojis = [
    // 笑脸 & 表情
    '😀','😃','😄','😁','😆','😂','🤣','🥹',
    '😊','😇','🙂','😉','😌','😍','🥰','😘',
    '😗','😙','😚','😋','😛','😜','🤪','😝',
    '🤑','🤗','🤭','🫢','🤫','🤔','🫡','🤐',
    '🤨','😐','😑','😶','🫥','😏','😒','🙄',
    '😬','😮‍💨','🤥','😔','😪','🤤','😴','🥱',
    // 生气 & 难过
    '😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴',
    '😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓',
    '😤','😠','😡','🤬','😈','👿','💀','☠️',
    '😢','😭','😱','😖','😣','😞','😓','😩',
    '😫','🥺','😰','😥','😳','🫣','😶‍🌫️','🫠',
    // 手势
    '👍','👎','👏','🙌','🤝','🤲','🫶','💪',
    '✌️','🤞','🫰','🤟','🤘','🤙','👈','👉',
    '👆','👇','☝️','👋','🤚','🖐️','✋','🖖',
    '🫵','👌','🤌','🤏','✊','👊','🫳','🫴',
    // 爱心 & 符号
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
    '💔','❤️‍🔥','💕','💞','💓','💗','💖','💘',
    '💝','💟','♥️','🫀','💯','💢','💥','💫',
    '💦','💨','🕳️','💤','✨','⭐','🌟','🔥',
    // 电商 & 生活
    '🛒','📦','🚚','💰','💳','🏷️','🎁','🎉',
    '🎊','🏆','🥇','📱','💻','⌚','📷','🎮',
    '👗','👟','👜','💄','🧸','🏠','🛋️','🍽️',
    '☕','🧋','🍰','🎂','🌹','🌸','🍀','🐱',
    // 常用符号
    '✅','❌','⚠️','❓','❗','💬','👀','🔔',
    '📌','📎','🔗','⏰','📅','🔒','🔑','💡',
  ];

  // ========== Mock Orders ==========
  const mockOrders = [
    { id: '20260328001', name: 'Apple iPhone 16 Pro 256GB 沙漠钛金属', price: '¥8,999', status: '运输中', icon: '📱', date: '2026-03-28' },
    { id: '20260325002', name: 'AirPods Pro 第三代 USB-C', price: '¥1,899', status: '已签收', icon: '🎧', date: '2026-03-25' },
    { id: '20260320003', name: 'Nike Air Max 270 黑白配色 42码', price: '¥899', status: '已签收', icon: '👟', date: '2026-03-20' },
    { id: '20260315004', name: '戴森 V15 无线吸尘器', price: '¥4,299', status: '售后中', icon: '🏠', date: '2026-03-15' },
  ];

  // ========== Mock Products (from product page) ==========
  const mockProducts = [
    { id: 'P1001', name: 'Apple MacBook Pro 14 英寸 M4 Pro 芯片 24GB+512GB', price: '¥14,999', icon: '💻', tag: '新品首发', stock: 128 },
    { id: 'P1002', name: 'Sony WH-1000XM6 无线降噪头戴耳机 黑色', price: '¥2,699', icon: '🎧', tag: '热销爆款', stock: 56 },
    { id: 'P1003', name: 'Dyson Airwrap 多功能美发造型器 长发版', price: '¥3,699', icon: '💇', tag: '限时优惠', stock: 23 },
  ];

  // ========== Mock Shipping Info ==========
  const mockShippingInfo = {
    name: '张**',
    phone: '138****6789',
    address: '浙江省杭州市西湖区文三路 268 号 XX 小区 3 栋 1502',
  };

  // ========== Bot Auto Replies ==========
  const botReplies = {
    default: {
      text: '感谢您的咨询。我是智能客服小助手，请问有什么可以帮您？您可以问我关于订单、物流、退换货等问题。',
      quickReplies: ['查询订单', '物流进度', '退换货', '优惠活动'],
    },
    '查询订单': {
      text: '请提供您的订单号，我来帮您查询订单状态。您也可以在「我的订单」页面查看所有订单详情。',
      quickReplies: ['最近的订单', '如何找到订单号'],
    },
    '物流进度': {
      text: '您最近的订单 #20260328001 已发货，预计明天送达。当前物流状态：已到达您所在城市分拣中心。',
      quickReplies: ['修改收货地址', '催促配送', '转人工'],
    },
    '退换货': {
      text: '我们支持7天无理由退换货。请确认商品未拆封且不影响二次销售。如需退换，请在订单详情页点击「申请售后」。',
      quickReplies: ['退货流程', '换货流程', '退款多久到账'],
    },
    '优惠活动': {
      text: '当前活动：全场满299减50，新用户首单立减30元。部分商品参与限时秒杀，详情请查看首页活动专区。',
      quickReplies: ['领取优惠券', '秒杀商品', '会员权益'],
    },
    '转人工': {
      text: '好的，我这就为您转接人工客服，请稍候...',
      action: 'transfer',
    },
  };

  // ========== Init ==========
  function init() {
    renderEmojis();
    renderOrders();
    bindEvents();
    updateHeaderForMode();
    // Welcome message
    setTimeout(() => {
      addSystemMessage('会话已开始');
      addBotMessage(botReplies.default.text, botReplies.default.quickReplies);
    }, 500);
  }

  // ========== Render Emojis ==========
  function renderEmojis() {
    emojiGrid.innerHTML = emojis.map(e =>
      `<button class="emoji-item" data-emoji="${e}" aria-label="${e}">${e}</button>`
    ).join('');
  }

  // ========== Render Orders ==========
  function renderOrders() {
    orderList.innerHTML = mockOrders.map(o => `
      <button class="order-item" data-order-id="${o.id}">
        <div class="order-item-img">${o.icon}</div>
        <div class="order-item-info">
          <div class="order-item-name">${o.name}</div>
          <div class="order-item-meta">订单号 ${o.id} · ${o.date}</div>
        </div>
        <div class="order-item-status">${o.status}</div>
      </button>
    `).join('');
  }

  // ========== Event Bindings ==========
  function bindEvents() {
    // Send
    btnSend.addEventListener('click', sendMessage);
    messageInput.addEventListener('input', onInputChange);
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Emoji panel toggle
    btnEmoji.addEventListener('click', (e) => { e.stopPropagation(); togglePanel('emoji'); });
    // Media panel toggle
    btnMedia.addEventListener('click', (e) => { e.stopPropagation(); togglePanel('media'); });
    // Order panel toggle
    btnOrder.addEventListener('click', (e) => { e.stopPropagation(); togglePanel('order'); });

    // Emoji select
    emojiGrid.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('.emoji-item');
      if (!btn) return;
      const emoji = btn.dataset.emoji;
      messageInput.value += emoji;
      onInputChange();
      messageInput.focus();
    });

    // Prevent clicks inside panels from closing them
    emojiPanel.addEventListener('click', (e) => e.stopPropagation());
    mediaPanel.addEventListener('click', (e) => e.stopPropagation());
    orderPanel.addEventListener('click', (e) => e.stopPropagation());

    // Click anywhere else to close panels
    document.addEventListener('click', () => {
      closePanels();
    });

    // File inputs
    inputImage.addEventListener('change', handleImageUpload);
    inputVideo.addEventListener('change', handleVideoUpload);

    // Order item select
    orderList.addEventListener('click', (e) => {
      const item = e.target.closest('.order-item');
      if (!item) return;
      const orderId = item.dataset.orderId;
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
        closePanels();
        sendOrderCard(order);
      }
    });

    // More menu
    btnMore.addEventListener('click', () => {
      // Hide transfer button when already in human mode
      btnTransferHuman.classList.toggle('hidden', state.mode === 'human');
      moreMenu.classList.toggle('hidden');
    });
    moreMenuOverlay.addEventListener('click', () => moreMenu.classList.add('hidden'));
    btnTransferHuman.addEventListener('click', () => {
      moreMenu.classList.add('hidden');
      startTransferToHuman();
    });
    btnEndChat.addEventListener('click', () => {
      moreMenu.classList.add('hidden');
      endChat();
    });
    btnReport.addEventListener('click', () => {
      moreMenu.classList.add('hidden');
      showReportModal();
    });

    // Queue cancel
    btnCancelQueue.addEventListener('click', cancelTransfer);

    // Image preview
    previewClose.addEventListener('click', () => imagePreview.classList.add('hidden'));
    imagePreview.addEventListener('click', (e) => {
      if (e.target === imagePreview) imagePreview.classList.add('hidden');
    });

    // Delegate clicks in messages area
    chatMessages.addEventListener('click', handleMessageAreaClick);
  }

  // ========== Panel Toggle ==========
  function togglePanel(panel) {
    const isEmojiOpen = !emojiPanel.classList.contains('hidden');
    const isMediaOpen = !mediaPanel.classList.contains('hidden');
    const isOrderOpen = !orderPanel.classList.contains('hidden');

    emojiPanel.classList.add('hidden');
    mediaPanel.classList.add('hidden');
    orderPanel.classList.add('hidden');
    btnEmoji.classList.remove('active');
    btnMedia.classList.remove('active');
    btnOrder.classList.remove('active');

    if (panel === 'emoji' && !isEmojiOpen) {
      emojiPanel.classList.remove('hidden');
      btnEmoji.classList.add('active');
    } else if (panel === 'media' && !isMediaOpen) {
      mediaPanel.classList.remove('hidden');
      btnMedia.classList.add('active');
    } else if (panel === 'order' && !isOrderOpen) {
      orderPanel.classList.remove('hidden');
      btnOrder.classList.add('active');
    }
  }

  function closePanels() {
    emojiPanel.classList.add('hidden');
    mediaPanel.classList.add('hidden');
    orderPanel.classList.add('hidden');
    btnEmoji.classList.remove('active');
    btnMedia.classList.remove('active');
    btnOrder.classList.remove('active');
  }

  // ========== Input ==========
  function onInputChange() {
    const val = messageInput.value.trim();
    btnSend.disabled = val.length === 0;
    // Auto-resize
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
  }

  // ========== Send Message ==========
  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    closePanels();
    addUserMessage(text);
    messageInput.value = '';
    messageInput.style.height = 'auto';
    btnSend.disabled = true;

    // Check if pure emoji (1-3 emojis only)
    const emojiOnly = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}){1,3}$/u.test(text);

    if (state.mode === 'bot') {
      simulateBotReply(text);
    } else if (state.mode === 'human') {
      simulateHumanReply(text);
    }
  }

  // ========== Add Messages ==========
  function genId() { return ++state.msgIdCounter; }

  function addSystemMessage(text) {
    const html = `<div class="msg-system"><span class="system-text">${text}</span></div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function addTimeDivider() {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const html = `<div class="msg-time-divider">${timeStr}</div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
  }

  function addUserMessage(text) {
    const emojiOnly = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}){1,3}$/u.test(text);
    const bubbleClass = emojiOnly ? 'msg-bubble msg-emoji-large' : 'msg-bubble';
    const html = `
      <div class="msg-row user">
        <div class="msg-avatar user-avatar"></div>
        <div class="msg-content">
          <div class="${bubbleClass}">${escapeHtml(text)}</div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function addBotMessage(text, quickReplies, showFeedback = true) {
    const id = genId();
    let feedbackHtml = '';
    if (showFeedback) {
      feedbackHtml = `
        <div class="msg-feedback">
          <button class="feedback-btn" data-action="up" data-id="${id}" aria-label="有用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="feedback-btn" data-action="down" data-id="${id}" aria-label="没用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="feedback-text">这个回答有帮助吗？</span>
        </div>`;
    }

    let quickHtml = '';
    if (quickReplies && quickReplies.length) {
      // Filter out '转人工' when already in human mode
      const filtered = state.mode === 'human'
        ? quickReplies.filter(r => r !== '转人工')
        : quickReplies;
      if (filtered.length) {
        quickHtml = `<div class="quick-replies">${
          filtered.map(r => `<button class="quick-reply-btn" data-reply="${r}">${r}</button>`).join('')
        }</div>`;
      }
    }

    const html = `
      <div class="msg-row bot">
        <div class="msg-avatar bot-avatar">🤖</div>
        <div class="msg-content">
          <div class="msg-sender">智能客服</div>
          <div class="msg-bubble">${text}${feedbackHtml}</div>
          ${quickHtml}
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function addHumanMessage(text) {
    const html = `
      <div class="msg-row human">
        <div class="msg-avatar human-avatar">👤</div>
        <div class="msg-content">
          <div class="msg-sender">人工客服 · 小美</div>
          <div class="msg-bubble">${text}</div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const html = `
      <div class="msg-row bot typing-row">
        <div class="msg-avatar bot-avatar">🤖</div>
        <div class="msg-content">
          <div class="msg-bubble">
            <div class="typing-indicator"><span></span><span></span><span></span></div>
          </div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = chatMessages.querySelector('.typing-row');
    if (el) el.remove();
  }

  function addImageMessage(src, fromUser) {
    const side = fromUser ? 'user' : 'bot';
    const avatar = fromUser
      ? '<div class="msg-avatar user-avatar"></div>'
      : '<div class="msg-avatar bot-avatar">🤖</div>';
    const html = `
      <div class="msg-row ${side}">
        ${avatar}
        <div class="msg-content">
          <img class="msg-image" src="${src}" alt="图片消息" data-preview="${src}">
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function addVideoMessage(src, fromUser) {
    const side = fromUser ? 'user' : 'bot';
    const avatar = fromUser
      ? '<div class="msg-avatar user-avatar"></div>'
      : '<div class="msg-avatar bot-avatar">🤖</div>';
    const html = `
      <div class="msg-row ${side}">
        ${avatar}
        <div class="msg-content">
          <video class="msg-video" src="${src}" controls preload="metadata"></video>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  // ========== Send Order Card ==========
  function sendOrderCard(order) {
    const html = `
      <div class="msg-row user">
        <div class="msg-avatar user-avatar"></div>
        <div class="msg-content">
          <div class="msg-order-card">
            <div class="msg-order-card-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="14" x2="13" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              订单 #${order.id}
            </div>
            <div class="msg-order-card-body">
              <div class="msg-order-card-img">${order.icon}</div>
              <div class="msg-order-card-info">
                <div class="msg-order-card-name">${order.name}</div>
                <div class="msg-order-card-meta">${order.price} · ${order.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();

    // Bot/human auto reply
    if (state.mode === 'bot') {
      addTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMessage(
          `已收到您发送的订单 #${order.id}，当前状态为「${order.status}」。请问您需要咨询这个订单的什么问题？`,
          ['查看物流', '申请退换货', '修改地址', '转人工']
        );
      }, 1000);
    } else if (state.mode === 'human') {
      simulateHumanReply('订单咨询');
    }
  }

  // ========== Send Product Card (from product page) ==========
  function sendProductCard(product) {
    const html = `
      <div class="msg-row user">
        <div class="msg-avatar user-avatar"></div>
        <div class="msg-content">
          <div class="msg-product-card">
            <div class="msg-product-card-body">
              <div class="msg-product-card-img">${product.icon}</div>
              <div class="msg-product-card-info">
                <div class="msg-product-card-name">${product.name}</div>
                <div class="msg-product-card-price">${product.price}</div>
                ${product.tag ? `<span class="msg-product-card-tag">${product.tag}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();

    // Bot auto reply about this product
    addTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addBotMessage(
        `您正在咨询「${product.name}」，当前库存 ${product.stock} 件。请问您想了解什么？`,
        ['商品详情', '优惠信息', '发货时间', '转人工']
      );
    }, 1000);
  }

  // ========== Send Shipping Confirm Card (after order placed) ==========
  function sendShippingConfirmCard(order, shipping) {
    const cardHtml = `
      <div class="msg-row bot">
        <div class="msg-avatar bot-avatar">🤖</div>
        <div class="msg-content">
          <div class="msg-sender">智能客服</div>
          <div class="msg-shipping-card">
            <div class="shipping-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/></svg>
              请确认收货信息
            </div>
            <div class="shipping-info-row">
              <span class="shipping-info-label">收件人</span>
              <span class="shipping-info-value">${shipping.name}</span>
            </div>
            <div class="shipping-info-row">
              <span class="shipping-info-label">手机号</span>
              <span class="shipping-info-value">${shipping.phone}</span>
            </div>
            <div class="shipping-info-row">
              <span class="shipping-info-label">地　址</span>
              <span class="shipping-info-value">${shipping.address}</span>
            </div>
            <div class="shipping-product-row">
              <span class="shipping-product-icon">${order.icon}</span>
              <div class="shipping-product-info">
                <div class="shipping-product-name">${order.name}</div>
                <div class="shipping-product-meta">${order.price} × 1</div>
              </div>
            </div>
            <div class="shipping-card-actions">
              <button class="shipping-modify-btn" data-shipping-action="modify">修改地址</button>
              <button class="shipping-confirm-btn" data-shipping-action="confirm">确认无误</button>
            </div>
          </div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', cardHtml);
    scrollToBottom();
  }

  // ========== Bot Reply Simulation ==========
  function simulateBotReply(userText) {
    addTypingIndicator();
    const delay = 800 + Math.random() * 600;

    setTimeout(() => {
      removeTypingIndicator();

      // Match reply
      const matched = botReplies[userText];
      if (matched) {
        if (matched.action === 'transfer') {
          addBotMessage(matched.text, null, false);
          setTimeout(() => startTransferToHuman(), 800);
        } else {
          addBotMessage(matched.text, matched.quickReplies);
        }
      } else {
        // Fallback: unrecognized → suggest transfer
        const fallbackText = '抱歉，我暂时无法理解您的问题。您可以换个方式描述，或者转接人工客服获得更专业的帮助。';
        addBotMessage(fallbackText, ['转人工', '查询订单', '退换货']);
      }
    }, delay);
  }

  // ========== Human Reply Simulation ==========
  function simulateHumanReply(userText) {
    addTypingIndicator();
    const delay = 1200 + Math.random() * 800;

    setTimeout(() => {
      removeTypingIndicator();
      const replies = [
        '您好，我已经查看了您的问题，正在为您处理中，请稍候。',
        '好的，我来帮您核实一下，请您稍等片刻。',
        '感谢您的耐心等待，您的问题我已经记录，会尽快为您解决。',
        '明白了，我这边帮您操作一下，预计几分钟内完成。',
      ];
      addHumanMessage(replies[Math.floor(Math.random() * replies.length)]);
    }, delay);
  }

  // ========== Transfer to Human ==========
  function updateHeaderForMode() {
    if (state.mode === 'bot') {
      headerTitle.textContent = '智能客服';
      headerStatus.textContent = '智能客服服务中';
      headerStatus.className = 'header-status';
    } else if (state.mode === 'human') {
      headerTitle.textContent = '人工客服 · 小美';
      headerStatus.textContent = '人工客服服务中';
      headerStatus.className = 'header-status';
    } else if (state.mode === 'transferring') {
      headerTitle.textContent = '转接中...';
      headerStatus.textContent = '排队中';
      headerStatus.className = 'header-status transferring';
    }
  }

  function startTransferToHuman() {
    if (state.mode === 'transferring') return;
    state.mode = 'transferring';
    state.queueCount = Math.floor(Math.random() * 5) + 1;

    updateHeaderForMode();

    queueCount.textContent = state.queueCount;
    queueBanner.classList.remove('hidden');

    addSystemMessage('正在为您转接人工客服...');

    // Simulate queue countdown
    state.queueTimer = setInterval(() => {
      state.queueCount--;
      queueCount.textContent = state.queueCount;

      if (state.queueCount <= 0) {
        clearInterval(state.queueTimer);
        completeTransfer();
      }
    }, 2000);
  }

  function completeTransfer() {
    state.mode = 'human';
    queueBanner.classList.add('hidden');
    updateHeaderForMode();

    addSystemMessage('已转接人工客服 · 小美');
    addHumanMessage('您好，我是人工客服小美，很高兴为您服务。请问有什么可以帮您的？');
  }

  function cancelTransfer() {
    clearInterval(state.queueTimer);
    state.mode = 'bot';
    queueBanner.classList.add('hidden');
    updateHeaderForMode();

    addSystemMessage('已取消转接人工客服');
    addBotMessage('好的，我继续为您服务。请问还有什么可以帮您？', ['查询订单', '物流进度', '退换货']);
  }

  // ========== End Chat ==========
  function endChat() {
    clearInterval(state.queueTimer);
    queueBanner.classList.add('hidden');

    addSystemMessage('会话已结束');

    // Show satisfaction survey
    const html = `
      <div class="msg-system">
        <div class="satisfaction-card">
          <div class="satisfaction-title">请对本次服务进行评价</div>
          <div class="satisfaction-stars">
            ${[1,2,3,4,5].map(i => `<button class="star-btn" data-star="${i}">⭐</button>`).join('')}
          </div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  // ========== File Uploads ==========
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    closePanels();
    const reader = new FileReader();
    reader.onload = (ev) => {
      addImageMessage(ev.target.result, true);
      // Simulate bot acknowledging image
      if (state.mode === 'bot') {
        addTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addBotMessage('已收到您发送的图片，我来帮您分析一下。请问这是关于什么问题呢？', ['商品质量问题', '物流损坏', '其他问题'], true);
        }, 1200);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    closePanels();
    const url = URL.createObjectURL(file);
    addVideoMessage(url, true);
    if (state.mode === 'bot') {
      addTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addBotMessage('已收到您发送的视频，我会转交给专员查看。如需更快处理，建议转接人工客服。', ['转人工'], true);
      }, 1500);
    }
    e.target.value = '';
  }

  // ========== Message Area Click Handler ==========
  function handleMessageAreaClick(e) {
    // Quick reply
    const quickBtn = e.target.closest('.quick-reply-btn');
    if (quickBtn) {
      const reply = quickBtn.dataset.reply;
      addUserMessage(reply);
      // Remove all quick reply buttons
      document.querySelectorAll('.quick-replies').forEach(el => el.remove());
      if (reply === '转人工') {
        addTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addBotMessage('好的，我这就为您转接人工客服，请稍候...', null, false);
          setTimeout(() => startTransferToHuman(), 800);
        }, 600);
      } else if (state.mode === 'bot') {
        simulateBotReply(reply);
      } else {
        simulateHumanReply(reply);
      }
      return;
    }

    // Feedback buttons
    const fbBtn = e.target.closest('.feedback-btn');
    if (fbBtn) {
      const action = fbBtn.dataset.action;
      const container = fbBtn.closest('.msg-feedback');
      const allBtns = container.querySelectorAll('.feedback-btn');
      const textEl = container.querySelector('.feedback-text');

      allBtns.forEach(b => {
        b.classList.remove('active-up', 'active-down');
        b.style.pointerEvents = 'none';
      });

      if (action === 'up') {
        fbBtn.classList.add('active-up');
        textEl.textContent = '感谢您的反馈 👍';
      } else {
        fbBtn.classList.add('active-down');
        textEl.textContent = '抱歉没能帮到您，已记录反馈';
        // Offer transfer after negative feedback
        setTimeout(() => {
          addBotMessage('看起来这个回答没能解决您的问题，需要我为您转接人工客服吗？', ['转人工', '继续咨询'], false);
        }, 500);
      }
      return;
    }

    // Image preview
    const img = e.target.closest('.msg-image');
    if (img) {
      previewImage.src = img.dataset.preview;
      imagePreview.classList.remove('hidden');
      return;
    }

    // Star rating
    const star = e.target.closest('.star-btn');
    if (star) {
      const rating = parseInt(star.dataset.star);
      const card = star.closest('.satisfaction-card');
      const container = star.closest('.satisfaction-stars');
      container.querySelectorAll('.star-btn').forEach((s, i) => {
        s.classList.toggle('active', i < rating);
      });

      // Remove existing feedback area if any
      const existingFb = card.querySelector('.satisfaction-feedback');
      if (existingFb) existingFb.remove();

      if (rating < 4) {
        // Show feedback input for low ratings
        const fbHtml = `
          <div class="satisfaction-feedback">
            <textarea class="satisfaction-textarea" placeholder="请告诉我们哪里可以改进，您的建议对我们很重要..." maxlength="200"></textarea>
            <button class="satisfaction-submit-btn" data-rating="${rating}">提交评价</button>
          </div>`;
        card.insertAdjacentHTML('beforeend', fbHtml);
        card.querySelector('.satisfaction-textarea').focus();
        scrollToBottom();
      } else {
        setTimeout(() => {
          addSystemMessage(`感谢您的 ${rating} 星评价，祝您购物愉快 🎉`);
        }, 400);
      }
      return;
    }

    // Satisfaction submit button
    const satisfactionSubmit = e.target.closest('.satisfaction-submit-btn');
    if (satisfactionSubmit) {
      const card = satisfactionSubmit.closest('.satisfaction-card');
      const textarea = card.querySelector('.satisfaction-textarea');
      const rating = parseInt(satisfactionSubmit.dataset.rating);
      const feedback = textarea ? textarea.value.trim() : '';
      const feedbackMsg = feedback
        ? `感谢您的 ${rating} 星评价和宝贵建议，我们会持续改进 🙏`
        : `感谢您的 ${rating} 星评价，我们会努力改进 🙏`;
      // Remove the feedback area
      const fbArea = card.querySelector('.satisfaction-feedback');
      if (fbArea) fbArea.remove();
      setTimeout(() => {
        addSystemMessage(feedbackMsg);
      }, 300);
      return;
    }

    // Shipping card actions
    const shippingBtn = e.target.closest('[data-shipping-action]');
    if (shippingBtn) {
      const action = shippingBtn.dataset.shippingAction;
      const card = shippingBtn.closest('.msg-shipping-card');
      const actionsEl = card.querySelector('.shipping-card-actions');
      if (actionsEl) actionsEl.remove();

      if (action === 'confirm') {
        addSystemMessage('收货信息已确认，商品将尽快为您发出 🚚');
        addTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addBotMessage('收货信息确认成功，预计 1-3 个工作日内发货。您可以随时查询物流进度。', ['查看物流', '返回首页']);
        }, 800);
      } else if (action === 'modify') {
        addTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addBotMessage('请前往「我的 → 地址管理」修改收货地址，修改后订单将自动更新。如需帮助，可转接人工客服。', ['转人工', '我知道了']);
        }, 800);
      }
      return;
    }

    // Transfer inline button
    const transferBtn = e.target.closest('.transfer-btn-inline');
    if (transferBtn) {
      startTransferToHuman();
      return;
    }
  }

  // ========== Report Modal ==========
  function showReportModal() {
    const reasons = ['客服态度恶劣', '回复内容不当', '诱导私下交易', '泄露个人信息', '其他原因'];
    const html = `
      <div class="report-overlay" id="reportOverlay">
        <div class="report-modal">
          <div class="report-modal-title">举报客服</div>
          <div class="report-options">
            ${reasons.map(r => `
              <button class="report-option" data-reason="${r}">
                <span class="report-check"></span>
                ${r}
              </button>
            `).join('')}
          </div>
          <div class="report-modal-actions">
            <button class="report-cancel-btn" id="reportCancel">取消</button>
            <button class="report-submit-btn" id="reportSubmit" disabled>提交举报</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const overlay = document.getElementById('reportOverlay');
    const cancelBtn = document.getElementById('reportCancel');
    const submitBtn = document.getElementById('reportSubmit');
    let selectedReason = null;

    overlay.querySelectorAll('.report-option').forEach(opt => {
      opt.addEventListener('click', () => {
        overlay.querySelectorAll('.report-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedReason = opt.dataset.reason;
        submitBtn.disabled = false;
      });
    });

    cancelBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    submitBtn.addEventListener('click', () => {
      if (!selectedReason) return;
      overlay.remove();
      addSystemMessage('举报已提交，我们会尽快处理，感谢您的反馈');
    });
  }

  // ========== Utilities ==========
  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== Demo Simulation Buttons ==========
  function bindDemoBar() {
    const demoFromProduct = document.getElementById('demoFromProduct');
    const demoAfterOrder = document.getElementById('demoAfterOrder');

    if (demoFromProduct) {
      demoFromProduct.addEventListener('click', () => {
        // Simulate entering chat from a product page
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        addSystemMessage('用户从商品详情页进入咨询');
        sendProductCard(product);
      });
    }

    if (demoAfterOrder) {
      demoAfterOrder.addEventListener('click', () => {
        // Simulate post-order shipping confirmation
        const order = mockOrders[0]; // latest order
        addSystemMessage('订单提交成功，请确认收货信息');
        sendShippingConfirmCard(order, mockShippingInfo);
      });
    }
  }

  // ========== Start ==========
  init();
  bindDemoBar();
})();
