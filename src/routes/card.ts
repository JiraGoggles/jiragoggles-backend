/**
 * Created by JJax on 19.11.2016.
 */
import * as express from "express";
import {ProjectService} from  "../service/projectService";
import {getHttpClient} from "../auth/authHelpers";

export default (addon) => {
    const router = express.Router();

    router.get('/project', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const projectService = new ProjectService(httpClient);

        projectService.getProjectCards().then((projectResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(projectResponse);
        });
    });

    return router;
};