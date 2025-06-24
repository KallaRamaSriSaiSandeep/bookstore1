import { useEffect, useState } from "react";
import axios from "axios";
import "./BookList.css";

const API = "http://localhost:9090/books";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: ""
  });

  /* ──────────────────────────────
     INITIAL LOAD
  ────────────────────────────── */
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await axios.get(API);
    setBooks(data);
  };

  /* ──────────────────────────────
     ADD NEW BOOK
  ────────────────────────────── */
  const addBook = async () => {
    const { title, author, price, genre } = form;
    if (!title || !author || !price || !genre) return;

    const newBook = {
      title,
      author,
      price: parseFloat(price),
      genre
    };

    const { data: saved } = await axios.post(API, newBook);

    // ① append immediately so it appears without re-fetch
    setBooks([...books, saved]);

    // ② clear the form
    setForm({ title: "", author: "", price: "", genre: "" });
  };

  /* ──────────────────────────────
     TOGGLE COMPLETED
  ────────────────────────────── */
  const toggleCompleted = async (id) => {
    const { data: updated } = await axios.patch(`${API}/${id}/complete`);
    // replace the old record in local state
    setBooks(books.map((b) => (b.id === id ? updated : b)));
  };

  /* ──────────────────────────────
     DELETE BOOK
  ────────────────────────────── */
  const deleteBook = async (id) => {
    await axios.delete(`${API}/${id}`);
    setBooks(books.filter((b) => b.id !== id));
  };

  return (
    <div className="book-container">
      <h2>📚 Book Store</h2>

      {/* Form */}
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      {/* List */}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <span
              style={{
                textDecoration: book.completed ? "line-through" : "none",
                opacity: book.completed ? 0.6 : 1
              }}
            >
              <strong>{book.title}</strong> by {book.author} — ₹{book.price} [
              {book.genre}]
            </span>

            <div className="actions">
              <button onClick={() => toggleCompleted(book.id)}>
                {book.completed ? "Undo" : "Book Completed"}
              </button>
              <button onClick={() => deleteBook(book.id)}>Delete Book</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
