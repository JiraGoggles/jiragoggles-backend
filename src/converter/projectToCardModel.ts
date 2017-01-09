import {CardModel} from "../model/cardModel";
import {Converter} from "./converter";
/**
 * Created by JJax on 20.11.2016.
 */
export class ProjectToCardModel implements Converter<CardModel>{

    public apply(project): CardModel {
        return {
            id: project.id,
            key: project.key,
            name: project.name,
            type: "Project",
            url: project.self,
            description: project.description,
            avatarUrls: project.avatarUrls,
            priorityImgUrl: null,
            priority: null,
            typeImgUrl: null,
            status: null,
            subCards: []
        };
    };
}