// Shop page logic
let productsCache = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  setupFilters();
});

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  try {
    const res = await fetch('/api/products');
    const json = await res.json();
    productsCache = json.data;
    renderProducts(productsCache);
    populateCategories(productsCache);
  } catch (error) {
    console.error('Product loading failed', error);
    grid.innerHTML = '<p>Produkte konnten nicht geladen werden.</p>';
  }
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = list
    .map(
      (p) => `
        <article class="card product-card fade-element">
          <img src="${p.image}" alt="${p.name}">
          <div class="category-tags" style="margin:0.75rem 0;">
            <span class="badge">${p.category}</span>
            <span class="badge">${p.price}€</span>
          </div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="hero-actions" style="margin-top:0.75rem;">
            <a class="cta-btn" href="/product.html?id=${p.id}">View</a>
            <button class="cta-btn" style="background:transparent;color:#2d2d2d;border:1px solid var(--silver);" onclick='quickAdd(${JSON.stringify(p)})'>Add</button>
          </div>
        </article>
      `
    )
    .join('');
  cartUtils.updateCartBadge();
  initFadeIns();
}

function populateCategories(products) {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const price = priceFilter.value;

    const filtered = productsCache.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm);

      const matchesCategory = cat === 'all' || p.category === cat;
      const matchesPrice =
        price === 'all' ||
        (price === 'low' && p.price < 100) ||
        (price === 'mid' && p.price >= 100 && p.price <= 150) ||
        (price === 'high' && p.price > 150);

      return matchesSearch && matchesCategory && matchesPrice;
    });
    renderProducts(filtered);
  };

  [searchInput, categoryFilter, priceFilter].forEach((el) => el.addEventListener('input', applyFilters));
}

function quickAdd(product) {
  cartUtils.addToCart(product, 1);
  const badge = document.getElementById('cartBadge');
  badge.classList.add('visible');
  setTimeout(() => badge.classList.remove('visible'), 700);
}
