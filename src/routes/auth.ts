import * as express from "express";

export default () => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.send({
            token: res.locals.token,
            hostBaseUrl: res.locals.hostBaseUrl
        });
    });

    return router;
};