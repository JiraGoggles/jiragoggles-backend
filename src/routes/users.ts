import * as express from "express";
import credentials from "../credentials";

export default (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials);

    // get the info about myself
    router.get("/myself", (req, res) => {
        httpClient.asUser("admin").get('/rest/api/2/myself', (err, jiraRes, body) => {
            res.send(body); // for now return whatever jira's endpoint returns
        });
    });

    return router;
};