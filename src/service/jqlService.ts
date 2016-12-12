import {JqlModel} from "../model/jqlModel";

/**
 * Created by JJax on 19.11.2016.
 */

export class JqlService {
    private readonly  MAX_RESULTS = -1;

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

    public prepareJqlOrderByRequest(request: string, fields: string[]) : JqlModel {
        return {
            request: request + " order by rank",
            fields: fields
        };
    }

    private prepareRequestBody(jqlModel: JqlModel) {
        return {
            jql: jqlModel.request,
            startAt: 0,
            maxResults: this.MAX_RESULTS,
            fields: jqlModel.fields,
            "fieldsByKeys": false
        };
    }
}