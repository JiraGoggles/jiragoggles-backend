export class RankService {

    constructor(private httpClient) {
    }

    public rankIssue(id, referenceId, direction: string): void {
        var requestBody = RankService.createRequestJson(id, referenceId, direction);

        this.httpClient.put({url: 'rest/agile/1.0/issue/rank', json: requestBody},
            (error, response, body) => {
                if (response.statusCode !== 204) {
                    console.log(`rest/agile/1.0/issue/${id}/rank ` + response.statusCode + " " + error);
                    console.log(body);
                }
            });
    }

    public rankEpic(id, referenceId, direction: string): void {

        direction = RankService.capitalizeFirstLetter(direction);
        this.httpClient.put({url: `/rest/agile/1.0/epic/${id}/rank`,
                json: JSON.parse(`{"rank${direction}Epic": "${referenceId}"}`)},
            (error, response, body) => {
                if (response.statusCode !== 204) {
                    console.log(`rest/agile/1.0/epic/${id}/rank ` + response.statusCode + " " + error);
                    console.log(body);
                }
            });

    }

    private static createRequestJson(id, referenceId, direction: string): JSON {
        direction = RankService.capitalizeFirstLetter(direction);
        var result = JSON.parse(`{"issues": ["${id}"], "rank${direction}Issue": "${referenceId}"}`);
        return result;
    }

    private static capitalizeFirstLetter(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
}