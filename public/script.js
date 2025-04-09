async function fetchOrders() {
    try {
        const response = await fetch("http://192.168.31.242:3000/processed-orders");
        if (!response.ok) {
            throw new Error("Failed to fetch orders.");
        }
        const result = await response.json();

        const dropdown = document.getElementById("orders-dropdown");
        dropdown.innerHTML = '<option value="">-- Select an Order --</option>'; // Reset dropdown

        result.data.forEach(order => {
            const option = document.createElement("option");
            option.value = order._id;
            option.textContent = `🆔 Order: ${order._id}`;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        showError(`❌ ${error.message}`);
    }
}

// Function to show error messages
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = message;
    errorMessage.style.display = "block";

    // Hide the message after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 5000);
}

window.onload = function () {
    fetchOrders();

    document.getElementById("orders-dropdown").addEventListener("change", async function () {
        const selectedOrderId = this.value;

        if (selectedOrderId) {
            try {
                const response = await fetch(`http://localhost:8000/order-id/${selectedOrderId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ orderId: selectedOrderId })
                });
                console.log(response);
                
                if (!response.ok) throw new Error("Failed to fetch order ID");

                const data = await response.json();
                console.log("Backend Response:", data);

                // Show success message on the frontend
                const successMessage = document.getElementById("success-message");
                successMessage.innerText = `✅ Order ${selectedOrderId} submitted successfully!`;
                successMessage.style.display = "block";

                // Hide the message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 3000);

            } catch (error) {
                console.error("Error fetching order ID:", error);
                showError(`❌ ${error.message}`);
            }
        }
    });
};
