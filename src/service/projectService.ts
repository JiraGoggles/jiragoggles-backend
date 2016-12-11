import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {CardWebModel} from "../model/cardWebModel";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {CustomFieldService} from "./customFieldService";
import {ProjectChildrensService} from "./projectChildrensService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {TransformUtils} from "../commons/transformUtils";

/**
 * Created by JJax on 29.11.2016.
 */

export class ProjectService {
    private readonly EPIC_FIELD_NAME = "Epic Link";
    private JQL_FIELDS: ["name","summary","description","project","issuetype"];
    private readonly JQL_REQUEST = `"Epic Link" is EMPTY AND type not in subtaskIssueTypes() AND project =`;
    private jqlToCardWebModel = new JqlToCardWebModel();
    private cardConnector = new ParentChildrenCardConnector();
    private transformUtils = new TransformUtils();
    private jqlService;
    private customFieldService;
    private issueService;

    constructor(private httpClient) {
        this.jqlService = new JqlService(httpClient);
        this.customFieldService = new CustomFieldService(httpClient);
        this.issueService = new ProjectChildrensService(httpClient);
    }

    public async getProjectCards(projectKey: string): Promise<CardWebModel[]> {
        var [epics, customField] = await Promise.all([
            this.getEpicsOfProject(projectKey),
            this.customFieldService.getCustomFields(this.EPIC_FIELD_NAME)]);

        var issuesWithParentKeys = await this.issueService.getIssuesWithParentKeys(
            this.getKeyList(epics), customField);

        return new Promise<CardWebModel[]>((resolve, reject) => {
            resolve(this.cardConnector.apply(epics, issuesWithParentKeys, "key"));
        });
    }

    private async getEpicsOfProject(key: string): Promise<CardWebModel[]> {
        var epics = await this.jqlService.doRequest(this.prepareEpicsForProjectJql(key));

        return new Promise<CardWebModel[]>((resolve, reject) => {
            let toReturn = this.transformUtils.transform<CardWebModel>(epics.issues, this.jqlToCardWebModel);
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
        return this.jqlService.prepareJqlRequest(this.JQL_REQUEST + key, this.JQL_FIELDS);
    }
}