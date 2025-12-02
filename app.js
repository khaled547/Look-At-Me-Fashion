/********************************************
 * UTILITY HELPERS (GLOBAL)
 ********************************************/
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

function clickOutside(element, except, callback) {
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
  initSearchBox();
  initWishlistToggle();
  initUserMenu();
  initShopMegaMenu();
  initStickyHeader();
  initSmoothScroll();
  initMobileMenu();
  initBottomMenu();
  initActiveNavHighlight();
  initGlobalEscapeClose();
  initHeaderScrollHide();

  /* ADD THESE */
  initCategoryPremium();
  initProductSystem();
  initNewArrivalSlider();
  initFeaturedEffects();
  initTestimonialsEffects();
  initOfferBannerEffects();
  initFooterPro();
  initMobileShopMenu();

  // 🔔 Page load হওয়ার সাথে সাথে cart badge sync
  updateCartBadge();
});

/********************************************
 * MOBILE MENU
 ********************************************/
function initMobileMenu() {
  const btn = $("mobileMenuBtn");
  const menu = $("mobileMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.style.maxHeight && menu.style.maxHeight !== "0px";

    if (open) {
      // বন্ধ করার সময়
      menu.style.maxHeight = "0px";
      setTimeout(() => menu.classList.add("hidden"), 250);
    } else {
      // খোলার সময় => content যত লম্বা, height তত
      menu.classList.remove("hidden");
      menu.style.maxHeight = menu.scrollHeight + "px"; // ✅ auto height
    }
  });
}

/********************************************
 * MOBILE SHOP DROPDOWN (inside mobile menu)
 ********************************************/
function initMobileShopMenu() {
  const btn = $("mobileMenuShop"); // mobile menu তে SHOP button
  const menu = $("mobileShopMenu"); // dropdown box

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

/********************************************
 * SEARCH BOX
 ********************************************/
function initSearchBox() {
  const searchBtn = $("searchBtn");
  const searchBox = $("searchBox");
  const searchClose = $("searchClose");
  const searchInput = $("searchInput");

  if (!searchBtn || !searchBox) return;

  // Open
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.classList.toggle("hidden");
    if (!searchBox.classList.contains("hidden")) searchInput?.focus();
  });

  searchClose?.addEventListener("click", () => {
    searchBox.classList.add("hidden");
  });

  clickOutside(searchBox, searchBtn, () => searchBox.classList.add("hidden"));
}

/********************************************
 * HEADER WISHLIST
 ********************************************/
function initWishlistToggle() {
  const wishBtn = $("wishBtn");
  const wishIcon = $("wishIcon");
  if (!wishBtn || !wishIcon) return;

  let active = localStorage.getItem("headerWish") === "true";

  const update = () => {
    wishIcon.setAttribute("fill", active ? "#B60000" : "none");
    wishIcon.setAttribute("stroke", active ? "#B60000" : "currentColor");
  };

  update();

  wishBtn.addEventListener("click", () => {
    active = !active;
    update();
    localStorage.setItem("headerWish", active);
  });
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
 * NEW ARRIVAL SLIDER (Smart + Mobile Perfect Edition)
 * ----------------------------------------------------------
 * ✓ Arrow control
 * ✓ Scale effect while scrolling
 * ✓ Fade-in animation on view
 * ✓ Mobile swipe boost
 * ✓ Auto snap to nearest card
 * ✓ Disable/Enable arrows on edges
 * ✓ Clean & readable code
 */
function initNewArrivalSlider() {
  const slider = document.getElementById("arrivalSlider");
  const next = document.getElementById("arrivalNext");
  const prev = document.getElementById("arrivalPrev");

  if (!slider || !next || !prev) return;

  /* -------------------------------
     Basic Setup
  ------------------------------- */
  const STEP = 280; // slide distance
  const cards = slider.children;

  // Remove mobile tap highlight
  slider.style.webkitTapHighlightColor = "transparent";

  /* -------------------------------
     Arrow Controls
  ------------------------------- */
  next.addEventListener("click", () =>
    slider.scrollBy({ left: STEP, behavior: "smooth" })
  );

  prev.addEventListener("click", () =>
    slider.scrollBy({ left: -STEP, behavior: "smooth" })
  );

  /* -------------------------------
     Disable arrows on edges
  ------------------------------- */
  function updateArrows() {
    prev.style.opacity = slider.scrollLeft <= 10 ? "0.3" : "1";
    next.style.opacity =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10
        ? "0.3"
        : "1";
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

  Array.from(cards).forEach((card) => {
    card.classList.add(
      "opacity-0",
      "translate-y-2",
      "transition-all",
      "duration-700"
    );
    fadeObserver.observe(card);
  });

  /* -------------------------------
     Scroll scale effect
  ------------------------------- */
  slider.addEventListener("scroll", () => {
    const screenCenter = window.innerWidth / 2;

    Array.from(cards).forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(screenCenter - cardCenter);

      // smooth scale
      const scale = 1 - Math.min(distance / 1000, 0.12);
      card.style.transform = `scale(${scale})`;
    });

    updateArrows();
  });

  /* -------------------------------
     Mobile Swipe Momentum Boost
  ------------------------------- */
  let touchStart = 0;
  let touchEnd = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStart = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEnd = e.changedTouches[0].clientX;

    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Small swipe = big movement (boost)
      slider.scrollBy({
        left: diff > 0 ? STEP : -STEP,
        behavior: "smooth",
      });
    }
  });

  /* -------------------------------
     Auto Snap to nearest card
  ------------------------------- */
  let snapTimeout;
  slider.addEventListener("scroll", () => {
    clearTimeout(snapTimeout);

    snapTimeout = setTimeout(() => {
      let nearestCard = null;
      let minDist = Infinity;
      const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;

      Array.from(cards).forEach((card) => {
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

  updateArrows(); // initial update
}

/*
 * FEATURED SECTION EFFECTS (Ripple + Shine + Animation)
 * ----------------------------------------------------------
 * ✓ Fade-in + stagger
 * ✓ Ripple effect on card tap/click
 * ✓ Shine effect on images
 * ✓ Mobile perfect
 */
function initFeaturedEffects() {
  const cards = document.querySelectorAll("#featuredSection .featured-card");
  const images = document.querySelectorAll(
    "#featuredSection .featured-card img"
  );
  if (!cards.length) return;

  const isMobile = window.innerWidth < 640;

  /* ---------------------------------------------------
     Fade-in + Stagger Animation
  --------------------------------------------------- */
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

  /* ---------------------------------------------------
     CARD LOOP
  --------------------------------------------------- */
  cards.forEach((card) => {
    observer.observe(card);

    // Remove default tap highlight
    card.style.webkitTapHighlightColor = "transparent";
    card.style.position = "relative";
    card.style.overflow = "hidden";

    /* ---------------------------------------------------
       DESKTOP HOVER SCALE (mobile auto-disable)
    --------------------------------------------------- */
    if (!isMobile) {
      card.addEventListener("mouseenter", () =>
        card.classList.add("scale-[1.02]")
      );
      card.addEventListener("mouseleave", () =>
        card.classList.remove("scale-[1.02]")
      );
    }

    /* ---------------------------------------------------
       RIPPLE EFFECT on CLICK/TAP
    --------------------------------------------------- */
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className =
        "absolute bg-yellow-300/40 rounded-full animate-[ping_0.7s_ease-out] w-10 h-10";

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
     IMAGE SHINE EFFECT
  --------------------------------------------------- */
  images.forEach((img) => {
    img.style.position = "relative";
    img.style.overflow = "hidden";

    img.addEventListener("mousemove", () => {
      const shine = document.createElement("span");
      shine.className =
        "absolute top-0 left-0 w-full h-full pointer-events-none shine-effect";

      img.parentElement.appendChild(shine);

      setTimeout(() => shine.remove(), 600);
    });
  });
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
 ********************************************/
function initFooterPro() {
  const back = document.getElementById("backToTop");
  const copyBtn = document.getElementById("copyPhone");
  const toast = document.getElementById("toast");
  const footer = document.querySelector("footer");
  const links = document.querySelectorAll(".footerLink");
  const socialIcons = document.querySelectorAll(".footerIcon");
  const year = document.getElementById("year");

  /* Update Year */
  year.textContent = new Date().getFullYear();

  /* Back to Top */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      back.classList.remove("hidden");
      back.classList.add("opacity-100");
    } else {
      back.classList.add("hidden");
      back.classList.remove("opacity-100");
    }
  });

  back.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* Copy Phone Number */
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("01775539131");

    toast.textContent = "Copied!";
    toast.classList.remove("hidden", "opacity-0");

    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 1200);
  });

  /* Footer Links Hover */
  links.forEach((l) => {
    l.addEventListener("mouseenter", () =>
      l.classList.add("tracking-wide", "text-yellow-300")
    );
    l.addEventListener("mouseleave", () =>
      l.classList.remove("tracking-wide", "text-yellow-300")
    );
  });

  /* Social Icons Tap Animation */
  socialIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.add("scale-110");
      setTimeout(() => icon.classList.remove("scale-110"), 200);
    });
  });

  /* Footer Reveal Animation */
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting)
          footer.classList.add("opacity-100", "translate-y-0");
      });
    },
    { threshold: 0.2 }
  );

  obs.observe(footer);
}
