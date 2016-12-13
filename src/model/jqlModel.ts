import {PageModel} from "./pageModel";
/**
 * Created by JJax on 20.11.2016.
 */
export interface JqlModel {
    request: string;
    fields: string[];
    pageModel: PageModel;
}