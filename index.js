const express = require("express");
var path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();
const route = require("./routes/client/index.route");
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

database.connect();

const app = express();
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT;

app.locals.prefixAdmin = systemConfig.prefixAmin;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.use(cookieParser("TUANBUI"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
