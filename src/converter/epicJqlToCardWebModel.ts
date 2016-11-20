import CardWebModel from "../model/cardWebModel";
/**
 * Created by JJax on 20.11.2016.
 */
export default class EpicJqlToCardWebModel {
    public apply(epicJql): CardWebModel {
        return {
            id: epicJql.id,
            key: epicJql.key,
            name: epicJql.fields.summary,
            type: "epic",
            url: epicJql.self,
            description: epicJql.fields.description,
            avatarUrls: null,
            subCards: null,
        };
    };
}