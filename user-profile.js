// user-profile.js
// ==========================================
// Look At Me Fashion - User Profile + Orders
// ==========================================
//
// Expected Backend endpoints:
//  GET /api/users/me        → { name, email, phone, createdAt, ... }
//  GET /api/orders/my       → [ { _id, status, totalPrice, createdAt, itemsCount }, ... ]
//
// Token:
//  localStorage key: "lmf_token"
//  Header: Authorization: Bearer <token>
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const TOKEN_KEY = "lmf_token";

  // DOM elements
  const loadingEl = document.getElementById("profileLoading");
  const errorEl = document.getElementById("profileError");
  const errorTextEl = document.getElementById("profileErrorText");
  const contentEl = document.getElementById("profileContent");

  const logoutBtn = document.getElementById("logoutBtn");
  const logoutToast = document.getElementById("logoutToast");

  // Profile info
  const avatarLetterEl = document.getElementById("profileAvatarLetter");
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const phoneEl = document.getElementById("profilePhone");
  const joinedEl = document.getElementById("profileJoinedDate");

  // Summary
  const summaryTotalOrdersEl = document.getElementById("summaryTotalOrders");
  const summaryPendingEl = document.getElementById("summaryPending");
  const summaryCompletedEl = document.getElementById("summaryCompleted");

  // Orders
  const ordersContainerEl = document.getElementById("ordersContainer");
  const ordersEmptyEl = document.getElementById("ordersEmpty");
  const orderFilterEl = document.getElementById("orderFilter");

  let allOrders = [];

  // -------------------------------
  // Check token (auth guard)
  // -------------------------------
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    showError("প্রথমে লগইন করুন।");
    // একটু সময় দিয়ে redirect দিচ্ছি
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
    return;
  }

  // -------------------------------
  // Logout button
  // -------------------------------
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    // চাইলে cart / user info clear করতে পারো
    // localStorage.removeItem("lmf_cart");

    showLogoutToast();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });

  // -------------------------------
  // Initial load
  // -------------------------------
  loadProfileAndOrders();

  // Filter change
  orderFilterEl?.addEventListener("change", () => {
    renderOrders();
  });

  // ==========================================
  // MAIN LOAD FUNCTION
  // ==========================================
  async function loadProfileAndOrders() {
    try {
      setLoading(true);

      const [userRes, orderRes] = await Promise.all([
        fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!userRes.ok) {
        throw new Error("User info load failed");
      }

      if (!orderRes.ok) {
        throw new Error("Orders load failed");
      }

      const user = await userRes.json();
      const orders = await orderRes.json();

      allOrders = Array.isArray(orders) ? orders : [];

      renderProfile(user);
      renderSummary();
      renderOrders();

      setLoading(false);
    } catch (err) {
      console.error("Profile load error:", err);
      showError("প্রোফাইল/অর্ডার তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  // ==========================================
  // UI HELPERS
  // ==========================================

  function setLoading(isLoading) {
    if (isLoading) {
      loadingEl?.classList.remove("hidden");
      contentEl?.classList.add("hidden");
      errorEl?.classList.add("hidden");
    } else {
      loadingEl?.classList.add("hidden");
      contentEl?.classList.remove("hidden");
      errorEl?.classList.add("hidden");
    }
  }

  function showError(message) {
    loadingEl?.classList.add("hidden");
    errorEl?.classList.remove("hidden");
    if (errorTextEl) errorTextEl.textContent = message || "কিছু সমস্যা হয়েছে।";
    contentEl?.classList.add("hidden");
  }

  function showLogoutToast() {
    if (!logoutToast) return;
    logoutToast.classList.remove("opacity-0", "pointer-events-none");
    logoutToast.classList.add("opacity-100");

    setTimeout(() => {
      logoutToast.classList.remove("opacity-100");
      logoutToast.classList.add("opacity-0", "pointer-events-none");
    }, 1500);
  }

  // ==============================
  // Render Profile
  // ==============================
  function renderProfile(user) {
    const name = user?.name || "অজানা ইউজার";
    const email = user?.email || "-";
    const phone = user?.phone || "-";
    const createdAt = user?.createdAt || user?.created_at;

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (phoneEl) phoneEl.textContent = `মোবাইল: ${phone}`;

    if (avatarLetterEl) {
      avatarLetterEl.textContent = name?.trim()?.charAt(0)?.toUpperCase() || "U";
    }

    if (joinedEl) {
      if (createdAt) {
        const d = new Date(createdAt);
        const formatted = d.toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        joinedEl.textContent = formatted;
      } else {
        joinedEl.textContent = "-";
      }
    }
  }

  // ==============================
  // Render Summary (orders count)
  // ==============================
  function renderSummary() {
    const total = allOrders.length;
    const pending = allOrders.filter((o) => o.status === "pending").length;
    const completed = allOrders.filter((o) => o.status === "completed").length;

    if (summaryTotalOrdersEl) summaryTotalOrdersEl.textContent = total;
    if (summaryPendingEl) summaryPendingEl.textContent = pending;
    if (summaryCompletedEl) summaryCompletedEl.textContent = completed;
  }

  // ==============================
  // Render Orders List
  // ==============================
  function renderOrders() {
    if (!ordersContainerEl || !ordersEmptyEl) return;

    const filterVal = orderFilterEl?.value || "all";

    let list = [...allOrders];
    if (filterVal !== "all") {
      list = list.filter((o) => String(o.status) === String(filterVal));
    }

    // Sort: latest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    ordersContainerEl.innerHTML = "";

    if (list.length === 0) {
      ordersEmptyEl.classList.remove("hidden");
      return;
    }

    ordersEmptyEl.classList.add("hidden");

    list.forEach((order) => {
      const card = createOrderCard(order);
      ordersContainerEl.appendChild(card);
    });
  }

  // ==============================
  // Single Order Card
  // ==============================
  function createOrderCard(order) {
    const id = order._id || "";
    const status = order.status || "pending";
    const totalPrice = Number(order.totalPrice || order.total || 0);
    const createdAt = order.createdAt || order.created_at;
    const itemsCount = order.itemsCount || order.items?.length || 0;

    const dateStr = createdAt
      ? new Date(createdAt).toLocaleString("bn-BD", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    // Status badge style
    let badgeText = "";
    let badgeClass = "";

    switch (status) {
      case "pending":
        badgeText = "Pending";
        badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
        break;
      case "processing":
        badgeText = "Processing";
        badgeClass = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "completed":
        badgeText = "Completed";
        badgeClass = "bg-green-100 text-green-700 border-green-200";
        break;
      case "cancelled":
        badgeText = "Cancelled";
        badgeClass = "bg-red-100 text-red-700 border-red-200";
        break;
      default:
        badgeText = status;
        badgeClass = "bg-gray-100 text-gray-700 border-gray-200";
    }

    const wrapper = document.createElement("div");
    wrapper.className =
      "bg-white border border-red-100 rounded-2xl shadow-sm px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3";

    wrapper.innerHTML = `
      <div class="flex-1 space-y-1">
        <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span class="font-semibold text-gray-800">
            অর্ডার #${shortId(id)}
          </span>
          <span class="text-[11px] sm:text-xs text-gray-400">
            ${dateStr}
          </span>
        </div>
        <p class="text-[11px] sm:text-xs text-gray-500">
          মোট প্রডাক্ট: <span class="font-semibold">${itemsCount}</span>
        </p>
        <p class="text-sm sm:text-base font-extrabold text-[#6B0000]">
          মোট: ৳ ${totalPrice}
        </p>
      </div>

      <div class="flex flex-col items-end gap-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${badgeClass}">
          ${badgeText}
        </span>

        <a href="order-success.html?id=${id}"
          class="text-[11px] sm:text-xs text-[#6B0000] underline hover:no-underline">
          বিস্তারিত দেখুন →
        </a>
      </div>
    `;

    return wrapper;
  }

  function shortId(id) {
    if (!id) return "-";
    if (id.length <= 6) return id;
    return id.slice(-6).toUpperCase();
  }
});
