/* ============================================
   茶百味 SPA Router
   ============================================ */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.onRouteChange = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  getCurrentRoute() {
    return window.location.hash.slice(1) || 'home';
  }

  handleRoute() {
    const route = this.getCurrentRoute();

    if (this.currentRoute === route) return;

    const prevRoute = this.currentRoute;
    this.currentRoute = route;

    // Find matching route handler
    const handler = this.routes[route];
    if (handler) {
      // Determine transition direction
      const direction = this.getTransitionDirection(prevRoute, route);
      handler(route, prevRoute, direction);
    }

    if (this.onRouteChange) {
      this.onRouteChange(route, prevRoute);
    }
  }

  getTransitionDirection(from, to) {
    if (!from) return 'none';

    const userRoutes = ['home', 'menu', 'cart', 'order-success', 'orders'];
    const adminRoutes = ['admin/login', 'admin/dashboard', 'admin/orders', 'admin/menu', 'admin/stats'];

    const fromIsUser = userRoutes.includes(from);
    const toIsUser = userRoutes.includes(to);
    const fromIsAdmin = adminRoutes.includes(from);
    const toIsAdmin = adminRoutes.includes(to);

    // Switching between user/admin
    if ((fromIsUser && toIsAdmin) || (fromIsAdmin && toIsUser)) return 'none';

    const routeOrder = {
      'home': 0,
      'menu': 1,
      'cart': 2,
      'order-success': 3,
      'orders': 4,
      'admin/login': 10,
      'admin/dashboard': 11,
      'admin/orders': 12,
      'admin/menu': 13,
      'admin/stats': 14
    };

    const fromIdx = routeOrder[from] || 0;
    const toIdx = routeOrder[to] || 0;

    return toIdx > fromIdx ? 'left' : 'right';
  }
}

// Initialize router
const router = new Router();
