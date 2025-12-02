// checkout.js
// Look At Me Fashion

document.addEventListener("DOMContentLoaded", () => {

  const CART_KEY = "lmf_cart";

  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  let cart = [];

  // Load Cart
  function loadCart() {
    const stored = localStorage.getItem(CART_KEY);
    cart = stored ? JSON.parse(stored) : [];
  }

  // Render UI
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


  // Place Order
  placeOrderBtn.addEventListener("click", () => {
    
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

    const orderData = {
      customerName: name,
      phone,
      address,
      items: cart,
      totalAmount: checkoutTotal.textContent.replace("৳", "").trim(),
    };

    // Send to backend
    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(data => {
        // Clear cart
        localStorage.removeItem(CART_KEY);

        // Redirect
        window.location.href = `order-success.html?orderId=${data._id}`;
      })
      .catch(err => {
        console.error(err);
        alert("Order failed. Try again!");
      });

  });

});
