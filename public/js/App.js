import NoteView from "./NoteView.js";
import NoteAPI from "./NoteAPI.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NoteView(root, this._handlers());

    // *
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NoteAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNotes(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisiblity(notes.length > 0); // true or false
  }

  _setActiveNotes(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id == noteId);
        this._setActiveNotes(selectedNote);
      },

      onNoteSave: () => {
        const newNote = {
          title: "New Note!",
          description: "Take a note...",
        };

        NoteAPI.saveNote(newNote);
        this._refreshNotes();
      },

      onNoteEdit: (title, description) => {
        NoteAPI.saveNote({
          id: this.activeNote.id,
          title,
          description,
        });

        this._refreshNotes();
      },

      onNoteDelete: (noteId) => {
        NoteAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
