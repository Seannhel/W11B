
const products = [
  {
    id: 1,
    name: "FlyInfinite A350-1000",
    category: "THE ORIGINAL KING",
    price: 129,
    image: "./images/flyinfinite.jpg",
    tag: "BEST SELLER"
  },
  {
    id: 2,
    name: "GPT PLANE A350-1000 ULR",
    category: "SPECIAL EDITION",
    price: 159,
    image: "./images/gpt-plane.jpg",
    tag: "EXCLUSIVE"
  },
  {
    id: 3,
    name: "FlyPhoenix A350-900",
    category: "FROM JAPAN TO THE WORLD",
    price: 119,
    image: "./images/flyphoenix.jpg",
    tag: ""
  },
  {
    id: 4,
    name: "LONESTAR Boeing 777-9",
    category: "TEXAS ICON",
    price: 139,
    image: "./images/lonestar.jpg",
    tag: ""
  },
  {
    id: 5,
    name: "Horang Air Boeing 787-10",
    category: "DREAMLINER COLLECTION",
    price: 109,
    image: "./images/horang.jpg",
    tag: ""
  },
  {
    id: 6,
    name: "Jade Dragon A350-1000",
    category: "A JADE THAT ROARS",
    price: 129,
    image: "./images/jade-dragon.jpg",
    tag: "NEW"
  }
];

const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");
const toast = document.getElementById("toast");

function getCart() {
  try {
    const value = JSON.parse(Cookies.get("cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function updateCount() {
  cartCount.textContent = getCart().length;
}

function addToCart(id) {
  const item = products.find(product => product.id === id);
  if (!item) return;

  // Load existing cart before adding an item.
  const cart = getCart();

  cart.push({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image
  });

  Cookies.set("cart", JSON.stringify(cart), {
    expires: 7,
    sameSite: "Lax"
  });

  updateCount();

  toast.textContent = `${item.name} added to your hangar ✓`;
  toast.classList.add("visible");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2300);
}

productsContainer.innerHTML = products.map(product => `
  <article class="product-card">
    <div class="product-image">
      ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      <img src="${product.image}" alt="${product.name}">
      <span class="model-scale">1:200 SCALE MODEL</span>
    </div>

    <div class="product-details">
      <p class="product-category">${product.category}</p>
      <h3>${product.name}</h3>
      <div class="product-bottom">
        <span class="price">$${product.price.toFixed(2)}</span>
        <button class="add-button" data-id="${product.id}">
          + Add to cart
        </button>
      </div>
    </div>
  </article>
`).join("");

productsContainer.addEventListener("click", event => {
  const button = event.target.closest(".add-button");

  if (button) {
    addToCart(Number(button.dataset.id));
  }
});

updateCount();
