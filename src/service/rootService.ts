import {CardWebModel} from "../model/cardWebModel";
import {ProjectToCardWebModel} from "../converter/projectToCardWebModel";
import {Dictionary} from "../commons/dictionary";
import {RootChildrensService} from "./rootChildrensService";
import {ParentChildrenCardConnector} from "../commons/parentChildrenCardConnector";
import {TransformUtils} from "../commons/transformUtils";

/**
 * Created by JJax on 19.11.2016.
 */

export class RootService {
    private projectToCardWebModel = new ProjectToCardWebModel();
    private parentChildrenCardConnector = new ParentChildrenCardConnector();
    private transformUtils = new TransformUtils();
    private epicAsChildService;

    constructor(private httpClient) {
        this.epicAsChildService = new RootChildrensService(httpClient);
    }

    public async getRootCards(): Promise<CardWebModel[]> {
        let [epicsWithParentId, projects] = await Promise.all([this.epicAsChildService.getEpicsWithParentId(),
            this.doGetProject()]);

            return new Promise<CardWebModel[]>((resolve) => {
                resolve(this.parentChildrenCardConnector.apply(projects, epicsWithParentId));
            });

    }

    private doGetProject(): Promise<CardWebModel[]> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
                if (err) {
                    reject(err);
                }
                resolve(this.transformUtils.transform(body, this.projectToCardWebModel));
            });
        });
    }
}