import {CardWebModel} from "../model/cardWebModel";
import {Dictionary} from "./dictionary";
/**
 * Created by JJax on 08.12.2016.
 */

export class ParentChildrenCardConnector {
    public apply(parents: CardWebModel[], children: Dictionary<CardWebModel[]>) : CardWebModel[] {
        var toReturn: CardWebModel[] = [];
        for (let parent of parents) {
            parent.subCards = children[parent.key] ? children[parent.key] : [];
            toReturn.push(parent);
        }

        return toReturn;
    }
}