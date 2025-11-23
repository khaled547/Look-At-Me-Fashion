// Search Toggle JS
function isIntersecting () {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");
  const searchClose = document.getElementById("searchClose");

  // Open / Close toggle
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.classList.toggle("hidden");
  });

  // Close by X button
  searchClose.addEventListener("click", () => {
    searchBox.classList.add("hidden");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
     if (!searchBox.contains(e.target) && !searchBtn.contains(e.target)) {
       searchBox.classList.add("hidden");
     }
  });
}
isIntersecting();

function initWishlistToggle() {
  const wishBtn = document.getElementById("wishBtn");
  const wishIcon = document.getElementById("wishIcon");

  if (!wishBtn || !wishIcon) {
    console.warn("Wishlist elements not found.");
    return;
  }


  //wish
  let wishActive = localStorage.getItem("wishActive") === "true";

  if (wishActive) {
    wishIcon.setAttribute("fill", "#B60000");
    wishIcon.setAttribute("stroke", "#B60000");
  }

  wishBtn.addEventListener("click", () => {
    wishActive = !wishActive;

    if (wishActive) {
      wishIcon.setAttribute("fill", "#B60000");
      wishIcon.setAttribute("stroke", "#B60000");
    } else {
      wishIcon.setAttribute("fill", "none");
      wishIcon.setAttribute("stroke", "currentColor");
    }

    localStorage.setItem("wishActive", wishActive);
  });
}

initWishlistToggle();



//Header section
// Shop click korle sob menu dekha jabe
const shopBtn = document.getElementById("shopBtn");
const megaMenu = document.getElementById("megaMenu");

// Open / Close toggle
shopBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  megaMenu.classList.toggle("hidden");
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const clickedInsideMenu = megaMenu.contains(event.target);
  const clickedOnButton = shopBtn.contains(event.target);

  if (!clickedInsideMenu && !clickedOnButton) {
    megaMenu.classList.add("hidden");
  }
});

//Sticky Navbar Shadow Animation
const header = document.getElementById("mainHeader");

window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    header.classList.add("shadow-md");
  } else {
    header.classList.remove("shadow.md");
  }
});

//Mega Menu Smooth Hover Delay Animation

let hoverTimer;

shopBtn.addEventListener("mouseenter", function () {
  clearTimeout(hoverTimer);

  hoverTimer = setTimeout(() => {
    megaMenu.classList.remove("hidden");
    megaMenu.classList.remove("opacity-0");
  }, 150);
});

megaMenu.addEventListener("mouseenter", function () {
  clearTimeout(hoverTimer);
});

shopBtn.addEventListener("mouseleave", function () {
  hoverTimer = setTimeout(() => {
    megaMenu.classList.add("opacity-0");

    setTimeout(() => {
      megaMenu.classList.add("hidden");
    }, 200);
  }, 150);
});

megaMenu.addEventListener("mouseleave", function () {
  hoverTimer = setTimeout(() => {
    megaMenu.classList.add("opacity-0");

    setTimeout(() => {
      megaMenu.classList.add("hidden");
    }, 200);
  }, 150);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});

// ===== Smooth Scroll Navbar Links =====

// Sticky header element ধরি (height later কাজে লাগবে)
const header1 = document.getElementById("mainHeader");

// সব nav-link গুলো ধরি (desktop + mobile)
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // default jump বন্ধ

    const targetId = this.getAttribute("href"); // যেমন #homeSection
    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    const headerHeight = header1.offsetHeight;

    // element top position
    const elementTop =
      targetElement.getBoundingClientRect().top + window.pageYOffset;

    const finalPosition = elementTop - headerHeight;

    // smooth scroll
    window.scrollTo({
      top: finalPosition,
      behavior: "smooth",
    });
  });
});

//Category Section

// CARD CLICK → OPEN PRODUCTS PAGE
const CategoryCards = document.querySelectorAll(".category-card");

CategoryCards.forEach(function (card) {
  card.addEventListener("click", function () {
    const categoryName = card.getAttribute("data-category");

    window.location.href = `products.html?cat=${categoryName}`;
  });
});
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".category-card").forEach(card => {
        card.classList.remove("opacity-0", "translate-y-4");
    });
});

//Smooth Fade-In + Slide-Up Animation

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("opacity-0", "translate-y-4");
      entry.target.classList.add("opacity-100", "translate-y-0");
    
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".category-card").forEach(card => {
  observer.observe(card);
});

// Ripple Click Effect

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");

    ripple.style.left = `${e.clientX - card.getBoundingClientRect().left}px`;
    ripple.style.top = `${e.clientY - card.getBoundingClientRect().top}px`;

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);


});
});


// footer 

