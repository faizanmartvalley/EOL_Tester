async function fetchOrders() {
  try {
    const response = await fetch("https://cygni.dnanetra.com/processed-orders");
    if (!response.ok) throw new Error("Failed to fetch orders.");

    const result = await response.json();

    const dropdown = document.getElementById("orders-dropdown");
    dropdown.innerHTML = '<option value="">-- Select an Order --</option>';

    result.data.forEach(order => {
      const option = document.createElement("option");
      option.value = order._id;
      option.textContent = `🆔 Order: ${order._id}`;
      dropdown.appendChild(option);
    });
  } catch (error) {
    showError(`❌ ${error.message}`);
  }
}

function showError(message) {
  const el = document.getElementById("error-message");
  el.innerText = message;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 5000);
}

function showSuccess(message) {
  const el = document.getElementById("success-message");
  el.innerText = message;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 3000);
}

window.onload = function () {
  fetchOrders();

  document.getElementById("orders-dropdown").addEventListener("change", async function () {
    const selectedOrderId = this.value;

    if (!selectedOrderId) return;

    try {
      const response = await fetch(`http://localhost:8000/order-id/${selectedOrderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrderId })
      });

      if (!response.ok) throw new Error("Failed to send order");

      const data = await response.json();
      console.log("Backend Response:", data);

      showSuccess(`✅ Order ${selectedOrderId} submitted successfully!`);
    } catch (error) {
      console.error("Submission Error:", error);
      showError(`❌ ${error.message}`);
    }
  });
};
