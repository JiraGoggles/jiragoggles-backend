"use strict";
const express = require("express");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (addon) => {
    const router = express.Router();
    router.get("/", (req, res) => {
        res.format({
            "text/html": () => { res.redirect('/atlassian-connect.json'); },
            "application/json": () => { res.redirect('/atlassian-connect.json'); }
        });
    });
    router.get("/hello-world", addon.authenticate(), (req, res) => {
        res.render('hello-world', { title: 'Atlassian Connect' });
    });
    router.get("/activity", addon.authenticate(), (req, res) => {
        res.render("activity", { title: "JIRA activity" });
    });
    return router;
};
//# sourceMappingURL=index.js.map