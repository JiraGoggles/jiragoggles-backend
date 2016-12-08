import {CardWebModel} from "../model/cardWebModel";
import {Converter} from "./converter";
/**
 * Created by JJax on 20.11.2016.
 */
export class JqlToCardWebModel implements Converter<CardWebModel>{
    public apply(epicJql): CardWebModel {
        return {
            id: epicJql.id,
            key: epicJql.key,
            name: epicJql.fields.summary,
            type: epicJql.fields.issuetype.name,
            url: epicJql.self,
            description: epicJql.fields.description,
            avatarUrls: null,
            subCards: null,
        };
    };
}