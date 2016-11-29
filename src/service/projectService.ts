import {CardWebModel} from "../model/cardWebModel";
import {JqlService} from "./jqlService";
import {ProjectToCardWebModel} from "../converter/projectToCardWebModel";
import {Dictionary} from "../commons/dictionary";
import {EpicAsChildService} from "./epicAsChildService";

/**
 * Created by JJax on 19.11.2016.
 */

export class ProjectService {
    private projectToCardWebModel = new ProjectToCardWebModel();
    private epicAsChildService = new EpicAsChildService();

    public async getProjectCards(httpClient): Promise<CardWebModel[]> {
        let [epicsWithParentId, projects] = await Promise.all([this.epicAsChildService.getEpicsWithParentId(httpClient),
            this.getProjects(httpClient)]);
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

    private getProjects(httpClient): Promise<CardWebModel[]> {
        return new Promise((resolve, reject) => {
            httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
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
