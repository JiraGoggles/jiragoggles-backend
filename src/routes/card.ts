import * as express from "express";
import {getHttpClient} from "../auth/authHelpers";
import {RootService} from  "../service/rootService";
import {ProjectService} from "../service/projectService";
import {StoryService} from "../service/storyService";
import {EpicService} from "../service/epicService";

/**
 * Created by JJax on 19.11.2016.
 */

export default (addon) => {
    const router = express.Router();

    router.get('/project', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const rootService = new RootService(httpClient);

        rootService.getRootCards().then((rootResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(rootResponse);
        });
    });

    router.get('/project/:key', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const projectService = new ProjectService(httpClient);

        projectService.getProjectCards(req.params.key).then((projectResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(projectResponse);
        });
    });


    router.get('/project/:projectKey/:epicKey', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const epicService = new EpicService(httpClient);

        epicService.getEpicCards(req.params.epicKey).then((epicResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(epicResponse);
        });
    });

    router.get('/project/:projectKey/:epicKey/:key', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const storyService = new StoryService(httpClient);

        storyService.getStoryCards(req.params.key).then((storyResponse) => {
            res.setHeader("Content-Type", "application/json");
            res.send(storyResponse);
        });
    });

    return router;
};