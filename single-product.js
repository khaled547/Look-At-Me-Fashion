// single-product.js
// ==========================================
// Look At Me Fashion - Single Product Page
// ==========================================
//
// কাজগুলো:
// 1) URL থেকে product id নেওয়া (?id=....)
// 2) Backend থেকে সব products ফেচ করা
//    GET http://localhost:5000/api/products
// 3) ওই list এর মধ্যে থেকে match করা _id == id
// 4) product details UI তে বসানো
// 5) Add to Cart (localStorage এ data রাখা)
// 6) Toast দেখানো ("Added to cart")
// 7) Same category এর related products দেখানো
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // DOM ELEMENTS
  // -------------------------------
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

  // -------------------------------
  // URL থেকে product id নেওয়া
  // -------------------------------
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    // যদি URL এ id না থাকে
    showError("Invalid product link.");
    return;
  }

  // -------------------------------
  // Backend থেকে সব products ফেচ করা
  // -------------------------------
  const API_URL = "http://localhost:5000/api/products";

  fetch(API_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      return res.json();
    })
    .then((data) => {
      const products = Array.isArray(data) ? data : [];

      // 1) এই id এর product বের করা
      const product = products.find((p) => p._id === productId);

      if (!product) {
        showError("Product not found.");
        return;
      }

      // 2) product details UI তে বসানো
      renderProductDetails(product);

      // 3) related products দেখানো
      renderRelatedProducts(products, product);
    })
    .catch((err) => {
      console.error("Error loading product:", err);
      showError("Unable to load product. Please try again later.");
    });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  // -------------------------------
  // Error / Not found screen
  // -------------------------------
  function showError(message) {
    if (productLoadingEl) productLoadingEl.classList.add("hidden");

    if (productErrorEl) {
      productErrorEl.textContent = message || "Product not found.";
      productErrorEl.classList.remove("hidden");
    }

    if (productContentEl) {
      productContentEl.classList.add("hidden");
    }
  }

  // -------------------------------
  // Product details render করা
  // -------------------------------
  function renderProductDetails(product) {
    if (productLoadingEl) productLoadingEl.classList.add("hidden");
    if (productErrorEl) productErrorEl.classList.add("hidden");
    if (productContentEl) productContentEl.classList.remove("hidden");

    const name = product.name || "Product";
    const price = Number(product.price) || 0;
    const description =
      product.description || "No description available for this product.";
    const category = product.category || "Uncategorized";
    const imageFile = product.image || "placeholder.jpg";

    // Title & breadcrumb
    if (pageTitleEl) {
      pageTitleEl.textContent = name;
    }
    if (breadcrumbNameEl) {
      breadcrumbNameEl.textContent = name;
    }

    // Image
    if (productImageEl) {
      productImageEl.src = `image/${imageFile}`;
      productImageEl.alt = name;
    }

    // Name
    if (productNameEl) {
      productNameEl.textContent = name;
    }

    // Price
    if (productPriceEl) {
      productPriceEl.textContent = `৳ ${price}`;
    }

    // Description
    if (productDescriptionEl) {
      productDescriptionEl.textContent = description;
    }

    // Category badge
    if (categoryBadgeEl && categoryTextEl) {
      categoryTextEl.textContent = category;
      categoryBadgeEl.classList.remove("hidden");
    }

    // Add to cart button action
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addProductToCart(product);
        showToast();
        updateCartBadge();
      });
    }
  }

  // -------------------------------
  // Related products render করা
  // -------------------------------
  function renderRelatedProducts(allProducts, currentProduct) {
    if (!relatedContainerEl || !relatedEmptyEl) return;

    // Same category, but current product বাদ দিয়ে
    const category = (currentProduct.category || "").toLowerCase();

    const related = allProducts.filter(
      (item) =>
        item._id !== currentProduct._id &&
        (item.category || "").toLowerCase() === category
    );

    // Clear previous
    relatedContainerEl.innerHTML = "";

    if (!related.length) {
      relatedEmptyEl.classList.remove("hidden");
      return;
    }

    relatedEmptyEl.classList.add("hidden");

    // Limit: max 4 products
    related.slice(0, 4).forEach((p) => {
      const card = createRelatedCard(p);
      relatedContainerEl.appendChild(card);
    });
  }

  // -------------------------------
  // Single related card তৈরি
  // -------------------------------
  function createRelatedCard(product) {
    const name = product.name || "Product";
    const price = Number(product.price) || 0;
    const imageFile = product.image || "placeholder.jpg";

    const wrapper = document.createElement("a");
    wrapper.href = `single-product.html?id=${product._id}`;
    wrapper.className =
      "bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition transform";

    wrapper.innerHTML = `
      <div class="aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src="image/${imageFile}"
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

  // -------------------------------
  // Add to cart (localStorage)
  // -------------------------------
  function addProductToCart(product) {
    const CART_KEY = "lmf_cart";

    // LocalStorage থেকে আগের cart নেওয়া
    let cart = [];
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error parsing cart from localStorage:", e);
      cart = [];
    }

    // এই product already আছে কিনা চেক
    const existingIndex = cart.findIndex((item) => item.id === product._id);

    if (existingIndex >= 0) {
      // already আছে → qty++ করবো
      cart[existingIndex].qty += 1;
    } else {
      // নতুন করে add করবো
      cart.push({
        id: product._id,
        name: product.name || "Product",
        price: Number(product.price) || 0,
        image: product.image || "placeholder.jpg",
        qty: 1,
      });
    }

    // আবার localStorage এ save করা
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // -------------------------------
  // Toast দেখানো ("Added to cart")
  // -------------------------------
  function showToast() {
    if (!toastEl) return;

    toastEl.classList.remove("opacity-0", "pointer-events-none");
    toastEl.classList.add("opacity-100");

    // 1.8 সেকেন্ড পর hide
    setTimeout(() => {
      toastEl.classList.remove("opacity-100");
      toastEl.classList.add("opacity-0", "pointer-events-none");
    }, 1800);
  }

  // -------------------------------
  // Cart badge update করা (optional)
  // index.html এর cartCount থাকলে কাজ করবে
  // -------------------------------
  function updateCartBadge() {
    const CART_KEY = "lmf_cart";
    let count = 0;

    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const cart = JSON.parse(stored);
        count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
      }
    } catch (e) {
      console.warn("Error reading cart for badge:", e);
    }

    const badge = document.getElementById("cartCount");
    if (badge) {
      badge.textContent = count;
    }
  }

  // Page load-এর সময় cart badge একবার আপডেট করা হলে ভালো
  updateCartBadge();
});
