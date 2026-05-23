/* ============================================
   茶百味 Admin-side Application Logic
   ============================================ */

// ---- Admin State ----
let adminState = {
  currentTab: 'dashboard',
  orderFilter: 'all',
  refreshTimer: null
};

// ---- Toast (reuse from user.js) ----
if (typeof showToast !== 'function') {
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
}

// ---- Time Helper ----
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

// ---- Format Helpers ----
function formatOrderTime(isoString) {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// ============================================
// ADMIN LOGIN PAGE
// ============================================
function renderAdminLoginPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page admin-login-page" id="page-admin-login">
      <div class="admin-login-card animate-scale-in">
        <div class="admin-login-logo">🍵</div>
        <div class="admin-login-title">${shopInfo.name}</div>
        <div class="admin-login-subtitle">商家管理后台</div>

        <div class="admin-login-form">
          <input type="text" class="admin-login-input" id="admin-username" placeholder="请输入账号" value="admin">
          <input type="password" class="admin-login-input" id="admin-password" placeholder="请输入密码" value="123456">
          <button class="admin-login-btn" onclick="handleAdminLogin()">登 录</button>
        </div>

        <div class="admin-login-hint">
          测试账号: admin / 123456
        </div>
      </div>

      <div style="margin-top: 24px;">
        <a onclick="router.navigate('home')" style="color: var(--color-text-tertiary); font-size: 13px; cursor: pointer;">← 返回用户端</a>
      </div>
    </div>
  `;

  // Enter key to login
  document.getElementById('admin-password').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleAdminLogin();
  });
}

function handleAdminLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  if (!username || !password) {
    showToast('请输入账号和密码');
    return;
  }

  if (adminLogin(username, password)) {
    showToast('登录成功');
    router.navigate('admin/dashboard');
  } else {
    showToast('账号或密码错误');
  }
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function renderAdminDashboard() {
  if (!isAdminLoggedIn()) {
    router.navigate('admin/login');
    return;
  }

  const app = document.getElementById('app');
  const stats = getAdminStats();
  const orders = getOrders();
  const recentOrders = orders.slice(0, 10);

  app.innerHTML = `
    <div class="page admin-layout" id="page-admin-dashboard">
      ${renderAdminHeader()}

      <div class="admin-greeting">
        <div class="admin-greeting-text">${getGreeting()}，管理员</div>
        <div class="admin-greeting-sub">今日经营数据概览</div>
      </div>

      <div class="stat-cards stagger-children" id="stat-cards">
        <div class="stat-card">
          <div class="stat-card-icon orange">⏳</div>
          <div class="stat-card-value" id="stat-pending">${stats.pendingCount}</div>
          <div class="stat-card-label">待处理</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">💰</div>
          <div class="stat-card-value" id="stat-revenue">¥${stats.todayRevenue}</div>
          <div class="stat-card-label">今日营业额</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">✅</div>
          <div class="stat-card-value" id="stat-completed">${stats.completedCount}</div>
          <div class="stat-card-label">已完成</div>
        </div>
      </div>

      <div class="admin-section-title">
        <span>最新订单</span>
        <span class="admin-section-more" onclick="router.navigate('admin/orders')">查看全部 →</span>
      </div>

      <div class="order-feed" id="order-feed">
        ${recentOrders.length === 0 ? `
          <div class="empty-state" style="padding: 32px;">
            <div class="empty-state-icon" style="font-size: 40px;">📭</div>
            <div class="empty-state-title" style="font-size: 14px;">暂无订单</div>
          </div>
        ` : recentOrders.map(order => `
          <div class="order-feed-item" onclick="router.navigate('admin/orders')">
            <div class="order-feed-dot ${order.status}"></div>
            <div class="order-feed-info">
              <div class="order-feed-header">
                <span class="order-feed-code">${order.pickupCode}</span>
                <span class="order-feed-status ${getStatusColorClass(order.status)}">${order.statusText}</span>
              </div>
              <div class="order-feed-items">${order.items.map(i => i.name).join('、')}</div>
              <div class="order-feed-time">${formatOrderTime(order.createdAt)}</div>
            </div>
            <div class="order-feed-amount">¥${order.payAmount.toFixed(0)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    ${renderAdminTabBar('dashboard')}
  `;

  // Auto-refresh stats
  startAdminRefresh();
}

function getStatusColorClass(status) {
  const map = {
    pending: 'badge-warning',
    preparing: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger'
  };
  return map[status] || '';
}

function startAdminRefresh() {
  if (adminState.refreshTimer) clearInterval(adminState.refreshTimer);
  adminState.refreshTimer = setInterval(() => {
    updateAdminStats();
  }, 5000);
}

function updateAdminStats() {
  const stats = getAdminStats();
  const pendingEl = document.getElementById('stat-pending');
  const revenueEl = document.getElementById('stat-revenue');
  const completedEl = document.getElementById('stat-completed');

  if (pendingEl) pendingEl.textContent = stats.pendingCount;
  if (revenueEl) revenueEl.textContent = '¥' + stats.todayRevenue;
  if (completedEl) completedEl.textContent = stats.completedCount;

  // Animate pulse on change
  const feed = document.getElementById('order-feed');
  if (feed) {
    const firstItem = feed.querySelector('.order-feed-item');
    if (firstItem && Math.random() > 0.7) {
      firstItem.classList.add('pulse');
      setTimeout(() => firstItem.classList.remove('pulse'), 1000);
    }
  }
}

function stopAdminRefresh() {
  if (adminState.refreshTimer) {
    clearInterval(adminState.refreshTimer);
    adminState.refreshTimer = null;
  }
}

// ============================================
// ADMIN ORDER MANAGEMENT
// ============================================
function renderAdminOrdersPage() {
  if (!isAdminLoggedIn()) {
    router.navigate('admin/login');
    return;
  }

  const app = document.getElementById('app');
  const orders = getOrders();
  const filtered = filterAdminOrders(orders, adminState.orderFilter);

  // Count per status
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  app.innerHTML = `
    <div class="page admin-layout" id="page-admin-orders">
      ${renderAdminHeader()}

      <div class="admin-order-tabs" id="admin-order-tabs">
        <div class="admin-order-tab ${adminState.orderFilter === 'all' ? 'active' : ''}" onclick="filterAdminOrdersByStatus('all')">
          全部
        </div>
        <div class="admin-order-tab ${adminState.orderFilter === 'pending' ? 'active' : ''}" onclick="filterAdminOrdersByStatus('pending')">
          待接单${pendingCount > 0 ? `<span class="count">${pendingCount}</span>` : ''}
        </div>
        <div class="admin-order-tab ${adminState.orderFilter === 'preparing' ? 'active' : ''}" onclick="filterAdminOrdersByStatus('preparing')">
          制作中${preparingCount > 0 ? `<span class="count">${preparingCount}</span>` : ''}
        </div>
        <div class="admin-order-tab ${adminState.orderFilter === 'completed' ? 'active' : ''}" onclick="filterAdminOrdersByStatus('completed')">
          已完成
        </div>
      </div>

      <div class="admin-order-list" id="admin-order-list">
        ${filtered.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon" style="font-size: 48px;">📭</div>
            <div class="empty-state-title">暂无订单</div>
            <div class="empty-state-desc">当前筛选条件下没有订单</div>
          </div>
        ` : filtered.map((order, idx) => renderAdminOrderCard(order, idx)).join('')}
      </div>
    </div>

    ${renderAdminTabBar('orders')}
  `;
}

function renderAdminOrderCard(order, idx) {
  return `
    <div class="admin-order-card animate-slide-up" style="animation-delay: ${idx * 0.05}s">
      <div class="admin-order-card-header">
        <span class="admin-order-card-id">#${order.id.slice(-6)}</span>
        <span class="admin-order-card-status ${order.status}">${order.statusText}</span>
      </div>
      <div class="admin-order-card-items">
        ${order.items.map(item => `
          <div class="admin-order-card-item">
            <span>${item.name}</span>
            <span>x${item.quantity}</span>
          </div>
        `).join('')}
        ${order.remark ? `<div style="font-size: 12px; color: var(--color-text-tertiary); margin-top: 4px;">备注: ${order.remark}</div>` : ''}
      </div>
      <div class="admin-order-card-pickup">🎫 取餐码: ${order.pickupCode}</div>
      <div class="admin-order-card-footer">
        <span class="admin-order-card-time">${formatTime(order.createdAt)}</span>
        <div class="admin-order-card-actions">
          ${order.status === 'pending' ? `
            <button class="btn btn-primary btn-sm" onclick="acceptOrder('${order.id}')">接单</button>
          ` : ''}
          ${order.status === 'preparing' ? `
            <button class="btn btn-primary btn-sm" style="background: var(--color-success);" onclick="completeOrder('${order.id}')">完成</button>
          ` : ''}
          <span class="admin-order-card-total">¥${order.payAmount.toFixed(0)}</span>
        </div>
      </div>
    </div>
  `;
}

function filterAdminOrders(orders, filter) {
  if (filter === 'all') return orders;
  return orders.filter(o => o.status === filter);
}

function filterAdminOrdersByStatus(filter) {
  adminState.orderFilter = filter;
  renderAdminOrdersPage();
}

function acceptOrder(orderId) {
  updateOrderStatus(orderId, 'preparing');
  showToast('已接单');
  renderAdminOrdersPage();
}

function completeOrder(orderId) {
  updateOrderStatus(orderId, 'completed');
  showToast('订单已完成');
  renderAdminOrdersPage();
}

// ============================================
// ADMIN MENU MANAGEMENT
// ============================================
function renderAdminMenuPage() {
  if (!isAdminLoggedIn()) {
    router.navigate('admin/login');
    return;
  }

  const app = document.getElementById('app');

  const productsByCategory = categories.map(cat => ({
    ...cat,
    products: products.filter(p => p.category === cat.id)
  }));

  app.innerHTML = `
    <div class="page admin-layout" id="page-admin-menu">
      ${renderAdminHeader()}

      <div style="padding: var(--space-4);">
        <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold);">菜单管理</div>
        <div style="font-size: var(--font-size-sm); color: var(--color-text-tertiary); margin-top: 4px;">共 ${products.length} 个商品</div>
      </div>

      <div id="admin-menu-list">
        ${productsByCategory.map(cat => `
          <div class="admin-menu-category">
            <div class="admin-menu-category-title">
              <span>${cat.icon}</span> ${cat.name}
              <span style="font-size: 12px; font-weight: normal; color: var(--color-text-tertiary);">(${cat.products.length})</span>
            </div>
            ${cat.products.map(product => `
              <div class="admin-menu-item">
                <div class="admin-menu-item-image">
                  <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this, '${product.category}')">
                </div>
                <div class="admin-menu-item-info">
                  <div class="admin-menu-item-name">${product.name}</div>
                  <div class="admin-menu-item-meta">
                    <span class="admin-menu-item-price">¥${product.price}</span>
                    <span class="admin-menu-item-sales">月售${product.sales}</span>
                  </div>
                </div>
                <div class="switch ${isProductAvailable(product.id) ? 'active' : ''}"
                     onclick="handleToggleProduct(${product.id}, this)"></div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>

    ${renderAdminTabBar('menu')}
  `;
}

function handleToggleProduct(productId, switchEl) {
  toggleProductAvailability(productId);
  const isAvail = isProductAvailable(productId);
  switchEl.classList.toggle('active', isAvail);
  showToast(isAvail ? '已上架' : '已下架');
}

// ============================================
// ADMIN DATA STATS
// ============================================
function renderAdminStatsPage() {
  if (!isAdminLoggedIn()) {
    router.navigate('admin/login');
    return;
  }

  const app = document.getElementById('app');
  const stats = getAdminStats();

  // Top selling products
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const maxSales = topProducts[0]?.sales || 1;

  app.innerHTML = `
    <div class="page admin-layout" id="page-admin-stats">
      ${renderAdminHeader()}

      <div style="padding: var(--space-4);">
        <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold);">数据统计</div>
      </div>

      <div class="admin-stats-cards stagger-children">
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">今日营业额</div>
          <div class="admin-stat-card-value">¥${stats.todayRevenue}</div>
          <div class="admin-stat-card-trend up">↑ 12%</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">本周营业额</div>
          <div class="admin-stat-card-value">¥${stats.weekRevenue}</div>
          <div class="admin-stat-card-trend up">↑ 8%</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">本月营业额</div>
          <div class="admin-stat-card-value">¥${stats.monthRevenue}</div>
          <div class="admin-stat-card-trend down">↓ 3%</div>
        </div>
      </div>

      <div class="admin-stats-cards stagger-children" style="margin-bottom: 24px;">
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">总订单数</div>
          <div class="admin-stat-card-value">${stats.totalOrders}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">今日完成</div>
          <div class="admin-stat-card-value">${stats.completedCount}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card-label">待处理</div>
          <div class="admin-stat-card-value">${stats.pendingCount}</div>
        </div>
      </div>

      <div class="admin-chart-section">
        <div class="admin-chart-card">
          <div class="admin-chart-title">🏆 热销商品 TOP 5</div>
          <div class="admin-chart-bars">
            ${topProducts.map((p, i) => `
              <div class="admin-chart-bar-row">
                <span class="admin-chart-bar-label">${p.name}</span>
                <div class="admin-chart-bar-track">
                  <div class="admin-chart-bar-fill" style="width: ${(p.sales / maxSales * 100)}%;">
                    <span class="admin-chart-bar-value">${p.sales}杯</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="admin-chart-section">
        <div class="admin-chart-card">
          <div class="admin-chart-title">📊 分类销售占比</div>
          <div class="admin-chart-bars">
            ${categories.map(cat => {
              const catSales = products.filter(p => p.category === cat.id).reduce((s, p) => s + p.sales, 0);
              const totalSales = products.reduce((s, p) => s + p.sales, 0);
              return `
                <div class="admin-chart-bar-row">
                  <span class="admin-chart-bar-label">${cat.icon} ${cat.name}</span>
                  <div class="admin-chart-bar-track">
                    <div class="admin-chart-bar-fill" style="width: ${(catSales / totalSales * 100)}%; background: linear-gradient(90deg, var(--color-primary), ${catSales / totalSales > 0.3 ? '#FF8F66' : '#FFB088'});">
                      <span class="admin-chart-bar-value">${catSales}杯</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    ${renderAdminTabBar('stats')}
  `;
}

// ============================================
// ADMIN HEADER & TAB BAR
// ============================================
function renderAdminHeader() {
  return `
    <div class="admin-header">
      <div class="admin-header-left">
        <div class="admin-header-logo">🍵</div>
        <div class="admin-header-title">${shopInfo.name}</div>
      </div>
      <div class="admin-header-right">
        <a class="admin-switch-link" onclick="router.navigate('home')">切换到用户端</a>
      </div>
    </div>
  `;
}

function renderAdminTabBar(active) {
  return `
    <div class="admin-tab-bar">
      <div class="admin-tab-item ${active === 'dashboard' ? 'active' : ''}" onclick="router.navigate('admin/dashboard')">
        <span class="admin-tab-item-icon">📊</span>
        <span class="admin-tab-item-label">工作台</span>
      </div>
      <div class="admin-tab-item ${active === 'orders' ? 'active' : ''}" onclick="router.navigate('admin/orders')" style="position: relative;">
        <span class="admin-tab-item-icon">📋</span>
        <span class="admin-tab-item-label">订单</span>
        ${getOrders().filter(o => o.status === 'pending').length > 0 ?
          `<span class="badge" style="position: absolute; top: 2px; right: 50%; margin-right: -16px;">${getOrders().filter(o => o.status === 'pending').length}</span>` : ''}
      </div>
      <div class="admin-tab-item ${active === 'menu' ? 'active' : ''}" onclick="router.navigate('admin/menu')">
        <span class="admin-tab-item-icon">🍵</span>
        <span class="admin-tab-item-label">菜单</span>
      </div>
      <div class="admin-tab-item ${active === 'stats' ? 'active' : ''}" onclick="router.navigate('admin/stats')">
        <span class="admin-tab-item-icon">📈</span>
        <span class="admin-tab-item-label">统计</span>
      </div>
    </div>
  `;
}
