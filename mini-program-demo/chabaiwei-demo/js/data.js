/* ============================================
   茶百味 Mock Data & Storage Management
   ============================================ */

// Shop info
const shopInfo = {
  name: '茶百味',
  tagline: '新鲜现做 · 好茶不将就',
  rating: 4.8,
  monthlySales: 2368,
  businessHours: '09:00-22:00',
  address: '万达广场B1层B1088',
  phone: '021-88886666',
  notice: '新用户首单立减5元 | 满25元免排队',
  logo: '🍵'
};

// Categories
const categories = [
  { id: 'milk_tea', name: '奶茶', icon: '🧋' },
  { id: 'fruit_tea', name: '果茶', icon: '🍋' },
  { id: 'seasonal', name: '季节限定', icon: '🌸' },
  { id: 'snacks', name: '小食', icon: '🍰' }
];

// Products
const products = [
  // ---- 奶茶 ----
  {
    id: 1,
    name: '经典珍珠奶茶',
    price: 16,
    image: 'images/milktea1.jpg',
    category: 'milk_tea',
    sales: 856,
    desc: '醇香奶茶搭配Q弹珍珠',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖', '多糖'],
      ice: ['去冰', '少冰', '正常冰', '多冰'],
      toppings: [
        { name: '珍珠', price: 2 },
        { name: '椰果', price: 3 },
        { name: '布丁', price: 3 },
        { name: '红豆', price: 2 }
      ]
    }
  },
  {
    id: 2,
    name: '椰椰拿铁',
    price: 18,
    image: 'images/milktea2.jpg',
    category: 'milk_tea',
    sales: 623,
    desc: '浓郁椰浆与香醇拿铁的完美邂逅',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['去冰', '少冰', '正常冰'],
      toppings: [
        { name: '珍珠', price: 2 },
        { name: '椰果', price: 3 },
        { name: '芋圆', price: 3 }
      ]
    }
  },
  {
    id: 3,
    name: '黑糖鹿丸鲜奶',
    price: 20,
    image: 'images/milktea3.jpg',
    category: 'milk_tea',
    sales: 512,
    desc: '手炒黑糖搭配Q弹鹿丸与鲜奶',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['去冰', '少冰', '正常冰'],
      toppings: [
        { name: '珍珠', price: 2 },
        { name: '布丁', price: 3 },
        { name: '红豆', price: 2 }
      ]
    }
  },
  {
    id: 4,
    name: '茉莉奶绿',
    price: 15,
    image: 'images/milktea4.jpg',
    category: 'milk_tea',
    sales: 445,
    desc: '清新茉莉花茶底，搭配醇厚奶香',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖', '多糖'],
      ice: ['去冰', '少冰', '正常冰', '多冰'],
      toppings: [
        { name: '珍珠', price: 2 },
        { name: '椰果', price: 3 }
      ]
    }
  },

  // ---- 果茶 ----
  {
    id: 5,
    name: '百香果益菌多',
    price: 17,
    image: 'images/fruitea1.jpg',
    category: 'fruit_tea',
    sales: 398,
    desc: '新鲜百香果搭配活性益生菌',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['少冰', '正常冰', '多冰'],
      toppings: [
        { name: '椰果', price: 3 },
        { name: '芦荟', price: 3 }
      ]
    }
  },
  {
    id: 6,
    name: '满杯橙橙',
    price: 19,
    image: 'images/fruitea2.jpg',
    category: 'fruit_tea',
    sales: 367,
    desc: '整颗鲜橙搭配四季春茶底',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['少冰', '正常冰', '多冰'],
      toppings: [
        { name: '椰果', price: 3 },
        { name: '芦荟', price: 3 }
      ]
    }
  },
  {
    id: 7,
    name: '杨枝甘露',
    price: 22,
    image: 'images/fruitea3.jpg',
    category: 'fruit_tea',
    sales: 289,
    desc: '芒果、西柚与椰浆的经典组合',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['少冰', '正常冰'],
      toppings: [
        { name: '西米', price: 3 },
        { name: '椰果', price: 3 }
      ]
    }
  },
  {
    id: 8,
    name: '柠檬绿茶',
    price: 14,
    image: 'images/fruitea1.jpg',
    category: 'fruit_tea',
    sales: 534,
    desc: '新鲜柠檬搭配清爽绿茶',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖', '多糖'],
      ice: ['少冰', '正常冰', '多冰'],
      toppings: []
    }
  },

  // ---- 季节限定 ----
  {
    id: 9,
    name: '春日樱花拿铁',
    price: 24,
    image: 'images/milktea5.jpg',
    category: 'seasonal',
    sales: 198,
    desc: '限定樱花风味，春季浪漫特调',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['去冰', '少冰', '正常冰'],
      toppings: [
        { name: '布丁', price: 3 },
        { name: '芋圆', price: 3 }
      ]
    }
  },
  {
    id: 10,
    name: '蜜桃乌龙冰',
    price: 21,
    image: 'images/milktea6.jpg',
    category: 'seasonal',
    sales: 156,
    desc: '水蜜桃果肉搭配清香乌龙',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['少冰', '正常冰', '多冰'],
      toppings: [
        { name: '椰果', price: 3 },
        { name: '芦荟', price: 3 }
      ]
    }
  },
  {
    id: 11,
    name: '桂花酒酿奶茶',
    price: 19,
    image: 'images/milktea1.jpg',
    category: 'seasonal',
    sales: 142,
    desc: '传统酒酿搭配桂花香气',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['去冰', '少冰', '正常冰'],
      toppings: [
        { name: '珍珠', price: 2 },
        { name: '红豆', price: 2 }
      ]
    }
  },
  {
    id: 12,
    name: '青提茉莉冰',
    price: 22,
    image: 'images/fruitea2.jpg',
    category: 'seasonal',
    sales: 178,
    desc: '阳光青提搭配茉莉绿茶底',
    specs: {
      cup: ['中杯', '大杯'],
      sugar: ['少糖', '半糖', '正常糖'],
      ice: ['少冰', '正常冰', '多冰'],
      toppings: [
        { name: '椰果', price: 3 },
        { name: '芦荟', price: 3 }
      ]
    }
  },

  // ---- 小食 ----
  {
    id: 13,
    name: '芝士蛋糕',
    price: 12,
    image: 'images/snack1.jpg',
    category: 'snacks',
    sales: 234,
    desc: '浓郁芝士味，入口即化',
    specs: {}
  },
  {
    id: 14,
    name: '抹茶千层',
    price: 15,
    image: 'images/snack2.jpg',
    category: 'snacks',
    sales: 189,
    desc: '手工制作，层层抹茶香',
    specs: {}
  },
  {
    id: 15,
    name: '草莓大福',
    price: 10,
    image: 'images/snack3.jpg',
    category: 'snacks',
    sales: 312,
    desc: '新鲜草莓搭配软糯糯米皮',
    specs: {}
  },
  {
    id: 16,
    name: '椰蓉麻薯',
    price: 8,
    image: 'images/snack1.jpg',
    category: 'snacks',
    sales: 267,
    desc: '软糯Q弹，椰香四溢',
    specs: {}
  }
];

// Coupons
const coupons = [
  { id: 1, name: '新用户券', condition: '无门槛', discount: 5, expired: false },
  { id: 2, name: '满减券', condition: '满25减3', discount: 3, minAmount: 25, expired: false },
  { id: 3, name: '周末券', condition: '满30减5', discount: 5, minAmount: 30, expired: false }
];

// ---- Order Management ----
function getOrders() {
  return JSON.parse(localStorage.getItem('chabaiwei_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('chabaiwei_orders', JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('ordersUpdated'));
}

function generatePickupCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return letter + num;
}

function addOrder(orderData) {
  const orders = getOrders();
  const order = {
    id: 'ORD' + Date.now(),
    pickupCode: generatePickupCode(),
    items: orderData.items,
    total: orderData.total,
    couponDiscount: orderData.couponDiscount || 0,
    payAmount: orderData.payAmount,
    remark: orderData.remark || '',
    status: 'pending',
    statusText: '待接单',
    createdAt: new Date().toISOString(),
    estimatedTime: Math.floor(Math.random() * 5) + 8
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    const statusMap = {
      pending: '待接单',
      preparing: '制作中',
      completed: '已完成',
      cancelled: '已取消'
    };
    order.statusText = statusMap[status] || status;
    saveOrders(orders);
  }
}

// ---- Cart Management ----
function getCart() {
  return JSON.parse(localStorage.getItem('chabaiwei_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('chabaiwei_cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function addToCart(item) {
  const cart = getCart();
  // Try to find same item with same specs
  const existingIndex = cart.findIndex(c =>
    c.productId === item.productId &&
    JSON.stringify(c.selectedSpecs) === JSON.stringify(item.selectedSpecs)
  );
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartItemQty(index, qty) {
  const cart = getCart();
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = qty;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ---- Admin Stats ----
function getAdminStats() {
  const orders = getOrders();
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);

  return {
    pendingCount: orders.filter(o => o.status === 'pending').length,
    todayRevenue: todayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.payAmount, 0),
    completedCount: todayOrders.filter(o => o.status === 'completed').length,
    totalOrders: orders.length,
    weekRevenue: orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.payAmount : 0), 0),
    monthRevenue: orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.payAmount : 0), 0)
  };
}

// ---- Admin Auth ----
function isAdminLoggedIn() {
  return sessionStorage.getItem('chabaiwei_admin_auth') === 'true';
}

function adminLogin(username, password) {
  if (username === 'admin' && password === '123456') {
    sessionStorage.setItem('chabaiwei_admin_auth', 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem('chabaiwei_admin_auth');
}

// ---- Product availability ----
function getProductAvailability() {
  return JSON.parse(localStorage.getItem('chabaiwei_product_availability') || '{}');
}

function toggleProductAvailability(productId) {
  const avail = getProductAvailability();
  avail[productId] = !avail[productId];
  localStorage.setItem('chabaiwei_product_availability', JSON.stringify(avail));
}

function isProductAvailable(productId) {
  const avail = getProductAvailability();
  return avail[productId] !== false; // default: available
}

// ---- Initialize demo data ----
function initDemoData() {
  if (getOrders().length === 0) {
    const demoOrders = [
      {
        id: 'ORD1716400001',
        pickupCode: 'A008',
        items: [
          { productId: 1, name: '经典珍珠奶茶', image: 'images/milktea1.jpg', unitPrice: 20, quantity: 2, selectedSpecs: { cup: '大杯', sugar: '半糖', ice: '正常冰', toppings: '珍珠,椰果' } },
          { productId: 13, name: '芝士蛋糕', image: 'images/snack1.jpg', unitPrice: 12, quantity: 1, selectedSpecs: {} }
        ],
        total: 52,
        couponDiscount: 3,
        payAmount: 49,
        remark: '少放冰',
        status: 'completed',
        statusText: '已完成',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        estimatedTime: 10
      },
      {
        id: 'ORD1716400002',
        pickupCode: 'B015',
        items: [
          { productId: 5, name: '百香果益菌多', image: 'images/fruitea1.jpg', unitPrice: 20, quantity: 1, selectedSpecs: { cup: '大杯', sugar: '少糖', ice: '正常冰', toppings: '椰果' } }
        ],
        total: 20,
        couponDiscount: 0,
        payAmount: 20,
        remark: '',
        status: 'preparing',
        statusText: '制作中',
        createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        estimatedTime: 10
      },
      {
        id: 'ORD1716400003',
        pickupCode: 'C032',
        items: [
          { productId: 9, name: '春日樱花拿铁', image: 'images/milktea5.jpg', unitPrice: 24, quantity: 1, selectedSpecs: { cup: '中杯', sugar: '正常糖', ice: '去冰', toppings: '' } },
          { productId: 15, name: '草莓大福', image: 'images/snack3.jpg', unitPrice: 10, quantity: 2, selectedSpecs: {} }
        ],
        total: 44,
        couponDiscount: 5,
        payAmount: 39,
        remark: '草莓大福单独装袋',
        status: 'pending',
        statusText: '待接单',
        createdAt: new Date(Date.now() - 3600000 * 0.1).toISOString(),
        estimatedTime: 10
      }
    ];
    saveOrders(demoOrders);
  }
}

initDemoData();
