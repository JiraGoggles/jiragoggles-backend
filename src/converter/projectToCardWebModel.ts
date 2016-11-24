import {CardWebModel} from "../model/cardWebModel";
/**
 * Created by JJax on 20.11.2016.
 */
export class ProjectToCardWebModel {

    public apply(project): CardWebModel {
        return {
            id: project.id,
            key: project.key,
            name: project.name,
            type: "Project",
            url: project.self,
            description: project.description,
            avatarUrls: project.avatarUrls,
            subCards: []
        };
    };
}