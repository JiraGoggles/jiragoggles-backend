const fs = require('fs');

/**
 * Created by wojt on 28.11.16.
 */

export const checkIfFileExists = async (filename: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
        fs.access(filename, fs.constants.R_OK, (err) => { err ? resolve(false) : resolve(true); });
    });
};