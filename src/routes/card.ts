import * as express from "express";
import {getHttpClient} from "../auth/authHelpers";
import {ProjectService} from  "../service/projectService";
import {EpicAsParentService} from "../service/epicAsParentService";

/**
 * Created by JJax on 19.11.2016.
 */

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

    router.get('/project/:key', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const epicAsParentService = new EpicAsParentService(httpClient);

        epicAsParentService.getEpicCardsForProjectKey(req.params.key).then((epicResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(epicResponse);
        });
    });

    return router;
};