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
    private readonly JQL_FIELDS = ["name", "summary", "description", "project", "issuetype", "status", "priority", "subtasks"];
    private transfromUtils = new TransformUtils();
    private jqlToCardWebModel = new JqlToCardWebModel();
    private cardConnector = new ParentChildrenCardConnector();
    private jqlService;


    constructor(httpClient) {
        this.jqlService = new JqlService(httpClient);
    }

    public async getEpicCards(epic_key: string) : Promise<CardWebModel[]> {
        var stories = await this.jqlService.doRequest(this.prepareRequest(epic_key));

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

    private prepareRequest(epic_key: string) : JqlModel {
        return this.jqlService.prepareJqlRequest(this.JQL_REQUEST + epic_key, this.JQL_FIELDS);
    }
}