import {PageModel} from "../model/pageModel";
/**
 * Created by JJax on 13.12.2016.
 */

export class PagingUtils {
    public slice(array, pageModel: PageModel) {
        if(pageModel.size < 0)
            return array;

        return array.slice(pageModel.start, pageModel.start + pageModel.size);
    }
}