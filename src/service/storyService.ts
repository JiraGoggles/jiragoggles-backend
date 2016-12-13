import {CardModel} from "../model/cardModel";
import {JqlService} from "./jqlService";
import {TransformUtils} from "../commons/transformUtils";
import {JqlToCardModel} from "../converter/jqlToCardModel";
import {PageModel} from "../model/pageModel";
import {PagingUtils} from "../commons/pagingUtils";
import {CardsWebModel} from "../model/cardsWebModel";
/**
 * Created by JJax on 11.12.2016.
 */

export class StoryService {
    private readonly JQL_REQUEST = "issue = ";
    private readonly JQL_FIELDS = ["name", "summary", "description", "project", "issuetype", "status", "subtasks"];
    private jqlService;
    private transformUtils = new TransformUtils();
    private jqlToCardModel = new JqlToCardModel();
    private pagingUtils = new PagingUtils();

    constructor(httpClient){
        this.jqlService = new JqlService(httpClient);
    }

    public async getStoryCards(key: string, pageModel: PageModel): Promise<CardsWebModel> {
        let jqlResponse = await this.jqlService.doRequest(this.jqlService.prepareJqlModel(
            this.JQL_REQUEST + key, this.JQL_FIELDS));

        return new Promise<CardsWebModel>((resolve) => {
            let subtasks = jqlResponse.issues[0].fields.subtasks;
            let slicedSubTasks = this.pagingUtils.slice(subtasks, pageModel);
            resolve(new CardsWebModel(subtasks.length, this.transformUtils.transform(slicedSubTasks, this.jqlToCardModel)));
        });
    }
}