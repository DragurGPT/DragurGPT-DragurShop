// Product detail page logic
const queryParams = new URLSearchParams(window.location.search);
const productId = queryParams.get('id');

window.addEventListener('DOMContentLoaded', async () => {
  if (!productId) return;
  await loadProduct(productId);
});

async function loadProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error('Not found');
    const product = json.data;
    renderProduct(product);
  } catch (error) {
    console.error('Product load error', error);
    document.querySelector('main').innerHTML = '<p>Produkt konnte nicht geladen werden.</p>';
  }
}

function renderProduct(p) {
  document.getElementById('productImage').src = p.image;
  document.getElementById('productImage').alt = p.name;
  document.getElementById('productCategory').textContent = p.category;
  document.getElementById('productName').textContent = p.name;
  document.getElementById('productDescription').textContent = p.description;
  document.getElementById('productPrice').textContent = `${p.price}€`;

  const button = document.getElementById('addToCartBtn');
  button.addEventListener('click', () => {
    cartUtils.addToCart(p, 1);
    animateAdd();
  });
}

function animateAdd() {
  const feedback = document.getElementById('addFeedback');
  feedback.style.opacity = 1;
  setTimeout(() => (feedback.style.opacity = 0), 900);
  cartUtils.updateCartBadge();
}
