"use strict";
const express = require("express");
const credentials_1 = require("../credentials");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials_1.default);
    router.get("/myself", (req, res) => {
        httpClient.asUser("admin").get('/rest/api/2/myself', (err, jiraRes, body) => {
            res.send(body);
        });
    });
    return router;
};
//# sourceMappingURL=users.js.map