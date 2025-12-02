// cart.js - Look At Me Fashion
// =========================================
// কাজ:
// ✔ LocalStorage থেকে cart লোড করা
// ✔ UI তে কার্ট প্রডাক্ট দেখানো
// ✔ Quantity increase/decrease
// ✔ Remove button
// ✔ Total amount auto update
// ✔ Empty state handle
// ✔ Mobile optimized UI + smooth animations
// ✔ Cart badge auto-sync
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  const CART_KEY = "lmf_cart";

  const cartList = document.getElementById("cartList");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");

  let cart = [];

  // =====================================================
  // Load Cart
  // =====================================================
  function loadCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      cart = stored ? JSON.parse(stored) : [];
    } catch {
      cart = [];
    }
  }

  // =====================================================
  // Save Cart
  // =====================================================
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge(); // 🔥 every save → badge sync
  }

  // =====================================================
  // Update Cart Badge (Top Navbar)
  // =====================================================
  function updateCartBadge() {
    let count = 0;
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      count = stored.reduce((sum, item) => sum + item.qty, 0);
    } catch {}

    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
  }

  // =====================================================
  // Render Cart UI
  // =====================================================
  function renderCart() {
    loadCart();

    // Empty cart
    if (cart.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartList.classList.add("hidden");
      cartSummary.classList.add("hidden");
      return;
    }

    cartEmpty.classList.add("hidden");
    cartList.classList.remove("hidden");
    cartSummary.classList.remove("hidden");

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.qty;

      // Row Wrapper
      const row = document.createElement("div");
      row.className =
        "bg-white border border-red-200 rounded-2xl shadow p-4 flex gap-4 items-center " +
        "active:scale-[0.99] transition-transform";

      row.innerHTML = `
        <img src="image/${item.image}"
             class="w-20 h-20 rounded-lg object-cover shadow-sm" />

        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
            ${item.name}
          </h3>

          <p class="text-[#6B0000] font-bold mt-1">৳ ${item.price}</p>

          <div class="flex items-center gap-2 mt-2">
            <button class="qty-decrease w-8 h-8 flex items-center justify-center
                           bg-red-100 rounded-full text-lg font-bold
                           active:scale-90 transition">−</button>

            <span class="font-semibold min-w-[20px] text-center">${item.qty}</span>

            <button class="qty-increase w-8 h-8 flex items-center justify-center
                           bg-green-100 rounded-full text-lg font-bold
                           active:scale-90 transition">+</button>
          </div>
        </div>

        <button class="remove-item text-red-600 font-semibold text-2xl px-2
                       active:scale-90 transition">
          ×
        </button>
      `;

      // Increase Qty
      row.querySelector(".qty-increase").addEventListener("click", () => {
        item.qty++;
        saveCart();
        renderCart(); // smooth UI refresh
      });

      // Decrease Qty
      row.querySelector(".qty-decrease").addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty--;
        } else {
          cart = cart.filter((p) => p.id !== item.id);
        }
        saveCart();
        renderCart();
      });

      // Remove Item
      row.querySelector(".remove-item").addEventListener("click", () => {
        row.classList.add("opacity-50", "translate-x-4");
        setTimeout(() => {
          cart = cart.filter((p) => p.id !== item.id);
          saveCart();
          renderCart();
        }, 200);
      });

      cartList.appendChild(row);
    });

    cartTotal.textContent = `৳ ${total}`;
  }

  // Initial load + badge update
  renderCart();
  updateCartBadge();
});
