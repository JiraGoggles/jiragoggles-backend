/**
 * Created by JJax on 19.11.2016.
 */

interface Dictionary {
    [ index: string ]: string;
};

interface CardWebModel {
    id: number;
    key: string;
    name: string;
    description: string;
    url: string;
    avatarUrls: Dictionary;
    type: string;
    subCards: CardWebModel[];
};

export default CardWebModel;