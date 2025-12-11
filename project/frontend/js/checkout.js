function renderCart() {
  const list = document.getElementById('cartList');
  const { total } = window.NeoCart.calculateTotals();
  document.getElementById('cartTotal').textContent = total.toFixed(2);
  const cart = window.NeoCart.getCart();

  if (!cart.length) {
    list.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item fade-in">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <div class="badge">${item.category}</div>
          <h3>${item.name}</h3>
          <div class="price">$${item.price.toFixed(2)}</div>
          ${item.size ? `<small>Size: ${item.size}</small>` : ''}
        </div>
        <div>
          <input class="qty-input" type="number" min="1" value="${item.quantity}" data-id="${item.id}" />
          <button class="btn" data-remove="${item.id}" style="margin-top: 8px;">Remove</button>
        </div>
      </div>
    `
    )
    .join('');

  list.querySelectorAll('input.qty-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id);
      const qty = Math.max(1, Number(e.target.value));
      window.NeoCart.updateQuantity(id, qty);
      renderCart();
    });
  });

  list.querySelectorAll('button[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.remove);
      window.NeoCart.removeFromCart(id);
      renderCart();
    });
  });
}

async function sendOrder() {
  const cart = window.NeoCart.getCart();
  const { total } = window.NeoCart.calculateTotals();
  const message = document.getElementById('checkoutMessage');
  message.textContent = '';

  const customer = {
    name: document.getElementById('customerName').value.trim(),
    email: document.getElementById('customerEmail').value.trim(),
    address: document.getElementById('customerAddress').value.trim(),
  };

  if (!customer.name || !customer.email || !customer.address) {
    message.textContent = 'Please fill out customer information.';
    return;
  }
  if (!cart.length) {
    message.textContent = 'Your cart is empty.';
    return;
  }

  try {
    const res = await fetch('http://localhost:4000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, items: cart, total }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Checkout failed');
    message.textContent = `Success! Order ID: ${json.orderId}`;
    localStorage.removeItem('neoCart');
    renderCart();
    updateCartBadge();
  } catch (error) {
    message.textContent = error.message;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('buyNow').addEventListener('click', sendOrder);
});
