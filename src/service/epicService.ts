import {CardWebModel} from "../model/cardWebModel";
import {JqlService} from "./jqlService";
import {JqlModel} from "../model/jqlModel";
import {Dictionary} from "../commons/dictionary";
import {TransformUtils} from "../commons/transformUtils";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
/**
 * Created by JJax on 11.12.2016.
 */

export class EpicService {
    private readonly JQL_REQUEST = `"Epic Link"=`;
    private readonly JQL_OTHER_EPICS_REQUEST = `type in standardIssueTypes() AND type != Epic AND "Epic Link" is EMPTY AND project =`;
    private readonly JQL_FIELDS = ["name", "summary", "description", "project", "issuetype", "status", "priority", "subtasks"];
    private readonly OTHER_EPIC_NAME = "OTHERS";
    private transfromUtils = new TransformUtils();
    private jqlToCardWebModel = new JqlToCardWebModel();
    private cardConnector = new ParentChildrenCardConnector();
    private jqlService;


    constructor(httpClient) {
        this.jqlService = new JqlService(httpClient);
    }

    public async getEpicCards(projectKey: string, epicKey: string) : Promise<CardWebModel[]> {
        var request = epicKey === this.OTHER_EPIC_NAME ? this.prepareRequestForOthers(projectKey) :
            this.prepareRequest(epicKey);
        var stories = await this.jqlService.doRequest(request);

        return new Promise<CardWebModel[]>((resolve) => {
            var childrensWithParentId = this.getChildrensWithParentId(stories);
            var storyCards = this.transfromUtils.transform(stories.issues, this.jqlToCardWebModel);

            resolve(this.cardConnector.apply(storyCards, childrensWithParentId, "key"));
        });
    }

    private getChildrensWithParentId(jqlResponse): Dictionary<CardWebModel[]> {
        var toReturn: Dictionary<CardWebModel[]> = {};
        for(let issue of jqlResponse.issues){
            toReturn[issue.key] = this.transfromUtils.transform(issue.fields.subtasks, this.jqlToCardWebModel);
        }
        return toReturn;
    }

    private prepareRequest(epicKey: string) : JqlModel {
        return this.jqlService.prepareJqlRequest(this.JQL_REQUEST + epicKey, this.JQL_FIELDS);
    }

    private prepareRequestForOthers(projectKey: string): JqlModel {
        return this.jqlService.prepareJqlRequest(this.JQL_OTHER_EPICS_REQUEST + projectKey, this.JQL_FIELDS);
    }
}