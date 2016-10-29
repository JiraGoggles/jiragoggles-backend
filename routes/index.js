"use strict";
const express = require("express");
const projects_1 = require("./projects");
const users_1 = require("./users");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (addon) => {
    const router = express.Router();
    router.use("/projects", projects_1.default(addon));
    router.use("/users", users_1.default(addon));
    router.get("/", (req, res) => {
        res.render("index", { title: "Jira Goggles" });
    });
    return router;
};
//# sourceMappingURL=index.js.map