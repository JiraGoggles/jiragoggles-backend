import {Converter} from "./converter";
import {CardWebModel} from "../model/cardWebModel";
/**
 * Created by JJax on 20.11.2016.
 */

export class JqlToCardWebModel implements Converter<CardWebModel> {
    public apply(jqlResponse): CardWebModel {
        return {
            id: jqlResponse.id,
            key: jqlResponse.key,
            name: jqlResponse.fields.summary,
            type: jqlResponse.fields.issuetype.name,
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