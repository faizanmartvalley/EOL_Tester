const express = require('express');
const { post_orderId } = require("../scripts/EOL");


const router = express.Router();


router.post("/order-id", post_orderId);

module.exports = router;