import * as express from "express";
import { getHttpClient } from "../auth/authHelpers";
import { RankService } from "../service/rankService";


export default (addon) => {
    const router = express.Router();

    router.put('/issue/:id/:direction/:referenceId', (request, response) => {
        const httpClient = getHttpClient(addon, request);
        const rankService = new RankService(httpClient);
        rankService.rankIssue(request.params.id, request.params.referenceId, request.params.direction);
        response.status(200).json("");

    });

    router.put('/epic/:id/:direction/:referenceId', (request, response) => {
        const httpClient = getHttpClient(addon, request);
        const rankService = new RankService(httpClient);

        rankService.rankEpic(request.params.id, request.params.referenceId, request.params.direction);
        response.status(200).json("");
    });

    return router;
};