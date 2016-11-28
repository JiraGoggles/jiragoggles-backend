import {Credentials} from './credentials';
import {extractCredentials} from "./authHelpers";
import {checkIfFileExists} from "../commons/helpers";

/**
 * Created by wojt on 25.11.16.
 */

export default class AuthMiddleware {
    private static readonly DEV_MODE = process.env.NODE_ENV === 'development' ? true : false;
    private static readonly DATABASE_FILENAME = 'store.db';
    private static readonly hardcodedCredentials: Credentials =
        { addonKey: 'jira-activity', clientKey: 'jira:f3298a41-2fd2-472c-90be-875aa6a853cf' };
    private readonly addonMiddleware;

    constructor(addon) {
        this.addonMiddleware = addon.checkValidToken();
    }

    getAsExpressMiddleware() {
        if (AuthMiddleware.DEV_MODE) {
            return (request, response, nextMiddleware) => {
                this.getDevMiddleware(request).then(() => nextMiddleware());
            };
        }
        else {
            return (request, response, nextMiddleware) => {
                this.addonMiddleware(request, response, nextMiddleware);
            };
        }
    }

    private async getDevMiddleware(request): Promise<void> {
        const exists = await checkIfFileExists(AuthMiddleware.DATABASE_FILENAME);
        if (exists) {
            const credentials = await extractCredentials('store.db');
            if (credentials) {
                this.addCredentialsToRequest(request, credentials);
            }
            else { // if the credentials haven't been found in the database, resort to hardcodedCredentials
                this.addCredentialsToRequest(request, AuthMiddleware.hardcodedCredentials);
            }
        }
    }

    private addCredentialsToRequest(request: any, credentials: Credentials): void {
        request.context.addonKey = credentials.addonKey;
        request.context.clientKey = credentials.clientKey;
    }
}