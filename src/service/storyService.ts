import {CardWebModel} from "../model/cardWebModel";
import {JqlService} from "./jqlService";
import {TransformUtils} from "../commons/transformUtils";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
/**
 * Created by JJax on 11.12.2016.
 */

export class StoryService {
    private readonly JQL_REQUEST = "issue = ";
    private readonly JQL_FIELDS = ["name", "summary", "description", "project", "issuetype", "status", "subtasks"];
    private jqlService;
    private transformUtils = new TransformUtils();
    private jqlToCardWebModel = new JqlToCardWebModel();

    constructor(httpClient){
        this.jqlService = new JqlService(httpClient);
    }

    public async getStoryCards(key: string, start:number, size: number): Promise<CardWebModel[]> {
        let jqlResponse = await this.jqlService.doRequest(this.jqlService.prepareJqlOrderByRequest(
            this.JQL_REQUEST + key, this.JQL_FIELDS));

        return new Promise<CardWebModel[]>((resolve) => {
            resolve(this.transformUtils.transform(jqlResponse.issues[0].fields.subtasks.slice(start, size),
                this.jqlToCardWebModel));
        });
    }
}