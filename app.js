const express = require('express');
const cosrs = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { scan_OK_Files, scan_NG_Files } = require("./scripts/EOL");
const routes = require("./controller/routes");
const { logError } = require("./utils/errorLog");


const app = express();
const PORT = 8000;

app.use(cosrs());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

setInterval(scan_OK_Files, 5 * 1000);
setInterval(scan_NG_Files, 5 * 1000);

app.listen(PORT, () => {
    console.log(`Server started click to configure order ID: http://localhost:${PORT}/order-id`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    logError(`Uncaught Exception,Error: ${err}`);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    logError(`Unhandled Rejection,Error: ${reason}`);
    process.exit(1);
});