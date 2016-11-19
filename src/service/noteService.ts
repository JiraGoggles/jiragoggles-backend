/**
 * Created by JJax on 19.11.2016.
 */

import NotesWebModel from '../model/notesWebModel';

export default class NoteService {

    public getNotes(id: number): NotesWebModel {
        return { id: 10, key: "XD" };
    }
}