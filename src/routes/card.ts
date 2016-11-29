/**
 * Created by JJax on 19.11.2016.
 */
import * as express from "express";
import credentials from "../credentials";
import {ProjectService} from "../service/projectService";
import {EpicAsParentService} from "../service/epicAsParentService";

export default (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials);
    const projectService = new ProjectService();
    const epicAsParentService = new EpicAsParentService();

    router.get('/project', (req, res) => {
        projectService.getProjectCards(httpClient).then((projectResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(projectResponse);
        });
    });

    router.get('/project/:key', (req, res) => {
        epicAsParentService.getEpicCardsForProjectKey(req.params.key, httpClient).then((epicResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(epicResponse);
        });
    });

    return router;
};