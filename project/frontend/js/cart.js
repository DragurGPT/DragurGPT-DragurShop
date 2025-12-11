// Cart utilities backed by localStorage
const CART_KEY = 'neo-wear-cart';

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Cart parse error', e);
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
};

const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity,
    });
  }
  saveCart(cart);
};

const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

const updateQuantity = (id, quantity) => {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  saveCart(cart);
};

const getCartCount = () => getCart().reduce((sum, item) => sum + item.quantity, 0);

const getCartTotal = () =>
  getCart().reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

const updateCartBadge = () => {
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = getCartCount();
  }
};

// expose functions
window.cartUtils = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartCount,
  getCartTotal,
  updateCartBadge,
};
