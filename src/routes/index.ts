import * as express from "express";
import AuthMiddleware from '../auth/authMiddleware';
import cardRoute from "./card";
import jqlRoute from "./jql";
import rankRoute from "./rank";

export default (addon) => {
    const apiRouter = express.Router();
    const authMiddleware = new AuthMiddleware(addon);

    apiRouter.use(authMiddleware.getAsExpressMiddleware());
    apiRouter.use("/card", cardRoute(addon));
    apiRouter.use("/jql", jqlRoute(addon));
    apiRouter.use("/rank", rankRoute(addon));

    const mainRouter = express.Router();
    mainRouter.use('/api', apiRouter);

    mainRouter.get("/main", authMiddleware.getAsExpressMiddleware(), (req, res) => {
        res.render("index", { title: "Jira Goggles" });
    });

    return mainRouter;
};