const express = require('express');
const cosrs = require('cors');
const path =require('path');
const bodyParser = require('body-parser');
const { scan_OK_Files, scan_NG_Files } = require("./scripts/EOL");
const routes = require("./controller/routes");

const app = express();
const PORT = 8000;

app.use(cosrs());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

setInterval(scan_OK_Files, 5 * 1000);
// setInterval(scan_NG_Files, 5 * 1000);

app.listen(PORT, () => {
    console.log(`Server started click to configure order ID: http://localhost:${PORT}/order-id`);
});