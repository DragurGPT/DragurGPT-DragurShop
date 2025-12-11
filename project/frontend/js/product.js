function renderProduct(product) {
  const container = document.getElementById('productDetail');
  container.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.name}" style="border-radius: 16px; background: #f5f5f5;" />
    </div>
    <div>
      <div class="badge">${product.category}</div>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p><strong>Material:</strong> ${product.material}</p>
      <div class="price">$${product.price.toFixed(2)}</div>
      <div class="size-options" id="sizeOptions">
        ${['XS', 'S', 'M', 'L', 'XL'].map((size) => `<span class="size-chip" data-size="${size}">${size}</span>`).join('')}
      </div>
      <div class="btn-group" style="margin-top: 18px;">
        <button class="btn primary" id="addToCartBtn">Add to Cart</button>
        <a class="btn" href="shop.html">Back to Shop</a>
      </div>
    </div>
  `;

  const sizeChips = container.querySelectorAll('.size-chip');
  let selectedSize = 'M';
  sizeChips.forEach((chip) => {
    if (chip.dataset.size === selectedSize) chip.classList.add('active');
    chip.addEventListener('click', () => {
      selectedSize = chip.dataset.size;
      sizeChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  const addBtn = document.getElementById('addToCartBtn');
  addBtn.addEventListener('click', () => {
    window.NeoCart.addToCart({ ...product, size: selectedSize }, 1);
    addBtn.textContent = 'Added!';
    setTimeout(() => (addBtn.textContent = 'Add to Cart'), 1200);
  });
}

async function initProduct() {
  const { id } = window.NeoUtil.parseQueryParams();
  if (!id) return;
  try {
    const product = await window.NeoAPI.fetchProduct(id);
    renderProduct(product);
  } catch (error) {
    document.getElementById('productDetail').innerHTML = '<p>Product not found.</p>';
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', initProduct);
