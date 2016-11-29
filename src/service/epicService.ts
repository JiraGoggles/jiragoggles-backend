import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {CardWebModel} from "../model/cardWebModel";
import {Dictionary} from "../commons/dictionary";
import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {CustomFieldService} from "./customFieldService";
import {IssueService} from "./issueService";
/**
 * Created by JJax on 23.11.2016.
 */

export class EpicService {
    private jqlToCardWebModel = new JqlToCardWebModel();
    private jqlService = new JqlService();
    private customFieldService = new CustomFieldService();
    private issueService = new IssueService();

    public async getEpicCards(httpClient): Promise<CardWebModel[]> {
        var [epics, customField] = await Promise.all([
            this.getEpics(httpClient),
            this.customFieldService.getCustomFields("Epic Link", httpClient)]);

        var issuesWithParentKeys = await this.issueService.getIssuesWithParentKeys(
            this.getParentIds(epics), customField, httpClient);

        return new Promise<CardWebModel[]>((resolve, reject) => {
            var toReturn: CardWebModel[] = [];
            for (let epic of epics) {
                var card = this.jqlToCardWebModel.apply(epic);
                card.subCards = issuesWithParentKeys[card.key];
                toReturn.push(card);
            }
            resolve(toReturn);
        });
    }

    public async getEpicsWithParentId(httpClient): Promise<Dictionary<CardWebModel[]>> {
        let epics = await this.getEpics(httpClient);
        return new Promise<any>((resolve, reject) => {
            var toReturn: Dictionary<CardWebModel[]> = {};
            for (let epic of epics.issues) {
                let projectId = epic.fields.project.id;
                if (!toReturn[projectId]) {
                    toReturn[projectId] = [];
                }
                toReturn[projectId].push(this.jqlToCardWebModel.apply(epic));
            }
            resolve(toReturn);
        });
    }

    private getParentIds(body): number[] {
        var toReturn: number[] = [];
        for (let issue of body.issues) {
            toReturn.push(issue.key);
        }
        return toReturn;
    }

    private getEpics(httpClient): Promise<any> {
        return this.jqlService.doRequest(this.prepareEpicJql(), httpClient);
    }

    private prepareEpicJql(): JqlModel {
        return {
            request: `"Epic Link" is EMPTY AND type not in subtaskIssueTypes()`,
            fields: [
                "name",
                "summary",
                "description",
                "project",
                "issuetype"
            ]
        };
    }
}