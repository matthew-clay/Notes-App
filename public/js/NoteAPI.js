export default class NoteAPI {
  static getAllNotes() {
    // getnode from localstorage
    const notes = JSON.parse(localStorage.getItem("mynotes") || "[]"); // it will return notes if it has in localstorge or will return a empty array

    // sort note via Date() and then return
    const updatedNote = notes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });

    return updatedNote;
  }

  static saveNote(noteToSave) {
    const notes = NoteAPI.getAllNotes();

    // check for randomId
    const existing = notes.find((note) => note.id == noteToSave.id);

    // Edit/ Update
    if (existing) {
      existing.title = noteToSave.title;
      existing.description = noteToSave.description;
      existing.updated = new Date().toISOString();
    } else {
      noteToSave.id = Math.floor(Math.random() * 1000000);
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("mynotes", JSON.stringify(notes));
  }

  static deleteNote(id) {
    const notes = NoteAPI.getAllNotes();
    // notes.filter((note) => console.log(note.id));

    const filteredNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("mynotes", JSON.stringify(filteredNotes));
  }
}
