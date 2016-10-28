"use strict";
var server = require("./app");
var app = server.app;
var addon = server.addon;
var debug = require("debug")("express:server");
var http = require("http");
var os = require("os");
var hbs = require("express-hbs");
var port = normalizePort(process.env.PORT || 3000);
app.set("port", port);
hbs.registerHelper('furl', function (url) { return app.locals.furl(url); });
var httpServer = http.createServer(app);
httpServer.listen(port, function () {
    console.log('Add-on server running at http://' + os.hostname() + ':' + port);
    addon.register();
});
httpServer.on("error", onError);
httpServer.on("listening", onListening);
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = httpServer.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
}
//# sourceMappingURL=www.js.map