let allProducts = [];

function matchesFilters(product, searchTerm, category, price) {
  const matchSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
  const matchCategory = category === 'all' || product.category === category;
  const matchPrice =
    price === 'all' ||
    (price === 'low' && product.price < 100) ||
    (price === 'mid' && product.price >= 100 && product.price <= 180) ||
    (price === 'high' && product.price > 180);
  return matchSearch && matchCategory && matchPrice;
}

function renderProducts() {
  const grid = document.getElementById('shopGrid');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const price = document.getElementById('priceFilter').value;

  const filtered = allProducts.filter((p) => matchesFilters(p, searchTerm, category, price));
  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="card fade-in">
        <img src="${p.image}" alt="${p.name}" />
        <div class="badge">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="btn-group">
          <a class="btn" href="product.html?id=${p.id}">View</a>
          <button class="btn primary" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `
    )
    .join('');

  grid.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const productId = Number(e.currentTarget.dataset.id);
      const product = allProducts.find((item) => item.id === productId);
      window.NeoCart.addToCart(product, 1);
    });
  });

  window.NeoUtil.observeNewFadeIns();
}

async function initShop() {
  try {
    allProducts = await window.NeoAPI.fetchProducts();
    renderProducts();
  } catch (error) {
    document.getElementById('shopGrid').innerHTML = '<p>Unable to load products.</p>';
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  ['searchInput', 'categoryFilter', 'priceFilter'].forEach((id) => {
    document.getElementById(id).addEventListener('input', renderProducts);
  });
  initShop();
});
