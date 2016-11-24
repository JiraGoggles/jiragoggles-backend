import {JqlModel} from "../model/jqlModel";
/**
 * Created by JJax on 19.11.2016.
 */

const MAX_RESULTS = -1;

export class JqlService {
    public doRequest(jqlModel: JqlModel, httpClient): Promise<any> {
        return new Promise((resolve, reject) => {
            httpClient.post({url: "/rest/api/2/search", json: this.prepareRequestBody(jqlModel)},
                (err, jiraRes, body) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(jiraRes.body);
                });
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