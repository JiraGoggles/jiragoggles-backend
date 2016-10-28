import * as express from "express";

export default (addon) => {
    const router = express.Router();

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    router.get("/", (req, res) => {
        res.format({
            "text/html": () => { res.redirect('/atlassian-connect.json'); },
            "application/json": () => { res.redirect('/atlassian-connect.json'); }
        });
    });

    // FOR TESTING PURPOSES ONLY
    // This is an example route that's used by the default "generalPage" module.
    // Verify that the incoming request is authenticated with Atlassian Connect
    router.get("/hello-world", addon.authenticate(), (req, res) => {
            res.render('hello-world', { title: 'Atlassian Connect' });
        }
    );

    // Serve the activity page
    router.get("/activity", addon.authenticate(), (req, res) => {
        res.render("activity", { title: "JIRA activity" });
    });
    
    return router;
};