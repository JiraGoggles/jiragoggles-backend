/**
 * Created by JJax on 28.11.2016.
 */

export class CustomFieldService {
    constructor(private httpClient) {
    }

    public async getCustomFields(fieldName: String): Promise<string> {
        var fields = await this.getAllFields();
        return new Promise<string>((resolve, reject) => {
            var toReturn = fields.filter((x) => {
                return x.name.toUpperCase().toString() === fieldName.toUpperCase();
            });

            if(toReturn){
                resolve((toReturn[0]).key);
            } else {
                reject("Cannot find epic link custom field");
            }
        });
    }

    private getAllFields(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpClient.get({url: "rest/api/2/field"},
                (err, jiraRes, body) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(JSON.parse(jiraRes.body));
                });
        });
    }
}