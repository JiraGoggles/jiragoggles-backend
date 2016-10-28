"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const routes_1 = require("./routes");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const expiry = require("static-expiry");
const compression = require("compression");
const hbs = require("express-hbs");
const ace = require("atlassian-connect-express");
class Server {
    constructor() {
        this.app = express();
        this.config();
    }
    static bootstrap() {
        return new Server();
    }
    config() {
        const staticDir = path.join(__dirname, "public");
        const viewsDir = __dirname + "/views";
        this.app.engine("hbs", hbs.express3({ partialsDir: viewsDir }));
        this.app.set("view engine", "hbs");
        this.app.set("views", viewsDir);
        this.app.use(express.static(staticDir));
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(compression());
        this.app.use(expiry(this.app, { dir: staticDir, debug: true }));
        this.app.use(errorHandler());
        this.addon = ace(this.app);
        this.app.use(this.addon.middleware());
        this.app.use(routes_1.default(this.addon));
    }
}
var server = Server.bootstrap();
module.exports = server;
//# sourceMappingURL=app.js.map