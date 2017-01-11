import {JqlService} from "./jqlService";
import {Relation} from "../enums/relation";
import {CustomFieldService} from "./customFieldService";
import {JqlModel} from "../model/jqlModel";
/**
 * Created by JJax on 11.01.2017.
 */

export class RelationService {
    private readonly EPIC_FIELD_NAME = "Epic Link";
    private readonly JQL_REQUEST = "issue = ";
    private jqlService;
    private customFieldService;

    constructor(private httpClient){
        this.jqlService = new JqlService(httpClient);
        this.customFieldService = new CustomFieldService(httpClient);
    }

    public async getRelation(issueKey: String): Promise<Relation> {
        let epicFieldName = await this.customFieldService.getCustomFields(this.EPIC_FIELD_NAME);
        let jqlResponse = await this.jqlService.doRequest(this.prepareJqlRequest(issueKey, epicFieldName));

        return new Promise<Relation>((resolve, reject) => {
            resolve(jqlResponse);
        });
    }

    private prepareJqlRequest(issueKye: String, epicFieldName: String): JqlModel {
        let jqlFields = ["issuetype", epicFieldName];
        return this.jqlService.prepareJqlModel(this.JQL_REQUEST + issueKye, jqlFields);
    }
}