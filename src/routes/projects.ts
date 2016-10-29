import * as express from "express";
import credentials from "../credentials";

export default (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials);

    // get all the projects
    router.get("/", (req, res) => {
        httpClient.get('/rest/api/2/project', (err, jiraRes, body) => {
            res.send(body); // for now return whatever jira's endpoint returns
        });
    });

    return router;
};