import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {CardWebModel} from "../model/cardWebModel";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {CustomFieldService} from "./customFieldService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {Dictionary} from "../commons/dictionary";

/**
 * Created by JJax on 29.11.2016.
 */

export class ProjectService {
    private readonly EPIC_FIELD_NAME = "Epic Link";
    private readonly JQL_REQUEST = `issuetype != Sub-task and  project = `;
    private jqlToCardWebModel = new JqlToCardWebModel();
    private cardConnector = new ParentChildrenCardConnector();
    private jqlService;
    private customFieldService;
    private issueService;

    constructor(private httpClient) {
        this.jqlService = new JqlService(httpClient);
        this.customFieldService = new CustomFieldService(httpClient);
    }

    public async getProjectCards(projectKey: string): Promise<CardWebModel[]> {
        var epicLinkFieldName = await this.customFieldService.getCustomFields(this.EPIC_FIELD_NAME);
        var projectChildrens = await this.jqlService.doRequest(this.prepareEpicsForProjectJql(projectKey, epicLinkFieldName));
        return new Promise<CardWebModel[]>((resolve) => {
            var epics = this.extractEpics(projectChildrens);
            var others = this.extractStandaloneIssues(projectChildrens, epicLinkFieldName);
            var epicsChildrens = this.extractEpicChildrenWithParentKey(projectChildrens, epicLinkFieldName);

            var toReturnCards = this.cardConnector.apply(epics, epicsChildrens, "key");
            var otherParentCard: CardWebModel = <CardWebModel> {
                subCards: others,
                key: "SH-others",
                type: "Epic",
            };
            toReturnCards.push(otherParentCard);

            resolve(toReturnCards);
        });
    }

    private extractEpics(jqlResponse): CardWebModel[] {
        var toReturn: CardWebModel[] = Array();
        for (let issue of jqlResponse.issues) {
            if (issue.fields.issuetype.name === "Epic") {
                toReturn.push(this.jqlToCardWebModel.apply(issue));
            }
        }
        return toReturn;
    }

    private extractStandaloneIssues(jqlResponse, epicLinkFieldName: string): CardWebModel[] {
        var toReturn: CardWebModel[] = Array();
        for (let issue of jqlResponse.issues) {
            if (issue.fields.issuetype.name !== "Epic" && issue.fields[epicLinkFieldName] == null) {
                toReturn.push(this.jqlToCardWebModel.apply(issue));
            }
        }
        return toReturn;
    }

    private extractEpicChildrenWithParentKey(jqlResponse, epicLinkFieldName: string): Dictionary<CardWebModel[]> {
        var toReturn: Dictionary<CardWebModel[]> = {};
        for (let issue of jqlResponse.issues) {
            if (issue.fields[epicLinkFieldName] != null) {
                if (!toReturn[issue.fields[epicLinkFieldName]]) {
                    toReturn[issue.fields[epicLinkFieldName]] = [];
                }
                toReturn[issue.fields[epicLinkFieldName]].push(this.jqlToCardWebModel.apply(issue));
            }
        }
        return toReturn;
    }

    private prepareEpicsForProjectJql(projectKey: string, epicLinkFieldName: string): JqlModel {
        let jqlFields = ["name", "summary", "description", "project", "issuetype", epicLinkFieldName];
        return this.jqlService.prepareJqlRequest(this.JQL_REQUEST + projectKey, jqlFields);
    }
}