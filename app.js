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
  initCategoryPremium();
  initProductSystem();
  initAuthModal();
  initNewArrivalSlider();
  initFeaturedEffects();
  initTestimonialsEffects();
  initOfferBannerEffects();
  initFooterPro();
});

/********************************************
 * SEARCH TOGGLE
 ********************************************/
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

/********************************************
 * HEADER WISHLIST TOGGLE
 ********************************************/
function initWishlistToggle() {
  const wishBtn = document.getElementById("wishBtn");
  const wishIcon = document.getElementById("wishIcon");
  if (!wishBtn || !wishIcon) return;

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

/********************************************
 * USER MENU
 ********************************************/
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

/********************************************
 * MEGA MENU (SHOP)
 ********************************************/
function initShopMegaMenu() {
  const shopBtn = document.getElementById("shopBtn");
  const megaMenu = document.getElementById("megaMenu");
  if (!shopBtn || !megaMenu) return;

  shopBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const hidden = megaMenu.classList.contains("hidden");
    if (hidden) {
      megaMenu.classList.remove("hidden");
      requestAnimationFrame(() => megaMenu.classList.remove("opacity-0"));
    } else {
      megaMenu.classList.add("opacity-0");
      setTimeout(() => megaMenu.classList.add("hidden"), 150);
    }
  });

  document.addEventListener("click", (e) => {
    if (!megaMenu.contains(e.target) && !shopBtn.contains(e.target)) {
      megaMenu.classList.add("opacity-0");
      setTimeout(() => megaMenu.classList.add("hidden"), 150);
    }
  });
}

/********************************************
 * HEADER SCROLL SHADOW
 ********************************************/
function initStickyHeader() {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) header.classList.add("shadow-md");
    else header.classList.remove("shadow-md");
  });
}

/********************************************
 * SMOOTH SCROLL (#links)
 ********************************************/
function initSmoothScroll() {
  const header = document.getElementById("mainHeader");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!header || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      event.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      const finalPos =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        header.offsetHeight;

      window.scrollTo({ top: finalPos, behavior: "smooth" });
    });
  });
}

/********************************************
 * MOBILE MENU
 ********************************************/
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const linkShop = document.getElementById("mobileShopLink");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    if (menu.style.maxHeight && menu.style.maxHeight !== "0px") {
      menu.style.maxHeight = "0px";
      setTimeout(() => menu.classList.add("hidden"), 250);
    } else {
      menu.classList.remove("hidden");
      menu.style.maxHeight = "260px";
    }
  });

  if (linkShop) {
    linkShop.addEventListener("click", () => {
      const target = document.getElementById("shopCategory");
      if (!target) return;

      const header = document.getElementById("mainHeader");
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        (header ? header.offsetHeight : 0);

      window.scrollTo({ top, behavior: "smooth" });

      menu.style.maxHeight = "0px";
      setTimeout(() => menu.classList.add("hidden"), 250);
    });
  }
}

/********************************************
 * BOTTOM MOBILE MENU
 ********************************************/
function initBottomMenu() {
  const navHome = document.getElementById("navHome");
  const navSearch = document.getElementById("navSearch");
  const navCart = document.getElementById("navCart");
  const navUser = document.getElementById("navUser");

  if (navHome)
    navHome.addEventListener(
      "click",
      () => (window.location.hash = "#homeSection")
    );

  if (navSearch)
    navSearch.addEventListener("click", () => {
      const btn = document.getElementById("searchBtn");
      if (btn) btn.click();
    });

  if (navCart)
    navCart.addEventListener("click", () => {
      const cart = document.getElementById("cartContainer");
      if (cart) cart.scrollIntoView({ behavior: "smooth" });
      else alert("Cart section পাওয়া যায়নি!");
    });

  if (navUser)
    navUser.addEventListener("click", () => {
      const btn = document.getElementById("userBtn");
      if (btn) btn.click();
    });
}

/********************************************
 * CATEGORY EFFECTS (FADE + RIPPLE)
 ********************************************/
function initCategoryPremium() {
  const cards = document.querySelectorAll(".category-card");
  if (!cards.length) return;

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

    // Ripple
    card.style.position = "relative";
    card.style.overflow = "hidden";

    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className =
        "absolute w-5 h-5 bg-yellow-300/40 rounded-full animate-[ping_0.7s_ease-out]";

      const x = e.clientX - card.getBoundingClientRect().left;
      const y = e.clientY - card.getBoundingClientRect().top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);

      document
        .getElementById("newArrivalsSection")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/********************************************
 * PRODUCT SYSTEM (CART + WISHLIST + DETAILS)
 ********************************************/
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

  const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  const getWishlist = () =>
    JSON.parse(localStorage.getItem("wishlist") || "[]");
  const saveWishlist = (list) =>
    localStorage.setItem("wishlist", JSON.stringify(list));

  function updateCartBadge() {
    const cart = getCart();
    const qty = cart.reduce((sum, item) => sum + item.qty, 0);

    const top = document.getElementById("cartCount");
    const bottom = document.getElementById("bottomCartCount");

    if (top) top.textContent = qty;
    if (bottom) bottom.textContent = qty;
  }

  function addToCart(id) {
    const cart = getCart();
    const exist = cart.find((x) => x.id === id);

    if (exist) exist.qty += 1;
    else cart.push({ id, qty: 1 });

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
  updateCartBadge();
}

/********************************************
 * AUTH MODAL
 ********************************************/
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

/********************************************
 * NEW ARRIVAL SLIDER
 ********************************************/
function initNewArrivalSlider() {
  const slider = document.getElementById("arrivalSlider");
  const next = document.getElementById("arrivalNext");
  const prev = document.getElementById("arrivalPrev");

  if (!slider || !next || !prev) return;

  const step = 300;

  next.addEventListener("click", () =>
    slider.scrollBy({ left: step, behavior: "smooth" })
  );

  prev.addEventListener("click", () =>
    slider.scrollBy({ left: -step, behavior: "smooth" })
  );

  slider.addEventListener("scroll", () => {
    slider.querySelectorAll("div").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = window.innerWidth / 2;
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      const scale = 1 - Math.min(dist / 1000, 0.1);
      card.style.transform = `scale(${scale})`;
    });
  });
}

/********************************************
 * FEATURED SECTION EFFECTS
 ********************************************/
function initFeaturedEffects() {
  const cards = document.querySelectorAll("#featuredSection .featured-card");
  if (!cards.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting)
          e.target.classList.add("opacity-100", "translate-y-0");
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((c) => {
    obs.observe(c);

    c.addEventListener("mouseenter", () => c.classList.add("scale-[1.015]"));
    c.addEventListener("mouseleave", () => c.classList.remove("scale-[1.015]"));
  });
}

/********************************************
 * TESTIMONIALS EFFECTS
 ********************************************/
function initTestimonialsEffects() {
  const cards = document.querySelectorAll(
    "#testimonialsSection .testimonial-card"
  );

  if (!cards.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting)
          e.target.classList.add("opacity-100", "translate-y-0");
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((c) => {
    obs.observe(c);

    c.addEventListener("mouseenter", () =>
      c.classList.add("scale-[1.03]", "shadow-2xl")
    );
    c.addEventListener("mouseleave", () =>
      c.classList.remove("scale-[1.03]", "shadow-2xl")
    );
  });
}

/********************************************
 * OFFER SECTION ANIMATION
 ********************************************/
function initOfferBannerEffects() {
  const text = document.getElementById("offerText");
  const image = document.getElementById("offerImage");

  if (!text || !image) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("opacity-0", "translate-y-5");
        }
      });
    },
    { threshold: 0.2 }
  );

  obs.observe(text);
  obs.observe(image);
}

/********************************************
 * FOOTER PRO JS (Back to top, Copy, Year)
 ********************************************/
function initFooterPro() {
  // Smooth all # links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Back to top
  const back = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) back.classList.remove("hidden");
    else back.classList.add("hidden");
  });

  back?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // Update year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Copy phone
  document.getElementById("copyPhone").addEventListener("click", () => {
    navigator.clipboard.writeText("01775539131");
    alert("Phone number copied!");
  });

  // Footer hover animation
  document.querySelectorAll(".footerLink").forEach((link) => {
    link.addEventListener(
      "mouseover",
      () => (link.style.letterSpacing = "1px")
    );
    link.addEventListener("mouseout", () => (link.style.letterSpacing = "0px"));
  });
}
