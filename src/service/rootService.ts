import {CardWebModel} from "../model/cardWebModel";
import {ProjectToCardWebModel} from "../converter/projectToCardWebModel";
import {RootChildrensService} from "./rootChildrensService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {TransformUtils} from "../commons/transformUtils";
import {PageModel} from "../model/pageModel";
import {PagingUtils} from "../commons/pagingUtils";

/**
 * Created by JJax on 19.11.2016.
 */

export class RootService {
    private projectToCardWebModel = new ProjectToCardWebModel();
    private parentChildrenCardConnector = new ParentChildrenCardConnector();
    private transformUtils = new TransformUtils();
    private pagingUtils = new PagingUtils();
    private rootChildrensService;

    constructor(private httpClient) {
        this.rootChildrensService = new RootChildrensService(httpClient);
    }

    public async getRootCards(page: PageModel): Promise<CardWebModel[]> {
        let [epicsWithParentId, projects] = await Promise.all([
            this.rootChildrensService.getEpicsWithParentId(),
            this.doGetProject(page)
        ]);

        return new Promise<CardWebModel[]>((resolve) => {
            resolve(this.parentChildrenCardConnector.apply(projects, epicsWithParentId, "id"));
        });

    }

    private doGetProject(page: PageModel): Promise<CardWebModel[]> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
                if (err) {
                    reject(err);
                }

                var slicedProjects = this.pagingUtils.slice(JSON.parse(body), page);
                resolve(this.transformUtils.transform(slicedProjects, this.projectToCardWebModel));
            });
        });
    }
}