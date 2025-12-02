// admin-product-list.js
// ==================================================
// ✔ Load all products
// ✔ Search filter
// ✔ Category filter
// ✔ Price sort
// ✔ Desktop table + Mobile cards
// ✔ Edit + Delete
// ✔ Toast notifications
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:5000/api/products";

  // DOM
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const productCount = document.getElementById("productCount");

  const productTable = document.getElementById("productTable");
  const mobileList = document.getElementById("mobileList");
  const emptyState = document.getElementById("emptyState");

  const toast = document.getElementById("toast");

  let allProducts = [];
  let filteredProducts = [];

  // -----------------------------
  // Load All Products
  // -----------------------------
  async function loadProducts() {
    try {
      const res = await fetch(API_URL);
      allProducts = await res.json();
      filteredProducts = [...allProducts];

      loadCategories();
      renderProducts();

    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  loadProducts();

  // -----------------------------
  // Load Unique Categories
  // -----------------------------
  function loadCategories() {
    const categories = [...new Set(allProducts.map(p => p.category))];

    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  // -----------------------------
  // Render Products (Table + Mobile Cards)
  // -----------------------------
  function renderProducts() {
    const list = filteredProducts;

    productCount.textContent = `${list.length} products`;

    productTable.innerHTML = "";
    mobileList.innerHTML = "";

    if (list.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    // TABLE (Desktop)
    list.forEach(p => {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
        <td class="p-3"><img src="image/${p.image}" class="w-14 h-14 rounded-lg object-cover"/></td>
        <td class="p-3">${p.name}</td>
        <td class="p-3 text-[#6B0000] font-semibold">৳ ${p.price}</td>
        <td class="p-3">${p.category}</td>
        <td class="p-3 space-x-2">
          <a href="admin-edit-product.html?id=${p._id}" 
            class="px-3 py-1 bg-yellow-300 text-sm rounded">Edit</a>
          <button data-id="${p._id}" 
            class="delete-btn px-3 py-1 bg-red-500 text-white text-sm rounded">Delete</button>
        </td>
      `;

      productTable.appendChild(tr);
    });

    // MOBILE CARDS
    list.forEach(p => {
      const card = document.createElement("div");
      card.className =
        "bg-white border border-red-200 rounded-xl shadow p-3 space-y-2";

      card.innerHTML = `
        <img src="image/${p.image}" class="w-full h-40 object-cover rounded-lg"/>
        <h3 class="font-semibold text-gray-900">${p.name}</h3>
        <p class="text-[#6B0000] font-bold">৳ ${p.price}</p>
        <p class="text-sm text-gray-500">${p.category}</p>

        <div class="flex gap-2 pt-2">
          <a href="admin-edit-product.html?id=${p._id}"
            class="flex-1 text-center bg-yellow-300 rounded py-1 font-semibold">Edit</a>
          <button data-id="${p._id}"
            class="delete-btn flex-1 bg-red-500 text-white rounded py-1 font-semibold">Delete</button>
        </div>
      `;

      mobileList.appendChild(card);
    });

    initDeleteButtons();
  }

  // -----------------------------
  // Apply Filters
  // -----------------------------
  function applyFilters() {
    let list = [...allProducts];

    const searchText = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const sort = sortSelect.value;

    // Search
    if (searchText) {
      list = list.filter(p => p.name.toLowerCase().includes(searchText));
    }

    // Category
    if (cat !== "all") {
      list = list.filter(p => p.category === cat);
    }

    // Sort
    if (sort === "low-high") {
      list.sort((a, b) => a.price - b.price);
    }
    if (sort === "high-low") {
      list.sort((a, b) => b.price - a.price);
    }

    filteredProducts = list;
    renderProducts();
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  // -----------------------------
  // DELETE ACTION
  // -----------------------------
  function initDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        const ok = confirm("Delete this product?");
        if (!ok) return;

        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();

          showToast("Product Deleted!");

          // Remove from UI instantly
          allProducts = allProducts.filter(p => p._id !== id);
          applyFilters();

        } catch {
          showToast("Failed to Delete!");
        }
      });
    });
  }

  // -----------------------------
  // TOAST
  // -----------------------------
  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0", "pointer-events-none");
    }, 1800);
  }
});
