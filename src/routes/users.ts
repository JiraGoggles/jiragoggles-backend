import * as express from "express";
import {getHttpClient} from "../auth/authHelpers";

export default (addon) => {
    const router = express.Router();

    // get the info about myself
    router.get("/myself", (req, res) => {
        const httpClient = getHttpClient(addon, req);
        httpClient.asUser("admin").get('/rest/api/2/myself', (err, jiraRes, body) => {
            res.send(body); // for now return whatever jira's endpoint returns
        });
    });

    return router;
};