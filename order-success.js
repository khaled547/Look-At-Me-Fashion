// order-success.js

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("successBox");
  const orderIdText = document.getElementById("orderIdText");

  // Smooth fade + scale animation
  setTimeout(() => {
    box.classList.remove("opacity-0", "scale-[0.85]");
    box.classList.add("opacity-100", "scale-100");
  }, 150);

  // Generate order ID (12 digit)
  const orderId = "LMF-" + Math.floor(Math.random() * 900000000000 + 100000000000);
  orderIdText.textContent = orderId;

  // Store Last Order ID (optional)
  localStorage.setItem("lastOrderId", orderId);

  // Clear cart after success
  localStorage.removeItem("lmf_cart");
});
