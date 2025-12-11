const API_BASE = 'http://localhost:4000/api';

// Cart helpers
function getCart() {
  return JSON.parse(localStorage.getItem('neoCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('neoCart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  microBounce('cartBadge');
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

function updateQuantity(id, quantity) {
  const cart = getCart().map((item) => (item.id === id ? { ...item, quantity } : item));
  saveCart(cart);
}

function calculateTotals() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return { total, count };
}

function updateCartBadge() {
  const { count } = calculateTotals();
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
}

// UI helpers
function setupNav() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

function microBounce(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transform = 'translateY(-2px) scale(1.02)';
  setTimeout(() => (el.style.transform = ''), 180);
}

let fadeObserver;

function setupFadeInObserver() {
  fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));
}

function observeNewFadeIns() {
  if (!fadeObserver) return;
  document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => fadeObserver.observe(el));
}

function attachCartBadgeClick() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
}

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const json = await res.json();
  return json.data;
}

async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  const json = await res.json();
  return json.data;
}

function parseQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setupParallax() {
  const target = document.getElementById('heroParallax');
  if (!target) return;
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    target.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Initialize shared behaviors
window.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupFadeInObserver();
  updateCartBadge();
  attachCartBadgeClick();
  setupParallax();
});

// Expose helpers
window.NeoCart = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateTotals,
};

window.NeoAPI = {
  fetchProducts,
  fetchProduct,
};

window.NeoUtil = {
  parseQueryParams,
  observeNewFadeIns,
};
