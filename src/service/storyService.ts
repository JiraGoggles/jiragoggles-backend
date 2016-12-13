import {CardWebModel} from "../model/cardWebModel";
import {JqlService} from "./jqlService";
import {TransformUtils} from "../commons/transformUtils";
import {JqlToCardWebModel} from "../converter/jqlToCardWebModel";
import {PageModel} from "../model/pageModel";
import {PagingUtils} from "../commons/pagingUtils";
/**
 * Created by JJax on 11.12.2016.
 */

export class StoryService {
    private readonly JQL_REQUEST = "issue = ";
    private readonly JQL_FIELDS = ["name", "summary", "description", "project", "issuetype", "status", "subtasks"];
    private jqlService;
    private transformUtils = new TransformUtils();
    private jqlToCardWebModel = new JqlToCardWebModel();
    private pagingUtils = new PagingUtils();

    constructor(httpClient){
        this.jqlService = new JqlService(httpClient);
    }

    public async getStoryCards(key: string, pageModel: PageModel): Promise<CardWebModel[]> {
        let jqlResponse = await this.jqlService.doRequest(this.jqlService.prepareJqlModel(
            this.JQL_REQUEST + key, this.JQL_FIELDS));

        return new Promise<CardWebModel[]>((resolve) => {
            let slicedSubTasks = this.pagingUtils.slice(jqlResponse.issues[0].fields.subtasks, pageModel);
            resolve(this.transformUtils.transform(slicedSubTasks, this.jqlToCardWebModel));
        });
    }
}