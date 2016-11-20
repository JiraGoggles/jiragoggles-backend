/**
 * Created by JJax on 19.11.2016.
 */
/**
 * Created by JJax on 19.11.2016.
 */
import * as express from "express";
import credentials from "../credentials";
import JqlService from "../service/jqlService";
import JqlModel from "../model/jqlModel";

export default (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials);
    const jqlService = new JqlService();

    router.get('/', (req, res) => {
        var jqlModel: JqlModel = {
            request: req.query.request,
            fields: [
                "name",
                "summary",
                "description",
                "project"
            ]
        };
        var toReturn = jqlService.doRequest(jqlModel, httpClient, (jqlRes) => {
            res.send(jqlRes);
        });
    });

    return router;
};