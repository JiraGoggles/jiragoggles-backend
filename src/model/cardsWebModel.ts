import {CardModel} from "./cardModel";
/**
 * Created by JJax on 13.12.2016.
 */

export class CardsWebModel {

    constructor(total: number, cards: CardModel[]) {
        this.total = total;
        this.cards = cards;
    }
    total: number;
    cards: CardModel[];
}