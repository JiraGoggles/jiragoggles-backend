import {Dictionary} from "../commons/dictionary";
/**
 * Created by JJax on 19.11.2016.
 */

export class CardModel {
    id: number;
    key: string;
    name: string;
    priority: string;
    description: string;
    url: string;
    avatarUrls: Dictionary<String>;
    type: string;
    typeImgUrl: string;
    priorityImgUrl: string;
    status: string;
    subCards: CardModel[];
};