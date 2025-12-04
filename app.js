/********************************************
 * UTILITY HELPERS (GLOBAL)
 ********************************************/

// আইডি দিয়ে element নেওয়ার শর্টকাট
const $ = (id) => document.getElementById(id);

// CSS selector দিয়ে একাধিক element নেওয়ার শর্টকাট
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * বাইরে ক্লিক করলে যে কোনো popup/drawer বন্ধ করার helper
 * element = যে বক্স/মেনু বন্ধ করতে হবে
 * except  = যে বাটনে ক্লিক করলে বক্স খুলে (ওইটার উপরে ক্লিক করলে আবার বন্ধ হবে না)
 */
function clickOutside(element, except, callback) {
  if (!element || !except || !callback) return; // সেফটি চেক

  document.addEventListener("click", (e) => {
    if (!element.contains(e.target) && !except.contains(e.target)) {
      callback();
    }
  });
}

/********************************************
 * GLOBAL CART HELPERS  (UNIVERSAL)
 * - Same structure as single-product.js / cart page
 * - localStorage key: "lmf_cart"
 ********************************************/

const CART_KEY = "lmf_cart";

// localStorage থেকে cart বের করা
function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Error reading cart from localStorage:", e);
    return [];
  }
}

// cart localStorage এ সেভ করা
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Error saving cart to localStorage:", e);
  }
}

/**
 * Navbar cart badge update (Top + bottom)
 * - Uses #cartCount (header)
 * - Uses #bottomCartCount (mobile bottom nav → থাকলে)
 */
function updateCartBadge() {
  const cart = getCart();
  const qty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const top = document.getElementById("cartCount");
  const bottom = document.getElementById("bottomCartCount");

  if (top) top.textContent = qty;
  if (bottom) bottom.textContent = qty;
}

/********************************************
 * MASTER INIT (DOM READY)
 ********************************************/
document.addEventListener("DOMContentLoaded", () => {
  // Header / Navbar
  initSearchBox();
  initWishlistToggle();
  initUserMenu();
  initShopMegaMenu();
  initStickyHeader();
  initSmoothScroll();
  initMobileMenu();
  initMobileShopMenu();
  initBottomMenu();
  initActiveNavHighlight();
  initGlobalEscapeClose();
  initHeaderScrollHide();

  // Home page sections (যদি ওই সেকশনগুলো থাকে)
  initCategoryPremium();
  initProductSystem();
  initNewArrivalSlider();
  initFeaturedEffects();
  initTestimonialsEffects();
  initOfferBannerEffects();
  initFooterPro();

  // পেজ লোডে cart badge sync
  updateCartBadge();
});

/********************************************
 * MOBILE MENU (hamburger)
 ********************************************/
function initMobileMenu() {
  const btn = $("mobileMenuBtn");
  const menu = $("mobileMenu");

  if (!btn || !menu) return;

  // শুরুতেই style সেট না থাকলে 0 করে দিই
  if (!menu.style.maxHeight) {
    menu.style.maxHeight = "0px";
  }

  btn.addEventListener("click", () => {
    const isOpen = menu.style.maxHeight && menu.style.maxHeight !== "0px";

    if (isOpen) {
      // বন্ধ করার সময়
      menu.style.maxHeight = "0px";
      setTimeout(() => menu.classList.add("hidden"), 250);
    } else {
      // খোলার সময় => content এর আসল height অনুযায়ী
      menu.classList.remove("hidden");
      menu.style.maxHeight = menu.scrollHeight + "px"; // ✅ auto height
    }
  });
}

/********************************************
 * MOBILE SHOP DROPDOWN (inside mobile menu)
 ********************************************/
function initMobileShopMenu() {
  const btn = $("mobileMenuShop");   // mobile menu তে SHOP button
  const menu = $("mobileShopMenu");  // dropdown box

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

/********************************************
 * SEARCH BOX (Navbar search)
 ********************************************/
function initSearchBox() {
  const searchBtn = $("searchBtn");      // 🔍 বাটন (header)
  const searchBox = $("searchBox");      // ড্রপডাউন বক্স
  const searchClose = $("searchClose");  // ✕ ক্লোজ বাটন
  const searchInput = $("searchInput");  // ইনপুট ফিল্ড

  if (!searchBtn || !searchBox) return;

  // ওপেন / ক্লোজ টগল
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = searchBox.classList.contains("hidden");
    searchBox.classList.toggle("hidden");

    if (willOpen && searchInput) {
      // একটু delay দিয়ে focus দিলে UX ভালো লাগে
      setTimeout(() => searchInput.focus(), 50);
    }
  });

  // ক্লোজ বাটন
  searchClose?.addEventListener("click", () => {
    searchBox.classList.add("hidden");
  });

  // বক্সের বাইরে ক্লিক করলে বন্ধ
  clickOutside(searchBox, searchBtn, () => searchBox.classList.add("hidden"));

  // ✅ Enter প্রেস করলে products page এ search query পাঠিয়ে redirect
  // উদাহরণ: products.html?search=bag
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = searchInput.value.trim();
        if (!q) return;
        const encoded = encodeURIComponent(q);
        window.location.href = `products.html?search=${encoded}`;
      }
    });
  }
}

/********************************************
 * HEADER WISHLIST BUTTON (New HTML Compatible)
 ********************************************/
/**
 * আগের ভার্সনে wishIcon SVG ছিল, এখন শুধু ❤️ বাটন আছে।
 * তাই এখানে আমরা শুধু ছোট tap animation আর সেফ হ্যান্ডলিং রাখছি।
 * Navigation ইতিমধ্যে HTML এ `onclick="location.href='wishlist.html'"` দিয়ে করা আছে।
 */
function initWishlistToggle() {
  const wishBtn = $("wishBtn");

  // যদি header এ wishlist বাটনই না থাকে, কিছু করার দরকার নাই
  if (!wishBtn) return;

  // মোবাইলে নীল tap highlight remove
  wishBtn.style.webkitTapHighlightColor = "transparent";

  // ছোট press অ্যানিমেশন (mobile + desktop দুটোতেই সুন্দর দেখায়)
  const addPress = () => wishBtn.classList.add("scale-95");
  const removePress = () => wishBtn.classList.remove("scale-95");

  wishBtn.addEventListener("mousedown", addPress);
  wishBtn.addEventListener("mouseup", removePress);
  wishBtn.addEventListener("mouseleave", removePress);

  wishBtn.addEventListener(
    "touchstart",
    () => {
      addPress();
    },
    { passive: true }
  );
  wishBtn.addEventListener(
    "touchend",
    () => {
      removePress();
    },
    { passive: true }
  );

  // 👉 NOTE:
  // এখানে আর wishIcon / localStorage headerWish ব্যবহার করছি না,
  // কারণ নতুন HTML এ আলাদা কোনো icon element নেই।
  // Wishlist এর data সময় products / single-product পেইজে handle হবে।
}


/********************************************
 * USER MENU
 ********************************************/
function initUserMenu() {
  const btn = $("userBtn");
  const menu = $("userMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  clickOutside(menu, btn, () => menu.classList.add("hidden"));
}

/********************************************
 * SHOP MEGA MENU
 ********************************************/
function initShopMegaMenu() {
  const btn = $("shopBtn");
  const menu = $("megaMenu");
  if (!btn || !menu) return;

  // Click toggle
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const hide = menu.classList.contains("hidden");
    if (hide) {
      menu.classList.remove("hidden", "opacity-0");
    } else {
      menu.classList.add("opacity-0");
      setTimeout(() => menu.classList.add("hidden"), 150);
    }
  });

  // Hover open (desktop only)
  if (window.innerWidth > 768) {
    btn.addEventListener("mouseenter", () => {
      menu.classList.remove("hidden", "opacity-0");
    });
    menu.addEventListener("mouseleave", () => {
      menu.classList.add("opacity-0");
      setTimeout(() => menu.classList.add("hidden"), 150);
    });
  }

  clickOutside(menu, btn, () => {
    menu.classList.add("opacity-0");
    setTimeout(() => menu.classList.add("hidden"), 150);
  });
}

/********************************************
 * STICKY HEADER SHADOW
 ********************************************/
function initStickyHeader() {
  const header = $("mainHeader");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow-md", window.scrollY > 10);
  });
}

/********************************************
 * SMOOTH SCROLL
 ********************************************/
function initSmoothScroll() {
  const header = $("mainHeader");

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetID = link.getAttribute("href");
      if (!targetID.startsWith("#")) return;

      e.preventDefault();

      const target = document.querySelector(targetID);
      if (!target) return;

      const pos =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        header.offsetHeight;

      window.scrollTo({ top: pos, behavior: "smooth" });
    });
  });
}

/********************************************
 * BOTTOM MOBILE NAV
 ********************************************/
function initBottomMenu() {
  $("navHome")?.addEventListener("click", () => {
    window.location.hash = "#homeSection";
  });

  $("navSearch")?.addEventListener("click", () => $("searchBtn")?.click());

  $("navCart")?.addEventListener("click", () => {
    $("cartContainer")?.scrollIntoView({ behavior: "smooth" });
  });

  $("navUser")?.addEventListener("click", () => $("userBtn")?.click());
}

/********************************************
 * ACTIVE NAVIGATION HIGHLIGHT
 ********************************************/
function initActiveNavHighlight() {
  const links = $$(".nav-link");

  links.forEach((a) => {
    a.addEventListener("click", () => {
      links.forEach((x) => x.classList.remove("text-[#B60000]"));
      a.classList.add("text-[#B60000]");
    });
  });
}

/*
 * ESC → CLOSE ANY OPEN DROPDOWN
 */
function initGlobalEscapeClose() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $("searchBox")?.classList.add("hidden");
      $("userMenu")?.classList.add("hidden");
      $("megaMenu")?.classList.add("hidden");
    }
  });
}

/*
 * SCROLL DOWN → HEADER HIDE
 * SCROLL UP → HEADER SHOW
 */
function initHeaderScrollHide() {
  const header = $("mainHeader");
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const curr = window.scrollY;

    if (curr > lastY && curr > 80) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastY = curr;
  });
}

/*
 * CATEGORY SECTION EFFECTS (Smart Hybrid Edition)
 * ----------------------------------------------------------
 * ✓ Fade-in animation when categories appear
 * ✓ Center ripple effect (mobile-friendly)
 * ✓ Touch feedback (scale press)
 * ✓ Mobile horizontal scroll (Netflix Style)
 * ✓ Smooth scroll to product area
 * ✓ Category-based product filtering
 */
function initCategoryPremium() {
  const cards = document.querySelectorAll(".category-card");
  const productItems = document.querySelectorAll("[data-category]");
  const container = document.querySelector("#shopCategory");
  if (!cards.length) return;

  /* -------------------------------------------------------
     0) Remove blue tap highlight (Mobile polish)
  ------------------------------------------------------- */
  cards.forEach((card) => {
    card.style.webkitTapHighlightColor = "transparent";
  });

  /* -------------------------------------------------------
     1) Horizontal scroll on mobile (Netflix style)
  ------------------------------------------------------- */
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    if (window.innerWidth > 768) return;
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown || window.innerWidth > 768) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });

  /* -------------------------------------------------------
     2) Fade-in animation (Intersection Observer)
  ------------------------------------------------------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-3");
      });
    },
    { threshold: 0.2 }
  );

  /* -------------------------------------------------------
     3) Ripple effect (center ripple)
  ------------------------------------------------------- */
  function createRipple(card) {
    const ripple = document.createElement("span");
    ripple.className =
      "absolute w-12 h-12 bg-yellow-300/40 rounded-full animate-[ping_0.7s_ease-out]";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.transform = "translate(-50%, -50%)";
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  /* -------------------------------------------------------
     4) Product filter on category click
  ------------------------------------------------------- */
  function filterProducts(category) {
    productItems.forEach((item) => {
      const match = item.dataset.category === category;
      item.style.display = match ? "block" : "none";
    });
  }

  /* -------------------------------------------------------
     5) Setup each category card
  ------------------------------------------------------- */
  cards.forEach((card) => {
    const category = card.dataset.category; // <-- এইটার জন্য HTML-এ data-category লাগবে

    /* fade default classes */
    card.classList.add(
      "opacity-0",
      "translate-y-3",
      "transition-all",
      "duration-700"
    );

    observer.observe(card);

    /* ripple required */
    card.style.position = "relative";
    card.style.overflow = "hidden";

    /* mobile press scale */
    card.addEventListener("touchstart", () => {
      card.classList.add("scale-95");
    });
    card.addEventListener("touchend", () => {
      card.classList.remove("scale-95");
    });

    /* category click handler */
    card.addEventListener("click", () => {
      createRipple(card);

      // 1) Remove old active states
      cards.forEach((c) => c.classList.remove("ring-2", "ring-[#FFD600]"));

      // 2) Add active highlight
      card.classList.add("ring-2", "ring-[#FFD600]");

      // 3) Filter products
      if (category) filterProducts(category);

      // 4) Scroll to product section
      const target = document.getElementById("newArrivalsSection");
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/*
 * PRODUCT SYSTEM (CART + WISHLIST + DETAILS)
 **/
function initProductSystem() {
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

  // Wishlist only এই ফাইলে হ্যান্ডেল হবে
  const getWishlist = () =>
    JSON.parse(localStorage.getItem("wishlist") || "[]");
  const saveWishlist = (list) =>
    localStorage.setItem("wishlist", JSON.stringify(list));

  /**
   * Add to Cart (Index Page)
   * - Same format as single-product.js:
   *   { id, name, price, image, qty }
   */
  function addToCart(id) {
    const cart = getCart();
    const idx = cart.findIndex((x) => x.id === id);

    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty || 0) + 1;
    } else {
      const p = PRODUCTS.find((prod) => prod.id === id);
      if (!p) return;

      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        qty: 1,
      });
    }

    saveCart(cart);
    updateCartBadge();
    alert("Added to cart!");
  }

  function toggleWishlist(id) {
    let wl = getWishlist();
    if (wl.includes(id)) {
      wl = wl.filter((x) => x !== id);
      alert("Removed from wishlist!");
    } else {
      wl.push(id);
      alert("Added to wishlist!");
    }
    saveWishlist(wl);
  }

  // product cards in grids
  function initProductCardButtons() {
    const cards = document.querySelectorAll(".product-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const id = card.dataset.id;
      if (!id) return;

      card
        .querySelector(".add-to-cart")
        ?.addEventListener("click", () => addToCart(id));

      card
        .querySelector(".add-to-wishlist")
        ?.addEventListener("click", () => toggleWishlist(id));

      card.querySelector(".view-details")?.addEventListener("click", () => {
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) return;
        renderProductDetails(
          document.getElementById("productDetails"),
          product
        );
        document
          .getElementById("productDetails")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function initProductsPage() {
    const listEl = document.getElementById("productList");
    const search = document.getElementById("productSearch");
    const box = document.getElementById("searchSuggestions");

    if (!listEl || !search || !box) return;

    function cardHTML(p) {
      return `
        <div class="product-card bg-white rounded-xl shadow-md hover:shadow-xl border-t-4 border-[#B60000] p-3" data-id="${p.id}">
          <img src="${p.image}" class="w-full h-40 object-cover rounded-lg" />
          <h3 class="mt-2 font-semibold text-gray-800">${p.name}</h3>
          <p class="text-[#B60000] font-bold">৳ ${p.price}</p>
          <button class="add-to-cart w-full bg-[#FFD600] mt-2 py-1 rounded">Add to Cart</button>
          <button class="add-to-wishlist w-full border border-[#B60000] mt-2 py-1 rounded">♥</button>
          <button class="view-details w-full text-sm underline mt-2">View Details</button>
        </div>
      `;
    }

    function render(products) {
      listEl.innerHTML = products.map(cardHTML).join("");
      initProductCardButtons();
    }

    render(PRODUCTS);

    search.addEventListener("input", () => {
      const q = search.value.toLowerCase();
      const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));

      render(filtered);

      if (!q) return box.classList.add("hidden"), (box.innerHTML = "");

      box.innerHTML = filtered
        .slice(0, 5)
        .map(
          (p) =>
            `<div class="px-2 py-1 hover:bg-red-100 cursor-pointer" data-id="${p.id}">${p.name}</div>`
        )
        .join("");

      box.classList.remove("hidden");

      box.querySelectorAll("div").forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.dataset.id;
          const p = PRODUCTS.find((x) => x.id === id);
          if (!p) return;
          renderProductDetails(document.getElementById("productDetails"), p);
          document
            .getElementById("productDetails")
            ?.scrollIntoView({ behavior: "smooth" });
        });
      });
    });
  }

  function renderProductDetails(container, p) {
    if (!container) return;
    container.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6 bg-white rounded-xl shadow p-4 border-t-4 border-[#B60000]">
        <img src="${p.image}" class="rounded-lg shadow w-full" />
        <div>
          <h1 class="text-2xl font-bold text-[#B60000]">${p.name}</h1>
          <p class="text-xl font-semibold">৳ ${p.price}</p>
          <button id="detailsAddToCart" class="bg-[#FFD600] text-[#B60000] px-4 py-2 rounded w-full mt-3">Add to Cart</button>
          <button id="detailsWish" class="border border-[#B60000] px-4 py-2 rounded w-full mt-2">♥</button>
        </div>
      </div>
    `;

    document
      .getElementById("detailsAddToCart")
      ?.addEventListener("click", () => addToCart(p.id));

    document
      .getElementById("detailsWish")
      ?.addEventListener("click", () => toggleWishlist(p.id));
  }

  // Initialize
  initProductCardButtons();
  initProductsPage();
  updateCartBadge(); // index পেজ থেকেই badge ঠিক থাকবে
}

/*
 * AUTH MODAL
 */
function initAuthModal() {
  const overlay = document.getElementById("authOverlay");
  const close = document.getElementById("authClose");

  const loginLinks = document.querySelectorAll("#userMenu a:first-child");

  if (!overlay || !close) return;

  loginLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.classList.remove("hidden");
    })
  );

  close.addEventListener("click", () => overlay.classList.add("hidden"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
}

/*
/**
 * NEW ARRIVAL SLIDER (Smart + Mobile Perfect Edition)
 * ----------------------------------------------------------
 * ✓ Arrow control
 * ✓ Scale effect while scrolling
 * ✓ Fade-in animation on view
 * ✓ Mobile swipe boost
 * ✓ Auto snap to nearest card
 * ✓ Disable/Enable arrows on edges
 * ✓ Responsive STEP (card width অনুযায়ী)
 */
function initNewArrivalSlider() {
  const slider = document.getElementById("arrivalSlider");
  const next = document.getElementById("arrivalNext");
  const prev = document.getElementById("arrivalPrev");

  // সেফটি চেক – কিছু না পেলে সরাসরি return
  if (!slider || !next || !prev) return;

  // সব card element গুলো সংগ্রহ করি
  const cards = Array.from(slider.children).filter(
    (el) => el.nodeType === 1
  );
  if (!cards.length) {
    // যদি কার্ডই না থাকে → arrow দরকার নেই
    next.style.display = "none";
    prev.style.display = "none";
    return;
  }

  // STEP = প্রথম কার্ডের width + একটু gap (responsive)
  let STEP = 280;
  const firstCardWidth = cards[0].offsetWidth;
  if (firstCardWidth && !Number.isNaN(firstCardWidth)) {
    STEP = firstCardWidth + 24; // 24px মানে approx gap
  }

  // Mobile tap highlight remove
  slider.style.webkitTapHighlightColor = "transparent";

  /* -------------------------------
     Arrow Controls
  ------------------------------- */
  next.addEventListener("click", () => {
    slider.scrollBy({ left: STEP, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    slider.scrollBy({ left: -STEP, behavior: "smooth" });
  });

  /* -------------------------------
     Disable arrows on edges
  ------------------------------- */
  function updateArrows() {
    // বাম দিকে আর স্ক্রল করার জায়গা নেই
    if (slider.scrollLeft <= 10) {
      prev.style.opacity = "0.3";
      prev.style.pointerEvents = "none";
    } else {
      prev.style.opacity = "1";
      prev.style.pointerEvents = "auto";
    }

    // ডান দিকের শেষ প্রান্তে পৌঁছে গেলে
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      next.style.opacity = "0.3";
      next.style.pointerEvents = "none";
    } else {
      next.style.opacity = "1";
      next.style.pointerEvents = "auto";
    }
  }

  /* -------------------------------
     Fade-in animation for cards
  ------------------------------- */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach((card) => {
    card.classList.add(
      "opacity-0",
      "translate-y-2",
      "transition-all",
      "duration-700"
    );
    fadeObserver.observe(card);
  });

  /* -------------------------------
     Scroll: scale + arrows + snap debounce
  ------------------------------- */
  let snapTimeout;
  let ticking = false; // scroll performance এর জন্য

  slider.addEventListener("scroll", () => {
    // scale + arrows অংশকে rAF এর ভিতরে দিচ্ছি performance ভালো রাখার জন্য
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const screenCenter = window.innerWidth / 2;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(screenCenter - cardCenter);

          // distance অনুযায়ী scale কমানো/বাড়ানো
          const scale = 1 - Math.min(distance / 1000, 0.12);
          card.style.transform = `scale(${scale})`;
        });

        updateArrows();
        ticking = false;
      });
      ticking = true;
    }

    // Snap debounce: scroll থেমে গেলে কাছের কার্ডে snap করবে
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      let nearestCard = null;
      let minDist = Infinity;
      const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - sliderCenter);

        if (dist < minDist) {
          minDist = dist;
          nearestCard = card;
        }
      });

      if (nearestCard) {
        slider.scrollTo({
          left: nearestCard.offsetLeft - 20,
          behavior: "smooth",
        });
      }
    }, 120);
  });

  /* -------------------------------
     Mobile Swipe Momentum Boost
  ------------------------------- */
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      touchEndX = e.changedTouches[0].clientX;

      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        slider.scrollBy({
          left: diff > 0 ? STEP : -STEP,
          behavior: "smooth",
        });
      }
    },
    { passive: true }
  );

  // প্রথম অবস্থাতেই arrow ঠিক করে নেওয়া
  updateArrows();
}

/*
 * FEATURED SECTION EFFECTS (Premium Edition)
 * ----------------------------------------------------------
 * ✓ Fade-in + stagger (একবারই অ্যানিমেট হবে, স্ক্রলে আবার লুকাবে না)
 * ✓ Ripple effect on card tap/click
 * ✓ Shine effect on images (throttled – DOM স্প্যাম হবে না)
 * ✓ Desktop + Mobile দুটোতেই ঠিকভাবে কাজ করবে
 */

function initFeaturedEffects() {
  const cards = document.querySelectorAll("#featuredSection .featured-card");
  const images = document.querySelectorAll("#featuredSection .featured-card img");

  if (!cards.length) return;

  // মোবাইল ডিভাইস ডিটেকশন (width + pointer দুটোই চেক)
  const isMobile =
    window.matchMedia("(max-width: 640px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  /* ---------------------------------------------------
     Fade-in + Stagger Animation (IntersectionObserver)
  --------------------------------------------------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // শুধু একবারই অ্যানিমেশন চালিয়ে পরে unobserve করে দিচ্ছি
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  /* ---------------------------------------------------
     CARD LOOP
  --------------------------------------------------- */
  cards.forEach((card, index) => {
    // স্ট্যাগার delay – কার্ডের অর্ডার অনুযায়ী
    card.style.transitionDelay = `${index * 0.1}s`;

    observer.observe(card);

    // মোবাইলে ট্যাপ হাইলাইট রিমুভ
    card.style.webkitTapHighlightColor = "transparent";
    card.style.position = "relative";
    card.style.overflow = "hidden";

    /* ---------------------------------------------------
       DESKTOP HOVER SCALE (mobile auto-disable)
    --------------------------------------------------- */
    if (!isMobile) {
      card.addEventListener("mouseenter", () => {
        card.classList.add("scale-[1.02]");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("scale-[1.02]");
      });
    }

    /* ---------------------------------------------------
       RIPPLE EFFECT on CLICK/TAP
       - কার্ড ক্লিক করলে হলুদ গোল ছায়া ছোট টাইমের জন্য দেখাবে
    --------------------------------------------------- */
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className =
        "absolute bg-yellow-300/40 rounded-full animate-[ping_0.7s_ease-out] w-10 h-10 pointer-events-none";

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = `${x - 20}px`;
      ripple.style.top = `${y - 20}px`;

      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------------------------------------------------
     IMAGE SHINE EFFECT (Desktop only)
     - mousemove এ DOM স্প্যাম না হয় তাই throttle করা হয়েছে
  --------------------------------------------------- */
  if (!isMobile) {
    images.forEach((img) => {
      // ইমেজের উপরের wrapper div (যেখানে aspect-[4/5] আছে) নেবো
      const wrapper = img.closest(".aspect-[4/5]") || img.parentElement;
      if (!wrapper) return;

      wrapper.style.position = "relative";
      wrapper.style.overflow = "hidden";

      let shining = false; // থ্রটল ফ্ল্যাগ

      wrapper.addEventListener("mousemove", () => {
        if (shining) return; // আগের shine শেষ না হওয়া পর্যন্ত নতুন বানাবো না
        shining = true;

        const shine = document.createElement("span");
        shine.className =
          "pointer-events-none absolute top-0 left-0 w-full h-full " +
          "bg-gradient-to-r from-transparent via-white/40 to-transparent " +
          "translate-x-[-100%] animate-[shine_0.6s_ease-out_forwards]";

        wrapper.appendChild(shine);

        setTimeout(() => {
          shine.remove();
          shining = false;
        }, 600);
      });
    });

    /*
      ⚠️ NOTE: উপরের animate-[shine_0.6s_ease-out_forwards] ক্লাস কাজ করাতে চাইলে
      Tailwind config-এ কাস্টম keyframes যোগ করতে হবে।
      না চাইলে উপরের class এর জায়গায় নিজের CSS অ্যানিমেশন ব্যবহার করতে পারো,
      অথবা একেবারে simple opacity-based effectও করতে পারো।
    */
  }
}

/*
 * TESTIMONIALS EFFECTS (Smart + Mobile Perfect)
 */
function initTestimonialsEffects() {
  const cards = document.querySelectorAll(
    "#testimonialsSection .testimonial-card"
  );
  const slider = document.getElementById("testimonialSlider");
  if (!cards.length || !slider) return;

  const isMobile = window.innerWidth < 640;

  /* Fade + Stagger Animation */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 0.1}s`;
          entry.target.classList.add("opacity-100", "translate-y-0");
        } else {
          entry.target.classList.remove("opacity-100", "translate-y-0");
        }
      });
    },
    { threshold: 0.25 }
  );

  cards.forEach((card) => {
    observer.observe(card);
    card.style.webkitTapHighlightColor = "transparent";

    /* Hover effect (desktop only) */
    if (!isMobile) {
      card.addEventListener("mouseenter", () => {
        card.classList.add("scale-[1.03]", "shadow-xl");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("scale-[1.03]", "shadow-xl");
      });
    }

    /* Touch Press Effect (mobile only) */
    if (isMobile) {
      card.addEventListener("touchstart", () => {
        card.classList.add("scale-95");
      });

      card.addEventListener("touchend", () => {
        card.classList.remove("scale-95");
      });
    }
  });

  /* Auto-Center After Swipe (Mobile Only) */
  if (isMobile) {
    let isDragging = false;

    slider.addEventListener("touchstart", () => {
      isDragging = true;
    });

    slider.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      // Find card closest to center
      let closest = null;
      let closestDist = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - window.innerWidth / 2);

        if (dist < closestDist) {
          closestDist = dist;
          closest = card;
        }
      });

      // Auto-center selected card
      if (closest) {
        closest.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    });
  }
}

/*
 * OFFER BANNER EFFECTS (Smart + Mobile Premium Edition)
 * ----------------------------------------------------------
 * ✓ Text fade & slide-up
 * ✓ Image fade + smooth zoom
 * ✓ Stagger delay (pro look)
 * ✓ Mobile optimized smoothness
 * ✓ Scroll-out reset for re-animation
 */
function initOfferBannerEffects() {
  const text = document.getElementById("offerText");
  const image = document.getElementById("offerImage");

  if (!text || !image) return;

  /* -------------------------
     Helper: Reset animation
  ------------------------- */
  function resetAnim(el) {
    el.classList.add("opacity-0", "translate-y-5");
    el.style.transform = "scale(1)";
  }

  resetAnim(text);
  resetAnim(image);

  /* -------------------------
     Mobile smooth settings
  ------------------------- */
  const isMobile = window.innerWidth < 600;
  const speed = isMobile ? "0.8s" : "0.7s";

  /* -------------------------
     Observer for animation
  ------------------------- */
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // COMMON fade effect
          el.classList.remove("opacity-0", "translate-y-5");
          el.style.transition = `all ${speed} ease-out`;

          // TEXT comes first
          if (el.id === "offerText") {
            el.style.transitionDelay = "0.1s";
          }

          // IMAGE comes second + zoom
          if (el.id === "offerImage") {
            el.style.transitionDelay = "0.3s";
            el.style.transform = "scale(1.05)";

            setTimeout(() => {
              el.style.transform = "scale(1)";
            }, 400);
          }
        } else {
          // Reset when out of view (smart re-animate)
          resetAnim(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  obs.observe(text);
  obs.observe(image);

  /* -------------------------
     Remove tap highlight (mobile polish)
  ------------------------- */
  text.style.webkitTapHighlightColor = "transparent";
  image.style.webkitTapHighlightColor = "transparent";
}

/********************************************
 * FOOTER PRO – Smart + Mobile Optimized
 * - Year auto set
 * - Back to top
 * - Copy phone with toast
 * - Footer reveal on scroll
 * - Mobile-safe (no runtime error)
 ********************************************/
function initFooterPro() {
  // সব দরকারি এলিমেন্টগুলি ধরে আনা
  const back = document.getElementById("backToTop");
  const copyBtn = document.getElementById("copyPhone");
  const toast = document.getElementById("toast");
  const footer = document.querySelector("footer");
  const links = document.querySelectorAll(".footerLink");
  const socialIcons = document.querySelectorAll(".footerIcon");
  const year = document.getElementById("year");

  /* ---------------------------------------
   * Year auto update (যদি span থাকে)
   * ------------------------------------- */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------
   * Back to Top button (safe check)
   * ------------------------------------- */
  if (back) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        back.classList.remove("hidden");
        back.classList.add("opacity-100");
      } else {
        back.classList.add("hidden");
        back.classList.remove("opacity-100");
      }
    });

    back.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------
   * Copy Phone Number with toast
   * ------------------------------------- */
  if (copyBtn && toast) {
    copyBtn.addEventListener("click", async () => {
      const phoneNumber = "01775539131"; // ✅ tel লিঙ্কের সাথে মিল আছে

      try {
        // modern browser clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(phoneNumber);
        } else {
          // fallback (পুরোনো ব্রাউজার)
          const tempInput = document.createElement("input");
          tempInput.value = phoneNumber;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }

        toast.textContent = "Copied!";
      } catch (err) {
        console.error("Copy failed:", err);
        toast.textContent = "Copy failed!";
      }

      // toast show
      toast.classList.remove("hidden", "opacity-0");
      toast.classList.add("opacity-100");

      // toast hide
      setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
        setTimeout(() => toast.classList.add("hidden"), 300);
      }, 1200);
    });
  }

  /* ---------------------------------------
   * Footer Links Hover (ডেস্কটপ UX)
   * ------------------------------------- */
  if (links && links.length) {
    links.forEach((l) => {
      l.addEventListener("mouseenter", () => {
        l.classList.add("tracking-wide", "text-yellow-300");
      });
      l.addEventListener("mouseleave", () => {
        l.classList.remove("tracking-wide", "text-yellow-300");
      });
    });
  }

  /* ---------------------------------------
   * Social Icons Tap Animation (Mobile ok)
   * ------------------------------------- */
  if (socialIcons && socialIcons.length) {
    socialIcons.forEach((icon) => {
      icon.style.webkitTapHighlightColor = "transparent"; // মোবাইল tap highlight remove

      icon.addEventListener("click", () => {
        icon.classList.add("scale-110");
        setTimeout(() => icon.classList.remove("scale-110"), 200);
      });
    });
  }

  /* ---------------------------------------
   * Footer Reveal Animation (IntersectionObserver safe)
   * ------------------------------------- */
  if (footer && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            footer.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(footer);
  } else if (footer) {
    // fallback: observer না থাকলে সরাসরি visible করে দেই
    footer.classList.add("opacity-100", "translate-y-0");
  }
}

/* ---------------------------------------
 * DOM লোড হওয়ার পর init কল করা
 * ------------------------------------- */
document.addEventListener("DOMContentLoaded", initFooterPro);
