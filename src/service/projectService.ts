import CardWebModel from "../model/cardWebModel";
import JqlService from "./jqlService";
import JqlModel from "../model/jqlModel";

import EpicJqlToCardWebModel from "../converter/epicJqlToCardWebModel";
import ProjectToCardWebModel from "../converter/projectToCardWebModel";
/**
 * Created by JJax on 19.11.2016.
 */

export default class ProjectService {
    private jqlService = new JqlService();
    private projectToCardWebModel = new ProjectToCardWebModel();
    private epicJqlToCardWebModel = new EpicJqlToCardWebModel();

    public getProjectCards(httpClient, callback) {
        //TODO: it can be in some way refactored, perhaps with async or promises lib
        this.getProjects(httpClient, (projects) => {
            this.insertEpicsForProjects(projects, httpClient, (projectsWithEpics) => {
                callback(projectsWithEpics);
            });
        });
    }

    private getProjects(httpClient, callback) {
        httpClient.get('/rest/api/2/project?expand=description', (err, jiraRes, body) => {
            var toReturn: CardWebModel[] = [];
            for(let project of JSON.parse(body)){
                toReturn.push(this.projectToCardWebModel.apply(project));
            }
            callback(toReturn);
        });
    }

    private insertEpicsForProjects(projects: CardWebModel[], httpClient, callback){
        this.jqlService.doRequest(this.prepareEpicJql(), httpClient, (epicJqlRes) => {
            var toReturn: CardWebModel[] = projects;
            for(let projectCard of toReturn) {
                for (let epic of epicJqlRes.issues) {
                    if(epic.fields.project.id === projectCard.id) {
                        projectCard.subCards.push(this.epicJqlToCardWebModel.apply(epic));
                    }
                }
            }
            callback(toReturn);
        });
    }

    private prepareEpicJql(): JqlModel {
        return {
            request: "type=epic",
            fields: [
                "name",
                "summary",
                "description",
                "project"
            ]
        };
    }
}
