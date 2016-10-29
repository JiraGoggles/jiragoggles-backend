import * as express from "express";

// import all the sub-routes
import projectsRoute from "./projects";
import usersRoute from "./users";

export default (addon) => {
    // the main router responsible for handling all requests
    const router = express.Router();
    // make the router use all the sub-routes under specified paths
    router.use("/projects", projectsRoute(addon));
    router.use("/users", usersRoute(addon));

    // Serve the main page
    router.get("/", (req, res) => {
        res.render("index", { title: "Jira Goggles" });
    });

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    // router.get("/", (req, res) => {
    //     res.format({
    //         "text/html": () => { res.redirect('/atlassian-connect.json'); },
    //         "application/json": () => { res.redirect('/atlassian-connect.json'); }
    //     });
    // });
    
    return router;
};