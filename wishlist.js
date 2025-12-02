// wishlist.js - Look At Me Fashion
// =========================================
// localStorage Key
const WISHLIST_KEY = "lmf_wishlist";

document.addEventListener("DOMContentLoaded", () => {
  const wishlistList = document.getElementById("wishlistList");
  const wishlistEmpty = document.getElementById("wishlistEmpty");

  let wishlist = [];

  // Load from localStorage
  function loadWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      wishlist = data ? JSON.parse(data) : [];
    } catch {
      wishlist = [];
    }
  }

  // Save wishlist
  function saveWishlist() {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }

  // Remove item
  function removeItem(productId) {
    wishlist = wishlist.filter(p => p.id !== productId);
    saveWishlist();
    renderWishlist();
  }

  // Render UI
  function renderWishlist() {
    loadWishlist();

    if (wishlist.length === 0) {
      wishlistEmpty.classList.remove("hidden");
      wishlistList.classList.add("hidden");
      return;
    }

    wishlistEmpty.classList.add("hidden");
    wishlistList.classList.remove("hidden");

    wishlistList.innerHTML = "";

    wishlist.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "bg-white border border-red-200 rounded-2xl shadow p-3 relative group";

      card.innerHTML = `
        <button class="removeBtn absolute top-2 right-2 text-red-600 text-xl">×</button>

        <img src="image/${item.image}" class="w-full h-40 object-cover rounded-lg" />

        <h3 class="mt-2 font-semibold text-gray-800 text-sm line-clamp-2">
          ${item.name}
        </h3>

        <p class="text-[#6B0000] font-bold text-sm">
          ৳ ${item.price}
        </p>

        <a href="single-product.html?id=${item.id}"
           class="block text-center mt-2 bg-[#FFD600] text-[#6B0000] py-1.5 text-sm rounded-full font-semibold">
          View Details
        </a>
      `;

      card.querySelector(".removeBtn").addEventListener("click", () => {
        removeItem(item.id);
      });

      wishlistList.appendChild(card);
    });
  }

  renderWishlist();
});
