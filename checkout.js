
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const emptyState = document.getElementById("empty-state");
const checkoutLayout = document.getElementById("checkout-layout");

function getCart() {
  try {
    const value = JSON.parse(Cookies.get("cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  Cookies.set("cart", JSON.stringify(cart), {
    expires: 7,
    sameSite: "Lax"
  });
}

function showCart() {
  const cart = getCart();

  cartCount.textContent = cart.length;
  emptyState.hidden = cart.length !== 0;
  checkoutLayout.hidden = cart.length === 0;

  if (cart.length === 0) return;

  // Group duplicate items and show quantity.
  const grouped = [];

  cart.forEach(item => {
    const found = grouped.find(product => product.id === item.id);

    if (found) {
      found.quantity++;
    } else {
      grouped.push({ ...item, quantity: 1 });
    }
  });

  cartItems.innerHTML = grouped.map(item => `
    <article class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-item-info">
        <p class="product-category">1:200 SCALE MODEL</p>
        <h3>${item.name}</h3>
        <p class="item-unit">$${item.price.toFixed(2)} each</p>
        <span class="quantity">QUANTITY: ${item.quantity}</span>
      </div>

      <div class="cart-item-actions">
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        <button class="remove-button" data-id="${item.id}">
          Remove one −
        </button>
      </div>
    </article>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal >= 200 ? 0 : 15;

  document.getElementById("total-quantity").textContent =
    `(${cart.length})`;

  document.getElementById("summary-count").textContent = cart.length;

  document.getElementById("subtotal").textContent =
    `$${subtotal.toFixed(2)}`;

  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;

  document.getElementById("total").textContent =
    `$${(subtotal + shipping).toFixed(2)}`;
}

// Delete only ONE copy of the selected product.
cartItems.addEventListener("click", event => {
  const button = event.target.closest(".remove-button");
  if (!button) return;

  const cart = getCart();
  const index = cart.findIndex(item =>
    item.id === Number(button.dataset.id)
  );

  if (index !== -1) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  showCart();
});

// Clear all items.
document.getElementById("clear-cart").addEventListener("click", () => {
  saveCart([]);
  showCart();
});

showCart();
