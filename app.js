// ================================
// বাংলা কমেন্ট: DOM পুরো লোড হলে সব init হবে
// ================================
document.addEventListener("DOMContentLoaded", () => {
  initSearchBox();
  initWishlistToggle();
  initUserMenu();
  initShopMegaMenu();
  initStickyHeader();
  initSmoothScroll();
  initMobileMenu();
  initBottomMenu();
  initCategoryEffects();
  initProductSystem();
  initAuthModal();
});

// ================================
// SEARCH TOGGLE
// ================================
function initSearchBox() {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");
  const searchClose = document.getElementById("searchClose");

  if (!searchBtn || !searchBox || !searchClose) return;

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.classList.toggle("hidden");
  });

  searchClose.addEventListener("click", () => {
    searchBox.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBox.classList.add("hidden");
    }
  });
}

// ================================
// HEADER WISHLIST TOGGLE (একটা হার্ট)
// ================================
function initWishlistToggle() {
  const wishBtn = document.getElementById("wishBtn");
  const wishIcon = document.getElementById("wishIcon");
  if (!wishBtn || !wishIcon) return;

  // বাংলা: header wishlist-এর জন্য আলাদা key
  let wishActive = localStorage.getItem("headerWish") === "true";

  function applyState() {
    if (wishActive) {
      wishIcon.setAttribute("fill", "#B60000");
      wishIcon.setAttribute("stroke", "#B60000");
    } else {
      wishIcon.setAttribute("fill", "none");
      wishIcon.setAttribute("stroke", "currentColor");
    }
  }

  applyState();

  wishBtn.addEventListener("click", () => {
    wishActive = !wishActive;
    applyState();
    localStorage.setItem("headerWish", wishActive);
  });
}

// ================================
// USER MENU DROPDOWN
// ================================
function initUserMenu() {
  const userBtn = document.getElementById("userBtn");
  const userMenu = document.getElementById("userMenu");
  if (!userBtn || !userMenu) return;

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });
}

// ================================
// SHOP MEGA MENU (DESKTOP)
// ================================
function initShopMegaMenu() {
  const shopBtn = document.getElementById("shopBtn");
  const megaMenu = document.getElementById("megaMenu");
  if (!shopBtn || !megaMenu) return;

  shopBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = megaMenu.classList.contains("hidden");
    if (isHidden) {
      megaMenu.classList.remove("hidden");
      requestAnimationFrame(() => megaMenu.classList.remove("opacity-0"));
    } else {
      megaMenu.classList.add("opacity-0");
      setTimeout(() => megaMenu.classList.add("hidden"), 150);
    }
  });

  document.addEventListener("click", (event) => {
    if (!megaMenu.contains(event.target) && !shopBtn.contains(event.target)) {
      megaMenu.classList.add("opacity-0");
      setTimeout(() => megaMenu.classList.add("hidden"), 150);
    }
  });
}

// ================================
// STICKY HEADER SHADOW
// ================================
function initStickyHeader() {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("shadow-md");
    } else {
      header.classList.remove("shadow-md");
    }
  });
}

// ================================
// SMOOTH SCROLL NAV-LINKS
// ================================
function initSmoothScroll() {
  const header = document.getElementById("mainHeader");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!header || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      event.preventDefault();

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      const headerHeight = header.offsetHeight;
      const elementTop =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const finalPosition = elementTop - headerHeight;

      window.scrollTo({ top: finalPosition, behavior: "smooth" });
    });
  });
}

// ================================
// MOBILE MENU
// ================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener("click", () => {
    if (mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== "0px") {
      // বন্ধ করা
      mobileMenu.style.maxHeight = "0px";
      setTimeout(() => mobileMenu.classList.add("hidden"), 250);
    } else {
      // খোলা
      mobileMenu.classList.remove("hidden");
      mobileMenu.style.maxHeight = "260px";
    }
  });

  // Optional: mobile Shop link → নিচে product section এ নিয়ে যাবে
  const mobileShopLink = document.getElementById("mobileShopLink");
  if (mobileShopLink) {
    mobileShopLink.addEventListener("click", () => {
      const target = document.getElementById("shopCategory");
      if (!target) return;
      const header = document.getElementById("mainHeader");
      const headerHeight = header ? header.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
      // মেনুও বন্ধ করে দেই
      mobileMenu.style.maxHeight = "0px";
      setTimeout(() => mobileMenu.classList.add("hidden"), 250);
    });
  }
}

// ================================
// MOBILE BOTTOM NAV
// ================================
function initBottomMenu() {
  const navHome = document.getElementById("navHome");
  const navSearch = document.getElementById("navSearch");
  const navCart = document.getElementById("navCart");
  const navUser = document.getElementById("navUser");

  if (navHome) {
    navHome.addEventListener("click", () => {
      window.location.hash = "#homeSection";
    });
  }

  if (navSearch) {
    navSearch.addEventListener("click", () => {
      const searchBtn = document.getElementById("searchBtn");
      if (searchBtn) searchBtn.click();
    });
  }

  if (navCart) {
    navCart.addEventListener("click", () => {
      // বাংলা কমেন্ট: future এ চাইলে cart section এ smooth scroll করাতে পারো
      const cartSection = document.getElementById("cartContainer");
      if (cartSection) {
        cartSection.scrollIntoView({ behavior: "smooth" });
      } else {
        alert("Cart section উপরে আছে, একটু স্ক্রল করুন 🙂");
      }
    });
  }

  if (navUser) {
    navUser.addEventListener("click", () => {
      const userBtn = document.getElementById("userBtn");
      if (userBtn) userBtn.click();
    });
  }
}

// ==========================================
// CATEGORY SECTION — PREMIUM EFFECTS (Tailwind Only)
// ==========================================
function initCategoryPremium() {
  const cards = document.querySelectorAll(".category-card");
  if (!cards.length) return;

  // ------------------------------
  // SCROLL FADE-IN ANIMATION
  // ------------------------------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-3");
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => {
    card.classList.add(
      "opacity-0",
      "translate-y-3",
      "transition-all",
      "duration-700"
    );
    observer.observe(card);
  });

  // ------------------------------
  // CLICK → GOLD RIPPLE + SCROLL
  // ------------------------------
  cards.forEach((card) => {
    card.style.position = "relative";
    card.style.overflow = "hidden";

    card.addEventListener("click", (e) => {
      // ripple তৈরি
      const ripple = document.createElement("span");
      ripple.className =
        "absolute w-5 h-5 bg-yellow-300/40 rounded-full pointer-events-none" +
        " animate-[ping_0.7s_ease-out]";

      const x = e.clientX - card.getBoundingClientRect().left;
      const y = e.clientY - card.getBoundingClientRect().top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);

      // Scroll → Products section
      const target = document.getElementById("newArrivalsSection");
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 150);
    });
  });
}

document.addEventListener("DOMContentLoaded", initCategoryPremium);

// ================================
// PRODUCT SYSTEM (CART + WISHLIST + PRODUCTS)
// ================================
function initProductSystem() {
  // ---- ডেমো প্রোডাক্ট ডাটা ----
  const PRODUCTS = [
    {
      id: "p1",
      name: "Stylish Ladies Bag",
      price: 2500,
      image: "./image/ledies bag.jpeg",
      category: "bags",
    },
    {
      id: "p2",
      name: "Men’s Premium Watch",
      price: 4000,
      image: "./image/watch.jpeg",
      category: "watches",
    },
    {
      id: "p3",
      name: "Comfortable Shoes",
      price: 3200,
      image: "./image/Stylish Sneakers.jfif",
      category: "footwear",
    },
    {
      id: "p4",
      name: "Cosmetic Kit",
      price: 1800,
      image: "./image/cosmetich.jpeg",
      category: "cosmetics",
    },
  ];

  // ===== LocalStorage Helpers =====
  const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  const getWishlist = () =>
    JSON.parse(localStorage.getItem("wishlist") || "[]");
  const saveWishlist = (wishlist) =>
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // ===== CART badge update =====
  function updateCartBadge() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const topBadge = document.getElementById("cartCount");
    const bottomBadge = document.getElementById("bottomCartCount");
    if (topBadge) topBadge.textContent = totalQty;
    if (bottomBadge) bottomBadge.textContent = totalQty;
  }

  // ===== CART add =====
  function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    alert("Product added to cart!");
  }

  // ===== WISHLIST toggle =====
  function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    if (index === -1) {
      wishlist.push(productId);
      alert("Added to wishlist!");
    } else {
      wishlist.splice(index, 1);
      alert("Removed from wishlist!");
    }
    saveWishlist(wishlist);
  }

  // ===== Product Card Buttons (home/product grid এর card) =====
  function initProductCardButtons() {
    const cards = document.querySelectorAll(".product-card");
    if (!cards.length) return;
    cards.forEach((card) => {
      const id = card.getAttribute("data-id");
      if (!id) return;

      const cartBtn = card.querySelector(".add-to-cart");
      if (cartBtn) {
        cartBtn.addEventListener("click", () => addToCart(id));
      }

      const wishBtn = card.querySelector(".add-to-wishlist");
      if (wishBtn) {
        wishBtn.addEventListener("click", () => toggleWishlist(id));
      }

      const detailsBtn = card.querySelector(".view-details");
      if (detailsBtn) {
        detailsBtn.addEventListener("click", () => {
          // বাংলা: একই পেজে productDetails section এ দেখাবো
          const detailsSection = document.getElementById("productDetails");
          if (!detailsSection) return;

          const product = PRODUCTS.find((p) => p.id === id);
          if (!product) return;

          renderProductDetails(detailsSection, product);
          detailsSection.scrollIntoView({ behavior: "smooth" });
        });
      }
    });
  }

  // ===== Product List + Search (All products section) =====
  function initProductsPage() {
    const listEl = document.getElementById("productList");
    const searchInput = document.getElementById("productSearch");
    const suggestionBox = document.getElementById("searchSuggestions");

    if (!listEl || !searchInput || !suggestionBox) return;

    function createCardHTML(product) {
      return `
          <div class="product-card bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1 border-t-4 border-[#B60000] flex flex-col" data-id="${product.id}">
            <div class="h-40 sm:h-48 bg-gray-200 rounded-t-xl overflow-hidden">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
            <div class="p-3 flex flex-col gap-1 flex-1">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base">${product.name}</h3>
              <p class="text-[#B60000] font-bold text-sm sm:text-base">৳ ${product.price}</p>

              <div class="mt-2 flex items-center gap-2">
                <button class="add-to-cart flex-1 bg-[#FFD600] text-[#B60000] text-xs sm:text-sm font-semibold py-1.5 rounded-lg hover:bg-white border border-[#FFD600] hover:shadow-md transition">
                  Add to Cart
                </button>
                <button class="add-to-wishlist w-9 h-9 flex items-center justify-center rounded-full border border-[#B60000] text-[#B60000] hover:bg-red-50">
                  ♥
                </button>
              </div>

              <button class="mt-2 w-full text-[12px] sm:text-sm text-gray-600 underline hover:text-[#B60000] view-details">
                View Details
              </button>
            </div>
          </div>
        `;
    }

    function renderProducts(products) {
      listEl.innerHTML = products.map(createCardHTML).join("");
      initProductCardButtons();
    }

    renderProducts(PRODUCTS);

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        suggestionBox.classList.add("hidden");
        renderProducts(PRODUCTS);
        return;
      }

      const filtered = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
      renderProducts(filtered);

      suggestionBox.innerHTML = filtered
        .slice(0, 5)
        .map(
          (p) => `
            <div class="px-3 py-1 hover:bg-red-50 cursor-pointer" data-id="${p.id}">
              ${p.name}
            </div>`
        )
        .join("");

      suggestionBox.classList.toggle("hidden", filtered.length === 0);

      suggestionBox.querySelectorAll("div").forEach((div) => {
        div.addEventListener("click", () => {
          const id = div.getAttribute("data-id");
          const product = PRODUCTS.find((p) => p.id === id);
          const detailsSection = document.getElementById("productDetails");
          if (!product || !detailsSection) return;
          renderProductDetails(detailsSection, product);
          detailsSection.scrollIntoView({ behavior: "smooth" });
        });
      });
    });
  }

  // ===== Product Details Section Render =====
  function renderProductDetails(container, product) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6 bg-white rounded-xl shadow-md p-4 md:p-6 border-t-4 border-[#B60000]">
          <div class="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
            <img src="${product.image}" alt="${product.name}" class="w-full max-w-sm rounded-lg shadow-lg object-cover" />
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="text-2xl md:text-3xl font-bold text-[#B60000]">${product.name}</h1>
            <p class="text-xl text-gray-800 font-semibold">৳ ${product.price}</p>
            <p class="text-sm text-gray-600">
              সুন্দর ও প্রিমিয়াম কোয়ালিটির এই পণ্যটি আপনার প্রতিদিনের ফ্যাশনের জন্য একদম পারফেক্ট।
            </p>
            <div class="flex items-center gap-3 mt-3">
              <button id="detailsAddToCart" class="flex-1 bg-[#FFD600] text-[#B60000] font-semibold py-2 rounded-lg hover:bg-white border border-[#FFD600] hover:shadow-md transition">
                Add to Cart
              </button>
              <button id="detailsWishlist" class="w-11 h-11 flex items-center justify-center rounded-full border border-[#B60000] text-[#B60000] hover:bg-red-50">
                ♥
              </button>
            </div>
          </div>
        </div>
      `;

    const addBtn = document.getElementById("detailsAddToCart");
    const wishBtn = document.getElementById("detailsWishlist");
    if (addBtn) addBtn.addEventListener("click", () => addToCart(product.id));
    if (wishBtn)
      wishBtn.addEventListener("click", () => toggleWishlist(product.id));
  }

  // ===== Cart Section Render =====
  function initCartPage() {
    const container = document.getElementById("cartContainer");
    if (!container) return;

    function renderCart() {
      const cart = getCart();
      if (cart.length === 0) {
        container.innerHTML = "<p>Cart is empty.</p>";
        updateCartBadge();
        return;
      }

      let total = 0;

      const rows = cart
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          if (!product) return "";
          const subTotal = product.price * item.qty;
          total += subTotal;
          return `
              <div class="flex items-center justify-between py-2 border-b text-sm">
                <div class="flex items-center gap-3">
                  <img src="${product.image}" class="w-12 h-12 rounded object-cover" />
                  <div>
                    <p class="font-semibold">${product.name}</p>
                    <p class="text-gray-600">৳ ${product.price} x ${item.qty}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="cart-decrease px-2 border rounded" data-id="${item.id}">-</button>
                  <span>${item.qty}</span>
                  <button class="cart-increase px-2 border rounded" data-id="${item.id}">+</button>
                  <span class="w-16 text-right font-semibold">৳ ${subTotal}</span>
                  <button class="cart-remove text-red-600 text-xs underline" data-id="${item.id}">Remove</button>
                </div>
              </div>
            `;
        })
        .join("");

      container.innerHTML = `
          <div class="space-y-2">
            ${rows}
          </div>
          <div class="mt-4 flex justify-between items-center">
            <p class="text-lg font-bold">Total: <span>৳ ${total}</span></p>
            <button class="bg-[#B60000] text-white px-4 py-2 rounded-lg text-sm">Checkout (Demo)</button>
          </div>
        `;

      container.querySelectorAll(".cart-increase").forEach((btn) => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
      });
      container.querySelectorAll(".cart-decrease").forEach((btn) => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
      });
      container.querySelectorAll(".cart-remove").forEach((btn) => {
        btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
      });

      updateCartBadge();
    }

    function changeQty(id, delta) {
      const cart = getCart();
      const item = cart.find((i) => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      }
      saveCart(cart);
      renderCart();
    }

    function removeFromCart(id) {
      let cart = getCart();
      cart = cart.filter((i) => i.id !== id);
      saveCart(cart);
      renderCart();
    }

    renderCart();
  }

  // ===== Wishlist Section Render =====
  function initWishlistPage() {
    const container = document.getElementById("wishlistContainer");
    if (!container) return;

    function renderWishlist() {
      const wishlist = getWishlist();
      if (wishlist.length === 0) {
        container.innerHTML =
          "<p class='col-span-full text-sm'>Wishlist is empty.</p>";
        return;
      }

      const items = wishlist
        .map((id) => {
          const product = PRODUCTS.find((p) => p.id === id);
          if (!product) return "";
          return `
              <div class="bg-white rounded-xl shadow-md p-3 flex flex-col">
                <div class="h-32 bg-gray-200 rounded overflow-hidden">
                  <img src="${product.image}" class="w-full h-full object-cover" />
                </div>
                <h3 class="mt-2 font-semibold text-sm">${product.name}</h3>
                <p class="text-[#B60000] font-bold text-sm">৳ ${product.price}</p>
                <div class="mt-2 flex gap-2">
                  <button class="flex-1 bg-[#FFD600] text-[#B60000] text-xs py-1 rounded add-to-cart-wish" data-id="${product.id}">
                    Add to Cart
                  </button>
                  <button class="text-xs text-red-600 underline remove-wish" data-id="${product.id}">
                    Remove
                  </button>
                </div>
              </div>
            `;
        })
        .join("");

      container.innerHTML = items;

      container.querySelectorAll(".add-to-cart-wish").forEach((btn) => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
      });

      container.querySelectorAll(".remove-wish").forEach((btn) => {
        btn.addEventListener("click", () => {
          let wishlist = getWishlist();
          wishlist = wishlist.filter((pid) => pid !== btn.dataset.id);
          saveWishlist(wishlist);
          renderWishlist();
        });
      });
    }

    renderWishlist();
  }

  // ===== সব Product related init একসাথে কল করি =====
  updateCartBadge();
  initProductCardButtons();
  initProductsPage();
  initCartPage();
  initWishlistPage();
}

// ================================
// LOGIN / REGISTER MODAL
// ================================
function initAuthModal() {
  const overlay = document.getElementById("authOverlay");
  const closeBtn = document.getElementById("authClose");
  if (!overlay || !closeBtn) return;

  const loginLinks = document.querySelectorAll("#userMenu a:first-child");

  function openModal() {
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    overlay.classList.add("hidden");
  }

  loginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}

// ====================================================
// NEW ARRIVALS — PREMIUM SLIDER JS
// ====================================================
function initNewArrivalSlider() {
  const slider = document.getElementById("arrivalSlider");
  const nextBtn = document.getElementById("arrivalNext");
  const prevBtn = document.getElementById("arrivalPrev");

  if (!slider) return;

  // প্রতিবার কত দূর স্লাইড করবে
  const step = 300;

  // ডানে স্লাইড
  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: step, behavior: "smooth" });
  });

  // বামে স্লাইড
  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -step, behavior: "smooth" });
  });

  // Auto fade effect while scrolling
  slider.addEventListener("scroll", () => {
    slider.querySelectorAll("div").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // কেন্দ্রের কাছে থাকা কার্ড একটু glow হবে
      const center = windowWidth / 2;
      const distance = Math.abs(rect.left + rect.width / 2 - center);

      const scale = 1 - Math.min(distance / 1000, 0.1);

      card.style.transform = `scale(${scale})`;
    });
  });
}

document.addEventListener("DOMContentLoaded", initNewArrivalSlider);
// =======================================
// FEATURED PRODUCTS SECTION EFFECTS (Premium)
// =======================================
function initFeaturedEffects() {
  const cards = document.querySelectorAll("#featuredSection .featured-card");
  if (!cards.length) return;

  // Fade-in smooth reveal
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => reveal.observe(card));

  // Premium hover lift
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("scale-[1.015]");
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("scale-[1.015]");
    });
  });
}

document.addEventListener("DOMContentLoaded", initFeaturedEffects);

// =======================================
// TESTIMONIALS PREMIUM ANIMATION
// =======================================
function initTestimonialsEffects() {
  const cards = document.querySelectorAll(
    "#testimonialsSection .testimonial-card"
  );
  if (!cards.length) return;

  // Fade-in animation on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => {
    observer.observe(card);

    // Hover premium effect
    card.addEventListener("mouseenter", () => {
      card.classList.add("scale-[1.03]", "shadow-2xl");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("scale-[1.03]", "shadow-2xl");
    });
  });
}

document.addEventListener("DOMContentLoaded", initTestimonialsEffects);

// ==============================
// FOOTER PRO+ JS (Premium Animation)
// ==============================

// Smooth scroll for footer links
document.querySelectorAll(".footer-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Footer Reveal Animation
const footer = document.getElementById("mainFooter");
const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        footer.classList.remove("opacity-0", "translate-y-6");
      }
    });
  },
  { threshold: 0.2 }
);
footerObserver.observe(footer);

// Ripple Effect (for footer links)
document.querySelectorAll(".footer-link").forEach((btn) => {
  btn.style.position = "relative";
  btn.style.overflow = "hidden";

  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.left = `${e.clientX - btn.getBoundingClientRect().left}px`;
    ripple.style.top = `${e.clientY - btn.getBoundingClientRect().top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Floating Bar Fade-in on Scroll
const floatingBar = document.getElementById("floatingBar");
window.addEventListener("scroll", () => {
  floatingBar.style.opacity = window.scrollY > 200 ? "1" : "0.3";
});
