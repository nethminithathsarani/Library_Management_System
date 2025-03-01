import { useState } from "react";
import Navigation from "../Components/Navigation";
import Footer from "../Components/Footer";
import "./addBooks.css";

export default function ManageBooks() {
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    publicationDate: "",
  });

  const [isBorrowing, setIsBorrowing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "publicationDate") {
      const formattedDate = value.split("-").reverse().join("/"); // Convert YYYY-MM-DD to DD/MM/YYYY
      setBookDetails({ ...bookDetails, [name]: formattedDate });
    } else {
      setBookDetails({ ...bookDetails, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book details:", bookDetails);
    alert(isBorrowing ? "Book borrowed successfully!" : "Book added successfully!");

    setBookDetails({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      publicationDate: "",
    });
  };

  return (
    <div>
      <Navigation />
      <div className={`manage-books-container ${isBorrowing ? "borrowing-theme" : "add-book-theme"}`}>
        <h1 className="page-title">{isBorrowing ? "Borrow a Book" : "Add a New Book"}</h1>
        <form className="add-book-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Book Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={bookDetails.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={bookDetails.author}
              onChange={handleChange}
              placeholder="Enter author's name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select id="genre" name="genre" value={bookDetails.genre} onChange={handleChange} required>
              <option value="">Select Genre</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="fantasy">Fantasy</option>
              <option value="biography">Biography</option>
              <option value="science">Science</option>
              <option value="history">History</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN:</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={bookDetails.isbn}
              onChange={handleChange}
              placeholder="Enter book ISBN"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="publicationDate">Publication Date:</label>
            <input
              type="date"
              id="publicationDate"
              name="publicationDate"
              value={bookDetails.publicationDate.split("/").reverse().join("-")} // Convert back to YYYY-MM-DD for input
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]} // Max date is today
            />
          </div>
          <button type="submit" className="submit-button">
            {isBorrowing ? "Borrow Book" : "Add Book"}
          </button>
        </form>
        <button onClick={() => setIsBorrowing(!isBorrowing)}>
          {isBorrowing ? "Switch to Add Book" : "Switch to Borrowing"}
        </button>
      </div>
      <Footer />
    </div>
  );
}
