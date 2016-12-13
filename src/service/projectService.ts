import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {CardModel} from "../model/cardModel";
import {JqlToCardModel} from "../converter/jqlToCardModel";
import {CustomFieldService} from "./customFieldService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {Dictionary} from "../commons/dictionary";
import {PageModel} from "../model/pageModel";
import {PagingUtils} from "../commons/pagingUtils";

/**
 * Created by JJax on 29.11.2016.
 */

export class ProjectService {
    private readonly EPIC_FIELD_NAME = "Epic Link";
    private readonly JQL_REQUEST = `issuetype != Sub-task and  project = `;
    private jqlToCardModel = new JqlToCardModel();
    private cardConnector = new ParentChildrenCardConnector();
    private pagingUtils = new PagingUtils();
    private jqlService;
    private customFieldService;
    private issueService;

    constructor(private httpClient) {
        this.jqlService = new JqlService(httpClient);
        this.customFieldService = new CustomFieldService(httpClient);
    }

    public async getProjectCards(projectKey: string, pageModel: PageModel): Promise<CardModel[]> {
        var epicLinkFieldName = await this.customFieldService.getCustomFields(this.EPIC_FIELD_NAME);
        var projectChildrens = await this.jqlService.doRequest(this.prepareEpicsForProjectJql(projectKey, epicLinkFieldName));
        return new Promise<CardModel[]>((resolve) => {
            var epics = this.pagingUtils.slice(this.extractEpics(projectChildrens), pageModel);
            var others = this.extractStandaloneIssues(projectChildrens, epicLinkFieldName);
            var epicsChildrens = this.extractEpicChildrenWithParentKey(projectChildrens, epicLinkFieldName);

            var toReturnCards = this.cardConnector.apply(epics, epicsChildrens, "key");
            var otherParentCard: CardModel = <CardModel> {
                subCards: others,
                key: "OTHERS",
                type: "Epic",
                name: "Others"
            };
            if(toReturnCards.length < pageModel.size) {
                toReturnCards.push(otherParentCard);
            }

            resolve(toReturnCards);
        });
    }

    private extractEpics(jqlResponse): CardModel[] {
        var toReturn: CardModel[] = Array();
        for (let issue of jqlResponse.issues) {
            if (issue.fields.issuetype.name === "Epic") {
                toReturn.push(this.jqlToCardModel.apply(issue));
            }
        }
        return toReturn;
    }

    private extractStandaloneIssues(jqlResponse, epicLinkFieldName: string): CardModel[] {
        var toReturn: CardModel[] = Array();
        for (let issue of jqlResponse.issues) {
            if (issue.fields.issuetype.name !== "Epic" && issue.fields[epicLinkFieldName] == null) {
                toReturn.push(this.jqlToCardModel.apply(issue));
            }
        }
        return toReturn;
    }

    private extractEpicChildrenWithParentKey(jqlResponse, epicLinkFieldName: string): Dictionary<CardModel[]> {
        var toReturn: Dictionary<CardModel[]> = {};
        for (let issue of jqlResponse.issues) {
            if (issue.fields[epicLinkFieldName] != null) {
                if (!toReturn[issue.fields[epicLinkFieldName]]) {
                    toReturn[issue.fields[epicLinkFieldName]] = [];
                }
                toReturn[issue.fields[epicLinkFieldName]].push(this.jqlToCardModel.apply(issue));
            }
        }
        return toReturn;
    }

    private prepareEpicsForProjectJql(projectKey: string, epicLinkFieldName: string): JqlModel {
        let jqlFields = ["name", "summary", "description", "project", "issuetype", "status", "priority", epicLinkFieldName];
        return this.jqlService.prepareJqlModel(this.JQL_REQUEST + projectKey, jqlFields);
    }
}