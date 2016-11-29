import {JqlService} from "./jqlService";
import {JqlModel} from "../model/jqlModel";
import {Dictionary} from "../commons/dictionary";
import {CardWebModel} from "../model/cardWebModel";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
/**
 * Created by JJax on 28.11.2016.
 */

export class IssueService {
    private jqlService = new JqlService();
    private jqlToCardWebModel = new JqlToCardWebModel();

    public async getIssuesWithParentKeys(key: string[], epicCustomField: string, httpClient)
    : Promise<Dictionary<CardWebModel[]>> {
        var issueBody = await this.getIssuesForKeys(key, epicCustomField, httpClient);
        var toReturn: Dictionary<CardWebModel[]> = {};

        return new Promise<any>((resolve, reject) => {
            for(let issue of issueBody.issues){
                var issueCard: CardWebModel = this.jqlToCardWebModel.apply(issue);
                var parentId: number = this.getParentKey(issue, epicCustomField);
                if(!parentId){
                    reject("No parent id error");
                }

                if(!toReturn[parentId]){
                    toReturn[parentId] = [];
                }
                toReturn[parentId].push(issueCard);
            }
            resolve(toReturn);
        });
    }

    private getParentKey(issue, customFieldName): number {
        if(issue.fields.parent){
            return issue.fields.parent.key;
        } else if(issue.fields[customFieldName]) {
            return issue.fields[customFieldName];
        }
    }

    private getIssuesForKeys(key: string[], epicCustomField: string, httpClient): Promise<any> {
        var request = this.prepareJqlRequestForIssues(key, epicCustomField);
        return this.jqlService.doRequest(request, httpClient);
    }

    private prepareJqlRequestForIssues(key: string[], epicCustomField: string): JqlModel {
        return {
            request: `"Epic Link" in (` + key + `) OR parent in (` + key + `) ORDER BY created`,
            fields: [
                "summary",
                "description",
                "issuetype",
                "parent",
                epicCustomField
            ]
        };
    }
}