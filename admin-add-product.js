// admin-add-product.js
// ==========================================
// Look At Me Fashion - Admin Add Product
// ==========================================
//
// ✔ Form থেকে ডাটা নেওয়া
// ✔ Basic validation
// ✔ Backend-এ POST করে save করা
// ✔ Success হলে Toast + Form reset
// ✔ Error হলে console + alert optional
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:5000/api/products";

  const formEl = document.getElementById("productForm");
  const nameEl = document.getElementById("prodName");
  const priceEl = document.getElementById("prodPrice");
  const catEl = document.getElementById("prodCategory");
  const imgEl = document.getElementById("prodImage");
  const descEl = document.getElementById("prodDescription");
  const resetBtn = document.getElementById("resetBtn");
  const toastEl = document.getElementById("toast");

  if (!formEl) return;

  // -----------------------------
  // Submit Handler
  // -----------------------------
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const price = Number(priceEl.value.trim());
    const category = catEl.value.trim();
    const image = imgEl.value.trim();
    const description = descEl.value.trim();

    // Simple validation
    if (!name || !price || !category || !image) {
      alert("Name, Price, Category এবং Image ফিল্ড পূরণ করা বাধ্যতামূলক।");
      return;
    }

    const payload = {
      name,
      price,
      category,
      image,
      description
    };

    try {
      // Optional: Submit button disable করে দিন UX ভালো করার জন্য
      const submitBtn = formEl.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      const saved = await res.json();
      console.log("Saved product:", saved);

      showToast("Product saved successfully! ✅");
      formEl.reset(); // Clear form

    } catch (err) {
      console.error("Save Error:", err);
      showToast("Failed to save product ❌");
      alert("Product save করতে সমস্যা হচ্ছে। Backend API ঠিক আছে কি না দেখে নিন।");
    } finally {
      const submitBtn = formEl.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "💾 Save Product";
      }
    }
  });

  // -----------------------------
  // Reset Button
  // -----------------------------
  resetBtn?.addEventListener("click", () => {
    formEl.reset();
  });

  // -----------------------------
  // Toast Function
  // -----------------------------
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;

    toastEl.classList.remove("opacity-0", "pointer-events-none");
    toastEl.classList.add("opacity-100");

    setTimeout(() => {
      toastEl.classList.remove("opacity-100");
      toastEl.classList.add("opacity-0", "pointer-events-none");
    }, 2000);
  }
});
