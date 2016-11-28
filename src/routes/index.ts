import * as express from "express";
import AuthMiddleware from '../auth/authMiddleware';

// import all the sub-routes
import projectsRoute from "./projects";
import usersRoute from "./users";
import cardRoute from "./card";
import jqlRoute from "./jql";

export default (addon) => {
    // a router responsible for handling '/api/*' requests only
    const apiRouter = express.Router();

    // use authMiddleware for '/api/*' requests requests only
    // any other request does not have to be (and in the case
    // of /atlassian-connect.json should not be) authenticated
    const authMiddleware = new AuthMiddleware(addon);
    apiRouter.use(authMiddleware.getAsExpressMiddleware());

    // make apiRouter use all the sub-routes under specified paths
    apiRouter.use("/projects", projectsRoute(addon));
    apiRouter.use("/users", usersRoute(addon));
    apiRouter.use("/card", cardRoute(addon));
    apiRouter.use("/jql", jqlRoute(addon));

    const mainRouter = express.Router();
    // use apiRouter as mainRouter's sub-router
    mainRouter.use('/api', apiRouter);

    // any non '/api/*' request is handled by mainRouter
    mainRouter.get("/", (req, res) => {
        res.render("index", { title: "Jira Goggles" });
    });

    return mainRouter;
};