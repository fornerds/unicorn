export const ROUTES = {
  HOME: '/',

  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,

  // News
  NEWS: '/news',
  NEWS_DETAIL: (id: string | number) => `/news/${id}`,

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  SNS_LOGIN: '/login/sns',

  // Purchase
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_COMPLETE: '/checkout/complete',

  // My Page
  MY_PAGE: '/my',
  MY_LIKES: '/my/likes',
  MY_ORDERS: '/my/orders',
  MY_PROFILE: '/my/profile',

  // Company
  ABOUT: '/about',

  // AI Chat (state-based, main page)
  AI_CHAT: {
    OPEN: '/?ai=open',
    WITH_QUERY: (query: string) =>
      `/?ai=open&q=${encodeURIComponent(query)}`,
  },
} as const;
