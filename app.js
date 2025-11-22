const shopBtn = document.getElementById("shopBtn");
const megaMenu = document.getElementById("megaMenu");

// Open / Close toggle
shopBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // important!
  megaMenu.classList.toggle("mega-open");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!megaMenu.contains(e.target) && e.target !== shopBtn) {
    megaMenu.classList.remove("mega-open");
  }
});
