const express = require('express');
const path =require('path');
const { post_orderId } = require("../scripts/EOL");


const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page.html"));
});

router.post("/order-id/:order", post_orderId);

module.exports = router;