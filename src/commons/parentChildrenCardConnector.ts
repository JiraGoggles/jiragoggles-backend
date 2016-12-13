import {CardModel} from "../model/cardModel";
import {Dictionary} from "./dictionary";
/**
 * Created by JJax on 08.12.2016.
 */

export class ParentChildrenCardConnector {
    public apply(parents: CardModel[], children: Dictionary<CardModel[]>, relationFieldName: string) : CardModel[] {
        var toReturn: CardModel[] = [];
        for (let parent of parents) {
            parent.subCards = children[parent[relationFieldName]] ? children[parent[relationFieldName]] : [];
            toReturn.push(parent);
        }

        return toReturn;
    }
}