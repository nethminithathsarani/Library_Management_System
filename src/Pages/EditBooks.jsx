
import React, { useState, useEffect } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './editBooks.css';

export default function EditDeleteBooks() {
  const [books, setBooks] = useState([]);


  useEffect(() => {
    fetch('/api/books') 
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleEdit = (bookId) => {
    console.log('Edit book with ID:', bookId);
    
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setBooks(books.filter((book) => book.id !== bookId));
          } else {
            console.error('Error deleting book');
          }
        })
        .catch((error) => console.error('Error deleting book:', error));
    }
  };

  return (
    <div>
      <Navigation />
      <div className="edit-delete-container">
        <h1 className="page-title">Edit or Delete Books</h1>
        <table className="books-table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Year Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.year}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(book.id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No books available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
