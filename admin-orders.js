// admin-orders.js
// ===========================================
// Look At Me Fashion - Admin Order Management
// ===========================================

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:5000/api/orders";

  const orderListEl = document.getElementById("orderList");
  const emptyMsgEl = document.getElementById("emptyMsg");
  const statusFilterEl = document.getElementById("statusFilter");
  const searchInputEl = document.getElementById("searchInput");

  const statsTotalEl = document.getElementById("statsTotal");
  const statsPendingEl = document.getElementById("statsPending");
  const statsProcessingEl = document.getElementById("statsProcessing");
  const statsCompletedEl = document.getElementById("statsCompleted");

  let allOrders = [];
  let currentStatus = "all";
  let searchText = "";

  // Filter change
  statusFilterEl.addEventListener("change", () => {
    currentStatus = statusFilterEl.value;
    renderOrders();
  });

  // Search change
  searchInputEl.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase();
    renderOrders();
  });

  // Initial fetch
  fetchOrders();

  // -----------------------------
  // Fetch Orders from backend
  // -----------------------------
  async function fetchOrders() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      allOrders = Array.isArray(data) ? data : [];
      renderOrders();
    } catch (err) {
      console.error("Orders load error:", err);
      orderListEl.innerHTML =
        '<p class="text-red-500 text-sm">Failed to load orders.</p>';
    }
  }

  // -----------------------------
  // Render Orders with filter + search
  // -----------------------------
  function renderOrders() {
    let filtered = [...allOrders];

    // status filter
    if (currentStatus !== "all") {
      filtered = filtered.filter((o) => o.status === currentStatus);
    }

    // search filter
    if (searchText) {
      filtered = filtered.filter((o) => {
        const id = (o._id || "").toLowerCase();
        const name = (o.customerName || "").toLowerCase();
        const phone = (o.phone || "").toLowerCase();
        return (
          id.includes(searchText) ||
          name.includes(searchText) ||
          phone.includes(searchText)
        );
      });
    }

    updateStats();

    if (!filtered.length) {
      orderListEl.innerHTML = "";
      emptyMsgEl.classList.remove("hidden");
      return;
    }

    emptyMsgEl.classList.add("hidden");
    orderListEl.innerHTML = "";

    filtered.forEach((order) => {
      const card = createOrderCard(order);
      orderListEl.appendChild(card);
    });
  }

  // -----------------------------
  // Small stats update
  // -----------------------------
  function updateStats() {
    const total = allOrders.length;
    const pending = allOrders.filter((o) => o.status === "pending").length;
    const processing = allOrders.filter((o) => o.status === "processing").length;
    const completed = allOrders.filter((o) => o.status === "completed").length;

    statsTotalEl.textContent = total;
    statsPendingEl.textContent = pending;
    statsProcessingEl.textContent = processing;
    statsCompletedEl.textContent = completed;
  }

  // -----------------------------
  // Create single order card
  // -----------------------------
  function createOrderCard(order) {
    const {
      _id,
      customerName,
      phone,
      address,
      status,
      totalAmount,
      paymentMethod,
      createdAt,
      items = [],
    } = order;

    const created = createdAt
      ? new Date(createdAt).toLocaleString("bn-BD", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    const wrapper = document.createElement("div");
    wrapper.className =
      "bg-white border border-red-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-3";

    const itemCount = items.reduce((sum, it) => sum + (it.qty || 0), 0);

    wrapper.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

        <!-- LEFT: basic info -->
        <div class="space-y-1">
          <p class="text-xs text-gray-400">Order ID: <span class="font-mono">${_id}</span></p>
          <h2 class="text-base sm:text-lg font-semibold text-[#6B0000]">
            ${customerName || "Unknown Customer"}
          </h2>
          <p class="text-sm text-gray-700">
            📞 ${phone || "-"}
          </p>
          <p class="text-xs text-gray-500 line-clamp-2">
            📍 ${address || "-"}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            🕒 ${created || ""}
          </p>
        </div>

        <!-- RIGHT: amount + status + actions -->
        <div class="sm:text-right flex flex-col items-start sm:items-end gap-2">
          <p class="text-sm text-gray-600">
            Items: <span class="font-semibold">${itemCount}</span>
          </p>
          <p class="text-lg font-bold text-[#6B0000]">
            ৳ ${Number(totalAmount || 0)}
          </p>
          <p class="text-xs text-gray-500">
            Payment: <span class="font-semibold">${paymentMethod || "COD"}</span>
          </p>

          <!-- status dropdown -->
          <div class="mt-1">
            <select
              class="statusSelect border border-red-200 rounded-full px-3 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              data-id="${_id}"
            >
              <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
              <option value="processing" ${status === "processing" ? "selected" : ""}>Processing</option>
              <option value="completed" ${status === "completed" ? "selected" : ""}>Completed</option>
              <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </div>

          <!-- actions -->
          <div class="flex items-center gap-2 mt-1">
            <button
              class="toggleItemsBtn text-xs sm:text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
              View Items
            </button>
            <button
              class="deleteOrderBtn text-xs sm:text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- ITEMS LIST (hidden by default) -->
      <div class="itemsContainer hidden mt-3 border-t border-red-100 pt-3 space-y-2">
        ${items
          .map(
            (it) => `
          <div class="flex items-center gap-3 text-sm">
            <img src="image/${it.image || ""}" class="w-12 h-12 rounded-lg object-cover border border-red-100" />
            <div class="flex-1">
              <p class="font-medium text-gray-800">${it.name || "Product"}</p>
              <p class="text-xs text-gray-500">
                Qty: ${it.qty || 0} × ৳ ${it.price || 0}
              </p>
            </div>
            <p class="font-semibold text-[#6B0000]">
              ৳ ${(it.price || 0) * (it.qty || 0)}
            </p>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // View Items toggle
    const toggleBtn = wrapper.querySelector(".toggleItemsBtn");
    const itemsContainer = wrapper.querySelector(".itemsContainer");
    if (toggleBtn && itemsContainer) {
      toggleBtn.addEventListener("click", () => {
        const hidden = itemsContainer.classList.contains("hidden");
        if (hidden) {
          itemsContainer.classList.remove("hidden");
          toggleBtn.textContent = "Hide Items";
        } else {
          itemsContainer.classList.add("hidden");
          toggleBtn.textContent = "View Items";
        }
      });
    }

    // Status change
    const statusSelect = wrapper.querySelector(".statusSelect");
    if (statusSelect) {
      statusSelect.addEventListener("change", async () => {
        const newStatus = statusSelect.value;
        await updateStatus(_id, newStatus);
      });
    }

    // Delete order
    const deleteBtn = wrapper.querySelector(".deleteOrderBtn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        const ok = confirm("Are you sure you want to delete this order?");
        if (!ok) return;
        await deleteOrder(_id);
      });
    }

    return wrapper;
  }

  // -----------------------------
  // Update Status (PATCH /:id/status)
  // -----------------------------
  async function updateStatus(orderId, newStatus) {
    try {
      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update status");
        return;
      }

      const updated = await res.json();
      // local array update
      const idx = allOrders.findIndex((o) => o._id === orderId);
      if (idx >= 0) {
        allOrders[idx].status = updated.status;
      }
      renderOrders();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating status");
    }
  }

  // -----------------------------
  // Delete Order
  // -----------------------------
  async function deleteOrder(orderId) {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete order");
        return;
      }

      allOrders = allOrders.filter((o) => o._id !== orderId);
      renderOrders();
    } catch (err) {
      console.error("Delete order error:", err);
      alert("Error deleting order");
    }
  }
});
