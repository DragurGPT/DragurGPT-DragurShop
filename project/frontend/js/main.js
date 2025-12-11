// Shared UI interactions
const API_URL = '/api/products';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFadeIns();
  initParallax();
  loadHighlights();
  cartUtils.updateCartBadge();
  attachBadgeClick();
});

function initNav() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger?.addEventListener('click', () => navLinks?.classList.toggle('show'));
}

function attachBadgeClick() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => window.location.href = '/checkout.html');
  }
}

function initFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.fade-element').forEach((el) => observer.observe(el));
}

function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.1;
    hero.style.setProperty('--parallax', `${offset}px`);
  });
}

async function loadHighlights() {
  const grid = document.getElementById('highlightGrid');
  if (!grid) return;
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const products = json.data.slice(0, 4);
    grid.innerHTML = products
      .map(
        (p) => `
        <article class="card fade-element">
          <img src="${p.image}" alt="${p.name}">
          <div class="category-tags" style="margin:0.75rem 0;">
            <span class="badge">${p.category}</span>
            <span class="badge">${p.price}€</span>
          </div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <a class="cta-btn" href="/product.html?id=${p.id}" style="display:inline-block;margin-top:0.75rem;">View</a>
        </article>
      `
      )
      .join('');
    initFadeIns();
  } catch (error) {
    console.error('Highlight load failed', error);
    grid.innerHTML = '<p>Produkte konnten nicht geladen werden.</p>';
  }
}
