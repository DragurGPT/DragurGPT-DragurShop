// Checkout flow
window.addEventListener('DOMContentLoaded', () => {
  renderCartTable();
  document.getElementById('buyNowBtn').addEventListener('click', submitOrder);
});

function renderCartTable() {
  const tbody = document.querySelector('#cartTable tbody');
  const items = cartUtils.getCart();
  tbody.innerHTML = items
    .map(
      (item) => `
      <tr>
        <td>
          <strong>${item.name}</strong>
          <p style="margin:0; color:#666;">${item.category}</p>
        </td>
        <td>
          <div class="quantity-control">
            <button onclick="changeQty('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </td>
        <td>${(item.price * item.quantity).toFixed(2)}€</td>
        <td><button class="cta-btn" style="padding:0.4rem 0.9rem;" onclick="removeItem('${item.id}')">Remove</button></td>
      </tr>
    `
    )
    .join('');
  document.getElementById('totalAmount').textContent = `${cartUtils.getCartTotal()}€`;
  cartUtils.updateCartBadge();
}

function changeQty(id, delta) {
  const items = cartUtils.getCart();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  const newQty = Math.max(1, item.quantity + delta);
  cartUtils.updateQuantity(id, newQty);
  renderCartTable();
}

function removeItem(id) {
  cartUtils.removeFromCart(id);
  renderCartTable();
}

async function submitOrder() {
  const items = cartUtils.getCart();
  const feedback = document.getElementById('checkoutFeedback');
  if (!items.length) {
    feedback.textContent = 'Dein Warenkorb ist leer.';
    return;
  }
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customer: { name: 'Guest', email: 'guest@example.com' } }),
    });
    const json = await res.json();
    if (json.success) {
      feedback.textContent = 'Bestellung erfolgreich gesendet!';
      cartUtils.saveCart([]);
      renderCartTable();
    } else {
      feedback.textContent = json.message || 'Fehler beim Checkout.';
    }
  } catch (error) {
    console.error('Checkout error', error);
    feedback.textContent = 'Server nicht erreichbar.';
  }
}
