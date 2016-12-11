import {CardWebModel} from "../model/cardWebModel";
import {Converter} from "./converter";
/**
 * Created by JJax on 20.11.2016.
 */
export class ProjectToCardWebModel implements Converter<CardWebModel>{

    public apply(project): CardWebModel {
        return {
            id: project.id,
            key: project.key,
            name: project.name,
            type: "Project",
            url: project.self,
            description: project.description,
            avatarUrls: project.avatarUrls,
            priorityImgUrl: null,
            typeImgUrl: null,
            status: null,
            subCards: []
        };
    };
}