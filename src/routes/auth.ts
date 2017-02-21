import * as express from "express";
import AuthMiddleware from "../auth/authMiddleware";

export default (addon) => {
    const router = express.Router();
    const authMiddleware = new AuthMiddleware(addon);

    router.get("/", (req, res) => {
        res.send({
            token: res.locals.token,
            hostBaseUrl: res.locals.hostBaseUrl
        });
    });

    return router;
};