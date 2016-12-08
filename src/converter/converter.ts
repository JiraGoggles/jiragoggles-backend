/**
 * Created by JJax on 08.12.2016.
 */

export interface Converter<T> {
    apply(json): T;
}