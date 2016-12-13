import {CardModel} from "../model/cardModel";
import {ProjectToCardModel} from "../converter/projectToCardModel";
import {RootChildrensService} from "./rootChildrensService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {TransformUtils} from "../commons/transformUtils";
import {PageModel} from "../model/pageModel";
import {PagingUtils} from "../commons/pagingUtils";

/**
 * Created by JJax on 19.11.2016.
 */

export class RootService {
    private projectToCardModel = new ProjectToCardModel();
    private parentChildrenCardConnector = new ParentChildrenCardConnector();
    private transformUtils = new TransformUtils();
    private pagingUtils = new PagingUtils();
    private rootChildrensService;

    constructor(private httpClient) {
        this.rootChildrensService = new RootChildrensService(httpClient);
    }

    public async getRootCards(page: PageModel): Promise<CardModel[]> {
        let [epicsWithParentId, projects] = await Promise.all([
            this.rootChildrensService.getEpicsWithParentId(),
            this.doGetProject(page)
        ]);

        return new Promise<CardModel[]>((resolve) => {
            resolve(this.parentChildrenCardConnector.apply(projects, epicsWithParentId, "id"));
        });

    }

    private doGetProject(page: PageModel): Promise<CardModel[]> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
                if (err) {
                    reject(err);
                }

                var slicedProjects = this.pagingUtils.slice(JSON.parse(body), page);
                resolve(this.transformUtils.transform(slicedProjects, this.projectToCardModel));
            });
        });
    }
}