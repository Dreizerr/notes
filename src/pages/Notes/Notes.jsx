import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import "./Notes.scss";
import { FireBase } from "../../API/firebase";
import NotesControlls from "../../components/NotesControlls";
import Greetings from "../../components/greetings/Greetings";
import NotesList from "../../components/NotesList";
import Button from "../../components/UI/Button/Button";

import useFetching from "../../hooks/useFetching";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("Все заметки");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const categoriedNotes = useMemo(() => {
    if (currentCategory === "Все заметки") {
      return notes;
    }
    return notes.filter((note) => {
      return note.category === currentCategory;
    });
  }, [currentCategory, notes]);

  const sortedNotes = useMemo(() => {
    return categoriedNotes.filter((note) => {
      return (note.title + note.body).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, categoriedNotes]);

  const [fetchNotes, isNotesLoading, isFetchingNotesError] = useFetching(async () => {
    const userNotes = await FireBase.getAllNotes();
    setNotes([...userNotes]);
  });

  const [fetchCategories, isCategoriesLoading, isFetchingCategoriesError] = useFetching(async () => {
    const { categories } = await FireBase.getCategories();
    setAllCategories([...categories]);
  });

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <main className="main">
        <Greetings />
        <section className="notes">
          <div className="notes__container">
            <NotesControlls
              fetchCategories={fetchCategories}
              fetchNotes={fetchNotes}
              notes={notes}
              setNotes={setNotes}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
              allCategories={allCategories}
              setAllCategories={setAllCategories}
              length={sortedNotes.length}
            />
            <NotesList
              isError={isFetchingNotesError}
              isLoading={isNotesLoading}
              searchQuery={searchQuery}
              notes={sortedNotes}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Notes;
