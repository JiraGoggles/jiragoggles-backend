import {JqlToCardModel} from "../converter/jqlToCardModel";
import {CardModel} from "../model/cardModel";
import {Dictionary} from "../commons/dictionary";
import {JqlModel} from "../model/jqlModel";
import {JqlService} from "./jqlService";
import {PageModel} from "../model/pageModel";

/**
 * Created by JJax on 23.11.2016.
 */

export class RootChildrensService {
    private jqlToCardModel = new JqlToCardModel();
    private readonly jqlRequest = `"Epic Link" is EMPTY AND type = epic`;
    private readonly jqlFields: ["name","summary","description","project","issuetype"];
    private jqlService;

    constructor(private httpClient) {
        this.jqlService = new JqlService(httpClient);
    }

    public async getEpicsWithParentId(): Promise<Dictionary<CardModel[]>> {
        let epics = await this.doGetEpics();
        return new Promise<any>((resolve, reject) => {
            var toReturn: Dictionary<CardModel[]> = {};
            for (let epic of epics.issues) {
                let projectId = epic.fields.project.id;
                if (!toReturn[projectId]) {
                    toReturn[projectId] = [];
                }
                toReturn[projectId].push(this.jqlToCardModel.apply(epic));
            }
            resolve(toReturn);
        });
    }

    private doGetEpics(): Promise<any> {
        return this.jqlService.doRequest(this.prepareEpicJql());
    }

    private prepareEpicJql(): JqlModel {
        return this.jqlService.prepareJqlModel(this.jqlRequest, this.jqlFields);
    }
}