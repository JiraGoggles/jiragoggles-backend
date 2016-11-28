import {JqlModel} from "../model/jqlModel";
/**
 * Created by JJax on 19.11.2016.
 */

const MAX_RESULTS = -1;

export class JqlService {
    constructor(private httpClient) {
    }

    public doRequest(jqlModel: JqlModel): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpClient.post({url: "/rest/api/2/search", json: this.prepareRequestBody(jqlModel)},
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