import JqlModel from "../model/jqlModel";
/**
 * Created by JJax on 19.11.2016.
 */

const MAX_RESULTS = -1;

export default class JqlService {
    public doRequest(jqlModel: JqlModel, httpClient, callback) {
        httpClient.post({url: "/rest/api/2/search", json: this.prepareRequestBody(jqlModel)},
            (err, jiraRes, body) => {
                callback(jiraRes.body);
        });
    }

    private prepareRequestBody(jqlModel: JqlModel) {
        return {
            jql: jqlModel.request,
            startAt: 0,
            maxResults: MAX_RESULTS,
            fields: jqlModel.fields,
            "fieldsByKeys": false
        };
    }
}