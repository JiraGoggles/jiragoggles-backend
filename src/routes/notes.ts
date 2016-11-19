/**
 * Created by JJax on 19.11.2016.
 */
import * as express from "express";
import credentials from "../credentials";
import notesService from "../service/noteService";

export default (addon) => {
    const router = express.Router();
    const httpClient = addon.httpClient(credentials);

    router.get('/:id', (req, res) => {
        var sth = new notesService();
        res.send(sth.getNotes(req.params.id));
    });

    return router;
};