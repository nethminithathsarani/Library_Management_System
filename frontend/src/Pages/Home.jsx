import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { booksAPI } from '../utils/api';
import './home.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const bookList = await booksAPI.getAll();
        setBooks(bookList);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredBooks = normalizedSearchQuery
    ? books.filter((book) => {
        const title = book.title?.toLowerCase() || '';
        const author = book.author?.toLowerCase() || '';
        const genre = book.genre?.toLowerCase() || '';
        const isbn = book.isbn?.toLowerCase() || '';

        return [title, author, genre, isbn].some((field) => field.includes(normalizedSearchQuery));
      })
    : books;

  const popularBooks = filteredBooks.slice(0, 5);

  const getBookImage = (book) => {
    // Prefer coverImageUrl from the database; fallback to a default image
    return book.coverImageUrl || '/src/assets/Images/homeLibrary.jpg';
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedBook(null);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const renderBookCard = (book) => (
    <div
      className={`book-card${selectedBook?.id === book.id ? ' selected' : ''}`}
      key={book.id}
      role="button"
      tabIndex={0}
      onClick={() => handleBookSelect(book)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleBookSelect(book);
        }
      }}
    >
      <img
        src={getBookImage(book)}
        alt={book.title}
        className="book-image"
      />
      <p className="book-title">{book.title}</p>
      <p className="book-author">{book.author}</p>
    </div>
  );

  return (
    <div>
      <Navigation />

      <div className="homepage-photo-container">
        <img
          src="/src/assets/Images/homeLibrary.jpg"
          alt="Library"
          className="homeLibrary"
        />

        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Search books"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          {searchQuery && (
            <button type="button" className="search-clear-button" onClick={handleSearchClear}>
              Clear
            </button>
          )}
        </form>

        {searchQuery && (
          <p className="search-result-text">
            Showing {filteredBooks.length} result{filteredBooks.length === 1 ? '' : 's'} for &quot;{searchQuery.trim()}&quot;
          </p>
        )}
      </div>

      <section className="popular-books-section">
        <h2 className="section-title">Popular Books</h2>
        <div className="books-container">
          {popularBooks.length > 0 ? (
            popularBooks.map((book) => renderBookCard(book))
          ) : (
            <p>No books available.</p>
          )}
        </div>
      </section>

      <section className="all-books-section">
        <h2 className="section-title">All Books</h2>
        <div className="books-container">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => renderBookCard(book))
          ) : (
            <p>{searchQuery ? 'No books match your search.' : 'No books available.'}</p>
          )}
        </div>
      </section>

      {isModalOpen && selectedBook && (
        <div
          className="book-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Book details"
          onClick={closeModal}
        >
          <div
            className="book-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="book-modal-close"
              onClick={closeModal}
              aria-label="Close book details"
            >
              ×
            </button>

            <div className="book-modal-content">
              <img
                src={getBookImage(selectedBook)}
                alt={selectedBook.title}
                className="book-modal-image"
              />
              <div className="book-modal-details">
                <h3>{selectedBook.title}</h3>
                <p><strong>Author:</strong> {selectedBook.author}</p>
                <p><strong>Genre:</strong> {selectedBook.genre || 'Not specified'}</p>
                <p><strong>ISBN:</strong> {selectedBook.isbn || 'Not specified'}</p>
                <p><strong>Publication Date:</strong> {selectedBook.publicationDate || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}





