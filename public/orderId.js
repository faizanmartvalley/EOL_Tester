const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "orderStore.json");

// Function to save Order ID in a file
function setOrderId(orderId) {
    fs.writeFileSync(filePath, JSON.stringify({ orderId }), "utf-8");
}

// Function to get Order ID from a file
function getOrderId() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data).orderId;
    }
    return null;
}

module.exports = { setOrderId, getOrderId };
