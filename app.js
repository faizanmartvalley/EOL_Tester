const express = require('express');
const cosrs = require('cors');
const bodyParser = require('body-parser');
const { scan_OK_Files, scan_NG_Files } = require("./scripts/EOL");
const routes = require("./controller/routes");

const app = express();
const PORT = 8000;

app.use(cosrs());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

setInterval(scan_OK_Files, 5 * 1000);
setInterval(scan_NG_Files, 5 * 1000);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});