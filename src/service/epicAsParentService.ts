import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {CardWebModel} from "../model/cardWebModel";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {CustomFieldService} from "./customFieldService";
import {IssueService} from "./issueService";

/**
 * Created by JJax on 29.11.2016.
 */

export class EpicAsParentService {
    private fields: ["name","summary","description","project","issuetype"];
    private jqlToCardWebModel = new JqlToCardWebModel();
    private readonly EPIC_FIELD_NAME = "Epic Link";
    private jqlService;
    private customFieldService;
    private issueService;

    constructor(private httpClient) {
        this.jqlService = new JqlService(httpClient);
        this.customFieldService = new CustomFieldService(httpClient);
        this.issueService = new IssueService(httpClient);
    }

    public async getEpicCardsForProjectKey(key: string): Promise<CardWebModel[]> {
        var [epics, customField] = await Promise.all([
            this.getEpicsForProjectKey(key),
            this.customFieldService.getCustomFields(this.EPIC_FIELD_NAME)]);

        var issuesWithParentKeys = await this.issueService.getIssuesWithParentKeys(
            this.getKeyList(epics), customField);

        return new Promise<CardWebModel[]>((resolve, reject) => {
            var toReturn: CardWebModel[] = [];
            for (let epic of epics) {
                epic.subCards = issuesWithParentKeys[epic.key] ? issuesWithParentKeys[epic.key] : [];
                toReturn.push(epic);
            }
            resolve(toReturn);
        });
    }

    private async getEpicsForProjectKey(key: string): Promise<CardWebModel[]> {
        var epics = await this.jqlService.doRequest(this.prepareEpicsForProjectJql(key));

        return new Promise<CardWebModel[]>((resolve, reject) => {
            var toReturn: CardWebModel[] = [];
            for (let epic of epics.issues) {
                toReturn.push(this.jqlToCardWebModel.apply(epic));
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

    private prepareEpicsForProjectJql(key: string): JqlModel {
        return {
            request: `"Epic Link" is EMPTY AND type not in subtaskIssueTypes() AND project =` + key,
            fields: this.fields
        };
    }
}