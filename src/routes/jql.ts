import * as express from "express";
import {JqlService} from "../service/jqlService";
import {JqlModel} from "../model/jqlModel";
import {getHttpClient} from "../auth/authHelpers";

/**
 * Created by JJax on 19.11.2016.
 */

export default (addon) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        const httpClient = getHttpClient(addon, req);
        const jqlService = new JqlService(httpClient);

        var jqlModel: JqlModel = {
            request: req.query.request,
            fields: [
                "name",
                "summary",
                "description",
                "project",
                "issuetype"
            ],
            pageModel: {
                start: 0,
                size: -1
            }
        };
        jqlService.doRequest(jqlModel).then((jqlRes) => {
                res.send(jqlRes);
            });
        });

    return router;
};