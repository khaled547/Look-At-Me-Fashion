// admin-edit-product.js
// ===============================================
// ✔ Load product by ID
// ✔ Fill form
// ✔ Update product (PUT)
// ✔ Delete product (DELETE)
// ✔ Toast Notification
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:5000/api/products";
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const form = document.getElementById("editForm");
  const loadingBox = document.getElementById("loadingBox");
  const errorBox = document.getElementById("errorBox");

  const toast = document.getElementById("toast");

  // Inputs
  const nameEl = document.getElementById("prodName");
  const priceEl = document.getElementById("prodPrice");
  const categoryEl = document.getElementById("prodCategory");
  const imageEl = document.getElementById("prodImage");
  const descEl = document.getElementById("prodDesc");

  const deleteBtn = document.getElementById("deleteBtn");
  const subtitle = document.getElementById("editSubtitle");

  // -------------------------------------
  // Load Product
  // -------------------------------------
  async function loadProduct() {
    try {
      const res = await fetch(`${API_URL}/${productId}`);
      if (!res.ok) throw new Error();

      const product = await res.json();

      // Fill form
      nameEl.value = product.name;
      priceEl.value = product.price;
      categoryEl.value = product.category;
      imageEl.value = product.image;
      descEl.value = product.description || "";

      subtitle.textContent = `Editing: ${product.name}`;
      form.classList.remove("hidden");
      loadingBox.classList.add("hidden");

    } catch {
      loadingBox.classList.add("hidden");
      errorBox.classList.remove("hidden");
    }
  }

  loadProduct();

  // -------------------------------------
  // Update Product
  // -------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      name: nameEl.value.trim(),
      price: Number(priceEl.value),
      category: categoryEl.value.trim(),
      image: imageEl.value.trim(),
      description: descEl.value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error();

      showToast("Updated Successfully! ✅");

    } catch (err) {
      console.error(err);
      showToast("Failed to update ❌");
    }
  });

  // -------------------------------------
  // Delete Product
  // -------------------------------------
  deleteBtn.addEventListener("click", async () => {
    const yes = confirm("Are you sure you want to delete this product?");
    if (!yes) return;

    try {
      const res = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showToast("Deleted! 🗑");

      setTimeout(() => {
        window.location.href = "admin-product-list.html";
      }, 1200);

    } catch {
      showToast("Failed to delete ❌");
    }
  });

  // -------------------------------------
  // Toast Function
  // -------------------------------------
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0", "pointer-events-none");
    }, 1800);
  }
});
