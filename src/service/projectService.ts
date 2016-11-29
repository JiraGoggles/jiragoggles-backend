import {CardWebModel} from "../model/cardWebModel";
import {ProjectToCardWebModel} from "../converter/projectToCardWebModel";
import {Dictionary} from "../commons/dictionary";
import {EpicAsChildService} from "./epicAsChildService";

/**
 * Created by JJax on 19.11.2016.
 */

export class ProjectService {
    private projectToCardWebModel = new ProjectToCardWebModel();
    private epicAsChildService;

    constructor(private httpClient) {
        this.epicAsChildService = new EpicAsChildService(httpClient);
    }

    public async getProjectCards(): Promise<CardWebModel[]> {
        let [epicsWithParentId, projects] = await Promise.all([this.epicAsChildService.getEpicsWithParentId(),
            this.getProjects()]);
        return new Promise<any>((resolve, reject) => {
            resolve(this.insertEpicsToProjects(epicsWithParentId, projects));
        });
    }

    private insertEpicsToProjects(epics: Dictionary<CardWebModel[]>, projects: CardWebModel[]): CardWebModel[] {
        var toReturn: CardWebModel[] = new Array();
        for (let project of projects) {
            project.subCards = epics[project.id];
            toReturn.push(project);
        }
        return toReturn;
    }

    private getProjects(): Promise<CardWebModel[]> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
                if (err) {
                    reject(err);
                }
                resolve(this.transformBodyToCards(body));
            });
        });
    }

    private transformBodyToCards(body: string): CardWebModel[] {
        let toReturn: CardWebModel[] = new Array();
        for (let project of JSON.parse(body)) {
            toReturn.push(this.projectToCardWebModel.apply(project));
        }
        return toReturn;
    }
}