import {JqlModel} from "../model/jqlModel";
import {PageModel} from "../model/pageModel";

/**
 * Created by JJax on 19.11.2016.
 */

export class JqlService {
    private readonly  MAX_RESULTS = -1;
    private readonly ORDER_BY = " order by rank";
    private readonly PAGE_MODEL: PageModel = { start: 0, size: this.MAX_RESULTS };

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

    public prepareJqlModel(request: string, fields: string[], page: PageModel = this.PAGE_MODEL) : JqlModel {
        return {
            request: request + this.ORDER_BY,
            fields: fields,
            pageModel: page
        };
    }

    private prepareRequestBody(jqlModel: JqlModel) {
        return {
            jql: jqlModel.request,
            startAt: jqlModel.pageModel.start,
            maxResults: jqlModel.pageModel.size,
            fields: jqlModel.fields,
            fieldsByKeys: false
        };
    }
}