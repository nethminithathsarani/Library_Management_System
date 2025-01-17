import React, { useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './addBooks.css';

export default function AddBooks() {
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    publicationYear: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

 
    console.log('Book details:', bookDetails);
    alert('Book added successfully!');

   
    setBookDetails({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      publicationYear: '',
    });
  };

  return (
    <div>
      <Navigation />
      <div className="add-books-container">
        <h1 className="page-title">Add a New Book</h1>
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
            <select
              id="genre"
              name="genre"
              value={bookDetails.genre}
              onChange={handleChange}
              required
            >
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
            <label htmlFor="publicationYear">Publication Year:</label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={bookDetails.publicationYear}
              onChange={handleChange}
              placeholder="Enter publication year"
              required
            />
          </div>
          <button type="submit" className="submit-button">Add Book</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

