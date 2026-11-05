const rooms = [
  { number: "101", floor: "Ground", type: "2 sharing", status: "occupied", tenant: "Riya Sharma", beds: 2 },
  { number: "102", floor: "Ground", type: "3 sharing", status: "occupied", tenant: "Aman & 1", beds: 3 },
  { number: "103", floor: "Ground", type: "1 room flat", status: "vacant", tenant: "Available", beds: 1 },
  { number: "201", floor: "First", type: "2 sharing", status: "occupied", tenant: "Neha Patel", beds: 2 },
  { number: "202", floor: "First", type: "3 sharing", status: "occupied", tenant: "Karthik & 2", beds: 3 },
  { number: "203", floor: "First", type: "1 room flat", status: "vacant", tenant: "Available", beds: 1 },
  { number: "301", floor: "Second", type: "2 sharing", status: "occupied", tenant: "Meera Das", beds: 2 },
  { number: "302", floor: "Second", type: "1 room flat", status: "occupied", tenant: "Vikram Singh", beds: 1 }
];

const tenants = [
  { name: "Riya Sharma", room: "101", age: 24, gender: "Female", contact: "+91 98765 43210", moveIn: "18 Aug 2026", rent: "₹9,500", status: "paid", id: "AADHAAR •••• 2814" },
  { name: "Aman Verma", room: "102", age: 27, gender: "Male", contact: "+91 99887 66554", moveIn: "02 Oct 2026", rent: "₹7,800", status: "due", id: "PAN •••• 8A2Q" },
  { name: "Neha Patel", room: "201", age: 23, gender: "Female", contact: "+91 91234 56780", moveIn: "11 Jul 2026", rent: "₹9,500", status: "paid", id: "AADHAAR •••• 4419" },
  { name: "Vikram Singh", room: "302", age: 29, gender: "Male", contact: "+91 97654 32109", moveIn: "25 May 2026", rent: "₹12,000", status: "overdue", id: "VOTER ID •••• 7723" }
];

const payments = [
  { name: "Neha Patel", room: "201", amount: "₹9,500", date: "Today, 10:42 AM", initials: "NP" },
  { name: "Riya Sharma", room: "101", amount: "₹9,500", date: "Yesterday, 6:18 PM", initials: "RS" },
  { name: "Meera Das", room: "301", amount: "₹8,500", date: "04 Nov, 11:30 AM", initials: "MD" },
  { name: "Karthik Rao", room: "202", amount: "₹7,800", date: "03 Nov, 4:05 PM", initials: "KR" }
];

const roomGrid = document.getElementById("roomGrid");
const tenantTable = document.getElementById("tenantTable");
const activityList = document.getElementById("activityList");
const backdrop = document.getElementById("modalBackdrop");
const recordForm = document.getElementById("recordForm");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function renderRooms(filter = "all") {
  const visible = filter === "all" ? rooms : rooms.filter(room => room.status === filter);
  roomGrid.innerHTML = visible.map(room => {
    const filled = room.status === "occupied" ? room.beds : 0;
    const dots = Array.from({ length: Math.min(room.beds, 3) }, (_, index) => `<span class="bed-dot ${index < filled ? "filled" : ""}"></span>`).join("");
    return `<button class="room-card ${room.status}" data-room="${escapeHtml(room.number)}">
      <div class="room-card-head"><strong>${escapeHtml(room.number)}</strong><span class="room-status ${room.status}">${room.status === "occupied" ? "Occupied" : "Vacant"}</span></div>
      <div class="room-card-body"><span>${escapeHtml(room.type)} · ${escapeHtml(room.floor)}</span><strong>${escapeHtml(room.tenant)}</strong><div class="bed-dots">${dots}</div></div>
    </button>`;
  }).join("");
}

function renderTenants(list = tenants) {
  tenantTable.innerHTML = list.map(tenant => {
    const initials = tenant.name.split(" ").map(word => word[0]).join("").slice(0, 2);
    const statusLabel = tenant.status === "paid" ? "Paid" : tenant.status === "due" ? "Due" : "Overdue";
    return `<tr>
      <td><div class="tenant-cell"><div class="tenant-avatar">${escapeHtml(initials)}</div><div><strong>${escapeHtml(tenant.name)}</strong><span>${tenant.age} yrs · ${escapeHtml(tenant.gender)}</span></div></div></td>
      <td>Room ${escapeHtml(tenant.room)}</td><td>${escapeHtml(tenant.contact)}</td><td>${escapeHtml(tenant.moveIn)}</td><td><strong>${escapeHtml(tenant.rent)}</strong></td>
      <td><span class="status-badge ${tenant.status}">${statusLabel}</span></td><td><button class="row-action" aria-label="More tenant options">•••</button></td>
    </tr>`;
  }).join("");
}

function renderPayments() {
  activityList.innerHTML = payments.map(payment => `<div class="activity-item">
    <div class="activity-avatar">${escapeHtml(payment.initials)}</div><div class="activity-detail"><strong>${escapeHtml(payment.name)}</strong><span>Room ${escapeHtml(payment.room)} · ${escapeHtml(payment.date)}</span></div><div class="activity-amount"><strong>${escapeHtml(payment.amount)}</strong><span>Received</span></div>
  </div>`).join("");
}

function openModal(type, roomNumber = "") {
  const configs = {
    room: {
      kicker: "PROPERTY DETAILS",
      title: "Add room or flat",
      fields: `<div class="field-group"><label>Room / flat number</label><input name="number" required placeholder="e.g. 401" /></div>
        <div class="field-group"><label>Floor</label><select name="floor"><option>Ground</option><option>First</option><option>Second</option><option>Third</option></select></div>
        <div class="field-group"><label>Room type</label><select name="type"><option>1 room flat</option><option>2 sharing</option><option>3 sharing</option><option>4 sharing</option></select></div>
        <div class="field-group"><label>Monthly rent</label><input name="rent" type="number" placeholder="8500" /></div>
        <div class="field-group full"><label>Notes</label><textarea name="notes" placeholder="Furnishing, amenities or availability notes"></textarea></div>`
    },
    tenant: {
      kicker: "RESIDENT DETAILS",
      title: "Add paying guest",
      fields: `<div class="field-group"><label>Full name</label><input name="name" required placeholder="Tenant name" /></div>
        <div class="field-group"><label>Room / flat</label><select name="room">${rooms.map(room => `<option${roomNumber === room.number ? " selected" : ""}>${escapeHtml(room.number)}</option>`).join("")}</select></div>
        <div class="field-group"><label>Age</label><input name="age" type="number" min="18" max="100" placeholder="Age" /></div>
        <div class="field-group"><label>Gender</label><select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
        <div class="field-group"><label>Contact number</label><input name="contact" type="tel" placeholder="+91 00000 00000" /></div>
        <div class="field-group"><label>Government ID</label><select name="idType"><option>Aadhaar</option><option>PAN</option><option>Voter ID</option><option>Passport</option></select></div>
        <div class="field-group"><label>ID number</label><input name="idNumber" placeholder="Enter identification number" /></div>
        <div class="field-group"><label>Move-in date</label><input name="moveIn" type="date" /></div>`
    },
    payment: {
      kicker: "RENT PAYMENT",
      title: "Record payment",
      fields: `<div class="field-group"><label>Tenant</label><select name="tenant">${tenants.map(tenant => `<option>${escapeHtml(tenant.name)} · Room ${tenant.room}</option>`).join("")}</select></div>
        <div class="field-group"><label>Payment type</label><select name="paymentType"><option>Monthly rent</option><option>Advance</option><option>Deposit</option><option>Other</option></select></div>
        <div class="field-group"><label>Amount</label><input name="amount" type="number" required placeholder="8500" /></div>
        <div class="field-group"><label>Payment date</label><input name="date" type="date" value="2026-11-05" /></div>
        <div class="field-group full"><label>Notes</label><textarea name="notes" placeholder="Reference, method, or payment note"></textarea></div>`
    }
  };
  const config = configs[type];
  document.getElementById("modalKicker").textContent = config.kicker;
  document.getElementById("modalTitle").textContent = config.title;
  recordForm.dataset.type = type;
  recordForm.innerHTML = `<div class="form-grid">${config.fields}<div class="form-actions"><button type="button" class="secondary-btn" id="cancelModal">Cancel</button><button type="submit" class="primary-btn">Save ${type}</button></div></div>`;
  backdrop.hidden = false;
  document.getElementById("cancelModal").addEventListener("click", closeModal);
  setTimeout(() => recordForm.querySelector("input, select")?.focus(), 0);
}

function closeModal() { backdrop.hidden = true; }
function showToast(message) { const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timeout); showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2200); }

renderRooms(); renderTenants(); renderPayments();

document.getElementById("roomFilters").addEventListener("click", event => { const button = event.target.closest("button[data-filter]"); if (!button) return; document.querySelectorAll("#roomFilters button").forEach(item => item.classList.remove("active")); button.classList.add("active"); renderRooms(button.dataset.filter); });
document.getElementById("addRoomBtn").addEventListener("click", () => openModal("room"));
document.getElementById("addTenantBtn").addEventListener("click", () => openModal("tenant"));
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", event => { if (event.target === backdrop) closeModal(); });
document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active")); button.classList.add("active"); document.getElementById("sidebar").classList.remove("open"); }));
roomGrid.addEventListener("click", event => { const card = event.target.closest(".room-card"); if (card) openModal(card.classList.contains("vacant") ? "tenant" : "payment", card.dataset.room); });

document.getElementById("globalSearch").addEventListener("input", event => {
  const query = event.target.value.trim().toLowerCase();
  renderTenants(tenants.filter(tenant => `${tenant.name} ${tenant.room} ${tenant.contact}`.toLowerCase().includes(query)));
});

recordForm.addEventListener("submit", event => {
  event.preventDefault();
  const values = new FormData(recordForm);
  const type = recordForm.dataset.type;

  if (type === "room") {
    rooms.unshift({
      number: values.get("number"), floor: values.get("floor"), type: values.get("type"),
      status: "vacant", tenant: "Available", beds: Number(values.get("type").startsWith("1 room") ? 1 : values.get("type").charAt(0)) || 1
    });
    renderRooms(document.querySelector("#roomFilters .active")?.dataset.filter || "all");
    showToast("Room added successfully");
  } else if (type === "tenant") {
    const name = values.get("name");
    const roomNumber = values.get("room");
    tenants.unshift({
      name, room: roomNumber, age: Number(values.get("age") || 0), gender: values.get("gender"),
      contact: values.get("contact") || "Not provided", moveIn: values.get("moveIn") ? new Date(`${values.get("moveIn")}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not set",
      rent: "₹8,500", status: "due", id: `${values.get("idType")} · ${values.get("idNumber") || "Not provided"}`
    });
    const room = rooms.find(item => item.number === roomNumber);
    if (room) { room.status = "occupied"; room.tenant = name; }
    renderRooms(document.querySelector("#roomFilters .active")?.dataset.filter || "all");
    renderTenants();
    showToast("Tenant added and tagged to room");
  } else if (type === "payment") {
    const tenantName = values.get("tenant").split(" · Room ")[0];
    const roomNumber = values.get("tenant").split("Room ")[1];
    const tenant = tenants.find(item => item.name === tenantName);
    if (tenant) tenant.status = "paid";
    payments.unshift({ name: tenantName, room: roomNumber, amount: `₹${Number(values.get("amount")).toLocaleString("en-IN")}`, date: "Just now", initials: tenantName.split(" ").map(word => word[0]).join("").slice(0, 2) });
    renderTenants(); renderPayments();
    showToast(`${values.get("paymentType")} recorded`);
  }
  closeModal();
});

document.getElementById("viewRoomsBtn").addEventListener("click", () => document.querySelector("[data-section='rooms']")?.click());
document.getElementById("viewPaymentsBtn").addEventListener("click", () => openModal("payment"));
