const express = require("express");
require("dotenv").config();
const route = require("./routes/client/index.route");
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

database.connect();

const app = express();
const port = process.env.PORT;

app.locals.prefixAdmin = systemConfig.prefixAmin;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
