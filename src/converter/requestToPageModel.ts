import {Converter} from "./converter";
import {PageModel} from "../model/pageModel";
/**
 * Created by JJax on 13.12.2016.
 */

export class RequestToPageModel implements Converter<PageModel> {
        private readonly MAX_RESULTS = -1;

    apply(request): PageModel {
        return {
            start: request.query.page ? (request.query.page - 1) * request.query.size : 0,
            size: request.query.size ? request.query.size : this.MAX_RESULTS
        };
    }
}