// =============================================
// checkout.js - Look At Me Fashion (UPDATED)
// =============================================

document.addEventListener("DOMContentLoaded", () => {

  const CART_KEY = "lmf_cart";
  const token = localStorage.getItem("lmf_token");
  const user = JSON.parse(localStorage.getItem("lmf_user"));

  // If user not logged in → redirect to login
  if (!token || !user) {
    window.location.href = "login.html";
    return;
  }

  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  let cart = [];

  // Load Cart
  function loadCart() {
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      cart = [];
    }
  }

  // Render Checkout UI
  function renderCheckout() {
    loadCart();
    checkoutItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
      total += item.price * item.qty;

      checkoutItems.innerHTML += `
        <div class="flex items-center justify-between bg-red-50 p-3 rounded-xl border border-red-100">
          <span class="font-medium">${item.name} × ${item.qty}</span>
          <span class="text-[#6B0000] font-semibold">৳ ${item.price * item.qty}</span>
        </div>
      `;
    });

    checkoutTotal.textContent = `৳ ${total}`;
  }

  renderCheckout();


  // ================================
  // Place Order
  // ================================
  placeOrderBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    if (!name || !phone || !address) {
      alert("Please fill all fields!");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const total = Number(checkoutTotal.textContent.replace("৳", "").trim());

    // Backend Order Format
    const orderData = {
      user: user.id,      // logged-in user ID
      customerName: name,
      phone,
      address,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image
      })),
      total: total,
      status: "pending"
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed!");
        return;
      }

      // Clear cart
      localStorage.removeItem(CART_KEY);

      // Redirect to success page
      window.location.href = `order-success.html?orderId=${data._id}`;

    } catch (err) {
      console.error(err);
      alert("Order failed. Try again!");
    }

  });

});

