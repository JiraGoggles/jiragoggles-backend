/**
 * Created by JJax on 08.12.2016.
 */

import {CardWebModel} from "../model/cardWebModel";
import {Converter} from "../converter/converter";

export class TransformUtils {
    public transform<T>(arrayJSON, converter: Converter<T>) : T[] {
        var toReturn = Array<T>();
        for(let obj of arrayJSON) {
            toReturn.push(converter.apply(obj));
        }
        return toReturn;
    }
}