import {Dictionary} from "../commons/dictionary";
/**
 * Created by JJax on 19.11.2016.
 */

export class CardWebModel {
    id: number;
    key: string;
    name: string;
    description: string;
    url: string;
    avatarUrls: Dictionary<String>;
    type: string;
    subCards: CardWebModel[];
};