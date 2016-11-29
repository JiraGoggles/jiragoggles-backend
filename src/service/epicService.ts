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
    private fields: ["name","summary","description","project","issuetype"];

    public async getEpicsForProjectCards(key: string, httpClient): Promise<CardWebModel[]> {
        var [epics, customField] = await Promise.all([
            this.getEpicsForProjectKey(key, httpClient),
            this.customFieldService.getCustomFields("Epic Link", httpClient)]);

        var issuesWithParentKeys = await this.issueService.getIssuesWithParentKeys(
            this.getKeyList(epics), customField, httpClient);

        return new Promise<CardWebModel[]>((resolve, reject) => {
            var toReturn: CardWebModel[] = [];
            for (let epic of epics) {
                epic.subCards = issuesWithParentKeys[epic.key];
                toReturn.push(epic);
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

    private getKeyList(cards: CardWebModel[]): string[] {
        var toReturn: string[] = [];
        for (let card of cards) {
            toReturn.push(card.key);
        }
        return toReturn;
    }

    private async getEpicsForProjectKey(key: string, httpClient): Promise<CardWebModel[]> {
        var epics = await this.jqlService.doRequest(this.prepareEpicsForProjectJql(key), httpClient);

        return new Promise<CardWebModel[]>((resolve, reject) => {
            var toReturn: CardWebModel[] = [];
            for(let epic of epics.issues) {
                toReturn.push(this.jqlToCardWebModel.apply(epic));
            }
            resolve(toReturn);
        });
    }

    private getEpics(httpClient): Promise<any> {
        return this.jqlService.doRequest(this.prepareEpicJql(), httpClient);
    }

    private prepareEpicJql(): JqlModel {
        return {
            request: `"Epic Link" is EMPTY AND type not in subtaskIssueTypes()`,
            fields: this.fields
        };
    }

    private prepareEpicsForProjectJql(key: string): JqlModel {
        return {
            request: `"Epic Link" is EMPTY AND type not in subtaskIssueTypes() AND project =` + key,
            fields: this.fields
        };
    }
}