import * as express from "express";
import AuthMiddleware from '../auth/authMiddleware';
import cardRoute from "./card";
import jqlRoute from "./jql";

export default (addon) => {
    const apiRouter = express.Router();
    const authMiddleware = new AuthMiddleware(addon);

    apiRouter.use(authMiddleware.getAsExpressMiddleware());
    apiRouter.use("/card", cardRoute(addon));
    apiRouter.use("/jql", jqlRoute(addon));

    const mainRouter = express.Router();
    mainRouter.use('/api', apiRouter);

    mainRouter.get("/main", authMiddleware.getAsExpressMiddleware(), (req, res) => {
        res.render("index", { title: "Jira Goggles" });
    });

    return mainRouter;
};