console.log("HEADER JS LOADED");

// Header sction

//Mobile Menu Toggle

const mobileBtn = document.getElementById("mobile-menu-btn");
const drawer = document.getElementById("mobile-drawer");
const checkbox = document.getElementById("nav-toggle");

const mobileMenuLinks = drawer ? drawer.querySelectorAll("a") : [];

if (mobileBtn && drawer && checkbox) {
  mobileBtn.addEventListener("click", () => {
    drawer.classList.toggle("max-h-[480px]");
    checkbox.checked = !checkbox.checked;
  });

  // প্রতি link এ click → drawer বন্ধ
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      drawer.classList.remove("max-h-[480px]");
      checkbox.checked = false;
    });
  });
}

//user mobile এ menu খুলল, তারপর window বড় করল (inspect / rotate / resize) → তখনও drawer open থাকে

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    if (drawer && checkbox) {
      drawer.classList.remove("max-h-[480px]");
      checkbox.checked = false;
    }
  }
});

//Scroll করলে header এ shadow add করা

const headerE1 = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (!headerE1) return;

  if (window.scrollY > 10) {
    headerE1.classList.add("shadow-md", "bg-white");
  } else {
    headerE1.classList.remove("shadow-md", "bg-white");
  }
});

// Cart count update

const cartCountE1 = document.getElementById("cart-count");

let cartCount = 0;

function updateCartCount(newCount) {
  cartCount = newCount;

  if (cartCountE1) {
    cartCountE1.textContent = String(cartCount);
  }
}
updateCartCount(5);
