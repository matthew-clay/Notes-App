export default class NoteView {
  constructor(
    root,
    { onNoteSelect, onNoteSave, onNoteEdit, onNoteDelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteSave = onNoteSave;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
        <section class="w-72 p-4 border-r-2 divide-solid border-gray-400 flex-shrink-0 overflow-y-auto notes-sidebar">
          <button class="w-full bg-blue-500 hover:bg-blue-600 transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none border-none rounded-lg text-white cursor-pointer text-xl font-bold mb-5 py-3 notes-btn">
            Save Note
          </button>
          <div class="notes-list"></div>
        </section>
        <section class="flex flex-col px-12 py-8 flex-grow preview">
          <input class="w-full border-none outline-none title text-5xl font-bold" type="text" placeholder="Enter a new note..."/>
          <textarea class="w-full border-none outline-none flex-grow text-xl leading-6 mt-8 resize-none description">Take note...</textarea>
        </section>
    `;

    const btnSaveTag = this.root.querySelector(".notes-btn");
    const inputTitleTag = this.root.querySelector(".title");
    const txtareaDescriptionTag = this.root.querySelector(".description");

    btnSaveTag.addEventListener("click", () => {
      this.onNoteSave();
    });

    [inputTitleTag, txtareaDescriptionTag].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        // blur event fires when user lost "focus" in inputs tag
        const updatedTitle = inputTitleTag.value.trim();
        const updatedDescription = txtareaDescriptionTag.value.trim();

        this.onNoteEdit(updatedTitle, updatedDescription);
      });
    });

    // console.log(this._createListItemHTML(1, "New Note", "Note-101", new Date()));

    // hide the note preview by default
    this.updateNotePreviewVisiblity(false);
  }

  _createListItemHTML(id, title, description, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <div class="cursor-pointer flex flex-col notes-list-item" data-note-id="${id}"> <!--data-setattrib is a thing from html5-->
        <i class="fa-regular fa-trash-can text-lg text-red-600 self-end pt-1 px-3 transition hover:-translate-y-1 trash-icon"></i>
        <h6 class="notes-title text-base p-3">${title}</h6>
        <p class="notes-description select-none text-sm px-3">
          ${description.substring(0, MAX_BODY_LENGTH)}
          ${description.length > MAX_BODY_LENGTH ? "..." : ""}
        </p>
        <span class="notes-datetime p-3 select-none font-semibold text-xs text-right text-gray-600">
          ${updated.toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </span>
      </div>
    `;
  }

  updateNoteList(notes) {
    const notesListContainerTag = this.root.querySelector(".notes-list");

    // emptyList
    notesListContainerTag.innerHTML = "";

    for (const note of notes) {
      const createNotes = this._createListItemHTML(
        note.id,
        note.title,
        note.description,
        new Date(note.updated)
      );

      notesListContainerTag.insertAdjacentHTML("beforeend", createNotes);
    }

    // add select/delete events for each list item
    const notesListItemsTag =
      notesListContainerTag.querySelectorAll(".notes-list-item");

    const trashIconTag = notesListContainerTag.querySelectorAll(".trash-icon");

    notesListItemsTag.forEach((notesListItem) => {
      notesListItem.addEventListener("click", () => {
        this.onNoteSelect(notesListItem.dataset.noteId); // [data-notes-id]
      });

      notesListItem.addEventListener("dblclick", () => {
        const doDelete = confirm("Are you sure you want to delete this note?");

        if (doDelete) {
          this.onNoteDelete(notesListItem.dataset.noteId);
        }
      });

      // console.log(trashIconTag);

      // trashIconTag.forEach((item) => {
      //   item.addEventListener("click", () => {
      //     this.onNoteDelete(notesListItem.dataset.noteId);
      //   });
      // });
    });
  }

  updateActiveNote(note) {
    this.root.querySelector(".title").value = note.title;
    this.root.querySelector(".description").value = note.description;

    this.root.querySelectorAll(".notes-list-item").forEach((notesListItem) => {
      notesListItem.classList.remove("selected");
    });

    this.root
      .querySelector(`.notes-list-item[data-note-id="${note.id}"]`)
      .classList.add("selected");
  }

  updateNotePreviewVisiblity(visible) {
    this.root.querySelector(".preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
