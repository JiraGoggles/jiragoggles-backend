/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import mainRouter from "./routes";

const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const expiry = require("static-expiry");
const compression = require("compression");
const hbs = require("express-hbs");
const ace = require("atlassian-connect-express");

/**
 * The server.
 *
 * @class Server
 */
class Server {

  public app: express.Application;
  public addon: any;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // Anything in ./public is served up as static content
    const staticDir = path.join(__dirname, "public");
    // Anything in ./views are HBS templates
    const viewsDir = __dirname + "/views";
    this.app.engine("hbs", hbs.express3({partialsDir: viewsDir}));
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

    // set up ACE
    this.addon = ace(this.app);
    this.app.use(this.addon.middleware());

    // set up the routes/controllers
    // pass the addon to enable authentication
    this.app.use(mainRouter(this.addon));
  }
}

var server = Server.bootstrap();
export = server;