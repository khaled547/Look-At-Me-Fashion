// Look At Me Fashion - Products Page (Mobile Premium Edition)

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------
     GLOBAL PREMIUM SETTINGS
  ---------------------------- */
  document.body.style.webkitTapHighlightColor = "transparent";
  document.body.style.fontSmooth = "always";
  document.body.style.webkitFontSmoothing = "antialiased";

  const pageTitle = document.getElementById("pageTitle");
  const breadcrumb = document.getElementById("breadcrumb");
  const productCount = document.getElementById("productCount");
  const productContainer = document.getElementById("productContainer");
  const productCardTemplate = document.getElementById("productCardTemplate");
  const emptyState = document.getElementById("emptyState");
  const filterInput = document.getElementById("filterInput");
  const sortSelect = document.getElementById("sortSelect");

  productCardTemplate.classList.add("hidden");

  let allProducts = [];
  let currentCategory = null;
  let searchValue = "";
  let sortMode = "default";

  /* ----------------------------
     Detect category from URL
  ---------------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  currentCategory = urlParams.get("category");

  if (currentCategory) {
    const clean = capitalizeWords(currentCategory);
    pageTitle.textContent = `${clean} Products`;
    breadcrumb.textContent = `${clean} Products`;
  }

  /* ----------------------------
     Fetch Products (Mobile Safe)
  ---------------------------- */
  fetch("http://localhost:5000/api/products", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      allProducts = data || [];
      renderFilteredProducts();
    })
    .catch(err => {
      console.error("API Error:", err);
      showEmpty("Cannot load products. Check connection.");
    });

  /* ----------------------------
     Search Input (Debounced)
  ---------------------------- */
  let searchTimer;
  filterInput?.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchValue = e.target.value.toLowerCase();
      renderFilteredProducts();
    }, 120); // Smooth mobile typing
  });

  /* ----------------------------
     Sort Dropdown
  ---------------------------- */
  sortSelect?.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderFilteredProducts();
  });

  /* ----------------------------
     Main Filter Function
  ---------------------------- */
  function renderFilteredProducts() {
    let products = [...allProducts];

    // Filter by category
    if (currentCategory) {
      products = products.filter(
        p => String(p.category).toLowerCase() === currentCategory.toLowerCase()
      );
    }

    // Search
    if (searchValue.trim() !== "") {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchValue)
      );
    }

    // Sorting
    if (sortMode === "low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortMode === "high-low") {
      products.sort((a, b) => b.price - a.price);
    }

    // Empty state
    if (products.length === 0) {
      showEmpty("No products found.");
      return;
    }

    emptyState.classList.add("hidden");
    productContainer.classList.remove("hidden");

    productCount.textContent = `${products.length} products`;

    // Render Cards
    productContainer.innerHTML = "";
    const fragment = document.createDocumentFragment(); // Mobile fast rendering

    products.forEach(p => fragment.appendChild(createProductCard(p)));

    productContainer.appendChild(fragment);
  }

  /* ----------------------------
     Card Creator (Mobile Optimized)
  ---------------------------- */
  function createProductCard(product) {
    const card = productCardTemplate.cloneNode(true);
    card.classList.remove("hidden");
    card.removeAttribute("id");

    // Ensure Tap Highlight Removed
    card.style.webkitTapHighlightColor = "transparent";

    // Image
    card.querySelector("[data-role='product-image']").src =
      `image/${product.image}`;

    // Name
    card.querySelector("[data-role='product-name']").textContent =
      capitalizeWords(product.name);

    // Price
    card.querySelector("[data-role='product-price']").textContent =
      `৳ ${product.price}`;

    // Details Link
    const detailsLink = card.querySelector("[data-role='view-details']");
    detailsLink.href = `single-product.html?id=${product._id}`;

    return card;
  }

  /* ----------------------------
     Empty State Helper
  ---------------------------- */
  function showEmpty(text) {
    emptyState.classList.remove("hidden");
    productContainer.classList.add("hidden");
    emptyState.querySelector(".empty-message").textContent = text;
    productCount.textContent = "0 products";
  }

  /* ----------------------------
     Helper — Capitalize Words
  ---------------------------- */
  function capitalizeWords(text) {
    return text
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

});
