async function renderHighlights() {
  const grid = document.getElementById('highlightGrid');
  try {
    const products = await window.NeoAPI.fetchProducts();
    const highlights = products.slice(0, 4);
    grid.innerHTML = highlights
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
      btn.addEventListener('click', async (e) => {
        const productId = Number(e.currentTarget.dataset.id);
        const product = products.find((item) => item.id === productId);
        window.NeoCart.addToCart(product, 1);
      });
    });
    window.NeoUtil.observeNewFadeIns();
  } catch (err) {
    grid.innerHTML = '<p>Unable to load highlights.</p>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', renderHighlights);
