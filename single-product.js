// single-product.js
// ==========================================
// Look At Me Fashion - Single Product Page
// Mobile Optimized + Cart Badge Fixed + Premium UX Edition
// ==========================================
//
// কাজগুলো:
// 1) URL থেকে product id নেওয়া (?id=....)
// 2) Backend থেকে সব products ফেচ করা
// 3) Match product বের করা এবং details দেখানো
// 4) Add to Cart (localStorage)
// 5) Toast দেখানো ("Added to cart")
// 6) Related products দেখানো
// 7) Mobile optimized animations + fast UI render
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // DOM ELEMENTS
  const breadcrumbNameEl = document.getElementById("breadcrumbProductName");
  const pageTitleEl = document.getElementById("pageTitle");

  const productLoadingEl = document.getElementById("productLoading");
  const productErrorEl = document.getElementById("productError");
  const productContentEl = document.getElementById("productContent");

  const productImageEl = document.getElementById("productImage");
  const productNameEl = document.getElementById("productName");
  const productPriceEl = document.getElementById("productPrice");
  const productDescriptionEl = document.getElementById("productDescription");

  const categoryBadgeEl = document.getElementById("productCategoryBadge");
  const categoryTextEl = document.getElementById("productCategoryText");

  const addToCartBtn = document.getElementById("addToCartBtn");

  const relatedContainerEl = document.getElementById("relatedContainer");
  const relatedEmptyEl = document.getElementById("relatedEmpty");

  const toastEl = document.getElementById("cartToast");

  // URL থেকে product id
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    showError("Invalid product link.");
    return;
  }

  // API URL
  const API_URL = "http://localhost:5000/api/products";

  // Fetch products
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    })
    .then((data) => {
      const products = Array.isArray(data) ? data : [];

      // Selected product
      const product = products.find((p) => p._id === productId);

      if (!product) {
        showError("Product not found.");
        return;
      }

      // Render product
      renderProductDetails(product);

      // Related products
      renderRelatedProducts(products, product);
    })
    .catch((err) => {
      console.error("Error loading product:", err);
      showError("Unable to load product. Please try again later.");
    });

  // ERROR visible
  function showError(message) {
    productLoadingEl?.classList.add("hidden");

    if (productErrorEl) {
      productErrorEl.textContent = message;
      productErrorEl.classList.remove("hidden");
    }

    productContentEl?.classList.add("hidden");
  }

  // PRODUCT DETAILS
  function renderProductDetails(product) {
    productLoadingEl?.classList.add("hidden");
    productErrorEl?.classList.add("hidden");
    productContentEl?.classList.remove("hidden");

    const name = product.name || "Product";
    const price = Number(product.price) || 0;
    const description = product.description || "No description available.";
    const category = product.category || "Uncategorized";
    const imageFile = product.image || "placeholder.jpg";

    // Titles + breadcrumb
    pageTitleEl.textContent = name;
    breadcrumbNameEl.textContent = name;

    // Image load with mobile fade-in
    productImageEl.src = `image/${imageFile}`;
    productImageEl.alt = name;

    productImageEl.onload = () => {
      productImageEl.classList.add("opacity-100");
    };

    productImageEl.classList.add(
      "opacity-0",
      "transition-opacity",
      "duration-700"
    );

    // Details
    productNameEl.textContent = name;
    productPriceEl.textContent = `৳ ${price}`;
    productDescriptionEl.textContent = description;

    // Category badge
    categoryTextEl.textContent = category;
    categoryBadgeEl.classList.remove("hidden");

    // Add to cart button
    addToCartBtn?.addEventListener("click", () => {
      addProductToCart(product);
      showToast();
      updateCartBadge();
    });
  }

  // RELATED PRODUCTS
  function renderRelatedProducts(allProducts, currentProduct) {
    if (!relatedContainerEl) return;

    const category = (currentProduct.category || "").toLowerCase();

    const related = allProducts.filter(
      (item) =>
        item._id !== currentProduct._id &&
        (item.category || "").toLowerCase() === category
    );

    relatedContainerEl.innerHTML = "";

    if (!related.length) {
      relatedEmptyEl.classList.remove("hidden");
      return;
    }

    relatedEmptyEl.classList.add("hidden");

    related.slice(0, 4).forEach((p) => {
      const card = createRelatedCard(p);
      relatedContainerEl.appendChild(card);
    });
  }

  // CARD FOR RELATED
  function createRelatedCard(product) {
    const name = product.name;
    const price = Number(product.price) || 0;

    const wrapper = document.createElement("a");
    wrapper.href = `single-product.html?id=${product._id}`;
    wrapper.className =
      "bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition transform active:scale-95";

    wrapper.innerHTML = `
      <div class="aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src="image/${product.image}"
          alt="${name}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div class="p-3 space-y-1">
        <h4 class="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
          ${name}
        </h4>
        <p class="text-[#6B0000] font-extrabold text-base">
          ৳ ${price}
        </p>
      </div>
    `;

    return wrapper;
  }

  // ADD TO CART
  function addProductToCart(product) {
    const CART_KEY = "lmf_cart";

    let cart = [];
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) cart = JSON.parse(stored);
    } catch {
      cart = [];
    }

    const index = cart.findIndex((item) => item.id === product._id);

    if (index >= 0) {
      cart[index].qty += 1;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        qty: 1,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // TOAST
  function showToast() {
    toastEl.classList.remove("opacity-0", "pointer-events-none");
    toastEl.classList.add("opacity-100");

    setTimeout(() => {
      toastEl.classList.remove("opacity-100");
      toastEl.classList.add("opacity-0", "pointer-events-none");
    }, 1800);
  }

  // CART BADGE SYNC
  function updateCartBadge() {
    const CART_KEY = "lmf_cart";
    let quantity = 0;

    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      quantity = stored.reduce((sum, item) => sum + item.qty, 0);
    } catch {}

    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = quantity;
  }

  // Initial badge update
  updateCartBadge();
});
