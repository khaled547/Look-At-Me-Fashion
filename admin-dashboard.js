// admin-dashboard.js
// =====================================
// Look At Me Fashion - Admin Dashboard
// =====================================
//
// কাজ সমূহ:
// 1) আজকের তারিখ দেখানো
// 2) Products & Orders API থেকে ডেটা ফেচ করা
// 3) Summary cards আপডেট করা
// 4) Recent orders list রেন্ডার করা
// 5) Products list + search ফিল্টার
// 6) Mobile friendly কার্ড-ভিত্তিক UI
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:5000/api";

  // DATE
  const adminDateEl = document.getElementById("adminDate");

  // SUMMARY
  const totalProductsEl = document.getElementById("totalProducts");
  const totalOrdersEl = document.getElementById("totalOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");
  const totalRevenueEl = document.getElementById("totalRevenue");

  // ORDERS
  const ordersLoadingEl = document.getElementById("ordersLoading");
  const ordersErrorEl = document.getElementById("ordersError");
  const ordersListEl = document.getElementById("ordersList");
  const ordersEmptyEl = document.getElementById("ordersEmpty");
  const orderFilterEl = document.getElementById("orderFilter");

  // PRODUCTS
  const productsLoadingEl = document.getElementById("productsLoading");
  const productsErrorEl = document.getElementById("productsError");
  const productsListEl = document.getElementById("productsList");
  const productsEmptyEl = document.getElementById("productsEmpty");
  const productSearchInputEl = document.getElementById("productSearchInput");

  // Local state
  let allOrders = [];
  let allProducts = [];
  let productSearchValue = "";
  let orderFilterValue = "all";

  // ------------------------------
  // আজকের Date সেট করা
  // ------------------------------
  if (adminDateEl) {
    const now = new Date();
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    adminDateEl.textContent = now.toLocaleDateString("bn-BD", options);
  }

  // ------------------------------
  // Fetch Products
  // ------------------------------
  function fetchProducts() {
    if (productsLoadingEl) productsLoadingEl.classList.remove("hidden");
    if (productsErrorEl) productsErrorEl.classList.add("hidden");
    if (productsListEl) productsListEl.classList.add("hidden");

    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Products request failed");
        return res.json();
      })
      .then((data) => {
        allProducts = Array.isArray(data) ? data : [];
        renderProducts();
        updateSummary();
      })
      .catch((err) => {
        console.error("Products API error:", err);
        if (productsErrorEl) productsErrorEl.classList.remove("hidden");
      })
      .finally(() => {
        if (productsLoadingEl) productsLoadingEl.classList.add("hidden");
      });
  }

  // ------------------------------
  // Fetch Orders
  // ------------------------------
  function fetchOrders() {
    if (ordersLoadingEl) ordersLoadingEl.classList.remove("hidden");
    if (ordersErrorEl) ordersErrorEl.classList.add("hidden");
    if (ordersListEl) ordersListEl.classList.add("hidden");

    // NOTE: আপনার backend এ /api/orders route রাখবেন
    fetch(`${API_BASE}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Orders request failed");
        return res.json();
      })
      .then((data) => {
        allOrders = Array.isArray(data) ? data : [];
        renderOrders();
        updateSummary();
      })
      .catch((err) => {
        console.error("Orders API error:", err);
        if (ordersErrorEl) ordersErrorEl.classList.remove("hidden");
      })
      .finally(() => {
        if (ordersLoadingEl) ordersLoadingEl.classList.add("hidden");
      });
  }

  // ------------------------------
  // Summary Cards আপডেট
  // ------------------------------
  function updateSummary() {
    // Total Products
    if (totalProductsEl) {
      totalProductsEl.textContent = allProducts.length || 0;
    }

    // Total Orders
    if (totalOrdersEl) {
      totalOrdersEl.textContent = allOrders.length || 0;
    }

    // Pending Orders count
    const pendingCount = allOrders.filter(
      (o) => (o.status || "").toLowerCase() === "pending"
    ).length;

    if (pendingOrdersEl) {
      pendingOrdersEl.textContent = pendingCount;
    }

    // Total Revenue (ধরা হচ্ছে order.total বা order.amount থাকে)
    const totalRevenue = allOrders.reduce((sum, o) => {
      const amount =
        typeof o.total === "number"
          ? o.total
          : typeof o.amount === "number"
          ? o.amount
          : 0;
      return sum + amount;
    }, 0);

    if (totalRevenueEl) {
      totalRevenueEl.textContent = `৳ ${totalRevenue}`;
    }
  }

  // ------------------------------
  // Orders Render
  // ------------------------------
  function renderOrders() {
    if (!ordersListEl || !ordersEmptyEl) return;

    let filtered = [...allOrders];

    // Filter by status
    if (orderFilterValue !== "all") {
      filtered = filtered.filter(
        (o) => (o.status || "").toLowerCase() === orderFilterValue
      );
    }

    if (!filtered.length) {
      ordersListEl.innerHTML = "";
      ordersListEl.classList.add("hidden");
      ordersEmptyEl.classList.remove("hidden");
      return;
    }

    ordersEmptyEl.classList.add("hidden");
    ordersListEl.classList.remove("hidden");
    ordersListEl.innerHTML = "";

    // Sort: latest first (ধরা হচ্ছে createdAt আছে)
    filtered.sort((a, b) => {
      const da = new Date(a.createdAt || a.date || 0).getTime();
      const db = new Date(b.createdAt || b.date || 0).getTime();
      return db - da;
    });

    filtered.slice(0, 20).forEach((order) => {
      const {
        _id,
        customerName,
        phone,
        status,
        total,
        amount,
        address,
        createdAt,
      } = order;

      const money = typeof total === "number" ? total : amount || 0;
      const name = customerName || "Unknown Customer";
      const phoneText = phone || "N/A";
      const addr = address || "";
      const idShort = _id ? String(_id).slice(-6).toUpperCase() : "—";

      const date = createdAt ? new Date(createdAt) : null;
      const dateText = date
        ? date.toLocaleString("bn-BD", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const statusText = (status || "pending").toLowerCase();

      let statusColor = "bg-gray-100 text-gray-700 border-gray-200";
      if (statusText === "pending") {
        statusColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
      } else if (statusText === "processing") {
        statusColor = "bg-blue-100 text-blue-800 border-blue-300";
      } else if (statusText === "completed") {
        statusColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
      } else if (statusText === "cancelled") {
        statusColor = "bg-red-100 text-red-800 border-red-300";
      }

      const orderCard = document.createElement("div");
      orderCard.className =
        "border border-red-100 rounded-2xl px-3 py-3 flex flex-col gap-1 bg-red-50/40 hover:bg-red-50 transition";

      orderCard.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col">
            <span class="text-[11px] text-gray-500">Order ID</span>
            <span class="text-xs font-semibold text-gray-900">#${idShort}</span>
          </div>

          <span class="text-[10px] px-2 py-1 rounded-full border ${statusColor}">
            ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}
          </span>
        </div>

        <div class="mt-1 flex items-center justify-between gap-2">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-900 leading-tight">
              ${name}
            </p>
            <p class="text-[11px] text-gray-500">
              📞 ${phoneText}
            </p>
            ${
              addr
                ? `<p class="text-[10px] text-gray-400 line-clamp-1 mt-0.5">📍 ${addr}</p>`
                : ""
            }
          </div>
          <div class="text-right">
            <p class="text-xs font-extrabold text-[#6B0000]">
              ৳ ${money}
            </p>
            ${
              dateText
                ? `<p class="text-[10px] text-gray-400 mt-0.5">${dateText}</p>`
                : ""
            }
          </div>
        </div>
      `;

      ordersListEl.appendChild(orderCard);
    });
  }

  // ------------------------------
  // Products Render
  // ------------------------------
  function renderProducts() {
    if (!productsListEl || !productsEmptyEl) return;

    let filtered = [...allProducts];

    // Search filter
    if (productSearchValue.trim() !== "") {
      const q = productSearchValue.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = String(p.name || "").toLowerCase();
        const cat = String(p.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    if (!filtered.length) {
      productsListEl.innerHTML = "";
      productsListEl.classList.add("hidden");
      productsEmptyEl.classList.remove("hidden");
      return;
    }

    productsEmptyEl.classList.add("hidden");
    productsListEl.classList.remove("hidden");
    productsListEl.innerHTML = "";

    filtered.forEach((p) => {
      const name = p.name || "Product";
      const price = typeof p.price === "number" ? p.price : 0;
      const category = p.category || "Uncategorized";
      const stock = typeof p.stock === "number" ? p.stock : null;
      const imageFile = p.image || "placeholder.jpg";

      const row = document.createElement("div");
      row.className =
        "flex items-center gap-3 border border-red-100 rounded-2xl px-3 py-2 bg-white hover:bg-red-50/60 transition";

      row.innerHTML = `
        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src="image/${imageFile}"
            alt="${name}"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
            ${name}
          </p>
          <p class="text-[10px] text-gray-500">
            Category: <span class="font-medium text-gray-700">${category}</span>
          </p>
        </div>

        <div class="text-right text-[11px] sm:text-xs">
          <p class="font-extrabold text-[#6B0000]">৳ ${price}</p>
          ${
            stock !== null
              ? `<p class="text-[10px] text-gray-500">Stock: ${stock}</p>`
              : ""
          }
        </div>
      `;

      productsListEl.appendChild(row);
    });
  }

  // ------------------------------
  // Event: Product search
  // ------------------------------
  if (productSearchInputEl) {
    productSearchInputEl.addEventListener("input", (e) => {
      productSearchValue = e.target.value || "";
      renderProducts();
    });
  }

  // ------------------------------
  // Event: Order filter change
  // ------------------------------
  if (orderFilterEl) {
    orderFilterEl.addEventListener("change", () => {
      orderFilterValue = orderFilterEl.value;
      renderOrders();
    });
  }

  // Initial fetch
  fetchProducts();
  fetchOrders();
});
