// Look At Me Fashion - Products Page (Simple Clean Version)

document.addEventListener("DOMContentLoaded", () => {

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

  // -----------------------
  // Get category from URL
  // -----------------------
  const urlParams = new URLSearchParams(window.location.search);
  currentCategory = urlParams.get("category");

  if (currentCategory) {
    pageTitle.textContent = `${currentCategory} Products`;
    breadcrumb.textContent = `${currentCategory} Products`;
  }

  // -----------------------
  // Fetch products
  // -----------------------
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderFilteredProducts();
    })
    .catch(err => console.error("API Error:", err));

  // -----------------------
  // Search filter
  // -----------------------
  filterInput?.addEventListener("input", (e) => {
    searchValue = e.target.value.toLowerCase();
    renderFilteredProducts();
  });

  // -----------------------
  // Sorting
  // -----------------------
  sortSelect?.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderFilteredProducts();
  });

  // -----------------------
  // Main filtering function
  // -----------------------
  function renderFilteredProducts() {
    let products = [...allProducts];

    // Category Filter (EXACT MATCH)
    if (currentCategory) {
      products = products.filter(
        p => String(p.category).toLowerCase() === String(currentCategory).toLowerCase()
      );
    }

    // Search Filter
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
      emptyState.classList.remove("hidden");
      productContainer.classList.add("hidden");
      productCount.textContent = "0 products";
      return;
    }

    emptyState.classList.add("hidden");
    productContainer.classList.remove("hidden");

    // Count update
    productCount.textContent = `${products.length} products`;

    // Render
    productContainer.innerHTML = "";
    products.forEach(p => {
      const card = createProductCard(p);
      productContainer.appendChild(card);
    });
  }

  // -----------------------
  // Create card
  // -----------------------
  function createProductCard(product) {
    const card = productCardTemplate.cloneNode(true);
    card.classList.remove("hidden");
    card.removeAttribute("id");

    // Image, name, price
    card.querySelector("[data-role='product-image']").src = `image/${product.image}`;
    card.querySelector("[data-role='product-name']").textContent = product.name;
    card.querySelector("[data-role='product-price']").textContent = `৳ ${product.price}`;

    // ⭐ View Details → Link Set
    const detailsLink = card.querySelector("[data-role='view-details']");
    detailsLink.href = `single-product.html?id=${product._id}`;

    return card;
  }

});


