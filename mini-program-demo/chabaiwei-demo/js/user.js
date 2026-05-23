/* ============================================
   茶百味 User-side Application Logic
   ============================================ */

// ---- State ----
let userState = {
  currentPage: 'home',
  currentCategory: 'milk_tea',
  bannerIndex: 0,
  bannerTimer: null,
  selectedCoupon: null,
  specModalProduct: null,
  specSelections: {},
  specQuantity: 1
};

// ---- Toast ----
function showToast(message, duration = 1500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Image Error Handler ----
const categoryEmojis = {
  milk_tea: '🧋',
  fruit_tea: '🍋',
  seasonal: '🌸',
  snacks: '🍰'
};

function handleImageError(img, category) {
  img.onerror = null;
  const emoji = categoryEmojis[category] || '🍵';
  const parent = img.parentElement;
  img.style.display = 'none';
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.textContent = emoji;
  parent.appendChild(placeholder);
}

// ---- Format Time ----
function formatTime(isoString) {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

// ============================================
// HOME PAGE
// ============================================
function renderHomePage() {
  const app = document.getElementById('app');
  const cartCount = getCartCount();

  app.innerHTML = `
    <div class="page home-page" id="page-home">
      <div class="shop-header">
        <div class="shop-header-top">
          <div class="shop-logo">${shopInfo.logo}</div>
          <div class="shop-info">
            <div class="shop-name">${shopInfo.name}</div>
            <div class="shop-tagline">${shopInfo.tagline}</div>
          </div>
        </div>
        <div class="shop-stats">
          <span class="rating">★ ${shopInfo.rating}</span>
          <span>月售${shopInfo.monthlySales}杯</span>
          <span>${shopInfo.businessHours}</span>
        </div>
      </div>

      <div class="announcement-bar">
        <span class="announcement-icon">📢</span>
        <span class="announcement-text">${shopInfo.notice}</span>
      </div>

      <div class="banner-carousel" id="banner-carousel">
        <div class="banner-track" id="banner-track">
          <div class="banner-slide">
            <img src="images/tea1.jpg" alt="新品推荐" onerror="this.src='';this.parentElement.style.background='linear-gradient(135deg, #FF6B35, #FF8F66)';this.style.display='none'">
          </div>
          <div class="banner-slide">
            <img src="images/tea2.jpg" alt="人气爆款" onerror="this.src='';this.parentElement.style.background='linear-gradient(135deg, #FF9800, #FFB74D)';this.style.display='none'">
          </div>
          <div class="banner-slide">
            <img src="images/tea3.jpg" alt="限时优惠" onerror="this.src='';this.parentElement.style.background='linear-gradient(135deg, #4CAF50, #81C784)';this.style.display='none'">
          </div>
        </div>
        <div class="banner-dots">
          <div class="banner-dot active"></div>
          <div class="banner-dot"></div>
          <div class="banner-dot"></div>
        </div>
      </div>

      <div class="quick-actions stagger-children">
        <a class="quick-action-item" onclick="router.navigate('menu')">
          <div class="quick-action-icon">🧋</div>
          <span class="quick-action-label">奶茶</span>
        </a>
        <a class="quick-action-item" onclick="router.navigate('menu')">
          <div class="quick-action-icon">🍋</div>
          <span class="quick-action-label">果茶</span>
        </a>
        <a class="quick-action-item" onclick="router.navigate('menu')">
          <div class="quick-action-icon">🌸</div>
          <span class="quick-action-label">限定</span>
        </a>
        <a class="quick-action-item" onclick="router.navigate('menu')">
          <div class="quick-action-icon">🍰</div>
          <span class="quick-action-label">小食</span>
        </a>
      </div>

      <div class="cta-section">
        <div class="cta-button" onclick="router.navigate('menu')">
          <span>🍵</span>
          <span>立即点单</span>
          <span>→</span>
        </div>
      </div>

      <div style="padding: 0 16px 16px;">
        <div class="admin-login-hint" style="text-align: center;">
          <a onclick="router.navigate('admin/login')" style="color: var(--color-text-tertiary); font-size: 12px; cursor: pointer;">切换到商家端</a>
        </div>
      </div>
    </div>

    ${renderUserTabBar('home')}
  `;

  // Start banner auto-play
  startBannerCarousel();

  // Listen for cart updates
  window.addEventListener('cartUpdated', updateHomeCartBadge);
}

function updateHomeCartBadge() {
  // No badge on home, but could add if needed
}

function startBannerCarousel() {
  if (userState.bannerTimer) clearInterval(userState.bannerTimer);
  userState.bannerIndex = 0;
  updateBannerPosition();

  userState.bannerTimer = setInterval(() => {
    userState.bannerIndex = (userState.bannerIndex + 1) % 3;
    updateBannerPosition();
  }, 3500);
}

function updateBannerPosition() {
  const track = document.getElementById('banner-track');
  if (!track) return;
  track.style.transform = `translateX(-${userState.bannerIndex * 100}%)`;

  const dots = document.querySelectorAll('.banner-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === userState.bannerIndex);
  });
}

// ============================================
// MENU PAGE
// ============================================
function renderMenuPage() {
  const app = document.getElementById('app');

  const categoryHTML = categories.map(cat => `
    <div class="category-sidebar-item ${cat.id === userState.currentCategory ? 'active' : ''}"
         onclick="scrollToCategory('${cat.id}')"
         data-cat-id="${cat.id}">
      <span class="category-sidebar-icon">${cat.icon}</span>
      <span class="category-sidebar-name">${cat.name}</span>
    </div>
  `).join('');

  const productsHTML = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    return `
      <div class="product-section" id="section-${cat.id}">
        <div class="product-section-title"><span>${cat.icon}</span> ${cat.name}</div>
        ${catProducts.map(p => renderProductCard(p)).join('')}
      </div>
    `;
  }).join('');

  const cartCount = getCartCount();

  app.innerHTML = `
    <div class="page menu-page" id="page-menu">
      <div class="page-header">
        <div class="page-header-back" onclick="router.navigate('home')">←</div>
        <div class="page-header-title">菜单</div>
        <div class="page-header-right"></div>
      </div>

      <div class="menu-container">
        <div class="category-sidebar" id="category-sidebar">
          ${categoryHTML}
        </div>
        <div class="product-grid" id="product-grid">
          ${productsHTML}
        </div>
      </div>

      <div class="fab-cart ${cartCount > 0 ? '' : 'hidden'}" id="fab-cart" onclick="router.navigate('cart')">
        🛒
        <span class="badge" id="fab-cart-badge">${cartCount}</span>
      </div>
    </div>

    ${renderUserTabBar('menu')}

    <div class="spec-modal-overlay" id="spec-overlay" onclick="closeSpecModal()"></div>
    <div class="spec-modal" id="spec-modal"></div>
  `;

  // Scroll spy for category sidebar
  const productGrid = document.getElementById('product-grid');
  if (productGrid) {
    productGrid.addEventListener('scroll', handleMenuScroll);
  }

  // Listen for cart updates
  window.addEventListener('cartUpdated', updateMenuFab);

  // Render spec modal content
  if (userState.specModalProduct) {
    renderSpecModal(userState.specModalProduct);
  }
}

function renderProductCard(product) {
  const available = isProductAvailable(product.id);
  return `
    <div class="product-card" onclick="${available ? `openSpecModal(${product.id})` : ''}" style="${available ? '' : 'opacity: 0.5; pointer-events: none;'}">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this, '${product.category}')">
      </div>
      <div class="product-card-info">
        <div>
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-desc">${product.desc}</div>
        </div>
        <div class="product-card-meta">
          <div>
            <span class="product-card-price"><span class="symbol">¥</span>${product.price}</span>
            <span class="product-card-sales">月售${product.sales}</span>
          </div>
          ${available ? `<div class="product-card-add" onclick="event.stopPropagation(); openSpecModal(${product.id})">+</div>` : '<span class="badge badge-danger">已售罄</span>'}
        </div>
      </div>
    </div>
  `;
}

function handleMenuScroll() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const sections = grid.querySelectorAll('.product-section');
  let currentCat = categories[0].id;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    if (rect.top <= gridRect.top + 60) {
      currentCat = section.id.replace('section-', '');
    }
  });

  if (currentCat !== userState.currentCategory) {
    userState.currentCategory = currentCat;
    updateCategoryHighlight();
  }
}

function updateCategoryHighlight() {
  const items = document.querySelectorAll('.category-sidebar-item');
  items.forEach(item => {
    item.classList.toggle('active', item.dataset.catId === userState.currentCategory);
  });
}

function scrollToCategory(catId) {
  userState.currentCategory = catId;
  updateCategoryHighlight();

  const section = document.getElementById('section-' + catId);
  const grid = document.getElementById('product-grid');
  if (section && grid) {
    const offset = section.offsetTop - grid.offsetTop;
    grid.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

function updateMenuFab() {
  const fab = document.getElementById('fab-cart');
  const badge = document.getElementById('fab-cart-badge');
  if (!fab) return;

  const count = getCartCount();
  if (count > 0) {
    fab.classList.remove('hidden');
    if (badge) badge.textContent = count;
    // Bounce animation
    fab.classList.remove('bounce');
    void fab.offsetWidth;
    fab.classList.add('bounce');
  } else {
    fab.classList.add('hidden');
  }
}

// ============================================
// SPEC MODAL
// ============================================
function openSpecModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || !isProductAvailable(productId)) return;

  userState.specModalProduct = product;
  userState.specQuantity = 1;

  // Initialize selections with first option of each group
  userState.specSelections = {};
  if (product.specs) {
    if (product.specs.cup) userState.specSelections.cup = product.specs.cup[0];
    if (product.specs.sugar) userState.specSelections.sugar = product.specs.sugar[0];
    if (product.specs.ice) userState.specSelections.ice = product.specs.ice[0];
    if (product.specs.toppings) userState.specSelections.toppings = [];
  }

  renderSpecModal(product);

  document.getElementById('spec-overlay').classList.add('active');
  document.getElementById('spec-modal').classList.add('active');
}

function closeSpecModal() {
  document.getElementById('spec-overlay').classList.remove('active');
  document.getElementById('spec-modal').classList.remove('active');
  userState.specModalProduct = null;
}

function renderSpecModal(product) {
  const modal = document.getElementById('spec-modal');
  if (!modal) return;

  let specsHTML = '';

  if (product.specs.cup) {
    specsHTML += `
      <div class="spec-group">
        <div class="spec-group-title">杯型</div>
        <div class="spec-group-options">
          ${product.specs.cup.map(opt => `
            <div class="spec-option ${userState.specSelections.cup === opt ? 'selected' : ''}"
                 onclick="selectSpec('cup', '${opt}')">${opt}</div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (product.specs.sugar) {
    specsHTML += `
      <div class="spec-group">
        <div class="spec-group-title">糖度</div>
        <div class="spec-group-options">
          ${product.specs.sugar.map(opt => `
            <div class="spec-option ${userState.specSelections.sugar === opt ? 'selected' : ''}"
                 onclick="selectSpec('sugar', '${opt}')">${opt}</div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (product.specs.ice) {
    specsHTML += `
      <div class="spec-group">
        <div class="spec-group-title">冰度</div>
        <div class="spec-group-options">
          ${product.specs.ice.map(opt => `
            <div class="spec-option ${userState.specSelections.ice === opt ? 'selected' : ''}"
                 onclick="selectSpec('ice', '${opt}')">${opt}</div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (product.specs.toppings && product.specs.toppings.length > 0) {
    specsHTML += `
      <div class="spec-group">
        <div class="spec-group-title">加料 <span style="font-size: 12px; color: var(--color-text-tertiary); font-weight: normal;">(可多选)</span></div>
        <div class="spec-group-options">
          ${product.specs.toppings.map(t => `
            <div class="spec-option ${userState.specSelections.toppings.includes(t.name) ? 'selected' : ''}"
                 onclick="toggleTopping('${t.name}', ${t.price})">
              ${t.name} <span class="extra-price">+¥${t.price}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const totalPrice = calcSpecPrice(product);

  modal.innerHTML = `
    <div class="spec-modal-header">
      <div class="spec-modal-image">
        <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this, '${product.category}')">
      </div>
      <div>
        <div class="spec-modal-name">${product.name}</div>
        <div class="spec-modal-desc">${product.desc}</div>
        <div class="spec-modal-price"><span class="symbol">¥</span>${totalPrice}</div>
      </div>
      <div class="spec-modal-close" onclick="closeSpecModal()">✕</div>
    </div>

    <div class="spec-modal-body">
      ${specsHTML}

      <div class="quantity-selector">
        <span class="quantity-selector-label">数量</span>
        <div class="quantity-controls">
          <button class="quantity-btn quantity-btn-minus" onclick="changeSpecQty(-1)">−</button>
          <span class="quantity-value" id="spec-qty">${userState.specQuantity}</span>
          <button class="quantity-btn quantity-btn-plus" onclick="changeSpecQty(1)">+</button>
        </div>
      </div>
    </div>

    <div class="spec-modal-footer">
      <div class="spec-modal-total">
        <span class="spec-modal-total-label">小计</span>
        <span class="spec-modal-total-price" id="spec-total">¥${totalPrice * userState.specQuantity}</span>
      </div>
      <button class="spec-add-btn" onclick="confirmAddToCart()">
        加入购物车 ¥${totalPrice * userState.specQuantity}
      </button>
    </div>
  `;
}

function selectSpec(group, value) {
  userState.specSelections[group] = value;
  renderSpecModal(userState.specModalProduct);
}

function toggleTopping(name, price) {
  const toppings = userState.specSelections.toppings;
  const idx = toppings.indexOf(name);
  if (idx >= 0) {
    toppings.splice(idx, 1);
  } else {
    toppings.push(name);
  }
  renderSpecModal(userState.specModalProduct);
}

function changeSpecQty(delta) {
  userState.specQuantity = Math.max(1, Math.min(99, userState.specQuantity + delta));
  document.getElementById('spec-qty').textContent = userState.specQuantity;

  const totalPrice = calcSpecPrice(userState.specModalProduct) * userState.specQuantity;
  document.getElementById('spec-total').textContent = '¥' + totalPrice;
  document.querySelector('.spec-add-btn').textContent = `加入购物车 ¥${totalPrice}`;
}

function calcSpecPrice(product) {
  let price = product.price;
  if (userState.specSelections.toppings && product.specs && product.specs.toppings) {
    userState.specSelections.toppings.forEach(name => {
      const topping = product.specs.toppings.find(t => t.name === name);
      if (topping) price += topping.price;
    });
  }
  return price;
}

function confirmAddToCart() {
  const product = userState.specModalProduct;
  if (!product) return;

  const unitPrice = calcSpecPrice(product);
  const selectedToppings = userState.specSelections.toppings || [];
  const specsSummary = [
    userState.specSelections.cup,
    userState.specSelections.sugar,
    userState.specSelections.ice,
    selectedToppings.length > 0 ? selectedToppings.join(',') : ''
  ].filter(Boolean).join(' / ');

  const cartItem = {
    productId: product.id,
    name: product.name,
    image: product.image,
    unitPrice: unitPrice,
    quantity: userState.specQuantity,
    selectedSpecs: {
      cup: userState.specSelections.cup || '',
      sugar: userState.specSelections.sugar || '',
      ice: userState.specSelections.ice || '',
      toppings: selectedToppings.join(',')
    },
    specsSummary: specsSummary
  };

  addToCart(cartItem);
  closeSpecModal();
  showToast('已加入购物车');
  updateMenuFab();
}

// ============================================
// CART PAGE
// ============================================
function renderCartPage() {
  const app = document.getElementById('app');
  const cart = getCart();

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="page cart-page" id="page-cart">
        <div class="page-header">
          <div class="page-header-back" onclick="router.navigate('menu')">←</div>
          <div class="page-header-title">购物车</div>
          <div class="page-header-right"></div>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <div class="empty-state-title">购物车是空的</div>
          <div class="empty-state-desc">快去挑选喜欢的饮品吧</div>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="router.navigate('menu')">去点单</button>
        </div>
      </div>
      ${renderUserTabBar('cart')}
    `;
    return;
  }

  const cartItemsHTML = cart.map((item, index) => `
    <div class="cart-item animate-slide-up" style="animation-delay: ${index * 0.05}s">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="handleImageError(this, 'milk_tea')">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-specs">${item.specsSummary || '默认规格'}</div>
        <div class="cart-item-bottom">
          <div class="cart-item-price">¥${item.unitPrice * item.quantity}</div>
          <div class="quantity-controls">
            <button class="quantity-btn quantity-btn-minus" onclick="cartChangeQty(${index}, -1)">−</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn quantity-btn-plus" onclick="cartChangeQty(${index}, 1)">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item-delete" onclick="cartRemoveItem(${index})">✕</button>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const discount = userState.selectedCoupon ? calcCouponDiscount(userState.selectedCoupon, subtotal) : 0;
  const payAmount = Math.max(0, subtotal - discount);

  const couponLabel = userState.selectedCoupon
    ? `${userState.selectedCoupon.name} -¥${discount}`
    : '选择优惠券';

  app.innerHTML = `
    <div class="page cart-page" id="page-cart">
      <div class="page-header">
        <div class="page-header-back" onclick="router.navigate('menu')">←</div>
        <div class="page-header-title">购物车</div>
        <div class="page-header-right">
          <button class="btn-ghost" style="font-size: 12px; color: var(--color-danger);" onclick="cartClearAll()">清空</button>
        </div>
      </div>

      <div class="cart-items">
        ${cartItemsHTML}
      </div>

      <div class="cart-remark">
        <div class="cart-remark-label">备注</div>
        <input type="text" class="cart-remark-input" id="cart-remark" placeholder="请输入备注信息（如：少冰、不要吸管等）">
      </div>

      <div class="cart-coupon" onclick="openCouponSheet()">
        <div class="cart-coupon-left">
          <span class="cart-coupon-icon">🎫</span>
          <span class="cart-coupon-label">优惠券</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="cart-coupon-value">${couponLabel}</span>
          <span class="cart-coupon-arrow">›</span>
        </div>
      </div>

      <div class="cart-summary" id="cart-summary">
        <div class="cart-summary-row">
          <span>商品总价</span>
          <span>¥${subtotal.toFixed(2)}</span>
        </div>
        ${discount > 0 ? `
          <div class="cart-summary-row">
            <span>优惠</span>
            <span class="cart-summary-discount">-¥${discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="cart-summary-row total">
          <span>实付金额</span>
          <span class="price"><span class="price-symbol">¥</span>${payAmount.toFixed(2)}</span>
        </div>
        <button class="cart-submit-btn" onclick="submitOrder()">
          提交订单
        </button>
      </div>
    </div>

    <div class="coupon-sheet-overlay" id="coupon-overlay" onclick="closeCouponSheet()"></div>
    <div class="coupon-sheet" id="coupon-sheet">
      <div class="coupon-sheet-header">
        <span class="coupon-sheet-title">选择优惠券</span>
        <span class="coupon-sheet-close" onclick="closeCouponSheet()">✕</span>
      </div>
      <div class="coupon-list">
        <div class="coupon-item" onclick="selectCoupon(null)">
          <div class="coupon-item-amount" style="background: var(--color-bg); color: var(--color-text-tertiary);">
            <span class="value" style="font-size: 14px;">不使用</span>
          </div>
          <div class="coupon-item-info">
            <div class="coupon-item-name">不使用优惠券</div>
          </div>
          <div class="coupon-item-radio ${!userState.selectedCoupon ? 'selected' : ''}"></div>
        </div>
        ${coupons.map(c => `
          <div class="coupon-item" onclick="selectCoupon(${c.id})">
            <div class="coupon-item-amount">
              <span class="value">${c.discount}</span>
              <span class="unit">元</span>
            </div>
            <div class="coupon-item-info">
              <div class="coupon-item-name">${c.name}</div>
              <div class="coupon-item-condition">${c.condition}</div>
            </div>
            <div class="coupon-item-radio ${userState.selectedCoupon && userState.selectedCoupon.id === c.id ? 'selected' : ''}"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function cartChangeQty(index, delta) {
  const cart = getCart();
  const newQty = cart[index].quantity + delta;
  updateCartItemQty(index, newQty);
  renderCartPage();
}

function cartRemoveItem(index) {
  removeFromCart(index);
  renderCartPage();
}

function cartClearAll() {
  if (confirm('确定要清空购物车吗？')) {
    clearCart();
    renderCartPage();
  }
}

function openCouponSheet() {
  document.getElementById('coupon-overlay').classList.add('active');
  document.getElementById('coupon-sheet').classList.add('active');
}

function closeCouponSheet() {
  document.getElementById('coupon-overlay').classList.remove('active');
  document.getElementById('coupon-sheet').classList.remove('active');
}

function selectCoupon(couponId) {
  if (couponId === null) {
    userState.selectedCoupon = null;
  } else {
    userState.selectedCoupon = coupons.find(c => c.id === couponId);
  }
  closeCouponSheet();
  renderCartPage();
}

function calcCouponDiscount(coupon, total) {
  if (coupon.minAmount && total < coupon.minAmount) return 0;
  return Math.min(coupon.discount, total);
}

function submitOrder() {
  const cart = getCart();
  if (cart.length === 0) return;

  const subtotal = getCartTotal();
  const discount = userState.selectedCoupon ? calcCouponDiscount(userState.selectedCoupon, subtotal) : 0;
  const payAmount = Math.max(0, subtotal - discount);
  const remark = document.getElementById('cart-remark')?.value || '';

  const order = addOrder({
    items: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      selectedSpecs: item.selectedSpecs
    })),
    total: subtotal,
    couponDiscount: discount,
    payAmount: payAmount,
    remark: remark
  });

  clearCart();
  userState.selectedCoupon = null;

  // Navigate to success page with order info
  window._lastOrder = order;
  router.navigate('order-success');
}

// ============================================
// ORDER SUCCESS PAGE
// ============================================
function renderOrderSuccessPage() {
  const app = document.getElementById('app');
  const order = window._lastOrder;

  if (!order) {
    router.navigate('home');
    return;
  }

  const itemsSummary = order.items.map(item => `${item.name} x${item.quantity}`).join('、');

  app.innerHTML = `
    <div class="page order-success-page" id="page-order-success">
      <div class="success-checkmark">
        <svg viewBox="0 0 52 52">
          <circle class="circle" cx="26" cy="26" r="25" />
          <path class="check" d="M14 27l7 7 16-16" />
        </svg>
      </div>

      <div class="success-title">下单成功！</div>
      <div class="success-subtitle">请到店取餐，预计等待${order.estimatedTime}分钟</div>

      <div class="pickup-code-card">
        <div class="pickup-code-label">取餐码</div>
        <div class="pickup-code-value">${order.pickupCode}</div>
        <div class="pickup-code-time">预计 ${order.estimatedTime} 分钟后可取餐</div>
      </div>

      <div class="order-summary-card">
        <div class="order-summary-title">订单详情</div>
        ${order.items.map(item => `
          <div class="order-summary-item">
            <span>${item.name} x${item.quantity}</span>
            <span>¥${(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        ${order.couponDiscount > 0 ? `
          <div class="order-summary-item">
            <span>优惠券</span>
            <span style="color: var(--color-primary);">-¥${order.couponDiscount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="order-summary-total">
          <span>实付金额</span>
          <span class="price">¥${order.payAmount.toFixed(2)}</span>
        </div>
      </div>

      <button class="success-home-btn" onclick="router.navigate('home')">返回首页</button>
    </div>
  `;
}

// ============================================
// ORDER LIST PAGE
// ============================================
let userOrderFilter = 'all';

function renderOrderListPage() {
  const app = document.getElementById('app');
  const orders = getOrders();
  const filtered = getFilteredUserOrders(orders, userOrderFilter);

  app.innerHTML = `
    <div class="page order-list-page" id="page-orders">
      <div class="page-header">
        <div class="page-header-back" onclick="router.navigate('home')">←</div>
        <div class="page-header-title">我的订单</div>
        <div class="page-header-right"></div>
      </div>

      <div class="order-list-tabs">
        <div class="order-list-tab ${userOrderFilter === 'all' ? 'active' : ''}" onclick="setUserOrderFilter('all')">全部</div>
        <div class="order-list-tab ${userOrderFilter === 'pending' ? 'active' : ''}" onclick="setUserOrderFilter('pending')">待制作</div>
        <div class="order-list-tab ${userOrderFilter === 'completed' ? 'active' : ''}" onclick="setUserOrderFilter('completed')">已完成</div>
      </div>

      <div class="order-list-content" id="order-list-content">
        ${filtered.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <div class="empty-state-title">暂无订单</div>
            <div class="empty-state-desc">快去下第一单吧</div>
            <button class="btn btn-primary" style="margin-top: 16px;" onclick="router.navigate('menu')">去点单</button>
          </div>
        ` : filtered.map((order, idx) => `
          <div class="order-card animate-slide-up" style="animation-delay: ${idx * 0.05}s">
            <div class="order-card-header">
              <span class="order-card-id">${order.id}</span>
              <span class="order-card-status badge ${getStatusBadgeClass(order.status)}">${order.statusText}</span>
            </div>
            <div class="order-card-items">
              ${order.items.map(item => `
                <div class="order-card-item">
                  <span>${item.name}</span>
                  <span class="order-card-item-qty">x${item.quantity}</span>
                </div>
              `).join('')}
            </div>
            <div class="order-card-footer">
              <span class="order-card-time">${formatTime(order.createdAt)}</span>
              <span class="order-card-total">¥${order.payAmount.toFixed(2)}</span>
            </div>
            <div class="order-card-pickup">🎫 取餐码: ${order.pickupCode}</div>
          </div>
        `).join('')}
      </div>
    </div>

    ${renderUserTabBar('orders')}
  `;
}

function getFilteredUserOrders(orders, filter) {
  if (filter === 'all') return orders;
  if (filter === 'pending') return orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  return orders.filter(o => o.status === filter);
}

function setUserOrderFilter(filter) {
  userOrderFilter = filter;
  renderOrderListPage();
}

function getStatusBadgeClass(status) {
  const map = {
    pending: 'badge-warning',
    preparing: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger'
  };
  return map[status] || 'badge-primary';
}

// ============================================
// USER TAB BAR
// ============================================
function renderUserTabBar(active) {
  const cartCount = getCartCount();
  return `
    <div class="tab-bar">
      <div class="tab-bar-item ${active === 'home' ? 'active' : ''}" onclick="router.navigate('home')">
        <span class="tab-bar-item-icon">🏠</span>
        <span class="tab-bar-item-label">首页</span>
      </div>
      <div class="tab-bar-item ${active === 'menu' ? 'active' : ''}" onclick="router.navigate('menu')">
        <span class="tab-bar-item-icon">🍵</span>
        <span class="tab-bar-item-label">菜单</span>
      </div>
      <div class="tab-bar-item ${active === 'cart' ? 'active' : ''}" onclick="router.navigate('cart')">
        <span class="tab-bar-item-icon">🛒</span>
        <span class="tab-bar-item-label">购物车</span>
        ${cartCount > 0 ? `<span class="badge">${cartCount}</span>` : ''}
      </div>
      <div class="tab-bar-item ${active === 'orders' ? 'active' : ''}" onclick="router.navigate('orders')">
        <span class="tab-bar-item-icon">📋</span>
        <span class="tab-bar-item-label">订单</span>
      </div>
    </div>
  `;
}
