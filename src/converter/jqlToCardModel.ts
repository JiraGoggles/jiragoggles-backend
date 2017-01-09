import {Converter} from "./converter";
import {CardModel} from "../model/cardModel";
/**
 * Created by JJax on 20.11.2016.
 */

export class JqlToCardModel implements Converter<CardModel> {
    public apply(jqlResponse): CardModel {
        return {
            id: jqlResponse.id,
            key: jqlResponse.key,
            name: jqlResponse.fields.summary,
            type: jqlResponse.fields.issuetype.name,
            priority: jqlResponse.fields.priority.name,
            url: jqlResponse.self,
            description: jqlResponse.fields.description,
            avatarUrls: null,
            priorityImgUrl: jqlResponse.fields.priority.iconUrl,
            typeImgUrl: jqlResponse.fields.issuetype.iconUrl,
            status: jqlResponse.fields.status.name,
            subCards: null,
        };
    }
}