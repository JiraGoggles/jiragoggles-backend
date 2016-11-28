import * as express from "express";
import {getHttpClient} from "../auth/authHelpers";

export default (addon) => {
    const router = express.Router();

    // get all the projects
    router.get("/", (req, res) => {
        const httpClient = getHttpClient(addon, req);
        httpClient.get('/rest/api/2/project', (err, jiraRes, body) => {
            res.send(body); // for now return whatever jira's endpoint returns
        });
    });

    return router;
};